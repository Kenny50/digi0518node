class MysteryPrompt {

    mysteryTemplate(nextLocation, task, hint, en) {
        let prompt
        if (en) {
            prompt = `Now, guide the travelers to complete the specified task ${task} at ${nextLocation} without mentioning ${nextLocation} explicitly. You must describe the following hint: ${hint}. Please write a 500-word story that is engaging but factual, immersing the users in the narrative, with a focus on guiding them. Provide a detailed explanation for the hint.`
        } else {
            prompt = `現在，引導旅客完成前往 ${nextLocation} 執行指定任務 ${task}，絕對不能說出 ${nextLocation}這幾個字，必須用描述的方式提及下面的提示： ${hint} 請用 500 字描述故事，故事需要有趣但不偏離事實，並且能將用戶帶入故事，並且著重在引導，請對提示部分作出更完善的說明`
        }
        return prompt
    }
}

module.exports = MysteryPrompt;