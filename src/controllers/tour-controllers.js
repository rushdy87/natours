const checkId = (req, res, next, val) => {
  console.log(`Tour ID received: ${val}`.red.bgWhite);
  next();
};

const checkBody = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 0,
    data: {
      tours: [],
    },
  });
};

const getTourById = (req, res) => {
  // const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: {
      tour: {},
    },
  });
};

const createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      tour: {},
    },
  });
};

const updateTour = (req, res) => {
  // const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: {
      tour: {},
    },
  });
};

const deleteTour = (req, res) => {
  // const { id } = req.params;
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export default {
  checkId,
  checkBody,
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
};
