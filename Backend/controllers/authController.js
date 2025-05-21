const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const MainAdmin = require("../models/MainAdmin");
const UniAdmin = require("../models/UniAdmin");
const User = require("../models/user");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt with username:", username);

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Update base attributes to match model fields
    const baseAttributes = ["username", "password", "role"];

    // Update role attributes to match model fields
    const roleAttributes = {
      MainAdmin: ["email"],
      UniAdmin: ["universityId", "primaryEmail"], // Changed email to primaryEmail
      Supervisor: ["universityId", "primaryEmail"],
      Student: ["universityId", "primaryEmail"]
    };

    // Update queries to use primaryEmail
    const userQueries = [
      {
        model: MainAdmin,
        where: { [Op.or]: [{ username }, { email: username }] },
        defaultRole: "MainAdmin"
      },
      {
        model: UniAdmin,
        where: { [Op.or]: [{ username }, { primaryEmail: username }] }, // Changed email to primaryEmail
        defaultRole: "UniAdmin"
      },
      {
        model: User,
        where: { [Op.or]: [{ username }, { email: username }] },
        useStoredRole: true
      }
    ];

    let user = null;
    let userType = null;

    // Execute queries sequentially until user is found
    for (const query of userQueries) {
      const result = await query.model.findOne({
        where: query.where,
        attributes: [...baseAttributes, ...(roleAttributes[query.defaultRole] || [])]
      });

      if (result) {
        user = result;
        userType = query.useStoredRole ? user.role : query.defaultRole;
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
      username: user.username,
      role: userType,
      ...(user.universityId && { universityId: user.universityId })
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Prepare response with role-specific data
    const responseUser = {
      username: user.username,
      role: userType,
      email: user.primaryEmail, // Changed from email to primaryEmail
      ...(user.universityId && { universityId: user.universityId })
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
