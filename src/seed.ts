#!/usr/bin/env bun

import { faker } from '@faker-js/faker';

import { client } from './lib/mongo';
import { User } from './types/user';

interface Customer extends User {
  country: string;
  city: string;
  lastLogin: Date;
  isActive: boolean;
}

await client.connect();

await seed();

await client.close();

async function seed() {
  // skip if users already exists
  const users = await client.db().collection<User>("users").find().toArray();
  if (users.length > 0) {
    console.log("🚨 Users already exist, skipping population");
    return;
  }

  const customers: Customer[] = [];

  // Create 500 fake users
  for (let i = 0; i < 500; i++) {
    const customer: Customer = {
      _id: faker.string.uuid(),
      _created_at: faker.date.past(),
      _updated_at: faker.date.past(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      purchases: faker.number.int({ min: 0, max: 50 }),
      country: faker.location.country(),
      city: faker.location.city(),
      lastLogin: faker.date.recent(),
      isActive: faker.datatype.boolean(),
    };
    customers.push(customer);
  }

  // Insert all users at once
  const result = await client
    .db()
    .collection<Customer>("users")
    .insertMany(customers);

  console.log(`✨ Successfully inserted ${result.insertedCount} users`);
}
