'use strict';

import BaseView from '../BaseView/BaseView.js';
import tagParser from '../../modules/TagParser/TagParser.js';
import '../../static/css/user-page.scss';

export default class Profile extends BaseView {
	constructor() {
		super();
		this._needAuth = true;
	}

	build() {
		this.template = `<Img {{src=./static/img/user-default.jpg}} {{class=profile-block__avatar}}>
                         <UserInfo>
                         <Button {{text=Back}} {{class=button}} {{click=goMenu}}>
                         <Button {{text=LogOut}} {{class=button}} {{click=logOut}}>`;
		return new Promise((resolve) => {
			tagParser.toHTML(this.template).then((elementsArray) => {
				this.elementsArray = elementsArray;
				const div = document.createElement('div');
				div.setAttribute('class', 'main-content__profile-block');
				this.elementsArray.forEach((el) => {
					div.appendChild(el.render());
				});
				this.element = div;
				this.userBlock = this.elementsArray[1];
				this.logoText = 'Your profile';
				resolve();
			});
		});
	}

	afterRender() {
		return new Promise((resolve) => resolve(this.userBlock.afterRender()));
	}

	show() {
		return super.show();
	}
}
