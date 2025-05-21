const UniAdmin = require('../models/UniAdmin');
const University = require('../models/University');

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
    console.error('Failed to get UniAdmin account:', error);
    res.status(500).json({ message: error.message });
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