import User from '../models/user-model.js';
import { catchAsync } from '../utils/catch-async.js';

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

const deleteUser = (req, res) => {
  // const { id } = req.params;
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
