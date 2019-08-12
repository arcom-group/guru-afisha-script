/**
 * Инициализируем переменные
 */
let currentPage = 1;
let lastPage = 1;
let currentObjectId = 0;
let currentDate = 0;

$(document).ready(function(){

    ////////////////////////
    //  Главная страница  //
    ////////////////////////

    // Инициализация
    loadCity();
    reinitAtsJs();

    // Инициализация и работа с календарем
    $('#js-rap-calendar').jsRapCalendar({
        week:6,
        selectdate:false,
        onClick:function(y,m,d){
            let date = new Date();
            date.setDate(d);
            date.setMonth(m);
            date.setFullYear(y);
            // Устанавливаем время в 0, чтобы выбирать все сеансы с начала дня
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);

            currentDate = parseInt(date.getTime()/1000);
            currentPage = 1;
            loadData();
        }
    });

    // Событие смены города
    $(".js-cities .dropdown-item").on("click", function(event){
        setCookie('guru_selected_city_id', $(this).data('id'));
        setCookie('guru_selected_city_name', $(this).text());
        // Устанавливаем текст выбранного города
        loadCity();
        // Перезагружаем данные
        currentPage = 1;
        loadData();
    });

    // Обработка типов мероприятий
    $('.js-types input').change(function() {
        let types = [];
        // По умолчанию считаем что кнопка все невыбрана
        let isAllSelect = false;

        // Если невыбрано ничего, ставим выбранной кнопку все
        if (!$(this).data('id')) {
            isAllSelect = true;
        }

        // Ищем все выбранные кнопки
        $('.js-types input:checked').each(function() {
            types.push($(this).data('id'));
        });

        // Если кнопка все активна, или невыбрана ниодна кнопка (это по умолчанию), то делаем активной кнопку все
        if (isAllSelect || !types.length) {
            $('.js-types input').prop("checked", false);
            $('.js-types .js-all-checkbox input').prop("checked", true);
        } else {
            $('.js-types .js-all-checkbox input').prop("checked", false);
        }

        // После всех манипуляций, нам необходимо еще раз проверить состояние кнопок и сохранить их в куках
        types = [];
        $('.js-types input:checked').each(function() {
            types.push($(this).data('id'));
        });

        setCookie('guru_selected_types', types.join(','));
        currentPage = 1;
        loadData();
    });

    ////////////////////////////
    //  Страница мероприятия  //
    ////////////////////////////

    // Обьекты
    $(".js-objects .btn").on("click", function(event){
        // Запоминаем id обьекта, он нам понадобится при загрузке сеансов в методе loadSessions
        currentObjectId = $(this).data('id');
        // Делаем все кнопки неактивные
        $(".js-objects .btn").removeClass('active');
        // Делаем активной кнопку с выбранным обьектом
        $(this).addClass('active');

        // Загружаем сеансы по обьекту
        loadObjectSessions();
    });

    // Обработка кнопки показать подробное описание
    $(".dates-show__more").on("click", function(event){
        $(this).hide();
        $('.js-shortDescription').hide();
        $('.js-description').show();
    });

    // Обработка кнопки показать еще в сеансах
    $(".js-load-sessions").on("click", function(event){
        // По логике работы, сначала увеличим счетчик страницы
        currentPage += 1;
        loadSessions();
    });

    /**
     * Метод загрузки данных при смене страницы
     */
    $('.js-load-next-page').on('click', function(e) {
        e.preventDefault();

        currentPage += 1;
        loadData(true);
    });
});

/**
 * Метод загрузки данных при событии
 */
function loadData(isSave) {
    $.ajax({
        url: $config.server + $config.prefix + "/sellers/performance/distibution",
        data: {
            lang: $config.language,
            cityId: getCookie('guru_selected_city_id'),
            typeIds: getCookie('guru_selected_types'),
            date: currentDate,
            page: currentPage,
            'per-page': $config.perPage
        },
        success: function(data) {
            // Чистим блок с карточками мероприятий
            if (!isSave) {
                $('.events-block').html('');
            }

            if (data && data.data && data.data.length) {
                $('.js-no-result').addClass('d-none');

                if (data.pagination) {
                    lastPage = data.pagination.pageCount;

                    if (lastPage > currentPage) {
                        $('.js-load-next-page').show();
                    } else {
                        $('.js-load-next-page').hide();
                    }
                }

                data.data.forEach(function (event) {
                    let el = $('#js-event-poster-template .event-poster').clone();

                    el.find('.header').text(event.name);
                    el.find('img').attr('src', $config.server + event.image.thumbnail.url);
                    el.find('[href]').attr('href', '?event=' + event.id);

                    if (event.minPrice) {
                        // Цены с сервера всегда приходят целым числом
                        el.find('.price span').text(event.minPrice/100);
                    } else {
                        el.find('.price').remove();
                    }

                    $('.events-block').append($(el));
                });
            } else {
                // В противном случае показываем сообщение с тем что данных нет
                $('.js-no-result').removeClass('d-none');
            }
        },
    });
}

