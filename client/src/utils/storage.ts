import defaults from "../constants/defaults";

const STORAGE_KEY = "data";

// Explain the below code
// 1. localStorage is a global object that is used to store data in the browser
// 2. localStorage is a key-value store (NOSQL database)
// 3. localStorage can only store strings
// 4. localStorage is synchronous
// 5. localStorage is persistent
// 6. localStorage is scoped to the domain
// 7. localStorage is not secure
// 8. localStorage is not meant to be used for storing sensitive data
// 9. localStorage is not meant to be used for storing large amounts of data
// 10. localStorage is not meant to be used for storing data that needs to be encrypted
// 11. localStorage is not meant to be used for storing data that needs to be accessed on the server
// 12. localStorage is not meant to be used for storing data that needs to be accessed on multiple devices, users, tabs, windows, browsers, domains, etc.
// 13. localStorage performs all CRUD operations, but it is not meant to be used for storing data that needs to be accessed on the server, better than cookies.

const storage = {
  get: (key: string): any => {
    const data: Record<string, any> = storage.load(); // Load the data from localStorage

    if (key in data) {
      return data[key]; // If the key exists, return the value
    }
    if (key in defaults) {
      storage.set(key, defaults[key]); // If the key does not exist, set the default value
      return defaults[key]; // If the key does not exist, return the default value
    }

    return null; // If the key does not exist, return null
  },

  set: (key: string, value: any) => {
    const data: Record<string, any> = storage.load(); // Load the data from localStorage
    data[key] = value; // Set the key-value pair
    storage.save(data); // Save the data to localStorage
  },

  load: (): Record<string, any> => {
    let data: Record<string, any> = {}; // Initialize the data

    if (localStorage[STORAGE_KEY]) {
      data = JSON.parse(localStorage[STORAGE_KEY]); // Parse the data from localStorage
    } else {
      storage.save(data); // Save the data to localStorage
    }

    return data; // Return the data
  },

  save: (data: Record<string, any>) => {
    localStorage[STORAGE_KEY] = JSON.stringify(data); // Stringify the data and save it to localStorage
  },
};

storage.load();

export default storage;
