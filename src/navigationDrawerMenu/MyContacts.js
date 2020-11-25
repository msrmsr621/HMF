/* eslint-disable prettier/prettier */
import React from 'react';
import {View,FlatList, TextInput,Alert, StyleSheet, AsyncStorage, Image, Text, ImageBackground, TouchableOpacity,PermissionsAndroid, ScrollView, Animated} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {
  createDrawerNavigator,
  DrawerActions,
  DrawerItems,
} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import {Snackbar} from 'react-native-paper';
import { SearchBar } from 'react-native-elements';

// import { Ionicons } from '@expo/vector-icons';
//import Icon from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Icon, Divider, Avatar} from 'react-native-elements';
import filter from 'lodash.filter'
import Contacts from 'react-native-contacts';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import STRINGS from '../utils/STRINGS';
import COLORS from '../utils/COLORS';
import IMAGES from '../utils/IMAGES';
import Loader from '../components/Loader';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;
export default class myContacts extends React.Component {
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
      mineContacts:[],
      myContactsData:[],
      filteredDataSource: [],
      searchText:'',
      contacts: [],
    };
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    console.log(global.loginResponse.accessToken);
    //console.log('===========================MyDonation=========================')
    this.setState({isLoading: false});

    Promise.all([this.myContacts()])
    .then(([myContacts]) => {
      // console.log('getReportList ' + JSON.stringify(getReportList));
     
    });

  }

  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));

  _onDismissSnackBar = () => this.setState({visible: false});

  _onToggleSnackBarFailure = () => this.setState(state => ({visibleFailure: !state.visibleFailure}));

  _onDismissSnackBarFailure = () => this.setState({visibleFailure: false});

  myContacts = () =>{
    // this.setState({isLoading: false});
   
    fetch(API_url + '/api/Contacts', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+ global.loginResponse.accessToken,
      },
      body: JSON.stringify(),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        //console.log('mygivings : ' + JSON.stringify(result.data.items));
        if (typeof result === 'string') {
          //console.log('this is text');
          this.setState({isLoading: true, responseMsg: result});
          this._onToggleSnackBarFailure();
        }
        else
        {
          //console.log(JSON.stringify(result));
          this.setState({isLoading: true});
          this.setState({
            myContactsData: result.data.items,
            filteredDataSource:result.data.items,
          })
        }
       
      })
      .catch((error) => {
        this.setState({isLoading: true});
      });
  }
  importMobileContact = () =>{
     // console.log('Import contact');
      if (Platform.OS === 'android') {
          console.log('inside android');
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
          }).then(() => {
           // console.log('loading contacts');
            this.loadContacts();
            //console.log(JSON.stringify(this.state.mineContacts));
            {/** store information */}
            {/** end store information */}
          }
        );
      } else {
        this.loadContacts();
      }
  }
  remove_linebreaks = (str) =>{ 
		return str.replace( /[\r\n]+/gm, "" ); 
	}
  loadContacts = () => {
    this.setState({isLoading: false});
    Contacts.getAll((err, contacts) => {
        console.log('coming to load contacts');
      contacts.sort(
        (a, b) => 
          a.givenName.toLowerCase() > b.givenName.toLowerCase(),
      );
     // console.log('contacts -> ', contacts);
      if (err === 'denied') {
        alert('Permission to access contacts was denied');
        console.warn('Permission to access contacts was denied');
      } else { 
        //console.log(JSON.stringify(contacts))      
        this.setState({mineContacts: contacts},() => {                    
          let name = '';          
          let phone = '';
          let email = '';
          let country = '';
          let state = '';
          let city = '';
          let address = '';
          let groupname = 'DefaultGroup';
          let contactsArr = [];
          let i=0;
          var pskarray = [];
          this.state.mineContacts.map((userData) => { 
                  
              name = userData.displayName;
              //console.log('name is : ',name);
              phone = (userData.phoneNumbers.length>0)? userData.phoneNumbers[0].number: '';
              email = (userData.emailAddresses.length>0)? userData.emailAddresses[0].email: '';
              if(userData.postalAddresses.length>0)
              {
                  //console.log(userData.postalAddresses[0].hasOwnProperty('country'));
                  //console.log(JSON.stringify(userData));
                  if(userData.postalAddresses[0].hasOwnProperty('country') === false)
                  {
                      country = '';
                      state = '';
                      city = '';
                      address = '';
                     
                  }
                  else
                  {
                      country = (userData.postalAddresses[0].hasOwnProperty('country'))? userData.postalAddresses[0].country: '';
                      state = (userData.postalAddresses[0].hasOwnProperty('state'))? userData.postalAddresses[0].state: '';
                      city = (userData.postalAddresses[0].hasOwnProperty('city'))? userData.postalAddresses[0].city: '';
                      address = (userData.postalAddresses[0].hasOwnProperty('formattedAddress'))? userData.postalAddresses[0].formattedAddress: '';
                      //console.log(country);
                  }
                  
              }
              else{
                  country = '';
                  state = '';
                  city = '';
                  address = '';                 
                  
              }
              if(phone !== "" && phone !== null)            
                  {  
                    pskarray.push({
                      "name" : name.split(/\s/).join(''),
                      "email" : email.split(/\s/).join(''),
                      "phone":phone.split(/\s/).join(''),
                      "whatsappnumber":phone.split(/\s/).join(' '),
                      "addressLine1" : address.split(/\s/).join(''),
                      "city" :city.split(/\s/).join(''),
                      "state":state.split(/\s/).join(''),
                      "country":country.split(/\s/).join(''),
                      "groupName" :'DefaultGroup'
                    }
                  );                 
                    // store contacts
                                    
                    //console.log('name : '+ name +'email : '+ email +'phone : '+ phone +'country : '+ country +' state : '+ state +' city : '+ city +' address : '+ address);
                //console.log(JSON.stringify(userData));
                  }  //console.log(country);
        });
        // end for loop
        //console.log(JSON.stringify(this.state.mineContacts));
       
        let requestData = {"contacts": pskarray,isManuallyInserted:false};
        //console.log(JSON.stringify(requestData))
        //return true;
        fetch(API_url + '/api/Contacts', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+ global.loginResponse.accessToken,
          },
          body: JSON.stringify(requestData),
        })
          .then(response => {
            return response.json();
          })
          .then(result => {
            if (typeof result === 'string') {
              this.setState({isLoading: true, responseMsg: result});
              this._onToggleSnackBarFailure();
            } else {
              var rmsg = "Contacts has been imported";
              this.setState({isLoading: true, responseMsg: rmsg, myContactsData: result.data.items,
                filteredDataSource:result.data.items});
              this._onToggleSnackBar();
            }            
            //console.log(JSON.stringify(result));                 
            
           
          }).catch(err => {
            this.setState({isLoading: true, responseMsg: result});
            this._onToggleSnackBarFailure();            
          })
        
                     
        });        
        
      }
    });
  };
  searchFilterFunction = text => {
    this.setState({
      searchText: text,
    });

    const newData = this.state.myContactsData.filter(item => {
      const query = text.toUpperCase();
        if(item.name!=null && item.email!=null) {
         const itemDataName = `${item.name.toUpperCase()}`;
         const itemDataEmail = `${item.email.toUpperCase()}`;
         const textData = text.toUpperCase();
         return (
          itemDataName.indexOf(query) >= 0 ||
          itemDataEmail.indexOf(query) >= 0
        )
         //return itemData.indexOf(textData) > -1;
        }
    });
    this.setState({
      filteredDataSource: newData,
    });
  };

  handleSearch = text => {
    const formattedQuery = text.toLowerCase()
    const data = filter(this.state.myContactsData, user => {
      return this.contains(user, formattedQuery)
    })
    this.setState({ data, query: text })
  }

  contains = ({ uniqueIdentifier }, query) => {
    if (
      uniqueIdentifier.includes(query)
    ) {
      return true
    }
    return false
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
          <View style={{flexDirection:"row", width:'100%', marginBottom:10}}>
                        <View style={{width:"50%", paddingHorizontal:10}}>
                            <TouchableOpacity style={{borderRadius:25, borderWidth:1, borderColor:"#6188FF", paddingHorizontal:5}}>
                            <View style={{flexDirection:'row',alignSelf:'center', marginHorizontal:5}}>                            
                            <View><Text style={{textAlign:'center', paddingVertical:10, color:"#6188FF", fontWeight:"normal", fontSize:14, marginVertical:2}}>Import gmail contacts</Text></View>
                            </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:"50%", alignSelf:'center', paddingHorizontal:10}}>
                            <TouchableOpacity style={{borderRadius:25, borderWidth:1, borderColor:"#6188FF", paddingHorizontal:5}} onPress={()=>{this.importMobileContact()}}>
                            <View style={{flexDirection:'row',alignSelf:'center'}}>                            
                            <View><Text style={{textAlign:'center', paddingVertical:10, color:"#6188FF", fontWeight:"normal", fontSize:14, marginVertical:2}}>Import mobile contacts</Text></View>
                            </View>
                            </TouchableOpacity>
                        </View>
                    </View>   
                    {(this.state.filteredDataSource.length === 0) &&
        <View style={{paddingTop:20}}>
        <Text style={{ alignSelf: 'center', alignItems:'center', justifyContent:'center', color:COLORS.blue}}>No Contacts found</Text>
        </View>
        }
                    {this.state.filteredDataSource.length>0 &&        
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputStyle}
                autoCorrect={false}
                placeholder="Search by id or name"
                value={this.state.searchText}
                onChangeText={(text) => this.searchFilterFunction(text)}
              />
            <FontAwesome5
              name='search'
              color={COLORS.blue}
              size={20}
            />
          </View>
         } 
          <FlatList
          data={this.state.filteredDataSource}
          //Item Separator View
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
    return (
            <View style={{padding:10}}>
              <View style={{borderWidth:1, borderColor:COLORS.grey, borderRadius:3}}>
               
                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack, fontWeight:"bold"}}>Name:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack}}>{item.name}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"white", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Email:</Text>
                  </View>
                  <View style={{width:"65%"}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack}}>{item.email}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row", backgroundColor:"#F9F9F9", paddingVertical:10}}>
                  <View style={{width:"35%", paddingLeft:10}}>
                    <Text style={{fontSize:16, color:COLORS.textColorBlack,fontWeight:"bold"}}>Phone:</Text>
                  </View>
                  <View style={{width:"65%", flexDirection:"row", alignItems:"center", justifyContent: 'space-between',flexWrap:"wrap"}}>
                    <Text style={{fontSize:16, color:COLORS.blue}}>{item.phone}</Text>
                      {/* <TouchableOpacity style={{borderRadius:25, borderWidth:1, borderColor:COLORS.blue, marginHorizontal:5}}>
                        <Text style={{color:COLORS.blue, paddingHorizontal:5, paddingVertical:5}}>View Details</Text>
                      </TouchableOpacity> */}
                  </View>
                </View>              

              </View>
            </View>
            )}}
        />
        
         </View>
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
  passwordContainer: {
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
});