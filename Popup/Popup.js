;(function(win, doc){
	// 弹窗构造器
	function Popup(){
		this.config = {
			width: 300,
			title: '系统消息',
			content: '',
			confirm: '确定',
			handler4ConfirmButton: null,
			handler4CloseButton: null,
			hasCloseButton: false
		};
	}

	// 弹窗的方法
	Popup.prototype = {
		// 提示文字
		alert: function(config){
			var popupAlert = doc.getElementById('popup-alert');

			if(popupAlert) return; // 如果已经存在弹窗，直接退出

			// 扩展参数
			var _config = extend(this.config, config),
				winW = doc.documentElement.clientWidth,
				winH = doc.documentElement.clientHeight,
				self = this,

			// 创建DOM
				_box = doc.createElement('div'), // 弹窗盒子
				_title = doc.createElement('div'), // 弹窗标题
				_content = doc.createElement('div'), // 弹窗内容
				_confirm = doc.createElement('button'); // 确定按钮

			// 设置Id
			_box.id = 'popup-alert';

			// 设置类名
			_box.className = 'popup-box';
			_title.className = 'popup-title';
			_content.className = 'popup-content';
			_confirm.className = 'popup-confirm';

			// 设置内容
			_title.innerHTML = _config.title;
			_content.innerHTML = _config.content;
			_confirm.innerHTML = _config.confirm;

			// 添加元素
			_box.appendChild(_title);
			_box.appendChild(_content);
			_box.appendChild(_confirm);

			// 设置大小
			_box.style.width = _config.width + 'px';

			// 设置位置
			_box.style.left = (winW - _config.width) / 2 + 'px';
			_box.style.top = (winH - _box.clientHeight) / 2 + 'px';

			// 绑定事件
				// 点击确定，移除弹窗
				_confirm.addEventListener('click', function(e){
					self.config.handler4ConfirmButton && self.config.handler4ConfirmButton();
					doc.body.removeChild(_box);
				}, false);

				// 拖动标题，移动弹窗位置
				_title.addEventListener('mousedown', _start, false);
				doc.addEventListener('mousemove', _move, false);
				doc.addEventListener('mouseup', _end, false);

				function _start(e){
					e.preventDefault();
					_box.movable = true;
					_box.mousedown = {
						x: e.clientX - _box.offsetLeft,
						y: e.clientY - _box.offsetTop
					};

				}

				function _move(e){
					if(_box.movable){
						var curLeft = e.clientX - _box.mousedown.x,
							curTop = e.clientY - _box.mousedown.y;

						if(curLeft < 0){
							curLeft = 0;
						}else if(curLeft > winW - _box.clientWidth){
							curLeft = winW - _box.clientWidth;
						}

						if(curTop < 0){
							curTop = 0;
						}else if(curTop > winH - _box.clientHeight){
							curTop = winH - _box.clientHeight;
						}

						_box.style.left = curLeft + 'px';
						_box.style.top = curTop + 'px';
					}
				}

				function _end(e){
					_box.movable = false;
				}

			// 当存在关闭按钮时
			if(_config.hasCloseButton){
				var closeButton = doc.createElement('button');

				// 设置类名
				closeButton.className = 'popup-close';
				closeButton.innerHTML = 'X';

				// 添加元素
				_box.appendChild(closeButton);

				// 绑定事件
				closeButton.addEventListener('click', function(e){
					_config.handler4CloseButton && _config.handler4CloseButton();
					doc.body.removeChild(_box);
				}, false);
			}
			
			// 将弹窗盒子添加到body中
			doc.body.appendChild(_box);
		}
	};


	win.Popup = Popup;
})(window, document);

// 对象扩展
function extend(origin, config){
	for(var key in config){
		origin[key] = config[key];
	}

	return origin;
}