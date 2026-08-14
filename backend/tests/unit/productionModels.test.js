const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const EggProduction = require('../../src/models/EggProduction');
const BroilerGrowth = require('../../src/models/BroilerGrowth');
const FeedConsumption = require('../../src/models/FeedConsumption');
const Mortality = require('../../src/models/Mortality');
const ProductionRecord = require('../../src/models/ProductionRecord');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('EggProduction Model', () => {
  it('should create an egg production record with valid fields', async () => {
    const record = await EggProduction.create({
      date: new Date('2024-01-15'),
      count: 250,
    });

    expect(record.date).toEqual(new Date('2024-01-15'));
    expect(record.count).toBe(250);
    expect(record.createdAt).toBeInstanceOf(Date);
    expect(record.updatedAt).toBeInstanceOf(Date);
  });

  it('should enforce unique date constraint', async () => {
    await EggProduction.create({ date: new Date('2024-01-15'), count: 200 });
    await expect(
      EggProduction.create({ date: new Date('2024-01-15'), count: 300 })
    ).rejects.toThrow();
  });

  it('should enforce minimum count of 1', async () => {
    await expect(
      EggProduction.create({ date: new Date('2024-01-15'), count: 0 })
    ).rejects.toThrow();
  });

  it('should reject negative count', async () => {
    await expect(
      EggProduction.create({ date: new Date('2024-01-15'), count: -5 })
    ).rejects.toThrow();
  });

  it('should fail without required fields', async () => {
    await expect(EggProduction.create({})).rejects.toThrow();
    await expect(EggProduction.create({ date: new Date() })).rejects.toThrow();
    await expect(EggProduction.create({ count: 100 })).rejects.toThrow();
  });
});

describe('BroilerGrowth Model', () => {
  it('should create a broiler growth record with valid fields', async () => {
    const record = await BroilerGrowth.create({
      batchId: 'BATCH-001',
      week: 3,
      weight: 1.5,
    });

    expect(record.batchId).toBe('BATCH-001');
    expect(record.week).toBe(3);
    expect(record.weight).toBe(1.5);
    expect(record.createdAt).toBeInstanceOf(Date);
  });

  it('should enforce compound unique index on batchId + week', async () => {
    await BroilerGrowth.create({ batchId: 'BATCH-001', week: 1, weight: 0.5 });
    await expect(
      BroilerGrowth.create({ batchId: 'BATCH-001', week: 1, weight: 0.8 })
    ).rejects.toThrow();
  });

  it('should allow same week in different batches', async () => {
    await BroilerGrowth.create({ batchId: 'BATCH-001', week: 1, weight: 0.5 });
    const record = await BroilerGrowth.create({ batchId: 'BATCH-002', week: 1, weight: 0.6 });
    expect(record.batchId).toBe('BATCH-002');
  });

  it('should enforce minimum week of 1', async () => {
    await expect(
      BroilerGrowth.create({ batchId: 'BATCH-001', week: 0, weight: 1.0 })
    ).rejects.toThrow();
  });

  it('should enforce minimum weight of 0.01', async () => {
    await expect(
      BroilerGrowth.create({ batchId: 'BATCH-001', week: 1, weight: 0 })
    ).rejects.toThrow();
  });

  it('should fail without required fields', async () => {
    await expect(BroilerGrowth.create({})).rejects.toThrow();
    await expect(BroilerGrowth.create({ batchId: 'B1' })).rejects.toThrow();
    await expect(BroilerGrowth.create({ batchId: 'B1', week: 1 })).rejects.toThrow();
  });
});

describe('FeedConsumption Model', () => {
  it('should create a feed consumption record with valid fields', async () => {
    const record = await FeedConsumption.create({
      date: new Date('2024-02-10'),
      amount: 2.5,
      houseId: 'HOUSE-A',
    });

    expect(record.date).toEqual(new Date('2024-02-10'));
    expect(record.amount).toBe(2.5);
    expect(record.houseId).toBe('HOUSE-A');
    expect(record.createdAt).toBeInstanceOf(Date);
  });

  it('should enforce minimum amount of 0.01', async () => {
    await expect(
      FeedConsumption.create({ date: new Date(), amount: 0, houseId: 'H1' })
    ).rejects.toThrow();
  });

  it('should reject negative amount', async () => {
    await expect(
      FeedConsumption.create({ date: new Date(), amount: -1, houseId: 'H1' })
    ).rejects.toThrow();
  });

  it('should fail without required fields', async () => {
    await expect(FeedConsumption.create({})).rejects.toThrow();
    await expect(FeedConsumption.create({ date: new Date() })).rejects.toThrow();
    await expect(
      FeedConsumption.create({ date: new Date(), amount: 1.0 })
    ).rejects.toThrow();
  });
});

describe('Mortality Model', () => {
  it('should create a mortality record with valid fields', async () => {
    const record = await Mortality.create({
      date: new Date('2024-03-05'),
      count: 3,
      cause: 'Heat stress',
    });

    expect(record.date).toEqual(new Date('2024-03-05'));
    expect(record.count).toBe(3);
    expect(record.cause).toBe('Heat stress');
    expect(record.createdAt).toBeInstanceOf(Date);
  });

  it('should allow cause to be optional', async () => {
    const record = await Mortality.create({
      date: new Date('2024-03-06'),
      count: 1,
    });

    expect(record.cause).toBeUndefined();
  });

  it('should enforce minimum count of 1', async () => {
    await expect(
      Mortality.create({ date: new Date(), count: 0 })
    ).rejects.toThrow();
  });

  it('should reject negative count', async () => {
    await expect(
      Mortality.create({ date: new Date(), count: -2 })
    ).rejects.toThrow();
  });

  it('should fail without required fields', async () => {
    await expect(Mortality.create({})).rejects.toThrow();
    await expect(Mortality.create({ date: new Date() })).rejects.toThrow();
    await expect(Mortality.create({ count: 5 })).rejects.toThrow();
  });
});

describe('ProductionRecord Model', () => {
  it('should create a production record with valid fields', async () => {
    const record = await ProductionRecord.create({
      date: new Date('2024-04-01'),
      eggsProduced: 1200,
      birdsAvailable: 500,
      feedStockTonnes: 3.5,
    });

    expect(record.date).toEqual(new Date('2024-04-01'));
    expect(record.eggsProduced).toBe(1200);
    expect(record.birdsAvailable).toBe(500);
    expect(record.feedStockTonnes).toBe(3.5);
    expect(record.createdAt).toBeInstanceOf(Date);
  });

  it('should default numeric fields to 0', async () => {
    const record = await ProductionRecord.create({
      date: new Date('2024-04-02'),
    });

    expect(record.eggsProduced).toBe(0);
    expect(record.birdsAvailable).toBe(0);
    expect(record.feedStockTonnes).toBe(0);
  });

  it('should fail without required date field', async () => {
    await expect(ProductionRecord.create({})).rejects.toThrow();
  });
});
