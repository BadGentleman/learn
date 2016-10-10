/* 雷达图组件对象 */
var H5ComponentRadar = function(name, cfg){
    var component = new H5ComponentBase(name, cfg);
    
    var w = cfg.width;
    var h = cfg.height;
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = w;
    cns.height = h;
    component.append(cns);
    
    
    var r = w / 2;
    var part = cfg.data.length;
    var rad = (2 * Math.PI / 360) * (360 / part);
    var x = 0;
    var y = 0;
    //背景
    for(var s = 10; s > 0; s--){
        ctx.beginPath();
        for(var i = 0; i < part; i++){
            x = r + Math.sin(rad * i) * r * s * .1;
            y = r + Math.cos(rad * i) * r * s * .1;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = (s % 2 === 0) ? '#99c0ff' : '#f1f9ff';
        ctx.fill();
    }
    //伞骨
    ctx.beginPath();
    for(var i = 0; i < part; i++){
        x = r + Math.sin(rad * i) * r;
        y = r + Math.cos(rad * i) * r;
        ctx.moveTo(r, r);
        ctx.lineTo(x, y);
        
        //项目文本
        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);
        
        if(x > r){
            text.css('left', x / 2 + 5);
        }else{
            text.css('right', (w - x) / 2 + 5);
        }
        
        if(y > r){
            text.css('top', y / 2 + 5);
        }else{
            text.css('bottom', (h - y) / 2 + 5);
        }
        
        if(cfg.data[i][2]){
            text.css('color', cfg.data[i][2]);
        }
        
        text.css('transition', 'all 1s ' + (i * .1 + 1 + 0.5) + 's');
        component.append(text);
    }
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();
    
    //数据层
    cns = document.createElement('canvas');
    ctx = cns.getContext('2d');
    cns.width = w;
    cns.height = h;
    component.append(cns);
    
    var draw = function(process){
        ctx.clearRect(0, 0, w, h);
        var x = 0;
        var y = 0;
        var rate = 0;
        //画点
        ctx.strokeStyle = '#f00';
        ctx.fillStyle = '#ff7676';
        for(var i = 0; i < part; i++){
            rate = cfg.data[i][1];
            x = r + Math.sin(rad * i) * r * rate * process;
            y = r + Math.cos(rad * i) * r * rate * process;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
        
        //连线
        ctx.beginPath();
        for(var i = 0; i < part; i++){
            rate = cfg.data[i][1];
            x = r + Math.sin(rad * i) * r * rate * process;
            y = r + Math.cos(rad * i) * r * rate * process;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
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
               proc -= .01;
               draw(proc);
           }, i * 10);
       }        
    });

    return component
}