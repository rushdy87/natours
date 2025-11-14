// authorization-middlewares.js
// @description    Authorization middlewares for protecting routes and restricting access based on user roles.
// @module         middlewares/authorization-middlewares.js
// @requires      util
// @requires      jsonwebtoken
// @requires      ../utils/catch-async.js
// @requires      ../utils/app-error.js
// @requires      ../models/user-model.js
// @access         Private
// @route          N/A
// Usage          Add 'protect' and 'restrictTo' as middlewares to routes that need protection and role-based access control.

import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';
import User from '../models/user-model.js';

// @description    Protect routes middleware
// @access         Private
// @route          N/A
// Usage          Add 'protect' as a middleware to any route that needs protection
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there..
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verification token..
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists..
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued..
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // Putting user data on req object
  req.user = currentUser;

  // GRANT ACCESS TO PROTECTED ROUTE
  next();
});

// @description    Restrict to specific roles middleware
// @access         Private
// @route          N/A
// Usage          Add 'restrictTo' as a middleware to any route that needs role-based access control
// Example: restrictTo('admin', 'lead-guide')
// Notes:
//* 1) This middleware should be used after the 'protect' middleware.
// * 2) It checks if the logged-in user's role is included in the allowed roles for the route.
// * 3) If not, it throws a 403 Forbidden error.
// * 4) You can pass multiple roles as arguments to allow access to any of those roles.
// * 5) This pattern - function returning a function - is known as a closure in JavaScript.
// *    It allows us to create a middleware that can be customized with different parameters.
// * 6) Make sure to handle errors properly in your application to provide meaningful feedback to users.
const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to preform this action', 403),
      );
    }
    next();
  };

export { protect, restrictTo };

// A common practice is to send a token in the Authorization header using the Bearer schema.
// Example: Authorization: Bearer <token>
// This way, the server can easily extract the token from the header for verification.
// In this middleware, you would typically extract the token from the request headers,
// verify it using a library like jsonwebtoken, and then check if the user associated
// with the token still exists and whether they have changed their password since the token was issued.
