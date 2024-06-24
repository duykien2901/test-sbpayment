const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint
app.post("/api/data", (req, res) => {
  const data = req.body;
  console.log("req:", req);

  // You can add your processing logic here

  res.status(200).send("OK");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
