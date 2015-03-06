$(document).ready(function () {
    $("input[pid='valueList']").css("width", "300px");
    $("#all_data_list").find("tr").hover(
        function () {
            $(this).children("td").css("backgound", "red");
        },
        function () {
            $(this).children("td").css("backgound", "none");
        }
    );
});
var listTable = new Object;
listTable.Input = null;
listTable.TelemplateData = null;
listTable.editor = null;
listTable.contenttag = null;
listTable.Edit = function (obj, act, id, width, url) {
    var tag = obj.firstChild.tagName;
    if (typeof (tag) != "undefined" && tag.toLowerCase() == "input") {
        return;
    }
    var orgValue = $.trim($(obj).html());
    //var width = $(obj).width() + 12;
    var input = document.createElement("INPUT");
    $(input).val(orgValue);
    $(input).css({ "background": "#fbdadc", "border": "1px solid green", "width": width + "px" });
    $(obj).empty().append($(input));
    $(input).focus();
    $(input).blur(function () {
        var val = $(this).val();
        if (val) {
            if (val != orgValue) {
                if (!url) {
                    url = location.href;
                }
                $.post(url,
				    { "act": act, "ajaxString": 1, "val": val, "idList": id },
				    function (data) {
				        if (data.Error == 1) {
				            $(obj).empty().html(orgValue);
				        }
				        if (data.Success == 1) {
				            $(obj).empty().html(val);
				        }
				    },
				    "json"
			    );
                $(obj).empty().html(val);
            }
            else {
                $(obj).empty().html(val);
            }
        }

    });
}
listTable.Remove = function (id, msg, act, url, obj) {
    if (!act) {
        act = "remove";
    }
    if (confirm(msg)) {
        if (!url) {
            url = location.href;
        }
        $.post(url,
            { "act": act, "ajaxString": 1, "idList": id },
            function (data) {
                if (data.Error == "1") {
                    alert("删除失败，原因是：" + data.ErrorStr);
                }
                if (data.Success == "1") {
                    var current_obj = "all_data_list";
                    if (obj) {
                        current_obj = obj;
                    }
                    $("#" + current_obj).find("input[value='" + id + "']").parent("td").parent("tr").remove();
                    //$(current_obj).parent("td").parent("tr").remove();
                    //location.replace(location.href);
                }
            },
            "json"
        );
    }
}


listTable.RemoveAll = function (obj, act, msg, url) {
    if (!act) {
        act = "removeall";
    }
    var idlist = [];
    $("#" + obj).find(":checkbox:checked").each(function () {
        var val = $(this).val();
        idlist.push(val);
    });
    if (idlist.length == 0) {
        alert("请选择要删除的信息！");
        return;
    }
    if (confirm(msg)) {
        if (!url) {
            url = location.href;
        }
        $.post(url,
			{ "act": act, "ajaxString": 1, "idList": idlist.join(",") },
			function (data) {
			    if (data.Error == 1) {
			        alert("删除失败，原因是：" + data.ErrorStr);
			    }
			    if (data.Success == 1) {
			        $("#" + obj).find(":checkbox:checked").parent("td").parent("tr").remove();
			        //location.replace(location.href);
			    }
			},
			"json"
		);
    }
}


listTable.EditStatus = function (obj, id, act, url, tag) {
    var status = $(obj).attr("pid");
    var poststatus = status == "0" ? "1" : "0";
    if (!url) {
        url = location.href;
    }
    var jobname = null;
    var cluserid = null;
    if (tag) {
        jobname = $("#job_name_list").val();
        cluserid = $("#job_cluster_id").val();
    }
    $.post(url,
        { "act": act, "ajaxString": 1, "idList": id, "status": poststatus, "jobname": escape(jobname), "cluserid": cluserid },
        function (data) {
            if (data.Error == "1") {
                alert("失败，原因是：" + data.ErrorStr);
            }
            if (data.Success == "1") {
                $(obj).attr("pid", poststatus);
                $(obj).attr("src", "../images/status_" + poststatus + ".gif");
            }
        },
        "json"
    );
}

