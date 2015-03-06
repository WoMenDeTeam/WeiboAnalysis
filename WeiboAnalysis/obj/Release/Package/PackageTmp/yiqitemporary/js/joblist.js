$(document).ready(function() {
    Hot.innit();
    Hot.InnitSelectDate();
});

var _hot = new Object;
var Hot = _hot.property = {
    innit: function(job_name) {
        $.post("Handler/joblist.ashx",
            { "job_name": job_name },
            function(data) {
                if (data) {
                    if (job_name) {
                        var timelist = data[job_name];
                        Hot.InnitMapData(timelist);
                    } else {
                        delete data["SuccessCode"];
                        var jobcount = 1;
                        var job_list = [];
                        var data_list = [];
                        var time_str = null;
                        for (var jobname in data) {
                            job_list.push("<option value=\"");
                            job_list.push(jobname);
                            job_list.push("\">");
                            job_list.push(jobname);
                            job_list.push("</option>");
                            if (jobcount == 1) {
                                var jobtimelist = data[jobname];
                                delete jobtimelist["SuccessCode"];
                                for (var item in jobtimelist) {
                                    data_list.push("<option value=\"");
                                    data_list.push(jobtimelist[item]);
                                    data_list.push("\">");
                                    data_list.push(Hot.getTimeStr(jobtimelist[item]));
                                    data_list.push("</option>");
                                    time_str = jobtimelist[item];
                                }
                            }
                            jobcount++;
                        }
                        $("#job_list").empty().html(job_list.join(""));
                        $("#input_data").html(data_list.join(""));
                        $("#input_data").val(time_str);
                        $("#HotImg").attr("src", Config.IdolImgUrl + "?action=ClusterServe2DMap&SourceJobname=" + $("#job_list").val() + "&enddate=" + time_str);
                        var scal_size = 352 / 525.0;
                        var s = { "scal_size": scal_size, "height_size": scal_size, "end_date": time_str, "job_name": $("#job_list").val() };
                        Hot.HotMapData(s);
                    }
                }
            },
            "json"
        );

    },
    InnitMapData: function(timelist) {
        delete timelist["SuccessCode"];
        var content = [];
        var time_str = null;
        for (var item in timelist) {
            content.push("<option value=\"");
            content.push(timelist[item]);
            content.push("\">");
            content.push(Hot.getTimeStr(timelist[item]));
            content.push("</option>");
            time_str = timelist[item];
        }
        $("#HotImg").attr("src", Config.IdolImgUrl + "?action=ClusterServe2DMap&SourceJobname=" + $("#job_list").val() + "&enddate=" + time_str);
        $("#input_data").html(content.join(""));
        $("#input_data").val(time_str);
        var scal_size = 352 / 525.0;
        var s = { "scal_size": scal_size, "height_size": scal_size, "end_date": time_str, "job_name": $("#job_list").val() };
        Hot.HotMapData(s);
    },
    GetClusterResults: function(cluster_id, end_date, job_name) {
        $.get("Handler/GetClusterResults.ashx", { 'cluster_id': cluster_id, "end_date": end_date, "job_name": job_name },
            function(data) {
                $("#hot_prompt").empty();
                $("#whats_hot").empty().html(data);
                $("#whats_hot").show();
            }
        );
    },
    InnitSelectDate: function() {
        $("#input_data").change(function() {
            var job_name = $("#job_list").val();
            var cluster_date = $(this).val();
            if (cluster_date != "-1") {
                $("#HotImg").attr("src", Config.IdolImgUrl + "?action=ClusterServe2DMap&SourceJobname=" + job_name + "&enddate=" + cluster_date);
                var scal_size = 352 / 525.0;
                var s = { "scal_size": scal_size, "height_size": scal_size, "end_date": cluster_date, "job_name": job_name };
                Hot.HotMapData(s);
            }
        });
        $("#job_list").change(function() {
            var job_name = $(this).val();
            Hot.innit(job_name);
        });
    },
    getTimeStr: function(time) {
        var l_time = new Date(parseInt(time) * 1000 + Common.TimeSpan * 24 * 60 * 60 * 1000);
        var year = l_time.getFullYear();
        var month = l_time.getMonth() + 1;
        var day = l_time.getDate();
        return year + "-" + month + "-" + day;
    },
    HotMapData: function(s, page_tag) {
        $.ajax({
            type: "get",
            url: "Handler/GetMapData.ashx",
            data: s,
            beforeSend: function(XMLHttpRequest) {
                $("#hot_image").html("热点数据加载中……");
            },
            success: function(data, textStatus) {

                var map = $("#mapData");

                map.empty().html(data);
                //隐藏文字说明
                $(".node_text").each(function() {
                    $(this).hide();
                });

                $(".node").each(function() {
                    $(this).mouseover(function() {

                        var num = $(this).attr("id").split("_")[1];
                        $("#clustertitle_" + num).show();
                    });

                    $(this).mouseout(function() {

                        var num = $(this).attr("id").split("_")[1];
                        $("#clustertitle_" + num).hide();
                    });

                    $(this).click(function() {
                        $(".node").each(function() {
                            $(this).css("background", "red");
                        });
                        $(this).css("background", "green");
                        var cluster_id = $(this).attr("id").split("_")[2];
                        if (page_tag == "index") {
                            location.href = "hot.html";
                        }
                        else {
                            Hot.GetClusterResults(cluster_id, s.end_date, s.job_name);
                        }

                    });
                }); //each end

            },
            complete: function(XMLHttpRequest, textStatus) {
                $("#hot_image").html("舆情热点图<br/>(点击红色方块，可在右侧区域获取文章列表)");
            },
            error: function() {
                //请求出错处理
            }
        });
    }
}