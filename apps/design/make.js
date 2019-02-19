'use strict';
// Требует node.js и пакетов mkdirp, rimraf
// Пакет mkdirp: https://www.npmjs.com/package/mkdirp#install — установить глобально или прописать установку в package.json, в секции devDependencies
// Пакет rimraf: https://www.npmjs.com/package/rimraf#install — установить глобально или прописать установку в package.json, в секции devDependencies
const fs              = require('fs');
const mkdirp          = require('mkdirp'); // зависимость, должна быть установлена (см. описание выше)
// const rimraf          = require('rimraf'); // зависимость, должна быть установлена (см. описание выше)

let mode = process.argv[2];          // получим имя блока

// let defaultExtensions = ['js']; // плагины по умолчанию
// let extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));  // добавим введенные при вызове плгины (если есть)

const dir = {
    src: 'src/',
    blocks: 'src/blocks/',
    fonts: 'src/fonts/',
    pages: 'src/pages/',
    scripts: 'src/scripts/',
    templates: 'src/templates/',
    styles: 'src/styles/',
    svg: 'src/svg',
    global: 'src/styles/global/',
};

if(mode === "landing" || mode === "landos" || mode === "l" || mode === "lan") {
    console.log('Landing loaded...');
    makeDirs();
} else if(mode === "p" || mode === "page" || mode === "pages") {
    console.log('Pages loaded...');
    makeDirs();
}

function makeDirs() {
    mkdirp(dir.src, function(err){
        if(err){
            console.log('Отмена операции: ' + err);
        } else {
            mkdirp(dir.blocks, function(err){
                if(err){
                    console.log('Отмена операции: ' + err);
                } else {
                    console.log(dir.blocks + ' (создана, если ещё не существует)');
                }
            });
            mkdirp(dir.fonts, function(err){
                if(err){
                    console.log('Отмена операции: ' + err);
                } else {
                    console.log(dir.fonts + ' (создана, если ещё не существует)');
                }
            });
            mkdirp(dir.svg, function(err){
                if(err){
                    console.log('Отмена операции: ' + err);
                } else {
                    console.log(dir.svg + ' (создана, если ещё не существует)');
                }
            });
            mkdirp(dir.pages, function(err){
                if(err){
                    console.log('Отмена операции: ' + err);
                } else {
                    console.log(dir.pages + ' (создана, если ещё не существует)');
                }
            });
            mkdirp(dir.scripts, function(err){
                if(err){
                    console.log('Отмена операции: ' + err);
                } else {
                    console.log(dir.scripts + ' (создана, если ещё не существует)');
                }
            });
            mkdirp(dir.templates, function(err){
                if(err){
                    console.log('Отмена операции: ' + err);
                } else {
                    console.log(dir.templates + ' (создана, если ещё не существует)');
                }
            });
            mkdirp(dir.styles, function(err){
                if(err){
                    console.log('Отмена операции: ' + err);
                } else {
                    console.log(dir.styles + ' (создана, если ещё не существует)');
                    mkdirp(dir.global, function(err){
                        if(err) {
                            console.log('Отмена операции: ' + err);
                        } else {
                            console.log(dir.global + ' (создана, если ещё не существует)');
                            makeFiles();
                        }
                    });
                }
            });
        }
    });
}

