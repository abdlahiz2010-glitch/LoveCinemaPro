const express = require("express");
const http = require("http");
const path = require("path");
const multer = require("multer");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

app.post("/upload", upload.single("video"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false
        });
    }

    res.json({
        success: true,
        url: "/uploads/" + req.file.filename
    });

});
// إدارة الغرف والمستخدمين

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);


    // دخول الغرفة
    socket.on("join-room", (data) => {

        socket.join(data.room);


        socket.username = data.username;


        socket.to(data.room).emit(
            "user-joined",
            {
                id: socket.id,
                username: data.username
            }
        );


        console.log(
            data.username,
            "joined room:",
            data.room
        );

    });



    // مزامنة الفيديو
    socket.on("video-control", (data) => {

        socket.to(data.room).emit(
            "video-control",
            data
        );

    });



    // الدردشة
    socket.on("chat", (data) => {

        io.to(data.room).emit(
            "chat",
            {
                username: socket.username,
                message: data.message
            }
        );

    });



    // بدء المكالمة
    socket.on("call-user", (data) => {

        socket.to(data.room).emit(
            "call-user",
            {
                offer: data.offer
            }
        );

    });



    // الرد على المكالمة
    socket.on("answer-call", (data) => {

        socket.to(data.room).emit(
            "answer-call",
            {
                answer: data.answer
            }
        );

    });



    // إرسال ICE candidates
    socket.on("signal", (data) => {

        socket.to(data.room).emit(
            "signal",
            {
                candidate: data.candidate
            }
        );

    });
        // عند خروج المستخدم
    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );

    });


});


// تشغيل السيرفر

const PORT = process.env.PORT || 3000;

server.listen(PORT,"0.0.0.0",()=>{
    console.log("Running on port " + PORT);
});
