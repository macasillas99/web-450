/** Week 4 M-085: Display monthly agent performance using the shared table. */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

interface MonthlyPerformance {
  year: number; month: number; agent: string; totalCalls: number; totalCallDuration: number;
}

@Component({
  selector: 'app-agent-performance-by-month',
  standalone: true,
  imports: [TableComponent],
  template: `
    <h1>Agent Performance by Month</h1>
    <p>Call totals and durations grouped by month and agent.</p>
    @if (loading) { <p>Loading monthly performance...</p> }
    @else if (error) { <p role="alert">{{ error }}</p> }
    @else if (rows.length === 0) { <p>No monthly agent performance data available.</p> }
    @else {
      <app-table [title]="'Monthly Agent Performance'" [headers]="headers"
        [data]="rows" [sortableColumns]="headers" [headerBackground]="'primary'">
      </app-table>
    }
  `
})
export class AgentPerformanceByMonthComponent implements OnInit {
  headers = ['Month', 'Agent', 'Total Calls', 'Total Call Duration'];
  rows: { Month: string; Agent: string; 'Total Calls': number; 'Total Call Duration': number }[] = [];
  loading = true;
  error = '';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Convert numeric year and month into readable sortable report labels.
    this.http.get<MonthlyPerformance[]>(`${environment.apiBaseUrl}/reports/agent-performance/by-month`)
      .subscribe({
        next: data => {
          this.rows = data.map(item => ({
            Month: `${item.year}-${String(item.month).padStart(2, '0')}`,
            Agent: item.agent, 'Total Calls': item.totalCalls,
            'Total Call Duration': item.totalCallDuration
          }));
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load monthly agent performance data.';
          this.loading = false;
        }
      });
  }
}
