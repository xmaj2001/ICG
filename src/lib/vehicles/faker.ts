import { Vehicle, Badge, Fuel, Transmission, Category, Status } from "./type";
import { faker } from "@faker-js/faker";

export const generateVehicle = (): Vehicle => {
  return {
    id: faker.string.uuid(),
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.date.past({ years: 15 }).getFullYear(),
    price: faker.number.int({ min: 10000, max: 150000 }),
    fuel: faker.helpers.enumValue(Fuel),
    engineSize: faker.number.float({ min: 1.0, max: 5.0, fractionDigits: 1 }),
    transmission: faker.helpers.enumValue(Transmission),
    category: faker.helpers.enumValue(Category),
    badge: faker.helpers.maybe(() => faker.helpers.enumValue(Badge), {
      probability: 0.3,
    }),
    status: faker.helpers.enumValue(Status),
    images: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () =>
      faker.image.url({}),
    ),
    description: faker.lorem.paragraphs(2),
    createdAt: faker.date.past().toDateString(),
    updatedAt: faker.date.past().toDateString(),
  };
};

export const generateVehicles = (count: number = 10): Vehicle[] => {
  faker.seed(42);
  return faker.helpers.multiple(generateVehicle, {
    count,
  });
};
