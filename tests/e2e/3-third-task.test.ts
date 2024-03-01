const request = require('supertest');

import app from '../../src/app';
import { AppOneTicketStatus } from '../../src/object-values/app-one-ticket.status';
import { AppTwoTicketStatus } from '../../src/object-values/app-two-ticket.status';
import { ThirdPartyApp } from '../../src/object-values/third-party.app';
import { ProblemStatus } from '../../src/object-values/problem.status';

describe('Task 3', () => {
  it('Should return 400 status code if the problem status is not ready', async () => {
    const {
      body: [problem],
    } = await request(app)
      .post('/issues')
      .send([
        {
          video: 'video1',
          category: 'category1',
          userId: 1,
          comment: 'This is a comment',
        },
      ]);
    const { status } = await request(app).post(`/create-ticket/ThirdPartyApp1/${problem.id}`).send({
      problemId: problem.id,
      myStatus: AppOneTicketStatus.RUNNING,
      count: 1,
      owner: 'csTeam',
    });
    expect(status).toBe(400);
  });

  it('Should create a ticket in third party app 1', async () => {
    const {
      body: [problem],
    } = await request(app)
      .post('/issues')
      .send([
        {
          video: 'video1',
          category: 'category1',
          userId: 1,
          comment: 'This is a comment',
        },
      ]);
    await request(app).post(`/change-status/${ProblemStatus.READY}`).send();
    const { status, body: ticket } = await request(app)
      .post(`/create-ticket/${ThirdPartyApp.APP_ONE}/${problem.id}`)
      .send({
        problemId: problem.id,
        myStatus: AppOneTicketStatus.RUNNING,
        count: 1,
        owner: 'csTeam',
      });
    expect(status).toBe(201);
    expect(ticket).toEqual({
      problemId: problem.id,
      myStatus: AppOneTicketStatus.RUNNING,
      count: 1,
      owner: 'csTeam',
    });
  });

  it('Should create a ticket in third party app 2', async () => {
    const {
      body: [problem],
    } = await request(app)
      .post('/issues')
      .send([
        {
          video: 'video1',
          category: 'category1',
          userId: 1,
          comment: 'This is a comment',
        },
      ]);
    await request(app).post(`/change-status/${ProblemStatus.READY}`).send();
    const { status, body: ticket } = await request(app)
      .post(`/create-ticket/${ThirdPartyApp.APP_TWO}/${problem.id}`)
      .send({
        problemRef: problem.id,
        status: AppTwoTicketStatus.ON_GOING,
        issuesCount: 1,
        externalOwner: 'csTeam',
      });
    expect(status).toBe(201);
    expect(ticket).toEqual({
      problemRef: problem.id,
      status: AppTwoTicketStatus.ON_GOING,
      issuesCount: 1,
      externalOwner: 'csTeam',
    });
  });
});
