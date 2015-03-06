// JavaScript Document
var _control = new Object;
var Control = _control.prototype = {
    option: {},
    showoption: { "speed": 20, "creasewidth": 20, "creaseheight": 20 },
    divstyleoption: { "border": "6px solid #e8f6fd", "background": "white", "z-index": 9999,
        "width": 300, "height": 400
    },
    ControlObj: null,
    item_id_count: 1,
    Init: function(obj, l_type, fn) {
        var item_id = obj.id;
        if (!item_id) {
            item_id = "control_item_" + Control.item_id_count;
            obj.id = item_id;
            Control.item_id_count++;
        }
        if (!this.option[item_id]) {
            this.option[item_id] = {
                showsetintervalOption: { "width": 0, "height": 0 },
                objstyle: {},
                showsetinterval: null,
                _obj: obj,
                frame_div: null,
                type: l_type
            }
        }

        this.CreateFrame(item_id);
    },
    CreateFrame: function(item_id) {
        //alert(item_id);
        var obj_option = this.option[item_id];
        var obj = obj_option["_obj"];
        var body_offsetLeft = document.body.offsetLeft;
        var body_offsetTop = document.body.offsetTop;
        var offset_left = $(obj).offset().left;
        var offset_Top = $(obj).offset().top;
        var obj_height = obj.clientHeight;
        if (!obj_option.frame_div) {
            var Div = document.createElement("DIV");
            var css_data = {};
            css_data["position"] = "absolute";
            css_data["top"] = body_offsetTop + offset_Top + obj_height + 4 + "px";
            css_data["left"] = offset_left + body_offsetLeft + "px";
            css_data["display"] = "none";
            css_data["overflow"] = "scroll";
            $(Div).css(css_data);
            Div.id = "control_contain_" + Control.item_id_count;
            var div_option = this.divstyleoption;
            for (var item in div_option) {
                $(Div).css(item, div_option[item]);
            }
            document.body.appendChild(Div);
            obj_option.frame_div = Div;
            Control.AnimateDisplay(Control.divstyleoption["width"], Control.divstyleoption["height"], obj_option);
            Control.InitBodyClickFn(item_id);
        } else {
            var css_data = {};
            css_data["top"] = body_offsetTop + offset_Top + obj_height + 4 + "px";
            css_data["left"] = offset_left + body_offsetLeft + "px";
            $(obj_option.frame_div).css(css_data);
            $(obj_option.frame_div).show(200);
        }
    },
    InitBodyClickFn: function(item_id) {
        $(document).click(function(e) {
            if ($(e.target).attr("id") != item_id) {
                var obj_div = Control.option[item_id].frame_div;
                var offset = $(obj_div).offset();
                var start_left = parseInt(offset.left);
                var end_left = start_left + parseInt(Control.divstyleoption["width"]);
                var start_top = parseInt(offset.top);
                var end_top = start_top + parseInt(Control.divstyleoption["height"]);
                var l_x = e.pageX;
                var l_y = e.pageY;
                if (l_x >= start_left && l_x <= end_left && l_y >= start_top && l_y <= end_top) {
                    return;
                } else {
                    $(obj_div).hide(200);
                }
            }
        });
    },
    AnimateDisplay: function(width, height, obj_option) {
        obj_option.frame_div.style.display = "block";
        obj_option.objstyle["width"] = width;
        obj_option.objstyle["height"] = height;
        obj_option.showsetinterval = window.setInterval(function() {
            Control.SetInterValFn(obj_option);
        }, Control.showoption.speed);
    },
    SetInterValFn: function(obj_option) {
        var width = obj_option.showsetintervalOption["width"] + Control.showoption["creasewidth"];
        var height = obj_option.showsetintervalOption["height"] + Control.showoption["creaseheight"];
        var width_span = width - obj_option.objstyle["width"];
        var height_span = height - obj_option.objstyle["height"];
        if (width_span > 0) {
            width = obj_option.objstyle["width"];
        }
        if (height_span > 0) {
            height = obj_option.objstyle["height"];
        }
        obj_option.frame_div.style.width = width + "px";
        obj_option.frame_div.style.height = height + "px";
        obj_option.showsetintervalOption["width"] = width;
        obj_option.showsetintervalOption["height"] = height;
        if (width_span > 0 && height_span > 0) {
            Control.InitInnerHTML(obj_option);
            clearInterval(obj_option.showsetinterval);
        }
    },
    InitInnerHTML: function(obj_option) {
        var type = obj_option.type;
        var _control = null;
        switch (type) {
            case 1:
                _control = new TimeControl(obj_option.frame_div, obj_option._obj);
                _control.Init();
                break;
            case 2:
                _control = new TreeControl(obj_option.frame_div, obj_option._obj);
                _control.initForm();
                break;
            default:
                break;
        }
        Control.ControlObj = _control;
    },
    GetTimeStr: function(type) {
        var date_time = new Date();
        switch (type) {
            case 1:
                return date_time.getDate();
            case 2:
                return date_time.getMonth() + 1;
            default:
                return date_time.getDate();
        }
    },
    IsNull: function(data) {
        var tag = false;
        for (var item in data) {
            tag = true;
            break;
        }
        return tag;
    },
    zTreeNode: null,
    zTreeOnDblclick: function(event, treeId, treeNode) {
        if (treeNode == null) {
            alert(' -- zTree -- ');
        } else {
            var category_id = treeNode.categoryid;
            var child_nodes = treeNode.nodes;
            var name = treeNode.name;
            $(Control.ControlObj.inputobj).val(name);
            $(Control.ControlObj.inputobj).attr("pid", category_id);
            if (!child_nodes || child_nodes.length == 0) {
                $(Control.ControlObj.inputobj).attr("cate", 0);
            } else {
                $(Control.ControlObj.inputobj).attr("cate", 1);
            }
            Control.zTreeNode = treeNode;
        }
    },
    BtnSubmitClick: function(nodes, contain_frame) {
        return null;
    }
}


