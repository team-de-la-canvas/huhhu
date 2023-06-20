import axios from 'axios';

export const fetchDataBegin = () => ({
    type: 'FETCH_DATA_BEGIN'
});

export const fetchDataSuccess = data => ({
    type: 'FETCH_DATA_SUCCESS',
    payload: { data }
});

export const fetchDataFailure = error => ({
    type: 'FETCH_DATA_FAILURE',
    payload: { error }
});

export function fetchData() {
    return dispatch => {
        dispatch(fetchDataBegin());
        return axios.get('http://localhost:3000')
            .then(response => {
                dispatch(fetchDataSuccess(response.data));
                return response.data;
            })
            .catch(error => dispatch(fetchDataFailure(error)));
    };
}
