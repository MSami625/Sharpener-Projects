const Sequelize = require('sequelize');
const User = require('../models/User');
const Expense = require('../models/Expense');

exports.getLeaderboard = async (req, res, next) => {
    try {
        // Fetch the total expenses for each user with their name
        const leaderboard = await Expense.findAll({
            attributes: [
                'userId',
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalExpenses']
            ],
            group: ['userId'],
            order: [[Sequelize.literal('totalExpenses'), 'DESC']],
            limit: 5,
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    required: true,
                    as: 'user' 
                }
            ]
        });

        // Map the result to include user details and their total expenses
        const result = leaderboard.map(entry => ({
            userName: entry.user.name, 
            totalExpenses: entry.get('totalExpenses')
        }));

        res.status(200).json({
            success: true,
            leaderboard: result
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
