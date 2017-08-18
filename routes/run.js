var express = require('express');
var router = express.Router();
var redis = require("../lib/redisUtils.js");
var request = require("request");
var util = require("util");

module.exports = router;

router.get('/exec', function (req, res, next) {
    var requestObj = req.query.r;
    console.dir(requestObj);
    if (!requestObj) {
        return res.json({
            success: false,
            errorCode: 1,
            msg: "缺少请求描述参数：r"
        });
    }

    if (requestObj) {
        run(requestObj, function (err, response, body) {
            if (err) {
                return res.json({
                    success: false,
                    errorCode: 2,
                    msg: err.toString()
                });
            } else {
                return res.json({
                    success: true,
                    errorCode: 0,
                    msg: "ok",
                    data: {
                        responseStatus: response.statusCode || 'nil',
                        body: body
                    }
                });
            }
        });
    }
});


router.get('/execById', function (req, res, next) {
    var rid = req.params.rid;
    if (!rid) {
        return res.json({
            success: false,
            errorCode: 1,
            msg: "缺少参数：request id"
        });
    }

    redis.get('bin:' + rid, function (err, value) {
        if (err) {
            return res.json('error', {
                success: false,
                errorCode: 1,
                msg: "无法找到构建的请求"
            });
        }

        if (!util.isObject(value)) {
            return res.json('error', {
                success: false,
                errorCode: 1,
                msg: "构建的请求不是合法的格式"
            });
        }


        run(value, function (err, response, body) {
            if (err) {
                return res.json({
                    success: false,
                    errorCode: 2,
                    msg: err.toString()
                });
            } else {
                return res.json({
                    success: true,
                    errorCode: 0,
                    msg: "ok",
                    data: {
                        responseStatus: response.statusCode,
                        body: body
                    }
                });
            }
        });
    })

});

function run(r, callback) {
    var headers = {};
    if (r.cookies && r.cookies.length > 0) {
        var cookies = [];
        for (var i = 0; i < r.cookies.length; i++) {
            cookies.push(r.cookies[i].name + "=" + r.cookies[i].value);
        };
        headers["Cookie"] = cookies.join('&');
    };
    if (!!r.headers && r.headers.length > 0) {
        for (var i = 0; i < r.headers.length; i++) {
            headers[r.headers[i].name] = r.headers[i].value;
        };   
    };
    r.headers = headers;
    if (r.method == "GET") {
        var options = r;
        request(options, function (error, response, body) {
            console.log("========");
            console.dir(error);
            console.dir(response && (response.statusCode || ""));
            console.dir(body);
            console.log("++++++++");

            callback && callback(error, response, body);

        });

    } else if (r.method == "POST") {
        r.form = {};
        if(!r.postData) {
            return callback && callback(new Error("postData cant't be empty"));
        }
        var mimeType = r.postData.mimeType;
        if (mimeType === 'application/x-www-form-urlencoded' || mimeType === 'multipart/form-data') {
            var params = {};
            var toParseParams = r.postData.params;
            if (toParseParams && toParseParams.length > 0) {
                for (var o = 0, p = toParseParams.length; o < p; o++) {
                    var f = toParseParams[o];
                    params[f.name] = f.value;
                }
            }
            r.form = params || {};
        } else if (mimeType === 'application/json') {
            try {
                var textjson = JSON.parse(r.postData.text || {});
                r.form = null;
                r.body = r.postData.text;
                //r.json = true;
                r.headers["Content-type"] = "application/json";
                r.postData = null;
            } catch (e) {
                return callback && callback(new Error("postData[text] must be json format"));
            }
        }

        //console.dir(r);
        request(r, function (error, response, body) {
            console.log("========");
            console.dir(error);
            console.dir(response && (response.statusCode || ""));
            console.dir(body);
            console.log("++++++++");

            callback && callback(error, response, body);

        });
    }
    else {
        callback && callback(new Error("request method is illegal"));
    }
}


//run({
//        "method": "POST",
//        "url": "http://192.168.100.122:8001/user/save",
//        "httpVersion": "HTTP/1.1",
//        "queryString": [],
//        "headers": [
//            {
//                "name": "Content-type",
//                "value": "application/json"
//            },
//            {
//                "name": "Accept",
//                "value": "*/*"
//            }
//        ],
//        "cookies": [],
//        "postData": {
//            "mimeType": "application/json",
//            "text": "{\"name\":\"sumory222\",\"age\":12,\"sex\":\"男\"}"
//        }
//});

//run({
//    "method": "POST",
//    "url": "http://192.168.100.122:8001/user/save",
//    "httpVersion": "HTTP/1.1",
//    "queryString": [],
//    "headers": [
//        {
//            "name": "Content-type",
//            "value": "application/x-www-form-urlencoded"
//        },
//        {
//            "name": "Accept",
//            "value": "*/*"
//        }
//    ],
//    "cookies": [],
//    "postData": {
//        "mimeType": "application/x-www-form-urlencoded",
//        "params": [
//            {
//                name:"name",
//                value:"sumory-json"
//            },
//            {
//                name:"age",
//                value:18
//            },
//            {
//                name:"sex",
//                value:true
//            }
//        ]
//    }
//});

//run({
//    "method": "GET",
//    "url": "http://192.168.100.122:8010/allrelation?uid=856318",
//    "httpVersion": "HTTP/1.1",
//    "queryString": [
//        {
//            "name": "uid",
//            "value": "856318"
//        }
//    ],
//    "headers": [
//        {
//            "name": "Accept",
//            "value": "*/*"
//        }
//    ],
//    "cookies": []
//});

