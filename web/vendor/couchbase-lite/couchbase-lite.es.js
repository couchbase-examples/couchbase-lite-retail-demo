var fy = Object.defineProperty;
var Kh = (n) => {
  throw TypeError(n);
};
var hy = (n, e, t) => e in n ? fy(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var ve = (n, e, t) => hy(n, typeof e != "symbol" ? e + "" : e, t), Uu = (n, e, t) => e.has(n) || Kh("Cannot " + t);
var p = (n, e, t) => (Uu(n, e, "read from private field"), t ? t.call(n) : e.get(n)), ee = (n, e, t) => e.has(n) ? Kh("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), G = (n, e, t, r) => (Uu(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t), ye = (n, e, t) => (Uu(n, e, "access private method"), t);
var Nr = (n, e, t, r) => ({
  set _(i) {
    G(n, e, i, t);
  },
  get _() {
    return p(n, e, r);
  }
});
function Ue(n, e = "", ...t) {
  n || Fo(e, ...t);
}
function Nn(n, e) {
  n === void 0 && Fo(`${e ?? "something"} is unexpectedly undefined`);
}
function py(n, e, t = "value") {
  n !== e && Fo(`${t} should be ${e} but is actually ${n}`);
}
function Fo(n, ...e) {
  throw console.error(n || "assertion failed", ...e), Error("Assertion failed: " + n);
}
function yr(n, e, t) {
  if (!n)
    throw console.error(`Check failed: ${e}`), new (t ?? Error)(e);
}
function zh(n, e) {
  return yr(typeof n == "number", `${e ?? "value"} must be a number`, TypeError), n;
}
function dy(n, e) {
  return yr(typeof n == "string", "value must be a string", TypeError), n;
}
var xf = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ef(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var $u = { exports: {} }, wa = { exports: {} }, Gh;
function fo() {
  return Gh || (Gh = 1, typeof Object.create == "function" ? wa.exports = function(e, t) {
    t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : wa.exports = function(e, t) {
    if (t) {
      e.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
    }
  }), wa.exports;
}
var xa = { exports: {} }, ju = {}, ko = {}, Hh;
function vy() {
  if (Hh) return ko;
  Hh = 1, ko.byteLength = l, ko.toByteArray = b, ko.fromByteArray = x;
  for (var n = [], e = [], t = typeof Uint8Array < "u" ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, o = r.length; i < o; ++i)
    n[i] = r[i], e[r.charCodeAt(i)] = i;
  e[45] = 62, e[95] = 63;
  function a(k) {
    var D = k.length;
    if (D % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var K = k.indexOf("=");
    K === -1 && (K = D);
    var C = K === D ? 0 : 4 - K % 4;
    return [K, C];
  }
  function l(k) {
    var D = a(k), K = D[0], C = D[1];
    return (K + C) * 3 / 4 - C;
  }
  function c(k, D, K) {
    return (D + K) * 3 / 4 - K;
  }
  function b(k) {
    var D, K = a(k), C = K[0], M = K[1], J = new t(c(k, C, M)), X = 0, le = M > 0 ? C - 4 : C, ce;
    for (ce = 0; ce < le; ce += 4)
      D = e[k.charCodeAt(ce)] << 18 | e[k.charCodeAt(ce + 1)] << 12 | e[k.charCodeAt(ce + 2)] << 6 | e[k.charCodeAt(ce + 3)], J[X++] = D >> 16 & 255, J[X++] = D >> 8 & 255, J[X++] = D & 255;
    return M === 2 && (D = e[k.charCodeAt(ce)] << 2 | e[k.charCodeAt(ce + 1)] >> 4, J[X++] = D & 255), M === 1 && (D = e[k.charCodeAt(ce)] << 10 | e[k.charCodeAt(ce + 1)] << 4 | e[k.charCodeAt(ce + 2)] >> 2, J[X++] = D >> 8 & 255, J[X++] = D & 255), J;
  }
  function m(k) {
    return n[k >> 18 & 63] + n[k >> 12 & 63] + n[k >> 6 & 63] + n[k & 63];
  }
  function w(k, D, K) {
    for (var C, M = [], J = D; J < K; J += 3)
      C = (k[J] << 16 & 16711680) + (k[J + 1] << 8 & 65280) + (k[J + 2] & 255), M.push(m(C));
    return M.join("");
  }
  function x(k) {
    for (var D, K = k.length, C = K % 3, M = [], J = 16383, X = 0, le = K - C; X < le; X += J)
      M.push(w(k, X, X + J > le ? le : X + J));
    return C === 1 ? (D = k[K - 1], M.push(
      n[D >> 2] + n[D << 4 & 63] + "=="
    )) : C === 2 && (D = (k[K - 2] << 8) + k[K - 1], M.push(
      n[D >> 10] + n[D >> 4 & 63] + n[D << 2 & 63] + "="
    )), M.join("");
  }
  return ko;
}
var Ea = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Wh;
function gy() {
  return Wh || (Wh = 1, Ea.read = function(n, e, t, r, i) {
    var o, a, l = i * 8 - r - 1, c = (1 << l) - 1, b = c >> 1, m = -7, w = t ? i - 1 : 0, x = t ? -1 : 1, k = n[e + w];
    for (w += x, o = k & (1 << -m) - 1, k >>= -m, m += l; m > 0; o = o * 256 + n[e + w], w += x, m -= 8)
      ;
    for (a = o & (1 << -m) - 1, o >>= -m, m += r; m > 0; a = a * 256 + n[e + w], w += x, m -= 8)
      ;
    if (o === 0)
      o = 1 - b;
    else {
      if (o === c)
        return a ? NaN : (k ? -1 : 1) * (1 / 0);
      a = a + Math.pow(2, r), o = o - b;
    }
    return (k ? -1 : 1) * a * Math.pow(2, o - r);
  }, Ea.write = function(n, e, t, r, i, o) {
    var a, l, c, b = o * 8 - i - 1, m = (1 << b) - 1, w = m >> 1, x = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, k = r ? 0 : o - 1, D = r ? 1 : -1, K = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (l = isNaN(e) ? 1 : 0, a = m) : (a = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -a)) < 1 && (a--, c *= 2), a + w >= 1 ? e += x / c : e += x * Math.pow(2, 1 - w), e * c >= 2 && (a++, c /= 2), a + w >= m ? (l = 0, a = m) : a + w >= 1 ? (l = (e * c - 1) * Math.pow(2, i), a = a + w) : (l = e * Math.pow(2, w - 1) * Math.pow(2, i), a = 0)); i >= 8; n[t + k] = l & 255, k += D, l /= 256, i -= 8)
      ;
    for (a = a << i | l, b += i; b > 0; n[t + k] = a & 255, k += D, a /= 256, b -= 8)
      ;
    n[t + k - D] |= K * 128;
  }), Ea;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Yh;
function yy() {
  return Yh || (Yh = 1, function(n) {
    const e = vy(), t = gy(), r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    n.Buffer = l, n.SlowBuffer = J, n.INSPECT_MAX_BYTES = 50;
    const i = 2147483647;
    n.kMaxLength = i, l.TYPED_ARRAY_SUPPORT = o(), !l.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function o() {
      try {
        const S = new Uint8Array(1), d = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(d, Uint8Array.prototype), Object.setPrototypeOf(S, d), S.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(l.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (l.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(l.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (l.isBuffer(this))
          return this.byteOffset;
      }
    });
    function a(S) {
      if (S > i)
        throw new RangeError('The value "' + S + '" is invalid for option "size"');
      const d = new Uint8Array(S);
      return Object.setPrototypeOf(d, l.prototype), d;
    }
    function l(S, d, v) {
      if (typeof S == "number") {
        if (typeof d == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return w(S);
      }
      return c(S, d, v);
    }
    l.poolSize = 8192;
    function c(S, d, v) {
      if (typeof S == "string")
        return x(S, d);
      if (ArrayBuffer.isView(S))
        return D(S);
      if (S == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof S
        );
      if (Qe(S, ArrayBuffer) || S && Qe(S.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Qe(S, SharedArrayBuffer) || S && Qe(S.buffer, SharedArrayBuffer)))
        return K(S, d, v);
      if (typeof S == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const R = S.valueOf && S.valueOf();
      if (R != null && R !== S)
        return l.from(R, d, v);
      const y = C(S);
      if (y) return y;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof S[Symbol.toPrimitive] == "function")
        return l.from(S[Symbol.toPrimitive]("string"), d, v);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof S
      );
    }
    l.from = function(S, d, v) {
      return c(S, d, v);
    }, Object.setPrototypeOf(l.prototype, Uint8Array.prototype), Object.setPrototypeOf(l, Uint8Array);
    function b(S) {
      if (typeof S != "number")
        throw new TypeError('"size" argument must be of type number');
      if (S < 0)
        throw new RangeError('The value "' + S + '" is invalid for option "size"');
    }
    function m(S, d, v) {
      return b(S), S <= 0 ? a(S) : d !== void 0 ? typeof v == "string" ? a(S).fill(d, v) : a(S).fill(d) : a(S);
    }
    l.alloc = function(S, d, v) {
      return m(S, d, v);
    };
    function w(S) {
      return b(S), a(S < 0 ? 0 : M(S) | 0);
    }
    l.allocUnsafe = function(S) {
      return w(S);
    }, l.allocUnsafeSlow = function(S) {
      return w(S);
    };
    function x(S, d) {
      if ((typeof d != "string" || d === "") && (d = "utf8"), !l.isEncoding(d))
        throw new TypeError("Unknown encoding: " + d);
      const v = X(S, d) | 0;
      let R = a(v);
      const y = R.write(S, d);
      return y !== v && (R = R.slice(0, y)), R;
    }
    function k(S) {
      const d = S.length < 0 ? 0 : M(S.length) | 0, v = a(d);
      for (let R = 0; R < d; R += 1)
        v[R] = S[R] & 255;
      return v;
    }
    function D(S) {
      if (Qe(S, Uint8Array)) {
        const d = new Uint8Array(S);
        return K(d.buffer, d.byteOffset, d.byteLength);
      }
      return k(S);
    }
    function K(S, d, v) {
      if (d < 0 || S.byteLength < d)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (S.byteLength < d + (v || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let R;
      return d === void 0 && v === void 0 ? R = new Uint8Array(S) : v === void 0 ? R = new Uint8Array(S, d) : R = new Uint8Array(S, d, v), Object.setPrototypeOf(R, l.prototype), R;
    }
    function C(S) {
      if (l.isBuffer(S)) {
        const d = M(S.length) | 0, v = a(d);
        return v.length === 0 || S.copy(v, 0, 0, d), v;
      }
      if (S.length !== void 0)
        return typeof S.length != "number" || Et(S.length) ? a(0) : k(S);
      if (S.type === "Buffer" && Array.isArray(S.data))
        return k(S.data);
    }
    function M(S) {
      if (S >= i)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
      return S | 0;
    }
    function J(S) {
      return +S != S && (S = 0), l.alloc(+S);
    }
    l.isBuffer = function(d) {
      return d != null && d._isBuffer === !0 && d !== l.prototype;
    }, l.compare = function(d, v) {
      if (Qe(d, Uint8Array) && (d = l.from(d, d.offset, d.byteLength)), Qe(v, Uint8Array) && (v = l.from(v, v.offset, v.byteLength)), !l.isBuffer(d) || !l.isBuffer(v))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (d === v) return 0;
      let R = d.length, y = v.length;
      for (let T = 0, L = Math.min(R, y); T < L; ++T)
        if (d[T] !== v[T]) {
          R = d[T], y = v[T];
          break;
        }
      return R < y ? -1 : y < R ? 1 : 0;
    }, l.isEncoding = function(d) {
      switch (String(d).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, l.concat = function(d, v) {
      if (!Array.isArray(d))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (d.length === 0)
        return l.alloc(0);
      let R;
      if (v === void 0)
        for (v = 0, R = 0; R < d.length; ++R)
          v += d[R].length;
      const y = l.allocUnsafe(v);
      let T = 0;
      for (R = 0; R < d.length; ++R) {
        let L = d[R];
        if (Qe(L, Uint8Array))
          T + L.length > y.length ? (l.isBuffer(L) || (L = l.from(L)), L.copy(y, T)) : Uint8Array.prototype.set.call(
            y,
            L,
            T
          );
        else if (l.isBuffer(L))
          L.copy(y, T);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        T += L.length;
      }
      return y;
    };
    function X(S, d) {
      if (l.isBuffer(S))
        return S.length;
      if (ArrayBuffer.isView(S) || Qe(S, ArrayBuffer))
        return S.byteLength;
      if (typeof S != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof S
        );
      const v = S.length, R = arguments.length > 2 && arguments[2] === !0;
      if (!R && v === 0) return 0;
      let y = !1;
      for (; ; )
        switch (d) {
          case "ascii":
          case "latin1":
          case "binary":
            return v;
          case "utf8":
          case "utf-8":
            return st(S).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return v * 2;
          case "hex":
            return v >>> 1;
          case "base64":
            return Ot(S).length;
          default:
            if (y)
              return R ? -1 : st(S).length;
            d = ("" + d).toLowerCase(), y = !0;
        }
    }
    l.byteLength = X;
    function le(S, d, v) {
      let R = !1;
      if ((d === void 0 || d < 0) && (d = 0), d > this.length || ((v === void 0 || v > this.length) && (v = this.length), v <= 0) || (v >>>= 0, d >>>= 0, v <= d))
        return "";
      for (S || (S = "utf8"); ; )
        switch (S) {
          case "hex":
            return Ke(this, d, v);
          case "utf8":
          case "utf-8":
            return Me(this, d, v);
          case "ascii":
            return we(this, d, v);
          case "latin1":
          case "binary":
            return He(this, d, v);
          case "base64":
            return Se(this, d, v);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return It(this, d, v);
          default:
            if (R) throw new TypeError("Unknown encoding: " + S);
            S = (S + "").toLowerCase(), R = !0;
        }
    }
    l.prototype._isBuffer = !0;
    function ce(S, d, v) {
      const R = S[d];
      S[d] = S[v], S[v] = R;
    }
    l.prototype.swap16 = function() {
      const d = this.length;
      if (d % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let v = 0; v < d; v += 2)
        ce(this, v, v + 1);
      return this;
    }, l.prototype.swap32 = function() {
      const d = this.length;
      if (d % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let v = 0; v < d; v += 4)
        ce(this, v, v + 3), ce(this, v + 1, v + 2);
      return this;
    }, l.prototype.swap64 = function() {
      const d = this.length;
      if (d % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let v = 0; v < d; v += 8)
        ce(this, v, v + 7), ce(this, v + 1, v + 6), ce(this, v + 2, v + 5), ce(this, v + 3, v + 4);
      return this;
    }, l.prototype.toString = function() {
      const d = this.length;
      return d === 0 ? "" : arguments.length === 0 ? Me(this, 0, d) : le.apply(this, arguments);
    }, l.prototype.toLocaleString = l.prototype.toString, l.prototype.equals = function(d) {
      if (!l.isBuffer(d)) throw new TypeError("Argument must be a Buffer");
      return this === d ? !0 : l.compare(this, d) === 0;
    }, l.prototype.inspect = function() {
      let d = "";
      const v = n.INSPECT_MAX_BYTES;
      return d = this.toString("hex", 0, v).replace(/(.{2})/g, "$1 ").trim(), this.length > v && (d += " ... "), "<Buffer " + d + ">";
    }, r && (l.prototype[r] = l.prototype.inspect), l.prototype.compare = function(d, v, R, y, T) {
      if (Qe(d, Uint8Array) && (d = l.from(d, d.offset, d.byteLength)), !l.isBuffer(d))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof d
        );
      if (v === void 0 && (v = 0), R === void 0 && (R = d ? d.length : 0), y === void 0 && (y = 0), T === void 0 && (T = this.length), v < 0 || R > d.length || y < 0 || T > this.length)
        throw new RangeError("out of range index");
      if (y >= T && v >= R)
        return 0;
      if (y >= T)
        return -1;
      if (v >= R)
        return 1;
      if (v >>>= 0, R >>>= 0, y >>>= 0, T >>>= 0, this === d) return 0;
      let L = T - y, ue = R - v;
      const B = Math.min(L, ue), q = this.slice(y, T), _ = d.slice(v, R);
      for (let se = 0; se < B; ++se)
        if (q[se] !== _[se]) {
          L = q[se], ue = _[se];
          break;
        }
      return L < ue ? -1 : ue < L ? 1 : 0;
    };
    function fe(S, d, v, R, y) {
      if (S.length === 0) return -1;
      if (typeof v == "string" ? (R = v, v = 0) : v > 2147483647 ? v = 2147483647 : v < -2147483648 && (v = -2147483648), v = +v, Et(v) && (v = y ? 0 : S.length - 1), v < 0 && (v = S.length + v), v >= S.length) {
        if (y) return -1;
        v = S.length - 1;
      } else if (v < 0)
        if (y) v = 0;
        else return -1;
      if (typeof d == "string" && (d = l.from(d, R)), l.isBuffer(d))
        return d.length === 0 ? -1 : oe(S, d, v, R, y);
      if (typeof d == "number")
        return d = d & 255, typeof Uint8Array.prototype.indexOf == "function" ? y ? Uint8Array.prototype.indexOf.call(S, d, v) : Uint8Array.prototype.lastIndexOf.call(S, d, v) : oe(S, [d], v, R, y);
      throw new TypeError("val must be string, number or Buffer");
    }
    function oe(S, d, v, R, y) {
      let T = 1, L = S.length, ue = d.length;
      if (R !== void 0 && (R = String(R).toLowerCase(), R === "ucs2" || R === "ucs-2" || R === "utf16le" || R === "utf-16le")) {
        if (S.length < 2 || d.length < 2)
          return -1;
        T = 2, L /= 2, ue /= 2, v /= 2;
      }
      function B(_, se) {
        return T === 1 ? _[se] : _.readUInt16BE(se * T);
      }
      let q;
      if (y) {
        let _ = -1;
        for (q = v; q < L; q++)
          if (B(S, q) === B(d, _ === -1 ? 0 : q - _)) {
            if (_ === -1 && (_ = q), q - _ + 1 === ue) return _ * T;
          } else
            _ !== -1 && (q -= q - _), _ = -1;
      } else
        for (v + ue > L && (v = L - ue), q = v; q >= 0; q--) {
          let _ = !0;
          for (let se = 0; se < ue; se++)
            if (B(S, q + se) !== B(d, se)) {
              _ = !1;
              break;
            }
          if (_) return q;
        }
      return -1;
    }
    l.prototype.includes = function(d, v, R) {
      return this.indexOf(d, v, R) !== -1;
    }, l.prototype.indexOf = function(d, v, R) {
      return fe(this, d, v, R, !0);
    }, l.prototype.lastIndexOf = function(d, v, R) {
      return fe(this, d, v, R, !1);
    };
    function ke(S, d, v, R) {
      v = Number(v) || 0;
      const y = S.length - v;
      R ? (R = Number(R), R > y && (R = y)) : R = y;
      const T = d.length;
      R > T / 2 && (R = T / 2);
      let L;
      for (L = 0; L < R; ++L) {
        const ue = parseInt(d.substr(L * 2, 2), 16);
        if (Et(ue)) return L;
        S[v + L] = ue;
      }
      return L;
    }
    function De(S, d, v, R) {
      return qe(st(d, S.length - v), S, v, R);
    }
    function Ce(S, d, v, R) {
      return qe(Le(d), S, v, R);
    }
    function $e(S, d, v, R) {
      return qe(Ot(d), S, v, R);
    }
    function Be(S, d, v, R) {
      return qe(kt(d, S.length - v), S, v, R);
    }
    l.prototype.write = function(d, v, R, y) {
      if (v === void 0)
        y = "utf8", R = this.length, v = 0;
      else if (R === void 0 && typeof v == "string")
        y = v, R = this.length, v = 0;
      else if (isFinite(v))
        v = v >>> 0, isFinite(R) ? (R = R >>> 0, y === void 0 && (y = "utf8")) : (y = R, R = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const T = this.length - v;
      if ((R === void 0 || R > T) && (R = T), d.length > 0 && (R < 0 || v < 0) || v > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      y || (y = "utf8");
      let L = !1;
      for (; ; )
        switch (y) {
          case "hex":
            return ke(this, d, v, R);
          case "utf8":
          case "utf-8":
            return De(this, d, v, R);
          case "ascii":
          case "latin1":
          case "binary":
            return Ce(this, d, v, R);
          case "base64":
            return $e(this, d, v, R);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Be(this, d, v, R);
          default:
            if (L) throw new TypeError("Unknown encoding: " + y);
            y = ("" + y).toLowerCase(), L = !0;
        }
    }, l.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function Se(S, d, v) {
      return d === 0 && v === S.length ? e.fromByteArray(S) : e.fromByteArray(S.slice(d, v));
    }
    function Me(S, d, v) {
      v = Math.min(S.length, v);
      const R = [];
      let y = d;
      for (; y < v; ) {
        const T = S[y];
        let L = null, ue = T > 239 ? 4 : T > 223 ? 3 : T > 191 ? 2 : 1;
        if (y + ue <= v) {
          let B, q, _, se;
          switch (ue) {
            case 1:
              T < 128 && (L = T);
              break;
            case 2:
              B = S[y + 1], (B & 192) === 128 && (se = (T & 31) << 6 | B & 63, se > 127 && (L = se));
              break;
            case 3:
              B = S[y + 1], q = S[y + 2], (B & 192) === 128 && (q & 192) === 128 && (se = (T & 15) << 12 | (B & 63) << 6 | q & 63, se > 2047 && (se < 55296 || se > 57343) && (L = se));
              break;
            case 4:
              B = S[y + 1], q = S[y + 2], _ = S[y + 3], (B & 192) === 128 && (q & 192) === 128 && (_ & 192) === 128 && (se = (T & 15) << 18 | (B & 63) << 12 | (q & 63) << 6 | _ & 63, se > 65535 && se < 1114112 && (L = se));
          }
        }
        L === null ? (L = 65533, ue = 1) : L > 65535 && (L -= 65536, R.push(L >>> 10 & 1023 | 55296), L = 56320 | L & 1023), R.push(L), y += ue;
      }
      return vt(R);
    }
    const ot = 4096;
    function vt(S) {
      const d = S.length;
      if (d <= ot)
        return String.fromCharCode.apply(String, S);
      let v = "", R = 0;
      for (; R < d; )
        v += String.fromCharCode.apply(
          String,
          S.slice(R, R += ot)
        );
      return v;
    }
    function we(S, d, v) {
      let R = "";
      v = Math.min(S.length, v);
      for (let y = d; y < v; ++y)
        R += String.fromCharCode(S[y] & 127);
      return R;
    }
    function He(S, d, v) {
      let R = "";
      v = Math.min(S.length, v);
      for (let y = d; y < v; ++y)
        R += String.fromCharCode(S[y]);
      return R;
    }
    function Ke(S, d, v) {
      const R = S.length;
      (!d || d < 0) && (d = 0), (!v || v < 0 || v > R) && (v = R);
      let y = "";
      for (let T = d; T < v; ++T)
        y += Ft[S[T]];
      return y;
    }
    function It(S, d, v) {
      const R = S.slice(d, v);
      let y = "";
      for (let T = 0; T < R.length - 1; T += 2)
        y += String.fromCharCode(R[T] + R[T + 1] * 256);
      return y;
    }
    l.prototype.slice = function(d, v) {
      const R = this.length;
      d = ~~d, v = v === void 0 ? R : ~~v, d < 0 ? (d += R, d < 0 && (d = 0)) : d > R && (d = R), v < 0 ? (v += R, v < 0 && (v = 0)) : v > R && (v = R), v < d && (v = d);
      const y = this.subarray(d, v);
      return Object.setPrototypeOf(y, l.prototype), y;
    };
    function Ve(S, d, v) {
      if (S % 1 !== 0 || S < 0) throw new RangeError("offset is not uint");
      if (S + d > v) throw new RangeError("Trying to access beyond buffer length");
    }
    l.prototype.readUintLE = l.prototype.readUIntLE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let y = this[d], T = 1, L = 0;
      for (; ++L < v && (T *= 256); )
        y += this[d + L] * T;
      return y;
    }, l.prototype.readUintBE = l.prototype.readUIntBE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let y = this[d + --v], T = 1;
      for (; v > 0 && (T *= 256); )
        y += this[d + --v] * T;
      return y;
    }, l.prototype.readUint8 = l.prototype.readUInt8 = function(d, v) {
      return d = d >>> 0, v || Ve(d, 1, this.length), this[d];
    }, l.prototype.readUint16LE = l.prototype.readUInt16LE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 2, this.length), this[d] | this[d + 1] << 8;
    }, l.prototype.readUint16BE = l.prototype.readUInt16BE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 2, this.length), this[d] << 8 | this[d + 1];
    }, l.prototype.readUint32LE = l.prototype.readUInt32LE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), (this[d] | this[d + 1] << 8 | this[d + 2] << 16) + this[d + 3] * 16777216;
    }, l.prototype.readUint32BE = l.prototype.readUInt32BE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), this[d] * 16777216 + (this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3]);
    }, l.prototype.readBigUInt64LE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], R = this[d + 7];
      (v === void 0 || R === void 0) && yt(d, this.length - 8);
      const y = v + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24, T = this[++d] + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + R * 2 ** 24;
      return BigInt(y) + (BigInt(T) << BigInt(32));
    }), l.prototype.readBigUInt64BE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], R = this[d + 7];
      (v === void 0 || R === void 0) && yt(d, this.length - 8);
      const y = v * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d], T = this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + R;
      return (BigInt(y) << BigInt(32)) + BigInt(T);
    }), l.prototype.readIntLE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let y = this[d], T = 1, L = 0;
      for (; ++L < v && (T *= 256); )
        y += this[d + L] * T;
      return T *= 128, y >= T && (y -= Math.pow(2, 8 * v)), y;
    }, l.prototype.readIntBE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let y = v, T = 1, L = this[d + --y];
      for (; y > 0 && (T *= 256); )
        L += this[d + --y] * T;
      return T *= 128, L >= T && (L -= Math.pow(2, 8 * v)), L;
    }, l.prototype.readInt8 = function(d, v) {
      return d = d >>> 0, v || Ve(d, 1, this.length), this[d] & 128 ? (255 - this[d] + 1) * -1 : this[d];
    }, l.prototype.readInt16LE = function(d, v) {
      d = d >>> 0, v || Ve(d, 2, this.length);
      const R = this[d] | this[d + 1] << 8;
      return R & 32768 ? R | 4294901760 : R;
    }, l.prototype.readInt16BE = function(d, v) {
      d = d >>> 0, v || Ve(d, 2, this.length);
      const R = this[d + 1] | this[d] << 8;
      return R & 32768 ? R | 4294901760 : R;
    }, l.prototype.readInt32LE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), this[d] | this[d + 1] << 8 | this[d + 2] << 16 | this[d + 3] << 24;
    }, l.prototype.readInt32BE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), this[d] << 24 | this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3];
    }, l.prototype.readBigInt64LE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], R = this[d + 7];
      (v === void 0 || R === void 0) && yt(d, this.length - 8);
      const y = this[d + 4] + this[d + 5] * 2 ** 8 + this[d + 6] * 2 ** 16 + (R << 24);
      return (BigInt(y) << BigInt(32)) + BigInt(v + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24);
    }), l.prototype.readBigInt64BE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], R = this[d + 7];
      (v === void 0 || R === void 0) && yt(d, this.length - 8);
      const y = (v << 24) + // Overflow
      this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d];
      return (BigInt(y) << BigInt(32)) + BigInt(this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + R);
    }), l.prototype.readFloatLE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), t.read(this, d, !0, 23, 4);
    }, l.prototype.readFloatBE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), t.read(this, d, !1, 23, 4);
    }, l.prototype.readDoubleLE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 8, this.length), t.read(this, d, !0, 52, 8);
    }, l.prototype.readDoubleBE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 8, this.length), t.read(this, d, !1, 52, 8);
    };
    function Xe(S, d, v, R, y, T) {
      if (!l.isBuffer(S)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (d > y || d < T) throw new RangeError('"value" argument is out of bounds');
      if (v + R > S.length) throw new RangeError("Index out of range");
    }
    l.prototype.writeUintLE = l.prototype.writeUIntLE = function(d, v, R, y) {
      if (d = +d, v = v >>> 0, R = R >>> 0, !y) {
        const ue = Math.pow(2, 8 * R) - 1;
        Xe(this, d, v, R, ue, 0);
      }
      let T = 1, L = 0;
      for (this[v] = d & 255; ++L < R && (T *= 256); )
        this[v + L] = d / T & 255;
      return v + R;
    }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function(d, v, R, y) {
      if (d = +d, v = v >>> 0, R = R >>> 0, !y) {
        const ue = Math.pow(2, 8 * R) - 1;
        Xe(this, d, v, R, ue, 0);
      }
      let T = R - 1, L = 1;
      for (this[v + T] = d & 255; --T >= 0 && (L *= 256); )
        this[v + T] = d / L & 255;
      return v + R;
    }, l.prototype.writeUint8 = l.prototype.writeUInt8 = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 1, 255, 0), this[v] = d & 255, v + 1;
    }, l.prototype.writeUint16LE = l.prototype.writeUInt16LE = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 2, 65535, 0), this[v] = d & 255, this[v + 1] = d >>> 8, v + 2;
    }, l.prototype.writeUint16BE = l.prototype.writeUInt16BE = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 2, 65535, 0), this[v] = d >>> 8, this[v + 1] = d & 255, v + 2;
    }, l.prototype.writeUint32LE = l.prototype.writeUInt32LE = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 4, 4294967295, 0), this[v + 3] = d >>> 24, this[v + 2] = d >>> 16, this[v + 1] = d >>> 8, this[v] = d & 255, v + 4;
    }, l.prototype.writeUint32BE = l.prototype.writeUInt32BE = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 4, 4294967295, 0), this[v] = d >>> 24, this[v + 1] = d >>> 16, this[v + 2] = d >>> 8, this[v + 3] = d & 255, v + 4;
    };
    function Ze(S, d, v, R, y) {
      me(d, R, y, S, v, 7);
      let T = Number(d & BigInt(4294967295));
      S[v++] = T, T = T >> 8, S[v++] = T, T = T >> 8, S[v++] = T, T = T >> 8, S[v++] = T;
      let L = Number(d >> BigInt(32) & BigInt(4294967295));
      return S[v++] = L, L = L >> 8, S[v++] = L, L = L >> 8, S[v++] = L, L = L >> 8, S[v++] = L, v;
    }
    function wt(S, d, v, R, y) {
      me(d, R, y, S, v, 7);
      let T = Number(d & BigInt(4294967295));
      S[v + 7] = T, T = T >> 8, S[v + 6] = T, T = T >> 8, S[v + 5] = T, T = T >> 8, S[v + 4] = T;
      let L = Number(d >> BigInt(32) & BigInt(4294967295));
      return S[v + 3] = L, L = L >> 8, S[v + 2] = L, L = L >> 8, S[v + 1] = L, L = L >> 8, S[v] = L, v + 8;
    }
    l.prototype.writeBigUInt64LE = _t(function(d, v = 0) {
      return Ze(this, d, v, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeBigUInt64BE = _t(function(d, v = 0) {
      return wt(this, d, v, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeIntLE = function(d, v, R, y) {
      if (d = +d, v = v >>> 0, !y) {
        const B = Math.pow(2, 8 * R - 1);
        Xe(this, d, v, R, B - 1, -B);
      }
      let T = 0, L = 1, ue = 0;
      for (this[v] = d & 255; ++T < R && (L *= 256); )
        d < 0 && ue === 0 && this[v + T - 1] !== 0 && (ue = 1), this[v + T] = (d / L >> 0) - ue & 255;
      return v + R;
    }, l.prototype.writeIntBE = function(d, v, R, y) {
      if (d = +d, v = v >>> 0, !y) {
        const B = Math.pow(2, 8 * R - 1);
        Xe(this, d, v, R, B - 1, -B);
      }
      let T = R - 1, L = 1, ue = 0;
      for (this[v + T] = d & 255; --T >= 0 && (L *= 256); )
        d < 0 && ue === 0 && this[v + T + 1] !== 0 && (ue = 1), this[v + T] = (d / L >> 0) - ue & 255;
      return v + R;
    }, l.prototype.writeInt8 = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 1, 127, -128), d < 0 && (d = 255 + d + 1), this[v] = d & 255, v + 1;
    }, l.prototype.writeInt16LE = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 2, 32767, -32768), this[v] = d & 255, this[v + 1] = d >>> 8, v + 2;
    }, l.prototype.writeInt16BE = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 2, 32767, -32768), this[v] = d >>> 8, this[v + 1] = d & 255, v + 2;
    }, l.prototype.writeInt32LE = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 4, 2147483647, -2147483648), this[v] = d & 255, this[v + 1] = d >>> 8, this[v + 2] = d >>> 16, this[v + 3] = d >>> 24, v + 4;
    }, l.prototype.writeInt32BE = function(d, v, R) {
      return d = +d, v = v >>> 0, R || Xe(this, d, v, 4, 2147483647, -2147483648), d < 0 && (d = 4294967295 + d + 1), this[v] = d >>> 24, this[v + 1] = d >>> 16, this[v + 2] = d >>> 8, this[v + 3] = d & 255, v + 4;
    }, l.prototype.writeBigInt64LE = _t(function(d, v = 0) {
      return Ze(this, d, v, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), l.prototype.writeBigInt64BE = _t(function(d, v = 0) {
      return wt(this, d, v, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function gt(S, d, v, R, y, T) {
      if (v + R > S.length) throw new RangeError("Index out of range");
      if (v < 0) throw new RangeError("Index out of range");
    }
    function We(S, d, v, R, y) {
      return d = +d, v = v >>> 0, y || gt(S, d, v, 4), t.write(S, d, v, R, 23, 4), v + 4;
    }
    l.prototype.writeFloatLE = function(d, v, R) {
      return We(this, d, v, !0, R);
    }, l.prototype.writeFloatBE = function(d, v, R) {
      return We(this, d, v, !1, R);
    };
    function lt(S, d, v, R, y) {
      return d = +d, v = v >>> 0, y || gt(S, d, v, 8), t.write(S, d, v, R, 52, 8), v + 8;
    }
    l.prototype.writeDoubleLE = function(d, v, R) {
      return lt(this, d, v, !0, R);
    }, l.prototype.writeDoubleBE = function(d, v, R) {
      return lt(this, d, v, !1, R);
    }, l.prototype.copy = function(d, v, R, y) {
      if (!l.isBuffer(d)) throw new TypeError("argument should be a Buffer");
      if (R || (R = 0), !y && y !== 0 && (y = this.length), v >= d.length && (v = d.length), v || (v = 0), y > 0 && y < R && (y = R), y === R || d.length === 0 || this.length === 0) return 0;
      if (v < 0)
        throw new RangeError("targetStart out of bounds");
      if (R < 0 || R >= this.length) throw new RangeError("Index out of range");
      if (y < 0) throw new RangeError("sourceEnd out of bounds");
      y > this.length && (y = this.length), d.length - v < y - R && (y = d.length - v + R);
      const T = y - R;
      return this === d && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(v, R, y) : Uint8Array.prototype.set.call(
        d,
        this.subarray(R, y),
        v
      ), T;
    }, l.prototype.fill = function(d, v, R, y) {
      if (typeof d == "string") {
        if (typeof v == "string" ? (y = v, v = 0, R = this.length) : typeof R == "string" && (y = R, R = this.length), y !== void 0 && typeof y != "string")
          throw new TypeError("encoding must be a string");
        if (typeof y == "string" && !l.isEncoding(y))
          throw new TypeError("Unknown encoding: " + y);
        if (d.length === 1) {
          const L = d.charCodeAt(0);
          (y === "utf8" && L < 128 || y === "latin1") && (d = L);
        }
      } else typeof d == "number" ? d = d & 255 : typeof d == "boolean" && (d = Number(d));
      if (v < 0 || this.length < v || this.length < R)
        throw new RangeError("Out of range index");
      if (R <= v)
        return this;
      v = v >>> 0, R = R === void 0 ? this.length : R >>> 0, d || (d = 0);
      let T;
      if (typeof d == "number")
        for (T = v; T < R; ++T)
          this[T] = d;
      else {
        const L = l.isBuffer(d) ? d : l.from(d, y), ue = L.length;
        if (ue === 0)
          throw new TypeError('The value "' + d + '" is invalid for argument "value"');
        for (T = 0; T < R - v; ++T)
          this[T + v] = L[T % ue];
      }
      return this;
    };
    const Pe = {};
    function he(S, d, v) {
      Pe[S] = class extends v {
        constructor() {
          super(), Object.defineProperty(this, "message", {
            value: d.apply(this, arguments),
            writable: !0,
            configurable: !0
          }), this.name = `${this.name} [${S}]`, this.stack, delete this.name;
        }
        get code() {
          return S;
        }
        set code(y) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: y,
            writable: !0
          });
        }
        toString() {
          return `${this.name} [${S}]: ${this.message}`;
        }
      };
    }
    he(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(S) {
        return S ? `${S} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), he(
      "ERR_INVALID_ARG_TYPE",
      function(S, d) {
        return `The "${S}" argument must be of type number. Received type ${typeof d}`;
      },
      TypeError
    ), he(
      "ERR_OUT_OF_RANGE",
      function(S, d, v) {
        let R = `The value of "${S}" is out of range.`, y = v;
        return Number.isInteger(v) && Math.abs(v) > 2 ** 32 ? y = Fe(String(v)) : typeof v == "bigint" && (y = String(v), (v > BigInt(2) ** BigInt(32) || v < -(BigInt(2) ** BigInt(32))) && (y = Fe(y)), y += "n"), R += ` It must be ${d}. Received ${y}`, R;
      },
      RangeError
    );
    function Fe(S) {
      let d = "", v = S.length;
      const R = S[0] === "-" ? 1 : 0;
      for (; v >= R + 4; v -= 3)
        d = `_${S.slice(v - 3, v)}${d}`;
      return `${S.slice(0, v)}${d}`;
    }
    function et(S, d, v) {
      je(d, "offset"), (S[d] === void 0 || S[d + v] === void 0) && yt(d, S.length - (v + 1));
    }
    function me(S, d, v, R, y, T) {
      if (S > v || S < d) {
        const L = typeof d == "bigint" ? "n" : "";
        let ue;
        throw d === 0 || d === BigInt(0) ? ue = `>= 0${L} and < 2${L} ** ${(T + 1) * 8}${L}` : ue = `>= -(2${L} ** ${(T + 1) * 8 - 1}${L}) and < 2 ** ${(T + 1) * 8 - 1}${L}`, new Pe.ERR_OUT_OF_RANGE("value", ue, S);
      }
      et(R, y, T);
    }
    function je(S, d) {
      if (typeof S != "number")
        throw new Pe.ERR_INVALID_ARG_TYPE(d, "number", S);
    }
    function yt(S, d, v) {
      throw Math.floor(S) !== S ? (je(S, v), new Pe.ERR_OUT_OF_RANGE("offset", "an integer", S)) : d < 0 ? new Pe.ERR_BUFFER_OUT_OF_BOUNDS() : new Pe.ERR_OUT_OF_RANGE(
        "offset",
        `>= 0 and <= ${d}`,
        S
      );
    }
    const ht = /[^+/0-9A-Za-z-_]/g;
    function ct(S) {
      if (S = S.split("=")[0], S = S.trim().replace(ht, ""), S.length < 2) return "";
      for (; S.length % 4 !== 0; )
        S = S + "=";
      return S;
    }
    function st(S, d) {
      d = d || 1 / 0;
      let v;
      const R = S.length;
      let y = null;
      const T = [];
      for (let L = 0; L < R; ++L) {
        if (v = S.charCodeAt(L), v > 55295 && v < 57344) {
          if (!y) {
            if (v > 56319) {
              (d -= 3) > -1 && T.push(239, 191, 189);
              continue;
            } else if (L + 1 === R) {
              (d -= 3) > -1 && T.push(239, 191, 189);
              continue;
            }
            y = v;
            continue;
          }
          if (v < 56320) {
            (d -= 3) > -1 && T.push(239, 191, 189), y = v;
            continue;
          }
          v = (y - 55296 << 10 | v - 56320) + 65536;
        } else y && (d -= 3) > -1 && T.push(239, 191, 189);
        if (y = null, v < 128) {
          if ((d -= 1) < 0) break;
          T.push(v);
        } else if (v < 2048) {
          if ((d -= 2) < 0) break;
          T.push(
            v >> 6 | 192,
            v & 63 | 128
          );
        } else if (v < 65536) {
          if ((d -= 3) < 0) break;
          T.push(
            v >> 12 | 224,
            v >> 6 & 63 | 128,
            v & 63 | 128
          );
        } else if (v < 1114112) {
          if ((d -= 4) < 0) break;
          T.push(
            v >> 18 | 240,
            v >> 12 & 63 | 128,
            v >> 6 & 63 | 128,
            v & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return T;
    }
    function Le(S) {
      const d = [];
      for (let v = 0; v < S.length; ++v)
        d.push(S.charCodeAt(v) & 255);
      return d;
    }
    function kt(S, d) {
      let v, R, y;
      const T = [];
      for (let L = 0; L < S.length && !((d -= 2) < 0); ++L)
        v = S.charCodeAt(L), R = v >> 8, y = v % 256, T.push(y), T.push(R);
      return T;
    }
    function Ot(S) {
      return e.toByteArray(ct(S));
    }
    function qe(S, d, v, R) {
      let y;
      for (y = 0; y < R && !(y + v >= d.length || y >= S.length); ++y)
        d[y + v] = S[y];
      return y;
    }
    function Qe(S, d) {
      return S instanceof d || S != null && S.constructor != null && S.constructor.name != null && S.constructor.name === d.name;
    }
    function Et(S) {
      return S !== S;
    }
    const Ft = function() {
      const S = "0123456789abcdef", d = new Array(256);
      for (let v = 0; v < 16; ++v) {
        const R = v * 16;
        for (let y = 0; y < 16; ++y)
          d[R + y] = S[v] + S[y];
      }
      return d;
    }();
    function _t(S) {
      return typeof BigInt > "u" ? Jt : S;
    }
    function Jt() {
      throw new Error("BigInt not supported");
    }
  }(ju)), ju;
}
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Vh;
function wi() {
  return Vh || (Vh = 1, function(n, e) {
    var t = yy(), r = t.Buffer;
    function i(a, l) {
      for (var c in a)
        l[c] = a[c];
    }
    r.from && r.alloc && r.allocUnsafe && r.allocUnsafeSlow ? n.exports = t : (i(t, e), e.Buffer = o);
    function o(a, l, c) {
      return r(a, l, c);
    }
    o.prototype = Object.create(r.prototype), i(r, o), o.from = function(a, l, c) {
      if (typeof a == "number")
        throw new TypeError("Argument must not be a number");
      return r(a, l, c);
    }, o.alloc = function(a, l, c) {
      if (typeof a != "number")
        throw new TypeError("Argument must be a number");
      var b = r(a);
      return l !== void 0 ? typeof c == "string" ? b.fill(l, c) : b.fill(l) : b.fill(0), b;
    }, o.allocUnsafe = function(a) {
      if (typeof a != "number")
        throw new TypeError("Argument must be a number");
      return r(a);
    }, o.allocUnsafeSlow = function(a) {
      if (typeof a != "number")
        throw new TypeError("Argument must be a number");
      return t.SlowBuffer(a);
    };
  }(xa, xa.exports)), xa.exports;
}
var Ku, Jh;
function my() {
  if (Jh) return Ku;
  Jh = 1;
  var n = {}.toString;
  return Ku = Array.isArray || function(e) {
    return n.call(e) == "[object Array]";
  }, Ku;
}
var zu, Zh;
function ir() {
  return Zh || (Zh = 1, zu = TypeError), zu;
}
var Gu, Qh;
function rg() {
  return Qh || (Qh = 1, Gu = Object), Gu;
}
var Hu, Xh;
function Iy() {
  return Xh || (Xh = 1, Hu = Error), Hu;
}
var Wu, ep;
function by() {
  return ep || (ep = 1, Wu = EvalError), Wu;
}
var Yu, tp;
function _y() {
  return tp || (tp = 1, Yu = RangeError), Yu;
}
var Vu, rp;
function wy() {
  return rp || (rp = 1, Vu = ReferenceError), Vu;
}
var Ju, np;
function ng() {
  return np || (np = 1, Ju = SyntaxError), Ju;
}
var Zu, ip;
function xy() {
  return ip || (ip = 1, Zu = URIError), Zu;
}
var Qu, sp;
function ig() {
  return sp || (sp = 1, Qu = Math.abs), Qu;
}
var Xu, op;
function nu() {
  return op || (op = 1, Xu = Math.floor), Xu;
}
var el, ap;
function Ey() {
  return ap || (ap = 1, el = Math.max), el;
}
var tl, up;
function Sy() {
  return up || (up = 1, tl = Math.min), tl;
}
var rl, lp;
function Ay() {
  return lp || (lp = 1, rl = Math.pow), rl;
}
var nl, cp;
function ky() {
  return cp || (cp = 1, nl = Math.round), nl;
}
var il, fp;
function Sf() {
  return fp || (fp = 1, il = Number.isNaN || function(e) {
    return e !== e;
  }), il;
}
var sl, hp;
function Oy() {
  if (hp) return sl;
  hp = 1;
  var n = /* @__PURE__ */ Sf();
  return sl = function(t) {
    return n(t) || t === 0 ? t : t < 0 ? -1 : 1;
  }, sl;
}
var ol, pp;
function Ry() {
  return pp || (pp = 1, ol = Object.getOwnPropertyDescriptor), ol;
}
var al, dp;
function ho() {
  if (dp) return al;
  dp = 1;
  var n = /* @__PURE__ */ Ry();
  if (n)
    try {
      n([], "length");
    } catch {
      n = null;
    }
  return al = n, al;
}
var ul, vp;
function iu() {
  if (vp) return ul;
  vp = 1;
  var n = Object.defineProperty || !1;
  if (n)
    try {
      n({}, "a", { value: 1 });
    } catch {
      n = !1;
    }
  return ul = n, ul;
}
var ll, gp;
function sg() {
  return gp || (gp = 1, ll = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var e = {}, t = Symbol("test"), r = Object(t);
    if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(r) !== "[object Symbol]")
      return !1;
    var i = 42;
    e[t] = i;
    for (var o in e)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
      return !1;
    var a = Object.getOwnPropertySymbols(e);
    if (a.length !== 1 || a[0] !== t || !Object.prototype.propertyIsEnumerable.call(e, t))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var l = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(e, t)
      );
      if (l.value !== i || l.enumerable !== !0)
        return !1;
    }
    return !0;
  }), ll;
}
var cl, yp;
function Ty() {
  if (yp) return cl;
  yp = 1;
  var n = typeof Symbol < "u" && Symbol, e = sg();
  return cl = function() {
    return typeof n != "function" || typeof Symbol != "function" || typeof n("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : e();
  }, cl;
}
var fl, mp;
function og() {
  return mp || (mp = 1, fl = typeof Reflect < "u" && Reflect.getPrototypeOf || null), fl;
}
var hl, Ip;
function ag() {
  if (Ip) return hl;
  Ip = 1;
  var n = /* @__PURE__ */ rg();
  return hl = n.getPrototypeOf || null, hl;
}
var pl, bp;
function Cy() {
  if (bp) return pl;
  bp = 1;
  var n = "Function.prototype.bind called on incompatible ", e = Object.prototype.toString, t = Math.max, r = "[object Function]", i = function(c, b) {
    for (var m = [], w = 0; w < c.length; w += 1)
      m[w] = c[w];
    for (var x = 0; x < b.length; x += 1)
      m[x + c.length] = b[x];
    return m;
  }, o = function(c, b) {
    for (var m = [], w = b, x = 0; w < c.length; w += 1, x += 1)
      m[x] = c[w];
    return m;
  }, a = function(l, c) {
    for (var b = "", m = 0; m < l.length; m += 1)
      b += l[m], m + 1 < l.length && (b += c);
    return b;
  };
  return pl = function(c) {
    var b = this;
    if (typeof b != "function" || e.apply(b) !== r)
      throw new TypeError(n + b);
    for (var m = o(arguments, 1), w, x = function() {
      if (this instanceof w) {
        var M = b.apply(
          this,
          i(m, arguments)
        );
        return Object(M) === M ? M : this;
      }
      return b.apply(
        c,
        i(m, arguments)
      );
    }, k = t(0, b.length - m.length), D = [], K = 0; K < k; K++)
      D[K] = "$" + K;
    if (w = Function("binder", "return function (" + a(D, ",") + "){ return binder.apply(this,arguments); }")(x), b.prototype) {
      var C = function() {
      };
      C.prototype = b.prototype, w.prototype = new C(), C.prototype = null;
    }
    return w;
  }, pl;
}
var dl, _p;
function Xo() {
  if (_p) return dl;
  _p = 1;
  var n = Cy();
  return dl = Function.prototype.bind || n, dl;
}
var vl, wp;
function Af() {
  return wp || (wp = 1, vl = Function.prototype.call), vl;
}
var gl, xp;
function kf() {
  return xp || (xp = 1, gl = Function.prototype.apply), gl;
}
var yl, Ep;
function Ny() {
  return Ep || (Ep = 1, yl = typeof Reflect < "u" && Reflect && Reflect.apply), yl;
}
var ml, Sp;
function ug() {
  if (Sp) return ml;
  Sp = 1;
  var n = Xo(), e = kf(), t = Af(), r = Ny();
  return ml = r || n.call(t, e), ml;
}
var Il, Ap;
function Of() {
  if (Ap) return Il;
  Ap = 1;
  var n = Xo(), e = /* @__PURE__ */ ir(), t = Af(), r = ug();
  return Il = function(o) {
    if (o.length < 1 || typeof o[0] != "function")
      throw new e("a function is required");
    return r(n, t, o);
  }, Il;
}
var bl, kp;
function Py() {
  if (kp) return bl;
  kp = 1;
  var n = Of(), e = /* @__PURE__ */ ho(), t;
  try {
    t = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (a) {
    if (!a || typeof a != "object" || !("code" in a) || a.code !== "ERR_PROTO_ACCESS")
      throw a;
  }
  var r = !!t && e && e(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), i = Object, o = i.getPrototypeOf;
  return bl = r && typeof r.get == "function" ? n([r.get]) : typeof o == "function" ? (
    /** @type {import('./get')} */
    function(l) {
      return o(l == null ? l : i(l));
    }
  ) : !1, bl;
}
var _l, Op;
function lg() {
  if (Op) return _l;
  Op = 1;
  var n = og(), e = ag(), t = /* @__PURE__ */ Py();
  return _l = n ? function(i) {
    return n(i);
  } : e ? function(i) {
    if (!i || typeof i != "object" && typeof i != "function")
      throw new TypeError("getProto: not an object");
    return e(i);
  } : t ? function(i) {
    return t(i);
  } : null, _l;
}
var wl, Rp;
function cg() {
  if (Rp) return wl;
  Rp = 1;
  var n = Function.prototype.call, e = Object.prototype.hasOwnProperty, t = Xo();
  return wl = t.call(n, e), wl;
}
var xl, Tp;
function ea() {
  if (Tp) return xl;
  Tp = 1;
  var n, e = /* @__PURE__ */ rg(), t = /* @__PURE__ */ Iy(), r = /* @__PURE__ */ by(), i = /* @__PURE__ */ _y(), o = /* @__PURE__ */ wy(), a = /* @__PURE__ */ ng(), l = /* @__PURE__ */ ir(), c = /* @__PURE__ */ xy(), b = /* @__PURE__ */ ig(), m = /* @__PURE__ */ nu(), w = /* @__PURE__ */ Ey(), x = /* @__PURE__ */ Sy(), k = /* @__PURE__ */ Ay(), D = /* @__PURE__ */ ky(), K = /* @__PURE__ */ Oy(), C = Function, M = function(he) {
    try {
      return C('"use strict"; return (' + he + ").constructor;")();
    } catch {
    }
  }, J = /* @__PURE__ */ ho(), X = /* @__PURE__ */ iu(), le = function() {
    throw new l();
  }, ce = J ? function() {
    try {
      return arguments.callee, le;
    } catch {
      try {
        return J(arguments, "callee").get;
      } catch {
        return le;
      }
    }
  }() : le, fe = Ty()(), oe = lg(), ke = ag(), De = og(), Ce = kf(), $e = Af(), Be = {}, Se = typeof Uint8Array > "u" || !oe ? n : oe(Uint8Array), Me = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? n : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? n : ArrayBuffer,
    "%ArrayIteratorPrototype%": fe && oe ? oe([][Symbol.iterator]()) : n,
    "%AsyncFromSyncIteratorPrototype%": n,
    "%AsyncFunction%": Be,
    "%AsyncGenerator%": Be,
    "%AsyncGeneratorFunction%": Be,
    "%AsyncIteratorPrototype%": Be,
    "%Atomics%": typeof Atomics > "u" ? n : Atomics,
    "%BigInt%": typeof BigInt > "u" ? n : BigInt,
    "%BigInt64Array%": typeof BigInt64Array > "u" ? n : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array > "u" ? n : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? n : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": t,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": r,
    "%Float16Array%": typeof Float16Array > "u" ? n : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? n : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? n : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? n : FinalizationRegistry,
    "%Function%": C,
    "%GeneratorFunction%": Be,
    "%Int8Array%": typeof Int8Array > "u" ? n : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? n : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? n : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": fe && oe ? oe(oe([][Symbol.iterator]())) : n,
    "%JSON%": typeof JSON == "object" ? JSON : n,
    "%Map%": typeof Map > "u" ? n : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !fe || !oe ? n : oe((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": e,
    "%Object.getOwnPropertyDescriptor%": J,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? n : Promise,
    "%Proxy%": typeof Proxy > "u" ? n : Proxy,
    "%RangeError%": i,
    "%ReferenceError%": o,
    "%Reflect%": typeof Reflect > "u" ? n : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? n : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !fe || !oe ? n : oe((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? n : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": fe && oe ? oe(""[Symbol.iterator]()) : n,
    "%Symbol%": fe ? Symbol : n,
    "%SyntaxError%": a,
    "%ThrowTypeError%": ce,
    "%TypedArray%": Se,
    "%TypeError%": l,
    "%Uint8Array%": typeof Uint8Array > "u" ? n : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? n : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? n : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? n : Uint32Array,
    "%URIError%": c,
    "%WeakMap%": typeof WeakMap > "u" ? n : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? n : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? n : WeakSet,
    "%Function.prototype.call%": $e,
    "%Function.prototype.apply%": Ce,
    "%Object.defineProperty%": X,
    "%Object.getPrototypeOf%": ke,
    "%Math.abs%": b,
    "%Math.floor%": m,
    "%Math.max%": w,
    "%Math.min%": x,
    "%Math.pow%": k,
    "%Math.round%": D,
    "%Math.sign%": K,
    "%Reflect.getPrototypeOf%": De
  };
  if (oe)
    try {
      null.error;
    } catch (he) {
      var ot = oe(oe(he));
      Me["%Error.prototype%"] = ot;
    }
  var vt = function he(Fe) {
    var et;
    if (Fe === "%AsyncFunction%")
      et = M("async function () {}");
    else if (Fe === "%GeneratorFunction%")
      et = M("function* () {}");
    else if (Fe === "%AsyncGeneratorFunction%")
      et = M("async function* () {}");
    else if (Fe === "%AsyncGenerator%") {
      var me = he("%AsyncGeneratorFunction%");
      me && (et = me.prototype);
    } else if (Fe === "%AsyncIteratorPrototype%") {
      var je = he("%AsyncGenerator%");
      je && oe && (et = oe(je.prototype));
    }
    return Me[Fe] = et, et;
  }, we = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, He = Xo(), Ke = /* @__PURE__ */ cg(), It = He.call($e, Array.prototype.concat), Ve = He.call(Ce, Array.prototype.splice), Xe = He.call($e, String.prototype.replace), Ze = He.call($e, String.prototype.slice), wt = He.call($e, RegExp.prototype.exec), gt = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, We = /\\(\\)?/g, lt = function(Fe) {
    var et = Ze(Fe, 0, 1), me = Ze(Fe, -1);
    if (et === "%" && me !== "%")
      throw new a("invalid intrinsic syntax, expected closing `%`");
    if (me === "%" && et !== "%")
      throw new a("invalid intrinsic syntax, expected opening `%`");
    var je = [];
    return Xe(Fe, gt, function(yt, ht, ct, st) {
      je[je.length] = ct ? Xe(st, We, "$1") : ht || yt;
    }), je;
  }, Pe = function(Fe, et) {
    var me = Fe, je;
    if (Ke(we, me) && (je = we[me], me = "%" + je[0] + "%"), Ke(Me, me)) {
      var yt = Me[me];
      if (yt === Be && (yt = vt(me)), typeof yt > "u" && !et)
        throw new l("intrinsic " + Fe + " exists, but is not available. Please file an issue!");
      return {
        alias: je,
        name: me,
        value: yt
      };
    }
    throw new a("intrinsic " + Fe + " does not exist!");
  };
  return xl = function(Fe, et) {
    if (typeof Fe != "string" || Fe.length === 0)
      throw new l("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof et != "boolean")
      throw new l('"allowMissing" argument must be a boolean');
    if (wt(/^%?[^%]*%?$/, Fe) === null)
      throw new a("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var me = lt(Fe), je = me.length > 0 ? me[0] : "", yt = Pe("%" + je + "%", et), ht = yt.name, ct = yt.value, st = !1, Le = yt.alias;
    Le && (je = Le[0], Ve(me, It([0, 1], Le)));
    for (var kt = 1, Ot = !0; kt < me.length; kt += 1) {
      var qe = me[kt], Qe = Ze(qe, 0, 1), Et = Ze(qe, -1);
      if ((Qe === '"' || Qe === "'" || Qe === "`" || Et === '"' || Et === "'" || Et === "`") && Qe !== Et)
        throw new a("property names with quotes must have matching quotes");
      if ((qe === "constructor" || !Ot) && (st = !0), je += "." + qe, ht = "%" + je + "%", Ke(Me, ht))
        ct = Me[ht];
      else if (ct != null) {
        if (!(qe in ct)) {
          if (!et)
            throw new l("base intrinsic for " + Fe + " exists, but the property is not available.");
          return;
        }
        if (J && kt + 1 >= me.length) {
          var Ft = J(ct, qe);
          Ot = !!Ft, Ot && "get" in Ft && !("originalValue" in Ft.get) ? ct = Ft.get : ct = ct[qe];
        } else
          Ot = Ke(ct, qe), ct = ct[qe];
        Ot && !st && (Me[ht] = ct);
      }
    }
    return ct;
  }, xl;
}
var El, Cp;
function Dn() {
  if (Cp) return El;
  Cp = 1;
  var n = /* @__PURE__ */ ea(), e = Of(), t = e([n("%String.prototype.indexOf%")]);
  return El = function(i, o) {
    var a = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      n(i, !!o)
    );
    return typeof a == "function" && t(i, ".prototype.") > -1 ? e(
      /** @type {const} */
      [a]
    ) : a;
  }, El;
}
var Sl, Np;
function Dy() {
  if (Np) return Sl;
  Np = 1;
  var n = Function.prototype.toString, e = typeof Reflect == "object" && Reflect !== null && Reflect.apply, t, r;
  if (typeof e == "function" && typeof Object.defineProperty == "function")
    try {
      t = Object.defineProperty({}, "length", {
        get: function() {
          throw r;
        }
      }), r = {}, e(function() {
        throw 42;
      }, null, t);
    } catch (J) {
      J !== r && (e = null);
    }
  else
    e = null;
  var i = /^\s*class\b/, o = function(X) {
    try {
      var le = n.call(X);
      return i.test(le);
    } catch {
      return !1;
    }
  }, a = function(X) {
    try {
      return o(X) ? !1 : (n.call(X), !0);
    } catch {
      return !1;
    }
  }, l = Object.prototype.toString, c = "[object Object]", b = "[object Function]", m = "[object GeneratorFunction]", w = "[object HTMLAllCollection]", x = "[object HTML document.all class]", k = "[object HTMLCollection]", D = typeof Symbol == "function" && !!Symbol.toStringTag, K = !(0 in [,]), C = function() {
    return !1;
  };
  if (typeof document == "object") {
    var M = document.all;
    l.call(M) === l.call(document.all) && (C = function(X) {
      if ((K || !X) && (typeof X > "u" || typeof X == "object"))
        try {
          var le = l.call(X);
          return (le === w || le === x || le === k || le === c) && X("") == null;
        } catch {
        }
      return !1;
    });
  }
  return Sl = e ? function(X) {
    if (C(X))
      return !0;
    if (!X || typeof X != "function" && typeof X != "object")
      return !1;
    try {
      e(X, null, t);
    } catch (le) {
      if (le !== r)
        return !1;
    }
    return !o(X) && a(X);
  } : function(X) {
    if (C(X))
      return !0;
    if (!X || typeof X != "function" && typeof X != "object")
      return !1;
    if (D)
      return a(X);
    if (o(X))
      return !1;
    var le = l.call(X);
    return le !== b && le !== m && !/^\[object HTML/.test(le) ? !1 : a(X);
  }, Sl;
}
var Al, Pp;
function Rf() {
  if (Pp) return Al;
  Pp = 1;
  var n = Dy(), e = Object.prototype.toString, t = Object.prototype.hasOwnProperty, r = function(c, b, m) {
    for (var w = 0, x = c.length; w < x; w++)
      t.call(c, w) && (m == null ? b(c[w], w, c) : b.call(m, c[w], w, c));
  }, i = function(c, b, m) {
    for (var w = 0, x = c.length; w < x; w++)
      m == null ? b(c.charAt(w), w, c) : b.call(m, c.charAt(w), w, c);
  }, o = function(c, b, m) {
    for (var w in c)
      t.call(c, w) && (m == null ? b(c[w], w, c) : b.call(m, c[w], w, c));
  };
  function a(l) {
    return e.call(l) === "[object Array]";
  }
  return Al = function(c, b, m) {
    if (!n(b))
      throw new TypeError("iterator must be a function");
    var w;
    arguments.length >= 3 && (w = m), a(c) ? r(c, b, w) : typeof c == "string" ? i(c, b, w) : o(c, b, w);
  }, Al;
}
var kl, Dp;
function By() {
  return Dp || (Dp = 1, kl = [
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array"
  ]), kl;
}
var Ol, Bp;
function Fy() {
  if (Bp) return Ol;
  Bp = 1;
  var n = /* @__PURE__ */ By(), e = typeof globalThis > "u" ? xf : globalThis;
  return Ol = function() {
    for (var r = [], i = 0; i < n.length; i++)
      typeof e[n[i]] == "function" && (r[r.length] = n[i]);
    return r;
  }, Ol;
}
var Rl = { exports: {} }, Tl, Fp;
function fg() {
  if (Fp) return Tl;
  Fp = 1;
  var n = /* @__PURE__ */ iu(), e = /* @__PURE__ */ ng(), t = /* @__PURE__ */ ir(), r = /* @__PURE__ */ ho();
  return Tl = function(o, a, l) {
    if (!o || typeof o != "object" && typeof o != "function")
      throw new t("`obj` must be an object or a function`");
    if (typeof a != "string" && typeof a != "symbol")
      throw new t("`property` must be a string or a symbol`");
    if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
      throw new t("`nonEnumerable`, if provided, must be a boolean or null");
    if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
      throw new t("`nonWritable`, if provided, must be a boolean or null");
    if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
      throw new t("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && typeof arguments[6] != "boolean")
      throw new t("`loose`, if provided, must be a boolean");
    var c = arguments.length > 3 ? arguments[3] : null, b = arguments.length > 4 ? arguments[4] : null, m = arguments.length > 5 ? arguments[5] : null, w = arguments.length > 6 ? arguments[6] : !1, x = !!r && r(o, a);
    if (n)
      n(o, a, {
        configurable: m === null && x ? x.configurable : !m,
        enumerable: c === null && x ? x.enumerable : !c,
        value: l,
        writable: b === null && x ? x.writable : !b
      });
    else if (w || !c && !b && !m)
      o[a] = l;
    else
      throw new e("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, Tl;
}
var Cl, Lp;
function hg() {
  if (Lp) return Cl;
  Lp = 1;
  var n = /* @__PURE__ */ iu(), e = function() {
    return !!n;
  };
  return e.hasArrayLengthDefineBug = function() {
    if (!n)
      return null;
    try {
      return n([], "length", { value: 1 }).length !== 1;
    } catch {
      return !0;
    }
  }, Cl = e, Cl;
}
var Nl, qp;
function Ly() {
  if (qp) return Nl;
  qp = 1;
  var n = /* @__PURE__ */ ea(), e = /* @__PURE__ */ fg(), t = /* @__PURE__ */ hg()(), r = /* @__PURE__ */ ho(), i = /* @__PURE__ */ ir(), o = n("%Math.floor%");
  return Nl = function(l, c) {
    if (typeof l != "function")
      throw new i("`fn` is not a function");
    if (typeof c != "number" || c < 0 || c > 4294967295 || o(c) !== c)
      throw new i("`length` must be a positive 32-bit integer");
    var b = arguments.length > 2 && !!arguments[2], m = !0, w = !0;
    if ("length" in l && r) {
      var x = r(l, "length");
      x && !x.configurable && (m = !1), x && !x.writable && (w = !1);
    }
    return (m || w || !b) && (t ? e(
      /** @type {Parameters<define>[0]} */
      l,
      "length",
      c,
      !0,
      !0
    ) : e(
      /** @type {Parameters<define>[0]} */
      l,
      "length",
      c
    )), l;
  }, Nl;
}
var Pl, Mp;
function qy() {
  if (Mp) return Pl;
  Mp = 1;
  var n = Xo(), e = kf(), t = ug();
  return Pl = function() {
    return t(n, e, arguments);
  }, Pl;
}
var Up;
function Tf() {
  return Up || (Up = 1, function(n) {
    var e = /* @__PURE__ */ Ly(), t = /* @__PURE__ */ iu(), r = Of(), i = qy();
    n.exports = function(a) {
      var l = r(arguments), c = a.length - (arguments.length - 1);
      return e(
        l,
        1 + (c > 0 ? c : 0),
        !0
      );
    }, t ? t(n.exports, "apply", { value: i }) : n.exports.apply = i;
  }(Rl)), Rl.exports;
}
var Dl, $p;
function pg() {
  if ($p) return Dl;
  $p = 1;
  var n = sg();
  return Dl = function() {
    return n() && !!Symbol.toStringTag;
  }, Dl;
}
var Bl, jp;
function My() {
  if (jp) return Bl;
  jp = 1;
  var n = Rf(), e = /* @__PURE__ */ Fy(), t = Tf(), r = /* @__PURE__ */ Dn(), i = /* @__PURE__ */ ho(), o = lg(), a = r("Object.prototype.toString"), l = pg()(), c = typeof globalThis > "u" ? xf : globalThis, b = e(), m = r("String.prototype.slice"), w = r("Array.prototype.indexOf", !0) || function(C, M) {
    for (var J = 0; J < C.length; J += 1)
      if (C[J] === M)
        return J;
    return -1;
  }, x = { __proto__: null };
  l && i && o ? n(b, function(K) {
    var C = new c[K]();
    if (Symbol.toStringTag in C && o) {
      var M = o(C), J = i(M, Symbol.toStringTag);
      if (!J && M) {
        var X = o(M);
        J = i(X, Symbol.toStringTag);
      }
      x["$" + K] = t(J.get);
    }
  }) : n(b, function(K) {
    var C = new c[K](), M = C.slice || C.set;
    M && (x[
      /** @type {`$${import('.').TypedArrayName}`} */
      "$" + K
    ] = /** @type {import('./types').BoundSlice | import('./types').BoundSet} */
    // @ts-expect-error TODO FIXME
    t(M));
  });
  var k = function(C) {
    var M = !1;
    return n(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      x,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(J, X) {
        if (!M)
          try {
            "$" + J(C) === X && (M = /** @type {import('.').TypedArrayName} */
            m(X, 1));
          } catch {
          }
      }
    ), M;
  }, D = function(C) {
    var M = !1;
    return n(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      x,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(J, X) {
        if (!M)
          try {
            J(C), M = /** @type {import('.').TypedArrayName} */
            m(X, 1);
          } catch {
          }
      }
    ), M;
  };
  return Bl = function(C) {
    if (!C || typeof C != "object")
      return !1;
    if (!l) {
      var M = m(a(C), 8, -1);
      return w(b, M) > -1 ? M : M !== "Object" ? !1 : D(C);
    }
    return i ? k(C) : null;
  }, Bl;
}
var Fl, Kp;
function Uy() {
  if (Kp) return Fl;
  Kp = 1;
  var n = /* @__PURE__ */ My();
  return Fl = function(t) {
    return !!n(t);
  }, Fl;
}
var Ll, zp;
function $y() {
  if (zp) return Ll;
  zp = 1;
  var n = /* @__PURE__ */ ir(), e = /* @__PURE__ */ Dn(), t = e("TypedArray.prototype.buffer", !0), r = /* @__PURE__ */ Uy();
  return Ll = t || function(o) {
    if (!r(o))
      throw new n("Not a Typed Array");
    return o.buffer;
  }, Ll;
}
var ql, Gp;
function jy() {
  if (Gp) return ql;
  Gp = 1;
  var n = wi().Buffer, e = my(), t = /* @__PURE__ */ $y(), r = ArrayBuffer.isView || function(c) {
    try {
      return t(c), !0;
    } catch {
      return !1;
    }
  }, i = typeof Uint8Array < "u", o = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", a = o && (n.prototype instanceof Uint8Array || n.TYPED_ARRAY_SUPPORT);
  return ql = function(c, b) {
    if (c instanceof n)
      return c;
    if (typeof c == "string")
      return n.from(c, b);
    if (o && r(c)) {
      if (c.byteLength === 0)
        return n.alloc(0);
      if (a) {
        var m = n.from(c.buffer, c.byteOffset, c.byteLength);
        if (m.byteLength === c.byteLength)
          return m;
      }
      var w = c instanceof Uint8Array ? c : new Uint8Array(c.buffer, c.byteOffset, c.byteLength), x = n.from(w);
      if (x.length === c.byteLength)
        return x;
    }
    if (i && c instanceof Uint8Array)
      return n.from(c);
    var k = e(c);
    if (k)
      for (var D = 0; D < c.length; D += 1) {
        var K = c[D];
        if (typeof K != "number" || K < 0 || K > 255 || ~~K !== K)
          throw new RangeError("Array items must be numbers in the range 0-255.");
      }
    if (k || n.isBuffer(c) && c.constructor && typeof c.constructor.isBuffer == "function" && c.constructor.isBuffer(c))
      return n.from(c);
    throw new TypeError('The "data" argument must be a string, an Array, a Buffer, a Uint8Array, or a DataView.');
  }, ql;
}
var Ml, Hp;
function po() {
  if (Hp) return Ml;
  Hp = 1;
  var n = wi().Buffer, e = /* @__PURE__ */ jy();
  function t(r, i) {
    this._block = n.alloc(r), this._finalSize = i, this._blockSize = r, this._len = 0;
  }
  return t.prototype.update = function(r, i) {
    r = e(r, i || "utf8");
    for (var o = this._block, a = this._blockSize, l = r.length, c = this._len, b = 0; b < l; ) {
      for (var m = c % a, w = Math.min(l - b, a - m), x = 0; x < w; x++)
        o[m + x] = r[b + x];
      c += w, b += w, c % a === 0 && this._update(o);
    }
    return this._len += l, this;
  }, t.prototype.digest = function(r) {
    var i = this._len % this._blockSize;
    this._block[i] = 128, this._block.fill(0, i + 1), i >= this._finalSize && (this._update(this._block), this._block.fill(0));
    var o = this._len * 8;
    if (o <= 4294967295)
      this._block.writeUInt32BE(o, this._blockSize - 4);
    else {
      var a = (o & 4294967295) >>> 0, l = (o - a) / 4294967296;
      this._block.writeUInt32BE(l, this._blockSize - 8), this._block.writeUInt32BE(a, this._blockSize - 4);
    }
    this._update(this._block);
    var c = this._hash();
    return r ? c.toString(r) : c;
  }, t.prototype._update = function() {
    throw new Error("_update must be implemented by subclass");
  }, Ml = t, Ml;
}
var Ul, Wp;
function Ky() {
  if (Wp) return Ul;
  Wp = 1;
  var n = fo(), e = po(), t = wi().Buffer, r = [
    1518500249,
    1859775393,
    -1894007588,
    -899497514
  ], i = new Array(80);
  function o() {
    this.init(), this._w = i, e.call(this, 64, 56);
  }
  n(o, e), o.prototype.init = function() {
    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
  };
  function a(b) {
    return b << 5 | b >>> 27;
  }
  function l(b) {
    return b << 30 | b >>> 2;
  }
  function c(b, m, w, x) {
    return b === 0 ? m & w | ~m & x : b === 2 ? m & w | m & x | w & x : m ^ w ^ x;
  }
  return o.prototype._update = function(b) {
    for (var m = this._w, w = this._a | 0, x = this._b | 0, k = this._c | 0, D = this._d | 0, K = this._e | 0, C = 0; C < 16; ++C)
      m[C] = b.readInt32BE(C * 4);
    for (; C < 80; ++C)
      m[C] = m[C - 3] ^ m[C - 8] ^ m[C - 14] ^ m[C - 16];
    for (var M = 0; M < 80; ++M) {
      var J = ~~(M / 20), X = a(w) + c(J, x, k, D) + K + m[M] + r[J] | 0;
      K = D, D = k, k = l(x), x = w, w = X;
    }
    this._a = w + this._a | 0, this._b = x + this._b | 0, this._c = k + this._c | 0, this._d = D + this._d | 0, this._e = K + this._e | 0;
  }, o.prototype._hash = function() {
    var b = t.allocUnsafe(20);
    return b.writeInt32BE(this._a | 0, 0), b.writeInt32BE(this._b | 0, 4), b.writeInt32BE(this._c | 0, 8), b.writeInt32BE(this._d | 0, 12), b.writeInt32BE(this._e | 0, 16), b;
  }, Ul = o, Ul;
}
var $l, Yp;
function zy() {
  if (Yp) return $l;
  Yp = 1;
  var n = fo(), e = po(), t = wi().Buffer, r = [
    1518500249,
    1859775393,
    -1894007588,
    -899497514
  ], i = new Array(80);
  function o() {
    this.init(), this._w = i, e.call(this, 64, 56);
  }
  n(o, e), o.prototype.init = function() {
    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
  };
  function a(m) {
    return m << 1 | m >>> 31;
  }
  function l(m) {
    return m << 5 | m >>> 27;
  }
  function c(m) {
    return m << 30 | m >>> 2;
  }
  function b(m, w, x, k) {
    return m === 0 ? w & x | ~w & k : m === 2 ? w & x | w & k | x & k : w ^ x ^ k;
  }
  return o.prototype._update = function(m) {
    for (var w = this._w, x = this._a | 0, k = this._b | 0, D = this._c | 0, K = this._d | 0, C = this._e | 0, M = 0; M < 16; ++M)
      w[M] = m.readInt32BE(M * 4);
    for (; M < 80; ++M)
      w[M] = a(w[M - 3] ^ w[M - 8] ^ w[M - 14] ^ w[M - 16]);
    for (var J = 0; J < 80; ++J) {
      var X = ~~(J / 20), le = l(x) + b(X, k, D, K) + C + w[J] + r[X] | 0;
      C = K, K = D, D = c(k), k = x, x = le;
    }
    this._a = x + this._a | 0, this._b = k + this._b | 0, this._c = D + this._c | 0, this._d = K + this._d | 0, this._e = C + this._e | 0;
  }, o.prototype._hash = function() {
    var m = t.allocUnsafe(20);
    return m.writeInt32BE(this._a | 0, 0), m.writeInt32BE(this._b | 0, 4), m.writeInt32BE(this._c | 0, 8), m.writeInt32BE(this._d | 0, 12), m.writeInt32BE(this._e | 0, 16), m;
  }, $l = o, $l;
}
var jl, Vp;
function dg() {
  if (Vp) return jl;
  Vp = 1;
  var n = fo(), e = po(), t = wi().Buffer, r = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ], i = new Array(64);
  function o() {
    this.init(), this._w = i, e.call(this, 64, 56);
  }
  n(o, e), o.prototype.init = function() {
    return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
  };
  function a(x, k, D) {
    return D ^ x & (k ^ D);
  }
  function l(x, k, D) {
    return x & k | D & (x | k);
  }
  function c(x) {
    return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10);
  }
  function b(x) {
    return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7);
  }
  function m(x) {
    return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
  }
  function w(x) {
    return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ x >>> 10;
  }
  return o.prototype._update = function(x) {
    for (var k = this._w, D = this._a | 0, K = this._b | 0, C = this._c | 0, M = this._d | 0, J = this._e | 0, X = this._f | 0, le = this._g | 0, ce = this._h | 0, fe = 0; fe < 16; ++fe)
      k[fe] = x.readInt32BE(fe * 4);
    for (; fe < 64; ++fe)
      k[fe] = w(k[fe - 2]) + k[fe - 7] + m(k[fe - 15]) + k[fe - 16] | 0;
    for (var oe = 0; oe < 64; ++oe) {
      var ke = ce + b(J) + a(J, X, le) + r[oe] + k[oe] | 0, De = c(D) + l(D, K, C) | 0;
      ce = le, le = X, X = J, J = M + ke | 0, M = C, C = K, K = D, D = ke + De | 0;
    }
    this._a = D + this._a | 0, this._b = K + this._b | 0, this._c = C + this._c | 0, this._d = M + this._d | 0, this._e = J + this._e | 0, this._f = X + this._f | 0, this._g = le + this._g | 0, this._h = ce + this._h | 0;
  }, o.prototype._hash = function() {
    var x = t.allocUnsafe(32);
    return x.writeInt32BE(this._a, 0), x.writeInt32BE(this._b, 4), x.writeInt32BE(this._c, 8), x.writeInt32BE(this._d, 12), x.writeInt32BE(this._e, 16), x.writeInt32BE(this._f, 20), x.writeInt32BE(this._g, 24), x.writeInt32BE(this._h, 28), x;
  }, jl = o, jl;
}
var Kl, Jp;
function Gy() {
  if (Jp) return Kl;
  Jp = 1;
  var n = fo(), e = dg(), t = po(), r = wi().Buffer, i = new Array(64);
  function o() {
    this.init(), this._w = i, t.call(this, 64, 56);
  }
  return n(o, e), o.prototype.init = function() {
    return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
  }, o.prototype._hash = function() {
    var a = r.allocUnsafe(28);
    return a.writeInt32BE(this._a, 0), a.writeInt32BE(this._b, 4), a.writeInt32BE(this._c, 8), a.writeInt32BE(this._d, 12), a.writeInt32BE(this._e, 16), a.writeInt32BE(this._f, 20), a.writeInt32BE(this._g, 24), a;
  }, Kl = o, Kl;
}
var zl, Zp;
function vg() {
  if (Zp) return zl;
  Zp = 1;
  var n = fo(), e = po(), t = wi().Buffer, r = [
    1116352408,
    3609767458,
    1899447441,
    602891725,
    3049323471,
    3964484399,
    3921009573,
    2173295548,
    961987163,
    4081628472,
    1508970993,
    3053834265,
    2453635748,
    2937671579,
    2870763221,
    3664609560,
    3624381080,
    2734883394,
    310598401,
    1164996542,
    607225278,
    1323610764,
    1426881987,
    3590304994,
    1925078388,
    4068182383,
    2162078206,
    991336113,
    2614888103,
    633803317,
    3248222580,
    3479774868,
    3835390401,
    2666613458,
    4022224774,
    944711139,
    264347078,
    2341262773,
    604807628,
    2007800933,
    770255983,
    1495990901,
    1249150122,
    1856431235,
    1555081692,
    3175218132,
    1996064986,
    2198950837,
    2554220882,
    3999719339,
    2821834349,
    766784016,
    2952996808,
    2566594879,
    3210313671,
    3203337956,
    3336571891,
    1034457026,
    3584528711,
    2466948901,
    113926993,
    3758326383,
    338241895,
    168717936,
    666307205,
    1188179964,
    773529912,
    1546045734,
    1294757372,
    1522805485,
    1396182291,
    2643833823,
    1695183700,
    2343527390,
    1986661051,
    1014477480,
    2177026350,
    1206759142,
    2456956037,
    344077627,
    2730485921,
    1290863460,
    2820302411,
    3158454273,
    3259730800,
    3505952657,
    3345764771,
    106217008,
    3516065817,
    3606008344,
    3600352804,
    1432725776,
    4094571909,
    1467031594,
    275423344,
    851169720,
    430227734,
    3100823752,
    506948616,
    1363258195,
    659060556,
    3750685593,
    883997877,
    3785050280,
    958139571,
    3318307427,
    1322822218,
    3812723403,
    1537002063,
    2003034995,
    1747873779,
    3602036899,
    1955562222,
    1575990012,
    2024104815,
    1125592928,
    2227730452,
    2716904306,
    2361852424,
    442776044,
    2428436474,
    593698344,
    2756734187,
    3733110249,
    3204031479,
    2999351573,
    3329325298,
    3815920427,
    3391569614,
    3928383900,
    3515267271,
    566280711,
    3940187606,
    3454069534,
    4118630271,
    4000239992,
    116418474,
    1914138554,
    174292421,
    2731055270,
    289380356,
    3203993006,
    460393269,
    320620315,
    685471733,
    587496836,
    852142971,
    1086792851,
    1017036298,
    365543100,
    1126000580,
    2618297676,
    1288033470,
    3409855158,
    1501505948,
    4234509866,
    1607167915,
    987167468,
    1816402316,
    1246189591
  ], i = new Array(160);
  function o() {
    this.init(), this._w = i, e.call(this, 128, 112);
  }
  n(o, e), o.prototype.init = function() {
    return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
  };
  function a(K, C, M) {
    return M ^ K & (C ^ M);
  }
  function l(K, C, M) {
    return K & C | M & (K | C);
  }
  function c(K, C) {
    return (K >>> 28 | C << 4) ^ (C >>> 2 | K << 30) ^ (C >>> 7 | K << 25);
  }
  function b(K, C) {
    return (K >>> 14 | C << 18) ^ (K >>> 18 | C << 14) ^ (C >>> 9 | K << 23);
  }
  function m(K, C) {
    return (K >>> 1 | C << 31) ^ (K >>> 8 | C << 24) ^ K >>> 7;
  }
  function w(K, C) {
    return (K >>> 1 | C << 31) ^ (K >>> 8 | C << 24) ^ (K >>> 7 | C << 25);
  }
  function x(K, C) {
    return (K >>> 19 | C << 13) ^ (C >>> 29 | K << 3) ^ K >>> 6;
  }
  function k(K, C) {
    return (K >>> 19 | C << 13) ^ (C >>> 29 | K << 3) ^ (K >>> 6 | C << 26);
  }
  function D(K, C) {
    return K >>> 0 < C >>> 0 ? 1 : 0;
  }
  return o.prototype._update = function(K) {
    for (var C = this._w, M = this._ah | 0, J = this._bh | 0, X = this._ch | 0, le = this._dh | 0, ce = this._eh | 0, fe = this._fh | 0, oe = this._gh | 0, ke = this._hh | 0, De = this._al | 0, Ce = this._bl | 0, $e = this._cl | 0, Be = this._dl | 0, Se = this._el | 0, Me = this._fl | 0, ot = this._gl | 0, vt = this._hl | 0, we = 0; we < 32; we += 2)
      C[we] = K.readInt32BE(we * 4), C[we + 1] = K.readInt32BE(we * 4 + 4);
    for (; we < 160; we += 2) {
      var He = C[we - 30], Ke = C[we - 15 * 2 + 1], It = m(He, Ke), Ve = w(Ke, He);
      He = C[we - 2 * 2], Ke = C[we - 2 * 2 + 1];
      var Xe = x(He, Ke), Ze = k(Ke, He), wt = C[we - 7 * 2], gt = C[we - 7 * 2 + 1], We = C[we - 16 * 2], lt = C[we - 16 * 2 + 1], Pe = Ve + gt | 0, he = It + wt + D(Pe, Ve) | 0;
      Pe = Pe + Ze | 0, he = he + Xe + D(Pe, Ze) | 0, Pe = Pe + lt | 0, he = he + We + D(Pe, lt) | 0, C[we] = he, C[we + 1] = Pe;
    }
    for (var Fe = 0; Fe < 160; Fe += 2) {
      he = C[Fe], Pe = C[Fe + 1];
      var et = l(M, J, X), me = l(De, Ce, $e), je = c(M, De), yt = c(De, M), ht = b(ce, Se), ct = b(Se, ce), st = r[Fe], Le = r[Fe + 1], kt = a(ce, fe, oe), Ot = a(Se, Me, ot), qe = vt + ct | 0, Qe = ke + ht + D(qe, vt) | 0;
      qe = qe + Ot | 0, Qe = Qe + kt + D(qe, Ot) | 0, qe = qe + Le | 0, Qe = Qe + st + D(qe, Le) | 0, qe = qe + Pe | 0, Qe = Qe + he + D(qe, Pe) | 0;
      var Et = yt + me | 0, Ft = je + et + D(Et, yt) | 0;
      ke = oe, vt = ot, oe = fe, ot = Me, fe = ce, Me = Se, Se = Be + qe | 0, ce = le + Qe + D(Se, Be) | 0, le = X, Be = $e, X = J, $e = Ce, J = M, Ce = De, De = qe + Et | 0, M = Qe + Ft + D(De, qe) | 0;
    }
    this._al = this._al + De | 0, this._bl = this._bl + Ce | 0, this._cl = this._cl + $e | 0, this._dl = this._dl + Be | 0, this._el = this._el + Se | 0, this._fl = this._fl + Me | 0, this._gl = this._gl + ot | 0, this._hl = this._hl + vt | 0, this._ah = this._ah + M + D(this._al, De) | 0, this._bh = this._bh + J + D(this._bl, Ce) | 0, this._ch = this._ch + X + D(this._cl, $e) | 0, this._dh = this._dh + le + D(this._dl, Be) | 0, this._eh = this._eh + ce + D(this._el, Se) | 0, this._fh = this._fh + fe + D(this._fl, Me) | 0, this._gh = this._gh + oe + D(this._gl, ot) | 0, this._hh = this._hh + ke + D(this._hl, vt) | 0;
  }, o.prototype._hash = function() {
    var K = t.allocUnsafe(64);
    function C(M, J, X) {
      K.writeInt32BE(M, X), K.writeInt32BE(J, X + 4);
    }
    return C(this._ah, this._al, 0), C(this._bh, this._bl, 8), C(this._ch, this._cl, 16), C(this._dh, this._dl, 24), C(this._eh, this._el, 32), C(this._fh, this._fl, 40), C(this._gh, this._gl, 48), C(this._hh, this._hl, 56), K;
  }, zl = o, zl;
}
var Gl, Qp;
function Hy() {
  if (Qp) return Gl;
  Qp = 1;
  var n = fo(), e = vg(), t = po(), r = wi().Buffer, i = new Array(160);
  function o() {
    this.init(), this._w = i, t.call(this, 128, 112);
  }
  return n(o, e), o.prototype.init = function() {
    return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
  }, o.prototype._hash = function() {
    var a = r.allocUnsafe(48);
    function l(c, b, m) {
      a.writeInt32BE(c, m), a.writeInt32BE(b, m + 4);
    }
    return l(this._ah, this._al, 0), l(this._bh, this._bl, 8), l(this._ch, this._cl, 16), l(this._dh, this._dl, 24), l(this._eh, this._el, 32), l(this._fh, this._fl, 40), a;
  }, Gl = o, Gl;
}
var Xp;
function Wy() {
  return Xp || (Xp = 1, function(n) {
    n.exports = function(t) {
      var r = t.toLowerCase(), i = n.exports[r];
      if (!i)
        throw new Error(r + " is not supported (we accept pull requests)");
      return new i();
    }, n.exports.sha = Ky(), n.exports.sha1 = zy(), n.exports.sha224 = Gy(), n.exports.sha256 = dg(), n.exports.sha384 = Hy(), n.exports.sha512 = vg();
  }($u)), $u.exports;
}
var Cf = Wy();
class Nf {
  constructor(e, t, r, i) {
    /** @internal */
    ve(this, "@type", "blob");
    this.digest = e, this.length = t, this.content_type = r, this.revpos = i;
  }
  /** Called by JSON.stringify() -- encodes the Blob into its JSON form. @internal
      Note: This is _not_ called when saving a doc; IndexedDB uses "structured clone" not JSON. */
  toJSON(e) {
    return {
      "@type": "blob",
      content_type: this.content_type,
      digest: this.digest,
      length: this.length
    };
  }
  /** Returns a form suitable for storing in a SG `_attachments` dictionary. @internal */
  asAttachmentDict(e) {
    return {
      content_type: this.content_type,
      digest: this.digest,
      length: this.length,
      revpos: this.revpos ?? e,
      stub: !0
    };
  }
  // Required for saving to db. Can't be made private, sadly.
}
var Ps;
class su extends Nf {
  /** @internal */
  constructor(t, r) {
    Ue(typeof t.digest == "string");
    super(t.digest, t.length, t.content_type, t.revpos);
    ee(this, Ps);
    G(this, Ps, r);
  }
  async getContents() {
    return p(this, Ps) ? p(this, Ps).call(this, this.digest, this.content_type) : Promise.reject(Error("No BlobLoader"));
  }
}
Ps = new WeakMap();
class Yy extends su {
  constructor(e, t) {
    super(e, t);
  }
  toJSON(e) {
    return this.asAttachmentDict(0);
  }
}
var Ds;
const lh = class lh extends Nf {
  /** Constructs a NewBlob.
   *  @param contents  The raw data. Will be moved into the database when the document is saved.
   *                   The constructor makes a copy of this, so any modifications afterwards
   *                   will be ignored.
   *  @param content_type  MIME type of the contents; this is optional. */
  constructor(t, r) {
    super(lh.computeDigest(t), t.length, r);
    ee(this, Ds);
    G(this, Ds, new Uint8Array(t));
  }
  async getContents() {
    return Promise.resolve(p(this, Ds));
  }
  /** For convenience, a non-async accessor for the contents. */
  get contents() {
    return p(this, Ds);
  }
  /** @internal */
  static computeDigest(t) {
    return "sha1-" + new Cf.sha1().update(t).digest("base64");
  }
};
Ds = new WeakMap();
let uo = lh;
function Xb(n) {
  return n;
}
function ys(n) {
  return Array.isArray(n);
}
function Ir(n) {
  return typeof n == "object" && n !== null && !ys(n) && !Pf(n);
}
function Pf(n) {
  return n instanceof Nf;
}
function Vy(n) {
  return Ir(n) ? n : void 0;
}
function gg(n) {
  return typeof n == "string" && n.length > 0 && n.length < 256 && n[0] !== "_";
}
function Jy(n) {
  return typeof n == "string" && n.length > 0 && n.length < 256;
}
function yg(n) {
  if (!gg(n))
    throw Error(`"${n}" is not a valid document ID`);
}
function mg(n, e = !0) {
  return ys(n) ? Zy(n, e) : Ir(n) ? Da(n, e) : n;
}
function Zy(n, e = !0) {
  if (!e)
    return n.slice();
  const t = new Array(n.length);
  let r = 0;
  for (const i of n)
    t[r++] = mg(i, !0);
  return t;
}
function Da(n, e = !0) {
  const t = {};
  for (const r of Object.getOwnPropertyNames(n)) {
    const i = n[r];
    t[r] = e ? mg(i, !0) : i;
  }
  return t;
}
function lo(n, e) {
  const t = typeof n;
  if (t !== typeof e)
    return !1;
  if (t !== "object" || n === null)
    return n === e;
  if (Array.isArray(n)) {
    const r = n.length;
    return !Array.isArray(e) || r !== e.length ? !1 : n.every((i, o) => lo(i, e[o]));
  } else {
    const r = n, i = e, o = Object.keys(r);
    return o.length !== Object.keys(i).length ? !1 : o.every((a) => lo(r[a], i[a]));
  }
}
const Zc = "cbl_checkpoints", No = "cbl_collections", Hl = "cbl_blobs", Lo = "id", Po = "seq", Aa = "expires", _n = 1, Oo = 64, Sr = 128;
function Bi(n) {
  return n.flags !== void 0 && (n.flags & Sr) !== 0;
}
function bi(n) {
  const e = n.indexOf("-");
  if (e >= 1) {
    const t = Number(n.substring(0, e));
    if (t > 0 && Number.isSafeInteger(t))
      return t;
  }
  throw Error(`Invalid revision id '${n}'`);
}
function Df(n, e) {
  return n === void 0 ? !1 : e === void 0 ? !0 : bi(n) > bi(e);
}
function Ba(n, e, t) {
  let r = new Cf.sha1();
  n ? r.update(new Uint8Array([Math.min(n.length, 255)])).update(n) : r.update(new Uint8Array([0])), r.update(new Uint8Array([t ? 1 : 0])), t || r.update(JSON.stringify(Bf(e)));
  const i = r.digest("hex");
  return `${n ? bi(n) + 1 : 1}-${i}`;
}
function Qy(n) {
  let e = {};
  for (const t of Object.keys(n).sort())
    e[t] = Bf(n[t]);
  return e;
}
function Bf(n) {
  return Array.isArray(n) ? n.map((e) => Bf(e)) : Ir(n) ? Qy(n) : n;
}
const Fa = "_id", La = "_sequence", qa = "_expires";
class hs {
  constructor(e, t, r, i) {
    this.name = e, this.keypath = t, this.indexed = r, this.encrypted = i, Ue(!(r && i)), (e.length === 0 || t.length === 0) && this.bad();
  }
  /** Creates a DocProperty from a public property name or path. */
  static create(e, t = !1, r = !1) {
    switch (e) {
      case Fa:
        return new Wl(Fa, Lo);
      case La:
        return new Wl(La, Po);
      case qa:
        return new Wl(qa, Aa);
      default:
        return e.indexOf(".") < 0 ? new Ig(e, t, r) : new Xy(e, t, r);
    }
  }
  get rootName() {
    return this.name;
  }
  toString() {
    return this.name;
  }
  bad() {
    throw Error(`Invalid property path '${this.name}'`);
  }
}
class Wl extends hs {
  constructor(e, t) {
    super(e, t, !0, !1), this.key = t;
  }
  in(e) {
    return this.key in e;
  }
  getFrom(e) {
    return e[this.key];
  }
}
class Ig extends hs {
  constructor(e, t, r) {
    super(e, "body." + e, t, r), e.startsWith("_") && this.bad();
  }
  in(e) {
    return Object.hasOwn(e.body, this.name);
  }
  getFrom(e) {
    return e.body[this.name];
  }
}
class Xy extends Ig {
  constructor(t, r, i) {
    super(t, r, i);
    ve(this, "path");
    (t.startsWith(".") || t.endsWith(".") || t.indexOf("..") >= 0) && this.bad(), this.path = t.split(".");
  }
  get rootName() {
    return this.path[0];
  }
  in(t) {
    return this.getFrom(t) !== void 0;
  }
  getFrom(t) {
    let r = t.body;
    for (const i of this.path) {
      if (!Ir(r))
        return;
      r = r[i];
    }
    return r;
  }
}
function ta(n) {
  return typeof n != "object" || n === null;
}
function em(n) {
  const e = Array.from(n, (t) => String.fromCodePoint(t)).join("");
  return btoa(e);
}
function tm(n) {
  try {
    return Uint8Array.from(atob(n), (e) => e.codePointAt(0));
  } catch {
    return;
  }
}
function bg(n, e) {
  return "Basic " + btoa(n + ":" + e);
}
const _g = 6048e5, rm = 864e5, wg = 6e4, xg = 36e5, ed = Symbol.for("constructDateFrom");
function gn(n, e) {
  return typeof n == "function" ? n(e) : n && typeof n == "object" && ed in n ? n[ed](e) : n instanceof Date ? new n.constructor(e) : new Date(e);
}
function Gr(n, e) {
  return gn(e || n, n);
}
function Eg(n, e, t) {
  const r = Gr(n, t == null ? void 0 : t.in);
  return isNaN(e) ? gn((t == null ? void 0 : t.in) || n, NaN) : (e && r.setDate(r.getDate() + e), r);
}
function Ff(n, e, t) {
  const r = Gr(n, t == null ? void 0 : t.in);
  if (isNaN(e)) return gn((t == null ? void 0 : t.in) || n, NaN);
  if (!e)
    return r;
  const i = r.getDate(), o = gn((t == null ? void 0 : t.in) || n, r.getTime());
  o.setMonth(r.getMonth() + e + 1, 0);
  const a = o.getDate();
  return i >= a ? o : (r.setFullYear(
    o.getFullYear(),
    o.getMonth(),
    i
  ), r);
}
function Lf(n, e, t) {
  return gn((t == null ? void 0 : t.in) || n, +Gr(n) + e);
}
function nm(n, e, t) {
  return Lf(n, e * xg, t);
}
let im = {};
function sm() {
  return im;
}
function Qc(n, e) {
  var l, c, b, m;
  const t = sm(), r = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (l = e == null ? void 0 : e.locale) == null ? void 0 : l.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((m = (b = t.locale) == null ? void 0 : b.options) == null ? void 0 : m.weekStartsOn) ?? 0, i = Gr(n, e == null ? void 0 : e.in), o = i.getDay(), a = (o < r ? 7 : 0) + o - r;
  return i.setDate(i.getDate() - a), i.setHours(0, 0, 0, 0), i;
}
function qo(n, e) {
  return Qc(n, { ...e, weekStartsOn: 1 });
}
function Ma(n, e) {
  const t = Gr(n, e == null ? void 0 : e.in), r = t.getFullYear(), i = gn(t, 0);
  i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const o = qo(i), a = gn(t, 0);
  a.setFullYear(r, 0, 4), a.setHours(0, 0, 0, 0);
  const l = qo(a);
  return t.getTime() >= o.getTime() ? r + 1 : t.getTime() >= l.getTime() ? r : r - 1;
}
function co(n) {
  const e = Gr(n), t = new Date(
    Date.UTC(
      e.getFullYear(),
      e.getMonth(),
      e.getDate(),
      e.getHours(),
      e.getMinutes(),
      e.getSeconds(),
      e.getMilliseconds()
    )
  );
  return t.setUTCFullYear(e.getFullYear()), +n - +t;
}
function xi(n, ...e) {
  const t = gn.bind(
    null,
    n || e.find((r) => typeof r == "object")
  );
  return e.map(t);
}
function td(n, e) {
  const t = Gr(n, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function ka(n, e, t) {
  const [r, i] = xi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = td(r), a = td(i), l = +o - co(o), c = +a - co(a);
  return Math.round((l - c) / rm);
}
function rd(n, e) {
  const t = Ma(n, e), r = gn((e == null ? void 0 : e.in) || n, 0);
  return r.setFullYear(t, 0, 4), r.setHours(0, 0, 0, 0), qo(r);
}
function om(n, e, t) {
  let r = Gr(n, t == null ? void 0 : t.in);
  const i = ka(
    r,
    rd(r, t)
  ), o = gn((t == null ? void 0 : t.in) || n, 0);
  return o.setFullYear(e, 0, 4), o.setHours(0, 0, 0, 0), r = rd(o), r.setDate(r.getDate() + i), r;
}
function am(n, e, t) {
  return om(n, Ma(n, t) + e, t);
}
function um(n, e, t) {
  const r = Gr(n, t == null ? void 0 : t.in);
  return r.setTime(r.getTime() + e * wg), r;
}
function lm(n, e, t) {
  return Ff(n, e * 3, t);
}
function cm(n, e, t) {
  return Lf(n, e * 1e3, t);
}
function fm(n, e, t) {
  return Eg(n, e * 7, t);
}
function hm(n, e, t) {
  return Ff(n, e * 12, t);
}
function pm(n, e, t) {
  const [r, i] = xi(
    t == null ? void 0 : t.in,
    n,
    e
  );
  return Ma(r, t) - Ma(i, t);
}
function dm(n, e, t) {
  const [r, i] = xi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = qo(r), a = qo(i), l = +o - co(o), c = +a - co(a);
  return Math.round((l - c) / _g);
}
function vm(n, e, t) {
  const [r, i] = xi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = r.getFullYear() - i.getFullYear(), a = r.getMonth() - i.getMonth();
  return o * 12 + a;
}
function nd(n, e) {
  const t = Gr(n, e == null ? void 0 : e.in);
  return Math.trunc(t.getMonth() / 3) + 1;
}
function gm(n, e, t) {
  const [r, i] = xi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = r.getFullYear() - i.getFullYear(), a = nd(r) - nd(i);
  return o * 4 + a;
}
function ym(n, e, t) {
  const [r, i] = xi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = Qc(r, t), a = Qc(i, t), l = +o - co(o), c = +a - co(a);
  return Math.round((l - c) / _g);
}
function Sg(n, e, t) {
  const [r, i] = xi(
    t == null ? void 0 : t.in,
    n,
    e
  );
  return r.getFullYear() - i.getFullYear();
}
function qf(n) {
  return (e) => {
    const r = (n ? Math[n] : Math.trunc)(e);
    return r === 0 ? 0 : r;
  };
}
function mm(n, e, t) {
  const [r, i] = xi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = (+r - +i) / xg;
  return qf(t == null ? void 0 : t.roundingMethod)(o);
}
function Mf(n, e) {
  return +Gr(n) - +Gr(e);
}
function Im(n, e, t) {
  const r = Mf(n, e) / wg;
  return qf(t == null ? void 0 : t.roundingMethod)(r);
}
function bm(n, e, t) {
  const r = Mf(n, e) / 1e3;
  return qf(t == null ? void 0 : t.roundingMethod)(r);
}
function _m(n, e, t = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: n,
    timeZoneName: t
  }).format(e).split(/\s/g).slice(2).join(" ");
}
const Yl = {}, Ro = {};
function Do(n, e) {
  try {
    const r = (Yl[n] || (Yl[n] = new Intl.DateTimeFormat("en-US", {
      timeZone: n,
      timeZoneName: "longOffset"
    }).format))(e).split("GMT")[1];
    return r in Ro ? Ro[r] : id(r, r.split(":"));
  } catch {
    if (n in Ro) return Ro[n];
    const t = n == null ? void 0 : n.match(wm);
    return t ? id(n, t.slice(1)) : NaN;
  }
}
const wm = /([+-]\d\d):?(\d\d)?/;
function id(n, e) {
  const t = +(e[0] || 0), r = +(e[1] || 0);
  return Ro[n] = t > 0 ? t * 60 + r : t * 60 - r;
}
class dn extends Date {
  //#region static
  constructor(...e) {
    super(), e.length > 1 && typeof e[e.length - 1] == "string" && (this.timeZone = e.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Do(this.timeZone, this)) ? this.setTime(NaN) : e.length ? typeof e[0] == "number" && (e.length === 1 || e.length === 2 && typeof e[1] != "number") ? this.setTime(e[0]) : typeof e[0] == "string" ? this.setTime(+new Date(e[0])) : e[0] instanceof Date ? this.setTime(+e[0]) : (this.setTime(+new Date(...e)), Ag(this), Xc(this)) : this.setTime(Date.now());
  }
  static tz(e, ...t) {
    return t.length ? new dn(...t, e) : new dn(Date.now(), e);
  }
  //#endregion
  //#region time zone
  withTimeZone(e) {
    return new dn(+this, e);
  }
  getTimezoneOffset() {
    return -Do(this.timeZone, this);
  }
  //#endregion
  //#region time
  setTime(e) {
    return Date.prototype.setTime.apply(this, arguments), Xc(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](e) {
    return new dn(+new Date(e), this.timeZone);
  }
  //#endregion
}
const sd = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((n) => {
  if (!sd.test(n)) return;
  const e = n.replace(sd, "$1UTC");
  dn.prototype[e] && (n.startsWith("get") ? dn.prototype[n] = function() {
    return this.internal[e]();
  } : (dn.prototype[n] = function() {
    return Date.prototype[e].apply(this.internal, arguments), xm(this), +this;
  }, dn.prototype[e] = function() {
    return Date.prototype[e].apply(this, arguments), Xc(this), +this;
  }));
});
function Xc(n) {
  n.internal.setTime(+n), n.internal.setUTCMinutes(n.internal.getUTCMinutes() - n.getTimezoneOffset());
}
function xm(n) {
  Date.prototype.setFullYear.call(n, n.internal.getUTCFullYear(), n.internal.getUTCMonth(), n.internal.getUTCDate()), Date.prototype.setHours.call(n, n.internal.getUTCHours(), n.internal.getUTCMinutes(), n.internal.getUTCSeconds(), n.internal.getUTCMilliseconds()), Ag(n);
}
function Ag(n) {
  const e = Do(n.timeZone, n), t = /* @__PURE__ */ new Date(+n);
  t.setUTCHours(t.getUTCHours() - 1);
  const r = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset(), i = -(/* @__PURE__ */ new Date(+t)).getTimezoneOffset(), o = r - i, a = Date.prototype.getHours.apply(n) !== n.internal.getUTCHours();
  o && a && n.internal.setUTCMinutes(n.internal.getUTCMinutes() + o);
  const l = r - e;
  l && Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + l);
  const c = Do(n.timeZone, n), m = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset() - c, w = c !== e, x = m - l;
  if (w && x) {
    Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + x);
    const k = Do(n.timeZone, n), D = c - k;
    D && (n.internal.setUTCMinutes(n.internal.getUTCMinutes() + D), Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + D));
  }
}
class Fi extends dn {
  //#region static
  static tz(e, ...t) {
    return t.length ? new Fi(...t, e) : new Fi(Date.now(), e);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [e, t, r] = this.tzComponents(), i = `${e}${t}:${r}`;
    return this.internal.toISOString().slice(0, -1) + i;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [e, t, r, i] = this.internal.toUTCString().split(" ");
    return `${e == null ? void 0 : e.slice(0, -1)} ${r} ${t} ${i}`;
  }
  toTimeString() {
    const e = this.internal.toUTCString().split(" ")[4], [t, r, i] = this.tzComponents();
    return `${e} GMT${t}${r}${i} (${_m(this.timeZone, this)})`;
  }
  toLocaleString(e, t) {
    return Date.prototype.toLocaleString.call(this, e, {
      ...t,
      timeZone: (t == null ? void 0 : t.timeZone) || this.timeZone
    });
  }
  toLocaleDateString(e, t) {
    return Date.prototype.toLocaleDateString.call(this, e, {
      ...t,
      timeZone: (t == null ? void 0 : t.timeZone) || this.timeZone
    });
  }
  toLocaleTimeString(e, t) {
    return Date.prototype.toLocaleTimeString.call(this, e, {
      ...t,
      timeZone: (t == null ? void 0 : t.timeZone) || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const e = this.getTimezoneOffset(), t = e > 0 ? "-" : "+", r = String(Math.floor(Math.abs(e) / 60)).padStart(2, "0"), i = String(Math.abs(e) % 60).padStart(2, "0");
    return [t, r, i];
  }
  //#endregion
  withTimeZone(e) {
    return new Fi(+this, e);
  }
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](e) {
    return new Fi(+new Date(e), this.timeZone);
  }
  //#endregion
}
var Vl, od;
function kg() {
  if (od) return Vl;
  od = 1;
  var n = Object.prototype.toString;
  return Vl = function(t) {
    var r = n.call(t), i = r === "[object Arguments]";
    return i || (i = r !== "[object Array]" && t !== null && typeof t == "object" && typeof t.length == "number" && t.length >= 0 && n.call(t.callee) === "[object Function]"), i;
  }, Vl;
}
var Jl, ad;
function Em() {
  if (ad) return Jl;
  ad = 1;
  var n;
  if (!Object.keys) {
    var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, r = kg(), i = Object.prototype.propertyIsEnumerable, o = !i.call({ toString: null }, "toString"), a = i.call(function() {
    }, "prototype"), l = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ], c = function(x) {
      var k = x.constructor;
      return k && k.prototype === x;
    }, b = {
      $applicationCache: !0,
      $console: !0,
      $external: !0,
      $frame: !0,
      $frameElement: !0,
      $frames: !0,
      $innerHeight: !0,
      $innerWidth: !0,
      $onmozfullscreenchange: !0,
      $onmozfullscreenerror: !0,
      $outerHeight: !0,
      $outerWidth: !0,
      $pageXOffset: !0,
      $pageYOffset: !0,
      $parent: !0,
      $scrollLeft: !0,
      $scrollTop: !0,
      $scrollX: !0,
      $scrollY: !0,
      $self: !0,
      $webkitIndexedDB: !0,
      $webkitStorageInfo: !0,
      $window: !0
    }, m = function() {
      if (typeof window > "u")
        return !1;
      for (var x in window)
        try {
          if (!b["$" + x] && e.call(window, x) && window[x] !== null && typeof window[x] == "object")
            try {
              c(window[x]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    }(), w = function(x) {
      if (typeof window > "u" || !m)
        return c(x);
      try {
        return c(x);
      } catch {
        return !1;
      }
    };
    n = function(k) {
      var D = k !== null && typeof k == "object", K = t.call(k) === "[object Function]", C = r(k), M = D && t.call(k) === "[object String]", J = [];
      if (!D && !K && !C)
        throw new TypeError("Object.keys called on a non-object");
      var X = a && K;
      if (M && k.length > 0 && !e.call(k, 0))
        for (var le = 0; le < k.length; ++le)
          J.push(String(le));
      if (C && k.length > 0)
        for (var ce = 0; ce < k.length; ++ce)
          J.push(String(ce));
      else
        for (var fe in k)
          !(X && fe === "prototype") && e.call(k, fe) && J.push(String(fe));
      if (o)
        for (var oe = w(k), ke = 0; ke < l.length; ++ke)
          !(oe && l[ke] === "constructor") && e.call(k, l[ke]) && J.push(l[ke]);
      return J;
    };
  }
  return Jl = n, Jl;
}
var Zl, ud;
function Sm() {
  if (ud) return Zl;
  ud = 1;
  var n = Array.prototype.slice, e = kg(), t = Object.keys, r = t ? function(a) {
    return t(a);
  } : Em(), i = Object.keys;
  return r.shim = function() {
    if (Object.keys) {
      var a = function() {
        var l = Object.keys(arguments);
        return l && l.length === arguments.length;
      }(1, 2);
      a || (Object.keys = function(c) {
        return e(c) ? i(n.call(c)) : i(c);
      });
    } else
      Object.keys = r;
    return Object.keys || r;
  }, Zl = r, Zl;
}
var Ql, ld;
function Og() {
  if (ld) return Ql;
  ld = 1;
  var n = Sm(), e = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", t = Object.prototype.toString, r = Array.prototype.concat, i = /* @__PURE__ */ fg(), o = function(b) {
    return typeof b == "function" && t.call(b) === "[object Function]";
  }, a = /* @__PURE__ */ hg()(), l = function(b, m, w, x) {
    if (m in b) {
      if (x === !0) {
        if (b[m] === w)
          return;
      } else if (!o(x) || !x())
        return;
    }
    a ? i(b, m, w, !0) : i(b, m, w);
  }, c = function(b, m) {
    var w = arguments.length > 2 ? arguments[2] : {}, x = n(m);
    e && (x = r.call(x, Object.getOwnPropertySymbols(m)));
    for (var k = 0; k < x.length; k += 1)
      l(b, x[k], m[x[k]], w[x[k]]);
  };
  return c.supportsDescriptors = !!a, Ql = c, Ql;
}
var Xl, cd;
function Am() {
  if (cd) return Xl;
  cd = 1;
  var n = /* @__PURE__ */ Sf();
  return Xl = function(t) {
    return (typeof t == "number" || typeof t == "bigint") && !n(t) && t !== 1 / 0 && t !== -1 / 0;
  }, Xl;
}
var ec, fd;
function Uf() {
  if (fd) return ec;
  fd = 1;
  var n = /* @__PURE__ */ ig(), e = /* @__PURE__ */ nu(), t = /* @__PURE__ */ Sf(), r = /* @__PURE__ */ Am();
  return ec = function(o) {
    if (typeof o != "number" || t(o) || !r(o))
      return !1;
    var a = n(o);
    return e(a) === a;
  }, ec;
}
var tc, hd;
function Rg() {
  if (hd) return tc;
  hd = 1;
  var n = /* @__PURE__ */ ir(), e = /* @__PURE__ */ Dn(), t = /* @__PURE__ */ Uf(), r = e("Number.prototype.toString");
  return tc = function(o, a) {
    if (typeof o != "number")
      throw new n("Assertion failed: `x` must be a Number");
    if (!t(a) || a < 2 || a > 36)
      throw new n("Assertion failed: `radix` must be an integer >= 2 and <= 36");
    return r(o, a);
  }, tc;
}
var rc, pd;
function km() {
  if (pd) return rc;
  pd = 1;
  var n = /* @__PURE__ */ Dn(), e = /* @__PURE__ */ ir(), t = /* @__PURE__ */ Uf(), r = n("String.prototype.slice");
  return rc = function(o, a, l) {
    if (typeof o != "string")
      throw new e("Assertion failed: `string` must be a String");
    if (typeof a != "string")
      throw new e("Assertion failed: `searchValue` must be a String");
    if (!t(l) || l < 0)
      throw new e("Assertion failed: `fromIndex` must be a non-negative integer");
    var c = o.length;
    if (a === "" && l <= c)
      return l;
    for (var b = a.length, m = l; m <= c - b; m += 1) {
      var w = r(o, m, m + b);
      if (w === a)
        return m;
    }
    return -1;
  }, rc;
}
var nc, dd;
function Tg() {
  if (dd) return nc;
  dd = 1;
  var n = /* @__PURE__ */ ir(), e = /* @__PURE__ */ Dn(), t = /* @__PURE__ */ Uf(), r = e("String.prototype.slice");
  return nc = function(o, a, l, c) {
    if (typeof o != "string")
      throw new n("Assertion failed: `S` must be a String");
    if (!t(a) || a < 0)
      throw new n("Assertion failed: `maxLength` must be a non-negative integer");
    if (typeof l != "string")
      throw new n("Assertion failed: `fillString` must be a String");
    if (c !== "start" && c !== "end" && c !== "START" && c !== "END")
      throw new n("Assertion failed: `placement` must be ~START~ or ~END~");
    var b = o.length;
    if (a <= b || l === "")
      return o;
    for (var m = a - b, w = ""; w.length < m; )
      w += l;
    return w = r(w, 0, m), c === "start" || c === "START" ? w + o : o + w;
  }, nc;
}
var ic, vd;
function Om() {
  if (vd) return ic;
  vd = 1;
  var n = /* @__PURE__ */ ir(), e = /* @__PURE__ */ Dn(), t = e("String.prototype.charCodeAt"), r = e("Number.prototype.toString"), i = e("String.prototype.toLowerCase"), o = /* @__PURE__ */ Tg();
  return ic = function(l) {
    if (typeof l != "string" || l.length !== 1)
      throw new n("Assertion failed: `C` must be a single code unit");
    var c = t(l, 0);
    if (c > 65535)
      throw new n("`Assertion failed: numeric value of `C` must be <= 0xFFFF");
    return "\\u" + o(i(r(c, 16)), 4, "0", "start");
  }, ic;
}
var sc, gd;
function Rm() {
  if (gd) return sc;
  gd = 1;
  var n = /* @__PURE__ */ nu();
  return sc = function(t) {
    return typeof t == "bigint" ? t : n(t);
  }, sc;
}
var oc, yd;
function Tm() {
  if (yd) return oc;
  yd = 1;
  var n = /* @__PURE__ */ nu();
  return oc = function(t, r) {
    var i = t % r;
    return n(i >= 0 ? i : i + r);
  }, oc;
}
var ac, md;
function Cm() {
  return md || (md = 1, ac = /* @__PURE__ */ Tm()), ac;
}
var uc, Id;
function Nm() {
  if (Id) return uc;
  Id = 1;
  var n = /* @__PURE__ */ Cm();
  return uc = function(t, r) {
    return n(t, r);
  }, uc;
}
var lc, bd;
function Cg() {
  return bd || (bd = 1, lc = function(e) {
    return typeof e == "number" && e >= 0 && e <= 1114111 && (e | 0) === e;
  }), lc;
}
var cc, _d;
function Pm() {
  if (_d) return cc;
  _d = 1;
  var n = /* @__PURE__ */ ea(), e = /* @__PURE__ */ ir(), t = n("%String.fromCharCode%"), r = /* @__PURE__ */ Rm(), i = /* @__PURE__ */ Nm(), o = /* @__PURE__ */ Cg();
  return cc = function(l) {
    if (!o(l))
      throw new e("Assertion failed: `cp` must be >= 0 and <= 0x10FFFF");
    if (l <= 65535)
      return t(l);
    var c = t(r((l - 65536) / 1024) + 55296), b = t(i(l - 65536, 1024) + 56320);
    return c + b;
  }, cc;
}
var fc, wd;
function $f() {
  return wd || (wd = 1, fc = function(e) {
    return typeof e == "number" && e >= 55296 && e <= 56319;
  }), fc;
}
var hc, xd;
function jf() {
  return xd || (xd = 1, hc = function(e) {
    return typeof e == "number" && e >= 56320 && e <= 57343;
  }), hc;
}
var pc, Ed;
function Dm() {
  if (Ed) return pc;
  Ed = 1;
  var n = /* @__PURE__ */ Dn(), e = pg()(), t = /* @__PURE__ */ cg(), r = /* @__PURE__ */ ho(), i;
  if (e) {
    var o = n("RegExp.prototype.exec"), a = {}, l = function() {
      throw a;
    }, c = {
      toString: l,
      valueOf: l
    };
    typeof Symbol.toPrimitive == "symbol" && (c[Symbol.toPrimitive] = l), i = function(x) {
      if (!x || typeof x != "object")
        return !1;
      var k = (
        /** @type {NonNullable<typeof gOPD>} */
        r(
          /** @type {{ lastIndex?: unknown }} */
          x,
          "lastIndex"
        )
      ), D = k && t(k, "value");
      if (!D)
        return !1;
      try {
        o(
          x,
          /** @type {string} */
          /** @type {unknown} */
          c
        );
      } catch (K) {
        return K === a;
      }
    };
  } else {
    var b = n("Object.prototype.toString"), m = "[object RegExp]";
    i = function(x) {
      return !x || typeof x != "object" && typeof x != "function" ? !1 : b(x) === m;
    };
  }
  return pc = i, pc;
}
var dc, Sd;
function Ng() {
  if (Sd) return dc;
  Sd = 1;
  var n = /* @__PURE__ */ Dn(), e = Dm(), t = n("RegExp.prototype.exec"), r = /* @__PURE__ */ ir();
  return dc = function(o) {
    if (!e(o))
      throw new r("`regex` must be a RegExp");
    return function(l) {
      return t(o, l) !== null;
    };
  }, dc;
}
var vc, Ad;
function Bm() {
  if (Ad) return vc;
  Ad = 1;
  var n = /* @__PURE__ */ Rg(), e = /* @__PURE__ */ km(), t = /* @__PURE__ */ Tg(), r = /* @__PURE__ */ Om(), i = /* @__PURE__ */ Pm(), o = /* @__PURE__ */ $f(), a = /* @__PURE__ */ jf(), l = /* @__PURE__ */ ir(), c = /* @__PURE__ */ Cg(), b = Rf(), m = /* @__PURE__ */ Ng(), w = m(/^\s$/), x = m(/^[\n\r\u2028\u2029]$/), k = "^$\\.*+?()[]{}|", D = ",-=<>#&!%:;@~'`\"", K = {
    "	": "t",
    "\n": "n",
    "\v": "v",
    "\f": "f",
    "\r": "r",
    __proto__: null
  };
  return vc = function(M) {
    if (!c(M))
      throw new l("Assertion failed: `c` must be a valid Unicode code point");
    var J = i(M);
    if (e(k, J, 0) > -1 || J === "/")
      return "\\" + J;
    if (J in K)
      return "\\" + K[J];
    if (e(D, J, 0) > -1 || w(J) || x(J) || o(M) || a(M)) {
      if (M < 255) {
        var X = n(M, 16);
        return "\\x" + t(X, 2, "0", "START");
      }
      var le = "", ce = J;
      return b(ce, function(fe) {
        le += r(fe);
      }), le;
    }
    return J;
  }, vc;
}
var gc, kd;
function Fm() {
  if (kd) return gc;
  kd = 1;
  var n = /* @__PURE__ */ ea(), e = /* @__PURE__ */ ir(), t = n("%String.fromCharCode%"), r = /* @__PURE__ */ $f(), i = /* @__PURE__ */ jf();
  return gc = function(a, l) {
    if (!r(a) || !i(l))
      throw new e("Assertion failed: `lead` must be a leading surrogate char code, and `trail` must be a trailing surrogate char code");
    return t(a) + t(l);
  }, gc;
}
var yc, Od;
function Lm() {
  if (Od) return yc;
  Od = 1;
  var n = /* @__PURE__ */ ir(), e = /* @__PURE__ */ Dn(), t = /* @__PURE__ */ $f(), r = /* @__PURE__ */ jf(), i = /* @__PURE__ */ Fm(), o = e("String.prototype.charAt"), a = e("String.prototype.charCodeAt");
  return yc = function(c, b) {
    if (typeof c != "string")
      throw new n("Assertion failed: `string` must be a String");
    var m = c.length;
    if (b < 0 || b >= m)
      throw new n("Assertion failed: `position` must be >= 0, and < the length of `string`");
    var w = a(c, b), x = o(c, b), k = t(w), D = r(w);
    if (!k && !D)
      return {
        "[[CodePoint]]": x,
        "[[CodeUnitCount]]": 1,
        "[[IsUnpairedSurrogate]]": !1
      };
    if (D || b + 1 === m)
      return {
        "[[CodePoint]]": x,
        "[[CodeUnitCount]]": 1,
        "[[IsUnpairedSurrogate]]": !0
      };
    var K = a(c, b + 1);
    return r(K) ? {
      "[[CodePoint]]": i(w, K),
      "[[CodeUnitCount]]": 2,
      "[[IsUnpairedSurrogate]]": !1
    } : {
      "[[CodePoint]]": x,
      "[[CodeUnitCount]]": 1,
      "[[IsUnpairedSurrogate]]": !0
    };
  }, yc;
}
var mc, Rd;
function qm() {
  if (Rd) return mc;
  Rd = 1;
  var n = /* @__PURE__ */ ir(), e = /* @__PURE__ */ Lm();
  return mc = function(r) {
    if (typeof r != "string")
      throw new n("Assertion failed: `string` must be a String");
    for (var i = [], o = r.length, a = 0; a < o; ) {
      var l = e(r, a);
      i[i.length] = l["[[CodePoint]]"], a += l["[[CodeUnitCount]]"];
    }
    return i;
  }, mc;
}
var Ic, Td;
function Mm() {
  if (Td) return Ic;
  Td = 1;
  var n = /* @__PURE__ */ ea(), e = Tf(), t = e(n("String.prototype.indexOf"));
  return Ic = function(i, o) {
    var a = n(i, !!o);
    return typeof a == "function" && t(i, ".prototype.") > -1 ? e(a) : a;
  }, Ic;
}
var bc, Cd;
function Pg() {
  if (Cd) return bc;
  Cd = 1;
  var n = Bm(), e = /* @__PURE__ */ Rg(), t = /* @__PURE__ */ qm(), r = /* @__PURE__ */ Ng(), i = Rf(), o = /* @__PURE__ */ ir(), a = r(/^[\da-zA-Z]$/), l = Mm(), c = l("String.prototype.charCodeAt"), b = function(w) {
    var x = c(w, 0);
    if (x < 55296 || x > 56319 || w.length === 1)
      return x;
    var k = c(w, 1);
    return k < 56320 || k > 57343 ? x : (x - 55296) * 1024 + (k - 56320) + 65536;
  };
  return bc = function(w) {
    if (typeof w != "string")
      throw new o("`S` must be a String");
    var x = "", k = t(w);
    return i(k, function(D) {
      if (x === "" && a(D)) {
        var K = e(b(D), 16);
        x += "\\x" + K;
      } else
        x += n(b(D));
    }), x;
  }, bc;
}
var _c, Nd;
function Dg() {
  if (Nd) return _c;
  Nd = 1;
  var n = Pg();
  return _c = function() {
    return RegExp.escape || n;
  }, _c;
}
var wc, Pd;
function Um() {
  if (Pd) return wc;
  Pd = 1;
  var n = Og(), e = Dg()();
  return wc = function() {
    return n(RegExp, {
      escape: e
    }), RegExp.escape;
  }, wc;
}
var xc, Dd;
function $m() {
  if (Dd) return xc;
  Dd = 1;
  var n = Og(), e = Tf(), t = Pg(), r = Dg(), i = Um(), o = e(t, null);
  return n(o, {
    getPolyfill: r,
    implementation: t,
    method: t,
    // TODO: remove at semver-major
    shim: i
  }), xc = o, xc;
}
var jm = $m();
const Km = /* @__PURE__ */ Ef(jm);
var Xv;
const zm = ((Xv = Object.getOwnPropertyDescriptor(RegExp, "escape")) == null ? void 0 : Xv.value) ?? Km;
function Gm(n) {
  if (!Array.isArray(n)) return null;
  let e = 0, t = 0;
  for (const r of n)
    typeof r == "number" && (e += r, t += 1);
  return t > 0 ? e / t : null;
}
function Bg(n, e) {
  return Array.isArray(n) ? ja(e) < 5 ? n.includes(e) : n.some((t) => Pn(t, e)) : null;
}
function Hm(n) {
  if (!Array.isArray(n)) return null;
  let e = 0;
  for (const t of n)
    t !== null && ++e;
  return e;
}
function Wm(n) {
  if (!Array.isArray(n)) return null;
  for (const e of n)
    if (e !== null) return e;
  return null;
}
function Ym(n) {
  return Array.isArray(n) ? n.length : null;
}
function Fg(n, e) {
  if (!Array.isArray(n)) return null;
  let t = null, r = !0;
  for (const i of n)
    i !== null && ((r || Wt(i, t) === e) && (t = i), r = !1);
  return t;
}
function Vm(n) {
  return Fg(n, 1);
}
function Jm(n) {
  return Fg(n, -1);
}
function Zm(n) {
  if (!Array.isArray(n)) return null;
  let e = 0;
  for (const t of n)
    typeof t == "number" && (e += t);
  return e;
}
function Wt(n, e) {
  const t = ja(n), r = ja(e);
  if (t !== r)
    return Math.sign(t - r);
  switch (t) {
    case 5: {
      const i = n, o = e, a = i.length, l = o.length, c = Math.min(a, l);
      for (let b = 0; b < c; ++b) {
        const m = Wt(i[b], o[b]);
        if (m !== 0)
          return m;
      }
      return Math.sign(a - l);
    }
    case 6: {
      const i = n, o = e, a = Object.getOwnPropertyNames(i), l = Object.getOwnPropertyNames(o), c = a.length, b = Math.sign(c - l.length);
      if (b !== 0) return b;
      a.sort(), l.sort();
      for (let m = 0; m < c; ++m) {
        const w = a[m], x = l[m];
        if (w !== x)
          return w > x ? 1 : -1;
        const k = Wt(i[w], o[x]);
        if (k !== 0) return k;
      }
      return 0;
    }
    default:
      return n < e ? -1 : n > e ? 1 : 0;
  }
}
function Pn(n, e) {
  return n === void 0 || e === void 0 ? n === e : lo(n, e);
}
function Bd(n, e) {
  let t;
  for (const r of n) {
    const i = r();
    i != null && (t === void 0 || Wt(i, t) === e) && (t = i);
  }
  return t ?? null;
}
function Qm(n, e) {
  if (!(e === void 0 || Pn(n, e)))
    return e === null ? null : n;
}
function Xm(n, e) {
  if (!(n === void 0 || e === void 0))
    return e === null || Pn(n, e) ? null : n;
}
const Lg = { millennium: 1e3, century: 100, decade: 10 }, e1 = {
  year: Sg,
  iso_year: pm,
  quarter: gm,
  month: vm,
  week: ym,
  iso_week: dm,
  day: ka,
  day_of_year: ka,
  doy: ka,
  hour: mm,
  minute: Im,
  second: bm,
  millisecond: Mf
}, t1 = {
  year: hm,
  iso_year: am,
  quarter: lm,
  month: Ff,
  week: fm,
  day: Eg,
  hour: nm,
  minute: um,
  second: cm,
  millisecond: Lf
};
function r1(n, e, t) {
  let r = Lg[t];
  r !== void 0 && (e *= r, t = "year");
  const i = t1[t];
  if (i === void 0)
    return console.error(`date_add_str(): Unsupported date part "${t}"`), null;
  const o = i(n, e);
  return typeof n == "string" ? o.toISOString() : o.valueOf();
}
function n1(n, e, t) {
  const r = e1[t];
  if (r !== void 0)
    return r(n, e);
  let i = Lg[t];
  return i !== void 0 ? Math.trunc(Sg(n, e) / i) : (console.error(`date_diff_str(): Unsupported date part "${t}"`), null);
}
function qg(n) {
  return new Fi(n).toISOString();
}
function Kf(n) {
  return new Date(n).toISOString();
}
function Mg(n, e) {
  if (e === void 0)
    return qg(n);
  if (e === "UTC")
    return Kf(n);
  try {
    return new Fi(n, e).toISOString();
  } catch (t) {
    if (!(t instanceof RangeError))
      throw t;
    return console.error(`millis_to_tz(): Unknown time zone "${e}"`), null;
  }
}
function i1(n) {
  const e = Date.parse(n);
  return isNaN(e) ? null : e;
}
function s1(n) {
  const e = Date.parse(n);
  return isNaN(e) ? null : Kf(e);
}
function o1(n, e) {
  const t = Date.parse(n);
  return isNaN(t) ? null : Mg(t, e);
}
function a1(n, e) {
  let t = n / e;
  return isFinite(t) ? (n === Math.floor(n) && e === Math.floor(e) && (t = Math.floor(t)), t) : null;
}
function u1(n, e, t) {
  const r = Ua(n), i = Ua(e);
  if (r === void 0 || i === void 0)
    return null;
  const o = r.length;
  if (i.length !== o)
    return null;
  let a = 0;
  for (let l = 0; l < o; ++l) {
    const c = r[l] - i[l];
    a += c * c;
  }
  return Math.pow(a, (t ?? 1) / 2);
}
function l1(n, e) {
  const t = Ua(n), r = Ua(e);
  if (t === void 0 || r === void 0)
    return null;
  const i = t.length;
  if (r.length !== i)
    return null;
  let o = 0, a = 0, l = 0;
  for (let c = 0; c < i; ++c) {
    const b = t[c], m = r[c];
    o += b * b, a += b * m, l += m * m;
  }
  return 1 - a / Math.sqrt(o * l);
}
function Ua(n) {
  if (Array.isArray(n))
    return n;
  if (typeof n == "string") {
    const e = tm(n);
    return e === void 0 || e.length % 4 !== 0 ? void 0 : new Float32Array(e.buffer);
  } else
    return;
}
function c1(n, e) {
  let t = n / e;
  return isFinite(t) ? Math.floor(t) : null;
}
function zf(n, e, t) {
  if (e === 0)
    return t(n);
  if (e !== Math.trunc(e))
    return null;
  const r = Math.pow(10, e);
  return t(n * r) / r;
}
function Fd(n, e = 0) {
  return zf(n, e, Math.round);
}
function Ug(n, e = 0) {
  return zf(n, e, (t) => {
    const r = Math.floor(t);
    return t - r === 0.5 ? r % 2 ? r + 1 : r : Math.round(t);
  });
}
function f1(n, e) {
  return zf(n, e, Math.trunc);
}
function h1(n, e) {
  const [t, r] = Gf(e);
  switch (t) {
    case 0:
      return n === r;
    case 1:
      return n.startsWith(r);
    case 2:
      return n.endsWith(r);
    default:
      return $g(e).test(n);
  }
}
function Ec(n) {
  return n.replaceAll(/\\(.)/g, "$1");
}
function $g(n) {
  const e = n.split(/([%_])/), t = e.length;
  for (let r = 0; r < t; r++) {
    const i = e[r];
    r & 1 ? e[r] = i === "%" ? ".*" : "." : e[r] = zm(i);
  }
  return (e[0] || e[1] === ".") && e.unshift("^"), (e.at(-1) || e.at(-2) === ".") && e.push("$"), new RegExp(e.join(""));
}
function Gf(n) {
  const e = n.replaceAll(/\\./g, "##");
  if (e.indexOf("_") >= 0)
    return [3, n];
  let t = e.indexOf("%");
  if (t < 0)
    return [0, Ec(n)];
  if (e.lastIndexOf("%") === t) {
    if (t === 0)
      return [2, Ec(n.slice(1))];
    if (t === e.length - 1)
      return [1, Ec(n.slice(0, -1))];
  }
  return [3, n];
}
function p1(n) {
  const e = n.length;
  for (let t = 0; t < e; ++t)
    if (n.charCodeAt(t) > 127)
      return new TextEncoder().encode(n).length;
  return e;
}
function jg(n, e) {
  const t = n.length;
  for (let r = 0; r < t; ++r)
    if (!e.includes(n[r]))
      return n.slice(r);
  return "";
}
function Kg(n, e) {
  const t = n.length;
  for (let r = t - 1; r >= 0; --r)
    if (!e.includes(n[r]))
      return n.slice(0, r + 1);
  return "";
}
function d1(n, e) {
  return jg(Kg(n, e), e);
}
function Ld(n) {
  return typeof n == "boolean";
}
function qd(n) {
  return typeof n == "number";
}
function Md(n) {
  return typeof n == "string";
}
function Ud(n) {
  return typeof n == "object" && !Array.isArray(n);
}
function Sc(n) {
  return n != null;
}
function $d(n) {
  const e = typeof n;
  return e === "boolean" || e === "number" || e === "string";
}
function jd(n) {
  return Array.isArray(n) ? n : [n];
}
function $a(n) {
  if (typeof n != "object" || n === null)
    return n;
  if (Array.isArray(n)) {
    if (n.length === 1)
      return $a(n[0]);
  } else {
    const e = Object.getOwnPropertyNames(n);
    if (e.length === 1)
      return $a(n[e[0]]);
  }
  return null;
}
function Kd(n) {
  return n ? typeof n != "object" ? !0 : Array.isArray(n) ? n.length > 0 : Object.getOwnPropertyNames(n).length > 0 : !1;
}
function zd(n) {
  switch (typeof n) {
    case "number":
      return n;
    case "boolean":
      return Number(n);
    case "string": {
      const e = Number(n);
      return isNaN(e) ? null : e;
    }
    default:
      return null;
  }
}
function Gd(n) {
  return typeof n == "object" && !Array.isArray(n) ? n : {};
}
function Hd(n) {
  switch (typeof n) {
    case "string":
      return n;
    case "number":
    case "boolean":
      return String(n);
    default:
      return null;
  }
}
function Wd(n) {
  return v1[ja(n)];
}
const v1 = ["missing", "null", "boolean", "number", "string", "array", "object"];
function ja(n) {
  switch (typeof n) {
    case "undefined":
      return 0;
    case "boolean":
      return 2;
    case "number":
      return 3;
    case "string":
      return 4;
    case "object":
      return Array.isArray(n) ? 5 : n === null ? 1 : 6;
  }
}
class vo {
  constructor(e, t) {
    this.sourceExpression = e, this.compiledArg = t;
  }
  /** Adds the current value of the compiledArg to my state. */
  accumulate() {
    this.add(this.compiledArg());
  }
}
class Hf extends vo {
  constructor() {
    super(...arguments);
    ve(this, "result", []);
  }
  clone() {
    return new Hf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = [];
  }
  add(t) {
    t !== void 0 && this.result.push(t);
  }
}
var Li, Bs;
const ch = class ch extends vo {
  constructor() {
    super(...arguments);
    ee(this, Li, 0);
    ee(this, Bs, 0);
  }
  clone() {
    return new ch(this.sourceExpression, this.compiledArg);
  }
  reset() {
    G(this, Li, G(this, Bs, 0));
  }
  add(t) {
    typeof t == "number" && (G(this, Li, p(this, Li) + 1), G(this, Bs, p(this, Bs) + t));
  }
  get result() {
    return p(this, Li) ? p(this, Bs) / p(this, Li) : null;
  }
};
Li = new WeakMap(), Bs = new WeakMap();
let ef = ch;
class Wf extends vo {
  constructor() {
    super(...arguments);
    ve(this, "result", 0);
  }
  clone() {
    return new Wf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = 0;
  }
  add(t) {
    this.result++;
  }
}
class Yf extends vo {
  constructor() {
    super(...arguments);
    ve(this, "result", null);
  }
  clone() {
    return new Yf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = null;
  }
  add(t) {
    t != null && (this.result === null || Wt(t, this.result) > 0) && (this.result = t);
  }
}
class Vf extends vo {
  constructor() {
    super(...arguments);
    ve(this, "result", null);
  }
  clone() {
    return new Vf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = null;
  }
  add(t) {
    t != null && (this.result === null || Wt(t, this.result) < 0) && (this.result = t);
  }
}
class Jf extends vo {
  constructor() {
    super(...arguments);
    ve(this, "result", 0);
  }
  clone() {
    return new Jf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = 0;
  }
  add(t) {
    typeof t == "number" && (this.result += t);
  }
}
function g1(n) {
  Yd(n);
  for (let e of n.FROM)
    Yd(e);
  n.WHAT = n.WHAT.map((e) => typeof e == "string" ? ["." + e] : e), zg(n, (e, t) => {
    const r = e[0];
    return (r === "." || r === "$" || r === "?") && e.length > 1 ? (t.splice(1, 0, ...e.substring(1).split(".")), t[0] = e[0]) : t[0] = e.toUpperCase(), !0;
  });
}
function y1(n, e, t) {
  zg(n, (r, i) => {
    if (r === ".") {
      const o = i[1];
      if (o === void 0 || !e.has(o)) {
        if (t === void 0)
          throw Error(`property path ${i.slice(1).join(".")} does not start with an alias`);
        i.splice(1, 0, t), i.aliasAdded = !0;
      }
    } else if (r === "META()" && (i.length < 2 || i[1] === null)) {
      if (t === void 0)
        throw Error("ambiguous META() needs a collection name as argument");
      i[1] = t;
    }
    return !0;
  });
}
function Yd(n) {
  for (const e of Object.getOwnPropertyNames(n)) {
    const t = e.toUpperCase();
    if (t !== e) {
      if (t in n) throw Error(`Conflicting keys "${e}" and "${t}"`);
      n[t] = n[e], delete n[e];
    }
  }
}
function zg(n, e) {
  function t(r) {
    r !== void 0 && Zf(r, e);
  }
  for (let r of n.WHAT)
    t(r);
  for (let r of n.FROM)
    "ON" in r && t(r.ON), "UNNEST" in r && t(r.UNNEST);
  if (t(n.WHERE), t(n.HAVING), n.GROUP_BY)
    for (let r of n.GROUP_BY) t(r);
  if (n.ORDER_BY)
    for (let r of n.ORDER_BY) t(r);
  t(n.LIMIT), t(n.OFFSET);
}
function Zf(n, e) {
  return t(n);
  function t(r) {
    if (ta(r))
      return !0;
    if (Array.isArray(r)) {
      const i = r[0];
      if (!e(i, r))
        return !1;
      if (i !== "." && i !== "META()") {
        const o = r.length;
        for (let a = 1; a < o; ++a)
          if (!t(r[a]))
            return !1;
      }
      return !0;
    } else {
      for (const i of Object.getOwnPropertyNames(r))
        if (!t(r[i]))
          return !1;
      return !0;
    }
  }
}
function Ac(n) {
  let e = /* @__PURE__ */ new Set();
  return Zf(n, (t, r) => ((t === "." || t === "META()") && e.add(r[1]), !0)), e;
}
function Vd(n) {
  let e = [];
  const t = (r) => {
    if (Array.isArray(r))
      if (r[0] === "AND")
        for (let i = 1; i < r.length; ++i)
          t(r[i]);
      else
        e.push(r);
    else if (!r)
      throw Error("WHERE or ON condition is always false; no results possible");
  };
  return t(n), e;
}
function br(n) {
  const e = n || "";
  return function() {
    throw new Error(
      "this method " + e + " is abstract! (it has no implementation in class " + this.constructor.name + ")"
    );
  };
}
function Ei(n, e) {
  if (!n)
    throw new Error(e || "Assertion failed");
}
function tf(n, e, t) {
  let r;
  Object.defineProperty(n, e, {
    get() {
      return r || (r = t.call(this)), r;
    }
  });
}
function m1(n) {
  return n && Object.assign({}, n);
}
function Gg(n, e) {
  const t = [];
  for (; e-- > 0; )
    t.push(n());
  return t;
}
function Hg(n, e) {
  return new Array(e + 1).join(n);
}
function ou(n, e) {
  return Gg(() => n, e);
}
function rf(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const r = n[t];
    n.lastIndexOf(r) !== t && e.indexOf(r) < 0 && e.push(r);
  }
  return e;
}
function Wg(n) {
  const e = [];
  return n.forEach((t) => {
    e.indexOf(t) < 0 && e.push(t);
  }), e;
}
function ps(n) {
  const e = n[0];
  return e === e.toUpperCase();
}
function Yg(n) {
  return !ps(n);
}
function Vg(n, e, t) {
  const r = t || " ";
  return n.length < e ? Hg(r, e - n.length) + n : n;
}
function ms() {
  this.strings = [];
}
ms.prototype.append = function(n) {
  this.strings.push(n);
};
ms.prototype.contents = function() {
  return this.strings.join("");
};
const kc = (n) => String.fromCodePoint(parseInt(n, 16));
function Jg(n) {
  if (n.charAt(0) === "\\")
    switch (n.charAt(1)) {
      case "b":
        return "\b";
      case "f":
        return "\f";
      case "n":
        return `
`;
      case "r":
        return "\r";
      case "t":
        return "	";
      case "v":
        return "\v";
      case "x":
        return kc(n.slice(2, 4));
      case "u":
        return n.charAt(2) === "{" ? kc(n.slice(3, -1)) : kc(n.slice(2, 6));
      default:
        return n.charAt(1);
    }
  else
    return n;
}
function Zg(n) {
  if (n == null)
    return String(n);
  const e = Object.prototype.toString.call(n);
  try {
    let t;
    return n.constructor && n.constructor.name ? t = n.constructor.name : e.indexOf("[object ") === 0 ? t = e.slice(8, -1) : t = typeof n, t + ": " + JSON.stringify(String(n));
  } catch {
    return e;
  }
}
function Qg(n, e = "unexpected null value") {
  if (n == null)
    throw new Error(e);
  return n;
}
const I1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StringBuffer: ms,
  abstract: br,
  assert: Ei,
  checkNotNull: Qg,
  clone: m1,
  copyWithoutDuplicates: Wg,
  defineLazyProperty: tf,
  getDuplicates: rf,
  isLexical: Yg,
  isSyntactic: ps,
  padLeft: Vg,
  repeat: ou,
  repeatFn: Gg,
  repeatStr: Hg,
  unescapeCodePoint: Jg,
  unexpectedObjToString: Zg
}, Symbol.toStringTag, { value: "Module" })), b1 = {
  // Letters
  Lu: new RegExp("\\p{Lu}", "u"),
  Ll: new RegExp("\\p{Ll}", "u"),
  Lt: new RegExp("\\p{Lt}", "u"),
  Lm: new RegExp("\\p{Lm}", "u"),
  Lo: new RegExp("\\p{Lo}", "u"),
  // Numbers
  Nl: new RegExp("\\p{Nl}", "u"),
  Nd: new RegExp("\\p{Nd}", "u"),
  // Marks
  Mn: new RegExp("\\p{Mn}", "u"),
  Mc: new RegExp("\\p{Mc}", "u"),
  // Punctuation, Connector
  Pc: new RegExp("\\p{Pc}", "u"),
  // Separator, Space
  Zs: new RegExp("\\p{Zs}", "u"),
  // These two are not real Unicode categories, but our useful for Ohm.
  // L is a combination of all the letter categories.
  // Ltmo is a combination of Lt, Lm, and Lo.
  L: new RegExp("\\p{Letter}", "u"),
  Ltmo: new RegExp("\\p{Lt}|\\p{Lm}|\\p{Lo}", "u")
};
class Ge {
  constructor() {
    if (this.constructor === Ge)
      throw new Error("PExpr cannot be instantiated -- it's abstract");
  }
  // Set the `source` property to the interval containing the source for this expression.
  withSource(e) {
    return e && (this.source = e.trimmed()), this;
  }
}
const sr = Object.create(Ge.prototype), or = Object.create(Ge.prototype);
class Vt extends Ge {
  constructor(e) {
    super(), this.obj = e;
  }
}
class ar extends Ge {
  constructor(e, t) {
    super(), this.from = e, this.to = t, this.matchCodePoint = e.length > 1 || t.length > 1;
  }
}
class ur extends Ge {
  constructor(e) {
    super(), this.index = e;
  }
}
class Mt extends Ge {
  constructor(e) {
    super(), this.terms = e;
  }
}
class au extends Mt {
  constructor(e, t, r) {
    const i = e.rules[t].body;
    super([r, i]), this.superGrammar = e, this.name = t, this.body = r;
  }
}
class uu extends Mt {
  constructor(e, t, r, i) {
    const o = e.rules[t].body;
    super([...r, o, ...i]), this.superGrammar = e, this.ruleName = t, this.expansionPos = r.length;
  }
}
class Gt extends Ge {
  constructor(e) {
    super(), this.factors = e;
  }
}
class _r extends Ge {
  constructor(e) {
    super(), this.expr = e;
  }
}
class Is extends _r {
}
class go extends _r {
}
class Bn extends _r {
}
Is.prototype.operator = "*";
go.prototype.operator = "+";
Bn.prototype.operator = "?";
Is.prototype.minNumMatches = 0;
go.prototype.minNumMatches = 1;
Bn.prototype.minNumMatches = 0;
Is.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
go.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Bn.prototype.maxNumMatches = 1;
class wr extends Ge {
  constructor(e) {
    super(), this.expr = e;
  }
}
class xr extends Ge {
  constructor(e) {
    super(), this.expr = e;
  }
}
class kr extends Ge {
  constructor(e) {
    super(), this.expr = e;
  }
}
class mt extends Ge {
  constructor(e, t = []) {
    super(), this.ruleName = e, this.args = t;
  }
  isSyntactic() {
    return ps(this.ruleName);
  }
  // This method just caches the result of `this.toString()` in a non-enumerable property.
  toMemoKey() {
    return this._memoKey || Object.defineProperty(this, "_memoKey", { value: this.toString() }), this._memoKey;
  }
}
class Yt extends Ge {
  constructor(e) {
    super(), this.category = e, this.pattern = b1[e];
  }
}
function Ct(n, e) {
  let t;
  return e ? (t = new Error(e.getLineAndColumnMessage() + n), t.shortMessage = n, t.interval = e) : t = new Error(n), t;
}
function nf() {
  return Ct("Interval sources don't match");
}
function _1(n, e, t) {
  const r = e ? `Grammar ${n} is not declared in namespace '${e}'` : "Undeclared grammar " + n;
  return Ct(r, t);
}
function w1(n, e) {
  return Ct("Grammar " + n.name + " is already declared in this namespace");
}
function x1(n) {
  return Ct(`Grammar '${n.name}' does not support incremental parsing`);
}
function Xg(n, e, t) {
  return Ct(
    "Rule " + n + " is not declared in grammar " + e,
    t
  );
}
function E1(n, e, t) {
  return Ct(
    "Cannot override rule " + n + " because it is not declared in " + e,
    t
  );
}
function S1(n, e, t) {
  return Ct(
    "Cannot extend rule " + n + " because it is not declared in " + e,
    t
  );
}
function Jd(n, e, t, r) {
  let i = "Duplicate declaration for rule '" + n + "' in grammar '" + e + "'";
  return e !== t && (i += " (originally declared in '" + t + "')"), Ct(i, r);
}
function e0(n, e, t, r) {
  return Ct(
    "Wrong number of parameters for rule " + n + " (expected " + e + ", got " + t + ")",
    r
  );
}
function A1(n, e, t, r) {
  return Ct(
    "Wrong number of arguments for rule " + n + " (expected " + e + ", got " + t + ")",
    r
  );
}
function Zd(n, e, t) {
  return Ct(
    "Duplicate parameter names in rule " + n + ": " + e.join(", "),
    t
  );
}
function k1(n, e) {
  return Ct(
    "Invalid parameter to rule " + n + ": " + e + " has arity " + e.getArity() + ", but parameter expressions must have arity 1",
    e.source
  );
}
const O1 = "NOTE: A _syntactic rule_ is a rule whose name begins with a capital letter. See https://ohmjs.org/d/svl for more details.";
function R1(n, e) {
  return Ct(
    "Cannot apply syntactic rule " + n + " from here (inside a lexical context)",
    e.source
  );
}
function T1(n) {
  const { ruleName: e } = n;
  return Ct(
    `applySyntactic is for syntactic rules, but '${e}' is a lexical rule. ` + O1,
    n.source
  );
}
function C1(n) {
  return Ct(
    "applySyntactic is not required here (in a syntactic context)",
    n.source
  );
}
function Qd(n, e) {
  return Ct("Incorrect argument type: expected " + n, e.source);
}
function N1(n) {
  return Ct("'...' can appear at most once in a rule body", n.source);
}
function P1(n) {
  const e = n._node;
  Ei(e && e.isNonterminal() && e.ctorName === "escapeChar_unicodeCodePoint");
  const t = n.children.slice(1, -1).map((i) => i.source), r = t[0].coverageWith(...t.slice(1));
  return Ct(
    `U+${r.contents} is not a valid Unicode code point`,
    r
  );
}
function t0(n, e) {
  const t = e.length > 0 ? e[e.length - 1].args : [];
  let i = "Nullable expression " + n.expr.substituteParams(t) + " is not allowed inside '" + n.operator + "' (possible infinite loop)";
  if (e.length > 0) {
    const o = e.map((a) => new mt(a.ruleName, a.args)).join(`
`);
    i += `
Application stack (most recent application last):
` + o;
  }
  return Ct(i, n.expr.source);
}
function r0(n, e, t, r) {
  return Ct(
    "Rule " + n + " involves an alternation which has inconsistent arity (expected " + e + ", got " + t + ")",
    r.source
  );
}
function D1(n) {
  const e = n.map((t) => t.message);
  return Ct(["Errors:"].concat(e).join(`
- `), n[0].interval);
}
function B1(n, e, t, r) {
  let i = r.slice(0, -1).map((c) => {
    const b = "  " + c[0].name + " > " + c[1];
    return c.length === 3 ? b + " for '" + c[2] + "'" : b;
  }).join(`
`);
  i += `
  ` + e + " > " + n;
  let o = "";
  n === "_iter" && (o = [
    `
NOTE: as of Ohm v16, there is no default action for iteration nodes — see `,
    "  https://ohmjs.org/d/dsa for details."
  ].join(`
`));
  const a = [
    `Missing semantic action for '${n}' in ${t} '${e}'.${o}`,
    "Action stack (most recent call last):",
    i
  ].join(`
`), l = Ct(a);
  return l.name = "missingSemanticAction", l;
}
function F1(n) {
  if (n.length === 1)
    throw n[0];
  if (n.length > 1)
    throw D1(n);
}
function L1(n) {
  let e = 0;
  return n.map((r) => {
    const i = r.toString();
    return e = Math.max(e, i.length), i;
  }).map((r) => Vg(r, e));
}
function Xd(n, e, t) {
  const r = n.length, i = n.slice(0, t), o = n.slice(t + e.length);
  return (i + e + o).substr(0, r);
}
function q1(...n) {
  const e = this, { offset: t } = e, { repeatStr: r } = I1, i = new ms();
  i.append("Line " + e.lineNum + ", col " + e.colNum + `:
`);
  const o = L1([
    e.prevLine == null ? 0 : e.lineNum - 1,
    e.lineNum,
    e.nextLine == null ? 0 : e.lineNum + 1
  ]), a = (m, w, x) => {
    i.append(x + o[m] + " | " + w + `
`);
  };
  e.prevLine != null && a(0, e.prevLine, "  "), a(1, e.line, "> ");
  const l = e.line.length;
  let c = r(" ", l + 1);
  for (let m = 0; m < n.length; ++m) {
    let w = n[m][0], x = n[m][1];
    Ei(w >= 0 && w <= x, "range start must be >= 0 and <= end");
    const k = t - e.colNum + 1;
    w = Math.max(0, w - k), x = Math.min(x - k, l), c = Xd(c, r("~", x - w), w);
  }
  const b = 2 + o[1].length + 3;
  return i.append(r(" ", b)), c = Xd(c, "^", e.colNum - 1), i.append(c.replace(/ +$/, "") + `
`), e.nextLine != null && a(2, e.nextLine, "  "), i.contents();
}
let sf = [];
function n0(n) {
  sf.push(n);
}
function M1(n) {
  sf.forEach((e) => {
    e(n);
  }), sf = null;
}
function Qf(n, e) {
  let t = 1, r = 1, i = 0, o = 0, a = null, l = null, c = -1;
  for (; i < e; ) {
    const w = n.charAt(i++);
    w === `
` ? (t++, r = 1, c = o, o = i) : w !== "\r" && r++;
  }
  let b = n.indexOf(`
`, o);
  if (b === -1)
    b = n.length;
  else {
    const w = n.indexOf(`
`, b + 1);
    a = w === -1 ? n.slice(b) : n.slice(b, w), a = a.replace(/^\r?\n/, "").replace(/\r$/, "");
  }
  c >= 0 && (l = n.slice(c, o).replace(/\r?\n$/, ""));
  const m = n.slice(o, b).replace(/\r$/, "");
  return {
    offset: e,
    lineNum: t,
    colNum: r,
    line: m,
    prevLine: l,
    nextLine: a,
    toString: q1
  };
}
function i0(n, e, ...t) {
  return Qf(n, e).toString(...t);
}
const ev = /* @__PURE__ */ (() => {
  let n = 0;
  return (e) => "" + e + n++;
})();
class nr {
  constructor(e, t, r) {
    this.sourceString = e, this.startIdx = t, this.endIdx = r;
  }
  get contents() {
    return this._contents === void 0 && (this._contents = this.sourceString.slice(this.startIdx, this.endIdx)), this._contents;
  }
  get length() {
    return this.endIdx - this.startIdx;
  }
  coverageWith(...e) {
    return nr.coverage(...e, this);
  }
  collapsedLeft() {
    return new nr(this.sourceString, this.startIdx, this.startIdx);
  }
  collapsedRight() {
    return new nr(this.sourceString, this.endIdx, this.endIdx);
  }
  getLineAndColumn() {
    return Qf(this.sourceString, this.startIdx);
  }
  getLineAndColumnMessage() {
    const e = [this.startIdx, this.endIdx];
    return i0(this.sourceString, this.startIdx, e);
  }
  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus(e) {
    if (this.sourceString !== e.sourceString)
      throw nf();
    return this.startIdx === e.startIdx && this.endIdx === e.endIdx ? [] : this.startIdx < e.startIdx && e.endIdx < this.endIdx ? [
      new nr(this.sourceString, this.startIdx, e.startIdx),
      new nr(this.sourceString, e.endIdx, this.endIdx)
    ] : this.startIdx < e.endIdx && e.endIdx < this.endIdx ? [new nr(this.sourceString, e.endIdx, this.endIdx)] : this.startIdx < e.startIdx && e.startIdx < this.endIdx ? [new nr(this.sourceString, this.startIdx, e.startIdx)] : [this];
  }
  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo(e) {
    if (this.sourceString !== e.sourceString)
      throw nf();
    return Ei(
      this.startIdx >= e.startIdx && this.endIdx <= e.endIdx,
      "other interval does not cover this one"
    ), new nr(
      this.sourceString,
      this.startIdx - e.startIdx,
      this.endIdx - e.startIdx
    );
  }
  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends.
  trimmed() {
    const { contents: e } = this, t = this.startIdx + e.match(/^\s*/)[0].length, r = this.endIdx - e.match(/\s*$/)[0].length;
    return new nr(this.sourceString, t, r);
  }
  subInterval(e, t) {
    const r = this.startIdx + e;
    return new nr(this.sourceString, r, r + t);
  }
}
nr.coverage = function(n, ...e) {
  let { startIdx: t, endIdx: r } = n;
  for (const i of e) {
    if (i.sourceString !== n.sourceString)
      throw nf();
    t = Math.min(t, i.startIdx), r = Math.max(r, i.endIdx);
  }
  return new nr(n.sourceString, t, r);
};
const U1 = 65535;
class lu {
  constructor(e) {
    this.source = e, this.pos = 0, this.examinedLength = 0;
  }
  atEnd() {
    const e = this.pos >= this.source.length;
    return this.examinedLength = Math.max(this.examinedLength, this.pos + 1), e;
  }
  next() {
    const e = this.source[this.pos++];
    return this.examinedLength = Math.max(this.examinedLength, this.pos), e;
  }
  nextCharCode() {
    const e = this.next();
    return e && e.charCodeAt(0);
  }
  nextCodePoint() {
    const e = this.source.slice(this.pos++).codePointAt(0);
    return e > U1 && (this.pos += 1), this.examinedLength = Math.max(this.examinedLength, this.pos), e;
  }
  matchString(e, t) {
    let r;
    if (t) {
      for (r = 0; r < e.length; r++) {
        const i = this.next(), o = e[r];
        if (i == null || i.toUpperCase() !== o.toUpperCase())
          return !1;
      }
      return !0;
    }
    for (r = 0; r < e.length; r++)
      if (this.next() !== e[r])
        return !1;
    return !0;
  }
  sourceSlice(e, t) {
    return this.source.slice(e, t);
  }
  interval(e, t) {
    return new nr(this.source, e, t || this.pos);
  }
}
class s0 {
  constructor(e, t, r, i, o, a, l) {
    this.matcher = e, this.input = t, this.startExpr = r, this._cst = i, this._cstOffset = o, this._rightmostFailurePosition = a, this._rightmostFailures = l, this.failed() && (tf(this, "message", function() {
      const c = "Expected " + this.getExpectedText();
      return i0(this.input, this.getRightmostFailurePosition()) + c;
    }), tf(this, "shortMessage", function() {
      const c = "expected " + this.getExpectedText(), b = Qf(
        this.input,
        this.getRightmostFailurePosition()
      );
      return "Line " + b.lineNum + ", col " + b.colNum + ": " + c;
    }));
  }
  succeeded() {
    return !!this._cst;
  }
  failed() {
    return !this.succeeded();
  }
  getRightmostFailurePosition() {
    return this._rightmostFailurePosition;
  }
  getRightmostFailures() {
    if (!this._rightmostFailures) {
      this.matcher.setInput(this.input);
      const e = this.matcher._match(this.startExpr, {
        tracing: !1,
        positionToRecordFailures: this.getRightmostFailurePosition()
      });
      this._rightmostFailures = e.getRightmostFailures();
    }
    return this._rightmostFailures;
  }
  toString() {
    return this.succeeded() ? "[match succeeded]" : "[match failed at position " + this.getRightmostFailurePosition() + "]";
  }
  // Return a string summarizing the expected contents of the input stream when
  // the match failure occurred.
  getExpectedText() {
    if (this.succeeded())
      throw new Error("cannot get expected text of a successful MatchResult");
    const e = new ms();
    let t = this.getRightmostFailures();
    t = t.filter((r) => !r.isFluffy());
    for (let r = 0; r < t.length; r++)
      r > 0 && (r === t.length - 1 ? e.append(t.length > 2 ? ", or " : " or ") : e.append(", ")), e.append(t[r].toString());
    return e.contents();
  }
  getInterval() {
    const e = this.getRightmostFailurePosition();
    return new nr(this.input, e, e);
  }
}
class $1 {
  constructor() {
    this.applicationMemoKeyStack = [], this.memo = {}, this.maxExaminedLength = 0, this.maxRightmostFailureOffset = -1, this.currentLeftRecursion = void 0;
  }
  isActive(e) {
    return this.applicationMemoKeyStack.indexOf(e.toMemoKey()) >= 0;
  }
  enter(e) {
    this.applicationMemoKeyStack.push(e.toMemoKey());
  }
  exit() {
    this.applicationMemoKeyStack.pop();
  }
  startLeftRecursion(e, t) {
    t.isLeftRecursion = !0, t.headApplication = e, t.nextLeftRecursion = this.currentLeftRecursion, this.currentLeftRecursion = t;
    const { applicationMemoKeyStack: r } = this, i = r.indexOf(e.toMemoKey()) + 1, o = r.slice(
      i
    );
    t.isInvolved = function(a) {
      return o.indexOf(a) >= 0;
    }, t.updateInvolvedApplicationMemoKeys = function() {
      for (let a = i; a < r.length; a++) {
        const l = r[a];
        this.isInvolved(l) || o.push(l);
      }
    };
  }
  endLeftRecursion() {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
  }
  // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
  // the memoized result (which starts out being a failure) is always used.
  shouldUseMemoizedResult(e) {
    if (!e.isLeftRecursion)
      return !0;
    const { applicationMemoKeyStack: t } = this;
    for (let r = 0; r < t.length; r++) {
      const i = t[r];
      if (e.isInvolved(i))
        return !1;
    }
    return !0;
  }
  memoize(e, t) {
    return this.memo[e] = t, this.maxExaminedLength = Math.max(this.maxExaminedLength, t.examinedLength), this.maxRightmostFailureOffset = Math.max(
      this.maxRightmostFailureOffset,
      t.rightmostFailureOffset
    ), t;
  }
  clearObsoleteEntries(e, t) {
    if (e + this.maxExaminedLength <= t)
      return;
    const { memo: r } = this;
    this.maxExaminedLength = 0, this.maxRightmostFailureOffset = -1, Object.keys(r).forEach((i) => {
      const o = r[i];
      e + o.examinedLength > t ? delete r[i] : (this.maxExaminedLength = Math.max(this.maxExaminedLength, o.examinedLength), this.maxRightmostFailureOffset = Math.max(
        this.maxRightmostFailureOffset,
        o.rightmostFailureOffset
      ));
    });
  }
}
const j1 = "✗", K1 = "✓", z1 = "⋅", G1 = "⇒", H1 = "␉", W1 = "␊", Y1 = "␍", of = {
  succeeded: 1,
  isRootNode: 2,
  isImplicitSpaces: 4,
  isMemoized: 8,
  isHeadOfLeftRecursion: 16,
  terminatesLR: 32
};
function V1(n) {
  return ou(" ", n).join("");
}
function J1(n, e, t) {
  const r = o0(n.slice(e, e + t));
  return r.length < t ? r + ou(" ", t - r.length).join("") : r;
}
function o0(n) {
  return typeof n == "string" ? n.replace(/ /g, z1).replace(/\t/g, H1).replace(/\n/g, W1).replace(/\r/g, Y1) : String(n);
}
class Ii {
  constructor(e, t, r, i, o, a, l) {
    this.input = e, this.pos = this.pos1 = t, this.pos2 = r, this.source = new nr(e, t, r), this.expr = i, this.bindings = a, this.children = l || [], this.terminatingLREntry = null, this._flags = o ? of.succeeded : 0;
  }
  get displayString() {
    return this.expr.toDisplayString();
  }
  clone() {
    return this.cloneWithExpr(this.expr);
  }
  cloneWithExpr(e) {
    const t = new Ii(
      this.input,
      this.pos,
      this.pos2,
      e,
      this.succeeded,
      this.bindings,
      this.children
    );
    return t.isHeadOfLeftRecursion = this.isHeadOfLeftRecursion, t.isImplicitSpaces = this.isImplicitSpaces, t.isMemoized = this.isMemoized, t.isRootNode = this.isRootNode, t.terminatesLR = this.terminatesLR, t.terminatingLREntry = this.terminatingLREntry, t;
  }
  // Record the trace information for the terminating condition of the LR loop.
  recordLRTermination(e, t) {
    this.terminatingLREntry = new Ii(
      this.input,
      this.pos,
      this.pos2,
      this.expr,
      !1,
      [t],
      [e]
    ), this.terminatingLREntry.terminatesLR = !0;
  }
  // Recursively traverse this trace node and all its descendents, calling a visitor function
  // for each node that is visited. If `vistorObjOrFn` is an object, then its 'enter' property
  // is a function to call before visiting the children of a node, and its 'exit' property is
  // a function to call afterwards. If `visitorObjOrFn` is a function, it represents the 'enter'
  // function.
  //
  // The functions are called with three arguments: the Trace node, its parent Trace, and a number
  // representing the depth of the node in the tree. (The root node has depth 0.) `optThisArg`, if
  // specified, is the value to use for `this` when executing the visitor functions.
  walk(e, t) {
    let r = e;
    typeof r == "function" && (r = { enter: r });
    function i(o, a, l) {
      let c = !0;
      r.enter && r.enter.call(t, o, a, l) === Ii.prototype.SKIP && (c = !1), c && (o.children.forEach((b) => {
        i(b, o, l + 1);
      }), r.exit && r.exit.call(t, o, a, l));
    }
    this.isRootNode ? this.children.forEach((o) => {
      i(o, null, 0);
    }) : i(this, null, 0);
  }
  // Return a string representation of the trace.
  // Sample:
  //     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
  //     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
  //     12⋅+⋅2⋅*⋅3       ✗ addExp_plus
  toString() {
    const e = new ms();
    return this.walk((t, r, i) => {
      if (!t)
        return this.SKIP;
      if (t.expr.constructor.name !== "Alt") {
        if (e.append(J1(t.input, t.pos, 10) + V1(i * 2 + 1)), e.append((t.succeeded ? K1 : j1) + " " + t.displayString), t.isHeadOfLeftRecursion && e.append(" (LR)"), t.succeeded) {
          const a = o0(t.source.contents);
          e.append(" " + G1 + "  "), e.append(typeof a == "string" ? '"' + a + '"' : a);
        }
        e.append(`
`);
      }
    }), e.contents();
  }
}
Ii.prototype.SKIP = {};
Object.keys(of).forEach((n) => {
  const e = of[n];
  Object.defineProperty(Ii.prototype, n, {
    get() {
      return (this._flags & e) !== 0;
    },
    set(t) {
      t ? this._flags |= e : this._flags &= ~e;
    }
  });
});
Ge.prototype.allowsSkippingPrecedingSpace = br("allowsSkippingPrecedingSpace");
sr.allowsSkippingPrecedingSpace = or.allowsSkippingPrecedingSpace = mt.prototype.allowsSkippingPrecedingSpace = Vt.prototype.allowsSkippingPrecedingSpace = ar.prototype.allowsSkippingPrecedingSpace = Yt.prototype.allowsSkippingPrecedingSpace = function() {
  return !0;
};
Mt.prototype.allowsSkippingPrecedingSpace = _r.prototype.allowsSkippingPrecedingSpace = kr.prototype.allowsSkippingPrecedingSpace = xr.prototype.allowsSkippingPrecedingSpace = wr.prototype.allowsSkippingPrecedingSpace = ur.prototype.allowsSkippingPrecedingSpace = Gt.prototype.allowsSkippingPrecedingSpace = function() {
  return !1;
};
let To;
n0((n) => {
  To = n;
});
let Ka;
Ge.prototype.assertAllApplicationsAreValid = function(n, e) {
  Ka = 0, this._assertAllApplicationsAreValid(n, e);
};
Ge.prototype._assertAllApplicationsAreValid = br(
  "_assertAllApplicationsAreValid"
);
sr._assertAllApplicationsAreValid = or._assertAllApplicationsAreValid = Vt.prototype._assertAllApplicationsAreValid = ar.prototype._assertAllApplicationsAreValid = ur.prototype._assertAllApplicationsAreValid = Yt.prototype._assertAllApplicationsAreValid = function(n, e) {
};
kr.prototype._assertAllApplicationsAreValid = function(n, e) {
  Ka++, this.expr._assertAllApplicationsAreValid(n, e), Ka--;
};
Mt.prototype._assertAllApplicationsAreValid = function(n, e) {
  for (let t = 0; t < this.terms.length; t++)
    this.terms[t]._assertAllApplicationsAreValid(n, e);
};
Gt.prototype._assertAllApplicationsAreValid = function(n, e) {
  for (let t = 0; t < this.factors.length; t++)
    this.factors[t]._assertAllApplicationsAreValid(n, e);
};
_r.prototype._assertAllApplicationsAreValid = wr.prototype._assertAllApplicationsAreValid = xr.prototype._assertAllApplicationsAreValid = function(n, e) {
  this.expr._assertAllApplicationsAreValid(n, e);
};
mt.prototype._assertAllApplicationsAreValid = function(n, e, t = !1) {
  const r = e.rules[this.ruleName], i = ps(n) && Ka === 0;
  if (!r)
    throw Xg(this.ruleName, e.name, this.source);
  if (!t && ps(this.ruleName) && !i)
    throw R1(this.ruleName, this);
  const o = this.args.length, a = r.formals.length;
  if (o !== a)
    throw A1(this.ruleName, a, o, this.source);
  const l = To && r === To.rules.applySyntactic;
  if (To && r === To.rules.caseInsensitive && !(this.args[0] instanceof Vt))
    throw Qd('a Terminal (e.g. "abc")', this.args[0]);
  if (l) {
    const b = this.args[0];
    if (!(b instanceof mt))
      throw Qd("a syntactic rule application", b);
    if (!ps(b.ruleName))
      throw T1(b);
    if (i)
      throw C1(this);
  }
  this.args.forEach((b) => {
    if (b._assertAllApplicationsAreValid(n, e, l), b.getArity() !== 1)
      throw k1(this.ruleName, b);
  });
};
Ge.prototype.assertChoicesHaveUniformArity = br(
  "assertChoicesHaveUniformArity"
);
sr.assertChoicesHaveUniformArity = or.assertChoicesHaveUniformArity = Vt.prototype.assertChoicesHaveUniformArity = ar.prototype.assertChoicesHaveUniformArity = ur.prototype.assertChoicesHaveUniformArity = kr.prototype.assertChoicesHaveUniformArity = Yt.prototype.assertChoicesHaveUniformArity = function(n) {
};
Mt.prototype.assertChoicesHaveUniformArity = function(n) {
  if (this.terms.length === 0)
    return;
  const e = this.terms[0].getArity();
  for (let t = 0; t < this.terms.length; t++) {
    const r = this.terms[t];
    r.assertChoicesHaveUniformArity();
    const i = r.getArity();
    if (e !== i)
      throw r0(n, e, i, r);
  }
};
au.prototype.assertChoicesHaveUniformArity = function(n) {
  const e = this.terms[0].getArity(), t = this.terms[1].getArity();
  if (e !== t)
    throw r0(n, t, e, this.terms[0]);
};
Gt.prototype.assertChoicesHaveUniformArity = function(n) {
  for (let e = 0; e < this.factors.length; e++)
    this.factors[e].assertChoicesHaveUniformArity(n);
};
_r.prototype.assertChoicesHaveUniformArity = function(n) {
  this.expr.assertChoicesHaveUniformArity(n);
};
wr.prototype.assertChoicesHaveUniformArity = function(n) {
};
xr.prototype.assertChoicesHaveUniformArity = function(n) {
  this.expr.assertChoicesHaveUniformArity(n);
};
mt.prototype.assertChoicesHaveUniformArity = function(n) {
};
Ge.prototype.assertIteratedExprsAreNotNullable = br(
  "assertIteratedExprsAreNotNullable"
);
sr.assertIteratedExprsAreNotNullable = or.assertIteratedExprsAreNotNullable = Vt.prototype.assertIteratedExprsAreNotNullable = ar.prototype.assertIteratedExprsAreNotNullable = ur.prototype.assertIteratedExprsAreNotNullable = Yt.prototype.assertIteratedExprsAreNotNullable = function(n) {
};
Mt.prototype.assertIteratedExprsAreNotNullable = function(n) {
  for (let e = 0; e < this.terms.length; e++)
    this.terms[e].assertIteratedExprsAreNotNullable(n);
};
Gt.prototype.assertIteratedExprsAreNotNullable = function(n) {
  for (let e = 0; e < this.factors.length; e++)
    this.factors[e].assertIteratedExprsAreNotNullable(n);
};
_r.prototype.assertIteratedExprsAreNotNullable = function(n) {
  if (this.expr.assertIteratedExprsAreNotNullable(n), this.expr.isNullable(n))
    throw t0(this, []);
};
Bn.prototype.assertIteratedExprsAreNotNullable = wr.prototype.assertIteratedExprsAreNotNullable = xr.prototype.assertIteratedExprsAreNotNullable = kr.prototype.assertIteratedExprsAreNotNullable = function(n) {
  this.expr.assertIteratedExprsAreNotNullable(n);
};
mt.prototype.assertIteratedExprsAreNotNullable = function(n) {
  this.args.forEach((e) => {
    e.assertIteratedExprsAreNotNullable(n);
  });
};
class Xf {
  constructor(e) {
    this.matchLength = e;
  }
  get ctorName() {
    throw new Error("subclass responsibility");
  }
  numChildren() {
    return this.children ? this.children.length : 0;
  }
  childAt(e) {
    if (this.children)
      return this.children[e];
  }
  indexOfChild(e) {
    return this.children.indexOf(e);
  }
  hasChildren() {
    return this.numChildren() > 0;
  }
  hasNoChildren() {
    return !this.hasChildren();
  }
  onlyChild() {
    if (this.numChildren() !== 1)
      throw new Error(
        "cannot get only child of a node of type " + this.ctorName + " (it has " + this.numChildren() + " children)"
      );
    return this.firstChild();
  }
  firstChild() {
    if (this.hasNoChildren())
      throw new Error(
        "cannot get first child of a " + this.ctorName + " node, which has no children"
      );
    return this.childAt(0);
  }
  lastChild() {
    if (this.hasNoChildren())
      throw new Error(
        "cannot get last child of a " + this.ctorName + " node, which has no children"
      );
    return this.childAt(this.numChildren() - 1);
  }
  childBefore(e) {
    const t = this.indexOfChild(e);
    if (t < 0)
      throw new Error("Node.childBefore() called w/ an argument that is not a child");
    if (t === 0)
      throw new Error("cannot get child before first child");
    return this.childAt(t - 1);
  }
  childAfter(e) {
    const t = this.indexOfChild(e);
    if (t < 0)
      throw new Error("Node.childAfter() called w/ an argument that is not a child");
    if (t === this.numChildren() - 1)
      throw new Error("cannot get child after last child");
    return this.childAt(t + 1);
  }
  isTerminal() {
    return !1;
  }
  isNonterminal() {
    return !1;
  }
  isIteration() {
    return !1;
  }
  isOptional() {
    return !1;
  }
}
class bs extends Xf {
  get ctorName() {
    return "_terminal";
  }
  isTerminal() {
    return !0;
  }
  get primitiveValue() {
    throw new Error("The `primitiveValue` property was removed in Ohm v17.");
  }
}
class Z1 extends Xf {
  constructor(e, t, r, i) {
    super(i), this.ruleName = e, this.children = t, this.childOffsets = r;
  }
  get ctorName() {
    return this.ruleName;
  }
  isNonterminal() {
    return !0;
  }
  isLexical() {
    return Yg(this.ctorName);
  }
  isSyntactic() {
    return ps(this.ctorName);
  }
}
class a0 extends Xf {
  constructor(e, t, r, i) {
    super(r), this.children = e, this.childOffsets = t, this.optional = i;
  }
  get ctorName() {
    return "_iter";
  }
  isIteration() {
    return !0;
  }
  isOptional() {
    return this.optional;
  }
}
Ge.prototype.eval = br("eval");
sr.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = e.nextCodePoint();
  return r !== void 0 ? (n.pushBinding(new bs(String.fromCodePoint(r).length), t), !0) : (n.processFailure(t, this), !1);
};
or.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return e.atEnd() ? (n.pushBinding(new bs(0), t), !0) : (n.processFailure(t, this), !1);
};
Vt.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return e.matchString(this.obj) ? (n.pushBinding(new bs(this.obj.length), t), !0) : (n.processFailure(t, this), !1);
};
ar.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = this.matchCodePoint ? e.nextCodePoint() : e.nextCharCode();
  return r !== void 0 && this.from.codePointAt(0) <= r && r <= this.to.codePointAt(0) ? (n.pushBinding(new bs(String.fromCodePoint(r).length), t), !0) : (n.processFailure(t, this), !1);
};
ur.prototype.eval = function(n) {
  return n.eval(n.currentApplication().args[this.index]);
};
kr.prototype.eval = function(n) {
  n.enterLexifiedContext();
  const e = n.eval(this.expr);
  return n.exitLexifiedContext(), e;
};
Mt.prototype.eval = function(n) {
  for (let e = 0; e < this.terms.length; e++)
    if (n.eval(this.terms[e]))
      return !0;
  return !1;
};
Gt.prototype.eval = function(n) {
  for (let e = 0; e < this.factors.length; e++) {
    const t = this.factors[e];
    if (!n.eval(t))
      return !1;
  }
  return !0;
};
_r.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = this.getArity(), i = [], o = [];
  for (; i.length < r; )
    i.push([]), o.push([]);
  let a = 0, l = t, c;
  for (; a < this.maxNumMatches && n.eval(this.expr); ) {
    if (e.pos === l)
      throw t0(this, n._applicationStack);
    l = e.pos, a++;
    const x = n._bindings.splice(n._bindings.length - r, r), k = n._bindingOffsets.splice(
      n._bindingOffsets.length - r,
      r
    );
    for (c = 0; c < x.length; c++)
      i[c].push(x[c]), o[c].push(k[c]);
  }
  if (a < this.minNumMatches)
    return !1;
  let b = n.posToOffset(t), m = 0;
  if (a > 0) {
    const x = i[r - 1], k = o[r - 1], D = k[k.length - 1] + x[x.length - 1].matchLength;
    b = o[0][0], m = D - b;
  }
  const w = this instanceof Bn;
  for (c = 0; c < i.length; c++)
    n._bindings.push(
      new a0(i[c], o[c], m, w)
    ), n._bindingOffsets.push(b);
  return !0;
};
wr.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  n.pushFailuresInfo();
  const r = n.eval(this.expr);
  return n.popFailuresInfo(), r ? (n.processFailure(t, this), !1) : (e.pos = t, !0);
};
xr.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return n.eval(this.expr) ? (e.pos = t, !0) : !1;
};
mt.prototype.eval = function(n) {
  const e = n.currentApplication(), t = e ? e.args : [], r = this.substituteParams(t), i = n.getCurrentPosInfo();
  if (i.isActive(r))
    return r.handleCycle(n);
  const o = r.toMemoKey(), a = i.memo[o];
  if (a && i.shouldUseMemoizedResult(a)) {
    if (n.hasNecessaryInfo(a))
      return n.useMemoizedResult(n.inputStream.pos, a);
    delete i.memo[o];
  }
  return r.reallyEval(n);
};
mt.prototype.handleCycle = function(n) {
  const e = n.getCurrentPosInfo(), { currentLeftRecursion: t } = e, r = this.toMemoKey();
  let i = e.memo[r];
  return t && t.headApplication.toMemoKey() === r ? i.updateInvolvedApplicationMemoKeys() : i || (i = e.memoize(r, {
    matchLength: 0,
    examinedLength: 0,
    value: !1,
    rightmostFailureOffset: -1
  }), e.startLeftRecursion(this, i)), n.useMemoizedResult(n.inputStream.pos, i);
};
mt.prototype.reallyEval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = n.getCurrentPosInfo(), i = n.grammar.rules[this.ruleName], { body: o } = i, { description: a } = i;
  n.enterApplication(r, this), a && n.pushFailuresInfo();
  const l = e.examinedLength;
  e.examinedLength = 0;
  let c = this.evalOnce(o, n);
  const b = r.currentLeftRecursion, m = this.toMemoKey(), w = b && b.headApplication.toMemoKey() === m;
  let x;
  n.doNotMemoize ? n.doNotMemoize = !1 : w ? (c = this.growSeedResult(o, n, t, b, c), r.endLeftRecursion(), x = b, x.examinedLength = e.examinedLength - t, x.rightmostFailureOffset = n._getRightmostFailureOffset(), r.memoize(m, x)) : (!b || !b.isInvolved(m)) && (x = r.memoize(m, {
    matchLength: e.pos - t,
    examinedLength: e.examinedLength - t,
    value: c,
    failuresAtRightmostPosition: n.cloneRecordedFailures(),
    rightmostFailureOffset: n._getRightmostFailureOffset()
  }));
  const k = !!c;
  if (a && (n.popFailuresInfo(), k || n.processFailure(t, this), x && (x.failuresAtRightmostPosition = n.cloneRecordedFailures())), n.isTracing() && x) {
    const D = n.getTraceEntry(t, this, k, k ? [c] : []);
    w && (Ei(D.terminatingLREntry != null || !k), D.isHeadOfLeftRecursion = !0), x.traceEntry = D;
  }
  return e.examinedLength = Math.max(
    e.examinedLength,
    l
  ), n.exitApplication(r, c), k;
};
mt.prototype.evalOnce = function(n, e) {
  const { inputStream: t } = e, r = t.pos;
  if (e.eval(n)) {
    const i = n.getArity(), o = e._bindings.splice(e._bindings.length - i, i), a = e._bindingOffsets.splice(e._bindingOffsets.length - i, i), l = t.pos - r;
    return new Z1(this.ruleName, o, a, l);
  } else
    return !1;
};
mt.prototype.growSeedResult = function(n, e, t, r, i) {
  if (!i)
    return !1;
  const { inputStream: o } = e;
  for (; ; ) {
    if (r.matchLength = o.pos - t, r.value = i, r.failuresAtRightmostPosition = e.cloneRecordedFailures(), e.isTracing()) {
      const a = e.trace[e.trace.length - 1];
      r.traceEntry = new Ii(
        e.input,
        t,
        o.pos,
        this,
        !0,
        [i],
        [a.clone()]
      );
    }
    if (o.pos = t, i = this.evalOnce(n, e), o.pos - t <= r.matchLength)
      break;
    e.isTracing() && e.trace.splice(-2, 1);
  }
  return e.isTracing() && r.traceEntry.recordLRTermination(e.trace.pop(), i), o.pos = t + r.matchLength, r.value;
};
Yt.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = e.next();
  return r && this.pattern.test(r) ? (n.pushBinding(new bs(r.length), t), !0) : (n.processFailure(t, this), !1);
};
Ge.prototype.getArity = br("getArity");
sr.getArity = or.getArity = Vt.prototype.getArity = ar.prototype.getArity = ur.prototype.getArity = mt.prototype.getArity = Yt.prototype.getArity = function() {
  return 1;
};
Mt.prototype.getArity = function() {
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};
Gt.prototype.getArity = function() {
  let n = 0;
  for (let e = 0; e < this.factors.length; e++)
    n += this.factors[e].getArity();
  return n;
};
_r.prototype.getArity = function() {
  return this.expr.getArity();
};
wr.prototype.getArity = function() {
  return 0;
};
xr.prototype.getArity = kr.prototype.getArity = function() {
  return this.expr.getArity();
};
function tn(n, e) {
  const t = {};
  if (n.source && e) {
    const r = n.source.relativeTo(e);
    t.sourceInterval = [r.startIdx, r.endIdx];
  }
  return t;
}
Ge.prototype.outputRecipe = br("outputRecipe");
sr.outputRecipe = function(n, e) {
  return ["any", tn(this, e)];
};
or.outputRecipe = function(n, e) {
  return ["end", tn(this, e)];
};
Vt.prototype.outputRecipe = function(n, e) {
  return ["terminal", tn(this, e), this.obj];
};
ar.prototype.outputRecipe = function(n, e) {
  return ["range", tn(this, e), this.from, this.to];
};
ur.prototype.outputRecipe = function(n, e) {
  return ["param", tn(this, e), this.index];
};
Mt.prototype.outputRecipe = function(n, e) {
  return ["alt", tn(this, e)].concat(
    this.terms.map((t) => t.outputRecipe(n, e))
  );
};
au.prototype.outputRecipe = function(n, e) {
  return this.terms[0].outputRecipe(n, e);
};
uu.prototype.outputRecipe = function(n, e) {
  const t = this.terms.slice(0, this.expansionPos), r = this.terms.slice(this.expansionPos + 1);
  return [
    "splice",
    tn(this, e),
    t.map((i) => i.outputRecipe(n, e)),
    r.map((i) => i.outputRecipe(n, e))
  ];
};
Gt.prototype.outputRecipe = function(n, e) {
  return ["seq", tn(this, e)].concat(
    this.factors.map((t) => t.outputRecipe(n, e))
  );
};
Is.prototype.outputRecipe = go.prototype.outputRecipe = Bn.prototype.outputRecipe = wr.prototype.outputRecipe = xr.prototype.outputRecipe = kr.prototype.outputRecipe = function(n, e) {
  return [
    this.constructor.name.toLowerCase(),
    tn(this, e),
    this.expr.outputRecipe(n, e)
  ];
};
mt.prototype.outputRecipe = function(n, e) {
  return [
    "app",
    tn(this, e),
    this.ruleName,
    this.args.map((t) => t.outputRecipe(n, e))
  ];
};
Yt.prototype.outputRecipe = function(n, e) {
  return ["unicodeChar", tn(this, e), this.category];
};
Ge.prototype.introduceParams = br("introduceParams");
sr.introduceParams = or.introduceParams = Vt.prototype.introduceParams = ar.prototype.introduceParams = ur.prototype.introduceParams = Yt.prototype.introduceParams = function(n) {
  return this;
};
Mt.prototype.introduceParams = function(n) {
  return this.terms.forEach((e, t, r) => {
    r[t] = e.introduceParams(n);
  }), this;
};
Gt.prototype.introduceParams = function(n) {
  return this.factors.forEach((e, t, r) => {
    r[t] = e.introduceParams(n);
  }), this;
};
_r.prototype.introduceParams = wr.prototype.introduceParams = xr.prototype.introduceParams = kr.prototype.introduceParams = function(n) {
  return this.expr = this.expr.introduceParams(n), this;
};
mt.prototype.introduceParams = function(n) {
  const e = n.indexOf(this.ruleName);
  if (e >= 0) {
    if (this.args.length > 0)
      throw new Error("Parameterized rules cannot be passed as arguments to another rule.");
    return new ur(e).withSource(this.source);
  } else
    return this.args.forEach((t, r, i) => {
      i[r] = t.introduceParams(n);
    }), this;
};
Ge.prototype.isNullable = function(n) {
  return this._isNullable(n, /* @__PURE__ */ Object.create(null));
};
Ge.prototype._isNullable = br("_isNullable");
sr._isNullable = ar.prototype._isNullable = ur.prototype._isNullable = go.prototype._isNullable = Yt.prototype._isNullable = function(n, e) {
  return !1;
};
or._isNullable = function(n, e) {
  return !0;
};
Vt.prototype._isNullable = function(n, e) {
  return typeof this.obj == "string" ? this.obj === "" : !1;
};
Mt.prototype._isNullable = function(n, e) {
  return this.terms.length === 0 || this.terms.some((t) => t._isNullable(n, e));
};
Gt.prototype._isNullable = function(n, e) {
  return this.factors.every((t) => t._isNullable(n, e));
};
Is.prototype._isNullable = Bn.prototype._isNullable = wr.prototype._isNullable = xr.prototype._isNullable = function(n, e) {
  return !0;
};
kr.prototype._isNullable = function(n, e) {
  return this.expr._isNullable(n, e);
};
mt.prototype._isNullable = function(n, e) {
  const t = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(e, t)) {
    const { body: r } = n.rules[this.ruleName], i = r.substituteParams(this.args);
    e[t] = !1, e[t] = i._isNullable(n, e);
  }
  return e[t];
};
Ge.prototype.substituteParams = br("substituteParams");
sr.substituteParams = or.substituteParams = Vt.prototype.substituteParams = ar.prototype.substituteParams = Yt.prototype.substituteParams = function(n) {
  return this;
};
ur.prototype.substituteParams = function(n) {
  return Qg(n[this.index]);
};
Mt.prototype.substituteParams = function(n) {
  return new Mt(this.terms.map((e) => e.substituteParams(n)));
};
Gt.prototype.substituteParams = function(n) {
  return new Gt(this.factors.map((e) => e.substituteParams(n)));
};
_r.prototype.substituteParams = wr.prototype.substituteParams = xr.prototype.substituteParams = kr.prototype.substituteParams = function(n) {
  return new this.constructor(this.expr.substituteParams(n));
};
mt.prototype.substituteParams = function(n) {
  if (this.args.length === 0)
    return this;
  {
    const e = this.args.map((t) => t.substituteParams(n));
    return new mt(this.ruleName, e);
  }
};
function tv(n) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(n);
}
function eh(n) {
  const e = /* @__PURE__ */ Object.create(null);
  n.forEach((t) => {
    e[t] = (e[t] || 0) + 1;
  }), Object.keys(e).forEach((t) => {
    if (e[t] <= 1)
      return;
    let r = 1;
    n.forEach((i, o) => {
      i === t && (n[o] = i + "_" + r++);
    });
  });
}
Ge.prototype.toArgumentNameList = br("toArgumentNameList");
sr.toArgumentNameList = function(n, e) {
  return ["any"];
};
or.toArgumentNameList = function(n, e) {
  return ["end"];
};
Vt.prototype.toArgumentNameList = function(n, e) {
  return typeof this.obj == "string" && /^[_a-zA-Z0-9]+$/.test(this.obj) ? ["_" + this.obj] : ["$" + n];
};
ar.prototype.toArgumentNameList = function(n, e) {
  let t = this.from + "_to_" + this.to;
  return tv(t) || (t = "_" + t), tv(t) || (t = "$" + n), [t];
};
Mt.prototype.toArgumentNameList = function(n, e) {
  const t = this.terms.map(
    (o) => o.toArgumentNameList(n, !0)
  ), r = [], i = t[0].length;
  for (let o = 0; o < i; o++) {
    const a = [];
    for (let c = 0; c < this.terms.length; c++)
      a.push(t[c][o]);
    const l = Wg(a);
    r.push(l.join("_or_"));
  }
  return e || eh(r), r;
};
Gt.prototype.toArgumentNameList = function(n, e) {
  let t = [];
  return this.factors.forEach((r) => {
    const i = r.toArgumentNameList(n, !0);
    t = t.concat(i), n += i.length;
  }), e || eh(t), t;
};
_r.prototype.toArgumentNameList = function(n, e) {
  const t = this.expr.toArgumentNameList(n, e).map(
    (r) => r[r.length - 1] === "s" ? r + "es" : r + "s"
  );
  return e || eh(t), t;
};
Bn.prototype.toArgumentNameList = function(n, e) {
  return this.expr.toArgumentNameList(n, e).map((t) => "opt" + t[0].toUpperCase() + t.slice(1));
};
wr.prototype.toArgumentNameList = function(n, e) {
  return [];
};
xr.prototype.toArgumentNameList = kr.prototype.toArgumentNameList = function(n, e) {
  return this.expr.toArgumentNameList(n, e);
};
mt.prototype.toArgumentNameList = function(n, e) {
  return [this.ruleName];
};
Yt.prototype.toArgumentNameList = function(n, e) {
  return ["$" + n];
};
ur.prototype.toArgumentNameList = function(n, e) {
  return ["param" + this.index];
};
Ge.prototype.toDisplayString = br("toDisplayString");
Mt.prototype.toDisplayString = Gt.prototype.toDisplayString = function() {
  return this.source ? this.source.trimmed().contents : "[" + this.constructor.name + "]";
};
sr.toDisplayString = or.toDisplayString = _r.prototype.toDisplayString = wr.prototype.toDisplayString = xr.prototype.toDisplayString = kr.prototype.toDisplayString = Vt.prototype.toDisplayString = ar.prototype.toDisplayString = ur.prototype.toDisplayString = function() {
  return this.toString();
};
mt.prototype.toDisplayString = function() {
  if (this.args.length > 0) {
    const n = this.args.map((e) => e.toDisplayString());
    return this.ruleName + "<" + n.join(",") + ">";
  } else
    return this.ruleName;
};
Yt.prototype.toDisplayString = function() {
  return "Unicode [" + this.category + "] character";
};
function Q1(n) {
  return n === "description" || n === "string" || n === "code";
}
class Or {
  constructor(e, t, r) {
    if (!Q1(r))
      throw new Error("invalid Failure type: " + r);
    this.pexpr = e, this.text = t, this.type = r, this.fluffy = !1;
  }
  getPExpr() {
    return this.pexpr;
  }
  getText() {
    return this.text;
  }
  getType() {
    return this.type;
  }
  isDescription() {
    return this.type === "description";
  }
  isStringTerminal() {
    return this.type === "string";
  }
  isCode() {
    return this.type === "code";
  }
  isFluffy() {
    return this.fluffy;
  }
  makeFluffy() {
    this.fluffy = !0;
  }
  clearFluffy() {
    this.fluffy = !1;
  }
  subsumes(e) {
    return this.getText() === e.getText() && this.type === e.type && (!this.isFluffy() || this.isFluffy() && e.isFluffy());
  }
  toString() {
    return this.type === "string" ? JSON.stringify(this.getText()) : this.getText();
  }
  clone() {
    const e = new Or(this.pexpr, this.text, this.type);
    return this.isFluffy() && e.makeFluffy(), e;
  }
  toKey() {
    return this.toString() + "#" + this.type;
  }
}
Ge.prototype.toFailure = br("toFailure");
sr.toFailure = function(n) {
  return new Or(this, "any object", "description");
};
or.toFailure = function(n) {
  return new Or(this, "end of input", "description");
};
Vt.prototype.toFailure = function(n) {
  return new Or(this, this.obj, "string");
};
ar.prototype.toFailure = function(n) {
  return new Or(this, JSON.stringify(this.from) + ".." + JSON.stringify(this.to), "code");
};
wr.prototype.toFailure = function(n) {
  const e = this.expr === sr ? "nothing" : "not " + this.expr.toFailure(n);
  return new Or(this, e, "description");
};
xr.prototype.toFailure = function(n) {
  return this.expr.toFailure(n);
};
mt.prototype.toFailure = function(n) {
  let { description: e } = n.rules[this.ruleName];
  return e || (e = (/^[aeiouAEIOU]/.test(this.ruleName) ? "an" : "a") + " " + this.ruleName), new Or(this, e, "description");
};
Yt.prototype.toFailure = function(n) {
  return new Or(this, "a Unicode [" + this.category + "] character", "description");
};
Mt.prototype.toFailure = function(n) {
  const t = "(" + this.terms.map((r) => r.toFailure(n)).join(" or ") + ")";
  return new Or(this, t, "description");
};
Gt.prototype.toFailure = function(n) {
  const t = "(" + this.factors.map((r) => r.toFailure(n)).join(" ") + ")";
  return new Or(this, t, "description");
};
_r.prototype.toFailure = function(n) {
  const e = "(" + this.expr.toFailure(n) + this.operator + ")";
  return new Or(this, e, "description");
};
Ge.prototype.toString = br("toString");
sr.toString = function() {
  return "any";
};
or.toString = function() {
  return "end";
};
Vt.prototype.toString = function() {
  return JSON.stringify(this.obj);
};
ar.prototype.toString = function() {
  return JSON.stringify(this.from) + ".." + JSON.stringify(this.to);
};
ur.prototype.toString = function() {
  return "$" + this.index;
};
kr.prototype.toString = function() {
  return "#(" + this.expr.toString() + ")";
};
Mt.prototype.toString = function() {
  return this.terms.length === 1 ? this.terms[0].toString() : "(" + this.terms.map((n) => n.toString()).join(" | ") + ")";
};
Gt.prototype.toString = function() {
  return this.factors.length === 1 ? this.factors[0].toString() : "(" + this.factors.map((n) => n.toString()).join(" ") + ")";
};
_r.prototype.toString = function() {
  return this.expr + this.operator;
};
wr.prototype.toString = function() {
  return "~" + this.expr;
};
xr.prototype.toString = function() {
  return "&" + this.expr;
};
mt.prototype.toString = function() {
  if (this.args.length > 0) {
    const n = this.args.map((e) => e.toString());
    return this.ruleName + "<" + n.join(",") + ">";
  } else
    return this.ruleName;
};
Yt.prototype.toString = function() {
  return "\\p{" + this.category + "}";
};
class th extends Ge {
  constructor(e) {
    super(), this.obj = e;
  }
  _getString(e) {
    const t = e.currentApplication().args[this.obj.index];
    return Ei(t instanceof Vt, "expected a Terminal expression"), t.obj;
  }
  // Implementation of the PExpr API
  allowsSkippingPrecedingSpace() {
    return !0;
  }
  eval(e) {
    const { inputStream: t } = e, r = t.pos, i = this._getString(e);
    return t.matchString(i, !0) ? (e.pushBinding(new bs(i.length), r), !0) : (e.processFailure(r, this), !1);
  }
  getArity() {
    return 1;
  }
  substituteParams(e) {
    return new th(this.obj.substituteParams(e));
  }
  toDisplayString() {
    return this.obj.toDisplayString() + " (case-insensitive)";
  }
  toFailure(e) {
    return new Or(
      this,
      this.obj.toFailure(e) + " (case-insensitive)",
      "description"
    );
  }
  _isNullable(e, t) {
    return this.obj._isNullable(e, t);
  }
}
let u0;
n0((n) => {
  u0 = n.rules.applySyntactic.body;
});
const Oc = new mt("spaces");
class X1 {
  constructor(e, t, r) {
    this.matcher = e, this.startExpr = t, this.grammar = e.grammar, this.input = e.getInput(), this.inputStream = new lu(this.input), this.memoTable = e._memoTable, this.userData = void 0, this.doNotMemoize = !1, this._bindings = [], this._bindingOffsets = [], this._applicationStack = [], this._posStack = [0], this.inLexifiedContextStack = [!1], this.rightmostFailurePosition = -1, this._rightmostFailurePositionStack = [], this._recordedFailuresStack = [], r !== void 0 && (this.positionToRecordFailures = r, this.recordedFailures = /* @__PURE__ */ Object.create(null));
  }
  posToOffset(e) {
    return e - this._posStack[this._posStack.length - 1];
  }
  enterApplication(e, t) {
    this._posStack.push(this.inputStream.pos), this._applicationStack.push(t), this.inLexifiedContextStack.push(!1), e.enter(t), this._rightmostFailurePositionStack.push(this.rightmostFailurePosition), this.rightmostFailurePosition = -1;
  }
  exitApplication(e, t) {
    const r = this._posStack.pop();
    this._applicationStack.pop(), this.inLexifiedContextStack.pop(), e.exit(), this.rightmostFailurePosition = Math.max(
      this.rightmostFailurePosition,
      this._rightmostFailurePositionStack.pop()
    ), t && this.pushBinding(t, r);
  }
  enterLexifiedContext() {
    this.inLexifiedContextStack.push(!0);
  }
  exitLexifiedContext() {
    this.inLexifiedContextStack.pop();
  }
  currentApplication() {
    return this._applicationStack[this._applicationStack.length - 1];
  }
  inSyntacticContext() {
    const e = this.currentApplication();
    return e ? e.isSyntactic() && !this.inLexifiedContext() : this.startExpr.factors[0].isSyntactic();
  }
  inLexifiedContext() {
    return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
  }
  skipSpaces() {
    return this.pushFailuresInfo(), this.eval(Oc), this.popBinding(), this.popFailuresInfo(), this.inputStream.pos;
  }
  skipSpacesIfInSyntacticContext() {
    return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
  }
  maybeSkipSpacesBefore(e) {
    return e.allowsSkippingPrecedingSpace() && e !== Oc ? this.skipSpacesIfInSyntacticContext() : this.inputStream.pos;
  }
  pushBinding(e, t) {
    this._bindings.push(e), this._bindingOffsets.push(this.posToOffset(t));
  }
  popBinding() {
    this._bindings.pop(), this._bindingOffsets.pop();
  }
  numBindings() {
    return this._bindings.length;
  }
  truncateBindings(e) {
    for (; this._bindings.length > e; )
      this.popBinding();
  }
  getCurrentPosInfo() {
    return this.getPosInfo(this.inputStream.pos);
  }
  getPosInfo(e) {
    let t = this.memoTable[e];
    return t || (t = this.memoTable[e] = new $1()), t;
  }
  processFailure(e, t) {
    if (this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, e), this.recordedFailures && e === this.positionToRecordFailures) {
      const r = this.currentApplication();
      r && (t = t.substituteParams(r.args)), this.recordFailure(t.toFailure(this.grammar), !1);
    }
  }
  recordFailure(e, t) {
    const r = e.toKey();
    this.recordedFailures[r] ? this.recordedFailures[r].isFluffy() && !e.isFluffy() && this.recordedFailures[r].clearFluffy() : this.recordedFailures[r] = t ? e.clone() : e;
  }
  recordFailures(e, t) {
    Object.keys(e).forEach((r) => {
      this.recordFailure(e[r], t);
    });
  }
  cloneRecordedFailures() {
    if (!this.recordedFailures)
      return;
    const e = /* @__PURE__ */ Object.create(null);
    return Object.keys(this.recordedFailures).forEach((t) => {
      e[t] = this.recordedFailures[t].clone();
    }), e;
  }
  getRightmostFailurePosition() {
    return this.rightmostFailurePosition;
  }
  _getRightmostFailureOffset() {
    return this.rightmostFailurePosition >= 0 ? this.posToOffset(this.rightmostFailurePosition) : -1;
  }
  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry(e, t) {
    const r = this.memoTable[e];
    if (r && t instanceof mt) {
      const i = r.memo[t.toMemoKey()];
      if (i && i.traceEntry) {
        const o = i.traceEntry.cloneWithExpr(t);
        return o.isMemoized = !0, o;
      }
    }
    return null;
  }
  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry(e, t, r, i) {
    if (t instanceof mt) {
      const o = this.currentApplication(), a = o ? o.args : [];
      t = t.substituteParams(a);
    }
    return this.getMemoizedTraceEntry(e, t) || new Ii(this.input, e, this.inputStream.pos, t, r, i, this.trace);
  }
  isTracing() {
    return !!this.trace;
  }
  hasNecessaryInfo(e) {
    return this.trace && !e.traceEntry ? !1 : this.recordedFailures && this.inputStream.pos + e.rightmostFailureOffset === this.positionToRecordFailures ? !!e.failuresAtRightmostPosition : !0;
  }
  useMemoizedResult(e, t) {
    this.trace && this.trace.push(t.traceEntry);
    const r = this.inputStream.pos + t.rightmostFailureOffset;
    return this.rightmostFailurePosition = Math.max(
      this.rightmostFailurePosition,
      r
    ), this.recordedFailures && this.positionToRecordFailures === r && t.failuresAtRightmostPosition && this.recordFailures(t.failuresAtRightmostPosition, !0), this.inputStream.examinedLength = Math.max(
      this.inputStream.examinedLength,
      t.examinedLength + e
    ), t.value ? (this.inputStream.pos += t.matchLength, this.pushBinding(t.value, e), !0) : !1;
  }
  // Evaluate `expr` and return `true` if it succeeded, `false` otherwise. On success, `bindings`
  // will have `expr.getArity()` more elements than before, and the input stream's position may
  // have increased. On failure, `bindings` and position will be unchanged.
  eval(e) {
    const { inputStream: t } = this, r = this._bindings.length, i = this.userData;
    let o;
    this.recordedFailures && (o = this.recordedFailures, this.recordedFailures = /* @__PURE__ */ Object.create(null));
    const a = t.pos, l = this.maybeSkipSpacesBefore(e);
    let c;
    this.trace && (c = this.trace, this.trace = []);
    const b = e.eval(this);
    if (this.trace) {
      const m = this._bindings.slice(r), w = this.getTraceEntry(l, e, b, m);
      w.isImplicitSpaces = e === Oc, w.isRootNode = e === this.startExpr, c.push(w), this.trace = c;
    }
    return b ? this.recordedFailures && t.pos === this.positionToRecordFailures && Object.keys(this.recordedFailures).forEach((m) => {
      this.recordedFailures[m].makeFluffy();
    }) : (t.pos = a, this.truncateBindings(r), this.userData = i), this.recordedFailures && this.recordFailures(o, !1), e === u0 && this.skipSpaces(), b;
  }
  getMatchResult() {
    this.grammar._setUpMatchState(this), this.eval(this.startExpr);
    let e;
    this.recordedFailures && (e = Object.keys(this.recordedFailures).map(
      (r) => this.recordedFailures[r]
    ));
    const t = this._bindings[0];
    return t && (t.grammar = this.grammar), new s0(
      this.matcher,
      this.input,
      this.startExpr,
      t,
      this._bindingOffsets[0],
      this.rightmostFailurePosition,
      e
    );
  }
  getTrace() {
    this.trace = [];
    const e = this.getMatchResult(), t = this.trace[this.trace.length - 1];
    return t.result = e, t;
  }
  pushFailuresInfo() {
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition), this._recordedFailuresStack.push(this.recordedFailures);
  }
  popFailuresInfo() {
    this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop(), this.recordedFailures = this._recordedFailuresStack.pop();
  }
}
class eI {
  constructor(e) {
    this.grammar = e, this._memoTable = [], this._input = "", this._isMemoTableStale = !1;
  }
  _resetMemoTable() {
    this._memoTable = [], this._isMemoTableStale = !1;
  }
  getInput() {
    return this._input;
  }
  setInput(e) {
    return this._input !== e && this.replaceInputRange(0, this._input.length, e), this;
  }
  replaceInputRange(e, t, r) {
    const i = this._input, o = this._memoTable;
    if (e < 0 || e > i.length || t < 0 || t > i.length || e > t)
      throw new Error("Invalid indices: " + e + " and " + t);
    this._input = i.slice(0, e) + r + i.slice(t), this._input !== i && o.length > 0 && (this._isMemoTableStale = !0);
    const a = o.slice(t);
    o.length = e;
    for (let l = 0; l < r.length; l++)
      o.push(void 0);
    for (const l of a)
      o.push(l);
    for (let l = 0; l < e; l++) {
      const c = o[l];
      c && c.clearObsoleteEntries(l, e);
    }
    return this;
  }
  match(e, t = { incremental: !0 }) {
    return this._match(this._getStartExpr(e), {
      incremental: t.incremental,
      tracing: !1
    });
  }
  trace(e, t = { incremental: !0 }) {
    return this._match(this._getStartExpr(e), {
      incremental: t.incremental,
      tracing: !0
    });
  }
  _match(e, t = {}) {
    const r = {
      tracing: !1,
      incremental: !0,
      positionToRecordFailures: void 0,
      ...t
    };
    if (!r.incremental)
      this._resetMemoTable();
    else if (this._isMemoTableStale && !this.grammar.supportsIncrementalParsing)
      throw x1(this.grammar);
    const i = new X1(this, e, r.positionToRecordFailures);
    return r.tracing ? i.getTrace() : i.getMatchResult();
  }
  /*
    Returns the starting expression for this Matcher's associated grammar. If
    `optStartApplicationStr` is specified, it is a string expressing a rule application in the
    grammar. If not specified, the grammar's default start rule will be used.
  */
  _getStartExpr(e) {
    const t = e || this.grammar.defaultStartRule;
    if (!t)
      throw new Error("Missing start rule argument -- the grammar has no default start rule.");
    const r = this.grammar.parseApplication(t);
    return new Gt([r, or]);
  }
}
const Co = [], af = (n, e) => Object.prototype.hasOwnProperty.call(n, e);
class rv {
  constructor(e, t, r) {
    this._node = e, this.source = t, this._baseInterval = r, e.isNonterminal() && Ei(t === r), this._childWrappers = [];
  }
  _forgetMemoizedResultFor(e) {
    delete this._node[this._semantics.attributeKeys[e]], this.children.forEach((t) => {
      t._forgetMemoizedResultFor(e);
    });
  }
  // Returns the wrapper of the specified child node. Child wrappers are created lazily and
  // cached in the parent wrapper's `_childWrappers` instance variable.
  child(e) {
    if (!(0 <= e && e < this._node.numChildren()))
      return;
    let t = this._childWrappers[e];
    if (!t) {
      const r = this._node.childAt(e), i = this._node.childOffsets[e], o = this._baseInterval.subInterval(i, r.matchLength), a = r.isNonterminal() ? o : this._baseInterval;
      t = this._childWrappers[e] = this._semantics.wrap(r, o, a);
    }
    return t;
  }
  // Returns an array containing the wrappers of all of the children of the node associated
  // with this wrapper.
  _children() {
    for (let e = 0; e < this._node.numChildren(); e++)
      this.child(e);
    return this._childWrappers;
  }
  // Returns `true` if the CST node associated with this wrapper corresponds to an iteration
  // expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
  isIteration() {
    return this._node.isIteration();
  }
  // Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
  // otherwise.
  isTerminal() {
    return this._node.isTerminal();
  }
  // Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
  // otherwise.
  isNonterminal() {
    return this._node.isNonterminal();
  }
  // Returns `true` if the CST node associated with this wrapper is a nonterminal node
  // corresponding to a syntactic rule, `false` otherwise.
  isSyntactic() {
    return this.isNonterminal() && this._node.isSyntactic();
  }
  // Returns `true` if the CST node associated with this wrapper is a nonterminal node
  // corresponding to a lexical rule, `false` otherwise.
  isLexical() {
    return this.isNonterminal() && this._node.isLexical();
  }
  // Returns `true` if the CST node associated with this wrapper is an iterator node
  // having either one or no child (? operator), `false` otherwise.
  // Otherwise, throws an exception.
  isOptional() {
    return this._node.isOptional();
  }
  // Create a new _iter wrapper in the same semantics as this wrapper.
  iteration(e) {
    const t = e || [], r = t.map((a) => a._node), i = new a0(r, [], -1, !1), o = this._semantics.wrap(i, null, null);
    return o._childWrappers = t, o;
  }
  // Returns an array containing the children of this CST node.
  get children() {
    return this._children();
  }
  // Returns the name of grammar rule that created this CST node.
  get ctorName() {
    return this._node.ctorName;
  }
  // Returns the number of children of this CST node.
  get numChildren() {
    return this._node.numChildren();
  }
  // Returns the contents of the input stream consumed by this CST node.
  get sourceString() {
    return this.source.contents;
  }
}
class Ar {
  constructor(e, t) {
    const r = this;
    if (this.grammar = e, this.checkedActionDicts = !1, this.Wrapper = class extends (t ? t.Wrapper : rv) {
      constructor(i, o, a) {
        super(i, o, a), r.checkActionDictsIfHaventAlready(), this._semantics = r;
      }
      toString() {
        return "[semantics wrapper for " + r.grammar.name + "]";
      }
    }, this.super = t, t) {
      if (!(e.equals(this.super.grammar) || e._inheritsFrom(this.super.grammar)))
        throw new Error(
          "Cannot extend a semantics for grammar '" + this.super.grammar.name + "' for use with grammar '" + e.name + "' (not a sub-grammar)"
        );
      this.operations = Object.create(this.super.operations), this.attributes = Object.create(this.super.attributes), this.attributeKeys = /* @__PURE__ */ Object.create(null);
      for (const i in this.attributes)
        Object.defineProperty(this.attributeKeys, i, {
          value: ev(i)
        });
    } else
      this.operations = /* @__PURE__ */ Object.create(null), this.attributes = /* @__PURE__ */ Object.create(null), this.attributeKeys = /* @__PURE__ */ Object.create(null);
  }
  toString() {
    return "[semantics for " + this.grammar.name + "]";
  }
  checkActionDictsIfHaventAlready() {
    this.checkedActionDicts || (this.checkActionDicts(), this.checkedActionDicts = !0);
  }
  // Checks that the action dictionaries for all operations and attributes in this semantics,
  // including the ones that were inherited from the super-semantics, agree with the grammar.
  // Throws an exception if one or more of them doesn't.
  checkActionDicts() {
    let e;
    for (e in this.operations)
      this.operations[e].checkActionDict(this.grammar);
    for (e in this.attributes)
      this.attributes[e].checkActionDict(this.grammar);
  }
  toRecipe(e) {
    function t(i) {
      return i.super !== Ar.BuiltInSemantics._getSemantics();
    }
    let r = `(function(g) {
`;
    if (t(this)) {
      r += "  var semantics = " + this.super.toRecipe(!0) + "(g";
      const i = this.super.grammar;
      let o = this.grammar;
      for (; o !== i; )
        r += ".superGrammar", o = o.superGrammar;
      r += `);
`, r += "  return g.extendSemantics(semantics)";
    } else
      r += "  return g.createSemantics()";
    return ["Operation", "Attribute"].forEach((i) => {
      const o = this[i.toLowerCase() + "s"];
      Object.keys(o).forEach((a) => {
        const { actionDict: l, formals: c, builtInDefault: b } = o[a];
        let m = a;
        c.length > 0 && (m += "(" + c.join(", ") + ")");
        let w;
        t(this) && this.super[i.toLowerCase() + "s"][a] ? w = "extend" + i : w = "add" + i, r += `
    .` + w + "(" + JSON.stringify(m) + ", {";
        const x = [];
        Object.keys(l).forEach((k) => {
          if (l[k] !== b) {
            let D = l[k].toString().trim();
            D = D.replace(/^.*\(/, "function("), x.push(`
      ` + JSON.stringify(k) + ": " + D);
          }
        }), r += x.join(",") + `
    })`;
      });
    }), r += `;
  })`, e || (r = `(function() {
  var grammar = this.fromRecipe(` + this.grammar.toRecipe() + `);
  var semantics = ` + r + `(grammar);
  return semantics;
});
`), r;
  }
  addOperationOrAttribute(e, t, r) {
    const i = e + "s", o = nv(t, e), { name: a } = o, { formals: l } = o;
    this.assertNewName(a, e);
    const c = tI(e, a, w), b = { _default: c };
    Object.keys(r).forEach((x) => {
      b[x] = r[x];
    });
    const m = e === "operation" ? new Mo(a, l, b, c) : new uf(a, b, c);
    m.checkActionDict(this.grammar), this[i][a] = m;
    function w(...x) {
      const k = this._semantics[i][a];
      if (arguments.length !== k.formals.length)
        throw new Error(
          "Invalid number of arguments passed to " + a + " " + e + " (expected " + k.formals.length + ", got " + arguments.length + ")"
        );
      const D = /* @__PURE__ */ Object.create(null);
      for (const [M, J] of Object.entries(x)) {
        const X = k.formals[M];
        D[X] = J;
      }
      const K = this.args;
      this.args = D;
      const C = k.execute(this._semantics, this);
      return this.args = K, C;
    }
    e === "operation" ? (this.Wrapper.prototype[a] = w, this.Wrapper.prototype[a].toString = function() {
      return "[" + a + " operation]";
    }) : (Object.defineProperty(this.Wrapper.prototype, a, {
      get: w,
      configurable: !0
      // So the property can be deleted.
    }), Object.defineProperty(this.attributeKeys, a, {
      value: ev(a)
    }));
  }
  extendOperationOrAttribute(e, t, r) {
    const i = e + "s";
    if (nv(t, "attribute"), !(this.super && t in this.super[i]))
      throw new Error(
        "Cannot extend " + e + " '" + t + "': did not inherit an " + e + " with that name"
      );
    if (af(this[i], t))
      throw new Error("Cannot extend " + e + " '" + t + "' again");
    const o = this[i][t].formals, a = this[i][t].actionDict, l = Object.create(a);
    Object.keys(r).forEach((c) => {
      l[c] = r[c];
    }), this[i][t] = e === "operation" ? new Mo(t, o, l) : new uf(t, l), this[i][t].checkActionDict(this.grammar);
  }
  assertNewName(e, t) {
    if (af(rv.prototype, e))
      throw new Error("Cannot add " + t + " '" + e + "': that's a reserved name");
    if (e in this.operations)
      throw new Error(
        "Cannot add " + t + " '" + e + "': an operation with that name already exists"
      );
    if (e in this.attributes)
      throw new Error(
        "Cannot add " + t + " '" + e + "': an attribute with that name already exists"
      );
  }
  // Returns a wrapper for the given CST `node` in this semantics.
  // If `node` is already a wrapper, returns `node` itself.  // TODO: why is this needed?
  wrap(e, t, r) {
    const i = r || t;
    return e instanceof this.Wrapper ? e : new this.Wrapper(e, t, i);
  }
}
function nv(n, e) {
  if (!Ar.prototypeGrammar)
    return Ei(n.indexOf("(") === -1), {
      name: n,
      formals: []
    };
  const t = Ar.prototypeGrammar.match(
    n,
    e === "operation" ? "OperationSignature" : "AttributeSignature"
  );
  if (t.failed())
    throw new Error(t.message);
  return Ar.prototypeGrammarSemantics(t).parse();
}
function tI(n, e, t) {
  return function(...r) {
    const o = (this._semantics.operations[e] || this._semantics.attributes[e]).formals.map((a) => this.args[a]);
    if (!this.isIteration() && r.length === 1)
      return t.apply(r[0], o);
    throw B1(this.ctorName, e, n, Co);
  };
}
Ar.createSemantics = function(n, e) {
  const t = new Ar(
    n,
    e !== void 0 ? e : Ar.BuiltInSemantics._getSemantics()
  ), r = function(o) {
    if (!(o instanceof s0))
      throw new TypeError(
        "Semantics expected a MatchResult, but got " + Zg(o)
      );
    if (o.failed())
      throw new TypeError("cannot apply Semantics to " + o.toString());
    const a = o._cst;
    if (a.grammar !== n)
      throw new Error(
        "Cannot use a MatchResult from grammar '" + a.grammar.name + "' with a semantics for '" + n.name + "'"
      );
    const l = new lu(o.input);
    return t.wrap(a, l.interval(o._cstOffset, o.input.length));
  };
  return r.addOperation = function(i, o) {
    return t.addOperationOrAttribute("operation", i, o), r;
  }, r.extendOperation = function(i, o) {
    return t.extendOperationOrAttribute("operation", i, o), r;
  }, r.addAttribute = function(i, o) {
    return t.addOperationOrAttribute("attribute", i, o), r;
  }, r.extendAttribute = function(i, o) {
    return t.extendOperationOrAttribute("attribute", i, o), r;
  }, r._getActionDict = function(i) {
    const o = t.operations[i] || t.attributes[i];
    if (!o)
      throw new Error(
        '"' + i + '" is not a valid operation or attribute name in this semantics for "' + n.name + '"'
      );
    return o.actionDict;
  }, r._remove = function(i) {
    let o;
    return i in t.operations ? (o = t.operations[i], delete t.operations[i]) : i in t.attributes && (o = t.attributes[i], delete t.attributes[i]), delete t.Wrapper.prototype[i], o;
  }, r.getOperationNames = function() {
    return Object.keys(t.operations);
  }, r.getAttributeNames = function() {
    return Object.keys(t.attributes);
  }, r.getGrammar = function() {
    return t.grammar;
  }, r.toRecipe = function(i) {
    return t.toRecipe(i);
  }, r.toString = t.toString.bind(t), r._getSemantics = function() {
    return t;
  }, r;
};
class Mo {
  constructor(e, t, r, i) {
    this.name = e, this.formals = t, this.actionDict = r, this.builtInDefault = i;
  }
  checkActionDict(e) {
    e._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
  }
  // Execute this operation on the CST node associated with `nodeWrapper` in the context of the
  // given Semantics instance.
  execute(e, t) {
    try {
      const { ctorName: r } = t._node;
      let i = this.actionDict[r];
      return i ? (Co.push([this, r]), i.apply(t, t._children())) : t.isNonterminal() && (i = this.actionDict._nonterminal, i) ? (Co.push([this, "_nonterminal", r]), i.apply(t, t._children())) : (Co.push([this, "default action", r]), this.actionDict._default.apply(t, t._children()));
    } finally {
      Co.pop();
    }
  }
}
Mo.prototype.typeName = "operation";
class uf extends Mo {
  constructor(e, t, r) {
    super(e, [], t, r);
  }
  execute(e, t) {
    const r = t._node, i = e.attributeKeys[this.name];
    return af(r, i) || (r[i] = Mo.prototype.execute.call(this, e, t)), r[i];
  }
}
uf.prototype.typeName = "attribute";
const iv = ["_iter", "_terminal", "_nonterminal", "_default"];
function sv(n) {
  return Object.keys(n.rules).sort().map((e) => n.rules[e]);
}
const rI = (n) => n.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
let l0, c0;
class mr {
  constructor(e, t, r, i) {
    if (this.name = e, this.superGrammar = t, this.rules = r, i) {
      if (!(i in r))
        throw new Error(
          "Invalid start rule: '" + i + "' is not a rule in grammar '" + e + "'"
        );
      this.defaultStartRule = i;
    }
    this._matchStateInitializer = void 0, this.supportsIncrementalParsing = !0;
  }
  matcher() {
    return new eI(this);
  }
  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn() {
    return this === mr.ProtoBuiltInRules || this === mr.BuiltInRules;
  }
  equals(e) {
    if (this === e)
      return !0;
    if (e == null || this.name !== e.name || this.defaultStartRule !== e.defaultStartRule || !(this.superGrammar === e.superGrammar || this.superGrammar.equals(e.superGrammar)))
      return !1;
    const t = sv(this), r = sv(e);
    return t.length === r.length && t.every((i, o) => i.description === r[o].description && i.formals.join(",") === r[o].formals.join(",") && i.body.toString() === r[o].body.toString());
  }
  match(e, t) {
    const r = this.matcher();
    return r.replaceInputRange(0, 0, e), r.match(t);
  }
  trace(e, t) {
    const r = this.matcher();
    return r.replaceInputRange(0, 0, e), r.trace(t);
  }
  createSemantics() {
    return Ar.createSemantics(this);
  }
  extendSemantics(e) {
    return Ar.createSemantics(this, e._getSemantics());
  }
  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict(e, t, r) {
    const i = [];
    for (const o in r) {
      const a = r[o];
      if (!iv.includes(o) && !(o in this.rules)) {
        i.push(`'${o}' is not a valid semantic action for '${this.name}'`);
        continue;
      }
      if (typeof a != "function") {
        i.push(`'${o}' must be a function in an action dictionary for '${this.name}'`);
        continue;
      }
      const c = a.length, b = this._topDownActionArity(o);
      if (c !== b) {
        let m;
        o === "_iter" || o === "_nonterminal" ? m = `it should use a rest parameter, e.g. \`${o}(...children) {}\`. NOTE: this is new in Ohm v16 — see https://ohmjs.org/d/ati for details.` : m = `expected ${b}, got ${c}`, i.push(`Semantic action '${o}' has the wrong arity: ${m}`);
      }
    }
    if (i.length > 0) {
      const o = i.map((l) => "- " + l), a = new Error(
        [
          `Found errors in the action dictionary of the '${t}' ${e}:`,
          ...o
        ].join(`
`)
      );
      throw a.problems = i, a;
    }
  }
  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity(e) {
    return iv.includes(e) ? 0 : this.rules[e].body.getArity();
  }
  _inheritsFrom(e) {
    let t = this.superGrammar;
    for (; t; ) {
      if (t.equals(e, !0))
        return !0;
      t = t.superGrammar;
    }
    return !1;
  }
  toRecipe(e = void 0) {
    const t = {};
    this.source && (t.source = this.source.contents);
    let r = null;
    this.defaultStartRule && (r = this.defaultStartRule);
    const i = {};
    Object.keys(this.rules).forEach((l) => {
      const c = this.rules[l], { body: b } = c, m = !this.superGrammar || !this.superGrammar.rules[l];
      let w;
      m ? w = "define" : w = b instanceof au ? "extend" : "override";
      const x = {};
      if (c.source && this.source) {
        const K = c.source.relativeTo(this.source);
        x.sourceInterval = [K.startIdx, K.endIdx];
      }
      const k = m ? c.description : null, D = b.outputRecipe(c.formals, this.source);
      i[l] = [
        w,
        // "define"/"extend"/"override"
        x,
        k,
        c.formals,
        D
      ];
    });
    let o = "null";
    e ? o = e : this.superGrammar && !this.superGrammar.isBuiltIn() && (o = this.superGrammar.toRecipe());
    const a = [
      ...["grammar", t, this.name].map(JSON.stringify),
      o,
      ...[r, i].map(JSON.stringify)
    ];
    return rI(`[${a.join(",")}]`);
  }
  // TODO: Come up with better names for these methods.
  // TODO: Write the analog of these methods for inherited attributes.
  toOperationActionDictionaryTemplate() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  }
  toAttributeActionDictionaryTemplate() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  }
  _toOperationOrAttributeActionDictionaryTemplate() {
    const e = new ms();
    e.append("{");
    let t = !0;
    for (const r in this.rules) {
      const { body: i } = this.rules[r];
      t ? t = !1 : e.append(","), e.append(`
`), e.append("  "), this.addSemanticActionTemplate(r, i, e);
    }
    return e.append(`
}`), e.contents();
  }
  addSemanticActionTemplate(e, t, r) {
    r.append(e), r.append(": function(");
    const i = this._topDownActionArity(e);
    r.append(ou("_", i).join(", ")), r.append(`) {
`), r.append("  }");
  }
  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication(e) {
    let t;
    if (e.indexOf("<") === -1)
      t = new mt(e);
    else {
      const i = l0.match(e, "Base_application");
      t = c0(i, {});
    }
    if (!(t.ruleName in this.rules))
      throw Xg(t.ruleName, this.name);
    const { formals: r } = this.rules[t.ruleName];
    if (r.length !== t.args.length) {
      const { source: i } = this.rules[t.ruleName];
      throw e0(
        t.ruleName,
        r.length,
        t.args.length,
        i
      );
    }
    return t;
  }
  _setUpMatchState(e) {
    this._matchStateInitializer && this._matchStateInitializer(e);
  }
}
mr.ProtoBuiltInRules = new mr(
  "ProtoBuiltInRules",
  // name
  void 0,
  // supergrammar
  {
    any: {
      body: sr,
      formals: [],
      description: "any character",
      primitive: !0
    },
    end: {
      body: or,
      formals: [],
      description: "end of input",
      primitive: !0
    },
    caseInsensitive: {
      body: new th(new ur(0)),
      formals: ["str"],
      primitive: !0
    },
    lower: {
      body: new Yt("Ll"),
      formals: [],
      description: "a lowercase letter",
      primitive: !0
    },
    upper: {
      body: new Yt("Lu"),
      formals: [],
      description: "an uppercase letter",
      primitive: !0
    },
    // Union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
    unicodeLtmo: {
      body: new Yt("Ltmo"),
      formals: [],
      description: "a Unicode character in Lt, Lm, or Lo",
      primitive: !0
    },
    // These rules are not truly primitive (they could be written in userland) but are defined
    // here for bootstrapping purposes.
    spaces: {
      body: new Is(new mt("space")),
      formals: []
    },
    space: {
      body: new ar("\0", " "),
      formals: [],
      description: "a space"
    }
  }
);
mr.initApplicationParser = function(n, e) {
  l0 = n, c0 = e;
};
class ov {
  constructor(e) {
    this.name = e;
  }
  // Helpers
  sourceInterval(e, t) {
    return this.source.subInterval(e, t - e);
  }
  ensureSuperGrammar() {
    return this.superGrammar || this.withSuperGrammar(
      // TODO: The conditional expression below is an ugly hack. It's kind of ok because
      // I doubt anyone will ever try to declare a grammar called `BuiltInRules`. Still,
      // we should try to find a better way to do this.
      this.name === "BuiltInRules" ? mr.ProtoBuiltInRules : mr.BuiltInRules
    ), this.superGrammar;
  }
  ensureSuperGrammarRuleForOverriding(e, t) {
    const r = this.ensureSuperGrammar().rules[e];
    if (!r)
      throw E1(e, this.superGrammar.name, t);
    return r;
  }
  installOverriddenOrExtendedRule(e, t, r, i) {
    const o = rf(t);
    if (o.length > 0)
      throw Zd(e, o, i);
    const a = this.ensureSuperGrammar().rules[e], l = a.formals, c = l ? l.length : 0;
    if (t.length !== c)
      throw e0(e, c, t.length, i);
    return this.install(e, t, r, a.description, i);
  }
  install(e, t, r, i, o, a = !1) {
    return this.rules[e] = {
      body: r.introduceParams(t),
      formals: t,
      description: i,
      source: o,
      primitive: a
    }, this;
  }
  // Stuff that you should only do once
  withSuperGrammar(e) {
    if (this.superGrammar)
      throw new Error("the super grammar of a GrammarDecl cannot be set more than once");
    return this.superGrammar = e, this.rules = Object.create(e.rules), e.isBuiltIn() || (this.defaultStartRule = e.defaultStartRule), this;
  }
  withDefaultStartRule(e) {
    return this.defaultStartRule = e, this;
  }
  withSource(e) {
    return this.source = new lu(e).interval(0, e.length), this;
  }
  // Creates a Grammar instance, and if it passes the sanity checks, returns it.
  build() {
    const e = new mr(
      this.name,
      this.ensureSuperGrammar(),
      this.rules,
      this.defaultStartRule
    );
    e._matchStateInitializer = e.superGrammar._matchStateInitializer, e.supportsIncrementalParsing = e.superGrammar.supportsIncrementalParsing;
    const t = [];
    let r = !1;
    return Object.keys(e.rules).forEach((i) => {
      const { body: o } = e.rules[i];
      try {
        o.assertChoicesHaveUniformArity(i);
      } catch (a) {
        t.push(a);
      }
      try {
        o.assertAllApplicationsAreValid(i, e);
      } catch (a) {
        t.push(a), r = !0;
      }
    }), r || Object.keys(e.rules).forEach((i) => {
      const { body: o } = e.rules[i];
      try {
        o.assertIteratedExprsAreNotNullable(e, []);
      } catch (a) {
        t.push(a);
      }
    }), t.length > 0 && F1(t), this.source && (e.source = this.source), e;
  }
  // Rule declarations
  define(e, t, r, i, o, a) {
    if (this.ensureSuperGrammar(), this.superGrammar.rules[e])
      throw Jd(e, this.name, this.superGrammar.name, o);
    if (this.rules[e])
      throw Jd(e, this.name, this.name, o);
    const l = rf(t);
    if (l.length > 0)
      throw Zd(e, l, o);
    return this.install(e, t, r, i, o, a);
  }
  override(e, t, r, i, o) {
    return this.ensureSuperGrammarRuleForOverriding(e, o), this.installOverriddenOrExtendedRule(e, t, r, o), this;
  }
  extend(e, t, r, i, o) {
    if (!this.ensureSuperGrammar().rules[e])
      throw S1(e, this.superGrammar.name, o);
    const l = new au(this.superGrammar, e, r);
    return l.source = r.source, this.installOverriddenOrExtendedRule(e, t, l, o), this;
  }
}
class za {
  constructor() {
    this.currentDecl = null, this.currentRuleName = null;
  }
  newGrammar(e) {
    return new ov(e);
  }
  grammar(e, t, r, i, o) {
    const a = new ov(t);
    return r && a.withSuperGrammar(
      r instanceof mr ? r : this.fromRecipe(r)
    ), i && a.withDefaultStartRule(i), e && e.source && a.withSource(e.source), this.currentDecl = a, Object.keys(o).forEach((l) => {
      this.currentRuleName = l;
      const c = o[l], b = c[0], m = c[1], w = c[2], x = c[3], k = this.fromRecipe(c[4]);
      let D;
      a.source && m && m.sourceInterval && (D = a.source.subInterval(
        m.sourceInterval[0],
        m.sourceInterval[1] - m.sourceInterval[0]
      )), a[b](l, x, k, w, D);
    }), this.currentRuleName = this.currentDecl = null, a.build();
  }
  terminal(e) {
    return new Vt(e);
  }
  range(e, t) {
    return new ar(e, t);
  }
  param(e) {
    return new ur(e);
  }
  alt(...e) {
    let t = [];
    for (let r of e)
      r instanceof Ge || (r = this.fromRecipe(r)), r instanceof Mt ? t = t.concat(r.terms) : t.push(r);
    return t.length === 1 ? t[0] : new Mt(t);
  }
  seq(...e) {
    let t = [];
    for (let r of e)
      r instanceof Ge || (r = this.fromRecipe(r)), r instanceof Gt ? t = t.concat(r.factors) : t.push(r);
    return t.length === 1 ? t[0] : new Gt(t);
  }
  star(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new Is(e);
  }
  plus(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new go(e);
  }
  opt(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new Bn(e);
  }
  not(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new wr(e);
  }
  lookahead(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new xr(e);
  }
  lex(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new kr(e);
  }
  app(e, t) {
    return t && t.length > 0 && (t = t.map(function(r) {
      return r instanceof Ge ? r : this.fromRecipe(r);
    }, this)), new mt(e, t);
  }
  // Note that unlike other methods in this class, this method cannot be used as a
  // convenience constructor. It only works with recipes, because it relies on
  // `this.currentDecl` and `this.currentRuleName` being set.
  splice(e, t) {
    return new uu(
      this.currentDecl.superGrammar,
      this.currentRuleName,
      e.map((r) => this.fromRecipe(r)),
      t.map((r) => this.fromRecipe(r))
    );
  }
  fromRecipe(e) {
    const t = e[0] === "grammar" ? e.slice(1) : e.slice(2), r = this[e[0]](...t), i = e[1];
    return i && i.sourceInterval && this.currentDecl && r.withSource(this.currentDecl.sourceInterval(...i.sourceInterval)), r;
  }
}
function cu(n) {
  return typeof n == "function" ? n.call(new za()) : (typeof n == "string" && (n = JSON.parse(n)), new za().fromRecipe(n));
}
const rh = cu(["grammar", { source: `BuiltInRules {

  alnum  (an alpha-numeric character)
    = letter
    | digit

  letter  (a letter)
    = lower
    | upper
    | unicodeLtmo

  digit  (a digit)
    = "0".."9"

  hexDigit  (a hexadecimal digit)
    = digit
    | "a".."f"
    | "A".."F"

  ListOf<elem, sep>
    = NonemptyListOf<elem, sep>
    | EmptyListOf<elem, sep>

  NonemptyListOf<elem, sep>
    = elem (sep elem)*

  EmptyListOf<elem, sep>
    = /* nothing */

  listOf<elem, sep>
    = nonemptyListOf<elem, sep>
    | emptyListOf<elem, sep>

  nonemptyListOf<elem, sep>
    = elem (sep elem)*

  emptyListOf<elem, sep>
    = /* nothing */

  // Allows a syntactic rule application within a lexical context.
  applySyntactic<app> = app
}` }, "BuiltInRules", null, null, { alnum: ["define", { sourceInterval: [18, 78] }, "an alpha-numeric character", [], ["alt", { sourceInterval: [60, 78] }, ["app", { sourceInterval: [60, 66] }, "letter", []], ["app", { sourceInterval: [73, 78] }, "digit", []]]], letter: ["define", { sourceInterval: [82, 142] }, "a letter", [], ["alt", { sourceInterval: [107, 142] }, ["app", { sourceInterval: [107, 112] }, "lower", []], ["app", { sourceInterval: [119, 124] }, "upper", []], ["app", { sourceInterval: [131, 142] }, "unicodeLtmo", []]]], digit: ["define", { sourceInterval: [146, 177] }, "a digit", [], ["range", { sourceInterval: [169, 177] }, "0", "9"]], hexDigit: ["define", { sourceInterval: [181, 254] }, "a hexadecimal digit", [], ["alt", { sourceInterval: [219, 254] }, ["app", { sourceInterval: [219, 224] }, "digit", []], ["range", { sourceInterval: [231, 239] }, "a", "f"], ["range", { sourceInterval: [246, 254] }, "A", "F"]]], ListOf: ["define", { sourceInterval: [258, 336] }, null, ["elem", "sep"], ["alt", { sourceInterval: [282, 336] }, ["app", { sourceInterval: [282, 307] }, "NonemptyListOf", [["param", { sourceInterval: [297, 301] }, 0], ["param", { sourceInterval: [303, 306] }, 1]]], ["app", { sourceInterval: [314, 336] }, "EmptyListOf", [["param", { sourceInterval: [326, 330] }, 0], ["param", { sourceInterval: [332, 335] }, 1]]]]], NonemptyListOf: ["define", { sourceInterval: [340, 388] }, null, ["elem", "sep"], ["seq", { sourceInterval: [372, 388] }, ["param", { sourceInterval: [372, 376] }, 0], ["star", { sourceInterval: [377, 388] }, ["seq", { sourceInterval: [378, 386] }, ["param", { sourceInterval: [378, 381] }, 1], ["param", { sourceInterval: [382, 386] }, 0]]]]], EmptyListOf: ["define", { sourceInterval: [392, 434] }, null, ["elem", "sep"], ["seq", { sourceInterval: [438, 438] }]], listOf: ["define", { sourceInterval: [438, 516] }, null, ["elem", "sep"], ["alt", { sourceInterval: [462, 516] }, ["app", { sourceInterval: [462, 487] }, "nonemptyListOf", [["param", { sourceInterval: [477, 481] }, 0], ["param", { sourceInterval: [483, 486] }, 1]]], ["app", { sourceInterval: [494, 516] }, "emptyListOf", [["param", { sourceInterval: [506, 510] }, 0], ["param", { sourceInterval: [512, 515] }, 1]]]]], nonemptyListOf: ["define", { sourceInterval: [520, 568] }, null, ["elem", "sep"], ["seq", { sourceInterval: [552, 568] }, ["param", { sourceInterval: [552, 556] }, 0], ["star", { sourceInterval: [557, 568] }, ["seq", { sourceInterval: [558, 566] }, ["param", { sourceInterval: [558, 561] }, 1], ["param", { sourceInterval: [562, 566] }, 0]]]]], emptyListOf: ["define", { sourceInterval: [572, 682] }, null, ["elem", "sep"], ["seq", { sourceInterval: [685, 685] }]], applySyntactic: ["define", { sourceInterval: [685, 710] }, null, ["app"], ["param", { sourceInterval: [707, 710] }, 0]] }]);
mr.BuiltInRules = rh;
M1(mr.BuiltInRules);
const f0 = cu(["grammar", { source: `Ohm {

  Grammars
    = Grammar*

  Grammar
    = ident SuperGrammar? "{" Rule* "}"

  SuperGrammar
    = "<:" ident

  Rule
    = ident Formals? ruleDescr? "="  RuleBody  -- define
    | ident Formals?            ":=" OverrideRuleBody  -- override
    | ident Formals?            "+=" RuleBody  -- extend

  RuleBody
    = "|"? NonemptyListOf<TopLevelTerm, "|">

  TopLevelTerm
    = Seq caseName  -- inline
    | Seq

  OverrideRuleBody
    = "|"? NonemptyListOf<OverrideTopLevelTerm, "|">

  OverrideTopLevelTerm
    = "..."  -- superSplice
    | TopLevelTerm

  Formals
    = "<" ListOf<ident, ","> ">"

  Params
    = "<" ListOf<Seq, ","> ">"

  Alt
    = NonemptyListOf<Seq, "|">

  Seq
    = Iter*

  Iter
    = Pred "*"  -- star
    | Pred "+"  -- plus
    | Pred "?"  -- opt
    | Pred

  Pred
    = "~" Lex  -- not
    | "&" Lex  -- lookahead
    | Lex

  Lex
    = "#" Base  -- lex
    | Base

  Base
    = ident Params? ~(ruleDescr? "=" | ":=" | "+=")  -- application
    | oneCharTerminal ".." oneCharTerminal           -- range
    | terminal                                       -- terminal
    | "(" Alt ")"                                    -- paren

  ruleDescr  (a rule description)
    = "(" ruleDescrText ")"

  ruleDescrText
    = (~")" any)*

  caseName
    = "--" (~"\\n" space)* name (~"\\n" space)* ("\\n" | &"}")

  name  (a name)
    = nameFirst nameRest*

  nameFirst
    = "_"
    | letter

  nameRest
    = "_"
    | alnum

  ident  (an identifier)
    = name

  terminal
    = "\\"" terminalChar* "\\""

  oneCharTerminal
    = "\\"" terminalChar "\\""

  terminalChar
    = escapeChar
      | ~"\\\\" ~"\\"" ~"\\n" "\\u{0}".."\\u{10FFFF}"

  escapeChar  (an escape sequence)
    = "\\\\\\\\"                                     -- backslash
    | "\\\\\\""                                     -- doubleQuote
    | "\\\\\\'"                                     -- singleQuote
    | "\\\\b"                                      -- backspace
    | "\\\\n"                                      -- lineFeed
    | "\\\\r"                                      -- carriageReturn
    | "\\\\t"                                      -- tab
    | "\\\\u{" hexDigit hexDigit? hexDigit?
             hexDigit? hexDigit? hexDigit? "}"   -- unicodeCodePoint
    | "\\\\u" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape
    | "\\\\x" hexDigit hexDigit                    -- hexEscape

  space
   += comment

  comment
    = "//" (~"\\n" any)* &("\\n" | end)  -- singleLine
    | "/*" (~"*/" any)* "*/"  -- multiLine

  tokens = token*

  token = caseName | comment | ident | operator | punctuation | terminal | any

  operator = "<:" | "=" | ":=" | "+=" | "*" | "+" | "?" | "~" | "&"

  punctuation = "<" | ">" | "," | "--"
}` }, "Ohm", null, "Grammars", { Grammars: ["define", { sourceInterval: [9, 32] }, null, [], ["star", { sourceInterval: [24, 32] }, ["app", { sourceInterval: [24, 31] }, "Grammar", []]]], Grammar: ["define", { sourceInterval: [36, 83] }, null, [], ["seq", { sourceInterval: [50, 83] }, ["app", { sourceInterval: [50, 55] }, "ident", []], ["opt", { sourceInterval: [56, 69] }, ["app", { sourceInterval: [56, 68] }, "SuperGrammar", []]], ["terminal", { sourceInterval: [70, 73] }, "{"], ["star", { sourceInterval: [74, 79] }, ["app", { sourceInterval: [74, 78] }, "Rule", []]], ["terminal", { sourceInterval: [80, 83] }, "}"]]], SuperGrammar: ["define", { sourceInterval: [87, 116] }, null, [], ["seq", { sourceInterval: [106, 116] }, ["terminal", { sourceInterval: [106, 110] }, "<:"], ["app", { sourceInterval: [111, 116] }, "ident", []]]], Rule_define: ["define", { sourceInterval: [131, 181] }, null, [], ["seq", { sourceInterval: [131, 170] }, ["app", { sourceInterval: [131, 136] }, "ident", []], ["opt", { sourceInterval: [137, 145] }, ["app", { sourceInterval: [137, 144] }, "Formals", []]], ["opt", { sourceInterval: [146, 156] }, ["app", { sourceInterval: [146, 155] }, "ruleDescr", []]], ["terminal", { sourceInterval: [157, 160] }, "="], ["app", { sourceInterval: [162, 170] }, "RuleBody", []]]], Rule_override: ["define", { sourceInterval: [188, 248] }, null, [], ["seq", { sourceInterval: [188, 235] }, ["app", { sourceInterval: [188, 193] }, "ident", []], ["opt", { sourceInterval: [194, 202] }, ["app", { sourceInterval: [194, 201] }, "Formals", []]], ["terminal", { sourceInterval: [214, 218] }, ":="], ["app", { sourceInterval: [219, 235] }, "OverrideRuleBody", []]]], Rule_extend: ["define", { sourceInterval: [255, 305] }, null, [], ["seq", { sourceInterval: [255, 294] }, ["app", { sourceInterval: [255, 260] }, "ident", []], ["opt", { sourceInterval: [261, 269] }, ["app", { sourceInterval: [261, 268] }, "Formals", []]], ["terminal", { sourceInterval: [281, 285] }, "+="], ["app", { sourceInterval: [286, 294] }, "RuleBody", []]]], Rule: ["define", { sourceInterval: [120, 305] }, null, [], ["alt", { sourceInterval: [131, 305] }, ["app", { sourceInterval: [131, 170] }, "Rule_define", []], ["app", { sourceInterval: [188, 235] }, "Rule_override", []], ["app", { sourceInterval: [255, 294] }, "Rule_extend", []]]], RuleBody: ["define", { sourceInterval: [309, 362] }, null, [], ["seq", { sourceInterval: [324, 362] }, ["opt", { sourceInterval: [324, 328] }, ["terminal", { sourceInterval: [324, 327] }, "|"]], ["app", { sourceInterval: [329, 362] }, "NonemptyListOf", [["app", { sourceInterval: [344, 356] }, "TopLevelTerm", []], ["terminal", { sourceInterval: [358, 361] }, "|"]]]]], TopLevelTerm_inline: ["define", { sourceInterval: [385, 408] }, null, [], ["seq", { sourceInterval: [385, 397] }, ["app", { sourceInterval: [385, 388] }, "Seq", []], ["app", { sourceInterval: [389, 397] }, "caseName", []]]], TopLevelTerm: ["define", { sourceInterval: [366, 418] }, null, [], ["alt", { sourceInterval: [385, 418] }, ["app", { sourceInterval: [385, 397] }, "TopLevelTerm_inline", []], ["app", { sourceInterval: [415, 418] }, "Seq", []]]], OverrideRuleBody: ["define", { sourceInterval: [422, 491] }, null, [], ["seq", { sourceInterval: [445, 491] }, ["opt", { sourceInterval: [445, 449] }, ["terminal", { sourceInterval: [445, 448] }, "|"]], ["app", { sourceInterval: [450, 491] }, "NonemptyListOf", [["app", { sourceInterval: [465, 485] }, "OverrideTopLevelTerm", []], ["terminal", { sourceInterval: [487, 490] }, "|"]]]]], OverrideTopLevelTerm_superSplice: ["define", { sourceInterval: [522, 543] }, null, [], ["terminal", { sourceInterval: [522, 527] }, "..."]], OverrideTopLevelTerm: ["define", { sourceInterval: [495, 562] }, null, [], ["alt", { sourceInterval: [522, 562] }, ["app", { sourceInterval: [522, 527] }, "OverrideTopLevelTerm_superSplice", []], ["app", { sourceInterval: [550, 562] }, "TopLevelTerm", []]]], Formals: ["define", { sourceInterval: [566, 606] }, null, [], ["seq", { sourceInterval: [580, 606] }, ["terminal", { sourceInterval: [580, 583] }, "<"], ["app", { sourceInterval: [584, 602] }, "ListOf", [["app", { sourceInterval: [591, 596] }, "ident", []], ["terminal", { sourceInterval: [598, 601] }, ","]]], ["terminal", { sourceInterval: [603, 606] }, ">"]]], Params: ["define", { sourceInterval: [610, 647] }, null, [], ["seq", { sourceInterval: [623, 647] }, ["terminal", { sourceInterval: [623, 626] }, "<"], ["app", { sourceInterval: [627, 643] }, "ListOf", [["app", { sourceInterval: [634, 637] }, "Seq", []], ["terminal", { sourceInterval: [639, 642] }, ","]]], ["terminal", { sourceInterval: [644, 647] }, ">"]]], Alt: ["define", { sourceInterval: [651, 685] }, null, [], ["app", { sourceInterval: [661, 685] }, "NonemptyListOf", [["app", { sourceInterval: [676, 679] }, "Seq", []], ["terminal", { sourceInterval: [681, 684] }, "|"]]]], Seq: ["define", { sourceInterval: [689, 704] }, null, [], ["star", { sourceInterval: [699, 704] }, ["app", { sourceInterval: [699, 703] }, "Iter", []]]], Iter_star: ["define", { sourceInterval: [719, 736] }, null, [], ["seq", { sourceInterval: [719, 727] }, ["app", { sourceInterval: [719, 723] }, "Pred", []], ["terminal", { sourceInterval: [724, 727] }, "*"]]], Iter_plus: ["define", { sourceInterval: [743, 760] }, null, [], ["seq", { sourceInterval: [743, 751] }, ["app", { sourceInterval: [743, 747] }, "Pred", []], ["terminal", { sourceInterval: [748, 751] }, "+"]]], Iter_opt: ["define", { sourceInterval: [767, 783] }, null, [], ["seq", { sourceInterval: [767, 775] }, ["app", { sourceInterval: [767, 771] }, "Pred", []], ["terminal", { sourceInterval: [772, 775] }, "?"]]], Iter: ["define", { sourceInterval: [708, 794] }, null, [], ["alt", { sourceInterval: [719, 794] }, ["app", { sourceInterval: [719, 727] }, "Iter_star", []], ["app", { sourceInterval: [743, 751] }, "Iter_plus", []], ["app", { sourceInterval: [767, 775] }, "Iter_opt", []], ["app", { sourceInterval: [790, 794] }, "Pred", []]]], Pred_not: ["define", { sourceInterval: [809, 824] }, null, [], ["seq", { sourceInterval: [809, 816] }, ["terminal", { sourceInterval: [809, 812] }, "~"], ["app", { sourceInterval: [813, 816] }, "Lex", []]]], Pred_lookahead: ["define", { sourceInterval: [831, 852] }, null, [], ["seq", { sourceInterval: [831, 838] }, ["terminal", { sourceInterval: [831, 834] }, "&"], ["app", { sourceInterval: [835, 838] }, "Lex", []]]], Pred: ["define", { sourceInterval: [798, 862] }, null, [], ["alt", { sourceInterval: [809, 862] }, ["app", { sourceInterval: [809, 816] }, "Pred_not", []], ["app", { sourceInterval: [831, 838] }, "Pred_lookahead", []], ["app", { sourceInterval: [859, 862] }, "Lex", []]]], Lex_lex: ["define", { sourceInterval: [876, 892] }, null, [], ["seq", { sourceInterval: [876, 884] }, ["terminal", { sourceInterval: [876, 879] }, "#"], ["app", { sourceInterval: [880, 884] }, "Base", []]]], Lex: ["define", { sourceInterval: [866, 903] }, null, [], ["alt", { sourceInterval: [876, 903] }, ["app", { sourceInterval: [876, 884] }, "Lex_lex", []], ["app", { sourceInterval: [899, 903] }, "Base", []]]], Base_application: ["define", { sourceInterval: [918, 979] }, null, [], ["seq", { sourceInterval: [918, 963] }, ["app", { sourceInterval: [918, 923] }, "ident", []], ["opt", { sourceInterval: [924, 931] }, ["app", { sourceInterval: [924, 930] }, "Params", []]], ["not", { sourceInterval: [932, 963] }, ["alt", { sourceInterval: [934, 962] }, ["seq", { sourceInterval: [934, 948] }, ["opt", { sourceInterval: [934, 944] }, ["app", { sourceInterval: [934, 943] }, "ruleDescr", []]], ["terminal", { sourceInterval: [945, 948] }, "="]], ["terminal", { sourceInterval: [951, 955] }, ":="], ["terminal", { sourceInterval: [958, 962] }, "+="]]]]], Base_range: ["define", { sourceInterval: [986, 1041] }, null, [], ["seq", { sourceInterval: [986, 1022] }, ["app", { sourceInterval: [986, 1001] }, "oneCharTerminal", []], ["terminal", { sourceInterval: [1002, 1006] }, ".."], ["app", { sourceInterval: [1007, 1022] }, "oneCharTerminal", []]]], Base_terminal: ["define", { sourceInterval: [1048, 1106] }, null, [], ["app", { sourceInterval: [1048, 1056] }, "terminal", []]], Base_paren: ["define", { sourceInterval: [1113, 1168] }, null, [], ["seq", { sourceInterval: [1113, 1124] }, ["terminal", { sourceInterval: [1113, 1116] }, "("], ["app", { sourceInterval: [1117, 1120] }, "Alt", []], ["terminal", { sourceInterval: [1121, 1124] }, ")"]]], Base: ["define", { sourceInterval: [907, 1168] }, null, [], ["alt", { sourceInterval: [918, 1168] }, ["app", { sourceInterval: [918, 963] }, "Base_application", []], ["app", { sourceInterval: [986, 1022] }, "Base_range", []], ["app", { sourceInterval: [1048, 1056] }, "Base_terminal", []], ["app", { sourceInterval: [1113, 1124] }, "Base_paren", []]]], ruleDescr: ["define", { sourceInterval: [1172, 1231] }, "a rule description", [], ["seq", { sourceInterval: [1210, 1231] }, ["terminal", { sourceInterval: [1210, 1213] }, "("], ["app", { sourceInterval: [1214, 1227] }, "ruleDescrText", []], ["terminal", { sourceInterval: [1228, 1231] }, ")"]]], ruleDescrText: ["define", { sourceInterval: [1235, 1266] }, null, [], ["star", { sourceInterval: [1255, 1266] }, ["seq", { sourceInterval: [1256, 1264] }, ["not", { sourceInterval: [1256, 1260] }, ["terminal", { sourceInterval: [1257, 1260] }, ")"]], ["app", { sourceInterval: [1261, 1264] }, "any", []]]]], caseName: ["define", { sourceInterval: [1270, 1338] }, null, [], ["seq", { sourceInterval: [1285, 1338] }, ["terminal", { sourceInterval: [1285, 1289] }, "--"], ["star", { sourceInterval: [1290, 1304] }, ["seq", { sourceInterval: [1291, 1302] }, ["not", { sourceInterval: [1291, 1296] }, ["terminal", { sourceInterval: [1292, 1296] }, `
`]], ["app", { sourceInterval: [1297, 1302] }, "space", []]]], ["app", { sourceInterval: [1305, 1309] }, "name", []], ["star", { sourceInterval: [1310, 1324] }, ["seq", { sourceInterval: [1311, 1322] }, ["not", { sourceInterval: [1311, 1316] }, ["terminal", { sourceInterval: [1312, 1316] }, `
`]], ["app", { sourceInterval: [1317, 1322] }, "space", []]]], ["alt", { sourceInterval: [1326, 1337] }, ["terminal", { sourceInterval: [1326, 1330] }, `
`], ["lookahead", { sourceInterval: [1333, 1337] }, ["terminal", { sourceInterval: [1334, 1337] }, "}"]]]]], name: ["define", { sourceInterval: [1342, 1382] }, "a name", [], ["seq", { sourceInterval: [1363, 1382] }, ["app", { sourceInterval: [1363, 1372] }, "nameFirst", []], ["star", { sourceInterval: [1373, 1382] }, ["app", { sourceInterval: [1373, 1381] }, "nameRest", []]]]], nameFirst: ["define", { sourceInterval: [1386, 1418] }, null, [], ["alt", { sourceInterval: [1402, 1418] }, ["terminal", { sourceInterval: [1402, 1405] }, "_"], ["app", { sourceInterval: [1412, 1418] }, "letter", []]]], nameRest: ["define", { sourceInterval: [1422, 1452] }, null, [], ["alt", { sourceInterval: [1437, 1452] }, ["terminal", { sourceInterval: [1437, 1440] }, "_"], ["app", { sourceInterval: [1447, 1452] }, "alnum", []]]], ident: ["define", { sourceInterval: [1456, 1489] }, "an identifier", [], ["app", { sourceInterval: [1485, 1489] }, "name", []]], terminal: ["define", { sourceInterval: [1493, 1531] }, null, [], ["seq", { sourceInterval: [1508, 1531] }, ["terminal", { sourceInterval: [1508, 1512] }, '"'], ["star", { sourceInterval: [1513, 1526] }, ["app", { sourceInterval: [1513, 1525] }, "terminalChar", []]], ["terminal", { sourceInterval: [1527, 1531] }, '"']]], oneCharTerminal: ["define", { sourceInterval: [1535, 1579] }, null, [], ["seq", { sourceInterval: [1557, 1579] }, ["terminal", { sourceInterval: [1557, 1561] }, '"'], ["app", { sourceInterval: [1562, 1574] }, "terminalChar", []], ["terminal", { sourceInterval: [1575, 1579] }, '"']]], terminalChar: ["define", { sourceInterval: [1583, 1660] }, null, [], ["alt", { sourceInterval: [1602, 1660] }, ["app", { sourceInterval: [1602, 1612] }, "escapeChar", []], ["seq", { sourceInterval: [1621, 1660] }, ["not", { sourceInterval: [1621, 1626] }, ["terminal", { sourceInterval: [1622, 1626] }, "\\"]], ["not", { sourceInterval: [1627, 1632] }, ["terminal", { sourceInterval: [1628, 1632] }, '"']], ["not", { sourceInterval: [1633, 1638] }, ["terminal", { sourceInterval: [1634, 1638] }, `
`]], ["range", { sourceInterval: [1639, 1660] }, "\0", "􏿿"]]]], escapeChar_backslash: ["define", { sourceInterval: [1703, 1758] }, null, [], ["terminal", { sourceInterval: [1703, 1709] }, "\\\\"]], escapeChar_doubleQuote: ["define", { sourceInterval: [1765, 1822] }, null, [], ["terminal", { sourceInterval: [1765, 1771] }, '\\"']], escapeChar_singleQuote: ["define", { sourceInterval: [1829, 1886] }, null, [], ["terminal", { sourceInterval: [1829, 1835] }, "\\'"]], escapeChar_backspace: ["define", { sourceInterval: [1893, 1948] }, null, [], ["terminal", { sourceInterval: [1893, 1898] }, "\\b"]], escapeChar_lineFeed: ["define", { sourceInterval: [1955, 2009] }, null, [], ["terminal", { sourceInterval: [1955, 1960] }, "\\n"]], escapeChar_carriageReturn: ["define", { sourceInterval: [2016, 2076] }, null, [], ["terminal", { sourceInterval: [2016, 2021] }, "\\r"]], escapeChar_tab: ["define", { sourceInterval: [2083, 2132] }, null, [], ["terminal", { sourceInterval: [2083, 2088] }, "\\t"]], escapeChar_unicodeCodePoint: ["define", { sourceInterval: [2139, 2243] }, null, [], ["seq", { sourceInterval: [2139, 2221] }, ["terminal", { sourceInterval: [2139, 2145] }, "\\u{"], ["app", { sourceInterval: [2146, 2154] }, "hexDigit", []], ["opt", { sourceInterval: [2155, 2164] }, ["app", { sourceInterval: [2155, 2163] }, "hexDigit", []]], ["opt", { sourceInterval: [2165, 2174] }, ["app", { sourceInterval: [2165, 2173] }, "hexDigit", []]], ["opt", { sourceInterval: [2188, 2197] }, ["app", { sourceInterval: [2188, 2196] }, "hexDigit", []]], ["opt", { sourceInterval: [2198, 2207] }, ["app", { sourceInterval: [2198, 2206] }, "hexDigit", []]], ["opt", { sourceInterval: [2208, 2217] }, ["app", { sourceInterval: [2208, 2216] }, "hexDigit", []]], ["terminal", { sourceInterval: [2218, 2221] }, "}"]]], escapeChar_unicodeEscape: ["define", { sourceInterval: [2250, 2309] }, null, [], ["seq", { sourceInterval: [2250, 2291] }, ["terminal", { sourceInterval: [2250, 2255] }, "\\u"], ["app", { sourceInterval: [2256, 2264] }, "hexDigit", []], ["app", { sourceInterval: [2265, 2273] }, "hexDigit", []], ["app", { sourceInterval: [2274, 2282] }, "hexDigit", []], ["app", { sourceInterval: [2283, 2291] }, "hexDigit", []]]], escapeChar_hexEscape: ["define", { sourceInterval: [2316, 2371] }, null, [], ["seq", { sourceInterval: [2316, 2339] }, ["terminal", { sourceInterval: [2316, 2321] }, "\\x"], ["app", { sourceInterval: [2322, 2330] }, "hexDigit", []], ["app", { sourceInterval: [2331, 2339] }, "hexDigit", []]]], escapeChar: ["define", { sourceInterval: [1664, 2371] }, "an escape sequence", [], ["alt", { sourceInterval: [1703, 2371] }, ["app", { sourceInterval: [1703, 1709] }, "escapeChar_backslash", []], ["app", { sourceInterval: [1765, 1771] }, "escapeChar_doubleQuote", []], ["app", { sourceInterval: [1829, 1835] }, "escapeChar_singleQuote", []], ["app", { sourceInterval: [1893, 1898] }, "escapeChar_backspace", []], ["app", { sourceInterval: [1955, 1960] }, "escapeChar_lineFeed", []], ["app", { sourceInterval: [2016, 2021] }, "escapeChar_carriageReturn", []], ["app", { sourceInterval: [2083, 2088] }, "escapeChar_tab", []], ["app", { sourceInterval: [2139, 2221] }, "escapeChar_unicodeCodePoint", []], ["app", { sourceInterval: [2250, 2291] }, "escapeChar_unicodeEscape", []], ["app", { sourceInterval: [2316, 2339] }, "escapeChar_hexEscape", []]]], space: ["extend", { sourceInterval: [2375, 2394] }, null, [], ["app", { sourceInterval: [2387, 2394] }, "comment", []]], comment_singleLine: ["define", { sourceInterval: [2412, 2458] }, null, [], ["seq", { sourceInterval: [2412, 2443] }, ["terminal", { sourceInterval: [2412, 2416] }, "//"], ["star", { sourceInterval: [2417, 2429] }, ["seq", { sourceInterval: [2418, 2427] }, ["not", { sourceInterval: [2418, 2423] }, ["terminal", { sourceInterval: [2419, 2423] }, `
`]], ["app", { sourceInterval: [2424, 2427] }, "any", []]]], ["lookahead", { sourceInterval: [2430, 2443] }, ["alt", { sourceInterval: [2432, 2442] }, ["terminal", { sourceInterval: [2432, 2436] }, `
`], ["app", { sourceInterval: [2439, 2442] }, "end", []]]]]], comment_multiLine: ["define", { sourceInterval: [2465, 2501] }, null, [], ["seq", { sourceInterval: [2465, 2487] }, ["terminal", { sourceInterval: [2465, 2469] }, "/*"], ["star", { sourceInterval: [2470, 2482] }, ["seq", { sourceInterval: [2471, 2480] }, ["not", { sourceInterval: [2471, 2476] }, ["terminal", { sourceInterval: [2472, 2476] }, "*/"]], ["app", { sourceInterval: [2477, 2480] }, "any", []]]], ["terminal", { sourceInterval: [2483, 2487] }, "*/"]]], comment: ["define", { sourceInterval: [2398, 2501] }, null, [], ["alt", { sourceInterval: [2412, 2501] }, ["app", { sourceInterval: [2412, 2443] }, "comment_singleLine", []], ["app", { sourceInterval: [2465, 2487] }, "comment_multiLine", []]]], tokens: ["define", { sourceInterval: [2505, 2520] }, null, [], ["star", { sourceInterval: [2514, 2520] }, ["app", { sourceInterval: [2514, 2519] }, "token", []]]], token: ["define", { sourceInterval: [2524, 2600] }, null, [], ["alt", { sourceInterval: [2532, 2600] }, ["app", { sourceInterval: [2532, 2540] }, "caseName", []], ["app", { sourceInterval: [2543, 2550] }, "comment", []], ["app", { sourceInterval: [2553, 2558] }, "ident", []], ["app", { sourceInterval: [2561, 2569] }, "operator", []], ["app", { sourceInterval: [2572, 2583] }, "punctuation", []], ["app", { sourceInterval: [2586, 2594] }, "terminal", []], ["app", { sourceInterval: [2597, 2600] }, "any", []]]], operator: ["define", { sourceInterval: [2604, 2669] }, null, [], ["alt", { sourceInterval: [2615, 2669] }, ["terminal", { sourceInterval: [2615, 2619] }, "<:"], ["terminal", { sourceInterval: [2622, 2625] }, "="], ["terminal", { sourceInterval: [2628, 2632] }, ":="], ["terminal", { sourceInterval: [2635, 2639] }, "+="], ["terminal", { sourceInterval: [2642, 2645] }, "*"], ["terminal", { sourceInterval: [2648, 2651] }, "+"], ["terminal", { sourceInterval: [2654, 2657] }, "?"], ["terminal", { sourceInterval: [2660, 2663] }, "~"], ["terminal", { sourceInterval: [2666, 2669] }, "&"]]], punctuation: ["define", { sourceInterval: [2673, 2709] }, null, [], ["alt", { sourceInterval: [2687, 2709] }, ["terminal", { sourceInterval: [2687, 2690] }, "<"], ["terminal", { sourceInterval: [2693, 2696] }, ">"], ["terminal", { sourceInterval: [2699, 2702] }, ","], ["terminal", { sourceInterval: [2705, 2709] }, "--"]]] }]), Rc = Object.create(Ge.prototype);
function av(n, e) {
  for (const t in n)
    if (t === e) return !0;
  return !1;
}
function nI(n, e, t) {
  const r = new za();
  let i, o, a, l = !1;
  return (t || f0).createSemantics().addOperation("visit", {
    Grammars(m) {
      return m.children.map((w) => w.visit());
    },
    Grammar(m, w, x, k, D) {
      const K = m.visit();
      i = r.newGrammar(K), w.child(0) && w.child(0).visit(), k.children.map((M) => M.visit());
      const C = i.build();
      if (C.source = this.source.trimmed(), av(e, K))
        throw w1(C);
      return e[K] = C, C;
    },
    SuperGrammar(m, w) {
      const x = w.visit();
      if (x === "null")
        i.withSuperGrammar(null);
      else {
        if (!e || !av(e, x))
          throw _1(x, e, w.source);
        i.withSuperGrammar(e[x]);
      }
    },
    Rule_define(m, w, x, k, D) {
      o = m.visit(), a = w.children.map((J) => J.visit())[0] || [], !i.defaultStartRule && i.ensureSuperGrammar() !== mr.ProtoBuiltInRules && i.withDefaultStartRule(o);
      const K = D.visit(), C = x.children.map((J) => J.visit())[0], M = this.source.trimmed();
      return i.define(o, a, K, C, M);
    },
    Rule_override(m, w, x, k) {
      o = m.visit(), a = w.children.map((C) => C.visit())[0] || [];
      const D = this.source.trimmed();
      i.ensureSuperGrammarRuleForOverriding(o, D), l = !0;
      const K = k.visit();
      return l = !1, i.override(o, a, K, null, D);
    },
    Rule_extend(m, w, x, k) {
      o = m.visit(), a = w.children.map((C) => C.visit())[0] || [];
      const D = k.visit(), K = this.source.trimmed();
      return i.extend(o, a, D, null, K);
    },
    RuleBody(m, w) {
      return r.alt(...w.visit()).withSource(this.source);
    },
    OverrideRuleBody(m, w) {
      const x = w.visit(), k = x.indexOf(Rc);
      if (k >= 0) {
        const D = x.slice(0, k), K = x.slice(k + 1);
        return K.forEach((C) => {
          if (C === Rc) throw N1(C);
        }), new uu(
          i.superGrammar,
          o,
          D,
          K
        ).withSource(this.source);
      } else
        return r.alt(...x).withSource(this.source);
    },
    Formals(m, w, x) {
      return w.visit();
    },
    Params(m, w, x) {
      return w.visit();
    },
    Alt(m) {
      return r.alt(...m.visit()).withSource(this.source);
    },
    TopLevelTerm_inline(m, w) {
      const x = o + "_" + w.visit(), k = m.visit(), D = this.source.trimmed(), K = !(i.superGrammar && i.superGrammar.rules[x]);
      l && !K ? i.override(x, a, k, null, D) : i.define(x, a, k, null, D);
      const C = a.map((M) => r.app(M));
      return r.app(x, C).withSource(k.source);
    },
    OverrideTopLevelTerm_superSplice(m) {
      return Rc;
    },
    Seq(m) {
      return r.seq(...m.children.map((w) => w.visit())).withSource(this.source);
    },
    Iter_star(m, w) {
      return r.star(m.visit()).withSource(this.source);
    },
    Iter_plus(m, w) {
      return r.plus(m.visit()).withSource(this.source);
    },
    Iter_opt(m, w) {
      return r.opt(m.visit()).withSource(this.source);
    },
    Pred_not(m, w) {
      return r.not(w.visit()).withSource(this.source);
    },
    Pred_lookahead(m, w) {
      return r.lookahead(w.visit()).withSource(this.source);
    },
    Lex_lex(m, w) {
      return r.lex(w.visit()).withSource(this.source);
    },
    Base_application(m, w) {
      const x = w.children.map((k) => k.visit())[0] || [];
      return r.app(m.visit(), x).withSource(this.source);
    },
    Base_range(m, w, x) {
      return r.range(m.visit(), x.visit()).withSource(this.source);
    },
    Base_terminal(m) {
      return r.terminal(m.visit()).withSource(this.source);
    },
    Base_paren(m, w, x) {
      return w.visit();
    },
    ruleDescr(m, w, x) {
      return w.visit();
    },
    ruleDescrText(m) {
      return this.sourceString.trim();
    },
    caseName(m, w, x, k, D) {
      return x.visit();
    },
    name(m, w) {
      return this.sourceString;
    },
    nameFirst(m) {
    },
    nameRest(m) {
    },
    terminal(m, w, x) {
      return w.children.map((k) => k.visit()).join("");
    },
    oneCharTerminal(m, w, x) {
      return w.visit();
    },
    escapeChar(m) {
      try {
        return Jg(this.sourceString);
      } catch (w) {
        throw w instanceof RangeError && w.message.startsWith("Invalid code point ") ? P1(m) : w;
      }
    },
    NonemptyListOf(m, w, x) {
      return [m.visit()].concat(x.children.map((k) => k.visit()));
    },
    EmptyListOf() {
      return [];
    },
    _terminal() {
      return this.sourceString;
    }
  })(n).visit();
}
const iI = cu(["grammar", { source: `OperationsAndAttributes {

  AttributeSignature =
    name

  OperationSignature =
    name Formals?

  Formals
    = "(" ListOf<name, ","> ")"

  name  (a name)
    = nameFirst nameRest*

  nameFirst
    = "_"
    | letter

  nameRest
    = "_"
    | alnum

}` }, "OperationsAndAttributes", null, "AttributeSignature", { AttributeSignature: ["define", { sourceInterval: [29, 58] }, null, [], ["app", { sourceInterval: [54, 58] }, "name", []]], OperationSignature: ["define", { sourceInterval: [62, 100] }, null, [], ["seq", { sourceInterval: [87, 100] }, ["app", { sourceInterval: [87, 91] }, "name", []], ["opt", { sourceInterval: [92, 100] }, ["app", { sourceInterval: [92, 99] }, "Formals", []]]]], Formals: ["define", { sourceInterval: [104, 143] }, null, [], ["seq", { sourceInterval: [118, 143] }, ["terminal", { sourceInterval: [118, 121] }, "("], ["app", { sourceInterval: [122, 139] }, "ListOf", [["app", { sourceInterval: [129, 133] }, "name", []], ["terminal", { sourceInterval: [135, 138] }, ","]]], ["terminal", { sourceInterval: [140, 143] }, ")"]]], name: ["define", { sourceInterval: [147, 187] }, "a name", [], ["seq", { sourceInterval: [168, 187] }, ["app", { sourceInterval: [168, 177] }, "nameFirst", []], ["star", { sourceInterval: [178, 187] }, ["app", { sourceInterval: [178, 186] }, "nameRest", []]]]], nameFirst: ["define", { sourceInterval: [191, 223] }, null, [], ["alt", { sourceInterval: [207, 223] }, ["terminal", { sourceInterval: [207, 210] }, "_"], ["app", { sourceInterval: [217, 223] }, "letter", []]]], nameRest: ["define", { sourceInterval: [227, 257] }, null, [], ["alt", { sourceInterval: [242, 257] }, ["terminal", { sourceInterval: [242, 245] }, "_"], ["app", { sourceInterval: [252, 257] }, "alnum", []]]] }]);
sI(mr.BuiltInRules);
oI(iI);
function sI(n) {
  const e = {
    empty() {
      return this.iteration();
    },
    nonEmpty(t, r, i) {
      return this.iteration([t].concat(i.children));
    },
    self(...t) {
      return this;
    }
  };
  Ar.BuiltInSemantics = Ar.createSemantics(n, null).addOperation(
    "asIteration",
    {
      emptyListOf: e.empty,
      nonemptyListOf: e.nonEmpty,
      EmptyListOf: e.empty,
      NonemptyListOf: e.nonEmpty,
      _iter: e.self
    }
  );
}
function oI(n) {
  Ar.prototypeGrammarSemantics = n.createSemantics().addOperation("parse", {
    AttributeSignature(e) {
      return {
        name: e.parse(),
        formals: []
      };
    },
    OperationSignature(e, t) {
      return {
        name: e.parse(),
        formals: t.children.map((r) => r.parse())[0] || []
      };
    },
    Formals(e, t, r) {
      return t.asIteration().children.map((i) => i.parse());
    },
    name(e, t) {
      return this.sourceString;
    }
  }), Ar.prototypeGrammar = n;
}
function aI(n) {
  let e = 0;
  const t = [0], r = () => t[t.length - 1], i = {}, o = /( *).*(?:$|\r?\n|\r)/g;
  let a;
  for (; (a = o.exec(n)) != null; ) {
    const [l, c] = a;
    if (l.length === 0) break;
    const b = c.length, m = r(), w = e + b;
    if (b > m)
      t.push(b), i[w] = 1;
    else if (b < m) {
      const x = t.length;
      for (; r() !== b; )
        t.pop();
      i[w] = -1 * (x - t.length);
    }
    e += l.length;
  }
  return t.length > 1 && (i[e] = 1 - t.length), i;
}
const h0 = "an indented block", p0 = "a dedent", uv = 1114112;
class uI extends lu {
  constructor(e) {
    super(e.input), this.state = e;
  }
  _indentationAt(e) {
    return this.state.userData[e] || 0;
  }
  atEnd() {
    return super.atEnd() && this._indentationAt(this.pos) === 0;
  }
  next() {
    if (this._indentationAt(this.pos) !== 0) {
      this.examinedLength = Math.max(this.examinedLength, this.pos);
      return;
    }
    return super.next();
  }
  nextCharCode() {
    return this._indentationAt(this.pos) !== 0 ? (this.examinedLength = Math.max(this.examinedLength, this.pos), uv) : super.nextCharCode();
  }
  nextCodePoint() {
    return this._indentationAt(this.pos) !== 0 ? (this.examinedLength = Math.max(this.examinedLength, this.pos), uv) : super.nextCodePoint();
  }
}
class lv extends Ge {
  constructor(e = !0) {
    super(), this.isIndent = e;
  }
  allowsSkippingPrecedingSpace() {
    return !0;
  }
  eval(e) {
    const { inputStream: t } = e, r = e.userData;
    e.doNotMemoize = !0;
    const i = t.pos, o = this.isIndent ? 1 : -1;
    return (r[i] || 0) * o > 0 ? (e.userData = Object.create(r), e.userData[i] -= o, e.pushBinding(new bs(0), i), !0) : (e.processFailure(i, this), !1);
  }
  getArity() {
    return 1;
  }
  _assertAllApplicationsAreValid(e, t) {
  }
  _isNullable(e, t) {
    return !1;
  }
  assertChoicesHaveUniformArity(e) {
  }
  assertIteratedExprsAreNotNullable(e) {
  }
  introduceParams(e) {
    return this;
  }
  substituteParams(e) {
    return this;
  }
  toString() {
    return this.isIndent ? "indent" : "dedent";
  }
  toDisplayString() {
    return this.toString();
  }
  toFailure(e) {
    const t = this.isIndent ? h0 : p0;
    return new Or(this, t, "description");
  }
}
const lI = new mt("indent"), cI = new mt("dedent"), fI = new uu(rh, "any", [lI, cI], []), hI = new za().newGrammar("IndentationSensitive").withSuperGrammar(rh).define("indent", [], new lv(!0), h0, void 0, !0).define("dedent", [], new lv(!1), p0, void 0, !0).extend("any", [], fI, "any character", void 0).build();
Object.assign(hI, {
  _matchStateInitializer(n) {
    n.userData = aI(n.input), n.inputStream = new uI(n);
  },
  supportsIncrementalParsing: !1
});
mr.initApplicationParser(f0, nI);
const d0 = cu(["grammar", { source: `N1QL {

//---- SELECT:

    SelectStatement
        = kSELECT (kDISTINCT | kALL)?
          SelectResults
          FromClause?
          (kWHERE Expression)?
          (GroupBy Having?)?
          OrderBy?
          LimitOffset?
          ";"?

    SelectResults
        = NonemptyListOf<SelectResult, ",">

    SelectResult
        = Expression (kAS? columnAlias)?

    GroupBy (a GROUP BY clause)
        = kGROUP kBY NonemptyListOf<Expression, ",">

    Having (a HAVING clause)
        = kHAVING Expression

    OrderBy (an ORDER BY clause)
        = kORDER kBY NonemptyListOf<Ordering, ",">

    Ordering
        = Expression (kASC | kDESC)?

    LimitOffset (a LIMIT or OFFSET clause)
        = kLIMIT Expression (kOFFSET Expression)?		-- limitFirst
        | kOFFSET Expression (kLIMIT Expression)?		-- offsetFirst


//---- FROM, JOIN, UNNEST:

    FromClause (a FROM clause)
        = kFROM CollectionSource JoinOrUnnest*

    CollectionSource  (a collection name)
        = ident ("." ident)? (kAS? collectionAlias)?

    JoinOrUnnest = Join | Unnest

    Join (a JOIN clause)
        = JoinType? kJOIN CollectionSource kON Expression

    JoinType (a JOIN type)
        = kINNER          -- inner
        | kRIGHT? kOUTER  -- outer
        | kLEFT kOUTER?   -- left
        | kCROSS          -- cross

    Unnest (an UNNEST clause)
        = kUNNEST Expression (kAS? columnAlias)?


//---- Expressions (lowest to highest precedence):

    Expression (an expression)
        = OrExp

    OrExp
        = OrExp kOR AndExp				-- or
        | AndExp

    AndExp
        = AndExp kAND EqExp				-- and
        | EqExp

    EqExp
        = EqExp ("==" | "=") RelExp                 -- eq
        | EqExp ("<>" | "!=") RelExp                -- neq
        | EqExp kIS kNOT? kVALUED                   -- isValued
        | EqExp kIS kNOT RelExp                     -- isNot
        | EqExp kIS RelExp                          -- is
        | EqExp kLIKE RelExp			            -- like
        | EqExp kNOT kLIKE RelExp			        -- notLike
        | EqExp kNOT kNULL                          -- notNull
//      | EqExp InOrNot "(" SelectStatement ")"     -- inSelect     // not supported in LiteCore
        | EqExp InOrNot ArrayLiteral                -- inArray
        | EqExp InOrNot RelExp                      -- inExpr
        | EqExp kNOT? kBETWEEN RelExp kAND RelExp   -- between
        | RelExp

    RelExp
        = RelExp ("<=" | "<" | ">=" | ">") BitExp	-- rel
        | BitExp

    BitExp
        = BitExp ("<<" | ">>" | "&" | "|") AddExp	-- bit
        | AddExp

    AddExp
        = AddExp "+" MulExp  	-- plus
        | AddExp "-" MulExp  	-- minus
        | MulExp

    MulExp
        = MulExp "*" ConcatExp  -- times
        | MulExp "/" ConcatExp  -- divide
        | MulExp "%" ConcatExp	-- modulo
        | ConcatExp

    ConcatExp
        = PrimaryExp "||" ConcatExp -- concat
        | PrimaryExp

    AnyEveryExp
        = AnyEvery variableName kIN Expression kSATISFIES Expression kEND
    AnyEvery
        = AnyOrSome kAND kEVERY     --anyEvery
        | AnyOrSome                 --any
        | kEVERY                    --every
    AnyOrSome = kANY | kSOME

    CaseExp
        = kCASE (~kWHEN Expression)?
          WhenThen+
          (kELSE Expression)?
          kEND
    WhenThen
        = kWHEN Expression kTHEN Expression

    PrimaryExp
        = "(" Expression ")"  	            -- paren
        | "+" PrimaryExp   		            -- pos
        | "-" PrimaryExp   		            -- neg
        | kNOT PrimaryExp	 	            -- not
        | kEXISTS "(" SelectStatement ")"   --exists
        | literal
        | ArrayLiteral
        | DictLiteral
        | Function
        | AnyEveryExp
        | CaseExp
        | parameter
        | variable
        | Property


    ArrayLiteral = "[" ArgList "]"

    DictLiteral	 = "{" ListOf<KV, ","> "}"
    KV			 = stringLiteral ":" Expression

    InOrNot      = kNOT? kIN

//---- Properties:

    Property (a document property)
        = "*"						-- all
        | collectionAlias "." "*"	-- allInCollection
        | PropertyPath				-- path

    PropertyPath
        = propertyName PropertyPathContinuation*

    PropertyPathContinuation
        = "." propertyName  		-- named
        | "[" wholeNumber "]"		-- indexed


//---- Functions:

    Function (a function call)
        = MetaFunction | N1QLFunction

    MetaFunction
        = iMETA "(" collectionAlias? ")" ~"."       -- plain
        | iMETA "(" collectionAlias? ")" "." ident  -- property

    N1QLFunction
        = functionName "(" ArgList ")"

    ArgList
        = ListOf<Expression, ",">


//---- Higher level lexical stuff:

    collectionAlias (a collection alias) = ident
    columnAlias     (a column alias)     = ident
    functionName    (a function name)    = ident
    propertyName    (a property name)    = ident
    variableName    (a variable name)    = ident

    parameter       (a parameter)        = "$" ident
    variable        (a variable)         = "?" ident

    literal (a literal)
        = number
        | stringLiteral
        | kTRUE         -- true
        | kFALSE        -- false
        | kNULL         -- null
        | kMISSING      -- missing


//---- Keywords and Identifiers:

    ident  (an identifier)
        = ~keyword identifierStart identifierPart*  -- unquoted
        | backQuote (~backQuote any)* backQuote     -- quoted            //TODO: Escapes

    iMETA	 	= caseInsensitive<"META">       ~identifierPart
    iID	 	    = caseInsensitive<"ID">         ~identifierPart
    iSEQUENCE 	= caseInsensitive<"SEQUENCE">   ~identifierPart
    iDELETED 	= caseInsensitive<"DELETED">    ~identifierPart
    iEXPIRATION	= caseInsensitive<"EXPIRATION"> ~identifierPart

    keyword
        = kALL | kAND | kANY | kARRAY | kAS | kASC | kBETWEEN | kBY | kCASE | kCROSS | kDESC
        | kDISTINCT | kEND | kELSE | kEVERY | kEXISTS | kFALSE | kFROM | kGROUP | kHAVING | kIN
        | kINNER | kIS | kJOIN | kLEFT | kLIKE | kLIMIT | kMISSING | kNOT | kNULL | kOFFSET
        | kON | kOR | kORDER | kOUTER | kRIGHT | kSATISFIES | kSELECT | kSOME | kTHEN | kTRUE
        | kUNNEST | kVALUED | kWHEN | kWHERE

    kALL 		= caseInsensitive<"ALL">        ~identifierPart
    kAND 		= caseInsensitive<"AND">        ~identifierPart
    kANY 		= caseInsensitive<"ANY">        ~identifierPart
    kARRAY 		= caseInsensitive<"ARRAY">      ~identifierPart
    kAS			= caseInsensitive<"AS">         ~identifierPart
    kASC		= caseInsensitive<"ASC">        ~identifierPart
    kBETWEEN	= caseInsensitive<"BETWEEN">    ~identifierPart
    kBY			= caseInsensitive<"BY">         ~identifierPart
    kCASE		= caseInsensitive<"CASE">       ~identifierPart
    kCROSS		= caseInsensitive<"CROSS">      ~identifierPart
    kDESC		= caseInsensitive<"DESC">       ~identifierPart
    kDISTINCT	= caseInsensitive<"DISTINCT">   ~identifierPart
    kELSE		= caseInsensitive<"ELSE">       ~identifierPart
    kEND		= caseInsensitive<"END">        ~identifierPart
    kEVERY		= caseInsensitive<"EVERY">      ~identifierPart
    kEXISTS		= caseInsensitive<"EXISTS">     ~identifierPart
    kFALSE		= caseInsensitive<"FALSE">      ~identifierPart
    kFROM 		= caseInsensitive<"FROM">       ~identifierPart
    kGROUP 		= caseInsensitive<"GROUP">      ~identifierPart
    kHAVING		= caseInsensitive<"HAVING">     ~identifierPart
    kIN			= caseInsensitive<"IN">         ~identifierPart
    kINNER	    = caseInsensitive<"INNER">      ~identifierPart
    kIS			= caseInsensitive<"IS">         ~identifierPart
    kJOIN	 	= caseInsensitive<"JOIN">       ~identifierPart
    kLEFT	 	= caseInsensitive<"LEFT">       ~identifierPart
    kLIKE	 	= caseInsensitive<"LIKE">       ~identifierPart
    kLIMIT	 	= caseInsensitive<"LIMIT">      ~identifierPart
    kMISSING 	= caseInsensitive<"MISSING">    ~identifierPart
    kNOT	 	= caseInsensitive<"NOT">        ~identifierPart
    kNULL	 	= caseInsensitive<"NULL">       ~identifierPart
    kOFFSET	 	= caseInsensitive<"OFFSET">     ~identifierPart
    kON	 	    = caseInsensitive<"ON">         ~identifierPart
    kOR		 	= caseInsensitive<"OR">         ~identifierPart
    kORDER	 	= caseInsensitive<"ORDER">      ~identifierPart
    kOUTER	 	= caseInsensitive<"OUTER">      ~identifierPart
    kRIGHT	 	= caseInsensitive<"RIGHT">      ~identifierPart
    kSATISFIES 	= caseInsensitive<"SATISFIES">  ~identifierPart
    kSELECT 	= caseInsensitive<"SELECT">     ~identifierPart
    kSOME    	= caseInsensitive<"SOME">       ~identifierPart
    kTHEN    	= caseInsensitive<"THEN">       ~identifierPart
    kTRUE	 	= caseInsensitive<"TRUE">       ~identifierPart
    kUNNEST     = caseInsensitive<"UNNEST">     ~identifierPart
    kVALUED     = caseInsensitive<"VALUED">     ~identifierPart
    kWHEN	 	= caseInsensitive<"WHEN">       ~identifierPart
    kWHERE	 	= caseInsensitive<"WHERE">      ~identifierPart


//---- Basic lexical stuff:

    number  (a number)
          = digit* "." digit+ (caseInsensitive<"e"> ("+" | "-")? digit+)?  -- real
          | wholeNumber        -- whole            //TODO: Hex

    wholeNumber  (a whole number)  = digit+

    identifierStart = letter | "_"
    identifierPart  = identifierStart | digit

    stringLiteral (a string literal)            //TODO: Escapes
        = "\\"" (~"\\"" any)* "\\""
        | "'"  (~"'"  any)* "'"

    backQuote = "\\u{60}"
}` }, "N1QL", null, "SelectStatement", { SelectStatement: ["define", { sourceInterval: [28, 244] }, null, [], ["seq", { sourceInterval: [54, 244] }, ["app", { sourceInterval: [54, 61] }, "kSELECT", []], ["opt", { sourceInterval: [62, 81] }, ["alt", { sourceInterval: [63, 79] }, ["app", { sourceInterval: [63, 72] }, "kDISTINCT", []], ["app", { sourceInterval: [75, 79] }, "kALL", []]]], ["app", { sourceInterval: [92, 105] }, "SelectResults", []], ["opt", { sourceInterval: [116, 127] }, ["app", { sourceInterval: [116, 126] }, "FromClause", []]], ["opt", { sourceInterval: [138, 158] }, ["seq", { sourceInterval: [139, 156] }, ["app", { sourceInterval: [139, 145] }, "kWHERE", []], ["app", { sourceInterval: [146, 156] }, "Expression", []]]], ["opt", { sourceInterval: [169, 187] }, ["seq", { sourceInterval: [170, 185] }, ["app", { sourceInterval: [170, 177] }, "GroupBy", []], ["opt", { sourceInterval: [178, 185] }, ["app", { sourceInterval: [178, 184] }, "Having", []]]]], ["opt", { sourceInterval: [198, 206] }, ["app", { sourceInterval: [198, 205] }, "OrderBy", []]], ["opt", { sourceInterval: [217, 229] }, ["app", { sourceInterval: [217, 228] }, "LimitOffset", []]], ["opt", { sourceInterval: [240, 244] }, ["terminal", { sourceInterval: [240, 243] }, ";"]]]], SelectResults: ["define", { sourceInterval: [250, 307] }, null, [], ["app", { sourceInterval: [274, 307] }, "NonemptyListOf", [["app", { sourceInterval: [289, 301] }, "SelectResult", []], ["terminal", { sourceInterval: [303, 306] }, ","]]]], SelectResult: ["define", { sourceInterval: [313, 366] }, null, [], ["seq", { sourceInterval: [336, 366] }, ["app", { sourceInterval: [336, 346] }, "Expression", []], ["opt", { sourceInterval: [347, 366] }, ["seq", { sourceInterval: [348, 364] }, ["opt", { sourceInterval: [348, 352] }, ["app", { sourceInterval: [348, 351] }, "kAS", []]], ["app", { sourceInterval: [353, 364] }, "columnAlias", []]]]]], GroupBy: ["define", { sourceInterval: [372, 452] }, "a GROUP BY clause", [], ["seq", { sourceInterval: [410, 452] }, ["app", { sourceInterval: [410, 416] }, "kGROUP", []], ["app", { sourceInterval: [417, 420] }, "kBY", []], ["app", { sourceInterval: [421, 452] }, "NonemptyListOf", [["app", { sourceInterval: [436, 446] }, "Expression", []], ["terminal", { sourceInterval: [448, 451] }, ","]]]]], Having: ["define", { sourceInterval: [458, 511] }, "a HAVING clause", [], ["seq", { sourceInterval: [493, 511] }, ["app", { sourceInterval: [493, 500] }, "kHAVING", []], ["app", { sourceInterval: [501, 511] }, "Expression", []]]], OrderBy: ["define", { sourceInterval: [517, 596] }, "an ORDER BY clause", [], ["seq", { sourceInterval: [556, 596] }, ["app", { sourceInterval: [556, 562] }, "kORDER", []], ["app", { sourceInterval: [563, 566] }, "kBY", []], ["app", { sourceInterval: [567, 596] }, "NonemptyListOf", [["app", { sourceInterval: [582, 590] }, "Ordering", []], ["terminal", { sourceInterval: [592, 595] }, ","]]]]], Ordering: ["define", { sourceInterval: [602, 647] }, null, [], ["seq", { sourceInterval: [621, 647] }, ["app", { sourceInterval: [621, 631] }, "Expression", []], ["opt", { sourceInterval: [632, 647] }, ["alt", { sourceInterval: [633, 645] }, ["app", { sourceInterval: [633, 637] }, "kASC", []], ["app", { sourceInterval: [640, 645] }, "kDESC", []]]]]], LimitOffset_limitFirst: ["define", { sourceInterval: [702, 756] }, null, [], ["seq", { sourceInterval: [702, 741] }, ["app", { sourceInterval: [702, 708] }, "kLIMIT", []], ["app", { sourceInterval: [709, 719] }, "Expression", []], ["opt", { sourceInterval: [720, 741] }, ["seq", { sourceInterval: [721, 739] }, ["app", { sourceInterval: [721, 728] }, "kOFFSET", []], ["app", { sourceInterval: [729, 739] }, "Expression", []]]]]], LimitOffset_offsetFirst: ["define", { sourceInterval: [767, 822] }, null, [], ["seq", { sourceInterval: [767, 806] }, ["app", { sourceInterval: [767, 774] }, "kOFFSET", []], ["app", { sourceInterval: [775, 785] }, "Expression", []], ["opt", { sourceInterval: [786, 806] }, ["seq", { sourceInterval: [787, 804] }, ["app", { sourceInterval: [787, 793] }, "kLIMIT", []], ["app", { sourceInterval: [794, 804] }, "Expression", []]]]]], LimitOffset: ["define", { sourceInterval: [653, 822] }, "a LIMIT or OFFSET clause", [], ["alt", { sourceInterval: [702, 822] }, ["app", { sourceInterval: [702, 741] }, "LimitOffset_limitFirst", []], ["app", { sourceInterval: [767, 806] }, "LimitOffset_offsetFirst", []]]], FromClause: ["define", { sourceInterval: [857, 930] }, "a FROM clause", [], ["seq", { sourceInterval: [894, 930] }, ["app", { sourceInterval: [894, 899] }, "kFROM", []], ["app", { sourceInterval: [900, 916] }, "CollectionSource", []], ["star", { sourceInterval: [917, 930] }, ["app", { sourceInterval: [917, 929] }, "JoinOrUnnest", []]]]], CollectionSource: ["define", { sourceInterval: [936, 1026] }, "a collection name", [], ["seq", { sourceInterval: [984, 1026] }, ["app", { sourceInterval: [984, 989] }, "ident", []], ["opt", { sourceInterval: [990, 1002] }, ["seq", { sourceInterval: [991, 1e3] }, ["terminal", { sourceInterval: [991, 994] }, "."], ["app", { sourceInterval: [995, 1e3] }, "ident", []]]], ["opt", { sourceInterval: [1003, 1026] }, ["seq", { sourceInterval: [1004, 1024] }, ["opt", { sourceInterval: [1004, 1008] }, ["app", { sourceInterval: [1004, 1007] }, "kAS", []]], ["app", { sourceInterval: [1009, 1024] }, "collectionAlias", []]]]]], JoinOrUnnest: ["define", { sourceInterval: [1032, 1060] }, null, [], ["alt", { sourceInterval: [1047, 1060] }, ["app", { sourceInterval: [1047, 1051] }, "Join", []], ["app", { sourceInterval: [1054, 1060] }, "Unnest", []]]], Join: ["define", { sourceInterval: [1066, 1144] }, "a JOIN clause", [], ["seq", { sourceInterval: [1097, 1144] }, ["opt", { sourceInterval: [1097, 1106] }, ["app", { sourceInterval: [1097, 1105] }, "JoinType", []]], ["app", { sourceInterval: [1107, 1112] }, "kJOIN", []], ["app", { sourceInterval: [1113, 1129] }, "CollectionSource", []], ["app", { sourceInterval: [1130, 1133] }, "kON", []], ["app", { sourceInterval: [1134, 1144] }, "Expression", []]]], JoinType_inner: ["define", { sourceInterval: [1183, 1207] }, null, [], ["app", { sourceInterval: [1183, 1189] }, "kINNER", []]], JoinType_outer: ["define", { sourceInterval: [1218, 1242] }, null, [], ["seq", { sourceInterval: [1218, 1232] }, ["opt", { sourceInterval: [1218, 1225] }, ["app", { sourceInterval: [1218, 1224] }, "kRIGHT", []]], ["app", { sourceInterval: [1226, 1232] }, "kOUTER", []]]], JoinType_left: ["define", { sourceInterval: [1253, 1276] }, null, [], ["seq", { sourceInterval: [1253, 1266] }, ["app", { sourceInterval: [1253, 1258] }, "kLEFT", []], ["opt", { sourceInterval: [1259, 1266] }, ["app", { sourceInterval: [1259, 1265] }, "kOUTER", []]]]], JoinType_cross: ["define", { sourceInterval: [1287, 1311] }, null, [], ["app", { sourceInterval: [1287, 1293] }, "kCROSS", []]], JoinType: ["define", { sourceInterval: [1150, 1311] }, "a JOIN type", [], ["alt", { sourceInterval: [1183, 1311] }, ["app", { sourceInterval: [1183, 1189] }, "JoinType_inner", []], ["app", { sourceInterval: [1218, 1232] }, "JoinType_outer", []], ["app", { sourceInterval: [1253, 1266] }, "JoinType_left", []], ["app", { sourceInterval: [1287, 1293] }, "JoinType_cross", []]]], Unnest: ["define", { sourceInterval: [1317, 1391] }, "an UNNEST clause", [], ["seq", { sourceInterval: [1353, 1391] }, ["app", { sourceInterval: [1353, 1360] }, "kUNNEST", []], ["app", { sourceInterval: [1361, 1371] }, "Expression", []], ["opt", { sourceInterval: [1372, 1391] }, ["seq", { sourceInterval: [1373, 1389] }, ["opt", { sourceInterval: [1373, 1377] }, ["app", { sourceInterval: [1373, 1376] }, "kAS", []]], ["app", { sourceInterval: [1378, 1389] }, "columnAlias", []]]]]], Expression: ["define", { sourceInterval: [1450, 1492] }, "an expression", [], ["app", { sourceInterval: [1487, 1492] }, "OrExp", []]], OrExp_or: ["define", { sourceInterval: [1514, 1539] }, null, [], ["seq", { sourceInterval: [1514, 1530] }, ["app", { sourceInterval: [1514, 1519] }, "OrExp", []], ["app", { sourceInterval: [1520, 1523] }, "kOR", []], ["app", { sourceInterval: [1524, 1530] }, "AndExp", []]]], OrExp: ["define", { sourceInterval: [1498, 1556] }, null, [], ["alt", { sourceInterval: [1514, 1556] }, ["app", { sourceInterval: [1514, 1530] }, "OrExp_or", []], ["app", { sourceInterval: [1550, 1556] }, "AndExp", []]]], AndExp_and: ["define", { sourceInterval: [1579, 1606] }, null, [], ["seq", { sourceInterval: [1579, 1596] }, ["app", { sourceInterval: [1579, 1585] }, "AndExp", []], ["app", { sourceInterval: [1586, 1590] }, "kAND", []], ["app", { sourceInterval: [1591, 1596] }, "EqExp", []]]], AndExp: ["define", { sourceInterval: [1562, 1622] }, null, [], ["alt", { sourceInterval: [1579, 1622] }, ["app", { sourceInterval: [1579, 1596] }, "AndExp_and", []], ["app", { sourceInterval: [1617, 1622] }, "EqExp", []]]], EqExp_eq: ["define", { sourceInterval: [1644, 1691] }, null, [], ["seq", { sourceInterval: [1644, 1669] }, ["app", { sourceInterval: [1644, 1649] }, "EqExp", []], ["alt", { sourceInterval: [1651, 1661] }, ["terminal", { sourceInterval: [1651, 1655] }, "=="], ["terminal", { sourceInterval: [1658, 1661] }, "="]], ["app", { sourceInterval: [1663, 1669] }, "RelExp", []]]], EqExp_neq: ["define", { sourceInterval: [1702, 1750] }, null, [], ["seq", { sourceInterval: [1702, 1728] }, ["app", { sourceInterval: [1702, 1707] }, "EqExp", []], ["alt", { sourceInterval: [1709, 1720] }, ["terminal", { sourceInterval: [1709, 1713] }, "<>"], ["terminal", { sourceInterval: [1716, 1720] }, "!="]], ["app", { sourceInterval: [1722, 1728] }, "RelExp", []]]], EqExp_isValued: ["define", { sourceInterval: [1761, 1814] }, null, [], ["seq", { sourceInterval: [1761, 1784] }, ["app", { sourceInterval: [1761, 1766] }, "EqExp", []], ["app", { sourceInterval: [1767, 1770] }, "kIS", []], ["opt", { sourceInterval: [1771, 1776] }, ["app", { sourceInterval: [1771, 1775] }, "kNOT", []]], ["app", { sourceInterval: [1777, 1784] }, "kVALUED", []]]], EqExp_isNot: ["define", { sourceInterval: [1825, 1875] }, null, [], ["seq", { sourceInterval: [1825, 1846] }, ["app", { sourceInterval: [1825, 1830] }, "EqExp", []], ["app", { sourceInterval: [1831, 1834] }, "kIS", []], ["app", { sourceInterval: [1835, 1839] }, "kNOT", []], ["app", { sourceInterval: [1840, 1846] }, "RelExp", []]]], EqExp_is: ["define", { sourceInterval: [1886, 1933] }, null, [], ["seq", { sourceInterval: [1886, 1902] }, ["app", { sourceInterval: [1886, 1891] }, "EqExp", []], ["app", { sourceInterval: [1892, 1895] }, "kIS", []], ["app", { sourceInterval: [1896, 1902] }, "RelExp", []]]], EqExp_like: ["define", { sourceInterval: [1944, 1984] }, null, [], ["seq", { sourceInterval: [1944, 1962] }, ["app", { sourceInterval: [1944, 1949] }, "EqExp", []], ["app", { sourceInterval: [1950, 1955] }, "kLIKE", []], ["app", { sourceInterval: [1956, 1962] }, "RelExp", []]]], EqExp_notLike: ["define", { sourceInterval: [1995, 2039] }, null, [], ["seq", { sourceInterval: [1995, 2018] }, ["app", { sourceInterval: [1995, 2e3] }, "EqExp", []], ["app", { sourceInterval: [2001, 2005] }, "kNOT", []], ["app", { sourceInterval: [2006, 2011] }, "kLIKE", []], ["app", { sourceInterval: [2012, 2018] }, "RelExp", []]]], EqExp_notNull: ["define", { sourceInterval: [2050, 2102] }, null, [], ["seq", { sourceInterval: [2050, 2066] }, ["app", { sourceInterval: [2050, 2055] }, "EqExp", []], ["app", { sourceInterval: [2056, 2060] }, "kNOT", []], ["app", { sourceInterval: [2061, 2066] }, "kNULL", []]]], EqExp_inArray: ["define", { sourceInterval: [2210, 2262] }, null, [], ["seq", { sourceInterval: [2210, 2236] }, ["app", { sourceInterval: [2210, 2215] }, "EqExp", []], ["app", { sourceInterval: [2216, 2223] }, "InOrNot", []], ["app", { sourceInterval: [2224, 2236] }, "ArrayLiteral", []]]], EqExp_inExpr: ["define", { sourceInterval: [2273, 2324] }, null, [], ["seq", { sourceInterval: [2273, 2293] }, ["app", { sourceInterval: [2273, 2278] }, "EqExp", []], ["app", { sourceInterval: [2279, 2286] }, "InOrNot", []], ["app", { sourceInterval: [2287, 2293] }, "RelExp", []]]], EqExp_between: ["define", { sourceInterval: [2335, 2387] }, null, [], ["seq", { sourceInterval: [2335, 2374] }, ["app", { sourceInterval: [2335, 2340] }, "EqExp", []], ["opt", { sourceInterval: [2341, 2346] }, ["app", { sourceInterval: [2341, 2345] }, "kNOT", []]], ["app", { sourceInterval: [2347, 2355] }, "kBETWEEN", []], ["app", { sourceInterval: [2356, 2362] }, "RelExp", []], ["app", { sourceInterval: [2363, 2367] }, "kAND", []], ["app", { sourceInterval: [2368, 2374] }, "RelExp", []]]], EqExp: ["define", { sourceInterval: [1628, 2404] }, null, [], ["alt", { sourceInterval: [1644, 2404] }, ["app", { sourceInterval: [1644, 1669] }, "EqExp_eq", []], ["app", { sourceInterval: [1702, 1728] }, "EqExp_neq", []], ["app", { sourceInterval: [1761, 1784] }, "EqExp_isValued", []], ["app", { sourceInterval: [1825, 1846] }, "EqExp_isNot", []], ["app", { sourceInterval: [1886, 1902] }, "EqExp_is", []], ["app", { sourceInterval: [1944, 1962] }, "EqExp_like", []], ["app", { sourceInterval: [1995, 2018] }, "EqExp_notLike", []], ["app", { sourceInterval: [2050, 2066] }, "EqExp_notNull", []], ["app", { sourceInterval: [2210, 2236] }, "EqExp_inArray", []], ["app", { sourceInterval: [2273, 2293] }, "EqExp_inExpr", []], ["app", { sourceInterval: [2335, 2374] }, "EqExp_between", []], ["app", { sourceInterval: [2398, 2404] }, "RelExp", []]]], RelExp_rel: ["define", { sourceInterval: [2427, 2473] }, null, [], ["seq", { sourceInterval: [2427, 2466] }, ["app", { sourceInterval: [2427, 2433] }, "RelExp", []], ["alt", { sourceInterval: [2435, 2458] }, ["terminal", { sourceInterval: [2435, 2439] }, "<="], ["terminal", { sourceInterval: [2442, 2445] }, "<"], ["terminal", { sourceInterval: [2448, 2452] }, ">="], ["terminal", { sourceInterval: [2455, 2458] }, ">"]], ["app", { sourceInterval: [2460, 2466] }, "BitExp", []]]], RelExp: ["define", { sourceInterval: [2410, 2490] }, null, [], ["alt", { sourceInterval: [2427, 2490] }, ["app", { sourceInterval: [2427, 2466] }, "RelExp_rel", []], ["app", { sourceInterval: [2484, 2490] }, "BitExp", []]]], BitExp_bit: ["define", { sourceInterval: [2513, 2559] }, null, [], ["seq", { sourceInterval: [2513, 2552] }, ["app", { sourceInterval: [2513, 2519] }, "BitExp", []], ["alt", { sourceInterval: [2521, 2544] }, ["terminal", { sourceInterval: [2521, 2525] }, "<<"], ["terminal", { sourceInterval: [2528, 2532] }, ">>"], ["terminal", { sourceInterval: [2535, 2538] }, "&"], ["terminal", { sourceInterval: [2541, 2544] }, "|"]], ["app", { sourceInterval: [2546, 2552] }, "AddExp", []]]], BitExp: ["define", { sourceInterval: [2496, 2576] }, null, [], ["alt", { sourceInterval: [2513, 2576] }, ["app", { sourceInterval: [2513, 2552] }, "BitExp_bit", []], ["app", { sourceInterval: [2570, 2576] }, "AddExp", []]]], AddExp_plus: ["define", { sourceInterval: [2599, 2626] }, null, [], ["seq", { sourceInterval: [2599, 2616] }, ["app", { sourceInterval: [2599, 2605] }, "AddExp", []], ["terminal", { sourceInterval: [2606, 2609] }, "+"], ["app", { sourceInterval: [2610, 2616] }, "MulExp", []]]], AddExp_minus: ["define", { sourceInterval: [2637, 2665] }, null, [], ["seq", { sourceInterval: [2637, 2654] }, ["app", { sourceInterval: [2637, 2643] }, "AddExp", []], ["terminal", { sourceInterval: [2644, 2647] }, "-"], ["app", { sourceInterval: [2648, 2654] }, "MulExp", []]]], AddExp: ["define", { sourceInterval: [2582, 2682] }, null, [], ["alt", { sourceInterval: [2599, 2682] }, ["app", { sourceInterval: [2599, 2616] }, "AddExp_plus", []], ["app", { sourceInterval: [2637, 2654] }, "AddExp_minus", []], ["app", { sourceInterval: [2676, 2682] }, "MulExp", []]]], MulExp_times: ["define", { sourceInterval: [2705, 2735] }, null, [], ["seq", { sourceInterval: [2705, 2725] }, ["app", { sourceInterval: [2705, 2711] }, "MulExp", []], ["terminal", { sourceInterval: [2712, 2715] }, "*"], ["app", { sourceInterval: [2716, 2725] }, "ConcatExp", []]]], MulExp_divide: ["define", { sourceInterval: [2746, 2777] }, null, [], ["seq", { sourceInterval: [2746, 2766] }, ["app", { sourceInterval: [2746, 2752] }, "MulExp", []], ["terminal", { sourceInterval: [2753, 2756] }, "/"], ["app", { sourceInterval: [2757, 2766] }, "ConcatExp", []]]], MulExp_modulo: ["define", { sourceInterval: [2788, 2818] }, null, [], ["seq", { sourceInterval: [2788, 2808] }, ["app", { sourceInterval: [2788, 2794] }, "MulExp", []], ["terminal", { sourceInterval: [2795, 2798] }, "%"], ["app", { sourceInterval: [2799, 2808] }, "ConcatExp", []]]], MulExp: ["define", { sourceInterval: [2688, 2838] }, null, [], ["alt", { sourceInterval: [2705, 2838] }, ["app", { sourceInterval: [2705, 2725] }, "MulExp_times", []], ["app", { sourceInterval: [2746, 2766] }, "MulExp_divide", []], ["app", { sourceInterval: [2788, 2808] }, "MulExp_modulo", []], ["app", { sourceInterval: [2829, 2838] }, "ConcatExp", []]]], ConcatExp_concat: ["define", { sourceInterval: [2864, 2899] }, null, [], ["seq", { sourceInterval: [2864, 2889] }, ["app", { sourceInterval: [2864, 2874] }, "PrimaryExp", []], ["terminal", { sourceInterval: [2875, 2879] }, "||"], ["app", { sourceInterval: [2880, 2889] }, "ConcatExp", []]]], ConcatExp: ["define", { sourceInterval: [2844, 2920] }, null, [], ["alt", { sourceInterval: [2864, 2920] }, ["app", { sourceInterval: [2864, 2889] }, "ConcatExp_concat", []], ["app", { sourceInterval: [2910, 2920] }, "PrimaryExp", []]]], AnyEveryExp: ["define", { sourceInterval: [2926, 3011] }, null, [], ["seq", { sourceInterval: [2948, 3011] }, ["app", { sourceInterval: [2948, 2956] }, "AnyEvery", []], ["app", { sourceInterval: [2957, 2969] }, "variableName", []], ["app", { sourceInterval: [2970, 2973] }, "kIN", []], ["app", { sourceInterval: [2974, 2984] }, "Expression", []], ["app", { sourceInterval: [2985, 2995] }, "kSATISFIES", []], ["app", { sourceInterval: [2996, 3006] }, "Expression", []], ["app", { sourceInterval: [3007, 3011] }, "kEND", []]]], AnyEvery_anyEvery: ["define", { sourceInterval: [3035, 3071] }, null, [], ["seq", { sourceInterval: [3035, 3056] }, ["app", { sourceInterval: [3035, 3044] }, "AnyOrSome", []], ["app", { sourceInterval: [3045, 3049] }, "kAND", []], ["app", { sourceInterval: [3050, 3056] }, "kEVERY", []]]], AnyEvery_any: ["define", { sourceInterval: [3082, 3113] }, null, [], ["app", { sourceInterval: [3082, 3091] }, "AnyOrSome", []]], AnyEvery_every: ["define", { sourceInterval: [3124, 3157] }, null, [], ["app", { sourceInterval: [3124, 3130] }, "kEVERY", []]], AnyEvery: ["define", { sourceInterval: [3016, 3157] }, null, [], ["alt", { sourceInterval: [3035, 3157] }, ["app", { sourceInterval: [3035, 3056] }, "AnyEvery_anyEvery", []], ["app", { sourceInterval: [3082, 3091] }, "AnyEvery_any", []], ["app", { sourceInterval: [3124, 3130] }, "AnyEvery_every", []]]], AnyOrSome: ["define", { sourceInterval: [3162, 3186] }, null, [], ["alt", { sourceInterval: [3174, 3186] }, ["app", { sourceInterval: [3174, 3178] }, "kANY", []], ["app", { sourceInterval: [3181, 3186] }, "kSOME", []]]], CaseExp: ["define", { sourceInterval: [3192, 3301] }, null, [], ["seq", { sourceInterval: [3210, 3301] }, ["app", { sourceInterval: [3210, 3215] }, "kCASE", []], ["opt", { sourceInterval: [3216, 3236] }, ["seq", { sourceInterval: [3217, 3234] }, ["not", { sourceInterval: [3217, 3223] }, ["app", { sourceInterval: [3218, 3223] }, "kWHEN", []]], ["app", { sourceInterval: [3224, 3234] }, "Expression", []]]], ["plus", { sourceInterval: [3247, 3256] }, ["app", { sourceInterval: [3247, 3255] }, "WhenThen", []]], ["opt", { sourceInterval: [3267, 3286] }, ["seq", { sourceInterval: [3268, 3284] }, ["app", { sourceInterval: [3268, 3273] }, "kELSE", []], ["app", { sourceInterval: [3274, 3284] }, "Expression", []]]], ["app", { sourceInterval: [3297, 3301] }, "kEND", []]]], WhenThen: ["define", { sourceInterval: [3306, 3358] }, null, [], ["seq", { sourceInterval: [3325, 3358] }, ["app", { sourceInterval: [3325, 3330] }, "kWHEN", []], ["app", { sourceInterval: [3331, 3341] }, "Expression", []], ["app", { sourceInterval: [3342, 3347] }, "kTHEN", []], ["app", { sourceInterval: [3348, 3358] }, "Expression", []]]], PrimaryExp_paren: ["define", { sourceInterval: [3385, 3426] }, null, [], ["seq", { sourceInterval: [3385, 3403] }, ["terminal", { sourceInterval: [3385, 3388] }, "("], ["app", { sourceInterval: [3389, 3399] }, "Expression", []], ["terminal", { sourceInterval: [3400, 3403] }, ")"]]], PrimaryExp_pos: ["define", { sourceInterval: [3437, 3474] }, null, [], ["seq", { sourceInterval: [3437, 3451] }, ["terminal", { sourceInterval: [3437, 3440] }, "+"], ["app", { sourceInterval: [3441, 3451] }, "PrimaryExp", []]]], PrimaryExp_neg: ["define", { sourceInterval: [3485, 3522] }, null, [], ["seq", { sourceInterval: [3485, 3499] }, ["terminal", { sourceInterval: [3485, 3488] }, "-"], ["app", { sourceInterval: [3489, 3499] }, "PrimaryExp", []]]], PrimaryExp_not: ["define", { sourceInterval: [3533, 3569] }, null, [], ["seq", { sourceInterval: [3533, 3548] }, ["app", { sourceInterval: [3533, 3537] }, "kNOT", []], ["app", { sourceInterval: [3538, 3548] }, "PrimaryExp", []]]], PrimaryExp_exists: ["define", { sourceInterval: [3580, 3622] }, null, [], ["seq", { sourceInterval: [3580, 3611] }, ["app", { sourceInterval: [3580, 3587] }, "kEXISTS", []], ["terminal", { sourceInterval: [3588, 3591] }, "("], ["app", { sourceInterval: [3592, 3607] }, "SelectStatement", []], ["terminal", { sourceInterval: [3608, 3611] }, ")"]]], PrimaryExp: ["define", { sourceInterval: [3364, 3802] }, null, [], ["alt", { sourceInterval: [3385, 3802] }, ["app", { sourceInterval: [3385, 3403] }, "PrimaryExp_paren", []], ["app", { sourceInterval: [3437, 3451] }, "PrimaryExp_pos", []], ["app", { sourceInterval: [3485, 3499] }, "PrimaryExp_neg", []], ["app", { sourceInterval: [3533, 3548] }, "PrimaryExp_not", []], ["app", { sourceInterval: [3580, 3611] }, "PrimaryExp_exists", []], ["app", { sourceInterval: [3633, 3640] }, "literal", []], ["app", { sourceInterval: [3651, 3663] }, "ArrayLiteral", []], ["app", { sourceInterval: [3674, 3685] }, "DictLiteral", []], ["app", { sourceInterval: [3696, 3704] }, "Function", []], ["app", { sourceInterval: [3715, 3726] }, "AnyEveryExp", []], ["app", { sourceInterval: [3737, 3744] }, "CaseExp", []], ["app", { sourceInterval: [3755, 3764] }, "parameter", []], ["app", { sourceInterval: [3775, 3783] }, "variable", []], ["app", { sourceInterval: [3794, 3802] }, "Property", []]]], ArrayLiteral: ["define", { sourceInterval: [3809, 3839] }, null, [], ["seq", { sourceInterval: [3824, 3839] }, ["terminal", { sourceInterval: [3824, 3827] }, "["], ["app", { sourceInterval: [3828, 3835] }, "ArgList", []], ["terminal", { sourceInterval: [3836, 3839] }, "]"]]], DictLiteral: ["define", { sourceInterval: [3845, 3883] }, null, [], ["seq", { sourceInterval: [3860, 3883] }, ["terminal", { sourceInterval: [3860, 3863] }, "{"], ["app", { sourceInterval: [3864, 3879] }, "ListOf", [["app", { sourceInterval: [3871, 3873] }, "KV", []], ["terminal", { sourceInterval: [3875, 3878] }, ","]]], ["terminal", { sourceInterval: [3880, 3883] }, "}"]]], KV: ["define", { sourceInterval: [3888, 3924] }, null, [], ["seq", { sourceInterval: [3896, 3924] }, ["app", { sourceInterval: [3896, 3909] }, "stringLiteral", []], ["terminal", { sourceInterval: [3910, 3913] }, ":"], ["app", { sourceInterval: [3914, 3924] }, "Expression", []]]], InOrNot: ["define", { sourceInterval: [3930, 3954] }, null, [], ["seq", { sourceInterval: [3945, 3954] }, ["opt", { sourceInterval: [3945, 3950] }, ["app", { sourceInterval: [3945, 3949] }, "kNOT", []]], ["app", { sourceInterval: [3951, 3954] }, "kIN", []]]], Property_all: ["define", { sourceInterval: [4021, 4036] }, null, [], ["terminal", { sourceInterval: [4021, 4024] }, "*"]], Property_allInCollection: ["define", { sourceInterval: [4047, 4089] }, null, [], ["seq", { sourceInterval: [4047, 4070] }, ["app", { sourceInterval: [4047, 4062] }, "collectionAlias", []], ["terminal", { sourceInterval: [4063, 4066] }, "."], ["terminal", { sourceInterval: [4067, 4070] }, "*"]]], Property_path: ["define", { sourceInterval: [4100, 4123] }, null, [], ["app", { sourceInterval: [4100, 4112] }, "PropertyPath", []]], Property: ["define", { sourceInterval: [3980, 4123] }, "a document property", [], ["alt", { sourceInterval: [4021, 4123] }, ["app", { sourceInterval: [4021, 4024] }, "Property_all", []], ["app", { sourceInterval: [4047, 4070] }, "Property_allInCollection", []], ["app", { sourceInterval: [4100, 4112] }, "Property_path", []]]], PropertyPath: ["define", { sourceInterval: [4129, 4190] }, null, [], ["seq", { sourceInterval: [4152, 4190] }, ["app", { sourceInterval: [4152, 4164] }, "propertyName", []], ["star", { sourceInterval: [4165, 4190] }, ["app", { sourceInterval: [4165, 4189] }, "PropertyPathContinuation", []]]]], PropertyPathContinuation_named: ["define", { sourceInterval: [4231, 4259] }, null, [], ["seq", { sourceInterval: [4231, 4247] }, ["terminal", { sourceInterval: [4231, 4234] }, "."], ["app", { sourceInterval: [4235, 4247] }, "propertyName", []]]], PropertyPathContinuation_indexed: ["define", { sourceInterval: [4270, 4301] }, null, [], ["seq", { sourceInterval: [4270, 4289] }, ["terminal", { sourceInterval: [4270, 4273] }, "["], ["app", { sourceInterval: [4274, 4285] }, "wholeNumber", []], ["terminal", { sourceInterval: [4286, 4289] }, "]"]]], PropertyPathContinuation: ["define", { sourceInterval: [4196, 4301] }, null, [], ["alt", { sourceInterval: [4231, 4301] }, ["app", { sourceInterval: [4231, 4247] }, "PropertyPathContinuation_named", []], ["app", { sourceInterval: [4270, 4289] }, "PropertyPathContinuation_indexed", []]]], Function: ["define", { sourceInterval: [4327, 4391] }, "a function call", [], ["alt", { sourceInterval: [4364, 4391] }, ["app", { sourceInterval: [4364, 4376] }, "MetaFunction", []], ["app", { sourceInterval: [4379, 4391] }, "N1QLFunction", []]]], MetaFunction_plain: ["define", { sourceInterval: [4420, 4470] }, null, [], ["seq", { sourceInterval: [4420, 4455] }, ["app", { sourceInterval: [4420, 4425] }, "iMETA", []], ["terminal", { sourceInterval: [4426, 4429] }, "("], ["opt", { sourceInterval: [4430, 4446] }, ["app", { sourceInterval: [4430, 4445] }, "collectionAlias", []]], ["terminal", { sourceInterval: [4447, 4450] }, ")"], ["not", { sourceInterval: [4451, 4455] }, ["terminal", { sourceInterval: [4452, 4455] }, "."]]]], MetaFunction_property: ["define", { sourceInterval: [4481, 4534] }, null, [], ["seq", { sourceInterval: [4481, 4521] }, ["app", { sourceInterval: [4481, 4486] }, "iMETA", []], ["terminal", { sourceInterval: [4487, 4490] }, "("], ["opt", { sourceInterval: [4491, 4507] }, ["app", { sourceInterval: [4491, 4506] }, "collectionAlias", []]], ["terminal", { sourceInterval: [4508, 4511] }, ")"], ["terminal", { sourceInterval: [4512, 4515] }, "."], ["app", { sourceInterval: [4516, 4521] }, "ident", []]]], MetaFunction: ["define", { sourceInterval: [4397, 4534] }, null, [], ["alt", { sourceInterval: [4420, 4534] }, ["app", { sourceInterval: [4420, 4455] }, "MetaFunction_plain", []], ["app", { sourceInterval: [4481, 4521] }, "MetaFunction_property", []]]], N1QLFunction: ["define", { sourceInterval: [4540, 4591] }, null, [], ["seq", { sourceInterval: [4563, 4591] }, ["app", { sourceInterval: [4563, 4575] }, "functionName", []], ["terminal", { sourceInterval: [4576, 4579] }, "("], ["app", { sourceInterval: [4580, 4587] }, "ArgList", []], ["terminal", { sourceInterval: [4588, 4591] }, ")"]]], ArgList: ["define", { sourceInterval: [4597, 4638] }, null, [], ["app", { sourceInterval: [4615, 4638] }, "ListOf", [["app", { sourceInterval: [4622, 4632] }, "Expression", []], ["terminal", { sourceInterval: [4634, 4637] }, ","]]]], collectionAlias: ["define", { sourceInterval: [4681, 4725] }, "a collection alias", [], ["app", { sourceInterval: [4720, 4725] }, "ident", []]], columnAlias: ["define", { sourceInterval: [4730, 4774] }, "a column alias", [], ["app", { sourceInterval: [4769, 4774] }, "ident", []]], functionName: ["define", { sourceInterval: [4779, 4823] }, "a function name", [], ["app", { sourceInterval: [4818, 4823] }, "ident", []]], propertyName: ["define", { sourceInterval: [4828, 4872] }, "a property name", [], ["app", { sourceInterval: [4867, 4872] }, "ident", []]], variableName: ["define", { sourceInterval: [4877, 4921] }, "a variable name", [], ["app", { sourceInterval: [4916, 4921] }, "ident", []]], parameter: ["define", { sourceInterval: [4927, 4975] }, "a parameter", [], ["seq", { sourceInterval: [4966, 4975] }, ["terminal", { sourceInterval: [4966, 4969] }, "$"], ["app", { sourceInterval: [4970, 4975] }, "ident", []]]], variable: ["define", { sourceInterval: [4980, 5028] }, "a variable", [], ["seq", { sourceInterval: [5019, 5028] }, ["terminal", { sourceInterval: [5019, 5022] }, "?"], ["app", { sourceInterval: [5023, 5028] }, "ident", []]]], literal_true: ["define", { sourceInterval: [5105, 5126] }, null, [], ["app", { sourceInterval: [5105, 5110] }, "kTRUE", []]], literal_false: ["define", { sourceInterval: [5137, 5159] }, null, [], ["app", { sourceInterval: [5137, 5143] }, "kFALSE", []]], literal_null: ["define", { sourceInterval: [5170, 5191] }, null, [], ["app", { sourceInterval: [5170, 5175] }, "kNULL", []]], literal_missing: ["define", { sourceInterval: [5202, 5226] }, null, [], ["app", { sourceInterval: [5202, 5210] }, "kMISSING", []]], literal: ["define", { sourceInterval: [5034, 5226] }, "a literal", [], ["alt", { sourceInterval: [5064, 5226] }, ["app", { sourceInterval: [5064, 5070] }, "number", []], ["app", { sourceInterval: [5081, 5094] }, "stringLiteral", []], ["app", { sourceInterval: [5105, 5110] }, "literal_true", []], ["app", { sourceInterval: [5137, 5143] }, "literal_false", []], ["app", { sourceInterval: [5170, 5175] }, "literal_null", []], ["app", { sourceInterval: [5202, 5210] }, "literal_missing", []]]], ident_unquoted: ["define", { sourceInterval: [5300, 5353] }, null, [], ["seq", { sourceInterval: [5300, 5340] }, ["not", { sourceInterval: [5300, 5308] }, ["app", { sourceInterval: [5301, 5308] }, "keyword", []]], ["app", { sourceInterval: [5309, 5324] }, "identifierStart", []], ["star", { sourceInterval: [5325, 5340] }, ["app", { sourceInterval: [5325, 5339] }, "identifierPart", []]]]], ident_quoted: ["define", { sourceInterval: [5364, 5442] }, null, [], ["seq", { sourceInterval: [5364, 5401] }, ["app", { sourceInterval: [5364, 5373] }, "backQuote", []], ["star", { sourceInterval: [5374, 5391] }, ["seq", { sourceInterval: [5375, 5389] }, ["not", { sourceInterval: [5375, 5385] }, ["app", { sourceInterval: [5376, 5385] }, "backQuote", []]], ["app", { sourceInterval: [5386, 5389] }, "any", []]]], ["app", { sourceInterval: [5392, 5401] }, "backQuote", []]]], ident: ["define", { sourceInterval: [5267, 5442] }, "an identifier", [], ["alt", { sourceInterval: [5300, 5442] }, ["app", { sourceInterval: [5300, 5340] }, "ident_unquoted", []], ["app", { sourceInterval: [5364, 5401] }, "ident_quoted", []]]], iMETA: ["define", { sourceInterval: [5448, 5503] }, null, [], ["seq", { sourceInterval: [5458, 5503] }, ["app", { sourceInterval: [5458, 5481] }, "caseInsensitive", [["terminal", { sourceInterval: [5474, 5480] }, "META"]]], ["not", { sourceInterval: [5488, 5503] }, ["app", { sourceInterval: [5489, 5503] }, "identifierPart", []]]]], iID: ["define", { sourceInterval: [5508, 5565] }, null, [], ["seq", { sourceInterval: [5520, 5565] }, ["app", { sourceInterval: [5520, 5541] }, "caseInsensitive", [["terminal", { sourceInterval: [5536, 5540] }, "ID"]]], ["not", { sourceInterval: [5550, 5565] }, ["app", { sourceInterval: [5551, 5565] }, "identifierPart", []]]]], iSEQUENCE: ["define", { sourceInterval: [5570, 5628] }, null, [], ["seq", { sourceInterval: [5583, 5628] }, ["app", { sourceInterval: [5583, 5610] }, "caseInsensitive", [["terminal", { sourceInterval: [5599, 5609] }, "SEQUENCE"]]], ["not", { sourceInterval: [5613, 5628] }, ["app", { sourceInterval: [5614, 5628] }, "identifierPart", []]]]], iDELETED: ["define", { sourceInterval: [5633, 5690] }, null, [], ["seq", { sourceInterval: [5645, 5690] }, ["app", { sourceInterval: [5645, 5671] }, "caseInsensitive", [["terminal", { sourceInterval: [5661, 5670] }, "DELETED"]]], ["not", { sourceInterval: [5675, 5690] }, ["app", { sourceInterval: [5676, 5690] }, "identifierPart", []]]]], iEXPIRATION: ["define", { sourceInterval: [5695, 5754] }, null, [], ["seq", { sourceInterval: [5709, 5754] }, ["app", { sourceInterval: [5709, 5738] }, "caseInsensitive", [["terminal", { sourceInterval: [5725, 5737] }, "EXPIRATION"]]], ["not", { sourceInterval: [5739, 5754] }, ["app", { sourceInterval: [5740, 5754] }, "identifierPart", []]]]], keyword: ["define", { sourceInterval: [5760, 6187] }, null, [], ["alt", { sourceInterval: [5778, 6187] }, ["app", { sourceInterval: [5778, 5782] }, "kALL", []], ["app", { sourceInterval: [5785, 5789] }, "kAND", []], ["app", { sourceInterval: [5792, 5796] }, "kANY", []], ["app", { sourceInterval: [5799, 5805] }, "kARRAY", []], ["app", { sourceInterval: [5808, 5811] }, "kAS", []], ["app", { sourceInterval: [5814, 5818] }, "kASC", []], ["app", { sourceInterval: [5821, 5829] }, "kBETWEEN", []], ["app", { sourceInterval: [5832, 5835] }, "kBY", []], ["app", { sourceInterval: [5838, 5843] }, "kCASE", []], ["app", { sourceInterval: [5846, 5852] }, "kCROSS", []], ["app", { sourceInterval: [5855, 5860] }, "kDESC", []], ["app", { sourceInterval: [5871, 5880] }, "kDISTINCT", []], ["app", { sourceInterval: [5883, 5887] }, "kEND", []], ["app", { sourceInterval: [5890, 5895] }, "kELSE", []], ["app", { sourceInterval: [5898, 5904] }, "kEVERY", []], ["app", { sourceInterval: [5907, 5914] }, "kEXISTS", []], ["app", { sourceInterval: [5917, 5923] }, "kFALSE", []], ["app", { sourceInterval: [5926, 5931] }, "kFROM", []], ["app", { sourceInterval: [5934, 5940] }, "kGROUP", []], ["app", { sourceInterval: [5943, 5950] }, "kHAVING", []], ["app", { sourceInterval: [5953, 5956] }, "kIN", []], ["app", { sourceInterval: [5967, 5973] }, "kINNER", []], ["app", { sourceInterval: [5976, 5979] }, "kIS", []], ["app", { sourceInterval: [5982, 5987] }, "kJOIN", []], ["app", { sourceInterval: [5990, 5995] }, "kLEFT", []], ["app", { sourceInterval: [5998, 6003] }, "kLIKE", []], ["app", { sourceInterval: [6006, 6012] }, "kLIMIT", []], ["app", { sourceInterval: [6015, 6023] }, "kMISSING", []], ["app", { sourceInterval: [6026, 6030] }, "kNOT", []], ["app", { sourceInterval: [6033, 6038] }, "kNULL", []], ["app", { sourceInterval: [6041, 6048] }, "kOFFSET", []], ["app", { sourceInterval: [6059, 6062] }, "kON", []], ["app", { sourceInterval: [6065, 6068] }, "kOR", []], ["app", { sourceInterval: [6071, 6077] }, "kORDER", []], ["app", { sourceInterval: [6080, 6086] }, "kOUTER", []], ["app", { sourceInterval: [6089, 6095] }, "kRIGHT", []], ["app", { sourceInterval: [6098, 6108] }, "kSATISFIES", []], ["app", { sourceInterval: [6111, 6118] }, "kSELECT", []], ["app", { sourceInterval: [6121, 6126] }, "kSOME", []], ["app", { sourceInterval: [6129, 6134] }, "kTHEN", []], ["app", { sourceInterval: [6137, 6142] }, "kTRUE", []], ["app", { sourceInterval: [6153, 6160] }, "kUNNEST", []], ["app", { sourceInterval: [6163, 6170] }, "kVALUED", []], ["app", { sourceInterval: [6173, 6178] }, "kWHEN", []], ["app", { sourceInterval: [6181, 6187] }, "kWHERE", []]]], kALL: ["define", { sourceInterval: [6193, 6247] }, null, [], ["seq", { sourceInterval: [6202, 6247] }, ["app", { sourceInterval: [6202, 6224] }, "caseInsensitive", [["terminal", { sourceInterval: [6218, 6223] }, "ALL"]]], ["not", { sourceInterval: [6232, 6247] }, ["app", { sourceInterval: [6233, 6247] }, "identifierPart", []]]]], kAND: ["define", { sourceInterval: [6252, 6306] }, null, [], ["seq", { sourceInterval: [6261, 6306] }, ["app", { sourceInterval: [6261, 6283] }, "caseInsensitive", [["terminal", { sourceInterval: [6277, 6282] }, "AND"]]], ["not", { sourceInterval: [6291, 6306] }, ["app", { sourceInterval: [6292, 6306] }, "identifierPart", []]]]], kANY: ["define", { sourceInterval: [6311, 6365] }, null, [], ["seq", { sourceInterval: [6320, 6365] }, ["app", { sourceInterval: [6320, 6342] }, "caseInsensitive", [["terminal", { sourceInterval: [6336, 6341] }, "ANY"]]], ["not", { sourceInterval: [6350, 6365] }, ["app", { sourceInterval: [6351, 6365] }, "identifierPart", []]]]], kARRAY: ["define", { sourceInterval: [6370, 6426] }, null, [], ["seq", { sourceInterval: [6381, 6426] }, ["app", { sourceInterval: [6381, 6405] }, "caseInsensitive", [["terminal", { sourceInterval: [6397, 6404] }, "ARRAY"]]], ["not", { sourceInterval: [6411, 6426] }, ["app", { sourceInterval: [6412, 6426] }, "identifierPart", []]]]], kAS: ["define", { sourceInterval: [6431, 6484] }, null, [], ["seq", { sourceInterval: [6439, 6484] }, ["app", { sourceInterval: [6439, 6460] }, "caseInsensitive", [["terminal", { sourceInterval: [6455, 6459] }, "AS"]]], ["not", { sourceInterval: [6469, 6484] }, ["app", { sourceInterval: [6470, 6484] }, "identifierPart", []]]]], kASC: ["define", { sourceInterval: [6489, 6542] }, null, [], ["seq", { sourceInterval: [6497, 6542] }, ["app", { sourceInterval: [6497, 6519] }, "caseInsensitive", [["terminal", { sourceInterval: [6513, 6518] }, "ASC"]]], ["not", { sourceInterval: [6527, 6542] }, ["app", { sourceInterval: [6528, 6542] }, "identifierPart", []]]]], kBETWEEN: ["define", { sourceInterval: [6547, 6603] }, null, [], ["seq", { sourceInterval: [6558, 6603] }, ["app", { sourceInterval: [6558, 6584] }, "caseInsensitive", [["terminal", { sourceInterval: [6574, 6583] }, "BETWEEN"]]], ["not", { sourceInterval: [6588, 6603] }, ["app", { sourceInterval: [6589, 6603] }, "identifierPart", []]]]], kBY: ["define", { sourceInterval: [6608, 6661] }, null, [], ["seq", { sourceInterval: [6616, 6661] }, ["app", { sourceInterval: [6616, 6637] }, "caseInsensitive", [["terminal", { sourceInterval: [6632, 6636] }, "BY"]]], ["not", { sourceInterval: [6646, 6661] }, ["app", { sourceInterval: [6647, 6661] }, "identifierPart", []]]]], kCASE: ["define", { sourceInterval: [6666, 6720] }, null, [], ["seq", { sourceInterval: [6675, 6720] }, ["app", { sourceInterval: [6675, 6698] }, "caseInsensitive", [["terminal", { sourceInterval: [6691, 6697] }, "CASE"]]], ["not", { sourceInterval: [6705, 6720] }, ["app", { sourceInterval: [6706, 6720] }, "identifierPart", []]]]], kCROSS: ["define", { sourceInterval: [6725, 6780] }, null, [], ["seq", { sourceInterval: [6735, 6780] }, ["app", { sourceInterval: [6735, 6759] }, "caseInsensitive", [["terminal", { sourceInterval: [6751, 6758] }, "CROSS"]]], ["not", { sourceInterval: [6765, 6780] }, ["app", { sourceInterval: [6766, 6780] }, "identifierPart", []]]]], kDESC: ["define", { sourceInterval: [6785, 6839] }, null, [], ["seq", { sourceInterval: [6794, 6839] }, ["app", { sourceInterval: [6794, 6817] }, "caseInsensitive", [["terminal", { sourceInterval: [6810, 6816] }, "DESC"]]], ["not", { sourceInterval: [6824, 6839] }, ["app", { sourceInterval: [6825, 6839] }, "identifierPart", []]]]], kDISTINCT: ["define", { sourceInterval: [6844, 6901] }, null, [], ["seq", { sourceInterval: [6856, 6901] }, ["app", { sourceInterval: [6856, 6883] }, "caseInsensitive", [["terminal", { sourceInterval: [6872, 6882] }, "DISTINCT"]]], ["not", { sourceInterval: [6886, 6901] }, ["app", { sourceInterval: [6887, 6901] }, "identifierPart", []]]]], kELSE: ["define", { sourceInterval: [6906, 6960] }, null, [], ["seq", { sourceInterval: [6915, 6960] }, ["app", { sourceInterval: [6915, 6938] }, "caseInsensitive", [["terminal", { sourceInterval: [6931, 6937] }, "ELSE"]]], ["not", { sourceInterval: [6945, 6960] }, ["app", { sourceInterval: [6946, 6960] }, "identifierPart", []]]]], kEND: ["define", { sourceInterval: [6965, 7018] }, null, [], ["seq", { sourceInterval: [6973, 7018] }, ["app", { sourceInterval: [6973, 6995] }, "caseInsensitive", [["terminal", { sourceInterval: [6989, 6994] }, "END"]]], ["not", { sourceInterval: [7003, 7018] }, ["app", { sourceInterval: [7004, 7018] }, "identifierPart", []]]]], kEVERY: ["define", { sourceInterval: [7023, 7078] }, null, [], ["seq", { sourceInterval: [7033, 7078] }, ["app", { sourceInterval: [7033, 7057] }, "caseInsensitive", [["terminal", { sourceInterval: [7049, 7056] }, "EVERY"]]], ["not", { sourceInterval: [7063, 7078] }, ["app", { sourceInterval: [7064, 7078] }, "identifierPart", []]]]], kEXISTS: ["define", { sourceInterval: [7083, 7139] }, null, [], ["seq", { sourceInterval: [7094, 7139] }, ["app", { sourceInterval: [7094, 7119] }, "caseInsensitive", [["terminal", { sourceInterval: [7110, 7118] }, "EXISTS"]]], ["not", { sourceInterval: [7124, 7139] }, ["app", { sourceInterval: [7125, 7139] }, "identifierPart", []]]]], kFALSE: ["define", { sourceInterval: [7144, 7199] }, null, [], ["seq", { sourceInterval: [7154, 7199] }, ["app", { sourceInterval: [7154, 7178] }, "caseInsensitive", [["terminal", { sourceInterval: [7170, 7177] }, "FALSE"]]], ["not", { sourceInterval: [7184, 7199] }, ["app", { sourceInterval: [7185, 7199] }, "identifierPart", []]]]], kFROM: ["define", { sourceInterval: [7204, 7259] }, null, [], ["seq", { sourceInterval: [7214, 7259] }, ["app", { sourceInterval: [7214, 7237] }, "caseInsensitive", [["terminal", { sourceInterval: [7230, 7236] }, "FROM"]]], ["not", { sourceInterval: [7244, 7259] }, ["app", { sourceInterval: [7245, 7259] }, "identifierPart", []]]]], kGROUP: ["define", { sourceInterval: [7264, 7320] }, null, [], ["seq", { sourceInterval: [7275, 7320] }, ["app", { sourceInterval: [7275, 7299] }, "caseInsensitive", [["terminal", { sourceInterval: [7291, 7298] }, "GROUP"]]], ["not", { sourceInterval: [7305, 7320] }, ["app", { sourceInterval: [7306, 7320] }, "identifierPart", []]]]], kHAVING: ["define", { sourceInterval: [7325, 7381] }, null, [], ["seq", { sourceInterval: [7336, 7381] }, ["app", { sourceInterval: [7336, 7361] }, "caseInsensitive", [["terminal", { sourceInterval: [7352, 7360] }, "HAVING"]]], ["not", { sourceInterval: [7366, 7381] }, ["app", { sourceInterval: [7367, 7381] }, "identifierPart", []]]]], kIN: ["define", { sourceInterval: [7386, 7439] }, null, [], ["seq", { sourceInterval: [7394, 7439] }, ["app", { sourceInterval: [7394, 7415] }, "caseInsensitive", [["terminal", { sourceInterval: [7410, 7414] }, "IN"]]], ["not", { sourceInterval: [7424, 7439] }, ["app", { sourceInterval: [7425, 7439] }, "identifierPart", []]]]], kINNER: ["define", { sourceInterval: [7444, 7502] }, null, [], ["seq", { sourceInterval: [7457, 7502] }, ["app", { sourceInterval: [7457, 7481] }, "caseInsensitive", [["terminal", { sourceInterval: [7473, 7480] }, "INNER"]]], ["not", { sourceInterval: [7487, 7502] }, ["app", { sourceInterval: [7488, 7502] }, "identifierPart", []]]]], kIS: ["define", { sourceInterval: [7507, 7560] }, null, [], ["seq", { sourceInterval: [7515, 7560] }, ["app", { sourceInterval: [7515, 7536] }, "caseInsensitive", [["terminal", { sourceInterval: [7531, 7535] }, "IS"]]], ["not", { sourceInterval: [7545, 7560] }, ["app", { sourceInterval: [7546, 7560] }, "identifierPart", []]]]], kJOIN: ["define", { sourceInterval: [7565, 7620] }, null, [], ["seq", { sourceInterval: [7575, 7620] }, ["app", { sourceInterval: [7575, 7598] }, "caseInsensitive", [["terminal", { sourceInterval: [7591, 7597] }, "JOIN"]]], ["not", { sourceInterval: [7605, 7620] }, ["app", { sourceInterval: [7606, 7620] }, "identifierPart", []]]]], kLEFT: ["define", { sourceInterval: [7625, 7680] }, null, [], ["seq", { sourceInterval: [7635, 7680] }, ["app", { sourceInterval: [7635, 7658] }, "caseInsensitive", [["terminal", { sourceInterval: [7651, 7657] }, "LEFT"]]], ["not", { sourceInterval: [7665, 7680] }, ["app", { sourceInterval: [7666, 7680] }, "identifierPart", []]]]], kLIKE: ["define", { sourceInterval: [7685, 7740] }, null, [], ["seq", { sourceInterval: [7695, 7740] }, ["app", { sourceInterval: [7695, 7718] }, "caseInsensitive", [["terminal", { sourceInterval: [7711, 7717] }, "LIKE"]]], ["not", { sourceInterval: [7725, 7740] }, ["app", { sourceInterval: [7726, 7740] }, "identifierPart", []]]]], kLIMIT: ["define", { sourceInterval: [7745, 7801] }, null, [], ["seq", { sourceInterval: [7756, 7801] }, ["app", { sourceInterval: [7756, 7780] }, "caseInsensitive", [["terminal", { sourceInterval: [7772, 7779] }, "LIMIT"]]], ["not", { sourceInterval: [7786, 7801] }, ["app", { sourceInterval: [7787, 7801] }, "identifierPart", []]]]], kMISSING: ["define", { sourceInterval: [7806, 7863] }, null, [], ["seq", { sourceInterval: [7818, 7863] }, ["app", { sourceInterval: [7818, 7844] }, "caseInsensitive", [["terminal", { sourceInterval: [7834, 7843] }, "MISSING"]]], ["not", { sourceInterval: [7848, 7863] }, ["app", { sourceInterval: [7849, 7863] }, "identifierPart", []]]]], kNOT: ["define", { sourceInterval: [7868, 7922] }, null, [], ["seq", { sourceInterval: [7877, 7922] }, ["app", { sourceInterval: [7877, 7899] }, "caseInsensitive", [["terminal", { sourceInterval: [7893, 7898] }, "NOT"]]], ["not", { sourceInterval: [7907, 7922] }, ["app", { sourceInterval: [7908, 7922] }, "identifierPart", []]]]], kNULL: ["define", { sourceInterval: [7927, 7982] }, null, [], ["seq", { sourceInterval: [7937, 7982] }, ["app", { sourceInterval: [7937, 7960] }, "caseInsensitive", [["terminal", { sourceInterval: [7953, 7959] }, "NULL"]]], ["not", { sourceInterval: [7967, 7982] }, ["app", { sourceInterval: [7968, 7982] }, "identifierPart", []]]]], kOFFSET: ["define", { sourceInterval: [7987, 8044] }, null, [], ["seq", { sourceInterval: [7999, 8044] }, ["app", { sourceInterval: [7999, 8024] }, "caseInsensitive", [["terminal", { sourceInterval: [8015, 8023] }, "OFFSET"]]], ["not", { sourceInterval: [8029, 8044] }, ["app", { sourceInterval: [8030, 8044] }, "identifierPart", []]]]], kON: ["define", { sourceInterval: [8049, 8106] }, null, [], ["seq", { sourceInterval: [8061, 8106] }, ["app", { sourceInterval: [8061, 8082] }, "caseInsensitive", [["terminal", { sourceInterval: [8077, 8081] }, "ON"]]], ["not", { sourceInterval: [8091, 8106] }, ["app", { sourceInterval: [8092, 8106] }, "identifierPart", []]]]], kOR: ["define", { sourceInterval: [8111, 8165] }, null, [], ["seq", { sourceInterval: [8120, 8165] }, ["app", { sourceInterval: [8120, 8141] }, "caseInsensitive", [["terminal", { sourceInterval: [8136, 8140] }, "OR"]]], ["not", { sourceInterval: [8150, 8165] }, ["app", { sourceInterval: [8151, 8165] }, "identifierPart", []]]]], kORDER: ["define", { sourceInterval: [8170, 8226] }, null, [], ["seq", { sourceInterval: [8181, 8226] }, ["app", { sourceInterval: [8181, 8205] }, "caseInsensitive", [["terminal", { sourceInterval: [8197, 8204] }, "ORDER"]]], ["not", { sourceInterval: [8211, 8226] }, ["app", { sourceInterval: [8212, 8226] }, "identifierPart", []]]]], kOUTER: ["define", { sourceInterval: [8231, 8287] }, null, [], ["seq", { sourceInterval: [8242, 8287] }, ["app", { sourceInterval: [8242, 8266] }, "caseInsensitive", [["terminal", { sourceInterval: [8258, 8265] }, "OUTER"]]], ["not", { sourceInterval: [8272, 8287] }, ["app", { sourceInterval: [8273, 8287] }, "identifierPart", []]]]], kRIGHT: ["define", { sourceInterval: [8292, 8348] }, null, [], ["seq", { sourceInterval: [8303, 8348] }, ["app", { sourceInterval: [8303, 8327] }, "caseInsensitive", [["terminal", { sourceInterval: [8319, 8326] }, "RIGHT"]]], ["not", { sourceInterval: [8333, 8348] }, ["app", { sourceInterval: [8334, 8348] }, "identifierPart", []]]]], kSATISFIES: ["define", { sourceInterval: [8353, 8412] }, null, [], ["seq", { sourceInterval: [8367, 8412] }, ["app", { sourceInterval: [8367, 8395] }, "caseInsensitive", [["terminal", { sourceInterval: [8383, 8394] }, "SATISFIES"]]], ["not", { sourceInterval: [8397, 8412] }, ["app", { sourceInterval: [8398, 8412] }, "identifierPart", []]]]], kSELECT: ["define", { sourceInterval: [8417, 8473] }, null, [], ["seq", { sourceInterval: [8428, 8473] }, ["app", { sourceInterval: [8428, 8453] }, "caseInsensitive", [["terminal", { sourceInterval: [8444, 8452] }, "SELECT"]]], ["not", { sourceInterval: [8458, 8473] }, ["app", { sourceInterval: [8459, 8473] }, "identifierPart", []]]]], kSOME: ["define", { sourceInterval: [8478, 8535] }, null, [], ["seq", { sourceInterval: [8490, 8535] }, ["app", { sourceInterval: [8490, 8513] }, "caseInsensitive", [["terminal", { sourceInterval: [8506, 8512] }, "SOME"]]], ["not", { sourceInterval: [8520, 8535] }, ["app", { sourceInterval: [8521, 8535] }, "identifierPart", []]]]], kTHEN: ["define", { sourceInterval: [8540, 8597] }, null, [], ["seq", { sourceInterval: [8552, 8597] }, ["app", { sourceInterval: [8552, 8575] }, "caseInsensitive", [["terminal", { sourceInterval: [8568, 8574] }, "THEN"]]], ["not", { sourceInterval: [8582, 8597] }, ["app", { sourceInterval: [8583, 8597] }, "identifierPart", []]]]], kTRUE: ["define", { sourceInterval: [8602, 8657] }, null, [], ["seq", { sourceInterval: [8612, 8657] }, ["app", { sourceInterval: [8612, 8635] }, "caseInsensitive", [["terminal", { sourceInterval: [8628, 8634] }, "TRUE"]]], ["not", { sourceInterval: [8642, 8657] }, ["app", { sourceInterval: [8643, 8657] }, "identifierPart", []]]]], kUNNEST: ["define", { sourceInterval: [8662, 8721] }, null, [], ["seq", { sourceInterval: [8676, 8721] }, ["app", { sourceInterval: [8676, 8701] }, "caseInsensitive", [["terminal", { sourceInterval: [8692, 8700] }, "UNNEST"]]], ["not", { sourceInterval: [8706, 8721] }, ["app", { sourceInterval: [8707, 8721] }, "identifierPart", []]]]], kVALUED: ["define", { sourceInterval: [8726, 8785] }, null, [], ["seq", { sourceInterval: [8740, 8785] }, ["app", { sourceInterval: [8740, 8765] }, "caseInsensitive", [["terminal", { sourceInterval: [8756, 8764] }, "VALUED"]]], ["not", { sourceInterval: [8770, 8785] }, ["app", { sourceInterval: [8771, 8785] }, "identifierPart", []]]]], kWHEN: ["define", { sourceInterval: [8790, 8845] }, null, [], ["seq", { sourceInterval: [8800, 8845] }, ["app", { sourceInterval: [8800, 8823] }, "caseInsensitive", [["terminal", { sourceInterval: [8816, 8822] }, "WHEN"]]], ["not", { sourceInterval: [8830, 8845] }, ["app", { sourceInterval: [8831, 8845] }, "identifierPart", []]]]], kWHERE: ["define", { sourceInterval: [8850, 8906] }, null, [], ["seq", { sourceInterval: [8861, 8906] }, ["app", { sourceInterval: [8861, 8885] }, "caseInsensitive", [["terminal", { sourceInterval: [8877, 8884] }, "WHERE"]]], ["not", { sourceInterval: [8891, 8906] }, ["app", { sourceInterval: [8892, 8906] }, "identifierPart", []]]]], number_real: ["define", { sourceInterval: [8973, 9043] }, null, [], ["seq", { sourceInterval: [8973, 9034] }, ["star", { sourceInterval: [8973, 8979] }, ["app", { sourceInterval: [8973, 8978] }, "digit", []]], ["terminal", { sourceInterval: [8980, 8983] }, "."], ["plus", { sourceInterval: [8984, 8990] }, ["app", { sourceInterval: [8984, 8989] }, "digit", []]], ["opt", { sourceInterval: [8991, 9034] }, ["seq", { sourceInterval: [8992, 9032] }, ["app", { sourceInterval: [8992, 9012] }, "caseInsensitive", [["terminal", { sourceInterval: [9008, 9011] }, "e"]]], ["opt", { sourceInterval: [9013, 9025] }, ["alt", { sourceInterval: [9014, 9023] }, ["terminal", { sourceInterval: [9014, 9017] }, "+"], ["terminal", { sourceInterval: [9020, 9023] }, "-"]]], ["plus", { sourceInterval: [9026, 9032] }, ["app", { sourceInterval: [9026, 9031] }, "digit", []]]]]]], number_whole: ["define", { sourceInterval: [9056, 9106] }, null, [], ["app", { sourceInterval: [9056, 9067] }, "wholeNumber", []]], number: ["define", { sourceInterval: [8942, 9106] }, "a number", [], ["alt", { sourceInterval: [8973, 9106] }, ["app", { sourceInterval: [8973, 9034] }, "number_real", []], ["app", { sourceInterval: [9056, 9067] }, "number_whole", []]]], wholeNumber: ["define", { sourceInterval: [9112, 9151] }, "a whole number", [], ["plus", { sourceInterval: [9145, 9151] }, ["app", { sourceInterval: [9145, 9150] }, "digit", []]]], identifierStart: ["define", { sourceInterval: [9157, 9187] }, null, [], ["alt", { sourceInterval: [9175, 9187] }, ["app", { sourceInterval: [9175, 9181] }, "letter", []], ["terminal", { sourceInterval: [9184, 9187] }, "_"]]], identifierPart: ["define", { sourceInterval: [9192, 9233] }, null, [], ["alt", { sourceInterval: [9210, 9233] }, ["app", { sourceInterval: [9210, 9225] }, "identifierStart", []], ["app", { sourceInterval: [9228, 9233] }, "digit", []]]], stringLiteral: ["define", { sourceInterval: [9239, 9363] }, "a string literal", [], ["alt", { sourceInterval: [9309, 9363] }, ["seq", { sourceInterval: [9309, 9331] }, ["terminal", { sourceInterval: [9309, 9313] }, '"'], ["star", { sourceInterval: [9314, 9326] }, ["seq", { sourceInterval: [9315, 9324] }, ["not", { sourceInterval: [9315, 9320] }, ["terminal", { sourceInterval: [9316, 9320] }, '"']], ["app", { sourceInterval: [9321, 9324] }, "any", []]]], ["terminal", { sourceInterval: [9327, 9331] }, '"']], ["seq", { sourceInterval: [9342, 9363] }, ["terminal", { sourceInterval: [9342, 9345] }, "'"], ["star", { sourceInterval: [9347, 9359] }, ["seq", { sourceInterval: [9348, 9357] }, ["not", { sourceInterval: [9348, 9352] }, ["terminal", { sourceInterval: [9349, 9352] }, "'"]], ["app", { sourceInterval: [9354, 9357] }, "any", []]]], ["terminal", { sourceInterval: [9360, 9363] }, "'"]]]], backQuote: ["define", { sourceInterval: [9369, 9389] }, null, [], ["terminal", { sourceInterval: [9381, 9389] }, "`"]] }]);
class Lr extends Error {
  constructor(t, r, i) {
    super(t);
    ve(this, "sourceRange");
    this.name = "N1QLParseError", typeof r == "number" ? this.sourceRange = [r, i ?? r] : Array.isArray(r) && r.sourceTextStart !== void 0 && (this.sourceRange = [r.sourceTextStart, r.sourceTextEnd ?? r.sourceTextStart]);
  }
}
function pI(n) {
  return dI(n, "SelectStatement");
}
function dI(n, e) {
  vI();
  let t = d0.match(n, e);
  if (t.failed())
    throw new Lr(t.shortMessage, t.getInterval().startIdx, t.getInterval().endIdx);
  return Oa(t).json();
}
let Oa;
function vI() {
  if (Oa !== void 0)
    return;
  Oa = d0.createSemantics();
  function n(i, o) {
    return Array.isArray(i) && (i.sourceTextStart = o.source.startIdx, i.sourceTextEnd = o.source.endIdx), i;
  }
  function e(i) {
    return n(i.json(), i);
  }
  function t(i) {
    return i.children.map(e);
  }
  function r(i) {
    return function(o, a, l) {
      return [i, e(o), e(l)];
    };
  }
  Oa.addOperation("json()", {
    // Select:
    SelectStatement(i, o, a, l, c, b, m, w, x, k, D) {
      let K = {
        WHAT: t(a.asIteration()),
        FROM: []
      };
      if (l.numChildren > 0 && (K.FROM = e(l.child(0))), o.numChildren > 0 && (K.DISTINCT = !0), b.numChildren > 0 && (K.WHERE = e(b.child(0))), m.numChildren > 0 && (K.GROUP_BY = t(m.child(0).child(2).asIteration())), w.numChildren > 0 && w.child(0).numChildren > 0 && (K.HAVING = e(w.child(0).child(0).child(1))), x.numChildren > 0 && (K.ORDER_BY = t(x.child(0).child(2).asIteration())), k.numChildren > 0) {
        let [C, M, J] = e(k.child(0));
        M !== null && (K.OFFSET = M), J !== null && (K.LIMIT = J);
      }
      return K;
    },
    SelectResult(i, o, a) {
      let l = e(i);
      return a.numChildren > 0 && (l = ["AS", l, e(a.child(0))]), l;
    },
    // Kludge: returns DataSource[], but it has to be typed as Expr
    FromClause(i, o, a) {
      const l = e(o);
      return a.numChildren === 0 ? [l] : [l, ...t(a)];
    },
    // Kludge: returns FromSource[], but it has to be typed as Expr
    CollectionSource(i, o, a, l, c) {
      let b;
      return a.numChildren > 0 ? b = { SCOPE: e(i), COLLECTION: e(a.child(0)) } : b = { COLLECTION: e(i) }, c.numChildren > 0 && (b.AS = e(c.child(0))), b;
    },
    // Kludge: returns JoinSource[], but it has to be typed as Expr
    Join(i, o, a, l, c) {
      const b = e(a);
      return i.numChildren > 0 ? b.JOIN = e(i.child(0)) : b.JOIN = "INNER", b.ON = e(c), b;
    },
    JoinType_inner(i) {
      return "INNER";
    },
    JoinType_outer(i, o) {
      return "OUTER";
    },
    JoinType_left(i, o) {
      return "LEFT OUTER";
    },
    JoinType_cross(i) {
      return "CROSS";
    },
    // Kludge: returns UnnestSource[], but it has to be typed as Expr
    Unnest(i, o, a, l) {
      const c = { UNNEST: e(o) };
      return l.numChildren > 0 && (c.AS = e(l.child(0))), c;
    },
    Ordering(i, o) {
      let a = e(i);
      return o.numChildren > 0 && o.child(0).sourceString.toUpperCase() === "DESC" && (a = ["DESC", a]), a;
    },
    LimitOffset_limitFirst(i, o, a, l) {
      let c = ["limitoffset", null, e(o)];
      return l.numChildren > 0 && (c[1] = e(l.child(0))), c;
    },
    LimitOffset_offsetFirst(i, o, a, l) {
      let c = ["limitoffset", e(o), null];
      return l.numChildren > 0 && (c[2] = e(l.child(0))), c;
    },
    // Expressions:
    OrExp_or: r("OR"),
    AndExp_and: r("AND"),
    EqExp_eq: r("="),
    EqExp_neq: r("!="),
    EqExp_isValued(i, o, a, l) {
      let c = ["IS VALUED", e(i)];
      return a.numChildren > 0 && (c = ["NOT", c]), c;
    },
    EqExp_isNot(i, o, a, l) {
      return ["IS NOT", e(i), e(l)];
    },
    EqExp_is: r("IS"),
    EqExp_like: r("LIKE"),
    EqExp_notLike(i, o, a, l) {
      return ["NOT", ["LIKE", e(i), e(l)]];
    },
    EqExp_notNull(i, o, a) {
      return ["IS NOT", i, null];
    },
    EqExp_inExpr(i, o, a) {
      return [o.sourceString.toUpperCase(), e(i), e(a)];
    },
    EqExp_inArray(i, o, a) {
      return [o.sourceString.toUpperCase(), e(i), e(a)];
    },
    EqExp_between(i, o, a, l, c, b) {
      let m = ["BETWEEN", e(i), e(l), e(b)];
      return o.numChildren > 0 && (m = ["NOT", m]), m;
    },
    RelExp_rel(i, o, a) {
      return [o.sourceString, e(i), e(a)];
    },
    BitExp_bit(i, o, a) {
      return [o.sourceString, e(i), e(a)];
    },
    AddExp_plus: r("+"),
    AddExp_minus: r("-"),
    MulExp_times: r("*"),
    MulExp_divide: r("/"),
    MulExp_modulo: r("%"),
    ConcatExp_concat: r("||"),
    PrimaryExp_paren(i, o, a) {
      return e(o);
    },
    PrimaryExp_pos(i, o) {
      return e(o);
    },
    PrimaryExp_neg(i, o) {
      return ["-", e(o)];
    },
    PrimaryExp_not(i, o) {
      return ["NOT", e(o)];
    },
    PrimaryExp_exists(i, o, a, l) {
      return ["EXISTS", e(a)];
    },
    parameter(i, o) {
      return ["$", e(o)];
    },
    variable(i, o) {
      return ["?", e(o)];
    },
    AnyEveryExp(i, o, a, l, c, b, m) {
      const w = e(o), x = e(b);
      return Zf(x, (k, D) => (k === "." && D[1] === w && (D[0] = "?"), !0)), [e(i), w, e(l), x];
    },
    AnyEvery_any(i) {
      return "ANY";
    },
    AnyEvery_every(i) {
      return "EVERY";
    },
    AnyEvery_anyEvery(i, o, a) {
      return "ANY AND EVERY";
    },
    CaseExp(i, o, a, l, c, b) {
      const m = ["CASE", o.numChildren > 0 ? e(o.child(0)) : null];
      for (const w of a.children)
        m.push(e(w.child(1))), m.push(e(w.child(3)));
      return c.numChildren > 0 && m.push(e(c.child(0))), m;
    },
    // Properties:
    Property_all(i) {
      return ["."];
    },
    Property_allInCollection(i, o, a) {
      return [".", e(i)];
    },
    //???
    PropertyPath(i, o) {
      return [".", e(i), ...t(o)];
    },
    PropertyPathContinuation_named(i, o) {
      return e(o);
    },
    PropertyPathContinuation_indexed(i, o, a) {
      return e(o);
    },
    // Functions:
    MetaFunction_plain(i, o, a, l) {
      const c = ["META()"];
      return a.numChildren > 0 && c.push(e(a.child(0))), c;
    },
    MetaFunction_property(i, o, a, l, c, b) {
      const m = ["META()"];
      return a.numChildren > 0 ? m.push(e(a.child(0))) : m.push(null), m.push(b.sourceString.toLowerCase()), m;
    },
    N1QLFunction(i, o, a, l) {
      return [e(i).toUpperCase() + "()", ...t(a.asIteration())];
    },
    // Literals:
    ArrayLiteral(i, o, a) {
      return ["[]", ...t(o.asIteration())];
    },
    DictLiteral(i, o, a) {
      const l = {};
      for (const c of o.asIteration().children)
        l[e(c.child(0))] = e(c.child(2));
      return l;
    },
    wholeNumber(i) {
      return parseInt(this.sourceString);
    },
    number(i) {
      return parseFloat(this.sourceString);
    },
    ident_unquoted(i, o) {
      return this.sourceString;
    },
    ident_quoted(i, o, a) {
      return o.sourceString;
    },
    stringLiteral(i, o, a) {
      return o.sourceString;
    },
    literal_true(i) {
      return !0;
    },
    literal_false(i) {
      return !1;
    },
    literal_null(i) {
      return null;
    },
    literal_missing(i) {
      return ["MISSING"];
    }
  });
}
class nh extends Error {
}
class v0 extends Error {
}
function g0(n) {
  return n in I0 || n in m0 || n in new y0(Math.random) || n in new sh(Math.random, Math.random) || n in ih;
}
function gI(n) {
  return !n.endsWith("()") && n in new sh(Math.random, Math.random);
}
function Tc(n, ...e) {
  if (!Array.isArray(n))
    return !1;
  for (let t = 0; t < e.length; ++t)
    if (n[t] !== e[t])
      return !1;
  return !0;
}
function dt(n, e) {
  if (!Array.isArray(n))
    return Ue(n !== void 0, "invalid Expr"), ta(n) ? () => n : II(n, e);
  const t = n[0];
  try {
    const r = m0[t];
    if (r !== void 0) {
      if (!e.allowCompilingAggregates)
        throw new Lr(`Illegal use of aggregate function ${t} outside result column`);
      const l = new r(n, dt(n[1], e));
      return e.compileAggregate(l);
    }
    const i = n.length - 1;
    if (i === 1) {
      const l = new y0(dt(n[1], e));
      if (l[t])
        return l[t].bind(l);
    } else if (i === 2) {
      const l = new sh(dt(n[1], e), dt(n[2], e));
      if (l[t])
        return l[t].bind(l);
    }
    const o = I0[t];
    if (o)
      return o(n, e);
    const a = ih[t];
    if (a)
      return mI(n, e, a);
    throw t.endsWith("()") ? g0(t) ? new Lr(`${t} cannot be called with ${i} arguments`) : new Lr(`"${t}" is not a supported function`) : new Lr(`unknown JSON query operator "${t}"`);
  } catch (r) {
    throw r instanceof Lr && r.sourceRange === void 0 && n.sourceTextStart && (r.sourceRange = [n.sourceTextStart, n.sourceTextEnd ?? n.sourceTextStart]), r;
  }
}
const ih = {};
function yI(n, e, t) {
  if (!n.match(/^[a-zA-Z][a-zA-Z0-9_]+$/))
    throw Error(`N1QL function name "${n}" is not valid. Must be alphanumeric.`);
  const r = n.toUpperCase() + "()";
  if (g0(r))
    throw Error(`N1QL function ${n} already exists.`);
  ih[r] = {
    implementation: e,
    options: {
      minimumArgs: (t == null ? void 0 : t.minimumArgs) ?? e.length,
      maximumArgs: (t == null ? void 0 : t.maximumArgs) ?? e.length,
      nondeterministic: (t == null ? void 0 : t.nondeterministic) ?? !1
    }
  };
}
function mI(n, e, t) {
  const r = n[0], i = en(n, e);
  return _i(
    i.length >= t.options.minimumArgs && i.length <= t.options.maximumArgs,
    `invalid argument count for ${r}`
  ), () => {
    try {
      return t.implementation(...i);
    } catch (o) {
      return console.error(`Exception thrown from user-defined N1QL function ${r}`, o), null;
    }
  };
}
var Re, pt, Tt, Ra, er;
class y0 {
  constructor(e) {
    ee(this, Re);
    ee(this, er);
    G(this, er, e);
  }
  // Enables method lookup by name
  //---- ARRAYS:
  "ARRAY_AVG()"() {
    return ye(this, Re, pt).call(this, Gm);
  }
  "ARRAY_COUNT()"() {
    return ye(this, Re, pt).call(this, Hm);
  }
  "ARRAY_IFNULL()"() {
    return ye(this, Re, pt).call(this, Wm);
  }
  "ARRAY_LENGTH()"() {
    return ye(this, Re, pt).call(this, Ym);
  }
  "ARRAY_MIN()"() {
    return ye(this, Re, pt).call(this, Jm);
  }
  "ARRAY_MAX()"() {
    return ye(this, Re, pt).call(this, Vm);
  }
  "ARRAY_SUM()"() {
    return ye(this, Re, pt).call(this, Zm);
  }
  EXISTS() {
    const e = p(this, er).call(this);
    return Array.isArray(e) && e.length > 0;
  }
  //---- LOGICAL:
  NOT() {
    return ye(this, Re, pt).call(this, (e) => !e);
  }
  //---- MATH:
  "+"() {
    return p(this, er).call(this);
  }
  "-"() {
    return ye(this, Re, Tt).call(this, (e) => -e);
  }
  "ABS()"() {
    return ye(this, Re, Tt).call(this, Math.abs);
  }
  "ACOS()"() {
    return ye(this, Re, Tt).call(this, Math.acos);
  }
  "ASIN()"() {
    return ye(this, Re, Tt).call(this, Math.asin);
  }
  "ATAN()"() {
    return ye(this, Re, Tt).call(this, Math.atan);
  }
  "CEIL()"() {
    return ye(this, Re, Tt).call(this, Math.ceil);
  }
  "COS()"() {
    return ye(this, Re, Tt).call(this, Math.cos);
  }
  "DEGREES()"() {
    return ye(this, Re, Tt).call(this, (e) => e * 180 / Math.PI);
  }
  "EXP()"() {
    return ye(this, Re, Tt).call(this, Math.exp);
  }
  "FLOOR()"() {
    return ye(this, Re, Tt).call(this, Math.floor);
  }
  "LN()"() {
    return ye(this, Re, Tt).call(this, Math.log);
  }
  "LOG()"() {
    return ye(this, Re, Tt).call(this, Math.log10);
  }
  "RADIANS()"() {
    return ye(this, Re, Tt).call(this, (e) => e * Math.PI / 180);
  }
  "ROUND()"() {
    return ye(this, Re, Tt).call(this, Math.round);
  }
  "ROUND_NEAREST()"() {
    return ye(this, Re, Tt).call(this, Math.round);
  }
  "ROUND_EVEN()"() {
    return ye(this, Re, Tt).call(this, Ug);
  }
  "SIGN()"() {
    return ye(this, Re, Tt).call(this, Math.sign);
  }
  "SIN()"() {
    return ye(this, Re, Tt).call(this, Math.sin);
  }
  "SQRT()"() {
    return ye(this, Re, Tt).call(this, Math.sqrt);
  }
  "TAN()"() {
    return ye(this, Re, Tt).call(this, Math.tan);
  }
  "TRUNC()"() {
    return ye(this, Re, Tt).call(this, Math.trunc);
  }
  //---- STRINGS:
  "LENGTH()"() {
    return ye(this, Re, Ra).call(this, p1);
  }
  "LOWER()"() {
    return ye(this, Re, Ra).call(this, (e) => e.toLowerCase());
  }
  "UPPER()"() {
    return ye(this, Re, Ra).call(this, (e) => e.toUpperCase());
  }
  //---- TYPES:
  "IS VALUED"() {
    return Sc(p(this, er).call(this));
  }
  "ISARRAY()"() {
    return ye(this, Re, pt).call(this, Array.isArray);
  }
  "ISATOM()"() {
    return ye(this, Re, pt).call(this, $d);
  }
  "ISBOOLEAN()"() {
    return ye(this, Re, pt).call(this, Ld);
  }
  "ISNUMBER()"() {
    return ye(this, Re, pt).call(this, qd);
  }
  "ISOBJECT()"() {
    return ye(this, Re, pt).call(this, Ud);
  }
  "ISSTRING()"() {
    return ye(this, Re, pt).call(this, Md);
  }
  "ISVALUED()"() {
    return Sc(p(this, er).call(this));
  }
  "TOARRAY()"() {
    return ye(this, Re, pt).call(this, jd);
  }
  "TOATOM()"() {
    return $a(p(this, er).call(this));
  }
  "TOBOOLEAN()"() {
    return ye(this, Re, pt).call(this, Kd);
  }
  "TONUMBER()"() {
    return ye(this, Re, pt).call(this, zd);
  }
  "TOOBJECT()"() {
    return ye(this, Re, pt).call(this, Gd);
  }
  "TOSTRING()"() {
    return ye(this, Re, pt).call(this, Hd);
  }
  "IS_ARRAY()"() {
    return ye(this, Re, pt).call(this, Array.isArray);
  }
  "IS_ATOM()"() {
    return ye(this, Re, pt).call(this, $d);
  }
  "IS_BOOLEAN()"() {
    return ye(this, Re, pt).call(this, Ld);
  }
  "IS_NUMBER()"() {
    return ye(this, Re, pt).call(this, qd);
  }
  "IS_OBJECT()"() {
    return ye(this, Re, pt).call(this, Ud);
  }
  "IS_STRING()"() {
    return ye(this, Re, pt).call(this, Md);
  }
  "IS_VALUED()"() {
    return Sc(p(this, er).call(this));
  }
  "TO_ARRAY()"() {
    return ye(this, Re, pt).call(this, jd);
  }
  "TO_ATOM()"() {
    return $a(p(this, er).call(this));
  }
  "TO_BOOLEAN()"() {
    return ye(this, Re, pt).call(this, Kd);
  }
  "TO_NUMBER()"() {
    return ye(this, Re, pt).call(this, zd);
  }
  "TO_OBJECT()"() {
    return ye(this, Re, pt).call(this, Gd);
  }
  "TO_STRING()"() {
    return ye(this, Re, pt).call(this, Hd);
  }
  "TYPE()"() {
    return Wd(p(this, er).call(this));
  }
  "TYPENAME()"() {
    return Wd(p(this, er).call(this));
  }
}
Re = new WeakSet(), pt = function(e) {
  const t = p(this, er).call(this);
  if (t !== void 0)
    return t === null ? null : e(t);
}, /** This is unaryOp further specialized for numeric functions. */
Tt = function(e) {
  const t = p(this, er).call(this);
  return typeof t == "number" ? e(t) : t === void 0 ? void 0 : null;
}, /** This is unaryOp further specialized for string functions. */
Ra = function(e) {
  const t = p(this, er).call(this);
  return typeof t == "string" ? e(t) : t === void 0 ? void 0 : null;
}, er = new WeakMap();
var ut, Pr, Er, Os, Ur, $r;
class sh {
  constructor(e, t) {
    ee(this, ut);
    ee(this, Ur);
    ee(this, $r);
    G(this, Ur, e), G(this, $r, t);
  }
  // Enables method lookup by name
  //---- ARRAYS:
  "ARRAY_CONTAINS()"() {
    return ye(this, ut, Pr).call(this, Bg);
  }
  //---- COMPARISON:
  "="() {
    return ye(this, ut, Pr).call(this, Pn);
  }
  "!="() {
    return ye(this, ut, Pr).call(this, (e, t) => !Pn(e, t));
  }
  // These are undocumented but the N1QL test suite calls them...
  "EQ()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Pn(e, t));
  }
  "LT()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Wt(e, t) < 0);
  }
  "LE()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Wt(e, t) <= 0);
  }
  "GT()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Wt(e, t) > 0);
  }
  "GE()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Wt(e, t) >= 0);
  }
  "<"() {
    return ye(this, ut, Pr).call(this, (e, t) => Wt(e, t) < 0);
  }
  "<="() {
    return ye(this, ut, Pr).call(this, (e, t) => Wt(e, t) <= 0);
  }
  ">"() {
    return ye(this, ut, Pr).call(this, (e, t) => Wt(e, t) > 0);
  }
  ">="() {
    return ye(this, ut, Pr).call(this, (e, t) => Wt(e, t) >= 0);
  }
  "MISSINGIF()"() {
    return Qm(p(this, Ur).call(this), p(this, $r).call(this));
  }
  "NULLIF()"() {
    return Xm(p(this, Ur).call(this), p(this, $r).call(this));
  }
  //---- LOGICAL:
  AND() {
    const e = p(this, Ur).call(this);
    if (!e)
      return e === void 0 ? void 0 : e === null ? null : !1;
    const t = p(this, $r).call(this);
    return t ? !0 : t === void 0 ? void 0 : t === null ? null : !1;
  }
  OR() {
    const e = p(this, Ur).call(this);
    if (e) return !0;
    if (e === void 0) return;
    if (e === null) return null;
    const t = p(this, $r).call(this);
    return t ? !0 : t === void 0 ? void 0 : t === null ? null : !1;
  }
  //---- MATH:
  "+"() {
    return ye(this, ut, Er).call(this, (e, t) => e + t);
  }
  "-"() {
    return ye(this, ut, Er).call(this, (e, t) => e - t);
  }
  "*"() {
    return ye(this, ut, Er).call(this, (e, t) => e * t);
  }
  "/"() {
    return ye(this, ut, Er).call(this, a1);
  }
  "%"() {
    return ye(this, ut, Er).call(this, (e, t) => e % t);
  }
  "ATAN2()"() {
    return ye(this, ut, Er).call(this, Math.atan2);
  }
  "POWER()"() {
    return ye(this, ut, Er).call(this, Math.pow);
  }
  "DIV()"() {
    return ye(this, ut, Er).call(this, (e, t) => e / t);
  }
  "IDIV()"() {
    return ye(this, ut, Er).call(this, c1);
  }
  "ROUND()"() {
    return ye(this, ut, Er).call(this, Fd);
  }
  "ROUND_NEAREST()"() {
    return ye(this, ut, Er).call(this, Fd);
  }
  "ROUND_EVEN()"() {
    return ye(this, ut, Er).call(this, Ug);
  }
  "TRUNC()"() {
    return ye(this, ut, Er).call(this, f1);
  }
  "COSINE_DISTANCE()"() {
    return l1(p(this, Ur).call(this), p(this, $r).call(this));
  }
  //---- STRINGS:
  "||"() {
    return ye(this, ut, Os).call(this, (e, t) => e + t);
  }
  "CONTAINS()"() {
    return ye(this, ut, Os).call(this, (e, t) => e.includes(t));
  }
  "LTRIM()"() {
    return ye(this, ut, Os).call(this, jg);
  }
  "RTRIM()"() {
    return ye(this, ut, Os).call(this, Kg);
  }
  "TRIM()"() {
    return ye(this, ut, Os).call(this, d1);
  }
}
ut = new WeakSet(), /** Helper function for compiling binary operators. Takes the args as CompiledExprs and a function.
 *  At runtime, if either arg is `undefined`, returns undefined.
 *  Else if either is `null`, returns null.
 *  Else applies the function to the args. */
Pr = function(e) {
  const t = p(this, Ur).call(this), r = p(this, $r).call(this);
  if (!(t === void 0 || r === void 0))
    return t === null || r === null ? null : e(t, r);
}, /** This is binaryOp further specialized for numeric functions. */
Er = function(e) {
  const t = p(this, Ur).call(this), r = p(this, $r).call(this);
  return typeof t == "number" && typeof r == "number" ? e(t, r) : t === void 0 || r === void 0 ? void 0 : null;
}, /** This is binaryOp further specialized for string functions. */
Os = function(e) {
  const t = p(this, Ur).call(this), r = p(this, $r).call(this);
  return typeof t == "string" && typeof r == "string" ? e(t, r) : t === void 0 || r === void 0 ? void 0 : null;
}, Ur = new WeakMap(), $r = new WeakMap();
const m0 = {
  "ARRAY_AGG()": Hf,
  "AVG()": ef,
  "COUNT()": Wf,
  "MAX()": Yf,
  "MIN()": Vf,
  "SUM()": Jf
}, I0 = {
  ".": bI,
  "?": _I,
  "[]": cv,
  $: (n, e) => {
    const t = gi(n[1], "$");
    return e.parameterNames.add(t), () => {
      const r = e.parameters.get(t);
      if (r === void 0)
        throw new v0(`undefined query parameter $${t}`);
      return r;
    };
  },
  "_.": ([n, e, t], r) => {
    const i = dt(e, r), o = gi(t, "2nd arg of '_.'");
    return () => {
      const a = i();
      return xI(a) ? a[o] : void 0;
    };
  },
  ANY: Cc,
  EVERY: Cc,
  "ANY AND EVERY": Cc,
  BETWEEN: fv,
  "BETWEEN()": fv,
  CASE: (n, e) => {
    const t = n.length - 1, r = en(n, e);
    return n[1] === null ? () => {
      let i;
      for (i = 1; i + 1 < t; i += 2)
        if (r[i]())
          return r[i + 1]();
      return i < t ? r[i]() : null;
    } : () => {
      const i = r[0]();
      let o;
      for (o = 1; o + 1 < t; o += 2)
        if (Pn(i, r[o]()))
          return r[o + 1]();
      return o < t ? r[o]() : null;
    };
  },
  EXISTS: (n, e) => {
    throw new Lr("sorry, EXISTS is currently unimplemented");
  },
  IN: vv,
  "NOT IN": vv,
  IS: gv,
  "IS NOT": gv,
  LIKE: yv,
  MISSING: () => () => {
  },
  //---- Functions with variable numbers of arguments or other special handling:
  "ARRAY()": cv,
  "E()": () => () => Math.E,
  "PI()": () => () => Math.PI,
  "CONCAT()": (n, e) => {
    const t = en(n, e);
    return () => {
      const r = [];
      for (const i of t) {
        const o = i();
        if (o === void 0) return;
        if (typeof o != "string") return null;
        r.push(o);
      }
      return r.join("");
    };
  },
  "DATE_ADD_MILLIS()": pv,
  "DATE_ADD_STR()": pv,
  "DATE_DIFF_MILLIS()": dv,
  "DATE_DIFF_STR()": dv,
  "MILLIS_TO_STR()": mv,
  "MILLIS_TO_UTC()": mv,
  "STR_TO_MILLIS()": Iv,
  "STR_TO_UTC()": Iv,
  "MILLIS_TO_TZ()": ([n, e, t], r) => {
    const i = dt(e, r), o = dt(t, r);
    return () => {
      const a = i(), l = o();
      return typeof a != "number" || typeof l != "string" ? null : Mg(a, l);
    };
  },
  "STR_TO_TZ()": ([n, e, t], r) => {
    const i = dt(e, r), o = dt(t, r);
    return () => {
      const a = i(), l = o();
      return typeof a != "string" || typeof l != "string" ? null : o1(a, l);
    };
  },
  "EUCLIDEAN_DISTANCE()": ([n, e, t, r], i) => {
    const o = dt(e, i), a = dt(t, i);
    return r !== void 0 && (r = bv(r, "3rd arg (power) to EUCLIDEAN_DISTANCE()")), () => u1(o(), a(), r);
  },
  "GREATEST()": (n, e) => {
    const t = en(n, e);
    return () => Bd(t, 1);
  },
  "IFMISSING()": (n, e) => {
    const t = en(n, e);
    return () => {
      for (const r of t) {
        const i = r();
        if (i !== void 0) return i;
      }
      return null;
    };
  },
  "IFNULL()": (n, e) => {
    const t = en(n, e);
    return () => {
      for (const r of t) {
        const i = r();
        if (i !== null) return i;
      }
      return null;
    };
  },
  "IFMISSINGORNULL()": hv,
  "COALESCE()": hv,
  "LEAST()": (n, e) => {
    const t = en(n, e);
    return () => Bd(t, -1);
  },
  "LIKE()": yv,
  "META()": ([n, e, t], r) => (e = gi(e, "data source in 'META()'"), _i(
    r.sourceTypes.get(e) !== "unnest",
    "META() cannot be used on an UNNEST"
  ), t !== void 0 && _i(
    ["id", "sequence", "deleted", "expires"].includes(t),
    `invalid META() property "${t}"`
  ), () => {
    var o;
    let i = (o = r.row) == null ? void 0 : o.getSourceRevision(e);
    if (i === void 0 || i.id === void 0)
      throw new nh(`"META(${e})" is not available`);
    switch (t) {
      case "id":
        return i.id;
      case "sequence":
        return i.seq;
      case "deleted":
        return ((i.flags ?? 0) & Sr) !== 0;
      case "expires":
        return i.expires;
      case void 0: {
        const a = {
          id: i.id,
          sequence: i.seq
        };
        return Bi(i) && (a.deleted = !0), i.expires !== void 0 && (a.expires = i.expires), a;
      }
      default:
        return;
    }
  }),
  "REGEXP_CONTAINS()": Nc,
  "REGEXP_LIKE()": Nc,
  "REGEXP_POSITION()": Nc,
  "REGEXP_REPLACE()": ([n, e, t, r, i], o) => {
    const a = dt(e, o), l = RegExp(gi(t, "arg 2 of REGEXP_REPLACE()"), "g"), c = dt(r, o), b = i !== void 0 ? bv(i, "arg 4 of REGEXP_REPLACE()") : 1e9;
    return () => {
      const m = a(), w = c();
      if (typeof m != "string" || typeof w != "string")
        return m;
      let x = 1;
      return m.replace(l, (k) => x++ <= b ? w : k);
    };
  }
};
function Cc([n, e, t, r], i) {
  const o = n === "ANY", a = n === "ANY AND EVERY";
  e = gi(e, `variable name in ${n}`);
  const l = dt(t, i), c = dt(r, i);
  return () => {
    const b = l();
    if (!Array.isArray(b) || a && b.length === 0)
      return !1;
    try {
      for (const m of b)
        if (i.variables[e] = m, c()) {
          if (o) return !0;
        } else if (!o) return !1;
      return !o;
    } finally {
      delete i.variables[e];
    }
  };
}
function cv(n, e) {
  if (b0(n)) {
    const t = n.slice(1);
    return Object.freeze(t), () => t;
  } else {
    const t = en(n, e);
    return () => {
      const r = [];
      for (const i of t) {
        const o = i();
        if (o === void 0) return;
        r.push(o);
      }
      return r;
    };
  }
}
function fv([n, e, t, r], i) {
  const o = dt(e, i), a = dt(t, i), l = dt(r, i);
  return () => {
    let c = o(), b = a(), m = l();
    if (!(c === void 0 || b === void 0 || m === void 0))
      return c === null || b === null || m === null ? null : Wt(b, c) <= 0 && Wt(m, c) >= 0;
  };
}
function hv(n, e) {
  const t = en(n, e);
  return () => {
    for (const r of t) {
      const i = r();
      if (i != null) return i;
    }
    return null;
  };
}
function pv(n, e) {
  const t = en(n, e);
  return () => {
    const r = t[0](), i = t[1](), o = t[2]();
    return typeof r != "string" && typeof r != "number" || typeof i != "number" || typeof o != "string" ? null : r1(r, i, o);
  };
}
function dv(n, e) {
  const t = en(n, e);
  return () => {
    const r = t[0](), i = t[1](), o = t[2]();
    return typeof r != "string" && typeof r != "number" || typeof i != "string" && typeof i != "number" || typeof o != "string" ? null : n1(r, i, o);
  };
}
function II(n, e) {
  const t = /* @__PURE__ */ new Map();
  let r = !1;
  for (const i of Object.getOwnPropertyNames(n)) {
    const o = n[i];
    ta(o) ? t.set(i, o) : (t.set(i, dt(o, e)), r = !0);
  }
  return r ? () => {
    const i = {};
    for (let [o, a] of t) {
      let l;
      if (typeof a == "function") {
        if (l = a(), l === void 0) continue;
      } else
        l = a;
      i[o] = l;
    }
    return i;
  } : (Object.freeze(n), () => n);
}
function vv([n, e, t], r) {
  _i(Array.isArray(t), "invalid right-hand-side of IN");
  const i = n === "IN", o = dt(e, r);
  if (t[0] === "[]")
    if (b0(t)) {
      const a = new Set(t.slice(1));
      return () => {
        const l = o();
        return l == null ? l : a.has(l) === i;
      };
    } else {
      const a = t.map((l) => dt(l, r));
      return () => {
        const l = o();
        return l == null ? l : a.some((c) => Pn(c(), l)) === i;
      };
    }
  else {
    const a = dt(t, r);
    return () => {
      const l = o(), c = a();
      if (!(l === void 0 || c === void 0))
        return l === null || !Array.isArray(c) ? null : Bg(c, l) === i;
    };
  }
}
function gv([n, e, t], r) {
  const i = n === "IS", o = dt(e, r);
  if (t === null)
    return () => {
      const a = o();
      return a === void 0 ? void 0 : a === null === i;
    };
  if (Array.isArray(t) && t[0] === "MISSING")
    return () => o() === void 0 === i;
  {
    const a = dt(t, r);
    return () => Pn(o(), a()) === i;
  }
}
function yv([n, e, t], r) {
  const i = dt(e, r);
  if (typeof t == "string") {
    const [o, a] = Gf(t);
    switch (o) {
      case 0:
        return () => Sa(i, (l) => l === a);
      case 1:
        return () => Sa(i, (l) => l.startsWith(a));
      case 2:
        return () => Sa(i, (l) => l.endsWith(a));
      default: {
        const l = $g(a);
        return () => Sa(i, (c) => l.test(c));
      }
    }
  } else {
    const o = dt(t, r);
    return () => wI(i, o, h1);
  }
}
function bI([n, e, ...t], r) {
  e = gi(e, "data source in '.'");
  const i = t, o = r.results.get(e);
  if (o !== void 0)
    return i.length === 0 ? o : () => lf(i, o());
  {
    const a = r.sourceTypes.get(e) !== "unnest";
    return () => {
      var c;
      let l = (c = r.row) == null ? void 0 : c.dataSources.get(e);
      if (l === void 0)
        throw new nh(`"${e}" is not available, in property "${e}.${i.join(".")}"`);
      return l = a ? l.body : l, lf(i, l);
    };
  }
}
function mv([n, e, t], r) {
  _i(t === void 0, `format strings are not supported in ${n}`);
  const i = dt(e, r), o = n === "MILLIS_TO_STR()" ? qg : Kf;
  return () => {
    const a = i();
    return typeof a != "number" ? null : o(a);
  };
}
function Iv([n, e, t], r) {
  _i(t === void 0, `format strings are not supported in ${n}`);
  const i = dt(e, r), o = n === "STR_TO_MILLIS()" ? i1 : s1;
  return () => {
    const a = i();
    return typeof a != "string" ? null : o(a);
  };
}
function Nc([n, e, t], r) {
  const i = dt(e, r);
  let o = gi(t, `arg 2 of ${n}`);
  n === "REGEXP_LIKE()" && (o = `^${o}$`);
  let a;
  try {
    a = RegExp(o);
  } catch (l) {
    throw l instanceof SyntaxError ? new Lr(`invalid regular expression "${t}"`) : l;
  }
  return n === "REGEXP_POSITION()" ? () => {
    const l = i();
    return typeof l == "string" ? l.search(a) : -1;
  } : () => {
    const l = i();
    return typeof l == "string" && a.test(l);
  };
}
function _I(n, e) {
  const t = gi(n[1], "?"), r = n.slice(2);
  return () => {
    const i = e.variables[t];
    if (i === void 0) throw new Lr(`undefined variable ?${t}`);
    return lf(r, i);
  };
}
function lf(n, e) {
  for (const t of n)
    if (Array.isArray(e)) {
      if (typeof t != "number")
        return;
      t >= 0 ? e = e[t] : e = e[e.length + t];
    } else if (typeof e == "object" && e !== null) {
      if (typeof t != "string")
        return;
      e = e[t];
    } else
      return;
  return e;
}
function _i(n, e) {
  if (!n)
    throw new Lr(e);
}
function bv(n, e) {
  return _i(typeof n == "number", `${e} must be a number`), n;
}
function gi(n, e) {
  return _i(typeof n == "string", `${e} must be a string`), n;
}
function en(n, e) {
  return n.slice(1).map((t) => dt(t, e));
}
function b0(n) {
  return n.every(ta);
}
function Sa(n, e) {
  const t = n();
  return typeof t == "string" ? e(t) : t === void 0 ? void 0 : null;
}
function wI(n, e, t) {
  const r = n(), i = e();
  return typeof r == "string" && typeof i == "string" ? t(r, i) : r === void 0 || i === void 0 ? void 0 : null;
}
function xI(n) {
  return typeof n == "object" && !Array.isArray(n) && n !== null;
}
var qi;
class Ga {
  constructor() {
    ve(this, "sourceTypes", /* @__PURE__ */ new Map());
    // Types of the data sources
    ve(this, "parameterNames", /* @__PURE__ */ new Set());
    // Names of all "$" parameters
    ve(this, "variables", {});
    // "?" variables inside ANY/EVERY
    ve(this, "results", /* @__PURE__ */ new Map());
    // Maps result alias to expression
    ve(this, "parameters", /* @__PURE__ */ new Map());
    // query parameters, set at runtime
    /** Per-row state. Only exists while processing a row during a query. */
    ve(this, "row");
    ve(this, "allowCompilingAggregates", !1);
    ee(this, qi, []);
  }
  /** Compiles an Expr, returning a function that when called returns its value, incorporating the
   *  current state of the EvalContext.
   *  The function's `sourceExpression` property will point back to `expr` for later reference.
   *  > Note:  `expr` must be normalized; in particular, operation names must be uppercase. */
  compile(e) {
    let t = dt(e, this);
    return t.sourceExpression === void 0 && (t.sourceExpression = e), t;
  }
  /** Same as `compile`, but allows aggregate functions to be compiled. */
  compileWithAggregates(e) {
    this.allowCompilingAggregates = !0;
    try {
      return this.compile(e);
    } finally {
      this.allowCompilingAggregates = !1;
    }
  }
  /** Given an Aggregate instance, returns the compiled form of its Expression. */
  compileAggregate(e) {
    const t = p(this, qi).length;
    return p(this, qi).push(e), () => {
      var i;
      const r = (i = this.row) == null ? void 0 : i.aggregates;
      return yr(
        r !== void 0,
        "aggregate function called outside aggregation context"
      ), r[t].result;
    };
  }
  get hasAggregators() {
    return p(this, qi).length > 0;
  }
  /** Returns a copy of the `aggregatorsTemplate`. */
  copyAggregates() {
    return p(this, qi).map((e) => e.clone());
  }
}
qi = new WeakMap();
class yo {
  constructor(e) {
    ve(this, "dataSources", /* @__PURE__ */ new Map());
    ve(this, "aggregates");
    this.ctx = e;
  }
  /** Evaluates an expression with this state. */
  eval(e) {
    return this.use(e);
  }
  /** Loads this state into its EvalContext, calls the expression, then unloads the state. */
  use(e) {
    this.ctx.row = this;
    try {
      return e();
    } finally {
      this.ctx.row = void 0;
    }
  }
  getSourceRevision(e) {
    return this.dataSources.get(e);
  }
  clone() {
    let e = new yo(this.ctx);
    for (const [t, r] of this.dataSources)
      e.dataSources.set(t, r);
    return e.aggregates = this.aggregates, e;
  }
}
function Bt(n) {
  if (typeof n == "function")
    return n.sourceExpression ? Bt(n.sourceExpression) : "<expression>";
  if (Array.isArray(n)) {
    const e = n[0];
    switch (e) {
      case "$":
        return "$" + _v(n);
      case "?":
        return n[1];
      case "MISSING":
        return e;
      case "NOT":
        return "NOT " + Bt(n[1]);
      case ".":
        return n.length === 2 ? n[1] + ".*" : _v(n);
      case "META()": {
        let t = `META(${n[1]})`;
        return n[2] && (t += "." + n[2]), t;
      }
      default:
        return e.endsWith("()") ? e.slice(0, -2) + "(" + n.slice(1).map(Bt).join(", ") + ")" : gI(e) ? Bt(n[1]) + " " + e + " " + Bt(n[2]) : e === "-" || e === "+" ? e + Bt(n[1]) : e + "[" + n.slice(1).map(Bt).join(", ") + "]";
    }
  } else return ta(n) ? JSON.stringify(n) : "{" + Object.getOwnPropertyNames(n).map((e) => JSON.stringify(e) + ": " + Bt(n[e])).join(", ") + "}";
}
function _v(n) {
  return n.slice(1).map((e) => typeof e == "number" ? `[${e}]` : e).join(".");
}
class _0 {
  constructor(e, t) {
    this.sourceExpression = e, this.key = t;
  }
}
class ra extends _0 {
  get includeMin() {
    return !0;
  }
  get includeMax() {
    return !0;
  }
}
class wv extends ra {
  constructor(e, t, r) {
    super(e, t), this.valueExpr = r;
  }
  value() {
    return this.valueExpr();
  }
  get minValue() {
    return this.value();
  }
  get maxValue() {
    return this.value();
  }
  get generality() {
    return 1;
  }
  applyTo(e) {
    const t = Ha(this.value());
    return t !== void 0 ? e.equals(t) : void 0;
  }
  toString() {
    return `${this.key} = ${Bt(this.valueExpr)}`;
  }
}
class EI extends ra {
  constructor(e, t, r) {
    super(e, t), this.prefix = r;
  }
  get minValue() {
    return this.prefix;
  }
  get maxValue() {
    return this.prefix + "￿";
  }
  get generality() {
    return 2;
  }
  applyTo(e) {
    return e.startsWith(this.prefix);
  }
  toString() {
    return `${this.key} starts with ${JSON.stringify(this.prefix)}`;
  }
}
class Pc extends ra {
  constructor(e, t, r, i, o = !0, a = !0) {
    super(e, t), this.minValueExpr = r, this.maxValueExpr = i, this.includeMin_ = o, this.includeMax_ = a, Ue(r || i);
  }
  get minValue() {
    return this.minValueExpr ? this.minValueExpr() : void 0;
  }
  get maxValue() {
    return this.maxValueExpr ? this.maxValueExpr() : void 0;
  }
  get includeMin() {
    return this.includeMin_;
  }
  get includeMax() {
    return this.includeMax_;
  }
  get generality() {
    return 4 + (this.minValueExpr ? -1 : 0) + (this.maxValueExpr ? -1 : 0);
  }
  applyTo(e) {
    const t = Ha(this.minValue), r = Ha(this.maxValue);
    return this.minValueExpr ? t === void 0 ? void 0 : this.maxValueExpr !== void 0 ? r === void 0 ? void 0 : e.between(t, r, this.includeMin, this.includeMax) : this.includeMin ? e.aboveOrEqual(t) : e.above(t) : this.maxValueExpr !== void 0 ? r === void 0 ? void 0 : this.includeMax ? e.belowOrEqual(r) : e.below(r) : void 0;
  }
  toString() {
    const e = this.minValueExpr ? Bt(this.minValueExpr) : "", t = this.maxValueExpr ? Bt(this.maxValueExpr) : "", r = this.includeMin ? "[" : "(", i = this.includeMax ? "]" : ")";
    return `${this.key} in range ${r}${e} ... ${t}${i}`;
  }
}
function Ha(n) {
  return typeof n == "number" || typeof n == "string" || Array.isArray(n) ? n : void 0;
}
class Dc extends _0 {
  constructor(e, t, r) {
    super(e, t), this.itemExpr = r;
  }
  itemValue() {
    return this.itemExpr();
  }
  get generality() {
    return 1;
  }
  applyTo(e) {
    const t = Ha(this.itemValue());
    return t !== void 0 ? e.equals(t).distinct() : void 0;
  }
  toString() {
    return `${Bt(this.itemExpr)} IN ${this.key}`;
  }
}
var Ta = { exports: {} }, SI = Ta.exports, xv;
function AI() {
  return xv || (xv = 1, function(n, e) {
    (function(t, r) {
      n.exports = r();
    })(SI, function() {
      var t = function(s, u) {
        return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(h, g) {
          h.__proto__ = g;
        } || function(h, g) {
          for (var I in g) Object.prototype.hasOwnProperty.call(g, I) && (h[I] = g[I]);
        })(s, u);
      }, r = function() {
        return (r = Object.assign || function(s) {
          for (var u, h = 1, g = arguments.length; h < g; h++) for (var I in u = arguments[h]) Object.prototype.hasOwnProperty.call(u, I) && (s[I] = u[I]);
          return s;
        }).apply(this, arguments);
      };
      function i(s, u, h) {
        for (var g, I = 0, E = u.length; I < E; I++) !g && I in u || ((g = g || Array.prototype.slice.call(u, 0, I))[I] = u[I]);
        return s.concat(g || Array.prototype.slice.call(u));
      }
      var o = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : xf, a = Object.keys, l = Array.isArray;
      function c(s, u) {
        return typeof u != "object" || a(u).forEach(function(h) {
          s[h] = u[h];
        }), s;
      }
      typeof Promise > "u" || o.Promise || (o.Promise = Promise);
      var b = Object.getPrototypeOf, m = {}.hasOwnProperty;
      function w(s, u) {
        return m.call(s, u);
      }
      function x(s, u) {
        typeof u == "function" && (u = u(b(s))), (typeof Reflect > "u" ? a : Reflect.ownKeys)(u).forEach(function(h) {
          D(s, h, u[h]);
        });
      }
      var k = Object.defineProperty;
      function D(s, u, h, g) {
        k(s, u, c(h && w(h, "get") && typeof h.get == "function" ? { get: h.get, set: h.set, configurable: !0 } : { value: h, configurable: !0, writable: !0 }, g));
      }
      function K(s) {
        return { from: function(u) {
          return s.prototype = Object.create(u.prototype), D(s.prototype, "constructor", s), { extend: x.bind(null, s.prototype) };
        } };
      }
      var C = Object.getOwnPropertyDescriptor, M = [].slice;
      function J(s, u, h) {
        return M.call(s, u, h);
      }
      function X(s, u) {
        return u(s);
      }
      function le(s) {
        if (!s) throw new Error("Assertion Failed");
      }
      function ce(s) {
        o.setImmediate ? setImmediate(s) : setTimeout(s, 0);
      }
      function fe(s, u) {
        if (typeof u == "string" && w(s, u)) return s[u];
        if (!u) return s;
        if (typeof u != "string") {
          for (var h = [], g = 0, I = u.length; g < I; ++g) {
            var E = fe(s, u[g]);
            h.push(E);
          }
          return h;
        }
        var O = u.indexOf(".");
        if (O !== -1) {
          var N = s[u.substr(0, O)];
          return N == null ? void 0 : fe(N, u.substr(O + 1));
        }
      }
      function oe(s, u, h) {
        if (s && u !== void 0 && !("isFrozen" in Object && Object.isFrozen(s))) if (typeof u != "string" && "length" in u) {
          le(typeof h != "string" && "length" in h);
          for (var g = 0, I = u.length; g < I; ++g) oe(s, u[g], h[g]);
        } else {
          var E, O, N = u.indexOf(".");
          N !== -1 ? (E = u.substr(0, N), (O = u.substr(N + 1)) === "" ? h === void 0 ? l(s) && !isNaN(parseInt(E)) ? s.splice(E, 1) : delete s[E] : s[E] = h : oe(N = !(N = s[E]) || !w(s, E) ? s[E] = {} : N, O, h)) : h === void 0 ? l(s) && !isNaN(parseInt(u)) ? s.splice(u, 1) : delete s[u] : s[u] = h;
        }
      }
      function ke(s) {
        var u, h = {};
        for (u in s) w(s, u) && (h[u] = s[u]);
        return h;
      }
      var De = [].concat;
      function Ce(s) {
        return De.apply([], s);
      }
      var Jt = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(Ce([8, 16, 32, 64].map(function(s) {
        return ["Int", "Uint", "Float"].map(function(u) {
          return u + s + "Array";
        });
      }))).filter(function(s) {
        return o[s];
      }), $e = new Set(Jt.map(function(s) {
        return o[s];
      })), Be = null;
      function Se(s) {
        return Be = /* @__PURE__ */ new WeakMap(), s = function u(h) {
          if (!h || typeof h != "object") return h;
          var g = Be.get(h);
          if (g) return g;
          if (l(h)) {
            g = [], Be.set(h, g);
            for (var I = 0, E = h.length; I < E; ++I) g.push(u(h[I]));
          } else if ($e.has(h.constructor)) g = h;
          else {
            var O, N = b(h);
            for (O in g = N === Object.prototype ? {} : Object.create(N), Be.set(h, g), h) w(h, O) && (g[O] = u(h[O]));
          }
          return g;
        }(s), Be = null, s;
      }
      var Me = {}.toString;
      function ot(s) {
        return Me.call(s).slice(8, -1);
      }
      var vt = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", we = typeof vt == "symbol" ? function(s) {
        var u;
        return s != null && (u = s[vt]) && u.apply(s);
      } : function() {
        return null;
      };
      function He(s, u) {
        return u = s.indexOf(u), 0 <= u && s.splice(u, 1), 0 <= u;
      }
      var Ke = {};
      function It(s) {
        var u, h, g, I;
        if (arguments.length === 1) {
          if (l(s)) return s.slice();
          if (this === Ke && typeof s == "string") return [s];
          if (I = we(s)) {
            for (h = []; !(g = I.next()).done; ) h.push(g.value);
            return h;
          }
          if (s == null) return [s];
          if (typeof (u = s.length) != "number") return [s];
          for (h = new Array(u); u--; ) h[u] = s[u];
          return h;
        }
        for (u = arguments.length, h = new Array(u); u--; ) h[u] = arguments[u];
        return h;
      }
      var Ve = typeof Symbol < "u" ? function(s) {
        return s[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, _t = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], qr = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(_t), Xe = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function Ze(s, u) {
        this.name = s, this.message = u;
      }
      function wt(s, u) {
        return s + ". Errors: " + Object.keys(u).map(function(h) {
          return u[h].toString();
        }).filter(function(h, g, I) {
          return I.indexOf(h) === g;
        }).join(`
`);
      }
      function gt(s, u, h, g) {
        this.failures = u, this.failedKeys = g, this.successCount = h, this.message = wt(s, u);
      }
      function We(s, u) {
        this.name = "BulkError", this.failures = Object.keys(u).map(function(h) {
          return u[h];
        }), this.failuresByPos = u, this.message = wt(s, this.failures);
      }
      K(Ze).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), K(gt).from(Ze), K(We).from(Ze);
      var lt = qr.reduce(function(s, u) {
        return s[u] = u + "Error", s;
      }, {}), Pe = Ze, he = qr.reduce(function(s, u) {
        var h = u + "Error";
        function g(I, E) {
          this.name = h, I ? typeof I == "string" ? (this.message = "".concat(I).concat(E ? `
 ` + E : ""), this.inner = E || null) : typeof I == "object" && (this.message = "".concat(I.name, " ").concat(I.message), this.inner = I) : (this.message = Xe[u] || h, this.inner = null);
        }
        return K(g).from(Pe), s[u] = g, s;
      }, {});
      he.Syntax = SyntaxError, he.Type = TypeError, he.Range = RangeError;
      var Fe = _t.reduce(function(s, u) {
        return s[u + "Error"] = he[u], s;
      }, {}), et = qr.reduce(function(s, u) {
        return ["Syntax", "Type", "Range"].indexOf(u) === -1 && (s[u + "Error"] = he[u]), s;
      }, {});
      function me() {
      }
      function je(s) {
        return s;
      }
      function yt(s, u) {
        return s == null || s === je ? u : function(h) {
          return u(s(h));
        };
      }
      function ht(s, u) {
        return function() {
          s.apply(this, arguments), u.apply(this, arguments);
        };
      }
      function ct(s, u) {
        return s === me ? u : function() {
          var h = s.apply(this, arguments);
          h !== void 0 && (arguments[0] = h);
          var g = this.onsuccess, I = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var E = u.apply(this, arguments);
          return g && (this.onsuccess = this.onsuccess ? ht(g, this.onsuccess) : g), I && (this.onerror = this.onerror ? ht(I, this.onerror) : I), E !== void 0 ? E : h;
        };
      }
      function st(s, u) {
        return s === me ? u : function() {
          s.apply(this, arguments);
          var h = this.onsuccess, g = this.onerror;
          this.onsuccess = this.onerror = null, u.apply(this, arguments), h && (this.onsuccess = this.onsuccess ? ht(h, this.onsuccess) : h), g && (this.onerror = this.onerror ? ht(g, this.onerror) : g);
        };
      }
      function Le(s, u) {
        return s === me ? u : function(h) {
          var g = s.apply(this, arguments);
          c(h, g);
          var I = this.onsuccess, E = this.onerror;
          return this.onsuccess = null, this.onerror = null, h = u.apply(this, arguments), I && (this.onsuccess = this.onsuccess ? ht(I, this.onsuccess) : I), E && (this.onerror = this.onerror ? ht(E, this.onerror) : E), g === void 0 ? h === void 0 ? void 0 : h : c(g, h);
        };
      }
      function kt(s, u) {
        return s === me ? u : function() {
          return u.apply(this, arguments) !== !1 && s.apply(this, arguments);
        };
      }
      function Ot(s, u) {
        return s === me ? u : function() {
          var h = s.apply(this, arguments);
          if (h && typeof h.then == "function") {
            for (var g = this, I = arguments.length, E = new Array(I); I--; ) E[I] = arguments[I];
            return h.then(function() {
              return u.apply(g, E);
            });
          }
          return u.apply(this, arguments);
        };
      }
      et.ModifyError = gt, et.DexieError = Ze, et.BulkError = We;
      var qe = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function Qe(s) {
        qe = s;
      }
      var Et = {}, Ft = 100, Jt = typeof Promise > "u" ? [] : function() {
        var s = Promise.resolve();
        if (typeof crypto > "u" || !crypto.subtle) return [s, b(s), s];
        var u = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [u, b(u), s];
      }(), _t = Jt[0], qr = Jt[1], Jt = Jt[2], qr = qr && qr.then, S = _t && _t.constructor, d = !!Jt, v = function(s, u) {
        _.push([s, u]), y && (queueMicrotask(Ee), y = !1);
      }, R = !0, y = !0, T = [], L = [], ue = je, B = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: me, pgp: !1, env: {}, finalize: me }, q = B, _ = [], se = 0, Ne = [];
      function f(s) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var u = this._PSD = q;
        if (typeof s != "function") {
          if (s !== Et) throw new TypeError("Not a function");
          return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && A(this, this._value));
        }
        this._state = null, this._value = null, ++u.ref, function h(g, I) {
          try {
            I(function(E) {
              if (g._state === null) {
                if (E === g) throw new TypeError("A promise cannot be resolved with itself.");
                var O = g._lib && xe();
                E && typeof E.then == "function" ? h(g, function(N, U) {
                  E instanceof f ? E._then(N, U) : E.then(N, U);
                }) : (g._state = !0, g._value = E, F(g)), O && Je();
              }
            }, A.bind(null, g));
          } catch (E) {
            A(g, E);
          }
        }(this, s);
      }
      var te = { get: function() {
        var s = q, u = mn;
        function h(g, I) {
          var E = this, O = !s.global && (s !== q || u !== mn), N = O && !$t(), U = new f(function(j, W) {
            Z(E, new ie(vh(g, s, O, N), vh(I, s, O, N), j, W, s));
          });
          return this._consoleTask && (U._consoleTask = this._consoleTask), U;
        }
        return h.prototype = Et, h;
      }, set: function(s) {
        D(this, "then", s && s.prototype === Et ? te : { get: function() {
          return s;
        }, set: te.set });
      } };
      function ie(s, u, h, g, I) {
        this.onFulfilled = typeof s == "function" ? s : null, this.onRejected = typeof u == "function" ? u : null, this.resolve = h, this.reject = g, this.psd = I;
      }
      function A(s, u) {
        var h, g;
        L.push(u), s._state === null && (h = s._lib && xe(), u = ue(u), s._state = !1, s._value = u, g = s, T.some(function(I) {
          return I._value === g._value;
        }) || T.push(g), F(s), h && Je());
      }
      function F(s) {
        var u = s._listeners;
        s._listeners = [];
        for (var h = 0, g = u.length; h < g; ++h) Z(s, u[h]);
        var I = s._PSD;
        --I.ref || I.finalize(), se === 0 && (++se, v(function() {
          --se == 0 && Rr();
        }, []));
      }
      function Z(s, u) {
        if (s._state !== null) {
          var h = s._state ? u.onFulfilled : u.onRejected;
          if (h === null) return (s._state ? u.resolve : u.reject)(s._value);
          ++u.psd.ref, ++se, v(Oe, [h, s, u]);
        } else s._listeners.push(u);
      }
      function Oe(s, u, h) {
        try {
          var g, I = u._value;
          !u._state && L.length && (L = []), g = qe && u._consoleTask ? u._consoleTask.run(function() {
            return s(I);
          }) : s(I), u._state || L.indexOf(I) !== -1 || function(E) {
            for (var O = T.length; O; ) if (T[--O]._value === E._value) return T.splice(O, 1);
          }(u), h.resolve(g);
        } catch (E) {
          h.reject(E);
        } finally {
          --se == 0 && Rr(), --h.psd.ref || h.psd.finalize();
        }
      }
      function Ee() {
        ki(B, function() {
          xe() && Je();
        });
      }
      function xe() {
        var s = R;
        return y = R = !1, s;
      }
      function Je() {
        var s, u, h;
        do
          for (; 0 < _.length; ) for (s = _, _ = [], h = s.length, u = 0; u < h; ++u) {
            var g = s[u];
            g[0].apply(null, g[1]);
          }
        while (0 < _.length);
        y = R = !0;
      }
      function Rr() {
        var s = T;
        T = [], s.forEach(function(g) {
          g._PSD.onunhandled.call(null, g._value, g);
        });
        for (var u = Ne.slice(0), h = u.length; h; ) u[--h]();
      }
      function bt(s) {
        return new f(Et, !1, s);
      }
      function Te(s, u) {
        var h = q;
        return function() {
          var g = xe(), I = q;
          try {
            return Fn(h, !0), s.apply(this, arguments);
          } catch (E) {
            u && u(E);
          } finally {
            Fn(I, !1), g && Je();
          }
        };
      }
      x(f.prototype, { then: te, _then: function(s, u) {
        Z(this, new ie(null, null, s, u, q));
      }, catch: function(s) {
        if (arguments.length === 1) return this.then(null, s);
        var u = s, h = arguments[1];
        return typeof u == "function" ? this.then(null, function(g) {
          return (g instanceof u ? h : bt)(g);
        }) : this.then(null, function(g) {
          return (g && g.name === u ? h : bt)(g);
        });
      }, finally: function(s) {
        return this.then(function(u) {
          return f.resolve(s()).then(function() {
            return u;
          });
        }, function(u) {
          return f.resolve(s()).then(function() {
            return bt(u);
          });
        });
      }, timeout: function(s, u) {
        var h = this;
        return s < 1 / 0 ? new f(function(g, I) {
          var E = setTimeout(function() {
            return I(new he.Timeout(u));
          }, s);
          h.then(g, I).finally(clearTimeout.bind(null, E));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && D(f.prototype, Symbol.toStringTag, "Dexie.Promise"), B.env = dh(), x(f, { all: function() {
        var s = It.apply(null, arguments).map(lr);
        return new f(function(u, h) {
          s.length === 0 && u([]);
          var g = s.length;
          s.forEach(function(I, E) {
            return f.resolve(I).then(function(O) {
              s[E] = O, --g || u(s);
            }, h);
          });
        });
      }, resolve: function(s) {
        return s instanceof f ? s : s && typeof s.then == "function" ? new f(function(u, h) {
          s.then(u, h);
        }) : new f(Et, !0, s);
      }, reject: bt, race: function() {
        var s = It.apply(null, arguments).map(lr);
        return new f(function(u, h) {
          s.map(function(g) {
            return f.resolve(g).then(u, h);
          });
        });
      }, PSD: { get: function() {
        return q;
      }, set: function(s) {
        return q = s;
      } }, totalEchoes: { get: function() {
        return mn;
      } }, newPSD: Nt, usePSD: ki, scheduler: { get: function() {
        return v;
      }, set: function(s) {
        v = s;
      } }, rejectionMapper: { get: function() {
        return ue;
      }, set: function(s) {
        ue = s;
      } }, follow: function(s, u) {
        return new f(function(h, g) {
          return Nt(function(I, E) {
            var O = q;
            O.unhandleds = [], O.onunhandled = E, O.finalize = ht(function() {
              var N, U = this;
              N = function() {
                U.unhandleds.length === 0 ? I() : E(U.unhandleds[0]);
              }, Ne.push(function j() {
                N(), Ne.splice(Ne.indexOf(j), 1);
              }), ++se, v(function() {
                --se == 0 && Rr();
              }, []);
            }, O.finalize), s();
          }, u, h, g);
        });
      } }), S && (S.allSettled && D(f, "allSettled", function() {
        var s = It.apply(null, arguments).map(lr);
        return new f(function(u) {
          s.length === 0 && u([]);
          var h = s.length, g = new Array(h);
          s.forEach(function(I, E) {
            return f.resolve(I).then(function(O) {
              return g[E] = { status: "fulfilled", value: O };
            }, function(O) {
              return g[E] = { status: "rejected", reason: O };
            }).then(function() {
              return --h || u(g);
            });
          });
        });
      }), S.any && typeof AggregateError < "u" && D(f, "any", function() {
        var s = It.apply(null, arguments).map(lr);
        return new f(function(u, h) {
          s.length === 0 && h(new AggregateError([]));
          var g = s.length, I = new Array(g);
          s.forEach(function(E, O) {
            return f.resolve(E).then(function(N) {
              return u(N);
            }, function(N) {
              I[O] = N, --g || h(new AggregateError(I));
            });
          });
        });
      }), S.withResolvers && (f.withResolvers = S.withResolvers));
      var tt = { awaits: 0, echoes: 0, id: 0 }, Ut = 0, qt = [], yn = 0, mn = 0, Rt = 0;
      function Nt(s, u, h, g) {
        var I = q, E = Object.create(I);
        return E.parent = I, E.ref = 0, E.global = !1, E.id = ++Rt, B.env, E.env = d ? { Promise: f, PromiseProp: { value: f, configurable: !0, writable: !0 }, all: f.all, race: f.race, allSettled: f.allSettled, any: f.any, resolve: f.resolve, reject: f.reject } : {}, u && c(E, u), ++I.ref, E.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, g = ki(E, s, h, g), E.ref === 0 && E.finalize(), g;
      }
      function St() {
        return tt.id || (tt.id = ++Ut), ++tt.awaits, tt.echoes += Ft, tt.id;
      }
      function $t() {
        return !!tt.awaits && (--tt.awaits == 0 && (tt.id = 0), tt.echoes = tt.awaits * Ft, !0);
      }
      function lr(s) {
        return tt.echoes && s && s.constructor === S ? (St(), s.then(function(u) {
          return $t(), u;
        }, function(u) {
          return $t(), Pt(u);
        })) : s;
      }
      function na() {
        var s = qt[qt.length - 1];
        qt.pop(), Fn(s, !1);
      }
      function Fn(s, u) {
        var h, g = q;
        (u ? !tt.echoes || yn++ && s === q : !yn || --yn && s === q) || queueMicrotask(u ? (function(I) {
          ++mn, tt.echoes && --tt.echoes != 0 || (tt.echoes = tt.awaits = tt.id = 0), qt.push(q), Fn(I, !0);
        }).bind(null, s) : na), s !== q && (q = s, g === B && (B.env = dh()), d && (h = B.env.Promise, u = s.env, (g.global || s.global) && (Object.defineProperty(o, "Promise", u.PromiseProp), h.all = u.all, h.race = u.race, h.resolve = u.resolve, h.reject = u.reject, u.allSettled && (h.allSettled = u.allSettled), u.any && (h.any = u.any))));
      }
      function dh() {
        var s = o.Promise;
        return d ? { Promise: s, PromiseProp: Object.getOwnPropertyDescriptor(o, "Promise"), all: s.all, race: s.race, allSettled: s.allSettled, any: s.any, resolve: s.resolve, reject: s.reject } : {};
      }
      function ki(s, u, h, g, I) {
        var E = q;
        try {
          return Fn(s, !0), u(h, g, I);
        } finally {
          Fn(E, !1);
        }
      }
      function vh(s, u, h, g) {
        return typeof s != "function" ? s : function() {
          var I = q;
          h && St(), Fn(u, !0);
          try {
            return s.apply(this, arguments);
          } finally {
            Fn(I, !1), g && queueMicrotask($t);
          }
        };
      }
      function hu(s) {
        Promise === S && tt.echoes === 0 ? yn === 0 ? s() : enqueueNativeMicroTask(s) : setTimeout(s, 0);
      }
      ("" + qr).indexOf("[native code]") === -1 && (St = $t = me);
      var Pt = f.reject, Oi = "￿", In = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", gh = "String expected.", _s = [], ia = "__dbnames", pu = "readonly", du = "readwrite";
      function Ri(s, u) {
        return s ? u ? function() {
          return s.apply(this, arguments) && u.apply(this, arguments);
        } : s : u;
      }
      var yh = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function sa(s) {
        return typeof s != "string" || /\./.test(s) ? function(u) {
          return u;
        } : function(u) {
          return u[s] === void 0 && s in u && delete (u = Se(u))[s], u;
        };
      }
      function mh() {
        throw he.Type();
      }
      function at(s, u) {
        try {
          var h = Ih(s), g = Ih(u);
          if (h !== g) return h === "Array" ? 1 : g === "Array" ? -1 : h === "binary" ? 1 : g === "binary" ? -1 : h === "string" ? 1 : g === "string" ? -1 : h === "Date" ? 1 : g !== "Date" ? NaN : -1;
          switch (h) {
            case "number":
            case "Date":
            case "string":
              return u < s ? 1 : s < u ? -1 : 0;
            case "binary":
              return function(I, E) {
                for (var O = I.length, N = E.length, U = O < N ? O : N, j = 0; j < U; ++j) if (I[j] !== E[j]) return I[j] < E[j] ? -1 : 1;
                return O === N ? 0 : O < N ? -1 : 1;
              }(bh(s), bh(u));
            case "Array":
              return function(I, E) {
                for (var O = I.length, N = E.length, U = O < N ? O : N, j = 0; j < U; ++j) {
                  var W = at(I[j], E[j]);
                  if (W !== 0) return W;
                }
                return O === N ? 0 : O < N ? -1 : 1;
              }(s, u);
          }
        } catch {
        }
        return NaN;
      }
      function Ih(s) {
        var u = typeof s;
        return u != "object" ? u : ArrayBuffer.isView(s) ? "binary" : (s = ot(s), s === "ArrayBuffer" ? "binary" : s);
      }
      function bh(s) {
        return s instanceof Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : new Uint8Array(s);
      }
      var _h = (xt.prototype._trans = function(s, u, h) {
        var g = this._tx || q.trans, I = this.name, E = qe && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(s === "readonly" ? "read" : "write", " ").concat(this.name));
        function O(j, W, P) {
          if (!P.schema[I]) throw new he.NotFound("Table " + I + " not part of transaction");
          return u(P.idbtrans, P);
        }
        var N = xe();
        try {
          var U = g && g.db._novip === this.db._novip ? g === q.trans ? g._promise(s, O, h) : Nt(function() {
            return g._promise(s, O, h);
          }, { trans: g, transless: q.transless || q }) : function j(W, P, V, $) {
            if (W.idbdb && (W._state.openComplete || q.letThrough || W._vip)) {
              var H = W._createTransaction(P, V, W._dbSchema);
              try {
                H.create(), W._state.PR1398_maxLoop = 3;
              } catch (Y) {
                return Y.name === lt.InvalidState && W.isOpen() && 0 < --W._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), W.close({ disableAutoOpen: !1 }), W.open().then(function() {
                  return j(W, P, V, $);
                })) : Pt(Y);
              }
              return H._promise(P, function(Y, z) {
                return Nt(function() {
                  return q.trans = H, $(Y, z, H);
                });
              }).then(function(Y) {
                if (P === "readwrite") try {
                  H.idbtrans.commit();
                } catch {
                }
                return P === "readonly" ? Y : H._completion.then(function() {
                  return Y;
                });
              });
            }
            if (W._state.openComplete) return Pt(new he.DatabaseClosed(W._state.dbOpenError));
            if (!W._state.isBeingOpened) {
              if (!W._state.autoOpen) return Pt(new he.DatabaseClosed());
              W.open().catch(me);
            }
            return W._state.dbReadyPromise.then(function() {
              return j(W, P, V, $);
            });
          }(this.db, s, [this.name], O);
          return E && (U._consoleTask = E, U = U.catch(function(j) {
            return console.trace(j), Pt(j);
          })), U;
        } finally {
          N && Je();
        }
      }, xt.prototype.get = function(s, u) {
        var h = this;
        return s && s.constructor === Object ? this.where(s).first(u) : s == null ? Pt(new he.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(g) {
          return h.core.get({ trans: g, key: s }).then(function(I) {
            return h.hook.reading.fire(I);
          });
        }).then(u);
      }, xt.prototype.where = function(s) {
        if (typeof s == "string") return new this.db.WhereClause(this, s);
        if (l(s)) return new this.db.WhereClause(this, "[".concat(s.join("+"), "]"));
        var u = a(s);
        if (u.length === 1) return this.where(u[0]).equals(s[u[0]]);
        var h = this.schema.indexes.concat(this.schema.primKey).filter(function(N) {
          if (N.compound && u.every(function(j) {
            return 0 <= N.keyPath.indexOf(j);
          })) {
            for (var U = 0; U < u.length; ++U) if (u.indexOf(N.keyPath[U]) === -1) return !1;
            return !0;
          }
          return !1;
        }).sort(function(N, U) {
          return N.keyPath.length - U.keyPath.length;
        })[0];
        if (h && this.db._maxKey !== Oi) {
          var E = h.keyPath.slice(0, u.length);
          return this.where(E).equals(E.map(function(U) {
            return s[U];
          }));
        }
        !h && qe && console.warn("The query ".concat(JSON.stringify(s), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(u.join("+"), "]"));
        var g = this.schema.idxByName;
        function I(N, U) {
          return at(N, U) === 0;
        }
        var O = u.reduce(function(P, U) {
          var j = P[0], W = P[1], P = g[U], V = s[U];
          return [j || P, j || !P ? Ri(W, P && P.multi ? function($) {
            return $ = fe($, U), l($) && $.some(function(H) {
              return I(V, H);
            });
          } : function($) {
            return I(V, fe($, U));
          }) : W];
        }, [null, null]), E = O[0], O = O[1];
        return E ? this.where(E.name).equals(s[E.keyPath]).filter(O) : h ? this.filter(O) : this.where(u).equals("");
      }, xt.prototype.filter = function(s) {
        return this.toCollection().and(s);
      }, xt.prototype.count = function(s) {
        return this.toCollection().count(s);
      }, xt.prototype.offset = function(s) {
        return this.toCollection().offset(s);
      }, xt.prototype.limit = function(s) {
        return this.toCollection().limit(s);
      }, xt.prototype.each = function(s) {
        return this.toCollection().each(s);
      }, xt.prototype.toArray = function(s) {
        return this.toCollection().toArray(s);
      }, xt.prototype.toCollection = function() {
        return new this.db.Collection(new this.db.WhereClause(this));
      }, xt.prototype.orderBy = function(s) {
        return new this.db.Collection(new this.db.WhereClause(this, l(s) ? "[".concat(s.join("+"), "]") : s));
      }, xt.prototype.reverse = function() {
        return this.toCollection().reverse();
      }, xt.prototype.mapToClass = function(s) {
        var u, h = this.db, g = this.name;
        function I() {
          return u !== null && u.apply(this, arguments) || this;
        }
        (this.schema.mappedClass = s).prototype instanceof mh && (function(U, j) {
          if (typeof j != "function" && j !== null) throw new TypeError("Class extends value " + String(j) + " is not a constructor or null");
          function W() {
            this.constructor = U;
          }
          t(U, j), U.prototype = j === null ? Object.create(j) : (W.prototype = j.prototype, new W());
        }(I, u = s), Object.defineProperty(I.prototype, "db", { get: function() {
          return h;
        }, enumerable: !1, configurable: !0 }), I.prototype.table = function() {
          return g;
        }, s = I);
        for (var E = /* @__PURE__ */ new Set(), O = s.prototype; O; O = b(O)) Object.getOwnPropertyNames(O).forEach(function(U) {
          return E.add(U);
        });
        function N(U) {
          if (!U) return U;
          var j, W = Object.create(s.prototype);
          for (j in U) if (!E.has(j)) try {
            W[j] = U[j];
          } catch {
          }
          return W;
        }
        return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = N, this.hook("reading", N), s;
      }, xt.prototype.defineClass = function() {
        return this.mapToClass(function(s) {
          c(this, s);
        });
      }, xt.prototype.add = function(s, u) {
        var h = this, g = this.schema.primKey, I = g.auto, E = g.keyPath, O = s;
        return E && I && (O = sa(E)(s)), this._trans("readwrite", function(N) {
          return h.core.mutate({ trans: N, type: "add", keys: u != null ? [u] : null, values: [O] });
        }).then(function(N) {
          return N.numFailures ? f.reject(N.failures[0]) : N.lastResult;
        }).then(function(N) {
          if (E) try {
            oe(s, E, N);
          } catch {
          }
          return N;
        });
      }, xt.prototype.update = function(s, u) {
        return typeof s != "object" || l(s) ? this.where(":id").equals(s).modify(u) : (s = fe(s, this.schema.primKey.keyPath), s === void 0 ? Pt(new he.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(s).modify(u));
      }, xt.prototype.put = function(s, u) {
        var h = this, g = this.schema.primKey, I = g.auto, E = g.keyPath, O = s;
        return E && I && (O = sa(E)(s)), this._trans("readwrite", function(N) {
          return h.core.mutate({ trans: N, type: "put", values: [O], keys: u != null ? [u] : null });
        }).then(function(N) {
          return N.numFailures ? f.reject(N.failures[0]) : N.lastResult;
        }).then(function(N) {
          if (E) try {
            oe(s, E, N);
          } catch {
          }
          return N;
        });
      }, xt.prototype.delete = function(s) {
        var u = this;
        return this._trans("readwrite", function(h) {
          return u.core.mutate({ trans: h, type: "delete", keys: [s] });
        }).then(function(h) {
          return h.numFailures ? f.reject(h.failures[0]) : void 0;
        });
      }, xt.prototype.clear = function() {
        var s = this;
        return this._trans("readwrite", function(u) {
          return s.core.mutate({ trans: u, type: "deleteRange", range: yh });
        }).then(function(u) {
          return u.numFailures ? f.reject(u.failures[0]) : void 0;
        });
      }, xt.prototype.bulkGet = function(s) {
        var u = this;
        return this._trans("readonly", function(h) {
          return u.core.getMany({ keys: s, trans: h }).then(function(g) {
            return g.map(function(I) {
              return u.hook.reading.fire(I);
            });
          });
        });
      }, xt.prototype.bulkAdd = function(s, u, h) {
        var g = this, I = Array.isArray(u) ? u : void 0, E = (h = h || (I ? void 0 : u)) ? h.allKeys : void 0;
        return this._trans("readwrite", function(O) {
          var j = g.schema.primKey, N = j.auto, j = j.keyPath;
          if (j && I) throw new he.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (I && I.length !== s.length) throw new he.InvalidArgument("Arguments objects and keys must have the same length");
          var U = s.length, j = j && N ? s.map(sa(j)) : s;
          return g.core.mutate({ trans: O, type: "add", keys: I, values: j, wantResults: E }).then(function(H) {
            var P = H.numFailures, V = H.results, $ = H.lastResult, H = H.failures;
            if (P === 0) return E ? V : $;
            throw new We("".concat(g.name, ".bulkAdd(): ").concat(P, " of ").concat(U, " operations failed"), H);
          });
        });
      }, xt.prototype.bulkPut = function(s, u, h) {
        var g = this, I = Array.isArray(u) ? u : void 0, E = (h = h || (I ? void 0 : u)) ? h.allKeys : void 0;
        return this._trans("readwrite", function(O) {
          var j = g.schema.primKey, N = j.auto, j = j.keyPath;
          if (j && I) throw new he.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (I && I.length !== s.length) throw new he.InvalidArgument("Arguments objects and keys must have the same length");
          var U = s.length, j = j && N ? s.map(sa(j)) : s;
          return g.core.mutate({ trans: O, type: "put", keys: I, values: j, wantResults: E }).then(function(H) {
            var P = H.numFailures, V = H.results, $ = H.lastResult, H = H.failures;
            if (P === 0) return E ? V : $;
            throw new We("".concat(g.name, ".bulkPut(): ").concat(P, " of ").concat(U, " operations failed"), H);
          });
        });
      }, xt.prototype.bulkUpdate = function(s) {
        var u = this, h = this.core, g = s.map(function(O) {
          return O.key;
        }), I = s.map(function(O) {
          return O.changes;
        }), E = [];
        return this._trans("readwrite", function(O) {
          return h.getMany({ trans: O, keys: g, cache: "clone" }).then(function(N) {
            var U = [], j = [];
            s.forEach(function(P, V) {
              var $ = P.key, H = P.changes, Y = N[V];
              if (Y) {
                for (var z = 0, Q = Object.keys(H); z < Q.length; z++) {
                  var re = Q[z], ne = H[re];
                  if (re === u.schema.primKey.keyPath) {
                    if (at(ne, $) !== 0) throw new he.Constraint("Cannot update primary key in bulkUpdate()");
                  } else oe(Y, re, ne);
                }
                E.push(V), U.push($), j.push(Y);
              }
            });
            var W = U.length;
            return h.mutate({ trans: O, type: "put", keys: U, values: j, updates: { keys: g, changeSpecs: I } }).then(function(P) {
              var V = P.numFailures, $ = P.failures;
              if (V === 0) return W;
              for (var H = 0, Y = Object.keys($); H < Y.length; H++) {
                var z, Q = Y[H], re = E[Number(Q)];
                re != null && (z = $[Q], delete $[Q], $[re] = z);
              }
              throw new We("".concat(u.name, ".bulkUpdate(): ").concat(V, " of ").concat(W, " operations failed"), $);
            });
          });
        });
      }, xt.prototype.bulkDelete = function(s) {
        var u = this, h = s.length;
        return this._trans("readwrite", function(g) {
          return u.core.mutate({ trans: g, type: "delete", keys: s });
        }).then(function(O) {
          var I = O.numFailures, E = O.lastResult, O = O.failures;
          if (I === 0) return E;
          throw new We("".concat(u.name, ".bulkDelete(): ").concat(I, " of ").concat(h, " operations failed"), O);
        });
      }, xt);
      function xt() {
      }
      function mo(s) {
        function u(O, N) {
          if (N) {
            for (var U = arguments.length, j = new Array(U - 1); --U; ) j[U - 1] = arguments[U];
            return h[O].subscribe.apply(null, j), s;
          }
          if (typeof O == "string") return h[O];
        }
        var h = {};
        u.addEventType = E;
        for (var g = 1, I = arguments.length; g < I; ++g) E(arguments[g]);
        return u;
        function E(O, N, U) {
          if (typeof O != "object") {
            var j;
            N = N || kt;
            var W = { subscribers: [], fire: U = U || me, subscribe: function(P) {
              W.subscribers.indexOf(P) === -1 && (W.subscribers.push(P), W.fire = N(W.fire, P));
            }, unsubscribe: function(P) {
              W.subscribers = W.subscribers.filter(function(V) {
                return V !== P;
              }), W.fire = W.subscribers.reduce(N, U);
            } };
            return h[O] = u[O] = W;
          }
          a(j = O).forEach(function(P) {
            var V = j[P];
            if (l(V)) E(P, j[P][0], j[P][1]);
            else {
              if (V !== "asap") throw new he.InvalidArgument("Invalid event config");
              var $ = E(P, je, function() {
                for (var H = arguments.length, Y = new Array(H); H--; ) Y[H] = arguments[H];
                $.subscribers.forEach(function(z) {
                  ce(function() {
                    z.apply(null, Y);
                  });
                });
              });
            }
          });
        }
      }
      function Io(s, u) {
        return K(u).from({ prototype: s }), u;
      }
      function ws(s, u) {
        return !(s.filter || s.algorithm || s.or) && (u ? s.justLimit : !s.replayFilter);
      }
      function vu(s, u) {
        s.filter = Ri(s.filter, u);
      }
      function gu(s, u, h) {
        var g = s.replayFilter;
        s.replayFilter = g ? function() {
          return Ri(g(), u());
        } : u, s.justLimit = h && !g;
      }
      function oa(s, u) {
        if (s.isPrimKey) return u.primaryKey;
        var h = u.getIndexByKeyPath(s.index);
        if (!h) throw new he.Schema("KeyPath " + s.index + " on object store " + u.name + " is not indexed");
        return h;
      }
      function wh(s, u, h) {
        var g = oa(s, u.schema);
        return u.openCursor({ trans: h, values: !s.keysOnly, reverse: s.dir === "prev", unique: !!s.unique, query: { index: g, range: s.range } });
      }
      function aa(s, u, h, g) {
        var I = s.replayFilter ? Ri(s.filter, s.replayFilter()) : s.filter;
        if (s.or) {
          var E = {}, O = function(N, U, j) {
            var W, P;
            I && !I(U, j, function(V) {
              return U.stop(V);
            }, function(V) {
              return U.fail(V);
            }) || ((P = "" + (W = U.primaryKey)) == "[object ArrayBuffer]" && (P = "" + new Uint8Array(W)), w(E, P) || (E[P] = !0, u(N, U, j)));
          };
          return Promise.all([s.or._iterate(O, h), xh(wh(s, g, h), s.algorithm, O, !s.keysOnly && s.valueMapper)]);
        }
        return xh(wh(s, g, h), Ri(s.algorithm, I), u, !s.keysOnly && s.valueMapper);
      }
      function xh(s, u, h, g) {
        var I = Te(g ? function(E, O, N) {
          return h(g(E), O, N);
        } : h);
        return s.then(function(E) {
          if (E) return E.start(function() {
            var O = function() {
              return E.continue();
            };
            u && !u(E, function(N) {
              return O = N;
            }, function(N) {
              E.stop(N), O = me;
            }, function(N) {
              E.fail(N), O = me;
            }) || I(E.value, E, function(N) {
              return O = N;
            }), O();
          });
        });
      }
      var bo = (Eh.prototype.execute = function(s) {
        var u = this["@@propmod"];
        if (u.add !== void 0) {
          var h = u.add;
          if (l(h)) return i(i([], l(s) ? s : [], !0), h).sort();
          if (typeof h == "number") return (Number(s) || 0) + h;
          if (typeof h == "bigint") try {
            return BigInt(s) + h;
          } catch {
            return BigInt(0) + h;
          }
          throw new TypeError("Invalid term ".concat(h));
        }
        if (u.remove !== void 0) {
          var g = u.remove;
          if (l(g)) return l(s) ? s.filter(function(I) {
            return !g.includes(I);
          }).sort() : [];
          if (typeof g == "number") return Number(s) - g;
          if (typeof g == "bigint") try {
            return BigInt(s) - g;
          } catch {
            return BigInt(0) - g;
          }
          throw new TypeError("Invalid subtrahend ".concat(g));
        }
        return h = (h = u.replacePrefix) === null || h === void 0 ? void 0 : h[0], h && typeof s == "string" && s.startsWith(h) ? u.replacePrefix[1] + s.substring(h.length) : s;
      }, Eh);
      function Eh(s) {
        this["@@propmod"] = s;
      }
      var G0 = (ft.prototype._read = function(s, u) {
        var h = this._ctx;
        return h.error ? h.table._trans(null, Pt.bind(null, h.error)) : h.table._trans("readonly", s).then(u);
      }, ft.prototype._write = function(s) {
        var u = this._ctx;
        return u.error ? u.table._trans(null, Pt.bind(null, u.error)) : u.table._trans("readwrite", s, "locked");
      }, ft.prototype._addAlgorithm = function(s) {
        var u = this._ctx;
        u.algorithm = Ri(u.algorithm, s);
      }, ft.prototype._iterate = function(s, u) {
        return aa(this._ctx, s, u, this._ctx.table.core);
      }, ft.prototype.clone = function(s) {
        var u = Object.create(this.constructor.prototype), h = Object.create(this._ctx);
        return s && c(h, s), u._ctx = h, u;
      }, ft.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, ft.prototype.each = function(s) {
        var u = this._ctx;
        return this._read(function(h) {
          return aa(u, s, h, u.table.core);
        });
      }, ft.prototype.count = function(s) {
        var u = this;
        return this._read(function(h) {
          var g = u._ctx, I = g.table.core;
          if (ws(g, !0)) return I.count({ trans: h, query: { index: oa(g, I.schema), range: g.range } }).then(function(O) {
            return Math.min(O, g.limit);
          });
          var E = 0;
          return aa(g, function() {
            return ++E, !1;
          }, h, I).then(function() {
            return E;
          });
        }).then(s);
      }, ft.prototype.sortBy = function(s, u) {
        var h = s.split(".").reverse(), g = h[0], I = h.length - 1;
        function E(U, j) {
          return j ? E(U[h[j]], j - 1) : U[g];
        }
        var O = this._ctx.dir === "next" ? 1 : -1;
        function N(U, j) {
          return at(E(U, I), E(j, I)) * O;
        }
        return this.toArray(function(U) {
          return U.sort(N);
        }).then(u);
      }, ft.prototype.toArray = function(s) {
        var u = this;
        return this._read(function(h) {
          var g = u._ctx;
          if (g.dir === "next" && ws(g, !0) && 0 < g.limit) {
            var I = g.valueMapper, E = oa(g, g.table.core.schema);
            return g.table.core.query({ trans: h, limit: g.limit, values: !0, query: { index: E, range: g.range } }).then(function(N) {
              return N = N.result, I ? N.map(I) : N;
            });
          }
          var O = [];
          return aa(g, function(N) {
            return O.push(N);
          }, h, g.table.core).then(function() {
            return O;
          });
        }, s);
      }, ft.prototype.offset = function(s) {
        var u = this._ctx;
        return s <= 0 || (u.offset += s, ws(u) ? gu(u, function() {
          var h = s;
          return function(g, I) {
            return h === 0 || (h === 1 ? --h : I(function() {
              g.advance(h), h = 0;
            }), !1);
          };
        }) : gu(u, function() {
          var h = s;
          return function() {
            return --h < 0;
          };
        })), this;
      }, ft.prototype.limit = function(s) {
        return this._ctx.limit = Math.min(this._ctx.limit, s), gu(this._ctx, function() {
          var u = s;
          return function(h, g, I) {
            return --u <= 0 && g(I), 0 <= u;
          };
        }, !0), this;
      }, ft.prototype.until = function(s, u) {
        return vu(this._ctx, function(h, g, I) {
          return !s(h.value) || (g(I), u);
        }), this;
      }, ft.prototype.first = function(s) {
        return this.limit(1).toArray(function(u) {
          return u[0];
        }).then(s);
      }, ft.prototype.last = function(s) {
        return this.reverse().first(s);
      }, ft.prototype.filter = function(s) {
        var u;
        return vu(this._ctx, function(h) {
          return s(h.value);
        }), (u = this._ctx).isMatch = Ri(u.isMatch, s), this;
      }, ft.prototype.and = function(s) {
        return this.filter(s);
      }, ft.prototype.or = function(s) {
        return new this.db.WhereClause(this._ctx.table, s, this);
      }, ft.prototype.reverse = function() {
        return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
      }, ft.prototype.desc = function() {
        return this.reverse();
      }, ft.prototype.eachKey = function(s) {
        var u = this._ctx;
        return u.keysOnly = !u.isMatch, this.each(function(h, g) {
          s(g.key, g);
        });
      }, ft.prototype.eachUniqueKey = function(s) {
        return this._ctx.unique = "unique", this.eachKey(s);
      }, ft.prototype.eachPrimaryKey = function(s) {
        var u = this._ctx;
        return u.keysOnly = !u.isMatch, this.each(function(h, g) {
          s(g.primaryKey, g);
        });
      }, ft.prototype.keys = function(s) {
        var u = this._ctx;
        u.keysOnly = !u.isMatch;
        var h = [];
        return this.each(function(g, I) {
          h.push(I.key);
        }).then(function() {
          return h;
        }).then(s);
      }, ft.prototype.primaryKeys = function(s) {
        var u = this._ctx;
        if (u.dir === "next" && ws(u, !0) && 0 < u.limit) return this._read(function(g) {
          var I = oa(u, u.table.core.schema);
          return u.table.core.query({ trans: g, values: !1, limit: u.limit, query: { index: I, range: u.range } });
        }).then(function(g) {
          return g.result;
        }).then(s);
        u.keysOnly = !u.isMatch;
        var h = [];
        return this.each(function(g, I) {
          h.push(I.primaryKey);
        }).then(function() {
          return h;
        }).then(s);
      }, ft.prototype.uniqueKeys = function(s) {
        return this._ctx.unique = "unique", this.keys(s);
      }, ft.prototype.firstKey = function(s) {
        return this.limit(1).keys(function(u) {
          return u[0];
        }).then(s);
      }, ft.prototype.lastKey = function(s) {
        return this.reverse().firstKey(s);
      }, ft.prototype.distinct = function() {
        var s = this._ctx, s = s.index && s.table.schema.idxByName[s.index];
        if (!s || !s.multi) return this;
        var u = {};
        return vu(this._ctx, function(I) {
          var g = I.primaryKey.toString(), I = w(u, g);
          return u[g] = !0, !I;
        }), this;
      }, ft.prototype.modify = function(s) {
        var u = this, h = this._ctx;
        return this._write(function(g) {
          var I, E, O;
          O = typeof s == "function" ? s : (I = a(s), E = I.length, function(z) {
            for (var Q = !1, re = 0; re < E; ++re) {
              var ne = I[re], ae = s[ne], pe = fe(z, ne);
              ae instanceof bo ? (oe(z, ne, ae.execute(pe)), Q = !0) : pe !== ae && (oe(z, ne, ae), Q = !0);
            }
            return Q;
          });
          var N = h.table.core, P = N.schema.primaryKey, U = P.outbound, j = P.extractKey, W = 200, P = u.db._options.modifyChunkSize;
          P && (W = typeof P == "object" ? P[N.name] || P["*"] || 200 : P);
          function V(z, ne) {
            var re = ne.failures, ne = ne.numFailures;
            H += z - ne;
            for (var ae = 0, pe = a(re); ae < pe.length; ae++) {
              var be = pe[ae];
              $.push(re[be]);
            }
          }
          var $ = [], H = 0, Y = [];
          return u.clone().primaryKeys().then(function(z) {
            function Q(ne) {
              var ae = Math.min(W, z.length - ne);
              return N.getMany({ trans: g, keys: z.slice(ne, ne + ae), cache: "immutable" }).then(function(pe) {
                for (var be = [], de = [], ge = U ? [] : null, _e = [], Ie = 0; Ie < ae; ++Ie) {
                  var Ae = pe[Ie], Ye = { value: Se(Ae), primKey: z[ne + Ie] };
                  O.call(Ye, Ye.value, Ye) !== !1 && (Ye.value == null ? _e.push(z[ne + Ie]) : U || at(j(Ae), j(Ye.value)) === 0 ? (de.push(Ye.value), U && ge.push(z[ne + Ie])) : (_e.push(z[ne + Ie]), be.push(Ye.value)));
                }
                return Promise.resolve(0 < be.length && N.mutate({ trans: g, type: "add", values: be }).then(function(rt) {
                  for (var nt in rt.failures) _e.splice(parseInt(nt), 1);
                  V(be.length, rt);
                })).then(function() {
                  return (0 < de.length || re && typeof s == "object") && N.mutate({ trans: g, type: "put", keys: ge, values: de, criteria: re, changeSpec: typeof s != "function" && s, isAdditionalChunk: 0 < ne }).then(function(rt) {
                    return V(de.length, rt);
                  });
                }).then(function() {
                  return (0 < _e.length || re && s === yu) && N.mutate({ trans: g, type: "delete", keys: _e, criteria: re, isAdditionalChunk: 0 < ne }).then(function(rt) {
                    return V(_e.length, rt);
                  });
                }).then(function() {
                  return z.length > ne + ae && Q(ne + W);
                });
              });
            }
            var re = ws(h) && h.limit === 1 / 0 && (typeof s != "function" || s === yu) && { index: h.index, range: h.range };
            return Q(0).then(function() {
              if (0 < $.length) throw new gt("Error modifying one or more objects", $, H, Y);
              return z.length;
            });
          });
        });
      }, ft.prototype.delete = function() {
        var s = this._ctx, u = s.range;
        return ws(s) && (s.isPrimKey || u.type === 3) ? this._write(function(h) {
          var g = s.table.core.schema.primaryKey, I = u;
          return s.table.core.count({ trans: h, query: { index: g, range: I } }).then(function(E) {
            return s.table.core.mutate({ trans: h, type: "deleteRange", range: I }).then(function(O) {
              var N = O.failures;
              if (O.lastResult, O.results, O = O.numFailures, O) throw new gt("Could not delete some values", Object.keys(N).map(function(U) {
                return N[U];
              }), E - O);
              return E - O;
            });
          });
        }) : this.modify(yu);
      }, ft);
      function ft() {
      }
      var yu = function(s, u) {
        return u.value = null;
      };
      function H0(s, u) {
        return s < u ? -1 : s === u ? 0 : 1;
      }
      function W0(s, u) {
        return u < s ? -1 : s === u ? 0 : 1;
      }
      function Tr(s, u, h) {
        return s = s instanceof Ah ? new s.Collection(s) : s, s._ctx.error = new (h || TypeError)(u), s;
      }
      function xs(s) {
        return new s.Collection(s, function() {
          return Sh("");
        }).limit(0);
      }
      function ua(s, u, h, g) {
        var I, E, O, N, U, j, W, P = h.length;
        if (!h.every(function(H) {
          return typeof H == "string";
        })) return Tr(s, gh);
        function V(H) {
          I = H === "next" ? function(z) {
            return z.toUpperCase();
          } : function(z) {
            return z.toLowerCase();
          }, E = H === "next" ? function(z) {
            return z.toLowerCase();
          } : function(z) {
            return z.toUpperCase();
          }, O = H === "next" ? H0 : W0;
          var Y = h.map(function(z) {
            return { lower: E(z), upper: I(z) };
          }).sort(function(z, Q) {
            return O(z.lower, Q.lower);
          });
          N = Y.map(function(z) {
            return z.upper;
          }), U = Y.map(function(z) {
            return z.lower;
          }), W = (j = H) === "next" ? "" : g;
        }
        V("next"), s = new s.Collection(s, function() {
          return Ln(N[0], U[P - 1] + g);
        }), s._ondirectionchange = function(H) {
          V(H);
        };
        var $ = 0;
        return s._addAlgorithm(function(H, Y, z) {
          var Q = H.key;
          if (typeof Q != "string") return !1;
          var re = E(Q);
          if (u(re, U, $)) return !0;
          for (var ne = null, ae = $; ae < P; ++ae) {
            var pe = function(be, de, ge, _e, Ie, Ae) {
              for (var Ye = Math.min(be.length, _e.length), rt = -1, nt = 0; nt < Ye; ++nt) {
                var Cr = de[nt];
                if (Cr !== _e[nt]) return Ie(be[nt], ge[nt]) < 0 ? be.substr(0, nt) + ge[nt] + ge.substr(nt + 1) : Ie(be[nt], _e[nt]) < 0 ? be.substr(0, nt) + _e[nt] + ge.substr(nt + 1) : 0 <= rt ? be.substr(0, rt) + de[rt] + ge.substr(rt + 1) : null;
                Ie(be[nt], Cr) < 0 && (rt = nt);
              }
              return Ye < _e.length && Ae === "next" ? be + ge.substr(be.length) : Ye < be.length && Ae === "prev" ? be.substr(0, ge.length) : rt < 0 ? null : be.substr(0, rt) + _e[rt] + ge.substr(rt + 1);
            }(Q, re, N[ae], U[ae], O, j);
            pe === null && ne === null ? $ = ae + 1 : (ne === null || 0 < O(ne, pe)) && (ne = pe);
          }
          return Y(ne !== null ? function() {
            H.continue(ne + W);
          } : z), !1;
        }), s;
      }
      function Ln(s, u, h, g) {
        return { type: 2, lower: s, upper: u, lowerOpen: h, upperOpen: g };
      }
      function Sh(s) {
        return { type: 1, lower: s, upper: s };
      }
      var Ah = (Object.defineProperty(jt.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), jt.prototype.between = function(s, u, h, g) {
        h = h !== !1, g = g === !0;
        try {
          return 0 < this._cmp(s, u) || this._cmp(s, u) === 0 && (h || g) && (!h || !g) ? xs(this) : new this.Collection(this, function() {
            return Ln(s, u, !h, !g);
          });
        } catch {
          return Tr(this, In);
        }
      }, jt.prototype.equals = function(s) {
        return s == null ? Tr(this, In) : new this.Collection(this, function() {
          return Sh(s);
        });
      }, jt.prototype.above = function(s) {
        return s == null ? Tr(this, In) : new this.Collection(this, function() {
          return Ln(s, void 0, !0);
        });
      }, jt.prototype.aboveOrEqual = function(s) {
        return s == null ? Tr(this, In) : new this.Collection(this, function() {
          return Ln(s, void 0, !1);
        });
      }, jt.prototype.below = function(s) {
        return s == null ? Tr(this, In) : new this.Collection(this, function() {
          return Ln(void 0, s, !1, !0);
        });
      }, jt.prototype.belowOrEqual = function(s) {
        return s == null ? Tr(this, In) : new this.Collection(this, function() {
          return Ln(void 0, s);
        });
      }, jt.prototype.startsWith = function(s) {
        return typeof s != "string" ? Tr(this, gh) : this.between(s, s + Oi, !0, !0);
      }, jt.prototype.startsWithIgnoreCase = function(s) {
        return s === "" ? this.startsWith(s) : ua(this, function(u, h) {
          return u.indexOf(h[0]) === 0;
        }, [s], Oi);
      }, jt.prototype.equalsIgnoreCase = function(s) {
        return ua(this, function(u, h) {
          return u === h[0];
        }, [s], "");
      }, jt.prototype.anyOfIgnoreCase = function() {
        var s = It.apply(Ke, arguments);
        return s.length === 0 ? xs(this) : ua(this, function(u, h) {
          return h.indexOf(u) !== -1;
        }, s, "");
      }, jt.prototype.startsWithAnyOfIgnoreCase = function() {
        var s = It.apply(Ke, arguments);
        return s.length === 0 ? xs(this) : ua(this, function(u, h) {
          return h.some(function(g) {
            return u.indexOf(g) === 0;
          });
        }, s, Oi);
      }, jt.prototype.anyOf = function() {
        var s = this, u = It.apply(Ke, arguments), h = this._cmp;
        try {
          u.sort(h);
        } catch {
          return Tr(this, In);
        }
        if (u.length === 0) return xs(this);
        var g = new this.Collection(this, function() {
          return Ln(u[0], u[u.length - 1]);
        });
        g._ondirectionchange = function(E) {
          h = E === "next" ? s._ascending : s._descending, u.sort(h);
        };
        var I = 0;
        return g._addAlgorithm(function(E, O, N) {
          for (var U = E.key; 0 < h(U, u[I]); ) if (++I === u.length) return O(N), !1;
          return h(U, u[I]) === 0 || (O(function() {
            E.continue(u[I]);
          }), !1);
        }), g;
      }, jt.prototype.notEqual = function(s) {
        return this.inAnyRange([[-1 / 0, s], [s, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, jt.prototype.noneOf = function() {
        var s = It.apply(Ke, arguments);
        if (s.length === 0) return new this.Collection(this);
        try {
          s.sort(this._ascending);
        } catch {
          return Tr(this, In);
        }
        var u = s.reduce(function(h, g) {
          return h ? h.concat([[h[h.length - 1][1], g]]) : [[-1 / 0, g]];
        }, null);
        return u.push([s[s.length - 1], this.db._maxKey]), this.inAnyRange(u, { includeLowers: !1, includeUppers: !1 });
      }, jt.prototype.inAnyRange = function(Q, u) {
        var h = this, g = this._cmp, I = this._ascending, E = this._descending, O = this._min, N = this._max;
        if (Q.length === 0) return xs(this);
        if (!Q.every(function(re) {
          return re[0] !== void 0 && re[1] !== void 0 && I(re[0], re[1]) <= 0;
        })) return Tr(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", he.InvalidArgument);
        var U = !u || u.includeLowers !== !1, j = u && u.includeUppers === !0, W, P = I;
        function V(re, ne) {
          return P(re[0], ne[0]);
        }
        try {
          (W = Q.reduce(function(re, ne) {
            for (var ae = 0, pe = re.length; ae < pe; ++ae) {
              var be = re[ae];
              if (g(ne[0], be[1]) < 0 && 0 < g(ne[1], be[0])) {
                be[0] = O(be[0], ne[0]), be[1] = N(be[1], ne[1]);
                break;
              }
            }
            return ae === pe && re.push(ne), re;
          }, [])).sort(V);
        } catch {
          return Tr(this, In);
        }
        var $ = 0, H = j ? function(re) {
          return 0 < I(re, W[$][1]);
        } : function(re) {
          return 0 <= I(re, W[$][1]);
        }, Y = U ? function(re) {
          return 0 < E(re, W[$][0]);
        } : function(re) {
          return 0 <= E(re, W[$][0]);
        }, z = H, Q = new this.Collection(this, function() {
          return Ln(W[0][0], W[W.length - 1][1], !U, !j);
        });
        return Q._ondirectionchange = function(re) {
          P = re === "next" ? (z = H, I) : (z = Y, E), W.sort(V);
        }, Q._addAlgorithm(function(re, ne, ae) {
          for (var pe, be = re.key; z(be); ) if (++$ === W.length) return ne(ae), !1;
          return !H(pe = be) && !Y(pe) || (h._cmp(be, W[$][1]) === 0 || h._cmp(be, W[$][0]) === 0 || ne(function() {
            P === I ? re.continue(W[$][0]) : re.continue(W[$][1]);
          }), !1);
        }), Q;
      }, jt.prototype.startsWithAnyOf = function() {
        var s = It.apply(Ke, arguments);
        return s.every(function(u) {
          return typeof u == "string";
        }) ? s.length === 0 ? xs(this) : this.inAnyRange(s.map(function(u) {
          return [u, u + Oi];
        })) : Tr(this, "startsWithAnyOf() only works with strings");
      }, jt);
      function jt() {
      }
      function rn(s) {
        return Te(function(u) {
          return _o(u), s(u.target.error), !1;
        });
      }
      function _o(s) {
        s.stopPropagation && s.stopPropagation(), s.preventDefault && s.preventDefault();
      }
      var wo = "storagemutated", mu = "x-storagemutated-1", qn = mo(null, wo), Y0 = (nn.prototype._lock = function() {
        return le(!q.global), ++this._reculock, this._reculock !== 1 || q.global || (q.lockOwnerFor = this), this;
      }, nn.prototype._unlock = function() {
        if (le(!q.global), --this._reculock == 0) for (q.global || (q.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var s = this._blockedFuncs.shift();
          try {
            ki(s[1], s[0]);
          } catch {
          }
        }
        return this;
      }, nn.prototype._locked = function() {
        return this._reculock && q.lockOwnerFor !== this;
      }, nn.prototype.create = function(s) {
        var u = this;
        if (!this.mode) return this;
        var h = this.db.idbdb, g = this.db._state.dbOpenError;
        if (le(!this.idbtrans), !s && !h) switch (g && g.name) {
          case "DatabaseClosedError":
            throw new he.DatabaseClosed(g);
          case "MissingAPIError":
            throw new he.MissingAPI(g.message, g);
          default:
            throw new he.OpenFailed(g);
        }
        if (!this.active) throw new he.TransactionInactive();
        return le(this._completion._state === null), (s = this.idbtrans = s || (this.db.core || h).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Te(function(I) {
          _o(I), u._reject(s.error);
        }), s.onabort = Te(function(I) {
          _o(I), u.active && u._reject(new he.Abort(s.error)), u.active = !1, u.on("abort").fire(I);
        }), s.oncomplete = Te(function() {
          u.active = !1, u._resolve(), "mutatedParts" in s && qn.storagemutated.fire(s.mutatedParts);
        }), this;
      }, nn.prototype._promise = function(s, u, h) {
        var g = this;
        if (s === "readwrite" && this.mode !== "readwrite") return Pt(new he.ReadOnly("Transaction is readonly"));
        if (!this.active) return Pt(new he.TransactionInactive());
        if (this._locked()) return new f(function(E, O) {
          g._blockedFuncs.push([function() {
            g._promise(s, u, h).then(E, O);
          }, q]);
        });
        if (h) return Nt(function() {
          var E = new f(function(O, N) {
            g._lock();
            var U = u(O, N, g);
            U && U.then && U.then(O, N);
          });
          return E.finally(function() {
            return g._unlock();
          }), E._lib = !0, E;
        });
        var I = new f(function(E, O) {
          var N = u(E, O, g);
          N && N.then && N.then(E, O);
        });
        return I._lib = !0, I;
      }, nn.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, nn.prototype.waitFor = function(s) {
        var u, h = this._root(), g = f.resolve(s);
        h._waitingFor ? h._waitingFor = h._waitingFor.then(function() {
          return g;
        }) : (h._waitingFor = g, h._waitingQueue = [], u = h.idbtrans.objectStore(h.storeNames[0]), function E() {
          for (++h._spinCount; h._waitingQueue.length; ) h._waitingQueue.shift()();
          h._waitingFor && (u.get(-1 / 0).onsuccess = E);
        }());
        var I = h._waitingFor;
        return new f(function(E, O) {
          g.then(function(N) {
            return h._waitingQueue.push(Te(E.bind(null, N)));
          }, function(N) {
            return h._waitingQueue.push(Te(O.bind(null, N)));
          }).finally(function() {
            h._waitingFor === I && (h._waitingFor = null);
          });
        });
      }, nn.prototype.abort = function() {
        this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new he.Abort()));
      }, nn.prototype.table = function(s) {
        var u = this._memoizedTables || (this._memoizedTables = {});
        if (w(u, s)) return u[s];
        var h = this.schema[s];
        if (!h) throw new he.NotFound("Table " + s + " not part of transaction");
        return h = new this.db.Table(s, h, this), h.core = this.db.core.table(s), u[s] = h;
      }, nn);
      function nn() {
      }
      function Iu(s, u, h, g, I, E, O) {
        return { name: s, keyPath: u, unique: h, multi: g, auto: I, compound: E, src: (h && !O ? "&" : "") + (g ? "*" : "") + (I ? "++" : "") + kh(u) };
      }
      function kh(s) {
        return typeof s == "string" ? s : s ? "[" + [].join.call(s, "+") + "]" : "";
      }
      function bu(s, u, h) {
        return { name: s, primKey: u, indexes: h, mappedClass: null, idxByName: (g = function(I) {
          return [I.name, I];
        }, h.reduce(function(I, E, O) {
          return O = g(E, O), O && (I[O[0]] = O[1]), I;
        }, {})) };
        var g;
      }
      var xo = function(s) {
        try {
          return s.only([[]]), xo = function() {
            return [[]];
          }, [[]];
        } catch {
          return xo = function() {
            return Oi;
          }, Oi;
        }
      };
      function _u(s) {
        return s == null ? function() {
        } : typeof s == "string" ? (u = s).split(".").length === 1 ? function(h) {
          return h[u];
        } : function(h) {
          return fe(h, u);
        } : function(h) {
          return fe(h, s);
        };
        var u;
      }
      function Oh(s) {
        return [].slice.call(s);
      }
      var V0 = 0;
      function Eo(s) {
        return s == null ? ":id" : typeof s == "string" ? s : "[".concat(s.join("+"), "]");
      }
      function J0(s, u, U) {
        function g(z) {
          if (z.type === 3) return null;
          if (z.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var $ = z.lower, H = z.upper, Y = z.lowerOpen, z = z.upperOpen;
          return $ === void 0 ? H === void 0 ? null : u.upperBound(H, !!z) : H === void 0 ? u.lowerBound($, !!Y) : u.bound($, H, !!Y, !!z);
        }
        function I(V) {
          var $, H = V.name;
          return { name: H, schema: V, mutate: function(Y) {
            var z = Y.trans, Q = Y.type, re = Y.keys, ne = Y.values, ae = Y.range;
            return new Promise(function(pe, be) {
              pe = Te(pe);
              var de = z.objectStore(H), ge = de.keyPath == null, _e = Q === "put" || Q === "add";
              if (!_e && Q !== "delete" && Q !== "deleteRange") throw new Error("Invalid operation type: " + Q);
              var Ie, Ae = (re || ne || { length: 1 }).length;
              if (re && ne && re.length !== ne.length) throw new Error("Given keys array must have same length as given values array.");
              if (Ae === 0) return pe({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function Ye(cr) {
                ++Cr, _o(cr);
              }
              var rt = [], nt = [], Cr = 0;
              if (Q === "deleteRange") {
                if (ae.type === 4) return pe({ numFailures: Cr, failures: nt, results: [], lastResult: void 0 });
                ae.type === 3 ? rt.push(Ie = de.clear()) : rt.push(Ie = de.delete(g(ae)));
              } else {
                var ge = _e ? ge ? [ne, re] : [ne, null] : [re, null], ze = ge[0], Qt = ge[1];
                if (_e) for (var Xt = 0; Xt < Ae; ++Xt) rt.push(Ie = Qt && Qt[Xt] !== void 0 ? de[Q](ze[Xt], Qt[Xt]) : de[Q](ze[Xt])), Ie.onerror = Ye;
                else for (Xt = 0; Xt < Ae; ++Xt) rt.push(Ie = de[Q](ze[Xt])), Ie.onerror = Ye;
              }
              function _a(cr) {
                cr = cr.target.result, rt.forEach(function(Ni, Mu) {
                  return Ni.error != null && (nt[Mu] = Ni.error);
                }), pe({ numFailures: Cr, failures: nt, results: Q === "delete" ? re : rt.map(function(Ni) {
                  return Ni.result;
                }), lastResult: cr });
              }
              Ie.onerror = function(cr) {
                Ye(cr), _a(cr);
              }, Ie.onsuccess = _a;
            });
          }, getMany: function(Y) {
            var z = Y.trans, Q = Y.keys;
            return new Promise(function(re, ne) {
              re = Te(re);
              for (var ae, pe = z.objectStore(H), be = Q.length, de = new Array(be), ge = 0, _e = 0, Ie = function(rt) {
                rt = rt.target, de[rt._pos] = rt.result, ++_e === ge && re(de);
              }, Ae = rn(ne), Ye = 0; Ye < be; ++Ye) Q[Ye] != null && ((ae = pe.get(Q[Ye]))._pos = Ye, ae.onsuccess = Ie, ae.onerror = Ae, ++ge);
              ge === 0 && re(de);
            });
          }, get: function(Y) {
            var z = Y.trans, Q = Y.key;
            return new Promise(function(re, ne) {
              re = Te(re);
              var ae = z.objectStore(H).get(Q);
              ae.onsuccess = function(pe) {
                return re(pe.target.result);
              }, ae.onerror = rn(ne);
            });
          }, query: ($ = j, function(Y) {
            return new Promise(function(z, Q) {
              z = Te(z);
              var re, ne, ae, ge = Y.trans, pe = Y.values, be = Y.limit, Ie = Y.query, de = be === 1 / 0 ? void 0 : be, _e = Ie.index, Ie = Ie.range, ge = ge.objectStore(H), _e = _e.isPrimaryKey ? ge : ge.index(_e.name), Ie = g(Ie);
              if (be === 0) return z({ result: [] });
              $ ? ((de = pe ? _e.getAll(Ie, de) : _e.getAllKeys(Ie, de)).onsuccess = function(Ae) {
                return z({ result: Ae.target.result });
              }, de.onerror = rn(Q)) : (re = 0, ne = !pe && "openKeyCursor" in _e ? _e.openKeyCursor(Ie) : _e.openCursor(Ie), ae = [], ne.onsuccess = function(Ae) {
                var Ye = ne.result;
                return Ye ? (ae.push(pe ? Ye.value : Ye.primaryKey), ++re === be ? z({ result: ae }) : void Ye.continue()) : z({ result: ae });
              }, ne.onerror = rn(Q));
            });
          }), openCursor: function(Y) {
            var z = Y.trans, Q = Y.values, re = Y.query, ne = Y.reverse, ae = Y.unique;
            return new Promise(function(pe, be) {
              pe = Te(pe);
              var _e = re.index, de = re.range, ge = z.objectStore(H), ge = _e.isPrimaryKey ? ge : ge.index(_e.name), _e = ne ? ae ? "prevunique" : "prev" : ae ? "nextunique" : "next", Ie = !Q && "openKeyCursor" in ge ? ge.openKeyCursor(g(de), _e) : ge.openCursor(g(de), _e);
              Ie.onerror = rn(be), Ie.onsuccess = Te(function(Ae) {
                var Ye, rt, nt, Cr, ze = Ie.result;
                ze ? (ze.___id = ++V0, ze.done = !1, Ye = ze.continue.bind(ze), rt = (rt = ze.continuePrimaryKey) && rt.bind(ze), nt = ze.advance.bind(ze), Cr = function() {
                  throw new Error("Cursor not stopped");
                }, ze.trans = z, ze.stop = ze.continue = ze.continuePrimaryKey = ze.advance = function() {
                  throw new Error("Cursor not started");
                }, ze.fail = Te(be), ze.next = function() {
                  var Qt = this, Xt = 1;
                  return this.start(function() {
                    return Xt-- ? Qt.continue() : Qt.stop();
                  }).then(function() {
                    return Qt;
                  });
                }, ze.start = function(Qt) {
                  function Xt() {
                    if (Ie.result) try {
                      Qt();
                    } catch (cr) {
                      ze.fail(cr);
                    }
                    else ze.done = !0, ze.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, ze.stop();
                  }
                  var _a = new Promise(function(cr, Ni) {
                    cr = Te(cr), Ie.onerror = rn(Ni), ze.fail = Ni, ze.stop = function(Mu) {
                      ze.stop = ze.continue = ze.continuePrimaryKey = ze.advance = Cr, cr(Mu);
                    };
                  });
                  return Ie.onsuccess = Te(function(cr) {
                    Ie.onsuccess = Xt, Xt();
                  }), ze.continue = Ye, ze.continuePrimaryKey = rt, ze.advance = nt, Xt(), _a;
                }, pe(ze)) : pe(null);
              }, be);
            });
          }, count: function(Y) {
            var z = Y.query, Q = Y.trans, re = z.index, ne = z.range;
            return new Promise(function(ae, pe) {
              var be = Q.objectStore(H), de = re.isPrimaryKey ? be : be.index(re.name), be = g(ne), de = be ? de.count(be) : de.count();
              de.onsuccess = Te(function(ge) {
                return ae(ge.target.result);
              }), de.onerror = rn(pe);
            });
          } };
        }
        var E, O, N, W = (O = U, N = Oh((E = s).objectStoreNames), { schema: { name: E.name, tables: N.map(function(V) {
          return O.objectStore(V);
        }).map(function(V) {
          var $ = V.keyPath, z = V.autoIncrement, H = l($), Y = {}, z = { name: V.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: $ == null, compound: H, keyPath: $, autoIncrement: z, unique: !0, extractKey: _u($) }, indexes: Oh(V.indexNames).map(function(Q) {
            return V.index(Q);
          }).map(function(ae) {
            var re = ae.name, ne = ae.unique, pe = ae.multiEntry, ae = ae.keyPath, pe = { name: re, compound: l(ae), keyPath: ae, unique: ne, multiEntry: pe, extractKey: _u(ae) };
            return Y[Eo(ae)] = pe;
          }), getIndexByKeyPath: function(Q) {
            return Y[Eo(Q)];
          } };
          return Y[":id"] = z.primaryKey, $ != null && (Y[Eo($)] = z.primaryKey), z;
        }) }, hasGetAll: 0 < N.length && "getAll" in O.objectStore(N[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), U = W.schema, j = W.hasGetAll, W = U.tables.map(I), P = {};
        return W.forEach(function(V) {
          return P[V.name] = V;
        }), { stack: "dbcore", transaction: s.transaction.bind(s), table: function(V) {
          if (!P[V]) throw new Error("Table '".concat(V, "' not found"));
          return P[V];
        }, MIN_KEY: -1 / 0, MAX_KEY: xo(u), schema: U };
      }
      function Z0(s, u, h, g) {
        var I = h.IDBKeyRange;
        return h.indexedDB, { dbcore: (g = J0(u, I, g), s.dbcore.reduce(function(E, O) {
          return O = O.create, r(r({}, E), O(E));
        }, g)) };
      }
      function la(s, g) {
        var h = g.db, g = Z0(s._middlewares, h, s._deps, g);
        s.core = g.dbcore, s.tables.forEach(function(I) {
          var E = I.name;
          s.core.schema.tables.some(function(O) {
            return O.name === E;
          }) && (I.core = s.core.table(E), s[E] instanceof s.Table && (s[E].core = I.core));
        });
      }
      function ca(s, u, h, g) {
        h.forEach(function(I) {
          var E = g[I];
          u.forEach(function(O) {
            var N = function U(j, W) {
              return C(j, W) || (j = b(j)) && U(j, W);
            }(O, I);
            (!N || "value" in N && N.value === void 0) && (O === s.Transaction.prototype || O instanceof s.Transaction ? D(O, I, { get: function() {
              return this.table(I);
            }, set: function(U) {
              k(this, I, { value: U, writable: !0, configurable: !0, enumerable: !0 });
            } }) : O[I] = new s.Table(I, E));
          });
        });
      }
      function wu(s, u) {
        u.forEach(function(h) {
          for (var g in h) h[g] instanceof s.Table && delete h[g];
        });
      }
      function Q0(s, u) {
        return s._cfg.version - u._cfg.version;
      }
      function X0(s, u, h, g) {
        var I = s._dbSchema;
        h.objectStoreNames.contains("$meta") && !I.$meta && (I.$meta = bu("$meta", Th("")[0], []), s._storeNames.push("$meta"));
        var E = s._createTransaction("readwrite", s._storeNames, I);
        E.create(h), E._completion.catch(g);
        var O = E._reject.bind(E), N = q.transless || q;
        Nt(function() {
          return q.trans = E, q.transless = N, u !== 0 ? (la(s, h), j = u, ((U = E).storeNames.includes("$meta") ? U.table("$meta").get("version").then(function(W) {
            return W ?? j;
          }) : f.resolve(j)).then(function(W) {
            return V = W, $ = E, H = h, Y = [], W = (P = s)._versions, z = P._dbSchema = ha(0, P.idbdb, H), (W = W.filter(function(Q) {
              return Q._cfg.version >= V;
            })).length !== 0 ? (W.forEach(function(Q) {
              Y.push(function() {
                var re = z, ne = Q._cfg.dbschema;
                pa(P, re, H), pa(P, ne, H), z = P._dbSchema = ne;
                var ae = xu(re, ne);
                ae.add.forEach(function(_e) {
                  Eu(H, _e[0], _e[1].primKey, _e[1].indexes);
                }), ae.change.forEach(function(_e) {
                  if (_e.recreate) throw new he.Upgrade("Not yet support for changing primary key");
                  var Ie = H.objectStore(_e.name);
                  _e.add.forEach(function(Ae) {
                    return fa(Ie, Ae);
                  }), _e.change.forEach(function(Ae) {
                    Ie.deleteIndex(Ae.name), fa(Ie, Ae);
                  }), _e.del.forEach(function(Ae) {
                    return Ie.deleteIndex(Ae);
                  });
                });
                var pe = Q._cfg.contentUpgrade;
                if (pe && Q._cfg.version > V) {
                  la(P, H), $._memoizedTables = {};
                  var be = ke(ne);
                  ae.del.forEach(function(_e) {
                    be[_e] = re[_e];
                  }), wu(P, [P.Transaction.prototype]), ca(P, [P.Transaction.prototype], a(be), be), $.schema = be;
                  var de, ge = Ve(pe);
                  return ge && St(), ae = f.follow(function() {
                    var _e;
                    (de = pe($)) && ge && (_e = $t.bind(null, null), de.then(_e, _e));
                  }), de && typeof de.then == "function" ? f.resolve(de) : ae.then(function() {
                    return de;
                  });
                }
              }), Y.push(function(re) {
                var ne, ae, pe = Q._cfg.dbschema;
                ne = pe, ae = re, [].slice.call(ae.db.objectStoreNames).forEach(function(be) {
                  return ne[be] == null && ae.db.deleteObjectStore(be);
                }), wu(P, [P.Transaction.prototype]), ca(P, [P.Transaction.prototype], P._storeNames, P._dbSchema), $.schema = P._dbSchema;
              }), Y.push(function(re) {
                P.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(P.idbdb.version / 10) === Q._cfg.version ? (P.idbdb.deleteObjectStore("$meta"), delete P._dbSchema.$meta, P._storeNames = P._storeNames.filter(function(ne) {
                  return ne !== "$meta";
                })) : re.objectStore("$meta").put(Q._cfg.version, "version"));
              });
            }), function Q() {
              return Y.length ? f.resolve(Y.shift()($.idbtrans)).then(Q) : f.resolve();
            }().then(function() {
              Rh(z, H);
            })) : f.resolve();
            var P, V, $, H, Y, z;
          }).catch(O)) : (a(I).forEach(function(W) {
            Eu(h, W, I[W].primKey, I[W].indexes);
          }), la(s, h), void f.follow(function() {
            return s.on.populate.fire(E);
          }).catch(O));
          var U, j;
        });
      }
      function ey(s, u) {
        Rh(s._dbSchema, u), u.db.version % 10 != 0 || u.objectStoreNames.contains("$meta") || u.db.createObjectStore("$meta").add(Math.ceil(u.db.version / 10 - 1), "version");
        var h = ha(0, s.idbdb, u);
        pa(s, s._dbSchema, u);
        for (var g = 0, I = xu(h, s._dbSchema).change; g < I.length; g++) {
          var E = function(O) {
            if (O.change.length || O.recreate) return console.warn("Unable to patch indexes of table ".concat(O.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var N = u.objectStore(O.name);
            O.add.forEach(function(U) {
              qe && console.debug("Dexie upgrade patch: Creating missing index ".concat(O.name, ".").concat(U.src)), fa(N, U);
            });
          }(I[g]);
          if (typeof E == "object") return E.value;
        }
      }
      function xu(s, u) {
        var h, g = { del: [], add: [], change: [] };
        for (h in s) u[h] || g.del.push(h);
        for (h in u) {
          var I = s[h], E = u[h];
          if (I) {
            var O = { name: h, def: E, recreate: !1, del: [], add: [], change: [] };
            if ("" + (I.primKey.keyPath || "") != "" + (E.primKey.keyPath || "") || I.primKey.auto !== E.primKey.auto) O.recreate = !0, g.change.push(O);
            else {
              var N = I.idxByName, U = E.idxByName, j = void 0;
              for (j in N) U[j] || O.del.push(j);
              for (j in U) {
                var W = N[j], P = U[j];
                W ? W.src !== P.src && O.change.push(P) : O.add.push(P);
              }
              (0 < O.del.length || 0 < O.add.length || 0 < O.change.length) && g.change.push(O);
            }
          } else g.add.push([h, E]);
        }
        return g;
      }
      function Eu(s, u, h, g) {
        var I = s.db.createObjectStore(u, h.keyPath ? { keyPath: h.keyPath, autoIncrement: h.auto } : { autoIncrement: h.auto });
        return g.forEach(function(E) {
          return fa(I, E);
        }), I;
      }
      function Rh(s, u) {
        a(s).forEach(function(h) {
          u.db.objectStoreNames.contains(h) || (qe && console.debug("Dexie: Creating missing table", h), Eu(u, h, s[h].primKey, s[h].indexes));
        });
      }
      function fa(s, u) {
        s.createIndex(u.name, u.keyPath, { unique: u.unique, multiEntry: u.multi });
      }
      function ha(s, u, h) {
        var g = {};
        return J(u.objectStoreNames, 0).forEach(function(I) {
          for (var E = h.objectStore(I), O = Iu(kh(j = E.keyPath), j || "", !0, !1, !!E.autoIncrement, j && typeof j != "string", !0), N = [], U = 0; U < E.indexNames.length; ++U) {
            var W = E.index(E.indexNames[U]), j = W.keyPath, W = Iu(W.name, j, !!W.unique, !!W.multiEntry, !1, j && typeof j != "string", !1);
            N.push(W);
          }
          g[I] = bu(I, O, N);
        }), g;
      }
      function pa(s, u, h) {
        for (var g = h.db.objectStoreNames, I = 0; I < g.length; ++I) {
          var E = g[I], O = h.objectStore(E);
          s._hasGetAll = "getAll" in O;
          for (var N = 0; N < O.indexNames.length; ++N) {
            var U = O.indexNames[N], j = O.index(U).keyPath, W = typeof j == "string" ? j : "[" + J(j).join("+") + "]";
            !u[E] || (j = u[E].idxByName[W]) && (j.name = U, delete u[E].idxByName[W], u[E].idxByName[U] = j);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && o.WorkerGlobalScope && o instanceof o.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (s._hasGetAll = !1);
      }
      function Th(s) {
        return s.split(",").map(function(u, h) {
          var g = (u = u.trim()).replace(/([&*]|\+\+)/g, ""), I = /^\[/.test(g) ? g.match(/^\[(.*)\]$/)[1].split("+") : g;
          return Iu(g, I || null, /\&/.test(u), /\*/.test(u), /\+\+/.test(u), l(I), h === 0);
        });
      }
      var ty = (da.prototype._parseStoresSpec = function(s, u) {
        a(s).forEach(function(h) {
          if (s[h] !== null) {
            var g = Th(s[h]), I = g.shift();
            if (I.unique = !0, I.multi) throw new he.Schema("Primary key cannot be multi-valued");
            g.forEach(function(E) {
              if (E.auto) throw new he.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!E.keyPath) throw new he.Schema("Index must have a name and cannot be an empty string");
            }), u[h] = bu(h, I, g);
          }
        });
      }, da.prototype.stores = function(h) {
        var u = this.db;
        this._cfg.storesSource = this._cfg.storesSource ? c(this._cfg.storesSource, h) : h;
        var h = u._versions, g = {}, I = {};
        return h.forEach(function(E) {
          c(g, E._cfg.storesSource), I = E._cfg.dbschema = {}, E._parseStoresSpec(g, I);
        }), u._dbSchema = I, wu(u, [u._allTables, u, u.Transaction.prototype]), ca(u, [u._allTables, u, u.Transaction.prototype, this._cfg.tables], a(I), I), u._storeNames = a(I), this;
      }, da.prototype.upgrade = function(s) {
        return this._cfg.contentUpgrade = Ot(this._cfg.contentUpgrade || me, s), this;
      }, da);
      function da() {
      }
      function Su(s, u) {
        var h = s._dbNamesDB;
        return h || (h = s._dbNamesDB = new bn(ia, { addons: [], indexedDB: s, IDBKeyRange: u })).version(1).stores({ dbnames: "name" }), h.table("dbnames");
      }
      function Au(s) {
        return s && typeof s.databases == "function";
      }
      function ku(s) {
        return Nt(function() {
          return q.letThrough = !0, s();
        });
      }
      function Ou(s) {
        return !("from" in s);
      }
      var Zt = function(s, u) {
        if (!this) {
          var h = new Zt();
          return s && "d" in s && c(h, s), h;
        }
        c(this, arguments.length ? { d: 1, from: s, to: 1 < arguments.length ? u : s } : { d: 0 });
      };
      function So(s, u, h) {
        var g = at(u, h);
        if (!isNaN(g)) {
          if (0 < g) throw RangeError();
          if (Ou(s)) return c(s, { from: u, to: h, d: 1 });
          var I = s.l, g = s.r;
          if (at(h, s.from) < 0) return I ? So(I, u, h) : s.l = { from: u, to: h, d: 1, l: null, r: null }, Nh(s);
          if (0 < at(u, s.to)) return g ? So(g, u, h) : s.r = { from: u, to: h, d: 1, l: null, r: null }, Nh(s);
          at(u, s.from) < 0 && (s.from = u, s.l = null, s.d = g ? g.d + 1 : 1), 0 < at(h, s.to) && (s.to = h, s.r = null, s.d = s.l ? s.l.d + 1 : 1), h = !s.r, I && !s.l && Ao(s, I), g && h && Ao(s, g);
        }
      }
      function Ao(s, u) {
        Ou(u) || function h(g, U) {
          var E = U.from, O = U.to, N = U.l, U = U.r;
          So(g, E, O), N && h(g, N), U && h(g, U);
        }(s, u);
      }
      function Ch(s, u) {
        var h = va(u), g = h.next();
        if (g.done) return !1;
        for (var I = g.value, E = va(s), O = E.next(I.from), N = O.value; !g.done && !O.done; ) {
          if (at(N.from, I.to) <= 0 && 0 <= at(N.to, I.from)) return !0;
          at(I.from, N.from) < 0 ? I = (g = h.next(N.from)).value : N = (O = E.next(I.from)).value;
        }
        return !1;
      }
      function va(s) {
        var u = Ou(s) ? null : { s: 0, n: s };
        return { next: function(h) {
          for (var g = 0 < arguments.length; u; ) switch (u.s) {
            case 0:
              if (u.s = 1, g) for (; u.n.l && at(h, u.n.from) < 0; ) u = { up: u, n: u.n.l, s: 1 };
              else for (; u.n.l; ) u = { up: u, n: u.n.l, s: 1 };
            case 1:
              if (u.s = 2, !g || at(h, u.n.to) <= 0) return { value: u.n, done: !1 };
            case 2:
              if (u.n.r) {
                u.s = 3, u = { up: u, n: u.n.r, s: 0 };
                continue;
              }
            case 3:
              u = u.up;
          }
          return { done: !0 };
        } };
      }
      function Nh(s) {
        var u, h, g = (((u = s.r) === null || u === void 0 ? void 0 : u.d) || 0) - (((h = s.l) === null || h === void 0 ? void 0 : h.d) || 0), I = 1 < g ? "r" : g < -1 ? "l" : "";
        I && (u = I == "r" ? "l" : "r", h = r({}, s), g = s[I], s.from = g.from, s.to = g.to, s[I] = g[I], h[I] = g[u], (s[u] = h).d = Ph(h)), s.d = Ph(s);
      }
      function Ph(h) {
        var u = h.r, h = h.l;
        return (u ? h ? Math.max(u.d, h.d) : u.d : h ? h.d : 0) + 1;
      }
      function ga(s, u) {
        return a(u).forEach(function(h) {
          s[h] ? Ao(s[h], u[h]) : s[h] = function g(I) {
            var E, O, N = {};
            for (E in I) w(I, E) && (O = I[E], N[E] = !O || typeof O != "object" || $e.has(O.constructor) ? O : g(O));
            return N;
          }(u[h]);
        }), s;
      }
      function Ru(s, u) {
        return s.all || u.all || Object.keys(s).some(function(h) {
          return u[h] && Ch(u[h], s[h]);
        });
      }
      x(Zt.prototype, ((qr = { add: function(s) {
        return Ao(this, s), this;
      }, addKey: function(s) {
        return So(this, s, s), this;
      }, addKeys: function(s) {
        var u = this;
        return s.forEach(function(h) {
          return So(u, h, h);
        }), this;
      }, hasKey: function(s) {
        var u = va(this).next(s).value;
        return u && at(u.from, s) <= 0 && 0 <= at(u.to, s);
      } })[vt] = function() {
        return va(this);
      }, qr));
      var Ti = {}, Tu = {}, Cu = !1;
      function ya(s) {
        ga(Tu, s), Cu || (Cu = !0, setTimeout(function() {
          Cu = !1, Nu(Tu, !(Tu = {}));
        }, 0));
      }
      function Nu(s, u) {
        u === void 0 && (u = !1);
        var h = /* @__PURE__ */ new Set();
        if (s.all) for (var g = 0, I = Object.values(Ti); g < I.length; g++) Dh(O = I[g], s, h, u);
        else for (var E in s) {
          var O, N = /^idb\:\/\/(.*)\/(.*)\//.exec(E);
          N && (E = N[1], N = N[2], (O = Ti["idb://".concat(E, "/").concat(N)]) && Dh(O, s, h, u));
        }
        h.forEach(function(U) {
          return U();
        });
      }
      function Dh(s, u, h, g) {
        for (var I = [], E = 0, O = Object.entries(s.queries.query); E < O.length; E++) {
          for (var N = O[E], U = N[0], j = [], W = 0, P = N[1]; W < P.length; W++) {
            var V = P[W];
            Ru(u, V.obsSet) ? V.subscribers.forEach(function(z) {
              return h.add(z);
            }) : g && j.push(V);
          }
          g && I.push([U, j]);
        }
        if (g) for (var $ = 0, H = I; $ < H.length; $++) {
          var Y = H[$], U = Y[0], j = Y[1];
          s.queries.query[U] = j;
        }
      }
      function ry(s) {
        var u = s._state, h = s._deps.indexedDB;
        if (u.isBeingOpened || s.idbdb) return u.dbReadyPromise.then(function() {
          return u.dbOpenError ? Pt(u.dbOpenError) : s;
        });
        u.isBeingOpened = !0, u.dbOpenError = null, u.openComplete = !1;
        var g = u.openCanceller, I = Math.round(10 * s.verno), E = !1;
        function O() {
          if (u.openCanceller !== g) throw new he.DatabaseClosed("db.open() was cancelled");
        }
        function N() {
          return new f(function(V, $) {
            if (O(), !h) throw new he.MissingAPI();
            var H = s.name, Y = u.autoSchema || !I ? h.open(H) : h.open(H, I);
            if (!Y) throw new he.MissingAPI();
            Y.onerror = rn($), Y.onblocked = Te(s._fireOnBlocked), Y.onupgradeneeded = Te(function(z) {
              var Q;
              W = Y.transaction, u.autoSchema && !s._options.allowEmptyDB ? (Y.onerror = _o, W.abort(), Y.result.close(), (Q = h.deleteDatabase(H)).onsuccess = Q.onerror = Te(function() {
                $(new he.NoSuchDatabase("Database ".concat(H, " doesnt exist")));
              })) : (W.onerror = rn($), z = z.oldVersion > Math.pow(2, 62) ? 0 : z.oldVersion, P = z < 1, s.idbdb = Y.result, E && ey(s, W), X0(s, z / 10, W, $));
            }, $), Y.onsuccess = Te(function() {
              W = null;
              var z, Q, re, ne, ae, pe = s.idbdb = Y.result, be = J(pe.objectStoreNames);
              if (0 < be.length) try {
                var de = pe.transaction((ne = be).length === 1 ? ne[0] : ne, "readonly");
                if (u.autoSchema) Q = pe, re = de, (z = s).verno = Q.version / 10, re = z._dbSchema = ha(0, Q, re), z._storeNames = J(Q.objectStoreNames, 0), ca(z, [z._allTables], a(re), re);
                else if (pa(s, s._dbSchema, de), ((ae = xu(ha(0, (ae = s).idbdb, de), ae._dbSchema)).add.length || ae.change.some(function(ge) {
                  return ge.add.length || ge.change.length;
                })) && !E) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), pe.close(), I = pe.version + 1, E = !0, V(N());
                la(s, de);
              } catch {
              }
              _s.push(s), pe.onversionchange = Te(function(ge) {
                u.vcFired = !0, s.on("versionchange").fire(ge);
              }), pe.onclose = Te(function(ge) {
                s.on("close").fire(ge);
              }), P && (ae = s._deps, de = H, pe = ae.indexedDB, ae = ae.IDBKeyRange, Au(pe) || de === ia || Su(pe, ae).put({ name: de }).catch(me)), V();
            }, $);
          }).catch(function(V) {
            switch (V == null ? void 0 : V.name) {
              case "UnknownError":
                if (0 < u.PR1398_maxLoop) return u.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), N();
                break;
              case "VersionError":
                if (0 < I) return I = 0, N();
            }
            return f.reject(V);
          });
        }
        var U, j = u.dbReadyResolve, W = null, P = !1;
        return f.race([g, (typeof navigator > "u" ? f.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(V) {
          function $() {
            return indexedDB.databases().finally(V);
          }
          U = setInterval($, 100), $();
        }).finally(function() {
          return clearInterval(U);
        }) : Promise.resolve()).then(N)]).then(function() {
          return O(), u.onReadyBeingFired = [], f.resolve(ku(function() {
            return s.on.ready.fire(s.vip);
          })).then(function V() {
            if (0 < u.onReadyBeingFired.length) {
              var $ = u.onReadyBeingFired.reduce(Ot, me);
              return u.onReadyBeingFired = [], f.resolve(ku(function() {
                return $(s.vip);
              })).then(V);
            }
          });
        }).finally(function() {
          u.openCanceller === g && (u.onReadyBeingFired = null, u.isBeingOpened = !1);
        }).catch(function(V) {
          u.dbOpenError = V;
          try {
            W && W.abort();
          } catch {
          }
          return g === u.openCanceller && s._close(), Pt(V);
        }).finally(function() {
          u.openComplete = !0, j();
        }).then(function() {
          var V;
          return P && (V = {}, s.tables.forEach(function($) {
            $.schema.indexes.forEach(function(H) {
              H.name && (V["idb://".concat(s.name, "/").concat($.name, "/").concat(H.name)] = new Zt(-1 / 0, [[[]]]));
            }), V["idb://".concat(s.name, "/").concat($.name, "/")] = V["idb://".concat(s.name, "/").concat($.name, "/:dels")] = new Zt(-1 / 0, [[[]]]);
          }), qn(wo).fire(V), Nu(V, !0)), s;
        });
      }
      function Pu(s) {
        function u(E) {
          return s.next(E);
        }
        var h = I(u), g = I(function(E) {
          return s.throw(E);
        });
        function I(E) {
          return function(U) {
            var N = E(U), U = N.value;
            return N.done ? U : U && typeof U.then == "function" ? U.then(h, g) : l(U) ? Promise.all(U).then(h, g) : h(U);
          };
        }
        return I(u)();
      }
      function ma(s, u, h) {
        for (var g = l(s) ? s.slice() : [s], I = 0; I < h; ++I) g.push(u);
        return g;
      }
      var ny = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(s) {
        return r(r({}, s), { table: function(u) {
          var h = s.table(u), g = h.schema, I = {}, E = [];
          function O(P, V, $) {
            var H = Eo(P), Y = I[H] = I[H] || [], z = P == null ? 0 : typeof P == "string" ? 1 : P.length, Q = 0 < V, Q = r(r({}, $), { name: Q ? "".concat(H, "(virtual-from:").concat($.name, ")") : $.name, lowLevelIndex: $, isVirtual: Q, keyTail: V, keyLength: z, extractKey: _u(P), unique: !Q && $.unique });
            return Y.push(Q), Q.isPrimaryKey || E.push(Q), 1 < z && O(z === 2 ? P[0] : P.slice(0, z - 1), V + 1, $), Y.sort(function(re, ne) {
              return re.keyTail - ne.keyTail;
            }), Q;
          }
          u = O(g.primaryKey.keyPath, 0, g.primaryKey), I[":id"] = [u];
          for (var N = 0, U = g.indexes; N < U.length; N++) {
            var j = U[N];
            O(j.keyPath, 0, j);
          }
          function W(P) {
            var V, $ = P.query.index;
            return $.isVirtual ? r(r({}, P), { query: { index: $.lowLevelIndex, range: (V = P.query.range, $ = $.keyTail, { type: V.type === 1 ? 2 : V.type, lower: ma(V.lower, V.lowerOpen ? s.MAX_KEY : s.MIN_KEY, $), lowerOpen: !0, upper: ma(V.upper, V.upperOpen ? s.MIN_KEY : s.MAX_KEY, $), upperOpen: !0 }) } }) : P;
          }
          return r(r({}, h), { schema: r(r({}, g), { primaryKey: u, indexes: E, getIndexByKeyPath: function(P) {
            return (P = I[Eo(P)]) && P[0];
          } }), count: function(P) {
            return h.count(W(P));
          }, query: function(P) {
            return h.query(W(P));
          }, openCursor: function(P) {
            var V = P.query.index, $ = V.keyTail, H = V.isVirtual, Y = V.keyLength;
            return H ? h.openCursor(W(P)).then(function(Q) {
              return Q && z(Q);
            }) : h.openCursor(P);
            function z(Q) {
              return Object.create(Q, { continue: { value: function(re) {
                re != null ? Q.continue(ma(re, P.reverse ? s.MAX_KEY : s.MIN_KEY, $)) : P.unique ? Q.continue(Q.key.slice(0, Y).concat(P.reverse ? s.MIN_KEY : s.MAX_KEY, $)) : Q.continue();
              } }, continuePrimaryKey: { value: function(re, ne) {
                Q.continuePrimaryKey(ma(re, s.MAX_KEY, $), ne);
              } }, primaryKey: { get: function() {
                return Q.primaryKey;
              } }, key: { get: function() {
                var re = Q.key;
                return Y === 1 ? re[0] : re.slice(0, Y);
              } }, value: { get: function() {
                return Q.value;
              } } });
            }
          } });
        } });
      } };
      function Du(s, u, h, g) {
        return h = h || {}, g = g || "", a(s).forEach(function(I) {
          var E, O, N;
          w(u, I) ? (E = s[I], O = u[I], typeof E == "object" && typeof O == "object" && E && O ? (N = ot(E)) !== ot(O) ? h[g + I] = u[I] : N === "Object" ? Du(E, O, h, g + I + ".") : E !== O && (h[g + I] = u[I]) : E !== O && (h[g + I] = u[I])) : h[g + I] = void 0;
        }), a(u).forEach(function(I) {
          w(s, I) || (h[g + I] = u[I]);
        }), h;
      }
      function Bu(s, u) {
        return u.type === "delete" ? u.keys : u.keys || u.values.map(s.extractKey);
      }
      var iy = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(s) {
        return r(r({}, s), { table: function(u) {
          var h = s.table(u), g = h.schema.primaryKey;
          return r(r({}, h), { mutate: function(I) {
            var E = q.trans, O = E.table(u).hook, N = O.deleting, U = O.creating, j = O.updating;
            switch (I.type) {
              case "add":
                if (U.fire === me) break;
                return E._promise("readwrite", function() {
                  return W(I);
                }, !0);
              case "put":
                if (U.fire === me && j.fire === me) break;
                return E._promise("readwrite", function() {
                  return W(I);
                }, !0);
              case "delete":
                if (N.fire === me) break;
                return E._promise("readwrite", function() {
                  return W(I);
                }, !0);
              case "deleteRange":
                if (N.fire === me) break;
                return E._promise("readwrite", function() {
                  return function P(V, $, H) {
                    return h.query({ trans: V, values: !1, query: { index: g, range: $ }, limit: H }).then(function(Y) {
                      var z = Y.result;
                      return W({ type: "delete", keys: z, trans: V }).then(function(Q) {
                        return 0 < Q.numFailures ? Promise.reject(Q.failures[0]) : z.length < H ? { failures: [], numFailures: 0, lastResult: void 0 } : P(V, r(r({}, $), { lower: z[z.length - 1], lowerOpen: !0 }), H);
                      });
                    });
                  }(I.trans, I.range, 1e4);
                }, !0);
            }
            return h.mutate(I);
            function W(P) {
              var V, $, H, Y = q.trans, z = P.keys || Bu(g, P);
              if (!z) throw new Error("Keys missing");
              return (P = P.type === "add" || P.type === "put" ? r(r({}, P), { keys: z }) : r({}, P)).type !== "delete" && (P.values = i([], P.values)), P.keys && (P.keys = i([], P.keys)), V = h, H = z, (($ = P).type === "add" ? Promise.resolve([]) : V.getMany({ trans: $.trans, keys: H, cache: "immutable" })).then(function(Q) {
                var re = z.map(function(ne, ae) {
                  var pe, be, de, ge = Q[ae], _e = { onerror: null, onsuccess: null };
                  return P.type === "delete" ? N.fire.call(_e, ne, ge, Y) : P.type === "add" || ge === void 0 ? (pe = U.fire.call(_e, ne, P.values[ae], Y), ne == null && pe != null && (P.keys[ae] = ne = pe, g.outbound || oe(P.values[ae], g.keyPath, ne))) : (pe = Du(ge, P.values[ae]), (be = j.fire.call(_e, pe, ne, ge, Y)) && (de = P.values[ae], Object.keys(be).forEach(function(Ie) {
                    w(de, Ie) ? de[Ie] = be[Ie] : oe(de, Ie, be[Ie]);
                  }))), _e;
                });
                return h.mutate(P).then(function(ne) {
                  for (var ae = ne.failures, pe = ne.results, be = ne.numFailures, ne = ne.lastResult, de = 0; de < z.length; ++de) {
                    var ge = (pe || z)[de], _e = re[de];
                    ge == null ? _e.onerror && _e.onerror(ae[de]) : _e.onsuccess && _e.onsuccess(P.type === "put" && Q[de] ? P.values[de] : ge);
                  }
                  return { failures: ae, results: pe, numFailures: be, lastResult: ne };
                }).catch(function(ne) {
                  return re.forEach(function(ae) {
                    return ae.onerror && ae.onerror(ne);
                  }), Promise.reject(ne);
                });
              });
            }
          } });
        } });
      } };
      function Bh(s, u, h) {
        try {
          if (!u || u.keys.length < s.length) return null;
          for (var g = [], I = 0, E = 0; I < u.keys.length && E < s.length; ++I) at(u.keys[I], s[E]) === 0 && (g.push(h ? Se(u.values[I]) : u.values[I]), ++E);
          return g.length === s.length ? g : null;
        } catch {
          return null;
        }
      }
      var sy = { stack: "dbcore", level: -1, create: function(s) {
        return { table: function(u) {
          var h = s.table(u);
          return r(r({}, h), { getMany: function(g) {
            if (!g.cache) return h.getMany(g);
            var I = Bh(g.keys, g.trans._cache, g.cache === "clone");
            return I ? f.resolve(I) : h.getMany(g).then(function(E) {
              return g.trans._cache = { keys: g.keys, values: g.cache === "clone" ? Se(E) : E }, E;
            });
          }, mutate: function(g) {
            return g.type !== "add" && (g.trans._cache = null), h.mutate(g);
          } });
        } };
      } };
      function Fh(s, u) {
        return s.trans.mode === "readonly" && !!s.subscr && !s.trans.explicit && s.trans.db._options.cache !== "disabled" && !u.schema.primaryKey.outbound;
      }
      function Lh(s, u) {
        switch (s) {
          case "query":
            return u.values && !u.unique;
          case "get":
          case "getMany":
          case "count":
          case "openCursor":
            return !1;
        }
      }
      var oy = { stack: "dbcore", level: 0, name: "Observability", create: function(s) {
        var u = s.schema.name, h = new Zt(s.MIN_KEY, s.MAX_KEY);
        return r(r({}, s), { transaction: function(g, I, E) {
          if (q.subscr && I !== "readonly") throw new he.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(q.querier));
          return s.transaction(g, I, E);
        }, table: function(g) {
          var I = s.table(g), E = I.schema, O = E.primaryKey, P = E.indexes, N = O.extractKey, U = O.outbound, j = O.autoIncrement && P.filter(function($) {
            return $.compound && $.keyPath.includes(O.keyPath);
          }), W = r(r({}, I), { mutate: function($) {
            function H(Ie) {
              return Ie = "idb://".concat(u, "/").concat(g, "/").concat(Ie), ne[Ie] || (ne[Ie] = new Zt());
            }
            var Y, z, Q, re = $.trans, ne = $.mutatedParts || ($.mutatedParts = {}), ae = H(""), pe = H(":dels"), be = $.type, _e = $.type === "deleteRange" ? [$.range] : $.type === "delete" ? [$.keys] : $.values.length < 50 ? [Bu(O, $).filter(function(Ie) {
              return Ie;
            }), $.values] : [], de = _e[0], ge = _e[1], _e = $.trans._cache;
            return l(de) ? (ae.addKeys(de), (_e = be === "delete" || de.length === ge.length ? Bh(de, _e) : null) || pe.addKeys(de), (_e || ge) && (Y = H, z = _e, Q = ge, E.indexes.forEach(function(Ie) {
              var Ae = Y(Ie.name || "");
              function Ye(nt) {
                return nt != null ? Ie.extractKey(nt) : null;
              }
              function rt(nt) {
                return Ie.multiEntry && l(nt) ? nt.forEach(function(Cr) {
                  return Ae.addKey(Cr);
                }) : Ae.addKey(nt);
              }
              (z || Q).forEach(function(nt, Qt) {
                var ze = z && Ye(z[Qt]), Qt = Q && Ye(Q[Qt]);
                at(ze, Qt) !== 0 && (ze != null && rt(ze), Qt != null && rt(Qt));
              });
            }))) : de ? (ge = { from: (ge = de.lower) !== null && ge !== void 0 ? ge : s.MIN_KEY, to: (ge = de.upper) !== null && ge !== void 0 ? ge : s.MAX_KEY }, pe.add(ge), ae.add(ge)) : (ae.add(h), pe.add(h), E.indexes.forEach(function(Ie) {
              return H(Ie.name).add(h);
            })), I.mutate($).then(function(Ie) {
              return !de || $.type !== "add" && $.type !== "put" || (ae.addKeys(Ie.results), j && j.forEach(function(Ae) {
                for (var Ye = $.values.map(function(ze) {
                  return Ae.extractKey(ze);
                }), rt = Ae.keyPath.findIndex(function(ze) {
                  return ze === O.keyPath;
                }), nt = 0, Cr = Ie.results.length; nt < Cr; ++nt) Ye[nt][rt] = Ie.results[nt];
                H(Ae.name).addKeys(Ye);
              })), re.mutatedParts = ga(re.mutatedParts || {}, ne), Ie;
            });
          } }), P = function(H) {
            var Y = H.query, H = Y.index, Y = Y.range;
            return [H, new Zt((H = Y.lower) !== null && H !== void 0 ? H : s.MIN_KEY, (Y = Y.upper) !== null && Y !== void 0 ? Y : s.MAX_KEY)];
          }, V = { get: function($) {
            return [O, new Zt($.key)];
          }, getMany: function($) {
            return [O, new Zt().addKeys($.keys)];
          }, count: P, query: P, openCursor: P };
          return a(V).forEach(function($) {
            W[$] = function(H) {
              var Y = q.subscr, z = !!Y, Q = Fh(q, I) && Lh($, H) ? H.obsSet = {} : Y;
              if (z) {
                var re = function(ge) {
                  return ge = "idb://".concat(u, "/").concat(g, "/").concat(ge), Q[ge] || (Q[ge] = new Zt());
                }, ne = re(""), ae = re(":dels"), Y = V[$](H), z = Y[0], Y = Y[1];
                if (($ === "query" && z.isPrimaryKey && !H.values ? ae : re(z.name || "")).add(Y), !z.isPrimaryKey) {
                  if ($ !== "count") {
                    var pe = $ === "query" && U && H.values && I.query(r(r({}, H), { values: !1 }));
                    return I[$].apply(this, arguments).then(function(ge) {
                      if ($ === "query") {
                        if (U && H.values) return pe.then(function(Ye) {
                          return Ye = Ye.result, ne.addKeys(Ye), ge;
                        });
                        var _e = H.values ? ge.result.map(N) : ge.result;
                        (H.values ? ne : ae).addKeys(_e);
                      } else if ($ === "openCursor") {
                        var Ie = ge, Ae = H.values;
                        return Ie && Object.create(Ie, { key: { get: function() {
                          return ae.addKey(Ie.primaryKey), Ie.key;
                        } }, primaryKey: { get: function() {
                          var Ye = Ie.primaryKey;
                          return ae.addKey(Ye), Ye;
                        } }, value: { get: function() {
                          return Ae && ne.addKey(Ie.primaryKey), Ie.value;
                        } } });
                      }
                      return ge;
                    });
                  }
                  ae.add(h);
                }
              }
              return I[$].apply(this, arguments);
            };
          }), W;
        } });
      } };
      function qh(s, u, h) {
        if (h.numFailures === 0) return u;
        if (u.type === "deleteRange") return null;
        var g = u.keys ? u.keys.length : "values" in u && u.values ? u.values.length : 1;
        return h.numFailures === g ? null : (u = r({}, u), l(u.keys) && (u.keys = u.keys.filter(function(I, E) {
          return !(E in h.failures);
        })), "values" in u && l(u.values) && (u.values = u.values.filter(function(I, E) {
          return !(E in h.failures);
        })), u);
      }
      function Fu(s, u) {
        return h = s, ((g = u).lower === void 0 || (g.lowerOpen ? 0 < at(h, g.lower) : 0 <= at(h, g.lower))) && (s = s, (u = u).upper === void 0 || (u.upperOpen ? at(s, u.upper) < 0 : at(s, u.upper) <= 0));
        var h, g;
      }
      function Mh(s, u, V, g, I, E) {
        if (!V || V.length === 0) return s;
        var O = u.query.index, N = O.multiEntry, U = u.query.range, j = g.schema.primaryKey.extractKey, W = O.extractKey, P = (O.lowLevelIndex || O).extractKey, V = V.reduce(function($, H) {
          var Y = $, z = [];
          if (H.type === "add" || H.type === "put") for (var Q = new Zt(), re = H.values.length - 1; 0 <= re; --re) {
            var ne, ae = H.values[re], pe = j(ae);
            Q.hasKey(pe) || (ne = W(ae), (N && l(ne) ? ne.some(function(Ie) {
              return Fu(Ie, U);
            }) : Fu(ne, U)) && (Q.addKey(pe), z.push(ae)));
          }
          switch (H.type) {
            case "add":
              var be = new Zt().addKeys(u.values ? $.map(function(Ae) {
                return j(Ae);
              }) : $), Y = $.concat(u.values ? z.filter(function(Ae) {
                return Ae = j(Ae), !be.hasKey(Ae) && (be.addKey(Ae), !0);
              }) : z.map(function(Ae) {
                return j(Ae);
              }).filter(function(Ae) {
                return !be.hasKey(Ae) && (be.addKey(Ae), !0);
              }));
              break;
            case "put":
              var de = new Zt().addKeys(H.values.map(function(Ae) {
                return j(Ae);
              }));
              Y = $.filter(function(Ae) {
                return !de.hasKey(u.values ? j(Ae) : Ae);
              }).concat(u.values ? z : z.map(function(Ae) {
                return j(Ae);
              }));
              break;
            case "delete":
              var ge = new Zt().addKeys(H.keys);
              Y = $.filter(function(Ae) {
                return !ge.hasKey(u.values ? j(Ae) : Ae);
              });
              break;
            case "deleteRange":
              var _e = H.range;
              Y = $.filter(function(Ae) {
                return !Fu(j(Ae), _e);
              });
          }
          return Y;
        }, s);
        return V === s ? s : (V.sort(function($, H) {
          return at(P($), P(H)) || at(j($), j(H));
        }), u.limit && u.limit < 1 / 0 && (V.length > u.limit ? V.length = u.limit : s.length === u.limit && V.length < u.limit && (I.dirty = !0)), E ? Object.freeze(V) : V);
      }
      function Uh(s, u) {
        return at(s.lower, u.lower) === 0 && at(s.upper, u.upper) === 0 && !!s.lowerOpen == !!u.lowerOpen && !!s.upperOpen == !!u.upperOpen;
      }
      function ay(s, u) {
        return function(h, g, I, E) {
          if (h === void 0) return g !== void 0 ? -1 : 0;
          if (g === void 0) return 1;
          if ((g = at(h, g)) === 0) {
            if (I && E) return 0;
            if (I) return 1;
            if (E) return -1;
          }
          return g;
        }(s.lower, u.lower, s.lowerOpen, u.lowerOpen) <= 0 && 0 <= function(h, g, I, E) {
          if (h === void 0) return g !== void 0 ? 1 : 0;
          if (g === void 0) return -1;
          if ((g = at(h, g)) === 0) {
            if (I && E) return 0;
            if (I) return -1;
            if (E) return 1;
          }
          return g;
        }(s.upper, u.upper, s.upperOpen, u.upperOpen);
      }
      function uy(s, u, h, g) {
        s.subscribers.add(h), g.addEventListener("abort", function() {
          var I, E;
          s.subscribers.delete(h), s.subscribers.size === 0 && (I = s, E = u, setTimeout(function() {
            I.subscribers.size === 0 && He(E, I);
          }, 3e3));
        });
      }
      var ly = { stack: "dbcore", level: 0, name: "Cache", create: function(s) {
        var u = s.schema.name;
        return r(r({}, s), { transaction: function(h, g, I) {
          var E, O, N = s.transaction(h, g, I);
          return g === "readwrite" && (O = (E = new AbortController()).signal, I = function(U) {
            return function() {
              if (E.abort(), g === "readwrite") {
                for (var j = /* @__PURE__ */ new Set(), W = 0, P = h; W < P.length; W++) {
                  var V = P[W], $ = Ti["idb://".concat(u, "/").concat(V)];
                  if ($) {
                    var H = s.table(V), Y = $.optimisticOps.filter(function(Ae) {
                      return Ae.trans === N;
                    });
                    if (N._explicit && U && N.mutatedParts) for (var z = 0, Q = Object.values($.queries.query); z < Q.length; z++) for (var re = 0, ne = (be = Q[z]).slice(); re < ne.length; re++) Ru((de = ne[re]).obsSet, N.mutatedParts) && (He(be, de), de.subscribers.forEach(function(Ae) {
                      return j.add(Ae);
                    }));
                    else if (0 < Y.length) {
                      $.optimisticOps = $.optimisticOps.filter(function(Ae) {
                        return Ae.trans !== N;
                      });
                      for (var ae = 0, pe = Object.values($.queries.query); ae < pe.length; ae++) for (var be, de, ge, _e = 0, Ie = (be = pe[ae]).slice(); _e < Ie.length; _e++) (de = Ie[_e]).res != null && N.mutatedParts && (U && !de.dirty ? (ge = Object.isFrozen(de.res), ge = Mh(de.res, de.req, Y, H, de, ge), de.dirty ? (He(be, de), de.subscribers.forEach(function(Ae) {
                        return j.add(Ae);
                      })) : ge !== de.res && (de.res = ge, de.promise = f.resolve({ result: ge }))) : (de.dirty && He(be, de), de.subscribers.forEach(function(Ae) {
                        return j.add(Ae);
                      })));
                    }
                  }
                }
                j.forEach(function(Ae) {
                  return Ae();
                });
              }
            };
          }, N.addEventListener("abort", I(!1), { signal: O }), N.addEventListener("error", I(!1), { signal: O }), N.addEventListener("complete", I(!0), { signal: O })), N;
        }, table: function(h) {
          var g = s.table(h), I = g.schema.primaryKey;
          return r(r({}, g), { mutate: function(E) {
            var O = q.trans;
            if (I.outbound || O.db._options.cache === "disabled" || O.explicit || O.idbtrans.mode !== "readwrite") return g.mutate(E);
            var N = Ti["idb://".concat(u, "/").concat(h)];
            return N ? (O = g.mutate(E), E.type !== "add" && E.type !== "put" || !(50 <= E.values.length || Bu(I, E).some(function(U) {
              return U == null;
            })) ? (N.optimisticOps.push(E), E.mutatedParts && ya(E.mutatedParts), O.then(function(U) {
              0 < U.numFailures && (He(N.optimisticOps, E), (U = qh(0, E, U)) && N.optimisticOps.push(U), E.mutatedParts && ya(E.mutatedParts));
            }), O.catch(function() {
              He(N.optimisticOps, E), E.mutatedParts && ya(E.mutatedParts);
            })) : O.then(function(U) {
              var j = qh(0, r(r({}, E), { values: E.values.map(function(W, P) {
                var V;
                return U.failures[P] ? W : (W = (V = I.keyPath) !== null && V !== void 0 && V.includes(".") ? Se(W) : r({}, W), oe(W, I.keyPath, U.results[P]), W);
              }) }), U);
              N.optimisticOps.push(j), queueMicrotask(function() {
                return E.mutatedParts && ya(E.mutatedParts);
              });
            }), O) : g.mutate(E);
          }, query: function(E) {
            if (!Fh(q, g) || !Lh("query", E)) return g.query(E);
            var O = ((j = q.trans) === null || j === void 0 ? void 0 : j.db._options.cache) === "immutable", P = q, N = P.requery, U = P.signal, j = function(H, Y, z, Q) {
              var re = Ti["idb://".concat(H, "/").concat(Y)];
              if (!re) return [];
              if (!(Y = re.queries[z])) return [null, !1, re, null];
              var ne = Y[(Q.query ? Q.query.index.name : null) || ""];
              if (!ne) return [null, !1, re, null];
              switch (z) {
                case "query":
                  var ae = ne.find(function(pe) {
                    return pe.req.limit === Q.limit && pe.req.values === Q.values && Uh(pe.req.query.range, Q.query.range);
                  });
                  return ae ? [ae, !0, re, ne] : [ne.find(function(pe) {
                    return ("limit" in pe.req ? pe.req.limit : 1 / 0) >= Q.limit && (!Q.values || pe.req.values) && ay(pe.req.query.range, Q.query.range);
                  }), !1, re, ne];
                case "count":
                  return ae = ne.find(function(pe) {
                    return Uh(pe.req.query.range, Q.query.range);
                  }), [ae, !!ae, re, ne];
              }
            }(u, h, "query", E), W = j[0], P = j[1], V = j[2], $ = j[3];
            return W && P ? W.obsSet = E.obsSet : (P = g.query(E).then(function(H) {
              var Y = H.result;
              if (W && (W.res = Y), O) {
                for (var z = 0, Q = Y.length; z < Q; ++z) Object.freeze(Y[z]);
                Object.freeze(Y);
              } else H.result = Se(Y);
              return H;
            }).catch(function(H) {
              return $ && W && He($, W), Promise.reject(H);
            }), W = { obsSet: E.obsSet, promise: P, subscribers: /* @__PURE__ */ new Set(), type: "query", req: E, dirty: !1 }, $ ? $.push(W) : ($ = [W], (V = V || (Ti["idb://".concat(u, "/").concat(h)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[E.query.index.name || ""] = $)), uy(W, $, N, U), W.promise.then(function(H) {
              return { result: Mh(H.result, E, V == null ? void 0 : V.optimisticOps, g, W, O) };
            });
          } });
        } });
      } };
      function Ia(s, u) {
        return new Proxy(s, { get: function(h, g, I) {
          return g === "db" ? u : Reflect.get(h, g, I);
        } });
      }
      var bn = (Dt.prototype.version = function(s) {
        if (isNaN(s) || s < 0.1) throw new he.Type("Given version is not a positive number");
        if (s = Math.round(10 * s) / 10, this.idbdb || this._state.isBeingOpened) throw new he.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, s);
        var u = this._versions, h = u.filter(function(g) {
          return g._cfg.version === s;
        })[0];
        return h || (h = new this.Version(s), u.push(h), u.sort(Q0), h.stores({}), this._state.autoSchema = !1, h);
      }, Dt.prototype._whenReady = function(s) {
        var u = this;
        return this.idbdb && (this._state.openComplete || q.letThrough || this._vip) ? s() : new f(function(h, g) {
          if (u._state.openComplete) return g(new he.DatabaseClosed(u._state.dbOpenError));
          if (!u._state.isBeingOpened) {
            if (!u._state.autoOpen) return void g(new he.DatabaseClosed());
            u.open().catch(me);
          }
          u._state.dbReadyPromise.then(h, g);
        }).then(s);
      }, Dt.prototype.use = function(s) {
        var u = s.stack, h = s.create, g = s.level, I = s.name;
        return I && this.unuse({ stack: u, name: I }), s = this._middlewares[u] || (this._middlewares[u] = []), s.push({ stack: u, create: h, level: g ?? 10, name: I }), s.sort(function(E, O) {
          return E.level - O.level;
        }), this;
      }, Dt.prototype.unuse = function(s) {
        var u = s.stack, h = s.name, g = s.create;
        return u && this._middlewares[u] && (this._middlewares[u] = this._middlewares[u].filter(function(I) {
          return g ? I.create !== g : !!h && I.name !== h;
        })), this;
      }, Dt.prototype.open = function() {
        var s = this;
        return ki(B, function() {
          return ry(s);
        });
      }, Dt.prototype._close = function() {
        var s = this._state, u = _s.indexOf(this);
        if (0 <= u && _s.splice(u, 1), this.idbdb) {
          try {
            this.idbdb.close();
          } catch {
          }
          this.idbdb = null;
        }
        s.isBeingOpened || (s.dbReadyPromise = new f(function(h) {
          s.dbReadyResolve = h;
        }), s.openCanceller = new f(function(h, g) {
          s.cancelOpen = g;
        }));
      }, Dt.prototype.close = function(h) {
        var u = (h === void 0 ? { disableAutoOpen: !0 } : h).disableAutoOpen, h = this._state;
        u ? (h.isBeingOpened && h.cancelOpen(new he.DatabaseClosed()), this._close(), h.autoOpen = !1, h.dbOpenError = new he.DatabaseClosed()) : (this._close(), h.autoOpen = this._options.autoOpen || h.isBeingOpened, h.openComplete = !1, h.dbOpenError = null);
      }, Dt.prototype.delete = function(s) {
        var u = this;
        s === void 0 && (s = { disableAutoOpen: !0 });
        var h = 0 < arguments.length && typeof arguments[0] != "object", g = this._state;
        return new f(function(I, E) {
          function O() {
            u.close(s);
            var N = u._deps.indexedDB.deleteDatabase(u.name);
            N.onsuccess = Te(function() {
              var U, j, W;
              U = u._deps, j = u.name, W = U.indexedDB, U = U.IDBKeyRange, Au(W) || j === ia || Su(W, U).delete(j).catch(me), I();
            }), N.onerror = rn(E), N.onblocked = u._fireOnBlocked;
          }
          if (h) throw new he.InvalidArgument("Invalid closeOptions argument to db.delete()");
          g.isBeingOpened ? g.dbReadyPromise.then(O) : O();
        });
      }, Dt.prototype.backendDB = function() {
        return this.idbdb;
      }, Dt.prototype.isOpen = function() {
        return this.idbdb !== null;
      }, Dt.prototype.hasBeenClosed = function() {
        var s = this._state.dbOpenError;
        return s && s.name === "DatabaseClosed";
      }, Dt.prototype.hasFailed = function() {
        return this._state.dbOpenError !== null;
      }, Dt.prototype.dynamicallyOpened = function() {
        return this._state.autoSchema;
      }, Object.defineProperty(Dt.prototype, "tables", { get: function() {
        var s = this;
        return a(this._allTables).map(function(u) {
          return s._allTables[u];
        });
      }, enumerable: !1, configurable: !0 }), Dt.prototype.transaction = function() {
        var s = (function(u, h, g) {
          var I = arguments.length;
          if (I < 2) throw new he.InvalidArgument("Too few arguments");
          for (var E = new Array(I - 1); --I; ) E[I - 1] = arguments[I];
          return g = E.pop(), [u, Ce(E), g];
        }).apply(this, arguments);
        return this._transaction.apply(this, s);
      }, Dt.prototype._transaction = function(s, u, h) {
        var g = this, I = q.trans;
        I && I.db === this && s.indexOf("!") === -1 || (I = null);
        var E, O, N = s.indexOf("?") !== -1;
        s = s.replace("!", "").replace("?", "");
        try {
          if (O = u.map(function(j) {
            if (j = j instanceof g.Table ? j.name : j, typeof j != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return j;
          }), s == "r" || s === pu) E = pu;
          else {
            if (s != "rw" && s != du) throw new he.InvalidArgument("Invalid transaction mode: " + s);
            E = du;
          }
          if (I) {
            if (I.mode === pu && E === du) {
              if (!N) throw new he.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              I = null;
            }
            I && O.forEach(function(j) {
              if (I && I.storeNames.indexOf(j) === -1) {
                if (!N) throw new he.SubTransaction("Table " + j + " not included in parent transaction.");
                I = null;
              }
            }), N && I && !I.active && (I = null);
          }
        } catch (j) {
          return I ? I._promise(null, function(W, P) {
            P(j);
          }) : Pt(j);
        }
        var U = (function j(W, P, V, $, H) {
          return f.resolve().then(function() {
            var Y = q.transless || q, z = W._createTransaction(P, V, W._dbSchema, $);
            if (z.explicit = !0, Y = { trans: z, transless: Y }, $) z.idbtrans = $.idbtrans;
            else try {
              z.create(), z.idbtrans._explicit = !0, W._state.PR1398_maxLoop = 3;
            } catch (ne) {
              return ne.name === lt.InvalidState && W.isOpen() && 0 < --W._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), W.close({ disableAutoOpen: !1 }), W.open().then(function() {
                return j(W, P, V, null, H);
              })) : Pt(ne);
            }
            var Q, re = Ve(H);
            return re && St(), Y = f.follow(function() {
              var ne;
              (Q = H.call(z, z)) && (re ? (ne = $t.bind(null, null), Q.then(ne, ne)) : typeof Q.next == "function" && typeof Q.throw == "function" && (Q = Pu(Q)));
            }, Y), (Q && typeof Q.then == "function" ? f.resolve(Q).then(function(ne) {
              return z.active ? ne : Pt(new he.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : Y.then(function() {
              return Q;
            })).then(function(ne) {
              return $ && z._resolve(), z._completion.then(function() {
                return ne;
              });
            }).catch(function(ne) {
              return z._reject(ne), Pt(ne);
            });
          });
        }).bind(null, this, E, O, I, h);
        return I ? I._promise(E, U, "lock") : q.trans ? ki(q.transless, function() {
          return g._whenReady(U);
        }) : this._whenReady(U);
      }, Dt.prototype.table = function(s) {
        if (!w(this._allTables, s)) throw new he.InvalidTable("Table ".concat(s, " does not exist"));
        return this._allTables[s];
      }, Dt);
      function Dt(s, u) {
        var h = this;
        this._middlewares = {}, this.verno = 0;
        var g = Dt.dependencies;
        this._options = u = r({ addons: Dt.addons, autoOpen: !0, indexedDB: g.indexedDB, IDBKeyRange: g.IDBKeyRange, cache: "cloned" }, u), this._deps = { indexedDB: u.indexedDB, IDBKeyRange: u.IDBKeyRange }, g = u.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
        var I, E, O, N, U, j = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: me, dbReadyPromise: null, cancelOpen: me, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: u.autoOpen };
        j.dbReadyPromise = new f(function(P) {
          j.dbReadyResolve = P;
        }), j.openCanceller = new f(function(P, V) {
          j.cancelOpen = V;
        }), this._state = j, this.name = s, this.on = mo(this, "populate", "blocked", "versionchange", "close", { ready: [Ot, me] }), this.on.ready.subscribe = X(this.on.ready.subscribe, function(P) {
          return function(V, $) {
            Dt.vip(function() {
              var H, Y = h._state;
              Y.openComplete ? (Y.dbOpenError || f.resolve().then(V), $ && P(V)) : Y.onReadyBeingFired ? (Y.onReadyBeingFired.push(V), $ && P(V)) : (P(V), H = h, $ || P(function z() {
                H.on.ready.unsubscribe(V), H.on.ready.unsubscribe(z);
              }));
            });
          };
        }), this.Collection = (I = this, Io(G0.prototype, function(Q, z) {
          this.db = I;
          var $ = yh, H = null;
          if (z) try {
            $ = z();
          } catch (re) {
            H = re;
          }
          var Y = Q._ctx, z = Y.table, Q = z.hook.reading.fire;
          this._ctx = { table: z, index: Y.index, isPrimKey: !Y.index || z.schema.primKey.keyPath && Y.index === z.schema.primKey.name, range: $, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: H, or: Y.or, valueMapper: Q !== je ? Q : null };
        })), this.Table = (E = this, Io(_h.prototype, function(P, V, $) {
          this.db = E, this._tx = $, this.name = P, this.schema = V, this.hook = E._allTables[P] ? E._allTables[P].hook : mo(null, { creating: [ct, me], reading: [yt, je], updating: [Le, me], deleting: [st, me] });
        })), this.Transaction = (O = this, Io(Y0.prototype, function(P, V, $, H, Y) {
          var z = this;
          this.db = O, this.mode = P, this.storeNames = V, this.schema = $, this.chromeTransactionDurability = H, this.idbtrans = null, this.on = mo(this, "complete", "error", "abort"), this.parent = Y || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new f(function(Q, re) {
            z._resolve = Q, z._reject = re;
          }), this._completion.then(function() {
            z.active = !1, z.on.complete.fire();
          }, function(Q) {
            var re = z.active;
            return z.active = !1, z.on.error.fire(Q), z.parent ? z.parent._reject(Q) : re && z.idbtrans && z.idbtrans.abort(), Pt(Q);
          });
        })), this.Version = (N = this, Io(ty.prototype, function(P) {
          this.db = N, this._cfg = { version: P, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (U = this, Io(Ah.prototype, function(P, V, $) {
          if (this.db = U, this._ctx = { table: P, index: V === ":id" ? null : V, or: $ }, this._cmp = this._ascending = at, this._descending = function(H, Y) {
            return at(Y, H);
          }, this._max = function(H, Y) {
            return 0 < at(H, Y) ? H : Y;
          }, this._min = function(H, Y) {
            return at(H, Y) < 0 ? H : Y;
          }, this._IDBKeyRange = U._deps.IDBKeyRange, !this._IDBKeyRange) throw new he.MissingAPI();
        })), this.on("versionchange", function(P) {
          0 < P.newVersion ? console.warn("Another connection wants to upgrade database '".concat(h.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(h.name, "'. Closing db now to resume the delete request.")), h.close({ disableAutoOpen: !1 });
        }), this.on("blocked", function(P) {
          !P.newVersion || P.newVersion < P.oldVersion ? console.warn("Dexie.delete('".concat(h.name, "') was blocked")) : console.warn("Upgrade '".concat(h.name, "' blocked by other connection holding version ").concat(P.oldVersion / 10));
        }), this._maxKey = xo(u.IDBKeyRange), this._createTransaction = function(P, V, $, H) {
          return new h.Transaction(P, V, $, h._options.chromeTransactionDurability, H);
        }, this._fireOnBlocked = function(P) {
          h.on("blocked").fire(P), _s.filter(function(V) {
            return V.name === h.name && V !== h && !V._state.vcFired;
          }).map(function(V) {
            return V.on("versionchange").fire(P);
          });
        }, this.use(sy), this.use(ly), this.use(oy), this.use(ny), this.use(iy);
        var W = new Proxy(this, { get: function(P, V, $) {
          if (V === "_vip") return !0;
          if (V === "table") return function(Y) {
            return Ia(h.table(Y), W);
          };
          var H = Reflect.get(P, V, $);
          return H instanceof _h ? Ia(H, W) : V === "tables" ? H.map(function(Y) {
            return Ia(Y, W);
          }) : V === "_createTransaction" ? function() {
            return Ia(H.apply(this, arguments), W);
          } : H;
        } });
        this.vip = W, g.forEach(function(P) {
          return P(h);
        });
      }
      var ba, qr = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", cy = (Lu.prototype.subscribe = function(s, u, h) {
        return this._subscribe(s && typeof s != "function" ? s : { next: s, error: u, complete: h });
      }, Lu.prototype[qr] = function() {
        return this;
      }, Lu);
      function Lu(s) {
        this._subscribe = s;
      }
      try {
        ba = { indexedDB: o.indexedDB || o.mozIndexedDB || o.webkitIndexedDB || o.msIndexedDB, IDBKeyRange: o.IDBKeyRange || o.webkitIDBKeyRange };
      } catch {
        ba = { indexedDB: null, IDBKeyRange: null };
      }
      function $h(s) {
        var u, h = !1, g = new cy(function(I) {
          var E = Ve(s), O, N = !1, U = {}, j = {}, W = { get closed() {
            return N;
          }, unsubscribe: function() {
            N || (N = !0, O && O.abort(), P && qn.storagemutated.unsubscribe($));
          } };
          I.start && I.start(W);
          var P = !1, V = function() {
            return hu(H);
          }, $ = function(Y) {
            ga(U, Y), Ru(j, U) && V();
          }, H = function() {
            var Y, z, Q;
            !N && ba.indexedDB && (U = {}, Y = {}, O && O.abort(), O = new AbortController(), Q = function(re) {
              var ne = xe();
              try {
                E && St();
                var ae = Nt(s, re);
                return ae = E ? ae.finally($t) : ae;
              } finally {
                ne && Je();
              }
            }(z = { subscr: Y, signal: O.signal, requery: V, querier: s, trans: null }), Promise.resolve(Q).then(function(re) {
              h = !0, u = re, N || z.signal.aborted || (U = {}, function(ne) {
                for (var ae in ne) if (w(ne, ae)) return;
                return 1;
              }(j = Y) || P || (qn(wo, $), P = !0), hu(function() {
                return !N && I.next && I.next(re);
              }));
            }, function(re) {
              h = !1, ["DatabaseClosedError", "AbortError"].includes(re == null ? void 0 : re.name) || N || hu(function() {
                N || I.error && I.error(re);
              });
            }));
          };
          return setTimeout(V, 0), W;
        });
        return g.hasValue = function() {
          return h;
        }, g.getValue = function() {
          return u;
        }, g;
      }
      var Ci = bn;
      function qu(s) {
        var u = Mn;
        try {
          Mn = !0, qn.storagemutated.fire(s), Nu(s, !0);
        } finally {
          Mn = u;
        }
      }
      x(Ci, r(r({}, et), { delete: function(s) {
        return new Ci(s, { addons: [] }).delete();
      }, exists: function(s) {
        return new Ci(s, { addons: [] }).open().then(function(u) {
          return u.close(), !0;
        }).catch("NoSuchDatabaseError", function() {
          return !1;
        });
      }, getDatabaseNames: function(s) {
        try {
          return u = Ci.dependencies, h = u.indexedDB, u = u.IDBKeyRange, (Au(h) ? Promise.resolve(h.databases()).then(function(g) {
            return g.map(function(I) {
              return I.name;
            }).filter(function(I) {
              return I !== ia;
            });
          }) : Su(h, u).toCollection().primaryKeys()).then(s);
        } catch {
          return Pt(new he.MissingAPI());
        }
        var u, h;
      }, defineClass: function() {
        return function(s) {
          c(this, s);
        };
      }, ignoreTransaction: function(s) {
        return q.trans ? ki(q.transless, s) : s();
      }, vip: ku, async: function(s) {
        return function() {
          try {
            var u = Pu(s.apply(this, arguments));
            return u && typeof u.then == "function" ? u : f.resolve(u);
          } catch (h) {
            return Pt(h);
          }
        };
      }, spawn: function(s, u, h) {
        try {
          var g = Pu(s.apply(h, u || []));
          return g && typeof g.then == "function" ? g : f.resolve(g);
        } catch (I) {
          return Pt(I);
        }
      }, currentTransaction: { get: function() {
        return q.trans || null;
      } }, waitFor: function(s, u) {
        return u = f.resolve(typeof s == "function" ? Ci.ignoreTransaction(s) : s).timeout(u || 6e4), q.trans ? q.trans.waitFor(u) : u;
      }, Promise: f, debug: { get: function() {
        return qe;
      }, set: function(s) {
        Qe(s);
      } }, derive: K, extend: c, props: x, override: X, Events: mo, on: qn, liveQuery: $h, extendObservabilitySet: ga, getByKeyPath: fe, setByKeyPath: oe, delByKeyPath: function(s, u) {
        typeof u == "string" ? oe(s, u, void 0) : "length" in u && [].map.call(u, function(h) {
          oe(s, h, void 0);
        });
      }, shallowClone: ke, deepClone: Se, getObjectDiff: Du, cmp: at, asap: ce, minKey: -1 / 0, addons: [], connections: _s, errnames: lt, dependencies: ba, cache: Ti, semVer: "4.0.11", version: "4.0.11".split(".").map(function(s) {
        return parseInt(s);
      }).reduce(function(s, u, h) {
        return s + u / Math.pow(10, 2 * h);
      }) })), Ci.maxKey = xo(Ci.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (qn(wo, function(s) {
        Mn || (s = new CustomEvent(mu, { detail: s }), Mn = !0, dispatchEvent(s), Mn = !1);
      }), addEventListener(mu, function(s) {
        s = s.detail, Mn || qu(s);
      }));
      var Es, Mn = !1, jh = function() {
      };
      return typeof BroadcastChannel < "u" && ((jh = function() {
        (Es = new BroadcastChannel(mu)).onmessage = function(s) {
          return s.data && qu(s.data);
        };
      })(), typeof Es.unref == "function" && Es.unref(), qn(wo, function(s) {
        Mn || Es.postMessage(s);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(s) {
        if (!bn.disableBfCache && s.persisted) {
          qe && console.debug("Dexie: handling persisted pagehide"), Es != null && Es.close();
          for (var u = 0, h = _s; u < h.length; u++) h[u].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(s) {
        !bn.disableBfCache && s.persisted && (qe && console.debug("Dexie: handling persisted pageshow"), jh(), qu({ all: new Zt(-1 / 0, [[]]) }));
      })), f.rejectionMapper = function(s, u) {
        return !s || s instanceof Ze || s instanceof TypeError || s instanceof SyntaxError || !s.name || !Fe[s.name] ? s : (u = new Fe[s.name](u || s.message, s), "stack" in s && D(u, "stack", { get: function() {
          return this.inner.stack;
        } }), u);
      }, Qe(qe), r(bn, Object.freeze({ __proto__: null, Dexie: bn, liveQuery: $h, Entity: mh, cmp: at, PropModification: bo, replacePrefix: function(s, u) {
        return new bo({ replacePrefix: [s, u] });
      }, add: function(s) {
        return new bo({ add: s });
      }, remove: function(s) {
        return new bo({ remove: s });
      }, default: bn, RangeSet: Zt, mergeRanges: Ao, rangesOverlap: Ch }), { default: bn }), bn;
    });
  }(Ta)), Ta.exports;
}
var kI = AI();
const cf = /* @__PURE__ */ Ef(kI), Ev = Symbol.for("Dexie"), Lt = globalThis[Ev] || (globalThis[Ev] = cf);
if (cf.semVer !== Lt.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${cf.semVer} and ${Lt.semVer}`);
const {
  liveQuery: e_,
  mergeRanges: t_,
  rangesOverlap: r_,
  RangeSet: n_,
  cmp: i_,
  Entity: s_,
  PropModification: o_,
  replacePrefix: a_,
  add: u_,
  remove: l_
} = Lt;
var Wr, jr, Fs, Ls, an, Mi, qs;
const Za = class Za {
  constructor() {
    /*  # How It Works:
    
            Scalar keys are stored in the #scalars Map, array keys in #arrays, object keys in #objects.
    
            Array keys are converted to strings.
            To convert an array to a string, each item is first mapped to a number.
            The mapping for this is #arrayItemMap, a nested JSONMap,
            whose values are consecutive integers starting at 0.
            Those integers are concatenated separated by commas to form the key string.
    
            Object keys are converted to arrays, then processed like array keys (above),
            but using a different JSONMap, #objectItemMap, to avoid collisions with arrays.
            To convert an object to an array, first its keys are sorted alphabetically.
            The values are put into an array, ordered by key; then the array of keys is added.
            For example, {b: 12, a: 34} turns into [34, 12, ["a", "b"]].
    
            (The reason for doing it this way is that it's expected that lots of objects will have
            the same set of keys, or "shape". Putting the shape into one array item means it will be
            stored only once, saving space in the nested #objectItemMap.)
        */
    ee(this, Wr, /* @__PURE__ */ new Map());
    ee(this, jr, /* @__PURE__ */ new Map());
    // string-encoded array -> value
    ee(this, Fs);
    // array item -> serial number
    ee(this, Ls, new Array());
    // serial number -> array item
    ee(this, an, /* @__PURE__ */ new Map());
    // string-encoded object -> value
    ee(this, Mi);
    // object item -> serial number
    ee(this, qs, new Array());
  }
  get size() {
    return p(this, Wr).size + p(this, jr).size + p(this, an).size;
  }
  /** Returns the value (T) associated with `key`, else `undefined`. */
  get(e) {
    if (typeof e != "object" || e === null)
      return p(this, Wr).get(e);
    if (Array.isArray(e)) {
      const t = this.encodeExistingKey(e, p(this, Fs));
      return t !== void 0 ? p(this, jr).get(t) : void 0;
    } else {
      if (!p(this, Mi))
        return;
      const t = this.objectToArray(e), r = this.encodeExistingKey(t, p(this, Mi));
      return r !== void 0 ? p(this, an).get(r) : void 0;
    }
  }
  /** Sets the value of `key` to `value`, replacing any existing value. */
  set(e, t) {
    typeof e != "object" || e === null ? p(this, Wr).set(e, t) : Array.isArray(e) ? p(this, jr).set(this.encodeArrayKey(e), t) : p(this, an).set(this.encodeObjectKey(e), t);
  }
  /** Adds a new key `key` with value `value` and returns true;
   *  if `key` already has a value, does nothing and returns false. */
  insert(e, t) {
    return typeof e != "object" || e === null ? Bc(p(this, Wr), e, t) : Array.isArray(e) ? Bc(p(this, jr), this.encodeArrayKey(e), t) : Bc(p(this, an), this.encodeObjectKey(e), t);
  }
  /** Returns the value (T) associated with the `key`.
   *  If there isn't one yet, it calls the `makeValue` function to create one and adds it.
   *  > Note:  With complex keys this is more efficient than calling `get` and then `insert`. */
  upsert(e, t) {
    return typeof e != "object" || e === null ? Fc(p(this, Wr), e, t) : Array.isArray(e) ? Fc(p(this, jr), this.encodeArrayKey(e), t) : Fc(p(this, an), this.encodeObjectKey(e), t);
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  *entries() {
    for (let e of p(this, Wr).entries())
      yield e;
    for (let [e, t] of p(this, jr).entries())
      yield [this.decodeArrayKey(e), t];
    for (let [e, t] of p(this, an).entries())
      yield [this.decodeObjectKey(e), t];
  }
  *keys() {
    for (let e of p(this, Wr).keys())
      yield e;
    for (let e of p(this, jr).keys())
      yield this.decodeArrayKey(e);
    for (let e of p(this, jr).keys())
      yield this.decodeObjectKey(e);
  }
  *values() {
    for (let e of p(this, Wr).values())
      yield e;
    for (let e of p(this, jr).values())
      yield e;
    for (let e of p(this, an).values())
      yield e;
  }
  toString() {
    let e = ["JSONMap {"];
    for (const [t, r] of this)
      e.push(`	${JSON.stringify(t)} : ${JSON.stringify(r)}`);
    return e.push("}"), e.join(`
`);
  }
  //---- INTERNALS:
  /** Maps each array item to a unique number and joins those numbers in a string. */
  encodeArrayKey(e) {
    let t = p(this, Fs);
    return t || (t = G(this, Fs, new Za())), e.map((r) => t.upsert(r, () => (p(this, Ls).push(r), p(this, Ls).length - 1))).toString();
  }
  /** Converts an encoded array key back into the same array. */
  decodeArrayKey(e) {
    return e !== "" ? e.split(",").map((t) => p(this, Ls)[Number(t)]) : [];
  }
  encodeExistingKey(e, t) {
    if (!t)
      return;
    let r = [];
    for (const i of e) {
      const o = t.get(i);
      if (o === void 0)
        return;
      r.push(o);
    }
    return r.toString();
  }
  /** Converts an object to an array consisting of the values sorted by key,
   *  ending with an array of sorted keys. */
  objectToArray(e) {
    const t = Object.keys(e).sort(), r = t.map((i) => e[i]);
    return r.push(t), r;
  }
  encodeObjectKey(e) {
    let t = p(this, Mi);
    return t || (t = G(this, Mi, new Za())), this.objectToArray(e).map((i) => t.upsert(i, () => (p(this, qs).push(i), p(this, qs).length - 1))).toString();
  }
  /** Converts an encoded object key back into the same object. */
  decodeObjectKey(e) {
    if (e === "")
      return {};
    const t = e.split(",").map((o) => p(this, qs)[Number(o)]), r = t.pop();
    Ue(t.length === r.length);
    let i = {};
    for (let o = 0; o < r.length; ++o)
      i[r[o]] = t[o];
    return i;
  }
  // serial number -> object item
};
Wr = new WeakMap(), jr = new WeakMap(), Fs = new WeakMap(), Ls = new WeakMap(), an = new WeakMap(), Mi = new WeakMap(), qs = new WeakMap();
let Wa = Za;
function Bc(n, e, t) {
  return n.has(e) ? !1 : (n.set(e, t), !0);
}
function Fc(n, e, t) {
  let r = n.get(e);
  return r === void 0 && (r = t(), n.set(e, r)), r;
}
class Si {
  constructor() {
    ve(this, "receiver");
  }
  then(e) {
    return this.receiver = e;
  }
  start() {
    this.receiver.start();
  }
  end() {
    this.receiver.end();
  }
  explain(e) {
    var t;
    (t = this.receiver) == null || t.explain(e);
  }
}
class w0 {
  constructor() {
    ve(this, "receiver");
  }
  then(e) {
    return this.receiver = e;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async run(e) {
    return this.receiver.start(), this.receiver.next(new yo(e)) ? (this.receiver.end(), !0) : !1;
  }
  /** Stops an active `run` call ASAP, causing its promise to reject. */
  interrupt() {
  }
  explain(e) {
    var t;
    (t = this.receiver) == null || t.explain(e);
  }
  /** Convenience method to generate the explanation as a single multi-line string. */
  get explanation() {
    let e = [];
    return this.explain(e), e.join(`
`);
  }
}
class Ya extends Error {
  constructor() {
    super("Query interrupted"), this.name = "InterruptedQueryError";
  }
}
var Yr, un, $o, Ui, Ms;
class x0 extends w0 {
  constructor(t) {
    var r, i;
    super();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ve(this, "collection");
    ve(this, "alias");
    ee(this, Yr);
    // The index being searched, if any
    ee(this, un);
    // Index constraint(s)
    ee(this, $o);
    // Indexed properties to sort by
    ee(this, Ui);
    // True if deleted revs must be detected
    ee(this, Ms, !1);
    if (this.config = t, this.collection = t.collection, this.alias = t.alias, G(this, Yr, t.index), G(this, Ui, !0), (r = t.indexedWhereOrSort) != null && r.length) {
      Nn(t.index, "config.index");
      const o = t.indexedWhereOrSort.map((a) => a instanceof hs ? a : a.key);
      t.indexedWhereOrSort[0] instanceof hs ? G(this, $o, t.indexedWhereOrSort) : G(this, un, t.indexedWhereOrSort), o.some((a) => a.keypath !== Lo && a.keypath !== Po) && G(this, Ui, !1);
    }
    ((i = this.config.filters) == null ? void 0 : i.length) === 0 && (this.config.filters = void 0);
  }
  async run(t) {
    G(this, Ms, !1);
    const r = t instanceof Ga ? t : t.ctx, i = t instanceof Ga ? void 0 : t, o = this.receiver instanceof ff ? this.receiver : void 0;
    let a;
    i ? a = i.use(() => this.makeQuery()) : a = this.makeQuery(), this.receiver.start();
    let l = !0;
    if (a !== void 0) {
      const c = i ?? new yo(r);
      let b = await a.toArray();
      if (p(this, Ms))
        throw new Ya();
      for (let m of b)
        if (m.encrypted && await this.collection.decryptRevision(m), c.dataSources.set(this.config.alias, m), (!this.config.filters || this.config.filters.every((w) => c.eval(w))) && (l = o ? await o.asyncNext(c) : this.receiver.next(c), !l))
          break;
      i == null || i.dataSources.delete(this.config.alias);
    }
    return l && (o ? await o.asyncEnd(r) : this.receiver.end()), !0;
  }
  /** Stops an active `run` call ASAP, causing its promise to reject. */
  interrupt() {
    G(this, Ms, !0), this.receiver instanceof ff && this.receiver.interrupt();
  }
  /** Subroutine of `run` that creates the Dexie query. */
  makeQuery() {
    const t = this.collection.dexieTable;
    let r;
    if (!p(this, Yr))
      r = t.toCollection();
    else if (p(this, un)) {
      const i = t.where(p(this, Yr).name);
      if (p(this, Yr).on.length === 1) {
        if (r = p(this, un)[0].applyTo(i), r === void 0) return;
      } else {
        const o = [], a = [];
        for (const c of p(this, un))
          yr(
            c instanceof ra,
            "compound index can't handle arrays"
          ), o.push(c.minValue ?? Lt.minKey), a.push(c.maxValue ?? Lt.maxKey);
        for (; o.length < p(this, Yr).on.length; )
          o.push(Lt.minKey), a.push(Lt.maxKey);
        const l = p(this, un).at(-1);
        r = i.between(o, a, l.includeMin, l.includeMax);
      }
    } else
      r = t.orderBy(p(this, Yr).name);
    return this.config.reverse && (r = r.reverse()), p(this, Ui) && (r = r.filter((i) => ((i.flags ?? 0) & Sr) === 0)), r;
  }
  explain(t) {
    if (p(this, un)) {
      t.push(`Search index "${p(this, Yr).name}" of collection ${this.collection.name} where (`);
      for (let r of p(this, un))
        t.push(`    ${r}`);
      t[t.length - 1] += " )";
    } else p(this, $o) ? t.push(`Scan index "${p(this, Yr).name}" of collection ${this.collection.name}`) : t.push(`Scan collection ${this.collection.name}`);
    if (t[t.length - 1] += this.config.reverse ? " in reverse order:" : ":", p(this, Ui) && t.push("    - If doc is not deleted,"), this.config.filters)
      for (const r of this.config.filters)
        t.push(`    - If ${Bt(r)},`);
    super.explain(t);
  }
  // I've been interrupted
}
Yr = new WeakMap(), un = new WeakMap(), $o = new WeakMap(), Ui = new WeakMap(), Ms = new WeakMap();
var zn, $i;
class ff extends Si {
  constructor(t, r) {
    super();
    ee(this, zn);
    ee(this, $i, !1);
    this.producer = t, this.joinType = r;
  }
  start() {
    G(this, $i, !1), this.joinType === "OUTER" && G(this, zn, /* @__PURE__ */ new Set()), super.start();
  }
  // LeftJoiner's `next` method has to be async since it runs a nested query.
  // But we don't want to make `Receiver.next()` async because it would be terrible for
  // performance. Instead we have a kludge where LeftJoiner has an `asyncNext` method instead,
  // and RevProducer is special-cased to call that when its receiver is a LeftJoiner.
  next(t) {
    Fo("Joiner.next should not be called");
  }
  async asyncNext(t) {
    let r = 0;
    return this.producer.then({
      start: () => {
        r = 0;
      },
      next: (i) => {
        var o;
        if (++r, p(this, zn)) {
          const a = i.dataSources.get(this.producer.alias);
          (o = p(this, zn)) == null || o.add(a.id);
        }
        return this.receiver.next(i);
      },
      end: () => {
        r === 0 && this.joinType === "LEFT OUTER" && (t.dataSources.set(this.producer.alias, {}), this.receiver.next(t));
      },
      explain: (i) => {
      }
    }), await this.producer.run(t);
  }
  interrupt() {
    G(this, $i, !0), this.producer.interrupt();
  }
  end() {
    Fo("Joiner.end should not be called");
  }
  async asyncEnd(t) {
    if (p(this, zn) && !p(this, $i)) {
      const r = await this.producer.collection.dexieTable.where(Lo).noneOf(Array.of(...p(this, zn).values())).filter((i) => !((i.flags ?? 0) & Sr)).toArray();
      if (r.length > 0) {
        const i = this.producer.alias;
        let o = [];
        for (const [a, l] of t.sourceTypes) {
          if (a === i)
            break;
          o.push(a);
        }
        for (const a of r) {
          if (p(this, $i))
            break;
          const l = new yo(t);
          for (const c of o)
            l.dataSources.set(c, {});
          l.dataSources.set(i, a), this.receiver.next(l);
        }
      }
    }
    this.receiver.end();
  }
  explain(t) {
    t.push(`    - ${this.joinType.toLowerCase()} join with:`);
    let r = [];
    this.producer.explain(r), t.push(...r.map((i) => "        " + i)), super.explain(t);
  }
}
zn = new WeakMap(), $i = new WeakMap();
class OI extends Si {
  constructor(e, t) {
    super(), this.onExpr = e, this.alias = t;
  }
  next(e) {
    let t = e.eval(this.onExpr);
    if (Array.isArray(t)) {
      for (const r of t)
        if (e.dataSources.set(this.alias, r), !this.receiver.next(e))
          return !1;
    }
    return !0;
  }
  explain(e) {
    e.push(`    - Scan unnested array ${Bt(this.onExpr)} as '${this.alias}':`), super.explain(e);
  }
}
var ji;
class RI extends Si {
  constructor(t, r, i) {
    super();
    ee(this, ji);
    this.groupBy = t, this.having = r, this.ctx = i;
  }
  start() {
    G(this, ji, new Wa()), super.start();
  }
  next(t) {
    yr(this.groupBy.length === 1, "unsupported multiple GROUP BY conditions");
    const r = t.eval(this.groupBy[0]);
    return p(this, ji).upsert(r, () => {
      let o = new Uo(this.ctx, !0);
      return o.receiver = this.receiver, o.start(), o;
    }).next(t);
  }
  end() {
    for (const t of p(this, ji).values())
      t.end(this.having);
    G(this, ji, void 0), super.end();
  }
  explain(t) {
    const r = this.groupBy.map(Bt).join(",  ");
    t.push(`Group rows by ${r}, and for each group:`), new Uo(this.ctx, !0).explain(t), this.having && t.push(`Keep groups having ${Bt(this.having)}`), super.explain(t);
  }
}
ji = new WeakMap();
var Gn, Hn;
const fh = class fh extends Si {
  constructor(t, r = !1) {
    super();
    ee(this, Gn);
    ee(this, Hn);
    this.ctx = t, this.isGrouped = r;
  }
  clone() {
    let t = new fh(this.ctx, this.isGrouped);
    return t.receiver = this.receiver, t;
  }
  start() {
    G(this, Hn, void 0), G(this, Gn, this.ctx.copyAggregates()), Ue(p(this, Gn) !== void 0, "no aggregates"), this.isGrouped || super.start();
  }
  next(t) {
    return t.use(() => {
      for (let r of p(this, Gn))
        r.accumulate();
    }), p(this, Hn) === void 0 && G(this, Hn, t.clone()), !0;
  }
  end(t) {
    const r = p(this, Hn) ?? new yo(this.ctx);
    r.aggregates = p(this, Gn), G(this, Hn, void 0), G(this, Gn, void 0), (!t || r.eval(t)) && this.receiver.next(r), this.isGrouped || super.end();
  }
  explain(t) {
    for (const r of this.ctx.copyAggregates())
      t.push(`    - Accumulate state for ${Bt(r.sourceExpression)}`);
    t.push("After aggregating,"), super.explain(t);
  }
};
Gn = new WeakMap(), Hn = new WeakMap();
let Uo = fh;
class E0 extends Si {
  constructor(e, t) {
    super(), this.columnExprs = e, this.columnNames = t;
  }
  next(e) {
    return this.receiver.next(this.makeRow(e));
  }
  makeRow(e) {
    return e.use(() => this.columnExprs.map((t) => t()));
  }
  explain(e) {
    let t = 0;
    e.push("    - Produce row {");
    for (const r of this.columnNames) {
      let i = "        ";
      r.endsWith(".*") || (i += `${r}: `), i += Bt(this.columnExprs[t++]), t < this.columnNames.length && (i += ","), e.push(i);
    }
    e[e.length - 1] += " }", super.explain(e);
  }
}
var Us;
class TI extends E0 {
  constructor(t, r, i) {
    t = Array.of(...t);
    for (const o of i)
      t.push(o.expr);
    super(t, r);
    ee(this, Us);
    this.sortExprs = i;
  }
  start() {
    G(this, Us, []), super.start();
  }
  next(t) {
    return p(this, Us).push(this.makeRow(t)), !0;
  }
  end() {
    const t = this.sortExprs, r = t.length;
    let i = p(this, Us);
    i.sort((o, a) => {
      for (let l = -r; l < 0; ++l) {
        let c = Wt(o.at(l), a.at(l));
        if (c !== 0)
          return t[r + l].descending ? -c : c;
      }
      return 0;
    });
    for (let o of i)
      if (o.length -= t.length, !this.receiver.next(o))
        return;
    super.end();
  }
  explain(t) {
    const r = this.sortExprs.map((i) => {
      let o = Bt(i.expr);
      return i.descending && (o += " descending"), o;
    });
    t.push(`With docs sorted by ${r.join(", ")},`), super.explain(t);
  }
}
Us = new WeakMap();
var $s;
class CI extends Si {
  constructor() {
    super(...arguments);
    ee(this, $s);
  }
  start() {
    G(this, $s, new Wa()), super.start();
  }
  next(t) {
    return p(this, $s).insert(t, null) ? this.receiver.next(t) : !0;
  }
  end() {
    G(this, $s, void 0), super.end();
  }
  explain(t) {
    t.push("Remove identical rows"), super.explain(t);
  }
}
$s = new WeakMap();
var js, Ki;
class NI extends Si {
  constructor(t, r) {
    super();
    ee(this, js, 0);
    ee(this, Ki, 0);
    this.offsetExpr = t, this.limitExpr = r;
  }
  get offset() {
    return this.offsetExpr ? zh(this.offsetExpr(), "query OFFSET") : 0;
  }
  get limit() {
    return this.limitExpr ? zh(this.limitExpr(), "query LIMIT") : 1 / 0;
  }
  start() {
    G(this, js, this.offset), G(this, Ki, this.limit), super.start();
  }
  next(t) {
    return p(this, js) > 0 ? (--Nr(this, js)._, !0) : p(this, Ki) > 0 ? (--Nr(this, Ki)._, this.receiver.next(t) && p(this, Ki) > 0) : !1;
  }
  explain(t) {
    this.offsetExpr && t.push(`Skip first ${Bt(this.offsetExpr)} rows`), this.limitExpr && t.push(`Limit to ${Bt(this.limitExpr)} rows`), super.explain(t);
  }
}
js = new WeakMap(), Ki = new WeakMap();
class PI extends Si {
  constructor(e) {
    super(), this.aliases = e;
  }
  next(e) {
    let t = {}, r = 0;
    for (const i of this.aliases) {
      const o = e[r++];
      o !== void 0 && (i.endsWith(".*") && Ir(o) ? t = { ...t, ...o } : t[i] = o);
    }
    return this.receiver.next(t);
  }
}
class S0 {
  constructor(e) {
    ve(this, "ok", !0);
    this.callback = e;
  }
  start() {
    this.ok = !0;
  }
  next(e) {
    return this.ok = this.ok && this.callback(e);
  }
  end() {
  }
  explain(e) {
  }
}
const DI = 250, BI = 0, FI = 500;
var Wn, Ks, jo, wn, Yn, Vn, Jn, fr;
class LI {
  constructor(e) {
    ee(this, Wn, /* @__PURE__ */ new Set());
    // Query listeners
    ee(this, Ks, []);
    // My collection listeners
    ee(this, jo, 0);
    // Time DB last changed
    ee(this, wn);
    // Timer after coll changes
    ee(this, Yn);
    // Last known query result
    ee(this, Vn, !1);
    // True while executing query
    ee(this, Jn, !1);
    // If true, need to execute again
    ee(this, fr);
    this.query = e, G(this, fr, e.logger);
  }
  get hasListeners() {
    return p(this, Wn).size > 0;
  }
  addChangeListener(e) {
    return this.hasListeners || this.startListening(), p(this, Wn).add(e), new _f(() => {
      var t;
      (t = p(this, Wn)) == null || t.delete(e), this.hasListeners || this.stopListening();
    });
  }
  startListening() {
    p(this, fr).info`Query observer starting`;
    for (const e of this.query.collections()) {
      const t = e.addChangeListener((r) => this.collectionChanged(e));
      p(this, Ks).push(t);
    }
    this.executeQuery();
  }
  stopListening() {
    p(this, fr).info`Query observer stopping`, p(this, Ks).forEach((e) => e.remove()), G(this, Ks, []), p(this, wn) !== void 0 && (clearTimeout(p(this, wn)), G(this, wn, void 0)), p(this, Vn) && this.query.interrupt(), G(this, Yn, void 0), G(this, Jn, !1);
  }
  collectionChanged(e) {
    p(this, fr).info`Query observer notified collection ${e.name} changed`, this.trigger();
  }
  /** Schedules re-running the query to see if it changed. */
  trigger() {
    if (this.hasListeners && !p(this, wn)) {
      const e = Date.now(), t = e - p(this, jo) < DI ? FI : BI;
      G(this, jo, e), G(this, wn, setTimeout(() => {
        G(this, wn, void 0), this.hasListeners && this.executeQuery();
      }, t));
    }
  }
  executeQuery() {
    if (p(this, Vn)) {
      G(this, Jn, !0), p(this, fr).debug`Query observer will re-execute query when done`;
      return;
    }
    G(this, Vn, !0), G(this, Jn, !1), p(this, fr).info`Query observer executing query...`, this.query.execute().then((e) => {
      G(this, Vn, !1), this.hasListeners && (p(this, Yn) === void 0 ? (p(this, fr).debug`...Query observer got initial result`, G(this, Yn, e)) : lo(e, p(this, Yn)) ? p(this, fr).debug`...Query observer saw no change in results` : (G(this, Yn, e), this.callListeners(e)), p(this, Jn) && this.executeQuery());
    }).catch((e) => {
      G(this, Vn, !1), e instanceof Ya ? p(this, fr).debug`...Query observer: query interrupted` : p(this, fr).error`Query observer: query failed with error ${e}`, p(this, Jn) && this.hasListeners && this.executeQuery();
    });
  }
  callListeners(e) {
    p(this, fr).info`Query observer notifying ${p(this, Wn).size} listeners!`;
    for (const t of p(this, Wn))
      try {
        t(e);
      } catch (r) {
        p(this, fr).error(`Exception in QueryChangeCallback: ${r}`);
      }
  }
}
Wn = new WeakMap(), Ks = new WeakMap(), jo = new WeakMap(), wn = new WeakMap(), Yn = new WeakMap(), Vn = new WeakMap(), Jn = new WeakMap(), fr = new WeakMap();
const Sv = [
  "trace",
  "debug",
  "info",
  "warning",
  "error",
  "fatal"
];
function Av(n, e) {
  const t = Sv.indexOf(n);
  if (t < 0) throw new TypeError(`Invalid log level: ${JSON.stringify(n)}.`);
  const r = Sv.indexOf(e);
  if (r < 0) throw new TypeError(`Invalid log level: ${JSON.stringify(e)}.`);
  return t - r;
}
function A0(n = []) {
  return k0.getLogger(n);
}
const Lc = Symbol.for("logtape.rootLogger");
var k0 = class $n {
  constructor(e, t) {
    ve(this, "parent");
    ve(this, "children");
    ve(this, "category");
    ve(this, "sinks");
    ve(this, "parentSinks", "inherit");
    ve(this, "filters");
    ve(this, "lowestLevel", "trace");
    ve(this, "contextLocalStorage");
    this.parent = e, this.children = {}, this.category = t, this.sinks = [], this.filters = [];
  }
  static getLogger(e = []) {
    let t = Lc in globalThis ? globalThis[Lc] ?? null : null;
    return t == null && (t = new $n(null, []), globalThis[Lc] = t), typeof e == "string" ? t.getChild(e) : e.length === 0 ? t : t.getChild(e);
  }
  getChild(e) {
    const t = typeof e == "string" ? e : e[0], r = this.children[t];
    let i = r instanceof $n ? r : r == null ? void 0 : r.deref();
    return i == null && (i = new $n(this, [...this.category, t]), this.children[t] = "WeakRef" in globalThis ? new WeakRef(i) : i), typeof e == "string" || e.length === 1 ? i : i.getChild(e.slice(1));
  }
  /**
  * Reset the logger.  This removes all sinks and filters from the logger.
  */
  reset() {
    for (; this.sinks.length > 0; ) this.sinks.shift();
    for (this.parentSinks = "inherit"; this.filters.length > 0; ) this.filters.shift();
    this.lowestLevel = "trace";
  }
  /**
  * Reset the logger and all its descendants.  This removes all sinks and
  * filters from the logger and all its descendants.
  */
  resetDescendants() {
    for (const e of Object.values(this.children)) {
      const t = e instanceof $n ? e : e.deref();
      t != null && t.resetDescendants();
    }
    this.reset();
  }
  with(e) {
    return new qI(this, { ...e });
  }
  filter(e) {
    var t;
    for (const r of this.filters) if (!r(e)) return !1;
    return this.filters.length < 1 ? ((t = this.parent) == null ? void 0 : t.filter(e)) ?? !0 : !0;
  }
  *getSinks(e) {
    if (!(this.lowestLevel === null || Av(e, this.lowestLevel) < 0)) {
      if (this.parent != null && this.parentSinks === "inherit") for (const t of this.parent.getSinks(e)) yield t;
      for (const t of this.sinks) yield t;
    }
  }
  emit(e, t) {
    if (!(this.lowestLevel === null || Av(e.level, this.lowestLevel) < 0 || !this.filter(e))) {
      for (const r of this.getSinks(e.level))
        if (!(t != null && t.has(r)))
          try {
            r(e);
          } catch (i) {
            const o = new Set(t);
            o.add(r), MI.log("fatal", "Failed to emit a log record to sink {sink}: {error}", {
              sink: r,
              error: i,
              record: e
            }, o);
          }
    }
  }
  log(e, t, r, i) {
    var c;
    const o = ((c = $n.getLogger().contextLocalStorage) == null ? void 0 : c.getStore()) ?? {};
    let a;
    const l = typeof r == "function" ? {
      category: this.category,
      level: e,
      timestamp: Date.now(),
      get message() {
        return kv(t, this.properties);
      },
      rawMessage: t,
      get properties() {
        return a == null && (a = {
          ...o,
          ...r()
        }), a;
      }
    } : {
      category: this.category,
      level: e,
      timestamp: Date.now(),
      message: kv(t, {
        ...o,
        ...r
      }),
      rawMessage: t,
      properties: {
        ...o,
        ...r
      }
    };
    this.emit(l, i);
  }
  logLazily(e, t, r = {}) {
    var c;
    const i = ((c = $n.getLogger().contextLocalStorage) == null ? void 0 : c.getStore()) ?? {};
    let o, a;
    function l() {
      if ((a == null || o == null) && (a = t((b, ...m) => (o = b, Ov(b, m))), o == null))
        throw new TypeError("No log record was made.");
      return [a, o];
    }
    this.emit({
      category: this.category,
      level: e,
      get message() {
        return l()[0];
      },
      get rawMessage() {
        return l()[1];
      },
      timestamp: Date.now(),
      properties: {
        ...i,
        ...r
      }
    });
  }
  logTemplate(e, t, r, i = {}) {
    var a;
    const o = ((a = $n.getLogger().contextLocalStorage) == null ? void 0 : a.getStore()) ?? {};
    this.emit({
      category: this.category,
      level: e,
      message: Ov(t, r),
      rawMessage: t,
      timestamp: Date.now(),
      properties: {
        ...o,
        ...i
      }
    });
  }
  trace(e, ...t) {
    typeof e == "string" ? this.log("trace", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("trace", e) : Array.isArray(e) ? this.logTemplate("trace", e, t) : this.log("trace", "{*}", e);
  }
  debug(e, ...t) {
    typeof e == "string" ? this.log("debug", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("debug", e) : Array.isArray(e) ? this.logTemplate("debug", e, t) : this.log("debug", "{*}", e);
  }
  info(e, ...t) {
    typeof e == "string" ? this.log("info", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("info", e) : Array.isArray(e) ? this.logTemplate("info", e, t) : this.log("info", "{*}", e);
  }
  warn(e, ...t) {
    typeof e == "string" ? this.log("warning", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("warning", e) : Array.isArray(e) ? this.logTemplate("warning", e, t) : this.log("warning", "{*}", e);
  }
  warning(e, ...t) {
    this.warn(e, ...t);
  }
  error(e, ...t) {
    typeof e == "string" ? this.log("error", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("error", e) : Array.isArray(e) ? this.logTemplate("error", e, t) : this.log("error", "{*}", e);
  }
  fatal(e, ...t) {
    typeof e == "string" ? this.log("fatal", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("fatal", e) : Array.isArray(e) ? this.logTemplate("fatal", e, t) : this.log("fatal", "{*}", e);
  }
}, qI = class O0 {
  constructor(e, t) {
    ve(this, "logger");
    ve(this, "properties");
    this.logger = e, this.properties = t;
  }
  get category() {
    return this.logger.category;
  }
  get parent() {
    return this.logger.parent;
  }
  getChild(e) {
    return this.logger.getChild(e).with(this.properties);
  }
  with(e) {
    return new O0(this.logger, {
      ...this.properties,
      ...e
    });
  }
  log(e, t, r, i) {
    this.logger.log(e, t, typeof r == "function" ? () => ({
      ...this.properties,
      ...r()
    }) : {
      ...this.properties,
      ...r
    }, i);
  }
  logLazily(e, t) {
    this.logger.logLazily(e, t, this.properties);
  }
  logTemplate(e, t, r) {
    this.logger.logTemplate(e, t, r, this.properties);
  }
  trace(e, ...t) {
    typeof e == "string" ? this.log("trace", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("trace", e) : Array.isArray(e) ? this.logTemplate("trace", e, t) : this.log("trace", "{*}", e);
  }
  debug(e, ...t) {
    typeof e == "string" ? this.log("debug", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("debug", e) : Array.isArray(e) ? this.logTemplate("debug", e, t) : this.log("debug", "{*}", e);
  }
  info(e, ...t) {
    typeof e == "string" ? this.log("info", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("info", e) : Array.isArray(e) ? this.logTemplate("info", e, t) : this.log("info", "{*}", e);
  }
  warn(e, ...t) {
    typeof e == "string" ? this.log("warning", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("warning", e) : Array.isArray(e) ? this.logTemplate("warning", e, t) : this.log("warning", "{*}", e);
  }
  warning(e, ...t) {
    this.warn(e, ...t);
  }
  error(e, ...t) {
    typeof e == "string" ? this.log("error", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("error", e) : Array.isArray(e) ? this.logTemplate("error", e, t) : this.log("error", "{*}", e);
  }
  fatal(e, ...t) {
    typeof e == "string" ? this.log("fatal", e, t[0] ?? {}) : typeof e == "function" ? this.logLazily("fatal", e) : Array.isArray(e) ? this.logTemplate("fatal", e, t) : this.log("fatal", "{*}", e);
  }
};
const MI = k0.getLogger(["logtape", "meta"]);
function kv(n, e) {
  const t = n.length;
  if (t === 0) return [""];
  if (!n.includes("{")) return [n];
  const r = [];
  let i = 0;
  for (let a = 0; a < t; a++) {
    const l = n[a];
    if (l === "{") {
      if ((a + 1 < t ? n[a + 1] : "") === "{") {
        a++;
        continue;
      }
      const b = n.indexOf("}", a + 1);
      if (b === -1) continue;
      const m = n.slice(i, a);
      r.push(m.replace(/{{/g, "{").replace(/}}/g, "}"));
      const w = n.slice(a + 1, b);
      let x;
      const k = w.trim();
      k === "*" ? x = w in e ? e[w] : "*" in e ? e["*"] : e : w !== k ? x = w in e ? e[w] : e[k] : x = e[w], r.push(x), a = b, i = a + 1;
    } else l === "}" && a + 1 < t && n[a + 1] === "}" && a++;
  }
  const o = n.slice(i);
  return r.push(o.replace(/{{/g, "{").replace(/}}/g, "}")), r;
}
function Ov(n, e) {
  const t = [];
  for (let r = 0; r < n.length; r++)
    t.push(n[r]), r < e.length && t.push(e[r]);
  return t;
}
const R0 = "CouchbaseLite", oh = A0([R0]), hf = oh.getChild("DB"), UI = oh.getChild("Query");
var At, hr, zi, Gi, Hi, Ko, Wi, zs, Zn;
class $I {
  /** @internal */
  constructor(e, t) {
    /** The JSON form of the parsed query. @internal */
    ve(this, "selectExpr");
    /** The names of the result columns, i.e. the keys in a row object. */
    ve(this, "columnNames");
    /** @internal */
    ve(this, "logger");
    ee(this, At, new Ga());
    // State for CompiledExprs to read
    ee(this, hr, /* @__PURE__ */ new Map());
    // Maps alias -> source/result info
    ee(this, zi);
    // Head of pipeline
    ee(this, Gi);
    // Tail of pipeline
    ee(this, Hi, {});
    ee(this, Ko);
    ee(this, Wi, !1);
    // Prevents reentrant `run` calls
    ee(this, zs, !1);
    ee(this, Zn);
    this.database = e, this.logger = UI.with({ db: e.name });
    let r;
    typeof t == "string" ? (r = pI(t), this.selectExpr = r) : (this.selectExpr = t, r = t, g1(r));
    let i;
    for (let C of r.FROM) {
      let M, J;
      if ("COLLECTION" in C) {
        let ce = C.COLLECTION;
        ce === "_" && (ce = Ca), C.SCOPE && (ce = C.SCOPE + "." + ce), J = this.database.getCollection(ce), "JOIN" in C ? (Ue(i !== void 0, "first FROM source can't be a JOIN"), M = "join") : (yr(i === void 0, "subsequent FROM sources must be JOINs"), M = "collection");
      } else
        M = "unnest";
      let X;
      if (C.AS !== void 0)
        X = C.AS;
      else if ("COLLECTION" in C)
        X = C.COLLECTION;
      else
        throw new Lr("UNNEST clause must have an AS");
      if (p(this, hr).has(X))
        throw new Lr(`Duplicate sources named "${X}"`);
      const le = { collection: J, source: C, type: M, alias: X };
      i || (i = le), p(this, hr).set(X, le), p(this, At).sourceTypes.set(X, M);
    }
    let o = [], a = [];
    for (let C of r.WHAT) {
      let M;
      if (Array.isArray(C) && C[0] === "AS") {
        if (M = C[2], C = C[1], p(this, hr).has(M))
          throw new Lr(`Duplicate column alias "${M}"`);
        p(this, hr).set(M, {
          type: "result",
          alias: M,
          what: C
        });
      }
      o.push(M), a.push(C);
    }
    y1(
      r,
      p(this, hr),
      r.FROM.length === 1 ? i == null ? void 0 : i.alias : void 0
    );
    const l = a.map((C) => p(this, At).compileWithAggregates(C));
    let c = [], b = 0;
    for (let C = 0; C < r.WHAT.length; ++C) {
      let M = o[C];
      if (M === void 0)
        for (M = this.defaultResultName(r.WHAT[C]); M === void 0 || c.includes(M); )
          M = `$${++b}`;
      else
        p(this, At).results.set(M, l[C]);
      c.push(M);
    }
    this.columnNames = c, this.findResultSources();
    const m = new Set(r.WHERE ? Vd(r.WHERE) : []);
    let w;
    r.ORDER_BY !== void 0 && (w = r.ORDER_BY.map((C) => KI(p(this, At), C)));
    let x = /* @__PURE__ */ new Set(), k, D;
    e: for (const [C, M] of p(this, hr)) {
      switch (M.type) {
        case "collection": {
          k = this.makeRevProducer(
            M,
            m,
            w,
            x
          ), D = k;
          break;
        }
        case "join": {
          for (const le of Vd(M.source.ON))
            m.add(le);
          const J = M.source.JOIN, X = this.makeRevProducer(M, m, w, x);
          D = D.then(new ff(X, J));
          break;
        }
        case "unnest": {
          const J = p(this, At).compile(M.source.UNNEST);
          D = D.then(new OI(J, C));
          break;
        }
        case "result":
          continue e;
      }
      x.add(M);
    }
    if (k ? Nn(D) : (k = new w0(), D = k), G(this, zi, k), r.GROUP_BY !== void 0) {
      const C = r.GROUP_BY.map((J) => p(this, At).compile(J)), M = r.HAVING !== void 0 ? p(this, At).compileWithAggregates(r.HAVING) : void 0;
      D = D.then(new RI(C, M, p(this, At)));
    } else
      p(this, At).hasAggregators && (D = D.then(new Uo(p(this, At))));
    let K;
    if (w != null && w.length ? K = D.then(new TI(l, c, w)) : K = D.then(new E0(l, c)), r.DISTINCT && (K = K.then(new CI())), r.OFFSET !== void 0 || r.LIMIT !== void 0) {
      const C = (M, J) => {
        if (M !== void 0)
          return yr(Ac(M).size === 0, `invalid ${J} expression`), p(this, At).compile(M);
      };
      K = K.then(new NI(
        C(r.OFFSET, "OFFSET"),
        C(r.LIMIT, "LIMIT")
      ));
    }
    G(this, Gi, K.then(new PI(c)).then(new S0())), G(this, Ko, new Proxy(p(this, Hi), {
      set: (C, M, J) => (this.checkParameterName(M), C[M] = J, p(this, Zn) && !lo(J, p(this, Hi)[M]) && p(this, Zn).trigger(), !0)
    }));
  }
  /** A map from query parameter names to their values.
   *
   *  You must set the values of all parameters before running the query.
   *
   *  Changing any parameter value will cause query change listeners to re-evaluate the query,
   *  triggering the callback if the results change.
   *
   *  >Note: Omit the "$" in the keys: if the N1QL query uses `$date`, the key is `"date"`. */
  get parameters() {
    return p(this, Ko);
  }
  set parameters(e) {
    const t = p(this, At).parameterNames.size, r = Object.entries(e);
    yr(r.length >= t, `All ${t} parameters must be set`);
    for (const [i, o] of r)
      this.checkParameterName(i), p(this, Hi)[i] = o;
  }
  /** The names of all query parameters. */
  get parameterNames() {
    return p(this, At).parameterNames;
  }
  /** A string that describes in human-readable form the steps the query will perform
   *  when it runs. (Format subject to change without notice.) */
  get explanation() {
    let e = [];
    return p(this, zi).explain(e), e.join(`
`);
  }
  async execute(e) {
    if (e)
      return this.run(e);
    {
      let t = new Array();
      if (await this.run((r) => t.push(r)))
        return t;
      throw new Ya();
    }
  }
  /** Stops an active {@link execute} call ASAP. Does nothing if the query is not running. */
  interrupt() {
    p(this, Wi) && (G(this, zs, !0), p(this, zi).interrupt());
  }
  /** Registers a function that will be called when the query's results change, as a result of
   *  changes to documents or to a parameter value.
   *  @param callback  The function to call. Its parameter is the new query result array.
   *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
   *            remove the listener. */
  addChangeListener(e) {
    return p(this, Zn) || G(this, Zn, new LI(this)), p(this, Zn).addChangeListener(e);
  }
  /** Registers a custom N1QL function.
   *
   *  Registration is global: it will be available in all queries on all Databases.
   *  @param name  Function's name. Case-insensitive.
   *  @param implementation  The function itself. See the type {@link UserFunction} for details.
   *  @param options  Other options such as min/max arg counts. */
  registerUserFunction(e, t, r) {
    yI(e, t, r);
  }
  /** All Collections used by this query. @internal */
  collections() {
    let e = /* @__PURE__ */ new Set();
    for (const t of p(this, hr).values())
      t.type !== "result" && t.collection && e.add(t.collection);
    return e;
  }
  //---- INTERNALS:
  checkParameterName(e) {
    yr(typeof e == "string", "Query parameter name must be a string"), yr(!e.startsWith("$"), "Don't use '$' prefix in query parameter names"), yr(p(this, At).parameterNames.has(e), `"${e}" is not a parameter of this query`);
  }
  async run(e) {
    yr(!p(this, Wi), "query is already running"), p(this, At).parameters.clear();
    for (const t of p(this, At).parameterNames) {
      const r = p(this, Hi)[t];
      if (r === void 0)
        throw Error(`The query parameter "${t}" must have a value`);
      p(this, At).parameters.set(t, r);
    }
    G(this, Wi, !0), G(this, zs, !1);
    try {
      return p(this, Gi).callback = (t) => (e(t), !p(this, zs)), await p(this, zi).run(p(this, At)), p(this, Gi).callback = void 0, p(this, Gi).ok;
    } catch (t) {
      if (t instanceof Ya)
        return !1;
      throw t;
    } finally {
      G(this, Wi, !1);
    }
  }
  /** Creates a pipeline `RevProducer` for the main FROM source or a JOIN.
   *  @param source  The source.
   *  @param whereExprs  The remaining unused expressions from the WHERE clause.
   *                     Expressions used by this RevProducer will be **removed** from the array.
   *  @param sortExprs  The remaining unused sorts from the ORDER BY clause.
   *                    Items used by this RevProducer will be **removed** from the array.
   *  @param allowedSources  Prior sources that will already have values at runtime, and so
   *                         can be used by this RevProducer. */
  makeRevProducer(e, t, r, i) {
    const o = [];
    for (const m of t) {
      const w = this.asWhereClause(m, e, i);
      w && o.push(w);
    }
    o.sort((m, w) => m.generality - w.generality);
    let a;
    if (r != null && r.length) {
      const [m, w] = this.expToKeyPath(r[0].expr.sourceExpression);
      w != null && w.indexed && m === e && (a = w);
    }
    let l = !1, c = { collection: e.collection, alias: e.alias }, b;
    for (const m of e.collection.getIndexes()) {
      let w = [];
      if (m.type === jn)
        for (const x of m.on) {
          const k = o.find((D) => D.key === x && D instanceof ra);
          if (k === void 0 || (w.push(k), k.generality > 1))
            break;
        }
      else {
        Ue(m.on.length === 1);
        const x = m.on[0], k = o.find((D) => D.key === x && D instanceof Dc);
        k && w.push(k);
      }
      w.length > 0 && (b === void 0 || w.length > b.length || w.at(-1).generality < b.at(-1).generality) && (b = w, c.index = m);
    }
    if (b) {
      c.indexedWhereOrSort = b;
      for (const m of b)
        t.delete(m.sourceExpression);
      b[0].key === a && (l = !0);
    } else a && (c.index = e.collection.indexOfProperty(a), c.indexedWhereOrSort = [a], l = !0);
    l && (c.reverse = r[0].descending ?? !1, r == null || r.splice(0, 1)), i.add(e);
    for (const m of Array.of(...t))
      this.exprUsesAllowedSources(m, i) && (c.filters || (c.filters = []), c.filters.push(p(this, At).compile(m)), t.delete(m));
    return i.delete(e), new x0(c);
  }
  // Subroutine of processWhereClause().
  // Attempts to translate `expr` into a `WhereClause` on a property of `source`.
  // - The opcode must be a supported binary relation, or BETWEEN.
  // - One operand must be a property of `source`.
  // - Other operands must not use any sources except those in `allowedSources`.
  // If this isn't possible, it returns `undefined`.
  asWhereClause(e, t, r) {
    if (e.length < 3)
      return;
    let [i, o, a] = e;
    if (i === "ANY")
      return this.anyAsWhereClause(e, t, r);
    if (e.length > 3 && i !== "BETWEEN")
      return;
    let [l, c] = this.expToKeyPath(o);
    if (l !== t || c === void 0) {
      if ([o, a] = [a, o], [l, c] = this.expToKeyPath(o), l !== t || c === void 0)
        return;
      switch (i) {
        case "<":
          i = ">";
          break;
        case "<=":
          i = ">=";
          break;
        case ">":
          i = "<";
          break;
        case ">=":
          i = "<=";
          break;
        case "LIKE":
        case "BETWEEN":
          return;
      }
    }
    if (!this.exprUsesAllowedSources(a, r))
      return;
    const b = p(this, At), m = b.compile(a);
    switch (i) {
      case "<":
      case "<=":
        return new Pc(e, c, void 0, m, !0, i === "<=");
      case ">":
      case ">=":
        return new Pc(e, c, m, void 0, i === ">=", !0);
      case "=":
      case "IS":
        return new wv(e, c, m);
      case "LIKE": {
        const w = jI(b, m);
        if (typeof w == "string") {
          const [x, k] = Gf(w);
          switch (x) {
            case 0:
              return new wv(e, c, b.compile(k));
            case 1:
              return new EI(e, c, k);
          }
        }
        break;
      }
      case "BETWEEN": {
        if (this.exprUsesAllowedSources(e[3], r))
          return new Pc(e, c, m, b.compile(e[3]));
        break;
      }
      case "IN":
        return new Dc(e, c, m);
    }
  }
  // Subroutine of asWhereClause() that handles 'ANY' expressions.
  anyAsWhereClause(e, t, r) {
    const [i, o, a, l] = e;
    let [c, b] = this.expToKeyPath(a);
    if (!(c !== t || b === void 0) && Tc(l, "=")) {
      let m;
      if (Tc(l[1], "?", o) ? m = l[2] : Tc(l[2], "?", o) && (m = l[1]), m && this.exprUsesAllowedSources(m, r))
        return new Dc(e, b, p(this, At).compile(m));
    }
  }
  // True if `expr` uses only the data sources given in `allowedSources`.
  exprUsesAllowedSources(e, t) {
    for (const r of Ac(e)) {
      const i = p(this, hr).get(r);
      if (Nn(i), i.type === "result") {
        if (i.sources) {
          for (const o of i.sources)
            if (!t.has(o))
              return !1;
        }
      } else
        return t.has(i);
    }
    return !0;
  }
  // Converts an Expr to a property of a source, if its operation is '.' or 'META()'.
  expToKeyPath(e) {
    if (Array.isArray(e) && (e[0] === "." || e[0] === "META()")) {
      const t = p(this, hr).get(dy(e[1]));
      if ((t == null ? void 0 : t.type) === "collection" || (t == null ? void 0 : t.type) === "join") {
        let r;
        if (e[0] === ".") {
          for (let i = 2; i < e.length; ++i)
            if (typeof e[i] != "string")
              return [void 0, void 0];
          r = e.slice(2).join(".");
        } else
          switch (e[2]) {
            case "id":
              r = Fa;
              break;
            case "sequence":
              r = La;
              break;
            case "expires":
              r = qa;
              break;
          }
        if (r)
          return [t, t.collection.property(r)];
      }
    }
    return [void 0, void 0];
  }
  // Tries to come up with a name for a result column that doesn't have an explicit alias.
  defaultResultName(e) {
    if (!Array.isArray(e))
      return;
    const t = e[0];
    if (t === "." || t === "META()") {
      const r = e[1];
      if (p(this, hr).has(r)) {
        if (t === "." && e.length === 2 && !e.aliasAdded)
          return r + ".*";
        {
          const i = e.at(-1);
          if (typeof i == "string")
            return i;
        }
      }
    }
  }
  /** Finds which sources each result is dependent on. */
  findResultSources() {
    for (const [e, t] of p(this, hr))
      t.type === "result" && this.getResultSources(t);
  }
  getResultSources(e) {
    if (e.sources === void 0) {
      yr(!e._findingSources, `Result "${e.alias} has a circular dependency`), e._findingSources = !0;
      let t = /* @__PURE__ */ new Set();
      for (const r of Ac(e.what)) {
        const i = p(this, hr).get(r);
        if (Nn(i), i.type !== "result")
          t.add(i);
        else
          for (const o of this.getResultSources(i))
            t.add(o);
      }
      e.sources = t, delete e._findingSources;
    }
    return e.sources;
  }
}
At = new WeakMap(), hr = new WeakMap(), zi = new WeakMap(), Gi = new WeakMap(), Hi = new WeakMap(), Ko = new WeakMap(), Wi = new WeakMap(), zs = new WeakMap(), Zn = new WeakMap();
function jI(n, e) {
  try {
    return typeof e == "function" ? e() : n.compile(e)();
  } catch (t) {
    if (t instanceof nh || t instanceof v0)
      return;
    throw t;
  }
}
function KI(n, e) {
  let t;
  return Array.isArray(e) && (e[0] === "DESC" ? (t = !0, e = e[1]) : e[0] === "ASC" && (e = e[1])), { expr: n.compile(e), descending: t };
}
function T0(n) {
  return typeof n == "object" && !Array.isArray(n) && n !== null;
}
const Rv = "PBKDF2", zI = 5e6, GI = "Couchbase Lite for JavaScript", qc = "AES-GCM", HI = 256, Ss = Symbol();
class fu extends Error {
}
var eg, Yi;
eg = Ss;
const Qa = class Qa {
  constructor() {
    ve(this, eg);
    ee(this, Yi);
  }
  /** Creates a new, unlocked CryptoCodec whose key is derived from the given password. */
  static async create(e) {
    const t = new Qa();
    return await t.generateKey(e), G(t, Yi, await t.encryptJSON(crypto.randomUUID())), t;
  }
  /** Creates a CryptoCodec for use with existing encrypted data. It starts locked.
   *  @param challenge  Any existing encrypted data, usually the prior codec's `challenge`. */
  static withChallenge(e) {
    const t = new Qa();
    return G(t, Yi, e), t;
  }
  /** A small encrypted value which can be saved and then later used to reconstitute the
   *  codec by calling `CryptoCodec.withChallenge()`. */
  get challenge() {
    return p(this, Yi);
  }
  /** True if the password has been given and the codec is ready to encrypt or decrypt. */
  get isUnlocked() {
    return this[Ss] !== void 0;
  }
  /** Creates the encryption key, derived from the given password.
   *  If constructed with a challenge, will try to decrypt it with the key; if that fails,
   *  the codec ignores the key and returns false.
   *  If the codec wasn't constructed with a challenge, it creates one now by encrypting some
   *  random data with the key. */
  async unlock(e) {
    await this.generateKey(e);
    try {
      await this.decryptJSON(p(this, Yi));
    } catch {
      return this[Ss] = void 0, !1;
    }
    return !0;
  }
  /** Discards the encryption key. `unlock` must be called to use the codec again. */
  lock() {
    this[Ss] = void 0;
  }
  /** Encrypts binary data.
   *  @throws EncryptionError  if locked. */
  async encrypt(e) {
    const t = this.requiredKey("encrypt"), r = crypto.getRandomValues(new Uint8Array(12)), i = await crypto.subtle.encrypt({ name: qc, iv: r }, t, e);
    return { data: new Uint8Array(i), iv: r };
  }
  /** Decrypts binary data.
   *  @throws EncryptionError  if locked. */
  async decrypt(e) {
    const t = this.requiredKey("decrypt"), r = { name: qc, iv: e.iv };
    return await crypto.subtle.decrypt(r, t, e.data);
  }
  /** Encrypts a JSON value.
   *  @throws EncryptionError  if locked. */
  async encryptJSON(e) {
    return await this.encrypt(new TextEncoder().encode(JSON.stringify(e)));
  }
  /** Decrypts a JSON value.
   *  @throws EncryptionError  if locked. */
  async decryptJSON(e) {
    const t = await this.decrypt(e);
    return JSON.parse(new TextDecoder().decode(t));
  }
  /** Encrypts the object `body`, except for any properties in `unencryptedProperties`.
   *  @throws EncryptionError  if locked. */
  async partlyEncrypt(e, t) {
    let r = {}, i = {}, o = !1;
    for (const l of Object.keys(e))
      t != null && t.has(l) ? i[l] = e[l] : (r[l] = e[l], o = !0);
    return { encrypted: o ? await this.encryptJSON(r) : void 0, body: i };
  }
  /** Decrypts any encrypted properties in `rev` and merges them into its `body`.
   *  @throws EncryptionError  if locked. */
  async decryptRevision(e) {
    if (!e.encrypted)
      return;
    const t = await this.decryptJSON(e.encrypted);
    Ue(T0(t)), e.body = { ...e.body, ...t }, e.encrypted = void 0;
  }
  async generateKey(e) {
    const t = new TextEncoder(), r = await crypto.subtle.importKey(
      "raw",
      t.encode(e),
      Rv,
      !1,
      ["deriveBits", "deriveKey"]
    );
    this[Ss] = await crypto.subtle.deriveKey(
      {
        name: Rv,
        hash: "SHA-256",
        iterations: zI,
        salt: t.encode(GI)
      },
      r,
      { name: qc, length: HI },
      !1,
      // key is not extractable
      ["encrypt", "decrypt"]
      // key is not wrappable
    );
  }
  requiredKey(e) {
    const t = this[Ss];
    if (!t)
      throw new fu(`Cannot ${e} without key`);
    return t;
  }
};
Yi = new WeakMap();
let Va = Qa;
var Vr, ln;
class WI {
  constructor(e, t, r) {
    ee(this, Vr);
    ee(this, ln);
    this.database = e, G(this, Vr, t), G(this, ln, r);
  }
  /** Returns the number of unique blobs stored in the database. */
  async countBlobs() {
    return p(this, Vr).count();
  }
  /** Retrieves a blob stored in the Database by [saveBlob], else returns `undefined`.
   *  @throws EncryptionError if the blob exists but can't be decrypted. */
  async getBlobIfExists(e) {
    const t = await p(this, Vr).get(e);
    if (t)
      if (t.iv) {
        if (!p(this, ln))
          throw new fu("Blob is encrypted");
        return new Uint8Array(await p(this, ln).decrypt({ data: t.contents, iv: t.iv }));
      } else
        return new Uint8Array(t.contents);
  }
  /** Retrieves a blob stored in the Database by [saveBlob], else throws. @internal
   *  @throws Error if the blob doesn't exist.
   *  @throws EncryptionError if the blob can't be decrypted. */
  async getBlob(e) {
    const t = await this.getBlobIfExists(e);
    if (t === void 0)
      throw Error(`Database is missing blob with digest ${e}`);
    return t;
  }
  /** Returns true if a blob with the given digest exists. */
  async hasBlob(e) {
    return await p(this, Vr).get(e) !== void 0;
  }
  async allDigests() {
    return await p(this, Vr).toCollection().primaryKeys();
  }
  /** Stores a blob in the Database.
   *  @warning  Caller is responsible for verifing that the digest is corrrect!
   *  @throws EncryptionError if the blob can't be encrypted because the codec is locked. */
  async saveBlob(e, t) {
    let r;
    if (p(this, ln)) {
      const i = await yi.waitFor(p(this, ln).encrypt(e));
      r = { digest: t, contents: i.data, iv: i.iv };
    } else
      r = { digest: t, contents: e };
    await this.database.tryAdd(p(this, Vr), r) === void 0 && this.database.logger.info`Saved blob ${t} (${e.length} bytes)`;
  }
  /** The "sweep" phase of blob GC: Deletes all blobs except those with the given digests.
   *  @returns  The number of blobs deleted. */
  async deleteBlobsExcept(e) {
    const t = await p(this, Vr).where("digest").noneOf(Array.from(e)).delete();
    return this.database.logger.info`Garbage-collected ${t} blobs, keeping ${e.size}`, t;
  }
  async rekey(e) {
    const t = await this.allDigests();
    if (t.length > 0) {
      this.database.logger.info`Encrypting ${t.length} blobs...`;
      for (const r of t) {
        const i = await this.getBlob(r);
        let o;
        if (e) {
          const a = await yi.waitFor(e.encrypt(i));
          o = { digest: r, contents: a.data, iv: a.iv };
        } else
          o = { digest: r, contents: i };
        await p(this, Vr).put(o);
      }
    }
    G(this, ln, e);
  }
  resetEncryption(e) {
    G(this, ln, e);
  }
}
Vr = new WeakMap(), ln = new WeakMap();
const pf = "r", on = "rw";
let Un;
var Gs, zo, pr, Qn, Br, Hs, Ht;
const hh = class hh {
  constructor(e) {
    /** The database's name. */
    ve(this, "name");
    /* {@link https://logtape.org LogTape} logger instance for this Database. */
    ve(this, "logger");
    ee(this, Gs, /* @__PURE__ */ new Set());
    //-------- TRANSACTIONS:
    ee(this, zo, 0);
    /** Used as a callback in Blob objects. @internal */
    ve(this, "blobLoader", async (e, t) => await this.blobStore.getBlob(e));
    /** @internal  Exposed for testing */
    ve(this, "enableAutoExpiry", !0);
    ee(this, pr);
    ee(this, Qn, /* @__PURE__ */ new Map());
    ee(this, Br, {});
    ee(this, Hs);
    ee(this, Ht);
    this.config = e, this.name = e.name, this.logger = hf.with({ db: this.name });
    const t = e.collections, r = {
      [No]: "",
      [Zc]: "",
      [Hl]: "digest"
    };
    for (const [i, o] of Object.entries(t))
      Ts.validateName(i), r[i] = Ts.dexieIndexSpec(o);
    Object.keys(t).length === 0 && (r[Ca] = Ts.dexieIndexSpec({})), G(this, Qn, new Map(Object.entries(t))), p(this, Qn).size === 0 && p(this, Qn).set(Ca, {}), G(this, pr, new Lt(e.name, Un)), this.installDBCore(), p(this, pr).version(e.version).stores(r), this.logger.info("Created Database {db}");
  }
  /** Call this to use a non-default implementation of IndexedDB.
   *  This is required in non-browser environments like Node, Bun and Deno!
   *  It should be called only once, **before creating any Database objects**.
   *  Example:
   *  ```
   *      import { indexedDB, IDBKeyRange } from "fake-indexeddb";
   *      Database.useIndexedDB(indexedDB, IDBKeyRange);
   *  ```
   */
  static useIndexedDB(e, t) {
    Un = { indexedDB: e, IDBKeyRange: t };
  }
  /** Enable's Dexie's debug mode, which provides meaningful stack backtraces in exceptions. */
  static debugMode(e) {
    Lt.debug = e;
  }
  /** Creates a Database instance and opens the database. If a local IndexedDB database with
   *  this name exists, it will be opened; otherwise a new one is created.
   *  @param config  The database {@link DatabaseConfig configuration}
   *  @template Schema  An optional interface type that improves type-safety of collection and
   *      document accessors. Its keys must be the names of the collections, and each value type
   *      is an interface that describes the properties of a document in that collection. */
  static async open(e) {
    const t = e.password;
    return e.password = void 0, await new hh(e).initialize(t);
  }
  /** @internal */
  static get idbFactory() {
    return (Un == null ? void 0 : Un.indexedDB) ?? indexedDB;
  }
  /** @internal */
  static get idbKeyRange() {
    return (Un == null ? void 0 : Un.IDBKeyRange) ?? IDBKeyRange;
  }
  async initialize(e) {
    try {
      const t = await this.getMeta();
      if (t.challenge && (G(this, Ht, Va.withChallenge(t.challenge)), e === void 0 || !await p(this, Ht).unlock(e)))
        throw new fu("Incorrect or missing database password");
      const r = this;
      let i = {};
      for (const [o, a] of p(this, Qn)) {
        const l = new Ts(r, o, a, p(this, pr), p(this, Ht));
        await l.open(), i[o] = l;
      }
      return Object.freeze(i), G(this, Br, i), this;
    } catch (t) {
      throw this.close(), t;
    }
  }
  /** True if the database is open. */
  get isOpen() {
    return p(this, pr).isOpen();
  }
  /** Reopens the database after a {@link close} or {@link closeAndDelete} call.
   *  @param password  If the database is encrypted, you must provide the password. */
  async reopen(e) {
    this.logger.info("Reopening database {db}"), await p(this, pr).open(), await this.initialize(e);
  }
  /** Closes the database.
   *
   *  You MUST NOT call any instance methods after this except for {@link reopen}.
   *
   *  You MUST NOT use or keep reference to the Database's Collections; they're invalidated. */
  close() {
    this.logger.info("Closing database {db}");
    for (const e of Object.values(p(this, Br)))
      e.closing();
    G(this, Br, {}), G(this, Ht, void 0), p(this, pr).close();
  }
  /** Allows Database to be used with the `using` statement:
   *  ```
   *  {
   *      using db = new Database(config);
   *      // `db` will be closed implicitly when it exits scope
   *  }
   *  ```
   *  See: https://www.totaltypescript.com/typescript-5-2-new-keyword-using
   */
  [Symbol.dispose]() {
    this.close();
  }
  /** Closes the database, then deletes its persistent storage.
   *  > Note: You can call {@link reopen}, and have an empty database. */
  async closeAndDelete() {
    p(this, pr) && (this.logger.info("Closing and deleting database {db}"), await p(this, pr).delete());
  }
  /** Static method that deletes a database by name.
   *  You MUST close any open Database instance using it first. */
  static async delete(e) {
    hf.info("Deleting database {db}", { db: e }), await Lt.delete(e);
  }
  /** @internal (no need to document this!) */
  toString() {
    return `Database[${this.name}]`;
  }
  //-------- COLLECTIONS:
  /** An object whose keys are collection names and values are {@link Collection}s.
   *  In TypeScript, this object is typed accoring to the database's schema type,
   *  so accessing a nonexistent collection will result in a compile error,
   *  and Collection instances access from this will be typed according to their
   *  document schema. */
  get collections() {
    return p(this, Br);
  }
  /** Returns the Collection object for the named collection.
   *  @throws if there is no such collection. */
  getCollection(e) {
    const t = p(this, Br)[e];
    if (t === void 0)
      throw Error(`Database ${this.name} has no collection named '${e}'`);
    return t;
  }
  /** The names of the Collections in this Database. */
  get collectionNames() {
    return Object.keys(this.collections);
  }
  /** Returns the Collection named "_default".
   *  @throws if there is no such collection. */
  get defaultCollection() {
    return this.getCollection(Ca);
  }
  //-------- CHANGE LISTENER:
  /** Collections call this to enable/disable receiving Dexie db events. @internal */
  observeChangesFor(e, t = !0) {
    t ? p(this, Gs).add(e) : (p(this, Gs).delete(e), p(this, Gs).size === 0 && this.logger.info`Stopping Dexie change listener`);
  }
  installDBCore() {
    p(this, pr).use({
      stack: "dbcore",
      name: "CouchbaseLite",
      create: (e) => {
        this.logger.trace`Creating DBCore!`;
        const t = /* @__PURE__ */ new Map();
        return {
          // Return new implementation of DBCore
          ...e,
          // Copy default implementation
          table: (r) => {
            let i = e.table(r);
            if (!p(this, Qn).has(r))
              return i;
            let o = t.get(r);
            return o || (this.logger.trace`Installing mutate hook for ${r}`, o = {
              // Wrap Collection's table
              ...i,
              // Copy default table implementation
              mutate: async (a) => i.mutate(a).then((l) => {
                var c;
                return (c = p(this, Br)[r]) == null || c.onMutate(a, l), l;
              })
            }, t.set(r, o), o);
          }
        };
      }
    });
  }
  //-------- QUERIES:
  /** Creates a {@link Query} object from a N1QL/SQL++ `SELECT` statement. */
  createQuery(e) {
    return new $I(this, e);
  }
  /** Opens a transaction on one or more collections and invokes the callback.
   *  When the callback returns, the transaction commits.
   *  If the callback throws an exception, a read-write transaction is aborted.
   *
   *  **Warning:** Your callback, though declared as `async`, may not perform any async operations
   *  other than those that access the database. Trying to do network I/O or talking to Workers
   *  will trigger the dreaded "Transaction committed too soon" exception.
   *  Why? IndexedDB is very strict about not letting transactions remain open too long.
   *  If a transaction is still open when the current event loop cycle ends, it will automatically
   *  commit. The only exceptions are async operations on the database itself, for obvious
   *  reasons.
   *
   *  @param mode  'ReadWrite' or 'ReadOnly'.
   *  @param collections  Array of collections (or their names) that will be modified in this
   *              transaction.
   *  @param callback  The function that will run during the transaction.
   *  @returns  The result returned by the callback.
   *  @internal */
  async inTransaction(e, t, r) {
    const i = t.map((m) => typeof m == "string" ? m : m.name), o = t.map((m) => typeof m == "string" ? this.getCollection(m) : m);
    e === on && i.push(No, Hl);
    let a = !0, l = "", c = -1, b = !1;
    try {
      return await p(this, pr).transaction(e, i, async (m) => {
        let w = 0;
        for (let x = m.parent; x; x = x.parent)
          ++w;
        a = w === 0, l = "    ".repeat(w), a ? (c = ++Nr(this, zo)._, this.logger.debug(`>>> Begin ${e} transaction #{id}`, { id: c })) : (c = p(this, zo), this.logger.debug(`${l}>>> Begin nested ${e} transaction inside #{id}`, { id: c }));
        try {
          const x = await r();
          return b = !0, a && e !== pf && this.logger.debug("... Committing transaction #{id} ...", { id: c }), x;
        } catch (x) {
          throw this.logger.debug("Aborting transaction #{id} due to exception", { id: c }), x;
        } finally {
          if (a)
            for (let x of o)
              await x.transactionEnding(e, b);
        }
      });
    } catch (m) {
      throw b && this.logger.error(`Exception committing transaction #{id}: ${m}`, { id: c }), b = !1, m;
    } finally {
      if (a) {
        b && this.logger.debug(`<<< ${e === pf ? "Ended" : "Committed"} transaction #{id}`, { id: c });
        for (let m of o)
          m.transactionEnded(e, b);
      } else
        this.logger.debug(`${l}<<< Ended nested transaction inside #{id}`, { id: c });
    }
  }
  /** A more performant wrapper around `Dexie.waitFor`. This must be wrapped around promises
   *  being awaited, if you are possibly in a transaction, to prevent the dreaded "Transaction
   * committed early" exception. (Blame IndexedDB's awkward API design.) @internal */
  static async waitFor(e) {
    return Lt.currentTransaction !== void 0 ? Lt.waitFor(e) : e;
  }
  //-------- ENCRYPTION:
  // (Mis)using the collection metadata table to store DB metadata, under the key ""
  get metaTable() {
    return p(this, pr).table(No);
  }
  async getMeta() {
    return await this.metaTable.get("") ?? {};
  }
  async setMeta(e) {
    await this.metaTable.put(e, "");
  }
  // Implementation note: Avoid doing crypto operations during a transaction
  // because they're async and will cause the transaction to commit too early.
  // In places where that's unavoidable (while saving or loading a document)
  // we have to use Dexie's `waitFor()` hack.
  /** Returns 'none' if this database is not encrypted, 'locked' if it's encrypted but locked,
   *  or 'unlocked' if it's been unlocked.
   *
   *  If the status is 'locked' you must call {@link unlock} with the correct password,
   *  otherwise loading or querying documents will throw exceptions. @internal */
  get encryptionStatus() {
    var e;
    return Ue(!((e = Lt.currentTransaction) != null && e.active), "Don't call this in a transaction"), p(this, Ht) ? p(this, Ht).isUnlocked ? "unlocked" : "locked" : "none";
  }
  /** Unlocks an encrypted database using the given password. @internal
   *  @returns  True on success, false if the password is wrong (or there is no encryption.) */
  async unlock(e) {
    var t;
    return Ue(!((t = Lt.currentTransaction) != null && t.active), "Don't call this in a transaction"), p(this, Ht) ? await p(this, Ht).unlock(e) : !1;
  }
  /** Locks an encrypted database, making encrypted stored data inaccessible until {@link unlock}
   *  is called. Has no effect if the database is not encrypted. @internal */
  lock() {
    var e;
    (e = p(this, Ht)) == null || e.lock();
  }
  /** Encrypts or decrypts a database, or changes the encryption key.
   *  @param password  The new password for encryption, or `undefined` to decrypt.
   *  @param exceptProperties  Optional top-level properties to leave unencrypted, by collection
   *                           (in addition to indexed properties, which cannot be encrypted.)
   *                           Key is collection name, value is array or set of properties.
   *  @throws EncryptionError  if it's already encrypted. */
  async changeEncryptionKey(e, t) {
    var a;
    Ue(!((a = Lt.currentTransaction) != null && a.active), "Don't call this in a transaction"), Ue(this.encryptionStatus !== "locked", "Database must be unlocked to change encryption");
    const r = e !== void 0 ? await Va.create(e) : void 0, i = /* @__PURE__ */ new Map();
    for (const [l, c] of Object.entries(p(this, Br)))
      i.set(l, c.unencryptedProperties);
    const o = r ? p(this, Ht) ? "Rekey" : "Encrypt" : "Decrypt";
    this.logger.info`${o}ing database...`;
    try {
      await this.inTransaction(on, this.collectionNames, async () => {
        const l = await this.getMeta();
        l.challenge = r == null ? void 0 : r.challenge, await this.setMeta(l), await this.blobStore.rekey(r);
        for (const [c, b] of Object.entries(p(this, Br)))
          await b.rekey(r, t == null ? void 0 : t[c]);
      }), G(this, Ht, r), this.logger.info`...${o}ed database!`;
    } catch (l) {
      this.logger.error`${o}ing database failed! ${l}`, this.blobStore.resetEncryption(p(this, Ht));
      for (const [c, b] of Object.entries(p(this, Br)))
        b.resetEncryption(p(this, Ht), i.get(c));
      throw l;
    }
  }
  /** Decrypts the database. (Same as `encrypt(undefined)`.) */
  async decrypt() {
    await this.changeEncryptionKey(void 0);
  }
  //-------- INTERNALS:
  /** Adds a document, returning `undefined` on success, else `ConstraintError`. @internal */
  async tryAdd(e, t, r) {
    return await e.add(t, r).then((i) => {
    }).catch(async (i) => {
      const o = i;
      return o instanceof Lt.ConstraintError ? o : Promise.reject(o);
    });
  }
  /** @internal */
  get blobStore() {
    return p(this, Hs) || G(this, Hs, new WI(this, p(this, pr).table(Hl), p(this, Ht))), p(this, Hs);
  }
  /** Returns the number of blobs stored in the database. */
  async countBlobs() {
    return this.blobStore.countBlobs();
  }
  /** Deletes all blobs that are no longer referenced by any documents.
   *  @returns  The number of blobs deleted. */
  async performMaintenance(e) {
    return py(e, "compact"), this.logger.info("Garbage-collecting blobs"), await this.inTransaction(on, this.collectionNames, async () => {
      const t = /* @__PURE__ */ new Set();
      for (const r of Object.values(p(this, Br)))
        await r.collectBlobDigests(t);
      return await this.blobStore.deleteBlobsExcept(t);
    });
  }
};
Gs = new WeakMap(), zo = new WeakMap(), pr = new WeakMap(), Qn = new WeakMap(), Br = new WeakMap(), Hs = new WeakMap(), Ht = new WeakMap();
let yi = hh;
class mi {
  constructor(e, t) {
    this.local = e, this.remote = t;
  }
  static fromObject(e) {
    let t = e.local;
    typeof t != "number" && (t = void 0);
    let r = e.remote;
    return r === null && (r = void 0), new mi(t, r);
  }
  get empty() {
    return this.local === void 0 && this.remote === void 0;
  }
  equals(e) {
    return this.local === e.local && this.remote === e.remote;
  }
  toString() {
    return `{local: ${this.local}, remote: ${JSON.stringify(this.remote)}}`;
  }
  clone() {
    return new mi(this.local, this.remote);
  }
}
class zr extends Error {
  constructor(e, t) {
    super(e), this.code = t, this.name = "ReplicatorError";
  }
}
const df = Symbol();
function Kn(n) {
  const e = n[df];
  if (e === void 0)
    throw TypeError("meta() called on non-document");
  return e;
}
var Vi, Ji;
const ph = class ph {
  /** @internal */
  constructor(e, t, r, i, o) {
    /** The collection that the document belongs to. */
    ve(this, "collection");
    /** The ID (primary key) of the document. */
    ve(this, "id");
    /** The document itself. */
    ve(this, "body");
    ee(this, Vi);
    ee(this, Ji);
    yg(t), this.collection = e, this.id = t, G(this, Vi, i), G(this, Ji, o), this.body = r, this.body[df] = this, Object.defineProperty(r, df, { enumerable: !1 });
  }
  /** The current revision ID of the document. */
  get revisionID() {
    return p(this, Vi);
  }
  /** The current sequence number of the document. */
  get sequence() {
    return p(this, Ji);
  }
  /** Replaces the document's properties with a copy of `newBody`. */
  setBody(e) {
    const t = this.body;
    for (const r of Object.getOwnPropertyNames(t))
      Object.hasOwn(e, r) || delete t[r];
    Object.assign(t, e);
  }
  /** Makes a deep copy of a CBLDocument. @internal */
  clone() {
    return new ph(this.collection, this.id, Da(this.body), p(this, Vi), p(this, Ji)).body;
  }
  /** Updates the `revID` and `sequence` properties after the document is saved. @internal */
  _updateRev(e, t) {
    G(this, Vi, e), G(this, Ji, t);
  }
};
Vi = new WeakMap(), Ji = new WeakMap();
let Cs = ph;
function YI() {
  const n = new Uint8Array(15);
  return "-" + em(crypto.getRandomValues(n)).replaceAll("/", "_");
}
function Ja(n) {
  return Ir(n) && n["@type"] === "blob" && typeof n.digest == "string";
}
function VI(n) {
  return Ja(n) ? n : null;
}
function JI(n, e) {
  t(n);
  function t(r) {
    if (ys(r)) {
      let i = 0;
      for (const o of r) {
        const a = t(o);
        a && (r[i] = a), ++i;
      }
    } else if (Ir(r)) {
      const i = VI(r);
      if (i)
        return new su(i, e);
      for (const o of Object.getOwnPropertyNames(r)) {
        const a = t(r[o]);
        a && (r[o] = a);
      }
    }
  }
}
function ZI(n, e) {
  t(n);
  function t(r) {
    if (r instanceof uo)
      return new su(r, e);
    if (ys(r)) {
      let i = 0;
      for (const o of r) {
        const a = t(o);
        a && (r[i] = a), ++i;
      }
    } else if (Ir(r))
      for (const i of Object.getOwnPropertyNames(r)) {
        const o = t(r[i]);
        o && (r[i] = o);
      }
  }
}
function vf(n) {
  let e = 0;
  return C0(n, (t, r) => t instanceof uo ? (e = 2, !1) : (e = 1, !0)), e;
}
function C0(n, e) {
  const t = [];
  function r(i) {
    if (Ir(i)) {
      t.push(0);
      for (const o of Object.getOwnPropertyNames(i))
        if (t[t.length - 1] = o, !r(i[o]))
          return !1;
      t.pop();
    } else if (ys(i)) {
      let o = 0;
      t.push(0);
      for (const a of i)
        if (t[t.length - 1] = o++, !r(a))
          return !1;
      t.pop();
    } else if (Pf(i))
      return e(i, t);
    return !0;
  }
  r(n);
}
function gf(n, e) {
  const t = [];
  function r(i) {
    if (Ir(i))
      if (Ja(i))
        e(i, t);
      else {
        t.push(0);
        for (const o of Object.getOwnPropertyNames(i))
          t[t.length - 1] = o, r(i[o]);
        t.pop();
      }
    else if (ys(i)) {
      let o = 0;
      t.push(0);
      for (const a of i)
        t[t.length - 1] = o++, r(a);
      t.pop();
    } else if (Pf(i))
      return e(i, t);
  }
  r(n);
}
function QI() {
  return typeof crypto < "u" ? crypto.randomUUID() : XI();
}
function XI() {
  const n = [];
  for (let e = 0; e < 4; e++) {
    const t = Math.round(Math.abs(Math.random() * -2147483648 * 2));
    n.push(t.toString(16).padStart(8, "0"));
  }
  return n.join("");
}
const Ca = "_default", jn = "value", eb = "array";
function c_(n, e) {
  return "replace";
}
function f_(n, e) {
  if (e === void 0)
    return "replace";
  const t = Kn(n).revisionID;
  return t && bi(t) >= bi(Kn(e).revisionID) ? "replace" : "revert";
}
class tb extends Error {
  constructor(e, t, r, i) {
    super(`Conflict ${e} "${t}" rev ${r}; saved revision is ${i}`), this.docID = t, this.revID = r, this.savedRevID = i, this.name = "Conflict";
  }
}
class Tv extends Error {
  constructor(e) {
    super(`Conflict(s) saving ${e.size} documents`), this.errors = e, this.name = "MultipleConflicts";
  }
}
const Cv = "(_default|([a-zA-Z0-9][-_a-zA-Z0-9%]*))", rb = new RegExp(`^${Cv}(\\.${Cv})?$`);
var it, Xn, Zi, Kt, ei, xn, Kr, ti, ri, tr, En;
const Xa = class Xa {
  /** @internal */
  constructor(e, t, r, i, o) {
    /** {@link https://logtape.org LogTape} logger instance for this Collection. @internal */
    ve(this, "logger");
    ee(this, it);
    // Dexie Table instance
    ee(this, Xn, /* @__PURE__ */ new Map());
    // Cached DocProperty instances
    ee(this, Zi);
    // Current task reading metadata
    ee(this, Kt);
    // Metadata, during a transaction
    ee(this, ei, !1);
    // True if `_meta` has unsaved changes
    ee(this, xn);
    // Timer for expiring documents
    ee(this, Kr);
    // Pending changes during a txn
    ee(this, ti, /* @__PURE__ */ new Set());
    // Collection change listeners
    ee(this, ri, /* @__PURE__ */ new Map());
    // Doc change listeners by DocID
    ee(this, tr);
    // Encrypts/decrypts rev bodies
    ee(this, En);
    this.database = e, this.name = t, this.config = r, this.db = i, G(this, it, i.table(t)), G(this, tr, o), this.logger = hf.getChild(["c", this.name]).with({ db: e.name });
    const a = this.config.indexes;
    if (a)
      for (const l of a) {
        let c;
        typeof l == "string" ? c = l : typeof l.on == "string" ? c = l.on : c = l.on[0], p(this, Xn).set(c, hs.create(c, !0));
      }
  }
  /** Database calls this right after the constructor.  @internal */
  async open() {
    var e;
    p(this, tr) && G(this, En, (e = await this.getMeta()) == null ? void 0 : e.unencryptedProperties), this.startExpTimer();
  }
  /** Checks that a collection name is valid. If not, throws.  @internal */
  static validateName(e) {
    if (!rb.test(e))
      throw Error(`Invalid collection name '${e}'`);
  }
  /** @internal */
  get dexieTable() {
    return p(this, it);
  }
  /** True if the database is open.  @internal */
  get isOpen() {
    return p(this, it).db.isOpen();
  }
  /** @internal */
  closing() {
    this.stopExpTimer(), G(this, tr, void 0);
  }
  /** Opens a {@link Database.inTransaction transaction} on this collection only and invokes the callback.
   *  When the callback returns, the transaction commits.
   *  If the callback throws an exception, the transaction aborts.
   *  @remarks
   *  >  In the transaction you can only modify this collection. If you need to modify
   *  >  multiple collections, use {@link Database.inTransaction} instead.
   *  @template T  The type returned by the callback; usually inferred.
   *  @internal */
  async inTransaction(e, t) {
    return await this.database.inTransaction(e, [this], async () => await t(this));
  }
  /** Translates a public property name/path to a DocProperty object. @internal */
  property(e) {
    var r;
    let t = p(this, Xn).get(e);
    return t === void 0 && (t = hs.create(e, !1), p(this, tr) && (t.encrypted = !((r = p(this, En)) != null && r.has(t.rootName))), p(this, Xn).set(e, t)), t;
  }
  /** @internal (no need to document this!) */
  toString() {
    return `Collection[${this.name} in ${this.database.name}]`;
  }
  //-------- ENCRYPTION:
  // Implementation note: Avoid doing crypto operations during a transaction
  // because they're async and will cause the transaction to commit too early.
  // In places where that's unavoidable (while saving or loading a document)
  // we have to use Dexie's `waitFor()` hack.
  /** @internal */
  get unencryptedProperties() {
    return p(this, En);
  }
  /** Encrypts the documents in this Collection.  @internal */
  async rekey(e, t) {
    var o;
    Ue((o = Lt.currentTransaction) == null ? void 0 : o.active, "Must be called in a transaction");
    const r = await this.documentIDs();
    if (e) {
      t === void 0 ? t = /* @__PURE__ */ new Set() : Array.isArray(t) && (t = new Set(t));
      for (const l of t)
        Ue(
          !l.includes("."),
          `Only top-level properties can be excluded from encryption, not "${l}"`
        );
      const a = this.config.indexes;
      if (a) {
        const l = (c, b) => {
          var w;
          const m = (w = p(this, Xn).get(c)) == null ? void 0 : w.rootName;
          m && b.add(m);
        };
        for (const c of a)
          if (typeof c == "string")
            l(c, t);
          else if (typeof c.on == "string")
            l(c.on, t);
          else
            for (const b of c.on)
              l(b, t);
      }
      this.logger.info`Encrypting ${r.length} documents, except for properties ${Array.from(t)}`;
    } else
      this.logger.info`Decrypting ${r.length} documents...`, t = void 0;
    for (const a of r) {
      let l = await p(this, it).get(a);
      if (!Bi(l)) {
        const c = l.encrypted !== void 0;
        if (c && await this.decryptRevision(l), e) {
          const { body: b, encrypted: m } = await yi.waitFor(
            e.partlyEncrypt(l.body, t)
          );
          l.body = b, l.encrypted = m;
        }
        (c || l.encrypted) && await p(this, it).put(l);
      }
    }
    this.resetEncryption(e, t);
    const i = await this.getMeta();
    i.unencryptedProperties = t, G(this, ei, !0), this.logger.info`...done encrypting/decrypting collection!`;
  }
  /** Called by `rekey`, and by the Database after `encrypt` or `decrypt` if something went wrong.
   *  @internal */
  resetEncryption(e, t) {
    G(this, tr, e), G(this, En, t);
    for (let r of p(this, Xn).values())
      r.indexed || (r.encrypted = t !== void 0 && t.has(r.rootName));
  }
  /** Called by queries to decrypt a LocalRevision returned from a Dexie query.  @internal */
  async decryptRevision(e) {
    if (e.encrypted) {
      if (!p(this, tr))
        throw new fu("Document is encrypted");
      await yi.waitFor(p(this, tr).decryptRevision(e));
    }
  }
  //-------- CRUD:
  /** Loads an existing {@link CBLDocument document}, or returns `undefined` if it doesn't exist. */
  async getDocument(e) {
    const t = await this.getRevision(e, !0);
    if (!t) {
      this.logger.info("Get document {docID} -- missing", { docID: e });
      return;
    }
    return this.logger.info("Get document {docID}", { docID: e, revID: t.rev }), this.revToDoc(t);
  }
  /** Gets an existing document in its raw `LocalRevision` form. @internal
   *  @throws EncryptionError  if `decrypt` is true, doc is encrypted & collection is locked. */
  async getRevision(e, t) {
    const r = await p(this, it).get(e);
    return r != null && r.encrypted && t && await this.decryptRevision(r), r;
  }
  /** Creates a new {@link CBLDocument document} instance tied to this collection.
   *  The document will not be persisted to the database until you save it.
   *  @param id  The document ID, which must be unique in the Collection.
   *             If you pass `null`, a random ID will be generated.
   *  @param body  The initial contents of the document; if omitted, it will be empty. */
  createDocument(e, t) {
    return t || (t = {}), new Cs(this, e ?? YI(), t).body;
  }
  /** Saves a {@link CBLDocument document} to this collection.
   *
   *  If the document in the database has been changed since this instance was read
   *  -- by your app or by a replicator pulling revisions from a server --
   *  a conflict occurs. By default, a {@link ConflictError} will be thrown.
   *  If you pass a {@link ConflictHandler} callback, it will be invoked during the save and
   *  can decide how to resolve the conflict.
   *
   *  > **Performance note:** If you are saving multiple documents to a collection, use
   *    {@link updateMultiple} instead; it's much faster than saving one at a time.
   *
   *  @param onConflict  Optional conflict handler callback.
   *  @returns true if saved, false if the ConflictHandler decided to 'revert'.
   *  @throws ConflictError on conflict.
   *  @throws EncryptionError  if the database is encrypted and locked. */
  async save(e, t) {
    const r = await this.preSave(e), i = await this.inTransaction(on, async () => (p(this, Kt) || await this.getMeta(), await this.doSave(r, t)));
    return r.postSave(), i && this.logger.info("Saved doc {docID}", { docID: r.doc.id, revID: r.newRevID }), i;
  }
  /** Prep work for save() that can be performed outside of a transaction. */
  async preSave(e, t = !1) {
    const r = new nb(e, t);
    return Ue(r.doc.collection === this, "Saving document to wrong Collection"), !t && p(this, tr) && (r.newBody = await yi.waitFor(
      p(this, tr).partlyEncrypt(r.doc.body, p(this, En))
    )), r;
  }
  /** The actual work of saving a document. Must be called in a transaction. */
  async doSave(e, t) {
    const r = e.doc;
    let i;
    if (e.newSeq = this._nextSequence(), e.blobStatus > 1 && await this.saveNewBlobsIn(e.doc.body), r.revisionID === void 0) {
      const o = await this.database.tryAdd(p(this, it), e.makeRevision());
      if (o === void 0)
        return !0;
      if (i = await p(this, it).get(r.id), !i)
        throw o;
      if (!Bi(i)) {
        if (!this.handleConflict("saving", t, r, i))
          return e.newSeq = void 0, !1;
        e.updateFrom(i.rev) && await this.saveNewBlobsIn(r.body);
      }
    } else if (i = await p(this, it).get(r.id), !i || i.rev !== r.revisionID) {
      if (!this.handleConflict("saving", t, r, i))
        return e.newSeq = void 0, !1;
      if (e.updateFrom(i == null ? void 0 : i.rev) && await this.saveNewBlobsIn(r.body), !i)
        return await p(this, it).add(e.makeRevision()), !0;
    }
    return e.updateRevision(i), await p(this, it).put(i), !0;
  }
  /** Deletes a {@link CBLDocument document} from this collection.
   *
   *  Deletion leaves behind an invisible "tombstone" revision, a placeholder that's used by
   *  the Replicator to sync the deletion back to a server. If you don't want the overhead,
   *  and this deletion does not need to be synced, consider using {@link purge} instead.
   *
   *  Conflicts can occur when deleting, just as on a regular save. A {@link ConflictHandler}
   *  allows you to handle them.
   *
   *  > **Performance note:** If you are deleting multiple documents, use
   *    {@link updateMultiple} instead; it's much faster than saving one at a time.
   *
   *  @param doc  The document.
   *  @param onConflict  Optional conflict handler callback.
   *  @returns true if saved, false if the ConflictHandler decided to 'revert'.
   *  @throws ConflictError on conflict.
   *  @throws EncryptionError  if the database is encrypted and locked. */
  async delete(e, t) {
    e instanceof Cs || (e = Kn(e)), Ue(e.collection === this, "Saving document to wrong Collection"), Ue(e.revisionID !== void 0, "Document has not been saved");
    let r = await this.inTransaction(on, async () => await this.doDelete(e, t));
    return r === void 0 ? !1 : (e.setBody({}), e._updateRev(r[0], r[1]), this.logger.info("Deleted doc {docID}", { docID: e.id }), !0);
  }
  async doDelete(e, t) {
    Ue(e.collection === this, "Saving document to wrong Collection"), Ue(e.revisionID !== void 0, "Document has not been saved");
    const r = await p(this, it).get(e.id);
    return r ? Bi(r) ? [r.rev, r.seq] : r.rev !== e.revisionID && !this.handleConflict("deleting", t, e, r) ? void 0 : (r.rev = Ba(e.revisionID, e.body, !0), r.seq = await this.nextSequence(), r.body = {}, r.encrypted = void 0, r.flags = (r.flags ?? 0) | Sr & -2, await p(this, it).put(r), [r.rev, r.seq]) : [e.revisionID, e.sequence];
  }
  /** Saves and/or deletes multiple documents at once in a single database transaction.
   *  This is much faster than saving each individually.
   *
   *  The `args` object has the following properties, all optional:
   *  - `save`: Array of CBLDocuments to save
   *  - `delete`: Array of CBLDocuments to delete
   *  - `onConflict`: Conflict handler
   *  - `bestEffort`: If true, the transaction will commit even if some documents had errors.
   *                  An error will still be thrown, though.
   *  @throws {@link MultipleConflictsError} if any documents failed to update.
   *          Its `errors` property tells which documents failed and why. */
  async updateMultiple(e) {
    const t = Date.now(), r = [], i = [], o = [];
    if (e.save) {
      this.logger.info`Saving ${e.save.length} docs ...`;
      for (const b of e.save) {
        const m = await this.preSave(b);
        m.doc.revisionID === void 0 ? r.push(m) : i.push(m);
      }
    }
    if (e.delete) {
      this.logger.info`Deleting ${e.delete.length} docs ...`;
      for (const b of e.delete)
        o.push(await this.preSave(b, !0));
    }
    const a = r.length + i.length + o.length;
    if (a === 0)
      return;
    let l = [], c = /* @__PURE__ */ new Map();
    await this.inTransaction(on, async () => {
      if (await this.getMeta(), r.length > 0) {
        for (const m of r)
          m.blobStatus > 1 && (await this.saveNewBlobsIn(m.doc.body), m.blobStatus = 1);
        this.logger.debug`... inserting ${r.length} of the docs ...`;
        let b = await this.bulkAdd(r.map((m) => (m.newSeq = this._nextSequence(), m.makeRevision())));
        if (b === void 0)
          l.push(...r);
        else {
          const m = new Set(b);
          r.forEach((w, x) => {
            m.has(x) ? (w.newSeq = void 0, i.push(w)) : l.push(w);
          });
        }
      }
      if (i.length > 0) {
        this.logger.debug`... updating ${i.length} of the docs ...`;
        for (const b of i)
          try {
            await this.doSave(b, e.onConflict) && l.push(b);
          } catch (m) {
            c.set(b.doc.id, m);
          }
      }
      if (o.length > 0) {
        this.logger.debug`... deleting ${o.length} of the docs ...`;
        for (const b of o)
          try {
            const m = await this.doDelete(b.doc, e.onConflict);
            m && ([b.newRevID, b.newSeq] = m, l.push(b));
          } catch (m) {
            c.set(b.doc.id, m);
          }
      }
      if (c.size > 0 && (this.logger.error`saveMultiple: ${c.size} of ${a} docs failed`, !e.bestEffort))
        throw new Tv(c);
    });
    for (const b of l)
      b.postSave();
    if (this.logger.info`Updated ${l.length} of ${a} docs in ${Date.now() - t}ms`, c.size > 0 && e.bestEffort)
      throw new Tv(c);
  }
  /** Deletes all traces of a document, without leaving a "tombstone" revision behind.
   *  However, this means *purges are not visible to the replicator*, which has two side effects:
   *  - A push replication will not push the deletion to a server.
   *  - If the document is later updated on the server side, the next pull replication will
   *    download the new revision.
   *  @param doc  The document or DocID. */
  async purge(e) {
    const t = typeof e == "string" ? e : Kn(e).id;
    await p(this, it).delete(t), this.logger.info("Purged doc {docID}", { docID: t });
  }
  /** {@link purge Purges} multiple documents at once. */
  async purgeMultiple(e) {
    const t = e.map((r) => typeof r == "string" ? r : Kn(r).id);
    await p(this, it).where(Lo).anyOf(t).delete();
  }
  /** Invokes an optional ConflictHandler.
   *  @returns true if the handler resolved the conflict, false if it returned 'ignore'.
   *  @throws ConflictError if there is no handler, or if it returned 'fail'. */
  handleConflict(e, t, r, i) {
    if (t !== void 0) {
      const o = i ? this.revToDoc(i) : void 0;
      switch (t(r.body, o)) {
        case "replace":
          return !0;
        case "revert":
          return i && (r.setBody(i.body), r._updateRev(i == null ? void 0 : i.rev, i.seq)), !1;
      }
    }
    throw new tb(e, r.id, r.revisionID, i == null ? void 0 : i.rev);
  }
  async saveNewBlobsIn(e) {
    const t = new Array();
    C0(e, (r, i) => (r instanceof uo && t.push(r), !0));
    for (const r of t)
      await this.database.blobStore.saveBlob(r.contents, r.digest);
    ZI(e, this.database.blobLoader);
  }
  /** Adds the digest of every blob in every document to the set [allDigests]. @internal */
  async collectBlobDigests(e) {
    const t = await p(this, it).where("flags").anyOf([_n, _n | Oo]).primaryKeys();
    for (const r of t) {
      const i = await p(this, it).get(r);
      i.encrypted && await this.decryptRevision(i), gf(i.body, (o) => e.add(o.digest)), i.conflict && gf(i.conflict, (o) => e.add(o.digest));
    }
  }
  //-------- EVENT LISTENERS:
  /** Adds a listener function that will be called after any document(s) change.
   *  If documents are changed while in a transaction, the listener is not called until the
   *  transaction successfully commits.
   *
   *  > Note:  Purged and expired documents do not trigger notifications.
   *
   *  @param callback  The function to be called after documents change.
   *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
   *            remove the listener. */
  addChangeListener(e) {
    return this.isListening() || this.database.observeChangesFor(this.name, !0), p(this, ti).add(e), new _f(() => {
      p(this, ti).delete(e), this.isListening() || (G(this, Kr, void 0), this.database.observeChangesFor(this.name, !1));
    });
  }
  /** Adds a listener function that will be called after a specific document changes.
   *
   *  > Note: If the document is changed while in a transaction, the listener is not called
   *    until the transaction successfully commits.
   *
   *  > Note: Purged and expired documents do not trigger notifications.
   *
   *  @param docID The ID of the document to monitor.
   *  @param callback  The function to be called after the document changes.
   *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
   *            remove the listener. */
  addDocumentChangeListener(e, t) {
    this.isListening() || this.database.observeChangesFor(this.name, !0);
    let r = p(this, ri).get(e);
    return r || (r = /* @__PURE__ */ new Set(), p(this, ri).set(e, r)), r.add(t), new _f(() => {
      var i;
      (i = p(this, ri).get(e)) == null || i.delete(t), this.isListening() || (G(this, Kr, void 0), this.database.observeChangesFor(this.name, !1));
    });
  }
  isListening() {
    return p(this, ri).size > 0 && p(this, ti).size > 0;
  }
  /** Called via a Dexie hook after any change in the collection's table. @internal */
  onMutate(e, t) {
    var i;
    if (p(this, ti).size === 0)
      return;
    function r(o) {
      return o.length > 0 && Object.keys(t.failures).length > 0 ? o.filter((a, l) => t.failures[l] === void 0) : o;
    }
    switch (e.type) {
      case "add":
      case "put": {
        const o = r(e.values);
        if (o.length > 0) {
          p(this, Kr) === void 0 && G(this, Kr, /* @__PURE__ */ new Map());
          for (const a of o) {
            let l = { id: a.id, rev: a.rev, sequence: a.seq };
            Bi(a) && (l.deleted = !0), Object.freeze(l), p(this, Kr).set(a.id, l);
          }
          this.logger.debug`MUTATE ${this.name}: ${e.type.toUpperCase()}: ${o.map((a) => a.id).join(", ")}`;
        }
        break;
      }
      case "delete": {
        const o = r(e.keys);
        if (o.length > 0) {
          for (const a of o)
            (i = p(this, Kr)) == null || i.delete(a);
          this.logger.debug`MUTATE ${this.name}: DELETE keys = ${o.join(", ")}`;
        }
        break;
      }
      case "deleteRange": {
        this.logger.debug`MUTATE ${this.name}: DELETE RANGE values = ${e.range.lower} -- ${e.range.upper}`;
        break;
      }
    }
    Lt.currentTransaction || this.postChangeEvent();
  }
  // Posts accumulated changes to all change listeners.
  postChangeEvent() {
    const e = p(this, Kr);
    if (e) {
      G(this, Kr, void 0), Object.freeze(e);
      for (const t of p(this, ti))
        try {
          t(e);
        } catch (r) {
          this.logger.error`Caught exception in collection change listener: ${r}`;
        }
      for (const [t, r] of p(this, ri)) {
        const i = e.get(t);
        if (i)
          for (const o of r)
            try {
              o(i);
            } catch (a) {
              this.logger.error`Caught exception in document change listener: ${a}`;
            }
      }
    }
  }
  //-------- QUERIES:
  /** By default, returns the number of documents in the collection.
   *  If `what` is "deleted", it returns the number of deleted docs ("tombstones".)
   *  If `what` is "includeDeleted", it returns the total number of live and deleted docs. */
  async count(e = "docs") {
    const t = async () => await p(this, it).where("flags").aboveOrEqual(Sr).count();
    switch (e) {
      case "docs":
        return await p(this, it).count() - await t();
      case "deleted":
        return await t();
      case "includeDeleted":
        return await p(this, it).count();
    }
  }
  /** Invokes the callback with each (undeleted) Document of the Collection, ordered by docID.
   *  The callback should return true to continue, or false to stop the iteration.
   *  @returns  True if the iteration completed, false if it was stopped. */
  async eachDocument(e) {
    this.logger.info("Getting all documents");
    const t = this.name, r = new Ga(), i = new x0({ collection: this, alias: t }), o = new S0((a) => {
      const l = a.getSourceRevision(t);
      return e(this.revToDoc(l));
    });
    return i.receiver = o, await i.run(r), o.ok;
  }
  /** Returns the DocIDs of all (undeleted) documents. */
  async documentIDs() {
    return await p(this, it).toCollection().filter((e) => !((e.flags ?? 0) & Sr)).primaryKeys();
  }
  /** Returns the DocIDs of all deleted documents. */
  async deletedDocumentIDs() {
    return this.docIDsByFlags((e) => e.aboveOrEqual(Sr));
  }
  /** Returns the DocIDs of all documents that have unresolved replication conflicts. @internal*/
  async conflictedDocumentIDs() {
    return this.docIDsByFlags((e) => e.between(Oo, Oo | _n));
  }
  async docIDsByFlags(e) {
    return await e(p(this, it).where("flags")).primaryKeys();
  }
  //-------- EXPIRATION:
  /** Sets or clears an expiration date for a document.
   *  @param doc  The document or DocID
   *  @param expiration  Can be an absolute `Date`,
   *                     or a number interpreted as milliseconds into the future,
   *                     or `undefined` to disable expiration.
   *  @throws if the document doesn't exist. */
  async setDocumentExpiration(e, t) {
    const r = typeof e == "string" ? e : Kn(e).id, i = Date.now();
    let o;
    if (t !== void 0 && (o = t instanceof Date ? t.getTime() : i + t), await p(this, it).update(r, { expires: o }) < 1)
      throw Error(`No such document '${r}`);
    o !== void 0 ? this.logger.info(
      "Set expiration of doc {docID} to {time} sec from now",
      { docID: r, time: (o - i) / 1e3 }
    ) : this.logger.info("Cleared expiration of doc {docID}", { docID: r }), o !== void 0 && this.startExpTimer();
  }
  /** Gets a document's expiration date.
   *  @returns The expiration date, or `undefined` if none, or if the document doesn't exist. */
  async getDocumentExpiration(e) {
    var i;
    const t = typeof e == "string" ? e : Kn(e).id, r = (i = await p(this, it).get(t)) == null ? void 0 : i.expires;
    return r ? new Date(r) : void 0;
  }
  /** Returns the next time (milliseconds since epoch) at which a doc will expire. @internal */
  async nextExpirationTime() {
    const e = await p(this, it).orderBy(Aa).first();
    return e == null ? void 0 : e.expires;
  }
  /** Purges all documents whose expiration date has arrived.
   *  Returns the number of documents purged. @internal */
  async expireDocs() {
    const e = await p(this, it).where(Aa).belowOrEqual(Date.now()).delete();
    return e > 0 && this.logger.info("Deleted {n} expired docs", { n: e }), e;
  }
  async startExpTimer() {
    if (this.stopExpTimer(), this.isOpen && this.database.enableAutoExpiry) {
      const e = await this.nextExpirationTime();
      if (e !== void 0 && p(this, xn) === void 0 && this.isOpen) {
        const t = Math.max(e - Date.now(), 0), r = async () => {
          G(this, xn, void 0), this.isOpen && (await this.expireDocs(), this.startExpTimer());
        };
        G(this, xn, setTimeout(() => void r(), t));
      }
    }
  }
  stopExpTimer() {
    p(this, xn) && (clearTimeout(p(this, xn)), G(this, xn, void 0));
  }
  //-------- INDEXES:
  /** Creates a Dexie schema string for use by the `Version.stores()` method.  @internal */
  static dexieIndexSpec(e) {
    let t = "id, &seq, flags, expires";
    if (e.indexes)
      for (const r of e.indexes)
        t += ", " + Xa.indexNameFromSpec(r);
    return t;
  }
  /** Returns the Dexie index name of an IndexConfig */
  static indexNameFromSpec(e) {
    function t(r) {
      return hs.create(r).keypath;
    }
    if (typeof e == "string")
      return t(e);
    {
      let r = "";
      switch (e.type) {
        case jn:
        case void 0:
          if (e.unique && (r += "&"), typeof e.on == "string")
            r += t(e.on);
          else {
            if (e.on.length === 0)
              throw Error("Compound index must be on at least one key");
            if (e.unique)
              throw Error("Compound index cannot be unique");
            r += "[" + e.on.map(t).join("+") + "]";
          }
          break;
        case eb:
          if (typeof e.on != "string")
            throw Error("Array index may not be on multiple properties");
          r += "*" + t(e.on);
          break;
        default:
          throw Error(`Invalid index type '${e.type}'`);
      }
      return r;
    }
  }
  /** Returns the collection's indexes, including the automatic ones. @internal */
  getIndexes() {
    let e = [
      { name: Lo, type: jn, on: [this.property(Fa)], unique: !0 },
      { name: Po, type: jn, on: [this.property(La)], unique: !0 },
      { name: Aa, type: jn, on: [this.property(qa)] }
    ];
    const t = this.config.indexes;
    if (t)
      for (const r of t) {
        let i, o, a;
        typeof r == "string" ? i = [r] : (i = Array.isArray(r.on) ? r.on : [r.on], a = r.type ?? jn, o = r.unique);
        let l = Xa.indexNameFromSpec(r);
        l.startsWith("*") && (l = l.substring(1)), e.push({
          name: l,
          type: a ?? jn,
          on: i.map((c) => this.property(c)),
          unique: o
        });
      }
    return e;
  }
  /** Returns the index, if any, whose primary key is `property`.
   *  If there is more than one, it picks the one with the fewest properties.  @internal */
  indexOfProperty(e, t = jn) {
    let r, i = 1 / 0;
    if (e.indexed)
      for (const o of this.getIndexes())
        o.on[0] === e && o.on.length < i && o.type === t && (r = o);
    return r;
  }
  //-------- Replicator Support:
  /** Returns the collection's UUID, used for saving the remote checkpoint on the server.
   *  @internal */
  async getUUID() {
    let e = await this.getMeta();
    return e.clientID ? e.clientID : await this.db.transaction("rw", No, async () => (e = await this.getMeta(), e.clientID || (e.clientID = QI(), await this.metaTable.put(e, this.name), this.logger.debug("assigned clientID {clientID}", { clientID: e.clientID })), e.clientID));
  }
  /** Returns the locally-stored Checkpoint for a given checkpoint ID.
   *  @internal */
  async getCheckpoint(e) {
    const t = await this.db.table(Zc).get([this.name, e]);
    return t ? mi.fromObject(t) : void 0;
  }
  /** Saves the local Checkpoint for a given checkpoint ID.
   *  @internal */
  async setCheckpoint(e, t) {
    this.logger.debug("Saving checkpoint {id} as {checkpoint}", { id: e, checkpoint: t }), await this.db.table(Zc).put(t, [this.name, e]);
  }
  /** The last/highest sequence number assigned to a document.
   *  @internal */
  async lastSequence() {
    return p(this, Kt) ? p(this, Kt).lastSeq : (await this.getMeta()).lastSeq;
  }
  /** Gets the local current revision(s) of a document, during a pull operation.
   *  @param id  The document ID.
   *  @param serverRevID  The current revID on the server.
   *  @returns  Array of current revIDs, or null if the document is up to date with the server.
   *  @internal */
  async getAncestorRevs(e, t) {
    const r = await p(this, it).get(e);
    return r ? r.rev === t || r.serverRev === t ? null : r.serverRev ? [r.rev, r.serverRev] : [r.rev] : [];
  }
  /** Saves multiple revisions received from the server.
   *  @param newRevs  Array of revisions received from the server.
   *  @param assumeNew  Set this to true if the docs most likely don't exist locally.
   *  @returns  The last Sequence added, and optionally the set of DocIDs with conflicts.
   *  @internal */
  async putRemoteRevisions(e, t) {
    Ue(e.length > 0);
    let r = 0, i;
    return await this.inTransaction(on, async () => {
      if (p(this, Kt) || await this.getMeta(), t) {
        this.logger.debug`inserting ${e.length} revs as new...`;
        const a = await this.putNewRemoteRevisions(e);
        if (a === void 0) {
          r = p(this, Kt).lastSeq;
          return;
        }
        e = a;
      }
      const o = (await p(this, it).bulkGet(e.map((a) => a.id))).map((a, l) => this.updateLocalRev(a, e[l], this._nextSequence()));
      p(this, tr) && await this.encryptLocalRevs(o), await p(this, it).bulkPut(o), r = p(this, Kt).lastSeq;
      for (const a of o)
        a.flags && a.flags & Oo && (i === void 0 && (i = /* @__PURE__ */ new Set()), i.add(a.id));
    }), Ue(r > 0), { lastSequence: r, conflicts: i };
  }
  // subroutine of putRemoteRevisions that uses `bulkAdd` to create new documents;
  // if any already exist, it returns them so the caller can handle them as normal updates.
  async putNewRemoteRevisions(e) {
    const t = e.map((i) => this.createLocalRev(i, this._nextSequence()));
    p(this, tr) && await this.encryptLocalRevs(t);
    let r = await this.bulkAdd(t);
    if (r !== void 0)
      return r.map((i) => e[i]);
  }
  async bulkAdd(e) {
    try {
      await p(this, it).bulkAdd(e);
      return;
    } catch (t) {
      if (!(t instanceof Lt.BulkError))
        throw t;
      let r = [];
      for (const [i, o] of Object.entries(t.failuresByPos)) {
        const a = Number(i);
        if (o.name !== "ConstraintError")
          throw this.logger.error("bulkAdd: '{id}' failed: {error}", { id: e[a].id, error: o }), o;
        r.push(a);
      }
      return r;
    }
  }
  /** Returns an ordered list of revisions that were created since a given local Sequence.
   *  @param since  The sequence to start just past; use `undefined` for all changes.
   *  @param limit  The maximum number of revisions to return.
   *  @returns  An array of `PushRevision`, ordered by Sequence.
   *  @internal */
  async getDocsSinceSequence(e, t) {
    let r;
    return e !== void 0 && e > 0 ? r = p(this, it).where(Po).above(e) : r = p(this, it).orderBy(Po), (await r.limit(t).toArray()).map((i) => ({
      id: i.id,
      rev: i.rev,
      deleted: Bi(i) ? 1 : void 0,
      body: i.body,
      seq: i.seq,
      serverRev: i.serverRev
    }));
  }
  /** Updates documents' `serverRev` properties, after they've been pushed. @internal */
  async updateServerRevs(e) {
    await p(this, it).where("id").anyOf(Array.from(e.keys())).modify((t) => {
      const r = e.get(t.id);
      Df(t.serverRev, r) || (t.serverRev = r);
    });
  }
  /** Resolves a replication conflict. Returns false if `revID` is out of date. @internal */
  async resolveConflict(e, t, r) {
    return await this.inTransaction(on, async () => {
      let o = await p(this, it).get(e);
      if ((o == null ? void 0 : o.rev) !== t)
        return !1;
      Nn(o.conflict);
      const a = lo(r, o.conflict);
      let l = (o.flags ?? 0) & -194;
      if (r === null)
        l |= Sr, r = {};
      else {
        const c = vf(r);
        c > 0 && (l |= _n), c >= 2 && await this.saveNewBlobsIn(r);
      }
      return a ? (Nn(o.serverRev), o.rev = o.serverRev) : o.rev = Ba(t, r, (l & Sr) !== 0), o.body = r, o.seq = await this.nextSequence(), Na(o, l), o.conflict = void 0, await p(this, it).put(o), !0;
    });
  }
  //-------- INTERNAL REVISION HELPER METHODS:
  /** Creates a LocalRevision from a RemoteRevision. */
  createLocalRev(e, t) {
    let r = 0;
    e.deleted && (r |= Sr), e.hasBlobs && (r |= _n);
    const i = {
      id: e.id,
      rev: e.rev,
      seq: t,
      body: e.body,
      serverRev: e.rev
    };
    return Na(i, r), i;
  }
  /** Updates or creates a LocalRevision from a RemoteRevision. */
  updateLocalRev(e, t, r) {
    if (e === void 0)
      return this.createLocalRev(t, r);
    let i = e.flags ?? 0;
    return e.rev !== e.serverRev && e.rev !== t.rev ? (this.logger.debug`Saving conflict in ${e.id}; local rev ${e.rev}, remote rev ${t.rev} (was ${e.serverRev})`, e.conflict = t.deleted ? null : t.body, i |= Oo) : (e.rev = t.rev, e.body = t.body, delete e.conflict, i &= -194, t.deleted && (i |= Sr), t.hasBlobs && (i |= _n)), e.seq = r, e.serverRev = t.rev, Na(e, i), e;
  }
  /** Encrypts properties of `rev.body` and puts the ciphertext in `rev.encrypted`.
   *  - Precondition: *Codec exists* and is unlocked.
   *  - Precondition: `rev.body` contains _all_ doc properties. */
  async encryptLocalRev(e) {
    const { body: t, encrypted: r } = await p(this, tr).partlyEncrypt(e.body, p(this, En));
    e.body = t, e.encrypted = r;
  }
  /** Encrypts properties of each rev's `body` and puts the ciphertext in its `encrypted`. */
  async encryptLocalRevs(e) {
    if (p(this, tr)) {
      this.logger.info`Encrypting ${e.length} incoming revisions`;
      const t = Promise.all(e.map(async (r) => this.encryptLocalRev(r)));
      await yi.waitFor(t);
    }
  }
  /** Converts a LocalRevision read from the Table into a client Document object. */
  revToDoc(e) {
    if (e.flags) {
      if (e.flags & Sr)
        return;
      e.flags & _n && JI(e.body, this.database.blobLoader);
    }
    return new Cs(this, e.id, e.body, e.rev, e.seq).body;
  }
  //-------- Sequence & Transaction Support:
  // generates the next consecutive sequence number.
  async nextSequence() {
    return p(this, Kt) || await this.getMeta(), this._nextSequence();
  }
  /** generates the next consecutive sequence number; non-async but #meta must be loaded already */
  _nextSequence() {
    return Nn(p(this, Kt)), G(this, ei, !0), ++p(this, Kt).lastSeq;
  }
  // Returns the Collection's metadata object.
  async getMeta() {
    return Lt.currentTransaction ? (p(this, Kt) || (p(this, Zi) || G(this, Zi, this._actuallyReadMeta()), await p(this, Zi)), p(this, Kt)) : await this._readMeta();
  }
  // subroutine of getMeta(). Do not call.
  async _actuallyReadMeta() {
    G(this, Kt, await this._readMeta()), G(this, Zi, void 0), G(this, ei, !1);
  }
  /** Saves cached changes (`this.meta`) back to the db. Called by Database.inTransaction.
      @internal */
  async transactionEnding(e, t) {
    e === on && (t && p(this, ei) && p(this, Kt) && await this.metaTable.put(p(this, Kt), this.name), G(this, ei, !1), G(this, Kt, void 0));
  }
  /** Posts change notifications after a transaction is committed.
   *  Called by Database.inTransaction. @internal */
  transactionEnded(e, t) {
    e === on && (t ? this.postChangeEvent() : G(this, Kr, void 0));
  }
  // Lowest-level method to get the collection metadata.
  async _readMeta() {
    return await this.metaTable.get(this.name) ?? { lastSeq: 0 };
  }
  /** The MetaStore table. */
  get metaTable() {
    return this.db.table(No);
  }
  // Properties to leave unencrypted
};
it = new WeakMap(), Xn = new WeakMap(), Zi = new WeakMap(), Kt = new WeakMap(), ei = new WeakMap(), xn = new WeakMap(), Kr = new WeakMap(), ti = new WeakMap(), ri = new WeakMap(), tr = new WeakMap(), En = new WeakMap();
let Ts = Xa;
class nb {
  constructor(e, t = !1) {
    ve(this, "doc");
    // The document
    ve(this, "blobStatus");
    // Whether it has blobs
    ve(this, "newBody");
    // The body & maybe encrypted bits
    ve(this, "newRevID");
    // The new revision's revID
    ve(this, "newSeq");
    this.deleting = t, e instanceof Cs || (e = Kn(e)), yg(e.id), this.doc = e, t ? (this.blobStatus = 0, this.newBody = { body: {} }) : (this.blobStatus = vf(e.body), this.newBody = { body: e.body }), this.newRevID = Ba(e.revisionID, e.body, t);
  }
  /** Creates a LocalRevision object. */
  makeRevision() {
    return Ue(!this.deleting), Nn(this.newSeq, "Saving.newSeq"), {
      id: this.doc.id,
      rev: this.newRevID,
      seq: this.newSeq,
      flags: this.blobStatus ? _n : void 0,
      body: this.newBody.body,
      encrypted: this.newBody.encrypted
    };
  }
  /** Updates the revID and blob status. */
  updateFrom(e) {
    return this.newRevID = Ba(e, this.doc.body, !1), this.blobStatus = vf(this.doc.body), this.blobStatus > 1;
  }
  /** Copies my state to a `LocalRevision` read from the table. */
  updateRevision(e) {
    let t = (e.flags ?? 0) & -130;
    this.deleting && (t |= Sr), this.blobStatus > 0 && (t |= _n), e.rev = this.newRevID, e.seq = this.newSeq, Na(e, t), e.body = this.newBody.body, e.encrypted = this.newBody.encrypted;
  }
  /** After a save has committed, updates the CBLDocument's revID and sequence. */
  postSave() {
    this.newSeq !== void 0 && (this.doc._updateRev(this.newRevID, this.newSeq), this.deleting && this.doc.setBody({}));
  }
  // The new revision's sequence
}
function Na(n, e) {
  e ? n.flags = e : delete n.flags;
}
function Ns(n, e, t) {
  for (Ue(t >= 0 && t < 2147483648, "writeVarUint: number out of range"); t >= 128; )
    n[e++] = t & 255 | 128, t = t >>> 7;
  return n[e++] = t, e;
}
function ib(n) {
  const e = new Uint8Array(10), t = Ns(e, 0, n);
  return e.subarray(0, t);
}
function Pa(n, e) {
  let t = 0, r = 0;
  const i = Math.min(n.length, e + 5);
  for (; e < i; ) {
    const o = n[e++];
    if (o >= 128)
      t |= (o & 127) << r, r += 7;
    else
      return t |= o << r, [t, e];
  }
  throw Error("Invalid varint");
}
function N0(n) {
  return n.reduce((e, t) => e + t.length, 0);
}
function P0(n) {
  if (n.length === 1)
    return n[0];
  const e = new Uint8Array(N0(n));
  let t = 0;
  for (const r of n)
    e.set(r, t), t += r.length;
  return e;
}
var ds = /* @__PURE__ */ ((n) => (n[n.None = 0] = "None", n[n.Compressed = 8] = "Compressed", n[n.Urgent = 16] = "Urgent", n[n.NoReply = 32] = "NoReply", n[n.All = 56] = "All", n))(ds || {}), vn = /* @__PURE__ */ ((n) => (n[n.TypeMask = 7] = "TypeMask", n[n.MoreComing = 64] = "MoreComing", n))(vn || {}), Dr = /* @__PURE__ */ ((n) => (n[n.MSG = 0] = "MSG", n[n.RPY = 1] = "RPY", n[n.ERR = 2] = "ERR", n[n.ACKMSG = 4] = "ACKMSG", n[n.ACKRPY = 5] = "ACKRPY", n))(Dr || {});
const yf = ["MSG", "RPY", "ERR", "?3?", "ACKMSG", "ACKRPY", "?6?", "?7?"], Mc = new Uint8Array(1), Uc = new TextEncoder(), mf = new TextDecoder();
class vs {
  /** Constructs an outgoing request message.
      @param properties  An object containing key/value strings, or a string for the `Profile`
                         property.
      @param body  Either a string, a `Uint8Array`, or a JSON-compatible object.
      @param options  Some combination of `Options` flags (`Urgent`, `NoReply`, `Compressed`.) */
  constructor(e, t = "", r = 0) {
    /** The key/value properties, most importantly `Profile` which is the request type.
        These may be modified until you send the message. */
    ve(this, "properties");
    ve(this, "_flags");
    ve(this, "_number");
    ve(this, "_bodyData");
    ve(this, "_bodyString");
    ve(this, "_bodyJSON");
    this._flags = r & 56, typeof e == "string" ? this.properties = { Profile: e } : this.properties = e, typeof t == "string" ? this._bodyString = t : t instanceof Uint8Array ? this._bodyData = t : t != null ? this.bodyJSON = t : this._bodyString = "";
  }
  /** Constructs a reply to this Message.
   *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
  makeReply(e = {}, t = "", r = 0) {
    Ue(this.type === 0, "cannot reply to a reply"), Ue(this.wantsReply, "message was sent NoReply"), Ue(this._number !== void 0, "message has not been sent");
    const i = new vs(e, t);
    return i._flags = 1 | r & 24, i._number = this._number, i;
  }
  /** Constructs an error reply to this Message.
   *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
  makeErrorReply(e, t, r = "BLIP") {
    const i = this.makeReply(
      { "Error-Code": t.toString(), "Error-Domain": r },
      e
    );
    return i._flags = 2, i;
  }
  /** Constructs an error reply to this Message, from a JS Error object.
   *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
  makeReplyWithError(e) {
    let t = 502, r = "BLIP";
    e instanceof gs && (t = e.blipErrorCode, r = e.blipErrorDomain), this.makeErrorReply(e.message, t, r);
  }
  /** The value of the `Profile` property, or "" if none. */
  get profile() {
    return this.property("Profile");
  }
  /** Returns a property's value, substituting `defaultValue` if it doesn't exist. */
  property(e, t = "") {
    return (this.properties[e] || t).toString();
  }
  /** Returns the numeric value of a property, or `defaultValue` if it doesn't exist
      or isn't numeric. */
  numericProperty(e, t = 0) {
    const r = this.properties[e];
    if (r === void 0)
      return t;
    const i = Number(r);
    return Number.isNaN(i) ? t : i;
  }
  /** True if this message is a request that needs a reply. */
  get wantsReply() {
    return (this.flags & 39) === 0;
  }
  /** True if this message is a reply. */
  get isReply() {
    return this.type !== 0;
  }
  /** True if this message is an error reply. */
  get isError() {
    return this.type === 2;
  }
  /** The error from a reply. */
  get error() {
    return this.isError ? new sb(this) : void 0;
  }
  /** The message body as a string. */
  get bodyString() {
    return this._bodyString === void 0 && (this._bodyString = mf.decode(this.bodyData)), this._bodyString;
  }
  set bodyString(e) {
    this._bodyString = e, this._bodyData = void 0, this._bodyJSON = void 0;
  }
  /** The message body as parsed JSON, or `undefined` if it isn't valid JSON. */
  get bodyJSON() {
    if (this._bodyJSON === void 0) {
      if (this.bodyString.length > 0)
        try {
          this._bodyJSON = JSON.parse(this.bodyString);
        } catch {
          console.warn("!!! Couldn't parse Message body as JSON: ", this.bodyString);
        }
      this._bodyJSON === void 0 && (this._bodyJSON = {});
    }
    return this._bodyJSON;
  }
  set bodyJSON(e) {
    this._bodyString = JSON.stringify(e), this._bodyData = void 0, this._bodyJSON = void 0;
  }
  /** The message body as raw bytes, a `Uint8Array`. */
  get bodyData() {
    return this._bodyData === void 0 && (this._bodyData = Uc.encode(this.bodyString)), this._bodyData;
  }
  set bodyData(e) {
    this._bodyData = e, this._bodyString = void 0, this._bodyJSON = void 0;
  }
  /** The message body as pretty-printed JSON, or just as a string if it's not JSON. */
  get prettyString() {
    const e = this.bodyJSON;
    return e === void 0 ? this.bodyString : JSON.stringify(e, void 0, 4);
  }
  toString(e = !1) {
    let t = vs.describeFrame(this._number, this._flags);
    return t += " " + JSON.stringify(this.properties), e && (t += "«" + this.bodyString + "»"), t;
  }
  // Internals that clients probably aren't interested in:
  /** @internal */
  get type() {
    return this._flags & 7;
  }
  /** @internal */
  get typeName() {
    return yf[this.type];
  }
  /** @internal */
  get hasNumber() {
    return this._number !== void 0;
  }
  /** @internal */
  get number() {
    return Ue(this.hasNumber), this._number;
  }
  /** @internal */
  get flags() {
    return this._flags;
  }
  /** @internal  Encodes an outgoing message to binary form (which still needs to be framed) */
  encodeBinary() {
    const e = [];
    if (this.properties) {
      for (const t in this.properties)
        e.push(
          Uc.encode(t),
          Mc,
          Uc.encode(this.properties[t].toString()),
          Mc
        );
      e.unshift(ib(N0(e)));
    } else
      e.unshift(Mc);
    return e.push(this.bodyData), P0(e);
  }
  /** @internal  Returns a textual description of a frame's flags, for logging. */
  static describeFrame(e, t) {
    let r = yf[
      t & 7
      /* TypeMask */
    ];
    return e && (r += `#${e} `), r += t & 8 ? "z" : "-", r += t & 16 ? "u" : "-", r += t & 32 ? "n" : "-", r += t & 64 ? "+" : "-", r;
  }
}
class Bo extends vs {
  constructor(e, t, r, i) {
    Ue(e > 0, "invalid message number"), super(t, r), this._flags = i, this._number = e;
  }
  static makeReply(e, t = {}, r = "", i = 0) {
    return new Bo(e, t, r, 1 | i);
  }
  static makeError(e, t, r, i = "BLIP") {
    return new Bo(
      e,
      { "Error-Code": r.toString(), "Error-Domain": i },
      t,
      2
      /* ERR */
    );
  }
  static decodedFromBinary(e, t, r) {
    let [i, o] = Pa(e, 0);
    if (i += o, i > e.length)
      throw Error("Message properties length too large");
    const a = {};
    for (; o < i; ) {
      let c = e.indexOf(0, o);
      if (c < 0 || c > i)
        throw Error("Invalid message properties (no NUL)");
      const b = mf.decode(e.slice(o, c));
      if (o = c + 1, c = e.indexOf(0, o), c < 0 || c > i)
        throw Error("Invalid message properties (no NUL)");
      const m = mf.decode(e.slice(o, c));
      o = c + 1, a[b] = m;
    }
    const l = e.slice(i);
    return new Bo(r, a, l, t);
  }
}
class gs extends Error {
  constructor(t, r, i = "BLIP") {
    super(t);
    /** The error domain, a namespace for the code. */
    ve(this, "blipErrorDomain");
    /** The error code. */
    ve(this, "blipErrorCode");
    this.name = "blip.BLIPError", this.blipErrorCode = r, this.blipErrorDomain = i;
  }
  matches(t, r = "BLIP") {
    return this.blipErrorCode === t && this.blipErrorDomain === r;
  }
  toString() {
    return `${super.toString()} (${this.blipErrorDomain} ${this.blipErrorCode})`;
  }
}
class sb extends gs {
  constructor(t) {
    super(
      "Peer responded with error: " + t.bodyString,
      t.numericProperty("Error-Code"),
      t.property("Error-Domain", "BLIP")
    );
    /** The incoming BLIP error reply. */
    ve(this, "blipMessage");
    this.name = "blip.MessageError", this.blipMessage = t;
  }
}
var ni;
class ob {
  constructor() {
    ee(this, ni, /* @__PURE__ */ new Map());
  }
  addEventListener(e, t) {
    if (p(this, ni).get(e))
      throw Error(`there is already a message handler for ${e}`);
    p(this, ni).set(e, t);
  }
  removeEventListener(e, t) {
    p(this, ni).get(e) === t && p(this, ni).delete(e);
  }
  dispatchMessage(e) {
    const t = p(this, ni).get(e.profile);
    return t ? (t(e), !0) : !1;
  }
}
ni = new WeakMap();
function ab({ polynomial: n, numTables: e }) {
  const t = new Uint32Array(256 * e);
  for (let r = 0; r < 256; r++) {
    let i = r;
    i = (i & 1) * n ^ i >>> 1, i = (i & 1) * n ^ i >>> 1, i = (i & 1) * n ^ i >>> 1, i = (i & 1) * n ^ i >>> 1, i = (i & 1) * n ^ i >>> 1, i = (i & 1) * n ^ i >>> 1, i = (i & 1) * n ^ i >>> 1, i = (i & 1) * n ^ i >>> 1, t[r] = i;
  }
  for (let r = 256; r < t.length; r++) {
    const i = t[r - 256];
    t[r] = t[i & 255] ^ i >>> 8;
  }
  return t;
}
const sn = ab({ polynomial: 3988292384, numTables: 8 });
function ub() {
  return -1;
}
function lb(n, e) {
  const t = e.byteLength, r = new DataView(e.buffer, e.byteOffset, t);
  let i = n, o = 0;
  const a = -r.byteOffset & 3;
  for (; o < a && o < t; o++)
    i = sn[(i ^ r.getUint8(o)) & 255] ^ i >>> 8;
  if (o === t)
    return i;
  o = a;
  let l = t - o;
  for (; l >= 8; o += 8, l -= 8) {
    i ^= r.getUint32(o, !0);
    const c = r.getUint32(o + 4, !0);
    i = sn[0 * 256 + (c >>> 24 & 255)] ^ sn[1 * 256 + (c >>> 16 & 255)] ^ sn[2 * 256 + (c >>> 8 & 255)] ^ sn[3 * 256 + (c >>> 0 & 255)] ^ sn[4 * 256 + (i >>> 24 & 255)] ^ sn[5 * 256 + (i >>> 16 & 255)] ^ sn[6 * 256 + (i >>> 8 & 255)] ^ sn[7 * 256 + (i >>> 0 & 255)];
  }
  for (let c = o; c < t; c++)
    i = sn[(i ^ r.getUint8(c)) & 255] ^ i >>> 8;
  return i;
}
function cb(n) {
  return (n ^ -1) >>> 0;
}
var $c = {}, Nv;
function Ai() {
  return Nv || (Nv = 1, function(n) {
    var e = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
    function t(o, a) {
      return Object.prototype.hasOwnProperty.call(o, a);
    }
    n.assign = function(o) {
      for (var a = Array.prototype.slice.call(arguments, 1); a.length; ) {
        var l = a.shift();
        if (l) {
          if (typeof l != "object")
            throw new TypeError(l + "must be non-object");
          for (var c in l)
            t(l, c) && (o[c] = l[c]);
        }
      }
      return o;
    }, n.shrinkBuf = function(o, a) {
      return o.length === a ? o : o.subarray ? o.subarray(0, a) : (o.length = a, o);
    };
    var r = {
      arraySet: function(o, a, l, c, b) {
        if (a.subarray && o.subarray) {
          o.set(a.subarray(l, l + c), b);
          return;
        }
        for (var m = 0; m < c; m++)
          o[b + m] = a[l + m];
      },
      // Join array of chunks to single array.
      flattenChunks: function(o) {
        var a, l, c, b, m, w;
        for (c = 0, a = 0, l = o.length; a < l; a++)
          c += o[a].length;
        for (w = new Uint8Array(c), b = 0, a = 0, l = o.length; a < l; a++)
          m = o[a], w.set(m, b), b += m.length;
        return w;
      }
    }, i = {
      arraySet: function(o, a, l, c, b) {
        for (var m = 0; m < c; m++)
          o[b + m] = a[l + m];
      },
      // Join array of chunks to single array.
      flattenChunks: function(o) {
        return [].concat.apply([], o);
      }
    };
    n.setTyped = function(o) {
      o ? (n.Buf8 = Uint8Array, n.Buf16 = Uint16Array, n.Buf32 = Int32Array, n.assign(n, r)) : (n.Buf8 = Array, n.Buf16 = Array, n.Buf32 = Array, n.assign(n, i));
    }, n.setTyped(e);
  }($c)), $c;
}
var As = {}, Hr = {}, Pi = {}, Pv;
function fb() {
  if (Pv) return Pi;
  Pv = 1;
  var n = Ai(), e = 4, t = 0, r = 1, i = 2;
  function o(y) {
    for (var T = y.length; --T >= 0; )
      y[T] = 0;
  }
  var a = 0, l = 1, c = 2, b = 3, m = 258, w = 29, x = 256, k = x + 1 + w, D = 30, K = 19, C = 2 * k + 1, M = 15, J = 16, X = 7, le = 256, ce = 16, fe = 17, oe = 18, ke = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), De = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), Ce = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), $e = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Be = 512, Se = new Array((k + 2) * 2);
  o(Se);
  var Me = new Array(D * 2);
  o(Me);
  var ot = new Array(Be);
  o(ot);
  var vt = new Array(m - b + 1);
  o(vt);
  var we = new Array(w);
  o(we);
  var He = new Array(D);
  o(He);
  function Ke(y, T, L, ue, B) {
    this.static_tree = y, this.extra_bits = T, this.extra_base = L, this.elems = ue, this.max_length = B, this.has_stree = y && y.length;
  }
  var It, Ve, Xe;
  function Ze(y, T) {
    this.dyn_tree = y, this.max_code = 0, this.stat_desc = T;
  }
  function wt(y) {
    return y < 256 ? ot[y] : ot[256 + (y >>> 7)];
  }
  function gt(y, T) {
    y.pending_buf[y.pending++] = T & 255, y.pending_buf[y.pending++] = T >>> 8 & 255;
  }
  function We(y, T, L) {
    y.bi_valid > J - L ? (y.bi_buf |= T << y.bi_valid & 65535, gt(y, y.bi_buf), y.bi_buf = T >> J - y.bi_valid, y.bi_valid += L - J) : (y.bi_buf |= T << y.bi_valid & 65535, y.bi_valid += L);
  }
  function lt(y, T, L) {
    We(
      y,
      L[T * 2],
      L[T * 2 + 1]
      /*.Len*/
    );
  }
  function Pe(y, T) {
    var L = 0;
    do
      L |= y & 1, y >>>= 1, L <<= 1;
    while (--T > 0);
    return L >>> 1;
  }
  function he(y) {
    y.bi_valid === 16 ? (gt(y, y.bi_buf), y.bi_buf = 0, y.bi_valid = 0) : y.bi_valid >= 8 && (y.pending_buf[y.pending++] = y.bi_buf & 255, y.bi_buf >>= 8, y.bi_valid -= 8);
  }
  function Fe(y, T) {
    var L = T.dyn_tree, ue = T.max_code, B = T.stat_desc.static_tree, q = T.stat_desc.has_stree, _ = T.stat_desc.extra_bits, se = T.stat_desc.extra_base, Ne = T.stat_desc.max_length, f, te, ie, A, F, Z, Oe = 0;
    for (A = 0; A <= M; A++)
      y.bl_count[A] = 0;
    for (L[y.heap[y.heap_max] * 2 + 1] = 0, f = y.heap_max + 1; f < C; f++)
      te = y.heap[f], A = L[L[te * 2 + 1] * 2 + 1] + 1, A > Ne && (A = Ne, Oe++), L[te * 2 + 1] = A, !(te > ue) && (y.bl_count[A]++, F = 0, te >= se && (F = _[te - se]), Z = L[te * 2], y.opt_len += Z * (A + F), q && (y.static_len += Z * (B[te * 2 + 1] + F)));
    if (Oe !== 0) {
      do {
        for (A = Ne - 1; y.bl_count[A] === 0; )
          A--;
        y.bl_count[A]--, y.bl_count[A + 1] += 2, y.bl_count[Ne]--, Oe -= 2;
      } while (Oe > 0);
      for (A = Ne; A !== 0; A--)
        for (te = y.bl_count[A]; te !== 0; )
          ie = y.heap[--f], !(ie > ue) && (L[ie * 2 + 1] !== A && (y.opt_len += (A - L[ie * 2 + 1]) * L[ie * 2], L[ie * 2 + 1] = A), te--);
    }
  }
  function et(y, T, L) {
    var ue = new Array(M + 1), B = 0, q, _;
    for (q = 1; q <= M; q++)
      ue[q] = B = B + L[q - 1] << 1;
    for (_ = 0; _ <= T; _++) {
      var se = y[_ * 2 + 1];
      se !== 0 && (y[_ * 2] = Pe(ue[se]++, se));
    }
  }
  function me() {
    var y, T, L, ue, B, q = new Array(M + 1);
    for (L = 0, ue = 0; ue < w - 1; ue++)
      for (we[ue] = L, y = 0; y < 1 << ke[ue]; y++)
        vt[L++] = ue;
    for (vt[L - 1] = ue, B = 0, ue = 0; ue < 16; ue++)
      for (He[ue] = B, y = 0; y < 1 << De[ue]; y++)
        ot[B++] = ue;
    for (B >>= 7; ue < D; ue++)
      for (He[ue] = B << 7, y = 0; y < 1 << De[ue] - 7; y++)
        ot[256 + B++] = ue;
    for (T = 0; T <= M; T++)
      q[T] = 0;
    for (y = 0; y <= 143; )
      Se[y * 2 + 1] = 8, y++, q[8]++;
    for (; y <= 255; )
      Se[y * 2 + 1] = 9, y++, q[9]++;
    for (; y <= 279; )
      Se[y * 2 + 1] = 7, y++, q[7]++;
    for (; y <= 287; )
      Se[y * 2 + 1] = 8, y++, q[8]++;
    for (et(Se, k + 1, q), y = 0; y < D; y++)
      Me[y * 2 + 1] = 5, Me[y * 2] = Pe(y, 5);
    It = new Ke(Se, ke, x + 1, k, M), Ve = new Ke(Me, De, 0, D, M), Xe = new Ke(new Array(0), Ce, 0, K, X);
  }
  function je(y) {
    var T;
    for (T = 0; T < k; T++)
      y.dyn_ltree[T * 2] = 0;
    for (T = 0; T < D; T++)
      y.dyn_dtree[T * 2] = 0;
    for (T = 0; T < K; T++)
      y.bl_tree[T * 2] = 0;
    y.dyn_ltree[le * 2] = 1, y.opt_len = y.static_len = 0, y.last_lit = y.matches = 0;
  }
  function yt(y) {
    y.bi_valid > 8 ? gt(y, y.bi_buf) : y.bi_valid > 0 && (y.pending_buf[y.pending++] = y.bi_buf), y.bi_buf = 0, y.bi_valid = 0;
  }
  function ht(y, T, L, ue) {
    yt(y), gt(y, L), gt(y, ~L), n.arraySet(y.pending_buf, y.window, T, L, y.pending), y.pending += L;
  }
  function ct(y, T, L, ue) {
    var B = T * 2, q = L * 2;
    return y[B] < y[q] || y[B] === y[q] && ue[T] <= ue[L];
  }
  function st(y, T, L) {
    for (var ue = y.heap[L], B = L << 1; B <= y.heap_len && (B < y.heap_len && ct(T, y.heap[B + 1], y.heap[B], y.depth) && B++, !ct(T, ue, y.heap[B], y.depth)); )
      y.heap[L] = y.heap[B], L = B, B <<= 1;
    y.heap[L] = ue;
  }
  function Le(y, T, L) {
    var ue, B, q = 0, _, se;
    if (y.last_lit !== 0)
      do
        ue = y.pending_buf[y.d_buf + q * 2] << 8 | y.pending_buf[y.d_buf + q * 2 + 1], B = y.pending_buf[y.l_buf + q], q++, ue === 0 ? lt(y, B, T) : (_ = vt[B], lt(y, _ + x + 1, T), se = ke[_], se !== 0 && (B -= we[_], We(y, B, se)), ue--, _ = wt(ue), lt(y, _, L), se = De[_], se !== 0 && (ue -= He[_], We(y, ue, se)));
      while (q < y.last_lit);
    lt(y, le, T);
  }
  function kt(y, T) {
    var L = T.dyn_tree, ue = T.stat_desc.static_tree, B = T.stat_desc.has_stree, q = T.stat_desc.elems, _, se, Ne = -1, f;
    for (y.heap_len = 0, y.heap_max = C, _ = 0; _ < q; _++)
      L[_ * 2] !== 0 ? (y.heap[++y.heap_len] = Ne = _, y.depth[_] = 0) : L[_ * 2 + 1] = 0;
    for (; y.heap_len < 2; )
      f = y.heap[++y.heap_len] = Ne < 2 ? ++Ne : 0, L[f * 2] = 1, y.depth[f] = 0, y.opt_len--, B && (y.static_len -= ue[f * 2 + 1]);
    for (T.max_code = Ne, _ = y.heap_len >> 1; _ >= 1; _--)
      st(y, L, _);
    f = q;
    do
      _ = y.heap[
        1
        /*SMALLEST*/
      ], y.heap[
        1
        /*SMALLEST*/
      ] = y.heap[y.heap_len--], st(
        y,
        L,
        1
        /*SMALLEST*/
      ), se = y.heap[
        1
        /*SMALLEST*/
      ], y.heap[--y.heap_max] = _, y.heap[--y.heap_max] = se, L[f * 2] = L[_ * 2] + L[se * 2], y.depth[f] = (y.depth[_] >= y.depth[se] ? y.depth[_] : y.depth[se]) + 1, L[_ * 2 + 1] = L[se * 2 + 1] = f, y.heap[
        1
        /*SMALLEST*/
      ] = f++, st(
        y,
        L,
        1
        /*SMALLEST*/
      );
    while (y.heap_len >= 2);
    y.heap[--y.heap_max] = y.heap[
      1
      /*SMALLEST*/
    ], Fe(y, T), et(L, Ne, y.bl_count);
  }
  function Ot(y, T, L) {
    var ue, B = -1, q, _ = T[0 * 2 + 1], se = 0, Ne = 7, f = 4;
    for (_ === 0 && (Ne = 138, f = 3), T[(L + 1) * 2 + 1] = 65535, ue = 0; ue <= L; ue++)
      q = _, _ = T[(ue + 1) * 2 + 1], !(++se < Ne && q === _) && (se < f ? y.bl_tree[q * 2] += se : q !== 0 ? (q !== B && y.bl_tree[q * 2]++, y.bl_tree[ce * 2]++) : se <= 10 ? y.bl_tree[fe * 2]++ : y.bl_tree[oe * 2]++, se = 0, B = q, _ === 0 ? (Ne = 138, f = 3) : q === _ ? (Ne = 6, f = 3) : (Ne = 7, f = 4));
  }
  function qe(y, T, L) {
    var ue, B = -1, q, _ = T[0 * 2 + 1], se = 0, Ne = 7, f = 4;
    for (_ === 0 && (Ne = 138, f = 3), ue = 0; ue <= L; ue++)
      if (q = _, _ = T[(ue + 1) * 2 + 1], !(++se < Ne && q === _)) {
        if (se < f)
          do
            lt(y, q, y.bl_tree);
          while (--se !== 0);
        else q !== 0 ? (q !== B && (lt(y, q, y.bl_tree), se--), lt(y, ce, y.bl_tree), We(y, se - 3, 2)) : se <= 10 ? (lt(y, fe, y.bl_tree), We(y, se - 3, 3)) : (lt(y, oe, y.bl_tree), We(y, se - 11, 7));
        se = 0, B = q, _ === 0 ? (Ne = 138, f = 3) : q === _ ? (Ne = 6, f = 3) : (Ne = 7, f = 4);
      }
  }
  function Qe(y) {
    var T;
    for (Ot(y, y.dyn_ltree, y.l_desc.max_code), Ot(y, y.dyn_dtree, y.d_desc.max_code), kt(y, y.bl_desc), T = K - 1; T >= 3 && y.bl_tree[$e[T] * 2 + 1] === 0; T--)
      ;
    return y.opt_len += 3 * (T + 1) + 5 + 5 + 4, T;
  }
  function Et(y, T, L, ue) {
    var B;
    for (We(y, T - 257, 5), We(y, L - 1, 5), We(y, ue - 4, 4), B = 0; B < ue; B++)
      We(y, y.bl_tree[$e[B] * 2 + 1], 3);
    qe(y, y.dyn_ltree, T - 1), qe(y, y.dyn_dtree, L - 1);
  }
  function Ft(y) {
    var T = 4093624447, L;
    for (L = 0; L <= 31; L++, T >>>= 1)
      if (T & 1 && y.dyn_ltree[L * 2] !== 0)
        return t;
    if (y.dyn_ltree[9 * 2] !== 0 || y.dyn_ltree[10 * 2] !== 0 || y.dyn_ltree[13 * 2] !== 0)
      return r;
    for (L = 32; L < x; L++)
      if (y.dyn_ltree[L * 2] !== 0)
        return r;
    return t;
  }
  var _t = !1;
  function Jt(y) {
    _t || (me(), _t = !0), y.l_desc = new Ze(y.dyn_ltree, It), y.d_desc = new Ze(y.dyn_dtree, Ve), y.bl_desc = new Ze(y.bl_tree, Xe), y.bi_buf = 0, y.bi_valid = 0, je(y);
  }
  function S(y, T, L, ue) {
    We(y, (a << 1) + (ue ? 1 : 0), 3), ht(y, T, L);
  }
  function d(y) {
    We(y, l << 1, 3), lt(y, le, Se), he(y);
  }
  function v(y, T, L, ue) {
    var B, q, _ = 0;
    y.level > 0 ? (y.strm.data_type === i && (y.strm.data_type = Ft(y)), kt(y, y.l_desc), kt(y, y.d_desc), _ = Qe(y), B = y.opt_len + 3 + 7 >>> 3, q = y.static_len + 3 + 7 >>> 3, q <= B && (B = q)) : B = q = L + 5, L + 4 <= B && T !== -1 ? S(y, T, L, ue) : y.strategy === e || q === B ? (We(y, (l << 1) + (ue ? 1 : 0), 3), Le(y, Se, Me)) : (We(y, (c << 1) + (ue ? 1 : 0), 3), Et(y, y.l_desc.max_code + 1, y.d_desc.max_code + 1, _ + 1), Le(y, y.dyn_ltree, y.dyn_dtree)), je(y), ue && yt(y);
  }
  function R(y, T, L) {
    return y.pending_buf[y.d_buf + y.last_lit * 2] = T >>> 8 & 255, y.pending_buf[y.d_buf + y.last_lit * 2 + 1] = T & 255, y.pending_buf[y.l_buf + y.last_lit] = L & 255, y.last_lit++, T === 0 ? y.dyn_ltree[L * 2]++ : (y.matches++, T--, y.dyn_ltree[(vt[L] + x + 1) * 2]++, y.dyn_dtree[wt(T) * 2]++), y.last_lit === y.lit_bufsize - 1;
  }
  return Pi._tr_init = Jt, Pi._tr_stored_block = S, Pi._tr_flush_block = v, Pi._tr_tally = R, Pi._tr_align = d, Pi;
}
var jc, Dv;
function D0() {
  if (Dv) return jc;
  Dv = 1;
  function n(e, t, r, i) {
    for (var o = e & 65535 | 0, a = e >>> 16 & 65535 | 0, l = 0; r !== 0; ) {
      l = r > 2e3 ? 2e3 : r, r -= l;
      do
        o = o + t[i++] | 0, a = a + o | 0;
      while (--l);
      o %= 65521, a %= 65521;
    }
    return o | a << 16 | 0;
  }
  return jc = n, jc;
}
var Kc, Bv;
function B0() {
  if (Bv) return Kc;
  Bv = 1;
  function n() {
    for (var r, i = [], o = 0; o < 256; o++) {
      r = o;
      for (var a = 0; a < 8; a++)
        r = r & 1 ? 3988292384 ^ r >>> 1 : r >>> 1;
      i[o] = r;
    }
    return i;
  }
  var e = n();
  function t(r, i, o, a) {
    var l = e, c = a + o;
    r ^= -1;
    for (var b = a; b < c; b++)
      r = r >>> 8 ^ l[(r ^ i[b]) & 255];
    return r ^ -1;
  }
  return Kc = t, Kc;
}
var zc, Fv;
function ah() {
  return Fv || (Fv = 1, zc = {
    2: "need dictionary",
    /* Z_NEED_DICT       2  */
    1: "stream end",
    /* Z_STREAM_END      1  */
    0: "",
    /* Z_OK              0  */
    "-1": "file error",
    /* Z_ERRNO         (-1) */
    "-2": "stream error",
    /* Z_STREAM_ERROR  (-2) */
    "-3": "data error",
    /* Z_DATA_ERROR    (-3) */
    "-4": "insufficient memory",
    /* Z_MEM_ERROR     (-4) */
    "-5": "buffer error",
    /* Z_BUF_ERROR     (-5) */
    "-6": "incompatible version"
    /* Z_VERSION_ERROR (-6) */
  }), zc;
}
var Lv;
function hb() {
  if (Lv) return Hr;
  Lv = 1;
  var n = Ai(), e = fb(), t = D0(), r = B0(), i = ah(), o = 0, a = 1, l = 3, c = 4, b = 5, m = 0, w = 1, x = -2, k = -3, D = -5, K = -1, C = 1, M = 2, J = 3, X = 4, le = 0, ce = 2, fe = 8, oe = 9, ke = 15, De = 8, Ce = 29, $e = 256, Be = $e + 1 + Ce, Se = 30, Me = 19, ot = 2 * Be + 1, vt = 15, we = 3, He = 258, Ke = He + we + 1, It = 32, Ve = 42, Xe = 69, Ze = 73, wt = 91, gt = 103, We = 113, lt = 666, Pe = 1, he = 2, Fe = 3, et = 4, me = 3;
  function je(f, te) {
    return f.msg = i[te], te;
  }
  function yt(f) {
    return (f << 1) - (f > 4 ? 9 : 0);
  }
  function ht(f) {
    for (var te = f.length; --te >= 0; )
      f[te] = 0;
  }
  function ct(f) {
    var te = f.state, ie = te.pending;
    ie > f.avail_out && (ie = f.avail_out), ie !== 0 && (n.arraySet(f.output, te.pending_buf, te.pending_out, ie, f.next_out), f.next_out += ie, te.pending_out += ie, f.total_out += ie, f.avail_out -= ie, te.pending -= ie, te.pending === 0 && (te.pending_out = 0));
  }
  function st(f, te) {
    e._tr_flush_block(f, f.block_start >= 0 ? f.block_start : -1, f.strstart - f.block_start, te), f.block_start = f.strstart, ct(f.strm);
  }
  function Le(f, te) {
    f.pending_buf[f.pending++] = te;
  }
  function kt(f, te) {
    f.pending_buf[f.pending++] = te >>> 8 & 255, f.pending_buf[f.pending++] = te & 255;
  }
  function Ot(f, te, ie, A) {
    var F = f.avail_in;
    return F > A && (F = A), F === 0 ? 0 : (f.avail_in -= F, n.arraySet(te, f.input, f.next_in, F, ie), f.state.wrap === 1 ? f.adler = t(f.adler, te, F, ie) : f.state.wrap === 2 && (f.adler = r(f.adler, te, F, ie)), f.next_in += F, f.total_in += F, F);
  }
  function qe(f, te) {
    var ie = f.max_chain_length, A = f.strstart, F, Z, Oe = f.prev_length, Ee = f.nice_match, xe = f.strstart > f.w_size - Ke ? f.strstart - (f.w_size - Ke) : 0, Je = f.window, Rr = f.w_mask, bt = f.prev, Te = f.strstart + He, tt = Je[A + Oe - 1], Ut = Je[A + Oe];
    f.prev_length >= f.good_match && (ie >>= 2), Ee > f.lookahead && (Ee = f.lookahead);
    do
      if (F = te, !(Je[F + Oe] !== Ut || Je[F + Oe - 1] !== tt || Je[F] !== Je[A] || Je[++F] !== Je[A + 1])) {
        A += 2, F++;
        do
          ;
        while (Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && A < Te);
        if (Z = He - (Te - A), A = Te - He, Z > Oe) {
          if (f.match_start = te, Oe = Z, Z >= Ee)
            break;
          tt = Je[A + Oe - 1], Ut = Je[A + Oe];
        }
      }
    while ((te = bt[te & Rr]) > xe && --ie !== 0);
    return Oe <= f.lookahead ? Oe : f.lookahead;
  }
  function Qe(f) {
    var te = f.w_size, ie, A, F, Z, Oe;
    do {
      if (Z = f.window_size - f.lookahead - f.strstart, f.strstart >= te + (te - Ke)) {
        n.arraySet(f.window, f.window, te, te, 0), f.match_start -= te, f.strstart -= te, f.block_start -= te, A = f.hash_size, ie = A;
        do
          F = f.head[--ie], f.head[ie] = F >= te ? F - te : 0;
        while (--A);
        A = te, ie = A;
        do
          F = f.prev[--ie], f.prev[ie] = F >= te ? F - te : 0;
        while (--A);
        Z += te;
      }
      if (f.strm.avail_in === 0)
        break;
      if (A = Ot(f.strm, f.window, f.strstart + f.lookahead, Z), f.lookahead += A, f.lookahead + f.insert >= we)
        for (Oe = f.strstart - f.insert, f.ins_h = f.window[Oe], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[Oe + 1]) & f.hash_mask; f.insert && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[Oe + we - 1]) & f.hash_mask, f.prev[Oe & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = Oe, Oe++, f.insert--, !(f.lookahead + f.insert < we)); )
          ;
    } while (f.lookahead < Ke && f.strm.avail_in !== 0);
  }
  function Et(f, te) {
    var ie = 65535;
    for (ie > f.pending_buf_size - 5 && (ie = f.pending_buf_size - 5); ; ) {
      if (f.lookahead <= 1) {
        if (Qe(f), f.lookahead === 0 && te === o)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      f.strstart += f.lookahead, f.lookahead = 0;
      var A = f.block_start + ie;
      if ((f.strstart === 0 || f.strstart >= A) && (f.lookahead = f.strstart - A, f.strstart = A, st(f, !1), f.strm.avail_out === 0) || f.strstart - f.block_start >= f.w_size - Ke && (st(f, !1), f.strm.avail_out === 0))
        return Pe;
    }
    return f.insert = 0, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Fe : et) : (f.strstart > f.block_start && (st(f, !1), f.strm.avail_out === 0), Pe);
  }
  function Ft(f, te) {
    for (var ie, A; ; ) {
      if (f.lookahead < Ke) {
        if (Qe(f), f.lookahead < Ke && te === o)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      if (ie = 0, f.lookahead >= we && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ie = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), ie !== 0 && f.strstart - ie <= f.w_size - Ke && (f.match_length = qe(f, ie)), f.match_length >= we)
        if (A = e._tr_tally(f, f.strstart - f.match_start, f.match_length - we), f.lookahead -= f.match_length, f.match_length <= f.max_lazy_match && f.lookahead >= we) {
          f.match_length--;
          do
            f.strstart++, f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ie = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart;
          while (--f.match_length !== 0);
          f.strstart++;
        } else
          f.strstart += f.match_length, f.match_length = 0, f.ins_h = f.window[f.strstart], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + 1]) & f.hash_mask;
      else
        A = e._tr_tally(f, 0, f.window[f.strstart]), f.lookahead--, f.strstart++;
      if (A && (st(f, !1), f.strm.avail_out === 0))
        return Pe;
    }
    return f.insert = f.strstart < we - 1 ? f.strstart : we - 1, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Fe : et) : f.last_lit && (st(f, !1), f.strm.avail_out === 0) ? Pe : he;
  }
  function _t(f, te) {
    for (var ie, A, F; ; ) {
      if (f.lookahead < Ke) {
        if (Qe(f), f.lookahead < Ke && te === o)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      if (ie = 0, f.lookahead >= we && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ie = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), f.prev_length = f.match_length, f.prev_match = f.match_start, f.match_length = we - 1, ie !== 0 && f.prev_length < f.max_lazy_match && f.strstart - ie <= f.w_size - Ke && (f.match_length = qe(f, ie), f.match_length <= 5 && (f.strategy === C || f.match_length === we && f.strstart - f.match_start > 4096) && (f.match_length = we - 1)), f.prev_length >= we && f.match_length <= f.prev_length) {
        F = f.strstart + f.lookahead - we, A = e._tr_tally(f, f.strstart - 1 - f.prev_match, f.prev_length - we), f.lookahead -= f.prev_length - 1, f.prev_length -= 2;
        do
          ++f.strstart <= F && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ie = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart);
        while (--f.prev_length !== 0);
        if (f.match_available = 0, f.match_length = we - 1, f.strstart++, A && (st(f, !1), f.strm.avail_out === 0))
          return Pe;
      } else if (f.match_available) {
        if (A = e._tr_tally(f, 0, f.window[f.strstart - 1]), A && st(f, !1), f.strstart++, f.lookahead--, f.strm.avail_out === 0)
          return Pe;
      } else
        f.match_available = 1, f.strstart++, f.lookahead--;
    }
    return f.match_available && (A = e._tr_tally(f, 0, f.window[f.strstart - 1]), f.match_available = 0), f.insert = f.strstart < we - 1 ? f.strstart : we - 1, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Fe : et) : f.last_lit && (st(f, !1), f.strm.avail_out === 0) ? Pe : he;
  }
  function Jt(f, te) {
    for (var ie, A, F, Z, Oe = f.window; ; ) {
      if (f.lookahead <= He) {
        if (Qe(f), f.lookahead <= He && te === o)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      if (f.match_length = 0, f.lookahead >= we && f.strstart > 0 && (F = f.strstart - 1, A = Oe[F], A === Oe[++F] && A === Oe[++F] && A === Oe[++F])) {
        Z = f.strstart + He;
        do
          ;
        while (A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && F < Z);
        f.match_length = He - (Z - F), f.match_length > f.lookahead && (f.match_length = f.lookahead);
      }
      if (f.match_length >= we ? (ie = e._tr_tally(f, 1, f.match_length - we), f.lookahead -= f.match_length, f.strstart += f.match_length, f.match_length = 0) : (ie = e._tr_tally(f, 0, f.window[f.strstart]), f.lookahead--, f.strstart++), ie && (st(f, !1), f.strm.avail_out === 0))
        return Pe;
    }
    return f.insert = 0, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Fe : et) : f.last_lit && (st(f, !1), f.strm.avail_out === 0) ? Pe : he;
  }
  function S(f, te) {
    for (var ie; ; ) {
      if (f.lookahead === 0 && (Qe(f), f.lookahead === 0)) {
        if (te === o)
          return Pe;
        break;
      }
      if (f.match_length = 0, ie = e._tr_tally(f, 0, f.window[f.strstart]), f.lookahead--, f.strstart++, ie && (st(f, !1), f.strm.avail_out === 0))
        return Pe;
    }
    return f.insert = 0, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Fe : et) : f.last_lit && (st(f, !1), f.strm.avail_out === 0) ? Pe : he;
  }
  function d(f, te, ie, A, F) {
    this.good_length = f, this.max_lazy = te, this.nice_length = ie, this.max_chain = A, this.func = F;
  }
  var v;
  v = [
    /*      good lazy nice chain */
    new d(0, 0, 0, 0, Et),
    /* 0 store only */
    new d(4, 4, 8, 4, Ft),
    /* 1 max speed, no lazy matches */
    new d(4, 5, 16, 8, Ft),
    /* 2 */
    new d(4, 6, 32, 32, Ft),
    /* 3 */
    new d(4, 4, 16, 16, _t),
    /* 4 lazy matches */
    new d(8, 16, 32, 32, _t),
    /* 5 */
    new d(8, 16, 128, 128, _t),
    /* 6 */
    new d(8, 32, 128, 256, _t),
    /* 7 */
    new d(32, 128, 258, 1024, _t),
    /* 8 */
    new d(32, 258, 258, 4096, _t)
    /* 9 max compression */
  ];
  function R(f) {
    f.window_size = 2 * f.w_size, ht(f.head), f.max_lazy_match = v[f.level].max_lazy, f.good_match = v[f.level].good_length, f.nice_match = v[f.level].nice_length, f.max_chain_length = v[f.level].max_chain, f.strstart = 0, f.block_start = 0, f.lookahead = 0, f.insert = 0, f.match_length = f.prev_length = we - 1, f.match_available = 0, f.ins_h = 0;
  }
  function y() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = fe, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(ot * 2), this.dyn_dtree = new n.Buf16((2 * Se + 1) * 2), this.bl_tree = new n.Buf16((2 * Me + 1) * 2), ht(this.dyn_ltree), ht(this.dyn_dtree), ht(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16(vt + 1), this.heap = new n.Buf16(2 * Be + 1), ht(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(2 * Be + 1), ht(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function T(f) {
    var te;
    return !f || !f.state ? je(f, x) : (f.total_in = f.total_out = 0, f.data_type = ce, te = f.state, te.pending = 0, te.pending_out = 0, te.wrap < 0 && (te.wrap = -te.wrap), te.status = te.wrap ? Ve : We, f.adler = te.wrap === 2 ? 0 : 1, te.last_flush = o, e._tr_init(te), m);
  }
  function L(f) {
    var te = T(f);
    return te === m && R(f.state), te;
  }
  function ue(f, te) {
    return !f || !f.state || f.state.wrap !== 2 ? x : (f.state.gzhead = te, m);
  }
  function B(f, te, ie, A, F, Z) {
    if (!f)
      return x;
    var Oe = 1;
    if (te === K && (te = 6), A < 0 ? (Oe = 0, A = -A) : A > 15 && (Oe = 2, A -= 16), F < 1 || F > oe || ie !== fe || A < 8 || A > 15 || te < 0 || te > 9 || Z < 0 || Z > X)
      return je(f, x);
    A === 8 && (A = 9);
    var Ee = new y();
    return f.state = Ee, Ee.strm = f, Ee.wrap = Oe, Ee.gzhead = null, Ee.w_bits = A, Ee.w_size = 1 << Ee.w_bits, Ee.w_mask = Ee.w_size - 1, Ee.hash_bits = F + 7, Ee.hash_size = 1 << Ee.hash_bits, Ee.hash_mask = Ee.hash_size - 1, Ee.hash_shift = ~~((Ee.hash_bits + we - 1) / we), Ee.window = new n.Buf8(Ee.w_size * 2), Ee.head = new n.Buf16(Ee.hash_size), Ee.prev = new n.Buf16(Ee.w_size), Ee.lit_bufsize = 1 << F + 6, Ee.pending_buf_size = Ee.lit_bufsize * 4, Ee.pending_buf = new n.Buf8(Ee.pending_buf_size), Ee.d_buf = 1 * Ee.lit_bufsize, Ee.l_buf = 3 * Ee.lit_bufsize, Ee.level = te, Ee.strategy = Z, Ee.method = ie, L(f);
  }
  function q(f, te) {
    return B(f, te, fe, ke, De, le);
  }
  function _(f, te) {
    var ie, A, F, Z;
    if (!f || !f.state || te > b || te < 0)
      return f ? je(f, x) : x;
    if (A = f.state, !f.output || !f.input && f.avail_in !== 0 || A.status === lt && te !== c)
      return je(f, f.avail_out === 0 ? D : x);
    if (A.strm = f, ie = A.last_flush, A.last_flush = te, A.status === Ve)
      if (A.wrap === 2)
        f.adler = 0, Le(A, 31), Le(A, 139), Le(A, 8), A.gzhead ? (Le(
          A,
          (A.gzhead.text ? 1 : 0) + (A.gzhead.hcrc ? 2 : 0) + (A.gzhead.extra ? 4 : 0) + (A.gzhead.name ? 8 : 0) + (A.gzhead.comment ? 16 : 0)
        ), Le(A, A.gzhead.time & 255), Le(A, A.gzhead.time >> 8 & 255), Le(A, A.gzhead.time >> 16 & 255), Le(A, A.gzhead.time >> 24 & 255), Le(A, A.level === 9 ? 2 : A.strategy >= M || A.level < 2 ? 4 : 0), Le(A, A.gzhead.os & 255), A.gzhead.extra && A.gzhead.extra.length && (Le(A, A.gzhead.extra.length & 255), Le(A, A.gzhead.extra.length >> 8 & 255)), A.gzhead.hcrc && (f.adler = r(f.adler, A.pending_buf, A.pending, 0)), A.gzindex = 0, A.status = Xe) : (Le(A, 0), Le(A, 0), Le(A, 0), Le(A, 0), Le(A, 0), Le(A, A.level === 9 ? 2 : A.strategy >= M || A.level < 2 ? 4 : 0), Le(A, me), A.status = We);
      else {
        var Oe = fe + (A.w_bits - 8 << 4) << 8, Ee = -1;
        A.strategy >= M || A.level < 2 ? Ee = 0 : A.level < 6 ? Ee = 1 : A.level === 6 ? Ee = 2 : Ee = 3, Oe |= Ee << 6, A.strstart !== 0 && (Oe |= It), Oe += 31 - Oe % 31, A.status = We, kt(A, Oe), A.strstart !== 0 && (kt(A, f.adler >>> 16), kt(A, f.adler & 65535)), f.adler = 1;
      }
    if (A.status === Xe)
      if (A.gzhead.extra) {
        for (F = A.pending; A.gzindex < (A.gzhead.extra.length & 65535) && !(A.pending === A.pending_buf_size && (A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), ct(f), F = A.pending, A.pending === A.pending_buf_size)); )
          Le(A, A.gzhead.extra[A.gzindex] & 255), A.gzindex++;
        A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), A.gzindex === A.gzhead.extra.length && (A.gzindex = 0, A.status = Ze);
      } else
        A.status = Ze;
    if (A.status === Ze)
      if (A.gzhead.name) {
        F = A.pending;
        do {
          if (A.pending === A.pending_buf_size && (A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), ct(f), F = A.pending, A.pending === A.pending_buf_size)) {
            Z = 1;
            break;
          }
          A.gzindex < A.gzhead.name.length ? Z = A.gzhead.name.charCodeAt(A.gzindex++) & 255 : Z = 0, Le(A, Z);
        } while (Z !== 0);
        A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), Z === 0 && (A.gzindex = 0, A.status = wt);
      } else
        A.status = wt;
    if (A.status === wt)
      if (A.gzhead.comment) {
        F = A.pending;
        do {
          if (A.pending === A.pending_buf_size && (A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), ct(f), F = A.pending, A.pending === A.pending_buf_size)) {
            Z = 1;
            break;
          }
          A.gzindex < A.gzhead.comment.length ? Z = A.gzhead.comment.charCodeAt(A.gzindex++) & 255 : Z = 0, Le(A, Z);
        } while (Z !== 0);
        A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), Z === 0 && (A.status = gt);
      } else
        A.status = gt;
    if (A.status === gt && (A.gzhead.hcrc ? (A.pending + 2 > A.pending_buf_size && ct(f), A.pending + 2 <= A.pending_buf_size && (Le(A, f.adler & 255), Le(A, f.adler >> 8 & 255), f.adler = 0, A.status = We)) : A.status = We), A.pending !== 0) {
      if (ct(f), f.avail_out === 0)
        return A.last_flush = -1, m;
    } else if (f.avail_in === 0 && yt(te) <= yt(ie) && te !== c)
      return je(f, D);
    if (A.status === lt && f.avail_in !== 0)
      return je(f, D);
    if (f.avail_in !== 0 || A.lookahead !== 0 || te !== o && A.status !== lt) {
      var xe = A.strategy === M ? S(A, te) : A.strategy === J ? Jt(A, te) : v[A.level].func(A, te);
      if ((xe === Fe || xe === et) && (A.status = lt), xe === Pe || xe === Fe)
        return f.avail_out === 0 && (A.last_flush = -1), m;
      if (xe === he && (te === a ? e._tr_align(A) : te !== b && (e._tr_stored_block(A, 0, 0, !1), te === l && (ht(A.head), A.lookahead === 0 && (A.strstart = 0, A.block_start = 0, A.insert = 0))), ct(f), f.avail_out === 0))
        return A.last_flush = -1, m;
    }
    return te !== c ? m : A.wrap <= 0 ? w : (A.wrap === 2 ? (Le(A, f.adler & 255), Le(A, f.adler >> 8 & 255), Le(A, f.adler >> 16 & 255), Le(A, f.adler >> 24 & 255), Le(A, f.total_in & 255), Le(A, f.total_in >> 8 & 255), Le(A, f.total_in >> 16 & 255), Le(A, f.total_in >> 24 & 255)) : (kt(A, f.adler >>> 16), kt(A, f.adler & 65535)), ct(f), A.wrap > 0 && (A.wrap = -A.wrap), A.pending !== 0 ? m : w);
  }
  function se(f) {
    var te;
    return !f || !f.state ? x : (te = f.state.status, te !== Ve && te !== Xe && te !== Ze && te !== wt && te !== gt && te !== We && te !== lt ? je(f, x) : (f.state = null, te === We ? je(f, k) : m));
  }
  function Ne(f, te) {
    var ie = te.length, A, F, Z, Oe, Ee, xe, Je, Rr;
    if (!f || !f.state || (A = f.state, Oe = A.wrap, Oe === 2 || Oe === 1 && A.status !== Ve || A.lookahead))
      return x;
    for (Oe === 1 && (f.adler = t(f.adler, te, ie, 0)), A.wrap = 0, ie >= A.w_size && (Oe === 0 && (ht(A.head), A.strstart = 0, A.block_start = 0, A.insert = 0), Rr = new n.Buf8(A.w_size), n.arraySet(Rr, te, ie - A.w_size, A.w_size, 0), te = Rr, ie = A.w_size), Ee = f.avail_in, xe = f.next_in, Je = f.input, f.avail_in = ie, f.next_in = 0, f.input = te, Qe(A); A.lookahead >= we; ) {
      F = A.strstart, Z = A.lookahead - (we - 1);
      do
        A.ins_h = (A.ins_h << A.hash_shift ^ A.window[F + we - 1]) & A.hash_mask, A.prev[F & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = F, F++;
      while (--Z);
      A.strstart = F, A.lookahead = we - 1, Qe(A);
    }
    return A.strstart += A.lookahead, A.block_start = A.strstart, A.insert = A.lookahead, A.lookahead = 0, A.match_length = A.prev_length = we - 1, A.match_available = 0, f.next_in = xe, f.input = Je, f.avail_in = Ee, A.wrap = Oe, m;
  }
  return Hr.deflateInit = q, Hr.deflateInit2 = B, Hr.deflateReset = L, Hr.deflateResetKeep = T, Hr.deflateSetHeader = ue, Hr.deflate = _, Hr.deflateEnd = se, Hr.deflateSetDictionary = Ne, Hr.deflateInfo = "pako deflate (from Nodeca project)", Hr;
}
var Di = {}, qv;
function F0() {
  if (qv) return Di;
  qv = 1;
  var n = Ai(), e = !0, t = !0;
  try {
    String.fromCharCode.apply(null, [0]);
  } catch {
    e = !1;
  }
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch {
    t = !1;
  }
  for (var r = new n.Buf8(256), i = 0; i < 256; i++)
    r[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
  r[254] = r[254] = 1, Di.string2buf = function(a) {
    var l, c, b, m, w, x = a.length, k = 0;
    for (m = 0; m < x; m++)
      c = a.charCodeAt(m), (c & 64512) === 55296 && m + 1 < x && (b = a.charCodeAt(m + 1), (b & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (b - 56320), m++)), k += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    for (l = new n.Buf8(k), w = 0, m = 0; w < k; m++)
      c = a.charCodeAt(m), (c & 64512) === 55296 && m + 1 < x && (b = a.charCodeAt(m + 1), (b & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (b - 56320), m++)), c < 128 ? l[w++] = c : c < 2048 ? (l[w++] = 192 | c >>> 6, l[w++] = 128 | c & 63) : c < 65536 ? (l[w++] = 224 | c >>> 12, l[w++] = 128 | c >>> 6 & 63, l[w++] = 128 | c & 63) : (l[w++] = 240 | c >>> 18, l[w++] = 128 | c >>> 12 & 63, l[w++] = 128 | c >>> 6 & 63, l[w++] = 128 | c & 63);
    return l;
  };
  function o(a, l) {
    if (l < 65534 && (a.subarray && t || !a.subarray && e))
      return String.fromCharCode.apply(null, n.shrinkBuf(a, l));
    for (var c = "", b = 0; b < l; b++)
      c += String.fromCharCode(a[b]);
    return c;
  }
  return Di.buf2binstring = function(a) {
    return o(a, a.length);
  }, Di.binstring2buf = function(a) {
    for (var l = new n.Buf8(a.length), c = 0, b = l.length; c < b; c++)
      l[c] = a.charCodeAt(c);
    return l;
  }, Di.buf2string = function(a, l) {
    var c, b, m, w, x = l || a.length, k = new Array(x * 2);
    for (b = 0, c = 0; c < x; ) {
      if (m = a[c++], m < 128) {
        k[b++] = m;
        continue;
      }
      if (w = r[m], w > 4) {
        k[b++] = 65533, c += w - 1;
        continue;
      }
      for (m &= w === 2 ? 31 : w === 3 ? 15 : 7; w > 1 && c < x; )
        m = m << 6 | a[c++] & 63, w--;
      if (w > 1) {
        k[b++] = 65533;
        continue;
      }
      m < 65536 ? k[b++] = m : (m -= 65536, k[b++] = 55296 | m >> 10 & 1023, k[b++] = 56320 | m & 1023);
    }
    return o(k, b);
  }, Di.utf8border = function(a, l) {
    var c;
    for (l = l || a.length, l > a.length && (l = a.length), c = l - 1; c >= 0 && (a[c] & 192) === 128; )
      c--;
    return c < 0 || c === 0 ? l : c + r[a[c]] > l ? c : l;
  }, Di;
}
var Gc, Mv;
function L0() {
  if (Mv) return Gc;
  Mv = 1;
  function n() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
  return Gc = n, Gc;
}
var Uv;
function pb() {
  if (Uv) return As;
  Uv = 1;
  var n = hb(), e = Ai(), t = F0(), r = ah(), i = L0(), o = Object.prototype.toString, a = 0, l = 4, c = 0, b = 1, m = 2, w = -1, x = 0, k = 8;
  function D(J) {
    if (!(this instanceof D)) return new D(J);
    this.options = e.assign({
      level: w,
      method: k,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: x,
      to: ""
    }, J || {});
    var X = this.options;
    X.raw && X.windowBits > 0 ? X.windowBits = -X.windowBits : X.gzip && X.windowBits > 0 && X.windowBits < 16 && (X.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
    var le = n.deflateInit2(
      this.strm,
      X.level,
      X.method,
      X.windowBits,
      X.memLevel,
      X.strategy
    );
    if (le !== c)
      throw new Error(r[le]);
    if (X.header && n.deflateSetHeader(this.strm, X.header), X.dictionary) {
      var ce;
      if (typeof X.dictionary == "string" ? ce = t.string2buf(X.dictionary) : o.call(X.dictionary) === "[object ArrayBuffer]" ? ce = new Uint8Array(X.dictionary) : ce = X.dictionary, le = n.deflateSetDictionary(this.strm, ce), le !== c)
        throw new Error(r[le]);
      this._dict_set = !0;
    }
  }
  D.prototype.push = function(J, X) {
    var le = this.strm, ce = this.options.chunkSize, fe, oe;
    if (this.ended)
      return !1;
    oe = X === ~~X ? X : X === !0 ? l : a, typeof J == "string" ? le.input = t.string2buf(J) : o.call(J) === "[object ArrayBuffer]" ? le.input = new Uint8Array(J) : le.input = J, le.next_in = 0, le.avail_in = le.input.length;
    do {
      if (le.avail_out === 0 && (le.output = new e.Buf8(ce), le.next_out = 0, le.avail_out = ce), fe = n.deflate(le, oe), fe !== b && fe !== c)
        return this.onEnd(fe), this.ended = !0, !1;
      (le.avail_out === 0 || le.avail_in === 0 && (oe === l || oe === m)) && (this.options.to === "string" ? this.onData(t.buf2binstring(e.shrinkBuf(le.output, le.next_out))) : this.onData(e.shrinkBuf(le.output, le.next_out)));
    } while ((le.avail_in > 0 || le.avail_out === 0) && fe !== b);
    return oe === l ? (fe = n.deflateEnd(this.strm), this.onEnd(fe), this.ended = !0, fe === c) : (oe === m && (this.onEnd(c), le.avail_out = 0), !0);
  }, D.prototype.onData = function(J) {
    this.chunks.push(J);
  }, D.prototype.onEnd = function(J) {
    J === c && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = e.flattenChunks(this.chunks)), this.chunks = [], this.err = J, this.msg = this.strm.msg;
  };
  function K(J, X) {
    var le = new D(X);
    if (le.push(J, !0), le.err)
      throw le.msg || r[le.err];
    return le.result;
  }
  function C(J, X) {
    return X = X || {}, X.raw = !0, K(J, X);
  }
  function M(J, X) {
    return X = X || {}, X.gzip = !0, K(J, X);
  }
  return As.Deflate = D, As.deflate = K, As.deflateRaw = C, As.gzip = M, As;
}
var ks = {}, Mr = {}, Hc, $v;
function db() {
  if ($v) return Hc;
  $v = 1;
  var n = 30, e = 12;
  return Hc = function(r, i) {
    var o, a, l, c, b, m, w, x, k, D, K, C, M, J, X, le, ce, fe, oe, ke, De, Ce, $e, Be, Se;
    o = r.state, a = r.next_in, Be = r.input, l = a + (r.avail_in - 5), c = r.next_out, Se = r.output, b = c - (i - r.avail_out), m = c + (r.avail_out - 257), w = o.dmax, x = o.wsize, k = o.whave, D = o.wnext, K = o.window, C = o.hold, M = o.bits, J = o.lencode, X = o.distcode, le = (1 << o.lenbits) - 1, ce = (1 << o.distbits) - 1;
    e:
      do {
        M < 15 && (C += Be[a++] << M, M += 8, C += Be[a++] << M, M += 8), fe = J[C & le];
        t:
          for (; ; ) {
            if (oe = fe >>> 24, C >>>= oe, M -= oe, oe = fe >>> 16 & 255, oe === 0)
              Se[c++] = fe & 65535;
            else if (oe & 16) {
              ke = fe & 65535, oe &= 15, oe && (M < oe && (C += Be[a++] << M, M += 8), ke += C & (1 << oe) - 1, C >>>= oe, M -= oe), M < 15 && (C += Be[a++] << M, M += 8, C += Be[a++] << M, M += 8), fe = X[C & ce];
              r:
                for (; ; ) {
                  if (oe = fe >>> 24, C >>>= oe, M -= oe, oe = fe >>> 16 & 255, oe & 16) {
                    if (De = fe & 65535, oe &= 15, M < oe && (C += Be[a++] << M, M += 8, M < oe && (C += Be[a++] << M, M += 8)), De += C & (1 << oe) - 1, De > w) {
                      r.msg = "invalid distance too far back", o.mode = n;
                      break e;
                    }
                    if (C >>>= oe, M -= oe, oe = c - b, De > oe) {
                      if (oe = De - oe, oe > k && o.sane) {
                        r.msg = "invalid distance too far back", o.mode = n;
                        break e;
                      }
                      if (Ce = 0, $e = K, D === 0) {
                        if (Ce += x - oe, oe < ke) {
                          ke -= oe;
                          do
                            Se[c++] = K[Ce++];
                          while (--oe);
                          Ce = c - De, $e = Se;
                        }
                      } else if (D < oe) {
                        if (Ce += x + D - oe, oe -= D, oe < ke) {
                          ke -= oe;
                          do
                            Se[c++] = K[Ce++];
                          while (--oe);
                          if (Ce = 0, D < ke) {
                            oe = D, ke -= oe;
                            do
                              Se[c++] = K[Ce++];
                            while (--oe);
                            Ce = c - De, $e = Se;
                          }
                        }
                      } else if (Ce += D - oe, oe < ke) {
                        ke -= oe;
                        do
                          Se[c++] = K[Ce++];
                        while (--oe);
                        Ce = c - De, $e = Se;
                      }
                      for (; ke > 2; )
                        Se[c++] = $e[Ce++], Se[c++] = $e[Ce++], Se[c++] = $e[Ce++], ke -= 3;
                      ke && (Se[c++] = $e[Ce++], ke > 1 && (Se[c++] = $e[Ce++]));
                    } else {
                      Ce = c - De;
                      do
                        Se[c++] = Se[Ce++], Se[c++] = Se[Ce++], Se[c++] = Se[Ce++], ke -= 3;
                      while (ke > 2);
                      ke && (Se[c++] = Se[Ce++], ke > 1 && (Se[c++] = Se[Ce++]));
                    }
                  } else if ((oe & 64) === 0) {
                    fe = X[(fe & 65535) + (C & (1 << oe) - 1)];
                    continue r;
                  } else {
                    r.msg = "invalid distance code", o.mode = n;
                    break e;
                  }
                  break;
                }
            } else if ((oe & 64) === 0) {
              fe = J[(fe & 65535) + (C & (1 << oe) - 1)];
              continue t;
            } else if (oe & 32) {
              o.mode = e;
              break e;
            } else {
              r.msg = "invalid literal/length code", o.mode = n;
              break e;
            }
            break;
          }
      } while (a < l && c < m);
    ke = M >> 3, a -= ke, M -= ke << 3, C &= (1 << M) - 1, r.next_in = a, r.next_out = c, r.avail_in = a < l ? 5 + (l - a) : 5 - (a - l), r.avail_out = c < m ? 257 + (m - c) : 257 - (c - m), o.hold = C, o.bits = M;
  }, Hc;
}
var Wc, jv;
function vb() {
  if (jv) return Wc;
  jv = 1;
  var n = Ai(), e = 15, t = 852, r = 592, i = 0, o = 1, a = 2, l = [
    /* Length codes 257..285 base */
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ], c = [
    /* Length codes 257..285 extra */
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ], b = [
    /* Distance codes 0..29 base */
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ], m = [
    /* Distance codes 0..29 extra */
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ];
  return Wc = function(x, k, D, K, C, M, J, X) {
    var le = X.bits, ce = 0, fe = 0, oe = 0, ke = 0, De = 0, Ce = 0, $e = 0, Be = 0, Se = 0, Me = 0, ot, vt, we, He, Ke, It = null, Ve = 0, Xe, Ze = new n.Buf16(e + 1), wt = new n.Buf16(e + 1), gt = null, We = 0, lt, Pe, he;
    for (ce = 0; ce <= e; ce++)
      Ze[ce] = 0;
    for (fe = 0; fe < K; fe++)
      Ze[k[D + fe]]++;
    for (De = le, ke = e; ke >= 1 && Ze[ke] === 0; ke--)
      ;
    if (De > ke && (De = ke), ke === 0)
      return C[M++] = 1 << 24 | 64 << 16 | 0, C[M++] = 1 << 24 | 64 << 16 | 0, X.bits = 1, 0;
    for (oe = 1; oe < ke && Ze[oe] === 0; oe++)
      ;
    for (De < oe && (De = oe), Be = 1, ce = 1; ce <= e; ce++)
      if (Be <<= 1, Be -= Ze[ce], Be < 0)
        return -1;
    if (Be > 0 && (x === i || ke !== 1))
      return -1;
    for (wt[1] = 0, ce = 1; ce < e; ce++)
      wt[ce + 1] = wt[ce] + Ze[ce];
    for (fe = 0; fe < K; fe++)
      k[D + fe] !== 0 && (J[wt[k[D + fe]]++] = fe);
    if (x === i ? (It = gt = J, Xe = 19) : x === o ? (It = l, Ve -= 257, gt = c, We -= 257, Xe = 256) : (It = b, gt = m, Xe = -1), Me = 0, fe = 0, ce = oe, Ke = M, Ce = De, $e = 0, we = -1, Se = 1 << De, He = Se - 1, x === o && Se > t || x === a && Se > r)
      return 1;
    for (; ; ) {
      lt = ce - $e, J[fe] < Xe ? (Pe = 0, he = J[fe]) : J[fe] > Xe ? (Pe = gt[We + J[fe]], he = It[Ve + J[fe]]) : (Pe = 96, he = 0), ot = 1 << ce - $e, vt = 1 << Ce, oe = vt;
      do
        vt -= ot, C[Ke + (Me >> $e) + vt] = lt << 24 | Pe << 16 | he | 0;
      while (vt !== 0);
      for (ot = 1 << ce - 1; Me & ot; )
        ot >>= 1;
      if (ot !== 0 ? (Me &= ot - 1, Me += ot) : Me = 0, fe++, --Ze[ce] === 0) {
        if (ce === ke)
          break;
        ce = k[D + J[fe]];
      }
      if (ce > De && (Me & He) !== we) {
        for ($e === 0 && ($e = De), Ke += oe, Ce = ce - $e, Be = 1 << Ce; Ce + $e < ke && (Be -= Ze[Ce + $e], !(Be <= 0)); )
          Ce++, Be <<= 1;
        if (Se += 1 << Ce, x === o && Se > t || x === a && Se > r)
          return 1;
        we = Me & He, C[we] = De << 24 | Ce << 16 | Ke - M | 0;
      }
    }
    return Me !== 0 && (C[Ke + Me] = ce - $e << 24 | 64 << 16 | 0), X.bits = De, 0;
  }, Wc;
}
var Kv;
function gb() {
  if (Kv) return Mr;
  Kv = 1;
  var n = Ai(), e = D0(), t = B0(), r = db(), i = vb(), o = 0, a = 1, l = 2, c = 4, b = 5, m = 6, w = 0, x = 1, k = 2, D = -2, K = -3, C = -4, M = -5, J = 8, X = 1, le = 2, ce = 3, fe = 4, oe = 5, ke = 6, De = 7, Ce = 8, $e = 9, Be = 10, Se = 11, Me = 12, ot = 13, vt = 14, we = 15, He = 16, Ke = 17, It = 18, Ve = 19, Xe = 20, Ze = 21, wt = 22, gt = 23, We = 24, lt = 25, Pe = 26, he = 27, Fe = 28, et = 29, me = 30, je = 31, yt = 32, ht = 852, ct = 592, st = 15, Le = st;
  function kt(B) {
    return (B >>> 24 & 255) + (B >>> 8 & 65280) + ((B & 65280) << 8) + ((B & 255) << 24);
  }
  function Ot() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  function qe(B) {
    var q;
    return !B || !B.state ? D : (q = B.state, B.total_in = B.total_out = q.total = 0, B.msg = "", q.wrap && (B.adler = q.wrap & 1), q.mode = X, q.last = 0, q.havedict = 0, q.dmax = 32768, q.head = null, q.hold = 0, q.bits = 0, q.lencode = q.lendyn = new n.Buf32(ht), q.distcode = q.distdyn = new n.Buf32(ct), q.sane = 1, q.back = -1, w);
  }
  function Qe(B) {
    var q;
    return !B || !B.state ? D : (q = B.state, q.wsize = 0, q.whave = 0, q.wnext = 0, qe(B));
  }
  function Et(B, q) {
    var _, se;
    return !B || !B.state || (se = B.state, q < 0 ? (_ = 0, q = -q) : (_ = (q >> 4) + 1, q < 48 && (q &= 15)), q && (q < 8 || q > 15)) ? D : (se.window !== null && se.wbits !== q && (se.window = null), se.wrap = _, se.wbits = q, Qe(B));
  }
  function Ft(B, q) {
    var _, se;
    return B ? (se = new Ot(), B.state = se, se.window = null, _ = Et(B, q), _ !== w && (B.state = null), _) : D;
  }
  function _t(B) {
    return Ft(B, Le);
  }
  var Jt = !0, S, d;
  function v(B) {
    if (Jt) {
      var q;
      for (S = new n.Buf32(512), d = new n.Buf32(32), q = 0; q < 144; )
        B.lens[q++] = 8;
      for (; q < 256; )
        B.lens[q++] = 9;
      for (; q < 280; )
        B.lens[q++] = 7;
      for (; q < 288; )
        B.lens[q++] = 8;
      for (i(a, B.lens, 0, 288, S, 0, B.work, { bits: 9 }), q = 0; q < 32; )
        B.lens[q++] = 5;
      i(l, B.lens, 0, 32, d, 0, B.work, { bits: 5 }), Jt = !1;
    }
    B.lencode = S, B.lenbits = 9, B.distcode = d, B.distbits = 5;
  }
  function R(B, q, _, se) {
    var Ne, f = B.state;
    return f.window === null && (f.wsize = 1 << f.wbits, f.wnext = 0, f.whave = 0, f.window = new n.Buf8(f.wsize)), se >= f.wsize ? (n.arraySet(f.window, q, _ - f.wsize, f.wsize, 0), f.wnext = 0, f.whave = f.wsize) : (Ne = f.wsize - f.wnext, Ne > se && (Ne = se), n.arraySet(f.window, q, _ - se, Ne, f.wnext), se -= Ne, se ? (n.arraySet(f.window, q, _ - se, se, 0), f.wnext = se, f.whave = f.wsize) : (f.wnext += Ne, f.wnext === f.wsize && (f.wnext = 0), f.whave < f.wsize && (f.whave += Ne))), 0;
  }
  function y(B, q) {
    var _, se, Ne, f, te, ie, A, F, Z, Oe, Ee, xe, Je, Rr, bt = 0, Te, tt, Ut, qt, yn, mn, Rt, Nt, St = new n.Buf8(4), $t, lr, na = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!B || !B.state || !B.output || !B.input && B.avail_in !== 0)
      return D;
    _ = B.state, _.mode === Me && (_.mode = ot), te = B.next_out, Ne = B.output, A = B.avail_out, f = B.next_in, se = B.input, ie = B.avail_in, F = _.hold, Z = _.bits, Oe = ie, Ee = A, Nt = w;
    e:
      for (; ; )
        switch (_.mode) {
          case X:
            if (_.wrap === 0) {
              _.mode = ot;
              break;
            }
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (_.wrap & 2 && F === 35615) {
              _.check = 0, St[0] = F & 255, St[1] = F >>> 8 & 255, _.check = t(_.check, St, 2, 0), F = 0, Z = 0, _.mode = le;
              break;
            }
            if (_.flags = 0, _.head && (_.head.done = !1), !(_.wrap & 1) || /* check if zlib header allowed */
            (((F & 255) << 8) + (F >> 8)) % 31) {
              B.msg = "incorrect header check", _.mode = me;
              break;
            }
            if ((F & 15) !== J) {
              B.msg = "unknown compression method", _.mode = me;
              break;
            }
            if (F >>>= 4, Z -= 4, Rt = (F & 15) + 8, _.wbits === 0)
              _.wbits = Rt;
            else if (Rt > _.wbits) {
              B.msg = "invalid window size", _.mode = me;
              break;
            }
            _.dmax = 1 << Rt, B.adler = _.check = 1, _.mode = F & 512 ? Be : Me, F = 0, Z = 0;
            break;
          case le:
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (_.flags = F, (_.flags & 255) !== J) {
              B.msg = "unknown compression method", _.mode = me;
              break;
            }
            if (_.flags & 57344) {
              B.msg = "unknown header flags set", _.mode = me;
              break;
            }
            _.head && (_.head.text = F >> 8 & 1), _.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, _.check = t(_.check, St, 2, 0)), F = 0, Z = 0, _.mode = ce;
          /* falls through */
          case ce:
            for (; Z < 32; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            _.head && (_.head.time = F), _.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, St[2] = F >>> 16 & 255, St[3] = F >>> 24 & 255, _.check = t(_.check, St, 4, 0)), F = 0, Z = 0, _.mode = fe;
          /* falls through */
          case fe:
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            _.head && (_.head.xflags = F & 255, _.head.os = F >> 8), _.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, _.check = t(_.check, St, 2, 0)), F = 0, Z = 0, _.mode = oe;
          /* falls through */
          case oe:
            if (_.flags & 1024) {
              for (; Z < 16; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              _.length = F, _.head && (_.head.extra_len = F), _.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, _.check = t(_.check, St, 2, 0)), F = 0, Z = 0;
            } else _.head && (_.head.extra = null);
            _.mode = ke;
          /* falls through */
          case ke:
            if (_.flags & 1024 && (xe = _.length, xe > ie && (xe = ie), xe && (_.head && (Rt = _.head.extra_len - _.length, _.head.extra || (_.head.extra = new Array(_.head.extra_len)), n.arraySet(
              _.head.extra,
              se,
              f,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              xe,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Rt
            )), _.flags & 512 && (_.check = t(_.check, se, xe, f)), ie -= xe, f += xe, _.length -= xe), _.length))
              break e;
            _.length = 0, _.mode = De;
          /* falls through */
          case De:
            if (_.flags & 2048) {
              if (ie === 0)
                break e;
              xe = 0;
              do
                Rt = se[f + xe++], _.head && Rt && _.length < 65536 && (_.head.name += String.fromCharCode(Rt));
              while (Rt && xe < ie);
              if (_.flags & 512 && (_.check = t(_.check, se, xe, f)), ie -= xe, f += xe, Rt)
                break e;
            } else _.head && (_.head.name = null);
            _.length = 0, _.mode = Ce;
          /* falls through */
          case Ce:
            if (_.flags & 4096) {
              if (ie === 0)
                break e;
              xe = 0;
              do
                Rt = se[f + xe++], _.head && Rt && _.length < 65536 && (_.head.comment += String.fromCharCode(Rt));
              while (Rt && xe < ie);
              if (_.flags & 512 && (_.check = t(_.check, se, xe, f)), ie -= xe, f += xe, Rt)
                break e;
            } else _.head && (_.head.comment = null);
            _.mode = $e;
          /* falls through */
          case $e:
            if (_.flags & 512) {
              for (; Z < 16; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if (F !== (_.check & 65535)) {
                B.msg = "header crc mismatch", _.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            _.head && (_.head.hcrc = _.flags >> 9 & 1, _.head.done = !0), B.adler = _.check = 0, _.mode = Me;
            break;
          case Be:
            for (; Z < 32; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            B.adler = _.check = kt(F), F = 0, Z = 0, _.mode = Se;
          /* falls through */
          case Se:
            if (_.havedict === 0)
              return B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, _.hold = F, _.bits = Z, k;
            B.adler = _.check = 1, _.mode = Me;
          /* falls through */
          case Me:
            if (q === b || q === m)
              break e;
          /* falls through */
          case ot:
            if (_.last) {
              F >>>= Z & 7, Z -= Z & 7, _.mode = he;
              break;
            }
            for (; Z < 3; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            switch (_.last = F & 1, F >>>= 1, Z -= 1, F & 3) {
              case 0:
                _.mode = vt;
                break;
              case 1:
                if (v(_), _.mode = Xe, q === m) {
                  F >>>= 2, Z -= 2;
                  break e;
                }
                break;
              case 2:
                _.mode = Ke;
                break;
              case 3:
                B.msg = "invalid block type", _.mode = me;
            }
            F >>>= 2, Z -= 2;
            break;
          case vt:
            for (F >>>= Z & 7, Z -= Z & 7; Z < 32; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if ((F & 65535) !== (F >>> 16 ^ 65535)) {
              B.msg = "invalid stored block lengths", _.mode = me;
              break;
            }
            if (_.length = F & 65535, F = 0, Z = 0, _.mode = we, q === m)
              break e;
          /* falls through */
          case we:
            _.mode = He;
          /* falls through */
          case He:
            if (xe = _.length, xe) {
              if (xe > ie && (xe = ie), xe > A && (xe = A), xe === 0)
                break e;
              n.arraySet(Ne, se, f, xe, te), ie -= xe, f += xe, A -= xe, te += xe, _.length -= xe;
              break;
            }
            _.mode = Me;
            break;
          case Ke:
            for (; Z < 14; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (_.nlen = (F & 31) + 257, F >>>= 5, Z -= 5, _.ndist = (F & 31) + 1, F >>>= 5, Z -= 5, _.ncode = (F & 15) + 4, F >>>= 4, Z -= 4, _.nlen > 286 || _.ndist > 30) {
              B.msg = "too many length or distance symbols", _.mode = me;
              break;
            }
            _.have = 0, _.mode = It;
          /* falls through */
          case It:
            for (; _.have < _.ncode; ) {
              for (; Z < 3; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              _.lens[na[_.have++]] = F & 7, F >>>= 3, Z -= 3;
            }
            for (; _.have < 19; )
              _.lens[na[_.have++]] = 0;
            if (_.lencode = _.lendyn, _.lenbits = 7, $t = { bits: _.lenbits }, Nt = i(o, _.lens, 0, 19, _.lencode, 0, _.work, $t), _.lenbits = $t.bits, Nt) {
              B.msg = "invalid code lengths set", _.mode = me;
              break;
            }
            _.have = 0, _.mode = Ve;
          /* falls through */
          case Ve:
            for (; _.have < _.nlen + _.ndist; ) {
              for (; bt = _.lencode[F & (1 << _.lenbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if (Ut < 16)
                F >>>= Te, Z -= Te, _.lens[_.have++] = Ut;
              else {
                if (Ut === 16) {
                  for (lr = Te + 2; Z < lr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  if (F >>>= Te, Z -= Te, _.have === 0) {
                    B.msg = "invalid bit length repeat", _.mode = me;
                    break;
                  }
                  Rt = _.lens[_.have - 1], xe = 3 + (F & 3), F >>>= 2, Z -= 2;
                } else if (Ut === 17) {
                  for (lr = Te + 3; Z < lr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  F >>>= Te, Z -= Te, Rt = 0, xe = 3 + (F & 7), F >>>= 3, Z -= 3;
                } else {
                  for (lr = Te + 7; Z < lr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  F >>>= Te, Z -= Te, Rt = 0, xe = 11 + (F & 127), F >>>= 7, Z -= 7;
                }
                if (_.have + xe > _.nlen + _.ndist) {
                  B.msg = "invalid bit length repeat", _.mode = me;
                  break;
                }
                for (; xe--; )
                  _.lens[_.have++] = Rt;
              }
            }
            if (_.mode === me)
              break;
            if (_.lens[256] === 0) {
              B.msg = "invalid code -- missing end-of-block", _.mode = me;
              break;
            }
            if (_.lenbits = 9, $t = { bits: _.lenbits }, Nt = i(a, _.lens, 0, _.nlen, _.lencode, 0, _.work, $t), _.lenbits = $t.bits, Nt) {
              B.msg = "invalid literal/lengths set", _.mode = me;
              break;
            }
            if (_.distbits = 6, _.distcode = _.distdyn, $t = { bits: _.distbits }, Nt = i(l, _.lens, _.nlen, _.ndist, _.distcode, 0, _.work, $t), _.distbits = $t.bits, Nt) {
              B.msg = "invalid distances set", _.mode = me;
              break;
            }
            if (_.mode = Xe, q === m)
              break e;
          /* falls through */
          case Xe:
            _.mode = Ze;
          /* falls through */
          case Ze:
            if (ie >= 6 && A >= 258) {
              B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, _.hold = F, _.bits = Z, r(B, Ee), te = B.next_out, Ne = B.output, A = B.avail_out, f = B.next_in, se = B.input, ie = B.avail_in, F = _.hold, Z = _.bits, _.mode === Me && (_.back = -1);
              break;
            }
            for (_.back = 0; bt = _.lencode[F & (1 << _.lenbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(Te <= Z); ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (tt && (tt & 240) === 0) {
              for (qt = Te, yn = tt, mn = Ut; bt = _.lencode[mn + ((F & (1 << qt + yn) - 1) >> qt)], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(qt + Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              F >>>= qt, Z -= qt, _.back += qt;
            }
            if (F >>>= Te, Z -= Te, _.back += Te, _.length = Ut, tt === 0) {
              _.mode = Pe;
              break;
            }
            if (tt & 32) {
              _.back = -1, _.mode = Me;
              break;
            }
            if (tt & 64) {
              B.msg = "invalid literal/length code", _.mode = me;
              break;
            }
            _.extra = tt & 15, _.mode = wt;
          /* falls through */
          case wt:
            if (_.extra) {
              for (lr = _.extra; Z < lr; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              _.length += F & (1 << _.extra) - 1, F >>>= _.extra, Z -= _.extra, _.back += _.extra;
            }
            _.was = _.length, _.mode = gt;
          /* falls through */
          case gt:
            for (; bt = _.distcode[F & (1 << _.distbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(Te <= Z); ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if ((tt & 240) === 0) {
              for (qt = Te, yn = tt, mn = Ut; bt = _.distcode[mn + ((F & (1 << qt + yn) - 1) >> qt)], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(qt + Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              F >>>= qt, Z -= qt, _.back += qt;
            }
            if (F >>>= Te, Z -= Te, _.back += Te, tt & 64) {
              B.msg = "invalid distance code", _.mode = me;
              break;
            }
            _.offset = Ut, _.extra = tt & 15, _.mode = We;
          /* falls through */
          case We:
            if (_.extra) {
              for (lr = _.extra; Z < lr; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              _.offset += F & (1 << _.extra) - 1, F >>>= _.extra, Z -= _.extra, _.back += _.extra;
            }
            if (_.offset > _.dmax) {
              B.msg = "invalid distance too far back", _.mode = me;
              break;
            }
            _.mode = lt;
          /* falls through */
          case lt:
            if (A === 0)
              break e;
            if (xe = Ee - A, _.offset > xe) {
              if (xe = _.offset - xe, xe > _.whave && _.sane) {
                B.msg = "invalid distance too far back", _.mode = me;
                break;
              }
              xe > _.wnext ? (xe -= _.wnext, Je = _.wsize - xe) : Je = _.wnext - xe, xe > _.length && (xe = _.length), Rr = _.window;
            } else
              Rr = Ne, Je = te - _.offset, xe = _.length;
            xe > A && (xe = A), A -= xe, _.length -= xe;
            do
              Ne[te++] = Rr[Je++];
            while (--xe);
            _.length === 0 && (_.mode = Ze);
            break;
          case Pe:
            if (A === 0)
              break e;
            Ne[te++] = _.length, A--, _.mode = Ze;
            break;
          case he:
            if (_.wrap) {
              for (; Z < 32; ) {
                if (ie === 0)
                  break e;
                ie--, F |= se[f++] << Z, Z += 8;
              }
              if (Ee -= A, B.total_out += Ee, _.total += Ee, Ee && (B.adler = _.check = /*UPDATE(state.check, put - _out, _out);*/
              _.flags ? t(_.check, Ne, Ee, te - Ee) : e(_.check, Ne, Ee, te - Ee)), Ee = A, (_.flags ? F : kt(F)) !== _.check) {
                B.msg = "incorrect data check", _.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            _.mode = Fe;
          /* falls through */
          case Fe:
            if (_.wrap && _.flags) {
              for (; Z < 32; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if (F !== (_.total & 4294967295)) {
                B.msg = "incorrect length check", _.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            _.mode = et;
          /* falls through */
          case et:
            Nt = x;
            break e;
          case me:
            Nt = K;
            break e;
          case je:
            return C;
          case yt:
          /* falls through */
          default:
            return D;
        }
    return B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, _.hold = F, _.bits = Z, (_.wsize || Ee !== B.avail_out && _.mode < me && (_.mode < he || q !== c)) && R(B, B.output, B.next_out, Ee - B.avail_out), Oe -= B.avail_in, Ee -= B.avail_out, B.total_in += Oe, B.total_out += Ee, _.total += Ee, _.wrap && Ee && (B.adler = _.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    _.flags ? t(_.check, Ne, Ee, B.next_out - Ee) : e(_.check, Ne, Ee, B.next_out - Ee)), B.data_type = _.bits + (_.last ? 64 : 0) + (_.mode === Me ? 128 : 0) + (_.mode === Xe || _.mode === we ? 256 : 0), (Oe === 0 && Ee === 0 || q === c) && Nt === w && (Nt = M), Nt;
  }
  function T(B) {
    if (!B || !B.state)
      return D;
    var q = B.state;
    return q.window && (q.window = null), B.state = null, w;
  }
  function L(B, q) {
    var _;
    return !B || !B.state || (_ = B.state, (_.wrap & 2) === 0) ? D : (_.head = q, q.done = !1, w);
  }
  function ue(B, q) {
    var _ = q.length, se, Ne, f;
    return !B || !B.state || (se = B.state, se.wrap !== 0 && se.mode !== Se) ? D : se.mode === Se && (Ne = 1, Ne = e(Ne, q, _, 0), Ne !== se.check) ? K : (f = R(B, q, _, _), f ? (se.mode = je, C) : (se.havedict = 1, w));
  }
  return Mr.inflateReset = Qe, Mr.inflateReset2 = Et, Mr.inflateResetKeep = qe, Mr.inflateInit = _t, Mr.inflateInit2 = Ft, Mr.inflate = y, Mr.inflateEnd = T, Mr.inflateGetHeader = L, Mr.inflateSetDictionary = ue, Mr.inflateInfo = "pako inflate (from Nodeca project)", Mr;
}
var Yc, zv;
function q0() {
  return zv || (zv = 1, Yc = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    //Z_MEM_ERROR:     -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  }), Yc;
}
var Vc, Gv;
function yb() {
  if (Gv) return Vc;
  Gv = 1;
  function n() {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
  }
  return Vc = n, Vc;
}
var Hv;
function mb() {
  if (Hv) return ks;
  Hv = 1;
  var n = gb(), e = Ai(), t = F0(), r = q0(), i = ah(), o = L0(), a = yb(), l = Object.prototype.toString;
  function c(w) {
    if (!(this instanceof c)) return new c(w);
    this.options = e.assign({
      chunkSize: 16384,
      windowBits: 0,
      to: ""
    }, w || {});
    var x = this.options;
    x.raw && x.windowBits >= 0 && x.windowBits < 16 && (x.windowBits = -x.windowBits, x.windowBits === 0 && (x.windowBits = -15)), x.windowBits >= 0 && x.windowBits < 16 && !(w && w.windowBits) && (x.windowBits += 32), x.windowBits > 15 && x.windowBits < 48 && (x.windowBits & 15) === 0 && (x.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new o(), this.strm.avail_out = 0;
    var k = n.inflateInit2(
      this.strm,
      x.windowBits
    );
    if (k !== r.Z_OK)
      throw new Error(i[k]);
    if (this.header = new a(), n.inflateGetHeader(this.strm, this.header), x.dictionary && (typeof x.dictionary == "string" ? x.dictionary = t.string2buf(x.dictionary) : l.call(x.dictionary) === "[object ArrayBuffer]" && (x.dictionary = new Uint8Array(x.dictionary)), x.raw && (k = n.inflateSetDictionary(this.strm, x.dictionary), k !== r.Z_OK)))
      throw new Error(i[k]);
  }
  c.prototype.push = function(w, x) {
    var k = this.strm, D = this.options.chunkSize, K = this.options.dictionary, C, M, J, X, le, ce = !1;
    if (this.ended)
      return !1;
    M = x === ~~x ? x : x === !0 ? r.Z_FINISH : r.Z_NO_FLUSH, typeof w == "string" ? k.input = t.binstring2buf(w) : l.call(w) === "[object ArrayBuffer]" ? k.input = new Uint8Array(w) : k.input = w, k.next_in = 0, k.avail_in = k.input.length;
    do {
      if (k.avail_out === 0 && (k.output = new e.Buf8(D), k.next_out = 0, k.avail_out = D), C = n.inflate(k, r.Z_NO_FLUSH), C === r.Z_NEED_DICT && K && (C = n.inflateSetDictionary(this.strm, K)), C === r.Z_BUF_ERROR && ce === !0 && (C = r.Z_OK, ce = !1), C !== r.Z_STREAM_END && C !== r.Z_OK)
        return this.onEnd(C), this.ended = !0, !1;
      k.next_out && (k.avail_out === 0 || C === r.Z_STREAM_END || k.avail_in === 0 && (M === r.Z_FINISH || M === r.Z_SYNC_FLUSH)) && (this.options.to === "string" ? (J = t.utf8border(k.output, k.next_out), X = k.next_out - J, le = t.buf2string(k.output, J), k.next_out = X, k.avail_out = D - X, X && e.arraySet(k.output, k.output, J, X, 0), this.onData(le)) : this.onData(e.shrinkBuf(k.output, k.next_out))), k.avail_in === 0 && k.avail_out === 0 && (ce = !0);
    } while ((k.avail_in > 0 || k.avail_out === 0) && C !== r.Z_STREAM_END);
    return C === r.Z_STREAM_END && (M = r.Z_FINISH), M === r.Z_FINISH ? (C = n.inflateEnd(this.strm), this.onEnd(C), this.ended = !0, C === r.Z_OK) : (M === r.Z_SYNC_FLUSH && (this.onEnd(r.Z_OK), k.avail_out = 0), !0);
  }, c.prototype.onData = function(w) {
    this.chunks.push(w);
  }, c.prototype.onEnd = function(w) {
    w === r.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = e.flattenChunks(this.chunks)), this.chunks = [], this.err = w, this.msg = this.strm.msg;
  };
  function b(w, x) {
    var k = new c(x);
    if (k.push(w, !0), k.err)
      throw k.msg || i[k.err];
    return k.result;
  }
  function m(w, x) {
    return x = x || {}, x.raw = !0, b(w, x);
  }
  return ks.Inflate = c, ks.inflate = b, ks.inflateRaw = m, ks.ungzip = b, ks;
}
var Jc, Wv;
function Ib() {
  if (Wv) return Jc;
  Wv = 1;
  var n = Ai().assign, e = pb(), t = mb(), r = q0(), i = {};
  return n(i, e, t, r), Jc = i, Jc;
}
var bb = Ib();
const _b = /* @__PURE__ */ Ef(bb), uh = A0([R0, "blip"]), Yv = 15, wb = 50 * 1024, xb = 128e3, If = {
  /** The maximum number of bytes of a message to send in a single frame (WebSocket message.) */
  MaxFrameSize: 16384,
  /** Maximum size that the WebSocket's `bufferedAmount` can grow to;
   * if it exceeds this, BLIP stops sending frames until it goes down. */
  MaxBufferedAmount: 1e3 * 1024,
  // Maximum buffered outgoing bytes
  /** How long (in milliseconds) BLIP waits before trying to send again when the WebSocket's
   *  `bufferedAmount` is too large. */
  BufferDelayMS: 100
}, bf = new Uint8Array(4);
bf[2] = bf[3] = 255;
var Ws;
class Vv {
  constructor() {
    ee(this, Ws, ub());
  }
  add(e) {
    return G(this, Ws, lb(p(this, Ws), e)), this.value;
  }
  get value() {
    return cb(p(this, Ws));
  }
}
Ws = new WeakMap();
var ii;
class Eb {
  constructor() {
    ee(this, ii);
    G(this, ii, new _b.Inflate({ raw: !0, windowBits: 15 })), p(this, ii).onEnd = (e) => {
      if (e !== 0)
        throw Error(`Inflate error ${e}`);
    };
  }
  decompress(e, t) {
    p(this, ii).onData = t, p(this, ii).push(e), p(this, ii).push(bf, 2);
  }
}
ii = new WeakMap();
class Sb {
  constructor(e, t, r = "throw") {
    this.resolve = e, this.reject = t, this.mode = r;
  }
}
class M0 {
  constructor(e, t) {
    ve(this, "logger", uh);
    ve(this, "flags");
    ve(this, "msgNo");
    ve(this, "promiseKeeper");
    if (this.flags = e, this.promiseKeeper = t, e & ds.Compressed)
      throw Error("Sending compressed messages is unimplemented!");
  }
  get type() {
    return this.flags & vn.TypeMask;
  }
}
var Qi, cn, Ys, wf;
class Ab extends M0 {
  /** Constructor takes a Message object to send. */
  constructor(t, r) {
    super(t.flags | vn.MoreComing, r);
    ee(this, Qi);
    ee(this, cn, 0);
    ee(this, Ys, 0);
    ee(this, wf);
    t.isReply ? (Ue(t.hasNumber, "Outgoing reply must have a number"), this.msgNo = t.number) : Ue(!t.hasNumber, "Outgoing request must not have a number yet"), G(this, Qi, t.encodeBinary()), G(this, cn, 0);
  }
  /** Returns the next frame to send, as a {@link Uint8Array}. */
  nextFrame(t) {
    const r = p(this, Qi).length - p(this, cn);
    Ue(r > 0);
    const i = Math.min(r, If.MaxFrameSize - Yv), o = i + Yv, a = new ArrayBuffer(o), l = new Uint8Array(a);
    let c = Ns(l, 0, this.msgNo);
    i === r && (this.flags &= ~vn.MoreComing), c = Ns(l, c, this.flags);
    const b = p(this, Qi).slice(p(this, cn), p(this, cn) + i);
    l.set(b, c), G(this, cn, p(this, cn) + i), G(this, Ys, p(this, Ys) + i), c += i;
    const m = t.add(b);
    return new DataView(l.buffer, l.byteOffset).setUint32(c, m), c += 4, l.subarray(0, c);
  }
  receivedACK(t) {
    G(this, Ys, Math.max(0, p(this, cn) - t));
  }
  /** Becomes true when the message has been completely sent. */
  get needsACK() {
    return p(this, Ys) > xb;
  }
  /** Becomes true when the message has been completely sent. */
  get finished() {
    return p(this, cn) >= p(this, Qi).length;
  }
}
Qi = new WeakMap(), cn = new WeakMap(), Ys = new WeakMap(), wf = new WeakMap();
var Go;
class kb extends M0 {
  constructor(t, r, i, o) {
    const a = t ? Dr.ACKRPY : Dr.ACKMSG;
    super(a | ds.Urgent | ds.NoReply, null);
    ee(this, Go);
    this.msgNo = r, G(this, Go, i), this.logger = o;
  }
  nextFrame(t) {
    const r = new ArrayBuffer(10), i = new Uint8Array(r);
    let o = Ns(i, 0, this.msgNo);
    return o = Ns(i, o, this.flags), o = Ns(i, o, p(this, Go)), i.subarray(0, o);
  }
  get needsACK() {
    return !1;
  }
  get finished() {
    return !0;
  }
}
Go = new WeakMap();
var Ho, Vs, Sn, Wo, Js;
class Jv {
  constructor(e, t) {
    ve(this, "promiseKeeper");
    ee(this, Ho);
    ee(this, Vs);
    ee(this, Sn);
    ee(this, Wo, 0);
    ee(this, Js, 0);
    G(this, Ho, e), this.promiseKeeper = t;
  }
  /** Reads the next frame of the message.
   *  Returns a {@link Message} object when it's complete, else null. */
  addFrame(e, t, r, i) {
    if (G(this, Wo, p(this, Wo) + e.length), G(this, Js, p(this, Js) + e.length), p(this, Sn) === void 0)
      G(this, Vs, t & ~vn.MoreComing), G(this, Sn, []);
    else if ((t & ~vn.MoreComing) !== p(this, Vs))
      throw Error("Invalid frame: mismatched flags");
    const o = (t & vn.MoreComing) !== 0, a = e.subarray(0, e.length - 4);
    let l = null;
    if (t & ds.Compressed) {
      if (r.decompress(a, (m) => {
        p(this, Sn).push(m), l = i.add(m);
      }), l === null)
        throw Error("Inflate didn't produce any data");
    } else
      p(this, Sn).push(a), l = i.add(a);
    const b = new DataView(e.buffer, e.byteOffset).getUint32(e.length - 4);
    if (b !== l)
      throw Error("Invalid checksum: expected " + l.toString(16) + ", got " + b.toString(16));
    if (o)
      return null;
    {
      const m = P0(p(this, Sn));
      return G(this, Sn, []), Bo.decodedFromBinary(m, p(this, Vs), p(this, Ho));
    }
  }
  get bytesToAck() {
    return p(this, Js) >= wb ? (G(this, Js, 0), p(this, Wo)) : 0;
  }
}
Ho = new WeakMap(), Vs = new WeakMap(), Sn = new WeakMap(), Wo = new WeakMap(), Js = new WeakMap();
var Xi, eu, Jr, es, tu, Zs, ru, ts, Yo, Vo;
class Ob {
  constructor() {
    ve(this, "logger", uh);
    ee(this, Xi, !0);
    // Outgoing:
    ee(this, eu, 0);
    ee(this, Jr, []);
    ee(this, es, []);
    ee(this, tu, new Vv());
    // Incoming:
    ee(this, Zs, 0);
    ee(this, ru, /* @__PURE__ */ new Map());
    ee(this, ts, /* @__PURE__ */ new Map());
    ee(this, Yo, new Eb());
    ee(this, Vo, new Vv());
  }
  /** Adds an outgoing {@link message} to the queue to be sent.
      Returns a promise of a reply. The message must not have the {@link NoReply} option. */
  async send(e, t) {
    return Ue(p(this, Xi), "The connection is closed"), Ue(e.wantsReply, "send() with NoReply message"), new Promise((r, i) => {
      this._send(e, new Sb(r, i, t));
    });
  }
  /** Adds an outgoing {@link message} to the queue to be sent.
      The message must have the {@link NoReply} option. */
  sendNoReply(e) {
    Ue(p(this, Xi), "The connection is closed"), Ue(!e.wantsReply, "sendNoReply() with message that wants a reply"), this._send(e, null);
  }
  _send(e, t) {
    const r = new Ab(e, t);
    r.logger = this.logger, p(this, Jr).push(r);
  }
  /** Returns the next frame to send, or `null` if there's nothing pending. */
  nextFrameToSend() {
    const e = p(this, Jr).shift();
    if (e === void 0)
      return null;
    if (!e.msgNo) {
      const r = ++Nr(this, eu)._;
      e.msgNo = r, (e.flags & (vn.TypeMask | ds.NoReply)) === Dr.MSG && p(this, ts).set(r, new Jv(r, e.promiseKeeper));
    }
    const t = e.nextFrame(p(this, tu));
    return e.finished || (e.needsACK ? p(this, es).push(e) : p(this, Jr).push(e)), t;
  }
  /** Call this when a frame is received.
  When an incoming {@link Message} is completed it will be returned, else `null`. */
  handleIncomingFrame(e) {
    let t, r, i = 0;
    [t, i] = Pa(e, i), [r, i] = Pa(e, i);
    const o = t;
    if (e = e.subarray(i), r > 127)
      throw Error(`Invalid flags ${r.toString(16)}`);
    const a = r & vn.TypeMask;
    switch (a) {
      case Dr.MSG:
      case Dr.RPY:
      case Dr.ERR:
        return this.handleMessageFrame(r, o, e);
      case Dr.ACKMSG:
      case Dr.ACKRPY:
        return this.handleACKFrame(a, o, e), null;
      default:
        throw Error(`Received unknown frame type '${yf[a]}'`);
    }
  }
  handleMessageFrame(e, t, r) {
    if (r.length < 4)
      throw Error("Frame missing checksum");
    const o = (e & vn.TypeMask) !== Dr.MSG, a = o ? p(this, ts) : p(this, ru);
    let l = a.get(t);
    if (l) {
      const c = l.addFrame(r, e, p(this, Yo), p(this, Vo));
      if (c) {
        a.delete(t);
        const m = l.promiseKeeper;
        if (m)
          return c.isError && m.mode === "throw" ? m.reject(c.error) : m.resolve(c), null;
      }
      const b = l.bytesToAck;
      return b > 0 && p(this, Jr).push(new kb(o, t, b, this.logger)), c;
    } else {
      if (o)
        throw Error(`Invalid #${t} in RPY frame doesn't match any pending reply`);
      {
        if (t !== p(this, Zs) + 1)
          throw Error(`Invalid #${t} in incoming MSG frame; max is #${p(this, Zs) + 1}`);
        l = new Jv(t, null);
        const c = l.addFrame(r, e, p(this, Yo), p(this, Vo));
        return G(this, Zs, t), c || a.set(t, l), c;
      }
    }
  }
  handleACKFrame(e, t, r) {
    const i = e === Dr.ACKMSG ? Dr.MSG : Dr.RPY;
    let o = !1, a = p(this, Jr).find((b) => b.msgNo === t && b.type === i);
    if (!a && (o = !0, a = p(this, es).find((b) => b.msgNo === t && b.type === i), !a))
      return;
    let [l, c] = Pa(r, 0);
    if (c !== r.length)
      throw Error("Invalid contents in ACK frame");
    a.receivedACK(l), o && !a.needsACK && (c = p(this, es).indexOf(a), Ue(c >= 0), p(this, es).splice(c, 1), p(this, Jr).push(a));
  }
  /** True if there are no currently outgoing requests or incoming replies. */
  get safeToClose() {
    return p(this, Jr).length === 0 && p(this, ts).size === 0;
  }
  /** Call this when the connection closes.
   *  @param error  An error for rejecting Promises for request Messages that haven't been
   *                transmitted or are awaiting replies. */
  closed(e) {
    var t, r;
    if (p(this, Xi)) {
      G(this, Xi, !1);
      for (const i of p(this, Jr))
        (t = i.promiseKeeper) == null || t.reject(e);
      for (const i of p(this, ts).values())
        (r = i.promiseKeeper) == null || r.reject(e);
    }
  }
}
Xi = new WeakMap(), eu = new WeakMap(), Jr = new WeakMap(), es = new WeakMap(), tu = new WeakMap(), Zs = new WeakMap(), ru = new WeakMap(), ts = new WeakMap(), Yo = new WeakMap(), Vo = new WeakMap();
var Rs = null;
typeof WebSocket < "u" ? Rs = WebSocket : typeof MozWebSocket < "u" ? Rs = MozWebSocket : typeof global < "u" ? Rs = global.WebSocket || global.MozWebSocket : typeof window < "u" ? Rs = window.WebSocket || window.MozWebSocket : typeof self < "u" && (Rs = self.WebSocket || self.MozWebSocket);
const Rb = Rs, Tb = "BLIP_3";
var U0 = /* @__PURE__ */ ((n) => (n[n.Connecting = 0] = "Connecting", n[n.Open = 1] = "Open", n[n.Closing = 2] = "Closing", n[n.Closed = 3] = "Closed", n))(U0 || {});
class Cb {
  constructor() {
    ve(this, "logger", uh);
    ve(this, "events", /* @__PURE__ */ new Map());
    ve(this, "msgEvents", new ob());
    ve(this, "dispatching", !1);
  }
  /** Event target for incoming request messages, keyed by profile. */
  get incoming() {
    return this.msgEvents;
  }
  /** Adds a listener callback for the 'open', 'close' or 'message' event. */
  addEventListener(e, t) {
    let r = this.events.get(e);
    r ? r.push(t) : (r = Array(t), this.events.set(e, r));
  }
  /** Removes a listener callback. */
  removeEventListener(e, t) {
    const r = this.events.get(e);
    if (r) {
      const i = r.indexOf(t);
      i >= 0 && (this.dispatching ? r[i] = void 0 : r.splice(i, 1));
    }
  }
  /** Creates a {@link Message} and queues it to be sent.
   * @param props  The properties: either an object, or a string naming the `Profile` property.
   * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
   * @returns  A promise of a reply message.
   */
  async send(e, t = "", r = "throw") {
    return this.sendMessage(new vs(e, t), r);
  }
  /** Creates a {@link Message} and queues it to be sent with the {@link NoReply} option.
   * @param props  The properties: either an object, or a string naming the `Profile` property.
   * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
   */
  sendNoReply(e, t = "") {
    this.sendMessageNoReply(new vs(e, t, ds.NoReply));
  }
  /** Replies to a request message. */
  sendReplyTo(e, t, r = "") {
    this.sendReply(e.makeReply(t, r));
  }
  /** Replies to a request message with an error. */
  sendErrorReplyTo(e, t, r, i = "BLIP") {
    this.sendReply(e.makeErrorReply(t, r, i));
  }
  sendReply(e) {
    Ue(e.isReply), this.sendMessageNoReply(e);
  }
  dispatchEvent(e, t) {
    const r = this.events.get(e);
    if (r && r.length > 0) {
      this.dispatching = !0;
      for (const i of r)
        try {
          i && i(t);
        } catch (o) {
          this.logger.error(
            "blip.dispatchEvent({event}) caught {exception}",
            { event: e, exception: o }
          );
        }
      return this.dispatching = !1, !0;
    }
    return !1;
  }
}
var rr, dr, Qs, si, An, Xs;
class Nb extends Cb {
  /** Creates and (asynchronously) opens a BLIP connection via a WebSocket.
   * @param url  The `ws:` or `wss:` URL to connect to.
   * @param protocol  The subprotocol of BLIP, to be appended to the WebSocket protocol requested.
   * @param options  Additional for use in node/Bun/Deno. Ignored in a browser. */
  constructor(t, r = "", i) {
    super();
    ee(this, rr);
    ee(this, dr, new Ob());
    ee(this, Qs, !1);
    ee(this, si, !1);
    ee(this, An, 0);
    ee(this, Xs, 0);
    ve(this, "timeReceiving", 0);
    ve(this, "timeWaiting", 0);
    ve(this, "timeSending", 0);
    this.logger = this.logger.with({ url: t }), p(this, dr).logger = this.logger;
    const o = [];
    r !== "" && o.push(Tb + "+" + r), i != null && i.oneTimeToken && o.push(`SyncGatewaySession_${i.oneTimeToken}`);
    let a;
    (i == null ? void 0 : i.credentials) !== void 0 && (a = { headers: { Authorization: bg(i.credentials.username, i.credentials.password) } }), G(this, rr, new Rb(t, o, a)), p(this, rr).binaryType = "arraybuffer", p(this, rr).onopen = this.handleWSOpen.bind(this), p(this, rr).onmessage = this.handleWSMessage.bind(this), p(this, rr).onclose = this.handleWSClose.bind(this), p(this, rr).onerror = this.handleWSError.bind(this);
  }
  /** Returns the WebSocket's ready-state. */
  get readyState() {
    return p(this, rr).readyState;
  }
  /** Closes the connection.
   *  @param code  The WebSocket status code. 1000, the default value, means a normal close;
   *               in this case the Socket will wait until all outgoing messages are sent and
   *               incoming messages are received, then close. Other values are considered
   *               abnormal and cause the WebSocket to close _immediately_; any pending message
   *               Promises will immediately fail with an error.
   *  @param reason  An optional message to go with the status code.
   */
  close(t = 1e3, r = "") {
    var i;
    Ue(t >= 1e3, "Close code must be >= 1000"), G(this, An, t), (t !== 1e3 || (i = p(this, dr)) != null && i.safeToClose) && p(this, rr).close(t, r);
  }
  /** Queues a {@link Message} object to be sent.
   * @param message  A Message object.
   * @returns  A promise of a reply message, or `null` if the {@link NoReply} option is set.
   */
  async sendMessage(t, r = "throw") {
    const i = this.preSend(t);
    if (i) {
      const o = i.send(t, r);
      return p(this, si) || this.sendFrames(), o;
    } else
      return Promise.reject(new gs("Connection is closed", -1));
  }
  /** Queues a {@link Message} object to be sent.
   * @param message  A Message object.
   */
  sendMessageNoReply(t) {
    var r;
    (r = this.preSend(t)) == null || r.sendNoReply(t), p(this, si) || this.sendFrames();
  }
  // Internals:
  handleWSOpen() {
    G(this, Qs, !0), this.dispatchEvent("open", void 0), this.sendFrames();
  }
  closed(t, r) {
    const i = p(this, dr);
    G(this, Qs, !1), G(this, dr, void 0), i == null || i.closed(t), this.dispatchEvent("close", r ? void 0 : t);
  }
  handleWSClose(t) {
    if (p(this, dr)) {
      const r = new Pb(t.code, t.reason), i = t.code === 1e3 && t.wasClean;
      this.closed(r, i);
    }
  }
  handleWSError(t) {
    let r = p(this, Qs) ? "Socket disconnected" : "WebSocket connection failed";
    t.message ? r += ": " + t.message : r += " (no information available)";
    const i = Error(r);
    this.closed(i, !1);
  }
  handleWSMessage(t) {
    var l, c;
    const r = globalThis.performance.now();
    p(this, Xs) > 0 && (this.timeWaiting += r - p(this, Xs));
    let i;
    if (t.data instanceof Uint8Array)
      i = t.data;
    else if (t.data instanceof ArrayBuffer)
      i = new Uint8Array(t.data);
    else {
      this.logger.warn("Ignoring WebSocket message of wrong type (not Uint8Array or ArrayBuffer)");
      return;
    }
    const o = (l = p(this, dr)) == null ? void 0 : l.handleIncomingFrame(i);
    o ? this.dispatchRequest(o) : p(this, si) || this.sendFrames(), p(this, An) !== 0 && ((c = p(this, dr)) != null && c.safeToClose) && p(this, rr).close(p(this, An));
    const a = globalThis.performance.now();
    this.timeReceiving += a - r, G(this, Xs, a);
  }
  dispatchRequest(t) {
    let r;
    try {
      !this.msgEvents.dispatchMessage(t) && !this.dispatchEvent("message", t) && (r = new gs("No handler", 404));
    } catch (i) {
      console.error(`dispatchRequest(${t.profile}) caught ${i}`), r = i;
    }
    if (r && t.wantsReply) {
      const i = "code" in r && typeof r.code == "number" ? r.code : -1;
      this.sendErrorReplyTo(t, r.message, i, r.name);
    }
  }
  // Sends frames until all messages are sent or the WebSocket closes.
  // If the amount of buffered data exceeds the maximum, it will pause and retry.
  sendFrames() {
    var i, o;
    const t = globalThis.performance.now();
    for (G(this, si, !1); p(this, rr).readyState === 1; ) {
      if (p(this, rr).bufferedAmount > If.MaxBufferedAmount) {
        this.logger.debug("**** PAUSING ****"), G(this, si, !0), setTimeout(
          () => {
            this.logger.debug("**** RESUMING ****"), this.sendFrames();
          },
          If.BufferDelayMS
        );
        return;
      }
      const a = (i = p(this, dr)) == null ? void 0 : i.nextFrameToSend();
      if (!a)
        break;
      p(this, rr).send(a);
    }
    p(this, An) !== 0 && ((o = p(this, dr)) != null && o.safeToClose) && p(this, rr).close(p(this, An));
    const r = globalThis.performance.now();
    this.timeSending += r - t;
  }
  preSend(t) {
    if (p(this, dr) && p(this, An) === 0)
      return p(this, dr);
    {
      const r = p(this, dr) ? "closing" : "closed";
      t.isReply ? this.logger.warn(`Will not send reply: connection is ${r}`) : this.logger.warn(`Will not send message: connection is ${r}`);
      return;
    }
  }
}
rr = new WeakMap(), dr = new WeakMap(), Qs = new WeakMap(), si = new WeakMap(), An = new WeakMap(), Xs = new WeakMap();
class Pb extends Error {
  constructor(e, t) {
    super(t ?? Db[e] ?? "WebSocket error"), this.code = e, this.reason = t;
  }
}
const Db = {
  // See <https://datatracker.ietf.org/doc/html/rfc6455#section-7.4.1>
  1e3: "Normal closure",
  1001: "Server going away",
  1002: "Protocol error",
  1003: "Unacceptable data type",
  1005: "No status code given",
  1006: "Connection closed unexpectedly by server",
  1007: "Invalid data in a message",
  1008: "Policy violation",
  1009: "Message too large",
  1010: "Missing extension on server",
  1011: "Unexpected condition",
  1015: "TLS handshake failed"
}, Bb = 2e3;
var vr, kn, zt, oi, fn, Zr, ai;
class Fb {
  constructor(e, t, r, i) {
    ve(this, "collectionID");
    ve(this, "collectionIndex");
    ve(this, "replicator");
    ee(this, vr);
    ee(this, kn);
    // The BLIP connection
    ee(this, zt);
    // Current checkpoint object
    ee(this, oi);
    // Server-side revid of checkpoint
    ee(this, fn);
    // Timer ID from `setTimeout`; for saving
    ee(this, Zr);
    // Outgoing `setCheckpoint` request
    ee(this, ai, !1);
    this.config = t, this.delegate = r, this.replicator = e.replicator, this.collectionID = e.collectionID, this.collectionIndex = e.collectionIndex, G(this, kn, e.socket), G(this, vr, this.replicator.logger.getChild(["chkpt", this.collectionID])), G(this, zt, t.initialCheckpoint ?? new mi());
    const o = G(this, oi, i._rev ?? ""), a = mi.fromObject(i);
    p(this, vr).debug`Checkpoint ID is ${t.clientID}. Current server revid is ${o}.`, t.reset ? (p(this, vr).info`Resetting checkpoint by request. Replication will be slower!`, G(this, zt, new mi())) : p(this, zt).empty ? o ? p(this, vr).warn`Checkpoint mismatch: No local checkpoint but server has ${a}. Resetting.` : p(this, vr).info`Neither local nor server checkpoint` : a && p(this, zt).equals(a) ? p(this, vr).info`Checkpoints match: ${a}` : (p(this, vr).warn`Checkpoint mismatch: I have ${p(this, zt)}, server has ${a}. Resetting.`, G(this, zt, new mi()));
  }
  stop() {
    this.stopTimer(), G(this, kn, void 0), G(this, ai, !1), G(this, Zr, void 0);
  }
  get idle() {
    return !p(this, fn) && !p(this, Zr);
  }
  get localSequence() {
    return p(this, zt).local;
  }
  get remoteSequence() {
    return p(this, zt).remote;
  }
  set localSequence(e) {
    Ue(p(this, kn) !== void 0), e !== p(this, zt).local && (p(this, zt).local = e, this.saveSoon());
  }
  set remoteSequence(e) {
    p(this, kn) && e !== p(this, zt).remote && (p(this, zt).remote = e, this.saveSoon());
  }
  /** If there are unsaved changes, begins saving them immediately. */
  saveASAP() {
    p(this, ai) && !p(this, Zr) && this.saveNow();
  }
  /** Mark that I have unsaved changes, and schedule a save after kSaveDelay. */
  saveSoon() {
    G(this, ai, !0), p(this, fn) === void 0 && G(this, fn, setTimeout(() => {
      G(this, fn, void 0), this.saveNow();
    }, Bb));
  }
  stopTimer() {
    p(this, fn) && (clearTimeout(p(this, fn)), G(this, fn, void 0));
  }
  async saveNow() {
    if (!p(this, kn) || !p(this, ai))
      return;
    p(this, vr).debug`saveNow (${p(this, zt)})`, this.stopTimer(), p(this, Zr) && await p(this, Zr), G(this, ai, !1);
    const e = JSON.stringify(p(this, zt)), t = {
      Profile: "setCheckpoint",
      collection: this.collectionIndex,
      client: this.config.clientID
    };
    p(this, oi) && (t.rev = p(this, oi)), p(this, vr).debug`sending setCheckpoint ${e} rev ${t.rev} ...`, G(this, Zr, p(this, kn).send(t, e, "nothrow"));
    const r = await p(this, Zr);
    if (G(this, Zr, void 0), r.error) {
      p(this, vr).error`Error saving checkpoint ${e} rev ${t.rev} to server: ${r.error.toString()}`;
      return;
    }
    G(this, oi, r.properties.rev), p(this, vr).debug`Saved checkpoint ${e} to server as rev ${p(this, oi)} ...`, await this.delegate.saveCheckpoint(
      this.collectionID,
      this.config.clientID,
      p(this, zt)
    ), p(this, vr).info`Saved checkpoint ${e}`, this.replicator.statusChanged_();
  }
  toString() {
    return `Checkpointer[${this.collectionID}]`;
  }
  // True when state needs saving
}
vr = new WeakMap(), kn = new WeakMap(), zt = new WeakMap(), oi = new WeakMap(), fn = new WeakMap(), Zr = new WeakMap(), ai = new WeakMap();
var Jo, ui, eo, to;
class $0 {
  constructor(e, t, r) {
    ve(this, "collectionID");
    ve(this, "collectionIndex");
    ve(this, "replicator");
    ve(this, "socket");
    ve(this, "checkpointer");
    ve(this, "logger");
    // Subclass should increment this to reflect number of revs pushed/pulled.
    ve(this, "_progress", 0);
    // Subclass should set this to true when it's caught up with the server
    ve(this, "caughtUp", !1);
    ee(this, Jo);
    ee(this, ui, !1);
    ee(this, eo, 0);
    ee(this, to, !1);
    this.collectionID = e.collectionID, this.collectionIndex = e.collectionIndex, this.replicator = e.replicator, this.socket = e.socket, this.checkpointer = e.checkpointer, this.logger = this.replicator.logger.getChild([r, this.collectionID]), G(this, Jo, t.continuous ?? !1);
  }
  get isCaughtUp() {
    return p(this, to);
  }
  get idle() {
    return p(this, ui);
  }
  get done() {
    return p(this, ui) && !p(this, Jo);
  }
  get progress() {
    return p(this, eo);
  }
  get socketOpen() {
    return this.socket.readyState === U0.Open;
  }
  // Subclass must call this after changing _progress or caughtUp, or when the result of
  // checkIdle may have changed.
  statusChanged() {
    const e = this.checkIdle();
    e !== p(this, ui) && this.logger.debug(e ? "Now idle" : "Now busy"), (e !== p(this, ui) || this._progress !== p(this, eo) || p(this, to) !== this.caughtUp) && (G(this, ui, e), G(this, eo, this._progress), G(this, to, this.caughtUp), setTimeout(() => this.replicator.statusChanged_(), 0));
  }
}
Jo = new WeakMap(), ui = new WeakMap(), eo = new WeakMap(), to = new WeakMap();
var rs, li;
class Lb {
  /// Constructor takes the latest checkpointed sequence.
  constructor(e) {
    ee(this, rs, /* @__PURE__ */ new Map());
    ee(this, li);
    G(this, li, e);
  }
  /// Adds a new pending sequence. Sequences are assumed to be in chronological order.
  addSequence(e) {
    if (p(this, rs).has(e))
      throw new zr(`RemoteSeqTracker.addSequence: sequence ${JSON.stringify(e)} already pending`, 500);
    p(this, rs).set(e, p(this, li)), G(this, li, e);
  }
  /// Records that a sequence is being skipped;
  /// behavior is equivalent to addSequence followed by finishedSequence.
  skipSequence(e) {
    G(this, li, e);
  }
  /// Records that a pending sequence is now complete.
  finishedSequence(e) {
    if (!p(this, rs).delete(e))
      throw new zr(`RemoteSeqTracker.finishedSequence: ${JSON.stringify(e)} was not pending`, 500);
  }
  getCheckpoint() {
    const e = p(this, rs).values().next();
    return e.done ? p(this, li) : e.value;
  }
}
rs = new WeakMap(), li = new WeakMap();
function j0(n) {
  if (Ir(n) && typeof n.digest == "string")
    return n;
}
function qb(n) {
  let e;
  const t = n._attachments;
  if (Ir(t))
    for (const r of Object.getOwnPropertyNames(t)) {
      const i = j0(t[r]);
      i && (e || (e = /* @__PURE__ */ new Set()), e.add(i.digest));
    }
  return e;
}
function Mb(n, e) {
  const t = n._attachments;
  if (Ir(t)) {
    for (const i of Object.getOwnPropertyNames(t)) {
      const o = j0(t[i]);
      if (o)
        if (i.startsWith("blob_/")) {
          const a = new su(o, e);
          r(a, i.substring(6).split("/")) ? delete t[i] : console.warn(`Document _attachments/${i} doesn't reference a blob`);
        } else
          t[i] = new Yy(o, e);
    }
    Object.keys(t).length === 0 && delete n._attachments;
  }
  function r(i, o) {
    let a = n, l = o.length;
    for (const c of o) {
      --l;
      let b;
      if (Ir(a)) {
        if (b = a[c], l === 0 && Ja(b))
          return a[c] = i, !0;
      } else if (ys(a)) {
        const m = Number(c);
        if (b = a[m], l === 0 && Ja(b))
          return a[m] = i, !0;
      } else
        return !1;
      a = b;
    }
    return !1;
  }
}
function Ub(n, e) {
  let t, r, i;
  return gf(n, (o, a) => {
    if (a[0] !== "_attachments") {
      const l = "blob_/" + a.join("/");
      t === void 0 && (t = Da(n, !1), r = Vy(t._attachments), r = r ? Da(r) : {}, t._attachments = r), i = i ?? bi(e), r[l] = {
        content_type: o.content_type,
        digest: o.digest,
        length: o.length,
        revpos: o.revpos ?? i,
        stub: !0
      };
    }
    return !0;
  }), t ?? n;
}
const $b = 200;
var On, ns, is, hn, ci, Fr, ss;
class jb extends $0 {
  constructor(t, r, i) {
    super(t, r, "pull");
    ee(this, On);
    // Manages the checkpoint
    ee(this, ns, []);
    // Unhandled 'changes' messages
    ee(this, is, !1);
    // True while in processChangesMessage()
    ee(this, hn, 0);
    // Number of `rev` msgs I'm waiting for
    ee(this, ci, 0);
    // Number of revs I'm waiting to insert
    ee(this, Fr, new Array());
    // Revs waiting to be added to db
    ee(this, ss, !1);
    this.config = r, this.delegate = i, G(this, On, new Lb(this.checkpointer.remoteSequence)), G(this, hn, 0), G(this, ci, 0);
    const o = {
      Profile: "subChanges",
      collection: this.collectionIndex
    };
    this.checkpointer.remoteSequence !== void 0 && (o.since = JSON.stringify(this.checkpointer.remoteSequence)), r.continuous && (o.continuous = "true"), this.config.channels && (o.filter = "sync_gateway/bychannel", o.channels = this.config.channels.join(",")), this.config.activeOnly && (o.activeOnly = "true"), (this.config.enableAutoPurge !== !1 || this.delegate.hasOnDocumentsCallback()) && (o.revocations = "true"), this.config.wantBatchSize && (o.batch = this.config.wantBatchSize);
    let a;
    r.documentIDs && (a = { docIDs: r.documentIDs }), this.logger.debug`Sending ${JSON.stringify(o)}`, this.socket.send(o, a);
  }
  checkIdle() {
    return Ue(p(this, hn) >= 0 && p(this, ci) >= 0), this.caughtUp && p(this, ns).length === 0 && !p(this, is) && p(this, hn) === 0 && p(this, ci) === 0 && !p(this, ss);
  }
  //-------- HANDLING CHANGES MESSAGES:
  // Number of revs to insert into db at once
  get batchSize() {
    return this.config.saveBatchSize ?? $b;
  }
  // Handler for incoming `changes` messages:
  onChanges(t) {
    this.canProcessChangesMessage() ? this.processChangesMessage(t) : (this.logger.debug`Puller queuing changes message #${t.number}`, p(this, ns).push(t), this.statusChanged());
  }
  canProcessChangesMessage() {
    var t;
    return this.socketOpen && !p(this, is) && (((t = p(this, Fr)) == null ? void 0 : t.length) ?? 0) + p(this, hn) < this.batchSize + 100;
  }
  maybeProcessChangesMessage() {
    if (p(this, ns).length > 0 && this.canProcessChangesMessage()) {
      const [t] = p(this, ns).splice(0, 1);
      this.processChangesMessage(t);
    }
  }
  async processChangesMessage(t) {
    const r = t.bodyJSON;
    if (r === null || r.length === 0)
      this.logger.debug`Got 'changes'#${t.number}: Puller has caught up`, this.caughtUp = !0, this.maybeInsertRevs(), t.wantsReply && this.socket.sendReplyTo(t, {});
    else {
      this.logger.debug`Got 'changes'#${t.number}: ${r.length} revs from seq ${r[0][0]}`, G(this, is, !0), this.statusChanged();
      try {
        const i = r.map((c) => {
          let b = Number(c[3] ?? 0), m;
          return b & 2 ? m = "revoked" : b & 4 && (m = "removed"), {
            id: c[1],
            rev: c[2],
            deleted: (b & 1) !== 0,
            lostAccess: m,
            bodySize: c[4] ? Number(c[4]) : null,
            remoteSequence: c[0]
          };
        });
        let o = !0;
        if (this.config.filter) {
          o = !1;
          for (const c of i)
            this.config.filter(c) ? o = !0 : c.skip = !0;
        }
        if (o && this.delegate.wantRevs)
          try {
            await this.delegate.wantRevs(i, this.caughtUp);
          } catch (c) {
            this.logger.error`wantRevs threw ${c}`, this.replicator.fatalError(c);
          }
        const a = Array(), l = i.map((c) => c.skip ? (p(this, On).skipSequence(c.remoteSequence), 0) : (++Nr(this, hn)._, p(this, On).addSequence(c.remoteSequence), c.knownRevs || a));
        this.socketOpen && (this.logger.debug`Puller replying to 'changes'#${t.number} (seq ${r[0][0]}+)`, this.socket.sendReplyTo(t, { maxHistory: 1 }, l)), this.checkpointer.remoteSequence = p(this, On).getCheckpoint();
      } finally {
        G(this, is, !1);
      }
    }
    this.statusChanged(), this.maybeProcessChangesMessage();
  }
  //-------- HANDLING REVISIONS:
  // Handler for incoming `rev` messages.
  onRev(t) {
    --Nr(this, hn)._, ++Nr(this, ci)._, p(this, Fr).push(t), this.maybeInsertRevs();
  }
  // Inserts all the `rev` messages in `insertable` by passing them to the `saveRevs` callback.
  async maybeInsertRevs() {
    if (p(this, ss)) return;
    const t = this.batchSize;
    for (; p(this, Fr).length > 0 && (p(this, Fr).length >= t || this.caughtUp && p(this, hn) === 0); ) {
      G(this, ss, !0);
      try {
        let r;
        p(this, Fr).length <= t ? (r = p(this, Fr), G(this, Fr, [])) : r = p(this, Fr).splice(0, t), this.logger.debug`Inserting ${r.length} of ${r.length + p(this, Fr).length} revs`, this.maybeProcessChangesMessage();
        const i = [];
        for (const o of r)
          if (o instanceof vs) {
            const a = this.decodeRevMsg(o);
            let l = qb(a.body);
            l ? this.processRevWithBlobs(a, l) : i.push(a);
          } else
            i.push(o);
        if (i.length > 0) {
          let o = !1;
          try {
            o = await this.delegate.saveRevs(i), o || this.logger.error`Failed to save revs`;
          } catch (a) {
            this.logger.error`Failed to save revs: caught ${a}`, this.replicator.fatalError(a);
            return;
          }
          i.forEach((a) => this.finishedRev(a, o)), this.checkpointer.remoteSequence = p(this, On).getCheckpoint(), o && (this._progress += i.length);
        }
      } finally {
        G(this, ss, !1), this.logger.debug`End insertRevs`, this.statusChanged();
      }
    }
    this.maybeProcessChangesMessage();
  }
  // Returns a RemoteRevision object created from a `rev` message.
  decodeRevMsg(t) {
    const r = t.bodyJSON;
    if (!T0(r))
      throw new gs("invalid revision body", 400);
    const i = r._id || t.property("id"), o = r._rev || t.property("rev");
    if (!gg(i) || !Jy(o))
      throw new gs("invalid id or rev property", 400);
    const a = r._deleted || t.property("deleted") !== "" ? 1 : void 0, l = t.property("history").split(/\s*,\s*/), c = JSON.parse(t.property("sequence"));
    return delete r._id, delete r._rev, delete r._deleted, { id: i, rev: o, deleted: a, body: r, history: l, remoteSequence: c, msg: t };
  }
  // Given a rev that contains blobs, first check with the delegate whether the blob digests
  // are known. If not, send a 'getAttachment' request to the server to download the blob.
  // Finally push the rev back into #insertable so it'll get inserted.
  async processRevWithBlobs(t, r) {
    let i = await this.delegate.missingBlobs(r);
    if (i && i.length > 0) {
      this.logger.info`Downloading ${i.length} blob(s) of doc ${t.id}`;
      const o = i.map(async (a) => this.socket.send({
        Profile: "getAttachment",
        collection: this.collectionIndex,
        docID: t.id,
        digest: a
      }).then(async (l) => (this.logger.info`Saving ${l.bodyData.length}-byte blob of doc "${t.id}"`, this.delegate.addBlob(a, l.bodyData)), (l) => {
        this.logger.error`Unable to download blob ${a} of doc ${t.id}: ${l.message}`;
      }));
      await Promise.all(o);
    }
    Mb(t.body, this.delegate.blobLoader), t.hasBlobs = !0, p(this, Fr).push(t), this.maybeInsertRevs();
  }
  // Called when a revision has been saved or rejected.
  finishedRev(t, r) {
    const i = t.msg;
    r ? (p(this, On).finishedSequence(t.remoteSequence), i.wantsReply && this.socket.sendReplyTo(i, {})) : i.wantsReply && this.socket.sendErrorReplyTo(i, "Failed to insert revision", 502), --Nr(this, ci)._ === 0 && this.statusChanged();
  }
  toString() {
    return `Puller[${this.collectionID}]`;
  }
  // True while revs are being added to db
}
On = new WeakMap(), ns = new WeakMap(), is = new WeakMap(), hn = new WeakMap(), ci = new WeakMap(), Fr = new WeakMap(), ss = new WeakMap();
const Kb = 200;
var os, Qr, fi, as, us;
class Zv extends $0 {
  constructor(t, r, i) {
    super(t, r, "push");
    ee(this, os);
    ee(this, Qr);
    ee(this, fi);
    ee(this, as, 0);
    ee(this, us, 0);
    this.config = r, this.delegate = i, G(this, fi, this.checkpointer.localSequence), G(this, Qr, new zb(p(this, fi))), r.documentIDs && G(this, os, new Set(r.documentIDs)), this.sendMoreChanges();
  }
  checkIdle() {
    return Ue(p(this, as) >= 0 && p(this, us) >= 0), this.caughtUp && p(this, as) === 0 && p(this, us) === 0;
  }
  async getMoreChanges() {
    const t = this.config.batchSize ?? Kb, r = p(this, fi);
    let i;
    do {
      this.logger.debug`Getting changes since seq ${r}`;
      const o = await this.delegate.getChanges(p(this, fi), t);
      i = {
        changes: o,
        since: r,
        atEnd: o.length === 0
      }, o.length > 0 && G(this, fi, o[o.length - 1].seq);
      const a = this.config.filter;
      (p(this, os) || a) && (i.changes = o.filter((l) => (!p(this, os) || p(this, os).has(l.id)) && (!a || a(l))));
    } while (i.changes.length === 0 && !i.atEnd);
    return i;
  }
  async sendMoreChanges() {
    let t;
    for (; ; ) {
      const r = await this.getMoreChanges();
      let i = p(this, Qr).max;
      const o = r.changes.length;
      if (o === 0) {
        if (this.caughtUp)
          return;
        if (this.logger.info`Done pushing existing revs, at sequence ${i}`, this.caughtUp = !0, this.statusChanged(), t && await Promise.all(t), this.checkpointer.saveNow(), this.config.continuous)
          continue;
        return;
      }
      const a = r.changes.map((c) => {
        const b = [c.id, c.rev, c.serverRev ?? ""];
        return c.deleted && b.push(!0), p(this, Qr).addSequence(c.seq), i = c.seq, b;
      });
      this.logger.debug`Proposing ${o} revs from seq ${r.changes[0].seq} -- ${i}`, ++Nr(this, as)._, this.statusChanged();
      const l = await this.socket.send({
        Profile: "proposeChanges",
        collection: this.collectionIndex
      }, a, "nothrow");
      if (--Nr(this, as)._, this.statusChanged(), t && await Promise.all(t), l.isError) {
        this.replicator.fatalError(l.error);
        return;
      } else {
        t = new Array();
        const c = l.bodyJSON;
        let b = 0;
        for (const m of r.changes) {
          const w = b < c.length ? c[b] : 0;
          switch (w) {
            case 0:
              t.push(this.sendRev(m));
              break;
            case 304:
              p(this, Qr).finishedSequence(m.seq);
              break;
            case 409:
            default:
              this.logger.error`Server rejected rev ${m.id} ${m.rev} with status ${JSON.stringify(w)}`, p(this, Qr).finishedSequence(m.seq);
              break;
          }
          ++b;
        }
        this.logger.debug`Server wants ${t.length} of ${o} revs`, this.checkpointer.localSequence = p(this, Qr).checkpointedSequence, this.statusChanged();
      }
    }
  }
  /** Sends a 'rev' message with a single document revision. */
  async sendRev(t) {
    var m, w;
    const r = {
      Profile: "rev",
      collection: this.collectionIndex,
      id: t.id,
      rev: t.rev
    };
    t.deleted && (r.deleted = 1);
    const i = [], o = t.serverRev ? bi(t.serverRev) : 0;
    for (let x = bi(t.rev) - 1; x > o; --x)
      i.push(`${x}-faded0001234567812345678`);
    t.serverRev && i.push(t.serverRev), i.length > 0 && (r.history = i.join(","));
    const a = JSON.stringify(Ub(t.body, t.rev));
    ++Nr(this, us)._, this.statusChanged();
    const l = await this.socket.send(r, a, "nothrow");
    --Nr(this, us)._, this.statusChanged();
    const c = l.error;
    let b = !0;
    c && (this.logger.error`Got error response to "rev" message ${t.id} ${t.rev} (seq ${t.seq}: ${c}`, c.blipErrorCode >= 500 && (b = !1)), b && (p(this, Qr).finishedSequence(t.seq), this.checkpointer.localSequence = p(this, Qr).checkpointedSequence, this._progress++, this.statusChanged(), (w = (m = this.delegate).pushedRev) == null || w.call(m, t, c));
  }
  // Server is asking for a blob's contents. This happens while I'm uploading a doc, and the
  // server doesn't have a blob matching a digest.
  async onGetAttachment(t) {
    const r = t.property("digest");
    this.logger.debug`Sending blob ${r}`;
    const i = await this.delegate.getBlob(r);
    i ? this.socket.sendReplyTo(t, {}, i) : this.socket.sendErrorReplyTo(t, "Unknown blob", 404);
  }
  toString() {
    return `Pusher[${this.collectionID}]`;
  }
}
os = new WeakMap(), Qr = new WeakMap(), fi = new WeakMap(), as = new WeakMap(), us = new WeakMap();
var ro, Rn;
class zb {
  /// Constructor takes the latest checkpointed sequence.
  constructor(e) {
    ee(this, ro, /* @__PURE__ */ new Map());
    ee(this, Rn);
    G(this, Rn, e ?? 0);
  }
  /// Adds a new pending sequence. Sequences are assumed to be in chronological order.
  addSequence(e) {
    if (e <= p(this, Rn))
      throw new zr(`LocalSeqTracker.addSequence: sequence ${e} out of order`, 500);
    p(this, ro).set(e, p(this, Rn)), G(this, Rn, e);
  }
  /// Records that a pending sequence is now complete.
  finishedSequence(e) {
    if (!p(this, ro).delete(e))
      throw new zr(`LocalSeqTracker.finishedSequence: ${e} was not pending`, 500);
  }
  get max() {
    return p(this, Rn);
  }
  get checkpointedSequence() {
    const e = p(this, ro).values().next();
    return e.done ? p(this, Rn) : e.value;
  }
}
ro = new WeakMap(), Rn = new WeakMap();
const Gb = "CBMobile_3", K0 = oh.getChild("Sync");
function Hb(n, e) {
  return n.status === e.status && n.error === e.error && n.pushedRevisions === e.pushedRevisions && n.pulledRevisions === e.pulledRevisions;
}
var Tn, hi, ls, Cn, gr, no, cs, pi, io, fs, so, oo, tg;
let Wb = (tg = class {
  constructor(e) {
    ve(this, "logger");
    ve(this, "onStatusChange");
    ee(this, Tn);
    // Indexes of this array are collection indexes
    ee(this, hi);
    // Resolves `run()` Promise
    ee(this, ls);
    // Rejects `run()` Promise
    ee(this, Cn);
    // Allows auth fetch to be canceled
    ee(this, gr);
    // BLIP socket
    ee(this, no, !1);
    // True once a BLIP close is OK
    ee(this, cs, []);
    // Checkpointers, by collection index
    ee(this, pi, []);
    // All the pushers & pullers (indexes arbitrary)
    ee(this, io, /* @__PURE__ */ new Map());
    // Pushers, keyed by collection index
    ee(this, fs, /* @__PURE__ */ new Map());
    // Pullers, keyed by collection index
    ee(this, so);
    // The last Status I notified of
    ee(this, oo);
    this.config = e, this.logger = K0.with({ url: e.url }), G(this, Tn, Object.keys(e.collections)), Ue(p(this, Tn).length > 0, "must replicate at least one Collection");
    for (const t of p(this, Tn)) {
      const r = e.collections[t];
      Ue(r.push || r.pull, `collection '${t}' must be either pushed or pulled`);
    }
  }
  /** Starts the replicator. Completes when the replicator finishes (never if continuous.) */
  async run() {
    yr(!this.running, "Replicator is already running");
    let e = Qv(this.config.url, "_blipsync");
    yr(
      e.protocol === "wss:" || e.protocol === "ws:",
      "Replicator URL must have scheme wss: or ws:"
    );
    let t = {};
    return this.config.credentials && (typeof window < "u" ? t.oneTimeToken = await this.authenticate(this.config.credentials) : t.credentials = this.config.credentials), new Promise((r, i) => {
      G(this, hi, r), G(this, ls, i), G(this, no, !1), this.logger.info`Connecting to <${this.config.url}>...`, G(this, gr, new Nb(e, Gb, t)), p(this, gr).addEventListener("open", () => {
        this.logger.info`Connected!`, this.maybeNotifyStatus();
      }), p(this, gr).addEventListener("close", (o) => {
        o ? (this.logger.info`Connection closed with error: ${o}`, this.fatalError(o)) : p(this, no) ? (this.logger.info`Connection closed`, this.finish()) : (this.logger.info`Connection closed unexpectedly`, this.finish(new zr("BLIP connection closed unexpectedly")));
      }), this.maybeNotifyStatus(), this.start();
    });
  }
  /** Authenticates to the server. Returns an (optional) session-id token. */
  async authenticate(e) {
    let t = Qv(this.config.url, "_session");
    t.protocol === "wss:" ? t.protocol = "https:" : (t.protocol = "http:", t.hostname !== "localhost" && t.hostname !== "127.0.0.1" && this.logger.warn`Sending credentials INSECURELY over a non-TLS connection!`), t.searchParams.append("one_time", "true"), this.logger.info`Authenticating to ${t.toString()} as user ${e.username}`;
    let r;
    try {
      if (G(this, Cn, new AbortController()), this.maybeNotifyStatus(), r = await fetch(t, {
        method: "POST",
        headers: {
          Authorization: bg(e.username, e.password)
        },
        credentials: "include",
        mode: "cors",
        signal: p(this, Cn).signal
      }), r.status >= 300)
        throw this.logger.error`Authentication failed: ${r.status} ${r.statusText}`, r.status === 401 ? new zr("Authentication failed; username or password not valid.", 401) : new zr(`Authentication failed. [${r.status} ${r.statusText}]`, r.status);
    } catch (o) {
      throw o instanceof Error && o.name === "AbortError" ? (this.logger.error`Authentication request was canceled`, new zr("Authentication request was canceled", 401)) : (this.logger.error`Authentication failed; fetch threw ${o}`, new zr(`Authentication failed; this may be due to an invalid URL, a network problem, or the server's CORS settings. [${o}]`, 401));
    } finally {
      G(this, Cn, void 0);
    }
    let i;
    if (r.body) {
      const o = await r.json();
      Ir(o) && (i = o.one_time_session_id, typeof i != "string" && (i = void 0));
    }
    return i ? this.logger.info`Successfully authenticated (and got a one-time session ID)` : this.logger.info`Successfully authenticated`, i;
  }
  async start() {
    Nn(p(this, gr));
    const e = p(this, Tn).map(
      (i) => this.config.collections[i].checkpoint.clientID
    ), t = await p(this, gr).send("getCollections", {
      collections: p(this, Tn),
      // eslint-disable-next-line camelcase
      checkpoint_ids: e
    });
    let r = 0;
    for (const i of t.bodyJSON) {
      const o = p(this, Tn)[r];
      if (i === null) {
        this.fatalError(new zr(`Collection '${o}' does not exist on the server`, 404));
        return;
      }
      const a = {
        replicator: this,
        socket: p(this, gr),
        collectionID: o,
        collectionIndex: r
      }, l = this.config.collections[o], c = new Fb(
        a,
        l.checkpoint,
        l.checkpoint.delegate,
        i
      );
      p(this, cs).push(c);
      const b = { ...a, checkpointer: c };
      if (l.push) {
        const m = new Zv(b, l.push, l.push.delegate);
        p(this, io).set(r, m), p(this, pi).push(m);
      }
      if (l.pull) {
        const m = new jb(b, l.pull, l.pull.delegate);
        p(this, fs).set(r, m), p(this, pi).push(m);
      }
      ++r;
    }
    p(this, io).size > 0 && p(this, gr).incoming.addEventListener("getAttachment", (i) => {
      p(this, io).get(i.numericProperty("collection")).onGetAttachment(i);
    }), p(this, fs).size > 0 && (p(this, gr).incoming.addEventListener("changes", (i) => {
      p(this, fs).get(i.numericProperty("collection")).onChanges(i);
    }), p(this, gr).incoming.addEventListener("rev", (i) => {
      p(this, fs).get(i.numericProperty("collection")).onRev(i);
    }));
  }
  /** Stops the replicator, if it's running. */
  stop() {
    var e;
    this.running && (this.logger.info`Replicator.stop called!`, (e = p(this, Cn)) == null || e.abort(), this.finish());
  }
  get status() {
    var t;
    if (p(this, Cn) !== void 0)
      return { status: "connecting" };
    let e = { status: "busy" };
    if (p(this, pi).length > 0) {
      e.status = "idle";
      for (const r of p(this, pi))
        r instanceof Zv ? e.pushedRevisions = (e.pushedRevisions ?? 0) + r.progress : e.pulledRevisions = (e.pulledRevisions ?? 0) + r.progress, r.idle || (e.status = "busy");
    }
    switch ((t = p(this, gr)) == null ? void 0 : t.readyState) {
      case WebSocket.CONNECTING:
        e.status = "connecting";
        break;
      case WebSocket.CLOSED:
      case void 0:
        e.status = "stopped", p(this, oo) && (e.error = p(this, oo));
        break;
    }
    return e;
  }
  get running() {
    return p(this, hi) !== void 0 || p(this, Cn) !== void 0;
  }
  statusChanged_() {
    if (p(this, pi).every((e) => e.done)) {
      if (p(this, cs).every((e) => e.idle)) {
        this.finish();
        return;
      }
      this.logger.debug`Replication is complete; now saving checkpoints`;
      for (const e of p(this, cs))
        e.idle || e.saveASAP();
    }
    this.maybeNotifyStatus();
  }
  maybeNotifyStatus() {
    const e = this.status;
    (!p(this, so) || !Hb(e, p(this, so))) && (this.logger.info`Status: ${e}`, G(this, so, e), this.onStatusChange && this.running && this.onStatusChange(e));
  }
  // Completes a run by cleaning up state and resolving or rejecting `run`s Promise.
  finish(e) {
    var t;
    if (e) {
      if (G(this, oo, e), this.logger.error`Stopped with error: ${e}`, e instanceof gs) {
        const r = e;
        e = new zr(e.message, e.blipErrorCode), e.cause = r;
      }
    } else
      this.logger.info`Finished`;
    for (const r of p(this, cs))
      r.stop();
    G(this, no, !0), (t = p(this, gr)) == null || t.close(), G(this, gr, void 0), this.maybeNotifyStatus(), e ? p(this, ls) && p(this, ls).call(this, e) : p(this, hi) && p(this, hi).call(this), G(this, hi, void 0), G(this, ls, void 0);
  }
  fatalError(e) {
    this.logger.error`Sync fatal error: ${e}`, this.finish(e);
  }
  // Connection error
}, Tn = new WeakMap(), hi = new WeakMap(), ls = new WeakMap(), Cn = new WeakMap(), gr = new WeakMap(), no = new WeakMap(), cs = new WeakMap(), pi = new WeakMap(), io = new WeakMap(), fs = new WeakMap(), so = new WeakMap(), oo = new WeakMap(), tg);
function Qv(n, e) {
  let t = new URL(n);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t.pathname += e, t;
}
var Xr, Zo;
class p_ {
  constructor(e) {
    /** The local database being replicated. */
    ve(this, "database");
    /** Callback that notifies when {@link status} changes. */
    ve(this, "onStatusChange");
    /** Callback that notifies when documents have been pushed or pulled.
     *
     * Note: To receive lost-access (revocation) notifications from the pull replicator
     * when auto-purge is disabled, this callback must be registered *before*
     * starting the pull replicator. */
    ve(this, "onDocuments");
    ve(this, "logger");
    ee(this, Xr);
    // Actual replicator, while it's running
    ee(this, Zo, {});
    this.config = e, this.database = e.database, this.logger = K0.with({ url: e.url });
    const t = Object.keys(this.config.collections);
    Ue(t.length > 0, "At least one collection must be replicated");
    for (const r of t)
      this.database.getCollection(r);
  }
  /** Current replication status & progress. */
  get status() {
    var e;
    return ((e = p(this, Xr)) == null ? void 0 : e.status) ?? p(this, Zo);
  }
  /** Runs the replicator.
   *
   * This is an async operation. The returned Promise resolves when the replication completes.
   * A continuous replication usually _never_ completes, unless it encounters a fatal error or
   * you stop it, so you may not want to `await` it. */
  async run() {
    Ue(!p(this, Xr), "Replicator is already running");
    const e = {
      database: this.config.database.name,
      url: this.config.url,
      credentials: this.config.credentials ? { username: this.config.credentials.username } : void 0,
      collections: this.config.collections
    };
    this.logger.info`Starting replicator with configuration: ${e}`;
    let t = {
      url: this.config.url,
      credentials: this.config.credentials,
      collections: {}
    };
    for (let r of Object.keys(this.config.collections)) {
      const i = this.config.collections[r], o = this.database.getCollection(r), a = await this.getCheckpointID(o), l = i.resetCheckpoint, c = l ? void 0 : await o.getCheckpoint(a);
      let b = {
        checkpoint: { clientID: a, initialCheckpoint: c, reset: l, delegate: this }
      };
      if (i.pull) {
        const m = await o.count("includeDeleted") === 0, w = new Vb(this, o, i.pull, m);
        b.pull = { ...i.pull, documentIDs: i.documentIDs, delegate: w }, m && (b.pull.activeOnly = !0);
      }
      if (i.push) {
        const m = new Yb(this, o, i.push);
        b.push = { ...i.push, documentIDs: i.documentIDs, delegate: m };
      }
      t.collections[r] = b;
    }
    G(this, Xr, new Wb(t)), p(this, Xr).onStatusChange = this.onStatusChange;
    try {
      await p(this, Xr).run();
    } finally {
      G(this, Zo, p(this, Xr).status), G(this, Xr, void 0);
    }
    this.logger.info`FINISHED! ${JSON.stringify(this.status)}`;
  }
  /** Stops the replicator. The current {@link run} operation's Promise will resolve with
   *  an error as soon as possible.
   *
   *  Does nothing if `run` is not active. */
  stop() {
    var e;
    (e = p(this, Xr)) == null || e.stop();
  }
  /** Returns the checkpoint ID that will be used for a collection. @internal */
  async getCheckpointID(e) {
    var i, o, a, l, c;
    const t = this.config.collections[e.name], r = [
      await e.getUUID(),
      // Collection ID
      this.config.url,
      // Remote database URL
      ((i = t.documentIDs) == null ? void 0 : i.toSorted()) ?? null,
      // Documents filter
      ((a = (o = t.pull) == null ? void 0 : o.channels) == null ? void 0 : a.toSorted()) ?? null,
      // Channel filter
      !!((l = t.pull) != null && l.filter),
      // Custom pull filter present (boolean)
      !!((c = t.push) != null && c.filter)
      // Custom push filter present (boolean)
    ];
    return new Cf.sha1().update(JSON.stringify(r)).digest("base64");
  }
  //-------- Checkpointer delegate implementation
  /** Saves a checkpoint to the local database. @internal */
  async saveCheckpoint(e, t, r) {
    await this.database.getCollection(e).setCheckpoint(t, r);
  }
  // Final status of the Replicator
}
Xr = new WeakMap(), Zo = new WeakMap();
class z0 {
  constructor(e, t, r) {
    ve(this, "logger");
    this.replicator = e, this.collection = t, this.logger = e.logger.with({ collection: t.name, dir: r });
  }
}
var Qo, di, pn, vi;
class Yb extends z0 {
  constructor(t, r, i) {
    super(t, r, "push");
    ee(this, Qo, !1);
    ee(this, di);
    ee(this, pn);
    // docs whose serverRevIDs to update
    ee(this, vi);
    this.config = i;
  }
  async getChanges(t, r) {
    const i = this.collection, o = await this.getDocsSinceSequence(t, r);
    if (this.replicator.status.status === "stopped")
      return [];
    if (o.length > 0 || !this.config.continuous)
      return o;
    if (p(this, Qo)) {
      Ue(!p(this, di)), G(this, di, Promise.withResolvers());
      let a;
      const l = () => {
        var b;
        a.remove();
        const c = (b = p(this, di)) == null ? void 0 : b.resolve;
        c && (this.logger.info`Notifying Pusher of changes to collection ${i.name}`, G(this, di, void 0), c(this.getDocsSinceSequence(t, r)));
      };
      return a = i.addChangeListener(l), this.logger.info`Pusher is watching for changes to collection ${i.name}`, p(this, di).promise;
    } else
      return G(this, Qo, !0), o;
  }
  async getDocsSinceSequence(t, r) {
    var o, a;
    const i = await this.collection.getDocsSinceSequence(t, r);
    if (i.length > 0 && (p(this, pn) || p(this, vi)))
      for (const l of i) {
        const c = ((o = p(this, pn)) == null ? void 0 : o.get(l.id)) ?? ((a = p(this, vi)) == null ? void 0 : a.get(l.id));
        Df(c, l.serverRev) && (l.serverRev = c);
      }
    return i;
  }
  async getBlob(t) {
    return await this.collection.database.blobStore.getBlob(t);
  }
  pushedRev(t, r) {
    if (!r) {
      let i = p(this, pn);
      i || (i = /* @__PURE__ */ new Map(), G(this, pn, i)), i.set(t.id, t.rev), this.updateServerRevsNow();
    }
    this.notifyDocEnded(t, r);
  }
  updateServerRevsNow() {
    let t = p(this, pn);
    t && !p(this, vi) && (this.logger.debug`Updating serverRev property of ${t.size} pushed docs`, G(this, pn, void 0), G(this, vi, t), this.collection.updateServerRevs(t).catch((r) => this.logger.error`Error updating local serverRevs: ${r}`).finally(() => {
      G(this, vi, void 0), p(this, pn) && this.updateServerRevsNow();
    }));
  }
  notifyDocEnded(t, r) {
    this.replicator.onDocuments && this.replicator.onDocuments(this.collection, "push", [{
      docID: t.id,
      deleted: !!t.deleted,
      error: r
    }]);
  }
  // docs being updated right now
}
Qo = new WeakMap(), di = new WeakMap(), pn = new WeakMap(), vi = new WeakMap();
class Vb extends z0 {
  constructor(t, r, i, o) {
    super(t, r, "pull");
    ve(this, "blobLoader");
    this.config = i, this.startedEmpty = o, this.blobLoader = this.collection.database.blobLoader;
  }
  async wantRevs(t, r) {
    var o, a;
    if (r)
      this.startedEmpty = !1;
    else if (this.startedEmpty)
      return;
    const i = [];
    await this.collection.inTransaction(pf, async (l) => {
      for (const c of t)
        if (c.lostAccess && !c.deleted)
          c.skip = !0, i.push({ docID: c.id, lostAccess: c.lostAccess });
        else if (!c.skip) {
          const b = await l.getAncestorRevs(c.id, c.rev);
          b ? c.knownRevs = b : c.skip = !0;
        }
    }), i.length > 0 && (this.config.enableAutoPurge !== !1 && await this.collection.purgeMultiple(i.map((l) => l.docID)), (a = (o = this.replicator).onDocuments) == null || a.call(o, this.collection, "pull", i));
  }
  async saveRevs(t) {
    const r = this.collection;
    this.logger.debug`Collection ${r.name} saving ${t.length} documents...`;
    const i = Date.now(), { lastSequence: o, conflicts: a } = await r.putRemoteRevisions(t, this.startedEmpty);
    if (this.logger.info`Collection ${r.name} saved ${t.length} documents, ${(a == null ? void 0 : a.size) ?? 0} conflicts, as sequences thru ${o}, in ${Date.now() - i}ms`, this.replicator.onDocuments) {
      a && (t = t.filter((c) => !a.has(c.id)));
      const l = t.map((c) => ({ docID: c.id, deleted: !!c.deleted }));
      this.replicator.onDocuments(r, "pull", l);
    }
    return a && this.resolveConflicts(a), !0;
  }
  async missingBlobs(t) {
    let r;
    for (const i of t)
      await this.collection.database.blobStore.hasBlob(i) || (r || (r = []), r.push(i));
    return r;
  }
  async addBlob(t, r) {
    const i = uo.computeDigest(r);
    if (t !== i)
      throw new zr(`Requested blob digest '${t}' but the data's digest is '${i}'`, 400);
    await this.collection.database.blobStore.saveBlob(r, t);
  }
  hasOnDocumentsCallback() {
    return !!this.replicator.onDocuments;
  }
  async resolveConflicts(t) {
    const r = this.collection, i = this.config.conflictResolver ?? Jb;
    for (const o of t)
      try {
        let a, l;
        do {
          a = await r.getRevision(o, !0);
          const c = a == null ? void 0 : a.conflict;
          if (a === void 0 || c === void 0)
            break;
          let b = {
            id: a.id,
            rev: a.rev,
            deleted: Bi(a) ? 1 : void 0,
            body: a.body
          }, m = {
            id: a.id,
            rev: a.serverRev,
            deleted: c === null ? 1 : void 0,
            body: c ?? {}
          };
          const w = await i(r, b, m);
          l = w.deleted ? null : w.body;
        } while (!await r.resolveConflict(o, a.rev, l));
        if (this.replicator.onDocuments) {
          const c = { docID: o, deleted: l === null };
          this.replicator.onDocuments(r, "pull", [c]);
        }
      } catch (a) {
        this.logger.error`Exception resolving conflict in in ${r.name} doc ${o}: ${a}`;
      }
  }
}
async function Jb(n, e, t) {
  return e.deleted !== t.deleted ? e.deleted ? e : t : Df(e.rev, t.rev) ? e : t;
}
var ao;
class _f {
  constructor(e) {
    ee(this, ao);
    G(this, ao, e);
  }
  remove() {
    var e;
    (e = p(this, ao)) == null || e.call(this), G(this, ao, void 0);
  }
  [Symbol.dispose]() {
    this.remove();
  }
}
ao = new WeakMap();
const d_ = "1.0.0-2", v_ = 1;
export {
  v_ as APIVersion,
  eb as ArrayIndex,
  Nf as Blob,
  Ts as Collection,
  tb as ConflictError,
  yi as Database,
  Ca as DefaultCollectionName,
  Xb as DocID,
  fu as EncryptionError,
  su as ExistingBlob,
  Ya as InterruptedQueryError,
  c_ as LastWriteWins,
  _f as ListenerToken,
  R0 as LogCategory,
  f_ as MostWritesWins,
  Tv as MultipleConflictsError,
  Lr as N1QLParseError,
  uo as NewBlob,
  $I as Query,
  yI as RegisterUserFunction,
  p_ as Replicator,
  zr as ReplicatorError,
  jn as ValueIndex,
  d_ as Version,
  Kn as meta
};
//# sourceMappingURL=couchbase-lite.es.js.map
