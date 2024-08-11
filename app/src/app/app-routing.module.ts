import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ProfileGuard } from './guard/profile.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { NoAuthGuard } from './guard/no-auth.guard';
import { UsernameCreationComponent } from './components/auth/username-creation/username-creation.component';
import { GithubPortalComponent } from './components/portal/github-portal/github-portal.component';
import { ProfileComponent } from './components/profile/profile/profile.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'github-portal',
    component: GithubPortalComponent,
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard] },
    ]
  },
  {
    path: 'username-creation',
    component: UsernameCreationComponent,
  },
  {
    path: ':username',
    component: ProfileComponent,
    canActivate: [ProfileGuard],
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
