import { Scene } from 'phaser';
import { Card } from '../Card';
import { CardDealer } from '../CardDealer';

export class GameScene extends Scene {
  cardDealer: CardDealer;

  onCardClick = (_: unknown, card: Card) => {
    this.cardDealer.openCard(card);
  };

  onAllCardsOpen = () => {
    console.log(this);
    this.scene.restart();
  };

  constructor() {
    super('GameScene');
  }

  async create() {
    // How to add one card

    // 1) const card = this.add.sprite(250, 400, 'card');
    //    card.scale = 0.6;
    // 2) const card = new Card(this, { x: 250, y: 300, id: '2' });

    this.cardDealer = new CardDealer(this);

    await this.cardDealer.createCards();

    this.initEvents(); // subscribe on Events
  }

  initEvents() {
    this.cardDealer.onAllCardsOpen = this.onAllCardsOpen;
    this.input.on('gameobjectdown', this.onCardClick);
  }
}
