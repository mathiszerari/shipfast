import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ProfileGuard } from './guard/profile.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NoAuthGuard } from './guard/no-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuard] },
    ]
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
