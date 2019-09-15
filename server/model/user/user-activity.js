let db = require('../../config/dbConfig').connection
var Custom = require('../../utils/custom_error')
var Messages = require('../../utils/message').Messages
var errorStatus = require('../../utils/error_status')
let mail_config = require('../../config/mailConfig')
let mailTemplate = require('../../mail_template/status_template')
var bcrypt = require('bcrypt')

/* Get user for creating task  */
exports.getUserDetail = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.params.id) {
            var q1 = `select * from user where user.added_by='${req.params.id}' and user.id!=${req.params.id}`;
            var q2 = `select * from user_relation left join user on user_relation.existing_user_id=user.id where user_relation.current_user_id=${req.params.id} ORDER BY user.id DESC;`;
            db.query(q1, function (err, result) {
                if (err) reject(err)
                db.query(q2, function (error, resp) {
                    if (error) reject(error)
                    var finalResult = resp.concat(result)
                    resolve(finalResult);
                })
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

/*  Add new Tak to user */

exports.newTask = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.body.completion_date) {
            let task = req.body
            let completion_date = convertDate(task.completion_date);
            let current_date = convertDate(new Date());
            let insertQuery = `INSERT INTO task(category_id, user_id, task_name, description, priority,status,assigned_by, completion_date, updated_date, planned_effort,type) VALUES('${task.category_id}','${task.user_id}','${db.escape(task.task_name)}','${db.escape(task.description)}','${task.priority}','${task.status}','${task.assigned_by}','${completion_date}','${current_date}','${task.planned_effort}','${task.type}');`
            db.query(insertQuery, function (err, result) {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                } else {
                    sendEmailToCreateNewTask(req, resolve, reject)
                    // let obj = { data: result, message: "Task added successfully", success: true }
                    // resolve(obj)
                }
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

/* Get all task by user id */
exports.getAllTasks = function (req) {
    return new Promise((resolve, reject) => {
        console.log(req.params.id)
        if (!!req.params.id) {
            let getQuery = `SELECT task.id,task.task_name, task.description,task.priority,task.is_delayed, task.created_date, 
         task.completion_date,task.completed_on,task.status, user.full_name, category.category_name FROM task LEFT JOIN user ON 
         task.user_id = user.id LEFT JOIN category ON task.category_id = category.id WHERE task.assigned_by='${req.params.id}' ORDER BY task.id DESC;`
            db.query(getQuery, function (err, manageTask) {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                } else {
                    let myTaskQuery = `SELECT task.id,task.task_name, task.description,task.priority,task.is_delayed, task.created_date, 
        task.completion_date,task.completed_on,task.status,task.type, user.full_name,user.email,category.category_name,task_polling.answer FROM task LEFT JOIN user ON 
        task.assigned_by = user.id LEFT JOIN category ON task.category_id = category.id
        LEFT JOIN task_polling ON task.id = task_polling.task_id   WHERE task.user_id='${req.params.id}' OR (task.user_id= '0' AND task.assigned_by <> '${req.params.id}') ORDER BY task.id DESC;`
                    db.query(myTaskQuery, function (err, myTask) {
                        console.log(myTaskQuery)
                        if (err) {
                            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                        }
                        else {

                            let obj = { manageTask: manageTask, myTask: myTask, success: true }
                            resolve(obj)
                        }
                    })
                }
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

/* Get task for edit */
exports.getTaskById = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.params.id) {
            db.query(`SELECT * FROM task WHERE id='${req.params.id}';`, function (err, result) {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                } else {
                    let obj = { data: result, success: true }
                    resolve(obj)
                }
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

/* Update task */
exports.updateTask = function (req) {
    return new Promise((resolve, reject) => {
        console.log(req.body)
        if (!!req.body.completion_date) {
            let task = req.body;
            let completion_date = convertDate(task.completion_date);
            let updateQuery = `UPDATE task SET 
            category_id='${task.category_id}',
            user_id='${task.user_id}',
            task_name='${db.escape(task.task_name)}',
            assigned_by='${task.assigned_by}',
            description='${db.escape(task.description)}', 
            priority='${task.priority}',             
            completion_date='${completion_date}',
            type ='${task.type}'
            WHERE id= '${task.id}';`
            db.query(updateQuery,
                function (err, result) {
                    if (err) {
                        reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                    } else {
                        let obj = { data: result, success: true }
                        resolve(obj)
                    }
                })

        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

exports.deleteTask = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.params.id) {
            db.query(`DELETE FROM task WHERE id='${req.params.id}';`, function (err, result) {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                } else {
                    let obj = { data: result, success: true, message: "Task deleted" }
                    resolve(obj)
                }
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

// exports.getTaskByUserId = function (req) {
//     return new Promise((resolve, reject) => {
//         if (!!req.params.id) {
//             db.query(`SELECT task.id,task.task_name,task.user_id, task.description,task.priority,task.created_date, task.completion_date,task.completed_on,task.status,task.assigned_by,task.is_delayed, user.full_name FROM task LEFT JOIN user ON task.user_id = user.id WHERE user.id='${req.params.id}' ORDER BY task.id DESC;`
//                 , function (err, result) {
//                     if (err) {
//                         reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
//                     } else {
//                         let obj = { data: result, success: true }
//                         resolve(obj)
//                     }
//                 })
//         }
//         else {
//             reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
//         }
//     })
// }

exports.updateStatus = function (req) {
    return new Promise((resolve, reject) => {
        if (req.body) {
            let task = req.body;
            db.query(`UPDATE task SET status='${task.status}', completed_on='${convertDate(task.completed_on)}', is_delayed=${task.is_delayed}, remark='${task.remark}' WHERE id=${task.id};`,
                function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        sendEmailToManagment(task, resolve, reject)
                    }
                })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}


function convertDate(date) {
    let month = new Date(date).getMonth() + 1;
    let dates = new Date(date).getDate();
    let year = new Date(date).getFullYear();
    let newDate = year + '-' + month + '-' + dates;
    return newDate;
}


function sendEmailToManagment(task, resolve, reject) {
    var query = task;
    let subject = query.task_name + " -Status "
    db.query('SELECT email,full_name FROM user WHERE id=' + query.user_id + ';',
        function (err, result) {
            if (err) {
                return reject(err)
            }
            else {
                let message = result[0].full_name + "'s task status is marked as " + `<strong>${query.status.toUpperCase()}</strong>`;
                let mailOptions = {
                    from: result[0].email,
                    to: query.assigned_email,
                    subject: subject,
                    html: mailTemplate.getHtml({
                        message: message,
                        name: query.full_name
                    }),
                }
                //mail 
                mail_config.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        //  reject(error)
                    } else {
                        let obj = {
                            message: "Status updated successfully!!"
                        }
                        resolve(obj)
                    }
                });
            }

        })
}

/**
 * Send credentials of newly registered user.
 */
function sendEmailToNewCreatedUser(req, resolve, reject) {
    let userDetails = req.body;
    let selectQuery = `SELECT email, full_name FROM user WHERE user.id='${userDetails.added_by}'`;
    db.query(selectQuery, function (err, result) {
        if (!!result) {
            let msg1 = `
        <div>
            <p>You have been successfully registered with
                <a href="http://simpliahead.com" style="text-decoration:none;color: lavenderblush;">Simpliahead.</a>
            </p>
            <p>Your credentials are given below : </p>
            <ul>
                <li>Email address :
                    <strong>${userDetails.email}</strong>
                </li>
                <li>Password :
                    <strong>${userDetails.password}</strong>
                </li>
            </ul>
            <p>Click the button below to login.</p>
            <a href="http://simpliahead.com" styles="text-decoration: none;" target="_blank">
                <button styles="background-color: #3c8dbc;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;">
                    LOGIN
                </button>
            </a>
        </div>
            `
            let mailOptions = {
                to: userDetails.email,
                from: result.email,
                subject: "Welcome Mail",
                html: mailTemplate.getHtml({
                    message: msg1,
                    name: userDetails.full_name
                }),
            }
            mail_config.transporter.sendMail(mailOptions, (error, info) => {
                if (error) { }
                else {
                    let obj = {
                        message: "Add user successfully!!"
                    }
                    resolve(obj)
                }
            })
        }
        else {

        }
    })
}

/* create new task email to user */
function sendEmailToCreateNewTask(req, resolve, reject) {
    let userDetails = req.body;
    let selectUserData = `SELECT email, full_name FROM user WHERE user.id='${userDetails.user_id}'`;
    let selectSenderData = `SELECT email,full_name from user WHERE user.id='${userDetails.assigned_by}'`
    db.query(selectSenderData, function (err, SenderData) {
        if (!!SenderData) {
            db.query(selectUserData, function (err, UserData) {
                if (!!UserData) {
                    let message = `
                    <div>
                        <p>You have been assigned a new task by <strong>${SenderData[0].full_name}</strong> </p>
                        <p>Task name : <strong>${req.body.task_name}</strong></p>
                        <p>Click the button below to check your task.</p>
                        <a href="http://simpliahead.com/task" styles="text-decoration: none;" target="_blank">
                        <button styles="background-color: #3c8dbc;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;">
                            CHECK
                        </button>
                        </a>
                    </div>
                    `;

                    let mailOptions = {
                        to: UserData[0].email,
                        from: SenderData[0].email,
                        subject: "New Task",
                        html: mailTemplate.getHtml({
                            subject: "New Task",
                            message: message,
                            name: UserData[0].full_name
                        }),
                    }
                    console.log(mailOptions);


                    mail_config.transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {

                        } else {
                            let obj = { message: "Task added successfully", success: true }
                            resolve(obj)
                        }
                    })
                }
            })
        }
    })
}

// exports.sendEmail = function (req) {
//     return new Promise((resolve, reject) => {
//         let query = req.body;
//         db.query('SELECT email,full_name FROM user WHERE userId=' + query.assignedBy + ';',
//             function (err, result) {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     let mailOptions = {
//                         from: query.assigneeEmail,
//                         to: result[0].email,
//                         subject: query.subject,
//                         html: mailTemplate.getHtml({
//                             subject: query.subject,
//                             message: query.message,
//                             name: result[0].full_name
//                         }),
//                         attachments: mailTemplate.mailData.attachments
//                     }
//                     // send mail with defined transport object
//                     mail_config.transporter.sendMail(mailOptions, (error, info) => {
//                         if (error) {
//                             console.log("errrrrrr", error)
//                             reject(error);
//                         } else {
//                             console.log("info", info)
//                             resolve(info)
//                         }
//                     });
//                 }
//             })
//     })
// }

// exports.searchTasks = function (req, res) {
//     return new Promise((resolve, reject) => {
//         let searchData = "%" + req.body.user + "%";
//         let assignee = req.body.id ? 'AND task.userId=' + req.body.id + ' ORDER BY task.taskId DESC;' : 'ORDER BY task.taskId DESC;'
//         db.query("SELECT * FROM task  LEFT JOIN user ON task.userId=user.userId WHERE taskName LIKE '" + searchData + "'" + assignee,
//             function (err, result) {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve(result)
//                 }
//             })
//     })
// }

/*  check unique email*/

exports.checkUniqueEmail = (req) => {
    return new Promise((resolve, reject) => {
        if (!!req.params.email) {
            var getUserQuery = `SELECT user.id, user.full_name, user.added_by, user.email from user where email='${req.params.email}'`
            db.query(getUserQuery, (err, result) => {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                }
                else {
                    resolve(result)
                }
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

/* check unique phone number*/

exports.checkUniquePhoneNumber = (req) => {
    return new Promise((resolve, reject) => {
        if (!!req.params.phone_number) {
            var getUserQuery = `SELECT user.contact_number from user where contact_number='${req.params.phone_number}'`
            db.query(getUserQuery, (err, result) => {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                }
                else {
                    if (result.length > 0) {
                        let obj = {
                            phoneNumberExist: true,
                        }
                        resolve(obj)
                    }
                    else {
                        let obj = {
                            phoneNumberExist: false,
                        }
                        resolve(obj)
                    }
                }
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

/*Add new User */

exports.addUser = (req) => {
    return new Promise((resolve, reject) => {
        if (!!req.body.email && !!req.body.phone_number) {
            let userDetails = req.body;
            bcrypt.hash(userDetails.password, 10, function (err, hash) {
                let insertQuery = `INSERT INTO user(full_name,email,contact_number,password,is_active,added_by) 
                values ('${userDetails.full_name}','${userDetails.email}','${userDetails.phone_number}','${hash}','1','${userDetails.added_by}')`
                db.query(insertQuery, function (err, result1) {
                    if (err) {
                        reject(new Custom(Messages.USER_INFO_NOT_SAVE, errorStatus.ErrorCode.internalServerError));
                    } else {
                        // let obj = {
                        //     message: "Add user successfully!!"
                        // }
                        sendEmailToNewCreatedUser(req, resolve, reject);
                        // resolve(obj)
                    }
                })
            });
        }
    })


}

/* Save category */
exports.saveCategory = function (req, res) {
    return new Promise((resolve, reject) => {
        if (!!req.body.category_name) {
            // var getUserQuery = `SELECT category_name from category where category_name='${req.body.category_name}'`
            // db.query(getUserQuery, function (err, result) {
            //     if (err) {
            //         reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
            //     } else {
            //         if (result.length > 0) {
            //             var obj = {
            //                 alreadyExist: true,
            //                 message: "Category already exist!"
            //             }
            //             resolve(obj);
            //         }
            //         else {
            var insertQuery = `INSERT INTO category(category_name,is_active,added_by) values ('${req.body.category_name}','1','${req.body.added_by}')`
            db.query(insertQuery, function (err, result) {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                } else {
                    let obj = {
                        alreadyExist: false,
                        message: "Category added successfully",
                        success: true
                    }
                    resolve(obj)
                }
            })
        }

        //         }
        //     })
        // }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }

    })
}

/* Delete Category */
exports.deleteCategoryById = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.params.id) {
            db.query(`DELETE FROM category WHERE id='${req.params.id}';`, function (err, result) {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                } else {
                    let obj = { data: result, success: true, message: "Category deleted" }
                    resolve(obj)
                }
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

exports.upadateCategory = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.body.id) {
            // var getUserQuery = `SELECT category_name from category where category_name='${req.body.category_name}'`
            // db.query(getUserQuery, function (err, result) {
            //     if (err) {
            //         reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
            //     } else {
            //         if (result.length > 0) {
            //             var obj = {
            //                 alreadyExist: true,
            //                 message: "Category already exist!"
            //             }
            //             resolve(obj);
            //         }
            //         else {
            let updateQuery = `UPDATE category SET 
            category_name='${req.body.category_name}'
            WHERE id= '${req.body.id}';`
            db.query(updateQuery, function (err, result) {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                } else {
                    let obj = { data: result, success: true, message: "Category Updated" }
                    resolve(obj)
                }
            })
        }
        //         }
        //     })
        // }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}

exports.checkCategoryTaskExist = function (req) {
    return new Promise((resolve, reject) => {
        if (!!req.params.id) {
            let getQuery = `SELECT * FROM task WHERE category_id='${req.params.id}'`
            db.query(getQuery, function (err, result) {
                if (err) {
                    reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                } else {
                    if (result.length > 0) {
                        let obj = { categoryExist: true }
                        resolve(obj)
                    }
                    else {
                        let obj = { categoryExist: false }
                        resolve(obj)
                    }

                }
            })
        }
        else {
            reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
        }
    })
}


exports.addRelation = function (data) {
    return new Promise((resolve, reject) => {
        let selectQuery = `SELECT * FROM user_relation WHERE existing_user_id='${data.existing}'`;
        db.query(selectQuery, function (err, result) {
            if (result.length > 0) {
                let obj = {
                    dataAlreadyExist: true,

                }
                resolve(obj)
            }
            else {
                db.query(`INSERT INTO user_relation(current_user_id, existing_user_id) VALUES(${data.current},${data.existing})`, function (err, result) {
                    if (err) {
                        reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError));
                    } else {
                        let obj = {
                            dataAlreadyExist: false,
                            sucess: true
                        }
                        resolve(obj)
                    }
                })
            }

        })


    })
}


exports.updatePollStatus = function (req) {
    return new Promise((resolve, reject) => {
        console.log(req.body)
        if(!!req.body)
        {
        let InsertQuery = `INSERT INTO task_polling(task_id, user_id, answer,remark) VALUES('${req.body.id}','${req.body.user_id}','${req.body.answer}','${db.escape(req.body.remark)}');`
            db.query(InsertQuery, function (err, result) {
            if (!!result) {
                let obj = {
                    success: true,
                    message: " Poll status updated"

                }
                resolve(obj)
            }
            else {
                reject(new Custom(Messages.INTERNAL_SERVER_ERROR, errorStatus.ErrorCode.internalServerError)); 
            }

        })

    }
    })

}
