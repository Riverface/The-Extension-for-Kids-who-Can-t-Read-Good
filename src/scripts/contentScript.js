import 'jquery-ui-dist/jquery-ui';

import * as $ from 'jquery';

import browser from 'webextension-polyfill';
import { v4 } from 'uuid';

function getWordAtPoint(elem, x, y) {
    if (elem.nodeType == elem.TEXT_NODE) {
        var range = elem.ownerDocument.createRange();
        range.selectNodeContents(elem);
        var currentPos = 0;
        var endPos = range.endOffset;
        while (currentPos + 1 < endPos) {
            range.setStart(elem, currentPos);
            range.setEnd(elem, currentPos + 1);
            if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                range.expand("word");
                let secondary = 0;
                for (let i = 1; (currentPos - i) > 0; i++) {
                    if (secondary <= 4) {

                        currentPos -= i;
                        range.setStart(elem, currentPos);
                        range.expand("word");
                        secondary++;
                    }
                }

                var ret = range.toString();
                range.detach();
                return (ret);
            }
            currentPos += 1;
        }
    } else {
        for (var i = 0; i < elem.childNodes.length; i++) {
            var range = elem.childNodes[i].ownerDocument.createRange();
            range.selectNodeContents(elem.childNodes[i]);
            if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                range.detach();
                return (getWordAtPoint(elem.childNodes[i], x, y));
            } else {
                range.detach();
            }
        }
    }
    return (null);
}

const toPopup = new BroadcastChannel('toPopup');

$(document).ready(function () {

    const dragOption = true;
    const readerOffsetX = 20;
    const readerOffsetY = 20;

    let readerId = `reader`;
    let readerContentId = `readerContent`;
    let readerHandleId = `readerHandle`;

    $('body').append(`<div id='${readerId}'></div>`);

    $(`#${readerId}`).draggable();
    $('#reader').html(`<div id='${readerHandleId}'></div><div id='${readerContentId}'></div>`);

    const firstFrame = false;
    let timer = 5;
    $('#reader').draggable({ handle: '#readerHandle' });
    setInterval(function () {

        if (timer === 5) {
            timer = 0;
            console.log(timer);
        } else {
            console.log(timer);
        }
        timer += 1;
    }, 1000);

    console.log($('reader'));

    $(`#readerHandle`).css({
        height: '30px',
        width: 'auto',
        border: '1px',
        'z-index': 999999,
        'background-color': 'green'
    });

    $(`#${readerId}`).css({
        position: 'fixed',
        height: '100px',
        'max-width': '300px',
        'min-width': '250px',
        border: '3px solid black',
        left: '50%',
        top: '50%',
        'z-index': 99999,
        'border-radius': '10px',
        'text-align': 'center'
    });

    let currentWord = '';

    $(document).mousemove(function (e) {
        console.log(e)
        currentWord = getWordAtPoint(e.target, e.originalEvent.x, e.originalEvent.y);
        if (e.target.textContent) {
            if (dragOption === false) {
                $(`#${readerId}`).css({
                    top: e.originalEvent.y + readerOffsetX,
                    left: e.originalEvent.x + readerOffsetY,
                });
            }
        }

        $(`#${readerId}`).css({
            backgroundColor: 'lightgreen',
        });
        if (currentWord !== '' && currentWord !== null && currentWord !== undefined) {
            if (currentWord.length < 150) {
                $('#readerContent').text(currentWord);
                toPopup.postMessage(currentWord);
            }
        }
        console.log(currentWord);
    });

    toPopup.onmessage = function (e) {
        $(`#${readerContentId}`).html(`${e.data}`);
        console.log('Received', e.data);
    };

});