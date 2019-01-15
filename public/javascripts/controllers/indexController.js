app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

    $scope.messages = [];
    $scope.players = {};

    $scope.init = () =>{
        const username = prompt('Lütfen Kullanıcı Adınızı Girin');

        if(username){
            initSocket(username);
        }
        else {
            return false;
        }
    };

    function initSocket(username){
        indexFactory.connectSocket('http://localhost:3000',{
            reconnectionAttemts:3
        })
        .then((socket)=>{
            socket.emit('newUser',{username});

            socket.on('newUser',(userData)=>{
                const messagesData = {
                    type:0, //info
                    username: userData.username,
                    text: "Katıldı"
                };

                $scope.messages.push(messagesData);
                $scope.$apply();
            });

            socket.on('disUser',(userData)=>{
                const messagesData = {
                    type:0, //info
                    username: userData.username,
                    text: "Ayrıldı"
                };

                $scope.messages.push(messagesData);
                $scope.$apply();
            });


            socket.on('initPlayers',(players)=>{
                $scope.players=players;
                $scope.$apply();
            });

            let animate =false;
            $scope.onClickPlayer = ($event) =>{
                console.log($event.offsetX,$event.offsetY);
                if(!animate)
                {
                    animate=true;
                    $('#'+socket.id).animate({'left':$event.offsetX,'top':$event.offsetY},()=>{
                        animate=false;
                    });
                }
            };

        })
        .catch((err)=>{
            console.log(err);
        });
    }



}]);