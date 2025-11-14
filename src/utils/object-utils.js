// @desc    Filter an object to only include allowed fields
// @param   {Object} obj - The object to be filtered
// @param   {...string} allowedFields - The fields that are allowed to be included
// @returns {Object} - The filtered object
// @usage   const filteredObj = filterObj(req.body, 'name', 'email');
// @example const filteredObj = filterObj({ name: 'John', age: 30 }, 'name'); // { name: 'John' }
export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
