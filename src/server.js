import app from './app.js';
import connectDB from '../config/db.js';

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

// Connect to the database
await connectDB();

const server = app.listen(PORT, () => {
  console.log(
    'Server is up and running on port ' +
      `${PORT}`.red +
      ' on ' +
      `${app.get('env')}`.green +
      ' mode',
  );
});

/* Notes about separating app and server:
 * 1. Separation of Concerns: By separating the app configuration from the server startup,
 *    you maintain a clear distinction between the application logic and the server logic.
 *    This makes the codebase easier to understand and maintain.
 *
 * 2. Testing: When the app and server are separated, it becomes easier to write tests for the app
 *    without needing to start the server. You can import the app module directly into your test files
 *    and test the routes and middleware in isolation.
 *
 * 3. Flexibility: Separating the app from the server allows you to use different server configurations
 *    or even different server frameworks if needed, without changing the core application logic.
 *
 * 4. Reusability: The app module can be reused in different contexts, such as serverless functions,
 *    without being tightly coupled to a specific server implementation.
 *
 */
