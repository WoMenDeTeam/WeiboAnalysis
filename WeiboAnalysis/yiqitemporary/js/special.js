window.onload = function() {
    Common.LoginEventFn = function() {
        Special.Init();
    }
    Common.CheckUser();
};

var _Special = new Object;
var Special = _Special.property = {
    itemStyle: { "background": "url(img/link_C_bg.gif) no-repeat center top", "color": "#021e2f", "line-height": "34px", "height": "34px" },
    optionItemStyle: { "background": "url(img/link_T_bg.gif) no-repeat center top", "top": "21px", "line-height": "18px", "font-family": "Arial", "font-size": "10px", "font-weight": "bold", "color": "#ffffff", "height": "48px", "text-align": "center" },
    initData: { "page_size": 5, "result_id": "SearchResult", "status_bar_id": "PagerList", "disotherinfo": true },
    CommanQuery: { "action": "categoryquery", "totalresults": "true", "display_style": 6, "print": "fields",
        "summary": "context", "start": "1", "page_size": "4", "predict": "false"
    },
    objId: { "news": "news", "n": "nagtive", "BBS": "furm", "reson": "event_reson", "measure": "event_measure", "about": "event_about" },
    Init: function() {
        //Special.InnitStartAndEndTime();
        var id = $.query.get('id');
        var name = $.query.get('name');
        if (id) {
            this.InitData(id, name);
            this.BtnLookData();
            this.InitPicData(id.split('_')[0]);
            Special.innitTransData(id.split('_')[0], 1);
        }
        else {
            //this.InitData("897687223203525637_202_241", "平顶山市新华区四矿\"9\.8\" 特别重大瓦斯爆炸事故");
            //this.BtnLookData();
            //this.InitPicData("897687223203525637");
            //Special.innitTransData("897687223203525637", 1);
        }
        $("#btn_look_result").click(function() {
            Special.CategoryQuery();
        });

        $("#btn_look_trend").click(function() {
            var category_id = $("#title_cue").attr("pid");
            Special.InitPicData(category_id);
        });
    },
    InnitStartAndEndTime: function() {
        var start_time = Common.GetTimeSpanStr(-7);
        var end_time = Common.GetTimeSpanStr(0);
        $("#start_time").val(start_time);
        $("#end_time").val(end_time);
    },
    InitData: function(data, text) {
        var category_id = data.split('_')[0];
        var parent_cate = data.split('_')[1];
        Special.InnitPicStatus(category_id, parent_cate, text);
        Special.CommanQuery["category"] = category_id;
        this.LookNews();
    },
    InnitPicStatus: function(category_id, parent_cate, category_name) {
        $("#title_cue").attr("pid", category_id);
        var distext = category_name.length > 25 ? category_name.slice(0, 25) + "..." : category_name;
        $("#title_cue").attr("title", category_name);
        $("#title_cue").empty().html(distext);
        if (parent_cate == Config.ThemeParentCate) {
            $("#trend_data_pic").show();
            $("#trans_data_pic").show();
            Special.InitPicData(category_id);
            Special.innitTransData(category_id, 1);
        } else {
            $("#trend_data_pic").hide();
            $("#trans_data_pic").hide();
        }
    },
    BtnLookData: function() {
        var current_obj = this;
        $("#look_data").click(function() {
            var data = $("#title_cue").attr("pid");
            //var text = $("#title_cue").html();
            current_obj.LookNews();
            current_obj.InitPicData(data.split("_")[0]);
        });
    },
    LookNews: function() {
        var tablist = $("li[id^='tab_']");
        $("li[id^='tab_']").click(function() {
            tablist.attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            Special.CategoryQuery();
        });
        var sortlist = $("li[id^='sort_']");
        $("li[id^='sort_']").click(function() {
            sortlist.attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            Special.CategoryQuery();
        });

        Special.GetSpecialData();
    },
    GetSpecialData: function(params) {
        var category = Special.CommanQuery["category"];
        $.post("Handler/SqlSearch.ashx",
            { "action": "getcategoryentity", "category": category },
            function(data) {
                var sort_list = $("li[id^='sort_']");
                sort_list.attr("class", "tab_off");
                if (data) {
                    var sort_type = data["sorttype"];
                    $("#sort_" + sort_type).attr("class", "tab_on");
                    var min_date = data["eventdata"];
                    $("#start_time").val(min_date);
                    $("#from_date").val(min_date);
                    $("#base_start_time").val(min_date);
                } else {
                    $("#sort_Relevance").attr("class", "tab_on");
                }
                Special.CategoryQuery(params);
            },
            "json"
        );

    },
    CategoryQuery: function(params) {
        this.CommanQuery["sort"] = $("li[id^='sort_'][class='tab_on']").attr("pid");
        var fieldtext = Special.GetNewsType();
        if (fieldtext) {
            this.CommanQuery["fieldtext"] = fieldtext;
        } else {
            delete this.CommanQuery["fieldtext"];
        }
        var max_date = $.trim($("#end_time").val());
        if (max_date) {
            Special.CommanQuery["maxdate"] = Common.GetTimeStr(max_date);
        }
        else {
            delete Special.CommanQuery["maxdate"];
        }

        var min_date = $.trim($("#start_time").val());
        if (min_date) {
            Special.CommanQuery["mindate"] = Common.GetTimeStr(min_date);
        }
        else {
            delete Special.CommanQuery["mindate"];
        }
        var Lpager = new Pager(this.initData);
        Lpager.Display = function(data, l_obj) {
            Common.DisplayHtml(data, l_obj);
        };
        Lpager.LoadData(1, this.CommanQuery);
    },
    GetNewsType: function() {
        var str = [];
        var type_condition = $.trim($("li[id^='tab_'][class='tab_on']").attr("pid"));
        if (type_condition) {
            delete Special.CommanQuery["database"];
            delete Special.CommanQuery["printfields"];
            if (type_condition != "all") {
                if (str.length == 0) {
                    str.push(type_condition);
                } else {
                    str.push("+AND+" + type_condition);
                }
            }
        } else {
            Special.CommanQuery["database"] = Config.weibodatabase;
            Special.CommanQuery["printfields"] = Config.weiboprintfields;
        }
        if (str.length == 0) {
            return "";
        } else {
            return str.join("");
        }
    },
    InitPicData: function(category_id) {
        //        var current_obj = this;
        //        //var from_date = $("#from_date").val();
        //        //var to_date = $("#to_date").val();

        //        $.ajax({
        //            type: "post",
        //            url: "Handler/TrendData.ashx",
        //            data: { "category_id": category_id }, // "from_date": from_date, "to_date": to_date },
        //            dataType: "json",
        //            beforeSend: function(XMLHttpRequest) {
        //                $("#placeholder").empty().html("<center style=\"font-size:12px;\"><img src=\"img/loading_icon.gif\" /></center>");
        //                $("#overview").empty().html("<center style=\"font-size:12px;\"><img src=\"img/loading_icon.gif\" /></center>");
        //            },
        //            success: function(data) {
        //                var trend_data = [];
        //                for (var item in data) {
        //                    trend_data.push([parseInt(item), parseInt(data[item])]);
        //                }
        //                current_obj.GetTrendPic(trend_data);
        //            }
        //        });

        var flash_url = "Chart/FCF_MSLine.swf";
        var victor_id = "trend_data_pic";
        var data_url = "Handler/categorystatistic.ashx?category_id=" + category_id;
        var start_time = $.trim($("#from_date").val());
        if (start_time) {
            data_url = data_url + "," + start_time;
        }
        var end_time = $.trim($("#to_date").val());
        if (end_time) {
            data_url = data_url + "," + end_time;
        }
        //var data_url = "xmldata/MSLine.xml";
        var width = 950;
        var height = 500;
        FlashChart.InsertFusionChartsByDataUrl(flash_url, victor_id, data_url, width, height);
    },
    innitTransData: function(category, index) {
        $("#transcs").find("div").remove();
        $("#transcs").find("canvas").remove();
        var transobj = document.createElement("canvas");
        transobj.width = 680;
        transobj.height = 200;
        if ($.browser.msie) {
            transobj = window.G_vmlCanvasManager.initElement(transobj);
        }

        $("#transcs").empty().append(transobj);
        var totalData = {};
        var sequece = 1;
        var url = "Handler/GetSiteTrend.ashx";
        $.post(url,
		        { "category": category },
		        function(data) {
		            if (data) {
		                var count = data["Count"];
		                delete data["Count"];
		                var content = [];
		                var l_count = 1;
		                for (var item in data) {
		                    var info = unescape(data[item]).split(",");
		                    var l_item = [];
		                    var l_len = info.length < 4 ? info.length : 3;
		                    for (var i = 0, j = l_len; i < j; i++) {
		                        l_item.push(info[i]);
		                    }
		                    content.push([item, l_item]);
		                    if (l_count == 6) {
		                        totalData["data_" + sequece] = content;
		                        l_count = 0;
		                        content = [];
		                        sequece++;
		                    }
		                    l_count++;
		                }
		                if (content.length > 0) {
		                    totalData["data_" + sequece] = content;
		                } else {
		                    sequece = sequece - 1;
		                }
		                var l_data = totalData["data_" + index];
		                if (l_data) {
		                    var TransMap = new TransRoute(transobj, l_data, Special.itemStyle, Special.optionItemStyle);
		                    TransMap.Init();
		                    var prev_a = document.createElement("A");
		                    var next_a = document.createElement("A");
		                    $(prev_a).html("<image src=\"img/trans_prev.gif\" />");
		                    $(prev_a).attr("pid", "0");
		                    $(prev_a).attr("title", "上一个节点");
		                    $(prev_a).css({ "font-size": "12px", "top": "85px", "left": "-25px", "position": "absolute", "cursor": "pointer" });
		                    $(next_a).html("<image src=\"img/trans_next.gif\" />");
		                    $(next_a).attr("pid", "2");
		                    $(next_a).attr("title", "下一个节点");
		                    $(next_a).css({ "font-size": "12px", "top": "85px", "right": "-25px", "position": "absolute", "cursor": "pointer" });
		                    $("#transcs").append(prev_a);
		                    $("#transcs").append(next_a);
		                    $(prev_a).click(function() {
		                        var page = parseInt($(this).attr("pid"));
		                        if (page == 1) {
		                            $(this).hide();
		                        }
		                        $(this).attr("pid", page - 1);
		                        $(next_a).attr("pid", page + 1).show();
		                        var ll_data = totalData["data_" + page];
		                        Special.GetOtherTransData(ll_data);
		                        //}
		                    });
		                    $(next_a).click(function() {
		                        var page = parseInt($(this).attr("pid"));
		                        if (page == sequece) {
		                            $(this).hide();
		                        }
		                        $(prev_a).attr("pid", page - 1).show();
		                        $(this).attr("pid", page + 1);
		                        var ll_data = totalData["data_" + page];
		                        Special.GetOtherTransData(ll_data);
		                        //}
		                    });
		                    $(prev_a).hide();
		                    if (sequece == 1) {
		                        $(next_a).hide();
		                    }
		                }
		            }
		        },
		        "json"
	        );
    },
    GetOtherTransData: function(data) {
        $("#transcs").find("div").remove();
        $("#transcs").find("canvas").remove();
        var transobj = document.createElement("canvas");
        transobj.width = 680;
        transobj.height = 200;
        if ($.browser.msie) {
            transobj = window.G_vmlCanvasManager.initElement(transobj);
        }

        $("#transcs").append(transobj);
        var l_TransMapMap = new TransRoute(transobj, data, Special.itemStyle, Special.optionItemStyle);
        l_TransMapMap.Init();
    },
    GetTrendPic: function(trend_data) {
        var d = trend_data;
        if (d) {

            /* 对placeholder的canvas进行初始化 */
            $.plot($("#placeholder"), [d], { xaxis: { ticks: [] }, series: { lines: { show: true, lineWidth: 1 }, shadowSize: 0 }, grid: { color: "#91bae1", borderWidth: 1} });


            /* 对选择器overview进行初始化 */
            $.plot($("#overview"), [d], { xaxis: { mode: "time", timeformat: "%y-%m-%d" }, yaxis: { ticks: [] }, selection: { mode: "x" }, series: { lines: { show: true, lineWidth: 1 }, shadowSize: 0 }, grid: { color: "#91bae1", borderWidth: 1} });

            $("#overview").bind("plotselected", function(event, ranges) {
                var level = 0;
                var min_date = ranges.xaxis.from;
                var max_date = ranges.xaxis.to;
                var date_gap = (max_date - min_date) / 86400000;
                var l = [];
                if (date_gap <= 70) {
                    level = 1;
                    $("#date_unit").empty().html("天");
                }
                else if (date_gap > 70 && date_gap <= 600) {
                    level = 7;
                    $("#date_unit").empty().html("周");
                }
                else {
                    level = 30;
                    $("#date_unit").empty().html("月");
                }

                l = get_Data(d, min_date, max_date, level);

                $("#time_span").empty().html(GetFormatTime(new Date(min_date)) + "至" + GetFormatTime(new Date(max_date)));
                /* 根据重新组合的数据l再绘图 */
                $.plot($("#placeholder"), [l], {
                    xaxis: {
                        mode: null,
                        min: ranges.xaxis.from,
                        max: ranges.xaxis.to,
                        ticks: l
                    },
                    series: { lines: { show: true, lineWidth: 1 }, shadowSize: 0, points: { show: true} },

                    grid: { color: "#91bae1", borderWidth: 1 }

                });

                innit_tag(l, level);
            });
        }
        /* 根据选择的min_date、max_date对原有数据d进行再组合 */
        function get_Data(d, min_date, max_date, level) {
            var list = [];
            var count = 0;
            var article_count = 0;
            for (var i = 0; i < d.length; i++) {
                if (d[i][0] >= min_date && d[i][0] <= max_date) {

                    article_count += d[i][1];
                    count++;
                    if (count % level == 0) {
                        list.push([d[i][0], article_count]);
                        count = 0;
                        article_count = 0;
                    }
                }
            }
            return list;
        }

        /* 根据X轴数据生成覆盖在placeholder上DIV，并初始化mouseover事件 */
        function innit_tag(d, level) {
            var width = $("#placeholder").width();
            var height = $("#placeholder").height();
            var div = document.createElement("DIV");
            $(div).css({ "position": "absolute", "width": width, "height": height, "left": "-2px", "top": "0px" });
            var list = $("#placeholder").find(".tickLabel");
            for (var i = 0; i < list.length; i++) {
                var l_right = $(list[i]).position().left;
                var Len = list.length - 1;
                var plot_left = $(list[Len]).width();
                if (l_right != 0) {
                    try {
                        var value = $(list[i]).html();
                        $(list[i]).empty();
                        var l_div = list[i];
                        var prev_time = GetFormatTime(new Date(d[i][0]));
                        var next_time = GetFormatTime(new Date(d[i][0] + 86400000 * (level - 1)));
                        var time_str;
                        if (next_time == prev_time) {
                            time_str = prev_time;
                        }
                        else {
                            time_str = prev_time + "/" + next_time;
                        }
                        $(l_div).attr("date", time_str);
                        $(l_div).attr("pid", value);
                        $(l_div).attr("id", "item_" + i);
                        $(l_div).css({ "top": 5, "height": "275px", "float": "left", "cursor": "pointer" });

                        var item = GetPlotItem(plot_data, i);

                        var left = parseInt(item.series.xaxis.p2c(item.datapoint[0])) + plot_left + 2;
                        var top = parseInt(item.series.yaxis.p2c(item.datapoint[1])) + 4;
                        item_div = document.createElement("DIV");
                        $(item_div).attr("id", "litem_" + i);
                        $(item_div).css({ "width": "8px", "height": "8px", "overflow": "hidden", "position": "absolute", "left": left, "top": top, "background": "black", "cursor": "pointer", "display": "none" });
                        $("#placeholder").append(item_div);
                        var node_text = document.createElement("DIV");
                        $(node_text).attr("id", "node_text_" + i);
                        if (left < 580)
                            $(node_text).css({ "width": "180px", "height": "auto", "overflow": "hidden", "position": "absolute", "left": left + 15, "top": top, "display": "none", "text-align": "left", "border": "1px solid gray" });
                        else
                            $(node_text).css({ "width": "180px", "height": "auto", "overflow": "hidden", "position": "absolute", "left": left - 195, "top": top, "display": "none", "text-align": "left", "border": "1px solid gray" });
                        $(node_text).html("时间：" + time_str + "<br />文章数：" + value);
                        $("#placeholder").append(node_text);
                        div.appendChild(l_div);
                    }
                    catch (e) {

                    }
                }

            }
            $("#placeholder").append(div);

            var current_item_num;

            /* 对placeholder的mouseover时间进行初始化 */
            $(document).mouseover(function(e) {
                var type = $(e.target).attr("id").split('_');
                if (type[0] == "item") {
                    if (!current_item_num) {
                        current_item_num = type[1];
                    }
                    else {
                        if (type[1] != current_item_num) {
                            $("#litem_" + current_item_num).hide();
                            $("#node_text_" + current_item_num).hide();
                            current_item_num = type[1];
                        }
                    }
                    $("#litem_" + type[1]).show();
                    $("#node_text_" + type[1]).show();
                }
            });
        }
        /* 对时间进行格式化 返回格式yyyy-mm-dd */
        function GetFormatTime(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;    //js从0开始取 
            var date1 = date.getDate();
            return year + "-" + month + "-" + date1;
        }
        /* 获取根据索引point_no获取对应元素 */
        function GetPlotItem(series, point_no) {
            i = 0;
            j = point_no;
            ps = series[i].datapoints.pointsize;

            return { datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                dataIndex: j,
                series: series[i],
                seriesIndex: i
            };
        }
    }
}