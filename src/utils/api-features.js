// @description: A class to handle API features like filtering, sorting, field limiting, and pagination for Mongoose queries.
// @param {Object} query - Mongoose query object.
// @param {Object} queryString - The query string from the request (req.query).
// @returns {Object} - The modified query object with applied features.

export default class APIFeatures {
  static excludedFields = ['page', 'sort', 'limit', 'fields'];

  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Method to apply filtering based on query parameters
  filter() {
    const queryObj = { ...this.queryString };
    this.excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Method to apply sorting based on query parameters
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Method to limit fields in the response based on query parameters
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // Method to paginate results based on query parameters
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
