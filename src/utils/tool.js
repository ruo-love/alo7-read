// import MarkdownIt from "markdown-it"

export function debounce(func, delay) {
  // 设置定时器标识
  let timer;
  // 难点返回事件绑定函数
  return function () {
    // func指定this
    let context = this;
    // func参数
    let args = arguments;
    // 先清除定时器
    clearTimeout(timer);
    //设置定时器
    timer = setTimeout(() => {
      // 调用函数
      func.apply(context, args);
    }, delay);
    return timer;
  };
}
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function throttle(fn, wait) {
  var pre = Date.now();
  return function () {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - pre >= wait) {
      fn.apply(context, args);
      pre = Date.now();
    }
  };
}

export function generateUniqueUid(length = 36) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const timestamp = Date.now().toString();
  const uidArray = [...timestamp];

  while (uidArray.length < length) {
    const randomCharacter = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    uidArray.push(randomCharacter);
  }

  const uid = uidArray.slice(0, length).join("");
  return uid;
}

export function formatDateTime(time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const formattedDateTime = `${year}年${month}月${day}日 ${hours}:${minutes}`;
  return formattedDateTime;
}

export function getTimestampOfNDaysAgo(n = 7) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - n);

  return sevenDaysAgo.getTime();
}
