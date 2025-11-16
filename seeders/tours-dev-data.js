// Script used to populate the database with initial data.
//* to run import script: node --env-file config/.env ./seeders/tours-dev-data.js --import
//! to run delete script: node --env-file config/.env ./seeders/tours-dev-data.js --delete

import fs from 'fs';
import 'colors';

import connectDB from '../config/db.js';
import Tour from '../src/models/tour-model.js';

await connectDB();

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${process.cwd()}/dev-data/data/tours.json`, 'utf-8'),
);

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!'.green);
  } catch (err) {
    console.error(err);
  }
  process.exit(1);
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!'.green);
  } catch (err) {
    console.error(err);
  }
  process.exit(1);
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
