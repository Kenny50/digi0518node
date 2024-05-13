const cheerio = require("cheerio");
const axios = require("axios");

const getData = async (query) => {
    try {
        const url = `https://www.google.com/search?q=${query}`;
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
            }
        })
        const arr = []
        const $ = cheerio.load(response.data)
        $('body').find('h3.LC20lb.MBeuO.DKV0Md').each((i, e) => {
            arr.push($(e).text())
        })
        $('body').find('div.VwiC3b.yXK7lf.lVm3ye.r025kc.hJNv6b').each((i, e) => {
            arr.push($(e).text())
        })
        return arr
    } catch (e) {
        console.log(e);
        return null
    }
}
function crawlerRouter(app) {
    app.get('/crawler', async (req, res) => {
        const { query } = req.query
        console.log(query)
        const googleResult = await getData(query)
        res.json(googleResult)
    })
}

module.exports = crawlerRouter;
// getData();