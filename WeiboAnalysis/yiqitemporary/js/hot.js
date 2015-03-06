var map_time_id;
$(document).ready(function() {
    Common.LoginEventFn = function() {
        Hot.innit(null, "safety");
        //Hot.innit(null, "news");
        //Hot.innit(null, "bbs");
        //Hot.innit(null, "blog");

        Hot.InnitSelectDate("safety");
        //Hot.InnitSelectDate("news");
        //Hot.InnitSelectDate("bbs");
        //Hot.InnitSelectDate("blog");
    }
    Common.CheckUser();
});

var _hot = new Object;
var Hot = _hot.property = {
    HotMapJoblist: {
        "safety": { "safejob_clusters": "总体趋势图" },
        "news": { "safejob_clusters": "总体趋势图" }
    },
    innit: function(l_job_name, type) {
        var job_name = null;
        if (!l_job_name) {
            var job_list = [];
            var current = Hot.HotMapJoblist[type];
            for (var item in current) {
                job_list.push("<option value=\"" + item + "\">" + current[item] + "</option>");
            }
            $("#job_list_" + type).empty().html(job_list.join(""));
            job_name = $("#job_list_" + type).val();
        } else {
            job_name = l_job_name;
        }
        $.post("Handler/ClusterJobTime.ashx",
            { "job_name": job_name },
            function(data) {
                if (!data || data.length == 0) {
                    $("#hot_image_" + type).html("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\"><tr><td align=\"center\">没有相关数据！</td><tr></table>");
                }
                else {                    
                    delete data["SuccessCode"];
                    var content = [];
                    var time_str = null;
                    for (var item in data) {
                        content.push("<option value=\"");
                        content.push(data[item]);
                        content.push("\">");
                        content.push(Hot.getTimeStr(data[item]));
                        content.push("</option>");
                        time_str = data[item];
                    }
                    //$("#HotImg_" + type).attr("src", Common.IdolHttp + "/action=ClusterServe2DMap&SourceJobname=" + job_name + "&enddate=" + time_str);
                    $("#input_data_" + type).html(content.join(""));
                    $("#input_data_" + type).val(time_str);
                    var scal_size = 352 / 525.0;
                    var s = { "scal_size": scal_size, "height_size": scal_size, "end_date": time_str, "job_name": job_name, "type": type };
                    Hot.HotMapData(s, "", type);
                }
            },
            "json"
        );

    },
    GetClusterResults: function(cluster_id, end_date, job_name, type) {
        $("#whats_hot_" + type).html("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\"><tr><td align=\"center\">热点数据加载中……</td><tr></table>");

        $.get("Handler/GetClusterResults.ashx", { 'cluster_id': cluster_id, "end_date": end_date, "job_name": job_name, "type": type },
            function(data) {
                //$("#hot_prompt").empty();
                if (!data || data.length == 0) {
                    $("#whats_hot_" + type).empty().html("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\"><tr><td align=\"center\">没有相关数据！</td><tr></table>");
                    $("#whats_hot_" + type).show();
                }
                else {
                    $("#whats_hot_" + type).empty().html(data);
                    Common.InitWebURL("whats_hot_" + type, "look_info_snapshot");
                    $("#whats_hot_" + type).show();
                }
            }
        );

            $("#HotImg_" + type).attr("src", Config.IdolImgUrl + "?action=ClusterServe2DMap&SourceJobname=" + job_name + "&enddate=" + end_date);

    },
    HotMapData: function(s, page_tag, type) {
        $.ajax({
            type: "get",
            url: "Handler/GetMapData.ashx",
            data: s,
            beforeSend: function(XMLHttpRequest) {
                $("#hot_image_" + type).html("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\"><tr><td align=\"center\">热点数据加载中……</td><tr></table>");
            },
            success: function(data, textStatus) {
                if (!data || data.length == 0) {
                    $("#whats_hot_" + type).empty().html("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\"><tr><td align=\"center\">没有相关数据！</td><tr></table>");
                }
                else {
                    var map = $("#mapData_" + type);

                    map.empty().html(data);
                    //隐藏文字说明
                    $("#mapData_" + type + " .node_text").each(function() {
                        $(this).hide();
                    });

                    $("#mapData_" + type + " .node").each(function() {
                        $(this).mouseover(function() {

                            var num = $(this).attr("id").split("_")[2];
                            $("#clustertitle_" + type + "_" + num).show();
                        });

                        $(this).mouseout(function() {

                            var num = $(this).attr("id").split("_")[2];
                            $("#clustertitle_" + type + "_" + num).hide();
                        });

                        $(this).click(function() {
                            $("#mapData_" + type + " .node").each(function() {
                                $(this).css("background", "red");
                            });
                            $(this).css("background", "green");
                            var cluster_id = $(this).attr("id").split("_")[2];
                            if (page_tag == "index") {
                                location.href = "hot.html";
                            }
                            else {
                                Hot.GetClusterResults(cluster_id, s.end_date, s.job_name, type);
                            }

                        });
                    }); //each end
                    $("#mapData_" + type + " .node:first").click();
                }
            },
            complete: function(XMLHttpRequest, textStatus) {
                $("#hot_image_" + type).html("<span class=\"color_2\">小提示</span>：在左侧图中点击岛屿中心的红色方块，即可在右侧查看相关聚类结果的文章列表。");
            },
            error: function() {
                //请求出错处理
            }
        });
    },
    InnitSelectDate: function(type) {
        $("#input_data_" + type).change(function() {
            $("#whats_hot_" + type).html("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\"><tr><td align=\"center\">热点数据加载中……</td></tr></table>");
            $("#mapData_" + type).html("");

            var job_name = $("#job_list_" + type).val();
            var cluster_date = $(this).val();
            if (cluster_date != "-1") {
                $("#HotImg_" + type).attr("src", Config.IdolImgUrl + "/action=ClusterServe2DMap&SourceJobname=" + job_name + "&enddate=" + cluster_date);
                var scal_size = 352 / 525.0;
                var s = { "scal_size": scal_size, "height_size": scal_size, "end_date": cluster_date, "job_name": job_name, "type": type };
                Hot.HotMapData(s, "", type);
            }
        });
        $("#job_list_" + type).change(function() {
            $("#whats_hot_" + type).html("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\"><tr><td align=\"center\">热点数据加载中……</td></tr></table>");
            $("#mapData_" + type).html("");

            var job_name = $("#job_list_" + type).val();
            Hot.innit(job_name, type);
        });
    },
    getTimeStr: function(time) {
        var l_time = new Date(parseInt(time) * 1000 + Common.TimeSpan * 24 * 60 * 60 * 1000);
        var year = l_time.getFullYear();
        var month = l_time.getMonth() + 1;
        var day = l_time.getDate();
        var hour = l_time.getHours();
        var minute = l_time.getMinutes();

        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;
        hour = (hour < 10) ? '0' + hour : hour;
        minute = (minute < 10) ? '0' + minute : minute;

        return year + "-" + month + "-" + day;
    }
}