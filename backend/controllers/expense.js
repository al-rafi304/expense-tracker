import mongoose from "mongoose"
import User from "../models/user.js"
import Expense from "../models/expense.js"
import { CATEGORIES } from "../constants/categories.js"
import { StatusCodes } from "http-status-codes"
import * as filter from "../constants/filter.js"

export const getCategories = async (req, res) => {
    res.json({ categories: CATEGORIES })
}

export const getAllExpenses = async (req, res) => {
    const expenses = await Expense.find({ user: req.userID })
    res.status(StatusCodes.OK).json({ expenses: expenses })
}

export const getExpense = async (req, res) => {
    const id = req.params.id

    const expense = await Expense.findOne({ _id: id, user: req.userID })
    if (!expense) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Not Found" })
    }

    res.status(StatusCodes.OK).json({ expense: expense })
}

export const addExpense = async (req, res) => {
    const { title, category, amount } = req.body

    const user = await User.findOne({ _id: req.userID })
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized access" })
    }

    // TODO: Validation
    if (!title || !category || !amount) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Required data not provided" })
    }

    if (user.fund < parseInt(amount)) {
        return res.json({ error: "Insufficient funds" })
    }

    const expense = await Expense.create({
        user: user,
        title: title,
        category: category,
        amount: parseInt(amount),
    })
    user.fund -= parseInt(amount)
    user.save()

    res.status(StatusCodes.CREATED).json({ message: "Expense added", expense: expense })
}

export const updateExpense = async (req, res) => {
    const id = req.params.id
    const { title, category, amount } = req.body

    if ( category && !CATEGORIES.includes(category)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid category name" })
    }
    
    const expense = await Expense.findOne({ _id: id, user: req.userID })
    if (!expense) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Not Found" })
    }

    const oldAmount = expense.amount
    
    expense.title = title ? title : expense.title
    expense.category = category ? category : expense.category
    expense.amount = amount ? amount : expense.amount
    
    if (expense.amount !== oldAmount) {
        await User.findByIdAndUpdate(
            req.userID,
            { $inc: { fund: oldAmount - expense.amount} }
        );
    }
    
    expense.save()
    res.status(StatusCodes.CREATED).json({ message: "Updated expense", expense: expense })
}

export const deleteExpense = async (req, res) => {
    const id = req.params.id

    const [expense, user] = await Promise.all([
        Expense.findOne({ _id: id, user: req.userID }),
        User.findById(req.userID)
    ])

    if (!expense) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Not Found" })
    }

    user.fund += expense.amount
    await Promise.all([
        user.save(),
        expense.deleteOne()
    ])
    
    res.status(StatusCodes.OK).json({ message: "Deleted expense record", expense: expense })
}

export const filterExpenses = async (req, res) => {
    const { groupBy, sortBy } = req.query
    
    if (!groupBy) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Filter parameters not found" })
    }

    if (!filter.GROUP_BY.includes(groupBy)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid filter parameters", query: req.query })
    }

    const groupKey = groupBy === 'date' 
        ? { $dateToString: { format: '%Y-%m-%d', date: '$date' } } 
        : `$${groupBy}`

    const expenses = await Expense.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(`${req.userID}`) } },
        {
            $group: {
                _id: groupKey,
                totalAmount: { $sum: '$amount' },
                expenses: {
                    $push: '$$ROOT'
                }
            }
        },
        {
            $sort: {
                _id: filter.SORT_BY[sortBy] || 1 
            }
        }
    ])

    res.status(StatusCodes.OK).json({ filteredExpenses: expenses })
}