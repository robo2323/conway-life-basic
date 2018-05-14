function main() {
  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    respawn = document.getElementById('respawn'),
    randomCohesion = document.getElementById('random-cohesion'),
    addRemoveObstacles = document.getElementById('add-remove-obstacles'),
    colorise = document.getElementById('colorise'),
    depthSet = document.getElementById('display-depth'),
    speedSet = document.getElementById('display-speed'),
    setBoidNum = document.getElementById('display-boid-num'),
    widthSet = document.getElementById('display-boid-width'),
    cohesionSet = document.getElementById('display-cohesion'),
    cohesionScalerSet = document.getElementById('display-cohesion-scaler'),
    setMinSep = document.getElementById('display-sep-min'),
    setMaxSep = document.getElementById('display-sep-max'),
    setBoidType = document.getElementById('display-boid-type'),
    cohesionMinus = document.getElementById('cohesion-minus'),
    cohesionPlus = document.getElementById('cohesion-plus'),
    depthPlus = document.getElementById('depth-plus'),
    depthMinus = document.getElementById('depth-minus'),
    speedPlus = document.getElementById('speed-plus'),
    speedMinus = document.getElementById('speed-minus'),
    boidTypeLeft = document.getElementById('select-left'),
    boidTypeRight = document.getElementById('select-right'),
    boidNumMinus = document.getElementById('boid-num-minus'),
    boidNumPlus = document.getElementById('boid-num-plus'),
    boidWidthMinus = document.getElementById('boid-width-minus'),
    boidWidthPlus = document.getElementById('boid-width-plus'),
    cohesionScalerMinus = document.getElementById('cohesion-scaler-minus'),
    cohesionScalerPlus = document.getElementById('cohesion-scaler-plus'),
    sepMinPlus = document.getElementById('sep-min-plus'),
    sepMinMinus = document.getElementById('sep-min-minus'),
    sepMaxPlus = document.getElementById('sep-max-plus'),
    sepMaxMinus = document.getElementById('sep-max-minus'),
    cWidth = window.innerWidth - 15 || document.documentElement.clientWidth - 15 || document.body.clientWidth - 15,
    cHeight =
      window.innerHeight - 165 || document.documentElement.clientHeight - 165 || document.body.clientHeight - 165,
    mousePos = {},
    addingBoids = false,
    colors = true,
    drawColor,
    boidsArray = [],
    boidsNum = 1000,
    obstaclesArray = [],
    obstaclesNum = 4,
    depth = 3,
    speed = 1.1,
    cohesion = Math.floor(Math.random() * (80 - 40 + 1)) + 40,
    boidWidth = 4,
    cohesionScaleFactor = 500000,
    cohesionScaler = Math.floor(Math.random() * (100 + 1)) / cohesionScaleFactor,
    minSeparation = 5,
    maxSeparation = 12,
    boidType = 'particles',
    r,
    g,
    b;

  depthSet.innerText = '' + depth;
  speedSet.innerText = '' + speed;
  cohesionSet.innerText = '' + cohesion;
  widthSet.innerText = '' + boidWidth;
  setMinSep.innerText = '' + minSeparation;
  setMaxSep.innerText = '' + maxSeparation;
  setBoidType.innerText = '' + boidType;
  setBoidNum.innerText = '' + boidsNum;
  cohesionScalerSet.innerText = '' + cohesionScaleFactor;

  canvas.width = cWidth;
  canvas.height = cHeight;

  addMouseObstacle();

  widthSet.onclick = function() {
    boidWidth = widthSet.value;
  };

  sepMinMinus.addEventListener('click', function() {
    minSeparation--;
    setMinSep.innerText = minSeparation;
  });

  sepMinPlus.addEventListener('click', function() {
    minSeparation++;
    setMinSep.innerText = minSeparation;
    setMaxSep.innerText = maxSeparation;

    if (minSeparation == maxSeparation) {
      maxSeparation++;
    }
  });

  sepMaxMinus.addEventListener('click', function() {
    maxSeparation--;
    setMaxSep.innerText = maxSeparation;

    if (maxSeparation == minSeparation) {
      minSeparation--;
      setMinSep.innerText = minSeparation;
    }

    for (var i = 0; i < boidsArray.length; i++) {
      boidsArray[i].separation = Math.floor(Math.random() * (maxSeparation - minSeparation + 1)) + minSeparation;
    }
  });

  sepMaxPlus.addEventListener('click', function() {
    maxSeparation++;
    setMaxSep.innerText = maxSeparation;

    for (var i = 0; i < boidsArray.length; i++) {
      boidsArray[i].separation = Math.floor(Math.random() * (maxSeparation - minSeparation + 1)) + minSeparation;
    }
  });

  setMaxSep.onclick = function() {
    maxSeparation = setMaxSep.value;
  };

  cohesionMinus.addEventListener('click', function() {
    cohesion -= 10;
    cohesionSet.innerText = '' + cohesion;
  });

  cohesionPlus.addEventListener('click', function() {
    cohesion += 10;
    cohesionSet.innerText = '' + cohesion;
  });

  depthPlus.addEventListener('click', function() {
    depth++;
    for (var i = 0; i < boidsArray.length; i++) {
      boidsArray[i].depth = Math.floor(Math.random() * depth) + 1;
      boidsArray[i].updateColor();
    }
    depthSet.innerText = '' + depth;
  });

  depthMinus.addEventListener('click', function() {
    depth--;
    for (var i = 0; i < boidsArray.length; i++) {
      boidsArray[i].depth = Math.floor(Math.random() * depth) + 1;
      boidsArray[i].updateColor();
    }
    depthSet.innerText = '' + depth;
  });

  speedPlus.addEventListener('click', function() {
    speed = Math.round((speed + 0.1) * 10) / 10;
    speedSet.innerText = '' + speed;
  });

  speedMinus.addEventListener('click', function() {
    speed = Math.round((speed - 0.1) * 10) / 10;

    speedSet.innerText = '' + speed;
  });

  boidTypeLeft.addEventListener('click', function() {
    setBoidType.classList.remove('animate-fade-in');
    setBoidType.classList.add('animate-fade-out');

    setTimeout(function() {
      if (boidType == 'triangles') {
        boidType = 'circles';
        boidWidth = 1;
        widthSet.innerText = '' + boidWidth;
      } else if (boidType == 'circles') {
        boidType = 'particles';
        boidWidth = 7;
        widthSet.innerText = '' + boidWidth;
      } else if (boidType == 'particles') {
        boidType = 'triangles';
        boidWidth = 1;
        widthSet.innerText = '' + boidWidth;
      }

      setBoidType.innerText = boidType;

      setBoidType.classList.add('animate-fade-in');
      setBoidType.classList.remove('animate-fade-out');
    }, 200);
  });

  boidTypeRight.addEventListener('click', function() {
    setBoidType.classList.remove('animate-fade-in');
    setBoidType.classList.add('animate-fade-out');

    setTimeout(function() {
      if (boidType == 'triangles') {
        boidType = 'particles';
        boidWidth = 7;
        widthSet.innerText = '' + boidWidth;
      } else if (boidType == 'circles') {
        boidType = 'triangles';
        boidWidth = 1;
        widthSet.innerText = '' + boidWidth;
      } else if (boidType == 'particles') {
        boidType = 'circles';
        boidWidth = 1;
        widthSet.innerText = '' + boidWidth;
      }

      setBoidType.innerText = boidType;

      setBoidType.classList.add('animate-fade-in');
      setBoidType.classList.remove('animate-fade-out');
    }, 200);
  });

  boidNumMinus.addEventListener('click', function() {
    boidsNum -= 10;
    setBoidNum.innerText = '' + boidsNum;
    for (var i = 0; i < 10; i++) {
      boidsArray.pop();
    }
  });

  boidNumPlus.addEventListener('click', function() {
    boidsNum += 10;
    for (var i = 0; i < 10; i++) {
      boidsArray.push(new Boid());
    }
    setBoidNum.innerText = '' + boidsNum;
  });

  boidWidthMinus.addEventListener('click', function() {
    boidWidth--;
    widthSet.innerText = '' + boidWidth;
  });

  boidWidthPlus.addEventListener('click', function() {
    boidWidth++;
    widthSet.innerText = '' + boidWidth;
  });

  cohesionScalerMinus.addEventListener('click', function() {
    if (cohesionScaleFactor > 100000) {
      cohesionScaleFactor -= 100000;
    } else if (cohesionScaleFactor < 100001 && cohesionScaleFactor > 20000) {
      cohesionScaleFactor -= 10000;
    } else if (cohesionScaleFactor < 20001) {
      cohesionScaleFactor -= 1000;
    }
    cohesionScalerSet.innerText = '' + cohesionScaleFactor;
  });

  cohesionScalerPlus.addEventListener('click', function() {
    if (cohesionScaleFactor > 99999) {
      cohesionScaleFactor += 100000;
    } else if (cohesionScaleFactor < 100001 && cohesionScaleFactor > 19999) {
      cohesionScaleFactor += 10000;
    } else if (cohesionScaleFactor < 20001) {
      cohesionScaleFactor += 1000;
    }
    cohesionScalerSet.innerText = '' + cohesionScaleFactor;
  });

  respawn.onclick = function() {
    newSwarm();

    start();
  };

  const addColors = () => {
    g = Math.floor(Math.random() * 256) + 20;
    b = Math.floor(Math.random() * 256) + 20;

    r = Math.floor(Math.random() * 256) + 20;

    colors = true;
  };
  addColors();

  colorise.onclick = addColors;

  randomCohesion.onclick = function() {
    cohesion = Math.floor(Math.random() * (150 - 40 + 1)) + 40;
    cohesionSet.innerText = '' + cohesion;
  };

  addRemoveObstacles.onclick = function() {
    if (obstaclesArray.length === 1) {
      makeObstacles();
    } else if (obstaclesArray.length > 1) {
      obstaclesArray = [];
      addMouseObstacle();
    }
  };

  function Obstacle() {
    this.x = Math.floor(Math.random() * cWidth) + 1;
    this.y = Math.floor(Math.random() * cHeight) + 1;
    this.vy = Math.random() * 2 - 1;
    this.vx = Math.random() * 2 - 1;
    this.radius = Math.floor(Math.random() * (60 - 40 + 1)) + 40;

    while (
      this.x + this.radius > cWidth - 50 ||
      this.x - this.radius < 50 ||
      this.y + this.radius > cHeight - 50 ||
      this.y - this.radius < 50
    ) {
      this.x = Math.floor(Math.random() * cWidth) + 1;
      this.y = Math.floor(Math.random() * cHeight) + 1;
    }
    this.color = '#aaa';
  }

  Obstacle.prototype.drawObstacle = function() {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.fillStyle=this.color;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    this.x += this.vx * depth * 0.5;
    this.y += this.vy * depth * 0.5;
    this.wrap();
  };

  Obstacle.prototype.wrap = function() {
    if (this.x > cWidth - this.radius / 3) {
      this.x = this.radius;
    } else if (this.x < 0 - this.radius / 3) {
      this.x = cWidth - this.radius / 3;
    }

    if (this.y > cHeight - this.radius / 3) {
      this.y = this.radius;
    } else if (this.y < 0 - this.radius / 3) {
      this.y = cHeight - this.radius / 3;
    }
  };

  Obstacle.prototype.changeV = function() {
    this.vy = Math.random() * 2 - 1;
    this.vx = Math.random() * 2 - 1;
  };

  function Boid() {
    this.id = 0;
    this.separation = Math.floor(Math.random() * (maxSeparation - minSeparation + 1)) + minSeparation;
    this.x = Math.floor(Math.random() * cWidth) + 1;
    this.y = Math.floor(Math.random() * cHeight) + 1;
    this.radius = this.separation / 2;
    this.vy = Math.random() * 2 - 1;
    this.vx = Math.random() * 2 - 1;
    this.depth = Math.floor(Math.random() * depth) + 1;
    this.color = '#aaa';
    this.updateColor();
  }

  Boid.prototype.wrap = function() {
    if (this.x > cWidth - this.radius) {
      this.x = this.radius;
    } else if (this.x < 0 - this.radius) {
      this.x = cWidth - this.radius;
    }

    if (this.y > cHeight - this.radius) {
      this.y = this.radius;
    } else if (this.y < 0 - this.radius) {
      this.y = cHeight - this.radius;
    }
  };

  Boid.prototype.updateForce = function(forceX, forceY) {
    var scale = this.distance(0, 0, this.vx, this.vy),
      newColor;

    if (colors) {
      /*if(scale<1.2 || scale ==1.2){
              drawColor = r;
          }

          if(scale>1.2 && scale<1.8){
              drawColor = g;
          }*/

      if (scale < 1) {
        drawColor = 'rgb(' + r + ',' + g + ',' + b + ')';
      }

      if (scale > 1 && scale < 1.7) {
        drawColor = drawColor = 'rgb(' + g + ',' + b + ',' + r + ')';
      }

      if (scale > 1.7) {
        drawColor = drawColor = 'rgb(' + r + ',' + b + ',' + g + ')';
      }

      /*if(scale < 1.1) {
              newColor = "red";//"#ccc";
          }*/

      /*newColor = Math.floor(scale * 130);

          if (newColor > 255) {
              newColor = 255;
          }

          if (newColor < 0) {
              newColor = 0;
          }
           */
      //this.color = newColor;//"rgb(" + 100 + "," + 100 + "," + newColor + ")";
    }

    this.vx = (this.vx + forceX) / scale;
    this.vy = (this.vy + forceY) / scale;
  };

  Boid.prototype.drawBoid = function() {
    var tmpX,
      tmpY,
      drawScale = this.depth + 1;

    ctx.save();
    if (!colors) {
      drawColor = this.color;
    } else if (colors) {
      ctx.globalAlpha = this.depth * (1 / depth);
    }
    ctx.beginPath();
    ctx.lineWidth = boidWidth;

    tmpX = this.x;
    tmpY = this.y;
    this.x += this.vx * this.depth * speed;
    this.y += this.vy * this.depth * speed;
    this.flock();

    //triangles

    if (boidType === 'triangles') {
      ctx.translate(tmpX, tmpY);
      var rotate = Math.atan2(this.vy, this.vx);
      ctx.rotate(rotate);

      ctx.moveTo(0, 0);
      ctx.lineTo(drawScale * 6, -1.5 * drawScale);
      ctx.lineTo(0, -3 * drawScale);
      ctx.lineTo(0, 0);
    }

    //semi circles
    if (boidType === 'circles') {
      this.radius = this.separation / 2;

      if (this.radius > 16) {
        this.radius = 16;
      }

      ctx.arc(
        tmpX,
        tmpY,
        this.radius,
        Math.atan2(this.vy, this.vx) - 0.5 * Math.PI,
        Math.atan2(this.vy, this.vx) + 0.5 * Math.PI
      );
    }

    //particles
    if (boidType === 'particles') {
      ctx.moveTo(tmpX, tmpY);

      ctx.lineTo(this.x + this.vx * (9 - boidWidth), this.y + this.vy * (9 - boidWidth));
    }

    ctx.closePath();
    ctx.strokeStyle = drawColor;
    ctx.stroke();
    ctx.restore();

    //-------------
  };

  Boid.prototype.updateColor = function() {
    if (!colors) {
      var newColor = Math.round(this.depth * (260 / depth)); //Math.floor((this.separation * minSeparation) * ((maxSeparation + minSeparation) / 2) * .125);

      /*if ((maxSeparation + minSeparation) < 11) {
                  newColor *= 5;
              }*/

      if (newColor > 255) {
        newColor = 250;
      } else if (newColor < 80) {
        newColor = 80;
      }

      this.color = 'rgb(' + newColor + ',' + newColor + ',' + newColor + ')';
    }
  };

  Boid.prototype.distance = function(x1, y1, x2, y2) {
    var tmpX = Math.abs(x1 - x2),
      tmpY = Math.abs(y1 - y2);

    return Math.sqrt(tmpX * tmpX + tmpY * tmpY);
  };

  Boid.prototype.flock = function() {
    var neighboursCount = 0,
      distance1 = 0,
      distance2 = 0,
      seperateX = 0,
      seperateY = 0,
      centerX = 0,
      centerY = 0,
      centerVx = 0,
      centerVy = 0,
      lookaheadX,
      lookaheadY;

    for (var j = 0; j < boidsArray.length; j++) {
      if (this.id !== j) {
        distance1 = this.distance(this.x, this.y, boidsArray[j].x, boidsArray[j].y);

        if (distance1 < cohesion && this.depth === boidsArray[j].depth) {
          neighboursCount += 1;

          centerX += boidsArray[j].x;
          centerY += boidsArray[j].y;

          centerVx += boidsArray[j].vx;
          centerVy += boidsArray[j].vy;

          distance2 = this.distance(boidsArray[j].x, boidsArray[j].y, this.x, this.y);

          if (distance2 < this.separation) {
            seperateX -= boidsArray[j].vx - this.vx;

            seperateY -= boidsArray[j].vy - this.vy;

            d = new Date();
            if (d.getSeconds() == 59 || d.getSeconds() == 15 || d.getSeconds() == 45) {
              this.separation = Math.floor(Math.random() * (maxSeparation - minSeparation + 1)) + minSeparation;
              //this.updateColor();
              this.depth = Math.floor(Math.random() * depth) + 1;
              this.updateColor();
            }
          }
        }
      }
    }

    //obstacle avoidance

    lookaheadX = this.x + this.vx * 60;
    lookaheadY = this.y + this.vy * 60;

    if (lookaheadX > cWidth) {
      lookaheadX = lookaheadX - cWidth;
    }

    if (lookaheadY > cHeight) {
      lookaheadY = lookaheadY - cHeight;
    }

    if (lookaheadX < 0) {
      lookaheadX = cWidth - lookaheadX;
    }

    if (lookaheadY > cHeight) {
      lookaheadY = cHeight - lookaheadY;
    }

    for (j = 0; j < obstaclesArray.length; j++) {
      //look ahead

      distance1 = this.distance(lookaheadX, lookaheadY, obstaclesArray[j].x, obstaclesArray[j].y);

      if (distance1 < obstaclesArray[j].radius + 35) {
        if (lookaheadX > obstaclesArray[j].x) {
          if (lookaheadY * 100 > obstaclesArray[j].y) {
            this.updateForce((1 - distance1 * 0.1) * -1, (1 - distance1 * 0.1) * -1);
          }

          if (lookaheadY < obstaclesArray[j].y) {
            this.updateForce((1 - distance1 * 0.1) * -1, 1 - distance1 * 0.1);
          }
        }

        if (lookaheadX < obstaclesArray[j].x) {
          if (lookaheadY * 100 < obstaclesArray[j].y) {
            this.updateForce(1 - distance1 * 0.1, 1 - distance1 * 0.1);
          }

          if (lookaheadY * 100 > obstaclesArray[j].y) {
            this.updateForce(1 - distance1 * 0.1, (1 - distance1 * 0.1) * -1);
          }
        }
      }

      //immediate

      distance1 = this.distance(this.x, this.y, obstaclesArray[j].x, obstaclesArray[j].y);

      if (distance1 < obstaclesArray[j].radius + 20) {
        if (this.x > obstaclesArray[j].x) {
          if (this.y > obstaclesArray[j].y) {
            this.updateForce((1 - distance1 * 0.1) * -1, (1 - distance1 * 0.1) * -1);
          }

          if (this.y < obstaclesArray[j].y) {
            this.updateForce((1 - distance1 * 0.1) * -1, 1 - distance1 * 0.1);
          }
        }

        if (this.x < obstaclesArray[j].x) {
          if (this.y < obstaclesArray[j].y) {
            this.updateForce(1 - distance1 * 0.1, 1 - distance1 * 0.1);
          }

          if (this.y > obstaclesArray[j].y) {
            this.updateForce(1 - distance1 * 0.1, (1 - distance1 * 0.1) * -1);
          }
        }
      } //end immediate
    } //end obstacle avoidance

    if (neighboursCount > 0) {
      centerX = (centerX / neighboursCount - this.x) * cohesionScaler;
      centerY = (centerY / neighboursCount - this.y) * cohesionScaler;

      centerVx /= neighboursCount;
      centerVy /= neighboursCount;

      if (Math.random() * 2 - 1 > 0) {
        this.updateForce(centerVx, centerVy);

        this.updateForce(seperateX, seperateY);
      } else {
        this.updateForce(seperateX, seperateY);

        this.updateForce(centerVx, centerVy);
      }

      this.updateForce(centerX, centerY);

      cohesionScaler = Math.floor(Math.random() * (100 + 1)) / cohesionScaleFactor;
    }
  };
  var requestId;

  var d = new Date();

  function animateLoop() {
    d = new Date();

    if ((addingBoids && d.getMilliseconds() < 400) || (addingBoids && d.getMilliseconds() > 600)) {
      boidsArray.push(new Boid());
      boidsNum++;
      boidsArray[boidsArray.length - 1].x = mousePos.x;
      boidsArray[boidsArray.length - 1].y = mousePos.y;
      document.getElementById('display-boid-num').innerText = '' + boidsNum;
    }

    ctx.clearRect(0, 0, cWidth, cHeight);

    for (var i = 1; i < obstaclesArray.length; i++) {
      obstaclesArray[i].drawObstacle();
      if ((obstaclesArray.length > 1 && d.getSeconds() == 59) || d.getSeconds() == 30) {
        obstaclesArray[i].changeV();
      }
    }

    for (i = 0; i < boidsArray.length; i++) {
      boidsArray[i].drawBoid();
      boidsArray[i].wrap();
    }

    requestId = window.requestAnimationFrame(animateLoop);
  }

  function newSwarm() {
    boidsArray = [];
    for (var i = 0; i < boidsNum; i++) {
      boidsArray[i] = new Boid();
      boidsArray[i].id = i;
    }
  }

  function makeObstacles() {
    obstaclesArray = [];

    for (var i = 0; i < obstaclesNum; i++) {
      obstaclesArray[i] = new Obstacle();
    }

    addMouseObstacle();
  }

  function addMouseObstacle() {
    obstaclesArray.unshift(new Obstacle());
    obstaclesArray[0].x = 0;
    obstaclesArray[0].y = 0;
    obstaclesArray[0].vx = 0;
    obstaclesArray[0].vy = 0;
    obstaclesArray[0].radius = 40;
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  canvas.addEventListener(
    'mousemove',
    function(evt) {
      mousePos = getMousePos(canvas, evt);
      obstaclesArray[0].x = mousePos.x;
      obstaclesArray[0].y = mousePos.y;
    },
    false
  );

  canvas.addEventListener('mousedown', function(evt) {
    addingBoids = true;
    mousePos = getMousePos(canvas, evt);
  });

  canvas.addEventListener('mouseup', function() {
    addingBoids = false;
  });

  function start() {
    if (!requestId) {
      animateLoop();
    }
  }
  newSwarm();

  start();
}

document.addEventListener('DOMContentLoaded', main);
