var window = window || {},
    document = document || {},
    console = console || {},
    Buscaminas = Buscaminas || {};

window.onload = function() {
  Buscaminas.init("buscaminas");
};


//Niveles del juego
var levels = {
    'beginner': {
        'title': 'Easy',
        'col': 9,
        'row': 9,
        'bombs': 10
    },
    'intermediate': {
        'title': 'Intermediate',
        'col': 16,
        'row': 16,
        'bombs': 40
    },
    'expert': {
        'title': 'Hard',
        'col': 30,
        'row': 16,
        'bombs': 99
    }
};

Buscaminas = {

  grid:null,
  col: 0,
  row: 0,
  bombs: 0,
  freeCells: 0,

  init: function () {

    this.renderStructure();
    this.generateGame(levels.beginner.bombs, levels.beginner.row, levels.beginner.col);

  },

  renderStructure: function() {
    //Render del header
    var buscaminas = window.document.getElementById('buscaminas');
    var header = document.createElement("header");
    header.classList.add('buscaminas__header');
    var headerLevels = document.createElement("div");
    headerLevels.classList.add('header-levels');
    const lv = Object.keys(levels)
    for (const lvs of lv) {
      var button = document.createElement("button");
      button.classList.add('btn');
      button.id = lvs;
      button.addEventListener("click",this.changeLevel);
      button.innerHTML = levels[lvs].title;
      headerLevels.appendChild(button);
    }

    header.appendChild(headerLevels);

    var headerStatus = document.createElement("div");
    headerStatus.classList.add('header-status');
    var button = document.createElement("button");
    button.classList.add('btn-face');
    headerStatus.appendChild(button);
    header.appendChild(headerStatus);

    buscaminas.appendChild(header);
    //Render del article - body
    var body = document.createElement("article");
    body.classList.add('buscaminas__content');
    buscaminas.appendChild(body);
    //Render del footer
    var footer = document.createElement("footer");
    footer.classList.add('buscaminas__footer');
    buscaminas.appendChild(footer);

  },

  generateGame: function(bombs, row, col) {
    this.setVars(bombs, row, col);
    this.generateBoard(row, col);
    this.generateBombs(bombs, row, col);
    this.generateView(row, col);
  },

  setVars: function(bombs, row, col) {
    this.row = row;
    this.col = col;
    this.bombs = bombs;
    this.freeCells = (row * col) - bombs;
  },

  changeLevel: function(e) {

    let lvl = e.target.id;
    Buscaminas.generateGame(levels[lvl].bombs, levels[lvl].row, levels[lvl].col);

  },

  //Funcion que construye el tablero
  generateBoard : function (rows, cols) {
    var i, j;
    this.grid=new Array(rows-1)
    for (i=0;i<rows;i++)
    	this.grid[i]=new Array(cols-1);
    for (i=0;i<rows;i++)
    	for (j=0;j<cols;j++)
    		this.grid[i][j]=0;
  },

  generateView : function (vF, vC) {
    // create elements <table> and a <tbody>
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");

    for (i=0;i<vF;i++)
    	{
        // table row creation
        var row = document.createElement("tr");
        for (j=0;j<vC;j++) {
          var cell = document.createElement("td");
          cell.setAttribute('data-r', i);
          cell.setAttribute('data-c', j);
          cell.setAttribute('id',i+'-'+j);
          cell.addEventListener("click",this.check);
          cell.addEventListener("contextmenu",this.putFlag);
          row.appendChild(cell);
        }
        //row added to end of table body
        tblBody.appendChild(row);
    	}

      // posiciona el <tbody> debajo del elemento <table>
      tbl.appendChild(tblBody);
      var content = window.document.getElementsByClassName('buscaminas__content');
      content[0].innerHTML = '';
      content[0].appendChild(tbl);
  },

  generateBombs: function(nBombs, vR, vC){
    var row = 0,
        col = 0;

    row = Math.floor((Math.random()*vR)+0);
    col = Math.floor((Math.random()*vC)+0);

    for(var i = 0; i < nBombs; i++){
      while (this.grid[row][col] == -1){
        row = Math.floor((Math.random()*vR)+0);
        col = Math.floor((Math.random()*vC)+0);
      }
      this.grid[row][col] = -1;
      this.putNumberOfBombs(row, col);
    }
  },

  putNumberOfBombs: function(i, j) {
    //TODO: Optimizar
    this.sumNumber(i-1,j-1);
    this.sumNumber(i-1,j);
    this.sumNumber(i-1,j+1);
    this.sumNumber(i,j-1);
    this.sumNumber(i,j+1);
    this.sumNumber(i+1,j-1);
    this.sumNumber(i+1,j);
    this.sumNumber(i+1,j+1);
  },

  sumNumber: function (row, col) {
    if (row>=0 && row< this.row && col>=0 && col<=this.col)
        if (this.grid[row][col]>=0)
            this.grid[row][col]++;
  },

  putFlag: function (e) {
    e.preventDefault;
    let row, col;
    let cell = document.getElementById(e.target.id);

    if (cell.classList.contains('flag')) {
      cell.classList.remove('flag');
    } else {
      cell.classList.add('flag');
    }


  },

  showZeros: function (row, col) {
    //Reveal all adjacent cells as they do not have a mine
    let endRow = this.row - 1;
    let endCol = this.col - 1;
    for (var i=Math.max(row-1,0); i<=Math.min(row+1,endRow); i++) {
      for(var j=Math.max(col-1,0); j<=Math.min(col+1,endCol); j++) {
        //Recursive Call
        cell = document.getElementById(i+'-'+j);
        if (!(cell.classList.contains('clicked'))) {
          cell.click();
        }
      }
    }

  },

  check : function (e) {
    let row, col;
    let grid = Buscaminas.grid;
    let cell = document.getElementById(e.target.id);
    cell.removeEventListener("click",Buscaminas.check);
    row = cell.getAttribute('data-r');
    col = cell.getAttribute('data-c');
    let number = grid[row][col];

    if(number == 0){
      cell.classList.add('clicked');
      cell.innerHTML = "<p></p>";
      Buscaminas.showZeros(parseInt(row), parseInt(col));
      Buscaminas.restCell();
    }else{
      if(number != -1){
        cell.classList.add('clicked');
        cell.innerHTML = "<p>" + number + "</p>";
        Buscaminas.restCell();
      }else{
        cell.classList.add('bomb');
        Buscaminas.showBombs();
        alert("Perdiste");
      }
    }
  },

  showBombs : function() {

    for (var i=0; i<this.row; i++) {
      for(var j=0; j<this.col; j++) {
        let number = this.grid[i][j];
        cell = document.getElementById(i+'-'+j);
        if(number == -1){
          cell.classList = 'bomb';
        }
        cell.removeEventListener("click",this.check);
      }
    }

  },

  restCell: function() {
    this.freeCells--;
    if (this.freeCells == 0) {
      alert("Ganaste");
    }
  }

}
