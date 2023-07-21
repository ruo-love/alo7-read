export function navigateTo(url) {
  if (!url) return;
  wx.navigateTo({ url });
}