function makeFiles() {
    let PUG = [
        {
            name: 'index.pug',
            path: dir.pages + 'index.pug',
            inner: `extends ../templates/main.pug\nblock content\n    h1 Hello world\n    h2 I'm landing template`,
        }, {
            name: 'head.pug',
            path: dir.templates + 'head.pug',
            inner: `head
    meta(charset='UTF-8')
    meta(http-equiv='X-UA-Compatible', content='IE=edge,chrome=1')
    meta(name='viewport', content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,shrink-to-fit=no')
    meta(name='format-detection', content='telephone=no')

    // favicon
    link(rel='shortcut icon', href='favicon.ico')
    link(rel='shortcut icon', href='favicon.ico', type='image/x-icon')
    link(rel='icon',          href='favicon.ico', type='image/x-icon')
    link(rel='icon',          href='favicon.png', type='image/png')

    meta(name='keywords',    content='')
    meta(name='description', content='')

    title Title

    meta(name='format-detection', content='telephone=no')

    // Android - Chrome
    meta(name='theme-color' content='#fff')

    // Add to home screen for Safari on iOS
    meta(name='mobile-web-app-capable',                content='yes')
    meta(name='apple-mobile-web-app-capable',          content='yes')
    meta(name='apple-mobile-web-app-status-bar-style', content='black-translucent')
    meta(name='apple-mobile-web-app-title',            content='Title')
    meta(name='msapplication-TileColor',               content='#fff')
    meta(name='msapplication-TileImage',               content='img')
    meta(name='msapplication-starturl',                content='/')
    link(rel='apple-touch-icon', href='img.png')

    <!--[if IE]>
    script(src='http://html5shiv.googlecode.com/svn/trunk/html5.js')
    <![endif]-->

    link(rel='stylesheet', href='css/style.css?v=1')
    `,
        }, {
            inner: ``,
            name: 'blocks.pug',
            path: dir.templates + 'blocks.pug',
        }, {
            name: 'main.pug',
            path: dir.templates + 'main.pug',
            inner: `doctype html
html(lang='en')
    include head.pug
    include blocks.pug

    body
        block content
        include scripts.pug`,
        }, {
            name: 'scripts.pug',
            path: dir.templates + 'scripts.pug',
            inner: `script(src='js/scripts.js?version=1')`,
        }
    ];
    let SCSS = [
        {
            name: 'global-typo.scss',
            path: dir.global + 'global-typo.scss',
            inner: `/* typography */`,
        }, {
            name: 'global-fonts.scss',
            path : dir.global + 'global-fonts.scss',
            inner: `/* fonts */`,
        }, {
            name: 'global-scaffolding.scss',
            path : dir.global + 'global-scaffolding.scss',
            inner: `/* global styles */`,
        }, {
            name: 'extends.scss',
            path : dir.styles + 'extends.scss',
            inner: `/* extends */\n%gray { color: #ccc; }`,
        }, {
            name: 'mixins.scss',
            path : dir.styles + 'mixins.scss',
            inner: `/* mixins */\n@mixin gray($color) { color: $color }`,
        }, {
            name: 'func.scss',
            path : dir.styles + 'func.scss',
            inner: `/* functions */\n@function calc-vw($px) {\n    @return ($px / 19.20) + vw;\n}`,
        }, {
            name: 'variables.scss',
            path : dir.styles + 'variables.scss',
            inner: `/* variables */\n$gray: #ccc;`,
        }, {
            name: 'style.scss',
            path : dir.styles + 'style.scss',
            inner: `/* Variables, mixins, extends */
@import 'variables.scss';
@import 'mixins.scss';
@import 'extends.scss';
@import 'func.scss';

@import 'blocks.scss';

/* Global styles */
@import 'global/global-fonts.scss';
@import 'global/global-typo.scss';
@import 'global/global-scaffolding.scss';`,
        }, {
            name: 'blocks.scss',
            path : dir.styles + 'blocks.scss',
            inner: `/* Blocks */`,
        },
    ];
    let JS = [
        {
            name: 'scripts.js',
            path: dir.scripts + 'scripts.js',
            inner: ``,
        }
    ];
    PUG.forEach(createFile);
    SCSS.forEach(createFile);
    JS.forEach(createFile);
}

// создпние файла
function createFile(data) {
    if(fileExist(data.path) === false) {
        fs.writeFile(data.path, data.inner, function(err) {
            if(err) {
                return console.log('Файл НЕ создан: ' + err);
            }
            console.log('Файл создан: ' + data.path);
        });
    } else {
        console.log('Файл НЕ создан: ' + data.path + ' (уже существует)');
    }
}


// Оставить в массиве только уникальные значения (убрать повторы)
function uniqueArray(arr) {
    var objectTemp = {};
    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        objectTemp[str] = true; // запомнить строку в виде свойства объекта
    }
    return Object.keys(objectTemp);
}

// Проверка существования файла
function fileExist(path) {
    const fs = require('fs');
    try {
        fs.statSync(path);
    } catch(err) {
        return !(err && err.code === 'ENOENT');
    }
}


// TODO: возможность подключения дополнений, плагинов и прочего
