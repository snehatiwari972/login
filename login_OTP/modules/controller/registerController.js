const express = require('express');
const  validateData  = require("../model/validation");
const app = express();
const userService = require('../service/service')




const signup = async (req, res) => {
  try {
    const { error } = validateData.schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message }); 
    }

    const user = await userService.register(req.body, req.file);
    
    return res.status(201).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};




const signinWithOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    
    const otpSentResult = await userService.sendOTPService(email);
    
    if (otpSentResult.success) {
      return res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      return res.status(400).json({ message: otpSentResult.msg });
    }
  } catch (error) {
    if (error.message === "There's No Account for the Provided Email") {
      return res.status(404).json({ message: error.message });
    } else {
      console.error('Controller error:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
};






const signin = async (req, res) => {
  try {
    const { error } = validateData.forschema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message }); 
    }

    const { otp, email } = req.body;
    
    const loginResult = await userService.loginWithOTP(email, otp);

    if (loginResult.status === 200) {
  
      return res.status(200).json({ user: loginResult.user, token: loginResult.token });
    } else {
 
      return res.status(loginResult.status).json({ message: loginResult.message });
    }
  } catch (error) {
    console.error('Error in signin controller:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};











module.exports = { signup, signinWithOTP, signin };
