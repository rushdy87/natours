//@description Run data seeder scripts for tours or users with import or delete options
//* Usage: node runSeeder.js <-tours|-users> <-i|-d>
//* Example to import tours: node runSeeder.js -tours -i
//* Example to delete users: node runSeeder.js -users -d

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
    return;
  }
  if (stderr) {
    console.error(`⚠️ Stderr: ${stderr}`);
    return;
  }
  console.log(`✅ Success:\n${stdout}`);
});
