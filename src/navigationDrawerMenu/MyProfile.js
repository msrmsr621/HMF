import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,  
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
  Switch,
  Alert,
  AsyncStorage,
  Keyboard,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {NetworkInfo} from 'react-native-network-info';
import { TextInput } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import {Picker} from '@react-native-community/picker';
import ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Input } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import {BackHandler} from 'react-native';
import {Snackbar} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
//import RNFetchBlob from 'react-native-fetch-blob';
import Loader from '../components/Loader';
import COLORS from '../utils/COLORS';
import STRINGS from '../utils/STRINGS';
import moment from 'moment';

const API_url = STRINGS.API_url;
const WebsiteUrl = STRINGS.WebsiteUrl;
const myProfileValidationSchema = yup.object().shape({
    firstName: yup
      .string()
      .required('First name is required'),
      lastName: yup
      .string()
      .required('Last name is required'),
      email: yup
      .string()
      .email('Please enter valid email')
      .required('Email is Required')
  });
class MyProfile extends React.Component {
  // signup() {
  //   Actions.signup();
  // }

  constructor(props) {
    super(props);
    console.log('this.props ' + JSON.stringify(this.props));
    this.state = {
      isLoading: true,
      // imageResponse = {},
      filePath: {},
      arrcountrycode: {},
      newarrcountrycode: [],
      selectedValue: '+1',
      stripeUserId:"",
      countryCode:"",
      phone:"",
      email:"",
      city: "", 
      firstName:"",
      lastName:"",         
      responseMsg: '',      
      visible: false,
      userInfo: {},
    };

   // this.onSubmit = this.onSubmit.bind(this);
    // this.textInput = React.createRef();

  }
  toggleSwitch = async () =>{

  }
  componentDidMount = async () => {
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    //--------------- fetch country codes ------------------------------------
    fetch('https://helpmefund.azurewebsites.net/assets/data/CountryCodes.json')
    .then(response => response.json() )
    .then(data => {            
      console.log(data.length);
      var arrcountrycode = [];
        for (var i=0; i<data.length; i++)
        {
          //console.log(data[i].dial_code);
          //console.log(data[i].code);
          var jo = {};
          if(data[i].code != null && data[i].dial_code != null)
          {
          jo.label = data[i].code;
          jo.value = data[i].dial_code;
          arrcountrycode.push(jo);
          }
        }  
       // let curdate = new Date().toISOString();   
       // console.log(curdate); 
       this.setState({               
        newarrcountrycode:data,
        countryCode:this.state.selectedValue               
        });  
        
       // console.log(JSON.stringify(this.state.newarrcountrycode[0].code));           
      } )
    .catch(error => console.log(error));
    //------------------ fetch indivisual accounts ------------------------------   
    //console.log(API_url + '/api/stripe/individualStripeAccounts'); 
    fetch(API_url + '/api/stripe/individualStripeAccounts', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+ global.loginResponse.accessToken,
      },            
    })
    .then((response) => {
      return response.json();
    })
    .then((result1) => { 
      //console.log(result1.data.items[0].stripeUserId);         
      //console.log(JSON.stringify(result1.data.items)); 
      if(result1.data.items.length>0)
      this.setState({stripeUserId:result1.data.items[0].stripeUserId});    
         
       // let curdate = new Date().toISOString();   
       // console.log(curdate); 
      //  this.setState({               
      //   newarrcountrycode:data,
      //   countryCode:this.state.selectedValue               
      //   });  
        
       // console.log(JSON.stringify(this.state.newarrcountrycode[0].code));           
      } )
    .catch(error => console.log(error));
    //------------------ fetch profile details ----------------------------------
        try { 
  
        let isLogin = await AsyncStorage.getItem('isLogin');  
        if (isLogin === 'true') {
           let loginResponse = await AsyncStorage.getItem('loginResponse');
           loginResponse = JSON.parse(loginResponse);
           global.loginResponse = loginResponse;         
           this.accessToken =  loginResponse.accessToken; 
           this.setState({isLoading: false}); 
           // ---------------- fetch user details
           //console.log(API_url + '/api/me');
           fetch(API_url + '/api/me', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer '+ global.loginResponse.accessToken,
            },            
          })
            .then(response => {
              return response.json();
            })
            .then(result => {
              this.setState({userInfo:result.data});             
              this.setState({isLoading: true});    
             console.log(this.state.userInfo);
            })
            .catch(error => {
              this.setState({
                isLoading: true,
                isSuccess: false,
                responseMsg: error.message,
              });
              this._onToggleSnackBarFailure();
            });
           //------------------ end ------------    
         // console.log(this.values);
        } else {
          console.log('Now will go to Login Page');
          this.props.navigation.navigate('StackNavigator');
        }
      } catch (error) {
        console.log('error ', error);
      }
  };
  cloudinaryUpload = (photo) => {
  
   // let request = cloudinary.createUploader().upload(file: photo.uri, params: params)
    const data = new FormData()
    data.append('file', photo)
    data.append('upload_preset', 'cro1froy')
    data.append("cloud_name", "helpmefund")
    //data.append('upload_preset', 'helpmefund')
    //data.append("cloud_name", "cro1froy")
    fetch("https://api.cloudinary.com/v1_1/helpmefund/upload", {
      method: "POST",       
      body: data
    }).then(res => res.json()).
      then(data => {
        console.log(JSON.stringify(data))
        this.setPhoto(data.secure_url)

      }).catch(err => {
        console.log(JSON.stringify(err))
      })
  }
