import express from "express";
import "colors";
import morgan from "morgan";

import tourRouter from "./routers/tour-routes.js";
import userRouter from "./routers/user-routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Mounting the routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

export default app;

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
