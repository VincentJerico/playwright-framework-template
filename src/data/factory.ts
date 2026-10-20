import { faker } from '@faker-js/faker';

/** Data factories — generate fresh, realistic test data so tests don't share fixtures/state. */

export interface Credentials {
  username: string;
  password: string;
}

export function makeRandomCredentials(): Credentials {
  return {
    username: faker.internet.username().toLowerCase(),
    password: faker.internet.password({ length: 12 }),
  };
}
