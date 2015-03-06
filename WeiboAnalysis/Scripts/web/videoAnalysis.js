/// <reference path="../common.js" />
/// <reference path="../jquery-1.8.1.js" />

var VideoAnalysis = {
    IdolParameter: { "display_style": 8, "act": "weiboVideoCountent", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false", "isNearTime": "false", "nearTime": "1,W" },
    PageInitParameter: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/WeiboEventHandler.ashx" },
    SiteNames: Config.SiteNames,
    Attention: {},
    Init: function () {
        Material.Init();
        this._Template = new Analysis();
        VideoAnalysis.IdolParameter["isNearTime"] = "true";
        VideoAnalysis.IdolParameter["nearTime"] = "1,W";
        this._Template.analysis.IdolParameter = this.IdolParameter;
        this.catchData = new CatcheInfoData();
        this._Template.analysis.Init();
        this._Template.analysis.loadAdvanceChange();
        VideoAnalysis.GetPostAjax({ "act": "getattention" }, this.LoadAttention);
        time = Config.GetTimeDDMMYYYY("/");
        $("#custom_end_time").val(time);
        //加载左边列表
        HotWeiboUser.GetHotUser({}, null);
    },
    isSaveHistory: false,
    advance: { "isVip": "0", "websource": "0", "province": "0" },
    _Template: null,
    LoadEvent: function () {
        this.changeTime();
        this.searchRecently();
        this.searchFixedTime();
        this.realTimeWeibo();
        this.forwardNumSort();
        this.replyNumSort();
        this.screeningWeibo();
        this.xgdSort();
    },
    LoadinImg: function () {
        $("#list_body_div").empty().append("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");
        $("#pagebar").empty();
    },
    LoadAttention: function (data) {
        VideoAnalysis.Attention = data;
        VideoAnalysis._Template.analysis.AttentionList = data;
        VideoAnalysis.GetPageAjax();
    },
    changeTime: function () {
        $("#wbdatesh_div ul li").click(function () {
            $("#wbdatesh_div ul li").removeClass("on");
            $(this).removeClass("on").addClass("on");
            var idx = $(this).index();
            $(".wb_currentnr").addClass("none_dis");
            $(".wb_currentnr:eq(" + idx + ")").removeClass("none_dis");
        });
    },
    searchRecently: function () {
        $("#recently_div li a").click(function () {
            VideoAnalysis.isSaveHistory = true;
            $("#recently_div li").removeClass("on");
            $(this).parent().removeClass("on").addClass("on");
            var res = $(this).removeClass("").attr("value");
            VideoAnalysis.IdolParameter["isNearTime"] = "true";
            VideoAnalysis.IdolParameter["nearTime"] = res;
            VideoAnalysis.IdolParameter["maxdate"] = "";
            VideoAnalysis.IdolParameter["mindate"] = "";
            VideoAnalysis.LoadinImg();
            VideoAnalysis.GetPageAjax();
        });
    },
    searchFixedTime: function () {
        $("#custom_search_btn").click(function () {
            VideoAnalysis.isSaveHistory = true;
            var startTime = $("#custom_start_time").val();
            var endTime = $("#custom_end_time").val();
            VideoAnalysis.IdolParameter["mindate"] = startTime;
            VideoAnalysis.IdolParameter["maxdate"] = endTime;
            VideoAnalysis.IdolParameter["isNearTime"] = "false";
            VideoAnalysis.LoadinImg();
            VideoAnalysis.GetPageAjax();
        });
    },
    sortByWhere: function (dom, sortWhere) {
        VideoAnalysis.isSaveHistory = false;
        $("#actionBtns li").removeClass("on");
        $(dom).addClass("on");
        VideoAnalysis.IdolParameter["sort"] = sortWhere;
        VideoAnalysis.LoadinImg();
        VideoAnalysis.GetPageAjax(); // GetPageAjax();
    },
    xgdSort: function () {
        $("#xgd_btn").click(function () {
            VideoAnalysis.sortByWhere(this, "Relevance");
        });
    },
    realTimeWeibo: function () {//实时微博
        $("#real_time_btn").click(function () {
            VideoAnalysis.sortByWhere(this, "Date");
        })
    },
    forwardNumSort: function () {//转发最多
        $("#hot_point_btn").click(function () {
            VideoAnalysis.sortByWhere(this, "FORWARDNUM:numberdecreasing");
        });
    },
    replyNumSort: function () {// 评论微博 
        $("#negative_btn").click(function () {
            VideoAnalysis.sortByWhere(this, "REPLYNUM:numberdecreasing");
        });
    },
    screeningWeibo: function () {//微博筛选
        $("#weibo_screening_btn").click(function () {
            VideoAnalysis.LoadinImg();
            VideoAnalysis.isSaveHistory = true;
            $("#recently_div li").removeClass("on");
            var startTime = $("#custom_start_time").val();
            var endTime = $("#custom_end_time").val();
            VideoAnalysis.IdolParameter["mindate"] = startTime;
            VideoAnalysis.IdolParameter["maxdate"] = endTime;
            VideoAnalysis.IdolParameter["isNearTime"] = "false";
            $("#advanced_search_div").hide();
            VideoAnalysis.GetPageAjax(); // GetPageAjax();
        });
    },
    catchData: new Object(),
    GetAttention: function () {
    },
    loadData: function (data) {
        data.href = unescape(data.href);
        data.title = unescape(data.title);
        data.creContent = unescape(data.creContent);
        data.siteName = unescape(data.siteName);
        var doc = [];
        doc.push("<div class=\"wb_boxnr\">");
        doc.push("<div class=\"wbimg_vidio\" id=\"btn_vidio\">");
        doc.push("<div class=\"btn_vidio\">");
        doc.push("<a href=\"javascript:void(0)\"  ><img src=\"img/btn_vidio.gif\"  /></a></div>");
        doc.push("<a href=\"javascript:void(0)\">");

        var src = data.videoThumbPic;
        var errorImgsrc = "this.src='" + Config.VideoDataBase["videoHost"] + "video/" + data.videoThumbPic + "'";

        doc.push("<img onerror=\"" + errorImgsrc + "\" src=\"" + src + "\" /></a>");
        doc.push("</div>");
        doc.push("<div class=\"wbnr_vidio\">");
        doc.push("<h1><a href=\"" + data.href + "\" target=\"_blank\">" + data.title + "</a></h1>");
        doc.push("<p>" + data.creContent + "</p>");
        doc.push("</div>");
        doc.push("<div class=\"clear\"></div>");

        //视频按钮模板
        doc.push("<div class=\"new_top9\">");
        doc.push("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
        doc.push("<tr>");
        doc.push("<td>");
        doc.push(data.datetime);
        doc.push(" " + VideoAnalysis.getSiteName(data.siteName));
        doc.push("</td>");
        doc.push("<td align=\"right\">");
        doc.push("<span class=\"btn\">");
        doc.push("<a class=\"btn_delete\" title=\"删除视频\" name=\"delidoldata\" act=\"delidoldata\" href=\"javascript:void(0);\"></a>");
        doc.push("<a class=\"btn_file\" title=\"加入简报夹\" name=\"add_material_library\" href=\"javascript:void(0);\"></a>");
        var url = Config.VideoDataBase["videoHost"] + "video/" + data.videofilePath;
        doc.push("<a class=\"btn_download\" title=\"下载视频\" name=\"\" href=\"" + url + "\"></a>");
        doc.push("</span>");
        doc.push("</td>");
        doc.push("</tr>");
        doc.push("</table>");
        doc.push("</div>");

        doc.push("</div>");

        //return doc.join("");
        var html = doc.join("");
        var _doc = $(html);
        $(_doc).find("#btn_vidio a").unbind().bind("click", data, VideoAnalysis.playVideo);
        $(_doc).find("a[name='add_material_library']").unbind().bind("click", data, VideoAnalysis.addMaterialLibrary);
        $(_doc).find("a[name='delidoldata']").unbind().bind("click", data, VideoAnalysis.executeDelIdolData);
        return _doc;
    },
    executeDelIdolData: function (data) {
        if (!confirm("确定删除吗?")) {
            return;
        }
        var docEL = this;
        var newdata = data.data;
        var param = { "acction": "deleteweibo", "TargetDatabaseName": Config.TargetDatabaseName, "docid": newdata.docId, "_t": new Date().getTime() };
        VideoAnalysis._Template.analysis.IdolDataToNewDatabase(param, function (d) {

            $(docEL).parents(".wb_boxnr").remove();
        });
    },
    addMaterialLibrary: function (data) {
        data = data.data;
        var newData = {};
        newData["profileImageUrl"] = "";
        newData["reference"] = data.videoId;

        newData["dreContent"] = unescape(data.creContent);
        // newData["thumbnailPic"] = Config.VideoDataBase["videoHost"] + "video/" + data.videoThumbPic; // unescape(data.Thumbnail_pic);
        newData["thumbnailPic"] = data.videoThumbPic;

        var websourceTitle = "";
        var switch_on = data.siteName
        websourceTitle = VideoAnalysis.getSiteName(switch_on);

        newData["authorName"] = websourceTitle;
        newData["siteName"] = websourceTitle;
        newData["url"] = unescape(data.href);
        newData["timesTamp"] = data.datetime;
        Material.addMaterial(newData);

    },
    getSiteName: function (key) {
        websourceTitle = VideoAnalysis.SiteNames[key];
        if (websourceTitle == undefined || websourceTitle == null || websourceTitle == "") {
            websourceTitle = key;
        }
        return websourceTitle;
    },
    playVideo: function (data) {
        Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        $("#btn_close").click(function () {
            jwplayer("video_div").stop();
        });
        $("#newsCount").html(data.data.title);
        var videoFileCount = data.data.videoFileCount;
        var videoFile = Config.VideoDataBase["videoHost"] + "video/" + data.data.videofilePath;
        var img = Config.VideoDataBase["videoHost"] + "video/" + data.data.videoThumbPic;
        var videoJson = [];
        var videoHostPath = Config.VideoDataBase["videoHost"] + "video/";
        var videoFileName = data.data.videofilePath;
        var videoName = videoFileName.split('_')[0];
        var videoType = videoFileName.split('.')[1];
        if (videoFileCount > 1) {
            for (var i = 0; i < videoFileCount; i++) {
                var newVideoName = videoHostPath + videoName;
                if (i < 10)
                    newVideoName += "_0" + i + "." + videoType;
                else
                    newVideoName += "_" + i + "." + videoType;
                videoJson[i] = { "file": newVideoName };
            }
        } else {
            videoJson[0] = { "file": videoFile }
        }
        jwplayer('video_div').setup({
            file: videoFile,
            width: "640",
            height: "360",
            primary: "flash",
            image: img,
            autostart: "true",
            playlist: videoJson
        });
    }, //请求列表Ajax
    GetPageAjax: function () {
        var filetextArray = [];
        var history = {};
        var condition = [];
        VideoAnalysis.IdolParameter["text"] = VideoAnalysis.getKeywords(); // keyWorde;
        var videoSuccess = $("#videosuccess_sct").val();
        if ("0" != videoSuccess) {
            filetextArray.push("MATCH{" + videoSuccess + "}:SITENAME");
        }
        filetextArray.push("EXISTS{}:DRETITLE ");
        VideoAnalysis.IdolParameter["fieldtext"] = filetextArray.join(" AND ");
        VideoAnalysis.IdolParameter["minscore"] = $("#minscore_txt").val();

        VideoAnalysis._Template.analysis.IdolParameter = VideoAnalysis.IdolParameter;

        if (VideoAnalysis.isSaveHistory)
            VideoAnalysis._Template.analysis.addHistory();
        $("#history_div ul li").click(function (d) {
            var index = $("#history_div ul li").index(this);
            VideoAnalysis._Template.analysis.IdolParameter = VideoAnalysis._Template.analysis.history[index].data;
            VideoAnalysis.LoadinImg();
            VideoAnalysis._Template.analysis.reductionHistory(index);
            VideoAnalysis._Template.analysis.showAdvanceCondition();
            VideoAnalysis.loadIdol();
        });
        VideoAnalysis.loadIdol();
    },
    getKeywords: function () {
        var keyword = $("#keyword_txt").val();
        if (keyword == "" || keyword == undefined || keyword == null) {
            keyword = "*";
        }
        var keywords = [];
        var newKeywords = [];
        if (keyword != "*") {
            keywords = keyword.split(" ");
        }
        for (var i = 0; i < keywords.length; i++) {
            newKeywords.push("\"" + keywords[i] + "\"");
        }
        if (keyword != "*") {
            keyword = newKeywords.join(" AND ");
        }
        return keyword;
    },
    loadIdol: function () {
        var Lpager = new Pager(VideoAnalysis.PageInitParameter);
        Lpager.Display = function (data) {
            //alert("Ok数据加载完成!");
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            $("#list_body_div").empty();
            var dataList = data.data;
            for (var i = 0; i < dataList.length; i++) {
                var doc = VideoAnalysis.loadData(dataList[i]);
                $("#list_body_div").append(doc);
            }
        };
        //鼠标背景色
        $("#list_body_div .wb_boxnr").hover(
            function () {
                $(this).addClass("on");
            },
            function () {
                $(this).removeClass("on");
            });

        Lpager.LoadData(1, VideoAnalysis._Template.analysis.IdolParameter);

    }, GetPostAjax: function (data, callback) {
        $.post("Handler/MonitorInfo.ashx", data, function (data) {
            callback(data);
        }, "json");
    }
}

$(document).ready(function () {
    VideoAnalysis.Init();
    VideoAnalysis.LoadEvent();
});





