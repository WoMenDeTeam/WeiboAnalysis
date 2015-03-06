$(document).ready(function() {
    Common.LoginEventFn = function() {
        var l_point_id = $.query.get('point_id');
        var l_from_time_id = $.query.get('from_time_id').replace("_", "");
        var l_end_time_id = $.query.get('end_time_id').replace("_", "");
        var l_current_id = $.query.get('current_id');
        if (l_current_id != "") {
            Trend.current_id = l_current_id;
            Trend.getSGDataResults(l_point_id, l_from_time_id, l_end_time_id);
        }
        Trend.innitMapData();
        Trend.innitDataSpan();
    }
    Common.CheckUser();
});


var _trend = new Object;
var Trend = _trend.property = {
    current_id: null,
    innitMapData: function() {
    $("#LightImg").attr("src", Config.IdolImgUrl + "?action=ClusterSGPicServe&SourceJobname=" + Config.SGMapJob);
        var scal_size = 352 / 515.0;
        var s = { "hot_scal_size": scal_size, "height_size": scal_size };
        if (Trend.current_id) {
            Common.LightPicData(s, "hot", Trend.current_id);
        } else {
            Common.LightPicData(s, "hot");
        }
    },
    getSGDataResults: function(point_id, from_time_id, end_time_id) {
        $.get("Handler/GetSGDataResults.ashx", { 'point_id': point_id, "from_time_id": from_time_id, "end_time_id": end_time_id },
            function(data) {
                $("#hot_prompt").empty();
                $("#doc_list").empty().html(data);
            }
        );
    },
    innitDataSpan: function() {
        var now_date = Date.parse(new Date());
        var time_str_list = [];
        for (var i = 5; i > 0; i--) {
            var value = now_date - i * 24 * 60 * 60 * 1000;
            var str = new Date(value);
            time_str_list.push("<li>" + str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate() + "</li>");
        }
        $("#hot_cue_list").empty().html(time_str_list.join(""));
    }
}