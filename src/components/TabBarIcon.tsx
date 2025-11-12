import React from 'react';
import { Text } from 'react-native';

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  color: string;
  size: number;
}

export default function TabBarIcon({ routeName, focused, color, size }: TabBarIconProps) {
  const getIcon = () => {
    switch (routeName) {
      case 'Home':
        return focused ? '🏠' : '🏡';
      case 'Browse':
        return focused ? '🔍' : '🔎';
      case 'Favorites':
        return focused ? '❤️' : '🤍';
      case 'Profile':
        return focused ? '👤' : '👥';
      default:
        return '📱';
    }
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {getIcon()}
    </Text>
  );
}
