const request = require('supertest');

import app from '../../src/app';
import { AppOneTicketStatus } from '../../src/object-values/app-one-ticket.status';
import { AppTwoTicketStatus } from '../../src/object-values/app-two-ticket.status';
import { ProblemStatus } from '../../src/object-values/problem.status';
import { ThirdPartyApp } from '../../src/object-values/third-party.app';

describe('Task 5', () => {
  it('Should not close a ticket in ThirdApp1 if it is not closed in the main app', async () => {
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
    const { body: createdTicket } = await request(app)
      .post(`/create-ticket/${ThirdPartyApp.APP_ONE}/${problem.id}`)
      .send({
        problemId: problem.id,
        myStatus: AppOneTicketStatus.RUNNING,
        count: 1,
        owner: 'csTeam',
      });

    await request(app).post(`/change-status/${ProblemStatus.OPEN}`).send();
    const { status } = await request(app).post(`/close-ticket/${ThirdPartyApp.APP_ONE}/${problem.id}`).send({
      count: 2,
    });

    expect(status).toBe(400);
  });

  it('Should not close a ticket in ThirdApp2 if it is not closed in the main app', async () => {
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
    const { body: createdTicket } = await request(app)
      .post(`/create-ticket/${ThirdPartyApp.APP_TWO}/${problem.id}`)
      .send({
        problemRef: problem.id,
        status: AppTwoTicketStatus.ON_GOING,
        issuesCount: 1,
        owner: 'csTeam',
      });

    await request(app).post(`/change-status/${ProblemStatus.OPEN}`).send();
    const { status } = await request(app).post(`/close-ticket/${ThirdPartyApp.APP_TWO}/${problem.id}`).send({
      issuesCount: 2,
    });

    expect(status).toBe(400);
  });

  it('Should close a ticket in ThirdApp1', async () => {
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
    const { body: createdTicket } = await request(app)
      .post(`/create-ticket/${ThirdPartyApp.APP_ONE}/${problem.id}`)
      .send({
        problemId: problem.id,
        myStatus: AppOneTicketStatus.RUNNING,
        count: 1,
        owner: 'csTeam',
      });

    await request(app).post(`/change-status/${ProblemStatus.OPEN}`).send();
    await request(app).post(`/change-status/${ProblemStatus.CLOSED}`).send();
    const { status, body: closedTicket } = await request(app)
      .post(`/close-ticket/${ThirdPartyApp.APP_ONE}/${problem.id}`)
      .send({
        count: 2,
      });

    expect(createdTicket.count).not.toBe(closedTicket.count);
    expect(closedTicket.count).toBe(2);
    expect(closedTicket.myStatus).toBe(AppOneTicketStatus.RESOLVED);
    expect(status).toBe(201);
  });

  it('Should close a ticket in ThirdApp2', async () => {
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
    const { body: createdTicket } = await request(app)
      .post(`/create-ticket/${ThirdPartyApp.APP_TWO}/${problem.id}`)
      .send({
        problemRef: problem.id,
        status: AppTwoTicketStatus.ON_GOING,
        issuesCount: 1,
        owner: 'csTeam',
      });

    await request(app).post(`/change-status/${ProblemStatus.OPEN}`).send();
    await request(app).post(`/change-status/${ProblemStatus.CLOSED}`).send();
    const { status, body: closedTicket } = await request(app)
      .post(`/close-ticket/${ThirdPartyApp.APP_TWO}/${problem.id}`)
      .send({
        issuesCount: 2,
      });

    expect(createdTicket.issuesCount).not.toBe(closedTicket.issuesCount);
    expect(closedTicket.issuesCount).toBe(2);
    expect(closedTicket.status).toBe(AppTwoTicketStatus.ENDED);
    expect(status).toBe(201);
  });
});
