module('actAsSortableContainer');

test( 'addToContainer, removeFromContainer', 17, function(){

	function testContainer(){
		actAsSortableContainer.apply(this, arguments);
	}

	var oContainer = new testContainer(),
		item1 = '1',
		item2 = {item:1},
		item3 = 3,
		item4 = [1,5,23];

	same( oContainer.getContainer(), {}, 'empty container by default');
	equal( oContainer.getContainerSize(), 0, 'getContainerSize()' );

	var pos1 = oContainer.addToContainer( item1 );
	equal( oContainer.getContainer()['1'], item1, 'addToContainer' );
	equal( oContainer.getContainerSize(), 1, 'getContainerSize()' );
	equal( pos1, 1, 'addToContainer returns position' );

	oContainer.removeFromContainer( item1 );
	same( oContainer.getContainer(), {}, 'removeFromContainer');
	equal( oContainer.getContainerSize(), 0, 'getContainerSize()' );

	oContainer.addToContainer( item4, 4 );
	equal( oContainer.getContainerSize(), 1, 'getContainerSize()' );
	same( oContainer.getContainer(), {4: item4}, 'addToContainer() by position' );

	oContainer.addToContainer( item2, 2 );
	equal( oContainer.getContainerSize(), 2, 'getContainerSize()' );
	same( oContainer.getContainer(), {2:item2, 4: item4}, 'addToContainer() by position' );

	oContainer.emptyContainer();
	equal( oContainer.getContainerSize(), 0, 'emptyContainer()' );

	oContainer.addToContainer( item4, 4 );
	oContainer.addToContainer( item2, 2 );

	raises( function(){
		oContainer.addToContainer( item1, 2 );
	}, 'addToContainer to occupied position' );

	oContainer.addToContainer(item1);
	equal( oContainer.getContainerSize(), 3, 'getContainerSize()' );
	equal( oContainer.getContainer()['1'], item1, 'addToContainer to first empty position' );

	var pos3 = oContainer.addToContainer(item3);
	equal( oContainer.getContainerSize(), 4, 'getContainerSize()' );
	equal( pos3, 3, 'addToContainer returns position' );

} );

test( 'item id tests',function(){
	function testContainer(){
		actAsSortableContainer.apply(this, arguments);
	}

	var oContainer = new testContainer(),
		item1 = '1',
		item2 = {item:1},
		item3 = 3,
		item4 = [1,5,23],
		item4ID = 'ololoid';

	oContainer.addToContainer( item1 );
	var id = oContainer.getContainerItemID( item1 );
	ok( typeof id != 'undefined', 'getContainerItemID' );

	equal( oContainer.getContainerItemByID(id), item1 );

	oContainer.addToContainer( item4, 4, item4ID );

	equal( oContainer.getContainerItemByID( item4ID ), item4, 'addToContainer with ID && getContainerItemByID()' );

	raises(function(){
		oContainer.addToContainer(item2, undefined,item4ID);
	},'dublicate ID');

	ok( oContainer.getContainerSize() == 2 );
	oContainer.removeContainerItemByID( item4ID );
	equal( oContainer.getContainerSize() , 1 );

	ok( typeof oContainer.getContainerItemByPosition(4) == 'undefined', 'getContainerItemByPosition() && removeContainerItemByID' );



} );

test('moving container items', function(){
	function testContainer(){
		actAsSortableContainer.apply(this, arguments);
	}

	var oContainer = new testContainer(),
		item1 = '1',
		item2 = {item:1},
		item3 = 3,
		item4 = [1,5,23];

	oContainer.addToContainer( item1 );
	oContainer.addToContainer( item2 );
	oContainer.addToContainer( item3 );
	oContainer.addToContainer( item4 );

	oContainer.moveContainerItemFromTo(4,1);
	same( oContainer.getContainer(), {1: item4, 2:item2, 3: item3, 4: item1}, 'moveContainerItemFromTo() swap elements' );

	oContainer.moveContainerItemFromTo(2, 7);

	same( oContainer.getContainer(), {1: item4, 3: item3, 4: item1, 7:item2 }, 'moveContainerItemFromTo() free position' );

	oContainer.moveContainerItemWithIDTo( oContainer.getContainerItemID(item3), 2 );

	same( oContainer.getContainer(), {1: item4, 2: item3, 4: item1, 7:item2 }, 'moveContainerItemWithIDTo() free position' );

	oContainer.moveContainerItemWithIDTo( oContainer.getContainerItemID(item3), 4 );

	same( oContainer.getContainer(), {1: item4, 4: item3, 2: item1, 7:item2 }, 'moveContainerItemWithIDTo() closed position' );


});

