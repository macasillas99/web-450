/** Week 3 M-084: Three Angular report tests. */
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AgentPerformanceSummaryComponent } from './agent-performance-summary.component';
import { environment } from '../../../../environments/environment';

describe('AgentPerformanceSummaryComponent (M-084)', () => {
  let http: HttpTestingController;
  let fixture: any;
  const url = `${environment.apiBaseUrl}/reports/agent-performance/summary`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPerformanceSummaryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(AgentPerformanceSummaryComponent);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('displays the agent performance heading', () => {
    fixture.detectChanges();
    http.expectOne(url).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent)
      .toContain('Agent Performance Report');
  });

  it('loads and maps agent performance metrics', () => {
    fixture.detectChanges();
    http.expectOne(url).flush([
      { agent: 'Agent A', totalCalls: 3, totalCallDuration: 180 }
    ]);
    expect(fixture.componentInstance.rows).toEqual([
      { Agent: 'Agent A', 'Total Calls': 3, 'Total Call Duration': 180 }
    ]);
  });

  it('shows a helpful message on API error', () => {
    fixture.detectChanges();
    http.expectOne(url).flush('Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('Unable to load agent performance data.');
  });
});
