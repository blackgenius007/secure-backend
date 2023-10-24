require('dotenv').config()
require('express-async-errors') 
const morgan = require('morgan');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/db')
const express = require('express'); 
const mongoose = require('mongoose')
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logger')  
const fs =require('fs');
const colors = require('colors');  
PORT = process.env.PORT || 5000 
console.log(process.env.NODE_ENV)


// Load env vars    
// dotenv.config({path: `./config/config.env`})   
 

// connect to database
connectDB();

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(cors(corsOptions))


// Body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// Serve frontend
app.use('/', express.static(path.join(__dirname, 'public')))





// Route files
    
const auth  = require('./routes/authV3');        
const inmate = require('./routes/inmateRoutes');
const images = require('./routes/imagesRoutes')
const errorHandler =require('./middleware/error');

//mount routers  
 
app.use('/api/v3/auth', auth); 
app.use('/api/v1/inmate', inmate);
app.use('/api/v1/images', images);
app.use(errorHandler);

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})
 
app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB'.cyan.underline.bold)
  app.listen(PORT, () => console.log(`Server running on port ${PORT}` .yellow.bold))
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})


 
