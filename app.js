import express, { text } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import Jwt from 'jsonwebtoken';
import bcrypt, { compare } from 'bcrypt';
import { name } from 'ejs';
import multer from 'multer';
import { count } from 'console';
import emailvalidator from 'deep-email-validator';
import  nodemailer from  'nodemailer';

import React from 'react';
import  ReactDOM from 'react';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);



const port = process.env.PORT || 10001;

const currentpath = path.resolve();
console.log(currentpath);


let data = {
    name: String,
    email: String,
    password: String,
    MEMBER: String,
    about: String,
    role: String,
    pass: String,
    taskAssigned1: String,
    taskAssigned2: String,
    taskAssigned3: String,
    deadline: String,
    involve1: String,
    involve2: String,
    Stringenvolve2: String,
    task1: String,
    task2: String,
    facebook: String,
    instagram: String,
    photo: {
        filename: String,
        imformation: Buffer,
    },
    attendance: Number,
    classnumber: Number,
    token:String,
    changeemail:String,
    changepasswordkey:String,
    changepasswordemail:String,
    pass:Boolean,
}

let chatdata = {
    name: String,
    email: String,
    password: String,
    MEMBER: String,
    about: String,
    role: String,
    pass: String,
    taskAssigned1: String,
    taskAssigned2: String,
    taskAssigned3: String,
    deadline: String,
    involve1: String,
    involve2: String,
    Stringenvolve2: String,
    task1: String,
    task2: String,
    facebook: String,
    instagram: String,
    photo: {
        filename: String,
        imformation: Buffer,
    },
    attendance: Number,
    classnumber: Number,
    token:String,
    changeemail:String,
    changepasswordkey:String,
    changepasswordemail:String,
    pass:Boolean,
}
let chat = {
    name: String,
    email: String,
    massege:String,
    date:Date,
    count:Number,
}
let userchange = {
    name: String,
    email: String,
    password: String,
    MEMBER: String,
    about: String,
    count: Number,
    pass: String,
    taskAssigned1: String,
    taskAssigned2: String,
    taskAssigned3: String,
    deadline: String,
    involve1: String,
    involve2: String,
    Stringenvolve2: String,
    role: String,
    task1: String,
    task2: String,
    facebook: String,
    instagram: String,
    photo: {
        filename: String,
        imformation: String,
    },
    attendance: Number,
    classnumber: Number,
    token:String,
    changeemail:String,
    changepasswordkey:String,
    changepasswordemail:String,
    pass:Boolean,
}

const emaili = {
    email: String,
    cookie:String,
}
const uri = "mongodb+srv://dipshirshadatta:07032004D.d@cluster0.a6v6uom.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database");
     mongoose.set('strictQuery', false);
    // You can now define your Mongoose models and interact with the database
  })
  .catch(err => {
    console.error("Error connecting to the database:", err);
  });

  const massegeSchema = new mongoose.Schema({
    name:String,
email:String,
date:Date,
massege:String,
token:String,
});

const Userschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    MEMBER: String,
    about: String,
    role: String,
    task1: String,
    task2: String,
    taskAssigned1: String,
    taskAssigned2: String,
    taskAssigned3: String,
    deadline: String,
    involve1: String,
    involve2: String,
    facebook: String,
    instagram: String,
    photo: {
        filename: String,
        imformation: String,
    },
    attendance: Number,
    classnumber: Number,
    token:String,
    changeemail:String,
    changepasswordkey:String,
    changepasswordemail:String,
    pass:Boolean,
});
const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage });
const User = mongoose.model("user", Userschema);
const Massege = mongoose.model("massege", massegeSchema);

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

