
//הגדת ספריות בשימוש
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const swaggerAutogen = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "Views")));

// חיבור למסד נתונים
let db_M = require('./db');
global.db_pool = db_M.pool;


const doc = {
    info: { title: 'My API', description: 'תוכנה לניהול מדידות לחץ דם  ' },
    host: `localhost:${port}`
};

const swaggerOutputFile = './swagger-output.json';
const routes = ['./index.js'];

// יצירת ה-Swagger JSON ואז טעינתו
swaggerAutogen(swaggerOutputFile, routes, doc).then(() => {
    if (fs.existsSync(swaggerOutputFile)) {
        const swaggerDocument = require(swaggerOutputFile);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

        // התחלת השרת רק לאחר יצירת ה-Swagger
        app.listen(port, () => console.log(`✅ Now listening on http://localhost:${port}`));
    } else {
        console.error("❌ Failed to generate Swagger JSON");
        process.exit(1);
    }
});

//נקוצות קצה לשימוש WEB
app.get("/Report", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "Views/Report.html"));
});
app.get("/UserMeasurementsHistory", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "Views/UserMeasurementsHistory.html"));
});
app.get("/UserMeasurementsManger", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "Views/UserMeasurementsManger.html"));
});

//הגדרת ראווטרים
const users_R = require('./Routers/Users_R');
app.use('/User/', users_R);
const measurement_R = require('./Routers/Measurement_R');
app.use('/Measurement/', measurement_R);


