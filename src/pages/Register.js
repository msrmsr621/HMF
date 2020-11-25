import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,  
  Image,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Keyboard,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {NetworkInfo} from 'react-native-network-info';
import { TextInput } from 'react-native-paper';
import { CheckBox } from 'react-native-elements'

import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import { Input } from 'react-native-elements';
import { GoogleSignin,GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { LoginButton, AccessToken, LoginManager, GraphRequest } from 'react-native-fbsdk';
import {BackHandler} from 'react-native';
import {Snackbar} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';

import Loader from '../components/Loader';
import COLORS from '../utils/COLORS';
import STRINGS from '../utils/STRINGS';


const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;
const signupValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required'),
    lastName: yup
    .string()
    .required('Last name is required'),
    email: yup
    .string()
    .email('Please enter valid email')
    .required('Email is Required'),
    password: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
    confirmPassword: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)       
    .test('passwords-match', 'Password and Confirm password do not match', function(value) {
      return this.parent.password === value;
    }),
    agreeToTerms: yup.boolean().oneOf([true], 'Please select terms & condition')
    .required('Please select terms & condition')

});


class Register extends Component<{}> {
  // signup() {
  //   Actions.signup();
  // }

  constructor(props) {
    super(props);
    console.log('this.props ' + JSON.stringify(this.props));
    this.state = {
      isLoading: true,
      responseMsg: '',
      hidePassword: true,
      confirmHidePassword: true,
      emailIdVerification: '',
      visible: false,

      email:"",
      firstName:"",
      lastName:"",
      password:"",
      confirmPassword:"",
      ipAddress:"",
      isFocused: false,
      isChecked: false,
      checked: true,
      facebookUserInfo : {},
      userGoogleInfo : {},
    };
    GoogleSignin.configure({   
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], 
      webClientId: '526162178485-0ccg0l3ooufk2sv9ik8uom7gpab9kqmb.apps.googleusercontent.com', 
      offlineAccess: true,
      
    });
   // this.onSubmit = this.onSubmit.bind(this);
    this.textInput = React.createRef();

  }

  componentDidMount = async () => {
    console.log('======================SIGNUP=====================');   

    // Get IPv4 IP (priority: WiFi first, cellular second)
    NetworkInfo.getIPV4Address().then(ipv4Address => {
      this.setState({ipAddress:ipv4Address});
    });
  };
  setPasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
}
setConfirmPasswordVisibility = () => {
  this.setState({ confirmHidePassword: !this.state.confirmHidePassword });
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

  signupSubmit = async values => {    
    //this.loginUser(values);
    values.ipAddress=this.state.ipAddress;
    //console.log('values ' + JSON.stringify(values));
    Keyboard.dismiss();
    // this.setState({isLoading: false, emailIdVerification: values.email});
    this.setState({isLoading: false});
    fetch(API_url + '/api/Account/Register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then(response => {
        return response.json();
      })
      .then(result => {
        console.log(JSON.stringify(result));
        if(typeof(result) == 'string')
        {          
          this.setState({
            isLoading: true,
            isSuccess: true,
            responseMsg: result            
          });     
          this._onToggleSnackBarFailure();     
        }
        else
        {
          this.setState({
            isLoading: true,
            isSuccess: false,
            responseMsg: result            
          }); 
          this.props.navigation.navigate('ThankYou', {
            email: values.email,
          });
        }        
              
       
      })
      .catch(error => {
        this.setState({
          isLoading: true,
          isSuccess: false,
          responseMsg: error.message,
        });
        this._onToggleSnackBarFailure();
      });
  };
  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));

  _onDismissSnackBar = () => this.setState({visible: false});

  _onToggleSnackBarFailure = () => this.setState(state => ({visibleFailure: !state.visibleFailure}));

  _onDismissSnackBarFailure = () => this.setState({visibleFailure: false});
  render() {
    const {handleSubmit, loginUser} = this.props;
    const {visibleFailure} = this.state;
    const {visible} = this.state;
    return (      
     
      <View>  
       <ScrollView> 
       <View style={styles.container}>     
        {!this.state.isLoading && <Loader />}
                     
        <View style={{ width: "95%",flexDirection: 'row', marginTop:20, alignItems:'center' }}>   
          <Text style={{textAlign:'left', width:'40%', marginTop:10}}><AntDesign name="arrowleft" size={30} color="#4e4e4e" onPress={() =>this.props.navigation.navigate('Login')}/></Text>    
          <Text style={{textAlign:'left', fontSize:30, fontWeight:'normal', color:COLORS.blue}}>Sign up</Text>                
           </View> 
           <Formik
            validationSchema={signupValidationSchema}
            initialValues={{firstName: '', lastName:'', email: '', password: '', confirmPassword:'', agreeToTerms:''}}
            onSubmit={(values) => {this.signupSubmit(values)}}>
            {({
              handleChange,
              handleBlur,
              setFieldValue,
              handleSubmit,                     
              values,
              errors,
              touched,
              isValid,
            }) => (
           <View style={{width: "95%", marginTop:50}}>
           <Input
            ref={this.textInput}
            placeholder=""
            name="firstName"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.matterhorn, fontSize:13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="FIRST NAME"            
            rightIcon={<SimpleLineIcons name='user' size={24} color={COLORS.blue}/>}
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            value={values.firstName}           
            errorMessage={(errors.firstName && touched.firstName) && errors.firstName}
          />
          <Input
            ref={this.textInput}
            placeholder=""
            name="lastName"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.matterhorn, fontSize:13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="LAST NAME"
            value={this.state.lastName}
            rightIcon={<SimpleLineIcons name='user' size={24} color={COLORS.blue}/>}
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            value={values.lastName}           
            errorMessage={(errors.lastName && touched.lastName) && errors.lastName}
          />
          <Input
            ref={this.textInput}
            placeholder=""
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.matterhorn, fontSize: 13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="EMAIL"
            value={this.state.email}
            rightIcon={<MaterialCommunityIcons name='email-outline' size={25} color={COLORS.blue}/>}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
            errorMessage={(errors.email && touched.email) && errors.email}
          />
          <Input
            ref={this.textInput}
            name="password"
            placeholder=""
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.black,fontSize: 13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="PASSWORD"            
            secureTextEntry={this.state.hidePassword}           
            rightIcon={(this.state.hidePassword) ? <Ionicons name='ios-eye-off-outline' size={28} color={COLORS.blue} onPress={this.setPasswordVisibility}/> : <Ionicons name='ios-eye-outline' size={28} color={COLORS.blue} onPress={this.setPasswordVisibility} />}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}            
            errorMessage={(errors.password && touched.password) && errors.password}
          />
          <Input
            ref={this.textInput}
            placeholder=""
            name="confirmPassword"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.black, fontSize: 13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="RE-ENTER PASSWORD"            
            secureTextEntry={this.state.confirmHidePassword}           
            rightIcon={(this.state.confirmHidePassword) ? <Ionicons name='ios-eye-off-outline' size={28} color={COLORS.blue} onPress={this.setConfirmPasswordVisibility}/> : <Ionicons name='ios-eye-outline' size={28} color={COLORS.blue} onPress={this.setConfirmPasswordVisibility} />}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}            
            errorMessage={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
          />       

<View style={{ flexDirection: 'row' }}>
<Text style={{textAlign:'left', width:'20%', justifyContent:'center',alignItems:'center'}}>
<CheckBox
  name='agreeToTerms'  
  checkedIcon={<Image source={require('../../assets/images/checked.png')} style={{width: 30, height: 30}} />}
  uncheckedIcon={<Image source={require('../../assets/images/checkbox.png')} style={{width: 30, height: 30}} />}
  checked={values.agreeToTerms}  
  onPress={() => setFieldValue('agreeToTerms', !values.agreeToTerms)}
 
/>
</Text>
<Text style={{justifyContent:'center',alignItems:'center', marginTop:15}}>
    <Text style={{color: COLORS.matterhorn, fontSize: 13, fontWeight: "bold"}}> I agree with the</Text>
    <Text style={{color: COLORS.blue, fontSize: 13, fontWeight: "bold"}} onPress={ ()=> Linking.openURL('https://helpmefund.org/termscondition') } >  Terms & Condition  </Text>
    </Text>
  </View> 
  {(errors.agreeToTerms) &&
                  <Text style={styles.errorText}>{errors.agreeToTerms}</Text>
                }   
  <View style={{marginTop:30}}>
    <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit} 
        disabled={!isValid}>
        <Text style={styles.buttonText}>Signup</Text>
    </TouchableOpacity>
  </View>
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
                <View style={{flexDirection:'row', marginLeft:16, }}>
                  <AntDesign name='googleplus' size={28} color={COLORS.white}/>
                  <Text style={styles.buttonTextSocialMedia}>Google</Text>
                </View>
              </TouchableOpacity>
    </View>
    <View style={styles.signupTextCont}>
            <View style={{flexDirection:'row'}}>
                  <Text style={{color: COLORS.matterhorn, fontSize: 16, fontWeight: "normal"}}>Already have an account?</Text>
                  <TouchableOpacity
                   onPress={() =>this.props.navigation.navigate('Login')}>
                    <Text style={{color: COLORS.blue, fontSize: 13, fontWeight: "bold"}}> Sign in</Text>
                  </TouchableOpacity>
                  
                </View>
            </View>
</View>

)}
</Formik>

      </View>
          </ScrollView>    
          <Snackbar
            visible={visible}
            duration={3500}
            style={{backgroundColor: COLORS.green, color: COLORS.white}}
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
</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f5ff',
    flex: 1,
    alignItems: 'center',
    fontFamily: "Myriad Pro",
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
    color: '#abb1c2',
    fontSize: 16,
  },
  checkbox: {
    height: 50,            
    width: 50,
    borderWidth: 1,  
    alignItems:'flex-start',      
    backgroundColor: COLORS.white, 
    borderColor: COLORS.blue,   
    alignItems:'flex-start',
  },
  signupButton: {
    color: COLORS.blue,
    fontSize: 20,
    paddingTop:0,
    fontWeight: 'bold',
  },
  button: {
    width: "95%",
    backgroundColor: '#80c241',
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
    color: COLORS.white,
    textAlign: 'center',
  },
  buttonTextSocialMedia: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft:10
  },
  errorText: {
    color: 'red',
    width: 300,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  inputBox: {
    width: 300,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.matterhorn,
    marginVertical: 10,
  },
});


export default Register;