import {MDCRipple} from '@material/ripple';
import {MDCTextField} from '@material/textfield';


function setup_material() {
    let buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(function (value) {
        const buttonRipple = new MDCRipple(value);
    });
    let textFields = document.querySelectorAll('.mdc-text-field');
    textFields.forEach(function (value) {
        if (!value.hasAttribute(".mdc-text-field--outlined")){
            const field = new MDCTextField(value);
        }
    })
}

function setup(){
    setup_material();
}

setup();