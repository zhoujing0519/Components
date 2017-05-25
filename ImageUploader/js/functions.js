// 类名操作................................................................................................
	
	// 查找类名元素
	function getElementsByClass(node, className){
		if(node.getElementsByClassName){
			return node.getElementsByClassName(className);
		}else{
			var results = new Array(),
				elements = node.getElementsByTagName('*');
			forEach(elements, function(element, index){
				if(element.className.indexOf(className) != -1){
					results[results.length] = element;	
				}
			});
		}
	}

	// 类名新增
	function addClass(element, className){
		if(element.classList){
			element.classList.add(className);
		}else{
			element.className += ' ' + className;
		}

		return element;
	}

	// 类名删除
	function removeClass(element, className){
		if(element.classList){
			element.classList.remove(className);
		}else{
			element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}

		return element;
	}

	// 类名包含
	function hasClass(element, className){
		if(element.classList){
			return element.classList.contains(className);
		}else{
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
		}
	}

// 数组操作.........................................................................................................

	// 遍历数组
	function forEach(elements, callback){
	    if([].forEach){
	        [].forEach.call(elements, callback);
	    }else{
	        for(var i = 0; i < elements.length; i++){
	            callback(elements[i], i);
	        }
	    }
	}

// 兄弟元素..........................................................................................................
	
	// 所有其他兄弟元素数组，以及当前索引
	function siblings(obj){
	    var self = obj,
		    arr = [],
		    index,
		    p = self.parentNode.children;

	    for(var i = 0, pl = p.length; i < pl; i++){
	        if(p[i] !== self){
	        	arr.push(p[i]);
	        }else{
	        	index = i;
	        }
	    }

	    return {
	    	arr: arr,
	    	index: index
	    };
	}

	// 遍历至指定父元素
	function findParent(obj, target){
		while(obj !== target){

			if(obj == null){
				return false;
			}

			obj = obj.parentNode;
		}

		return obj;
	}

// 事件操作..........................................................................................................
	
	// 绑定事件
	function addEvent(element, type, handle, capture){
		if(element.addEventListener){
			element.addEventListener(type, handle, capture);
		}else if(element.attachEvent){
			element.attachEvent('on' + type, handle);
		}else{
			element['on' + type] = handle;
		}
	}

	// 移除事件
	function removeEvent(element, type, handle, capture){
		if(element.removeEventListener){
			element.removeEventListener(element, type, handle, capture);
		}else if(element.detachEvent){
			element.detachEvent('on' + type, handle);
		}else{
			element['on' + type] = null;
		}
	}

	// 事件代理
	function eventBroker(event, className, fn){
		var event = event || window.event,
			target = event.target;

		while(target){
			if(target && target.nodeName == '#document'){
				break;
			}else if(hasClass(target, className)){
				fn();
				break;
			}

			target = target.parentNode;
		}
	}

	// 触发事件
	function trigger(element, type){
		if(document.createEvent){
			var event = document.createEvent('HTMLEvents');
				event.initEvent(type, true, false);
				element.dispatchEvent(event);
		}else{
			element.fireEvent('on' + type);
		}
	}