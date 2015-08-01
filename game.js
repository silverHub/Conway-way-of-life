
(function() {
  'use strict';

  window.Game = function(seed){
    var actualBoard = seed;
    var prevBoard = cloneBoard(actualBoard);
    const width = seed.length;
    const height = seed[0].length;

    var expose = {};
    expose.next = next;
    expose.dim = { width: width, height: height};
    expose.board = actualBoard;

    function countNeighbours(board,x,y) {
      var count = 0;
      var prevLine = board[y-1] || [];
      var actualLine = board[y] || [];
      var nextLine = board[y+1] || [];
      [
        prevLine[x-1],prevLine[x],prevLine[x+1],
        actualLine[x-1],actualLine[x+1],
        nextLine[x-1],nextLine[x],nextLine[x+1]
      ].map(function(a) {
        count += +!!a;
      });
      return count;
    }

    function next() {
      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var count = countNeighbours(prevBoard,x,y);
            var cell = prevBoard[y][x];
            if (cell) {
              if (count<2 || count>3) {
                  actualBoard[y][x] = 0;
              }
            } else {
              if (count === 3) {
                actualBoard[y][x] = 1;
              }
            }
        }
      }
      prevBoard = cloneBoard(actualBoard);
      logBoard(actualBoard);
    }
    expose.dimension = { width: width, height: height};
    expose.actualBoard = actualBoard;

    return expose;
  };

  window.GameView = function GameView(game) {
    //var game = game;
    var $grid = $('#grid');
    var exposed = {};
    exposed.render = render;
    exposed.next = next;
    exposed.random = random;

    function random() {
      console.log(logBoard(game.board));
      for (var y = 0; y < game.dim.height; y++) {
        for (var x = 0; x < game.dim.width; x++) {
          game.board[x][y] = Math.random() < 0.5 ? 0 : 1;
        }
      }
      render();
      console.log(logBoard(game.board));
    }

    function next() {
      game.next();
      render();
    }

    function render(){
      $grid.innerHTML="";
      var tbody = document.createElement('tbody');

      for (var y = 0; y < game.dim.height; y++) {
        var row = document.createElement('tr');
        for (var x = 0; x < game.dim.width; x++) {
          var td = document.createElement('td');
          td.className = game.board[y][x] ? 'black' : '';
          row.appendChild(td);
        }
        tbody.appendChild(row);
      }
      console.log($grid);
      $grid.appendChild(tbody);
    }
    return exposed;
  };

  function cloneBoard(board) {
     return board.slice().map(function(row){ return row.slice(); });
  }

  function logBoard(board) {
    for (var  y= 0; y < board.length; y++) {
      console.log(board[y]);
    }
  }

  function $(selector){
    return window.document.querySelectorAll(selector)[0];
  }



  (function Controls() {
    var repeat;
    var nextBtn = $('#next');
    var randomBtn = $('#random');
    var autoplayBtn = $('#autoplay');

    function toggleButtons(btns) {
        btns.forEach(function(btn){
          btn.disabled = !btn.disabled;
        });
    }


    nextBtn.addEventListener('click',function(){
      view.next();
    });

    randomBtn.addEventListener('click',function(){
      view.random();
    });

    autoplayBtn.addEventListener('click',function(evt){
      if (evt.target.checked) {
        repeat = setInterval(view.next, 1000);
      } else {
        clearInterval(repeat);
      }
      toggleButtons([nextBtn,randomBtn]);
    });
  }());

}());


var game = new Game([
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,1,1,1],
  [0,1,1,1,0],
  [0,0,0,0,0],
]);
var view = new GameView(game);
view.render();
