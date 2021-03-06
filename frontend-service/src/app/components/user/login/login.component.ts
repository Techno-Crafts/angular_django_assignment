import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import {ApputilsService} from './../../../apputils.service'
import {AuthService} from './../../../auth.service'
import {Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  username = new FormControl('');
  password = new FormControl('');
  constructor(
    public apputils: ApputilsService,
    public router: Router,
    public auth: AuthService
  ) {
    let currUser = this.apputils.getLocalStorage('username');
    if (currUser!='guest'){
      console.log('no action needed');
      let token_data = {
        refresh: this.apputils.getLocalStorage('refreshToken') || ''
      }
      this.auth.getAccessTokenUsingRefreshToken(token_data)
      .subscribe((resopnse)=>{
        console.log(resopnse)
        this.auth.isLoggedIn = true;
      })
    }else{
      console.log('redirecting to login page for Auth');
      this.router.navigate(['/login']);

    }

  }
  login(){
    let user = this.username.value;
    let pass = this.password.value;
    console.log(user, pass);
    this.auth.getlogin({username:user, password:pass})
      .subscribe((response)=>{
        console.log(response)
        this.apputils.setLocalStorage('accessToken', response['access'])
        this.apputils.setLocalStorage('refreshToken', response['refresh'])
        this.apputils.setLocalStorage('isAuthenticated', true)
        this.apputils.setLocalStorage('username', user)
        this.router.navigate(['/products']);


      })
  }
  ngOnInit() {
  }

}
