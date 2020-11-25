

import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions, TouchableHighlight } from 'react-native';
import { WebView } from 'react-native-webview';
import Svg, {Path, Circle} from 'react-native-svg'



export default class OpenWebView extends Component {
  render() {

  	

    return(<View style={{flex:1}}>
    		
    		  <View
      style = {{
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:"green",
        borderWidth:2,
        borderStyle:"dashed"
      }}
    >

      <Text style={{fontSize:12, textAlign:"center", fontWeight:"bold", color:"green"}} > 21{"\n"} Days </Text>
    </View>

    	</View>)
  }
}
