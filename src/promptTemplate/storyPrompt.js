class StoryPrompt {

    initStoryTemplate(background, nextLocation) {
        return `請以 ${background} 作為故事背景，提醒旅客前往 ${nextLocation} 尋找線索`
    }

    connectStoryTemplate(background, previous, nextLocation) {
        return `請依照 ${background} 作為故事背景，${previous} 作為現在狀態，生成新故事以提示用戶前往${nextLocation} ，注意故事還沒完結`
    }

    finalStoryTemplate(background, previous, finalLocation, expectEnd) { 
        return `請依照 ${background} 作為故事背景，${previous} 作為前一段故事參考，將故事在${finalLocation} 結束，並以 ${expectEnd} 作為故事結尾`
    }
}

module.exports = StoryPrompt;