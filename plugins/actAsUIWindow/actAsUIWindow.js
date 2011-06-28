function actAsUIWindow(){
	
	var actAsUIWindow_window        = false;
	var actAsUIWindow_windowTitle   = '';
	var actAsUIWindow_windowID      = 'UIWindow';
	var actAsUIWindow_windowContent = '';
	var actAsUIWindow_windowState   = {};
	
	this.getWindowContent = function(){
		return actAsUIWindow_windowContent;
	};
	
	this.setWindowContent = function( content ){
		actAsUIWindow_windowContent = content;
		this.reDrawWindow();
	};
	
	this.setWindowID = function( ID ){
		actAsUIWindow_windowID = ID;
	};
	
	this.getWindowID = function(){
		return actAsUIWindow_windowID;
	};
	
	this.setWindowTitle = function( title ){
		actAsUIWindow_windowTitle = title;		
		this.getWindowUIDialogTitle().html( this.getWindowTitle() );		
	};
	
	this.getWindowTitle = function(){
		return actAsUIWindow_windowTitle;
	};
	
	this.getWindow = function(){
		return actAsUIWindow_window;
	};
	
	this.getWindowUIDialog = function(){
		if( this.getWindow() ){
			return this.getWindow().closest('.ui-dialog');
		}
		return $({});
	};
	
	this.getWindowUIDialogTitle = function(){
		return this.getWindowUIDialog().find('.ui-dialog-title');
	};
	
	this.getWindowUIDialogButtonSet = function(){
		return this.getWindowUIDialog().find('.ui-dialog-buttonpane .ui-dialog-buttonset');
	};
	
	this.showWindow = function( _options ){
		var editWindow = this.getWindow();
		if( editWindow ) this.closeWindow();
		
		var window = this;
		if( $('#'+this.getWindowID()).length !=0 ) throw new Error("Элемент с таким идентификатором уже существует!");
		
		var defOptions = {
			autoOpen: true,
			modal: true,			
			hide: 'fade',
			show: 'fade',
			close: function(){
				window.closeWindow( 'bNoCloseDialogCall' );
			}
		};
		
		var options = $.extend( defOptions, this.getWindowOptions( window ) );
		if( typeof _options != 'undefined' ) options = $.extend( options, _options );
		
		editWindow = $('<div class="actAsUIWindow-window '+this.getWindowClass()+'" style="'+this.getWindowStyle()+'" title="'+this.getWindowTitle()+'" id="'+this.getWindowID()+'"><div class="i-window-state ui-widget" style="display:none;"><div class="ui-state-highlight ui-corner-all state" style="width:auto;height:auto;padding:10px;"></div></div>'+this.getWindowContent()+'</div>').appendTo($('body'));
		editWindow.dialog( options );
		editWindow.data( 'actAsUIWindow_Instance', this );
		editWindow.find('.i-button').button();
		
		actAsUIWindow_window = editWindow;
		
		this.afterShowWindow();
		
	};
	
	this.closeWindow = function(bNoCloseDialogCall){		
		var _window = this.getWindow();
		if( !_window ) {
			this.afterCloseWindow();
			return;
		}
		if( typeof bNoCloseDialogCall == 'undefined' ) _window.dialog("close");
		if( _window ) _window.remove();        
		actAsUIWindow_window = false;
		this.afterCloseWindow();		
	};
	
	var bReDrawInAction = false; 
	
	this.reDrawWindowInAction = function(){
		return bReDrawInAction;
	};
	
	this.reDrawWindow = function(){
		if( this.reDrawWindowInAction() ) return;		
		bReDrawInAction = true;
		if( this.getWindow() ){
			this.closeWindow( 'noCloseDialogCall' );
			this.showWindow();			
		};		
		bReDrawInAction = false;
	};
	
	this.setWindowState = function( name, state ){
    	var managerState = actAsUIWindow_windowState;
    	managerState[name] = state;
    	actAsUIWindow_windowState = managerState;
    	this.fireEvent( 'WindowStateChange' );
    };
    
    this.getWindowState = function( name ){
    	var state = actAsUIWindow_windowState;
    	if( typeof name != 'undefined' ) state = state[name];
    	return state;
    };
    
    this.removeWindowState = function( name ){
    	if( typeof name == 'undefined' ){
    		actAsUIWindow_windowState = {};
    	}else{
    		var managerState = this.getWindowState();
    		delete managerState[name];
    		actAsUIWindow_windowState = managerState;
    	};
    	this.fireEvent( 'WindowStateChange' );
    };
    
    this.showWindowState = function(){
    	if( this.getWindow() ){
    		var state = this.getWindowState();
    		var result = [];
    		$.each( state, function( i, status ){
    			result.push( i+': '+status );
    		} );
    		if( result.length > 0 ){
    			this.getWindow().find('.i-window-state').show().find('.state').html( '<p>'+result.join('<br />')+'</p>' );
    		}else{
    			this.getWindow().find('.i-window-state').hide();
    		}
    	};
    };
	
	//=========Events========//
	
	this.getWindowOptions = function( _window ){
		return {};
	};
	
	this.fireEvent           = function(){}
	this.afterCloseWindow    = function(){};
	this.afterShowWindow     = function(){};
	this.getWindowClass      = function(){ return ''; };
	this.getWindowStyle      = function(){ return ''; };
	
}