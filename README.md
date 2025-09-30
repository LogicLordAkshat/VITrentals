# VITrentals 🚗

<div align="center">
  <img src="static/car.png" alt="VITrentals Logo" width="200" height="200">
  
  **VIT University's Premier Car Rental System**
  
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
</div>

---

## 📋 Table of Contents

- [About VITrentals](#about-vitrentals)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributors](#contributors)
- [License](#license)

---

## 🎯 About VITrentals

VITrentals is a comprehensive car rental management system developed as a final project for the **Database Management Systems (DBMS)** course at **VIT University**. This project demonstrates advanced database concepts including normalization up to BCNF, complex SQL queries, CRUD operations, and full-stack web development.

### 🎓 Academic Project
- **Institution**: VIT University
- **Course**: Database Management Systems (DBMS)
- **Project Type**: Final Project
- **Developers**: Akshat Srivastava & Krish Jariwala

---

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication system
- Role-based access control (Customer, Office Staff, Admin)
- Secure password hashing with bcrypt
- Session management with cookies

### 🚗 **Car Management**
- Advanced car search and filtering
- Real-time car availability checking
- Car status management
- Fleet management for office staff

### 📅 **Reservation System**
- Easy car reservation process
- Date and time slot management
- Reservation history tracking
- Payment integration ready

### 📊 **Analytics & Reporting**
- Real-time dashboard with statistics
- Performance metrics and insights
- Business intelligence reports
- User activity tracking

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Modern Bootstrap 5 interface
- Smooth animations and transitions
- Mobile-first approach

### 🏢 **Multi-Role System**
- **Customer Portal**: Browse, search, and reserve cars
- **Office Staff Portal**: Manage fleet, reservations, and reports
- **Admin Portal**: System administration and analytics

---

## 🛠 Technology Stack

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database management
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Nodemailer** - Email services

### **Frontend**
- **HTML5** - Markup language
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Client-side logic
- **Bootstrap 5** - UI framework
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### **Database**
- **MySQL** - Relational database
- **Normalized Schema** - Up to BCNF
- **Complex Queries** - Advanced SQL operations
- **Data Integrity** - Foreign key constraints

---

## 📁 Project Structure

```
VITrentals/
├── 📁 ER model/              # Database ER diagrams
├── 📁 sql/                   # Database scripts
│   ├── DDL.sql              # Data Definition Language
│   └── DML.sql              # Data Manipulation Language
├── 📁 static/                # Static assets
│   ├── 📁 js/               # JavaScript files
│   ├── *.css                # Stylesheets
│   └── *.png, *.jpg         # Images
├── 📁 views/                 # HTML templates
├── 📄 index.js              # Main server file
├── 📄 authServer.js         # Authentication server
├── 📄 package.json          # Dependencies
├── 📄 docker-compose.yml    # Docker configuration
└── 📄 README.md             # Project documentation
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/LogicLordAkshat/VITrentals.git
cd VITrentals
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Database Setup**
1. Create a MySQL database
2. Run the DDL script to create tables:
```bash
mysql -u your_username -p your_database < sql/DDL.sql
```
3. Run the DML script to insert sample data:
```bash
mysql -u your_username -p your_database < sql/DML.sql
```

### **4. Environment Configuration**
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
ACCESS_TOKEN_SECRET=your_jwt_secret_key
EMAIL=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

### **5. Start the Server**
```bash
npm start
```

### **6. Access the Application**
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🗄 Database Schema

### **Key Tables**
- **Users** - Customer and staff information
- **Cars** - Vehicle details and specifications
- **Reservations** - Booking information
- **Payments** - Transaction records
- **Offices** - Rental office locations

### **ER Diagram**
![ER Diagram](ER%20model/ER%20diagram.png)

### **Database Features**
- ✅ Normalized up to BCNF
- ✅ Foreign key constraints
- ✅ Indexed columns for performance
- ✅ Data integrity checks
- ✅ Optimized queries

---

## 🔗 API Endpoints

### **Authentication**
- `POST /signin` - User login
- `POST /signup` - User registration
- `POST /logout` - User logout

### **Cars**
- `GET /cars` - Get all cars
- `GET /cars/search` - Search cars
- `POST /cars/add` - Add new car (Admin/Office)

### **Reservations**
- `GET /reservations` - Get user reservations
- `POST /reservations/create` - Create reservation
- `PUT /reservations/update` - Update reservation

### **Admin**
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/analytics` - System analytics
- `POST /admin/users` - Manage users

---

## 📸 Screenshots

### **Landing Page**
![Landing Page](static/stats1.png)
*Modern, responsive landing page with hero section and features*

### **Customer Dashboard**
![Customer Dashboard](static/stats2.png)
*User-friendly interface for browsing and reserving cars*

### **Office Staff Portal**
![Office Portal](static/stats3.png)
*Comprehensive management interface for office staff*

### **Admin Dashboard**
*Advanced analytics and system management tools*

---

## 👥 Contributors

<div align="center">

| Developer | Role | GitHub |
|-----------|------|--------|
| **Akshat Srivastava** | Full Stack Developer | [@LogicLordAkshat](https://github.com/LogicLordAkshat) |
| **Krish Jariwala** | Full Stack Developer | [@KrishJariwala](https://github.com/KrishJariwala) |

</div>

---

## 🎓 Academic Information

- **University**: VIT University
- **Course**: Database Management Systems (DBMS)
- **Project Type**: Final Project
- **Semester**: 5th Semester
- **Instructor**: Miss.Arpita Ghosh

---

## 📄 License

This project is developed for academic purposes as part of the DBMS course at VIT University. All rights reserved.

---

## 🤝 Contributing

This is an academic project. For suggestions or improvements, please contact the developers.

---

## 📞 Contact

- **Akshat Srivastava**:23BCT0108
- **Krish Jariwala**:23BCT0139
- **Project Repository**: [https://github.com/LogicLordAkshat/VITrentals](https://github.com/LogicLordAkshat/VITrentals)

---

<div align="center">
  <p><strong>Built with ❤️ by VIT University Students</strong></p>
  <p>© 2024 VITrentals. All rights reserved.</p>
</div>
