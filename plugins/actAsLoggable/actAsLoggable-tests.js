module( 'actAsLoggable' );

test( 'log(), setLogLevel(), getLogLevel()', 13 ,function(){
	
	function testActAsLoggable(){
		
		actAsLoggable.apply( this, arguments );
		
		this.setLogNamespace( 'testActAsLoggable' );
		
		this.doIt = function(){
			this.log( 'test', ['doIt', arguments] );
		};
		
	};
	
	var test = new testActAsLoggable();
	
	equal( test.getLogLevel(), 0, 'getLogLevel()' );
	test.setLogLevel(5);
	equal( test.getLogLevel(), 5, 'setLogLevel()' );
	
	window.actAsLoggable_setLogLevel = 3;	
	var test = new testActAsLoggable();	
	equal( test.getLogLevel(), 3, 'setLogLevel() globally throught window.actAsLoggable_setLogLevel' );
	
	test.doIt( 'piu' );			
	equal( test.getLog().length,1, 'log()' );
	
	test.notice( 'Ololo notice' );
	equal( test.getLog().length,1, 'notice()' );
	
	test.setLogLevel(5);
	
	test.notice( 'notice' );
	equal( test.getLog().length,2, 'notice() with higher loglevel' );
	
	test.fatal( 'fatal' );
	equal( test.getLog().length,3, 'fatal()' );
	
	test.log( 'привет мир!' );
	equal( test.getLog().length,4, 'log()' );
	
	var lastLog = test.getLog().pop();
	
	equal( test.getLog().length,4, 'getLog() returns clone. Can\'t modify inner log' );
	
	same( lastLog.msg[0], 'привет мир!', 'msg equal' );
	equal( lastLog.object, test, 'test equal' );
	equal( lastLog.level,3, 'loglevel equal' );
	equal( lastLog.namespace, 'testActAsLoggable', 'namespace equal' );
	
	
} );