var _slicedToArray = function() {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) {
            _d = true;
            _e = err;
        } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } }
        return _arr;
    }
    return function(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };
}();

var _electron = require('electron');
var _url = require('url');
var _path = require('path');

var notificationWindow = null;
var maxVisible = null;
var BrowserWindow = _electron.BrowserWindow;
var hideTimeout = null;
var notifications = [];

function destroyWindow() {
    if (notificationWindow == null) {
        return;
    }

    notificationWindow.hide();
    notificationWindow.close();
    notificationWindow = null;
}

function createWindow() {
    if (notificationWindow != null) {
        return;
    }

    notificationWindow = new BrowserWindow({
        title: "Notification",
        frame: false,
        resizable: false,
        show: false,
        acceptFirstMouse: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        transparent: true
    });
    var notificationUrl = _url.default.format({
        protocol: 'file',
        slashes: true,
        pathname: _path.default.join(__dirname, 'notifications', 'index.html')
    });
    notificationWindow.loadURL(notificationUrl);
    notificationWindow.webContents.on('did-finish-load', function() {
        return update();
    });
}

function update() {
    if (notifications.length > 0) {
        clearTimeout(hideTimeout);
        hideTimeout = null;

        if (notificationWindow != null) {
            var _calculateBoundingBox = calculateBoundingBox(notificationWindow, 'bottom', 5),
                width = _calculateBoundingBox.width,
                height = _calculateBoundingBox.height,
                x = _calculateBoundingBox.x,
                y = _calculateBoundingBox.y;

            notificationWindow.setPosition(x, y);
            notificationWindow.setSize(width, height);
            notificationWindow.showInactive();
        } else {
            createWindow();
            return;
        }
    } else if (hideTimeout == null) {
        hideTimeout = setTimeout(function() {
            return destroyWindow();
        }, 333 * 1.1);
    }

    if (notificationWindow != null) {
        notificationWindow.webContents.send('UPDATE', notifications.slice(0, maxVisible));
    }
}

function calculateBoundingBox(mainWindow, screenPosition, maxVisible) {
    var _mainWindow$getPositi = mainWindow.getPosition(),
        _mainWindow$getPositi2 = _slicedToArray(_mainWindow$getPositi, 2),
        positionX = _mainWindow$getPositi2[0],
        positionY = _mainWindow$getPositi2[1];

    var _mainWindow$getSize = mainWindow.getSize(),
        _mainWindow$getSize2 = _slicedToArray(_mainWindow$getSize, 2),
        windowWidth = _mainWindow$getSize2[0],
        windowHeight = _mainWindow$getSize2[1];

    var centerPoint = {
        x: Math.round(positionX + windowWidth / 2),
        y: Math.round(positionY + windowHeight / 2)
    };

    var activeDisplay = _electron.screen.getDisplayNearestPoint(centerPoint) || _electron.screen.getPrimaryDisplay();
    var workArea = activeDisplay.workArea;

    var width = 400;
    //const height = (Math.min(this.notifications.length, this.maxVisible) + 1) * VARIABLES.height;
    var height = (maxVisible + 1) * 106;

    var x = workArea.x + workArea.width - width;
    var y = void 0;
    switch (screenPosition) {
        case 'top':
            y = workArea.y;
            break;
        case 'bottom':
            y = workArea.y + workArea.height - height;
            break;
    }

    return { x: x, y: y, width: width, height: height };
}

module.exports = {
    destroyWindow: destroyWindow,
    createWindow: createWindow,
    update: update,
    calculateBoundingBox: calculateBoundingBox
};