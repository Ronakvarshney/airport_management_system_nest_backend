import { USER_ROLES } from 'src/user/schema/user.schema';

export interface PayloadInterface {
  sub: string;
  email: string;
  role: USER_ROLES;
}
