import React from 'react';
import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Custom TabBar Icon using assets images
function TabBarIcon(props: {
  source: any;
  focused: boolean;
}) {
  return (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center',
      width: 32,
      height: 32,
    }}>
      <Image 
        source={props.source}
        style={{ 
          width: 26, 
          height: 26, 
          tintColor: props.focused ? '#D4761A' : '#999',
        }}
        resizeMode="contain"
      />
      {props.focused && (
        <View 
          style={{
            width: 24,
            height: 2,
            backgroundColor: '#D4761A',
            marginTop: 2,
            borderRadius: 1,
            position: 'absolute',
            bottom: -6,
          }}
        />
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#D4761A",
        tabBarInactiveTintColor: "#999", 
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          paddingBottom: 12,
          paddingTop: 12,
          height: 68,
        },
        tabBarShowLabel: false, // Hide labels completely
        tabBarIconStyle: {
          marginTop: 0,
          width: 32,
          height: 32,
        },
        // Disable the header completely
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              source={require('../../assets/images/nav/home.png')} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vendors"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              source={require('../../assets/images/nav/vendor.png')} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              source={require('../../assets/images/nav/like.png')} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              source={require('../../assets/images/nav/profile.png')} 
              focused={focused} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
