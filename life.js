// Copyright (C) 2011 Jan Wrobel <wrobel@blues.ath.cx>

CELL_SIZE_PX=15;

function createTable(height, width) {
  var space = document.getElementById("space");
  var row = space.insertRow(-1);
  for (var j = 0; j < width; ++j) {
      var cell = row.insertCell(j);
      cell.style.width="15px";
      cell.style.height="15px";
      cell.innerHTML = "_";
  }
  for (var i = 0; i < height; ++i) {
    row = space.insertRow(-1);
    var cell = row.insertCell(0);
    cell.style.width="15px";
    cell.style.height="15px";
    cell.innerHTML = "|";
    for (var j = 0; j < width; ++j) {
      cell = row.insertCell(j + 1);
      cell.style.width="15px";
      cell.style.height="15px";
    }
  }
}

function space(height, width) {
  this.height = height;
  this.width = width;
  this.space = create2dArray(height, width);
  randomizeSpace(this.space, height, width);
  this.newSpace = create2dArray(height, width);

  this.canChangeAdded = create2dArray(height, width);
  this.canChange = new Array();
  for (var i = 1; i < height - 1; ++i) {
    for (var j = 1; j < width - 1; ++j) {
      this.canChange.push([i,j]);
    }
  }
  this.newCanChange = new Array();

  this.addNeighborhoodToNewCanChange = function(row, col) {
    for (var i = -1; i <= 1; ++i) {
      for (var j = -1; j <= 1; ++j) {
        if (row + i > 0 && row + i < this.height - 1 &&
            col + j > 0 && col + j < this.width - 1 &&
            !this.canChangeAdded[row + i][col + j]) {
          this.canChangeAdded[row + i][col + j] = true;
          this.newCanChange.push([row + i, col + j]);
        }
      }
    }
  }

  this.evolveSpace = function() {
    this.evolveSpaceImpl(this.space, this.newSpace);
  }

  this.evolveSpaceImpl = function(space, newSpace) {
    for (var k = 0; k < this.canChange.length; ++k) {
      var i = this.canChange[k][0];
      var j = this.canChange[k][1];
      var neighboursCount = space[i - 1][j - 1]
                          + space[i - 1][j]
                          + space[i - 1][j + 1]
                          + space[i][j - 1]
                          + space[i][j + 1]
                          + space[i + 1][j - 1]
                          + space[i + 1][j]
                          + space[i + 1][j + 1];
      if (neighboursCount == 2 && space[i][j] == 1) {
        newSpace[i][j] = 1;
      } else if (neighboursCount == 3) {
        newSpace[i][j] = 1;
      } else {
        newSpace[i][j] = 0;
      }
      if (space[i][j] != newSpace[i][j]) {
        this.addNeighborhoodToNewCanChange(i, j);
      }
    }
    for (var k = 0; k < this.newCanChange.length; ++k) {
      var i = this.newCanChange[k][0];
      var j = this.newCanChange[k][1];
      this.canChangeAdded[i][j] = false;
    }
    displaySpace(this.newCanChange, space, newSpace, this.height, this.width);
    var tmpCanChange = this.canChange;
    this.canChange = this.newCanChange;
    this.newCanChange = tmpCanChange;
    this.newCanChange.length = 0;

    var obj = this;
    var callback = function() {
      obj.evolveSpaceImpl(newSpace, space);
    }
    setTimeout(callback, 100);
  }
}

function displaySpace(changed, oldSpace, newSpace, height, width) {
  var table = document.getElementById("space");
  for (var k = 0; k < changed.length; ++k) {
    var i = changed[k][0];
    var j = changed[k][1];
    if (oldSpace[i][j] != newSpace[i][j]) {
      var row = table.rows[i + 1];
      var cell = row.cells[j + 1];
      if (newSpace[i][j] == 1) {
        cell.innerHTML = "*";
      } else {
        cell.innerHTML = "";
      }
    }
  }
}

function create2dArray(height, width) {
  var result = new Array(height);
  for (var i = 0; i < height; ++i) {
    result[i] = new Array(width);
  }
  return result;
}

function randomizeSpace(space, height, width) {
  for (var i = 1; i < height - 1; ++i) {
    for (var j = 1; j < width - 1; ++j) {
      if (Math.floor(Math.random()*11) % 10 == 0) {
        space[i][j] = 1;
      } else {
        space[i][j] = 0;
      }
    }
  }
}

function evolveSpace(space, newSpace, height, width) {
  for (var i = 1; i < height - 1; ++i) {
    for (var j = 1; j < width - 1; ++j) {
      var neighboursCount = space[i - 1][j - 1]
                          + space[i - 1][j]
                          + space[i - 1][j + 1]
                          + space[i][j - 1]
                          + space[i][j + 1]
                          + space[i + 1][j - 1]
                          + space[i + 1][j]
                          + space[i + 1][j + 1];
      if (neighboursCount == 2 && space[i][j] == 1) {
        newSpace[i][j] = 1;
      } else if (neighboursCount == 3) {
        newSpace[i][j] = 1;
      } else {
        newSpace[i][j] = 0;
      }
    }
  }
  displaySpace(space, newSpace, height, width);
  clearSpace(space);
  var callback = function() {
    evolveSpace(newSpace, space, height, width);
  }
  setTimeout(callback, 100);
}

function getWindowWidthAndHeight() {
  // the more standards compliant browsers
  // (mozilla/netscape/opera/IE7) use window.innerWidth and
  // window.innerHeight
  if (typeof window.innerWidth != 'undefined') {
    return [window.innerWidth, window.innerHeight];
  }
 
  // IE6 in standards compliant mode (i.e. with a valid doctype as the
  // first line in the document)
  if (typeof document.documentElement != 'undefined'
      && typeof document.documentElement.clientWidth !=
      'undefined' && document.documentElement.clientWidth != 0) {
    return [document.documentElement.clientWidth,
            document.documentElement.clientHeight];
  }
  // older versions of IE
  return [document.getElementsByTagName('body')[0].clientWidth,
          document.getElementsByTagName('body')[0].clientHeight];

}

function getWindowWidth() {
  return getWindowWidthAndHeight()[0];
}

function getWindowHeight() {
  return getWindowWidthAndHeight()[1];
}

var width = Math.floor(getWindowWidth() / CELL_SIZE_PX) - 1;
var height = Math.floor(getWindowHeight() / CELL_SIZE_PX) - 1;
//alert("hohoho" + width + "foo" + height);
createTable(height, width);
var space = new space(height, width);
space.evolveSpace();

