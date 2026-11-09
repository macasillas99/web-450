/** Week 3 M-084: Show per-agent call counts and total call durations in a report. */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

interface AgentPerformance {
  agent: string;
  totalCalls: number;
  totalCallDuration: number;
}

@Component({
  selector: 'app-agent-performance-summary',
  standalone: true,
  imports: [TableComponent],
  template: `
    <h1>Agent Performance Report</h1>
    <p>Total calls and call duration by agent.</p>
    @if (loading) {
      <p>Loading agent performance...</p>
    } @else if (error) {
      <p role="alert">{{ error }}</p>
    } @else if (rows.length === 0) {
      <p>No agent performance data available.</p>
    } @else {
      <app-table
        [title]="'Agent Performance'"
        [headers]="headers"
        [data]="rows"
        [sortableColumns]="headers"
        [headerBackground]="'primary'">
      </app-table>
    }
  `
})
export class AgentPerformanceSummaryComponent implements OnInit {
  headers = ['Agent', 'Total Calls', 'Total Call Duration'];
  rows: { Agent: string; 'Total Calls': number; 'Total Call Duration': number }[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // M-084: Load report data once and map API fields into readable table headings.
    this.http.get<AgentPerformance[]>(`${environment.apiBaseUrl}/reports/agent-performance/summary`)
      .subscribe({
        next: data => {
          this.rows = data.map(row => ({
            Agent: row.agent,
            'Total Calls': row.totalCalls,
            'Total Call Duration': row.totalCallDuration
          }));
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load agent performance data.';
          this.loading = false;
        }
      });
  }
}
