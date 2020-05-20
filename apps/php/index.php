<?php
/**
 * Powered by Arcom Group
 * Author: rs@arcom.group
 */

$PRIVATE_DIR = './guru-include/private';

/**
 * Include settings
 */
require_once($PRIVATE_DIR.'/libs/functions.php');

/**
 * Global variables
 */
$config = require('config.php');
$eventId = (int)$_GET['event'];
$searchStr = $_GET['str'];
$page = (int)$_GET['page'] ? : 1;
$view = $_GET['view'] ? : '';

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,shrink-to-fit=no">
    <meta name="format-detection" content="telephone=no">
    <!-- favicon-->
    <meta name="keywords" content="">
    <meta name="description" content="">
    <title>Афиша Guru - билеты на мероприятия твоего города</title>
    <meta name="format-detection" content="telephone=no">
    <!-- Android - Chrome-->
    <meta name="theme-color" content="#fff">
    <!-- Add to home screen for Safari on iOS-->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Title">
    <meta name="msapplication-TileColor" content="#fff">
    <meta name="msapplication-TileImage" content="img">
    <meta name="msapplication-starturl" content="/">
    <!--[if IE]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
    <link rel="stylesheet" href="guru-include/public/css/style.css?v=1">
    <script>
        let $config = <?= json_encode([
          'afishaUrl' => $config['afishaUrl'], 
          'server' => $config['server'], 
          'prefix' => $config['prefix'], 
          'distibutionId' => $config['distibutionId'], 
          'language' => $config['language'], 
          'perPage' => $config['perPage'],
          ]); ?>;
        let $eventId = <?= $eventId; ?>;
        let $view = "<?= $view; ?>";
    </script>
  </head>
  <body>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="h1 header-text">
              <img src="guru-include/public/img/ticket.svg" style="opacity: 0.5;">
              <a class="<?= !$view ? 'active' : '' ?>" href="/" style="font-size: 1.7rem;">
                Афиша мероприятий и билеты
              </a>
              <a class="<?= $view == 'video' ? 'active' : '' ?>" href="/?view=video" style="font-size: 1.7rem;">
                Онлайн ТВ
              </a>
          </div>
        </div>
      </div>

      <?php 
        if (!$view) {
          if ($eventId) {
              /**
               * Include event page
               */
              include_once($PRIVATE_DIR.'/pages/event.php');
          } else {
              /**
               * Include home page
               */
              include_once($PRIVATE_DIR.'/pages/index.php');
          }
        } elseif($view == 'video') {
          include_once($PRIVATE_DIR.'/pages/videos.php');
        }
      ?>

    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
    <script src="guru-include/public/js/scripts.js?version=1"></script>
    <script src="guru-include/public/js/app.js?version=1"></script>
    <link rel="stylesheet" href="//sc1-cdn.24ats.com/afp.min.css">
    <!-- <script src="//sc1-cdn.24ats.com/afp.min.js"></script> -->
  </body>
</html>