
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
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Account" component={Account}  options={{headerLeft: null}}/>
          <Stack.Screen name="Home" component={Home}  options={{headerLeft: null}}/>
          <Stack.Screen name="Location" component={Location}/>
          <Stack.Screen name="Review" component={Review}/>
          <Stack.Screen name="HomeNavigation" component={HomeNavigation}  options={{headerLeft: null, title: 'Coffida'}}/>
          <Stack.Screen name="FavoriteLocations" component={FavoriteLocations}/>
          <Stack.Screen name="LikedReviews" component={LikedReviews}/>
          <Stack.Screen name="MyReviews" component={MyReviews}/>
          <Stack.Screen name="EditReview" component={EditReview}/>
          <Stack.Screen name="Camera" component={Camera}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;
