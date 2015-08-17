var path = require('path');

module.exports = {
	port: 8001,
	viewEngine: 'ejs',

	views: 'views',
	staticPath: 'public',//静态资源目录
	uploadDir:'public/uploads',//"/data/tmp/moka/",注意：要首先建立该文件夹，并做好权限

	env: 'dev',
	logfile: path.join(__dirname, '../logs/app.log'),


	//mysql config
	mysql:{
		host: "192.168.100.182",
		user: "dmdevelop",
		password: "develop@dm.com",
		db: "relation"
	},

	//redis config
	"redis": {"address": "localhost", "port": "6379", "passwd": ""}

};