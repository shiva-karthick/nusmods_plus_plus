import { CourseCode } from './Periods';

export type CoursesList = CourseOverview[]; // list of CoursesList

// what exactly is an interface?
// An interface is a syntactical contract that an entity should conform to. In other words, an interface defines the syntax that any entity must adhere to.
export interface CourseOverview {
  code: string;
  name: string;
  online: boolean;
  inPerson: boolean;
  career: string; // whether the course is for undergraduates or graduates
}

export interface CoursesListWithDate {
  lastUpdated: number;
  courses: CoursesList;
}

export interface FetchedCourse {
  moduleCode: string; // type CourseCode = string
  title: string;
  online: boolean;
  inPerson: boolean;
  career: string;
}
