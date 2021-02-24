
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {t, getLanguage} from './locales';

import Login from './components/LoginScreen';
import Account from './components/AccountScreen';
import Signup from './components/SignupScreen';
import Home from './components/HomeScreen';
import Location from './components/LocationScreen';
import Review from './components/ReviewScreen';
import FavoriteLocations from './components/FavoriteLocationsScreen';
import LikedReviews from './components/LikedReviewsScreen';
import MyReviews from './components/MyReviewsScreen';
import HomeNavigation from './components/HomeNavigation';
import EditReview from './components/EditReviewScreen';
import Camera from './components/CameraScreen';

const Stack = createStackNavigator();

class App extends Component {

  componentDidMount(){
    getLanguage();
  }

  render(){

    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{title: t('log_in')}}/>
          <Stack.Screen name="Signup" component={Signup} options={{title: t('sign_up')}}/>
          <Stack.Screen name="Account" component={Account}  options={{headerLeft: null, title: t('account')}}/>
          <Stack.Screen name="Home" component={Home}  options={{headerLeft: null, title: t('home')}}/>
          <Stack.Screen name="Location" component={Location} options={{title: t('location')}}/>
          <Stack.Screen name="Review" component={Review} options={{title: t('review')}}/>
          <Stack.Screen name="HomeNavigation" component={HomeNavigation}  options={{headerLeft: null, title: 'Coffida'}}/>
          <Stack.Screen name="FavoriteLocations" component={FavoriteLocations} options={{title: t('favourite_locations')}}/>
          <Stack.Screen name="LikedReviews" component={LikedReviews} options={{title: t('liked_reviews')}}/>
          <Stack.Screen name="MyReviews" component={MyReviews} options={{title: t('my_reviews')}}/>
          <Stack.Screen name="EditReview" component={EditReview} options={{title: t('edit_review')}}/>
          <Stack.Screen name="Camera" component={Camera} options={{title: t('camera')}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;
