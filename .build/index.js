"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var readlineSync = require('readline-sync');

var Tableau = /*#__PURE__*/function () {
  function Tableau() {
    _classCallCheck(this, Tableau);
  }

  _createClass(Tableau, [{
    key: "initialise",
    value: function initialise() {
      this.tb = [[], [], [], [], [], []];
      this.vertical_line = [[], [], [], [], [], []];
      this.compteur_line = [0, 0, 0, 0, 0, 0];
      this.compteur = 0;
      var array = ['********* ', ' *   |   *', ' *  |||  *', ' * ||||| *', ' *|||||||*', ' *********'];

      for (var i = 0; i < array.length; i++) {
        for (var f = 0; f < array[i].length; f++) {
          this.tb[i][f] = array[i].substr(f, 1);

          if (array[i].substr(f, 1) === '|') {
            this.compteur = this.compteur + 1;
            this.compteur_line[i] = this.compteur_line[i] + 1;
            this.vertical_line[i].push(f);
          }
        }
      }
    }
  }, {
    key: "show",
    value: function show() {
      var result = '';

      for (var i = 0; i < this.tb.length; i++) {
        for (var f = 0; f < this.tb[i].length; f++) {
          result = result + this.tb[i][f];
        }

        console.log(result);
        result = '';
      }
    }
  }, {
    key: "start",
    value: function start() {
      this.initialise();
      this.show();
    }
  }, {
    key: "error_line",
    value: function error_line(line) {
      var message = 'not error';

      if (line > this.tb.length) {
        message = 'Error: this line is out of range';
      } else if (line < 0 || typeof line != 'number') {
        message = 'Error: invalid input (positive number expected)';
      }

      return message;
    }
  }, {
    key: "error_global",
    value: function error_global(line, matches) {
      var message = 'not error';

      if (matches === 0 && matches !== undefined) {
        message = 'Error: you have to remove at least one match';
      } else if (matches < 0 || typeof matches != 'number') {
        message = 'Error: invalid input (positive number expected)';
      }
      /*else if (matches > this.compteur_line[line - 1]) {
      message = 'Error: not enough matches on this line';
      }*/


      return message;
    }
  }, {
    key: "verify_error",
    value: function verify_error(type_user, type_reponse, reponse_question) {
      var reponse = '';
      var line = 0;
      var matches = 0;

      if (type_reponse === 'line') {
        if (type_user === 'Player') {
          line = readlineSync.question('Line : ');
          line = parseInt(String(line));
        }
      } else if (type_reponse === 'matches') {
        if (type_user === 'Player') {
          matches = readlineSync.question('Matches : ');
          matches = parseInt(String(matches));
        }
      }

      var error = '';

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
          console.log(matches);
          console.log(reponse_question[0]);
          console.log(this.compteur_line);
          error = this.error_global(reponse_question[0], matches);
          reponse = error;
        }
      }

      var regex_global = RegExp('Error*');

      if (regex_global.test(reponse)) {
        console.log(reponse);
      }

      if (type_reponse === 'line' && type_user === 'Player') {
        return [reponse, line];
      } else if (type_reponse === 'line' && type_user === 'IA') {
        return [reponse, reponse_question[0]];
      } else if (type_reponse === 'matches' && type_user === 'Player') {
        return [reponse, matches];
      } else if (type_reponse === 'matches' && type_user === 'IA') {
        return [reponse, reponse_question[1]];
      }
    }
  }, {
    key: "game",
    value: function game(type_user, reponse_line, reponse_matches) {
      console.log("".concat(type_user, " turn :"));
      var reponse_1 = '';
      var reponse_2 = '';
      var resultat_1;
      var resultat_2;

      while (reponse_1 !== 'not error') {
        resultat_1 = this.verify_error(type_user, 'line', [reponse_matches]);
        reponse_1 = resultat_1[0];
      }

      if (reponse_1 === 'not error') {
        resultat_2 = this.verify_error(type_user, 'matches', [resultat_1[1], reponse_matches]);
        reponse_2 = resultat_2[0];

        while (reponse_2 !== 'not error') {
          resultat_1 = this.verify_error(type_user, 'line', [reponse_matches]);
          reponse_1 = resultat_1[0];
          resultat_2 = this.verify_error(type_user, 'matches', [resultat_1[1], reponse_matches]);
          reponse_2 = resultat_2[0];
        }
      }

      if (reponse_1 === 'not error' && reponse_2 === 'not error') {
        for (var f = 0; f < resultat_2[1]; f++) {
          this.tb[resultat_1[1] - 1][this.vertical_line[resultat_1[1] - 1][0]] = ' ';
          this.vertical_line[resultat_1[1] - 1].splice(0, 1);

          if (this.compteur_line[resultat_1[1] - 1] > 0) {
            this.compteur_line[resultat_1[1] - 1] = this.compteur_line[resultat_1[1] - 1] - 1;
          }

          this.compteur = this.compteur - 1;
        }
      }

      if (this.compteur > 0) {
        console.log("Player removed ".concat(resultat_2[1], " match(es) from line ").concat(resultat_1[1]));
        this.show();
      } else {
        console.log('You lost, too bad..');
      }
    }
  }, {
    key: "launch_game",
    value: function launch_game() {
      this.start();
      var random = Math.floor(Math.random() * Math.floor(10));

      while (this.compteur > 0) {
        this.game('Player', 'null', 'null');
        this.game('IA', random, random);
      }
    }
  }]);

  return Tableau;
}();

var greeter = new Tableau();
greeter.launch_game();