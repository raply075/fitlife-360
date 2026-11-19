import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from './types';
import { WorkoutScreen } from '../screens/workout/WorkoutScreen';
import { ActiveTrackerScreen } from '../screens/workout/ActiveTrackerScreen';
import { WorkoutSummaryScreen } from '../screens/workout/WorkoutSummaryScreen';

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export const WorkoutStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="WorkoutList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WorkoutList" component={WorkoutScreen} />
      <Stack.Screen name="ActiveTracker" component={ActiveTrackerScreen} />
      <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
    </Stack.Navigator>
  );
};
