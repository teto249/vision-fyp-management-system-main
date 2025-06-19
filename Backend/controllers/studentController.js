const { Op } = require("sequelize");
const { sequelize } = require("../config/database"); // Add this line
const Student = require("../models/Student");
const University = require("../models/University");
const Supervisor = require("../models/Supervisor");
const Project = require("../models/Project");
const Milestone = require("../models/Milestone");
const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const Feedback = require("../models/Feedback");
const Document = require('../models/Document');

// Get Student account
exports.getStudentAccount = async (req, res) => {
  try {
    const { userid } = req.query;
    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const student = await Student.findOne({
      where: { userId: userid, role: "Student" }, // Changed from userid to userId
      include: {
        model: University,
        as: "University",
        attributes: [
          "id",
          "shortName",
          "fullName",
          "address",
          "email",
          "phone",
          "logoPath",
          "status",
        ],
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
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
      },
    });
  } catch (error) {
    console.error("Failed to get Student account:", error);
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
      return res.status(400).json({ message: "User ID is required" });
    }

    const student = await Student.findOne({
      where: { userid: userId, role: "Student" }, // Changed to match database field
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
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
      where: { userid: userId, role: "Student" }, // Changed to match database field
      include: {
        model: University,
        as: "University", 
        attributes: [
          "id",
          "shortName",
          "fullName",
          "address",
          "email",
          "phone",
          "logoPath",
          "status",
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
    console.error("Failed to update Student account:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Supervisors by University
exports.getSupervisorsByUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;

    if (!universityId) {
      return res.status(400).json({
        success: false,
        message: "University ID is required",
      });
    }

    // Check if university exists
    const university = await University.findByPk(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    const supervisors = await Supervisor.findAll({
      where: {
        universityId,
        role: "Supervisor",
      },
      attributes: [
        "userId", // Changed from id to userId
        "fullName",
        "email",
        "department",
        "officeAddress",
        "universityId",
      ],
    });

    return res.status(200).json({
      success: true,
      supervisors,
      count: supervisors.length,
      message: "Supervisors fetched successfully",
    });
  } catch (error) {
    console.error("Failed to fetch supervisors:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch supervisors",
    });
  }
};

// Create Project
exports.createProject = async (req, res) => {
  try {
    const {
      projectTitle,
      projectType,
      projectDescription,
      startDate,
      endDate,
      supervisorId,
      studentId,
    } = req.body;

    // Validate input
    if (
      !projectTitle ||
      !projectType ||
      !projectDescription ||
      !startDate ||
      !endDate ||
      !supervisorId ||
      !studentId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Check if student exists and get university ID
    const student = await Student.findOne({
      where: { userId: studentId, role: "Student" },
      attributes: ["userId", "universityId", "role", "supervisorId"],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if supervisor exists and belongs to student's university
    const supervisor = await Supervisor.findOne({
      where: {
        userId: supervisorId,
        universityId: student.universityId,
        role: "Supervisor",
      },
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Invalid supervisor selected",
      });
    }

    // Start a transaction
    const t = await sequelize.transaction();

    try {
      // Create project with university ID from student record
      const project = await Project.create(
        {
          // Remove explicit id field - it will be auto-generated
          projectTitle,
          projectType,
          projectDescription,
          startDate,
          endDate,
          studentId,
          supervisorId,
          universityId: student.universityId,
          status: "Pending",
          progress: 0,
        },
        { transaction: t }
      );

      // Update student's supervisorId
      await Student.update(
        { supervisorId: supervisorId },
        {
          where: { userId: studentId },
          transaction: t,
        }
      );

      // Commit transaction
      await t.commit();

      // Return success response
      return res.status(201).json({
        success: true,
        message: "Project created successfully and student updated",
        project: {
          id: project.id,
          projectTitle: project.projectTitle,
          projectType: project.projectType,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          supervisorId: project.supervisorId,
          universityId: project.universityId,
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create project and update student",
    });
  }
};

// Get Project
exports.getProject = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const project = await Project.findOne({
      where: { studentId },
      include: [
        {
          model: Supervisor,
          attributes: ["fullName"],
        },
        {
          model: Milestone,
          include: [
            {
              model: Task,
              attributes: ["id", "title", "status"],
            },
            {
              model: Meeting,
              attributes: ["id", "date", "time", "link", "purpose"],
            },
          ],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No project found for this student",
      });
    }

    res.status(200).json({
      success: true,
      project: {
        title: project.projectTitle,
        description: project.projectDescription,
        startDate: project.startDate,
        endDate: project.endDate,
        supervisor: project.Supervisor.fullName,
        milestones: project.Milestones.map((milestone) => ({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          tasks: milestone.Tasks,
          meetings: milestone.Meetings,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project details",
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate studentId
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required"
      });
    }

    const project = await Project.findOne({
      where: { studentId },
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
          model: Student,
          as: "student",
          attributes: ['userId', 'fullName', 'universityEmail']
        },
        {
          model: Supervisor,
          as: "supervisor",
          attributes: ['userId', 'fullName', 'department']
        },
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
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `No project found for student with ID ${studentId}`
      });
    }

    // Calculate project progress based on completed tasks
    const totalTasks = project.milestones.reduce(
      (sum, milestone) => sum + milestone.tasks.length, 0
    );
    const completedTasks = project.milestones.reduce(
      (sum, milestone) => sum + milestone.tasks.filter(task => task.status === "Completed").length, 0
    );
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Format the response
    const formattedProject = {
      id: project.id,
      title: project.projectTitle,
      type: project.projectType,
      description: project.projectDescription,
      status: project.status,
      progress: progress,
      startDate: project.startDate,
      endDate: project.endDate,
      student: {
        id: project.student.userId,
        name: project.student.fullName,
        email: project.student.universityEmail
      },
      supervisor: {
        id: project.supervisor.userId,
        name: project.supervisor.fullName,
        department: project.supervisor.department
      },
      university: {
        id: project.university.id,
        shortName: project.university.shortName,
        fullName: project.university.fullName
      },
      milestones: project.milestones.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        status: milestone.status,
        startDate: milestone.startDate,
        endDate: milestone.endDate,
        tasks: milestone.tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          startDate: task.startDate,
          endDate: task.endDate,
          feedback: task.feedback
        })),
        meetings: milestone.meetings
      }))
    };

    res.status(200).json({
      success: true,
      project: formattedProject
    });

  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project details",
      error: error.message
    });
  }
};
 
