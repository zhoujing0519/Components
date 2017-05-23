;(function(){

	var datepicker = {};

	datepicker.getMonthData = function(year, month){
		var result = [],
			
			lastDayOfLastMonth,
			lastDateOfLastMonth,
			
			firstDay,
			firstDayWeekDay,

			lastDay,
			lastDate,

			preMonthCount;

		// 如果没有设置年月，使用当前年月
		if(!year || !month){
			var today = new Date();

			year = today.getFullYear();
			month = today.getMonth() + 1;
		}

		firstDay = new Date(year, month - 1, 1); // 获取本月第一天
		firstDayWeekDay = firstDay.getDay(); // 获取本月第一天的星期
		if(firstDayWeekDay === 0) firstDayWeekDay = 7;

		year = firstDay.getFullYear();
		month = firstDay.getMonth() + 1;

		lastDayOfLastMonth = new Date(year, month - 1, 0); // 获取上月最后一天
		lastDateOfLastMonth = lastDayOfLastMonth.getDate(); // 获取上月最后一天的日期

		preMonthCount = firstDayWeekDay - 1; // 上月有多少天划入本月
 
		lastDay = new Date(year, month, 0); // 获取本月最后一天
		lastDate = lastDay.getDate(); // 获取本月最后一天的日期

		// 默认6周 ==> 6*7=42
		for(var i = 0; i < 42; i++){
			var date = i - preMonthCount + 1, // 真实日期
				showDate = date, // 用于显示的日期
				thisMonth = month; // 月份

			if(date <= 0){
				// 上一月
				thisMonth = month - 1;
				showDate = lastDateOfLastMonth + date;
			}else if(date > lastDate){
				// 下一月
				thisMonth = month + 1;
				showDate = date - lastDate;
			}

			// 处理月份
			if(thisMonth === 0) thisMonth = 12;
			if(thisMonth === 13) thisMonth = 1;

			// 添加数据
			result.push({
				date: date,
				showDate: showDate,
				month: thisMonth
			});
		}

		return {
			year: year,
			month: month,
			days: result
		};
	};

	window.datepicker = datepicker;

})();