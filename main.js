import { createInterface } from "readline";

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Field {
  constructor(fieldArray) {
    this.field = fieldArray;
    this.isGameOver = false;
    this.currentRow = 0;
    this.currentElement = 0;
  }

  print() {
    this.field.forEach((row) => {
      const line = row.join("");
      console.log(line);
    });
  }

  static async generateField(rl) {
    let width;
    do {
      width = await new Promise((resolve) => {
        rl.question(
          "how big of the field do you like (input number >= 2): ",
          (input) => {
            resolve(input);
          }
        );
      });
      if (isNaN(width) || width < 2) {
        console.log("invalid input.");
      }
    } while (isNaN(width) || width < 2);
    

    const field = [];

    for (let i = 0; i < width; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const randomElement = Math.random() < 0.2 ? hole : fieldCharacter;
        row.push(randomElement);
      }
      field.push(row);
    }

    field[0][0] = pathCharacter;

    let hatX, hatY;
    do {
      hatX = Math.floor(Math.random() * width);
      hatY = Math.floor(Math.random() * width);
    } while (hatX === 0 && hatY === 0);
    field[hatY][hatX] = hat;
    const newField = new Field(field);
    newField.print();
    return newField;
  }

  checkGameOver() {
    const isOutOfBounds =
      (this.currentRow || this.currentElement) < 0 ||
      (this.currentRow || this.currentElement) >= this.field[0].length;
    if (isOutOfBounds) {
      console.log("Out of bound. Game over");
      this.isGameOver = true;
    } else if (this.field[this.currentRow][this.currentElement] === hole) {
      console.log("Fall into the hole. Game over");
      this.isGameOver = true;
    } else if (this.field[this.currentRow][this.currentElement] === hat) {
      console.log("Found a hat. You are a winner");
      this.isGameOver = true;
    }
  }

  drawMove() {
    if (!this.isGameOver) {
      this.field[this.currentRow][this.currentElement] = pathCharacter;
      this.print();
    }
  }

  move(direction) {
    switch (direction) {
      case "up":
        this.currentRow -= 1;
        break;
      case "down":
        this.currentRow += 1;
        break;
      case "left":
        this.currentElement -= 1;
        break;
      case "right":
        this.currentElement += 1;
        break;
      default:
        console.log("please make a meaningful move");
        return;
    }
    this.checkGameOver();
    this.drawMove();
  }
}

const playGame = async (field) => {
  console.log("Hi, wellcome to The Deadly Field");
  const getInput = async () => {
    const playerMove = await new Promise((resolve) => {
      rl.question("please make your move(up, down, left, right): ", (input) => {
        resolve(input);
      });
    });
    field.move(playerMove);

    if (!field.isGameOver) {
      await getInput();
    } else {
      rl.close();
    }
  };
  await getInput();
};


(async () => {
  const initialField = await Field.generateField(rl);
  await playGame(initialField);
})();
