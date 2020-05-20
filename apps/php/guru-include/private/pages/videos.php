<?php
/**
 * Powered by Arcom Group
 * Author: rs@arcom.group
 */

// REQUESTS
$videos = getApi('/sellers/video', [
  'per-page' => $config['perPage'],
  'page' => $page,
  'performanceId' => $config['video_performance_id'],
  'objectId' => $config['video_object_id'],
  'premium' => $config['video_premium'],
]);

$pagination = isset($videos->pagination) ? $videos->pagination : [];
$size = '240x340';
?>

<div class="row" style="flex-wrap: nowrap;">
  
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-12 js-no-result <?= !$videos || !$videos->data || empty($videos->data) ? '' : 'd-none'; ?>">
            <center>
              <h1 style="margin-top: 11rem;">По заданным параметрам видео не найдено</h1>
              <h4>Пожалуйста, измените параметры поиска</h4>
            </center>
          </div>
          <div class="col-12 events-block">
              <?php foreach($videos->data as $video) { ?>
                <div class="event-poster">
                    <a href="<?= videoUrl($video->id) ?>" target="_blank"><div class="cover"><img src="<?= ($video->performance && $video->performance->image ? $video->performance->image->$size : '') ?>" alt=""></div></a>
                  <div class="header"><?= $video->title ?></div>
                  <? if ($video->price) { ?>
                    <p class="price">от <?= $video->price/100 ?> р.</p>
                  <? } else { ?>
                    <p class="price">бесплатно</p>
                  <? } ?>
                  <a class="btn btn-outline-primary" href="<?= videoUrl($video->id) ?>" target="_blank">Смотреть онлайн</a>
                </div>
              <? } ?>
          </div>
          <? if(!empty($pagination) && $pagination->pageCount > 1 && $pagination->currentPage < $pagination->pageCount) { ?>
            <div class="col-12 text-center">
              <a class="btn btn-outline-primary js-load-next-page" data-current="<?= $pagination->currentPage ?>" href="?view=video&page=<?= $pagination->currentPage+1 ?>">Еще...</a>
            </div>
          <? } ?>
          <div id="js-event-poster-template" style="display: none;">
            <div class="event-poster">
              <a href="?event=">
                <div class="cover">
                  <img src="IMG" alt="">
                </div>
              </a>
              <div class="header">NAME</div>
              <p class="price">от <span>0</span> р.</p>
              <a class="btn btn-outline-primary" href="?event=" target="_blank">Смотреть онлайн</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
