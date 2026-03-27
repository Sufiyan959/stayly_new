import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup= async (req,res,next)=>{
    const {username,email,password}=req.body
    const hashedPassword=bcryptjs.hashSync(password,10)
    const newUser = new User({ username, email, password:hashedPassword });
    try {
    const saved = await newUser.save();
    // optional: sign the user in immediately by issuing a token
    const token = jwt.sign({ id: saved._id }, process.env.JWT_SECRET);
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    };
    res.cookie('access_token', token, cookieOptions);

    const { password: pass, ...rest } = saved._doc;
    return res.status(201).json({ success: true, message: 'User created successfully!', token, user: rest });
    } catch (error) {
        next(error)
    }
}


export const signin = async (req,res,next) => {
    const {email,password}=req.body;
    try {
        const validUser=await User.findOne({email});
        if (!validUser) return next(errorHandler(404,'User not found'));
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if (!validPassword) return next(errorHandler(401,'Wrong Password'));
        const token =jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=validUser._doc;
        
        // Set the token as an HTTP-only cookie
        const isProd = process.env.NODE_ENV === 'production';
        const cookieOptions = {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        };
        res.cookie('access_token', token, cookieOptions);
        
        res.status(200).json({
            token,
            user: rest
        });
    } catch (error) {
        next(error)
    } 
}






export const signOut = async (req, res, next) => {
  try {
    // Clear the token cookie using the same options used to set it
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('access_token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', path: '/' });
    // Clear any other session data if needed
    res.status(200).json({ 
      success: true,
      message: 'User has been logged out!'
    });
  } catch (error) {
    next(error);
  }
};