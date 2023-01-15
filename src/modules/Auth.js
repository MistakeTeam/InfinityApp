class Auth {

    static authenticateUser(user) {
        localStorage.setItem('token', user.token);
        Cookies.set('locale', user.data.language);
    }

    static isUserAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    static deauthenticateUser() {
        localStorage.removeItem('token');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

}

export default Auth;
