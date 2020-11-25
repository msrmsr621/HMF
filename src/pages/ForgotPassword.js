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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Input } from 'react-native-elements';

import {BackHandler} from 'react-native';
import {Snackbar} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';

import Loader from '../components/Loader';
import COLORS from '../utils/COLORS';
import STRINGS from '../utils/STRINGS';


const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;
const forgotValidationSchema = yup.object().shape({
    email: yup
    .string()
    .email('Please enter valid email')
    .required('Email is Required')
});


class ForgotPassword extends Component<{}> {
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
      email:"",      
      isFocused: false
    };

   // this.onSubmit = this.onSubmit.bind(this);
    this.textInput = React.createRef();

  }

  componentDidMount = async () => {
    
  };



  forgotPasswordSubmit = async values => {      
    //console.log('values ' + JSON.stringify(values));
    Keyboard.dismiss();
    // this.setState({isLoading: false, emailIdVerification: values.email});
    this.setState({isLoading: false});
    fetch(API_url + '/api/Account/ForgotPassword', {
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
        if(result == true)
        {
          this.setState({
            isLoading: true,
            isSuccess: true,
            responseMsg: 'Please check your mail account, we have sent the reset password link on your mail!'            
          });    
          this._onToggleSnackBar();        
        }
        else
        {            
          this.setState({
            isLoading: true,
            isSuccess: false,
            responseMsg: result            
          }); 
          this._onToggleSnackBarFailure();
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
    const {handleSubmit} = this.props;
    const {visibleFailure} = this.state;
    const {visible} = this.state;    
    return (      
      <ScrollView>
      <View style={styles.container}>          
        {!this.state.isLoading && <Loader />}
                     
        <Text style={{textAlign:'center', fontSize:20, fontWeight:'bold', color:COLORS.blue}}>Forgot Password</Text>
           <Formik
            validationSchema={forgotValidationSchema}
            initialValues={{email: ''}}
            onSubmit={(values) => {this.forgotPasswordSubmit(values)}}>
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
           <View style={{width: "95%", marginTop:100}}>           
          <Input
            ref={this.textInput}
            placeholder=""
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.matterhorn, fontSize: 13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="EMAIL ADDRESS"
            value={this.state.email}
            rightIcon={<MaterialCommunityIcons name='email-outline' size={25} color={COLORS.blue}/>}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
            errorMessage={(errors.email && touched.email) && errors.email}
          />        
  
  <View style={{marginTop:30,flexDirection: 'row', alignItems:'center'}}>
    <TouchableOpacity style={{ width:'50%'}} 
                    onPress={() =>this.props.navigation.navigate('Login')}>
                    <Text style={styles.signupButton}> Go to login!</Text>
                  </TouchableOpacity>
    <TouchableOpacity
        style={{width: "50%", backgroundColor: '#80c241', borderRadius: 25, marginVertical: 10, paddingVertical: 13,}}
        onPress={handleSubmit} 
        disabled={!isValid}>
        <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
  </View> 
</View>

)}
</Formik>
{this.state.isSuccess ? (
          <Snackbar
            visible={visible}
            duration={3500}
            style={{backgroundColor: COLORS.green, color: COLORS.white}}
            onDismiss={this._onDismissSnackBar}>
            {this.state.responseMsg}
          </Snackbar>
        ) : (
          <Snackbar
            visible={visibleFailure}
            duration={3500}
            style={{backgroundColor: COLORS.failureColor}}
            onDismiss={this._onDismissSnackBarFailure}>
            {this.state.responseMsg}
          </Snackbar>
        )}
</View>
</ScrollView>
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
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


export default ForgotPassword;