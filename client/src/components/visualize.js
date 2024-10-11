
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
export const getFilenames = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getransformedfiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });  // Adjust the URL based on your backend API route
    if (!response.ok) {
      throw new Error('Failed to fetch filenames');
    }
    const data = await response.json();  // Assuming the response is in JSON format
    return data.filenames;  // Assuming the filenames are in a `filenames` array
  } catch (error) {
    console.error('Error fetching filenames:', error);
    return [];
  }
};

export default visualize;
