import { Router } from "express";
const router = Router();

import { authenticate } from "../middlewares/auth.js";
import { validID } from "../middlewares/validate.js";
import * as expense from '../controllers/expense.js'

router.route('/categories').get(expense.getCategories)

router.route('/filter').get(authenticate, expense.filterExpenses)

router.route('/')
    .post(authenticate, expense.addExpense)
    .get(authenticate, expense.getAllExpenses)

router.route('/:id')
    .get(authenticate, validID, expense.getExpense)
    .delete(authenticate, validID, expense.deleteExpense)
    .patch(authenticate, validID, expense.updateExpense)

export default router