
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

interface SalesSummaryRow {
  Region: string;
  'Total Sales': number;
  Transactions: number;
}

@Component({
  selector: 'app-sales-data-report',
  standalone: true,
  imports: [TableComponent],
  template: `
    <h1>Sales Data Report</h1>
    <p>Sales totals and transaction counts by region.</p>

    @if (loading) {
      <p>Loading sales data...</p>
    } @else if (error) {
      <p role="alert">{{ error }}</p>
    } @else if (sales.length === 0) {
      <p>No sales data available.</p>
    } @else {
      <app-table
        [title]="'Sales by Region'"
        [headers]="headers"
        [data]="sales"
        [sortableColumns]="headers"
        [headerBackground]="'primary'">
      </app-table>
    }
  `
})
export class SalesDataReportComponent implements OnInit {
  headers = ['Region', 'Total Sales', 'Transactions'];
  sales: SalesSummaryRow[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // M-063: Fetch sales totals and format them for the shared table.
    this.http.get<{
      region: string;
      totalSales: number;
      transactionCount: number;
    }[]>(`${environment.apiBaseUrl}/reports/sales/summary`)
      .subscribe({
        next: data => {
          this.sales = data.map(item => ({
            Region: item.region,
            'Total Sales': item.totalSales,
            Transactions: item.transactionCount
          }));
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load sales data.';
          this.loading = false;
        }
      });
  }
}
