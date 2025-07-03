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
    console.log('=== REGISTRATION REQUEST DEBUG ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request headers:', req.headers);
    console.log('Raw body:', req.body);
    console.log('Body keys:', Object.keys(req.body || {}));
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('=====================================');

    // Use the uniAdmin from middleware
    const uniAdmin = req.uniAdmin;


    const {
      fullName,
      universityEmail,
      phoneNumber,
      address,
      idNumber,
      department,
      role,
      level,
      contactEmail,
      officeAddress
    } = req.body;

    console.log('Extracted fields:', {
      fullName,
      universityEmail,
      phoneNumber,
      address,
      idNumber,
      department,
      role,
      level,
      contactEmail,
      officeAddress
    });

    // Validate required fields
    if (!fullName || !universityEmail || !idNumber || !department || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, universityEmail, idNumber, department, role'
      });
    }

    // Check if user already exists
    let existingUser = null;
    if (role === 'Student') {
      existingUser = await Student.findOne({ where: { userId: idNumber } });
    } else if (role === 'Supervisor') {
      existingUser = await Supervisor.findOne({ where: { userId: idNumber } });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `${role} with ID ${idNumber} already exists`
      });
    }
    
    // Create user data
    const userData = {
      userId: idNumber,
      fullName,
      email: universityEmail,
      universityEmail,
      password: idNumber, // Use ID as password
      phoneNumber: phoneNumber || '',
      address: address || '',
      department,
      universityId: uniAdmin.universityId,
      role: role // Keep original case - don't lowercase it
    };

    let newUser = null;

    if (role === 'Supervisor') {
      if (!contactEmail || !officeAddress) {
        return res.status(400).json({
          success: false,
          message: 'contactEmail and officeAddress are required for supervisors'
        });
      }
      
      userData.contactEmail = contactEmail;
      userData.officeAddress = officeAddress;
      newUser = await Supervisor.create(userData);
      
    } else if (role === 'Student') {
      if (!level) {
        return res.status(400).json({
          success: false,
          message: 'level is required for students'
        });
      }
      
      userData.level = level;
      newUser = await Student.create(userData);
      
    } else {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role. Must be either Student or Supervisor' 
      });
    }

    res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      user: {
        userId: newUser.userId,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      },
      initialPassword: newUser.userId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Register bulk users
