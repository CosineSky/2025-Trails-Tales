// src/store/reducers/authReducer.ts
const initialState = {
    isLoggedIn: false,
    user: null,
};

const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        default:
            return state;
    }
};

export default authReducer;
