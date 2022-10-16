export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		// cart: [],
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),

	// 模块的 mutations 方法
	mutations: {
		// 添加到购物车
		addCart(state, goods) {
			const result = state.cart.find((x) => x.goods_id === goods.goods_id)
			// 存在购物车内，商品数量加1
			if (result) {
				result.goods_count++;
			} else {
				// 不存在购物车内，直接加入进去
				state.cart.push(goods)
			}
			// 将商品持久化存储
			this.commit('m_cart/saveToStorage')
		},
		// 将商品持久化存储
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新商品的勾选状态
		updateGoodsState(state, goods) {
			const result = state.cart.find((x) => x.goods_id === goods.goods_id)
			if (result) {
				result.goods_state = goods.goods_state
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新商品数量
		updateGoodsCount(state, goods) {
			const result = state.cart.find(x => x.goods_id === goods.goods_id)
			if (result) {
				result.goods_count = goods.goods_count
				this.commit('m_cart/saveToStorage')
			}
		},
		// 购物车删除一个商品（通过商品id)
		removeGoodsById(state, goods) {
			state.cart = state.cart.filter((x) => x.goods_id !== goods.goods_id)
			this.commit('m_cart/saveToStorage')
		},
		// 实现全选或反选
		updateAllGoodsState(state, newState) {
			state.cart.forEach(x => x.goods_state = newState)
			this.commit('m_cart/saveToStorage')
		}
	},

	// 模块的 getters 属性
	getters: {
		// 统计购物车内商品的数量
		total(state) {
			let count = 0
			state.cart.forEach(goods => count += goods.goods_count)
			return count
		},
		// 勾选的商品的总数量
		checkedCount(state) {
			return state.cart.filter((x) => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		// 已勾选的商品的总价
		checkedGoodsAmount(state) {
			return state.cart.filter((x) => x.goods_state).reduce((total, item) => total += item.goods_count * item
				.goods_price, 0)
		}
	},
}
