import { combineReducers } from "redux";
import blogReducer from "./blogReducer";

const rootReducer = combineReducers({ blogReducer });

export default rootReducer;
