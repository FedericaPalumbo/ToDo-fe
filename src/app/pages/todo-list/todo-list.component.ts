/*Leggere commento  a riga 70. Quà 'funziona' ma non va bene: ho messo l'ggiornamento dei dati quando
cambio nel list quando andrebbe strutturato diversamente.

Nel commento la versione con 'router' che dovrebbe essere corretta. Ma che per funzionare dovrei capire come cambiare il service*/
import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoCardComponent } from '../../components/todo-card/todo-card.component';
import { TodoFilterComponent, TodoFilterEvent } from '../../components/todo-filter/todo-filter.component';
import { TodoAddPulsanteComponent, TodoAddEvent } from '../../components/todo-addpulsante/todo-addpulsante.component';
import { AsyncPipe } from '@angular/common';
import {BehaviorSubject,switchMap,tap,shareReplay,} from 'rxjs';

@Component({
  selector: 'app-todo-list',
  imports: [
    TodoCardComponent,
    AsyncPipe,
    TodoFilterComponent,
    TodoAddPulsanteComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent {
  protected todoSrv = inject(TodoService);

  // Filtri correnti: emetto ogni volta che cambiano
  protected filters$ = new BehaviorSubject({
    showCompleted: false,
  });

  // Lista todo, ricarico ogni volta che cambiano i filtri
  todos$ = this.filters$.pipe(
    switchMap((filters) => this.todoSrv.find(filters)),
    shareReplay(1)
  );

  setFilters(filters: TodoFilterEvent) {
    this.filters$.next(filters);
  }

  addTodo(event: TodoAddEvent) {
    this.todoSrv
      .create({ title: event.title, dueDate: event.dueDate })
      .pipe(
        // Dopo la creazione ricarica la lista con i filtri correnti
        tap(() => this.refresh())
      )
      .subscribe();
  }
  refresh(){
    this.filters$.next(this.filters$.getValue())
  }

  toggleTodo(todo: import('../../entities').ToDo) {
    const action$ = todo.completed
      ? this.todoSrv.uncheck(todo.id)
      : this.todoSrv.check(todo.id);

    action$
      .pipe(
        tap(() => this.filters$.next(this.filters$.getValue()))
      )
      .subscribe();
  }
}





/*
Questa sarebbe la versione giusta con il router che ho basato sull'esercizio in classe,
ma non sono riuscita a capire come sistemare il service del front end per fargli aggiornare le chiamate ogni volta
che i dati vengono modificati.
Per ora ho 'risolto' mettendo l'aggiornamento nel list ma non volevo affidare questa attività a questo file, perchè non lo riguarda.
Versione 'migliore' ->


import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoCardComponent } from '../../components/todo-card/todo-card.component';
import { TodoFilterComponent, TodoFilterEvent } from '../../components/todo-filter/todo-filter.component';
import { TodoAddPulsanteComponent, TodoAddEvent } from '../../components/todo-addpulsante/todo-addpulsante.component';
import { AsyncPipe } from '@angular/common';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { omitBy } from 'lodash';
import {ToDo} from '../../entities';

@Component({
  selector: 'app-todo-list',
  imports: [
    TodoCardComponent,
    AsyncPipe,
    TodoFilterComponent,
    TodoAddPulsanteComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent {
  protected todoSrv = inject(TodoService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

  protected filters$ = this.activatedRoute.queryParams
  .pipe(
    map(params => ({
      showCompleted: params['showCompleted'] === 'true'
    }))
  );

  todos$ = this.filters$
  .pipe(
    startWith({}),
    debounceTime(250),
    switchMap(filters => this.todoSrv.find(filters))
  );

 addTodo(event: TodoAddEvent) {
    this.todoSrv
      .create({ title: event.title, dueDate: event.dueDate })
      .subscribe();
  }

  setFilters(filters: TodoFilterEvent) {   //OK
    const q = omitBy(filters, val => val === '' || val === null);
    this.router.navigate([], { queryParams: q });
  }

 
  toggleTodo(todo: ToDo) {
    const action$ = todo.completed
      ? this.todoSrv.uncheck(todo.id)
      : this.todoSrv.check(todo.id);

    action$.subscribe();
  }
}*/