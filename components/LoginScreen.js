import React, { Component } from 'react';
import { Alert, Text, View, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';

class Login extends Component{

  constructor(props){
    super(props);

    this.state = {
      email: 'umair@mmu.ac.uk',
      password: 'hello123',
      accessGranted: false,
      userID: '',
      token: '',
      errorMessage: ''
    }
  }

  verifyLogin = async (navigation) => {
    await this.getData();
    if(this.state.accessGranted){
      await this.setState({accessGranted: !this.state.accessGranted});
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
        this.setState({errorMessage: 'Invalid details provided'});
    })
    .catch((error) => {
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

    const navigation = this.props.navigation;

    return(
        <ScrollView style={styles.container1}>
          <Text style={styles.text}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="name@email.com"
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}/>
          <Text style={styles.text}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}/>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => this.verifyLogin(navigation)}>
            <Text style={{padding: 5, fontSize: 25, color: 'beige'}}>LOGIN</Text>
          </TouchableOpacity>
          <Text style={{color: 'red', fontSize: 20}}>{this.state.errorText}</Text>
          <View style={styles.container2}>
            <Text style={styles.text}>Don't have an account? Sign up now.</Text>
            <TouchableOpacity style={styles.touch} onPress={() => navigation.navigate('Signup')}>
              <Text style={{padding: 5, fontSize: 25, color: 'beige'}}>Sign Up</Text>
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
