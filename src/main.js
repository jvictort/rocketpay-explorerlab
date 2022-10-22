import "./css/index.css";
import Imask, { MaskedRange } from 'imask';

// Data structures
const CC_COLORS = {
    visa: ['#436D99', '#2D57F2'],
    mastercard: ['#DF6F29', '#C69347'],
    default: ['black', 'white']
}

const FORM_MASKS = {
    securityCodePattern: {
        mask: '0000'
    },
    experationDatePattern: {
        mask: 'MM{/}YY',
        blocks: {
            MM: {
                mask: MaskedRange,
                from: 1,
                to: 12
            },
            YY: {
                mask: MaskedRange,
                from: String(new Date().getFullYear()).slice(2),
                to: String(new Date().getFullYear() + 10).slice(2)
            }
        }
    },
    cardNumberPattern: {
        mask: [
            {
                mask: '0000 0000 0000 0000',
                regex: /^4\d{0,15}/,
                cardtype: 'visa'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2}\)\d{0,12})/,
                cardtype: 'mastercard'
            },
            {
                mask: '0000 0000 0000 0000',
                cardtype: 'default'
            }
        ],
        dispatch(appended, dynamicMasked) {
            const number = (dynamicMasked.value + appended).replace(/\D/g, '');
            const foundMask = dynamicMasked.compiledMasks.find(mask => number.match(mask.regex));

            console.log(foundMask);

            return foundMask;
        },
    }
}

// Functions
function setCardType(type) {
    const ccBgColor = document.querySelectorAll('.cc-bg svg > g path');
    const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');

    ccBgColor[0].setAttribute('fill', CC_COLORS[type][0]);
    ccBgColor[1].setAttribute('fill', CC_COLORS[type][1]);
    ccLogo.setAttribute('src', `cc-${type}.svg`);
}

// Form Inputs
const securityCode = document.querySelector('#security-code');
const experationDate = document.querySelector('#expiration-date');
const cardNumber = document.querySelector('#card-number');
const cardHolder = document.querySelector('#card-holder');
const form = document.querySelector('form');

// Masks
const experationDateMasked = IMask(experationDate, FORM_MASKS.experationDatePattern);
const securityCodeMasked = Imask(securityCode, FORM_MASKS.securityCodePattern);
const cardNumberMasked = Imask(cardNumber, FORM_MASKS.cardNumberPattern);

// EventListeners
form.addEventListener('submit', event => {
    event.preventDefault();
});

cardHolder.addEventListener('input', () => {
    const ccHolder = document.querySelector('.cc-holder .value');
    let defaultHolder = 'FULANO DA SILVA';
    ccHolder.innerText = cardHolder.value.length === 0 ? defaultHolder : cardHolder.value;
});

// Dynamic info upload
securityCodeMasked.on('accept', () => {
    const ccSecurityCode = document.querySelector('.cc-security .value');
    ccSecurityCode.innerText = securityCodeMasked.value.length === 0 ? '123' : securityCodeMasked.value;
});

cardNumberMasked.on('accept', () => {
    const ccCardNumber = document.querySelector('.cc-number');
    let cardtype = cardNumberMasked.masked.currentMask.cardtype;

    ccCardNumber.innerText = cardNumberMasked.value.length === 0 ? '1234 5678 9012 3456' : cardNumberMasked.value;
    setCardType(cardtype);
});

experationDateMasked.on('accept', () => {
    const ccExperationDate = document.querySelector('.cc-extra .cc-expiration .value');
    ccExperationDate.innerText = experationDateMasked.value.length === 0 ? '02/32' : experationDateMasked.value
})

