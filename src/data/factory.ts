import { faker } from '@faker-js/faker';

/** Data factories: fresh, realistic test data, so tests don't share fixtures or state. */

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

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** A checkout customer. Override any field: `makeCustomer({ postalCode: '' })`. */
export function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode('#####'),
    ...overrides,
  };
}
