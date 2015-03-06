
var Keywords = {
    IdolParameter: { "display_style": 8, "act": "personalDetails", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false", "isNearTime": "false", "nearTime": "0,d" },
    PageInitParameter: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/WeiboEventHandler.ashx" },
    Attention: {},
    Init: function () {
        this._Template = new Analysis();
        Keywords.IdolParameter["isNearTime"] = "true";
        Keywords.IdolParameter["nearTime"] = "0,d";
        this._Template.analysis.IdolParameter = this.IdolParameter;
        this.catchData = new CatcheInfoData();
        this._Template.analysis.Init();
        this._Template.analysis.loadAdvanceChange();
        GetPostAjax({ "act": "getattention" }, this.LoadAttention); //初始化关注人、和页面数据
    },
    isSaveHistory: false, //是否记录历史搜索
    advance: { "isVip": "0", "websource": "0", "province": "0" },
    _Template: null,
    _SerachKeyWords: "",
    LoadEvent: function () { /*页面事件*/
        //this.changeTime();
        //this.searchRecently(); /*按近几日搜索快捷事件*/
        //this.searchFixedTime(); /*时间段搜索时间*/
        this.realTimeWeibo();
        this.forwardNumSort();
        this.replyNumSort();
        this.screeningWeibo();
    },
    LoadinImg: function () {
        $("#list_body_div").empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");
        $("#pagebar").empty();
    },
    LoadAttention: function (data) {
        Keywords.Attention = data;
        Keywords._Template.analysis.AttentionList = data;
        Keywords.GetPageAjax();
    },
    changeTime: function () { //时间选项卡切换
        $("#wbdatesh_div ul li").click(function () {
            $("#wbdatesh_div ul li").removeClass("on");
            $(this).removeClass("on").addClass("on");
            var idx = $(this).index();
            $(".wb_currentnr").addClass("none_dis");
            $(".wb_currentnr:eq(" + idx + ")").removeClass("none_dis");
        });
    },
    searchRecently: function () { //按近几日搜索事件
        $("#recently_div li a").click(function () {
            Keywords.isSaveHistory = true;
            $("#recently_div li").removeClass("on");
            $(this).parent().removeClass("on").addClass("on");
            var res = $(this).removeClass("").attr("value");
            Keywords.IdolParameter["isNearTime"] = "true";
            Keywords.IdolParameter["nearTime"] = res;
            Keywords.IdolParameter["maxdate"] = "";
            Keywords.IdolParameter["mindate"] = "";
            Keywords.LoadinImg(); /*等待图片*/
            Keywords.GetPageAjax();
        });
    },
    searchFixedTime: function () {//按给定时间搜索(自己定义时间)
        $("#custom_search_btn").click(function () {
            Keywords.isSaveHistory = true;
            var startTime = $("#custom_start_time").val();
            //结束时间
            var endTime = $("#custom_end_time").val();
            Keywords.IdolParameter["mindate"] = startTime;
            Keywords.IdolParameter["maxdate"] = endTime;
            Keywords.IdolParameter["isNearTime"] = "false";
            Keywords.LoadinImg(); /*等待图片*/
            //s.push
            Keywords.GetPageAjax();
        });
    },
    sortByWhere: function (dom, sortWhere) {
        Keywords.isSaveHistory = false;
        $("#actionBtns li").removeClass("on");
        $(dom).addClass("on");
        Keywords.IdolParameter["sort"] = sortWhere;
        Keywords.LoadinImg();
        Keywords.GetPageAjax();
    },
    realTimeWeibo: function () {//实时微博
        $("#real_time_btn").click(function () {
            Keywords.sortByWhere(this, "Date");
        })
    },
    forwardNumSort: function () {//转发最多
        $("#hot_point_btn").click(function () {
            Keywords.sortByWhere(this, "FORWARDNUM:numberdecreasing");
        });
    },
    replyNumSort: function () {// 评论微博 
        $("#negative_btn").click(function () {
            Keywords.sortByWhere(this, "REPLYNUM:numberdecreasing");
        });
    },
    screeningWeibo: function () {//微博筛选
        $("#weibo_screening_btn").click(function () {
            Keywords.LoadinImg();
            Keywords.isSaveHistory = true;
            Keywords.GetPageAjax();
        });
    },
    catchData: new Object(),  //选择分析微博
    GetAttention: function () {
    },
    GetPageAjax: function () {
        var filetextArray = [];
        var history = {};
        var condition = [];
        var keyWorde = Keywords._SerachKeyWords; //$("#keyword_txt").val() == "" ? "*" : $("#keyword_txt").val(); /*搜索关键字*/
        Keywords.IdolParameter["text"] = keyWorde;
        if ($("#ckIsvip").attr("checked")) {
            filetextArray.push("MATCH{1}:ISVIP");
        }
        var webSource = $("#websource_sct").val();
        if ("0" != webSource) {
            filetextArray.push("MATCH{" + webSource + "}:WEBSOURCE");
        }

        var proviceName = $("#province_sct").val();
        if ("0" != proviceName) {
            filetextArray.push("MATCH{" + $("#province_sct").val() + "}:PROVINCE");
        }
        var optstateVal = $("#processType").val();
        Keywords.IdolParameter["OPTSTATE"] = optstateVal == 0 ? "" : optstateVal;
        filetextArray.push("EXISTS{}:DRETITLE");
        Keywords.IdolParameter["fieldtext"] = filetextArray.join(" AND ");
        Keywords._Template.analysis.IdolParameter = Keywords.IdolParameter;

        if (Keywords.isSaveHistory)
            Keywords._Template.analysis.addHistory();
        $("#history_div ul li").click(function (d) {
            var index = $("#history_div ul li").index(this);
            Keywords._Template.analysis.IdolParameter = Keywords._Template.analysis.history[index].data;
            Keywords.LoadinImg();
            Keywords._Template.analysis.reductionHistory(index);
            Keywords._Template.analysis.showAdvanceCondition();
            Keywords.loadIdol();
        });
        Keywords.loadIdol();
    },
    loadIdol: function () {
        var Lpager = new Pager(Keywords.PageInitParameter);
        Lpager.Display = function (data) {
            //加载模板
            Keywords._Template.analysis.resultDataIdol(data.data);
            //t添加/取消关注事件
            Keywords._Template.analysis.showUserInfoDiv();
            $("span[name='favorite'] a").click(function () {
                Keywords._Template.analysis.initFavoriteEvent(this); //addFavorite(this);
            });
            Keywords._Template.analysis.checkboxChange(); //加载复选框事件
        };
        Lpager.LoadData(1, Keywords._Template.analysis.IdolParameter);

    }
}

function GetPostAjax(data, callback) {
    $.post("Handler/MonitorInfo.ashx", data, function (data) {
        callback(data);
    }, "json");
}

