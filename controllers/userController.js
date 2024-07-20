const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Kullanıcı kayıt fonksiyonu
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = await User.create({ username, password, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Kullanıcı giriş fonksiyonu
exports.login = async (req, res) => {
    try {
        console.log('Login request body:', req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('Username or password missing');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ where: { username } });
        console.log('Found user:', user);

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        console.log('Veritabanından gelen şifre:', user.password);
        console.log('Giriş yapılmak istenen şifre:', password);

        // Doğrudan karşılaştırma
        if (user.password !== password) {
            console.log('Password does not match');
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log('Token generated:', token);
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ error: error.message });
    }
};