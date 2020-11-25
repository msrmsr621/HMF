import React, {Component} from 'react';
import {View, Alert, StyleSheet, Dimensions, AsyncStorage, Image, Text, ImageBackground, TouchableOpacity, ScrollView, Animated} from 'react-native';
import COLORS from '../utils/COLORS';
import { DashedCircularIndicator } from "rn-dashed-circular-indicator";
import Entypo from 'react-native-vector-icons/Entypo';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import {Snackbar} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import ProgressCircle from 'react-native-progress-circle';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import GlobalFont from 'react-native-global-font'

import Loader from '../components/Loader';
import STRINGS from '../utils/STRINGS';
import moment from 'moment';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;

const Page = ({label, text = ''}) => (
  <View style={styles.container}>
    
  </View>
);

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



class Dashboard extends Component<{}> {
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

      totalDonation:0,
      totalRecurringDonation: 0,
      totalDonationWithDate: 0,
      organisationAmount: 0,
      trendingCampaignData:[]
    };
  }

  componentDidMount = async () => {
   // console.log('dashboard called');
    // var requestData = {userid : 324}
    // 
    // let fontName = 'BigShouldersStencilDisplay-Black.ttf';
    // GlobalFont.applyGlobal(fontName)
    
    let isTouchIdEnable = await AsyncStorage.getItem('isTouchIdEnable');
    console.log("isTouchIdEnable ", isTouchIdEnable);
    if(isTouchIdEnable==null)
    {
      Alert.alert(
        'Enable Fingerprint?',
        '',
        [
          {text: 'Ok', onPress: () => {AsyncStorage.setItem('isTouchIdEnable', 'true')}},
          {text: 'Cancel', onPress: () => {AsyncStorage.setItem('isTouchIdEnable', 'false')}},
        ]
      );
    }

    
    this.setState({isLoading: false});

    // console.log("global.loginResponse ", global.loginResponse.userInfo.id);
    

    var requestDataTrending = {ownerId : global.loginResponse.userInfo.id, "IsMobile":true}
    this.trendingCampaign(requestDataTrending);

    var requestData = {userid : global.loginResponse.userInfo.id}
    this.myGivings(requestData);
  }

  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));

  _onDismissSnackBar = () => this.setState({visible: false});

  _onToggleSnackBarFailure = () => this.setState(state => ({visibleFailure: !state.visibleFailure}));

  _onDismissSnackBarFailure = () => this.setState({visibleFailure: false});

  myGivings = (requestData) =>{
    console.log(requestData + requestData)
    this.setState({isLoading: false});
    
    console.log("requestData ", requestData)
    fetch(API_url + '/api/Cases/MobileDashboard', {
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
        console.log('mygivings : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');
          this.setState({isLoading: true});
          this.setState({
            totalDonation: result.data.totalDonation,
            totalRecurringDonation: result.data.totalRecurringDonation,
            totalDonationWithDate: result.data.totalDonationWithDate,
            organisationAmount: result.data.organisationAmount,
          })
        }
        
      })
      .catch((error) => {
        this.setState({isLoading: true});
      });
  }

  
  trendingCampaign = (requestData) =>{
    console.log("trendingCampaign requestData" + requestData)
    // this.setState({isLoading: false});
    
    console.log("requestData ", requestData)
    fetch(API_url + '/api/cases/GetCasesForAdvance', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+global.loginResponse.accessToken,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log('trendingCampaign response : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');
          this.setState({isLoading: true});
          this.setState({
            trendingCampaignData: result.data.items
          })
        }
        
      })
      .catch((error) => {
        this.setState({isLoading: true});
      });
  }

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
    const userid = global.loginResponse.userInfo.id;
    var startDate;
    var endDate=moment();
    var requestData={};
    if(currentIndex==0){
      startDate=moment(endDate).subtract(1, 'days');
      requestData = {"userId": userid,"startDate": startDate,"endDate": endDate}
    }
    else if(currentIndex==1){
      startDate=moment(endDate).subtract(7, 'days');
      requestData = {"userId": userid,"startDate": startDate,"endDate": endDate}
    }
    else if(currentIndex==2){
      startDate=moment(endDate).subtract(1, 'months');
      requestData = {"userId": userid,"startDate": startDate,"endDate": endDate}
    }
    else if(currentIndex==3){
      startDate=moment(endDate).subtract(3, 'months');
      requestData = {"userId": userid,"startDate": startDate,"endDate": endDate}
    }
    else if(currentIndex==4){
      startDate=moment(endDate).subtract(1, 'year');
      requestData = {"userId": userid,"startDate": startDate,"endDate": endDate}
    }
    else{
      requestData = {"userId": userid}
    }
    this.myGivings(requestData);
  }

  
  handleChangeScreenCampaign = (currentIndex) =>{
    console.log("handleChangeScreenCampaign currentIndex ", currentIndex);
  }

  addPayment= () =>{
    console.log("addPayment called");
  }

  getTimeRemaing = (endDate, circle) =>{
    // console.log("endDate "+endDate)

    // var startDate = moment().format();

    // start time and end time
    var endDate = moment(endDate);
    var startDate = moment(new Date());
    // var days = endDate.diff(startDate, 'days');


    var duration = moment.duration(endDate.diff(startDate));
    var days = Math.floor(duration.asDays());
    var hours = duration.hours();
    var minutes = duration.minutes();
    var seconds = duration.seconds();

    // console.log("days ",days, " hours ", hours, " minutes ", minutes, " seconds ", seconds);

    if(circle == "firstCircle")
    {
      if(days > 0 )
      {
        return days+'\n\ Day';
      }
      else if( days == 0)
      {
        return hours+'\n\ HRS'
      }
      else
      {
        return '0 \n\Day';
      }
    }

    if(circle == "secondCircle")
    {
      if(days > 0 )
      {
        return hours+'\n\ HRS';
      }
      else if( days == 0)
      {
        return minutes+'\n\ MIN';
      }
      else
      {
        return '0 \n\ HRS';
      }
    }

    if(circle == "thirdCircle")
    {
      if(days > 0 )
      {
        return minutes+'\n\ MIN';
      }
      else if( days == 0)
      {
        return seconds+'\n\ SEC';
      }
      else
      {
        return '0 \n\ MIN';
      }
    }

    // duration in hours
    // var hours = parseInt(duration.asHours());

    
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
      <ScrollView showsVerticalScrollIndicator={false}>
       <View style={styles.container}>
       

        <ImageBackground source={require('../../assets/images/dashboard_bg.png')} style={styles.image}>
          <View style={styles.bodyContainer}>

            {/* my givings start */}
            <View style={styles.donationContainer}>
              <View style={{width:"90%", alignSelf: 'center', flexDirection:"row",}}>
                <View style={{width:"70%", paddingVertical:10}}>
                  <Text style={{fontSize:25, color:COLORS.textColorBlack}}>My Givings</Text>
                  <View style={{flexDirection:"row", paddingVertical:10}}>
                    <Text style={{marginTop:8, fontSize:18, color:COLORS.textColorBlack}}>$</Text>
                    <Text style={{color:COLORS.green, fontSize:30, alignContent:"flex-start"}}>{this.state.totalDonation}</Text>
                  </View>
                  <Text style={{fontSize:18}}>
                    <Text style={{color:COLORS.textColorBlack}}>Effective:</Text>
                    <Text style={{color:COLORS.green}}> $0</Text>
                  </Text>
                </View>
                <View style={{width:"30%",alignSelf:'center'}}>
                  <Image resizeMode="contain" source={require('../../assets/images/vectorImage1.png')} style={styles.vectorImg} />
                </View>
              </View>
            </View>
            {/* my givings end */}

            {/* scrollable tab wise report start */}
            <ScrollableTabView
              onChangeTab={({ i, from }) => i != from && this.handleChangeScreen(i)}
              initialPage={6}
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
              <Page tabLabel={{label: "1D"}} />
              <Page tabLabel={{label: "1W"}} />
              <Page tabLabel={{label: "1M"}} />
              <Page tabLabel={{label: "3M"}} />
              <Page tabLabel={{label: "1Y"}} />
              <Page tabLabel={{label: "ALL"}} />
            </ScrollableTabView>
            {/* scrollable tab wise report end */}


            {/* donation made start */}
            <View style={styles.donationContainer}>
              <View style={{width:"90%", alignSelf: 'center', flexDirection:"row",}}>
                <View style={{width:"70%", paddingVertical:10}}>
                  <Text style={{fontSize:15, color:COLORS.textColorBlack}}>Donations Made</Text>
                  <View style={{flexDirection:"row", paddingVertical:10}}>
                    <Text style={{marginTop:8, fontSize:15, color:COLORS.textColorBlack}}>$ </Text>
                    <Text style={{color:COLORS.green, fontSize:30, alignContent:"flex-start"}}>{this.state.totalDonationWithDate}</Text>
                  </View>
                </View>
                <View style={{width:"30%",alignSelf:'center'}}>
                  <Image resizeMode="contain" source={require('../../assets/images/hand_heart.png')} style={styles.handHeart} />
                </View>
              </View>
            </View>
            {/* donation made end */}

            {/* Recurring  Donations and Organisation Supported start */}
            <View style={{flexDirection:"row", justifyContent:'space-between', marginTop:20,}}>
              <View style={{width:"45%", backgroundColor:"#E6E0FF", padding:10, borderRadius:5}}>
                <View style={{flexDirection:"row"}}>
                  <View style={{width:"70%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>Recurring  Donations</Text>
                  </View>
                  <View style={{width:"30%", alignSelf:'center'}}>
                    <Image resizeMode="contain" source={require('../../assets/images/refresh_Image.png')} style={styles.smallImage} />
                  </View>
                </View>
                <View style={{flexDirection:"row", paddingVertical:10}}>
                    <Text style={{marginTop:8, fontSize:15, color:COLORS.textColorBlack}}>$ </Text>
                    <Text style={{color:COLORS.green, fontSize:30, alignContent:"flex-start"}}>{this.state.totalRecurringDonation}</Text>
                </View>
              </View>

              <View style={{width:"45%", backgroundColor:"#FCEED4", padding:10, borderRadius:5}}>
                <View style={{flexDirection:"row"}}>
                  <View style={{width:"70%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>Organisation Supported</Text>
                  </View>
                  <View style={{width:"30%", alignSelf:'center'}}>
                    <Image resizeMode="contain" source={require('../../assets/images/group_men.png')} style={styles.smallImage} />
                  </View>
                </View>
                <View style={{flexDirection:"row", paddingVertical:10}}>
                    <Text style={{marginTop:8, fontSize:15, color:COLORS.textColorBlack}}>$ </Text>
                    <Text style={{color:COLORS.green, fontSize:30, alignContent:"flex-start"}}>{this.state.organisationAmount}</Text>
                </View>
              </View>
            </View>
            {/* Recurring  Donations and Organisation Supported end */}

            {/* scrollable tab wise report start */}
            {/* <ScrollableTabView
              onChangeTab={({ i, from }) => i != from && this.handleChangeScreenCampaign(i)}
              initialPage={0}
              renderTabBar={() => (
                <TabBar
                  underlineColor="transparent"
                  tabBarStyle={{borderWidth: 0}}
                  renderTab={(tab, page, isTabActive, onPressHandler, onTabLayout) => (
                    <TabCampaigns
                      key={page}
                      tab={tab}
                      page={page}
                      isTabActive={isTabActive}
                      onPressHandler={onPressHandler}
                      onTabLayout={onTabLayout}
                      styles={this.interpolatorsCampaign[page]}
                    />
                  )}
                />
              )}
              onScroll={(x) => this._campaignScrollX.setValue(x)}
            >
              <Page tabLabel={{label: "Trending Campaign"}} label="Page #1 Trending Campaign"/>
              <Page tabLabel={{label: "Popular cases"}} label="Page #2 Popular cases"/>
            </ScrollableTabView> */}
            {/* scrollable tab wise report end */}

            {/* trending campaign tabs button start */}
            {/* <View style={{flexDirection:"row", justifyContent:'space-between', marginTop:20,}}>
              <View style={{width:"47%", paddingVertical:10, borderRadius:5}}>
                <TouchableOpacity style={{borderRadius:25, borderWidth:1, borderColor:"#6188FF"}}>
                  <Text style={{textAlign:'center', paddingVertical:10, color:"#6188FF", fontWeight:"bold"}}>Trending Campaign</Text>
                </TouchableOpacity>
              </View>
              <View style={{width:"47%", paddingVertical:10, borderRadius:5}}>
                <TouchableOpacity>
                  <Text style={{textAlign:'left', marginLeft: 10, paddingVertical:10, color:COLORS.textColorBlack, fontWeight:"bold"}}>Popular Cases</Text>
                </TouchableOpacity>
              </View>
            </View> */}
            {/* trending campaign tabs button end */}

            <View>
              <Text style={{textAlign:"center", marginTop:10, fontSize:25, color:COLORS.textColorBlack}}>Trending Campaign</Text>
            </View>

            {/* trending campaign start */}
            {this.state.trendingCampaignData.length == 0 ? (<View style={{justifyContent:"center", alignItems:"center", marginTop:10}}>
              <Text style={{color:COLORS.blue, fontSize: 18}}>Please Wait ...
               </Text>
              </View>) : (
            <Swiper  style={styles.wrapper} showsButtons={false} showsPagination={false} autoplay={true}>
            {this.state.trendingCampaignData.map((item) => {
            return (
              <TouchableOpacity activeOpacity={.7} key={item.uniqueIdentifier} onPress={()=>{this.props.navigation.navigate('TrendingCampaignWebView',{"url":item.uniqueIdentifier, "titleName":"Trending Campaign"})}}>
              
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
                        <View style={{width:"40%", marginTop:15}}>
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
                              <View style={{flexDirection:"row", justifyContent:"space-evenly", marginTop:10}}>
                                <View style={styles.firstCircle}>
                                  <Text style={{fontSize:12, textAlign:"center", fontWeight:"bold", color:COLORS.green}} > {this.getTimeRemaing(item.endDate, "firstCircle")} </Text>
                                </View>
                                <View style={styles.secondCircle}>
                                  <Text style={{fontSize:12, textAlign:"center", fontWeight:"bold", color:COLORS.blue}} > {this.getTimeRemaing(item.endDate, "secondCircle")} </Text>
                                </View>
                                <View style={styles.thirdCircle}>
                                  <Text style={{fontSize:12, textAlign:"center", fontWeight:"bold", color:"#DC9D27"}} > {this.getTimeRemaing(item.endDate, "thirdCircle")} </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity activeOpacity={.7} style={{borderRadius:25, borderWidth:1, borderColor:"#6188FF"}} onPress={()=>{this.props.navigation.navigate('TrendingCampaignWebView',{"url":item.uniqueIdentifier, "titleName":"Trending Campaign"})}}>
                          <Text style={{textAlign:'center', paddingVertical:10, color:"#6188FF", fontWeight:"bold", fontSize:18, marginVertical:2}}>View Campaign</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              </TouchableOpacity>)
             })}
          </Swiper>)}

            {/* trending campaign end */}

            {/* add payment method container start */}
            {/*<View style={{justifyContent:"center", alignItems:"center", marginVertical:30}}>
                <Text style={{color:COLORS.textColorBlack, textAlign:"center", width:"90%"}}>Donate with debit, credit card, bank transfer, paypal and more</Text>
                <TouchableOpacity style={styles.buttonFacebook} onPress={()=>{this.addPayment()}}>
                  <View style={{flexDirection:'row', marginLeft:15, }}>
                    <Entypo name='circle-with-plus' size={28} color={COLORS.green}/>
                    <Text style={styles.buttonTextSocialMedia}>Add a Payment Method</Text>
                  </View>
                </TouchableOpacity>
            </View>*/}
            {/* add payment method container end */}

          </View>
        </ImageBackground>
      </View>
      </ScrollView>

      <View style={styles.bottomBarMainCircle}>
        <TouchableOpacity activeOpacity={1} style={styles.bottomBarImageCircle} onPress={()=>{this.props.navigation.navigate('LiveCampaignWebView', {"url":"https://helpmefund.org/LiveCampaign", "titleName":"Live Campaign"})}}>
          <Image resizeMode="contain" source={require('../../assets/images/bottom_live_campaign.png')} style={{height:25, width:25, marginTop:18, alignSelf:"center"}} />
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', alignSelf: 'center', width: 100, bottom: 15, zIndex: 10 }}>
        <Text style={{color:COLORS.textColorBlack}}>Live Campaigns</Text>
      </View>

      <View style={{height:70, backgroundColor:"white", flexDirection:"row", justifyContent:"space-between"}}>

        <TouchableOpacity style={{alignSelf:"center", marginLeft:20, alignItems:"center"}} onPress={()=>{this.props.navigation.navigate('LiveCampaignWebView', {"url":"https://helpmefund.org/LiveCampaign", "titleName":"Live Campaign"})}}>
          <Image resizeMode="contain" source={require('../../assets/images/bottom_donate.png')} style={{height:30, width:30}} />
          <Text style={{color:COLORS.textColorBlack}}>Donate</Text>
        </TouchableOpacity>
        

        <TouchableOpacity style={{alignSelf:"center", marginRight:20, alignItems:"center"}} onPress={() => this.props.navigation.navigate('MyDiscoverWebView')}>

            <Image resizeMode="contain" source={require('../../assets/images/bottom_explore.png')} style={{height:30, width:30}} />
            <Text style={{color:COLORS.textColorBlack}}>Explore</Text>

        </TouchableOpacity>

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
    backgroundColor: "#000000a0",
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
  firstCircle:{
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:COLORS.green,
    borderWidth:1,
    borderStyle:"dashed"
  },
  secondCircle:{
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:COLORS.blue,
    borderWidth:1,
    borderStyle:"dashed"
  },
  thirdCircle:{
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#DC9D27',
    borderWidth:1,
    borderStyle:"dashed"
  },
  bottomBarImageCircle:{ 
    marginTop:3, 
    width: 60, 
    height: 60, 
    borderRadius: 35,
    borderColor: 'white',
    shadowOpacity: 0.9,
    elevation: 2, 
  },
  bottomBarMainCircle:{
    position: 'absolute',
    alignSelf: 'center',
    alignItems:"center",
    backgroundColor: 'white', 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    bottom: 35, 
    zIndex: 10
  }
});

export default Dashboard;
