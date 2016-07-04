
"use strict";

function Overlay() {
    this.show = function() {
        $('body').LoadingOverlay("show", {
            zIndex: 10000
        });
    };

    this.hide = function() {
        $('body').LoadingOverlay("hide");
    }
}

var overlay = new Overlay();
