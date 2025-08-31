# 🏡 Portfolio Website [BackEnd]

A modern, full-featured personal portfolio platform for showcasing skills, projects, experience, certificates, and contact information.

---

## 🗂️ Project Overview

This portfolio site is built with Node.js, Express, MongoDB, and EJS. It features a responsive design, admin panel, and dynamic content management.

---

## 🚀 Features

- **🏠 Home & About:**  
  Engaging hero section, animated backgrounds, and personal introduction.

- **🛠️ Skills & Projects:**  
  Dynamic skills and project listings, sortable by tags (e.g., Grand/Mini).

- **📜 Experience & Certificates:**  
  Experience timeline and certificate carousel (Swiper.js).

- **📬 Contact Form:**  
  Email integration via Nodemailer.

- **🔒 Admin Panel:**  
  Secure login, add/edit skills, projects, and experience.

---

## 🏗️ Project Structure

```
📁 models/
    ├─ skill.js
    └─ project.js
📁 views/
    ├─ index.ejs
    ├─ about.ejs
    ├─ skills.ejs
    ├─ projects.ejs
    ├─ exp.ejs
    ├─ contact.ejs
    ├─ admin-login.ejs
    ├─ admin-panel.ejs
    ├─ add-skill.ejs
    ├─ add-project.ejs
    └─ add-exp.ejs
📁 public/
    ├─ css/
    ├─ images/
    └─ certificates/
app.js
.env
```

---

## 📝 Workflow

- **Browse:**  
  View skills, projects, experience, and certificates.

- **Contact:**  
  Send messages via the contact form (email delivered to admin).

- **Admin:**  
  Login to add new skills, projects, and experience.

---

## ⚙️ Technologies Used

- Node.js, Express.js, MongoDB, Mongoose
- EJS templating
- Bootstrap 5, custom CSS
- Nodemailer (email integration)
- express-session (authentication)

---

## 🔒 Security & Accessibility

- Secure admin login (session-based)
- Responsive design for all devices
- Accessible forms and navigation

---

## 📦 Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure `.env`**
   - Add your MongoDB URI, admin credentials, and SMTP info.

4. **Run the app**
   ```sh
   node app.js
   ```
   or
   ```sh
   npx nodemon app.js
   ```

---

## 👤 Author

**Pranav S. Patil**

---

## 📄 License

ISC
