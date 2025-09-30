require('dotenv').config()
const express = require("express");
const app = express();
const mysql = require("mysql");
const path = require('path');
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const { decodeToken, authorizeAdmin, authorizeCustomer, authorizeOffice, authroizeAdminOrCustomer, checkWhereToGo} = require('./authServer');
const saltRound = 10;
const cookieOptions = { secure: false }; //change secure to true when deploying

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

let dbConnected = false;

db.connect((err) => {
    if (err) {
        console.log('❌ Database connection failed:', err.message);
        console.log('💡 Please make sure MySQL is installed and running');
        console.log('💡 You can install MySQL using: winget install Oracle.MySQL');
        console.log('💡 Or download from: https://dev.mysql.com/downloads/mysql/');
        console.log('💡 Then run the DDL script from sql/DDL.sql to create the database');
        console.log('🚀 Server will start but database features will not work until MySQL is set up');
        dbConnected = false;
    } else {
        console.log('✅ Database connected successfully');
        dbConnected = true;
    }
});

// Helper function to check database connection
function checkDatabaseConnection(res, callback) {
    if (!dbConnected) {
        // For demonstration purposes, show a demo message instead of error
        return res.status(200).json({ 
            success: false,
            message: 'Database not available - This is a demo mode. Please set up MySQL for full functionality.',
            demo: true
        });
    }
    callback();
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/home.html");
});

app.get("/signin", (req, res) => {
    res.sendFile(__dirname + "/views/signin.html");
});
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/views/signup.html");
});

app.get("/office_signup", (req, res) => {
    res.sendFile(__dirname + "/views/office_signup.html");
});

app.get("/new_car", (req, res) => {
    res.sendFile(__dirname + "/views/car_form.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/views/admin_home.html");
});

app.get("/payments-search", (req, res) => {
    res.sendFile(__dirname + "/views/payment_report_search.html");
});

app.get("/cars-status-search", (req, res) => {
    res.sendFile(__dirname + "/views/car_status_search.html");
});

app.get("/customer-res-search", (req, res) => {
    res.sendFile(__dirname + "/views/customer_res_search.html");
});

app.get("/car-res-search", (req, res) => {
    res.sendFile(__dirname + "/views/car_res_search.html");
});

app.get("/res-search", (req, res) => {
    res.sendFile(__dirname + "/views/res_search.html");
});

app.get("/reserve", (req, res) => {
    res.sendFile(__dirname + "/views/reserve.html");
});

app.get("/advanced-search", (req, res) => {
    res.sendFile(__dirname + "/views/advanced_search.html");
});

app.get("/office-home", (req, res) => {
    res.sendFile(__dirname + "/views/office_home.html");
});

app.get("/customer-home", (req, res) => {
    res.sendFile(__dirname + "/views/customer_home.html");
});

app.get("/add-car", (req, res) => {
    res.sendFile(__dirname + "/views/add_car.html");
});

// Demo data endpoints
app.get("/demo-data", (req, res) => {
    const demoData = {
        cars: [
            { plate_id: "ABC123", model: "Camry", make: "Toyota", year: 2022, price: 50, status: "Available" },
            { plate_id: "XYZ789", model: "Civic", make: "Honda", year: 2023, price: 45, status: "Rented" },
            { plate_id: "DEF456", model: "Accord", make: "Honda", year: 2021, price: 55, status: "Available" }
        ],
        reservations: [
            { id: 1, customer: "Krish Jariwala", car: "ABC123", pickup: "2024-01-15", return: "2024-01-20", status: "Active" },
            { id: 2, customer: "Akshat Srivastava", car: "XYZ789", pickup: "2024-01-10", return: "2024-01-25", status: "Completed" }
        ],
        customers: [
            { name: "Krish Jariwala", email: "krish@demo.com", phone: "1234567890", reservations: 3 },
            { name: "Akshat Srivastava", email: "akshat@demo.com", phone: "0987654321", reservations: 1 }
        ]
    };
    res.json(demoData);
});

// Admin dashboard data
app.get("/admin-data", (req, res) => {
    const adminData = {
        stats: {
            totalCars: 45,
            availableCars: 32,
            rentedCars: 13,
            totalRevenue: 125000,
            monthlyRevenue: 25000,
            totalCustomers: 156,
            totalReservations: 89,
            activeReservations: 13
        },
        recentReservations: [
            { id: 1, customer: "Krish Jariwala", car: "Toyota Camry (ABC123)", pickup: "2024-01-15", return: "2024-01-20", amount: 250, status: "Active" },
            { id: 2, customer: "Akshat Srivastava", car: "Honda Civic (XYZ789)", pickup: "2024-01-10", return: "2024-01-25", amount: 675, status: "Completed" },
            { id: 3, customer: "Mike Johnson", car: "Ford Focus (GHI456)", pickup: "2024-01-12", return: "2024-01-18", amount: 300, status: "Active" },
            { id: 4, customer: "Sarah Wilson", car: "BMW 3 Series (JKL789)", pickup: "2024-01-08", return: "2024-01-15", amount: 525, status: "Completed" }
        ],
        topCars: [
            { model: "Toyota Camry", make: "Toyota", rentals: 45, revenue: 22500 },
            { model: "Honda Civic", make: "Honda", rentals: 38, revenue: 17100 },
            { model: "Ford Focus", make: "Ford", rentals: 32, revenue: 16000 },
            { model: "BMW 3 Series", make: "BMW", rentals: 28, revenue: 19600 }
        ],
        offices: [
            { id: 1, name: "Downtown Branch", city: "New York", cars: 15, revenue: 45000 },
            { id: 2, name: "Airport Branch", city: "Los Angeles", cars: 12, revenue: 38000 },
            { id: 3, name: "Mall Branch", city: "Chicago", cars: 10, revenue: 32000 },
            { id: 4, name: "Station Branch", city: "Miami", cars: 8, revenue: 10000 }
        ]
    };
    res.json(adminData);
});