// Add new milestone
exports.addMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, startDate, endDate } = req.body;

    // Validate projectId
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required"
      });
    }

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Validate input
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const milestone = await Milestone.create({
      projectId,
      title: title.trim(),
      description: description.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'Pending'
    });

    // Update the attributes list when fetching the created milestone
    const createdMilestone = await Milestone.findByPk(milestone.id, {
      include: [
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'title', 'description', 'status', 'startDate', 'endDate']
        },
        {
          model: Meeting,
          as: 'meetings',
          attributes: ['id', 'title', 'date', 'link', 'type'] // Removed 'time' from here
        }
      ]
    });

    res.status(201).json({
      success: true,
      milestone: {
        id: createdMilestone.id,
        title: createdMilestone.title,
        description: createdMilestone.description,
        status: createdMilestone.status,
        startDate: createdMilestone.startDate,
        endDate: createdMilestone.endDate,
        tasks: createdMilestone.tasks || [],
        meetings: createdMilestone.meetings || []
      }
    });

  } catch (error) {
    console.error("Error adding milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add milestone",
      error: error.message
    });
  }
};

// Add new task to milestone
exports.addTask = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { title, description, startDate, endDate } = req.body;

    // Validate input
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const task = await Task.create({
      milestoneId,
      title,
      description,
      startDate,
      endDate,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      task
    });

  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add task",
      error: error.message
    });
  }
};

// Add new meeting to milestone
exports.addMeeting = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { title, date, time, link, type } = req.body;

    // Validate input
    if (!title || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Title, date and time are required"
      });
    }

    const meeting = await Meeting.create({
      milestoneId,
      title,
      date,
      time,
      link: link || '',
      type: type || 'Online'
    });

    res.status(201).json({
      success: true,
      meeting
    });

  } catch (error) {
    console.error("Error adding meeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add meeting",
      error: error.message
    });
  }
};

