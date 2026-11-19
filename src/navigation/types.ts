import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type FoodStackParamList = {
  FoodLog: undefined;
  AddFoodModal: undefined;
  FoodDetail: { foodName?: string } | undefined;
};

export type WorkoutStackParamList = {
  WorkoutList: undefined;
  ActiveTracker: undefined;
  WorkoutSummary: {
    distanceKm?: number;
    durationSeconds?: number;
    caloriesBurned?: number;
    avgPace?: string;
  } | undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  FitnessTarget: undefined;
  Settings: undefined;
  NotificationSettings: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  FoodTab: NavigatorScreenParams<FoodStackParamList>;
  WorkoutTab: NavigatorScreenParams<WorkoutStackParamList>;
  ProgressTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
