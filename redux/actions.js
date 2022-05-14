export const SET_USER = 'SET_USER';
export const SET_DOWNLOADS = 'SET_DOWNLOADS';
export const SET_DOWNLOADGD = 'SET_DOWNLOADGD';

export const setUser = user => dispatch => {
    dispatch({
        type: SET_USER,
        payload: user,
    });

};

export const setDownloads = downloads => dispatch => {
    dispatch({
        type: SET_DOWNLOADS,
        payload: downloads,
    });
    
};

export const setDownloadGD = downloadstatus => dispatch => {
    dispatch({
        type: SET_DOWNLOADGD,
        payload: downloadstatus,
    });
    
};

export const setSearchFlag = searchflag => dispatch => {
    dispatch({
        type: 'set_search',
        payload: searchflag,
    });
    
};