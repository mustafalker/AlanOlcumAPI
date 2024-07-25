const turf = require('@turf/turf');

let drawings = []; // Bu, gerçek bir veritabanı kullanmanız gereken yerdir.

exports.create = (req, res) => {
    try {
        const { coordinates, type } = req.body;

        if (type === 'Polygon') {
            const polygon = turf.polygon(coordinates);
            const area = turf.area(polygon);
            console.log(`Area of polygon: ${area}`);
        } else if (type === 'LineString') {
            const lineString = turf.lineString(coordinates);
            const length = turf.length(lineString);
            console.log(`Length of LineString: ${length}`);
        }

        // Log incoming data for debugging
        console.log('Incoming data:', req.body);

        const newDrawing = { ...req.body, userId: req.user.id, id: new Date().toISOString() };
        drawings.push(newDrawing);
        res.status(201).json(newDrawing);
    } catch (error) {
        console.error('Error in create:', error);
        res.status(500).json({ message: 'Error creating drawing' });
    }
};

exports.findAll = (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'admin') {
        res.json(drawings);
    } else {
        const userDrawings = drawings.filter(drawing => drawing.userId === userId);
        res.json(userDrawings);
    }
};

exports.findOne = (req, res) => {
    const drawing = drawings.find(d => d.id === req.params.id && (d.userId === req.user.id || req.user.role === 'admin'));
    if (drawing) {
        res.json(drawing);
    } else {
        res.status(404).send('Drawing not found');
    }
};

exports.update = (req, res) => {
    try {
        const drawing = drawings.find(d => d.id === req.params.id && (d.userId === req.user.id || req.user.role === 'admin'));
        if (drawing) {
            const { coordinates, type } = req.body;

            if (type === 'Polygon') {
                const polygon = turf.polygon(coordinates);
                const area = turf.area(polygon);
                console.log(`Area of polygon: ${area}`);
            } else if (type === 'LineString') {
                const lineString = turf.lineString(coordinates);
                const length = turf.length(lineString);
                console.log(`Length of LineString: ${length}`);
            }

            Object.assign(drawing, req.body);
            res.json(drawing);
        } else {
            res.status(404).send('Drawing not found');
        }
    } catch (error) {
        console.error('Error in update:', error);
        res.status(500).json({ message: 'Error updating drawing' });
    }
};

exports.delete = (req, res) => {
    const drawingIndex = drawings.findIndex(d => d.id === req.params.id && (d.userId === req.user.id || req.user.role === 'admin'));
    if (drawingIndex !== -1) {
        drawings.splice(drawingIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Drawing not found');
    }
};
