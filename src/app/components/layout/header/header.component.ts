import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models';
import { Rol } from 'src/app/models/rol.model';
import { AuthenticationService } from 'src/app/services';



@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles: []
})
export class HeaderComponent implements OnInit {

    public currentUser: User = null;
    public isCollapsed = true;
    public userRol = "default";
    public routerLink = '';
    public menu = [];

    constructor(private _authenticationService: AuthenticationService, private router: Router,) {

        this._authenticationService.currentUser
            .subscribe(x => {
                this.currentUser = x
                if (this.currentUser) {
                    this.userRol = this.currentUser.roles[0];
                }

                this.menu = this.getMenuItems()[this.userRol];
            }
            );

    }

    logout() {
        this._authenticationService.logout(true);
    }

    ngOnInit(): void {
    }

    navigateTo(link) {
        this.router.navigate([link]);
    }




    getMenuItems() {

        return {
            default: [

                {
                    nombre: 'Inicio',
                    routerLink: '',
                    rol: null,
                    position: 0
                },
                {
                    nombre: 'Caracteristicas',
                    routerLink: 'caracteristicas',
                    rol: null,
                    position: 1
                },
                {
                    nombre: 'Pricing',
                    routerLink: 'pricing',
                    position: 2
                },
                {
                    nombre: 'About',
                    routerLink: 'about',
                    position: 3
                }
            ],
            admin: [
                {
                    nombre: 'Admin Board',
                    routerLink: '/admin/board',
                    position: 1
                },
                {
                    nombre: 'Meetings',
                    routerLink: '/admin/meetings',
                    position: 1
                },
                {
                    nombre: 'Usuarios',
                    routerLink: '/admin/users',
                    position: 1
                }
            ],
            owner: [
                {
                    nombre: 'Inicio',
                    routerLink: '',
                    position: 0
                },
                {
                    nombre: 'Mis Meetings',
                    routerLink: '/user/meetings/board',
                    position: 1
                },
                {
                    nombre: 'Caracteristicas',
                    routerLink: 'caracteristicas',
                    rol: null,
                    position: 2
                },
                {
                    nombre: 'Pricing',
                    routerLink: 'pricing',
                    position: 3
                },
                {
                    nombre: 'About',
                    routerLink: 'about',
                    position: 4
                }
            ]

        }

    }

}
