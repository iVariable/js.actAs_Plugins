var actAsLocatable_Locator = ( function(){
	
	var resources = {};
	
	return {
		
		addResource: function( id, resource ){
			id = String(id);
			if( typeof this.locateByID(id) != 'undefined' ) throw new Error('Попытка зарегистрировать ресурс в локаторе для уже зарегистрированного ID');
			resources[id] = resource;
		},
		
		removeResource: function( id ){
			resources[id] = undefined;
		},
		
		locateByID: function( id ){
			return resources[id];
		}
		
	};
	
} )();

function actAsLocatable(){
	
	var actAsLocatable_locatableID = String((new Date()).getTime())+String(Math.random()).replace(/\./g,'_')+String(Math.random()).replace(/\./g,'_')+String(Math.random()).replace(/\./g,'_');
	
	this.getLocator = function(){
		return window.actAsLocatable_Locator;
	};
	
	this.locateByID = function(id){
		return this.getLocator().locateByID( id );
	};
	
	this.setLocatableID = function(id){
		this.getLocator().addResource( id, this );
		this.getLocator().removeResource( this.getLocatableID() );
		actAsLocatable_locatableID = id;
	};
	
	this.getLocatableID = function(){
		return actAsLocatable_locatableID;
	};
	
	this.getLocator().addResource( this.getLocatableID(), this );
}