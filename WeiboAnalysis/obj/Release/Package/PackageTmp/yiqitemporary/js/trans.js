// JavaScript Document
function TransRoute(obj, data, item_style, option) {//,linecolor) {
    //this.canvas_obj = obj;
    this.trans_data = data;
    this.parent_obj = $(obj).parent("div");
    /* 获取画布宽度 */
    this.canvas_width = obj.width;
    /* 获取画布高度 */
    this.canvas_height = obj.height;
    /* 定义绘图工具 */
    /*this.ctx = obj == null ? null : obj.getContext("2d");*/
    this.item_width = 120;
    this.item_height = 26;
    this.space_width = 60;
    this.space_point_list = {};
    this.display_num = 5;
    //this.linecolor = linecolor == null ? "black" : linecolor;
    this.option_item_style = option == null ? {} : option;
    this.item_style = item_style == null ? {} : item_style;
}

TransRoute.prototype.Init = function() {
    var whole_width = parseInt(this.canvas_width - this.display_num * this.item_width);
    this.space_width = parseInt(whole_width / (this.display_num - 1));
    var l_space_width = parseInt(this.space_width / 2);
    var space_height = parseInt((this.canvas_height - 20) / 2);
    var count = this.display_num - 1;
    for (var i = 1; i <= count; i++) {
        var key = "point" + i;
        var point_x = i * this.item_width + (i - 1) * this.space_width + l_space_width;
        this.space_point_list[key] = [point_x, space_height];
    }
    for (var i = 0, j = this.trans_data.length; i < j; i++) {
        var time_str = this.trans_data[i][0];
        var site_str = this.trans_data[i][1];
        var site_len = site_str.length;
        var index = 1;
        var compare_y = 36; // parseInt((this.canvas_height - 20) / site_len);
        //var l_middle_y = parseInt(compare_y / 2);
        var l_x = i * (this.item_width + this.space_width);
        for (var k = 0; k < site_len; k++) {
            var l_y = 79 + k * compare_y; //+l_middle_y - parseInt(this.item_height / 2);

            if (index == 1) {
                this.DrawItem(l_x, l_y, true, site_str[k], time_str);
            } else {
                this.DrawItem(l_x, l_y, false, site_str[k]);
            }
            index++;
            /*var point1 = [l_x, l_y + parseInt(this.item_height / 2)];
            var l_point1 = [l_x + this.item_width, l_y + parseInt(this.item_height / 2)];
            if (i > 0) {
            var space_key = "point" + i;
            var point2 = this.space_point_list[space_key];
            this.DrawLine(point1, point2, true);
            }
            var l_num = this.display_num - 1;
            if (this.trans_data.length < l_num) {
            l_num = this.trans_data.length - 1;
            }
            if (i < l_num) {
            var space_key = "point" + (i + 1);
            var point2 = this.space_point_list[space_key];
            this.DrawLine(l_point1, point2);
            }*/
        }
    }
}
/*
TransRoute.prototype.DrawLine = function(point1, point2, tag) {
    var x1 = point1[0];
    var y1 = point1[1];
    var x2 = point2[0];
    var y2 = point2[1];
    var ctx = this.ctx;
    //ctx.strokeStyle = this.linecolor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (tag) {
        ctx.moveTo(x1 - 5, y1);
    } else {
        ctx.moveTo(x1, y1);
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    if (tag) {
        //ctx.fillStyle = this.linecolor;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x1 - 5, y1);
        ctx.lineTo(x1 - 5, y1 - 4);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1 - 5, y1 + 4);
        ctx.lineTo(x1 - 5, y1);
        ctx.fill();
        ctx.closePath();
    }
}*/

TransRoute.prototype.DrawItem = function(x, y, tag, site, timestr) {
    /*var ctx = this.ctx;
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + this.item_width, y);
    ctx.lineTo(x + this.item_width, y + this.item_height);
    ctx.lineTo(x, y + this.item_height);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath()*/
    if (tag) {
        this.DrawXOption(x, y, timestr);
    }
    this.DrawItemCue(x, y, site);
}
TransRoute.prototype.DrawItemCue = function(x, y, data) {
    var div = document.createElement("DIV");
    $(div).css({ "position": "absolute", "margin": "0px", "padding": "0px", "text-align": "center", "font-size": "12px" });
    $(div).css("top", y);
    $(div).css("left", x);
    $(div).css("width", this.item_width);
    $(div).css("height", this.item_height);
    $(div).css("line-height", this.item_height + "px");
    $(div).css(this.item_style);
    div.innerHTML = data;
    this.parent_obj.append($(div));
}

TransRoute.prototype.DrawXOption = function(x, y, data) {
    var div = document.createElement("DIV");
    $(div).css({ "position": "absolute", "margin": "0px", "padding": "0px", "text-align": "center", "font-size": "12px" });
    $(div).css("top", this.canvas_height - 20);
    $(div).css("left", x);
    $(div).css("width", this.item_width);
    $(div).css("height", this.item_height);
    $(div).css("line-height", this.item_height + "px");
    $(div).css(this.option_item_style);
    div.innerHTML = data;
    this.parent_obj.append($(div));
}
TransRoute.prototype.AdjustHeight = function() {

}