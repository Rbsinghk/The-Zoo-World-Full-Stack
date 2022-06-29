const express = require('express');
const app = express();
require('./config/db');
const cookieParser = require("cookie-parser");
const path = require('path');
const bodyParser = require('body-parser')
const swaggerUI = require('swagger-ui-express');
const ejs = require('ejs')
const cors = require('cors')
const XLSX = require('xlsx');
const YAML = require('yamljs');
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(cors())

const swaggerJsDocs = YAML.load('./swagger/user.yaml');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

//Import Route
const regRouter = require('./Routes/registerRoute');
const userProfileRoute = require('./Routes/userProfile');
const ticketBookingRoute = require('./Routes/ticketBookingRoute');
const animalRoute = require('./Routes/animalRoute');
const feedbackRoute = require('./Routes/feedbackRoute');
const frontEndRoute = require('./Routes/frontEndRoute');

//Route MiddleWare
app.use(regRouter);
app.use(userProfileRoute);
app.use(ticketBookingRoute);
app.use(animalRoute);
app.use(feedbackRoute);
app.use(frontEndRoute)

app.use(express.static("./public/animalsImage"));
app.use(express.static("./views/images"))
app.use(cookieParser());
// app.use((req, res, next) => {
//     const error = new Error('Not Found');
//     error.status = 404;
//     next(error)
// })
// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         error: {
//             message: error.message
//         }
//     })
// })

app.listen(port, () => {
    console.log(`The Port is Running at ${port}`);
})