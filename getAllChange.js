var fs = require('fs');
var path = require('path');

var prodNameArr = [
	'kero',
	'tinper-neoui',
	'tinper-neoui-grid',
	'tinper-neoui-polyfill',
	'tinper-neoui-tree',
	'tinper-neoui-sparrow',
]

// 获取当前version，值处理当前version的内容
var version = require('./package.json').version;

// 获取当前的所有changlog，每次只处理最新的。
var allFilePath = getResolvePath('CHANGELOG-ALL.md');
var oldStr = fs.readFileSync(allFilePath,'utf-8');


// 遍历所有仓库
var proAllArr = [];
var otherAllArr = [];
var featAllArr = [];
for(var i in prodNameArr){
	var prodName = prodNameArr[i];
	var filePath = getResolvePath('./node_modules/' + prodName + '/CHANGELOG.md');
	// 读取原有CHANGELOG
	if(fs.existsSync(filePath)){
		var dStr = fs.readFileSync(filePath,'utf-8');
		var versionIndex = dStr.indexOf(version);
		if(versionIndex > -1){
			// 获取第一个a标签的内容
			var aArr = dStr.split('<a');
			if(aArr.length > 1){
				var firstA = aArr[1];
				var baseStr = '<a' + firstA;
				var beginIndex = baseStr.indexOf('### Bug Fixes');
				if(beginIndex > -1){
					// 存在fixes才执行后续处理
					beginIndex  += 13;
					var endIndex = baseStr.indexOf('### Features');
					if(endIndex == -1){
						endIndex = baseStr.length;
					}
					var headStr = baseStr.substring(0,beginIndex);
					var endStr = baseStr.substring(endIndex);
					var sortStr = baseStr.substring(beginIndex,endIndex);
					var sortArr = sortStr.split('* ');
					for(var i in sortArr){
						var nowStr = sortArr[i];
						if(i > 0){
							if(nowStr.indexOf('pro-') == 0){
								proAllArr.push(nowStr);
							}else{
								otherAllArr.push(nowStr);
							}
						}
					}
				}
				// 处理feat
				var endIndex = baseStr.indexOf('### Features');
				if(endIndex > -1){
					featAllArr.push(baseStr.substring(endIndex + 12));
				}
			}
		}
	}
}
var proStr = '';
for(var i in proAllArr){
	proStr += '* ' + proAllArr[i] + '\r\n';
}
var otherStr = '';
for(var i in otherAllArr){
	otherStr += '* ' + otherAllArr[i] + '\r\n';
}

var featStr = '';
for(var i in featAllArr){
	featStr +=  featAllArr[i] + '\r\n';
}
var dateObj = new Date();
var dateStr = dateObj.getFullYear() + '-' + (dateObj.getMonth()+ 1) + '-' +  dateObj.getDate();
var allStr = '<a name="' + version + '"></a>\r\n## [' + version + ']\\(' + dateStr + '\\)\r\n';
allStr += '### Bug Fixes \r\n';
allStr += proStr;
allStr += otherStr;
allStr += '### Features \r\n';
allStr += featStr;

fs.writeFile(allFilePath, allStr + oldStr, function(err){
	if(err){
		console.log('write err');
	}else{
		console.log('changeLog all write success');
	}
})

function sortFun(baseStr){
	var beginIndex = baseStr.indexOf('### Bug Fixes');
	if(beginIndex > -1){
		// 存在fixes才执行后续处理
		beginIndex  += 13;
		var endIndex = baseStr.indexOf('### Features');
		if(endIndex == -1){
			endIndex = baseStr.length;
		}
		var headStr = baseStr.substring(0,beginIndex);
		var endStr = baseStr.substring(endIndex);
		var sortStr = baseStr.substring(beginIndex,endIndex);
		var sortArr = sortStr.split('* ');
		var proArr = [];
		var otherArr = [];
		for(var i in sortArr){
			var nowStr = sortArr[i];
			if(i > 0){
				if(nowStr.indexOf('pro-') == 0){
					proArr.push(nowStr);
				}else{
					otherArr.push(nowStr);
				}
			}
		}
		var proStr = '';
		for(var i in proArr){
			proStr += '* ' + proArr[i] + '\r\n';
		}

		var otherStr = '';
		for(var i in otherArr){
			otherStr += '* ' + otherArr[i] + '\r\n';
		}

		var newStr = headStr + '\r\n' +  proStr + otherStr + endStr;
		return newStr;
	}else{
		return baseStr;
	}
}

function getResolvePath(p){
	return path.resolve(__dirname, p)
}