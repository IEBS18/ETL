import User from '../models/user.mjs';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';



export const createUser =  async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        userId: new mongoose.Types.ObjectId(),
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'user',
      });
  
      await user.save();
      res.status(201).json({ message: 'User created successfully', user_mixex_id: user.userId, first_name: user.firstName });
    } catch (err) {
        next(err);
    //   res.status(500).json({ message: 'Error creating user', error: err });
    }
};


export const loginUser = async (req, res, next) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ email });
          if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
        //   const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //   res.json({ token, message: 'Login successful' });
          res.json({ message: 'Login successful', user_minex_id: user.userId, first_name: user.firstName });
        } catch (err) {
            next(err);
        //   res.status(500).json({ message: 'Error logging in', error: err });
        }
      };