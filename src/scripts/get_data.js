const Teachers = require("../models/teachersModel")
const Governorate = require("../models/governoratesModel")
const Regions = require("../models/regionsModel")
const Students = require("../models/studentsModel")
const Attendance = require("../models/attendanceModel")
const fs = require("fs");
const path = require("path");
const casual = require('casual');
const mongoose = require("mongoose");
const myEmitter = require('../utils/eventEmitter');


const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/albasira_app");
        console.log("DB Connected")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

async function getAllGovernorates() {
    const governorateObj = await Governorate.find();
    console.log(governorateObj);
}

async function getAllRegions() {
    const regionsObj = await Regions.find();
    console.log(regionsObj);
}

async function getAllTeachers() {
    const teachersObj = await Teachers.find();
    console.log(teachersObj);
}

async function getAllAttendances() {
    const attendanceObj = await Attendance.find();
    console.log(attendanceObj);
}


(async () => {
    try {
        connectDB()


        await getAllGovernorates()

        process.exit(0)

    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
})()