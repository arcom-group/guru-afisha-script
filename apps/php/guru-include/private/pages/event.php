<?php
/**
 * Powered by Arcom Group
 * Author: rs@arcom.group
 */

// REQUESTS
$event = getApi('/sellers/performance/'. $eventId, [
  'expand' => 'nearSession',
]);

// Listing sessions
$sessionsList = [];
foreach(is_array($event->sessions) ? $event->sessions : [] as $session) {
  if (!$sessionsList[date('d.m.Y', $session->timeSpending)]) {
    $sessionsList[date('d.m.Y', $session->timeSpending)] = [];
  }

  $session->is3d = false;
  foreach ($session->tags as $tag) {
    if (strtoupper($tag->name) == '3D'){
      $session->is3d = true;
    }
  }

  $_timeZoneOffset = strtotime('01/01/2010 00:00') - strtotime('01/01/2010 00:00 '. $session->timezone);

  $session->timeSpending += $_timeZoneOffset;
  $sessionsList[date('d.m.Y', $session->timeSpending)][] = $session;
}

?>

<div class="session">
  <section class="session__left">
      <figure class="image"><span class="image__years-old"><?= $event->minAge ?>+</span><img src="<?= imageUrl($event->image ? $event->image->thumbnail->url : '') ?>"></figure>
      <section class="share"><span class="share__title">Рассказать друзьям</span>
        <ul class="share__buttons">
          <!-- <li class="share__button_fb"><a href="#">share via facebook</a></li>
          <li class="share__button_vk"><a href="#">share via vk</a></li>
          <li class="share__button_twitter"><a href="#">share via twitter</a></li> -->
          <center>
            <script type="text/javascript">(function() {
              if (window.pluso)if (typeof window.pluso.start == "function") return;
              if (window.ifpluso==undefined) { window.ifpluso = 1;
                var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
                s.type = 'text/javascript'; s.charset='UTF-8'; s.async = true;
                s.src = ('https:' == window.location.protocol ? 'https' : 'http')  + '://share.pluso.ru/pluso-like.js';
                var h=d[g]('body')[0];
                h.appendChild(s);
              }})();</script>
            <div class="pluso" data-background="transparent" data-options="small,square,line,horizontal,nocounter,theme=04" data-services="vkontakte,odnoklassniki,facebook,twitter,evernote,google,pinterest"></div>
          </center>
        </ul>
      </section>
  </section>
  <section class="session__right">
      <div class="event-title">
        <span>
          <span><?= $event->name ?></span>
          <!-- <span class="event-title__light">&nbsp;(Россия, 2018)</span> -->
        </span>
        <? if (is_array($event->objects) && !empty($event->objects) && $event->nearSession && count($event->objects) < 2) { ?>
          <a class="btn btn-primary arcom__btn" href="<?= frameUrl($event->nearSession->id); ?>">Купить билет</a>
        <? } ?>
      </div><span class="about-text">
        <!-- <span class="about-text__light">Жанр:</span>&nbsp;Ужасы, фантастика,  детектив,  триллер</span><br> -->
        <span class="about-text"><span class="about-text__light">Дата показа:</span>&nbsp;<?=  ($event->start_timestamp) ? 'c '. date('d.m.Y', $event->start_timestamp) : '' ?> <?= ($event->end_timastamp && ($event->start_timestamp != $event->end_timastamp)) ? 'по ' . date('d.m.Y', $event->end_timastamp) : '' ?></span><br>
        <span class="about-text"><span class="about-text__light">Длительность:</span>&nbsp;<?= $event->duration ?> мин.</span><br>
        <!-- <span class="about-text"><span class="about-text__light">Режиссер:</span>&nbsp;31 января - 15 февраля</span><br> -->
        <!-- <span class="about-text"><span class="about-text__light">В главных ролях:</span>&nbsp;Вигго Мортенсен, Махершала Али, Линда Карделлини</span><br> -->
        <span class="about-text"><span class="about-text__light">Возрастное ограничение:</span>&nbsp;<?= $event->minAge ?>+</span><br>
      <section class="description">
        <div class="js-shortDescription"><?= $event->shortDescription ?></div>
        <div class="js-description" style="display: none;"><?= $event->description ?></div>
        <a class="dates-show__more" href="javascript:;">Полное описание</a>
      </section>
      <? if (is_array($event->objects) && !empty($event->objects)) { ?>
        <section class="location m-top-25">
          <h4 class="location__header">Места проведения</h4>
          <div class="location__body js-objects">
              <? foreach($event->objects as $key=>$object) { ?>
                <button class="btn btn-outline-primary <?= !$key ? 'active' : ''; ?>" data-id="<?= $object->object_id ?>" type="button"><?= $object->name ?></button>
              <? } ?>
          </div>
        </section>
        <section class="dates-show m-top-25 m-bot-25 ">
          <h4 class="dates-show__header">Даты показа</h4>
          <div>
            <div id="js-dates" class="js-dates dates-show__body">
              <? foreach ($sessionsList as $date=>$sessions) {?>
                <div class="dates-show__item"><span class="dates-show__date"><?= $date ?></span>
                  <ul class="dates-show__sessions">
                    <!-- <li><a href="#">12:50</a></li> -->
                    <!-- <li class="inactive"><a href="#">16:35</a></li> -->
                    <? foreach($sessions as $session) { ?>
                      <? if (!$session->isSaleOpen) { ?>
                        <li class="<?= $session->is3d ? 'in3d' : '' ?> inactive"><a href="javascript:;"><?= date('H:i', $session->timeSpending); ?></a></li>
                      <? } else {?>
                        <li class="<?= $session->is3d ? 'in3d' : '' ?> "><a class="arcom__btn" href="<?= frameUrl($session->id) ?>"><?= date('H:i', $session->timeSpending); ?></a></li>
                      <? } ?>
                    <? } ?>
                  </ul>
                </div>
              <? } ?>
            </div>
            <a class="js-load-sessions dates-show__more" style="<?= count($event->sessions) < 30 ? 'display:none' : ''; ?>" href="#">Показать еще</a>
          </div>
          <div id="js-dates-template" style="display: none;">
              <div class="js-date-block dates-show__item">
                <span class="dates-show__date">DATE</span>
                <ul class="dates-show__sessions"></ul>
              </div>
              <li class="js-time-block inactive"><a href="javascript:;">TIME</a></li>
          </div>
        </section>
      <? } ?>
  </section>
</div>