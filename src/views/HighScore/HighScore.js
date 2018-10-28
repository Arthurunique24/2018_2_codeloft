'use strict';

import BaseView from '../BaseView/BaseView.js';
import tagParser from '../../modules/TagParser/TagParser.js';
import eventHandler from '../../modules/EventHandler/EventHandler.js';


export default class HighScore extends BaseView {
    build() {
        eventHandler.addHandler('loadScoreRows', () => this.updateScore());
        return new Promise((resolve) => {
            this.template = `<ScoreTable>
                         <Label {{class=score-loading}} {{text=loading...}}>
                         <Button {{text=Load more}} {{class=buttonGame}}, {{click=loadScoreRows}}>
                         <Button {{text=Back}} {{class=buttonGame}} {{click=goMenu}}>`;
            tagParser.toHTML(this.template).then((elementsArray) => {
                this.elementsArray = elementsArray;
                this.scoreTable = this.elementsArray[0];
                this.loadingLabel = this.elementsArray[1];
                this.loadMore = this.elementsArray[2];
                this.loadingLabel.hide();
                const div = document.createElement('div');
                div.setAttribute('class', 'highScore-page__list');
                this.elementsArray.forEach((el) => {
                    div.appendChild(el.render());
                });
                this.element = div;
                resolve();
            });
        });
    }

    afterRender() {
        this.updateScore();
        return super.afterRender();
    }

    updateScore() {
        this.loadingLabel.show();
        this.scoreTable.loadScore().then(() => {
            this.loadingLabel.hide();
            this.loadMore.show();
        });
    }
}
