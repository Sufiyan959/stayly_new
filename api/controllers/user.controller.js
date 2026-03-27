import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js'; 
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

export const test = (req, res) => {
  res.json({ message: 'API route is working' });
};


export const updateUser = async (req, res, next) => {
  try {
    // Verify user authorization
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only update your own account!'));
    }
    
    const userId = req.params.id;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(errorHandler(404, 'User not found'));
    }

    let updateFields = { ...req.body };
    
    // Validate email if it's being updated
    if (updateFields.email && updateFields.email !== currentUser.email) {
      const emailExists = await User.findOne({ email: updateFields.email });
      if (emailExists) {
        return next(errorHandler(400, 'Email already in use'));
      }
    }
    
    // Hash password if it's being updated
    if (updateFields.password) {
      updateFields.password = bcryptjs.hashSync(updateFields.password, 10);
    }

    // Handle avatar upload: accept buffer (memoryStorage) or fallback to path
    if (req.file) {
      try {
        let result;
        if (req.file.buffer) {
          // Convert buffer to data URI and upload
          const base64 = req.file.buffer.toString('base64');
          const dataUri = `data:${req.file.mimetype};base64,${base64}`;
          result = await cloudinary.uploader.upload(dataUri, {
            folder: process.env.CLOUDINARY_FOLDER || 'stayly/avatars',
            use_filename: true,
            resource_type: 'image',
          });
        } else if (req.file.path) {
          result = await cloudinary.uploader.upload(req.file.path, {
            folder: process.env.CLOUDINARY_FOLDER || 'stayly/avatars',
            use_filename: true,
            resource_type: 'image',
          });
          // Attempt to remove local file if present
          if (req.file.path && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
              if (err) console.error('Failed to remove local avatar file:', err.message);
            });
          }
        } else {
          return next(errorHandler(400, 'Uploaded avatar file not found'));
        }

        if (!result || !result.secure_url) {
          console.error('Cloudinary did not return a secure_url for avatar upload:', result);
          return next(errorHandler(500, 'Avatar upload failed'));
        }

        updateFields.avatar = result.secure_url;
      } catch (err) {
        console.error('Cloudinary avatar upload error:', err && err.message ? err.message : err);
        return next(errorHandler(500, `Avatar upload failed: ${err.message || err}`));
      }
    }

    // Update user with new fields
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
    try {
      const user = await User.findById(req.params.id);
      if (user && user.avatar && !user.avatar.startsWith('http')) {
        const avatarPath = `uploads/${user.avatar}`;
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        }
      }
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json({ success: true, message: 'User has been deleted!' });
    } catch (error) {
      next(error);
    }
};



export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};






