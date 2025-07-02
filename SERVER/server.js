require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/pg', require('./src/routes/pgRoutes'));
app.use('/api/room', require('./src/routes/roomRoutes'));
app.use('/api/payment', require('./src/routes/paymentRoutes'));
app.use('/api/expenses', require('./src/routes/expenseRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
