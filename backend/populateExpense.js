import mongoose from 'mongoose';
import User from './models/user.js';
import Expense from './models/expense.js';
import { CATEGORIES } from './constants/categories.js';

import * as dotenv from "dotenv";

dotenv.config();

const CATEGORY_RANGES = {
    Food: [5, 500],
    Transport: [10, 100],
    Entertainment: [100, 1000],
    Education: [500, 1000],
    Healthcare: [500, 2000],
    Utilities: [50, 500],
    Others: [10, 300],
};

function getRandomAmount(category) {
    const [min, max] = CATEGORY_RANGES[category];
    return Math.random() * (max - min) + min;
}

function getSequentialDate(startDate, index) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index); // Increment the date by index
    return date;
}

async function generateExpenses() {
    try {

        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connect to MongoDB')

        // Fetch users
        const users = await User.find();
        if (users.length < 1) {
            console.log("Need at least 1 users to populate expenses");
            return;
        }

        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 100);

        for (const user of users) {
            console.log(`Generating realistic expenses for user: ${user.name}`);

            let totalExpenseAmount = 0;

            const expenses = Array.from({ length: 100 }).map((_, index) => {
                const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
                const amount = parseInt(getRandomAmount(category));
                totalExpenseAmount += amount;

                return {
                    user: user._id,
                    title: `${category} Expense`,
                    category,
                    amount,
                    date: getSequentialDate(startDate, index),
                };
            });

            // Insert expenses in bulk
            await Expense.insertMany(expenses);
            console.log(`Added 100 expenses for user: ${user.name}`);

            // Update user's fund
            // const updatedFund = user.fund - totalExpenseAmount;
            // await User.findByIdAndUpdate(user._id, { fund: updatedFund. }, { new: true });
            // console.log(`Updated fund for user ${user.name} to ${updatedFund}`);
        }

        console.log("Realistic expense generation completed!");
    } catch (error) {
        console.error("Error generating expenses:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

generateExpenses();
