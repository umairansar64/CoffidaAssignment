import React, { Component } from 'react';
import { ToastAndroid, View, Text, ActivityIndicator, FlatList, Button, Alert, TextInput, StyleSheet, TouchableOpacity,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import { t } from './../locales';

class MyReviews extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      myReviews: '',
      token: '',
      locationID: '',
      reviewID: '',
      userID: ''
    };
  }

  componentDidMount(){
    console.log("mounted");
    this.onClick();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({isLoading: true});
      this.getData();
    });
  }

  onClick = async () => {
    await this.getTokenAndID();
    this.getData();
  }

  getTokenAndID = async () => {
    try {
        const thisToken = await AsyncStorage.getItem('@token')
        if(thisToken !== null) {
            this.setState({token: thisToken})
        }
        const thisUserID = await AsyncStorage.getItem('@userID')
        if(thisUserID !== null) {
            this.setState({userID: thisUserID})
        }
        this.setState({gotToken: true})
      } catch (e) {
        console.log("Something broke...")
      }
  }

  getData = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+this.state.userID, {
      method: 'get',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({
            isLoading: false,
            myReviews: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  removeReview(reviewID, locationID){
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+locationID+'/review/'+reviewID, {
      method: 'delete',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => {
        this.setState({
            isLoading: true
        })
        ToastAndroid.show(t('review_deleted'), ToastAndroid.SHORT);
        this.getData();
    })
    .catch((error) => {
        console.log(error);
    });
  }

  saveAccessDetails = async () => {
      try {
        await AsyncStorage.setItem('@locationID', this.state.locationID.toString());
        await AsyncStorage.setItem('@reviewID', this.state.reviewID.toString());
      }catch (e) {
        console.log("Something broke...");
        console.log(e);
      }
  }

  // open review on the Edit screen
  openReview = async (navigation, reviewId, locationId) => {
    await this.setState({
      locationID: locationId,
      reviewID: reviewId
    });
    await this.saveAccessDetails();
    navigation.navigate('EditReview');
  }

  addPhoto = async (navigation, reviewId, locationId) => {
    await this.setState({
      locationID: locationId,
      reviewID: reviewId
    });
    await this.saveAccessDetails();
    navigation.navigate('Camera');
  }

  deletePhoto = async (reviewId, locationId) => {

    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+locationId+'/review/'+reviewId+'/photo', {
      method: 'delete',
      headers: {
        'Content-Type': 'image/jpg',
        'X-Authorization': this.state.token
      }
    })
    .then((response) => {
      Alert.alert(t('picture_deleted'));
      this.getData();
    })
    .catch((error) => {
      console.error(error);
    });
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
      return (
          <View style={styles.container}>
              <FlatList
                data={this.state.myReviews.reviews}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.touch}>
                      <View style={{alignItems: 'flex-start'}}>
                        <Text style={styles.text}>{t('location')}: {item.location.location_name}</Text>
                          <Text style={styles.text}>{t('overall_rating')}: </Text>
                          <StarRating
                            disabled={false}
                            halfStarEnabled={true}
                            maxStars={5}
                            rating={item.review.overall_rating}
                            starSize={25}
                            fullStarColor='darkred'
                          />
                          <Text style={styles.text}>{t('price_rating')}: </Text>
                          <StarRating
                            disabled={false}
                            halfStarEnabled={true}
                            maxStars={5}
                            rating={item.review.price_rating}
                            starSize={25}
                            fullStarColor='darkred'
                          />
                          <Text style={styles.text}>{t('quality_rating')}: </Text>
                          <StarRating
                            disabled={false}
                            halfStarEnabled={true}
                            maxStars={5}
                            rating={item.review.quality_rating}
                            starSize={25}
                            fullStarColor='darkred'
                          />
                          <Text style={styles.text}>{t('cleanliness_rating')}: </Text>
                          <StarRating
                            disabled={false}
                            halfStarEnabled={true}
                            maxStars={5}
                            rating={item.review.clenliness_rating}
                            starSize={25}
                            fullStarColor='darkred'
                          />
                          <Text style={styles.text}>{t('comment')}: {item.review.review_body}</Text>
                          <Text style={styles.text}>{t('photo')}: </Text>
                          <View>
                          <Image
                            source={{
                              uri: 'http://10.0.2.2:3333/api/1.0.0/location/'+item.location.location_id+'/review/'+item.review.review_id+'/photo?t=' + Date.now() + '',
                              method: 'GET',
                              headers: {
                                'Content-Type': 'image/jpeg',
                                'X-Authorization': this.state.token
                              }
                            }}
                            style={{ alignItems: 'center', margin: 5, width: 200, height: 200 }}
                          />
                          </View>
                          <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={styles.button} onPress={() => this.openReview(navigation, item.review.review_id, item.location.location_id)}>
                            <Text style={{fontSize: 20, color: 'beige'}} >{t('edit_review')}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.button} onPress={() => this.removeReview(item.review.review_id, item.location.location_id)}>
                            <Text style={{fontSize: 20, color: 'beige'}} >{t('delete_review')}</Text>
                          </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={styles.button} onPress={() => this.addPhoto(navigation, item.review.review_id, item.location.location_id)}>
                            <Text style={{fontSize: 20, color: 'beige'}} >{t('add_photo')}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.button} onPress={() => this.deletePhoto(item.review.review_id, item.location.location_id)}>
                            <Text style={{fontSize: 20, color: 'beige'}} >{t('delete_photo')}</Text>
                          </TouchableOpacity>
                          </View>
                      </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item,index) => item.review.review_id.toString()}
              />
          </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'burlywood',
    padding: 10,
    paddingBottom: 0
  },
  touch:{
    backgroundColor: 'beige',
    fontSize: 25,
    borderWidth: 3,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 5,
    marginRight: 5,
    marginBottom: 10,
    alignItems: 'flex-start'
  },
  button:{
    backgroundColor: 'darkred',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 5,
    marginRight: 5,
    marginBottom: 10,
    alignItems: 'flex-start'
  },
  review:{
    flexDirection: 'row-reverse',
    padding: 40,
    fontSize: 40,
    alignItems: 'flex-start'
  },
  text:{
    color: 'black',
    fontSize: 20
  }
});

export default MyReviews;
