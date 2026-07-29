
export const LinkESPtoPlant = async (deviceId: string, plant_id: number) => {

    const response = await fetch(`http://192.168.0.90:8000/api/plants/${plant_id}/sensor`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            deviceid: deviceId
        }),
    })
    const esptoplant = await response.json()
    return esptoplant
}