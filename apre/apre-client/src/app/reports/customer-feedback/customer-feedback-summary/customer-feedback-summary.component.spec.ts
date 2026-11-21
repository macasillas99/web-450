/** Week 4 M-105: Three Angular component tests for customer feedback. */
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CustomerFeedbackSummaryComponent } from './customer-feedback-summary.component';
import { environment } from '../../../../environments/environment';

describe('CustomerFeedbackSummaryComponent (M-105)', () => {
  let http: HttpTestingController;
  let fixture: any;
  const url = `${environment.apiBaseUrl}/reports/customer-feedback/summary`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFeedbackSummaryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(CustomerFeedbackSummaryComponent);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('displays the Customer Feedback Report title', () => {
    fixture.detectChanges();
    http.expectOne(url).flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent)
      .toContain('Customer Feedback Report');
  });

  it('displays response counts and average ratings from the API', () => {
    fixture.detectChanges();
    http.expectOne(url).flush([
      { channel: 'Email', responseCount: 5, averageRating: 4.2 }
    ]);
    expect(fixture.componentInstance.rows).toEqual([
      { Channel: 'Email', Responses: 5, 'Average Rating': 4.2 }
    ]);
  });

  it('shows an error message when the API fails', () => {
    fixture.detectChanges();
    http.expectOne(url).flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('Unable to load customer feedback data.');
  });
});
