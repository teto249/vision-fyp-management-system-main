const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const MainAdmin = require("../models/MainAdmin");
const UniAdmin = require("../models/UniAdmin");
const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt with username:", username);

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Define base attributes for each role
    const baseAttributes = {
      MainAdmin: ["username", "password", "role", "email"],
      UniAdmin: ["username", "password", "role", "universityId", "primaryEmail"],
      Student: ["userId", "password", "role", "universityId", "email", "universityEmail", "level"],
      Supervisor: ["userId", "password", "role", "universityId", "email", "universityEmail"]
    };

    // Update queries with role-specific attributes
    const userQueries = [
      {
        model: MainAdmin,
        where: { [Op.or]: [{ username }, { email: username }] },
        defaultRole: "MainAdmin",
        attributes: baseAttributes.MainAdmin
      },
      {
        model: UniAdmin,
        where: { [Op.or]: [{ username }, { primaryEmail: username }] },
        defaultRole: "UniAdmin",
        attributes: baseAttributes.UniAdmin
      },
      {
        model: Student,
        where: { [Op.or]: [{ userId: username }] },
        defaultRole: "Student",
        attributes: baseAttributes.Student
      },
      {
        model: Supervisor,
        where: { [Op.or]: [{ userId: username }, { universityEmail: username }] },
        defaultRole: "Supervisor",
        attributes: baseAttributes.Supervisor
      }
    ];

    let user = null;
    let userType = null;

    // Execute queries sequentially until user is found
    for (const query of userQueries) {
      const result = await query.model.findOne({
        where: query.where,
        attributes: query.attributes
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

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT with essential data only
    const tokenPayload = {
      username: user.userId || user.username, // Use userId for students
      role: userType,
      universityId: user.universityId
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Prepare response with role-specific data
    const responseUser = {
      username: user.userId || user.username, // Use userId for students
      role: userType,
      email: user.email || user.primaryEmail,
      universityId: user.universityId,
      ...(userType === "Student" && { level: user.level })
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: responseUser
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: process.env.NODE_ENV === "development" 
        ? error.message 
        : "An unexpected error occurred"
    });
  }
};
