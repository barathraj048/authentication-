import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose  from "mongoose";
import md5 from "MD5";

const port = 3000;

const app = express();

mongoose.connect("mongodb://127.0.0.1/userDB")

const userschema =new mongoose.Schema({
  email:String,
  password:String
})


const User=mongoose.model("User",userschema)


app.use(express.static("public"));
app.set("view engine", 'ejs'); // You had a space between "view engine" and "'ejs'"

app.use(bodyParser.urlencoded({ extended: true } )); // Fixed the syntax error here

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req,res) => {
  const username = req.body.username
  const password = md5(req.body.password)

  const user=new User({
    email:username,
    password:password
  })

  user.save()
  .then(()=> {
    res.render("secrets")
  })
  .catch((err)=> {
    console.log(err)
  })
})

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username })
    .then((foundeduser) => {
      if (!foundeduser) {
        console.log("User not found for username: " + username);
        res.send("User not found " +username);
      } else {
        if (foundeduser.password === password) {
          res.render("secrets");
        } else {
          res.send("Incorrect password");
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("An error occurred.");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
