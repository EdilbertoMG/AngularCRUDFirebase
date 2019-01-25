import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

export interface Item { name: string; }

@Injectable({
  providedIn: 'root'
})
export class ConexionService {


  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  private itemDoc: AngularFirestoreDocument<Item>;

  constructor(private afs: AngularFirestore) { 
    this.itemsCollection = afs.collection<Item>('items');
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  listaItem(){
    return this.items; // lista los items
  }
  agregarItem(item: Item) {
    this.itemsCollection.add(item); // agrega items a la db
  }
  eliminarItem(item){ // traemos el item de nuestro componente
    this.itemDoc = this.afs.doc<Item>(`items/${item.id}`); // y guardamos el el id del item especifico a borrar en itemDoc
    this.itemDoc.delete(); //le decimos al itemDoc que borre ese registro con el id pasado
  }
  editarItem(item){ // traemos el item de nuestro componente
    this.itemDoc = this.afs.doc<Item>(`items/${item.id}`); // y guardamos el el id del item especifico a borrar en itemDoc
    this.itemDoc.update(item); //le decimos al itemDoc que edite ese registro con el id pasado
  }
}
