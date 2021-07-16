import 'jquery-ui-dist/jquery-ui';
import * as $ from 'jquery';
import browser from 'webextension-polyfill';
import { v4 } from 'uuid';
import styles from '../styles/fonts.css';
import opendyslexic from '../fonts/OpenDyslexic-Regular.ttf'
var rangy = require("rangy")
const toPopup = new BroadcastChannel('toPopup');
rangy.init();

function applyCssClassToHtml(cssClass, html) { }
const nDec = document.createRange();
const oDec = rangy.createRange();
let currentRange = nDec;
let rangeAfter = oDec;
let rangeBefore = oDec;
let wholeNodeRange = nDec;
var range = rangy.createRange();
var startRangeNode = range.startContainer;
console.log(range);

function getWordAtPoint(elem, x, y) {
    // if (phraseNode.textContent && afterPhraseNode.textContent && beforePhraseNode.textContent) {
    //     console.log('hey it has content');
    // }


    if (elem.nodeType == elem.TEXT_NODE) {
        var range = elem.ownerDocument.createRange();
        range.selectNodeContents(elem);
        var currentPos = 0;
        var endPos = range.endOffset;
        let outer;
        let ranges;
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
                        currentPos -= 2;
                        if (currentPos <= 0) {
                            currentPos = 0;
                        }
                        range.setStart(elem, currentPos);
                        secondary++;
                    } else {
                        range.expand("word");
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

$(document).ready(function () {
    $('body').append('<div id="readerContext"></div>');
    $('head').prepend(`<style>  @font-face { font-family: "opendyslexic"; src: url(${chrome.extension.getURL('/fonts/OpenDyslexic-Regular.ttf')}); }</style > `);
    let dragOption = true;
    const readerOffsetX = 50;
    const readerOffsetY = 50;
    let readerId = `reader`;
    let readerContentId = `readerContent`;
    let readerHandleId = `readerHandle`;
    $('body').append(`<div id='reader'></div>`);
    $(`#reader`).draggable();
    $(`#readerHUD`).draggable();
    $('#reader').html(`<div id='${readerHandleId}'></div><div id='${readerContentId}'></div>`);
    $('body').append('<div id="readerHUD"><div id="HUDhandle"></div><div id="hudcontent"><button id="readerDragButton"/>Fix to mouse</button></div></div>');
    const firstFrame = false;
    let timer = 5;
    $('#reader').draggable({ handle: '#readerHandle' });
    $('#readerHUD').draggable({ handle: '#HUDhandle' });

    $('div').on({
        mouseenter: function () { },
        mouseleave: function () { },
    });

    $('body').append('<div id="blurrem"></div>');
    console.log($('reader'));
    $('#reader').css({ filter: 'blur(0px)' })
    $('#readerHandle').text('Reader');
    $('#readerDragButton').css({
        width: '100px',
        height: '50px',
        'position': 'absolute',
        top: '50px',
    });
    $('reader').css({
        width: '50px',
        'position': 'absolute',
        top: '50px',
    });
    $('#readerDragButton').on('click', function () {
        dragOption = !dragOption
        console.log(dragOption);
    });
    let currentWord = '';
    let currentRange;
    const newDiv = document.createElement("div");
    $(document).mousemove(function (e) {
        currentWord = getWordAtPoint(e.target, e.originalEvent.x, e.originalEvent.y);
        newDiv.id = 'readerContext';
        if (e.target.textContent) {
            const screenOffsetX = e.originalEvent.x / 10;
            const screenOffsetY = e.originalEvent.y / 10;
            if (dragOption === false) {
                $('#reader').draggable('disable');
                $('#readerHUD').draggable('disable');
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
                $('#readerHUD').draggable('enable');
            }
        }
        $(`#reader`).css({
            backgroundColor: 'lightgreen',
        });
        if (currentWord !== '' && currentWord !== null && currentWord !== undefined) {
            console.log(currentRange);
            $('#readerContent').css({ filter: 'blur(0px)' })
            $('#readerHandle').css({ filter: 'blur(0px)' })
            if (currentWord.length < 150) {
                $('#readerContent').html(currentWord);
                $('#readerTarget').text(currentWord);
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