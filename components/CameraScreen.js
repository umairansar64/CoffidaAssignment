import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { t } from './../locales';

class Camera extends Component{
  constructor(props){
    super(props);

    this.state = {
      token: '',
      userID: 0,
      locations: [],
      locationID: '',
      reviewID: ''
    };
  }

  componentDidMount(){
    this.onClick();
    console.log("mounted");
  }

  onClick = async () => {
    await this.getIdAndToken();
  }

  getIdAndToken = async () => {

    try {
        const thisReviewID = await AsyncStorage.getItem('@reviewID')
        if(thisReviewID !== null) {
            this.setState({reviewID: thisReviewID});
        }
        const thisToken = await AsyncStorage.getItem('@token')
        if(thisToken !== null) {
            this.setState({token: thisToken});
        }
        const thisLocID = await AsyncStorage.getItem('@locationID')
        if(thisLocID !== null) {
            this.setState({locationID: thisLocID});
        }
      } catch (e) {
        console.log("Something broke...")
      }
  }

  savePhoto = async () => {
    if(this.camera){
      const options = {quality: 0.5, base64: true}
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri, this.state.token);

      return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationID+'/review/'+this.state.reviewID+'/photo', {
        method: 'post',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': this.state.token
        },
        body: data
      })
      .then((response) => {
        Alert.alert(t('picture_added'));
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  render(){
    const navigation = this.props.navigation;
      return (
        <View style={styles.container}>
          <RNCamera
            ref={ ref => {
              this.camera = ref;
            }}
            style={styles.preview}
          />
          <View style={{alignItems: 'center', backgroundColor: 'black'}}>
            <Icon name={'circle-o'} style={styles.icon} onPress={() => this.savePhoto()}>
            </Icon>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  preview:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  icon:{
    fontSize: 40,
    padding: 5,
    color: 'darkred',
    alignItems: 'center',
    color: 'white'
  }
});

export default Camera;