listTable.SelectAll = function (obj, sel_obj_id) {
    if ($(obj).attr("checked")) {
        $("#" + sel_obj_id + " :checkbox").attr("checked", "true");
    }
    else {
        $("#" + sel_obj_id + " :checkbox").attr("checked", "");
    }
}

listTable.Add = function (params, back_msg, act, url) {
    alert(params);
    if (this.Check()) {

        if ($(this.Input)) {
            $(this.Input).remove();
        }
        if (!act) {
            act = "Add";
        }
        if (!url) {
            url = location.href;
        }
        var _params = "{\"act\":\"" + act + "\",\"ajaxString\":1,";

        $("*[pid='" + params + "']").each(function () {
            var value = escape($.trim($(this).val()));
            _params = _params + "\"" + $(this).attr("id") + "\":\"" + value + "\",";

        });

        _params = _params.slice(0, _params.length - 1) + "}";
        var JsonStr = $.parseJSON(_params);
        if (listTable.editor) {
            JsonStr[listTable.contenttag] = escape(listTable.editor.getData());
        }
        $.post(url,
		    JsonStr,
		    function (data) {
		        if (data.Error == "1") {
		            alert("lost");
		        }
		        else {
		            //  $("#" + back_msg).empty().html("添加成功！");
		            alert("添加成功！");
		            //location.replace(location.href);
		            //Top.loadPage('keywordSearch.html');
		            $("#sad,#column_edit_frame").hide();
		            ThesaurusList.InitThesaurus();
		        }
		    },
		    "json"
	    );

    }
}

listTable.EditOne = function (params, act, url, disframe) {
    if (this.Check()) {
        if (!act) {
            act = "EditOne";
        }
        if (!url) {
            url = location.href;
        }
        var _params = "{\"act\":\"" + act + "\",\"ajaxString\":1,";

        $("*[pid='" + params + "']").each(function () {
            var value = escape($.trim($(this).val()));
            _params = _params + "\"" + $(this).attr("id") + "\":\"" + value + "\",";
        });
        _params = _params.slice(0, _params.length - 1) + "}";
        var JsonStr = $.parseJSON(_params);
        if (listTable.editor) {
            JsonStr[listTable.contenttag] = escape(listTable.editor.getData());
        }
        $.post(url,
		    JsonStr,
		    function (data) {
		        if (data.Error == "1") {
		            alert("lost");
		        }
		        else if (data.Success == "1") {
		            alert("修改成功！");
		            //Top.loadPage('keywordSearch.html');
		            $("#sad,#column_edit_frame").hide();
		            ThesaurusList.InitThesaurus();
                    //location.replace(location.href);

		            //		            if (disframe) {
		            //		                $("#" + disframe).hide();
		            //		                var editspan = $("a[pid='" + JsonStr["ColumnID"] + "_" + JsonStr["TelemplateID"] + "'][name='template_edit']").siblings("span");
		            //		                $(editspan).empty().html(unescape(JsonStr["TelemplateName"]));
		            //		            } else {
		            //		                location.replace(location.href);
		            //		            }
		        }
		    },
		    "json"
	    );
    }
}

listTable.Rest = function (params, back_msg) {
    $("*[pid='valueList']").each(function () {
        $(this).val("");
    });
    $("#" + back_msg).empty();
}

listTable.InnitAdd = function (tag) {
    $("*[pid='valueList']").each(function () {
        $(this).val("");
    });
    $("#back_msg").empty();
    $("#btn_add").show();
    $("#btn_reset").show();
    $("#btn_edit").hide();
    listTable.ShowEditFrame(tag);
}

