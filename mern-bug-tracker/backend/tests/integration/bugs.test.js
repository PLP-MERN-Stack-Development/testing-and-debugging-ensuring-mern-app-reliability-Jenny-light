import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/server.js';
import Bug from '../../src/models/Bug.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Bug.deleteMany({});
});

describe('Bug API Endpoints', () => {
  describe('GET /api/bugs', () => {
    test('should return empty array when no bugs exist', async () => {
      const res = await request(app).get('/api/bugs');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.count).toBe(0);
    });

    test('should return all bugs', async () => {
      await Bug.create([
        { title: 'Bug 1', description: 'Desc 1', reportedBy: 'User1' },
        { title: 'Bug 2', description: 'Desc 2', reportedBy: 'User2' }
      ]);

      const res = await request(app).get('/api/bugs');
      
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.count).toBe(2);
    });
  });

  describe('POST /api/bugs', () => {
    test('should create a new bug', async () => {
      const newBug = {
        title: 'Test Bug',
        description: 'Test Description',
        priority: 'high',
        reportedBy: 'Tester'
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(newBug);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newBug.title);
      expect(res.body.data.status).toBe('open');
    });

    test('should fail without required fields', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should reject invalid status', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send({
          title: 'Bug',
          description: 'Desc',
          status: 'invalid-status',
          reportedBy: 'User'
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    test('should update bug status', async () => {
      const bug = await Bug.create({
        title: 'Bug',
        description: 'Desc',
        reportedBy: 'User'
      });

      const res = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send({ status: 'resolved' });
      
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('resolved');
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({ status: 'resolved' });
      
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    test('should delete a bug', async () => {
      const bug = await Bug.create({
        title: 'Bug to Delete',
        description: 'Desc',
        reportedBy: 'User'
      });

      const res = await request(app).delete(`/api/bugs/${bug._id}`);
      
      expect(res.status).toBe(200);
      
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });
  });
});