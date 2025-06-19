const Supervisor = require('../models/Supervisor');
const University = require('../models/University');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const Student = require('../models/Student');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const Meeting = require('../models/Meeting');
const Feedback = require('../models/Feedback');
const { sequelize } = require('../config/database');

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

// // Update the multer configuration
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

// Get all students supervised by a supervisor
exports.getSupervisedStudents = async (req, res) => {
  try {
    const { supervisorId } = req.params;

    const students = await Student.findAll({
      where: { supervisorId },
      attributes: [
        'userId',
        'fullName',
        'email',
        'universityEmail',
        'level',
        'department'
      ]
    });

    return res.status(200).json({
      success: true,
      students
    });

  } catch (error) {
    console.error('Error fetching supervised students:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

// Get project details for a specific student
exports.getStudentProject = async (req, res) => {
  try {
    const { supervisorId, studentId } = req.params;

    // Verify student is supervised by this supervisor
    const student = await Student.findOne({
      where: { 
        userId: studentId,
        supervisorId 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or not supervised by this supervisor'
      });
    }

    const project = await Project.findOne({
      where: { studentId },
      include: [
        {
          model: Student,
          attributes: ['fullName', 'email', 'level', 'department']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'No project found for this student'
      });
    }

    return res.status(200).json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Error fetching student project:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project details'
    });
  }
};

// Get all projects for supervised students
exports.getAllProjects = async (req, res) => {
  try {
    const { supervisorId } = req.params;

    const projects = await Project.findAll({
      where: { supervisorId },
      include: [
        {
          model: Student,
          attributes: ['userId', 'fullName', 'email', 'level', 'department']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      projects
    });

  } catch (error) {
    console.error('Error fetching supervised projects:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
};

exports.getSupervisedStudentsWithProjects = async (req, res) => {
  try {
    const { supervisorId } = req.params;

    // Validate supervisorId
    if (!supervisorId) {
      return res.status(400).json({
        success: false,
        message: "Supervisor ID is required"
      });
    }

    // Find all students supervised by this supervisor
    const students = await Student.findAll({
      where: { supervisorId },
      attributes: ['userId', 'fullName', 'email', 'universityEmail', 'level', 'department'],
      include: [
        {
          model: Project,
          as: 'project',
          attributes: [
            'id',
            'projectTitle',
            'projectType',
            'projectDescription',
            'startDate',
            'endDate',
            'status',
            'progress'
          ],
          include: [
            {
              model: University,
              as: "university",
              attributes: ['id', 'shortName', 'fullName']
            },
            {
              model: Milestone,
              as: "milestones",
              separate: true,
              attributes: ['id', 'title', 'description', 'status', 'startDate', 'endDate'],
              include: [
                {
                  model: Task,
                  as: "tasks",
                  separate: true,
                  attributes: ['id', 'title', 'description', 'status', 'startDate', 'endDate'],
                  include: [
                    {
                      model: Feedback,
                      as: "feedback",
                      attributes: ['id', 'title', 'description', 'date']
                    }
                  ]
                },
                {
                  model: Meeting,
                  as: "meetings",
                  separate: true,
                  attributes: ['id', 'title', 'date', 'link', 'type']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found for this supervisor"
      });
    }

    // Transform and calculate progress for each project
    const transformedStudents = students.map(student => {
      const plainStudent = student.get({ plain: true });
      
      if (plainStudent.project) {
        // Calculate total tasks and completed tasks
        const totalTasks = plainStudent.project.milestones.reduce(
          (sum, milestone) => sum + milestone.tasks.length, 0
        );
        const completedTasks = plainStudent.project.milestones.reduce(
          (sum, milestone) => sum + milestone.tasks.filter(task => task.status === 'Completed').length, 0
        );

        // Calculate progress
        plainStudent.project.progress = totalTasks > 0 
          ? Math.round((completedTasks / totalTasks) * 100) 
          : 0;
      }

      return {
        userId: plainStudent.userId,
        fullName: plainStudent.fullName,
        email: plainStudent.email,
        universityEmail: plainStudent.universityEmail,
        level: plainStudent.level,
        department: plainStudent.department,
        project: plainStudent.project ? {
          id: plainStudent.project.id,
          title: plainStudent.project.projectTitle,
          type: plainStudent.project.projectType,
          description: plainStudent.project.projectDescription,
          status: plainStudent.project.status,
          progress: plainStudent.project.progress,
          startDate: plainStudent.project.startDate,
          endDate: plainStudent.project.endDate,
          university: plainStudent.project.university,
          milestones: plainStudent.project.milestones.map(milestone => ({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            startDate: milestone.startDate,
            endDate: milestone.endDate,
            tasks: milestone.tasks,
            meetings: milestone.meetings
          }))
        } : null
      };
    });

    res.status(200).json({
      success: true,
      students: transformedStudents
    });

  } catch (error) {
    console.error("Error fetching supervised students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students and their projects"
    });
  }
};

exports.getStudentProjectDetails = async (req, res) => {
  try {
    const { supervisorId, studentId } = req.params;

    const student = await Student.findOne({
      where: { 
        userId: studentId,
        supervisorId 
      },
      include: [
        {
          model: Project,
          include: [
            {
              model: Milestone,
              include: [
                {
                  model: Task,
                  include: [
                    {
                      model: Feedback,
                      attributes: ['id', 'title', 'description', 'date']
                    }
                  ]
                },
                {
                  model: Meeting,
                  attributes: ['id', 'title', 'date', 'time', 'link', 'type']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or not supervised by this supervisor'
      });
    }

    res.status(200).json({
      success: true,
      project: student.Project
    });

  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project details'
    });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { supervisorId, projectId } = req.params;
    const { status } = req.body;

    const project = await Project.findOne({
      where: { 
        id: projectId,
        supervisorId
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.update({ status });

    res.status(200).json({
      success: true,
      message: 'Project status updated successfully'
    });

  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project status'
    });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { supervisorId, taskId } = req.params;
    const { title, description } = req.body;

    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Milestone,
          include: [
            {
              model: Project,
              where: { supervisorId }
            }
          ]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not authorized'
      });
    }

    const feedback = await Feedback.create({
      taskId,
      title,
      description,
      date: new Date()
    });

    res.status(201).json({
      success: true,
      feedback
    });

  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add feedback'
    });
  }
};

