import jsPDF from 'jspdf';

export const generateProjectReportPDF = async (projectData, studentInfo) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // System color palette
    const colors = {
      primary: [37, 99, 235],
      secondary: [99, 102, 241],
      success: [34, 197, 94],
      warning: [234, 179, 8],
      danger: [239, 68, 68],
      gray: [75, 85, 99],
      lightGray: [156, 163, 175],
      darkText: [17, 24, 39],
      mediumText: [55, 65, 81]
    };

    // Helper function to safely get text
    const safeText = (text, defaultText = '') => {
      if (!text || text === 'undefined' || text === 'null' || text === undefined || text === null) {
        return defaultText;
      }
      const str = text.toString().trim();
      return str === '' ? defaultText : str;
    };

    // Helper function to add new page if needed
    const checkNewPage = (requiredSpace = 25) => {
      if (yPosition + requiredSpace > pageHeight - margin - 15) {
        pdf.addPage();
        addHeader();
        yPosition = 60;
        return true;
      }
      return false;
    };

    // Header function
    const addHeader = () => {
      pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROJECT REPORT', margin, 25);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, margin, 35);
      
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(1);
      pdf.line(margin, 47, pageWidth - margin, 47);
    };

    // Section header function
    const addSectionHeader = (title) => {
      checkNewPage(15);
      
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin - 5, yPosition - 3, pageWidth - 2 * margin + 10, 10, 'F');
      
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin, yPosition + 4);
      
      yPosition += 15;
    };

    // Key-value function
    const addKeyValue = (key, value, valueColor = colors.darkText) => {
      if (!value && value !== 0 && value !== false) return;
      
      checkNewPage(8);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      pdf.text(key + ':', margin, yPosition);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(valueColor[0], valueColor[1], valueColor[2]);
      
      const cleanValue = safeText(value, 'Not specified');
      const maxWidth = pageWidth - 2 * margin - 50;
      const lines = pdf.splitTextToSize(cleanValue, maxWidth);
      
      lines.forEach((line, index) => {
        if (index > 0) checkNewPage(6);
        pdf.text(line, margin + 50, yPosition + (index * 6));
      });
      
      yPosition += Math.max(6, lines.length * 6) + 2;
    };

    // Progress bar function
    const addProgressBar = (label, percentage) => {
      checkNewPage(12);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      pdf.text(label, margin, yPosition);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
      pdf.text(`${percentage}%`, pageWidth - margin - 20, yPosition);
      
      yPosition += 6;
      
      // Progress bar background
      pdf.setFillColor(229, 231, 235);
      pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, 4, 'F');
      
      // Progress bar fill
      const fillWidth = ((pageWidth - 2 * margin) * percentage) / 100;
      pdf.setFillColor(colors.success[0], colors.success[1], colors.success[2]);
      pdf.rect(margin, yPosition - 2, fillWidth, 4, 'F');
      
      yPosition += 8;
    };

    // Calculate project statistics
    const calculateProjectStats = (project) => {
      let totalMilestones = project?.milestones?.length || 0;
      let completedMilestones = 0;
      let totalTasks = 0;
      let completedTasks = 0;
      let pendingTasks = 0;
      let totalMeetings = 0;
      let totalFeedback = 0;

      if (project?.milestones) {
        project.milestones.forEach(milestone => {
          if (milestone.status === 'Completed') {
            completedMilestones++;
          }

          if (milestone.tasks) {
            totalTasks += milestone.tasks.length;
            milestone.tasks.forEach(task => {
              if (task.status === 'Completed') {
                completedTasks++;
              } else {
                pendingTasks++;
              }
              
              if (task.feedback) {
                totalFeedback += task.feedback.length;
              }
            });
          }

          if (milestone.meetings) {
            totalMeetings += milestone.meetings.length;
          }
        });
      }

      return {
        totalMilestones,
        completedMilestones,
        totalTasks,
        completedTasks,
        pendingTasks,
        totalMeetings,
        totalFeedback
      };
    };

    // Start generating report
    addHeader();
    yPosition = 55;

    // Student Information Section
    addSectionHeader('STUDENT INFORMATION');
    addKeyValue('Full Name', studentInfo?.name);
    addKeyValue('Email Address', studentInfo?.email);
    addKeyValue('Student ID', studentInfo?.username);
    addKeyValue('University', studentInfo?.university?.name);
    yPosition += 5;

    // Project Overview Section
    addSectionHeader('PROJECT OVERVIEW');
    if (projectData) {
      addKeyValue('Project Title', projectData.title, colors.primary);
      addKeyValue('Description', projectData.description);
      
      // Status with color coding
      const statusColor = projectData.status === 'APPROVED' ? colors.success : 
                         projectData.status === 'PENDING' ? colors.warning : colors.danger;
      addKeyValue('Current Status', projectData.status, statusColor);
      
      addKeyValue('Start Date', projectData.startDate ? 
        new Date(projectData.startDate).toLocaleDateString('en-GB') : null);
      
      addKeyValue('End Date', projectData.endDate ? 
        new Date(projectData.endDate).toLocaleDateString('en-GB') : null);
      
      // Progress bar
      if (projectData.progress !== undefined && projectData.progress !== null) {
        yPosition += 5;
        addProgressBar('Overall Progress', projectData.progress || 0);
      }
      
      // Supervisor Information
      if (projectData.supervisor) {
        yPosition += 8;
        addSectionHeader('SUPERVISOR INFORMATION');
        addKeyValue('Name', projectData.supervisor.name);
        addKeyValue('Email', projectData.supervisor.email);
        addKeyValue('Department', projectData.supervisor.department);
      }
    }

    yPosition += 10;

    // Project Statistics
    addSectionHeader('PROJECT STATISTICS');
    if (projectData?.milestones) {
      const stats = calculateProjectStats(projectData);
      
      addKeyValue('Total Milestones', stats.totalMilestones.toString(), colors.primary);
      addKeyValue('Completed Milestones', stats.completedMilestones.toString(), colors.success);
      addKeyValue('Total Tasks', stats.totalTasks.toString(), colors.primary);
      addKeyValue('Completed Tasks', stats.completedTasks.toString(), colors.success);
      addKeyValue('Pending Tasks', stats.pendingTasks.toString(), colors.warning);
      addKeyValue('Total Meetings', stats.totalMeetings.toString(), colors.secondary);
      addKeyValue('Total Feedback Items', stats.totalFeedback.toString(), colors.primary);
      
      // Task completion rate
      if (stats.totalTasks > 0) {
        yPosition += 5;
        const completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100);
        addProgressBar('Task Completion Rate', completionRate);
      }
    }

    yPosition += 10;

    // Milestones Section
    if (projectData?.milestones && projectData.milestones.length > 0) {
      addSectionHeader('MILESTONES BREAKDOWN');
      
      projectData.milestones.forEach((milestone, index) => {
        checkNewPage(20);
        
        // Milestone title
        pdf.setFillColor(245, 247, 250);
        pdf.rect(margin - 3, yPosition - 2, pageWidth - 2 * margin + 6, 8, 'F');
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.text(`${index + 1}. ${safeText(milestone.title, 'Untitled Milestone')}`, margin, yPosition + 4);
        
        yPosition += 12;
        
        addKeyValue('Description', milestone.description);
        
        const statusColor = milestone.status === 'Completed' ? colors.success : 
                           milestone.status === 'In Progress' ? colors.warning : colors.gray;
        addKeyValue('Status', milestone.status, statusColor);
        
        addKeyValue('Start Date', milestone.startDate ? 
          new Date(milestone.startDate).toLocaleDateString('en-GB') : null);
        addKeyValue('End Date', milestone.endDate ? 
          new Date(milestone.endDate).toLocaleDateString('en-GB') : null);
        
        // Tasks
        if (milestone.tasks && milestone.tasks.length > 0) {
          yPosition += 5;
          pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Tasks:', margin, yPosition);
          yPosition += 6;
          
          milestone.tasks.forEach((task) => {
            checkNewPage(12);
            
            const taskStatus = task.status === 'Completed' ? 'DONE' : 
                             task.status === 'In Progress' ? 'WORKING' : 'PENDING';
            const taskColor = task.status === 'Completed' ? colors.success : 
                            task.status === 'In Progress' ? colors.warning : colors.gray;
            
            pdf.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`- ${safeText(task.title, 'Untitled Task')}`, margin + 5, yPosition);
            
            pdf.setTextColor(taskColor[0], taskColor[1], taskColor[2]);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.text(`[${taskStatus}]`, pageWidth - margin - 25, yPosition);
            
            yPosition += 5;
            
            if (task.description && task.description.trim()) {
              pdf.setTextColor(colors.mediumText[0], colors.mediumText[1], colors.mediumText[2]);
              pdf.setFontSize(8);
              const descLines = pdf.splitTextToSize(safeText(task.description), pageWidth - 2 * margin - 15);
              descLines.forEach(line => {
                checkNewPage(4);
                pdf.text(line, margin + 10, yPosition);
                yPosition += 4;
              });
            }
            
            pdf.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
            pdf.setFontSize(7);
            const dueDate = task.endDate || task.dueDate;
            pdf.text(`Due: ${dueDate ? new Date(dueDate).toLocaleDateString('en-GB') : 'Not set'}`, 
              margin + 10, yPosition);
            yPosition += 6;
          });
        }

        // Meetings
        if (milestone.meetings && milestone.meetings.length > 0) {
          yPosition += 3;
          pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Meetings:', margin, yPosition);
          yPosition += 6;
          
          milestone.meetings.forEach((meeting) => {
            checkNewPage(8);
            
            pdf.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9);
            pdf.text(`- ${safeText(meeting.purpose, 'Meeting')}`, margin + 5, yPosition);
            yPosition += 5;
            
            const meetingDate = meeting.date ? 
              new Date(meeting.date).toLocaleDateString('en-GB') : 'Date not set';
            
            pdf.setTextColor(colors.mediumText[0], colors.mediumText[1], colors.mediumText[2]);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.text(`Date: ${meetingDate}`, margin + 10, yPosition);
            pdf.text(`Type: ${safeText(meeting.type, 'Online')}`, margin + 60, yPosition);
            yPosition += 6;
          });
        }

        yPosition += 8;
      });
    }

    // Add footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      pdf.setFontSize(8);
      pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 12);
      pdf.text('Vision FYP Management System', margin, pageHeight - 12);
    }

    // Save with clean filename
    const projectTitle = projectData?.title ? 
      projectData.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') : 
      'Project';
    const fileName = `${projectTitle}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return { success: true, message: 'Project report generated successfully!' };

  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, message: 'Failed to generate PDF: ' + error.message };
  }
};

export const generateQuickTaskListPDF = async (tasks, studentInfo) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // System color palette
    const colors = {
      primary: [37, 99, 235],
      success: [34, 197, 94],
      warning: [234, 179, 8],
      danger: [239, 68, 68],
      gray: [75, 85, 99],
      lightGray: [156, 163, 175],
      darkText: [17, 24, 39]
    };

    // Helper function to safely get text
    const safeText = (text, defaultText = '') => {
      if (!text || text === 'undefined' || text === 'null' || text === undefined || text === null) {
        return defaultText;
      }
      const str = text.toString().trim();
      return str === '' ? defaultText : str;
    };

    // Helper function to add new page if needed
    const checkNewPage = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > pageHeight - margin - 15) {
        pdf.addPage();
        addHeader();
        yPosition = 60;
        return true;
      }
      return false;
    };

    // Header function
    const addHeader = () => {
      pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QUICK TASK LIST', margin, 25);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, margin, 35);
      
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(1);
      pdf.line(margin, 47, pageWidth - margin, 47);
    };

    // Start generating
    addHeader();
    yPosition = 55;

    if (!tasks || tasks.length === 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      pdf.text('No tasks found.', margin, yPosition);
    } else {
      // Group tasks by status
      const groupedTasks = {
        'Pending': tasks.filter(task => task.status === 'Pending' || !task.status),
        'In Progress': tasks.filter(task => task.status === 'In Progress'),
        'Completed': tasks.filter(task => task.status === 'Completed')
      };

      Object.entries(groupedTasks).forEach(([status, statusTasks]) => {
        if (statusTasks.length === 0) return;

        checkNewPage(15);
        
        // Status header
        const statusColor = status === 'Completed' ? colors.success :
                           status === 'In Progress' ? colors.warning : colors.danger;
        
        pdf.setFillColor(248, 250, 252);
        pdf.rect(margin - 5, yPosition - 3, pageWidth - 2 * margin + 10, 10, 'F');
        
        pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${status.toUpperCase()} TASKS (${statusTasks.length})`, margin, yPosition + 4);
        
        yPosition += 15;

        statusTasks.forEach(task => {
          checkNewPage(12);
          
          // Task title
          pdf.setTextColor(colors.darkText[0], colors.darkText[1], colors.darkText[2]);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`- ${safeText(task.title, 'Untitled Task')}`, margin, yPosition);
          
          yPosition += 5;
          
          // Due date
          const dueDate = task.endDate || task.dueDate;
          pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Due: ${dueDate ? new Date(dueDate).toLocaleDateString('en-GB') : 'Not set'}`, 
            margin + 5, yPosition);
          
          yPosition += 6;
        });
        
        yPosition += 5;
      });
    }

    // Add footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      pdf.setFontSize(8);
      pdf.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 12);
      pdf.text('Vision FYP Management System', margin, pageHeight - 12);
    }

    // Save with clean filename
    const fileName = `Task_List_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return { success: true, message: 'Task list generated successfully!' };

  } catch (error) {
    console.error('Error generating task list PDF:', error);
    return { success: false, message: 'Failed to generate task list: ' + error.message };
  }
};
