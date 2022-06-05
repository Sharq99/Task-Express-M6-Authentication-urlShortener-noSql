const express = require('express');
const passport = require('passport');

const router = express.Router();

const { signup, signin, getUsers, deleteUser } = require('./users.controllers');

router.post('/signup', signup);
router.post('/signin', passport.authenticate('local', {session: false}), signin);
router.get('/users', getUsers);
router.delete("/users/:userId", deleteUser);

module.exports = router;

//Ex for jwtStrategy
// router.get('/users', passport.authenticate('jwt', {session: false}), getUsers);
