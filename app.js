
const movie = document.getElementById("movie");



// تشغيل فيديو من رابط

function playURL(){


    let url =
    document.getElementById("videoURL").value;



    if(!url){

        return;

    }



    movie.src = url;


    movie.play();



    socket.emit("video-control",{

        room: roomCode,

        type:"load",

        url:url

    });


}




// رفع فيديو

function uploadVideo(){


    let file =
    document.getElementById("videoFile").files[0];



    if(!file){

        alert("اختر فيديو");

        return;

    }



    let form =
    new FormData();



    form.append(
        "video",
        file
    );



    fetch("/upload",{

        method:"POST",

        body:form

    })

    .then(res=>res.json())

    .then(data=>{


        movie.src =
        data.url;



        movie.play();



        socket.emit("video-control",{

            room:roomCode,

            type:"load",

            url:data.url

        });


    });


}





// عند التشغيل

movie.onplay = ()=>{


    socket.emit("video-control",{

        room:roomCode,

        type:"play",

        time:movie.currentTime

    });


};




// عند الإيقاف

movie.onpause = ()=>{


    socket.emit("video-control",{

        room:roomCode,

        type:"pause",

        time:movie.currentTime

    });


};





// استقبال التحكم من الطرف الآخر

socket.on("video-control",(data)=>{



    if(data.type==="load"){


        movie.src=data.url;


    }



    if(data.type==="play"){


        movie.currentTime=data.time;

        movie.play();


    }



    if(data.type==="pause"){


        movie.currentTime=data.time;

        movie.pause();


    }


});