function TimeControl(contain_obj,input_obj){
    this.containobj = contain_obj;    
	this.inputobj = input_obj;
	this.contain_ul = null;
	this.month_select = null;
	this.year_select = null;
}
TimeControl.prototype = {
    Init: function() {
        var ul = document.createElement("UL");
        ul.style.margin = "0px";
        ul.style.padding = "0px";
        this.GetHeadHTML(ul);
        this.GetItemListHTML(ul);
        this.contain_ul = ul;
        this.containobj.appendChild(ul);
    },
    GetHeadHTML: function(ul) {
        var month_li = document.createElement("LI");
        month_li.style.lineHeight = "20px";
        month_li.style.height = "20px";
        month_li.style.listStyle = "none";
        month_li.style.width = (Control.divstyleoption["width"] - 20) + "px";
       
        month_li.appendChild(this.GetCloseHtml());
        ul.appendChild(month_li);
    },
    GetItemListHTML: function(ul) {
        var current_obj = this;
        $.post("trend.aspx",
            { "act": "initcategory", "ajaxString": 1 },
            function(data) {
                if (data.SuccessCode == 1) {
                    delete data.SuccessCode;
                    for (var item in data) {
                        current_obj.InitItemHtml(ul, data[item]);

                    }
                    //current_obj.InitCategoryHtml(data, item_li, input_contain);
                }
            },
            "json"
        );

    },
    GetCloseHtml: function() {
        var contain_frame = this.containobj;
        var close_span = document.createElement("SPAN");
        var css_data = {};
        css_data["cursor"] = "pointer";
        css_data["font-size"] = "12px";
        css_data["float"] = "right";
        $(close_span).css(css_data);
        close_span.innerHTML = "¹Ø±Õ";
        close_span.onclick = function() {
            contain_frame.style.display = "none";
        }
        return close_span;
    },
    InitItemHtml: function(parent_obj, data) {
        var current_obj = this;
        var input_contain = this.inputobj;
        current_obj.InitCategoryHtml(data, parent_obj, input_contain);
    },
    InitCategoryHtml: function(entity, parent_obj, input_contain, tag) {
        var current_obj = this;
        var item_li = document.createElement("LI");
        item_li.style.height = "auto";
        item_li.style.listStyle = "none";
        //item_li.style.width = "200px";
        item_li.style.overflow = "hidden";
        if (tag) {
            item_li.style.cssFloat = "left";
        }
        var item_span = document.createElement("SPAN");
        item_span.style.cursor = "pointer";
        item_span.style.padding = "5px";
        item_span.style.lineHeight = "20px";
        item_span.style.fontSize = "12px";
        item_span.innerHTML = unescape(entity["categoryname"]);

        item_span.onclick = function() {
            var val = this.innerHTML;
            input_contain.value = val;
            var nodes = $(current_obj.containobj).find("span");
            for (var i = 0, j = nodes.length; i < j; i++) {
                nodes[i].style.backgroundColor = "white";
            }
            this.style.backgroundColor = "blue";
        }
        item_span.onmouseover = function() {
            var back_ground = this.style.backgroundColor;
            if (back_ground != "blue") {
                this.style.backgroundColor = "gray";
            }
        }
        item_span.onmouseout = function() {
            var back_ground = this.style.backgroundColor;
            if (back_ground != "blue") {
                this.style.backgroundColor = "white";
            }
        }
        item_li.appendChild(item_span);
        parent_obj.appendChild(item_li);
        var childlist = entity["childlist"];
        delete childlist.SuccessCode;
        if (Control.IsNull(childlist)) {
            var l_div = document.createElement("DIV");
            l_div.style.clear = "both";
            var l_ol = document.createElement("OL");
            l_ol.style.marginLeft = "15px";
            item_li.appendChild(l_div);
            item_li.appendChild(l_ol);
            for (var item in childlist) {
                this.InitCategoryHtml(childlist[item], l_ol, input_contain, true);
            }
        }
    },
    GetHeadMonthSelect: function() {
        var current_month = parseInt(Control.GetTimeStr(2));
        var content = [];
        var l_month_select = document.createElement("SELECT");
        for (var i = 1; i < 13; i++) {
            content.push("<option value=\"" + i + "\"");
            if (i == current_month) {
                content.push(" selected=\"selected\" ");
            }
            content.push(">" + i + "</option>");
        }
        l_month_select.innerHTML = content.join("");
        this.month_select = l_month_select;
        return l_month_select;
    }
}


