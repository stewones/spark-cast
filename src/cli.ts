#!/usr/bin/env bun

import { cast } from './cast';
import { client } from './lib/mongo';

await client.connect();

await cast();

await client.close();