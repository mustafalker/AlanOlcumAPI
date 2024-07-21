const Drawing = require('../model/drawing');
const User = require('../model/user');
const turf = require('@turf/turf');

exports.create = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Hata ayıklama logu

        const drawingData = req.body.data;

        let measurement = '';

        if (req.body.type === 'Polygon') {
            measurement = calculateArea({ type: 'Polygon', coordinates: drawingData }) + ' m²';
        } else if (req.body.type === 'LineString') {
            measurement = calculateLength({ type: 'LineString', coordinates: drawingData }) + ' m';
        }

        req.body.measurement = measurement;
        req.body.userId = req.user.id;
        req.body.data = JSON.stringify(drawingData);

        const drawing = await Drawing.create(req.body);
        res.status(201).json(drawing);
    } catch (error) {
        console.error('Error in create:', error); // Hata ayıklama logu
        res.status(400).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        console.log('Update request params:', req.params); // Hata ayıklama logu
        console.log('Update request body:', req.body); // Hata ayıklama logu

        const drawing = await Drawing.findByPk(req.params.id);
        if (!drawing) {
            console.log('Drawing not found'); // Hata ayıklama logu
            return res.status(404).json({ error: 'Drawing not found' });
        }

        if (drawing.userId !== req.user.id && req.user.role !== 'admin') {
            console.log('Unauthorized access attempt'); // Hata ayıklama logu
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const drawingData = req.body.data;
        let measurement = '';

        if (req.body.type === 'Polygon') {
            measurement = calculateArea(drawingData) + ' m²';
        } else if (req.body.type === 'LineString') {
            measurement = calculateLength(drawingData) + ' m';
        }

        req.body.measurement = measurement;

        await drawing.update({
            type: req.body.type,
            data: JSON.stringify(drawingData),
            measurement: req.body.measurement
        });

        drawing.data = JSON.parse(drawing.data);
        res.json(drawing);
    } catch (error) {
        console.error('Update error:', error);
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
    try {

        // polygonData'nın formatını kontrol et
        if (!polygonData || !polygonData.coordinates || !Array.isArray(polygonData.coordinates)) {
            throw new Error('Invalid polygon data format');
        }

        const polygon = turf.polygon(polygonData.coordinates);

        const area = turf.area(polygon);

        return area;
    } catch (error) {
        console.error('Error calculating area:', error);
        return 0;
    }
}

function calculateLength(lineData) {
    try {
        // lineData'nın formatını kontrol et
        if (!lineData || !lineData.coordinates || !Array.isArray(lineData.coordinates)) {
            throw new Error('Invalid line data format');
        }
        const line = turf.lineString(lineData.coordinates);

        const length = turf.length(line, { units: 'meters' });

        return length;
    } catch (error) {
        console.error('Error calculating length:', error);
        return 0;
    }
}

