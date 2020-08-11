const initialState = {
	postList: {},
};

export default function blogReducer(state = initialState, action) {
	switch (action.type) {
		case "GET_POST_SUCCESS":
			break;
		case "GET_POST_FAIL":
			break;
		case "GET_ALL_POST_SUCCESS":
			return {
				...state,
				postList: action.payload.data,
			};
		case "GET_ALL_POST_FAIL":
			break;
		default:
			return state;
	}
}
