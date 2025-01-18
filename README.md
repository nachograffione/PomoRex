# PomoRex
A webpage for registering and viewing pomodoros

## Setup for testing
1. Clone the repository
2. Run `npm install`
3. Install pgadmin 4 last version from official website
4. Open pgadmin 4, connect to the last version server, create a pomo_rex database
5. Run SQLCode/ scripts for cleaning, creating and inserting testing data (from pgadmin, select the created database and open the query tool)
6. Ensure pomoRepository connection string is correct
6. Press F5 in VSCode focus on app.js
7. Go to http://localhost:3000/control

## TODO
- Now it is broken because the views were not updated after api changes (temp and test don't have anything important)