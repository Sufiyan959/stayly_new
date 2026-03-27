import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

export const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No files uploaded" 
      });
    }

    // Upload each file to Cloudinary (supports memory buffer or file path)
    const uploadPromises = req.files.map(async (file) => {
      try {
        let result;
        if (file.buffer) {
          const base64 = file.buffer.toString('base64');
          const dataUri = `data:${file.mimetype};base64,${base64}`;
          result = await cloudinary.uploader.upload(dataUri, {
            folder: process.env.CLOUDINARY_FOLDER || 'stayly',
            use_filename: true,
            resource_type: 'image'
          });
        } else if (file.path) {
          result = await cloudinary.uploader.upload(file.path, {
            folder: process.env.CLOUDINARY_FOLDER || 'stayly',
            use_filename: true,
            resource_type: 'image'
          });
          // remove local file if it exists
          if (file.path && fs.existsSync(file.path)) {
            fs.unlink(file.path, (err) => {
              if (err) console.error('Failed to remove local file:', err.message);
            });
          }
        } else {
          throw new Error('Uploaded file has no buffer or path');
        }

        if (!result || !result.secure_url) {
          throw new Error('Cloudinary upload did not return a secure_url');
        }

        return result.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err && err.message ? err.message : err);
        throw err;
      }
    });

    const imageUrls = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      imageUrls: imageUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false,
      message: "Upload failed", 
      details: error.message 
    });
  }
};

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json({
      success: true,
      _id: listing._id,
      ...listing._doc
    });
  } catch (error) {
    console.error('Create listing error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create listing'
    });
  }
};


export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found!'
      });
    }
    if (req.user.id !== listing.userRef) {
      return res.status(401).json({
        success: false,
        message: 'You can only delete your own listings!'
      });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Listing has been deleted!'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete listing'
    });
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found!'
      });
    }
    if (req.user.id !== listing.userRef) {
      return res.status(401).json({
        success: false,
        message: 'You can only update your own listings!'
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      _id: updatedListing._id,
      ...updatedListing._doc
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update listing'
    });
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found!'
      });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get listing'
    });
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    // Build search filter - search across name, description, and address
    const searchFilter = searchTerm
      ? {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { address: { $regex: searchTerm, $options: 'i' } },
          ],
        }
      : {};

    const listings = await Listing.find({
      ...searchFilter,
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
