
const path = require('path');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse.js');
const asyncHandler = require('../middleware/async.js');
const User = require('../models/User.js');
const Inmate = require('../models/inmate.js');
const GenerateCode = require('../utils/generateCode.js');
const toId = mongoose.Types.ObjectId;

// @desc Create new inmate with logged in id
//@routes /api/v1/inmate/create/:id
//@acess Private
exports.createNewInmate = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  console.log(req.params.id);
  const _id = req.params.id;
const {
    inmate_name,
    date_of_birth,
    gender,
    offence_category,
    socialSecurityNumber,
    raceEthnicity,
    nationality,
    homeAddress,
    contactInformation,
    height,
    weight,
    eye_color,
    hair_color,
    distinguishingMarks,
    disabilities,
    bookingDateTime,
    bookingNumber,
    bookingOfficer,
    arrestingAgency,
    arrestingOfficer,
    arrestDate,
    arrestLocation,
    arrestJurisdiction,
    personalItems,
  } = req.body;

  try {
    console.log('request from front =>', req.body);
    const pool = await User.findOne({ _id });

    console.log('pool content =>', pool);

    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    // Generate unique number for new inmate
    const d = new Date();
    const year = d.getFullYear();
    const { organizationName, ownerEmail } = pool;
    const inmate_number = `${organizationName.slice(0, 3)}-${year.toString().slice(-2)}-${GenerateCode(3)}`;
    // const inmate_number = `${Penitentiary.slice(0, 3)}-${year}-${GenerateCode(3)}`;

    const inmate = new Inmate({
      inmate_name,
      organizationName,
      offence_category,  
      inmate_number,
      ownerEmail,
      date_of_birth,
      gender,
      social_security: socialSecurityNumber,
      ethnicity: raceEthnicity,
      nationality,
      home_address: homeAddress,
      contact_information: contactInformation,
      height,
      weight,
      eye_color: eye_color,
      hair_color: hair_color,
      scar: distinguishingMarks,
      disability: disabilities,
      bookingDate: bookingDateTime,
      booking_officer: bookingOfficer,
      arresting_officer: arrestingOfficer,
      booking_time: bookingDateTime,
      arresting_agency: arrestingAgency,
      arrest_location: arrestLocation,
      arrestJurisdiction,
      arrestDate,
      bookingNumber,
      belongings: personalItems,
    });

    console.log('inmate before save:', inmate);
    await inmate.save();

    console.log('Added inmate successfully!');
    res.send(inmate);
  } catch (err) {
    console.log(err);
    // res.status(500).json({ error: 'Internal server error' });
    next(new ErrorResponse('Cannot create inmate'));
  }
});
 
// @desc Get inmates with ownersEmail
//@routes /api/v1/inmate/:iownerEmail
//@acess Private
exports.getAllInmate = asyncHandler(async (req, res, next) => {
  console.log('from front:',req.params.ownerEmail)
  try {
    const ownerEmail = req.params.ownerEmail;
    const inmates = await Inmate.find({ ownerEmail  });
    res.json(inmates);
  } catch (err) {
    console.log(err);
    next(new ErrorResponse('Database error', 404));
  }
});

//@desc Get one Inmate
//@routes Get/api/inmate/:num
//@acess  Private
exports.getOneInmate = asyncHandler(async (req, res, next) => {
  try {
    const _id = req.params.id;
    const InmateDetail = await Inmate.findOne({ _id });

    if (!InmateDetail) {
      const error = new ErrorResponse('Inmate not found', 404);
      throw error;
    }

    res.json(InmateDetail);
  } catch (error) {
    next(error);
  }
});
//@desc Update one Inmate
//@routes Get/api/v1/update/inmate/:num
//@acess  Private
exports.updateInmate = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  console.log(req.params._id);
 const  _id = req.params.id
  try {
   
    const Id = await Inmate.findOne({ _id });

    if (!Id) {
      return next(
        new ErrorResponse(
          `No inmate with the inmate number of ${req.params._id}`
        ),
        404
      );
    }

    const inmateDetail = await Inmate.findOneAndUpdate(
      { _id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: inmateDetail,
    });
  } catch (error) {
    next(new ErrorResponse('Internal server error', 500));
  }
});

// @desc Delete inmates
// @route DELETE /api/v1/inmate/delete/:id
// @access Private
exports.deleteInmate = asyncHandler(async (req, res, next) => {
  const _id=req.params.id
  try {
    console.log('delete id =>', req.params.id);
    const inmate = await Inmate.findOne({_id });

    if (!inmate) {
      return next(
        new ErrorResponse(
          `No inmate with the inmate number of ${req.params.id}`
        ),
        404
      );
    }

    await Inmate.findOneAndDelete({ _id });

    res.status(200).json({
      success: true,
      message: 'Inmate deleted successfully',
    });
  } catch (error) {
    next(new ErrorResponse('Internal server error', 500));
  }
});

 