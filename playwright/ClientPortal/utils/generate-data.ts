import { faker } from '@faker-js/faker';

export function generateRandomData() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    country: getRandomCountry(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    address: faker.location.streetAddress(),
    dob: generateDOB(),
    companyName: faker.company.name(),
    amount: faker.number.int({ min: 10, max: 1000 }),
  };
}

function generateDOB(): string {
  const dob = faker.date.past({ years: 50, refDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)) });
  return dob.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}

function getRandomCountry() {
  return countries[Math.floor(Math.random() * countries.length)];
}

export const countries = [
  'Australia',
  'Canada',
  'Cayman Islands',
  'Estonia',
  'Germany',
  'Gibraltar',
  'Hong Kong',
  'Ireland',
  'Malaysia',
  'Japan',
  'Luxembourg',
  'Lithuania',
  'Malta',
  'Singapore',
  'Switzerland',
  'United Kingdom',
  'United States',
];
