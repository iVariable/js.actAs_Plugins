module( 'actAsUIWindow' );

test( 'showWindow(), closeWindow(), redrawWindow()', 6, function(){
	
	function testActAsWindow( ID ){		
		actAsUIWindow.call( this, arguments );		
		this.setWindowID( ID );				
	};
	
	var ID = 'window';	
	var oWin = new testActAsWindow( ID );
	oWin.setWindowTitle( 'Привет мир!' );
	oWin.setWindowContent( '<div class="i-ololo">Вовка знатный тестер</div>' );
	
	ok( $('#'+ID).length == 0, 'No window at start' );
	ok( $('.i-ololo').length == 0, 'No window content' );
	
	oWin.showWindow();	
	ok( $('#'+ID).length == 1, 'showWindow()' );
	ok( $('.i-ololo').length == 1, 'Window content' );
	equal( oWin.getWindowUIDialogTitle().html(), 'Привет мир!', 'Title set' );
	
	oWin.closeWindow();	
	ok( $('#'+ID).length == 0, 'closeWindow()' );
	
} );

test( 'reDraw on events', 5, function(){
	
	function testActAsWindow_events( ID ){		
		actAsUIWindow.call( this, arguments );		
		this.setWindowID( ID );
	};
	
	var ID = 'window1';	
	var oWin = new testActAsWindow_events( ID );
	oWin.setWindowTitle( 'Привет мир!' );
	oWin.setWindowContent( '<div class="i-ololo">Вовка знатный тестер</div>' );

	oWin.showWindow();
	
	ok( $('.i-ololo').length == 1, 'Window content' );
	equal( oWin.getWindowUIDialogTitle().html(), 'Привет мир!', 'Title set' );
	
	oWin.setWindowTitle( 'Новый титл' );
	equal( oWin.getWindowUIDialogTitle().html(), 'Новый титл', 'New title set' );
	
	oWin.setWindowContent( '<div class="i-ololo_new">Вовка знатный тестер</div>' );
	
	ok( $('.i-ololo').length == 0, 'old window content' );
	ok( $('.i-ololo_new').length == 1, 'new window content' );
	
	oWin.closeWindow();
	
} );

test( 'window options && callbacks', 4, function(){
	function testActAsWindow_options( ID ){		
		actAsUIWindow.call( this, arguments );		
		this.setWindowID( ID );
		
		this.afterCloseWindow = function(){
			this.closeCalled = true;
		};
		
		this.afterShowWindow = function(){
			this.showCalled = true;
		};
	};
	
	
	var ID = 'window2';	
	var oWin = new testActAsWindow_options( ID );
	oWin.setWindowTitle( 'Привет мир!' );
	oWin.setWindowContent( '<div class="i-ololo">Вовка знатный тестер</div>' );
	
	oWin.showWindow();
	
	ok( oWin.getWindowUIDialogButtonSet().find('.ui-button').length == 0, 'no buttons' );
	equal( oWin.showCalled, true, 'afterShowWindow()' );

	oWin.getWindowOptions = function(window){
		var element = this;
		return {
			buttons: {
				"Закрыть": function(){
					element.closeWindow();
				}
			}
		};
	};
	
	oWin.reDrawWindow();
	
	ok( oWin.getWindowUIDialogButtonSet().find('.ui-button').length == 1, 'one button' );
	
	oWin.closeWindow();
	equal( oWin.closeCalled, true, 'afterCloseWindow()' );
	
} );