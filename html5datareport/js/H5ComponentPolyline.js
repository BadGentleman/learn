/* 折线图组件对象 */
var H5ComponentPolyline = function(name, cfg){
    var component = new H5ComponentBase(name, cfg);
    
    var w = cfg.width;
    var h = cfg.height;
    
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = w;
    cns.height = h;
    component.append(cns);
    
    ctx.beginPath();
    ctx.strokeStyle = '#AAA';
    ctx.lineWidth = 1;
    //背景层 
    //水平线 10份
    var step = 10;

    for(var i = 0; i < step + 1; i++){
        var y = (h / step) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
    }
    //垂直线 数量=项数+2 份数=线数-1
    step = cfg.data.length + 1;
    var part_w = w / step ;
    for(var i = 0; i < step + 1; i++){
        var x = part_w * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        
        if(cfg.data[i]){
            var text = $('<div class="text">');
            text.text(cfg.data[i][0]);
            text.width((part_w >> 0) / 2).css('left', x / 2 + (part_w >> 0) / 4);
            component.append(text);
        }
    }
    ctx.stroke();
    
    //数据层
    cns = document.createElement('canvas');
    ctx = cns.getContext('2d');
    cns.width = w;
    cns.height = h;
    component.append(cns);
    var draw = function(process){
        var x = 0;
        var y = 0;
        
        ctx.clearRect(0, 0, w, h);
        
        ctx.beginPath();
        ctx.strokeStyle = '#ff8878';
        ctx.lineWidth = 3;
        var item = null;
        //画点
        for(var i = 0; i < cfg.data.length; i ++){
            item = cfg.data[i];
            x = part_w * (i + 1);
            y = h * ( 1 - (item[1] * process) );
            ctx.moveTo(x, y);//每次抬笔防止多个圆连接收尾
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
        }
        
        //连线
        ctx.moveTo(part_w, h * ( 1 - (cfg.data[0][1] * process) ));
        for(var i = 0; i < cfg.data.length; i ++){
            item = cfg.data[i];
            x = part_w * (i + 1);
            y = h * ( 1 - (item[1] * process) );
            ctx.lineTo(x, y);
        }
        //阴影
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255,136,120,0.2)';
        ctx.strokeStyle = 'rgba(255,136,120,0)';
        ctx.lineTo(x, h);
        ctx.lineTo(part_w, h);
        ctx.fill();
        //数据
        if(process >= 1){
            for(var i = 0; i < cfg.data.length; i ++){
                item = cfg.data[i];
                x = part_w * (i + 1);
                y = h * ( 1 - (item[1] * process) );
                ctx.fillStyle = item[2] ? item[2] : '#595959';//'rgba(89, 89, 89, ' + process + ')';
                ctx.fillText(( (item[1] * 100) >> 0) + '%', x - 8, y - 14);
            }
        }
        ctx.stroke();
    }
    
    component.on('onLoad', function(){
        var proc = 0;
        for(var i = 0; i < 100; i++){
            setTimeout(function() {
                proc += .01;
                draw(proc);
            }, i * 10 + 500);
        }
    });
    
    component.on('onLeave', function(){
        var proc = 1;
        for(var i = 0; i < 100; i++){
            setTimeout(function() {
                proc -= 0.01;
                draw(proc);
            }, i * 10);
        }
    });

    return component;
}