import { Provider } from 'react-redux';
import store from "../state/store";
function StateProvider ({children}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}

export default StateProvider;