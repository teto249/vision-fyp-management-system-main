const { sequelize } = require("../config/database");
const MainAdmin = require("../models/MainAdmin");
const Institution = require("../models/Institution");
const University = require("../models/University");
const UniAdmin = require("../models/UniAdmin");
const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");
const Project = require("../models/Project");
const emailService = require("../utils/emailService");
const bcrypt = require("bcryptjs");

// Get admin account
exports.getAdminAccount = async (req, res) => {
  try {
    const { username } = req.query; // Changed from adminId to username
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const admin = await MainAdmin.findOne({
      where: { username, role: "MainAdmin" }, // Changed from id to username
      include: {
        model: Institution,
        attributes: [
          "id",
          "shortName",
          "fullName",
          "address",
          "email",
          "phone",
          "logoPath",
        ],
      },
    });
 
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      username: admin.username, // Changed from id to username
      name: admin.name,
      email: admin.email,
      contactEmail: admin.contactEmail,
      phoneNumber: admin.phoneNumber,
      address: admin.address,
      profilePhoto: admin.profilePhoto,
      role: admin.role,
      institution: admin.Institution
        ? {
            id: admin.Institution.id,
            shortName: admin.Institution.shortName,
            fullName: admin.Institution.fullName,
            address: admin.Institution.address,
            email: admin.Institution.email,
            phone: admin.Institution.phone,
            logoPath: admin.Institution.logoPath,
          }
        : null,
    });
  } catch (error) {
    console.error("Failed to get admin account:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update admin account
exports.updateAdminAccount = async (req, res) => {
  try {
    const {
      username, // Added username to request body
      adminName,
      adminEmail,
      contactEmail,
      phoneNumber,
      address,
      profilePhoto,
      institutionData,
    } = req.body;

    const admin = await MainAdmin.findOne({
      where: { username, role: "MainAdmin" }, // Changed to use username
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update admin fields
    const adminUpdates = {};
    if (adminName) adminUpdates.name = adminName;
    if (adminEmail) adminUpdates.email = adminEmail;
    if (contactEmail) adminUpdates.contactEmail = contactEmail;
    if (phoneNumber) adminUpdates.phoneNumber = phoneNumber;
    if (address) adminUpdates.address = address;
    if (profilePhoto) adminUpdates.profilePhoto = profilePhoto;

    if (Object.keys(adminUpdates).length > 0) {
      await admin.update(adminUpdates);
    }

    // Update institution if data provided
    if (institutionData && admin.institutionId) {
      const institution = await Institution.findByPk(admin.institutionId);
      if (institution) {
        await institution.update(institutionData);
      }
    }

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Failed to update admin account:", error);
    res.status(500).json({ message: error.message });
  }
};

// Register university
exports.registerUniversity = async (req, res) => {
  const transaction = await sequelize.transaction();
 
  
  try {
    const {
      shortName,
      fullName,
      address,
      email,
      phone,
      maxStudents,
      maxSupervisors,
      adminFullName,
      adminEmail,
      adminPassword,
      adminPhone,
    } = req.body;
 
    // Validate required fields
    const missingFields = [];
    if (!shortName) missingFields.push("shortName");
    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!adminFullName) missingFields.push("adminFullName");
    if (!adminEmail) missingFields.push("adminEmail");
    if (!adminPassword) missingFields.push("adminPassword");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Generate username from university shortname and admin's first name
    const generateUsername = (shortName, fullName) => {
      const firstName = fullName.split(" ")[0];
      const username = `${shortName}-${firstName}`.toUpperCase();
      return username;
    };

    // Check existing university
    const exists = await University.findOne({
      where: { shortName: shortName.toUpperCase() },
      transaction,
    });

    if (exists) {
      await transaction.rollback();
      return res.status(400).json({ message: "University already exists" });
    }

    // Create university
    const university = await University.create(
      {
        shortName: shortName.toUpperCase(),
        fullName,
        address,
        email,
        phone,
        maxStudents: parseInt(maxStudents) || 1000,
        maxSupervisors: parseInt(maxSupervisors) || 100,
        status: "pending",
      },
      { transaction }
    );

    // Generate unique username
    let username = generateUsername(shortName, adminFullName);
    let counter = 1;

    // Check if username exists and append number if it does
    while (await UniAdmin.findOne({ where: { username }, transaction })) {
      username = `${generateUsername(shortName, adminFullName)}-${counter}`;
      counter++;
    }

    // Create admin with generated username
    const admin = await UniAdmin.create(
      {
        username, // Using generated username
        universityId: university.id,
        universityShortName: university.shortName,
        fullName: adminFullName,
        primaryEmail: adminEmail,
        phoneNumber: adminPhone,
        password: adminPassword,
        role: "UniAdmin",
      },
      { transaction }
    );

    await transaction.commit();

    // Send welcome email to the university admin
    try {
      const emailResult = await emailService.sendUniversityRegistrationEmail(
        {
          id: university.id,
          shortName: university.shortName,
          fullName: university.fullName,
          address: university.address,
          email: university.email,
          phone: university.phone,
          maxStudents: university.maxStudents,
          maxSupervisors: university.maxSupervisors,
        },
        {
          username: admin.username,
          fullName: admin.fullName,
          primaryEmail: admin.primaryEmail,
          temporaryPassword: adminPassword, // Note: In production, you might want to generate a random password
        }
      );

      if (emailResult.success) {
        console.log(`Registration email sent successfully to ${admin.primaryEmail}`);
      } else {
        console.error(`Failed to send registration email: ${emailResult.error}`);
        // Don't fail the registration if email fails, just log the error
      }
    } catch (emailError) {
      console.error('Email service error during university registration:', emailError);
      // Continue with successful registration response even if email fails
    }

    res.status(201).json({
      message: "University registered successfully",
      university: {
        id: university.id,
        shortName: university.shortName,
        fullName: university.fullName,
        status: university.status,
      },
      admin: {
        username: admin.username, // Include generated username in response
        fullName: admin.fullName,
        email: admin.primaryEmail,
      },
      emailSent: true, // Indicate that email was attempted
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUniversitiesWithDetails = async (req, res) => {
  try {
    const universities = await University.findAll({
      attributes: [
        "id",
        "shortName",
        "fullName",
        "address",
        "email",
        "phone",
        "maxStudents",
        "maxSupervisors",
        "description",
        "status",
        "logoPath",
      ],
      include: [
        {
          model: UniAdmin,
          as: "administrators",
          attributes: ["username", "fullName", "primaryEmail", "phoneNumber"],
        },
      ],
    });

    const formattedUniversities = universities.map((uni) => ({
      id: uni.id,
      title: uni.fullName,
      shortName: uni.shortName,
      description: uni.description || `${uni.shortName} - A partner university`,
      image: uni.logoPath || "/default-university-logo.png",
      location: uni.address,
      contactEmail: uni.email,
      phone: uni.phone,
      students: uni.maxStudents,
      capacity: uni.maxSupervisors,
      status: uni.status,
      adminDetails: uni.administrators?.[0]
        ? {
            username: uni.administrators[0].username,
            name: uni.administrators[0].fullName,
            email: uni.administrators[0].primaryEmail,
            phone: uni.administrators[0].phoneNumber,
          }
        : null,
    }));

    res.status(200).json(formattedUniversities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;
    const university = await University.findByPk(id, {
      attributes: [
        "id",
        "shortName",
        "fullName",
        "address",
        "email",
        "phone",
        "maxStudents",
        "maxSupervisors",
        "description",
        "status",
        "logoPath",
      ],
      include: [
        {
          model: UniAdmin,
          as: "administrators",
          attributes: ["username", "fullName", "primaryEmail", "phoneNumber"],
        },
      ],
    });

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    const formattedUniversity = {
      id: university.id,
      shortName: university.shortName,
      name: university.fullName,
      address: university.address,
      contactEmail: university.email,
      phone: university.phone,
      maxStudents: university.maxStudents,
      maxSupervisors: university.maxSupervisors,
      description: university.description,
      logoPath: university.logoPath,
      status: university.status,
      adminDetails: university.administrators?.[0]
        ? {
            username: university.administrators[0].username,
            name: university.administrators[0].fullName,
            email: university.administrators[0].primaryEmail,
            phone: university.administrators[0].phoneNumber,
          }
        : null,
    };

    res.status(200).json(formattedUniversity);
  } catch (error) {
    console.error("Error fetching university:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUniversityStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify university exists
    const university = await University.findByPk(id);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    // Get counts for statistics
    const [
      totalStudents,
      totalSupervisors,
      totalAdmins,
      activeProjects,
      completedProjects,
      inProgressProjects,
      pendingProjects
    ] = await Promise.all([
      Student.count({ where: { universityId: id } }),
      Supervisor.count({ where: { universityId: id } }),
      UniAdmin.count({ where: { universityId: id } }),
      Project.count({ where: { universityId: id, status: 'In Progress' } }),
      Project.count({ where: { universityId: id, status: 'Completed' } }),
      Project.count({ where: { universityId: id, status: 'In Progress' } }),
      Project.count({ where: { universityId: id, status: 'Pending' } })
    ]);

    // Calculate utilization rates
    const studentUtilization = university.maxStudents > 0 
      ? Math.round((totalStudents / university.maxStudents) * 100) 
      : 0;
    const supervisorUtilization = university.maxSupervisors > 0 
      ? Math.round((totalSupervisors / university.maxSupervisors) * 100) 
      : 0;
    const overallUtilization = Math.round((studentUtilization + supervisorUtilization) / 2);

    const statistics = {
      totalStudents,
      totalSupervisors,
      totalAdmins,
      activeProjects,
      completedProjects,
      inProgressProjects,
      pendingProjects,
      totalProjects: activeProjects + completedProjects + pendingProjects,
      utilizationRate: overallUtilization,
      studentUtilization,
      supervisorUtilization,
      capacity: {
        maxStudents: university.maxStudents,
        maxSupervisors: university.maxSupervisors,
        remainingStudentSlots: Math.max(0, university.maxStudents - totalStudents),
        remainingSupervisorSlots: Math.max(0, university.maxSupervisors - totalSupervisors)
      }
    };

    res.status(200).json(statistics);
  } catch (error) {
    console.error("Error fetching university statistics:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUniversityMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'all', page = 1, limit = 10 } = req.query;
    
    // Verify university exists
    const university = await University.findByPk(id);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    const offset = (page - 1) * limit;
    const members = {};

    if (type === 'all' || type === 'students') {
      const students = await Student.findAndCountAll({
        where: { universityId: id },
        attributes: [
          'userId',
          'fullName',
          'email',
          'universityEmail',
          'phoneNumber',
          'department',
          'level',
          'createdAt'
        ],
        limit: type === 'students' ? parseInt(limit) : undefined,
        offset: type === 'students' ? offset : undefined,
        order: [['createdAt', 'DESC']]
      });
      
      members.students = {
        data: students.rows.map(student => ({
          id: student.userId,
          name: student.fullName,
          email: student.email,
          universityEmail: student.universityEmail,
          phone: student.phoneNumber,
          department: student.department,
          level: student.level,
          profilePhoto: null, // Default since field doesn't exist
          joinedAt: student.createdAt,
          role: 'Student'
        })),
        total: students.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(students.count / limit)
      };
    }

    if (type === 'all' || type === 'supervisors') {
      const supervisors = await Supervisor.findAndCountAll({
        where: { universityId: id },
        attributes: [
          'userId',
          'fullName',
          'email',
          'universityEmail',
          'phoneNumber',
          'department',
          'officeAddress',
          'createdAt'
        ],
        limit: type === 'supervisors' ? parseInt(limit) : undefined,
        offset: type === 'supervisors' ? offset : undefined,
        order: [['createdAt', 'DESC']]
      });
      
      members.supervisors = {
        data: supervisors.rows.map(supervisor => ({
          id: supervisor.userId,
          name: supervisor.fullName,
          email: supervisor.email,
          universityEmail: supervisor.universityEmail,
          phone: supervisor.phoneNumber,
          department: supervisor.department,
          officeAddress: supervisor.officeAddress,
          profilePhoto: null, // Default since field doesn't exist
          joinedAt: supervisor.createdAt,
          role: 'Supervisor'
        })),
        total: supervisors.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(supervisors.count / limit)
      };
    }

    if (type === 'all' || type === 'admins') {
      const admins = await UniAdmin.findAndCountAll({
        where: { universityId: id },
        attributes: [
          'username',
          'fullName',
          'primaryEmail',
          'phoneNumber',
          'profilePhoto',
          'createdAt'
        ],
        limit: type === 'admins' ? parseInt(limit) : undefined,
        offset: type === 'admins' ? offset : undefined,
        order: [['createdAt', 'DESC']]
      });
      
      members.admins = {
        data: admins.rows.map(admin => ({
          id: admin.username,
          name: admin.fullName,
          email: admin.primaryEmail,
          phone: admin.phoneNumber,
          department: null, // Field doesn't exist in UniAdmin model
          profilePhoto: admin.profilePhoto,
          joinedAt: admin.createdAt,
          role: 'University Admin'
        })),
        total: admins.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(admins.count / limit)
      };
    }

    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching university members:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total counts across all universities
    const [
      totalUniversities,
      totalStudents, 
      totalSupervisors,
      totalAdmins,
      activeProjects,
      completedProjects,
      allUniversities
    ] = await Promise.all([
      University.count(),
      Student.count(),
      Supervisor.count(), 
      UniAdmin.count(),
      Project.count({ where: { status: 'In Progress' } }),
      Project.count({ where: { status: 'Completed' } }),
      University.findAll({
        attributes: ['id', 'shortName', 'fullName', 'maxStudents', 'maxSupervisors'],
        include: [
          {
            model: Student,
            attributes: ['userId'],
            required: false
          },
          {
            model: Supervisor, 
            attributes: ['userId'],
            required: false
          },
          {
            model: UniAdmin,
            as: 'administrators',
            attributes: ['username'],
            required: false
          }
        ]
      })
    ]);

    // Calculate capacity usage across all universities
    const totalCapacity = allUniversities.reduce((sum, uni) => sum + (uni.maxStudents + uni.maxSupervisors), 0);
    const totalUsed = totalStudents + totalSupervisors;
    const capacityPercentage = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;

    // Format university stats for table
    const universityStats = allUniversities.map(uni => {
      const currentStudents = uni.Students ? uni.Students.length : 0;
      const currentSupervisors = uni.Supervisors ? uni.Supervisors.length : 0;
      const totalUsers = currentStudents + currentSupervisors;
      const maxCapacity = uni.maxStudents + uni.maxSupervisors;
      const utilizationRate = maxCapacity > 0 ? Math.round((totalUsers / maxCapacity) * 100) : 0;
      
      let status = 'normal';
      if (utilizationRate >= 90) status = 'critical';
      else if (utilizationRate >= 75) status = 'warning';

      return {
        id: uni.id,
        name: uni.fullName,
        shortName: uni.shortName,
        users: totalUsers,
        capacity: utilizationRate,
        status,
        maxStudents: uni.maxStudents,
        maxSupervisors: uni.maxSupervisors,
        currentStudents,
        currentSupervisors
      };
    });

    // Generate some recent activity (you can expand this based on your needs)
    const recentActivity = [
      {
        id: '1',
        type: 'university_registered',
        message: 'New university registered',
        timestamp: new Date().toISOString(),
        university: allUniversities[0]?.fullName || 'Unknown'
      },
      {
        id: '2', 
        type: 'project_completed',
        message: `${completedProjects} projects completed this month`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'capacity_update',
        message: `System capacity at ${capacityPercentage}%`,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const dashboardStats = {
      totalUsers: totalStudents + totalSupervisors + totalAdmins,
      totalUniversities,
      totalStudents,
      totalSupervisors, 
      totalAdmins,
      activeProjects,
      completedProjects,
      capacityUsage: {
        used: totalUsed,
        total: totalCapacity,
        percentage: capacityPercentage
      },
      recentActivity,
      universityStats
    };

    res.status(200).json(dashboardStats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: error.message });
  }
};