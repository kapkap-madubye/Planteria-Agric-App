import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const LoadingAnimation = ({ size = 100, color = "#3498db" }) => {
  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { width: size, height: size }]}>
        <LottieView
          source={require("./loading-Animation.json")} // Adjust the path to your animation file
          autoPlay
          loop
          style={[styles.animation, { borderColor: color }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
});

export default LoadingAnimation;
