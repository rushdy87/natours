import User from '../models/user-model.js';
import { catchAsync } from '../utils/catch-async.js';

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export { signup };
