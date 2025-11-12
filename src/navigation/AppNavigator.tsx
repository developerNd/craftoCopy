import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList, BrowseStackParamList } from '../types';

// Import screens (we'll create these next)
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TemplatePreviewScreen from '../screens/TemplatePreviewScreen';
import EditorScreen from '../screens/EditorScreen';
import ExportScreen from '../screens/ExportScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import components
import TabBarIcon from '../components/TabBarIcon';

const RootStack = createStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const BrowseStack = createStackNavigator<BrowseStackParamList>();

// Tab bar icon component
const TabBarIconComponent = ({ routeName, focused, color, size }: any) => (
  <TabBarIcon
    routeName={routeName}
    focused={focused}
    color={color}
    size={size}
  />
);

// Tab bar icon renderer
const renderTabBarIcon = (routeName: string) => ({ focused, color, size }: any) => (
  <TabBarIconComponent
    routeName={routeName}
    focused={focused}
    color={color}
    size={size}
  />
);

// Browse Stack Navigator
function BrowseStackNavigator() {
  return (
    <BrowseStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <BrowseStack.Screen name="CategoryList" component={BrowseScreen} />
      <BrowseStack.Screen name="TemplateList" component={BrowseScreen} />
      <BrowseStack.Screen name="Search" component={BrowseScreen} />
    </BrowseStack.Navigator>
  );
}

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: renderTabBarIcon(route.name),
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <MainTab.Screen 
        name="Browse" 
        component={BrowseStackNavigator}
        options={{ title: 'Browse' }}
      />
      <MainTab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </MainTab.Navigator>
  );
}

// Root Stack Navigator
function RootStackNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      <RootStack.Screen name="Main" component={MainTabNavigator} />
      <RootStack.Screen 
        name="Browse" 
        component={BrowseScreen}
        options={{
          headerShown: true,
          title: 'Browse Templates',
        }}
      />
      <RootStack.Screen 
        name="TemplatePreview" 
        component={TemplatePreviewScreen}
        options={{
          headerShown: true,
          title: 'Template Preview',
        }}
      />
      <RootStack.Screen 
        name="Editor" 
        component={EditorScreen}
        options={{
          headerShown: true,
          title: 'Edit Template',
        }}
      />
      <RootStack.Screen 
        name="Export" 
        component={ExportScreen}
        options={{
          headerShown: true,
          title: 'Export & Share',
        }}
      />
      <RootStack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
        }}
      />
    </RootStack.Navigator>
  );
}

// Main Navigation Component
export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStackNavigator />
    </NavigationContainer>
  );
}
