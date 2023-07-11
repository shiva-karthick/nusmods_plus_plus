import { DbCourse, DbTimes } from "../interfaces/Database";
import NetworkError from "../interfaces/NetworkError";
import { CourseCode, CourseData } from "../interfaces/Periods";
import { dbCourseToCourseData } from "../utils/DbCourse";
import storage from "../utils/storage";
import timeoutPromise from "../utils/timeoutPromise";
import { API_URL } from "./config";

/**
 * Converts a string representation of what weeks a class runs to an array
 * e.g. "1-5,7-10" -> [1, 2, 3, 4, 5, 7, 8, 9, 10]
 *
 * @param dbClassWeeks The weeks a class is running
 * @param dbClassTimesList The output array
 *
 * @return The output array -> [1, 2, 3, 4, 5, 7, 8, 9, 10]
 *
 * @possible_error Given the above example "1-5,7-10", it does print out the correct output array,
 * but also repeats the output array a number of times.
 * Check out here : https://codesandbox.io/s/typescript-playground-export-forked-38s6wr?file=/index.ts
 */
const convertTimesToList = (
  dbClassWeeks: string,
  dbClassTimesList: number[]
) => {
  for (let k = 0; k < dbClassWeeks.length; k++) {
    let times = dbClassWeeks.split(",");
    times.map((time) => {
      if (time.includes("-")) {
        // Convert ranges into numbers
        let [min, max] = time.split("-"); // this is destructuring the data
        for (let j = parseInt(min); j < parseInt(max); j++) {
          dbClassTimesList.push(j);
        }
      } else {
        // If not a range, add number to array directly
        dbClassTimesList.push(parseInt(time));
      }
    });
  }
};

/**
 * @param dbClassTimesOne The first class
 * @param dbClassTimesTwo The second class
 * @returns If the two classes are equivalent
 *
 * @todo change == into === because == is not recommended, and === is more strict
 */
const classesAreEqual = (
  dbClassTimesOne: DbTimes,
  dbClassTimesTwo: DbTimes
): boolean => {
  return (
    dbClassTimesOne.day == dbClassTimesTwo.day &&
    dbClassTimesOne.location == dbClassTimesTwo.location &&
    dbClassTimesOne.time.start == dbClassTimesTwo.time.start &&
    dbClassTimesOne.time.end == dbClassTimesTwo.time.end
  );
};

/**
 * Sorts and removes duplicates from an array
 *
 * @param arr The array
 * @returns The sorted array without duplicates
 */
const sortUnique = (arr: number[]): number[] => {
  if (arr.length === 0) return arr;
  arr = arr.sort((a, b) => a - b);

  let ret = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] !== arr[i]) {
      ret.push(arr[i]);
    }
  }

  return ret;
};

const convertTime = (timeStr: string): string => {
  const hour = timeStr.slice(0, 2);
  const minute = timeStr.slice(2, 4);
  return `${hour}:${minute}`;
};

/**
 * Fetches the information of a specified course
 *
 * @param year The year that the course is offered in
 * @param term The term that the course is offered in
 * @param courseCode The code of the course to fetch
 * @param isConvertToLocalTimezone Whether the user wants to convert the course periods into their local timezone
 * @return A promise containing the information of the course that is offered in the
 * specified year and term
 *
 * @example
 * const selectedCourseClasses = await getCourseInfo('2019', 'T1', 'COMP1511')
 */
