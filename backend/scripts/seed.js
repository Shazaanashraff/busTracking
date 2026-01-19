require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Bus = require('../src/models/Bus');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Bus.deleteMany({});
    console.log('Cleared existing data');

    // Create driver
    const driver = await User.create({
      name: 'Test Driver',
      email: 'driver@test.com',
      password: 'password123',
      role: 'driver'
    });
    console.log('Created driver:', driver.email);

    // Create regular user
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user'
    });
    console.log('Created user:', user.email);

    // Create buses
    const buses = await Bus.insertMany([
      {
        busId: 'BUS001',
        busName: 'City Express 1',
        routeId: 'ROUTE_A',
        driverId: driver._id
      },
      {
        busId: 'BUS002',
        busName: 'Metro Shuttle 2',
        routeId: 'ROUTE_B',
        driverId: driver._id
      },
      {
        busId: 'BUS003',
        busName: 'Downtown Connector',
        routeId: 'ROUTE_C',
        driverId: driver._id
      }
    ]);
    console.log(`Created ${buses.length} buses`);

    console.log('\n--- Seed Complete ---');
    console.log('Driver login: driver@test.com / password123');
    console.log('User login: user@test.com / password123');
    console.log('Routes: ROUTE_A, ROUTE_B, ROUTE_C');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
