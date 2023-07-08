export enum Env {
  DEV = 'development',
  TEST = 'test',
  MOCK = 'mock',
  PROD = 'production',
}

interface Config {
  timetable: string;
  auto: string;
}

const LOCAL = 'http://localhost:3001';
const LIVE = 'https://timetable.csesoc.app';


const API_CONFIG: Record<string, Config> = Object.freeze({
  [Env.DEV]: { timetable: `${LOCAL}/api`, auto: `${LOCAL}/auto` },
  [Env.TEST]: { timetable: `${LOCAL}/api`, auto: `${LOCAL}/auto` },
  [Env.MOCK]: { timetable: `${LIVE}/api`, auto: `${LOCAL}/auto` },
  [Env.PROD]: { timetable: `${LIVE}/api`, auto: `${LIVE}/auto` },
});

export const API_URL: Config = API_CONFIG[process.env.REACT_APP_ENVIRONMENT || Env.DEV]; 

/* The above code defines an environment configuration and API URLs.

* First, an enum `Env` is defined, which represents different environments: development, test, mock, and production. 
Each environment is assigned a corresponding string value.

* Next, an interface `Config` is defined, which specifies the structure of the configuration object. 
It contains two properties: `timetable` and `auto`, both of type string.

* Then, two constants `LOCAL` and `LIVE` are defined, representing the URLs for the local development server and the live production server, respectively.

* After that, a constant `API_CONFIG` is defined as a record (dictionary) mapping environment values to configuration objects. 
The keys of the record are the enum values from `Env`, and * the values are objects with `timetable` and `auto` properties. 
The URLs are constructed using the `LOCAL` and `LIVE` constants based on the environment.

* Finally, a constant `API_URL` is exported, which represents the API URLs based on the environment. It is set to the configuration object from `API_CONFIG` based on the value of * `process.env.REACT_APP_ENVIRONMENT` (an environment variable specific to React) or the default value of `Env.DEV`. This means that the API URLs will be determined based on the * environment in which the application is running.

* In summary, this code provides a way to configure different API URLs for different environments in a University Timetable application using React and Flask. It allows the application to connect to the appropriate backend server based on the current environment.
*/