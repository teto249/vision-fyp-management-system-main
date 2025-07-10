const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const MainAdmin = require("../models/MainAdmin");
const UniAdmin = require("../models/UniAdmin");
const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");
 

exports.login = async (req, res) => {
  // Debug request body
  console.log('📥 Raw request body:', req.body);
  console.log('📥 Request body keys:', Object.keys(req.body));
  console.log('📥 Request content-type:', req.headers['content-type']);
  
  const { username, password } = req.body;

  console.log('🔐 Login attempt received with username:', username);
  console.log('🔐 Password length:', password ? password.length : 'No password provided');

  // Set a timeout for the login process
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({ message: "Login request timed out" });
    }
  }, 30000); // 30 second timeout

  try {
    if (!username || !password) {
      console.log('❌ Missing credentials');
      clearTimeout(timeoutId);
      return res.status(400).json({ message: "Username and password are required" });
    }

    let user = null;
    let userType = null;

    // Check MainAdmin table
    console.log('🔍 Checking MainAdmin table for:', username);
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

    // Check UniAdmin table if not found in MainAdmin
    if (!user) {
      console.log('🔍 Checking UniAdmin table for:', username);
      try {
        user = await UniAdmin.findOne({ 
          where: { 
            [Op.or]: [
              { username: username }, 
              { primaryEmail: username }
            ] 
          },
          timeout: 8000
        });
        
        if (user) {
          userType = "UniAdmin";
          console.log('✅ UniAdmin found');
        }
      } catch (dbError) {
        console.log('❌ UniAdmin query error:', dbError.message);
      }
    }

    // Check Supervisor table if not found yet
    if (!user) {
      console.log('🔍 Checking Supervisor table for:', username);
      try {
        user = await Supervisor.findOne({ 
          where: { 
            [Op.or]: [
              { userId: username }, 
              { universityEmail: username }
            ] 
          },
          timeout: 8000
        });
        
        if (user) {
          userType = "Supervisor";
          console.log('✅ Supervisor found');
        }
      } catch (dbError) {
        console.log('❌ Supervisor query error:', dbError.message);
      }
    }

    // Check Student table if not found yet
    if (!user) {
      console.log('🔍 Checking Student table for:', username);
      try {
        user = await Student.findOne({ 
          where: { 
            [Op.or]: [
              { userId: username }, 
              { universityEmail: username }
            ] 
          },
          timeout: 8000
        });
        
        if (user) {
          userType = "Student";
          console.log('✅ Student found');
        }
      } catch (dbError) {
        console.log('❌ Student query error:', dbError.message);
      }
    }

    if (!user) {
      console.log('❌ User not found in any table');
      clearTimeout(timeoutId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('✅ User found:');
    console.log('  User type:', userType);
    console.log('  User data:', {
      username: user.username || user.userId,
      name: user.name || user.fullName,
      role: userType
    });

    // Handle authentication for different user types
    let isValidPassword = false;

    console.log('🔐 Checking password for', userType + '...');
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

    // Create JWT token with appropriate data based on user type
    let tokenData = {
      role: userType,
    };

    let responseUser = {
      role: userType,
    };

    // Set user-specific data based on type
    if (userType === "MainAdmin") {
      tokenData.username = user.username;
      tokenData.institutionId = user.institutionId;
      
      responseUser.username = user.username;
      responseUser.fullName = user.name;
      responseUser.email = user.email;
      responseUser.universityId = user.institutionId;
    } else if (userType === "UniAdmin") {
      tokenData.username = user.username;
      tokenData.universityId = user.universityId;
      
      responseUser.username = user.username;
      responseUser.fullName = user.fullName;
      responseUser.email = user.primaryEmail;
      responseUser.universityId = user.universityId;
    } else if (userType === "Supervisor") {
      tokenData.username = user.userId;
      tokenData.universityId = user.universityId;
      
      responseUser = {
        role: userType,
        userId: user.userId,
        username: user.userId,
        fullName: user.fullName,
        email: user.universityEmail,
        universityEmail: user.universityEmail,
        phoneNumber: user.phoneNumber,
        address: user.address,
        department: user.department,
        universityId: user.universityId,
        requirePasswordChange: user.requirePasswordChange,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } else if (userType === "Student") {
      tokenData.username = user.userId;
      tokenData.universityId = user.universityId;
      
      responseUser = {
        role: userType,
        userId: user.userId,
        username: user.userId,
        fullName: user.fullName,
        universityEmail: user.universityEmail,
        phoneNumber: user.phoneNumber,
        address: user.address,
        level: user.level,
        department: user.department,
        supervisorId: user.supervisorId,
        requirePasswordChange: user.requirePasswordChange,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        universityId: user.universityId,
        university: user.university
      };
    }
    const token = jwt.sign(
      tokenData,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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
    console.log('💥 Login error occurred');
    
    clearTimeout(timeoutId);
    // Enhanced error response with more details to help debug
    if (!res.headersSent) {
      res.status(500).json({
        message: "An unexpected error occurred during login",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
};

// Password Reset Functions
exports.initiatePasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = null;
    let userType = null;

    // Check all user types for the email
    try {
      user = await MainAdmin.findOne({ 
        where: { 
          [Op.or]: [
            { email: email },
            { username: email }
          ] 
        }
      });
      if (user) userType = "MainAdmin";
    } catch (error) {
      console.log('MainAdmin search error:', error.message);
    }

    if (!user) {
      try {
        user = await UniAdmin.findOne({ 
          where: { 
            [Op.or]: [
              { primaryEmail: email },
              { username: email }
            ] 
          }
        });
        if (user) userType = "UniAdmin";
      } catch (error) {
        console.log('UniAdmin search error:', error.message);
      }
    }

    if (!user) {
      try {
        user = await Supervisor.findOne({ 
          where: { 
            [Op.or]: [
              { universityEmail: email },
              { email: email },
              { userId: email }
            ] 
          }
        });
        if (user) userType = "Supervisor";
      } catch (error) {
        console.log('Supervisor search error:', error.message);
      }
    }

    if (!user) {
      try {
        user = await Student.findOne({ 
          where: { 
            [Op.or]: [
              { universityEmail: email },
              { email: email },
              { userId: email }
            ] 
          }
        });
        if (user) userType = "Student";
      } catch (error) {
        console.log('Student search error:', error.message);
      }
    }

    if (!user) {
      // For security, return success even if user not found
      return res.status(200).json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    // Generate a reset token (in a real app, this would be sent via email)
    const resetToken = jwt.sign(
      { 
        userId: user.userId || user.username || user.id,
        userType: userType,
        email: email
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: '1h' }
    );

    console.log(`Password reset initiated for ${userType}: ${email}`);
    console.log(`Reset token generated: ${resetToken}`);

    res.status(200).json({
      message: "Password reset initiated successfully",
      resetToken: resetToken, // In production, this would be sent via email
      userType: userType
    });

  } catch (error) {
    console.error('Password reset initiation error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const { userId, userType, email } = decoded;
    let user = null;

    // Find the user based on userType
    try {
      switch (userType) {
        case "MainAdmin":
          user = await MainAdmin.findOne({ 
            where: { 
              [Op.or]: [
                { username: userId },
                { email: email }
              ] 
            }
          });
          break;
        case "UniAdmin":
          user = await UniAdmin.findOne({ 
            where: { 
              [Op.or]: [
                { username: userId },
                { primaryEmail: email }
              ] 
            }
          });
          break;
        case "Supervisor":
          user = await Supervisor.findOne({ 
            where: { 
              [Op.or]: [
                { userId: userId },
                { universityEmail: email },
                { email: email }
              ] 
            }
          });
          break;
        case "Student":
          user = await Student.findOne({ 
            where: { 
              [Op.or]: [
                { userId: userId },
                { universityEmail: email },
                { email: email }
              ] 
            }
          });
          break;
        default:
          return res.status(400).json({ message: "Invalid user type" });
      }
    } catch (error) {
      console.error('User lookup error:', error);
      return res.status(500).json({ message: "Error finding user" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    try {
      await user.update({ password: hashedPassword });
      console.log(`Password updated successfully for ${userType}: ${userId}`);
      
      res.status(200).json({
        message: "Password reset successfully"
      });
    } catch (error) {
      console.error('Password update error:', error);
      res.status(500).json({ message: "Error updating password" });
    }

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    console.log('🔄 Change password request received');
    console.log('📝 Request body:', req.body);
    console.log('🔑 Authorization header:', req.headers.authorization ? 'Present' : 'Missing');

    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;

    // Validation
    if (!currentPassword || !newPassword) {
      console.log('❌ Missing password fields');
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header');
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7);
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      console.log('✅ Token decoded successfully:', {
        role: decoded.role,
        username: decoded.username,
        exp: decoded.exp
      });
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Extract user information from token
    const actualUserType = decoded.role;
    const userIdentifier = decoded.username;
    
    if (!actualUserType || !userIdentifier) {
      console.log('❌ Missing user information in token');
      return res.status(400).json({ message: "Invalid token data" });
    }
    
    console.log('🔍 Looking for user:', { actualUserType, userIdentifier });
    
    let user = null;

    try {
      switch (actualUserType) {
        case "MainAdmin":
          user = await MainAdmin.findOne({ where: { username: userIdentifier } });
          break;
        case "UniAdmin":
          user = await UniAdmin.findOne({ where: { username: userIdentifier } });
          break;
        case "Supervisor":
          user = await Supervisor.findOne({ where: { userId: userIdentifier } });
          break;
        case "Student":
          user = await Student.findOne({ where: { userId: userIdentifier } });
          break;
        default:
          console.log('❌ Invalid user type:', actualUserType);
          return res.status(400).json({ message: `Invalid user type: ${actualUserType}` });
      }
    } catch (dbError) {
      console.error('❌ Database lookup error:', dbError);
      return res.status(500).json({ message: "Database error during user lookup" });
    }

    if (!user) {
      console.log('❌ User not found for:', { actualUserType, userIdentifier });
      return res.status(404).json({ message: "User not found" });
    }

    console.log('✅ User found successfully');

    // Verify current password
    let isCurrentPasswordValid = false;
    try {
      isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      console.log('🔐 Current password verification:', isCurrentPasswordValid ? 'Valid' : 'Invalid');
    } catch (bcryptError) {
      console.error('❌ Password comparison error:', bcryptError);
      return res.status(500).json({ message: "Password verification error" });
    }

    if (!isCurrentPasswordValid) {
      console.log('❌ Current password is incorrect');
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update the user's password (let the model handle hashing)
    try {
      console.log('🔄 Updating password in database...');
      console.log(`   User ID: ${userIdentifier}`);
      console.log(`   User Type: ${actualUserType}`);
      console.log(`   Letting model handle password hashing...`);
      
      // Pass the raw password - the model's beforeSave hook will hash it
      await user.update({ password: newPassword });
      
      console.log(`✅ Password changed successfully for ${actualUserType}: ${userIdentifier}`);
      
      return res.status(200).json({
        message: "Password changed successfully"
      });
    } catch (updateError) {
      console.error('❌ Password update error:', updateError);
      return res.status(500).json({ message: "Password update error" });
    }
  } catch (error) {
    console.error('💥 Unexpected error in changePassword:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
