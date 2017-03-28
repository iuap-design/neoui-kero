

[![npm version](https://img.shields.io/npm/v/neoui-kero.svg)](https://www.npmjs.com/package/neoui-kero)
[![Build Status](https://img.shields.io/travis/iuap-design/neoui-kero/master.svg)](https://travis-ci.org/iuap-design/neoui-kero)
[![devDependency Status](https://img.shields.io/david/dev/iuap-design/neoui-kero.svg)](https://david-dm.org/iuap-design/neoui-kero#info=devDependencies)
[![NPM downloads](http://img.shields.io/npm/dm/neoui-kero.svg?style=flat)](https://npmjs.org/package/neoui-kero)

[中文文档](./README_CN.md)


##  Introduction
[neoui-kero](http://tinper.org/dist/kero/docs/module.html) A adapter for [kero](http://tinper.org/dist/kero/index.html) and [tinper neoui](http://tinper.org/dist/neoui/index.html)。


## Features


* Create component
*  Simplify data manipulation

## Quickstart

###Get neoui-kero

* npm
```
    npm install neoui-kero
```

* cdn
```
    //design.yyuap.com/static/neoui-kero/latest/neoui-kero.js
```
### Introducing  neoui-kero
- ES6
```
    <!-- neoui-kero -->
    import { u } from "neoui-kero"

```
- HTML

```
    <!-- neoui-kero -->
    <script src="//design.yyuap.com/static/neoui-kero/latest/neoui-kero.js"></script>
```
**注**： neoui-kero often used in conjunction with [neoui](https://github.com/iuap-design/tinper-neoui), [kero](https://github.com/iuap-design/kero)


### Use


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

Read the [Develop documentation](http://tinper.org/dist/kero/docs/module.html)


## Contributing

### Develop

Developers can participate in the development of neoui-kero,  but also can be based on neoui-kero two development


neoui-kero use gulp.js and webpack build the project.


clone：

```
$ git clone git@github.com:iuap-design/neoui-kero.git
```

install：

```
$ npm install
```

build：

```
$ npm run product
```


### Feedback

If you encounter any problems , submit [issues](https://github.com/iuap-design/neoui-kero/issues),or pull request。

[PR code](CONTRIBUTING.md)


## Licence 版权

[MIT](./LICENSE)
