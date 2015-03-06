// JavaScript Document
function SqlPager(s) {
    this.start = 1;
    this.page_size = s.page_size == null ? 10 : s.page_size;
    this.status_bar_id = s.status_bar_id;
    this.result_id = s.result_id;
    this.info_id = s.info_id;
    this.web_url = s.web_url;
    this.page_count = 20;
    this.status = [];
    this.query_params = null;
    this.total_count = 0;
    this.Start_time = new Date();
    this.end_time = null;
    this.sql_tag = s.sql_tag;
    this.load_img = ((s.load_img && s.load_img != "") ? s.load_img : "img/load_big.gif");
}

SqlPager.prototype.Init_status_bar = function(current_page) {
    var obj = this;
    if (this.status) {
        var content = [];

        if (this.page_count > 1) {
            if (current_page == 1) {
                //content.push("<span class=\"current\">首页</span>");
                content.push("<span>上页</span>");
            }
            else {
                // content.push("<span  name=\"Pager1\"><a href=\"javascript:void(null);\" >首页</a></span>");
                content.push("<span name=\"Pager" + (current_page - 1) + "\"><a href=\"javascript:void(null);\" >上页</a></span>");
            }
        }
        if (this.page_count > 1) {
            if (current_page == this.page_count) {
                content.push("<span>下页</span>");
            }
            else {
                content.push("<span name=\"Pager" + (current_page + 1) + "\"><a href=\"javascript:void(null);\" >下页</a></span>");
            }
        }
        $("#" + this.status_bar_id).empty().html(content.join(""));

        $("#" + this.status_bar_id).find("span[name^='Pager']").click(function() {
            var page_index = parseInt($(this).attr("name").replace("Pager", ""));
            obj.query_params["Start"] = (page_index - 1) * obj.page_size + 1;
            obj.LoadData(page_index, obj.query_params);
        });
        $("#btn_look_skip_" + obj.sql_tag).click(function() {
            var num = $.trim($("#l_look_pager_" + obj.sql_tag).val());
            if (!num) {
                alert("请输入您要搜索的页数");
                return;
            }
            var page_index = parseInt(num);
            if (page_index <= 0) {
                alert("请输入大于0的整数");
                return;
            } else if (page_index > obj.page_count) {
                alert("您输入的页数超过总页数");
                return;
            }
            obj.query_params["Start"] = (page_index - 1) * obj.page_size + 1;
            obj.LoadData(page_index, obj.query_params);
        });
    }
}
SqlPager.prototype.LoadData = function(page_index, query_params) {
    if (!this.query_params) {
        this.query_params = query_params;
        this.query_params["page_size"] = this.page_size;
    }
    this.query_params["Start"] = page_index;
    var newparams = this.DealParams(this.query_params);
    var obj = this;
    $.ajax({
        type: "post",
        url: obj.web_url,
        data: newparams,
        beforeSend: function(XMLHttpRequest) {
            $("#" + obj.result_id).empty().html("<div class=\"load_out\"><div class=\"load_in\"><img src=\"" + obj.load_img + "\" /></div></div>");
            //$("#" + obj.info_id).empty().html("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr><td align=\"center\" class=\"loading_text\" colapan=\"200\"><img src=\"img/loading_icon.gif\" /></td></tr></table>");
        },
        dataType: "json",
        success: function(data) {
            if (data) {
                var total_count = parseInt(data["Count"]);
                var count = parseInt(total_count / obj.page_size);
                obj.page_count = total_count % obj.page_size == 0 ? count : count + 1;
                $("#" + obj.info_id).empty().html("<b class=\"color_2\">" + page_index + "</b>/<b>" + obj.page_count + "</b>");
                // $("#" + obj.info_id).empty().html("共<b class=\"color_2\">" + total_count + "</b>条记录，当前第<b class=\"color_2\">" + page_index + "</b>/<b>" + obj.page_count + "</b>页");
                obj.Init_status_bar(page_index);
                obj.Display(obj.result_id, data);
            }
            else {
                $("#" + obj.result_id).html("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_error.gif\" /></div></div>");
                $("#" + obj.status_bar_id).empty();
                $("#" + obj.info_id).empty();
                obj.OtherDisplay();
            }
        }
    });
}
SqlPager.prototype.DealParams = function(params) {
    var new_params = {};
    for (var item in params) {
        var l_item = item.toLowerCase();
        new_params[l_item] = params[item];
    }
    return new_params;
}

SqlPager.prototype.Display = function(data) {
    return null;
}

SqlPager.prototype.OtherDisplay = function() {
    return;
}