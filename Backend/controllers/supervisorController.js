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
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Define uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');

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

    // Ensure documents directory exists
    const documentsDir = path.join(uploadsDir, 'documents');
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${timestamp}-${supervisorId}${fileExtension}`;
    const filePath = path.join(documentsDir, filename);

    // Save file to disk
    await fs.promises.writeFile(filePath, req.file.buffer);
    
    const document = await Document.create({
      title,
      description,
      fileType: fileExtension,
      fileName: filename,
      filePath: filePath,
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
        fileName: document.fileName,
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
    console.log('📄 listDocuments called with params:', req.params);
    console.log('📄 listDocuments called with headers:', req.headers);
    
    const { supervisorId } = req.params;
    
    console.log('📄 Looking for documents for supervisorId:', supervisorId);
    
    const documents = await Document.findAll({
      where: { supervisorId },
      attributes: ['id', 'title', 'description', 'fileType', 'uploadedBy', 'supervisorId', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    console.log('📄 Found documents:', documents.length);

    res.status(200).json({ 
      success: true,
      documents 
    });
  } catch (error) {
    console.error('❌ List documents error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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
          `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/supervisor/documents/${id}/pdf` : 
          null
      }
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Serve PDF files directly with proper headers
exports.getDocumentPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if we have a file path (new file-based storage)
    if (document.filePath && fs.existsSync(document.filePath)) {
      // Set appropriate headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${document.title}${document.fileType}"`);
      
      // Stream the file directly from disk
      const fileStream = fs.createReadStream(document.filePath);
      fileStream.pipe(res);
      return;
    }

    // Fallback to base64 content (legacy support)
    if (document.fileContent) {
      // Convert base64 back to buffer
      const fileBuffer = Buffer.from(document.fileContent, 'base64');
      
      // Set appropriate headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${document.title}${document.fileType}"`);
      res.setHeader('Content-Length', fileBuffer.length);
      
      // Send the file buffer
      res.send(fileBuffer);
      return;
    }

    return res.status(404).json({ message: 'File content not found' });
  } catch (error) {
    console.error('Get PDF error:', error);
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
                  attributes: [
                    'id', 
                    'title', 
                    'description', 
                    'status', 
                    'startDate', 
                    'endDate'
                  ],
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
      return res.status(200).json({
        success: true,
        students: [],
        message: "No students assigned to this supervisor yet"
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
              as: 'milestones',
              include: [
                {
                  model: Task,
                  as: 'tasks',
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

    const plainStudent = student.get({ plain: true });

    // Calculate project progress
    if (plainStudent.project) {
      const totalTasks = plainStudent.project.milestones.reduce(
        (sum, milestone) => sum + milestone.tasks.length, 0
      );
      const completedTasks = plainStudent.project.milestones.reduce(
        (sum, milestone) => sum + milestone.tasks.filter(task => task.status === 'Completed').length, 0
      );

      plainStudent.project.progress = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;
    }

    res.status(200).json({
      success: true,
      student: plainStudent
    });

  } catch (error) {
    console.error('Error fetching student project details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student project details'
    });
  }
};

const calculateProjectProgress = (milestones) => {
  const allTasks = milestones.flatMap(milestone => milestone.tasks);
  const totalTasks = allTasks.length;
  
  if (totalTasks === 0) return 0;
  
  const completedTasks = allTasks.filter(task => task.status === 'Completed').length;
  return Math.round((completedTasks / totalTasks) * 100);
};

// Add these new controller functions

// Update project details
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { projectTitle, projectType, projectDescription, startDate, endDate, status } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await project.update({
      projectTitle,
      projectType,
      projectDescription,
      startDate,
      endDate,
      status
    });

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project"
    });
  }
};

// Update milestone
exports.updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { title, description, startDate, endDate, status } = req.body;

    const milestone = await Milestone.findByPk(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found"
      });
    }

    await milestone.update({
      title,
      description,
      startDate,
      endDate,
      status
    });

    res.status(200).json({
      success: true,
      milestone
    });
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update milestone"
    });
  }
};