listTable.initEdit = function (id, Pk_name, back_msg, act, url, tag) {
    var Linput = document.createElement("INPUT");
    $(Linput).val(id.toString());
    $(Linput).attr("id", Pk_name);
    $(Linput).attr("pid", "valueList");
    $(Linput).css("display", "none");
    $("body").append($(Linput));
    this.Input = Linput;
    if (!act) {
        act = "initEdit";
    }
    if (!url) {
        url = location.href;
        //Top.loadPage('keywordSearch.html');
    }
    listTable.ShowEditFrame(tag);
    $("#btn_add").hide();
    $("#btn_reset").hide();
    $("#btn_edit").show();
    $.post(url,
		{ "act": act, "ajaxString": 1, "idList": id },
		function (data) {
		    if (data.Error == "1") {
		        alert("lost");
		    }
		    if (data.Success == "1") {
		        $("#add_frame").show();
		        $("#BtnSubmit").hide();
		        $("#BtnAdd").hide();
		        $("#BtnEdit").show();
		        for (var item in data) {
		            var value = unescape(data[item]);
		            $("#" + item).val(value);
		        }
		        if (listTable.editor) {
		            listTable.editor.setData(unescape(data[listTable.contenttag]));
		        }
		        $("#" + back_msg).empty();
		        listTable.Display(data);
		    }
		},
		"json"
	);
}

listTable.PublishArticle = function (id, act) {
    var audit = $("#Audit_" + id).attr("pid");
    if (!audit || audit == "0") {
        alert("文章还没有审核，不能生成！");
        return;
    }
    var tag = $("#Relese_" + id).attr("pid");
    if (tag == "1") {
        if (!confirm("您确定要重新生成么？")) {
            return;
        }
    }
    if (!act) {
        url = "../Handler/Publish.ashx";
    } else {
        url = "../Handler/" + act + ".ashx";
    }

    var div = document.createElement("DIV");
    $(div).addClass("layerdiv")
    $(div).css({ "position": "absolute", "left": "40%", "top": "45%",
        "width": "300px", "display": "block"
    });
    var content = [];
    content.push("<span class=\"layer_line\"></span><div class=\"layer_outer\" style=\"background:white;\">");
    content.push("<span class=\"layer_top_L\"></span><span class=\"layer_top_R\"></span>");
    content.push("<div class=\"layer_inner\">");
    content.push("<a class=\"btn_close\" href=\"javascript:void(null);\" id=\"close_window\"></a>");
    content.push("<div class=\"clear\"></div>");
    content.push("<div class=\"layer_C\">");
    content.push("<table cellspacing=\"0\" cellpadding=\"0\" class=\"form_list\"><tbody>")
    content.push("<tr><td class=\"form_name\" >请选择模板：</td>");
    content.push("<td class=\"form_field\">");
    content.push("<select id=\"Telemplate_list\">");
    var l_data = listTable.TelemplateData;
    for (var item in l_data) {
        var row = l_data[item];
        content.push("<option value=\"" + row["Path"] + "\">" + unescape(row["Name"]) + "</option>");
    }
    content.push("</select></td></tr>");
    content.push("<tr><td class=\"form_name\" >&nbsp;</td>");
    content.push("<td class=\"form_field\" align=\"right\">");
    content.push("<input type=\"button\" id=\"BtnPublish\" value=\"确定\" />");
    content.push("</td></tr>");
    content.push("</tbody></table></div>");
    content.push("</div><span class=\"layer_bottom_L\"></span>");
    content.push("<span class=\"layer_bottom_R\"></span></div><span class=\"layer_line\"></span>");
    $(div).html(content.join(""));
    $("body").append($(div));
    $("#close_window").click(function () {
        $(div).remove();
    });

    $("#BtnPublish").click(function () {
        var path = $("#Telemplate_list").val();
        $.post(url,
            { "act": act, "id": id, "Telemplatepath": path },
            function (data) {
                if (data.ErrorCode == "1") {
                    alert("失败");
                }
                if (data.SucceseCode == "1") {
                    $(div).remove();
                    $.post(location.href,
		                { "act": "UpdateRelese", "ajaxString": 1, "idList": id, "publishpath": data["path"] },
		                function (data) {
		                    if (data.Success == "1") {
		                        alert("生成成功");
		                        $("#Relese_" + id).attr("pid", "1");
		                        $("#Relese_" + id).attr("src", "../images/status_1.gif");
		                    }
		                },
		                "json"
	                );
                }
            },
            "json"
        );
    });
}

