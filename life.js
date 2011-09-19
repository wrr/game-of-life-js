// Copyright (C) 2011 Jan Wrobel <wrobel@blues.ath.cx>

"use strict";

var CELL_SIZE_PX = 15;

function createTable(height, width) {
  var space, row, cell, i, j;
  space = document.getElementById("space");
  for (i = 0; i < height; i += 1) {
    row = space.insertRow(-1);
    for (j = 0; j < width; j += 1) {
      cell = row.insertCell(j);
      cell.style.width = (CELL_SIZE_PX - 1) + "px";
      cell.style.height = (CELL_SIZE_PX - 1) + "px";
    }
  }
}

function create2dArray(height) {
  var result, i;
  result = [];
  for (i = 0; i < height; i += 1) {
    result[i] = [];
  }
  return result;
}

function randomizeSpace(space, height, width) {
  var i, j;
  for (i = 1; i < height - 1; i += 1) {
    for (j = 1; j < width - 1; j += 1) {
      if (Math.floor(Math.random() * 11) % 10 === 0) {
        space[i][j] = 1;
      } else {
        space[i][j] = 0;
      }
    }
  }
}

function space(height, width) {
  var i, j;
  this.space = create2dArray(height);
  randomizeSpace(this.space, height, width);
  this.newSpace = create2dArray(height);

  this.canChangeAdded = create2dArray(height);
  this.canChange = [];
  for (i = 1; i < height - 1; i += 1) {
    for (j = 1; j < width - 1; j += 1) {
      this.canChange.push([i,j]);
    }
  }
  this.newCanChange = [];

  this.addNeighborhoodToNewCanChange = function(row, col) {
    for (i = -1; i <= 1; i += 1) {
      for (j = -1; j <= 1; j += 1) {
        if (row + i > 0 && row + i < height - 1 &&
            col + j > 0 && col + j < width - 1 &&
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
    var k, i, j, neighboursCount, tmpCanChange, obj, callback;

    for (k = 0; k < this.canChange.length; k += 1) {
      i = this.canChange[k][0];
      j = this.canChange[k][1];
      neighboursCount = space[i - 1][j - 1]
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
    for (k = 0; k < this.newCanChange.length; k += 1) {
      i = this.newCanChange[k][0];
      j = this.newCanChange[k][1];
      this.canChangeAdded[i][j] = false;
    }
    displaySpace(this.newCanChange, space, newSpace, height, width);
    tmpCanChange = this.canChange;
    this.canChange = this.newCanChange;
    this.newCanChange = tmpCanChange;
    this.newCanChange.length = 0;

    obj = this;
    callback = function() {
      obj.evolveSpaceImpl(newSpace, space);
    }
    setTimeout(callback, 100);
  }
}

function displaySpace(changed, oldSpace, newSpace, height, width) {
  var table, row, cell, k, i, j;
  table = document.getElementById("space");
  for (k = 0; k < changed.length; k += 1) {
    i = changed[k][0];
    j = changed[k][1];
    if (oldSpace[i][j] != newSpace[i][j]) {
      row = table.rows[i];
      cell = row.cells[j];
      if (newSpace[i][j] == 1) {
        cell.style.background="gray";
      } else {
        cell.style.background="white";
      }
    }
  }
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
