/**
 *    Google Sample Page
 *    Javascript Resources
 *     @author Nate Schulz
 */
 
// Define a few constants
var kGPageAdaptiveDisplayNormal = 0,
    kGPageAdaptiveDisplayTablet = 1,
    kGPageAdaptiveDisplayMobile = 2;

/**
 * GPage is the primary JS object for the page
 * In this case, it handles resize functionality
 */
function GPage(pageTitle) {
    this._navBarIsShowing = true;

    // Cache DOM elements
    this._elements = {};
    this._elements.navBar = $Obj('gNavBar');
    this._elements.pageTitle = $Obj('pageTitle');
    this._elements.optionsView = new GOptions($Obj('optionsContainer'));
    this._elements.body = document.body;
    this._adaptiveDisplayMode = kGPageAdaptiveDisplayNormal;

    // Run init
    this.init(pageTitle);
};
GPage.prototype = {
    init: function(title) {
        var self = this;
        this.toggleNavBar();
        this._elements.pageTitle.setInnerHTML( title );
        this.handleResize();
        window.addEventListener("resize", function(event) {
            self.handleResize.apply(self, arguments);
        }, false);
    },
    toggleNavBar: function() {
        if (this._navBarIsShowing) {
            this._elements.navBar.hide();
            this._navBarIsShowing = false;
        } else {
            this._elements.navBar.show();
            this._navBarIsShowing = true;
        }
    },
    handleResize: function() {
        if (window.innerWidth > 980) {
            this.setAdaptiveDisplay(kGPageAdaptiveDisplayNormal);
        } else if (window.innerWidth > 480) {
            this.setAdaptiveDisplay(kGPageAdaptiveDisplayTablet);
        } else {
            this.setAdaptiveDisplay(kGPageAdaptiveDisplayMobile);
        }
    },
    setAdaptiveDisplay: function(mode) {
        if (mode != this._adaptiveDisplayMode) {
            this._adaptiveDisplayMode = mode;
            switch (mode) {
                case kGPageAdaptiveDisplayMobile:
                    this._elements.body.className = "mobile";
                break;
                case kGPageAdaptiveDisplayTablet:
                    this._elements.body.className = "tablet";
                break;
                default:
                    this._elements.body.className = "";
            }
            
        }
    }
};

/**
 *    GOptions
 *    an extremely simple, quick and dirty popup box
 */
function GOptions(elem) {
    this._mouseUpTO = null;
    this._listIsVisible = false;
    this._container = elem;
    this._button = convertToView(this._container.getElementsByTagName('a')[0]);
    this._listView = convertToView(this._container.getElementsByTagName('div')[0]);
    this.init();
};
GOptions.prototype = {
    init: function() {
        this.hideList();
        var self = this;
        this._button.addEventListener('mousedown', function() {
            self.toggleList.apply(self, arguments);
        }, false);
        this._listView.addEventListener('mouseup', function() {
            self.hideList.apply(self, arguments);
        }, false);
    },
    toggleList: function() {
        if (this._listIsVisible) {
            return this.hideList();
        }
        return this.showList();
    },
    showList: function() {
        this._listView.show();
        this._listIsVisible = true;
        var self = this;
        this._mouseUpTO = setTimeout(function() {
            window.addEventListener('mouseup', function() {
                window.removeEventListener('mouseup', arguments.callee, false);
                self.hideList.apply(self, arguments);
            }, false);
        }, 200);
    },
    hideList: function() {
        this._listView.hide();
        this._listIsVisible = false;
        clearTimeout(this._mouseUpTO);
    }
};

/* Utilities */

// Try this way for IE peoples
if (window.innerWidth == undefined) {
 window.innerWidth = document.body.offsetWidth;
 window.innerheight = document.body.offsetHeight;
}

/* 
    ConvertToView is a convenience wrapper
    for basic hide and shows and innerHTML
*/
function convertToView(e) {
    e.hide = function() {
        this.style.display = "none";
    };
    e.show = function() {
        this.style.display = "";
    };
    e.setInnerHTML = function(t) {
        this.innerHTML = t;
    };
    return e;
};

/*
    Convenience wrapper that looks up
    by supplied Id any DOM element.
*/
function $Obj(id) {
    return convertToView(document.getElementById(id));
};

// Initialize the page when we're ready to go
document.addEventListener("DOMContentLoaded", function() {
    GPage = new GPage('Tour');
}, false);
