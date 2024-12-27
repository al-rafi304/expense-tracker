import { isValidObjectId } from "mongoose"
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
    
        if (!authHeader) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized access: no token" })
        }
    
        const [scheme, token] = authHeader.split(' ')
        if(scheme !== 'Bearer' || !token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized access" })
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        const valid = User.exists({ _id: verified.id })

        if (!valid) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" })
        }

        req.userID = verified.id
        
        next()
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Authentication failed", error: err.message });
    }
}

// export const authorizeAccess = (Model) => async (req, res, next) => {
//     const id = req.params.id
//     if (!id || !isValidObjectId(id)) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" })
//     }

//     const valid = await Model.exists({ _id: id, user: req.userID })
//     if (!valid) {
//         return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden access" })
//     }

//     next()
// }