/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, Alert, StyleSheet, AsyncStorage, Image, Text, ImageBackground, TouchableOpacity, ScrollView, Animated} from 'react-native';
import COLORS from '../utils/COLORS';
import { DashedCircularIndicator } from "rn-dashed-circular-indicator";
import Entypo from 'react-native-vector-icons/Entypo';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import {Snackbar} from 'react-native-paper';
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Swiper from 'react-native-swiper';
import { WebView } from 'react-native-webview';

import Loader from '../components/Loader';
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



const Tab = ({ tab, page, isTabActive, onPressHandler, onTabLayout, styles }) => {
  const { label, icon } = tab;
  //console.log("page ", page);

  const style = {
    marginHorizontal: 5,
    paddingVertical: 10,
  };
  const containerStyle = {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: styles.backgroundColor,
    borderColor: styles.borderColor,
    borderWidth:1,
    opacity: styles.opacity,
    transform: [{ scale: styles.opacity }],
  };
  const textStyle = {
    color: styles.textColor,
    fontWeight: 'bold',
  };
  return (
    <TouchableOpacity style={style} onPress={onPressHandler} onLayout={onTabLayout} key={page}>
      <Animated.View style={containerStyle}>
        <Animated.Text style={textStyle}>{label}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const TabCampaigns = ({ tab, page, isTabActive, onPressHandler, onTabLayout, styles }) => {
  const { label, icon } = tab;
 // console.log("page ", page);

  const style = {
    marginHorizontal: 5,
    paddingVertical: 10,
  };
  const containerStyle = {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: styles.backgroundColor,
    borderColor: styles.borderColor,
    borderWidth:1,
    opacity: styles.opacity,
    transform: [{ scale: styles.opacity }],
  };
  const textStyle = {
    color: styles.textColor,
    fontWeight: 'bold',
  };
  return (
    <TouchableOpacity style={style} onPress={onPressHandler} onLayout={onTabLayout} key={page}>
      <Animated.View style={containerStyle}>
        <Animated.Text style={textStyle}>{label}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};



class MyCases extends Component<{}> {
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

      myCasesData: [],
      myFollowingData:[],
      myAdvanceCampaign:[],

      indexItemCarousel:0,
      activeSlide:0,
      currentTabIndex:0,
    };
  }

  componentDidMount = async () => {
   // console.log('mycases called');

    // console.log("global.loginResponse ", global.loginResponse.userInfo.id);
    // var requestData = {"ownerId":324,"ForNonProfit":null}
    var requestData = {"ownerId":global.loginResponse.userInfo.id,"ForNonProfit":null}


    this.setState({isLoading: false});

    Promise.all([this.myCases(requestData), this.following(),this.advanceCampaign(requestData)])
    .then(([myCases, following, advanceCampaign]) => {
      // console.log('getProjects  '+getProjects);
      // console.log('getTotal ' + JSON.stringify(getTotal));
      // console.log('getGraphData ' + JSON.stringify(getGraphData));
      // console.log('getReportList ' + JSON.stringify(getReportList));
      
    });
          // this.setState({isLoading: true});

  }

  myCases = (requestData) =>{
    console.log(requestData + requestData)
    // this.setState({isLoading: false});
    
    console.log("requestData ", requestData)
    fetch(API_url + '/api/getusingpost/cases', {
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
        this.setState({isLoading: true});
        // console.log('myCases : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');
          // this.setState({isLoading: true});
          this.setState({
            myCasesData: result.data.items,
            
          })
        }
        
      })
      .catch((error) => {
        // this.setState({isLoading: true});
      });
  }

  advanceCampaign = (requestData) =>{
    console.log(requestData + requestData)
    // this.setState({isLoading: false});
    
    console.log("requestData ", requestData)
    fetch(API_url + '/api/cases/GetCasesForAdvance', {
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

        // console.log('advanceCampaign : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');
          // this.setState({isLoading: true});
          this.setState({
            myAdvanceCampaign: result.data.items,
            
          })
        }
        
      })
      .catch((error) => {
        // this.setState({isLoading: true});
      });
  }

  following = () =>{
    // this.setState({isLoading: false});
    
    fetch(API_url + '/api/me/cases/likes', {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+global.loginResponse.accessToken
      },
      body: JSON.stringify(),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log('following : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');
          // this.setState({isLoading: true});
          this.setState({
            myFollowingData: result.data.items,
            
          })
        }
        
      })
      .catch((error) => {
        // this.setState({isLoading: true});
      });
  }

  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));

  _onDismissSnackBar = () => this.setState({visible: false});

  _onToggleSnackBarFailure = () => this.setState(state => ({visibleFailure: !state.visibleFailure}));

  _onDismissSnackBarFailure = () => this.setState({visibleFailure: false});


  // scrollable date wise tabs
  _scrollX = new Animated.Value(0);
  // 6 is a quantity of tabs
  interpolators = Array.from({ length: 6 }, (_, i) => i).map(idx => ({
    scale: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    }),
    opacity: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    }),
    textColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#424242', '#6188ff', '#424242'],
    }),
    backgroundColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#00000000', '#00000000', '#00000000'],
      extrapolate: 'clamp',
    }),
    borderColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#00000000', '#6188ff', '#00000000'],
    }),
  }));

  // scrollable campaign tabs
  _campaignScrollX = new Animated.Value(0);
  // 2 is a quantity of tabs
  interpolatorsCampaign = Array.from({ length: 2 }, (_, i) => i).map(idx => ({
    scale: this._campaignScrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    }),
    opacity: this._campaignScrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    }),
    textColor: this._campaignScrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#424242', '#6188ff', '#424242'],
    }),
    backgroundColor: this._campaignScrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#00000000', '#00000000', '#00000000'],
      extrapolate: 'clamp',
    }),
    borderColor: this._campaignScrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#00000000', '#6188ff', '#00000000'],
    }),
  }));

  handleChangeScreen = (currentIndex) =>{
    console.log(currentIndex);
    this.setState({currentTabIndex: currentIndex});
    
  }

  
  handleChangeScreenCampaign = (currentIndex) =>{
    console.log("handleChangeScreenCampaign currentIndex ", currentIndex);
  }

  addPayment= () =>{
    console.log("addPayment called");
  }

  upperCase = (text) =>{
    const sentence = text; 
    return sentence.toUpperCase(); 
  }

  renderItem = ({item}) => (
    <View style={styles.donationContainer}>
              <View style={{width:"100%", borderRadius:5}}>
                {item.defaultImageUrl == null ? (
                    <Image resizeMode="stretch" source={{uri: "https://res.cloudinary.com/helpmefund/image/upload/v1589622864/cxbps5huughlnyarlirr.png"}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                    ) : (
                  <Image resizeMode="stretch" source={{uri: item.defaultImageUrl}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                  )}
                
                <View style={{width:"100%", padding:20, alignSelf:"center", marginTop:20}}>
                
                 <Text style={{fontSize:18, color:COLORS.grey, fontWeight:"bold"}}>{this.upperCase(item.causeType.name)}</Text>
                 <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold", marginTop:10}}>{item.title}</Text>

                 <View style={{flexDirection:"row", marginTop:5, flexWrap:"wrap"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>Case No. :- </Text>
                    <Text style={{fontSize:15, color:COLORS.grey}}>{item.caseNumber}</Text>
                 </View>

                 <View style={{flexDirection:"row", marginTop:20, flexWrap:"wrap"}}>
                     <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>Target : </Text>
                     <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>${item.targetAmount}.00</Text>
                 </View>

                 <View style={{flexDirection:"row", marginTop:20, flexWrap:"wrap"}}>
                     <View style={{width:"85%", flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>${item.totalDonations}.00 </Text>
                        <Text style={{fontSize:15, color:COLORS.textColorBlack,}}>raised</Text>
                     </View>
                     <View>
                        <Text style={{fontSize:18, color:COLORS.blue}}>{item.percentageAchieved}%</Text>
                     </View>
                 </View>

                 <Progress.Bar
                        style={styles.progress}
                        progress={item.percentageAchieved/100}
                       width={280}
                       style={{marginTop:10}}
                       color={COLORS.green}
                       height={15}
                       borderRadius={25}
                />

                <View style={{flexDirection:"row", marginTop:10}}>
                    <MaterialCommunityIcons name='calendar' size={26} color={COLORS.textColorBlack}/>
                    <Text style={{fontSize:18, color:COLORS.textColorBlack, marginLeft:5}}>Target date not set</Text>
                </View>

                </View>
              </View>
            </View>
  );

  renderPagination = () => (
    <Pagination
      dotsLength={this.state.myCasesData.length}
      activeDotIndex={this.state.activeSlide}
      dotStyle={styles.dotStyle}
      containerStyle={styles.paginationContainer}
    />
  );


  Page1 = ({label, text = ''}) => (
   <ScrollView showsVerticalScrollIndicator={false}>

      <Swiper  style={styles.wrapper} showsButtons={false} showsPagination={false}>
        {this.state.myCasesData.map((item) => {
            return (
             <TouchableOpacity activeOpacity={.7} key={item.uniqueIdentifier} onPress={()=>{this.props.navigation.navigate('MyCasesWebView',{"url":item.uniqueIdentifier, "titleName":"My Cases"})}}>
              <View style={styles.donationContainer}>
              <View style={{width:"100%", borderRadius:5}}>
                {item.defaultImageUrl == null ? (
                    <Image resizeMode="stretch" source={{uri: "https://res.cloudinary.com/helpmefund/image/upload/v1589622864/cxbps5huughlnyarlirr.png"}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                    ) : (
                  <Image resizeMode="stretch" source={{uri: item.defaultImageUrl}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                  )}
                
                <View style={{width:"100%", padding:20, alignSelf:"center", marginTop:20}}>
                
                 <Text style={{fontSize:18, color:COLORS.grey, fontWeight:"bold"}}>{this.upperCase(item.causeType.name)}</Text>
                 <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold", marginTop:10}}>{item.title}</Text>

                 <View style={{flexDirection:"row", marginTop:5, flexWrap:"wrap"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>Case No. :- </Text>
                    <Text style={{fontSize:15, color:COLORS.grey}}>{item.caseNumber}</Text>
                 </View>

                 <View style={{flexDirection:"row", marginTop:20, flexWrap:"wrap"}}>
                     <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>Target : </Text>
                     <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>${item.targetAmount}.00</Text>
                 </View>

                 <View style={{flexDirection:"row", marginTop:20, flexWrap:"wrap"}}>
                     <View style={{width:"85%", flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>${item.totalDonations}.00 </Text>
                        <Text style={{fontSize:15, color:COLORS.textColorBlack,}}>raised</Text>
                     </View>
                     <View>
                        <Text style={{fontSize:18, color:COLORS.blue}}>{item.percentageAchieved}%</Text>
                     </View>
                 </View>

                 <Progress.Bar
                        style={styles.progress}
                        progress={item.percentageAchieved/100}
                       width={280}
                       style={{marginTop:10}}
                       color={COLORS.green}
                       height={15}
                       borderRadius={25}
                />

                <View style={{flexDirection:"row", marginTop:10}}>
                    <MaterialCommunityIcons name='calendar' size={26} color={COLORS.textColorBlack}/>
                    <Text style={{fontSize:18, color:COLORS.textColorBlack, marginLeft:5}}>Target date not set</Text>
                </View>

                </View>
              </View>
              </View>
              </TouchableOpacity>
            )
         })}
      </Swiper>

       </ScrollView >

  );

  Page2 = ({label, text = ''}) => (
  <ScrollView showsVerticalScrollIndicator={false}>
 <Swiper  style={styles.wrapper} showsButtons={false} showsPagination={false}>
        {this.state.myFollowingData.map((item) => {
            return (
            <TouchableOpacity activeOpacity={.7} key={item.uniqueIdentifier} onPress={()=>{this.props.navigation.navigate('MyCasesWebView',{"url":item.uniqueIdentifier,"titleName":"Following"})}}>

              <View style={styles.donationContainer}>
              <View style={{width:"100%", borderRadius:5}}>
                {item.defaultImageUrl == null ? (
                    <Image resizeMode="stretch" source={{uri: "https://res.cloudinary.com/helpmefund/image/upload/v1589622864/cxbps5huughlnyarlirr.png"}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                    ) : (
                  <Image resizeMode="stretch" source={{uri: item.defaultImageUrl}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                  )}
                
                <View style={{width:"100%", padding:20, alignSelf:"center", marginTop:20}}>
                
                 <Text style={{fontSize:18, color:COLORS.grey, fontWeight:"bold"}}>{this.upperCase(item.causeType.name)}</Text>
                 <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold", marginTop:10}}>{item.title}</Text>

                 <View style={{flexDirection:"row", marginTop:5, flexWrap:"wrap"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>Case No. :- </Text>
                    <Text style={{fontSize:15, color:COLORS.grey}}>{item.caseNumber}</Text>
                 </View>

                 <View style={{flexDirection:"row", marginTop:20, flexWrap:"wrap"}}>
                     <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>Target : </Text>
                     <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>${item.targetAmount}.00</Text>
                 </View>

                 <View style={{flexDirection:"row", marginTop:20, flexWrap:"wrap"}}>
                     <View style={{width:"85%", flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>${item.totalDonations}.00 </Text>
                        <Text style={{fontSize:15, color:COLORS.textColorBlack,}}>raised</Text>
                     </View>
                     <View>
                        <Text style={{fontSize:18, color:COLORS.blue}}>{item.percentageAchieved}%</Text>
                     </View>
                 </View>

                 <Progress.Bar
                        style={styles.progress}
                        progress={item.percentageAchieved/100}
                       width={280}
                       style={{marginTop:10}}
                       color={COLORS.green}
                       height={15}
                       borderRadius={25}
                />

                <View style={{flexDirection:"row", marginTop:10}}>
                    <MaterialCommunityIcons name='calendar' size={26} color={COLORS.textColorBlack}/>
                    <Text style={{fontSize:18, color:COLORS.textColorBlack, marginLeft:5}}>Target date not set</Text>
                </View>

                </View>
              </View>
              </View>
            </TouchableOpacity>
            )
         })}
      </Swiper>
   </ScrollView >

  );

  Page3 = ({label, text = ''}) => (
    <ScrollView showsVerticalScrollIndicator={false}>

 <Swiper showsButtons={false} showsPagination={false}>
        {this.state.myAdvanceCampaign.map((item) => {
            return (
            <TouchableOpacity activeOpacity={.7} key={item.uniqueIdentifier} onPress={()=>{this.props.navigation.navigate('MyCasesWebView',{"url":item.uniqueIdentifier, "titleName":"Advance Campaign"})}}>

              <View style={styles.donationContainer}>
              <View style={{width:"100%", borderRadius:5}}>
                {item.defaultImageUrl == null ? (
                    <Image resizeMode="stretch" source={{uri: "https://res.cloudinary.com/helpmefund/image/upload/v1589622864/cxbps5huughlnyarlirr.png"}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                    ) : (
                  <Image resizeMode="stretch" source={{uri: item.defaultImageUrl}} style={{width:"100%", height:250, borderTopLeftRadius:5, borderTopRightRadius:5}} />
                  )}
                
                <View style={{width:"100%", padding:20, alignSelf:"center", marginTop:20}}>
                
                 <Text style={{fontSize:18, color:COLORS.grey, fontWeight:"bold"}}>{this.upperCase(item.causeType.name)}</Text>
                 <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold", marginTop:10}}>{item.title}</Text>

                 <View style={{flexDirection:"row", marginTop:5, flexWrap:"wrap"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>Case No. :- </Text>
                    <Text style={{fontSize:15, color:COLORS.grey}}>{item.caseNumber}</Text>
                 </View>

                 <View style={{flexDirection:"row", marginTop:20, flexWrap:"wrap"}}>
                     <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>Target : </Text>
                     <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>${item.targetAmount}.00</Text>
                 </View>

                 <View style={{flexDirection:"row", marginTop:20, flexWrap:"wrap"}}>
                     <View style={{width:"85%", flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:18, color:COLORS.textColorBlack, fontWeight:"bold"}}>${item.totalDonations}.00 </Text>
                        <Text style={{fontSize:15, color:COLORS.textColorBlack,}}>raised</Text>
                     </View>
                     <View>
                        <Text style={{fontSize:18, color:COLORS.blue}}>{item.percentageAchieved}%</Text>
                     </View>
                 </View>

                 <Progress.Bar
                        style={styles.progress}
                        progress={item.percentageAchieved/100}
                       width={280}
                       style={{marginTop:10}}
                       color={COLORS.green}
                       height={15}
                       borderRadius={25}
                />

                <View style={{flexDirection:"row", marginTop:10}}>
                    <MaterialCommunityIcons name='calendar' size={26} color={COLORS.textColorBlack}/>
                    <Text style={{fontSize:18, color:COLORS.textColorBlack, marginLeft:5}}>Target date not set</Text>
                </View>

                </View>
              </View>
            </View>
            </TouchableOpacity>

            )
         })}
      </Swiper>
             </ScrollView >

  );



  render() {
    const {visibleFailure} = this.state;
    const {visible} = this.state;

    return (
      <View style={styles.container}>

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
        <ImageBackground source={require('../../assets/images/dashboard_bg.png')} style={styles.image}>

       {/* scrollable tab wise report start */}
            <ScrollableTabView

              onChangeTab={({ i, from }) => i != from && this.handleChangeScreen(i)}
              initialPage={0}
              renderTabBar={() => (
                <TabBar
                  underlineColor="transparent"
                  tabBarStyle={{borderWidth: 0}}
                  renderTab={(tab, page, isTabActive, onPressHandler, onTabLayout) => (
                    <Tab
                      key={page}
                      tab={tab}
                      page={page}
                      isTabActive={isTabActive}
                      onPressHandler={onPressHandler}
                      onTabLayout={onTabLayout}
                      styles={this.interpolators[page]}
                    />
                  )}
                />
              )}
              onScroll={(x) => this._scrollX.setValue(x)}
            >
              <this.Page1 tabLabel={{label: "MY CASES"}} label="Page #1 My Cases"/>
              <this.Page2 tabLabel={{label: "FOLLOWING"}} label="Page #2 Following"/>
              <this.Page3 tabLabel={{label: "ADVANCE CAMPAIGN"}} label="Page #3 Advacnce Campaign"/>
            </ScrollableTabView>
            {/* scrollable tab wise report end */}

      </ImageBackground>

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
    width:"100%",
    marginVertical:10,
  },
  donationContainer:{
    backgroundColor:"white",
    borderRadius:5,
    marginTop:20,
    width:"90%",
    justifyContent:"center",
    alignSelf:"center"
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
  paginationContainer: {
    paddingVertical: 4,
  },
  dotStyle: {
    backgroundColor: colors.white,
  },
});

export default MyCases;
