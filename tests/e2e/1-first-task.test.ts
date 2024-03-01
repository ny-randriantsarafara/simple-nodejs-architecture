const request = require('supertest');

import app from '../../src/app';

import Problem from '../../src/entities/problem.entity';
import Issue from '../../src/entities/issue.entity';

const ISSUES = [
  {
    video: 'video1',
    category: 'category1',
    userId: 1,
    comment: 'This is a comment',
  },
  {
    video: 'video2',
    category: 'category2',
    userId: 1,
    comment: 'This is a comment',
  },
  {
    video: 'video1',
    category: 'category2',
    userId: 1,
    comment: 'This is a comment',
  },
  {
    video: 'video2',
    category: 'category1',
    userId: 1,
    comment: 'This is a comment',
  },
  {
    video: 'video1',
    category: 'category1',
    userId: 1,
    comment: 'This is a comment',
  },
  {
    video: 'video2',
    category: 'category2',
    userId: 2,
    comment: 'This is a comment',
  },
];

describe('Task 1', () => {
  it('Should create issues', async () => {
    const response = await request(app).post('/issues').send(ISSUES);

    expect(response.status).toBe(201);
  });

  it('Should create issues and group them correctly', async () => {
    const response = await request(app).post('/issues').send(ISSUES);

    const problems = response.body;

    expect(
      problems.every((problem: Problem) => {
        const video = problem.issues[0].video;
        const category = problem.issues[0].category;
        return problem.issues.every((issue: Issue) => issue.video === video && issue.category === category);
      }),
    ).toBeTruthy();
  });
});
