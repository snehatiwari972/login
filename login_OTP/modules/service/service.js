const Student = require("../model/userModel");
const SECRET_KEY = "NOTESAPI";
const jwt = require("jsonwebtoken");
const config = require("../model/mail");
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();


const register = async (body,file) => {
  const { username, email } = body;
  const image = file;

  
  if (!image || !file.originalname) {
    return { message: 'File information missing' };
  }

  try {
    
    const existingUser = await Student.findOne({
      where: { email: email }
    });

    if (existingUser) {
      return { message: 'User already exists' };
    }

    const imageUrl = `https://localhost:5000/upload/images/${file.originalname}`;

    const newUser = await Student.create({ username, email, image : imageUrl});
    return newUser.toJSON();
  } catch (error) {
    throw error;
  }
};



const generateOTP = () => {
  
  return Math.floor(100000 + Math.random() * 900000);
};



const loginWithOTP = async (email, otp) => {
  try {
   
    const existingUser = await Student.findOne({ where: { email } });

    if (!existingUser) {
      return { status: 404, message: 'User Not Found' };
    }

   
    if (existingUser.otp !== otp) {
      return { status: 400, message: 'Invalid OTP' };
    }

    await Student.update({ otp: null }, { where: { email } });

    const token = jwt.sign({ email: existingUser.email, id: existingUser.id }, SECRET_KEY);

    return { status: 200, user: existingUser, token };
  } catch (error) {
    console.error('Login service error:', error);
    throw new Error('Something went wrong');
  }
};


const sendOTPService = async (email) => {
  try {
    const existingUser = await Student.findOne({ where: { email } });

    if (!existingUser) {
      throw new Error("There's No Account for the Provided Email");
    }

    if (existingUser) {
    
      const otp = generateOTP();

      await Student.update({ otp }, { where: { email: existingUser.email } });

      const otpStatus = `Your OTP for login: ${otp}`;
      const emailDetails = {
        email,
        subject: 'OTP For Login',
        text: otpStatus
      };

      await config(email, 'OTP For Login', emailDetails.text);

      return { success: true, msg: 'OTP sent successfully' };
    } else {
      throw new Error("There's no account for the provided email");
    }
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};



  
  

module.exports = {
    register,
    loginWithOTP,
    sendOTPService,
}


