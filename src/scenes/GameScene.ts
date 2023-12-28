import { Scene } from 'phaser';
import { Card } from '../Card';
import { CardDealer } from '../CardDealer';
import { MemoDOM } from '../MemoDOM';
import { Timer } from '../Timer';

type SceneCreateProps = {
  isRestart?: boolean;
};

export class GameScene extends Scene {
  private _cardDealer: CardDealer;

  private _menuDOM: MemoDOM;

  private _timer: Timer;

  private _isGameOver: boolean;

  onStartGame = async () => {
    await this._cardDealer.createCards();
    this.input.on('gameobjectdown', this.onCardClick);
    this._timer.start();
  };

  onRestartGame = () => {
    this.scene.restart({ isRestart: true });
  };

  onCardClick = (_: unknown, card: Card) => {
    if (this._isGameOver) return;
    this._cardDealer.openCard(card);
  };

  onAllCardsOpen = () => {
    this._menuDOM.render({ type: 'end', isWin: true });
    this._timer.stop();
    this._isGameOver = true;
  };

  onTimerIsOver = () => {
    this._menuDOM.render({ type: 'end', isWin: false });
    this._isGameOver = true;
  };

  constructor() {
    super('GameScene');
  }

  async create({ isRestart }: SceneCreateProps) {
    // How to add one card

    // 1) const card = this.add.sprite(250, 400, 'card');
    //    card.scale = 0.6;
    // 2) const card = new Card(this, { x: 250, y: 300, id: '2' });

    this._isGameOver = false;

    this._cardDealer = new CardDealer(this);

    this._timer = new Timer(this, { x: 600, y: 10, maxTime: 30 });

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
    this._timer.onTimeIsOver = this.onTimerIsOver;
  }
}
