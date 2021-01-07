import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { InicioComponent } from './components/inicio/inicio.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, AuthGuard, HttpErrorInterceptor } from './helpers';

import { HttpClientModule } from '@angular/common/http';

import { SignupComponent } from './components/users/signup/signup.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './components/common/error-handler/error.component';
import { ErrorHandlerGlobal } from './helpers/errorHandlerGlobal.component';
import { ToastrModule } from 'ngx-toastr';

import { MeetingAdminComponent } from './components/meeting/meeting-admin/meeting-admin.component';
import { MeetingMatchComponent } from './components/meeting/meeting-match/meeting-match.component';
import { MeetingMatchValidateComponent } from './components/meeting/meeting-match-validate/meeting-match-validate.component';
import { MeetingMatchReponseComponent } from './components/meeting/meeting-match-reponse/meeting-match-reponse.component';
import { MeetingCreateFormComponent } from './components/meeting/meeeting-create-form/meeting-create-form.component';
import { MeetingViewDetailComponent } from './components/meeting/meeting-view-detail/meeting-view-detail.component';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import localeEsAR from '@angular/common/locales/es-AR';
import { MeetingsBoardComponent } from './components/users/meetings-board/meetings-board.component';
import { SigninComponent } from './components/users/signin/signin.component';
import { MeetingsAdminComponent } from './components/admin/meetings-admin/meetings-admin.component';
import { UsersAdminComponent } from './components/admin/users-admin/users-admin.component';
import { LoadingOverlayComponent } from './components/layout/loading-overlay/loading-overlay.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { AdminBoardComponent } from './components/admin/admin-board/admin-board.component';
import { PricingComponent } from './pages/pricing/pricing.component';

registerLocaleData(localeEsAR, 'es-Ar');


FullCalendarModule.registerPlugins([
	dayGridPlugin,
	listPlugin,
	interactionPlugin,
	timeGridPlugin
])
@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		MeetingCreateFormComponent,
		InicioComponent,
		SignupComponent,
		SignupComponent,
		ErrorComponent,
		MeetingViewDetailComponent,
		MeetingMatchComponent,
		MeetingAdminComponent,
		MeetingMatchValidateComponent,
		MeetingMatchReponseComponent,
		MeetingsBoardComponent,
		SigninComponent,
		MeetingsAdminComponent,
		UsersAdminComponent,
		LoadingOverlayComponent,
		UserProfileComponent,
		AdminBoardComponent,
		PricingComponent,
		

	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FullCalendarModule,
		HttpClientModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ToastrModule.forRoot({timeOut: 15000,
			positionClass: 'toast-bottom-right',
			resetTimeoutOnDuplicate: true,
			progressBar:true,
			iconClasses: {
				error: 'toast-error',
				info: 'toast-info',
				success: 'toast-success',
				warning: 'toast-warning'
				}
			}),
        NgbModule,

	],
	providers: [
		AuthGuard,
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: ErrorHandler,      useClass: ErrorHandlerGlobal},
		{ provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
		{ provide: LOCALE_ID, useValue: 'es-AR' },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
