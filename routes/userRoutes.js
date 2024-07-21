//User Routes
const userController = require('../controllers/userController');

module.exports = (app) => {
    app.post('/register', userController.register);
    app.post('/login', userController.login);
};
