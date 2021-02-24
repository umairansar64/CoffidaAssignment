import React, { Component } from 'react';
import { ToastAndroid, View, Text, ActivityIndicator, FlatList, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';
import { t } from './../locales';

class Location extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      gotID: false,
      locationData: [],
      locationID: '',
      isFavorite: false,
      userID: '',
      userInfo: [],
      showAddReview: false,
      reviewButtonText: t('add_review'),
      overallRating: 0,
      priceRating: 0,
      qualityRating: 0,
      cleanlinessRating: 0,
      commentBody: '',
      forbiddenWords: ["cake", "cakes", "pastry", "pastries", "tea"],
      errorMessage: ''
    };
  }

  componentDidMount(){
    this.onClick();
    this.focusListener = this.props.navigation.addListener('focus', () => {
        this.getData();
    });
    console.log("mounted");
  }

  onClick = async () => {
      await this.getTokenAndID();
      this.getData();
  }

  getTokenAndID = async () => {

    try {
        const thisLocID = await AsyncStorage.getItem('@locationID')
        if(thisLocID !== null) {
            this.setState({locationID: thisLocID});
        }
        const thisToken = await AsyncStorage.getItem('@token')
        if(thisToken !== null) {
            this.setState({token: thisToken});
        }
        const thisUserID = await AsyncStorage.getItem('@userID')
        if(thisUserID !== null) {
            this.setState({userID: thisUserID});
        }
      } catch (e) {
        console.log("Something broke...")
      }
  }

  getData = async () => {
    await this.getLocationData();
    await this.getUserData();
    await this.isLocationFavorite();
  }

  getLocationData = async () => {
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.locationID)
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            locationData: responseJson,
            isLoading: false
        })
    })
    .catch((error) => {
        console.log(error);
        this.getTokenAndID();
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

  isLocationFavorite = () => {
    for(var i=0; i<this.state.userInfo.favourite_locations.length;i++){
      if(this.state.userInfo.favourite_locations[i].location_id == this.state.locationID){
        this.setState({isFavorite: true});
      }
    }
  }

  getHeart() {
    if(this.state.isFavorite) return 'heart'
    return 'heart-o'
  }

  favUnfavLocation = async () => {

      if(this.state.isFavorite){
        await this.unFavLocation();
      }
      else{
        await this.favLocation();
      }
      await this.setState({isFavorite: !this.state.isFavorite})
      await this.getData();
  }

  unFavLocation = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationID+'/favourite', {
      method: 'delete',
      headers: {'X-Authorization': this.state.token}
    })
    .catch((error) => {
        console.log(error);
    });
  }

  favLocation = () => {
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationID+'/favourite', {
      method: 'post',
      headers: {'X-Authorization': this.state.token}
    })
    .catch((error) => {
        console.log(error);
    });
  }

  openReview = async (navigation, reviewID) => {
    await this.saveReviewID(reviewID);
    navigation.navigate('Review');
  }

  saveReviewID = async (reviewID) => {
      try {
        await AsyncStorage.setItem('@reviewID', reviewID.toString());
      }catch (e) {
        console.log("Something broke...");
        console.log(e);
      }
  }

  addReviewPressed(){
    this.setState({showAddReview: !this.state.showAddReview})
    if(this.state.showAddReview){
      this.setState({reviewButtonText: t('add_review')})
    }else {
      this.setState({reviewButtonText: t('cancel')})
    }
  }

  ValidateAndSaveReview(){

    let commentValid = true;
    let thisComment = this.state.commentBody.toLowerCase();

    for(var i=0; i<this.state.forbiddenWords.length;i++){
      if(thisComment.includes(this.state.forbiddenWords[i])){
        commentValid = false;
        this.setState({errorMessage: t('consider_coffee_reviews')})
      }
    }

    if(commentValid){
      this.setState({errorMessage: ''})
      this.saveReview();
    }
  }

  saveReview(){

    this.setState({reviewButtonText: t('add_review')});

    let sendData = {};

    sendData['overall_rating'] = this.state.overallRating;
    sendData['price_rating'] = this.state.priceRating;
    sendData['quality_rating'] = this.state.qualityRating;
    sendData['clenliness_rating'] = this.state.cleanlinessRating;
    sendData['review_body'] = this.state.commentBody;

    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationID+'/review', {
      method: 'post',
      headers: {'X-Authorization': this.state.token,
                'Content-Type': 'application/json'},
      body: JSON.stringify(sendData)
    })
    .then((response) => {
      ToastAndroid.show(t('review_added'), ToastAndroid.SHORT);
      this.getData();
      this.setState({showAddReview: false});
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
            <View style={styles.subContainer}>
            <Text style={styles.heading}>{this.state.locationData.location_name} ({this.state.locationData.location_town})</Text>
              <Text style={styles.text}>{t('average_overall_rating')}:</Text>
              <StarRating
                disabled={false}
                halfStarEnabled={true}
                maxStars={5}
                rating={this.state.locationData.avg_overall_rating}
                starSize={20}
                fullStarColor='darkred'
              />
              <Text style={styles.text}>{t('average_price_rating')}:</Text>
              <StarRating
                disabled={false}
                halfStarEnabled={true}
                maxStars={5}
                rating={this.state.locationData.avg_price_rating}
                starSize={20}
                fullStarColor='darkred'
              />
              <Text style={styles.text}>{t('average_quality_rating')}:</Text>
              <StarRating
                disabled={false}
                halfStarEnabled={true}
                maxStars={5}
                rating={this.state.locationData.avg_quality_rating}
                starSize={20}
                fullStarColor='darkred'
              />
              <Text style={styles.text}>{t('average_cleanliness_rating')}:</Text>
              <StarRating
                disabled={false}
                halfStarEnabled={true}
                maxStars={5}
                rating={this.state.locationData.avg_clenliness_rating}
                starSize={20}
                fullStarColor='darkred'
              />
              <Icon name={this.getHeart()} style={styles.icon} onPress={() => this.favUnfavLocation()}>
                <Text></Text>
              </Icon>
            </View>
            <View style={{alignItems: 'flex-start'}}>
            <TouchableOpacity style={styles.touch} onPress={() => this.addReviewPressed()}>
              <Text style={{color: 'beige', fontSize: 20}}>{this.state.reviewButtonText}</Text>
            </TouchableOpacity>
            </View>
            { this.state.showAddReview &&
              <View style={{alignItems: 'flex-start', backgroundColor: 'beige', padding: 10, marginTop: 10, borderRadius: 10}}>
                <Text>{t('overall_rating')}:</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.overallRating}
                  starSize={25}
                  selectedStar={(rating) => this.setState({overallRating: rating})}
                />
                <Text>{t('price_rating')}:</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.priceRating}
                  starSize={25}
                  selectedStar={(rating) => this.setState({priceRating: rating})}
                />
                <Text>{t('quality_rating')}:</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.qualityRating}
                  starSize={25}
                  selectedStar={(rating) => this.setState({qualityRating: rating})}
                />
                <Text>{t('cleanliness_rating')}:</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.cleanlinessRating}
                  starSize={25}
                  selectedStar={(rating) => this.setState({cleanlinessRating: rating})}
                />
                <Text>{t('comment')}:</Text>
                <TextInput
                  style={{backgroundColor: 'white'}}
                  placeholder={"e.g. "+t('example_coffee_was_nice')}
                  onChangeText={(commentBody) => this.setState({commentBody})}
                  value={this.state.commentBody}/>
                <TouchableOpacity style={styles.touch} onPress={() => this.ValidateAndSaveReview()}>
                  <Text style={{color: 'beige', fontSize: 20}}>{t('save')}</Text>
                </TouchableOpacity>
                <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
              </View>
            }
            <FlatList
              data={this.state.locationData.location_reviews}
              style = {styles.subContainer2}
              renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.openReview(navigation, item.review_id)}>
                <View style = {styles.subContainer}>
                  <Text style={styles.text}>{t('overall_rating')}: {item.overall_rating}</Text>
                  <StarRating
                    disabled={false}
                    halfStarEnabled={true}
                    maxStars={5}
                    rating={item.overall_rating}
                    starSize={20}
                    fullStarColor='darkred'
                  />
                  <Text style={styles.text}>{t('comment')}: {item.review_body}</Text>
                  <Text style={styles.text}>{t('likes')}: {item.likes}</Text>
                  <Text style={{borderColor: 'darkred', borderWidth: 1}}>{t('tap_for_details')}:</Text>
                </View>
              </TouchableOpacity>
              )}
              keyExtractor={(item,index) => item.review_id.toString()}
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
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0
  },
  heading:{
    color: 'darkred',
    fontSize: 25,
    fontWeight: 'bold',
    flexDirection: 'row',
    textDecorationLine: 'underline'
  },
  text:{
    color: 'darkred',
    fontSize: 17
  },
  subContainer:{
    color: 'white',
    backgroundColor: 'beige',
    fontSize: 25,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 5,
    padding: 10,
    alignItems: 'flex-start'
  },
  subContainer2:{
    backgroundColor: 'darkred',
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 10,
    padding: 5
  },
  touch:{
    backgroundColor: 'darkred',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 5,
    alignItems: 'flex-start'
  },
  icon:{
    fontSize: 30,
    padding: 5,
    color: 'darkred'
  }
});

export default Location;
