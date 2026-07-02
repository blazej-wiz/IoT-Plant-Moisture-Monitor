import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from "react-native-reanimated";



export const Ripple = ({ delay = 0 }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(delay, withRepeat(withTiming(1, { duration: 1600}), -1, false));
    }, [delay]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0.8, 0]),
        transform: [
            {
                scale: interpolate(progress.value, [0, 1], [0.3, 1.5]),
            },
        ],
    }));

    return <Animated.View style={[styles.ripple, animatedStyle]} />;
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  ripple: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#84b89f",
  },
})
