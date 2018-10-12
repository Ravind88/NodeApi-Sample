exports.makeResponse = function (res, successStatus, status, message, appVersion, data) {
// response
res.set('Access-Control-Allow-Origin', '*');
res.status(status).json({
Success: successStatus,
Status: status,
Message: message,
AppVersion: appVersion,
Result: data
});
}