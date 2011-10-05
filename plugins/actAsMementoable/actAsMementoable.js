function actAsMementoable_Memento(type, memento){

	var _memento = undefined,
		_type = undefined;

	this.type = function( type ){
		if( typeof type != 'undefined' ){
			_type = type;
			this._type = _type;
		}
		return _type;
	};

	this.memento = function( memento ){
		if( typeof memento != 'undefined' ){
			_memento = memento;
			this._memento = _memento; //exposing properties for correct equiv
		}
		return _memento;
	};

	this.equal = function( memento ){
		if( !(memento instanceof actAsMementoable_Memento) ) return false;
		var equal = (this.type() === memento.type());
		/*console.log(this.memento(), memento.memento());
		if( this.type() == 'SD_PagesManager' ){
			var mem = this.memento(),
				mem2 = memento.memento();
				console.log(mem.textContent);
				console.log(mem2.textContent);
			$.each( mem, function( i ){
				console.log(i, equiv( mem[i], mem2[i]));
			} );
		}*/
		if( equal ){
			equal = equiv( this.memento(), memento.memento() );
		}
		return equal;
	};

	if( typeof type!= 'undefined' ) this.type(type);
	if( typeof memento!= 'undefined' ) this.memento(memento);

	/*======Equiv=====*/ //Забрал из qUnit

	var equiv = function () {

		var objectType = function( obj ) {
			if (typeof obj === "undefined") {
					return "undefined";

			// consider: typeof null === object
			}
			if (obj === null) {
					return "null";
			}

			var type = Object.prototype.toString.call( obj )
				.match(/^\[object\s(.*)\]$/)[1] || '';

			switch (type) {
					case 'Number':
							if (isNaN(obj)) {
									return "nan";
							} else {
									return "number";
							}
					case 'String':
					case 'Boolean':
					case 'Array':
					case 'Date':
					case 'RegExp':
					case 'Function':
							return type.toLowerCase();
			}
			if (typeof obj === "object") {
					return "object";
			}
			return undefined;
		};

	    var innerEquiv; // the real equiv function
	    var callers = []; // stack to decide between skip/abort functions
	    var parents = []; // stack to avoiding loops from circular referencing

	    // Call the o related callback with the given arguments.
	    function bindCallbacks(o, callbacks, args) {
	        var prop = objectType(o);
	        if (prop) {
	            if (objectType(callbacks[prop]) === "function") {
	                return callbacks[prop].apply(callbacks, args);
	            } else {
	                return callbacks[prop]; // or undefined
	            }
	        }
	    }

	    var callbacks = function () {

	        // for string, boolean, number and null
	        function useStrictEquality(b, a) {
	            if (b instanceof a.constructor || a instanceof b.constructor) {
	                // to catch short annotaion VS 'new' annotation of a declaration
	                // e.g. var i = 1;
	                //      var j = new Number(1);
	                return a == b;
	            } else {
	                return a === b;
	            }
	        }

	        return {
	            "string": useStrictEquality,
	            "boolean": useStrictEquality,
	            "number": useStrictEquality,
	            "null": useStrictEquality,
	            "undefined": useStrictEquality,

	            "nan": function (b) {
	                return isNaN(b);
	            },

	            "date": function (b, a) {
	                return objectType(b) === "date" && a.valueOf() === b.valueOf();
	            },

	            "regexp": function (b, a) {
	                return objectType(b) === "regexp" &&
	                    a.source === b.source && // the regex itself
	                    a.global === b.global && // and its modifers (gmi) ...
	                    a.ignoreCase === b.ignoreCase &&
	                    a.multiline === b.multiline;
	            },

	            // - skip when the property is a method of an instance (OOP)
	            // - abort otherwise,
	            //   initial === would have catch identical references anyway
	            "function": function () {
	                var caller = callers[callers.length - 1];
	                return caller !== Object &&
	                        typeof caller !== "undefined";
	            },

	            "array": function (b, a) {
	                var i, j, loop;
	                var len;

	                // b could be an object literal here
	                if ( ! (objectType(b) === "array")) {
	                    return false;
	                }

	                len = a.length;
	                if (len !== b.length) { // safe and faster
	                    return false;
	                }

	                //track reference to avoid circular references
	                parents.push(a);
	                for (i = 0; i < len; i++) {
	                    loop = false;
	                    for(j=0;j<parents.length;j++){
	                        if(parents[j] === a[i]){
	                            loop = true;//dont rewalk array
	                        }
	                    }
	                    if (!loop && ! innerEquiv(a[i], b[i])) {
	                        parents.pop();
	                        return false;
	                    }
	                }
	                parents.pop();
	                return true;
	            },

	            "object": function (b, a) {
	                var i, j, loop;
	                var eq = true; // unless we can proove it
	                var aProperties = [], bProperties = []; // collection of strings

	                // comparing constructors is more strict than using instanceof
	                if ( a.constructor !== b.constructor) {
	                    return false;
	                }

	                // stack constructor before traversing properties
	                callers.push(a.constructor);
	                //track reference to avoid circular references
	                parents.push(a);

	                for (i in a) { // be strict: don't ensures hasOwnProperty and go deep
	                    loop = false;
	                    for(j=0;j<parents.length;j++){
	                        if(parents[j] === a[i])
	                            loop = true; //don't go down the same path twice
	                    }
	                    aProperties.push(i); // collect a's properties

	                    if (!loop && ! innerEquiv(a[i], b[i])) {
	                        eq = false;
	                        break;
	                    }
	                }

	                callers.pop(); // unstack, we are done
	                parents.pop();

	                for (i in b) {
	                    bProperties.push(i); // collect b's properties
	                }

	                // Ensures identical properties name
	                return eq && innerEquiv(aProperties.sort(), bProperties.sort());
	            }
	        };
	    }();

	    innerEquiv = function () { // can take multiple arguments
	        var args = Array.prototype.slice.apply(arguments);
	        if (args.length < 2) {
	            return true; // end transition
	        }

	        return (function (a, b) {
	            if (a === b) {
	                return true; // catch the most you can
	            } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || objectType(a) !== objectType(b)) {
	                return false; // don't lose time with error prone cases
	            } else {
	                return bindCallbacks(a, callbacks, [b, a]);
	            }

	        // apply transition with (1..n) arguments
	        })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length -1));
	    };

	    return innerEquiv;

	}();

}

function actAsMementoable(){

	var actAsMementoable_storedMemento = new actAsMementoable_Memento();

	this.storeMemento = function( memento ){
		if( typeof memento == 'undefined' ){
			memento = this.saveMemento();
		};
		actAsMementoable_storedMemento = memento;
	};

	this.getStoredMemento = function(){
		return actAsMementoable_storedMemento;
	};

	this.saveMemento = function(){
		throw new Error('This function must be implemented!');
	};

	this.restoreMemento = function(){
		throw new Error('This function must be implemented!');
	};
}
