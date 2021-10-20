const express = require("express");
const bodyParser = require('body-Parser');
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = require("./app/models");

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
//   });

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});