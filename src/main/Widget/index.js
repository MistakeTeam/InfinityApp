module.exports = {
    /**
     * @param {JQuery<HTMLElement>} append
     */
    Calendar: (append) => {
        $(append).append(`
            <div class="widget-container" widget="calendar" style="background: #242425; grid-column-start: 1; grid-column-end: 4; grid-row-start: 1; grid-row-end: 5;">
                <div class="widget-topbar"></div>
            </div>
        `);
        setTimeout(() => {
            require('./Calendar.js').initCalendar();
        }, 10);
    }
}