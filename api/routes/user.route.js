import express from 'express';
import { deleteUser, test, updateUser ,getUser,getUserListings} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../utils/multerUpload.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, upload.single('avatar'), updateUser)
router.delete('/delete/:id',verifyToken,deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)
export default router