listTable.PublishColumn = function (id, act, path) {
    if (!act) {
        url = "../Handler/Publish.ashx";
    } else {
        url = "../Handler/" + act + ".ashx";
    }
    $.post(url,
        { "act": act, "id": id, "Telemplatepath": path },
        function (data) {
            if (data.ErrorCode == "1") {
                alert("失败，失败原因：" + data["Reason"]);
            }
            if (data.SucceseCode == "1") {
                $.post(location.href,
	                { "act": "UpdateRelese", "ajaxString": 1, "idList": id, "publishpath": data["path"] },
	                function (data) {
	                    if (data.Success == "1") {
	                        alert("生成成功！");
	                    }
	                },
	                "json"
                );
            }
        },
        "json"
    );
}

listTable.innitViewFn = function () {
    $("#close_view").click(function () {
        $("#view_iframe").hide();
    });

    $("#Btn_SaveDoc").click(function () {
        var path = $("#pushlish_path").html();
        var htmlStr = listTable.editor.getData();
        //alert(htmlStr);
    });
}

listTable.Display = function (data) {
    return null;
}
listTable.Check = function () {
    return true;
}


listTable.ShowEditFrame = function (tag) {
    //    var iframe_width = $(document).width();
    //    var l_width = parseInt($("#column_edit_frame").width()) / 2;
    //    iframe_width = parseInt(iframe_width / 2) - l_width;
    //    $("#column_edit_frame").css({ "position": "absolute", "top": "0px", "left": iframe_width + "px", "background": "#f9f5f5" });
    //    $("#column_edit_frame").show();
    //    var div_move = new divMove("move_column", "column_edit_frame");
    //    div_move.init();
    //    $("#close_edit_frame").click(function() {
    //        $("#column_edit_frame").hide();
    //        if (!tag) {
    //            location.replace(location.href);
    //        }
    //    })
   
    Common.ShowEditFrame("sad", "move_column", "column_edit_frame", "close_edit_frame");
}

listTable.ShowFrame = function (child_div, parent_div, close_btn, tag) {
    $("#" + parent_div).show();
    var iframe_width = $(document).width();
    var l_width = parseInt($("#" + parent_div).width()) / 2;
    iframe_width = parseInt(iframe_width / 2) - l_width;
    //$("#" + parent_div).css({ "position": "absolute", "top": "50px", "left": iframe_width + "px", "background": "#f9f5f5" });
    $("#" + parent_div).css({ "position": "absolute", "top": "0px", "left": iframe_width + "px" });
    $("#" + parent_div).show();
    $("#" + close_btn).click(function () {
        if (tag) {
            location.replace(location.href);
        } else {
            $("#" + parent_div).hide();
            listTable.closeFn();
        }
    });
    var div_move = new divMove(child_div, parent_div);
    div_move.init();
}
listTable.closeFn = function () {
    return null;
}

listTable.chooseAll = function (obj, l_obj) {
    var type = $("#" + obj).attr("name");
    if (type == "0") {
        $("#" + l_obj).find(":checkbox").attr("checked", "checked");
        $("#" + obj).attr("name", "1");
    } else {
        $("#" + l_obj).find(":checkbox").removeAttr("checked");
        $("#" + obj).attr("name", "0");
    }
}

listTable.UpLoadFile = function (file_obj, dis_obj, url, tag) {
    var path = $("#" + file_obj).val();
    if (!path) {
        alert("请选择上传图片");
        return;
    }
    var post_url = null;
    if (!url) {
        post_url = "FileLoad.ashx";
    } else {
        post_url = url;
    }
    function clearmsg() {
        $("#" + dis_obj).empty();
    }
    $.ajaxFileUpload({
        url: "../Handler/" + post_url,
        secureuri: false,
        fileElementId: file_obj,
        dataType: 'json',
        OtherData: null,
        success: function (data, status) {
            if (data.Error == "1") {
                alert("上传失败！");
            }
            if (data.Success == "1") {
                if (!tag) {
                    $("#" + dis_obj).val(unescape(data["path"]));
                } else {
                    $("#" + dis_obj).empty().html("上传成功！");
                    setTimeout(clearmsg, 500);
                }
            }
        }
    });

}

