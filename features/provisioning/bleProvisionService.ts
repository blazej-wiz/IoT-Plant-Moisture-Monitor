import { BleManager, Device } from "react-native-ble-plx";

/* this creates a constant variable that holds the UUID of my plant sensor that is con
figured in the BLE hardware setup*/
export const PLANT_SETUP_SERVICE_UUID =
"63c7eb9d-a42b-4c55-aeb4-5cdf2d896fba";

/* this creates a blemanager object */
const bleManager = new BleManager();

/* defines the sensor type, so the types that can exist in the sensor */
export type FoundPlantSensor = {
    id: string;
    name: string;
    rssi: number | null;
};


/* this function begins the sensor scan, if the sensor is found, call onsensor found if not found
call onerror*/
export function startPlantSensorScan(
    onSensorFound: (sensor: FoundPlantSensor) => void,
    onError: (error: Error) => void
){
    /* this begins the scan looking for the sepcific UUID*/
    bleManager.startDeviceScan(
        [PLANT_SETUP_SERVICE_UUID],
        null,
        (error, device: Device | null) => {
            /* if phone cannot scan for some reason, return that an error has occured */
            if (error) {
                onError(error);
                return;
            }
            /* if there is no device, stop the function here */
            if (!device) {
                return;
            }
            /** this just checks if its actually the correct device */
        /* this just makes sure that the name that is retrieved will either be the devices name or the local name */
        const name = device.name ?? device.localName;
        /*  so now if there is a device with no name ignore it as the esp has been configured
        with a name */
        if (!name) {
            return;
        }
        /* if a sensor is found, return its id, name and signal strength*/
        onSensorFound({
            id: device.id,
            name,
            rssi: device.rssi ?? null,
        });
    }
    );
}
/* this stops the scanning */
export function stopPlantSensorScan(){
    bleManager.stopDeviceScan();
}


export async function connectToPlantSensor(deviceId: string) {
    const device = await bleManager.connectToDevice(deviceId);

    console.log("Connected to device:", device.name)

    const readyDevice = await device.discoverAllServicesAndCharacteristics();

    console.log("Discovered services and characteristics");

    return readyDevice;
}
