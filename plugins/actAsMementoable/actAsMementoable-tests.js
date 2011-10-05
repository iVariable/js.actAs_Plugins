module('ActAsMementoable');

test( 'setters/getters', 4, function(){
	var mem = new actAsMementoable_Memento();
	
	ok( typeof mem.memento() == 'undefined', 'Initial memento = undefined' );
	ok( typeof mem.type() == 'undefined', 'Initial type = undefined' );
	
	var memento = { a: 5 };
	var type = 'realMem!';
	
	mem.memento(memento);
	mem.type(type);
	
	equal( mem.memento(), memento, 'memento set' );
	equal( mem.type(), type, 'type set' );
	
} );

test('equal', function(){
	
	var memento1 = new actAsMementoable_Memento(),
		memento2 = new actAsMementoable_Memento(),
		memento3 = new actAsMementoable_Memento();
	
	var mem1 = {a: '5'},
		mem2 = {a: '5'},
		mem3 = {b:7};
	
	memento1.memento(mem1);
	memento2.memento(mem2);
	memento3.memento(mem3);
	
	memento1.type('same');
	memento2.type('same');
	memento3.type('different');
	
	ok( memento1.equal(memento2), 'equal mementos' );
	ok( memento2.equal(memento1), 'equal mementos' );
	
	ok( !memento1.equal(memento3), 'diff mementos' );
	ok( !memento3.equal(memento1), 'diff mementos' );
	
	memento2.type('diff');
	
	ok( !memento1.equal(memento2), 'different types');

});

test('actAsMementoable objects', 4, function(){
	function mementoable(){
		actAsMementoable.apply(this, arguments);
	}
	
	var oMementoable = new mementoable();
	
	ok(typeof oMementoable.restoreMemento == 'function', 'restoreMememnto present');
	ok(typeof oMementoable.saveMemento == 'function', 'saveMememnto present');
	
	raises(function(){
		oMementoable.restoreMemento();
	}, 'no implemetation for restoreMemento');
	
	raises(function(){
		oMementoable.saveMemento();
	}, 'no implemetation for saveMemento');
	
	function mementoable2(){
		actAsMementoable.apply(this, arguments);
		
		this.saveMemento = function(){
			return new actAsMementoable_Memento('memento',{a:1});
		};
		
		this.restoreMemento = function( memento ){
			//some implemetation here
		};
	}
	
	var oMem2 = new mementoable2();
	//no exceptions
	var mem = oMem2.saveMemento();
	oMem2.restoreMemento(mem);
});

test( 'storedMemento', 1, function(){
	
	function mementoable(){
		actAsMementoable.apply(this, arguments);
		
		this.saveMemento = function(){
			return new actAsMementoable_Memento('memento',{a:String(Math.random())});
		};
		
		this.restoreMemento = function( memento ){
			//some implemetation here
		};
	}
	
	var oMem = new mementoable();
	oMem.storeMemento();
	ok( !oMem.saveMemento().equal(oMem.getStoredMemento()), 'not equal' );
	
} );