// Customer dashboard data
app.get("/customer-data", (req, res) => {
    const customerData = {
        user: {
            name: "Krish Jariwala",
            email: "customer@demo.com",
            phone: "123-456-7890",
            memberSince: "2023-06-15",
            totalRentals: 12,
            loyaltyPoints: 1250
        },
        availableCars: [
            { id: 1, model: "Toyota Camry", make: "Toyota", year: 2022, price: 50, image: "/car.png", features: ["GPS", "Bluetooth", "Backup Camera", "Lane Assist"] },
            { id: 2, model: "Honda Accord", make: "Honda", year: 2023, price: 55, image: "/car.png", features: ["GPS", "Bluetooth", "Sunroof", "Wireless Charging"] },
            { id: 3, model: "Ford Focus", make: "Ford", year: 2021, price: 45, image: "/car.png", features: ["GPS", "Bluetooth", "Apple CarPlay"] },
            { id: 4, model: "BMW 3 Series", make: "BMW", year: 2023, price: 75, image: "/car.png", features: ["GPS", "Bluetooth", "Leather Seats", "Sunroof", "Heated Seats"] },
            { id: 5, model: "Mercedes C-Class", make: "Mercedes", year: 2022, price: 80, image: "/car.png", features: ["GPS", "Bluetooth", "Leather Seats", "Premium Audio", "Ambient Lighting"] },
            { id: 6, model: "Audi A4", make: "Audi", year: 2023, price: 70, image: "/car.png", features: ["GPS", "Bluetooth", "Virtual Cockpit", "Bang & Olufsen Audio"] },
            { id: 7, model: "Tesla Model 3", make: "Tesla", year: 2023, price: 90, image: "/car.png", features: ["Autopilot", "Supercharging", "Premium Interior", "Over-the-Air Updates"] },
            { id: 8, model: "Nissan Altima", make: "Nissan", year: 2022, price: 48, image: "/car.png", features: ["GPS", "Bluetooth", "ProPILOT Assist", "Remote Start"] },
            { id: 9, model: "Hyundai Sonata", make: "Hyundai", year: 2023, price: 52, image: "/car.png", features: ["GPS", "Bluetooth", "Wireless Charging", "Blind Spot Monitor"] },
            { id: 10, model: "Mazda CX-5", make: "Mazda", year: 2022, price: 58, image: "/car.png", features: ["GPS", "Bluetooth", "AWD", "SkyActiv Technology"] },
            { id: 11, model: "Lexus ES", make: "Lexus", year: 2023, price: 85, image: "/car.png", features: ["GPS", "Bluetooth", "Leather Seats", "Mark Levinson Audio", "Heated Seats"] },
            { id: 12, model: "Volkswagen Jetta", make: "Volkswagen", year: 2022, price: 46, image: "/car.png", features: ["GPS", "Bluetooth", "Apple CarPlay", "Android Auto"] }
        ],
        myReservations: [
            { id: 1, car: "Toyota Camry (ABC123)", pickup: "2024-01-15", return: "2024-01-20", status: "Active", amount: 250 },
            { id: 2, car: "Honda Civic (XYZ789)", pickup: "2024-01-05", return: "2024-01-10", status: "Completed", amount: 225 },
            { id: 3, car: "Ford Focus (DEF456)", pickup: "2023-12-20", return: "2023-12-25", status: "Completed", amount: 200 }
        ],
        searchFilters: {
            makes: ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi"],
            models: ["Camry", "Civic", "Accord", "Focus", "3 Series", "C-Class"],
            priceRange: { min: 30, max: 100 }
        }
    };
    res.json(customerData);
});

