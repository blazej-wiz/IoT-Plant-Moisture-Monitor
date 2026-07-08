import { router } from "expo-router";

export function mockData() {
    return (
    router.push({
        pathname: "/third_sensor_found",
        params: {
            name: 'GrowSense Sensor',
            signal: 'Strong',
        },
}))
 
}