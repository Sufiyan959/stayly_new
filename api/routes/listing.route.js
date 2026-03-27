import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createListing,uploadImage ,deleteListing,getListing,getListings,updateListing} from '../controllers/listing.controller.js';
import upload from "../utils/multerUpload.js";


const router=express.Router()

router.post('/create',verifyToken,createListing)
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

// Fix: Handle multiple images with field name 'images'
router.post("/upload", verifyToken, upload.array("images", 6), uploadImage);


export default router