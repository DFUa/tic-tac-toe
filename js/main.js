require([
  'dojo/dom',
  'dojo/on',
  'dojo/query',
  'dojo/dom-class',
  'dojo/_base/fx',
  'dojo/dom-style',
  'dojo/mouse',
  'dojo/domReady!'
], function (dom, on, query, domClass, fx, domStyle, mouse) {

  let player1Icon = "X",
    player2Icon = "O",
    changePlayer = false,
    session = sessionStorage,
    emptyCell = "",
    cellsHover = {},
    cellsLeave = {};

  let player1Text = dom.byId('player1Text'),
    player2Text = dom.byId('player2Text'),
    cells = query('div.grid-cell'),
    grid = dom.byId('grid'),
    statusBar = dom.byId('statusBar'),
    statusText = dom.byId('statusText'),
    buttonAgain = dom.byId('buttonAgain'),
    buttonNewGame = dom.byId('buttonNewGame');

  function startGame() {
    let player1 = prompt('Player1 Name', 'Player1'),
      player2 = prompt('Player2 Name', 'Player2');
    if (player1.length === 0) {
      player1 = 'Player1';
    }
    if (player2.length === 0) {
      player1 = 'Player2';
    }
    player1Text.innerHTML = player1;
    player2Text.innerHTML = player2;
    if (player1.length > 0 && player2.length > 0) {
      domClass.remove(grid.id, 'hidden');
    }
    domStyle.set(player1Text, 'color', 'red');
  }

  if (session.getItem(player1Text.id)) {
    player1 = session.getItem(player1Text.id);
    startGame();
  }

  if (session.getItem(player2Text.id)) {
    player2 = session.getItem(player2Text.id);
    startGame();
  }

  if (session.getItem('changePlayer')) {
    changePlayer = JSON.parse(session.getItem('changePlayer'));
    if (!changePlayer) {
      domStyle.set(player2Text, 'color', 'black');
      domStyle.set(player1Text, 'color', 'red');
    } else {
      domStyle.set(player1Text, 'color', 'black');
      domStyle.set(player2Text, 'color', 'red');
    }
  }

  startGame()

  if (session.getItem('started')) {
    for (let i = 0; i < 9; i++) {
      let key = `cell${(i+1)}`;
      if (session[key]) {
        dom.byId(key).innerHTML = session[key];
      }
    }
  }

  if (session.getItem('status')) {
    statusText.innerHTML = session.getItem('status');
    if (statusText.innerHTML) {
      domClass.remove(statusBar.id, 'hidden');
    }
  }

  window.onpopstate = function () {
    dom.byId(emptyCell).innerHTML = "";
    session.setItem(emptyCell, "");
    changePlayer = !changePlayer;
  };

  cells.on('click', function (e) {
    if (e.target.innerHTML === "" && statusText.innerHTML === "") {
      if (!changePlayer) {
        e.target.innerHTML = player1Icon;
        domStyle.set(player1Text, 'color', 'black');
        domStyle.set(player2Text, 'color', 'red');
      } else {
        e.target.innerHTML = player2Icon;
        domStyle.set(player2Text, 'color', 'black');
        domStyle.set(player1Text, 'color', 'red');
      }
      changePlayer = !changePlayer;
      session.setItem('changePlayer', changePlayer);
      session.setItem(e.target.id, e.target.innerHTML);
      session.setItem('started', true);
      emptyCell = e.target.id;
      history.pushState({}, '');
      checkWinner();
    }
  });

  on(buttonAgain, 'click', function (e) {
    statusText.innerHTML = "";
    session.removeItem('status');
    domClass.add(statusBar.id, 'hidden');
    cells.forEach(e => {
      e.innerHTML = "";
      domClass.remove(e, 'grid-cell-hover');
    });
    if (session.getItem('started')) {
      for (let i = 0; i < 9; i++) {
        session[`cell${(i+1)}`] = "";
      }
    }
    addHoverEffect();
    session.removeItem('started');
  });

  on(buttonNewGame, 'click', function (e) {
    statusText.innerHTML = "";
    domClass.add(statusBar.id, 'hidden');
    domClass.add(grid.id, 'hidden');
    cells.forEach(e => {
      e.innerHTML = "";
      domClass.remove(e, 'grid-cell-hover');
    });
    startGame();
    addHoverEffect();
    session.clear();
  });

  function addHoverEffect() {
    cellsHover = cells.on(mouse.enter, function (e) {
      domClass.add(e.target.id, 'grid-cell-hover');
    });
    cellsLeave = cells.on(mouse.leave, function (e) {
      domClass.remove(e.target.id, 'grid-cell-hover');
    });
  }
  addHoverEffect();

  function checkWinner() {
    if (checkPlayerWin(player1Icon)) {
      statusText.innerHTML = `Winner ${player1}!`;
    }
    if (checkPlayerWin(player2Icon)) {
      statusText.innerHTML = `Winner ${player2}!`;
    }

    let draw = true;
    cells.forEach(e => {
      if (e.innerHTML.length === 0) draw = false;
    });
    if (draw) {
      statusText.innerHTML = 'Draw!';
      domClass.remove(statusBar.id, 'hidden');
      cellsHover.remove();
      cellsLeave.remove();
    }
    session.setItem('status', statusText.innerHTML);
  }

  function checkPlayerWin(symbol) {
    let line1 = false,
      line2 = false,
      line3 = false,
      line4 = false,
      line5 = false,
      line6 = false,
      line7 = false,
      line8 = false;

    if (dom.byId('cell1').innerHTML === symbol && dom.byId('cell2').innerHTML === symbol && dom.byId('cell3').innerHTML === symbol) {
      domClass.add('cell1', 'grid-cell-hover');
      domClass.add('cell2', 'grid-cell-hover');
      domClass.add('cell3', 'grid-cell-hover');
      line1 = true;
    }
    if (dom.byId('cell4').innerHTML === symbol && dom.byId('cell5').innerHTML === symbol && dom.byId('cell6').innerHTML === symbol) {
      domClass.add('cell4', 'grid-cell-hover');
      domClass.add('cell5', 'grid-cell-hover');
      domClass.add('cell6', 'grid-cell-hover');
      line2 = true;
    }
    if (dom.byId('cell7').innerHTML === symbol && dom.byId('cell8').innerHTML === symbol && dom.byId('cell9').innerHTML === symbol) {
      domClass.add('cell7', 'grid-cell-hover');
      domClass.add('cell8', 'grid-cell-hover');
      domClass.add('cell9', 'grid-cell-hover');
      line3 = true;
    }
    if (dom.byId('cell1').innerHTML === symbol && dom.byId('cell4').innerHTML === symbol && dom.byId('cell7').innerHTML === symbol) {
      domClass.add('cell1', 'grid-cell-hover');
      domClass.add('cell4', 'grid-cell-hover');
      domClass.add('cell7', 'grid-cell-hover');
      line4 = true;
    }
    if (dom.byId('cell2').innerHTML === symbol && dom.byId('cell5').innerHTML === symbol && dom.byId('cell8').innerHTML === symbol) {
      domClass.add('cell2', 'grid-cell-hover');
      domClass.add('cell5', 'grid-cell-hover');
      domClass.add('cell8', 'grid-cell-hover');
      line5 = true;
    }
    if (dom.byId('cell3').innerHTML === symbol && dom.byId('cell6').innerHTML === symbol && dom.byId('cell9').innerHTML === symbol) {
      domClass.add('cell3', 'grid-cell-hover');
      domClass.add('cell6', 'grid-cell-hover');
      domClass.add('cell9', 'grid-cell-hover');
      line6 = true;
    }
    if (dom.byId('cell1').innerHTML === symbol && dom.byId('cell5').innerHTML === symbol && dom.byId('cell9').innerHTML === symbol) {
      domClass.add('cell1', 'grid-cell-hover');
      domClass.add('cell5', 'grid-cell-hover');
      domClass.add('cell9', 'grid-cell-hover');
      line7 = true;
    }
    if (dom.byId('cell3').innerHTML === symbol && dom.byId('cell5').innerHTML === symbol && dom.byId('cell7').innerHTML === symbol) {
      domClass.add('cell3', 'grid-cell-hover');
      domClass.add('cell5', 'grid-cell-hover');
      domClass.add('cell7', 'grid-cell-hover');
      line8 = true;
    }

    if (line1 || line2 || line3 || line4 || line5 || line6 || line7 || line8) {
      domClass.remove(statusBar.id, 'hidden');
      cellsHover.remove();
      cellsLeave.remove();
      return true;
    } else {
      return false;
    }
  }

});