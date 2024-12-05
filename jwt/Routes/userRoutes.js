const express = require('express');
const {register,login,logout} = require('../Controllers/userController');
const {authenticate} = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'You have access to this protected route', user: req.user });
});
module.exports = router;