//   uploadFile =  (file) => {
//     console.log(file.uri);
//     return RNFetchBlob.fetch('POST',"https://api.cloudinary.com/v1_1/helpmefund/image/upload?upload_preset=cro1froy",{
//       'Content-Type' : 'multipart/form-data'
//     },
//     {name: 'file', fileName: file.fileName, data: RNFetchBlob.wrap(file.uri)}
//     )
//  };
  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
     
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else { 
        this.setState({isLoading: false}); 
        const uri = response.uri;
        const type = response.type;
        const name = response.fileName;
        const source = {uri: uri, type: type, name: name}
        this.cloudinaryUpload(source)
        // this.uploadFile(response)
        // .then(response => response.json())
        // .then(result =>
        //   {
        //     console.log('cloudaniry response is : '+JSON.stringify(result))

        //     });      
        
        
        //let body = new FormData();
        //let imagePath = source.uri;
       // let Url = 'https://api.cloudinary.com/v1_1/helpmefund/upload';
        //body.append('photo', {uri: uri,name: name,type: type});
          //body.append('Content-Type', 'image/png');
         
        // fetch(Url,{ method: 'POST',headers:{ 
        //     Accept: 'application/json', 
        //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryOHccIaHwjbgD42l1", 
        //     "X-Requested-With": "XMLHttpRequest",

        //     } , body :body} )
        // //.then((res) => checkStatus(res))
        // .then((res) => res.json())
        // .then((resp) => { 
        //   console.log("response" +JSON.stringify(resp));
        //  })
        // .catch((e) => console.log(e))
        // .done();
        // end api calling
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
       // this.setState({
        //  filePath: uri,
         // imageResponse : source,
      //  });
      }
    });
  };
  setPhoto = (imageUrl) => {
    if(imageUrl=="")
    this.setState({isLoading: false});
    let updateData ={firstName:this.state.userInfo.firstName,lastName:this.state.userInfo.lastName,email: this.state.userInfo.email,Image: imageUrl}
    fetch(API_url + '/api/me', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+ global.loginResponse.accessToken,
      },
      body: JSON.stringify(updateData),
    })
      .then(response => {
        return response.json();
      })
      .then(result => {
        console.log(JSON.stringify(result));
        if(typeof(result) == 'string')
        {          
          this.setState({
            isLoading: true,
            isSuccess: false,
            responseMsg: result            
          });     
          this._onToggleSnackBarFailure();     
        }
        else
        {
          let smsg ='';
          if(imageUrl == "")
          {
             smsg = "Image has been removed";
          }
          
          else{
             smsg = "Photo has been updated";
          }
          
          this.setState({
            isLoading: true,
            isSuccess: true,            
            responseMsg: smsg          
          }); 
          this.state.userInfo.image = imageUrl;
          this._onToggleSnackBar();
          // this.props.navigation.navigate('ThankYou', {
          //   email: values.email,
          // });
        }        
              
       
      })
      .catch(error => {
        this.setState({
          isLoading: true,
          isSuccess: false,
          responseMsg: error.message,
        });
        this._onToggleSnackBarFailure();
      });
  };
  myProfileSubmit = async values => { 
    // console.log(JSON.stringify(values));
   // console.log(global.loginResponse.accessToken);    
    Keyboard.dismiss();  
    this.setState({isLoading: false});  
    fetch(API_url + '/api/me', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer '+ global.loginResponse.accessToken,
      },
      body: JSON.stringify(values),
    })
      .then(response => {
        return response.json();
      })
      .then(result => {
        //console.log(JSON.stringify(result));
        if(typeof(result) == 'string')
        {          
          this.setState({
            isLoading: true,
            isSuccess: false,
            responseMsg: result            
          });     
          this._onToggleSnackBarFailure();     
        }
        else
        {
          this.setState({
            isLoading: true,
            isSuccess: true,
            responseMsg: 'Information has been updated'            
          }); 
          this._onToggleSnackBar();
          // this.props.navigation.navigate('ThankYou', {
          //   email: values.email,
          // });
        }        
              
       
      })
      .catch(error => {
        this.setState({
          isLoading: true,
          isSuccess: false,
          responseMsg: error.message,
        });
        this._onToggleSnackBarFailure();
      });
  };  
  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));

  _onDismissSnackBar = () => this.setState({visible: false});

  _onToggleSnackBarFailure = () => this.setState(state => ({visibleFailure: !state.visibleFailure}));

  _onDismissSnackBarFailure = () => this.setState({visibleFailure: false});
  render() {
    const {handleSubmit} = this.props;
    const {visibleFailure} = this.state;
    const {visible} = this.state;     
    
    return (      
        <View>
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
              
            <View style={{width:"90%", alignSelf: 'center', flexDirection:"row", paddingTop:40}}></View>
            <View style={styles.whiteBgContainer}>
              <View style={{width:"100%", alignSelf: 'center', flexDirection:"row", paddingBottom:20}}>
                 
                <View style={{width:"100%",justifyContent:'center', alignItems:'center', marginTop:-40}}>
                
                <Avatar
                  rounded size="large"
                  source={this.state.userInfo.image ? {uri: this.state.userInfo.image} : require('../../assets/images/profile_dashboard.png')}
                />                
                  
                  <View style={styles.lineRow}>
                    <View style={{flexDirection:"row", width:'100%'}}>
                        <View style={{width:"50%", paddingHorizontal:5}}>
                            <TouchableOpacity style={{borderRadius:25, borderWidth:1, borderColor:"#6188FF", paddingHorizontal:10}} onPress={()=>{this.chooseFile(this)}}>
                            <View style={{flexDirection:'row',alignSelf:'center', marginHorizontal:10}}>
                            <View style={{marginRight:15,alignSelf:'center'}}><FontAwesome name='camera' size={16} color={COLORS.blue}/></View>
                            <View><Text style={{textAlign:'center', paddingVertical:10, color:"#6188FF", fontWeight:"normal", fontSize:16, marginVertical:2}}>Upload Image</Text></View>
                            </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:"50%", alignSelf:'center', paddingHorizontal:5}}>
                            <TouchableOpacity style={{borderRadius:25, borderWidth:1, borderColor:"#6188FF", paddingHorizontal:10}}>
                            <View style={{flexDirection:'row',alignSelf:'center'}}>
                            <View style={{marginRight:15,alignSelf:'center'}}><MaterialIcons name='delete' size={16} color={COLORS.blue}/></View>
                            <View><Text style={{textAlign:'center', paddingVertical:10, color:"#6188FF", fontWeight:"normal", fontSize:16, marginVertical:2}} onPress={()=>{this.setPhoto("")}}>Remove Image</Text></View>
                            </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                     </View> 
                  <Text style={{color:COLORS.textColorBlack, fontSize:15, fontWeight:"bold", marginLeft:5, marginTop:20}}>{this.state.userInfo.firstName} {this.state.userInfo.lastName}</Text>
                  <View style={{flexDirection:"row"}}>
                  <View style={{alignSelf:'center', marginRight:10}}>
                  <MaterialCommunityIcons name='email' size={24} color={COLORS.blue}/>
                  </View>
                  <View style={{alignSelf:'center'}}>
                  <Text style={{color:COLORS.blue, fontSize:16}}>{this.state.userInfo.email}</Text>                  
                  </View>
                </View>  
                                        
                </View>
                
                
              </View>
            </View>
            {/* basic profile end */}            
            <View style={styles.saperator}></View>  
            {/* profile form start */} 
            <View style={styles.container}>                                
        
           <Formik
            enableReinitialize={true}
            validationSchema={myProfileValidationSchema}
            initialValues={this.state.userInfo}
            onSubmit={(values) => {this.myProfileSubmit(values)}}>
            {({
              handleChange,
              handleBlur,
              setFieldValue,
              handleSubmit,                     
              values,
              setDate,
              errors,
              touched,
              isValid,
            }) => (
           <View style={{width: "100%"}}>            
           <Input
            ref={this.textInput}
            placeholder=""
            name="firstName"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.matterhorn, fontSize:13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="FIRST NAME"            
            rightIcon={<SimpleLineIcons name='user' size={24} color={COLORS.blue}/>}
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            value={values.firstName}           
            errorMessage={(errors.firstName && touched.firstName) && errors.firstName}
          />
          <Input
            ref={this.textInput}
            placeholder=""
            name="lastName"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.matterhorn, fontSize:13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="LAST NAME"
            value={this.state.lastName}
            rightIcon={<SimpleLineIcons name='user' size={24} color={COLORS.blue}/>}
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            value={values.lastName}           
            errorMessage={(errors.lastName && touched.lastName) && errors.lastName}
          />
          <Input
            ref={this.textInput}
            placeholder=""
            name="email"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.matterhorn, fontSize: 13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="EMAIL"
            value={this.state.email}
            rightIcon={<MaterialCommunityIcons name='email-outline' size={25} color={COLORS.blue}/>}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
            errorMessage={(errors.email && touched.email) && errors.email}
          />  
          <View style={{flexDirection: 'row', width:'95%'}}>
        
        <View style={{ width:'20%'}}> 
        
        {this.state.newarrcountrycode.length>0? (<Picker 
        style={{width:100, height:50}}
        selectedValue={this.state.selectedValue} 
        onValueChange={(itemValue, itemIndex) => this.setState({selectedValue: itemValue, countryCode: itemValue})} > 
        { this.state.newarrcountrycode.map((item, key)=> 
        <Picker.Item label={item.code} value={item.dial_code} key={key} /> )} 
        </Picker>): null}
        

        
     </View> 
     <View style={{ width:'85%'}}>
<Input
        ref={this.textInput}
        placeholder=""
        name="phone"
        inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda, width:'100%'}}
        inputStyle={{color: COLORS.matterhorn, fontSize: 13, fontWeight: "bold"}}
        labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
        label=""           
        rightIcon={<MaterialCommunityIcons name='cellphone-iphone' size={25} color={COLORS.blue}/>}
        onChangeText={handleChange('phone')}
        onBlur={handleBlur('phone')}
        value={values.phone}
        keyboardType="phone-pad"
        errorMessage={(errors.phone && touched.phone) && errors.phone}
      />  
    </View>
           
      </View>
      <Input
            ref={this.textInput}
            placeholder=""
            name="city"
            inputContainerStyle={{borderBottomColor: this.state.isFocused? COLORS.blue: COLORS.panda}}
            inputStyle={{color: COLORS.matterhorn, fontSize:13, fontWeight: "bold"}}
            labelStyle={{color: COLORS.panda, fontSize: 13, fontWeight: "normal"}}
            label="CITY"            
            rightIcon={<MaterialCommunityIcons name='city' size={24} color={COLORS.blue}/>}
            onChangeText={handleChange('city')}
            onBlur={handleBlur('city')}
            value={values.city}           
            errorMessage={(errors.city && touched.city) && errors.city}
          />
           
  <View style={{marginTop:30}}>
    <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit} 
        disabled={!isValid}>
        <Text style={styles.buttonText}>Update</Text>
    </TouchableOpacity>
  </View>
  <View style={{marginTop:30}}>
  <Text style={{color:COLORS.textColorBlack, fontSize:13, fontWeight:"normal"}}>MY PAYOUT A/C</Text>
  <View style={{ backgroundColor:'#ced4da', paddingHorizontal:10, paddingVertical:10}}>
        <Text style={{color:COLORS.textColorBlack, fontSize:13, fontWeight:"normal"}}>{this.state.stripeUserId}</Text>
  </View>
    </View>
