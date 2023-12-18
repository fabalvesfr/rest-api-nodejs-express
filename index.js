// For learning purposes, logic here was implemented using a userList variable which mocks the database, as well as a locally hosted MySQL database (MySQL Workbench)
const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json()); // Parses every JSON that comes in to our application

const db = mysql.createConnection({
  user: "root", // Set to "root" by default if we're using localhost
  host: "localhost",
  password: "", // Empty string by default
  database: UserDB, //Name of the database created in MySQL Workbench
});

const userList = [
  {
    id: 1,
    name: "Fabio",
    age: 32,
    isMarried: false,
  },
  {
    id: 2,
    name: "Isa",
    age: 32,
    isMarried: true,
  },
  {
    id: 3,
    name: "Beth",
    age: 39,
    isMarried: false,
  },
];

// CREATING OUR FIRST ENDPOINT (GET)
// Returning the list of users when we reach the /users endpoint
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users;", (err, result) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(result);
    }
  });
});

app.post("/users", (req, res) => {
  // Grabbing the data sent by client (for example, when he submits it through a form)
  // Adding data
  // Return new list
  const { name, age } = req.body;
  db.query(
    "INSERT INTO users (name, age) VALUES (?,?);",
    [name, age],
    (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

// Assuming the the user id to be deleted will be passed through browser url
app.delete("/users/:id", (req, res) => {
  // Get the id
  const id = +req.params.id; //Added + sign as a prefix to coerce the string passed as an argument into a number
  // Catching an error: if the id provided does not correspond to any user id in our "database"
  let foundId = false;
  // Delete the user with id
  for (i = 0; i < userList.length; i++) {
    if (userList[i].id === id) {
      userList.splice(i, 1);
      foundId = true;
    }
  }
  if (!foundId) {
    res.status(404).json({ error: "User not found" }); // If the user id provided does not correspond, return a 404 (Not Found) Error with an object "{ error: "User not found" }"
  } else {
    // Return the list
    res.status(200).json(userList);
  }
});

// Returning a "Hello, World" message whenever someone calls this API
// Anytime someone makes an API GET request to localhost:3001/getMessage it will get "Hello, World" back
app.get("/getMessage", (req, res) => {
  // req=request (requesting data from our client); res=response (used to send data back from our server-side to the client) [built-in express parameters]
  res.send("Hello, World"); // Inside send() we can pass in any JS variable type
}); // Creating a GET endpoint towards '/getMessage' route

// Calling our server. We put on localhost:3001 because usually React is on port 3000
app.listen("3001", () => {
  console.log("Server running on port 3001");
});
