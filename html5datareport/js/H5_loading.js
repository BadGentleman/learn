var H5_loading = function(images, page){
    var id = this.id;
    
    if(this._imageNum === undefined){
        this._imageNum = (images || []).length;
        this._loaded = 0;

        window[id] = this;
        
        for(var i = 0; i < images.length; i++){
            var item = images[i];
            var img = new Image();
            img.onload = function(){
                window[id].loader('', page);
            };
            img.src = item;
        }
        
        $('#rate').text('0%');
        return this;
    }else{
        this._loaded++;
        $('#rate').text((this._loaded / this._imageNum * 100 >> 0)  + '%'); 

        if(this._loaded < this._imageNum){
            return this;
        }
    }
    
    delete window[id];
    
    this.el.fullpage({
        onLeave: function(index, nextIndex, direction){
            $(this).find('.h5_component').trigger('onLeave');
        },
        afterLoad: function(anchorLink, index){
            $(this).find('.h5_component').trigger('onLoad');
        }
    });

    this.el.show();
    if(page){
        $.fn.fullpage.moveTo(page);
    }else{
        this.pages[0].find('.h5_component').trigger('onLoad');
    }
}