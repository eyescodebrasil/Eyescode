import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Feed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0f14",
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },
});