exports.updateProjectMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { milestones } = req.body;

    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Milestone,
          as: 'milestones',
          include: [
            {
              model: Task,
              as: 'tasks',
              attributes: ['id', 'title', 'description', 'status', 'startDate', 'endDate']
            },
            {
              model: Meeting,
              as: 'meetings',
              attributes: ['id', 'title', 'description', 'date', 'link', 'type'] // Removed status
            }
          ]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      project
    });

  } catch (error) {
    console.error("Error updating milestones:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update milestones",
      error: error.message
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { milestoneId, taskId } = req.params;
    const result = await Task.destroy({
      where: { id: taskId, milestoneId }
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { milestoneId, taskId } = req.params;
    const { title, description, status, startDate, endDate } = req.body;

    const task = await Task.findOne({
      where: { id: taskId, milestoneId }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    await task.update({
      title: title?.trim(),
      description: description?.trim(),
      status,
      startDate,
      endDate
    });

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
  try {
    const { milestoneId, meetingId } = req.params;
    const { title, date, time, link, type } = req.body;

    const meeting = await Meeting.findOne({
      where: { id: meetingId, milestoneId }
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    await meeting.update({
      title: title?.trim(),
      date,
      time,
      link: link?.trim(),
      type
    });

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const { milestoneId, meetingId } = req.params;
    const result = await Meeting.destroy({
      where: { id: meetingId, milestoneId }
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// // Document-related controller functions
// exports.getSupervisorDocuments = async (req, res) => {
//   try {
//     const { supervisorId } = req.params;


//     if (!supervisorId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Supervisor ID is required'
//       });
//     }

//     // Verify student-supervisor relationship
//     const student = await Student.findOne({
//       where: { 
   
//         supervisorId: supervisorId 
//       }
//     });

//     if (!student) {
//       return res.status(403).json({
//         success: false,
//         message: 'Unauthorized access: Invalid supervisor'
//       });
//     }

    
//     const documents = await Document.findAll({
//       where: { supervisorId },
//       attributes: [
//         'id', 
//         'title', 
//         'description', 
//         'fileType', 
//         'fileContent',
//         'uploadedBy', 
//         'supervisorId', 
//         'createdAt',
//         'updatedAt'
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     const transformedDocuments = documents.map(doc => ({
//       ...doc.toJSON(),
//       fileContent: undefined,
//       fileUrl: doc.fileContent ? 
//         `data:application/${doc.fileType.replace('.', '')};base64,${doc.fileContent.toString('base64')}` : 
//         null
//     }));

//     res.status(200).json({
//       success: true,
//       documents: transformedDocuments
//     });
//   } catch (error) {
//     console.error('Error fetching supervisor documents:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch supervisor documents',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };
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

// exports.getDocumentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const studentId = req.user.userId;

//     const student = await Student.findOne({
//       where: { userId: studentId },
//       attributes: ['supervisorId']
//     });

//     if (!student || !student.supervisorId) {
//       return res.status(404).json({
//         success: false,
//         message: 'No supervisor assigned'
//       });
//     }

//     const document = await Document.findOne({
//       where: { 
//         id,
//         supervisorId: student.supervisorId
//       }
//     });

//     if (!document) {
//       return res.status(404).json({
//         success: false,
//         message: 'Document not found'
//       });
//     }

//     const transformedDocument = {
//       ...document.toJSON(),
//       fileContent: undefined,
//       fileUrl: document.fileContent ? 
//         `data:application/${document.fileType.replace('.', '')};base64,${document.fileContent.toString('base64')}` : 
//         null
//     };

//     res.status(200).json({
//       success: true,
//       document: transformedDocument
//     });
//   } catch (error) {
//     console.error('Error fetching document:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch document',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

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

// exports.downloadDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const studentId = req.user.userId;

//     const student = await Student.findOne({
//       where: { userId: studentId },
//       attributes: ['supervisorId']
//     });

//     if (!student || !student.supervisorId) {
//       return res.status(404).json({
//         success: false,
//         message: 'No supervisor assigned'
//       });
//     }

//     const document = await Document.findOne({
//       where: { 
//         id,
//         supervisorId: student.supervisorId
//       }
//     });

//     if (!document || !document.fileContent) {
//       return res.status(404).json({
//         success: false,
//         message: 'Document not found or no content available'
//       });
//     }

//     // Set response headers for file download
//     res.setHeader('Content-Type', `application/${document.fileType.replace('.', '')}`);
//     res.setHeader('Content-Disposition', `attachment; filename=${document.title}${document.fileType}`);
    
//     // Send file content
//     res.send(document.fileContent);
//   } catch (error) {
//     console.error('Error downloading document:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to download document',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