exports.registerBulkUsers = async (req, res) => {
  try {
    // Use the uniAdmin from middleware
    const uniAdmin = req.uniAdmin;
    const users = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Users array is required and cannot be empty'
      });
    }

    const results = [];

    for (const [index, userData] of users.entries()) {
      try {
        const {
          fullName,
          universityEmail,
          phoneNumber,
          address,
          idNumber,
          department,
          role,
          level,
          contactEmail,
          officeAddress
        } = userData;

        // Validate required fields
        if (!fullName || !universityEmail || !idNumber || !department || !role) {
          results.push({
            success: false,
            idNumber: idNumber || `Record ${index + 1}`,
            message: 'Missing required fields'
          });
          continue;
        }

        // Check if user already exists
        let existingUser = null;
        if (role === 'Student') {
          existingUser = await Student.findOne({ where: { userId: idNumber } });
        } else if (role === 'Supervisor') {
          existingUser = await Supervisor.findOne({ where: { userId: idNumber } });
        }

        if (existingUser) {
          results.push({
            success: false,
            idNumber,
            message: `${role} with ID ${idNumber} already exists`
          });
          continue;
        }

        const baseUserData = {
          userId: idNumber,
          fullName,
          email: universityEmail,
          universityEmail,
          password: idNumber,
          phoneNumber: phoneNumber || '',
          address: address || '',
          department,
          universityId: uniAdmin.universityId,
          role: role // Keep original case for role
        };

        let newUser = null;

        if (role === 'Supervisor') {
          if (!contactEmail || !officeAddress) {
            results.push({
              success: false,
              idNumber,
              message: 'contactEmail and officeAddress are required for supervisors'
            });
            continue;
          }
          
          baseUserData.contactEmail = contactEmail;
          baseUserData.officeAddress = officeAddress;
          newUser = await Supervisor.create(baseUserData);
          
        } else if (role === 'Student') {
          if (!level) {
            results.push({
              success: false,
              idNumber,
              message: 'level is required for students'
            });
            continue;
          }
          
          baseUserData.level = level;
          newUser = await Student.create(baseUserData);
          
        } else {
          results.push({
            success: false,
            idNumber,
            message: 'Invalid role. Must be either Student or Supervisor'
          });
          continue;
        }

        results.push({
          success: true,
          idNumber,
          message: `${role} registered successfully`,
          userId: newUser.userId
        });

      } catch (error) {
        console.error(`Error registering user ${userData.idNumber}:`, error);
        results.push({
          success: false,
          idNumber: userData.idNumber || `Record ${index + 1}`,
          message: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.status(200).json({
      success: true,
      message: `Bulk registration completed. ${successCount} succeeded, ${failCount} failed.`,
      results
    });

  } catch (error) {
    console.error('Bulk registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Bulk registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
        'userId', 'fullName', 'universityEmail', 'department', 'level', 'supervisorId'
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

// Delete user (Student or Supervisor)
exports.deleteUser = async (req, res) => {
  try {
    // Use the uniAdmin from middleware
    const uniAdmin = req.uniAdmin;
    const { userId, userType } = req.params;

    if (!userId || !userType) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID and user type are required' 
      });
    }

    if (!['student', 'supervisor'].includes(userType.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user type. Must be either "student" or "supervisor"' 
      });
    }

    let deletedUser = null;
    const normalizedUserType = userType.toLowerCase();

    if (normalizedUserType === 'student') {
      // Find student first
      deletedUser = await Student.findOne({
        where: { 
          userId: userId,
          universityId: uniAdmin.universityId 
        }
      });
      
      if (!deletedUser) {
        return res.status(404).json({ 
          success: false,
          message: 'Student not found or not belonging to your university' 
        });
      }

      // Delete the student
      await Student.destroy({
        where: { 
          userId: userId,
          universityId: uniAdmin.universityId 
        }
      });

    } else if (normalizedUserType === 'supervisor') {
      // Find supervisor first
      deletedUser = await Supervisor.findOne({
        where: { 
          userId: userId,
          universityId: uniAdmin.universityId 
        }
      });
      
      if (!deletedUser) {
        return res.status(404).json({ 
          success: false,
          message: 'Supervisor not found or not belonging to your university' 
        });
      }

      // Update any students assigned to this supervisor
      await Student.update(
        { supervisorId: null },
        { 
          where: { 
            supervisorId: userId,
            universityId: uniAdmin.universityId 
          }
        }
      );

      // Delete the supervisor
      await Supervisor.destroy({
        where: { 
          userId: userId,
          universityId: uniAdmin.universityId 
        }
      });
    }

    res.status(200).json({
      success: true,
      message: `${userType} deleted successfully`,
      deletedUser: {
        userId: deletedUser.userId,
        fullName: deletedUser.fullName,
        email: deletedUser.email
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Bulk delete users
exports.bulkDeleteUsers = async (req, res) => {
  try {
    // Use the uniAdmin from middleware
    const uniAdmin = req.uniAdmin;

    const { users } = req.body; // Array of { userId, userType }

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Users array is required and cannot be empty' 
      });
    }

    const results = [];

    for (const user of users) {
      try {
        const { userId, userType } = user;

        if (!userId || !userType) {
          results.push({
            success: false,
            userId: userId || 'unknown',
            error: 'User ID and user type are required'
          });
          continue;
        }

        if (!['student', 'supervisor'].includes(userType.toLowerCase())) {
          results.push({
            success: false,
            userId: userId,
            error: 'Invalid user type'
          });
          continue;
        }

        let deletedUser = null;

        if (userType.toLowerCase() === 'student') {
          deletedUser = await Student.findOne({
            where: { 
              userId: userId,
              universityId: uniAdmin.universityId 
            }
          });
          
          if (!deletedUser) {
            results.push({
              success: false,
              userId: userId,
              error: 'Student not found'
            });
            continue;
          }

          await Student.destroy({
            where: { 
              userId: userId,
              universityId: uniAdmin.universityId 
            }
          });

        } else if (userType.toLowerCase() === 'supervisor') {
          deletedUser = await Supervisor.findOne({
            where: { 
              userId: userId,
              universityId: uniAdmin.universityId 
            }
          });
          
          if (!deletedUser) {
            results.push({
              success: false,
              userId: userId,
              error: 'Supervisor not found'
            });
            continue;
          }

          // Update students to remove supervisor assignment
          await Student.update(
            { supervisorId: null },
            { 
              where: { 
                supervisorId: userId,
                universityId: uniAdmin.universityId 
              }
            }
          );

          await Supervisor.destroy({
            where: { 
              userId: userId,
              universityId: uniAdmin.universityId 
            }
          });
        }

        results.push({
          success: true,
          userId: userId,
          userType: userType,
          fullName: deletedUser.fullName,
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} deleted successfully`
        });

      } catch (error) {
        results.push({
          success: false,
          userId: user.userId || 'unknown',
          error: process.env.NODE_ENV === 'development' ? error.message : 'Deletion failed'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.status(200).json({
      success: true,
      message: `Bulk deletion completed. ${successCount} users deleted, ${failCount} failed`,
      results
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Bulk deletion failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
