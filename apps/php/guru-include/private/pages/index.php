<?php
/**
 * Powered by Arcom Group
 * Author: rs@arcom.group
 */

// REQUESTS
$events = getApi('/sellers/performance/distibution', [
  'cityId' => getStore('guru_selected_city_id'),
  'typeIds' => getStore('guru_selected_types'),
  'str' => $searchStr,
  'per-page' => $config['perPage'],
]);
$cities = getApi('/cities');
$types = getApi('/performance/types');

// STORE
$selectedTypesStore = explode(',', getStore('guru_selected_types'));
$selectedTypes = explode(',', getStore('guru_selected_types'));

?>

<div class="row" style="flex-wrap: nowrap;">
  <div class="col-3" style="max-width: 25em;">
    <div class="row">
      <div class="container">
        <div class="row flex-fill">
          <div class="col flex-fill">
            <div class="collapse flex-fill" id="navbarToggleExternalContent">
              <div class="bg-white p-4 flex-fill mb-5">
                <h5 class="text-black h4 flex-fill">Collapsed content</h5><span class="text-muted flex-fill">Toggleable via the navbar brand.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="calendar d-flex flex-wrap flex-column flex-fill" id="js-rap-calendar"></div>
            <ul class="filter js-types">
              <li class="custom-control custom-checkbox js-all-checkbox">
                  <input class="custom-control-input" id="customCheck0" type="checkbox" <?= in_array(0, $selectedTypes) || empty($selectedTypes) ? 'checked' : '' ?> data-id="0">
                  <label class="custom-control-label" for="customCheck0">Все</label>
              </li>
              <? foreach($types->data as $type) { ?>
                <li class="custom-control custom-checkbox">
                  <input class="custom-control-input" id="customCheck<?= $type->id ?>" type="checkbox"  data-id="<?= $type->id ?>" <?= in_array($type->id, $selectedTypes) ? 'checked' : '' ?>>
                  <label class="custom-control-label" for="customCheck<?= $type->id ?>"><?= $type->name ?></label>
                </li>
              <? } ?>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <nav class="navbar navbar-light navbar-guru">
          <div class="row flex-fill">
            <div class="col-9">
              <form action method="GET">
                <div class="input-group">
                  <input class="form-control" type="text" aria-describedby="button-addon" name="str" placeholder="Поиск по мероприятию" aria-label="Поиск по мероприятию" value="<?= $searchStr; ?>">
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary" id="button-addon" type="submit">Искать</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="col-3">
              <div class="row">
                <div class="col-12 d-flex">
                  <div class="btn-group flex-fill js-cities">
                    <button class="btn btn-outline-transparent dropdown-toggle guru flex-fill" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Все города</button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="javascript:;" data-id="0">Все</a>
                        <? foreach($cities->data as $city ){ ?>
                          <a class="dropdown-item" href="javascript:;" data-id="<?= $city->id ?>"><?= $city->name ?></a>
                        <? } ?>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-12 js-no-result <?= !$events || !$events->data || empty($events->data) ? '' : 'd-none'; ?>">
            <center>
              <h1 style="margin-top: 11rem;">По заданным параметрам мероприятий не найдено</h1>
              <h4>Пожалуйста, измените параметры поиска</h4>
            </center>
          </div>
          <div class="col-12 events-block">
              <?php foreach($events->data as $event) { ?>
                <div class="event-poster">
                    <a href="?event=<?= $event->id ?>"><div class="cover"><img src="<?= imageUrl($event->image ? $event->image->thumbnail->url : '') ?>" alt=""></div></a>
                  <div class="header"><?= $event->name ?></div>
                  <? if ($event->minPrice) { ?>
                    <p class="price">от <?= $event->minPrice/100 ?> р.</p>
                  <? } ?>
                  <a class="btn btn-outline-primary" href="?event=<?= $event->id ?>">Купить билет</a>
                </div>
              <? } ?>
          </div>
          <div id="js-event-poster-template" style="display: none;">
            <div class="event-poster">
              <a href="?event=">
                <div class="cover">
                  <img src="IMG" alt="">
                </div>
              </a>
              <div class="header">NAME</div>
              <p class="price">от <span>0</span> р.</p>
              <a class="btn btn-outline-primary" href="?event=">Купить билет</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
