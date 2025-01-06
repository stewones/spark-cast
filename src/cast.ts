import {
  readdirSync,
  readFileSync,
} from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import { join } from 'path';

import {
  confirm,
  intro,
  outro,
  select,
  spinner,
} from '@clack/prompts';

import { email } from './lib/Email';
import { isProduction } from './lib/mongo';
import { Users } from './lib/Users';

// Configure marked to use synchronous parsing
marked.setOptions({ async: false });

const EMAILS_DIR = join(process.cwd(), "emails");

async function cast() {
  intro("📨 Broadcast email to audience");

  // Connect to MongoDB
  const s = spinner();
  s.start("Connecting to MongoDB...");
  try {
    s.stop(
      `Connected to MongoDB (${isProduction ? "🚨 production" : "🟢 dev"})`
    );

    // Get all verified users
    s.start("Getting verified users...");
    const users = await Users.findAll();

    s.stop(`Found ${users.length} verified users`);

    // Get available email templates
    const emailFiles = readdirSync(EMAILS_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        value: file,
        label: file.replace(".md", ""),
      }));

    // Let user select an email template
    const selectedFile = (await select({
      message: "Select an email template to send",
      options: emailFiles,
    })) as string;

    if (!selectedFile) {
      outro("Operation cancelled");
      return;
    }

    // Read and parse the email template
    const emailContent = readFileSync(join(EMAILS_DIR, selectedFile), "utf-8");
    const { data, content } = matter(emailContent);
    const { subject } = data;
    if (!subject) {
      outro("No subject found in email template");
      return;
    }

    // Convert markdown to HTML synchronously
    const htmlContent = marked.parse(content) as string;

    // Show recipients and confirm
    console.log("\nRecipients:");
    console.log("===========");

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} <${user.email}>`);
    });

    console.log("\nEmail Details:");
    console.log("=============");
    console.log(`Subject: ${subject}`);
    console.log(`Template: ${selectedFile}`);
    console.log(`Total Recipients: ${users.length}`);

    const shouldProceed = await confirm({
      message: `Are you sure you want to send this email to ${users.length} recipients?`,
    });

    if (!shouldProceed) {
      outro("Operation cancelled");
      return;
    }

    // Send emails
    s.start("Sending emails...");
    let sent = 0;
    const total = users.length;

    for (const user of users) {
      try {
        await email.send({
          to: user.email,
          subject,
          html: htmlContent,
        });
        sent++;
        s.message(`Sent ${sent}/${total} emails...`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
      }
    }
  } catch (error) {
    s.stop("Error occurred");
    console.error("Error:", error);
  } finally {
    s.stop("Sending emails...");
    outro("Done! 🎉");
  }
}

export { cast };
