module.exports = (app) => {
    const drawingController = require('../controllers/drawingController');
    const authMiddleware = require('../middleware/auth');
    app.post('/drawings', authMiddleware, drawingController.create);
    app.get('/drawings', authMiddleware, drawingController.findAll);
    app.get('/drawings/:id', authMiddleware, drawingController.findOne);
    app.put('/drawings/:id', authMiddleware, drawingController.update);
    app.delete('/drawings/:id', authMiddleware, drawingController.delete);
};
