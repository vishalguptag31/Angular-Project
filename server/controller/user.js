var db = require('../config/dbConfig')
var databaseName = "TFS_Tracker";
var useDatabaseQuery = "USE `" + databaseName + "`";

exports.authenticate = function (req, res) {
    if (!!req.body.userName && !!req.body.password) {
        console.log('hii')
        db.connection.query("SELECT * from user WHERE user.email='" + req.body.userName + "' && user.password ='" + req.body.password + "'",
            function (err, rows) {                
               if(rows.length >0)
               {
                res.json(rows);
               }
               else
               {
        console.log("not matched")
               }
            }
        )

    }
    else {

    }
}
