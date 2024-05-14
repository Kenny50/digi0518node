module.exports = (attractions) => {
    const listedToText = attractions.map((attraction, index) => {
        return `${index}. ${attraction.name} \n ${attraction.description} \n\n`
    }).join()
    // basic_prompts = ""
    return listedToText
}