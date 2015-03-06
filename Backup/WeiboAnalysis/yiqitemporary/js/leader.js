/// <reference path="jquery-1.8.1.js" />


$(document).ready(function () {
    Common.InnitCategoryList = function (data) {
        Leader.InitCategoryTabList(data);
    }
    Common.LoginEventFn = function (data) {
        Leader.UserInfo = data;
        Leader.InnitClusters();
        Leader.init();
    }

    Common.CheckUser();
});
var _leader = new Object;
var Leader = _leader.property = {
    UserInfo: Object,
    ClustersList: { "society_clusters": "SAFEJOB_CLUSTERS" },
    init: function () {
        /*舆情推送信息*/
        $.post("Handler/SqlSearch.ashx",
            { "action": "getleaderinfo" },
            function (data) {
                if (data) {
                    delete data["Success"];
                    var listhtml = [];
                    for (var item in data) {
                        var row = data[item];
                        var listtitle = unescape(row["title"]);
                        var dislisttitle = Common.SliceStr(listtitle, 16);
                        listhtml.push("<li><a title=\"" + listtitle + "\" target=\"blank\" href=\"snapshot.html?url=" + row.href + "\">");
                        listhtml.push("<span ");
                        if (row["type"] == "1") {
                            listhtml.push("class=\"text color_2\"");
                        } else {
                            listhtml.push("class=\"text color_1\"");
                        }
                        listhtml.push(">" + dislisttitle + "</span><span class=\"date\">" + unescape(row.time));
                        listhtml.push("</span><span class=\"rss\">【" + unescape(row.site) + "】</span></a>");
                        listhtml.push("<a target=\"blank\" class=\"btn_link\"");
                        listhtml.push(" href=\"list.html?url=" + row.href + "\">【相关资讯】</a></li>");
                    }
                    $("#SearchResult").empty().html(listhtml.join(""));
                }
            },
            "json"
        );
        /*舆情视频推送信息*/
        Leader.InitVideo();

        $("#yqinfo_tb li").unbind("click").bind("click", function () {
            $("#searchresult_plan,#video_plan").hide();
            $("#yqinfo_tb li").attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            var plan = $(this).attr("plan");
            var machelink = $(this).attr("link");
            $("#machlink").attr("href", machelink);
            $("#" + plan).show();
        });
    },
    InitVideo: function () {

        var pageInitParameter = { "page_size": 2, "result_id": "SearchVideo", "status_bar_id": "pagebar", "post_url": "../Handler/Search.ashx" };
        var videoIdolParameter = { "display_style": 9, "act": "weiboVideoCountent", "action": "query",
            "characters": "300", "mindate": "", "maxdate": "",
            "database": "NewVideo", "totalresults": "True", "summary": "context",
            "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false"
        };

        var filetextArray = [];
        filetextArray.push("MATCH{cntv}:SITENAME");
        filetextArray.push("EXISTS{}:DRETITLE ");
        //filetextArray.push("NOTEQUAL { 桑武 }:DRECONTENT ");
        videoIdolParameter["fieldtext"] = filetextArray.join(" AND ");
        videoIdolParameter["text"] = "*"
        if (Leader.UserInfo.userName != "管理员") {
            videoIdolParameter["text"] = "\"" + Leader.UserInfo.userName + "\"" + " OR (* NOT (" + Config.LeaderVideoKeyWork + "))";
        }

        //http: //202.165.182.91:9000/action=query&print=all&characters=300&summary=context&predict=false&sort=Date&start=1&totalresults=True&fieldtext=NOTMATCH{asdf}:SITENAME&databasematch=NewVideo&maxresults=10&text="冯某某" OR (* NOT ("消防","桑武"))
        var Lpager = new Pager(pageInitParameter);
        Lpager.Display = function (data, obj) {
            $("#SearchVideo").empty();
            if (data["Success"] == 1) {
                for (var i = 0; i < data.data.length; i++) {
                    var newdata = data.data[i];
                    newdata.href = unescape(newdata.href);
                    newdata.title = unescape(newdata.title);
                    newdata.content = unescape(newdata.allcontent);
                    newdata.siteName = unescape(newdata.siteName);
                    var doc = [];
                    doc.push("<div class=\"wb_boxnr\">");
                    doc.push("<div class=\"vidio_tit left\">");
                    doc.push("<a href=\"" + newdata.href + "\" target=\"_blank\">");
                    doc.push(newdata.title);
                    doc.push("</a></div>");
                    doc.push("<div class=\"wbimg_vidio left\">");
                    doc.push("<div class=\"btn_vidio\">");
                    doc.push("<a href=\"javascript:void(0)\"  ><img src=\"img/btn_vidio.gif\"  /></a></div>");
                    doc.push("<a href=\"javascript:void(0)\">");
                    doc.push("<img onerror=\"this.src='" + data.data[i].videoThumbPic + "'\" src=\"" + Config.VideoHost + "video/" + newdata.videoThumbPic + "\" /></a></div>");
                    doc.push("<div class=\"wbnr_vidio left\">");
                    doc.push("<div class=\"vidio_titnr\">");
                    doc.push(newdata.content);
                    doc.push("</div>");
                    doc.push("<div class=\"vidio_date\">");
                    doc.push(newdata.datetime);
                    doc.push("</div>");
                    doc.push("</div>");
                    doc.push("<div class=\"clear\"></div>");
                    doc.push("</div>");

                    //return doc.join("");
                    var html = doc.join("");
                    var _doc = $(html);

                    $(_doc).find("#.wbimg_vidio a").unbind().bind("click", newdata, MyVideo.playVideo);
                    // $(_doc).find("a[name='add_material_library_a']").unbind().bind("click", d, MyVideo.playVideo);
                    //return _doc;

                    //                    var liList = [];
                    //                    liList.push("<li>");
                    //                    liList.push("<a href=\"javascript:void(0);\">");
                    //                    liList.push("<span class=\"img\"><img src=\"" + Config.VideoHost + "video/" + data.data[i].videoThumbPic + "\"/></span>");
                    //                    liList.push("<span class=\"text\">" + unescape(data.data[i].title) + "</span>");
                    //                    liList.push("<span class=\"date\">" + data.data[i].datetime.split(' ')[0].replace(/\//g, "-") + "</span>");
                    //                    //liList.push("<span class=\"text\">" + unescape(data.data[i].allcontent) + "</span>")
                    //                    liList.push("</a>");
                    //                    liList.push("</li>");

                    //                    var html = liList.join("");
                    //                    var _doc = $(html);
                    //                    var d = data.data[i];
                    //                    $(_doc).find("a").unbind().bind("click", d, MyVideo.playVideo);

                    $("#SearchVideo").append(_doc);
                }
            }
            //Common.InitMarquee("video_list", 2, 340, 200, 5000);
        };
        Lpager.LoadData(1, videoIdolParameter);
    },
    InitCategoryTabList: function (data) {
        var list = data["subnav_1"];
        var content = [];
        content.push("<li class=\"tab_on\" pid=\"index.html\">首页</li>");
        for (var item in list) {
            var categoryname = unescape(list[item]);
            content.push("<li class=\"tab_off\" pid=\"" + item.split('_')[0] + "\">" + categoryname + "</li>");
        }
        $("#category_list").empty().html(content.join(""));
        var catetegory_list = $("#category_list").children("li");
        catetegory_list.css("cursor", "pointer").click(function () {
            catetegory_list.attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            var categoryid = $(this).attr("pid");
            var categoryname = $.trim($(this).html());
            if (categoryid == "index.html") {
                window.open("index.html");
            } else {
                window.open("ylfl.html?categoryid=" + categoryid + "_&categoryname=" + categoryname);
            }
        });
    },
    /*拼接热点聚焦HTML*/
    InnitClusters: function (clusters_list) {
        var params = Leader.GetClustersParams(clusters_list);
        $.post("Handler/NewIndex.ashx",
            params,
            function (data) {
                delete data["SuccessCode"];
                var clusterdata = null;
                if (clusters_list) {
                    clusterdata = clusters_list;
                } else {
                    clusterdata = Leader.ClustersList;
                }
                for (var item in clusterdata) {
                    var key = clusterdata[item];
                    var row = data[key];
                    var content = [];
                    var count = 1;
                    var tag = false;
                    delete row["SuccessCode"];
                    for (var entity in row) {
                        var rowlist = row[entity];
                        delete rowlist["SuccessCode"];
                        if (Common.GetJSONLength(rowlist) > 0) {
                            if (count == 1) {
                                content.push("<li name=\"clusters_list\" class=\"tab_on\">");
                            } else {
                                content.push("<li name=\"clusters_list\" class=\"tab_off\">");
                            }

                            var itemcount = 1;
                            for (var one in rowlist) {
                                var itemlist = rowlist[one];
                                var basetitle = unescape(itemlist["title"]);
                                var title = Common.SliceStr(basetitle, 18);
                                if (itemcount == 1) {
                                    content.push("<a name=\"look_info_snapshot\" href=\"" + unescape(itemlist["href"]) + "\" target=\"_blank\" title=\"" + basetitle + "\">");
                                    content.push("<span class=\"text font_2\">" + title);
                                    content.push("</span><span class=\"rss\">【" + unescape(itemlist["site"]) + "】");
                                    content.push("</span><span class=\"date\">" + unescape(itemlist["time"]) + "</span></a>");
                                    if (count == 1) {
                                        content.push("<ul class=\"news_list\">");
                                    } else {
                                        content.push("<ul class=\"news_list\" style=\"display:none;\">");
                                    }
                                }
                                else {

                                    content.push("<li><a name=\"look_info_snapshot\" target=\"_blank\" href=\"" + unescape(itemlist["href"]) + "\" title=\"" + basetitle + "\">");
                                    content.push("<span class=\"text color_7\">" + title + "</span></a></li>");

                                }
                                itemcount++;
                            }
                            content.push("</ul>");
                            count++;
                            content.push("</li>");
                        }
                    }
                    $("#" + item).empty().html(content.join(""));
                    Common.InitWebURL(item, "look_info_snapshot");
                    Leader.InnitClustersHoverFn(item);
                }
            },
            "json"
        );
    },
    /*定义聚焦的鼠标移动事件*/
    InnitClustersHoverFn: function (id) {
        $("#" + id).children("li").hover(function () {
            $("#" + id).find("li[name='clusters_list']").attr("class", "tab_off");
            $("#" + id).find("ul").hide();
            $(this).find("ul").show();
            $(this).attr("class", "tab_on");
        }, function () {

        });
    },
    GetClustersParams: function (l_data) {
        var params = {};
        var data = {};
        if (l_data) {
            data = l_data;
        } else {
            data = Leader.ClustersList;
        }
        var count = 1;
        for (var item in data) {
            $("#" + item).empty().html("<img src=\"img/loading_icon.gif\" alt=\"loading...\" />");
            params["type_" + count] = data[item];
            count++;
        }
        return params;
    }
}
var MyVideo = {
    playVideo: function (data) {
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