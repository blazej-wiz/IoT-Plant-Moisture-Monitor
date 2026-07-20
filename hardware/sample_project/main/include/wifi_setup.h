#ifndef WIFI_SETUP_H
#define WIFI_SETUP_H

int wifi_setup_init(void);
int wifi_setup_connect(const char *ssid, const char *password);

#endif