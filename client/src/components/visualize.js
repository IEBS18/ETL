
const visualize = {};

// Function to add visualize
export const addVisualize = (nodeId, fileName, extractedData, schema) => {
  visualize[nodeId] = { fileName, ...extractedData , schema};
};

// Function to remove visualize
export const removeVisualize = (nodeId) => {
  delete visualize[nodeId];
};

// Function to get visualize
export const getVisualize = () => visualize;

// Function to get all filenames
export const getFilenames = () => {
  const filenames = new Set();
  Object.values(visualize).forEach(({ fileName }) => filenames.add(fileName));
  return Array.from(filenames);
};

export default visualize;
