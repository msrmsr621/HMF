import React, { useState, useEffect } from 'react';
import {StyleSheet, View, StatusBar, ScrollView, SafeAreaView} from 'react-native';
import GlobalFont from 'react-native-global-font'

import Login from './src/pages/Login';
import Register from './src/pages/Register';
import UnderlineTabBarExample from './src/test/UnderlineTabBarExample';
import MyCarousel from './src/test/MyCarousel';
import SwiperPage from './src/test/SwiperPage';
import OpenWebView from './src/test/OpenWebView';

import FingerPrintTouch from './src/test/FingerPrintTouch';
import MyCases from './src/navigationDrawerMenu/MyCases';
import MyDonation from './src/navigationDrawerMenu/MyDonation';

import Routes from './src/components/Routes';
import COLORS from './src/utils/COLORS';


export default function App() {
  console.disableYellowBox = true;
  useEffect(() => {
    console.log("useEffect");
    // Update the document title using the browser API
    
  });
  return (
    <View style={styles.container}>
         <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = {COLORS.blue} translucent = {true}/>
          <Routes />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
