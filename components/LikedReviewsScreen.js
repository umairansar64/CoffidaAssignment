import React, { Component } from 'react';
import { ToastAndroid, View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import { t } from './../locales';

class LikedReviews extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      myLikedReviews: '',
      token: '',
      gotToken: false,
      detailsSaved: false,
      locationID: '',
      userID: ''
    };
  }

  componentDidMount(){
    console.log("mounted");
    this.onClick();
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
        console.log(responseJson);
        this.setState({
            isLoading: false,
            myLikedReviews: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  removeLike(reviewID, locationID){
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+locationID+'/review/'+reviewID+'/like', {
      method: 'delete',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => {
        this.setState({
            isLoading: true
        })
        ToastAndroid.show(t('removed_from_liked'), ToastAndroid.SHORT);
        this.getData();
    })
    .catch((error) => {
        console.log(error);
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
                data={this.state.myLikedReviews.liked_reviews}
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
                          <TouchableOpacity style={styles.button} onPress={() => this.removeLike(item.review.review_id, item.location.location_id)}>
                            <Text style={{fontSize: 20, color: 'beige'}} >{t('remove_from_liked')}</Text>
                          </TouchableOpacity>
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
  text:{
    color: 'black',
    fontSize: 20
  }
});

export default LikedReviews;
