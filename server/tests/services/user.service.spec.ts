import UserModel from '../../models/users.model';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../../services/user.service';
import { SafeUser, User, UserCredentials } from '../../types/user';
import { user, safeUser } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('User model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved user', async () => {
      mockingoose(UserModel).toReturn(user, 'create');

      const savedUser = (await saveUser(user)) as SafeUser;

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toEqual(user.username);
      expect(savedUser.dateJoined).toEqual(user.dateJoined);
    });

    // DONE: Task 1 - Write additional test cases for saveUser
    it('should throw an error if user creation fails', async () => {
      const mockError = new Error('User creation failed!');
      jest.spyOn(UserModel, 'create').mockRejectedValueOnce(mockError);

      const result = await saveUser(user);
      expect(result).toEqual({
        error: `Error occurred while saving the user: ${mockError.message}`,
      });
    });
  });
});

describe('getUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the matching user', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const retrievedUser = (await getUserByUsername(user.username)) as SafeUser;

    expect(retrievedUser.username).toEqual(user.username);
    expect(retrievedUser.dateJoined).toEqual(user.dateJoined);
  });

  // DONE: Task 1 - Write additional test cases for getUserByUsername
  it('should throw an error if an error occurs while retrieving user', async () => {
    mockingoose(UserModel).toReturn(new Error('Error retrieving the user'), 'findOne');
    const result = await getUserByUsername(user.username);
    expect('error' in result).toBe(true);
  });

  it('should throw an error if user does not exist/not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');
    const result = await getUserByUsername(user.username);
    expect('error' in result).toBe(true);
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the user if authentication succeeds', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: user.password,
    };

    const loggedInUser = (await loginUser(credentials)) as SafeUser;

    expect(loggedInUser.username).toEqual(user.username);
    expect(loggedInUser.dateJoined).toEqual(user.dateJoined);
  });

  // DONE: Task 1 - Write additional test cases for loginUser
  it('should throw an error if username is invalid', async () => {
    const loginCredentials: UserCredentials = {
      username: 'xyz',
      password: user.password,
    };

    const result = await loginUser(loginCredentials);

    expect('error' in result).toBe(true);
  });

  it('should throw an error if password is invalid', async () => {
    const loginCredentials: UserCredentials = {
      username: user.username,
      password: 'wrongPass',
    };

    const result = await loginUser(loginCredentials);

    expect('error' in result).toBe(true);
  });
});

describe('deleteUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the deleted user when deleted succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOneAndDelete');

    const deletedUser = (await deleteUserByUsername(user.username)) as SafeUser;

    expect(deletedUser.username).toEqual(user.username);
    expect(deletedUser.dateJoined).toEqual(user.dateJoined);
  });

  // DONE: Task 1 - Write additional test cases for deleteUserByUsername
  it('should throw an error if user to be deleted does not exists', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndDelete');
    const result = await deleteUserByUsername(user.username);
    expect('error' in result).toBe(true);
  });

  it('should throw an error if user deletion fails', async () => {
    mockingoose(UserModel).toReturn(
      new Error('Error occurred while deleting user'),
      'findOneAndDelete',
    );
    const result = await deleteUserByUsername(user.username);
    expect('error' in result).toBe(true);
  });
});

describe('updateUser', () => {
  const updatedUser: User = {
    ...user,
    password: 'newPassword',
  };

  const safeUpdatedUser: SafeUser = {
    username: user.username,
    dateJoined: user.dateJoined,
  };

  const updates: Partial<User> = {
    password: 'newPassword',
  };

  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the updated user when updated succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUpdatedUser, 'findOneAndUpdate');

    const result = (await updateUser(user.username, updates)) as SafeUser;

    expect(result.username).toEqual(user.username);
    expect(result.username).toEqual(updatedUser.username);
    expect(result.dateJoined).toEqual(user.dateJoined);
    expect(result.dateJoined).toEqual(updatedUser.dateJoined);
  });

  // DONE: Task 1 - Write additional test cases for updateUser
  it('should throw an error if updateUser fails', async () => {
    mockingoose(UserModel).toReturn(
      new Error('Error occurred while updating the user'),
      'findOneAndUpdate',
    );
    const result = await updateUser(user.username, updates);
    expect('error' in result).toBe(true);
  });

  it('should throw an error if user not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');
    const result = await updateUser(user.username, updates);
    expect('error' in result).toBe(true);
  });
});
