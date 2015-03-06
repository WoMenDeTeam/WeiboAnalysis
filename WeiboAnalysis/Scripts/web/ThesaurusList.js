/// <reference path="../jquery-1.8.1.js" />


var zTreeNoodeId;
var _thesaurusList = new Object;
var ThesaurusList = _thesaurusList.property = {
    IdolParameter: { "display_style": 8, "act": "personalDetails", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false" },
    PageInitParameter: { "page_size": 15, "result_id": "list_body_div", "status_bar_id": "pagebar", "post_url": "../Handler/WeiboEventHandler.ashx" },
    queryparams: { "action": "getkeyworddata", "orderby": "" },
    innitdata: { "page_size": 15, "result_id": "newsList", "status_bar_id": "all_pager_list",
        "info_id": "all_info_id", "sql_tag": "all", "web_url": "../Handler/SqlSearch.ashx"
    },
    setting: {
        callback: {
            onClick: zTreeOnClick
        }
    },
    isinit: true,
    url: "../Handler/Keywords2Handler.ashx",
    zTreeObj: null,
    zNodes: null,
    currNode: null,
    _Template: null,
    Power: 0,
    _SerachKeyWords: "",
    _FileName: "",
    InitEvent: function () {
        Material.Init();
        if (ThesaurusList.Power == 1) {
            $("#right_oper").show();
            $("#left_btn").show();
        }
        //zTreeOnClick = this.zTreeOnClick;
        zTreeOnClick = this.zTreeOnClick;
        ThesaurusList._Template = new Analysis();
        this._Template.analysis.Init();
        ThesaurusList.realTimeWeibo();
        ThesaurusList.forwardNumSort();
        ThesaurusList.replyNumSort();

        $("#markDel").unbind("click").click(function () {
            ThesaurusList.markDel();
        });
        $("#markIgnored").unbind("click").click(function () {
            ThesaurusList.markIgnored();
        });
        $("#untreated").unbind().bind("click", function () {
            ThesaurusList.untreated();
        });
        $("#processType").unbind().bind("change", function () {
            var typeVal = this.value;

            if (typeVal == "0") {
                $("#markDel").show();
                $("#markIgnored").show();
                $("#untreated").hide();
            } else if (typeVal == "1") {
                $("#markDel").hide();
                $("#markIgnored").hide();
                $("#untreated").show();
            } else {
                $("#markDel").hide();
                $("#markIgnored").hide();
                $("#untreated").show();
            }
            ThesaurusList.GetPageAjax();
        });
        $("#export_to_excel").unbind().bind("click", ThesaurusList.ExportToExcel);
    },
    InitThesaurus: function () {
        var act = "initial";
        $.post(ThesaurusList.url,
		    { "act": act, "ajaxString": 1 },
		    function (data) {
		        if (data != "") {
		            ThesaurusList.zNodes = data;
		            $.fn.zTree.init($("#treeThesaurus"), ThesaurusList.setting, ThesaurusList.zNodes);
		            ThesaurusList.zTreeObj = $.fn.zTree.getZTreeObj("treeThesaurus");
		            var allnodes = ThesaurusList.zTreeObj.getNodes();
		            if (allnodes) {
		                ThesaurusList.ExpandTree(allnodes, 1, 1);
		                var zTreeNoodeId = allnodes[0].id;
		                ThesaurusList._FileName = allnodes[0].name;

		                $.post(ThesaurusList.url, { "act": "initEdit", "ajaxString": 1, "idList": zTreeNoodeId },
		                function (data) {
		                    if (data.Error == "1") {
		                    }
		                    if (data.Success == "1") {
		                        var words = ThesaurusList.GetWord(unescape(data["keyword"]));
		                        ThesaurusList._SerachKeyWords = words;
		                        ThesaurusList.GetPageAjax();
		                    }
		                }, "json");
		            }
		            $("#treeThesaurus li a:eq(0)").addClass("curSelectedNode");
		            ThesaurusList.isinit = true;
		        }
		    },
		    "json"
	    );
    },
    ExpandTree: function (data, level, expandlevel) {
        for (var item in data) {
            ThesaurusList.zTreeObj.expandNode(data[item]);
            if (level <= expandlevel) {
                var childnodes = data[item];
                if (childnodes) {
                    ThesaurusList.ExpandTree(childnodes, level + 1, expandlevel);
                }
            }
        }
    },
    Search: function (keywordid) {
        var where = " kid= " + keywordid;
        if (keywordid.indexOf(",") != -1) {
            where = " kid in(" + keywordid + ")";
        }
        var tag = $("#processType").val();
        where = where + " and tag=" + tag;
        ThesaurusList.queryparams["strwhere"] = where;
        var sqlpager = new SqlPager(ThesaurusList.innitdata);
        sqlpager.NoDataDis = function (obj) {
            $("#" + obj).empty().html("<tr><td colspan=\"3\" align=\"center\">没有数据</td></tr>");
        }
        sqlpager.Display = function (obj, data) {
            delete data["Count"];
            var content = [];
            for (var item in data) {
                var row = data[item];
                content.push("<tr>");
                content.push("<td width=\"30%\" align=\"left\" class=\"wmry_table_count\"><a href=\"" + unescape(row["url"]) + "\"");
                content.push(" target=\"_blank\" title=\"" + unescape(row["title"]) + "\">" + unescape(row["title"]) + "</a></td>");
                content.push("<td align=\"center\"  width=\"9%\" class=\"wmry-table_date\">" + (unescape(row["source"]) == "" ? "无" : unescape(row["source"])) + "</td>");
                content.push("<td align=\"center\"  width=\"40%\" class=\"wmry-table\">" + unescape(row["summary"]) + "</td>");
                content.push("<td align=\"center\" width=\"9%\" class=\"wmry-table_date\">" + unescape(row["datetime"]).substr(0, 10) + "</td>");
                content.push("<td align=\"center\"  width=\"7%\"  class=\"wmry-table_form\">" + (unescape(row["tag"]) == "0" ? "未处理" : unescape(row["tag"]) == "1" ? "已删除" : "已忽略") + "</td>");
                content.push("<td align=\"center\" width=\"5%\" class=\"wmry-table_date\"><input name=\"cbProcessSel\" type=\"checkbox\" value=\"" + unescape(row["id"]) + "\"/></td>");
                content.push("</tr>");
            }
            $("#" + obj).empty().html(content.join(""));
            ThesaurusList.InitFinishLoadFun();
        }
        sqlpager.LoadData(1, ThesaurusList.queryparams);
    }, InitFinishLoadFun: function () {

        $("#cbProcessAllSel").unbind("click").click(function () {
            var isChecked = $(this).attr("checked");
            $("input[name='cbProcessSel']").attr("checked", isChecked);
        });
    }, InnitAdd: function () {
        listTable.InnitAdd();
    },
    InitEdit: function (id_str, back_msg) {
        if (!zTreeNoodeId) {
            alert("请先选择要编辑的节点!");
            return;
        }
        listTable.initEdit(zTreeNoodeId, id_str, back_msg, "", ThesaurusList.url);
    }, Remove: function (msg, act, url) {

        if (!zTreeNoodeId) {
            alert("请先选择要删除的节点!");
            return;
        }
        if (!act) {
            act = "remove";
        }
        if (confirm(msg)) {
            if (!url) {
                url = ThesaurusList.url;
            }
            $.post(url,
			{ "act": act, "ajaxString": 1, "idList": zTreeNoodeId },
			function (data) {
			    if (data.Error == "1") {
			        alert("删除失败，原因是：" + data.ErrorStr);
			    }
			    if (data.Success == "1") {
			        ThesaurusList.InitThesaurus();
			    }
			},
			"json"
		);
        }
    },
    EditOne: function (params, act, url, disframe) {
        listTable.EditOne(params, act, url, disframe, "", listTable.url, "");
    }, //IDOL请求
    realTimeWeibo: function () {//实时微博
        $("#real_time_btn").click(function () {
            ThesaurusList.sortByWhere(this, "Date");
        })
    },
    forwardNumSort: function () {//转发最多
        $("#hot_point_btn").click(function () {
            ThesaurusList.sortByWhere(this, "FORWARDNUM:numberdecreasing");
        });
    },
    replyNumSort: function () {// 评论微博 
        $("#negative_btn").click(function () {
            ThesaurusList.sortByWhere(this, "REPLYNUM:numberdecreasing");
        });
    }, sortByWhere: function (dom, sortWhere) {
        $("#actionBtns li").removeClass("on");
        $(dom).addClass("on");
        ThesaurusList.IdolParameter["sort"] = sortWhere;
        ThesaurusList.GetPageAjax();
    },
    GetPageAjax: function () {
        var filetextArray = [];
        var history = {};
        var condition = [];
        var keyWorde = ThesaurusList._SerachKeyWords;
        ThesaurusList.IdolParameter["text"] = keyWorde;
        ThesaurusList.IdolParameter["fieldtext"] = "MATCH{" + $("#processType").val() + "}:OPTSTATE";
        if ($("#processType").val() == "0") {
            ThesaurusList.IdolParameter["fieldtext"] = "EMPTY{}:OPTSTATE";
        }
        ThesaurusList.loadIdol();
    },
    loadIdol: function () {
        $("#list_body_div").empty().append("<div class='load_out'><div class='load_in'><img src='img/load_big.gif' /></div></div>");
        var Lpager = new Pager(ThesaurusList.PageInitParameter);
        Lpager.Display = function (data) {
            $("#currpage_b").text(this.currPageIndex + "/" + this.page_count);
            $("#count_b").text(this.totalCount);
            //加载模板
            ThesaurusList._Template.analysis.resultDataIdol(data.data);
            //t添加/取消关注事件
            ThesaurusList._Template.analysis.showUserInfoDiv();
            $("span[name='favorite'] a").click(function () {
                ThesaurusList._Template.analysis.initFavoriteEvent(this);
            });
            ThesaurusList._Template.analysis.checkboxChange(); //加载复选框事件
        };
        Lpager.LoadData(1, ThesaurusList.IdolParameter);
    },
    zTreeOnClick: function (event, treeId, treeNode) {
        // alert("ok");
        var l_nodes = treeNode.childs;
        zTreeNoodeId = treeNode.id
        ThesaurusList._SerachKeyWords = treeNode.name;
        ThesaurusList.GetPageAjax();
    }, markDel: function () {
        ThesaurusList._Template.analysis.markOperate("Handler/Keywords2Handler.ashx", "markDel", function (data) {
            alert("操作成功!");
            ThesaurusList._Template.analysis.catcheData.items.length = 0;
            $("input[type='checkbox']").removeAttr("checked");

            ThesaurusList.GetPageAjax();
        });
        //删除
    }, markIgnored: function () {
        //忽略
        ThesaurusList._Template.analysis.markOperate("Handler/Keywords2Handler.ashx", "markIgnored", function (data) {

            ThesaurusList._Template.analysis.catcheData.items.length = 0;
            $("input[type='checkbox']").removeAttr("checked");
            alert("操作成功!");
            ThesaurusList.GetPageAjax();
        })
    }, untreated: function () {
        ThesaurusList._Template.analysis.markOperate("Handler/Keywords2Handler.ashx", "untreated", function (data) {
            alert("操作成功!");
            ThesaurusList._Template.analysis.catcheData.items.length = 0;
            $("input[type='checkbox']").removeAttr("checked");
            ThesaurusList.GetPageAjax();
        })
    }, InitPower: function (callFun) {
        var data = { "act": "power", "ajaxString": 1 };
        $.post("Handler/Keywords2Handler.ashx", data, function (data) {
            ThesaurusList.Power = data.Power;
            callFun();
        }, "json");
    }, GetWord: function (word) {
        word.replace("，", ",");
        var wordArray = word.split(" ");
        for (var i = 0; i < wordArray.length; i++) {
            var newKeyWord = wordArray[i].split(',');
            if (newKeyWord.length > 1) {
                wordArray[i] = "(\"" + newKeyWord.join("\" OR \"") + "\")";
            } else {
                wordArray[i] = "(\"" + wordArray[i] + "\")";
            }
        }
        word = wordArray.join(" AND ");
        return word;
    }, ExportToExcel: function () {
        ThesaurusList._FileName = ThesaurusList._FileName.replace(" ", "");
        var newParameter = { "display_style": 8, "act": "exporttoexcel", "action": "query", "Highlight": "Terms", "characters": "300", "mindate": "", "maxdate": "", "database": Config.IdolDataBase["newweibo"], "databasematch": Config.IdolDataBase["newweibo"], "totalresults": "True", "summary": "context", "maxresults": "5", "text": "*", "print": "all", "sort": "Date", "start": "1", "predict": "false" };
        newParameter["act"] = "exporttoexcel";
        newParameter["text"] = ThesaurusList._SerachKeyWords;
        newParameter["page_size"] = $("#count_b").html();
        newParameter["sort"] = ThesaurusList.IdolParameter["sort"];
        var p = "";
        for (var i in newParameter) {
            p += i + "=" + newParameter[i] + "&";
        }
        window.location.href = "ExportToExcel.aspx?fname=" + ThesaurusList._FileName + "&" + p + "_dd=" + new Date().getDate();
    }
}
//单击树节点事件
//treeNode:当前点击的节点
function zTreeOnClick(event, treeId, treeNode) {

    if (ThesaurusList.isinit) {
        if ($("a.curSelectedNode").length > 1)
            $("#treeThesaurus li a:eq(0)").removeClass("curSelectedNode");

        ThesaurusList.isinit = false;
    }
    var l_nodes = treeNode.childs;
    zTreeNoodeId = treeNode.id
    ThesaurusList._FileName = treeNode.name;
    $.post(ThesaurusList.url,
		{ "act": "initEdit", "ajaxString": 1, "idList": zTreeNoodeId },
		function (data) {
		    if (data.Error == "1") {
		    }
		    if (data.Success == "1") {
		        var words = _getKeyWords(unescape(data["keyword"])); //.split(' ');
		        ThesaurusList._SerachKeyWords = words; 
		        ThesaurusList.GetPageAjax();
		    }
		}, "json");
    function _getKeyWords(word) {
        word.replace("，", ",");
        var wordArray = word.split(" ");
        for (var i = 0; i < wordArray.length; i++) {
            var newKeyWord = wordArray[i].split(',');
            if (newKeyWord.length > 1) {
                wordArray[i] = "(\"" + newKeyWord.join("\" OR \"") + "\")";
            } else {
                wordArray[i] = "(\"" + wordArray[i] + "\")";
            }
        }
        word = wordArray.join(" AND ");
        return word;
    }
}

$(document).ready(function () {
    ThesaurusList.InitPower(function () {
        ThesaurusList.InitEvent();
        ThesaurusList.InitThesaurus();
    });
});
