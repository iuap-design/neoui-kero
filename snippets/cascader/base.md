#### 级联组件

本例展示级联组件示例。

[试一试](http://tinper.org/webide/#/demos/kero/cascader)


#### API

#### u-meta 属性

* type：`u-cascader`

* datasource
	* 类型： Array
	* 说明：设置下拉框的数据源，具体数组内容需要在viewmodel中定义，数组中的每个对象需要有value，name字段。其中name为下拉框的显示值，value为下拉框的真实值。
	* 用法：

		```

		casData:[{value: "11",name: '杭州'}]

		```

**注**：如果在开发时要求兼容ie8,ie9，datasource必须定义。　


u-meta基础api请参考[这里](http://docs.tinper.org/moy/kero-model.html#Type类型)



#### CascaderAdapter对象

* 类型：`Object`
* 说明： 获取CascaderAdapter对象，可以通过此对象的一些方法来改变下拉框的效果状态。下面方法均是在此对象基础上调用的。
* 用法：`app.getComp('控件id值')；`



```

<div id="combo1" class="u-combo u-text u-label-floating" u-meta='{"id":"c1","type":"u-cascader","data":"dt1","field":"f1","datasource":"casData"}'>
    <input class="u-input"/>
    <span class="u-combo-icon"></span>
</div>

var cascaderAObject = app.getComp('c1');//c1为在u-meta中定义的id值

```

#### setData 设置数据源

* 类型： `Function`
* 说明：给级联对象添加数据源
* 参数：
	* `{Array} dataArray`
* 用法：

```
//value为：级联真实值，name为级联显示值，children为子项列表数据，格式同上
var data = [{
        value: "01",
        name: '浙江',
        children: [{
            value: "11",
            name: '杭州',
            children: [{
                value: "21",
                name: '西湖',
                children: [{
                        value: "31",
                        name: '白娘子'
                    },
                    {
                        value: "32",
                        name: '许仙'
                    }
                ]
            }]
        }]
    }];


cascaderAObject.setData(data);

```


#### setValue 根据真实值选中某行
* 类型： `Function`
* 说明： 查找级联数据中与传入的参数相同的真实值，并选中对应的某条数据
* 参数：
	* `{String} value`： 要选中行的真实值，可以为空，如果为空，则清空输入框
* 用法：

```

cascaderAObject.setValue(value);

```


相关内容：

[ui级联组件](http://docs.tinper.org/neoui/plugin.html#级联组件)    
