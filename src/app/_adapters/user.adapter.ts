import { Injectable } from '@angular/core';

import { Adapter } from '@app/_helpers/adapter';
import { User } from '@app/_models';

@Injectable({
    providedIn: 'root'
})
export class UserAdapter implements Adapter<User> {

    constructor() { }

    adapt(item: any = {}): User {
        return new User(
            item.avatar,
            item.agreement,
            item.email,
            item.id,
            item.language,
            item.lastaccess,
            item.logouttime,
            item.name,
            item.password,
            item.resettoken,
            item.roles,
            item.surname,
            item.username
        );
    }
}
