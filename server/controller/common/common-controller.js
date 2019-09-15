var common = require('../../model/common/common-model');

exports.getcategory = function (req, res) {
    common.getcategory(req,res)
        .then((data) => {
            res.send(data);
        }).catch(function (err) {
            res.status(err.status).json({
                messages: err.messages,
                status: err.status
            });
        })
}
