import React, {Component} from 'react';
import {View, FlatList, Alert, StyleSheet, AsyncStorage, Image, Text, ImageBackground, TouchableOpacity, ScrollView, Animated} from 'react-native';
import COLORS from '../utils/COLORS';
import { DashedCircularIndicator } from "rn-dashed-circular-indicator";
import Entypo from 'react-native-vector-icons/Entypo';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import {Snackbar} from 'react-native-paper';
import ProgressCircle from 'react-native-progress-circle';


import Loader from '../components/Loader';
import STRINGS from '../utils/STRINGS';
import moment from 'moment';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;

class MyCaseDetails extends Component<{}> {
  constructor(props) {
    super(props);
    console.log('this.props ' + JSON.stringify(this.props));
    this.state = {
      isLoading: true,
      isLoaded: true,
      checked: true,
      visible: false,
      visibleFailure: false,
      responseMsg:'',

      liveCampaignData:[]
    };
  }

  componentDidMount = async () => {

    console.log("global.loginResponse ", global.loginResponse.userInfo.id);
    var requestData = {userid : global.loginResponse.userInfo.id}
    this.liveCampaign(requestData);
  }

  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));

  _onDismissSnackBar = () => this.setState({visible: false});

  _onToggleSnackBarFailure = () => this.setState(state => ({visibleFailure: !state.visibleFailure}));

  _onDismissSnackBarFailure = () => this.setState({visibleFailure: false});

  liveCampaign = (requestData) =>{
    console.log(requestData + requestData)
    this.setState({isLoading: false});
    
    console.log("requestData ", requestData)
    fetch(API_url + '/api/cases/GetAdvanceLiveCampaign', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log('GetAdvanceLiveCampaign : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');
          this.setState({
            isLoading: true,
            liveCampaignData : result.data.items
          })
        }
        
      })
      .catch((error) => {
        this.setState({isLoading: true});
      });
  }

  addPayment= () =>{
    console.log("addPayment called");
  }

  render() {
    const {visibleFailure} = this.state;
    const {visible} = this.state;

    return (
      <View style={{flex:1}}>
        {!this.state.isLoading && <Loader />}

        <Snackbar
            visible={visible}
            duration={3500}
            style={{backgroundColor: COLORS.successColor}}
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
       <View style={styles.container}>
       

        <ImageBackground source={require('../../assets/images/dashboard_bg.png')} style={styles.image}>
          <View style={styles.bodyContainer}>

          <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.liveCampaignData}
          renderItem={({item}) => (

            <View style={styles.donationContainer}>
              <View style={{width:"100%", borderRadius:5}}>
                {item.defaultImageUrl == null ? (
                    <Image resizeMode="stretch" source={{uri: "https://res.cloudinary.com/helpmefund/image/upload/v1589622864/cxbps5huughlnyarlirr.png"}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                    ) : (
                  <Image resizeMode="stretch" source={{uri: item.defaultImageUrl}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                  )}
                <View style={{width:"90%", alignSelf:"center"}}>
                  <View style={{flexDirection:"row", paddingVertical:10}}>
                    <View style={{width:"70%"}}>
                      <Text style={{color:COLORS.textColorBlack, fontSize:15, fontWeight:"bold"}}>{item.title}</Text>
                    </View>
                    <View style={{width:"30%", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                      <Image resizeMode="contain" source={require('../../assets/images/group_men_black.png')} style={styles.smallImage} />
                      <Text style={{color:COLORS.textColorBlack, fontSize:15, fontWeight:"bold", marginLeft:5}}>{item.viewCount}</Text>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                      <View style={{backgroundColor: "#E5E5E5", height: 1, flex: 1, alignSelf: 'center'}} />
                  </View>

                  <View style={{paddingVertical:10}}>
                    <View style={{flexDirection:"row"}}>
                      <View style={{width:"40%"}}>

                        <ProgressCircle
                            percent={item.percentage}
                            radius={50}
                            borderWidth={10}
                            color={COLORS.green}
                            shadowColor="#EAEAEA"
                            bgColor="#fff"
                        >
                            <Text style={{ fontSize: 18, color:COLORS.textColorBlack }}>{item.percentage}%</Text>
                        </ProgressCircle>

                      </View>
                      <View style={{width:"60%"}}>
                        <View style={{paddingLeft:10}}>
                          <Text style={{marginTop:10, fontSize:18, fontWeight:"bold", color:COLORS.blue}}>Fund Raised</Text>
                          <View style={{flexDirection:"row"}}>
                            <Text style={{color:COLORS.green, marginTop:8}}>$</Text>
                            <Text style={{color:COLORS.green, fontSize:30}}>{item.totalDonations}</Text>
                          </View>
                          <Text style={{color:COLORS.textColorBlack}}>
                            <Text>OF </Text>
                            <Text style={{fontWeight:"bold"}}>$ {item.targetAmount} </Text>
                            <Text>GOAL</Text>
                          </Text>
                          <View style={{flexDirection:"row", flexWrap:"wrap"}}>
                            <Text style={{color:COLORS.textColorBlack}}>BONUS </Text>
                            <Text style={{color:COLORS.textColorBlack}}>GOAL </Text>
                            <Text style={{fontWeight:"bold",color:COLORS.blue}}>$ {item.totalDonationsBonus} </Text>
                            <Text style={{color:COLORS.textColorBlack}}>OF </Text>
                            <Text style={{fontWeight:"bold", color:COLORS.textColorBlack}}>{item.bonusGoalAmount} </Text>
                          </View>
                          <View style={{paddingVertical:15}}>
                            <Text style={{fontWeight:"bold", color:COLORS.blue}}>Time Remaining</Text>
                            <View style={{flexDirection:"row", justifyContent:"space-evenly"}}>
                              <DashedCircularIndicator
                                selectedValue={3}
                                maxValue={24}
                                radius={25}
                                anticlockwise={true}
                                activeStrokeColor={COLORS.green}
                                />
                                <DashedCircularIndicator
                                selectedValue={28}
                                maxValue={60}
                                radius={25}
                                anticlockwise={true}
                                activeStrokeColor={COLORS.blue}
                                />
                                <DashedCircularIndicator
                                selectedValue={6}
                                maxValue={60}
                                radius={25}
                                anticlockwise={true}
                                activeStrokeColor='#DC9D27'
                                />
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View>
                      <TouchableOpacity style={{borderRadius:25, borderWidth:1, borderColor:"#6188FF"}}>
                        <Text style={{textAlign:'center', paddingVertical:10, color:"#6188FF", fontWeight:"bold", fontSize:18, marginVertical:2}}>View Campaign</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>


            )}/>
            

          </View>
        </ImageBackground>
      </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    alignItems: 'center',
  },
  bodyContainer: {
    width:"90%",
    marginVertical:10
  },
  donationContainer:{
    backgroundColor:"white",
    borderRadius:5,
    marginTop:20,
  },
  vectorImg: {
    height: 100,
    width: 100,
  },
  
  handHeart: {
    height: 70,
    width: 70,
  },
  smallImage: {
    height: 30,
    width: 30,
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0"
  },
  buttonFacebook: {
    width: '90%',
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 10,
    borderColor:COLORS.green,
    borderWidth:1,
    
  },
  buttonTextSocialMedia: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.green,
    marginLeft:20,
    alignSelf:"center"
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 28,
  },
});

export default MyCaseDetails;
