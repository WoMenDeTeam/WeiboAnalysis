/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../template.js" />


function Analysis() {
    var root = this;
    var Analysis;
    if (typeof exports !== 'undefined') {
        Analysis = exports;
    } else {
        Analysis = root.analysis = {};
    }
    Analysis.webSource = Config.WeiboSource,
    Analysis.pingLunUrl = Config.WeiboPingLunUrl,
    Analysis.zhuanFaUrl = Config.WeiboZhuanFaUrl,

    Analysis.viewId = "#list_body_div"; //绑定domID
    Analysis.isLoadUserInfo = true;     //是否加载个人信息
    Analysis.replyNumStart = 0;
    Analysis.historyMax = 10;
    Analysis.favoriteHander = "Handler/FavoriteHandler.ashx";
    Analysis.monitorInfoHander = "Handler/MonitorInfo.ashx";
    Analysis.deleteIdolHander = "Handler/DeleteIdol.ashx";
    Analysis.editIdolHander = "Handler/EditIdolTag.ashx";
    Analysis.IdolParameter = {};
    Analysis.history = [];
    Analysis.catcheData = new CatcheInfoData();
    Analysis.advanceList = [];
    Analysis.advConditionPlanId = "#condition_div";
    Analysis.advInitPlanData = [];
    Analysis.advInitPlanData.push({ "id": "#keyword_txt", "type": "val", "value": "", "title": "" });
    Analysis.advInitPlanData.push({ "id": "#ckIsvip", "type": "attr", "attribute": "checked", "value": false, "title": "" });
    Analysis.advInitPlanData.push({ "id": "#ckIsBase", "type": "attr", "attribute": "checked", "value": false, "title": "" });
    Analysis.advInitPlanData.push({ "id": "#websource_sct", "type": "val", "value": 0, "title": "" });
    Analysis.advInitPlanData.push({ "id": "#province_sct", "type": "val", "value": 0, "title": "" });
    Analysis.Init = function () {
        Analysis.clickAllCkbox();
        Analysis.CreateTopicAnalysis();
        Analysis.clickHistory();
    }

    Analysis.callBack = function () { };
    //Post Jons 请求 url地址，data：发送数据,callbackFun:请求完成回调函数
    Analysis.getPostJson = function (url, data, callbackFun) { //
        $.post(url, data, function (data) {
            if (typeof (callbackFun) == "function")
                callbackFun(data);
        }, "json");
    }
    /*=============================
    *删除IDOL数据（移库操作）
    *=============================*/
    Analysis.IdolDataToNewDatabase = function (data, callfun) {
        $.ajax(Analysis.deleteIdolHander, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
            }
        });
    }
    Analysis.ExecuteDelIdolData = function (data) {
        if (!confirm("确定删除吗?")) {
            return;
        }
        var docEL = this;
        var newdata = data.data;
        var param = { "acction": "deleteweibo", "TargetDatabaseName": Config.TargetDatabaseName, "docid": newdata.docId, "_t": new Date().getTime() };
        Analysis.IdolDataToNewDatabase(param, function (d) {
            $(docEL).parents(".wb_boxnr").remove();
        });
    }

    /*=============================
    *修改IDOL数据正、中、负面
    *=============================*/
    Analysis.UpdateIdolDataTag = function (data, callfun) {
        $.ajax(Analysis.editIdolHander, {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
            }
        });
    }

    Analysis.ExecuteUpdateTag = function (data) {
        var val = $(this).attr("value");
        var text = $(this).attr("title");
        var docEL = this;
        var newdata = data.data;
        var imgsrc = "";
        imgsrc = val == "0" ? "img/btn_atti_zhong.png" : val == "1" ? "img/btn_atti_fu.png" : "img/btn_atti_zheng.png";

        var showPlan = $(this).parents("td").find(".msg"); //$(this).parents("div.msg"); //.parent().parent().find("div .msg");
        var param = { "acction": "editdoc", "docid": newdata.docId, "fieldName": "EMOTION", "fieldValue": val, "_t": new Date().getTime() };
        Analysis.UpdateIdolDataTag(param, function (d) {
            var el = "<div class=\"msg_T\"><h1>" + text + "</h1></div><div class=\"msg_C\"><p>经系统判断，本条微博内容" + text + "</p></div><div class=\"msg_B\"></div>";
            $(docEL).parent().parent().find("img[name='xingzhi']").attr("src", imgsrc);
            //$(this).parents('.icon').find("img[name='xingzhi']")
            showPlan.html(el);
        });
    }


    /*=============================
    *高级搜索条件面板
    *=============================
    */
    //Analysis.advPlanData = [];
    Analysis.loadAdvanceChange = function () {
        $("#advance_search_a").click(function () {
            $("#advanced_search_div").show()
        });
        $("#close_advanced_search_a").click(function () {
            $("#advanced_search_div").hide();
        });
        //高级搜索条件展示
        $("#ckIsvip").click(Analysis.showAdvanceCondition);
        $("#websource_sct").change(Analysis.showAdvanceCondition);
        $("#province_sct").change(Analysis.showAdvanceCondition);
        $("#videosuccess_sct").change(Analysis.showAdvanceCondition);
        $("#ckIsBase").change(Analysis.showAdvanceCondition);
    }
    Analysis.showAdvanceCondition = function () {
        var conditionData = [];
        //===高级面板
        function _advPlan() {
            var isvipValue = $("#ckIsvip").attr("checked") == "checked";
            if (isvipValue != "") {
                var isvip = { "id": "#ckIsvip", "type": "attr", "attribute": "checked", "bat": false, "value": isvipValue, "title": isvipValue ? "+V用户" : "" };
                conditionData.push(isvip);
            }
            var ckIsBaseValue = $("#ckIsBase").attr("checked") == "checked";
            if (ckIsBaseValue != "") {
                var isBase = { "id": "#ckIsBase", "type": "attr", "attribute": "checked", "bat": false, "value": ckIsBaseValue, "title": ckIsBaseValue ? "基础库" : "" };
                conditionData.push(isBase);
            }

            var websourceValue = $("#websource_sct").val();
            var websourceTitle = "";
            websourceTitle = Config.WeiboSource[websourceValue];
            if (websourceValue != "" && websourceValue != undefined) {
                var websource = { "id": "#websource_sct", "type": "val", "bat": "0", "value": websourceValue, "title": websourceTitle };
                conditionData.push(websource);
            }
            /*城市*/
            var provinceValue = $("#province_sct").val();
            if (provinceValue != "" && provinceValue != undefined) {
                var province = { "id": "#province_sct", "type": "val", "bat": "0", "value": provinceValue, "title": provinceValue == "0" ? "" : provinceValue };
                conditionData.push(province);
            }
            var videoSuccessValue = $("#videosuccess_sct").val();
            var videoText = $("#videosuccess_sct option:selected").text();

            if (videoSuccessValue != "0" && videoSuccessValue != "" && videoSuccessValue != undefined) {
                var videoVal = { "id": "#videosuccess_sct", "type": "val", "bat": "0", "value": videoSuccessValue, "title": videoText };
                conditionData.push(videoVal);
            }
        }
        _advPlan();
        var count = 0;
        function _show() {
            $(Analysis.advConditionPlanId).find("span").remove();
            for (var i = 0; i < conditionData.length; i++) {
                if (conditionData[i].title != "") {
                    count++;
                    var el = $("<span><img _i=\"" + i + "\" src=\"img/btn_searchclose.gif\" width=\"15\" height=\"18\" class=\"right\" />" + conditionData[i].title + "</span>");
                    $(el).find("img").click(function () {
                        var _i = $(this).attr("_i");
                        conditionData[_i].value = conditionData[_i].bat;
                        Analysis.reductionPlan(conditionData);
                        $(this).parent().remove();
                        count--;
                        if (count <= 0) {
                            $(Analysis.advConditionPlanId).hide();
                        }
                    });
                    $(Analysis.advConditionPlanId).append(el);
                }
            }
            if (count > 0) {
                $(Analysis.advConditionPlanId).show();
            } else {
                $(Analysis.advConditionPlanId).hide();
            }
        }
        _show();
    }

    /*=======================================
    *历史搜索记录   unshift
    *========================================
    */
    Analysis.clickHistory = function () {
        $("#btn_history").click(function () {
            $("#history_div").show();
        });
        $("#colse_history_div").click(function () { $("#history_div").hide(); })
    }
    Analysis.addHistory = function () {
        var data = {};
        var idolPara = {};
        data["saveHistory"] = Analysis.historyTiaoJian();
        data["title"] = Analysis.titleName(data["saveHistory"]);
        for (var item in Analysis.IdolParameter) {
            idolPara[item] = Analysis.IdolParameter[item];
        }
        data["data"] = idolPara;
        Analysis.history.unshift(data);
        if (Analysis.history.length > Analysis.historyMax)
            Analysis.history.length = Analysis.historyMax;
        Analysis.refreshHistoryDiv();
    }
    Analysis.refreshHistoryDiv = function () {
        $("#history_div ul").empty();
        for (var i = 0; i < Analysis.history.length; i++)
            $("#history_div ul").append("<li><a>" + Analysis.history[i].title + "</a></li>");
    }

    //标注历史记录的名称
    Analysis.titleName = function (data) {
        var title = [];
        for (var i = 0, j = data.length; i < j; i++) {
            if (data[i].title != "" && data[i].title != undefined) {
                title.push(data[i].title);
            }
        }
        return title.join("+");
    }
    //还原历史记录的条件
    Analysis.reductionHistory = function (_index) {
        var data = Analysis.history[_index].saveHistory;
        Analysis.reductionPlan(data);
    }
    //清空历史记录的条件
    Analysis.clearAdvPlan = function () {
        Analysis.reductionPlan(Analysis.advInitPlanData);
    }
    Analysis.reductionPlan = function (data) {
        for (var i = 0, j = data.length; i < j; i++) {
            var model = data[i]
            switch (model["type"]) {
                case "val":
                    $(model["id"]).val(model["value"]);
                    break;
                case "attr":
                    $(model["id"]).attr(model["attribute"], model["value"]);
                    break;
                case "li":
                    $(model["id"]).removeClass("on").eq(model["value"]).addClass("on");
                    if (model["attribute"] == "menue") {
                        var index = (parseInt(model["value"]) + 1) % 2;
                        $(".wb_currentnr").removeClass("none_dis");
                        $(".wb_currentnr").eq(index).addClass("none_dis");
                    }
                    break;
                default:
                    break;
            }
        }
    }


    //记录当前搜索的条件做为历史记录
    Analysis.historyTiaoJian = function () {
        var conditionData = [];
        //===高级面板
        function _advPlan() {
            var keywordValue = $("#keyword_txt").val();
            var keyword = { "id": "#keyword_txt", "type": "val", "value": keywordValue, "title": keywordValue == "" ? "" : keywordValue };
            conditionData.push(keyword);
            var isvipValue = $("#ckIsvip").attr("checked") == "checked";
            var isvip = { "id": "#ckIsvip", "type": "attr", "attribute": "checked", "value": isvipValue, "title": isvipValue ? "+V用户" : "" };
            conditionData.push(isvip);

            var ckIsBaseValue = $("#ckIsBase").attr("checked") == "checked";
            var isBase = { "id": "#ckIsBase", "type": "attr", "attribute": "checked", "bat": false, "value": ckIsBaseValue, "title": ckIsBaseValue ? "基础库" : "" };
            conditionData.push(isBase);

            var websourceValue = $("#websource_sct").val();
            var websourceTitle = Config.WeiboSource[websourceValue];
            var websource = { "id": "#websource_sct", "type": "val", "value": websourceValue, "title": websourceTitle };
            conditionData.push(websource);
            //城市
            var provinceValue = $("#province_sct").val();
            var province = { "id": "#province_sct", "type": "val", "value": provinceValue, "title": provinceValue == "0" ? "" : provinceValue };
            conditionData.push(province);
        }
        //====选项卡
        var menueValue = $("#wbdatesh_div ul li.on").index();
        function _leftPlan() {
            var menue = { "id": "#wbdatesh_div ul li", "type": "li", "value": menueValue, "title": "", "attribute": "menue" };
            conditionData.push(menue);
            var recentlyText = ["当天", "近3天", "近1周", "近1月"];
            if (menueValue == 0) {
                var recentlyValue = $("#recently_div ul li.on").index();
                var recently = { "id": "#recently_div ul li", "type": "li", "value": recentlyValue, "title": recentlyText[recentlyValue], "attribute": "" };
                conditionData.push(recently);
            } else {
                var startTimeValue = $("#custom_start_time").val();
                var starttime = { "id": "#custom_start_time", "type": "val", "value": startTimeValue, "title": startTimeValue };
                conditionData.push(starttime);

                var endTimeValue = $("#custom_end_time").val();
                var endtime = { "id": "#custom_end_time", "type": "val", "value": endTimeValue, "title": endTimeValue };
                conditionData.push(endtime);
            }
        }
        _advPlan();
        if (menueValue >= 0) {
            _leftPlan();
        }
        return conditionData;
    }

    //添加/取消关注
    Analysis.addAttention = function (data, dom) {
        var datas = {};
        if ($(dom).attr("act") == "tj") {
            datas["act"] = "addattention";
        } else {
            datas["act"] = "removeattention";
        }
        datas["webSource"] = $(dom).attr("source");
        datas["nick"] = $(dom).attr("nick");
        datas["userName"] = $(dom).attr("name");
        datas["d"] = new Date().getTime();
        data = datas;

        this.getPostJson(this.monitorInfoHander, data, function (response) {
            if (response.success == "1") {
                if (response.act == "tj") {
                    //Favorite.Attention
                    Analysis.AttentionList[data["userName"] + "_" + data["webSource"]] = data["nick"];
                    $(dom).attr("act", "qx");
                    $(dom).html("取消关注");
                    $("#" + data["userName"] + "_" + data["webSource"]).addClass("wb_ygz");
                } else {
                    Analysis.AttentionList[data["userName"] + "_" + data["webSource"]] = "";
                    $(dom).attr("act", "tj");
                    $(dom).html("添加关注");
                    $("#" + data["userName"] + "_" + data["webSource"]).removeClass("wb_ygz");
                }
            }
        });
    }
    //Analysis.cancelAttention = function () {}
    Analysis.initFavoriteEvent = function (dom) {
        var htmlVal = $(dom).attr("title")//.html();
        if (htmlVal == "收藏") {
            Analysis.addFavorite(dom);
        } else if (htmlVal == "取消收藏") {
            Analysis.cancelFavorite(dom);
        }
    }
    Analysis.addFavorite = function (dom) {       //添加收藏

        var mainid = $(dom).attr("pid");
        var data = { "act": "insert", "mainid": mainid, "d": new Date().getTime() };
        this.getPostJson(this.favoriteHander, data, function (data) {
            if (data && data.Success == "1") {
                Common.SubmitPop("submitPopDiv");
            } else if (data.Success == "2") {
                Common.SubmitPop("warningPopDiv");
            }
            $(dom).attr("title", "取消收藏")
            $(dom).removeClass("btn_favorite").addClass("btn_nofavorite");
            //$(dom) //.html("取消收藏");
        });
    }
    Analysis.cancelFavorite = function (dom) {     //取消收藏
        var mainid = $(dom).attr("pid");
        var data = { "act": "delete", "mainid": mainid, "d": new Date().getTime() };
        this.getPostJson(this.favoriteHander, data, function (data) {
            if (data && data.Success == "1") {
                Common.SubmitPop("submitPopDiv");
                $(dom).attr("title", "收藏"); //.html("收藏");
                $(dom).removeClass("btn_nofavorite").addClass("btn_favorite")
                try {
                    //Favorite.getFavoriteList();
                } catch (e) {
                    //
                }
            }
        });
    }
    Analysis.cancelFavoriteList = function () {//批量取消收藏
        var ids = [];
        var datas = Analysis.catcheData.items;
        for (var i = 0; i < datas.length; i++) {
            ids.push(datas[i].referenceid);
        }
        var data = { "act": "deletelist", "ids": ids.join(",") };
        this.getPostJson(Analysis.favoriteHander, data, function (data) {
            if (data && data.Success == "1") {
                Analysis.catcheData.items.length = 0;
                $("#checknumber").empty().append("0");
                Common.SubmitPop("submitPopDiv");
                Favorite.getFavoriteList();
            }
        })
    }

    Analysis.advancedSearch = function () {

    }
    /*===================================
    * 个人信息显示隐藏事件
    *====================================
    */
    Analysis.showUserInfoDiv = function () {

        $(".icon").hover(function () {
            $(this).siblings(".msg").fadeIn(300);
            $(this).find("div").fadeIn(300);
        }, function () {
            $(this).siblings(".msg").fadeOut(300); //.fadeOut(300);
            $(this).find("div").fadeOut(300); //.fadeIn(300);
        });
        $(".wb_boxnr").each(function () {
            var outtime = setTimeout;
            var wb_tac2 = $(this).find(".wb_tac");
            function _hide() {
                $(wb_tac2).hide();
            }
            $(this).find(".aname").hover(function () {
                $(wb_tac2).stop();
                clearTimeout(outtime);
                $(wb_tac2).fadeIn(300);
            }, function () {
                outtime = setTimeout(_hide, 500);
            });

            $(this).find(".wb_boximg .head img").hover(function () {
                clearTimeout(outtime);
                $(wb_tac2).stop();
                $(wb_tac2).fadeIn(300);
            }, function () {
                outtime = setTimeout(_hide, 500);
            });

            $(wb_tac2).hover(function () {
                clearTimeout(outtime);
                $(this).show();

            }, function () {
                $(this).fadeOut(500);
            });

            $(this).find(".jiagz a").unbind("click").click(function () {
                $(this).html("提交中...");
                Analysis.addAttention(null, this);
            });
        });
    }

    /*===================================
    *           创建话题
    *====================================
    */
    Analysis.CreateTopicAnalysis = function () {
        Common.ValIsEmpty("btn_close", "topic_content_txt", "txtKWNameCheck");
        Common.CheckWord("topic_content_txt", "promptContent", 100);
        $("#show_topic_div").click(function () {
            if (Analysis.catcheData.items.length > 0) {
                Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
            } else {
                alert("请选择话题");
            }
        });
        $("#close_topic_div").click(function () {
            $("#topic_analysis_div").hide();
        });
        $("#topic_content_txt")
            .focusout(function () {
                var txtLength = Math.floor(Common.GetShortWord($("#topic_content_txt").val())) / 2;
                if (txtLength > 50) {
                    alert("超过字数限制");
                    return;
                }
                if (txtLength > 0)
                    $("#create_topic_analysis").unbind().click(Analysis.AddWeiboTopicAnalysis);
            });
    }
    Analysis.AddWeiboTopicAnalysis = function () {
        $("#create_topic_analysis").unbind();
        var catchD = Analysis.catcheData.items;
        if (catchD.length > 0) {
            var analysisdata = "";
            for (var i = 0; i < catchD.length; i++) {
                analysisdata += catchD[i].referenceid + "," + catchD[i].itemid + "," + catchD[i].websource + "|";
            }
            var data = { "data": analysisdata, "topicName": $("#topic_content_txt").val() };
            Analysis.getPostJson(Analysis.monitorInfoHander, data, Analysis.addWeiboTopicResult);
        }
    }
    Analysis.addWeiboTopicResult = function (data) {
        if (data && data.success == "1") {
            Common.SubmitPop("submitPopDiv");
            //加入分析成功
            Common.CloseEditFrame("sad", "layer");
            Analysis.catcheData.items.length = 0; // MonitorInfo.catchData.items.length = 0;
            $("input[type='checkbox']").removeAttr("checked");
            $("textarea").val("给微博话题取个名字吧...");
            $("#checknumber").empty().append("0");
        } else {
            alert("创建话题失败");
        }
    }
    /*================================
    =====     添加删除标记       =====
    ================================*/
    Analysis.markOperate = function (url, operate, callFun) {
        var refId = [];
        var catchD = Analysis.catcheData.items;
        for (var i = 0; i < catchD.length; i++) {
            refId.push(catchD[i].referenceid);
            //analysisdata += catchD[i].referenceid + "," +catchD[i].itemid + "," + catchD[i].websource + "|";
        }
        var refIds = refId.join(",");
        var data = { "refids": escape(refIds), "act": operate, "ajaxString": "1" };
        Analysis.getPostJson(url, data, callFun);
    }



    /*================================
    *           复选框操作
    *=================================
    */
    Analysis.clickAllCkbox = function () {
        $("#click_all_ckbox").click(function () {
            var ckd = this.checked;
            $("#list_body_div .wb_inputmar").each(function () {
                if (ckd) {//全选
                    if (!this.checked) {
                        var source = $(this).attr("webSource");
                        Analysis.catcheData.add(this.id, this.value, source);
                    }
                } else {//全不选
                    Analysis.catcheData.remove(this.id);
                }
                this.checked = ckd;
            });
            $("#checknumber").empty().append(Analysis.catcheData.items.length);
            Analysis.checkShow();
        });

    }
    Analysis.checkboxChange = function () {
        $("#list_body_div .wb_inputmar").die("click");
        $("#list_body_div .wb_inputmar").change(function () {
            if (this.checked) { //选中状态
                var source = $(this).attr("webSource");
                Analysis.catcheData.add(this.id, this.value, source);
            } else {
                //this.analysis.catcheData.remove(this.id);
                Analysis.catcheData.remove(this.id);
            }
            $("#checknumber").empty().append(Analysis.catcheData.items.length);
            var len = $("#list_body_div .wb_inputmar").length;
            var count = 0;
            $("#list_body_div .wb_inputmar").each(function () {
                if (this.checked) count++;
            });
            $("#click_all_ckbox").attr("checked", count == len);
        });
        Analysis.checkShow();
    }
    Analysis.checkShow = function () {//更新条件-显示选中的微博
        for (var i = 0; i < this.catcheData.items.length; i++) {
            var cid = "#" + this.catcheData.items[i].referenceid;
            $(cid).attr("checked", "checked");
        }
        //判断当页是否全选
        var len = $("#list_body_div .wb_inputmar").length;
        var count = 0;
        $("#list_body_div .wb_inputmar").each(function () {
            if (this.checked) count++;
        });
        $("#click_all_ckbox").attr("checked", count == len);
        $("#checknumber").empty().append(Analysis.catcheData.items.length);
    }

    //Idoal请求的微博列表
    Analysis.resultDataIdol = function (data) {
        var zfCount = 0;
        var plCount = 0;
        var domArray = [];
        var ids = [];
        $(this.viewId).empty()
        for (var i = 0; i < data.length; i++) {
            var bodydom = this.bodyTemp(data[i]);
            $(this.viewId).append(bodydom);
            zfCount = zfCount + parseInt(data[i].forwardNum);
            plCount = plCount + parseInt(data[i].replyNum);
            ids.push(data[i].reference);
        }
        $("#zhuanfaCount_b").html(zfCount);
        $("#pinglunCount_b").html(plCount);

        //显示精华评论
        if (ids.length > 0) {
            var data = { "action": "plcount", "ids": ids.join(",") };
            $.ajax("Handler/ReItemHandler.ashx", {
                type: "get",
                dataType: "json",
                data: data,
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        $("span[mid='" + data[i].MainID + "']").show();
                    }
                }, error: function () {
                    //$("#rankList").empty().append("暂无数据");
                }
            });
        }
        //收藏
        $("a[name='favorite']").click(function () {
            Analysis.initFavoriteEvent(this);
        });
    }
    Analysis.AttentionList = [];
    Analysis.provselect = Config.CityList;

    /*================================
    *           微博列表模板Idol
    *=================================
    */
    Analysis.bodyTemp = function (data) {
        //        var paramData = { "act": "delidoldata", "docid": ids.join('+'), "actiontype": Index.actionType };
        var attAttr = data.authorgtrueName + "_" + data.webSource;
        var temp = [];
        temp.push("<div class=\"wb_boxnr\" >");
        temp.push("<div class=\"wb_boximg\">");
        temp.push("<span class=\"head\"><img  src=\"" + data.profileImageUrl + "\" onerror=\"this.src='img/userdefault.jpg'\" ></span>");
        temp.push("<input id=\"" + data.reference + "\" name=\" \" type=\"checkbox\" value=\"" + data.itemId + "\" class=\"wb_inputmar\" webSource=\"" + data.webSource + "\" /> ");
        temp.push("</div> ");
        temp.push("<div class=\"wb_boxusernr\">");
        if (this.isLoadUserInfo) {
            //个人信息模板
            temp.push(this.userInfoTemp(data, attAttr));
        }
        //微博内容模板
        temp.push(this.weiboContext(data, attAttr));
        temp.push("</div>");
        temp.push("<div class=\"clear\"></div>");

        //微博按钮模板
        temp.push("<div class=\"new_top9\">");
        temp.push("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
        temp.push("<tr>");
        temp.push("<td>");
        //性质 正负中
        temp.push("<div class=\"msg\" style=\"display:none;\">");
        temp.push("<div class=\"msg_T\">");
        temp.push("<h1>本条微博属于" + (data.emotion == "2" ? "正面微博" : data.emotion == "0" ? "中性微博" : "负面微博") + "</h1>");
        temp.push("</div>");
        temp.push("<div class=\"msg_C\">");
        temp.push("<p>经系统判断，本条微博" + (data.emotion == "2" ? "具有正面倾向性" : data.emotion == "0" ? "基本中立，无明显倾向性" : "具有负面倾向性") + "</p>");
        temp.push("</div>");
        temp.push("<div class=\"msg_B\"></div>");
        temp.push("</div>");
        temp.push("<span class=\"icon\">");
        temp.push("<div class=\"msg_img\" style=\"display:none;\">");
        temp.push("<a href=\"javascript:void(0);\" act=\"trendicon\" title=\"正面\" value=\"2\"><img src=\"img/z.png\"></a>");
        temp.push("<a href=\"javascript:void(0);\" act=\"trendicon\" title=\"中性\" value=\"0\"><img src=\"img/zj.png\"></a>");
        temp.push("<a href=\"javascript:void(0);\" act=\"trendicon\" title=\"负面\" value=\"1\"><img src=\"img/f.png\"></a>");
        temp.push("</div>");
        if (data.emotion == "2")
            temp.push("<img  width=\"31\" height=\"27\" name=\"xingzhi\" src=\"img/btn_atti_zheng.png\">");
        else if (data.emotion == "0")
            temp.push("<img width=\"31\" height=\"27\" name=\"xingzhi\" src=\"img/btn_atti_zhong.png\">");
        else
            temp.push("<img width=\"31\" height=\"27\" name=\"xingzhi\" src=\"img/btn_atti_fu.png\">");
        temp.push("</span>");
        if (data.url) {
            temp.push("<a href=\"" + data.url + "\" target=\"_blank\"><b>" + data.timesTamp + "</b></a>"); /*时间*/
        }
        else {
            temp.push("<b>" + data.timesTamp + "</b>");
        }
        temp.push("　" + data.siteName); /*来源*/
        temp.push("</td>");
        temp.push("<td align=\"right\">");
        var websource = data.webSource;
        var isnull = true;
        var zhuanfa = data.url;
        var pinglun = data.url;
        if (data.url.replace(" ") == "") {
            var isnull = false;
        }
        var ws = parseInt(data.webSource);
        if (ws > 0) {
            pinglun += Analysis.pingLunUrl[ws];
            zhuanfa += Analysis.zhuanFaUrl[ws];
        }
        temp.push("<span><a href=\"" + zhuanfa + "\" target=\"_blank\">转发</a>（<b class=\"color_2\">" + data.forwardNum + "</b>）</span>"); /*转发量*/
        temp.push("|");
        temp.push("<span><a name=\"weiboComments\" href=\"" + pinglun + "\" mid=\"" + data.reference + "\">评论</a>（<b class=\"color_2\">" + data.replyNum + "</b>）</span>"); /*评论量*/
        temp.push("|");
        temp.push("<span style='display:none;' mid=" + data.reference + "><a name=\"weiboCommentsA\" href=\"javascript:void(0);\"  mid=\"" + data.reference + "\">精华评论</a></span>");
        temp.push("</td>");
        temp.push("<td align=\"right\" width=\"84\">");
        temp.push("<span class=\"btn\">");
        temp.push("<a class=\"btn_delete\" title=\"删除微博\" name='delidoldata' act='delidoldata' href=\"javascript:void(0);\"></a>");
        temp.push("<a class=\"btn_file\" title=\"加入素材库\" name='add_material_library' href=\"javascript:void(0);\"></a>");
        temp.push("<a " + (data.isFavorite == 1 ? "class=\"btn_nofavorite\" title=\"取消收藏\"" : "class=\"btn_favorite\" title=\"收藏\"") + " name=\"favorite\" pid=\"" + data.reference + "\"  href=\"javascript:void(0)\"></a>");
        temp.push("</span>");
        temp.push("</td>");
        temp.push("</tr>");
        temp.push("</table>");
        temp.push("</div>");

        temp.push("</div> ");

        var ml = temp.join("");
        var el = $(ml);
        el.hover(function () {
            $(this).addClass("on");
        }, function () {
            $(this).removeClass("on");
        });
        el.find("a[name='add_material_library']").unbind("click").bind("click", data, Analysis.addMaterialLibrary);
        el.find("a[name='delidoldata']").unbind("click").bind("click", data, Analysis.ExecuteDelIdolData);
        el.find("span div a[act = 'trendicon']").unbind("click").bind("click", data, Analysis.ExecuteUpdateTag);
        el.find("a[name='weiboCommentsA']").unbind("click").bind("click", data, PingLun.Init);
        //el.find("a[name='zhuanba_a']").unbind("click").bind("click", data, ZhuanFa.Init);
        return el;
    }
    Analysis.addMaterialLibrary = function (data) {
        var newData = data.data;
        newData.dreContent = Common.displayExpression(unescape(newData.dreContent));
        Material.addMaterial(newData);
    }
    //个人信息模板
    Analysis.userInfoTemp = function (data, attAttr) {
        var temp = [];
        temp.push("<div  class=\"wb_tac\" style=\"display:none\" >");
        temp.push("<div class=\"wb_tac2\">");
        temp.push("<div class=\"wb_boximg\">");
        if (data.isFollower == 1) {
            temp.push("<div class=\"wb_ygz\" id=\"" + attAttr + "\" ></div>");
        } else {
            temp.push("<div  id=\"" + attAttr + "\" ></div>");
        }
        temp.push("<span><img src=\"" + data.profileImageUrl + "\" onerror=\"this.src='img/userdefault.jpg'\"  /></span>"); /*头像*/
        temp.push("</div>");
        temp.push("<div class=\"wb_tacnr\">");
        temp.push("<b><a href=\"" + data.authorUrl + "\" target=\"_blank\">" + data.authorName + "</a></b>"); /*昵称*/
        data.isVip == "0" ? "" : temp.push("<img src=\"img/v.gif\" align=\"absmiddle\">"); /*是否加+V*/
        temp.push("<br />");

        temp.push("<span>关注:<b class=\"color_2\">" + data.friendsCount + "</b></span>| <span>微博:<b class=\"color_2\">" + data.statusesCount + "</b></span>|　<span>粉丝：<b class=\"color_2\">" + data.followersCount + "</b></span>");
        temp.push("<br />");
        temp.push(unescape(data.verifiedReason));
        temp.push("</div>");
        temp.push("<div class=\"jiagz\">");
        if (data.isFollower == 1) {
            temp.push("<a class=\"add_guan_zhu\" href=\"javascript:void(0)\" source=" + data.webSource + " nick=\"" + data.authorName + "\" name=\"" + data.authorgtrueName + "\" act=\"qx\">取消关注</a></div>"); /*取消关注*/
        } else {
            temp.push("<a class=\"add_guan_zhu\" href=\"javascript:void(0)\" source=" + data.webSource + " nick=\"" + data.authorName + "\" name=\"" + data.authorgtrueName + "\" act=\"tj\">添加关注</a></div>"); /*添加关注*/
        }
        temp.push("</div>");
        temp.push("<div class=\"clear\"></div>");
        temp.push(" </div>");
        return temp.join("");
    }
    //微博类容开始
    Analysis.weiboContext = function (data, attAttr) {
        var temp = [];
        temp.push(" <div class=\"wb_usertit\">");
        temp.push("<a name=\"userinfo_a\" class=\"aname\"  target=\"_blank\" href=\"" + data.authorUrl + "\"><b>" + data.authorName + "：</b></a>");
        temp.push(Common.displayExpression(unescape(data.dreContent)));

        if (data.thumbnailPic != "") {
            temp.push("<div class=\"wb_userimg\">");
            temp.push(" <a href=\"" + data.originalPic + "\" class=\"highslide\" onclick=\"return hs.expand(this)\">");
            temp.push("<img src=\"" + data.thumbnailPic + "\"  /></a>");
            temp.push("</div>");
        }
        temp.push("<div style=\"display:none\" class=\"wb_pl\" id=pl" + data.reference + "><a class=\"btn_close\" href=\"javascript:\" title=\"关闭\"></a><ul><li></li></ul><div class=\"page\" id=plpage" + data.reference + "></div> </div>");
        temp.push("</div>");
        return temp.join("");
    }
    Analysis.userInfoTemp2 = function (data) {
        var infoJson = []; //
        infoJson.push("<div class=\"wb_xqboximg\">");
        infoJson.push("<img src=\"" + (data.avartarLarge || data.profileImageUrl) + "\" onerror=\"this.src='" + data.profileImageUrl + "'\" ></div>");
        infoJson.push("<div class=\"wb_xqtacnr\">");
        infoJson.push("<h1>");
        infoJson.push(data.authorName);

        data.isVip == "0" ? "" : infoJson.push("<img src=\"img/v.gif\" align=\"absmiddle\">");
        infoJson.push("</h1>");
        infoJson.push("<br />关注：<b class=\"color_2\">" + data.friendsCount + "</b>");
        infoJson.push("<br />微博：<b class=\"color_2\">" + data.statusesCount + "</b>");
        infoJson.push("<br />粉丝：<b class=\"color_2\">" + data.statusesCount + "</b>");

        infoJson.push("<br />" + data.authorUrl);
        infoJson.push("<br />" + unescape(data.verifiedReason));
        infoJson.push("<br /><a class=\"btn\" id=\"show_timer_trend\">用户行为分析</a>");
        infoJson.push("</div>");
        //alert(data.isFollower);
        if (data.isFollower == 1) {
            infoJson.push("<div class=\"jiagz\"><a class=\"add_guan_zhu\" href=\"javascript:void(0)\" source=" + data.webSource + " nick=\"" + data.authorName + "\" name=\"" + data.authorgtrueName + "\" act=\"qx\">取消关注</a></div>"); /*取消关注*/
        } else {
            infoJson.push("<div class=\"jiagz\"><a class=\"add_guan_zhu\" href=\"javascript:void(0)\" source=" + data.webSource + " nick=\"" + data.authorName + "\" name=\"" + data.authorgtrueName + "\" act=\"tj\">添加关注</a></div>"); /*添加关注*/
        }

        //infoJson.push("<div class=\"jiagz\"><a id=\"cancel_attention_a\"  class=\"add_guan_zhu\" href=\"javascript:void(0)\" source=" + data.webSource + " nick=\"" + data.authorName + "\" name=\"" + data.authorgtrueName + "\" act=\"qx\">取消关注</a></div>"); /*取消关注*/
        infoJson.push("<div class=\"clear\"></div>");
        return infoJson.join("");
    }


}

/*页面数据Data*/
function CatcheInfoData() {
    this.items = new Array();
    this.add = function (refid, itemid, websource) {
        var model = new Object();
        model.referenceid = refid;
        model.itemid = itemid;
        model.websource = websource;
        this.items.push(model);
    }
    this.remove = function (id) {
        var count = 0;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].referenceid != id) {

                this.items[count] = this.items[i];
                count = count + 1;
            }
        }
        if (this.items.length > count) {
            this.items.length -= 1;
        }
    }
}





