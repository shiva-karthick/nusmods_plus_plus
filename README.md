# nusmods++
- a react and flask app

## Purpose

Creating a timtable for every semester for every round is very mentally draining and a challenging task. It involves parsing multiple PDFs for every round, comparing trends, and examining the classes available. This project aims to streamline this process by creating a more user frindly UI with drag and drop, saving past timetables for

![Postman testing](images/image.png)

![User Interface](images/image-1.png)

## Running in local machine
### Server

The server allows the client to communicate with the autotimetabling server.

### API endpoints

#### `POST /auto`

Returns a list of ints that correspond to class times for the inputted data.

#### Installation

The server has been verified to work with:

- npm v8.3.1
- node v16.14.0

In the root server directory `server`, run `npm install` or just `npm ci` to install all the dependencies.

#### Running

Pre-requisite: Run `source ./venv/bin/activate` to activate the python environment.

Run `npm start` to start the server locally. The server will be hosted at http://localhost:3001.

Run `python server.py` to start the Autotimetabling server.

## Tech Stack

The server uses:

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/)
- []()


