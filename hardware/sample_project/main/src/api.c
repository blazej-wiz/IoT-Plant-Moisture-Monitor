
#include <string.h>

#include "esp_err.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "cJSON.h"

void post_function_esp_data(){
    esp_http_client_config_t config_post = {
        .url = "http://192.168.0.90:8000/api/devices",
        .method = HTTP_METHOD_POST,
        .cert_pem = NULL,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config_post);


    cJSON *json = cJSON_CreateObject();

    cJSON_AddStringToObject(json, "deviceid", "ps_9ccc014229e2");
    cJSON_AddStringToObject(json, "name", "PlantSensor-0001");
    cJSON_AddStringToObject(json, "model", "PlantSensor-C6");

    char *post_data = cJSON_PrintUnformatted(json);

    esp_http_client_set_post_field(client, post_data, strlen(post_data));
    esp_http_client_set_header(client, "Content-Type", "application/json");

    esp_http_client_perform(client);
    esp_http_client_cleanup(client);

    cJSON_free(post_data);
    cJSON_Delete(json);
}



void post_function_moisture_readings(int percentage, int raw_average){
    esp_http_client_config_t config_post = {
        .url = "http://192.168.0.90:8000/api/readings",
        .method = HTTP_METHOD_POST,
        .cert_pem = NULL,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config_post);


    cJSON *json = cJSON_CreateObject();

    cJSON_AddStringToObject(json, "deviceid", "ps_9ccc014229e2");
    cJSON_AddNumberToObject(json, "percentage", percentage);
    cJSON_AddNumberToObject(json, "raw_average", raw_average);

    char *post_data = cJSON_PrintUnformatted(json);

    esp_http_client_set_post_field(client, post_data, strlen(post_data));
    esp_http_client_set_header(client, "Content-Type", "application/json");

    esp_http_client_perform(client);
    esp_http_client_cleanup(client);

    cJSON_free(post_data);
    cJSON_Delete(json);
}