function TreeControl(contain_obj, input_obj) {
    this.containobj = contain_obj;
    this.inputobj = input_obj;
}

TreeControl.prototype = {
    zTree1: null,
    leafNode: [],
    setting: {
        async: true,
        expandSpeed: "fast",
        checkable: true,
        callback: {
            click: Control.zTreeOnDblclick
        }
    },
    initForm: function() {
        $(this.containobj).attr("class", "zTreeDemoBackground");
        var ul = document.createElement("UL");
        ul.style.margin = "0px";
        ul.style.padding = "0px";
        $(ul).attr("class", "tree");
        this.GetHeadHTML(ul);
        this.GetItemListHTML(ul);
        this.contain_ul = ul;
        this.containobj.appendChild(ul);
        //this.refreshTree();
    },
    GetHeadHTML: function() {
        var ul = document.createElement("UL");
        ul.style.margin = "0px";
        ul.style.padding = "0px";
        var month_li = document.createElement("LI");
        month_li.style.lineHeight = "20px";
        month_li.style.height = "20px";
        month_li.style.listStyle = "none";
        month_li.style.width = (Control.divstyleoption["width"] - 20) + "px";
        $(month_li).css("text-align", "right");
        month_li.appendChild(this.GetCloseHtml());
        ul.appendChild(month_li);
        this.containobj.appendChild(ul);
    },
    GetItemListHTML: function(ul) {
        this.refreshTree(ul);
    },
    GetCloseHtml: function() {
        var current_obj = this;
        var contain_frame = this.containobj;
        var close_span = document.createElement("SPAN");
        close_span.style.cursor = "pointer";
        close_span.style.fontSize = "12px";
        close_span.style.cssFloat = "right";
        close_span.innerHTML = "È·¶¨";
        close_span.onclick = function() {
            var nodes = current_obj.zTree1.getCheckedNodes(true);
            if (nodes) {
                Control.BtnSubmitClick(nodes,contain_frame);
            }            
        }
        return close_span;
    },
    getCheckBoxType: function() {
        var py = "p";
        var sy = "s";
        var pn = "p";
        var sn = "s";

        var type = { "Y": py + sy, "N": pn + sn };
        return type;
    },
    refreshTree: function(l_obj) {
        var obj = this;
        var checkType = obj.getCheckBoxType();
        obj.setting["checkType"] = checkType;
        obj.setting["asyncUrl"] = obj.getAsyncUrl();
        obj.zTree1 = $(l_obj).zTree(obj.setting);

        //getCheckedNodesLength();
    },
    getAsyncUrl: function() {
        var url = "Handler/GetUserTree.ashx";
        return url;
    },
    getcolumnid: function(treeNode) {
        var nodes = treeNode.nodes;
        if (nodes.length > 0) {
            for (var i = 0, j = nodes.length; i < j; i++) {
                var child_nodes = nodes[i];
                this.getcolumnid(child_nodes);
            }
        } else {
            var id = treeNode.id;
            this.leafNode.push(id);
        }
    }
}
