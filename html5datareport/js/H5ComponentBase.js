/* 基本图文组件对象 */
var H5ComponentBase = function(name, cfg){
    cfg = cfg || {};
    
    var id = ('h5_c_' + Math.random()).replace('.', '_');
    var cls = 'h5_component_name_' + name + ' h5_component_' + cfg.type;
    
    var component = $('<div id="' + id + '" class="h5_component ' + cls + '">');
    
    cfg.text && component.text(cfg.text);
    cfg.width && component.width(cfg.width / 2);
    cfg.height && component.height(cfg.height / 2);
    
    cfg.css && component.css(cfg.css);
    cfg.bg && component.css('background-image', 'url(' + cfg.bg + ')');
    
    if(cfg.center === true){
        component.css({
           left: '50%',
           marginLeft: (cfg.width / 4 * -1) + 'px'
        });
    }
    
    if(typeof cfg.onclick === 'function'){
        component.on('click', cfg.onclick);
    }
    
    component.on('onLoad', function(){
        setTimeout(function() {
            component.removeClass(cls + '_leave').addClass(cls + '_load');
            cfg.animateIn && component.animate(cfg.animateIn);
        }, cfg.delay || 0);
        return false;
    });
    component.on('onLeave', function(){
        component.removeClass(cls + '_load').addClass(cls + '_leave');
        cfg.animateOut && component.animate(cfg.animateOut);
        return false;
    });
    
    return component;
}