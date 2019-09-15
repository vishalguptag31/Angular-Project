var db = require('../../config/dbConfig');
var Custom = require('../../utils/custom_error');
var Messages = require('../../utils/message').Messages;
var errorStatus = require('../../utils/error_status');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../../config/jwt');
const saltRounds = 10;
const random = require('rand-token');
let mail_config = require('../../config/mailConfig')
let mailTemplate = require('../../mail_template/status_template')

exports.userLogin = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.body.email && !!req.body.password) {
            let loginQuery = `SELECT * from user WHERE user.email='${req.body.email}'`;
            db.connection.query(loginQuery,
                function (err, result) {
                    if (!err) {
                        console.log(result)
                        if (result.length > 0) {
                            if(result[0].is_active == '1')
                            {
                            let isValid = bcrypt.compareSync(req.body.password, result[0].password);
                            if (!!isValid) {
                                let payload = { email: result[0].email };
                                let jwt_token = jwt.sign(payload, config.secret, { expiresIn: 60000 });
                                resolve({
                                    success: true,
                                    data: result[0],
                                    jwt_token: jwt_token,
                                    message: "Logged in successfully"
                                });
                            }
                            else {
                                reject(new Custom(Messages.INVALID_PASSWORD, errorStatus.ErrorCode.unauthorised));
                            }
                        }
                        else
                        {
                            reject(new Custom(Messages.EMAIL_NOT_VERIFIED, errorStatus.ErrorCode.unauthorised));  
                        }
                        } else {

                            reject(new Custom(Messages.ACCOUNT_NOT_EXIST, errorStatus.ErrorCode.unauthorised));
                        }
                    }
                    else {

                        reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.badRequest));
                    }
                })

        }

    })
}

exports.changePassword = function (req) {
    return new Promise((resolve, reject) => {
        console.log(req.body)
        if (!!req.body.email) {
            db.connection.query(`SELECT * from user WHERE user.email='${req.body.email}'`,
                function (err, result) {
                    if (!!result && result.length > 0) {
                        let isValid = bcrypt.compareSync(req.body.current_password, result[0].password);

                        if (!!isValid) {
                            bcrypt.hash(req.body.new_password, 10, function (err, hash) {
                                db.connection.query(`UPDATE user SET password='${hash}' WHERE email='${req.body.email}'`,
                                    function (err, result) {
                                        if (!!result) {
                                            resolve({
                                                message: 'Password changed successfully'
                                            });

                                        } else {
                                            reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));

                                        }
                                    });
                            });
                        } else {
                            reject(new Custom(Messages.INCORRECT_CURRENT_PASSWORD, errorStatus.ErrorCode.internalServerError));

                        }
                    }

                });
        }
        else {
            reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));
        }
    });
}

exports.userSignUp = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.body) {
            db.connection.query(`SELECT * from user WHERE user.email='${req.body.email}'`,
                function (err, result) {
                    if (!!result && result.length > 0) {
                        resolve({
                            dataExist: true,
                            data: req.body.email

                        });
                    }
                    else {
                        // let accessToken = random.generate(10);
                        var date = new Date();
                        date = date.setDate(date.getDate() + 1);
                        console.log(date);
                        let userDetails = req.body;
                        let access_token = random.generate(10)
                        const link = userDetails.host + '/#/verification/' + access_token;
                        bcrypt.hash(userDetails.password, 10, function (err, hash) {
                            let insertQuery = `INSERT INTO user(full_name,email,contact_number,password,is_active,expiration_time,access_token) 
                               values ('${userDetails.full_name}','${userDetails.email}','${userDetails.phone_number}','${hash}','0','${date}','${access_token}')`
                            db.connection.query(insertQuery, function (err, result) {
                                console.log(insertQuery)
                                if (!!result) {
                                    let obj = {
                                        name: req.body.full_name,
                                        email: req.body.email,
                                    }
                                    sendEmailToNewCreatedUser(obj, link, resolve, reject);

                                }
                                else {
                                    reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));
                                }
                            })
                        })
                    }
                })
        }
        else {
            reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));
        }
    });

}

function sendEmailToNewCreatedUser(req, verificationLink, resolve, reject) {
    let mailOptions = {
        to: req.email,
        from: mail_config.sender,
        subject: "Welcome Mail",
        html: mailTemplate.welcomeMailToUser({
            message: verificationLink,
            name: req.name
        }),
    }
    mail_config.transporter.sendMail(mailOptions, (error, info) => {
        if (error) { }
        else {
            resolve({
                dataExist: false,
                data: req.email
            });
        }
    })

}

exports.validateEmailLink = function (req, res) {
    return new Promise((resolve, reject) => {
        if (!!req.body.accessToken) {
            var currentDate = new Date();
            currentDate = currentDate.setDate(currentDate.getDate());
            let querys = `Select * from user WHERE access_token='${req.body.accessToken}'`
            db.connection.query(querys, function (err, result) {
                if (err) {
                    reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));
                } else {
                    if (result.length > 0) {
                        if (result[0].is_active == 0) {
                            if (currentDate <= result[0].expiration_time) {
                                let querys = `UPDATE user SET 
                            is_active='1' WHERE id =${result[0].id}`
                                db.connection.query(querys, function (err, result) {
                                    if (err) {
                                        reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));

                                    } else {
                                        let responseObj = {
                                            success: true,
                                            message: "Email verified successfully",
                                            data: result
                                        }
                                        resolve(responseObj);
                                    }
                                }
                                );
                            }
                            else {
                                let responseObj = {
                                    success: false,
                                    message: "Verification link has been expired",
                                }
                                resolve(responseObj);
                            }
                        }
                        else {
                            let responseObj = {
                                success: true,
                                message: "Email is already verified"
                            }
                            resolve(responseObj);
                        }
                    }
                    else {
                        resolve({
                            dataExist: true,
                            message: "Verification link has been expired",
                        });
                    }
                }
            })
        }
        else {
            reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));
        }
    })
};

exports.resendEmailVerification = function (req) {
    return new Promise((resolve, reject) => {
        console.log(req.body)
        if (!!req.body) {
            db.connection.query(`SELECT * from user WHERE user.email='${req.body.email}'`,
                function (err, result) {
                    if (err) {
                        reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));
                    }
                    else {
                        if (!!result && result.length > 0) {
                            let name = result[0].full_name;
                            var date = new Date();
                            date = date.setDate(date.getDate() + 1);
                            let userDetails = {
                                name: name,
                                email: req.body.email
                            }

                            let access_token = random.generate(10)
                            const link = req.body.host + '/#/verification/' + access_token;
                            let querys = `UPDATE user SET 
                        access_token='${access_token}', expiration_time='${date}' WHERE id =${result[0].id}`
                            db.connection.query(querys, function (err, result) {

                                if (!!result) {
                                    sendEmailToNewCreatedUser(userDetails, link, resolve, reject);
                                }
                                else {
                                    reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));
                                }

                            })
                        }
                        else {
                            resolve({
                                dataExist: true,
                                message: Messages.ACCOUNT_NOT_EXIST
                            });
                        }
                    }
                })
        }


        else {
            reject(new Custom(errorStatus.ErrorMessages.internalServer, errorStatus.ErrorCode.internalServerError));
        }
    });

}