</View>

)}
</Formik>

      </View>




       </View>
        </ImageBackground>
</View>
</ScrollView>
</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f5ff',
    flex: 1,
    alignItems: 'center',
    fontFamily: "Myriad Pro",
    justifyContent: 'center',
  },
  saperator:{display:'flex', paddingVertical:20},
  lineRow:{
    flexWrap:'nowrap', display:'flex', marginTop:20
  },
  profileImg:{
    height: 99,
    width: 99,
    borderRadius:99/2
  },
  dottedRow:{
      borderWidth:1,
      borderStyle: 'dashed',
      borderRadius: 1,
      borderColor: COLORS.blue,
      width:'100%',
      paddingHorizontal:20,
      paddingVertical:20,
  },
  whiteBgContainer:{
    backgroundColor:"white",
    borderRadius:5,
    marginTop:20,    
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
  containerForm: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  signupText: {
    color: '#abb1c2',
    fontSize: 16,
  },  
  signupButton: {
    color: COLORS.blue,
    fontSize: 20,
    paddingTop:0,
    fontWeight: 'bold',
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.blue,
    borderRadius: 25,
    marginVertical: 13,
    paddingVertical: 10,
  },  
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },  
  errorText: {
    color: 'red',
    width: 300,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  inputBox: {
    width: 300,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.matterhorn,
    marginVertical: 10,
  },
});


export default MyProfile;