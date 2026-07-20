


let roomCode = "";



function joinRoom(){


    let username =
    document.getElementById("username").value;


    roomCode =
    document.getElementById("roomCode").value;



    if(username === "" || roomCode === ""){


        alert("اكتب الاسم ورمز الغرفة");

        return;

    }



    socket.emit("join-room",{

        room: roomCode,

        username: username

    });



    alert(
        "دخلت الغرفة: " + roomCode
    );


}



socket.on("user-joined",(data)=>{


    console.log(
        data.username + " دخل الغرفة"
    );


});
function createRoom(){

    let code = 
    Math.floor(100000 + Math.random() * 900000);


    document.getElementById("roomCode").value = code;


    alert(
        "تم إنشاء الغرفة: " + code
    );

}
console.log("room.js loaded");