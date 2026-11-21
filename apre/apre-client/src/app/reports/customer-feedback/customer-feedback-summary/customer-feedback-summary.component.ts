/** Week 4 M-105: Show customer feedback response counts and ratings in APRE. */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

interface CustomerFeedbackSummary {
  channel: string;
  responseCount: number;
  averageRating: number;
}

@Component({
  selector: 'app-customer-feedback-summary',
  standalone: true,
  imports: [TableComponent],
  template: `
    <h1>Customer Feedback Report</h1>
    <p>Survey response counts and average ratings by feedback channel.</p>
    @if (loading) {
      <p>Loading customer feedback...</p>
    } @else if (error) {
      <p role="alert">{{ error }}</p>
    } @else if (rows.length === 0) {
      <p>No customer feedback available.</p>
    } @else {
      <app-table [title]="'Customer Feedback'"
        [headers]="headers" [data]="rows"
        [sortableColumns]="headers" [headerBackground]="'primary'">
      </app-table>
    }
  `
})
export class CustomerFeedbackSummaryComponent implements OnInit {
  headers = ['Channel', 'Responses', 'Average Rating'];
  rows: { Channel: string; Responses: number; 'Average Rating': number }[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // M-105: Map API fields into the existing shared report table.
    this.http.get<CustomerFeedbackSummary[]>(`${environment.apiBaseUrl}/reports/customer-feedback/summary`)
      .subscribe({
        next: data => {
          this.rows = data.map(item => ({
            Channel: item.channel || 'Unspecified',
            Responses: item.responseCount,
            'Average Rating': item.averageRating
          }));
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load customer feedback data.';
          this.loading = false;
        }
      });
  }
}
