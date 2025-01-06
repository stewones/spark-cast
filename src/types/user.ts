export interface User {
  _id: string;
  _created_at: Date;
  _updated_at: Date;
  _expires_at?: Date;
  name: string;
  email: string;
  purchases: number;
}
