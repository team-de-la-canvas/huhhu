import React, { useEffect } from 'react';
import {useSelector, useDispatch, TypedUseSelectorHook} from 'react-redux';
import {RootState} from "../state/store";

//This simplifies selector types a lot
const useApiSelector: TypedUseSelectorHook<RootState> = useSelector;

function ExampleConsumer() {
    
}

export default ExampleConsumer;