// Add Task to Milestone
exports.addTask = async (req, res) => {
  try {
    const { supervisorUsername, milestoneId } = req.params;
    const { title, description, startDate, endDate } = req.body;

    // Validate required fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Title, start date, and end date are required"
      });
    }    // Find supervisor by userId (which is used as username)
    const supervisor = await Supervisor.findOne({
      where: { userId: supervisorUsername }
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found"
      });
    }

    // Check if milestone exists and belongs to supervisor's student
    const milestone = await Milestone.findOne({
      where: { id: milestoneId },      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Student,
              as: 'student',
              where: { supervisorId: supervisor.userId }
            }
          ]
        }
      ]
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied"
      });
    }

    // Create new task
    const task = await Task.create({
      title,
      description: description || '',
      startDate,
      endDate,
      status: 'Pending',
      milestoneId
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add task"
    });
  }
};

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { supervisorUsername, taskId } = req.params;
    const { status } = req.body;    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    // Find supervisor by userId (which is used as username)
    const supervisor = await Supervisor.findOne({
      where: { userId: supervisorUsername }
    });

    if (!supervisor) {      return res.status(404).json({
        success: false,
        message: "Supervisor not found"
      });
    }

    // Check if task exists and belongs to supervisor's student
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Milestone,
          as: 'milestone',
          include: [
            {
              model: Project,
              as: 'project',
              include: [
                {
                  model: Student,
                  as: 'student',
                  where: { supervisorId: supervisor.userId }
                }
              ]
            }
          ]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied"
      });
    }

    // Update task status
    await task.update({ status });

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status"
    });
  }
};

// Add Feedback to Task
exports.addFeedback = async (req, res) => {
  try {
    const { supervisorUsername, taskId } = req.params;
    const { title, description } = req.body;    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    // Find supervisor by userId (which is used as username)
    const supervisor = await Supervisor.findOne({
      where: { userId: supervisorUsername }
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found"
      });
    }    // Check if task exists and belongs to supervisor's student
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Milestone,
          as: 'milestone',
          include: [
            {
              model: Project,
              as: 'project',
              include: [
                {
                  model: Student,
                  as: 'student',
                  where: { supervisorId: supervisor.userId }
                }
              ]
            }
          ]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied"
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      title,
      description,
      date: new Date(),
      taskId,
      supervisorId: supervisor.userId
    });

    res.status(201).json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add feedback"
    });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { supervisorUsername, taskId } = req.params;

    // Find supervisor by userId (which is used as username)
    const supervisor = await Supervisor.findOne({
      where: { userId: supervisorUsername }
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found"
      });
    }

    // Check if task exists and belongs to supervisor's student
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Milestone,
          as: 'milestone',
          include: [
            {
              model: Project,
              as: 'project',
              include: [
                {
                  model: Student,
                  as: 'student',
                  where: { supervisorId: supervisor.userId }
                }
              ]
            }
          ]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied"
      });
    }

    // Delete associated feedback first (cascade should handle this, but being explicit)
    await Feedback.destroy({
      where: { taskId }
    });

    // Delete the task
    await task.destroy();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });
  }
};

// Delete Meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const { supervisorUsername, meetingId } = req.params;

    // Find supervisor by userId (which is used as username)
    const supervisor = await Supervisor.findOne({
      where: { userId: supervisorUsername }
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found"
      });
    }

    // Check if meeting exists and belongs to supervisor's student
    const meeting = await Meeting.findOne({
      where: { id: meetingId },
      include: [
        {
          model: Milestone,
          as: 'milestone',
          include: [
            {
              model: Project,
              as: 'project',
              include: [
                {
                  model: Student,
                  as: 'student',
                  where: { supervisorId: supervisor.userId }
                }
              ]
            }
          ]
        }
      ]
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found or access denied"
      });
    }

    // Delete the meeting
    await meeting.destroy();

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete meeting"
    });
  }
};

// Delete Milestone
exports.deleteMilestone = async (req, res) => {
  try {
    const { supervisorUsername, milestoneId } = req.params;

    // Find supervisor by userId (which is used as username)
    const supervisor = await Supervisor.findOne({
      where: { userId: supervisorUsername }
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found"
      });
    }

    // Check if milestone exists and belongs to supervisor's student
    const milestone = await Milestone.findOne({
      where: { id: milestoneId },
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Student,
              as: 'student',
              where: { supervisorId: supervisor.userId }
            }
          ]
        }
      ]
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied"
      });
    }

    // Use transaction to ensure data integrity
    const transaction = await sequelize.transaction();

    try {
      // Delete all feedback associated with tasks in this milestone
      await Feedback.destroy({
        where: {
          taskId: {
            [require('sequelize').Op.in]: await Task.findAll({
              where: { milestoneId },
              attributes: ['id'],
              raw: true
            }).then(tasks => tasks.map(t => t.id))
          }
        },
        transaction
      });

      // Delete all tasks in this milestone
      await Task.destroy({
        where: { milestoneId },
        transaction
      });

      // Delete all meetings in this milestone
      await Meeting.destroy({
        where: { milestoneId },
        transaction
      });

      // Delete the milestone
      await milestone.destroy({ transaction });

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Milestone and all associated data deleted successfully"
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete milestone"
    });
  }
};

