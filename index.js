// Import required modules
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

// Configure app to use bodyParser middleware for handling form data
app.use(bodyParser.urlencoded({extended: true}));

// Set EJS as the view engine for rendering pages
app.set("view engine", "ejs");

// Import the custom authentication module
const auth = require('./auth.js');

// Create user for login access
auth.createUser("user", "pass");


// Import and configure MySQL database connection
const mysql = require('mysql');
const { application } = require('express');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'webshop_db'
});

// Establish connection with the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
  } else {
    console.log('Connected to database!');
  }
}); 

// Serve static files from 'home' and 'images' directories
app.use(express.static(__dirname + "/home"));
app.use(express.static(__dirname + "/images"));

// Route to handle login form submission
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const authenticated = auth.authenticateUser(username, password);
  console.log(authenticated);

  // Check if authentication is successful
  if(authenticated) {
    console.log("Authentication was successful!");
    res.render("home");
  } else {
    console.log("Authentication was NOT successful!");
    res.render("failed");
  }
});

// Route for retrieving and displaying product data
app.get("/shop", function(req, res){
  const ID = req.query.rec;
  connection.query("SELECT * FROM webshop_db WHERE ProductID = ?", [ID], function(err, rows, fields) {
    if(err) {
      console.error("Error retrieving data from database:", err);
      res.status(500).send("Error retreiving data from database");
    } else if(rows.length === 0) {
      console.error("No rows found for ID $[ID]");
      res.status(404).send("No product found for ID $[ID]");
    } else {
      // Log retrieved data and render the product page with the data
      console.log("Data retrieved from the Database!");
      const prodName = rows[0].ProductName;
      const prodModel = rows[0].CountryOfOrigin;
      const pic = rows[0].Image;
      const price = rows[0].Price;
      res.render("test.ejs", {myMessage: prodName, model: prodModel, myImage: pic, myPrice: price});
    }    
  })
});

// Route for posting product data to the server
app.post("/shop", function(req, res){
    const ID = req.query.rec;
    connection.query("SELECT * FROM webshop_db WHERE ProductID = ?", [ID], function(err, rows, fields) {
      if(err) {
        console.error("Error retrieving data from database:", err);
        res.status(500).send("Error retreiving data from database");
      } else if(rows.length === 0) {
        console.error("No rows found for ID $[ID]");
        res.status(404).send("No product found for ID $[ID]");
      } else {
        // Log retrieved data and render the product page with the data
        console.log("Data retrieved from the Database!");
        const prodName = rows[0].ProductName;
        const prodModel = rows[0].CountryOfOrigin;
        const pic = rows[0].Image;
        const price = rows[0].Price;
        res.render("test.ejs", {myMessage: prodName, model: prodModel, myImage: pic, myPrice: price});
  }
  })
  });


app.get("/home", function(req, res){
  res.render("home");
});

app.get("/checkout", function(req, res){
    res.render("checkout.ejs");
  });

  app.post("/checkout", function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
});


  


// Start the server and listen on port 3000
app.listen(3000, () => {
console.log('Server started on port 3000');
});