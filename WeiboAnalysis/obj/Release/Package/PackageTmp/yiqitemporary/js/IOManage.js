$(document).ready(function() {
    Default.Init();
    Default.InitClick();
});
var _default = new Object;
var Default = _default.property = {
    PostUrl: location.href,
    RootPath: null,
    InitClick: function() {
        $("#look_back").click(function() {
            var basepath = $("#file_path").html();
            if (basepath == Default.RootPath) {
                alert("已是根目录！");
                return;
            }
            var index = basepath.lastIndexOf("\\");
            var path = basepath.slice(0, index);
            Default.GetFolderList(path);
            Default.GetFileList(path);
        });
        $("#file_path").click(function() {
            var len = $(this).find("input").length;
            if (len == 0) {
                var val = $(this).html();
                var input = document.createElement("INPUT");
                $(input).val(val);
                $(input).css("width", "300px");
                $(this).empty().html($(input));
                $(input).focus();
                $(input).blur(function() {
                    var path_val = $(this).val();
                    $("#file_path").empty().html(path_val);
                    Default.GetFolderList(path_val);
                    Default.GetFileList(path_val);
                });
            }
        });

        $("#upload_file").click(function() {
            var file_name = $("#file_name").val();
            if (!file_name) {
                alert("请选择上传文件！");
                return;
            }
            var url = Default.GetPostUrl();
            $.ajaxFileUpload({
                url: url,
                secureuri: false,
                fileElementId: "file_name",
                dataType: 'json',
                OtherData: null,
                success: function(data, status) {
                    if (data.Error == "1") {
                        alert("上传失败！");
                    }
                    if (data.Success == "1") {
                        var file_content = [];
                        var dis_path = $("#file_path").html() + "\\" + file_name;
                        file_content.push("<li>" + file_name + "&nbsp;&nbsp;");
                        file_content.push("<a name=\"remove_folder\" href=\"javascript:void(null);\" pid=\"" + escape(dis_path) + "\">");
                        file_content.push("删除</a>&nbsp;&nbsp;");
                        file_content.push("<a  href=\"" + dis_path + "\" target=\"_blank\" >下载</a>&nbsp;&nbsp;");
                        file_content.push("</li>");
                        $("#file_list").append(file_content.join(""));
                        Default.InitClickFn("file_list");
                    }
                }
            });
        });

        $("#create_folder").click(function() {
            var li = document.createElement("LI");
            var input = document.createElement("INPUT");
            $(li).append(input);
            $("#folder_list").append(li);
            $(input).focus();
            $(input).blur(function() {
                var folder_name = $(this).val();
                if (!folder_name) {
                    $(li).remove();
                    return;
                }
                var path = $("#file_path").html() + "\\" + folder_name;
                $.post(Default.PostUrl,
                    { "action": "createfolder", "AjaxString": 1, "path": escape(path) },
                    function(data) {
                        if (data.Success == 1) {
                            var li_content = [];
                            li_content.push("<a name=\"look_folder\" href=\"javascript:void(null);\" pid=\"" + escape(path) + "\">");
                            li_content.push(folder_name + "</a>&nbsp;&nbsp;");
                            li_content.push("<a name=\"remove_folder\" href=\"javascript:void(null);\" pid=\"" + escape(path) + "\">");
                            li_content.push("删除</a>&nbsp;&nbsp;");
                            $(li).empty().html(li_content.join(""));
                            Default.InitClickFn("folder_list");
                        } else {
                            alert(data.Error);
                        }
                    },
                    "json"
                );
            });
        });
    },
    Init: function() {
        $.post(Default.PostUrl,
            { "action": "getroot", "AjaxString": 1 },
            function(data) {
                if (data) {
                    Default.RootPath = unescape(data["path"]);
                    Default.GetFolderList(unescape(data["path"]));
                    Default.GetFileList(unescape(data["path"]));
                }
            },
            "json"
        );
    },
    GetFolderList: function(path) {
        var params = { "action": "getfolderlist" };
        if (path) {
            params["path"] = escape(path);
        } else {
            delete params["path"];
        }
        Default.PostCommand(params);
    },
    GetFileList: function(path) {
        var params = { "action": "getfilelist" };
        if (path) {
            params["path"] = escape(path);
        } else {
            delete params["path"];
        }
        Default.PostCommand(params);
    },
    PostCommand: function(params) {
        params["AjaxString"] = "1";
        $.post(Default.PostUrl,
            params,
            function(data) {
                if (data) {
                    if (data.Success == 1) {
                        delete data.Success;
                        if (params["action"] == "getfolderlist") {
                            Default.DealFolderData(data);
                        } else if (params["action"] == "getfilelist") {
                            Default.DealFileData(data);
                        }
                    } else {
                        alert("对不起，操作失败！错误原因：" + data.Error);
                    }
                } else {
                    if (params["action"] == "getfolderlist") {
                        $("#folder_list").empty();
                    } else if (params["action"] == "getfilelist") {
                        $("#file_list").empty();
                    }
                }
                if (params["path"]) {
                    $("#file_path").empty().html(unescape(params["path"]));
                } else {
                    $("#file_path").empty().html(Default.RootPath);
                }
            },
            "json"
        );
    },
    DealFileData: function(data) {
        var content = [];
        for (var item in data) {
            var entity = data[item];
            content.push("<li>" + unescape(entity["name"]) + "&nbsp;&nbsp;");
            content.push("<a name=\"remove_folder\" href=\"javascript:void(null);\" pid=\"" + entity["path"] + "\">");
            content.push("删除</a>&nbsp;&nbsp;");
            content.push("<a  href=\"" + unescape(entity["path"]) + "\" target=\"_blank\" >下载</a>&nbsp;&nbsp;");
            content.push("</li>");
        }
        $("#file_list").empty().html(content.join(""));
        Default.InitClickFn("file_list");
    },
    DealFolderData: function(data) {
        var content = [];
        for (var item in data) {
            var entity = data[item];
            content.push("<li><a name=\"look_folder\" href=\"javascript:void(null);\" pid=\"" + entity["path"] + "\">");
            content.push(unescape(entity["name"]) + "</a>&nbsp;&nbsp;");
            content.push("<a name=\"remove_folder\" href=\"javascript:void(null);\" pid=\"" + entity["path"] + "\">");
            content.push("删除</a>&nbsp;&nbsp;</li>");
        }
        $("#folder_list").empty().html(content.join(""));
        Default.InitClickFn("folder_list");
    },
    InitClickFn: function(id) {
        $("#" + id).find("a[name='look_folder']").each(function() {
            var cate = $(this).attr("cate");
            if (undefined == cate || cate == "0") {
                $(this).attr("cate", "1");
                $(this).click(function() {
                    var path = unescape($(this).attr("pid"));
                    Default.GetFolderList(path);
                    Default.GetFileList(path);
                });
                
            }
        });


        $("#" + id).find("a[name='remove_folder']").each(function() {
            var cate = $(this).attr("cate");
            if (undefined == cate || cate == "0") {
                $(this).attr("cate", "1");
                $(this).click(function() {
                    var tag = null;
                    var path = $(this).attr("pid");
                    var params = { "AjaxString": "1", "path": path };
                    if (id == "folder_list") {
                        params["action"] = "removefolder";
                        tag = "目录";
                    } else if (id == "file_list") {
                        params["action"] = "removefile";
                        tag = "文件";
                    }
                    if (!confirm("此操作不可恢复！您确定要删除该" + tag + "？")) {
                        return;
                    }
                    var current_obj = this;
                    $.post(Default.PostUrl,
                        params,
                        function(data) {
                            if (data.Success == 1) {
                                $(current_obj).parent("li").remove();
                            }
                        },
                        "json"
                    );
                });
            }
        });


    },
    GetPostUrl: function() {
        var url = Default.PostUrl + "?action=uploadfile&";
        var params = [];
        params.push("AjaxString=1");
        params.push("path=" + escape($("#file_path").html() + "\\" + $("#file_name").val()));
        return url + params.join("&");
    }
}