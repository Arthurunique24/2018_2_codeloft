'use strict';

import BaseView from '../BaseView/BaseView.js';
import tagParser from '../../modules/TagParser/TagParser.js';
import Block from '../../components/Block/Block.js';
import Validation from '../../modules/Validation/Validation.js';
import eventHandler from '../../modules/EventHandler/EventHandler.js';
import Transport from '../../modules/Transport/Transport.js';
import UserService from '../../services/UserService/UserService.js';
import router from '../../modules/Router/Router.js';


export default class SignIn extends BaseView {
	build() {
		eventHandler.addHandler('btnSignInSubmit', () => {
			if (this.isValid(this.inputs, this.errorsFields)) {
				let request = {};
            	this.inputs.forEach(input => {
            		if (input.name === 'login') {
						request.login = input.value;
					}
					if (input.name === 'email') {
						request.email = input.value;
					}
					if (input.name === 'password') {
						request.password = input.value;
					}
				});
				const adr = '/signin';

				Transport.Post(adr, request).then(() => {
					UserService.GetData().then(() => {
                    	console.log('done');
						router.go('/');
					}).catch((response) => {
						console.log(response);
					});
				}).catch((response) => {
					if (!response.json) {
						console.log(response);
						return;
					}
					response.json().then((json) => console.log(json));
				});
			}
		});

		this.template = `<Block {{name=login}} {{class=signInErrorField}}>
						<Input {{name=login}} {{class=game-input signInInput}} {{placeholder=Enter your login}}>
						<Block {{name=password}} {{class=signInErrorField}}>
                        <Input {{name=password}} {{class=game-input signInInput}} {{placeholder=Enter your password}} {{type=password}}>
                        <Button {{class=buttonGame}} {{text=Sign in}} {{click=btnSignInSubmit}}>
                        <Button {{class=buttonGame}} {{text=Back}} {{click=goMenu}}>`;
        this.elementArray = tagParser.toHTML(this.template);
        const div = document.createElement("div");
        div.setAttribute('class', 'signIn-page_menu');
        this.elementArray.forEach(el => div.appendChild(el));
        this.element = div;	}

	addEffects() {
		this.inputs = [...document.getElementsByClassName('signInInput')];
		this.errorsFields = [...document.getElementsByClassName('signInErrorField')];

		this.inputs.forEach((input, i) => {
        	input.addEventListener('blur', () => {
				this.errorsFields[i].innerHTML = '';
				this.inputs[i].style.borderColor = 'black';
				this.isValid([input], [this.errorsFields[i]]);
        	});
		});
	}

	showErrors(errors, errorFields, inputs) {
		errorFields.forEach((errorField, i) => {
			errors.forEach((err, j) => {
        		if (errorField.getAttribute('name') === err.class[1]) {
					errorField.innerHTML = err.innerHTML;
					console.log(inputs[j]);
        			// inputs[j].style.borderColor = 'red';
				}
			});
		});
	}

	isValid(inputs = [], errorFields = []) {
		const errors = new Validation(this.inputs).checkAllFields();

		if (errors.length === 0) {
			return true;
		}
		this.showErrors(errors, errorFields, inputs);
		return false;
	}
}
