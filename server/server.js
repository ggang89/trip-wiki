//express 모듈 가져오기
const express = require("express");

//경로 쉽게 설정해주는 path 모듈 가져오기
const path = require("path");

//express 모듈 실행해서 app에 할당
const app = express();

//이전에 3000번 서버쓴 기록이 있어서 오류뜸=>4000으로 임으로 바꿔줌
const PORT = 4000;

//서버가 접근할 수 있도록 경로 지정
app.use(express.static(path.join(__dirname, "..")));

//모든 요청에 동일한 index.html객체 반환
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(PORT, () => {
  console.log("start server");
});
