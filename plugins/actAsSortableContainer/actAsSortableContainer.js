function actAsSortableContainer(){ //$.extend - выпилить??

	var actAsSortableContainer_container = {},
		actAsSortableContainer_size = 0,
		actAsSortableContainer_position2id = {},
		actAsSortableContainer_id2position = {};

	this.getContainer = function(){
		return actAsSortableContainer_container;
	};

	this.getContainerSize = function(){
		return actAsSortableContainer_size;
	}

	this.getNextEmptyContainerPosition = function(){
		var i = 1;
		while( typeof this.getContainer()[i] != 'undefined') i++;
		return i;
	};

	this.getContainerPositionToID = function(){
		return actAsSortableContainer_position2id;
	}
	this.addToContainer = function( element, position, id ){
		if( typeof id == 'undefined' ) id = String((new Date()).getTime())+String(Math.random())+String(Math.random());
		if( typeof actAsSortableContainer_id2position[ id ] != 'undefined' ) throw new Error('actAsSortableContainer: элемент с таким ID уже зарегистрирован в контейнере');

		if( typeof position == 'undefined' ) position = this.getNextEmptyContainerPosition();
		if( typeof this.getContainer()[ position ] != 'undefined' ) throw new Error('actAsSortableContainer: позиция '+position+' в контейнере уже занята');

		actAsSortableContainer_container[position] = element;
		actAsSortableContainer_size++;
		actAsSortableContainer_position2id[position] = id;
		actAsSortableContainer_id2position[id] = position;

		return position;
	};

	this.getContainerItemID = function(item){
		for( var position in actAsSortableContainer_container ){
			if( actAsSortableContainer_container.hasOwnProperty(position)
				&&
				typeof actAsSortableContainer_container[position] != 'undefined'
				&&
				actAsSortableContainer_container[position] === item
			){
				return this.getContainerItemIDByPosition(position);
			}
		}
		return undefined;
	};

	this.getContainerItemByID = function( id ){
		return this.getContainerItemByPosition( this.getContainerItemPositionByID(id) );
	};

	this.getContainerItemPositionByID = function(id){
		return actAsSortableContainer_id2position[id];
	};

	this.getContainerItemIDByPosition = function(position){
		return actAsSortableContainer_position2id[position];
	};

	this.getContainerItemByPosition = function(position){
		return this.getContainer()[position];
	};

	this.removeContainerItemByID = function( id ){
		return this.removeFromContainer( this.getContainerItemByID(id) );
	};

	this.removeFromContainer = function( item ){
		for( var position in actAsSortableContainer_container ){
			if( actAsSortableContainer_container.hasOwnProperty(position)
				&&
				typeof actAsSortableContainer_container[position] != 'undefined'
				&&
				actAsSortableContainer_container[position] === item
			){
				actAsSortableContainer_size--;
				var id = actAsSortableContainer_position2id[position];
				delete actAsSortableContainer_position2id[position];
				delete actAsSortableContainer_id2position[id];
				delete actAsSortableContainer_container[position];
			}
		}
	};

	this.emptyContainer = function(){
		actAsSortableContainer_container = {};
		actAsSortableContainer_size = 0;
		actAsSortableContainer_position2id = {};
		actAsSortableContainer_id2position = {};
	};

	this.moveContainerItemFromTo = function( startPos, endPos ){
		if(startPos == endPos) return;
		var startElem = this.getContainerItemByPosition( startPos );
		if( typeof startElem == 'undefined' ) throw new Error( 'actAsSortableContainer: элемент не найден' );
		var endElem = this.getContainerItemByPosition( endPos );

		var id = this.getContainerItemIDByPosition(startPos);

		if( typeof endElem == 'undefined' ){
			this.removeContainerItemByID(id);
			this.addToContainer( startElem, endPos, id );
		}else{
			var endID = this.getContainerItemIDByPosition(endPos);

			this.removeContainerItemByID(id);
			this.removeContainerItemByID(endID);

			this.addToContainer( startElem, endPos, id );
			this.addToContainer( endElem, startPos, endID );
		}
	}

	this.moveContainerItemWithIDTo = function( id, endPos ){
		return this.moveContainerItemFromTo(this.getContainerItemPositionByID(id), endPos);
	}

}