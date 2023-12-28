import { Scene } from 'phaser';
import { Card } from '../Card';
import { CardDealer } from '../CardDealer';
import { MemoDOM } from '../MemoDOM';

type SceneCreateProps = {
  isRestart?: boolean;
};

export class GameScene extends Scene {
  private _cardDealer: CardDealer;

  private _menuDOM: MemoDOM;

  onStartGame = async () => {
    await this._cardDealer.createCards();
    this.input.on('gameobjectdown', this.onCardClick);
  };

  onRestartGame = () => {
    this.scene.restart({ isRestart: true });
  };

  onCardClick = (_: unknown, card: Card) => {
    this._cardDealer.openCard(card);
  };

  onAllCardsOpen = () => {
    this._menuDOM.render({ type: 'end', isWin: true });
  };

  constructor() {
    super('GameScene');
  }

  async create({ isRestart }: SceneCreateProps) {
    // How to add one card

    // 1) const card = this.add.sprite(250, 400, 'card');
    //    card.scale = 0.6;
    // 2) const card = new Card(this, { x: 250, y: 300, id: '2' });

    this._cardDealer = new CardDealer(this);

    this._menuDOM = new MemoDOM();

    isRestart ? this.onStartGame() : this._menuDOM.render({ type: 'start' });

    // await this._cardDealer.createCards();

    this.initEvents(); // subscribe on Events
  }

  initEvents() {
    this._menuDOM.onStartGame = this.onStartGame;
    this._menuDOM.onRestartGame = this.onRestartGame;
    this._cardDealer.onAllCardsOpen = this.onAllCardsOpen;
    // this.input.on('gameobjectdown', this.onCardClick);
  }
}
