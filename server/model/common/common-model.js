var db = require('../../config/dbConfig');
var Custom = require('../../utils/custom_error');
var Messages = require('../../utils/message').Messages;
var errorStatus = require('../../utils/error_status');

exports.getcategory = function (req) {
    return new Promise((resolve, reject) => {      
        if(!!req.params.added_by)
        {
        db.connection.query(`SELECT * from category where added_by='${req.params.added_by}'`,
            function (err, result) {
                if (result) {
                    let obj={
                        data:result,
                        success:true
                    }
                    resolve(obj)
                }
                else {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                }

            })
        }
        else
        {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}
