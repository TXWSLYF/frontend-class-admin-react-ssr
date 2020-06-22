export const showtime = (endDate = '2020/6/25') => {
    const nowtime = new Date(), //获取当前时间
        endtime = new Date(endDate); //定义结束时间
    const lefttime = endtime.getTime() - nowtime.getTime(), //距离结束时间的毫秒数
        leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
        lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24), //计算小时数
        leftm = Math.floor((lefttime / (1000 * 60)) % 60), //计算分钟数
        lefts = Math.floor((lefttime / 1000) % 60); //计算秒数
    return leftd * 24 + lefth + '小时' + leftm + '分钟' + lefts + '秒'; //返回倒计时的字符串
};
