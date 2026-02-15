require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userRoutes = require('./routes/users');
const leaveRoutes = require('./routes/leaves');
app.use('/api/users', userRoutes);
app.use('/api/leaves', leaveRoutes);

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));