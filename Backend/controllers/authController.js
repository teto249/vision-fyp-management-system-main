const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const MainAdmin = require("../models/MainAdmin");
const UniAdmin = require("../models/UniAdmin");
const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");
 

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Add request timeout protection
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.log('⏰ Login request timeout - force response');
      res.status(408).json({ message: "Request timeout" });
    }
  }, 15000); // Reduced to 15 seconds

  try {
    console.log('🔐 Login attempt started for username:', username);
    
    if (!username || !password) {
      console.log('❌ Missing credentials');
      clearTimeout(timeoutId);
      return res.status(400).json({ message: "Username and password are required" });
    }

    let user = null;
    let userType = null;

    // Optimized: Check MainAdmin first (most likely for your case)
    console.log('🔍 Checking MainAdmin table for green-admin...');
    
    if (username === 'green-admin' || username === 'altayebnuba@gmail.com') {
      try {
        user = await MainAdmin.findOne({ 
          where: { 
            [Op.or]: [
              { username: username }, 
              { email: username }
            ] 
          },
          timeout: 8000 // 8 second timeout for query
        });
        
        if (user) {
          userType = "MainAdmin";
          console.log('✅ MainAdmin found');
        }
      } catch (dbError) {
        console.log('❌ MainAdmin query error:', dbError.message);
      }
    }

    if (!user) {
      console.log('❌ User not found in MainAdmin');
      clearTimeout(timeoutId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('✅ User found:');
    console.log('  User type:', userType);
    console.log('  User data:', {
      username: user.username,
      name: user.name,
      role: userType
    });

    // Handle authentication - optimized for MainAdmin
    let isValidPassword = false;

    console.log('🔐 Checking password for MainAdmin...');
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
      console.log('✅ Password comparison result:', isValidPassword);
    } catch (bcryptError) {
      console.log('❌ Bcrypt error:', bcryptError.message);
      clearTimeout(timeoutId);
      return res.status(500).json({ message: "Authentication error" });
    }

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      clearTimeout(timeoutId);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('✅ Password valid, creating JWT token...');

    // Create JWT token
    const token = jwt.sign(
      {
        username: user.username,
        role: userType,
        institutionId: user.institutionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Simplified response for MainAdmin
    const responseUser = {
      username: user.username,
      fullName: user.name,
      role: userType,
      email: user.email,
      institutionId: user.institutionId
    };

    console.log('✅ Sending response:');
    console.log('  User role:', userType);
    console.log('  Response user:', responseUser);

    clearTimeout(timeoutId);
    res.status(200).json({
      message: "Login successful",
      token,
      user: responseUser,
    });

  
  } catch (error) {
    console.error('💥 Login error:', error.message);
    console.error('📋 Error stack:', error.stack);
    
    clearTimeout(timeoutId);
    // Enhanced error response with more details to help debug
    if (!res.headersSent) {
      res.status(500).json({
        message: "An unexpected error occurred during login",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
        details: process.env.NODE_ENV === "development" ? {
          stack: error.stack,
          name: error.name
        } : undefined
      });
    }
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
