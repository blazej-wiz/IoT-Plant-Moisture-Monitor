
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>
#include <driver/gpio.h>
#include <esp_timer.h>

#include "gap.h"


/* defines which pin i am using on the esp and the debounce delay to 200ms*/
/*debounce delay is needed because buttons can be noisy, so it makes sure that if multiple presses occur in a short period, basically ignore them*/
#define BUTTON_GPIO GPIO_NUM_20
#define DEBOUNCE_DELAY_US 200000ULL

/* sets up the variable that is volatile, so it changes to hold the last time a button was pressed*/
static volatile uint64_t last_isr_time = 0;
/* defines button_queue as a reference to the FreeRTOS queue so the queue that the OS has in the esp */
static QueueHandle_t button_queue;


/* this creates the actual function that should run on button press and forces it to be executed in RAM for faster execution*/
static void IRAM_ATTR button_isr(void *arg)
{
    /* this gets the current time */
    uint64_t now = esp_timer_get_time();
    /* so if the time the button is presseed now is greater than the debounce, so basically the button press is actually valid then carry on*/
    if (now - last_isr_time > DEBOUNCE_DELAY_US) {
        /* remembers the last valid button press */
        last_isr_time = now;

        /* creates the button press event and puts that message into the button_queue 
        as the button task will be waiting for this event to be added to the queue to wake up and perform the task */
        int event = 1;
        xQueueSendFromISR(button_queue, &event, NULL);

    }
}


static void button_task(void *param)
{
    int event = 0;
    /* this loop will be asleep and wait for the ISR to signal that the button was pressed waking it up and running the code*/
    while(1) {

        if (xQueueReceive(button_queue, &event, portMAX_DELAY)){
            /* then it will wait for 3 seconds*/
            vTaskDelay(pdMS_TO_TICKS(3000));
            /* read the pin again, if the pin is still low (so button is still pressed)*/
            if (gpio_get_level(BUTTON_GPIO) == 0)
            {
                /* then only start bluetooth advertising if it has been pressed for 3 seconds*/
                adv_init();
            }
        }
    }
}

int button_init(void)

{
    /* so this actually initialises and creates a queue in the FreeRTOS and it can hold up to 10 messages*/
    button_queue = xQueueCreate(10, sizeof(int));
    /* checks if queue was created succesfully */
    if (button_queue == NULL){
        return -1;
    }

/* creates a task that the FreeRTOS runs in the background, so in the background its constantly checking if the button is being pressed*/
xTaskCreate(button_task, "Button Task", 2048, NULL, 5, NULL);


 
    
    gpio_config_t io_conf = {
        /*Tells esp which pin i am configuring*/
        .pin_bit_mask = 1ULL << BUTTON_GPIO,
        /* sets the mode of the pin, so the esp will read data from this pin*/
        .mode = GPIO_MODE_INPUT,
        /* this means the pin is normally at a high, as when button is not pressed it is high, when it is pressed it will be a low*/
        .pull_up_en = GPIO_PULLUP_ENABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        /* thats why here it detects the change from high to low, so it detects the button press*/
        .intr_type = GPIO_INTR_NEGEDGE
    };
    /* this saves the pin config to the specific pin*/
    gpio_config(&io_conf);

    /*this sets up the GPIO pin so that it will trigger when the interrupt occurs*/
    gpio_install_isr_service(0);

    /* so this then actually links the function, button_isr to run when the button is pressed by linking the GPIO pin 20 with its configurations to the function,
     and its configured to detect a button press which triggers change in voltage from high to low*/
    gpio_isr_handler_add(BUTTON_GPIO, button_isr, NULL);
    return 0;
}

