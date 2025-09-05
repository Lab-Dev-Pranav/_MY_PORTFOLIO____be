const express = require("express");
const app = express();

// ex aded for session management

const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const engine = require("ejs-mate");
const nodemailer = require("nodemailer");

// Load models
const Skill = require("./models/skill");
const Project = require("./models/project");

dotenv.config();
const port = process.env.PORT || 3000;

app.engine("ejs", engine); // Use ejs-mate
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Create a transporter for SMTP

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
    },
  })
);

// Middleware S
// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    return res.redirect("/login");
  }
  next();
}

// Middleware E

// home route
app.get("/", (req, res) => {
  // res.render("track.ejs");
  res.render("index");
});

// about
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/skills", async (req, res) => {
  await Skill.find()
    .then((skills) => {
      res.render("skills.ejs", { skills });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while fetching skills.");
    });
});

app.get("/projects", async (req, res) => {
  await Project.find()
    .then((projects) => {
      // console.log("Projects fetched:", projects);
      //       Projects fetched: [
      //   {
      //     _id: new ObjectId('688bbe033717480dd8f415ca'),
      //     name: 'SYMON SAYS GAME',
      //     description: 'A SYMON SAYS GAME With Four Colors To Increase The Mind Concentration...',
      //     languages: [ 'Html', 'Css', 'Js' ],
      //     tag: 'Mini',
      //     githubLink: 'https://github.com/MR-PRANAV/SYMON-SAYS-GAME',
      //     runLink: 'https://mr-pranav.github.io/SYMON-SAYS-GAME/',
      //     __v: 0
      //   }
      // ]

      // Correct sorting based on actual tags
      projects.sort((a, b) => {
        if (a.tag.toLowerCase() === "grand" && b.tag.toLowerCase() !== "grand")
          return -1;
        if (a.tag.toLowerCase() !== "grand" && b.tag.toLowerCase() === "grand")
          return 1;
        return 0;
      });

      res.render("projects.ejs", { projects });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while fetching projects.");
    });
});

