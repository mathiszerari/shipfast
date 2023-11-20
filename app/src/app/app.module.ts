import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/home/header/header.component';
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DisplayProfileComponent } from './components/profile/display-profile/display-profile.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { UsernameCreationComponent } from './components/auth/username-creation/username-creation.component';
import { GithubPortalComponent } from './components/portal/github-portal/github-portal.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    UsernameCreationComponent,
    GithubPortalComponent,
    ProfileComponent,
    DisplayProfileComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }