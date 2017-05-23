;(function(){

	var datepicker = window.datepicker,

		monthData,
		_wrapper;

	_wrapper = document.createElement('div');
	_wrapper.className = 'ui-datepicker-wrapper';
	document.body.appendChild(_wrapper);

	// 构建ui的方法
	datepicker.buildUi = function(year, month){
		monthData = this.getMonthData(year, month);

		var _html = '<div class="ui-datepicker-header">' +
						'<a class="ui-datepicker-btn ui-datepicker-prev-btn" href="javascript:;">&lt;</a>' +
						'<a class="ui-datepicker-btn ui-datepicker-next-btn" href="javascript:;">&gt;</a>' +
						'<span class="ui-datepicker-cur-date">' +
							monthData.year + '-' + (monthData.month < 10 ? '0' + monthData.month : monthData.month) +
						'</span>' +
					'</div>' +		
					'<div class="ui-datepicker-body">' +
						'<table>' +
							'<thead>' +
								'<tr>' +
									'<th>一</th>' +
									'<th>二</th>' +
									'<th>三</th>' +
									'<th>四</th>' +
									'<th>五</th>' +
									'<th>六</th>' +
									'<th>日</th>' +
								'</tr>' +
							'</thead>' +
							'<tbody>';

		for(var i = 0, len = monthData.days.length; i < len; i++){
			var date = monthData.days[i],
				isCurrentMonth = date.month === monthData.month ? '' : 'ui-datepicker-not-cur-month';

			if(i % 7 === 0) _html += '<tr>';

			_html += '<td class="' + isCurrentMonth + '" data-date="' + date.date + '" title="' + monthData.year + '-' + (date.month < 10 ? '0' + date.month : date.month) + '-' + (date.showDate < 10 ? '0' + date.showDate : date.showDate) + '">' + date.showDate + '</td>';

			if(i % 7 === 6) _html += '</tr>';
		}

		_html += '</tbody>' +
				'</table>' +
			'</div>';

		return _html;
	};

	// 渲染
	datepicker.render = function(direction){
		var year, month;

		if(monthData){
			year = monthData.year;
			month = monthData.month;
		}

		if(direction === 'prev'){
			month--;

			if(month === 0){
				month = 12;
				year--;
			}
		}
		if(direction === 'next') month++;

		_wrapper.innerHTML = this.buildUi(year, month);

	};

	// 初始化
	datepicker.init = function(element){
		var self = this;
		
		// 渲染
		this.render();

		var isOpen = false;
		// 给输入框绑定点击事件
		element.addEventListener('click', function(event){
			isOpen = !isOpen;

			if(isOpen){
				_wrapper.classList.add('ui-datepicker-wrapper-show');

				var top = this.offsetTop + this.offsetHeight + 2,
					left = this.offsetLeft;

				_wrapper.style.left = left + 'px';
				_wrapper.style.top = top + 'px';
			}else{
				_wrapper.classList.remove('ui-datepicker-wrapper-show');
			}
		}, false);

		// 给月份翻页绑定事件
		_wrapper.addEventListener('click', function(event){
			var $target = event.target;

			if(!$target.classList.contains('ui-datepicker-btn')) return;


			if($target.classList.contains('ui-datepicker-prev-btn')){
				// 上一月
				self.render('prev');
			}else if($target.classList.contains('ui-datepicker-next-btn')){
				// 下一月
				self.render('next');
			}

		}, false);

		// 给日期赋值绑定事件
		_wrapper.addEventListener('click', function(event){
			var $target = event.target,
				date;

			if($target.tagName.toLowerCase() !== 'td') return;

			date = new Date(monthData.year, monthData.month - 1, $target.dataset.date);

			element.value = format(date);

			// 关闭窗口
			_wrapper.classList.remove('ui-datepicker-wrapper-show');
			isOpen = false;
		}, false);
	};


	function format(date){
		var result = '';

		var padding = function(num){
			if(num < 10){
				return '0' + num;
			}
			return num;
		};

		result += date.getFullYear() + '-';
		result += padding(date.getMonth() + 1) + '-';
		result += padding(date.getDate());

		return result;
	}

})();