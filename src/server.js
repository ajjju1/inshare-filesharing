const express = require("express");
const app = express();
const path = require("path")

const connectDB = require("../config/db");
connectDB();

const port = process.env.PORT || 3000;
// console.log(path.join(__dirname, "../public"))
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path))
app.use(express.json());

//Template engine
// console.log(path.join(__dirname, "../views"))
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', "ejs");


//Routes
app.use('/api/files', require('../routes/files'))

app.use('/files', require('../routes/show'))

app.use('/files/download',require("../routes/download"))

app.listen(port, () =>{
    console.log(`Listening at port no :- ${port}`);
})