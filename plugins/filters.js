import Vue from 'vue'
import moment from 'moment'

Vue.filter('ago', function (val) {
  return (val && `${moment(val).fromNow()}`) || ''
})