const getCourseInfo = async (
  year: string,
  term: string,
  courseCode: CourseCode, //string
  isConvertToLocalTimezone: boolean
): Promise<CourseData> => {
  // const baseURL = `${API_URL.timetable}/terms/${year}-${term}`; // will keep here for now
  const baseURL = `https://api.nusmods.com/v2/2023-2024/modules`; // I will hardcode the year and term for now
  try {
    const data = await timeoutPromise(
      1000,
      fetch(`${baseURL}/${courseCode}.json`)
    );

    // Remove any leftover courses from localStorage if they are not offered in the current term
    // which is why a 400 error is returned
    if (data.status === 400) {
      const selectedCourses = storage.get("selectedCourses");
      if (selectedCourses.includes(courseCode)) {
        delete selectedCourses[courseCode];
        storage.set("selectedCourses", selectedCourses);
      } else {
        throw new NetworkError("Internal server error");
      }
    }

    const json: any = await data.json();

    console.log(json); // Used to debug
    // console.log(json.semesterData[0].timetable); // Used to debug
    
    let _classes:any = [];
    
    json.semesterData[0].timetable.forEach((element: any) => {
      const _class:any = {
        activity: element.lessonType, // string
          times: [
            {
              time: {
                start: convertTime(element.startTime),
                end: convertTime(element.endTime),
              },
              day: element.day.slice(0, 3), // string
              location: element.venue, // string
              weeks: element.weeks.toString(), // "1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13"
            },
          ], // array of DbTimes
          status: "Open", // 'Open' | 'Full' | 'On Hold'
          courseEnrolment: {
            enrolments: 100, // fake value
            capacity: 500,
          }, // {enrolments, capacity}
          section: json.department, // string
      };
      _classes.push(_class);
    });
    
    console.log(_classes);

    // work on new code
    const parsed_json: DbCourse = {
      courseCode: json.moduleCode, // "EE2211"
      name: json.title, // "Introduction to Machine Learning"
      // classes: [
        // {
        //   activity: "Tutorial", // string
        //   times: [
        //     {
        //       time: {
        //         start: "12:00",
        //         end: "14:00",
        //       },
        //       day: "Tue",
        //       location: "Home",
        //       weeks: "1-5, 7-10",
        //     },
        //   ], // array of DbTimes
        //   status: "Open", // 'Open' | 'Full' | 'On Hold'
        //   courseEnrolment: {
        //     enrolments: 100,
        //     capacity: 500,
        //   }, // {enrolments, capacity}
        //   section: "Electrical Engineering", // string
        // },
        // {
        //   activity: "Lecture", // string
        //   times: [
        //     {
        //       time: {
        //         start: "12:00",
        //         end: "14:00",
        //       },
        //       day: "Wed",
        //       location: "E4-05",
        //       weeks: "1-5, 7-10",
        //     },
        //   ], // array of DbTimes
        //   status: "Open", // 'Open' | 'Full' | 'On Hold'
        //   courseEnrolment: {
        //     enrolments: 100,
        //     capacity: 500,
        //   }, // {enrolments, capacity}
        //   section: "Electrical Engineering", // string
        // }
      // ],
      classes: _classes,
    };

    // OLD CODE
    // json.classes.forEach((dbClass) => {
    //   // Some courses split up a single class into two separate classes. e.g. CHEM1011 does it (as of 22T3)
    //   // because one half of the course is taught by one lecturer and the other half is taught by another.
    //   // This causes two cards to be generated for the same class which is not ideal, thus the following code
    //   // consolidates the separate classes into one class.

    //   for (let i = 0; i < dbClass.times.length - 1; i += 1) {
    //     for (let j = i + 1; j < dbClass.times.length; j += 1) {
    //       let dbClassTimesOne = dbClass.times[i];
    //       let dbClassTimesTwo = dbClass.times[j];

    //       if (classesAreEqual(dbClassTimesOne, dbClassTimesTwo)) {
    //         let dbClassTimesList: number[] = [];

    //         convertTimesToList(dbClassTimesOne.weeks, dbClassTimesList);
    //         convertTimesToList(dbClassTimesTwo.weeks, dbClassTimesList);

    //         dbClassTimesList = sortUnique(dbClassTimesList);

    //         let newWeeks: string = '';
    //         let isEndOfRange = false;

    //         // Convert the numerical representation of the weeks the classes are running back to a string
    //         for (let k = 0; k < dbClassTimesList.length; k++) {
    //           if (k == 0 || k == dbClassTimesList.length - 1) {
    //             newWeeks += dbClassTimesList[k];
    //           } else if (isEndOfRange) {
    //             // Add the start of the range
    //             newWeeks += dbClassTimesList[k];
    //             isEndOfRange = false;
    //           }

    //           while (dbClassTimesList[k + 1] == dbClassTimesList[k] + 1) {
    //             // Keep iterating until you reach the end of the range (numbers stop being consecutive)
    //             k++;
    //           }

    //           if (!isEndOfRange) {
    //             // Add the end of the range (last consecutive number)
    //             newWeeks += '-' + dbClassTimesList[k];

    //             // If this isn't the last week, we will need to add more weeks
    //             if (k !== dbClassTimesList.length - 1) {
    //               newWeeks += ',';
    //             }

    //             // Get ready to add the end of the range
    //             isEndOfRange = true;
    //           }
    //         }

    //         dbClassTimesOne.weeks = newWeeks;
    //         dbClass.times.splice(dbClass.times.indexOf(dbClassTimesTwo), 1);
    //       }
    //     }
    //   }
    // });

    if (!json) throw new NetworkError("Internal server error");

    return dbCourseToCourseData(parsed_json, isConvertToLocalTimezone);
  } catch (error) {
    console.log(error);
    throw new NetworkError("Could not connect to server");
  }
};

export default getCourseInfo;
