

[![npm version](https://img.shields.io/npm/v/kero-adapter.svg)](https://www.npmjs.com/package/kero-adapter)
[![Build Status](https://img.shields.io/travis/iuap-design/kero-adapter/master.svg)](https://travis-ci.org/iuap-design/kero-adapter)
[![devDependency Status](https://img.shields.io/david/dev/iuap-design/kero-adapter.svg)](https://david-dm.org/iuap-design/kero-adapter#info=devDependencies)
[![NPM downloads](http://img.shields.io/npm/dm/kero-adapter.svg?style=flat)](https://npmjs.org/package/kero-adapter)

[中文文档](./README_CN.md)


##  Introduction
[kero-adapter](http://tinper.org/dist/kero/docs/module.html) A adapter for [kero](http://tinper.org/dist/kero/index.html) and [tinper neoui](http://tinper.org/dist/neoui/index.html)。


## Features


### Create component


### Simplify data manipulation



## Quickstart

### Quickstart

- From github
```
git clone git@github.com:iuap-design/kero-adapter.git
```

- npm

```
npm install kero-adapter
```

### simple example


```

<input id="demo_input" u-meta='{"id":"t1","type":"string","data":"dt1","field":"f1"}' />
<div id="demo_div">&lt;/div></code></pre>
</div>
```

```
// JS
var app,viewModel;

viewModel = {
    dt1: new u.DataTable({
        meta:{
            f1:{
            	type:'string'
            }
        }
    })
};


app = u.createApp({
    el:'body',
    model:viewModel
});

var r = viewModel.dt1.createEmptyRow();
r.setValue('f1','Hello World');



var demoInput = document.getElementById('demo_input');
var demoDiv = document.getElementById('demo_div');

var getDtValue = function() {
	var dtVal = viewModel.dt1.getValue('f1');
	demoDiv.innerHTML = dtVal;
};
demoInput.addEventListener('blur',getDtValue);
getDtValue();

```
## Document

[Develop documentation](http://tinper.org/dist/kero/docs/module.html)

[Website](http://tinper.org)

## Contributing


### Feedback

If you encounter any problems , submit [issues](https://github.com/iuap-design/kero-adapter/issues),or pull request。

[PR code](CONTRIBUTING.md)

### Develop

Developers can participate in the development of kero-adapter,  but also can be based on kero-adapter two development


kero-adapter use gulp.js and webpack build the project.


clone：

```
$ git clone git@github.com:iuap-design/kero-adapter.git
```

install：

```
$ npm install
```

build：

```
$ npm run product
```

### Website Chat Group

527124070

## Licence 版权

[MIT](./LICENSE)