app.get("/register", (req, res) => {
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
app.get("/control/page", async(req, res) => {
    const { token } = req.cookies;
    data=await User.findOne({token});
    if (data.pass) {
        res.render("control.ejs", { name: data.name });
    }
    else {
        res.status(404).json({
            success: false,
            message: "Access Denied",
            details: "This section is restricted to the owner only. If you believe this is an error, please contact the owner for assistance.",
            instructions: [
                "When you register on this website, a unique token is generated.",
                "Use this token during login to gain access to the control panel.",
            ],
            contact: "You can reach the owner at: dipshirshadatta@gmail.com",
        });
    }
})
app.get("/user/page", async (req, res) => {
    userchange = await User.find();
    userchange.count = await User.count();
    res.render("user.ejs", { userchange: userchange, countdata: userchange.count, });

})

app.get("/dash/page", async (req, res) => {

    const { token } = req.cookies;
    data=await User.findOne({token});

    let percentage=(data.attendance/data.classnumber)*100;
    if (data.pass) {

        res.render("dashboard.ejs", {

            name: data.name, about: data.about, taskAssigned1: data.taskAssigned1, taskAssigned2: data.taskAssigned2, taskAssigned3: data.taskAssigned3,
            deadline: data.deadline, involve1: data.involve1, involve2: data.involve2, passx: "Admin", task1: data.task1, task2: data.task2,
            attendance:data.attendance,classnumber:data.classnumber,percentage:percentage,photo:data.photo,
        });
    }
    else {

        res.render("dashboard.ejs", {
            name: data.name, about: data.about, taskAssigned1: data.taskAssigned1, taskAssigned2: data.taskAssigned2, taskAssigned3: data.taskAssigned3,
            deadline: data.deadline, involve1: data.involve1, involve2: data.involve2, passx: "user", task1: data.task1, task2: data.task2,
            attendance:data.attendance,classnumber:data.classnumber,percentage:percentage,photo:data.photo,
        });
    }

})
app.get("/dash/form/page", async (req, res) => {

    res.render("dash-form.ejs");
})





app.post("/dash-form", upload.single('photo'), async (req, res) => {

    const { about, taskAssigned1, taskAssigned2, taskAssigned3, deadline, involve1, involve2, facebook, instagram } = req.body;
    // Create a photo object from the uploaded file

    const { originalname, buffer } = req.file;
    let hh = buffer.toString('base64');
    let photo = {
        filename: originalname,
        imformation: hh,
    };
    const { token } = req.cookies;
    data=await User.findOne({token});
    let { email } = data;
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
            facebook,
            instagram,
            photo,
        }

        await doc.updateOne(update);
        data = await User.findOne({ email });

    }
    else {
        res.status(404).send("User not found");
    }


    res.redirect("/")
})

app.post("/login", async (req, res) => {

    const { email, password, MEMBER } = req.body;
    let user = await User.findOne({ email });   /* finding data through email and store all imformation to user */
    data = await User.findOne({ email });

    if (!user) {
        return res.redirect("/register");
    }

let pass;
    if (MEMBER) {
        const ismember = user.MEMBER == MEMBER;
        if (!ismember) {
            return res.status(404).send("member not found");
                pass=false;
        }
        else {
            pass = true;
        }

    }
    else{
        pass=false; 
    }

    const ismatched = await bcrypt.compare(password, user.password);

    if (!ismatched) {
        return res.render("login", { massege: "incorrect password" })
    }



    const token = Jwt.sign({ _id: user._id }, 'imain')  /* check the data */
    res.cookie('token', token, user._id, { httpOnly: true, expires: new Date(Date.now() + 60 * 1000) })

    let docxmm = await User.findOne({ email });
    let updatemmm = {
     token,pass,
    }

    await docxmm.updateOne(updatemmm);



    res.redirect("/");
   
})

app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;




    let user = await User.findOne({ email });
    if (user) {
        return res.render("login.ejs")

    }
    const MEMBER = Math.random();
    const attendance = 0;
    console.log(MEMBER);
    const hashedpassword = await bcrypt.hash(password, 10);
    const classnumber = 0;
    user = User.create({ name, email, password: hashedpassword, MEMBER, attendance, classnumber });
    data = await User.findOne({ email });

    const token = Jwt.sign({ _id: user._id }, 'imain')  /* check the data */


    res.cookie('token', token, user._id, { httpOnly: true, expires: new Date(Date.now() + 60 * 1000) })
    
    let docxmmc = await User.findOne({ email });
    let updatemmmc = {
     token,
    }

    await docxmmc.updateOne(updatemmmc);
    res.redirect("/");

}
)

