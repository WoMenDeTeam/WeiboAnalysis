

/******************************************************************************
**Idol数据库配置：              Scripts/common.js 的 Config.IdolDataBase["newanjian"]
**初始化地图请求的Handler:      Handler/GetProvinceInfo.ashx
**用户点击地区请求的Handler:    Handler/GetProvinceInfo.ashx
分页配置参数变量：              PageInitParameter
*******************************************************************************/

$(document).ready(function() {
    province.Init();
});
var pagelistId = "#pagelist";
var pageBarId = "#pagebar";
var province = {
    PageInitParameter: { "page_size": 15, "result_id": "pagelist", "status_bar_id": "pagebar", "post_url": "Handler/GetProvinceInfo.ashx" },
    Init: function() {
        Common.GetTab('tabs');
        $("#btnSearch").click(function() { //绑定查询时间
            $('.province-info-mod').empty();
            ClearInfo(); //清除数据
            province.GetMapData();
        });
        this.GetMapData();
    },
    GetMapData: function() {
        var sTime = $("#txtStartTime").val();
        var eTime = $("#txtEndTime").val();
        var data = { "startTime": sTime, "endTime": eTime, "defaultTime": "month", "defaultTimeNumber": "-1" };
        $.post("Handler/GetProvinceInfo.ashx?action=all", data, function(data) {
            for (var item in data.data) {
                data.data[item]["rate"] = (data.data[item].value / data.count * 100);
            }
            $("#txtStartTime").val(data.sTime);
            $("#txtEndTime").val(data.eTime);
            province.LoadMap(data.data);
        }, "json");
    },
    LoadMap: function(cdata) {
        Land(".detail_box", function(view) {
            view.$('.province-info-mod').each(function(index, node) {
                var data = {};
                data.provinces = [cdata];
                var provinceView = new shu.ProvinceView(node);
                var options = { tips_name: "文章数", clickfun: mapClick };
                //provinceView.render(data.provinces[index], options);
                provinceView.render(cdata, options);
            });
        });
    }
}

/*点击地区获取该地区信息*/
function mapClick() {
    ClearInfo();
    LoadImg();
    var mapdata = $(this.node).data('data');
    //var init_data = { "page_size": 15, "result_id": "pagelist", "status_bar_id": "pagebar", "post_url": "Handler/GetProvinceInfo.ashx" };
    var post_params = {};
    post_params["action"] = "query";
    post_params["cityname"] = mapdata.name;
    post_params["startTime"] = mapdata.startTime;
    post_params["endTime"] = mapdata.endTime;
    post_params["database"] = Config.IdolDataBase["newanjian"];
    post_params["print"] = "fields";
    post_params["printfields"] = "SITENAME,DREDATE";
    post_params["TotalResults"] = "true";
    post_params["defaultTime"] = "month";
    post_params["defaultTimeNumber"] = "-1";
    post_params["display_style"] = 6;
    post_params["sort"] = "Date";
    var Lpager = new Pager(province.PageInitParameter);
    Lpager.Display = function(data) {
        if (data["totalcount"] && data["totalcount"] > 0) {
            var count = 1;
            var entity = data["entity_" + count];
            var province_topics = [];
            province_topics.push("<ul>");
            while (entity) {
                province_topics.push("<li>");
                province_topics.push("<span class=\"new_pos01\">");
                //当前窗口查看
                //province_topics.push("<a href=\"" + unescape(entity["href"]) + "\" >" + GetShortWord(unescape(entity["title"]), 50) + "</a>");
                //打开新窗口查看
                province_topics.push("<a href=\"" + unescape(entity["href"]) + "\" target=\"_blank\" >" + GetShortWord(unescape(entity["title"]), 50) + "</a>");
                province_topics.push("</span>");
                province_topics.push("<span class=\"new_pos02\">" + GetShortWord(unescape(entity["site"]), 20) + "</span>");
                province_topics.push("<span class=\"new_pos03\">" + unescape(entity["time"]).substring(0, 11) + "</span>");
                province_topics.push("</li>");
                entity = data["entity_" + (++count)];
            }
            province_topics.push("</ul>");
            $("#pagelist").empty().html(province_topics.join(""));
        }
    };
    Lpager.LoadData(1, post_params);
}
//字符截取
function GetShortWord(txt, txtlength) {
    var originalWord = txt;
    var maxlength = txtlength;
    var count = 0;
    var nameword = "";
    var sl = originalWord.length;
    for (var i = 0; i < sl; i++) {
        var sname = originalWord.substring(i, i + 1);
        if (sname.charCodeAt(0) > 255) {
            count = count + 2;
        } else {
            count++;
        }
        if (count < maxlength)
            nameword += sname;
        else
            break;
    }
    return nameword;
}

function LoadImg() {
    $("#pagelist").empty().html("<div><img src=\"img/loading_icon.gif\" /></div>");
}
function ClearInfo() {
    $(pagelistId).empty();
    $(pageBarId).empty();
}