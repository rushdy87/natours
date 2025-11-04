const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    results: 0,
    data: {
      users: [],
    },
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    data: {
      user: {},
    },
  });
};

const createUser = (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      user: {},
    },
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    data: {
      user: {},
    },
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  res.status(204).json({
    status: "success",
    data: null,
  });
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
