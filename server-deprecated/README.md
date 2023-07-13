Thought process
- What functions to write and send to React frontend?


## Running the backend
Go to the directory above of the server directory and perform the following commands.
```bash
# Works only in linux and macos terminals
export FLASK_APP=server
export FLASK_DEBUG=1
flask run
```

## Running the frontend (React)
Navigate into nusmods++/client, then run one of the follow commands:

- npm start (if you already have the server running locally; connects to that)
 
- npm run start:mock (if you don’t have the server running locally; connects to the real server)

You can then access the client at localhost:3000 in your favourite web browser.

