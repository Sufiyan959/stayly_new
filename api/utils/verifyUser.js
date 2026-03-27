import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    // Accept token from cookie or Authorization header (Bearer)
    let token = null;
    if (req.cookies && req.cookies.access_token) token = req.cookies.access_token;
    else if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(errorHandler(401,'Unauthorized'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403,'Forbidden'));
        req.user = user;
        next();
    });
}; 