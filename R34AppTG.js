// ==UserScript==
// @name         R34AppTG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Добавляет кнопку к каждому блоку на странице с атрибутом data-index при прокрутке вниз
// @author       You
// @match        https://r34.app/posts/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';


    const botToken = '6383955810:AAEBT2DEsWRtzsWpnXQNP2C0SpWdtlF-sTY';

    const chatId = '1760295180';

    // Функция для отправки фото
    function sendPhoto(photoUrl, caption = '') {
        const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', photoUrl);
        formData.append('caption', caption);
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: formData,
            onload: function (response) {
                console.log(response.responseText);
            }
        });
    }

    // Функция для отправки фото
    function sendVideo(photoUrl, caption = '') {
        const url = `https://api.telegram.org/bot${botToken}/sendVideo`;
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('video', photoUrl);
        formData.append('caption', caption);
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: formData,
            onload: function (response) {
                console.log(response.responseText);
            }
        });
    }


    // Функция для добавления кнопки к блоку
    function addButtonToBlock(block) {
        // Создаем кнопку
        var button = document.createElement('img');

        button.src = 'https://img.icons8.com/material-outlined/24/ffffff/telegram-app.png';

        // Добавляем обработчик события клика
        button.addEventListener('click', function () {
            console.log('Кнопка нажата для блока с индексом ' + block.getAttribute('data-index'));
            var q = block.querySelectorAll('figure > div > div > video');
            if (q[0] != null) {
                console.log(q[0].src);
                sendVideo(q[0].src, null);
            }
            else {
                q = block.querySelectorAll('figure > div > div > img');
                console.log(q[0].src);
                sendPhoto(q[0].src, null);
            }

        });
        var t = block.querySelectorAll('figure > figcaption > div.flex.items-center.p-2');

        t.forEach(function (blocks) {
            // Добавляем кнопку к блоку
            blocks.appendChild(button);
        });

    }

    // Функция для обработки события прокрутки страницы
    function handleScroll() {
        // Находим все новые блоки с атрибутом data-index
        var newBlocks = document.querySelectorAll('li[data-index]:not(.button-added)');

        // Перебираем каждый новый блок
        newBlocks.forEach(function (block) {
            // Добавляем кнопку к блоку
            addButtonToBlock(block);
            // Добавляем класс для отметки того, что кнопка уже добавлена к этому блоку
            block.classList.add('button-added');
        });
    }

    // Добавляем обработчик события прокрутки страницы
    window.addEventListener('scroll', handleScroll);

    // Вызываем функцию handleScroll() один раз в начале, чтобы добавить кнопки к уже существующим блокам
    handleScroll();
})();
