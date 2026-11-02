
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo');

describe('M-063 Sales Data Report API', () => {
  beforeEach(() => mongo.mockReset());

  function mockSales(data) {
    mongo.mockImplementation(async callback => {
      const db = {
        collection: jest.fn().mockReturnValue({
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue(data)
          })
        })
      };
      await callback(db);
    });
  }

  it('returns sales totals by region', async () => {
    const data = [
      { region: 'East', totalSales: 1500, transactionCount: 3 }
    ];
    mockSales(data);

    const res = await request(app).get('/api/reports/sales/summary');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
  });

  it('returns an empty array when no sales exist', async () => {
    mockSales([]);

    const res = await request(app).get('/api/reports/sales/summary');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('uses the sales collection to group data by region', async () => {
    const aggregate = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([])
    });
    const collection = jest.fn().mockReturnValue({ aggregate });

    mongo.mockImplementation(async callback => {
      await callback({ collection });
    });

    const res = await request(app).get('/api/reports/sales/summary');

    expect(res.status).toBe(200);
    expect(collection).toHaveBeenCalledWith('sales');
    expect(aggregate.mock.calls[0][0][0].$group).toEqual({
      _id: '$region',
      totalSales: { $sum: '$amount' },
      transactionCount: { $sum: 1 }
    });
  });
});
