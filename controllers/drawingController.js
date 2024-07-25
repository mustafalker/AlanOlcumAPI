const turf = require('@turf/turf');

let drawings = [];
let drawingIdCounter = 1; 

exports.create = (req, res) => {
    try {
        const { coordinates, type } = req.body;

        let measurement;
        if (type === 'Polygon') {
            const polygon = turf.polygon(coordinates);
            measurement = turf.area(polygon);
        } else if (type === 'LineString') {
            const lineString = turf.lineString(coordinates);
            measurement = turf.length(lineString);
        }

        const newDrawing = {
            ...req.body,
            userId: req.user.id,
            username: req.user.username,
            measurement: measurement,
            createdAt: new Date().toISOString(),
            id: drawingIdCounter++ 
        };
        drawings.push(newDrawing);
        res.status(201).json(newDrawing);
    } catch (error) {
        console.error('Error in create operation:', error);
        res.status(500).json({ message: 'Error occurred while creating the drawing' });
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
    console.log(`Received update request for ID: ${req.params.id}`);
    try {
        const drawing = drawings.find(d => d.id === parseInt(req.params.id) && (d.userId === req.user.id || req.user.role === 'admin'));
        console.log(`Drawing found: ${drawing}`); 
        if (drawing) {
            const { coordinates, type } = req.body;

            let measurement;
            if (type === 'Polygon') {
                const polygon = turf.polygon(coordinates);
                measurement = turf.area(polygon);
                console.log(`Polygon area: ${measurement}`);
            } else if (type === 'LineString') {
                const lineString = turf.lineString(coordinates);
                measurement = turf.length(lineString);
                console.log(`Line length: ${measurement}`);
            }

            console.log('Updated data:', req.body);

            Object.assign(drawing, req.body, {
                measurement: measurement, 
                updatedAt: new Date().toISOString() 
            });
            console.log('Updated drawing:', drawing); 
            res.json(drawing);
        } else {
            console.log('Drawing not found'); 
            res.status(404).send('Drawing not found');
        }
    } catch (error) {
        console.error('Error in update operation:', error);
        res.status(500).json({ message: 'Error occurred while updating the drawing' });
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
