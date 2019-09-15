let user = require('../../model/user/user-activity');

exports.getUserDetail = function (req, res) {
    user.getUserDetail(req, res)
        .then((data) => {
            res.status(200).send(data);
        }).catch(function (err) {
            res.status(err.status).json({
                messages: err.messages,
                status: err.status
            });
        })
}

exports.addTask = function (req, res) {
    user.newTask(req)
        .then((data) => {
            res.status(200).send({ success: true, message: 'Successfully created a new task.' })
        }).catch(function (err) {
            res.status(500).send('Internal Server Error')
        })
}

exports.getAllTasks = function (req, res) {
    user.getAllTasks(req)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        })
}

exports.getTaskById = function (req, res) {
    user.getTaskById(req)
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        })
}

exports.updateTask = function (req, res) {
    user.updateTask(req)
        .then(resp => {
            res.status(200).send({ success: true, message: 'Task updated successfully.' })
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        })
}

exports.deleteTask = function (req, res) {
    user.deleteTask(req)
        .then(resp => {
            res.status(200).send({ success: true, message: 'Task deleted successfully.' })
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        })
}
// exports.getTaskByUserId = function (req, res) {
//     user.getTaskByUserId(req)
//         .then(result => {
//             res.status(200).send(result)
//         })
//         .catch(err => {
//             res.status(500).send('Internal Server Error');
//         })
// }

exports.updateStatus = function (req, res) {
    user.updateStatus(req)
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            console.log(err);
            
            res.status(500).send('Internal Server Error');
        })
}

exports.sendStatus = function (req, res) {
    user.sendEmail(req)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        })
}

exports.searchTasks = function (req, res) {
    user.searchTasks(req, res)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}

exports.addUserAssignee = function (req, res) {
    user.addUser(req, res)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}

exports.checkUniqueEmail = function (req, res) {
    user.checkUniqueEmail(req, res)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}

exports.checkUniquePhoneNumber = function (req, res) {
    console.log(req.params)
    user.checkUniquePhoneNumber(req, res)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}

exports.saveCategoryData = function (req, res) {
    user.saveCategory(req, res)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}

exports.deleteCategoryById = function (req, res) {
    user.deleteCategoryById(req, res)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}

exports.upadateCategory = function (req, res) {
    user.upadateCategory(req, res)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}

exports.checkCategoryTaskExist = function (req, res) {
    user.checkCategoryTaskExist(req)
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        })
}

exports.addUserRelation = function (req, res) {
    user.addRelation(req.body)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}

exports.updatePollStatus = function (req, res) {
    user.updatePollStatus(req)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(error => {
            res.status(500).send('Internal Server Error')
        })
}