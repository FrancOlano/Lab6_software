const express = require('express');
const router = express.Router();

let registeredEmails = [];

router.post('/register', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  registeredEmails.push(email);
  console.log('Registered emails:', registeredEmails);
  res.json({ message: 'Email registered successfully' });
});

module.exports = router;
