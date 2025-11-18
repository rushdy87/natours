// Script used to populate the database with initial data.
//* to run import script: node --env-file config/.env ./seeders/users-dev-data.js --import
//! to run delete script: node --env-file config/.env ./seeders/users-dev-data.js --delete

import fs from 'fs';
import 'colors';

import connectDB from '../config/db.js';
import User from '../src/models/user-model.js';

await connectDB();

// Read JSON file
const users = JSON.parse(
  fs.readFileSync(`${process.cwd()}/dev-data/data/users.json`, 'utf-8'),
);

// Import data into DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded!'.green);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data successfully deleted!'.green);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
