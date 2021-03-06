// JS

/**
 * viewModel 创建数据模型
 * dt1 创建的数据集
 * f1 创建数据集中的字段
 * type:指定数据对应的类型
 * precision:设置精度
 */
var app,viewModel;
viewModel = {
    dt1: new u.DataTable({
        meta: {
            f1: {precision:2}
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

// 创建空行
var r = viewModel.dt1.createEmptyRow();






