const Admins = require("../models/adminsModel")
const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/albasira_app");
        console.log("DB Connected")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

const governorateCodes =
    [30, 13, 11, 27, 19, 26, 31, 16, 25, 18, 17]



async function addTestAdmins() {
    await connectDB()
    await Admins.deleteMany();
    const admins = [
        {
            username: "admin",
            password: "123456",
            full_name: "ali hussein",
            personal_image: "sdkjkjkj",
            permissions: [30],
            tech_admin: false,
        },
        {
            username: "teach_admin",
            password: "123456",
            full_name: "ali hussein",
            personal_image: "sdkjkjkj",
            permissions: governorateCodes,
            tech_admin: true,
        },
        {
            username: "sub_admin",
            password: "123456",
            full_name: "ali hussein",
            personal_image: "sdkjkjkj",
            permissions: [30, 13, 11, 27],
            tech_admin: true,
        }
    ]
    try {
        await Admins.create(admins)
        console.log("admin has been added");
    } catch (error) {
        console.log(error.message);
    }
    process.exit()
}


async function getAllAdmins() {
    await connectDB()

    try {
        const admins = await Admins.find();
        console.log(admins);
    } catch (error) {
        console.log(error.message);
    }
    process.exit()
}


addTestAdmins()