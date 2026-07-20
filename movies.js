// قائمة الأفلام

let movies = [

    {
        title:"فيلم 1",
        url:"/uploads/movie1.mp4",
        image:"/images/movie1.jpg"
    },


    {
        title:"فيلم 2",
        url:"/uploads/movie2.mp4",
        image:"/images/movie2.jpg"
    }

];





function loadMovies(){


    console.log("Movies loaded");


    movies.forEach(movie=>{


        console.log(
            movie.title,
            movie.url
        );


    });


}





// تشغيل فيلم من القائمة

function playMovie(url){


    let video =
    document.getElementById("movie");



    video.src = url;


    video.play();



    socket.emit("video-control",{

        room:roomCode,

        type:"load",

        url:url

    });


}




loadMovies();