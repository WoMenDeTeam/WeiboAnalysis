// JavaScript Document
function Pager(s) {
    this.start = 1;
    this.page_size = s.page_size == null ? 10 : s.page_size;
    this.status_bar_id = s.status_bar_id;
    this.result_id = s.result_id;
    this.page_count = 20;
    this.status = [];
    this.query_params = null;
    this.total_count = 0;
    this.Start_time = new Date();
    this.end_time = null;
    this.post_url = s.post_url == null ? "Handler/Search.ashx" : s.post_url;
    this.currPageIndex = 0;
    this.totalCount = 0;
}

Pager.prototype.GetStatus = function (current_page) {
    this.currPageIndex = current_page;
    var minSize = 2;
    var maxSize = 5;
    this.status = [];
    if (current_page <= minSize) {//如果当前页小于6页
        this.status.push(["start", 1]); //从1开始
        if (this.page_count < maxSize) {
            this.status.push(["end", this.page_count]);
        }
        else {
            this.status.push(["end", maxSize]);
        }

    }
    else if (current_page > minSize && current_page <= (this.page_count - minSize)) {
        this.status.push(["start", current_page - minSize]);
        this.status.push(["end", current_page + minSize]);
    } else if (current_page > minSize && current_page <= (maxSize + minSize)) {
        this.status.push(["start", current_page - minSize]);
        this.status.push(["end", this.page_count]);
    } else {
        if (this.page_count - maxSize > 0) {
            this.status.push(["start", this.page_count - maxSize]);
        }
        else {
            this.status.push(["start", 1])
        }
        this.status.push(["end", this.page_count]);
    }
}


Pager.prototype.Init_status_bar = function (current_page) {
    var obj = this;
    this.GetStatus(current_page); //计算开始值与起始值

    if (this.status) {
        var start_index = this.status[0][1];
        var end_index = this.status[1][1];
        var content = [];
        if (this.page_count > 1) {
            if (current_page > 1) {
                content.push("<span  name=\"Pager1\" style=\"margin-left:5px;\"><a href=\"javascript:void(null);\" >首页</a></span>");
                content.push("<span  name=\"Pager" + (current_page - 1) + "\" style=\"margin-left:5px;\"><a href=\"javascript:void(null);\" >上一页</a></span>");
            } else {
                content.push("<span class=\"current\" >首页</span>");
                content.push("<span class=\"current\">上一页</span>");
            }
        }
        for (var i = start_index; i <= end_index; i++) {
            if (i == current_page) {
                content.push("<span class=\"current\" name=\"Pager" + i + "\" style=\"margin-left:2px;\" >" + i + "</span>");
            }
            else {
                content.push("<span name=\"Pager" + i + "\" style=\"margin-left:2px;\" ><a href=\"javascript:void(null);\" >" + i + "</a></span>");
            }
        }
        if (this.page_count > 1) {
            if (current_page < this.page_count) {
                content.push("<span name=\"Pager" + (current_page + 1) + "\" style=\"margin-left:2px;\"><a href=\"javascript:void(null);\" >下一页</a></span>");
                //content.push("<span name=\"Pager" + this.page_count + "\"><a href=\"javascript:void(null);\" >末页</a></span>");
            } else {
                content.push("<span class=\"current\">下一页</span>");
                //content.push("<span class=\"current\">末页</span>");
            }
        }
        $("#" + this.status_bar_id).html(content.join(""));
        $("#" + this.status_bar_id).find("span").each(function () {
            if ($(this).attr("class") != "current") {
                $(this).click(function () {
                    var page_index = parseInt($(this).attr("name").replace("Pager", ""));
                    obj.query_params["Start"] = (page_index - 1) * obj.page_size + 1;

                    obj.LoadData(page_index, obj.query_params);
                });
            }
        });
    }
}
Pager.prototype.LoadData = function (page_index, query_params) {

    if (!this.query_params) {
        this.query_params = query_params;
        this.query_params["page_size"] = this.page_size;
    }
    this.query_params["Start"] = (page_index - 1) * this.page_size + 1;
    this.query_params["Anticache"] = Math.floor(Math.random() * 100);
    var newparams = this.DealParams(this.query_params);
    var obj = this;
    if (query_params["display_style"] == 6 || query_params["display_style"] == 8) {
        $.getJSON(obj.post_url, newparams, function (data) {
            if (data) {
                var total_count = parseInt(data.totalcount);
                //var l_total_count = total_count > 5000 ? 5000 : total_count;
                var l_total_count = total_count;
                var count = parseInt(l_total_count / obj.page_size);
                obj.totalCount = l_total_count;
                obj.page_count = l_total_count % obj.page_size == 0 ? count : count + 1;
                obj.Init_status_bar(page_index);
                obj.Display(data);
            } else {
                $("#" + obj.result_id).html("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_error.gif\" /></div></div>");
                $("#" + obj.status_bar_id).empty();
                obj.OtherFn(0);
            }
        });
    } else {
        $.ajax({
            type: "post",
            url: obj.post_url,
            data: newparams,
            beforeSend: function (XMLHttpRequest) {
                $("#" + obj.result_id).empty().html("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");
                //$("#" + obj.status_bar_id).empty().html("<center style=\"font-size:12px;\"><img src=\"img/loading_icon.gif\" /></center>");
            },
            success: function (data) {
                if (data) {
                    obj.end_time = new Date();
                    var a_data = data.toString().split('※');
                    $("#" + obj.result_id).html(a_data[0]);
                    var total_count = parseInt(a_data[1]);
                    var state_id = null;
                    if (a_data.length > 2) {
                        state_id = a_data[2];
                    }
                    var l_total_count = total_count > 5000 ? 5000 : total_count;
                    var count = parseInt(l_total_count / obj.page_size);
                    obj.page_count = l_total_count % obj.page_size == 0 ? count : count + 1;
                    obj.Init_status_bar(page_index);
                    obj.total_count = total_count;
                    obj.OtherFn(total_count, state_id);
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
                                    obj.TraiTag(doc_id, "Sentiment", "n");
                                    break;
                                case "positive":
                                    obj.TraiTag(doc_id, "Sentiment", "p");
                                    break;
                                case "neutral":
                                    obj.TraiTag(doc_id, "Sentiment", "m");
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                }
                else {
                    $("#" + obj.result_id).html("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_error.gif\" /></div></div>");
                    $("#" + obj.status_bar_id).empty();
                    obj.OtherFn(0);
                }
            }
        });
    }
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

Pager.prototype.Display = function (data) {
    return null;
}

Pager.prototype.TraiTag = function (docid, fieldname, fieldvalue) {
    $.get("Handler/TrainTag.ashx",
        { "docid_list": docid, "field_name": fieldname, "field_value": fieldvalue },
        function (data) {

            if (data == "success") {
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
            } else {
                alert("操作失败");
            }
        }
    )
}