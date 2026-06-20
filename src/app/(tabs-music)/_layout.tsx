import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: "#0f0f0f",
        },
        tabBarActiveTintColor: "#0f0f0f",
        tabBarInactiveTintColor: "#525252",
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='playlist'
        options={{
          title: 'Add Meal',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="playlist-music" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
