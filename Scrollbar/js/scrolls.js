var article = document.querySelector(".article"), // 可滚动的元素
	scrollBar = document.querySelector(".scroll-bar"), // 滚动条容器
	scrollBarControl = scrollBar.querySelector(".scroll-bar-control"), // 滚动条控制器 

	mousedown = {}, // 记录鼠标按下的位置
	maxRange, // 用于计算可拖动的最大范围
	
	scroll = false; // 是否滚动
	scrollBarControlOffsetTop = 0; // 控制条距离控制器的高度

// Functions................................................................................................................

	// 设置控制条距离控制器的高度，可拖动的最大范围
	function recalc(){
		// 滚动条内部控制器的高度 = 滚动条限制高度 * ( 滚动条限制高度 / 正文可滚动的范围 ) 
		scrollBarControl.style.height = scrollBar.clientHeight * (scrollBar.clientHeight / article.scrollHeight) + "px";

		// 可滚动的最大范围
		maxRange = scrollBar.clientHeight - scrollBarControl.clientHeight;

		// 控制条距离顶部的高度 = 正文滚动的高度 * 最大范围 / 正文的长度
		// scrollBarControl.style.top = (article.scrollTop * maxRange) / article.scrollHeight + 'px';
	}

// Event handler............................................................................................................

	// 当可滚动体发生滚动时
	article.onscroll = function(e){
		e.stopPropagation();

		// 滚动条内部控制器距离顶部的高度 = （ 正文滚动的高度 / 正文可滚动的范围 ）* 滚动条限制高度
		scrollBarControl.style.top = (article.scrollTop / article.scrollHeight) * scrollBar.clientHeight + "px";

	};


	scrollBarControl.onmousedown = function(e){
		e.preventDefault();
		mousedown.y = e.pageY;
		scrollBarControlOffsetTop = scrollBarControl.offsetTop;

		scroll = true;
	};

	document.onmousemove = function(e){
		e.preventDefault();

		if(scroll){

			// 控制器距离滚动条容器顶部的高度 = 鼠标滚动的高度差 + 鼠标按下时控制条距离顶部的高度
			var hh = (e.pageY - mousedown.y) + scrollBarControlOffsetTop;

			if(hh < 0){
				hh = 0;
			}else if(hh > maxRange){
				hh = maxRange;
			}

			// 设置控制条距离顶部的高度
			scrollBarControl.style.top = hh + "px";

			// 调整文章滚动的距离
			article.scrollTop = (hh / scrollBar.clientHeight) * article.scrollHeight;
		}else{
			scroll = false;
		}
	};

	document.onmouseup = function(e){
		scroll = false;
	};

	window.onresize = recalc;

// Initialization.......................................................................................

	recalc();