// Generate AI-powered report for student progress
exports.generateAIReport = async (req, res) => {
  try {
    const { supervisorId } = req.params;
    const { students } = req.body;

    if (!students || !Array.isArray(students)) {
      return res.status(400).json({
        success: false,
        message: "Students data is required for report generation"
      });
    }

    // Calculate overall statistics
    const totalStudents = students.length;
    const averageProgress = totalStudents > 0 
      ? Math.round(students.reduce((sum, student) => sum + student.progress, 0) / totalStudents)
      : 0;
    const completedTasks = students.reduce((sum, student) => sum + student.completedTasks, 0);
    const totalTasks = students.reduce((sum, student) => sum + student.totalTasks, 0);

    // Generate AI-like analysis
    let analysis = `STUDENT SUPERVISION ANALYSIS REPORT\n`;
    analysis += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    // Overall Performance Analysis
    analysis += `OVERALL PERFORMANCE INSIGHTS:\n`;
    if (averageProgress >= 80) {
      analysis += `✅ Exceptional Performance: Your students are demonstrating outstanding progress with an average completion rate of ${averageProgress}%.\n`;
    } else if (averageProgress >= 60) {
      analysis += `📈 Good Progress: Students are making solid progress at ${averageProgress}% average completion. There's room for improvement.\n`;
    } else if (averageProgress >= 40) {
      analysis += `⚠️ Moderate Concerns: Average progress of ${averageProgress}% indicates students may need additional support.\n`;
    } else {
      analysis += `🚨 Immediate Attention Required: Low average progress of ${averageProgress}% suggests significant intervention is needed.\n`;
    }

    // Task Completion Analysis
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    analysis += `\nTASK COMPLETION ANALYSIS:\n`;
    analysis += `• Total Tasks Assigned: ${totalTasks}\n`;
    analysis += `• Tasks Completed: ${completedTasks}\n`;
    analysis += `• Completion Rate: ${completionRate}%\n`;

    if (completionRate >= 85) {
      analysis += `• Assessment: Excellent task management and student engagement.\n`;
    } else if (completionRate >= 70) {
      analysis += `• Assessment: Good task completion rate with minor areas for improvement.\n`;
    } else if (completionRate >= 50) {
      analysis += `• Assessment: Moderate completion rate suggests need for better deadline management.\n`;
    } else {
      analysis += `• Assessment: Low completion rate indicates potential issues with task clarity or student support.\n`;
    }

    // Individual Student Analysis
    analysis += `\nINDIVIDUAL STUDENT INSIGHTS:\n`;
    students.forEach(student => {
      analysis += `\n${student.name} (${student.course} - ${student.level}):\n`;
      analysis += `  • Progress: ${student.progress}%\n`;
      analysis += `  • Tasks: ${student.completedTasks}/${student.totalTasks} completed\n`;
      
      if (student.progress >= 80) {
        analysis += `  • Status: High performer - consider providing advanced challenges\n`;
      } else if (student.progress >= 60) {
        analysis += `  • Status: On track - maintain current support level\n`;
      } else if (student.progress >= 40) {
        analysis += `  • Status: Needs attention - schedule one-on-one meetings\n`;
      } else {
        analysis += `  • Status: At risk - immediate intervention recommended\n`;
      }

      if (student.overdueTasks > 0) {
        analysis += `  • Alert: ${student.overdueTasks} overdue tasks require immediate attention\n`;
      }
    });

    // Recommendations
    analysis += `\nSTRATEGIC RECOMMENDATIONS:\n`;
    
    const strugglingStudents = students.filter(s => s.progress < 40);
    const highPerformers = students.filter(s => s.progress >= 80);
    const overdueTasksTotal = students.reduce((sum, s) => sum + (s.overdueTasks || 0), 0);

    if (strugglingStudents.length > 0) {
      analysis += `• Priority Action: Schedule immediate meetings with ${strugglingStudents.length} struggling student(s)\n`;
    }
    
    if (highPerformers.length > 0) {
      analysis += `• Opportunity: Leverage ${highPerformers.length} high performer(s) as peer mentors\n`;
    }
    
    if (overdueTasksTotal > 0) {
      analysis += `• Urgent: Address ${overdueTasksTotal} overdue tasks across all students\n`;
    }
    
    if (averageProgress < 60) {
      analysis += `• Suggestion: Consider revising project timelines or providing additional resources\n`;
    }
    
    analysis += `• Best Practice: Schedule regular check-ins to maintain momentum\n`;
    analysis += `• Growth: Implement peer review sessions to enhance learning\n`;

    // Generate summary for frontend
    const recommendations = [];
    if (strugglingStudents.length > 0) {
      recommendations.push(`${strugglingStudents.length} student(s) need immediate attention`);
    }
    if (averageProgress < 60) {
      recommendations.push("Consider providing additional support resources");
    }
    if (completionRate < 70) {
      recommendations.push("Review task deadlines and provide clearer guidelines");
    }
    if (highPerformers.length > 0) {
      recommendations.push(`Recognize and challenge ${highPerformers.length} high performer(s)`);
    }
    recommendations.push("Schedule regular progress review meetings");

    const summary = {
      totalStudents,
      averageProgress,
      completedTasks,
      totalTasks,
      recommendations
    };

    res.status(200).json({
      success: true,
      report: analysis,
      summary
    });

  } catch (error) {
    console.error("Error generating AI report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI report"
    });
  }
};

