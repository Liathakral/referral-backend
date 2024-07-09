// const express = require('express');
// const { PrismaClient } = require('@prisma/client');
// const nodemailer = require('nodemailer');
// const dotenv = require('dotenv');

// dotenv.config();

// const prisma = new PrismaClient();
// const app = express();

// app.use(express.json());

// // Email configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
// });

// // Create User API
// app.post('/user', async (req, res) => {
//   const { name, email, password, referralCode } = req.body;

//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password,
//         referralCode,
//       },
//     });
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Referral API
// app.post('/referral', async (req, res) => {
//   const { userId, referrerCode } = req.body;

//   // Validation
//   if (!userId || !referrerCode) {
//     return res.status(400).json({ error: 'Missing fields' });
//   }

//   try {
//     const user = await prisma.user.findUnique({ where: { id: userId } });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const referrer = await prisma.user.findUnique({ where: { referralCode: referrerCode } });

//     if (!referrer) {
//       return res.status(404).json({ error: 'Referrer not found' });
//     }

//     // Save referral data
//     const newReferral = await prisma.referral.create({
//       data: {
//         userId,
//         referrerCode,
//         referrerId: referrer.id,
//       },
//     });

//     // Send referral email
//     const mailOptions = {
//       from: process.env.GMAIL_USER,
//       to: user.email,
//       subject: 'Referral Successful',
//       text: `Thank you for your referral, ${user.name}!`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json(newReferral);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
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
