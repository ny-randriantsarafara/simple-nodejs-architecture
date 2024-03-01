const request = require('supertest');

import app from '../../src/app';
import Problem from '../../src/entities/problem.entity';

import { IssueStatus } from '../../src/object-values/issue.status';
import { ProblemStatus } from '../../src/object-values/problem.status';

const ISSUES = [
  { video: 'video1', category: 'category1', userId: 1, comment: 'This is a comment' },
  { video: 'video2', category: 'category2', userId: 1, comment: 'This is a comment' },
  { video: 'video1', category: 'category2', userId: 1, comment: 'This is a comment' },
  { video: 'video2', category: 'category1', userId: 1, comment: 'This is a comment' },
  { video: 'video1', category: 'category1', userId: 1, comment: 'This is a comment' },
  { video: 'video2', category: 'category2', userId: 2, comment: 'This is a comment' },
];

describe('Task 2', () => {
  it('Should return 400 status code if the status is not valid', async () => {
    await request(app).post('/issues').send(ISSUES);
    const { status } = await request(app).post('/change-status/INVALID_STATUS').send();
    expect(status).toBe(400);
  });

  it('Should return 400 status code if trying to return to a previous status', async () => {
    await request(app).post('/issues').send(ISSUES);
    await request(app).post(`/change-status/${ProblemStatus.READY}`).send();
    const { status } = await request(app).post(`/change-status/${ProblemStatus.PENDING}`).send();
    expect(status).toBe(400);
  });

  it('Should return 400 status code if trying to skip a status', async () => {
    await request(app).post('/issues').send(ISSUES);
    await request(app).post(`/change-status/${ProblemStatus.READY}`).send();
    const { status } = await request(app).post(`/change-status/${ProblemStatus.CLOSED}`).send();
    expect(status).toBe(400);
  });

  it('Should update the problems statuses to READY', async () => {
    await request(app).post('/issues').send(ISSUES);
    const { body: updatedProblems } = await request(app).post(`/change-status/${ProblemStatus.READY}`).send();

    expect(updatedProblems.every((problem: Problem) => problem.status === ProblemStatus.READY)).toBe(true);
  });

  it('Should update the issues statuses depending on the problem status', async () => {
    await request(app).post('/issues').send(ISSUES);
    const { body: updatedToReadyProblems, status: firstRequestStatus } = await request(app)
      .post(`/change-status/${ProblemStatus.READY}`)
      .send();

    expect(
      updatedToReadyProblems.every((problem: Problem) =>
        problem.issues.every((issue) => issue.status === IssueStatus.WAITING),
      ),
    ).toBe(true);
    expect(firstRequestStatus).toBe(200);

    const { body: updatedToOpenProblems, status: secondRequestStatus } = await request(app)
      .post(`/change-status/${ProblemStatus.OPEN}`)
      .send();
    expect(
      updatedToOpenProblems.every((problem: Problem) =>
        problem.issues.every((issue) => issue.status === IssueStatus.GROUPED),
      ),
    ).toBe(true);
    expect(secondRequestStatus).toBe(200);
  });
});
