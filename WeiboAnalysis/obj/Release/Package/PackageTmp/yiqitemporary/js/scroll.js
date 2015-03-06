function startmarquee(lh, speed, divid) {
    var scrtime;
    $("#" + divid).hover(function() {
        clearInterval(scrtime);
    }, function() {
        scrtime = setInterval(function() {
            var $ul = $("#" + divid + " ul");
            var liHeight = $ul.find("dl:last").height();
            $ul.animate({ marginTop: liHeight + lh + "px" }, speed, function() {
                $ul.find("dl:last").prependTo($ul)
                $ul.find("dl:first").hide();
                $ul.css({ marginTop: 0 });
                $ul.find("dl:first").fadeIn(speed);
            });
        }, 3000);
    }).trigger("mouseleave");
}