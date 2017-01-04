define(['text!ui_refer_template.html'], function(temp){
    var referDOM = document.getElementById('referdom');
    return u.on(referDOM, 'click', function(){
        u.refer({
          title:'测试项目',
          height:'300px',
          isPOPMode: true,
          module:{
              template: temp
          },
          onOk: function(){
              alert('ok');
          },
          onCancel: function(){
              alert('cancel');
          }
        //   contentId: 'testitemid_ref'//必填项
        })
    })
})
