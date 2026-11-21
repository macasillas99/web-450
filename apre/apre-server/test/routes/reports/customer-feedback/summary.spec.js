/** Week 4 M-105: Three API unit tests for the customer feedback report. */
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');
jest.mock('../../../../src/utils/mongo');

describe('M-105 Customer Feedback Report API', () => {
  beforeEach(() => mongo.mockReset());

  it('returns grouped customer feedback statistics', async () => {
    mongo.mockImplementation(async callback => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            { channel: 'Email', responseCount: 5, averageRating: 4.2 }
          ])
        })
      };
      await callback(db);
      expect(db.collection).toHaveBeenCalledWith('customerFeedback');
      const pipeline = db.aggregate.mock.calls[0][0];
      expect(pipeline.some(stage => stage.$group && stage.$group.responseCount && stage.$group.averageRating)).toBe(true);
    });
    const response = await request(app).get('/api/reports/customer-feedback/summary');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { channel: 'Email', responseCount: 5, averageRating: 4.2 }
    ]);
  });

  it('returns an empty list when feedback is unavailable', async () => {
    mongo.mockImplementation(async callback => {
      await callback({ collection: () => ({ aggregate: () => ({ toArray: async () => [] }) }) });
    });
    const response = await request(app).get('/api/reports/customer-feedback/summary');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns HTTP 500 when the database fails', async () => {
    mongo.mockImplementation(async (callback, next) => next(new Error('Database unavailable')));
    const response = await request(app).get('/api/reports/customer-feedback/summary');
    expect(response.status).toBe(500);
    expect(response.body.status).toBe(500);
  });
});
