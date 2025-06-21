import MessageModel from '../models/messages.model';
import { Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  // DONE: Task 2 - Implement the saveMessage function.
  try {
    const newMsg = await MessageModel.create(message);
    if (!newMsg) {
      throw new Error('Failed to create new message');
    }

    return newMsg;
  } catch (error) {
    return { error: `Error occurred while saving message: ${(error as Error).message}` };
  }
};

/**
 * Retrieves all messages from the database, sorted by date in ascending order.
 *
 * @returns {Promise<Message[]>} - An array of messages. If an error occurs, an empty array is returned.
 */
export const getMessages = async (): Promise<Message[]> => {
  // DONE: Task 2 - Implement the getMessages function
  try {
    const messages = await MessageModel.find().sort({ msgDateTime: 1 }).lean();
    return messages;
  } catch (error) {
    return [];
  }
};
