export class SessionUser {
    id: string;
    name: string;
}

export namespace SESSION_USER {

    export function getUser(): SessionUser {
        return JSON.parse(localStorage.getItem('user'));
    }

    export function setUser(user: SessionUser) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    export function logout() {
        localStorage.removeItem('user');
    }
}