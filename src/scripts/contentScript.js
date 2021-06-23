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
                for (let i = 1;
                    (currentPos - i) >= 0; i++) {
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
$('body').append('<div id=""> </div>');
$(document).ready(function() {
    let dragOption = true;
    const readerOffsetX = 50;
    const readerOffsetY = 50;
    let readerId = `reader`;
    let readerContentId = `readerContent`;

    let readerHandleId = `readerHandle`;
    $('body').append(`<div id='${readerId}'></div>`);

    $(`#${readerId}`).draggable();

    $('#reader').html(`<div id='${readerHandleId}'></div><div id='${readerContentId}'></div><button id='readerDragButton'></button>`);

    const firstFrame = false;

    let timer = 5;

    $('#reader').draggable({ handle: '#readerHandle' });

    setInterval(function() {
        if (timer === 5) {
            timer = 0;
            console.log(timer);
        } else {
            console.log(timer);
        }
        timer += 1;
    }, 1000);

    $('body').append('<div id="readerHUD"></div>');

    $('body').append('<div id="blurrem"></div>');

    $('#blurrem').css({
        'z-index': '-1',
        width: '100%',
        height: '100%',
        position: 'fixed',
        filter: 'blur(1px)',
        'opacity': '100%',
        top: 0,
        left: 0
    })

    $('#blurrem').css({ filter: 'blur(10px)' })

    console.log($('reader'));
    $('#reader').css({ filter: 'blur(0px)' })

    $('#readerHandle').text('Reader');

    $(`#readerHandle`).css({
        height: '30px',
        width: 'auto',
        'border-top-left-radius': '5px',
        'border-top-right-radius': '5px',
        'z-index': 999999,
        'background-color': 'green'
    });

    $('#readerButton').css({
        width: '100px',
        'position': 'absolute',
        top: '50px',
    });

    $('reader').css({
        width: '50px',
        'position': 'absolute',
        top: '50px',
    });

    $(`#readerHUD`).css({
        position: 'fixed',
        height: '150px',
        'width': '300px',
        border: '3px solid black',
        left: '50%',
        top: '50%',
        'z-index': 99999,
        'border-radius': '10px',
        'text-align': 'center'
    });

    $(`#${readerId}`).css({
        position: 'fixed',
        height: '150px',
        'width': '300px',
        border: '3px solid black',
        left: '50%',
        top: '50%',
        'z-index': 99999,
        'border-radius': '10px',
        'text-align': 'center',
        'font-family': 'OpenDyslexic-Regular'
    });

    $(`#HUDcontent`).css({
        position: 'fixed',
        height: '150px',
        'width': '300px',
        border: '3px solid black',
        left: '50%',
        top: '50%',
        'z-index': 99999,
        'border-radius': '10px',
        'text-align': 'center'
    });

    $(`#HUDhandle`).css({
        position: 'fixed',
        height: '150px',
        'width': '300px',
        border: '3px solid black',
        left: '50%',
        top: '50%',
        'z-index': 99999,
        'border-radius': '10px',
        'text-align': 'center',
        'font-family': 'OpenDyslexic-Regular'
    });

    $('#readerContent').css({
        'font-size': 'x-large',
        'font-family': 'OpenDyslexic-Regular'
    });
    $('#readerDragButton').on('click', function() {
        dragOption = !dragOption
        console.log(dragOption);
    });

    let currentWord = '';

    $(document).mousemove(function(e) {
        console.log(e)
        currentWord = getWordAtPoint(e.target, e.originalEvent.x, e.originalEvent.y);
        if (e.target.textContent) {
            const screenOffsetX = e.originalEvent.x / 10;
            const screenOffsetY = e.originalEvent.y / 10;
            if (dragOption === false) {
                $('#reader').draggable('disable');
                if (e.originalEvent.x < (e.screenX / 2)) {
                    $(`#reader`).css({
                        top: e.originalEvent.y + readerOffsetY,
                        left: e.originalEvent.x - readerOffsetX,
                    });
                } else {
                    $(`#reader`).css({
                        top: e.originalEvent.y + readerOffsetY,
                        left: e.originalEvent.x + readerOffsetX,
                    });

                }
            } else {
                $('#reader').draggable('enable');
            }
        }

        $(`#${readerId}`).css({
            backgroundColor: 'lightgreen',
        });
        if (currentWord !== '' && currentWord !== null && currentWord !== undefined) {
            if (currentWord.length < 150) {
                $('#readerContent').text(currentWord);
                $('#readerTarget').text(currentWord);
                toPopup.postMessage(currentWord);
            }
        }
        console.log(currentWord);
    });

    toPopup.onmessage = function(e) {
        $(`#${readerContentId}`).html(`${e.data}`);
        console.log('Received', e.data);
    };

});