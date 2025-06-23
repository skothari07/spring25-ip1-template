import MessageModel from '../../models/messages.model';
import { getMessages, saveMessage } from '../../services/message.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

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

describe('Message model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  describe('saveMessage', () => {
    it('should return the saved message', async () => {
      mockingoose(MessageModel).toReturn(message1, 'create');

      const savedMessage = await saveMessage(message1);

      expect(savedMessage).toMatchObject(message1);
    });
    // DONE: Task 2 - Write a test case for saveMessage when an error occurs
    it('should throw an error if message is not saved', async () => {
      mockingoose(MessageModel).toReturn(
        new Error('Error occurred while saving message'),
        'create',
      );
      const result = await saveMessage(message1);
      expect('error' in result).toBe(true);
    });
  });

  describe('getMessages', () => {
    it('should return all messages, sorted by date', async () => {
      mockingoose(MessageModel).toReturn([message2, message1], 'find');

      const messages = await getMessages();

      expect(messages).toMatchObject([message1, message2]);
    });
    // DONE: Task 2 - Write a test case for getMessages when an error occurs
    it('should return an empty list if retrieving fails', async () => {
      mockingoose(MessageModel).toReturn(new Error('Error retrieving messages'), 'find');
      const result = await getMessages();
      expect(result).toEqual([]);
    });
  });
});
