const jwt = require('jsonwebtoken');

// Token'ı Almak, Token Kontrolü, Token'ı Doğrulama
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        // Kullanıcı Bilgilerini İsteğe Ekleme İçin
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
}

function verifyAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
}

module.exports = {
    verifyToken,
    verifyAdmin
};
