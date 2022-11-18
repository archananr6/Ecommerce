require('dotenv').config()
const moduleName = require('./config/express')
const sql = require('./config/database')
let mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');


let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'ecom_db'
});
connection.connect((err) => {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});
const jwt = require("jsonwebtoken");
const secretKey = "archana"


moduleName.app.get("/post", moduleName.urlencodedParser, authenticateToken, (req, res) => {
  console.log(res)
  res.json("hello")
})


//Register
moduleName.app.post("/register", (req, res) => {
  console.log(req)
  connection.query(`INSERT INTO signup ( name, email, password) VALUES ("${req.body.name}", "${req.body.email}", "${bcrypt.hashSync(req.body.password, null, null)}")`,
    function (err, result) {
      if (err)
        console.log(`Error executing the query - ${err}`)
      else
        console.log("Result: ", result)
      res.json(result)
    })

})

//Login
moduleName.app.post("/login", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const query = `select * from signup where email = '${email}'`;
  connection.query(query, (err, result) => {

    let username = result[0].email
    let loginpassword = result[0].password
    if (username === email && bcrypt.compareSync(password, loginpassword)) {
      const acessToken = jwt.sign(username, secretKey) 
      res.send(JSON.stringify({ acessToken: acessToken }));
      
    }
    else {
      res.json("unauthorized")
    }
  })

})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403)
    console.log(user)
    req.user = user
    next()
  })
}

moduleName.app.listen(3000)
