const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: 0,
    data: {
      tours: [],
    },
  });
};

const getTourById = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    data: {
      tour: {},
    },
  });
};

const createTour = (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      tour: {},
    },
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    data: {
      tour: {},
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;
  res.status(204).json({
    status: "success",
    data: null,
  });
};

export { getAllTours, getTourById, createTour, updateTour, deleteTour };
