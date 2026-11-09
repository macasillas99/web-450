/** Week 3 M-084: Three API tests for agent performance summary. */
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');
jest.mock('../../../../src/utils/mongo');

describe('M-084 Agent Performance Summary API', () => {
  beforeEach(() => mongo.mockReset());

  it('returns grouped agent performance data', async () => {
    mongo.mockImplementation(async callback => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            { agent: 'Agent A', totalCalls: 3, totalCallDuration: 180 }
          ])
        })
      };
      await callback(db);
      expect(db.collection).toHaveBeenCalledWith('agentPerformance');
      const stages = db.aggregate.mock.calls[0][0];
      expect(stages.some(stage => stage.$group && stage.$group.totalCalls)).toBe(true);
    });
    const response = await request(app).get('/api/reports/agent-performance/summary');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { agent: 'Agent A', totalCalls: 3, totalCallDuration: 180 }
    ]);
  });

  it('returns an empty list when no records exist', async () => {
    mongo.mockImplementation(async callback => {
      await callback({
        collection: () => ({
          aggregate: () => ({ toArray: async () => [] })
        })
      });
    });
    const response = await request(app).get('/api/reports/agent-performance/summary');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('propagates database errors as HTTP 500', async () => {
    mongo.mockImplementation(async (callback, next) => next(new Error('Database unavailable')));
    const response = await request(app).get('/api/reports/agent-performance/summary');
    expect(response.status).toBe(500);
    expect(response.body.status).toBe(500);
  });
});
