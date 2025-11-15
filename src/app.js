import express from 'express';
import 'colors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss';
import hpp from 'hpp';

import AppError from './utils/app-error.js';
import { errorHandler } from './middlewares/error-middlewares.js';

import tourRouter from './routers/tour-routes.js';
import userRouter from './routers/user-routes.js';

const app = express();

// Middleware Setup
app.use(express.json({ limit: '10kb' })); // Body parser, reading data from body into req.body

if (process.env.NODE_ENV === 'development') {
  // Logging middleware in development mode only
  app.use(morgan('dev'));
}

// Parsing URL-encoded data with extended option
app.set('query parser', 'extended');

// Setting security HTTP headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'ratingsQuantity',
      'ratingsAverage',
      'duration',
      'difficulty',
      'maxGroupSize',
      'price',
    ], // Allow multiple values for these parameters
  }),
);

// Rate limiting middleware
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again after an hour',
});
app.use('/api', limiter);

// Data Sanitization against NoSQL query injection
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') {
          // Remove MongoDB operators from strings
          obj[key] = obj[key].replace(/\$/g, '');
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      });
    }
  };

  // Only sanitize body and params, not query
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  next();
});

// Data Sanitization against XSS
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
});

// Serving static files
app.use(express.static(`${process.cwd()}/public`));
//process.cwd() gives the current working directory

// Mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling Unhandled Routes
app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global Error Handling Middleware
app.use(errorHandler);

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
