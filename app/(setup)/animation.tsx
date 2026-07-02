import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from "react-native-reanimated";


function Ripple({ delay = 0}) {
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





export default function BluetoothRipple() {
  return (

    <View style={styles.container}>
        <View style={styles.wrapper}>
            <Ripple delay={0} />
            <Ripple delay={400} />
            <Ripple delay={800} />
        

    <View style={styles.centerDot} />
    </View>
    </View>

   
   
  );
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
  },

  wrapper: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  centerDot: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1F4E20",
    },

});