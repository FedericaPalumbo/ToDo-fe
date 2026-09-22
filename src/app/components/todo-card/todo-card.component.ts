import { Component, input, output } from '@angular/core';  
import { ToDo } from '../../entities';
import { DatePipe } from '@angular/common';  //uso la DatePipe che angular mette a disposizione (vedi 'CurrencyPipe')
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-card',
  imports: [
    DatePipe,
    FormsModule
  ],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.css',
})

export class TodoCardComponent {
  todo = input.required<ToDo>();
  interruttore = output<ToDo>();

  interrutoreCompleted() {
    this.interruttore.emit(this.todo());
  }
  }
 