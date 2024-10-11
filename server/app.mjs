// const express = requires('express');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.mjs';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

const connect = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB');
        console.error(error);
    }
    
}

mongoose.connection.on("disconnected", (err) => {
    console.log("mongodb disconnected");
  });
mongoose.connection.on("connected", (err) => {
    console.log("mongodb connected");
  });

  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRoutes);


// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMsg = err.message || "Something went wrong";
    console.log(err);
    res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMsg,
    });
  });

app.listen(port, () => {
    connect();
    console.log('Server is running on port ' + port);
});