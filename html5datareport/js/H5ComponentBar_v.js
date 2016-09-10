/*垂直柱状图组件*/
var H5ComponentBarV = function(name, cfg){
	var component = H5ComponentBar(name, cfg);
	var base = cfg.data[0][1];
	component.find('.line').removeClass('line').addClass('v_line');
	component.find('.name').removeClass('name').addClass('v_name');
	component.find('.per').removeClass('per').addClass('v_per');
	component.find('.bar').removeClass('bar').addClass('v_bar');
	component.find('.proc').css({
		height: 0,
		top: '100%',
	}).removeClass('proc').addClass('v_proc');


	component.on('onload', function(){
		component.find('.v_proc').each(function(index){
			var h = cfg.data[index][1];
			$(this).css({
				height: h / base * 100 + '%',
				top: (base - h) / base * 100 + '%'

			});
		});

		component.find('.v_per').each(function(index){
			$(this).css('opacity', '1');
		});
		return false;
	});


	component.on('onleave', function(){
		component.find('.v_proc').each(function(index){
			$(this).css({
				height: 0,
				top: '100%'
			});
		});

		component.find('.v_per').each(function(index){
			$(this).css('opacity', '0');
		});
		return false;
	});
	return component;
};