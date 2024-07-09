const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client'); // Correct import
const authenticateUser = require('../middleware');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient(); 

router.post('/', authenticateUser, async (req, res) => {
  const { referrerCode } = req.body;
  const userId = req.userId; // Extracted from token

  // Validation
  if (!referrerCode) {
    return res.status(400).json({ error: 'Missing referral code' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const referrer = await prisma.user.findUnique({ where: { referralCode: referrerCode } });

    if (!referrer) {
      return res.status(404).json({ error: 'Referrer not found' });
    }

  
    const newReferral = await prisma.referral.create({
      data: {
        userId,
        referrerCode,
        referrerId: referrer.id,

       
      }
      
    });
    
    
    await sendReferralEmail(user.email, referrer.email);
    res.status(201).json({
        referral: newReferral,
        userEmail: user.email
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to send referral email
async function sendReferralEmail(userEmail, referrerEmail) {
    // Configure nodemailer to send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });
  
    
    const mailOptions = {
      from: 'liathakral28@gmail.com',
      to: userEmail,
      subject: 'Referral Invitation',
      text: `You have been referred by ${referrerEmail}. Join now!`,
    };
  
 
    await transporter.sendMail(mailOptions);
  }
module.exports = router;
