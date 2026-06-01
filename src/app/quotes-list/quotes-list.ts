import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';
import { Quote, QuotesService } from '../quotes.service';

@Component({
  selector: 'app-quotes-list',
  standalone: true,
  imports: [],
  templateUrl: './quotes-list.html',
  styleUrl: './quotes-list.css'
})
export class QuotesList implements OnInit {
  private quotesService = inject(QuotesService);

  // Signal 1 — raw quotes loaded from API
  quotes = signal<Quote[]>([]);

  // Signal 2 — user's filter input
  filterText = signal('');

  // Signal 3 — current page number
  page = signal(1);

  // Signal 4 — loading state
  loading = signal(false);

  // Computed — derived from quotes + filterText (two signals)
  filteredQuotes = computed(() =>
    this.quotes().filter(q =>
      q.author.toLowerCase().includes(this.filterText().toLowerCase())
    )
  );

  // Computed — derived from filteredQuotes
  displayCount = computed(() => this.filteredQuotes().length);

  // Computed — is the list empty after filtering?
  isEmpty = computed(() => this.filteredQuotes().length === 0);

  constructor() {
    // effect — runs whenever filteredQuotes changes
    effect(() => {
      console.log(
        `Filter: "${this.filterText()}" → showing ${this.displayCount()} of ${this.quotes().length} quotes`
      );
    });
  }

  ngOnInit() {
    this.loadQuotes();
  }

  loadQuotes() {
    this.loading.set(true);
    this.quotesService.getSummary(this.page(), 20).subscribe({
      next: quotes => {
        this.quotes.set(quotes);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
  }

  nextPage() {
    this.page.update(p => p + 1);
    this.loadQuotes();
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.loadQuotes();
    }
  }
}
