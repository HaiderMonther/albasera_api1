const Teachers = require("../models/teachersModel")
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


async function addTestTeachers() {
    await connectDB()
    const usernames = ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10"]

    await Teachers.deleteMany({
        username: {
            $in: usernames
        }
    })
    const teacher = [
        {
            region_id: null,
            governorate_id: null,
            username: "user1",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user2",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user3",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user4",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user5",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user6",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user7",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user8",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user9",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        },
        {
            region_id: null,
            governorate_id: null,
            username: "user10",
            password: 123456,
            state: 0,
            full_name: null,
            birth_date: null,
            phone_number: null,
            mosque_name: null,
            degree: null,
            work: null,
            previous_teacher: null,
            image_1: null,
            image_2: null,
            personal_image: null,
            update: null,
        }
    ]
    try {
        await Teachers.create(teacher)
        console.log("teacher has been added");
    } catch (error) {
        console.log(error.message);
    }
    process.exit()
}

addTestTeachers()