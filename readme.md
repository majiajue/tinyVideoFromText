# 文章转为视频

## ffmpeg 命令

#### 多图制作视频

音频加图片，图片循环结束后一直为最后一张

```
ffmpeg -y -r 30 -i ./bg%04d.jpg -i result.mp3 -absf aac_adtstoasc output.mp4  //开头超快 100ms
ffmpeg -y -r 10 -i ./bg%04d.jpg -i result.mp3 -absf aac_adtstoasc output.mp4  //超快 100ms
ffmpeg -y -r 1 -i ./bg%04d.jpg -i result.mp3 -absf aac_adtstoasc output.mp4  //黑屏
ffmpeg -y -r 0.1 -i ./bg%04d.jpg -i result.mp3 -absf aac_adtstoasc output.mp4  //从40秒开始有图，10秒一换，前40不能拖进度
ffmpeg -y -r 0.1 -i ./bg%04d.jpg -i result.mp3 output.mp4
```

仅视频

```
ffmpeg -y -loop 1 -f image2 -r 0.3 -i ./bg%04d.jpg -vcodec libx264  -t 20 output2.mp4 //前几秒不正常，后面对了
ffmpeg -y -loop 1 -f image2 -r 0.5 -i ./bg%04d.jpg -vcodec libx264 -r 20 -t 10 output2.mp4  //前后都加r后正常。前面为切换间隔 后面为渲染帧数
ffmpeg -y -loop 1 -f image2 -r 0.3 -i ./bg%04d.jpg -vcodec libx264 -r 25 -t 180 output2.mp4  //完全正常
```

本部分测试完成，bg0001.jpg 开始连续，而且第一张的图片有问题的话视频不能播放。
根据第一张图片的分辨率决定了视频分辨率。太大的话视频也会很大。
代码

```
let picPath = path.join(__dirname, "../bg/bg%04d.jpg"); //bg0001.jpg开始
 ffmpeg()
      .input(picPath)
      .inputOptions("-r 0.5")
      .loop(time)
      .fps(25)
      .size("200x?")   //输出分辨率，规定了比例和一边（对大小和容量修改）
      .aspect("4:3")
      .input(mergedPath)
      .save(outputPath);
```

#### 合并音频

```
ffmpeg -y -i result.mp3 -i input1.mp3 -filter_complex amerge -ac 2 -c:a libmp3lame -q:a 4 output.mp3 //可以正常合并，长度为短的那个

ffmpeg -y -i result.mp3 -filter_complex "amovie=input1.wav:loop=0,asetpts=N/SR/TB[input1];[0][input1]amix=duration=shortest,volume=1"   out.mp3  //可以合并，将短的重复合并到长的。但是音量为总体控制，1为100%

ffmpeg -y -i input1.mp3 -af volume=-15dB input1.wav  //降低音量

ffmpeg -y -i result.mp3 -i input1.mp3 -filter_complex amix=inputs=2:duration=longest:dropout_transition=3 amix.mp3 //简单合并，已最长为时长，有3秒的过渡退出效果
```

## todo

美化字幕，最好动画

字幕超长遮挡

文章自动断句。

文章自动抓取分析。

多图

多图切换和滤镜
