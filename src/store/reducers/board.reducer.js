import {
	ADD_BOARD,
	ADD_BOARD_LIST
} from "../actions/board.actions.js";

const initialState = {
	quadros: [],
};

export default function board(state = initialState, action) {
	switch (action.type) {
		case ADD_BOARD:
			return {
				...state,
				quadros: state.quadros.concat(action.board)
			};
		case ADD_BOARD_LIST:
			let quadro = state.quadros.find((r) => r.id == action.boardid);

			quadro.lists.push(action.list);
			state.quadros.splice(state.quadros.findIndex((r) => r == quadro), 1);

			return {
				...state,
				quadros: [
					...state.quadros,
					quadro
				]
			};
		default:
			return state;
	}
}
