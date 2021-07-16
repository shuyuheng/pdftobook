// 确认弹窗
let DialogArr = []
class ConfirmDialog {
    constructor(msg, backFn = e => true) {
        this.msg = msg
        this.backFn = backFn
        this.El = $(`
        <div class="ConfirmDialog" style="left:${392 + DialogArr.length * 10}px;top:${150 + DialogArr.length * 10}px;">
            <div class="centerY">
                <img class="msgIcon" src="${config.imgData.msgIcon}" alt="提示" />
                <div class="title">${msg}</div>
            </div>
            <div class="btns">
                <div class="btn-item center confirm">确定</div>
                <div class="btn-item center close">取消</div>
            </div>
        </div>`)

        this.init()
        // 将弹窗维护到列表
        DialogArr.push(this)
    }
    init() {
        // 绑定事件
        let confirmBtn = this.El.children('.btns').children('.confirm')[0]
        let closeBtn = this.El.children('.btns').children('.close')[0]
        $(closeBtn).click(this.close.bind(this))
        $(confirmBtn).click(this.confirm.bind(this))
        $('body').append(this.El)
    }
    close() {
        this.El.addClass('close')
        setTimeout(() => {
            this.El.remove()
        }, 300);
        let index = DialogArr.findIndex(item => item == this)
        DialogArr.splice(index, 1)
    }
    confirm() {
        if (this.backFn && this.backFn()) {
            this.close()
        }
    }
}
// 消息提示
class Message {
    constructor() {
        this.msgList = []
        this.outBox = $('<div id="message"></div>')
        $('body').append(this.outBox)
    }
    add(content, type) {
        let item = $(`<div class="msg-item ${type ? type : ''}">${content}</div>`)
        this.msgList.push(item)
        this.outBox.append(item)
        setTimeout(() => {
            this.msgList.shift().remove()
        }, 1000);
    }
}

// 组件展示
class ComponentShow {
    constructor() {
        this.El = $(`
        <div id="ComponentShow">
            <div class="page" v-for="index in pages" :key="index">
                <div class="component-item iconfont" 
                :style="{
                    color:item.color,
                    fontSize:item.size*book.zoom+'px',
                    left:item.x*book.zoom + 'px',
                    top:item.y*book.zoom + 'px',
                }"
                :class="{lock:item.lock && redact}"
                @mousedown.stop="redact?mousedown(item):''"
                @mouseup.stop="redact?mouseup():''"
                v-for="item in bookPageComponent[index]" :key="item.id">
                    {{item.type == 2 ? '&#xe62b;':'&#xe628;'}}
                    <div class="player">
                        <audio 
                        v-if="item.type == 2" 
                        :src="item.path || 'https://img.tukuppt.com/newpreview_music/00/10/94/5d819c5c4f88a75632.mp3'" controlsList="nodownload" 
                        controls 
                        />
                        <video 
                        :src="item.path || 'https://img.tukuppt.com/video_show/2418175/00/03/01/5ba1ef3e0d213.mp4'"
                        controlsList="nodownload"
                        disablePictureInPicture
                        v-else 
                        controls 
                        />
                    </div>
                </div>
            </div>
        </div>`)
        this.init()
    }
    init() {
        $('#componentContainer').append(this.El)
        this.vue = new Vue({
            el: '#ComponentShow',
            data() {
                return {
                    name: 'asdf',
                    bookPageComponent: [],
                    book: {
                        zoom: 1
                    },
                    updateData: '', // 即将修改的组件
                    pages: [],
                    // 是否可编辑
                    redact: false,
                }
            },
            created() {
                let { redact } = window.$query
                this.redact = redact == 'true'
            },
            mounted() {
                window.$eventBus.$on('bookPageComponent', this.setBookPageComponent)
                window.$eventBus.$on('resize', this.bookResize)
                window.addEventListener('mouseup', this.mouseup)
                window.$eventBus.$on('changePageFilter', this.pageChange)
                // 告诉菜单可以渲染数据了
                window.$eventBus.$emit('ComponentShow')
            },
            methods: {
                mousedown(item) {
                    this.updateData = item
                    window.addEventListener('mousemove', this.move)
                },
                mouseup() {
                    window.removeEventListener('mousemove', this.move)
                },
                move(e) {
                    // console.log(e);
                    this.updateData.x = this.updateData.x - 0 + (e.movementX / this.book.zoom)
                    this.updateData.y = this.updateData.y - 0 + (e.movementY / this.book.zoom)
                },
                setBookPageComponent(data) {
                    this.bookPageComponent = data
                    // console.log('page',this.pages);
                    this.pageChange()
                },
                // 书籍大小发生变化
                bookResize(book) {
                    // console.log(book);
                    this.book = book
                    this.pageChange()
                },
                // 页码变化
                pageChange() {
                    this.pages = window.$book.curPageStr()
                }
            }
        })
    }
}

// 资源管理器
class Explorer {
    constructor() {
        this.vue = null
        this.EL = $(`<div id="Explorer">Explorer</div>`)
        this.init()
    }
    init() {
        console.log(666);
        $('body').append(this.El)
        this.vue = new Vue({
            el: '#Explorer',
        })
    }
}