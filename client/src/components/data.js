// // data.js
// const data = {};

// // Function to add data
// export const addData = (nodeId, fileName, extractedData, schema) => {
//   data[nodeId] = { fileName, ...extractedData , schema};
// };

// // Function to remove data
// export const removeData = (nodeId) => {
//   delete data[nodeId];
// };

// // Function to get data
// export const getData = () => data;

// // Function to get all filenames
// export const getFilenames = () => {
//   const filenames = new Set();
//   Object.values(data).forEach(({ fileName }) => filenames.add(fileName));
//   return Array.from(filenames);
// };

// export default data;

// data.js
const data = {};

// Function to add data
export const addData = (nodeId, fileName, extractedData, schema) => {
  data[nodeId] = { fileName, rows: extractedData.rows, columns: extractedData.columns, schema };
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

// export default data;
// Backend API URL
// const API_URL = 'http://localhost:5000';  // Update to your actual backend URL

// // Function to add data and save it to the backend
// export const addData = async (nodeId, fileName, extractedData, schema, userId) => {
//   try {
//     const response = await fetch(`${API_URL}/save-data`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         node_id: nodeId,
//         file_name: fileName,
//         extracted_data: extractedData,
//         schema: schema,
//         user_id: userId
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Data saved successfully:', data);
//   } catch (error) {
//     console.error('Error saving data:', error);
//   }
// };

// // Function to remove data from the backend
// export const removeData = async (nodeId, userId) => {
//   try {
//     const response = await fetch(`${API_URL}/remove-data`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         node_id: nodeId,
//         user_id: userId
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Data removed successfully:', data);
//   } catch (error) {
//     console.error('Error removing data:', error);
//   }
// };

// // Function to get data for the logged-in user from the backend
// export const getData = async (userId) => {
//   try {
//     const response = await fetch(`${API_URL}/get-data?user_id=${userId}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error retrieving data:', error);
//     return {};
//   }
// };

// // Function to get all filenames for the logged-in user
// export const getFilenames = async (userId) => {
//   try {
//     const response = await fetch(`${API_URL}/get-filenames?user_id=${userId}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(data)
//     return data.filenames || [];
//   } catch (error) {
//     console.error('Error retrieving filenames:', error);
//     return [];
//   }
// };

// export default {
//   addData,
//   removeData,
//   getData,
//   getFilenames,
// };
