<?php
/**
 * Файл конфигурации скрипта
 */

return [
    /**
     * Конфигурация сервера
     */
    'server' => 'https://webgate.24guru.by',
    'prefix' => '/api/v2',
    'afishaUrl' => 'https://24afisha.by',

    /**
     * Конфигурация фильтра для мероприятий
     */
    'login' => '', // CHANGET IT!!!
    'distibutionId' => 0, // CHANGET IT!!!
    'objectIds' => 0, // change it is if load only events by one object
    'organizatorIds' => 0, // change it if load only events by one organizator
    
    /**
     * Дополнительные параметры
     */
    'perPage' => 24,
    'language' => 'ru',
    'loadAonlyActive' => false,

    /**
     * Конфигурация фильтров видеоконтента
     */
    'video_performance_id' => 0,
    'video_object_id' => 0,
    'video_premium' => 0,
];