import { Dimensions } from 'react-native';
import { SET_USER, SET_DOWNLOADS,SET_DOWNLOADGD } from './actions';

const initialState = {
    user: null,
    screenW: Dimensions.get('window').width,
    screenH: Dimensions.get('window').height,
    downloads: [],
    downloadgd: [],
    opensearch: true,
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case SET_DOWNLOADS:
            return { ...state, downloads: action.payload };
        case SET_DOWNLOADGD:
            return { ...state, downloadgd: action.payload };            
        case 'set_search':
            return { ...state, opensearch: action.payload };
        default:
            return state;
    }
}

export default userReducer;