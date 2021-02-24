import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';
import { t } from './../locales';

class Review extends Component{
  constructor(props){
    super(props);

    this.state = {
      overallRrating: 0,
      priceRrating: 0,
      cleanlinessRrating: 0,
      qualityRrating: 0,
      numOfLikes: 0,
      isLoading: true,
      token: '',
      userID: 0,
      userInfo: [],
      locations: [],
      locationID: '',
      locationReviews: '',
      reviewID: '',
      reviewBody: '',
      hasLiked: false,
      likeStatus: t('not_liked'),
      photoPath: ''
    };
  }

  componentDidMount(){

    this.onClick();
    console.log("mounted");
  }

  onClick = async () => {
      await this.getTokenAndID();
      this.getData();
  }

  getData = async () => {
    await this.getReviewData();
    await this.getUserData();
    await this.saveUserAndReviewData();
  }

  saveUserAndReviewData = async () => {

    for(var i=0; i<this.state.locations.length;i++){

      if(this.state.locations[i].location_id == this.state.locationID){
        var selectedLocation = this.state.locations[i];

        for(var j=0; j<selectedLocation.location_reviews.length;j++){
          if(selectedLocation.location_reviews[j].review_id == this.state.reviewID){
            var thisReview = selectedLocation.location_reviews[j];
            this.setState({
              overallRrating: thisReview.review_overallrating,
              priceRrating: thisReview.review_pricerating,
              qualityRrating: thisReview.review_qualityrating,
              cleanlinessRrating: thisReview.review_clenlinessrating,
              reviewBody: thisReview.review_body,
              numOfLikes: thisReview.likes,
              photoPath: thisReview.photo_path
            });
          }
        }
      }
    }

    for(var i=0; i<this.state.userInfo.liked_reviews.length;i++){
      if(this.state.userInfo.liked_reviews[i].review.review_id == this.state.reviewID){
        this.setState({
          likeStatus: t('liked'),
          hasLiked: true
        });
      }
    }
  }

  getTokenAndID = async () => {

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
        const thisUserID = await AsyncStorage.getItem('@userID')
        if(thisUserID !== null) {
            this.setState({userID: thisUserID});
        }
      } catch (e) {
        console.log("Something broke...")
      }
  }

  likeUnlikeReview = async () => {

      if(this.state.hasLiked){
        await this.unlikeReview();
      }
      else{
        await this.likeReview();
      }

      await this.setState({hasLiked: !this.state.hasLiked})

      await this.getData();
  }

  unlikeReview = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationID+'/review/'+this.state.reviewID+'/like', {
      method: 'delete',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => {
        this.setState({
            likeStatus: t('not_liked')
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  likeReview = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationID+'/review/'+this.state.reviewID+'/like', {
      method: 'post',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => {
        this.setState({
            likeStatus: t('liked')
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  getUserData = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+this.state.userID, {
      method: 'get',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            isLoading: false,
            userInfo: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  getReviewData = async () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/find', {
      method: 'get',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            locations: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  getThumbState(){
    if(this.state.hasLiked){
      return 'thumbs-up'
    }
    return 'thumbs-o-up'
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
            <View style={styles.subContainer}>
            <Text style={{fontSize: 20, color: 'darkred'}}>{t('overall_rating')}: {this.state.overallRrating}</Text>
            <StarRating
              disabled={false}
              halfStarEnabled={true}
              maxStars={5}
              rating={this.state.overallRrating}
              starSize={25}
              fullStarColor='darkred'
            />
            <Text style={{fontSize: 20, color: 'darkred'}}>{t('quality_rating')}: {this.state.qualityRrating}</Text>
            <StarRating
              disabled={false}
              halfStarEnabled={true}
              maxStars={5}
              rating={this.state.qualityRrating}
              starSize={25}
              fullStarColor='darkred'
            />
            <Text style={{fontSize: 20, color: 'darkred'}}>{t('price_rating')}: {this.state.priceRrating}</Text>
            <StarRating
              disabled={false}
              halfStarEnabled={true}
              maxStars={5}
              rating={this.state.priceRrating}
              starSize={25}
              fullStarColor='darkred'
            />
            <Text style={{fontSize: 20, color: 'darkred'}}>{t('cleanliness_rating')}: {this.state.cleanlinessRrating}</Text>
            <StarRating
              disabled={false}
              halfStarEnabled={true}
              maxStars={5}
              rating={this.state.cleanlinessRrating}
              starSize={25}
              fullStarColor='darkred'
            />
            <Text style={{fontSize: 20, color: 'darkred'}}>{t('comment')}: {this.state.reviewBody}</Text>
            <Text style={{fontSize: 20, color: 'darkred'}}>{t('likes')}: {this.state.numOfLikes}</Text>
            <Icon name={this.getThumbState()} style={styles.icon} onPress={() => this.likeUnlikeReview()}>
              <Text style={{fontSize: 20}}>  {this.state.likeStatus}</Text>
            </Icon>
            <Image
              source={{
                uri: 'http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationID+'/review/'+this.state.reviewID+'/photo?t=' + Date.now() + '',
                method: 'GET',
                headers: {
                  'Content-Type': 'image/jpeg',
                  'X-Authorization': this.state.token
                }
              }}
              style={{ alignItems: 'center', width: 200, height: 200 }}
            />
            </View>
          </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'burlywood',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  subContainer:{
    backgroundColor: 'beige',
    padding: 20,
    alignItems: 'flex-start'
  },
  shopName:{
    color: 'darkblue',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    fontSize: 25,
    fontWeight: 'bold',
    padding: 5
  },
  touch:{
    color: 'darkblue',
    backgroundColor: 'white',
    fontSize: 25,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 5,
    padding: 5
  },
  icon:{
    fontSize: 30,
    padding: 5
  }
});

export default Review;

//uri: 'file:///data/user/0/com.coffida_assignment/cache/Camera/75ccfdce-a5a8-4988-99c7-76bdd157e5ad.jpg',

// <Image
//   source={{
//     uri: this.state.photoPath,
//     method: 'POST',
//     headers: {
//       Pragma: 'no-cache'
//     },
//     body: 'Your Body goes here'
//   }}
//   style={{ alignItems: 'center', width: 200, height: 200 }}
// />
