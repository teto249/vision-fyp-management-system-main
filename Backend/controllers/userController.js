const { User, University } = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: University, as: "university" }],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};



exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

