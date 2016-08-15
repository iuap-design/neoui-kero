/**
 * Module : Kero-Adapter Version Tools
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-08-09 10:11:47
 */

var fs = require('fs');
var path = require('path');
var env = require('yargs').argv.mode;
var data = fs.readFileSync('./package.json', 'utf8');
var packageObj = JSON.parse(data);
var filesArr = [];
if(env == "dev") {
	filesArr.push('./dist/js/kero-adapter.js');
} else if(env == "build") {
	filesArr.push('./dist/js/kero-adapter.min.js');
}
var headerStr = '/** \r\n';
headerStr += ' * ' + packageObj.name + ' v' + packageObj.version + '\r\n';
headerStr += ' * ' + packageObj.description + '\r\n';
headerStr += ' * author : ' + packageObj.author + '\r\n';
headerStr += ' * homepage : ' + packageObj.homepage + '\r\n';
headerStr += ' * bugs : ' + packageObj.bugs.url + '\r\n';
headerStr += ' **/ \r\n';

for(var i = 0; i < filesArr.length; i++) {
	var filePath = filesArr[i]
	var data = fs.readFileSync(filePath, 'utf8');
	data = headerStr + data;
	fs.writeFileSync(filePath, data);
}