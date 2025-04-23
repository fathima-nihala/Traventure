const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const globalError = require('./middleware/globalError');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const packageRoutes = require('./routes/packageRoutes');



dotenv.config();
const dotenvConfig = dotenv.config({
    path: path.resolve(__dirname, './config', '.env')
})

if (dotenvConfig.error) {
    console.log('Error Loading .env file', dotenvConfig.error);
}

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(globalError);

app.use(cors());

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Database is connected successfully 😎 ");
    app.listen(process.env.PORT, () => {
        console.log(`Server connected at 🖥️ ${process.env.PORT}`);
    });
}).catch(error => {
    console.error('Database connection error:', error);
    process.exit(1);  
});

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);


module.exports = app;