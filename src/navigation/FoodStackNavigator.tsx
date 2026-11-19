import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FoodStackParamList } from './types';
import { FoodLogScreen } from '../screens/food/FoodLogScreen';
import { AddFoodModalScreen } from '../screens/food/AddFoodModalScreen';
import { FoodDetailScreen } from '../screens/food/FoodDetailScreen';

const Stack = createNativeStackNavigator<FoodStackParamList>();

export const FoodStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="FoodLog"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FoodLog" component={FoodLogScreen} />
      <Stack.Screen
        name="AddFoodModal"
        component={AddFoodModalScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
    </Stack.Navigator>
  );
};
