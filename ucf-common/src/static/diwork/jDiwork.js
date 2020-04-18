(function (f) {
  var g;
  if (typeof window !== "undefined") {
    g = window
  } else if (typeof global !== "undefined") {
    g = global
  } else if (typeof self !== "undefined") {
    g = self
  } else {
    g = this
  }
  g.jDiwork = f()
})(function () {
  var callbackMaps = {};
  var callbackQueue = {};
  var callbackPrevents = {};
  var isReady = false;
  var uid = 0;
  var messType = 'JDIWORK';
  var originList = [
    'http://workbench.yyuap.com',
    'https://www.diwork.com',
    'https://workbench-daily.yyuap.com',
    'http://u8c-test.yyuap.com',
    'https://u8c-daily.yyuap.com',
  ];
  var origin = window.location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  originList.push(origin);

  var getUid = function () {
    return ++uid;
  };
  var emit = function (event) {
    try {
      var type = event.type.split(':');
      var name = type[0];
      var id = type[1];
      var data = typeof event.data === 'undefined' ? false : event.data;
      var map = callbackMaps[name];
      var destroy = typeof event.destroy === 'undefined' ? true : event.destroy;
    } catch (e) {
      console.log(e);
      return;
    }
    if (map && map[id]) {
      clearTimeout(map[id].timer);
      var result = map[id].callback(data);
      if (destroy) {
        delete map[id];
      }
      return result;
    }
  }
  var reg = function (name, callback, autoClear) {
    autoClear = typeof autoClear === 'undefined' ? true : autoClear;
    var map = callbackMaps[name];
    var uid = getUid();
    var callbackObj = {
      callback: callback,
      timer: autoClear ? setTimeout(function () {
        callback && callback(false);
        delete map[uid];
      }, 500) : 0
    };
    if (map) {
      map[uid] = callbackObj;
    } else {
      map = {};
      map[uid] = callbackObj;
      callbackMaps[name] = map;
    }
    return name + ':' + uid;
  };
  var cancel = function (type) {
    try {
      type = event.type.split(':');
      var name = type[0];
      var id = type[1];
      var map = callbackMaps[name];
    } catch (e) {
      console.log(e);
      return;
    }
    if (map && id && map[id]) {
      if (map[id].timer) {
        clearTimeout(map[id].timer);
      }
      delete map[id];
    } else if (map && !id) {
      for (var key in map) {
        if (map[key].timer) {
          clearTimeout(map[id].timer);
        }
        delete map[key];
      }
    }
  };
  var trigger = function (event) {
    try {
      var name = event.type;
      var data = event.data;
      var queue = callbackQueue[name];
    } catch (e) {
      console.log(e);
      return;
    }
    if (queue && queue.length) {
      for (var i = 0, l = queue.length; i < l; i++) {
        queue[i](data);
      }
    }
  };
  var on = function (name, callback) {
    var queue = callbackQueue[name];
    if (queue) {
      queue.push(callback);
    } else {
      callbackQueue[name] = [callback];
    }
  };
  var remove = function (name, callback) {
    var queue = callbackQueue[name];
    if (queue) {
      if (callback) {
        var index = queue.indexOf(callback);
        if (index !== -1) {
          queue.splice(index, 1);
        }
      } else {
        delete callbackQueue[name];
      }
    }
  };
  var postToDiwork = function (data) {
    data.messType = messType;
    window.top.postMessage(JSON.stringify(data), '*');
  };
  var ready = function (callback) {
    var event = {
      type: reg('ready', callback)
    }
    if (isReady) {
      emit(event);
    } else {
      setTimeout(function () {
        emit(event);
      }, 0);
    }
  };
  var openService = function (serviceCode, data, type, callback) {
    postToDiwork({
      detail: {
        serviceCode: serviceCode,
        data: data,
        type: type
      },
      callbackId: reg('openService', callback || function () { })
    });
  };
  var recordLog = function (serviceCode, data, callback) {
    postToDiwork({
      detail: {
        serviceCode: serviceCode,
        data: data
      },
      callbackId: reg('recordLog', callback || function () { })
    });
  };
  var updateService = function (serviceCode, data, callback) {
    postToDiwork({
      detail: {
        serviceCode: serviceCode,
        data: data,
      },
      callbackId: reg('updateService', callback || function () { })
    });
  };
  var closeDialog = function () {
    postToDiwork({
      callbackId: 'closeDialog'
    });
    cancel(this.onClose);
    if (this.btns) {
      this.btns.forEach(function (btn) {
        cancel(btn.fun);
      });
    }
    cancel('openDialog');
  }
  var openDialog = function (options, callback) {
    if (options.btns && options.btns.length) {
      options.btns = options.btns.map(function (btn, i) {
        if (btn.fun) {
          var tempBtnFun = btn.fun;
          btn.fun = reg('dialogBtnClick', function () {
            tempBtnFun(closeDialog.bind(options));
          }, false);
        } else {
          btn.fun = reg('dialogBtnClick', closeDialog.bind(options), false);
        }
        return btn;
      });
    }
    if (options.onClose) {
      var onClose = options.onClose;
      options.onClose = reg('dialogOnClose', function () {
        if (onClose()) {
          closeDialog.call(options);
        }
      }, false);
    } else {
      options.onClose = reg('dialogOnClose', closeDialog.bind(options), false);
    }
    postToDiwork({
      detail: {
        options: options
      },
      callbackId: reg('openDialog', callback)
    });
  };
  var checkServiceOpen = function (serviceCode, callback) {
    postToDiwork({
      detail: {
        serviceCode: serviceCode
      },
      callbackId: reg('checkServiceOpen', callback)
    });
  };
  var postDataToService = function (serviceCode, data, callback) {
    postToDiwork({
      detail: {
        serviceCode: serviceCode,
        data: data,
      },
      callbackId: reg('postDataToService', callback)
    });
  };
  var getContext = function (callback) {
    postToDiwork({
      callbackId: reg('getContext', callback)
    });
  };
  var onData = function (callback) {
    on('data', callback);
  };
  var switchChatTo = function (data, callback) {
    if (data.id || data.yht_id) {
      postToDiwork({
        detail: data,
        callbackId: reg('switchChatTo', callback || function () { })
      });
    } else {
      console.log('function switchChatTo need id or yht_id');
    }
  };
  var onGroupUpdated = function (callback) {
    postToDiwork({
      callbackId: reg('onGroupUpdated', callback, false)
    });
  };
  var getImGroupData = function (callback) {
    postToDiwork({
      callbackId: reg('getImGroupData', callback || function () { })
    });
  };
  var openNotifyCenter = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('openNotifyCenter', callback || function () { })
    });
  };
  var onUnReadedNumChanged = function (callback) {
    postToDiwork({
      callbackId: reg('onUnReadedNumChanged', callback, false)
    });
  };
  var openMessage = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('openMessage', callback || function () {
      })
    });
  };
  var refreshUserInfo = function (callback) {
    postToDiwork({
      callbackId: reg('refreshUserInfo', callback || function () {
      })
    });
  };
  var showDialog = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('showDialog', callback || function () {
      })
    });
  };
  var closeDialogNew = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('closeDialogNew', callback || function () {
      })
    });
  };
  var openWin = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('openWin', callback || function () { })
    });
  };
  var openFrame = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('openFrame', callback || function () { })
    });
  };
  var closeFrame = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('closeFrame', callback || function () { })
    });
  };
  var getPageParam = function (callback) {
    postToDiwork({
      callbackId: reg('getPageParam', callback)
    });
  };

  var openHomePage = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('openHomePage', callback || function () {
      })
    });
  };

  var getData = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('getData', callback)
    });
  };
  var execScript = function (data, callback) {
    postToDiwork({
      detail: data,
      callbackId: reg('execScript', callback || function () { })
    });
  };
  var addBrm = function (name, callback) {
    postToDiwork({
      detail: {
        name: name,
        url: window.location.href
      },
      callbackId: reg('addBrm', callback)
    });
  };
  var popBrm = function (index, callback) {
    postToDiwork({
      detail: {
        index: index,
        url: window.location.href
      },
      callbackId: reg('popBrm', callback)
    });
  };
  var getBrm = function (callback) {
    postToDiwork({
      callbackId: reg('getBrm', callback)
    });
  };

  window.addEventListener('DOMContentLoaded', function () {
    isReady = true;
  }, false);

  window.addEventListener('message', function (event) {
    var data = event.data;
    var origin = event.origin || event.originalEvent.origin;
    if ((originList.indexOf(origin) < 0 && origin.indexOf('yyuap') < 0 && origin.indexOf('diwork') < 0) || !data) {
      return;
    }
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
    } catch (e) {
      console.log(e);
      return;
    }
    if (data && typeof data === 'object' && data.type) {
      if (data.type.indexOf(':') < 0) {
        trigger(data);
      } else {
        emit(data);
      }
    }
  }, false);

  window.addEventListener('click', function () {
    postToDiwork({
      callbackId: 'rootClick',
    })
  }, false);

  return {
    ready: ready,
    openService: openService,
    recordLog: recordLog,
    updateService: updateService,
    getContext: getContext,
    onData: onData,
    switchChatTo: switchChatTo,
    refreshUserInfo: refreshUserInfo,
    showDialog: showDialog,
    closeDialogNew: closeDialogNew,
    openWin: openWin,
    getData: getData,
    openFrame: openFrame,
    closeFrame: closeFrame,
    getPageParam: getPageParam,
    openHomePage: openHomePage,
    onGroupUpdated: onGroupUpdated,
    getImGroupData: getImGroupData,
    openNotifyCenter: openNotifyCenter,
    onUnReadedNumChanged: onUnReadedNumChanged,
    checkServiceOpen: checkServiceOpen,
    postDataToService: postDataToService,
    execScript: execScript,
    openDialog: openDialog,
    addBrm: addBrm,
    popBrm: popBrm,
    getBrm: getBrm,
    openMessage: openMessage,
  };
});
