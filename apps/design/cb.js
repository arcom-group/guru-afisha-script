'use strict';
/* Требует node.js и пакета mkdirp
   Пакет mkdirp: https://www.npmjs.com/package/mkdirp#install — установить глобально или прописать установку в package.json, в секции devDependencies
   Использование:
     - поместить этот файл в корень проекта
     - исправить пути к генерируемым папкам и файлам, если блоки проекта лежат не в ./src/blocks/
     - в терминале, будучи в корневой папке проекта, выполнить node createBlock.js [имя блока] [доп. расширения через пробел]
*/
const fs = require('fs');                                                       // будем работать с файловой системой
const mkdirp = require('mkdirp');                                               // зависимость, должна быть установлена (см. описание выше)

let blockName = process.argv[2];                                                // получим имя блока
let defaultExtensions = ['pug', 'scss', 'js'];                                  // расширения по умолчанию
let extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));  // добавим введенные при вызове расширения (если есть)

// Если есть имя блока
if(blockName) {
    if(!blockName.match(/[а-яА-Я]/)) {
        let dirPath = 'src/blocks/' + blockName + '/';                          // полный путь к создаваемой папке блока
        mkdirp(dirPath, function(err){                                          // создаем

            if(err) {                                                           // Если какая-то ошибка — покажем
                console.error('Отмена операции: ' + err);
            }

            else {                                                              // Нет ошибки, поехали!
                console.log('Создание папки ' + dirPath
                    + ' (создана, если ещё не существует)');

                mkdirp(dirPath + 'images');

                extensions.forEach(function(extention) {                        // Обходим массив расширений и создаем файлы, если они еще не созданы

                    let filePath = dirPath + blockName + '.' + extention;       // полный путь к создаваемому файлу
                    let fileContent = '';                                       // будущий контент файла
                    let styleFileImport = '';                                   // будущая конструкция импорта файла стилей
                    let templateFileImport = '';                                // будущая конструкция импорта файла шаблонов
                    let fileCreateMsg = '';                                     // будущее сообщение в консоли при создании файла

                    // Если это SCSS
                    if(extention == 'scss') {
                        styleFileImport = '@import \'./src/blocks/' + blockName
                        + '/' + blockName + '.scss\';';
                        fileContent = '.' + blockName + ' {}\n';

                        fs.appendFile('src/styles/blocks.scss', '\n'
                            + styleFileImport, function (err) {
                            if(err) {
                                return console.log('blocks.scss НЕ обновлён: ' + err);
                            }
                            console.log('blocks.scss обновлён');
                        });
                    }

                    if(extention == 'pug') {                                    // Если это PUG
                        templateFileImport = 'include ../blocks/' + blockName + '/' + blockName + '.pug';
                        fileContent = 'mixin ' + blockName + '()\n    .' + blockName + '()&attributes(attributes)';

                        fs.appendFile('src/templates/blocks.pug', templateFileImport + '\n', function (err) {
                            if(err) {
                                return console.log('blocks.pug НЕ обновлён: ' + err);
                            }
                            console.log('blocks.pug обновлён');
                        });
                    }

                    if(fileExist(filePath) === false) {                         // Создаем файл, если он еще не существует

                        fs.writeFile(filePath, fileContent, function(err) {
                            if(err) {
                                return console.log('Файл НЕ создан: ' + err);
                            }
                            console.log('Файл создан: ' + filePath);
                        });
                    }
                    else {
                        console.log('Файл НЕ создан: ' + filePath + ' (уже существует)');
                    }

                });
            }
        });
    } else {
        console.log('Недопустимые символы!');
    }
}
else {
    console.log('Отмена операции: не указан блок');
}

function uniqueArray(arr) {                                                     // Оставить в массиве только уникальные значения (убрать повторы)
    var objectTemp = {};
    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        objectTemp[str] = true;                                                 // запомнить строку в виде свойства объекта
    }
    return Object.keys(objectTemp);
}

function fileExist(path) {                                                      // Проверка существования файла
    const fs = require('fs');
    try {
        fs.statSync(path);
    } catch(err) {
        return !(err && err.code === 'ENOENT');
    }
}
