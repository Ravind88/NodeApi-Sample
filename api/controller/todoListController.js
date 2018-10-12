//route implementation, bussiness logic
// api methods route
var express = require('express');
app = express();
var con = require('../config/dbConnection');
var customFunction = require('../util/customFuntions');
var inspector = require('schema-inspector');
var statusCode = require('../config/statusCodes.js');
var stringMessage = require('../config/dbStrings.js');
require('../config/dbconstant.js')

// delete record (soft deletion)
app.deleteRecord = function (req, res) {
    var json = req.body;
    schema = {
        id: json.userId,
        contact_id: json.contact_id

    }
    con.query("update contact set is_deleted=1 where id=? and parent_id=?", [schema.contact_id, schema.id], function (error, result) {
        if (error) {
            serverErrrorMethodResponse(res, error.errors[0].messages)

        } else {
            console.log(result)
            if (result.affectedRows) {
                serverResponseWithMessageOnly(res, stringMessage.record_deleted);

            } else {

                serverResponseFailure(res, stringMessage.record_not_deleted);

            }

        }
    })
}


var serverErrrorMethodResponse = function (res, mesg) {
    var msgObj = new Object();
    msgObj.message = mesg;
    customFunction.makeResponse(res, false, statusCode.server_error, stringMessage.server_error, AppVersion, msgObj)

}

var serverResponseWithMessageOnly = (res, msg) => {
    var msgObj = new Object();
    msgObj.message = msg;
    customFunction.makeResponse(res, true, statusCode.success, stringMessage.success, AppVersion, msgObj)
}

var serverResponseFailure = (res, msg) => {
    var msgObj = new Object();
    msgObj.message = msg;
    customFunction.makeResponse(res, false, statusCode.fail, stringMessage.failure, AppVersion, msgObj)
}

var serverSuceesResponse = (res, data) => {
    customFunction.makeResponse(res, true, statusCode.success, stringMessage.success, AppVersion, data)

}


// get profile
app.getProfile = function (req, res) {
    var id = req.query.userId;

    con.query("select * from user where id=?", [id], function (error, result) {
        if (error) {
            serverErrrorMethodResponse(res, error.errors[0].messages)

        } else {
            if (result.length > 0) {
                serverSuceesResponse(res, result[0])

            } else {
                serverResponseFailure(res, stringMessage.contact_not_found)
            }

        }
    })

}


// login 
app.login = function (req, res) {
    var json = req.body;
    var schema = {
        email: json.email,
        password: json.password

    };
    try {
        con.query("select * from user where email=? and password =?", [schema.email, schema.password], function (error, result) {
            if (error) {
                serverErrrorMethodResponse(res, error.errors[0].messages)

            } else {
                if (result.length > 0)
                    serverSuceesResponse(res, result[0]);
                else {
                    serverResponseFailure(res, stringMessage.contact_not_found);
                }


            }
        })

    } catch (error) {
        serverErrrorMethodResponse(res, stringMessage.server_error)

    }


}
//add contact

app.addContact = function (req, res) {
    var json = req.body;
    var scheme = {
        name: json.name,
        email: json.email,
        profile_image: json.profile_image,
        mobile_number: json.mobile_number,
        lat: json.lat,
        longitude: json.longitude,
        parent_id: json.parent_id

    }

    con.query("select * from contact where email=?", [scheme.email], function (error, resul2) {
        console.log(error);
        if (resul2.length == 0) {
            con.query("insert into contact(name,email,profile_image,mobile_number,lat,longitude,parent_id) value(?,?,?,?,?,?,?)",
                [scheme.name, scheme.email, scheme.profile_image, scheme.mobile_number, scheme.lat, scheme.longitude, scheme.parent_id], function (error, result) {
                    if (error) {
                        serverErrrorMethodResponse(res, error.errors[0].messages)

                    } else {
                        if (result.insertId) {
                            con.query("select * from contact where id=?", result.insertId, function (err, resultOne) {
                                if (err) {
                                    serverResponseFailure(res, stringMessage.record_not_inserted)
                                }
                                else {
                                    serverSuceesResponse(res, resultOne[0]);
                                }
                            })
                        }
                    }
                })
        } else {
            serverResponseFailure(res, stringMessage.email_exist)
        }

    });






}

// get all contact list 
app.getAllContact = function (req, res) {
    var userId = req.query.userId;
    con.query("select * from contact where parent_id=? and is_deleted=0", [userId], function (error, result) {
        if (error) {
            serverErrrorMethodResponse(res, error.errors[0].messages)
        } else {
            if (result.length > 0) {
                serverSuceesResponse(res, result);

            } else {
                return serverResponseFailure(res, stringMessage.contact_not_found)

            }
        }
    })

}







// signup api
app.signup = function (req, res) {
    var json = req.body;
    var schema = {
        name: json.name,
        email: json.email,
        password: json.password,
        mobile_number: json.mobile_number

    };
    con.query("select * from user where email=?", [schema.email], function (error, resul) {
        if (resul.length == 0) {
            con.query("Insert into user(name,email,password,mobile_number) values (?,?,?,?)",
                [schema.name, schema.email, schema.password, schema.mobile_number], function (error, result) {
                    if (error) {
                        serverErrrorMethodResponse(res, error.errors[0].messages)


                    } else {
                        if (result.insertId) {
                            con.query("select * from user where id=?", result.insertId, function (err, resultOne) {
                                if (err) {
                                    serverResponseFailure(res,stringMessage.record_not_inserted);
                                }
                                else {
                                    serverSuceesResponse(res,resultOne[0]);
                                }
                            })
                        }


                    }
                })
        } else {
            var msgobj = new Object();
            msgobj.message = "Email aready exist";

            return customFunction.makeResponse(res, false, 500, "error", 1.3, msgobj)
        }
    });



}

module.exports = app;