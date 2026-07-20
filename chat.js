function sendMessage(){


    let input =
    document.getElementById("message");


    let text =
    input.value;



    if(text.trim()===""){

        return;

    }



    socket.emit("chat",{

        room: roomCode,

        message:text

    });



    input.value="";


}





socket.on("chat",(data)=>{


    let box =
    document.getElementById("messages");



    let msg =
    document.createElement("p");



    msg.innerHTML =
    "<b>"+data.username+"</b>: "
    + data.message;



    box.appendChild(msg);



    box.scrollTop =
    box.scrollHeight;


});