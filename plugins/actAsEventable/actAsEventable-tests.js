module( 'actAsEventable' );

test("Events bindings", 21, function(){
	
	function testEventable(){		
		actAsEventable.call( this, arguments );		
	};
	
	testEventable.prototype.fire = function(){
		this.fireEvent( 'Fire', 1, 'hello', ['world', '!'], arguments[0] );
	};
	
	var oTester = new testEventable();
	var oTester2 = new testEventable();
	
	var elem1 = false;
	var elem2 = false;
	var elem3 = false;
	
	var args1 = [];
	var args2 = [];
	var args3 = [];
	
	oTester.registerEventCallback( 'First', 'onFire', function( elem, args ){ elem1 = elem; args1 = args; } );
	oTester.registerEventCallback( 'Second', 'onFire', function( elem, args ){ elem2 = elem; args2 = args; } );
	oTester2.registerEventCallback( 'Second', 'onFire', function( elem, args ){ elem3 = elem; args3 = args; } );
	
	oTester.fire( 'ihhha!' );
	
	equal( elem1, oTester, 'First Callback: caller' );
	equal( args1[0], 'onFire', 'First Callback: args' );
	equal( args1[1], 1, 'First Callback: args' );
	equal( args1[2], 'hello', 'First Callback: args' );
	equal( args1[4], 'ihhha!', 'First Callback: args' );
		
	equal( elem2, oTester, 'Second Callback: caller' );
	same( args2[0], 'onFire', 'Second Callback: args' );
	
	equal( elem3, false, 'Third Callback: caller' );
	same( args3, [], 'Third Callback: args' );
	
	var elem1 = false;
	var elem2 = false;
	var elem3 = false;
	
	var args1 = [];
	var args2 = [];
	var args3 = [];
	
	oTester.unregisterEventCallback('First');
	
	oTester.fire( 'ihhha!' );
	
	equal( elem1, false, 'First Callback: caller' );
	same( args1, [], 'First Callback: args' );
	
	equal( elem2, oTester, 'Second Callback: caller' );
	same( args2[0], 'onFire', 'Second Callback: args' );
	
	oTester.unregisterEventCallback('Second', 'Dance');
	
	var elem1 = false;
	var elem2 = false;
	
	var args1 = [];
	var args2 = [];
	
	oTester.fire( 'ihhha!' );
	
	equal( elem1, false, 'First Callback: caller' );
	same( args1, [], 'First Callback: args' );
	
	equal( elem2, oTester, 'Second Callback: caller' );
	same( args2[0], 'onFire', 'Second Callback: args' );
	
	oTester.unregisterEventCallback('Second', 'Fire');
	
	var elem1 = false;
	var elem2 = false;
	
	var args1 = [];
	var args2 = [];
	
	oTester.fire( 'ihhha!' );
	
	equal( elem1, false, 'First Callback: caller' );
	same( args1, [], 'First Callback: args' );
	
	equal( elem2, false, 'Second Callback: caller' );
	same( args2, [], 'Second Callback: args' );
	
	
});