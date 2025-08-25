// hash.js
const bcrypt = require('bcrypt');

const password = 'SightsOnChrist2025';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hash);
});
