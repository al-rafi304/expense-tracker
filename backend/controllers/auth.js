import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.js';

const createJWT = (userID) => {
    const token = jwt.sign(
        { id: userID },
        process.env.JWT_SECRET,
        { expiresIn: parseInt(process.env.JWT_LIFETIME) }
    )
    return token
}

export const test = async (req, res) => {
    const user = await User.findOne({ _id: req.userID })
    res.status(200).json({ message: "Hello World!", user: user })
}

export const register = async (req, res) => {
    const {email, password, name} = req.body

    if (!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Credentials not provided!" })
    }
    
    if( await User.findOne({email: email})){
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User already exists!" })
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.create({
        name: name,
        email: email,
        password: passwordHash,
    })

    const token = createJWT(user._id)
    res.header('Authorization', `Bearer ${token}`).status(StatusCodes.CREATED).json({ id: user._id })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Login credentials not provided!" })
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid email or password!" });
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid email or password!" });
    }

    const token = createJWT(user._id)
    res.header('Authorization', `Bearer ${token}`).status(StatusCodes.OK).json({ id: user._id })
}

