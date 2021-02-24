import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import { t } from './../locales';


class Home extends Component{
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      coffeeShopsData: [],
      token: '',
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
    this.focusListener = this.props.navigation.addListener('focus', () => {
        this.setState({isLoading: true});
        this.getData();
    });
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
    return fetch('http://10.0.2.2:3333/api/1.0.0/find', {
      method: 'get',
      headers: {'X-Authorization': this.state.token}
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            isLoading: false,
            coffeeShopsData: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  openLocation = async (navigation, id) => {
    await this.setState({locationID: id});
    this.saveAccessDetails();
    navigation.navigate('Location');
  }

  saveAccessDetails = async () => {
      try {
        await AsyncStorage.setItem('@locationID', this.state.locationID.toString());
      }catch (e) {
        console.log("Something broke...");
        console.log(e);
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
      return (
          <View style={styles.container}>
              <FlatList
                data={this.state.coffeeShopsData}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.touch} onPress={() => this.openLocation(navigation, item.location_id)}>
                      <Text style={styles.shopName}>{item.location_name}</Text>
                      <View style={{alignItems: 'flex-start'}}>
                        <Text style={{fontSize: 20}}>{t('town')}: {item.location_town}</Text>
                        <Text style={{fontSize: 20}}>{t('average_overall_rating')}: {item.avg_overall_rating}</Text>
                        <StarRating
                          disabled={false}
                          halfStarEnabled={true}
                          maxStars={5}
                          rating={item.avg_overall_rating}
                          starSize={30}
                          fullStarColor='darkred'
                        />
                      </View>
                      <View style={{alignItems: 'flex-start'}}>
                      <Text style={styles.text}>"{t('tap_to_learn_more')}"</Text>
                      </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item,index) => item.location_id.toString()}
              />
              <Text></Text>
              <Text></Text>
          </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'burlywood',
    fontSize: 25,
    padding: 7
  },
  shopName:{
    color: 'white',
    borderRadius: 5,
    backgroundColor: 'darkred',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 5
  },
  touch:{
    backgroundColor: 'beige',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10
  },
  text:{
    fontSize: 15,
    alignItems: 'flex-start',
    backgroundColor: 'beige',
    borderColor: 'darkred',
    borderWidth: 1,
    padding: 5,
    marginTop: 5,
    borderRadius: 5
  }
});

export default Home;
