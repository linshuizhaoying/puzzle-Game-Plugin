#
Puzzle Game Plugin

拼图插件

因为是根据你图片大小来生成拼图，为了响应式，你需要自己分别切出适配图片。默认是320*320，在iphone5/iphone5s下调试。
这个插件当初是为了快速开发一个拼图游戏当做礼物因此并没有考虑很细致。
主要效果就是你拼完然后它会显示背面图并加上你所希望加上的内容。

使用方式：

```
  $('#puzzleGame').puzzleGame({
    'rank':"difficult",
    'frontImg':"images/1.png",
    "backImg":"images/2.png",
    'rate':320/320
  });

```

