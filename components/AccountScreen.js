import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Account extends Component{

  constructor(props){

    super(props);

    this.state = {
      userDetails: '',
      editFirstName: '',
      editLastName: '',
      editEmail: '',
      password: '',
      confirmPassword: '',
      token: '',
      userID: '',
      editMode: false,
      isLoading: true,
      errorMessage: ''
    }
  }

  componentDidMount(){
    this.onClick();
  }

  onClick = async () => {
    await this.getTokenAndID();
    this.getData();
  }

  getData = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+this.state.userID.toString(), {
      method: 'get',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({
            userDetails: responseJson,
            isLoading: false
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  getTokenAndID = async () => {
    try {
        const thisToken = await AsyncStorage.getItem('@token')
        if(thisToken !== null) {
            this.setState({token: thisToken})
        }
        const thisID = await AsyncStorage.getItem('@userID')
        if(thisID !== null) {
            this.setState({userID: thisID})
        }
      } catch (e) {
        console.log("Something broke...")
      }
  }

  processLogout = (navigation) => {

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
      method: 'post',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => {navigation.navigate('Login')})
    .catch((error) => {
        console.log(error);
    });
  }

  saveEditedInfo(){

    let sendData = {};

    let allBlank = true;

    if(this.state.editFirstName !== ''){
      sendData['first_name'] = this.state.editFirstName;
      allBlank = false;
    }

    if(this.state.editLastName !== ''){
      sendData['last_name'] = this.state.editLastName;
      allBlank = false;
    }

    if(this.state.editEmail !== ''){
      sendData['email'] = this.state.editEmail;
      allBlank = false;
    }

    if(this.state.password !== ''){
      sendData['password'] = this.state.password;
      allBlank = false;
    }

    if((this.state.password !== this.state.confirmPassword) || allBlank){
      this.setState({errorMessage: 'Please fill in all the details correctly!'});

    } else {
      return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+this.state.userID.toString(), {
        method: 'patch',
        headers: {'X-Authorization': this.state.token,
                  'Content-Type': 'application/json'},
        body: JSON.stringify(sendData)
      })
      .then((response) => {
        ToastAndroid.show("Details Updated Successfully!", ToastAndroid.SHORT);
        this.getData();
        this.setState({
          editMode: false,
          errorMessage: ''
        });
      })
      .catch((error) => {
          console.log(error);
      });
    }
  }

  render(){

    const navigation = this.props.navigation;

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, backgroundColor: 'burlywood', justifyContent: 'center'}}>
          <ActivityIndicator
            size="large"
            color="darkred"
          />
        </View>
      );
    }else{
    if(this.state.editMode){

      return(
        <ScrollView style={styles.container}>
          <Text style={styles.instruction}>Fill the details you want to change!</Text>
          <Text style={styles.heading}>First Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Will"
            onChangeText={(editFirstName) => this.setState({editFirstName})}
            value={this.state.editFirstName}/>
            <Text style={styles.heading}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Smith"
              onChangeText={(editLastName) => this.setState({editLastName})}
              value={this.state.editLastName}/>
            <Text style={styles.heading}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="name@email.com"
              onChangeText={(editEmail) => this.setState({editEmail})}
              value={this.state.editEmail}/>
            <Text style={styles.heading}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}/>
            <Text style={styles.heading}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={(confirmPassword) => this.setState({confirmPassword})}
              value={this.state.confirmPassword}/>
          <TouchableOpacity style={styles.touch}>
            <Text style={{padding: 5, fontSize: 22, color: 'beige'}} onPress={() => this.saveEditedInfo()}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={() => this.setState({editMode: false})}>
            <Text style={{padding: 5, fontSize: 22, color: 'red', fontWeight: 'bold'}} >Cancel</Text>
          </TouchableOpacity>
          <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
        </ScrollView>
      );
    }
    else {
      return(
        <View style={styles.container}>
          <View style={{backgroundColor: 'beige', padding: 10}}>
          <Text style={styles.text}>First Name:</Text>
          <Text style={styles.text}>{this.state.userDetails.first_name}</Text>
          <Text></Text>
          <Text style={styles.text}>Last Name:</Text>
          <Text style={styles.text}>{this.state.userDetails.last_name}</Text>
          <Text></Text>
          <Text style={styles.text}>Email:</Text>
          <Text style={styles.text}>{this.state.userDetails.email}</Text>
          </View>
          <View style = {{marginTop: 20}}>
          <TouchableOpacity style={styles.touch}>
            <Text style={{padding: 5, fontSize: 22, color: 'beige'}} onPress={() => this.setState({editMode: true})}>Edit Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch}>
            <Text style={{padding: 5, fontSize: 22, color: 'beige'}} onPress={() => navigation.navigate('MyReviews')}>My Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch}>
            <Text style={{padding: 5, fontSize: 22, color: 'beige'}} onPress={() => navigation.navigate('LikedReviews')}>Liked Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touch}>
            <Text style={{padding: 5, fontSize: 22, color: 'beige'}} onPress={() => navigation.navigate('FavoriteLocations')}>Favoritle Locations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={() => this.processLogout(navigation)}>
            <Text style={{padding: 5, fontSize: 22, color: 'red', fontWeight: 'bold'}} >Log Out</Text>
          </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'burlywood',
    padding: 20
  },
  text:{
    color: 'darkred',
    fontSize: 22,
    justifyContent: 'flex-start',
  },
  touch:{
    backgroundColor: 'darkred',
    fontSize: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'darkred',
    borderRadius: 5,
    marginTop: 15
  },
  input:{
    color: 'darkred',
    fontSize: 25,
    borderWidth: 1,
    borderColor: 'darkred',
    borderRadius: 5,
    backgroundColor: 'beige',
    padding: 5,
    justifyContent: 'flex-start'
  },
  logoutButton:{
    backgroundColor: 'white',
    fontSize: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    borderColor: 'red',
    marginTop: 10,
  },
  instruction:{
    backgroundColor: 'darkred',
    fontSize: 20,
    color: 'beige',
    fontWeight: 'bold',
    borderRadius: 5,
    padding: 5,
    marginBottom: 5
  }
});

export default Account;
