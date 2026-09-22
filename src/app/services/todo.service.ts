import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDo } from '../entities';

export type TodoFilter = {
  showCompleted?: boolean | null;
}

export type TodoCreateRequest = {
  title: string;
  dueDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);

  find(filters: TodoFilter = {}) {
    const q: Record<string, string> = {};
    if (filters.showCompleted) {
      q['showCompleted'] = 'true';
    }
    return this.http.get<ToDo[]>('/api/todos', { params: q });
  }

  create(request: TodoCreateRequest) {
    return this.http.post<ToDo>('/api/todos', request);
  }

  check(id: string) {
    return this.http.patch<ToDo>(`/api/todos/${id}/check`, {});
  }

  uncheck(id: string) {
    return this.http.patch<ToDo>(`/api/todos/${id}/uncheck`, {});
  }
}