
var YearMonthWeek = {
    yearid: "#years_sel",
    monthid: "#month_sel",
    weekid: "#week_sel",
    yearoption: "#years_se option",
    monthoption: "#month_sel option",
    weekoption: "#week_sel option",
    defyear: 2013,
    yearweek: 1,
    isInit: true,
    callfun: function () { },
    weekfun: function () { },
    Init: function (param) {
        for (var i in param) {
            YearMonthWeek[i] = param[i];
        }
        YearMonthWeek.LoadYear();
        YearMonthWeek.LoadMonth();
        YearMonthWeek.SetMonth();
        YearMonthWeek.LoadEvent();
        YearMonthWeek.LoadWeek();
        YearMonthWeek.SetWeek();
        YearMonthWeek.SetYear();
    },
    LoadEvent: function () {
        $(YearMonthWeek.yearid).change(function () {
            $(YearMonthWeek.monthid).val("0");
            YearMonthWeek.LoadWeek();
            YearMonthWeek.weekfun();
        });
        $(YearMonthWeek.monthid).change(function () {
            YearMonthWeek.LoadWeek();
            YearMonthWeek.weekfun();
        });
        $(YearMonthWeek.weekid).change(function () {
            YearMonthWeek.weekfun();
        });
    }, LoadYear: function () {

        var d = new Date();
        var y = d.getFullYear();
        $(YearMonthWeek.yearoption).remove();
        for (var i = YearMonthWeek.defyear; i <= y; i++) {
            var s = "<option value=" + i + ">" + i + "年</option>";
            $(YearMonthWeek.yearid).append(s);
        }
    },
    LoadMonth: function () {
        $(YearMonthWeek.monthoption).remove();
        for (var i = 0; i < 12; i++) {
            var lable = (i + 1) < 10 ? "0" + (i + 1) : (i + 1);
            var s = "<option value=" + i + ">" + lable + "月</option>";
            $(YearMonthWeek.monthid).append(s);
        }
    }, LoadWeek: function (y, m) {


        if (m == undefined || y == undefined) {
            y = $(YearMonthWeek.yearid).val();
            m = $(YearMonthWeek.monthid).val();
        }
        var mydate = new Date(y, '0', '1');
        var d = mydate.getDay();
        d = 0;
        //这个月的第一周
        var fWeek = YearMonthWeek.FirstWeek(y, m, d);
        //这个月的最后一周
        var lWeek = YearMonthWeek.LastWeek(y, m, d);
        var j = 0;
        $(YearMonthWeek.weekoption).remove();
        //今天是一年中第几周
        var todayWeek = YearMonthWeek.TodayWeek(y, m, new Date().getDate());
        if (todayWeek == fWeek) {
            fWeek = fWeek - 1;
        }
        var shangyueLastWeek = YearMonthWeek.LastWeek(y, parseInt(m) - 1, d);
        var shangyueFiresWeek = YearMonthWeek.FirstWeek(y, parseInt(m) - 1, d);
        var removeMonth = parseInt(m);

        if (fWeek == shangyueLastWeek && YearMonthWeek.isInit) {
            fWeek = shangyueFiresWeek;
            lWeek = shangyueLastWeek;
            $(YearMonthWeek.monthid).val(parseInt(m) - 1);
            removeMonth = removeMonth - 1;
            YearMonthWeek.isInit = false;
        }
        if (fWeek == shangyueLastWeek) {
            fWeek = fWeek + 1;
        }
        if (new Date().getMonth() > parseInt(m)) {
            for (var i = fWeek; i <= lWeek; i++) {
                j++;
                var lable = i < 10 ? "0" + i : i;
                var value = i + "_" + j;
                $(YearMonthWeek.weekid).append("<option value=" + value + ">第" + j + "周" + "</option>");
            }
        } else {
            if (new Date().getDay() != 0) {
                todayWeek = todayWeek - 1;
            }

            for (var i = fWeek; i <= lWeek && i <= todayWeek; i++) {
                j++;
                var lable = i < 10 ? "0" + i : i;
                var value = i + "_" + j;
                $(YearMonthWeek.weekid).append("<option value=" + value + ">第" + j + "周" + "</option>");
            }
        }
    },
    UpWeekLastWeek: function (y, m) {
        var days = YearMonthWeek.GetDays(parseInt(y), parseInt(m));
        var week = YearMonthWeek.GetWeek(days);
        return week;
    },
    TodayWeek: function (y, m, d) {
        var days = YearMonthWeek.GetDays(parseInt(y), parseInt(m));
        days += d;
        days += 1;
        var week = YearMonthWeek.GetWeek(days);
        return week;
    },
    FirstWeek: function (y, m, d) {
        var upweek = 0;
        var days = YearMonthWeek.GetDays(parseInt(y), parseInt(m));
        upweek = YearMonthWeek.GetWeek(days);
        days += d;
        days += 1;
        if (days < 1) {
            days = 1;
        }
        var week = YearMonthWeek.GetWeek(days);
        if (upweek == week) {
            week += 1;
        }
        return week;
    },
    LastWeek: function (y, m, d) {
        var days = YearMonthWeek.GetDays(parseInt(y), parseInt(m) + 1);
        days += d;
        var week = YearMonthWeek.GetWeek(days);
        return week;
    },
    SetYear: function () {
        var date = new Date();
        var y = date.getFullYear();
        $(YearMonthWeek.yearid).val(y);
    },
    SetMonth: function () {
        var d = new Date();
        $(YearMonthWeek.monthid).val(d.getMonth());
    },
    SetWeek: function () {

        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();

        var days = YearMonthWeek.GetDays(parseInt(y), parseInt(m), parseInt(d));

        var week = YearMonthWeek.GetWeek(days);
        week = week - 1;
        var option = $(YearMonthWeek.weekoption + "[value*='" + week + "']");
        $(option).attr("selected", "selected");

    },
    GetDays: function (y, m, d) {
        var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

        var day = 0; // date.getDate();
        var month = m; //date.getMonth(); //getMonth()是从0开始
        var year = y; // date.getFullYear();
        var result = 0;
        for (var i = 0; i < month; i++) {
            result += dateArr[i];
        }
        if (d > 0) {
            day = d + 1;
        }
        if (m != 0) {
            result += day;
        }

        //判断是否闰年
        if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            result += 1;
        }
        return result + 1;
    },
    GetWeek: function (days) {
        var week = parseInt(days / 7);
        var moNum = days % 7;
        if (moNum > 0) {
            week += 1;
        }
        return week;
    }
}