const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const{protect}=require('../middleware/auth')
const {
  createNewInmate,
  getAllInmate,
  getOneInmate,
  updateInmate,  
  deleteInmate
} = require('../controllers/inmate');

 router.route('/create/:id').post(createNewInmate);
 router.route('/inmates/:ownerEmail').get(getAllInmate);
 router.route('/detail/:id').get(getOneInmate);
 router.route('/update-1/:id/').post(updateInmate);
 router.route('/delete/:id').delete(deleteInmate);

module.exports = router;

