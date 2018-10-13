'use strict';

import Transport from '../../modules/Transport/Transport.js';
import eventBus from '../../modules/EventBus/EventBus.js';

/**
 * Module user data
 * @module UserService
 */
class UserService {
    /**
     * @constructor
     */
    constructor() {
        this.user = null;

    }

    /**
     * Get data from backend
     * @return {Transport|*}
     */
    getData() {
        return Transport.Get('/user').then((userData) => {
            this.user = userData;
        });
    }

    /**
     * Get user data
     * @return {*}
     */
    getUser() {
        return this.user;
    }

    /**
     * Check, that user in system
     * @return {*}
     */
    isLogIn() {
        return !!this.user;
    }

    checkAuth() {
        return Transport.Get('/session')
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return 'false';
            })
            .then((userInfo) => {
                console.log(userInfo['login']);
               this.user = userInfo['login'];
               return 'ok';
            });
    }

    /**
     * Log out user
     * @return {*}
     */
    logOut(login, password) {
        let requestBody = {
            'login': login,
            'password': password
        };
        return Transport.Delete('/session', requestBody)
            .then(response => {
                this.user = null;
                eventBus.emit('loggedOut');
            })
    }

    logIn(login, password) {
        let requestBody = {
            'login': login,
            'password': password
        };
        return Transport.Post('/session', requestBody)
            .then((response) => {
                if (response.status === 200) {
                    this.user = requestBody['login'];
                    eventBus.emit('loggedIn');
                }
            });
    }

    register(login, email, password) {
        let requestBody = {
            'login': login,
            'email': email,
            'password': password
        };
        Transport.Post('/user', requestBody)
            .then((response) => {
                if (response.status === 200) {
                    response.headers.forEach(console.log);
                    document.response = response;
                    eventBus.emit('loggedIn');
                }
                return response.json();
            })
            .then((user) => {
                this.user = user['login'];
            });
    }
}

const userService = new UserService();

export default userService;