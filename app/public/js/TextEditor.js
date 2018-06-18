var editor,
    fileEntry,
    hasWriteAccess,
    tabsOpen = [],
    langSupports = JSON.parse(fs.readFileSync('./app/public/js/lib/langSupports-lib.json', 'utf8')).langs;

function handleDocumentChange(title) {
    var mode = "undefined";
    var modeName = "Text";
    if (title) {
        title = title.match(/[^\\]+$/)[0];
        langSupports.forEach((v, i, a) => {
            if (title.match(v.regex)) {
                mode = v.mode;
                modeName = v.name;
            }
        });
    } else {
        //document.getElementById("title").innerHTML = "Untitled";
    }
    editor.setOption("mode", mode);
    return { mode: mode };
}

function newFile() {
    fileEntry = null;
    hasWriteAccess = false;
    handleDocumentChange(null);
}

function setFile(theFileEntry, isWritable) {
    fileEntry = theFileEntry;
    hasWriteAccess = isWritable;
}

function readFileIntoEditor(theFileEntry) {
    fs.readFile(theFileEntry.toString(), function(err, data) {
        if (err) {
            console.log("Read failed: " + err);
        }

        let v = handleDocumentChange(theFileEntry);
        editor.setValue(String(data));
        tabsOpen.forEach((tab, id, ary) => {
            tab.active = false;
        });
        tabsOpen.push({
            textBuffer: String(data),
            name: theFileEntry.match(/[^\\]+$/)[0],
            type: v.mode,
            path: theFileEntry,
            active: true
        });
        tabsUpdate();
    });
}

function writeEditorToFile(theFileEntry) {
    var str = editor.getValue();
    fs.writeFile(theFileEntry, editor.getValue(), function(err) {
        if (err) {
            console.log("Write failed: " + err);
            return;
        }

        handleDocumentChange(theFileEntry);
        console.log("Write completed.");
    });
}

var onChosenFileToOpen = function(theFileEntry) {
    console.log(theFileEntry);
    setFile(theFileEntry, false);
    readFileIntoEditor(theFileEntry);
};

var onChosenFileToSave = function(theFileEntry) {
    setFile(theFileEntry, true);
    writeEditorToFile(theFileEntry);
};

function handleOpenButton() {
    dialog.showOpenDialog({ properties: ['openFile'] }, function(filename) {
        if (filename == undefined) {
            return;
        }
        onChosenFileToOpen(filename.toString());
    });
}

function handleSaveButton() {
    if (fileEntry && hasWriteAccess) {
        writeEditorToFile(fileEntry);
    } else {
        dialog.showSaveDialog(function(filename) {
            onChosenFileToSave(filename.toString(), true);
        });
    }
}

function handleCloseWindow(index) {
    if (typeof index != Number) {
        index = $(index.target).parent().attr('index')
    }
    if (tabsOpen[index - 1] != undefined) {
        tabsOpen[index - 1].active = true;
    }
    tabsOpen.splice(index, 1);
    tabsUpdate();
}

function handleKeyCloseWindow() {
    tabsOpen.forEach((tab, id, ary) => {
        if (tab.active) {
            handleCloseWindow(id);
        }
    });
}

function handleSwitchWindow(index) {
    if (typeof index != Number) {
        index = $(index.target).attr('index')
    }
    tabsOpen.forEach((tab, id, ary) => {
        tab.active = false;
    });
    if (tabsOpen[index] != undefined) {
        tabsOpen[index].active = true;
        editor.setValue(tabsOpen[index].textBuffer);
        editor.setOption("mode", tabsOpen[index].type);
    }
    tabsUpdate();
}

