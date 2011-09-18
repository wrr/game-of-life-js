// Copyright (C) 2011 Jan Wrobel <wrobel@blues.ath.cx>

CELL_SIZE_PX=15

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


function displaySpace(oldSpace, newSpace, height, width) {
  var table = document.getElementById("space");
  for (var i = 0; i < height; ++i) {
    var row = table.rows[i + 1];
    for (var j = 0; j < width; ++j) {
      if (oldSpace[i][j] != newSpace[i][j]) {
        var cell = row.cells[j + 1];
        if (newSpace[i][j] == 1) {
          cell.innerHTML = "*";
        } else {
          cell.innerHTML = "";
        }
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

function clearSpace(space, height, width) {
  for (var i = 1; i < height - 1; ++i) {
    for (var j = 1; j < width - 1; ++j) {
        space[i][j] = 1;
    }
  }
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
var emptySpace = create2dArray(height, width);
var initialSpace = create2dArray(height, width);
randomizeSpace(initialSpace, height, width);
displaySpace(emptySpace, initialSpace, height, width);
evolveSpace(initialSpace, emptySpace, height, width);

