import update from "react-addons-update";
import constants from "./actionConstants";

//const {} = constants;

const initialState = {
    currentDriver: {
        id: null,
        name: '',
    },
    routeInfo: null,
    comments: [],
    drivers: [],
};

export function HomeReducer (state = initialState, action){
    switch (action.type) {
        case 'ROUTE':
            return Object.assign({}, state, {routeInfo: action.payload});
        case 'DRIVERS':
            return Object.assign({}, state, {drivers: action.payload});
        case 'CURRENT_DRIVER':
            return Object.assign({}, state, {currentDriver: action.payload});
        case 'ADD_COMMENT':
            return Object.assign({}, state, {comments: [...state.comments, action.payload]});
        default:
            return state;
    }
}