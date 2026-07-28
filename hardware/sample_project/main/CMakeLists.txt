idf_component_register(SRCS "main.c" "src/gap.c" "src/button.c" "src/gatt_svc.c" "src/wifi_setup.c" "src/moisture.c" "src/api.c"
                       PRIV_REQUIRES bt nvs_flash driver esp_wifi esp_netif esp_event esp_adc esp_http_client
                       INCLUDE_DIRS "include")