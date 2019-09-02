export class User {

    constructor(
        public avatar: string = '',
        public agreement: boolean = false,
        public email: string = '',
        public id: string = '',
        public language: string = '',
        public lastaccess: string = '',
        public logouttime: string = '',
        public name: string = '',
        public password: string = '',
        public resettoken: string = '',
        public roles: string[] = [],
        public surname: string = '',
        public username: string = '',
    ) { }
}
