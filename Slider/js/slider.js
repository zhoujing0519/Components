function Slider(opts){
	this.wrap = opts.dom;
	this.list = opts.list;

	// 构造三部曲
	this.init();
	this.renderDOM();
	this.bindDOM();
}

Slider.prototype.init = function(){
	// 算出窗口长宽比
	this.ratio = window.innerHeight / window.innerWidth;

	// 屏幕的宽度
	this.scaleW = window.innerWidth;

	// 当前图片索引
	this.index = 0;
};

Slider.prototype.renderDOM = function(){
	var wrap = this.wrap,
		data = this.list,
		scale = this.scaleW,
		len = data.length;

	this.outer = document.createElement('ul');
	for(var i = 0; i < len; i++){
		var li = document.createElement('li'),
			item = data[i];

		li.style.width = scale + 'px';
		li.style['-webkit-transform'] = 'translate3d('+ (i * scale) +'px, 0, 0)';

		if(item){
			if(item['height'] / item['width'] > this.ratio){
				li.innerHTML = '<img height="'+ window.innerHeight +'" src="'+ item['src'] +'"/>';
			}else{
				li.innerHTML = '<img width="'+ window.innerWidth +'" src="'+ item['src'] +'"/>';
			}
		}

		this.outer.appendChild(li);
	}

	this.outer.style.width = scale + 'px';
	wrap.style.height = window.innerHeight + 'px';
	wrap.appendChild(this.outer);
};

Slider.prototype.bindDOM = function(){
	var self = this,

		scale = this.scaleW,
		outer = self.outer,
		len = self.list.length;

	outer.addEventListener('touchstart', startHandler, false);
	outer.addEventListener('touchmove', moveHandler, false);
	outer.addEventListener('touchend', endHandler, false);

	function startHandler(event){
		self.startX = event.touches[0].pageX;
		self.offsetX = 0;
		self.startTime = + new Date();
	}

	function moveHandler(event){
		event.preventDefault();

		var li_arr = outer.getElementsByTagName('li'),
			prev = self.index - 1,
			next = prev + 3;

		self.offsetX = event.touches[0].pageX - self.startX;

		for(var i = 0; i < next; i++){
			li_arr[i] && 
			(li_arr[i].style['-webkit-transform'] = 'translate3d(' + ((prev - self.index) * scale + self.offsetX) + 'px, 0, 0)');
		}
	}

	function endHandler(event){
		var boundary = scale / 6,
			endTime = + new Date(),
			li_arr = outer.getElementsByTagName('li');

		if(endTime - self.startTime > 800){
			if(self.offsetX >= boundary){
				// 进入上一页
				self.go('-1');
			}else if(self.offsetX < - boundary){
				// 进入下一页
				self.go('+1');
			}else{
				// 留在本页
				self.go('0');
			}
		}else{
			if(self.offsetX >= 50){
				// 进入上一页
				self.go('-1');
			}else if(self.offsetX < - 50){
				// 进入下一页
				self.go('+1');
			}else{
				// 留在本页
				self.go('0');
			}
		}

	}
};

Slider.prototype.go = function(n){
	var index = this.index,
		currentIndex,
		scale = this.scaleW,

		li_arr = this.outer.getElementsByTagName('li'),
		len = li_arr.length;

	if(typeof n === 'number'){
		currentIndex = index;
	}else if(typeof n === 'string'){
		currentIndex = index + n * 1;
	}

	// 当索引超出
	if(currentIndex > len - 1){
		currentIndex = len - 1;
	}else if(currentIndex < 0){
		currentIndex = 0;
	}

	this.index = currentIndex;

	li_arr[currentIndex]['-webkit-transition'] = 'transform 0.2s ease';

	li_arr[currentIndex].style['-webkit-transform'] = 'translate3d(0, 0, 0)';
	li_arr[currentIndex - 1] && li_arr[currentIndex - 1].style['-webkit-transform'] = 'translate3d(-'+ scale +'px, 0, 0)';
	li_arr[currentIndex + 1] && li_arr[currentIndex + 1].style['-webkit-transform'] = 'translate3d('+ scale +'px, 0, 0)';

};

var list = [
	{
		width: 580,
		height: 523,
		src: 'images/1.jpg'
	},{
		width: 580,
		height: 523,
		src: 'images/1.jpg'
	},{
		width: 580,
		height: 523,
		src: 'images/1.jpg'
	},{
		width: 580,
		height: 523,
		src: 'images/1.jpg'
	},
];

// 创建实例....................................................................
new Slider({
	'dom': document.getElementById('canvas'),
	'list': list
});