// Chat Functions

// Get all chats for a supervisor
exports.getSupervisorChats = async (req, res) => {
  try {
    const { supervisorId } = req.params;

    const chats = await Chat.findAll({
      where: { supervisorId },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['userId', 'fullName', 'email']
        }
      ],
      order: [['lastMessageAt', 'DESC']]
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching supervisor chats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
};

// Get or create a chat between supervisor and student
exports.getOrCreateSupervisorChat = async (req, res) => {
  try {
    const { supervisorId, studentId } = req.body;

    let chat = await Chat.findOne({
      where: { supervisorId, studentId },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['userId', 'fullName', 'email']
        },
        {
          model: Supervisor,
          as: 'supervisor',
          attributes: ['userId', 'fullName', 'email']
        }
      ]
    });

    if (!chat) {
      chat = await Chat.create({
        supervisorId,
        studentId,
        lastMessageAt: new Date()
      });

      // Fetch the chat with associations
      chat = await Chat.findByPk(chat.id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['userId', 'fullName', 'email']
          },
          {
            model: Supervisor,
            as: 'supervisor',
            attributes: ['userId', 'fullName', 'email']
          }
        ]
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error getting or creating supervisor chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get or create chat',
      error: error.message
    });
  }
};

// Get messages for a specific chat
exports.getSupervisorChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.findAll({
      where: { chatId },
      include: [
        {
          model: Student,
          as: 'senderStudent',
          attributes: ['userId', 'fullName'],
          required: false
        },
        {
          model: Supervisor,
          as: 'senderSupervisor',
          attributes: ['userId', 'fullName'],
          required: false
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    // Process messages to include tagged item data
    const processedMessages = await Promise.all(
      messages.map(async (message) => {
        const messageData = message.toJSON();
        
        if (messageData.taggedItemId && messageData.taggedItemType) {
          try {
            let taggedItemData = null;
            
            switch (messageData.taggedItemType) {
              case 'document':
                taggedItemData = await Document.findByPk(messageData.taggedItemId, {
                  attributes: ['id', 'title', 'description']
                });
                break;
              case 'task':
                taggedItemData = await Task.findByPk(messageData.taggedItemId, {
                  attributes: ['id', 'title', 'description', 'status']
                });
                break;
              case 'milestone':
                taggedItemData = await Milestone.findByPk(messageData.taggedItemId, {
                  attributes: ['id', 'title', 'description', 'status']
                });
                break;
            }
            
            messageData.taggedItemData = taggedItemData;
          } catch (error) {
            console.error('Error fetching tagged item data:', error);
          }
        }
        
        return messageData;
      })
    );

    res.status(200).json({ messages: processedMessages });
  } catch (error) {
    console.error('Error fetching supervisor chat messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Send a message from supervisor
exports.sendSupervisorMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { 
      senderId, 
      content, 
      messageType = 'text', 
      taggedItemId, 
      taggedItemType,
      attachmentUrl,
      attachmentName
    } = req.body;

    const message = await Message.create({
      chatId: parseInt(chatId),
      senderId,
      senderType: 'supervisor',
      content,
      messageType,
      taggedItemId,
      taggedItemType,
      attachmentUrl,
      attachmentName,
      isRead: false
    });

    // Update chat's lastMessageAt
    await Chat.update(
      { lastMessageAt: new Date() },
      { where: { id: chatId } }
    );

    // Fetch the created message with associations
    const newMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: Supervisor,
          as: 'senderSupervisor',
          attributes: ['userId', 'fullName']
        }
      ]
    });

    // Process message to include tagged item data
    const messageData = newMessage.toJSON();
    
    if (messageData.taggedItemId && messageData.taggedItemType) {
      try {
        let taggedItemData = null;
        
        switch (messageData.taggedItemType) {
          case 'document':
            taggedItemData = await Document.findByPk(messageData.taggedItemId, {
              attributes: ['id', 'title', 'description']
            });
            break;
          case 'task':
            taggedItemData = await Task.findByPk(messageData.taggedItemId, {
              attributes: ['id', 'title', 'description', 'status']
            });
            break;
          case 'milestone':
            taggedItemData = await Milestone.findByPk(messageData.taggedItemId, {
              attributes: ['id', 'title', 'description', 'status']
            });
            break;
        }
        
        messageData.taggedItemData = taggedItemData;
      } catch (error) {
        console.error('Error fetching tagged item data:', error);
      }
    }

    res.status(201).json(messageData);
  } catch (error) {
    console.error('Error sending supervisor message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get taggable items for a student (from supervisor perspective)
exports.getSupervisorTaggableItems = async (req, res) => {
  try {
    const { studentId } = req.params;
    const supervisorId = req.user.userId; // Get supervisor ID from authenticated user

    // Get the student's project
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: Milestone,
              as: 'milestones',
              attributes: ['id', 'title', 'description', 'status', 'endDate'],
              include: [
                {
                  model: Task,
                  as: 'tasks',
                  attributes: ['id', 'title', 'description', 'status', 'endDate']
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
        message: 'Student not found'
      });
    }

    // Get documents for this student (documents uploaded by or for this student)
    const studentDocuments = await Document.findAll({
      where: { 
        studentId: studentId 
      },
      attributes: ['id', 'title', 'description', 'fileType']
    });

    // Get documents uploaded by the supervisor
    const supervisorDocuments = await Document.findAll({
      where: { 
        supervisorId: supervisorId 
      },
      attributes: ['id', 'title', 'description', 'fileType']
    });

    // Combine all documents
    const allDocuments = [
      ...studentDocuments.map(doc => ({
        id: doc.id.toString(),
        title: doc.title,
        description: doc.description,
        type: 'document',
        source: 'student'
      })),
      ...supervisorDocuments.map(doc => ({
        id: doc.id.toString(),
        title: doc.title,
        description: doc.description,
        type: 'document',
        source: 'supervisor'
      }))
    ];

    // Extract all tasks from all milestones
    const allTasks = [];
    if (student.project?.milestones) {
      student.project.milestones.forEach(milestone => {
        if (milestone.tasks) {
          milestone.tasks.forEach(task => {
            allTasks.push({
              id: task.id.toString(),
              title: task.title,
              description: task.description,
              status: task.status,
              type: 'task'
            });
          });
        }
      });
    }

    const result = {
      documents: allDocuments,
      tasks: allTasks,
      milestones: student.project?.milestones?.map(milestone => ({
        id: milestone.id.toString(),
        title: milestone.title,
        description: milestone.description,
        status: milestone.status,
        type: 'milestone'
      })) || []
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching supervisor taggable items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch taggable items',
      error: error.message
    });
  }
};

// Mark messages as read by supervisor
exports.markSupervisorMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { supervisorId } = req.body;

    await Message.update(
      { 
        isRead: true,
        readAt: new Date()
      },
      {
        where: {
          chatId: parseInt(chatId),
          senderType: 'student', // Only mark student messages as read
          isRead: false
        }
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking supervisor messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};
