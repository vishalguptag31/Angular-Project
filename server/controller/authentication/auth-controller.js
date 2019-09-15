var auth = require('../../model/authentication/auth-model');

exports.authenticate = function (req, res) {
    auth.userLogin(req)
        .then((data) => {
            res.send(data);
        }).catch(function (err) {           
            res.status(err.status).json({
                message: err.messages,
                status: err.status
            });
        })
}

exports.changePassword = function (req, res) {
    auth.changePassword(req)
        .then((data) => {
            res.send(data);
        }).catch(function (err) {    
            // console.log(err)       
            res.status(err.status).json({
                message: err.messages,
                status: err.status
            });
        })
}

exports.userSignUp = function (req, res) {
    auth.userSignUp(req)
        .then((data) => {
            res.send(data);
        }).catch(function (err) {    
            // console.log(err)       
            res.status(err.status).json({
                message: err.messages,
                status: err.status
            });
        })
}

exports.validateEmailLink = function (req, res) {
    auth.validateEmailLink(req)
        .then((data) => {
            res.send(data);
        }).catch(function (err) {    
            // console.log(err)       
            res.status(err.status).json({
                message: err.messages,
                status: err.status
            });
        })
}

exports.resendEmailVerification = function (req, res) {
    auth.resendEmailVerification(req)
        .then((data) => {
            res.send(data);
        }).catch(function (err) {    
            // console.log(err)       
            res.status(err.status).json({
                message: err.messages,
                status: err.status
            });
        })
}

