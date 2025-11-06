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
