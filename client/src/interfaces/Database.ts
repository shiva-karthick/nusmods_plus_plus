import { Activity, CourseCode, Section, Status } from './Periods';

export interface DbCourse {
  courseCode: CourseCode; // string
  name: string;
  classes: DbClass[];
}

export interface DbClass {
  activity: Activity; // string
  times: DbTimes[]; // array of DbTimes
  status: Status; // 'Open' | 'Full' | 'On Hold'
  courseEnrolment: DbCourseEnrolment; // {enrolments, capacity}
  section: Section; // string
}

export interface DbCourseEnrolment {
  enrolments: number;
  capacity: number;
}

export interface DbTimes {
  time: DbTime; // {start, end}
  day: string;
  location: string;
  weeks: string;
}

export interface DbTime {
  start: string;
  end: string;
}
