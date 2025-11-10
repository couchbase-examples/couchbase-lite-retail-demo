var dy = Object.defineProperty;
var zh = (n) => {
  throw TypeError(n);
};
var vy = (n, e, t) => e in n ? dy(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var ve = (n, e, t) => vy(n, typeof e != "symbol" ? e + "" : e, t), ju = (n, e, t) => e.has(n) || zh("Cannot " + t);
var p = (n, e, t) => (ju(n, e, "read from private field"), t ? t.call(n) : e.get(n)), ee = (n, e, t) => e.has(n) ? zh("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), G = (n, e, t, r) => (ju(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t), ye = (n, e, t) => (ju(n, e, "access private method"), t);
var Nr = (n, e, t, r) => ({
  set _(i) {
    G(n, e, i, t);
  },
  get _() {
    return p(n, e, r);
  }
});
function De(n, e = "", ...t) {
  n || Lo(e, ...t);
}
function yi(n, e) {
  n === void 0 && Lo(`${e ?? "something"} is unexpectedly undefined`);
}
function gy(n, e, t = "value") {
  n !== e && Lo(`${t} should be ${e} but is actually ${n}`);
}
function Lo(n, ...e) {
  const t = Error("Assertion failed: " + n);
  throw console.error(n || "Assertion failed: ", ...e), t.stack && console.error(t.stack), t;
}
function mr(n, e, t) {
  if (!n)
    throw console.error(`Check failed: ${e}`), new (t ?? Error)(e);
}
function Gh(n, e) {
  return mr(typeof n == "number", `${e ?? "value"} must be a number`, TypeError), n;
}
function yy(n, e) {
  return mr(typeof n == "string", "value must be a string", TypeError), n;
}
var Sf = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Af(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ku = { exports: {} }, Sa = { exports: {} }, Hh;
function po() {
  return Hh || (Hh = 1, typeof Object.create == "function" ? Sa.exports = function(e, t) {
    t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : Sa.exports = function(e, t) {
    if (t) {
      e.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
    }
  }), Sa.exports;
}
var Aa = { exports: {} }, zu = {}, Ro = {}, Wh;
function my() {
  if (Wh) return Ro;
  Wh = 1, Ro.byteLength = l, Ro.toByteArray = I, Ro.fromByteArray = x;
  for (var n = [], e = [], t = typeof Uint8Array < "u" ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, o = r.length; i < o; ++i)
    n[i] = r[i], e[r.charCodeAt(i)] = i;
  e[45] = 62, e[95] = 63;
  function u(k) {
    var D = k.length;
    if (D % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var K = k.indexOf("=");
    K === -1 && (K = D);
    var C = K === D ? 0 : 4 - K % 4;
    return [K, C];
  }
  function l(k) {
    var D = u(k), K = D[0], C = D[1];
    return (K + C) * 3 / 4 - C;
  }
  function c(k, D, K) {
    return (D + K) * 3 / 4 - K;
  }
  function I(k) {
    var D, K = u(k), C = K[0], M = K[1], J = new t(c(k, C, M)), X = 0, le = M > 0 ? C - 4 : C, ce;
    for (ce = 0; ce < le; ce += 4)
      D = e[k.charCodeAt(ce)] << 18 | e[k.charCodeAt(ce + 1)] << 12 | e[k.charCodeAt(ce + 2)] << 6 | e[k.charCodeAt(ce + 3)], J[X++] = D >> 16 & 255, J[X++] = D >> 8 & 255, J[X++] = D & 255;
    return M === 2 && (D = e[k.charCodeAt(ce)] << 2 | e[k.charCodeAt(ce + 1)] >> 4, J[X++] = D & 255), M === 1 && (D = e[k.charCodeAt(ce)] << 10 | e[k.charCodeAt(ce + 1)] << 4 | e[k.charCodeAt(ce + 2)] >> 2, J[X++] = D >> 8 & 255, J[X++] = D & 255), J;
  }
  function y(k) {
    return n[k >> 18 & 63] + n[k >> 12 & 63] + n[k >> 6 & 63] + n[k & 63];
  }
  function _(k, D, K) {
    for (var C, M = [], J = D; J < K; J += 3)
      C = (k[J] << 16 & 16711680) + (k[J + 1] << 8 & 65280) + (k[J + 2] & 255), M.push(y(C));
    return M.join("");
  }
  function x(k) {
    for (var D, K = k.length, C = K % 3, M = [], J = 16383, X = 0, le = K - C; X < le; X += J)
      M.push(_(k, X, X + J > le ? le : X + J));
    return C === 1 ? (D = k[K - 1], M.push(
      n[D >> 2] + n[D << 4 & 63] + "=="
    )) : C === 2 && (D = (k[K - 2] << 8) + k[K - 1], M.push(
      n[D >> 10] + n[D >> 4 & 63] + n[D << 2 & 63] + "="
    )), M.join("");
  }
  return Ro;
}
var ka = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Yh;
function Iy() {
  return Yh || (Yh = 1, ka.read = function(n, e, t, r, i) {
    var o, u, l = i * 8 - r - 1, c = (1 << l) - 1, I = c >> 1, y = -7, _ = t ? i - 1 : 0, x = t ? -1 : 1, k = n[e + _];
    for (_ += x, o = k & (1 << -y) - 1, k >>= -y, y += l; y > 0; o = o * 256 + n[e + _], _ += x, y -= 8)
      ;
    for (u = o & (1 << -y) - 1, o >>= -y, y += r; y > 0; u = u * 256 + n[e + _], _ += x, y -= 8)
      ;
    if (o === 0)
      o = 1 - I;
    else {
      if (o === c)
        return u ? NaN : (k ? -1 : 1) * (1 / 0);
      u = u + Math.pow(2, r), o = o - I;
    }
    return (k ? -1 : 1) * u * Math.pow(2, o - r);
  }, ka.write = function(n, e, t, r, i, o) {
    var u, l, c, I = o * 8 - i - 1, y = (1 << I) - 1, _ = y >> 1, x = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, k = r ? 0 : o - 1, D = r ? 1 : -1, K = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (l = isNaN(e) ? 1 : 0, u = y) : (u = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -u)) < 1 && (u--, c *= 2), u + _ >= 1 ? e += x / c : e += x * Math.pow(2, 1 - _), e * c >= 2 && (u++, c /= 2), u + _ >= y ? (l = 0, u = y) : u + _ >= 1 ? (l = (e * c - 1) * Math.pow(2, i), u = u + _) : (l = e * Math.pow(2, _ - 1) * Math.pow(2, i), u = 0)); i >= 8; n[t + k] = l & 255, k += D, l /= 256, i -= 8)
      ;
    for (u = u << i | l, I += i; I > 0; n[t + k] = u & 255, k += D, u /= 256, I -= 8)
      ;
    n[t + k - D] |= K * 128;
  }), ka;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Vh;
function by() {
  return Vh || (Vh = 1, function(n) {
    const e = my(), t = Iy(), r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
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
    function u(S) {
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
        return _(S);
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
      const m = C(S);
      if (m) return m;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof S[Symbol.toPrimitive] == "function")
        return l.from(S[Symbol.toPrimitive]("string"), d, v);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof S
      );
    }
    l.from = function(S, d, v) {
      return c(S, d, v);
    }, Object.setPrototypeOf(l.prototype, Uint8Array.prototype), Object.setPrototypeOf(l, Uint8Array);
    function I(S) {
      if (typeof S != "number")
        throw new TypeError('"size" argument must be of type number');
      if (S < 0)
        throw new RangeError('The value "' + S + '" is invalid for option "size"');
    }
    function y(S, d, v) {
      return I(S), S <= 0 ? u(S) : d !== void 0 ? typeof v == "string" ? u(S).fill(d, v) : u(S).fill(d) : u(S);
    }
    l.alloc = function(S, d, v) {
      return y(S, d, v);
    };
    function _(S) {
      return I(S), u(S < 0 ? 0 : M(S) | 0);
    }
    l.allocUnsafe = function(S) {
      return _(S);
    }, l.allocUnsafeSlow = function(S) {
      return _(S);
    };
    function x(S, d) {
      if ((typeof d != "string" || d === "") && (d = "utf8"), !l.isEncoding(d))
        throw new TypeError("Unknown encoding: " + d);
      const v = X(S, d) | 0;
      let R = u(v);
      const m = R.write(S, d);
      return m !== v && (R = R.slice(0, m)), R;
    }
    function k(S) {
      const d = S.length < 0 ? 0 : M(S.length) | 0, v = u(d);
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
        const d = M(S.length) | 0, v = u(d);
        return v.length === 0 || S.copy(v, 0, 0, d), v;
      }
      if (S.length !== void 0)
        return typeof S.length != "number" || St(S.length) ? u(0) : k(S);
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
      let R = d.length, m = v.length;
      for (let T = 0, L = Math.min(R, m); T < L; ++T)
        if (d[T] !== v[T]) {
          R = d[T], m = v[T];
          break;
        }
      return R < m ? -1 : m < R ? 1 : 0;
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
      const m = l.allocUnsafe(v);
      let T = 0;
      for (R = 0; R < d.length; ++R) {
        let L = d[R];
        if (Qe(L, Uint8Array))
          T + L.length > m.length ? (l.isBuffer(L) || (L = l.from(L)), L.copy(m, T)) : Uint8Array.prototype.set.call(
            m,
            L,
            T
          );
        else if (l.isBuffer(L))
          L.copy(m, T);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        T += L.length;
      }
      return m;
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
      let m = !1;
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
            return Rt(S).length;
          default:
            if (m)
              return R ? -1 : st(S).length;
            d = ("" + d).toLowerCase(), m = !0;
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
            return Ue(this, d, v);
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
      return d === 0 ? "" : arguments.length === 0 ? Ue(this, 0, d) : le.apply(this, arguments);
    }, l.prototype.toLocaleString = l.prototype.toString, l.prototype.equals = function(d) {
      if (!l.isBuffer(d)) throw new TypeError("Argument must be a Buffer");
      return this === d ? !0 : l.compare(this, d) === 0;
    }, l.prototype.inspect = function() {
      let d = "";
      const v = n.INSPECT_MAX_BYTES;
      return d = this.toString("hex", 0, v).replace(/(.{2})/g, "$1 ").trim(), this.length > v && (d += " ... "), "<Buffer " + d + ">";
    }, r && (l.prototype[r] = l.prototype.inspect), l.prototype.compare = function(d, v, R, m, T) {
      if (Qe(d, Uint8Array) && (d = l.from(d, d.offset, d.byteLength)), !l.isBuffer(d))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof d
        );
      if (v === void 0 && (v = 0), R === void 0 && (R = d ? d.length : 0), m === void 0 && (m = 0), T === void 0 && (T = this.length), v < 0 || R > d.length || m < 0 || T > this.length)
        throw new RangeError("out of range index");
      if (m >= T && v >= R)
        return 0;
      if (m >= T)
        return -1;
      if (v >= R)
        return 1;
      if (v >>>= 0, R >>>= 0, m >>>= 0, T >>>= 0, this === d) return 0;
      let L = T - m, ue = R - v;
      const B = Math.min(L, ue), q = this.slice(m, T), w = d.slice(v, R);
      for (let se = 0; se < B; ++se)
        if (q[se] !== w[se]) {
          L = q[se], ue = w[se];
          break;
        }
      return L < ue ? -1 : ue < L ? 1 : 0;
    };
    function fe(S, d, v, R, m) {
      if (S.length === 0) return -1;
      if (typeof v == "string" ? (R = v, v = 0) : v > 2147483647 ? v = 2147483647 : v < -2147483648 && (v = -2147483648), v = +v, St(v) && (v = m ? 0 : S.length - 1), v < 0 && (v = S.length + v), v >= S.length) {
        if (m) return -1;
        v = S.length - 1;
      } else if (v < 0)
        if (m) v = 0;
        else return -1;
      if (typeof d == "string" && (d = l.from(d, R)), l.isBuffer(d))
        return d.length === 0 ? -1 : oe(S, d, v, R, m);
      if (typeof d == "number")
        return d = d & 255, typeof Uint8Array.prototype.indexOf == "function" ? m ? Uint8Array.prototype.indexOf.call(S, d, v) : Uint8Array.prototype.lastIndexOf.call(S, d, v) : oe(S, [d], v, R, m);
      throw new TypeError("val must be string, number or Buffer");
    }
    function oe(S, d, v, R, m) {
      let T = 1, L = S.length, ue = d.length;
      if (R !== void 0 && (R = String(R).toLowerCase(), R === "ucs2" || R === "ucs-2" || R === "utf16le" || R === "utf-16le")) {
        if (S.length < 2 || d.length < 2)
          return -1;
        T = 2, L /= 2, ue /= 2, v /= 2;
      }
      function B(w, se) {
        return T === 1 ? w[se] : w.readUInt16BE(se * T);
      }
      let q;
      if (m) {
        let w = -1;
        for (q = v; q < L; q++)
          if (B(S, q) === B(d, w === -1 ? 0 : q - w)) {
            if (w === -1 && (w = q), q - w + 1 === ue) return w * T;
          } else
            w !== -1 && (q -= q - w), w = -1;
      } else
        for (v + ue > L && (v = L - ue), q = v; q >= 0; q--) {
          let w = !0;
          for (let se = 0; se < ue; se++)
            if (B(S, q + se) !== B(d, se)) {
              w = !1;
              break;
            }
          if (w) return q;
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
      const m = S.length - v;
      R ? (R = Number(R), R > m && (R = m)) : R = m;
      const T = d.length;
      R > T / 2 && (R = T / 2);
      let L;
      for (L = 0; L < R; ++L) {
        const ue = parseInt(d.substr(L * 2, 2), 16);
        if (St(ue)) return L;
        S[v + L] = ue;
      }
      return L;
    }
    function Be(S, d, v, R) {
      return Me(st(d, S.length - v), S, v, R);
    }
    function Ce(S, d, v, R) {
      return Me(qe(d), S, v, R);
    }
    function $e(S, d, v, R) {
      return Me(Rt(d), S, v, R);
    }
    function Fe(S, d, v, R) {
      return Me(Ot(d, S.length - v), S, v, R);
    }
    l.prototype.write = function(d, v, R, m) {
      if (v === void 0)
        m = "utf8", R = this.length, v = 0;
      else if (R === void 0 && typeof v == "string")
        m = v, R = this.length, v = 0;
      else if (isFinite(v))
        v = v >>> 0, isFinite(R) ? (R = R >>> 0, m === void 0 && (m = "utf8")) : (m = R, R = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const T = this.length - v;
      if ((R === void 0 || R > T) && (R = T), d.length > 0 && (R < 0 || v < 0) || v > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      m || (m = "utf8");
      let L = !1;
      for (; ; )
        switch (m) {
          case "hex":
            return ke(this, d, v, R);
          case "utf8":
          case "utf-8":
            return Be(this, d, v, R);
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
            return Fe(this, d, v, R);
          default:
            if (L) throw new TypeError("Unknown encoding: " + m);
            m = ("" + m).toLowerCase(), L = !0;
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
    function Ue(S, d, v) {
      v = Math.min(S.length, v);
      const R = [];
      let m = d;
      for (; m < v; ) {
        const T = S[m];
        let L = null, ue = T > 239 ? 4 : T > 223 ? 3 : T > 191 ? 2 : 1;
        if (m + ue <= v) {
          let B, q, w, se;
          switch (ue) {
            case 1:
              T < 128 && (L = T);
              break;
            case 2:
              B = S[m + 1], (B & 192) === 128 && (se = (T & 31) << 6 | B & 63, se > 127 && (L = se));
              break;
            case 3:
              B = S[m + 1], q = S[m + 2], (B & 192) === 128 && (q & 192) === 128 && (se = (T & 15) << 12 | (B & 63) << 6 | q & 63, se > 2047 && (se < 55296 || se > 57343) && (L = se));
              break;
            case 4:
              B = S[m + 1], q = S[m + 2], w = S[m + 3], (B & 192) === 128 && (q & 192) === 128 && (w & 192) === 128 && (se = (T & 15) << 18 | (B & 63) << 12 | (q & 63) << 6 | w & 63, se > 65535 && se < 1114112 && (L = se));
          }
        }
        L === null ? (L = 65533, ue = 1) : L > 65535 && (L -= 65536, R.push(L >>> 10 & 1023 | 55296), L = 56320 | L & 1023), R.push(L), m += ue;
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
      for (let m = d; m < v; ++m)
        R += String.fromCharCode(S[m] & 127);
      return R;
    }
    function He(S, d, v) {
      let R = "";
      v = Math.min(S.length, v);
      for (let m = d; m < v; ++m)
        R += String.fromCharCode(S[m]);
      return R;
    }
    function Ke(S, d, v) {
      const R = S.length;
      (!d || d < 0) && (d = 0), (!v || v < 0 || v > R) && (v = R);
      let m = "";
      for (let T = d; T < v; ++T)
        m += Lt[S[T]];
      return m;
    }
    function It(S, d, v) {
      const R = S.slice(d, v);
      let m = "";
      for (let T = 0; T < R.length - 1; T += 2)
        m += String.fromCharCode(R[T] + R[T + 1] * 256);
      return m;
    }
    l.prototype.slice = function(d, v) {
      const R = this.length;
      d = ~~d, v = v === void 0 ? R : ~~v, d < 0 ? (d += R, d < 0 && (d = 0)) : d > R && (d = R), v < 0 ? (v += R, v < 0 && (v = 0)) : v > R && (v = R), v < d && (v = d);
      const m = this.subarray(d, v);
      return Object.setPrototypeOf(m, l.prototype), m;
    };
    function Ve(S, d, v) {
      if (S % 1 !== 0 || S < 0) throw new RangeError("offset is not uint");
      if (S + d > v) throw new RangeError("Trying to access beyond buffer length");
    }
    l.prototype.readUintLE = l.prototype.readUIntLE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let m = this[d], T = 1, L = 0;
      for (; ++L < v && (T *= 256); )
        m += this[d + L] * T;
      return m;
    }, l.prototype.readUintBE = l.prototype.readUIntBE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let m = this[d + --v], T = 1;
      for (; v > 0 && (T *= 256); )
        m += this[d + --v] * T;
      return m;
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
      const m = v + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24, T = this[++d] + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + R * 2 ** 24;
      return BigInt(m) + (BigInt(T) << BigInt(32));
    }), l.prototype.readBigUInt64BE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], R = this[d + 7];
      (v === void 0 || R === void 0) && yt(d, this.length - 8);
      const m = v * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d], T = this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + R;
      return (BigInt(m) << BigInt(32)) + BigInt(T);
    }), l.prototype.readIntLE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let m = this[d], T = 1, L = 0;
      for (; ++L < v && (T *= 256); )
        m += this[d + L] * T;
      return T *= 128, m >= T && (m -= Math.pow(2, 8 * v)), m;
    }, l.prototype.readIntBE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let m = v, T = 1, L = this[d + --m];
      for (; m > 0 && (T *= 256); )
        L += this[d + --m] * T;
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
      const m = this[d + 4] + this[d + 5] * 2 ** 8 + this[d + 6] * 2 ** 16 + (R << 24);
      return (BigInt(m) << BigInt(32)) + BigInt(v + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24);
    }), l.prototype.readBigInt64BE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], R = this[d + 7];
      (v === void 0 || R === void 0) && yt(d, this.length - 8);
      const m = (v << 24) + // Overflow
      this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d];
      return (BigInt(m) << BigInt(32)) + BigInt(this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + R);
    }), l.prototype.readFloatLE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), t.read(this, d, !0, 23, 4);
    }, l.prototype.readFloatBE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), t.read(this, d, !1, 23, 4);
    }, l.prototype.readDoubleLE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 8, this.length), t.read(this, d, !0, 52, 8);
    }, l.prototype.readDoubleBE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 8, this.length), t.read(this, d, !1, 52, 8);
    };
    function Xe(S, d, v, R, m, T) {
      if (!l.isBuffer(S)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (d > m || d < T) throw new RangeError('"value" argument is out of bounds');
      if (v + R > S.length) throw new RangeError("Index out of range");
    }
    l.prototype.writeUintLE = l.prototype.writeUIntLE = function(d, v, R, m) {
      if (d = +d, v = v >>> 0, R = R >>> 0, !m) {
        const ue = Math.pow(2, 8 * R) - 1;
        Xe(this, d, v, R, ue, 0);
      }
      let T = 1, L = 0;
      for (this[v] = d & 255; ++L < R && (T *= 256); )
        this[v + L] = d / T & 255;
      return v + R;
    }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function(d, v, R, m) {
      if (d = +d, v = v >>> 0, R = R >>> 0, !m) {
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
    function Ze(S, d, v, R, m) {
      me(d, R, m, S, v, 7);
      let T = Number(d & BigInt(4294967295));
      S[v++] = T, T = T >> 8, S[v++] = T, T = T >> 8, S[v++] = T, T = T >> 8, S[v++] = T;
      let L = Number(d >> BigInt(32) & BigInt(4294967295));
      return S[v++] = L, L = L >> 8, S[v++] = L, L = L >> 8, S[v++] = L, L = L >> 8, S[v++] = L, v;
    }
    function wt(S, d, v, R, m) {
      me(d, R, m, S, v, 7);
      let T = Number(d & BigInt(4294967295));
      S[v + 7] = T, T = T >> 8, S[v + 6] = T, T = T >> 8, S[v + 5] = T, T = T >> 8, S[v + 4] = T;
      let L = Number(d >> BigInt(32) & BigInt(4294967295));
      return S[v + 3] = L, L = L >> 8, S[v + 2] = L, L = L >> 8, S[v + 1] = L, L = L >> 8, S[v] = L, v + 8;
    }
    l.prototype.writeBigUInt64LE = _t(function(d, v = 0) {
      return Ze(this, d, v, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeBigUInt64BE = _t(function(d, v = 0) {
      return wt(this, d, v, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeIntLE = function(d, v, R, m) {
      if (d = +d, v = v >>> 0, !m) {
        const B = Math.pow(2, 8 * R - 1);
        Xe(this, d, v, R, B - 1, -B);
      }
      let T = 0, L = 1, ue = 0;
      for (this[v] = d & 255; ++T < R && (L *= 256); )
        d < 0 && ue === 0 && this[v + T - 1] !== 0 && (ue = 1), this[v + T] = (d / L >> 0) - ue & 255;
      return v + R;
    }, l.prototype.writeIntBE = function(d, v, R, m) {
      if (d = +d, v = v >>> 0, !m) {
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
    function gt(S, d, v, R, m, T) {
      if (v + R > S.length) throw new RangeError("Index out of range");
      if (v < 0) throw new RangeError("Index out of range");
    }
    function We(S, d, v, R, m) {
      return d = +d, v = v >>> 0, m || gt(S, d, v, 4), t.write(S, d, v, R, 23, 4), v + 4;
    }
    l.prototype.writeFloatLE = function(d, v, R) {
      return We(this, d, v, !0, R);
    }, l.prototype.writeFloatBE = function(d, v, R) {
      return We(this, d, v, !1, R);
    };
    function lt(S, d, v, R, m) {
      return d = +d, v = v >>> 0, m || gt(S, d, v, 8), t.write(S, d, v, R, 52, 8), v + 8;
    }
    l.prototype.writeDoubleLE = function(d, v, R) {
      return lt(this, d, v, !0, R);
    }, l.prototype.writeDoubleBE = function(d, v, R) {
      return lt(this, d, v, !1, R);
    }, l.prototype.copy = function(d, v, R, m) {
      if (!l.isBuffer(d)) throw new TypeError("argument should be a Buffer");
      if (R || (R = 0), !m && m !== 0 && (m = this.length), v >= d.length && (v = d.length), v || (v = 0), m > 0 && m < R && (m = R), m === R || d.length === 0 || this.length === 0) return 0;
      if (v < 0)
        throw new RangeError("targetStart out of bounds");
      if (R < 0 || R >= this.length) throw new RangeError("Index out of range");
      if (m < 0) throw new RangeError("sourceEnd out of bounds");
      m > this.length && (m = this.length), d.length - v < m - R && (m = d.length - v + R);
      const T = m - R;
      return this === d && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(v, R, m) : Uint8Array.prototype.set.call(
        d,
        this.subarray(R, m),
        v
      ), T;
    }, l.prototype.fill = function(d, v, R, m) {
      if (typeof d == "string") {
        if (typeof v == "string" ? (m = v, v = 0, R = this.length) : typeof R == "string" && (m = R, R = this.length), m !== void 0 && typeof m != "string")
          throw new TypeError("encoding must be a string");
        if (typeof m == "string" && !l.isEncoding(m))
          throw new TypeError("Unknown encoding: " + m);
        if (d.length === 1) {
          const L = d.charCodeAt(0);
          (m === "utf8" && L < 128 || m === "latin1") && (d = L);
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
        const L = l.isBuffer(d) ? d : l.from(d, m), ue = L.length;
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
        set code(m) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: m,
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
        let R = `The value of "${S}" is out of range.`, m = v;
        return Number.isInteger(v) && Math.abs(v) > 2 ** 32 ? m = Le(String(v)) : typeof v == "bigint" && (m = String(v), (v > BigInt(2) ** BigInt(32) || v < -(BigInt(2) ** BigInt(32))) && (m = Le(m)), m += "n"), R += ` It must be ${d}. Received ${m}`, R;
      },
      RangeError
    );
    function Le(S) {
      let d = "", v = S.length;
      const R = S[0] === "-" ? 1 : 0;
      for (; v >= R + 4; v -= 3)
        d = `_${S.slice(v - 3, v)}${d}`;
      return `${S.slice(0, v)}${d}`;
    }
    function et(S, d, v) {
      je(d, "offset"), (S[d] === void 0 || S[d + v] === void 0) && yt(d, S.length - (v + 1));
    }
    function me(S, d, v, R, m, T) {
      if (S > v || S < d) {
        const L = typeof d == "bigint" ? "n" : "";
        let ue;
        throw d === 0 || d === BigInt(0) ? ue = `>= 0${L} and < 2${L} ** ${(T + 1) * 8}${L}` : ue = `>= -(2${L} ** ${(T + 1) * 8 - 1}${L}) and < 2 ** ${(T + 1) * 8 - 1}${L}`, new Pe.ERR_OUT_OF_RANGE("value", ue, S);
      }
      et(R, m, T);
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
      let m = null;
      const T = [];
      for (let L = 0; L < R; ++L) {
        if (v = S.charCodeAt(L), v > 55295 && v < 57344) {
          if (!m) {
            if (v > 56319) {
              (d -= 3) > -1 && T.push(239, 191, 189);
              continue;
            } else if (L + 1 === R) {
              (d -= 3) > -1 && T.push(239, 191, 189);
              continue;
            }
            m = v;
            continue;
          }
          if (v < 56320) {
            (d -= 3) > -1 && T.push(239, 191, 189), m = v;
            continue;
          }
          v = (m - 55296 << 10 | v - 56320) + 65536;
        } else m && (d -= 3) > -1 && T.push(239, 191, 189);
        if (m = null, v < 128) {
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
    function qe(S) {
      const d = [];
      for (let v = 0; v < S.length; ++v)
        d.push(S.charCodeAt(v) & 255);
      return d;
    }
    function Ot(S, d) {
      let v, R, m;
      const T = [];
      for (let L = 0; L < S.length && !((d -= 2) < 0); ++L)
        v = S.charCodeAt(L), R = v >> 8, m = v % 256, T.push(m), T.push(R);
      return T;
    }
    function Rt(S) {
      return e.toByteArray(ct(S));
    }
    function Me(S, d, v, R) {
      let m;
      for (m = 0; m < R && !(m + v >= d.length || m >= S.length); ++m)
        d[m + v] = S[m];
      return m;
    }
    function Qe(S, d) {
      return S instanceof d || S != null && S.constructor != null && S.constructor.name != null && S.constructor.name === d.name;
    }
    function St(S) {
      return S !== S;
    }
    const Lt = function() {
      const S = "0123456789abcdef", d = new Array(256);
      for (let v = 0; v < 16; ++v) {
        const R = v * 16;
        for (let m = 0; m < 16; ++m)
          d[R + m] = S[v] + S[m];
      }
      return d;
    }();
    function _t(S) {
      return typeof BigInt > "u" ? Qt : S;
    }
    function Qt() {
      throw new Error("BigInt not supported");
    }
  }(zu)), zu;
}
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Jh;
function _i() {
  return Jh || (Jh = 1, function(n, e) {
    var t = by(), r = t.Buffer;
    function i(u, l) {
      for (var c in u)
        l[c] = u[c];
    }
    r.from && r.alloc && r.allocUnsafe && r.allocUnsafeSlow ? n.exports = t : (i(t, e), e.Buffer = o);
    function o(u, l, c) {
      return r(u, l, c);
    }
    o.prototype = Object.create(r.prototype), i(r, o), o.from = function(u, l, c) {
      if (typeof u == "number")
        throw new TypeError("Argument must not be a number");
      return r(u, l, c);
    }, o.alloc = function(u, l, c) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      var I = r(u);
      return l !== void 0 ? typeof c == "string" ? I.fill(l, c) : I.fill(l) : I.fill(0), I;
    }, o.allocUnsafe = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return r(u);
    }, o.allocUnsafeSlow = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return t.SlowBuffer(u);
    };
  }(Aa, Aa.exports)), Aa.exports;
}
var Gu, Zh;
function _y() {
  if (Zh) return Gu;
  Zh = 1;
  var n = {}.toString;
  return Gu = Array.isArray || function(e) {
    return n.call(e) == "[object Array]";
  }, Gu;
}
var Hu, Qh;
function sr() {
  return Qh || (Qh = 1, Hu = TypeError), Hu;
}
var Wu, Xh;
function ng() {
  return Xh || (Xh = 1, Wu = Object), Wu;
}
var Yu, ep;
function wy() {
  return ep || (ep = 1, Yu = Error), Yu;
}
var Vu, tp;
function xy() {
  return tp || (tp = 1, Vu = EvalError), Vu;
}
var Ju, rp;
function Ey() {
  return rp || (rp = 1, Ju = RangeError), Ju;
}
var Zu, np;
function Sy() {
  return np || (np = 1, Zu = ReferenceError), Zu;
}
var Qu, ip;
function ig() {
  return ip || (ip = 1, Qu = SyntaxError), Qu;
}
var Xu, sp;
function Ay() {
  return sp || (sp = 1, Xu = URIError), Xu;
}
var el, op;
function sg() {
  return op || (op = 1, el = Math.abs), el;
}
var tl, ap;
function ou() {
  return ap || (ap = 1, tl = Math.floor), tl;
}
var rl, up;
function ky() {
  return up || (up = 1, rl = Math.max), rl;
}
var nl, lp;
function Oy() {
  return lp || (lp = 1, nl = Math.min), nl;
}
var il, cp;
function Ry() {
  return cp || (cp = 1, il = Math.pow), il;
}
var sl, fp;
function Ty() {
  return fp || (fp = 1, sl = Math.round), sl;
}
var ol, hp;
function kf() {
  return hp || (hp = 1, ol = Number.isNaN || function(e) {
    return e !== e;
  }), ol;
}
var al, pp;
function Cy() {
  if (pp) return al;
  pp = 1;
  var n = /* @__PURE__ */ kf();
  return al = function(t) {
    return n(t) || t === 0 ? t : t < 0 ? -1 : 1;
  }, al;
}
var ul, dp;
function Ny() {
  return dp || (dp = 1, ul = Object.getOwnPropertyDescriptor), ul;
}
var ll, vp;
function vo() {
  if (vp) return ll;
  vp = 1;
  var n = /* @__PURE__ */ Ny();
  if (n)
    try {
      n([], "length");
    } catch {
      n = null;
    }
  return ll = n, ll;
}
var cl, gp;
function au() {
  if (gp) return cl;
  gp = 1;
  var n = Object.defineProperty || !1;
  if (n)
    try {
      n({}, "a", { value: 1 });
    } catch {
      n = !1;
    }
  return cl = n, cl;
}
var fl, yp;
function og() {
  return yp || (yp = 1, fl = function() {
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
    var u = Object.getOwnPropertySymbols(e);
    if (u.length !== 1 || u[0] !== t || !Object.prototype.propertyIsEnumerable.call(e, t))
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
  }), fl;
}
var hl, mp;
function Py() {
  if (mp) return hl;
  mp = 1;
  var n = typeof Symbol < "u" && Symbol, e = og();
  return hl = function() {
    return typeof n != "function" || typeof Symbol != "function" || typeof n("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : e();
  }, hl;
}
var pl, Ip;
function ag() {
  return Ip || (Ip = 1, pl = typeof Reflect < "u" && Reflect.getPrototypeOf || null), pl;
}
var dl, bp;
function ug() {
  if (bp) return dl;
  bp = 1;
  var n = /* @__PURE__ */ ng();
  return dl = n.getPrototypeOf || null, dl;
}
var vl, _p;
function Dy() {
  if (_p) return vl;
  _p = 1;
  var n = "Function.prototype.bind called on incompatible ", e = Object.prototype.toString, t = Math.max, r = "[object Function]", i = function(c, I) {
    for (var y = [], _ = 0; _ < c.length; _ += 1)
      y[_] = c[_];
    for (var x = 0; x < I.length; x += 1)
      y[x + c.length] = I[x];
    return y;
  }, o = function(c, I) {
    for (var y = [], _ = I, x = 0; _ < c.length; _ += 1, x += 1)
      y[x] = c[_];
    return y;
  }, u = function(l, c) {
    for (var I = "", y = 0; y < l.length; y += 1)
      I += l[y], y + 1 < l.length && (I += c);
    return I;
  };
  return vl = function(c) {
    var I = this;
    if (typeof I != "function" || e.apply(I) !== r)
      throw new TypeError(n + I);
    for (var y = o(arguments, 1), _, x = function() {
      if (this instanceof _) {
        var M = I.apply(
          this,
          i(y, arguments)
        );
        return Object(M) === M ? M : this;
      }
      return I.apply(
        c,
        i(y, arguments)
      );
    }, k = t(0, I.length - y.length), D = [], K = 0; K < k; K++)
      D[K] = "$" + K;
    if (_ = Function("binder", "return function (" + u(D, ",") + "){ return binder.apply(this,arguments); }")(x), I.prototype) {
      var C = function() {
      };
      C.prototype = I.prototype, _.prototype = new C(), C.prototype = null;
    }
    return _;
  }, vl;
}
var gl, wp;
function ra() {
  if (wp) return gl;
  wp = 1;
  var n = Dy();
  return gl = Function.prototype.bind || n, gl;
}
var yl, xp;
function Of() {
  return xp || (xp = 1, yl = Function.prototype.call), yl;
}
var ml, Ep;
function Rf() {
  return Ep || (Ep = 1, ml = Function.prototype.apply), ml;
}
var Il, Sp;
function By() {
  return Sp || (Sp = 1, Il = typeof Reflect < "u" && Reflect && Reflect.apply), Il;
}
var bl, Ap;
function lg() {
  if (Ap) return bl;
  Ap = 1;
  var n = ra(), e = Rf(), t = Of(), r = By();
  return bl = r || n.call(t, e), bl;
}
var _l, kp;
function Tf() {
  if (kp) return _l;
  kp = 1;
  var n = ra(), e = /* @__PURE__ */ sr(), t = Of(), r = lg();
  return _l = function(o) {
    if (o.length < 1 || typeof o[0] != "function")
      throw new e("a function is required");
    return r(n, t, o);
  }, _l;
}
var wl, Op;
function Fy() {
  if (Op) return wl;
  Op = 1;
  var n = Tf(), e = /* @__PURE__ */ vo(), t;
  try {
    t = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (u) {
    if (!u || typeof u != "object" || !("code" in u) || u.code !== "ERR_PROTO_ACCESS")
      throw u;
  }
  var r = !!t && e && e(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), i = Object, o = i.getPrototypeOf;
  return wl = r && typeof r.get == "function" ? n([r.get]) : typeof o == "function" ? (
    /** @type {import('./get')} */
    function(l) {
      return o(l == null ? l : i(l));
    }
  ) : !1, wl;
}
var xl, Rp;
function cg() {
  if (Rp) return xl;
  Rp = 1;
  var n = ag(), e = ug(), t = /* @__PURE__ */ Fy();
  return xl = n ? function(i) {
    return n(i);
  } : e ? function(i) {
    if (!i || typeof i != "object" && typeof i != "function")
      throw new TypeError("getProto: not an object");
    return e(i);
  } : t ? function(i) {
    return t(i);
  } : null, xl;
}
var El, Tp;
function fg() {
  if (Tp) return El;
  Tp = 1;
  var n = Function.prototype.call, e = Object.prototype.hasOwnProperty, t = ra();
  return El = t.call(n, e), El;
}
var Sl, Cp;
function na() {
  if (Cp) return Sl;
  Cp = 1;
  var n, e = /* @__PURE__ */ ng(), t = /* @__PURE__ */ wy(), r = /* @__PURE__ */ xy(), i = /* @__PURE__ */ Ey(), o = /* @__PURE__ */ Sy(), u = /* @__PURE__ */ ig(), l = /* @__PURE__ */ sr(), c = /* @__PURE__ */ Ay(), I = /* @__PURE__ */ sg(), y = /* @__PURE__ */ ou(), _ = /* @__PURE__ */ ky(), x = /* @__PURE__ */ Oy(), k = /* @__PURE__ */ Ry(), D = /* @__PURE__ */ Ty(), K = /* @__PURE__ */ Cy(), C = Function, M = function(he) {
    try {
      return C('"use strict"; return (' + he + ").constructor;")();
    } catch {
    }
  }, J = /* @__PURE__ */ vo(), X = /* @__PURE__ */ au(), le = function() {
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
  }() : le, fe = Py()(), oe = cg(), ke = ug(), Be = ag(), Ce = Rf(), $e = Of(), Fe = {}, Se = typeof Uint8Array > "u" || !oe ? n : oe(Uint8Array), Ue = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? n : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? n : ArrayBuffer,
    "%ArrayIteratorPrototype%": fe && oe ? oe([][Symbol.iterator]()) : n,
    "%AsyncFromSyncIteratorPrototype%": n,
    "%AsyncFunction%": Fe,
    "%AsyncGenerator%": Fe,
    "%AsyncGeneratorFunction%": Fe,
    "%AsyncIteratorPrototype%": Fe,
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
    "%GeneratorFunction%": Fe,
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
    "%SyntaxError%": u,
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
    "%Math.abs%": I,
    "%Math.floor%": y,
    "%Math.max%": _,
    "%Math.min%": x,
    "%Math.pow%": k,
    "%Math.round%": D,
    "%Math.sign%": K,
    "%Reflect.getPrototypeOf%": Be
  };
  if (oe)
    try {
      null.error;
    } catch (he) {
      var ot = oe(oe(he));
      Ue["%Error.prototype%"] = ot;
    }
  var vt = function he(Le) {
    var et;
    if (Le === "%AsyncFunction%")
      et = M("async function () {}");
    else if (Le === "%GeneratorFunction%")
      et = M("function* () {}");
    else if (Le === "%AsyncGeneratorFunction%")
      et = M("async function* () {}");
    else if (Le === "%AsyncGenerator%") {
      var me = he("%AsyncGeneratorFunction%");
      me && (et = me.prototype);
    } else if (Le === "%AsyncIteratorPrototype%") {
      var je = he("%AsyncGenerator%");
      je && oe && (et = oe(je.prototype));
    }
    return Ue[Le] = et, et;
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
  }, He = ra(), Ke = /* @__PURE__ */ fg(), It = He.call($e, Array.prototype.concat), Ve = He.call(Ce, Array.prototype.splice), Xe = He.call($e, String.prototype.replace), Ze = He.call($e, String.prototype.slice), wt = He.call($e, RegExp.prototype.exec), gt = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, We = /\\(\\)?/g, lt = function(Le) {
    var et = Ze(Le, 0, 1), me = Ze(Le, -1);
    if (et === "%" && me !== "%")
      throw new u("invalid intrinsic syntax, expected closing `%`");
    if (me === "%" && et !== "%")
      throw new u("invalid intrinsic syntax, expected opening `%`");
    var je = [];
    return Xe(Le, gt, function(yt, ht, ct, st) {
      je[je.length] = ct ? Xe(st, We, "$1") : ht || yt;
    }), je;
  }, Pe = function(Le, et) {
    var me = Le, je;
    if (Ke(we, me) && (je = we[me], me = "%" + je[0] + "%"), Ke(Ue, me)) {
      var yt = Ue[me];
      if (yt === Fe && (yt = vt(me)), typeof yt > "u" && !et)
        throw new l("intrinsic " + Le + " exists, but is not available. Please file an issue!");
      return {
        alias: je,
        name: me,
        value: yt
      };
    }
    throw new u("intrinsic " + Le + " does not exist!");
  };
  return Sl = function(Le, et) {
    if (typeof Le != "string" || Le.length === 0)
      throw new l("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof et != "boolean")
      throw new l('"allowMissing" argument must be a boolean');
    if (wt(/^%?[^%]*%?$/, Le) === null)
      throw new u("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var me = lt(Le), je = me.length > 0 ? me[0] : "", yt = Pe("%" + je + "%", et), ht = yt.name, ct = yt.value, st = !1, qe = yt.alias;
    qe && (je = qe[0], Ve(me, It([0, 1], qe)));
    for (var Ot = 1, Rt = !0; Ot < me.length; Ot += 1) {
      var Me = me[Ot], Qe = Ze(Me, 0, 1), St = Ze(Me, -1);
      if ((Qe === '"' || Qe === "'" || Qe === "`" || St === '"' || St === "'" || St === "`") && Qe !== St)
        throw new u("property names with quotes must have matching quotes");
      if ((Me === "constructor" || !Rt) && (st = !0), je += "." + Me, ht = "%" + je + "%", Ke(Ue, ht))
        ct = Ue[ht];
      else if (ct != null) {
        if (!(Me in ct)) {
          if (!et)
            throw new l("base intrinsic for " + Le + " exists, but the property is not available.");
          return;
        }
        if (J && Ot + 1 >= me.length) {
          var Lt = J(ct, Me);
          Rt = !!Lt, Rt && "get" in Lt && !("originalValue" in Lt.get) ? ct = Lt.get : ct = ct[Me];
        } else
          Rt = Ke(ct, Me), ct = ct[Me];
        Rt && !st && (Ue[ht] = ct);
      }
    }
    return ct;
  }, Sl;
}
var Al, Np;
function Ln() {
  if (Np) return Al;
  Np = 1;
  var n = /* @__PURE__ */ na(), e = Tf(), t = e([n("%String.prototype.indexOf%")]);
  return Al = function(i, o) {
    var u = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      n(i, !!o)
    );
    return typeof u == "function" && t(i, ".prototype.") > -1 ? e(
      /** @type {const} */
      [u]
    ) : u;
  }, Al;
}
var kl, Pp;
function Ly() {
  if (Pp) return kl;
  Pp = 1;
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
  }, u = function(X) {
    try {
      return o(X) ? !1 : (n.call(X), !0);
    } catch {
      return !1;
    }
  }, l = Object.prototype.toString, c = "[object Object]", I = "[object Function]", y = "[object GeneratorFunction]", _ = "[object HTMLAllCollection]", x = "[object HTML document.all class]", k = "[object HTMLCollection]", D = typeof Symbol == "function" && !!Symbol.toStringTag, K = !(0 in [,]), C = function() {
    return !1;
  };
  if (typeof document == "object") {
    var M = document.all;
    l.call(M) === l.call(document.all) && (C = function(X) {
      if ((K || !X) && (typeof X > "u" || typeof X == "object"))
        try {
          var le = l.call(X);
          return (le === _ || le === x || le === k || le === c) && X("") == null;
        } catch {
        }
      return !1;
    });
  }
  return kl = e ? function(X) {
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
    return !o(X) && u(X);
  } : function(X) {
    if (C(X))
      return !0;
    if (!X || typeof X != "function" && typeof X != "object")
      return !1;
    if (D)
      return u(X);
    if (o(X))
      return !1;
    var le = l.call(X);
    return le !== I && le !== y && !/^\[object HTML/.test(le) ? !1 : u(X);
  }, kl;
}
var Ol, Dp;
function Cf() {
  if (Dp) return Ol;
  Dp = 1;
  var n = Ly(), e = Object.prototype.toString, t = Object.prototype.hasOwnProperty, r = function(c, I, y) {
    for (var _ = 0, x = c.length; _ < x; _++)
      t.call(c, _) && (y == null ? I(c[_], _, c) : I.call(y, c[_], _, c));
  }, i = function(c, I, y) {
    for (var _ = 0, x = c.length; _ < x; _++)
      y == null ? I(c.charAt(_), _, c) : I.call(y, c.charAt(_), _, c);
  }, o = function(c, I, y) {
    for (var _ in c)
      t.call(c, _) && (y == null ? I(c[_], _, c) : I.call(y, c[_], _, c));
  };
  function u(l) {
    return e.call(l) === "[object Array]";
  }
  return Ol = function(c, I, y) {
    if (!n(I))
      throw new TypeError("iterator must be a function");
    var _;
    arguments.length >= 3 && (_ = y), u(c) ? r(c, I, _) : typeof c == "string" ? i(c, I, _) : o(c, I, _);
  }, Ol;
}
var Rl, Bp;
function qy() {
  return Bp || (Bp = 1, Rl = [
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
  ]), Rl;
}
var Tl, Fp;
function My() {
  if (Fp) return Tl;
  Fp = 1;
  var n = /* @__PURE__ */ qy(), e = typeof globalThis > "u" ? Sf : globalThis;
  return Tl = function() {
    for (var r = [], i = 0; i < n.length; i++)
      typeof e[n[i]] == "function" && (r[r.length] = n[i]);
    return r;
  }, Tl;
}
var Cl = { exports: {} }, Nl, Lp;
function hg() {
  if (Lp) return Nl;
  Lp = 1;
  var n = /* @__PURE__ */ au(), e = /* @__PURE__ */ ig(), t = /* @__PURE__ */ sr(), r = /* @__PURE__ */ vo();
  return Nl = function(o, u, l) {
    if (!o || typeof o != "object" && typeof o != "function")
      throw new t("`obj` must be an object or a function`");
    if (typeof u != "string" && typeof u != "symbol")
      throw new t("`property` must be a string or a symbol`");
    if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
      throw new t("`nonEnumerable`, if provided, must be a boolean or null");
    if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
      throw new t("`nonWritable`, if provided, must be a boolean or null");
    if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
      throw new t("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && typeof arguments[6] != "boolean")
      throw new t("`loose`, if provided, must be a boolean");
    var c = arguments.length > 3 ? arguments[3] : null, I = arguments.length > 4 ? arguments[4] : null, y = arguments.length > 5 ? arguments[5] : null, _ = arguments.length > 6 ? arguments[6] : !1, x = !!r && r(o, u);
    if (n)
      n(o, u, {
        configurable: y === null && x ? x.configurable : !y,
        enumerable: c === null && x ? x.enumerable : !c,
        value: l,
        writable: I === null && x ? x.writable : !I
      });
    else if (_ || !c && !I && !y)
      o[u] = l;
    else
      throw new e("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, Nl;
}
var Pl, qp;
function pg() {
  if (qp) return Pl;
  qp = 1;
  var n = /* @__PURE__ */ au(), e = function() {
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
  }, Pl = e, Pl;
}
var Dl, Mp;
function Uy() {
  if (Mp) return Dl;
  Mp = 1;
  var n = /* @__PURE__ */ na(), e = /* @__PURE__ */ hg(), t = /* @__PURE__ */ pg()(), r = /* @__PURE__ */ vo(), i = /* @__PURE__ */ sr(), o = n("%Math.floor%");
  return Dl = function(l, c) {
    if (typeof l != "function")
      throw new i("`fn` is not a function");
    if (typeof c != "number" || c < 0 || c > 4294967295 || o(c) !== c)
      throw new i("`length` must be a positive 32-bit integer");
    var I = arguments.length > 2 && !!arguments[2], y = !0, _ = !0;
    if ("length" in l && r) {
      var x = r(l, "length");
      x && !x.configurable && (y = !1), x && !x.writable && (_ = !1);
    }
    return (y || _ || !I) && (t ? e(
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
  }, Dl;
}
var Bl, Up;
function $y() {
  if (Up) return Bl;
  Up = 1;
  var n = ra(), e = Rf(), t = lg();
  return Bl = function() {
    return t(n, e, arguments);
  }, Bl;
}
var $p;
function Nf() {
  return $p || ($p = 1, function(n) {
    var e = /* @__PURE__ */ Uy(), t = /* @__PURE__ */ au(), r = Tf(), i = $y();
    n.exports = function(u) {
      var l = r(arguments), c = u.length - (arguments.length - 1);
      return e(
        l,
        1 + (c > 0 ? c : 0),
        !0
      );
    }, t ? t(n.exports, "apply", { value: i }) : n.exports.apply = i;
  }(Cl)), Cl.exports;
}
var Fl, jp;
function dg() {
  if (jp) return Fl;
  jp = 1;
  var n = og();
  return Fl = function() {
    return n() && !!Symbol.toStringTag;
  }, Fl;
}
var Ll, Kp;
function jy() {
  if (Kp) return Ll;
  Kp = 1;
  var n = Cf(), e = /* @__PURE__ */ My(), t = Nf(), r = /* @__PURE__ */ Ln(), i = /* @__PURE__ */ vo(), o = cg(), u = r("Object.prototype.toString"), l = dg()(), c = typeof globalThis > "u" ? Sf : globalThis, I = e(), y = r("String.prototype.slice"), _ = r("Array.prototype.indexOf", !0) || function(C, M) {
    for (var J = 0; J < C.length; J += 1)
      if (C[J] === M)
        return J;
    return -1;
  }, x = { __proto__: null };
  l && i && o ? n(I, function(K) {
    var C = new c[K]();
    if (Symbol.toStringTag in C && o) {
      var M = o(C), J = i(M, Symbol.toStringTag);
      if (!J && M) {
        var X = o(M);
        J = i(X, Symbol.toStringTag);
      }
      x["$" + K] = t(J.get);
    }
  }) : n(I, function(K) {
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
            y(X, 1));
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
            y(X, 1);
          } catch {
          }
      }
    ), M;
  };
  return Ll = function(C) {
    if (!C || typeof C != "object")
      return !1;
    if (!l) {
      var M = y(u(C), 8, -1);
      return _(I, M) > -1 ? M : M !== "Object" ? !1 : D(C);
    }
    return i ? k(C) : null;
  }, Ll;
}
var ql, zp;
function Ky() {
  if (zp) return ql;
  zp = 1;
  var n = /* @__PURE__ */ jy();
  return ql = function(t) {
    return !!n(t);
  }, ql;
}
var Ml, Gp;
function zy() {
  if (Gp) return Ml;
  Gp = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Ln(), t = e("TypedArray.prototype.buffer", !0), r = /* @__PURE__ */ Ky();
  return Ml = t || function(o) {
    if (!r(o))
      throw new n("Not a Typed Array");
    return o.buffer;
  }, Ml;
}
var Ul, Hp;
function Gy() {
  if (Hp) return Ul;
  Hp = 1;
  var n = _i().Buffer, e = _y(), t = /* @__PURE__ */ zy(), r = ArrayBuffer.isView || function(c) {
    try {
      return t(c), !0;
    } catch {
      return !1;
    }
  }, i = typeof Uint8Array < "u", o = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", u = o && (n.prototype instanceof Uint8Array || n.TYPED_ARRAY_SUPPORT);
  return Ul = function(c, I) {
    if (c instanceof n)
      return c;
    if (typeof c == "string")
      return n.from(c, I);
    if (o && r(c)) {
      if (c.byteLength === 0)
        return n.alloc(0);
      if (u) {
        var y = n.from(c.buffer, c.byteOffset, c.byteLength);
        if (y.byteLength === c.byteLength)
          return y;
      }
      var _ = c instanceof Uint8Array ? c : new Uint8Array(c.buffer, c.byteOffset, c.byteLength), x = n.from(_);
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
  }, Ul;
}
var $l, Wp;
function go() {
  if (Wp) return $l;
  Wp = 1;
  var n = _i().Buffer, e = /* @__PURE__ */ Gy();
  function t(r, i) {
    this._block = n.alloc(r), this._finalSize = i, this._blockSize = r, this._len = 0;
  }
  return t.prototype.update = function(r, i) {
    r = e(r, i || "utf8");
    for (var o = this._block, u = this._blockSize, l = r.length, c = this._len, I = 0; I < l; ) {
      for (var y = c % u, _ = Math.min(l - I, u - y), x = 0; x < _; x++)
        o[y + x] = r[I + x];
      c += _, I += _, c % u === 0 && this._update(o);
    }
    return this._len += l, this;
  }, t.prototype.digest = function(r) {
    var i = this._len % this._blockSize;
    this._block[i] = 128, this._block.fill(0, i + 1), i >= this._finalSize && (this._update(this._block), this._block.fill(0));
    var o = this._len * 8;
    if (o <= 4294967295)
      this._block.writeUInt32BE(o, this._blockSize - 4);
    else {
      var u = (o & 4294967295) >>> 0, l = (o - u) / 4294967296;
      this._block.writeUInt32BE(l, this._blockSize - 8), this._block.writeUInt32BE(u, this._blockSize - 4);
    }
    this._update(this._block);
    var c = this._hash();
    return r ? c.toString(r) : c;
  }, t.prototype._update = function() {
    throw new Error("_update must be implemented by subclass");
  }, $l = t, $l;
}
var jl, Yp;
function Hy() {
  if (Yp) return jl;
  Yp = 1;
  var n = po(), e = go(), t = _i().Buffer, r = [
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
  function u(I) {
    return I << 5 | I >>> 27;
  }
  function l(I) {
    return I << 30 | I >>> 2;
  }
  function c(I, y, _, x) {
    return I === 0 ? y & _ | ~y & x : I === 2 ? y & _ | y & x | _ & x : y ^ _ ^ x;
  }
  return o.prototype._update = function(I) {
    for (var y = this._w, _ = this._a | 0, x = this._b | 0, k = this._c | 0, D = this._d | 0, K = this._e | 0, C = 0; C < 16; ++C)
      y[C] = I.readInt32BE(C * 4);
    for (; C < 80; ++C)
      y[C] = y[C - 3] ^ y[C - 8] ^ y[C - 14] ^ y[C - 16];
    for (var M = 0; M < 80; ++M) {
      var J = ~~(M / 20), X = u(_) + c(J, x, k, D) + K + y[M] + r[J] | 0;
      K = D, D = k, k = l(x), x = _, _ = X;
    }
    this._a = _ + this._a | 0, this._b = x + this._b | 0, this._c = k + this._c | 0, this._d = D + this._d | 0, this._e = K + this._e | 0;
  }, o.prototype._hash = function() {
    var I = t.allocUnsafe(20);
    return I.writeInt32BE(this._a | 0, 0), I.writeInt32BE(this._b | 0, 4), I.writeInt32BE(this._c | 0, 8), I.writeInt32BE(this._d | 0, 12), I.writeInt32BE(this._e | 0, 16), I;
  }, jl = o, jl;
}
var Kl, Vp;
function Wy() {
  if (Vp) return Kl;
  Vp = 1;
  var n = po(), e = go(), t = _i().Buffer, r = [
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
  function u(y) {
    return y << 1 | y >>> 31;
  }
  function l(y) {
    return y << 5 | y >>> 27;
  }
  function c(y) {
    return y << 30 | y >>> 2;
  }
  function I(y, _, x, k) {
    return y === 0 ? _ & x | ~_ & k : y === 2 ? _ & x | _ & k | x & k : _ ^ x ^ k;
  }
  return o.prototype._update = function(y) {
    for (var _ = this._w, x = this._a | 0, k = this._b | 0, D = this._c | 0, K = this._d | 0, C = this._e | 0, M = 0; M < 16; ++M)
      _[M] = y.readInt32BE(M * 4);
    for (; M < 80; ++M)
      _[M] = u(_[M - 3] ^ _[M - 8] ^ _[M - 14] ^ _[M - 16]);
    for (var J = 0; J < 80; ++J) {
      var X = ~~(J / 20), le = l(x) + I(X, k, D, K) + C + _[J] + r[X] | 0;
      C = K, K = D, D = c(k), k = x, x = le;
    }
    this._a = x + this._a | 0, this._b = k + this._b | 0, this._c = D + this._c | 0, this._d = K + this._d | 0, this._e = C + this._e | 0;
  }, o.prototype._hash = function() {
    var y = t.allocUnsafe(20);
    return y.writeInt32BE(this._a | 0, 0), y.writeInt32BE(this._b | 0, 4), y.writeInt32BE(this._c | 0, 8), y.writeInt32BE(this._d | 0, 12), y.writeInt32BE(this._e | 0, 16), y;
  }, Kl = o, Kl;
}
var zl, Jp;
function vg() {
  if (Jp) return zl;
  Jp = 1;
  var n = po(), e = go(), t = _i().Buffer, r = [
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
  function u(x, k, D) {
    return D ^ x & (k ^ D);
  }
  function l(x, k, D) {
    return x & k | D & (x | k);
  }
  function c(x) {
    return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10);
  }
  function I(x) {
    return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7);
  }
  function y(x) {
    return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
  }
  function _(x) {
    return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ x >>> 10;
  }
  return o.prototype._update = function(x) {
    for (var k = this._w, D = this._a | 0, K = this._b | 0, C = this._c | 0, M = this._d | 0, J = this._e | 0, X = this._f | 0, le = this._g | 0, ce = this._h | 0, fe = 0; fe < 16; ++fe)
      k[fe] = x.readInt32BE(fe * 4);
    for (; fe < 64; ++fe)
      k[fe] = _(k[fe - 2]) + k[fe - 7] + y(k[fe - 15]) + k[fe - 16] | 0;
    for (var oe = 0; oe < 64; ++oe) {
      var ke = ce + I(J) + u(J, X, le) + r[oe] + k[oe] | 0, Be = c(D) + l(D, K, C) | 0;
      ce = le, le = X, X = J, J = M + ke | 0, M = C, C = K, K = D, D = ke + Be | 0;
    }
    this._a = D + this._a | 0, this._b = K + this._b | 0, this._c = C + this._c | 0, this._d = M + this._d | 0, this._e = J + this._e | 0, this._f = X + this._f | 0, this._g = le + this._g | 0, this._h = ce + this._h | 0;
  }, o.prototype._hash = function() {
    var x = t.allocUnsafe(32);
    return x.writeInt32BE(this._a, 0), x.writeInt32BE(this._b, 4), x.writeInt32BE(this._c, 8), x.writeInt32BE(this._d, 12), x.writeInt32BE(this._e, 16), x.writeInt32BE(this._f, 20), x.writeInt32BE(this._g, 24), x.writeInt32BE(this._h, 28), x;
  }, zl = o, zl;
}
var Gl, Zp;
function Yy() {
  if (Zp) return Gl;
  Zp = 1;
  var n = po(), e = vg(), t = go(), r = _i().Buffer, i = new Array(64);
  function o() {
    this.init(), this._w = i, t.call(this, 64, 56);
  }
  return n(o, e), o.prototype.init = function() {
    return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
  }, o.prototype._hash = function() {
    var u = r.allocUnsafe(28);
    return u.writeInt32BE(this._a, 0), u.writeInt32BE(this._b, 4), u.writeInt32BE(this._c, 8), u.writeInt32BE(this._d, 12), u.writeInt32BE(this._e, 16), u.writeInt32BE(this._f, 20), u.writeInt32BE(this._g, 24), u;
  }, Gl = o, Gl;
}
var Hl, Qp;
function gg() {
  if (Qp) return Hl;
  Qp = 1;
  var n = po(), e = go(), t = _i().Buffer, r = [
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
  function u(K, C, M) {
    return M ^ K & (C ^ M);
  }
  function l(K, C, M) {
    return K & C | M & (K | C);
  }
  function c(K, C) {
    return (K >>> 28 | C << 4) ^ (C >>> 2 | K << 30) ^ (C >>> 7 | K << 25);
  }
  function I(K, C) {
    return (K >>> 14 | C << 18) ^ (K >>> 18 | C << 14) ^ (C >>> 9 | K << 23);
  }
  function y(K, C) {
    return (K >>> 1 | C << 31) ^ (K >>> 8 | C << 24) ^ K >>> 7;
  }
  function _(K, C) {
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
    for (var C = this._w, M = this._ah | 0, J = this._bh | 0, X = this._ch | 0, le = this._dh | 0, ce = this._eh | 0, fe = this._fh | 0, oe = this._gh | 0, ke = this._hh | 0, Be = this._al | 0, Ce = this._bl | 0, $e = this._cl | 0, Fe = this._dl | 0, Se = this._el | 0, Ue = this._fl | 0, ot = this._gl | 0, vt = this._hl | 0, we = 0; we < 32; we += 2)
      C[we] = K.readInt32BE(we * 4), C[we + 1] = K.readInt32BE(we * 4 + 4);
    for (; we < 160; we += 2) {
      var He = C[we - 30], Ke = C[we - 15 * 2 + 1], It = y(He, Ke), Ve = _(Ke, He);
      He = C[we - 2 * 2], Ke = C[we - 2 * 2 + 1];
      var Xe = x(He, Ke), Ze = k(Ke, He), wt = C[we - 7 * 2], gt = C[we - 7 * 2 + 1], We = C[we - 16 * 2], lt = C[we - 16 * 2 + 1], Pe = Ve + gt | 0, he = It + wt + D(Pe, Ve) | 0;
      Pe = Pe + Ze | 0, he = he + Xe + D(Pe, Ze) | 0, Pe = Pe + lt | 0, he = he + We + D(Pe, lt) | 0, C[we] = he, C[we + 1] = Pe;
    }
    for (var Le = 0; Le < 160; Le += 2) {
      he = C[Le], Pe = C[Le + 1];
      var et = l(M, J, X), me = l(Be, Ce, $e), je = c(M, Be), yt = c(Be, M), ht = I(ce, Se), ct = I(Se, ce), st = r[Le], qe = r[Le + 1], Ot = u(ce, fe, oe), Rt = u(Se, Ue, ot), Me = vt + ct | 0, Qe = ke + ht + D(Me, vt) | 0;
      Me = Me + Rt | 0, Qe = Qe + Ot + D(Me, Rt) | 0, Me = Me + qe | 0, Qe = Qe + st + D(Me, qe) | 0, Me = Me + Pe | 0, Qe = Qe + he + D(Me, Pe) | 0;
      var St = yt + me | 0, Lt = je + et + D(St, yt) | 0;
      ke = oe, vt = ot, oe = fe, ot = Ue, fe = ce, Ue = Se, Se = Fe + Me | 0, ce = le + Qe + D(Se, Fe) | 0, le = X, Fe = $e, X = J, $e = Ce, J = M, Ce = Be, Be = Me + St | 0, M = Qe + Lt + D(Be, Me) | 0;
    }
    this._al = this._al + Be | 0, this._bl = this._bl + Ce | 0, this._cl = this._cl + $e | 0, this._dl = this._dl + Fe | 0, this._el = this._el + Se | 0, this._fl = this._fl + Ue | 0, this._gl = this._gl + ot | 0, this._hl = this._hl + vt | 0, this._ah = this._ah + M + D(this._al, Be) | 0, this._bh = this._bh + J + D(this._bl, Ce) | 0, this._ch = this._ch + X + D(this._cl, $e) | 0, this._dh = this._dh + le + D(this._dl, Fe) | 0, this._eh = this._eh + ce + D(this._el, Se) | 0, this._fh = this._fh + fe + D(this._fl, Ue) | 0, this._gh = this._gh + oe + D(this._gl, ot) | 0, this._hh = this._hh + ke + D(this._hl, vt) | 0;
  }, o.prototype._hash = function() {
    var K = t.allocUnsafe(64);
    function C(M, J, X) {
      K.writeInt32BE(M, X), K.writeInt32BE(J, X + 4);
    }
    return C(this._ah, this._al, 0), C(this._bh, this._bl, 8), C(this._ch, this._cl, 16), C(this._dh, this._dl, 24), C(this._eh, this._el, 32), C(this._fh, this._fl, 40), C(this._gh, this._gl, 48), C(this._hh, this._hl, 56), K;
  }, Hl = o, Hl;
}
var Wl, Xp;
function Vy() {
  if (Xp) return Wl;
  Xp = 1;
  var n = po(), e = gg(), t = go(), r = _i().Buffer, i = new Array(160);
  function o() {
    this.init(), this._w = i, t.call(this, 128, 112);
  }
  return n(o, e), o.prototype.init = function() {
    return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
  }, o.prototype._hash = function() {
    var u = r.allocUnsafe(48);
    function l(c, I, y) {
      u.writeInt32BE(c, y), u.writeInt32BE(I, y + 4);
    }
    return l(this._ah, this._al, 0), l(this._bh, this._bl, 8), l(this._ch, this._cl, 16), l(this._dh, this._dl, 24), l(this._eh, this._el, 32), l(this._fh, this._fl, 40), u;
  }, Wl = o, Wl;
}
var ed;
function Jy() {
  return ed || (ed = 1, function(n) {
    n.exports = function(t) {
      var r = t.toLowerCase(), i = n.exports[r];
      if (!i)
        throw new Error(r + " is not supported (we accept pull requests)");
      return new i();
    }, n.exports.sha = Hy(), n.exports.sha1 = Wy(), n.exports.sha224 = Yy(), n.exports.sha256 = vg(), n.exports.sha384 = Vy(), n.exports.sha512 = gg();
  }(Ku)), Ku.exports;
}
var Pf = Jy();
class Df {
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
var Bs;
class uu extends Df {
  /** @internal */
  constructor(t, r) {
    De(typeof t.digest == "string");
    super(t.digest, t.length, t.content_type, t.revpos);
    ee(this, Bs);
    G(this, Bs, r);
  }
  async getContents() {
    return p(this, Bs) ? p(this, Bs).call(this, this.digest, this.content_type) : Promise.reject(Error("No BlobLoader"));
  }
}
Bs = new WeakMap();
class yg extends uu {
  constructor(e, t) {
    super(e, t);
  }
  toJSON(e) {
    return this.asAttachmentDict(0);
  }
}
var Fs;
const ch = class ch extends Df {
  /** Constructs a NewBlob.
   *  @param contents  The raw data. Will be moved into the database when the document is saved.
   *                   The constructor makes a copy of this, so any modifications afterwards
   *                   will be ignored.
   *  @param content_type  MIME type of the contents; this is optional. */
  constructor(t, r) {
    super(ch.computeDigest(t), t.length, r);
    ee(this, Fs);
    G(this, Fs, new Uint8Array(t));
  }
  async getContents() {
    return Promise.resolve(p(this, Fs));
  }
  /** For convenience, a non-async accessor for the contents. */
  get contents() {
    return p(this, Fs);
  }
  /** @internal */
  static computeDigest(t) {
    return "sha1-" + new Pf.sha1().update(t).digest("base64");
  }
};
Fs = new WeakMap();
let co = ch;
function e_(n) {
  return n;
}
function ms(n) {
  return Array.isArray(n);
}
function Vt(n) {
  return typeof n == "object" && n !== null && !ms(n) && !Bf(n);
}
function Bf(n) {
  return n instanceof Df;
}
function Zy(n) {
  return Vt(n) ? n : void 0;
}
function mg(n) {
  return typeof n == "string" && n.length > 0 && n.length < 256 && n[0] !== "_";
}
function Qy(n) {
  return typeof n == "string" && n.length > 0 && n.length < 256;
}
function Ig(n) {
  if (!mg(n))
    throw Error(`"${n}" is not a valid document ID`);
}
function bg(n, e = !0) {
  return ms(n) ? Xy(n, e) : Vt(n) ? La(n, e) : n;
}
function Xy(n, e = !0) {
  if (!e)
    return n.slice();
  const t = new Array(n.length);
  let r = 0;
  for (const i of n)
    t[r++] = bg(i, !0);
  return t;
}
function La(n, e = !0) {
  const t = {};
  for (const r of Object.getOwnPropertyNames(n)) {
    const i = n[r];
    t[r] = e ? bg(i, !0) : i;
  }
  return t;
}
function fo(n, e) {
  const t = typeof n;
  if (t !== typeof e)
    return !1;
  if (t !== "object" || n === null)
    return n === e;
  if (Array.isArray(n)) {
    const r = n.length;
    return !Array.isArray(e) || r !== e.length ? !1 : n.every((i, o) => fo(i, e[o]));
  } else {
    const r = n, i = e, o = Object.keys(r);
    return o.length !== Object.keys(i).length ? !1 : o.every((u) => fo(r[u], i[u]));
  }
}
const Xc = "cbl_checkpoints", Po = "cbl_collections", Yl = "cbl_blobs", qo = "id", Do = "seq", Ra = "expires", An = 1, Rs = 64, Sr = 128;
function Ts(n) {
  return n.flags !== void 0 && (n.flags & Sr) !== 0;
}
function Ii(n) {
  const e = n.indexOf("-");
  if (e >= 1) {
    const t = Number(n.substring(0, e));
    if (t > 0 && Number.isSafeInteger(t))
      return t;
  }
  throw Error(`Invalid revision id '${n}'`);
}
function Mo(n, e) {
  return n === void 0 ? !1 : e === void 0 ? !0 : Ii(n) > Ii(e);
}
function qa(n, e, t) {
  let r = new Pf.sha1();
  n ? r.update(new Uint8Array([Math.min(n.length, 255)])).update(n) : r.update(new Uint8Array([0])), r.update(new Uint8Array([t ? 1 : 0])), t || r.update(JSON.stringify(Ff(e)));
  const i = r.digest("hex");
  return `${n ? Ii(n) + 1 : 1}-${i}`;
}
function em(n) {
  let e = {};
  for (const t of Object.keys(n).sort())
    e[t] = Ff(n[t]);
  return e;
}
function Ff(n) {
  return Array.isArray(n) ? n.map((e) => Ff(e)) : Vt(n) ? em(n) : n;
}
const Ma = "_id", Ua = "_sequence", $a = "_expires";
class ps {
  constructor(e, t, r, i) {
    this.name = e, this.keypath = t, this.indexed = r, this.encrypted = i, De(!(r && i)), (e.length === 0 || t.length === 0) && this.bad();
  }
  /** Creates a DocProperty from a public property name or path. */
  static create(e, t = !1, r = !1) {
    switch (e) {
      case Ma:
        return new Vl(Ma, qo);
      case Ua:
        return new Vl(Ua, Do);
      case $a:
        return new Vl($a, Ra);
      default:
        return e.indexOf(".") < 0 ? new _g(e, t, r) : new tm(e, t, r);
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
class Vl extends ps {
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
class _g extends ps {
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
class tm extends _g {
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
      if (!Vt(r))
        return;
      r = r[i];
    }
    return r;
  }
}
function ia(n) {
  return typeof n != "object" || n === null;
}
function rm(n) {
  const e = Array.from(n, (t) => String.fromCodePoint(t)).join("");
  return btoa(e);
}
function nm(n) {
  try {
    return Uint8Array.from(atob(n), (e) => e.codePointAt(0));
  } catch {
    return;
  }
}
function wg(n, e) {
  return "Basic " + btoa(n + ":" + e);
}
const xg = 6048e5, im = 864e5, Eg = 6e4, Sg = 36e5, td = Symbol.for("constructDateFrom");
function bn(n, e) {
  return typeof n == "function" ? n(e) : n && typeof n == "object" && td in n ? n[td](e) : n instanceof Date ? new n.constructor(e) : new Date(e);
}
function Gr(n, e) {
  return bn(e || n, n);
}
function Ag(n, e, t) {
  const r = Gr(n, t == null ? void 0 : t.in);
  return isNaN(e) ? bn((t == null ? void 0 : t.in) || n, NaN) : (e && r.setDate(r.getDate() + e), r);
}
function Lf(n, e, t) {
  const r = Gr(n, t == null ? void 0 : t.in);
  if (isNaN(e)) return bn((t == null ? void 0 : t.in) || n, NaN);
  if (!e)
    return r;
  const i = r.getDate(), o = bn((t == null ? void 0 : t.in) || n, r.getTime());
  o.setMonth(r.getMonth() + e + 1, 0);
  const u = o.getDate();
  return i >= u ? o : (r.setFullYear(
    o.getFullYear(),
    o.getMonth(),
    i
  ), r);
}
function qf(n, e, t) {
  return bn((t == null ? void 0 : t.in) || n, +Gr(n) + e);
}
function sm(n, e, t) {
  return qf(n, e * Sg, t);
}
let om = {};
function am() {
  return om;
}
function ef(n, e) {
  var l, c, I, y;
  const t = am(), r = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (l = e == null ? void 0 : e.locale) == null ? void 0 : l.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((y = (I = t.locale) == null ? void 0 : I.options) == null ? void 0 : y.weekStartsOn) ?? 0, i = Gr(n, e == null ? void 0 : e.in), o = i.getDay(), u = (o < r ? 7 : 0) + o - r;
  return i.setDate(i.getDate() - u), i.setHours(0, 0, 0, 0), i;
}
function Uo(n, e) {
  return ef(n, { ...e, weekStartsOn: 1 });
}
function ja(n, e) {
  const t = Gr(n, e == null ? void 0 : e.in), r = t.getFullYear(), i = bn(t, 0);
  i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const o = Uo(i), u = bn(t, 0);
  u.setFullYear(r, 0, 4), u.setHours(0, 0, 0, 0);
  const l = Uo(u);
  return t.getTime() >= o.getTime() ? r + 1 : t.getTime() >= l.getTime() ? r : r - 1;
}
function ho(n) {
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
function wi(n, ...e) {
  const t = bn.bind(
    null,
    n || e.find((r) => typeof r == "object")
  );
  return e.map(t);
}
function rd(n, e) {
  const t = Gr(n, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function Ta(n, e, t) {
  const [r, i] = wi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = rd(r), u = rd(i), l = +o - ho(o), c = +u - ho(u);
  return Math.round((l - c) / im);
}
function nd(n, e) {
  const t = ja(n, e), r = bn((e == null ? void 0 : e.in) || n, 0);
  return r.setFullYear(t, 0, 4), r.setHours(0, 0, 0, 0), Uo(r);
}
function um(n, e, t) {
  let r = Gr(n, t == null ? void 0 : t.in);
  const i = Ta(
    r,
    nd(r, t)
  ), o = bn((t == null ? void 0 : t.in) || n, 0);
  return o.setFullYear(e, 0, 4), o.setHours(0, 0, 0, 0), r = nd(o), r.setDate(r.getDate() + i), r;
}
function lm(n, e, t) {
  return um(n, ja(n, t) + e, t);
}
function cm(n, e, t) {
  const r = Gr(n, t == null ? void 0 : t.in);
  return r.setTime(r.getTime() + e * Eg), r;
}
function fm(n, e, t) {
  return Lf(n, e * 3, t);
}
function hm(n, e, t) {
  return qf(n, e * 1e3, t);
}
function pm(n, e, t) {
  return Ag(n, e * 7, t);
}
function dm(n, e, t) {
  return Lf(n, e * 12, t);
}
function vm(n, e, t) {
  const [r, i] = wi(
    t == null ? void 0 : t.in,
    n,
    e
  );
  return ja(r, t) - ja(i, t);
}
function gm(n, e, t) {
  const [r, i] = wi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = Uo(r), u = Uo(i), l = +o - ho(o), c = +u - ho(u);
  return Math.round((l - c) / xg);
}
function ym(n, e, t) {
  const [r, i] = wi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = r.getFullYear() - i.getFullYear(), u = r.getMonth() - i.getMonth();
  return o * 12 + u;
}
function id(n, e) {
  const t = Gr(n, e == null ? void 0 : e.in);
  return Math.trunc(t.getMonth() / 3) + 1;
}
function mm(n, e, t) {
  const [r, i] = wi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = r.getFullYear() - i.getFullYear(), u = id(r) - id(i);
  return o * 4 + u;
}
function Im(n, e, t) {
  const [r, i] = wi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = ef(r, t), u = ef(i, t), l = +o - ho(o), c = +u - ho(u);
  return Math.round((l - c) / xg);
}
function kg(n, e, t) {
  const [r, i] = wi(
    t == null ? void 0 : t.in,
    n,
    e
  );
  return r.getFullYear() - i.getFullYear();
}
function Mf(n) {
  return (e) => {
    const r = (n ? Math[n] : Math.trunc)(e);
    return r === 0 ? 0 : r;
  };
}
function bm(n, e, t) {
  const [r, i] = wi(
    t == null ? void 0 : t.in,
    n,
    e
  ), o = (+r - +i) / Sg;
  return Mf(t == null ? void 0 : t.roundingMethod)(o);
}
function Uf(n, e) {
  return +Gr(n) - +Gr(e);
}
function _m(n, e, t) {
  const r = Uf(n, e) / Eg;
  return Mf(t == null ? void 0 : t.roundingMethod)(r);
}
function wm(n, e, t) {
  const r = Uf(n, e) / 1e3;
  return Mf(t == null ? void 0 : t.roundingMethod)(r);
}
function xm(n, e, t = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: n,
    timeZoneName: t
  }).format(e).split(/\s/g).slice(2).join(" ");
}
const Jl = {}, To = {};
function Bo(n, e) {
  try {
    const r = (Jl[n] || (Jl[n] = new Intl.DateTimeFormat("en-US", {
      timeZone: n,
      timeZoneName: "longOffset"
    }).format))(e).split("GMT")[1];
    return r in To ? To[r] : sd(r, r.split(":"));
  } catch {
    if (n in To) return To[n];
    const t = n == null ? void 0 : n.match(Em);
    return t ? sd(n, t.slice(1)) : NaN;
  }
}
const Em = /([+-]\d\d):?(\d\d)?/;
function sd(n, e) {
  const t = +(e[0] || 0), r = +(e[1] || 0);
  return To[n] = t > 0 ? t * 60 + r : t * 60 - r;
}
class yn extends Date {
  //#region static
  constructor(...e) {
    super(), e.length > 1 && typeof e[e.length - 1] == "string" && (this.timeZone = e.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Bo(this.timeZone, this)) ? this.setTime(NaN) : e.length ? typeof e[0] == "number" && (e.length === 1 || e.length === 2 && typeof e[1] != "number") ? this.setTime(e[0]) : typeof e[0] == "string" ? this.setTime(+new Date(e[0])) : e[0] instanceof Date ? this.setTime(+e[0]) : (this.setTime(+new Date(...e)), Og(this), tf(this)) : this.setTime(Date.now());
  }
  static tz(e, ...t) {
    return t.length ? new yn(...t, e) : new yn(Date.now(), e);
  }
  //#endregion
  //#region time zone
  withTimeZone(e) {
    return new yn(+this, e);
  }
  getTimezoneOffset() {
    return -Bo(this.timeZone, this);
  }
  //#endregion
  //#region time
  setTime(e) {
    return Date.prototype.setTime.apply(this, arguments), tf(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](e) {
    return new yn(+new Date(e), this.timeZone);
  }
  //#endregion
}
const od = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((n) => {
  if (!od.test(n)) return;
  const e = n.replace(od, "$1UTC");
  yn.prototype[e] && (n.startsWith("get") ? yn.prototype[n] = function() {
    return this.internal[e]();
  } : (yn.prototype[n] = function() {
    return Date.prototype[e].apply(this.internal, arguments), Sm(this), +this;
  }, yn.prototype[e] = function() {
    return Date.prototype[e].apply(this, arguments), tf(this), +this;
  }));
});
function tf(n) {
  n.internal.setTime(+n), n.internal.setUTCMinutes(n.internal.getUTCMinutes() - n.getTimezoneOffset());
}
function Sm(n) {
  Date.prototype.setFullYear.call(n, n.internal.getUTCFullYear(), n.internal.getUTCMonth(), n.internal.getUTCDate()), Date.prototype.setHours.call(n, n.internal.getUTCHours(), n.internal.getUTCMinutes(), n.internal.getUTCSeconds(), n.internal.getUTCMilliseconds()), Og(n);
}
function Og(n) {
  const e = Bo(n.timeZone, n), t = /* @__PURE__ */ new Date(+n);
  t.setUTCHours(t.getUTCHours() - 1);
  const r = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset(), i = -(/* @__PURE__ */ new Date(+t)).getTimezoneOffset(), o = r - i, u = Date.prototype.getHours.apply(n) !== n.internal.getUTCHours();
  o && u && n.internal.setUTCMinutes(n.internal.getUTCMinutes() + o);
  const l = r - e;
  l && Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + l);
  const c = Bo(n.timeZone, n), y = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset() - c, _ = c !== e, x = y - l;
  if (_ && x) {
    Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + x);
    const k = Bo(n.timeZone, n), D = c - k;
    D && (n.internal.setUTCMinutes(n.internal.getUTCMinutes() + D), Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + D));
  }
}
class Di extends yn {
  //#region static
  static tz(e, ...t) {
    return t.length ? new Di(...t, e) : new Di(Date.now(), e);
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
    return `${e} GMT${t}${r}${i} (${xm(this.timeZone, this)})`;
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
    return new Di(+this, e);
  }
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](e) {
    return new Di(+new Date(e), this.timeZone);
  }
  //#endregion
}
var Zl, ad;
function Rg() {
  if (ad) return Zl;
  ad = 1;
  var n = Object.prototype.toString;
  return Zl = function(t) {
    var r = n.call(t), i = r === "[object Arguments]";
    return i || (i = r !== "[object Array]" && t !== null && typeof t == "object" && typeof t.length == "number" && t.length >= 0 && n.call(t.callee) === "[object Function]"), i;
  }, Zl;
}
var Ql, ud;
function Am() {
  if (ud) return Ql;
  ud = 1;
  var n;
  if (!Object.keys) {
    var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, r = Rg(), i = Object.prototype.propertyIsEnumerable, o = !i.call({ toString: null }, "toString"), u = i.call(function() {
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
    }, I = {
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
    }, y = function() {
      if (typeof window > "u")
        return !1;
      for (var x in window)
        try {
          if (!I["$" + x] && e.call(window, x) && window[x] !== null && typeof window[x] == "object")
            try {
              c(window[x]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    }(), _ = function(x) {
      if (typeof window > "u" || !y)
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
      var X = u && K;
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
        for (var oe = _(k), ke = 0; ke < l.length; ++ke)
          !(oe && l[ke] === "constructor") && e.call(k, l[ke]) && J.push(l[ke]);
      return J;
    };
  }
  return Ql = n, Ql;
}
var Xl, ld;
function km() {
  if (ld) return Xl;
  ld = 1;
  var n = Array.prototype.slice, e = Rg(), t = Object.keys, r = t ? function(u) {
    return t(u);
  } : Am(), i = Object.keys;
  return r.shim = function() {
    if (Object.keys) {
      var u = function() {
        var l = Object.keys(arguments);
        return l && l.length === arguments.length;
      }(1, 2);
      u || (Object.keys = function(c) {
        return e(c) ? i(n.call(c)) : i(c);
      });
    } else
      Object.keys = r;
    return Object.keys || r;
  }, Xl = r, Xl;
}
var ec, cd;
function Tg() {
  if (cd) return ec;
  cd = 1;
  var n = km(), e = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", t = Object.prototype.toString, r = Array.prototype.concat, i = /* @__PURE__ */ hg(), o = function(I) {
    return typeof I == "function" && t.call(I) === "[object Function]";
  }, u = /* @__PURE__ */ pg()(), l = function(I, y, _, x) {
    if (y in I) {
      if (x === !0) {
        if (I[y] === _)
          return;
      } else if (!o(x) || !x())
        return;
    }
    u ? i(I, y, _, !0) : i(I, y, _);
  }, c = function(I, y) {
    var _ = arguments.length > 2 ? arguments[2] : {}, x = n(y);
    e && (x = r.call(x, Object.getOwnPropertySymbols(y)));
    for (var k = 0; k < x.length; k += 1)
      l(I, x[k], y[x[k]], _[x[k]]);
  };
  return c.supportsDescriptors = !!u, ec = c, ec;
}
var tc, fd;
function Om() {
  if (fd) return tc;
  fd = 1;
  var n = /* @__PURE__ */ kf();
  return tc = function(t) {
    return (typeof t == "number" || typeof t == "bigint") && !n(t) && t !== 1 / 0 && t !== -1 / 0;
  }, tc;
}
var rc, hd;
function $f() {
  if (hd) return rc;
  hd = 1;
  var n = /* @__PURE__ */ sg(), e = /* @__PURE__ */ ou(), t = /* @__PURE__ */ kf(), r = /* @__PURE__ */ Om();
  return rc = function(o) {
    if (typeof o != "number" || t(o) || !r(o))
      return !1;
    var u = n(o);
    return e(u) === u;
  }, rc;
}
var nc, pd;
function Cg() {
  if (pd) return nc;
  pd = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Ln(), t = /* @__PURE__ */ $f(), r = e("Number.prototype.toString");
  return nc = function(o, u) {
    if (typeof o != "number")
      throw new n("Assertion failed: `x` must be a Number");
    if (!t(u) || u < 2 || u > 36)
      throw new n("Assertion failed: `radix` must be an integer >= 2 and <= 36");
    return r(o, u);
  }, nc;
}
var ic, dd;
function Rm() {
  if (dd) return ic;
  dd = 1;
  var n = /* @__PURE__ */ Ln(), e = /* @__PURE__ */ sr(), t = /* @__PURE__ */ $f(), r = n("String.prototype.slice");
  return ic = function(o, u, l) {
    if (typeof o != "string")
      throw new e("Assertion failed: `string` must be a String");
    if (typeof u != "string")
      throw new e("Assertion failed: `searchValue` must be a String");
    if (!t(l) || l < 0)
      throw new e("Assertion failed: `fromIndex` must be a non-negative integer");
    var c = o.length;
    if (u === "" && l <= c)
      return l;
    for (var I = u.length, y = l; y <= c - I; y += 1) {
      var _ = r(o, y, y + I);
      if (_ === u)
        return y;
    }
    return -1;
  }, ic;
}
var sc, vd;
function Ng() {
  if (vd) return sc;
  vd = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Ln(), t = /* @__PURE__ */ $f(), r = e("String.prototype.slice");
  return sc = function(o, u, l, c) {
    if (typeof o != "string")
      throw new n("Assertion failed: `S` must be a String");
    if (!t(u) || u < 0)
      throw new n("Assertion failed: `maxLength` must be a non-negative integer");
    if (typeof l != "string")
      throw new n("Assertion failed: `fillString` must be a String");
    if (c !== "start" && c !== "end" && c !== "START" && c !== "END")
      throw new n("Assertion failed: `placement` must be ~START~ or ~END~");
    var I = o.length;
    if (u <= I || l === "")
      return o;
    for (var y = u - I, _ = ""; _.length < y; )
      _ += l;
    return _ = r(_, 0, y), c === "start" || c === "START" ? _ + o : o + _;
  }, sc;
}
var oc, gd;
function Tm() {
  if (gd) return oc;
  gd = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Ln(), t = e("String.prototype.charCodeAt"), r = e("Number.prototype.toString"), i = e("String.prototype.toLowerCase"), o = /* @__PURE__ */ Ng();
  return oc = function(l) {
    if (typeof l != "string" || l.length !== 1)
      throw new n("Assertion failed: `C` must be a single code unit");
    var c = t(l, 0);
    if (c > 65535)
      throw new n("`Assertion failed: numeric value of `C` must be <= 0xFFFF");
    return "\\u" + o(i(r(c, 16)), 4, "0", "start");
  }, oc;
}
var ac, yd;
function Cm() {
  if (yd) return ac;
  yd = 1;
  var n = /* @__PURE__ */ ou();
  return ac = function(t) {
    return typeof t == "bigint" ? t : n(t);
  }, ac;
}
var uc, md;
function Nm() {
  if (md) return uc;
  md = 1;
  var n = /* @__PURE__ */ ou();
  return uc = function(t, r) {
    var i = t % r;
    return n(i >= 0 ? i : i + r);
  }, uc;
}
var lc, Id;
function Pm() {
  return Id || (Id = 1, lc = /* @__PURE__ */ Nm()), lc;
}
var cc, bd;
function Dm() {
  if (bd) return cc;
  bd = 1;
  var n = /* @__PURE__ */ Pm();
  return cc = function(t, r) {
    return n(t, r);
  }, cc;
}
var fc, _d;
function Pg() {
  return _d || (_d = 1, fc = function(e) {
    return typeof e == "number" && e >= 0 && e <= 1114111 && (e | 0) === e;
  }), fc;
}
var hc, wd;
function Bm() {
  if (wd) return hc;
  wd = 1;
  var n = /* @__PURE__ */ na(), e = /* @__PURE__ */ sr(), t = n("%String.fromCharCode%"), r = /* @__PURE__ */ Cm(), i = /* @__PURE__ */ Dm(), o = /* @__PURE__ */ Pg();
  return hc = function(l) {
    if (!o(l))
      throw new e("Assertion failed: `cp` must be >= 0 and <= 0x10FFFF");
    if (l <= 65535)
      return t(l);
    var c = t(r((l - 65536) / 1024) + 55296), I = t(i(l - 65536, 1024) + 56320);
    return c + I;
  }, hc;
}
var pc, xd;
function jf() {
  return xd || (xd = 1, pc = function(e) {
    return typeof e == "number" && e >= 55296 && e <= 56319;
  }), pc;
}
var dc, Ed;
function Kf() {
  return Ed || (Ed = 1, dc = function(e) {
    return typeof e == "number" && e >= 56320 && e <= 57343;
  }), dc;
}
var vc, Sd;
function Fm() {
  if (Sd) return vc;
  Sd = 1;
  var n = /* @__PURE__ */ Ln(), e = dg()(), t = /* @__PURE__ */ fg(), r = /* @__PURE__ */ vo(), i;
  if (e) {
    var o = n("RegExp.prototype.exec"), u = {}, l = function() {
      throw u;
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
        return K === u;
      }
    };
  } else {
    var I = n("Object.prototype.toString"), y = "[object RegExp]";
    i = function(x) {
      return !x || typeof x != "object" && typeof x != "function" ? !1 : I(x) === y;
    };
  }
  return vc = i, vc;
}
var gc, Ad;
function Dg() {
  if (Ad) return gc;
  Ad = 1;
  var n = /* @__PURE__ */ Ln(), e = Fm(), t = n("RegExp.prototype.exec"), r = /* @__PURE__ */ sr();
  return gc = function(o) {
    if (!e(o))
      throw new r("`regex` must be a RegExp");
    return function(l) {
      return t(o, l) !== null;
    };
  }, gc;
}
var yc, kd;
function Lm() {
  if (kd) return yc;
  kd = 1;
  var n = /* @__PURE__ */ Cg(), e = /* @__PURE__ */ Rm(), t = /* @__PURE__ */ Ng(), r = /* @__PURE__ */ Tm(), i = /* @__PURE__ */ Bm(), o = /* @__PURE__ */ jf(), u = /* @__PURE__ */ Kf(), l = /* @__PURE__ */ sr(), c = /* @__PURE__ */ Pg(), I = Cf(), y = /* @__PURE__ */ Dg(), _ = y(/^\s$/), x = y(/^[\n\r\u2028\u2029]$/), k = "^$\\.*+?()[]{}|", D = ",-=<>#&!%:;@~'`\"", K = {
    "	": "t",
    "\n": "n",
    "\v": "v",
    "\f": "f",
    "\r": "r",
    __proto__: null
  };
  return yc = function(M) {
    if (!c(M))
      throw new l("Assertion failed: `c` must be a valid Unicode code point");
    var J = i(M);
    if (e(k, J, 0) > -1 || J === "/")
      return "\\" + J;
    if (J in K)
      return "\\" + K[J];
    if (e(D, J, 0) > -1 || _(J) || x(J) || o(M) || u(M)) {
      if (M < 255) {
        var X = n(M, 16);
        return "\\x" + t(X, 2, "0", "START");
      }
      var le = "", ce = J;
      return I(ce, function(fe) {
        le += r(fe);
      }), le;
    }
    return J;
  }, yc;
}
var mc, Od;
function qm() {
  if (Od) return mc;
  Od = 1;
  var n = /* @__PURE__ */ na(), e = /* @__PURE__ */ sr(), t = n("%String.fromCharCode%"), r = /* @__PURE__ */ jf(), i = /* @__PURE__ */ Kf();
  return mc = function(u, l) {
    if (!r(u) || !i(l))
      throw new e("Assertion failed: `lead` must be a leading surrogate char code, and `trail` must be a trailing surrogate char code");
    return t(u) + t(l);
  }, mc;
}
var Ic, Rd;
function Mm() {
  if (Rd) return Ic;
  Rd = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Ln(), t = /* @__PURE__ */ jf(), r = /* @__PURE__ */ Kf(), i = /* @__PURE__ */ qm(), o = e("String.prototype.charAt"), u = e("String.prototype.charCodeAt");
  return Ic = function(c, I) {
    if (typeof c != "string")
      throw new n("Assertion failed: `string` must be a String");
    var y = c.length;
    if (I < 0 || I >= y)
      throw new n("Assertion failed: `position` must be >= 0, and < the length of `string`");
    var _ = u(c, I), x = o(c, I), k = t(_), D = r(_);
    if (!k && !D)
      return {
        "[[CodePoint]]": x,
        "[[CodeUnitCount]]": 1,
        "[[IsUnpairedSurrogate]]": !1
      };
    if (D || I + 1 === y)
      return {
        "[[CodePoint]]": x,
        "[[CodeUnitCount]]": 1,
        "[[IsUnpairedSurrogate]]": !0
      };
    var K = u(c, I + 1);
    return r(K) ? {
      "[[CodePoint]]": i(_, K),
      "[[CodeUnitCount]]": 2,
      "[[IsUnpairedSurrogate]]": !1
    } : {
      "[[CodePoint]]": x,
      "[[CodeUnitCount]]": 1,
      "[[IsUnpairedSurrogate]]": !0
    };
  }, Ic;
}
var bc, Td;
function Um() {
  if (Td) return bc;
  Td = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Mm();
  return bc = function(r) {
    if (typeof r != "string")
      throw new n("Assertion failed: `string` must be a String");
    for (var i = [], o = r.length, u = 0; u < o; ) {
      var l = e(r, u);
      i[i.length] = l["[[CodePoint]]"], u += l["[[CodeUnitCount]]"];
    }
    return i;
  }, bc;
}
var _c, Cd;
function $m() {
  if (Cd) return _c;
  Cd = 1;
  var n = /* @__PURE__ */ na(), e = Nf(), t = e(n("String.prototype.indexOf"));
  return _c = function(i, o) {
    var u = n(i, !!o);
    return typeof u == "function" && t(i, ".prototype.") > -1 ? e(u) : u;
  }, _c;
}
var wc, Nd;
function Bg() {
  if (Nd) return wc;
  Nd = 1;
  var n = Lm(), e = /* @__PURE__ */ Cg(), t = /* @__PURE__ */ Um(), r = /* @__PURE__ */ Dg(), i = Cf(), o = /* @__PURE__ */ sr(), u = r(/^[\da-zA-Z]$/), l = $m(), c = l("String.prototype.charCodeAt"), I = function(_) {
    var x = c(_, 0);
    if (x < 55296 || x > 56319 || _.length === 1)
      return x;
    var k = c(_, 1);
    return k < 56320 || k > 57343 ? x : (x - 55296) * 1024 + (k - 56320) + 65536;
  };
  return wc = function(_) {
    if (typeof _ != "string")
      throw new o("`S` must be a String");
    var x = "", k = t(_);
    return i(k, function(D) {
      if (x === "" && u(D)) {
        var K = e(I(D), 16);
        x += "\\x" + K;
      } else
        x += n(I(D));
    }), x;
  }, wc;
}
var xc, Pd;
function Fg() {
  if (Pd) return xc;
  Pd = 1;
  var n = Bg();
  return xc = function() {
    return RegExp.escape || n;
  }, xc;
}
var Ec, Dd;
function jm() {
  if (Dd) return Ec;
  Dd = 1;
  var n = Tg(), e = Fg()();
  return Ec = function() {
    return n(RegExp, {
      escape: e
    }), RegExp.escape;
  }, Ec;
}
var Sc, Bd;
function Km() {
  if (Bd) return Sc;
  Bd = 1;
  var n = Tg(), e = Nf(), t = Bg(), r = Fg(), i = jm(), o = e(t, null);
  return n(o, {
    getPolyfill: r,
    implementation: t,
    method: t,
    // TODO: remove at semver-major
    shim: i
  }), Sc = o, Sc;
}
var zm = Km();
const Gm = /* @__PURE__ */ Af(zm);
var eg;
const Hm = ((eg = Object.getOwnPropertyDescriptor(RegExp, "escape")) == null ? void 0 : eg.value) ?? Gm;
function Wm(n) {
  if (!Array.isArray(n)) return null;
  let e = 0, t = 0;
  for (const r of n)
    typeof r == "number" && (e += r, t += 1);
  return t > 0 ? e / t : null;
}
function Lg(n, e) {
  return Array.isArray(n) ? Ga(e) < 5 ? n.includes(e) : n.some((t) => Fn(t, e)) : null;
}
function Ym(n) {
  if (!Array.isArray(n)) return null;
  let e = 0;
  for (const t of n)
    t !== null && ++e;
  return e;
}
function Vm(n) {
  if (!Array.isArray(n)) return null;
  for (const e of n)
    if (e !== null) return e;
  return null;
}
function Jm(n) {
  return Array.isArray(n) ? n.length : null;
}
function qg(n, e) {
  if (!Array.isArray(n)) return null;
  let t = null, r = !0;
  for (const i of n)
    i !== null && ((r || Yt(i, t) === e) && (t = i), r = !1);
  return t;
}
function Zm(n) {
  return qg(n, 1);
}
function Qm(n) {
  return qg(n, -1);
}
function Xm(n) {
  if (!Array.isArray(n)) return null;
  let e = 0;
  for (const t of n)
    typeof t == "number" && (e += t);
  return e;
}
function Yt(n, e) {
  const t = Ga(n), r = Ga(e);
  if (t !== r)
    return Math.sign(t - r);
  switch (t) {
    case 5: {
      const i = n, o = e, u = i.length, l = o.length, c = Math.min(u, l);
      for (let I = 0; I < c; ++I) {
        const y = Yt(i[I], o[I]);
        if (y !== 0)
          return y;
      }
      return Math.sign(u - l);
    }
    case 6: {
      const i = n, o = e, u = Object.getOwnPropertyNames(i), l = Object.getOwnPropertyNames(o), c = u.length, I = Math.sign(c - l.length);
      if (I !== 0) return I;
      u.sort(), l.sort();
      for (let y = 0; y < c; ++y) {
        const _ = u[y], x = l[y];
        if (_ !== x)
          return _ > x ? 1 : -1;
        const k = Yt(i[_], o[x]);
        if (k !== 0) return k;
      }
      return 0;
    }
    default:
      return n < e ? -1 : n > e ? 1 : 0;
  }
}
function Fn(n, e) {
  return n === void 0 || e === void 0 ? n === e : fo(n, e);
}
function Fd(n, e) {
  let t;
  for (const r of n) {
    const i = r();
    i != null && (t === void 0 || Yt(i, t) === e) && (t = i);
  }
  return t ?? null;
}
function e1(n, e) {
  if (!(e === void 0 || Fn(n, e)))
    return e === null ? null : n;
}
function t1(n, e) {
  if (!(n === void 0 || e === void 0))
    return e === null || Fn(n, e) ? null : n;
}
const Mg = { millennium: 1e3, century: 100, decade: 10 }, r1 = {
  year: kg,
  iso_year: vm,
  quarter: mm,
  month: ym,
  week: Im,
  iso_week: gm,
  day: Ta,
  day_of_year: Ta,
  doy: Ta,
  hour: bm,
  minute: _m,
  second: wm,
  millisecond: Uf
}, n1 = {
  year: dm,
  iso_year: lm,
  quarter: fm,
  month: Lf,
  week: pm,
  day: Ag,
  hour: sm,
  minute: cm,
  second: hm,
  millisecond: qf
};
function i1(n, e, t) {
  let r = Mg[t];
  r !== void 0 && (e *= r, t = "year");
  const i = n1[t];
  if (i === void 0)
    return console.error(`date_add_str(): Unsupported date part "${t}"`), null;
  const o = i(n, e);
  return typeof n == "string" ? o.toISOString() : o.valueOf();
}
function s1(n, e, t) {
  const r = r1[t];
  if (r !== void 0)
    return r(n, e);
  let i = Mg[t];
  return i !== void 0 ? Math.trunc(kg(n, e) / i) : (console.error(`date_diff_str(): Unsupported date part "${t}"`), null);
}
function Ug(n) {
  return new Di(n).toISOString();
}
function zf(n) {
  return new Date(n).toISOString();
}
function $g(n, e) {
  if (e === void 0)
    return Ug(n);
  if (e === "UTC")
    return zf(n);
  try {
    return new Di(n, e).toISOString();
  } catch (t) {
    if (!(t instanceof RangeError))
      throw t;
    return console.error(`millis_to_tz(): Unknown time zone "${e}"`), null;
  }
}
function o1(n) {
  const e = Date.parse(n);
  return isNaN(e) ? null : e;
}
function a1(n) {
  const e = Date.parse(n);
  return isNaN(e) ? null : zf(e);
}
function u1(n, e) {
  const t = Date.parse(n);
  return isNaN(t) ? null : $g(t, e);
}
function l1(n, e) {
  let t = n / e;
  return isFinite(t) ? (n === Math.floor(n) && e === Math.floor(e) && (t = Math.floor(t)), t) : null;
}
function c1(n, e, t) {
  const r = Ka(n), i = Ka(e);
  if (r === void 0 || i === void 0)
    return null;
  const o = r.length;
  if (i.length !== o)
    return null;
  let u = 0;
  for (let l = 0; l < o; ++l) {
    const c = r[l] - i[l];
    u += c * c;
  }
  return Math.pow(u, (t ?? 1) / 2);
}
function f1(n, e) {
  const t = Ka(n), r = Ka(e);
  if (t === void 0 || r === void 0)
    return null;
  const i = t.length;
  if (r.length !== i)
    return null;
  let o = 0, u = 0, l = 0;
  for (let c = 0; c < i; ++c) {
    const I = t[c], y = r[c];
    o += I * I, u += I * y, l += y * y;
  }
  return 1 - u / Math.sqrt(o * l);
}
function Ka(n) {
  if (Array.isArray(n))
    return n;
  if (typeof n == "string") {
    const e = nm(n);
    return e === void 0 || e.length % 4 !== 0 ? void 0 : new Float32Array(e.buffer);
  } else
    return;
}
function h1(n, e) {
  let t = n / e;
  return isFinite(t) ? Math.floor(t) : null;
}
function Gf(n, e, t) {
  if (e === 0)
    return t(n);
  if (e !== Math.trunc(e))
    return null;
  const r = Math.pow(10, e);
  return t(n * r) / r;
}
function Ld(n, e = 0) {
  return Gf(n, e, Math.round);
}
function jg(n, e = 0) {
  return Gf(n, e, (t) => {
    const r = Math.floor(t);
    return t - r === 0.5 ? r % 2 ? r + 1 : r : Math.round(t);
  });
}
function p1(n, e) {
  return Gf(n, e, Math.trunc);
}
function d1(n, e) {
  const [t, r] = Hf(e);
  switch (t) {
    case 0:
      return n === r;
    case 1:
      return n.startsWith(r);
    case 2:
      return n.endsWith(r);
    default:
      return Kg(e).test(n);
  }
}
function Ac(n) {
  return n.replaceAll(/\\(.)/g, "$1");
}
function Kg(n) {
  const e = n.split(/([%_])/), t = e.length;
  for (let r = 0; r < t; r++) {
    const i = e[r];
    r & 1 ? e[r] = i === "%" ? ".*" : "." : e[r] = Hm(i);
  }
  return (e[0] || e[1] === ".") && e.unshift("^"), (e.at(-1) || e.at(-2) === ".") && e.push("$"), new RegExp(e.join(""));
}
function Hf(n) {
  const e = n.replaceAll(/\\./g, "##");
  if (e.indexOf("_") >= 0)
    return [3, n];
  let t = e.indexOf("%");
  if (t < 0)
    return [0, Ac(n)];
  if (e.lastIndexOf("%") === t) {
    if (t === 0)
      return [2, Ac(n.slice(1))];
    if (t === e.length - 1)
      return [1, Ac(n.slice(0, -1))];
  }
  return [3, n];
}
function v1(n) {
  const e = n.length;
  for (let t = 0; t < e; ++t)
    if (n.charCodeAt(t) > 127)
      return new TextEncoder().encode(n).length;
  return e;
}
function zg(n, e) {
  const t = n.length;
  for (let r = 0; r < t; ++r)
    if (!e.includes(n[r]))
      return n.slice(r);
  return "";
}
function Gg(n, e) {
  const t = n.length;
  for (let r = t - 1; r >= 0; --r)
    if (!e.includes(n[r]))
      return n.slice(0, r + 1);
  return "";
}
function g1(n, e) {
  return zg(Gg(n, e), e);
}
function qd(n) {
  return typeof n == "boolean";
}
function Md(n) {
  return typeof n == "number";
}
function Ud(n) {
  return typeof n == "string";
}
function $d(n) {
  return typeof n == "object" && !Array.isArray(n);
}
function kc(n) {
  return n != null;
}
function jd(n) {
  const e = typeof n;
  return e === "boolean" || e === "number" || e === "string";
}
function Kd(n) {
  return Array.isArray(n) ? n : [n];
}
function za(n) {
  if (typeof n != "object" || n === null)
    return n;
  if (Array.isArray(n)) {
    if (n.length === 1)
      return za(n[0]);
  } else {
    const e = Object.getOwnPropertyNames(n);
    if (e.length === 1)
      return za(n[e[0]]);
  }
  return null;
}
function zd(n) {
  return n ? typeof n != "object" ? !0 : Array.isArray(n) ? n.length > 0 : Object.getOwnPropertyNames(n).length > 0 : !1;
}
function Gd(n) {
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
function Hd(n) {
  return typeof n == "object" && !Array.isArray(n) ? n : {};
}
function Wd(n) {
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
function Yd(n) {
  return y1[Ga(n)];
}
const y1 = ["missing", "null", "boolean", "number", "string", "array", "object"];
function Ga(n) {
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
class yo {
  constructor(e, t) {
    this.sourceExpression = e, this.compiledArg = t;
  }
  /** Adds the current value of the compiledArg to my state. */
  accumulate() {
    this.add(this.compiledArg());
  }
}
class Wf extends yo {
  constructor() {
    super(...arguments);
    ve(this, "result", []);
  }
  clone() {
    return new Wf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = [];
  }
  add(t) {
    t !== void 0 && this.result.push(t);
  }
}
var Fi, Ls;
const fh = class fh extends yo {
  constructor() {
    super(...arguments);
    ee(this, Fi, 0);
    ee(this, Ls, 0);
  }
  clone() {
    return new fh(this.sourceExpression, this.compiledArg);
  }
  reset() {
    G(this, Fi, G(this, Ls, 0));
  }
  add(t) {
    typeof t == "number" && (G(this, Fi, p(this, Fi) + 1), G(this, Ls, p(this, Ls) + t));
  }
  get result() {
    return p(this, Fi) ? p(this, Ls) / p(this, Fi) : null;
  }
};
Fi = new WeakMap(), Ls = new WeakMap();
let rf = fh;
class Yf extends yo {
  constructor() {
    super(...arguments);
    ve(this, "result", 0);
  }
  clone() {
    return new Yf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = 0;
  }
  add(t) {
    this.result++;
  }
}
class Vf extends yo {
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
    t != null && (this.result === null || Yt(t, this.result) > 0) && (this.result = t);
  }
}
class Jf extends yo {
  constructor() {
    super(...arguments);
    ve(this, "result", null);
  }
  clone() {
    return new Jf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = null;
  }
  add(t) {
    t != null && (this.result === null || Yt(t, this.result) < 0) && (this.result = t);
  }
}
class Zf extends yo {
  constructor() {
    super(...arguments);
    ve(this, "result", 0);
  }
  clone() {
    return new Zf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = 0;
  }
  add(t) {
    typeof t == "number" && (this.result += t);
  }
}
function m1(n) {
  Vd(n);
  for (let e of n.FROM)
    Vd(e);
  n.WHAT = n.WHAT.map((e) => typeof e == "string" ? ["." + e] : e), Hg(n, (e, t) => {
    const r = e[0];
    return (r === "." || r === "$" || r === "?") && e.length > 1 ? (t.splice(1, 0, ...e.substring(1).split(".")), t[0] = e[0]) : t[0] = e.toUpperCase(), !0;
  });
}
function I1(n, e, t) {
  Hg(n, (r, i) => {
    if (r === ".") {
      const o = i[1];
      if (o === void 0 || !e.has(o)) {
        if (t === void 0)
          throw Error(`property path ${i.slice(1).join(".")} does not start with an alias`);
        i.splice(1, 0, t);
      }
    } else if (r === "META()" && (i.length < 2 || i[1] === null)) {
      if (t === void 0)
        throw Error("ambiguous META() needs a collection name as argument");
      i[1] = t;
    }
    return !0;
  });
}
function Vd(n) {
  for (const e of Object.getOwnPropertyNames(n)) {
    const t = e.toUpperCase();
    if (t !== e) {
      if (t in n) throw Error(`Conflicting keys "${e}" and "${t}"`);
      n[t] = n[e], delete n[e];
    }
  }
}
function Hg(n, e) {
  function t(r) {
    r !== void 0 && Qf(r, e);
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
function Qf(n, e) {
  return t(n);
  function t(r) {
    if (ia(r))
      return !0;
    if (Array.isArray(r)) {
      const i = r[0];
      if (!e(i, r))
        return !1;
      if (i !== "." && i !== "META()") {
        const o = r.length;
        for (let u = 1; u < o; ++u)
          if (!t(r[u]))
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
function Oc(n) {
  let e = /* @__PURE__ */ new Set();
  return Qf(n, (t, r) => ((t === "." || t === "META()") && e.add(r[1]), !0)), e;
}
function Jd(n) {
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
function xi(n, e) {
  if (!n)
    throw new Error(e || "Assertion failed");
}
function nf(n, e, t) {
  let r;
  Object.defineProperty(n, e, {
    get() {
      return r || (r = t.call(this)), r;
    }
  });
}
function b1(n) {
  return n && Object.assign({}, n);
}
function Wg(n, e) {
  const t = [];
  for (; e-- > 0; )
    t.push(n());
  return t;
}
function Yg(n, e) {
  return new Array(e + 1).join(n);
}
function lu(n, e) {
  return Wg(() => n, e);
}
function sf(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const r = n[t];
    n.lastIndexOf(r) !== t && e.indexOf(r) < 0 && e.push(r);
  }
  return e;
}
function Vg(n) {
  const e = [];
  return n.forEach((t) => {
    e.indexOf(t) < 0 && e.push(t);
  }), e;
}
function ds(n) {
  const e = n[0];
  return e === e.toUpperCase();
}
function Jg(n) {
  return !ds(n);
}
function Zg(n, e, t) {
  const r = t || " ";
  return n.length < e ? Yg(r, e - n.length) + n : n;
}
function Is() {
  this.strings = [];
}
Is.prototype.append = function(n) {
  this.strings.push(n);
};
Is.prototype.contents = function() {
  return this.strings.join("");
};
const Rc = (n) => String.fromCodePoint(parseInt(n, 16));
function Qg(n) {
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
        return Rc(n.slice(2, 4));
      case "u":
        return n.charAt(2) === "{" ? Rc(n.slice(3, -1)) : Rc(n.slice(2, 6));
      default:
        return n.charAt(1);
    }
  else
    return n;
}
function Xg(n) {
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
function e0(n, e = "unexpected null value") {
  if (n == null)
    throw new Error(e);
  return n;
}
const _1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StringBuffer: Is,
  abstract: br,
  assert: xi,
  checkNotNull: e0,
  clone: b1,
  copyWithoutDuplicates: Vg,
  defineLazyProperty: nf,
  getDuplicates: sf,
  isLexical: Jg,
  isSyntactic: ds,
  padLeft: Zg,
  repeat: lu,
  repeatFn: Wg,
  repeatStr: Yg,
  unescapeCodePoint: Qg,
  unexpectedObjToString: Xg
}, Symbol.toStringTag, { value: "Module" })), w1 = {
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
const or = Object.create(Ge.prototype), ar = Object.create(Ge.prototype);
class Zt extends Ge {
  constructor(e) {
    super(), this.obj = e;
  }
}
class ur extends Ge {
  constructor(e, t) {
    super(), this.from = e, this.to = t, this.matchCodePoint = e.length > 1 || t.length > 1;
  }
}
class lr extends Ge {
  constructor(e) {
    super(), this.index = e;
  }
}
class Ut extends Ge {
  constructor(e) {
    super(), this.terms = e;
  }
}
class cu extends Ut {
  constructor(e, t, r) {
    const i = e.rules[t].body;
    super([r, i]), this.superGrammar = e, this.name = t, this.body = r;
  }
}
class fu extends Ut {
  constructor(e, t, r, i) {
    const o = e.rules[t].body;
    super([...r, o, ...i]), this.superGrammar = e, this.ruleName = t, this.expansionPos = r.length;
  }
}
class Ht extends Ge {
  constructor(e) {
    super(), this.factors = e;
  }
}
class _r extends Ge {
  constructor(e) {
    super(), this.expr = e;
  }
}
class bs extends _r {
}
class mo extends _r {
}
class qn extends _r {
}
bs.prototype.operator = "*";
mo.prototype.operator = "+";
qn.prototype.operator = "?";
bs.prototype.minNumMatches = 0;
mo.prototype.minNumMatches = 1;
qn.prototype.minNumMatches = 0;
bs.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
mo.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
qn.prototype.maxNumMatches = 1;
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
    return ds(this.ruleName);
  }
  // This method just caches the result of `this.toString()` in a non-enumerable property.
  toMemoKey() {
    return this._memoKey || Object.defineProperty(this, "_memoKey", { value: this.toString() }), this._memoKey;
  }
}
class Jt extends Ge {
  constructor(e) {
    super(), this.category = e, this.pattern = w1[e];
  }
}
function Nt(n, e) {
  let t;
  return e ? (t = new Error(e.getLineAndColumnMessage() + n), t.shortMessage = n, t.interval = e) : t = new Error(n), t;
}
function of() {
  return Nt("Interval sources don't match");
}
function x1(n, e, t) {
  const r = e ? `Grammar ${n} is not declared in namespace '${e}'` : "Undeclared grammar " + n;
  return Nt(r, t);
}
function E1(n, e) {
  return Nt("Grammar " + n.name + " is already declared in this namespace");
}
function S1(n) {
  return Nt(`Grammar '${n.name}' does not support incremental parsing`);
}
function t0(n, e, t) {
  return Nt(
    "Rule " + n + " is not declared in grammar " + e,
    t
  );
}
function A1(n, e, t) {
  return Nt(
    "Cannot override rule " + n + " because it is not declared in " + e,
    t
  );
}
function k1(n, e, t) {
  return Nt(
    "Cannot extend rule " + n + " because it is not declared in " + e,
    t
  );
}
function Zd(n, e, t, r) {
  let i = "Duplicate declaration for rule '" + n + "' in grammar '" + e + "'";
  return e !== t && (i += " (originally declared in '" + t + "')"), Nt(i, r);
}
function r0(n, e, t, r) {
  return Nt(
    "Wrong number of parameters for rule " + n + " (expected " + e + ", got " + t + ")",
    r
  );
}
function O1(n, e, t, r) {
  return Nt(
    "Wrong number of arguments for rule " + n + " (expected " + e + ", got " + t + ")",
    r
  );
}
function Qd(n, e, t) {
  return Nt(
    "Duplicate parameter names in rule " + n + ": " + e.join(", "),
    t
  );
}
function R1(n, e) {
  return Nt(
    "Invalid parameter to rule " + n + ": " + e + " has arity " + e.getArity() + ", but parameter expressions must have arity 1",
    e.source
  );
}
const T1 = "NOTE: A _syntactic rule_ is a rule whose name begins with a capital letter. See https://ohmjs.org/d/svl for more details.";
function C1(n, e) {
  return Nt(
    "Cannot apply syntactic rule " + n + " from here (inside a lexical context)",
    e.source
  );
}
function N1(n) {
  const { ruleName: e } = n;
  return Nt(
    `applySyntactic is for syntactic rules, but '${e}' is a lexical rule. ` + T1,
    n.source
  );
}
function P1(n) {
  return Nt(
    "applySyntactic is not required here (in a syntactic context)",
    n.source
  );
}
function Xd(n, e) {
  return Nt("Incorrect argument type: expected " + n, e.source);
}
function D1(n) {
  return Nt("'...' can appear at most once in a rule body", n.source);
}
function B1(n) {
  const e = n._node;
  xi(e && e.isNonterminal() && e.ctorName === "escapeChar_unicodeCodePoint");
  const t = n.children.slice(1, -1).map((i) => i.source), r = t[0].coverageWith(...t.slice(1));
  return Nt(
    `U+${r.contents} is not a valid Unicode code point`,
    r
  );
}
function n0(n, e) {
  const t = e.length > 0 ? e[e.length - 1].args : [];
  let i = "Nullable expression " + n.expr.substituteParams(t) + " is not allowed inside '" + n.operator + "' (possible infinite loop)";
  if (e.length > 0) {
    const o = e.map((u) => new mt(u.ruleName, u.args)).join(`
`);
    i += `
Application stack (most recent application last):
` + o;
  }
  return Nt(i, n.expr.source);
}
function i0(n, e, t, r) {
  return Nt(
    "Rule " + n + " involves an alternation which has inconsistent arity (expected " + e + ", got " + t + ")",
    r.source
  );
}
function F1(n) {
  const e = n.map((t) => t.message);
  return Nt(["Errors:"].concat(e).join(`
- `), n[0].interval);
}
function L1(n, e, t, r) {
  let i = r.slice(0, -1).map((c) => {
    const I = "  " + c[0].name + " > " + c[1];
    return c.length === 3 ? I + " for '" + c[2] + "'" : I;
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
  const u = [
    `Missing semantic action for '${n}' in ${t} '${e}'.${o}`,
    "Action stack (most recent call last):",
    i
  ].join(`
`), l = Nt(u);
  return l.name = "missingSemanticAction", l;
}
function q1(n) {
  if (n.length === 1)
    throw n[0];
  if (n.length > 1)
    throw F1(n);
}
function M1(n) {
  let e = 0;
  return n.map((r) => {
    const i = r.toString();
    return e = Math.max(e, i.length), i;
  }).map((r) => Zg(r, e));
}
function ev(n, e, t) {
  const r = n.length, i = n.slice(0, t), o = n.slice(t + e.length);
  return (i + e + o).substr(0, r);
}
function U1(...n) {
  const e = this, { offset: t } = e, { repeatStr: r } = _1, i = new Is();
  i.append("Line " + e.lineNum + ", col " + e.colNum + `:
`);
  const o = M1([
    e.prevLine == null ? 0 : e.lineNum - 1,
    e.lineNum,
    e.nextLine == null ? 0 : e.lineNum + 1
  ]), u = (y, _, x) => {
    i.append(x + o[y] + " | " + _ + `
`);
  };
  e.prevLine != null && u(0, e.prevLine, "  "), u(1, e.line, "> ");
  const l = e.line.length;
  let c = r(" ", l + 1);
  for (let y = 0; y < n.length; ++y) {
    let _ = n[y][0], x = n[y][1];
    xi(_ >= 0 && _ <= x, "range start must be >= 0 and <= end");
    const k = t - e.colNum + 1;
    _ = Math.max(0, _ - k), x = Math.min(x - k, l), c = ev(c, r("~", x - _), _);
  }
  const I = 2 + o[1].length + 3;
  return i.append(r(" ", I)), c = ev(c, "^", e.colNum - 1), i.append(c.replace(/ +$/, "") + `
`), e.nextLine != null && u(2, e.nextLine, "  "), i.contents();
}
let af = [];
function s0(n) {
  af.push(n);
}
function $1(n) {
  af.forEach((e) => {
    e(n);
  }), af = null;
}
function Xf(n, e) {
  let t = 1, r = 1, i = 0, o = 0, u = null, l = null, c = -1;
  for (; i < e; ) {
    const _ = n.charAt(i++);
    _ === `
` ? (t++, r = 1, c = o, o = i) : _ !== "\r" && r++;
  }
  let I = n.indexOf(`
`, o);
  if (I === -1)
    I = n.length;
  else {
    const _ = n.indexOf(`
`, I + 1);
    u = _ === -1 ? n.slice(I) : n.slice(I, _), u = u.replace(/^\r?\n/, "").replace(/\r$/, "");
  }
  c >= 0 && (l = n.slice(c, o).replace(/\r?\n$/, ""));
  const y = n.slice(o, I).replace(/\r$/, "");
  return {
    offset: e,
    lineNum: t,
    colNum: r,
    line: y,
    prevLine: l,
    nextLine: u,
    toString: U1
  };
}
function o0(n, e, ...t) {
  return Xf(n, e).toString(...t);
}
const tv = /* @__PURE__ */ (() => {
  let n = 0;
  return (e) => "" + e + n++;
})();
class ir {
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
    return ir.coverage(...e, this);
  }
  collapsedLeft() {
    return new ir(this.sourceString, this.startIdx, this.startIdx);
  }
  collapsedRight() {
    return new ir(this.sourceString, this.endIdx, this.endIdx);
  }
  getLineAndColumn() {
    return Xf(this.sourceString, this.startIdx);
  }
  getLineAndColumnMessage() {
    const e = [this.startIdx, this.endIdx];
    return o0(this.sourceString, this.startIdx, e);
  }
  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus(e) {
    if (this.sourceString !== e.sourceString)
      throw of();
    return this.startIdx === e.startIdx && this.endIdx === e.endIdx ? [] : this.startIdx < e.startIdx && e.endIdx < this.endIdx ? [
      new ir(this.sourceString, this.startIdx, e.startIdx),
      new ir(this.sourceString, e.endIdx, this.endIdx)
    ] : this.startIdx < e.endIdx && e.endIdx < this.endIdx ? [new ir(this.sourceString, e.endIdx, this.endIdx)] : this.startIdx < e.startIdx && e.startIdx < this.endIdx ? [new ir(this.sourceString, this.startIdx, e.startIdx)] : [this];
  }
  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo(e) {
    if (this.sourceString !== e.sourceString)
      throw of();
    return xi(
      this.startIdx >= e.startIdx && this.endIdx <= e.endIdx,
      "other interval does not cover this one"
    ), new ir(
      this.sourceString,
      this.startIdx - e.startIdx,
      this.endIdx - e.startIdx
    );
  }
  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends.
  trimmed() {
    const { contents: e } = this, t = this.startIdx + e.match(/^\s*/)[0].length, r = this.endIdx - e.match(/\s*$/)[0].length;
    return new ir(this.sourceString, t, r);
  }
  subInterval(e, t) {
    const r = this.startIdx + e;
    return new ir(this.sourceString, r, r + t);
  }
}
ir.coverage = function(n, ...e) {
  let { startIdx: t, endIdx: r } = n;
  for (const i of e) {
    if (i.sourceString !== n.sourceString)
      throw of();
    t = Math.min(t, i.startIdx), r = Math.max(r, i.endIdx);
  }
  return new ir(n.sourceString, t, r);
};
const j1 = 65535;
class hu {
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
    return e > j1 && (this.pos += 1), this.examinedLength = Math.max(this.examinedLength, this.pos), e;
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
    return new ir(this.source, e, t || this.pos);
  }
}
class a0 {
  constructor(e, t, r, i, o, u, l) {
    this.matcher = e, this.input = t, this.startExpr = r, this._cst = i, this._cstOffset = o, this._rightmostFailurePosition = u, this._rightmostFailures = l, this.failed() && (nf(this, "message", function() {
      const c = "Expected " + this.getExpectedText();
      return o0(this.input, this.getRightmostFailurePosition()) + c;
    }), nf(this, "shortMessage", function() {
      const c = "expected " + this.getExpectedText(), I = Xf(
        this.input,
        this.getRightmostFailurePosition()
      );
      return "Line " + I.lineNum + ", col " + I.colNum + ": " + c;
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
    const e = new Is();
    let t = this.getRightmostFailures();
    t = t.filter((r) => !r.isFluffy());
    for (let r = 0; r < t.length; r++)
      r > 0 && (r === t.length - 1 ? e.append(t.length > 2 ? ", or " : " or ") : e.append(", ")), e.append(t[r].toString());
    return e.contents();
  }
  getInterval() {
    const e = this.getRightmostFailurePosition();
    return new ir(this.input, e, e);
  }
}
class K1 {
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
    t.isInvolved = function(u) {
      return o.indexOf(u) >= 0;
    }, t.updateInvolvedApplicationMemoKeys = function() {
      for (let u = i; u < r.length; u++) {
        const l = r[u];
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
const z1 = "✗", G1 = "✓", H1 = "⋅", W1 = "⇒", Y1 = "␉", V1 = "␊", J1 = "␍", uf = {
  succeeded: 1,
  isRootNode: 2,
  isImplicitSpaces: 4,
  isMemoized: 8,
  isHeadOfLeftRecursion: 16,
  terminatesLR: 32
};
function Z1(n) {
  return lu(" ", n).join("");
}
function Q1(n, e, t) {
  const r = u0(n.slice(e, e + t));
  return r.length < t ? r + lu(" ", t - r.length).join("") : r;
}
function u0(n) {
  return typeof n == "string" ? n.replace(/ /g, H1).replace(/\t/g, Y1).replace(/\n/g, V1).replace(/\r/g, J1) : String(n);
}
class mi {
  constructor(e, t, r, i, o, u, l) {
    this.input = e, this.pos = this.pos1 = t, this.pos2 = r, this.source = new ir(e, t, r), this.expr = i, this.bindings = u, this.children = l || [], this.terminatingLREntry = null, this._flags = o ? uf.succeeded : 0;
  }
  get displayString() {
    return this.expr.toDisplayString();
  }
  clone() {
    return this.cloneWithExpr(this.expr);
  }
  cloneWithExpr(e) {
    const t = new mi(
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
    this.terminatingLREntry = new mi(
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
    function i(o, u, l) {
      let c = !0;
      r.enter && r.enter.call(t, o, u, l) === mi.prototype.SKIP && (c = !1), c && (o.children.forEach((I) => {
        i(I, o, l + 1);
      }), r.exit && r.exit.call(t, o, u, l));
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
    const e = new Is();
    return this.walk((t, r, i) => {
      if (!t)
        return this.SKIP;
      if (t.expr.constructor.name !== "Alt") {
        if (e.append(Q1(t.input, t.pos, 10) + Z1(i * 2 + 1)), e.append((t.succeeded ? G1 : z1) + " " + t.displayString), t.isHeadOfLeftRecursion && e.append(" (LR)"), t.succeeded) {
          const u = u0(t.source.contents);
          e.append(" " + W1 + "  "), e.append(typeof u == "string" ? '"' + u + '"' : u);
        }
        e.append(`
`);
      }
    }), e.contents();
  }
}
mi.prototype.SKIP = {};
Object.keys(uf).forEach((n) => {
  const e = uf[n];
  Object.defineProperty(mi.prototype, n, {
    get() {
      return (this._flags & e) !== 0;
    },
    set(t) {
      t ? this._flags |= e : this._flags &= ~e;
    }
  });
});
Ge.prototype.allowsSkippingPrecedingSpace = br("allowsSkippingPrecedingSpace");
or.allowsSkippingPrecedingSpace = ar.allowsSkippingPrecedingSpace = mt.prototype.allowsSkippingPrecedingSpace = Zt.prototype.allowsSkippingPrecedingSpace = ur.prototype.allowsSkippingPrecedingSpace = Jt.prototype.allowsSkippingPrecedingSpace = function() {
  return !0;
};
Ut.prototype.allowsSkippingPrecedingSpace = _r.prototype.allowsSkippingPrecedingSpace = kr.prototype.allowsSkippingPrecedingSpace = xr.prototype.allowsSkippingPrecedingSpace = wr.prototype.allowsSkippingPrecedingSpace = lr.prototype.allowsSkippingPrecedingSpace = Ht.prototype.allowsSkippingPrecedingSpace = function() {
  return !1;
};
let Co;
s0((n) => {
  Co = n;
});
let Ha;
Ge.prototype.assertAllApplicationsAreValid = function(n, e) {
  Ha = 0, this._assertAllApplicationsAreValid(n, e);
};
Ge.prototype._assertAllApplicationsAreValid = br(
  "_assertAllApplicationsAreValid"
);
or._assertAllApplicationsAreValid = ar._assertAllApplicationsAreValid = Zt.prototype._assertAllApplicationsAreValid = ur.prototype._assertAllApplicationsAreValid = lr.prototype._assertAllApplicationsAreValid = Jt.prototype._assertAllApplicationsAreValid = function(n, e) {
};
kr.prototype._assertAllApplicationsAreValid = function(n, e) {
  Ha++, this.expr._assertAllApplicationsAreValid(n, e), Ha--;
};
Ut.prototype._assertAllApplicationsAreValid = function(n, e) {
  for (let t = 0; t < this.terms.length; t++)
    this.terms[t]._assertAllApplicationsAreValid(n, e);
};
Ht.prototype._assertAllApplicationsAreValid = function(n, e) {
  for (let t = 0; t < this.factors.length; t++)
    this.factors[t]._assertAllApplicationsAreValid(n, e);
};
_r.prototype._assertAllApplicationsAreValid = wr.prototype._assertAllApplicationsAreValid = xr.prototype._assertAllApplicationsAreValid = function(n, e) {
  this.expr._assertAllApplicationsAreValid(n, e);
};
mt.prototype._assertAllApplicationsAreValid = function(n, e, t = !1) {
  const r = e.rules[this.ruleName], i = ds(n) && Ha === 0;
  if (!r)
    throw t0(this.ruleName, e.name, this.source);
  if (!t && ds(this.ruleName) && !i)
    throw C1(this.ruleName, this);
  const o = this.args.length, u = r.formals.length;
  if (o !== u)
    throw O1(this.ruleName, u, o, this.source);
  const l = Co && r === Co.rules.applySyntactic;
  if (Co && r === Co.rules.caseInsensitive && !(this.args[0] instanceof Zt))
    throw Xd('a Terminal (e.g. "abc")', this.args[0]);
  if (l) {
    const I = this.args[0];
    if (!(I instanceof mt))
      throw Xd("a syntactic rule application", I);
    if (!ds(I.ruleName))
      throw N1(I);
    if (i)
      throw P1(this);
  }
  this.args.forEach((I) => {
    if (I._assertAllApplicationsAreValid(n, e, l), I.getArity() !== 1)
      throw R1(this.ruleName, I);
  });
};
Ge.prototype.assertChoicesHaveUniformArity = br(
  "assertChoicesHaveUniformArity"
);
or.assertChoicesHaveUniformArity = ar.assertChoicesHaveUniformArity = Zt.prototype.assertChoicesHaveUniformArity = ur.prototype.assertChoicesHaveUniformArity = lr.prototype.assertChoicesHaveUniformArity = kr.prototype.assertChoicesHaveUniformArity = Jt.prototype.assertChoicesHaveUniformArity = function(n) {
};
Ut.prototype.assertChoicesHaveUniformArity = function(n) {
  if (this.terms.length === 0)
    return;
  const e = this.terms[0].getArity();
  for (let t = 0; t < this.terms.length; t++) {
    const r = this.terms[t];
    r.assertChoicesHaveUniformArity();
    const i = r.getArity();
    if (e !== i)
      throw i0(n, e, i, r);
  }
};
cu.prototype.assertChoicesHaveUniformArity = function(n) {
  const e = this.terms[0].getArity(), t = this.terms[1].getArity();
  if (e !== t)
    throw i0(n, t, e, this.terms[0]);
};
Ht.prototype.assertChoicesHaveUniformArity = function(n) {
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
or.assertIteratedExprsAreNotNullable = ar.assertIteratedExprsAreNotNullable = Zt.prototype.assertIteratedExprsAreNotNullable = ur.prototype.assertIteratedExprsAreNotNullable = lr.prototype.assertIteratedExprsAreNotNullable = Jt.prototype.assertIteratedExprsAreNotNullable = function(n) {
};
Ut.prototype.assertIteratedExprsAreNotNullable = function(n) {
  for (let e = 0; e < this.terms.length; e++)
    this.terms[e].assertIteratedExprsAreNotNullable(n);
};
Ht.prototype.assertIteratedExprsAreNotNullable = function(n) {
  for (let e = 0; e < this.factors.length; e++)
    this.factors[e].assertIteratedExprsAreNotNullable(n);
};
_r.prototype.assertIteratedExprsAreNotNullable = function(n) {
  if (this.expr.assertIteratedExprsAreNotNullable(n), this.expr.isNullable(n))
    throw n0(this, []);
};
qn.prototype.assertIteratedExprsAreNotNullable = wr.prototype.assertIteratedExprsAreNotNullable = xr.prototype.assertIteratedExprsAreNotNullable = kr.prototype.assertIteratedExprsAreNotNullable = function(n) {
  this.expr.assertIteratedExprsAreNotNullable(n);
};
mt.prototype.assertIteratedExprsAreNotNullable = function(n) {
  this.args.forEach((e) => {
    e.assertIteratedExprsAreNotNullable(n);
  });
};
class eh {
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
class _s extends eh {
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
class X1 extends eh {
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
    return Jg(this.ctorName);
  }
  isSyntactic() {
    return ds(this.ctorName);
  }
}
class l0 extends eh {
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
or.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = e.nextCodePoint();
  return r !== void 0 ? (n.pushBinding(new _s(String.fromCodePoint(r).length), t), !0) : (n.processFailure(t, this), !1);
};
ar.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return e.atEnd() ? (n.pushBinding(new _s(0), t), !0) : (n.processFailure(t, this), !1);
};
Zt.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return e.matchString(this.obj) ? (n.pushBinding(new _s(this.obj.length), t), !0) : (n.processFailure(t, this), !1);
};
ur.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = this.matchCodePoint ? e.nextCodePoint() : e.nextCharCode();
  return r !== void 0 && this.from.codePointAt(0) <= r && r <= this.to.codePointAt(0) ? (n.pushBinding(new _s(String.fromCodePoint(r).length), t), !0) : (n.processFailure(t, this), !1);
};
lr.prototype.eval = function(n) {
  return n.eval(n.currentApplication().args[this.index]);
};
kr.prototype.eval = function(n) {
  n.enterLexifiedContext();
  const e = n.eval(this.expr);
  return n.exitLexifiedContext(), e;
};
Ut.prototype.eval = function(n) {
  for (let e = 0; e < this.terms.length; e++)
    if (n.eval(this.terms[e]))
      return !0;
  return !1;
};
Ht.prototype.eval = function(n) {
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
  let u = 0, l = t, c;
  for (; u < this.maxNumMatches && n.eval(this.expr); ) {
    if (e.pos === l)
      throw n0(this, n._applicationStack);
    l = e.pos, u++;
    const x = n._bindings.splice(n._bindings.length - r, r), k = n._bindingOffsets.splice(
      n._bindingOffsets.length - r,
      r
    );
    for (c = 0; c < x.length; c++)
      i[c].push(x[c]), o[c].push(k[c]);
  }
  if (u < this.minNumMatches)
    return !1;
  let I = n.posToOffset(t), y = 0;
  if (u > 0) {
    const x = i[r - 1], k = o[r - 1], D = k[k.length - 1] + x[x.length - 1].matchLength;
    I = o[0][0], y = D - I;
  }
  const _ = this instanceof qn;
  for (c = 0; c < i.length; c++)
    n._bindings.push(
      new l0(i[c], o[c], y, _)
    ), n._bindingOffsets.push(I);
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
  const o = r.toMemoKey(), u = i.memo[o];
  if (u && i.shouldUseMemoizedResult(u)) {
    if (n.hasNecessaryInfo(u))
      return n.useMemoizedResult(n.inputStream.pos, u);
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
  const { inputStream: e } = n, t = e.pos, r = n.getCurrentPosInfo(), i = n.grammar.rules[this.ruleName], { body: o } = i, { description: u } = i;
  n.enterApplication(r, this), u && n.pushFailuresInfo();
  const l = e.examinedLength;
  e.examinedLength = 0;
  let c = this.evalOnce(o, n);
  const I = r.currentLeftRecursion, y = this.toMemoKey(), _ = I && I.headApplication.toMemoKey() === y;
  let x;
  n.doNotMemoize ? n.doNotMemoize = !1 : _ ? (c = this.growSeedResult(o, n, t, I, c), r.endLeftRecursion(), x = I, x.examinedLength = e.examinedLength - t, x.rightmostFailureOffset = n._getRightmostFailureOffset(), r.memoize(y, x)) : (!I || !I.isInvolved(y)) && (x = r.memoize(y, {
    matchLength: e.pos - t,
    examinedLength: e.examinedLength - t,
    value: c,
    failuresAtRightmostPosition: n.cloneRecordedFailures(),
    rightmostFailureOffset: n._getRightmostFailureOffset()
  }));
  const k = !!c;
  if (u && (n.popFailuresInfo(), k || n.processFailure(t, this), x && (x.failuresAtRightmostPosition = n.cloneRecordedFailures())), n.isTracing() && x) {
    const D = n.getTraceEntry(t, this, k, k ? [c] : []);
    _ && (xi(D.terminatingLREntry != null || !k), D.isHeadOfLeftRecursion = !0), x.traceEntry = D;
  }
  return e.examinedLength = Math.max(
    e.examinedLength,
    l
  ), n.exitApplication(r, c), k;
};
mt.prototype.evalOnce = function(n, e) {
  const { inputStream: t } = e, r = t.pos;
  if (e.eval(n)) {
    const i = n.getArity(), o = e._bindings.splice(e._bindings.length - i, i), u = e._bindingOffsets.splice(e._bindingOffsets.length - i, i), l = t.pos - r;
    return new X1(this.ruleName, o, u, l);
  } else
    return !1;
};
mt.prototype.growSeedResult = function(n, e, t, r, i) {
  if (!i)
    return !1;
  const { inputStream: o } = e;
  for (; ; ) {
    if (r.matchLength = o.pos - t, r.value = i, r.failuresAtRightmostPosition = e.cloneRecordedFailures(), e.isTracing()) {
      const u = e.trace[e.trace.length - 1];
      r.traceEntry = new mi(
        e.input,
        t,
        o.pos,
        this,
        !0,
        [i],
        [u.clone()]
      );
    }
    if (o.pos = t, i = this.evalOnce(n, e), o.pos - t <= r.matchLength)
      break;
    e.isTracing() && e.trace.splice(-2, 1);
  }
  return e.isTracing() && r.traceEntry.recordLRTermination(e.trace.pop(), i), o.pos = t + r.matchLength, r.value;
};
Jt.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = e.next();
  return r && this.pattern.test(r) ? (n.pushBinding(new _s(r.length), t), !0) : (n.processFailure(t, this), !1);
};
Ge.prototype.getArity = br("getArity");
or.getArity = ar.getArity = Zt.prototype.getArity = ur.prototype.getArity = lr.prototype.getArity = mt.prototype.getArity = Jt.prototype.getArity = function() {
  return 1;
};
Ut.prototype.getArity = function() {
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};
Ht.prototype.getArity = function() {
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
function rn(n, e) {
  const t = {};
  if (n.source && e) {
    const r = n.source.relativeTo(e);
    t.sourceInterval = [r.startIdx, r.endIdx];
  }
  return t;
}
Ge.prototype.outputRecipe = br("outputRecipe");
or.outputRecipe = function(n, e) {
  return ["any", rn(this, e)];
};
ar.outputRecipe = function(n, e) {
  return ["end", rn(this, e)];
};
Zt.prototype.outputRecipe = function(n, e) {
  return ["terminal", rn(this, e), this.obj];
};
ur.prototype.outputRecipe = function(n, e) {
  return ["range", rn(this, e), this.from, this.to];
};
lr.prototype.outputRecipe = function(n, e) {
  return ["param", rn(this, e), this.index];
};
Ut.prototype.outputRecipe = function(n, e) {
  return ["alt", rn(this, e)].concat(
    this.terms.map((t) => t.outputRecipe(n, e))
  );
};
cu.prototype.outputRecipe = function(n, e) {
  return this.terms[0].outputRecipe(n, e);
};
fu.prototype.outputRecipe = function(n, e) {
  const t = this.terms.slice(0, this.expansionPos), r = this.terms.slice(this.expansionPos + 1);
  return [
    "splice",
    rn(this, e),
    t.map((i) => i.outputRecipe(n, e)),
    r.map((i) => i.outputRecipe(n, e))
  ];
};
Ht.prototype.outputRecipe = function(n, e) {
  return ["seq", rn(this, e)].concat(
    this.factors.map((t) => t.outputRecipe(n, e))
  );
};
bs.prototype.outputRecipe = mo.prototype.outputRecipe = qn.prototype.outputRecipe = wr.prototype.outputRecipe = xr.prototype.outputRecipe = kr.prototype.outputRecipe = function(n, e) {
  return [
    this.constructor.name.toLowerCase(),
    rn(this, e),
    this.expr.outputRecipe(n, e)
  ];
};
mt.prototype.outputRecipe = function(n, e) {
  return [
    "app",
    rn(this, e),
    this.ruleName,
    this.args.map((t) => t.outputRecipe(n, e))
  ];
};
Jt.prototype.outputRecipe = function(n, e) {
  return ["unicodeChar", rn(this, e), this.category];
};
Ge.prototype.introduceParams = br("introduceParams");
or.introduceParams = ar.introduceParams = Zt.prototype.introduceParams = ur.prototype.introduceParams = lr.prototype.introduceParams = Jt.prototype.introduceParams = function(n) {
  return this;
};
Ut.prototype.introduceParams = function(n) {
  return this.terms.forEach((e, t, r) => {
    r[t] = e.introduceParams(n);
  }), this;
};
Ht.prototype.introduceParams = function(n) {
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
    return new lr(e).withSource(this.source);
  } else
    return this.args.forEach((t, r, i) => {
      i[r] = t.introduceParams(n);
    }), this;
};
Ge.prototype.isNullable = function(n) {
  return this._isNullable(n, /* @__PURE__ */ Object.create(null));
};
Ge.prototype._isNullable = br("_isNullable");
or._isNullable = ur.prototype._isNullable = lr.prototype._isNullable = mo.prototype._isNullable = Jt.prototype._isNullable = function(n, e) {
  return !1;
};
ar._isNullable = function(n, e) {
  return !0;
};
Zt.prototype._isNullable = function(n, e) {
  return typeof this.obj == "string" ? this.obj === "" : !1;
};
Ut.prototype._isNullable = function(n, e) {
  return this.terms.length === 0 || this.terms.some((t) => t._isNullable(n, e));
};
Ht.prototype._isNullable = function(n, e) {
  return this.factors.every((t) => t._isNullable(n, e));
};
bs.prototype._isNullable = qn.prototype._isNullable = wr.prototype._isNullable = xr.prototype._isNullable = function(n, e) {
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
or.substituteParams = ar.substituteParams = Zt.prototype.substituteParams = ur.prototype.substituteParams = Jt.prototype.substituteParams = function(n) {
  return this;
};
lr.prototype.substituteParams = function(n) {
  return e0(n[this.index]);
};
Ut.prototype.substituteParams = function(n) {
  return new Ut(this.terms.map((e) => e.substituteParams(n)));
};
Ht.prototype.substituteParams = function(n) {
  return new Ht(this.factors.map((e) => e.substituteParams(n)));
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
function rv(n) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(n);
}
function th(n) {
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
or.toArgumentNameList = function(n, e) {
  return ["any"];
};
ar.toArgumentNameList = function(n, e) {
  return ["end"];
};
Zt.prototype.toArgumentNameList = function(n, e) {
  return typeof this.obj == "string" && /^[_a-zA-Z0-9]+$/.test(this.obj) ? ["_" + this.obj] : ["$" + n];
};
ur.prototype.toArgumentNameList = function(n, e) {
  let t = this.from + "_to_" + this.to;
  return rv(t) || (t = "_" + t), rv(t) || (t = "$" + n), [t];
};
Ut.prototype.toArgumentNameList = function(n, e) {
  const t = this.terms.map(
    (o) => o.toArgumentNameList(n, !0)
  ), r = [], i = t[0].length;
  for (let o = 0; o < i; o++) {
    const u = [];
    for (let c = 0; c < this.terms.length; c++)
      u.push(t[c][o]);
    const l = Vg(u);
    r.push(l.join("_or_"));
  }
  return e || th(r), r;
};
Ht.prototype.toArgumentNameList = function(n, e) {
  let t = [];
  return this.factors.forEach((r) => {
    const i = r.toArgumentNameList(n, !0);
    t = t.concat(i), n += i.length;
  }), e || th(t), t;
};
_r.prototype.toArgumentNameList = function(n, e) {
  const t = this.expr.toArgumentNameList(n, e).map(
    (r) => r[r.length - 1] === "s" ? r + "es" : r + "s"
  );
  return e || th(t), t;
};
qn.prototype.toArgumentNameList = function(n, e) {
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
Jt.prototype.toArgumentNameList = function(n, e) {
  return ["$" + n];
};
lr.prototype.toArgumentNameList = function(n, e) {
  return ["param" + this.index];
};
Ge.prototype.toDisplayString = br("toDisplayString");
Ut.prototype.toDisplayString = Ht.prototype.toDisplayString = function() {
  return this.source ? this.source.trimmed().contents : "[" + this.constructor.name + "]";
};
or.toDisplayString = ar.toDisplayString = _r.prototype.toDisplayString = wr.prototype.toDisplayString = xr.prototype.toDisplayString = kr.prototype.toDisplayString = Zt.prototype.toDisplayString = ur.prototype.toDisplayString = lr.prototype.toDisplayString = function() {
  return this.toString();
};
mt.prototype.toDisplayString = function() {
  if (this.args.length > 0) {
    const n = this.args.map((e) => e.toDisplayString());
    return this.ruleName + "<" + n.join(",") + ">";
  } else
    return this.ruleName;
};
Jt.prototype.toDisplayString = function() {
  return "Unicode [" + this.category + "] character";
};
function eI(n) {
  return n === "description" || n === "string" || n === "code";
}
class Or {
  constructor(e, t, r) {
    if (!eI(r))
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
or.toFailure = function(n) {
  return new Or(this, "any object", "description");
};
ar.toFailure = function(n) {
  return new Or(this, "end of input", "description");
};
Zt.prototype.toFailure = function(n) {
  return new Or(this, this.obj, "string");
};
ur.prototype.toFailure = function(n) {
  return new Or(this, JSON.stringify(this.from) + ".." + JSON.stringify(this.to), "code");
};
wr.prototype.toFailure = function(n) {
  const e = this.expr === or ? "nothing" : "not " + this.expr.toFailure(n);
  return new Or(this, e, "description");
};
xr.prototype.toFailure = function(n) {
  return this.expr.toFailure(n);
};
mt.prototype.toFailure = function(n) {
  let { description: e } = n.rules[this.ruleName];
  return e || (e = (/^[aeiouAEIOU]/.test(this.ruleName) ? "an" : "a") + " " + this.ruleName), new Or(this, e, "description");
};
Jt.prototype.toFailure = function(n) {
  return new Or(this, "a Unicode [" + this.category + "] character", "description");
};
Ut.prototype.toFailure = function(n) {
  const t = "(" + this.terms.map((r) => r.toFailure(n)).join(" or ") + ")";
  return new Or(this, t, "description");
};
Ht.prototype.toFailure = function(n) {
  const t = "(" + this.factors.map((r) => r.toFailure(n)).join(" ") + ")";
  return new Or(this, t, "description");
};
_r.prototype.toFailure = function(n) {
  const e = "(" + this.expr.toFailure(n) + this.operator + ")";
  return new Or(this, e, "description");
};
Ge.prototype.toString = br("toString");
or.toString = function() {
  return "any";
};
ar.toString = function() {
  return "end";
};
Zt.prototype.toString = function() {
  return JSON.stringify(this.obj);
};
ur.prototype.toString = function() {
  return JSON.stringify(this.from) + ".." + JSON.stringify(this.to);
};
lr.prototype.toString = function() {
  return "$" + this.index;
};
kr.prototype.toString = function() {
  return "#(" + this.expr.toString() + ")";
};
Ut.prototype.toString = function() {
  return this.terms.length === 1 ? this.terms[0].toString() : "(" + this.terms.map((n) => n.toString()).join(" | ") + ")";
};
Ht.prototype.toString = function() {
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
Jt.prototype.toString = function() {
  return "\\p{" + this.category + "}";
};
class rh extends Ge {
  constructor(e) {
    super(), this.obj = e;
  }
  _getString(e) {
    const t = e.currentApplication().args[this.obj.index];
    return xi(t instanceof Zt, "expected a Terminal expression"), t.obj;
  }
  // Implementation of the PExpr API
  allowsSkippingPrecedingSpace() {
    return !0;
  }
  eval(e) {
    const { inputStream: t } = e, r = t.pos, i = this._getString(e);
    return t.matchString(i, !0) ? (e.pushBinding(new _s(i.length), r), !0) : (e.processFailure(r, this), !1);
  }
  getArity() {
    return 1;
  }
  substituteParams(e) {
    return new rh(this.obj.substituteParams(e));
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
let c0;
s0((n) => {
  c0 = n.rules.applySyntactic.body;
});
const Tc = new mt("spaces");
class tI {
  constructor(e, t, r) {
    this.matcher = e, this.startExpr = t, this.grammar = e.grammar, this.input = e.getInput(), this.inputStream = new hu(this.input), this.memoTable = e._memoTable, this.userData = void 0, this.doNotMemoize = !1, this._bindings = [], this._bindingOffsets = [], this._applicationStack = [], this._posStack = [0], this.inLexifiedContextStack = [!1], this.rightmostFailurePosition = -1, this._rightmostFailurePositionStack = [], this._recordedFailuresStack = [], r !== void 0 && (this.positionToRecordFailures = r, this.recordedFailures = /* @__PURE__ */ Object.create(null));
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
    return this.pushFailuresInfo(), this.eval(Tc), this.popBinding(), this.popFailuresInfo(), this.inputStream.pos;
  }
  skipSpacesIfInSyntacticContext() {
    return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
  }
  maybeSkipSpacesBefore(e) {
    return e.allowsSkippingPrecedingSpace() && e !== Tc ? this.skipSpacesIfInSyntacticContext() : this.inputStream.pos;
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
    return t || (t = this.memoTable[e] = new K1()), t;
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
      const o = this.currentApplication(), u = o ? o.args : [];
      t = t.substituteParams(u);
    }
    return this.getMemoizedTraceEntry(e, t) || new mi(this.input, e, this.inputStream.pos, t, r, i, this.trace);
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
    const u = t.pos, l = this.maybeSkipSpacesBefore(e);
    let c;
    this.trace && (c = this.trace, this.trace = []);
    const I = e.eval(this);
    if (this.trace) {
      const y = this._bindings.slice(r), _ = this.getTraceEntry(l, e, I, y);
      _.isImplicitSpaces = e === Tc, _.isRootNode = e === this.startExpr, c.push(_), this.trace = c;
    }
    return I ? this.recordedFailures && t.pos === this.positionToRecordFailures && Object.keys(this.recordedFailures).forEach((y) => {
      this.recordedFailures[y].makeFluffy();
    }) : (t.pos = u, this.truncateBindings(r), this.userData = i), this.recordedFailures && this.recordFailures(o, !1), e === c0 && this.skipSpaces(), I;
  }
  getMatchResult() {
    this.grammar._setUpMatchState(this), this.eval(this.startExpr);
    let e;
    this.recordedFailures && (e = Object.keys(this.recordedFailures).map(
      (r) => this.recordedFailures[r]
    ));
    const t = this._bindings[0];
    return t && (t.grammar = this.grammar), new a0(
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
class rI {
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
    const u = o.slice(t);
    o.length = e;
    for (let l = 0; l < r.length; l++)
      o.push(void 0);
    for (const l of u)
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
      throw S1(this.grammar);
    const i = new tI(this, e, r.positionToRecordFailures);
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
    return new Ht([r, ar]);
  }
}
const No = [], lf = (n, e) => Object.prototype.hasOwnProperty.call(n, e);
class nv {
  constructor(e, t, r) {
    this._node = e, this.source = t, this._baseInterval = r, e.isNonterminal() && xi(t === r), this._childWrappers = [];
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
      const r = this._node.childAt(e), i = this._node.childOffsets[e], o = this._baseInterval.subInterval(i, r.matchLength), u = r.isNonterminal() ? o : this._baseInterval;
      t = this._childWrappers[e] = this._semantics.wrap(r, o, u);
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
    const t = e || [], r = t.map((u) => u._node), i = new l0(r, [], -1, !1), o = this._semantics.wrap(i, null, null);
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
    if (this.grammar = e, this.checkedActionDicts = !1, this.Wrapper = class extends (t ? t.Wrapper : nv) {
      constructor(i, o, u) {
        super(i, o, u), r.checkActionDictsIfHaventAlready(), this._semantics = r;
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
          value: tv(i)
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
      Object.keys(o).forEach((u) => {
        const { actionDict: l, formals: c, builtInDefault: I } = o[u];
        let y = u;
        c.length > 0 && (y += "(" + c.join(", ") + ")");
        let _;
        t(this) && this.super[i.toLowerCase() + "s"][u] ? _ = "extend" + i : _ = "add" + i, r += `
    .` + _ + "(" + JSON.stringify(y) + ", {";
        const x = [];
        Object.keys(l).forEach((k) => {
          if (l[k] !== I) {
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
    const i = e + "s", o = iv(t, e), { name: u } = o, { formals: l } = o;
    this.assertNewName(u, e);
    const c = nI(e, u, _), I = { _default: c };
    Object.keys(r).forEach((x) => {
      I[x] = r[x];
    });
    const y = e === "operation" ? new $o(u, l, I, c) : new cf(u, I, c);
    y.checkActionDict(this.grammar), this[i][u] = y;
    function _(...x) {
      const k = this._semantics[i][u];
      if (arguments.length !== k.formals.length)
        throw new Error(
          "Invalid number of arguments passed to " + u + " " + e + " (expected " + k.formals.length + ", got " + arguments.length + ")"
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
    e === "operation" ? (this.Wrapper.prototype[u] = _, this.Wrapper.prototype[u].toString = function() {
      return "[" + u + " operation]";
    }) : (Object.defineProperty(this.Wrapper.prototype, u, {
      get: _,
      configurable: !0
      // So the property can be deleted.
    }), Object.defineProperty(this.attributeKeys, u, {
      value: tv(u)
    }));
  }
  extendOperationOrAttribute(e, t, r) {
    const i = e + "s";
    if (iv(t, "attribute"), !(this.super && t in this.super[i]))
      throw new Error(
        "Cannot extend " + e + " '" + t + "': did not inherit an " + e + " with that name"
      );
    if (lf(this[i], t))
      throw new Error("Cannot extend " + e + " '" + t + "' again");
    const o = this[i][t].formals, u = this[i][t].actionDict, l = Object.create(u);
    Object.keys(r).forEach((c) => {
      l[c] = r[c];
    }), this[i][t] = e === "operation" ? new $o(t, o, l) : new cf(t, l), this[i][t].checkActionDict(this.grammar);
  }
  assertNewName(e, t) {
    if (lf(nv.prototype, e))
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
function iv(n, e) {
  if (!Ar.prototypeGrammar)
    return xi(n.indexOf("(") === -1), {
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
function nI(n, e, t) {
  return function(...r) {
    const o = (this._semantics.operations[e] || this._semantics.attributes[e]).formals.map((u) => this.args[u]);
    if (!this.isIteration() && r.length === 1)
      return t.apply(r[0], o);
    throw L1(this.ctorName, e, n, No);
  };
}
Ar.createSemantics = function(n, e) {
  const t = new Ar(
    n,
    e !== void 0 ? e : Ar.BuiltInSemantics._getSemantics()
  ), r = function(o) {
    if (!(o instanceof a0))
      throw new TypeError(
        "Semantics expected a MatchResult, but got " + Xg(o)
      );
    if (o.failed())
      throw new TypeError("cannot apply Semantics to " + o.toString());
    const u = o._cst;
    if (u.grammar !== n)
      throw new Error(
        "Cannot use a MatchResult from grammar '" + u.grammar.name + "' with a semantics for '" + n.name + "'"
      );
    const l = new hu(o.input);
    return t.wrap(u, l.interval(o._cstOffset, o.input.length));
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
class $o {
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
      return i ? (No.push([this, r]), i.apply(t, t._children())) : t.isNonterminal() && (i = this.actionDict._nonterminal, i) ? (No.push([this, "_nonterminal", r]), i.apply(t, t._children())) : (No.push([this, "default action", r]), this.actionDict._default.apply(t, t._children()));
    } finally {
      No.pop();
    }
  }
}
$o.prototype.typeName = "operation";
class cf extends $o {
  constructor(e, t, r) {
    super(e, [], t, r);
  }
  execute(e, t) {
    const r = t._node, i = e.attributeKeys[this.name];
    return lf(r, i) || (r[i] = $o.prototype.execute.call(this, e, t)), r[i];
  }
}
cf.prototype.typeName = "attribute";
const sv = ["_iter", "_terminal", "_nonterminal", "_default"];
function ov(n) {
  return Object.keys(n.rules).sort().map((e) => n.rules[e]);
}
const iI = (n) => n.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
let f0, h0;
class Ir {
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
    return new rI(this);
  }
  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn() {
    return this === Ir.ProtoBuiltInRules || this === Ir.BuiltInRules;
  }
  equals(e) {
    if (this === e)
      return !0;
    if (e == null || this.name !== e.name || this.defaultStartRule !== e.defaultStartRule || !(this.superGrammar === e.superGrammar || this.superGrammar.equals(e.superGrammar)))
      return !1;
    const t = ov(this), r = ov(e);
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
      const u = r[o];
      if (!sv.includes(o) && !(o in this.rules)) {
        i.push(`'${o}' is not a valid semantic action for '${this.name}'`);
        continue;
      }
      if (typeof u != "function") {
        i.push(`'${o}' must be a function in an action dictionary for '${this.name}'`);
        continue;
      }
      const c = u.length, I = this._topDownActionArity(o);
      if (c !== I) {
        let y;
        o === "_iter" || o === "_nonterminal" ? y = `it should use a rest parameter, e.g. \`${o}(...children) {}\`. NOTE: this is new in Ohm v16 — see https://ohmjs.org/d/ati for details.` : y = `expected ${I}, got ${c}`, i.push(`Semantic action '${o}' has the wrong arity: ${y}`);
      }
    }
    if (i.length > 0) {
      const o = i.map((l) => "- " + l), u = new Error(
        [
          `Found errors in the action dictionary of the '${t}' ${e}:`,
          ...o
        ].join(`
`)
      );
      throw u.problems = i, u;
    }
  }
  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity(e) {
    return sv.includes(e) ? 0 : this.rules[e].body.getArity();
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
      const c = this.rules[l], { body: I } = c, y = !this.superGrammar || !this.superGrammar.rules[l];
      let _;
      y ? _ = "define" : _ = I instanceof cu ? "extend" : "override";
      const x = {};
      if (c.source && this.source) {
        const K = c.source.relativeTo(this.source);
        x.sourceInterval = [K.startIdx, K.endIdx];
      }
      const k = y ? c.description : null, D = I.outputRecipe(c.formals, this.source);
      i[l] = [
        _,
        // "define"/"extend"/"override"
        x,
        k,
        c.formals,
        D
      ];
    });
    let o = "null";
    e ? o = e : this.superGrammar && !this.superGrammar.isBuiltIn() && (o = this.superGrammar.toRecipe());
    const u = [
      ...["grammar", t, this.name].map(JSON.stringify),
      o,
      ...[r, i].map(JSON.stringify)
    ];
    return iI(`[${u.join(",")}]`);
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
    const e = new Is();
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
    r.append(lu("_", i).join(", ")), r.append(`) {
`), r.append("  }");
  }
  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication(e) {
    let t;
    if (e.indexOf("<") === -1)
      t = new mt(e);
    else {
      const i = f0.match(e, "Base_application");
      t = h0(i, {});
    }
    if (!(t.ruleName in this.rules))
      throw t0(t.ruleName, this.name);
    const { formals: r } = this.rules[t.ruleName];
    if (r.length !== t.args.length) {
      const { source: i } = this.rules[t.ruleName];
      throw r0(
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
Ir.ProtoBuiltInRules = new Ir(
  "ProtoBuiltInRules",
  // name
  void 0,
  // supergrammar
  {
    any: {
      body: or,
      formals: [],
      description: "any character",
      primitive: !0
    },
    end: {
      body: ar,
      formals: [],
      description: "end of input",
      primitive: !0
    },
    caseInsensitive: {
      body: new rh(new lr(0)),
      formals: ["str"],
      primitive: !0
    },
    lower: {
      body: new Jt("Ll"),
      formals: [],
      description: "a lowercase letter",
      primitive: !0
    },
    upper: {
      body: new Jt("Lu"),
      formals: [],
      description: "an uppercase letter",
      primitive: !0
    },
    // Union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
    unicodeLtmo: {
      body: new Jt("Ltmo"),
      formals: [],
      description: "a Unicode character in Lt, Lm, or Lo",
      primitive: !0
    },
    // These rules are not truly primitive (they could be written in userland) but are defined
    // here for bootstrapping purposes.
    spaces: {
      body: new bs(new mt("space")),
      formals: []
    },
    space: {
      body: new ur("\0", " "),
      formals: [],
      description: "a space"
    }
  }
);
Ir.initApplicationParser = function(n, e) {
  f0 = n, h0 = e;
};
class av {
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
      this.name === "BuiltInRules" ? Ir.ProtoBuiltInRules : Ir.BuiltInRules
    ), this.superGrammar;
  }
  ensureSuperGrammarRuleForOverriding(e, t) {
    const r = this.ensureSuperGrammar().rules[e];
    if (!r)
      throw A1(e, this.superGrammar.name, t);
    return r;
  }
  installOverriddenOrExtendedRule(e, t, r, i) {
    const o = sf(t);
    if (o.length > 0)
      throw Qd(e, o, i);
    const u = this.ensureSuperGrammar().rules[e], l = u.formals, c = l ? l.length : 0;
    if (t.length !== c)
      throw r0(e, c, t.length, i);
    return this.install(e, t, r, u.description, i);
  }
  install(e, t, r, i, o, u = !1) {
    return this.rules[e] = {
      body: r.introduceParams(t),
      formals: t,
      description: i,
      source: o,
      primitive: u
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
    return this.source = new hu(e).interval(0, e.length), this;
  }
  // Creates a Grammar instance, and if it passes the sanity checks, returns it.
  build() {
    const e = new Ir(
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
      } catch (u) {
        t.push(u);
      }
      try {
        o.assertAllApplicationsAreValid(i, e);
      } catch (u) {
        t.push(u), r = !0;
      }
    }), r || Object.keys(e.rules).forEach((i) => {
      const { body: o } = e.rules[i];
      try {
        o.assertIteratedExprsAreNotNullable(e, []);
      } catch (u) {
        t.push(u);
      }
    }), t.length > 0 && q1(t), this.source && (e.source = this.source), e;
  }
  // Rule declarations
  define(e, t, r, i, o, u) {
    if (this.ensureSuperGrammar(), this.superGrammar.rules[e])
      throw Zd(e, this.name, this.superGrammar.name, o);
    if (this.rules[e])
      throw Zd(e, this.name, this.name, o);
    const l = sf(t);
    if (l.length > 0)
      throw Qd(e, l, o);
    return this.install(e, t, r, i, o, u);
  }
  override(e, t, r, i, o) {
    return this.ensureSuperGrammarRuleForOverriding(e, o), this.installOverriddenOrExtendedRule(e, t, r, o), this;
  }
  extend(e, t, r, i, o) {
    if (!this.ensureSuperGrammar().rules[e])
      throw k1(e, this.superGrammar.name, o);
    const l = new cu(this.superGrammar, e, r);
    return l.source = r.source, this.installOverriddenOrExtendedRule(e, t, l, o), this;
  }
}
class Wa {
  constructor() {
    this.currentDecl = null, this.currentRuleName = null;
  }
  newGrammar(e) {
    return new av(e);
  }
  grammar(e, t, r, i, o) {
    const u = new av(t);
    return r && u.withSuperGrammar(
      r instanceof Ir ? r : this.fromRecipe(r)
    ), i && u.withDefaultStartRule(i), e && e.source && u.withSource(e.source), this.currentDecl = u, Object.keys(o).forEach((l) => {
      this.currentRuleName = l;
      const c = o[l], I = c[0], y = c[1], _ = c[2], x = c[3], k = this.fromRecipe(c[4]);
      let D;
      u.source && y && y.sourceInterval && (D = u.source.subInterval(
        y.sourceInterval[0],
        y.sourceInterval[1] - y.sourceInterval[0]
      )), u[I](l, x, k, _, D);
    }), this.currentRuleName = this.currentDecl = null, u.build();
  }
  terminal(e) {
    return new Zt(e);
  }
  range(e, t) {
    return new ur(e, t);
  }
  param(e) {
    return new lr(e);
  }
  alt(...e) {
    let t = [];
    for (let r of e)
      r instanceof Ge || (r = this.fromRecipe(r)), r instanceof Ut ? t = t.concat(r.terms) : t.push(r);
    return t.length === 1 ? t[0] : new Ut(t);
  }
  seq(...e) {
    let t = [];
    for (let r of e)
      r instanceof Ge || (r = this.fromRecipe(r)), r instanceof Ht ? t = t.concat(r.factors) : t.push(r);
    return t.length === 1 ? t[0] : new Ht(t);
  }
  star(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new bs(e);
  }
  plus(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new mo(e);
  }
  opt(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new qn(e);
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
    return new fu(
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
function pu(n) {
  return typeof n == "function" ? n.call(new Wa()) : (typeof n == "string" && (n = JSON.parse(n)), new Wa().fromRecipe(n));
}
const nh = pu(["grammar", { source: `BuiltInRules {

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
Ir.BuiltInRules = nh;
$1(Ir.BuiltInRules);
const p0 = pu(["grammar", { source: `Ohm {

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
`], ["app", { sourceInterval: [2439, 2442] }, "end", []]]]]], comment_multiLine: ["define", { sourceInterval: [2465, 2501] }, null, [], ["seq", { sourceInterval: [2465, 2487] }, ["terminal", { sourceInterval: [2465, 2469] }, "/*"], ["star", { sourceInterval: [2470, 2482] }, ["seq", { sourceInterval: [2471, 2480] }, ["not", { sourceInterval: [2471, 2476] }, ["terminal", { sourceInterval: [2472, 2476] }, "*/"]], ["app", { sourceInterval: [2477, 2480] }, "any", []]]], ["terminal", { sourceInterval: [2483, 2487] }, "*/"]]], comment: ["define", { sourceInterval: [2398, 2501] }, null, [], ["alt", { sourceInterval: [2412, 2501] }, ["app", { sourceInterval: [2412, 2443] }, "comment_singleLine", []], ["app", { sourceInterval: [2465, 2487] }, "comment_multiLine", []]]], tokens: ["define", { sourceInterval: [2505, 2520] }, null, [], ["star", { sourceInterval: [2514, 2520] }, ["app", { sourceInterval: [2514, 2519] }, "token", []]]], token: ["define", { sourceInterval: [2524, 2600] }, null, [], ["alt", { sourceInterval: [2532, 2600] }, ["app", { sourceInterval: [2532, 2540] }, "caseName", []], ["app", { sourceInterval: [2543, 2550] }, "comment", []], ["app", { sourceInterval: [2553, 2558] }, "ident", []], ["app", { sourceInterval: [2561, 2569] }, "operator", []], ["app", { sourceInterval: [2572, 2583] }, "punctuation", []], ["app", { sourceInterval: [2586, 2594] }, "terminal", []], ["app", { sourceInterval: [2597, 2600] }, "any", []]]], operator: ["define", { sourceInterval: [2604, 2669] }, null, [], ["alt", { sourceInterval: [2615, 2669] }, ["terminal", { sourceInterval: [2615, 2619] }, "<:"], ["terminal", { sourceInterval: [2622, 2625] }, "="], ["terminal", { sourceInterval: [2628, 2632] }, ":="], ["terminal", { sourceInterval: [2635, 2639] }, "+="], ["terminal", { sourceInterval: [2642, 2645] }, "*"], ["terminal", { sourceInterval: [2648, 2651] }, "+"], ["terminal", { sourceInterval: [2654, 2657] }, "?"], ["terminal", { sourceInterval: [2660, 2663] }, "~"], ["terminal", { sourceInterval: [2666, 2669] }, "&"]]], punctuation: ["define", { sourceInterval: [2673, 2709] }, null, [], ["alt", { sourceInterval: [2687, 2709] }, ["terminal", { sourceInterval: [2687, 2690] }, "<"], ["terminal", { sourceInterval: [2693, 2696] }, ">"], ["terminal", { sourceInterval: [2699, 2702] }, ","], ["terminal", { sourceInterval: [2705, 2709] }, "--"]]] }]), Cc = Object.create(Ge.prototype);
function uv(n, e) {
  for (const t in n)
    if (t === e) return !0;
  return !1;
}
function sI(n, e, t) {
  const r = new Wa();
  let i, o, u, l = !1;
  return (t || p0).createSemantics().addOperation("visit", {
    Grammars(y) {
      return y.children.map((_) => _.visit());
    },
    Grammar(y, _, x, k, D) {
      const K = y.visit();
      i = r.newGrammar(K), _.child(0) && _.child(0).visit(), k.children.map((M) => M.visit());
      const C = i.build();
      if (C.source = this.source.trimmed(), uv(e, K))
        throw E1(C);
      return e[K] = C, C;
    },
    SuperGrammar(y, _) {
      const x = _.visit();
      if (x === "null")
        i.withSuperGrammar(null);
      else {
        if (!e || !uv(e, x))
          throw x1(x, e, _.source);
        i.withSuperGrammar(e[x]);
      }
    },
    Rule_define(y, _, x, k, D) {
      o = y.visit(), u = _.children.map((J) => J.visit())[0] || [], !i.defaultStartRule && i.ensureSuperGrammar() !== Ir.ProtoBuiltInRules && i.withDefaultStartRule(o);
      const K = D.visit(), C = x.children.map((J) => J.visit())[0], M = this.source.trimmed();
      return i.define(o, u, K, C, M);
    },
    Rule_override(y, _, x, k) {
      o = y.visit(), u = _.children.map((C) => C.visit())[0] || [];
      const D = this.source.trimmed();
      i.ensureSuperGrammarRuleForOverriding(o, D), l = !0;
      const K = k.visit();
      return l = !1, i.override(o, u, K, null, D);
    },
    Rule_extend(y, _, x, k) {
      o = y.visit(), u = _.children.map((C) => C.visit())[0] || [];
      const D = k.visit(), K = this.source.trimmed();
      return i.extend(o, u, D, null, K);
    },
    RuleBody(y, _) {
      return r.alt(..._.visit()).withSource(this.source);
    },
    OverrideRuleBody(y, _) {
      const x = _.visit(), k = x.indexOf(Cc);
      if (k >= 0) {
        const D = x.slice(0, k), K = x.slice(k + 1);
        return K.forEach((C) => {
          if (C === Cc) throw D1(C);
        }), new fu(
          i.superGrammar,
          o,
          D,
          K
        ).withSource(this.source);
      } else
        return r.alt(...x).withSource(this.source);
    },
    Formals(y, _, x) {
      return _.visit();
    },
    Params(y, _, x) {
      return _.visit();
    },
    Alt(y) {
      return r.alt(...y.visit()).withSource(this.source);
    },
    TopLevelTerm_inline(y, _) {
      const x = o + "_" + _.visit(), k = y.visit(), D = this.source.trimmed(), K = !(i.superGrammar && i.superGrammar.rules[x]);
      l && !K ? i.override(x, u, k, null, D) : i.define(x, u, k, null, D);
      const C = u.map((M) => r.app(M));
      return r.app(x, C).withSource(k.source);
    },
    OverrideTopLevelTerm_superSplice(y) {
      return Cc;
    },
    Seq(y) {
      return r.seq(...y.children.map((_) => _.visit())).withSource(this.source);
    },
    Iter_star(y, _) {
      return r.star(y.visit()).withSource(this.source);
    },
    Iter_plus(y, _) {
      return r.plus(y.visit()).withSource(this.source);
    },
    Iter_opt(y, _) {
      return r.opt(y.visit()).withSource(this.source);
    },
    Pred_not(y, _) {
      return r.not(_.visit()).withSource(this.source);
    },
    Pred_lookahead(y, _) {
      return r.lookahead(_.visit()).withSource(this.source);
    },
    Lex_lex(y, _) {
      return r.lex(_.visit()).withSource(this.source);
    },
    Base_application(y, _) {
      const x = _.children.map((k) => k.visit())[0] || [];
      return r.app(y.visit(), x).withSource(this.source);
    },
    Base_range(y, _, x) {
      return r.range(y.visit(), x.visit()).withSource(this.source);
    },
    Base_terminal(y) {
      return r.terminal(y.visit()).withSource(this.source);
    },
    Base_paren(y, _, x) {
      return _.visit();
    },
    ruleDescr(y, _, x) {
      return _.visit();
    },
    ruleDescrText(y) {
      return this.sourceString.trim();
    },
    caseName(y, _, x, k, D) {
      return x.visit();
    },
    name(y, _) {
      return this.sourceString;
    },
    nameFirst(y) {
    },
    nameRest(y) {
    },
    terminal(y, _, x) {
      return _.children.map((k) => k.visit()).join("");
    },
    oneCharTerminal(y, _, x) {
      return _.visit();
    },
    escapeChar(y) {
      try {
        return Qg(this.sourceString);
      } catch (_) {
        throw _ instanceof RangeError && _.message.startsWith("Invalid code point ") ? B1(y) : _;
      }
    },
    NonemptyListOf(y, _, x) {
      return [y.visit()].concat(x.children.map((k) => k.visit()));
    },
    EmptyListOf() {
      return [];
    },
    _terminal() {
      return this.sourceString;
    }
  })(n).visit();
}
const oI = pu(["grammar", { source: `OperationsAndAttributes {

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
aI(Ir.BuiltInRules);
uI(oI);
function aI(n) {
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
function uI(n) {
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
function lI(n) {
  let e = 0;
  const t = [0], r = () => t[t.length - 1], i = {}, o = /( *).*(?:$|\r?\n|\r)/g;
  let u;
  for (; (u = o.exec(n)) != null; ) {
    const [l, c] = u;
    if (l.length === 0) break;
    const I = c.length, y = r(), _ = e + I;
    if (I > y)
      t.push(I), i[_] = 1;
    else if (I < y) {
      const x = t.length;
      for (; r() !== I; )
        t.pop();
      i[_] = -1 * (x - t.length);
    }
    e += l.length;
  }
  return t.length > 1 && (i[e] = 1 - t.length), i;
}
const d0 = "an indented block", v0 = "a dedent", lv = 1114112;
class cI extends hu {
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
    return this._indentationAt(this.pos) !== 0 ? (this.examinedLength = Math.max(this.examinedLength, this.pos), lv) : super.nextCharCode();
  }
  nextCodePoint() {
    return this._indentationAt(this.pos) !== 0 ? (this.examinedLength = Math.max(this.examinedLength, this.pos), lv) : super.nextCodePoint();
  }
}
class cv extends Ge {
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
    return (r[i] || 0) * o > 0 ? (e.userData = Object.create(r), e.userData[i] -= o, e.pushBinding(new _s(0), i), !0) : (e.processFailure(i, this), !1);
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
    const t = this.isIndent ? d0 : v0;
    return new Or(this, t, "description");
  }
}
const fI = new mt("indent"), hI = new mt("dedent"), pI = new fu(nh, "any", [fI, hI], []), dI = new Wa().newGrammar("IndentationSensitive").withSuperGrammar(nh).define("indent", [], new cv(!0), d0, void 0, !0).define("dedent", [], new cv(!1), v0, void 0, !0).extend("any", [], pI, "any character", void 0).build();
Object.assign(dI, {
  _matchStateInitializer(n) {
    n.userData = lI(n.input), n.inputStream = new cI(n);
  },
  supportsIncrementalParsing: !1
});
Ir.initApplicationParser(p0, sI);
const g0 = pu(["grammar", { source: `N1QL {

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
function vI(n) {
  return gI(n, "SelectStatement");
}
function gI(n, e) {
  yI();
  let t = g0.match(n, e);
  if (t.failed())
    throw new Lr(t.shortMessage, t.getInterval().startIdx, t.getInterval().endIdx);
  return Ca(t).json();
}
let Ca;
function yI() {
  if (Ca !== void 0)
    return;
  Ca = g0.createSemantics();
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
    return function(o, u, l) {
      return [i, e(o), e(l)];
    };
  }
  Ca.addOperation("json()", {
    // Select:
    SelectStatement(i, o, u, l, c, I, y, _, x, k, D) {
      let K = {
        WHAT: t(u.asIteration()),
        FROM: []
      };
      if (l.numChildren > 0 && (K.FROM = e(l.child(0))), o.numChildren > 0 && (K.DISTINCT = !0), I.numChildren > 0 && (K.WHERE = e(I.child(0))), y.numChildren > 0 && (K.GROUP_BY = t(y.child(0).child(2).asIteration())), _.numChildren > 0 && _.child(0).numChildren > 0 && (K.HAVING = e(_.child(0).child(0).child(1))), x.numChildren > 0 && (K.ORDER_BY = t(x.child(0).child(2).asIteration())), k.numChildren > 0) {
        let [C, M, J] = e(k.child(0));
        M !== null && (K.OFFSET = M), J !== null && (K.LIMIT = J);
      }
      return K;
    },
    SelectResult(i, o, u) {
      let l = e(i);
      return u.numChildren > 0 && (l = ["AS", l, e(u.child(0))]), l;
    },
    // Kludge: returns DataSource[], but it has to be typed as Expr
    FromClause(i, o, u) {
      const l = e(o);
      return u.numChildren === 0 ? [l] : [l, ...t(u)];
    },
    // Kludge: returns FromSource[], but it has to be typed as Expr
    CollectionSource(i, o, u, l, c) {
      let I;
      return u.numChildren > 0 ? I = { SCOPE: e(i), COLLECTION: e(u.child(0)) } : I = { COLLECTION: e(i) }, c.numChildren > 0 && (I.AS = e(c.child(0))), I;
    },
    // Kludge: returns JoinSource[], but it has to be typed as Expr
    Join(i, o, u, l, c) {
      const I = e(u);
      return i.numChildren > 0 ? I.JOIN = e(i.child(0)) : I.JOIN = "INNER", I.ON = e(c), I;
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
    Unnest(i, o, u, l) {
      const c = { UNNEST: e(o) };
      return l.numChildren > 0 && (c.AS = e(l.child(0))), c;
    },
    Ordering(i, o) {
      let u = e(i);
      return o.numChildren > 0 && o.child(0).sourceString.toUpperCase() === "DESC" && (u = ["DESC", u]), u;
    },
    LimitOffset_limitFirst(i, o, u, l) {
      let c = ["limitoffset", null, e(o)];
      return l.numChildren > 0 && (c[1] = e(l.child(0))), c;
    },
    LimitOffset_offsetFirst(i, o, u, l) {
      let c = ["limitoffset", e(o), null];
      return l.numChildren > 0 && (c[2] = e(l.child(0))), c;
    },
    // Expressions:
    OrExp_or: r("OR"),
    AndExp_and: r("AND"),
    EqExp_eq: r("="),
    EqExp_neq: r("!="),
    EqExp_isValued(i, o, u, l) {
      let c = ["IS VALUED", e(i)];
      return u.numChildren > 0 && (c = ["NOT", c]), c;
    },
    EqExp_isNot(i, o, u, l) {
      return ["IS NOT", e(i), e(l)];
    },
    EqExp_is: r("IS"),
    EqExp_like: r("LIKE"),
    EqExp_notLike(i, o, u, l) {
      return ["NOT", ["LIKE", e(i), e(l)]];
    },
    EqExp_notNull(i, o, u) {
      return ["IS NOT", i, null];
    },
    EqExp_inExpr(i, o, u) {
      return [o.sourceString.toUpperCase(), e(i), e(u)];
    },
    EqExp_inArray(i, o, u) {
      return [o.sourceString.toUpperCase(), e(i), e(u)];
    },
    EqExp_between(i, o, u, l, c, I) {
      let y = ["BETWEEN", e(i), e(l), e(I)];
      return o.numChildren > 0 && (y = ["NOT", y]), y;
    },
    RelExp_rel(i, o, u) {
      return [o.sourceString, e(i), e(u)];
    },
    BitExp_bit(i, o, u) {
      return [o.sourceString, e(i), e(u)];
    },
    AddExp_plus: r("+"),
    AddExp_minus: r("-"),
    MulExp_times: r("*"),
    MulExp_divide: r("/"),
    MulExp_modulo: r("%"),
    ConcatExp_concat: r("||"),
    PrimaryExp_paren(i, o, u) {
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
    PrimaryExp_exists(i, o, u, l) {
      return ["EXISTS", e(u)];
    },
    parameter(i, o) {
      return ["$", e(o)];
    },
    variable(i, o) {
      return ["?", e(o)];
    },
    AnyEveryExp(i, o, u, l, c, I, y) {
      const _ = e(o), x = e(I);
      return Qf(x, (k, D) => (k === "." && D[1] === _ && (D[0] = "?"), !0)), [e(i), _, e(l), x];
    },
    AnyEvery_any(i) {
      return "ANY";
    },
    AnyEvery_every(i) {
      return "EVERY";
    },
    AnyEvery_anyEvery(i, o, u) {
      return "ANY AND EVERY";
    },
    CaseExp(i, o, u, l, c, I) {
      const y = ["CASE", o.numChildren > 0 ? e(o.child(0)) : null];
      for (const _ of u.children)
        y.push(e(_.child(1))), y.push(e(_.child(3)));
      return c.numChildren > 0 && y.push(e(c.child(0))), y;
    },
    // Properties:
    Property_all(i) {
      return ["."];
    },
    Property_allInCollection(i, o, u) {
      const l = [".", e(i)];
      return l.starColumn = !0, l;
    },
    PropertyPath(i, o) {
      return [".", e(i), ...t(o)];
    },
    PropertyPathContinuation_named(i, o) {
      return e(o);
    },
    PropertyPathContinuation_indexed(i, o, u) {
      return e(o);
    },
    // Functions:
    MetaFunction_plain(i, o, u, l) {
      const c = ["META()"];
      return u.numChildren > 0 && c.push(e(u.child(0))), c;
    },
    MetaFunction_property(i, o, u, l, c, I) {
      const y = ["META()"];
      return u.numChildren > 0 ? y.push(e(u.child(0))) : y.push(null), y.push(I.sourceString.toLowerCase()), y;
    },
    N1QLFunction(i, o, u, l) {
      return [e(i).toUpperCase() + "()", ...t(u.asIteration())];
    },
    // Literals:
    ArrayLiteral(i, o, u) {
      return ["[]", ...t(o.asIteration())];
    },
    DictLiteral(i, o, u) {
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
    ident_quoted(i, o, u) {
      return o.sourceString;
    },
    stringLiteral(i, o, u) {
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
class ih extends Error {
}
class y0 extends Error {
}
function m0(n) {
  return n in _0 || n in b0 || n in new I0(Math.random) || n in new oh(Math.random, Math.random) || n in sh;
}
function mI(n) {
  return !n.endsWith("()") && n in new oh(Math.random, Math.random);
}
function Nc(n, ...e) {
  if (!Array.isArray(n))
    return !1;
  for (let t = 0; t < e.length; ++t)
    if (n[t] !== e[t])
      return !1;
  return !0;
}
function dt(n, e) {
  if (!Array.isArray(n))
    return De(n !== void 0, "invalid Expr"), ia(n) ? () => n : _I(n, e);
  const t = n[0];
  try {
    const r = b0[t];
    if (r !== void 0) {
      if (!e.allowCompilingAggregates)
        throw new Lr(`Illegal use of aggregate function ${t} outside result column`);
      const l = new r(n, dt(n[1], e));
      return e.compileAggregate(l);
    }
    const i = n.length - 1;
    if (i === 1) {
      const l = new I0(dt(n[1], e));
      if (l[t])
        return l[t].bind(l);
    } else if (i === 2) {
      const l = new oh(dt(n[1], e), dt(n[2], e));
      if (l[t])
        return l[t].bind(l);
    }
    const o = _0[t];
    if (o)
      return o(n, e);
    const u = sh[t];
    if (u)
      return bI(n, e, u);
    throw t.endsWith("()") ? m0(t) ? new Lr(`${t} cannot be called with ${i} arguments`) : new Lr(`"${t}" is not a supported function`) : new Lr(`unknown JSON query operator "${t}"`);
  } catch (r) {
    throw r instanceof Lr && r.sourceRange === void 0 && n.sourceTextStart && (r.sourceRange = [n.sourceTextStart, n.sourceTextEnd ?? n.sourceTextStart]), r;
  }
}
const sh = {};
function II(n, e, t) {
  if (!n.match(/^[a-zA-Z][a-zA-Z0-9_]+$/))
    throw Error(`N1QL function name "${n}" is not valid. Must be alphanumeric.`);
  const r = n.toUpperCase() + "()";
  if (m0(r))
    throw Error(`N1QL function ${n} already exists.`);
  sh[r] = {
    implementation: e,
    options: {
      minimumArgs: (t == null ? void 0 : t.minimumArgs) ?? e.length,
      maximumArgs: (t == null ? void 0 : t.maximumArgs) ?? e.length,
      nondeterministic: (t == null ? void 0 : t.nondeterministic) ?? !1
    }
  };
}
function bI(n, e, t) {
  const r = n[0], i = tn(n, e);
  return bi(
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
var Re, pt, Ct, Na, rr;
class I0 {
  constructor(e) {
    ee(this, Re);
    ee(this, rr);
    G(this, rr, e);
  }
  // Enables method lookup by name
  //---- ARRAYS:
  "ARRAY_AVG()"() {
    return ye(this, Re, pt).call(this, Wm);
  }
  "ARRAY_COUNT()"() {
    return ye(this, Re, pt).call(this, Ym);
  }
  "ARRAY_IFNULL()"() {
    return ye(this, Re, pt).call(this, Vm);
  }
  "ARRAY_LENGTH()"() {
    return ye(this, Re, pt).call(this, Jm);
  }
  "ARRAY_MIN()"() {
    return ye(this, Re, pt).call(this, Qm);
  }
  "ARRAY_MAX()"() {
    return ye(this, Re, pt).call(this, Zm);
  }
  "ARRAY_SUM()"() {
    return ye(this, Re, pt).call(this, Xm);
  }
  EXISTS() {
    const e = p(this, rr).call(this);
    return Array.isArray(e) && e.length > 0;
  }
  //---- LOGICAL:
  NOT() {
    return ye(this, Re, pt).call(this, (e) => !e);
  }
  //---- MATH:
  "+"() {
    return p(this, rr).call(this);
  }
  "-"() {
    return ye(this, Re, Ct).call(this, (e) => -e);
  }
  "ABS()"() {
    return ye(this, Re, Ct).call(this, Math.abs);
  }
  "ACOS()"() {
    return ye(this, Re, Ct).call(this, Math.acos);
  }
  "ASIN()"() {
    return ye(this, Re, Ct).call(this, Math.asin);
  }
  "ATAN()"() {
    return ye(this, Re, Ct).call(this, Math.atan);
  }
  "CEIL()"() {
    return ye(this, Re, Ct).call(this, Math.ceil);
  }
  "COS()"() {
    return ye(this, Re, Ct).call(this, Math.cos);
  }
  "DEGREES()"() {
    return ye(this, Re, Ct).call(this, (e) => e * 180 / Math.PI);
  }
  "EXP()"() {
    return ye(this, Re, Ct).call(this, Math.exp);
  }
  "FLOOR()"() {
    return ye(this, Re, Ct).call(this, Math.floor);
  }
  "LN()"() {
    return ye(this, Re, Ct).call(this, Math.log);
  }
  "LOG()"() {
    return ye(this, Re, Ct).call(this, Math.log10);
  }
  "RADIANS()"() {
    return ye(this, Re, Ct).call(this, (e) => e * Math.PI / 180);
  }
  "ROUND()"() {
    return ye(this, Re, Ct).call(this, Math.round);
  }
  "ROUND_NEAREST()"() {
    return ye(this, Re, Ct).call(this, Math.round);
  }
  "ROUND_EVEN()"() {
    return ye(this, Re, Ct).call(this, jg);
  }
  "SIGN()"() {
    return ye(this, Re, Ct).call(this, Math.sign);
  }
  "SIN()"() {
    return ye(this, Re, Ct).call(this, Math.sin);
  }
  "SQRT()"() {
    return ye(this, Re, Ct).call(this, Math.sqrt);
  }
  "TAN()"() {
    return ye(this, Re, Ct).call(this, Math.tan);
  }
  "TRUNC()"() {
    return ye(this, Re, Ct).call(this, Math.trunc);
  }
  //---- STRINGS:
  "LENGTH()"() {
    return ye(this, Re, Na).call(this, v1);
  }
  "LOWER()"() {
    return ye(this, Re, Na).call(this, (e) => e.toLowerCase());
  }
  "UPPER()"() {
    return ye(this, Re, Na).call(this, (e) => e.toUpperCase());
  }
  //---- TYPES:
  "IS VALUED"() {
    return kc(p(this, rr).call(this));
  }
  "ISARRAY()"() {
    return ye(this, Re, pt).call(this, Array.isArray);
  }
  "ISATOM()"() {
    return ye(this, Re, pt).call(this, jd);
  }
  "ISBOOLEAN()"() {
    return ye(this, Re, pt).call(this, qd);
  }
  "ISNUMBER()"() {
    return ye(this, Re, pt).call(this, Md);
  }
  "ISOBJECT()"() {
    return ye(this, Re, pt).call(this, $d);
  }
  "ISSTRING()"() {
    return ye(this, Re, pt).call(this, Ud);
  }
  "ISVALUED()"() {
    return kc(p(this, rr).call(this));
  }
  "TOARRAY()"() {
    return ye(this, Re, pt).call(this, Kd);
  }
  "TOATOM()"() {
    return za(p(this, rr).call(this));
  }
  "TOBOOLEAN()"() {
    return ye(this, Re, pt).call(this, zd);
  }
  "TONUMBER()"() {
    return ye(this, Re, pt).call(this, Gd);
  }
  "TOOBJECT()"() {
    return ye(this, Re, pt).call(this, Hd);
  }
  "TOSTRING()"() {
    return ye(this, Re, pt).call(this, Wd);
  }
  "IS_ARRAY()"() {
    return ye(this, Re, pt).call(this, Array.isArray);
  }
  "IS_ATOM()"() {
    return ye(this, Re, pt).call(this, jd);
  }
  "IS_BOOLEAN()"() {
    return ye(this, Re, pt).call(this, qd);
  }
  "IS_NUMBER()"() {
    return ye(this, Re, pt).call(this, Md);
  }
  "IS_OBJECT()"() {
    return ye(this, Re, pt).call(this, $d);
  }
  "IS_STRING()"() {
    return ye(this, Re, pt).call(this, Ud);
  }
  "IS_VALUED()"() {
    return kc(p(this, rr).call(this));
  }
  "TO_ARRAY()"() {
    return ye(this, Re, pt).call(this, Kd);
  }
  "TO_ATOM()"() {
    return za(p(this, rr).call(this));
  }
  "TO_BOOLEAN()"() {
    return ye(this, Re, pt).call(this, zd);
  }
  "TO_NUMBER()"() {
    return ye(this, Re, pt).call(this, Gd);
  }
  "TO_OBJECT()"() {
    return ye(this, Re, pt).call(this, Hd);
  }
  "TO_STRING()"() {
    return ye(this, Re, pt).call(this, Wd);
  }
  "TYPE()"() {
    return Yd(p(this, rr).call(this));
  }
  "TYPENAME()"() {
    return Yd(p(this, rr).call(this));
  }
}
Re = new WeakSet(), pt = function(e) {
  const t = p(this, rr).call(this);
  if (t !== void 0)
    return t === null ? null : e(t);
}, /** This is unaryOp further specialized for numeric functions. */
Ct = function(e) {
  const t = p(this, rr).call(this);
  return typeof t == "number" ? e(t) : t === void 0 ? void 0 : null;
}, /** This is unaryOp further specialized for string functions. */
Na = function(e) {
  const t = p(this, rr).call(this);
  return typeof t == "string" ? e(t) : t === void 0 ? void 0 : null;
}, rr = new WeakMap();
var ut, Pr, Er, Cs, Ur, $r;
class oh {
  constructor(e, t) {
    ee(this, ut);
    ee(this, Ur);
    ee(this, $r);
    G(this, Ur, e), G(this, $r, t);
  }
  // Enables method lookup by name
  //---- ARRAYS:
  "ARRAY_CONTAINS()"() {
    return ye(this, ut, Pr).call(this, Lg);
  }
  //---- COMPARISON:
  "="() {
    return ye(this, ut, Pr).call(this, Fn);
  }
  "!="() {
    return ye(this, ut, Pr).call(this, (e, t) => !Fn(e, t));
  }
  // These are undocumented but the N1QL test suite calls them...
  "EQ()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Fn(e, t));
  }
  "LT()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Yt(e, t) < 0);
  }
  "LE()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Yt(e, t) <= 0);
  }
  "GT()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Yt(e, t) > 0);
  }
  "GE()"() {
    return ye(this, ut, Pr).call(this, (e, t) => Yt(e, t) >= 0);
  }
  "<"() {
    return ye(this, ut, Pr).call(this, (e, t) => Yt(e, t) < 0);
  }
  "<="() {
    return ye(this, ut, Pr).call(this, (e, t) => Yt(e, t) <= 0);
  }
  ">"() {
    return ye(this, ut, Pr).call(this, (e, t) => Yt(e, t) > 0);
  }
  ">="() {
    return ye(this, ut, Pr).call(this, (e, t) => Yt(e, t) >= 0);
  }
  "MISSINGIF()"() {
    return e1(p(this, Ur).call(this), p(this, $r).call(this));
  }
  "NULLIF()"() {
    return t1(p(this, Ur).call(this), p(this, $r).call(this));
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
    return ye(this, ut, Er).call(this, l1);
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
    return ye(this, ut, Er).call(this, h1);
  }
  "ROUND()"() {
    return ye(this, ut, Er).call(this, Ld);
  }
  "ROUND_NEAREST()"() {
    return ye(this, ut, Er).call(this, Ld);
  }
  "ROUND_EVEN()"() {
    return ye(this, ut, Er).call(this, jg);
  }
  "TRUNC()"() {
    return ye(this, ut, Er).call(this, p1);
  }
  "COSINE_DISTANCE()"() {
    return f1(p(this, Ur).call(this), p(this, $r).call(this));
  }
  //---- STRINGS:
  "||"() {
    return ye(this, ut, Cs).call(this, (e, t) => e + t);
  }
  "CONTAINS()"() {
    return ye(this, ut, Cs).call(this, (e, t) => e.includes(t));
  }
  "LTRIM()"() {
    return ye(this, ut, Cs).call(this, zg);
  }
  "RTRIM()"() {
    return ye(this, ut, Cs).call(this, Gg);
  }
  "TRIM()"() {
    return ye(this, ut, Cs).call(this, g1);
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
Cs = function(e) {
  const t = p(this, Ur).call(this), r = p(this, $r).call(this);
  return typeof t == "string" && typeof r == "string" ? e(t, r) : t === void 0 || r === void 0 ? void 0 : null;
}, Ur = new WeakMap(), $r = new WeakMap();
const b0 = {
  "ARRAY_AGG()": Wf,
  "AVG()": rf,
  "COUNT()": Yf,
  "MAX()": Vf,
  "MIN()": Jf,
  "SUM()": Zf
}, _0 = {
  ".": wI,
  "?": xI,
  "[]": fv,
  $: (n, e) => {
    const t = vi(n[1], "$");
    return e.parameterNames.add(t), () => {
      const r = e.parameters.get(t);
      if (r === void 0)
        throw new y0(`undefined query parameter $${t}`);
      return r;
    };
  },
  "_.": ([n, e, t], r) => {
    const i = dt(e, r), o = vi(t, "2nd arg of '_.'");
    return () => {
      const u = i();
      return SI(u) ? u[o] : void 0;
    };
  },
  ANY: Pc,
  EVERY: Pc,
  "ANY AND EVERY": Pc,
  BETWEEN: hv,
  "BETWEEN()": hv,
  CASE: (n, e) => {
    const t = n.length - 1, r = tn(n, e);
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
        if (Fn(i, r[o]()))
          return r[o + 1]();
      return o < t ? r[o]() : null;
    };
  },
  EXISTS: (n, e) => {
    throw new Lr("sorry, EXISTS is currently unimplemented");
  },
  IN: gv,
  "NOT IN": gv,
  IS: yv,
  "IS NOT": yv,
  LIKE: mv,
  MISSING: () => () => {
  },
  //---- Functions with variable numbers of arguments or other special handling:
  "ARRAY()": fv,
  "E()": () => () => Math.E,
  "PI()": () => () => Math.PI,
  "CONCAT()": (n, e) => {
    const t = tn(n, e);
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
  "DATE_ADD_MILLIS()": dv,
  "DATE_ADD_STR()": dv,
  "DATE_DIFF_MILLIS()": vv,
  "DATE_DIFF_STR()": vv,
  "MILLIS_TO_STR()": Iv,
  "MILLIS_TO_UTC()": Iv,
  "STR_TO_MILLIS()": bv,
  "STR_TO_UTC()": bv,
  "MILLIS_TO_TZ()": ([n, e, t], r) => {
    const i = dt(e, r), o = dt(t, r);
    return () => {
      const u = i(), l = o();
      return typeof u != "number" || typeof l != "string" ? null : $g(u, l);
    };
  },
  "STR_TO_TZ()": ([n, e, t], r) => {
    const i = dt(e, r), o = dt(t, r);
    return () => {
      const u = i(), l = o();
      return typeof u != "string" || typeof l != "string" ? null : u1(u, l);
    };
  },
  "EUCLIDEAN_DISTANCE()": ([n, e, t, r], i) => {
    const o = dt(e, i), u = dt(t, i);
    return r !== void 0 && (r = _v(r, "3rd arg (power) to EUCLIDEAN_DISTANCE()")), () => c1(o(), u(), r);
  },
  "GREATEST()": (n, e) => {
    const t = tn(n, e);
    return () => Fd(t, 1);
  },
  "IFMISSING()": (n, e) => {
    const t = tn(n, e);
    return () => {
      for (const r of t) {
        const i = r();
        if (i !== void 0) return i;
      }
      return null;
    };
  },
  "IFNULL()": (n, e) => {
    const t = tn(n, e);
    return () => {
      for (const r of t) {
        const i = r();
        if (i !== null) return i;
      }
      return null;
    };
  },
  "IFMISSINGORNULL()": pv,
  "COALESCE()": pv,
  "LEAST()": (n, e) => {
    const t = tn(n, e);
    return () => Fd(t, -1);
  },
  "LIKE()": mv,
  "META()": ([n, e, t], r) => (e = vi(e, "data source in 'META()'"), bi(
    r.sourceTypes.get(e) !== "unnest",
    "META() cannot be used on an UNNEST"
  ), t !== void 0 && bi(
    ["id", "sequence", "deleted", "expires"].includes(t),
    `invalid META() property "${t}"`
  ), () => {
    var o;
    let i = (o = r.row) == null ? void 0 : o.getSourceRevision(e);
    if (i === void 0 || i.id === void 0)
      throw new ih(`"META(${e})" is not available`);
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
        const u = {
          id: i.id,
          sequence: i.seq
        };
        return Ts(i) && (u.deleted = !0), i.expires !== void 0 && (u.expires = i.expires), u;
      }
      default:
        return;
    }
  }),
  "REGEXP_CONTAINS()": Dc,
  "REGEXP_LIKE()": Dc,
  "REGEXP_POSITION()": Dc,
  "REGEXP_REPLACE()": ([n, e, t, r, i], o) => {
    const u = dt(e, o), l = RegExp(vi(t, "arg 2 of REGEXP_REPLACE()"), "g"), c = dt(r, o), I = i !== void 0 ? _v(i, "arg 4 of REGEXP_REPLACE()") : 1e9;
    return () => {
      const y = u(), _ = c();
      if (typeof y != "string" || typeof _ != "string")
        return y;
      let x = 1;
      return y.replace(l, (k) => x++ <= I ? _ : k);
    };
  }
};
function Pc([n, e, t, r], i) {
  const o = n === "ANY", u = n === "ANY AND EVERY";
  e = vi(e, `variable name in ${n}`);
  const l = dt(t, i), c = dt(r, i);
  return () => {
    const I = l();
    if (!Array.isArray(I) || u && I.length === 0)
      return !1;
    try {
      for (const y of I)
        if (i.variables[e] = y, c()) {
          if (o) return !0;
        } else if (!o) return !1;
      return !o;
    } finally {
      delete i.variables[e];
    }
  };
}
function fv(n, e) {
  if (w0(n)) {
    const t = n.slice(1);
    return Object.freeze(t), () => t;
  } else {
    const t = tn(n, e);
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
function hv([n, e, t, r], i) {
  const o = dt(e, i), u = dt(t, i), l = dt(r, i);
  return () => {
    let c = o(), I = u(), y = l();
    if (!(c === void 0 || I === void 0 || y === void 0))
      return c === null || I === null || y === null ? null : Yt(I, c) <= 0 && Yt(y, c) >= 0;
  };
}
function pv(n, e) {
  const t = tn(n, e);
  return () => {
    for (const r of t) {
      const i = r();
      if (i != null) return i;
    }
    return null;
  };
}
function dv(n, e) {
  const t = tn(n, e);
  return () => {
    const r = t[0](), i = t[1](), o = t[2]();
    return typeof r != "string" && typeof r != "number" || typeof i != "number" || typeof o != "string" ? null : i1(r, i, o);
  };
}
function vv(n, e) {
  const t = tn(n, e);
  return () => {
    const r = t[0](), i = t[1](), o = t[2]();
    return typeof r != "string" && typeof r != "number" || typeof i != "string" && typeof i != "number" || typeof o != "string" ? null : s1(r, i, o);
  };
}
function _I(n, e) {
  const t = /* @__PURE__ */ new Map();
  let r = !1;
  for (const i of Object.getOwnPropertyNames(n)) {
    const o = n[i];
    ia(o) ? t.set(i, o) : (t.set(i, dt(o, e)), r = !0);
  }
  return r ? () => {
    const i = {};
    for (let [o, u] of t) {
      let l;
      if (typeof u == "function") {
        if (l = u(), l === void 0) continue;
      } else
        l = u;
      i[o] = l;
    }
    return i;
  } : (Object.freeze(n), () => n);
}
function gv([n, e, t], r) {
  bi(Array.isArray(t), "invalid right-hand-side of IN");
  const i = n === "IN", o = dt(e, r);
  if (t[0] === "[]")
    if (w0(t)) {
      const u = new Set(t.slice(1));
      return () => {
        const l = o();
        return l == null ? l : u.has(l) === i;
      };
    } else {
      const u = t.map((l) => dt(l, r));
      return () => {
        const l = o();
        return l == null ? l : u.some((c) => Fn(c(), l)) === i;
      };
    }
  else {
    const u = dt(t, r);
    return () => {
      const l = o(), c = u();
      if (!(l === void 0 || c === void 0))
        return l === null || !Array.isArray(c) ? null : Lg(c, l) === i;
    };
  }
}
function yv([n, e, t], r) {
  const i = n === "IS", o = dt(e, r);
  if (t === null)
    return () => {
      const u = o();
      return u === void 0 ? void 0 : u === null === i;
    };
  if (Array.isArray(t) && t[0] === "MISSING")
    return () => o() === void 0 === i;
  {
    const u = dt(t, r);
    return () => Fn(o(), u()) === i;
  }
}
function mv([n, e, t], r) {
  const i = dt(e, r);
  if (typeof t == "string") {
    const [o, u] = Hf(t);
    switch (o) {
      case 0:
        return () => Oa(i, (l) => l === u);
      case 1:
        return () => Oa(i, (l) => l.startsWith(u));
      case 2:
        return () => Oa(i, (l) => l.endsWith(u));
      default: {
        const l = Kg(u);
        return () => Oa(i, (c) => l.test(c));
      }
    }
  } else {
    const o = dt(t, r);
    return () => EI(i, o, d1);
  }
}
function wI([n, e, ...t], r) {
  e = vi(e, "data source in '.'");
  const i = t, o = r.results.get(e);
  if (o !== void 0)
    return i.length === 0 ? o : () => ff(i, o());
  {
    const u = r.sourceTypes.get(e) !== "unnest";
    return () => {
      var c;
      let l = (c = r.row) == null ? void 0 : c.dataSources.get(e);
      if (l === void 0)
        throw new ih(`"${e}" is not available, in property "${e}.${i.join(".")}"`);
      return l = u ? l.body : l, ff(i, l);
    };
  }
}
function Iv([n, e, t], r) {
  bi(t === void 0, `format strings are not supported in ${n}`);
  const i = dt(e, r), o = n === "MILLIS_TO_STR()" ? Ug : zf;
  return () => {
    const u = i();
    return typeof u != "number" ? null : o(u);
  };
}
function bv([n, e, t], r) {
  bi(t === void 0, `format strings are not supported in ${n}`);
  const i = dt(e, r), o = n === "STR_TO_MILLIS()" ? o1 : a1;
  return () => {
    const u = i();
    return typeof u != "string" ? null : o(u);
  };
}
function Dc([n, e, t], r) {
  const i = dt(e, r);
  let o = vi(t, `arg 2 of ${n}`);
  n === "REGEXP_LIKE()" && (o = `^${o}$`);
  let u;
  try {
    u = RegExp(o);
  } catch (l) {
    throw l instanceof SyntaxError ? new Lr(`invalid regular expression "${t}"`) : l;
  }
  return n === "REGEXP_POSITION()" ? () => {
    const l = i();
    return typeof l == "string" ? l.search(u) : -1;
  } : () => {
    const l = i();
    return typeof l == "string" && u.test(l);
  };
}
function xI(n, e) {
  const t = vi(n[1], "?"), r = n.slice(2);
  return () => {
    const i = e.variables[t];
    if (i === void 0) throw new Lr(`undefined variable ?${t}`);
    return ff(r, i);
  };
}
function ff(n, e) {
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
function bi(n, e) {
  if (!n)
    throw new Lr(e);
}
function _v(n, e) {
  return bi(typeof n == "number", `${e} must be a number`), n;
}
function vi(n, e) {
  return bi(typeof n == "string", `${e} must be a string`), n;
}
function tn(n, e) {
  return n.slice(1).map((t) => dt(t, e));
}
function w0(n) {
  return n.every(ia);
}
function Oa(n, e) {
  const t = n();
  return typeof t == "string" ? e(t) : t === void 0 ? void 0 : null;
}
function EI(n, e, t) {
  const r = n(), i = e();
  return typeof r == "string" && typeof i == "string" ? t(r, i) : r === void 0 || i === void 0 ? void 0 : null;
}
function SI(n) {
  return typeof n == "object" && !Array.isArray(n) && n !== null;
}
var Li;
class Ya {
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
    ee(this, Li, []);
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
    const t = p(this, Li).length;
    return p(this, Li).push(e), () => {
      var i;
      const r = (i = this.row) == null ? void 0 : i.aggregates;
      return mr(
        r !== void 0,
        "aggregate function called outside aggregation context"
      ), r[t].result;
    };
  }
  get hasAggregators() {
    return p(this, Li).length > 0;
  }
  /** Returns a copy of the `aggregatorsTemplate`. */
  copyAggregates() {
    return p(this, Li).map((e) => e.clone());
  }
}
Li = new WeakMap();
class Io {
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
    let e = new Io(this.ctx);
    for (const [t, r] of this.dataSources)
      e.dataSources.set(t, r);
    return e.aggregates = this.aggregates, e;
  }
}
function Ft(n) {
  if (typeof n == "function")
    return n.sourceExpression ? Ft(n.sourceExpression) : "<expression>";
  if (Array.isArray(n)) {
    const e = n[0];
    switch (e) {
      case "$":
        return "$" + wv(n);
      case "?":
        return n[1];
      case "MISSING":
        return e;
      case "NOT":
        return "NOT " + Ft(n[1]);
      case ".":
        return n.starColumn ? n[1] + ".*" : wv(n);
      case "META()": {
        let t = `META(${n[1]})`;
        return n[2] && (t += "." + n[2]), t;
      }
      default:
        return e.endsWith("()") ? e.slice(0, -2) + "(" + n.slice(1).map(Ft).join(", ") + ")" : mI(e) ? Ft(n[1]) + " " + e + " " + Ft(n[2]) : e === "-" || e === "+" ? e + Ft(n[1]) : e + "[" + n.slice(1).map(Ft).join(", ") + "]";
    }
  } else return ia(n) ? JSON.stringify(n) : "{" + Object.getOwnPropertyNames(n).map((e) => JSON.stringify(e) + ": " + Ft(n[e])).join(", ") + "}";
}
function wv(n) {
  return n.slice(1).map((e) => typeof e == "number" ? `[${e}]` : e).join(".");
}
class x0 {
  constructor(e, t) {
    this.sourceExpression = e, this.key = t;
  }
}
class sa extends x0 {
  get includeMin() {
    return !0;
  }
  get includeMax() {
    return !0;
  }
}
class xv extends sa {
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
    const t = Va(this.value());
    return t !== void 0 ? e.equals(t) : void 0;
  }
  toString() {
    return `${this.key} = ${Ft(this.valueExpr)}`;
  }
}
class AI extends sa {
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
class Bc extends sa {
  constructor(e, t, r, i, o = !0, u = !0) {
    super(e, t), this.minValueExpr = r, this.maxValueExpr = i, this.includeMin_ = o, this.includeMax_ = u, De(r || i);
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
    const t = Va(this.minValue), r = Va(this.maxValue);
    return this.minValueExpr ? t === void 0 ? void 0 : this.maxValueExpr !== void 0 ? r === void 0 ? void 0 : e.between(t, r, this.includeMin, this.includeMax) : this.includeMin ? e.aboveOrEqual(t) : e.above(t) : this.maxValueExpr !== void 0 ? r === void 0 ? void 0 : this.includeMax ? e.belowOrEqual(r) : e.below(r) : void 0;
  }
  toString() {
    const e = this.minValueExpr ? Ft(this.minValueExpr) : "", t = this.maxValueExpr ? Ft(this.maxValueExpr) : "", r = this.includeMin ? "[" : "(", i = this.includeMax ? "]" : ")";
    return `${this.key} in range ${r}${e} ... ${t}${i}`;
  }
}
function Va(n) {
  return typeof n == "number" || typeof n == "string" || Array.isArray(n) ? n : void 0;
}
class Fc extends x0 {
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
    const t = Va(this.itemValue());
    return t !== void 0 ? e.equals(t).distinct() : void 0;
  }
  toString() {
    return `${Ft(this.itemExpr)} IN ${this.key}`;
  }
}
var Pa = { exports: {} }, kI = Pa.exports, Ev;
function OI() {
  return Ev || (Ev = 1, function(n, e) {
    (function(t, r) {
      n.exports = r();
    })(kI, function() {
      var t = function(s, a) {
        return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(h, g) {
          h.__proto__ = g;
        } || function(h, g) {
          for (var b in g) Object.prototype.hasOwnProperty.call(g, b) && (h[b] = g[b]);
        })(s, a);
      }, r = function() {
        return (r = Object.assign || function(s) {
          for (var a, h = 1, g = arguments.length; h < g; h++) for (var b in a = arguments[h]) Object.prototype.hasOwnProperty.call(a, b) && (s[b] = a[b]);
          return s;
        }).apply(this, arguments);
      };
      function i(s, a, h) {
        for (var g, b = 0, E = a.length; b < E; b++) !g && b in a || ((g = g || Array.prototype.slice.call(a, 0, b))[b] = a[b]);
        return s.concat(g || Array.prototype.slice.call(a));
      }
      var o = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : Sf, u = Object.keys, l = Array.isArray;
      function c(s, a) {
        return typeof a != "object" || u(a).forEach(function(h) {
          s[h] = a[h];
        }), s;
      }
      typeof Promise > "u" || o.Promise || (o.Promise = Promise);
      var I = Object.getPrototypeOf, y = {}.hasOwnProperty;
      function _(s, a) {
        return y.call(s, a);
      }
      function x(s, a) {
        typeof a == "function" && (a = a(I(s))), (typeof Reflect > "u" ? u : Reflect.ownKeys)(a).forEach(function(h) {
          D(s, h, a[h]);
        });
      }
      var k = Object.defineProperty;
      function D(s, a, h, g) {
        k(s, a, c(h && _(h, "get") && typeof h.get == "function" ? { get: h.get, set: h.set, configurable: !0 } : { value: h, configurable: !0, writable: !0 }, g));
      }
      function K(s) {
        return { from: function(a) {
          return s.prototype = Object.create(a.prototype), D(s.prototype, "constructor", s), { extend: x.bind(null, s.prototype) };
        } };
      }
      var C = Object.getOwnPropertyDescriptor, M = [].slice;
      function J(s, a, h) {
        return M.call(s, a, h);
      }
      function X(s, a) {
        return a(s);
      }
      function le(s) {
        if (!s) throw new Error("Assertion Failed");
      }
      function ce(s) {
        o.setImmediate ? setImmediate(s) : setTimeout(s, 0);
      }
      function fe(s, a) {
        if (typeof a == "string" && _(s, a)) return s[a];
        if (!a) return s;
        if (typeof a != "string") {
          for (var h = [], g = 0, b = a.length; g < b; ++g) {
            var E = fe(s, a[g]);
            h.push(E);
          }
          return h;
        }
        var O = a.indexOf(".");
        if (O !== -1) {
          var N = s[a.substr(0, O)];
          return N == null ? void 0 : fe(N, a.substr(O + 1));
        }
      }
      function oe(s, a, h) {
        if (s && a !== void 0 && !("isFrozen" in Object && Object.isFrozen(s))) if (typeof a != "string" && "length" in a) {
          le(typeof h != "string" && "length" in h);
          for (var g = 0, b = a.length; g < b; ++g) oe(s, a[g], h[g]);
        } else {
          var E, O, N = a.indexOf(".");
          N !== -1 ? (E = a.substr(0, N), (O = a.substr(N + 1)) === "" ? h === void 0 ? l(s) && !isNaN(parseInt(E)) ? s.splice(E, 1) : delete s[E] : s[E] = h : oe(N = !(N = s[E]) || !_(s, E) ? s[E] = {} : N, O, h)) : h === void 0 ? l(s) && !isNaN(parseInt(a)) ? s.splice(a, 1) : delete s[a] : s[a] = h;
        }
      }
      function ke(s) {
        var a, h = {};
        for (a in s) _(s, a) && (h[a] = s[a]);
        return h;
      }
      var Be = [].concat;
      function Ce(s) {
        return Be.apply([], s);
      }
      var Qt = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(Ce([8, 16, 32, 64].map(function(s) {
        return ["Int", "Uint", "Float"].map(function(a) {
          return a + s + "Array";
        });
      }))).filter(function(s) {
        return o[s];
      }), $e = new Set(Qt.map(function(s) {
        return o[s];
      })), Fe = null;
      function Se(s) {
        return Fe = /* @__PURE__ */ new WeakMap(), s = function a(h) {
          if (!h || typeof h != "object") return h;
          var g = Fe.get(h);
          if (g) return g;
          if (l(h)) {
            g = [], Fe.set(h, g);
            for (var b = 0, E = h.length; b < E; ++b) g.push(a(h[b]));
          } else if ($e.has(h.constructor)) g = h;
          else {
            var O, N = I(h);
            for (O in g = N === Object.prototype ? {} : Object.create(N), Fe.set(h, g), h) _(h, O) && (g[O] = a(h[O]));
          }
          return g;
        }(s), Fe = null, s;
      }
      var Ue = {}.toString;
      function ot(s) {
        return Ue.call(s).slice(8, -1);
      }
      var vt = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", we = typeof vt == "symbol" ? function(s) {
        var a;
        return s != null && (a = s[vt]) && a.apply(s);
      } : function() {
        return null;
      };
      function He(s, a) {
        return a = s.indexOf(a), 0 <= a && s.splice(a, 1), 0 <= a;
      }
      var Ke = {};
      function It(s) {
        var a, h, g, b;
        if (arguments.length === 1) {
          if (l(s)) return s.slice();
          if (this === Ke && typeof s == "string") return [s];
          if (b = we(s)) {
            for (h = []; !(g = b.next()).done; ) h.push(g.value);
            return h;
          }
          if (s == null) return [s];
          if (typeof (a = s.length) != "number") return [s];
          for (h = new Array(a); a--; ) h[a] = s[a];
          return h;
        }
        for (a = arguments.length, h = new Array(a); a--; ) h[a] = arguments[a];
        return h;
      }
      var Ve = typeof Symbol < "u" ? function(s) {
        return s[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, _t = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], qr = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(_t), Xe = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function Ze(s, a) {
        this.name = s, this.message = a;
      }
      function wt(s, a) {
        return s + ". Errors: " + Object.keys(a).map(function(h) {
          return a[h].toString();
        }).filter(function(h, g, b) {
          return b.indexOf(h) === g;
        }).join(`
`);
      }
      function gt(s, a, h, g) {
        this.failures = a, this.failedKeys = g, this.successCount = h, this.message = wt(s, a);
      }
      function We(s, a) {
        this.name = "BulkError", this.failures = Object.keys(a).map(function(h) {
          return a[h];
        }), this.failuresByPos = a, this.message = wt(s, this.failures);
      }
      K(Ze).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), K(gt).from(Ze), K(We).from(Ze);
      var lt = qr.reduce(function(s, a) {
        return s[a] = a + "Error", s;
      }, {}), Pe = Ze, he = qr.reduce(function(s, a) {
        var h = a + "Error";
        function g(b, E) {
          this.name = h, b ? typeof b == "string" ? (this.message = "".concat(b).concat(E ? `
 ` + E : ""), this.inner = E || null) : typeof b == "object" && (this.message = "".concat(b.name, " ").concat(b.message), this.inner = b) : (this.message = Xe[a] || h, this.inner = null);
        }
        return K(g).from(Pe), s[a] = g, s;
      }, {});
      he.Syntax = SyntaxError, he.Type = TypeError, he.Range = RangeError;
      var Le = _t.reduce(function(s, a) {
        return s[a + "Error"] = he[a], s;
      }, {}), et = qr.reduce(function(s, a) {
        return ["Syntax", "Type", "Range"].indexOf(a) === -1 && (s[a + "Error"] = he[a]), s;
      }, {});
      function me() {
      }
      function je(s) {
        return s;
      }
      function yt(s, a) {
        return s == null || s === je ? a : function(h) {
          return a(s(h));
        };
      }
      function ht(s, a) {
        return function() {
          s.apply(this, arguments), a.apply(this, arguments);
        };
      }
      function ct(s, a) {
        return s === me ? a : function() {
          var h = s.apply(this, arguments);
          h !== void 0 && (arguments[0] = h);
          var g = this.onsuccess, b = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var E = a.apply(this, arguments);
          return g && (this.onsuccess = this.onsuccess ? ht(g, this.onsuccess) : g), b && (this.onerror = this.onerror ? ht(b, this.onerror) : b), E !== void 0 ? E : h;
        };
      }
      function st(s, a) {
        return s === me ? a : function() {
          s.apply(this, arguments);
          var h = this.onsuccess, g = this.onerror;
          this.onsuccess = this.onerror = null, a.apply(this, arguments), h && (this.onsuccess = this.onsuccess ? ht(h, this.onsuccess) : h), g && (this.onerror = this.onerror ? ht(g, this.onerror) : g);
        };
      }
      function qe(s, a) {
        return s === me ? a : function(h) {
          var g = s.apply(this, arguments);
          c(h, g);
          var b = this.onsuccess, E = this.onerror;
          return this.onsuccess = null, this.onerror = null, h = a.apply(this, arguments), b && (this.onsuccess = this.onsuccess ? ht(b, this.onsuccess) : b), E && (this.onerror = this.onerror ? ht(E, this.onerror) : E), g === void 0 ? h === void 0 ? void 0 : h : c(g, h);
        };
      }
      function Ot(s, a) {
        return s === me ? a : function() {
          return a.apply(this, arguments) !== !1 && s.apply(this, arguments);
        };
      }
      function Rt(s, a) {
        return s === me ? a : function() {
          var h = s.apply(this, arguments);
          if (h && typeof h.then == "function") {
            for (var g = this, b = arguments.length, E = new Array(b); b--; ) E[b] = arguments[b];
            return h.then(function() {
              return a.apply(g, E);
            });
          }
          return a.apply(this, arguments);
        };
      }
      et.ModifyError = gt, et.DexieError = Ze, et.BulkError = We;
      var Me = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function Qe(s) {
        Me = s;
      }
      var St = {}, Lt = 100, Qt = typeof Promise > "u" ? [] : function() {
        var s = Promise.resolve();
        if (typeof crypto > "u" || !crypto.subtle) return [s, I(s), s];
        var a = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [a, I(a), s];
      }(), _t = Qt[0], qr = Qt[1], Qt = Qt[2], qr = qr && qr.then, S = _t && _t.constructor, d = !!Qt, v = function(s, a) {
        w.push([s, a]), m && (queueMicrotask(Ee), m = !1);
      }, R = !0, m = !0, T = [], L = [], ue = je, B = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: me, pgp: !1, env: {}, finalize: me }, q = B, w = [], se = 0, Ne = [];
      function f(s) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var a = this._PSD = q;
        if (typeof s != "function") {
          if (s !== St) throw new TypeError("Not a function");
          return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && A(this, this._value));
        }
        this._state = null, this._value = null, ++a.ref, function h(g, b) {
          try {
            b(function(E) {
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
        var s = q, a = wn;
        function h(g, b) {
          var E = this, O = !s.global && (s !== q || a !== wn), N = O && !jt(), U = new f(function(j, W) {
            Z(E, new ie(gh(g, s, O, N), gh(b, s, O, N), j, W, s));
          });
          return this._consoleTask && (U._consoleTask = this._consoleTask), U;
        }
        return h.prototype = St, h;
      }, set: function(s) {
        D(this, "then", s && s.prototype === St ? te : { get: function() {
          return s;
        }, set: te.set });
      } };
      function ie(s, a, h, g, b) {
        this.onFulfilled = typeof s == "function" ? s : null, this.onRejected = typeof a == "function" ? a : null, this.resolve = h, this.reject = g, this.psd = b;
      }
      function A(s, a) {
        var h, g;
        L.push(a), s._state === null && (h = s._lib && xe(), a = ue(a), s._state = !1, s._value = a, g = s, T.some(function(b) {
          return b._value === g._value;
        }) || T.push(g), F(s), h && Je());
      }
      function F(s) {
        var a = s._listeners;
        s._listeners = [];
        for (var h = 0, g = a.length; h < g; ++h) Z(s, a[h]);
        var b = s._PSD;
        --b.ref || b.finalize(), se === 0 && (++se, v(function() {
          --se == 0 && Rr();
        }, []));
      }
      function Z(s, a) {
        if (s._state !== null) {
          var h = s._state ? a.onFulfilled : a.onRejected;
          if (h === null) return (s._state ? a.resolve : a.reject)(s._value);
          ++a.psd.ref, ++se, v(Oe, [h, s, a]);
        } else s._listeners.push(a);
      }
      function Oe(s, a, h) {
        try {
          var g, b = a._value;
          !a._state && L.length && (L = []), g = Me && a._consoleTask ? a._consoleTask.run(function() {
            return s(b);
          }) : s(b), a._state || L.indexOf(b) !== -1 || function(E) {
            for (var O = T.length; O; ) if (T[--O]._value === E._value) return T.splice(O, 1);
          }(a), h.resolve(g);
        } catch (E) {
          h.reject(E);
        } finally {
          --se == 0 && Rr(), --h.psd.ref || h.psd.finalize();
        }
      }
      function Ee() {
        Ai(B, function() {
          xe() && Je();
        });
      }
      function xe() {
        var s = R;
        return m = R = !1, s;
      }
      function Je() {
        var s, a, h;
        do
          for (; 0 < w.length; ) for (s = w, w = [], h = s.length, a = 0; a < h; ++a) {
            var g = s[a];
            g[0].apply(null, g[1]);
          }
        while (0 < w.length);
        m = R = !0;
      }
      function Rr() {
        var s = T;
        T = [], s.forEach(function(g) {
          g._PSD.onunhandled.call(null, g._value, g);
        });
        for (var a = Ne.slice(0), h = a.length; h; ) a[--h]();
      }
      function bt(s) {
        return new f(St, !1, s);
      }
      function Te(s, a) {
        var h = q;
        return function() {
          var g = xe(), b = q;
          try {
            return Mn(h, !0), s.apply(this, arguments);
          } catch (E) {
            a && a(E);
          } finally {
            Mn(b, !1), g && Je();
          }
        };
      }
      x(f.prototype, { then: te, _then: function(s, a) {
        Z(this, new ie(null, null, s, a, q));
      }, catch: function(s) {
        if (arguments.length === 1) return this.then(null, s);
        var a = s, h = arguments[1];
        return typeof a == "function" ? this.then(null, function(g) {
          return (g instanceof a ? h : bt)(g);
        }) : this.then(null, function(g) {
          return (g && g.name === a ? h : bt)(g);
        });
      }, finally: function(s) {
        return this.then(function(a) {
          return f.resolve(s()).then(function() {
            return a;
          });
        }, function(a) {
          return f.resolve(s()).then(function() {
            return bt(a);
          });
        });
      }, timeout: function(s, a) {
        var h = this;
        return s < 1 / 0 ? new f(function(g, b) {
          var E = setTimeout(function() {
            return b(new he.Timeout(a));
          }, s);
          h.then(g, b).finally(clearTimeout.bind(null, E));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && D(f.prototype, Symbol.toStringTag, "Dexie.Promise"), B.env = vh(), x(f, { all: function() {
        var s = It.apply(null, arguments).map(cr);
        return new f(function(a, h) {
          s.length === 0 && a([]);
          var g = s.length;
          s.forEach(function(b, E) {
            return f.resolve(b).then(function(O) {
              s[E] = O, --g || a(s);
            }, h);
          });
        });
      }, resolve: function(s) {
        return s instanceof f ? s : s && typeof s.then == "function" ? new f(function(a, h) {
          s.then(a, h);
        }) : new f(St, !0, s);
      }, reject: bt, race: function() {
        var s = It.apply(null, arguments).map(cr);
        return new f(function(a, h) {
          s.map(function(g) {
            return f.resolve(g).then(a, h);
          });
        });
      }, PSD: { get: function() {
        return q;
      }, set: function(s) {
        return q = s;
      } }, totalEchoes: { get: function() {
        return wn;
      } }, newPSD: Pt, usePSD: Ai, scheduler: { get: function() {
        return v;
      }, set: function(s) {
        v = s;
      } }, rejectionMapper: { get: function() {
        return ue;
      }, set: function(s) {
        ue = s;
      } }, follow: function(s, a) {
        return new f(function(h, g) {
          return Pt(function(b, E) {
            var O = q;
            O.unhandleds = [], O.onunhandled = E, O.finalize = ht(function() {
              var N, U = this;
              N = function() {
                U.unhandleds.length === 0 ? b() : E(U.unhandleds[0]);
              }, Ne.push(function j() {
                N(), Ne.splice(Ne.indexOf(j), 1);
              }), ++se, v(function() {
                --se == 0 && Rr();
              }, []);
            }, O.finalize), s();
          }, a, h, g);
        });
      } }), S && (S.allSettled && D(f, "allSettled", function() {
        var s = It.apply(null, arguments).map(cr);
        return new f(function(a) {
          s.length === 0 && a([]);
          var h = s.length, g = new Array(h);
          s.forEach(function(b, E) {
            return f.resolve(b).then(function(O) {
              return g[E] = { status: "fulfilled", value: O };
            }, function(O) {
              return g[E] = { status: "rejected", reason: O };
            }).then(function() {
              return --h || a(g);
            });
          });
        });
      }), S.any && typeof AggregateError < "u" && D(f, "any", function() {
        var s = It.apply(null, arguments).map(cr);
        return new f(function(a, h) {
          s.length === 0 && h(new AggregateError([]));
          var g = s.length, b = new Array(g);
          s.forEach(function(E, O) {
            return f.resolve(E).then(function(N) {
              return a(N);
            }, function(N) {
              b[O] = N, --g || h(new AggregateError(b));
            });
          });
        });
      }), S.withResolvers && (f.withResolvers = S.withResolvers));
      var tt = { awaits: 0, echoes: 0, id: 0 }, $t = 0, Mt = [], _n = 0, wn = 0, Tt = 0;
      function Pt(s, a, h, g) {
        var b = q, E = Object.create(b);
        return E.parent = b, E.ref = 0, E.global = !1, E.id = ++Tt, B.env, E.env = d ? { Promise: f, PromiseProp: { value: f, configurable: !0, writable: !0 }, all: f.all, race: f.race, allSettled: f.allSettled, any: f.any, resolve: f.resolve, reject: f.reject } : {}, a && c(E, a), ++b.ref, E.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, g = Ai(E, s, h, g), E.ref === 0 && E.finalize(), g;
      }
      function At() {
        return tt.id || (tt.id = ++$t), ++tt.awaits, tt.echoes += Lt, tt.id;
      }
      function jt() {
        return !!tt.awaits && (--tt.awaits == 0 && (tt.id = 0), tt.echoes = tt.awaits * Lt, !0);
      }
      function cr(s) {
        return tt.echoes && s && s.constructor === S ? (At(), s.then(function(a) {
          return jt(), a;
        }, function(a) {
          return jt(), Dt(a);
        })) : s;
      }
      function oa() {
        var s = Mt[Mt.length - 1];
        Mt.pop(), Mn(s, !1);
      }
      function Mn(s, a) {
        var h, g = q;
        (a ? !tt.echoes || _n++ && s === q : !_n || --_n && s === q) || queueMicrotask(a ? (function(b) {
          ++wn, tt.echoes && --tt.echoes != 0 || (tt.echoes = tt.awaits = tt.id = 0), Mt.push(q), Mn(b, !0);
        }).bind(null, s) : oa), s !== q && (q = s, g === B && (B.env = vh()), d && (h = B.env.Promise, a = s.env, (g.global || s.global) && (Object.defineProperty(o, "Promise", a.PromiseProp), h.all = a.all, h.race = a.race, h.resolve = a.resolve, h.reject = a.reject, a.allSettled && (h.allSettled = a.allSettled), a.any && (h.any = a.any))));
      }
      function vh() {
        var s = o.Promise;
        return d ? { Promise: s, PromiseProp: Object.getOwnPropertyDescriptor(o, "Promise"), all: s.all, race: s.race, allSettled: s.allSettled, any: s.any, resolve: s.resolve, reject: s.reject } : {};
      }
      function Ai(s, a, h, g, b) {
        var E = q;
        try {
          return Mn(s, !0), a(h, g, b);
        } finally {
          Mn(E, !1);
        }
      }
      function gh(s, a, h, g) {
        return typeof s != "function" ? s : function() {
          var b = q;
          h && At(), Mn(a, !0);
          try {
            return s.apply(this, arguments);
          } finally {
            Mn(b, !1), g && queueMicrotask(jt);
          }
        };
      }
      function du(s) {
        Promise === S && tt.echoes === 0 ? _n === 0 ? s() : enqueueNativeMicroTask(s) : setTimeout(s, 0);
      }
      ("" + qr).indexOf("[native code]") === -1 && (At = jt = me);
      var Dt = f.reject, ki = "￿", xn = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", yh = "String expected.", ws = [], aa = "__dbnames", vu = "readonly", gu = "readwrite";
      function Oi(s, a) {
        return s ? a ? function() {
          return s.apply(this, arguments) && a.apply(this, arguments);
        } : s : a;
      }
      var mh = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function ua(s) {
        return typeof s != "string" || /\./.test(s) ? function(a) {
          return a;
        } : function(a) {
          return a[s] === void 0 && s in a && delete (a = Se(a))[s], a;
        };
      }
      function Ih() {
        throw he.Type();
      }
      function at(s, a) {
        try {
          var h = bh(s), g = bh(a);
          if (h !== g) return h === "Array" ? 1 : g === "Array" ? -1 : h === "binary" ? 1 : g === "binary" ? -1 : h === "string" ? 1 : g === "string" ? -1 : h === "Date" ? 1 : g !== "Date" ? NaN : -1;
          switch (h) {
            case "number":
            case "Date":
            case "string":
              return a < s ? 1 : s < a ? -1 : 0;
            case "binary":
              return function(b, E) {
                for (var O = b.length, N = E.length, U = O < N ? O : N, j = 0; j < U; ++j) if (b[j] !== E[j]) return b[j] < E[j] ? -1 : 1;
                return O === N ? 0 : O < N ? -1 : 1;
              }(_h(s), _h(a));
            case "Array":
              return function(b, E) {
                for (var O = b.length, N = E.length, U = O < N ? O : N, j = 0; j < U; ++j) {
                  var W = at(b[j], E[j]);
                  if (W !== 0) return W;
                }
                return O === N ? 0 : O < N ? -1 : 1;
              }(s, a);
          }
        } catch {
        }
        return NaN;
      }
      function bh(s) {
        var a = typeof s;
        return a != "object" ? a : ArrayBuffer.isView(s) ? "binary" : (s = ot(s), s === "ArrayBuffer" ? "binary" : s);
      }
      function _h(s) {
        return s instanceof Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : new Uint8Array(s);
      }
      var wh = (xt.prototype._trans = function(s, a, h) {
        var g = this._tx || q.trans, b = this.name, E = Me && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(s === "readonly" ? "read" : "write", " ").concat(this.name));
        function O(j, W, P) {
          if (!P.schema[b]) throw new he.NotFound("Table " + b + " not part of transaction");
          return a(P.idbtrans, P);
        }
        var N = xe();
        try {
          var U = g && g.db._novip === this.db._novip ? g === q.trans ? g._promise(s, O, h) : Pt(function() {
            return g._promise(s, O, h);
          }, { trans: g, transless: q.transless || q }) : function j(W, P, V, $) {
            if (W.idbdb && (W._state.openComplete || q.letThrough || W._vip)) {
              var H = W._createTransaction(P, V, W._dbSchema);
              try {
                H.create(), W._state.PR1398_maxLoop = 3;
              } catch (Y) {
                return Y.name === lt.InvalidState && W.isOpen() && 0 < --W._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), W.close({ disableAutoOpen: !1 }), W.open().then(function() {
                  return j(W, P, V, $);
                })) : Dt(Y);
              }
              return H._promise(P, function(Y, z) {
                return Pt(function() {
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
            if (W._state.openComplete) return Dt(new he.DatabaseClosed(W._state.dbOpenError));
            if (!W._state.isBeingOpened) {
              if (!W._state.autoOpen) return Dt(new he.DatabaseClosed());
              W.open().catch(me);
            }
            return W._state.dbReadyPromise.then(function() {
              return j(W, P, V, $);
            });
          }(this.db, s, [this.name], O);
          return E && (U._consoleTask = E, U = U.catch(function(j) {
            return console.trace(j), Dt(j);
          })), U;
        } finally {
          N && Je();
        }
      }, xt.prototype.get = function(s, a) {
        var h = this;
        return s && s.constructor === Object ? this.where(s).first(a) : s == null ? Dt(new he.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(g) {
          return h.core.get({ trans: g, key: s }).then(function(b) {
            return h.hook.reading.fire(b);
          });
        }).then(a);
      }, xt.prototype.where = function(s) {
        if (typeof s == "string") return new this.db.WhereClause(this, s);
        if (l(s)) return new this.db.WhereClause(this, "[".concat(s.join("+"), "]"));
        var a = u(s);
        if (a.length === 1) return this.where(a[0]).equals(s[a[0]]);
        var h = this.schema.indexes.concat(this.schema.primKey).filter(function(N) {
          if (N.compound && a.every(function(j) {
            return 0 <= N.keyPath.indexOf(j);
          })) {
            for (var U = 0; U < a.length; ++U) if (a.indexOf(N.keyPath[U]) === -1) return !1;
            return !0;
          }
          return !1;
        }).sort(function(N, U) {
          return N.keyPath.length - U.keyPath.length;
        })[0];
        if (h && this.db._maxKey !== ki) {
          var E = h.keyPath.slice(0, a.length);
          return this.where(E).equals(E.map(function(U) {
            return s[U];
          }));
        }
        !h && Me && console.warn("The query ".concat(JSON.stringify(s), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(a.join("+"), "]"));
        var g = this.schema.idxByName;
        function b(N, U) {
          return at(N, U) === 0;
        }
        var O = a.reduce(function(P, U) {
          var j = P[0], W = P[1], P = g[U], V = s[U];
          return [j || P, j || !P ? Oi(W, P && P.multi ? function($) {
            return $ = fe($, U), l($) && $.some(function(H) {
              return b(V, H);
            });
          } : function($) {
            return b(V, fe($, U));
          }) : W];
        }, [null, null]), E = O[0], O = O[1];
        return E ? this.where(E.name).equals(s[E.keyPath]).filter(O) : h ? this.filter(O) : this.where(a).equals("");
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
        var a, h = this.db, g = this.name;
        function b() {
          return a !== null && a.apply(this, arguments) || this;
        }
        (this.schema.mappedClass = s).prototype instanceof Ih && (function(U, j) {
          if (typeof j != "function" && j !== null) throw new TypeError("Class extends value " + String(j) + " is not a constructor or null");
          function W() {
            this.constructor = U;
          }
          t(U, j), U.prototype = j === null ? Object.create(j) : (W.prototype = j.prototype, new W());
        }(b, a = s), Object.defineProperty(b.prototype, "db", { get: function() {
          return h;
        }, enumerable: !1, configurable: !0 }), b.prototype.table = function() {
          return g;
        }, s = b);
        for (var E = /* @__PURE__ */ new Set(), O = s.prototype; O; O = I(O)) Object.getOwnPropertyNames(O).forEach(function(U) {
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
      }, xt.prototype.add = function(s, a) {
        var h = this, g = this.schema.primKey, b = g.auto, E = g.keyPath, O = s;
        return E && b && (O = ua(E)(s)), this._trans("readwrite", function(N) {
          return h.core.mutate({ trans: N, type: "add", keys: a != null ? [a] : null, values: [O] });
        }).then(function(N) {
          return N.numFailures ? f.reject(N.failures[0]) : N.lastResult;
        }).then(function(N) {
          if (E) try {
            oe(s, E, N);
          } catch {
          }
          return N;
        });
      }, xt.prototype.update = function(s, a) {
        return typeof s != "object" || l(s) ? this.where(":id").equals(s).modify(a) : (s = fe(s, this.schema.primKey.keyPath), s === void 0 ? Dt(new he.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(s).modify(a));
      }, xt.prototype.put = function(s, a) {
        var h = this, g = this.schema.primKey, b = g.auto, E = g.keyPath, O = s;
        return E && b && (O = ua(E)(s)), this._trans("readwrite", function(N) {
          return h.core.mutate({ trans: N, type: "put", values: [O], keys: a != null ? [a] : null });
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
        var a = this;
        return this._trans("readwrite", function(h) {
          return a.core.mutate({ trans: h, type: "delete", keys: [s] });
        }).then(function(h) {
          return h.numFailures ? f.reject(h.failures[0]) : void 0;
        });
      }, xt.prototype.clear = function() {
        var s = this;
        return this._trans("readwrite", function(a) {
          return s.core.mutate({ trans: a, type: "deleteRange", range: mh });
        }).then(function(a) {
          return a.numFailures ? f.reject(a.failures[0]) : void 0;
        });
      }, xt.prototype.bulkGet = function(s) {
        var a = this;
        return this._trans("readonly", function(h) {
          return a.core.getMany({ keys: s, trans: h }).then(function(g) {
            return g.map(function(b) {
              return a.hook.reading.fire(b);
            });
          });
        });
      }, xt.prototype.bulkAdd = function(s, a, h) {
        var g = this, b = Array.isArray(a) ? a : void 0, E = (h = h || (b ? void 0 : a)) ? h.allKeys : void 0;
        return this._trans("readwrite", function(O) {
          var j = g.schema.primKey, N = j.auto, j = j.keyPath;
          if (j && b) throw new he.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (b && b.length !== s.length) throw new he.InvalidArgument("Arguments objects and keys must have the same length");
          var U = s.length, j = j && N ? s.map(ua(j)) : s;
          return g.core.mutate({ trans: O, type: "add", keys: b, values: j, wantResults: E }).then(function(H) {
            var P = H.numFailures, V = H.results, $ = H.lastResult, H = H.failures;
            if (P === 0) return E ? V : $;
            throw new We("".concat(g.name, ".bulkAdd(): ").concat(P, " of ").concat(U, " operations failed"), H);
          });
        });
      }, xt.prototype.bulkPut = function(s, a, h) {
        var g = this, b = Array.isArray(a) ? a : void 0, E = (h = h || (b ? void 0 : a)) ? h.allKeys : void 0;
        return this._trans("readwrite", function(O) {
          var j = g.schema.primKey, N = j.auto, j = j.keyPath;
          if (j && b) throw new he.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (b && b.length !== s.length) throw new he.InvalidArgument("Arguments objects and keys must have the same length");
          var U = s.length, j = j && N ? s.map(ua(j)) : s;
          return g.core.mutate({ trans: O, type: "put", keys: b, values: j, wantResults: E }).then(function(H) {
            var P = H.numFailures, V = H.results, $ = H.lastResult, H = H.failures;
            if (P === 0) return E ? V : $;
            throw new We("".concat(g.name, ".bulkPut(): ").concat(P, " of ").concat(U, " operations failed"), H);
          });
        });
      }, xt.prototype.bulkUpdate = function(s) {
        var a = this, h = this.core, g = s.map(function(O) {
          return O.key;
        }), b = s.map(function(O) {
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
                  if (re === a.schema.primKey.keyPath) {
                    if (at(ne, $) !== 0) throw new he.Constraint("Cannot update primary key in bulkUpdate()");
                  } else oe(Y, re, ne);
                }
                E.push(V), U.push($), j.push(Y);
              }
            });
            var W = U.length;
            return h.mutate({ trans: O, type: "put", keys: U, values: j, updates: { keys: g, changeSpecs: b } }).then(function(P) {
              var V = P.numFailures, $ = P.failures;
              if (V === 0) return W;
              for (var H = 0, Y = Object.keys($); H < Y.length; H++) {
                var z, Q = Y[H], re = E[Number(Q)];
                re != null && (z = $[Q], delete $[Q], $[re] = z);
              }
              throw new We("".concat(a.name, ".bulkUpdate(): ").concat(V, " of ").concat(W, " operations failed"), $);
            });
          });
        });
      }, xt.prototype.bulkDelete = function(s) {
        var a = this, h = s.length;
        return this._trans("readwrite", function(g) {
          return a.core.mutate({ trans: g, type: "delete", keys: s });
        }).then(function(O) {
          var b = O.numFailures, E = O.lastResult, O = O.failures;
          if (b === 0) return E;
          throw new We("".concat(a.name, ".bulkDelete(): ").concat(b, " of ").concat(h, " operations failed"), O);
        });
      }, xt);
      function xt() {
      }
      function bo(s) {
        function a(O, N) {
          if (N) {
            for (var U = arguments.length, j = new Array(U - 1); --U; ) j[U - 1] = arguments[U];
            return h[O].subscribe.apply(null, j), s;
          }
          if (typeof O == "string") return h[O];
        }
        var h = {};
        a.addEventType = E;
        for (var g = 1, b = arguments.length; g < b; ++g) E(arguments[g]);
        return a;
        function E(O, N, U) {
          if (typeof O != "object") {
            var j;
            N = N || Ot;
            var W = { subscribers: [], fire: U = U || me, subscribe: function(P) {
              W.subscribers.indexOf(P) === -1 && (W.subscribers.push(P), W.fire = N(W.fire, P));
            }, unsubscribe: function(P) {
              W.subscribers = W.subscribers.filter(function(V) {
                return V !== P;
              }), W.fire = W.subscribers.reduce(N, U);
            } };
            return h[O] = a[O] = W;
          }
          u(j = O).forEach(function(P) {
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
      function _o(s, a) {
        return K(a).from({ prototype: s }), a;
      }
      function xs(s, a) {
        return !(s.filter || s.algorithm || s.or) && (a ? s.justLimit : !s.replayFilter);
      }
      function yu(s, a) {
        s.filter = Oi(s.filter, a);
      }
      function mu(s, a, h) {
        var g = s.replayFilter;
        s.replayFilter = g ? function() {
          return Oi(g(), a());
        } : a, s.justLimit = h && !g;
      }
      function la(s, a) {
        if (s.isPrimKey) return a.primaryKey;
        var h = a.getIndexByKeyPath(s.index);
        if (!h) throw new he.Schema("KeyPath " + s.index + " on object store " + a.name + " is not indexed");
        return h;
      }
      function xh(s, a, h) {
        var g = la(s, a.schema);
        return a.openCursor({ trans: h, values: !s.keysOnly, reverse: s.dir === "prev", unique: !!s.unique, query: { index: g, range: s.range } });
      }
      function ca(s, a, h, g) {
        var b = s.replayFilter ? Oi(s.filter, s.replayFilter()) : s.filter;
        if (s.or) {
          var E = {}, O = function(N, U, j) {
            var W, P;
            b && !b(U, j, function(V) {
              return U.stop(V);
            }, function(V) {
              return U.fail(V);
            }) || ((P = "" + (W = U.primaryKey)) == "[object ArrayBuffer]" && (P = "" + new Uint8Array(W)), _(E, P) || (E[P] = !0, a(N, U, j)));
          };
          return Promise.all([s.or._iterate(O, h), Eh(xh(s, g, h), s.algorithm, O, !s.keysOnly && s.valueMapper)]);
        }
        return Eh(xh(s, g, h), Oi(s.algorithm, b), a, !s.keysOnly && s.valueMapper);
      }
      function Eh(s, a, h, g) {
        var b = Te(g ? function(E, O, N) {
          return h(g(E), O, N);
        } : h);
        return s.then(function(E) {
          if (E) return E.start(function() {
            var O = function() {
              return E.continue();
            };
            a && !a(E, function(N) {
              return O = N;
            }, function(N) {
              E.stop(N), O = me;
            }, function(N) {
              E.fail(N), O = me;
            }) || b(E.value, E, function(N) {
              return O = N;
            }), O();
          });
        });
      }
      var wo = (Sh.prototype.execute = function(s) {
        var a = this["@@propmod"];
        if (a.add !== void 0) {
          var h = a.add;
          if (l(h)) return i(i([], l(s) ? s : [], !0), h).sort();
          if (typeof h == "number") return (Number(s) || 0) + h;
          if (typeof h == "bigint") try {
            return BigInt(s) + h;
          } catch {
            return BigInt(0) + h;
          }
          throw new TypeError("Invalid term ".concat(h));
        }
        if (a.remove !== void 0) {
          var g = a.remove;
          if (l(g)) return l(s) ? s.filter(function(b) {
            return !g.includes(b);
          }).sort() : [];
          if (typeof g == "number") return Number(s) - g;
          if (typeof g == "bigint") try {
            return BigInt(s) - g;
          } catch {
            return BigInt(0) - g;
          }
          throw new TypeError("Invalid subtrahend ".concat(g));
        }
        return h = (h = a.replacePrefix) === null || h === void 0 ? void 0 : h[0], h && typeof s == "string" && s.startsWith(h) ? a.replacePrefix[1] + s.substring(h.length) : s;
      }, Sh);
      function Sh(s) {
        this["@@propmod"] = s;
      }
      var Y0 = (ft.prototype._read = function(s, a) {
        var h = this._ctx;
        return h.error ? h.table._trans(null, Dt.bind(null, h.error)) : h.table._trans("readonly", s).then(a);
      }, ft.prototype._write = function(s) {
        var a = this._ctx;
        return a.error ? a.table._trans(null, Dt.bind(null, a.error)) : a.table._trans("readwrite", s, "locked");
      }, ft.prototype._addAlgorithm = function(s) {
        var a = this._ctx;
        a.algorithm = Oi(a.algorithm, s);
      }, ft.prototype._iterate = function(s, a) {
        return ca(this._ctx, s, a, this._ctx.table.core);
      }, ft.prototype.clone = function(s) {
        var a = Object.create(this.constructor.prototype), h = Object.create(this._ctx);
        return s && c(h, s), a._ctx = h, a;
      }, ft.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, ft.prototype.each = function(s) {
        var a = this._ctx;
        return this._read(function(h) {
          return ca(a, s, h, a.table.core);
        });
      }, ft.prototype.count = function(s) {
        var a = this;
        return this._read(function(h) {
          var g = a._ctx, b = g.table.core;
          if (xs(g, !0)) return b.count({ trans: h, query: { index: la(g, b.schema), range: g.range } }).then(function(O) {
            return Math.min(O, g.limit);
          });
          var E = 0;
          return ca(g, function() {
            return ++E, !1;
          }, h, b).then(function() {
            return E;
          });
        }).then(s);
      }, ft.prototype.sortBy = function(s, a) {
        var h = s.split(".").reverse(), g = h[0], b = h.length - 1;
        function E(U, j) {
          return j ? E(U[h[j]], j - 1) : U[g];
        }
        var O = this._ctx.dir === "next" ? 1 : -1;
        function N(U, j) {
          return at(E(U, b), E(j, b)) * O;
        }
        return this.toArray(function(U) {
          return U.sort(N);
        }).then(a);
      }, ft.prototype.toArray = function(s) {
        var a = this;
        return this._read(function(h) {
          var g = a._ctx;
          if (g.dir === "next" && xs(g, !0) && 0 < g.limit) {
            var b = g.valueMapper, E = la(g, g.table.core.schema);
            return g.table.core.query({ trans: h, limit: g.limit, values: !0, query: { index: E, range: g.range } }).then(function(N) {
              return N = N.result, b ? N.map(b) : N;
            });
          }
          var O = [];
          return ca(g, function(N) {
            return O.push(N);
          }, h, g.table.core).then(function() {
            return O;
          });
        }, s);
      }, ft.prototype.offset = function(s) {
        var a = this._ctx;
        return s <= 0 || (a.offset += s, xs(a) ? mu(a, function() {
          var h = s;
          return function(g, b) {
            return h === 0 || (h === 1 ? --h : b(function() {
              g.advance(h), h = 0;
            }), !1);
          };
        }) : mu(a, function() {
          var h = s;
          return function() {
            return --h < 0;
          };
        })), this;
      }, ft.prototype.limit = function(s) {
        return this._ctx.limit = Math.min(this._ctx.limit, s), mu(this._ctx, function() {
          var a = s;
          return function(h, g, b) {
            return --a <= 0 && g(b), 0 <= a;
          };
        }, !0), this;
      }, ft.prototype.until = function(s, a) {
        return yu(this._ctx, function(h, g, b) {
          return !s(h.value) || (g(b), a);
        }), this;
      }, ft.prototype.first = function(s) {
        return this.limit(1).toArray(function(a) {
          return a[0];
        }).then(s);
      }, ft.prototype.last = function(s) {
        return this.reverse().first(s);
      }, ft.prototype.filter = function(s) {
        var a;
        return yu(this._ctx, function(h) {
          return s(h.value);
        }), (a = this._ctx).isMatch = Oi(a.isMatch, s), this;
      }, ft.prototype.and = function(s) {
        return this.filter(s);
      }, ft.prototype.or = function(s) {
        return new this.db.WhereClause(this._ctx.table, s, this);
      }, ft.prototype.reverse = function() {
        return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
      }, ft.prototype.desc = function() {
        return this.reverse();
      }, ft.prototype.eachKey = function(s) {
        var a = this._ctx;
        return a.keysOnly = !a.isMatch, this.each(function(h, g) {
          s(g.key, g);
        });
      }, ft.prototype.eachUniqueKey = function(s) {
        return this._ctx.unique = "unique", this.eachKey(s);
      }, ft.prototype.eachPrimaryKey = function(s) {
        var a = this._ctx;
        return a.keysOnly = !a.isMatch, this.each(function(h, g) {
          s(g.primaryKey, g);
        });
      }, ft.prototype.keys = function(s) {
        var a = this._ctx;
        a.keysOnly = !a.isMatch;
        var h = [];
        return this.each(function(g, b) {
          h.push(b.key);
        }).then(function() {
          return h;
        }).then(s);
      }, ft.prototype.primaryKeys = function(s) {
        var a = this._ctx;
        if (a.dir === "next" && xs(a, !0) && 0 < a.limit) return this._read(function(g) {
          var b = la(a, a.table.core.schema);
          return a.table.core.query({ trans: g, values: !1, limit: a.limit, query: { index: b, range: a.range } });
        }).then(function(g) {
          return g.result;
        }).then(s);
        a.keysOnly = !a.isMatch;
        var h = [];
        return this.each(function(g, b) {
          h.push(b.primaryKey);
        }).then(function() {
          return h;
        }).then(s);
      }, ft.prototype.uniqueKeys = function(s) {
        return this._ctx.unique = "unique", this.keys(s);
      }, ft.prototype.firstKey = function(s) {
        return this.limit(1).keys(function(a) {
          return a[0];
        }).then(s);
      }, ft.prototype.lastKey = function(s) {
        return this.reverse().firstKey(s);
      }, ft.prototype.distinct = function() {
        var s = this._ctx, s = s.index && s.table.schema.idxByName[s.index];
        if (!s || !s.multi) return this;
        var a = {};
        return yu(this._ctx, function(b) {
          var g = b.primaryKey.toString(), b = _(a, g);
          return a[g] = !0, !b;
        }), this;
      }, ft.prototype.modify = function(s) {
        var a = this, h = this._ctx;
        return this._write(function(g) {
          var b, E, O;
          O = typeof s == "function" ? s : (b = u(s), E = b.length, function(z) {
            for (var Q = !1, re = 0; re < E; ++re) {
              var ne = b[re], ae = s[ne], pe = fe(z, ne);
              ae instanceof wo ? (oe(z, ne, ae.execute(pe)), Q = !0) : pe !== ae && (oe(z, ne, ae), Q = !0);
            }
            return Q;
          });
          var N = h.table.core, P = N.schema.primaryKey, U = P.outbound, j = P.extractKey, W = 200, P = a.db._options.modifyChunkSize;
          P && (W = typeof P == "object" ? P[N.name] || P["*"] || 200 : P);
          function V(z, ne) {
            var re = ne.failures, ne = ne.numFailures;
            H += z - ne;
            for (var ae = 0, pe = u(re); ae < pe.length; ae++) {
              var be = pe[ae];
              $.push(re[be]);
            }
          }
          var $ = [], H = 0, Y = [];
          return a.clone().primaryKeys().then(function(z) {
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
                  return (0 < _e.length || re && s === Iu) && N.mutate({ trans: g, type: "delete", keys: _e, criteria: re, isAdditionalChunk: 0 < ne }).then(function(rt) {
                    return V(_e.length, rt);
                  });
                }).then(function() {
                  return z.length > ne + ae && Q(ne + W);
                });
              });
            }
            var re = xs(h) && h.limit === 1 / 0 && (typeof s != "function" || s === Iu) && { index: h.index, range: h.range };
            return Q(0).then(function() {
              if (0 < $.length) throw new gt("Error modifying one or more objects", $, H, Y);
              return z.length;
            });
          });
        });
      }, ft.prototype.delete = function() {
        var s = this._ctx, a = s.range;
        return xs(s) && (s.isPrimKey || a.type === 3) ? this._write(function(h) {
          var g = s.table.core.schema.primaryKey, b = a;
          return s.table.core.count({ trans: h, query: { index: g, range: b } }).then(function(E) {
            return s.table.core.mutate({ trans: h, type: "deleteRange", range: b }).then(function(O) {
              var N = O.failures;
              if (O.lastResult, O.results, O = O.numFailures, O) throw new gt("Could not delete some values", Object.keys(N).map(function(U) {
                return N[U];
              }), E - O);
              return E - O;
            });
          });
        }) : this.modify(Iu);
      }, ft);
      function ft() {
      }
      var Iu = function(s, a) {
        return a.value = null;
      };
      function V0(s, a) {
        return s < a ? -1 : s === a ? 0 : 1;
      }
      function J0(s, a) {
        return a < s ? -1 : s === a ? 0 : 1;
      }
      function Tr(s, a, h) {
        return s = s instanceof kh ? new s.Collection(s) : s, s._ctx.error = new (h || TypeError)(a), s;
      }
      function Es(s) {
        return new s.Collection(s, function() {
          return Ah("");
        }).limit(0);
      }
      function fa(s, a, h, g) {
        var b, E, O, N, U, j, W, P = h.length;
        if (!h.every(function(H) {
          return typeof H == "string";
        })) return Tr(s, yh);
        function V(H) {
          b = H === "next" ? function(z) {
            return z.toUpperCase();
          } : function(z) {
            return z.toLowerCase();
          }, E = H === "next" ? function(z) {
            return z.toLowerCase();
          } : function(z) {
            return z.toUpperCase();
          }, O = H === "next" ? V0 : J0;
          var Y = h.map(function(z) {
            return { lower: E(z), upper: b(z) };
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
          return Un(N[0], U[P - 1] + g);
        }), s._ondirectionchange = function(H) {
          V(H);
        };
        var $ = 0;
        return s._addAlgorithm(function(H, Y, z) {
          var Q = H.key;
          if (typeof Q != "string") return !1;
          var re = E(Q);
          if (a(re, U, $)) return !0;
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
      function Un(s, a, h, g) {
        return { type: 2, lower: s, upper: a, lowerOpen: h, upperOpen: g };
      }
      function Ah(s) {
        return { type: 1, lower: s, upper: s };
      }
      var kh = (Object.defineProperty(Kt.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), Kt.prototype.between = function(s, a, h, g) {
        h = h !== !1, g = g === !0;
        try {
          return 0 < this._cmp(s, a) || this._cmp(s, a) === 0 && (h || g) && (!h || !g) ? Es(this) : new this.Collection(this, function() {
            return Un(s, a, !h, !g);
          });
        } catch {
          return Tr(this, xn);
        }
      }, Kt.prototype.equals = function(s) {
        return s == null ? Tr(this, xn) : new this.Collection(this, function() {
          return Ah(s);
        });
      }, Kt.prototype.above = function(s) {
        return s == null ? Tr(this, xn) : new this.Collection(this, function() {
          return Un(s, void 0, !0);
        });
      }, Kt.prototype.aboveOrEqual = function(s) {
        return s == null ? Tr(this, xn) : new this.Collection(this, function() {
          return Un(s, void 0, !1);
        });
      }, Kt.prototype.below = function(s) {
        return s == null ? Tr(this, xn) : new this.Collection(this, function() {
          return Un(void 0, s, !1, !0);
        });
      }, Kt.prototype.belowOrEqual = function(s) {
        return s == null ? Tr(this, xn) : new this.Collection(this, function() {
          return Un(void 0, s);
        });
      }, Kt.prototype.startsWith = function(s) {
        return typeof s != "string" ? Tr(this, yh) : this.between(s, s + ki, !0, !0);
      }, Kt.prototype.startsWithIgnoreCase = function(s) {
        return s === "" ? this.startsWith(s) : fa(this, function(a, h) {
          return a.indexOf(h[0]) === 0;
        }, [s], ki);
      }, Kt.prototype.equalsIgnoreCase = function(s) {
        return fa(this, function(a, h) {
          return a === h[0];
        }, [s], "");
      }, Kt.prototype.anyOfIgnoreCase = function() {
        var s = It.apply(Ke, arguments);
        return s.length === 0 ? Es(this) : fa(this, function(a, h) {
          return h.indexOf(a) !== -1;
        }, s, "");
      }, Kt.prototype.startsWithAnyOfIgnoreCase = function() {
        var s = It.apply(Ke, arguments);
        return s.length === 0 ? Es(this) : fa(this, function(a, h) {
          return h.some(function(g) {
            return a.indexOf(g) === 0;
          });
        }, s, ki);
      }, Kt.prototype.anyOf = function() {
        var s = this, a = It.apply(Ke, arguments), h = this._cmp;
        try {
          a.sort(h);
        } catch {
          return Tr(this, xn);
        }
        if (a.length === 0) return Es(this);
        var g = new this.Collection(this, function() {
          return Un(a[0], a[a.length - 1]);
        });
        g._ondirectionchange = function(E) {
          h = E === "next" ? s._ascending : s._descending, a.sort(h);
        };
        var b = 0;
        return g._addAlgorithm(function(E, O, N) {
          for (var U = E.key; 0 < h(U, a[b]); ) if (++b === a.length) return O(N), !1;
          return h(U, a[b]) === 0 || (O(function() {
            E.continue(a[b]);
          }), !1);
        }), g;
      }, Kt.prototype.notEqual = function(s) {
        return this.inAnyRange([[-1 / 0, s], [s, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, Kt.prototype.noneOf = function() {
        var s = It.apply(Ke, arguments);
        if (s.length === 0) return new this.Collection(this);
        try {
          s.sort(this._ascending);
        } catch {
          return Tr(this, xn);
        }
        var a = s.reduce(function(h, g) {
          return h ? h.concat([[h[h.length - 1][1], g]]) : [[-1 / 0, g]];
        }, null);
        return a.push([s[s.length - 1], this.db._maxKey]), this.inAnyRange(a, { includeLowers: !1, includeUppers: !1 });
      }, Kt.prototype.inAnyRange = function(Q, a) {
        var h = this, g = this._cmp, b = this._ascending, E = this._descending, O = this._min, N = this._max;
        if (Q.length === 0) return Es(this);
        if (!Q.every(function(re) {
          return re[0] !== void 0 && re[1] !== void 0 && b(re[0], re[1]) <= 0;
        })) return Tr(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", he.InvalidArgument);
        var U = !a || a.includeLowers !== !1, j = a && a.includeUppers === !0, W, P = b;
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
          return Tr(this, xn);
        }
        var $ = 0, H = j ? function(re) {
          return 0 < b(re, W[$][1]);
        } : function(re) {
          return 0 <= b(re, W[$][1]);
        }, Y = U ? function(re) {
          return 0 < E(re, W[$][0]);
        } : function(re) {
          return 0 <= E(re, W[$][0]);
        }, z = H, Q = new this.Collection(this, function() {
          return Un(W[0][0], W[W.length - 1][1], !U, !j);
        });
        return Q._ondirectionchange = function(re) {
          P = re === "next" ? (z = H, b) : (z = Y, E), W.sort(V);
        }, Q._addAlgorithm(function(re, ne, ae) {
          for (var pe, be = re.key; z(be); ) if (++$ === W.length) return ne(ae), !1;
          return !H(pe = be) && !Y(pe) || (h._cmp(be, W[$][1]) === 0 || h._cmp(be, W[$][0]) === 0 || ne(function() {
            P === b ? re.continue(W[$][0]) : re.continue(W[$][1]);
          }), !1);
        }), Q;
      }, Kt.prototype.startsWithAnyOf = function() {
        var s = It.apply(Ke, arguments);
        return s.every(function(a) {
          return typeof a == "string";
        }) ? s.length === 0 ? Es(this) : this.inAnyRange(s.map(function(a) {
          return [a, a + ki];
        })) : Tr(this, "startsWithAnyOf() only works with strings");
      }, Kt);
      function Kt() {
      }
      function nn(s) {
        return Te(function(a) {
          return xo(a), s(a.target.error), !1;
        });
      }
      function xo(s) {
        s.stopPropagation && s.stopPropagation(), s.preventDefault && s.preventDefault();
      }
      var Eo = "storagemutated", bu = "x-storagemutated-1", $n = bo(null, Eo), Z0 = (sn.prototype._lock = function() {
        return le(!q.global), ++this._reculock, this._reculock !== 1 || q.global || (q.lockOwnerFor = this), this;
      }, sn.prototype._unlock = function() {
        if (le(!q.global), --this._reculock == 0) for (q.global || (q.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var s = this._blockedFuncs.shift();
          try {
            Ai(s[1], s[0]);
          } catch {
          }
        }
        return this;
      }, sn.prototype._locked = function() {
        return this._reculock && q.lockOwnerFor !== this;
      }, sn.prototype.create = function(s) {
        var a = this;
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
        return le(this._completion._state === null), (s = this.idbtrans = s || (this.db.core || h).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Te(function(b) {
          xo(b), a._reject(s.error);
        }), s.onabort = Te(function(b) {
          xo(b), a.active && a._reject(new he.Abort(s.error)), a.active = !1, a.on("abort").fire(b);
        }), s.oncomplete = Te(function() {
          a.active = !1, a._resolve(), "mutatedParts" in s && $n.storagemutated.fire(s.mutatedParts);
        }), this;
      }, sn.prototype._promise = function(s, a, h) {
        var g = this;
        if (s === "readwrite" && this.mode !== "readwrite") return Dt(new he.ReadOnly("Transaction is readonly"));
        if (!this.active) return Dt(new he.TransactionInactive());
        if (this._locked()) return new f(function(E, O) {
          g._blockedFuncs.push([function() {
            g._promise(s, a, h).then(E, O);
          }, q]);
        });
        if (h) return Pt(function() {
          var E = new f(function(O, N) {
            g._lock();
            var U = a(O, N, g);
            U && U.then && U.then(O, N);
          });
          return E.finally(function() {
            return g._unlock();
          }), E._lib = !0, E;
        });
        var b = new f(function(E, O) {
          var N = a(E, O, g);
          N && N.then && N.then(E, O);
        });
        return b._lib = !0, b;
      }, sn.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, sn.prototype.waitFor = function(s) {
        var a, h = this._root(), g = f.resolve(s);
        h._waitingFor ? h._waitingFor = h._waitingFor.then(function() {
          return g;
        }) : (h._waitingFor = g, h._waitingQueue = [], a = h.idbtrans.objectStore(h.storeNames[0]), function E() {
          for (++h._spinCount; h._waitingQueue.length; ) h._waitingQueue.shift()();
          h._waitingFor && (a.get(-1 / 0).onsuccess = E);
        }());
        var b = h._waitingFor;
        return new f(function(E, O) {
          g.then(function(N) {
            return h._waitingQueue.push(Te(E.bind(null, N)));
          }, function(N) {
            return h._waitingQueue.push(Te(O.bind(null, N)));
          }).finally(function() {
            h._waitingFor === b && (h._waitingFor = null);
          });
        });
      }, sn.prototype.abort = function() {
        this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new he.Abort()));
      }, sn.prototype.table = function(s) {
        var a = this._memoizedTables || (this._memoizedTables = {});
        if (_(a, s)) return a[s];
        var h = this.schema[s];
        if (!h) throw new he.NotFound("Table " + s + " not part of transaction");
        return h = new this.db.Table(s, h, this), h.core = this.db.core.table(s), a[s] = h;
      }, sn);
      function sn() {
      }
      function _u(s, a, h, g, b, E, O) {
        return { name: s, keyPath: a, unique: h, multi: g, auto: b, compound: E, src: (h && !O ? "&" : "") + (g ? "*" : "") + (b ? "++" : "") + Oh(a) };
      }
      function Oh(s) {
        return typeof s == "string" ? s : s ? "[" + [].join.call(s, "+") + "]" : "";
      }
      function wu(s, a, h) {
        return { name: s, primKey: a, indexes: h, mappedClass: null, idxByName: (g = function(b) {
          return [b.name, b];
        }, h.reduce(function(b, E, O) {
          return O = g(E, O), O && (b[O[0]] = O[1]), b;
        }, {})) };
        var g;
      }
      var So = function(s) {
        try {
          return s.only([[]]), So = function() {
            return [[]];
          }, [[]];
        } catch {
          return So = function() {
            return ki;
          }, ki;
        }
      };
      function xu(s) {
        return s == null ? function() {
        } : typeof s == "string" ? (a = s).split(".").length === 1 ? function(h) {
          return h[a];
        } : function(h) {
          return fe(h, a);
        } : function(h) {
          return fe(h, s);
        };
        var a;
      }
      function Rh(s) {
        return [].slice.call(s);
      }
      var Q0 = 0;
      function Ao(s) {
        return s == null ? ":id" : typeof s == "string" ? s : "[".concat(s.join("+"), "]");
      }
      function X0(s, a, U) {
        function g(z) {
          if (z.type === 3) return null;
          if (z.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var $ = z.lower, H = z.upper, Y = z.lowerOpen, z = z.upperOpen;
          return $ === void 0 ? H === void 0 ? null : a.upperBound(H, !!z) : H === void 0 ? a.lowerBound($, !!Y) : a.bound($, H, !!Y, !!z);
        }
        function b(V) {
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
              function Ye(fr) {
                ++Cr, xo(fr);
              }
              var rt = [], nt = [], Cr = 0;
              if (Q === "deleteRange") {
                if (ae.type === 4) return pe({ numFailures: Cr, failures: nt, results: [], lastResult: void 0 });
                ae.type === 3 ? rt.push(Ie = de.clear()) : rt.push(Ie = de.delete(g(ae)));
              } else {
                var ge = _e ? ge ? [ne, re] : [ne, null] : [re, null], ze = ge[0], er = ge[1];
                if (_e) for (var tr = 0; tr < Ae; ++tr) rt.push(Ie = er && er[tr] !== void 0 ? de[Q](ze[tr], er[tr]) : de[Q](ze[tr])), Ie.onerror = Ye;
                else for (tr = 0; tr < Ae; ++tr) rt.push(Ie = de[Q](ze[tr])), Ie.onerror = Ye;
              }
              function Ea(fr) {
                fr = fr.target.result, rt.forEach(function(Ci, $u) {
                  return Ci.error != null && (nt[$u] = Ci.error);
                }), pe({ numFailures: Cr, failures: nt, results: Q === "delete" ? re : rt.map(function(Ci) {
                  return Ci.result;
                }), lastResult: fr });
              }
              Ie.onerror = function(fr) {
                Ye(fr), Ea(fr);
              }, Ie.onsuccess = Ea;
            });
          }, getMany: function(Y) {
            var z = Y.trans, Q = Y.keys;
            return new Promise(function(re, ne) {
              re = Te(re);
              for (var ae, pe = z.objectStore(H), be = Q.length, de = new Array(be), ge = 0, _e = 0, Ie = function(rt) {
                rt = rt.target, de[rt._pos] = rt.result, ++_e === ge && re(de);
              }, Ae = nn(ne), Ye = 0; Ye < be; ++Ye) Q[Ye] != null && ((ae = pe.get(Q[Ye]))._pos = Ye, ae.onsuccess = Ie, ae.onerror = Ae, ++ge);
              ge === 0 && re(de);
            });
          }, get: function(Y) {
            var z = Y.trans, Q = Y.key;
            return new Promise(function(re, ne) {
              re = Te(re);
              var ae = z.objectStore(H).get(Q);
              ae.onsuccess = function(pe) {
                return re(pe.target.result);
              }, ae.onerror = nn(ne);
            });
          }, query: ($ = j, function(Y) {
            return new Promise(function(z, Q) {
              z = Te(z);
              var re, ne, ae, ge = Y.trans, pe = Y.values, be = Y.limit, Ie = Y.query, de = be === 1 / 0 ? void 0 : be, _e = Ie.index, Ie = Ie.range, ge = ge.objectStore(H), _e = _e.isPrimaryKey ? ge : ge.index(_e.name), Ie = g(Ie);
              if (be === 0) return z({ result: [] });
              $ ? ((de = pe ? _e.getAll(Ie, de) : _e.getAllKeys(Ie, de)).onsuccess = function(Ae) {
                return z({ result: Ae.target.result });
              }, de.onerror = nn(Q)) : (re = 0, ne = !pe && "openKeyCursor" in _e ? _e.openKeyCursor(Ie) : _e.openCursor(Ie), ae = [], ne.onsuccess = function(Ae) {
                var Ye = ne.result;
                return Ye ? (ae.push(pe ? Ye.value : Ye.primaryKey), ++re === be ? z({ result: ae }) : void Ye.continue()) : z({ result: ae });
              }, ne.onerror = nn(Q));
            });
          }), openCursor: function(Y) {
            var z = Y.trans, Q = Y.values, re = Y.query, ne = Y.reverse, ae = Y.unique;
            return new Promise(function(pe, be) {
              pe = Te(pe);
              var _e = re.index, de = re.range, ge = z.objectStore(H), ge = _e.isPrimaryKey ? ge : ge.index(_e.name), _e = ne ? ae ? "prevunique" : "prev" : ae ? "nextunique" : "next", Ie = !Q && "openKeyCursor" in ge ? ge.openKeyCursor(g(de), _e) : ge.openCursor(g(de), _e);
              Ie.onerror = nn(be), Ie.onsuccess = Te(function(Ae) {
                var Ye, rt, nt, Cr, ze = Ie.result;
                ze ? (ze.___id = ++Q0, ze.done = !1, Ye = ze.continue.bind(ze), rt = (rt = ze.continuePrimaryKey) && rt.bind(ze), nt = ze.advance.bind(ze), Cr = function() {
                  throw new Error("Cursor not stopped");
                }, ze.trans = z, ze.stop = ze.continue = ze.continuePrimaryKey = ze.advance = function() {
                  throw new Error("Cursor not started");
                }, ze.fail = Te(be), ze.next = function() {
                  var er = this, tr = 1;
                  return this.start(function() {
                    return tr-- ? er.continue() : er.stop();
                  }).then(function() {
                    return er;
                  });
                }, ze.start = function(er) {
                  function tr() {
                    if (Ie.result) try {
                      er();
                    } catch (fr) {
                      ze.fail(fr);
                    }
                    else ze.done = !0, ze.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, ze.stop();
                  }
                  var Ea = new Promise(function(fr, Ci) {
                    fr = Te(fr), Ie.onerror = nn(Ci), ze.fail = Ci, ze.stop = function($u) {
                      ze.stop = ze.continue = ze.continuePrimaryKey = ze.advance = Cr, fr($u);
                    };
                  });
                  return Ie.onsuccess = Te(function(fr) {
                    Ie.onsuccess = tr, tr();
                  }), ze.continue = Ye, ze.continuePrimaryKey = rt, ze.advance = nt, tr(), Ea;
                }, pe(ze)) : pe(null);
              }, be);
            });
          }, count: function(Y) {
            var z = Y.query, Q = Y.trans, re = z.index, ne = z.range;
            return new Promise(function(ae, pe) {
              var be = Q.objectStore(H), de = re.isPrimaryKey ? be : be.index(re.name), be = g(ne), de = be ? de.count(be) : de.count();
              de.onsuccess = Te(function(ge) {
                return ae(ge.target.result);
              }), de.onerror = nn(pe);
            });
          } };
        }
        var E, O, N, W = (O = U, N = Rh((E = s).objectStoreNames), { schema: { name: E.name, tables: N.map(function(V) {
          return O.objectStore(V);
        }).map(function(V) {
          var $ = V.keyPath, z = V.autoIncrement, H = l($), Y = {}, z = { name: V.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: $ == null, compound: H, keyPath: $, autoIncrement: z, unique: !0, extractKey: xu($) }, indexes: Rh(V.indexNames).map(function(Q) {
            return V.index(Q);
          }).map(function(ae) {
            var re = ae.name, ne = ae.unique, pe = ae.multiEntry, ae = ae.keyPath, pe = { name: re, compound: l(ae), keyPath: ae, unique: ne, multiEntry: pe, extractKey: xu(ae) };
            return Y[Ao(ae)] = pe;
          }), getIndexByKeyPath: function(Q) {
            return Y[Ao(Q)];
          } };
          return Y[":id"] = z.primaryKey, $ != null && (Y[Ao($)] = z.primaryKey), z;
        }) }, hasGetAll: 0 < N.length && "getAll" in O.objectStore(N[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), U = W.schema, j = W.hasGetAll, W = U.tables.map(b), P = {};
        return W.forEach(function(V) {
          return P[V.name] = V;
        }), { stack: "dbcore", transaction: s.transaction.bind(s), table: function(V) {
          if (!P[V]) throw new Error("Table '".concat(V, "' not found"));
          return P[V];
        }, MIN_KEY: -1 / 0, MAX_KEY: So(a), schema: U };
      }
      function ey(s, a, h, g) {
        var b = h.IDBKeyRange;
        return h.indexedDB, { dbcore: (g = X0(a, b, g), s.dbcore.reduce(function(E, O) {
          return O = O.create, r(r({}, E), O(E));
        }, g)) };
      }
      function ha(s, g) {
        var h = g.db, g = ey(s._middlewares, h, s._deps, g);
        s.core = g.dbcore, s.tables.forEach(function(b) {
          var E = b.name;
          s.core.schema.tables.some(function(O) {
            return O.name === E;
          }) && (b.core = s.core.table(E), s[E] instanceof s.Table && (s[E].core = b.core));
        });
      }
      function pa(s, a, h, g) {
        h.forEach(function(b) {
          var E = g[b];
          a.forEach(function(O) {
            var N = function U(j, W) {
              return C(j, W) || (j = I(j)) && U(j, W);
            }(O, b);
            (!N || "value" in N && N.value === void 0) && (O === s.Transaction.prototype || O instanceof s.Transaction ? D(O, b, { get: function() {
              return this.table(b);
            }, set: function(U) {
              k(this, b, { value: U, writable: !0, configurable: !0, enumerable: !0 });
            } }) : O[b] = new s.Table(b, E));
          });
        });
      }
      function Eu(s, a) {
        a.forEach(function(h) {
          for (var g in h) h[g] instanceof s.Table && delete h[g];
        });
      }
      function ty(s, a) {
        return s._cfg.version - a._cfg.version;
      }
      function ry(s, a, h, g) {
        var b = s._dbSchema;
        h.objectStoreNames.contains("$meta") && !b.$meta && (b.$meta = wu("$meta", Ch("")[0], []), s._storeNames.push("$meta"));
        var E = s._createTransaction("readwrite", s._storeNames, b);
        E.create(h), E._completion.catch(g);
        var O = E._reject.bind(E), N = q.transless || q;
        Pt(function() {
          return q.trans = E, q.transless = N, a !== 0 ? (ha(s, h), j = a, ((U = E).storeNames.includes("$meta") ? U.table("$meta").get("version").then(function(W) {
            return W ?? j;
          }) : f.resolve(j)).then(function(W) {
            return V = W, $ = E, H = h, Y = [], W = (P = s)._versions, z = P._dbSchema = va(0, P.idbdb, H), (W = W.filter(function(Q) {
              return Q._cfg.version >= V;
            })).length !== 0 ? (W.forEach(function(Q) {
              Y.push(function() {
                var re = z, ne = Q._cfg.dbschema;
                ga(P, re, H), ga(P, ne, H), z = P._dbSchema = ne;
                var ae = Su(re, ne);
                ae.add.forEach(function(_e) {
                  Au(H, _e[0], _e[1].primKey, _e[1].indexes);
                }), ae.change.forEach(function(_e) {
                  if (_e.recreate) throw new he.Upgrade("Not yet support for changing primary key");
                  var Ie = H.objectStore(_e.name);
                  _e.add.forEach(function(Ae) {
                    return da(Ie, Ae);
                  }), _e.change.forEach(function(Ae) {
                    Ie.deleteIndex(Ae.name), da(Ie, Ae);
                  }), _e.del.forEach(function(Ae) {
                    return Ie.deleteIndex(Ae);
                  });
                });
                var pe = Q._cfg.contentUpgrade;
                if (pe && Q._cfg.version > V) {
                  ha(P, H), $._memoizedTables = {};
                  var be = ke(ne);
                  ae.del.forEach(function(_e) {
                    be[_e] = re[_e];
                  }), Eu(P, [P.Transaction.prototype]), pa(P, [P.Transaction.prototype], u(be), be), $.schema = be;
                  var de, ge = Ve(pe);
                  return ge && At(), ae = f.follow(function() {
                    var _e;
                    (de = pe($)) && ge && (_e = jt.bind(null, null), de.then(_e, _e));
                  }), de && typeof de.then == "function" ? f.resolve(de) : ae.then(function() {
                    return de;
                  });
                }
              }), Y.push(function(re) {
                var ne, ae, pe = Q._cfg.dbschema;
                ne = pe, ae = re, [].slice.call(ae.db.objectStoreNames).forEach(function(be) {
                  return ne[be] == null && ae.db.deleteObjectStore(be);
                }), Eu(P, [P.Transaction.prototype]), pa(P, [P.Transaction.prototype], P._storeNames, P._dbSchema), $.schema = P._dbSchema;
              }), Y.push(function(re) {
                P.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(P.idbdb.version / 10) === Q._cfg.version ? (P.idbdb.deleteObjectStore("$meta"), delete P._dbSchema.$meta, P._storeNames = P._storeNames.filter(function(ne) {
                  return ne !== "$meta";
                })) : re.objectStore("$meta").put(Q._cfg.version, "version"));
              });
            }), function Q() {
              return Y.length ? f.resolve(Y.shift()($.idbtrans)).then(Q) : f.resolve();
            }().then(function() {
              Th(z, H);
            })) : f.resolve();
            var P, V, $, H, Y, z;
          }).catch(O)) : (u(b).forEach(function(W) {
            Au(h, W, b[W].primKey, b[W].indexes);
          }), ha(s, h), void f.follow(function() {
            return s.on.populate.fire(E);
          }).catch(O));
          var U, j;
        });
      }
      function ny(s, a) {
        Th(s._dbSchema, a), a.db.version % 10 != 0 || a.objectStoreNames.contains("$meta") || a.db.createObjectStore("$meta").add(Math.ceil(a.db.version / 10 - 1), "version");
        var h = va(0, s.idbdb, a);
        ga(s, s._dbSchema, a);
        for (var g = 0, b = Su(h, s._dbSchema).change; g < b.length; g++) {
          var E = function(O) {
            if (O.change.length || O.recreate) return console.warn("Unable to patch indexes of table ".concat(O.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var N = a.objectStore(O.name);
            O.add.forEach(function(U) {
              Me && console.debug("Dexie upgrade patch: Creating missing index ".concat(O.name, ".").concat(U.src)), da(N, U);
            });
          }(b[g]);
          if (typeof E == "object") return E.value;
        }
      }
      function Su(s, a) {
        var h, g = { del: [], add: [], change: [] };
        for (h in s) a[h] || g.del.push(h);
        for (h in a) {
          var b = s[h], E = a[h];
          if (b) {
            var O = { name: h, def: E, recreate: !1, del: [], add: [], change: [] };
            if ("" + (b.primKey.keyPath || "") != "" + (E.primKey.keyPath || "") || b.primKey.auto !== E.primKey.auto) O.recreate = !0, g.change.push(O);
            else {
              var N = b.idxByName, U = E.idxByName, j = void 0;
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
      function Au(s, a, h, g) {
        var b = s.db.createObjectStore(a, h.keyPath ? { keyPath: h.keyPath, autoIncrement: h.auto } : { autoIncrement: h.auto });
        return g.forEach(function(E) {
          return da(b, E);
        }), b;
      }
      function Th(s, a) {
        u(s).forEach(function(h) {
          a.db.objectStoreNames.contains(h) || (Me && console.debug("Dexie: Creating missing table", h), Au(a, h, s[h].primKey, s[h].indexes));
        });
      }
      function da(s, a) {
        s.createIndex(a.name, a.keyPath, { unique: a.unique, multiEntry: a.multi });
      }
      function va(s, a, h) {
        var g = {};
        return J(a.objectStoreNames, 0).forEach(function(b) {
          for (var E = h.objectStore(b), O = _u(Oh(j = E.keyPath), j || "", !0, !1, !!E.autoIncrement, j && typeof j != "string", !0), N = [], U = 0; U < E.indexNames.length; ++U) {
            var W = E.index(E.indexNames[U]), j = W.keyPath, W = _u(W.name, j, !!W.unique, !!W.multiEntry, !1, j && typeof j != "string", !1);
            N.push(W);
          }
          g[b] = wu(b, O, N);
        }), g;
      }
      function ga(s, a, h) {
        for (var g = h.db.objectStoreNames, b = 0; b < g.length; ++b) {
          var E = g[b], O = h.objectStore(E);
          s._hasGetAll = "getAll" in O;
          for (var N = 0; N < O.indexNames.length; ++N) {
            var U = O.indexNames[N], j = O.index(U).keyPath, W = typeof j == "string" ? j : "[" + J(j).join("+") + "]";
            !a[E] || (j = a[E].idxByName[W]) && (j.name = U, delete a[E].idxByName[W], a[E].idxByName[U] = j);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && o.WorkerGlobalScope && o instanceof o.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (s._hasGetAll = !1);
      }
      function Ch(s) {
        return s.split(",").map(function(a, h) {
          var g = (a = a.trim()).replace(/([&*]|\+\+)/g, ""), b = /^\[/.test(g) ? g.match(/^\[(.*)\]$/)[1].split("+") : g;
          return _u(g, b || null, /\&/.test(a), /\*/.test(a), /\+\+/.test(a), l(b), h === 0);
        });
      }
      var iy = (ya.prototype._parseStoresSpec = function(s, a) {
        u(s).forEach(function(h) {
          if (s[h] !== null) {
            var g = Ch(s[h]), b = g.shift();
            if (b.unique = !0, b.multi) throw new he.Schema("Primary key cannot be multi-valued");
            g.forEach(function(E) {
              if (E.auto) throw new he.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!E.keyPath) throw new he.Schema("Index must have a name and cannot be an empty string");
            }), a[h] = wu(h, b, g);
          }
        });
      }, ya.prototype.stores = function(h) {
        var a = this.db;
        this._cfg.storesSource = this._cfg.storesSource ? c(this._cfg.storesSource, h) : h;
        var h = a._versions, g = {}, b = {};
        return h.forEach(function(E) {
          c(g, E._cfg.storesSource), b = E._cfg.dbschema = {}, E._parseStoresSpec(g, b);
        }), a._dbSchema = b, Eu(a, [a._allTables, a, a.Transaction.prototype]), pa(a, [a._allTables, a, a.Transaction.prototype, this._cfg.tables], u(b), b), a._storeNames = u(b), this;
      }, ya.prototype.upgrade = function(s) {
        return this._cfg.contentUpgrade = Rt(this._cfg.contentUpgrade || me, s), this;
      }, ya);
      function ya() {
      }
      function ku(s, a) {
        var h = s._dbNamesDB;
        return h || (h = s._dbNamesDB = new En(aa, { addons: [], indexedDB: s, IDBKeyRange: a })).version(1).stores({ dbnames: "name" }), h.table("dbnames");
      }
      function Ou(s) {
        return s && typeof s.databases == "function";
      }
      function Ru(s) {
        return Pt(function() {
          return q.letThrough = !0, s();
        });
      }
      function Tu(s) {
        return !("from" in s);
      }
      var Xt = function(s, a) {
        if (!this) {
          var h = new Xt();
          return s && "d" in s && c(h, s), h;
        }
        c(this, arguments.length ? { d: 1, from: s, to: 1 < arguments.length ? a : s } : { d: 0 });
      };
      function ko(s, a, h) {
        var g = at(a, h);
        if (!isNaN(g)) {
          if (0 < g) throw RangeError();
          if (Tu(s)) return c(s, { from: a, to: h, d: 1 });
          var b = s.l, g = s.r;
          if (at(h, s.from) < 0) return b ? ko(b, a, h) : s.l = { from: a, to: h, d: 1, l: null, r: null }, Ph(s);
          if (0 < at(a, s.to)) return g ? ko(g, a, h) : s.r = { from: a, to: h, d: 1, l: null, r: null }, Ph(s);
          at(a, s.from) < 0 && (s.from = a, s.l = null, s.d = g ? g.d + 1 : 1), 0 < at(h, s.to) && (s.to = h, s.r = null, s.d = s.l ? s.l.d + 1 : 1), h = !s.r, b && !s.l && Oo(s, b), g && h && Oo(s, g);
        }
      }
      function Oo(s, a) {
        Tu(a) || function h(g, U) {
          var E = U.from, O = U.to, N = U.l, U = U.r;
          ko(g, E, O), N && h(g, N), U && h(g, U);
        }(s, a);
      }
      function Nh(s, a) {
        var h = ma(a), g = h.next();
        if (g.done) return !1;
        for (var b = g.value, E = ma(s), O = E.next(b.from), N = O.value; !g.done && !O.done; ) {
          if (at(N.from, b.to) <= 0 && 0 <= at(N.to, b.from)) return !0;
          at(b.from, N.from) < 0 ? b = (g = h.next(N.from)).value : N = (O = E.next(b.from)).value;
        }
        return !1;
      }
      function ma(s) {
        var a = Tu(s) ? null : { s: 0, n: s };
        return { next: function(h) {
          for (var g = 0 < arguments.length; a; ) switch (a.s) {
            case 0:
              if (a.s = 1, g) for (; a.n.l && at(h, a.n.from) < 0; ) a = { up: a, n: a.n.l, s: 1 };
              else for (; a.n.l; ) a = { up: a, n: a.n.l, s: 1 };
            case 1:
              if (a.s = 2, !g || at(h, a.n.to) <= 0) return { value: a.n, done: !1 };
            case 2:
              if (a.n.r) {
                a.s = 3, a = { up: a, n: a.n.r, s: 0 };
                continue;
              }
            case 3:
              a = a.up;
          }
          return { done: !0 };
        } };
      }
      function Ph(s) {
        var a, h, g = (((a = s.r) === null || a === void 0 ? void 0 : a.d) || 0) - (((h = s.l) === null || h === void 0 ? void 0 : h.d) || 0), b = 1 < g ? "r" : g < -1 ? "l" : "";
        b && (a = b == "r" ? "l" : "r", h = r({}, s), g = s[b], s.from = g.from, s.to = g.to, s[b] = g[b], h[b] = g[a], (s[a] = h).d = Dh(h)), s.d = Dh(s);
      }
      function Dh(h) {
        var a = h.r, h = h.l;
        return (a ? h ? Math.max(a.d, h.d) : a.d : h ? h.d : 0) + 1;
      }
      function Ia(s, a) {
        return u(a).forEach(function(h) {
          s[h] ? Oo(s[h], a[h]) : s[h] = function g(b) {
            var E, O, N = {};
            for (E in b) _(b, E) && (O = b[E], N[E] = !O || typeof O != "object" || $e.has(O.constructor) ? O : g(O));
            return N;
          }(a[h]);
        }), s;
      }
      function Cu(s, a) {
        return s.all || a.all || Object.keys(s).some(function(h) {
          return a[h] && Nh(a[h], s[h]);
        });
      }
      x(Xt.prototype, ((qr = { add: function(s) {
        return Oo(this, s), this;
      }, addKey: function(s) {
        return ko(this, s, s), this;
      }, addKeys: function(s) {
        var a = this;
        return s.forEach(function(h) {
          return ko(a, h, h);
        }), this;
      }, hasKey: function(s) {
        var a = ma(this).next(s).value;
        return a && at(a.from, s) <= 0 && 0 <= at(a.to, s);
      } })[vt] = function() {
        return ma(this);
      }, qr));
      var Ri = {}, Nu = {}, Pu = !1;
      function ba(s) {
        Ia(Nu, s), Pu || (Pu = !0, setTimeout(function() {
          Pu = !1, Du(Nu, !(Nu = {}));
        }, 0));
      }
      function Du(s, a) {
        a === void 0 && (a = !1);
        var h = /* @__PURE__ */ new Set();
        if (s.all) for (var g = 0, b = Object.values(Ri); g < b.length; g++) Bh(O = b[g], s, h, a);
        else for (var E in s) {
          var O, N = /^idb\:\/\/(.*)\/(.*)\//.exec(E);
          N && (E = N[1], N = N[2], (O = Ri["idb://".concat(E, "/").concat(N)]) && Bh(O, s, h, a));
        }
        h.forEach(function(U) {
          return U();
        });
      }
      function Bh(s, a, h, g) {
        for (var b = [], E = 0, O = Object.entries(s.queries.query); E < O.length; E++) {
          for (var N = O[E], U = N[0], j = [], W = 0, P = N[1]; W < P.length; W++) {
            var V = P[W];
            Cu(a, V.obsSet) ? V.subscribers.forEach(function(z) {
              return h.add(z);
            }) : g && j.push(V);
          }
          g && b.push([U, j]);
        }
        if (g) for (var $ = 0, H = b; $ < H.length; $++) {
          var Y = H[$], U = Y[0], j = Y[1];
          s.queries.query[U] = j;
        }
      }
      function sy(s) {
        var a = s._state, h = s._deps.indexedDB;
        if (a.isBeingOpened || s.idbdb) return a.dbReadyPromise.then(function() {
          return a.dbOpenError ? Dt(a.dbOpenError) : s;
        });
        a.isBeingOpened = !0, a.dbOpenError = null, a.openComplete = !1;
        var g = a.openCanceller, b = Math.round(10 * s.verno), E = !1;
        function O() {
          if (a.openCanceller !== g) throw new he.DatabaseClosed("db.open() was cancelled");
        }
        function N() {
          return new f(function(V, $) {
            if (O(), !h) throw new he.MissingAPI();
            var H = s.name, Y = a.autoSchema || !b ? h.open(H) : h.open(H, b);
            if (!Y) throw new he.MissingAPI();
            Y.onerror = nn($), Y.onblocked = Te(s._fireOnBlocked), Y.onupgradeneeded = Te(function(z) {
              var Q;
              W = Y.transaction, a.autoSchema && !s._options.allowEmptyDB ? (Y.onerror = xo, W.abort(), Y.result.close(), (Q = h.deleteDatabase(H)).onsuccess = Q.onerror = Te(function() {
                $(new he.NoSuchDatabase("Database ".concat(H, " doesnt exist")));
              })) : (W.onerror = nn($), z = z.oldVersion > Math.pow(2, 62) ? 0 : z.oldVersion, P = z < 1, s.idbdb = Y.result, E && ny(s, W), ry(s, z / 10, W, $));
            }, $), Y.onsuccess = Te(function() {
              W = null;
              var z, Q, re, ne, ae, pe = s.idbdb = Y.result, be = J(pe.objectStoreNames);
              if (0 < be.length) try {
                var de = pe.transaction((ne = be).length === 1 ? ne[0] : ne, "readonly");
                if (a.autoSchema) Q = pe, re = de, (z = s).verno = Q.version / 10, re = z._dbSchema = va(0, Q, re), z._storeNames = J(Q.objectStoreNames, 0), pa(z, [z._allTables], u(re), re);
                else if (ga(s, s._dbSchema, de), ((ae = Su(va(0, (ae = s).idbdb, de), ae._dbSchema)).add.length || ae.change.some(function(ge) {
                  return ge.add.length || ge.change.length;
                })) && !E) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), pe.close(), b = pe.version + 1, E = !0, V(N());
                ha(s, de);
              } catch {
              }
              ws.push(s), pe.onversionchange = Te(function(ge) {
                a.vcFired = !0, s.on("versionchange").fire(ge);
              }), pe.onclose = Te(function(ge) {
                s.on("close").fire(ge);
              }), P && (ae = s._deps, de = H, pe = ae.indexedDB, ae = ae.IDBKeyRange, Ou(pe) || de === aa || ku(pe, ae).put({ name: de }).catch(me)), V();
            }, $);
          }).catch(function(V) {
            switch (V == null ? void 0 : V.name) {
              case "UnknownError":
                if (0 < a.PR1398_maxLoop) return a.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), N();
                break;
              case "VersionError":
                if (0 < b) return b = 0, N();
            }
            return f.reject(V);
          });
        }
        var U, j = a.dbReadyResolve, W = null, P = !1;
        return f.race([g, (typeof navigator > "u" ? f.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(V) {
          function $() {
            return indexedDB.databases().finally(V);
          }
          U = setInterval($, 100), $();
        }).finally(function() {
          return clearInterval(U);
        }) : Promise.resolve()).then(N)]).then(function() {
          return O(), a.onReadyBeingFired = [], f.resolve(Ru(function() {
            return s.on.ready.fire(s.vip);
          })).then(function V() {
            if (0 < a.onReadyBeingFired.length) {
              var $ = a.onReadyBeingFired.reduce(Rt, me);
              return a.onReadyBeingFired = [], f.resolve(Ru(function() {
                return $(s.vip);
              })).then(V);
            }
          });
        }).finally(function() {
          a.openCanceller === g && (a.onReadyBeingFired = null, a.isBeingOpened = !1);
        }).catch(function(V) {
          a.dbOpenError = V;
          try {
            W && W.abort();
          } catch {
          }
          return g === a.openCanceller && s._close(), Dt(V);
        }).finally(function() {
          a.openComplete = !0, j();
        }).then(function() {
          var V;
          return P && (V = {}, s.tables.forEach(function($) {
            $.schema.indexes.forEach(function(H) {
              H.name && (V["idb://".concat(s.name, "/").concat($.name, "/").concat(H.name)] = new Xt(-1 / 0, [[[]]]));
            }), V["idb://".concat(s.name, "/").concat($.name, "/")] = V["idb://".concat(s.name, "/").concat($.name, "/:dels")] = new Xt(-1 / 0, [[[]]]);
          }), $n(Eo).fire(V), Du(V, !0)), s;
        });
      }
      function Bu(s) {
        function a(E) {
          return s.next(E);
        }
        var h = b(a), g = b(function(E) {
          return s.throw(E);
        });
        function b(E) {
          return function(U) {
            var N = E(U), U = N.value;
            return N.done ? U : U && typeof U.then == "function" ? U.then(h, g) : l(U) ? Promise.all(U).then(h, g) : h(U);
          };
        }
        return b(a)();
      }
      function _a(s, a, h) {
        for (var g = l(s) ? s.slice() : [s], b = 0; b < h; ++b) g.push(a);
        return g;
      }
      var oy = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(s) {
        return r(r({}, s), { table: function(a) {
          var h = s.table(a), g = h.schema, b = {}, E = [];
          function O(P, V, $) {
            var H = Ao(P), Y = b[H] = b[H] || [], z = P == null ? 0 : typeof P == "string" ? 1 : P.length, Q = 0 < V, Q = r(r({}, $), { name: Q ? "".concat(H, "(virtual-from:").concat($.name, ")") : $.name, lowLevelIndex: $, isVirtual: Q, keyTail: V, keyLength: z, extractKey: xu(P), unique: !Q && $.unique });
            return Y.push(Q), Q.isPrimaryKey || E.push(Q), 1 < z && O(z === 2 ? P[0] : P.slice(0, z - 1), V + 1, $), Y.sort(function(re, ne) {
              return re.keyTail - ne.keyTail;
            }), Q;
          }
          a = O(g.primaryKey.keyPath, 0, g.primaryKey), b[":id"] = [a];
          for (var N = 0, U = g.indexes; N < U.length; N++) {
            var j = U[N];
            O(j.keyPath, 0, j);
          }
          function W(P) {
            var V, $ = P.query.index;
            return $.isVirtual ? r(r({}, P), { query: { index: $.lowLevelIndex, range: (V = P.query.range, $ = $.keyTail, { type: V.type === 1 ? 2 : V.type, lower: _a(V.lower, V.lowerOpen ? s.MAX_KEY : s.MIN_KEY, $), lowerOpen: !0, upper: _a(V.upper, V.upperOpen ? s.MIN_KEY : s.MAX_KEY, $), upperOpen: !0 }) } }) : P;
          }
          return r(r({}, h), { schema: r(r({}, g), { primaryKey: a, indexes: E, getIndexByKeyPath: function(P) {
            return (P = b[Ao(P)]) && P[0];
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
                re != null ? Q.continue(_a(re, P.reverse ? s.MAX_KEY : s.MIN_KEY, $)) : P.unique ? Q.continue(Q.key.slice(0, Y).concat(P.reverse ? s.MIN_KEY : s.MAX_KEY, $)) : Q.continue();
              } }, continuePrimaryKey: { value: function(re, ne) {
                Q.continuePrimaryKey(_a(re, s.MAX_KEY, $), ne);
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
      function Fu(s, a, h, g) {
        return h = h || {}, g = g || "", u(s).forEach(function(b) {
          var E, O, N;
          _(a, b) ? (E = s[b], O = a[b], typeof E == "object" && typeof O == "object" && E && O ? (N = ot(E)) !== ot(O) ? h[g + b] = a[b] : N === "Object" ? Fu(E, O, h, g + b + ".") : E !== O && (h[g + b] = a[b]) : E !== O && (h[g + b] = a[b])) : h[g + b] = void 0;
        }), u(a).forEach(function(b) {
          _(s, b) || (h[g + b] = a[b]);
        }), h;
      }
      function Lu(s, a) {
        return a.type === "delete" ? a.keys : a.keys || a.values.map(s.extractKey);
      }
      var ay = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(s) {
        return r(r({}, s), { table: function(a) {
          var h = s.table(a), g = h.schema.primaryKey;
          return r(r({}, h), { mutate: function(b) {
            var E = q.trans, O = E.table(a).hook, N = O.deleting, U = O.creating, j = O.updating;
            switch (b.type) {
              case "add":
                if (U.fire === me) break;
                return E._promise("readwrite", function() {
                  return W(b);
                }, !0);
              case "put":
                if (U.fire === me && j.fire === me) break;
                return E._promise("readwrite", function() {
                  return W(b);
                }, !0);
              case "delete":
                if (N.fire === me) break;
                return E._promise("readwrite", function() {
                  return W(b);
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
                  }(b.trans, b.range, 1e4);
                }, !0);
            }
            return h.mutate(b);
            function W(P) {
              var V, $, H, Y = q.trans, z = P.keys || Lu(g, P);
              if (!z) throw new Error("Keys missing");
              return (P = P.type === "add" || P.type === "put" ? r(r({}, P), { keys: z }) : r({}, P)).type !== "delete" && (P.values = i([], P.values)), P.keys && (P.keys = i([], P.keys)), V = h, H = z, (($ = P).type === "add" ? Promise.resolve([]) : V.getMany({ trans: $.trans, keys: H, cache: "immutable" })).then(function(Q) {
                var re = z.map(function(ne, ae) {
                  var pe, be, de, ge = Q[ae], _e = { onerror: null, onsuccess: null };
                  return P.type === "delete" ? N.fire.call(_e, ne, ge, Y) : P.type === "add" || ge === void 0 ? (pe = U.fire.call(_e, ne, P.values[ae], Y), ne == null && pe != null && (P.keys[ae] = ne = pe, g.outbound || oe(P.values[ae], g.keyPath, ne))) : (pe = Fu(ge, P.values[ae]), (be = j.fire.call(_e, pe, ne, ge, Y)) && (de = P.values[ae], Object.keys(be).forEach(function(Ie) {
                    _(de, Ie) ? de[Ie] = be[Ie] : oe(de, Ie, be[Ie]);
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
      function Fh(s, a, h) {
        try {
          if (!a || a.keys.length < s.length) return null;
          for (var g = [], b = 0, E = 0; b < a.keys.length && E < s.length; ++b) at(a.keys[b], s[E]) === 0 && (g.push(h ? Se(a.values[b]) : a.values[b]), ++E);
          return g.length === s.length ? g : null;
        } catch {
          return null;
        }
      }
      var uy = { stack: "dbcore", level: -1, create: function(s) {
        return { table: function(a) {
          var h = s.table(a);
          return r(r({}, h), { getMany: function(g) {
            if (!g.cache) return h.getMany(g);
            var b = Fh(g.keys, g.trans._cache, g.cache === "clone");
            return b ? f.resolve(b) : h.getMany(g).then(function(E) {
              return g.trans._cache = { keys: g.keys, values: g.cache === "clone" ? Se(E) : E }, E;
            });
          }, mutate: function(g) {
            return g.type !== "add" && (g.trans._cache = null), h.mutate(g);
          } });
        } };
      } };
      function Lh(s, a) {
        return s.trans.mode === "readonly" && !!s.subscr && !s.trans.explicit && s.trans.db._options.cache !== "disabled" && !a.schema.primaryKey.outbound;
      }
      function qh(s, a) {
        switch (s) {
          case "query":
            return a.values && !a.unique;
          case "get":
          case "getMany":
          case "count":
          case "openCursor":
            return !1;
        }
      }
      var ly = { stack: "dbcore", level: 0, name: "Observability", create: function(s) {
        var a = s.schema.name, h = new Xt(s.MIN_KEY, s.MAX_KEY);
        return r(r({}, s), { transaction: function(g, b, E) {
          if (q.subscr && b !== "readonly") throw new he.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(q.querier));
          return s.transaction(g, b, E);
        }, table: function(g) {
          var b = s.table(g), E = b.schema, O = E.primaryKey, P = E.indexes, N = O.extractKey, U = O.outbound, j = O.autoIncrement && P.filter(function($) {
            return $.compound && $.keyPath.includes(O.keyPath);
          }), W = r(r({}, b), { mutate: function($) {
            function H(Ie) {
              return Ie = "idb://".concat(a, "/").concat(g, "/").concat(Ie), ne[Ie] || (ne[Ie] = new Xt());
            }
            var Y, z, Q, re = $.trans, ne = $.mutatedParts || ($.mutatedParts = {}), ae = H(""), pe = H(":dels"), be = $.type, _e = $.type === "deleteRange" ? [$.range] : $.type === "delete" ? [$.keys] : $.values.length < 50 ? [Lu(O, $).filter(function(Ie) {
              return Ie;
            }), $.values] : [], de = _e[0], ge = _e[1], _e = $.trans._cache;
            return l(de) ? (ae.addKeys(de), (_e = be === "delete" || de.length === ge.length ? Fh(de, _e) : null) || pe.addKeys(de), (_e || ge) && (Y = H, z = _e, Q = ge, E.indexes.forEach(function(Ie) {
              var Ae = Y(Ie.name || "");
              function Ye(nt) {
                return nt != null ? Ie.extractKey(nt) : null;
              }
              function rt(nt) {
                return Ie.multiEntry && l(nt) ? nt.forEach(function(Cr) {
                  return Ae.addKey(Cr);
                }) : Ae.addKey(nt);
              }
              (z || Q).forEach(function(nt, er) {
                var ze = z && Ye(z[er]), er = Q && Ye(Q[er]);
                at(ze, er) !== 0 && (ze != null && rt(ze), er != null && rt(er));
              });
            }))) : de ? (ge = { from: (ge = de.lower) !== null && ge !== void 0 ? ge : s.MIN_KEY, to: (ge = de.upper) !== null && ge !== void 0 ? ge : s.MAX_KEY }, pe.add(ge), ae.add(ge)) : (ae.add(h), pe.add(h), E.indexes.forEach(function(Ie) {
              return H(Ie.name).add(h);
            })), b.mutate($).then(function(Ie) {
              return !de || $.type !== "add" && $.type !== "put" || (ae.addKeys(Ie.results), j && j.forEach(function(Ae) {
                for (var Ye = $.values.map(function(ze) {
                  return Ae.extractKey(ze);
                }), rt = Ae.keyPath.findIndex(function(ze) {
                  return ze === O.keyPath;
                }), nt = 0, Cr = Ie.results.length; nt < Cr; ++nt) Ye[nt][rt] = Ie.results[nt];
                H(Ae.name).addKeys(Ye);
              })), re.mutatedParts = Ia(re.mutatedParts || {}, ne), Ie;
            });
          } }), P = function(H) {
            var Y = H.query, H = Y.index, Y = Y.range;
            return [H, new Xt((H = Y.lower) !== null && H !== void 0 ? H : s.MIN_KEY, (Y = Y.upper) !== null && Y !== void 0 ? Y : s.MAX_KEY)];
          }, V = { get: function($) {
            return [O, new Xt($.key)];
          }, getMany: function($) {
            return [O, new Xt().addKeys($.keys)];
          }, count: P, query: P, openCursor: P };
          return u(V).forEach(function($) {
            W[$] = function(H) {
              var Y = q.subscr, z = !!Y, Q = Lh(q, b) && qh($, H) ? H.obsSet = {} : Y;
              if (z) {
                var re = function(ge) {
                  return ge = "idb://".concat(a, "/").concat(g, "/").concat(ge), Q[ge] || (Q[ge] = new Xt());
                }, ne = re(""), ae = re(":dels"), Y = V[$](H), z = Y[0], Y = Y[1];
                if (($ === "query" && z.isPrimaryKey && !H.values ? ae : re(z.name || "")).add(Y), !z.isPrimaryKey) {
                  if ($ !== "count") {
                    var pe = $ === "query" && U && H.values && b.query(r(r({}, H), { values: !1 }));
                    return b[$].apply(this, arguments).then(function(ge) {
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
              return b[$].apply(this, arguments);
            };
          }), W;
        } });
      } };
      function Mh(s, a, h) {
        if (h.numFailures === 0) return a;
        if (a.type === "deleteRange") return null;
        var g = a.keys ? a.keys.length : "values" in a && a.values ? a.values.length : 1;
        return h.numFailures === g ? null : (a = r({}, a), l(a.keys) && (a.keys = a.keys.filter(function(b, E) {
          return !(E in h.failures);
        })), "values" in a && l(a.values) && (a.values = a.values.filter(function(b, E) {
          return !(E in h.failures);
        })), a);
      }
      function qu(s, a) {
        return h = s, ((g = a).lower === void 0 || (g.lowerOpen ? 0 < at(h, g.lower) : 0 <= at(h, g.lower))) && (s = s, (a = a).upper === void 0 || (a.upperOpen ? at(s, a.upper) < 0 : at(s, a.upper) <= 0));
        var h, g;
      }
      function Uh(s, a, V, g, b, E) {
        if (!V || V.length === 0) return s;
        var O = a.query.index, N = O.multiEntry, U = a.query.range, j = g.schema.primaryKey.extractKey, W = O.extractKey, P = (O.lowLevelIndex || O).extractKey, V = V.reduce(function($, H) {
          var Y = $, z = [];
          if (H.type === "add" || H.type === "put") for (var Q = new Xt(), re = H.values.length - 1; 0 <= re; --re) {
            var ne, ae = H.values[re], pe = j(ae);
            Q.hasKey(pe) || (ne = W(ae), (N && l(ne) ? ne.some(function(Ie) {
              return qu(Ie, U);
            }) : qu(ne, U)) && (Q.addKey(pe), z.push(ae)));
          }
          switch (H.type) {
            case "add":
              var be = new Xt().addKeys(a.values ? $.map(function(Ae) {
                return j(Ae);
              }) : $), Y = $.concat(a.values ? z.filter(function(Ae) {
                return Ae = j(Ae), !be.hasKey(Ae) && (be.addKey(Ae), !0);
              }) : z.map(function(Ae) {
                return j(Ae);
              }).filter(function(Ae) {
                return !be.hasKey(Ae) && (be.addKey(Ae), !0);
              }));
              break;
            case "put":
              var de = new Xt().addKeys(H.values.map(function(Ae) {
                return j(Ae);
              }));
              Y = $.filter(function(Ae) {
                return !de.hasKey(a.values ? j(Ae) : Ae);
              }).concat(a.values ? z : z.map(function(Ae) {
                return j(Ae);
              }));
              break;
            case "delete":
              var ge = new Xt().addKeys(H.keys);
              Y = $.filter(function(Ae) {
                return !ge.hasKey(a.values ? j(Ae) : Ae);
              });
              break;
            case "deleteRange":
              var _e = H.range;
              Y = $.filter(function(Ae) {
                return !qu(j(Ae), _e);
              });
          }
          return Y;
        }, s);
        return V === s ? s : (V.sort(function($, H) {
          return at(P($), P(H)) || at(j($), j(H));
        }), a.limit && a.limit < 1 / 0 && (V.length > a.limit ? V.length = a.limit : s.length === a.limit && V.length < a.limit && (b.dirty = !0)), E ? Object.freeze(V) : V);
      }
      function $h(s, a) {
        return at(s.lower, a.lower) === 0 && at(s.upper, a.upper) === 0 && !!s.lowerOpen == !!a.lowerOpen && !!s.upperOpen == !!a.upperOpen;
      }
      function cy(s, a) {
        return function(h, g, b, E) {
          if (h === void 0) return g !== void 0 ? -1 : 0;
          if (g === void 0) return 1;
          if ((g = at(h, g)) === 0) {
            if (b && E) return 0;
            if (b) return 1;
            if (E) return -1;
          }
          return g;
        }(s.lower, a.lower, s.lowerOpen, a.lowerOpen) <= 0 && 0 <= function(h, g, b, E) {
          if (h === void 0) return g !== void 0 ? 1 : 0;
          if (g === void 0) return -1;
          if ((g = at(h, g)) === 0) {
            if (b && E) return 0;
            if (b) return -1;
            if (E) return 1;
          }
          return g;
        }(s.upper, a.upper, s.upperOpen, a.upperOpen);
      }
      function fy(s, a, h, g) {
        s.subscribers.add(h), g.addEventListener("abort", function() {
          var b, E;
          s.subscribers.delete(h), s.subscribers.size === 0 && (b = s, E = a, setTimeout(function() {
            b.subscribers.size === 0 && He(E, b);
          }, 3e3));
        });
      }
      var hy = { stack: "dbcore", level: 0, name: "Cache", create: function(s) {
        var a = s.schema.name;
        return r(r({}, s), { transaction: function(h, g, b) {
          var E, O, N = s.transaction(h, g, b);
          return g === "readwrite" && (O = (E = new AbortController()).signal, b = function(U) {
            return function() {
              if (E.abort(), g === "readwrite") {
                for (var j = /* @__PURE__ */ new Set(), W = 0, P = h; W < P.length; W++) {
                  var V = P[W], $ = Ri["idb://".concat(a, "/").concat(V)];
                  if ($) {
                    var H = s.table(V), Y = $.optimisticOps.filter(function(Ae) {
                      return Ae.trans === N;
                    });
                    if (N._explicit && U && N.mutatedParts) for (var z = 0, Q = Object.values($.queries.query); z < Q.length; z++) for (var re = 0, ne = (be = Q[z]).slice(); re < ne.length; re++) Cu((de = ne[re]).obsSet, N.mutatedParts) && (He(be, de), de.subscribers.forEach(function(Ae) {
                      return j.add(Ae);
                    }));
                    else if (0 < Y.length) {
                      $.optimisticOps = $.optimisticOps.filter(function(Ae) {
                        return Ae.trans !== N;
                      });
                      for (var ae = 0, pe = Object.values($.queries.query); ae < pe.length; ae++) for (var be, de, ge, _e = 0, Ie = (be = pe[ae]).slice(); _e < Ie.length; _e++) (de = Ie[_e]).res != null && N.mutatedParts && (U && !de.dirty ? (ge = Object.isFrozen(de.res), ge = Uh(de.res, de.req, Y, H, de, ge), de.dirty ? (He(be, de), de.subscribers.forEach(function(Ae) {
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
          }, N.addEventListener("abort", b(!1), { signal: O }), N.addEventListener("error", b(!1), { signal: O }), N.addEventListener("complete", b(!0), { signal: O })), N;
        }, table: function(h) {
          var g = s.table(h), b = g.schema.primaryKey;
          return r(r({}, g), { mutate: function(E) {
            var O = q.trans;
            if (b.outbound || O.db._options.cache === "disabled" || O.explicit || O.idbtrans.mode !== "readwrite") return g.mutate(E);
            var N = Ri["idb://".concat(a, "/").concat(h)];
            return N ? (O = g.mutate(E), E.type !== "add" && E.type !== "put" || !(50 <= E.values.length || Lu(b, E).some(function(U) {
              return U == null;
            })) ? (N.optimisticOps.push(E), E.mutatedParts && ba(E.mutatedParts), O.then(function(U) {
              0 < U.numFailures && (He(N.optimisticOps, E), (U = Mh(0, E, U)) && N.optimisticOps.push(U), E.mutatedParts && ba(E.mutatedParts));
            }), O.catch(function() {
              He(N.optimisticOps, E), E.mutatedParts && ba(E.mutatedParts);
            })) : O.then(function(U) {
              var j = Mh(0, r(r({}, E), { values: E.values.map(function(W, P) {
                var V;
                return U.failures[P] ? W : (W = (V = b.keyPath) !== null && V !== void 0 && V.includes(".") ? Se(W) : r({}, W), oe(W, b.keyPath, U.results[P]), W);
              }) }), U);
              N.optimisticOps.push(j), queueMicrotask(function() {
                return E.mutatedParts && ba(E.mutatedParts);
              });
            }), O) : g.mutate(E);
          }, query: function(E) {
            if (!Lh(q, g) || !qh("query", E)) return g.query(E);
            var O = ((j = q.trans) === null || j === void 0 ? void 0 : j.db._options.cache) === "immutable", P = q, N = P.requery, U = P.signal, j = function(H, Y, z, Q) {
              var re = Ri["idb://".concat(H, "/").concat(Y)];
              if (!re) return [];
              if (!(Y = re.queries[z])) return [null, !1, re, null];
              var ne = Y[(Q.query ? Q.query.index.name : null) || ""];
              if (!ne) return [null, !1, re, null];
              switch (z) {
                case "query":
                  var ae = ne.find(function(pe) {
                    return pe.req.limit === Q.limit && pe.req.values === Q.values && $h(pe.req.query.range, Q.query.range);
                  });
                  return ae ? [ae, !0, re, ne] : [ne.find(function(pe) {
                    return ("limit" in pe.req ? pe.req.limit : 1 / 0) >= Q.limit && (!Q.values || pe.req.values) && cy(pe.req.query.range, Q.query.range);
                  }), !1, re, ne];
                case "count":
                  return ae = ne.find(function(pe) {
                    return $h(pe.req.query.range, Q.query.range);
                  }), [ae, !!ae, re, ne];
              }
            }(a, h, "query", E), W = j[0], P = j[1], V = j[2], $ = j[3];
            return W && P ? W.obsSet = E.obsSet : (P = g.query(E).then(function(H) {
              var Y = H.result;
              if (W && (W.res = Y), O) {
                for (var z = 0, Q = Y.length; z < Q; ++z) Object.freeze(Y[z]);
                Object.freeze(Y);
              } else H.result = Se(Y);
              return H;
            }).catch(function(H) {
              return $ && W && He($, W), Promise.reject(H);
            }), W = { obsSet: E.obsSet, promise: P, subscribers: /* @__PURE__ */ new Set(), type: "query", req: E, dirty: !1 }, $ ? $.push(W) : ($ = [W], (V = V || (Ri["idb://".concat(a, "/").concat(h)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[E.query.index.name || ""] = $)), fy(W, $, N, U), W.promise.then(function(H) {
              return { result: Uh(H.result, E, V == null ? void 0 : V.optimisticOps, g, W, O) };
            });
          } });
        } });
      } };
      function wa(s, a) {
        return new Proxy(s, { get: function(h, g, b) {
          return g === "db" ? a : Reflect.get(h, g, b);
        } });
      }
      var En = (Bt.prototype.version = function(s) {
        if (isNaN(s) || s < 0.1) throw new he.Type("Given version is not a positive number");
        if (s = Math.round(10 * s) / 10, this.idbdb || this._state.isBeingOpened) throw new he.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, s);
        var a = this._versions, h = a.filter(function(g) {
          return g._cfg.version === s;
        })[0];
        return h || (h = new this.Version(s), a.push(h), a.sort(ty), h.stores({}), this._state.autoSchema = !1, h);
      }, Bt.prototype._whenReady = function(s) {
        var a = this;
        return this.idbdb && (this._state.openComplete || q.letThrough || this._vip) ? s() : new f(function(h, g) {
          if (a._state.openComplete) return g(new he.DatabaseClosed(a._state.dbOpenError));
          if (!a._state.isBeingOpened) {
            if (!a._state.autoOpen) return void g(new he.DatabaseClosed());
            a.open().catch(me);
          }
          a._state.dbReadyPromise.then(h, g);
        }).then(s);
      }, Bt.prototype.use = function(s) {
        var a = s.stack, h = s.create, g = s.level, b = s.name;
        return b && this.unuse({ stack: a, name: b }), s = this._middlewares[a] || (this._middlewares[a] = []), s.push({ stack: a, create: h, level: g ?? 10, name: b }), s.sort(function(E, O) {
          return E.level - O.level;
        }), this;
      }, Bt.prototype.unuse = function(s) {
        var a = s.stack, h = s.name, g = s.create;
        return a && this._middlewares[a] && (this._middlewares[a] = this._middlewares[a].filter(function(b) {
          return g ? b.create !== g : !!h && b.name !== h;
        })), this;
      }, Bt.prototype.open = function() {
        var s = this;
        return Ai(B, function() {
          return sy(s);
        });
      }, Bt.prototype._close = function() {
        var s = this._state, a = ws.indexOf(this);
        if (0 <= a && ws.splice(a, 1), this.idbdb) {
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
      }, Bt.prototype.close = function(h) {
        var a = (h === void 0 ? { disableAutoOpen: !0 } : h).disableAutoOpen, h = this._state;
        a ? (h.isBeingOpened && h.cancelOpen(new he.DatabaseClosed()), this._close(), h.autoOpen = !1, h.dbOpenError = new he.DatabaseClosed()) : (this._close(), h.autoOpen = this._options.autoOpen || h.isBeingOpened, h.openComplete = !1, h.dbOpenError = null);
      }, Bt.prototype.delete = function(s) {
        var a = this;
        s === void 0 && (s = { disableAutoOpen: !0 });
        var h = 0 < arguments.length && typeof arguments[0] != "object", g = this._state;
        return new f(function(b, E) {
          function O() {
            a.close(s);
            var N = a._deps.indexedDB.deleteDatabase(a.name);
            N.onsuccess = Te(function() {
              var U, j, W;
              U = a._deps, j = a.name, W = U.indexedDB, U = U.IDBKeyRange, Ou(W) || j === aa || ku(W, U).delete(j).catch(me), b();
            }), N.onerror = nn(E), N.onblocked = a._fireOnBlocked;
          }
          if (h) throw new he.InvalidArgument("Invalid closeOptions argument to db.delete()");
          g.isBeingOpened ? g.dbReadyPromise.then(O) : O();
        });
      }, Bt.prototype.backendDB = function() {
        return this.idbdb;
      }, Bt.prototype.isOpen = function() {
        return this.idbdb !== null;
      }, Bt.prototype.hasBeenClosed = function() {
        var s = this._state.dbOpenError;
        return s && s.name === "DatabaseClosed";
      }, Bt.prototype.hasFailed = function() {
        return this._state.dbOpenError !== null;
      }, Bt.prototype.dynamicallyOpened = function() {
        return this._state.autoSchema;
      }, Object.defineProperty(Bt.prototype, "tables", { get: function() {
        var s = this;
        return u(this._allTables).map(function(a) {
          return s._allTables[a];
        });
      }, enumerable: !1, configurable: !0 }), Bt.prototype.transaction = function() {
        var s = (function(a, h, g) {
          var b = arguments.length;
          if (b < 2) throw new he.InvalidArgument("Too few arguments");
          for (var E = new Array(b - 1); --b; ) E[b - 1] = arguments[b];
          return g = E.pop(), [a, Ce(E), g];
        }).apply(this, arguments);
        return this._transaction.apply(this, s);
      }, Bt.prototype._transaction = function(s, a, h) {
        var g = this, b = q.trans;
        b && b.db === this && s.indexOf("!") === -1 || (b = null);
        var E, O, N = s.indexOf("?") !== -1;
        s = s.replace("!", "").replace("?", "");
        try {
          if (O = a.map(function(j) {
            if (j = j instanceof g.Table ? j.name : j, typeof j != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return j;
          }), s == "r" || s === vu) E = vu;
          else {
            if (s != "rw" && s != gu) throw new he.InvalidArgument("Invalid transaction mode: " + s);
            E = gu;
          }
          if (b) {
            if (b.mode === vu && E === gu) {
              if (!N) throw new he.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              b = null;
            }
            b && O.forEach(function(j) {
              if (b && b.storeNames.indexOf(j) === -1) {
                if (!N) throw new he.SubTransaction("Table " + j + " not included in parent transaction.");
                b = null;
              }
            }), N && b && !b.active && (b = null);
          }
        } catch (j) {
          return b ? b._promise(null, function(W, P) {
            P(j);
          }) : Dt(j);
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
              })) : Dt(ne);
            }
            var Q, re = Ve(H);
            return re && At(), Y = f.follow(function() {
              var ne;
              (Q = H.call(z, z)) && (re ? (ne = jt.bind(null, null), Q.then(ne, ne)) : typeof Q.next == "function" && typeof Q.throw == "function" && (Q = Bu(Q)));
            }, Y), (Q && typeof Q.then == "function" ? f.resolve(Q).then(function(ne) {
              return z.active ? ne : Dt(new he.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : Y.then(function() {
              return Q;
            })).then(function(ne) {
              return $ && z._resolve(), z._completion.then(function() {
                return ne;
              });
            }).catch(function(ne) {
              return z._reject(ne), Dt(ne);
            });
          });
        }).bind(null, this, E, O, b, h);
        return b ? b._promise(E, U, "lock") : q.trans ? Ai(q.transless, function() {
          return g._whenReady(U);
        }) : this._whenReady(U);
      }, Bt.prototype.table = function(s) {
        if (!_(this._allTables, s)) throw new he.InvalidTable("Table ".concat(s, " does not exist"));
        return this._allTables[s];
      }, Bt);
      function Bt(s, a) {
        var h = this;
        this._middlewares = {}, this.verno = 0;
        var g = Bt.dependencies;
        this._options = a = r({ addons: Bt.addons, autoOpen: !0, indexedDB: g.indexedDB, IDBKeyRange: g.IDBKeyRange, cache: "cloned" }, a), this._deps = { indexedDB: a.indexedDB, IDBKeyRange: a.IDBKeyRange }, g = a.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
        var b, E, O, N, U, j = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: me, dbReadyPromise: null, cancelOpen: me, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: a.autoOpen };
        j.dbReadyPromise = new f(function(P) {
          j.dbReadyResolve = P;
        }), j.openCanceller = new f(function(P, V) {
          j.cancelOpen = V;
        }), this._state = j, this.name = s, this.on = bo(this, "populate", "blocked", "versionchange", "close", { ready: [Rt, me] }), this.on.ready.subscribe = X(this.on.ready.subscribe, function(P) {
          return function(V, $) {
            Bt.vip(function() {
              var H, Y = h._state;
              Y.openComplete ? (Y.dbOpenError || f.resolve().then(V), $ && P(V)) : Y.onReadyBeingFired ? (Y.onReadyBeingFired.push(V), $ && P(V)) : (P(V), H = h, $ || P(function z() {
                H.on.ready.unsubscribe(V), H.on.ready.unsubscribe(z);
              }));
            });
          };
        }), this.Collection = (b = this, _o(Y0.prototype, function(Q, z) {
          this.db = b;
          var $ = mh, H = null;
          if (z) try {
            $ = z();
          } catch (re) {
            H = re;
          }
          var Y = Q._ctx, z = Y.table, Q = z.hook.reading.fire;
          this._ctx = { table: z, index: Y.index, isPrimKey: !Y.index || z.schema.primKey.keyPath && Y.index === z.schema.primKey.name, range: $, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: H, or: Y.or, valueMapper: Q !== je ? Q : null };
        })), this.Table = (E = this, _o(wh.prototype, function(P, V, $) {
          this.db = E, this._tx = $, this.name = P, this.schema = V, this.hook = E._allTables[P] ? E._allTables[P].hook : bo(null, { creating: [ct, me], reading: [yt, je], updating: [qe, me], deleting: [st, me] });
        })), this.Transaction = (O = this, _o(Z0.prototype, function(P, V, $, H, Y) {
          var z = this;
          this.db = O, this.mode = P, this.storeNames = V, this.schema = $, this.chromeTransactionDurability = H, this.idbtrans = null, this.on = bo(this, "complete", "error", "abort"), this.parent = Y || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new f(function(Q, re) {
            z._resolve = Q, z._reject = re;
          }), this._completion.then(function() {
            z.active = !1, z.on.complete.fire();
          }, function(Q) {
            var re = z.active;
            return z.active = !1, z.on.error.fire(Q), z.parent ? z.parent._reject(Q) : re && z.idbtrans && z.idbtrans.abort(), Dt(Q);
          });
        })), this.Version = (N = this, _o(iy.prototype, function(P) {
          this.db = N, this._cfg = { version: P, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (U = this, _o(kh.prototype, function(P, V, $) {
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
        }), this._maxKey = So(a.IDBKeyRange), this._createTransaction = function(P, V, $, H) {
          return new h.Transaction(P, V, $, h._options.chromeTransactionDurability, H);
        }, this._fireOnBlocked = function(P) {
          h.on("blocked").fire(P), ws.filter(function(V) {
            return V.name === h.name && V !== h && !V._state.vcFired;
          }).map(function(V) {
            return V.on("versionchange").fire(P);
          });
        }, this.use(uy), this.use(hy), this.use(ly), this.use(oy), this.use(ay);
        var W = new Proxy(this, { get: function(P, V, $) {
          if (V === "_vip") return !0;
          if (V === "table") return function(Y) {
            return wa(h.table(Y), W);
          };
          var H = Reflect.get(P, V, $);
          return H instanceof wh ? wa(H, W) : V === "tables" ? H.map(function(Y) {
            return wa(Y, W);
          }) : V === "_createTransaction" ? function() {
            return wa(H.apply(this, arguments), W);
          } : H;
        } });
        this.vip = W, g.forEach(function(P) {
          return P(h);
        });
      }
      var xa, qr = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", py = (Mu.prototype.subscribe = function(s, a, h) {
        return this._subscribe(s && typeof s != "function" ? s : { next: s, error: a, complete: h });
      }, Mu.prototype[qr] = function() {
        return this;
      }, Mu);
      function Mu(s) {
        this._subscribe = s;
      }
      try {
        xa = { indexedDB: o.indexedDB || o.mozIndexedDB || o.webkitIndexedDB || o.msIndexedDB, IDBKeyRange: o.IDBKeyRange || o.webkitIDBKeyRange };
      } catch {
        xa = { indexedDB: null, IDBKeyRange: null };
      }
      function jh(s) {
        var a, h = !1, g = new py(function(b) {
          var E = Ve(s), O, N = !1, U = {}, j = {}, W = { get closed() {
            return N;
          }, unsubscribe: function() {
            N || (N = !0, O && O.abort(), P && $n.storagemutated.unsubscribe($));
          } };
          b.start && b.start(W);
          var P = !1, V = function() {
            return du(H);
          }, $ = function(Y) {
            Ia(U, Y), Cu(j, U) && V();
          }, H = function() {
            var Y, z, Q;
            !N && xa.indexedDB && (U = {}, Y = {}, O && O.abort(), O = new AbortController(), Q = function(re) {
              var ne = xe();
              try {
                E && At();
                var ae = Pt(s, re);
                return ae = E ? ae.finally(jt) : ae;
              } finally {
                ne && Je();
              }
            }(z = { subscr: Y, signal: O.signal, requery: V, querier: s, trans: null }), Promise.resolve(Q).then(function(re) {
              h = !0, a = re, N || z.signal.aborted || (U = {}, function(ne) {
                for (var ae in ne) if (_(ne, ae)) return;
                return 1;
              }(j = Y) || P || ($n(Eo, $), P = !0), du(function() {
                return !N && b.next && b.next(re);
              }));
            }, function(re) {
              h = !1, ["DatabaseClosedError", "AbortError"].includes(re == null ? void 0 : re.name) || N || du(function() {
                N || b.error && b.error(re);
              });
            }));
          };
          return setTimeout(V, 0), W;
        });
        return g.hasValue = function() {
          return h;
        }, g.getValue = function() {
          return a;
        }, g;
      }
      var Ti = En;
      function Uu(s) {
        var a = jn;
        try {
          jn = !0, $n.storagemutated.fire(s), Du(s, !0);
        } finally {
          jn = a;
        }
      }
      x(Ti, r(r({}, et), { delete: function(s) {
        return new Ti(s, { addons: [] }).delete();
      }, exists: function(s) {
        return new Ti(s, { addons: [] }).open().then(function(a) {
          return a.close(), !0;
        }).catch("NoSuchDatabaseError", function() {
          return !1;
        });
      }, getDatabaseNames: function(s) {
        try {
          return a = Ti.dependencies, h = a.indexedDB, a = a.IDBKeyRange, (Ou(h) ? Promise.resolve(h.databases()).then(function(g) {
            return g.map(function(b) {
              return b.name;
            }).filter(function(b) {
              return b !== aa;
            });
          }) : ku(h, a).toCollection().primaryKeys()).then(s);
        } catch {
          return Dt(new he.MissingAPI());
        }
        var a, h;
      }, defineClass: function() {
        return function(s) {
          c(this, s);
        };
      }, ignoreTransaction: function(s) {
        return q.trans ? Ai(q.transless, s) : s();
      }, vip: Ru, async: function(s) {
        return function() {
          try {
            var a = Bu(s.apply(this, arguments));
            return a && typeof a.then == "function" ? a : f.resolve(a);
          } catch (h) {
            return Dt(h);
          }
        };
      }, spawn: function(s, a, h) {
        try {
          var g = Bu(s.apply(h, a || []));
          return g && typeof g.then == "function" ? g : f.resolve(g);
        } catch (b) {
          return Dt(b);
        }
      }, currentTransaction: { get: function() {
        return q.trans || null;
      } }, waitFor: function(s, a) {
        return a = f.resolve(typeof s == "function" ? Ti.ignoreTransaction(s) : s).timeout(a || 6e4), q.trans ? q.trans.waitFor(a) : a;
      }, Promise: f, debug: { get: function() {
        return Me;
      }, set: function(s) {
        Qe(s);
      } }, derive: K, extend: c, props: x, override: X, Events: bo, on: $n, liveQuery: jh, extendObservabilitySet: Ia, getByKeyPath: fe, setByKeyPath: oe, delByKeyPath: function(s, a) {
        typeof a == "string" ? oe(s, a, void 0) : "length" in a && [].map.call(a, function(h) {
          oe(s, h, void 0);
        });
      }, shallowClone: ke, deepClone: Se, getObjectDiff: Fu, cmp: at, asap: ce, minKey: -1 / 0, addons: [], connections: ws, errnames: lt, dependencies: xa, cache: Ri, semVer: "4.0.11", version: "4.0.11".split(".").map(function(s) {
        return parseInt(s);
      }).reduce(function(s, a, h) {
        return s + a / Math.pow(10, 2 * h);
      }) })), Ti.maxKey = So(Ti.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && ($n(Eo, function(s) {
        jn || (s = new CustomEvent(bu, { detail: s }), jn = !0, dispatchEvent(s), jn = !1);
      }), addEventListener(bu, function(s) {
        s = s.detail, jn || Uu(s);
      }));
      var Ss, jn = !1, Kh = function() {
      };
      return typeof BroadcastChannel < "u" && ((Kh = function() {
        (Ss = new BroadcastChannel(bu)).onmessage = function(s) {
          return s.data && Uu(s.data);
        };
      })(), typeof Ss.unref == "function" && Ss.unref(), $n(Eo, function(s) {
        jn || Ss.postMessage(s);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(s) {
        if (!En.disableBfCache && s.persisted) {
          Me && console.debug("Dexie: handling persisted pagehide"), Ss != null && Ss.close();
          for (var a = 0, h = ws; a < h.length; a++) h[a].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(s) {
        !En.disableBfCache && s.persisted && (Me && console.debug("Dexie: handling persisted pageshow"), Kh(), Uu({ all: new Xt(-1 / 0, [[]]) }));
      })), f.rejectionMapper = function(s, a) {
        return !s || s instanceof Ze || s instanceof TypeError || s instanceof SyntaxError || !s.name || !Le[s.name] ? s : (a = new Le[s.name](a || s.message, s), "stack" in s && D(a, "stack", { get: function() {
          return this.inner.stack;
        } }), a);
      }, Qe(Me), r(En, Object.freeze({ __proto__: null, Dexie: En, liveQuery: jh, Entity: Ih, cmp: at, PropModification: wo, replacePrefix: function(s, a) {
        return new wo({ replacePrefix: [s, a] });
      }, add: function(s) {
        return new wo({ add: s });
      }, remove: function(s) {
        return new wo({ remove: s });
      }, default: En, RangeSet: Xt, mergeRanges: Oo, rangesOverlap: Nh }), { default: En }), En;
    });
  }(Pa)), Pa.exports;
}
var RI = OI();
const hf = /* @__PURE__ */ Af(RI), Sv = Symbol.for("Dexie"), qt = globalThis[Sv] || (globalThis[Sv] = hf);
if (hf.semVer !== qt.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${hf.semVer} and ${qt.semVer}`);
const {
  liveQuery: t_,
  mergeRanges: r_,
  rangesOverlap: n_,
  RangeSet: i_,
  cmp: s_,
  Entity: o_,
  PropModification: a_,
  replacePrefix: u_,
  add: l_,
  remove: c_
} = qt;
var Wr, jr, qs, Ms, un, qi, Us;
const eu = class eu {
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
    ee(this, qs);
    // array item -> serial number
    ee(this, Ms, new Array());
    // serial number -> array item
    ee(this, un, /* @__PURE__ */ new Map());
    // string-encoded object -> value
    ee(this, qi);
    // object item -> serial number
    ee(this, Us, new Array());
  }
  get size() {
    return p(this, Wr).size + p(this, jr).size + p(this, un).size;
  }
  /** Returns the value (T) associated with `key`, else `undefined`. */
  get(e) {
    if (typeof e != "object" || e === null)
      return p(this, Wr).get(e);
    if (Array.isArray(e)) {
      const t = this.encodeExistingKey(e, p(this, qs));
      return t !== void 0 ? p(this, jr).get(t) : void 0;
    } else {
      if (!p(this, qi))
        return;
      const t = this.objectToArray(e), r = this.encodeExistingKey(t, p(this, qi));
      return r !== void 0 ? p(this, un).get(r) : void 0;
    }
  }
  /** Sets the value of `key` to `value`, replacing any existing value. */
  set(e, t) {
    typeof e != "object" || e === null ? p(this, Wr).set(e, t) : Array.isArray(e) ? p(this, jr).set(this.encodeArrayKey(e), t) : p(this, un).set(this.encodeObjectKey(e), t);
  }
  /** Adds a new key `key` with value `value` and returns true;
   *  if `key` already has a value, does nothing and returns false. */
  insert(e, t) {
    return typeof e != "object" || e === null ? Lc(p(this, Wr), e, t) : Array.isArray(e) ? Lc(p(this, jr), this.encodeArrayKey(e), t) : Lc(p(this, un), this.encodeObjectKey(e), t);
  }
  /** Returns the value (T) associated with the `key`.
   *  If there isn't one yet, it calls the `makeValue` function to create one and adds it.
   *  > Note:  With complex keys this is more efficient than calling `get` and then `insert`. */
  upsert(e, t) {
    return typeof e != "object" || e === null ? qc(p(this, Wr), e, t) : Array.isArray(e) ? qc(p(this, jr), this.encodeArrayKey(e), t) : qc(p(this, un), this.encodeObjectKey(e), t);
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  *entries() {
    for (let e of p(this, Wr).entries())
      yield e;
    for (let [e, t] of p(this, jr).entries())
      yield [this.decodeArrayKey(e), t];
    for (let [e, t] of p(this, un).entries())
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
    for (let e of p(this, un).values())
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
    let t = p(this, qs);
    return t || (t = G(this, qs, new eu())), e.map((r) => t.upsert(r, () => (p(this, Ms).push(r), p(this, Ms).length - 1))).toString();
  }
  /** Converts an encoded array key back into the same array. */
  decodeArrayKey(e) {
    return e !== "" ? e.split(",").map((t) => p(this, Ms)[Number(t)]) : [];
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
    let t = p(this, qi);
    return t || (t = G(this, qi, new eu())), this.objectToArray(e).map((i) => t.upsert(i, () => (p(this, Us).push(i), p(this, Us).length - 1))).toString();
  }
  /** Converts an encoded object key back into the same object. */
  decodeObjectKey(e) {
    if (e === "")
      return {};
    const t = e.split(",").map((o) => p(this, Us)[Number(o)]), r = t.pop();
    De(t.length === r.length);
    let i = {};
    for (let o = 0; o < r.length; ++o)
      i[r[o]] = t[o];
    return i;
  }
  // serial number -> object item
};
Wr = new WeakMap(), jr = new WeakMap(), qs = new WeakMap(), Ms = new WeakMap(), un = new WeakMap(), qi = new WeakMap(), Us = new WeakMap();
let Ja = eu;
function Lc(n, e, t) {
  return n.has(e) ? !1 : (n.set(e, t), !0);
}
function qc(n, e, t) {
  let r = n.get(e);
  return r === void 0 && (r = t(), n.set(e, r)), r;
}
class Ei {
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
class E0 {
  constructor() {
    ve(this, "receiver");
  }
  then(e) {
    return this.receiver = e;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async run(e) {
    return this.receiver.start(), this.receiver.next(new Io(e)) ? (this.receiver.end(), !0) : !1;
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
class Za extends Error {
  constructor() {
    super("Query interrupted"), this.name = "InterruptedQueryError";
  }
}
var Yr, ln, zo, Mi, $s;
class S0 extends E0 {
  constructor(t) {
    var r, i;
    super();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ve(this, "collection");
    ve(this, "alias");
    ee(this, Yr);
    // The index being searched, if any
    ee(this, ln);
    // Index constraint(s)
    ee(this, zo);
    // Indexed properties to sort by
    ee(this, Mi);
    // True if deleted revs must be detected
    ee(this, $s, !1);
    if (this.config = t, this.collection = t.collection, this.alias = t.alias, G(this, Yr, t.index), G(this, Mi, !0), (r = t.indexedWhereOrSort) != null && r.length) {
      yi(t.index, "config.index");
      const o = t.indexedWhereOrSort.map((u) => u instanceof ps ? u : u.key);
      t.indexedWhereOrSort[0] instanceof ps ? G(this, zo, t.indexedWhereOrSort) : G(this, ln, t.indexedWhereOrSort), o.some((u) => u.keypath !== qo && u.keypath !== Do) && G(this, Mi, !1);
    }
    ((i = this.config.filters) == null ? void 0 : i.length) === 0 && (this.config.filters = void 0);
  }
  async run(t) {
    G(this, $s, !1);
    const r = t instanceof Ya ? t : t.ctx, i = t instanceof Ya ? void 0 : t, o = this.receiver instanceof pf ? this.receiver : void 0;
    let u;
    i ? u = i.use(() => this.makeQuery()) : u = this.makeQuery(), this.receiver.start();
    let l = !0;
    if (u !== void 0) {
      const c = i ?? new Io(r);
      let I = await u.toArray();
      if (p(this, $s))
        throw new Za();
      for (let y of I) {
        let _;
        if (y.encrypted ? _ = await this.collection.decryptRevision(y) : _ = y, c.dataSources.set(this.config.alias, _), (!this.config.filters || this.config.filters.every((x) => c.eval(x))) && (l = o ? await o.asyncNext(c) : this.receiver.next(c), !l))
          break;
      }
      i == null || i.dataSources.delete(this.config.alias);
    }
    return l && (o ? await o.asyncEnd(r) : this.receiver.end()), !0;
  }
  /** Stops an active `run` call ASAP, causing its promise to reject. */
  interrupt() {
    G(this, $s, !0), this.receiver instanceof pf && this.receiver.interrupt();
  }
  /** Subroutine of `run` that creates the Dexie query. */
  makeQuery() {
    const t = this.collection.dexieTable;
    let r;
    if (!p(this, Yr))
      r = t.toCollection();
    else if (p(this, ln)) {
      const i = t.where(p(this, Yr).name);
      if (p(this, Yr).on.length === 1) {
        if (r = p(this, ln)[0].applyTo(i), r === void 0) return;
      } else {
        const o = [], u = [];
        for (const c of p(this, ln))
          mr(
            c instanceof sa,
            "compound index can't handle arrays"
          ), o.push(c.minValue ?? qt.minKey), u.push(c.maxValue ?? qt.maxKey);
        for (; o.length < p(this, Yr).on.length; )
          o.push(qt.minKey), u.push(qt.maxKey);
        const l = p(this, ln).at(-1);
        r = i.between(o, u, l.includeMin, l.includeMax);
      }
    } else
      r = t.orderBy(p(this, Yr).name);
    return this.config.reverse && (r = r.reverse()), p(this, Mi) && (r = r.filter((i) => ((i.flags ?? 0) & Sr) === 0)), r;
  }
  explain(t) {
    if (p(this, ln)) {
      t.push(`Search index "${p(this, Yr).name}" of collection ${this.collection.name} where (`);
      for (let r of p(this, ln))
        t.push(`    ${r}`);
      t[t.length - 1] += " )";
    } else p(this, zo) ? t.push(`Scan index "${p(this, Yr).name}" of collection ${this.collection.name}`) : t.push(`Scan collection ${this.collection.name}`);
    if (t[t.length - 1] += this.config.reverse ? " in reverse order:" : ":", p(this, Mi) && t.push("    - If doc is not deleted,"), this.config.filters)
      for (const r of this.config.filters)
        t.push(`    - If ${Ft(r)},`);
    super.explain(t);
  }
  // I've been interrupted
}
Yr = new WeakMap(), ln = new WeakMap(), zo = new WeakMap(), Mi = new WeakMap(), $s = new WeakMap();
var Gn, Ui;
class pf extends Ei {
  constructor(t, r) {
    super();
    ee(this, Gn);
    ee(this, Ui, !1);
    this.producer = t, this.joinType = r;
  }
  start() {
    G(this, Ui, !1), this.joinType === "OUTER" && G(this, Gn, /* @__PURE__ */ new Set()), super.start();
  }
  // LeftJoiner's `next` method has to be async since it runs a nested query.
  // But we don't want to make `Receiver.next()` async because it would be terrible for
  // performance. Instead we have a kludge where LeftJoiner has an `asyncNext` method instead,
  // and RevProducer is special-cased to call that when its receiver is a LeftJoiner.
  next(t) {
    Lo("Joiner.next should not be called");
  }
  async asyncNext(t) {
    let r = 0;
    return this.producer.then({
      start: () => {
        r = 0;
      },
      next: (i) => {
        var o;
        if (++r, p(this, Gn)) {
          const u = i.dataSources.get(this.producer.alias);
          (o = p(this, Gn)) == null || o.add(u.id);
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
    G(this, Ui, !0), this.producer.interrupt();
  }
  end() {
    Lo("Joiner.end should not be called");
  }
  async asyncEnd(t) {
    if (p(this, Gn) && !p(this, Ui)) {
      const r = await this.producer.collection.dexieTable.where(qo).noneOf(Array.of(...p(this, Gn).values())).filter((i) => !((i.flags ?? 0) & Sr)).toArray();
      if (r.length > 0) {
        const i = this.producer.alias;
        let o = [];
        for (const [u, l] of t.sourceTypes) {
          if (u === i)
            break;
          o.push(u);
        }
        for (const u of r) {
          if (p(this, Ui))
            break;
          const l = new Io(t);
          for (const I of o)
            l.dataSources.set(I, {});
          let c;
          u.encrypted ? c = await this.producer.collection.decryptRevision(u) : c = u, l.dataSources.set(i, c), this.receiver.next(l);
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
Gn = new WeakMap(), Ui = new WeakMap();
class TI extends Ei {
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
    e.push(`    - Scan unnested array ${Ft(this.onExpr)} as '${this.alias}':`), super.explain(e);
  }
}
var $i;
class CI extends Ei {
  constructor(t, r, i) {
    super();
    ee(this, $i);
    this.groupBy = t, this.having = r, this.ctx = i;
  }
  start() {
    G(this, $i, new Ja()), super.start();
  }
  next(t) {
    mr(this.groupBy.length === 1, "unsupported multiple GROUP BY conditions");
    const r = t.eval(this.groupBy[0]);
    return p(this, $i).upsert(r, () => {
      let o = new jo(this.ctx, !0);
      return o.receiver = this.receiver, o.start(), o;
    }).next(t);
  }
  end() {
    for (const t of p(this, $i).values())
      t.end(this.having);
    G(this, $i, void 0), super.end();
  }
  explain(t) {
    const r = this.groupBy.map(Ft).join(",  ");
    t.push(`Group rows by ${r}, and for each group:`), new jo(this.ctx, !0).explain(t), this.having && t.push(`Keep groups having ${Ft(this.having)}`), super.explain(t);
  }
}
$i = new WeakMap();
var Hn, Wn;
const hh = class hh extends Ei {
  constructor(t, r = !1) {
    super();
    ee(this, Hn);
    ee(this, Wn);
    this.ctx = t, this.isGrouped = r;
  }
  clone() {
    let t = new hh(this.ctx, this.isGrouped);
    return t.receiver = this.receiver, t;
  }
  start() {
    G(this, Wn, void 0), G(this, Hn, this.ctx.copyAggregates()), De(p(this, Hn) !== void 0, "no aggregates"), this.isGrouped || super.start();
  }
  next(t) {
    return t.use(() => {
      for (let r of p(this, Hn))
        r.accumulate();
    }), p(this, Wn) === void 0 && G(this, Wn, t.clone()), !0;
  }
  end(t) {
    const r = p(this, Wn) ?? new Io(this.ctx);
    r.aggregates = p(this, Hn), G(this, Wn, void 0), G(this, Hn, void 0), (!t || r.eval(t)) && this.receiver.next(r), this.isGrouped || super.end();
  }
  explain(t) {
    for (const r of this.ctx.copyAggregates())
      t.push(`    - Accumulate state for ${Ft(r.sourceExpression)}`);
    t.push("After aggregating,"), super.explain(t);
  }
};
Hn = new WeakMap(), Wn = new WeakMap();
let jo = hh;
class A0 extends Ei {
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
      r.endsWith(".*") || (i += `${r}: `), i += Ft(this.columnExprs[t++]), t < this.columnNames.length && (i += ","), e.push(i);
    }
    e[e.length - 1] += " }", super.explain(e);
  }
}
var js;
class NI extends A0 {
  constructor(t, r, i) {
    t = Array.of(...t);
    for (const o of i)
      t.push(o.expr);
    super(t, r);
    ee(this, js);
    this.sortExprs = i;
  }
  start() {
    G(this, js, []), super.start();
  }
  next(t) {
    return p(this, js).push(this.makeRow(t)), !0;
  }
  end() {
    const t = this.sortExprs, r = t.length;
    let i = p(this, js);
    i.sort((o, u) => {
      for (let l = -r; l < 0; ++l) {
        let c = Yt(o.at(l), u.at(l));
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
      let o = Ft(i.expr);
      return i.descending && (o += " descending"), o;
    });
    t.push(`With docs sorted by ${r.join(", ")},`), super.explain(t);
  }
}
js = new WeakMap();
var Ks;
class PI extends Ei {
  constructor() {
    super(...arguments);
    ee(this, Ks);
  }
  start() {
    G(this, Ks, new Ja()), super.start();
  }
  next(t) {
    return p(this, Ks).insert(t, null) ? this.receiver.next(t) : !0;
  }
  end() {
    G(this, Ks, void 0), super.end();
  }
  explain(t) {
    t.push("Remove identical rows"), super.explain(t);
  }
}
Ks = new WeakMap();
var zs, ji;
class DI extends Ei {
  constructor(t, r) {
    super();
    ee(this, zs, 0);
    ee(this, ji, 0);
    this.offsetExpr = t, this.limitExpr = r;
  }
  get offset() {
    return this.offsetExpr ? Gh(this.offsetExpr(), "query OFFSET") : 0;
  }
  get limit() {
    return this.limitExpr ? Gh(this.limitExpr(), "query LIMIT") : 1 / 0;
  }
  start() {
    G(this, zs, this.offset), G(this, ji, this.limit), super.start();
  }
  next(t) {
    return p(this, zs) > 0 ? (--Nr(this, zs)._, !0) : p(this, ji) > 0 ? (--Nr(this, ji)._, this.receiver.next(t) && p(this, ji) > 0) : !1;
  }
  explain(t) {
    this.offsetExpr && t.push(`Skip first ${Ft(this.offsetExpr)} rows`), this.limitExpr && t.push(`Limit to ${Ft(this.limitExpr)} rows`), super.explain(t);
  }
}
zs = new WeakMap(), ji = new WeakMap();
class BI extends Ei {
  constructor(e) {
    super(), this.aliases = e;
  }
  next(e) {
    let t = {}, r = 0;
    for (const i of this.aliases) {
      const o = e[r++];
      o !== void 0 && (i.endsWith(".*") && Vt(o) ? t = { ...t, ...o } : t[i] = o);
    }
    return this.receiver.next(t);
  }
}
class k0 {
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
const FI = 250, LI = 0, qI = 500;
var Yn, Gs, Go, kn, Vn, Jn, Zn, hr;
class MI {
  constructor(e) {
    ee(this, Yn, /* @__PURE__ */ new Set());
    // Query listeners
    ee(this, Gs, []);
    // My collection listeners
    ee(this, Go, 0);
    // Time DB last changed
    ee(this, kn);
    // Timer after coll changes
    ee(this, Vn);
    // Last known query result
    ee(this, Jn, !1);
    // True while executing query
    ee(this, Zn, !1);
    // If true, need to execute again
    ee(this, hr);
    this.query = e, G(this, hr, e.logger);
  }
  get hasListeners() {
    return p(this, Yn).size > 0;
  }
  addChangeListener(e) {
    return this.hasListeners || this.startListening(), p(this, Yn).add(e), new xf(() => {
      var t;
      (t = p(this, Yn)) == null || t.delete(e), this.hasListeners || this.stopListening();
    });
  }
  startListening() {
    p(this, hr).info`Query observer starting`;
    for (const e of this.query.collections()) {
      const t = e.addChangeListener((r) => this.collectionChanged(e));
      p(this, Gs).push(t);
    }
    this.executeQuery();
  }
  stopListening() {
    p(this, hr).info`Query observer stopping`, p(this, Gs).forEach((e) => e.remove()), G(this, Gs, []), p(this, kn) !== void 0 && (clearTimeout(p(this, kn)), G(this, kn, void 0)), p(this, Jn) && this.query.interrupt(), G(this, Vn, void 0), G(this, Zn, !1);
  }
  collectionChanged(e) {
    p(this, hr).info`Query observer notified collection ${e.name} changed`, this.trigger();
  }
  /** Schedules re-running the query to see if it changed. */
  trigger() {
    if (this.hasListeners && !p(this, kn)) {
      const e = Date.now(), t = e - p(this, Go) < FI ? qI : LI;
      G(this, Go, e), G(this, kn, setTimeout(() => {
        G(this, kn, void 0), this.hasListeners && this.executeQuery();
      }, t));
    }
  }
  executeQuery() {
    if (p(this, Jn)) {
      G(this, Zn, !0), p(this, hr).debug`Query observer will re-execute query when done`;
      return;
    }
    G(this, Jn, !0), G(this, Zn, !1), p(this, hr).info`Query observer executing query...`, this.query.execute().then((e) => {
      G(this, Jn, !1), this.hasListeners && (p(this, Vn) === void 0 ? (p(this, hr).debug`...Query observer got initial result`, G(this, Vn, e)) : fo(e, p(this, Vn)) ? p(this, hr).debug`...Query observer saw no change in results` : (G(this, Vn, e), this.callListeners(e)), p(this, Zn) && this.executeQuery());
    }).catch((e) => {
      G(this, Jn, !1), e instanceof Za ? p(this, hr).debug`...Query observer: query interrupted` : p(this, hr).error`Query observer: query failed with error ${e}`, p(this, Zn) && this.hasListeners && this.executeQuery();
    });
  }
  callListeners(e) {
    p(this, hr).info`Query observer notifying ${p(this, Yn).size} listeners!`;
    for (const t of p(this, Yn))
      try {
        t(e);
      } catch (r) {
        p(this, hr).error(`Exception in QueryChangeCallback: ${r}`);
      }
  }
}
Yn = new WeakMap(), Gs = new WeakMap(), Go = new WeakMap(), kn = new WeakMap(), Vn = new WeakMap(), Jn = new WeakMap(), Zn = new WeakMap(), hr = new WeakMap();
const Av = [
  "trace",
  "debug",
  "info",
  "warning",
  "error",
  "fatal"
];
function kv(n, e) {
  const t = Av.indexOf(n);
  if (t < 0) throw new TypeError(`Invalid log level: ${JSON.stringify(n)}.`);
  const r = Av.indexOf(e);
  if (r < 0) throw new TypeError(`Invalid log level: ${JSON.stringify(e)}.`);
  return t - r;
}
function O0(n = []) {
  return R0.getLogger(n);
}
const Mc = Symbol.for("logtape.rootLogger");
var R0 = class Kn {
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
    let t = Mc in globalThis ? globalThis[Mc] ?? null : null;
    return t == null && (t = new Kn(null, []), globalThis[Mc] = t), typeof e == "string" ? t.getChild(e) : e.length === 0 ? t : t.getChild(e);
  }
  getChild(e) {
    const t = typeof e == "string" ? e : e[0], r = this.children[t];
    let i = r instanceof Kn ? r : r == null ? void 0 : r.deref();
    return i == null && (i = new Kn(this, [...this.category, t]), this.children[t] = "WeakRef" in globalThis ? new WeakRef(i) : i), typeof e == "string" || e.length === 1 ? i : i.getChild(e.slice(1));
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
      const t = e instanceof Kn ? e : e.deref();
      t != null && t.resetDescendants();
    }
    this.reset();
  }
  with(e) {
    return new UI(this, { ...e });
  }
  filter(e) {
    var t;
    for (const r of this.filters) if (!r(e)) return !1;
    return this.filters.length < 1 ? ((t = this.parent) == null ? void 0 : t.filter(e)) ?? !0 : !0;
  }
  *getSinks(e) {
    if (!(this.lowestLevel === null || kv(e, this.lowestLevel) < 0)) {
      if (this.parent != null && this.parentSinks === "inherit") for (const t of this.parent.getSinks(e)) yield t;
      for (const t of this.sinks) yield t;
    }
  }
  emit(e, t) {
    if (!(this.lowestLevel === null || kv(e.level, this.lowestLevel) < 0 || !this.filter(e))) {
      for (const r of this.getSinks(e.level))
        if (!(t != null && t.has(r)))
          try {
            r(e);
          } catch (i) {
            const o = new Set(t);
            o.add(r), $I.log("fatal", "Failed to emit a log record to sink {sink}: {error}", {
              sink: r,
              error: i,
              record: e
            }, o);
          }
    }
  }
  log(e, t, r, i) {
    var c;
    const o = ((c = Kn.getLogger().contextLocalStorage) == null ? void 0 : c.getStore()) ?? {};
    let u;
    const l = typeof r == "function" ? {
      category: this.category,
      level: e,
      timestamp: Date.now(),
      get message() {
        return Ov(t, this.properties);
      },
      rawMessage: t,
      get properties() {
        return u == null && (u = {
          ...o,
          ...r()
        }), u;
      }
    } : {
      category: this.category,
      level: e,
      timestamp: Date.now(),
      message: Ov(t, {
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
    const i = ((c = Kn.getLogger().contextLocalStorage) == null ? void 0 : c.getStore()) ?? {};
    let o, u;
    function l() {
      if ((u == null || o == null) && (u = t((I, ...y) => (o = I, Rv(I, y))), o == null))
        throw new TypeError("No log record was made.");
      return [u, o];
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
    var u;
    const o = ((u = Kn.getLogger().contextLocalStorage) == null ? void 0 : u.getStore()) ?? {};
    this.emit({
      category: this.category,
      level: e,
      message: Rv(t, r),
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
}, UI = class T0 {
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
    return new T0(this.logger, {
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
const $I = R0.getLogger(["logtape", "meta"]);
function Ov(n, e) {
  const t = n.length;
  if (t === 0) return [""];
  if (!n.includes("{")) return [n];
  const r = [];
  let i = 0;
  for (let u = 0; u < t; u++) {
    const l = n[u];
    if (l === "{") {
      if ((u + 1 < t ? n[u + 1] : "") === "{") {
        u++;
        continue;
      }
      const I = n.indexOf("}", u + 1);
      if (I === -1) continue;
      const y = n.slice(i, u);
      r.push(y.replace(/{{/g, "{").replace(/}}/g, "}"));
      const _ = n.slice(u + 1, I);
      let x;
      const k = _.trim();
      k === "*" ? x = _ in e ? e[_] : "*" in e ? e["*"] : e : _ !== k ? x = _ in e ? e[_] : e[k] : x = e[_], r.push(x), u = I, i = u + 1;
    } else l === "}" && u + 1 < t && n[u + 1] === "}" && u++;
  }
  const o = n.slice(i);
  return r.push(o.replace(/{{/g, "{").replace(/}}/g, "}")), r;
}
function Rv(n, e) {
  const t = [];
  for (let r = 0; r < n.length; r++)
    t.push(n[r]), r < e.length && t.push(e[r]);
  return t;
}
const C0 = "CouchbaseLite", ah = O0([C0]), df = ah.getChild("DB"), jI = ah.getChild("Query");
var kt, pr, Ki, zi, Gi, Ho, Hi, Hs, Qn;
class KI {
  /** @internal */
  constructor(e, t) {
    /** The JSON form of the parsed query. @internal */
    ve(this, "selectExpr");
    /** The names of the result columns, i.e. the keys in a row object. */
    ve(this, "columnNames");
    /** @internal */
    ve(this, "logger");
    ee(this, kt, new Ya());
    // State for CompiledExprs to read
    ee(this, pr, /* @__PURE__ */ new Map());
    // Maps alias -> source/result info
    ee(this, Ki);
    // Head of pipeline
    ee(this, zi);
    // Tail of pipeline
    ee(this, Gi, {});
    ee(this, Ho);
    ee(this, Hi, !1);
    // Prevents reentrant `run` calls
    ee(this, Hs, !1);
    ee(this, Qn);
    this.database = e, this.logger = jI.with({ db: e.name });
    let r;
    typeof t == "string" ? (r = vI(t), this.selectExpr = r) : (this.selectExpr = t, r = t, m1(r));
    let i;
    for (let C of r.FROM) {
      let M, J;
      if ("COLLECTION" in C) {
        let ce = C.COLLECTION;
        ce === "_" && (ce = Da), C.SCOPE && (ce = C.SCOPE + "." + ce), J = this.database.getCollection(ce), "JOIN" in C ? (De(i !== void 0, "first FROM source can't be a JOIN"), M = "join") : (mr(i === void 0, "subsequent FROM sources must be JOINs"), M = "collection");
      } else
        M = "unnest";
      let X;
      if (C.AS !== void 0)
        X = C.AS;
      else if ("COLLECTION" in C)
        X = C.COLLECTION;
      else
        throw new Lr("UNNEST clause must have an AS");
      if (p(this, pr).has(X))
        throw new Lr(`Duplicate sources named "${X}"`);
      const le = { collection: J, source: C, type: M, alias: X };
      i || (i = le), p(this, pr).set(X, le), p(this, kt).sourceTypes.set(X, M);
    }
    let o = [], u = [];
    for (let C of r.WHAT) {
      let M;
      if (Array.isArray(C) && C[0] === "AS") {
        if (M = C[2], C = C[1], p(this, pr).has(M))
          throw new Lr(`Duplicate column alias "${M}"`);
        p(this, pr).set(M, {
          type: "result",
          alias: M,
          what: C
        });
      }
      o.push(M), u.push(C);
    }
    I1(
      r,
      p(this, pr),
      r.FROM.length === 1 ? i == null ? void 0 : i.alias : void 0
    );
    const l = u.map((C) => p(this, kt).compileWithAggregates(C));
    let c = [], I = 0;
    for (let C = 0; C < r.WHAT.length; ++C) {
      let M = o[C];
      if (M === void 0)
        for (M = this.defaultResultName(r.WHAT[C]); M === void 0 || c.includes(M); )
          M = `$${++I}`;
      else
        p(this, kt).results.set(M, l[C]);
      c.push(M);
    }
    this.columnNames = c, this.findResultSources();
    const y = new Set(r.WHERE ? Jd(r.WHERE) : []);
    let _;
    r.ORDER_BY !== void 0 && (_ = r.ORDER_BY.map((C) => GI(p(this, kt), C)));
    let x = /* @__PURE__ */ new Set(), k, D;
    e: for (const [C, M] of p(this, pr)) {
      switch (M.type) {
        case "collection": {
          k = this.makeRevProducer(
            M,
            y,
            _,
            x
          ), D = k;
          break;
        }
        case "join": {
          for (const le of Jd(M.source.ON))
            y.add(le);
          const J = M.source.JOIN, X = this.makeRevProducer(M, y, _, x);
          D = D.then(new pf(X, J));
          break;
        }
        case "unnest": {
          const J = p(this, kt).compile(M.source.UNNEST);
          D = D.then(new TI(J, C));
          break;
        }
        case "result":
          continue e;
      }
      x.add(M);
    }
    if (k ? yi(D) : (k = new E0(), D = k), G(this, Ki, k), r.GROUP_BY !== void 0) {
      const C = r.GROUP_BY.map((J) => p(this, kt).compile(J)), M = r.HAVING !== void 0 ? p(this, kt).compileWithAggregates(r.HAVING) : void 0;
      D = D.then(new CI(C, M, p(this, kt)));
    } else
      p(this, kt).hasAggregators && (D = D.then(new jo(p(this, kt))));
    let K;
    if (_ != null && _.length ? K = D.then(new NI(l, c, _)) : K = D.then(new A0(l, c)), r.DISTINCT && (K = K.then(new PI())), r.OFFSET !== void 0 || r.LIMIT !== void 0) {
      const C = (M, J) => {
        if (M !== void 0)
          return mr(Oc(M).size === 0, `invalid ${J} expression`), p(this, kt).compile(M);
      };
      K = K.then(new DI(
        C(r.OFFSET, "OFFSET"),
        C(r.LIMIT, "LIMIT")
      ));
    }
    G(this, zi, K.then(new BI(c)).then(new k0())), G(this, Ho, new Proxy(p(this, Gi), {
      set: (C, M, J) => (this.checkParameterName(M), C[M] = J, p(this, Qn) && !fo(J, p(this, Gi)[M]) && p(this, Qn).trigger(), !0)
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
    return p(this, Ho);
  }
  set parameters(e) {
    const t = p(this, kt).parameterNames.size, r = Object.entries(e);
    mr(r.length >= t, `All ${t} parameters must be set`);
    for (const [i, o] of r)
      this.checkParameterName(i), p(this, Gi)[i] = o;
  }
  /** The names of all query parameters. */
  get parameterNames() {
    return p(this, kt).parameterNames;
  }
  /** A string that describes in human-readable form the steps the query will perform
   *  when it runs. (Format subject to change without notice.) */
  get explanation() {
    let e = [];
    return p(this, Ki).explain(e), e.join(`
`);
  }
  async execute(e) {
    if (e)
      return this.run(e);
    {
      let t = new Array();
      if (await this.run((r) => t.push(r)))
        return t;
      throw new Za();
    }
  }
  /** Stops an active {@link execute} call ASAP. Does nothing if the query is not running. */
  interrupt() {
    p(this, Hi) && (G(this, Hs, !0), p(this, Ki).interrupt());
  }
  /** Registers a function that will be called when the query's results change, as a result of
   *  changes to documents or to a parameter value.
   *  @param callback  The function to call. Its parameter is the new query result array.
   *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
   *            remove the listener. */
  addChangeListener(e) {
    return p(this, Qn) || G(this, Qn, new MI(this)), p(this, Qn).addChangeListener(e);
  }
  /** Registers a custom N1QL function.
   *
   *  Registration is global: it will be available in all queries on all Databases.
   *  @param name  Function's name. Case-insensitive.
   *  @param implementation  The function itself. See the type {@link UserFunction} for details.
   *  @param options  Other options such as min/max arg counts. */
  registerUserFunction(e, t, r) {
    II(e, t, r);
  }
  /** All Collections used by this query. @internal */
  collections() {
    let e = /* @__PURE__ */ new Set();
    for (const t of p(this, pr).values())
      t.type !== "result" && t.collection && e.add(t.collection);
    return e;
  }
  //---- INTERNALS:
  checkParameterName(e) {
    mr(typeof e == "string", "Query parameter name must be a string"), mr(!e.startsWith("$"), "Don't use '$' prefix in query parameter names"), mr(p(this, kt).parameterNames.has(e), `"${e}" is not a parameter of this query`);
  }
  async run(e) {
    mr(!p(this, Hi), "query is already running"), p(this, kt).parameters.clear();
    for (const t of p(this, kt).parameterNames) {
      const r = p(this, Gi)[t];
      if (r === void 0)
        throw Error(`The query parameter "${t}" must have a value`);
      p(this, kt).parameters.set(t, r);
    }
    G(this, Hi, !0), G(this, Hs, !1);
    try {
      return p(this, zi).callback = (t) => (e(t), !p(this, Hs)), await p(this, Ki).run(p(this, kt)), p(this, zi).callback = void 0, p(this, zi).ok;
    } catch (t) {
      if (t instanceof Za)
        return !1;
      throw t;
    } finally {
      G(this, Hi, !1);
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
    for (const y of t) {
      const _ = this.asWhereClause(y, e, i);
      _ && o.push(_);
    }
    o.sort((y, _) => y.generality - _.generality);
    let u;
    if (r != null && r.length) {
      const [y, _] = this.expToKeyPath(r[0].expr.sourceExpression);
      _ != null && _.indexed && y === e && (u = _);
    }
    let l = !1, c = { collection: e.collection, alias: e.alias }, I;
    for (const y of e.collection.getIndexes()) {
      let _ = [];
      if (y.type === zn)
        for (const x of y.on) {
          const k = o.find((D) => D.key === x && D instanceof sa);
          if (k === void 0 || (_.push(k), k.generality > 1))
            break;
        }
      else {
        De(y.on.length === 1);
        const x = y.on[0], k = o.find((D) => D.key === x && D instanceof Fc);
        k && _.push(k);
      }
      _.length > 0 && (I === void 0 || _.length > I.length || _.at(-1).generality < I.at(-1).generality) && (I = _, c.index = y);
    }
    if (I) {
      c.indexedWhereOrSort = I;
      for (const y of I)
        t.delete(y.sourceExpression);
      I[0].key === u && (l = !0);
    } else u && (c.index = e.collection.indexOfProperty(u), c.indexedWhereOrSort = [u], l = !0);
    l && (c.reverse = r[0].descending ?? !1, r == null || r.splice(0, 1)), i.add(e);
    for (const y of Array.of(...t))
      this.exprUsesAllowedSources(y, i) && (c.filters || (c.filters = []), c.filters.push(p(this, kt).compile(y)), t.delete(y));
    return i.delete(e), new S0(c);
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
    let [i, o, u] = e;
    if (i === "ANY")
      return this.anyAsWhereClause(e, t, r);
    if (e.length > 3 && i !== "BETWEEN")
      return;
    let [l, c] = this.expToKeyPath(o);
    if (l !== t || c === void 0) {
      if ([o, u] = [u, o], [l, c] = this.expToKeyPath(o), l !== t || c === void 0)
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
    if (!this.exprUsesAllowedSources(u, r))
      return;
    const I = p(this, kt), y = I.compile(u);
    switch (i) {
      case "<":
      case "<=":
        return new Bc(e, c, void 0, y, !0, i === "<=");
      case ">":
      case ">=":
        return new Bc(e, c, y, void 0, i === ">=", !0);
      case "=":
      case "IS":
        return new xv(e, c, y);
      case "LIKE": {
        const _ = zI(I, y);
        if (typeof _ == "string") {
          const [x, k] = Hf(_);
          switch (x) {
            case 0:
              return new xv(e, c, I.compile(k));
            case 1:
              return new AI(e, c, k);
          }
        }
        break;
      }
      case "BETWEEN": {
        if (this.exprUsesAllowedSources(e[3], r))
          return new Bc(e, c, y, I.compile(e[3]));
        break;
      }
      case "IN":
        return new Fc(e, c, y);
    }
  }
  // Subroutine of asWhereClause() that handles 'ANY' expressions.
  anyAsWhereClause(e, t, r) {
    const [i, o, u, l] = e;
    let [c, I] = this.expToKeyPath(u);
    if (!(c !== t || I === void 0) && Nc(l, "=")) {
      let y;
      if (Nc(l[1], "?", o) ? y = l[2] : Nc(l[2], "?", o) && (y = l[1]), y && this.exprUsesAllowedSources(y, r))
        return new Fc(e, I, p(this, kt).compile(y));
    }
  }
  // True if `expr` uses only the data sources given in `allowedSources`.
  exprUsesAllowedSources(e, t) {
    for (const r of Oc(e)) {
      const i = p(this, pr).get(r);
      if (yi(i), i.type === "result") {
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
      const t = p(this, pr).get(yy(e[1]));
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
              r = Ma;
              break;
            case "sequence":
              r = Ua;
              break;
            case "expires":
              r = $a;
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
      if (p(this, pr).has(r)) {
        if (t === "." && e.starColumn)
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
    for (const [e, t] of p(this, pr))
      t.type === "result" && this.getResultSources(t);
  }
  getResultSources(e) {
    if (e.sources === void 0) {
      mr(!e._findingSources, `Result "${e.alias} has a circular dependency`), e._findingSources = !0;
      let t = /* @__PURE__ */ new Set();
      for (const r of Oc(e.what)) {
        const i = p(this, pr).get(r);
        if (yi(i), i.type !== "result")
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
kt = new WeakMap(), pr = new WeakMap(), Ki = new WeakMap(), zi = new WeakMap(), Gi = new WeakMap(), Ho = new WeakMap(), Hi = new WeakMap(), Hs = new WeakMap(), Qn = new WeakMap();
function zI(n, e) {
  try {
    return typeof e == "function" ? e() : n.compile(e)();
  } catch (t) {
    if (t instanceof ih || t instanceof y0)
      return;
    throw t;
  }
}
function GI(n, e) {
  let t;
  return Array.isArray(e) && (e[0] === "DESC" ? (t = !0, e = e[1]) : e[0] === "ASC" && (e = e[1])), { expr: n.compile(e), descending: t };
}
function N0(n) {
  return typeof n == "object" && !Array.isArray(n) && n !== null;
}
const Tv = "PBKDF2", HI = 5e6, WI = "Couchbase Lite for JavaScript", Uc = "AES-GCM", YI = 256, As = Symbol();
class Ko extends Error {
}
var tg, Wi;
tg = As;
const tu = class tu {
  constructor() {
    ve(this, tg);
    ee(this, Wi);
  }
  /** Creates a new, unlocked CryptoCodec whose key is derived from the given password. */
  static async create(e) {
    const t = new tu();
    return await t.generateKey(e), G(t, Wi, await t.encryptJSON(crypto.randomUUID())), t;
  }
  /** Creates a CryptoCodec for use with existing encrypted data. It starts locked.
   *  @param challenge  Any existing encrypted data, usually the prior codec's `challenge`. */
  static withChallenge(e) {
    const t = new tu();
    return G(t, Wi, e), t;
  }
  /** A small encrypted value which can be saved and then later used to reconstitute the
   *  codec by calling `CryptoCodec.withChallenge()`. */
  get challenge() {
    return p(this, Wi);
  }
  /** True if the password has been given and the codec is ready to encrypt or decrypt. */
  get isUnlocked() {
    return this[As] !== void 0;
  }
  /** Creates the encryption key, derived from the given password.
   *  If constructed with a challenge, will try to decrypt it with the key; if that fails,
   *  the codec ignores the key and returns false.
   *  If the codec wasn't constructed with a challenge, it creates one now by encrypting some
   *  random data with the key. */
  async unlock(e) {
    await this.generateKey(e);
    try {
      await this.decryptJSON(p(this, Wi));
    } catch {
      return this[As] = void 0, !1;
    }
    return !0;
  }
  /** Discards the encryption key. `unlock` must be called to use the codec again. */
  lock() {
    this[As] = void 0;
  }
  /** Encrypts binary data.
   *  @throws EncryptionError  if locked. */
  async encrypt(e) {
    const t = this.requiredKey("encrypt"), r = crypto.getRandomValues(new Uint8Array(12)), i = await crypto.subtle.encrypt({ name: Uc, iv: r }, t, e);
    return { data: new Uint8Array(i), iv: r };
  }
  /** Decrypts binary data.
   *  @throws EncryptionError  if locked. */
  async decrypt(e) {
    const t = this.requiredKey("decrypt"), r = { name: Uc, iv: e.iv };
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
    De(N0(t)), e.body = { ...e.body, ...t }, delete e.encrypted;
  }
  async generateKey(e) {
    const t = new TextEncoder(), r = await crypto.subtle.importKey(
      "raw",
      t.encode(e),
      Tv,
      !1,
      ["deriveBits", "deriveKey"]
    );
    this[As] = await crypto.subtle.deriveKey(
      {
        name: Tv,
        hash: "SHA-256",
        iterations: HI,
        salt: t.encode(WI)
      },
      r,
      { name: Uc, length: YI },
      !1,
      // key is not extractable
      ["encrypt", "decrypt"]
      // key is not wrappable
    );
  }
  requiredKey(e) {
    const t = this[As];
    if (!t)
      throw new Ko(`Cannot ${e} without key`);
    return t;
  }
};
Wi = new WeakMap();
let Qa = tu;
var Vr, cn;
class VI {
  constructor(e, t, r) {
    ee(this, Vr);
    ee(this, cn);
    this.database = e, G(this, Vr, t), G(this, cn, r);
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
        if (!p(this, cn))
          throw new Ko("Blob is encrypted");
        return new Uint8Array(await p(this, cn).decrypt({ data: t.contents, iv: t.iv }));
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
    if (p(this, cn)) {
      const i = await en.waitFor(p(this, cn).encrypt(e));
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
          const u = await en.waitFor(e.encrypt(i));
          o = { digest: r, contents: u.data, iv: u.iv };
        } else
          o = { digest: r, contents: i };
        await p(this, Vr).put(o);
      }
    }
    G(this, cn, e);
  }
  resetEncryption(e) {
    G(this, cn, e);
  }
}
Vr = new WeakMap(), cn = new WeakMap();
const vf = "r", an = "rw";
let Sn;
var Ws, Wo, dr, Xn, Br, Ys, Wt;
const ph = class ph {
  constructor(e) {
    /** The database's name. */
    ve(this, "name");
    /* {@link https://logtape.org LogTape} logger instance for this Database. */
    ve(this, "logger");
    ee(this, Ws, /* @__PURE__ */ new Set());
    //-------- TRANSACTIONS:
    ee(this, Wo, 0);
    /** Used as a callback in Blob objects. @internal */
    ve(this, "blobLoader", async (e, t) => await this.blobStore.getBlob(e));
    /** @internal  Exposed for testing */
    ve(this, "enableAutoExpiry", !0);
    ee(this, dr);
    ee(this, Xn, /* @__PURE__ */ new Map());
    ee(this, Br, {});
    ee(this, Ys);
    ee(this, Wt);
    this.config = e, this.name = e.name, this.logger = df.with({ db: this.name });
    const t = e.collections, r = {
      [Po]: "",
      [Xc]: "",
      [Yl]: "digest"
    };
    for (const [i, o] of Object.entries(t))
      Ps.validateName(i), r[i] = Ps.dexieIndexSpec(o);
    Object.keys(t).length === 0 && (r[Da] = Ps.dexieIndexSpec({})), G(this, Xn, new Map(Object.entries(t))), p(this, Xn).size === 0 && p(this, Xn).set(Da, {}), G(this, dr, new qt(e.name, Sn)), this.installDBCore(), p(this, dr).version(e.version).stores(r), this.logger.info("Created Database {db}");
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
    Sn = { indexedDB: e, IDBKeyRange: t };
  }
  /** Enable's Dexie's debug mode, which provides meaningful stack backtraces in exceptions. */
  static debugMode(e) {
    qt.debug = e;
  }
  /** Creates a Database instance and opens the database. If a local IndexedDB database with
   *  this name exists, it will be opened; otherwise a new one is created.
   *  @param config  The database {@link DatabaseConfig configuration}
   *  @template Schema  An optional interface type that improves type-safety of collection and
   *      document accessors. Its keys must be the names of the collections, and each value type
   *      is an interface that describes the properties of a document in that collection. */
  static async open(e) {
    const t = e.password;
    return e.password = void 0, await new ph(e).initialize(t);
  }
  /** @internal */
  static get idbFactory() {
    return (Sn == null ? void 0 : Sn.indexedDB) ?? indexedDB;
  }
  /** @internal */
  static get idbKeyRange() {
    return (Sn == null ? void 0 : Sn.IDBKeyRange) ?? IDBKeyRange;
  }
  async initialize(e) {
    try {
      const t = await this.getMeta();
      if (t.challenge && (G(this, Wt, Qa.withChallenge(t.challenge)), e === void 0 || !await p(this, Wt).unlock(e)))
        throw new Ko("Incorrect or missing database password");
      const r = this;
      let i = {};
      for (const [o, u] of p(this, Xn)) {
        const l = new Ps(r, o, u, p(this, dr), p(this, Wt));
        await l.open(), i[o] = l;
      }
      return Object.freeze(i), G(this, Br, i), this;
    } catch (t) {
      throw this.close(), t;
    }
  }
  /** True if the database is open. */
  get isOpen() {
    return p(this, dr).isOpen();
  }
  /** Reopens the database after a {@link close} or {@link closeAndDelete} call.
   *  @param password  If the database is encrypted, you must provide the password. */
  async reopen(e) {
    this.logger.info("Reopening database {db}"), await p(this, dr).open(), await this.initialize(e);
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
    G(this, Br, {}), G(this, Wt, void 0), p(this, dr).close();
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
    p(this, dr) && (this.logger.info("Closing and deleting database {db}"), await p(this, dr).delete());
  }
  /** Static method that deletes a database by name.
   *  You MUST close any open Database instance using it first. */
  static async delete(e) {
    df.info("Deleting database {db}", { db: e }), await new qt(e, Sn).delete();
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
    return this.getCollection(Da);
  }
  //-------- CHANGE LISTENER:
  /** Collections call this to enable/disable receiving Dexie db events. @internal */
  observeChangesFor(e, t = !0) {
    t ? p(this, Ws).add(e) : (p(this, Ws).delete(e), p(this, Ws).size === 0 && this.logger.info`Stopping Dexie change listener`);
  }
  installDBCore() {
    p(this, dr).use({
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
            if (!p(this, Xn).has(r))
              return i;
            let o = t.get(r);
            return o || (this.logger.trace`Installing mutate hook for ${r}`, o = {
              // Wrap Collection's table
              ...i,
              // Copy default table implementation
              mutate: async (u) => i.mutate(u).then((l) => {
                var c;
                return (c = p(this, Br)[r]) == null || c.onMutate(u, l), l;
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
    return new KI(this, e);
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
    const i = t.map((y) => typeof y == "string" ? y : y.name), o = t.map((y) => typeof y == "string" ? this.getCollection(y) : y);
    e === an && i.push(Po, Yl);
    let u = !0, l = "", c = -1, I = !1;
    try {
      return await p(this, dr).transaction(e, i, async (y) => {
        let _ = 0;
        for (let x = y.parent; x; x = x.parent)
          ++_;
        u = _ === 0, l = "    ".repeat(_), u ? (c = ++Nr(this, Wo)._, this.logger.debug(`>>> Begin ${e} transaction #{id}`, { id: c })) : (c = p(this, Wo), this.logger.debug(`${l}>>> Begin nested ${e} transaction inside #{id}`, { id: c }));
        try {
          const x = await r();
          return I = !0, u && e !== vf && this.logger.debug("... Committing transaction #{id} ...", { id: c }), x;
        } catch (x) {
          throw this.logger.debug("Aborting transaction #{id} due to exception", { id: c }), x;
        } finally {
          if (u)
            for (let x of o)
              await x.transactionEnding(e, I);
        }
      });
    } catch (y) {
      throw I && this.logger.error(`Exception committing transaction #{id}: ${y}`, { id: c }), I = !1, y;
    } finally {
      if (u) {
        I && this.logger.debug(`<<< ${e === vf ? "Ended" : "Committed"} transaction #{id}`, { id: c });
        for (let y of o)
          y.transactionEnded(e, I);
      } else
        this.logger.debug(`${l}<<< Ended nested transaction inside #{id}`, { id: c });
    }
  }
  /** A more performant wrapper around `Dexie.waitFor`. This must be wrapped around promises
   *  being awaited, if you are possibly in a transaction, to prevent the dreaded "Transaction
   * committed early" exception. (Blame IndexedDB's awkward API design.) @internal */
  static async waitFor(e) {
    return qt.currentTransaction !== void 0 ? qt.waitFor(e) : e;
  }
  //-------- ENCRYPTION:
  // (Mis)using the collection metadata table to store DB metadata, under the key ""
  get metaTable() {
    return p(this, dr).table(Po);
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
    return De(!((e = qt.currentTransaction) != null && e.active), "Don't call this in a transaction"), p(this, Wt) ? p(this, Wt).isUnlocked ? "unlocked" : "locked" : "none";
  }
  /** Unlocks an encrypted database using the given password. @internal
   *  @returns  True on success, false if the password is wrong (or there is no encryption.) */
  async unlock(e) {
    var t;
    return De(!((t = qt.currentTransaction) != null && t.active), "Don't call this in a transaction"), p(this, Wt) ? await p(this, Wt).unlock(e) : !1;
  }
  /** Locks an encrypted database, making encrypted stored data inaccessible until {@link unlock}
   *  is called. Has no effect if the database is not encrypted. @internal */
  lock() {
    var e;
    (e = p(this, Wt)) == null || e.lock();
  }
  /** Encrypts or decrypts a database, or changes the encryption key.
   *  @param password  The new password for encryption, or `undefined` to decrypt.
   *  @param exceptProperties  Optional top-level properties to leave unencrypted, by collection
   *                           (in addition to indexed properties, which cannot be encrypted.)
   *                           Key is collection name, value is array or set of properties.
   *  @throws EncryptionError  if it's already encrypted. */
  async changeEncryptionKey(e, t) {
    var u;
    De(!((u = qt.currentTransaction) != null && u.active), "Don't call this in a transaction"), De(this.encryptionStatus !== "locked", "Database must be unlocked to change encryption");
    const r = e !== void 0 ? await Qa.create(e) : void 0, i = /* @__PURE__ */ new Map();
    for (const [l, c] of Object.entries(p(this, Br)))
      i.set(l, c.unencryptedProperties);
    const o = r ? p(this, Wt) ? "Rekey" : "Encrypt" : "Decrypt";
    this.logger.info`${o}ing database...`;
    try {
      await this.inTransaction(an, this.collectionNames, async () => {
        const l = await this.getMeta();
        l.challenge = r == null ? void 0 : r.challenge, await this.setMeta(l), await this.blobStore.rekey(r);
        for (const [c, I] of Object.entries(p(this, Br)))
          await I.rekey(r, t == null ? void 0 : t[c]);
      }), G(this, Wt, r), this.logger.info`...${o}ed database!`;
    } catch (l) {
      this.logger.error`${o}ing database failed! ${l}`, this.blobStore.resetEncryption(p(this, Wt));
      for (const [c, I] of Object.entries(p(this, Br)))
        I.resetEncryption(p(this, Wt), i.get(c));
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
      return o instanceof qt.ConstraintError ? o : Promise.reject(o);
    });
  }
  /** @internal */
  get blobStore() {
    return p(this, Ys) || G(this, Ys, new VI(this, p(this, dr).table(Yl), p(this, Wt))), p(this, Ys);
  }
  /** Returns the number of blobs stored in the database. */
  async countBlobs() {
    return this.blobStore.countBlobs();
  }
  /** Deletes all blobs that are no longer referenced by any documents.
   *  @returns  The number of blobs deleted. */
  async performMaintenance(e) {
    return gy(e, "compact"), this.logger.info("Garbage-collecting blobs"), await this.inTransaction(an, this.collectionNames, async () => {
      const t = /* @__PURE__ */ new Set();
      for (const r of Object.values(p(this, Br)))
        await r.collectBlobDigests(t);
      return await this.blobStore.deleteBlobsExcept(t);
    });
  }
};
Ws = new WeakMap(), Wo = new WeakMap(), dr = new WeakMap(), Xn = new WeakMap(), Br = new WeakMap(), Ys = new WeakMap(), Wt = new WeakMap();
let en = ph;
var Bi = /* @__PURE__ */ ((n) => (n[n.none = 0] = "none", n[n.deleted = 1] = "deleted", n[n.accessRemoved = 2] = "accessRemoved", n))(Bi || {});
class gi {
  constructor(e, t) {
    this.local = e, this.remote = t;
  }
  static fromObject(e) {
    let t = e.local;
    typeof t != "number" && (t = void 0);
    let r = e.remote;
    return r === null && (r = void 0), new gi(t, r);
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
    return new gi(this.local, this.remote);
  }
}
class zr extends Error {
  constructor(e, t) {
    super(e), this.code = t, this.name = "ReplicatorError";
  }
}
const gf = Symbol();
function gn(n) {
  const e = n[gf];
  if (e === void 0)
    throw TypeError("meta() called on non-document");
  return e;
}
var Yi, Vi;
const dh = class dh {
  /** @internal */
  constructor(e, t, r, i, o) {
    /** The collection that the document belongs to. */
    ve(this, "collection");
    /** The ID (primary key) of the document. */
    ve(this, "id");
    /** The document itself. */
    ve(this, "body");
    ee(this, Yi);
    ee(this, Vi);
    Ig(t), this.collection = e, this.id = t, G(this, Yi, i), G(this, Vi, o), this.body = r, this.body[gf] = this, Object.defineProperty(r, gf, { enumerable: !1 });
  }
  /** The current revision ID of the document. */
  get revisionID() {
    return p(this, Yi);
  }
  /** The current sequence number of the document. */
  get sequence() {
    return p(this, Vi);
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
    return new dh(this.collection, this.id, La(this.body), p(this, Yi), p(this, Vi)).body;
  }
  /** Updates the `revID` and `sequence` properties after the document is saved. @internal */
  _updateRev(e, t) {
    G(this, Yi, e), G(this, Vi, t);
  }
};
Yi = new WeakMap(), Vi = new WeakMap();
let mn = dh;
function JI() {
  const n = new Uint8Array(15);
  return "-" + rm(crypto.getRandomValues(n)).replaceAll("/", "_");
}
function Xa(n) {
  return Vt(n) && n["@type"] === "blob" && typeof n.digest == "string";
}
function ZI(n) {
  return Xa(n) ? n : null;
}
function P0(n, e) {
  const t = n._attachments;
  if (Vt(t))
    for (const i of Object.getOwnPropertyNames(t)) {
      const o = t[i];
      Vt(o) && typeof o.digest == "string" && (t[i] = new yg(o, e));
    }
  function r(i) {
    if (ms(i)) {
      let o = 0;
      for (const u of i) {
        const l = r(u);
        l && (i[o] = l), ++o;
      }
    } else if (Vt(i)) {
      const o = ZI(i);
      if (o)
        return new uu(o, e);
      for (const u of Object.getOwnPropertyNames(i)) {
        const l = r(i[u]);
        l && (i[u] = l);
      }
    }
  }
  r(n);
}
function QI(n, e) {
  t(n);
  function t(r) {
    if (r instanceof co)
      return new uu(r, e);
    if (ms(r)) {
      let i = 0;
      for (const o of r) {
        const u = t(o);
        u && (r[i] = u), ++i;
      }
    } else if (Vt(r))
      for (const i of Object.getOwnPropertyNames(r)) {
        const o = t(r[i]);
        o && (r[i] = o);
      }
  }
}
function yf(n) {
  let e = 0;
  return D0(n, (t, r) => t instanceof co ? (e = 2, !1) : (e = 1, !0)), e;
}
function D0(n, e) {
  const t = [];
  function r(i) {
    if (Vt(i)) {
      t.push(0);
      for (const o of Object.getOwnPropertyNames(i))
        if (t[t.length - 1] = o, !r(i[o]))
          return !1;
      t.pop();
    } else if (ms(i)) {
      let o = 0;
      t.push(0);
      for (const u of i)
        if (t[t.length - 1] = o++, !r(u))
          return !1;
      t.pop();
    } else if (Bf(i))
      return e(i, t);
    return !0;
  }
  r(n);
}
function mf(n, e) {
  const t = [];
  function r(i) {
    if (Vt(i))
      if (Xa(i))
        e(i, t);
      else {
        t.push(0);
        for (const o of Object.getOwnPropertyNames(i))
          t[t.length - 1] = o, r(i[o]);
        t.pop();
      }
    else if (ms(i)) {
      let o = 0;
      t.push(0);
      for (const u of i)
        t[t.length - 1] = o++, r(u);
      t.pop();
    } else if (Bf(i))
      return e(i, t);
  }
  r(n);
}
function XI() {
  return typeof crypto < "u" ? crypto.randomUUID() : eb();
}
function eb() {
  const n = [];
  for (let e = 0; e < 4; e++) {
    const t = Math.round(Math.abs(Math.random() * -2147483648 * 2));
    n.push(t.toString(16).padStart(8, "0"));
  }
  return n.join("");
}
const Da = "_default", zn = "value", tb = "array";
function f_(n, e) {
  return "replace";
}
function h_(n, e) {
  if (e === void 0)
    return "replace";
  const t = gn(n).revisionID;
  return t && Ii(t) >= Ii(gn(e).revisionID) ? "replace" : "revert";
}
class rb extends Error {
  constructor(e, t, r, i) {
    super(`Conflict ${e} "${t}" rev ${r}; saved revision is ${i}`), this.docID = t, this.revID = r, this.savedRevID = i, this.name = "Conflict";
  }
}
class Cv extends Error {
  constructor(e) {
    super(`Conflict(s) saving ${e.size} documents`), this.errors = e, this.name = "MultipleConflicts";
  }
}
const Nv = "(_default|([a-zA-Z0-9][-_a-zA-Z0-9%]*))", nb = new RegExp(`^${Nv}(\\.${Nv})?$`);
var it, Ji, Zi, zt, ei, On, Kr, ti, ri, Et, fn;
const ru = class ru {
  /** @internal */
  constructor(e, t, r, i, o) {
    /** {@link https://logtape.org LogTape} logger instance for this Collection. @internal */
    ve(this, "logger");
    ee(this, it);
    // Dexie Table instance
    ee(this, Ji, /* @__PURE__ */ new Map());
    // Cached DocProperty instances
    ee(this, Zi);
    // Current task reading metadata
    ee(this, zt);
    // Metadata, during a transaction
    ee(this, ei, !1);
    // True if `_meta` has unsaved changes
    ee(this, On);
    // Timer for expiring documents
    ee(this, Kr);
    // Pending changes during a txn
    ee(this, ti, /* @__PURE__ */ new Set());
    // Collection change listeners
    ee(this, ri, /* @__PURE__ */ new Map());
    // Doc change listeners by DocID
    ee(this, Et);
    // Encrypts/decrypts rev bodies
    ee(this, fn);
    this.database = e, this.name = t, this.config = r, this.db = i, G(this, it, i.table(t)), G(this, Et, o), this.logger = df.getChild(["c", this.name]).with({ db: e.name });
    const u = this.config.indexes;
    if (u)
      for (const l of u) {
        let c;
        typeof l == "string" ? c = l : typeof l.on == "string" ? c = l.on : c = l.on[0], p(this, Ji).set(c, ps.create(c, !0));
      }
  }
  /** Database calls this right after the constructor.  @internal */
  async open() {
    var e;
    p(this, Et) && G(this, fn, (e = await this.getMeta()) == null ? void 0 : e.unencryptedProperties), this.startExpTimer();
  }
  /** Checks that a collection name is valid. If not, throws.  @internal */
  static validateName(e) {
    if (!nb.test(e))
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
    this.stopExpTimer(), G(this, Et, void 0);
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
    let t = p(this, Ji).get(e);
    return t === void 0 && (t = ps.create(e, !1), p(this, Et) && (t.encrypted = !((r = p(this, fn)) != null && r.has(t.rootName))), p(this, Ji).set(e, t)), t;
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
    return p(this, fn);
  }
  /** Encrypts the documents in this Collection.  @internal */
  async rekey(e, t) {
    var o;
    De((o = qt.currentTransaction) == null ? void 0 : o.active, "Must be called in a transaction");
    const r = await this.documentIDs();
    if (e) {
      t === void 0 ? t = /* @__PURE__ */ new Set() : Array.isArray(t) && (t = new Set(t));
      for (const l of t)
        De(
          !l.includes("."),
          `Only top-level properties can be excluded from encryption, not "${l}"`
        );
      const u = this.config.indexes;
      if (u) {
        const l = (c, I) => {
          const y = this.property(c).rootName;
          y && I.add(y);
        };
        for (const c of u)
          if (typeof c == "string")
            l(c, t);
          else if (typeof c.on == "string")
            l(c.on, t);
          else
            for (const I of c.on)
              l(I, t);
      }
      this.logger.info`Encrypting ${r.length} documents, except for properties ${Array.from(t)}`;
    } else
      this.logger.info`Decrypting ${r.length} documents...`, t = void 0;
    for (const u of r) {
      let l = await p(this, it).get(u);
      if (!Ts(l)) {
        const c = l.encrypted !== void 0;
        if (c && await this.decryptRevision(l), e) {
          const { body: I, encrypted: y } = await en.waitFor(
            e.partlyEncrypt(l.body, t)
          );
          l.body = I, l.encrypted = y;
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
    G(this, Et, e), G(this, fn, t);
    for (let r of p(this, Ji).values())
      r.indexed || (r.encrypted = t !== void 0 && t.has(r.rootName));
  }
  /** Called by queries to decrypt a StoredRevision returned from a Dexie query.  @internal */
  async decryptRevision(e) {
    if (e.encrypted) {
      if (!p(this, Et))
        throw new Ko("Document is encrypted");
      await en.waitFor(p(this, Et).decryptRevision(e));
    }
    return e;
  }
  /** Encrypts properties of each rev's `body` and puts the ciphertext in its `encrypted`. */
  async decryptMaybeRevisions(e) {
    if (p(this, Et)) {
      this.logger.info`Decrypting ${e.length} stored revisions`;
      const t = e.filter((r) => r !== void 0).map(async (r) => this.decryptRevision(r));
      await en.waitFor(Promise.all(t));
    }
    return e;
  }
  /** Encrypts properties of each rev's `body` and puts the ciphertext in its `encrypted`. */
  async decryptRevisions(e) {
    return this.decryptMaybeRevisions(e);
  }
  /** Returns the rev's conflict in decrypted form. @internal */
  async decryptConflict(e) {
    if (e.encrypted) {
      if (!p(this, Et))
        throw new Ko("Document is encrypted");
      await p(this, Et).decryptRevision(e);
    }
    return e.body;
  }
  //-------- CRUD:
  /** Loads an existing {@link CBLDocument document}, or returns `undefined` if it doesn't exist. */
  async getDocument(e) {
    const t = await this.getRevision(e);
    if (!t) {
      this.logger.info("Get document {docID} -- missing", { docID: e });
      return;
    }
    return this.logger.info("Get document {docID}", { docID: e, revID: t.rev }), this.revToDoc(t);
  }
  /** Gets an existing document without decrypting it. @internal */
  async getStoredRevision(e) {
    return await p(this, it).get(e);
  }
  /** Gets an existing document in its raw `LocalRevision` form. @internal
   *  @throws EncryptionError  if doc is encrypted & collection is locked. */
  async getRevision(e) {
    const t = await p(this, it).get(e);
    if (t)
      return t.encrypted ? await this.decryptRevision(t) : t;
  }
  /** Creates a new {@link CBLDocument document} instance tied to this collection.
   *  The document will not be persisted to the database until you save it.
   *  @param id  The document ID, which must be unique in the Collection.
   *             If you pass `null`, a random ID will be generated.
   *  @param body  The initial contents of the document; if omitted, it will be empty. */
  createDocument(e, t) {
    return t || (t = {}), new mn(this, e ?? JI(), t).body;
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
    const r = await this.preSave(e), i = await this.inTransaction(an, async () => (p(this, zt) || await this.getMeta(), await this.doSave(r, t)));
    return r.postSave(), i && this.logger.info("Saved doc {docID}", { docID: r.doc.id, revID: r.newRevID }), i;
  }
  /** Prep work for save() that can be performed outside of a transaction. */
  async preSave(e, t = !1) {
    const r = new ib(e, t);
    return De(r.doc.collection === this, "Saving document to wrong Collection"), !t && p(this, Et) && (r.newBody = await en.waitFor(
      p(this, Et).partlyEncrypt(r.doc.body, p(this, fn))
    )), r;
  }
  /** The actual work of saving a document. Must be called in a transaction. */
  async doSave(e, t) {
    const r = e.doc;
    let i;
    if (e.newSeq = this._nextSequence(), e.blobStatus > 1 && await this.saveNewBlobsIn(e.doc.body), r.revisionID === void 0) {
      const o = await this.database.tryAdd(p(this, it), e.makeNewRevision());
      if (o === void 0)
        return !0;
      if (i = await p(this, it).get(r.id), !i)
        throw o;
      if (!Ts(i)) {
        if (!await this.handleConflict("saving", t, r, i))
          return e.newSeq = void 0, !1;
        e.updateFrom(i.rev) && await this.saveNewBlobsIn(r.body);
      }
    } else if (i = await p(this, it).get(r.id), !i || i.rev !== r.revisionID) {
      if (!await this.handleConflict("saving", t, r, i))
        return e.newSeq = void 0, !1;
      if (e.updateFrom(i == null ? void 0 : i.rev) && await this.saveNewBlobsIn(r.body), !i)
        return await p(this, it).add(e.makeNewRevision()), !0;
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
    e instanceof mn || (e = gn(e)), De(e.collection === this, "Saving document to wrong Collection"), De(e.revisionID !== void 0, "Document has not been saved");
    let r = await this.inTransaction(an, async () => await this.doDelete(e, t));
    return r === void 0 ? !1 : (e.setBody({}), e._updateRev(r[0], r[1]), this.logger.info("Deleted doc {docID}", { docID: e.id }), !0);
  }
  async doDelete(e, t) {
    De(e.collection === this, "Saving document to wrong Collection"), De(e.revisionID !== void 0, "Document has not been saved");
    const r = await p(this, it).get(e.id);
    return r ? Ts(r) ? [r.rev, r.seq] : r.rev !== e.revisionID && !await this.handleConflict("deleting", t, e, r) ? void 0 : (r.rev = qa(e.revisionID, e.body, !0), r.seq = await this.nextSequence(), r.body = {}, r.encrypted = void 0, r.flags = (r.flags ?? 0) | Sr & -2, await p(this, it).put(r), [r.rev, r.seq]) : [e.revisionID, e.sequence];
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
      for (const I of e.save) {
        const y = await this.preSave(I);
        y.doc.revisionID === void 0 ? r.push(y) : i.push(y);
      }
    }
    if (e.delete) {
      this.logger.info`Deleting ${e.delete.length} docs ...`;
      for (const I of e.delete)
        o.push(await this.preSave(I, !0));
    }
    const u = r.length + i.length + o.length;
    if (u === 0)
      return;
    let l = [], c = /* @__PURE__ */ new Map();
    await this.inTransaction(an, async () => {
      if (await this.getMeta(), r.length > 0) {
        for (const y of r)
          y.blobStatus > 1 && (await this.saveNewBlobsIn(y.doc.body), y.blobStatus = 1);
        this.logger.debug`... inserting ${r.length} of the docs ...`;
        let I = await this.bulkAdd(r.map((y) => (y.newSeq = this._nextSequence(), y.makeNewRevision())));
        if (I === void 0)
          l.push(...r);
        else {
          const y = new Set(I);
          r.forEach((_, x) => {
            y.has(x) ? (_.newSeq = void 0, i.push(_)) : l.push(_);
          });
        }
      }
      if (i.length > 0) {
        this.logger.debug`... updating ${i.length} of the docs ...`;
        for (const I of i)
          try {
            await this.doSave(I, e.onConflict) && l.push(I);
          } catch (y) {
            c.set(I.doc.id, y);
          }
      }
      if (o.length > 0) {
        this.logger.debug`... deleting ${o.length} of the docs ...`;
        for (const I of o)
          try {
            const y = await this.doDelete(I.doc, e.onConflict);
            y && ([I.newRevID, I.newSeq] = y, l.push(I));
          } catch (y) {
            c.set(I.doc.id, y);
          }
      }
      if (c.size > 0 && (this.logger.error`saveMultiple: ${c.size} of ${u} docs failed`, !e.bestEffort))
        throw new Cv(c);
    });
    for (const I of l)
      I.postSave();
    if (this.logger.info`Updated ${l.length} of ${u} docs in ${Date.now() - t}ms`, c.size > 0 && e.bestEffort)
      throw new Cv(c);
  }
  /** Deletes all traces of a document, without leaving a "tombstone" revision behind.
   *  However, this means *purges are not visible to the replicator*, which has two side effects:
   *  - A push replication will not push the deletion to a server.
   *  - If the document is later updated on the server side, the next pull replication will
   *    download the new revision.
   *  @param doc  The document or DocID. */
  async purge(e) {
    const t = typeof e == "string" ? e : gn(e).id;
    await p(this, it).delete(t), this.logger.info("Purged doc {docID}", { docID: t });
  }
  /** {@link purge Purges} multiple documents at once. */
  async purgeMultiple(e) {
    const t = e.map((r) => typeof r == "string" ? r : gn(r).id);
    await p(this, it).where(qo).anyOf(t).delete();
  }
  /** Invokes an optional ConflictHandler.
   *  @returns true if the handler resolved the conflict, false if it returned 'ignore'.
   *  @throws ConflictError if there is no handler, or if it returned 'fail'. */
  async handleConflict(e, t, r, i) {
    if (t !== void 0) {
      let o = i ? await this.decryptRevision(i) : void 0, u = o ? this.revToDoc(o) : void 0;
      switch (t(r.body, u)) {
        case "replace":
          return !0;
        case "revert":
          return o && (r.setBody(o.body), r._updateRev(o == null ? void 0 : o.rev, o.seq)), !1;
      }
    }
    throw new rb(e, r.id, r.revisionID, i == null ? void 0 : i.rev);
  }
  async saveNewBlobsIn(e) {
    const t = new Array();
    D0(e, (r, i) => (r instanceof co && t.push(r), !0));
    for (const r of t)
      await this.database.blobStore.saveBlob(r.contents, r.digest);
    QI(e, this.database.blobLoader);
  }
  /** Adds the digest of every blob in every document to the set [allDigests]. @internal */
  async collectBlobDigests(e) {
    const t = await p(this, it).where("flags").anyOf([An, An | Rs]).primaryKeys();
    for (const r of t) {
      const i = await this.getRevision(r);
      mf(i.body, (o) => e.add(o.digest)), i.conflict && (De(p(this, Et)), await en.waitFor(p(this, Et).decryptRevision(i.conflict)), mf(i.conflict.body, (o) => e.add(o.digest)));
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
    return this.isListening() || this.database.observeChangesFor(this.name, !0), p(this, ti).add(e), new xf(() => {
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
    return r || (r = /* @__PURE__ */ new Set(), p(this, ri).set(e, r)), r.add(t), new xf(() => {
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
      return o.length > 0 && Object.keys(t.failures).length > 0 ? o.filter((u, l) => t.failures[l] === void 0) : o;
    }
    switch (e.type) {
      case "add":
      case "put": {
        const o = r(e.values);
        if (o.length > 0) {
          p(this, Kr) === void 0 && G(this, Kr, /* @__PURE__ */ new Map());
          for (const u of o) {
            let l = { id: u.id, rev: u.rev, sequence: u.seq };
            Ts(u) && (l.deleted = !0), Object.freeze(l), p(this, Kr).set(u.id, l);
          }
          this.logger.debug`MUTATE ${this.name}: ${e.type.toUpperCase()}: ${o.map((u) => u.id).join(", ")}`;
        }
        break;
      }
      case "delete": {
        const o = r(e.keys);
        if (o.length > 0) {
          for (const u of o)
            (i = p(this, Kr)) == null || i.delete(u);
          this.logger.debug`MUTATE ${this.name}: DELETE keys = ${o.join(", ")}`;
        }
        break;
      }
      case "deleteRange": {
        this.logger.debug`MUTATE ${this.name}: DELETE RANGE values = ${e.range.lower} -- ${e.range.upper}`;
        break;
      }
    }
    qt.currentTransaction || this.postChangeEvent();
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
            } catch (u) {
              this.logger.error`Caught exception in document change listener: ${u}`;
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
    const t = this.name, r = new Ya(), i = new S0({ collection: this, alias: t }), o = new k0((u) => {
      const l = u.getSourceRevision(t);
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
    return this.docIDsByFlags((e) => e.between(Rs, Rs | An));
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
    const r = typeof e == "string" ? e : gn(e).id, i = Date.now();
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
    const t = typeof e == "string" ? e : gn(e).id, r = (i = await p(this, it).get(t)) == null ? void 0 : i.expires;
    return r ? new Date(r) : void 0;
  }
  /** Returns the next time (milliseconds since epoch) at which a doc will expire. @internal */
  async nextExpirationTime() {
    const e = await p(this, it).orderBy(Ra).first();
    return e == null ? void 0 : e.expires;
  }
  /** Purges all documents whose expiration date has arrived.
   *  Returns the number of documents purged. @internal */
  async expireDocs() {
    const e = await p(this, it).where(Ra).belowOrEqual(Date.now()).delete();
    return e > 0 && this.logger.info("Deleted {n} expired docs", { n: e }), e;
  }
  async startExpTimer() {
    if (this.stopExpTimer(), this.isOpen && this.database.enableAutoExpiry) {
      const e = await this.nextExpirationTime();
      if (e !== void 0 && p(this, On) === void 0 && this.isOpen) {
        const t = Math.max(e - Date.now(), 0), r = async () => {
          G(this, On, void 0), this.isOpen && (await this.expireDocs(), this.startExpTimer());
        };
        G(this, On, setTimeout(() => void r(), t));
      }
    }
  }
  stopExpTimer() {
    p(this, On) && (clearTimeout(p(this, On)), G(this, On, void 0));
  }
  //-------- INDEXES:
  /** Creates a Dexie schema string for use by the `Version.stores()` method.  @internal */
  static dexieIndexSpec(e) {
    let t = "id, &seq, flags, expires";
    if (e.indexes)
      for (const r of e.indexes)
        t += ", " + ru.indexNameFromSpec(r);
    return t;
  }
  /** Returns the Dexie index name of an IndexConfig */
  static indexNameFromSpec(e) {
    function t(r) {
      return ps.create(r).keypath;
    }
    if (typeof e == "string")
      return t(e);
    {
      let r = "";
      switch (e.type) {
        case zn:
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
        case tb:
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
      { name: qo, type: zn, on: [this.property(Ma)], unique: !0 },
      { name: Do, type: zn, on: [this.property(Ua)], unique: !0 },
      { name: Ra, type: zn, on: [this.property($a)] }
    ];
    const t = this.config.indexes;
    if (t)
      for (const r of t) {
        let i, o, u;
        typeof r == "string" ? i = [r] : (i = Array.isArray(r.on) ? r.on : [r.on], u = r.type ?? zn, o = r.unique);
        let l = ru.indexNameFromSpec(r);
        l.startsWith("*") && (l = l.substring(1)), e.push({
          name: l,
          type: u ?? zn,
          on: i.map((c) => this.property(c)),
          unique: o
        });
      }
    return e;
  }
  /** Returns the index, if any, whose primary key is `property`.
   *  If there is more than one, it picks the one with the fewest properties.  @internal */
  indexOfProperty(e, t = zn) {
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
    return e.clientID ? e.clientID : await this.db.transaction("rw", Po, async () => (e = await this.getMeta(), e.clientID || (e.clientID = XI(), await this.metaTable.put(e, this.name), this.logger.debug("assigned clientID {clientID}", { clientID: e.clientID })), e.clientID));
  }
  /** Returns the locally-stored Checkpoint for a given checkpoint ID.
   *  @internal */
  async getCheckpoint(e) {
    const t = await this.db.table(Xc).get([this.name, e]);
    return t ? gi.fromObject(t) : void 0;
  }
  /** Saves the local Checkpoint for a given checkpoint ID.
   *  @internal */
  async setCheckpoint(e, t) {
    this.logger.debug("Saving checkpoint {id} as {checkpoint}", { id: e, checkpoint: t }), await this.db.table(Xc).put(t, [this.name, e]);
  }
  /** The last/highest sequence number assigned to a document.
   *  @internal */
  async lastSequence() {
    return p(this, zt) ? p(this, zt).lastSeq : (await this.getMeta()).lastSeq;
  }
  /** Checks whether a remote revision is newer than the local one, during pull replication.
   *  @param id  The document ID.
   *  @param remoteRevID  The current revID on the server.
   *  @returns  Array of current revIDs, or null if the document is up to date with the server.
   *  @internal */
  async getAncestorRevs(e, t) {
    const r = await p(this, it).get(e);
    return r ? r.rev === t || !Mo(t, r.serverRev) ? null : r.serverRev && r.serverRev !== r.rev ? [r.rev, r.serverRev] : [r.rev] : [];
  }
  /** Saves multiple revisions received from the server.
   *  @param newRevs  Array of revisions received from the server.
   *  @param assumeNew  Set this to true if the docs most likely don't exist locally.
   *  @returns  The last Sequence added, and optionally the set of DocIDs with conflicts.
   *  @internal */
  async putRemoteRevisions(e, t) {
    De(e.length > 0);
    let r = 0, i;
    return await this.inTransaction(an, async () => {
      if (p(this, zt) || await this.getMeta(), t) {
        this.logger.debug`inserting ${e.length} revs as new...`;
        const _ = await this.putNewRemoteRevisions(e);
        if (_ === void 0) {
          r = p(this, zt).lastSeq;
          return;
        }
        e = _;
      }
      let o = await p(this, it).bulkGet(e.map((_) => _.id)), u;
      p(this, Et) ? u = await this.decryptMaybeRevisions(o) : u = o;
      const l = [];
      let c = 0;
      for (const _ of u) {
        const x = this._nextSequence();
        l.push(this.updateLocalRev(_, e[c++], x));
      }
      const y = (await en.waitFor(Promise.all(l))).filter((_) => _ !== void 0);
      await p(this, it).bulkPut(await this.encryptLocalRevs(y)), r = p(this, zt).lastSeq;
      for (const _ of y)
        _.flags && _.flags & Rs && (i === void 0 && (i = /* @__PURE__ */ new Set()), i.add(_.id));
    }), De(r > 0), { lastSequence: r, conflicts: i };
  }
  // subroutine of putRemoteRevisions that uses `bulkAdd` to create new documents;
  // if any already exist, it returns them so the caller can handle them as normal updates.
  async putNewRemoteRevisions(e) {
    const t = e.map((o) => this.createLocalRev(o, this._nextSequence())), r = await this.encryptLocalRevs(t);
    let i = await this.bulkAdd(r);
    if (i !== void 0)
      return i.map((o) => e[o]);
  }
  async bulkAdd(e) {
    try {
      await p(this, it).bulkAdd(e);
      return;
    } catch (t) {
      if (!(t instanceof qt.BulkError))
        throw t;
      let r = [];
      for (const [i, o] of Object.entries(t.failuresByPos)) {
        const u = Number(i);
        if (o.name !== "ConstraintError")
          throw this.logger.error("bulkAdd: '{id}' failed: {error}", { id: e[u].id, error: o }), o;
        r.push(u);
      }
      return r;
    }
  }
  /** Returns an ordered list of revisions that were created since a given local Sequence.
   *  @param since  The sequence to start just past; use `undefined` for all changes.
   *  @param limit  The maximum number of revisions to return.
   *  @param filter  Optional function that can reject revisions.
   *  @returns  An array of `PushRevision`, ordered by Sequence.
   *  @internal */
  async getDocsSinceSequence(e, t, r) {
    let i;
    e !== void 0 && e > 0 ? i = p(this, it).where(Do).above(e) : i = p(this, it).orderBy(Do), r && (i = i.filter(r));
    const o = await i.limit(t).toArray();
    return (await this.decryptRevisions(o)).map((l) => ({
      id: l.id,
      rev: l.rev,
      deleted: Ts(l) ? 1 : void 0,
      body: l.body,
      seq: l.seq,
      serverRev: l.serverRev
    }));
  }
  /** Updates documents' `serverRev` properties, after they've been pushed. @internal */
  async updateServerRevs(e) {
    await p(this, it).where("id").anyOf(Array.from(e.keys())).modify((t) => {
      const r = e.get(t.id);
      Mo(t.serverRev, r) || (t.serverRev = r);
    });
  }
  /** Resolves a replication conflict. Returns false if `revID` is out of date. @internal */
  async resolveConflict(e, t, r) {
    return await this.inTransaction(an, async () => {
      let o = await this.getRevision(e);
      if ((o == null ? void 0 : o.rev) !== t)
        return !1;
      De(o.conflict), p(this, Et) && await p(this, Et).decryptRevision(o.conflict);
      const u = fo(r, o.conflict.body);
      let l = (o.flags ?? 0) & -194;
      if (r === null)
        l |= Sr, r = {};
      else {
        const c = yf(r);
        c > 0 && (l |= An), c >= 2 && await this.saveNewBlobsIn(r);
      }
      return u ? (yi(o.serverRev), o.rev = o.serverRev) : o.rev = qa(t, r, (l & Sr) !== 0), o.body = r, o.seq = await this.nextSequence(), Ba(o, l), o.conflict = void 0, await p(this, it).put(await this.encryptLocalRev(o)), !0;
    });
  }
  //-------- INTERNAL REVISION HELPER METHODS:
  /** Creates a LocalRevision from a RemoteRevision. */
  createLocalRev(e, t) {
    let r = 0;
    e.deleted && (r |= Sr), e.hasBlobs && (r |= An);
    const i = {
      id: e.id,
      rev: e.rev,
      seq: t,
      body: e.body,
      serverRev: e.rev
    };
    return Ba(i, r), i;
  }
  /** Updates or creates a LocalRevision from a RemoteRevision.
   *  Returns the LocalRevision, or `undefined` if it would be unchanged. */
  async updateLocalRev(e, t, r) {
    if (e === void 0)
      return this.createLocalRev(t, r);
    if (t.rev === e.rev || t.rev === e.serverRev)
      return;
    let i = e.flags ?? 0;
    return e.rev !== e.serverRev ? (this.logger.warn`Saving conflict in ${e.id}; local rev ${e.rev}, remote rev ${t.rev} (was ${e.serverRev})`, t.deleted ? e.conflict = null : p(this, Et) ? e.conflict = await p(this, Et).partlyEncrypt(t.body, p(this, fn)) : e.conflict = { body: t.body }, i |= Rs) : (e.rev = t.rev, e.body = t.body, delete e.conflict, i &= -194, t.deleted && (i |= Sr), t.hasBlobs && (i |= An)), e.seq = r, e.serverRev = t.rev, Ba(e, i), e;
  }
  /** Encrypts properties of `rev.body` and puts the ciphertext in `rev.encrypted`.
   *  - Precondition: `rev.body` contains _all_ doc properties. */
  async encryptLocalRev(e) {
    const t = e;
    if (p(this, Et)) {
      const { body: r, encrypted: i } = await p(this, Et).partlyEncrypt(e.body, p(this, fn));
      t.body = r, t.encrypted = i;
    }
    return t;
  }
  /** Encrypts properties of each rev's `body` and puts the ciphertext in its `encrypted`. */
  async encryptLocalRevs(e) {
    if (p(this, Et)) {
      this.logger.info`Encrypting ${e.length} incoming revisions`;
      const t = Promise.all(e.map(async (r) => this.encryptLocalRev(r)));
      return await en.waitFor(t);
    } else
      return e;
  }
  /** Converts a LocalRevision read from the Table into a client Document object. @internal */
  revToDoc(e) {
    if (e.flags) {
      if (e.flags & Sr)
        return;
      e.flags & An && P0(e.body, this.database.blobLoader);
    }
    return new mn(this, e.id, e.body, e.rev, e.seq).body;
  }
  //-------- Sequence & Transaction Support:
  // generates the next consecutive sequence number.
  async nextSequence() {
    return p(this, zt) || await this.getMeta(), this._nextSequence();
  }
  /** generates the next consecutive sequence number; non-async but #meta must be loaded already */
  _nextSequence() {
    return yi(p(this, zt)), G(this, ei, !0), ++p(this, zt).lastSeq;
  }
  // Returns the Collection's metadata object.
  async getMeta() {
    return qt.currentTransaction ? (p(this, zt) || (p(this, Zi) || G(this, Zi, this._actuallyReadMeta()), await p(this, Zi)), p(this, zt)) : await this._readMeta();
  }
  // subroutine of getMeta(). Do not call.
  async _actuallyReadMeta() {
    G(this, zt, await this._readMeta()), G(this, Zi, void 0), G(this, ei, !1);
  }
  /** Saves cached changes (`this.meta`) back to the db. Called by Database.inTransaction.
      @internal */
  async transactionEnding(e, t) {
    e === an && (t && p(this, ei) && p(this, zt) && await this.metaTable.put(p(this, zt), this.name), G(this, ei, !1), G(this, zt, void 0));
  }
  /** Posts change notifications after a transaction is committed.
   *  Called by Database.inTransaction. @internal */
  transactionEnded(e, t) {
    e === an && (t ? this.postChangeEvent() : G(this, Kr, void 0));
  }
  // Lowest-level method to get the collection metadata.
  async _readMeta() {
    return await this.metaTable.get(this.name) ?? { lastSeq: 0 };
  }
  /** The MetaStore table. */
  get metaTable() {
    return this.db.table(Po);
  }
  // Properties to leave unencrypted
};
it = new WeakMap(), Ji = new WeakMap(), Zi = new WeakMap(), zt = new WeakMap(), ei = new WeakMap(), On = new WeakMap(), Kr = new WeakMap(), ti = new WeakMap(), ri = new WeakMap(), Et = new WeakMap(), fn = new WeakMap();
let Ps = ru;
class ib {
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
    this.deleting = t, e instanceof mn || (e = gn(e)), Ig(e.id), this.doc = e, t ? (this.blobStatus = 0, this.newBody = { body: {} }) : (this.blobStatus = yf(e.body), this.newBody = { body: e.body }), this.newRevID = qa(e.revisionID, e.body, t);
  }
  /** Creates a StoredRevision object for a new document. */
  makeNewRevision() {
    return De(!this.deleting), yi(this.newSeq, "Saving.newSeq"), {
      id: this.doc.id,
      rev: this.newRevID,
      seq: this.newSeq,
      flags: this.blobStatus ? An : void 0,
      body: this.newBody.body,
      encrypted: this.newBody.encrypted
    };
  }
  /** Updates the revID and blob status. */
  updateFrom(e) {
    return this.newRevID = qa(e, this.doc.body, !1), this.blobStatus = yf(this.doc.body), this.blobStatus > 1;
  }
  /** Copies my state to a `StoredRevision` read from the table. */
  updateRevision(e) {
    let t = (e.flags ?? 0) & -130;
    this.deleting && (t |= Sr), this.blobStatus > 0 && (t |= An), e.rev = this.newRevID, e.seq = this.newSeq, Ba(e, t), e.body = this.newBody.body, e.encrypted = this.newBody.encrypted;
  }
  /** After a save has committed, updates the CBLDocument's revID and sequence. */
  postSave() {
    this.newSeq !== void 0 && (this.doc._updateRev(this.newRevID, this.newSeq), this.deleting && this.doc.setBody({}));
  }
  // The new revision's sequence
}
function Ba(n, e) {
  e ? n.flags = e : delete n.flags;
}
function Ds(n, e, t) {
  for (De(t >= 0 && t < 2147483648, "writeVarUint: number out of range"); t >= 128; )
    n[e++] = t & 255 | 128, t = t >>> 7;
  return n[e++] = t, e;
}
function sb(n) {
  const e = new Uint8Array(10), t = Ds(e, 0, n);
  return e.subarray(0, t);
}
function Fa(n, e) {
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
function B0(n) {
  return n.reduce((e, t) => e + t.length, 0);
}
function F0(n) {
  if (n.length === 1)
    return n[0];
  const e = new Uint8Array(B0(n));
  let t = 0;
  for (const r of n)
    e.set(r, t), t += r.length;
  return e;
}
var vs = /* @__PURE__ */ ((n) => (n[n.None = 0] = "None", n[n.Compressed = 8] = "Compressed", n[n.Urgent = 16] = "Urgent", n[n.NoReply = 32] = "NoReply", n[n.All = 56] = "All", n))(vs || {}), In = /* @__PURE__ */ ((n) => (n[n.TypeMask = 7] = "TypeMask", n[n.MoreComing = 64] = "MoreComing", n))(In || {}), Dr = /* @__PURE__ */ ((n) => (n[n.MSG = 0] = "MSG", n[n.RPY = 1] = "RPY", n[n.ERR = 2] = "ERR", n[n.ACKMSG = 4] = "ACKMSG", n[n.ACKRPY = 5] = "ACKRPY", n))(Dr || {});
const If = ["MSG", "RPY", "ERR", "?3?", "ACKMSG", "ACKRPY", "?6?", "?7?"], $c = new Uint8Array(1), jc = new TextEncoder(), bf = new TextDecoder();
class gs {
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
    De(this.type === 0, "cannot reply to a reply"), De(this.wantsReply, "message was sent NoReply"), De(this._number !== void 0, "message has not been sent");
    const i = new gs(e, t);
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
    e instanceof ys && (t = e.blipErrorCode, r = e.blipErrorDomain), this.makeErrorReply(e.message, t, r);
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
    return this.isError ? new ob(this) : void 0;
  }
  /** The message body as a string. */
  get bodyString() {
    return this._bodyString === void 0 && (this._bodyString = bf.decode(this.bodyData)), this._bodyString;
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
    return this._bodyData === void 0 && (this._bodyData = jc.encode(this.bodyString)), this._bodyData;
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
    let t = gs.describeFrame(this._number, this._flags);
    return t += " " + JSON.stringify(this.properties), e && (t += "«" + this.bodyString + "»"), t;
  }
  // Internals that clients probably aren't interested in:
  /** @internal */
  get type() {
    return this._flags & 7;
  }
  /** @internal */
  get typeName() {
    return If[this.type];
  }
  /** @internal */
  get hasNumber() {
    return this._number !== void 0;
  }
  /** @internal */
  get number() {
    return De(this.hasNumber), this._number;
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
          jc.encode(t),
          $c,
          jc.encode(this.properties[t].toString()),
          $c
        );
      e.unshift(sb(B0(e)));
    } else
      e.unshift($c);
    return e.push(this.bodyData), F0(e);
  }
  /** @internal  Returns a textual description of a frame's flags, for logging. */
  static describeFrame(e, t) {
    let r = If[
      t & 7
      /* TypeMask */
    ];
    return e && (r += `#${e} `), r += t & 8 ? "z" : "-", r += t & 16 ? "u" : "-", r += t & 32 ? "n" : "-", r += t & 64 ? "+" : "-", r;
  }
}
class Fo extends gs {
  constructor(e, t, r, i) {
    De(e > 0, "invalid message number"), super(t, r), this._flags = i, this._number = e;
  }
  static makeReply(e, t = {}, r = "", i = 0) {
    return new Fo(e, t, r, 1 | i);
  }
  static makeError(e, t, r, i = "BLIP") {
    return new Fo(
      e,
      { "Error-Code": r.toString(), "Error-Domain": i },
      t,
      2
      /* ERR */
    );
  }
  static decodedFromBinary(e, t, r) {
    let [i, o] = Fa(e, 0);
    if (i += o, i > e.length)
      throw Error("Message properties length too large");
    const u = {};
    for (; o < i; ) {
      let c = e.indexOf(0, o);
      if (c < 0 || c > i)
        throw Error("Invalid message properties (no NUL)");
      const I = bf.decode(e.slice(o, c));
      if (o = c + 1, c = e.indexOf(0, o), c < 0 || c > i)
        throw Error("Invalid message properties (no NUL)");
      const y = bf.decode(e.slice(o, c));
      o = c + 1, u[I] = y;
    }
    const l = e.slice(i);
    return new Fo(r, u, l, t);
  }
}
class ys extends Error {
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
class ob extends ys {
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
class ab {
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
function ub({ polynomial: n, numTables: e }) {
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
const on = ub({ polynomial: 3988292384, numTables: 8 });
function lb() {
  return -1;
}
function cb(n, e) {
  const t = e.byteLength, r = new DataView(e.buffer, e.byteOffset, t);
  let i = n, o = 0;
  const u = -r.byteOffset & 3;
  for (; o < u && o < t; o++)
    i = on[(i ^ r.getUint8(o)) & 255] ^ i >>> 8;
  if (o === t)
    return i;
  o = u;
  let l = t - o;
  for (; l >= 8; o += 8, l -= 8) {
    i ^= r.getUint32(o, !0);
    const c = r.getUint32(o + 4, !0);
    i = on[0 * 256 + (c >>> 24 & 255)] ^ on[1 * 256 + (c >>> 16 & 255)] ^ on[2 * 256 + (c >>> 8 & 255)] ^ on[3 * 256 + (c >>> 0 & 255)] ^ on[4 * 256 + (i >>> 24 & 255)] ^ on[5 * 256 + (i >>> 16 & 255)] ^ on[6 * 256 + (i >>> 8 & 255)] ^ on[7 * 256 + (i >>> 0 & 255)];
  }
  for (let c = o; c < t; c++)
    i = on[(i ^ r.getUint8(c)) & 255] ^ i >>> 8;
  return i;
}
function fb(n) {
  return (n ^ -1) >>> 0;
}
var Kc = {}, Pv;
function Si() {
  return Pv || (Pv = 1, function(n) {
    var e = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
    function t(o, u) {
      return Object.prototype.hasOwnProperty.call(o, u);
    }
    n.assign = function(o) {
      for (var u = Array.prototype.slice.call(arguments, 1); u.length; ) {
        var l = u.shift();
        if (l) {
          if (typeof l != "object")
            throw new TypeError(l + "must be non-object");
          for (var c in l)
            t(l, c) && (o[c] = l[c]);
        }
      }
      return o;
    }, n.shrinkBuf = function(o, u) {
      return o.length === u ? o : o.subarray ? o.subarray(0, u) : (o.length = u, o);
    };
    var r = {
      arraySet: function(o, u, l, c, I) {
        if (u.subarray && o.subarray) {
          o.set(u.subarray(l, l + c), I);
          return;
        }
        for (var y = 0; y < c; y++)
          o[I + y] = u[l + y];
      },
      // Join array of chunks to single array.
      flattenChunks: function(o) {
        var u, l, c, I, y, _;
        for (c = 0, u = 0, l = o.length; u < l; u++)
          c += o[u].length;
        for (_ = new Uint8Array(c), I = 0, u = 0, l = o.length; u < l; u++)
          y = o[u], _.set(y, I), I += y.length;
        return _;
      }
    }, i = {
      arraySet: function(o, u, l, c, I) {
        for (var y = 0; y < c; y++)
          o[I + y] = u[l + y];
      },
      // Join array of chunks to single array.
      flattenChunks: function(o) {
        return [].concat.apply([], o);
      }
    };
    n.setTyped = function(o) {
      o ? (n.Buf8 = Uint8Array, n.Buf16 = Uint16Array, n.Buf32 = Int32Array, n.assign(n, r)) : (n.Buf8 = Array, n.Buf16 = Array, n.Buf32 = Array, n.assign(n, i));
    }, n.setTyped(e);
  }(Kc)), Kc;
}
var ks = {}, Hr = {}, Ni = {}, Dv;
function hb() {
  if (Dv) return Ni;
  Dv = 1;
  var n = Si(), e = 4, t = 0, r = 1, i = 2;
  function o(m) {
    for (var T = m.length; --T >= 0; )
      m[T] = 0;
  }
  var u = 0, l = 1, c = 2, I = 3, y = 258, _ = 29, x = 256, k = x + 1 + _, D = 30, K = 19, C = 2 * k + 1, M = 15, J = 16, X = 7, le = 256, ce = 16, fe = 17, oe = 18, ke = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), Be = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), Ce = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), $e = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Fe = 512, Se = new Array((k + 2) * 2);
  o(Se);
  var Ue = new Array(D * 2);
  o(Ue);
  var ot = new Array(Fe);
  o(ot);
  var vt = new Array(y - I + 1);
  o(vt);
  var we = new Array(_);
  o(we);
  var He = new Array(D);
  o(He);
  function Ke(m, T, L, ue, B) {
    this.static_tree = m, this.extra_bits = T, this.extra_base = L, this.elems = ue, this.max_length = B, this.has_stree = m && m.length;
  }
  var It, Ve, Xe;
  function Ze(m, T) {
    this.dyn_tree = m, this.max_code = 0, this.stat_desc = T;
  }
  function wt(m) {
    return m < 256 ? ot[m] : ot[256 + (m >>> 7)];
  }
  function gt(m, T) {
    m.pending_buf[m.pending++] = T & 255, m.pending_buf[m.pending++] = T >>> 8 & 255;
  }
  function We(m, T, L) {
    m.bi_valid > J - L ? (m.bi_buf |= T << m.bi_valid & 65535, gt(m, m.bi_buf), m.bi_buf = T >> J - m.bi_valid, m.bi_valid += L - J) : (m.bi_buf |= T << m.bi_valid & 65535, m.bi_valid += L);
  }
  function lt(m, T, L) {
    We(
      m,
      L[T * 2],
      L[T * 2 + 1]
      /*.Len*/
    );
  }
  function Pe(m, T) {
    var L = 0;
    do
      L |= m & 1, m >>>= 1, L <<= 1;
    while (--T > 0);
    return L >>> 1;
  }
  function he(m) {
    m.bi_valid === 16 ? (gt(m, m.bi_buf), m.bi_buf = 0, m.bi_valid = 0) : m.bi_valid >= 8 && (m.pending_buf[m.pending++] = m.bi_buf & 255, m.bi_buf >>= 8, m.bi_valid -= 8);
  }
  function Le(m, T) {
    var L = T.dyn_tree, ue = T.max_code, B = T.stat_desc.static_tree, q = T.stat_desc.has_stree, w = T.stat_desc.extra_bits, se = T.stat_desc.extra_base, Ne = T.stat_desc.max_length, f, te, ie, A, F, Z, Oe = 0;
    for (A = 0; A <= M; A++)
      m.bl_count[A] = 0;
    for (L[m.heap[m.heap_max] * 2 + 1] = 0, f = m.heap_max + 1; f < C; f++)
      te = m.heap[f], A = L[L[te * 2 + 1] * 2 + 1] + 1, A > Ne && (A = Ne, Oe++), L[te * 2 + 1] = A, !(te > ue) && (m.bl_count[A]++, F = 0, te >= se && (F = w[te - se]), Z = L[te * 2], m.opt_len += Z * (A + F), q && (m.static_len += Z * (B[te * 2 + 1] + F)));
    if (Oe !== 0) {
      do {
        for (A = Ne - 1; m.bl_count[A] === 0; )
          A--;
        m.bl_count[A]--, m.bl_count[A + 1] += 2, m.bl_count[Ne]--, Oe -= 2;
      } while (Oe > 0);
      for (A = Ne; A !== 0; A--)
        for (te = m.bl_count[A]; te !== 0; )
          ie = m.heap[--f], !(ie > ue) && (L[ie * 2 + 1] !== A && (m.opt_len += (A - L[ie * 2 + 1]) * L[ie * 2], L[ie * 2 + 1] = A), te--);
    }
  }
  function et(m, T, L) {
    var ue = new Array(M + 1), B = 0, q, w;
    for (q = 1; q <= M; q++)
      ue[q] = B = B + L[q - 1] << 1;
    for (w = 0; w <= T; w++) {
      var se = m[w * 2 + 1];
      se !== 0 && (m[w * 2] = Pe(ue[se]++, se));
    }
  }
  function me() {
    var m, T, L, ue, B, q = new Array(M + 1);
    for (L = 0, ue = 0; ue < _ - 1; ue++)
      for (we[ue] = L, m = 0; m < 1 << ke[ue]; m++)
        vt[L++] = ue;
    for (vt[L - 1] = ue, B = 0, ue = 0; ue < 16; ue++)
      for (He[ue] = B, m = 0; m < 1 << Be[ue]; m++)
        ot[B++] = ue;
    for (B >>= 7; ue < D; ue++)
      for (He[ue] = B << 7, m = 0; m < 1 << Be[ue] - 7; m++)
        ot[256 + B++] = ue;
    for (T = 0; T <= M; T++)
      q[T] = 0;
    for (m = 0; m <= 143; )
      Se[m * 2 + 1] = 8, m++, q[8]++;
    for (; m <= 255; )
      Se[m * 2 + 1] = 9, m++, q[9]++;
    for (; m <= 279; )
      Se[m * 2 + 1] = 7, m++, q[7]++;
    for (; m <= 287; )
      Se[m * 2 + 1] = 8, m++, q[8]++;
    for (et(Se, k + 1, q), m = 0; m < D; m++)
      Ue[m * 2 + 1] = 5, Ue[m * 2] = Pe(m, 5);
    It = new Ke(Se, ke, x + 1, k, M), Ve = new Ke(Ue, Be, 0, D, M), Xe = new Ke(new Array(0), Ce, 0, K, X);
  }
  function je(m) {
    var T;
    for (T = 0; T < k; T++)
      m.dyn_ltree[T * 2] = 0;
    for (T = 0; T < D; T++)
      m.dyn_dtree[T * 2] = 0;
    for (T = 0; T < K; T++)
      m.bl_tree[T * 2] = 0;
    m.dyn_ltree[le * 2] = 1, m.opt_len = m.static_len = 0, m.last_lit = m.matches = 0;
  }
  function yt(m) {
    m.bi_valid > 8 ? gt(m, m.bi_buf) : m.bi_valid > 0 && (m.pending_buf[m.pending++] = m.bi_buf), m.bi_buf = 0, m.bi_valid = 0;
  }
  function ht(m, T, L, ue) {
    yt(m), gt(m, L), gt(m, ~L), n.arraySet(m.pending_buf, m.window, T, L, m.pending), m.pending += L;
  }
  function ct(m, T, L, ue) {
    var B = T * 2, q = L * 2;
    return m[B] < m[q] || m[B] === m[q] && ue[T] <= ue[L];
  }
  function st(m, T, L) {
    for (var ue = m.heap[L], B = L << 1; B <= m.heap_len && (B < m.heap_len && ct(T, m.heap[B + 1], m.heap[B], m.depth) && B++, !ct(T, ue, m.heap[B], m.depth)); )
      m.heap[L] = m.heap[B], L = B, B <<= 1;
    m.heap[L] = ue;
  }
  function qe(m, T, L) {
    var ue, B, q = 0, w, se;
    if (m.last_lit !== 0)
      do
        ue = m.pending_buf[m.d_buf + q * 2] << 8 | m.pending_buf[m.d_buf + q * 2 + 1], B = m.pending_buf[m.l_buf + q], q++, ue === 0 ? lt(m, B, T) : (w = vt[B], lt(m, w + x + 1, T), se = ke[w], se !== 0 && (B -= we[w], We(m, B, se)), ue--, w = wt(ue), lt(m, w, L), se = Be[w], se !== 0 && (ue -= He[w], We(m, ue, se)));
      while (q < m.last_lit);
    lt(m, le, T);
  }
  function Ot(m, T) {
    var L = T.dyn_tree, ue = T.stat_desc.static_tree, B = T.stat_desc.has_stree, q = T.stat_desc.elems, w, se, Ne = -1, f;
    for (m.heap_len = 0, m.heap_max = C, w = 0; w < q; w++)
      L[w * 2] !== 0 ? (m.heap[++m.heap_len] = Ne = w, m.depth[w] = 0) : L[w * 2 + 1] = 0;
    for (; m.heap_len < 2; )
      f = m.heap[++m.heap_len] = Ne < 2 ? ++Ne : 0, L[f * 2] = 1, m.depth[f] = 0, m.opt_len--, B && (m.static_len -= ue[f * 2 + 1]);
    for (T.max_code = Ne, w = m.heap_len >> 1; w >= 1; w--)
      st(m, L, w);
    f = q;
    do
      w = m.heap[
        1
        /*SMALLEST*/
      ], m.heap[
        1
        /*SMALLEST*/
      ] = m.heap[m.heap_len--], st(
        m,
        L,
        1
        /*SMALLEST*/
      ), se = m.heap[
        1
        /*SMALLEST*/
      ], m.heap[--m.heap_max] = w, m.heap[--m.heap_max] = se, L[f * 2] = L[w * 2] + L[se * 2], m.depth[f] = (m.depth[w] >= m.depth[se] ? m.depth[w] : m.depth[se]) + 1, L[w * 2 + 1] = L[se * 2 + 1] = f, m.heap[
        1
        /*SMALLEST*/
      ] = f++, st(
        m,
        L,
        1
        /*SMALLEST*/
      );
    while (m.heap_len >= 2);
    m.heap[--m.heap_max] = m.heap[
      1
      /*SMALLEST*/
    ], Le(m, T), et(L, Ne, m.bl_count);
  }
  function Rt(m, T, L) {
    var ue, B = -1, q, w = T[0 * 2 + 1], se = 0, Ne = 7, f = 4;
    for (w === 0 && (Ne = 138, f = 3), T[(L + 1) * 2 + 1] = 65535, ue = 0; ue <= L; ue++)
      q = w, w = T[(ue + 1) * 2 + 1], !(++se < Ne && q === w) && (se < f ? m.bl_tree[q * 2] += se : q !== 0 ? (q !== B && m.bl_tree[q * 2]++, m.bl_tree[ce * 2]++) : se <= 10 ? m.bl_tree[fe * 2]++ : m.bl_tree[oe * 2]++, se = 0, B = q, w === 0 ? (Ne = 138, f = 3) : q === w ? (Ne = 6, f = 3) : (Ne = 7, f = 4));
  }
  function Me(m, T, L) {
    var ue, B = -1, q, w = T[0 * 2 + 1], se = 0, Ne = 7, f = 4;
    for (w === 0 && (Ne = 138, f = 3), ue = 0; ue <= L; ue++)
      if (q = w, w = T[(ue + 1) * 2 + 1], !(++se < Ne && q === w)) {
        if (se < f)
          do
            lt(m, q, m.bl_tree);
          while (--se !== 0);
        else q !== 0 ? (q !== B && (lt(m, q, m.bl_tree), se--), lt(m, ce, m.bl_tree), We(m, se - 3, 2)) : se <= 10 ? (lt(m, fe, m.bl_tree), We(m, se - 3, 3)) : (lt(m, oe, m.bl_tree), We(m, se - 11, 7));
        se = 0, B = q, w === 0 ? (Ne = 138, f = 3) : q === w ? (Ne = 6, f = 3) : (Ne = 7, f = 4);
      }
  }
  function Qe(m) {
    var T;
    for (Rt(m, m.dyn_ltree, m.l_desc.max_code), Rt(m, m.dyn_dtree, m.d_desc.max_code), Ot(m, m.bl_desc), T = K - 1; T >= 3 && m.bl_tree[$e[T] * 2 + 1] === 0; T--)
      ;
    return m.opt_len += 3 * (T + 1) + 5 + 5 + 4, T;
  }
  function St(m, T, L, ue) {
    var B;
    for (We(m, T - 257, 5), We(m, L - 1, 5), We(m, ue - 4, 4), B = 0; B < ue; B++)
      We(m, m.bl_tree[$e[B] * 2 + 1], 3);
    Me(m, m.dyn_ltree, T - 1), Me(m, m.dyn_dtree, L - 1);
  }
  function Lt(m) {
    var T = 4093624447, L;
    for (L = 0; L <= 31; L++, T >>>= 1)
      if (T & 1 && m.dyn_ltree[L * 2] !== 0)
        return t;
    if (m.dyn_ltree[9 * 2] !== 0 || m.dyn_ltree[10 * 2] !== 0 || m.dyn_ltree[13 * 2] !== 0)
      return r;
    for (L = 32; L < x; L++)
      if (m.dyn_ltree[L * 2] !== 0)
        return r;
    return t;
  }
  var _t = !1;
  function Qt(m) {
    _t || (me(), _t = !0), m.l_desc = new Ze(m.dyn_ltree, It), m.d_desc = new Ze(m.dyn_dtree, Ve), m.bl_desc = new Ze(m.bl_tree, Xe), m.bi_buf = 0, m.bi_valid = 0, je(m);
  }
  function S(m, T, L, ue) {
    We(m, (u << 1) + (ue ? 1 : 0), 3), ht(m, T, L);
  }
  function d(m) {
    We(m, l << 1, 3), lt(m, le, Se), he(m);
  }
  function v(m, T, L, ue) {
    var B, q, w = 0;
    m.level > 0 ? (m.strm.data_type === i && (m.strm.data_type = Lt(m)), Ot(m, m.l_desc), Ot(m, m.d_desc), w = Qe(m), B = m.opt_len + 3 + 7 >>> 3, q = m.static_len + 3 + 7 >>> 3, q <= B && (B = q)) : B = q = L + 5, L + 4 <= B && T !== -1 ? S(m, T, L, ue) : m.strategy === e || q === B ? (We(m, (l << 1) + (ue ? 1 : 0), 3), qe(m, Se, Ue)) : (We(m, (c << 1) + (ue ? 1 : 0), 3), St(m, m.l_desc.max_code + 1, m.d_desc.max_code + 1, w + 1), qe(m, m.dyn_ltree, m.dyn_dtree)), je(m), ue && yt(m);
  }
  function R(m, T, L) {
    return m.pending_buf[m.d_buf + m.last_lit * 2] = T >>> 8 & 255, m.pending_buf[m.d_buf + m.last_lit * 2 + 1] = T & 255, m.pending_buf[m.l_buf + m.last_lit] = L & 255, m.last_lit++, T === 0 ? m.dyn_ltree[L * 2]++ : (m.matches++, T--, m.dyn_ltree[(vt[L] + x + 1) * 2]++, m.dyn_dtree[wt(T) * 2]++), m.last_lit === m.lit_bufsize - 1;
  }
  return Ni._tr_init = Qt, Ni._tr_stored_block = S, Ni._tr_flush_block = v, Ni._tr_tally = R, Ni._tr_align = d, Ni;
}
var zc, Bv;
function L0() {
  if (Bv) return zc;
  Bv = 1;
  function n(e, t, r, i) {
    for (var o = e & 65535 | 0, u = e >>> 16 & 65535 | 0, l = 0; r !== 0; ) {
      l = r > 2e3 ? 2e3 : r, r -= l;
      do
        o = o + t[i++] | 0, u = u + o | 0;
      while (--l);
      o %= 65521, u %= 65521;
    }
    return o | u << 16 | 0;
  }
  return zc = n, zc;
}
var Gc, Fv;
function q0() {
  if (Fv) return Gc;
  Fv = 1;
  function n() {
    for (var r, i = [], o = 0; o < 256; o++) {
      r = o;
      for (var u = 0; u < 8; u++)
        r = r & 1 ? 3988292384 ^ r >>> 1 : r >>> 1;
      i[o] = r;
    }
    return i;
  }
  var e = n();
  function t(r, i, o, u) {
    var l = e, c = u + o;
    r ^= -1;
    for (var I = u; I < c; I++)
      r = r >>> 8 ^ l[(r ^ i[I]) & 255];
    return r ^ -1;
  }
  return Gc = t, Gc;
}
var Hc, Lv;
function uh() {
  return Lv || (Lv = 1, Hc = {
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
  }), Hc;
}
var qv;
function pb() {
  if (qv) return Hr;
  qv = 1;
  var n = Si(), e = hb(), t = L0(), r = q0(), i = uh(), o = 0, u = 1, l = 3, c = 4, I = 5, y = 0, _ = 1, x = -2, k = -3, D = -5, K = -1, C = 1, M = 2, J = 3, X = 4, le = 0, ce = 2, fe = 8, oe = 9, ke = 15, Be = 8, Ce = 29, $e = 256, Fe = $e + 1 + Ce, Se = 30, Ue = 19, ot = 2 * Fe + 1, vt = 15, we = 3, He = 258, Ke = He + we + 1, It = 32, Ve = 42, Xe = 69, Ze = 73, wt = 91, gt = 103, We = 113, lt = 666, Pe = 1, he = 2, Le = 3, et = 4, me = 3;
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
  function qe(f, te) {
    f.pending_buf[f.pending++] = te;
  }
  function Ot(f, te) {
    f.pending_buf[f.pending++] = te >>> 8 & 255, f.pending_buf[f.pending++] = te & 255;
  }
  function Rt(f, te, ie, A) {
    var F = f.avail_in;
    return F > A && (F = A), F === 0 ? 0 : (f.avail_in -= F, n.arraySet(te, f.input, f.next_in, F, ie), f.state.wrap === 1 ? f.adler = t(f.adler, te, F, ie) : f.state.wrap === 2 && (f.adler = r(f.adler, te, F, ie)), f.next_in += F, f.total_in += F, F);
  }
  function Me(f, te) {
    var ie = f.max_chain_length, A = f.strstart, F, Z, Oe = f.prev_length, Ee = f.nice_match, xe = f.strstart > f.w_size - Ke ? f.strstart - (f.w_size - Ke) : 0, Je = f.window, Rr = f.w_mask, bt = f.prev, Te = f.strstart + He, tt = Je[A + Oe - 1], $t = Je[A + Oe];
    f.prev_length >= f.good_match && (ie >>= 2), Ee > f.lookahead && (Ee = f.lookahead);
    do
      if (F = te, !(Je[F + Oe] !== $t || Je[F + Oe - 1] !== tt || Je[F] !== Je[A] || Je[++F] !== Je[A + 1])) {
        A += 2, F++;
        do
          ;
        while (Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && Je[++A] === Je[++F] && A < Te);
        if (Z = He - (Te - A), A = Te - He, Z > Oe) {
          if (f.match_start = te, Oe = Z, Z >= Ee)
            break;
          tt = Je[A + Oe - 1], $t = Je[A + Oe];
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
      if (A = Rt(f.strm, f.window, f.strstart + f.lookahead, Z), f.lookahead += A, f.lookahead + f.insert >= we)
        for (Oe = f.strstart - f.insert, f.ins_h = f.window[Oe], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[Oe + 1]) & f.hash_mask; f.insert && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[Oe + we - 1]) & f.hash_mask, f.prev[Oe & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = Oe, Oe++, f.insert--, !(f.lookahead + f.insert < we)); )
          ;
    } while (f.lookahead < Ke && f.strm.avail_in !== 0);
  }
  function St(f, te) {
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
    return f.insert = 0, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Le : et) : (f.strstart > f.block_start && (st(f, !1), f.strm.avail_out === 0), Pe);
  }
  function Lt(f, te) {
    for (var ie, A; ; ) {
      if (f.lookahead < Ke) {
        if (Qe(f), f.lookahead < Ke && te === o)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      if (ie = 0, f.lookahead >= we && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ie = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), ie !== 0 && f.strstart - ie <= f.w_size - Ke && (f.match_length = Me(f, ie)), f.match_length >= we)
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
    return f.insert = f.strstart < we - 1 ? f.strstart : we - 1, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Le : et) : f.last_lit && (st(f, !1), f.strm.avail_out === 0) ? Pe : he;
  }
  function _t(f, te) {
    for (var ie, A, F; ; ) {
      if (f.lookahead < Ke) {
        if (Qe(f), f.lookahead < Ke && te === o)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      if (ie = 0, f.lookahead >= we && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ie = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), f.prev_length = f.match_length, f.prev_match = f.match_start, f.match_length = we - 1, ie !== 0 && f.prev_length < f.max_lazy_match && f.strstart - ie <= f.w_size - Ke && (f.match_length = Me(f, ie), f.match_length <= 5 && (f.strategy === C || f.match_length === we && f.strstart - f.match_start > 4096) && (f.match_length = we - 1)), f.prev_length >= we && f.match_length <= f.prev_length) {
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
    return f.match_available && (A = e._tr_tally(f, 0, f.window[f.strstart - 1]), f.match_available = 0), f.insert = f.strstart < we - 1 ? f.strstart : we - 1, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Le : et) : f.last_lit && (st(f, !1), f.strm.avail_out === 0) ? Pe : he;
  }
  function Qt(f, te) {
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
    return f.insert = 0, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Le : et) : f.last_lit && (st(f, !1), f.strm.avail_out === 0) ? Pe : he;
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
    return f.insert = 0, te === c ? (st(f, !0), f.strm.avail_out === 0 ? Le : et) : f.last_lit && (st(f, !1), f.strm.avail_out === 0) ? Pe : he;
  }
  function d(f, te, ie, A, F) {
    this.good_length = f, this.max_lazy = te, this.nice_length = ie, this.max_chain = A, this.func = F;
  }
  var v;
  v = [
    /*      good lazy nice chain */
    new d(0, 0, 0, 0, St),
    /* 0 store only */
    new d(4, 4, 8, 4, Lt),
    /* 1 max speed, no lazy matches */
    new d(4, 5, 16, 8, Lt),
    /* 2 */
    new d(4, 6, 32, 32, Lt),
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
  function m() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = fe, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(ot * 2), this.dyn_dtree = new n.Buf16((2 * Se + 1) * 2), this.bl_tree = new n.Buf16((2 * Ue + 1) * 2), ht(this.dyn_ltree), ht(this.dyn_dtree), ht(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16(vt + 1), this.heap = new n.Buf16(2 * Fe + 1), ht(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(2 * Fe + 1), ht(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function T(f) {
    var te;
    return !f || !f.state ? je(f, x) : (f.total_in = f.total_out = 0, f.data_type = ce, te = f.state, te.pending = 0, te.pending_out = 0, te.wrap < 0 && (te.wrap = -te.wrap), te.status = te.wrap ? Ve : We, f.adler = te.wrap === 2 ? 0 : 1, te.last_flush = o, e._tr_init(te), y);
  }
  function L(f) {
    var te = T(f);
    return te === y && R(f.state), te;
  }
  function ue(f, te) {
    return !f || !f.state || f.state.wrap !== 2 ? x : (f.state.gzhead = te, y);
  }
  function B(f, te, ie, A, F, Z) {
    if (!f)
      return x;
    var Oe = 1;
    if (te === K && (te = 6), A < 0 ? (Oe = 0, A = -A) : A > 15 && (Oe = 2, A -= 16), F < 1 || F > oe || ie !== fe || A < 8 || A > 15 || te < 0 || te > 9 || Z < 0 || Z > X)
      return je(f, x);
    A === 8 && (A = 9);
    var Ee = new m();
    return f.state = Ee, Ee.strm = f, Ee.wrap = Oe, Ee.gzhead = null, Ee.w_bits = A, Ee.w_size = 1 << Ee.w_bits, Ee.w_mask = Ee.w_size - 1, Ee.hash_bits = F + 7, Ee.hash_size = 1 << Ee.hash_bits, Ee.hash_mask = Ee.hash_size - 1, Ee.hash_shift = ~~((Ee.hash_bits + we - 1) / we), Ee.window = new n.Buf8(Ee.w_size * 2), Ee.head = new n.Buf16(Ee.hash_size), Ee.prev = new n.Buf16(Ee.w_size), Ee.lit_bufsize = 1 << F + 6, Ee.pending_buf_size = Ee.lit_bufsize * 4, Ee.pending_buf = new n.Buf8(Ee.pending_buf_size), Ee.d_buf = 1 * Ee.lit_bufsize, Ee.l_buf = 3 * Ee.lit_bufsize, Ee.level = te, Ee.strategy = Z, Ee.method = ie, L(f);
  }
  function q(f, te) {
    return B(f, te, fe, ke, Be, le);
  }
  function w(f, te) {
    var ie, A, F, Z;
    if (!f || !f.state || te > I || te < 0)
      return f ? je(f, x) : x;
    if (A = f.state, !f.output || !f.input && f.avail_in !== 0 || A.status === lt && te !== c)
      return je(f, f.avail_out === 0 ? D : x);
    if (A.strm = f, ie = A.last_flush, A.last_flush = te, A.status === Ve)
      if (A.wrap === 2)
        f.adler = 0, qe(A, 31), qe(A, 139), qe(A, 8), A.gzhead ? (qe(
          A,
          (A.gzhead.text ? 1 : 0) + (A.gzhead.hcrc ? 2 : 0) + (A.gzhead.extra ? 4 : 0) + (A.gzhead.name ? 8 : 0) + (A.gzhead.comment ? 16 : 0)
        ), qe(A, A.gzhead.time & 255), qe(A, A.gzhead.time >> 8 & 255), qe(A, A.gzhead.time >> 16 & 255), qe(A, A.gzhead.time >> 24 & 255), qe(A, A.level === 9 ? 2 : A.strategy >= M || A.level < 2 ? 4 : 0), qe(A, A.gzhead.os & 255), A.gzhead.extra && A.gzhead.extra.length && (qe(A, A.gzhead.extra.length & 255), qe(A, A.gzhead.extra.length >> 8 & 255)), A.gzhead.hcrc && (f.adler = r(f.adler, A.pending_buf, A.pending, 0)), A.gzindex = 0, A.status = Xe) : (qe(A, 0), qe(A, 0), qe(A, 0), qe(A, 0), qe(A, 0), qe(A, A.level === 9 ? 2 : A.strategy >= M || A.level < 2 ? 4 : 0), qe(A, me), A.status = We);
      else {
        var Oe = fe + (A.w_bits - 8 << 4) << 8, Ee = -1;
        A.strategy >= M || A.level < 2 ? Ee = 0 : A.level < 6 ? Ee = 1 : A.level === 6 ? Ee = 2 : Ee = 3, Oe |= Ee << 6, A.strstart !== 0 && (Oe |= It), Oe += 31 - Oe % 31, A.status = We, Ot(A, Oe), A.strstart !== 0 && (Ot(A, f.adler >>> 16), Ot(A, f.adler & 65535)), f.adler = 1;
      }
    if (A.status === Xe)
      if (A.gzhead.extra) {
        for (F = A.pending; A.gzindex < (A.gzhead.extra.length & 65535) && !(A.pending === A.pending_buf_size && (A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), ct(f), F = A.pending, A.pending === A.pending_buf_size)); )
          qe(A, A.gzhead.extra[A.gzindex] & 255), A.gzindex++;
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
          A.gzindex < A.gzhead.name.length ? Z = A.gzhead.name.charCodeAt(A.gzindex++) & 255 : Z = 0, qe(A, Z);
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
          A.gzindex < A.gzhead.comment.length ? Z = A.gzhead.comment.charCodeAt(A.gzindex++) & 255 : Z = 0, qe(A, Z);
        } while (Z !== 0);
        A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), Z === 0 && (A.status = gt);
      } else
        A.status = gt;
    if (A.status === gt && (A.gzhead.hcrc ? (A.pending + 2 > A.pending_buf_size && ct(f), A.pending + 2 <= A.pending_buf_size && (qe(A, f.adler & 255), qe(A, f.adler >> 8 & 255), f.adler = 0, A.status = We)) : A.status = We), A.pending !== 0) {
      if (ct(f), f.avail_out === 0)
        return A.last_flush = -1, y;
    } else if (f.avail_in === 0 && yt(te) <= yt(ie) && te !== c)
      return je(f, D);
    if (A.status === lt && f.avail_in !== 0)
      return je(f, D);
    if (f.avail_in !== 0 || A.lookahead !== 0 || te !== o && A.status !== lt) {
      var xe = A.strategy === M ? S(A, te) : A.strategy === J ? Qt(A, te) : v[A.level].func(A, te);
      if ((xe === Le || xe === et) && (A.status = lt), xe === Pe || xe === Le)
        return f.avail_out === 0 && (A.last_flush = -1), y;
      if (xe === he && (te === u ? e._tr_align(A) : te !== I && (e._tr_stored_block(A, 0, 0, !1), te === l && (ht(A.head), A.lookahead === 0 && (A.strstart = 0, A.block_start = 0, A.insert = 0))), ct(f), f.avail_out === 0))
        return A.last_flush = -1, y;
    }
    return te !== c ? y : A.wrap <= 0 ? _ : (A.wrap === 2 ? (qe(A, f.adler & 255), qe(A, f.adler >> 8 & 255), qe(A, f.adler >> 16 & 255), qe(A, f.adler >> 24 & 255), qe(A, f.total_in & 255), qe(A, f.total_in >> 8 & 255), qe(A, f.total_in >> 16 & 255), qe(A, f.total_in >> 24 & 255)) : (Ot(A, f.adler >>> 16), Ot(A, f.adler & 65535)), ct(f), A.wrap > 0 && (A.wrap = -A.wrap), A.pending !== 0 ? y : _);
  }
  function se(f) {
    var te;
    return !f || !f.state ? x : (te = f.state.status, te !== Ve && te !== Xe && te !== Ze && te !== wt && te !== gt && te !== We && te !== lt ? je(f, x) : (f.state = null, te === We ? je(f, k) : y));
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
    return A.strstart += A.lookahead, A.block_start = A.strstart, A.insert = A.lookahead, A.lookahead = 0, A.match_length = A.prev_length = we - 1, A.match_available = 0, f.next_in = xe, f.input = Je, f.avail_in = Ee, A.wrap = Oe, y;
  }
  return Hr.deflateInit = q, Hr.deflateInit2 = B, Hr.deflateReset = L, Hr.deflateResetKeep = T, Hr.deflateSetHeader = ue, Hr.deflate = w, Hr.deflateEnd = se, Hr.deflateSetDictionary = Ne, Hr.deflateInfo = "pako deflate (from Nodeca project)", Hr;
}
var Pi = {}, Mv;
function M0() {
  if (Mv) return Pi;
  Mv = 1;
  var n = Si(), e = !0, t = !0;
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
  r[254] = r[254] = 1, Pi.string2buf = function(u) {
    var l, c, I, y, _, x = u.length, k = 0;
    for (y = 0; y < x; y++)
      c = u.charCodeAt(y), (c & 64512) === 55296 && y + 1 < x && (I = u.charCodeAt(y + 1), (I & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (I - 56320), y++)), k += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    for (l = new n.Buf8(k), _ = 0, y = 0; _ < k; y++)
      c = u.charCodeAt(y), (c & 64512) === 55296 && y + 1 < x && (I = u.charCodeAt(y + 1), (I & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (I - 56320), y++)), c < 128 ? l[_++] = c : c < 2048 ? (l[_++] = 192 | c >>> 6, l[_++] = 128 | c & 63) : c < 65536 ? (l[_++] = 224 | c >>> 12, l[_++] = 128 | c >>> 6 & 63, l[_++] = 128 | c & 63) : (l[_++] = 240 | c >>> 18, l[_++] = 128 | c >>> 12 & 63, l[_++] = 128 | c >>> 6 & 63, l[_++] = 128 | c & 63);
    return l;
  };
  function o(u, l) {
    if (l < 65534 && (u.subarray && t || !u.subarray && e))
      return String.fromCharCode.apply(null, n.shrinkBuf(u, l));
    for (var c = "", I = 0; I < l; I++)
      c += String.fromCharCode(u[I]);
    return c;
  }
  return Pi.buf2binstring = function(u) {
    return o(u, u.length);
  }, Pi.binstring2buf = function(u) {
    for (var l = new n.Buf8(u.length), c = 0, I = l.length; c < I; c++)
      l[c] = u.charCodeAt(c);
    return l;
  }, Pi.buf2string = function(u, l) {
    var c, I, y, _, x = l || u.length, k = new Array(x * 2);
    for (I = 0, c = 0; c < x; ) {
      if (y = u[c++], y < 128) {
        k[I++] = y;
        continue;
      }
      if (_ = r[y], _ > 4) {
        k[I++] = 65533, c += _ - 1;
        continue;
      }
      for (y &= _ === 2 ? 31 : _ === 3 ? 15 : 7; _ > 1 && c < x; )
        y = y << 6 | u[c++] & 63, _--;
      if (_ > 1) {
        k[I++] = 65533;
        continue;
      }
      y < 65536 ? k[I++] = y : (y -= 65536, k[I++] = 55296 | y >> 10 & 1023, k[I++] = 56320 | y & 1023);
    }
    return o(k, I);
  }, Pi.utf8border = function(u, l) {
    var c;
    for (l = l || u.length, l > u.length && (l = u.length), c = l - 1; c >= 0 && (u[c] & 192) === 128; )
      c--;
    return c < 0 || c === 0 ? l : c + r[u[c]] > l ? c : l;
  }, Pi;
}
var Wc, Uv;
function U0() {
  if (Uv) return Wc;
  Uv = 1;
  function n() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
  return Wc = n, Wc;
}
var $v;
function db() {
  if ($v) return ks;
  $v = 1;
  var n = pb(), e = Si(), t = M0(), r = uh(), i = U0(), o = Object.prototype.toString, u = 0, l = 4, c = 0, I = 1, y = 2, _ = -1, x = 0, k = 8;
  function D(J) {
    if (!(this instanceof D)) return new D(J);
    this.options = e.assign({
      level: _,
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
    oe = X === ~~X ? X : X === !0 ? l : u, typeof J == "string" ? le.input = t.string2buf(J) : o.call(J) === "[object ArrayBuffer]" ? le.input = new Uint8Array(J) : le.input = J, le.next_in = 0, le.avail_in = le.input.length;
    do {
      if (le.avail_out === 0 && (le.output = new e.Buf8(ce), le.next_out = 0, le.avail_out = ce), fe = n.deflate(le, oe), fe !== I && fe !== c)
        return this.onEnd(fe), this.ended = !0, !1;
      (le.avail_out === 0 || le.avail_in === 0 && (oe === l || oe === y)) && (this.options.to === "string" ? this.onData(t.buf2binstring(e.shrinkBuf(le.output, le.next_out))) : this.onData(e.shrinkBuf(le.output, le.next_out)));
    } while ((le.avail_in > 0 || le.avail_out === 0) && fe !== I);
    return oe === l ? (fe = n.deflateEnd(this.strm), this.onEnd(fe), this.ended = !0, fe === c) : (oe === y && (this.onEnd(c), le.avail_out = 0), !0);
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
  return ks.Deflate = D, ks.deflate = K, ks.deflateRaw = C, ks.gzip = M, ks;
}
var Os = {}, Mr = {}, Yc, jv;
function vb() {
  if (jv) return Yc;
  jv = 1;
  var n = 30, e = 12;
  return Yc = function(r, i) {
    var o, u, l, c, I, y, _, x, k, D, K, C, M, J, X, le, ce, fe, oe, ke, Be, Ce, $e, Fe, Se;
    o = r.state, u = r.next_in, Fe = r.input, l = u + (r.avail_in - 5), c = r.next_out, Se = r.output, I = c - (i - r.avail_out), y = c + (r.avail_out - 257), _ = o.dmax, x = o.wsize, k = o.whave, D = o.wnext, K = o.window, C = o.hold, M = o.bits, J = o.lencode, X = o.distcode, le = (1 << o.lenbits) - 1, ce = (1 << o.distbits) - 1;
    e:
      do {
        M < 15 && (C += Fe[u++] << M, M += 8, C += Fe[u++] << M, M += 8), fe = J[C & le];
        t:
          for (; ; ) {
            if (oe = fe >>> 24, C >>>= oe, M -= oe, oe = fe >>> 16 & 255, oe === 0)
              Se[c++] = fe & 65535;
            else if (oe & 16) {
              ke = fe & 65535, oe &= 15, oe && (M < oe && (C += Fe[u++] << M, M += 8), ke += C & (1 << oe) - 1, C >>>= oe, M -= oe), M < 15 && (C += Fe[u++] << M, M += 8, C += Fe[u++] << M, M += 8), fe = X[C & ce];
              r:
                for (; ; ) {
                  if (oe = fe >>> 24, C >>>= oe, M -= oe, oe = fe >>> 16 & 255, oe & 16) {
                    if (Be = fe & 65535, oe &= 15, M < oe && (C += Fe[u++] << M, M += 8, M < oe && (C += Fe[u++] << M, M += 8)), Be += C & (1 << oe) - 1, Be > _) {
                      r.msg = "invalid distance too far back", o.mode = n;
                      break e;
                    }
                    if (C >>>= oe, M -= oe, oe = c - I, Be > oe) {
                      if (oe = Be - oe, oe > k && o.sane) {
                        r.msg = "invalid distance too far back", o.mode = n;
                        break e;
                      }
                      if (Ce = 0, $e = K, D === 0) {
                        if (Ce += x - oe, oe < ke) {
                          ke -= oe;
                          do
                            Se[c++] = K[Ce++];
                          while (--oe);
                          Ce = c - Be, $e = Se;
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
                            Ce = c - Be, $e = Se;
                          }
                        }
                      } else if (Ce += D - oe, oe < ke) {
                        ke -= oe;
                        do
                          Se[c++] = K[Ce++];
                        while (--oe);
                        Ce = c - Be, $e = Se;
                      }
                      for (; ke > 2; )
                        Se[c++] = $e[Ce++], Se[c++] = $e[Ce++], Se[c++] = $e[Ce++], ke -= 3;
                      ke && (Se[c++] = $e[Ce++], ke > 1 && (Se[c++] = $e[Ce++]));
                    } else {
                      Ce = c - Be;
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
      } while (u < l && c < y);
    ke = M >> 3, u -= ke, M -= ke << 3, C &= (1 << M) - 1, r.next_in = u, r.next_out = c, r.avail_in = u < l ? 5 + (l - u) : 5 - (u - l), r.avail_out = c < y ? 257 + (y - c) : 257 - (c - y), o.hold = C, o.bits = M;
  }, Yc;
}
var Vc, Kv;
function gb() {
  if (Kv) return Vc;
  Kv = 1;
  var n = Si(), e = 15, t = 852, r = 592, i = 0, o = 1, u = 2, l = [
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
  ], I = [
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
  ], y = [
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
  return Vc = function(x, k, D, K, C, M, J, X) {
    var le = X.bits, ce = 0, fe = 0, oe = 0, ke = 0, Be = 0, Ce = 0, $e = 0, Fe = 0, Se = 0, Ue = 0, ot, vt, we, He, Ke, It = null, Ve = 0, Xe, Ze = new n.Buf16(e + 1), wt = new n.Buf16(e + 1), gt = null, We = 0, lt, Pe, he;
    for (ce = 0; ce <= e; ce++)
      Ze[ce] = 0;
    for (fe = 0; fe < K; fe++)
      Ze[k[D + fe]]++;
    for (Be = le, ke = e; ke >= 1 && Ze[ke] === 0; ke--)
      ;
    if (Be > ke && (Be = ke), ke === 0)
      return C[M++] = 1 << 24 | 64 << 16 | 0, C[M++] = 1 << 24 | 64 << 16 | 0, X.bits = 1, 0;
    for (oe = 1; oe < ke && Ze[oe] === 0; oe++)
      ;
    for (Be < oe && (Be = oe), Fe = 1, ce = 1; ce <= e; ce++)
      if (Fe <<= 1, Fe -= Ze[ce], Fe < 0)
        return -1;
    if (Fe > 0 && (x === i || ke !== 1))
      return -1;
    for (wt[1] = 0, ce = 1; ce < e; ce++)
      wt[ce + 1] = wt[ce] + Ze[ce];
    for (fe = 0; fe < K; fe++)
      k[D + fe] !== 0 && (J[wt[k[D + fe]]++] = fe);
    if (x === i ? (It = gt = J, Xe = 19) : x === o ? (It = l, Ve -= 257, gt = c, We -= 257, Xe = 256) : (It = I, gt = y, Xe = -1), Ue = 0, fe = 0, ce = oe, Ke = M, Ce = Be, $e = 0, we = -1, Se = 1 << Be, He = Se - 1, x === o && Se > t || x === u && Se > r)
      return 1;
    for (; ; ) {
      lt = ce - $e, J[fe] < Xe ? (Pe = 0, he = J[fe]) : J[fe] > Xe ? (Pe = gt[We + J[fe]], he = It[Ve + J[fe]]) : (Pe = 96, he = 0), ot = 1 << ce - $e, vt = 1 << Ce, oe = vt;
      do
        vt -= ot, C[Ke + (Ue >> $e) + vt] = lt << 24 | Pe << 16 | he | 0;
      while (vt !== 0);
      for (ot = 1 << ce - 1; Ue & ot; )
        ot >>= 1;
      if (ot !== 0 ? (Ue &= ot - 1, Ue += ot) : Ue = 0, fe++, --Ze[ce] === 0) {
        if (ce === ke)
          break;
        ce = k[D + J[fe]];
      }
      if (ce > Be && (Ue & He) !== we) {
        for ($e === 0 && ($e = Be), Ke += oe, Ce = ce - $e, Fe = 1 << Ce; Ce + $e < ke && (Fe -= Ze[Ce + $e], !(Fe <= 0)); )
          Ce++, Fe <<= 1;
        if (Se += 1 << Ce, x === o && Se > t || x === u && Se > r)
          return 1;
        we = Ue & He, C[we] = Be << 24 | Ce << 16 | Ke - M | 0;
      }
    }
    return Ue !== 0 && (C[Ke + Ue] = ce - $e << 24 | 64 << 16 | 0), X.bits = Be, 0;
  }, Vc;
}
var zv;
function yb() {
  if (zv) return Mr;
  zv = 1;
  var n = Si(), e = L0(), t = q0(), r = vb(), i = gb(), o = 0, u = 1, l = 2, c = 4, I = 5, y = 6, _ = 0, x = 1, k = 2, D = -2, K = -3, C = -4, M = -5, J = 8, X = 1, le = 2, ce = 3, fe = 4, oe = 5, ke = 6, Be = 7, Ce = 8, $e = 9, Fe = 10, Se = 11, Ue = 12, ot = 13, vt = 14, we = 15, He = 16, Ke = 17, It = 18, Ve = 19, Xe = 20, Ze = 21, wt = 22, gt = 23, We = 24, lt = 25, Pe = 26, he = 27, Le = 28, et = 29, me = 30, je = 31, yt = 32, ht = 852, ct = 592, st = 15, qe = st;
  function Ot(B) {
    return (B >>> 24 & 255) + (B >>> 8 & 65280) + ((B & 65280) << 8) + ((B & 255) << 24);
  }
  function Rt() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  function Me(B) {
    var q;
    return !B || !B.state ? D : (q = B.state, B.total_in = B.total_out = q.total = 0, B.msg = "", q.wrap && (B.adler = q.wrap & 1), q.mode = X, q.last = 0, q.havedict = 0, q.dmax = 32768, q.head = null, q.hold = 0, q.bits = 0, q.lencode = q.lendyn = new n.Buf32(ht), q.distcode = q.distdyn = new n.Buf32(ct), q.sane = 1, q.back = -1, _);
  }
  function Qe(B) {
    var q;
    return !B || !B.state ? D : (q = B.state, q.wsize = 0, q.whave = 0, q.wnext = 0, Me(B));
  }
  function St(B, q) {
    var w, se;
    return !B || !B.state || (se = B.state, q < 0 ? (w = 0, q = -q) : (w = (q >> 4) + 1, q < 48 && (q &= 15)), q && (q < 8 || q > 15)) ? D : (se.window !== null && se.wbits !== q && (se.window = null), se.wrap = w, se.wbits = q, Qe(B));
  }
  function Lt(B, q) {
    var w, se;
    return B ? (se = new Rt(), B.state = se, se.window = null, w = St(B, q), w !== _ && (B.state = null), w) : D;
  }
  function _t(B) {
    return Lt(B, qe);
  }
  var Qt = !0, S, d;
  function v(B) {
    if (Qt) {
      var q;
      for (S = new n.Buf32(512), d = new n.Buf32(32), q = 0; q < 144; )
        B.lens[q++] = 8;
      for (; q < 256; )
        B.lens[q++] = 9;
      for (; q < 280; )
        B.lens[q++] = 7;
      for (; q < 288; )
        B.lens[q++] = 8;
      for (i(u, B.lens, 0, 288, S, 0, B.work, { bits: 9 }), q = 0; q < 32; )
        B.lens[q++] = 5;
      i(l, B.lens, 0, 32, d, 0, B.work, { bits: 5 }), Qt = !1;
    }
    B.lencode = S, B.lenbits = 9, B.distcode = d, B.distbits = 5;
  }
  function R(B, q, w, se) {
    var Ne, f = B.state;
    return f.window === null && (f.wsize = 1 << f.wbits, f.wnext = 0, f.whave = 0, f.window = new n.Buf8(f.wsize)), se >= f.wsize ? (n.arraySet(f.window, q, w - f.wsize, f.wsize, 0), f.wnext = 0, f.whave = f.wsize) : (Ne = f.wsize - f.wnext, Ne > se && (Ne = se), n.arraySet(f.window, q, w - se, Ne, f.wnext), se -= Ne, se ? (n.arraySet(f.window, q, w - se, se, 0), f.wnext = se, f.whave = f.wsize) : (f.wnext += Ne, f.wnext === f.wsize && (f.wnext = 0), f.whave < f.wsize && (f.whave += Ne))), 0;
  }
  function m(B, q) {
    var w, se, Ne, f, te, ie, A, F, Z, Oe, Ee, xe, Je, Rr, bt = 0, Te, tt, $t, Mt, _n, wn, Tt, Pt, At = new n.Buf8(4), jt, cr, oa = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!B || !B.state || !B.output || !B.input && B.avail_in !== 0)
      return D;
    w = B.state, w.mode === Ue && (w.mode = ot), te = B.next_out, Ne = B.output, A = B.avail_out, f = B.next_in, se = B.input, ie = B.avail_in, F = w.hold, Z = w.bits, Oe = ie, Ee = A, Pt = _;
    e:
      for (; ; )
        switch (w.mode) {
          case X:
            if (w.wrap === 0) {
              w.mode = ot;
              break;
            }
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (w.wrap & 2 && F === 35615) {
              w.check = 0, At[0] = F & 255, At[1] = F >>> 8 & 255, w.check = t(w.check, At, 2, 0), F = 0, Z = 0, w.mode = le;
              break;
            }
            if (w.flags = 0, w.head && (w.head.done = !1), !(w.wrap & 1) || /* check if zlib header allowed */
            (((F & 255) << 8) + (F >> 8)) % 31) {
              B.msg = "incorrect header check", w.mode = me;
              break;
            }
            if ((F & 15) !== J) {
              B.msg = "unknown compression method", w.mode = me;
              break;
            }
            if (F >>>= 4, Z -= 4, Tt = (F & 15) + 8, w.wbits === 0)
              w.wbits = Tt;
            else if (Tt > w.wbits) {
              B.msg = "invalid window size", w.mode = me;
              break;
            }
            w.dmax = 1 << Tt, B.adler = w.check = 1, w.mode = F & 512 ? Fe : Ue, F = 0, Z = 0;
            break;
          case le:
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (w.flags = F, (w.flags & 255) !== J) {
              B.msg = "unknown compression method", w.mode = me;
              break;
            }
            if (w.flags & 57344) {
              B.msg = "unknown header flags set", w.mode = me;
              break;
            }
            w.head && (w.head.text = F >> 8 & 1), w.flags & 512 && (At[0] = F & 255, At[1] = F >>> 8 & 255, w.check = t(w.check, At, 2, 0)), F = 0, Z = 0, w.mode = ce;
          /* falls through */
          case ce:
            for (; Z < 32; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            w.head && (w.head.time = F), w.flags & 512 && (At[0] = F & 255, At[1] = F >>> 8 & 255, At[2] = F >>> 16 & 255, At[3] = F >>> 24 & 255, w.check = t(w.check, At, 4, 0)), F = 0, Z = 0, w.mode = fe;
          /* falls through */
          case fe:
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            w.head && (w.head.xflags = F & 255, w.head.os = F >> 8), w.flags & 512 && (At[0] = F & 255, At[1] = F >>> 8 & 255, w.check = t(w.check, At, 2, 0)), F = 0, Z = 0, w.mode = oe;
          /* falls through */
          case oe:
            if (w.flags & 1024) {
              for (; Z < 16; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              w.length = F, w.head && (w.head.extra_len = F), w.flags & 512 && (At[0] = F & 255, At[1] = F >>> 8 & 255, w.check = t(w.check, At, 2, 0)), F = 0, Z = 0;
            } else w.head && (w.head.extra = null);
            w.mode = ke;
          /* falls through */
          case ke:
            if (w.flags & 1024 && (xe = w.length, xe > ie && (xe = ie), xe && (w.head && (Tt = w.head.extra_len - w.length, w.head.extra || (w.head.extra = new Array(w.head.extra_len)), n.arraySet(
              w.head.extra,
              se,
              f,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              xe,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Tt
            )), w.flags & 512 && (w.check = t(w.check, se, xe, f)), ie -= xe, f += xe, w.length -= xe), w.length))
              break e;
            w.length = 0, w.mode = Be;
          /* falls through */
          case Be:
            if (w.flags & 2048) {
              if (ie === 0)
                break e;
              xe = 0;
              do
                Tt = se[f + xe++], w.head && Tt && w.length < 65536 && (w.head.name += String.fromCharCode(Tt));
              while (Tt && xe < ie);
              if (w.flags & 512 && (w.check = t(w.check, se, xe, f)), ie -= xe, f += xe, Tt)
                break e;
            } else w.head && (w.head.name = null);
            w.length = 0, w.mode = Ce;
          /* falls through */
          case Ce:
            if (w.flags & 4096) {
              if (ie === 0)
                break e;
              xe = 0;
              do
                Tt = se[f + xe++], w.head && Tt && w.length < 65536 && (w.head.comment += String.fromCharCode(Tt));
              while (Tt && xe < ie);
              if (w.flags & 512 && (w.check = t(w.check, se, xe, f)), ie -= xe, f += xe, Tt)
                break e;
            } else w.head && (w.head.comment = null);
            w.mode = $e;
          /* falls through */
          case $e:
            if (w.flags & 512) {
              for (; Z < 16; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if (F !== (w.check & 65535)) {
                B.msg = "header crc mismatch", w.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            w.head && (w.head.hcrc = w.flags >> 9 & 1, w.head.done = !0), B.adler = w.check = 0, w.mode = Ue;
            break;
          case Fe:
            for (; Z < 32; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            B.adler = w.check = Ot(F), F = 0, Z = 0, w.mode = Se;
          /* falls through */
          case Se:
            if (w.havedict === 0)
              return B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, w.hold = F, w.bits = Z, k;
            B.adler = w.check = 1, w.mode = Ue;
          /* falls through */
          case Ue:
            if (q === I || q === y)
              break e;
          /* falls through */
          case ot:
            if (w.last) {
              F >>>= Z & 7, Z -= Z & 7, w.mode = he;
              break;
            }
            for (; Z < 3; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            switch (w.last = F & 1, F >>>= 1, Z -= 1, F & 3) {
              case 0:
                w.mode = vt;
                break;
              case 1:
                if (v(w), w.mode = Xe, q === y) {
                  F >>>= 2, Z -= 2;
                  break e;
                }
                break;
              case 2:
                w.mode = Ke;
                break;
              case 3:
                B.msg = "invalid block type", w.mode = me;
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
              B.msg = "invalid stored block lengths", w.mode = me;
              break;
            }
            if (w.length = F & 65535, F = 0, Z = 0, w.mode = we, q === y)
              break e;
          /* falls through */
          case we:
            w.mode = He;
          /* falls through */
          case He:
            if (xe = w.length, xe) {
              if (xe > ie && (xe = ie), xe > A && (xe = A), xe === 0)
                break e;
              n.arraySet(Ne, se, f, xe, te), ie -= xe, f += xe, A -= xe, te += xe, w.length -= xe;
              break;
            }
            w.mode = Ue;
            break;
          case Ke:
            for (; Z < 14; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (w.nlen = (F & 31) + 257, F >>>= 5, Z -= 5, w.ndist = (F & 31) + 1, F >>>= 5, Z -= 5, w.ncode = (F & 15) + 4, F >>>= 4, Z -= 4, w.nlen > 286 || w.ndist > 30) {
              B.msg = "too many length or distance symbols", w.mode = me;
              break;
            }
            w.have = 0, w.mode = It;
          /* falls through */
          case It:
            for (; w.have < w.ncode; ) {
              for (; Z < 3; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              w.lens[oa[w.have++]] = F & 7, F >>>= 3, Z -= 3;
            }
            for (; w.have < 19; )
              w.lens[oa[w.have++]] = 0;
            if (w.lencode = w.lendyn, w.lenbits = 7, jt = { bits: w.lenbits }, Pt = i(o, w.lens, 0, 19, w.lencode, 0, w.work, jt), w.lenbits = jt.bits, Pt) {
              B.msg = "invalid code lengths set", w.mode = me;
              break;
            }
            w.have = 0, w.mode = Ve;
          /* falls through */
          case Ve:
            for (; w.have < w.nlen + w.ndist; ) {
              for (; bt = w.lencode[F & (1 << w.lenbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, $t = bt & 65535, !(Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if ($t < 16)
                F >>>= Te, Z -= Te, w.lens[w.have++] = $t;
              else {
                if ($t === 16) {
                  for (cr = Te + 2; Z < cr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  if (F >>>= Te, Z -= Te, w.have === 0) {
                    B.msg = "invalid bit length repeat", w.mode = me;
                    break;
                  }
                  Tt = w.lens[w.have - 1], xe = 3 + (F & 3), F >>>= 2, Z -= 2;
                } else if ($t === 17) {
                  for (cr = Te + 3; Z < cr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  F >>>= Te, Z -= Te, Tt = 0, xe = 3 + (F & 7), F >>>= 3, Z -= 3;
                } else {
                  for (cr = Te + 7; Z < cr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  F >>>= Te, Z -= Te, Tt = 0, xe = 11 + (F & 127), F >>>= 7, Z -= 7;
                }
                if (w.have + xe > w.nlen + w.ndist) {
                  B.msg = "invalid bit length repeat", w.mode = me;
                  break;
                }
                for (; xe--; )
                  w.lens[w.have++] = Tt;
              }
            }
            if (w.mode === me)
              break;
            if (w.lens[256] === 0) {
              B.msg = "invalid code -- missing end-of-block", w.mode = me;
              break;
            }
            if (w.lenbits = 9, jt = { bits: w.lenbits }, Pt = i(u, w.lens, 0, w.nlen, w.lencode, 0, w.work, jt), w.lenbits = jt.bits, Pt) {
              B.msg = "invalid literal/lengths set", w.mode = me;
              break;
            }
            if (w.distbits = 6, w.distcode = w.distdyn, jt = { bits: w.distbits }, Pt = i(l, w.lens, w.nlen, w.ndist, w.distcode, 0, w.work, jt), w.distbits = jt.bits, Pt) {
              B.msg = "invalid distances set", w.mode = me;
              break;
            }
            if (w.mode = Xe, q === y)
              break e;
          /* falls through */
          case Xe:
            w.mode = Ze;
          /* falls through */
          case Ze:
            if (ie >= 6 && A >= 258) {
              B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, w.hold = F, w.bits = Z, r(B, Ee), te = B.next_out, Ne = B.output, A = B.avail_out, f = B.next_in, se = B.input, ie = B.avail_in, F = w.hold, Z = w.bits, w.mode === Ue && (w.back = -1);
              break;
            }
            for (w.back = 0; bt = w.lencode[F & (1 << w.lenbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, $t = bt & 65535, !(Te <= Z); ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (tt && (tt & 240) === 0) {
              for (Mt = Te, _n = tt, wn = $t; bt = w.lencode[wn + ((F & (1 << Mt + _n) - 1) >> Mt)], Te = bt >>> 24, tt = bt >>> 16 & 255, $t = bt & 65535, !(Mt + Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              F >>>= Mt, Z -= Mt, w.back += Mt;
            }
            if (F >>>= Te, Z -= Te, w.back += Te, w.length = $t, tt === 0) {
              w.mode = Pe;
              break;
            }
            if (tt & 32) {
              w.back = -1, w.mode = Ue;
              break;
            }
            if (tt & 64) {
              B.msg = "invalid literal/length code", w.mode = me;
              break;
            }
            w.extra = tt & 15, w.mode = wt;
          /* falls through */
          case wt:
            if (w.extra) {
              for (cr = w.extra; Z < cr; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              w.length += F & (1 << w.extra) - 1, F >>>= w.extra, Z -= w.extra, w.back += w.extra;
            }
            w.was = w.length, w.mode = gt;
          /* falls through */
          case gt:
            for (; bt = w.distcode[F & (1 << w.distbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, $t = bt & 65535, !(Te <= Z); ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if ((tt & 240) === 0) {
              for (Mt = Te, _n = tt, wn = $t; bt = w.distcode[wn + ((F & (1 << Mt + _n) - 1) >> Mt)], Te = bt >>> 24, tt = bt >>> 16 & 255, $t = bt & 65535, !(Mt + Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              F >>>= Mt, Z -= Mt, w.back += Mt;
            }
            if (F >>>= Te, Z -= Te, w.back += Te, tt & 64) {
              B.msg = "invalid distance code", w.mode = me;
              break;
            }
            w.offset = $t, w.extra = tt & 15, w.mode = We;
          /* falls through */
          case We:
            if (w.extra) {
              for (cr = w.extra; Z < cr; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              w.offset += F & (1 << w.extra) - 1, F >>>= w.extra, Z -= w.extra, w.back += w.extra;
            }
            if (w.offset > w.dmax) {
              B.msg = "invalid distance too far back", w.mode = me;
              break;
            }
            w.mode = lt;
          /* falls through */
          case lt:
            if (A === 0)
              break e;
            if (xe = Ee - A, w.offset > xe) {
              if (xe = w.offset - xe, xe > w.whave && w.sane) {
                B.msg = "invalid distance too far back", w.mode = me;
                break;
              }
              xe > w.wnext ? (xe -= w.wnext, Je = w.wsize - xe) : Je = w.wnext - xe, xe > w.length && (xe = w.length), Rr = w.window;
            } else
              Rr = Ne, Je = te - w.offset, xe = w.length;
            xe > A && (xe = A), A -= xe, w.length -= xe;
            do
              Ne[te++] = Rr[Je++];
            while (--xe);
            w.length === 0 && (w.mode = Ze);
            break;
          case Pe:
            if (A === 0)
              break e;
            Ne[te++] = w.length, A--, w.mode = Ze;
            break;
          case he:
            if (w.wrap) {
              for (; Z < 32; ) {
                if (ie === 0)
                  break e;
                ie--, F |= se[f++] << Z, Z += 8;
              }
              if (Ee -= A, B.total_out += Ee, w.total += Ee, Ee && (B.adler = w.check = /*UPDATE(state.check, put - _out, _out);*/
              w.flags ? t(w.check, Ne, Ee, te - Ee) : e(w.check, Ne, Ee, te - Ee)), Ee = A, (w.flags ? F : Ot(F)) !== w.check) {
                B.msg = "incorrect data check", w.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            w.mode = Le;
          /* falls through */
          case Le:
            if (w.wrap && w.flags) {
              for (; Z < 32; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if (F !== (w.total & 4294967295)) {
                B.msg = "incorrect length check", w.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            w.mode = et;
          /* falls through */
          case et:
            Pt = x;
            break e;
          case me:
            Pt = K;
            break e;
          case je:
            return C;
          case yt:
          /* falls through */
          default:
            return D;
        }
    return B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, w.hold = F, w.bits = Z, (w.wsize || Ee !== B.avail_out && w.mode < me && (w.mode < he || q !== c)) && R(B, B.output, B.next_out, Ee - B.avail_out), Oe -= B.avail_in, Ee -= B.avail_out, B.total_in += Oe, B.total_out += Ee, w.total += Ee, w.wrap && Ee && (B.adler = w.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    w.flags ? t(w.check, Ne, Ee, B.next_out - Ee) : e(w.check, Ne, Ee, B.next_out - Ee)), B.data_type = w.bits + (w.last ? 64 : 0) + (w.mode === Ue ? 128 : 0) + (w.mode === Xe || w.mode === we ? 256 : 0), (Oe === 0 && Ee === 0 || q === c) && Pt === _ && (Pt = M), Pt;
  }
  function T(B) {
    if (!B || !B.state)
      return D;
    var q = B.state;
    return q.window && (q.window = null), B.state = null, _;
  }
  function L(B, q) {
    var w;
    return !B || !B.state || (w = B.state, (w.wrap & 2) === 0) ? D : (w.head = q, q.done = !1, _);
  }
  function ue(B, q) {
    var w = q.length, se, Ne, f;
    return !B || !B.state || (se = B.state, se.wrap !== 0 && se.mode !== Se) ? D : se.mode === Se && (Ne = 1, Ne = e(Ne, q, w, 0), Ne !== se.check) ? K : (f = R(B, q, w, w), f ? (se.mode = je, C) : (se.havedict = 1, _));
  }
  return Mr.inflateReset = Qe, Mr.inflateReset2 = St, Mr.inflateResetKeep = Me, Mr.inflateInit = _t, Mr.inflateInit2 = Lt, Mr.inflate = m, Mr.inflateEnd = T, Mr.inflateGetHeader = L, Mr.inflateSetDictionary = ue, Mr.inflateInfo = "pako inflate (from Nodeca project)", Mr;
}
var Jc, Gv;
function $0() {
  return Gv || (Gv = 1, Jc = {
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
  }), Jc;
}
var Zc, Hv;
function mb() {
  if (Hv) return Zc;
  Hv = 1;
  function n() {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
  }
  return Zc = n, Zc;
}
var Wv;
function Ib() {
  if (Wv) return Os;
  Wv = 1;
  var n = yb(), e = Si(), t = M0(), r = $0(), i = uh(), o = U0(), u = mb(), l = Object.prototype.toString;
  function c(_) {
    if (!(this instanceof c)) return new c(_);
    this.options = e.assign({
      chunkSize: 16384,
      windowBits: 0,
      to: ""
    }, _ || {});
    var x = this.options;
    x.raw && x.windowBits >= 0 && x.windowBits < 16 && (x.windowBits = -x.windowBits, x.windowBits === 0 && (x.windowBits = -15)), x.windowBits >= 0 && x.windowBits < 16 && !(_ && _.windowBits) && (x.windowBits += 32), x.windowBits > 15 && x.windowBits < 48 && (x.windowBits & 15) === 0 && (x.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new o(), this.strm.avail_out = 0;
    var k = n.inflateInit2(
      this.strm,
      x.windowBits
    );
    if (k !== r.Z_OK)
      throw new Error(i[k]);
    if (this.header = new u(), n.inflateGetHeader(this.strm, this.header), x.dictionary && (typeof x.dictionary == "string" ? x.dictionary = t.string2buf(x.dictionary) : l.call(x.dictionary) === "[object ArrayBuffer]" && (x.dictionary = new Uint8Array(x.dictionary)), x.raw && (k = n.inflateSetDictionary(this.strm, x.dictionary), k !== r.Z_OK)))
      throw new Error(i[k]);
  }
  c.prototype.push = function(_, x) {
    var k = this.strm, D = this.options.chunkSize, K = this.options.dictionary, C, M, J, X, le, ce = !1;
    if (this.ended)
      return !1;
    M = x === ~~x ? x : x === !0 ? r.Z_FINISH : r.Z_NO_FLUSH, typeof _ == "string" ? k.input = t.binstring2buf(_) : l.call(_) === "[object ArrayBuffer]" ? k.input = new Uint8Array(_) : k.input = _, k.next_in = 0, k.avail_in = k.input.length;
    do {
      if (k.avail_out === 0 && (k.output = new e.Buf8(D), k.next_out = 0, k.avail_out = D), C = n.inflate(k, r.Z_NO_FLUSH), C === r.Z_NEED_DICT && K && (C = n.inflateSetDictionary(this.strm, K)), C === r.Z_BUF_ERROR && ce === !0 && (C = r.Z_OK, ce = !1), C !== r.Z_STREAM_END && C !== r.Z_OK)
        return this.onEnd(C), this.ended = !0, !1;
      k.next_out && (k.avail_out === 0 || C === r.Z_STREAM_END || k.avail_in === 0 && (M === r.Z_FINISH || M === r.Z_SYNC_FLUSH)) && (this.options.to === "string" ? (J = t.utf8border(k.output, k.next_out), X = k.next_out - J, le = t.buf2string(k.output, J), k.next_out = X, k.avail_out = D - X, X && e.arraySet(k.output, k.output, J, X, 0), this.onData(le)) : this.onData(e.shrinkBuf(k.output, k.next_out))), k.avail_in === 0 && k.avail_out === 0 && (ce = !0);
    } while ((k.avail_in > 0 || k.avail_out === 0) && C !== r.Z_STREAM_END);
    return C === r.Z_STREAM_END && (M = r.Z_FINISH), M === r.Z_FINISH ? (C = n.inflateEnd(this.strm), this.onEnd(C), this.ended = !0, C === r.Z_OK) : (M === r.Z_SYNC_FLUSH && (this.onEnd(r.Z_OK), k.avail_out = 0), !0);
  }, c.prototype.onData = function(_) {
    this.chunks.push(_);
  }, c.prototype.onEnd = function(_) {
    _ === r.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = e.flattenChunks(this.chunks)), this.chunks = [], this.err = _, this.msg = this.strm.msg;
  };
  function I(_, x) {
    var k = new c(x);
    if (k.push(_, !0), k.err)
      throw k.msg || i[k.err];
    return k.result;
  }
  function y(_, x) {
    return x = x || {}, x.raw = !0, I(_, x);
  }
  return Os.Inflate = c, Os.inflate = I, Os.inflateRaw = y, Os.ungzip = I, Os;
}
var Qc, Yv;
function bb() {
  if (Yv) return Qc;
  Yv = 1;
  var n = Si().assign, e = db(), t = Ib(), r = $0(), i = {};
  return n(i, e, t, r), Qc = i, Qc;
}
var _b = bb();
const wb = /* @__PURE__ */ Af(_b), lh = O0([C0, "blip"]), Vv = 15, xb = 50 * 1024, Eb = 128e3, _f = {
  /** The maximum number of bytes of a message to send in a single frame (WebSocket message.) */
  MaxFrameSize: 16384,
  /** Maximum size that the WebSocket's `bufferedAmount` can grow to;
   * if it exceeds this, BLIP stops sending frames until it goes down. */
  MaxBufferedAmount: 1e3 * 1024,
  // Maximum buffered outgoing bytes
  /** How long (in milliseconds) BLIP waits before trying to send again when the WebSocket's
   *  `bufferedAmount` is too large. */
  BufferDelayMS: 100
}, wf = new Uint8Array(4);
wf[2] = wf[3] = 255;
var Vs;
class Jv {
  constructor() {
    ee(this, Vs, lb());
  }
  add(e) {
    return G(this, Vs, cb(p(this, Vs), e)), this.value;
  }
  get value() {
    return fb(p(this, Vs));
  }
}
Vs = new WeakMap();
var ii;
class Sb {
  constructor() {
    ee(this, ii);
    G(this, ii, new wb.Inflate({ raw: !0, windowBits: 15 })), p(this, ii).onEnd = (e) => {
      if (e !== 0)
        throw Error(`Inflate error ${e}`);
    };
  }
  decompress(e, t) {
    p(this, ii).onData = t, p(this, ii).push(e), p(this, ii).push(wf, 2);
  }
}
ii = new WeakMap();
class Ab {
  constructor(e, t, r = "throw") {
    this.resolve = e, this.reject = t, this.mode = r;
  }
}
class j0 {
  constructor(e, t) {
    ve(this, "logger", lh);
    ve(this, "flags");
    ve(this, "msgNo");
    ve(this, "promiseKeeper");
    if (this.flags = e, this.promiseKeeper = t, e & vs.Compressed)
      throw Error("Sending compressed messages is unimplemented!");
  }
  get type() {
    return this.flags & In.TypeMask;
  }
}
var Qi, hn, Js, Ef;
class kb extends j0 {
  /** Constructor takes a Message object to send. */
  constructor(t, r) {
    super(t.flags | In.MoreComing, r);
    ee(this, Qi);
    ee(this, hn, 0);
    ee(this, Js, 0);
    ee(this, Ef);
    t.isReply ? (De(t.hasNumber, "Outgoing reply must have a number"), this.msgNo = t.number) : De(!t.hasNumber, "Outgoing request must not have a number yet"), G(this, Qi, t.encodeBinary()), G(this, hn, 0);
  }
  /** Returns the next frame to send, as a {@link Uint8Array}. */
  nextFrame(t) {
    const r = p(this, Qi).length - p(this, hn);
    De(r > 0);
    const i = Math.min(r, _f.MaxFrameSize - Vv), o = i + Vv, u = new ArrayBuffer(o), l = new Uint8Array(u);
    let c = Ds(l, 0, this.msgNo);
    i === r && (this.flags &= ~In.MoreComing), c = Ds(l, c, this.flags);
    const I = p(this, Qi).slice(p(this, hn), p(this, hn) + i);
    l.set(I, c), G(this, hn, p(this, hn) + i), G(this, Js, p(this, Js) + i), c += i;
    const y = t.add(I);
    return new DataView(l.buffer, l.byteOffset).setUint32(c, y), c += 4, l.subarray(0, c);
  }
  receivedACK(t) {
    G(this, Js, Math.max(0, p(this, hn) - t));
  }
  /** Becomes true when the message has been completely sent. */
  get needsACK() {
    return p(this, Js) > Eb;
  }
  /** Becomes true when the message has been completely sent. */
  get finished() {
    return p(this, hn) >= p(this, Qi).length;
  }
}
Qi = new WeakMap(), hn = new WeakMap(), Js = new WeakMap(), Ef = new WeakMap();
var Yo;
class Ob extends j0 {
  constructor(t, r, i, o) {
    const u = t ? Dr.ACKRPY : Dr.ACKMSG;
    super(u | vs.Urgent | vs.NoReply, null);
    ee(this, Yo);
    this.msgNo = r, G(this, Yo, i), this.logger = o;
  }
  nextFrame(t) {
    const r = new ArrayBuffer(10), i = new Uint8Array(r);
    let o = Ds(i, 0, this.msgNo);
    return o = Ds(i, o, this.flags), o = Ds(i, o, p(this, Yo)), i.subarray(0, o);
  }
  get needsACK() {
    return !1;
  }
  get finished() {
    return !0;
  }
}
Yo = new WeakMap();
var Vo, Zs, Rn, Jo, Qs;
class Zv {
  constructor(e, t) {
    ve(this, "promiseKeeper");
    ee(this, Vo);
    ee(this, Zs);
    ee(this, Rn);
    ee(this, Jo, 0);
    ee(this, Qs, 0);
    G(this, Vo, e), this.promiseKeeper = t;
  }
  /** Reads the next frame of the message.
   *  Returns a {@link Message} object when it's complete, else null. */
  addFrame(e, t, r, i) {
    if (G(this, Jo, p(this, Jo) + e.length), G(this, Qs, p(this, Qs) + e.length), p(this, Rn) === void 0)
      G(this, Zs, t & ~In.MoreComing), G(this, Rn, []);
    else if ((t & ~In.MoreComing) !== p(this, Zs))
      throw Error("Invalid frame: mismatched flags");
    const o = (t & In.MoreComing) !== 0, u = e.subarray(0, e.length - 4);
    let l = null;
    if (t & vs.Compressed) {
      if (r.decompress(u, (y) => {
        p(this, Rn).push(y), l = i.add(y);
      }), l === null)
        throw Error("Inflate didn't produce any data");
    } else
      p(this, Rn).push(u), l = i.add(u);
    const I = new DataView(e.buffer, e.byteOffset).getUint32(e.length - 4);
    if (I !== l)
      throw Error("Invalid checksum: expected " + l.toString(16) + ", got " + I.toString(16));
    if (o)
      return null;
    {
      const y = F0(p(this, Rn));
      return G(this, Rn, []), Fo.decodedFromBinary(y, p(this, Zs), p(this, Vo));
    }
  }
  get bytesToAck() {
    return p(this, Qs) >= xb ? (G(this, Qs, 0), p(this, Jo)) : 0;
  }
}
Vo = new WeakMap(), Zs = new WeakMap(), Rn = new WeakMap(), Jo = new WeakMap(), Qs = new WeakMap();
var Xi, nu, Jr, es, iu, Xs, su, ts, Zo, Qo;
class Rb {
  constructor() {
    ve(this, "logger", lh);
    ee(this, Xi, !0);
    // Outgoing:
    ee(this, nu, 0);
    ee(this, Jr, []);
    ee(this, es, []);
    ee(this, iu, new Jv());
    // Incoming:
    ee(this, Xs, 0);
    ee(this, su, /* @__PURE__ */ new Map());
    ee(this, ts, /* @__PURE__ */ new Map());
    ee(this, Zo, new Sb());
    ee(this, Qo, new Jv());
  }
  /** Adds an outgoing {@link message} to the queue to be sent.
      Returns a promise of a reply. The message must not have the {@link NoReply} option. */
  async send(e, t) {
    return De(p(this, Xi), "The connection is closed"), De(e.wantsReply, "send() with NoReply message"), new Promise((r, i) => {
      this._send(e, new Ab(r, i, t));
    });
  }
  /** Adds an outgoing {@link message} to the queue to be sent.
      The message must have the {@link NoReply} option. */
  sendNoReply(e) {
    De(p(this, Xi), "The connection is closed"), De(!e.wantsReply, "sendNoReply() with message that wants a reply"), this._send(e, null);
  }
  _send(e, t) {
    const r = new kb(e, t);
    r.logger = this.logger, p(this, Jr).push(r);
  }
  /** Returns the next frame to send, or `null` if there's nothing pending. */
  nextFrameToSend() {
    const e = p(this, Jr).shift();
    if (e === void 0)
      return null;
    if (!e.msgNo) {
      const r = ++Nr(this, nu)._;
      e.msgNo = r, (e.flags & (In.TypeMask | vs.NoReply)) === Dr.MSG && p(this, ts).set(r, new Zv(r, e.promiseKeeper));
    }
    const t = e.nextFrame(p(this, iu));
    return e.finished || (e.needsACK ? p(this, es).push(e) : p(this, Jr).push(e)), t;
  }
  /** Call this when a frame is received.
  When an incoming {@link Message} is completed it will be returned, else `null`. */
  handleIncomingFrame(e) {
    let t, r, i = 0;
    [t, i] = Fa(e, i), [r, i] = Fa(e, i);
    const o = t;
    if (e = e.subarray(i), r > 127)
      throw Error(`Invalid flags ${r.toString(16)}`);
    const u = r & In.TypeMask;
    switch (u) {
      case Dr.MSG:
      case Dr.RPY:
      case Dr.ERR:
        return this.handleMessageFrame(r, o, e);
      case Dr.ACKMSG:
      case Dr.ACKRPY:
        return this.handleACKFrame(u, o, e), null;
      default:
        throw Error(`Received unknown frame type '${If[u]}'`);
    }
  }
  handleMessageFrame(e, t, r) {
    if (r.length < 4)
      throw Error("Frame missing checksum");
    const o = (e & In.TypeMask) !== Dr.MSG, u = o ? p(this, ts) : p(this, su);
    let l = u.get(t);
    if (l) {
      const c = l.addFrame(r, e, p(this, Zo), p(this, Qo));
      if (c) {
        u.delete(t);
        const y = l.promiseKeeper;
        if (y)
          return c.isError && y.mode === "throw" ? y.reject(c.error) : y.resolve(c), null;
      }
      const I = l.bytesToAck;
      return I > 0 && p(this, Jr).push(new Ob(o, t, I, this.logger)), c;
    } else {
      if (o)
        throw Error(`Invalid #${t} in RPY frame doesn't match any pending reply`);
      {
        if (t !== p(this, Xs) + 1)
          throw Error(`Invalid #${t} in incoming MSG frame; max is #${p(this, Xs) + 1}`);
        l = new Zv(t, null);
        const c = l.addFrame(r, e, p(this, Zo), p(this, Qo));
        return G(this, Xs, t), c || u.set(t, l), c;
      }
    }
  }
  handleACKFrame(e, t, r) {
    const i = e === Dr.ACKMSG ? Dr.MSG : Dr.RPY;
    let o = !1, u = p(this, Jr).find((I) => I.msgNo === t && I.type === i);
    if (!u && (o = !0, u = p(this, es).find((I) => I.msgNo === t && I.type === i), !u))
      return;
    let [l, c] = Fa(r, 0);
    if (c !== r.length)
      throw Error("Invalid contents in ACK frame");
    u.receivedACK(l), o && !u.needsACK && (c = p(this, es).indexOf(u), De(c >= 0), p(this, es).splice(c, 1), p(this, Jr).push(u));
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
Xi = new WeakMap(), nu = new WeakMap(), Jr = new WeakMap(), es = new WeakMap(), iu = new WeakMap(), Xs = new WeakMap(), su = new WeakMap(), ts = new WeakMap(), Zo = new WeakMap(), Qo = new WeakMap();
var Ns = null;
typeof WebSocket < "u" ? Ns = WebSocket : typeof MozWebSocket < "u" ? Ns = MozWebSocket : typeof global < "u" ? Ns = global.WebSocket || global.MozWebSocket : typeof window < "u" ? Ns = window.WebSocket || window.MozWebSocket : typeof self < "u" && (Ns = self.WebSocket || self.MozWebSocket);
const Tb = Ns, Cb = "BLIP_3";
var K0 = /* @__PURE__ */ ((n) => (n[n.Connecting = 0] = "Connecting", n[n.Open = 1] = "Open", n[n.Closing = 2] = "Closing", n[n.Closed = 3] = "Closed", n))(K0 || {});
class Nb {
  constructor() {
    ve(this, "logger", lh);
    ve(this, "events", /* @__PURE__ */ new Map());
    ve(this, "msgEvents", new ab());
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
    return this.sendMessage(new gs(e, t), r);
  }
  /** Creates a {@link Message} and queues it to be sent with the {@link NoReply} option.
   * @param props  The properties: either an object, or a string naming the `Profile` property.
   * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
   */
  sendNoReply(e, t = "") {
    this.sendMessageNoReply(new gs(e, t, vs.NoReply));
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
    De(e.isReply), this.sendMessageNoReply(e);
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
var nr, vr, eo, si, Tn, to;
class Pb extends Nb {
  /** Creates and (asynchronously) opens a BLIP connection via a WebSocket.
   * @param url  The `ws:` or `wss:` URL to connect to.
   * @param protocol  The subprotocol of BLIP, to be appended to the WebSocket protocol requested.
   * @param options  Additional for use in node/Bun/Deno. Ignored in a browser. */
  constructor(t, r = "", i) {
    super();
    ee(this, nr);
    ee(this, vr, new Rb());
    ee(this, eo, !1);
    ee(this, si, !1);
    ee(this, Tn, 0);
    ee(this, to, 0);
    ve(this, "timeReceiving", 0);
    ve(this, "timeWaiting", 0);
    ve(this, "timeSending", 0);
    this.logger = this.logger.with({ url: t }), p(this, vr).logger = this.logger;
    const o = [];
    r !== "" && o.push(Cb + "+" + r), i != null && i.oneTimeToken && o.push(`SyncGatewaySession_${i.oneTimeToken}`);
    let u;
    (i == null ? void 0 : i.credentials) !== void 0 && (u = { headers: { Authorization: wg(i.credentials.username, i.credentials.password) } }), G(this, nr, new Tb(t, o, u)), p(this, nr).binaryType = "arraybuffer", p(this, nr).onopen = this.handleWSOpen.bind(this), p(this, nr).onmessage = this.handleWSMessage.bind(this), p(this, nr).onclose = this.handleWSClose.bind(this), p(this, nr).onerror = this.handleWSError.bind(this);
  }
  /** Returns the WebSocket's ready-state. */
  get readyState() {
    return p(this, nr).readyState;
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
    De(t >= 1e3, "Close code must be >= 1000"), G(this, Tn, t), (t !== 1e3 || (i = p(this, vr)) != null && i.safeToClose) && p(this, nr).close(t, r);
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
      return Promise.reject(new ys("Connection is closed", -1));
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
    G(this, eo, !0), this.dispatchEvent("open", void 0), this.sendFrames();
  }
  closed(t, r) {
    const i = p(this, vr);
    G(this, eo, !1), G(this, vr, void 0), i == null || i.closed(t), this.dispatchEvent("close", r ? void 0 : t);
  }
  handleWSClose(t) {
    if (p(this, vr)) {
      const r = new Db(t.code, t.reason), i = t.code === 1e3 && t.wasClean;
      this.closed(r, i);
    }
  }
  handleWSError(t) {
    let r = p(this, eo) ? "Socket disconnected" : "WebSocket connection failed";
    t.message ? r += ": " + t.message : r += " (no information available)";
    const i = Error(r);
    this.closed(i, !1);
  }
  handleWSMessage(t) {
    var l, c;
    const r = globalThis.performance.now();
    p(this, to) > 0 && (this.timeWaiting += r - p(this, to));
    let i;
    if (t.data instanceof Uint8Array)
      i = t.data;
    else if (t.data instanceof ArrayBuffer)
      i = new Uint8Array(t.data);
    else {
      this.logger.warn("Ignoring WebSocket message of wrong type (not Uint8Array or ArrayBuffer)");
      return;
    }
    const o = (l = p(this, vr)) == null ? void 0 : l.handleIncomingFrame(i);
    o ? this.dispatchRequest(o) : p(this, si) || this.sendFrames(), p(this, Tn) !== 0 && ((c = p(this, vr)) != null && c.safeToClose) && p(this, nr).close(p(this, Tn));
    const u = globalThis.performance.now();
    this.timeReceiving += u - r, G(this, to, u);
  }
  dispatchRequest(t) {
    let r;
    try {
      !this.msgEvents.dispatchMessage(t) && !this.dispatchEvent("message", t) && (r = new ys("No handler", 404));
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
    for (G(this, si, !1); p(this, nr).readyState === 1; ) {
      if (p(this, nr).bufferedAmount > _f.MaxBufferedAmount) {
        this.logger.debug("**** PAUSING ****"), G(this, si, !0), setTimeout(
          () => {
            this.logger.debug("**** RESUMING ****"), this.sendFrames();
          },
          _f.BufferDelayMS
        );
        return;
      }
      const u = (i = p(this, vr)) == null ? void 0 : i.nextFrameToSend();
      if (!u)
        break;
      p(this, nr).send(u);
    }
    p(this, Tn) !== 0 && ((o = p(this, vr)) != null && o.safeToClose) && p(this, nr).close(p(this, Tn));
    const r = globalThis.performance.now();
    this.timeSending += r - t;
  }
  preSend(t) {
    if (p(this, vr) && p(this, Tn) === 0)
      return p(this, vr);
    {
      const r = p(this, vr) ? "closing" : "closed";
      t.isReply ? this.logger.warn(`Will not send reply: connection is ${r}`) : this.logger.warn(`Will not send message: connection is ${r}`);
      return;
    }
  }
}
nr = new WeakMap(), vr = new WeakMap(), eo = new WeakMap(), si = new WeakMap(), Tn = new WeakMap(), to = new WeakMap();
class Db extends Error {
  constructor(e, t) {
    super(t ?? Bb[e] ?? "WebSocket error"), this.code = e, this.reason = t;
  }
}
const Bb = {
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
}, Fb = 2e3;
var gr, Cn, Gt, oi, pn, Zr, ai;
class Lb {
  constructor(e, t, r, i) {
    ve(this, "collectionID");
    ve(this, "collectionIndex");
    ve(this, "replicator");
    ee(this, gr);
    ee(this, Cn);
    // The BLIP connection
    ee(this, Gt);
    // Current checkpoint object
    ee(this, oi);
    // Server-side revid of checkpoint
    ee(this, pn);
    // Timer ID from `setTimeout`; for saving
    ee(this, Zr);
    // Outgoing `setCheckpoint` request
    ee(this, ai, !1);
    this.config = t, this.delegate = r, this.replicator = e.replicator, this.collectionID = e.collectionID, this.collectionIndex = e.collectionIndex, G(this, Cn, e.socket), G(this, gr, this.replicator.logger.getChild(["chkpt", this.collectionID])), G(this, Gt, t.initialCheckpoint ?? new gi());
    const o = G(this, oi, i._rev ?? ""), u = gi.fromObject(i);
    p(this, gr).debug`Checkpoint ID is ${t.clientID}. Current server revid is ${o}.`, t.reset ? (p(this, gr).info`Resetting checkpoint by request. Replication will be slower!`, G(this, Gt, new gi())) : p(this, Gt).empty ? o ? p(this, gr).warn`Checkpoint mismatch: No local checkpoint but server has ${u}. Resetting.` : p(this, gr).info`Neither local nor server checkpoint` : u && p(this, Gt).equals(u) ? p(this, gr).info`Checkpoints match: ${u}` : (p(this, gr).warn`Checkpoint mismatch: I have ${p(this, Gt)}, server has ${u}. Resetting.`, G(this, Gt, new gi()));
  }
  stop() {
    this.stopTimer(), G(this, Cn, void 0), G(this, ai, !1), G(this, Zr, void 0);
  }
  get idle() {
    return !p(this, pn) && !p(this, Zr);
  }
  get localSequence() {
    return p(this, Gt).local;
  }
  get remoteSequence() {
    return p(this, Gt).remote;
  }
  set localSequence(e) {
    e !== p(this, Gt).local && (De(p(this, Cn) !== void 0, "Can't set Checkpointer.localSequence after closing"), p(this, Gt).local = e, this.saveSoon());
  }
  set remoteSequence(e) {
    p(this, Cn) && e !== p(this, Gt).remote && (p(this, Gt).remote = e, this.saveSoon());
  }
  /** If there are unsaved changes, begins saving them immediately. */
  saveASAP() {
    p(this, ai) && !p(this, Zr) && this.saveNow();
  }
  /** Mark that I have unsaved changes, and schedule a save after kSaveDelay. */
  saveSoon() {
    G(this, ai, !0), p(this, pn) === void 0 && G(this, pn, setTimeout(() => {
      G(this, pn, void 0), this.saveNow();
    }, Fb));
  }
  stopTimer() {
    p(this, pn) && (clearTimeout(p(this, pn)), G(this, pn, void 0));
  }
  async saveNow() {
    if (!p(this, Cn) || !p(this, ai))
      return;
    p(this, gr).debug`saveNow (${p(this, Gt)})`, this.stopTimer(), p(this, Zr) && await p(this, Zr), G(this, ai, !1);
    const e = JSON.stringify(p(this, Gt)), t = {
      Profile: "setCheckpoint",
      collection: this.collectionIndex,
      client: this.config.clientID
    };
    p(this, oi) && (t.rev = p(this, oi)), p(this, gr).debug`sending setCheckpoint ${e} rev ${t.rev} ...`, G(this, Zr, p(this, Cn).send(t, e, "nothrow"));
    const r = await p(this, Zr);
    if (G(this, Zr, void 0), r.error) {
      p(this, gr).error`Error saving checkpoint ${e} rev ${t.rev} to server: ${r.error.toString()}`;
      return;
    }
    G(this, oi, r.properties.rev), p(this, gr).debug`Saved checkpoint ${e} to server as rev ${p(this, oi)} ...`, await this.delegate.saveCheckpoint(
      this.collectionID,
      this.config.clientID,
      p(this, Gt)
    ), p(this, gr).info`Saved checkpoint ${e}`, this.replicator.statusChanged_();
  }
  toString() {
    return `Checkpointer[${this.collectionID}]`;
  }
  // True when state needs saving
}
gr = new WeakMap(), Cn = new WeakMap(), Gt = new WeakMap(), oi = new WeakMap(), pn = new WeakMap(), Zr = new WeakMap(), ai = new WeakMap();
var Xo, ui, ro, no;
class z0 {
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
    ee(this, Xo);
    ee(this, ui, !1);
    ee(this, ro, 0);
    ee(this, no, !1);
    this.collectionID = e.collectionID, this.collectionIndex = e.collectionIndex, this.replicator = e.replicator, this.socket = e.socket, this.checkpointer = e.checkpointer, this.logger = this.replicator.logger.getChild([r, this.collectionID]), G(this, Xo, t.continuous ?? !1);
  }
  get isCaughtUp() {
    return p(this, no);
  }
  get idle() {
    return p(this, ui);
  }
  get done() {
    return p(this, ui) && !p(this, Xo);
  }
  get progress() {
    return p(this, ro);
  }
  get socketOpen() {
    return this.socket.readyState === K0.Open;
  }
  // Subclass must call this after changing _progress or caughtUp, or when the result of
  // checkIdle may have changed.
  statusChanged() {
    const e = this.checkIdle();
    e !== p(this, ui) && this.logger.debug(e ? "Now idle" : "Now busy"), (e !== p(this, ui) || this._progress !== p(this, ro) || p(this, no) !== this.caughtUp) && (G(this, ui, e), G(this, ro, this._progress), G(this, no, this.caughtUp), e ? setTimeout(() => this.replicator.statusChanged_(), 0) : this.replicator.statusChanged_());
  }
}
Xo = new WeakMap(), ui = new WeakMap(), ro = new WeakMap(), no = new WeakMap();
var rs, li;
class qb {
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
function G0(n) {
  if (Vt(n) && typeof n.digest == "string")
    return n;
}
function Mb(n) {
  let e;
  const t = n._attachments;
  if (Vt(t))
    for (const r of Object.getOwnPropertyNames(t)) {
      const i = G0(t[r]);
      i && (e || (e = /* @__PURE__ */ new Set()), e.add(i.digest));
    }
  return e;
}
function Ub(n, e) {
  const t = n._attachments;
  if (Vt(t)) {
    for (const i of Object.getOwnPropertyNames(t)) {
      const o = G0(t[i]);
      if (o)
        if (i.startsWith("blob_/")) {
          const u = new uu(o, e);
          r(u, i.substring(6).split("/")) ? delete t[i] : console.warn(`Document _attachments/${i} doesn't reference a blob`);
        } else
          t[i] = new yg(o, e);
    }
    Object.keys(t).length === 0 && delete n._attachments;
  }
  function r(i, o) {
    let u = n, l = o.length;
    for (const c of o) {
      --l;
      let I;
      if (Vt(u)) {
        if (I = u[c], l === 0 && Xa(I))
          return u[c] = i, !0;
      } else if (ms(u)) {
        const y = Number(c);
        if (I = u[y], l === 0 && Xa(I))
          return u[y] = i, !0;
      } else
        return !1;
      u = I;
    }
    return !1;
  }
}
function $b(n, e) {
  let t, r, i;
  return mf(n, (o, u) => {
    if (u[0] !== "_attachments") {
      const l = "blob_/" + u.join("/");
      t === void 0 && (t = La(n, !1), r = Zy(t._attachments), r = r ? La(r) : {}, t._attachments = r), i = i ?? Ii(e), r[l] = {
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
const jb = 200;
var Nn, ns, is, dn, ci, Fr, ss;
class Kb extends z0 {
  constructor(t, r, i) {
    super(t, r, "pull");
    ee(this, Nn);
    // Manages the checkpoint
    ee(this, ns, []);
    // Unhandled 'changes' messages
    ee(this, is, !1);
    // True while in processChangesMessage()
    ee(this, dn, 0);
    // Number of `rev` msgs I'm waiting for
    ee(this, ci, 0);
    // Number of revs I'm waiting to insert
    ee(this, Fr, new Array());
    // Revs waiting to be added to db
    ee(this, ss, !1);
    this.config = r, this.delegate = i, G(this, Nn, new qb(this.checkpointer.remoteSequence)), G(this, dn, 0), G(this, ci, 0);
    const o = {
      Profile: "subChanges",
      collection: this.collectionIndex
    };
    this.checkpointer.remoteSequence !== void 0 && (o.since = JSON.stringify(this.checkpointer.remoteSequence)), r.continuous && (o.continuous = "true"), this.config.channels && (o.filter = "sync_gateway/bychannel", o.channels = this.config.channels.join(",")), this.config.activeOnly && (o.activeOnly = "true"), (this.config.enableAutoPurge !== !1 || this.delegate.hasOnDocumentsCallback()) && (o.revocations = "true"), this.config.wantBatchSize && (o.batch = this.config.wantBatchSize);
    let u;
    r.documentIDs && (u = { docIDs: r.documentIDs }), this.logger.debug`Sending ${JSON.stringify(o)}`, this.socket.send(o, u);
  }
  checkIdle() {
    return De(p(this, dn) >= 0 && p(this, ci) >= 0), this.caughtUp && p(this, ns).length === 0 && !p(this, is) && p(this, dn) === 0 && p(this, ci) === 0 && !p(this, ss);
  }
  //-------- HANDLING CHANGES MESSAGES:
  // Number of revs to insert into db at once
  get batchSize() {
    return this.config.saveBatchSize ?? jb;
  }
  // Handler for incoming `changes` messages:
  onChanges(t) {
    this.canProcessChangesMessage() ? this.processChangesMessage(t) : (this.logger.debug`Queuing changes message #${t.number}`, p(this, ns).push(t), this.statusChanged());
  }
  canProcessChangesMessage() {
    var t;
    return this.socketOpen && !p(this, is) && (((t = p(this, Fr)) == null ? void 0 : t.length) ?? 0) + p(this, dn) < this.batchSize + 100;
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
          let I = Number(c[3] ?? 0), y;
          return I & 2 ? y = "revoked" : I & 4 && (y = "removed"), {
            id: c[1],
            rev: c[2],
            deleted: (I & 1) !== 0,
            lostAccess: y,
            bodySize: c[4] ? Number(c[4]) : null,
            remoteSequence: c[0]
          };
        });
        if (this.delegate.wantRevs)
          try {
            await this.delegate.wantRevs(i, this.caughtUp);
          } catch (c) {
            this.logger.error`wantRevs threw ${c}`, this.replicator.fatalError(c);
          }
        let o = 0;
        const u = Array(), l = i.map((c) => c.skip ? (p(this, Nn).skipSequence(c.remoteSequence), 0) : (++o, ++Nr(this, dn)._, p(this, Nn).addSequence(c.remoteSequence), c.knownRevs || u));
        this.socketOpen && (this.logger.debug`Replying to 'changes'#${t.number} (seq ${r[0][0]}+) asking for ${o}/${l.length} revs`, this.socket.sendReplyTo(t, { maxHistory: 1 }, l)), this.checkpointer.remoteSequence = p(this, Nn).getCheckpoint();
      } finally {
        G(this, is, !1);
      }
    }
    this.statusChanged(), this.maybeProcessChangesMessage();
  }
  //-------- HANDLING REVISIONS:
  // Handler for incoming `rev` messages.
  onRev(t) {
    --Nr(this, dn)._, ++Nr(this, ci)._, p(this, Fr).push(t), this.maybeInsertRevs();
  }
  // Inserts all the `rev` messages in `insertable` by passing them to the `saveRevs` callback.
  async maybeInsertRevs() {
    if (p(this, ss)) return;
    const t = this.batchSize;
    for (; p(this, Fr).length > 0 && (p(this, Fr).length >= t || this.caughtUp && p(this, dn) === 0); ) {
      G(this, ss, !0);
      try {
        let r;
        p(this, Fr).length <= t ? (r = p(this, Fr), G(this, Fr, [])) : r = p(this, Fr).splice(0, t), this.logger.debug`Inserting ${r.length} of ${r.length + p(this, Fr).length} revs`, this.maybeProcessChangesMessage();
        const i = [];
        for (const o of r)
          if (o instanceof gs) {
            const u = this.decodeRevMsg(o);
            let l = Mb(u.body);
            l ? (u.hasBlobs = !0, this.processRevWithBlobs(u, l)) : i.push(u);
          } else
            i.push(o);
        if (i.length > 0) {
          let o = !1;
          try {
            o = await this.delegate.saveRevs(i), o || this.logger.error`Failed to save revs`;
          } catch (u) {
            this.logger.error`Failed to save revs: caught ${u}`, this.replicator.fatalError(u);
            return;
          }
          i.forEach((u) => this.finishedRev(u, o)), this.checkpointer.remoteSequence = p(this, Nn).getCheckpoint(), o && (this._progress += i.length);
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
    if (!N0(r))
      throw new ys("invalid revision body", 400);
    const i = r._id || t.property("id"), o = r._rev || t.property("rev");
    if (!mg(i) || !Qy(o))
      throw new ys("invalid id or rev property", 400);
    const u = r._deleted || t.property("deleted") !== "" ? 1 : void 0, l = t.property("history").split(/\s*,\s*/), c = JSON.parse(t.property("sequence"));
    return delete r._id, delete r._rev, delete r._deleted, { id: i, rev: o, deleted: u, body: r, history: l, remoteSequence: c, msg: t };
  }
  // Given a rev that contains blobs, first check with the delegate whether the blob digests
  // are known. If not, send a 'getAttachment' request to the server to download the blob.
  // Finally push the rev back into #insertable so it'll get inserted.
  async processRevWithBlobs(t, r) {
    let i = await this.delegate.missingBlobs(r);
    if (i && i.length > 0) {
      this.logger.info`Downloading ${i.length} blob(s) of doc ${t.id}`;
      const o = i.map(async (u) => this.socket.send({
        Profile: "getAttachment",
        collection: this.collectionIndex,
        docID: t.id,
        digest: u
      }).then(async (l) => (this.logger.info`Saving ${l.bodyData.length}-byte blob of doc "${t.id}"`, this.delegate.addBlob(u, l.bodyData)), (l) => {
        this.logger.error`Unable to download blob ${u} of doc ${t.id}: ${l.message}`;
      }));
      await Promise.all(o);
    }
    Ub(t.body, this.delegate.blobLoader), p(this, Fr).push(t), this.maybeInsertRevs();
  }
  // Called when a revision has been saved or rejected.
  finishedRev(t, r) {
    const i = t.msg;
    r ? (p(this, Nn).finishedSequence(t.remoteSequence), i.wantsReply && this.socket.sendReplyTo(i, {})) : i.wantsReply && this.socket.sendErrorReplyTo(i, "Failed to insert revision", 502), --Nr(this, ci)._ === 0 && this.statusChanged();
  }
  toString() {
    return `Puller[${this.collectionID}]`;
  }
  // True while revs are being added to db
}
Nn = new WeakMap(), ns = new WeakMap(), is = new WeakMap(), dn = new WeakMap(), ci = new WeakMap(), Fr = new WeakMap(), ss = new WeakMap();
const zb = 200;
var Qr, os, as, us;
class Qv extends z0 {
  constructor(t, r, i) {
    super(t, r, "push");
    ee(this, Qr);
    ee(this, os);
    ee(this, as, 0);
    ee(this, us, 0);
    this.config = r, this.delegate = i, G(this, os, this.checkpointer.localSequence), G(this, Qr, new Gb(p(this, os))), this.sendMoreChanges();
  }
  checkIdle() {
    return De(p(this, as) >= 0 && p(this, us) >= 0), this.caughtUp && p(this, as) === 0 && p(this, us) === 0;
  }
  async getMoreChanges() {
    const t = this.config.batchSize ?? zb, r = p(this, os);
    this.logger.debug`Getting changes since seq ${r}`;
    const i = await this.delegate.getChanges(r, t);
    return i.lastSequence && G(this, os, i.lastSequence), i;
  }
  /** This is an async task that runs until the replication completes. */
  async sendMoreChanges() {
    let t;
    for (; ; ) {
      const r = await this.getMoreChanges();
      let i = p(this, Qr).max;
      const o = r.changes.length;
      if (o === 0) {
        if (this.caughtUp ? this.config.continuous && this.logger.debug`No new changes` : (this.logger.info`Done proposing existing changes, at sequence ${i}`, this.caughtUp = !0, this.statusChanged(), t && (await Promise.all(t), t = void 0), this.checkpointer.saveNow(), this.statusChanged()), this.config.continuous)
          continue;
        return;
      }
      const u = r.changes.map((c) => {
        const I = [c.id, c.rev, c.serverRev ?? ""];
        return c.deleted && I.push(!0), p(this, Qr).addSequence(c.seq), i = c.seq, I;
      });
      this.logger.debug`Proposing ${o} revs from seq ${r.changes[0].seq} -- ${i}`, ++Nr(this, as)._, this.statusChanged();
      const l = await this.socket.send({
        Profile: "proposeChanges",
        collection: this.collectionIndex
      }, u, "nothrow");
      if (--Nr(this, as)._, this.statusChanged(), t && await Promise.all(t), !this.socketOpen)
        return;
      if (l.isError) {
        this.replicator.fatalError(l.error);
        return;
      } else {
        t = new Array();
        const c = l.bodyJSON;
        let I = 0;
        for (const y of r.changes) {
          const _ = I < c.length ? c[I] : 0;
          switch (_) {
            case 0:
              t.push(this.sendRev(y));
              break;
            case 304:
              p(this, Qr).finishedSequence(y.seq);
              break;
            case 409:
            default:
              this.logger.error`Server rejected rev ${y.id} ${y.rev} with status ${JSON.stringify(_)}`, p(this, Qr).finishedSequence(y.seq);
              break;
          }
          ++I;
        }
        this.logger.debug`Server wants ${t.length} of ${o} revs`, this.checkpointer.localSequence = p(this, Qr).checkpointedSequence, this.statusChanged();
      }
    }
  }
  /** Sends a 'rev' message with a single document revision. */
  async sendRev(t) {
    var y, _;
    ++Nr(this, us)._, this.statusChanged(), this.logger.debug`Sending 'rev' message for ${t.id} ${t.rev}`;
    const r = {
      Profile: "rev",
      collection: this.collectionIndex,
      id: t.id,
      rev: t.rev
    };
    t.deleted && (r.deleted = 1);
    const i = [], o = t.serverRev ? Ii(t.serverRev) : 0;
    for (let x = Ii(t.rev) - 1; x > o; --x)
      i.push(`${x}-faded0001234567812345678`);
    t.serverRev && i.push(t.serverRev), i.length > 0 && (r.history = i.join(","));
    const u = JSON.stringify($b(t.body, t.rev)), l = await this.socket.send(r, u, "nothrow");
    this.statusChanged();
    const c = l.error;
    let I = !0;
    c && (this.logger.error`Got error response to "rev" message ${t.id} ${t.rev} (seq ${t.seq}: ${c}`, c.blipErrorCode >= 500 && (I = !1)), I && (p(this, Qr).finishedSequence(t.seq), this.checkpointer.localSequence = p(this, Qr).checkpointedSequence, this._progress++, this.statusChanged(), (_ = (y = this.delegate).pushedRev) == null || _.call(y, t, c)), --Nr(this, us)._, this.statusChanged();
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
Qr = new WeakMap(), os = new WeakMap(), as = new WeakMap(), us = new WeakMap();
var io, Pn;
class Gb {
  /// Constructor takes the latest checkpointed sequence.
  constructor(e) {
    ee(this, io, /* @__PURE__ */ new Map());
    ee(this, Pn);
    G(this, Pn, e ?? 0);
  }
  /// Adds a new pending sequence. Sequences are assumed to be in chronological order.
  addSequence(e) {
    if (e <= p(this, Pn))
      throw new zr(`LocalSeqTracker.addSequence: sequence ${e} out of order`, 500);
    p(this, io).set(e, p(this, Pn)), G(this, Pn, e);
  }
  /// Records that a pending sequence is now complete.
  finishedSequence(e) {
    if (!p(this, io).delete(e))
      throw new zr(`LocalSeqTracker.finishedSequence: ${e} was not pending`, 500);
  }
  get max() {
    return p(this, Pn);
  }
  get checkpointedSequence() {
    const e = p(this, io).values().next();
    return e.done ? p(this, Pn) : e.value;
  }
}
io = new WeakMap(), Pn = new WeakMap();
const Hb = "CBMobile_3", H0 = ah.getChild("Sync");
function Wb(n, e) {
  return n.status === e.status && n.error === e.error && n.pushedRevisions === e.pushedRevisions && n.pulledRevisions === e.pulledRevisions;
}
var Dn, fi, ls, Bn, yr, so, cs, hi, oo, fs, ao, uo, rg;
let Yb = (rg = class {
  constructor(e) {
    ve(this, "logger");
    ve(this, "onStatusChange");
    ee(this, Dn);
    // Indexes of this array are collection indexes
    ee(this, fi);
    // Resolves `run()` Promise
    ee(this, ls);
    // Rejects `run()` Promise
    ee(this, Bn);
    // Allows auth fetch to be canceled
    ee(this, yr);
    // BLIP socket
    ee(this, so, !1);
    // True once a BLIP close is OK
    ee(this, cs, []);
    // Checkpointers, by collection index
    ee(this, hi, []);
    // All the pushers & pullers (indexes arbitrary)
    ee(this, oo, /* @__PURE__ */ new Map());
    // Pushers, keyed by collection index
    ee(this, fs, /* @__PURE__ */ new Map());
    // Pullers, keyed by collection index
    ee(this, ao);
    // The last Status I notified of
    ee(this, uo);
    this.config = e, this.logger = H0.with({ url: e.url }), G(this, Dn, Object.keys(e.collections)), De(p(this, Dn).length > 0, "must replicate at least one Collection");
    for (const t of p(this, Dn)) {
      const r = e.collections[t];
      De(r.push || r.pull, `collection '${t}' must be either pushed or pulled`);
    }
  }
  /** Starts the replicator. Completes when the replicator finishes (never if continuous.) */
  async run() {
    mr(!this.running, "Replicator is already running");
    let e = Xv(this.config.url, "_blipsync");
    mr(
      e.protocol === "wss:" || e.protocol === "ws:",
      "Replicator URL must have scheme wss: or ws:"
    );
    let t = {};
    return this.config.credentials && (typeof window < "u" ? t.oneTimeToken = await this.authenticate(this.config.credentials) : t.credentials = this.config.credentials), new Promise((r, i) => {
      G(this, fi, r), G(this, ls, i), G(this, so, !1), this.logger.info`Connecting to <${this.config.url}>...`, G(this, yr, new Pb(e, Hb, t)), p(this, yr).addEventListener("open", () => {
        this.logger.info`Connected!`, this.maybeNotifyStatus();
      }), p(this, yr).addEventListener("close", (o) => {
        o ? (this.logger.info`Connection closed with error: ${o}`, this.fatalError(o)) : p(this, so) ? (this.logger.info`Connection closed`, this.finish()) : (this.logger.info`Connection closed unexpectedly`, this.finish(new zr("BLIP connection closed unexpectedly")));
      }), this.maybeNotifyStatus(), this.start();
    });
  }
  /** Authenticates to the server. Returns an (optional) session-id token. */
  async authenticate(e) {
    let t = Xv(this.config.url, "_session");
    t.protocol === "wss:" ? t.protocol = "https:" : (t.protocol = "http:", t.hostname !== "localhost" && t.hostname !== "127.0.0.1" && this.logger.warn`Sending credentials INSECURELY over a non-TLS connection!`), t.searchParams.append("one_time", "true"), this.logger.info`Authenticating to ${t.toString()} as user ${e.username}`;
    let r;
    try {
      if (G(this, Bn, new AbortController()), this.maybeNotifyStatus(), r = await fetch(t, {
        method: "POST",
        headers: {
          Authorization: wg(e.username, e.password)
        },
        credentials: "include",
        mode: "cors",
        signal: p(this, Bn).signal
      }), r.status >= 300)
        throw this.logger.error`Authentication failed: ${r.status} ${r.statusText}`, r.status === 401 ? new zr("Authentication failed; username or password not valid.", 401) : new zr(`Authentication failed. [${r.status} ${r.statusText}]`, r.status);
    } catch (o) {
      throw o instanceof Error && o.name === "AbortError" ? (this.logger.error`Authentication request was canceled`, new zr("Authentication request was canceled", 401)) : (this.logger.error`Authentication failed; fetch threw ${o}`, new zr(`Authentication failed; this may be due to an invalid URL, a network problem, or the server's CORS settings. [${o}]`, 401));
    } finally {
      G(this, Bn, void 0);
    }
    let i;
    if (r.body) {
      const o = await r.json();
      Vt(o) && (i = o.one_time_session_id, typeof i != "string" && (i = void 0));
    }
    return i ? this.logger.info`Successfully authenticated (and got a one-time session ID)` : this.logger.info`Successfully authenticated`, i;
  }
  async start() {
    yi(p(this, yr));
    const e = p(this, Dn).map(
      (i) => this.config.collections[i].checkpoint.clientID
    ), t = await p(this, yr).send("getCollections", {
      collections: p(this, Dn),
      // eslint-disable-next-line camelcase
      checkpoint_ids: e
    });
    let r = 0;
    for (const i of t.bodyJSON) {
      const o = p(this, Dn)[r];
      if (i === null) {
        this.fatalError(new zr(`Collection '${o}' does not exist on the server`, 404));
        return;
      }
      const u = {
        replicator: this,
        socket: p(this, yr),
        collectionID: o,
        collectionIndex: r
      }, l = this.config.collections[o], c = new Lb(
        u,
        l.checkpoint,
        l.checkpoint.delegate,
        i
      );
      p(this, cs).push(c);
      const I = { ...u, checkpointer: c };
      if (l.push) {
        const y = new Qv(I, l.push, l.push.delegate);
        p(this, oo).set(r, y), p(this, hi).push(y);
      }
      if (l.pull) {
        const y = new Kb(I, l.pull, l.pull.delegate);
        p(this, fs).set(r, y), p(this, hi).push(y);
      }
      ++r;
    }
    p(this, oo).size > 0 && p(this, yr).incoming.addEventListener("getAttachment", (i) => {
      p(this, oo).get(i.numericProperty("collection")).onGetAttachment(i);
    }), p(this, fs).size > 0 && (p(this, yr).incoming.addEventListener("changes", (i) => {
      p(this, fs).get(i.numericProperty("collection")).onChanges(i);
    }), p(this, yr).incoming.addEventListener("rev", (i) => {
      p(this, fs).get(i.numericProperty("collection")).onRev(i);
    }));
  }
  /** Stops the replicator, if it's running. */
  stop() {
    var e;
    this.running && (this.logger.info`Replicator.stop called!`, (e = p(this, Bn)) == null || e.abort(), this.finish());
  }
  get status() {
    var t;
    if (p(this, Bn) !== void 0)
      return { status: "connecting" };
    let e = { status: "busy" };
    if (p(this, hi).length > 0) {
      e.status = "idle";
      for (const r of p(this, hi))
        r instanceof Qv ? e.pushedRevisions = (e.pushedRevisions ?? 0) + r.progress : e.pulledRevisions = (e.pulledRevisions ?? 0) + r.progress, r.idle || (e.status = "busy");
    }
    switch ((t = p(this, yr)) == null ? void 0 : t.readyState) {
      case WebSocket.CONNECTING:
        e.status = "connecting";
        break;
      case WebSocket.CLOSED:
      case void 0:
        e.status = "stopped", p(this, uo) && (e.error = p(this, uo));
        break;
    }
    return e;
  }
  get running() {
    return p(this, fi) !== void 0 || p(this, Bn) !== void 0;
  }
  statusChanged_() {
    if (p(this, hi).every((e) => e.done)) {
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
    (!p(this, ao) || !Wb(e, p(this, ao))) && (this.logger.info`Status: ${e}`, G(this, ao, e), this.onStatusChange && this.running && this.onStatusChange(e));
  }
  // Completes a run by cleaning up state and resolving or rejecting `run`s Promise.
  finish(e) {
    var t;
    if (e) {
      if (G(this, uo, e), this.logger.error`Stopped with error: ${e}`, e instanceof ys) {
        const r = e;
        e = new zr(e.message, e.blipErrorCode), e.cause = r;
      }
    } else
      this.logger.info`Finished`;
    for (const r of p(this, cs))
      r.stop();
    G(this, so, !0), (t = p(this, yr)) == null || t.close(), G(this, yr, void 0), this.maybeNotifyStatus(), e ? p(this, ls) && p(this, ls).call(this, e) : p(this, fi) && p(this, fi).call(this), G(this, fi, void 0), G(this, ls, void 0);
  }
  fatalError(e) {
    this.logger.error`Sync fatal error: ${e}`, this.finish(e);
  }
  // Connection error
}, Dn = new WeakMap(), fi = new WeakMap(), ls = new WeakMap(), Bn = new WeakMap(), yr = new WeakMap(), so = new WeakMap(), cs = new WeakMap(), hi = new WeakMap(), oo = new WeakMap(), fs = new WeakMap(), ao = new WeakMap(), uo = new WeakMap(), rg);
function Xv(n, e) {
  let t = new URL(n);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t.pathname += e, t;
}
var Xr, ea;
class d_ {
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
    ee(this, ea, {});
    this.config = e, this.database = e.database, this.logger = H0.with({ url: e.url });
    const t = Object.keys(this.config.collections);
    De(t.length > 0, "At least one collection must be replicated");
    for (const r of t)
      this.database.getCollection(r);
  }
  /** Current replication status & progress. */
  get status() {
    var e;
    return ((e = p(this, Xr)) == null ? void 0 : e.status) ?? p(this, ea);
  }
  /** Runs the replicator.
   *
   * This is an async operation. The returned Promise resolves when the replication completes.
   * A continuous replication usually _never_ completes, unless it encounters a fatal error or
   * you stop it, so you may not want to `await` it. */
  async run() {
    De(!p(this, Xr), "Replicator is already running");
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
      const i = this.config.collections[r], o = this.database.getCollection(r), u = await this.getCheckpointID(o), l = i.resetCheckpoint, c = l ? void 0 : await o.getCheckpoint(u);
      let I = {
        checkpoint: { clientID: u, initialCheckpoint: c, reset: l, delegate: this }
      }, y;
      if (i.push) {
        const _ = { ...i.push, documentIDs: i.documentIDs };
        y = new Vb(this, o, _), I.push = { ..._, delegate: y };
      }
      if (i.pull) {
        const _ = { ...i.pull, documentIDs: i.documentIDs }, x = await o.count("includeDeleted") === 0, k = new Jb(
          this,
          o,
          _,
          x,
          y
        );
        I.pull = { ..._, delegate: k, activeOnly: x };
      }
      t.collections[r] = I;
    }
    G(this, Xr, new Yb(t)), p(this, Xr).onStatusChange = this.onStatusChange;
    try {
      await p(this, Xr).run();
    } finally {
      G(this, ea, p(this, Xr).status), G(this, Xr, void 0);
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
    var i, o, u, l, c;
    const t = this.config.collections[e.name], r = [
      await e.getUUID(),
      // Collection ID
      this.config.url,
      // Remote database URL
      ((i = t.documentIDs) == null ? void 0 : i.toSorted()) ?? null,
      // Documents filter
      ((u = (o = t.pull) == null ? void 0 : o.channels) == null ? void 0 : u.toSorted()) ?? null,
      // Channel filter
      !!((l = t.pull) != null && l.filter),
      // Custom pull filter present (boolean)
      !!((c = t.push) != null && c.filter)
      // Custom push filter present (boolean)
    ];
    return new Pf.sha1().update(JSON.stringify(r)).digest("base64");
  }
  //-------- Checkpointer delegate implementation
  /** Saves a checkpoint to the local database. @internal */
  async saveCheckpoint(e, t, r) {
    await this.database.getCollection(e).setCheckpoint(t, r);
  }
  // Final status of the Replicator
}
Xr = new WeakMap(), ea = new WeakMap();
class W0 {
  constructor(e, t, r) {
    ve(this, "logger");
    this.replicator = e, this.collection = t, this.logger = e.logger.with({ collection: t.name, dir: r });
  }
}
var hs, ta, pi, vn, di;
class Vb extends W0 {
  constructor(t, r, i) {
    super(t, r, "push");
    ee(this, hs);
    ee(this, ta, !1);
    ee(this, pi);
    ee(this, vn);
    // docs whose serverRevIDs to update
    ee(this, di);
    this.config = i, i.documentIDs && G(this, hs, new Set(i.documentIDs));
  }
  async getChanges(t, r) {
    const i = this.collection, o = await this.getDocsSinceSequence(t, r);
    if (this.replicator.status.status === "stopped")
      return { changes: [], since: t };
    if (o.changes.length > 0 || !this.config.continuous)
      return o;
    if (p(this, ta)) {
      De(!p(this, pi)), G(this, pi, Promise.withResolvers());
      let u;
      const l = () => {
        var I;
        u.remove();
        const c = (I = p(this, pi)) == null ? void 0 : I.resolve;
        c && (this.logger.debug`Getting new changes...`, G(this, pi, void 0), c(this.getDocsSinceSequence(t, r)));
      };
      return u = i.addChangeListener(l), this.logger.info`Watching for changes...`, p(this, pi).promise;
    } else
      return G(this, ta, !0), o;
  }
  /** Returns an updated `serverRev` of a document, which hasn't been saved back to the db yet,
   *  or `undefined` if none. This reflects a recently pushed revision. */
  unsavedServerRev(t) {
    var r, i;
    return ((r = p(this, vn)) == null ? void 0 : r.get(t)) ?? ((i = p(this, di)) == null ? void 0 : i.get(t));
  }
  async getDocsSinceSequence(t, r) {
    var l;
    let i = [], o = t, u;
    do {
      const c = (y) => (!y.flags || !(y.flags & Rs)) && // no conflicts
      y.rev !== y.serverRev, I = await this.collection.getDocsSinceSequence(o, r, c);
      if (I.length === 0)
        break;
      if (u = I.length < r - i.length, o = (l = I.at(-1)) == null ? void 0 : l.seq, p(this, hs) || this.config.filter) {
        const y = this.config.filter;
        for (const _ of I)
          if (!(p(this, hs) && !p(this, hs).has(_.id))) {
            if (y) {
              const x = new mn(this.collection, _.id, _.body, _.rev, _.seq), k = _.deleted ? Bi.deleted : Bi.none;
              if (!y(x.body, k))
                continue;
            }
            i.push(_);
          }
      } else
        i.push(...I);
    } while (i.length < r && !u);
    if (i.length > 0 && (p(this, vn) || p(this, di)))
      for (const c of i) {
        const I = this.unsavedServerRev(c.id);
        Mo(I, c.serverRev) && (c.serverRev = I);
      }
    return { changes: i, since: t, lastSequence: o };
  }
  async getBlob(t) {
    return await this.collection.database.blobStore.getBlob(t);
  }
  pushedRev(t, r) {
    if (!r) {
      let i = p(this, vn);
      i || (i = /* @__PURE__ */ new Map(), G(this, vn, i)), i.set(t.id, t.rev), this.updateServerRevsNow();
    }
    this.notifyDocEnded(t, r);
  }
  updateServerRevsNow() {
    let t = p(this, vn);
    t && !p(this, di) && (this.logger.debug`Updating serverRev property of ${t.size} pushed docs`, G(this, vn, void 0), G(this, di, t), this.collection.updateServerRevs(t).catch((r) => this.logger.error`Error updating local serverRevs: ${r}`).finally(() => {
      G(this, di, void 0), p(this, vn) && this.updateServerRevsNow();
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
hs = new WeakMap(), ta = new WeakMap(), pi = new WeakMap(), vn = new WeakMap(), di = new WeakMap();
class Jb extends W0 {
  constructor(t, r, i, o, u) {
    super(t, r, "pull");
    ve(this, "blobLoader");
    this.config = i, this.startedEmpty = o, this.pusherDelegate = u, this.blobLoader = this.collection.database.blobLoader;
  }
  async wantRevs(t, r) {
    var o, u;
    if (r)
      this.startedEmpty = !1;
    else if (this.startedEmpty)
      return;
    let i = [];
    if (await this.collection.inTransaction(vf, async (l) => {
      var c;
      for (const I of t)
        if (I.lostAccess && !I.deleted)
          I.skip = !0, i.push({ docID: I.id, lostAccess: I.lostAccess });
        else if (!I.skip) {
          const y = (c = this.pusherDelegate) == null ? void 0 : c.unsavedServerRev(I.id);
          if (y === I.rev || Mo(y, I.rev))
            I.skip = !0;
          else {
            const _ = await l.getAncestorRevs(I.id, I.rev);
            _ ? I.knownRevs = _ : I.skip = !0;
          }
        }
    }), i.length > 0) {
      const l = this.config.filter;
      l && (i = i.filter((c) => {
        const I = new mn(this.collection, c.docID, {}, void 0, void 0);
        return l(I.body, Bi.accessRemoved);
      })), i.length > 0 && (this.config.enableAutoPurge !== !1 && await this.collection.purgeMultiple(i.map((c) => c.docID)), (u = (o = this.replicator).onDocuments) == null || u.call(o, this.collection, "pull", i));
    }
  }
  async saveRevs(t) {
    const r = this.collection, i = this.config.filter;
    if (i && (t = t.filter((c) => {
      const I = new mn(r, c.id, c.body, c.rev, 0);
      let y = Bi.none;
      return c.deleted && (y |= Bi.deleted), c.lostAccess && (y |= Bi.accessRemoved), i(I.body, y);
    })), t.length === 0)
      return !0;
    this.logger.debug`Saving ${t.length} documents...`;
    const o = Date.now(), { lastSequence: u, conflicts: l } = await r.putRemoteRevisions(t, this.startedEmpty);
    if (this.logger.info`Saved ${t.length} documents, ${(l == null ? void 0 : l.size) ?? 0} conflicts, as sequences thru ${u}, in ${Date.now() - o}ms`, this.replicator.onDocuments) {
      l && (t = t.filter((I) => !l.has(I.id)));
      const c = t.map((I) => ({ docID: I.id, deleted: !!I.deleted }));
      this.replicator.onDocuments(r, "pull", c);
    }
    return l && this.resolveConflicts(l), !0;
  }
  async missingBlobs(t) {
    let r;
    for (const i of t)
      await this.collection.database.blobStore.hasBlob(i) || (r || (r = []), r.push(i));
    return r;
  }
  async addBlob(t, r) {
    const i = co.computeDigest(r);
    if (t !== i)
      throw new zr(`Requested blob digest '${t}' but the data's digest is '${i}'`, 400);
    await this.collection.database.blobStore.saveBlob(r, t);
  }
  hasOnDocumentsCallback() {
    return !!this.replicator.onDocuments;
  }
  async resolveConflicts(t) {
    const r = this.collection, i = this.config.conflictResolver ?? Zb;
    for (const o of t)
      try {
        let u, l;
        do {
          u = await r.getRevision(o);
          const c = u == null ? void 0 : u.conflict;
          if (u === void 0 || c === void 0)
            break;
          let I = r.revToDoc(u) ?? null, y = null;
          if (c !== null) {
            const x = await r.decryptConflict(c);
            P0(x, r.database.blobLoader), y = new mn(
              this.collection,
              u.id,
              x,
              u.serverRev,
              0
            ).body;
          }
          const _ = await i(I, y);
          l = _ || null;
        } while (!await r.resolveConflict(o, u.rev, l));
        if (this.replicator.onDocuments) {
          const c = { docID: o, deleted: l === null };
          this.replicator.onDocuments(r, "pull", [c]);
        }
      } catch (u) {
        this.logger.error`Exception resolving conflict in in doc ${o}: ${u}`;
      }
  }
}
async function Zb(n, e) {
  return !n || !e ? null : Mo(gn(n).revisionID, gn(e).revisionID) ? n : e;
}
var lo;
class xf {
  constructor(e) {
    ee(this, lo);
    G(this, lo, e);
  }
  remove() {
    var e;
    (e = p(this, lo)) == null || e.call(this), G(this, lo, void 0);
  }
  [Symbol.dispose]() {
    this.remove();
  }
}
lo = new WeakMap();
const v_ = "1.0.0-2", g_ = 1;
export {
  g_ as APIVersion,
  tb as ArrayIndex,
  Df as Blob,
  Ps as Collection,
  rb as ConflictError,
  en as Database,
  Da as DefaultCollectionName,
  e_ as DocID,
  Bi as DocumentFlags,
  Ko as EncryptionError,
  uu as ExistingBlob,
  Za as InterruptedQueryError,
  f_ as LastWriteWins,
  xf as ListenerToken,
  C0 as LogCategory,
  h_ as MostWritesWins,
  Cv as MultipleConflictsError,
  Lr as N1QLParseError,
  co as NewBlob,
  KI as Query,
  II as RegisterUserFunction,
  d_ as Replicator,
  zr as ReplicatorError,
  zn as ValueIndex,
  v_ as Version,
  gn as meta
};
//# sourceMappingURL=couchbase-lite.es.js.map