/**
 * Метод загрузки сенсов для обьекта, используется, когда пользователь нажимает на кнопку обьекта на странице сеанса
 */
function loadObjectSessions() {
    // Чистим блок с датами
    $('.js-dates').html('');
    // Устанавливаем текущую страницу 1
    currentPage = 1;
    // Выполняем функцию загрузки сеансов, дальше она отработает сама
    loadSessions();
}

/**
 * Метод загрузки сенсов по страницам, используется при нажатии на кнопку обьекта, или при нажатии загрузить еще, на сранице обьекта
 */
function loadSessions() {
    $.ajax({
        url: $config.server + $config.prefix + '/sellers/performance/'+ $eventId +'/sessions',
        data: {
            lang: $config.language,
            cityId: getCookie('guru_selected_city_id'),
            only: 'active',
            'per-page': 30,
            objectIds: currentObjectId,
            fields: 'id,timeSpending,isSell,isBooking,timezone',
            expand: 'tags',
            page: currentPage,
        },
        success: function(data) {
            if (data && data.data && data.data.length) {
                let dates = {};

                data.data.forEach(function (event) {
                    // Для начала нам необходимо получить строку даты и строку времени
                    let date = new Date();    
                    date.setTime(event.timeSpending+'000');

                    let mm = date.getMonth() + 1; // getMonth() is zero-based
                    let dd = date.getDate();
                    let h = date.getHours();
                    let m = date.getMinutes();
                    // Строка даты
                    let dateStr = [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, date.getFullYear()].join('.');

                    if (!dates[dateStr]) {
                        dates[dateStr] = [];
                    }
                    
                    // Строка времени
                    event.time = [(h>9?'':'0')+h, (m>9?'':'0')+m].join(':');

                    // По умолчанию сеанс не в 3д
                    event.is3d = false;
                    event.tags.forEach(function(tag) {
                        // Если есть тег с названием 3д ставим флаг в сеансе, что он идет в 3д
                        if  (tag.name.toUpperCase() == '3D') {
                            event.is3d = true;
                        }
                    });

                    dates[dateStr].push(event);
                });

                // Пробигаемся по всему сформированному массиву из дат и сеансов на эти даты
                for (let _date in dates) {
                    let dateEl = $('#js-dates-template .js-date-block').clone();
                    dateEl.find('.dates-show__date').text(_date);

                    dates[_date].forEach(function(session) {
                        let timeEl = $('#js-dates-template .js-time-block').clone();

                        // Если сеанс в 3д то ставим класс, который добавляет надпись 3д
                        if (session.is3d) {
                            timeEl.addClass('in3d');
                        }

                        // Если сеанс в продаже, удаляем клас неактивной кнопки, и ставим кнопке 
                        if (session.isSell) {
                            timeEl.removeClass('inactive');
                            timeEl.find('a')
                                .addClass('arcom__btn')
                                .attr('href', $config.server.replace('webgate', 'saleframe') + '?sid=' + session.id + '&lang=' + $config.language + '&distributor_company_id=' + $config.distibutionId);
                        }

                        timeEl.find('a').text(session.time);
                        dateEl.find('.dates-show__sessions').append($(timeEl));
                    });

                    $('.js-dates').append($(dateEl));
                }

                reinitAtsJs();
            } else {
                // error
            }

            if (data && data.pagination.pageCount <= currentPage) {
                $(".js-load-sessions").hide();
            } else {
                $(".js-load-sessions").show();
            }
        },
    });
}

/**
 * Установка города на основе данных из кук
 */
function loadCity() {
    $('.js-cities .guru').text(getCookie('guru_selected_city_name'));
}

////////////////
// FUNCTIONS  //
////////////////

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};
    let expires = options.expires;
    if (typeof expires == "number" && expires) {
        let d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);
    let updatedCookie = name + "=" + value;
    for (let propName in options) {
        updatedCookie += "; " + propName;
        let propValue = options[propName];
        if (propValue !== true) {
        updatedCookie += "=" + propValue;
        }
    }
    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

/**
 * Функция ренициализации скрипта вызова фрейма
 */
function reinitAtsJs() {
    let el = document.querySelector("#ats-init-script");
    el && el.remove();

    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.src = '//sc1-cdn.24ats.com/afp.min.js';
    script.setAttribute('id', 'ats-init-script');
    head.appendChild(script);
}