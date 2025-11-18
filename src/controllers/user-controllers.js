import User from '../models/user-model.js';
import { catchAsync } from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';
import { filterObj } from '../utils/object-utils.js';
import factory from '../utils/handler-factory.js';

const getAllUsers = factory.getAll(User);

const getUserById = factory.getOne(User);

const createUser = (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};

const updateUser = factory.updateOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // 4) Send response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteUser = factory.deleteOne(User);

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateMe,
  deleteUser,
  deleteMe,
};
