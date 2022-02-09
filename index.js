const axios = require('axios');
const moment = require('moment');
const minimist = require('minimist');
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

var args = minimist(process.argv.slice(2));
const webUrl = args.url;
const startTime = args.start;
const endTime = args.end;

const findShopInfo = async (shopName) => {
    return axios({
        method: 'get',
        url: `https://shopee.tw/api/v4/shop/get_shop_detail?username=${shopName}`
    });
};
const getShopId = async (shopUrl) => {
    const url = shopUrl;
    const shopName = url.replace('https://shopee.tw/', '');

    const results = await findShopInfo(shopName);
    const shopInfo = results.data.data
    const shopId = shopInfo.shopid;
    const ratingLength = shopInfo.rating_normal + shopInfo.rating_bad + shopInfo.rating_good;

    const shop = {
        shopId : shopId,
        ratingLength : ratingLength
    }
    return shop;
}

const getPage = async (shopid, pageNum, limit) => {
    return axios({
        method: 'get',
        url: `https://shopee.tw/api/v2/shop/get_ratings?` +
            `filter=0&` +
            `limit=${limit}&` +
            `offset=${pageNum * limit}&` +
            `shopid=${shopid}&` +
            `type=0`,
    });
};

const getStatistics = (ratingItems, beginTs, endTs) => {
    let sum = 0;
    for (let i = 0; i < ratingItems.length; ++i) {
        if (ratingItems[i].hasOwnProperty('mtime')){
            const itemTs = Number(ratingItems[i].mtime);
            if (itemTs > beginTs && itemTs <= endTs) {
                const itemPrice = ratingItems[i].product_items[0].price / 100000;
                sum = sum + itemPrice;
            }
        } else {
            console.error(`getStatistics: Property mtime NOT found.`);
        }
    }
    return sum;
};

const getShopRatingItems = async (shop) => {
    const shopId = shop.shopId;
    const ratingLen = shop.ratingLength;
    const LIMIT = 100;
    const TOTAL_PAGES = Math.ceil(ratingLen / LIMIT);

    let items = [];
    bar1.start(100, 0);
    for (let i = 0; i < TOTAL_PAGES; ++i) {
        bar1.increment();
        let progress = i * 100 /TOTAL_PAGES;
        bar1.update(progress);
        try {
            const results = await getPage(shopId, i, LIMIT);
            items.push(...results.data.data.items);

        } catch (err) {
            console.error(`getShopRatingItems : err = ${err}`);
        }
    }
    bar1.stop();
    return items;
}

const getRevenue = async (shopUrl, date1, date2) => {

    const shop = await getShopId(shopUrl);
    const ratingItems = await getShopRatingItems(shop);
    
    let beginTs = '';
    let endTs = '';
    const d1 = moment(date1).format('X');
    const d2 = moment(date2).format('X');
    
    if (d1 < d2){
        beginTs = d1; endTs = d2;
    } else {
        beginTs = d2; endTs = d1;
    }

    const REVENUE = getStatistics(ratingItems, beginTs, endTs);
    console.log(`The revenue is NT$${REVENUE}`)

    return;

};

const main = async function() {
    if(webUrl === undefined){
        console.log('Cannot read property "url" of null');
        return;
    }
    if(startTime === undefined){
        console.log('Cannot read property "start" of null');
        return;
    }
    if(endTime === undefined){
        console.log('Cannot read property "end" of null');
        return;
    }

    console.time('Take');
    await getRevenue(`${webUrl}`, `${startTime}`, `${endTime}`);
    console.timeEnd('Take');

}();
