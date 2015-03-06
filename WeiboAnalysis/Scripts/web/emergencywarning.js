/// <reference path="../jquery-1.8.1.js" />
/// <reference path="../SqlPager.js" />
//SourceType=1 AND AlarmState IN(0,-1,-3,-4)   AlarmState BETWEEN -1 AND 0  //AlarmState DESC,
var EmergencyWaring = {
    SqlInitData: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/AccidentAlarmHandler.ashx" },
    SqlData: { "action": "getPage", "where": "  SourceType=0 AND AlarmState in(0,-1)  ", "orderBy": "  AlarmState DESC ,SourceType DESC, PublishTime DESC " },
    SoundList: ["sound/yiji.wav", "sound/erji.wav", "sound/sanji.wav"],
    SoundType: 0,
    SoundLoopTime: 180000,
    SoundIsInit: true,
    SoundSetTimeoutObj: Object,
    SetTimeoutObj: Object,
    RealTimeSetTimeoutObj: Object,
    RefreshTimestamp: 30000,
    LastRefreshTime: "",
    AlarmDataCount: -1,
    UserRole: 1,
    CurrPageIndex: 1,
    CurrCount: 0,
    TypeTag: "gxb",
    OrderByTag: "time",
    AdminWhere: " AND level>=8 ",
    isLookTagInfo: true,
    AlarmKeywords: "", //临时预警词
    DefaultTime: "",
    DefaultYuJingGuiZe: "",
    ListTemplate: function (data) { },
    Init: function () {
        Common.ValIsEmpty("btn_close", "remarks_txt", "txtKWNameCheck");
        //var text = "/[游泳|燃气|石油|化工厂爆炸]+/g";

        //var rg = RegExp(eval(text));
        //var title = "快讯：汉川一化工厂爆炸附近民居房屋受损";
        //alert(rg.test(title));
        $("#accidentalarm_start_time").val("");
        $("#accidentalarm_end_time").val("");
        $("#accidentalarm_keyword_txt").val("");
        $("#accidentalarm_search_btn").unbind().bind("click", EmergencyWaring.DefaultSearch);
        //EmergencyWaring.SqlData["where"] += EmergencyWaring.AdminWhere;
        EmergencyWaring.Quit();
        //提示框位置初始化
        EmergencyWaring.Start();
        //获取预警列表
        // EmergencyWaring.GetPageList();
        //循环刷新预警信息
        //EmergencyWaring.RealTimeDetection();
        EmergencyWaring.GetSeting();
        //初始化页面事件的绑定 主要是全选框，批量处理预警事件和排序方式
        EmergencyWaring.PageEventBind();
        EmergencyWaring.CountTagInfo();

    }, DefaultSearch: function () {
        var obj = EmergencyWaring.GetPargeParam();
        EmergencyWaring.GetPageList(obj);
        EmergencyWaring.CountTagInfo();
    }, GetSeting: function () {
        $.ajax("Handler/KeyWordsHandler.ashx", {
            url: "Handler/KeyWordsHandler.ashx",
            type: "POST",
            data: { "act": "initKeywords", "start": 1, "page_size": 100, "where": " KeywordType IN (100,200,201) ", "orderBy": " KeywordType DESC" },
            dataType: "JSON",
            success: function (data) {
                var count = 1;
                var entity = data["entity_" + count];
                if (!entity) {
                    return;
                }
                var keywords = [];
                while (entity) {
                    if (entity.KeywordType === "100") { //临时词库
                        var newname = unescape(entity.Name);
                        newname = newname.replace(/(（)|(\()/g, "\(").replace(/(）)|(\))/g, "\)+").replace(/(and)/g, "(\\W|\\w)*").replace(/(or)/g, "|").replace(/\s+/g, "");
                        keywords.push("(" + newname + ")+");
                    } else if (entity.KeywordType === "200") {  //非预警时间
                        EmergencyWaring.DefaultYuJingGuiZe = entity.Name;
                    } else if (entity.KeywordType === "201") { //最近时间段
                        var tTime = new Date();
                        tTime.setDate(tTime.getDate() - parseInt(entity.Name));
                        var y = tTime.getFullYear();
                        var m = tTime.getMonth() + 1;
                        m = m < 10 ? "0" + m : m;
                        var d = tTime.getDate();
                        d = d < 10 ? "0" + d : d;
                        EmergencyWaring.DefaultTime = y + "-" + m + "-" + d;
                        // $("#accidentalarm_start_time").val(EmergencyWaring.DefaultTime);
                    }
                    entity = data["entity_" + (++count)];
                }
                EmergencyWaring.AlarmKeywords = "/" + keywords.join("|") + "/g";

                var param = EmergencyWaring.GetPargeParam();
                //获取预警列表
                EmergencyWaring.GetPageList(param);
                //循环刷新预警信息
                EmergencyWaring.RealTimeDetection();

            }
        });
    }, PageEventBind: function () {

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
        var biaojixinxi = $("#tagininfo_btn");
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
        $("#newalarminfo_btn").unbind().bind("click", function () {
            $("#click_all_ckbox,#yixuan_code,#show_topic_div,#bytime,#byurgent").show();
            $("#accidentalarm_start_time").val(EmergencyWaring.DefaultTime);
            EmergencyWaring.CurrPageIndex = 1;
            EmergencyWaring.TypeTag = "xtxx";
            EmergencyWaring.SqlData["where"] = " SourceType=0 AND AlarmState in(0,-1)  ";
            $("#accidentalarm_search_btn").unbind().bind("click", EmergencyWaring.DefaultSearch);
            EmergencyWaring.GetPageListByTime();
            $("#bytime,#byurgent,#by_gxb,#xitongxinxi,#tagininfo_btn,#newalarminfo_btn").removeClass("on");
            $("#bytime,#newalarminfo_btn").addClass("on");

        });
        //查看标记信息
        biaojixinxi.unbind().bind("click", function () {
            //EmergencyWaring.ChangeOrder(this);
            $("#click_all_ckbox,#yixuan_code,#show_topic_div,#bytime,#byurgent").hide();
            $("#bytime,#byurgent,#by_gxb,#xitongxinxi,#tagininfo_btn,#newalarminfo_btn").removeClass("on");
            $("#bytime,#tagininfo_btn").addClass("on");
            $("#accidentalarm_start_time,#accidentalarm_end_time,#accidentalarm_keyword_txt").val("");
            $("#accidentalarm_search_btn").unbind().bind("click", function () {
                EmergencyWaring.CurrPageIndex = 1;
                EmergencyWaring.GetTagInfo();
            });
            EmergencyWaring.CurrPageIndex = 1;
            EmergencyWaring.GetTagInfo();
        });
        //所有国信办的数据
        byGuoXinBan.unbind().bind("click", function () {
            EmergencyWaring.CurrPageIndex = 1;
            $("#click_all_ckbox,#yixuan_code,#show_topic_div,#bytime,#byurgent").show();
            $("#bytime,#byurgent,#by_gxb,#xitongxinxi,#tagininfo_btn").removeClass("on");
            $("#bytime,#by_gxb").addClass("on");
            // $("#accidentalarm_start_time").val(EmergencyWaring.DefaultTime);
            $("#accidentalarm_start_time,#accidentalarm_end_time,#accidentalarm_keyword_txt").val("");
            $("#accidentalarm_search_btn").unbind().bind("click", EmergencyWaring.DefaultSearch);
            EmergencyWaring.GuoXinBan();
        });
        $("#xitongxinxi").unbind().bind("click", function () {
            $("#click_all_ckbox,#yixuan_code,#show_topic_div,#bytime,#byurgent").show();
            $("#accidentalarm_start_time").val(EmergencyWaring.DefaultTime);
            EmergencyWaring.CurrPageIndex = 1;
            EmergencyWaring.TypeTag = "xtxx";
            EmergencyWaring.SqlData["where"] = " SourceType=0 AND AlarmState in(0,-1)  ";
            // $("#accidentalarm_search_btn").unbind().bind("click", EmergencyWaring.DefaultSearch);
            $("#accidentalarm_start_time,#accidentalarm_end_time,#accidentalarm_keyword_txt").val("");
            EmergencyWaring.GetPageListByTime();
            $("#bytime,#byurgent,#by_gxb,#xitongxinxi,#tagininfo_btn,#newalarminfo_btn").removeClass("on");
            $("#bytime,#xitongxinxi").addClass("on");
        });
        $("#tag_msg_btn").unbind().bind("click", function () {
            EmergencyWaring.CurrPageIndex = 1;
            EmergencyWaring.GetTagInfo();
        });
    },
    ChangeOrder: function (doc) {
        //,#by_gxb
        $("#bytime,#byurgent,#biaojixinxi_btn").removeClass("on");
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
            // || d.Count > 0
            if (d.allCount != EmergencyWaring.CurrCount) {
                //class="on"
                var id = $(".column .on").attr("id");
                if (id === "xitongxinxi" || id === "newalarminfo_btn") {
                    var param = EmergencyWaring.GetPargeParam();
                    EmergencyWaring.GetPageList(param);
                }
            }
            //新出现信息预警提示
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

        var rg = new RegExp(eval(EmergencyWaring.AlarmKeywords));
        for (var i = 0, j = data.length; i < j; i++) {

            if (EmergencyWaring.SoundType < 2 && data[i].HigLevel > 10 || data[i].SourceType == "1") {
                EmergencyWaring.SoundType = 2;
            } else if (EmergencyWaring.SoundType < 1 && data[i].HigLevel > _getHours()) {
                EmergencyWaring.SoundType = 1;
            }

            if (EmergencyWaring.SoundType < 0) {
                var otitle = unescape(data[i].Title);
                if (rg.test(otitle)) {
                    EmergencyWaring.SoundType = 1;
                }
            }
        }

        //23:00至凌晨05:00 5人以上报警，其他世界3人以上报警
        function _getHours() {
            var t = EmergencyWaring.DefaultYuJingGuiZe.split("-");
            var maxH = parseInt(t[0]);
            var minH = parseInt(t[1]);
            var per = parseInt(t[2]);
            var result = parseInt(t[3]); //默认
            var h = new Date().getHours();
            if (h >= maxH || h <= minH) {
                result = per;
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
        EmergencyWaring.OrderByTag = "time";
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
    }, GetTagInfo: function () {
        EmergencyWaring.isLookTagInfo = true;
        var initData = { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pageBar", "info_id": "pageBar", "sql_tag": "item", "web_url": "Handler/AccidentAlarmHandler.ashx" };
        var postData = { "action": "taginfolist", "where": " Tag=1 ", "orderBy": "  PublishTime DESC " };
        var currpage_b = $("#currpage_b");
        var count_b = $("#count_b");
        var listBody_div = $("#list_body_div");
        var sp = new SqlPager(initData);
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
                var result = EmergencyWaring.ListTemplate(newdata);
                listBody_div.append(result);
            }
            EmergencyWaring.ResetCheckState();
        }
        postData["starttime"] = $("#accidentalarm_start_time").val();
        postData["endtime"] = $("#accidentalarm_end_time").val();
        postData["keywordtext"] = $("#accidentalarm_keyword_txt").val();
        sp.LoadData(EmergencyWaring.CurrPageIndex, postData);

    }, GetPageList: function (parm) {
        if (parm == undefined || parm == null) {
            EmergencyWaring.SqlData["starttime"] = "";
            EmergencyWaring.SqlData["endtime"] = "";
            EmergencyWaring.SqlData["keywordtext"] = "";

        } else {
            EmergencyWaring.SqlData["starttime"] = parm["starttime"];
            EmergencyWaring.SqlData["endtime"] = parm["endtime"];
            EmergencyWaring.SqlData["keywordtext"] = parm["keywordtext"];
        }
        EmergencyWaring.RefreshThisPage();
    }, RefreshThisPage: function () {
        EmergencyWaring.isLookTagInfo = false;
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
        if (data.AlarmState == 0) {
            doc.push("<span class=\"form\"><input name=\"chkItem\" type=\"checkbox\" value=\"" + id + "\" /></span>");
        }
        doc.push("<span class=\"text\"><a name=\"deleteAlarr off\" aid=" + id + " class=\"" + degree + "\" href=\"" + unescape(data.Url) + "\" target=\"_blank\">" + unescape(data.Title) + "</a>");
        if (data.Tag === "1" && data.Remark !== "") {
            doc.push("<span class=\"text\" ><span style=\"padding-left:23px;font-size:12px;\">备注：" + data.Remark + "</span></span>");
        }
        doc.push("</span>");
        doc.push("<code>");
        doc.push(data.CreateTime);
        doc.push("</code>");
        if (data.SourceType == "1") {
            doc.push("<code>");
            doc.push("LV" + data.Level);
            doc.push(" 来源鹰眼");
            doc.push("</code>");
        }
        doc.push("<code>");
        if (data.Tag === "0") {
            doc.push("<a name='add_tag' aid='" + id + "' href='javascript:void(0);'>备注</a>");
        }
        if (data.Tag === "1") {
            doc.push("<a name='cancel_tag' aid='" + id + "' href='javascript:void(0);'>取消备注</a>");
        }

        doc.push("</code>");
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
        _doc.find("[name='add_tag']").bind("click", EmergencyWaring.AddTag);
        _doc.find("[name='cancel_tag']").bind("click", EmergencyWaring.CancelTag);
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
    }, AddTag: function () {
        var id = $(this).attr("aid");
        $("#remarks_txt").val("");
        Common.ShowEditFrame("sad", "topicmove_column", "layer", "btn_close");
        $("#submit_bz_btn").unbind().bind("click", function () {
            var txt = $("#remarks_txt").val();
            txt = txt.replace(/\s+/img, "");
            var data = { "action": "addtag", "id": id, "remark": txt, "_t": new Date().valueOf() };
            EmergencyWaring.MyAjax(data, function () {
                if (EmergencyWaring.isLookTagInfo) {
                    EmergencyWaring.GetTagInfo();
                } else {
                    EmergencyWaring.RefreshThisPage();
                }
                Common.CloseEditFrame("sad", "layer");
                Common.SubmitPop("submitPopDiv");
                EmergencyWaring.CountTagInfo();
            });

        });
        //var id = $(this).attr("aid");
        //var data = { "action": "addtag", "id": id };
        //EmergencyWaring.MyAjax(data, function () {
        //    if (EmergencyWaring.isLookTagInfo) {
        //        EmergencyWaring.GetTagInfo();
        //    } else {
        //        EmergencyWaring.RefreshThisPage();
        //    }
        //    EmergencyWaring.CountTagInfo();
        //});
    }, CancelTag: function () {
        if (!confirm("取消备注？")) {
            return;
        };
        var t = new Date();
        var id = $(this).attr("aid");
        var data = { "action": "canceltag", "id": id, "_t": t.valueOf() };
        EmergencyWaring.MyAjax(data, function () {
            if (EmergencyWaring.isLookTagInfo) {
                EmergencyWaring.GetTagInfo();
            } else {
                EmergencyWaring.RefreshThisPage();
            }
            EmergencyWaring.CountTagInfo();
            Common.SubmitPop("submitPopDiv");
        });

    }, CountTagInfo: function () {
        var stime = $("#accidentalarm_start_time").val();
        var etime = $("#accidentalarm_end_time").val();
        var data = { "action": "counttaginfo", "sTime": "", "eTime": "" }
        EmergencyWaring.MyAjax(data, function (d) {
            $("#biaojixinxi").html(d.count);
        });
    }, MyAjax: function (data, callfun) {
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