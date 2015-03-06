$(document).ready(function() {
    Common.LoginEventFn = function () {
        //977187469803593879 
        Category.Init("103", "陕西");        
        District.InnitAreaMap();
    }

    Common.CheckUser();
});

var _district = new Object;
var District = _district.property = {
    InnitAreaMap: function() {       
        Common.OtherMapFn = function(data) {
            District.InnitChinaArea(data);
        }
        Common.MapAreaClickFn = function(categoryid, categoryname) {
            Category.InitData(categoryid, categoryname);
        }
        Common.InnitComplexionMap();
    },
    InnitChinaArea: function(data) {
        for (var item in data) {
            var row = data[item];
            var categoryid = unescape(row["queryrule"]);
            var categoryname = Common.MapArea[item];
            var firsttag = item.slice(0, 1);
            var content = [];
            content.push("<a href=\"javascript:void(null);\" pid=\"" + categoryid + "\">");
            content.push(categoryname + "</a>");
            $("#china_area_" + firsttag).append(content.join(""));
        }
        $("#china_area_list").find("a").click(function() {
            var tid = $(this).attr("pid");
            var tname = $(this).html();
            Category.InitData(tid, tname);
        });
    }
}