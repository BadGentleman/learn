/*内容组织*/
var H5 = function(container){

	this.container = container || $('body');

	this.pages = [];

	this.addPage = function(){
		var page = $('<div class="section page" id="page-' + (this.pages.length + 1) + '">');
		this.container.append(page);
		this.pages.push(page);

		page.on('onload', function(){
			$(this).find('.h5_component').trigger('onload');
		});

		page.on('onleave', function(){
			$(this).find('.h5_component').trigger('onleave');
		});

		return this;
	};

	this.addComponent = function(name, cfg){

		var page = this.pages[this.pages.length - 1];

		var com = null;

		switch(cfg.type){
			case 'base': 
				com = new H5ComponentBase(name, cfg);
				break;
			default: /*------*/ break;
		}

		page.append(com);

		return this;
	};
};
