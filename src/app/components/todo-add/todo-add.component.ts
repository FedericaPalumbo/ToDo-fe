/*Non abbiamo ancora fatto il modal in classe. Sulla documentazione da come ho capito
c'è una differenziazione tra NgbActiveModal (che andrebbe messo nella struttura del modal
per quando è 'attualmente aperto') e ngbmodal (per quando invece lo si vuole aprire(che io lo messo nel pulsante add )).

Non so se ho capito bene ma ci ho provato*/

import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-todo-add',
  imports: [ReactiveFormsModule, NgbDatepicker],
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.css',
})

export class TodoAddComponent {
  protected fb = inject(FormBuilder);
  activeModal = inject(NgbActiveModal);

  addForm = this.fb.group({
    title: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
    dueDate: new FormControl<NgbDateStruct | null>(null) //tipo NgbDateStruct (oggetto { year, month, day }) oppure null (perchè non è obbligatoria)
  });

submit() { //Quando la persona invia il form del modal
  if (this.addForm.invalid) return; //anche se il pulsante resta disattivato (graficamente) da lato utente. Per aumentare la sicurezza preferisco aggiungere un controllo anche nel ts (html potrebbe essere manipolabile dall'utente da console)

  //se il form inviato è valido:
  const { title, dueDate } = this.addForm.getRawValue();

  // Converte NgbDateStruct in string (se presente) 
  const dueDateString = dueDate
    ? `${dueDate.year}-${String(dueDate.month).padStart(2, '0')}-${String(dueDate.day).padStart(2, '0')}` //converto in string perchè dueDate nel ApiServer è string
                             // NgbDateStruct restituisce un oggetto con tre numeri interi  {yyyy: 2025, mm: 3, dd: 7 }.
                             // Senza .padStart, la conversione in string sarebbe "2025-3-7" invece di "2025-03-07"
   : undefined; //data non è obbligatoria
  
   this.activeModal.close({ title, dueDate: dueDateString });
}
}