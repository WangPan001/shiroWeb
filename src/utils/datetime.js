/**
 * 时间日期相关操作
 */


/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format (datetime) {
  return formatWithSeperator(datetime, "-", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator (datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    let year = dateMat.getFullYear();
    let month = dateMat.getMonth() + 1;
    if (month <= 9) {
      month = "0" + month;
    }
    let day = dateMat.getDate();
    if (day <= 9) {
      day = "0" + day;
    }
    let hh = dateMat.getHours();
    if (hh <= 9) {
      hh = "0" + hh;
    }
    let mm = dateMat.getMinutes();
    if (mm <= 9) {
      mm = "0" + mm;
    }
    let ss = dateMat.getSeconds();
    if (ss <= 9) {
      ss = "0" + ss;
    }
    const timeFormat = year + dateSeprator + month + dateSeprator + day + " " + hh + timeSeprator + mm + timeSeprator + ss;
    return timeFormat;
  }
}
