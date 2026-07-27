#include "esp_log.h"
#include "esp_err.h"
#include "esp_adc/adc_oneshot.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"



#define MOISTURE_ADC_GPIO 4
#define TAG "moisture_sensor"

#define MOISTURE_DRY_RAW 2400
#define MOISTURE_WET_RAW 1100

#define NUM_READINGS 10

/* this defines the adc handle, so just defines to a variable the analog (so voltage number) to a digital number that i can read
as analog is just a voltage like 1.4 but digital gives me a number like 2000 for example
so the handle allows us to control the adc unit later on*/
static adc_oneshot_unit_handle_t adc_handle;
static adc_channel_t moisture_channel;



int moisture_read_raw_value(void){
    int raw_value = 0;
    
    adc_oneshot_read(adc_handle, moisture_channel, &raw_value);

    ESP_LOGI(TAG, "Raw moisture vale: %d", raw_value);
    return raw_value;
    
}


int moisture_read_average_raw(void){

    int total = 0;

    for (int i = 0; i < NUM_READINGS; i++){
        int reading = moisture_read_raw_value();
        total += reading;
        vTaskDelay(pdMS_TO_TICKS(50));

        ESP_LOGI(TAG, "reading %d: %d", i+1, reading);
    }

    int average = total / NUM_READINGS;

    return average;
}


int moisture_read_percent(void){

    int average_raw = moisture_read_average_raw();

    int percent = ((MOISTURE_DRY_RAW - average_raw) * 100) / (MOISTURE_DRY_RAW - MOISTURE_WET_RAW);

    if (percent < 0){
        percent = 0;
    }

    if (percent > 100){
        percent = 100;
    }

    return percent;
}





static void moisture_read_test_wifi(void *param){

    while (1){
        int percent = moisture_read_percent();

        ESP_LOGI(TAG, "Current moisture: %d%%", percent);

        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}


void start_wifi_test_task(void){

    xTaskCreate(
        moisture_read_test_wifi,
        "moisture_test",
        2048,
        NULL,
        5,
        NULL
    );


}

static void moisture_read_test(void *param){

    while (1){
        moisture_read_raw_value();
        vTaskDelay(pdMS_TO_TICKS(2000));
    }
}








/* can optionally call this in main.c when i want continuous sensor readings for testing.*/
void start_test_task(void){
    /* creates a task allowing other tasks to also run on the ESP instead of being stuck
    at this while loop forever*/
    xTaskCreate(
        moisture_read_test,
        "moisture_test",
        2048,
        NULL,
        5,
        NULL
    );
}


int moisture_sensor_init(void){


    adc_unit_t unit_id;
    /* this configures the channel that the ADC uses will be connected to GPIO4 which is the
    GPIO that the moisture sensor is connected too.*/
    ESP_ERROR_CHECK(adc_oneshot_io_to_channel(
        MOISTURE_ADC_GPIO,
        &unit_id,
        &moisture_channel
    ));

    /* this just initiliases the configuration of the adc, so which adc unit i want to use and if i want to use
    extra low power mode for the readings*/
    /* so just initiliase the adc hardware inside the esp so that its ready to read voltages from certain
    GPIO pins*/
    adc_oneshot_unit_init_cfg_t init_config1 = {
        .unit_id = unit_id,
        .ulp_mode = ADC_ULP_MODE_DISABLE,
    };
    /* creates the unit and checks for errors */
    ESP_ERROR_CHECK(adc_oneshot_new_unit(&init_config1, &adc_handle));

    /* this configures the actual pin that i want the adc unit to measure
    so the specific pin that my sensor is actually connected to*/
    adc_oneshot_chan_cfg_t channel_config = {
        /* bitwidth defines how accurately voltage differences are selected, since my project does not require
        super small changes to be seen, default is fine */
        .bitwidth = ADC_BITWIDTH_DEFAULT,
        /* this defines the actual range of voltage the adc can detect, i use 3.3v max, so db_12 fits that range*/
        .atten = ADC_ATTEN_DB_12,
    };

    ESP_ERROR_CHECK(adc_oneshot_config_channel(adc_handle, moisture_channel, &channel_config));

    ESP_LOGI(TAG, "Moisure ADC initiliased on GPIO4");

    return 0;
}

