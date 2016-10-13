const ERROR_VALIDATION_FAILED = 1;
const ERROR_USER_ALLREADY_EXISTS = 2;
const ERROR_INVALID_TOKEN = 3;
const ERROR_INVALID_USERNAME_OR_PASSWORD = 4;
const ERROR_SOMTHING_BAD_HAPPEND = 5;


const errorMessages = {};
errorMessages[ERROR_VALIDATION_FAILED] = 'Validation Failed';
errorMessages[ERROR_USER_ALLREADY_EXISTS] = 'User allready exists';
errorMessages[ERROR_INVALID_TOKEN] = 'Invalid Token';
errorMessages[ERROR_INVALID_USERNAME_OR_PASSWORD] = 'Invalid username or password';
errorMessages[ERROR_SOMTHING_BAD_HAPPEND] = 'Something bad happened :(';


function getErrorObject(errorCode, errors) {
  return {
    code: errorCode,
    message: errorMessages[errorCode],
    errors,
  };
}


module.exports = {
  ERROR_VALIDATION_FAILED,
  ERROR_USER_ALLREADY_EXISTS,
  ERROR_INVALID_TOKEN,
  ERROR_INVALID_USERNAME_OR_PASSWORD,
  ERROR_SOMTHING_BAD_HAPPEND,
  errorMessages,
  getErrorObject,
};
