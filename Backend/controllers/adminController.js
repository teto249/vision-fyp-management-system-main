const { sequelize } = require("../config/database");
const MainAdmin = require("../models/MainAdmin");
const Institution = require("../models/Institution");
const University = require("../models/University");
const UniAdmin = require("../models/UniAdmin");
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