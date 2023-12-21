import { Scene } from 'phaser';
import { Card, CardPosition } from './Card';
import { Utils } from 'phaser';
import gameConfig from './gameConfig';

export class CardDealer {
  private _scene: Scene;
  private possibleCardIds: Card['id'][] = ['1', '2', '3', '4', '5'];
  private prevOpenCard: Card | null = null;
  private guessedPairs = 0;

  public onAllCardsOpen: (...args: any) => any = () => null;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  openCard(card: Card) {
    if (card.isOpen) return;

    card.open();

    if (!this.prevOpenCard) {
      this.prevOpenCard = card;
      return;
    }

    if (this.prevOpenCard.id === card.id) {
      this.guessedPairs += 1;
    } else {
      this.prevOpenCard.close();
      card.close();
    }

    this.prevOpenCard = null;

    if (this.guessedPairs === this.possibleCardIds.length) {
      this.onAllCardsOpen();
    }
  }

  createCards() {
    const allCardIdsPosition = Utils.Array.Shuffle([
      ...this.possibleCardIds,
      ...this.possibleCardIds,
    ]);
    const cardsPositions = this.getCardsPositions();

    allCardIdsPosition.forEach((cardId, idx) => {
      const { x, y } = cardsPositions[idx];
      new Card(this._scene, { x, y, id: cardId });
    });
  }

  private getCardsPositions() {
    const cardsPositions: CardPosition[] = [];

    const cardTexture = this._scene.textures.get('card').getSourceImage();

    const cardWidth = cardTexture.width;
    const cardHeight = cardTexture.height;

    // const screenWidth = this._scene.cameras.main.width;
    // const screenHeight = this._scene.cameras.main.height;

    const screenWidth = gameConfig.screenWidth;
    const screenHeight = gameConfig.screenHeight;

    const rows = 2;
    const cols = 5;

    const cardMargin = 4;

    const marginLeft = (screenWidth - cardWidth * cols) / 2 + cardWidth / 2;
    const marginRight = (screenHeight - cardHeight * rows) / 2 + cardHeight / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = marginLeft + col * (cardWidth + cardMargin);
        const y = marginRight + row * (cardHeight + cardMargin);
        cardsPositions.push({ x, y });
      }
    }

    return cardsPositions;
  }
}
