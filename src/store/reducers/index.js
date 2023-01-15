import { combineReducers } from "redux";

import animeReducer from "./anime.reducer";
import boardReducer from "./board.reducer";
import mangaReducer from "./manga.reducer";
import userReducer from "./user.reducer";

export default combineReducers({ animeReducer, boardReducer, mangaReducer, userReducer });
