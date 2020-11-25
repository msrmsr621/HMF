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
import Ionicons from 'react-native-vector-icons/Ionicons';

import {BackHandler} from 'react-native';
import {Snackbar} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';

import Loader from '../components/Loader';
import COLORS from '../utils/COLORS';
import STRINGS from '../utils/STRINGS';

class ThankYou extends Component<{}> {
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

  }

  componentDidMount = async () => {
    
  };

  render() {  
    const { navigation } = this.props;     
    return (      
      <ScrollView>
      <View style={styles.container}>          
        {!this.state.isLoading && <Loader />}
                     
        <View style={{ width: "95%",marginTop:20, alignItems:'center', textAlignVertical:'center', paddingTop:50}}>   
        <Ionicons name="ios-checkmark-circle-outline" size={150} color={COLORS.green} />   
          <Text style={{textAlign:'left', fontSize:30, fontWeight:'normal', color:COLORS.blue}}>Thank you for registering!</Text>                
           </View> 
           
           <View style={{width: "95%"}}>           
             
             <Text style={{textAlign:'center', fontSize:13, color:COLORS.matterhorn, paddingTop:10}}>We have sent an email to <Text style={{fontWeight:'bold'}}>{JSON.stringify(navigation.getParam('email', 'NO-EMAIL'))}</Text> . If you don't see the email, it may be in your spam/junk folder. You can access the application but you will not able to create case without confirming the email.</Text>
  <View style={{marginTop:30, alignItems:'center'}}>
  <TouchableOpacity
        style={{width: "50%", backgroundColor: '#80c241', borderRadius: 25, marginVertical: 10, paddingVertical: 13,}}
        onPress={() =>this.props.navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Go to login!</Text>
    </TouchableOpacity>   
    
  </View> 
</View>

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


export default ThankYou;