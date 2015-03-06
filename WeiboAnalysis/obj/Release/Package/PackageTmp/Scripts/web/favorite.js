/// <reference path="weiboAnalysis.js" />
/// <reference path="../common.js" />


var _favorite = new Object;
var Favorite = _favorite.property = {
    IdolParameter: { "display_style": 9, "act": "favoriteList", "action": "query", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "page_size": "15", "text": "*", "print": "all", "start": "1", "predict": "false" },
    FavoriteQueryParams: { "act": "initFavorite", "where": "", "orderBy": "InsertTime desc" },
    FavoriteInitData: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pageBar",
        "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/FavoriteHandler.ashx"
    },
    MonitorInfoHander: "Handler/MonitorInfo.ashx",
    Attention: {},
    _Template: null,
    Init: function () {
        Material.Init();
        Favorite.IdolParameter["MatchID"] = Favorite.idolIds;
        this.catchInfoData = new CatcheInfoData(); //CatchInfoData();
        this._Template = new Analysis();
        this._Template.analysis.IdolParameter = this.IdolParameter;
        this._Template.analysis.Init();
        Favorite.getPostAjax({ "act": "getattention" }, this.MonitorInfoHander, Favorite.loadAttention);
        HotWeiboUser.GetHotUser({}, null);
    },
    idolIds: "",
    catchInfoData: new Object,
    callBack: function () { },
    showUserInfo: function () {
        //添加/取消关注该用户
        Favorite._Template.analysis.showUserInfoDiv();
    },
    deleteFavoriteBind: function () {
        $("span[name='favorite'] a").click(function () {
            Favorite._Template.analysis.initFavoriteEvent(this);
        });
        //批量取消收藏的微博
        $("#delete_list_a").unbind("click").click(function () {
            if (confirm("确定取消选择的吗？")) {
                Favorite._Template.analysis.cancelFavoriteList();
            }
        });
    },
    loadAttention: function (data) {
        this._Template.analysis.AttentionList = data;
        this.getFavoriteList();
    },
    //获取收藏列表
    getFavoriteList: function () {
        var sp = new SqlPager(Favorite.FavoriteInitData);
        sp.Display = function (data, l_obj) {
            var count = 1;
            var entity = data["entity_" + count];
            if (!entity) {
                Common.LoadingImg("list_body_div", "0");
                return;
            }
            var ids = [];
            while (entity) {
                ids.push(entity.MainID);
                entity = data["entity_" + (++count)];
            }
            Favorite.getPostIdolAjax(ids.join("+"));
        }
        sp.LoadData(1, Favorite.FavoriteQueryParams);
    },
    //重置页面事件
    resetPageEvent: function () {
        this.showUserInfo();
        this.deleteFavoriteBind();
        this._Template.analysis.checkboxChange();

    },
    getPostAjax: function (data, url, cb) {
        if (typeof (cb) == "function") {
            //是否有回调函数
            this.callBack = cb;
        }
        $.post(url, data, function (data) {
            Favorite.callBack(data);
        }, "json");
    },
    getPostIdolAjax: function (ids) { //idol请求
        Favorite.IdolParameter["MatchReference"] = ids;
        $.post("Handler/WeiboEventHandler.ashx", Favorite.IdolParameter, function (data) {
            if (data && data.Success == "1") {
                Favorite._Template.analysis.resultDataIdol(data.data);
                $("#pageBar").show();
                Favorite.resetPageEvent();
            }
        }, "json");
    }, resultDataIdol: function (data) {//
        $("#list_body_div").empty();
        for (var i = 0; i < data.length; i++) {
            var bodydom = Favorite.bodyTemp(data[i]);
            $("#list_body_div").append(bodydom);
        }
        this.resetPageEvent();
    }, getCollect: function () {
        var data = { "act": "getcollect" };
        var url = "Handler/FavoriteHandler.ashx";
        var ids = [];
        $.post(url, data, function (data) {
            for (var i = 0; i < data.length; i++) {
                ids.push(data[i].IdolId);
            }
            Favorite.idolIds = ids.join("+");
            Favorite.Init();
        }, "json");
    }

}

$(function () {
    Favorite.Init();
});





