const Drawing = require('../model/drawing');
const User = require('../model/user');

exports.create = async (req, res) => {
    try {
        req.body.data = JSON.stringify(req.body.data);

        let measurement = '';
        const drawingData = JSON.parse(req.body.data);

        if (req.body.type === 'Polygon') {
            measurement = calculateArea(drawingData) + ' m²';
        } else if (req.body.type === 'LineString') {
            measurement = calculateLength(drawingData) + ' m';
        }

        req.body.measurement = measurement;
        req.body.userId = req.user.id;

        const drawing = await Drawing.create(req.body);
        res.status(201).json(drawing);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const drawing = await Drawing.findByPk(req.params.id);
        if (!drawing || drawing.userId !== req.user.id) {
            return res.status(404).json({ error: 'Drawing not found or unauthorized' });
        }

        req.body.data = JSON.stringify(req.body.data);
        let measurement = '';
        const drawingData = JSON.parse(req.body.data);

        if (req.body.type === 'Polygon') {
            measurement = calculateArea(drawingData) + ' m²';
        } else if (req.body.type === 'LineString') {
            measurement = calculateLength(drawingData) + ' m';
        }

        req.body.measurement = measurement;

        await drawing.update(req.body);
        drawing.data = JSON.parse(drawing.data);
        res.json(drawing);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        let drawings;
        if (req.user.role === 'admin') {
            drawings = await Drawing.findAll();
        } else {
            drawings = await Drawing.findAll({ where: { userId: req.user.id } });
        }
        drawings.forEach(drawing => {
            drawing.data = JSON.parse(drawing.data);
        });
        res.json(drawings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const drawing = await Drawing.findByPk(req.params.id);
        if (!drawing || (drawing.userId !== req.user.id && req.user.role !== 'admin')) {
            return res.status(404).json({ error: 'Drawing not found or unauthorized' });
        }
        drawing.data = JSON.parse(drawing.data);
        res.json(drawing);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const drawing = await Drawing.findByPk(req.params.id);
        if (!drawing || (drawing.userId !== req.user.id && req.user.role !== 'admin')) {
            return res.status(404).json({ error: 'Drawing not found or unauthorized' });
        }

        await drawing.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

function calculateArea(polygonData) {
    // Polygon alan hesaplama fonksiyonu
    return 100; // Placeholder
}

function calculateLength(lineData) {
    // Line uzunluk hesaplama fonksiyonu
    return 10; // Placeholder
}
