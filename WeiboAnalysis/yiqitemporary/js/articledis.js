$(document).ready(function() {
    Common.LoginEventFn = function(Data) {
        if (Data.Show == 1) {
            $("#look_url").parent("span").show();
        } else {
            $("#look_url").parent("span").hide();
        }
        Article.Display();
    }
    Common.CheckUser();
});

var _article = new Object;
var Article = _article.property = {
    Display: function() {
        var id = $.query.get('id');
        if (id) {
            $.post("Handler/ArticleHandler.ashx",
                { "act": "initarticleinfo", "articleid": id.replace("_","") },
                function(data) {
                    if (data) {                       
                        var entity = data["entitylist"]["entity_1"];
                        $("#article_title").empty().html(unescape(entity["articletitle"]));
                        $("#article_time").empty().html(unescape(entity["articlebasedate"]));
                        $("#article_site").empty().html(unescape(entity["articlesource"]));
                        $("#article_content").empty().html(unescape(entity["articlecontent"]));
                        $("#look_url").attr("href", unescape(entity["articleexternalurl"]));
                    }
                },
                "json"
            )
           
            
        }
    }
}