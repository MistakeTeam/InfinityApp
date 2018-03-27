var object = {};

function init(data) {
    object.state = data.state;
    object.module = {
        active: data.active ? data.active : false,
        name: data.details
    }
    console.log(`[IAPI] Update: ${JSON.stringify(object)}`);
}

module.exports = {
    init,
    object
};