export function createID(length, type = 0) {
    let base = "",
        r = "";

    if (type < 0 || type > 2) return;
    switch (type) {
        case 1:
            base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            break;
        case 2:
            base = "0123456789"
            break;
        default:
            base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            break;
    }

    for (let i = 0; i < length; i++) {
        const c = base.charAt(Math.random() * base.length);
        r += c;
    }

    return r;
}