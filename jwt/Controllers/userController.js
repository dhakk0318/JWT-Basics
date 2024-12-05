const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../DB/Db');
const { v4: uuidv4 } = require('uuid');

exports.register = (req, res) => {
    const { username, email, password, phone_number } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const userId = uuidv4();

    db.query('INSERT INTO users (id, username, email, password, phone_number) VALUES (?, ?, ?, ?, ?)', [userId, username, email, hashedPassword, phone_number], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error registering user' });
        }
        return res.status(200).json({ message: 'User registered successfully' });
    });
    }

exports.login = (req, res) => {
    const { username, password } = req.body;
db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
   
    if (results.length === 0) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'invalid password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
     
    res.cookie('token', token, { 
        httpOnly: true,
        secure:process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000
     });
    res.status(200).json({ message: 'Login successful',
     user: {
         id: user.id,
         username: user.username,
         email: user.email,
         phone_number: user.phone_number,
     },
     });
    
});
}

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}