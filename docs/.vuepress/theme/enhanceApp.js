import postMixin from '@theme/mixins/posts'
// 拉取评论与注释
import Comments from './components/other/Comments'
import AccessNumber from './components/other/AccessNumber.vue'
import Pagation from './components/other/Pagation.vue'

export default ({
  Vue
}) => {
  Vue.mixin(postMixin)
  Vue.component('Comments', Comments)
  Vue.component('AccessNumber', AccessNumber)
  Vue.component('Pagation', Pagation)
}
