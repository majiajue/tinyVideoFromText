const ffmpeg = require("fluent-ffmpeg");
const path = require('path')

var videopath = path.join(__dirname,'../merged/result_pic.mp4') 

let  srtPath = path.join(__dirname,'../srt/result.srt')

let outputPath= path.join(__dirname,'../merged/result_pic_srt.mp4')


//添加自定义文字
// var add = ffmpeg().input(video).complexFilter('drawtext=:text=welcome:x=(w-text_w)/2:y=(h-40):fontsize=30:fontcolor=black@0.9').save('../result/tmp_addText.mp4')

//导入字幕
var add = function () {
    return new Promise((resolve,reject)=>{
        ffmpeg().input(videopath).complexFilter('subtitles=./srt/result.srt')
        .on('end', function() {
            console.log('addText succesfully');
            resolve()
          })
          .on('error', function(err) {
            console.log('addText an error happened: ' + err.message);
            reject()
          })
          .save(outputPath)
    })
    
} 

exports.addText=add