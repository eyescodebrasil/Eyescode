import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import FeedScreen from "../screens/FeedScreen";
import LivesScreen from "../screens/LivesScreen";
import CommunitiesScreen from "../screens/CommunitiesScreen";
import ProfileScreen from "../screens/ProfileScreen";

import BottomNav from "../components/BottomNav";
import { colors } from "../theme/colors";

export default function AppNavigator() {
  const [screen, setScreen] = useState("home");

  function renderScreen() {
  switch (screen) {

    case "feed":
      return <FeedScreen />;

    case "lives":
      return <LivesScreen />;

    case "communities":
      return <CommunitiesScreen />;

  case "profile":
  return (
    <ProfileScreen
      onNavigate={setScreen}
    />
  );

    default:
      return (
        <HomeScreen
          onNavigate={setScreen}
        />
      );
  }
}

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom"]}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            {renderScreen()}
          </View>

          <BottomNav
            activeScreen={screen}
            onNavigate={setScreen}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
  },
});