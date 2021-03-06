angular.module('dynablasterApp')
    .factory('GOBot', function (GObj, loaderRes, gameService) {
        function GOBot(poz, id, type) {
            GOBot.__super__.constructor.apply(this);
            this.size = {w: 40, h: 40};

            this.id = id;
            this.obj = new createjs.Shape();
            this.obj.x = poz.x;
            this.obj.y = poz.y;

            this.setImg(loaderRes.getResult((type == 'MONSTER')? 'monster1' : 'monster2'));

            var self = this;
            gameService.stompSubscribe('/game/bot/' + this.id + '/move', function(data){
                self.move(data.position.x, data.position.y);
            });
        } __extends(GOBot, GObj);

        return GOBot;
    });
