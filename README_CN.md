
## neoui-kero
[![npm version](https://img.shields.io/npm/v/neoui-kero.svg)](https://www.npmjs.com/package/neoui-kero)
[![Build Status](https://img.shields.io/travis/iuap-design/neoui-kero/master.svg)](https://travis-ci.org/iuap-design/neoui-kero)
[![devDependency Status](https://img.shields.io/david/dev/iuap-design/neoui-kero.svg)](https://david-dm.org/iuap-design/neoui-kero#info=devDependencies)
[![NPM downloads](http://img.shields.io/npm/dm/neoui-kero.svg?style=flat)](https://npmjs.org/package/neoui-kero)

[English Document](./README.md)

##  介绍
[neoui-kero](http://tinper.org/dist/kero/docs/module.html) 是[kero](http://tinper.org/dist/kero/index.html) 与[tinper neoui](http://tinper.org/dist/neoui/index.html)之间的适配器，通过识别框架特有标记u-meta，创建对应的UI组件，同时进行数据双向绑定。


## 功能


*  **创建UI组件：**通过识别框架特有标记u-meta，创建对应的UI组件
* **简化数据操作：**打通数据模型kero与UI组件之间的数据流转，开发者只需要关注kero中的数据变化
* **丰富组件功能：**通过u-meta中属性设置，对数据校验、必输、是否可用等功能进行封装，简化开发难度


## 快速上手

### 获取neoui-kero

* npm 资源
```
	npm install neoui-kero
```

* cdn 资源
```
	//design.yyuap.com/static/neoui-kero/latest/js/neoui-kero.js
```
### 引入neoui-kero
- ES6语法
```
	<!-- neoui资源 -->
	import { neoui } from "tinper-neoui"
	
	<!-- kero资源 -->
	import { Datatable } from "kero"
	
	<!-- neoui-kero资源 -->
	import { u } from "neoui-kero"
	
```
- HTML直接引入

```
	<!--neoui相关资源 -->
	<script src="//design.yyuap.com/static/jquery/jquery-1.11.2.js"></script>
	<script src="//design.yyuap.com/static/neoui/latest/js/neoui.js"></script>
	<!--kero相关资源 -->
	<script src="//design.yyuap.com/static/knockout/knockout-3.2.0.debug.js"></script>
	<script src="//design.yyuap.com/static/kero/latest/kero.js"></script>
	<!--neoui-kero资源-->
    <script src="//design.yyuap.com/static/neoui-kero/latest/neoui-kero.js"></script>
```
**注**： neoui-kero使用需要neoui和kero结合。因此需要引入neoui和kero相关资源。


### 具体使用
本例实现如下效果：
- 默认数据绑定：#demo_input输入框绑定'hello world'
- 双向绑定： #demo_div获取#demo_input默认的值、及#demo_input修改失去焦点后的值

```
<!-- 
	HTML
	u-meta:框架特有标记，框架通过识别此标记创建对应UI组件，以及进行数据绑定 
	id,type.data,field为必选项
	id:创建组件唯一标识
	type:创建组件对应的类型
	data:指定数据模型中的数据集
	field:绑定数据集中对应的字段
-->
<input id="demo_input" u-meta='{"id":"t1","type":"string","data":"dt1","field":"f1"}' />
<div id="demo_div">&lt;/div></code></pre>
</div>
```

```
// JS
var app,viewModel;
/**
 * viewModel 创建数据模型
 * dt1 创建的数据集
 * f1 创建数据集中的字段
 * type:指定数据对应的类型
 */
viewModel = {
    dt1: new u.DataTable({
        meta:{
            f1:{
            	type:'string'
            }
        }
    })
};

/**
 * app 创建框架服务
 * el 指定服务对应的顶层DOM
 * model 指定服务对应的数据模型
 */
app = u.createApp({
    el:'body',
    model:viewModel
});

// 数据集dt1创建空行，并为字符f1赋值'Hello World'
var r = viewModel.dt1.createEmptyRow();
r.setValue('f1','Hello World');


/**
 * 数据集发生改变时，将#demo_input数据显示在#demo_div中
 * @return {[type]} [description]
 */
var demoInput = document.getElementById('demo_input');
var demoDiv = document.getElementById('demo_div');

var getDtValue = function() {
	var dtVal = viewModel.dt1.getValue('f1');
	demoDiv.innerHTML = dtVal;
};
demoInput.addEventListener('blur',getDtValue);
getDtValue();

```
开发文档详见[这里](http://tinper.org/dist/kero/docs/module.html)


## 如何参与贡献

### 开发及构建

开发者可以一起参与为 neoui-kero 贡献代码，同时也可以基于neoui-kero 进行二次开发或封装插件。


neoui-kero 使用 [gulp.js](http://gulpjs.com/) 构建项目。

克隆项目文件:

```
$ git clone git@github.com:iuap-design/neoui-kero.git
```

然后进入目录安装依赖：

```
$ npm install
```

接下来，执行 `gulp`：

```
$ npm run product
```


### 反馈
如在使用过程中遇到任何问题，可以在[这里](https://github.com/iuap-design/neoui-kero/issues)提交issue反馈；

或者直接fork代码到你的github仓库，提交pull request给我们。


[Bug 反馈及需求提交](CONTRIBUTING.md)

## Licence 版权

[MIT](./LICENSE)
