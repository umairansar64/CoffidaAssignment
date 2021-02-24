import React, { Component } from 'react';
import { ToastAndroid, View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import { t } from './../locales';

class FavoriteLocations extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      myFavoriteLocations: '',
      token: '',
      detailsSaved: false,
      locationID: '',
      userID: '',
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
        console.log(responseJson);
        this.setState({
            isLoading: false,
            myFavoriteLocations: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  unfavourite(locationID){
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/'+locationID+'/favourite', {
      method: 'delete',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => {
        ToastAndroid.show(t('removed_from_favorites'), ToastAndroid.SHORT);
        this.setState({isLoading: true})
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
                data={this.state.myFavoriteLocations.favourite_locations}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.touch}>
                      <View style={{alignItems: 'flex-start'}}>
                        <Text style={styles.text}>{t('location_name')}: {item.location_name}</Text>
                        <Text style={styles.text}>{t('location_town')}: {item.location_town}</Text>
                          <Text style={styles.text}>{t('average_overall_rating')}:</Text>
                          <StarRating
                            disabled={false}
                            halfStarEnabled={true}
                            maxStars={5}
                            rating={item.avg_overall_rating}
                            starSize={25}
                            fullStarColor='darkred'
                          />
                          <Text style={styles.text}>{t('average_price_rating')}:</Text>
                          <StarRating
                            disabled={false}
                            halfStarEnabled={true}
                            maxStars={5}
                            rating={item.avg_price_rating}
                            starSize={25}
                            fullStarColor='darkred'
                          />
                          <Text style={styles.text}>{t('average_quality_rating')}:</Text>
                          <StarRating
                            disabled={false}
                            halfStarEnabled={true}
                            maxStars={5}
                            rating={item.avg_quality_rating}
                            starSize={25}
                            fullStarColor='darkred'
                          />
                          <Text style={styles.text}>{t('average_cleanliness_rating')}:</Text>
                          <StarRating
                            disabled={false}
                            halfStarEnabled={true}
                            maxStars={5}
                            rating={item.avg_clenliness_rating}
                            starSize={25}
                            fullStarColor='darkred'
                          />
                          <TouchableOpacity style={styles.button} onPress={() => this.unfavourite(item.location_id)}>
                            <Text style={{fontSize: 20, color: 'beige'}} >{t('remove_from_favorites')}</Text>
                          </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item,index) => item.location_id.toString()}
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

export default FavoriteLocations;
