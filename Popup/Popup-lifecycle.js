;(function(win, doc){
	// 弹窗构造器
	function Popup(){
		// 默认配置参数
		this.config = {
			// 公共
			width: 300, // 弹窗默认宽度
			skinClassName: null, // 弹窗默认皮肤样式类名
			title: '系统消息', // 弹窗标题
			content: '', // 弹窗内容
			hasMask: true, // 是否模态
			draggable: true, // 是否可以拖动
			hasCloseButton: false, // 是否包含关闭按钮
			handler4CloseButton: null, // 关闭按钮触发的事件

			// Alert--警告窗
			text4AlertButton: '确定', // 默认按钮文字
			handler4AlertButton: null, // 点击确定触发的事件

			// Confirm--确认窗
			text4ConfirmButton: '确定', // 默认确认按钮文字
			text4CancelButton: '取消', // 默认取消按钮文字
			handler4ConfirmButton: null, // 确认按钮触发的事件
			handler4CancelButton: null, // 取消按钮触发的事件

			// Prompt--输入窗
			text4PromptButton: '确定', // 默认确认按钮文字
			isPromptInputPassword: false, // 输入窗是否是密码类型
			defaultValue4PromptInput: '', // 输入窗默认文字
			maxlength4PromptInput: 10, // 输入窗最大可输入字数
			handler4PromptButton: null, // 确认按钮触发的事件
		};

		// 所有的事件句柄，存放到该对象中
		this.handlers = {};
	}

	// 弹窗的方法
	Popup.prototype = extend(new Widget(), {

		// 创建HTML结构
		renderUI: function(){
			var footerContent = '';
			// 判断弹窗类型
			switch(this.config.popUpType){
				case 'alert':
					footerContent = '<button class="popup-alert">' + this.config.text4AlertButton + '</button>';
					break;
				case 'confirm':
					footerContent = '<button class="popup-confirm">' + this.config.text4ConfirmButton + '</button>\
									<button class="popup-cancel">' + this.config.text4CancelButton + '</button>';
					break;
				case 'prompt':
					this.config.content += '\
						<p class="popup-promptInputWrapper">\
							<input type="' + (this.config.isPromptInputPassword ? 'password' : 'text') + '" value="' + this.config.defaultValue4PromptInput + '" maxlength="' + this.config.maxlength4PromptInput + '" class="popup-promptInput">\
						</p>';
					footerContent = '<button class="popup-prompt">' + this.config.text4PromptButton + '</button>\
									<button class="popup-cancel">' + this.config.text4CancelButton + '</button>';
					break;
			}

			// 添加弹窗
			this.boundingBox = doc.createElement('div');
			this.boundingBox.className = 'popup-box';

			// 添加正文
			this.boundingBox.innerHTML = '<div class="popup-content">' + this.config.content + '</div>';

			// 若不为通用弹窗，增加头部与底部
			if(this.config.popUpType != 'common'){
				var _title = doc.createElement('div'),
					_footer = doc.createElement('div');

				_title.className = 'popup-title';
				_footer.className = 'popup-footer';

				_title.innerHTML = this.config.title;
				_footer.innerHTML = footerContent;

				this.boundingBox.insertBefore(_title, this.boundingBox.childNodes[0]);
				this.boundingBox.appendChild(_footer);
			}

			// 如果存在模态窗
			if(this.config.hasMask){
				this._mask = doc.createElement('div');
				this._mask.className = 'popup-mask';
				doc.body.appendChild(this._mask);
			}

			// 如果存在关闭按钮
			if(this.config.hasCloseButton){
				var closeButton = doc.createElement('button');

				closeButton.className = 'popup-close';
				closeButton.innerHTML = 'X';
				this.boundingBox.appendChild(closeButton);
			}

			doc.body.appendChild(this.boundingBox);
		},

		// 给DOM绑定事件
		bindUI: function(){
			var self = this,
			// Alert
				_alertButton = this.boundingBox.querySelector('.popup-alert'),
				_closeButton = this.boundingBox.querySelector('.popup-close'),
			// Confirm
				_confirmButton = this.boundingBox.querySelector('.popup-confirm'),
				_cancelButton = this.boundingBox.querySelector('.popup-cancel'),
			// Prompt
				_promptInput = this.boundingBox.querySelector('.popup-promptInput'),
				_promptButton = this.boundingBox.querySelector('.popup-prompt');

		// 绑定事件.................................................................................

			// Alert................................................................................
			// 给弹窗按钮绑定事件
			if(_alertButton){
				_alertButton.addEventListener('click', function(e){
					self.fire('alert');
					self.destroy();
				}, false);
			}

			// 给关闭按钮绑定事件
			if(_closeButton){
				_closeButton.addEventListener('click', function(e){
					self.fire('close');
					self.destroy();
				}, false);
			}

			// Confirm.............................................................................
			// 给确定按钮绑定事件
			if(_confirmButton){
				_confirmButton.addEventListener('click', function(e){
					self.fire('confirm');
					self.destroy();
				}, false);
			}

			// 给取消按钮绑定事件
			if(_cancelButton){
				_cancelButton.addEventListener('click', function(e){
					self.fire('cancel');
					self.destroy();
				}, false);
			}

			// Prompt.............................................................................
			// 给prompt按钮绑定事件
			if(_promptButton){
				_promptButton.addEventListener('click', function(e){
					self.fire('prompt', _promptInput.value);
					self.destroy();
				}, false);
			}

		// 创建事件................................................................................

			// 创建确定事件
			if(this.config.handler4AlertButton){
				this.on('alert', this.config.handler4AlertButton);
			}

			// 创建关闭事件
			if(this.config.handler4CloseButton){
				this.on('close', this.config.handler4CloseButton);
			}

			// 创建确认事件
			if(this.config.handler4ConfirmButton){
				this.on('confirm', this.config.handler4ConfirmButton);
			}

			// 创建取消事件
			if(this.config.handler4CancelButton){
				this.on('cancel', this.config.handler4CancelButton);
			}

			// 创建prompt事件
			if(this.config.handler4PromptButton){
				this.on('prompt', this.config.handler4PromptButton);
			}

			// 是否可以拖动
			if(this.config.draggable){
				// 拖动标题，移动弹窗位置
				var _title = this.boundingBox.querySelector('.popup-title'),
					winW = doc.documentElement.clientWidth,
					winH = doc.documentElement.clientHeight,
					self = this;

				if(!_title) return;

				_title.addEventListener('mousedown', _start, false);
				doc.addEventListener('mousemove', _move, false);
				doc.addEventListener('mouseup', _end, false);

				function _start(e){
					e.preventDefault();
					self.boundingBox.draggable = true;
					self.boundingBox.mousedown = {
						x: e.clientX - self.boundingBox.offsetLeft,
						y: e.clientY - self.boundingBox.offsetTop
					};

				}

				function _move(e){
					if(self.boundingBox.draggable){
						var curLeft = e.clientX - self.boundingBox.mousedown.x,
							curTop = e.clientY - self.boundingBox.mousedown.y;

						if(curLeft < 0){
							curLeft = 0;
						}else if(curLeft > winW - self.boundingBox.clientWidth){
							curLeft = winW - self.boundingBox.clientWidth;
						}

						if(curTop < 0){
							curTop = 0;
						}else if(curTop > winH - self.boundingBox.clientHeight){
							curTop = winH - self.boundingBox.clientHeight;
						}

						self.boundingBox.style.left = curLeft + 'px';
						self.boundingBox.style.top = curTop + 'px';
					}
				}

				function _end(e){
					self.boundingBox.draggable = false;
				}
			}

		},

		// 更新UI
		syncUI: function(){
			// 设置尺寸、位置
			this.boundingBox.style.width = this.config.width + 'px';
			this.boundingBox.style.left = ((win.innerWidth - this.config.width) / 2) + 'px';
			this.boundingBox.style.top = ((win.innerHeight - this.boundingBox.clientHeight) / 2) + 'px';

			// 设置皮肤样式
			if(this.config.skinClassName){
				this.boundingBox.classList.add(this.config.skinClassName);
			}
		},

		// 销毁组件之前，删除模态窗
		destructor: function(){
			this._mask && doc.body.removeChild(this._mask);
		},

		// 弹窗
		alert: function(config){
			// 扩展配置
			extend(this.config, config);
			extend(this.config, {popUpType: 'alert'});
			// 渲染组件
			this.render();
			return this;
		},

		// 确认框
		confirm: function(config){
			// 扩展配置
			extend(this.config, config);
			extend(this.config,  {popUpType: 'confirm'});
			// 渲染组件
			this.render();
			return this;
		},

		// 输入框
		prompt: function(config){
			// 扩展配置
			extend(this.config, config);
			extend(this.config,  {popUpType: 'prompt'});
			// 渲染组件
			this.render();
			return this;
		},

		common: function(config){
			// 扩展配置
			extend(this.config, config);
			extend(this.config,  {popUpType: 'common'});
			// 渲染组件
			this.render();
			return this;
		},
	});


	win.Popup = Popup;
})(window, document);

// 对象扩展
function extend(origin, config){
	for(var key in config){
		origin[key] = config[key];
	}

	return origin;
}