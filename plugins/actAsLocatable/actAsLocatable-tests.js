module('actAsLocatable');

test( 'locator check', 4, function(){
	
	ok( typeof window.actAsLocatable_Locator != 'undefined', 'Locator present');

	ok( typeof window.actAsLocatable_Locator.locateByID('unexistenedID') == 'undefined', 'unexistened resource' );
	
	var resource = {resource : 123};	
	window.actAsLocatable_Locator.addResource('id',resource);	
	equal( window.actAsLocatable_Locator.locateByID( 'id' ), resource, 'locateByID' );
	
	window.actAsLocatable_Locator.removeResource('id');
	ok( typeof window.actAsLocatable_Locator.locateByID('id') == 'undefined', 'removeResource' );
	
} );

test( 'getLocator', 7, function(){
	
	function locate(){
		actAsLocatable.apply(this, arguments);		
	};
	
	var oLoc1 = new locate(),
		sLocID1 = 'olo';
	
	notEqual( oLoc1.getLocatableID(), sLocID1, 'getLocatableID' );
	oLoc1.setLocatableID(sLocID1);
	equal( oLoc1.getLocatableID(), sLocID1, 'setLocatableID' );
	
	equal(oLoc1.getLocator(), window.actAsLocatable_Locator, 'getLocator()' );
	
	var oLoc2 = new locate(),
		sLocID2 = 'piu';
	
	raises(function(){
		oLoc2.setLocatableID( sLocID1 );
	},'identical locatableIDs');
	
	oLoc2.setLocatableID(sLocID2);
	
	equal( oLoc1.getLocator(), oLoc2.getLocator(), 'getLocator()' );
	
	equal( oLoc1.locateByID( sLocID2 ), oLoc2, 'locateByID' );
	
	equal( window.actAsLocatable_Locator.locateByID( sLocID1 ), oLoc1, 'locateByID from locator' );
		
} );