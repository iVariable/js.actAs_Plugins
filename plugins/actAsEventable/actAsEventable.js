function actAsEventable(){
	
	this.log = function(){}; //REDEFINE SOMEWHERE
	
	var actAsEventable_callbacks = {};
	
	this.getRegisteredCallbacks = function(){
		return actAsEventable_callbacks;
	};
	
	this.registerEventCallback = function( namespace, event, callback ){
		
		if( arguments.length == 2 ){
			callback  = event;
			event     = namespace;
			namespace = 'all';			
		}
		
		this.log( 'actAsEventable', 'registerEventCallback', namespace, event, callback );
		
		if( typeof callback != 'function' ) throw new Error( 'callback must be valid function!' );
		if( typeof actAsEventable_callbacks[ event ] == 'undefined' ) actAsEventable_callbacks[ event ] = [];
		actAsEventable_callbacks[ event ].push([ namespace, callback ]);		
		
	};
	
	this.fireEvent = function( event ){
		event = 'on'+event;
        if( typeof actAsEventable_callbacks[ event ] == "undefined" ) return;
        for( i in actAsEventable_callbacks[ event ] ){
            if( actAsEventable_callbacks[event].hasOwnProperty( i ) ){                
                (actAsEventable_callbacks[event][i][1])( this, arguments );
                this.log( 'actAsEventable', 'fireEvent', event  );
            };
        };
	};
	
	this.unregisterEventCallback = function( namespace, event ){		
		if( typeof event != 'undefined' ){
			event = 'on'+event;
		}else{
			event = false;
		};
		this.log( 'actAsEventable', 'unregisterEventCallback', namespace, event );		
		for( var i in actAsEventable_callbacks ){
			if( actAsEventable_callbacks.hasOwnProperty(i) ){
				if( event && event != i ) continue;
				for( var j in actAsEventable_callbacks[i] ){
					if( actAsEventable_callbacks[i].hasOwnProperty(j) ){
						if( actAsEventable_callbacks[i][j][0] == namespace ){
							actAsEventable_callbacks[i].splice(j,1);
						};
					};
				};
			};
		};
	};
	
};

