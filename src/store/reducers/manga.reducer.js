import {
	CLEAN_MANGA_CAP,
	GET_MANGA_SUCCESS,
	GET_MANGA_CAP_SUCCESS,
	GET_MANGA_LIST_SUCCESS,
	SET_MANGA
} from "../actions/manga.actions";

const initialState = {
	mangaList: [],
	mangaReading: {
		id: "",
		name: "",
		path: "",
		capitulos: [],
		capReading: {
			id: "",
			name: "",
			paginas: []
		}
	}
};

export default function manga(state = initialState, action) {
	// console.log(action);
	switch (action.type) {
		case CLEAN_MANGA_CAP:
			return {
				...state,
				mangaReading: {
					...state.mangaReading,
					capReading: {
						id: "",
						name: "",
						paginas: []
					}
				}
			};
		case GET_MANGA_SUCCESS:
			return {
				...state,
				mangaReading: {
					...state.mangaReading,
					capitulos: action.payload.data
				}
			};
		case GET_MANGA_CAP_SUCCESS:
			let manga = state.mangaReading.capitulos.find(
				manga => manga.id == action.meta.previousAction.capid
			);

			state.mangaReading.capReading = null;

			return {
				...state,
				mangaReading: {
					...state.mangaReading,
					capReading: {
						...state.mangaReading.capReading,
						id: manga.id,
						name: manga.name,
						paginas: action.payload.data
					}
				}
			};
		case GET_MANGA_LIST_SUCCESS:
			return {
				...state,
				mangaList: action.payload.data
			};
		case SET_MANGA:
			return {
				...state,
				mangaReading: {
					...state.mangaReading,
					id: action.data.id,
					name: action.data.name,
					path: action.data.path
				}
			};
		default:
			return state;
	}
}
