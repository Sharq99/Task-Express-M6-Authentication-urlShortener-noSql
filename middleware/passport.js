// const User = require('');
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { fromAuthHeaderAsBearerToken } = require("passport-jwt/lib/extract_jwt");
const { JWT_SECRET } = require("../config/keys");


const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy

exports.localStrategy = new LocalStrategy(async (username, password, done) => { // {usernameField: "name"} ==> it is used when your feild does not include username, so you tell it to treat name as username
   try {
        const foundUser =  await  User.findOne({ username }); // look for the correct user by comparing the username

        const isMatch = foundUser ? bcrypt.compareSync(password, foundUser.password) : false; // if the user is found look for compare the given password with the saved password, if the user not found return an error

        return isMatch ? done(null, foundUser) : done({message: "HHH"}, false); // if the password matches return the found user session, if the password does not match return error/false(basicaly saying that you did not put the correct requirments)
   } catch (error) {
       done(error);
   }
});

// if(foundUser){
//     // const await bcrypt.compare();
//     const isMatch = bcrypt.compareSync(password, foundUser.password);
//     console.log("Is it Mathing? ==> "+isMatch);
//     if(isMatch) return done(null, foundUser)
//     else done(null, false)
// } else {done()}


exports.jwtStrategy = new JWTStrategy({jwtFromRequest: fromAuthHeaderAsBearerToken(), secretOrKey: JWT_SECRET}, 
    async (jwtPayload, done) => { // {usernameField: "name"} ==> it is used when your feild does not include username, so you tell it to treat name as username
        if(Date.now() > jwtPayload.exp){
            done(null, false);
        }
        try {
            const foundUser =  await  User.findById(jwtPayload._id); // Find the User by their id
            if(foundUser) done(null, foundUser);
            else done(null, false);
        } catch (error) {
            done(error);
        }
    }
);