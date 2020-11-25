/* eslint-disable prettier/prettier */
import React from 'react';
import {View,Platform,FlatList, TextInput,Alert, StyleSheet, AsyncStorage, Image, Text, ImageBackground, TouchableOpacity, ScrollView, Animated} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {
  createDrawerNavigator,
  DrawerActions,
  DrawerItems,
} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import {Snackbar} from 'react-native-paper';
import { SearchBar } from 'react-native-elements';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';

// import { Ionicons } from '@expo/vector-icons';
//import Icon from 'react-native-vector-icons/AntDesign';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Icon, Divider, Avatar} from 'react-native-elements';
import filter from 'lodash.filter'
import moment from 'moment';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import STRINGS from '../utils/STRINGS';
import COLORS from '../utils/COLORS';
import IMAGES from '../utils/IMAGES';
import Loader from '../components/Loader';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;

var dropDownDonation=[{label: "Donation", value: "donation", key: 0, color: COLORS.textColorBlack},
                      {label: "Scheduled Donation", value: "scheduled_donation", key: 1, color: COLORS.textColorBlack},
                      {label: "Recurring Donation", value: "recurring_donation", key: 2, color: COLORS.textColorBlack}];

export default class MyDonation extends React.Component {
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

      myDonationData:[],
      filteredDataSource: [],
      isModalVisible: false,
      currentItem: {},
      currentIndex: 0,
      searchText:'',

      scheuledDonationData:[],
      filteredScheuledDonationData: [],
      isModalVisibleScheduledDonation: false,
      currentItemScheduledDonation: {},
      currentIndexScheduledDonation: 0,

      recurringDonationData:[],
      filteredRecurringDonationData: [],
      isModalVisibleRecurringDonation: false,
      currentItemRecurringDonation: {},
      currentIndexRecurringDonation: 0,

