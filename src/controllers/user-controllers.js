import User from '../models/user-model.js';
import { catchAsync } from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';
import { filterObj } from '../utils/object-utils.js';

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

const getUserById = (req, res) => {
  // const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: {
      user: {},
    },
  });
};

const createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      user: {},
    },
  });
};

const updateUser = (req, res) => {
  // const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: {
      user: {},
    },
  });
};

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

const deleteUser = (req, res) => {
  // const { id } = req.params;
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateMe,
  deleteUser,
};
