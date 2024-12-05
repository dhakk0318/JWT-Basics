const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const routes = require('./Routes/userRoutes');

dotenv.config();
 
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});