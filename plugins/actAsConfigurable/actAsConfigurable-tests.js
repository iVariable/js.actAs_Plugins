module( 'actAsConfigurable' );

test( 'Configuration check', function(){
	
	function testConfiguration(){
		
		actAsConfigurable.call( this, arguments );
		
		this.setDoIt = function(){
			this.setOptions( { reallyDo: true } );
		};
		
	};
	
	
	
	testConfiguration.prototype.doIt = function(){
		var doIt = this.getOptions().reallyDo;
		if( typeof doIt != 'undefined' && doIt ){
			return true;
		}else{
			return false;
		}
	};
	
	var oTester = new testConfiguration();
	var oTester2 = new testConfiguration();
	
	same( oTester.getOptions(), {}, 'getOptions() empty by default' );
	
	equals( oTester.doIt(), false, 'Not set yet' );
	
	oTester.setDoIt();	
	equals( oTester.doIt(), true, 'inner setOptions' );
	
	oTester.setOptions( {reallyDo: false} );
	
	equals( oTester.doIt(), false, 'outer setOptions' );
	
	same( oTester2.getOptions(), {}, 'getOptions() empty by default in second object' );
	
} );

test( 'Global settings', 3, function(){	

	function testConfiguration2(){		
		actAsConfigurable.call( this, arguments );		
	};
	
	var obj = new testConfiguration2();
	
	same( obj.getOptions(), {}, 'empty options by default' );
	
	window.actAsConfigurable_testConfiguration2 = {
		'hello': 'world'
	};
	
	var obj2 = new testConfiguration2();
	same( obj2.getOptions(), { 'hello': 'world' }, 'global options set' );
	same( obj.getOptions(), {}, 'empty options by default' );
	
} );