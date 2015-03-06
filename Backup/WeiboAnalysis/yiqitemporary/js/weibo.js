$(document).ready(function() {
    Common.LoginEventFn = function(data) {        
        WeiBo.Init();
        WeiBo.InitClick();
        WeiBo.InitStatic();
    }
    
    Common.CheckUser();
});

var _weibo = new Object;
var WeiBo = _weibo.property = {
    initData: { "page_size": 10, "result_id": "SearchResult", "status_bar_id": "PagerList", "diszhuanfatag": false },
    queryParams: { "action": "query", "display_style": 6, "Characters": 600, "combine": "simple", "totalResults": true,
        "printfields": Config.weiboprintfields, "Highlight": "summaryterms",
        "Print": "fields", "summary": "context", "Predict": "false",
        "database": Config.weibodatabase
    },
    Init: function() {
        //        var max_date = $.trim($("#end_time").val());
        //        if (max_date) {
        //            this.queryParams["maxdate"] = Common.GetTimeStr(max_date);
        //        }
        //        else {
        //            delete this.queryParams["maxdate"];
        //        }

        //        var min_date = $.trim($("#start_time").val());
        //        if (min_date) {
        //            this.queryParams["mindate"] = Common.GetTimeStr(min_date);
        //        }
        //        else {
        //            delete this.queryParams["mindate"];
        //        }
        this.queryParams["sort"] = $("li[name='weibo_select'][class='tab_on']").attr("pid");
        var Lpager = new Pager(this.initData);
        Lpager.Display = function(data, l_obj) {
            Common.DisplayWeiboHTML(data, l_obj);
        };
        Lpager.LoadData(1, this.queryParams);
    },
    InitClick: function() {
        var select_list = $("li[name='weibo_select']");
        select_list.click(function() {
            select_list.attr("class", "tab_off");
            $(this).attr("class", "tab_on");
            WeiBo.Init();
        });

        $("#btn_look_result").click(function() {
            WeiBo.Init();
        });
    },
    InitStatic: function() {
        //        var flash_url = "Chart/FCF_MSLine.swf";
        //        var victor_id = "trend_data_pic";
        //        var data_url = "Handler/Static.ashx?type=getweibostaticbytime";
        //        var width = 474;
        //        var height = 300;
        //        FlashChart.InsertFusionChartsByDataUrl(flash_url, victor_id, data_url, width, height);
        //alert("start");
        var flash_url = "flash/amstock.swf";
        var set_url = "Handler/setting.ashx?act=" + Config.weibodatabase;

        var flashVars =
            {
                settings_file: set_url
            };

        swfobject.embedSWF(flash_url, "trend_data_pic", "860", "460", "8.0.0", "amchatsflash/expressInstall.swf", flashVars, { wmode: "transparent" });
    }
}