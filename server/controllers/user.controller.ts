import express, { Response, Router } from 'express';
import { UserRequest, User, UserCredentials, UserByUsernameRequest } from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUserBodyValid = (req: UserRequest): boolean => {
    // DONE: Task 1 - Implement the isUserBodyValid function
    const { username, password } = req.body;
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return false;
    }
    return true;
  };

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    // DONE: Task 1 - Implement the createUser function
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }

    const user: User = {
      ...req.body,
      dateJoined: new Date(),
    };

    try {
      const createdUser = await saveUser(user);

      if ('error' in createdUser) {
        throw new Error(createdUser.error);
      }

      res.status(200).json(createdUser);
    } catch (error) {
      res.status(500).send(`Error occurred while creating the user: ${error}`);
    }
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    // DONE: Task 1 - Implement the userLogin function
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const loginCredentials: UserCredentials = {
      username: req.body.username,
      password: req.body.password,
    };

    try {
      const user = await loginUser(loginCredentials);
      if ('error' in user) {
        throw new Error(user.error);
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(`Error occured while logging in: ${error}`);
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    // DONE: Task 1 - Implement the getUser function
    const { username } = req.params;

    try {
      const user = await getUserByUsername(username);

      if ('error' in user) {
        throw new Error(user.error);
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(`Error occurred while fetching user: ${error}`);
    }
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    // DONE: Task 1 - Implement the deleteUser function
    try {
      const deletedUser = await deleteUserByUsername(req.params.username);
      if ('error' in deletedUser) {
        throw new Error(deletedUser.error);
      }
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).send(`Error occurred while deleting user: ${error}`);
    }
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    // DONE: Task 1 - Implement the resetPassword function
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const { username, password } = req.body;

    try {
      const updatedUser = await updateUser(username, { password });
      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error occurred while resetting user password: ${error}`);
    }
  };

  // Define routes for the user-related operations.
  // DONE: Task 1 - Add appropriate HTTP verbs and endpoints to the router
  router.post('/signup', createUser);
  router.post('/login', userLogin);
  router.get('/getUser/:username', getUser);
  router.patch('/resetPassword', resetPassword);
  router.delete('/deleteUser/:username', deleteUser);

  return router;
};

export default userController;
