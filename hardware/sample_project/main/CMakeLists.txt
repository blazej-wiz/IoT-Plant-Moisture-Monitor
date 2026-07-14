idf_component_register(SRCS "main.c" "src/gap.c" "src/button.c" "src/gatt_svc.c"
                       PRIV_REQUIRES bt nvs_flash driver
                       INCLUDE_DIRS "include")