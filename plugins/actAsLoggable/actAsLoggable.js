function actAsLoggable(){
	
	/**
	 * 0 - none
	 * 1 - fatal
	 * 2 - warning
	 * 3 - log
	 * 4 - notice
	 */
	
	var actAsLoggable_log = [];
	var actAsLoggable_logLevel = 0;
	var actAsLoggable_namespace = '';
	
	this.setLogLevel = function( level ){
		actAsLoggable_logLevel = parseInt(level);
	};
	
	this.getLogLevel = function(){
		return actAsLoggable_logLevel;
	};
	
	this.setLogNamespace = function( namespace ){
		actAsLoggable_namespace = namespace;
	};
	
	this.getLogNamespace = function(){
		return actAsLoggable_namespace;
	};
	
	this.getLog = function(){
		var clone = [];
		for( var i in actAsLoggable_log ){
			if( actAsLoggable_log.hasOwnProperty(i) ){
				clone.push(actAsLoggable_log[i]);
			}
		}
		return clone;
	};
	
	this._log = function( level, msg ){
		level = parseInt( level );	
		var logEntry = {level:level, namespace:this.getLogNamespace(), msg: msg, object: this, date: new Date()};		
		if( this.getLogLevel() >= level ){
			actAsLoggable_log.push( logEntry  );
			if( typeof console != 'undefined' ) console.log( logEntry  );
		}
	};
		
	this.fatal = function(){		
		this._log( 1, arguments );
	};
	
	this.warn = function(){		
		this._log( 2, arguments );
	};
	
	this.log = function(){		
		this._log( 3, arguments );
	};
	
	this.notice = function(){		
		this._log( 4, arguments );
	};
	
	
	if( typeof window.actAsLoggable_setLogLevel != 'undefined' ){
		this.setLogLevel(window.actAsLoggable_setLogLevel);
	};
		
    
    this.setLogNamespace( this.constructor.name );
	
}