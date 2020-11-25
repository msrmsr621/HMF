import Login from '../pages/Login';
import Register from '../pages/Register';
import NavigationDrawer from '../navigationDrawerMenu/NavigationDrawer';
import SplashScreen from '../pages/SplashScreen';
import ThankYou from '../pages/ThankYou';
import ForgotPassword from '../pages/ForgotPassword';
import OpenWebView from '../test/OpenWebView';
import MyProfile from '../navigationDrawerMenu/MyProfile';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Dashboard from '../navigationDrawerMenu/Dashboard';

const helpmefundLinking = {
  prefixes : ["https://www.helpmefund.org/","helpmefund://"]
}


const AppNav = createStackNavigator(
  {
    Login: {screen: Login},
    Register: {screen: Register},
    ThankYou: {screen: ThankYou},
    ForgotPassword: {screen: ForgotPassword},
    Dashboard: {screen: Dashboard},
    OpenWebView: {screen: OpenWebView},
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
    defaultNavigationOptions: {
      //  gesturesEnabled: false,
    },
  },
);

const StackNavigator = createAppContainer(<AppNav enableURLHandling={false} />);


const Routes = createSwitchNavigator(
  {
    Splash: {screen: SplashScreen},
    StackNavigator: {screen: StackNavigator},
    NavigationDrawer: {screen: NavigationDrawer},
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
    defaultNavigationOptions: {
      //  gesturesEnabled: false,
    },
  },
);

export default createAppContainer(Routes);
