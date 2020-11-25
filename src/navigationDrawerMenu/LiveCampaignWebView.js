


import React, { Component } from 'react';
import { Text, StyleSheet, SafeView, View } from 'react-native';
import { WebView } from 'react-native-webview'

import STRINGS from '../utils/STRINGS';
import moment from 'moment';

import {
  colors,
  carouselData,
  SCREEN_WIDTH,
  CAROUSEL_ITEM_WIDTH,
  USERS,
} from '../utils/constants';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;
class LiveCampaignWebView extends React.Component {

  constructor(props) {
    super(props);
    console.log('this.props ' + JSON.stringify(this.props));
    var fullUrl = WebsiteUrl+'/'+this.props.navigation.state.params.url;
    this.state = {
      fullUrl:fullUrl,
    };
  }

  componentDidMount(){
    
  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', navigation.getParam('titleName')),
})


  render() {
    return (
      <WebView source={{ uri: "https://helpmefund.org/LiveCampaign" }}
      />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  loading: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});


export default LiveCampaignWebView;
