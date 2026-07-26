/*this links the functions from gap.c to main.c so main.c recognises the functions defined in gap.h*/
#ifndef GAP_H
#define GAP_H

void adv_init(void);
int gap_init(void);
void stop_advertising(void);

#endif