// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './navigation/AppNavigator';
import store from './store/store';

const App: React.FC = () => (
    <Provider store={store}>
        <AppNavigator />
    </Provider>
);

export default App;
