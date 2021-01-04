import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { UserUnregisteredService } from 'src/app/services/user-unregistered.service';

@Component({
    selector: 'app-users-admin',
    templateUrl: './users-admin.component.html',
    styles: [
    ]
})
export class UsersAdminComponent implements OnInit {

    public registeredUsers = [];
    public registeredUsersFiltered = [];

    public unregisteredUsers = [];
    public unregisteredUsersFiltered = [];

    public pageTableRegisteredUsers = 1;
    public pageSizeTableRegisteredUsers = 10;
    public collectionSizeTableRegisteredUsers = 0;

    public pageTableUnregisteredUsers = 1;
    public pageSizeTableUnregisteredUsers = 10;
    public collectionSizeTableUnregisteredUsers = 0;

    public displayLoadingUserRegistered = true;
    public displayLoadingUserUnRegistered = false;

    constructor(private _userService: UserService,
                private _userUnregisteredService: UserUnregisteredService) { }

    ngOnInit(): void {

        this._userService.getUsers()
            .subscribe(
                response => {
                    this.registeredUsers = response;
                    this.refreshTableRegisteredUsers();
                },
                (error: HttpErrorResponse) => {


                })
                .add(() => this.displayLoadingUserRegistered = false);

        this._userUnregisteredService.getUsersUnregistered()
        .subscribe(
            response => {
                this.unregisteredUsers = response;
                this.refreshTableUnregisteredUsers();
                console.log(this.unregisteredUsers);
            },
            (error: HttpErrorResponse) => {

                
            })
            .add(() => this.displayLoadingUserRegistered = false);
    }


    refreshTableRegisteredUsers() {
        this.registeredUsersFiltered = this.registeredUsers
            .map((user, i) => ({ number: i + 1, ...user }))
            .slice((this.pageTableRegisteredUsers - 1) * this.pageSizeTableRegisteredUsers, (this.pageTableRegisteredUsers - 1) * this.pageSizeTableRegisteredUsers + this.pageSizeTableRegisteredUsers);
    }
   
    refreshTableUnregisteredUsers() {
        this.unregisteredUsersFiltered = this.unregisteredUsers
            .map((user, i) => ({ number: i + 1, ...user }))
            .slice((this.pageTableUnregisteredUsers - 1) * this.pageSizeTableUnregisteredUsers, (this.pageTableUnregisteredUsers - 1) * this.pageSizeTableUnregisteredUsers + this.pageSizeTableUnregisteredUsers);
    }


}
