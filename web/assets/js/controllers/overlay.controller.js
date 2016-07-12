
"use strict";

function Overlay() {
    this.show = function(element) {
        if (!element) {
            element = 'body';
        }
        $(element).LoadingOverlay("show", {
            zIndex: 10000
        });
    };

    this.hide = function(element) {
        if (!element) {
            element = 'body';
        }
        $(element).LoadingOverlay("hide");
    }
}

var overlay = new Overlay();
