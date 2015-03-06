// JavaScript Document

function divMove(obj, move_obj) {
    this.obj = typeof (obj) == "object" ? obj : $("#" + obj);
    this.moveobj = typeof (move_obj) == "object" ? move_obj : $("#" + move_obj);
    this.drag = true;
    this.MouseX = 0;
    this.MouseY = 0;
    this.OffX = 0;
    this.OffY = 0;
    this.PositionX = 0;
    this.PositionY = 0;
    this.width = 0;
    this.height = 0;    
}
divMove.prototype.init = function() {
    $("body").css({ "position": "relative", "clear": "both" });
    $(this.moveobj).css("position", "absolute");
    this.PositionX = $(this.obj).offset().left;
    this.PositionY = $(this.obj).offset().top;
    this.width = $(this.obj).width();
    this.height = $(this.obj).height();
    this.MouseDown();
}
divMove.prototype.MouseDown = function() {
    var currentObj = this;
    $(document).mousedown(function(e) {
        /*if (currentObj.drag) {*/

        if (currentObj.CheckPosition(e)) {            
            //$(currentObj.obj).css("cursor", "move");
            currentObj.OffX = $(currentObj.obj).offset().left;
            currentObj.OffY = $(currentObj.obj).offset().top;
            currentObj.drag = false;
            currentObj.MouseX = e.clientX;
            currentObj.MouseY = e.clientY;
            currentObj.Move();
        }
        /*}
        else {
        $(currentObj.obj).css("cursor", "default");
        currentObj.drag = true;
        }*/
    });
    $(document).mouseup(function(e) {
        currentObj.drag = true;
    });

}

divMove.prototype.Move = function() {
    var currentObj = this;
    $(document).mousemove(function(e) {
        if (!currentObj.drag) {
            var x = e.clientX;
            var y = e.clientY;
            $(currentObj.moveobj).css({ "left": currentObj.OffX + x - currentObj.MouseX, "top": currentObj.OffY + y - currentObj.MouseY, "margin": 0 });
        }
    });
}
divMove.prototype.CheckPosition = function(e) {
    var tag = false;
    this.PositionX = $(this.obj).offset().left;
    this.PositionY = $(this.obj).offset().top;
    var scroll_top = $(document).scrollTop();
    var compare_top = scroll_top + e.clientY;
    if (e.clientX > this.PositionX && e.clientX < (this.PositionX + this.width)) {
        if (compare_top > this.PositionY && compare_top < (this.PositionY + this.height)) {
            tag = true;
        }
    }
    return tag;
}