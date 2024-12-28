import { StatusCodes } from "http-status-codes"
import User from "../models/user.js"

export const getUser = async (req, res) => {
    const user = await User.findById(req.userID)
    res.status(StatusCodes.OK).json({user: user})
}

export const updateFund = async (req, res) => {
    const newFund = parseInt(req.body.fund)
    if(!newFund || newFund < 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid value" })
    }

    await User.findByIdAndUpdate(req.userID, { fund: newFund })

    res.status(StatusCodes.CREATED).json({ message: "Fund updated!" })

}