require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');

const USERNAME = 'admin';
const PASSWORD = 'sightsonchrist';

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    const existing = await Admin.findOne({ username: USERNAME });
    if (existing) {
      existing.password = PASSWORD;
      await existing.save();
      console.log(`Updated admin password for "${USERNAME}".`);
    } else {
      await Admin.create({
        username: USERNAME,
        password: PASSWORD,
        role: 'admin',
      });
      console.log(`Created admin "${USERNAME}".`);
    }
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
