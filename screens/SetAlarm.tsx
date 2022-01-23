import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import notifee, { RepeatFrequency, TimestampTrigger, TriggerType, IntervalTrigger, TimeUnit, AndroidImportance, EventType, AndroidColor } from '@notifee/react-native';

const SetAlarm = () => {

    useEffect(() => {
        return notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.APP_BLOCKED:
                    console.log('User toggled app blocked', detail.blocked);
                    break;

                case EventType.CHANNEL_BLOCKED:
                    console.log('User toggled channel block', detail.channel?.id, detail.blocked);
                    break;

                case EventType.CHANNEL_GROUP_BLOCKED:
                    console.log('User toggled channel group block', detail.channelGroup?.id, detail.blocked);
                    break;

                case EventType.DISMISSED:
                    console.log('User dismissed notification', detail.notification);
                    break;

                // My Requirement
                case EventType.PRESS:
                    // console.log('User pressed notification', detail.notification?.data?.id);
                    ToastAndroid.showWithGravity("Notification Number: " + detail.notification?.data?.id, ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    break;
            }
        });
    }, []);

    const onCreateTriggerNotification = async () => {

        console.log('onCreateTriggerNotification');
        ToastAndroid.showWithGravity("Total 5 alarms set", ToastAndroid.LONG, ToastAndroid.BOTTOM);

        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            sound: 'ringtone',
            vibration: true,
            vibrationPattern: [500, 200],
            importance: AndroidImportance.HIGH,
            lights: true,
            lightColor: AndroidColor.RED,
        });

        const date = new Date(Date.now());

        date.setHours(16);
        date.setMinutes(59);

        // Create a time-based trigger
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            // timestamp: date.getTime(),
            timestamp: Date.now() + 1000 * 60 * 1, // fire in 1 min
            repeatFrequency: RepeatFrequency.DAILY,
            // If you want to allow the notification to display when in low-power idle modes, set allowWhileIdle
            alarmManager: {
                allowWhileIdle: true,
            }
        };

        // IntervalTrigger
        const trigger1: IntervalTrigger = {
            type: TriggerType.INTERVAL,
            interval: 15,
            timeUnit: TimeUnit.MINUTES
        };

        [1].forEach(async element => {

            const trigger1: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                // timestamp: date.getTime(),
                timestamp: Date.now() + 1000 * 60 * (element * 1), // fire in 1 min
                repeatFrequency: RepeatFrequency.DAILY,
                // If you want to allow the notification to display when in low-power idle modes, set allowWhileIdle
                alarmManager: {
                    allowWhileIdle: true,
                }
            };

            await notifee.createTriggerNotification(
                {
                    id: element.toString(),
                    title: 'Medication Reminder',
                    body: 'It\'s time to take your medicines',
                    data: {
                        id: element.toString()
                    },
                    android: {
                        channelId: channelId,
                        autoCancel: false,
                        showTimestamp: true,
                        //
                        actions: [
                            {
                                title: 'Open',
                                icon: 'https://my-cdn.com/icons/open-chat.png',
                                pressAction: {
                                    id: 'open-chat',
                                    launchActivity: 'default',
                                },
                            },
                        ],
                    },
                },
                trigger1
            );
        });
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Button title="Display Notification" onPress={() => onCreateTriggerNotification()} />
            {/* <View style={{ height: 32 }} />
            <Button title="Cancel Notification" onPress={() => notifee.cancelTriggerNotification('2')} /> */}
        </View>
    )
}

export default SetAlarm;

const styles = StyleSheet.create({});
