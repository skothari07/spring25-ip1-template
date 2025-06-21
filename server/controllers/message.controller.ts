import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/socket';
import { AddMessageRequest, Message } from '../types/types';
import { saveMessage, getMessages } from '../services/message.service';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided message request contains the required fields.
   *
   * @param req The request object containing the message data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddMessageRequest): boolean =>
    // DONE: Task 2 - Implement the isRequestValid function
    req.body.messageToAdd !== undefined && req.body.messageToAdd != null;

  /**
   * Validates the Message object to ensure it contains the required fields.
   *
   * @param message The message to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   */
  const isMessageValid = (message: Message): boolean => {
    // DONE: Task 2 - Implement the isMessageValid function
    const { msg, msgFrom, msgDateTime } = message;
    if (!msg || !msgFrom || !msgDateTime) {
      return false;
    }
    return true;
  };

  /**
   * Handles adding a new message. The message is first validated and then saved.
   * If the message is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddMessageRequest object containing the message and chat data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessageRoute = async (req: AddMessageRequest, res: Response): Promise<void> => {
    /**
     * DONE: Task 2 - Implement the addMessageRoute function.
     * This emits a message update event to the client. When should you emit this event? You can find the socket event definition in the server/types/socket.d.ts file.
     */

    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const { messageToAdd: msg } = req.body;

    if (!isMessageValid(msg)) {
      res.status(400).send('Invalid message body');
      return;
    }

    try {
      const msgFromDb = await saveMessage({ ...msg });

      if ('error' in msgFromDb) {
        throw new Error(msgFromDb.error);
      }
      socket.emit('messageUpdate', { msg: msgFromDb });
      res.json(msgFromDb);
    } catch (error) {
      res.status(500).send(`Error occurred while adding a message: ${(error as Error).message}`);
    }
  };

  /**
   * Fetch all messages in descending order of their date and time.
   * @param req The request object.
   * @param res The HTTP response object used to send back the messages.
   * @returns A Promise that resolves to void.
   */
  const getMessagesRoute = async (req: Request, res: Response): Promise<void> => {
    // DONE: Task 2 - Implement the getMessagesRoute function
    try {
      const messages = await getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).send(`Error while retrieving messages: ${(error as Error).message}`);
    }
  };

  // Add appropriate HTTP verbs and their endpoints to the router
  router.post('/addMessage', addMessageRoute);
  router.get('/getMessages', getMessagesRoute);

  return router;
};

export default messageController;
