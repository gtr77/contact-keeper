const express = require("express");
const connectDB = require("./config/db");


const app = express();

// CONNECT DATABSE
connectDB();

// INIT MIDDLEWARE
app.use(express.json({ extended: false }))

app.get("/", (req, res) => {
  res.json({ description: "Welcome GET"})
})

// Define Routes
app.use('/api/users', require('./routes/users.js'))
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/contacts', require('./routes/contacts.js'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at Port ${PORT}`));

