import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Keyboard,
  Platform,
  Linking,
  ScrollView,
  Image,
  ViewPropTypes,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import PropTypes from 'prop-types';

import { Input, Avatar } from 'react-native-elements';
import {BackHandler} from 'react-native';
import {Snackbar} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';

import {Formik} from 'formik';
import * as yup from 'yup';
import {NetworkInfo} from 'react-native-network-info';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import ShakingText from '../components/ShakingText.component';
import TouchID from "react-native-touch-id";
import { GoogleSignin,GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { LoginButton, AccessToken, LoginManager, GraphRequest } from 'react-native-fbsdk';

import Loader from '../components/Loader';
import COLORS from '../utils/COLORS';
import STRINGS from '../utils/STRINGS';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;

const errors = {
  "LAErrorAuthenticationFailed": "Authentication was not successful because the user failed to provide valid credentials.",
  "LAErrorUserCancel": "Authentication was canceled by the user—for example, the user tapped Cancel in the dialog.",
  "LAErrorUserFallback": "Authentication was canceled because the user tapped the fallback button (Enter Password).",
  "LAErrorSystemCancel": "Authentication was canceled by system—for example, if another application came to foreground while the authentication dialog was up.",
  "LAErrorPasscodeNotSet": "Authentication could not start because the passcode is not set on the device.",
  "LAErrorTouchIDNotAvailable": "Authentication could not start because Touch ID is not available on the device",
  "LAErrorTouchIDNotEnrolled": "Authentication could not start because Touch ID has no enrolled fingers.",
  "RCTTouchIDUnknownError": "Could not authenticate for an unknown reason.",
  "RCTTouchIDNotSupported": "Device does not support Touch ID."
};



const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

class Login extends Component<{}> {
  // signup() {
  //   Actions.signup();
  // }

  constructor(props) {
    super(props);
    console.log('this.props ' + JSON.stringify(this.props));
    this.state = {
      isLoading: true,
      responseMsg: '',
      visible: false,
      visibleFailure: false,
      facebookUserInfo : {},
      emailIdVerification: '',
      email:"",
      password:"",
      isFocused: false,
      ipAddress:"",

      errorMessageLegacy: undefined,
      biometricLegacy: undefined,

      biometryType: null,
      userGoogleInfo : {},
    };
    this.textInput = React.createRef();
    this.description = null;
    GoogleSignin.configure({   
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], 
        webClientId: '526162178485-0ccg0l3ooufk2sv9ik8uom7gpab9kqmb.apps.googleusercontent.com', 
        offlineAccess: true,
        
      });
  }

  componentDidMount = async () => {
    console.log('======================LOGIN=====================');

    // Get IPv4 IP (priority: WiFi first, cellular second)
    NetworkInfo.getIPV4Address().then(ipv4Address => {
      this.setState({ipAddress:ipv4Address});
    });

    TouchID.isSupported()
    .then(biometryType => {
      this.setState({ biometryType });
    })
    
  };

  authenticate =  () => {
    return TouchID.authenticate()
      .then(success = async () =>  {
        let loginEmail = await AsyncStorage.getItem('loginEmail');
        let loginPassword = await AsyncStorage.getItem('loginPassword');

        var requestData = {Email: loginEmail, Password:loginPassword, RememberMe:""}
        this.loginSubmit(requestData);

        console.log("requestData Login ", JSON.stringify(requestData));
        // Alert.alert('Authenticated Successfully');
        // this.props.navigation.navigate('NavigationDrawer');
      })
      .catch(error => {
        console.log(error)
      });
  }

  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));

  _onDismissSnackBar = () => this.setState({visible: false});

  _onToggleSnackBarFailure = () => this.setState(state => ({visibleFailure: !state.visibleFailure}));

  _onDismissSnackBarFailure = () => this.setState({visibleFailure: false});

  loginSubmit = async (values) => {
    //this.loginUser(values);
    values.ipAddress = this.state.ipAddress;
    console.log('values ' + JSON.stringify(values));
    Keyboard.dismiss();
    console.log(API_url + '/api/Account/Login')
    this.setState({isLoading: false});

    fetch(API_url + '/api/Account/Login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log('submit login response : ' + JSON.stringify(result));

        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        } else {
          console.log('this is json');
          this.setState({isLoading: true, responseMsg: result.message});

          if (result.expired == true) {
            this._onToggleSnackBarFailure();
          } else {
            if (result.userInfo.isEmailConfirmed == false) {
              // this will go to verification page.
              // this.showAlert();
              console.log('email not confirmed');
            } else {
              global.loginResponse = result;
              console.log('login resp ' + JSON.stringify(global.loginResponse));
              try {
                AsyncStorage.setItem('isLogin', 'true');
                AsyncStorage.setItem('loginEmail', values.email);
                AsyncStorage.setItem('loginPassword', values.password);
                AsyncStorage.setItem('loginResponse', JSON.stringify(result));
              } catch (error) {
                console.log('error ', error);
              }
              console.log('Now will go to dashboard 2');
              this.props.navigation.navigate('NavigationDrawer');
              // Actions.dashboard(result);
            }
          }
        }
      })
      .catch((error) => {
        this.setState({isLoading: true});
      });
  };

  handleFocus = () => this.setState({isFocused: true})

  handleBlur = () => this.setState({isFocused: false})

  loginFinPrint  = async () =>{
    console.log("hi"); 
    let isLogin = await AsyncStorage.getItem('isLogin');
    console.log('isLogin ', isLogin);  
    if(isLogin=='true')
    {
      let isTouchIdEnable = await AsyncStorage.getItem('isTouchIdEnable');
      console.log('isTouchIdEnable ', isTouchIdEnable);  

      if(isTouchIdEnable=='true')
      {
        

        TouchID.isSupported()
        .then(this.authenticate)
        .catch(error => {
          Alert.alert('TouchID not supported');
        });
      }
      else
      {
        Alert.alert(
          '',
          'Sign in to turn on Fingerprint',
          [
            {text: 'Ok', onPress: () => console.warn('YES Pressed')},
          ]
        );
      }
      
    }
    else
    {
      Alert.alert(
        '',
        'Sign in to turn on Fingerprint',
        [
          {text: 'Ok', onPress: () => console.warn('YES Pressed')},
        ]
      );
    }
    
  }
  // facebook signin  
  facebookSignIn = () =>{
    this.setState({isLoading: false});
    // Attempt a login using the Facebook login dialog asking for default permissions.
      LoginManager.logInWithPermissions(["public_profile", "email"]).then(
        
        (result) => {
          if (result.isCancelled) {
            console.log("Login cancelled");
          } else {
            
            AccessToken.getCurrentAccessToken().then(
              
              (data) => {
                  const accessToken = data.accessToken.toString();
                  //console.log(accessToken);  
                                   
                  //---------------- profile pic ---------
                  // const infoRequest = new GraphRequest(
                  //   '/me?fields=picture',
                  //   null,
                  //   (error, result) => {
                  //     if (error) {
                  //       console.log('Error fetching data: ' + JSON.stringify(error));
                  //     } else {
                  //       console.log(JSON.stringify(result, null, 2));
                  //       console.log(result.picture.data.url);
                        // setPictureURL(result.picture.data.url);
                        // setPictureURLByID(
                        //   `https://graph.facebook.com/${result.id}/picture`,
                        // );
                  //     }
                  //   },
                  // );
                  //end profile pic
                  
                  fetch('https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name,friends&access_token=' + accessToken)
                  .then((response) => {
                    
                      response.json().then((fbUserDetails) => {
                        // this.state({facebookUserInfo:json});
                        
                        var values = {        
                          "Email": fbUserDetails.email,
                          "Image":'', 
                          "Name": fbUserDetails.first_name+' '+fbUserDetails.last_name,
                          "ThirdPartyAccessToken": accessToken,
                          "ThirdPartyUserId": fbUserDetails.id,
                          "TokenProvider": 2
                          }; 
                          console.log(values);
                          this.socialLoginApi(values);
                                          
                      })
                  })
                  .catch(() => {
                      console.log('ERROR GETTING DATA FROM FACEBOOK')
                  });         
              })
          }
        },
        function(error) {
          console.log("Login fail with error: " + error);
        }
      );
  };
  // google signin
  socialLoginApi = (values) => {
   // console.log(values);
    fetch(API_url + '/api/SocialLogin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log('Social Login response : ' + JSON.stringify(result));
        //return true;
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        } else {
          console.log('this is json');
          this.setState({isLoading: true, responseMsg: result.message});

          if (result.expired == true) {
            this.setState({isLoading: true});
            this._onToggleSnackBarFailure();
          } else {
            if (result.userInfo.isEmailConfirmed == false) {
              this.setState({isLoading: true, responseMsg: 'Email address is not confirmed'});
              this._onToggleSnackBarFailure();
            } else {
              global.loginResponse = result;
              console.log('login resp ' + JSON.stringify(global.loginResponse));
              try {
                AsyncStorage.setItem('isLogin', 'true');
               // AsyncStorage.setItem('loginEmail', values.email);
               // AsyncStorage.setItem('loginPassword', values.password);
                AsyncStorage.setItem('loginResponse', JSON.stringify(result));
                
              } catch (error) {
                this.setState({isLoading: true});
                console.log('error ', error);
              }
              console.log('Now will go to dashboard 2');
              this.props.navigation.navigate('NavigationDrawer');
              // Actions.dashboard(result);
            }
          }
        }
      })
      .catch((error) => {
        this.setState({isLoading: true, responseMsg: "Developer error, client id not configured well."});
        this._onToggleSnackBarFailure();
      });
  };

  googleSignIn = () => {
    this.setState({isLoading: false});
    GoogleSignin.signIn()
      .then((data) => {

        //console.log("TEST " + JSON.stringify(data));

        const currentUser = GoogleSignin.getTokens().then((res)=>{
          console.log('Access token is : ',res.accessToken);          
         //-----
         // set api      
         var values = {        
          "Email": data.user.email,
          "Image": data.user.photo, 
          "Name": data.user.name,
          "ThirdPartyAccessToken": res.accessToken,
          "ThirdPartyUserId": data.user.id,
          "TokenProvider": 1
          };
          console.log(JSON.stringify(values));
          this.socialLoginApi(values);
      // end api
         //-----
      });

      })
      .then((user) => {
        //console.log("TEST G LOGIN 1 " + JSON.stringify(user))
      })
      .catch((error) => {
        console.log("....." + JSON.stringify(error));
        this.setState({isLoading: true});
      });   
  };

  render() {

    const {visibleFailure} = this.state;
    const {visible} = this.state;

   
    return (
      <ScrollView keyboardShouldPersistTaps="always">

      
      <View style={styles.container}>
        {!this.state.isLoading && <Loader />}

         <Snackbar
              visible={visible}
              duration={3500}
              style={{backgroundColor: COLORS.successColor}}
              onDismiss={this._onDismissSnackBar}>
              {this.state.responseMsg}
        </Snackbar>

        <Snackbar
              visible={visibleFailure}
              duration={3500}
              style={{backgroundColor: COLORS.failureColor}}
              onDismiss={this._onDismissSnackBarFailure}>
              {this.state.responseMsg}
        </Snackbar>
  
        <Text style={{textAlign:'center', fontSize:20, fontWeight:'bold', color:COLORS.blue}}>Log In</Text>
       
        <Formik
            validationSchema={loginValidationSchema}
            initialValues={{email: '', password: ''}}
            onSubmit={(values) => {this.loginSubmit(values)}}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
        <View style={{width: "95%", marginTop:90}}>
          <Input
            ref={this.textInput}
            name="email"
            placeholder="Email"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.grey}}
            inputStyle={{color: COLORS.black}}
            labelStyle={{color: COLORS.grey, fontSize: 13, fontWeight: "normal"}}
            label="EMAIL"
            value={this.state.email}
            rightIcon={<Fontisto name='email' size={24} color={COLORS.blue}/>}

            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
            errorMessage={(errors.email && touched.email) && errors.email}
          />

          <Input
            ref={this.textInput}
            name="password"
            placeholder="Password"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.grey}}
            inputStyle={{color: COLORS.black}}
            labelStyle={{color: COLORS.grey, fontSize: 13, fontWeight: "normal"}}
            label="PASSWORD"            
            secureTextEntry={true}
            value={this.state.password}
            rightIcon={<Ionicons name='finger-print' size={28} color={COLORS.blue} onPress={this.loginFinPrint}/>}
            
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
            errorMessage={(errors.password && touched.password) && errors.password}
          />
         

          <Text style={{textAlign:'right', color:COLORS.blue, marginRight:10}} onPress={() =>this.props.navigation.navigate('ForgotPassword')}>Forgot Password?</Text>

          <View style={{marginTop:50}}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>

            <View style={{marginTop:20}}>
              <View style={{flexDirection: 'row'}}>
                  <View style={{backgroundColor: COLORS.grey, height: 1, flex: 1, alignSelf: 'center'}} />
                  <Text style={{ alignSelf:'center', paddingHorizontal:5, fontSize: 18, color: COLORS.black }}>or</Text>
                  <View style={{backgroundColor: COLORS.grey, height: 1, flex: 1, alignSelf: 'center'}} />
              </View>
            </View>

            <View style={{marginTop:20, flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity style={styles.buttonFacebook} onPress={()=>{this.facebookSignIn()}}>
                <View style={{flexDirection:'row', marginLeft:15, }}>
                  <EvilIcons name='sc-facebook' size={28} color={COLORS.white}/>
                  <Text style={styles.buttonTextSocialMedia}>Facebook</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.buttonGoogle} onPress={()=>{this.googleSignIn()}}>
                <View style={{flexDirection:'row', marginLeft:15, }}>
                  <AntDesign name='googleplus' size={24} color={COLORS.white}/>
                  <Text style={styles.buttonTextSocialMedia}>Google</Text>
                </View>
              </TouchableOpacity>
            </View>
            
          </View>
          <View style={styles.signupTextCont}>
            <View style={{flexDirection:'row'}}>
                  <Text style={styles.signupText}>Don't have an account?</Text>
                  <TouchableOpacity
                    onPress={() =>this.props.navigation.navigate('Register')}>
                    <Text style={styles.signupButton}> Create an account</Text>
                  </TouchableOpacity>
                  
                </View>
            </View>
        </View>
        )}
        </Formik>
      </View>
      </ScrollView>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerForm: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
    
  },
  signupText: {
    color: '#505e67',
    fontSize: 16,
  },
  signupButton: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: COLORS.green,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  
  buttonFacebook: {
    backgroundColor: '#3f51b5',
    width: '45%',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  buttonGoogle: {
    backgroundColor: '#f44236',
    width: '45%',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonTextSocialMedia: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft:10
  },
  // errorText: {
  //   color: 'red',
  //   width: "100%",
  //   fontSize: 14,
  //   paddingHorizontal: 16,
  //   paddingBottom: 8,
  // },
  inputBox: {
    width: 300,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#ffffff',
    marginVertical: 10,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
  containerFingerPrint: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 164, 222, 0.9)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    marginVertical: 45,
  },
  heading: {
    textAlign: 'center',
    color: '#00a4de',
    fontSize: 21,
  },
  description: (error) => ({
    textAlign: 'center',
    color: error ? '#ea3d13' : '#a5a5a5',
    height: 65,
    fontSize: 18,
    marginVertical: 10,
    marginHorizontal: 20,
  }),
  buttonContainer: {
    padding: 20,
  },
  buttonTextFingerPrint: {
    color: '#8fbc5a',
    fontSize: 15,
    fontWeight: 'bold',
  },
});


export default Login;