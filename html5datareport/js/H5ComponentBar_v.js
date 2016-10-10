/* 垂直柱图组件对象 */
var H5ComponentBar_v = function(name, cfg){
    var component = new H5ComponentBar(name, cfg);
    
    var width = (100 / cfg.data.length) >> 0; //计算每一个line的宽度
    
    component.find('.line').width(width + '%');
    
    component.find('.rate').each(function(){
       var w = $(this).css('width');//把水平所占比例转换为垂直占比
       
       $(this).height(w).width('');
    });
    
    component.find('.per').each(function(){
       $(this).prev().append($(this)); 
    });
    
    return component;
}