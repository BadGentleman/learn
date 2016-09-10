/*散点图组件*/
var H5ComponentPoint = function(name, cfg){
	var component = new H5ComponentBase(name, cfg);

	var base = cfg.data[0][1];
	var value = [];

	$.each(cfg.data, function(index, item){
		var point = $('<div class="point point_' + (index + 1) + '">');
		var per = (item[1] / base * 100) + '%';

		var name = $('<div class="name">');
		var rate = $('<div class="per">');

		rate.text(item[1] * 100 + '%');
		name.text(item[0]).append(rate);

		point.append(name);

		point.width(per).height(per);

		if(item[2]){
			point.css('background-color', item[2]);
		}

		if(item[3] !== undefined && item[4] !== undefined){
			// point.css({
			// 	'left': item[3],
			// 	'top': item[4]
			// });

			/*中心飞出动画 闭包存储数据*/
			var origin = (100 - parseInt(per)) / 2;
			point.css({
				left: origin,
				top: origin
			});
			value.push([item[3], item[4]]);
			point.on('onpointload', function(){//onload
				$(this).css({
					left: value[index - 1][0],
					top: value[index - 1][1]
				});
				return false;
			});
			point.on('onpointleave', function(){//onleave
				$(this).css({
					left: origin,
					top: origin
				});
				return false;
			});

		}else{
			//component.append(point);
			point.css('z-index', 99);
			var cPoint = point.clone();
			cPoint.addClass('point_first');
			cPoint.text('');
			//point = cPoint;
			component.append(cPoint);
		}



		component.append(point); 
	});

	/*中心飞出动画实现  未解决onload事件循环bug H5ComponentBase.js col25*/
	component.on('onload', function(){
		var index = 0;
		var points = component.find('.point').not('.point_1');
		var timer = setTimeout(function(){
			points.eq(index++).trigger('onpointload');
			if(points.length !== index){
				//clearTimeout(timer);
			//}else{
				timer = setTimeout(arguments.callee, 500);
			}
			console.log(index);
		}, 500);

		return false;
	});

	component.on('onleave', function(){
		//setTimeout(function(){
			component.find('.point').trigger('onpointleave');
		//}, 200);

		return false;
	});

	return component;
};