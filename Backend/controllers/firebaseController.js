const firebaseService = require('../utils/firebaseService');

// Example: Enhanced university registration with Firebase
exports.registerUniversityWithFirebase = async (req, res) => {
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

    // ... existing university creation logic ...

    // If Firebase is configured, also store in Firestore
    if (firebaseService.isInitialized()) {
      const firebaseResult = await firebaseService.addDocument('universities', {
        id: university.id,
        shortName: university.shortName,
        fullName: university.fullName,
        address: university.address,
        email: university.email,
        phone: university.phone,
        maxStudents: university.maxStudents,
        maxSupervisors: university.maxSupervisors,
        status: university.status,
        createdAt: new Date(),
        adminDetails: {
          username: admin.username,
          fullName: admin.fullName,
          email: admin.primaryEmail
        }
      });

      if (firebaseResult.success) {
        console.log('✅ University also saved to Firestore:', firebaseResult.id);
      } else {
        console.warn('⚠️ Failed to save to Firestore:', firebaseResult.error);
      }
    }

    // ... rest of existing logic ...
    
  } catch (error) {
    // ... error handling ...
  }
};

// Example: Upload university logo to Firebase Storage
exports.uploadUniversityLogo = async (req, res) => {
  try {
    const { universityId } = req.params;
    const logoFile = req.file;

    if (!logoFile) {
      return res.status(400).json({ message: 'No logo file provided' });
    }

    // Upload to Firebase Storage if configured
    if (firebaseService.isInitialized()) {
      const fileName = `university-logos/${universityId}-${Date.now()}.${logoFile.originalname.split('.').pop()}`;
      
      const uploadResult = await firebaseService.uploadFile(
        fileName,
        logoFile.buffer,
        {
          contentType: logoFile.mimetype,
          customMetadata: {
            universityId: universityId,
            uploadedBy: req.user?.username || 'system'
          }
        }
      );

      if (uploadResult.success) {
        // Update university record with new logo URL
        await University.update(
          { logoPath: uploadResult.url },
          { where: { id: universityId } }
        );

        res.status(200).json({
          success: true,
          message: 'Logo uploaded successfully',
          logoUrl: uploadResult.url
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to upload logo',
          error: uploadResult.error
        });
      }
    } else {
      // Fallback to local storage if Firebase not configured
      // ... existing local upload logic ...
      res.status(200).json({
        success: true,
        message: 'Logo uploaded to local storage (Firebase not configured)',
        logoUrl: `/uploads/logos/${logoFile.filename}`
      });
    }

  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo',
      error: error.message
    });
  }
};

// Example: Send real-time notifications
exports.sendProjectUpdateNotification = async (req, res) => {
  try {
    const { projectId, message, userTokens } = req.body;

    if (!firebaseService.isInitialized()) {
      return res.status(503).json({
        success: false,
        message: 'Firebase messaging not configured'
      });
    }

    const notification = {
      title: 'Project Update',
      body: message,
      icon: '/favicon.ico'
    };

    const data = {
      projectId: projectId,
      type: 'project_update',
      timestamp: new Date().toISOString()
    };

    let result;
    if (userTokens.length === 1) {
      result = await firebaseService.sendNotification(userTokens[0], notification, data);
    } else {
      result = await firebaseService.sendMulticastNotification(userTokens, notification, data);
    }

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Notification sent successfully',
        details: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
};

module.exports = {
  registerUniversityWithFirebase,
  uploadUniversityLogo,
  sendProjectUpdateNotification
};
