/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  AsyncStorage,
} from 'react-native';
import {createAppContainer, NavigationActions, StackActions} from 'react-navigation';
import {createDrawerNavigator, DrawerActions, DrawerItems} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
// import { Ionicons } from '@expo/vector-icons';
//import Icon from 'react-native-vector-icons/AntDesign';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Icon, Divider, Avatar} from 'react-native-elements';

import Dashboard from './Dashboard';
import MyProfile from './MyProfile';
import MyCases from './MyCases';
import LiveCampaign from './LiveCampaign';
import MyCaseDetails from './MyCaseDetails';
import CustomWebView from './CustomWebView';
import LiveCampaignWebView from './LiveCampaignWebView';
import MyDonation from './MyDonation';
import DiscoverWebView from './DiscoverWebView';
import Login from '../pages/Login';
import MyContacts from './MyContacts'; 
import MyProfilePage from './MyProfilePage';  


import STRINGS from '../utils/STRINGS';
import COLORS from '../utils/COLORS';
import IMAGES from '../utils/IMAGES';


const path = 'src/navigationDrawer/NavigationDrawer.js';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'Login'})],
});

const DrawerPage = ({icon, name, onPress, type, imageIcon}) => {

  return (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center', padding: 12}}
      onPress={onPress}>

      {imageIcon == undefined ? (
        <Icon
        name={icon}
        type={type == undefined ? 'antdesign' : type}
        color={COLORS.textColorBlack}
        containerStyle={{marginHorizontal: 10}}
      />
      ) : (
        <Image resizeMode="contain" source={imageIcon} style={{height:22, width:22, marginHorizontal: 10}} />
      )}
      
      
      <Text
        style={{
          fontSize: 15,
          // fontWeight: 'bold',
          marginLeft: 10,
          color: COLORS.textColorBlack,
          flex:1
        }}>
        {name}
      </Text>

      {/* {name == 'Messages' || name == 'Subscribers' || name == 'Projects' ? (
        <Icon
          name="arrow-drop-down"
          type={'ionicons'}
          color={'gray'}
          containerStyle={{alignItems: 'flex-end', flex: 1}}
        />
      ) : null} */}
    </TouchableOpacity>
  );
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showmessage: false,
      showsubs: false,
      showMyProfile: false,
    };
  }

  render() {
    const {navigation} = this.props;
    const {showmessage, showsubs, showMyProfile} = this.state;
    console.log('state= ', showmessage, showsubs, showMyProfile);

    return (
      <View style={styles.container}>
        <View style={styles.containerProfile}>
          <View style={{paddingVertical:20, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <Image resizeMode="contain" source={require('../../assets/images/logo_navigation.png')} style={{height:50, width:160}} />
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <EvilIcons name="close" size={28} color="black" style={{marginRight:10}} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{backgroundColor: "#E5E5E5", height: 1, flex: 1, alignSelf: 'center'}} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/*
<DrawerItems {...this.props} /> */}

          <View style={{paddingVertical:20, paddingHorizontal:10}}>
            <TouchableOpacity style={{borderRadius:25, borderWidth:1, borderColor:"#F79420"}} onPress={() => navigation.navigate('Dashboard')}>
              <Text style={{textAlign:'center', paddingVertical:10, color:"#F79420", fontWeight:"bold", fontSize:18, marginVertical:2}}>Dashboard</Text>
            </TouchableOpacity>
          </View>

          {/*<DrawerPage
            imageIcon={IMAGES.touch_login}
            name="Login Option (Touch Login) / Singup"
            onPress={() => navigation.navigate('Dashboard')}
          />*/}

          <DrawerPage
            imageIcon={IMAGES.profile}
            name="My Profile"
            onPress={() => this.setState({showMyProfile: !showMyProfile, showmessage: false, showsubs:false})}
          />
          {showMyProfile ? (
            <View style={{marginLeft: '30%', marginVertical:10}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({showMyProfile:false});
                  navigation.navigate('MyProfiles');
                }}>
                <Text style={{marginBottom: 15, fontSize: 15, color:COLORS.textColorBlack}}>Basic Details</Text>
              </TouchableOpacity>

              <TouchableOpacity  
                onPress={() => {  
                  this.setState({showMyProfile:false});  
                  navigation.navigate('MyContacts');  
                }}>  
                <Text style={{marginBottom: 15, fontSize: 15, color:COLORS.textColorBlack}}>  
                  My Contacts  
                </Text>  
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => {
                  this.setState({showMyProfile:false});
                  navigation.navigate('MyCases');
                }}>
                <Text style={{marginBottom: 15, fontSize: 15, color:COLORS.textColorBlack}}>
                  My Cases / Following / My Advance Campaign
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({showMyProfile:false});
                  navigation.navigate('LiveCampaignWebView', {"url":"https://helpmefund.org/LiveCampaign", "titleName":"Live Campaign"});
                }}>
                <Text style={{marginBottom: 15, fontSize: 15, color:COLORS.textColorBlack}}>
                  Live Campaign
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({showMyProfile:false});
                  navigation.navigate('MyDonation');
                }}>
                <Text style={{marginBottom: 5, fontSize: 15, color:COLORS.textColorBlack}}>
                  My Donation
                </Text>
              </TouchableOpacity>

              
              {/* <TouchableOpacity
                onPress={() => navigation.navigate('Sent Broadcast')}>
                <Text style={{marginBottom: 5, fontSize: 16}}>
                  Sent Broadcast
                </Text>
              </TouchableOpacity> */}
            </View>
          ) : null}
          
          <DrawerPage
            imageIcon={IMAGES.discover}
            name="Discover"
            onPress={() => navigation.navigate('MyDiscoverWebView')}
          />
          <DrawerPage
            imageIcon={IMAGES.logout}
            name="Logout"
            onPress={() =>{
              
              AsyncStorage.setItem('loginEmail', '');
              AsyncStorage.setItem('loginPassword', '');
              AsyncStorage.setItem('isLogin', 'false');
              // AsyncStorage.setItem('loginResponse', JSON.stringify({}));
              AsyncStorage.setItem('loginEmail', '');
              AsyncStorage.setItem('loginPassword', '');
              
              // Actions.login();
              // this.props.navigation.navigate('Login');
              navigation.dispatch(resetAction);
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const AlertCustom  = () =>{
  console.log('AlertCustom');
  Alert.alert('Go to website to create signup form');
  Alert.alert(
    'Go to website to create signup form',
    'My Alert Msg',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ],
    { cancelable: false }
  );
  // alert("Go to website to create signup form")
  return (
    <Modal isVisible={true}>
        <View style={{flex: 1}}>
          <Text>I am the modal content!</Text>
        </View>
      </Modal>
  );
};

const DashboardStack = createStackNavigator({
  Dashboard: {
    screen: Dashboard,
    navigationOptions: ({navigation}) => ({
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerLeft: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image resizeMode="contain" source={require('../../assets/images/nav_menu.png')} style={{height:22}}/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

  TrendingCampaignWebView: {
    screen: CustomWebView,
    navigationOptions: ({navigation}) => ({
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

});

const MyProfileStack = createStackNavigator({
  MyProfile: {
    screen: MyProfile,
    navigationOptions: ({navigation}) => ({
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerLeft: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image resizeMode="contain" source={require('../../assets/images/nav_menu.png')} style={{height:22}}/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>.
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

  MyCaseDetails: {
    screen: MyCaseDetails,
    navigationOptions: ({navigation}) => ({
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

});

const MyProfileStacks = createStackNavigator({
   MyProfiles: {
    screen: MyProfilePage,
    navigationOptions: ({navigation}) => ({
      title: "My Profile",
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerLeft: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image resizeMode="contain" source={require('../../assets/images/nav_menu.png')} style={{height:22}}/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

});

const MyContactStack = createStackNavigator({
  MyContacts: {  
    screen: MyContacts,  
    navigationOptions: ({navigation}) => ({  
      title: "My Contacts",
      headerTintColor: COLORS.blue,  
      headerTitleAlign: 'center',  
      headerStyle: {  
        backgroundColor: 'white',  
      },  
      headerLeft: () => (  
        <TouchableOpacity  
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}  
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>  
          <Image resizeMode="contain" source={require('../../assets/images/nav_menu.png')} style={{height:22}}/>  
        </TouchableOpacity>  
      ),  
      headerRight: () => (  
        <TouchableOpacity  
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}  
          style={{marginRight: 10}}  
          onPress={() => {}}>  
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>  
      ),  
    }),  
  },

});

const MyCasesSatck = createStackNavigator({
  MyCases: {
    screen: MyCases,
    navigationOptions: ({navigation}) => ({
      title: "My Cases",
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerLeft: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image resizeMode="contain" source={require('../../assets/images/nav_menu.png')} style={{height:22}}/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

  MyCasesWebView: {
    screen: CustomWebView,
    navigationOptions: ({navigation}) => ({
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

});

const LiveCampaignStack = createStackNavigator({
  LiveCampaignWebView: {
    screen: LiveCampaignWebView,
    navigationOptions: ({navigation}) => ({
      title: "Live Campaign",
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerLeft: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image resizeMode="contain" source={require('../../assets/images/nav_menu.png')} style={{height:22}}/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

});

const MyDonationStack = createStackNavigator({
  MyDonation: {
    screen: MyDonation,
    navigationOptions: ({navigation}) => ({
      title: "My Donation",
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerLeft: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image resizeMode="contain" source={require('../../assets/images/nav_menu.png')} style={{height:22}}/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

  MyDonationWebView: {
    screen: CustomWebView,
    navigationOptions: ({navigation}) => ({
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

});


const MyDiscoverStack = createStackNavigator({

  MyDiscoverWebView: {
    screen: DiscoverWebView,
    navigationOptions: ({navigation}) => ({
      headerTintColor: COLORS.blue,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerLeft: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image resizeMode="contain" source={require('../../assets/images/nav_menu.png')} style={{height:22}}/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{marginRight: 10}}
          onPress={() => {}}>
          {global.loginResponse.userInfo.image == null ? (
            <Image resizeMode="contain" source={require('../../assets/images/profile_dashboard.png')} style={{height:50, width:50}} />
            ) : (
            <Avatar size="medium" rounded source={{uri:global.loginResponse.userInfo.image}}/>
            )}
        </TouchableOpacity>
      ),
    }),
  },

});

const Drawer = createDrawerNavigator(
  {
    Dashboard: {
      screen: DashboardStack,
    },

    MyContacts: {
      screen: MyContactStack,
    },

    MyProfile: {
      screen: MyProfileStack,
    },

    MyProfiles: {
      screen: MyProfileStacks,
    },

    LiveCampaign: {
      screen: LiveCampaignStack,
    },

    MyCases: {
      screen: MyCasesSatck,
    },

    MyDonation: {
      screen: MyDonationStack,
    },

    MyDiscoverWebView: {
      screen: MyDiscoverStack,
    },
    

  },
  {
    initialRouteName: 'Dashboard',
    unmountInactiveRoutes: true,
    headerMode: 'none',
    contentComponent: (items, props) => <Sidebar {...props} {...items} />,
  },
);

const AppNavigator = createStackNavigator(
  {
    Drawer: {screen: Drawer},
    NavigationDrawer : {screen : Drawer},
    Login: {screen: Login},

  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none',
    unmountInactiveRoutes: true,
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  console.log('===========================NavigationDrawer=========================')

  }

  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 0,
    flex: 1,
  },
  containerProfile: {
    paddingLeft: 20,
    // backgroundColor: 'rgba(21, 145, 225,1)',
  },
  containerRoot: {
    backgroundColor: '#f8fcff',
    paddingTop: 0,
    flex: 1,
  },
  listItem: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    marginLeft: 20,
    color: '#505e67',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(21, 145, 225,1)',
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20,
    borderColor: '#fff',
    borderWidth: 1,
  },
  profileAvatar: {
    marginTop: 20,
  },
  sidebarDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ffc33e',
    marginVertical: 0,
  },
});
