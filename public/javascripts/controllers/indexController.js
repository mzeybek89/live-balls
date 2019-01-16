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

    function scrollTop() {
        setTimeout(()=>{
            const element = document.getElementById('chatArea');
            element.scrollTop = element.scrollHeight;
        });
    }
    
    function showBubble(id,txt) {
        $('#'+id).find('.message').show().html(txt);
        setTimeout(()=>{
            $('#'+id).find('.message').slideUp();
        },2000);
    }

   async function initSocket(username){

        const socket = await indexFactory.connectSocket('http://localhost:3000',{
            reconnectionAttemts:3
        });

            socket.emit('newUser',{username});

            socket.on('newUser',(userData)=>{
                const messagesData = {
                    type:0, //info
                    username: userData.username,
                    text: "Katıldı"
                };

                $scope.messages.push(messagesData);
                //$scope.players[userData.id] = userData;
                $scope.$apply();
                scrollTop();
            });

            socket.on('disUser',(userData)=>{
                try {
                    const messagesData = {
                        type:0, //info
                        username: userData.username,
                        text: "Ayrıldı"
                    };

                    $scope.messages.push(messagesData);
                    delete $scope.players[userData.id];
                    $scope.$apply();
                    scrollTop();
                }
                catch (e) {
                    console.log(e);
                }
            });


            socket.on('initPlayers',(players)=>{
                $scope.players=players;
                $scope.$apply();
            });

            let animate =false;
            $scope.onClickPlayer = ($event) =>{
                if(!animate)
                {
                    animate=true;
                    $('#'+socket.id).animate({'left':$event.offsetX,'top':$event.offsetY},()=>{
                        animate=false;
                    });

                    socket.emit('locationUpdate',{'id':socket.id,'left':$event.offsetX,'top':$event.offsetY})
                }
            };

            socket.on('locUpdate',(locData)=>{
                $('#'+locData.id).animate({'left':locData.left,'top':locData.top});
            });


            $scope.newMessage = () =>{
                let message = $scope.message;
                $scope.message = '';

                const messagesData = {
                    id:socket.id,
                    type:1, //info
                    username: username,
                    text: message
                };

                $scope.messages.push(messagesData);
                socket.emit('newMessage',messagesData);
                scrollTop();
                showBubble(socket.id,message);
            };


            socket.on('newMessage',(messagesData)=>{
                $scope.messages.push(messagesData);
                showBubble(messagesData.id,messagesData.text);
                $scope.$apply();
                scrollTop();
            });
    }



}]);