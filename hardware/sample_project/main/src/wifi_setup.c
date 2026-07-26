#include "wifi_setup.h"

#include "esp_log.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "gatt_svc.h"
#include <string.h>
#define TAG "WifiSetup"

#include "gap.h"

static void wifi_event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_date){

    if(event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED){
        ESP_LOGE(TAG, "Wi-Fi disconnected / failed to connect");
        gatt_svc_set_setup_status("wifi_failed");
    }

    if(event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP){
        ESP_LOGE(TAG, "Wi-Fi connected");
        gatt_svc_set_setup_status("wifi_connected");
        stop_advertising();
}
}


int wifi_setup_init(void)
{
    int netif_setup = 0;
    int event_setup = 0;
    int wifi_init = 0;
    int wifi_station = 0;

    /** this initialises the esp network interface layer */
    netif_setup = esp_netif_init();
    if (netif_setup != 0){
        ESP_LOGE(TAG, "Failed to initalise esp_netif: %d", netif_setup);
        return netif_setup;
    }
    /** this creates the system that allows wifi to work in events */
    event_setup = esp_event_loop_create_default();
    if (event_setup != 0){
        ESP_LOGE(TAG," Failed to create default event loop: %d", event_setup);
        return event_setup;
    }

    esp_event_handler_register(WIFI_EVENT, WIFI_EVENT_STA_DISCONNECTED, wifi_event_handler, NULL);
    esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_handler, NULL);
    /** creates the wifi network layer and uses the standard esp recommended wi-fi settings */
    esp_netif_create_default_wifi_sta();
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();

    wifi_init = esp_wifi_init(&cfg);
    if (wifi_init != 0){
        ESP_LOGE(TAG, "failed to initialise Wi-Fi: %d", wifi_init);
        return wifi_init;
    }
    /** sets the mode of wifi to use, which is client mode as the ESP needs to connect to my home wifi */
    wifi_station = esp_wifi_set_mode(WIFI_MODE_STA);
    if (wifi_station != 0){
        ESP_LOGE(TAG, "failed to set Wi-Fi station mode: %d", wifi_station);
        return wifi_station;
    }

    ESP_LOGI(TAG, "Wi-Fi setup initialised");
    return 0;
}

int wifi_setup_connect(const char *ssid, const char *password)
{
    int wifi_config_status = 0;
    int wifi_start = 0;
    int wifi_connect = 0;

    wifi_config_t wifi_config = {0};

    gatt_svc_set_setup_status("connecting_wifi");

    strcpy((char *)wifi_config.sta.ssid, ssid);
    strcpy((char *)wifi_config.sta.password, password);

    ESP_LOGI(TAG, "connecting to wifi: %s", ssid);

    wifi_config_status = esp_wifi_set_config(WIFI_IF_STA, &wifi_config);
        if (wifi_config_status != 0){
            ESP_LOGE(TAG, "wifi_config failed, error code: %d", wifi_config_status);
            return wifi_config_status;
        }
    

    wifi_start = esp_wifi_start();
        if (wifi_start != 0){
            ESP_LOGE(TAG, "wifi_start failed, error code %d", wifi_start);
            return wifi_start;
        }
    

    wifi_connect = esp_wifi_connect();
        if (wifi_connect != 0){
            ESP_LOGE(TAG, "wifi connect failed, error code: %d", wifi_connect);
            return wifi_connect;
        }
    
    
    ESP_LOGI(TAG, "Wi-Fi connection attempt started");
    return 0;
}

