import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local"; // Corrected the import
import passportLocalMongoose from "passport-local-mongoose"; // Corrected the import

const port = 3000;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs"); // Corrected the syntax
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "the secret small", // Corrected the typo
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1/userDB");

const userSchema = new mongoose.Schema({ // Renamed to userSchema for consistency
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secrets",(req,res)=> {
  if(req.isAuthenticated){
    res.render("secrets")
  }else{
    res.redirect("/login")
  }
})

app.post("/register", (req, res) => {
  // Create a new user with the email and password
  User.register(new User({username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      res.render("register"); 
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

app.get("/logout",(req,res)=> {
  req.logout((err)=>{
    if(err){
      console.log(err)
    }
  });
  res.redirect("/")
})


app.post("/login", (req, res) => {
 const user=new User({
  username:req.body.username,
  password:req.body.password
 })
 req.logIn(user,(err)=> {
  if(err) {
    console.log(err)
  }else{
    passport.authenticate("local")(req,res,()=> {
      res.redirect("/secrets");
    })
  }
 })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
