import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
  StyleSheet,
} from 'react-native';
 
import FingerprintScanner from 'react-native-fingerprint-scanner';
import ShakingText from '../components/ShakingText.component';

// - this example component supports both the
//   legacy device-specific (Android < v23) and
//   current (Android >= 23) biometric APIs
// - your lib and implementation may not need both
class BiometricPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined,
    };
 
    this.description = null;
  }
 
  componentDidMount() {
    if (this.requiresLegacyAuthentication()) {
      this.authLegacy();
    } else {
      this.authCurrent();
    }
  }
 
  componentWillUnmount = () => {
    FingerprintScanner.release();
  }
 
  requiresLegacyAuthentication() {
    return Platform.Version < 23;
  }
 
  authCurrent() {
    FingerprintScanner
      .authenticate({ title: 'Log in with Biometrics' })
      .then(() => {
        // this.props.onAuthenticate();
        console.log("successfully Login");
      });
  }
 
  authLegacy() {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttemptedLegacy })
      .then(() => {
        this.props.handlePopupDismissedLegacy();
        Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
      })
      .catch((error) => {
        this.setState({ errorMessageLegacy: error.message, biometricLegacy: error.biometric });
        this.description.shake();
      });
  }
 
  handleAuthenticationAttemptedLegacy = (error) => {
    this.setState({ errorMessageLegacy: error.message });
    this.description.shake();
  };
 
  renderLegacy() {
    const { errorMessageLegacy, biometricLegacy } = this.state;
    const { style, handlePopupDismissedLegacy } = this.props;
 
    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>
 
          <Image
            style={styles.logo}
            source={require('../../assets/images/finger_print.png')}
          />
 
          <Text style={styles.heading}>
            Biometric{'\n'}Authentication
          </Text>
          <ShakingText
            ref={(instance) => { this.description = instance; }}
            style={styles.description(!!errorMessageLegacy)}>
            {errorMessageLegacy || `Scan your ${biometricLegacy} on the\ndevice scanner to continue`}
          </ShakingText>
 
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissedLegacy}
          >
            <Text style={styles.buttonTextFingerPrint}>
              BACK TO MAIN
            </Text>
          </TouchableOpacity>
 
        </View>
      </View>
    );
  }
 
 
  render = () => {
    if (this.requiresLegacyAuthentication()) {
      return this.renderLegacy();
    }
 
    // current API UI provided by native BiometricPrompt
    return null;
  }
}
 
BiometricPopup.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
  handlePopupDismissedLegacy: PropTypes.func,
  style: ViewPropTypes.style,
};

const styles = StyleSheet.create({
    container: {
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
 
export default BiometricPopup;