function tabsUpdate() {
    if ($('#TextEditor-editor-tabs').children().length != 0) {
        $('#TextEditor-editor-tabs').children().remove();
    }

    if (tabsOpen.length <= 0) {
        $('#TextEditor-editor > .CodeMirror').css('display', 'none');
        if ($('#TextEditor-editor > .shadow').hasClass('top') && $('#TextEditor-editor > .CodeMirror').css('display') == 'none') {
            $('#TextEditor-editor > .shadow').removeClass('top');
        }
        if ($('#Text-Random-container').length == 0) {
            $('#TextEditor-editor').append(`
                <div id="Text-Random-container">
                    <span id="Text-Random-in-project-undefined">${lang.list_text_Editor_standby[Math.floor(Math.random() * lang.list_text_Editor_standby.length)]}</span>
                </div>
            `);
        }
    } else {
        $('#TextEditor-editor > .CodeMirror').css('display', 'block');
        $('#TextEditor-editor > #Text-Random-container').remove();
        $('#TextEditor-editor > .shadow').addClass('top');
    }

    tabsOpen.forEach((tab, id, ary) => {
        var s = "";
        if (tab.active) {
            s = "background: #2b2b2b;";
            editor.setValue(tab.textBuffer);
            editor.setOption("mode", tab.type);
        }
        $('#TextEditor-editor-tabs').append(`
            <div title="${tab.path == null ? "Untitled" : tab.path}" index="${id}" style="${s}">
                <span>${tab.name}</span>
                <a style="background: url(&quot;data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='3 3 16 16'%3E%3Cpath fill='%23e8e8e8' d='M12.597 11.042l2.803 2.803-1.556 1.555-2.802-2.802L8.239 15.4l-1.556-1.555 2.802-2.803-2.802-2.803 1.555-1.556 2.804 2.803 2.803-2.803L15.4 8.239z'/%3E%3C/svg%3E&quot;) 50% no-repeat; width: 20px; height: 20px; margin: auto 0 auto auto; z-index: 15;"></a>
            </div>
        `);
    });
    $('#TextEditor-editor-tabs').click(handleSwitchWindow);
    $('#TextEditor-editor-tabs div a').click(handleCloseWindow);
}

function setupMenuBarInEditor() {
    $('.titlebar-buttons').append(`
        <div class="app-button-style" id="Editor-button-file"><span class="fa fa-ellipsis-h"></span></div>
    `);

    $('#Editor-button-file').click(
        (event) => {
            setTimeout(() => {
                if ($('#right-mouse-options').length == 0) {
                    $('.downmost').append(`<div id="right-mouse-options" style="left: 28px; right: auto; bottom: auto;"><div id="container-options"></div></div>`);
                    CLOSE_MENU = true;

                    let lite = [{
                        id: "module-rmouse-new-file",
                        text: "Novo arquivo",
                        keystroke: "Ctrl+N",
                        generator: function() {
                            setTimeout(() => {
                                $('#right-mouse-options').remove();
                                handleOpenButton();
                            }, 40);
                        }
                    }];
                    lite.forEach((value, index, array) => {
                        $('#right-mouse-options>#container-options').append(`<div class="options-item" id="${value.id}"><span>${value.text}</span><span>${value.keystroke}</span></div>`);
                        $(`#${value.id}`).click(value.generator);
                    });
                } else if ($('#right-mouse-options').length > 0) {
                    $('#right-mouse-options').remove();
                }
            }, 100);
        }
    );
}

async function startTextEditor() {
    tabsOpen = [];
    if (editor == undefined) {
        editor = CodeMirror(document.getElementById("TextEditor-editor"), {
            mode: "undefined",
            lineNumbers: true,
            theme: "lesser-dark",
            extraKeys: {
                "Cmd-S": function(instance) { handleSaveButton() },
                "Ctrl-S": function(instance) { handleSaveButton() },
                "Cmd-O": function(instance) { handleOpenButton() },
                "Ctrl-O": function(instance) { handleOpenButton() },
                "Cmd-W": function(instance) { handleKeyCloseWindow() },
                "Ctrl-W": function(instance) { handleKeyCloseWindow() }
            }
        });

        tabsOpen.push({
            textBuffer: editor.getValue(),
            name: "Untitled",
            type: "undefined",
            path: null,
            active: true
        });
    }

    await tabsUpdate();
    await setupMenuBarInEditor();
}