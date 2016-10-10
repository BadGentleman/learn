/* 饼图组件对象 */
var H5ComponentPie = function(name, cfg){
    var component = new H5ComponentBase(name, cfg);
    
    var w = cfg.width;
    var h = cfg.height;
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = w;
    cns.height = h;
    $(cns).css('z-index', 1);
    component.append(cns);
    
    var r = w / 2;
    var part = cfg.data.length;
    //底图层
    ctx.beginPath();
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.arc(r, r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    cns = document.createElement('canvas');
    ctx = cns.getContext('2d');
    cns.width = w;
    cns.height = h;
    $(cns).css('z-index', 2);
    component.append(cns);
    
    //数据层
    var colors = ['yellow', 'red', 'orange', 'green', 'blue'];
    var sAngle = 1.5 * Math.PI;
    var eAngle = 0;
    var aAngle = 2 * Math.PI;
    for(var i = 0; i < part; i++){
        var item = cfg.data[i];
        eAngle = sAngle + aAngle * item[1];
        
        ctx.beginPath();        
        ctx.fillStyle = item[2] || (item[2] = colors.pop());
        ctx.strokeStyle = item[2];
        ctx.lineWidth = .1;
        
        ctx.moveTo(r, r);
        ctx.arc(r, r, r, sAngle, eAngle);
        ctx.fill();
        ctx.stroke();
        

        sAngle = eAngle;
        

        var text = $('<div class="text">');
        var per = $('<div class="per">');
        per.text(item[1] * 100 + '%');
        text.text(item[0]).css('color', item[2]);
        text.append(per);
        
        var x = r + Math.cos(eAngle) * r;
        var y = r + Math.sin(eAngle) * r;
        
        if(x > r){
            text.css('left', x / 2);
        }else{
            text.css('right', (w - x) / 2);
        }
        
        if(y > r){
            text.css('top', y / 2); 
        }else{
            text.css('bottom', (h - y) / 2);
        }
        
        component.append(text);
    }
    

    
    cns = document.createElement('canvas');
    ctx = cns.getContext('2d');
    cns.width = w;
    cns.height = h;
    $(cns).css('z-index', 3);    
    component.append(cns);
    
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.llineWidth = 1;
    
    //遮罩层
    var draw = function(process){
        ctx.clearRect(0, 0, w, h);
        
        if(process >= 1){
            // 重排
            // component.find('.text').css('transition', 'none');
            // H5ComponentPie.resort(component.find('.text'));
            // component.find('.text').css('transition', 'all 1s');
            return;
        }
        
        ctx.beginPath();
        ctx.moveTo(r, r);
        if(process <= 0){
            ctx.arc(r, r, r, 0, 2 * Math.PI);
        }else{
            ctx.arc(r, r, r, sAngle, sAngle + 2 * Math.PI * process, true); 
        }
        ctx.fill();
        ctx.stroke();
    }
    
   draw(0);
    
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
    return component;
}

H5ComponentPie.resort = function(list){
    
    var compare = function(domA, domB){
        var offsetA = $(domA).offset();
        var offsetB = $(domB).offset();
        
        var shadowA_x = [offsetA.left, offsetA.left + $(domA).width()];
        var shadowA_y = [offsetA.top, offsetA.top + $(domA).height()];
        
        var shadowB_x = [offsetB.left, offsetB.left + $(domB).width()];
        var shadowB_y = [offsetB.top, offsetB.top + $(domB).height()];
        
        var a_check_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1])
        || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] < shadowB_x[1]);
        var a_check_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1])
        || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1]);
        //防止包含
        var b_check_x = (shadowB_x[0] > shadowA_x[0] && shadowB_x[0] < shadowA_x[1])
        || (shadowB_x[1] > shadowA_x[0] && shadowB_x[1] < shadowA_x[1]);
        var b_check_y = (shadowB_y[0] > shadowA_y[0] && shadowB_y[0] < shadowA_y[1])
        || (shadowB_y[1] > shadowA_y[0] && shadowB_y[1] < shadowA_y[1]);
        
        return (a_check_x && a_check_y) || (b_check_x && b_check_y);
    }
    
    //重排函数应修改
    var reset = function(domA, domB){
        if($(domA).css('top') !== 'auto'){
            $(domA).css('top', parseInt($(domA).css('top')) + $(domB).height());
        }
        if($(domA).css('bottom') !== 'auto'){
            $(domA).css('bottom', parseInt($(domA).css('bottom')) + $(domB).height());
        }
    }
    
    // 只会修改以一个元素为起始元素的元素链, a交b b交c d交e 修改abc 忽略de 
    // var willReset = [list[0]];
    // list.each(function(index, dom){
    //     if(compare(willReset[willReset.length - 1], dom)){
    //         willReset.push(dom);
    //     } 
    // });
    
    // if(willReset.length > 1){
    //     $.each(willReset, function(index, dom){
    //         if(willReset[index + 1]){
    //             reset(dom, willReset[index + 1]);
    //         }
    //     });
    //     H5ComponentPie.resort(list);
    // }
    
    //修改全部元素的相交
    var willReset = [];
    list.each(function(index, dom){
        if(list[index + 1]){
            if(compare(dom, list[index + 1])){
                willReset.push([dom, list[index + 1]]);
            } 
        }
    });
    
    if(willReset.length > 0){
        $.each(willReset, function(index, dom){
            reset(dom[0], dom[1]);
        });
        H5ComponentPie.resort(list);
    }
}