(function(win) {
  const _global = win
  const topics = {}
  let subUid = -1
  const uuid = function() { // 生成uuid
    const s = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    const uuid = s.join('')
    return uuid
  }
  // 观察者
  const pubsub = {
    publish: function(topic, args) { // 发布方法
      if (!topics[topic]) {
        return false
      }
      setTimeout(function() {
        const subscribers = topics[topic]
        let len = subscribers ? subscribers.length : 0
        while (len--) {
          subscribers[len].func(args)
        }
      }, 0)
      return true
    },
    subscribe: function(topic, func) { // 订阅方法
      if (!topics[topic]) {
        topics[topic] = []
      }
      const token = (++subUid).toString();
      topics[topic].push({
        token: token,
        func: func
      })
      return token
    },
    unsubscribe: function(token) { // 退订方法
      for (const m in topics) {
        if (topics[m]) {
          for (let i = 0, j = topics[m].length; i < j; i++) {
            if (topics[m][i].token === token) {
              topics[m].splice(i, 1)
              return token
            }
          }
        }
      }
      return false
    }
  }
  // 关于APP的部分功能参数
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  const APP = {
    handler: function(methodsName, param) { // js调用app的方法
      // param '{"uuid":"SDASDASDASDASD","data":"data"}' json字符串
      if (isIOS) {
        param = param || null
        window.webkit.messageHandlers[methodsName].postMessage(param)
      } else {
        param = param || ''
        window.nativeMethod[methodsName](param)
      }
    }
  }
  // native
  /* 支持的API. */
  const jsApiListSupport = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'startRecord']
  const native = {
    isAndroid: isAndroid,
    isIOS: isIOS,
    ready: function(param) { // {TO}
      return new Promise(function(resolve, reject) {
        try {
          if (param.token === '123456789') { // 是否有权限调用
            jsApiListSupport.forEach(element => {
              const funcName = element
              native[funcName] = function(param) { // 生成方法
                return new Promise(function(resolve, reject) {
                  try {
                    const obj = {
                      uuid: uuid(),
                      data: param
                    }
                    pubsub.subscribe(obj.uuid, function(res) { // 订阅事件
                      if (res.code === '200') {
                        resolve(res.data)
                      } else {
                        reject(res.message)
                      }
                    })
                    APP.handler(funcName, JSON.stringify(obj))// 调用app的方法
                  } catch (error) {
                    reject(error)
                  }
                })
              }
            })
            // 冻结 不能添加新的方法
            Object.freeze(native)
            resolve('初始化成功')
          } else {
            reject('初始化失败')
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    callbank: function(res) { // app回调
      try {
        if (typeof res === 'string') {
          res = JSON.parse(res)
        }
        pubsub.publish(res.uuid, res.data) // 发布事件
      } catch (error) {
        console.log(error)
      }
    }
  }
  !('native' in _global) && (_global.native = native)
  // 不允许外部覆盖native对象
  Object.defineProperty(_global, 'native', {
    configurable: false,
    writable: false
  })
}(window))
