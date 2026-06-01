import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Quote {
  id: number;
  author: string;
  authorInitials: string;
  shortText: string;
}

@Injectable({ providedIn: 'root' })
export class QuotesService {
  // inject() instead of constructor injection — modern Angular style
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:5150';

  getSummary(page: number, size: number) {
    return this.http.get<Quote[]>(
      `${this.baseUrl}/api/quotes/summary?page=${page}&size=${size}`
    );
  }
}
