const Supervisor = require('../models/Supervisor');
const University = require('../models/University');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Update the multer configuration
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
}).single('file');

exports.getSupervisorAccount = async (req, res) => {
  try {
    const { userid } = req.query;
    if (!userid) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const supervisor = await Supervisor.findOne({
      where: { userId: userid, role: 'Supervisor' },
      include: {
        model: University,
        as: 'University',
        attributes: [
          'id', 'shortName', 'fullName', 'address',
          'email', 'phone', 'logoPath', 'status',
        ],
      },
    });

    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.status(200).json({
      userId: supervisor.userId,
      fullName: supervisor.fullName,
      universityEmail: supervisor.universityEmail,
      email: supervisor.email,
      phoneNumber: supervisor.phoneNumber,
      address: supervisor.address,
      contactEmail: supervisor.contactEmail,
      officeAddress: supervisor.officeAddress,
      department: supervisor.department,
      role: supervisor.role,
      profilePhoto: supervisor.profilePhoto,
      university: {
        id: supervisor.University?.id || "",
        shortName: supervisor.University?.shortName || "",
        fullName: supervisor.University?.fullName || "",
        address: supervisor.University?.address || "",
        email: supervisor.University?.email || "",
        phone: supervisor.University?.phone || "",
        logoPath: supervisor.University?.logoPath || "",
        status: supervisor.University?.status || "",
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to get supervisor account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateSupervisorAccount = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      email,
      phoneNumber,
      address,
      contactEmail,
      officeAddress,
      department,
      profilePhoto,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const supervisor = await Supervisor.findOne({
      where: { userId: userId, role: 'Supervisor' },
    });

    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    const updates = {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(address && { address }),
      ...(contactEmail && { contactEmail }),
      ...(officeAddress && { officeAddress }),
      ...(department && { department }),
      ...(profilePhoto && { profilePhoto }),
    };

    await supervisor.update(updates);

    const updatedSupervisor = await Supervisor.findOne({
      where: { userId: userId, role: 'Supervisor' },
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

    res.status(200).json({
      userId: updatedSupervisor.userId,
      fullName: updatedSupervisor.fullName,
      universityEmail: updatedSupervisor.universityEmail,
      email: updatedSupervisor.email,
      phoneNumber: updatedSupervisor.phoneNumber,
      address: updatedSupervisor.address,
      contactEmail: updatedSupervisor.contactEmail,
      officeAddress: updatedSupervisor.officeAddress,
      department: updatedSupervisor.department,
      role: updatedSupervisor.role,
      profilePhoto: updatedSupervisor.profilePhoto,
      university: updatedSupervisor.University
    });
  } catch (error) {
    console.error('Failed to update supervisor account:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { supervisorId } = req.params;
    
    if (!supervisorId) {
      return res.status(400).json({ message: 'Supervisor ID is required' });
    }

    const documents = await Document.findAll({
      attributes: ['id', 'title', 'description', 'fileType', 'uploadedBy', 'supervisorId', 'createdAt'],
      where: { supervisorId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ 
      success: true,
      documents 
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, supervisorId } = req.body;

    // Convert file to Base64
    const fileContent = req.file.buffer.toString('base64');
    
    const document = await Document.create({
      title,
      description,
      fileType: path.extname(req.file.originalname),
      fileContent: fileContent,
      uploadedBy: supervisorId,
      supervisorId,
      studentId: null
    });

    res.status(201).json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        description: document.description,
        fileType: document.fileType,
        uploadedBy: document.uploadedBy,
        supervisorId: document.supervisorId,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }

    const fileUrl = document.fileContent ? 
      `data:application/${document.fileType.replace('.', '')};base64,${document.fileContent}` : 
      null;

    res.json({
      success: true,
      document: {
        ...document.toJSON(),
        fileContent: undefined,
        fileUrl
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await document.destroy();

    res.status(200).json({ 
      success: true,
      message: 'Document deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getStudentDocuments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const documents = await Document.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ 
      success: true,
      documents 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve student documents',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// List documents (metadata only)
exports.listDocuments = async (req, res) => {
  try {
    const { supervisorId } = req.params;
    
    const documents = await Document.findAll({
      where: { supervisorId },
      attributes: ['id', 'title', 'description', 'fileType', 'uploadedBy', 'supervisorId', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ 
      success: true,
      documents 
    });
  } catch (error) {
    console.error('List documents error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single document with content
exports.getDocumentContent = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({
      success: true,
      document: {
        ...document.toJSON(),
        fileUrl: document.fileContent ? 
          `data:application/${document.fileType.replace('.', '')};base64,${document.fileContent}` : 
          null
      }
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add this helper function
const verifyUpload = async (document) => {
  const filePath = path.join(__dirname, '..', document.filePath);
  return fs.existsSync(filePath);
};