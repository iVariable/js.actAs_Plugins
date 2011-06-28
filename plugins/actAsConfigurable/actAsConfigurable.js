function actAsConfigurable(){ //$.extend - выпилить??
	
	var actAsConfigurable_options = {};
	
	this.getOptions = function(){
    	return $.extend({},actAsConfigurable_options);
    };
    
    this.setOptions = function(_options){
    	actAsConfigurable_options = $.extend( actAsConfigurable_options, _options );
    };
    
    if( this.constructor.name != 'Object' && typeof window['actAsConfigurable_'+this.constructor.name] != 'undefined' ){
    	this.setOptions( window['actAsConfigurable_'+this.constructor.name] );    	
    };
    
	
};