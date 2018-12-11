import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import {map} from 'rxjs/operators';

import { User } from './user.model';
import Swal from 'sweetalert2';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();

  constructor(private afAuth:AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store:Store<AppState> ) { }

    initAuthListener(){

      this.userSubscription = this.afAuth.authState.subscribe((fbUser: firebase.User) =>{
          if(fbUser){

            this.afDB.doc(`${ fbUser.uid }/usuario`).valueChanges()
            .subscribe( (usuarioObj:any) => {
              //console.log(usuarioObj);
              const newUser = new User(usuarioObj);
              console.log(newUser);
              this.store.dispatch(new SetUserAction(newUser));
            })

          }else{
            this.userSubscription.unsubscribe();
          }
      });

    }


  crearUsuario(nombre:string, email:string, password:string){

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth.createUserWithEmailAndPassword(email,password)
    .then(resp =>{

        const user: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email
        };

        this.afDB.doc(`${ user.uid }/usuario`)
        .set(user)
        .then( ()=>{
          this.router.navigate(['/']);
          this.store.dispatch(new DesactivarLoadingAction());
        })
        .catch(error => {
          console.error(error);
          Swal('Error en el login', error.message,'error');
        })


        // console.log(resp);
    })
    .catch(error =>{
      console.error(error);
      this.store.dispatch(new DesactivarLoadingAction());
      Swal('Error en el login', error.message,'error');
    })

  }


  login(email:string, password:string){

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth.signInWithEmailAndPassword(email,password)
    .then(resp =>{
      // console.log(resp);
      
      this.router.navigate(['/']);
      this.store.dispatch(new DesactivarLoadingAction());
    })
    .catch(error =>{
      console.error(error);
      this.store.dispatch(new DesactivarLoadingAction());
      Swal('Error en el login', error.message,'error');
    })

  }


  logout(){
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth(){
    return this.afAuth.authState
    .pipe(
      map( fbUser => {
        
        if(fbUser == null){
          this.router.navigate(['/login']);
          
        }

        return fbUser != null;
       
      })
    );
  }




}
