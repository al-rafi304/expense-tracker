import mongoose from 'mongoose'
import CATEGORIES from '../constants/categories'

const ExpenseSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
    },
    category: {
        type: String,
        enum: CATEGORIES,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('Expense', ExpenseSchema)