// Office dashboard data
app.get("/office-data", (req, res) => {
    const officeData = {
        office: {
            name: "Downtown Branch",
            location: "New York, NY",
            manager: "Sarah Johnson",
            totalCars: 15,
            availableCars: 12,
            rentedCars: 3,
            maintenanceCars: 1,
            cleaningCars: 0
        },
        myCars: [
            { plate_id: "ABC123", model: "Camry", make: "Toyota", year: 2022, price: 50, status: "Available", lastService: "2024-01-01", totalRentals: 45, mileage: 25000, fuelType: "Hybrid" },
            { plate_id: "XYZ789", model: "Civic", make: "Honda", year: 2023, price: 45, status: "Rented", lastService: "2023-12-15", totalRentals: 38, mileage: 15000, fuelType: "Gasoline" },
            { plate_id: "DEF456", model: "Accord", make: "Honda", year: 2021, price: 55, status: "Maintenance", lastService: "2024-01-10", totalRentals: 32, mileage: 35000, fuelType: "Gasoline" },
            { plate_id: "GHI789", model: "Focus", make: "Ford", year: 2022, price: 45, status: "Available", lastService: "2023-12-20", totalRentals: 28, mileage: 22000, fuelType: "Gasoline" },
            { plate_id: "JKL012", model: "BMW 3 Series", make: "BMW", year: 2023, price: 75, status: "Available", lastService: "2024-01-05", totalRentals: 15, mileage: 8000, fuelType: "Gasoline" },
            { plate_id: "MNO345", model: "Mercedes C-Class", make: "Mercedes", year: 2022, price: 80, status: "Rented", lastService: "2023-12-28", totalRentals: 22, mileage: 18000, fuelType: "Gasoline" },
            { plate_id: "PQR678", model: "Audi A4", make: "Audi", year: 2023, price: 70, status: "Available", lastService: "2024-01-08", totalRentals: 18, mileage: 12000, fuelType: "Gasoline" },
            { plate_id: "STU901", model: "Tesla Model 3", make: "Tesla", year: 2023, price: 90, status: "Available", lastService: "2024-01-12", totalRentals: 25, mileage: 10000, fuelType: "Electric" }
        ],
        reservations: [
            { id: 1, customer: "Krish Jariwala", car: "Toyota Camry (ABC123)", pickup: "2024-01-15", return: "2024-01-20", amount: 250, status: "Active", phone: "555-0123" },
            { id: 2, customer: "Akshat Srivastava", car: "Honda Civic (XYZ789)", pickup: "2024-01-10", return: "2024-01-25", amount: 675, status: "Active", phone: "555-0456" },
            { id: 3, customer: "Mike Johnson", car: "Honda Accord (DEF456)", pickup: "2024-01-12", return: "2024-01-18", amount: 300, status: "Completed", phone: "555-0789" },
            { id: 4, customer: "Sarah Wilson", car: "BMW 3 Series (JKL012)", pickup: "2024-01-14", return: "2024-01-21", amount: 525, status: "Active", phone: "555-0321" },
            { id: 5, customer: "David Brown", car: "Mercedes C-Class (MNO345)", pickup: "2024-01-08", return: "2024-01-15", amount: 560, status: "Active", phone: "555-0654" },
            { id: 6, customer: "Lisa Davis", car: "Audi A4 (PQR678)", pickup: "2024-01-05", return: "2024-01-12", amount: 490, status: "Completed", phone: "555-0987" }
        ],
        revenue: {
            today: 1250,
            thisWeek: 8750,
            thisMonth: 25000,
            lastMonth: 22000,
            growth: 13.6
        },
        analytics: {
            topPerformingCars: [
                { model: "Toyota Camry", revenue: 2250, rentals: 45 },
                { model: "Honda Civic", revenue: 1710, rentals: 38 },
                { model: "BMW 3 Series", revenue: 1875, rentals: 25 },
                { model: "Tesla Model 3", revenue: 2250, rentals: 25 }
            ],
            customerStats: {
                totalCustomers: 156,
                newCustomers: 12,
                returningCustomers: 89,
                averageRating: 4.7
            },
            maintenanceSchedule: [
                { plate_id: "DEF456", model: "Honda Accord", service: "Oil Change", dueDate: "2024-01-20", priority: "High" },
                { plate_id: "ABC123", model: "Toyota Camry", service: "Brake Inspection", dueDate: "2024-01-25", priority: "Medium" },
                { plate_id: "GHI789", model: "Ford Focus", service: "Tire Rotation", dueDate: "2024-01-30", priority: "Low" }
            ]
        }
    };
    res.json(officeData);
});

