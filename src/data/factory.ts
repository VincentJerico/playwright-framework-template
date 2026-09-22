import { faker } from '@faker-js/faker';

/** Data factories — generate fresh, realistic test data so tests don't share fixtures/state. */

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export function makeCheckoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
    ...overrides,
  };
}

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
