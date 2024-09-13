// data.js
const data = {};

// Function to add data
export const addData = (nodeId, fileName, extractedData, schema) => {
  data[nodeId] = { fileName, ...extractedData , schema};
};

// Function to remove data
export const removeData = (nodeId) => {
  delete data[nodeId];
};

// Function to get data
export const getData = () => data;

// Function to get all filenames
export const getFilenames = () => {
  const filenames = new Set();
  Object.values(data).forEach(({ fileName }) => filenames.add(fileName));
  return Array.from(filenames);
};

export default data;
