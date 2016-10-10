/* 柱图组件对象 */
var H5ComponentBar = function(name, cfg){
    var componenet = new H5ComponentBase(name, cfg);
    
    $.each(cfg.data, function(index, item){
        var line = $('<div class="line">');
        var name = $('<div class="name">');
        var rate = $('<div class="rate">');
        var per = $('<div class="per">');
        var bg = $('<div class="bg" >');
        
        var width = (item[1] * 100) + '%';

        if(item[2]){
            bg.css('background-color', item[2]);
        }
        
        name.text(item[0]);
        rate.width(width).append(bg);
        per.text(width);
        
        line.append(name).append(rate).append(per);
        
        componenet.append(line);
    });
    
    return componenet;
}