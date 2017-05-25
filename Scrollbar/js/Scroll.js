function Scroll(opts){
	this.article = opts.article;
	this.scrollbar = opts.scrollbar;
	this.controller = opts.controller;

	this.init();
}

// 初始化
Scroll.prototype.init = function(){
	this.mousedown = {};
	this.maxRange = 0;
	this.isScroll = false;
	this.controllerOffsetTop = 0;

	this.recalc(); // 重置
	this.mouseEvent(); // 绑定事件
};

// 鼠标事件
Scroll.prototype.mouseEvent = function(){
	var self = this,
		article = this.article,
		scrollbar = this.scrollbar,
		controller = this.controller,
		mousedown = this.mousedown,
		maxRange = this.maxRange,
		controllerOffsetTop = this.controllerOffsetTop,
		isScroll = this.isScroll;

	// 当可滚动体发生滚动时
	article.addEventListener('scroll', function(e){
		e.stopPropagation();

		// 滚动条内部控制器距离顶部的高度 = （ 正文滚动的高度 / 正文可滚动的范围 ）* 滚动条限制高度
		controller.style.top = (article.scrollTop / article.scrollHeight) * scrollbar.clientHeight + "px";
	}, false);

	controller.addEventListener('mousedown', function(e){
		e.preventDefault();
		mousedown.y = e.pageY;
		controllerOffsetTop = controller.offsetTop;

		isScroll = true;
	}, false);

	document.addEventListener('mousemove', function(e){
		e.preventDefault();

		if(isScroll){

			// 控制器距离滚动条容器顶部的高度 = 鼠标滚动的高度差 + 鼠标按下时控制条距离顶部的高度
			var hh = (e.pageY - mousedown.y) + controllerOffsetTop;

			if(hh < 0){
				hh = 0;
			}else if(hh > maxRange){
				hh = maxRange;
			}

			// 设置控制条距离顶部的高度
			controller.style.top = hh + "px";

			// 调整文章滚动的距离
			article.scrollTop = (hh / scrollbar.clientHeight) * article.scrollHeight;
		}else{
			isScroll = false;
		}
	}, false);

	document.addEventListener('mouseup', function(e){
		isScroll = false;
	}, false);

	window.addEventListener('resize', function(){
		self.recalc();
	}, false);
};

// 重置
Scroll.prototype.recalc = function(){
	// 滚动条内部控制器的高度 = 滚动条限制高度 * ( 滚动条限制高度 / 正文可滚动的范围 ) 
	this.controller.style.height = this.scrollbar.clientHeight * (this.scrollbar.clientHeight / this.article.scrollHeight) + "px";

	// 可滚动的最大范围
	this.maxRange = this.scrollbar.clientHeight - this.controller.clientHeight;
};

// 重置滚动条控制器距离顶部的高度
Scroll.prototype.setControllerOffsetTop = function(e){
	// 滚动条内部控制器距离顶部的高度 = （ 正文滚动的高度 / 正文可滚动的范围 ）* 滚动条限制高度
	this.controller.style.top = (this.article.scrollTop / this.article.scrollHeight) * this.scrollbar.clientHeight + "px";
};
