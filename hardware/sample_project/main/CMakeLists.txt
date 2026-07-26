idf_component_register(SRCS "main.c" "src/gap.c" "src/button.c" "src/gatt_svc.c" "src/wifi_setup.c" "src/moisture.c"
                       PRIV_REQUIRES bt nvs_flash driver esp_wifi esp_netif esp_event esp_adc
                       INCLUDE_DIRS "include")