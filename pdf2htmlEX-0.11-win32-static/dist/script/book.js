
// 配置
const config = {
    // 需要引入的js地址 (尽量绝对路径)
    requireJsList: [
        '../script/js/vue.min.js',
        '../script/js/jquery.min.1.7.js',
        '../script/js/turn.js',
        '../script/js/menu.js',
        '../script/js/search.js',
        '../script/js/utils.js',
    ],
    // 引入css
    requireCssList: [
        '../script/css/sassouput/index.css',
        '../script/css/book.css',
        '../script/css/icon.css',
    ],
    // 翻书音效 音频地址
    turnBookAudioUrl: '../script/files/Hardcover.mp3',
    // 图片地址变量 绝对路径 相对可能找不到
    imgData: {
        msgIcon: '../script/files/msg.png'
    }
}
// 引入js
for (let i = 0; i < config.requireJsList.length; i++) {
    const jsPath = config.requireJsList[i];
    document.write("<script language=javascript src=" + jsPath + "></script>");
}
// 引入css
for (let i = 0; i < config.requireCssList.length; i++) {
    const cssPath = config.requireCssList[i];
    document.write(`<link rel="stylesheet" href="${cssPath}">`);
}

// 书籍类
class Book {
    constructor(id, outBox) {
        // 外层盒子 容器书籍以该容器作为根节点
        this.outBox = outBox
        this.id = id
        this.width = 0 // 页面宽度
        this.height = 0 // 页面高度
        this.bookWidth = 1241.574000 * 2 // 书籍宽度
        this.bookHeight = 1621.418000 // 书籍高度
        this.padding = 128 // 页面内边距 页面宽高不包括该边距
        this.isSingle = false // 是否单页
        this.setSingleVal = false // 强制单页不可切换
        this.zoom = 1 // 缩放比例
        this.total = 0 // 书籍页数
        this.pageType = 'first' // 页面类型是否是 首页和 尾页
        this.curPage = 1  // 当前显示是第几页
        // 左侧偏移量
        this.offset = 600
        // 中间的定位容器用于定位
        this.container = $('<div id="componentContainer" class="container"></div>')
        // 左右按钮
        this.nextBtn = $('<div class="left_btn iconfont">&#xe61f;</div>')
        this.previousBtn = $('<div class="right_btn iconfont">&#xe61e;</div>')
        // 显示
        this.ComponentShow = null
        // 翻书音效
        this.turnBookAudioEl = $(`<audio src="${config.turnBookAudioUrl}"></audio>`)
        $('body').append(this.turnBookAudioEl)
        // 事件监听
        // resize 窗口变化
        window.addEventListener("resize", () => {
            // 函数体
            this.resize()
        });
    }
    // 书籍初始化
    init() {
        $(this.id).turn({
            width: this.isSingle ? this.bookWidth / 2 : this.bookWidth,
            height: this.bookHeight / 2,
            autoCenter: true, // 自动居中
            acceleration: true, // 硬件加速
            gradients: true, // 翻页渐变和阴影
            display: this.isSingle ? "single" : "double", // 单双页
            duration: 700, // 翻页速度
            // 事件监听
            when: {
                first: () => {
                    this.pageType = "first";
                    this.setContainerStyle()
                },
                last: () => {
                    this.pageType = "last";
                    this.setContainerStyle()
                },
                // 翻页前
                turning: (event, page, view) => {
                    this.pageType = "none";
                    this.curPage = page;
                    window.$eventBus.$emit('changePage', page)
                    // 播放音效
                    this.turnBookAudioEl[0].currentTime = 0;
                    this.turnBookAudioEl[0].play()
                    // 计算样式
                    page != 1 && page != window.$totalPage && this.setContainerStyle()
                },
                // 翻页结束
                end: () => {
                }
            },
        });
        // 初次获取宽高渲染
        this.resize()
        this.initElement()
        this.ComponentShow = new ComponentShow()
        setTimeout(() => {
            this.resize()
        }, 300);
    }
    // 按钮初始化
    initElement() {
        this.nextBtn.click(() => {
            this.next()
        })
        this.previousBtn.click(() => {
            this.previous()
        })
        // 将按钮添加到页面
        this.outBox.append(this.container)
        this.container.append(this.nextBtn)
        this.container.append(this.previousBtn)

    }
    // 验证是否是单页
    isDan() {
        let flag = false
        if (this.isSingle || this.pageType == 'first' || (this.pageType == 'last' && window.$totalPage % 2 == 0)) {
            flag = true
        } else {
            flag = false
        }
        return flag
    }
    // 设置按钮样式
    setBtnStyle() {
        // 设置按钮样式
        this.nextBtn.attr('style', `
            width:${this.padding / 1.5}px;
            height:${this.bookHeight * this.zoom}px;
        `)
        this.previousBtn.attr('style', `
            width:${this.padding / 1.5}px;
            height:${this.bookHeight * this.zoom}px;
        `)
    }
    setContainerStyle() {
        this.container.attr('style', `
        width:${(this.isDan() ? this.bookWidth / 2 : this.bookWidth) * this.zoom}px;
        height:${this.bookHeight * this.zoom}px;
    `)
    }
    // 窗口大小变化重新渲染
    resize() {
        let width = this.outBox[0].offsetWidth - (this.padding * 2)
        let height = this.outBox[0].offsetHeight - (this.padding * 2)
        this.width = width
        this.height = height
        // 宽度比例小于 5 说明是竖屏
        this.isSingle = width / (width + height) <= 0.5;
        if (this.setSingleVal) {
            this.isSingle = true
        }
        //   计算缩放比例
        this.zoom = Math.min(
            width / (this.isSingle ? this.bookWidth / 2 : this.bookWidth),
            height / this.bookHeight
        );
        window.loadStyleString(`.pc{transform: scale(${this.zoom});pointer-events:none;}`, /.pc\{.+\}/)
        this.bookResize()
        // 设置样式
        this.setContainerStyle()
        this.setBtnStyle()
        // 页面居中
        $(this.id).css({
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%,-50%)`,
            zIndex: '13',
        })
        window.$eventBus.$emit('resize', this)
    }
    // 书籍缩放
    bookResize() {
        $(this.id).turn("display", this.isSingle ? "single" : "double"); // 单双页
        $(this.id).turn(
            "size",
            this.isSingle ? (this.bookWidth * this.zoom) / 2 : (this.bookWidth * this.zoom),
            this.bookHeight * this.zoom
        );
    }
    // 下一页
    next() {
        $(this.id).turn("next");
    }
    // 上一页
    previous() {
        $(this.id).turn("previous");
    }
    // 跳到指定页面
    toPage(page) {
        $(this.id).turn('page', page)
    }
    // 当前数据
    curData(key) {
        switch (key) {
            case 'width':
                return this.bookWidth * this.zoom
                break;
            case 'height':
                return this.bookHeight * this.zoom
                break;

            default:
                break;
        }
    }
    // 当前的页码
    curPageStr() {
        return this.isSingle
            ? [this.curPage]
            : this.curPage == 1 ||
                (this.pageType == 'last' &&
                    this.curPage % 2 == 0)
                ? [this.curPage]
                : this.curPage % 2 == 0
                    ? [this.curPage, this.curPage + 1]
                    : [this.curPage - 1, this.curPage];
    }
    // 强制锁为单页
    setSingle(flag) {
        this.setSingleVal = flag
        this.resize()
    }
}

// 页面初始化
window.onload = () => {
    /* ========================= */
    let styleStr = ``
    let styleEl = $('<style type="text/css"></style>')
    $(document.getElementsByTagName("head")[0]).append(styleEl);
    window.loadStyleString = function loadStyleString(cssText, reg = /aabbcc/) {
        let flag = reg.test(styleStr)
        if (flag) {
            styleStr = styleStr.replace(reg, cssText)
        } else {
            styleStr += cssText
        }
        try {
            styleEl[0].innerHTML = (styleStr);
        } catch (ex) {
            styleEl[0].styleSheet.cssText = styleStr;
        }
    }
    /* ========================= */
    window.$totalPage = Object.keys((new Search()).pages).length
    window.$eventBus = new Vue()
    // 初始化菜单 必须在书籍之前
    let menu = new Menu()
    menu.init()
    // 
    $('#sidebar').remove()
    $('.loading-indicator').remove()
    // 初始化书籍
    let content = $('#page-container').remove()
    const outBox = $('<div id="outbox"></div>')
    outBox.append(content)
    $('body').append(outBox);
    // return
    window.$book = new Book('#page-container', outBox)
    window.$book.init()
    // 窗口事件
    window.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            case 37:
                window.$book.previous();
                break;
            case 38:
                break;
            case 39:
                window.$book.next();
                break;
            case 40:
                break;

            default:
                break;
        }
    })
    // 消息提示
    window.$message = new Message()
    // window.$message.add('测试内容，测试内容')
    // window.$message.add('错误内容，危险内容', 'error')
    // window.$message.add('测试内容，测试内容测试内容，测试内容测试内容，测试内容测试内容，测试内容测试内容，测试内容测试内容，测试内容测试内容，测试内容测试内容，测试内容测试内容，测试内容', 'warning')
}

// 禁用右键
document.oncontextmenu = () => false;