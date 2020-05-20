<?php
/**
 * Powered by Arcom Group
 * Author: rs@arcom.group
 */

 /**
  * Generate url
  *
  * @param [type] $uri
  * @return string
  */
function url($uri) {
    $config = require('config.php');
    return $config['server'] . $uri;
}

 /**
  * Generate url
  *
  * @param [type] $uri
  * @return string
  */
function afishaUrl($uri) {
    $config = require('config.php');
    return $config['afishaUrl'] . $uri;
}

 /**
  * Generate url
  *
  * @param [type] $uri
  * @return string
  */
function videoUrl($uri) {
    $config = require('config.php');
    return afishaUrl('/'. $config['language'] .'/minsk/videos/' . $uri);
}

/**
 * Build 24guru image url
 *
 * @param [type] $uri
 * @return string
 */
function imageUrl($uri) {
    if ($uri) {
        return url($uri);
    }
    return '';
}

/**
 * Build 24guru api url
 *
 * @param [type] $uri
 * @return string
 */
function apiUrl($uri, $params = []) {
    $config = require('config.php');
    $params['lang'] = $config['lang'];
    $params['distributorCompanyId'] = $config['distibutionId'];
    return $config['server'] . $config['prefix'] . $uri . '?' . http_build_query($params);
}

/**
 * Build 24guru frame url
 *
 * @param [type] $uri
 * @return string
 */
function frameUrl($id) {
    $config = require('config.php');
    return str_replace('webgate', 'saleframe', $config['server']) . '?' . http_build_query([
        'sid' => $id,
        'lang' => $config['lang'],
        'distributor_company_id' => $config['distibutionId'],
    ]);
}

/**
 * Get data from api
 *
 * @param [type] $uri
 * @return object
 */
function getApi($uri, $params = []) {
    $data = [];
    $request = @file_get_contents(apiUrl($uri, $params));

    if (!empty($request)) {
        $data = json_decode($request, false);
    }

    return $data;
}

/**
 * Test function
 *
 * @param [type] $f
 * @return void
 */
function dd($f)
{
    echo '<pre>';
    print_r($f);
    die();
}

/**
 * Test function
 *
 * @param [type] $f
 * @return void
 */
function dump($f)
{
    echo '<pre>';
    print_r($f);
    die();
}

/**
 * Store function
 *
 * @param [type] $key
 * @return string
 */
function getStore($key)
{
    $store = array_map(function ($value) {
        return htmlspecialchars($value);
    }, $_COOKIE);

    return $store[$key] ?? null;
}