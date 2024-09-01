const Razorpay=require("razorpay");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

exports.purchasePremium = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 99 * 100; 
        rzp.orders.create({ amount, currency: 'INR', receipt: 'order_rcptid_11', payment_capture: '1' }, async function (error, order) {
            if (error) {
                console.error('Razorpay error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Something went wrong with order creation'
                });
            }

            try {
                const createdOrder = await req.user.createOrder({
                    orderId: order.id,
                    status: 'pending',
                    paymentId: null 
                });

                return res.status(200).json({
                    success: true,
                    key_id: rzp.key_id,
                    order: createdOrder
                });
            } catch (err) {
                console.error('Order creation error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error saving order to database'
                });
            }
        });

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


     


exports.updatePaymentStatus = async (req, res) => {
    try {
        const { order_id, payment_id } = req.body;

        console.log("Received order_id:", order_id); 
        console.log("Received payment_id:", payment_id); 
        
        // Find the order
        const order = await Order.findOne({ where: { orderId: order_id } });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

    
        await order.update({ paymentId: payment_id, status: 'completed' });

        // Update user status to premium
        await req.user.update({ isPremiumUser: true });
        const token=createJWT(req.user);

       return res.status(201).json({"message":"Payment successful","token":token});

    } catch (err) {
        console.error('Error updating payment status:', err); 
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

function createJWT(user) {
    return jwt.sign(
        { userId: user.id, isPremiumUser: user.isPremiumUser },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
    );
}