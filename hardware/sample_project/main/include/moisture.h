#ifndef MOISTURE_SENSOR_H
#define MOISTURE_SENSOR_H

int moisture_sensor_init(void);
void start_test_task(void);
int moisture_read_raw_value(void);
void start_wifi_test_task(void);

#endif

