
$(document).ready(function() {
    Common.LoginEventFn = function() {
        AccidentInfoManage.SqlList = new SqlList();
        AccidentInfoManage.Init();
        AccidentInfoManage.InitBtnClick();
    }
    Common.CheckUser();
});


var _accidentInfoManage = new Object;
var AccidentInfoManage = _accidentInfoManage.property = {
    ColumnId: null,
    SqlList: null,
    orderBy: " articlebasedate desc",
    Init: function() {

        AccidentInfoManage.InitColumn();
    },
    //初始化栏目列表，默认为选择煤矿
    InitColumn: function() {
        var url = "Handler/ArticleHandler.ashx";
        $.post(url,
        { "act": "getColumnByParentId", "id": "200" },
        function(data) {
            if (data.Success == 1) {
                AccidentInfoManage.BindColumnJson(data);
                var id = $.query.get('type');
                if (id) {
                    var cid = id.replace("_", "");
                    AccidentInfoManage.InitListByColumnId(cid);
                    AccidentInfoManage.ColumnId = cid;
                    $(".content_left ul li").each(function() {
                        $(this).attr("class", "kuai_off");
                    });
                    var current_obj = $("a[cid='" + cid + "']");
                    var column_name = $(current_obj).html();
                    $("#title_cue").empty().html(column_name);
                    $(current_obj).parent().attr("class", "kuai_on");
                }
            }
        },
        "json");
    },
    //根据栏目ID取列表分页数据
    InitListByColumnId: function(cid) {
        var strwhere = "";
        var stime = $("#start_time");
        var etime = $("#end_time");
        if (cid) {
            strwhere += " ColumnId='" + cid + "'";
        }
        if (stime.val() != "" && etime.val() != "") {
            strwhere += " and articlebasedate >=to_date('" + stime.val() + "','yyyy-MM-dd') and articlebasedate <=to_date('" + etime.val() + "','yyyy-MM-dd')";
        }
        AccidentInfoManage.SqlList.initData["page_size"] = 5;
        AccidentInfoManage.SqlList.initData["diszhuanfatag"] = false;
        AccidentInfoManage.SqlList.SqlQueryParams["strwhere"] = strwhere;
        AccidentInfoManage.SqlList.SqlQueryParams["strorder"] = AccidentInfoManage.orderBy;
        AccidentInfoManage.SqlList.SqlQueryParams["action"] = "getListByColumnId";
        AccidentInfoManage.SqlList.DisplayHtml = function(data, l_obj) {
            AccidentInfoManage.DisPlayHtmlStr(data);
        };
        AccidentInfoManage.SqlList.Search();

    },
    BindColumnJson: function(data) {
        delete data.Success;
        var sgxx = $(".content_left ul");
        sgxx.empty();
        for (var item in data) {
            var row = data[item];
            var li = $("<li class=\"kuai_off\"></li>");
            li.append("<a cid=\"" + unescape(row["id"]) + "\" href=\"javascript:void(null)\">" + unescape(row["columnName"]) + "</a>");
            sgxx.append(li);
        }
        AccidentInfoManage.ColumnId = $(".content_left ul li:eq(0) > a").attr("cid");
        $(".content_left ul li:eq(0)").attr("class", "kuai_on");
        AccidentInfoManage.BindAClick();
        AccidentInfoManage.InitListByColumnId(AccidentInfoManage.ColumnId);
    },
    DisPlayHtmlStr: function(data) {
        $("#SearchResult").empty();
        delete data["totalcount"];
        var entitylist = data["entitylist"];
        delete entitylist["Success"];
        for (var one in entitylist) {
            var entity = entitylist[one];
            if (entity && undefined != entity) {
                var basetitle = unescape(entity["articletitle"]);
                var baseContent = unescape(entity["articlecontent"]);
                var distitle = basetitle.length > 25 ? basetitle.slice(0, 25) + "..." : basetitle;
                var disContent = baseContent.length > 200 ? baseContent.slice(0, 200) + "..." : baseContent;
                var htmlcontent = [];
                htmlcontent.push("<div class=\"news\"><h1><a name=\"btn_look_info_snapshot\" pid=\"" + entity["id"] + "\" href=\"javascript:void(null);\" title=\"" + distitle + "\" target=\"_blank\">" + distitle + "</a></h1>");
                htmlcontent.push("<h2>");
                htmlcontent.push("【时间】<span class=\"date\">" + unescape(entity["articlebasedate"]) + "</span><br />");
                htmlcontent.push("【来源】<span class=\"rss\">" + unescape(entity["articlesource"]) + "</span><br />");
                htmlcontent.push("</h2><p>" + disContent + "</p>");
                htmlcontent.push("<div style=\"clear:both; height:20px;\"></div>");
                $("#SearchResult").append(htmlcontent.join(""));
            }
        }
        Common.InitWebURL("SearchResult", "btn_look_info_snapshot", 2);
    },
    BindAClick: function() {
        $(".content_left ul li").each(function() {
            $(this).find("a").click(function() {
                var cid = $(this).attr("cid");
                AccidentInfoManage.InitListByColumnId(cid);
                AccidentInfoManage.ColumnId = cid;
                $(".content_left ul li").each(function() {
                    $(this).attr("class", "kuai_off");
                });
                var column_name = $(this).html();
                $("#title_cue").empty().html(column_name);
                $(this).parent().attr("class", "kuai_on");

            });
        });
    },
    InitBtnClick: function() {
        //btn_look_result
        $("#sort_Date").click(function() {
            if ($("#sort_Date").find("b").val() == "↓") {
                AccidentInfoManage.orderBy = " articlebasedate desc";
                $("#sort_Date").find("b").val("↑")
            }
            else {
                AccidentInfoManage.orderBy = " articlebasedate asc";
                $("#sort_Date").find("b").val("↓");
            }
            AccidentInfoManage.InitListByColumnId(AccidentInfoManage.ColumnId);
        });
        $("#btn_select_all_item").click(function() {
            var btnitem = $(this);
            $(".news").find("checkbox").each(function() {
                $(this).attr("checked", btnitem.attr("checked"));
            });
        });
        $("#btn_look_result").click(function() {
            AccidentInfoManage.InitListByColumnId(AccidentInfoManage.ColumnId);
        });
    }
}