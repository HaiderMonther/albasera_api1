const totalStudents = 20;
const absenceStudents = 20;

function calculateAbsenceRate(totalStudents, attendanceNumber) {
    
    const absences = totalStudents - attendanceNumber;
    const absenceRate = (absences / totalStudents) * 100;
    
    return absenceRate.toFixed(2) + "%";
}

module.exports = calculateAbsenceRate;