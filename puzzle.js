/**
 * PuzzleGame V1.0 [拼图游戏插件]
 * By LinShuizhaoying
 * 一个生日礼物。
 * 移动端请配合fastclick
 * pc端请自己调整图片大小
 */
;(function($, window, document,undefined) {
    //定义PuzzleGame的构造函数
    var PuzzleGame = function(ele, opt) {

        this.$element = ele,
        this.defaults = {
            'frontImg': 'images/1.png',//正面图像
            'backImg': 'images/2.png',//背面图像
            'rank':'easy',//难度
            'rate':"1"//文字摆放位置
        },
        this.options = $.extend({}, this.defaults, opt)
    }
    //定义PuzzleGame的方法
    PuzzleGame.prototype = {
        puzzleInit: function() {
            var that = this;
            //是否正确拼完
            var solved = false;

            //对画布进行操作
            var context = this.$element.get(0).getContext("2d");
            //响应式调整canvas长宽
            console.log(context);

            //画布宽度
            var boardSize = $("body").width(); 
            //面板对象
            var boardParts = new Object;

            //游戏难度，划分块数
            var tileCount = this.options.rank == "easy" ? 3 : 4;
            console.log(boardSize);
            console.log(tileCount);

            //划分每个小块的大小
            var tileSize = boardSize / tileCount;
            console.log(tileSize);
            //载入正面图片
            var frontImg = new Image();
            frontImg.src = this.options.frontImg;
            frontImg.addEventListener('load', drawTiles, false); 
            console.log(this.options.rank);
            //载入背面图片
            var backImg = new Image();
            backImg.src = this.options.backImg;
            //backImg.addEventListener('load', showBack, false); 

            console.log(boardSize); 

            //开始分割并打乱
             setBoard();


            //第一个准备交换拼图的位置
            var changeOne = new Object;
            changeOne.x = 0;
            changeOne.y = 0;
            //第二个准备交换拼图的位置
            var changeTwo = new Object;
            changeTwo.x = 0;
            changeTwo.y = 0;
            //用来判断是否点击了第一个
            var checked = false;

            //交换拼图事件绑定
            $(this.$element).on('click', function(e) {
                if(!solved){
                    var clickLoc = new Object;
                    clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
                    clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
                    //如果是第一次点击
                    if(!checked){   
                        changeOne.x = clickLoc.x;
                        changeOne.y = clickLoc.y;
                        checked = !checked;
                        console.log("第一个点击位置为:");
                        console.log(changeOne);
                    }else{
                        changeTwo.x = clickLoc.x;
                        changeTwo.y = clickLoc.y;
                        checked = !checked;
                        console.log("第二个点击位置为:");
                        console.log(changeTwo);
                        slideTile(changeOne, changeTwo);
                        drawTiles();
                    }
                }
                // $(".lin").text(clickLoc.x + "  " + clickLoc.y);
            });



            //重绘画布
            function drawTiles() {
                if(!solved){
                    //绘制之前先把画布擦一擦
                    context.clearRect( 0 , 0 , boardSize , boardSize );
                    for (var i = 0; i < tileCount; ++i) {
                        for (var j = 0; j < tileCount; ++j) {
                          var x = boardParts[i][j].x;
                          var y = boardParts[i][j].y;
             //第一个参数和其它的是相同的，都是一个图像或者另一个 canvas 的引用。
             //其它8个参数最好是参照右边的图解，前4个是定义图像源的切片位置和大小，
             //后4个则是定义切片的目标显示位置和大小。
                          context.drawImage(frontImg, x * tileSize, y * tileSize, tileSize, tileSize,
                                i * tileSize, j * tileSize, tileSize, tileSize);
                        }
                    }
                }
            }

            //显示背面
            function showBack(){
                //绘制之前先把画布擦一擦
              context.clearRect(0,0, boardSize, boardSize);

              context.drawImage(backImg,0,0);

              context.fillStyle = '#70C5D0';
              
              context.font = 'italic 12px Arial';

              context.fillText('I would share my sadness with you!But just a little.', 20, 20);

              context.fillText('I prefer to share my happiness with you.', 20, 40);


            }

            //该方法用来初始化位置,根据划分的难度将整个图片分割为tileCount*tileCount个小块
            function setBoard() {
              //先创建一个二维数组，长宽都是titleCount
              boardParts = new Array(tileCount);
              for (var i = 0; i < tileCount; ++i) {
                boardParts[i] = new Array(tileCount);
                for (var j = 0; j < tileCount; ++j) {
                  boardParts[i][j] = new Object;
                  boardParts[i][j].x = (tileCount - 1) - i;
                  boardParts[i][j].y = (tileCount - 1) - j;
                }
              }
              console.log(boardParts);
              // changeTwo.x = boardParts[tileCount - 1][tileCount - 1].x;
              // changeTwo.y = boardParts[tileCount - 1][tileCount - 1].y;
              solved = false;
            }

            //交换拼图
            function slideTile(toLoc, fromLoc) {
              if (!solved) {
                var temp = new Object;
                temp.x = boardParts[toLoc.x][toLoc.y].x;
                temp.y = boardParts[toLoc.x][toLoc.y].y;
                boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
                boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
                boardParts[fromLoc.x][fromLoc.y].x = temp.x;
                boardParts[fromLoc.x][fromLoc.y].y = temp.y;
                toLoc.x = fromLoc.x;
                toLoc.y = fromLoc.y;
                console.log(boardParts);
                checkSolved();
              }
            }
            //验证是否拼图完成
            function checkSolved() {
                var flag = true;
                for (var i = 0; i < tileCount; ++i) {
                for (var j = 0; j < tileCount; ++j) {
                    if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
                        flag = false;
                    }
                }
                }
                solved = flag;
                //solved = true;
                if (solved) {
                  //function
                  showBack();
                }
            }

        }
    }
    //在插件中使用PuzzleGame对象
    $.fn.puzzleGame = function(options) {
        //创建puzzleGame的实体
        var puzzleGame = new PuzzleGame(this, options);
        //调用其方法
        return puzzleGame.puzzleInit();
    }
})(jQuery, window, document);


