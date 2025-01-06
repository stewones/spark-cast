import { MONGO_QUERY } from '../query';
import { User } from '../types/user';
import { client } from './mongo';

export class Users {
  static async findAll() {
    const users = await client
      .db()
      .collection<User>(MONGO_QUERY.collection)
      .find(MONGO_QUERY.filter)
      .toArray();

    return users.map(MONGO_QUERY.transform);
  }
}
