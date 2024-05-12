const backgroundStory = [
    {
        background: "大事不好了，高雄兔三兄弟從五月天的倉庫，偷走了五份五月天要送給樂迷的簽名照，高雄兔們在高雄各地逃竄留下了足跡，還大膽的放出消息，會在一週後遠走高飛，而我們聰明的高雄熊偵探已經將足跡整理到 高雄旅遊網 裡面，但他卻分身乏術，請各位旅人伸出援手，一起把高雄兔手中的簽名照奪回",
        expectEnd: "故事結尾以兔子逃脫但留下彩蛋，可以拿彩蛋對換抽獎資格",
        itineraryId: 182
    }
]

function getBackgroundStoryByItineraryId(id) {
    return backgroundStory.find(story => {
        return story.itineraryId == id
    })
}

module.exports = {
    getBackgroundStoryByItineraryId
}