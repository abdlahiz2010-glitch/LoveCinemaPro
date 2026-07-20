let localStream = null;
let peerConnection = null;
let microphoneEnabled = true;


const rtcConfig = {

    iceServers:[

        {
            urls:"stun:stun.l.google.com:19302"
        }

    ]

};




// تشغيل المايك أو الكاميرا

async function startCall(camera){


    localStream =
    await navigator.mediaDevices.getUserMedia({

        audio:true,

        video:camera

    });



    document.getElementById(
        "localVideo"
    ).srcObject = localStream;



    peerConnection =
    new RTCPeerConnection(rtcConfig);



    localStream.getTracks()
    .forEach(track=>{


        peerConnection.addTrack(
            track,
            localStream
        );


    });




    peerConnection.ontrack =
    (event)=>{


        document.getElementById(
            "remoteVideo"
        ).srcObject =
        event.streams[0];


    };




    peerConnection.onicecandidate =
    (event)=>{


        if(event.candidate){


            socket.emit("signal",{

                room:roomCode,

                candidate:event.candidate

            });


        }


    };



    alert("تم تشغيل المايك/الكاميرا");


}






// الاتصال

async function makeCall(){


    if(!peerConnection){


        alert("شغل المايك أولاً");

        return;

    }




    let offer =
    await peerConnection.createOffer();



    await peerConnection.setLocalDescription(
        offer
    );



    socket.emit("call-user",{

        room:roomCode,

        offer:offer

    });


}







// استقبال مكالمة

socket.on("call-user",
async(data)=>{


    if(!peerConnection){

        await startCall(false);

    }



    await peerConnection.setRemoteDescription(

        new RTCSessionDescription(
            data.offer
        )

    );



    let answer =
    await peerConnection.createAnswer();



    await peerConnection.setLocalDescription(
        answer
    );



    socket.emit("answer-call",{

        room:roomCode,

        answer:answer

    });


});








// استقبال الرد

socket.on("answer-call",
async(data)=>{


    await peerConnection.setRemoteDescription(

        new RTCSessionDescription(
            data.answer
        )

    );


});







// استقبال ICE

socket.on("signal",
async(data)=>{


    if(peerConnection){


        await peerConnection.addIceCandidate(

            new RTCIceCandidate(
                data.candidate
            )

        );


    }


});







// تشغيل/إيقاف المايك

function toggleMicrophone(){


    if(!localStream){

        return;

    }



    let audio =
    localStream.getAudioTracks()[0];



    microphoneEnabled =
    !microphoneEnabled;



    audio.enabled =
    microphoneEnabled;



}