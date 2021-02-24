import React, { Component } from 'react';
import { ToastAndroid, View, Text, ActivityIndicator, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import { t } from './../locales';

class EditReview extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      myReviews: '',
      token: '',
      gotToken: false,
      detailsSaved: false,
      locationID: '',
      reviewID: '',
      userID: '',
      thisReview: '',
      overallRating: 0,
      priceRating: 0,
      qualityRating: 0,
      cleanlinessRating: 0
    };
  }

  componentDidMount(){
    console.log("mounted");
    this.onClick();
  }

  onClick = async () => {
    await this.getTokenAndID();
    await this.getData();
    this.getThisReview();
  }

  getTokenAndID = async () => {
    try {
        const thisToken = await AsyncStorage.getItem('@token')
        if(thisToken !== null) {
            this.setState({token: thisToken})
        }
        const thisLocID = await AsyncStorage.getItem('@locationID')
        if(thisLocID !== null) {
            this.setState({locationID: thisLocID})
        }
        const thisRevID = await AsyncStorage.getItem('@reviewID')
        if(thisRevID !== null) {
            this.setState({reviewID: thisRevID})
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
            gotToken: false,
            myReviews: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }


  getThisReview = () => {
      for(var i=0; i<this.state.myReviews.reviews.length;i++){
        if(this.state.myReviews.reviews[i].review.review_id == this.state.reviewID){
          this.setState({
            thisReview: this.state.myReviews.reviews[i].review,
            overallRating: this.state.myReviews.reviews[i].review.overall_rating,
            priceRating: this.state.myReviews.reviews[i].review.price_rating,
            qualityRating: this.state.myReviews.reviews[i].review.quality_rating,
            cleanlinessRating: this.state.myReviews.reviews[i].review.clenliness_rating,
            reviewBody: this.state.myReviews.reviews[i].review.review_body
          });
        }
      }
  }

  saveChanges() {
    let sendData = {};

    sendData['overall_rating'] = this.state.overallRating;
    sendData['price_rating'] = this.state.priceRating;
    sendData['quality_rating'] = this.state.qualityRating;
    sendData['clenliness_rating'] = this.state.cleanlinessRating;
    sendData['review_body'] = this.state.reviewBody;

    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+this.state.locationID+'/review/'+this.state.reviewID, {
      method: 'patch',
      headers: {'X-Authorization': this.state.token,
                'Content-Type': 'application/json'},
      body: JSON.stringify(sendData)
    })
    .then((response) => {
      ToastAndroid.show(t('changes_saved'), ToastAndroid.SHORT);
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
            <Text style={{color: 'darkred', fontSize: 20, padding: 5, fontWeight: 'bold'}}>{t('edit_review')}</Text>
            <View style={styles.subContainer}>
              <Text style={{fontSize: 20, color: 'darkred'}}>{t('overall_rating')}</Text>
              <StarRating
                disabled={false}
                maxStars={5}
                fullStarColor='darkred'
                rating={this.state.overallRating}
                selectedStar={(rating) => this.setState({overallRating: rating})}
              />
              <Text style={{fontSize: 20, color: 'darkred'}}>{t('price_rating')}</Text>
              <StarRating
                disabled={false}
                maxStars={5}
                fullStarColor='darkred'
                rating={this.state.priceRating}
                selectedStar={(rating) => this.setState({priceRating: rating})}
              />
              <Text style={{fontSize: 20, color: 'darkred'}}>{t('quality_rating')}</Text>
              <StarRating
                disabled={false}
                maxStars={5}
                fullStarColor='darkred'
                rating={this.state.qualityRating}
                selectedStar={(rating) => this.setState({qualityRating: rating})}
              />
              <Text style={{fontSize: 20, color: 'darkred'}}>{t('cleanliness_rating')}</Text>
              <StarRating
                disabled={false}
                maxStars={5}
                fullStarColor='darkred'
                rating={this.state.cleanlinessRating}
                selectedStar={(rating) => this.setState({cleanlinessRating: rating})}
              />
              <Text style={{fontSize: 20, color: 'darkred'}}>{t('comment')}</Text>
              <TextInput
                placeholder={"e.g. "+t('example_coffee_was_nice')}
                style={{backgroundColor: 'white'}}
                onChangeText={(reviewBody) => this.setState({reviewBody})}
                value={this.state.reviewBody}/>
              <TouchableOpacity style={styles.touch} onPress={() => this.saveChanges()}>
                <Text style={{fontSize: 20, color: 'beige'}}>{t('save')}</Text>
              </TouchableOpacity>
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
    padding: 10,
    paddingBottom: 0
  },
  subContainer:{
    backgroundColor: 'beige',
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start'
  },
  touch:{
    backgroundColor: 'darkred',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    margin: 5,
    padding: 5
  },
});

export default EditReview;
