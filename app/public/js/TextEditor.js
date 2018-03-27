let TextBuffer = `let index, ter, value, felm, lol;
function Hello() {
    index = 0;
}`;

function startTextEditor() {
    TextBuffer.split('\n').forEach((TextBuffer_value, TextBuffer_index, TextBuffer_array) => {
        let variable = [],
            word = TextBuffer_value.split(' '),
            is

        $('.TextEditor-line-view').append(`
        <div class="line" data-screen-row="${TextBuffer_index}">
            <span class="line-words"></span>
        </div>`);
        $('.TextEditor-line-count').append(`<div class="line-numbers" style="padding: 0 10px 0 0; background: #212020;">${TextBuffer_index + 1}</div>`);
        // word.forEach((word_value, word_index, word_array) => {
        //     console.log(word_value);
        //     if (word_value.includes('function')) {
        //         let wordSelect = 'function';
        //         let otherL = word.splice(word_index);
        //         let at = word_value.replace(wordSelect, '')
        //         word.push(wordSelect);
        //         word.push(at);
        //         word.push(otherL);
        //     }
        // });
        word.forEach((word_value, word_index, word_array) => {
            let syntax_class = '';
            if (word_value == ('let' || 'var' || 'const' || 'function')) {
                syntax_class = 'mtk4';
            } else if ((word_value.startsWith("'") || word_value.startsWith('"')) && (word_value.endsWith("'") || word_value.endsWith('"'))) {
                syntax_class = 'mtk7';
            } else if (word_value.startsWith("//")) {
                syntax_class = 'mtk3';
                $('.line').each((line_index, line_element) => {
                    if ($(line_element).attr('data-screen-row') == TextBuffer_index) {
                        $(line_element).children('.line-words').append(`<span class="${syntax_class}">${word_value}</span>`);
                        $(line_element).children('.line-words').append(`<span class="mtk1">&nbsp;</span>`);
                    }
                });
            } else if (typeof word_value === Number) {
                syntax_class = 'mtk5';
            } else if ((word_value == '=') || (word_value.includes('='))) {
                syntax_class = 'mtk17';
            } else {
                syntax_class = 'mtk9';
            }

            $('.line').each((line_index, line_element) => {
                if ($(line_element).attr('data-screen-row') == TextBuffer_index) {
                    $(line_element).children('.line-words').append(`<span class="${syntax_class}">${word_value}</span>`);
                    $(line_element).children('.line-words').append(`<span class="mtk1">&nbsp;</span>`);
                }
            });
        });
    });
    $('.line').click(lineClick);
    $('#overflow-TextEditor').click((event) => {
        $('.line').removeClass('cursor-line');
        $($('.line')[$('.line').length - 1]).addClass('cursor-line');
    });
}

function lineClick(event) {
    $('.line').each((index, element) => {
        if ($(element).hasClass('cursor-line')) {
            $(element).removeClass('cursor-line');
        }
    });
    $(this).addClass('cursor-line');
}