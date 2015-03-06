// JavaScript Document
function Pager(s) {
    this.start = 1; //初始化开始页数
    this.page_size = s.page_size == null ? 10 : s.page_size; //初始化pagesize	
    this.status_bar_id = s.status_bar_id; //初始化分页状态栏的ID
    this.result_id = s.result_id; //初始化结果集的ID
    this.page_count = 20; //总页数，通过返回结果totalcount与page_size进行计算
    this.status = []; //记录当前状态下开始和结束所对应的页码数
    this.query_params = null; //存储IDOL对应的参数
    this.total_count = 0; //记录信息总数
    this.Start_time = new Date(); //记录当前时间，用于搜索的时间统计
    this.end_time = null; //记录AJAX请求完成时的时间
    this.post_url = s.post_url == null ? "Search.ashx" : s.post_url; //ajax请求对应的处理文件，默认为search.ashx
    this.recordkeyword = true; //是否记录搜索词
    this.diszhuanfatag = s.diszhuanfatag == null ? true : s.diszhuanfatag; //是否在页面显示转发功能
    this.disotherinfo = s.disotherinfo == null ? false : s.disotherinfo; //是否显示相关咨询
    this.dissamenews = s.dissamenews; // == "MATCH{news}:C1" ? false : true是否显示相当新闻
    this.StoreStateID = null; //记录StoreStateID，用于二次查询，其使用与GetStoreState相对应。
    this.GetStoreState = true; //是否记录当前StoreStateID
}
/*获取当前状态的开始和对应的页码数*/
Pager.prototype.GetStatus = function (current_page) {
    this.status = [];
    if (current_page < 5) {
        this.status.push(["start", 1]);
        if (this.page_count < 5) {
            this.status.push(["end", this.page_count]);
        }
        else {
            this.status.push(["end", 5]);
        }

    }
    else if (current_page >= 5 && current_page <= (this.page_count - 4)) {
        this.status.push(["start", current_page - 2]);
        this.status.push(["end", current_page + 2]);
    }
    else {
        if (this.page_count - 2 > 0) {
            this.status.push(["start", this.page_count - 2]);
        }
        else {
            this.status.push(["start", 1])
        }
        this.status.push(["end", this.page_count]);
    }
}
/*对分页栏进行初始化*/
Pager.prototype.Init_status_bar = function (current_page) {
    var obj = this;
    this.GetStatus(current_page);

    if (this.status) {
        var start_index = this.status[0][1];
        var end_index = this.status[1][1];
        var content = [];
        content.push("<span class=\"left\">");
        /*if (this.diszhuanfatag) {
        content.push("全选<input type=\"checkbox\" id=\"btn_select_all_item\" />");
        content.push("<a href=\"javascript:void(null);\" id=\"btn_zhuanfa\">转发</a>");
        }*/
        content.push("共<b class=\"color_2\">" + this.total_count + "</b>");
        content.push("条记录，现在第<b class=\"color_2\">" + current_page + "</b>/<b>");
        content.push(this.page_count + "</b>页</span>");
        content.push("<span class=\"right\">转到<input id=\"choose_pager_input\" type=\"text\" style=\"width:40px;\" />页");
        content.push("<a id=\"btn_choose_pager\" class=\"btn_page_go\" href=\"javascript:void(null);\"></a></span>");
        if (this.page_count > 1) {
            if (current_page > 1) {
                content.push("<a href=\"javascript:void(null);\" name=\"Pager1\" class=\"btn_page\">首&nbsp;&nbsp;页</a>&nbsp;&nbsp;");
                content.push("<a href=\"javascript:void(null);\" name=\"Pager" + (current_page - 1) + "\" class=\"btn_page\">上一页</a>");
            }
        }
        for (var i = start_index; i <= end_index; i++) {
            if (i == current_page) {
                content.push("<b>" + i + "</b>");
            }
            else {
                content.push("<a href=\"javascript:void(null);\" name=\"Pager" + i + "\">" + i + "</a>");
            }
        }
        if (this.page_count > 1) {
            if (current_page < this.page_count) {
                content.push("<a href=\"javascript:void(null);\" name=\"Pager" + (current_page + 1) + "\" class=\"btn_page\">下一页</a>&nbsp;&nbsp;");
                content.push("<a href=\"javascript:void(null);\" name=\"Pager" + this.page_count + "\" class=\"btn_page\">尾&nbsp;&nbsp;页</a>");
            }
        }

        $("#" + this.status_bar_id).html(content.join(""));
        $("#" + this.status_bar_id).find("a[name^='Pager']").each(function () {
            if ($(this).attr("class") != "current") {
                $(this).click(function () {
                    var page_index = parseInt($(this).attr("name").replace("Pager", ""));
                    obj.query_params["start"] = (page_index - 1) * obj.page_size + 1;
                    obj.recordkeyword = false;
                    obj.GetStoreState = false;
                    obj.LoadData(page_index, obj.query_params);
                });
            }
        });
        $("#btn_choose_pager").click(function () {
            var pager = $("#choose_pager_input").val();
            if (pager) {
                var l_pager = parseInt(pager);
                if (l_pager <= 0) {
                    alert("对不起，页数必须大于0");
                    return;
                } else if (l_pager > obj.page_count) {
                    alert("对不起，页数不能超过最大页数");
                    return;
                } else {
                    obj.query_params["start"] = (l_pager - 1) * obj.page_size + 1;
                    obj.recordkeyword = false;
                    obj.LoadData(l_pager, obj.query_params);
                }
            }
        });

        $("#btn_select_all_item").click(function () {
            var type = $(this).attr("checked");
            if (type) {
                $("input[name='idol_news_list_item']").attr("checked", "checked");
            } else {
                $("input[name='idol_news_list_item']").removeAttr("checked");
            }
        });

        /*$("#btn_zhuanfa").click(function() {
        var len = $("input[name='idol_news_list_item']:checked").length;
        if (len == 0) {
        alert("请选择转发的内容");
        return;
        }

        Control.BtnSubmitClick = function(allnodes, contain_frame) {
        var userid_list = [];
        var username_list = [];
        for (var i = 0, j = allnodes.length; i < j; i++) {
        var treenode = allnodes[i];
        if (!treenode.nodes || treenode.nodes.length == 0) {
        userid_list.push(treenode.id);
        username_list.push(escape(treenode.name));
        }
        }
        if (userid_list.length == 0) {
        alert("请选择转发用户！");
        return;
        }
        var post_pramas = obj.GetPostParams();
        post_pramas["userid_list"] = userid_list.join("|");
        post_pramas["username_list"] = username_list.join("|");
        $.post("Handler/NoteMessage.ashx",
        post_pramas,
        function(data) {
        if (data) {
        if (data.Success == 1) {
        alert("转发成功");
        $(contain_frame).hide();
        } else {
        alert("转发失败");
        }
        } else {
        alert("转发失败");
        }
        },
        "json"
        );
        }
        Control.Init(this, 2);

        });*/
    }
}
/*获取请求参数，转发功能开启时使用*/
Pager.prototype.GetPostParams = function () {
    var href_list = [];
    var title_list = [];
    var date_list = [];
    $("input[name='idol_news_list_item']:checked").each(function () {
        var date_str = $(this).attr("date");
        var href_str = $(this).attr("pid");
        var title_str = $(this).attr("cate");
        var push_date_str = date_str == "undefined" ? "" : date_str;
        var push_href_str = href_str == "undefined" ? "" : href_str;
        var push_title_str = title_str == "undefined" ? "" : title_str;
        href_list.push(push_href_str);
        title_list.push(push_title_str);
        date_list.push(push_date_str);

    });
    var post_pramas = {};
    post_pramas["href_list"] = href_list.join("|");
    post_pramas["title_list"] = title_list.join("|");
    post_pramas["date_list"] = date_list.join("|");
    return post_pramas;
}
/*获取数据并展示*/
Pager.prototype.LoadData = function (page_index, query_params) {
    if (this.GetStoreState) {
        $("#info_frame").hide();
    }
    if (!this.query_params) {
        this.query_params = query_params;
        this.query_params["page_size"] = this.page_size;

    }
    if (!this.recordkeyword) {
        delete this.query_params["isrecordkeyword"];
    }
    this.query_params["start"] = (page_index - 1) * this.page_size + 1;
    this.query_params["Anticache"] = Math.floor(Math.random() * 100);
    var newparams = this.DealParams(this.query_params);
    newparams["combine"] = "DRETITLE";
    var obj = this;
    $.ajax({
        type: "get",
        url: "Handler/" + obj.post_url,
        data: newparams,
        beforeSend: function (XMLHttpRequest) {
            $("#" + obj.result_id).empty().html("<center style=\"font-size:12px;height:100px;padding-top:100px; \"><img src=\"img/loading_icon.gif\" /></center>");
            $("#" + obj.status_bar_id).empty().html("<center style=\"font-size:12px;height:100px;padding-top:100px;\"><img src=\"img/loading_icon.gif\" /></center>");
        },
        dataType: "json",
        success: function (data) {
            if (data || parseInt(data["TotalCount"]) == 0) {
                if (query_params["display_style"] == 6 || query_params["display_style"] == 8 || query_params["display_style"] == 9) {
                    var total_count = parseInt(data["totalcount"]);
                    var l_total_count = total_count;
                    var count = parseInt(l_total_count / obj.page_size);
                    obj.page_count = l_total_count % obj.page_size == 0 ? count : count + 1;
                    obj.total_count = l_total_count;
                    obj.Init_status_bar(page_index);
                    obj.Display(data, obj);
                    /*if (obj.disotherinfo && obj.GetStoreState) {
                    obj.InnitOtherInfo(newparams);
                    }*/
                } else {
                    obj.end_time = new Date();
                    $("#" + obj.result_id).html(unescape(data["HtmlStr"]));
                    var total_count = parseInt(data["TotalCount"]);
                    var l_total_count = total_count > 5000 ? 5000 : total_count;
                    var count = parseInt(l_total_count / obj.page_size);
                    obj.page_count = l_total_count % obj.page_size == 0 ? count : count + 1;
                    obj.Init_status_bar(page_index);
                    obj.total_count = total_count;
                    obj.OtherFn(total_count);
                    if (query_params["display_style"] == 5) {
                        $("#" + obj.result_id).find("li").each(function () {
                            $(this).hover(
                            function () {
                                var obj = $(this).find("span[name='comment_div']");
                                obj.show();
                                obj.parent("div").css({ "background": "#dbe5ec" });
                            },
                            function () {
                                var obj = $(this).find("span[name='comment_div']");
                                obj.hide();
                                obj.parent("div").css({ "background": "white" });
                            }
                        )
                        });

                        $("#" + obj.result_id).find("a[id^='btn_design_']").click(function () {
                            var type = $(this).attr("id").split('_')[2];
                            var doc_id = $(this).attr("pid");
                            switch (type) {
                                case "bad":
                                    obj.TraiTag(doc_id, "Sentiment", "n", "editdoc");
                                    break;
                                case "positive":
                                    obj.TraiTag(doc_id, "Sentiment", "p", "editdoc");
                                    break;
                                case "neutral":
                                    if (confirm("您确定要删除该信息？")) {
                                        obj.TraiTag(doc_id, "Sentiment", "m", "deletedoc");
                                    }
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                    $("a[name='article_delete']").click(function () {
                        if (confirm("您确定要删除该信息？")) {
                            var docid = $(this).attr("pid");
                            obj.TraiTag(docid, "", "", "deletedoc");
                        }
                    });
                }
            }
            else {
                $("#" + obj.result_id).html("<center>对不起，没有数据</center>");
                $("#" + obj.status_bar_id).empty();
                obj.OtherFn(0);
            }
        }
    });
}
Pager.prototype.DealParams = function (params) {
    var new_params = {};
    for (var item in params) {
        var l_item = item.toLowerCase();
        new_params[l_item] = params[item];
    }
    return new_params;
}
Pager.prototype.OtherFn = function (totalcount) {
    return null;
}

Pager.prototype.Display = function (data, obj) {
    return null;
}

Pager.prototype.TraiTag = function (docid, fieldname, fieldvalue, type) {
    $.get("Handler/TrainTag.ashx",
        { "docid_list": docid, "field_name": fieldname, "field_value": fieldvalue, "type": type },
        function (data) {
            if (data == "success") {
                if (type == "editdoc") {
                    var tagName = null;
                    switch (fieldvalue) {
                        case "p":
                            tagName = "【正面】";
                            break;
                        case "m":
                            tagName = "【中立】";
                            break;
                        case "n":
                            tagName = "【负面】";
                            break;
                        default:
                            break;
                    }
                    $("#sentiment_" + docid).empty().html(tagName);
                } else if (type == "deletedoc") {
                    $("#sentiment_" + docid).parent("h2").parent("li").remove();
                    $("#idol_article_" + docid).remove();
                }
            } else {
                alert("操作失败");
            }
        }
    );
}

Pager.prototype.InnitOtherInfo = function (params) {
    var obj = this;
    $("#info_frame").show();
    $("#leader_info").empty().html("<li><center style=\"font-size:12px;height:100px; padding-top:100px;\"><img src=\"img/loading_icon.gif\" /></center></li>");
    $("#org_info").empty().html("<li><center style=\"font-size:12px;height:100px; padding-top:100px;\"><img src=\"img/loading_icon.gif\" /></center></li>");
    params["type"] = "1";
    $.post("Handler/ResultInfo.ashx",
        params,
        function (data) {
            if (data) {
                obj.StoreStateID = unescape(data["StoreStateID"]);
                delete data["StoreStateID"];
                obj.InnitResultInfoHtml("leader_info", data["leaderinfo"]);
                obj.InnitResultInfoHtml("org_info", data["orginfo"]);
            }
        },
        "json"
    );
}
Pager.prototype.InnitResultInfoHtml = function (obj, data) {
    var curret_obj = this;
    delete data["SuccessCode"];
    var content = [];
    var l_count = 0;
    for (var item in data) {
        var row = data[item];
        var keyword = unescape(row["tag"]);
        var count = parseInt(row["count"]);
        if (count > 0) {
            content.push("<li><a href=\"javascript:void(null);\" queryrule=\"" + row["queryrule"] + "\"");
            content.push(" pid=\"" + curret_obj.StoreStateID + "\"><b>" + keyword + "<span class=\"color_5\">");
            content.push("（<code>" + count + "</code>）</span></b></a></li>");
            l_count++;
        }
    }
    if (l_count > 0) {
        $("#" + obj).empty().html(content.join(""));
    } else {
        $("#" + obj).empty().html("<li>没有相关信息</li>");
    }
    $("#" + obj).find("a").click(function () {
        var StoreStateID = $(this).attr("pid");
        var queryrule = unescape($(this).attr("queryrule"));
        window.open("list.html?keyword=" + queryrule + "&statematchid=" + StoreStateID);
    });
}