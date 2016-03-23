angular.module('dynablasterApp')
    .factory('GOGround', ['loaderRes', function (loaderRes) {
        function GOGround(map) {
            var self = this;
            this.img = {
                ground: loaderRes.getResult('ground'),
                brick: loaderRes.getResult('brick'),
                wall: loaderRes.getResult('wall'),
                monster1: loaderRes.getResult('monster1')
            };

            this.ground = new createjs.Shape();
            this.ground.graphics.beginBitmapFill(this.img.ground).drawRect(0, 0, 800, 645);
            this.ground.x = this.ground.y = 0;

            this.bricks = [];
            this.walls = [];

            var start = {x: 60, y: 40};
            this.size = {w: 40, h: 40};

            map.forEach(function(items, i) {
                items.forEach(function(item, j) {
                    var x = start.x + self.size.w * j,
                        y = start.y + self.size.h * i;

                    switch (item.type) {
                        case 'WALL': {
                            self.walls.push(self.createGO(self.img.wall, x, y));
                        } break;
                        case 'BRICK': {
                            self.bricks.push(self.createGO(self.img.brick, x, y));
                        } break;
                        case 'MONSTER': {
                            self.bricks.push(self.createGO(self.img.monster1, x, y));
                        } break;
                    }
                });
            });
        }
        GOGround.prototype = {
            addToStage: function (stage) {
                stage.addChild(this.ground);
                this.walls.forEach(function(wall) {
                    stage.addChild(wall);
                });
                this.bricks.forEach(function(brick) {
                    stage.addChild(brick);
                });
            },
            removeFromStage: function (stage) {
                stage.removeChild(this.ground);
                this.walls.forEach(function(wall) {
                    stage.removeChild(wall);
                });
                this.bricks.forEach(function(brick) {
                    stage.addChild(brick);
                });
            },
            createGO: function(img, x, y) {
                var obj = new createjs.Shape();
                obj.graphics.beginBitmapFill(img).drawRect(0, 0, this.size.w, this.size.h);
                obj.x = x;
                obj.y = y;

                return obj;
            }
        };
        return GOGround;
    }]);
