
/// <reference path="jquery-1.8.1.js" />

$(document).ready(function () {
    Common.InnitCategoryList = function (data) {
        Yjts.InitCategoryTabList(data);
    }
    Common.CheckUser();
});
var _yjts = new Object;
var Yjts = _yjts.property = {
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
    }
};