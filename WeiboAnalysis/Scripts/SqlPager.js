// JavaScript Document
function SqlPager(s) {
    this.start = 1;
    this.page_size = s.page_size == null ? 10 : s.page_size;
    this.status_bar_id = s.status_bar_id;
    this.result_id = s.result_id;
    this.page_count = 20;
    this.status = [];
    this.query_params = null;
    this.web_url = !s.web_url || s.web_url == "" ? "Handler/SqlSearch.ashx" : s.web_url;
    this.total_count = 0;
    this.Start_time = new Date();
    this.end_time = null;
    this.currPageIndex = 0;
    this.totalCount = 0;
    this.pagelist = false;
}

SqlPager.prototype.GetStatus = function (current_page) {
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

SqlPager.prototype.Init_status_bar = function (current_page) {
    var obj = this;
    this.GetStatus(current_page);

    if (this.status) {
        var start_index = this.status[0][1];
        var end_index = this.status[1][1];
        var content = [];

        if (this.page_count > 1) {
            if (current_page == 1) {
                content.push("<span class=\"current\" name=\"Pager1\">首页</span>");
                content.push("<span class=\"current\" name=\"Pager1\">上一页</span>");
            }
            else {
                content.push("<span  name=\"Pager1\"><a href=\"javascript:void(null);\" >首页</a></span>");
                content.push("<span  name=\"Pager" + (current_page - 1) + "\" style=\"margin-left:5px;\"><a href=\"javascript:void(null);\" >上一页</a></span>");
            }
        }
        for (var i = start_index; i <= end_index; i++) {
            if (i == current_page) {
                content.push("<span class=\"current\" name=\"Pager" + i + "\">" + i + "</span>");
            }
            else {
                content.push("<span name=\"Pager" + i + "\"><a href=\"javascript:void(null);\" >" + i + "</a></span>");
            }
        }
        if (this.page_count > 1) {
            if (current_page == this.page_count) {
                content.push("<span class=\"current\" name=\"Pager\">下一页</span>");
                content.push("<span class=\"current\" name=\"Pager" + this.page_count + "\">末页</span>");
            }
            else {
                content.push("<span name=\"Pager" + (current_page + 1) + "\" style=\"margin-left:2px;\"><a href=\"javascript:void(null);\" >下一页</a></span>");
                content.push("<span name=\"Pager" + this.page_count + "\"><a href=\"javascript:void(null);\" >末页</a></span>");
            }
        }

        if (obj.pagelist) {
            content.push(" <select name='pagesel' style='width:68px;height:21px;font-size:13pt' ><option value='10'>10条</option><option value='30'>30条</option><option value='50'>50条</option><option value='75'>75条</option><option value='100'>100条</option><option value='200'>200条</option></select>");
        }

        $("#" + this.status_bar_id).html(content.join(""));
        $("#" + this.status_bar_id).find("select[name='pagesel']").val(obj.page_size);
        $("#" + this.status_bar_id).find("select[name='pagesel']").undelegate("onchange").change(function () {
            obj.SetPageSize(this.value);
        });


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
SqlPager.prototype.SetPageSize = function (page_size) {
    var obj = this;
    this.page_size = page_size;
    this.query_params["page_size"] = page_size;
    obj.LoadData(1, obj.query_params);
}

SqlPager.prototype.LoadData = function (page_index, query_params) {
    if (!this.query_params) {
        this.query_params = query_params;
        this.query_params["page_size"] = this.page_size;
    }
    this.query_params["Start"] = page_index;
    this.query_params["Anticache"] = Math.floor(Math.random() * 100);
    var newparams = this.DealParams(this.query_params);
    var obj = this;

    $.ajax({
        type: "post",
        url: obj.web_url,
        data: newparams,
        dataType: "json",
        beforeSend: function (XMLHttpRequest) {
            $("#" + obj.result_id).empty().html("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_big.gif\" /></div></div>");
            //$("#" + obj.status_bar_id).empty().html("<center><img src=\"img/loading_icon.gif\" /></center>");
        },
        success: function (data) {
            if (data) {
                var total_count = parseInt(data["Count"]);
                var l_total_count = total_count;// total_count > 5000 ? 5000 : total_count;
                var count = parseInt(l_total_count / obj.page_size);
                obj.page_count = l_total_count % obj.page_size == 0 ? count : count + 1;
                obj.Init_status_bar(page_index);
                obj.currPageIndex = page_index;
                obj.total_count = l_total_count;
                obj.totalCount = l_total_count;
                delete data["Count"];
                obj.OtherFn(obj.result_id, data);
                obj.Display(data);
            }
            else {
                $("#" + obj.result_id).html("<div class=\"load_out\"><div class=\"load_in\"><img src=\"img/load_error.gif\" /></div></div>");
                $("#" + obj.status_bar_id).empty();
                obj.OtherFn(0);
            }
        }
    });
}
SqlPager.prototype.DealParams = function (params) {
    var new_params = {};
    for (var item in params) {
        var l_item = item.toLowerCase();
        new_params[l_item] = params[item];
    }
    return new_params;
}
SqlPager.prototype.Display = function (data) {
    return null;
}
SqlPager.prototype.OtherFn = function (obj, data) {
    return "dsaas";
}