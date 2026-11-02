
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';
import { SalesDataReportComponent } from './sales-data-report.component';
import { environment } from '../../../../environments/environment';

describe('SalesDataReportComponent', () => {
  let fixture: any;
  let http: HttpTestingController;

  const url = `${environment.apiBaseUrl}/reports/sales/summary`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesDataReportComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesDataReportComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('displays the Sales Data Report heading', () => {
    fixture.detectChanges();

    http.expectOne(url).flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent)
      .toContain('Sales Data Report');
  });

  it('loads sales totals from the API', () => {
    fixture.detectChanges();

    http.expectOne(url).flush([
      { region: 'East', totalSales: 1500, transactionCount: 3 }
    ]);

    expect(fixture.componentInstance.sales).toEqual([
      { Region: 'East', 'Total Sales': 1500, Transactions: 3 }
    ]);
  });

  it('displays an error when the API fails', () => {
    fixture.detectChanges();

    http.expectOne(url).flush('Server error', {
      status: 500,
      statusText: 'Server Error'
    });

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('[role="alert"]').textContent
    ).toContain('Unable to load sales data.');
  });
});
