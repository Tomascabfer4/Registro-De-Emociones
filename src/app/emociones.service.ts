import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmocionesService {
  private collectionName = 'emociones';

  constructor(private firestore: Firestore) { }

  agregarEmocion(emocion: any): Promise<void> {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, emocion)
      .then(() => {
        console.log('✅ Emoción agregada con éxito:', emocion);
      })
      .catch((error) => {
        console.error('❌ Error al insertar emoción:', error);
      });
  }
}
