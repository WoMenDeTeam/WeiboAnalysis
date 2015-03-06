
function InitPage(params) {
    // Common.LoginInitFun = function () {
    var InitType = params["type"];
    var statrPage = params["page"];
    var reg = /^\d+$/;
    if (reg.test(statrPage)) {
        Topic.startPage = statrPage;
    }
    if (reg.test(InitType)) {
        Topic.loadWeiboTopic(InitType);
        $("#stateTab").find("li").eq(InitType).addClass("on");
        Topic.initEvent();
    }
    //加载左边列表
    HotWeiboUser.GetHotUser({}, null);
    //   }
    // Common.CheckUser();
}
var _topic = new Object;
var Topic = _topic.property = {
    topicQueryParams: { "action": "weibotopiccontent", "topickeywds": "", "orderby": "", "where": ""
    },
    topicInitData: { "page_size": 10, "result_id": "topicList", "status_bar_id": "topic_pager_list",
        "info_id": "topic_pager_list", "sql_tag": "item", "web_url": "Handler/SqlSearch.ashx"
    },
    startPage: 1,
    initEvent: function () {
        Common.ValIsEmpty("btn_close", "txtTopicName", "txtKWNameCheck");
        Common.CheckWord("txtTopicName", "promptContent", 100);
        $("#stateTab").find("a").unbind("click").click(function () {
            $(this).parent().siblings().removeClass();
            $(this).parent().addClass("on");
            Topic.loadWeiboTopic($(this).attr("pid"));
        });
        $("#btnAddT").unbind("click").click(function () {
            $("#btnAddT").attr("visible", "true");
            var tab = $("#txtTopicName").attr("tab");
            var ne = $("#txtTopicName").val();
            $("#txtTopicName").focus();
            var sid = $("#txtTopicName").attr("sid");
            if (Math.floor(Common.GetShortWord($("#txtTopicName").val())) / 2 > 50) {
                alert("超过字数限制");
                return;
            }
            if (ne == "") {
                return;
            }

            $("#generateWeiboDataDiv").show();
            var act = { "act": "updateTopic", "tName": ne, "sid": sid };
            var set_url = "Handler/WeiboTopicHandler.ashx";
            $.post(set_url, act, function (data) {
                if (data && data["Success"] == "1") {
                    Common.CloseEditFrame("sad", "layer");
                    $("#generateWeiboDataDiv").hide();
                    Common.SubmitPop("submitPopDiv");
                    Topic.loadWeiboTopic(tab);
                }
            }, "json");

        });
        $("#btnReset").unbind("click");
        $("#btnReset").click(function () {
            clearhid();
        });

    },
    loadWeiboTopic: function (state) {
        if (state == "0") {
            Topic.topicQueryParams["where"] = "IsDel=0 and (JobState ='1' or JobState='2' or JobState='0')";
            Topic.topicQueryParams["orderby"] = "JobState DESC,StartTime";
        }
        else {
            Topic.topicQueryParams["where"] = "IsDel=0 and jobstate = '3'";
            Topic.topicQueryParams["orderby"] = "";
        }
        var sp = new SqlPager(Topic.topicInitData);
        sp.Display = function (data, l_obj) {
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            var count = 1;
            var entity = data["entity_" + count];
            var weibo_topics = [];
            while (entity) {
                var jobState = unescape(entity["JOBSTATE"]);
                var topicId = entity["ID"];
                var topicName = unescape(entity["NAME"]);
                var topicKeywords = unescape(entity["Keywords"]);
                var titleName = "";
                titleName = unescape(topicName);
                titleName = titleName.length > 24 ? titleName.substring(0, 24) : titleName;
                weibo_topics.push("<li>");
                var searchWeibo = "javascript:Top.loadTopicOfWeibo('topicOfWeibo.html','" + topicName + "','" + topicId + "','" + jobState + "'," + this.currPageIndex + ")";
                if (state == "0") {
                    if (jobState == "2") {
                        weibo_topics.push("<span title='" + unescape(topicName) + "' class=\"text\" name=\"topicName\">");
                        weibo_topics.push(titleName); //unescape(entity["NAME"]));
                        weibo_topics.push("</span>");
                        weibo_topics.push("<img src=\"img/jsz.gif\" class=\"left\"  />");
                    }
                    else if (jobState == "1" || jobState == "0") {
                        weibo_topics.push("<a class=\"btn_type" + jobState + "\" pid=\"" + topicId + "\"  tab=\"0\" jstate=\"" + jobState + "\" name=\"changeState\" href=\"javascript:void(null);\"></a>");
                        weibo_topics.push("<span title='" + unescape(topicName) + "' class=\"text\" name=\"topicName\">");
                        weibo_topics.push(titleName); //unescape(entity["NAME"]));
                        weibo_topics.push("</span>");
                    }
                    weibo_topics.push("<span class=\"btn\" style=\"display:none;\">");
                    weibo_topics.push("<input type=\"hidden\" id=\"topic_" + topicId + "_hid\" tname=\"" + topicName + "\"  />");
                    weibo_topics.push("<a class=\"btn_edit\" title=\"编辑话题名称\" name=\"weibo_topic_edit\" tab=\"1\" pid=\"topic_edit_" + topicId + "\" href=\"javascript:void(null);\"></a>");
                    weibo_topics.push("<a class=\"btn_messenger\" title=\"查看话题微博\" href=\"" + searchWeibo + "\"></a>");
                    weibo_topics.push("<a class=\"btn_case\" title=\"导入案例库\" name=\"create_anli\" tab=\"1\" tkeywords=\"" + topicKeywords + "\"  tname=\"" + topicName + "\" pid=\"topic_del_" + topicId + "\" href=\"javascript:void(null);\"></a>");
                    weibo_topics.push("<a class=\"btn_delete\" title=\"删除话题\" name=\"weibo_topic_del\" tab=\"1\" pid=\"topic_del_" + topicId + "\" href=\"javascript:void(null);\"></a>");
                    weibo_topics.push("</span>");
                }
                else {
                    var onclick = "Top.loadWeiBoStatisticPage('weiboStatistics.html','" + topicId + "','" + unescape(topicName) + "','" + this.query_params["Start"] + "')";
                    weibo_topics.push("<span class=\"text\" name=\"topicName\"><a  title=" + unescape(topicName) + " onclick=\"" + onclick + "\">" + titleName + "</a></span>");
                    weibo_topics.push("<span class=\"btn\" style=\"display:none;\">");
                    weibo_topics.push("<input type=\"hidden\" id=\"topic_" + topicId + "_hid\" tname=\"" + topicName + "\"  />");
                    weibo_topics.push("<a class=\"btn_edit\" title=\"编辑话题名称\" name=\"weibo_topic_edit\" tab=\"1\" pid=\"topic_edit_" + topicId + "\" href=\"javascript:void(null);\"></a>");
                    weibo_topics.push("<a class=\"btn_delete\" title=\"删除话题\" name=\"weibo_topic_del\" tab=\"1\" pid=\"topic_del_" + topicId + "\" href=\"javascript:void(null);\"></a>");
                    weibo_topics.push("<a class=\"btn_messenger\" title=\"查看话题微博\" href=\"" + searchWeibo + "\"></a>");
                    weibo_topics.push("<a class=\"btn_case\" title=\"导入案例库\" name=\"create_anli\"  tkeywords=\"" + topicKeywords + "\"  tname=\"" + topicName + "\" pid=\"topic_del_" + topicId + "\" href=\"javascript:void(null);\"></a>");
                    weibo_topics.push("<a class=\"btn_renew\" title=\"更新分析数据\" pid=\"" + topicId + "\"  tab=\"1\" jstate=\"" + jobState + "\" name=\"changeState\" href=\"javascript:void(null);\"></a>");
                    weibo_topics.push("</span>");
                }
                weibo_topics.push("<code>");
                weibo_topics.push(unescape(entity["STARTTIME"]));
                weibo_topics.push("</code>");
                weibo_topics.push("</li>");
                entity = data["entity_" + (++count)];
            }
            $("#topicList").empty().html(weibo_topics.join(""));
            Topic.loadWeiboTopicAtag();
        }
        sp.LoadData(Topic.startPage, Topic.topicQueryParams);
    },
    loadWeiboTopicAtag: function () {
        $("#topicList li").unbind("hover").hover(function () {
            $(this).addClass("on");
            $(this).find("span.btn").show();
        }, function () {
            $(this).removeClass("on");
            $(this).find("span.btn").hide();
        });

        $("#topicList").find("a[name='changeState']").unbind("click").click(function () {
            var tid = $(this).attr("pid");
            var jobState = $(this).attr("jstate");
            var tab = $(this).attr("tab");
            $.post("Handler/WeiboTopicHandler.ashx", { "act": "updateJobState", "topicid": tid, "jobstate": jobState },
                     function (data) {
                         if (data && data["Success"] == 1) {
                             //Common.CloseEditFrame("sad", "layer");
                             Common.SubmitPop("submitPopDiv");
                             Topic.loadWeiboTopic(tab);
                         } else {
                             alert("操作失败");
                         }
                     }, "json"
                  );
        });
        $("#topicList").find("a[name='weibo_topic_edit']").unbind("click").click(function () {
            var tid = $(this).attr("pid").split("_")[2];
            var hid = $("#topic_" + tid + "_hid");
            var tab = $(this).attr("tab");
            $("#txtTopicName").val(unescape(hid.attr("tname")));
            $("#txtTopicName").attr("sid", tid);
            $("#txtTopicName").attr("stype", "edit");
            $("#txtTopicName").attr("tab", tab);
            $("#generateWeiboDataDiv").hide();
            Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        });
        $("#topicList").find("a[name='create_anli']").unbind("click").click(function () {
            var eventName = $(this).attr("tname");
            var tkeywords = $(this).attr("tkeywords");
            var data = { "action": "createevent", "EventName": eventName, "EventKeywords": "" };
            $.ajax("../../Handler/CaseLibraryHandler.ashx", {
                type: "post",
                dataType: "json",
                data: data,
                beforeSend: function () {
                },
                success: function (data) {
                    if (data.success == 2) {
                        $("#msgcontent").html("已添加至案例库");
                        Common.CloseEditFrame("sad", "layer");
                        Common.SubmitPop("showmsg");
                    } else if (data.success == 1) {
                        $("#msgcontent").html("已添加至案例库");
                        Common.CloseEditFrame("sad", "layer");
                        Common.SubmitPop("showmsg");
                    }
                },
                error: function () {
                }
            });
        });
        $("#topicList").find("a[name='weibo_topic_del']").unbind("click").click(function () {
            var tid = $(this).attr("pid").split("_")[2];
            var tab = $(this).attr("tab");
            if (confirm("确认删除吗？")) {
                $.post("Handler/WeiboTopicHandler.ashx", { "act": "delTopic", "cateid": tid },
                     function (data) {
                         if (data && data["Success"] == 1) {
                             Common.CloseEditFrame("sad", "layer");
                             Common.SubmitPop("submitPopDiv");
                             Topic.loadWeiboTopic(tab);
                         }
                     }, "json");
            }
        });
    }
}