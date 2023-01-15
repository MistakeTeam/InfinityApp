import { GET_ANIME_EPI_SUCCESS } from "../actions/anime.actions";

const initialState = {
	animeList: [],
	animeWatching: {
		id: "",
		name: "",
		path: "",
		episodios: [],
		episodioWatching: {
			id: "",
			name: "",
			buffer: ""
		}
	}
};

export default function anime(state = initialState, action) {
	// console.log(action);
	switch (action.type) {
		case GET_ANIME_EPI_SUCCESS:
			return {
				...state,
				animeWatching: {
					...state.animeWatching,
					episodioWatching: {
						buffer: action.payload.data
					}
				}
			};
		default:
			return state;
	}
}