      dropDownDonation:dropDownDonation,
      pickerValueHolderDonation: 'donation',
      pickerKeyHolderDonation: 0,


    };
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    console.log('===========================MyDonation=========================')
    this.setState({isLoading: false});

    Promise.all([this.myDonation(), this.scheduledDonation(), this.recurringDonation()])
    .then(([myDonation,scheduledDonation, recurringDonation]) => {
      // console.log('getReportList ' + JSON.stringify(getReportList));
      
    });

  }

  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));

  _onDismissSnackBar = () => this.setState({visible: false});

  _onToggleSnackBarFailure = () => this.setState(state => ({visibleFailure: !state.visibleFailure}));

  _onDismissSnackBarFailure = () => this.setState({visibleFailure: false});

  toggleModal = (item, index) => {
    console.log("item ", item);
    console.log("index ", index);
    this.setState({
      currentItem: item,
      currentIndex: index,
      isModalVisible: !this.state.isModalVisible,
    });
  };

  toggleModalScheduledDonation = (item, index) => {
    console.log("item ", item);
    console.log("index ", index);
    this.setState({
      currentItemScheduledDonation: item,
      currentIndexScheduledDonation: index,
      isModalVisibleScheduledDonation: !this.state.isModalVisibleScheduledDonation,
    });
  };

  toggleModalRecurringDonation = (item, index) => {
    console.log("item ", item);
    console.log("index ", index);
    this.setState({
      currentItemRecurringDonation: item,
      currentIndexRecurringDonation: index,
      isModalVisibleRecurringDonation: !this.state.isModalVisibleRecurringDonation,
    });
  };


  myDonation = () =>{
    // this.setState({isLoading: false});
    
    fetch(API_url + '/api/me/Donations/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
         Authorization: 'Bearer '+global.loginResponse.accessToken,        
      },
      body: JSON.stringify(),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // console.log('mygivings : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');

          // Innitializing for zero index object.
          var currentItem={};
          if(result.data.items.length>0)
          {
            currentItem = result.data.items[0];
          }

          this.setState({isLoading: true});
          this.setState({
            myDonationData: result.data.items,
            filteredDataSource:result.data.items,
            currentItem :currentItem
          })
        }
        
      })
      .catch((error) => {
        this.setState({isLoading: true});
      });
  }

  scheduledDonation = () =>{
    // this.setState({isLoading: false});
    
    fetch(API_url + '/api/me/ScheduleDonations/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+global.loginResponse.accessToken,
      },
      body: JSON.stringify(),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // console.log('scheduledDonation : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');

          // Innitializing for zero index object.
          var currentItemScheduledDonation={};
          if(result.data.items.length>0)
          {
            currentItemScheduledDonation = result.data.items[0];
          }

          this.setState({isLoading: true});
          this.setState({
            scheuledDonationData: result.data.items,
            filteredScheuledDonationData:result.data.items,
            currentItemScheduledDonation :currentItemScheduledDonation
          })
        }
        
      })
      .catch((error) => {
        this.setState({isLoading: true});
      });
  }

  recurringDonation = () =>{
    // this.setState({isLoading: false});
    
    fetch(API_url + '/api/me/Subscriptions/?filter=1', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',

        Authorization: 'Bearer '+global.loginResponse.accessToken,
      },
      body: JSON.stringify(),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // console.log('recurringDonation : ' + JSON.stringify(result));
        if (typeof result === 'string') {
          console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          console.log('this is json');

          // Innitializing for zero index object.
          var currentItemRecurringDonation={};
          if(result.data.items.length>0)
          {
            currentItemRecurringDonation = result.data.items[0];
          }

          this.setState({isLoading: true});
          this.setState({
            recurringDonationData: result.data.items,
            filteredRecurringDonationData:result.data.items,
            currentItemRecurringDonation :currentItemRecurringDonation
          })
        }
        
      })
      .catch((error) => {
        this.setState({isLoading: true});
      });
  }

  // searchFilterFunction = text => {
  //   this.setState({searchText: text});

  //   const newData = this.state.myDonationData.filter(item => {
  //     const itemData = `${item.case.title.toUpperCase()}`;
  //     const textData = text.toUpperCase();
  //     return itemData.indexOf(textData) > -1;
  //   });

  //   this.setState({filteredDataSource: newData});
  // };

  handleSearch = text => {
    const formattedQuery = text.toLowerCase()
    const data = filter(this.state.myDonationData, user => {
      return this.contains(user, formattedQuery)
    })
    this.setState({ data, query: text })
  }

  searchFilterFunction = text => {
    this.setState({searchText: text});

    const filteredUsers = this.state.myDonationData.filter(item => {
    const query = text.toUpperCase();
 
    if(item.uniqueIdentifier!=null && item.case.title!=null)
    {
      const caseData = `${item.case.title.toUpperCase()}`;
      const uniqueIdentifierData = `${item.uniqueIdentifier.toUpperCase()}`;
      return (
        caseData.indexOf(query) >= 0 ||
        uniqueIdentifierData.indexOf(query) >= 0
      )
      
    }
  });

    this.setState({filteredDataSource: filteredUsers});

  }

  

  contains = ({ uniqueIdentifier }, query) => {
    if (
      uniqueIdentifier.includes(query)
    ) {
      return true
    }
    return false
  }

  renderItem = (item, index) =>{
    return(<View style={{borderWidth:1, borderColor:COLORS.grey, borderRadius:3}}>
                
                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack, fontWeight:"bold"}}>No:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{index+1}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Donation Id:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{item.uniqueIdentifier}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Case Title:</Text>
                  </View>
                  <View style={{width:"65%", flexDirection:"row", alignItems:"center", justifyContent: 'space-between',flexWrap:"wrap"}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MyDonationWebView', {"url":item.case.uniqueIdentifier, "titleName":item.case.title})}}>
                      <Text style={{fontSize:15, color:COLORS.blue}} >{item.case.title}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderRadius:25, borderWidth:2, borderColor:COLORS.blue, marginHorizontal:5}} onPress={() =>this.toggleModal(item, index)}>
                        <Text style={{color:COLORS.blue, paddingHorizontal:5, paddingVertical:5, fontWeight:"bold"}}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Amount:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>${item.amount}</Text>
                  </View>
                </View>

              </View>)
  }

  renderItemForModal = (item, index) =>{
    return(<View>
                
                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack, fontWeight:"bold"}}>No:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{index+1}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Donation Id:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{item.uniqueIdentifier}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Case Title:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{item.case.title}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Amount:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>${item.amount}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Platform Tip:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>${item.platformFee}({item.platformPercentage}%)</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Date:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{moment(item.dateCreated).format('MMMM Do YYYY')}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Card Number:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{item.cardLastFourDigit}</Text>
                  </View>
                </View>

              </View>)
  }

  renderItemScheduledDonation = (item, index) =>{
    return(<View style={{borderWidth:1, borderColor:COLORS.grey, borderRadius:3}}>
                
                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack, fontWeight:"bold"}}>No:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{index+1}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Case Title:</Text>
                  </View>
                  <View style={{width:"65%", flexDirection:"row", alignItems:"center", justifyContent: 'space-between',flexWrap:"wrap"}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MyDonationWebView', {"url":item.case.uniqueIdentifier, "titleName":item.case.title})}}>
                      <Text style={{fontSize:15, color:COLORS.blue}} >{item.case.title}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderRadius:25, borderWidth:2, borderColor:COLORS.blue, marginHorizontal:5}} onPress={() =>this.toggleModalScheduledDonation(item, index)}>
                        <Text style={{color:COLORS.blue, paddingHorizontal:5, paddingVertical:5, fontWeight:"bold"}}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Amount:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>${item.amount}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Comment:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{item.remark}</Text>
                  </View>
                </View>

              </View>)
  }

  renderItemModalScheduledDonation = (item, index) =>{
    return(<View style={{}}>
                
                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack, fontWeight:"bold"}}>No:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{index+1}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Case Title:</Text>
                  </View>
                  <View style={{width:"65%", flexDirection:"row", alignItems:"center", justifyContent: 'space-between',flexWrap:"wrap"}}>
                      <Text style={{fontSize:15, color:COLORS.textColorBlack}} >{item.case.title}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Amount:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>${item.amount}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Platform Tip:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>${item.platformFee}({item.platformPercentage}%)</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Comment:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{item.remark}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Date:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{moment(item.dateCreated).format('MMMM Do YYYY')}</Text>
                  </View>
                </View>

              </View>)
  }

  status = (isDeleted, isPaused, numberOfPayment, numberOfPaymentSuccessed, ) =>{
    console.log("isDeleted ", isDeleted, " isPaused ", isPaused, " numberOfPayment ", numberOfPayment, " numberOfPaymentSuccessed ", numberOfPaymentSuccessed);
    var data = "";
    if(isPaused == true)
    {
      data = "Paused";
    }
    else
    {
      if(isDeleted == false && isPaused == false)
      {
        data = "Running"
      }
      else if(isDeleted == true && isPaused == false)
      {
        data = "Finished"
      }
      else if(isDeleted == true && isPaused == true)
      {
        data = "Paused"
      }
      else if(isDeleted && numberOfPayment !=numberOfPaymentSuccessed)
      {
        console.log("insideeeeeeeeeeeeeeeeeeeee")
        data = "Cancelled"
      }    
    }

    return data;
  }

  renderItemRecurringDonation = (item, index) =>{
    return(<View style={{borderWidth:1, borderColor:COLORS.grey, borderRadius:3}}>
                
                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack, fontWeight:"bold"}}>No:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{index+1}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Case Title:</Text>
                  </View>
                  <View style={{width:"65%", flexDirection:"row", alignItems:"center", justifyContent: 'space-between',flexWrap:"wrap"}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MyDonationWebView', {"url":item.case.uniqueIdentifier, "titleName":item.case.title})}}>
                      <Text style={{fontSize:15, color:COLORS.blue}} >{item.case.title}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderRadius:25, borderWidth:2, borderColor:COLORS.blue, marginHorizontal:5}} onPress={() =>this.toggleModalRecurringDonation(item, index)}>
                        <Text style={{color:COLORS.blue, paddingHorizontal:5, paddingVertical:5, fontWeight:"bold"}}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Amount:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>${item.amount}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Status:</Text>
                  </View>
                  {this.status(item.isDeleted, item.isPaused, item.numberOfPayment, item.numberOfPaymentSuccessed) == "Paused" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:"red"}}>Paused</Text>
                  </View>) : null}

                  {this.status(item.isDeleted, item.isPaused, item.numberOfPayment, item.numberOfPaymentSuccessed) == "Finished" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:"red"}}>Finished</Text>
                  </View>) : null}

                  {this.status(item.isDeleted, item.isPaused, item.numberOfPayment, item.numberOfPaymentSuccessed) == "Running" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:"green"}}>Running</Text>
                  </View>) : null}

                  {this.status(item.isDeleted, item.isPaused, item.numberOfPayment, item.numberOfPaymentSuccessed) == "Cancelled" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:"red"}}>Cancelled</Text>
                  </View>) : null}
                  
                </View>

              </View>)
  }

  renderItemModalRecurringDonation = (item, index) =>{
    return(<View style={{}}>
                
                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack, fontWeight:"bold"}}>No:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{index+1}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Case Title:</Text>
                  </View>
                  <View style={{width:"65%", flexDirection:"row", alignItems:"center", justifyContent: 'space-between',flexWrap:"wrap"}}>
                      <Text style={{fontSize:15, color:COLORS.textColorBlack}} >{item.case.title}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Amount:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>${item.amount}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Donation Interval:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{moment(item.dateCreated).format('MMMM Do YYYY')}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Next Running Date:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>{moment(item.dateCreated).format('MMMM Do YYYY')}</Text>
                  </View>
                </View>


                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>IS LJC:</Text>
                  </View>
                  {item.isOjc == "true" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>True</Text>
                  </View>) : (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:COLORS.textColorBlack}}>False</Text>
                  </View>)}
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Status:</Text>
                  </View>
                  {this.status(item.isDeleted, item.isPaused, item.numberOfPayment, item.numberOfPaymentSuccessed) == "Paused" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:"red"}}>Paused</Text>
                  </View>) : null}

                  {this.status(item.isDeleted, item.isPaused, item.numberOfPayment, item.numberOfPaymentSuccessed) == "Finished" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:"red"}}>Finished</Text>
                  </View>) : null}

                  {this.status(item.isDeleted, item.isPaused, item.numberOfPayment, item.numberOfPaymentSuccessed) == "Running" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:"green"}}>Running</Text>
                  </View>) : null}

                  {this.status(item.isDeleted, item.isPaused, item.numberOfPayment, item.numberOfPaymentSuccessed) == "Cancelled" ? (
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:15, color:"red"}}>Cancelled</Text>
                  </View>) : null}
                </View>

                

              </View>)
  }

  onPickerValueChangeDonation = (itemValue, itemIndex) => {
    console.log('onPickerValueChangeDonation');
    console.log(itemValue, itemIndex);
    this.setState({
      pickerValueHolderDonation:itemValue,
      pickerKeyHolderDonation: itemIndex,
    })
  }

  pickerViewDonation = () => {
    return (
      <View
        style={Platform.OS === 'ios' ? styles.pickerIOSDonation : styles.pickerDonation}>
        {Platform.OS === 'ios' ? (
          <RNPickerSelect
            placeholder={{}}
            value={this.state.pickerValueHolderDonation}
            Icon={() => {
              return (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={26}
                  color={COLORS.blue}
                  style={{ marginTop:15}}
                />
              );
            }}
            onValueChange={this.onPickerValueChangeDonation}
            items={this.state.dropDownDonation}
            style={styles.pickerIOSDonation}
          />
        ) : (
          <RNPickerSelect
            placeholder={{}}
            Icon={() => {
              return (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={26}
                  color={COLORS.blue}
                  style={{ marginTop:15}}
                />
              );
            }}
            value={this.state.pickerValueHolderDonation}
            onValueChange={this.onPickerValueChangeDonation}
            items={this.state.dropDownDonation}
            style={styles.pickerDonation}
          />
        )}
      </View>
    );
  }

  myDonationSearchBox = () =>{
    return(<View style={styles.searchBoxContainer}>
            <TextInput
                style={styles.inputStyle}
                autoCorrect={false}
                placeholder="Search by id or case"
                value={this.state.searchText}
                onChangeText={(text) => this.searchFilterFunction(text)}
              />
            <FontAwesome5 name='search'color={COLORS.blue} size={20} />
          </View>)
  }

  render() {
    const {visibleFailure} = this.state;
    const {visible} = this.state;

    return (<View style={{flex:1}}>
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
          
              {this.pickerViewDonation()}

          {this.state.pickerKeyHolderDonation == 0 ? (<View>
             {this.myDonationSearchBox()}
             <FlatList
                data={this.state.filteredDataSource}
                //Item Separator View
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                return (
                        <View style={{padding:10}}>
                          {this.renderItem(item, index)}
                        </View>
                        )}}
              />
            </View>) : null}

            {this.state.pickerKeyHolderDonation == 1 ? (<View>
             <FlatList
                data={this.state.filteredScheuledDonationData}
                //Item Separator View
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                return (
                        <View style={{padding:10}}>
                          {this.renderItemScheduledDonation(item, index)}
                        </View>
                        )}}
              />
            </View>) : null}

            {this.state.pickerKeyHolderDonation == 2 ? (<View>
             <FlatList
                data={this.state.filteredRecurringDonationData}
                //Item Separator View
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                return (
                        <View style={{padding:10,}}>
                          {this.renderItemRecurringDonation(item, index)}
                        </View>
                        )}}
              />
            </View>) : null}
          
         </View>

         <Modal isVisible={this.state.isModalVisible}>
          <View style={{backgroundColor:"white"}}>
            {/*<View style={{ alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={() => this.toggleModal(this.state.currentItem, this.state.currentIndex)}>
                <AntDesign name="closecircleo" size={26} color={'#505e67'} />
              </TouchableOpacity>
            </View>*/}

            {this.state.filteredDataSource.length > 0 ? this.renderItemForModal(this.state.currentItem, this.state.currentIndex) : null}
            
            <View style={{justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity style={{width:"40%",marginBottom:10, borderRadius:25, borderWidth:2, borderColor:"red", marginHorizontal:5}} onPress={() =>this.toggleModal(this.state.currentItem, this.state.currentIndex)}>
                <Text style={{color:"red", paddingHorizontal:5, paddingVertical:5, fontWeight:"bold", textAlign:"center"}}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>

        
        <Modal isVisible={this.state.isModalVisibleScheduledDonation}>
          <View style={{backgroundColor:"white"}}>
            {/*<View style={{ alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={() => this.toggleModal(this.state.currentItem, this.state.currentIndex)}>
                <AntDesign name="closecircleo" size={26} color={'#505e67'} />
              </TouchableOpacity>
            </View>*/}

            {this.state.filteredScheuledDonationData.length > 0 ? this.renderItemModalScheduledDonation(this.state.currentItemScheduledDonation, this.state.currentIndexScheduledDonation) : null}
            
            <View style={{justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity style={{width:"40%",marginBottom:10, borderRadius:25, borderWidth:2, borderColor:"red", marginHorizontal:5}} onPress={() =>this.toggleModalScheduledDonation(this.state.currentItemScheduledDonation, this.state.currentIndexScheduledDonation)}>
                <Text style={{color:"red", paddingHorizontal:5, paddingVertical:5, fontWeight:"bold", textAlign:"center"}}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>


        <Modal isVisible={this.state.isModalVisibleRecurringDonation}>
          <View style={{backgroundColor:"white"}}>
            {/*<View style={{ alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={() => this.toggleModalRecurringDonation(this.state.currentItemRecurringDonation, this.state.currentIndexRecurringDonation)}>
                <AntDesign name="closecircleo" size={26} color={'#505e67'} />
              </TouchableOpacity>
            </View>*/}

            {this.state.filteredRecurringDonationData.length > 0 ? this.renderItemModalRecurringDonation(this.state.currentItemRecurringDonation, this.state.currentIndexRecurringDonation) : null}
            
            <View style={{justifyContent:"center", alignItems:"center"}}>
              <TouchableOpacity style={{width:"40%",marginBottom:10, borderRadius:25, borderWidth:2, borderColor:"red", marginHorizontal:5}} onPress={() =>this.toggleModalRecurringDonation(this.state.currentItemRecurringDonation, this.state.currentIndexRecurringDonation)}>
                <Text style={{color:"red", paddingHorizontal:5, paddingVertical:5, fontWeight:"bold", textAlign:"center"}}>Close</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>

        

        </ImageBackground>
      </View>
      </View>)
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
    width:"95%",
    marginVertical:10,
    backgroundColor:"white",
    flex:1,
    paddingBottom:50
  },
  donationContainer:{
    backgroundColor:"white",
    borderRadius:5,
    marginTop:20,
    flex:1,

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
  searchBoxContainer: {
    flexDirection: 'row',
    justifyContent:"center",
    alignItems:"center",
    borderWidth:1,
    borderColor:COLORS.blue,
    borderRadius:25,
    paddingHorizontal:15,
    margin:10,
  },
  inputStyle: {
    flex: 1,
  },
  pickerIOSDonation: {
    width: '90%',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    alignSelf:"center",
    color: '#505e67',
    backgroundColor: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  pickerDonation: {
    width: '90%',
    backgroundColor: 'white',
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    alignSelf:"center"
  },
});