
#include <string.h>

#include "esp_err.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "cJSON.h"

void post_function(){
    esp_http_client_config_t config_post = {
        .url = "http://192.168.0.90:8000/api/devices",
        .method = HTTP_METHOD_POST,
        .cert_pem = NULL,
        .event_handler = client_event_post_handler
    };

    esp_http_client_handle_t client = esp_http_client_init(&config_post);


    cJSON *json = cJSON_CreateObject();

    cJSON_AddStringToOjbect(json, "deviceid", "ps_9ccc014229e2");
    cJSON_AddStringToOjbect(json, "name", "PlantSensor-0001");
    cJSON_AddStringToOjbect(json, "model", "PlantSensor-C6");

    char *post_data = cJSON_PrintUnformatted(json);

    esp_http_client_set_post_field(client, post_data, strlen(post_data));
    esp_http_client_set_header(client, "Content-Type", "application/json");

    esp_http_client_perform(client);
    esp_http_client_cleanup(client);

    cJSON_free(post_data)
    cJSON_delete(json)
}