const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const conn = require('./models/database');

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback:true,
    profileFields: ['id', 'displayName', 'name', 'email', 'picture.type(large)']
  },
  function(request, accessToken, refreshToken, profile, done) {
   let check = "SELECT uid FROM user_google WHERE uid = '"+profile.id+"'" ; 
   console.log(check);
   conn.query(check,(err,result)=>{
       if(err) throw err;
       else{
           
console.log(profile.name.givenName);
let st = "INSERT INTO user_google VALUES('"+profile.id+"','"+profile.name.givenName+"','"+profile.emails[0].value+"','"+profile.photos[0].value+"')";

// Creating queries
conn.query(st, (err, rows) => {
    if (err) throw err;
    console.log("Row inserted "+rows);
});
       
       }
});
console.log(profile)
return done(null, profile);  
  }));








/*
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile)
    return done(null, profile);
  }
));
*/
