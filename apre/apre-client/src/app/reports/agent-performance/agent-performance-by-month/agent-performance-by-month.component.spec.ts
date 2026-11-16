/** Week 4 M-085: Three Angular tests for the monthly report. */
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AgentPerformanceByMonthComponent } from './agent-performance-by-month.component';
import { environment } from '../../../../environments/environment';

describe('AgentPerformanceByMonthComponent (M-085)', () => {
  let http: HttpTestingController;
  let fixture: any;
  const url = `${environment.apiBaseUrl}/reports/agent-performance/by-month`;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPerformanceByMonthComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(AgentPerformanceByMonthComponent);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('renders the monthly report heading', () => {
    fixture.detectChanges();
    http.expectOne(url).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Agent Performance by Month');
  });

  it('maps server metrics to table rows', () => {
    fixture.detectChanges();
    http.expectOne(url).flush([{ year: 2026, month: 2, agent: 'Agent A', totalCalls: 3, totalCallDuration: 180 }]);
    expect(fixture.componentInstance.rows).toEqual([
      { Month: '2026-02', Agent: 'Agent A', 'Total Calls': 3, 'Total Call Duration': 180 }
    ]);
  });

  it('shows an error if the API fails', () => {
    fixture.detectChanges();
    http.expectOne(url).flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('Unable to load monthly agent performance data.');
  });
});
