
import express, { text } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import Jwt from 'jsonwebtoken';
import bcrypt, { compare } from 'bcrypt';

const port=5000;
const currentpath = path.resolve();
console.log(currentpath);
const app = express();
let data = {
    name: String,
    email: String,
    password: String,
    MEMBER: String,
    about: String,

    pass: String,
    taskAssigned1: String,
    taskAssigned2: String,
    taskAssigned3: String,
    deadline: String,
    involve1: String,
    involve2: String,
    Stringenvolve2: String
}

const emaili = {
    email: String,
}

const uri = "mongodb+srv://dipshirshadatta:07032004D.d@cluster0.a6v6uom.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database");
    
    // You can now define your Mongoose models and interact with the database
  })
  .catch(err => {
    console.error("Error connecting to the database:", err);
  });
const Userschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    MEMBER: String,
    about: String,


    taskAssigned1: String,
    taskAssigned2: String,
    taskAssigned3: String,
    deadline: String,
    involve1: String,
    involve2: String,
    Stringenvolve2: String
});

const User = mongoose.model("user", Userschema);


app.set("view engine", "ejs");

app.use(express.static(path.join(currentpath, "public")));
app.use(express.urlencoded({ extended: true }));/* accessing the data from body */
app.use(cookieParser());


const isathencative = async (req, res, next) => {
    const { token } = req.cookies;
    console.log(req.cookies);

    if (token) {
        const decoded = Jwt.verify(token, 'imain')
        next();
        req.user = await User.findById(decoded._id);
    }
    else {
        res.redirect("/index")
    }
}

app.get("/Register/page", (req, res) => {
    res.render("register-now.ejs");
})
app.get("/", isathencative, (req, res) => {
    res.render("index-loged.ejs");
})
app.get("/index", (req, res) => {
    res.render("index.ejs");
})
app.get("/logout/page", (req, res) => {
    res.render("logout.ejs");
})
app.get("/dash/page", async (req, res) => {

if(data.pass){
    res.render("dashboard.ejs", {
        name: data.name, about: data.about, taskAssigned1: data.taskAssigned1, taskAssigned2: data.taskAssigned2, taskAssigned3: data.taskAssigned3,
        deadline:data.deadline,involve1:data.involve1,involve2:data.involve2,Admin:"Admin"});
}
else{
   
    res.render("dashboard.ejs", {
        name: data.name, about: data.about, taskAssigned1: data.taskAssigned1, taskAssigned2: data.taskAssigned2, taskAssigned3: data.taskAssigned3,
        deadline:data.deadline,involve1:data.involve1,involve2:data.involve2,}); 
}
    
})
app.get("/dash/form/page", async (req, res) => {

    res.render("dash-form.ejs");
})





app.post("/dash-form", async (req, res) => {

    const { about, taskAssigned1, taskAssigned2, taskAssigned3, deadline, involve1, involve2, email } = req.body;
    let newdata = await User.findOne({ email });
    if (newdata) {
        // Update user's task data
        const doc = await User.findOne({ email });
        let update = {
            about,
            taskAssigned1,
            taskAssigned2,
            taskAssigned3,
            deadline,
            involve1,
            involve2,
        }

        await doc.updateOne(update);
        data = await User.findOne({ email });
    }
    else {
        res.status(404).send("User not found");
    }


    res.redirect("/dash/page")
})

app.post("/login", async (req, res) => {

    const { email, password, MEMBER } = req.body;
    let user = await User.findOne({ email });   /* finding data through email and store all imformation to user */
    data = await User.findOne({ email });
    if (!user) {
        return res.redirect("/Register/page");
    }
    if(MEMBER){
             const ismember = user.MEMBER === MEMBER;  
              if (!ismember) {
        return  res.status(404).send("User not found");

    }
   
data.pass=MEMBER; 
console.log(data.pass);
    }
 

    const ismatched = await bcrypt.compare(password, user.password);
    
    if (!ismatched) {
        return res.render("login", { massage: "incorrect password" })
    }

   

    const token = Jwt.sign({ _id: user._id }, 'imain')  /* check the data */


    res.cookie('token', token, user._id, { httpOnly: true, expires: new Date(Date.now() + 60 * 1000) })
    res.redirect("/");
})

app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return res.render("login.ejs")

    }
 const MEMBER=Math.random();
 console.log(MEMBER);
    const hashedpassword = await bcrypt.hash(password, 10);
  
    user = User.create({ name, email, password: hashedpassword,MEMBER});
    data = await User.findOne({ email });

    const token = Jwt.sign({ _id: user._id }, 'imain')  /* check the data */


    res.cookie('token', token, user._id, { httpOnly: true, expires: new Date(Date.now() + 60 * 1000) })
    res.redirect("/");

})
app.get("/logout", (req, res) => {
    res.cookie('token', null, {
        httpOnly: true, expires: new Date(Date.now())

    });
    res.redirect("/");
})
app.get("/login/page", (req, res) => {
    res.render("login.ejs");
})


app.listen(process.env.PORT || port, () => {
    console.log("server is working");
})
app.get("/dashboard", async (req, res) => {
    res.render("dashboard.ejs");
  

})



