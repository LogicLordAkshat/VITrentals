# VaCarTion - Car Rental Management System
## DBMS Final Project Documentation

### 🎯 Project Overview
VaCarTion is a comprehensive car rental management system built with Node.js, Express.js, and MySQL. This project demonstrates advanced database concepts, normalization, and full-stack web development for academic evaluation.

### 📋 Project Requirements Fulfilled

#### 1. **Database Normalization (up to BCNF)**
- **1NF**: All attributes contain atomic values
- **2NF**: No partial dependencies on composite primary keys
- **3NF**: No transitive dependencies
- **BCNF**: Every determinant is a candidate key

#### 2. **Sample Queries (DDL, DML, Constraints, SQL Functions)**
- **DDL**: Database schema creation with proper constraints
- **DML**: CRUD operations for all entities
- **Constraints**: Primary keys, foreign keys, unique constraints, check constraints
- **SQL Functions**: Aggregate functions, date functions, string functions

#### 3. **Backend Technology**
- **Node.js** with Express.js framework
- **MySQL** database integration
- **JWT** authentication and authorization
- **RESTful API** design

#### 4. **Frontend Technology**
- **HTML5** with semantic markup
- **CSS3** with responsive design
- **Bootstrap** for modern UI components
- **JavaScript** for dynamic interactions

#### 5. **Testing**
- **CRUD Operations**: Create, Read, Update, Delete for all entities
- **Edge Cases**: Input validation, error handling, boundary conditions
- **Authentication**: Login/logout, role-based access control

### 🗄️ Database Schema

#### Tables and Relationships:
1. **admin** - System administrators
2. **customer** - Car rental customers
3. **office** - Rental office locations
4. **car** - Vehicle inventory
5. **reservation** - Booking records
6. **credit_card** - Payment information
7. **customer_credit** - Customer-payment relationship
8. **car_photos** - Vehicle images
9. **car_status** - Vehicle availability status

#### Key Relationships:
- Customer → Reservation (1:Many)
- Car → Reservation (1:Many)
- Office → Car (1:Many)
- Customer → Credit Card (Many:Many)

### 🚀 Features Implemented

#### User Management:
- ✅ User registration and authentication
- ✅ Role-based access control (Admin, Customer, Office)
- ✅ Password hashing with bcrypt
- ✅ JWT token-based sessions

#### Car Management:
- ✅ Add/Edit/Delete vehicles
- ✅ Car status tracking (Available, Rented, Maintenance)
- ✅ Photo management
- ✅ Search and filtering

#### Reservation System:
- ✅ Create new reservations
- ✅ View booking history
- ✅ Payment processing
- ✅ Date conflict prevention

#### Admin Features:
- ✅ System analytics and reporting
- ✅ User management
- ✅ Revenue tracking
- ✅ Advanced search capabilities

### 🎮 Demo Mode

The application includes a demo mode for presentation without requiring database setup:

**Demo Credentials:**
- **Admin**: admin@demo.com / admin123
- **Customer**: customer@demo.com / customer123
- **Office**: office@demo.com / office123

**Demo URL**: http://localhost:3000/demo

### 📊 Database Normalization Analysis

#### Original Schema Issues:
- Some tables had potential normalization issues
- Redundant data storage in some areas

#### Improvements Made:
- Separated concerns into distinct tables
- Eliminated partial dependencies
- Removed transitive dependencies
- Ensured every determinant is a candidate key

### 🔧 Technical Implementation

#### Backend Architecture:
```
├── index.js (Main server file)
├── authServer.js (Authentication middleware)
├── package.json (Dependencies)
└── .env (Environment configuration)
```

#### Frontend Structure:
```
├── views/ (HTML templates)
├── static/ (CSS, JS, Images)
└── public/ (Static assets)
```

#### Database Scripts:
```
├── sql/DDL.sql (Database schema)
├── sql/DML.sql (Sample data)
└── sql/ENHANCED_DDL.sql (Improved schema)
```

### 🧪 Testing Strategy

#### CRUD Operations Tested:
1. **Create**: User registration, car addition, reservation creation
2. **Read**: Data retrieval, search functionality, reporting
3. **Update**: Profile updates, car status changes, reservation modifications
4. **Delete**: User deletion, car removal, reservation cancellation

#### Edge Cases Tested:
- Invalid input validation
- Duplicate email prevention
- Date conflict handling
- Authentication failures
- Database connection errors

### 📈 Performance Optimizations

- Database indexing on frequently queried columns
- Connection pooling for database operations
- Error handling and graceful degradation
- Responsive design for mobile compatibility

### 🔒 Security Features

- Password hashing with salt rounds
- JWT token expiration
- SQL injection prevention with parameterized queries
- Input validation and sanitization
- Role-based access control

### 📝 Installation and Setup

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - MySQL (v8.0 or higher)
   - npm package manager

2. **Installation**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   ```bash
   # Create database
   mysql -u root -p < sql/DDL.sql
   
   # Insert sample data
   mysql -u root -p < sql/DML.sql
   ```

4. **Environment Configuration**:
   ```bash
   # Update .env file with your database credentials
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=car_rental_system
   ```

5. **Run Application**:
   ```bash
   npm start
   ```

6. **Access Application**:
   - Main URL: http://localhost:3000
   - Demo Mode: http://localhost:3000/demo

### 🎓 Academic Value

This project demonstrates:
- **Database Design**: Proper normalization and relationship modeling
- **Web Development**: Full-stack application development
- **Security**: Authentication, authorization, and data protection
- **Testing**: Comprehensive testing strategies
- **Documentation**: Professional project documentation

### 📚 Learning Outcomes

Through this project, students will understand:
- Database normalization principles
- SQL query optimization
- Web application architecture
- User authentication and security
- API design and development
- Frontend-backend integration

### 🔮 Future Enhancements

- Real-time notifications
- Mobile application
- Advanced analytics dashboard
- Payment gateway integration
- GPS tracking for vehicles
- Customer review system

---

**Project Created By**: [Your Name]  
**Course**: Database Management Systems  
**Institution**: [Your Institution]  
**Date**: [Current Date]

### 📞 Support

For technical support or questions about this project, please refer to the demo page at http://localhost:3000/demo or check the source code documentation.
