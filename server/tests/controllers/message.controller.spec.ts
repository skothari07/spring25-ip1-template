import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import * as util from '../../services/message.service';

const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const getMessagesSpy = jest.spyOn(util, 'getMessages');

describe('POST /addMessage', () => {
  it('should add a new message', async () => {
    const validId = new mongoose.Types.ObjectId();
    const message = {
      _id: validId,
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    saveMessageSpy.mockResolvedValue(message);

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: message._id.toString(),
      msg: message.msg,
      msgFrom: message.msgFrom,
      msgDateTime: message.msgDateTime.toISOString(),
    });
  });

  it('should return bad request error if messageToAdd is missing', async () => {
    const response = await supertest(app).post('/messaging/addMessage').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  // DONE: Task 2 - Write additional test cases for addMessageRoute
  it('should throw 500 error if message is not saved', async () => {
    const msg = {
      _id: new mongoose.Types.ObjectId(),
      msg: 'CS4530',
      msgFrom: 'Saurabh',
      msgDateTime: new Date('2025-11-11'),
    };

    saveMessageSpy.mockResolvedValue({ error: 'Error occurred while adding a message' });
    const result = await supertest(app).post('/messaging/addMessage').send({ messageToAdd: msg });
    expect(result.status).toBe(500);
    expect('error' in result).toBe(true);
    expect(result.text).toContain('Error occurred while adding a message');
  });

  it('should throw an error if any parameter (msgFrom here) is missing from body', async () => {
    const badMessage = {
      msg: 'CS4530',
      msgDateTime: new Date('2025-11-11'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should throw an error if any required field is empty or null', async () => {
    const badMessage = {
      msg: 'CS4530',
      msgFrom: '',
      msgDateTime: null,
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: badMessage });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });
});

describe('GET /getMessages', () => {
  it('should return all messages', async () => {
    const message1 = {
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    const message2 = {
      msg: 'Hi',
      msgFrom: 'User2',
      msgDateTime: new Date('2024-06-05'),
    };

    getMessagesSpy.mockResolvedValue([message1, message2]);

    const response = await supertest(app).get('/messaging/getMessages');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        msg: message1.msg,
        msgFrom: message1.msgFrom,
        msgDateTime: message1.msgDateTime.toISOString(),
      },
      {
        msg: message2.msg,
        msgFrom: message2.msgFrom,
        msgDateTime: message2.msgDateTime.toISOString(),
      },
    ]);
  });
});
