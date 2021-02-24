import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { t } from './../locales';

import Home from './HomeScreen';
import Account from './AccountScreen';

const Tab = createBottomTabNavigator();

class HomeNavigation extends Component{
  render(){
    const navigation = this.props.navigation;
    return(
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if(route.name === t('home')) {
                iconName = focused ? 'home' : 'home';
              } else if(route.name === t('account')) {
                iconName = focused ? 'id-card' : 'id-card-o';
              }
              return <Icon name={iconName} size={35} color={color}/>;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'darkred',
            inactiveTintColor: 'gray',
            style: { position: 'absolute', fontWeight: 5, backgroundColor: 'white' }
          }}
      >
      <Tab.Screen name={t('home')} component={Home}/>
      <Tab.Screen name={t('account')} component={Account}/>
      </Tab.Navigator>
    );
  }
}

export default HomeNavigation;
