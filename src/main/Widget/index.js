module.exports = {
    Calendar: () => {
        $('.home-over').append(`
            <div class="widget-container" widget="calendar" style="background: #242425; min-width: 300px;">
                <div class="widget-topbar"></div>
            </div>
        `);
        require('./Calendar.js').initCalendar();
    }
}