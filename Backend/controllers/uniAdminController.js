const UniAdmin = require('../models/UniAdmin');
const University = require('../models/University');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Supervisor = require('../models/Supervisor');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
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

    // Get university admin info from the JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get the university admin from database
    const UniAdmin = require('../models/UniAdmin');
    const uniAdmin = await UniAdmin.findOne({
      where: { username: decodedToken.username }
    });

    if (!uniAdmin) {
      return res.status(404).json({
        success: false,
        message: 'University admin not found'
      });
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
    // Get university admin info from the JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get the university admin from database
    const UniAdmin = require('../models/UniAdmin');
    const uniAdmin = await UniAdmin.findOne({
      where: { username: decodedToken.username }
    });

    if (!uniAdmin) {
      return res.status(404).json({
        success: false,
        message: 'University admin not found'
      });
    }
    
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

    // Fetch students with their project information
    const students = await Student.findAll({
      where: { universityId },
      attributes: [
        'userId', 'fullName', 'universityEmail', 'department', 'level', 'supervisorId'
      ],
      include: [
        {
          model: Project,
          as: 'project', // Make sure this alias matches your model association
          required: false, // LEFT JOIN to include students without projects
          attributes: [
            'id', 'projectTitle', 'projectType', 'status', 'progress',
            'startDate', 'endDate'
          ]
        }
      ]
    });

    // Transform the data to include project status for each student
    const studentsWithProjectInfo = students.map(student => {
      const studentData = student.get({ plain: true });
      return {
        ...studentData,
        hasProject: !!studentData.project,
        projectStatus: studentData.project?.status || null,
        projectTitle: studentData.project?.projectTitle || null,
        projectProgress: studentData.project?.progress || 0
      };
    });

    res.status(200).json({
      success: true,
      universityId,
      supervisors,
      students: studentsWithProjectInfo
    });
  } catch (error) {
    console.error('Error in getUsersByUniversityId:', error);
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
    // Get university admin info from the JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get the university admin from database
    const UniAdmin = require('../models/UniAdmin');
    const uniAdmin = await UniAdmin.findOne({
      where: { username: decodedToken.username }
    });

    if (!uniAdmin) {
      return res.status(404).json({
        success: false,
        message: 'University admin not found'
      });
    }
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

// Get comprehensive dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { universityId } = req.params;

    if (!universityId) {
      return res.status(400).json({ 
        success: false,
        message: 'University ID is required' 
      });
    }

    // Get all students with their projects
    const students = await Student.findAll({
      where: { universityId },
      include: [
        {
          model: Project,
          as: 'project',
          required: false,
          attributes: ['id', 'projectTitle', 'projectType', 'status', 'progress', 'startDate', 'endDate']
        }
      ],
      attributes: ['userId', 'fullName', 'department', 'level', 'email', 'createdAt']
    });

    // Get all supervisors
    const supervisors = await Supervisor.findAll({
      where: { universityId },
      attributes: ['userId', 'fullName', 'department', 'email', 'createdAt']
    });

    // Get all projects for this university with milestones
    const projects = await Project.findAll({
      where: { universityId },
      include: [
        {
          model: Milestone,
          as: 'milestones',
          required: false,
          attributes: ['id', 'title', 'status', 'startDate', 'endDate']
        }
      ],
      attributes: ['id', 'projectTitle', 'projectType', 'status', 'progress', 'startDate', 'endDate', 'studentId', 'supervisorId']
    });

    // Calculate basic metrics
    const totalStudents = students.length;
    const totalSupervisors = supervisors.length;
    const totalUsers = totalStudents + totalSupervisors;
    const totalProjects = projects.length;

    // Calculate project status metrics
    const activeProjects = projects.filter(p => p.status === 'In Progress').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const pendingProjects = projects.filter(p => p.status === 'Pending').length;

    // Calculate completion rate (percentage of completed projects)
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Calculate average project progress
    const averageProgress = totalProjects > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects)
      : 0;

    // Calculate milestone progress based on actual data
    const milestoneStages = ['Requirements', 'Design', 'Implementation', 'Testing', 'Deployment'];
    const milestoneProgress = milestoneStages.map((stage, index) => {
      // Calculate based on project progress ranges
      const minProgress = index * 20;
      const projectsAtStage = projects.filter(p => (p.progress || 0) > minProgress).length;
      return totalProjects > 0 ? Math.round((projectsAtStage / totalProjects) * 100) : 0;
    });

    // Calculate system status (user activity simulation based on time and data)
    const now = new Date();
    const isWorkingHours = now.getHours() >= 8 && now.getHours() <= 18;
    const baseActiveRate = 0.65;
    const timeMultiplier = isWorkingHours ? 1.1 : 0.7;
    
    const activeUsers = Math.round(totalUsers * baseActiveRate * timeMultiplier);
    const idleUsers = Math.round(totalUsers * 0.25);
    const offlineUsers = Math.max(0, totalUsers - activeUsers - idleUsers);

    // Prepare detailed project information
    const projectDetails = projects.slice(0, 10).map(project => {
      const student = students.find(s => s.userId === project.studentId);
      const supervisor = supervisors.find(s => s.userId === project.supervisorId);
      
      return {
        id: project.id,
        title: project.projectTitle,
        type: project.projectType,
        status: project.status,
        progress: project.progress || 0,
        startDate: project.startDate,
        endDate: project.endDate,
        studentName: student ? student.fullName : 'Unknown Student',
        supervisorName: supervisor ? supervisor.fullName : 'Unknown Supervisor',
        milestoneCount: project.milestones ? project.milestones.length : 0
      };
    });

    // Calculate department distribution
    const departmentStats = {};
    [...students, ...supervisors].forEach(user => {
      if (user.department) {
        departmentStats[user.department] = (departmentStats[user.department] || 0) + 1;
      }
    });

    // Calculate recent activity (users created in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentStudents = students.filter(s => new Date(s.createdAt) > thirtyDaysAgo).length;
    const recentSupervisors = supervisors.filter(s => new Date(s.createdAt) > thirtyDaysAgo).length;

    // Calculate students with projects
    const studentsWithProjects = students.filter(s => s.project).length;
    const studentsWithoutProjects = totalStudents - studentsWithProjects;

    res.status(200).json({
      success: true,
      universityId,
      lastUpdated: new Date().toISOString(),
      metrics: {
        totalStudents,
        totalSupervisors,
        totalUsers,
        totalProjects,
        activeProjects,
        completedProjects,
        pendingProjects,
        completionRate,
        averageProgress,
        studentsWithProjects,
        studentsWithoutProjects,
        recentActivity: {
          newStudents: recentStudents,
          newSupervisors: recentSupervisors
        }
      },
      milestoneProgress,
      systemStatus: {
        active: activeUsers,
        idle: idleUsers,
        offline: offlineUsers,
        lastUpdated: now.toISOString()
      },
      projects: projectDetails,
      departmentStats,
      analytics: {
        projectStatusDistribution: {
          pending: pendingProjects,
          inProgress: activeProjects,
          completed: completedProjects
        },
        progressRanges: {
          notStarted: projects.filter(p => (p.progress || 0) === 0).length,
          inProgress: projects.filter(p => (p.progress || 0) > 0 && (p.progress || 0) < 100).length,
          completed: projects.filter(p => (p.progress || 0) === 100).length
        }
      }
    });

  } catch (error) {
    console.error('Error in getDashboardAnalytics:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
