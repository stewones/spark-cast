import SparkPost, { InlineContent } from 'sparkpost';

import { isProduction } from './mongo';

export class Email {
  #spark: SparkPost;
  #sandbox: boolean;
  #openTracking: boolean;
  #clickTracking: boolean;
  #description: string;
  #campaignId: string;

  constructor({
    apiKey = process.env["SPARKPOST_API_KEY"]!,
    sandbox = true,
    openTracking = true,
    clickTracking = true,
    description,
    campaignId,
  }: {
    apiKey?: string;
    sandbox?: boolean;
    openTracking?: boolean;
    clickTracking?: boolean;
    description?: string;
    campaignId?: string;
  }) {
    this.#spark = new SparkPost(apiKey);
    this.#sandbox = sandbox;
    this.#openTracking = openTracking;
    this.#clickTracking = clickTracking;
    this.#description = description || "";
    this.#campaignId = campaignId || "";
  }

  send({
    to,
    subject,
    html,
    text,
    replyTo = process.env["EMAIL_REPLY_TO"]!,
    from = {
      name: process.env["EMAIL_FROM_NAME"]!,
      email: process.env["EMAIL_FROM_EMAIL"]!,
    },
    transactional = true,
    cc, // @todo
    bbc, // @todo
  }: {
    to: string | { name: string; email: string };
    subject: string;
    html?: string;
    text?: string;
    cc?: string[];
    bbc?: string[];
    replyTo?: string;
    from?: { name: string; email: string };
    transactional?: boolean;
  }) {
    const content:
      | InlineContent
      | { template_id: string; use_draft_template?: boolean | undefined }
      | { email_rfc822: string } = {
      from: {
        name: from.name,
        email: from.email,
      },
      subject: subject,
      html,
      text,
      reply_to: replyTo,
      // @todo implement cc and bbc
    };

    const recipients =
      typeof to === "string" ? [{ address: { email: to } }] : [{ address: to }];

    return this.#sandbox
      ? delay(10)
      : this.#spark.transmissions.send({
          options: {
            transactional,
            sandbox: false,
            open_tracking: this.#openTracking,
            click_tracking: this.#clickTracking,
          },
          substitution_data: {},
          content,
          recipients,
          description: this.#description,
          campaign_id: this.#campaignId,
        });
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const email = new Email({
  sandbox: !isProduction,
});
