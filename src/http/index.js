const env=import.meta.env
console.log(env)
const request = function(method, url, data, options) {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中'
		})
		uni.request({
			method,
			url: env.VITE_api_base + url,
			data,
			success(res) {
				uni.hideLoading()
				if (res.statusCode >= 400) {
					uni.showToast({
						title: res.data,
						icon: "none"
					})
					reject(res.data)
				} else {
					resolve(res.data)
				}

			},
			fail(err) {
				uni.hideLoading()
				reject(err)
			},
			...options,

		})
	})
}

export default request