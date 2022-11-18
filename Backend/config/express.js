const express= require("express");
const app= express();
app.use(express.json())
const bodyParser = require("body-parser"); 
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

module.exports={
    app,urlencodedParser
}