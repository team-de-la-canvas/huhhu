const initialState = {
    content: [],
    loading: false,
    error: null
};

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_DATA_BEGIN':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'FETCH_DATA_SUCCESS':
            return {
                ...state,
                loading: false,
                content: action.payload.data
            };
        case 'FETCH_DATA_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                content: []
            };
        default:
            return state;
    }
}
