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
          borderTopColor: colors.primary,
          height: 70,
          paddingBottom: 8,
          paddingTop: 4,
          marginBottom: 50
        },
        tabBarLabelStyle: {
            flex: 1,
            fontFamily: 'SpaceGrotesk_400Regular',
            fontSize: 12,
            width: 100
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
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
        name='playlists'
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="playlist-music" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='artists'
        options={{
          title: 'Artists',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="microphone-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='albums'
        options={{
          title: 'Albums',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="album" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