app.get("/logout", (req, res) => {
    res.cookie('token', null, {
        httpOnly: true, expires: new Date(Date.now())

    });
    res.redirect("/");
})
app.get("/login", (req, res) => {
    res.render("login.ejs");
})


app.get("/dashboard", async (req, res) => {
    res.render("dashboard.ejs");


})

app.post("/userchanged", async (req, res) => {

    const changeemail = req.body.change;
    const { token } = req.cookies;
  let  docxmmcc=await User.findOne({token});
    
    let updatemmmcc = {
     changeemail,
    }

    await docxmmcc.updateOne(updatemmmcc);
    let email =changeemail;
    userchange = await User.findOne({ email });

    res.render("change-form.ejs", { name: userchange.name });

})
app.post("/change-form", async (req, res) => {
    const { token } = req.cookies;
    let  userchange=await User.findOne({token});
    let { changeemail } = userchange;
   
    const { task1, task2,mail } = req.body;
    
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'dipshirshadatta@gmail.com', // Your Gmail email address
              pass: 'qxdu valf hezz mtvh', // Your Gmail password or an App Password if you have 2-factor authentication enabled
            },
          });
          const mailOptions = {
            from: 'dipshirshadatta@gmail.com', // Sender email address
            to: changeemail, // Recipient email address
            subject: 'New Task Assigned - Action Required', // Clear and attention-grabbing subject
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #3498db; padding: 20px; text-align: center;">
                        <h1 style="color: #fff; margin: 0;">New Task Assigned</h1>
                    </div>
                    <div style="padding: 20px;">
                        <h2 style="color: #3498db;">Hello,</h2>
                        <p style="font-size: 16px;">
                            You have been assigned a new task. Please review the details below and take the necessary action.
                        </p>
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                            <h3 style="color: #3498db; margin-top: 0;">Task Details:</h3>
                            <p style="font-size: 14px; margin: 5px 0;"><strong>Task 1:</strong> ${task1}</p>
                            <p style="font-size: 14px; margin: 5px 0;"><strong>Task 2:</strong> ${task2}</p>
                        </div>
                        ${mail ? `
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                            <h3 style="color: #3498db; margin-top: 0;">Additional Notice:</h3>
                            <p style="font-size: 14px; margin: 5px 0;">${mail}</p>
                        </div>
                        ` : ''}
                        <p style="font-size: 16px; margin-top: 20px;">
                            If you have any questions or need further clarification, please don't hesitate to reach out.
                        </p>
                        <p style="font-size: 16px;">
                            Best regards,<br>
                            <strong>Dipshirsha Datta</strong><br>
                            <em>Your Organization Name</em>
                        </p>
                    </div>
                    <div style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 14px; color: #777;">
                        <p style="margin: 0;">This is an automated email. Please do not reply to this message.</p>
                    </div>
                </div>
            `,
        };
          
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
          
    
let email=changeemail;
    let newdata = await User.findOne({ email });
    if (newdata) {
        // Update user's task data
        const docx = await User.findOne({ email });
        let update = {
            task1,
            task2
        }

        await docx.updateOne(update);


    }
    else {
        res.status(404).send("User not found");
    }


    res.redirect("/")
})
app.get("/members", async (req, res) => {

    userchange = await User.find();
    userchange.count = await User.count();
    console.log(userchange);
    res.render("Members.ejs", { userchange: userchange, countdata: userchange.count, });

})
app.get("/attendence", async (req, res) => {

    userchange = await User.find();
    userchange.count = await User.count();

    res.render("attendence.ejs", { userchange: userchange, countdata: userchange.count, });


})
app.post("/attendence/post", async (req, res) => {

    userchange = await User.find();
    userchange.count = await User.count();

    if (req.body) {
        const email = req.body.attend;

        let newdatax = await User.findOne({ email });

        if (newdatax) {

            const docm = await User.findOne({ email });

            let { attendance } = docm;

            console.log(attendance);

            attendance = attendance + 1;
            let updatex = {
                attendance,

            }

            await docm.updateOne(updatex);


        }
        else {
            res.status(404).send("User not found");
        }



    }


    res.redirect("/attendence");

}
)
app.post("/attendence/serve", async (req, res) => {

    userchange = await User.find();
    userchange.count = await User.count();

    if (req.body.noclass) {
        const docn = await User.find();

        for (let i = 0; i < userchange.count; i++) {
            let { classnumber } = docn[i];

            classnumber = classnumber + 1;
            let updatel = {

                classnumber,
            }
            await docn[i].updateOne(updatel);
        }





    }


    res.redirect("/");

}
)
app.get("/forgot",async(req,res)=>{
    res.render("forgot.ejs");
})


app.post("/forgotkey", async (req, res) => {
   const {gmail}=req.body;
let email=gmail;
   let lol= await User.findOne({email});
 
if(lol){
   
  
   let changepasswordemail=gmail;

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

let key=generateString(5);
let changepasswordkey=key; 
let newdatamnc = await User.findOne({ email });
if (newdatamnc) {
    // Update user's task data
    const docxmnc = await User.findOne({ email });
    let updatemnc = {
        changepasswordemail,
        changepasswordkey,
    }

    await docxmnc.updateOne(updatemnc);
}

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'dipshirshadatta@gmail.com', // Your Gmail email address
          pass: 'qxdu valf hezz mtvh', // Your Gmail password or an App Password if you have 2-factor authentication enabled
        },
      });
      const mailOptions = {
        from: 'dipshirshadatta@gmail.com', // Sender's email address
        to: gmail, // Recipient's email address
        subject: 'Password Reset Request', // Professional subject line
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
              <h2 style="color: #007BFF; text-align: center;">Password Reset Request</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password. Please use the following key to reset your password:</p>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h3 style="color: #007BFF; margin: 0;">Reset Key: <strong>${key}</strong></h3>
              </div>
              <p>If you did not request this password reset, please ignore this email or contact our support team immediately.</p>
              <p>Thank you,</p>
              <p><strong>Your Company Name</strong></p>
              <p style="font-size: 12px; color: #777; text-align: center;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        `,
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
      res.render("forgot.ejs");
    
    }
   else{
    res.status(404).send("User not found");
   }
    
    })
    app.post("/new/password", async (req, res) => {
 
 const {email,forgot,newpassword}=req.body;
 let  xvx=await User.findOne({email});

let String1=xvx.changepasswordkey;
console.log(forgot);
 if(forgot==String1)
 {
  
    let email=xvx.changepasswordemail;
    let password=newpassword;
   let hashedpassword= await bcrypt.hash(password, 10);
        // Update user's task data
        let docxm = await User.findOne({ email });
        let updatemm = {
          password: hashedpassword ,
        }

        await docxm.updateOne(updatemm);


 res.redirect("/");
 }
 else{
    res.status(404).send("code not found");
 }

  
    })

 app.get('/chat', async(req, res) => {
    const { token } = req.cookies;
     chatdata =await User.findOne({token});
     chat =await Massege.find();
     chat.count= await Massege.count();
     res.render("chat.ejs",{chatdata:chatdata.name,chat:chat,countdata:chat.count})
  });
io.on("connection", function (socket)  {
    console.log("A user connected");
    socket.on('chat message',async( msg,name) => 
    {
     
        let massege=msg;
        let masseger=new Massege({massege,name});
        masseger.save();
        io.emit('chat message', msg,name);
     
      });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
app.listen(process.env.PORT || port, () => {
    console.log("server is working");
})
const socketIoPort = process.env.SOCKET_IO_PORT || 10001;
server.listen(socketIoPort, '127.0.0.1', () => {
  console.log(`Socket.IO server running at http://127.0.0.1:${socketIoPort}/`);
});

