
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();

const app = express();
app.use(cors())
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const referralsroutes= require('./routes/referrals')
app.use('/auth', authRoutes);
app.use('/referrals', referralsroutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
