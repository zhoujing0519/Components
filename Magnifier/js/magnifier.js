var magnifierWrap = _$('magnifier-wrap'),
	smallBox = _$('small-box'),
	floatBox = _$('float-box'),
	mask = _$('mask'),
	bigBox = _$('big-box'),
	bigImage = bigBox.getElementsByTagName('img')[0];

// Functions..........................................................

	// 获取DOM对象
	function _$(id){
		return document.getElementById(id);
	}

	// 鼠标移入事件
	function mouseoverHandler(){
		floatBox.style.display = 'block';
		bigBox.style.display = 'block';
	}

	// 鼠标移出事件
	function mouseoutHandler(){
		floatBox.style.display = 'none';
		bigBox.style.display = 'none';
	}

	// 鼠标移动事件
	function mousemoveHandler(e){
		e = e || window.event;

		var left = e.clientX - magnifierWrap.offsetLeft - smallBox.offsetLeft - floatBox.offsetWidth / 2,
			top = e.clientY - magnifierWrap.offsetTop - smallBox.offsetTop - floatBox.offsetHeight / 2,
			percentX,
			percentY;

		if(left < 0){
			left = 0;
		}else if(left > smallBox.offsetWidth - floatBox.offsetWidth){
			left = smallBox.offsetWidth - floatBox.offsetWidth;
		}

		if(top < 0){
			top = 0;
		}else if(top > smallBox.offsetHeight - floatBox.offsetHeight){
			top = smallBox.offsetHeight - floatBox.offsetHeight;
		}

		floatBox.style.left = left + 'px';
		floatBox.style.top = top + 'px';

		percentX = left / (smallBox.offsetWidth - floatBox.offsetWidth);
		percentY = top / (smallBox.offsetHeight - floatBox.offsetHeight);

		bigImage.style.left = - percentX * (bigImage.offsetWidth - bigBox.offsetWidth) + 'px';
		bigImage.style.top = - percentY * (bigImage.offsetHeight - bigBox.offsetHeight) + 'px';
	}

// Event handlers.....................................................

	mask.addEventListener('mouseover', mouseoverHandler, false);
	mask.addEventListener('mousemove', mousemoveHandler, false);
	mask.addEventListener('mouseout', mouseoutHandler, false);
