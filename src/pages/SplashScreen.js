import React, {Component} from 'react';
import {View, StyleSheet, AsyncStorage, Image, Alert} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {NetworkInfo} from 'react-native-network-info';


import Loader from '../components/Loader';
import COLORS from '../utils/COLORS';
import STRINGS from '../utils/STRINGS';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;
class SplashScreen extends Component<{}> {
  constructor(props) {
    super(props);
    console.log('this.props ' + JSON.stringify(this.props));
    this.state = {
      isLoading: true,
      isLoaded: true,
      checked: true,
      ipAddress: "",
    };
  }

  componentDidMount = async () => {
    console.log('splashscreen called');
    // Get IPv4 IP (priority: WiFi first, cellular second)
    NetworkInfo.getIPV4Address().then(ipv4Address => {
      this.setState({ipAddress:ipv4Address});
    });

    try {
      console.log('loginResponse Splashscreen ' +(await AsyncStorage.getItem('loginResponse')),);

      let isLogin = await AsyncStorage.getItem('isLogin');
      console.log('isLogin ', isLogin);

      if (isLogin === 'false') {
        // let loginResponse = await AsyncStorage.getItem('loginResponse');
        // loginResponse = JSON.parse(loginResponse);
        // global.loginResponse = loginResponse;
        // console.log(JSON.stringify(loginResponse));

        this.login();
        console.log('hi');
      } else {
        console.log('Now will go to Login Page');
        setTimeout(()=>{ 
            this.props.navigation.navigate('StackNavigator');
        }, 3000);

        
      }
    } catch (error) {
      console.log('error ', error);
    }
  };

  login = async () => {
    const email = await AsyncStorage.getItem('loginEmail');
    const password = await AsyncStorage.getItem('loginPassword');

    var values = {email: email, password: password, ipAddress: this.state.ipAddress};
    console.log('login request ', JSON.stringify(values));
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
      .then( async (result) => {
        console.log('submit login response : ' + JSON.stringify(result));

        if (typeof result === 'string') 
        {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        } 
        else 
        {
          console.log('this is json');
          this.setState({isLoading: true, responseMsg: result.message});

          if (result.expired == true) {
            // console.log("4")
            this.props.navigation.navigate('StackNavigator');
          } else {
            if (result.userInfo.isEmailConfirmed == false) {
              // console.log("1");
              // this will go to verification page.
              // this.showAlert();
              this.props.navigation.navigate('StackNavigator');
            } else {
              global.loginResponse = result;
              try {
                AsyncStorage.setItem('isLogin', 'true');
                AsyncStorage.setItem('loginEmail', values.email);
                AsyncStorage.setItem('loginPassword', values.password);
                AsyncStorage.setItem('loginResponse', JSON.stringify(result));

                console.log('Now will go to dashboard');
                this.props.navigation.navigate('NavigationDrawer');

              } catch (error) {
                this.setState({isLoading: true});
              }
            }
          }
        }
      })
      .catch((error) => {
        this.props.navigation.navigate('StackNavigator');
      });
  };

  render() {
    return (
      <AnimatedSplash
        translucent={true}
        isLoaded={this.state.isLoaded}
        logoImage={require('../../assets/images/logo.png')}
        backgroundColor="#f2f5ff"
        logoHeight={250}
        logoWidth={250}></AnimatedSplash>
    );
  }
}
export default SplashScreen;
