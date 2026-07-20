#include "esp_log.h"
#include "nvs_flash.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "nimble/nimble_port.h"
#include "nimble/nimble_port_freertos.h"
#include "host/ble_hs.h"

#include "gap.h"
#include "button.h"
#include "gatt_svc.h"
#include "wifi_setup.h"

#define TAG "PlantSensor"





static void on_stack_reset(int reason) {
    /* if nimble stack fails / resets then raise the warning */
    ESP_LOGI(TAG, "nimble stack reset, reset reason %d", reason);
}

static void on_stack_sync(void) {
    int button_status = 0;

    /* signals that the nimble stack for BLE is fully ready */
    /* so this starts the BLE engine, but the button will actually start the advertising*/
    ESP_LOGI(TAG, "NimBLE stack ready");
    button_status = button_init();
    if (button_status != 0)
    {
        ESP_LOGE(TAG, "failed to initialise gpio button config, error code %d", button_status);
        return;
    }
}


static void nimble_host_config_init(void) {
    /* configures where the host should go if an event happens*/
    ble_hs_cfg.reset_cb = on_stack_reset;
    ble_hs_cfg.sync_cb = on_stack_sync;
}


/* begins the nimble BLE background service*/
static void nimble_host_task(void *param) {
    ESP_LOGI(TAG, "nimble host has been started");
    nimble_port_run();
    /* deletes the currently running task on FreeRTOS*/
    vTaskDelete(NULL);
}


void app_main(void)
{
    /* aims to setup the ESP and services required for BLE and raises errors if one occurs*/
    esp_err_t boot_storage = ESP_OK;
    esp_err_t nimble_status = ESP_OK;
    int gap_status = 0;
    int gatt_status = 0;
    int wifi_status = 0;



    boot_storage = nvs_flash_init();
    if (boot_storage == ESP_ERR_NVS_NO_FREE_PAGES ||
    boot_storage == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        boot_storage = nvs_flash_init();
    }
    if (boot_storage != ESP_OK) {
        ESP_LOGE(TAG, "failed to initialise nvs flash, error code: %d ", boot_storage);
        return;
    }

    wifi_status = wifi_setup_init();
    if (wifi_status != 0){
        ESP_LOGE(TAG, "failed to initialise wifi, error code %d", wifi_status);
        return;
    }

    nimble_status = nimble_port_init();
    if (nimble_status != ESP_OK) {
        ESP_LOGE(TAG, "failed to initialise nimbe stack, error code %d", nimble_status);
        return;
    }
    /* gap_init is not currently a function, that will need to be created to initialise gap server in different file later*/
    gap_status = gap_init();
    if (gap_status != 0) {
        ESP_LOGE(TAG, "failed to initialise GAP server, error code %d", gap_status);
        return;
    }

    gatt_status = gatt_svc_init();
    if (gatt_status != 0) {
        ESP_LOGE(TAG, "failed to initialise GATT service, error code %d", gatt_status);
        return;
    }



    /* initialises the callbacks for nimble to use, so when a certain event is triggered, nimble will refer to a specific function and execute it*/
    nimble_host_config_init();

    /* starts the BLE Nimble loop and keeps it running in the background on the FreeRTOS OS on the ESP32*/
    xTaskCreate(nimble_host_task, "NimBLE Host", 4 * 1024, NULL, 5, NULL );
    return;

}

