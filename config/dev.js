var path = require('path');

module.exports = {
    port: 5000,
    viewEngine: 'ejs',
    sessionSecret: 'session_secret_random_seed',

    views: 'views',
    staticPath: 'public',//静态资源目录
    uploadDir: 'public/uploads',//注意：要首先建立该文件夹，并做好权限

    env: 'dev',

    log:{
        persist: false,//是否开启日志的持久化，即记录到日志文件
        logfile: path.join(__dirname, '../logs/app.log')//persist为true时有效
    },



    //mysql config
    //mysql: {
    //    host: "192.168.100.182",
    //    user: "dmdevelop",
    //    password: "develop@dm.com",
    //    db: "relation"
    //},

    //redis config
    //"redis": {"address": "192.168.100.185", "port": "6379", "passwd": ""},

    mongodb: {
        address: "mongodb://127.0.0.1:27017/moklr"
    },

    //moklr的status服务需要runbot来做指定http api的定期check，若不需要status服务可不开启此功能
    //runbot服务需单独部署，详见https://github.com/sumory/runbot
    runbot: {
        on: false,//是否开启runbot支持
        address:"http://localhost:8002"//若on为true，即开启runbot服务，这里配置runbot服务的http地址
    }

};
