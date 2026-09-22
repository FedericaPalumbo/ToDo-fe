import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
/* Non serve più updateOn: 'submit' né validators pk la checkbox deve reagire immediatamente al cambio, senza bottone di submit. */
export type TodoFilterEvent = {
  showCompleted: boolean
}

@Component({
  selector: 'app-todo-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-filter.component.html',
  styleUrl: './todo-filter.component.css',
})
export class TodoFilterComponent {
  protected destroyed$ = new Subject<void>();
  protected fb = inject(FormBuilder);

  filters = input<TodoFilterEvent>();

  filterChange = output<TodoFilterEvent>();

  filterForm = this.fb.group({
    showCompleted: new FormControl<boolean>(false)
  });

  constructor() {
    effect(() => {
      const value = this.filters();
      if (value) {
        this.filterForm.patchValue(value, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$))
      .subscribe(filter => {
        this.filterChange.emit({ showCompleted: filter.showCompleted ?? false });  //con i ?? uso il valore di sinistra, ma
        // se è null o undefined uso il valore di destra 
        // cioè: prendo filter.showCompleted, ma se è null o undefined uso false

        //Con || il fallback scatterebbe anche quando la checkbox è false (non spuntata)
      });
  }
  
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}