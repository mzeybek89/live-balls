app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

    indexFactory.connectSocket('http://localhost:3000',{
        reconnectionAttemts:3
    })
    .then((socket)=>{
        console.log('Bağlantı Sağlandı',socket);
    })
    .catch((err)=>{
        console.log(err);
    });

}]);