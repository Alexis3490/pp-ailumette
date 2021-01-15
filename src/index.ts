const readlineSync = require('readline-sync');

class Tableau {
  tb: any | Array<string>;
  compteur: number | any;
  compteur_line: any | Array<string>;
  vertical_line: Array<string> | any;
  line: number | any;
  matches: number | any;

  initialise() {
    this.tb = [[], [], [], [], [], []];
    this.vertical_line = [[], [], [], [], [], []];
    this.compteur_line = [0, 0, 0, 0, 0, 0];
    this.compteur = 0;
    this.line = 0;
    this.matches = 0;
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
    if (line > 6) {
      message = 'Error: this line is out of range';
    } else if (line < 0) {
      message = 'Error: invalid input (positive number expected)';
    } else if (isNaN(line)) {
      message = 'Error: invalid input number';
    }
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
    } else if (isNaN(matches)) {
      message = 'Error: invalid input number';
    }
    return message;
  }

  launch_error(
    type_user: string,
    type_reponse: string,
    reponse_question: number | any,
  ) {
    let reponse = '';
    let error = '';
    if (type_reponse === 'line') {
      if (type_user === 'IA') {
        error = this.error_line(reponse_question[0]);
        reponse = error;
      } else if (type_user === 'Player') {
        if (this.line != null) {
          error = this.error_line(this.line);
        }
        reponse = error;
      }
    } else if (type_reponse === 'matches') {
      if (type_user === 'IA') {
        error = this.error_global(reponse_question[0], reponse_question[1]);
        reponse = error;
      } else if (type_user === 'Player') {
        if (this.line != null) {
          if (this.matches != null) {
            error = this.error_global(this.line, this.matches);
          }
        }
        reponse = error;
      }
    }
    return reponse;
  }

  question(
    type_user: string,
    type_reponse: string,
    reponse_question: number | any,
  ) {
    if (type_reponse === 'line') {
      if (type_user === 'Player') {
        this.line = readlineSync.question('Line : ');
        this.line = parseInt(String(this.line));
      }
    } else if (type_reponse === 'matches') {
      if (type_user === 'Player') {
        this.matches = readlineSync.question('Matches : ');
        this.matches = parseInt(String(this.matches));
      }
    }
    const result_error = this.launch_error(
      type_user,
      type_reponse,
      reponse_question,
    );
    return [result_error, this.line, this.matches];
  }

  game(
    type_user: string,
    reponse_line: number | string,
    reponse_matches: number | string,
  ) {
    console.log('\r');
    console.log(`${type_user} turn :`);
    let reponse_1 = '';
    let reponse_2 = '';
    let resultat_1: [string, number] | number | any;
    let resultat_2: [string, number] | number | any;
    while (reponse_1 !== 'not error') {
      resultat_1 = this.question(type_user, 'line', [reponse_matches]);
      reponse_1 = resultat_1[0];
      if (resultat_1[0] !== 'not error') {
        console.log(resultat_1[0]);
        resultat_1 = this.question(type_user, 'line', [reponse_matches]);
        reponse_1 = resultat_1[0];
      }
    }
    if (reponse_1 === 'not error') {
      resultat_2 = this.question(type_user, 'matches', [
        resultat_1[1],
        reponse_matches,
      ]);
      reponse_2 = resultat_2[0];
      while (reponse_2 !== 'not error') {
        resultat_1 = this.question(type_user, 'line', [reponse_matches]);
        reponse_1 = resultat_1[0];
        if (resultat_1[0] !== 'not error') {
          console.log(resultat_1[0]);
          resultat_1 = this.question(type_user, 'line', [reponse_matches]);
          reponse_1 = resultat_1[0];
        }

        resultat_2 = this.question(type_user, 'matches', [
          resultat_1[1],
          reponse_matches,
        ]);
        reponse_2 = resultat_2[0];
        if (resultat_2[0] !== 'not error') {
          console.log(resultat_2[0]);
          resultat_2 = this.question(type_user, 'matches', [
            resultat_1[1],
            reponse_matches,
          ]);
        }
      }
    }
    console.log(this.vertical_line);

    if (reponse_1 === 'not error' && reponse_2 === 'not error') {
      for (let f = 0; f < resultat_2[2]; f++) {
        console.log(this.tb[resultat_1[1] - 1][this.vertical_line[resultat_1[1] - 1][0]]);
        this.tb[resultat_1[1] - 1][this.vertical_line[resultat_1[1] - 1][0]] =
          ' ';
        this.vertical_line[resultat_1[1] - 1].splice(0, 1);
        if (this.compteur_line[resultat_1[1] - 1] > 0) {
          this.compteur_line[resultat_1[1] - 1] =
            this.compteur_line[resultat_1[1] - 1] - 1;
        }
        this.compteur = this.compteur - 1;
      }
    }
    if (this.compteur > 0) {
      console.log(
        `Player removed ${resultat_2[2]} match(es) from line ${resultat_1[1]}`,
      );
      console.log('\r');
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
      this.game('IA', random, random);
    }
  }
}

const greeter = new Tableau();
greeter.launch_game();
