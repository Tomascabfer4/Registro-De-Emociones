// home.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem,
  IonRange, IonCardContent, IonButton, IonCard, IonCardHeader, IonCardTitle,
  IonList, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { EmocionesService } from '../emociones.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonLabel, IonItem, IonRange, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonButton, IonList,
    IonSelect, IonSelectOption
  ],
})
export class HomePage {
  emocionesForm: FormGroup;
  emocionesGuardadas: any[] = [];
  cursos = ['1º ESO', '2º ESO', '3º ESO', '4º ESO', '1º Bachillerato', '2º Bachillerato'];
  asignaturas = ['Matemáticas', 'Lengua', 'Ciencias', 'Inglés', 'Francés', 'Informática', 'Física', 'Química', 'E. Física', 'Historia', 'Economía'];
  actividades = ['Examen', 'Examen Oral', 'Examen Sorpresa', 'Práctica Presencial', 'Práctica a distancia', 'Trabajo de clase', 'Trabajo en grupo', 'Presentación'];
  listaEmociones = ['Feliz', 'Triste', 'Ansioso', 'Motivado', 'Nervioso', 'Miedo', 'Enfado', 'Vergüenza', 'Asco', 'Frustración', 'Orgullo'];
  emocionesSeleccionadas: { nombre: string; rango: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private emocionesService: EmocionesService,
    private toastController: ToastController
  ) {
    this.emocionesForm = this.fb.group({
      curso: ['', Validators.required],
      asignatura: ['', Validators.required],
      actividad: ['', Validators.required]
    });
  }

  agregarCampoEmocion() {
    this.emocionesSeleccionadas.push({ nombre: '', rango: 0 });
  }

  actualizarEmocion(index: number, event: any) {
    this.emocionesSeleccionadas[index].nombre = event.detail.value;
  }

  actualizarValoracion(index: number, event: any) {
    this.emocionesSeleccionadas[index].rango = event.detail.value;
  }

  async agregarEmocion() {
    if (this.emocionesForm.valid && this.emocionesSeleccionadas.length > 0) {
      for (const emocion of this.emocionesSeleccionadas) {
        const emocionAEnviar = {
          curso: this.emocionesForm.value.curso,
          asignatura: this.emocionesForm.value.asignatura,
          actividad: this.emocionesForm.value.actividad,
          emocion: emocion.nombre,
          rango: emocion.rango
        };
        try {
          await this.emocionesService.agregarEmocion(emocionAEnviar);
          this.showToast('✅ Emoción guardada correctamente.');
        } catch {
          this.showToast('❌ Error al guardar la emoción.');
        }
      }
      this.emocionesSeleccionadas = [];
    } else {
      this.showToast('⚠️ Todos los campos y al menos una emoción son obligatorios.');
    }
  }

  enviarEmocionesAFirebase() {
    if (!this.emocionesGuardadas.length) {
      this.showToast('⚠️ No hay emociones para enviar.');
      return;
    }
    this.showToast('✅ Todas las emociones han sido guardadas');
    this.emocionesGuardadas = [];
  }

  private showToast(message: string) {
    this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    }).then(toast => toast.present());
  }
}
