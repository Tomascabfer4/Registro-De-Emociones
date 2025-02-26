import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastController, PickerController } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem,
  IonRange, IonCardContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonList, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { EmocionesService } from '../emociones.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Necesario para usar FormGroup
    IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonCardContent,
    IonItem, IonRange, IonButton, IonCard, IonCardHeader, IonCardTitle, IonList,
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
  emocionesSeleccionadas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private emocionesService: EmocionesService,
    private toastController: ToastController,
    private pickerCtrl: PickerController
  ) {
    this.emocionesForm = this.fb.group({
      curso: ['', Validators.required],
      asignatura: ['', Validators.required],
      actividad: ['', Validators.required]
    });
  }

  async abrirPicker(tipo: string) {
    let opciones: string[] = [];

    switch (tipo) {
      case 'curso': opciones = this.cursos; break;
      case 'asignatura': opciones = this.asignaturas; break;
      case 'actividad': opciones = this.actividades; break;
      case 'emocion': opciones = this.listaEmociones; break;
    }

    const picker = await this.pickerCtrl.create({
      columns: [{
        name: tipo,
        options: opciones.map(opcion => ({ text: opcion, value: opcion })),
        align: 'center'
      }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Seleccionar', handler: (value) => this.emocionesForm.controls[tipo].setValue(value[tipo].value) }
      ],
      cssClass: 'custom-picker'
    });

    await picker.present();
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

  agregarEmocion() {
    if (this.emocionesForm.valid && this.emocionesSeleccionadas.length > 0) {
      this.emocionesSeleccionadas.forEach(emocion => {
        const emocionAEnviar = {
          curso: this.emocionesForm.value.curso,
          asignatura: this.emocionesForm.value.asignatura,
          actividad: this.emocionesForm.value.actividad,
          emocion: emocion.nombre,
          rango: emocion.rango
        };

        // Guardar directamente en Firebase
        this.emocionesService.agregarEmocion(emocionAEnviar)
          .then(() => this.showToast('✅ Emoción guardada correctamente.'))
          .catch(error => this.showToast('❌ Error al guardar la emoción.'));
      });

      this.emocionesSeleccionadas = [];
    } else {
      this.showToast("⚠️ Todos los campos y al menos una emoción son obligatorios.");
    }
  }

  enviarEmocionesAFirebase() {
    if (this.emocionesGuardadas.length === 0) {
      this.showToast("⚠️ No hay emociones para enviar.");
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