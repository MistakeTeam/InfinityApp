export const ADD_BOARD = "ADD_BOARD";
export const ADD_BOARD_LIST = "ADD_BOARD_LIST";

function addBoard(q) {
    return dispatch => {
        dispatch({
            type: ADD_BOARD,
            board: q
        });
    };
}

export function queueAddBoard(q) {
    return {
        queue: ADD_BOARD,
        callback: (next, dispatch, getState) => {
            dispatch(addBoard(q));
            next();
        }
    };
}

function addBoardList(boardid, q) {
    return dispatch => {
        dispatch({
            type: ADD_BOARD_LIST,
            boardid: boardid,
            list: q
        });
    };
}

export function queueAddBoardList(boardid, q) {
    return {
        queue: ADD_BOARD_LIST,
        callback: (next, dispatch, getState) => {
            dispatch(addBoardList(boardid, q));
            next();
        }
    };
}