const UniAdmin = require('../models/UniAdmin');
const University = require('../models/University');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Supervisor = require('../models/Supervisor');
const bcrypt = require('bcryptjs');

// Get UniAdmin account
exports.getUniAdminAccount = async (req, res) => {
  try {
    const { username } = req.query; // Changed from uniAdminId
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const uniAdmin = await UniAdmin.findOne({
      where: { username, role: 'UniAdmin' }, // Changed from id to username
      include: {
        model: University,
        as: 'university',
        attributes: [
          'id',
          'shortName',
          'fullName',
          'address',
          'email',
          'phone',
          'logoPath',
          'status',
        ],
      },
    });

    if (!uniAdmin) {
      return res.status(404).json({ message: 'UniAdmin not found' });
    }

    res.status(200).json({
      username: uniAdmin.username, // Changed from id
      fullName: uniAdmin.fullName,
      primaryEmail: uniAdmin.primaryEmail,
      phoneNumber: uniAdmin.phoneNumber,
      profilePhoto: uniAdmin.profilePhoto,
      role: uniAdmin.role,
      university: uniAdmin.university
        ? {
            id: uniAdmin.university.id,
            shortName: uniAdmin.university.shortName,
            fullName: uniAdmin.university.fullName,
            address: uniAdmin.university.address,
            email: uniAdmin.university.email,
            phone: uniAdmin.university.phone,
            logoPath: uniAdmin.university.logoPath,
            status: uniAdmin.university.status,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get UniAdmin account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update UniAdmin account
exports.updateUniAdminAccount = async (req, res) => {
  try {
    const {
      username, // Changed from id
      fullName,
      email,
      phoneNumber,
      profilePhoto,
      universityData,
    } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const uniAdmin = await UniAdmin.findOne({
      where: { username, role: 'UniAdmin' }, // Changed from id to username
    });

    if (!uniAdmin) {
      return res.status(404).json({ message: 'UniAdmin not found' });
    }

    // Update UniAdmin fields
    const uniAdminUpdates = {};
    if (fullName) uniAdminUpdates.fullName = fullName;
    if (email) uniAdminUpdates.primaryEmail = email;
    if (phoneNumber) uniAdminUpdates.phoneNumber = phoneNumber;
    if (profilePhoto) uniAdminUpdates.profilePhoto = profilePhoto;

    if (Object.keys(uniAdminUpdates).length > 0) {
      await uniAdmin.update(uniAdminUpdates);
    }

    // Update University if data provided
    if (universityData && uniAdmin.universityId) {
      const university = await University.findByPk(uniAdmin.universityId);
      if (university) {
        await university.update(universityData);
      }
    }

    // Fetch updated UniAdmin with University data
    const updatedUniAdmin = await UniAdmin.findOne({
      where: { username, role: 'UniAdmin' }, // Changed from id to username
      include: {
        model: University,
        as: 'university',
        attributes: [
          'id',
          'shortName',
          'fullName',
          'address',
          'email',
          'phone',
          'logoPath',
          'status',
        ],
      },
    });

    res.status(200).json({
      username: updatedUniAdmin.username, // Changed from id
      fullName: updatedUniAdmin.fullName,
      primaryEmail: updatedUniAdmin.primaryEmail,
      phoneNumber: updatedUniAdmin.phoneNumber,
      profilePhoto: updatedUniAdmin.profilePhoto,
      role: updatedUniAdmin.role,
      university: updatedUniAdmin.university
        ? {
            id: updatedUniAdmin.university.id,
            shortName: updatedUniAdmin.university.shortName,
            fullName: updatedUniAdmin.university.fullName,
            address: updatedUniAdmin.university.address,
            email: updatedUniAdmin.university.email,
            phone: updatedUniAdmin.university.phone,
            logoPath: updatedUniAdmin.university.logoPath,
            status: updatedUniAdmin.university.status,
          }
        : null,
    });
  } catch (error) {
    console.error('Failed to update UniAdmin account:', error);
    res.status(500).json({ message: error.message });
  }
};

// Register single user
exports.registerSingleUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the university ID from the authenticated UniAdmin
    const uniAdmin = await UniAdmin.findOne({
      where: { username: decoded.username, role: 'UniAdmin' }
    });

    if (!uniAdmin) {
      return res.status(404).json({ message: 'UniAdmin not found' });
    }

    const {
      fullName,
      universityEmail,
      phoneNumber,
      address,
      idNumber,
      department,
      role,
      level,
    } = req.body;
    
    // For students and supervisors, use ID as password without hashing
    const userData = {
      userId: idNumber,
      fullName,
      email: universityEmail,
      universityEmail,
      password: idNumber, // Store ID as plain password
      phoneNumber,
      address,
      department,
      universityId: uniAdmin.universityId,
      role: role
    };

    if (role === 'Supervisor') {
      const { contactEmail, officeAddress } = req.body;
      userData.contactEmail = contactEmail;
      userData.officeAddress = officeAddress;
      const supervisor = await Supervisor.create(userData);
      
      res.status(201).json({
        success: true,
        message: 'Supervisor registered successfully',
        userId: supervisor.userId,
        initialPassword: supervisor.userId
      });
    } else if (role === 'Student') {
      userData.level = level || 'PSM-1';
      const student = await Student.create(userData);
      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        userId: student.userId,
        initialPassword: student.userId
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: 'Invalid role specified' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Register bulk users
exports.registerBulkUsers = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the university ID from the authenticated UniAdmin
    const uniAdmin = await UniAdmin.findOne({
      where: { username: decoded.username, role: 'UniAdmin' }
    });

    if (!uniAdmin) {
      return res.status(404).json({ message: 'UniAdmin not found' });
    }

    const users = req.body;
    const results = [];

    for (const userData of users) {
      try {
        const baseUserData = {
          userId: userData.idNumber,
          fullName: userData.fullName,
          email: userData.universityEmail,
          universityEmail: userData.universityEmail,
          password: userData.idNumber, // Store ID as plain password
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          department: userData.department,
          universityId: uniAdmin.universityId,
          role: userData.role
        };

        if (userData.role === 'Supervisor') {
          baseUserData.contactEmail = userData.contactEmail;
          baseUserData.officeAddress = userData.officeAddress;
          const supervisor = await Supervisor.create(baseUserData);
          results.push({
            success: true,
            userId: supervisor.userId,
            message: 'Supervisor registered successfully',
            initialPassword: supervisor.userId
          });
        } else if (userData.role === 'Student') {
          baseUserData.level = userData.level || 'PSM-1';
          const student = await Student.create(baseUserData);
          results.push({
            success: true,
            userId: student.userId,
            message: 'Student registered successfully',
            initialPassword: student.userId
          });
        }
      } catch (error) {
        results.push({
          success: false,
          data: userData,
          error: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bulk registration completed',
      results
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Bulk registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all students and supervisors for the UniAdmin's university
// Get all students and supervisors by universityId
exports.getUsersByUniversityId = async (req, res) => {
  try {
    const { universityId } = req.params;

    if (!universityId) {
      return res.status(400).json({ 
        success: false,
        message: 'University ID is required' 
      });
    }

    const supervisors = await Supervisor.findAll({
      where: { universityId },
      attributes: [
        'userId', 'fullName', 'universityEmail', 'department',
        'contactEmail', 'officeAddress'
      ]
    });

    const students = await Student.findAll({
      where: { universityId },
      attributes: [
        'userId', 'fullName', 'universityEmail', 'department', 'level'
      ]
    });

    res.status(200).json({
      success: true,
      universityId,
      supervisors,
      students
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
