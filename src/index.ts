const readlineSync = require('readline-sync');

class Tableau {
  tb: any | Array<string>;
  compteur = 0;
  compteur_line: any | Array<string>;
  vertical_line: Array<string> | any;

  initialise() {
    this.tb = [[], [], [], [], [], []];
    this.vertical_line = [[], [], [], [], [], []];
    this.compteur_line = [0, 0, 0, 0, 0, 0];
    const array = [
      '********* ',
      ' *   |   *',
      ' *  |||  *',
      ' * ||||| *',
      ' *|||||||*',
      ' *********',
    ];
    for (let i = 0; i < array.length; i++) {
      for (let f = 0; f < array[i].length; f++) {
        this.tb[i][f] = array[i].substr(f, 1);
        if (array[i].substr(f, 1) === '|') {
          this.compteur = this.compteur + 1;
          this.compteur_line[i] = this.compteur_line[i] + 1;
          this.vertical_line[i].push(f);
        }
      }
    }
    console.log(this.vertical_line);
  }

  show() {
    let result = '';
    for (let i = 0; i < this.tb.length; i++) {
      for (let f = 0; f < this.tb[i].length; f++) {
        result = result + this.tb[i][f];
      }
      console.log(result);
      result = '';
    }
  }

  start() {
    this.initialise();
    this.show();
  }

  error_line(line: number) {
    let message = 'not error';
    if (line > this.tb.length) {
      message = 'Error: this line is out of range';
    } else if (line < 0 || typeof line != 'string') {
      message = 'Error: invalid input (positive number expected)';
    } else if (this.compteur_line[line - 1] === 0) {
      message = 'Error: not element in the line';
    }
    return message;
  }

  error_global(line: number, matches: number) {
    let message = 'not error';
    if (matches === 0 && matches !== undefined) {
      message = 'Error: you have to remove at least one match';
    } else if (matches < 0 || typeof matches != 'string') {
      message = 'Error: invalid input (positive number expected)';
    } else if (matches > this.compteur_line[line - 1]) {
      message = 'Error: not enough matches on this line';
    }
    return message;
  }

  verify_error(
    type_user: string,
    type_reponse: string,
    reponse_question: number | string | any,
  ) {
    let reponse = '';
    let line = 0;
    let matches = 0;

    if (type_reponse === 'line') {
      if (type_user === 'IA' && reponse_question != 'null') {
        line = readlineSync.question('Line : ');
        console.log(reponse_question[0]);
      } else if (type_user === 'Player') {
        line = readlineSync.question('Line : ');
      }
    } else if (type_reponse === 'matches') {
      if (type_user === 'IA' && reponse_question != 'null1') {
        matches = readlineSync.question('Matches : ');
        console.log(reponse_question[0]);
      } else if (type_user === 'Player') {
        matches = readlineSync.question('Matches : ');
      }
    }
    let error = '';
    if (type_reponse === 'line') {
      if (type_user === 'IA') {
        error = this.error_line(reponse_question[0]);
        reponse = error;
      } else {
        error = this.error_line(line);
        reponse = error;
      }
    } else if (type_reponse === 'matches') {
      if (type_user === 'IA') {
        error = this.error_global(reponse_question[0], reponse_question[1]);
        reponse = error;
      } else {
        error = this.error_global(reponse_question[0], matches);
        reponse = error;
      }
    }
    const regex_global = RegExp('Error*');
    if (regex_global.test(reponse)) {
      console.log(reponse);
    }
    if (type_reponse === 'line') {
      return [reponse, line];
    } else if (type_reponse === 'matches') {
      return [reponse, matches];
    }
  }

  game(
    type_user: string,
    reponse_line: number | string,
    reponse_matches: number | string,
  ) {
    console.log(`${type_user} turn :`);
    let reponse_1 = '';
    let reponse_2 = '';
    let resultat_1: [string, number] | number | any;
    let resultat_2: [string, number] | number | any;
    while (reponse_1 !== 'not error') {
      resultat_1 = this.verify_error(type_user, 'line', [reponse_matches]);
      reponse_1 = resultat_1[0];
    }
    if (reponse_1 === 'not error') {
      while (reponse_2 !== 'not error') {
        resultat_2 = this.verify_error(type_user, 'matches', [
          resultat_1[1],
          reponse_matches,
        ]);
        reponse_2 = resultat_2[0];
      }
    }
    if (reponse_1 === 'not error' && reponse_2 === 'not error') {
      for (let f = 0; f < resultat_2[1]; f++) {
        this.tb[resultat_1[1] - 1][this.vertical_line[resultat_1[1] - 1][0]] =
          ' ';
        this.vertical_line[resultat_1[1] - 1].splice(0, 1);
        this.compteur_line[resultat_1[1] - 1] =
          this.compteur_line[resultat_1[1] - 1] - 1;
        this.compteur = this.compteur - 1;
      }
      console.log(this.compteur);
    }
    if (this.compteur > 0) {
      console.log(
        `Player removed ${reponse_matches} match(es) from line ${resultat_1[0]}`,
      );
      this.show();
    } else {
      console.log('You lost, too bad..');
    }
  }

  launch_game() {
    this.start();
    const random = Math.floor(Math.random() * Math.floor(10));
    while (this.compteur > 0) {
      this.game('Player', 'null', 'null');
      //this.game('IA', random, random);
    }
  }
}

const greeter = new Tableau();
greeter.launch_game();
