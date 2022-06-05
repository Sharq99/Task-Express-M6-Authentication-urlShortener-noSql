const connectDb = require('./database');
const express = require('express');

const app = express();

//Routes Imports
const urlRoutes = require('./api/urls/urls.routes');
const userRoutes = require('./api/users/users.routes');

//Passport Imports
const passport = require('passport');

//Passport Middeware
const { localStrategy, jwtStrategy } = require('./middleware/passport');

//Connection to Database
connectDb();

//MiddleWare
app.use(express.json());

//Routes
app.use('/urls', urlRoutes);
app.use(userRoutes);

//MiddleWare
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// Path Not Found MiddleWare
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handeling MiddleWare
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

app.listen(8005, () => {
  console.log('The application is running on localhost:8000');
});
