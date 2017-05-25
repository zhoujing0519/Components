// Constructor....................................................

	function Upload(opts){
		this.container = opts.container; // 上传图片的容器
		this.max = opts.max || 6; // 设置最大上传数量
		this.imageArr = []; // 图片路径数组
	}

// Prototype......................................................
	
	// 添加图片
	Upload.prototype.add = function(image){
		this.imageArr.push(image); // 在imageArr中添加新的image路径

		this.clear(); // 清空列表
		this.render(); // 重新渲染
	};

	// 移除图片
	Upload.prototype.remove = function(index){
		this.imageArr.splice(index, 1); // 从imageArr数组中，删除第index项

		this.clear(); // 清空列表
		this.render(); // 重新渲染
	};

	// 清空图片列表
	Upload.prototype.clear = function(){
		var container = this.container,
			ulNode = container.getElementsByTagName('ul')[0];

		ulNode.innerHTML = '';
	};

	// 渲染数据
	Upload.prototype.render = function(){
		var self = this;

		var container = this.container,
			pNode = container.getElementsByTagName('p')[0], // 标题
			ulNode = container.getElementsByTagName('ul')[0]; // 列表

			pNode.innerHTML = '图片（' + this.imageArr.length + '/' + this.max + '）'; // 显示当前图片上传的数量

		// 遍历图片路径数组，渲染列表
		for(var i = 0; i < this.imageArr.length; i++){
			!function(i){
				var liNode = document.createElement('li'),
					aNode = document.createElement('a'),
					image = new Image(),
					mask = document.createElement('div');

				// 绑定点击事件，删除自身
				liNode.onclick = function(e){
					self.remove(i);
				};

				// 设置属性
				aNode.href = 'javascript:;';
				image.src = self.imageArr[i];
				mask.className = 'mask';

				// 设置图片宽高
				if(image.width >= image.height){
					image.style.width = '100%';
				}else{
					image.style.height = '100%';
				}

				// image.onload = function(e){
					aNode.appendChild(image);
					aNode.appendChild(mask);
					liNode.appendChild(aNode);
					ulNode.appendChild(liNode);
				// };

			}(i);
		}

		// 如果图片数量不足最大值，给末置位添加默认上传图标
		if(this.imageArr.length < this.max){
			var lastLiNode = document.createElement('li'),
				lastANode = document.createElement('a'),
				uploadButton = document.createElement('input');

			lastLiNode.className = 'upload-default';
			lastANode.href = 'javascript:;';
			uploadButton.type = 'file';

			// 给按钮绑定上传事件
			uploadButton.onchange = function(e){
				var fileSize = this.files[0].size,
					fileSizeM = fileSize/1024/1024;

				// 验证
				if(!this.value.match(/.+(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$/)){
					alert('格式不对！');
				}else if(fileSizeM > 5){
					alert('图片过大！');
				}else{
					var fileReader = new FileReader(),
						files = this.files[0];

					// 加载成功后，添加图片
					fileReader.onload = function(e){
						self.add(e.target.result);
					};
					
					fileReader.readAsDataURL(files);
				}
			};

			lastANode.appendChild(uploadButton);
			lastLiNode.appendChild(lastANode);
			ulNode.appendChild(lastLiNode);
		}
	};