import mongoose from "mongoose";
const fileDataSchema = new mongoose.Schema({
        userId: { type: String, required: true },  // Reference to User's unique ID
        nodeId: { type: String, required: true },  // Unique ID for data extraction node
        fileName: { type: String, required: true },
        type: {
            type: String,
            enum: ['transformed', 'extracted', 'downloaded'],
            default: 'extracted',
            required: true
        },  // Name of the file uploaded/extracted
        schema: { type: Object, required: true },  // File schema (JSON format)
        data: { type: Object, required: true },  // Actual extracted/transformed data
        transformationLogs: [{ 
          type: String 
        }],  // Logs of transformations applied
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now }
      });
      
      // This schema can track all extracted and transformed data per user
const FileData = mongoose.model('FileData', fileDataSchema);

export default FileData;