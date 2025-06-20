import UserModel from '../models/users.model';
import { SafeUser, User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  // DONE: Task 1 - Implement the saveUser function.
  try {
    const newUser = await UserModel.create(user);
    if (!newUser) {
      throw new Error('User creation failed!');
    }

    // Keeping all fields except password
    return {
      _id: newUser.id,
      username: newUser.username,
      dateJoined: newUser.dateJoined,
    };
  } catch (error) {
    return { error: `Error occurred while saving the user: ${error}` };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  // DONE: Task 1 - Implement the getUserByUsername function.
  try {
    // Fetches user details excluding password and converts into plain JS object.
    const user = await UserModel.findOne({ username }).select('-password').lean();
    if (!user) {
      throw new Error('User not found');
    }

    return user as SafeUser;
  } catch (error) {
    return { error: `Error occurred while retrieving user by username: ${error}` };
  }
};

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  // DONE: Task 1 - Implement the loginUser function.
  const { username, password } = loginCredentials;

  try {
    // Fetches user details excluding password and converts into plain JS object.
    const authenticatedUser = await UserModel.findOne({ username, password })
      .select('-password')
      .lean();

    if (!authenticatedUser) {
      throw new Error('User not found!');
    }
    return authenticatedUser as SafeUser;
  } catch (error) {
    return { error: `Error occurred while authenticating user: ${error}` };
  }
};

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> => {
  // DONE: Task 1 - Implement the deleteUserByUsername function.
  try {
    // Fetches deleted user details excluding password and converts into plain JS object.
    const deletedUser = await UserModel.findOneAndDelete({ username }).select('-password').lean();
    if (!deletedUser) {
      throw new Error('User not found!');
    }
    return deletedUser as SafeUser;
  } catch (error) {
    return { error: `Error occurred while deleting the user: ${error}` };
  }
};

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (
  username: string,
  updates: Partial<User>,
): Promise<UserResponse> => {
  // DONE: Task 1 - Implement the updateUser function.
  try {
    // Fetches user details excluding password and converts into plain JS object.
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { $set: updates },
      { new: true },
    )
      .select('-password')
      .lean();

    if (!updatedUser) {
      throw new Error('User not found!');
    }
    return updatedUser as SafeUser;
  } catch (error) {
    return { error: `Error occurred while updating the user's details: ${error}` };
  }
};
