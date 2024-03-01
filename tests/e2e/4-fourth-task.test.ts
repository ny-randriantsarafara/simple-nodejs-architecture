const request = require('supertest');

import app from '../../src/app';
import { AppOneTicketStatus } from '../../src/object-values/app-one-ticket.status';
import { AppTwoTicketStatus } from '../../src/object-values/app-two-ticket.status';
import { ProblemStatus } from '../../src/object-values/problem.status';
import { ThirdPartyApp } from '../../src/object-values/third-party.app';

describe('Task 4', () => {
  it('Should not update a ticket in ThirdApp1 and 400 status code if the problem status is not open', async () => {
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
    await request(app).post(`/create-ticket/${ThirdPartyApp.APP_ONE}/${problem.id}`).send({
      problemId: problem.id,
      myStatus: AppOneTicketStatus.RUNNING,
      count: 1,
      owner: 'csTeam',
    });
    const { status } = await request(app).post(`/update-ticket/${ThirdPartyApp.APP_ONE}/${problem.id}`).send({
      count: 2,
    });
    expect(status).toBe(400);
  });

  it('Should not update a ticket in ThirdApp2 and return 400 status code if the problem status is not open ', async () => {
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
    await request(app).post(`/create-ticket/${ThirdPartyApp.APP_TWO}/${problem.id}`).send({
      problemRef: problem.id,
      status: AppTwoTicketStatus.ON_GOING,
      issuesCount: 1,
      owner: 'csTeam',
    });
    const { status } = await request(app).post(`/update-ticket/${ThirdPartyApp.APP_TWO}/${problem.id}`).send({
      issuesCount: 2,
    });
    expect(status).toBe(400);
  });

  it('Should update a ticket in ThirdApp1', async () => {
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
    const { status, body: updatedTicket } = await request(app)
      .post(`/update-ticket/${ThirdPartyApp.APP_ONE}/${problem.id}`)
      .send({
        count: 2,
      });

    expect(createdTicket.count).not.toBe(updatedTicket.count);
    expect(updatedTicket.count).toBe(2);
    expect(status).toBe(201);
  });

  it('Should update a ticket in ThirdApp2', async () => {
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
    const { status, body: updatedTicket } = await request(app)
      .post(`/update-ticket/${ThirdPartyApp.APP_TWO}/${problem.id}`)
      .send({
        issuesCount: 2,
      });

    expect(createdTicket.issuesCount).not.toBe(updatedTicket.issuesCount);
    expect(updatedTicket.issuesCount).toBe(2);
    expect(status).toBe(201);
  });
});
