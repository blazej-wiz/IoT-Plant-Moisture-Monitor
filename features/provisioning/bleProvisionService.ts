import { BleManager, Device } from "react-native-ble-plx";

export const PLANT_SETUP_SERVICE_UUID =
"63c7eb9d-a42b-4c55-aeb4-5cdf2d896fba";

const bleManager = new BleManager();

export type FoundPlantSensor = {
    id: string;
    name: string;
    rssi: number | null;
};

export function startPlantSensorScan(
    onSensorFound: (sensor: FoundPlantSensor) => void,
    onError: (error: Error) => void
){
    bleManager.startDeviceScan(
        [PLANT_SETUP_SERVICE_UUID],
        null,
        (error, device: Device | null) => {
            if (error) {
                onError(error);
                return;
            }

            if (!device) {
                return;
            }
        
        const name = device.name ?? device.localName;

        if (!name) {
            return;
        }

        onSensorFound({
            id: device.id,
            name,
            rssi: device.rssi ?? null,
        });
    }
    );
}

export function stopPlantSensorScan(){
    bleManager.stopDeviceScan();
}
