/// <reference path="jquery-1.8.1.js" />



var YQVideo = {
    userInfo: Object,
    pageInitParameter: { "page_size": 10, "result_id": "SearchResult", "status_bar_id": "PagerList", "post_url": "../Handler/Search.ashx" },
    parameter: { "display_style": 9, "act": "weiboVideoCountent", "action": "query", "characters": "300", "mindate": "", "maxdate": "",
        "database": "NewVideo", "totalresults": "True", "summary": "context",
        "maxresults": "5", "fieldtext": "MATCH{cntv}:SITENAME AND EXISTS{}:DRETITLE", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false"
    },
    init: function (data) {
        YQVideo.userInfo = data;
        YQVideo.loadVideo();
        YQVideo.loadEvent();
    },
    loadEvent: function () {
        $("#result_type li").unbind("click").bind("click", function () {
            $("#result_type li").attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            var sitename = $(this).attr("pid");
            var filetextArray = [];
            if (sitename != undefined && sitename != "")
                filetextArray.push("MATCH{" + sitename + "}:SITENAME");
            filetextArray.push("EXISTS{}:DRETITLE ");
            YQVideo.parameter["fieldtext"] = filetextArray.join(" AND ");
            YQVideo.loadVideo();
        });
        $("#sort_tab li").unbind("click").bind("click", function () {
            $("#sort_tab li").attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            var short = $(this).attr("pid");
            YQVideo.parameter["sort"] = short;
            YQVideo.loadVideo();
        });
        $("#btn_look_result").unbind("click").bind("click", YQVideo.loadVideo);
    },
    loadVideo: function () {
        var sTime = $("#start_time").val();
        var eTime = $("#end_time").val();
        if (sTime) {
            YQVideo.parameter["mindate"] = Common.GetTimeStr(sTime);
        }
        if (eTime) {
            YQVideo.parameter["maxdate"] = Common.GetTimeStr(eTime);
        }
        //YQVideo.parameter["mindate"] = sTime == undefined ? "" : sTime;
        //YQVideo.parameter["maxdate"] = eTime == undefined ? "" : eTime;
        var SiteName = { "youku": "优酷", "cntv": "CNTV视频", "youku": "优酷视频", "tudou": "土豆视频", "sina": "新浪视频", "tencent": "腾讯视频", "ku6": "酷6视频", "oather": "其他" };
        var Lpager = new Pager(YQVideo.pageInitParameter);
        Lpager.Display = function (data, obj) {
            $("#SearchResult").empty();
            if (data["Success"] == 1)
                for (var i = 0; i < data.data.length; i++) {
                    var liList = [];

                    liList.push("<div class=\"wb_boxnr\"><div class=\"vidio_tit left\">");
                    liList.push("<a title=\"" + unescape(data.data[i].title) + "\" href=\"" + unescape(data.data[i].href) + "\" name=\"btn_look_info_snapshot\" target=\"_blank\">" + unescape(data.data[i].title) + "</a>");
                    liList.push("</div>");
                    liList.push("<div class=\"wbimg_vidio left\">");
                    liList.push("<div class=\"btn_vidio\">");
                    liList.push("<a name='play' href=\"javascript:void(0)\"><img src=\"img/btn_vidio.gif\" /></a></div>");
                    liList.push("<a name='play' href=\"javascript:void(0)\"><span class=\"img\"><img onerror=\"this.src='" + data.data[i].videoThumbPic + "'\"   src=\"" + Config.VideoHost + "video/" + data.data[i].videoThumbPic + "\"/></span></a>");
                    liList.push("</div>");
                    liList.push("<div class=\"wbnr_vidio left\">");
                    liList.push("<div class=\"vidio_titnr\">" + unescape(data.data[i].allcontent) + "</div>");
                    liList.push("<div class=\"vidio_date\">");
                    var sname = SiteName[data.data[i].siteName == undefined ? "oather" : data.data[i].siteName];
                    if (sname == undefined) {
                        sname = data.data[i].siteName;
                    }
                    liList.push(data.data[i].datetime.replace(/\//g, "-") + "　【" + sname + "】");
                    liList.push("</div>");
                    liList.push("</div>");
                    liList.push("<div class=\"clear\"></div>");
                    liList.push("</div>");

                    var html = liList.join("");
                    var _doc = $(html);
                    var d = data.data[i];
                    $(_doc).find("a[name='play']").unbind().bind("click", d, YQVideo.playVideo);
                    $("#SearchResult").append(_doc);
                }
        };
        Lpager.LoadData(1, YQVideo.parameter);

    }, getParameter: function () {

    }, playVideo: function (data) {
        Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        $("#btn_close").click(function () {
            jwplayer("video_div").stop();
        });
        $("#newsCount").html(unescape(data.data.title));
        var videoFileCount = data.data.videoFileCount;
        var videoFile = Config.VideoHost + "video/" + data.data.videofilePath;
        var img = Config.VideoHost + "video/" + data.data.videoThumbPic;
        var videoJson = [];
        var videoHostPath = Config.VideoHost + "video/";
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
    }

}