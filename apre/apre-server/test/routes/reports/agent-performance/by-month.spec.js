/** Week 4 M-085: Three API tests for the agent performance by month report. */
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');
jest.mock('../../../../src/utils/mongo');

describe('M-085 Monthly Agent Performance API', () => {
  beforeEach(() => mongo.mockReset());

  it('groups results by year, month and agent', async () => {
    mongo.mockImplementation(async callback => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            { year: 2026, month: 2, agent: 'Agent A', totalCalls: 3, totalCallDuration: 180 }
          ])
        })
      };
      await callback(db);
      expect(db.collection).toHaveBeenCalledWith('agentPerformance');
      const pipeline = db.aggregate.mock.calls[0][0];
      expect(pipeline.some(stage => stage.$group && stage.$group._id.year && stage.$group._id.month)).toBe(true);
    });
    const res = await request(app).get('/api/reports/agent-performance/by-month');
    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ year: 2026, month: 2, totalCalls: 3 });
  });

  it('returns an empty array when no records exist', async () => {
    mongo.mockImplementation(async callback => {
      await callback({ collection: () => ({ aggregate: () => ({ toArray: async () => [] }) }) });
    });
    const res = await request(app).get('/api/reports/agent-performance/by-month');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns HTTP 500 when the database fails', async () => {
    mongo.mockImplementation(async (callback, next) => next(new Error('Database unavailable')));
    const res = await request(app).get('/api/reports/agent-performance/by-month');
    expect(res.status).toBe(500);
    expect(res.body.status).toBe(500);
  });
});
