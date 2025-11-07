import Tour from '../models/tour-model.js';
import {
  buildQueryParams,
  pageAndLimit,
  parseListParams,
} from '../utils/query-params.js';

const getAllTours = async (req, res) => {
  try {
    // filtering
    const queryParams = buildQueryParams({ ...req.query });

    // build query
    let query = Tour.find(queryParams);

    // sorting
    if (req.query.sort) {
      query = query.sort(parseListParams(req.query.sort));
    } else {
      query = query.sort('-createdAt');
    }

    // field limiting
    if (req.query.fields) {
      query = query.select(parseListParams(req.query.fields));
    } else {
      query = query.select('-__v');
    }

    // pagination
    const { skip, limit } = pageAndLimit(req.query.page, req.query.limit);
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments(queryParams);
      if (skip >= numTours) {
        throw new Error('This page does not exist');
      }
    }

    // execute query
    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getTourById = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export default {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
};
