const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS kütüphanesi
const sequelize = require('./utility/database');
const app = express();

// CORS ayarları
const corsOptions = {
    origin: 'http://localhost:4200', // Angular app url 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions)); // CORS ayarları

// Sync Database
sequelize.sync()
    .then(result => {
        console.log('Database synced successfully.');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Routes
require('./routes/userRoutes')(app);
require('./routes/drawingRoutes')(app);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
