/*基本图文组件*/
var H5ComponentBase = function(name, cfg){
	var cfg = cfg || {};
	var id = ('h5_c_' + Math.random()).replace('.', '_');
	var cls = 'h5_component_name_' + name + ' h5_component_' + cfg.type;

	var component = $('<div class="h5_component ' + cls + '" id="' + id + '">');

	component.width(cfg.width / 2).height(cfg.height / 2);

	cfg.css && component.css(cfg.css);
	cfg.text && component.text(cfg.text);

	cfg.bg && component.css('background-image', 'url(' + cfg.bg + ')');

	if(cfg.center){
		component.css({
			'margin-left': -cfg.width / 4,
			'left': '50%'
		});
	}
	component.on('onload', function(){
		component.removeClass(cls + '_leave').addClass(cls + '_load');
		cfg.animateIn && component.animate(cfg.animateIn);
		// 事件循环bug代码
		// var points = component.find('.point');
		// points.trigger('onload');
		return false;
	});

	component.on('onleave', function(){
		component.removeClass(cls + '_load').addClass(cls + '_leave');
		cfg.animateOut && component.animate(cfg.animateOut);

		return false;
	});

	return component;
};