// Demo instructions page
app.get("/demo", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>VITrentals Demo Instructions</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); min-height: 100vh; }
                .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin: 40px auto; max-width: 1000px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 3em; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
                .subtitle { color: #666; font-size: 1.2em; }
                .demo-credentials { background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%); padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #3498db; }
                .credential { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .btn { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 8px; transition: transform 0.3s; }
                .btn:hover { background: linear-gradient(135deg, #2980b9 0%, #1f618d 100%); transform: translateY(-2px); }
                h1 { color: #333; margin-bottom: 20px; }
                h2 { color: #2c3e50; margin-top: 30px; }
                .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
                .feature-card { background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #3498db; }
                .authors { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
                .author-name { font-weight: bold; color: white; font-size: 1.1em; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🚗 VITrentals</div>
                    <div class="subtitle">VIT University Car Rental Management System</div>
                </div>
                
                <div class="authors">
                    <h3>👨‍💻 Project Authors</h3>
                    <div class="author-name">Akshat Srivastava</div>
                    <div class="author-name">Krish Jariwala</div>
                    <p style="margin: 10px 0 0 0; color: #666;">VIT University - DBMS Final Project</p>
                </div>
                
                <h1>🎯 Demo Mode</h1>
                <p>This is a demonstration of the VITrentals Car Rental Management System for our DBMS project. The system showcases advanced database concepts, normalization, and full-stack web development.</p>
                
                <h2>📋 Demo Credentials</h2>
                <div class="demo-credentials">
                    <div class="credential">
                        <strong>Admin Login:</strong><br>
                        Email: admin@demo.com<br>
                        Password: admin123
                    </div>
                    <div class="credential">
                        <strong>Customer Login:</strong><br>
                        Email: customer@demo.com<br>
                        Password: customer123
                    </div>
                    <div class="credential">
                        <strong>Office Login:</strong><br>
                        Email: office@demo.com<br>
                        Password: office123
                    </div>
                </div>
                
                <h2>🎯 Features to Demonstrate</h2>
                <ul>
                    <li>✅ User Authentication (Login/Logout)</li>
                    <li>✅ Different User Roles (Admin, Customer, Office)</li>
                    <li>✅ Car Management System</li>
                    <li>✅ Reservation System</li>
                    <li>✅ Search and Filter Functions</li>
                    <li>✅ Responsive Web Interface</li>
                    <li>✅ Database Integration (when MySQL is set up)</li>
                </ul>
                
                <h2>🚀 Quick Start</h2>
                <a href="/" class="btn">🏠 Home Page</a>
                <a href="/signin" class="btn">🔐 Login</a>
                <a href="/admin" class="btn">👨‍💼 Admin Panel</a>
                <a href="/customer-home" class="btn">👤 Customer Dashboard</a>
                <a href="/office-home" class="btn">🏢 Office Dashboard</a>
                
                <h2>📊 Database Features</h2>
                <p>This project demonstrates:</p>
                <ul>
                    <li>Database Normalization (up to BCNF)</li>
                    <li>CRUD Operations (Create, Read, Update, Delete)</li>
                    <li>SQL Queries and Functions</li>
                    <li>Data Integrity and Constraints</li>
                    <li>User Authentication and Authorization</li>
                </ul>
            </div>
        </body>
        </html>
    `);
});



/*post requests*/
// ---------------------------------------------------------------------------------------------------------------------

app.post("/signup-landing", (req, res) => {
    email = req.body.email;
    res.render("signup.ejs", { userEmail: email });
});

app.post("/signin", (req, res) => {
    if (!dbConnected) {
        // Demo mode - simulate successful login
        const email = req.body.email;
        const password = req.body.password;
        
        // Demo credentials for different user types
        if (email === "admin@demo.com" && password === "admin123") {
            const user = { email: "admin@demo.com", role: "admin" };
            const accessToken = jwt.sign({ user, role: "admin" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie("token", accessToken, cookieOptions);
            return res.redirect("/admin");
        } else if (email === "customer@demo.com" && password === "customer123") {
            const user = { email: "customer@demo.com", role: "customer" };
            const accessToken = jwt.sign({ user, role: "customer" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie("token", accessToken, cookieOptions);
            return res.redirect("/customer-home");
        } else if (email === "office@demo.com" && password === "office123") {
            const user = { email: "office@demo.com", role: "office" };
            const accessToken = jwt.sign({ user, role: "office" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie("token", accessToken, cookieOptions);
            return res.redirect("/office-home");
        } else {
            return res.redirect("/signin?error=demo");
        }
    }
    
    checkDatabaseConnection(res, () => {
        //check first in customer, if it doesn't exist check in office
        email = req.body.email;
        password = req.body.password;
        //check in admin in database
        db.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
            if (err)
                return res.status(500).json({ message: err.message });
            if (result.length > 0) {
                //check if the password is correct
                bcrypt.compare(password, result[0].password, function (err, response) {
                    if (response) {
                        //authenticating and authorize the user
                        const user = result[0];
                        const accessToken = jwt.sign({ user, role: "admin" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
                        res.cookie("token", accessToken, cookieOptions);
                        res.redirect("/admin");
                    }else{
                        res.redirect("/signin");
                    }
                });
            } else {
                //check in customer
                db.query("SELECT * FROM customer WHERE email = ?", [email], (err, result) => {
                    if (err)
                        return res.status(500).json({ message: err.message });
                    if (result.length > 0) {
                        bcrypt.compare(password, result[0].password, function (err, response) {
                            if (response) {
                                const user = result[0];
                                const accessToken = jwt.sign({ user, role: "customer" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
                                res.cookie("token", accessToken, cookieOptions);
                                res.redirect("/customer-home");
                            }else{
                                res.redirect("/signin");
                            }
                        });
                    } else {
                        db.query("SELECT * FROM office WHERE email = ?", [email], (err, result) => {
                            if (err)
                                return res.status(500).json({ message: err.message });
                            if (result.length > 0) {
                                bcrypt.compare(password, result[0].password, function (err, response) {
                                    if (response) {
                                        const user = result[0];
                                        const accessToken = jwt.sign({ user, role: "office" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
                                        res.cookie("token", accessToken, cookieOptions);
                                        res.redirect("/office-home")
                                    } else
                                        res.redirect("/signin");
                                });
                            } else {
                                res.redirect("/signin");
                            }
                        });
                    }
                });
            }
        });
    });
});

app.post("/signup", (req, res) => {
    if (!dbConnected) {
        // Demo mode - simulate successful signup
        return res.json({ 
            success: true, 
            message: "Demo mode: Signup successful! Please login with demo credentials.",
            demo: true 
        });
    }
    
    checkDatabaseConnection(res, () => {
        //signing up as a customer
        let email = req.body.email;
        let password = req.body.password;
        let fName = req.body.fName;
        let lName = req.body.lName;
        let ssn = req.body.ssn;
        let creditCardNo = req.body.credit_card_no;
        let holdreName = req.body.holder_name;
        let expDate = req.body.credit_card_expiry_date;
        let cvv = req.body.credit_card_cvv;
        let phone = req.body.phone_no;
        
        //add credit card info to the database
        db.query("INSERT INTO credit_card (card_no, holder_name, exp_date, cvv) VALUES (?,?,?,?)",
            [creditCardNo, holdreName, expDate, cvv], (err, result) => {
                if (err){
                    console.log(err);
                    return res.status(500).json({ message: err.message });
                }
                    
            });
        //convert password to hash
        bcrypt.hash(password, saltRound, function (err, hash) {
            if (err) {
                return res.status(500).json({ message: "Password hashing failed" });
            }
            //store the info inside the database
            db.query("INSERT INTO customer (email, password, fname, lname, ssn, phone_no) VALUES (?,?,?,?,?,?)",
                [email, hash, fName, lName, ssn, phone], (err, result) => {
                    if (err){
                        console.log(err);
                        return res.status(500).json({ message: err.message });
                    }

                    db.query("INSERT INTO customer_credit (ssn, card_no) VALUES (?,?)",
                        [ssn, creditCardNo], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({ message: err.message });
                            } else {
                                //authenticating and authorize the user
                                const user = result[0];
                                const accessToken = jwt.sign({ user, role: "customer" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
                                res.cookie("token", accessToken, cookieOptions);
                                /*Sending mail*/
                                var mailOptions = {
                                    from: process.env.EMAIL,
                                    to: email,
                                    subject: 'Welcome to VaCarTion🚘💚',
                                    text:"Welcome to VaCarTion!\nFrom all of us at VaCarTion, we wish you a splendid experience Ride away!\n\n\n\nRegards,\nThe VaCarTion team"
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                                res.redirect("/signin");
                            }
                        });
                });
        });
    });
});

app.post("/office-signup", (req, res) => {
    //signing up as an office
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone_no;
    let password = req.body.password;
    let country = req.body.country;
    let city = req.body.city;
    let building_no = req.body.building_no;

    //convert password to hash
    bcrypt.hash(password, saltRound, function (err, hash) {
        //store the info inside the database
        db.query("INSERT INTO office (email, password, name, phone_no, country, city, building_no) VALUES (?,?,?,?,?,?,?)",
            [email, hash, name, phone, country, city, building_no], (err, result) => {
                if (err)
                    return res.send({ message: err });

                //authenticating and authorize the user
                const user = result[0];
                const accessToken = jwt.sign({ user, role: "office" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
                res.cookie("token", accessToken, cookieOptions);
                res.send({ success: true });
            });
    });
});

//post request to add a car
app.post("/add-car", authorizeOffice, (req, res) => {
    let plateId = req.body.plate_id;
    let model = req.body.model;
    let make = req.body.make;
    let year = req.body.year;
    let price = req.body.price;
    let token = decodeToken(req.cookies.token);
    let officeId = token.user.office_id;
    let photo1 = req.body.photo1;
    let photo2 = req.body.photo2;
    let photo3 = req.body.photo3;

    //store the info inside the database
    db.query("INSERT INTO car (plate_id, model, make, year, price, office_id) VALUES (?,?,?,?,?,?)",
        [plateId, model, make, year, price, officeId], (err, result) => {
            if (err){
                console.log(err);
                return res.send({ message: err });
            }            
            //make the car status = 0 (available) in the car_status table
            db.query("INSERT INTO car_status (plate_id) VALUES (?)",
                [plateId], (err, result) => {
                    if (err){
                        console.log(err);
                        return res.send({ message: err });
                    }
                    if(photo1 !== "")
                        db.query("INSERT INTO car_photos (plate_id, photo) VALUES (?,?)",
                            [plateId, photo1], (err, result) => {
                                if (err){
                                    console.log(err);
                                    return res.send({ message: err });
                                }
                            });
                    if(photo2 !== "")
                        db.query("INSERT INTO car_photos (plate_id, photo) VALUES (?,?)",
                            [plateId, photo2], (err, result) => {
                                if (err){
                                    console.log(err);
                                    return res.send({ message: err });
                                }
                            });
                    if(photo3 !== "")
                        db.query("INSERT INTO car_photos (plate_id, photo) VALUES (?,?)",
                            [plateId, photo3], (err, result) => {
                                if (err){
                                    console.log(err);
                                    return res.send({ message: err });
                                }
                            });

                    res.send({ message: "Car added successfully" });
                });
        });
});

//post request to add a reservation
app.post("/add-reservation", authorizeCustomer, (req, res) => {
    let decodedToken = decodeToken(req.cookies.token);
    let ssn = decodedToken.user.ssn;
    let plateId = req.body.plateId;
    let pickupDate = req.body.pickupDate;
    let returnDate = req.body.returnDate;
    let payNow = req.body.payNow;

    let pickupForCarStatus = pickupDate + " 00:00:00";
    let returnForCarStatus = returnDate + " 23:59:59";

    var query = '';
    if (payNow === "true")
        query = "INSERT INTO reservation (ssn, plate_id, pickup_date, return_date, payment_date) VALUES (?,?,?,?, CURDATE())";
    else
        query = "INSERT INTO reservation (ssn, plate_id, pickup_date, return_date) VALUES (?,?,?,?)";
    db.query(query,
        [ssn, plateId, pickupDate, returnDate], (err, result) => {
            if (err)
                return res.send({ message: err });

            db.query("INSERT INTO car_status (plate_id, status_code, status_date) VALUES (?,?,?)",
                [plateId, 3, pickupForCarStatus], (err, result) => {
                    if (err)
                        return res.send({ message: err });
                    db.query("INSERT INTO car_status (plate_id, status_code, status_date) VALUES (?,?,?)",
                        [plateId, 0, returnForCarStatus], (err, result) => {
                            if (err)
                                return res.send({ message: err });
                            res.send({ success: true });
                        });
                });
        });
});


//check if ssn is already taken in customer
app.post("/check-ssn-customer", (req, res) => {
    let ssn = req.body.ssn;
    db.query("SELECT * FROM customer WHERE ssn = ?", [ssn], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

app.post("/delete-car", authorizeOffice, (req, res) => {
    let plate_id = req.body.plate_id;
    //get office_id from the token
    let decodedToken = decodeToken(req.cookies.token);
    let office_id = decodedToken.user.office_id;
    //check that only the office having that car can delete it
    db.query("SELECT office_id FROM `car` WHERE plate_id = ?", [plate_id], (err, result) => {
        if (err)
            return res.send({ message: err });
        if (result[0].office_id == office_id) {
            db.query("DELETE FROM `car` WHERE plate_id = ?", [plate_id], (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ success: true });
            });
        } else {
            res.send({ success: false, message: "You are not authorized to change the status of this car" });
        }
    });
});

app.post("/add-new-status", authorizeOffice, (req, res) => {
    let status = req.body.status;
    let plate_id = req.body.plate_id;
    //get office_id from the token
    let decodedToken = decodeToken(req.cookies.token);
    let office_id = decodedToken.user.office_id;
    //check that only the office having that car can changes its status
    db.query("SELECT office_id FROM `car` WHERE plate_id = ?", [plate_id], (err, result) => {
        if (err)
            return res.send({ message: err });
        if (result[0].office_id == office_id) {
            //DATE_ADD(curDate(), INTERVAL 10 DAY)
            db.query("INSERT INTO `car_status`(`plate_id`, `status_code`, `status_date`) VALUES (?,?,CURRENT_TIMESTAMP())", [plate_id, status], (err, result) => {
                if (err)
                    return res.send({ success: false, message: err });
                res.send({ success: true });
            });
        } else {
            res.send({ success: false, message: "You are not authorized to change the status of this car" });
        }
    });
});

//check if email is already taken in customer
app.post("/check-email-customer", (req, res) => {
    let email = req.body.email;
    db.query("SELECT * FROM customer WHERE email = ?", [email], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

//check if email is already taken for office
app.post("/check-email-office", (req, res) => {
    let email = req.body.email;
    db.query("SELECT * FROM office WHERE office.email = ?", [email], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

//check if phone is already taken for customer
app.post("/check-phone-customer", (req, res) => {
    let phone = req.body.phone;
    db.query("SELECT * FROM customer WHERE phone_no = ?", [phone], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

//check if phone is already taken for office
app.post("/check-phone-office", (req, res) => {
    let phone = req.body.phone;
    db.query("SELECT * FROM office WHERE phone_no = ?", [phone], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

//car reservation search
app.post("/get-car-reservation", authorizeAdmin, (req, res) => {
    var plate_id = req.body.plate_id;
    ///get the reservation info from the database
    db.query("SELECT * FROM reservation NATURAL INNER JOIN car WHERE plate_id = ?",
        [plate_id], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservation: result, message: "success" });
        });
});

//get customer name from ssn
app.post("/get-customer-name", authroizeAdminOrCustomer, (req, res) => {
    let token = decodeToken(req.cookies.token);
    var ssn = token.user.ssn;
    ///get the reservation info from the database
    db.query("SELECT fname,lname FROM customer WHERE ssn = ?",
        [ssn], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ customer: result, message: "success" });
        });
});

//get office name from office_id
app.post("/get-office-name", authorizeOffice, (req, res) => {
    let token = decodeToken(req.cookies.token);
    var id = token.user.office_id;
    ///get the reservation info from the database
    db.query("SELECT name FROM office WHERE office_id = ?",
        [id], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ office: result, message: "success" });
        });
});
// office reservations search
app.post("/get-office-reservation", authorizeOffice, (req, res) => {
    //get decoded token from the request
    let token = decodeToken(req.cookies.token);
    var id = token.user.office_id;
    ///get the reservation info from the database
    db.query("SELECT * , ((DATEDIFF(return_date,pickup_date)+1)*price ) as revenue FROM reservation JOIN car ON reservation.plate_id = car.plate_id JOIN office on car.office_id = office.office_id JOIN customer ON reservation.ssn = customer.ssn where office.office_id = ?",
        [id], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservations: result, message: "success" });
        });
});

// customer reservation search
app.post("/get-customer-reservation", authroizeAdminOrCustomer, (req, res) => {
    //get decoded token from the request
    user = decodeToken(req.cookies.token);
    var ssn = user.user.ssn;
    if (ssn == null)
        ssn = req.body.ssn;
    ///get the reservation info from the database
    db.query("SELECT *, ((DATEDIFF(return_date,pickup_date)+1)*price )as revenue FROM reservation as r NATURAL INNER JOIN customer INNER JOIN car as c on c.plate_id = r.plate_id WHERE r.ssn = ?",
        [ssn], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservation: result, message: "success" });
        });
});


//payments at certain period search
app.post("/get-payments-within-period", authorizeAdmin, (req, res) => {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    //get the payments info from the database within the period
    db.query("SELECT *,((DATEDIFF(return_date,pickup_date)+1)*price )as revenue FROM reservation NATURAL INNER JOIN car WHERE payment_date BETWEEN ? AND ?",
        [start_date, end_date], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ payment: result, message: "success" });
        });
});


// reservations at certain period search
app.post("/get-reservations-within-period", authorizeAdmin, (req, res) => {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    //get the reservation info from the database within the period
    db.query("SELECT * FROM reservation as r NATURAL INNER JOIN customer INNER JOIN car as c on c.plate_id = r.plate_id WHERE reserve_date BETWEEN ? AND ?",
        [start_date, end_date], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservation: result, message: "success" });
        });
});

// reservation at certain period search for a specific car
app.post("/get-car-reservation-within-period", authorizeAdmin, (req, res) => {
    var plate_id = req.body.plate_id;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    ///get the reservation info from the database
    db.query("SELECT * FROM reservation as r NATURAL INNER JOIN customer INNER JOIN car as c on c.plate_id = r.plate_id WHERE r.plate_id = ? AND reserve_date BETWEEN ? AND ?",
        [plate_id, start_date, end_date], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservation: result, message: "success" });
        });
});

//get all the models of cars
app.post("/get-all-cars-models", (req, res) => {
    //get the cars info from the database
    db.query("SELECT DISTINCT model FROM car",
        (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ carModels: result, message: "success" });
        });
});

//get all the makes of cars for a specific model
app.post("/get-all-cars-makes", (req, res) => {
    var model = req.body.model;
    //get the cars info from the database
    if (model == 'Any')
        db.query("SELECT DISTINCT make FROM car",
            [model], (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ carMakes: result, message: "success" });
            });
    else
        db.query("SELECT DISTINCT make FROM car WHERE model = ?",
            [model], (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ carMakes: result, message: "success" });
            });
});

//get the cars with specific model
app.post("/get-cars-using-model", (req, res) => {
    var model = req.body.model;
    //get the cars info from the database
    db.query("SELECT * FROM car WHERE model = ?",
        [model], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ cars: result, message: "success" });
        });
});

app.post("/get-all-offices", (req, res) => {
    db.query("SELECT * FROM office",
        (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ offices: result, message: "success" });
        });
});
//get the cars with specific make
app.post("/get-cars-using-make", (req, res) => {
    var make = req.body.make;
    //get the cars info from the database
    db.query("SELECT * FROM car WHERE make = ?",
        [make], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ cars: result, message: "success" });
        });
});

//get the cars with specific model and make
app.post("/get-cars-using-model-and-make", (req, res) => {
    var model = req.body.model;
    var make = req.body.make;
    //get the cars info from the database
    db.query("SELECT * FROM car WHERE model = ? AND make = ?",
        [model, make], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ cars: result, message: "success" });
        });
});

//get the cars with specific office id
//1
app.post("/get-cars-using-office", authorizeOffice, (req, res) => {

    /*let date = req.body.date;
    date+=" 23:59:59";
    let query = `SELECT *
                FROM car_status
                NATURAL INNER JOIN car
                WHERE (plate_id,status_date) in (SELECT plate_id, MAX(status_date)
                                                FROM car_status
                                                where status_date <= ?
                                                GROUP BY plate_id);`
    db.query(query, [date], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ carStatus: result, message: "success" });
    });*/ 
    let token = decodeToken(req.cookies.token);
    var office_id = token.user.office_id;

    db.query(`SELECT *
                FROM car_status
                NATURAL INNER JOIN car
                WHERE (plate_id,status_date) in (SELECT plate_id, MAX(status_date)
                                                FROM car_status
                                                where status_date <= CURRENT_TIMESTAMP()
                                                GROUP BY plate_id) AND office_id = ?`,
        [office_id], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ cars: result, message: "success" });
        });
});

app.post("/get-most-rented-model", authorizeAdmin, (req, res) => {
    db.query("SELECT model, COUNT(*) as count FROM reservation NATURAL INNER JOIN car GROUP BY model ORDER BY count DESC LIMIT 1", (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ mostRentedModel: result, message: "success" });
    });
});

app.post("/get-most-rented-make", authorizeAdmin, (req, res) => {
    db.query("SELECT make, COUNT(*) as count FROM reservation NATURAL INNER JOIN car GROUP BY make ORDER BY count DESC LIMIT 1", (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ mostRentedMake: result, message: "success" });
    });
});

app.post("/get-most-profitable-office", authorizeAdmin, (req, res) => {
    let query = `SELECT o.name, o.office_id, SUM(((DATEDIFF(r.return_date,r.pickup_date)+1)*c.price )) as total
                FROM reservation as r
                NATURAL INNER JOIN car as c
                INNER JOIN office as o ON o.office_id = c.office_id
                WHERE r.payment_date is not null
                GROUP BY c.office_id 
                ORDER BY total DESC 
                LIMIT 1;`
    db.query(query, (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ mostProfitableOffice: result, message: "success" });
    });
});
//2
app.post("/get-car-status-on-a-day", authorizeAdmin, (req, res) => {
    let date = req.body.date;
    console.log(date);
    date+=" 23:59:59";
    let query = `SELECT *
                FROM car_status
                NATURAL INNER JOIN car
                WHERE (plate_id,status_date) in (SELECT plate_id, MAX(status_date)
                                                FROM car_status
                                                where status_date <= ?
                                                GROUP BY plate_id);`
    db.query(query, [date], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ carStatus: result, message: "success" });
    });
});

app.post("/get-car-status-by-plate-id", authorizeOffice, (req, res) => {
    let plate_id = req.body.plate_id;
    let query = `SELECT *
                FROM car_status
                NATURAL INNER JOIN car
                WHERE (plate_id,status_date) in (SELECT plate_id, MAX(status_date)
                                                FROM car_status
                                                where plate_id = ? and status_date <= current_timestamp()
                                                GROUP BY plate_id);`
    db.query(query, [plate_id], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ carStatus: result, message: "success" });
    });
});

app.post("/advanced-search", authorizeAdmin, (req, res) => {
    let model = req.body.model;
    let make = req.body.make;
    let year = req.body.year;
    let plate_id = req.body.plate_id;
    let ssn = req.body.ssn;
    let fname = req.body.fName;
    let lname = req.body.lName;
    let customerEmail = req.body.email;
    let customerPhone = req.body.phone_no;
    let reservationDate = req.body.reservation_date;
    //query reservation and join with customer and car to get the info
    let query1 = `SELECT * FROM reservation as r
                NATURAL LEFT JOIN car AS c
                LEFT JOIN customer AS cu ON cu.ssn = r.ssn
                `

    let join = `UNION ALL\n`
    let query2 = `SELECT * FROM reservation as r
                NATURAL RIGHT JOIN car As c
                RIGHT JOIN customer AS cu ON cu.ssn = r.ssn
                WHERE r.plate_id IS NULL`;

    //add the conditions to the query
    let conditions = [];
    if (model != "" && model != null) {
        conditions.push(`c.model = '${model}'`);
    }
    if (make != "" && make != null) {
        conditions.push(`c.make = '${make}'`);
    }
    if (year != "" && year != null) {
        conditions.push(`c.year = '${year}'`);
    }
    if (plate_id != "" && plate_id != null) {
        conditions.push(`c.plate_id = '${plate_id}'`);
    }
    if (ssn != "" && ssn != null) {
        conditions.push(`cu.ssn = '${ssn}'`);
    }
    if (fname != "" && fname != null) {
        conditions.push(`cu.fname = '${fname}'`);
    }
    if (lname != "" && lname != null) {
        conditions.push(`cu.lname = '${lname}'`);
    }
    if (customerEmail != "" && customerEmail != null) {
        conditions.push(`cu.email = '${customerEmail}'`);
    }
    if (customerPhone != "" && customerPhone != null) {
        conditions.push(`cu.phone_no = '${customerPhone}'`);
    }
    if (reservationDate != "" && reservationDate != null) {
        conditions.push(`r.reservation_date = '${reservationDate}'`);
    }
    if (conditions.length > 0) {
        query1 += " WHERE " + conditions.join(" AND ");
    }
    if (conditions.length > 0) {
        query2 += " AND " + conditions.join(" AND ");
    }
    let query = query1 + join + query2;
    db.query
        (query, (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservation: result, message: "success" });
        }
        );
});

app.post("/show-avaialable-cars", authorizeCustomer, (req, res) => {
    let pickup_date = req.body.pickup_date;
    let return_date = req.body.return_date;
    let date = pickup_date + " 23:59:59";
    let model = req.body.model;
    let make = req.body.make;
    let city = req.body.city;
    let country = req.body.country;
    let office_name = req.body.office_name;
    let office_build_no = req.body.office_build_no;
    let conditions = []

    let query = `SELECT *
                FROM car_status
                NATURAL INNER JOIN car as c
                NATURAL INNER JOIN office as o
                NATURAL INNER JOIN car_photos
                WHERE (plate_id,status_date) in (SELECT plate_id, MAX(status_date)
                                                FROM car_status
                                                where status_date <= ?
                                                GROUP BY plate_id) AND c.plate_id NOT IN (SELECT plate_id FROM reservation WHERE (pickup_date <= ? AND return_date >= ?) or (pickup_date <= ? AND return_date >= ?) or (pickup_date >= ? AND return_date <= ?) or (pickup_date <= ? AND return_date >= ?))`;
    if (model != "Any") {
        conditions.push(`c.model = '${model}'`);
    }
    if (make != "Any") {
        conditions.push(`c.make = '${make}'`);
    }
    if (city != "") {
        conditions.push(`o.city = '${city}'`);
    }
    if (country != "") {
        conditions.push(`o.country = '${country}'`);
    }
    if (office_name != "") {
        conditions.push(`o.name = '${office_name}'`);
    }
    if (office_build_no != "") {
        conditions.push(`o.building_no = '${office_build_no}'`);
    }
    if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
    }
    db.query(query, [date, pickup_date, pickup_date, pickup_date, return_date, pickup_date, return_date, pickup_date, return_date], (err, result) => {
        if (err)
            return res.send({ message: err });
        if(result != null)
            result = result.filter(car => car.status_code == 0);
        res.send({ cars: result, message: "success" });
    });
});

app.post("/pay-reservation",(req,res)=>{
    let reservation_no = req.body.reservation_no;
    let query = `UPDATE reservation SET payment_date = CURDATE() WHERE reservation_no = ?`;
    db.query(query, [reservation_no], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ message: "success" });
    });
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});


app.use(connectLiveReload());

app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server started on port:", process.env.PORT || 3000);
    console.log("🌐 Open your browser and go to: http://localhost:" + (process.env.PORT || 3000));
    console.log("📝 Note: Database features require MySQL to be installed and running");
});

// const liveReloadServer = livereload.createServer();
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

