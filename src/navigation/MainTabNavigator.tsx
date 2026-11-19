import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { FoodStackNavigator } from './FoodStackNavigator';
import { WorkoutStackNavigator } from './WorkoutStackNavigator';
import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { colors, fontSize, fontWeight } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.slateMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => {
          let icon = '🏠';
          if (route.name === 'HomeTab') icon = '🏠';
          else if (route.name === 'FoodTab') icon = '🥗';
          else if (route.name === 'WorkoutTab') icon = '🏃';
          else if (route.name === 'ProgressTab') icon = '📊';
          else if (route.name === 'ProfileTab') icon = '👤';

          return (
            <Text style={[styles.tabIcon, focused ? styles.tabIconActive : null]}>
              {icon}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Beranda',
        }}
      />
      <Tab.Screen
        name="FoodTab"
        component={FoodStackNavigator}
        options={{
          tabBarLabel: 'Makanan',
        }}
      />
      <Tab.Screen
        name="WorkoutTab"
        component={WorkoutStackNavigator}
        options={{
          tabBarLabel: 'Latihan',
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progres',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1.5,
    borderTopColor: colors.borderLight,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.7,
  },
  tabIconActive: {
    opacity: 1,
  },
});
