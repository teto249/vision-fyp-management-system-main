const jwt = require('jsonwebtoken');
const UniAdmin = require('../models/UniAdmin');
const MainAdmin = require('../models/MainAdmin');
const Student = require('../models/Student');
const Supervisor = require('../models/Supervisor');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token not provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request based on role
    if (decoded.role === 'Student') {
      const student = await Student.findOne({
        where: { userId: decoded.username }
      });
      
      if (!student) {
        return res.status(404).json({ 
          success: false,
          message: 'Student not found' 
        });
      }
      
      req.user = {
        userId: student.userId,
        role: decoded.role,
        universityId: decoded.universityId
      };
    } else if (decoded.role === 'Supervisor') {
      const supervisor = await Supervisor.findOne({
        where: { userId: decoded.username }
      });
      
      if (!supervisor) {
        return res.status(404).json({ 
          success: false,
          message: 'Supervisor not found' 
        });
      }
      
      req.user = {
        userId: supervisor.userId,
        role: decoded.role,
        universityId: decoded.universityId
      };
    } else {
      // For other roles, just use the decoded token data
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

const authenticateUniAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify the user is a UniAdmin
    const uniAdmin = await UniAdmin.findOne({
      where: { username: decoded.username, role: 'UniAdmin' }
    });

    if (!uniAdmin) {
      return res.status(404).json({ 
        success: false,
        message: 'UniAdmin not found' 
      });
    }

    req.user = decoded;
    req.uniAdmin = uniAdmin;
    next();
  } catch (error) {
    console.error('UniAdmin auth error:', error);
    return res.status(403).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = {
  authenticateToken,
  authenticateUniAdmin
};
