interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  groupId?: number;
}

interface Theme {
  id: number;
  student: string;
  studentId: number;
  name: string;
  teacher: string;
}

export const getStudentFullName = (student: User) => {
  return student && (`${student.lastName} ${student.firstName} ${student.middleName}`);
};

export const getTeacherFullName = (teacher: User, degree: string) => {
  return teacher && (`${degree} ${teacher.lastName} ${teacher.firstName[0]}.${teacher.middleName[0]}.`);
};

export const getStudentsByGroup = (students: User[], groupId: number) => {
  return students.filter(i => i.groupId === groupId);
};

export const getThemeByStudent = (themes: Theme[], studentId: number) => {
  const theme = themes.find(theme => theme.studentId === studentId);
  return theme ? theme.name : '';
};

export const getTeacherByThemeAndStudent = (themes: Theme[], studentId: number) => {
  const theme = themes.find(theme => theme.studentId === studentId);
  return theme ? theme.teacher : '';
};
