require("dotenv").config();
const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DB Connected")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = {
    connectDB
};