import { isValidObjectId } from "mongoose"
import { StatusCodes } from 'http-status-codes';

export const validID = async (req, res, next) => {
    const id = req.params.id
    if (!id || !isValidObjectId(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" })
    }
    next()
}