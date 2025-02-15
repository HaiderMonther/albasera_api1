const fs = require('fs');
const XLSX = require('xlsx');

// Function to generate a random 6-digit password with no repeating digits
function generatePassword() {
    let digits = Array.from({ length: 10 }, (_, i) => i.toString());
    let password = "";
    while (password.length < 6) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        password += digits.splice(randomIndex, 1);
    }
    return password;
}

// Function to generate 1000 users
function generateUsers(count) {
    const users = [];
    for (let i = 1; i <= count; i++) {
        users.push({
            region_id: null,
            governorate_id: null,
            username: `user${i}`,
            password: generatePassword(),
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
        });
    }
    return users;
}

// Generate 1000 users
const users = generateUsers(1000);

// Convert the users array to worksheet
const worksheet = XLSX.utils.json_to_sheet(users);

// Create a new workbook and append the worksheet
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

// Save the workbook to a file
const outputFilePath = "users.xlsx";
XLSX.writeFile(workbook, outputFilePath);

console.log(`File saved as ${outputFilePath}`);
