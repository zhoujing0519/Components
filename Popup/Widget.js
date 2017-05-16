;(function(win, doc){
	// 组件构造器
	function Widget(){
		this.boundingBox = null; // 最外层容器
		this.handlers = {};
	}

	// 原型
	Widget.prototype = {
		// 添加自定义事件
		on: function(type, handler){
			if(typeof this.handlers[type] == 'undefined'){
				this.handlers[type] = [];
			}

			this.handlers[type].push(handler);
			return this; // 支持链式调用
		},

		// 触发自定义事件
		fire: function(type, data){
			if(this.handlers[type] instanceof Array){
				var handlers = this.handlers[type];

				for(var i = 0, len = handlers.length; i < len; i++){
					handlers[i](data);
				}
			}
		},

		// 添加DOM节点
		renderUI: function(){},

		// 监听事件
		bindUI: function(){},

		// 初始化组件属性
		syncUI: function(){},

		// 渲染组件
		render: function(container){
			this.renderUI();
			this.handlers = {}; // 将事件数组清空，但是已经绑定的事件并没有解绑
			this.bindUI();
			this.syncUI();
			(container || doc.body).appendChild(this.boundingBox);
		},

		// 销毁前的处理函数
		destructor: function(){},

		// 销毁组件
		destroy: function(){
			this.destructor();
			// this.boundingBox.off();
			doc.body.removeChild(this.boundingBox);
		},
	};

	win.Widget = Widget;
})(window, document);