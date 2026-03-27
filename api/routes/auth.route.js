import express from 'express';
import { signup, signin, signOut } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signOut);

// Add middleware to verify token
router.get('/me', verifyToken, (req, res) => {
    res.json(req.user);
});

export default router;