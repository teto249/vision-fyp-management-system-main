const Student = require('../models/Student');
const University = require('../models/University');

// Get Student account
exports.getStudentAccount = async (req, res) => {
  try {
    const { userid } = req.query;
    if (!userid) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const student = await Student.findOne({
      where: { userId: userid, role: 'Student' }, // Changed from userid to userId
      include: {
        model: University,
        as: 'University',
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

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Format response to match frontend expectations
    res.status(200).json({
      userId: student.userId,
      fullName: student.fullName,
      universityEmail: student.universityEmail,
      email: student.email,
      phoneNumber: student.phoneNumber,
      address: student.address,
      department: student.department,
      level: student.level,
      role: student.role,
      profilePhoto: null, // Add this if you want to support it later
      university: {
        id: student.University?.id || "",
        shortName: student.University?.shortName || "",
        fullName: student.University?.fullName || "",
        address: student.University?.address || "",
        email: student.University?.email || "",
        phone: student.University?.phone || "",
        logoPath: student.University?.logoPath || "",
        status: student.University?.status || "",
      }
    });
  } catch (error) {
    console.error('Failed to get Student account:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Student account
exports.updateStudentAccount = async (req, res) => {
  try {
    const {
      userId, // Will be mapped to userid in database
      fullName,
      email,
      phoneNumber,
      address, // Changed from studentAddress
      department,
      level,
      profilePhoto,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const student = await Student.findOne({
      where: { userid: userId, role: 'Student' }, // Changed to match database field
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update Student fields
    const studentUpdates = {};
    if (fullName) studentUpdates.fullName = fullName;
    if (email) studentUpdates.email = email;
    if (phoneNumber) studentUpdates.phoneNumber = phoneNumber;
    if (address) studentUpdates.address = address; // Changed from studentAddress
    if (department) studentUpdates.department = department;
    if (level) studentUpdates.level = level;
    if (profilePhoto) studentUpdates.profilePhoto = profilePhoto;

    await student.update(studentUpdates);

    // Fetch updated Student with University data
    const updatedStudent = await Student.findOne({
      where: { userid: userId, role: 'Student' }, // Changed to match database field
      include: {
        model: University,
        as: 'University', // Changed from 'university' to 'University'
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
      userId: updatedStudent.userid, // Changed to match database field
      fullName: updatedStudent.fullName,
      universityEmail: updatedStudent.universityEmail,
      email: updatedStudent.email,
      phoneNumber: updatedStudent.phoneNumber,
      address: updatedStudent.address, // Changed from studentAddress
      department: updatedStudent.department,
      level: updatedStudent.level,
      profilePhoto: updatedStudent.profilePhoto,
      role: updatedStudent.role,
      university: updatedStudent.University // Changed from university to University
        ? {
            id: updatedStudent.University.id,
            shortName: updatedStudent.University.shortName,
            fullName: updatedStudent.University.fullName,
            address: updatedStudent.University.address,
            email: updatedStudent.University.email,
            phone: updatedStudent.University.phone,
            logoPath: updatedStudent.University.logoPath,
            status: updatedStudent.University.status,
          }
        : null,
    });
  } catch (error) {
    console.error('Failed to update Student account:', error);
    res.status(500).json({ message: error.message });
  }
};