/* eslint-disable prettier/prettier */
import firebase from 'react-native-firebase';
import moment from 'moment';

class FirebaseCrashlytics {
  handleCrashlytics(errorCode, path, errorMessage) {
    // var currentTimeStamp = moment().format('YYYY/MM/DD hh:mm:ss a');
    var userId = global.loginResponse.user.id;
    var errorString = 'userId: ' + userId + ', ' + path + ', error: ' + errorMessage;
    var errorStringForLog = errorCode + ', userId: ' + userId + ', ' + path + ', error: ' + errorMessage;
    firebase.crashlytics().recordError(errorCode,errorString);
    console.log(errorStringForLog);
    firebase.crashlytics().log(errorStringForLog);
    // firebase.crashlytics().recordError(errorCode,', userId: ' + userId,', ' + path,', error: ' + errorMessage,);
    // console.log(errorCode,', userId: ' + userId,', ' + path,', error: ' + errorMessage,);
    // firebase.crashlytics().log(errorCode,', userId: ' + userId,', ' + path,', error: ' + errorMessage,);
  }
}

// class FirebaseCrashlytics {
//   handleCrashlytics(errorCode, path, errorMessage) {
//     var currentTimeStamp = moment().format('YYYY/MM/DD hh:mm:ss a');
//     var userId = global.loginResponse.user.id;
//     firebase
//       .crashlytics()
//       .recordError(
//         errorCode,
//         currentTimeStamp + ', userId: ' + userId,
//         ', ' + path,
//         ', error: ' + errorMessage,
//       );
//     console.log(
//       errorCode,
//       currentTimeStamp + ', userId: ' + userId,
//       ', ' + path,
//       ', error: ' + errorMessage,
//     );
//   }
// }
const firebaseCrashlytics = new FirebaseCrashlytics();
export default firebaseCrashlytics;
