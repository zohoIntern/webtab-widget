var ZFAPPS = (function () {
  var e;
  function t(e = {}) {
    var t,
      n,
      r,
      i,
      o,
      s = e.inheritStyles || {},
      a = e.zfFontSrc,
      c = e.themeInfo || {};
    !(function (e) {
      var t = window.document.body,
        n = document.documentElement;
      Object.keys(e).forEach((t) => {
        n.style.setProperty("--zf-" + t, e[t]);
      }),
        Object.assign(t.style, e);
    })(s),
      (t = a),
      ((n = document.createElement("link")).type = "text/css"),
      (n.href = t),
      (n.rel = "stylesheet"),
      t && document.getElementsByTagName("head")[0].appendChild(n),
      (r = c),
      (i = Object.keys(r)),
      (o = document.documentElement),
      i.forEach((e) => {
        o.style.setProperty("--zf-" + e, r[e]);
      });
  }
  return {
    extension: {
      init: function () {
        return (
          (e = ZSDK.Init()),
          new Promise(function (n, r) {
            e.on("Load", function (r) {
              t(r.meta), (r.instance = e), n(r);
            });
          })
        );
      },
    },
    get: function (t, n) {
      var r = { type: "GET_DATA", property: t, value: n };
      return e._sendEvent("ZF_EVENT", r, !0);
    },
    request: function (t) {
      var n = { type: "FETCH_DATA", data: t };
      t.hasOwnProperty("attachments") &&
        (t.attachments || []).forEach((n, r) => {
          t.attachments[r].value = e.getFileObject(n.value);
        });
      return e._sendEvent("ZF_EVENT", n, !0);
    },
    set: function (t, n) {
      var r = { type: "SET_DATA", property: t, value: n };
      return e._sendEvent("ZF_EVENT", r, !0);
    },
    invoke: function (t, n, r) {
      var i = {};
      "RESIZE" == t
        ? (i = {
            type: "RESIZE",
            property: n || {
              height: document.documentElement.offsetHeight,
              width: document.documentElement.offsetWidth,
            },
            value: r,
          })
        : (i = { type: t, property: n, value: r });
      return e._sendEvent("ZF_EVENT", i, !0);
    },
    showModal: function (t) {
      var n = {
        url: t.url,
        height: t.height,
        width: t.width,
        widget_type: "modal",
      };
      return e.modal(n);
    },
    closeModal: function (t) {
      var n = { type: "CLOSE_MODAL", widgetID: t };
      return e._sendEvent("ZF_EVENT", n, !0);
    },
    store: function (t, n) {
      var r = {
        type: "STORE_DATA",
        property: t,
        value: n.value,
        storage_type: n.type,
      };
      return e._sendEvent("ZF_EVENT", r, !0);
    },
    retrieve: function (t) {
      var n = { type: "RETRIEVE_DATA", property: t };
      return e._sendEvent("ZF_EVENT", n, !0);
    },
    showWidget: function (t) {
      var n = { type: "SHOW_WIDGET", name: t };
      return e._sendEvent("ZF_EVENT", n, !0);
    },
    hideWidget: function (t) {
      var n = { type: "HIDE_WIDGET", name: t };
      return e._sendEvent("ZF_EVENT", n, !0);
    },
  };
})(),
ZSDKUtil = (function (e) {
  var t,
    n = i();
  function r() {}
  function i(e) {
    var t = {},
      n = e || window.location.href;
    return (
      n
        .substr(n.indexOf("?") + 1)
        .split("&")
        .forEach(function (e) {
          var n = e.split("=");
          t[n[0]] = n[1];
        }),
      t.hasOwnProperty("serviceOrigin") &&
        (t.serviceOrigin = decodeURIComponent(t.serviceOrigin)),
      t
    );
  }
  return (
    (r.prototype.Info = function () {
      (e.isDevMode() || e.isLogEnabled()) &&
        console.info.apply(console, arguments);
    }),
    (r.prototype.Error = console.error),
    (e.GetQueryParams = i),
    (e.isDevMode = function () {
      return n && n.isDevMode;
    }),
    (e.isLogEnabled = function () {
      return n && n.isLogEnabled;
    }),
    (e.getLogger = function () {
      return (t && t instanceof r) || (t = new r()), t;
    }),
    e
  );
})(window.ZSDKUtil || {}),
ZSDKMessageManager = (function (e) {
  var t,
    n,
    r,
    i = ZSDKUtil.getLogger(),
    o = 100,
    s = {},
    a = ZSDKUtil.GetQueryParams();
  function c(e) {
    var o;
    try {
      o = "string" == typeof e.data ? JSON.parse(e.data) : e.data;
    } catch (t) {
      o = e.data;
    }
    var c,
      g,
      v,
      f,
      _,
      y,
      h,
      l = o.type;
    try {
      if (
        "__REGISTER__" === l ||
        ((y = (_ = e).source),
        (h = _.origin),
        (t.isRegistered() && n === y && r === h) ||
          new Error("Un-Authorized Message."))
      )
        switch (l) {
          case "__REGISTER__":
            !(function (e, i) {
              (n = window.parent), (r = a.serviceOrigin);
              var o = window.location.origin;
              (t.dcType = o.split(".").pop().toUpperCase()),
                "COM" === t.dcType && (t.dcType = "US");
              (t.key = i.uniqueID),
                (t.parentWindow = n),
                (t._isRegistered = !0),
                p(
                  {
                    type: "__REGISTER__",
                    widgetOrigin: E(),
                    uniqueID: t.key,
                  },
                  t
                );
              var s = i.data;
              u(t, "Load", s);
            })(0, o);
            break;
          case "__EVENT_RESPONSE__":
            (g = (c = o).promiseID),
              (v = c.data),
              (f = c.isSuccess),
              s.hasOwnProperty(g) &&
                (f ? s[g].resolve(v) : s[g].reject(v),
                (s[g] = void 0),
                delete s[g]);
            break;
          default:
            !(function (e, n) {
              var r,
                i = n.widgetID,
                o = n.eventName;
              if (t.key === i) r = u(t, o, n.data);
              else {
                var s = t._childWidgets[i];
                s && (r = u(s, o, n.data));
              }
              if (n.isPromise) {
                var a = {};
                Promise.all(r)
                  .then(function (e) {
                    (a.response = e),
                      (a.widgetID = i),
                      (a.sourceWidgetID = t.key),
                      d(n, a);
                  })
                  .catch(function (e) {
                    (a.response = e),
                      (a.widgetID = i),
                      (a.sourceWidgetID = t.key),
                      d(n, a);
                  });
              }
            })(0, o);
        }
    } catch (e) {
      i.Error("[SDK.MessageHandler] => ", e.stack);
    }
  }
  function d(e, n) {
    p(
      {
        type: "__EVENT_RESPONSE__",
        widgetOrigin: E(),
        uniqueID: t.key,
        eventName: e.eventName,
        data: n,
        promiseID: e.promiseID,
      },
      t
    );
  }
  function u(e, t, n) {
    var r = e.eventHandlers[t],
      i = [];
    if (Array.isArray(r))
      for (var o = 0; o < r.length; o++) {
        var s, a;
        try {
          a =
            (s = r[o].call(e, n)) instanceof Promise
              ? s
                  .then(function (e) {
                    return { isSuccess: !0, response: e };
                  })
                  .catch(function (e) {
                    return { isSuccess: !1, response: e };
                  })
              : { isSuccess: !0, response: s };
        } catch (e) {
          a = { isSuccess: !1, response: e };
        }
        i.push(a);
      }
    return i;
  }
  function p(e, t) {
    var n,
      r,
      i = e.isPromise;
    if (
      (i && ((n = "Promise" + o++), (e.promiseID = n)),
      t && ((e.uniqueID = (t.parentWidget || t).key), (e.widgetID = t.key)),
      (e.time = new Date().getTime()),
      v(e),
      i)
    )
      return (
        (r = n),
        new Promise(function (e, t) {
          s[r] = { resolve: e, reject: t, time: new Date().getTime() };
        })
      );
  }
  function g() {
    v({ type: "__DEREGISTER__", uniqueID: t.key });
  }
  function v(e) {
    if (
      ("object" == typeof e && (e.widgetOrigin = encodeURIComponent(E())), !n)
    )
      throw new Error("Parentwindow reference not found.");
    n.postMessage(e, a.serviceOrigin);
  }
  function E() {
    return (
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname
    );
  }
  return (
    (e.Init = function (e) {
      (t = e),
        window.addEventListener("message", c),
        window.addEventListener("unload", g);
    }),
    (e.SendEvent = p),
    e
  );
})(window.ZSDKMessageManager || {});
window.ZSDK = (function () {
var e,
  t = ZSDKUtil.GetQueryParams();
function n(e) {
  (this.serviceOrigin = e.serviceOrigin || t.serviceOrigin),
    (this.parentWidget = e.parentWidget),
    (this.key = e.key),
    (this._isRegistered = !1),
    (this._childWidgets = {}),
    (this.eventHandlers = Object.create(null)),
    this.meta;
}
return (
  (n.prototype.on = function (e, t) {
    if ("string" != typeof e)
      throw new Error("Invalid eventname parameter passed.");
    if ("function" != typeof t)
      throw new Error("Invalid function parameter passed.");
    var n = this.eventHandlers[e];
    if (
      (Array.isArray(n) || (this.eventHandlers[e] = n = []),
      n.push(t),
      "Load" !== e)
    ) {
      var r = { type: "__EVENT_BIND__", eventName: e, count: n.length };
      (this.parentWidget && !this.parentWidget.isRegistered()) ||
      (!this.parentWidget && !this.isRegistered())
        ? (this.parentWidget || this).on("Load", function () {
            ZSDKMessageManager.SendEvent(r, this);
          })
        : ZSDKMessageManager.SendEvent(r, this);
    }
  }),
  (n.prototype._sendEvent = function (e, t, n) {
    var r = { type: "__EVENT__", eventName: e, data: t, isPromise: n };
    return ZSDKMessageManager.SendEvent(r, this);
  }),
  (n.prototype.emit = function (e, t) {
    var n = { type: "__EMIT__", eventName: e, data: t };
    ZSDKMessageManager.SendEvent(n, this);
  }),
  (n.prototype.isRegistered = function () {
    return this._isRegistered;
  }),
  (n.prototype.fetch = function (e) {
    var t = { eventName: "__HTTP__", isPromise: !0, options: e };
    return ZSDKMessageManager.SendEvent(t, this);
  }),
  (n.prototype.createInstance = function (e) {
    var t = { eventName: "__CREATE_INSTANCE__", isPromise: !0, options: e };
    return ZSDKMessageManager.SendEvent(t, this);
  }),
  (n.prototype.modal = function (e) {
    return (
      "object" == typeof e && (e.location = "__MODAL__"),
      this.createInstance(e)
    );
  }),
  (n.prototype.getWidgets = function () {
    return ZSDKMessageManager.SendEvent(
      { eventName: "__WIDGETS_INFO__", isPromise: !0 },
      this
    );
  }),
  (n.prototype.getWidgetInstance = function (e) {
    if ("string" != typeof e) throw new Error("Invalid WidgetID passed");
    if (this.parentWidget) return this.parentWidget.getWidgetInstance(e);
    var t = this._childWidgets[e];
    return (
      t ||
        (this._childWidgets[e] = t = new n({ key: e, parentWidget: this })),
      t
    );
  }),
  (n.prototype.getFileObject = function (e) {
    return new File([e.slice(0, e.size)], e.name, { type: e.type });
  }),
  {
    Init: function () {
      return (
        e ||
        ((e = new n({ serviceOrigin: t.serviceOrigin })),
        ZSDKMessageManager.Init(e),
        e)
      );
    },
    _getRootInstance: function () {
      return e;
    },
  }
);
})();
