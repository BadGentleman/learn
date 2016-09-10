/*水平柱状图组件*/
var H5ComponentBar = function(name, cfg){
	var component = new H5ComponentBase(name, cfg);

	var base = cfg.data[0][1];
	$.each(cfg.data, function(index, item){

		var line = $('<div class="line line_' + (index + 1)+ '">');
		var name = $('<div class="name">');
		var rate = $('<div class="rate">'); 
		var per = $('<div class="per">');

		var width = item[1] * 100 + '%';


		if(item[2]){
			var bgStyle = 'style="background: ' + item[2] + '"';
		}

		rate.width(width);	
		rate.html('<div class="bg" ' + bgStyle + '></div>');

		name.text(item[0]);
		per.text(width);
		line.append(name).append(rate).append(per);

		component.append(line);
	});

	return component;
};