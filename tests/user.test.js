const database = require('../config/database');
const userController = require('../controllers/user');
const dotenv = require('dotenv');
const { ERROR_USER_ALLREADY_EXISTS, ERROR_INVALID_USERNAME_OR_PASSWORD,
        ERROR_USER_NOT_FOUND } = require('../lib/errors.js');

beforeAll((done) => {
  dotenv.load();

  database.connect().then(() => done())
  .catch(err => done.fail(err));
});

it('should create a new user', () =>
  userController.addUser('testuser1', 'testpassword1')
  .then((result) => {
    expect(result).toEqual(true);
  })
);

it('should not create user with the same username', () =>
  userController.addUser('testuser1', 'testpassword1')
  .catch(error => expect(error).toEqual(ERROR_USER_ALLREADY_EXISTS))
);

it('should generate a token', () =>
  userController.generateToken('testuser1', 'testpassword1')
  .then((result) => {
    expect(result); // TODO improve
  })
);

it('should not generate token if username doesn\'t exists', () =>
  userController.generateToken('testuser2', 'testpassword2')
  .catch(error => expect(error).toEqual(ERROR_INVALID_USERNAME_OR_PASSWORD))
);

it('should not generate token if password doesn\'t match username', () =>
  userController.generateToken('testuser1', 'testpassword2')
  .catch(error => expect(error).toEqual(ERROR_INVALID_USERNAME_OR_PASSWORD))
);

it('should delete user', () =>
  userController.deleteUser('testuser1')
  .then((result) => {
    expect(result).toEqual(true);
  })
);

it('should not delete user if user doesn\'t exists', () =>
  userController.deleteUser('testuser1')
  .catch(error => expect(error).toEqual(ERROR_USER_NOT_FOUND))
);

afterAll(() => {
  database.disconnect();
});
