import React, { Component } from 'react';
import { Alert, Text, View, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { t, getLanguage } from './../locales';

class Login extends Component{

  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      accessGranted: false,
      userID: '',
      token: '',
      errorMessage: ''
    }
  }

  componentDidMount(){
    getLanguage();
  }

  verifyLogin = async (navigation) => {
    await this.getData();

    // if login successful
    if(this.state.accessGranted){
      await this.setState({
        accessGranted: !this.state.accessGranted,
        errorMessage: '',
        email: '',
        password: ''
      });
      await this.saveAccessDetails();
      await navigation.navigate('HomeNavigation');
    }
  }

  getData (){
    let sendData = {
      email: this.state.email,
      password: this.state.password
    };

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData)
    })
    .then((response) =>(
       response.json())
     )
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            accessGranted: true,
            token: responseJson.token.toString(),
            userID: responseJson.id.toString(),
        });
    })
    .catch((error) => {
        this.setState({errorMessage: t('error_incorrect_details')});
        console.log(error);
    });
  }


  saveAccessDetails = async () => {
      try {
        await AsyncStorage.setItem('@token', this.state.token);
        await AsyncStorage.setItem('@userID', this.state.userID.toString());
      }catch (e) {
        console.log("Something broke...");
        console.log(e);
      }
  }

  render(){

    getLanguage();

    const navigation = this.props.navigation;

    return(
        <ScrollView style={styles.container1}>
          <Text style={styles.text}>{t('email')}:</Text>
          <TextInput
            style={styles.input}
            placeholder="name@email.com"
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}/>
          <Text style={styles.text}>{t('password')}:</Text>
          <TextInput
            style={styles.input}
            placeholder={t('password')}
            secureTextEntry
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}/>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => this.verifyLogin(navigation)}>
            <Text style={{padding: 5, fontSize: 25, color: 'beige'}}>{t('log_in')}</Text>
          </TouchableOpacity>
          <Text style={{color: 'red', fontSize: 20}}>{this.state.errorMessage}</Text>
          <View style={styles.container2}>
            <Text style={styles.text}>{t('sign_up_now')}</Text>
            <TouchableOpacity style={styles.touch} onPress={() => navigation.navigate('Signup')}>
              <Text style={{padding: 5, fontSize: 25, color: 'beige'}}>{t('sign_up')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container1:{
    flex: 1,
    backgroundColor: 'burlywood',
    fontSize: 25,
    padding: 20
  },
  container2:{
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'burlywood',
    justifyContent: 'flex-end'
  },
  text:{
    color: 'darkred',
    fontSize: 25,
    paddingTop: 10,
    justifyContent: 'flex-start'
  },
  input:{
    color: 'black',
    fontSize: 25,
    borderWidth: 1,
    borderColor: 'darkblue',
    borderRadius: 5,
    backgroundColor: 'beige',
    padding: 5,
    justifyContent: 'flex-start'
  },
  touch:{
    color: 'darkblue',
    backgroundColor: 'darkred',
    fontSize: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'flex-start'
  }
});

export default Login;
