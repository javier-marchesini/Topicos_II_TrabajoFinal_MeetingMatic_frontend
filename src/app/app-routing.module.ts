import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './components/common/error-handler/error.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MeetingCreateFormComponent } from './components/meeting/meeeting-create-form/meeting-create-form.component';
import { MeetingAdminComponent } from './components/meeting/meeting-admin/meeting-admin.component';

import { MeetingMatchReponseComponent } from './components/meeting/meeting-match-reponse/meeting-match-reponse.component';

import { MeetingMatchComponent } from './components/meeting/meeting-match/meeting-match.component';
import { SigninComponent } from './components/users/signin/signin.component';
import { MeetingsBoardComponent } from './components/users/meetings-board/meetings-board.component';

import { SignupComponent } from './components/users/signup/signup.component';
import { AuthGuard } from './helpers/auth.guard';
import { MeetingViewDetailComponent } from './components/meeting/meeting-view-detail/meeting-view-detail.component';
import { MeetingMatchValidateComponent } from './components/meeting/meeting-match-validate/meeting-match-validate.component';
import { UsersAdminComponent } from './components/admin/users-admin/users-admin.component';
import { MeetingsAdminComponent } from './components/admin/meetings-admin/meetings-admin.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { Rol } from './models/rol.model';
import { AdminBoardComponent } from './components/admin/admin-board/admin-board.component';
import { PricingComponent } from './pages/pricing/pricing.component';

const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'meeting/create', component: MeetingCreateFormComponent },
    { path: 'meeting/detail', component: MeetingViewDetailComponent },
    { path: 'meeting/admin', component: MeetingAdminComponent },
    { path: 'meeting/match', component: MeetingMatchComponent },
    { path: 'meeting/match/:meetingId', component: MeetingMatchValidateComponent },
    { path: 'match/response', component: MeetingMatchReponseComponent },

    { path: 'user/signup', component: SignupComponent },
    { path: 'user/signin', component: SigninComponent },
    { path: 'user/meetings/board', component: MeetingsBoardComponent, canActivate: [AuthGuard], data: { roles: [Rol.OWNER] } },
    { path: 'user/profile', component: UserProfileComponent },
    
    { path: 'admin/users', component: UsersAdminComponent,canActivate: [AuthGuard], data: { roles: [Rol.ADMIN] } },
    { path: 'admin/meetings', component: MeetingsAdminComponent, canActivate: [AuthGuard], data: { roles: [Rol.ADMIN] } },
    { path: 'admin/board', component: AdminBoardComponent },
    
    { path: 'pricing', component: PricingComponent },


    { path: 'error', component: ErrorComponent },
    { path: '**', component: InicioComponent },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
