import { SetMetadata } from '@nestjs/common';

// setmetadata sirf methods or classes k sth extra information attach krtha h bss..
// when we passses @Roles("admin" , "client") so its comes in this roles : string[] array..

export const ROLES_KEYS = 'roles';
export const Roles = (...roles: string[]) => {
  return SetMetadata(ROLES_KEYS, roles);
};
