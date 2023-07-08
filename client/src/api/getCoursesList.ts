// https://api.nusmods.com/v2/

import { CoursesList, CoursesListWithDate, FetchedCourse } from '../interfaces/Courses';
import { API_URL } from './config';
import NetworkError from '../interfaces/NetworkError';
import timeoutPromise from '../utils/timeoutPromise';

const toCoursesList = (data: FetchedCourse[]): CoursesList =>
  data.map((course) => ({
    code: course.moduleCode,
    name: course.title,
    online: false,
    inPerson: false,
    career: "UGRD/PGRD",
  }));

/**
 * Fetches a list of course objects, where each course object contains
 * the course id, the course code, and course name
 *
 * Expected response format: {lastUpdated: number, courses: [...]};
 *
 * @param year The year that the courses are offered in
 * @param term The term that the courses are offered in
 * @return A promise containing the list of course objects offered in the specified year and term
 *
 * @example
 * const coursesList = await getCoursesList('2020', 'T1')
 */
const getCoursesList = async (year: string, term: string): Promise<CoursesListWithDate> => {
  const baseURL = `https://api.nusmods.com/v2/`;
  try {
    const acadYear:string = "2023-2024"
    const data = await timeoutPromise(1000, fetch(`${baseURL}/${acadYear}/moduleInfo.json`));
    const json = await data.json();
    if (data.status === 400) {
      throw new NetworkError('Internal server error');
    }

    // parse the json here
    // console.log(json[10000].title);

    return {
      lastUpdated: 2023,
      courses: toCoursesList(json),
    };
  } catch (error) {
    throw new NetworkError('Could not connect to server');
  }
};

export default getCoursesList;
