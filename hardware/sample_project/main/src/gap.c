#include "gap.h"

#include <string.h>

#include "esp_log.h"

#include "host/ble_hs.h"
#include "host/util/util.h"
#include "services/gap/ble_svc_gap.h"
#include <stdio.h>
#define TAG "PlantSensor"
#define DEVICE_NAME "PlantSensor-0001"

/*this stores the BLE address that nimble chooses in adv_int*/
static uint8_t own_addr_type;
static uint8_t addr_val[6] = {0};
inline static void format_addr(char *addr_str, uint8_t addr[]) {
    sprintf(addr_str, "%02X:%02X:%02X:%02X:%02X:%02X", addr[0], addr[1],
            addr[2], addr[3], addr[4], addr[5]);
}
static void start_advertising(void);
static int gap_event_handler(struct ble_gap_event *event, void *arg);

static void start_advertising(void) {

    int advert_set = 0;
    int scan_set = 0;
    int advert_start = 0;
    const char *name;
    /* creates empty structure for advertising packet and scan response and behaviour*/
    struct ble_hs_adv_fields adv_fields = {0};
    struct ble_hs_adv_fields rsp_fields = {0};
    struct ble_gap_adv_params adv_params = {0};

    /* sets up basic info for nearby devices to know about the esp, its a BLE device and discoverable*/
    adv_fields.flags = BLE_HS_ADV_F_DISC_GEN | BLE_HS_ADV_F_BREDR_UNSUP;

    /*sets device name in advertising packet*/
    name = ble_svc_gap_device_name();
    adv_fields.name = (uint8_t *)name;
    /* provides nimble the length of the name */
    adv_fields.name_len = strlen(name);
    /*indicates this is the full name*/
    adv_fields.name_is_complete = 1;

    /*setup device transmitting power*/
    /*this determines how strong the BLE signal will be, so affects how far away can be detected etc*/
    adv_fields.tx_pwr_lvl = BLE_HS_ADV_TX_PWR_LVL_AUTO;
    adv_fields.tx_pwr_lvl_is_present = 1;


    /* populates the advertisement packets for nimble */
    advert_set = ble_gap_adv_set_fields(&adv_fields);
    if (advert_set != 0) {
        ESP_LOGE(TAG, "failed to set advertising data, error code %d", advert_set);
        return;
    }

    /*fills in the scan response structure with the actual user friendly device name*/
    rsp_fields.name = (uint8_t *)name;
    /* provides nimble the length of the name */
    rsp_fields.name_len = strlen(name);
    /*indicates this is the full name*/
    rsp_fields.name_is_complete = 1;

    /*now actually set the scan response fields*/
    scan_set = ble_gap_adv_rsp_set_fields(&rsp_fields);
    if (scan_set != 0) {
        ESP_LOGE(TAG, "failed to set scan response data, error code: %d", scan_set);
        return;
    }

    adv_params.conn_mode = BLE_GAP_CONN_MODE_UND;
    adv_params.disc_mode = BLE_GAP_DISC_MODE_GEN;
    /* will need to change forever later, to stop advertising after a specific amount of time, need to figure that out*/
    advert_start = ble_gap_adv_start(own_addr_type, NULL, BLE_HS_FOREVER, &adv_params, gap_event_handler, NULL);

    if (advert_start != 0){
        ESP_LOGE(TAG, "failed to start advertising, error code %d", advert_start);
        return;
    }
    ESP_LOGI(TAG, "advertising started!");

}


static int gap_event_handler(struct ble_gap_event *event, void *arg)
{

    switch(event->type){

        case BLE_GAP_EVENT_CONNECT:
        if (event->connect.status == 0){
            ESP_LOGI(TAG, "phone connected");
        }
        else {
            ESP_LOGE(TAG, "connection failed, status: %d", event->connect.status);
            start_advertising();
        }
        return 0;

        case BLE_GAP_EVENT_DISCONNECT:
        ESP_LOGI(TAG, "phone disconnected");
        start_advertising();
        return 0;

        default:
        return 0;
    }
}


void adv_init(void) {

    int has_address = 0;
    int advert_address = 0;
    int copy_address = 0;
    char addr_str[18] = {0};

   
    /* makes sure a valid bluetooth address exists on the esp*/
    has_address = ble_hs_util_ensure_addr(0);
    if (has_address != 0) {
        ESP_LOGE(TAG, "device does not have any available bt address");
        return;
    }

    /* figures out what kind of address nimble should use*/
    advert_address = ble_hs_id_infer_auto(0, &own_addr_type);
    if (advert_address != 0) {
        ESP_LOGE(TAG, "failed to infer address type, error code %d", advert_address);
        return;
    }
    /* copy address from nimble stack memory into a variable so it can be used*/
    copy_address = ble_hs_id_copy_addr(own_addr_type, addr_val, NULL);
    if (copy_address != 0) {
        ESP_LOGE(TAG, "failed to copy device address, error code: %d", copy_address);
        return;
    }
    /* formats the address into a readable text*/
    format_addr(addr_str, addr_val);
    /* displays the address*/
    ESP_LOGI(TAG, "device address: %s", addr_str);

    start_advertising();

}




int gap_init(void) {

    int gap_status = 0;

    /* initialises nimbles GAP service */
    ble_svc_gap_init();

    gap_status = ble_svc_gap_device_name_set(DEVICE_NAME);
    if (gap_status != 0) {
        ESP_LOGE(TAG, "failed to set device name to %s, error code %d",
            DEVICE_NAME, gap_status);
            return gap_status;
    }

    return 0;
}