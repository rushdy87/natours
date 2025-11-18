//@description Run data seeder scripts for tours, users, and reviews with import or delete options
//* Usage: node runSeeder.js <-tours|-users|-reviews> <-i|-d>
// - Case 1: Import tours data
//   node runSeeder.js -tours -i
// - Case 2: Delete tours data
//   node runSeeder.js -tours -d
// - Case 3: Import users data
//   node runSeeder.js -users -i
// - Case 4: Delete users data
//  node runSeeder.js -users -d
// - Case 5: Import reviews data
//   node runSeeder.js -reviews -i
// - Case 6: Delete reviews data
//   node runSeeder.js -reviews -d

import { exec } from 'child_process';
// child_process is a built-in Node.js module, no need to install, its used to run shell commands
// exec allows us to run shell commands from Node.js
const args = process.argv.slice(2); // e.g. ['-tours', '-i']
const [target, action] = args;

if (!target || !action) {
  console.error('❌ Usage: node runSeeder.js <-tours|-users> <-i|-d>');
  process.exit(1);
}

// Map shorthand to actual script paths
const seederMap = {
  '-tours': './seeders/tours-dev-data.js',
  '-users': './seeders/users-dev-data.js',
  '-reviews': './seeders/reviews-dev-data.js',
};

// Map action flags
const actionMap = {
  '-i': '--import', // import (no --delete flag)
  '-d': '--delete', // delete
};

const seederFile = seederMap[target];
const actionFlag = actionMap[action];

if (!seederFile || actionFlag === undefined) {
  console.error('❌ Invalid arguments!');
  process.exit(1);
}

const command = `node --env-file config/.env ${seederFile} ${actionFlag}`;
console.log(`🚀 Running: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }

  // Log stderr only if it contains actual error indicators
  if (stderr && stderr.toLowerCase().includes('error')) {
    console.error(`⚠️ Error output: ${stderr}`);
    process.exit(1);
  }

  // Show any non-error stderr as warnings
  if (stderr) {
    console.warn(`⚠️ Warning: ${stderr}`);
  }

  console.log(`✅ Success:\n${stdout}`);
});
