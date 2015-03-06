//$(document).ready(function() {    
//    var params = { "InputObj": "keyword", "SelObj": "sel", "ItemList": "term_list" };
//    Inputcue.init(params);
//});	


var _inputcue = new Object;
var Inputcue = _inputcue.prototype = {
    position: 0,
    init_value: null,
    input_obj: null,
    sel_obj: null,
    item_obj: null,
    timemachine: null,
    init: function(params) {
        var input_obj = params["InputObj"];
        this.input_obj = typeof (input_obj) == "object" ? input_obj : $("#" + input_obj);
        var sel_obj = params["SelObj"];
        this.sel_obj = typeof (sel_obj) == "object" ? sel_obj : $("#" + sel_obj);
        var item_obj = params["ItemList"];
        this.item_obj = typeof (item_obj) == "object" ? item_obj : $("#" + item_obj);
        this.bodyClick();
        this.keyDown();
        this.keyUp();
    },
    bodyClick: function() {
        var current = this;
        $("body").click(function(e) {
            var l_name = $(e.target).attr("name");
            if (l_name != "keyword" && l_name != "tdlist")
                $(current.sel_obj).hide();
        });
    },
    keyDown: function() {
        var current = this;
        $(this.input_obj).keydown(function(e) {
            var intkey = -1;
            if (window.event) {
                intkey = event.keyCode;
            }
            else {
                intkey = e.which;
            }
            if (intkey == 38) {
                current.moveObj("up");
            }
            else if (intkey == 40) {
                current.moveObj("down");
            }
        });
    },
    keyUp: function() {
        var current = this;
        $(this.input_obj).keyup(function(e) {
            var intkey = -1;
            if (window.event) {
                intkey = event.keyCode;
            }
            else {
                intkey = e.which;
            }
            if (intkey != 38 && intkey != 40) {
                var val = $.trim($(this).val());
                if (val && current.init_value != val) {
                    clearTimeout(Inputcue.timemachine);
                    Inputcue.timemachine = setTimeout(Inputcue.postCommand, 200);
                }
            }

        });
    },
    postCommand: function() {
        var value = Inputcue.input_obj.val();
        Inputcue.init_value = value;
        Inputcue.position = 0;
        Inputcue.GetCueValue(value);
        $(Inputcue.sel_obj).show();
    },
    moveObj: function(direction) {
        var current = this;
        if ($(current.sel_obj).is(":hidden"))
            $(current.sel_obj).show();
        else {
            var list = $("[pid='wordlist']");
            var len = list.length;
            switch (direction) {
                case "up":
                    if (current.position == 0)
                        current.position = len - 1;
                    else
                        current.position = current.position - 1;
                    current.changeTag(list, current.position);
                    break;
                case "down":
                    if (current.position == len - 1)
                        current.position = 0;
                    else
                        current.position = current.position + 1;
                    current.changeTag(list, current.position);
                    break;
                default:
                    break;
            }
        }
    },
    changeTag: function(list, position) {
        var value;
        $(list).each(function() {
            $(this).css("background", "white");
        });
        if (this.position != 0) {
            $(list[this.position]).css("background", "#3897e8");
            value = $(list[this.position]).children("td").html();
        }
        else
            value = this.init_value;
        $(this.input_obj).val(value);
    },
    GetCueValue: function(value) {
        var current = this;
        $.post("Handler/CueValue.ashx",
		{ "input_str": value },
		function(data) {
		    if (data != null) {
		        if (data["successCode"] == "1") {
		            var Row = data["term_list"];
		            var content = [];
		            var count = 1;
		            for (var item in Row) {
		                content.push("<tr id=\"term_" + count + "\" pid=\"wordlist\"><td name=\"tdlist\">" + Row[item] + "</td></tr>");
		                count++;
		            }
		            $(current.item_obj).empty().html(content.join(""));
		            $(current.item_obj).find("tr").each(function() {
		                $(this).hover(
						    function() {
						        var id = $(this).attr("id").split('_')[1];
						        if (current.position != id)
						            $("#term_" + current.position).css("background", "white");
						        current.position = parseInt(id);
						        $(this).css("background", "#3897e8");
						    },
						    function() {
						        $(this).css("background", "white");
						    }
					    );
		                $(this).click(function() {
		                    var l_value = $(this).children("td").html();
		                    $(current.input_obj).val(l_value);
		                    current.position = 0;
		                    $(current.sel_obj).hide();
		                    current.init_value = l_value;
		                    $(current.input_obj).focus();
		                });
		            });

		        }
		        else {
		            $(current.item_obj).empty();
		            $("#sel").hide();
		        }
		    }
		},
		"json"
		);
    }
}