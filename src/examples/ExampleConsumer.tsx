import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '../state/actions/dataActions';

function ExampleConsumer() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data.content);
    const loading = useSelector(state => state.data.loading);
    const error = useSelector(state => state.data.error);

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error! {error.message}</div>;
    }

    return (
        data
    );
}

export default ExampleConsumer;
