import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';
import User from '../models/user-model.js';

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

export { protect };

// A common practice is to send a token in the Authorization header using the Bearer schema.
// Example: Authorization: Bearer <token>
// This way, the server can easily extract the token from the header for verification.
// In this middleware, you would typically extract the token from the request headers,
// verify it using a library like jsonwebtoken, and then check if the user associated
// with the token still exists and whether they have changed their password since the token was issued.
