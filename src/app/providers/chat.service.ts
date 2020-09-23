import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor( private afs: AngularFirestore, public afAuth: AngularFireAuth ) {

    this.afAuth.authState.subscribe( user => {

      if ( !user ) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  login( proveedor: string ) {
    if ( proveedor === 'google' ) {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5) );

    return this.itemsCollection.valueChanges()
    .pipe( map( (mensajes: Mensaje[]) => {
      this.chats = [];

      for ( let mensaje of mensajes ){
        this.chats.unshift( mensaje );
      }
      return this.chats;
    }));
  }

  agregarMensaje( texto: string ) {
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    return this.itemsCollection.add( mensaje );
  }
}
