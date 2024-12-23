const db = require('../models/index');

const { handleUserLogin } = require('../services/user-services');
const { hashPassword, createNewUser, getAllUser, getUserById, updateUserData, deleteUserById } = require('../services/CRUDservices')
const { doctorIdtoUserId, splitFullName, convertTimeType, formatDate } = require('../algorithm/algorithm')
const { insertBookings, insertSchedules, getAllBookings, getBookingsByPatientId, checkPatientBooking, getDoctorInvolve, getPatientInvolve, getPreviousPatientsInvolve, deleteBookings, deleteSchedules, addCheckSaw, getCheckSaw, deleteCheckSaw, insertPreInfo } = require('../services/booking-services')


let bookingAppointMent = async (req, res) => {
    let doctorId = req.body.doctorId
    doctorId = doctorIdtoUserId(doctorId)
    let patientId = req.body.patientId
    let date = req.body.date
    let mess = req.body.message

    console.log(req.body)


    date = new Date(date);
    date.setHours(7, 0, 0, 0);


    let timeType = req.body.time
    timeType = convertTimeType(timeType)

    console.log(timeType)
    existAppointment = await checkPatientBooking(patientId, date, timeType)
    if (existAppointment) {
        return res.status(500).json({
            errCode: 1,
            message: 'Patient already has an appointment on this date and time!'
        })
    }
    else {
        await insertSchedules(doctorId, date, timeType)
        const book = await insertBookings(doctorId, patientId, date, timeType)
        await addCheckSaw(mess, doctorId, patientId)

        return res.status(200).json({
        errCode: 0,
        message: 'Appointment successfully made!',
        bookid : book.id
    })
    }

    
}


let deleteBookingsAppointment = async (req, res) => {

    let roleId = req.body.roleId
    let doctorId, patientID

    console.log(req.body)

    if (roleId === "R2") {
        doctorId = doctorIdtoUserId(req.body.data.item._id);
        patientID = parseInt(req.body.userId);
    }
    else if (roleId === "R1") {

        patientID = parseInt(req.body.data.item._id);
        doctorId = parseInt(req.body.userId);
    }
    let date = new Date(req.body.data.item.date);
    let timeType = req.body.data.item.timeType;
    date.setHours(7, 0, 0, 0)

    console.log(doctorId, patientID, date, timeType)

    try {
        let result1 = await deleteBookings(doctorId, patientID, date, timeType);
        let result2 = await deleteSchedules(doctorId, date, timeType);
        console.log(result1, result2)
        if (result1 && result2) {
            return res.status(200).json({
                errCode: 0
            })
        }
        else {
            return res.status(500).json({
                errCode: 1
            })
        }
    } catch (error) {
        return res.status(500).json({
            errCode: 3
        })
    }

}

let getMyAppointment = async (req, res) => {
    let id = req.params.id

    let results = await getDoctorInvolve(id);

    return res.status(200).json({
        errCode: 0,
        data: results
    })
}

let getMyPatients = async (req, res) => {
    let id = req.params.id

    let results = await getPatientInvolve(id);

    return res.status(200).json({
        errCode: 0,
        data: results
    })
}

let getMyPreviousPatients = async (req, res) => {
    let id = req.params.id

    let results = await getPreviousPatientsInvolve(id);

    return res.status(200).json({
        errCode: 0,
        data: results
    })
}

let allBookings = async (req, res) => {
    let allBook = await getAllBookings();
    let allBooks = [];
    console.log(allBook);

    for (book of allBook) {
        let b = {
            patient: book.pName,
            image: book.image,
            date: formatDate(book.date),
            doctor: book.dName,
            fees: `$${book.fees}`,
            status: "Complete"
        }
        allBooks.push(b);
    }
    return res.status(200).json({
        message: "ok",
        data: allBooks
    })
}

let getCheck = async (req, res) => {

    console.log(req.body)
    let message = req.body.message
    let id = req.body.id
    
    
    let result = await getCheckSaw(message,id)
    
    return res.status(200).json({
        data: result
    })
}

let deleteCheck = async (req, res) => {
    let id = req.body.userId
    let message = req.body.message
    
    let result = deleteCheckSaw(message, id)
    
    return res.status(200).json({
        errCode: 0
    })
}

let insertPre = async (req, res) => {
    let id = req.body.id;
    let info = req.body.info;

    await insertPreInfo(id, info);

    return res.status(200).json({
        errCode: 0
    })
}
module.exports = {insertPre,getCheck,deleteCheck, bookingAppointMent, getMyAppointment, deleteBookingsAppointment, getMyPatients, getMyPreviousPatients, allBookings }