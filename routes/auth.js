const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client'); // Correct import
const { generateToken, hashPassword, verifyPassword } = require('../auth');


const prisma = new PrismaClient(); 


router.post('/register', async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }


    const hashedPassword = await hashPassword(password);


    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referralCode,
      },
    });


    const token = generateToken(newUser.id);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
   
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

  
    const token = generateToken(user.id);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
