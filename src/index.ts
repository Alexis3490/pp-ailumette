const readlineSync = require('readline-sync');

class Tableau {
  tb: any | Array<string>;
  compteur: number | any;
  compteur_line: any | Array<string>;
  vertical_line: Array<string> | any;
  res: Array<string> | any;

  initialise() {
    this.tb = [[], [], [], [], [], []];
    this.vertical_line = [[], [], [], [], [], []];
    this.compteur_line = [0, 0, 0, 0, 0, 0];
    this.compteur = 0;
    this.res = [];
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
    console.log('\r');
  }

  error_line(line: number) {
    let message = 'not error';
    if (line > this.tb.length) {
      message = 'Error: this line is out of range';
    } else if (line < 0) {
      message = 'Error: invalid input (positive number expected)';
    }
    console.log(line)
    return message;
  }

  error_global(line: number, matches: number) {
    let message = 'not error';
    if (matches === 0 && matches !== undefined) {
      message = 'Error: you have to remove at least one match';
    } else if (matches < 0) {
      message = 'Error: invalid input (positive number expected)';
    } else if (matches > this.compteur_line[line - 1]) {
      message = 'Error: not enough matches on this line';
    }
    console.log(matches)

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
      if (type_user === 'Player') {
        line = readlineSync.question('Line : ');
      }
    } else if (type_reponse === 'matches') {
      if (type_user === 'Player') {
        matches = readlineSync.question('Matches : ');
      }
    }
    let error = '';
    if (type_reponse === 'line') {
      if (type_user === 'IA') {
        error = this.error_line(reponse_question[0]);
        reponse = error;
      } else if (type_user === 'Player') {
        error = this.error_line(line);
        reponse = error;
      }
    } else if (type_reponse === 'matches') {
      if (type_user === 'IA') {
        error = this.error_global(reponse_question[0], reponse_question[1]);
        reponse = error;
      } else if (type_user === 'Player') {
        error = this.error_global(reponse_question[0], matches);
        reponse = error;
      }
    }
    const regex_global = RegExp('Error*');
    if (regex_global.test(reponse)) {
      //console.log(reponse);
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
    this.res = [];
    console.log('\r');
    console.log(`${type_user} turn :`);
    let resultat_1: [string, number] | number | any;
    let resultat_2: [string, number] | number | any;

    resultat_1 = this.verify_error(type_user, 'line', [reponse_matches]);
    if (resultat_1[0] !== 'not error') {
      console.log(resultat_1[0]);
      return [resultat_1[0], resultat_1[1]];
    } else {
      this.res = [resultat_1];
      resultat_2 = this.verify_error(type_user, 'matches', [
        resultat_1[1],
        reponse_matches,
      ]);
      if (resultat_2[0] !== 'not error') {
        console.log(resultat_2[0]);
        return [resultat_1, resultat_2];
      } else {
        this.res = [resultat_1, resultat_2];
        this.score();
        return ['not error', 'not error'];
      }
    }
  }

  score() {
    if (this.res[0][0] === 'not error' && this.res[1][0] === 'not error') {
      for (let f = 0; f < this.res[1][1]; f++) {
        this.tb[this.res[0][1] - 1][this.vertical_line[this.res[0][1] - 1][0]] =
          ' ';
        this.vertical_line[this.res[0][1] - 1].splice(0, 1);
        this.compteur_line[this.res[0][1] - 1] =
          this.compteur_line[this.res[0][1] - 1] - 1;
        this.compteur = this.compteur - 1;
      }
    }
    if (this.compteur > 0) {
      console.log(
        `Player removed ${this.res[0][1]} match(es) from line ${this.res[1][1]}`,
      );
      console.log('\r');
      this.show();
    } else {
      console.log('You lost, too bad..');
    }
  }

  start_on_play(
    type_user: string,
    reponse_line: string | number,
    response_matches: string | number,
  ) {
    let result: any;
    result = [];
    let games: any;
    games = [[], []];
    result = this.game(type_user, reponse_line, response_matches);
    while (games[0] !== 'not error' && games[1] !== 'not error') {
      games = this.game('Player', 'null', 'null');
    }
  }

  start_final() {
    this.start();
    const random = Math.floor(Math.random() * Math.floor(5))+1;
    while (this.compteur > 0) {
      this.start_on_play('Player', 'null', 'null');
      this.start_on_play('IA', random, random);
    }
  }
}

const greeter = new Tableau();
greeter.start_final();
