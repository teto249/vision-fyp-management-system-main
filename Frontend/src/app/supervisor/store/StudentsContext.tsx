"use client";

import { createContext, useContext, useState } from 'react';
import type { Student, Project } from '../types/types';

interface StudentsContextType {
  students: Student[];
  setStudents: (students: Student[]) => void;
  getStudentById: (id: string) => Student | undefined;
  updateStudentProject: (studentId: string, projectData: Partial<Project>) => void;
  updateProjectProgress: (studentId: string, progress: number) => void;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);

  const getStudentById = (id: string) => {
    return students.find(student => student.userId === id);
  };

  const updateStudentProject = (studentId: string, projectData: Partial<Project>) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.userId === studentId && student.project
          ? {
              ...student,
              project: {
                ...student.project,
                ...projectData,
                // Handle nested updates
                student: student.project.student,
                university: student.project.university,
                milestones: projectData.milestones || student.project.milestones
              }
            }
          : student
      )
    );
  };

  const updateProjectProgress = (studentId: string, progress: number) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.userId === studentId && student.project
          ? {
              ...student,
              project: {
                ...student.project,
                progress
              }
            }
          : student
      )
    );
  };

  return (
    <StudentsContext.Provider value={{
      students,
      setStudents,
      getStudentById,
      updateStudentProject,
      updateProjectProgress
    }}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }
  return context;
}