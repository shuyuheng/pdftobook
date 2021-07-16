
class Menu {
    constructor() {
        this.El = $(`
        <div id="menu" :class="{hidden:isHidden}" @keydown.stop>
            <div class="menu-title center">组件区域</div>
            <div class="component">
                <div class="component-item center" @click="addComponent(1)">
                    <span class="iconfont icon">&#xe61c;</span>
                    <span class="">视频</span>
                </div>
                <div class="component-item center" @click="addComponent(2)">
                    <span class="iconfont icon">&#xe623;</span>
                    <span class="">音频</span>
                </div>
            </div>
            <div class="menu-title center">
                <span class="iconfont" @click="previous">&#xe620;</span>
                <span>页面{{curPage}}</span>
                <span class="iconfont" @click="next">&#xe616;</span>
            </div>
            <div class="component-list">
                <div class="component-list-item" :class="{disabled:item.lock,active:item.select}" v-for="item in componentList" :key="item.id">
                   <div class="centerLR row-box">
                        <div class="center left">
                            <div class="checkbox" @click="item.select = !item.select"></div>
                            <div class="iconfont">&#xe61c;</div>
                            <div class="conponent-title">
                                <span>{{item.name}}</span>
                                <input v-model.trim="item.name" />
                            </div>
                        </div>
                        <div class="right center">
                            <div class="iconfont" v-if="item.lock" @click="item.lock = !item.lock">&#xe61d;</div>
                            <div class="iconfont" v-else @click="item.lock = !item.lock;item.redact = false">&#xe621;</div>
                            <div class="iconfont isDisabled" @click="item.redact = !item.redact">&#xe613;</div>
                            <div class="iconfont isDisabled" @click="delComponent(item)">&#xe618;</div>
                        </div>
                   </div>
                   <div class="redact" :class="{hidden:!item.redact}">
                        <div class="redact-container">
                            <div class="form-item">
                                <div class="label">选取素材</div>
                                <input type="text" class="input" v-model.trim="item.path" style="width:216px;" />
                            </div>
                            <div class="form-item">
                                <div class="label">图标位置</div>
                                <div class="coordinate centerLR">
                                    <div class="centerY">
                                        <span>X:</span>
                                        <input type="number" min="0" v-model.trim="item.x" class="input" style="width:66px;" />
                                    </div>
                                    <div class="centerY">
                                        <span>Y:</span>
                                        <input type="number" min="0" v-model.trim="item.y" class="input" style="width:66px;" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-item">
                                <div class="label">图标样式</div>
                                <div class="coordinate centerLR">
                                    <div class="centerY">
                                        <span>图标尺寸:</span>
                                        <input type="number" min="0" v-model.trim="item.size" class="input" style="width:66px;" />
                                    </div>
                                    <div class="centerY">
                                        <span>图标颜色:</span>
                                        <div class="colorBox">
                                            <div class="color" :style="{background:item.color}"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="color-select-box">
                                    <div class="select-option" v-for="color in colors" :key="color" :style="{background:color}" @click="item.color = color"></div>
                                </div>
                            </div>
                            <div class="save-btn center" @click="saveItem">保存</div>
                        </div>
                   </div>
                </div>
            </div>
            <div class="batch-box">
                <div class="redact" :class="{hidden:!batchFlag || !isBatch}">
                    <div class="redact-container">
                        <div class="form-item">
                            <div class="label">图标位置</div>
                            <div class="coordinate centerLR">
                                <div class="centerY">
                                    <span>X:</span>
                                    <input type="number" min="0" v-model.trim="batchData.x" class="input" style="width:66px;" />
                                </div>
                                <div class="centerY">
                                    <span>Y:</span>
                                    <input type="number" min="0" v-model.trim="batchData.y" class="input" style="width:66px;" />
                                </div>
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="label">图标样式</div>
                            <div class="coordinate centerLR">
                                <div class="centerY">
                                    <span>图标尺寸:</span>
                                    <input type="number" min="0" v-model.trim="batchData.size" class="input" style="width:66px;" />
                                </div>
                                <div class="centerY">
                                    <span>图标颜色:</span>
                                    <div class="colorBox">
                                        <div class="color" :style="{background:batchData.color}"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="color-select-box">
                                <div class="select-option" v-for="color in colors" :key="color" :style="{background:color}" @click="batchData.color = color"></div>
                            </div>
                        </div>
                        <div class="save-btn center" @click="batchSave">保存</div>
                    </div>
                </div>
            </div>
            <div class="batch-btn">
                <div class="batch-btn-item center" @click="delSelect" :class="{active:isBatch}">
                    批量删除
                </div>
                <div class="batch-btn-item center" :class="{active:isBatch}" @click="batchFlag = !batchFlag">
                    批量编辑
                </div>
            </div>
            <div class="header" v-if="isHidden">
                <div class="iconfont gohome">
                    &#xe61a;
                </div>
                <div class="search-box centerY">
                    <div class="iconfont">&#xe61b;</div>
                    <input type="text" placeholder="搜索" v-model.trim="searchVal" @keyup.enter="searchFn" />
                </div>
                <div class="paging centerY">
                    <input type="text" @input="numberInput($event,'page')" :value="page" @keyup.enter="changePage" @blur="changePage" />
                    <div class="line">/</div>
                    <div>{{totalPage}}</div>
                </div>
                <div v-if="searchResult.length && isSingle" class="mobile-search-result">
                    <div class="centerLR top-info"  @click="searchResultShow = !searchResultShow">
                        <div>搜索结果（共{{searchResult.length}}条）</div>
                        <div :class="{active:searchResultShow}">
                        <svg t="1626335152131" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3804" width="80" height="80"><path d="M876.086 337.213c-10.297-10.297-26.252-10.912-36.037-1.691l-310.009 309.983c-12.629 13.299-15.926 13.244-29.173 0l-309.983-309.983c-9.786-9.248-25.741-8.606-36.037 1.691-10.486 10.486-11.071 26.838-1.342 36.597l344.33 344.333c4.238 4.238 9.759 6.14 15.47 6.485h4.317c5.71-0.375 11.235-2.276 15.47-6.485l344.33-344.333c9.714-9.759 9.125-26.137-1.33-36.597z" fill="#ffffff" p-id="3805"></path></svg>
                        </div>
                    </div>
                    <div class="result-container" :class="{active:searchResultShow}">
                        <div class="result-list">
                            <div class="result-list-item" @click="changePage(item.page)" v-for="(item,i) in searchResult">
                                <div class="index center">{{i+1}}</div>
                                <div class="content">{{item.content}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="left-search-list" v-if="searchResult.length">
                <div class="centerLR top-info">
                    <div>搜索结果（共{{searchResult.length}}条）</div>
                </div>
                <div class="result-list">
                    <div class="result-list-item" @click="changePage(item.page)" v-for="(item,i) in searchResult">
                        <div class="index center" :class="{active:curPages.includes(item.page-0)}">{{i+1}}</div>
                        <div class="content">{{item.content}}</div>
                    </div>
                </div>
            </div>
        </div>`)
        this.width = 344
        // vue势力
        this.vue = null
        this.search = new Search()
        this.Explorer = new Explorer()
    }
    init() {
        $('body').append(this.El);
        this.El.attr('style', `
            width:${this.width}px;
        `)
        let that = this
        /* Vue start */
        this.vue = new Vue({
            el: '#menu',
            data() {
                return {
                    colors: ['#ffffff', '#000000', '#ff2727', '#ff6a27', '#ffff27', '#27ff27', '#27ffff', '#2727ff', '#ff27ff',],
                    autoId: 1, // 递增id
                    dataTemplate: { // 数据模板
                        id: 0,
                        path: 'https://img.tukuppt.com/newpreview_music/00/10/94/5d819c5c4f88a75632.mp3', // 文件路径
                        name: '组件名称',
                        x: '', // 距左距离
                        y: '', // 距上距离
                        size: 80, // 图标大小 尺寸
                        color: '#ffffff', // 图标颜色
                        lock: false, // 是否锁定
                        select: false, // 是否选中
                        redact: false, // 是否编辑
                        type: 1, // 1 视频 2 音频
                    },
                    componentList: [],
                    // bookPageComponent: {
                    //     '1': []
                    // },
                    bookPageComponent: {
                        "1": [
                            {
                                "id": 1,
                                "path": "",
                                "name": "音频组件",
                                "x": 359.7959250720465,
                                "y": 464.1523189241113,
                                "size": 80,
                                "color": "#ffffff",
                                "lock": false,
                                "select": false,
                                "redact": false,
                                "type": 2
                            },
                            {
                                "id": 4,
                                "path": "",
                                "name": "视频组件",
                                "x": 813.045337175793,
                                "y": 833.2935926993276,
                                "size": 80,
                                "color": "#ffffff",
                                "lock": false,
                                "select": false,
                                "redact": true,
                                "type": 1
                            }
                        ],
                        "2": [
                            {
                                "id": 2,
                                "path": "",
                                "name": "视频组件",
                                "x": 594.987200768492,
                                "y": 721.1494082612874,
                                "size": 80,
                                "color": "#ffffff",
                                "lock": false,
                                "select": false,
                                "redact": false,
                                "type": 1
                            }
                        ],
                        "3": [
                            {
                                "id": 3,
                                "path": "",
                                "name": "音频组件",
                                "x": 593.4296426512967,
                                "y": 763.203477425552,
                                "size": 80,
                                "color": "#ffffff",
                                "lock": false,
                                "select": false,
                                "redact": false,
                                "type": 2
                            }
                        ]
                    },
                    isHidden: true,
                    curPage: 1,
                    page: 1, // 跳转页面
                    // 搜索内容
                    searchVal: '',
                    searchResult: "", // 搜索结果
                    searchResultShow: false, //是否展开搜索结果 
                    isSingle: null,  // 是否是单页书籍 移动端
                    batchFlag: false, // 是否开启批量编辑
                    batchData: {
                        x: '', // 距左距离
                        y: '', // 距上距离
                        size: '', // 图标大小 尺寸
                        color: '', // 图标颜色
                    },
                    totalPage: window.$totalPage,
                    // 当前显示的页码 可能有两页
                    curPages: [],
                }
            },
            created() {
                this.componentList = this.bookPageComponent['1'] = this.bookPageComponent['1'] ? this.bookPageComponent['1'] : []
            },
            mounted() {
                // 获取页面参数
                let queryArr = window.location.search.substring(1).split("&");
                let query = {}
                queryArr.forEach(item => {
                    let [key, val] = item.split('=')
                    query[key] = val
                })
                // 保存路由参数
                window.$query = query
                this.isHidden = !(query.redact == 'true')
                if (!this.isHidden) {
                    //
                    setTimeout(() => {
                        window.$book.setSingle(true)
                        $('#ComponentShow').addClass('no-children-event')
                    }, 0);

                }
                // 监听eventBus
                window.$eventBus.$on('changePage', (page) => {
                    let arr = window.$book.curPageStr()
                    for (let i = 0; i < arr.length; i++) {
                        const key = arr[i];
                        this.bookPageComponent[key] = this.bookPageComponent[key] ? this.bookPageComponent[key] : []
                    }
                    this.curPages = arr
                    this.curPage = page
                    this.componentList = this.bookPageComponent[page]
                    window.$eventBus.$emit('changePageFilter')
                })
                window.$eventBus.$on('resize', this.bookResize)
                // 组件容器渲染完毕可以添加数据
                window.$eventBus.$on('ComponentShow', () => {
                    window.$eventBus.$emit('bookPageComponent', this.bookPageComponent)
                })
            },
            computed: {
                isBatch() {
                    return this.componentList.some(item => item.select)
                }
            },
            watch: {
                bookPageComponent: {
                    handler(val) {
                        window.$eventBus.$emit('bookPageComponent', val)
                    },
                    deep: true,
                    immediate: true
                },
                curPage(val) {
                    this.page = val
                },
            },
            methods: {
                // 单个保存
                saveItem() {
                    console.log('数据', this.bookPageComponent);
                },
                // 批量保存
                batchSave() {
                    for (let i = this.componentList.length - 1; i >= 0; i--) {
                        const item = this.componentList[i];
                        if (item.select) {
                            Object.keys(this.batchData).forEach(key => {
                                if (this.batchData[key] != '' && this.batchData[key] != null) {
                                    item[key] = this.batchData[key]
                                }
                            })
                        }
                    }
                    this.batchFlag = false
                    this.batchData.color = ''
                    window.$message.add('批量修改完成')
                },
                // 切换input输入框
                numberInput(e, key, min = 0) {
                    this[key] = Number(e.target.value.replace(/[^\d]*/g, ''))
                    this[key] = this[key] <= min ? min : this[key]
                    e.target.value = this[key]
                },
                // 切换页面
                changePage(page) {
                    if (!isNaN(page)) this.page = page
                    this.page = this.page <= 0 ? 1 : this.page
                    this.page = this.page > this.totalPage ? this.totalPage : this.page
                    window.$book.toPage(this.page)
                },
                // 书籍大小发生变化
                bookResize(book) {
                    // console.log(book);
                },
                delComponent(data) {
                    new ConfirmDialog('删除 “视频组件”', () => {
                        // that.message.add('删除', 'success')
                        let index = this.componentList.findIndex(item => item.id == data.id)
                        if (index != -1) {
                            this.componentList.splice(index, 1)
                            window.$message.add('删除成功')
                        } else {
                            window.$message.add('组件不存在或已删除', 'warning')
                        }

                        return true
                    })
                },
                addComponent(type) {
                    let newData = JSON.parse(JSON.stringify(this.dataTemplate))
                    newData.type = type
                    newData.name = type == 1 ? '视频组件' : '音频组件'
                    newData.id = this.autoId++
                    this.componentList.push(newData)
                },
                // 批量删除
                delSelect() {
                    new ConfirmDialog('删除这些选中的组件', () => {
                        // that.message.add('删除', 'success')
                        for (let i = this.componentList.length - 1; i >= 0; i--) {
                            const item = this.componentList[i];
                            if (item.select) {
                                this.componentList.splice(i, 1)
                            }
                        }
                        window.$message.add('已删除选中组件')
                        return true
                    })
                },
                // 下一页
                next() {
                    window.$book.next()
                },
                // 上一页
                previous() {
                    window.$book.previous()
                },
                // 搜索
                searchFn() {
                    this.curPages = window.$book.curPageStr()
                    this.searchResult = []
                    this.searchResultShow = false
                    let result = that.search.query(this.searchVal)
                    Object.keys(result).forEach(key => {
                        let strarr = result[key].replace(/^\d*/, '').split(/\n/).filter(item => item.includes(this.searchVal))
                        let obj = { page: key, content: strarr.join(',') }
                        this.searchResult.push(obj)
                    })
                    if (this.isSingle === null) {
                        this.isSingle = window.$book.isSingle
                    }
                    if (!this.isSingle && this.searchResult.length) {
                        $('body').css({ paddingLeft: '344px' })
                    } else {
                        $('body').css({ paddingLeft: '0px' })
                    }
                    if (this.searchResult.length <= 0 && this.searchVal) {
                        return window.$message.add('未搜索到关键字', 'warning')
                    }
                    setTimeout(() => {
                        window.$book.resize()
                    }, 400);
                },
            }
        })
        /* Vue end */
    }
    // 删除菜单
    remove() {
        this.El.remove()
    }
}