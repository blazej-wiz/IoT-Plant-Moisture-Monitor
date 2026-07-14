#include "host/ble_uuid.h"
#include <string.h>
#include "esp_log.h"
#include "host/ble_hs.h"
#include "os/os_mbuf.h"
#include "services/gatt/ble_svc_gatt.h"
#define TAG "PlantSensorGATT"
/* these are all kind of like can think of them like web API endpoints like /device_info for example*/
/* Plant Sensor Setup Service UUID: 63c7eb9d-a42b-4c55-aeb4-5cdf2d896fba */
static const ble_uuid128_t plant_setup_svc_uuid =
    BLE_UUID128_INIT(0xba, 0x6f, 0x89, 0x2d,
                     0xdf, 0x5c, 0xb4, 0xae,
                     0x55, 0x4c, 0x2b, 0xa4,
                     0x9d, 0xeb, 0xc7, 0x63);

/* Device Info Characteristic UUID: 138c5f90-18db-4b36-aef0-d59cbbc98587 so the phone reads this to get the plant sensor name, 
needed for user understanding and for backend primary key */
static const ble_uuid128_t device_info_chr_uuid =
    BLE_UUID128_INIT(0x87, 0x85, 0xc9, 0xbb,
                     0x9c, 0xd5, 0xf0, 0xae,
                     0x36, 0x4b, 0xdb, 0x18,
                     0x90, 0x5f, 0x8c, 0x13);

/* Wi-Fi Credentials Characteristic UUID: 1e8b2fd9-f818-41b0-bab3-e73485f77ed0 
here the phone can write the wifi name and password */
static const ble_uuid128_t wifi_credentials_chr_uuid =
    BLE_UUID128_INIT(0xd0, 0x7e, 0xf7, 0x85,
                     0x34, 0xe7, 0xb3, 0xba,
                     0xb0, 0x41, 0x18, 0xf8,
                     0xd9, 0x2f, 0x8b, 0x1e);

/* Setup Status Characteristic UUID: 35ae4bb6-a492-4693-8fb5-dabd880bbcdb this is needed to notify the app / phone the status so 
like connecting to wifi, wifi_connected etc, as once the notification of wifi connected 
happens i can then no longer use bluetooth / stop advertising */
static const ble_uuid128_t setup_status_chr_uuid =
    BLE_UUID128_INIT(0xdb, 0xbc, 0x0b, 0x88,
                     0xbd, 0xda, 0xb5, 0x8f,
                     0x93, 0x46, 0x92, 0xa4,
                     0xb6, 0x4b, 0xae, 0x35);

static const char *setup_status = "waiting";
static uint16_t setup_status_chr_val_handle;




static int device_info_chr_access(uint16_t conn_handle, uint16_t attr_handle, struct ble_gatt_access_ctxt *ctxt, void *arg)
                                  
{
    /* if this function gets called for anything other than a read operation, call an error */
    if (ctxt->op != BLE_GATT_ACCESS_OP_READ_CHR){
        return BLE_ATT_ERR_UNLIKELY;
    }
    /* this creates json text to send back to the phone */
    const char *device_info = 
    "{\"device_id\":\"ps_9ccc014229e2\","
    "\"name\":\"PlantSensor-0001\","
    "\"model\":\"PlantSensor-C6\","
    "\"firmware\":\"0.1.0\"}";
    /* this actually appends the json to NimBLE to send the info back to the phone,
    and strlen just says how long the actually json strings are */
    int rc = os_mbuf_append(ctxt->om, device_info, strlen(device_info));
    /* if the appending fails, notify the phone / user */
    if(rc != 0){
        return BLE_ATT_ERR_INSUFFICIENT_RES;
    }
    ESP_LOGI(TAG, "Succesfully sent device info to phone");
    return 0;
}

static int wifi_credentials_chr_access(uint16_t conn_handle, uint16_t attr_handle, struct ble_gatt_access_ctxt *ctxt, void *arg)
                                  
{
    /* if this function gets called for anything other than a write operation, call an error */
    if (ctxt->op != BLE_GATT_ACCESS_OP_WRITE_CHR){
        return BLE_ATT_ERR_UNLIKELY;
    }
  
    char wifi_json[128] = {0};

    int len = OS_MBUF_PKTLEN(ctxt->om);
    if (len >= sizeof(wifi_json)){
        return BLE_ATT_ERR_INVALID_ATTR_VALUE_LEN;
    }
  

    int rc = ble_hs_mbuf_to_flat(ctxt->om, wifi_json, sizeof(wifi_json) -1, NULL);
    if (rc != 0){
        return BLE_ATT_ERR_UNLIKELY;
    }

    ESP_LOGI(TAG, "recieved Wi-Fi credentials: %s", wifi_json);

    return 0;
}
    
static int setup_status_chr_access(uint16_t conn_handle, uint16_t attr_handle, struct ble_gatt_access_ctxt *ctxt, void *arg)
{
    if (ctxt->op != BLE_GATT_ACCESS_OP_READ_CHR){
        return BLE_ATT_ERR_UNLIKELY;
    }

    int rc = os_mbuf_append(ctxt->om, setup_status, strlen(setup_status));

    return rc == 0 ? 0 : BLE_ATT_ERR_INSUFFICIENT_RES;
}
   
                                




/* this creates the actually GATT services table structure and the stuff inside of this populates the structure*/
static const struct ble_gatt_svc_def gatt_svr_svcs[] = 
{

    /* this defines a characteristic of the esp to have device info as a read to get the device name*/
    { 
        .type = BLE_GATT_SVC_TYPE_PRIMARY,
        .uuid = &plant_setup_svc_uuid.u,

        .characteristics = ( struct ble_gatt_chr_def[]){
        {
            .uuid = &device_info_chr_uuid.u,
            /* the access_cb points to the actual callback function to execute that characteristics functionality */
            .access_cb = device_info_chr_access,
            .flags = BLE_GATT_CHR_F_READ,
        },
        {
            .uuid = &wifi_credentials_chr_uuid.u,
            .access_cb = wifi_credentials_chr_access,
            .flags = BLE_GATT_CHR_F_WRITE,
        },
        {
            .uuid = &setup_status_chr_uuid.u,
            .access_cb = setup_status_chr_access,
            /* this allows the phone to read the current status and the ESP can push updates to phone automatically */
            .flags = BLE_GATT_CHR_F_READ | BLE_GATT_CHR_F_NOTIFY,
            .val_handle = &setup_status_chr_val_handle,
        },

        /* this signifies there are no more characteristics in the service */
        {
            0,
        }
    },

    },
    /* this signifies there are no more services */
    {
        0,
    },

};
    
  

    






/* initialises the GATT service and services*/
int gatt_svc_init(void)
{
    int error;

    /*initialise the gatt service*/
    ble_svc_gatt_init();

    /* attemps to signal to GATT the amount of services that are in the service table */
    error = ble_gatts_count_cfg(gatt_svr_svcs);
    if (error != 0){
        ESP_LOGE(TAG, "Failed to update amount of services in GATT service, error code: %d", error);
        return error;
    }
    /* attempts to add the services from table to GATT service */
    error = ble_gatts_add_svcs(gatt_svr_svcs);
    if (error != 0){
        ESP_LOGE(TAG, "Failed to add services to GATT service, error code: %d", error);
        return error;
    }

    return 0;

}