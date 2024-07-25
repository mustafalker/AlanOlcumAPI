module.exports = (app) => {
    const drawingController = require('../controllers/drawingController');
    const { verifyToken, verifyAdmin } = require('../middleware/auth');
    
    app.post('/drawings', verifyToken, drawingController.create);
    app.get('/drawings', verifyToken, drawingController.findAll);
    app.get('/drawings/:id', verifyToken, drawingController.findOne);
    app.put('/drawings/:id', verifyToken, drawingController.update);
    app.delete('/drawings/:id', verifyToken, drawingController.delete);
    
    // Admin özel
    app.get('/admin/drawings', verifyToken, verifyAdmin, drawingController.findAll);
    app.put('/admin/drawings/:id', verifyToken, verifyAdmin, drawingController.update);
};