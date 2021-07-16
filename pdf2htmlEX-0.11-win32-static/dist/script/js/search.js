
class Search {
    constructor() {
        this.pages = {}
        // 搜索结果
        this.resultList = {}
        // 初始化
        this.init()
    }
    // 数据初始化
    init() {
        let curPage = 1
        while (document.getElementById(`pf${curPage.toString(16)}`)) {
            this.pages[curPage] = document.getElementById(`pf${curPage.toString(16)}`)
            curPage++
        }
    }
    // 搜索
    query(text) {
        // 清空上次结果
        this.resultList = {}
        // 清空之前的高亮
        let oldList = $('.highlight')
        for (let key = 0; key < oldList.length; key++) {
            let parent = $(oldList[key]).parent()[0]
            if (parent) {
                parent.innerHTML = parent.innerText
            }

        }
        if (!text) return {}
        // 搜索现在的高亮
        for (const key in this.pages) {
            if (Object.hasOwnProperty.call(this.pages, key)) {
                const El = this.pages[key];
                if (this.pages[key].innerText.includes(text)) {
                    let children = this.pages[key].children[0].children
                    for (const key in children) {
                        let El = children[key]
                        let innerText = El.innerText
                        if (innerText && innerText.includes(text)) {
                            let reg = new RegExp(text, 'g')
                            innerText = innerText.replace(reg, `<span class="highlight">${text}</span>`)
                            El.innerHTML = innerText
                        }
                    }
                    // console.log(children, 'this.pages[key]');
                    this.resultList[key] = this.pages[key].innerText
                }
            }
        }
        return this.resultList
    }
}
