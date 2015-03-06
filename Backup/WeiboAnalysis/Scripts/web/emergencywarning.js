/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../SqlPager.js" />
//SourceType=1 AND AlarmState IN(0,-1,-3,-4)   AlarmState BETWEEN -1 AND 0  //AlarmState DESC,
var EmergencyWaring = {
    SqlInitData: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/AccidentAlarmHandler.ashx" },
    SqlData: { "action": "getPage", "where": " SourceType=1 AND AlarmState IN(0,-1,-3) ", "orderBy": "  PublishTime DESC " },
    SoundList: ["sound/yiji.wav", "sound/erji.wav", "sound/sanji.wav"],
    SoundType: 0,
    SoundLoopTime: 50000,
    SoundIsInit: true,
    SoundSetTimeoutObj: Object,
    SetTimeoutObj: Object,
    RealTimeSetTimeoutObj: Object,
    RefreshTimestamp: 20000,
    LastRefreshTime: "",
    AlarmDataCount: -1,
    UserRole: 1,
    CurrPageIndex: 1,
    CurrCount: 0,
    TypeTag: "gxb",
    OrderByTag: "time",
    AdminWhere: " AND level>=8 ",
    ListTemplate: function (data) { },
    Init: function () {
        $("#accidentalarm_start_time").val("");
        $("#accidentalarm_end_time").val("");
        $("#accidentalarm_keyword_txt").val("");
        $("#accidentalarm_search_btn").unbind().bind("click", function () {
            var obj = EmergencyWaring.GetPargeParam();
            EmergencyWaring.GetPageList(obj);
        });
        EmergencyWaring.SqlData["where"] += EmergencyWaring.AdminWhere;
        EmergencyWaring.Quit();
        //提示框位置初始化
        EmergencyWaring.Start();
        //获取预警列表
        EmergencyWaring.GetPageList();
        //循环刷新预警信息
        EmergencyWaring.RealTimeDetection();
        //初始化页面事件的绑定 主要是全选框，批量处理预警事件和排序方式
        EmergencyWaring.PageEventBind();

    },
    PageEventBind: function () {

        $("#click_all_ckbox").change(function () {
            $("#list_body_div [name = chkItem]:checkbox").attr("checked", this.checked);
            EmergencyWaring.ResetCheckState();
        });
        $("#show_topic_div").unbind().bind("click", function () {
            if (confirm("确定已处理？")) {
                EmergencyWaring.DelAralmByIDs();
            }
        });
        $("#delete_alarm_byids").unbind().bind("click", function () {
            if (confirm("删除后将不可恢复，确定操作吗？")) {
                EmergencyWaring.DeleteAralmByIds();
            }
        })
        //按时间排序按钮
        var bytime_btn = $("#bytime");
        //按预警级别排序按钮
        var bybyurgent_btn = $("#byurgent");
        var byGuoXinBan = $("#by_gxb");
        bytime_btn.unbind().bind("click", function () {
            EmergencyWaring.ChangeOrder(this);
            EmergencyWaring.CurrPageIndex = 1;
            EmergencyWaring.GetPageListByTime();
        });
        bybyurgent_btn.unbind().bind("click", function () {
            EmergencyWaring.ChangeOrder(this);
            EmergencyWaring.CurrPageIndex = 1;
            EmergencyWaring.GetPageListByUrgent();

        });
        //所有国信办的数据
        byGuoXinBan.unbind().bind("click", function () {
            EmergencyWaring.CurrPageIndex = 1;
            $("#bytime,#byurgent,#by_gxb,#xitongxinxi").removeClass("on");
            $("#bytime,#by_gxb").addClass("on");
            EmergencyWaring.GuoXinBan();
        });
        $("#xitongxinxi").unbind().bind("click", function () {
            EmergencyWaring.CurrPageIndex = 1;
            EmergencyWaring.TypeTag = "xtxx";
            EmergencyWaring.SqlData["where"] = " SourceType=0 AND AlarmState in(0,-1)  ";
            EmergencyWaring.GetPageListByTime();
            $("#bytime,#byurgent,#by_gxb,#xitongxinxi").removeClass("on");
            $("#bytime,#xitongxinxi").addClass("on");
        });
    },
    ChangeOrder: function (doc) {
        //,#by_gxb
        $("#bytime,#byurgent").removeClass("on");
        if (EmergencyWaring.TypeTag === "gxb") {
            EmergencyWaring.SqlData["where"] = " SourceType=1 AND AlarmState IN(0,-1,-3) " + EmergencyWaring.AdminWhere;
        } else {
            EmergencyWaring.SqlData["where"] = " SourceType=0 AND  AlarmState BETWEEN -1 AND 0  ";
        }
        //时间排序
        $(doc).addClass("on");
    },
    ResetCheckState: function () {
        var checkboxCount = $("[name = chkItem]:checkbox").length;
        var checkedCount = $("[name = chkItem]:checkbox:checked").length;
        var checkstate = false;
        if (checkboxCount != 0 && (checkboxCount == checkedCount)) {
            checkstate = true;
        }
        $("#click_all_ckbox").attr("checked", checkstate);
        $("#checknumber").html(checkedCount);
    },
    RealTimeDetection: function () {
        clearTimeout(EmergencyWaring.RealTimeSetTimeoutObj);
        EmergencyWaring.MyAjax({ "action": "getAlarmCount", "lastTime": EmergencyWaring.LastRefreshTime }, function (d) {
            $("#newcount").html(d.allCount);
            //d.allCount 总的未销警信息数量
            if (d.allCount > 0) {
                EmergencyWaring.MessageContent(d.data);
            } else {
                $("#Content").empty();
                EmergencyWaring.Down();
                EmergencyWaring.SoundType = -1;
            }
            if (d.allCount != EmergencyWaring.CurrCount || d.Count > 0) {
                EmergencyWaring.GetPageList();
            }

            if (d.allCount > EmergencyWaring.CurrCount) {
                EmergencyWaring.Up();
                EmergencyWaring.SoundPlay("");
            }

            EmergencyWaring.CurrCount = d.allCount
            EmergencyWaring.LastRefreshTime = d.lasttime;
            EmergencyWaring.RealTimeSetTimeoutObj = setTimeout(EmergencyWaring.RealTimeDetection, EmergencyWaring.RefreshTimestamp);
        });
    },
    MessageContent: function (data) {
        EmergencyWaring.SoundType = -1;
        var msgContent = $("#Content");
        msgContent.empty();
        //data.length 限定提示框显示6条信息
        var length = data.length > 6 ? 6 : data.length;
        for (var i = 0; i < length; i++) {
            var oTitle = unescape(data[i].Title).replace(' ', '');
            var title = oTitle.length > 22 ? oTitle.substring(0, 22) + "" : oTitle;
            var html = "<li><a name=\"deleteAlarr off\" aid=" + data[i].ID + " title=" + oTitle + "  href='" + unescape(data[i].Url) + "' target=\"_blank\" >" + title + "</a></li>";
            msgContent.append(html);
        }

        for (var i = 0, j = data.length; i < j; i++) {
            if (EmergencyWaring.SoundType < 2 && data[i].HigLevel > 10 || data[i].SourceType == "1") {
                EmergencyWaring.SoundType = 2;
            } else if (EmergencyWaring.SoundType < 1 && data[i].HigLevel > _getHours()) {
                EmergencyWaring.SoundType = 1;
            }
        }
        //23:00至凌晨05:00 5人以上报警，其他世界3人以上报警
        function _getHours() {
            var result = 3;
            var h = new Date().getHours();
            if (h >= 23 || h <= 7) {
                result = 5;
            }
            return result;
        }
        $("#Content a[name='deleteAlarr']").unbind().bind("click", function () {
            var id = $(this).attr("aid");
            EmergencyWaring.OffWarning({ "action": "delalarm", "id": id });
        });

        //EmergencyWaring.SoundIsInit:true 表示第一次进入页面，有报警信息内容就播放警告，否则按间隔1分播放报警
        if (EmergencyWaring.SoundIsInit) {
            EmergencyWaring.SoundPlay("");
            EmergencyWaring.Up();
            EmergencyWaring.SoundIsInit = false;
        }
    },
    GetPargeParam: function () {
        var stime = $("#accidentalarm_start_time").val();
        var etiem = $("#accidentalarm_end_time").val();
        var keywordtext = $("#accidentalarm_keyword_txt").val();
        stime = stime == null ? "" : stime;
        etiem = etiem == null ? "" : etiem;
        keywordtext = keywordtext == null ? "" : keywordtext;
        var obj = { "starttime": stime, "endtime": etiem, "keywordtext": keywordtext };
        return obj;
    },
    GetPageListByTime: function () {
        //EmergencyWaring.SqlData["orderBy"] = "  AlarmState DESC ,SourceType DESC, PublishTime DESC ";
        EmergencyWaring.OrderByTag = "time";
        //EmergencyWaring.SqlData["orderBy"] = " AlarmState DESC, PublishTime DESC ";
        if (EmergencyWaring.TypeTag === "gxb") {
            EmergencyWaring.SqlData["orderBy"] = " PublishTime DESC";
        } else {
            EmergencyWaring.SqlData["orderBy"] = " AlarmState DESC ,SourceType DESC, PublishTime DESC ";
        }
        var param = EmergencyWaring.GetPargeParam();
        EmergencyWaring.GetPageList(param);
    },
    GetPageListByUrgent: function () {
        EmergencyWaring.OrderByTag = "level";
        EmergencyWaring.SqlData["orderBy"] = "  AlarmState DESC,SourceType DESC,Level desc, HigLevel DESC ";
        var param = EmergencyWaring.GetPargeParam();
        EmergencyWaring.GetPageList(param);
    }, GuoXinBan: function () {
        var param = EmergencyWaring.GetPargeParam();
        EmergencyWaring.TypeTag = "gxb";
        EmergencyWaring.SqlData["where"] = " SourceType=1 AND AlarmState in(0,-1,-3) " + EmergencyWaring.AdminWhere;
        //EmergencyWaring.SqlData["orderBy"] = "  AlarmState DESC,PublishTime DESC ";
        //EmergencyWaring.GetPageList(param);
        EmergencyWaring.GetPageListByTime();
    },
    GetPageList: function (parm) {
        if (parm == undefined || parm == null) {
            EmergencyWaring.SqlData["starttime"] = "";
            EmergencyWaring.SqlData["endtime"] = "";
            EmergencyWaring.SqlData["keywordtext"] = "";

        } else {
            EmergencyWaring.SqlData["starttime"] = parm["starttime"];
            EmergencyWaring.SqlData["endtime"] = parm["endtime"];
            EmergencyWaring.SqlData["keywordtext"] = parm["keywordtext"];
        }
        var currpage_b = $("#currpage_b");
        var count_b = $("#count_b");
        var listBody_div = $("#list_body_div");
        var sp = new SqlPager(EmergencyWaring.SqlInitData);
        sp.Display = function (data) {
            currpage_b.text(this.currPageIndex + "/" + this.page_count);
            count_b.text(this.totalCount);
            EmergencyWaring.CurrPageIndex = this.currPageIndex;
            listBody_div.empty();
            if (data.data.length == 0) {
                Common.LoadingImg("list_body_div", "none");
            }
            for (var i = 0; i < data.data.length; i++) {
                var newdata = data.data[i];
                var result = EmergencyWaring.ListTemplate(newdata); // EmergencyWaring.loadDataTemp(newdata);
                listBody_div.append(result);
            }
            EmergencyWaring.ResetCheckState();
        }
        sp.LoadData(EmergencyWaring.CurrPageIndex, EmergencyWaring.SqlData);
    }, MarkLevelClass: function (count, isMassDeath, sourceType, state) {
        //AlarmState 0-报警信息，-1 已处理报警信息，-2-不重要的负面信息，-4-正面信息
        //DeadCount 死 IsMassDeath 群 InjuredCount 伤  LostCount 失踪 HigLevel=DeadCount+LostCount 严重指数;
        var degree = "btn_degree_4";
        if (count <= 3 || parseInt(isMassDeath) == 1) {
            degree = "btn_degree_4"; //一般
        } else if (count < 10) {
            degree = "btn_degree_3"; //较大
        } else if (count < 30) {
            degree = "btn_degree_2"; //重大
        } else {
            degree = "btn_degree_1"; //特别重大
        }
        if (sourceType == "1") {
            degree = "btn_degree_1";
            if (state == -4) {
                degree = "btn_degree_4";
            }
        }
        return degree;
    },
    //页面列表信息模版
    loadDataTemp: function (data) {
        //DeadCount 死 IsMassDeath 群 InjuredCount 伤  LostCount 失踪 HigLevel=DeadCount+LostCount 严重指数;
        var count = parseInt(data.HigLevel);
        var degree = EmergencyWaring.MarkLevelClass(count, data.IsMassDeath, data.SourceType, data.AlarmState);
        var id = data.ID;
        var doc = [];
        doc.push("<li>");
        if (data.AlarmState == 0)
            doc.push("<span class=\"form\"><input name=\"chkItem\" type=\"checkbox\" value=\"" + id + "\" /></span>");
        doc.push("<span class=\"text\"><a name=\"deleteAlarr off\" aid=" + id + " class=\"" + degree + "\" href=\"" + unescape(data.Url) + "\" target=\"_blank\">" + unescape(data.Title) + "</a></span>");

        doc.push("<code>");
        doc.push(data.CreateTime);
        doc.push("</code>");
        if (data.SourceType == "1") {
            doc.push("<code>");
            doc.push("LV" + data.Level);
            doc.push(" 来源鹰眼");
            doc.push("</code>");
        }
        doc.push("<span class=\"btn\">");
        if (data.AlarmState == 0)
            doc.push("<a class=\"btn_alert\" title=\"取消报警\" name=\"deleteAlarr\" aid=\"" + id + "\" act=\"deleteAlarr\" href=\"javascript:void(0);\"></a>");
        doc.push("</span>");
        doc.push("</li>");
        var html = doc.join("");
        var _doc = $(html);

        _doc.find("a[name='deleteAlarr']").bind("click", function () {
            var id = $(this).attr("aid");
            EmergencyWaring.OffWarning({ "action": "delalarm", "id": id });
        });

        _doc.find("[name='chkItem']:checkbox").change(function () {
            EmergencyWaring.ResetCheckState();
        });
        return _doc;
    },
    DelAralmByIDs: function () {
        var id = "";
        var checkedBoxs = $("[name = chkItem]:checkbox:checked");
        var ids = [];
        for (var i = 0; i < checkedBoxs.length; i++) {
            ids.push(checkedBoxs[i].value);
        }
        id = ids.join(',');
        EmergencyWaring.OffWarning({ "action": "delalarmbyids", "ids": id });
    },
    DeleteAralmByIds: function () {
        var id = "";
        var checkedBoxs = $("[name = chkItem]:checkbox:checked");
        var ids = [];
        for (var i = 0; i < checkedBoxs.length; i++) {
            ids.push(checkedBoxs[i].value);
        }
        id = ids.join(',');
        EmergencyWaring.OffWarning({ "action": "deletebyids", "ids": id });
    },
    OffWarning: function (data) {
        EmergencyWaring.MyAjax(data, function () {
            EmergencyWaring.GetPageList();
            EmergencyWaring.RealTimeDetection();
        });
    },
    MyAjax: function (data, callfun) {
        $.ajax("Handler/AccidentAlarmHandler.ashx", {
            type: "post",
            dataType: "json",
            data: data,
            beforeSend: function () {
            },
            success: callfun,
            error: function () {
            }
        });
    },
    Quit: function () {
        $("#a_quid").click(function () {
            $.post("Handler/User.ashx", { "action": "quit" }, function (data) {
                if (data && data["SuccessCode"] == "1") {
                    window.parent.location.href = "login.html";
                }
            }, "json");
        })
    },
    SoundPlay: function (file) {
        clearTimeout(EmergencyWaring.SoundSetTimeoutObj);
        if (EmergencyWaring.SoundType != -1) {
            var src = EmergencyWaring.SoundList[EmergencyWaring.SoundType];
            var playControl = document.getElementById("soundPlay");
            playControl.src = src;
        }
        EmergencyWaring.SoundSetTimeoutObj = setTimeout(EmergencyWaring.SoundPlay, EmergencyWaring.SoundLoopTime);
    },
    Pos: function () {
        //$("#Container").css("left", $(window).width() - $("#Container").width());
        $("#Container").css("top", $(window).height() - $("#Container").height());
    },
    Up: function () {
        clearTimeout(EmergencyWaring.SetTimeoutObj);
        var h = $("#Message").height();
        $("#Message").animate({ "top": 236 - h }, 200);
        $("#up").hide();
        $("#down").show();
        EmergencyWaring.SetTimeoutObj = setTimeout(EmergencyWaring.Down, 30000);
    },
    Down: function () {
        $("#Message").animate({ "top": 200 }, 500);
        $("#up").show();
        $("#down").hide();
        clearTimeout(EmergencyWaring.SetTimeoutObj);
    },
    Start: function () {
        EmergencyWaring.Pos();
        EmergencyWaring.Down();
        $("#up").bind("click", EmergencyWaring.Up);
        $("#down").bind("click", EmergencyWaring.Down);
    }
}