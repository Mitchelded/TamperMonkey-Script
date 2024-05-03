// ==UserScript==
// @name         Telegram Sender
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Send to Telegram via Bot API
// @author       Mitchelde
// @match        https://gelbooru.com/*
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

    // Функция для отправки сообщения
    function sendMessage(message) {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = new URLSearchParams({
            chat_id: chatId,
            text: message
        });
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: data.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function (response) {
                console.log(response.responseText);
            }
        });
    }

    function getImageSource() {
        // Находим элемент с идентификатором image
        const imageElement = document.getElementById('image');
        // Проверяем, был ли найден элемент
        if (imageElement) {
            // Получаем значение атрибута src из тега img
            const imageUrl = imageElement.getAttribute('src');
            return imageUrl; // Возвращаем ссылку на изображение
        } else {
            console.log('Элемент с идентификатором image не найден.');
            return null; // Если элемент не найден, возвращаем null
        }
    }

    function getVideoSource() {
        // Находим элемент с идентификатором image
        const imageElement = document.querySelector('#gelcomVideoPlayer > source:nth-child(1)');
        // Проверяем, был ли найден элемент
        if (imageElement) {
            // Получаем значение атрибута src из тега img
            const videoUrl = imageElement.src;
            return videoUrl; // Возвращаем ссылку на изображение
        } else {
            console.log('Элемент с идентификатором video не найден.');
            return null; // Если элемент не найден, возвращаем null
        }
    }
    function getTextFromCharacterTags() {
        // Находим элемент с идентификатором #tag-list
        const tagList = document.querySelector('#tag-list');

        // Проверяем, был ли найден элемент с идентификатором #tag-list
        if (!tagList) {
            console.log('Элемент с идентификатором #tag-list не найден.');
            return []; // Возвращаем пустой массив, если элемент не найден
        }

        // Находим ссылки с классом tag-type-character внутри элемента #tag-list
        const characterLinks = tagList.querySelectorAll('li.tag-type-character > a');
        const copyrightLinks = tagList.querySelectorAll('li.tag-type-copyright > a');
        const generalLinks = tagList.querySelectorAll('li.tag-type-general > a');

        // Создаем массив для хранения текста из тегов <a>
        const characterTexts = [];

        // Перебираем найденные ссылки
        characterLinks.forEach(function (link) {
            // Извлекаем текст из ссылки и добавляем его в массив
            let text = link.textContent.trim().replace(/[^\w]/g, '_');
            characterTexts.push(' #' + text);
        });

        copyrightLinks.forEach(function (link) {
            // Извлекаем текст из ссылки и добавляем его в массив
            let text = link.textContent.trim().replace(/[^\w]/g, '_');
            characterTexts.push(' #' + text);
        });

        generalLinks.forEach(function (link) {
            // Извлекаем текст из ссылки и добавляем его в массив
            let text = link.textContent.trim().replace(/[^\w]/g, '_');
            characterTexts.push(' #' + text);
        });

        // Возвращаем массив текста из ссылок
        return characterTexts;
    }
    // Функция для создания кнопки и добавления ее в указанный элемент
    function addButtonToFirstDiv() {
        const targetScrolleBox = document.getElementById('scrollebox');
        const targetContainer = document.getElementsByClassName('alert alert-info');

        console.log(targetScrolleBox.innerText + targetContainer.innerText);
        if (targetScrolleBox && targetContainer) {
            const text = document.createElement('span');
            text.textContent = "|";
            const link1 = document.createElement('a');
            link1.textContent = 'Отправить сообщение в Telegram';
            link1.href = '#'; // Устанавливаем пустое значение href для того, чтобы элемент выглядел как ссылка
            link1.addEventListener('click', function () {
                sendPhoto(getImageSource(), getTextFromCharacterTags());
                console.log(getTextFromCharacterTags());
            });

            const link2 = document.createElement('a');
            link2.textContent = 'Отправить сообщение в Telegram';
            link2.href = '#'; // Устанавливаем пустое значение href для того, чтобы элемент выглядел как ссылка
            link2.style.padding = '20%';
            link2.addEventListener('click', function () {
                if (getImageSource() == null) {
                    sendVideo(getVideoSource(), getTextFromCharacterTags());
                }
                else {
                    sendPhoto(getImageSource(), getTextFromCharacterTags());
                }
            });
            // Добавляем кнопку внутрь элемента
            targetScrolleBox.appendChild(text);
            targetScrolleBox.appendChild(link1);
            
            // Convert HTMLCollection to an array
            const containersArray = Array.from(targetContainer);
            console.log(targetContainer)
            console.log(containersArray)
            // Iterate over each element and perform operations
            containersArray.forEach(function (container) {
                // Your code to manipulate each container goes here
                container.appendChild(link2);
            });
        } else {
            console.log('Первый элемент <div> внутри body не найден.');
        }
    }

    // Вызываем функцию добавления кнопки при загрузке страницы
    addButtonToFirstDiv();
})();
