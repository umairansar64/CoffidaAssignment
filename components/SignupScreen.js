import React, { Component } from 'react';
import { Alert, Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

class Signup extends Component{

  constructor(props){
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorText: '',
    }
  }

  verifySignup(navigation){
    if(this.state.firstName == '' || this.state.lastName == '' || this.state.email=='' || this.state.password==''){
      this.setState({errorText: "None of the fields should be blank"});
    }
    else if(this.state.password !== this.state.confirmPassword){
      this.setState({errorText: "Passwords don't match"});
    }
    else{
      this.setState({errorText: ''});
      this.addItem(navigation);
    }
  }

  addItem(navigation){
    let sendData = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    };

    return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData)
    })
    .then((response) => {
      Alert.alert("Sign Up Successfull");
      navigation.navigate('Login');
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){

    const navigation = this.props.navigation;

    return(
        <ScrollView style={styles.container1}>

          <Text style={styles.text}>First Name *</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 'Williams'"
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}/>

          <Text style={styles.text}>Last Name *</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 'Smith'"
            onChangeText={(lastName) => this.setState({lastName})}
            value={this.state.lastName}/>

          <Text style={styles.text}>Email *</Text>

          <TextInput
            style={styles.input}
            placeholder="name@email.com"
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}/>

          <Text style={styles.text}>Password *</Text>

          <TextInput
            style={styles.input}
            placeholder='password'
            secureTextEntry
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}/>

          <Text style={styles.text}>Confirm Password *</Text>

          <TextInput
            style={styles.input}
            placeholder='password'
            secureTextEntry
            onChangeText={(confirmPassword) => this.setState({confirmPassword})}
            value={this.state.confirmPassword}/>

          <TouchableOpacity style={styles.touch} onPress={() => this.verifySignup(navigation)}>
            <Text style={{padding: 5, fontSize: 30, color: 'beige'}}>SIGN UP</Text>
          </TouchableOpacity>

          <Text style={{color: 'red', fontSize: 20}}>{this.state.errorText}</Text>

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
  text:{
    color: 'darkred',
    fontSize: 25,
    paddingTop: 10,
    justifyContent: 'flex-start'
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
  touch:{
    backgroundColor: 'darkred',
    fontSize: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'darkblue',
    borderRadius: 5,
    marginTop: 15
  }
});

export default Signup;