app.get("/experience", (req, res) => {
  res.render("exp.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Contact Form Data:", name, email, message);

  try {
    // Create reusable transporter object using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: email, // sender info
      to: process.env.SMTP_USER, // replace with your receiving email
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #3f51b5; text-align: center;">📩 New Contact Message From Your Portfolio</h2>
    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
    
    <p style="font-size: 16px;"><strong>Name:</strong> <span style="color: #333;">${name}</span></p>
    <p style="font-size: 16px;"><strong>Email:</strong> <span style="color: #333;">${email}</span></p>
    <p style="font-size: 16px;"><strong>Message:</strong></p>
    <div style="background-color: #fff; padding: 15px; border-left: 4px solid #3f51b5; border-radius: 4px; font-size: 15px; color: #444; line-height: 1.6;">
      ${message}
    </div>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <footer style="text-align: center; font-size: 13px; color: #999;">
      This message was generated from your portfolio website.
    </footer>
  </div>
`,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    res.redirect("/contact?status=success"); // optional: show success message
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("An error occurred while sending the message.");
  }
});

// ------------admin routes-------------------

//AUTH ROUTES START
// Admin login form
// app.get("/login", (req, res) => {
//   res.render("admin-login.ejs", {
//     username: process.env.SMTP_USER,
//     title: "Admin Login",
//   });
// });

// // Admin login handler
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   // Check credentials
//   if (
//     username === process.env.ADMIN_USERNAME &&
//     password === process.env.ADMIN_PASSWORD
//   ) {
//     req.session.isAdmin = true; // Set session variable
//     return res.render("admin-panel.ejs", { title: "Admin Panel" }); // Redirect to admin dashboard
//   }

//   // If credentials are incorrect, redirect back to login with an error message
//   res.render("admin-login.ejs", {
//     title: "Admin Login",
//     error: "Invalid username or password",
//   });
// });
// //AUTH ROUTES END

// Admin login handler
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   // Check credentials
//   if (
//     username === process.env.ADMIN_USERNAME &&
//     password === process.env.ADMIN_PASSWORD
//   ) {
//     req.session.isAdmin = true; // Set session variable
//     return res.render("admin-panel.ejs", { title: "Admin Panel" }); // Redirect to admin dashboard
//   }

//   // If credentials are incorrect, redirect back to login with an error message
//   res.render("admin-login.ejs", {
//     title: "Admin Login",
//     error: "Invalid username or password",
//   });
// });
//AUTH ROUTES END

app.get("/login", (req, res) => {
  if (req.session.isAdmin === true) {
    return res.render("admin-panel.ejs", { title: "Admin Panel" }); // Redirect to admin dashboard
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("Generated OTP:", otp);
  req.session.otp = otp; // Store OTP in session

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER, // Send to admin email
    subject: "_MR_PRANAV____ Port - Admin Login OTP",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
      <h2 style="color: #2d89ef; text-align: center;">🔐 Admin Login OTP From dev-pranav.onrender.com</h2>
      <p style="font-size: 16px; color: #333;">
        Your One-Time Password (OTP) for admin login is:
      </p>
      <div style="margin: 20px 0; text-align: center;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #2d2d2d; background: #e6f0ff; padding: 12px 20px; border-radius: 6px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #555; text-align: center;">
        This OTP is valid for <b>3 minutes</b>. Please do not share it with anyone.
      </p>
    </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP email:", error);
      return res.status(500).send("Error sending OTP email");
    }
    // console.log("OTP email sent:", info.response);
  });

  res.render("admin-login.ejs", {
    username: process.env.SMTP_USER,
    title: "Admin Login",
    error:
      req.query.error === "invalid_otp"
        ? "Invalid OTP. Please try again."
        : null,
  });
});

// Admin login handler
app.post("/login", (req, res) => {
  const { otp } = req.body;
  const enteredOtp = otp; // OTP entered by user
  // console.log("Entered OTP:", enteredOtp);
  // console.log("Session OTP:", req.session.otp);

  if (enteredOtp === req.session.otp) {
    req.session.isAdmin = true;
    req.session.otp = null; // Clear OTP from session after successful login
    return res.render("admin-panel.ejs", { title: "Admin Panel" });
  } else {
    req.session.isAdmin = false;
  }

  res.redirect("/login?error=invalid_otp");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
  });

  res.redirect("/");
});

//--------------SKILLS ROUTES START--------------------
// GET skills form
app.get("/add-skills", isAdmin, (req, res) => {
  res.render("add-skill.ejs", { title: "Add Skills" });
});

// POST skills handler
app.post("/add-skills", isAdmin, (req, res) => {
  const { skill, points, tag } = req.body;
  // console.log("Skill:", skill);
  // console.log("Points:", points ? points.split(',') : []);
  // console.log("Tag:", tag);

  // Save skill to database
  const newSkill = new Skill({
    skill,
    points: points ? points.split(",") : [],
    tag,
  });
  newSkill
    .save()
    .then(() => {
      res.redirect("/add-skills");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while saving the skill.");
    });
});
//--------------SKILLS ROUTES END--------------------

//---------------PROJECTS ROUTES START--------------------
// get project form
app.get("/add-projects", isAdmin, (req, res) => {
  res.render("add-project.ejs", { title: "Add Projects" });
});

// POST /add-project handler
app.post("/add-project", isAdmin, (req, res) => {
  const { name, description, languages, tag, github, runlink } = req.body;

  // Build project data with required fields
  const projectData = {
    name,
    description,
    languages: languages.split(","),
    tag,
    githubLink: github,
  };

  // Only include runLink if it was submitted
  if (runlink && runlink.trim() !== "") {
    projectData.runLink = runlink;
  }

  const newProject = new Project(projectData);

  newProject
    .save()
    .then(() => {
      res.redirect("/add-projects");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while saving the project.");
    });
});

//----------------PROJECTS ROUTES END--------------------

//---------------EXPERIENCE ROUTES START--------------------
// get experience form
app.get("/add-experience", isAdmin, (req, res) => {
  res.render("add-exp.ejs", { title: "Add Experience" });
});
//----------------EXPERIENCE ROUTES END--------------------

// // Error handling middleware
// // 404 handler
// app.use((req, res, next) => {
//   res.status(404).render('404');
// });

// // 500 handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).render('500');
// });

app.listen(port, () => {
  console.log("Server is running on port -", port);
});
