import { Component, inject, output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoAddComponent } from '../todo-add/todo-add.component';

export type TodoAddEvent = {
  title: string;
  dueDate?: string;
}

@Component({
  selector: 'app-todo-addpulsante',
  templateUrl: './todo-addpulsante.component.html',
  styleUrl: './todo-addpulsante.component.css',
})
export class TodoAddPulsanteComponent {
  private modalService = inject(NgbModal);

  todoAdded = output<TodoAddEvent>();

  openModal() {
    const modalRef = this.modalService.open(TodoAddComponent);

    modalRef.result.then(
      (result: TodoAddEvent) => {
        this.todoAdded.emit(result);
      },
      () => {
        // dismissed, non fare nulla
      }
    );
  }
}