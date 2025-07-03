const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const MainAdmin = require("../models/MainAdmin");
const UniAdmin = require("../models/UniAdmin");
const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");
 

exports.login = async (req, res) => {
  const { username, password } = req.body;

  
  try {
    if (!username || !password) {
      console.log(' Missing credentials');
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    let user = null;
    let userType = null;

    
    const userQueries = [
      {
        model: MainAdmin,
        where: { [Op.or]: [{ username }, { email: username }] },
        defaultRole: "MainAdmin",
      },
      {
        model: UniAdmin,
        where: { [Op.or]: [{ username }, { primaryEmail: username }] },
        defaultRole: "UniAdmin",
      },
      {
        model: Student,
        where: { userId: username },
        defaultRole: "Student",
        include: ['University'] 
      },
      {
        model: Supervisor,
        where: { userId: username },
        defaultRole: "Supervisor",
      },
    ];

    
    
    for (const query of userQueries) {
      console.log(`  Checking ${query.defaultRole} table...`);
      const result = await query.model.findOne({ 
        where: query.where,
        include: query.include 
      });
      if (result) {
        user = result;
        userType = query.defaultRole;
        
        break;
      }
    }

    if (!user) {
      
      return res.status(404).json({ message: "User not found" });
    }

    console.log(' User found:');
    console.log('  User type:', userType);
    console.log('  User data:', {
      username: user.userId || user.username,
      name: user.name || user.fullName,
      role: userType
    });

    // Handle different authentication for different roles
    let isValidPassword = false;

    if (userType === "Student" || userType === "Supervisor") {
      // For students and supervisors, password should match their ID
      isValidPassword = password === user.userId;
     
    } else {
      // For admins, use bcrypt comparison
      
      isValidPassword = await bcrypt.compare(password, user.password);
      console.log('  Password hash in DB:', user.password ? user.password.substring(0, 20) + '...' : 'null');
      console.log('  Password comparison result:', isValidPassword);
    }

    if (!isValidPassword) {
     
      return res.status(401).json({ message: "Invalid credentials" });
    }

  

    // Create JWT token
    const token = jwt.sign(
      {
        username: user.userId || user.username,
        role: userType,
        universityId: user.universityId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    // Prepare response based on user type
    let responseUser;

    if (userType === "Student") {
      responseUser = {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        universityEmail: user.universityEmail,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: userType,
        level: user.level,
        universityId: user.universityId,
        department: user.department,
        supervisorId: user.supervisorId,
        requirePasswordChange: user.requirePasswordChange,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        university: user.University ? {
          id: user.University.id,
          shortName: user.University.shortName,
          fullName: user.University.fullName,
        } : null
      };    } else {
      responseUser = {
        username: user.userId || user.username,
        userId: user.userId || user.username, 
        fullName: user.fullName,
        role: userType,
        email:
          userType === "MainAdmin"
            ? user.email
            : userType === "UniAdmin"
            ? user.primaryEmail
            : user.universityEmail,
        universityId: user.universityId,
        ...(userType === "Student" && { level: user.level }),
      };
    }

    console.log(' Sending response:');
    console.log('  User role:', userType);
    console.log('  Response user:', responseUser);

    res.status(200).json({
      message: "Login successful",
      token,
      user: responseUser,
    });

  
  } catch (error) {
    console.error('💥 Login error:', error.message);
    console.error('📋 Error stack:', error.stack);
    
    // Enhanced error response with more details to help debug
    res.status(500).json({
      message: "An unexpected error occurred during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      details: process.env.NODE_ENV === "development" ? {
        stack: error.stack,
        name: error.name
      } : undefined
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { username, role } = req.user;

    // Only allow Students and Supervisors to use this endpoint
    if (role !== "Student" && role !== "Supervisor") {
      return res.status(403).json({
        message: "This endpoint is only for Students and Supervisors",
      });
    }

    const UserModel = role === "Student" ? Student : Supervisor;
    const user = await UserModel.findOne({
      where: { userId: username },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password matches
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password and update it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to change password",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
