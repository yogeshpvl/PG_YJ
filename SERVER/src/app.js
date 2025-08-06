
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('./cron/deleteOldNotices');
const generateMonthlyPayments = require('./utils/scheduler'); // or the correct path

generateMonthlyPayments(); 

const authRoutes = require('./routes/authRoutes');
const pgRoutes = require('./routes/pgRoutes');
const floorRoutes = require('./routes/floorRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bedRoutes = require('./routes/bedRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');
const guestPolicyRoutes = require('./routes/guestPolicyRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
// const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pgs', pgRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/policy', guestPolicyRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/complaints', complaintRoutes);  


// Default Route
app.get('/', (req, res) => {
  res.send('PG SaaS Server Running');
});

module.exports = app;