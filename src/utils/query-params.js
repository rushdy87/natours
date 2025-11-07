export const excludeFields = ['page', 'sort', 'limit', 'fields'];
export const mongooseOperators = ['gte', 'gt', 'lte', 'lt'];

export const removeExcludedFields = (queryParams) => {
  excludeFields.forEach((field) => delete queryParams[field]);
  return queryParams;
};

export const replaceMongooseOperators = (queryParams) => {
  let queryStr = JSON.stringify(queryParams);
  mongooseOperators.forEach((operator) => {
    const regex = new RegExp(`\\b${operator}\\b`, 'g');
    queryStr = queryStr.replace(regex, `$${operator}`);
  });
  return JSON.parse(queryStr);
};

export const buildQueryParams = (queryParams) => {
  let filteredParams = removeExcludedFields({ ...queryParams });
  filteredParams = replaceMongooseOperators(filteredParams);
  return filteredParams;
};

export const parseListParams = (paramString) =>
  paramString.split(',').join(' ');

export const pageAndLimit = (page = 1, limit = 100) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  return { skip, limit: limitNum };
};
