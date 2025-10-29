var ag = Object.defineProperty;
var Lh = (n) => {
  throw TypeError(n);
};
var og = (n, e, t) => e in n ? ag(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var pe = (n, e, t) => og(n, typeof e != "symbol" ? e + "" : e, t), Lu = (n, e, t) => e.has(n) || Lh("Cannot " + t);
var p = (n, e, t) => (Lu(n, e, "read from private field"), t ? t.call(n) : e.get(n)), ee = (n, e, t) => e.has(n) ? Lh("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), G = (n, e, t, r) => (Lu(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t), ge = (n, e, t) => (Lu(n, e, "access private method"), t);
var hr = (n, e, t, r) => ({
  set _(i) {
    G(n, e, i, t);
  },
  get _() {
    return p(n, e, r);
  }
});
function Me(n, e = "", ...t) {
  n || Ca(e, ...t);
}
function Nn(n, e) {
  n === void 0 && Ca(`${e ?? "something"} is unexpectedly undefined`);
}
function ug(n, e, t = "value") {
  n !== e && Ca(`${t} should be ${e} but is actually ${n}`);
}
function Ca(n, ...e) {
  throw console.error(n || "assertion failed", ...e), Error("Assertion failed: " + n);
}
function mr(n, e, t) {
  if (!n)
    throw console.error(`Check failed: ${e}`), new (t ?? Error)(e);
}
function qh(n, e) {
  return mr(typeof n == "number", `${e ?? "value"} must be a number`, TypeError), n;
}
function lg(n, e) {
  return mr(typeof n == "string", "value must be a string", TypeError), n;
}
var If = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function bf(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var qu = { exports: {} }, go = { exports: {} }, Mh;
function aa() {
  return Mh || (Mh = 1, typeof Object.create == "function" ? go.exports = function(e, t) {
    t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : go.exports = function(e, t) {
    if (t) {
      e.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
    }
  }), go.exports;
}
var mo = { exports: {} }, Mu = {}, _a = {}, Uh;
function cg() {
  if (Uh) return _a;
  Uh = 1, _a.byteLength = l, _a.toByteArray = _, _a.fromByteArray = E;
  for (var n = [], e = [], t = typeof Uint8Array < "u" ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, a = r.length; i < a; ++i)
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
  function _(k) {
    var D, K = u(k), C = K[0], M = K[1], J = new t(c(k, C, M)), X = 0, le = M > 0 ? C - 4 : C, ce;
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
  function E(k) {
    for (var D, K = k.length, C = K % 3, M = [], J = 16383, X = 0, le = K - C; X < le; X += J)
      M.push(w(k, X, X + J > le ? le : X + J));
    return C === 1 ? (D = k[K - 1], M.push(
      n[D >> 2] + n[D << 4 & 63] + "=="
    )) : C === 2 && (D = (k[K - 2] << 8) + k[K - 1], M.push(
      n[D >> 10] + n[D >> 4 & 63] + n[D << 2 & 63] + "="
    )), M.join("");
  }
  return _a;
}
var Io = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var $h;
function fg() {
  return $h || ($h = 1, Io.read = function(n, e, t, r, i) {
    var a, u, l = i * 8 - r - 1, c = (1 << l) - 1, _ = c >> 1, m = -7, w = t ? i - 1 : 0, E = t ? -1 : 1, k = n[e + w];
    for (w += E, a = k & (1 << -m) - 1, k >>= -m, m += l; m > 0; a = a * 256 + n[e + w], w += E, m -= 8)
      ;
    for (u = a & (1 << -m) - 1, a >>= -m, m += r; m > 0; u = u * 256 + n[e + w], w += E, m -= 8)
      ;
    if (a === 0)
      a = 1 - _;
    else {
      if (a === c)
        return u ? NaN : (k ? -1 : 1) * (1 / 0);
      u = u + Math.pow(2, r), a = a - _;
    }
    return (k ? -1 : 1) * u * Math.pow(2, a - r);
  }, Io.write = function(n, e, t, r, i, a) {
    var u, l, c, _ = a * 8 - i - 1, m = (1 << _) - 1, w = m >> 1, E = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, k = r ? 0 : a - 1, D = r ? 1 : -1, K = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (l = isNaN(e) ? 1 : 0, u = m) : (u = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -u)) < 1 && (u--, c *= 2), u + w >= 1 ? e += E / c : e += E * Math.pow(2, 1 - w), e * c >= 2 && (u++, c /= 2), u + w >= m ? (l = 0, u = m) : u + w >= 1 ? (l = (e * c - 1) * Math.pow(2, i), u = u + w) : (l = e * Math.pow(2, w - 1) * Math.pow(2, i), u = 0)); i >= 8; n[t + k] = l & 255, k += D, l /= 256, i -= 8)
      ;
    for (u = u << i | l, _ += i; _ > 0; n[t + k] = u & 255, k += D, u /= 256, _ -= 8)
      ;
    n[t + k - D] |= K * 128;
  }), Io;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var jh;
function hg() {
  return jh || (jh = 1, function(n) {
    const e = cg(), t = fg(), r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    n.Buffer = l, n.SlowBuffer = J, n.INSPECT_MAX_BYTES = 50;
    const i = 2147483647;
    n.kMaxLength = i, l.TYPED_ARRAY_SUPPORT = a(), !l.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function a() {
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
        return w(S);
      }
      return c(S, d, v);
    }
    l.poolSize = 8192;
    function c(S, d, v) {
      if (typeof S == "string")
        return E(S, d);
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
      const g = C(S);
      if (g) return g;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof S[Symbol.toPrimitive] == "function")
        return l.from(S[Symbol.toPrimitive]("string"), d, v);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof S
      );
    }
    l.from = function(S, d, v) {
      return c(S, d, v);
    }, Object.setPrototypeOf(l.prototype, Uint8Array.prototype), Object.setPrototypeOf(l, Uint8Array);
    function _(S) {
      if (typeof S != "number")
        throw new TypeError('"size" argument must be of type number');
      if (S < 0)
        throw new RangeError('The value "' + S + '" is invalid for option "size"');
    }
    function m(S, d, v) {
      return _(S), S <= 0 ? u(S) : d !== void 0 ? typeof v == "string" ? u(S).fill(d, v) : u(S).fill(d) : u(S);
    }
    l.alloc = function(S, d, v) {
      return m(S, d, v);
    };
    function w(S) {
      return _(S), u(S < 0 ? 0 : M(S) | 0);
    }
    l.allocUnsafe = function(S) {
      return w(S);
    }, l.allocUnsafeSlow = function(S) {
      return w(S);
    };
    function E(S, d) {
      if ((typeof d != "string" || d === "") && (d = "utf8"), !l.isEncoding(d))
        throw new TypeError("Unknown encoding: " + d);
      const v = X(S, d) | 0;
      let R = u(v);
      const g = R.write(S, d);
      return g !== v && (R = R.slice(0, g)), R;
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
        return typeof S.length != "number" || Et(S.length) ? u(0) : k(S);
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
      let R = d.length, g = v.length;
      for (let T = 0, L = Math.min(R, g); T < L; ++T)
        if (d[T] !== v[T]) {
          R = d[T], g = v[T];
          break;
        }
      return R < g ? -1 : g < R ? 1 : 0;
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
      const g = l.allocUnsafe(v);
      let T = 0;
      for (R = 0; R < d.length; ++R) {
        let L = d[R];
        if (Qe(L, Uint8Array))
          T + L.length > g.length ? (l.isBuffer(L) || (L = l.from(L)), L.copy(g, T)) : Uint8Array.prototype.set.call(
            g,
            L,
            T
          );
        else if (l.isBuffer(L))
          L.copy(g, T);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        T += L.length;
      }
      return g;
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
      let g = !1;
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
            if (g)
              return R ? -1 : st(S).length;
            d = ("" + d).toLowerCase(), g = !0;
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
    }, r && (l.prototype[r] = l.prototype.inspect), l.prototype.compare = function(d, v, R, g, T) {
      if (Qe(d, Uint8Array) && (d = l.from(d, d.offset, d.byteLength)), !l.isBuffer(d))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof d
        );
      if (v === void 0 && (v = 0), R === void 0 && (R = d ? d.length : 0), g === void 0 && (g = 0), T === void 0 && (T = this.length), v < 0 || R > d.length || g < 0 || T > this.length)
        throw new RangeError("out of range index");
      if (g >= T && v >= R)
        return 0;
      if (g >= T)
        return -1;
      if (v >= R)
        return 1;
      if (v >>>= 0, R >>>= 0, g >>>= 0, T >>>= 0, this === d) return 0;
      let L = T - g, ue = R - v;
      const B = Math.min(L, ue), q = this.slice(g, T), b = d.slice(v, R);
      for (let se = 0; se < B; ++se)
        if (q[se] !== b[se]) {
          L = q[se], ue = b[se];
          break;
        }
      return L < ue ? -1 : ue < L ? 1 : 0;
    };
    function fe(S, d, v, R, g) {
      if (S.length === 0) return -1;
      if (typeof v == "string" ? (R = v, v = 0) : v > 2147483647 ? v = 2147483647 : v < -2147483648 && (v = -2147483648), v = +v, Et(v) && (v = g ? 0 : S.length - 1), v < 0 && (v = S.length + v), v >= S.length) {
        if (g) return -1;
        v = S.length - 1;
      } else if (v < 0)
        if (g) v = 0;
        else return -1;
      if (typeof d == "string" && (d = l.from(d, R)), l.isBuffer(d))
        return d.length === 0 ? -1 : ae(S, d, v, R, g);
      if (typeof d == "number")
        return d = d & 255, typeof Uint8Array.prototype.indexOf == "function" ? g ? Uint8Array.prototype.indexOf.call(S, d, v) : Uint8Array.prototype.lastIndexOf.call(S, d, v) : ae(S, [d], v, R, g);
      throw new TypeError("val must be string, number or Buffer");
    }
    function ae(S, d, v, R, g) {
      let T = 1, L = S.length, ue = d.length;
      if (R !== void 0 && (R = String(R).toLowerCase(), R === "ucs2" || R === "ucs-2" || R === "utf16le" || R === "utf-16le")) {
        if (S.length < 2 || d.length < 2)
          return -1;
        T = 2, L /= 2, ue /= 2, v /= 2;
      }
      function B(b, se) {
        return T === 1 ? b[se] : b.readUInt16BE(se * T);
      }
      let q;
      if (g) {
        let b = -1;
        for (q = v; q < L; q++)
          if (B(S, q) === B(d, b === -1 ? 0 : q - b)) {
            if (b === -1 && (b = q), q - b + 1 === ue) return b * T;
          } else
            b !== -1 && (q -= q - b), b = -1;
      } else
        for (v + ue > L && (v = L - ue), q = v; q >= 0; q--) {
          let b = !0;
          for (let se = 0; se < ue; se++)
            if (B(S, q + se) !== B(d, se)) {
              b = !1;
              break;
            }
          if (b) return q;
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
      const g = S.length - v;
      R ? (R = Number(R), R > g && (R = g)) : R = g;
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
    l.prototype.write = function(d, v, R, g) {
      if (v === void 0)
        g = "utf8", R = this.length, v = 0;
      else if (R === void 0 && typeof v == "string")
        g = v, R = this.length, v = 0;
      else if (isFinite(v))
        v = v >>> 0, isFinite(R) ? (R = R >>> 0, g === void 0 && (g = "utf8")) : (g = R, R = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const T = this.length - v;
      if ((R === void 0 || R > T) && (R = T), d.length > 0 && (R < 0 || v < 0) || v > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      g || (g = "utf8");
      let L = !1;
      for (; ; )
        switch (g) {
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
            if (L) throw new TypeError("Unknown encoding: " + g);
            g = ("" + g).toLowerCase(), L = !0;
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
      let g = d;
      for (; g < v; ) {
        const T = S[g];
        let L = null, ue = T > 239 ? 4 : T > 223 ? 3 : T > 191 ? 2 : 1;
        if (g + ue <= v) {
          let B, q, b, se;
          switch (ue) {
            case 1:
              T < 128 && (L = T);
              break;
            case 2:
              B = S[g + 1], (B & 192) === 128 && (se = (T & 31) << 6 | B & 63, se > 127 && (L = se));
              break;
            case 3:
              B = S[g + 1], q = S[g + 2], (B & 192) === 128 && (q & 192) === 128 && (se = (T & 15) << 12 | (B & 63) << 6 | q & 63, se > 2047 && (se < 55296 || se > 57343) && (L = se));
              break;
            case 4:
              B = S[g + 1], q = S[g + 2], b = S[g + 3], (B & 192) === 128 && (q & 192) === 128 && (b & 192) === 128 && (se = (T & 15) << 18 | (B & 63) << 12 | (q & 63) << 6 | b & 63, se > 65535 && se < 1114112 && (L = se));
          }
        }
        L === null ? (L = 65533, ue = 1) : L > 65535 && (L -= 65536, R.push(L >>> 10 & 1023 | 55296), L = 56320 | L & 1023), R.push(L), g += ue;
      }
      return vt(R);
    }
    const at = 4096;
    function vt(S) {
      const d = S.length;
      if (d <= at)
        return String.fromCharCode.apply(String, S);
      let v = "", R = 0;
      for (; R < d; )
        v += String.fromCharCode.apply(
          String,
          S.slice(R, R += at)
        );
      return v;
    }
    function we(S, d, v) {
      let R = "";
      v = Math.min(S.length, v);
      for (let g = d; g < v; ++g)
        R += String.fromCharCode(S[g] & 127);
      return R;
    }
    function He(S, d, v) {
      let R = "";
      v = Math.min(S.length, v);
      for (let g = d; g < v; ++g)
        R += String.fromCharCode(S[g]);
      return R;
    }
    function Ke(S, d, v) {
      const R = S.length;
      (!d || d < 0) && (d = 0), (!v || v < 0 || v > R) && (v = R);
      let g = "";
      for (let T = d; T < v; ++T)
        g += Ft[S[T]];
      return g;
    }
    function It(S, d, v) {
      const R = S.slice(d, v);
      let g = "";
      for (let T = 0; T < R.length - 1; T += 2)
        g += String.fromCharCode(R[T] + R[T + 1] * 256);
      return g;
    }
    l.prototype.slice = function(d, v) {
      const R = this.length;
      d = ~~d, v = v === void 0 ? R : ~~v, d < 0 ? (d += R, d < 0 && (d = 0)) : d > R && (d = R), v < 0 ? (v += R, v < 0 && (v = 0)) : v > R && (v = R), v < d && (v = d);
      const g = this.subarray(d, v);
      return Object.setPrototypeOf(g, l.prototype), g;
    };
    function Ve(S, d, v) {
      if (S % 1 !== 0 || S < 0) throw new RangeError("offset is not uint");
      if (S + d > v) throw new RangeError("Trying to access beyond buffer length");
    }
    l.prototype.readUintLE = l.prototype.readUIntLE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let g = this[d], T = 1, L = 0;
      for (; ++L < v && (T *= 256); )
        g += this[d + L] * T;
      return g;
    }, l.prototype.readUintBE = l.prototype.readUIntBE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let g = this[d + --v], T = 1;
      for (; v > 0 && (T *= 256); )
        g += this[d + --v] * T;
      return g;
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
      (v === void 0 || R === void 0) && gt(d, this.length - 8);
      const g = v + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24, T = this[++d] + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + R * 2 ** 24;
      return BigInt(g) + (BigInt(T) << BigInt(32));
    }), l.prototype.readBigUInt64BE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], R = this[d + 7];
      (v === void 0 || R === void 0) && gt(d, this.length - 8);
      const g = v * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d], T = this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + R;
      return (BigInt(g) << BigInt(32)) + BigInt(T);
    }), l.prototype.readIntLE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let g = this[d], T = 1, L = 0;
      for (; ++L < v && (T *= 256); )
        g += this[d + L] * T;
      return T *= 128, g >= T && (g -= Math.pow(2, 8 * v)), g;
    }, l.prototype.readIntBE = function(d, v, R) {
      d = d >>> 0, v = v >>> 0, R || Ve(d, v, this.length);
      let g = v, T = 1, L = this[d + --g];
      for (; g > 0 && (T *= 256); )
        L += this[d + --g] * T;
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
      (v === void 0 || R === void 0) && gt(d, this.length - 8);
      const g = this[d + 4] + this[d + 5] * 2 ** 8 + this[d + 6] * 2 ** 16 + (R << 24);
      return (BigInt(g) << BigInt(32)) + BigInt(v + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24);
    }), l.prototype.readBigInt64BE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], R = this[d + 7];
      (v === void 0 || R === void 0) && gt(d, this.length - 8);
      const g = (v << 24) + // Overflow
      this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d];
      return (BigInt(g) << BigInt(32)) + BigInt(this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + R);
    }), l.prototype.readFloatLE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), t.read(this, d, !0, 23, 4);
    }, l.prototype.readFloatBE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 4, this.length), t.read(this, d, !1, 23, 4);
    }, l.prototype.readDoubleLE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 8, this.length), t.read(this, d, !0, 52, 8);
    }, l.prototype.readDoubleBE = function(d, v) {
      return d = d >>> 0, v || Ve(d, 8, this.length), t.read(this, d, !1, 52, 8);
    };
    function Xe(S, d, v, R, g, T) {
      if (!l.isBuffer(S)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (d > g || d < T) throw new RangeError('"value" argument is out of bounds');
      if (v + R > S.length) throw new RangeError("Index out of range");
    }
    l.prototype.writeUintLE = l.prototype.writeUIntLE = function(d, v, R, g) {
      if (d = +d, v = v >>> 0, R = R >>> 0, !g) {
        const ue = Math.pow(2, 8 * R) - 1;
        Xe(this, d, v, R, ue, 0);
      }
      let T = 1, L = 0;
      for (this[v] = d & 255; ++L < R && (T *= 256); )
        this[v + L] = d / T & 255;
      return v + R;
    }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function(d, v, R, g) {
      if (d = +d, v = v >>> 0, R = R >>> 0, !g) {
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
    function Ze(S, d, v, R, g) {
      me(d, R, g, S, v, 7);
      let T = Number(d & BigInt(4294967295));
      S[v++] = T, T = T >> 8, S[v++] = T, T = T >> 8, S[v++] = T, T = T >> 8, S[v++] = T;
      let L = Number(d >> BigInt(32) & BigInt(4294967295));
      return S[v++] = L, L = L >> 8, S[v++] = L, L = L >> 8, S[v++] = L, L = L >> 8, S[v++] = L, v;
    }
    function wt(S, d, v, R, g) {
      me(d, R, g, S, v, 7);
      let T = Number(d & BigInt(4294967295));
      S[v + 7] = T, T = T >> 8, S[v + 6] = T, T = T >> 8, S[v + 5] = T, T = T >> 8, S[v + 4] = T;
      let L = Number(d >> BigInt(32) & BigInt(4294967295));
      return S[v + 3] = L, L = L >> 8, S[v + 2] = L, L = L >> 8, S[v + 1] = L, L = L >> 8, S[v] = L, v + 8;
    }
    l.prototype.writeBigUInt64LE = _t(function(d, v = 0) {
      return Ze(this, d, v, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeBigUInt64BE = _t(function(d, v = 0) {
      return wt(this, d, v, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeIntLE = function(d, v, R, g) {
      if (d = +d, v = v >>> 0, !g) {
        const B = Math.pow(2, 8 * R - 1);
        Xe(this, d, v, R, B - 1, -B);
      }
      let T = 0, L = 1, ue = 0;
      for (this[v] = d & 255; ++T < R && (L *= 256); )
        d < 0 && ue === 0 && this[v + T - 1] !== 0 && (ue = 1), this[v + T] = (d / L >> 0) - ue & 255;
      return v + R;
    }, l.prototype.writeIntBE = function(d, v, R, g) {
      if (d = +d, v = v >>> 0, !g) {
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
    function yt(S, d, v, R, g, T) {
      if (v + R > S.length) throw new RangeError("Index out of range");
      if (v < 0) throw new RangeError("Index out of range");
    }
    function We(S, d, v, R, g) {
      return d = +d, v = v >>> 0, g || yt(S, d, v, 4), t.write(S, d, v, R, 23, 4), v + 4;
    }
    l.prototype.writeFloatLE = function(d, v, R) {
      return We(this, d, v, !0, R);
    }, l.prototype.writeFloatBE = function(d, v, R) {
      return We(this, d, v, !1, R);
    };
    function lt(S, d, v, R, g) {
      return d = +d, v = v >>> 0, g || yt(S, d, v, 8), t.write(S, d, v, R, 52, 8), v + 8;
    }
    l.prototype.writeDoubleLE = function(d, v, R) {
      return lt(this, d, v, !0, R);
    }, l.prototype.writeDoubleBE = function(d, v, R) {
      return lt(this, d, v, !1, R);
    }, l.prototype.copy = function(d, v, R, g) {
      if (!l.isBuffer(d)) throw new TypeError("argument should be a Buffer");
      if (R || (R = 0), !g && g !== 0 && (g = this.length), v >= d.length && (v = d.length), v || (v = 0), g > 0 && g < R && (g = R), g === R || d.length === 0 || this.length === 0) return 0;
      if (v < 0)
        throw new RangeError("targetStart out of bounds");
      if (R < 0 || R >= this.length) throw new RangeError("Index out of range");
      if (g < 0) throw new RangeError("sourceEnd out of bounds");
      g > this.length && (g = this.length), d.length - v < g - R && (g = d.length - v + R);
      const T = g - R;
      return this === d && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(v, R, g) : Uint8Array.prototype.set.call(
        d,
        this.subarray(R, g),
        v
      ), T;
    }, l.prototype.fill = function(d, v, R, g) {
      if (typeof d == "string") {
        if (typeof v == "string" ? (g = v, v = 0, R = this.length) : typeof R == "string" && (g = R, R = this.length), g !== void 0 && typeof g != "string")
          throw new TypeError("encoding must be a string");
        if (typeof g == "string" && !l.isEncoding(g))
          throw new TypeError("Unknown encoding: " + g);
        if (d.length === 1) {
          const L = d.charCodeAt(0);
          (g === "utf8" && L < 128 || g === "latin1") && (d = L);
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
        const L = l.isBuffer(d) ? d : l.from(d, g), ue = L.length;
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
        set code(g) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: g,
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
        let R = `The value of "${S}" is out of range.`, g = v;
        return Number.isInteger(v) && Math.abs(v) > 2 ** 32 ? g = Fe(String(v)) : typeof v == "bigint" && (g = String(v), (v > BigInt(2) ** BigInt(32) || v < -(BigInt(2) ** BigInt(32))) && (g = Fe(g)), g += "n"), R += ` It must be ${d}. Received ${g}`, R;
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
      je(d, "offset"), (S[d] === void 0 || S[d + v] === void 0) && gt(d, S.length - (v + 1));
    }
    function me(S, d, v, R, g, T) {
      if (S > v || S < d) {
        const L = typeof d == "bigint" ? "n" : "";
        let ue;
        throw d === 0 || d === BigInt(0) ? ue = `>= 0${L} and < 2${L} ** ${(T + 1) * 8}${L}` : ue = `>= -(2${L} ** ${(T + 1) * 8 - 1}${L}) and < 2 ** ${(T + 1) * 8 - 1}${L}`, new Pe.ERR_OUT_OF_RANGE("value", ue, S);
      }
      et(R, g, T);
    }
    function je(S, d) {
      if (typeof S != "number")
        throw new Pe.ERR_INVALID_ARG_TYPE(d, "number", S);
    }
    function gt(S, d, v) {
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
      let g = null;
      const T = [];
      for (let L = 0; L < R; ++L) {
        if (v = S.charCodeAt(L), v > 55295 && v < 57344) {
          if (!g) {
            if (v > 56319) {
              (d -= 3) > -1 && T.push(239, 191, 189);
              continue;
            } else if (L + 1 === R) {
              (d -= 3) > -1 && T.push(239, 191, 189);
              continue;
            }
            g = v;
            continue;
          }
          if (v < 56320) {
            (d -= 3) > -1 && T.push(239, 191, 189), g = v;
            continue;
          }
          v = (g - 55296 << 10 | v - 56320) + 65536;
        } else g && (d -= 3) > -1 && T.push(239, 191, 189);
        if (g = null, v < 128) {
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
      let v, R, g;
      const T = [];
      for (let L = 0; L < S.length && !((d -= 2) < 0); ++L)
        v = S.charCodeAt(L), R = v >> 8, g = v % 256, T.push(g), T.push(R);
      return T;
    }
    function Ot(S) {
      return e.toByteArray(ct(S));
    }
    function qe(S, d, v, R) {
      let g;
      for (g = 0; g < R && !(g + v >= d.length || g >= S.length); ++g)
        d[g + v] = S[g];
      return g;
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
        for (let g = 0; g < 16; ++g)
          d[R + g] = S[v] + S[g];
      }
      return d;
    }();
    function _t(S) {
      return typeof BigInt > "u" ? Zt : S;
    }
    function Zt() {
      throw new Error("BigInt not supported");
    }
  }(Mu)), Mu;
}
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Kh;
function gi() {
  return Kh || (Kh = 1, function(n, e) {
    var t = hg(), r = t.Buffer;
    function i(u, l) {
      for (var c in u)
        l[c] = u[c];
    }
    r.from && r.alloc && r.allocUnsafe && r.allocUnsafeSlow ? n.exports = t : (i(t, e), e.Buffer = a);
    function a(u, l, c) {
      return r(u, l, c);
    }
    a.prototype = Object.create(r.prototype), i(r, a), a.from = function(u, l, c) {
      if (typeof u == "number")
        throw new TypeError("Argument must not be a number");
      return r(u, l, c);
    }, a.alloc = function(u, l, c) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      var _ = r(u);
      return l !== void 0 ? typeof c == "string" ? _.fill(l, c) : _.fill(l) : _.fill(0), _;
    }, a.allocUnsafe = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return r(u);
    }, a.allocUnsafeSlow = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return t.SlowBuffer(u);
    };
  }(mo, mo.exports)), mo.exports;
}
var Uu, zh;
function pg() {
  if (zh) return Uu;
  zh = 1;
  var n = {}.toString;
  return Uu = Array.isArray || function(e) {
    return n.call(e) == "[object Array]";
  }, Uu;
}
var $u, Gh;
function sr() {
  return Gh || (Gh = 1, $u = TypeError), $u;
}
var ju, Hh;
function Qv() {
  return Hh || (Hh = 1, ju = Object), ju;
}
var Ku, Wh;
function dg() {
  return Wh || (Wh = 1, Ku = Error), Ku;
}
var zu, Yh;
function vg() {
  return Yh || (Yh = 1, zu = EvalError), zu;
}
var Gu, Vh;
function yg() {
  return Vh || (Vh = 1, Gu = RangeError), Gu;
}
var Hu, Jh;
function gg() {
  return Jh || (Jh = 1, Hu = ReferenceError), Hu;
}
var Wu, Zh;
function Xv() {
  return Zh || (Zh = 1, Wu = SyntaxError), Wu;
}
var Yu, Qh;
function mg() {
  return Qh || (Qh = 1, Yu = URIError), Yu;
}
var Vu, Xh;
function e0() {
  return Xh || (Xh = 1, Vu = Math.abs), Vu;
}
var Ju, ep;
function eu() {
  return ep || (ep = 1, Ju = Math.floor), Ju;
}
var Zu, tp;
function Ig() {
  return tp || (tp = 1, Zu = Math.max), Zu;
}
var Qu, rp;
function bg() {
  return rp || (rp = 1, Qu = Math.min), Qu;
}
var Xu, np;
function _g() {
  return np || (np = 1, Xu = Math.pow), Xu;
}
var el, ip;
function wg() {
  return ip || (ip = 1, el = Math.round), el;
}
var tl, sp;
function _f() {
  return sp || (sp = 1, tl = Number.isNaN || function(e) {
    return e !== e;
  }), tl;
}
var rl, ap;
function xg() {
  if (ap) return rl;
  ap = 1;
  var n = /* @__PURE__ */ _f();
  return rl = function(t) {
    return n(t) || t === 0 ? t : t < 0 ? -1 : 1;
  }, rl;
}
var nl, op;
function Eg() {
  return op || (op = 1, nl = Object.getOwnPropertyDescriptor), nl;
}
var il, up;
function oa() {
  if (up) return il;
  up = 1;
  var n = /* @__PURE__ */ Eg();
  if (n)
    try {
      n([], "length");
    } catch {
      n = null;
    }
  return il = n, il;
}
var sl, lp;
function tu() {
  if (lp) return sl;
  lp = 1;
  var n = Object.defineProperty || !1;
  if (n)
    try {
      n({}, "a", { value: 1 });
    } catch {
      n = !1;
    }
  return sl = n, sl;
}
var al, cp;
function t0() {
  return cp || (cp = 1, al = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var e = {}, t = Symbol("test"), r = Object(t);
    if (typeof t == "string" || Object.prototype.toString.call(t) !== "[object Symbol]" || Object.prototype.toString.call(r) !== "[object Symbol]")
      return !1;
    var i = 42;
    e[t] = i;
    for (var a in e)
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
  }), al;
}
var ol, fp;
function Sg() {
  if (fp) return ol;
  fp = 1;
  var n = typeof Symbol < "u" && Symbol, e = t0();
  return ol = function() {
    return typeof n != "function" || typeof Symbol != "function" || typeof n("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : e();
  }, ol;
}
var ul, hp;
function r0() {
  return hp || (hp = 1, ul = typeof Reflect < "u" && Reflect.getPrototypeOf || null), ul;
}
var ll, pp;
function n0() {
  if (pp) return ll;
  pp = 1;
  var n = /* @__PURE__ */ Qv();
  return ll = n.getPrototypeOf || null, ll;
}
var cl, dp;
function Ag() {
  if (dp) return cl;
  dp = 1;
  var n = "Function.prototype.bind called on incompatible ", e = Object.prototype.toString, t = Math.max, r = "[object Function]", i = function(c, _) {
    for (var m = [], w = 0; w < c.length; w += 1)
      m[w] = c[w];
    for (var E = 0; E < _.length; E += 1)
      m[E + c.length] = _[E];
    return m;
  }, a = function(c, _) {
    for (var m = [], w = _, E = 0; w < c.length; w += 1, E += 1)
      m[E] = c[w];
    return m;
  }, u = function(l, c) {
    for (var _ = "", m = 0; m < l.length; m += 1)
      _ += l[m], m + 1 < l.length && (_ += c);
    return _;
  };
  return cl = function(c) {
    var _ = this;
    if (typeof _ != "function" || e.apply(_) !== r)
      throw new TypeError(n + _);
    for (var m = a(arguments, 1), w, E = function() {
      if (this instanceof w) {
        var M = _.apply(
          this,
          i(m, arguments)
        );
        return Object(M) === M ? M : this;
      }
      return _.apply(
        c,
        i(m, arguments)
      );
    }, k = t(0, _.length - m.length), D = [], K = 0; K < k; K++)
      D[K] = "$" + K;
    if (w = Function("binder", "return function (" + u(D, ",") + "){ return binder.apply(this,arguments); }")(E), _.prototype) {
      var C = function() {
      };
      C.prototype = _.prototype, w.prototype = new C(), C.prototype = null;
    }
    return w;
  }, cl;
}
var fl, vp;
function Wa() {
  if (vp) return fl;
  vp = 1;
  var n = Ag();
  return fl = Function.prototype.bind || n, fl;
}
var hl, yp;
function wf() {
  return yp || (yp = 1, hl = Function.prototype.call), hl;
}
var pl, gp;
function xf() {
  return gp || (gp = 1, pl = Function.prototype.apply), pl;
}
var dl, mp;
function kg() {
  return mp || (mp = 1, dl = typeof Reflect < "u" && Reflect && Reflect.apply), dl;
}
var vl, Ip;
function i0() {
  if (Ip) return vl;
  Ip = 1;
  var n = Wa(), e = xf(), t = wf(), r = kg();
  return vl = r || n.call(t, e), vl;
}
var yl, bp;
function Ef() {
  if (bp) return yl;
  bp = 1;
  var n = Wa(), e = /* @__PURE__ */ sr(), t = wf(), r = i0();
  return yl = function(a) {
    if (a.length < 1 || typeof a[0] != "function")
      throw new e("a function is required");
    return r(n, t, a);
  }, yl;
}
var gl, _p;
function Og() {
  if (_p) return gl;
  _p = 1;
  var n = Ef(), e = /* @__PURE__ */ oa(), t;
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
  ), i = Object, a = i.getPrototypeOf;
  return gl = r && typeof r.get == "function" ? n([r.get]) : typeof a == "function" ? (
    /** @type {import('./get')} */
    function(l) {
      return a(l == null ? l : i(l));
    }
  ) : !1, gl;
}
var ml, wp;
function s0() {
  if (wp) return ml;
  wp = 1;
  var n = r0(), e = n0(), t = /* @__PURE__ */ Og();
  return ml = n ? function(i) {
    return n(i);
  } : e ? function(i) {
    if (!i || typeof i != "object" && typeof i != "function")
      throw new TypeError("getProto: not an object");
    return e(i);
  } : t ? function(i) {
    return t(i);
  } : null, ml;
}
var Il, xp;
function a0() {
  if (xp) return Il;
  xp = 1;
  var n = Function.prototype.call, e = Object.prototype.hasOwnProperty, t = Wa();
  return Il = t.call(n, e), Il;
}
var bl, Ep;
function Ya() {
  if (Ep) return bl;
  Ep = 1;
  var n, e = /* @__PURE__ */ Qv(), t = /* @__PURE__ */ dg(), r = /* @__PURE__ */ vg(), i = /* @__PURE__ */ yg(), a = /* @__PURE__ */ gg(), u = /* @__PURE__ */ Xv(), l = /* @__PURE__ */ sr(), c = /* @__PURE__ */ mg(), _ = /* @__PURE__ */ e0(), m = /* @__PURE__ */ eu(), w = /* @__PURE__ */ Ig(), E = /* @__PURE__ */ bg(), k = /* @__PURE__ */ _g(), D = /* @__PURE__ */ wg(), K = /* @__PURE__ */ xg(), C = Function, M = function(he) {
    try {
      return C('"use strict"; return (' + he + ").constructor;")();
    } catch {
    }
  }, J = /* @__PURE__ */ oa(), X = /* @__PURE__ */ tu(), le = function() {
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
  }() : le, fe = Sg()(), ae = s0(), ke = n0(), De = r0(), Ce = xf(), $e = wf(), Be = {}, Se = typeof Uint8Array > "u" || !ae ? n : ae(Uint8Array), Ue = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? n : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? n : ArrayBuffer,
    "%ArrayIteratorPrototype%": fe && ae ? ae([][Symbol.iterator]()) : n,
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
    "%IteratorPrototype%": fe && ae ? ae(ae([][Symbol.iterator]())) : n,
    "%JSON%": typeof JSON == "object" ? JSON : n,
    "%Map%": typeof Map > "u" ? n : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !fe || !ae ? n : ae((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": e,
    "%Object.getOwnPropertyDescriptor%": J,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? n : Promise,
    "%Proxy%": typeof Proxy > "u" ? n : Proxy,
    "%RangeError%": i,
    "%ReferenceError%": a,
    "%Reflect%": typeof Reflect > "u" ? n : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? n : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !fe || !ae ? n : ae((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? n : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": fe && ae ? ae(""[Symbol.iterator]()) : n,
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
    "%Math.abs%": _,
    "%Math.floor%": m,
    "%Math.max%": w,
    "%Math.min%": E,
    "%Math.pow%": k,
    "%Math.round%": D,
    "%Math.sign%": K,
    "%Reflect.getPrototypeOf%": De
  };
  if (ae)
    try {
      null.error;
    } catch (he) {
      var at = ae(ae(he));
      Ue["%Error.prototype%"] = at;
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
      je && ae && (et = ae(je.prototype));
    }
    return Ue[Fe] = et, et;
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
  }, He = Wa(), Ke = /* @__PURE__ */ a0(), It = He.call($e, Array.prototype.concat), Ve = He.call(Ce, Array.prototype.splice), Xe = He.call($e, String.prototype.replace), Ze = He.call($e, String.prototype.slice), wt = He.call($e, RegExp.prototype.exec), yt = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, We = /\\(\\)?/g, lt = function(Fe) {
    var et = Ze(Fe, 0, 1), me = Ze(Fe, -1);
    if (et === "%" && me !== "%")
      throw new u("invalid intrinsic syntax, expected closing `%`");
    if (me === "%" && et !== "%")
      throw new u("invalid intrinsic syntax, expected opening `%`");
    var je = [];
    return Xe(Fe, yt, function(gt, ht, ct, st) {
      je[je.length] = ct ? Xe(st, We, "$1") : ht || gt;
    }), je;
  }, Pe = function(Fe, et) {
    var me = Fe, je;
    if (Ke(we, me) && (je = we[me], me = "%" + je[0] + "%"), Ke(Ue, me)) {
      var gt = Ue[me];
      if (gt === Be && (gt = vt(me)), typeof gt > "u" && !et)
        throw new l("intrinsic " + Fe + " exists, but is not available. Please file an issue!");
      return {
        alias: je,
        name: me,
        value: gt
      };
    }
    throw new u("intrinsic " + Fe + " does not exist!");
  };
  return bl = function(Fe, et) {
    if (typeof Fe != "string" || Fe.length === 0)
      throw new l("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof et != "boolean")
      throw new l('"allowMissing" argument must be a boolean');
    if (wt(/^%?[^%]*%?$/, Fe) === null)
      throw new u("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var me = lt(Fe), je = me.length > 0 ? me[0] : "", gt = Pe("%" + je + "%", et), ht = gt.name, ct = gt.value, st = !1, Le = gt.alias;
    Le && (je = Le[0], Ve(me, It([0, 1], Le)));
    for (var kt = 1, Ot = !0; kt < me.length; kt += 1) {
      var qe = me[kt], Qe = Ze(qe, 0, 1), Et = Ze(qe, -1);
      if ((Qe === '"' || Qe === "'" || Qe === "`" || Et === '"' || Et === "'" || Et === "`") && Qe !== Et)
        throw new u("property names with quotes must have matching quotes");
      if ((qe === "constructor" || !Ot) && (st = !0), je += "." + qe, ht = "%" + je + "%", Ke(Ue, ht))
        ct = Ue[ht];
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
        Ot && !st && (Ue[ht] = ct);
      }
    }
    return ct;
  }, bl;
}
var _l, Sp;
function Dn() {
  if (Sp) return _l;
  Sp = 1;
  var n = /* @__PURE__ */ Ya(), e = Ef(), t = e([n("%String.prototype.indexOf%")]);
  return _l = function(i, a) {
    var u = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      n(i, !!a)
    );
    return typeof u == "function" && t(i, ".prototype.") > -1 ? e(
      /** @type {const} */
      [u]
    ) : u;
  }, _l;
}
var wl, Ap;
function Rg() {
  if (Ap) return wl;
  Ap = 1;
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
  var i = /^\s*class\b/, a = function(X) {
    try {
      var le = n.call(X);
      return i.test(le);
    } catch {
      return !1;
    }
  }, u = function(X) {
    try {
      return a(X) ? !1 : (n.call(X), !0);
    } catch {
      return !1;
    }
  }, l = Object.prototype.toString, c = "[object Object]", _ = "[object Function]", m = "[object GeneratorFunction]", w = "[object HTMLAllCollection]", E = "[object HTML document.all class]", k = "[object HTMLCollection]", D = typeof Symbol == "function" && !!Symbol.toStringTag, K = !(0 in [,]), C = function() {
    return !1;
  };
  if (typeof document == "object") {
    var M = document.all;
    l.call(M) === l.call(document.all) && (C = function(X) {
      if ((K || !X) && (typeof X > "u" || typeof X == "object"))
        try {
          var le = l.call(X);
          return (le === w || le === E || le === k || le === c) && X("") == null;
        } catch {
        }
      return !1;
    });
  }
  return wl = e ? function(X) {
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
    return !a(X) && u(X);
  } : function(X) {
    if (C(X))
      return !0;
    if (!X || typeof X != "function" && typeof X != "object")
      return !1;
    if (D)
      return u(X);
    if (a(X))
      return !1;
    var le = l.call(X);
    return le !== _ && le !== m && !/^\[object HTML/.test(le) ? !1 : u(X);
  }, wl;
}
var xl, kp;
function Sf() {
  if (kp) return xl;
  kp = 1;
  var n = Rg(), e = Object.prototype.toString, t = Object.prototype.hasOwnProperty, r = function(c, _, m) {
    for (var w = 0, E = c.length; w < E; w++)
      t.call(c, w) && (m == null ? _(c[w], w, c) : _.call(m, c[w], w, c));
  }, i = function(c, _, m) {
    for (var w = 0, E = c.length; w < E; w++)
      m == null ? _(c.charAt(w), w, c) : _.call(m, c.charAt(w), w, c);
  }, a = function(c, _, m) {
    for (var w in c)
      t.call(c, w) && (m == null ? _(c[w], w, c) : _.call(m, c[w], w, c));
  };
  function u(l) {
    return e.call(l) === "[object Array]";
  }
  return xl = function(c, _, m) {
    if (!n(_))
      throw new TypeError("iterator must be a function");
    var w;
    arguments.length >= 3 && (w = m), u(c) ? r(c, _, w) : typeof c == "string" ? i(c, _, w) : a(c, _, w);
  }, xl;
}
var El, Op;
function Tg() {
  return Op || (Op = 1, El = [
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
  ]), El;
}
var Sl, Rp;
function Cg() {
  if (Rp) return Sl;
  Rp = 1;
  var n = /* @__PURE__ */ Tg(), e = typeof globalThis > "u" ? If : globalThis;
  return Sl = function() {
    for (var r = [], i = 0; i < n.length; i++)
      typeof e[n[i]] == "function" && (r[r.length] = n[i]);
    return r;
  }, Sl;
}
var Al = { exports: {} }, kl, Tp;
function o0() {
  if (Tp) return kl;
  Tp = 1;
  var n = /* @__PURE__ */ tu(), e = /* @__PURE__ */ Xv(), t = /* @__PURE__ */ sr(), r = /* @__PURE__ */ oa();
  return kl = function(a, u, l) {
    if (!a || typeof a != "object" && typeof a != "function")
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
    var c = arguments.length > 3 ? arguments[3] : null, _ = arguments.length > 4 ? arguments[4] : null, m = arguments.length > 5 ? arguments[5] : null, w = arguments.length > 6 ? arguments[6] : !1, E = !!r && r(a, u);
    if (n)
      n(a, u, {
        configurable: m === null && E ? E.configurable : !m,
        enumerable: c === null && E ? E.enumerable : !c,
        value: l,
        writable: _ === null && E ? E.writable : !_
      });
    else if (w || !c && !_ && !m)
      a[u] = l;
    else
      throw new e("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, kl;
}
var Ol, Cp;
function u0() {
  if (Cp) return Ol;
  Cp = 1;
  var n = /* @__PURE__ */ tu(), e = function() {
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
  }, Ol = e, Ol;
}
var Rl, Np;
function Ng() {
  if (Np) return Rl;
  Np = 1;
  var n = /* @__PURE__ */ Ya(), e = /* @__PURE__ */ o0(), t = /* @__PURE__ */ u0()(), r = /* @__PURE__ */ oa(), i = /* @__PURE__ */ sr(), a = n("%Math.floor%");
  return Rl = function(l, c) {
    if (typeof l != "function")
      throw new i("`fn` is not a function");
    if (typeof c != "number" || c < 0 || c > 4294967295 || a(c) !== c)
      throw new i("`length` must be a positive 32-bit integer");
    var _ = arguments.length > 2 && !!arguments[2], m = !0, w = !0;
    if ("length" in l && r) {
      var E = r(l, "length");
      E && !E.configurable && (m = !1), E && !E.writable && (w = !1);
    }
    return (m || w || !_) && (t ? e(
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
  }, Rl;
}
var Tl, Pp;
function Pg() {
  if (Pp) return Tl;
  Pp = 1;
  var n = Wa(), e = xf(), t = i0();
  return Tl = function() {
    return t(n, e, arguments);
  }, Tl;
}
var Dp;
function Af() {
  return Dp || (Dp = 1, function(n) {
    var e = /* @__PURE__ */ Ng(), t = /* @__PURE__ */ tu(), r = Ef(), i = Pg();
    n.exports = function(u) {
      var l = r(arguments), c = u.length - (arguments.length - 1);
      return e(
        l,
        1 + (c > 0 ? c : 0),
        !0
      );
    }, t ? t(n.exports, "apply", { value: i }) : n.exports.apply = i;
  }(Al)), Al.exports;
}
var Cl, Bp;
function l0() {
  if (Bp) return Cl;
  Bp = 1;
  var n = t0();
  return Cl = function() {
    return n() && !!Symbol.toStringTag;
  }, Cl;
}
var Nl, Fp;
function Dg() {
  if (Fp) return Nl;
  Fp = 1;
  var n = Sf(), e = /* @__PURE__ */ Cg(), t = Af(), r = /* @__PURE__ */ Dn(), i = /* @__PURE__ */ oa(), a = s0(), u = r("Object.prototype.toString"), l = l0()(), c = typeof globalThis > "u" ? If : globalThis, _ = e(), m = r("String.prototype.slice"), w = r("Array.prototype.indexOf", !0) || function(C, M) {
    for (var J = 0; J < C.length; J += 1)
      if (C[J] === M)
        return J;
    return -1;
  }, E = { __proto__: null };
  l && i && a ? n(_, function(K) {
    var C = new c[K]();
    if (Symbol.toStringTag in C && a) {
      var M = a(C), J = i(M, Symbol.toStringTag);
      if (!J && M) {
        var X = a(M);
        J = i(X, Symbol.toStringTag);
      }
      E["$" + K] = t(J.get);
    }
  }) : n(_, function(K) {
    var C = new c[K](), M = C.slice || C.set;
    M && (E[
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
      E,
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
      E,
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
  return Nl = function(C) {
    if (!C || typeof C != "object")
      return !1;
    if (!l) {
      var M = m(u(C), 8, -1);
      return w(_, M) > -1 ? M : M !== "Object" ? !1 : D(C);
    }
    return i ? k(C) : null;
  }, Nl;
}
var Pl, Lp;
function Bg() {
  if (Lp) return Pl;
  Lp = 1;
  var n = /* @__PURE__ */ Dg();
  return Pl = function(t) {
    return !!n(t);
  }, Pl;
}
var Dl, qp;
function Fg() {
  if (qp) return Dl;
  qp = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Dn(), t = e("TypedArray.prototype.buffer", !0), r = /* @__PURE__ */ Bg();
  return Dl = t || function(a) {
    if (!r(a))
      throw new n("Not a Typed Array");
    return a.buffer;
  }, Dl;
}
var Bl, Mp;
function Lg() {
  if (Mp) return Bl;
  Mp = 1;
  var n = gi().Buffer, e = pg(), t = /* @__PURE__ */ Fg(), r = ArrayBuffer.isView || function(c) {
    try {
      return t(c), !0;
    } catch {
      return !1;
    }
  }, i = typeof Uint8Array < "u", a = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", u = a && (n.prototype instanceof Uint8Array || n.TYPED_ARRAY_SUPPORT);
  return Bl = function(c, _) {
    if (c instanceof n)
      return c;
    if (typeof c == "string")
      return n.from(c, _);
    if (a && r(c)) {
      if (c.byteLength === 0)
        return n.alloc(0);
      if (u) {
        var m = n.from(c.buffer, c.byteOffset, c.byteLength);
        if (m.byteLength === c.byteLength)
          return m;
      }
      var w = c instanceof Uint8Array ? c : new Uint8Array(c.buffer, c.byteOffset, c.byteLength), E = n.from(w);
      if (E.length === c.byteLength)
        return E;
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
  }, Bl;
}
var Fl, Up;
function ua() {
  if (Up) return Fl;
  Up = 1;
  var n = gi().Buffer, e = /* @__PURE__ */ Lg();
  function t(r, i) {
    this._block = n.alloc(r), this._finalSize = i, this._blockSize = r, this._len = 0;
  }
  return t.prototype.update = function(r, i) {
    r = e(r, i || "utf8");
    for (var a = this._block, u = this._blockSize, l = r.length, c = this._len, _ = 0; _ < l; ) {
      for (var m = c % u, w = Math.min(l - _, u - m), E = 0; E < w; E++)
        a[m + E] = r[_ + E];
      c += w, _ += w, c % u === 0 && this._update(a);
    }
    return this._len += l, this;
  }, t.prototype.digest = function(r) {
    var i = this._len % this._blockSize;
    this._block[i] = 128, this._block.fill(0, i + 1), i >= this._finalSize && (this._update(this._block), this._block.fill(0));
    var a = this._len * 8;
    if (a <= 4294967295)
      this._block.writeUInt32BE(a, this._blockSize - 4);
    else {
      var u = (a & 4294967295) >>> 0, l = (a - u) / 4294967296;
      this._block.writeUInt32BE(l, this._blockSize - 8), this._block.writeUInt32BE(u, this._blockSize - 4);
    }
    this._update(this._block);
    var c = this._hash();
    return r ? c.toString(r) : c;
  }, t.prototype._update = function() {
    throw new Error("_update must be implemented by subclass");
  }, Fl = t, Fl;
}
var Ll, $p;
function qg() {
  if ($p) return Ll;
  $p = 1;
  var n = aa(), e = ua(), t = gi().Buffer, r = [
    1518500249,
    1859775393,
    -1894007588,
    -899497514
  ], i = new Array(80);
  function a() {
    this.init(), this._w = i, e.call(this, 64, 56);
  }
  n(a, e), a.prototype.init = function() {
    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
  };
  function u(_) {
    return _ << 5 | _ >>> 27;
  }
  function l(_) {
    return _ << 30 | _ >>> 2;
  }
  function c(_, m, w, E) {
    return _ === 0 ? m & w | ~m & E : _ === 2 ? m & w | m & E | w & E : m ^ w ^ E;
  }
  return a.prototype._update = function(_) {
    for (var m = this._w, w = this._a | 0, E = this._b | 0, k = this._c | 0, D = this._d | 0, K = this._e | 0, C = 0; C < 16; ++C)
      m[C] = _.readInt32BE(C * 4);
    for (; C < 80; ++C)
      m[C] = m[C - 3] ^ m[C - 8] ^ m[C - 14] ^ m[C - 16];
    for (var M = 0; M < 80; ++M) {
      var J = ~~(M / 20), X = u(w) + c(J, E, k, D) + K + m[M] + r[J] | 0;
      K = D, D = k, k = l(E), E = w, w = X;
    }
    this._a = w + this._a | 0, this._b = E + this._b | 0, this._c = k + this._c | 0, this._d = D + this._d | 0, this._e = K + this._e | 0;
  }, a.prototype._hash = function() {
    var _ = t.allocUnsafe(20);
    return _.writeInt32BE(this._a | 0, 0), _.writeInt32BE(this._b | 0, 4), _.writeInt32BE(this._c | 0, 8), _.writeInt32BE(this._d | 0, 12), _.writeInt32BE(this._e | 0, 16), _;
  }, Ll = a, Ll;
}
var ql, jp;
function Mg() {
  if (jp) return ql;
  jp = 1;
  var n = aa(), e = ua(), t = gi().Buffer, r = [
    1518500249,
    1859775393,
    -1894007588,
    -899497514
  ], i = new Array(80);
  function a() {
    this.init(), this._w = i, e.call(this, 64, 56);
  }
  n(a, e), a.prototype.init = function() {
    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
  };
  function u(m) {
    return m << 1 | m >>> 31;
  }
  function l(m) {
    return m << 5 | m >>> 27;
  }
  function c(m) {
    return m << 30 | m >>> 2;
  }
  function _(m, w, E, k) {
    return m === 0 ? w & E | ~w & k : m === 2 ? w & E | w & k | E & k : w ^ E ^ k;
  }
  return a.prototype._update = function(m) {
    for (var w = this._w, E = this._a | 0, k = this._b | 0, D = this._c | 0, K = this._d | 0, C = this._e | 0, M = 0; M < 16; ++M)
      w[M] = m.readInt32BE(M * 4);
    for (; M < 80; ++M)
      w[M] = u(w[M - 3] ^ w[M - 8] ^ w[M - 14] ^ w[M - 16]);
    for (var J = 0; J < 80; ++J) {
      var X = ~~(J / 20), le = l(E) + _(X, k, D, K) + C + w[J] + r[X] | 0;
      C = K, K = D, D = c(k), k = E, E = le;
    }
    this._a = E + this._a | 0, this._b = k + this._b | 0, this._c = D + this._c | 0, this._d = K + this._d | 0, this._e = C + this._e | 0;
  }, a.prototype._hash = function() {
    var m = t.allocUnsafe(20);
    return m.writeInt32BE(this._a | 0, 0), m.writeInt32BE(this._b | 0, 4), m.writeInt32BE(this._c | 0, 8), m.writeInt32BE(this._d | 0, 12), m.writeInt32BE(this._e | 0, 16), m;
  }, ql = a, ql;
}
var Ml, Kp;
function c0() {
  if (Kp) return Ml;
  Kp = 1;
  var n = aa(), e = ua(), t = gi().Buffer, r = [
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
  function a() {
    this.init(), this._w = i, e.call(this, 64, 56);
  }
  n(a, e), a.prototype.init = function() {
    return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
  };
  function u(E, k, D) {
    return D ^ E & (k ^ D);
  }
  function l(E, k, D) {
    return E & k | D & (E | k);
  }
  function c(E) {
    return (E >>> 2 | E << 30) ^ (E >>> 13 | E << 19) ^ (E >>> 22 | E << 10);
  }
  function _(E) {
    return (E >>> 6 | E << 26) ^ (E >>> 11 | E << 21) ^ (E >>> 25 | E << 7);
  }
  function m(E) {
    return (E >>> 7 | E << 25) ^ (E >>> 18 | E << 14) ^ E >>> 3;
  }
  function w(E) {
    return (E >>> 17 | E << 15) ^ (E >>> 19 | E << 13) ^ E >>> 10;
  }
  return a.prototype._update = function(E) {
    for (var k = this._w, D = this._a | 0, K = this._b | 0, C = this._c | 0, M = this._d | 0, J = this._e | 0, X = this._f | 0, le = this._g | 0, ce = this._h | 0, fe = 0; fe < 16; ++fe)
      k[fe] = E.readInt32BE(fe * 4);
    for (; fe < 64; ++fe)
      k[fe] = w(k[fe - 2]) + k[fe - 7] + m(k[fe - 15]) + k[fe - 16] | 0;
    for (var ae = 0; ae < 64; ++ae) {
      var ke = ce + _(J) + u(J, X, le) + r[ae] + k[ae] | 0, De = c(D) + l(D, K, C) | 0;
      ce = le, le = X, X = J, J = M + ke | 0, M = C, C = K, K = D, D = ke + De | 0;
    }
    this._a = D + this._a | 0, this._b = K + this._b | 0, this._c = C + this._c | 0, this._d = M + this._d | 0, this._e = J + this._e | 0, this._f = X + this._f | 0, this._g = le + this._g | 0, this._h = ce + this._h | 0;
  }, a.prototype._hash = function() {
    var E = t.allocUnsafe(32);
    return E.writeInt32BE(this._a, 0), E.writeInt32BE(this._b, 4), E.writeInt32BE(this._c, 8), E.writeInt32BE(this._d, 12), E.writeInt32BE(this._e, 16), E.writeInt32BE(this._f, 20), E.writeInt32BE(this._g, 24), E.writeInt32BE(this._h, 28), E;
  }, Ml = a, Ml;
}
var Ul, zp;
function Ug() {
  if (zp) return Ul;
  zp = 1;
  var n = aa(), e = c0(), t = ua(), r = gi().Buffer, i = new Array(64);
  function a() {
    this.init(), this._w = i, t.call(this, 64, 56);
  }
  return n(a, e), a.prototype.init = function() {
    return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
  }, a.prototype._hash = function() {
    var u = r.allocUnsafe(28);
    return u.writeInt32BE(this._a, 0), u.writeInt32BE(this._b, 4), u.writeInt32BE(this._c, 8), u.writeInt32BE(this._d, 12), u.writeInt32BE(this._e, 16), u.writeInt32BE(this._f, 20), u.writeInt32BE(this._g, 24), u;
  }, Ul = a, Ul;
}
var $l, Gp;
function f0() {
  if (Gp) return $l;
  Gp = 1;
  var n = aa(), e = ua(), t = gi().Buffer, r = [
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
  function a() {
    this.init(), this._w = i, e.call(this, 128, 112);
  }
  n(a, e), a.prototype.init = function() {
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
  function _(K, C) {
    return (K >>> 14 | C << 18) ^ (K >>> 18 | C << 14) ^ (C >>> 9 | K << 23);
  }
  function m(K, C) {
    return (K >>> 1 | C << 31) ^ (K >>> 8 | C << 24) ^ K >>> 7;
  }
  function w(K, C) {
    return (K >>> 1 | C << 31) ^ (K >>> 8 | C << 24) ^ (K >>> 7 | C << 25);
  }
  function E(K, C) {
    return (K >>> 19 | C << 13) ^ (C >>> 29 | K << 3) ^ K >>> 6;
  }
  function k(K, C) {
    return (K >>> 19 | C << 13) ^ (C >>> 29 | K << 3) ^ (K >>> 6 | C << 26);
  }
  function D(K, C) {
    return K >>> 0 < C >>> 0 ? 1 : 0;
  }
  return a.prototype._update = function(K) {
    for (var C = this._w, M = this._ah | 0, J = this._bh | 0, X = this._ch | 0, le = this._dh | 0, ce = this._eh | 0, fe = this._fh | 0, ae = this._gh | 0, ke = this._hh | 0, De = this._al | 0, Ce = this._bl | 0, $e = this._cl | 0, Be = this._dl | 0, Se = this._el | 0, Ue = this._fl | 0, at = this._gl | 0, vt = this._hl | 0, we = 0; we < 32; we += 2)
      C[we] = K.readInt32BE(we * 4), C[we + 1] = K.readInt32BE(we * 4 + 4);
    for (; we < 160; we += 2) {
      var He = C[we - 30], Ke = C[we - 15 * 2 + 1], It = m(He, Ke), Ve = w(Ke, He);
      He = C[we - 2 * 2], Ke = C[we - 2 * 2 + 1];
      var Xe = E(He, Ke), Ze = k(Ke, He), wt = C[we - 7 * 2], yt = C[we - 7 * 2 + 1], We = C[we - 16 * 2], lt = C[we - 16 * 2 + 1], Pe = Ve + yt | 0, he = It + wt + D(Pe, Ve) | 0;
      Pe = Pe + Ze | 0, he = he + Xe + D(Pe, Ze) | 0, Pe = Pe + lt | 0, he = he + We + D(Pe, lt) | 0, C[we] = he, C[we + 1] = Pe;
    }
    for (var Fe = 0; Fe < 160; Fe += 2) {
      he = C[Fe], Pe = C[Fe + 1];
      var et = l(M, J, X), me = l(De, Ce, $e), je = c(M, De), gt = c(De, M), ht = _(ce, Se), ct = _(Se, ce), st = r[Fe], Le = r[Fe + 1], kt = u(ce, fe, ae), Ot = u(Se, Ue, at), qe = vt + ct | 0, Qe = ke + ht + D(qe, vt) | 0;
      qe = qe + Ot | 0, Qe = Qe + kt + D(qe, Ot) | 0, qe = qe + Le | 0, Qe = Qe + st + D(qe, Le) | 0, qe = qe + Pe | 0, Qe = Qe + he + D(qe, Pe) | 0;
      var Et = gt + me | 0, Ft = je + et + D(Et, gt) | 0;
      ke = ae, vt = at, ae = fe, at = Ue, fe = ce, Ue = Se, Se = Be + qe | 0, ce = le + Qe + D(Se, Be) | 0, le = X, Be = $e, X = J, $e = Ce, J = M, Ce = De, De = qe + Et | 0, M = Qe + Ft + D(De, qe) | 0;
    }
    this._al = this._al + De | 0, this._bl = this._bl + Ce | 0, this._cl = this._cl + $e | 0, this._dl = this._dl + Be | 0, this._el = this._el + Se | 0, this._fl = this._fl + Ue | 0, this._gl = this._gl + at | 0, this._hl = this._hl + vt | 0, this._ah = this._ah + M + D(this._al, De) | 0, this._bh = this._bh + J + D(this._bl, Ce) | 0, this._ch = this._ch + X + D(this._cl, $e) | 0, this._dh = this._dh + le + D(this._dl, Be) | 0, this._eh = this._eh + ce + D(this._el, Se) | 0, this._fh = this._fh + fe + D(this._fl, Ue) | 0, this._gh = this._gh + ae + D(this._gl, at) | 0, this._hh = this._hh + ke + D(this._hl, vt) | 0;
  }, a.prototype._hash = function() {
    var K = t.allocUnsafe(64);
    function C(M, J, X) {
      K.writeInt32BE(M, X), K.writeInt32BE(J, X + 4);
    }
    return C(this._ah, this._al, 0), C(this._bh, this._bl, 8), C(this._ch, this._cl, 16), C(this._dh, this._dl, 24), C(this._eh, this._el, 32), C(this._fh, this._fl, 40), C(this._gh, this._gl, 48), C(this._hh, this._hl, 56), K;
  }, $l = a, $l;
}
var jl, Hp;
function $g() {
  if (Hp) return jl;
  Hp = 1;
  var n = aa(), e = f0(), t = ua(), r = gi().Buffer, i = new Array(160);
  function a() {
    this.init(), this._w = i, t.call(this, 128, 112);
  }
  return n(a, e), a.prototype.init = function() {
    return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
  }, a.prototype._hash = function() {
    var u = r.allocUnsafe(48);
    function l(c, _, m) {
      u.writeInt32BE(c, m), u.writeInt32BE(_, m + 4);
    }
    return l(this._ah, this._al, 0), l(this._bh, this._bl, 8), l(this._ch, this._cl, 16), l(this._dh, this._dl, 24), l(this._eh, this._el, 32), l(this._fh, this._fl, 40), u;
  }, jl = a, jl;
}
var Wp;
function jg() {
  return Wp || (Wp = 1, function(n) {
    n.exports = function(t) {
      var r = t.toLowerCase(), i = n.exports[r];
      if (!i)
        throw new Error(r + " is not supported (we accept pull requests)");
      return new i();
    }, n.exports.sha = qg(), n.exports.sha1 = Mg(), n.exports.sha224 = Ug(), n.exports.sha256 = c0(), n.exports.sha384 = $g(), n.exports.sha512 = f0();
  }(qu)), qu.exports;
}
var h0 = jg();
class kf {
  constructor(e, t, r, i) {
    /** @internal */
    pe(this, "@type", "blob");
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
var Os;
class ru extends kf {
  /** @internal */
  constructor(t, r) {
    Me(typeof t.digest == "string");
    super(t.digest, t.length, t.content_type, t.revpos);
    ee(this, Os);
    G(this, Os, r);
  }
  async getContents() {
    return p(this, Os) ? p(this, Os).call(this, this.digest, this.content_type) : Promise.reject(Error("No BlobLoader"));
  }
}
Os = new WeakMap();
class Kg extends ru {
  constructor(e, t) {
    super(e, t);
  }
  toJSON(e) {
    return this.asAttachmentDict(0);
  }
}
var Rs;
const nh = class nh extends kf {
  /** Constructs a NewBlob.
   *  @param contents  The raw data. Will be moved into the database when the document is saved.
   *                   The constructor makes a copy of this, so any modifications afterwards
   *                   will be ignored.
   *  @param content_type  MIME type of the contents; this is optional. */
  constructor(t, r) {
    super(nh.computeDigest(t), t.length, r);
    ee(this, Rs);
    G(this, Rs, new Uint8Array(t));
  }
  async getContents() {
    return Promise.resolve(p(this, Rs));
  }
  /** For convenience, a non-async accessor for the contents. */
  get contents() {
    return p(this, Rs);
  }
  /** @internal */
  static computeDigest(t) {
    return "sha1-" + new h0.sha1().update(t).digest("base64");
  }
};
Rs = new WeakMap();
let na = nh;
function Yb(n) {
  return n;
}
function hs(n) {
  return Array.isArray(n);
}
function kr(n) {
  return typeof n == "object" && n !== null && !hs(n) && !p0(n);
}
function p0(n) {
  return n instanceof kf;
}
function zg(n) {
  return kr(n) ? n : void 0;
}
function d0(n) {
  return typeof n == "string" && n.length > 0 && n.length < 256 && n[0] !== "_";
}
function Gg(n) {
  return typeof n == "string" && n.length > 0 && n.length < 256;
}
function v0(n) {
  if (!d0(n))
    throw Error(`"${n}" is not a valid document ID`);
}
function y0(n, e = !0) {
  return hs(n) ? Hg(n, e) : kr(n) ? Oo(n, e) : n;
}
function Hg(n, e = !0) {
  if (!e)
    return n.slice();
  const t = new Array(n.length);
  let r = 0;
  for (const i of n)
    t[r++] = y0(i, !0);
  return t;
}
function Oo(n, e = !0) {
  const t = {};
  for (const r of Object.getOwnPropertyNames(n)) {
    const i = n[r];
    t[r] = e ? y0(i, !0) : i;
  }
  return t;
}
function ia(n, e) {
  const t = typeof n;
  if (t !== typeof e)
    return !1;
  if (t !== "object" || n === null)
    return n === e;
  if (Array.isArray(n)) {
    const r = n.length;
    return !Array.isArray(e) || r !== e.length ? !1 : n.every((i, a) => ia(i, e[a]));
  } else {
    const r = n, i = e, a = Object.keys(r);
    return a.length !== Object.keys(i).length ? !1 : a.every((u) => ia(r[u], i[u]));
  }
}
const Yc = "cbl_checkpoints", ka = "cbl_collections", Kl = "cbl_blobs", Na = "id", Oa = "seq", _o = "expires", Ti = 1, wa = 64, gr = 128;
function xa(n) {
  return n.flags !== void 0 && (n.flags & gr) !== 0;
}
function Ro(n) {
  const e = n.indexOf("-");
  if (e >= 1) {
    const t = Number(n.substring(0, e));
    if (t > 0 && Number.isSafeInteger(t))
      return t;
  }
  throw Error(`Invalid revision id '${n}'`);
}
function To(n, e, t) {
  let r = new h0.sha1();
  n ? r.update(new Uint8Array([Math.min(n.length, 255)])).update(n) : r.update(new Uint8Array([0])), r.update(new Uint8Array([t ? 1 : 0])), t || r.update(JSON.stringify(Of(e)));
  const i = r.digest("hex");
  return `${n ? Ro(n) + 1 : 1}-${i}`;
}
function Wg(n) {
  let e = {};
  for (const t of Object.keys(n).sort())
    e[t] = Of(n[t]);
  return e;
}
function Of(n) {
  return Array.isArray(n) ? n.map((e) => Of(e)) : kr(n) ? Wg(n) : n;
}
const Co = "_id", No = "_sequence", Po = "_expires";
class os {
  constructor(e, t, r, i) {
    this.name = e, this.keypath = t, this.indexed = r, this.encrypted = i, Me(!(r && i)), (e.length === 0 || t.length === 0) && this.bad();
  }
  /** Creates a DocProperty from a public property name or path. */
  static create(e, t = !1, r = !1) {
    switch (e) {
      case Co:
        return new zl(Co, Na);
      case No:
        return new zl(No, Oa);
      case Po:
        return new zl(Po, _o);
      default:
        return e.indexOf(".") < 0 ? new g0(e, t, r) : new Yg(e, t, r);
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
class zl extends os {
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
class g0 extends os {
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
class Yg extends g0 {
  constructor(t, r, i) {
    super(t, r, i);
    pe(this, "path");
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
      if (!kr(r))
        return;
      r = r[i];
    }
    return r;
  }
}
function Va(n) {
  return typeof n != "object" || n === null;
}
function Vg(n) {
  const e = Array.from(n, (t) => String.fromCodePoint(t)).join("");
  return btoa(e);
}
function Jg(n) {
  try {
    return Uint8Array.from(atob(n), (e) => e.codePointAt(0));
  } catch {
    return;
  }
}
function m0(n, e) {
  return "Basic " + btoa(n + ":" + e);
}
const I0 = 6048e5, Zg = 864e5, b0 = 6e4, _0 = 36e5, Yp = Symbol.for("constructDateFrom");
function vn(n, e) {
  return typeof n == "function" ? n(e) : n && typeof n == "object" && Yp in n ? n[Yp](e) : n instanceof Date ? new n.constructor(e) : new Date(e);
}
function zr(n, e) {
  return vn(e || n, n);
}
function w0(n, e, t) {
  const r = zr(n, t == null ? void 0 : t.in);
  return isNaN(e) ? vn((t == null ? void 0 : t.in) || n, NaN) : (e && r.setDate(r.getDate() + e), r);
}
function Rf(n, e, t) {
  const r = zr(n, t == null ? void 0 : t.in);
  if (isNaN(e)) return vn((t == null ? void 0 : t.in) || n, NaN);
  if (!e)
    return r;
  const i = r.getDate(), a = vn((t == null ? void 0 : t.in) || n, r.getTime());
  a.setMonth(r.getMonth() + e + 1, 0);
  const u = a.getDate();
  return i >= u ? a : (r.setFullYear(
    a.getFullYear(),
    a.getMonth(),
    i
  ), r);
}
function Tf(n, e, t) {
  return vn((t == null ? void 0 : t.in) || n, +zr(n) + e);
}
function Qg(n, e, t) {
  return Tf(n, e * _0, t);
}
let Xg = {};
function em() {
  return Xg;
}
function Vc(n, e) {
  var l, c, _, m;
  const t = em(), r = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (l = e == null ? void 0 : e.locale) == null ? void 0 : l.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((m = (_ = t.locale) == null ? void 0 : _.options) == null ? void 0 : m.weekStartsOn) ?? 0, i = zr(n, e == null ? void 0 : e.in), a = i.getDay(), u = (a < r ? 7 : 0) + a - r;
  return i.setDate(i.getDate() - u), i.setHours(0, 0, 0, 0), i;
}
function Pa(n, e) {
  return Vc(n, { ...e, weekStartsOn: 1 });
}
function Do(n, e) {
  const t = zr(n, e == null ? void 0 : e.in), r = t.getFullYear(), i = vn(t, 0);
  i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const a = Pa(i), u = vn(t, 0);
  u.setFullYear(r, 0, 4), u.setHours(0, 0, 0, 0);
  const l = Pa(u);
  return t.getTime() >= a.getTime() ? r + 1 : t.getTime() >= l.getTime() ? r : r - 1;
}
function sa(n) {
  const e = zr(n), t = new Date(
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
function mi(n, ...e) {
  const t = vn.bind(
    null,
    n || e.find((r) => typeof r == "object")
  );
  return e.map(t);
}
function Vp(n, e) {
  const t = zr(n, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function wo(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = Vp(r), u = Vp(i), l = +a - sa(a), c = +u - sa(u);
  return Math.round((l - c) / Zg);
}
function Jp(n, e) {
  const t = Do(n, e), r = vn((e == null ? void 0 : e.in) || n, 0);
  return r.setFullYear(t, 0, 4), r.setHours(0, 0, 0, 0), Pa(r);
}
function tm(n, e, t) {
  let r = zr(n, t == null ? void 0 : t.in);
  const i = wo(
    r,
    Jp(r, t)
  ), a = vn((t == null ? void 0 : t.in) || n, 0);
  return a.setFullYear(e, 0, 4), a.setHours(0, 0, 0, 0), r = Jp(a), r.setDate(r.getDate() + i), r;
}
function rm(n, e, t) {
  return tm(n, Do(n, t) + e, t);
}
function nm(n, e, t) {
  const r = zr(n, t == null ? void 0 : t.in);
  return r.setTime(r.getTime() + e * b0), r;
}
function im(n, e, t) {
  return Rf(n, e * 3, t);
}
function sm(n, e, t) {
  return Tf(n, e * 1e3, t);
}
function am(n, e, t) {
  return w0(n, e * 7, t);
}
function om(n, e, t) {
  return Rf(n, e * 12, t);
}
function um(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  );
  return Do(r, t) - Do(i, t);
}
function lm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = Pa(r), u = Pa(i), l = +a - sa(a), c = +u - sa(u);
  return Math.round((l - c) / I0);
}
function cm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = r.getFullYear() - i.getFullYear(), u = r.getMonth() - i.getMonth();
  return a * 12 + u;
}
function Zp(n, e) {
  const t = zr(n, e == null ? void 0 : e.in);
  return Math.trunc(t.getMonth() / 3) + 1;
}
function fm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = r.getFullYear() - i.getFullYear(), u = Zp(r) - Zp(i);
  return a * 4 + u;
}
function hm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = Vc(r, t), u = Vc(i, t), l = +a - sa(a), c = +u - sa(u);
  return Math.round((l - c) / I0);
}
function x0(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  );
  return r.getFullYear() - i.getFullYear();
}
function Cf(n) {
  return (e) => {
    const r = (n ? Math[n] : Math.trunc)(e);
    return r === 0 ? 0 : r;
  };
}
function pm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = (+r - +i) / _0;
  return Cf(t == null ? void 0 : t.roundingMethod)(a);
}
function Nf(n, e) {
  return +zr(n) - +zr(e);
}
function dm(n, e, t) {
  const r = Nf(n, e) / b0;
  return Cf(t == null ? void 0 : t.roundingMethod)(r);
}
function vm(n, e, t) {
  const r = Nf(n, e) / 1e3;
  return Cf(t == null ? void 0 : t.roundingMethod)(r);
}
function ym(n, e, t = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: n,
    timeZoneName: t
  }).format(e).split(/\s/g).slice(2).join(" ");
}
const Gl = {}, Ea = {};
function Ra(n, e) {
  try {
    const r = (Gl[n] || (Gl[n] = new Intl.DateTimeFormat("en-US", {
      timeZone: n,
      timeZoneName: "longOffset"
    }).format))(e).split("GMT")[1];
    return r in Ea ? Ea[r] : Qp(r, r.split(":"));
  } catch {
    if (n in Ea) return Ea[n];
    const t = n == null ? void 0 : n.match(gm);
    return t ? Qp(n, t.slice(1)) : NaN;
  }
}
const gm = /([+-]\d\d):?(\d\d)?/;
function Qp(n, e) {
  const t = +(e[0] || 0), r = +(e[1] || 0);
  return Ea[n] = t > 0 ? t * 60 + r : t * 60 - r;
}
class pn extends Date {
  //#region static
  constructor(...e) {
    super(), e.length > 1 && typeof e[e.length - 1] == "string" && (this.timeZone = e.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Ra(this.timeZone, this)) ? this.setTime(NaN) : e.length ? typeof e[0] == "number" && (e.length === 1 || e.length === 2 && typeof e[1] != "number") ? this.setTime(e[0]) : typeof e[0] == "string" ? this.setTime(+new Date(e[0])) : e[0] instanceof Date ? this.setTime(+e[0]) : (this.setTime(+new Date(...e)), E0(this), Jc(this)) : this.setTime(Date.now());
  }
  static tz(e, ...t) {
    return t.length ? new pn(...t, e) : new pn(Date.now(), e);
  }
  //#endregion
  //#region time zone
  withTimeZone(e) {
    return new pn(+this, e);
  }
  getTimezoneOffset() {
    return -Ra(this.timeZone, this);
  }
  //#endregion
  //#region time
  setTime(e) {
    return Date.prototype.setTime.apply(this, arguments), Jc(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](e) {
    return new pn(+new Date(e), this.timeZone);
  }
  //#endregion
}
const Xp = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((n) => {
  if (!Xp.test(n)) return;
  const e = n.replace(Xp, "$1UTC");
  pn.prototype[e] && (n.startsWith("get") ? pn.prototype[n] = function() {
    return this.internal[e]();
  } : (pn.prototype[n] = function() {
    return Date.prototype[e].apply(this.internal, arguments), mm(this), +this;
  }, pn.prototype[e] = function() {
    return Date.prototype[e].apply(this, arguments), Jc(this), +this;
  }));
});
function Jc(n) {
  n.internal.setTime(+n), n.internal.setUTCMinutes(n.internal.getUTCMinutes() - n.getTimezoneOffset());
}
function mm(n) {
  Date.prototype.setFullYear.call(n, n.internal.getUTCFullYear(), n.internal.getUTCMonth(), n.internal.getUTCDate()), Date.prototype.setHours.call(n, n.internal.getUTCHours(), n.internal.getUTCMinutes(), n.internal.getUTCSeconds(), n.internal.getUTCMilliseconds()), E0(n);
}
function E0(n) {
  const e = Ra(n.timeZone, n), t = /* @__PURE__ */ new Date(+n);
  t.setUTCHours(t.getUTCHours() - 1);
  const r = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset(), i = -(/* @__PURE__ */ new Date(+t)).getTimezoneOffset(), a = r - i, u = Date.prototype.getHours.apply(n) !== n.internal.getUTCHours();
  a && u && n.internal.setUTCMinutes(n.internal.getUTCMinutes() + a);
  const l = r - e;
  l && Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + l);
  const c = Ra(n.timeZone, n), m = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset() - c, w = c !== e, E = m - l;
  if (w && E) {
    Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + E);
    const k = Ra(n.timeZone, n), D = c - k;
    D && (n.internal.setUTCMinutes(n.internal.getUTCMinutes() + D), Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + D));
  }
}
class Ci extends pn {
  //#region static
  static tz(e, ...t) {
    return t.length ? new Ci(...t, e) : new Ci(Date.now(), e);
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
    return `${e} GMT${t}${r}${i} (${ym(this.timeZone, this)})`;
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
    return new Ci(+this, e);
  }
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](e) {
    return new Ci(+new Date(e), this.timeZone);
  }
  //#endregion
}
var Hl, ed;
function S0() {
  if (ed) return Hl;
  ed = 1;
  var n = Object.prototype.toString;
  return Hl = function(t) {
    var r = n.call(t), i = r === "[object Arguments]";
    return i || (i = r !== "[object Array]" && t !== null && typeof t == "object" && typeof t.length == "number" && t.length >= 0 && n.call(t.callee) === "[object Function]"), i;
  }, Hl;
}
var Wl, td;
function Im() {
  if (td) return Wl;
  td = 1;
  var n;
  if (!Object.keys) {
    var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, r = S0(), i = Object.prototype.propertyIsEnumerable, a = !i.call({ toString: null }, "toString"), u = i.call(function() {
    }, "prototype"), l = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ], c = function(E) {
      var k = E.constructor;
      return k && k.prototype === E;
    }, _ = {
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
      for (var E in window)
        try {
          if (!_["$" + E] && e.call(window, E) && window[E] !== null && typeof window[E] == "object")
            try {
              c(window[E]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    }(), w = function(E) {
      if (typeof window > "u" || !m)
        return c(E);
      try {
        return c(E);
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
      if (a)
        for (var ae = w(k), ke = 0; ke < l.length; ++ke)
          !(ae && l[ke] === "constructor") && e.call(k, l[ke]) && J.push(l[ke]);
      return J;
    };
  }
  return Wl = n, Wl;
}
var Yl, rd;
function bm() {
  if (rd) return Yl;
  rd = 1;
  var n = Array.prototype.slice, e = S0(), t = Object.keys, r = t ? function(u) {
    return t(u);
  } : Im(), i = Object.keys;
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
  }, Yl = r, Yl;
}
var Vl, nd;
function A0() {
  if (nd) return Vl;
  nd = 1;
  var n = bm(), e = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", t = Object.prototype.toString, r = Array.prototype.concat, i = /* @__PURE__ */ o0(), a = function(_) {
    return typeof _ == "function" && t.call(_) === "[object Function]";
  }, u = /* @__PURE__ */ u0()(), l = function(_, m, w, E) {
    if (m in _) {
      if (E === !0) {
        if (_[m] === w)
          return;
      } else if (!a(E) || !E())
        return;
    }
    u ? i(_, m, w, !0) : i(_, m, w);
  }, c = function(_, m) {
    var w = arguments.length > 2 ? arguments[2] : {}, E = n(m);
    e && (E = r.call(E, Object.getOwnPropertySymbols(m)));
    for (var k = 0; k < E.length; k += 1)
      l(_, E[k], m[E[k]], w[E[k]]);
  };
  return c.supportsDescriptors = !!u, Vl = c, Vl;
}
var Jl, id;
function _m() {
  if (id) return Jl;
  id = 1;
  var n = /* @__PURE__ */ _f();
  return Jl = function(t) {
    return (typeof t == "number" || typeof t == "bigint") && !n(t) && t !== 1 / 0 && t !== -1 / 0;
  }, Jl;
}
var Zl, sd;
function Pf() {
  if (sd) return Zl;
  sd = 1;
  var n = /* @__PURE__ */ e0(), e = /* @__PURE__ */ eu(), t = /* @__PURE__ */ _f(), r = /* @__PURE__ */ _m();
  return Zl = function(a) {
    if (typeof a != "number" || t(a) || !r(a))
      return !1;
    var u = n(a);
    return e(u) === u;
  }, Zl;
}
var Ql, ad;
function k0() {
  if (ad) return Ql;
  ad = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Dn(), t = /* @__PURE__ */ Pf(), r = e("Number.prototype.toString");
  return Ql = function(a, u) {
    if (typeof a != "number")
      throw new n("Assertion failed: `x` must be a Number");
    if (!t(u) || u < 2 || u > 36)
      throw new n("Assertion failed: `radix` must be an integer >= 2 and <= 36");
    return r(a, u);
  }, Ql;
}
var Xl, od;
function wm() {
  if (od) return Xl;
  od = 1;
  var n = /* @__PURE__ */ Dn(), e = /* @__PURE__ */ sr(), t = /* @__PURE__ */ Pf(), r = n("String.prototype.slice");
  return Xl = function(a, u, l) {
    if (typeof a != "string")
      throw new e("Assertion failed: `string` must be a String");
    if (typeof u != "string")
      throw new e("Assertion failed: `searchValue` must be a String");
    if (!t(l) || l < 0)
      throw new e("Assertion failed: `fromIndex` must be a non-negative integer");
    var c = a.length;
    if (u === "" && l <= c)
      return l;
    for (var _ = u.length, m = l; m <= c - _; m += 1) {
      var w = r(a, m, m + _);
      if (w === u)
        return m;
    }
    return -1;
  }, Xl;
}
var ec, ud;
function O0() {
  if (ud) return ec;
  ud = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Dn(), t = /* @__PURE__ */ Pf(), r = e("String.prototype.slice");
  return ec = function(a, u, l, c) {
    if (typeof a != "string")
      throw new n("Assertion failed: `S` must be a String");
    if (!t(u) || u < 0)
      throw new n("Assertion failed: `maxLength` must be a non-negative integer");
    if (typeof l != "string")
      throw new n("Assertion failed: `fillString` must be a String");
    if (c !== "start" && c !== "end" && c !== "START" && c !== "END")
      throw new n("Assertion failed: `placement` must be ~START~ or ~END~");
    var _ = a.length;
    if (u <= _ || l === "")
      return a;
    for (var m = u - _, w = ""; w.length < m; )
      w += l;
    return w = r(w, 0, m), c === "start" || c === "START" ? w + a : a + w;
  }, ec;
}
var tc, ld;
function xm() {
  if (ld) return tc;
  ld = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Dn(), t = e("String.prototype.charCodeAt"), r = e("Number.prototype.toString"), i = e("String.prototype.toLowerCase"), a = /* @__PURE__ */ O0();
  return tc = function(l) {
    if (typeof l != "string" || l.length !== 1)
      throw new n("Assertion failed: `C` must be a single code unit");
    var c = t(l, 0);
    if (c > 65535)
      throw new n("`Assertion failed: numeric value of `C` must be <= 0xFFFF");
    return "\\u" + a(i(r(c, 16)), 4, "0", "start");
  }, tc;
}
var rc, cd;
function Em() {
  if (cd) return rc;
  cd = 1;
  var n = /* @__PURE__ */ eu();
  return rc = function(t) {
    return typeof t == "bigint" ? t : n(t);
  }, rc;
}
var nc, fd;
function Sm() {
  if (fd) return nc;
  fd = 1;
  var n = /* @__PURE__ */ eu();
  return nc = function(t, r) {
    var i = t % r;
    return n(i >= 0 ? i : i + r);
  }, nc;
}
var ic, hd;
function Am() {
  return hd || (hd = 1, ic = /* @__PURE__ */ Sm()), ic;
}
var sc, pd;
function km() {
  if (pd) return sc;
  pd = 1;
  var n = /* @__PURE__ */ Am();
  return sc = function(t, r) {
    return n(t, r);
  }, sc;
}
var ac, dd;
function R0() {
  return dd || (dd = 1, ac = function(e) {
    return typeof e == "number" && e >= 0 && e <= 1114111 && (e | 0) === e;
  }), ac;
}
var oc, vd;
function Om() {
  if (vd) return oc;
  vd = 1;
  var n = /* @__PURE__ */ Ya(), e = /* @__PURE__ */ sr(), t = n("%String.fromCharCode%"), r = /* @__PURE__ */ Em(), i = /* @__PURE__ */ km(), a = /* @__PURE__ */ R0();
  return oc = function(l) {
    if (!a(l))
      throw new e("Assertion failed: `cp` must be >= 0 and <= 0x10FFFF");
    if (l <= 65535)
      return t(l);
    var c = t(r((l - 65536) / 1024) + 55296), _ = t(i(l - 65536, 1024) + 56320);
    return c + _;
  }, oc;
}
var uc, yd;
function Df() {
  return yd || (yd = 1, uc = function(e) {
    return typeof e == "number" && e >= 55296 && e <= 56319;
  }), uc;
}
var lc, gd;
function Bf() {
  return gd || (gd = 1, lc = function(e) {
    return typeof e == "number" && e >= 56320 && e <= 57343;
  }), lc;
}
var cc, md;
function Rm() {
  if (md) return cc;
  md = 1;
  var n = /* @__PURE__ */ Dn(), e = l0()(), t = /* @__PURE__ */ a0(), r = /* @__PURE__ */ oa(), i;
  if (e) {
    var a = n("RegExp.prototype.exec"), u = {}, l = function() {
      throw u;
    }, c = {
      toString: l,
      valueOf: l
    };
    typeof Symbol.toPrimitive == "symbol" && (c[Symbol.toPrimitive] = l), i = function(E) {
      if (!E || typeof E != "object")
        return !1;
      var k = (
        /** @type {NonNullable<typeof gOPD>} */
        r(
          /** @type {{ lastIndex?: unknown }} */
          E,
          "lastIndex"
        )
      ), D = k && t(k, "value");
      if (!D)
        return !1;
      try {
        a(
          E,
          /** @type {string} */
          /** @type {unknown} */
          c
        );
      } catch (K) {
        return K === u;
      }
    };
  } else {
    var _ = n("Object.prototype.toString"), m = "[object RegExp]";
    i = function(E) {
      return !E || typeof E != "object" && typeof E != "function" ? !1 : _(E) === m;
    };
  }
  return cc = i, cc;
}
var fc, Id;
function T0() {
  if (Id) return fc;
  Id = 1;
  var n = /* @__PURE__ */ Dn(), e = Rm(), t = n("RegExp.prototype.exec"), r = /* @__PURE__ */ sr();
  return fc = function(a) {
    if (!e(a))
      throw new r("`regex` must be a RegExp");
    return function(l) {
      return t(a, l) !== null;
    };
  }, fc;
}
var hc, bd;
function Tm() {
  if (bd) return hc;
  bd = 1;
  var n = /* @__PURE__ */ k0(), e = /* @__PURE__ */ wm(), t = /* @__PURE__ */ O0(), r = /* @__PURE__ */ xm(), i = /* @__PURE__ */ Om(), a = /* @__PURE__ */ Df(), u = /* @__PURE__ */ Bf(), l = /* @__PURE__ */ sr(), c = /* @__PURE__ */ R0(), _ = Sf(), m = /* @__PURE__ */ T0(), w = m(/^\s$/), E = m(/^[\n\r\u2028\u2029]$/), k = "^$\\.*+?()[]{}|", D = ",-=<>#&!%:;@~'`\"", K = {
    "	": "t",
    "\n": "n",
    "\v": "v",
    "\f": "f",
    "\r": "r",
    __proto__: null
  };
  return hc = function(M) {
    if (!c(M))
      throw new l("Assertion failed: `c` must be a valid Unicode code point");
    var J = i(M);
    if (e(k, J, 0) > -1 || J === "/")
      return "\\" + J;
    if (J in K)
      return "\\" + K[J];
    if (e(D, J, 0) > -1 || w(J) || E(J) || a(M) || u(M)) {
      if (M < 255) {
        var X = n(M, 16);
        return "\\x" + t(X, 2, "0", "START");
      }
      var le = "", ce = J;
      return _(ce, function(fe) {
        le += r(fe);
      }), le;
    }
    return J;
  }, hc;
}
var pc, _d;
function Cm() {
  if (_d) return pc;
  _d = 1;
  var n = /* @__PURE__ */ Ya(), e = /* @__PURE__ */ sr(), t = n("%String.fromCharCode%"), r = /* @__PURE__ */ Df(), i = /* @__PURE__ */ Bf();
  return pc = function(u, l) {
    if (!r(u) || !i(l))
      throw new e("Assertion failed: `lead` must be a leading surrogate char code, and `trail` must be a trailing surrogate char code");
    return t(u) + t(l);
  }, pc;
}
var dc, wd;
function Nm() {
  if (wd) return dc;
  wd = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Dn(), t = /* @__PURE__ */ Df(), r = /* @__PURE__ */ Bf(), i = /* @__PURE__ */ Cm(), a = e("String.prototype.charAt"), u = e("String.prototype.charCodeAt");
  return dc = function(c, _) {
    if (typeof c != "string")
      throw new n("Assertion failed: `string` must be a String");
    var m = c.length;
    if (_ < 0 || _ >= m)
      throw new n("Assertion failed: `position` must be >= 0, and < the length of `string`");
    var w = u(c, _), E = a(c, _), k = t(w), D = r(w);
    if (!k && !D)
      return {
        "[[CodePoint]]": E,
        "[[CodeUnitCount]]": 1,
        "[[IsUnpairedSurrogate]]": !1
      };
    if (D || _ + 1 === m)
      return {
        "[[CodePoint]]": E,
        "[[CodeUnitCount]]": 1,
        "[[IsUnpairedSurrogate]]": !0
      };
    var K = u(c, _ + 1);
    return r(K) ? {
      "[[CodePoint]]": i(w, K),
      "[[CodeUnitCount]]": 2,
      "[[IsUnpairedSurrogate]]": !1
    } : {
      "[[CodePoint]]": E,
      "[[CodeUnitCount]]": 1,
      "[[IsUnpairedSurrogate]]": !0
    };
  }, dc;
}
var vc, xd;
function Pm() {
  if (xd) return vc;
  xd = 1;
  var n = /* @__PURE__ */ sr(), e = /* @__PURE__ */ Nm();
  return vc = function(r) {
    if (typeof r != "string")
      throw new n("Assertion failed: `string` must be a String");
    for (var i = [], a = r.length, u = 0; u < a; ) {
      var l = e(r, u);
      i[i.length] = l["[[CodePoint]]"], u += l["[[CodeUnitCount]]"];
    }
    return i;
  }, vc;
}
var yc, Ed;
function Dm() {
  if (Ed) return yc;
  Ed = 1;
  var n = /* @__PURE__ */ Ya(), e = Af(), t = e(n("String.prototype.indexOf"));
  return yc = function(i, a) {
    var u = n(i, !!a);
    return typeof u == "function" && t(i, ".prototype.") > -1 ? e(u) : u;
  }, yc;
}
var gc, Sd;
function C0() {
  if (Sd) return gc;
  Sd = 1;
  var n = Tm(), e = /* @__PURE__ */ k0(), t = /* @__PURE__ */ Pm(), r = /* @__PURE__ */ T0(), i = Sf(), a = /* @__PURE__ */ sr(), u = r(/^[\da-zA-Z]$/), l = Dm(), c = l("String.prototype.charCodeAt"), _ = function(w) {
    var E = c(w, 0);
    if (E < 55296 || E > 56319 || w.length === 1)
      return E;
    var k = c(w, 1);
    return k < 56320 || k > 57343 ? E : (E - 55296) * 1024 + (k - 56320) + 65536;
  };
  return gc = function(w) {
    if (typeof w != "string")
      throw new a("`S` must be a String");
    var E = "", k = t(w);
    return i(k, function(D) {
      if (E === "" && u(D)) {
        var K = e(_(D), 16);
        E += "\\x" + K;
      } else
        E += n(_(D));
    }), E;
  }, gc;
}
var mc, Ad;
function N0() {
  if (Ad) return mc;
  Ad = 1;
  var n = C0();
  return mc = function() {
    return RegExp.escape || n;
  }, mc;
}
var Ic, kd;
function Bm() {
  if (kd) return Ic;
  kd = 1;
  var n = A0(), e = N0()();
  return Ic = function() {
    return n(RegExp, {
      escape: e
    }), RegExp.escape;
  }, Ic;
}
var bc, Od;
function Fm() {
  if (Od) return bc;
  Od = 1;
  var n = A0(), e = Af(), t = C0(), r = N0(), i = Bm(), a = e(t, null);
  return n(a, {
    getPolyfill: r,
    implementation: t,
    method: t,
    // TODO: remove at semver-major
    shim: i
  }), bc = a, bc;
}
var Lm = Fm();
const qm = /* @__PURE__ */ bf(Lm);
var Vv;
const Mm = ((Vv = Object.getOwnPropertyDescriptor(RegExp, "escape")) == null ? void 0 : Vv.value) ?? qm;
function Um(n) {
  if (!Array.isArray(n)) return null;
  let e = 0, t = 0;
  for (const r of n)
    typeof r == "number" && (e += r, t += 1);
  return t > 0 ? e / t : null;
}
function P0(n, e) {
  return Array.isArray(n) ? Lo(e) < 5 ? n.includes(e) : n.some((t) => Pn(t, e)) : null;
}
function $m(n) {
  if (!Array.isArray(n)) return null;
  let e = 0;
  for (const t of n)
    t !== null && ++e;
  return e;
}
function jm(n) {
  if (!Array.isArray(n)) return null;
  for (const e of n)
    if (e !== null) return e;
  return null;
}
function Km(n) {
  return Array.isArray(n) ? n.length : null;
}
function D0(n, e) {
  if (!Array.isArray(n)) return null;
  let t = null, r = !0;
  for (const i of n)
    i !== null && ((r || Yt(i, t) === e) && (t = i), r = !1);
  return t;
}
function zm(n) {
  return D0(n, 1);
}
function Gm(n) {
  return D0(n, -1);
}
function Hm(n) {
  if (!Array.isArray(n)) return null;
  let e = 0;
  for (const t of n)
    typeof t == "number" && (e += t);
  return e;
}
function Yt(n, e) {
  const t = Lo(n), r = Lo(e);
  if (t !== r)
    return Math.sign(t - r);
  switch (t) {
    case 5: {
      const i = n, a = e, u = i.length, l = a.length, c = Math.min(u, l);
      for (let _ = 0; _ < c; ++_) {
        const m = Yt(i[_], a[_]);
        if (m !== 0)
          return m;
      }
      return Math.sign(u - l);
    }
    case 6: {
      const i = n, a = e, u = Object.getOwnPropertyNames(i), l = Object.getOwnPropertyNames(a), c = u.length, _ = Math.sign(c - l.length);
      if (_ !== 0) return _;
      u.sort(), l.sort();
      for (let m = 0; m < c; ++m) {
        const w = u[m], E = l[m];
        if (w !== E)
          return w > E ? 1 : -1;
        const k = Yt(i[w], a[E]);
        if (k !== 0) return k;
      }
      return 0;
    }
    default:
      return n < e ? -1 : n > e ? 1 : 0;
  }
}
function Pn(n, e) {
  return n === void 0 || e === void 0 ? n === e : ia(n, e);
}
function Rd(n, e) {
  let t;
  for (const r of n) {
    const i = r();
    i != null && (t === void 0 || Yt(i, t) === e) && (t = i);
  }
  return t ?? null;
}
function Wm(n, e) {
  if (!(e === void 0 || Pn(n, e)))
    return e === null ? null : n;
}
function Ym(n, e) {
  if (!(n === void 0 || e === void 0))
    return e === null || Pn(n, e) ? null : n;
}
const B0 = { millennium: 1e3, century: 100, decade: 10 }, Vm = {
  year: x0,
  iso_year: um,
  quarter: fm,
  month: cm,
  week: hm,
  iso_week: lm,
  day: wo,
  day_of_year: wo,
  doy: wo,
  hour: pm,
  minute: dm,
  second: vm,
  millisecond: Nf
}, Jm = {
  year: om,
  iso_year: rm,
  quarter: im,
  month: Rf,
  week: am,
  day: w0,
  hour: Qg,
  minute: nm,
  second: sm,
  millisecond: Tf
};
function Zm(n, e, t) {
  let r = B0[t];
  r !== void 0 && (e *= r, t = "year");
  const i = Jm[t];
  if (i === void 0)
    return console.error(`date_add_str(): Unsupported date part "${t}"`), null;
  const a = i(n, e);
  return typeof n == "string" ? a.toISOString() : a.valueOf();
}
function Qm(n, e, t) {
  const r = Vm[t];
  if (r !== void 0)
    return r(n, e);
  let i = B0[t];
  return i !== void 0 ? Math.trunc(x0(n, e) / i) : (console.error(`date_diff_str(): Unsupported date part "${t}"`), null);
}
function F0(n) {
  return new Ci(n).toISOString();
}
function Ff(n) {
  return new Date(n).toISOString();
}
function L0(n, e) {
  if (e === void 0)
    return F0(n);
  if (e === "UTC")
    return Ff(n);
  try {
    return new Ci(n, e).toISOString();
  } catch (t) {
    if (!(t instanceof RangeError))
      throw t;
    return console.error(`millis_to_tz(): Unknown time zone "${e}"`), null;
  }
}
function Xm(n) {
  const e = Date.parse(n);
  return isNaN(e) ? null : e;
}
function e1(n) {
  const e = Date.parse(n);
  return isNaN(e) ? null : Ff(e);
}
function t1(n, e) {
  const t = Date.parse(n);
  return isNaN(t) ? null : L0(t, e);
}
function r1(n, e) {
  let t = n / e;
  return isFinite(t) ? (n === Math.floor(n) && e === Math.floor(e) && (t = Math.floor(t)), t) : null;
}
function n1(n, e, t) {
  const r = Bo(n), i = Bo(e);
  if (r === void 0 || i === void 0)
    return null;
  const a = r.length;
  if (i.length !== a)
    return null;
  let u = 0;
  for (let l = 0; l < a; ++l) {
    const c = r[l] - i[l];
    u += c * c;
  }
  return Math.pow(u, (t ?? 1) / 2);
}
function i1(n, e) {
  const t = Bo(n), r = Bo(e);
  if (t === void 0 || r === void 0)
    return null;
  const i = t.length;
  if (r.length !== i)
    return null;
  let a = 0, u = 0, l = 0;
  for (let c = 0; c < i; ++c) {
    const _ = t[c], m = r[c];
    a += _ * _, u += _ * m, l += m * m;
  }
  return 1 - u / Math.sqrt(a * l);
}
function Bo(n) {
  if (Array.isArray(n))
    return n;
  if (typeof n == "string") {
    const e = Jg(n);
    return e === void 0 || e.length % 4 !== 0 ? void 0 : new Float32Array(e.buffer);
  } else
    return;
}
function s1(n, e) {
  let t = n / e;
  return isFinite(t) ? Math.floor(t) : null;
}
function Lf(n, e, t) {
  if (e === 0)
    return t(n);
  if (e !== Math.trunc(e))
    return null;
  const r = Math.pow(10, e);
  return t(n * r) / r;
}
function Td(n, e = 0) {
  return Lf(n, e, Math.round);
}
function q0(n, e = 0) {
  return Lf(n, e, (t) => {
    const r = Math.floor(t);
    return t - r === 0.5 ? r % 2 ? r + 1 : r : Math.round(t);
  });
}
function a1(n, e) {
  return Lf(n, e, Math.trunc);
}
function o1(n, e) {
  const [t, r] = qf(e);
  switch (t) {
    case 0:
      return n === r;
    case 1:
      return n.startsWith(r);
    case 2:
      return n.endsWith(r);
    default:
      return M0(e).test(n);
  }
}
function _c(n) {
  return n.replaceAll(/\\(.)/g, "$1");
}
function M0(n) {
  const e = n.split(/([%_])/), t = e.length;
  for (let r = 0; r < t; r++) {
    const i = e[r];
    r & 1 ? e[r] = i === "%" ? ".*" : "." : e[r] = Mm(i);
  }
  return new RegExp(e.join(""));
}
function qf(n) {
  const e = n.replaceAll(/\\./g, "##");
  if (e.indexOf("_") >= 0)
    return [3, n];
  let t = e.indexOf("%");
  if (t < 0)
    return [0, _c(n)];
  if (e.lastIndexOf("%") === t) {
    if (t === 0)
      return [2, _c(n.slice(1))];
    if (t === e.length - 1)
      return [1, _c(n.slice(0, -1))];
  }
  return [3, n];
}
function u1(n) {
  const e = n.length;
  for (let t = 0; t < e; ++t)
    if (n.charCodeAt(t) > 127)
      return new TextEncoder().encode(n).length;
  return e;
}
function U0(n, e) {
  const t = n.length;
  for (let r = 0; r < t; ++r)
    if (!e.includes(n[r]))
      return n.slice(r);
  return "";
}
function $0(n, e) {
  const t = n.length;
  for (let r = t - 1; r >= 0; --r)
    if (!e.includes(n[r]))
      return n.slice(0, r + 1);
  return "";
}
function l1(n, e) {
  return U0($0(n, e), e);
}
function Cd(n) {
  return typeof n == "boolean";
}
function Nd(n) {
  return typeof n == "number";
}
function Pd(n) {
  return typeof n == "string";
}
function Dd(n) {
  return typeof n == "object" && !Array.isArray(n);
}
function wc(n) {
  return n != null;
}
function Bd(n) {
  const e = typeof n;
  return e === "boolean" || e === "number" || e === "string";
}
function Fd(n) {
  return Array.isArray(n) ? n : [n];
}
function Fo(n) {
  if (typeof n != "object" || n === null)
    return n;
  if (Array.isArray(n)) {
    if (n.length === 1)
      return Fo(n[0]);
  } else {
    const e = Object.getOwnPropertyNames(n);
    if (e.length === 1)
      return Fo(n[e[0]]);
  }
  return null;
}
function Ld(n) {
  return n ? typeof n != "object" ? !0 : Array.isArray(n) ? n.length > 0 : Object.getOwnPropertyNames(n).length > 0 : !1;
}
function qd(n) {
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
function Md(n) {
  return typeof n == "object" && !Array.isArray(n) ? n : {};
}
function Ud(n) {
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
function $d(n) {
  return c1[Lo(n)];
}
const c1 = ["missing", "null", "boolean", "number", "string", "array", "object"];
function Lo(n) {
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
class la {
  constructor(e, t) {
    this.sourceExpression = e, this.compiledArg = t;
  }
  /** Adds the current value of the compiledArg to my state. */
  accumulate() {
    this.add(this.compiledArg());
  }
}
class Mf extends la {
  constructor() {
    super(...arguments);
    pe(this, "result", []);
  }
  clone() {
    return new Mf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = [];
  }
  add(t) {
    t !== void 0 && this.result.push(t);
  }
}
var Ni, Ts;
const ih = class ih extends la {
  constructor() {
    super(...arguments);
    ee(this, Ni, 0);
    ee(this, Ts, 0);
  }
  clone() {
    return new ih(this.sourceExpression, this.compiledArg);
  }
  reset() {
    G(this, Ni, G(this, Ts, 0));
  }
  add(t) {
    typeof t == "number" && (G(this, Ni, p(this, Ni) + 1), G(this, Ts, p(this, Ts) + t));
  }
  get result() {
    return p(this, Ni) ? p(this, Ts) / p(this, Ni) : null;
  }
};
Ni = new WeakMap(), Ts = new WeakMap();
let Zc = ih;
class Uf extends la {
  constructor() {
    super(...arguments);
    pe(this, "result", 0);
  }
  clone() {
    return new Uf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = 0;
  }
  add(t) {
    this.result++;
  }
}
class $f extends la {
  constructor() {
    super(...arguments);
    pe(this, "result", null);
  }
  clone() {
    return new $f(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = null;
  }
  add(t) {
    t != null && (this.result === null || Yt(t, this.result) > 0) && (this.result = t);
  }
}
class jf extends la {
  constructor() {
    super(...arguments);
    pe(this, "result", null);
  }
  clone() {
    return new jf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = null;
  }
  add(t) {
    t != null && (this.result === null || Yt(t, this.result) < 0) && (this.result = t);
  }
}
class Kf extends la {
  constructor() {
    super(...arguments);
    pe(this, "result", 0);
  }
  clone() {
    return new Kf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = 0;
  }
  add(t) {
    typeof t == "number" && (this.result += t);
  }
}
function f1(n) {
  jd(n);
  for (let e of n.FROM)
    jd(e);
  n.WHAT = n.WHAT.map((e) => typeof e == "string" ? ["." + e] : e), j0(n, (e, t) => {
    const r = e[0];
    return (r === "." || r === "$" || r === "?") && e.length > 1 ? (t.splice(1, 0, ...e.substring(1).split(".")), t[0] = e[0]) : t[0] = e.toUpperCase(), !0;
  });
}
function h1(n, e, t) {
  j0(n, (r, i) => {
    if (r === ".") {
      const a = i[1];
      if (a === void 0 || !e.has(a)) {
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
function jd(n) {
  for (const e of Object.getOwnPropertyNames(n)) {
    const t = e.toUpperCase();
    if (t !== e) {
      if (t in n) throw Error(`Conflicting keys "${e}" and "${t}"`);
      n[t] = n[e], delete n[e];
    }
  }
}
function j0(n, e) {
  function t(r) {
    r !== void 0 && zf(r, e);
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
function zf(n, e) {
  return t(n);
  function t(r) {
    if (Va(r))
      return !0;
    if (Array.isArray(r)) {
      const i = r[0];
      if (!e(i, r))
        return !1;
      if (i !== "." && i !== "META()") {
        const a = r.length;
        for (let u = 1; u < a; ++u)
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
function xc(n) {
  let e = /* @__PURE__ */ new Set();
  return zf(n, (t, r) => ((t === "." || t === "META()") && e.add(r[1]), !0)), e;
}
function Kd(n) {
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
function Ii(n, e) {
  if (!n)
    throw new Error(e || "Assertion failed");
}
function Qc(n, e, t) {
  let r;
  Object.defineProperty(n, e, {
    get() {
      return r || (r = t.call(this)), r;
    }
  });
}
function p1(n) {
  return n && Object.assign({}, n);
}
function K0(n, e) {
  const t = [];
  for (; e-- > 0; )
    t.push(n());
  return t;
}
function z0(n, e) {
  return new Array(e + 1).join(n);
}
function nu(n, e) {
  return K0(() => n, e);
}
function Xc(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const r = n[t];
    n.lastIndexOf(r) !== t && e.indexOf(r) < 0 && e.push(r);
  }
  return e;
}
function G0(n) {
  const e = [];
  return n.forEach((t) => {
    e.indexOf(t) < 0 && e.push(t);
  }), e;
}
function us(n) {
  const e = n[0];
  return e === e.toUpperCase();
}
function H0(n) {
  return !us(n);
}
function W0(n, e, t) {
  const r = t || " ";
  return n.length < e ? z0(r, e - n.length) + n : n;
}
function ps() {
  this.strings = [];
}
ps.prototype.append = function(n) {
  this.strings.push(n);
};
ps.prototype.contents = function() {
  return this.strings.join("");
};
const Ec = (n) => String.fromCodePoint(parseInt(n, 16));
function Y0(n) {
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
        return Ec(n.slice(2, 4));
      case "u":
        return n.charAt(2) === "{" ? Ec(n.slice(3, -1)) : Ec(n.slice(2, 6));
      default:
        return n.charAt(1);
    }
  else
    return n;
}
function V0(n) {
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
function J0(n, e = "unexpected null value") {
  if (n == null)
    throw new Error(e);
  return n;
}
const d1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StringBuffer: ps,
  abstract: br,
  assert: Ii,
  checkNotNull: J0,
  clone: p1,
  copyWithoutDuplicates: G0,
  defineLazyProperty: Qc,
  getDuplicates: Xc,
  isLexical: H0,
  isSyntactic: us,
  padLeft: W0,
  repeat: nu,
  repeatFn: K0,
  repeatStr: z0,
  unescapeCodePoint: Y0,
  unexpectedObjToString: V0
}, Symbol.toStringTag, { value: "Module" })), v1 = {
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
const ar = Object.create(Ge.prototype), or = Object.create(Ge.prototype);
class Jt extends Ge {
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
class Mt extends Ge {
  constructor(e) {
    super(), this.terms = e;
  }
}
class iu extends Mt {
  constructor(e, t, r) {
    const i = e.rules[t].body;
    super([r, i]), this.superGrammar = e, this.name = t, this.body = r;
  }
}
class su extends Mt {
  constructor(e, t, r, i) {
    const a = e.rules[t].body;
    super([...r, a, ...i]), this.superGrammar = e, this.ruleName = t, this.expansionPos = r.length;
  }
}
class zt extends Ge {
  constructor(e) {
    super(), this.factors = e;
  }
}
class _r extends Ge {
  constructor(e) {
    super(), this.expr = e;
  }
}
class ds extends _r {
}
class ca extends _r {
}
class Bn extends _r {
}
ds.prototype.operator = "*";
ca.prototype.operator = "+";
Bn.prototype.operator = "?";
ds.prototype.minNumMatches = 0;
ca.prototype.minNumMatches = 1;
Bn.prototype.minNumMatches = 0;
ds.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
ca.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
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
class Or extends Ge {
  constructor(e) {
    super(), this.expr = e;
  }
}
class mt extends Ge {
  constructor(e, t = []) {
    super(), this.ruleName = e, this.args = t;
  }
  isSyntactic() {
    return us(this.ruleName);
  }
  // This method just caches the result of `this.toString()` in a non-enumerable property.
  toMemoKey() {
    return this._memoKey || Object.defineProperty(this, "_memoKey", { value: this.toString() }), this._memoKey;
  }
}
class Vt extends Ge {
  constructor(e) {
    super(), this.category = e, this.pattern = v1[e];
  }
}
function Ct(n, e) {
  let t;
  return e ? (t = new Error(e.getLineAndColumnMessage() + n), t.shortMessage = n, t.interval = e) : t = new Error(n), t;
}
function ef() {
  return Ct("Interval sources don't match");
}
function y1(n, e, t) {
  const r = e ? `Grammar ${n} is not declared in namespace '${e}'` : "Undeclared grammar " + n;
  return Ct(r, t);
}
function g1(n, e) {
  return Ct("Grammar " + n.name + " is already declared in this namespace");
}
function m1(n) {
  return Ct(`Grammar '${n.name}' does not support incremental parsing`);
}
function Z0(n, e, t) {
  return Ct(
    "Rule " + n + " is not declared in grammar " + e,
    t
  );
}
function I1(n, e, t) {
  return Ct(
    "Cannot override rule " + n + " because it is not declared in " + e,
    t
  );
}
function b1(n, e, t) {
  return Ct(
    "Cannot extend rule " + n + " because it is not declared in " + e,
    t
  );
}
function zd(n, e, t, r) {
  let i = "Duplicate declaration for rule '" + n + "' in grammar '" + e + "'";
  return e !== t && (i += " (originally declared in '" + t + "')"), Ct(i, r);
}
function Q0(n, e, t, r) {
  return Ct(
    "Wrong number of parameters for rule " + n + " (expected " + e + ", got " + t + ")",
    r
  );
}
function _1(n, e, t, r) {
  return Ct(
    "Wrong number of arguments for rule " + n + " (expected " + e + ", got " + t + ")",
    r
  );
}
function Gd(n, e, t) {
  return Ct(
    "Duplicate parameter names in rule " + n + ": " + e.join(", "),
    t
  );
}
function w1(n, e) {
  return Ct(
    "Invalid parameter to rule " + n + ": " + e + " has arity " + e.getArity() + ", but parameter expressions must have arity 1",
    e.source
  );
}
const x1 = "NOTE: A _syntactic rule_ is a rule whose name begins with a capital letter. See https://ohmjs.org/d/svl for more details.";
function E1(n, e) {
  return Ct(
    "Cannot apply syntactic rule " + n + " from here (inside a lexical context)",
    e.source
  );
}
function S1(n) {
  const { ruleName: e } = n;
  return Ct(
    `applySyntactic is for syntactic rules, but '${e}' is a lexical rule. ` + x1,
    n.source
  );
}
function A1(n) {
  return Ct(
    "applySyntactic is not required here (in a syntactic context)",
    n.source
  );
}
function Hd(n, e) {
  return Ct("Incorrect argument type: expected " + n, e.source);
}
function k1(n) {
  return Ct("'...' can appear at most once in a rule body", n.source);
}
function O1(n) {
  const e = n._node;
  Ii(e && e.isNonterminal() && e.ctorName === "escapeChar_unicodeCodePoint");
  const t = n.children.slice(1, -1).map((i) => i.source), r = t[0].coverageWith(...t.slice(1));
  return Ct(
    `U+${r.contents} is not a valid Unicode code point`,
    r
  );
}
function X0(n, e) {
  const t = e.length > 0 ? e[e.length - 1].args : [];
  let i = "Nullable expression " + n.expr.substituteParams(t) + " is not allowed inside '" + n.operator + "' (possible infinite loop)";
  if (e.length > 0) {
    const a = e.map((u) => new mt(u.ruleName, u.args)).join(`
`);
    i += `
Application stack (most recent application last):
` + a;
  }
  return Ct(i, n.expr.source);
}
function ey(n, e, t, r) {
  return Ct(
    "Rule " + n + " involves an alternation which has inconsistent arity (expected " + e + ", got " + t + ")",
    r.source
  );
}
function R1(n) {
  const e = n.map((t) => t.message);
  return Ct(["Errors:"].concat(e).join(`
- `), n[0].interval);
}
function T1(n, e, t, r) {
  let i = r.slice(0, -1).map((c) => {
    const _ = "  " + c[0].name + " > " + c[1];
    return c.length === 3 ? _ + " for '" + c[2] + "'" : _;
  }).join(`
`);
  i += `
  ` + e + " > " + n;
  let a = "";
  n === "_iter" && (a = [
    `
NOTE: as of Ohm v16, there is no default action for iteration nodes — see `,
    "  https://ohmjs.org/d/dsa for details."
  ].join(`
`));
  const u = [
    `Missing semantic action for '${n}' in ${t} '${e}'.${a}`,
    "Action stack (most recent call last):",
    i
  ].join(`
`), l = Ct(u);
  return l.name = "missingSemanticAction", l;
}
function C1(n) {
  if (n.length === 1)
    throw n[0];
  if (n.length > 1)
    throw R1(n);
}
function N1(n) {
  let e = 0;
  return n.map((r) => {
    const i = r.toString();
    return e = Math.max(e, i.length), i;
  }).map((r) => W0(r, e));
}
function Wd(n, e, t) {
  const r = n.length, i = n.slice(0, t), a = n.slice(t + e.length);
  return (i + e + a).substr(0, r);
}
function P1(...n) {
  const e = this, { offset: t } = e, { repeatStr: r } = d1, i = new ps();
  i.append("Line " + e.lineNum + ", col " + e.colNum + `:
`);
  const a = N1([
    e.prevLine == null ? 0 : e.lineNum - 1,
    e.lineNum,
    e.nextLine == null ? 0 : e.lineNum + 1
  ]), u = (m, w, E) => {
    i.append(E + a[m] + " | " + w + `
`);
  };
  e.prevLine != null && u(0, e.prevLine, "  "), u(1, e.line, "> ");
  const l = e.line.length;
  let c = r(" ", l + 1);
  for (let m = 0; m < n.length; ++m) {
    let w = n[m][0], E = n[m][1];
    Ii(w >= 0 && w <= E, "range start must be >= 0 and <= end");
    const k = t - e.colNum + 1;
    w = Math.max(0, w - k), E = Math.min(E - k, l), c = Wd(c, r("~", E - w), w);
  }
  const _ = 2 + a[1].length + 3;
  return i.append(r(" ", _)), c = Wd(c, "^", e.colNum - 1), i.append(c.replace(/ +$/, "") + `
`), e.nextLine != null && u(2, e.nextLine, "  "), i.contents();
}
let tf = [];
function ty(n) {
  tf.push(n);
}
function D1(n) {
  tf.forEach((e) => {
    e(n);
  }), tf = null;
}
function Gf(n, e) {
  let t = 1, r = 1, i = 0, a = 0, u = null, l = null, c = -1;
  for (; i < e; ) {
    const w = n.charAt(i++);
    w === `
` ? (t++, r = 1, c = a, a = i) : w !== "\r" && r++;
  }
  let _ = n.indexOf(`
`, a);
  if (_ === -1)
    _ = n.length;
  else {
    const w = n.indexOf(`
`, _ + 1);
    u = w === -1 ? n.slice(_) : n.slice(_, w), u = u.replace(/^\r?\n/, "").replace(/\r$/, "");
  }
  c >= 0 && (l = n.slice(c, a).replace(/\r?\n$/, ""));
  const m = n.slice(a, _).replace(/\r$/, "");
  return {
    offset: e,
    lineNum: t,
    colNum: r,
    line: m,
    prevLine: l,
    nextLine: u,
    toString: P1
  };
}
function ry(n, e, ...t) {
  return Gf(n, e).toString(...t);
}
const Yd = /* @__PURE__ */ (() => {
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
    return Gf(this.sourceString, this.startIdx);
  }
  getLineAndColumnMessage() {
    const e = [this.startIdx, this.endIdx];
    return ry(this.sourceString, this.startIdx, e);
  }
  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus(e) {
    if (this.sourceString !== e.sourceString)
      throw ef();
    return this.startIdx === e.startIdx && this.endIdx === e.endIdx ? [] : this.startIdx < e.startIdx && e.endIdx < this.endIdx ? [
      new ir(this.sourceString, this.startIdx, e.startIdx),
      new ir(this.sourceString, e.endIdx, this.endIdx)
    ] : this.startIdx < e.endIdx && e.endIdx < this.endIdx ? [new ir(this.sourceString, e.endIdx, this.endIdx)] : this.startIdx < e.startIdx && e.startIdx < this.endIdx ? [new ir(this.sourceString, this.startIdx, e.startIdx)] : [this];
  }
  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo(e) {
    if (this.sourceString !== e.sourceString)
      throw ef();
    return Ii(
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
      throw ef();
    t = Math.min(t, i.startIdx), r = Math.max(r, i.endIdx);
  }
  return new ir(n.sourceString, t, r);
};
const B1 = 65535;
class au {
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
    return e > B1 && (this.pos += 1), this.examinedLength = Math.max(this.examinedLength, this.pos), e;
  }
  matchString(e, t) {
    let r;
    if (t) {
      for (r = 0; r < e.length; r++) {
        const i = this.next(), a = e[r];
        if (i == null || i.toUpperCase() !== a.toUpperCase())
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
class ny {
  constructor(e, t, r, i, a, u, l) {
    this.matcher = e, this.input = t, this.startExpr = r, this._cst = i, this._cstOffset = a, this._rightmostFailurePosition = u, this._rightmostFailures = l, this.failed() && (Qc(this, "message", function() {
      const c = "Expected " + this.getExpectedText();
      return ry(this.input, this.getRightmostFailurePosition()) + c;
    }), Qc(this, "shortMessage", function() {
      const c = "expected " + this.getExpectedText(), _ = Gf(
        this.input,
        this.getRightmostFailurePosition()
      );
      return "Line " + _.lineNum + ", col " + _.colNum + ": " + c;
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
    const e = new ps();
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
class F1 {
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
    const { applicationMemoKeyStack: r } = this, i = r.indexOf(e.toMemoKey()) + 1, a = r.slice(
      i
    );
    t.isInvolved = function(u) {
      return a.indexOf(u) >= 0;
    }, t.updateInvolvedApplicationMemoKeys = function() {
      for (let u = i; u < r.length; u++) {
        const l = r[u];
        this.isInvolved(l) || a.push(l);
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
      const a = r[i];
      e + a.examinedLength > t ? delete r[i] : (this.maxExaminedLength = Math.max(this.maxExaminedLength, a.examinedLength), this.maxRightmostFailureOffset = Math.max(
        this.maxRightmostFailureOffset,
        a.rightmostFailureOffset
      ));
    });
  }
}
const L1 = "✗", q1 = "✓", M1 = "⋅", U1 = "⇒", $1 = "␉", j1 = "␊", K1 = "␍", rf = {
  succeeded: 1,
  isRootNode: 2,
  isImplicitSpaces: 4,
  isMemoized: 8,
  isHeadOfLeftRecursion: 16,
  terminatesLR: 32
};
function z1(n) {
  return nu(" ", n).join("");
}
function G1(n, e, t) {
  const r = iy(n.slice(e, e + t));
  return r.length < t ? r + nu(" ", t - r.length).join("") : r;
}
function iy(n) {
  return typeof n == "string" ? n.replace(/ /g, M1).replace(/\t/g, $1).replace(/\n/g, j1).replace(/\r/g, K1) : String(n);
}
class vi {
  constructor(e, t, r, i, a, u, l) {
    this.input = e, this.pos = this.pos1 = t, this.pos2 = r, this.source = new ir(e, t, r), this.expr = i, this.bindings = u, this.children = l || [], this.terminatingLREntry = null, this._flags = a ? rf.succeeded : 0;
  }
  get displayString() {
    return this.expr.toDisplayString();
  }
  clone() {
    return this.cloneWithExpr(this.expr);
  }
  cloneWithExpr(e) {
    const t = new vi(
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
    this.terminatingLREntry = new vi(
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
    function i(a, u, l) {
      let c = !0;
      r.enter && r.enter.call(t, a, u, l) === vi.prototype.SKIP && (c = !1), c && (a.children.forEach((_) => {
        i(_, a, l + 1);
      }), r.exit && r.exit.call(t, a, u, l));
    }
    this.isRootNode ? this.children.forEach((a) => {
      i(a, null, 0);
    }) : i(this, null, 0);
  }
  // Return a string representation of the trace.
  // Sample:
  //     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
  //     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
  //     12⋅+⋅2⋅*⋅3       ✗ addExp_plus
  toString() {
    const e = new ps();
    return this.walk((t, r, i) => {
      if (!t)
        return this.SKIP;
      if (t.expr.constructor.name !== "Alt") {
        if (e.append(G1(t.input, t.pos, 10) + z1(i * 2 + 1)), e.append((t.succeeded ? q1 : L1) + " " + t.displayString), t.isHeadOfLeftRecursion && e.append(" (LR)"), t.succeeded) {
          const u = iy(t.source.contents);
          e.append(" " + U1 + "  "), e.append(typeof u == "string" ? '"' + u + '"' : u);
        }
        e.append(`
`);
      }
    }), e.contents();
  }
}
vi.prototype.SKIP = {};
Object.keys(rf).forEach((n) => {
  const e = rf[n];
  Object.defineProperty(vi.prototype, n, {
    get() {
      return (this._flags & e) !== 0;
    },
    set(t) {
      t ? this._flags |= e : this._flags &= ~e;
    }
  });
});
Ge.prototype.allowsSkippingPrecedingSpace = br("allowsSkippingPrecedingSpace");
ar.allowsSkippingPrecedingSpace = or.allowsSkippingPrecedingSpace = mt.prototype.allowsSkippingPrecedingSpace = Jt.prototype.allowsSkippingPrecedingSpace = ur.prototype.allowsSkippingPrecedingSpace = Vt.prototype.allowsSkippingPrecedingSpace = function() {
  return !0;
};
Mt.prototype.allowsSkippingPrecedingSpace = _r.prototype.allowsSkippingPrecedingSpace = Or.prototype.allowsSkippingPrecedingSpace = xr.prototype.allowsSkippingPrecedingSpace = wr.prototype.allowsSkippingPrecedingSpace = lr.prototype.allowsSkippingPrecedingSpace = zt.prototype.allowsSkippingPrecedingSpace = function() {
  return !1;
};
let Sa;
ty((n) => {
  Sa = n;
});
let qo;
Ge.prototype.assertAllApplicationsAreValid = function(n, e) {
  qo = 0, this._assertAllApplicationsAreValid(n, e);
};
Ge.prototype._assertAllApplicationsAreValid = br(
  "_assertAllApplicationsAreValid"
);
ar._assertAllApplicationsAreValid = or._assertAllApplicationsAreValid = Jt.prototype._assertAllApplicationsAreValid = ur.prototype._assertAllApplicationsAreValid = lr.prototype._assertAllApplicationsAreValid = Vt.prototype._assertAllApplicationsAreValid = function(n, e) {
};
Or.prototype._assertAllApplicationsAreValid = function(n, e) {
  qo++, this.expr._assertAllApplicationsAreValid(n, e), qo--;
};
Mt.prototype._assertAllApplicationsAreValid = function(n, e) {
  for (let t = 0; t < this.terms.length; t++)
    this.terms[t]._assertAllApplicationsAreValid(n, e);
};
zt.prototype._assertAllApplicationsAreValid = function(n, e) {
  for (let t = 0; t < this.factors.length; t++)
    this.factors[t]._assertAllApplicationsAreValid(n, e);
};
_r.prototype._assertAllApplicationsAreValid = wr.prototype._assertAllApplicationsAreValid = xr.prototype._assertAllApplicationsAreValid = function(n, e) {
  this.expr._assertAllApplicationsAreValid(n, e);
};
mt.prototype._assertAllApplicationsAreValid = function(n, e, t = !1) {
  const r = e.rules[this.ruleName], i = us(n) && qo === 0;
  if (!r)
    throw Z0(this.ruleName, e.name, this.source);
  if (!t && us(this.ruleName) && !i)
    throw E1(this.ruleName, this);
  const a = this.args.length, u = r.formals.length;
  if (a !== u)
    throw _1(this.ruleName, u, a, this.source);
  const l = Sa && r === Sa.rules.applySyntactic;
  if (Sa && r === Sa.rules.caseInsensitive && !(this.args[0] instanceof Jt))
    throw Hd('a Terminal (e.g. "abc")', this.args[0]);
  if (l) {
    const _ = this.args[0];
    if (!(_ instanceof mt))
      throw Hd("a syntactic rule application", _);
    if (!us(_.ruleName))
      throw S1(_);
    if (i)
      throw A1(this);
  }
  this.args.forEach((_) => {
    if (_._assertAllApplicationsAreValid(n, e, l), _.getArity() !== 1)
      throw w1(this.ruleName, _);
  });
};
Ge.prototype.assertChoicesHaveUniformArity = br(
  "assertChoicesHaveUniformArity"
);
ar.assertChoicesHaveUniformArity = or.assertChoicesHaveUniformArity = Jt.prototype.assertChoicesHaveUniformArity = ur.prototype.assertChoicesHaveUniformArity = lr.prototype.assertChoicesHaveUniformArity = Or.prototype.assertChoicesHaveUniformArity = Vt.prototype.assertChoicesHaveUniformArity = function(n) {
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
      throw ey(n, e, i, r);
  }
};
iu.prototype.assertChoicesHaveUniformArity = function(n) {
  const e = this.terms[0].getArity(), t = this.terms[1].getArity();
  if (e !== t)
    throw ey(n, t, e, this.terms[0]);
};
zt.prototype.assertChoicesHaveUniformArity = function(n) {
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
ar.assertIteratedExprsAreNotNullable = or.assertIteratedExprsAreNotNullable = Jt.prototype.assertIteratedExprsAreNotNullable = ur.prototype.assertIteratedExprsAreNotNullable = lr.prototype.assertIteratedExprsAreNotNullable = Vt.prototype.assertIteratedExprsAreNotNullable = function(n) {
};
Mt.prototype.assertIteratedExprsAreNotNullable = function(n) {
  for (let e = 0; e < this.terms.length; e++)
    this.terms[e].assertIteratedExprsAreNotNullable(n);
};
zt.prototype.assertIteratedExprsAreNotNullable = function(n) {
  for (let e = 0; e < this.factors.length; e++)
    this.factors[e].assertIteratedExprsAreNotNullable(n);
};
_r.prototype.assertIteratedExprsAreNotNullable = function(n) {
  if (this.expr.assertIteratedExprsAreNotNullable(n), this.expr.isNullable(n))
    throw X0(this, []);
};
Bn.prototype.assertIteratedExprsAreNotNullable = wr.prototype.assertIteratedExprsAreNotNullable = xr.prototype.assertIteratedExprsAreNotNullable = Or.prototype.assertIteratedExprsAreNotNullable = function(n) {
  this.expr.assertIteratedExprsAreNotNullable(n);
};
mt.prototype.assertIteratedExprsAreNotNullable = function(n) {
  this.args.forEach((e) => {
    e.assertIteratedExprsAreNotNullable(n);
  });
};
class Hf {
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
class vs extends Hf {
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
class H1 extends Hf {
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
    return H0(this.ctorName);
  }
  isSyntactic() {
    return us(this.ctorName);
  }
}
class sy extends Hf {
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
ar.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = e.nextCodePoint();
  return r !== void 0 ? (n.pushBinding(new vs(String.fromCodePoint(r).length), t), !0) : (n.processFailure(t, this), !1);
};
or.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return e.atEnd() ? (n.pushBinding(new vs(0), t), !0) : (n.processFailure(t, this), !1);
};
Jt.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return e.matchString(this.obj) ? (n.pushBinding(new vs(this.obj.length), t), !0) : (n.processFailure(t, this), !1);
};
ur.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = this.matchCodePoint ? e.nextCodePoint() : e.nextCharCode();
  return r !== void 0 && this.from.codePointAt(0) <= r && r <= this.to.codePointAt(0) ? (n.pushBinding(new vs(String.fromCodePoint(r).length), t), !0) : (n.processFailure(t, this), !1);
};
lr.prototype.eval = function(n) {
  return n.eval(n.currentApplication().args[this.index]);
};
Or.prototype.eval = function(n) {
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
zt.prototype.eval = function(n) {
  for (let e = 0; e < this.factors.length; e++) {
    const t = this.factors[e];
    if (!n.eval(t))
      return !1;
  }
  return !0;
};
_r.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = this.getArity(), i = [], a = [];
  for (; i.length < r; )
    i.push([]), a.push([]);
  let u = 0, l = t, c;
  for (; u < this.maxNumMatches && n.eval(this.expr); ) {
    if (e.pos === l)
      throw X0(this, n._applicationStack);
    l = e.pos, u++;
    const E = n._bindings.splice(n._bindings.length - r, r), k = n._bindingOffsets.splice(
      n._bindingOffsets.length - r,
      r
    );
    for (c = 0; c < E.length; c++)
      i[c].push(E[c]), a[c].push(k[c]);
  }
  if (u < this.minNumMatches)
    return !1;
  let _ = n.posToOffset(t), m = 0;
  if (u > 0) {
    const E = i[r - 1], k = a[r - 1], D = k[k.length - 1] + E[E.length - 1].matchLength;
    _ = a[0][0], m = D - _;
  }
  const w = this instanceof Bn;
  for (c = 0; c < i.length; c++)
    n._bindings.push(
      new sy(i[c], a[c], m, w)
    ), n._bindingOffsets.push(_);
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
  const a = r.toMemoKey(), u = i.memo[a];
  if (u && i.shouldUseMemoizedResult(u)) {
    if (n.hasNecessaryInfo(u))
      return n.useMemoizedResult(n.inputStream.pos, u);
    delete i.memo[a];
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
  const { inputStream: e } = n, t = e.pos, r = n.getCurrentPosInfo(), i = n.grammar.rules[this.ruleName], { body: a } = i, { description: u } = i;
  n.enterApplication(r, this), u && n.pushFailuresInfo();
  const l = e.examinedLength;
  e.examinedLength = 0;
  let c = this.evalOnce(a, n);
  const _ = r.currentLeftRecursion, m = this.toMemoKey(), w = _ && _.headApplication.toMemoKey() === m;
  let E;
  n.doNotMemoize ? n.doNotMemoize = !1 : w ? (c = this.growSeedResult(a, n, t, _, c), r.endLeftRecursion(), E = _, E.examinedLength = e.examinedLength - t, E.rightmostFailureOffset = n._getRightmostFailureOffset(), r.memoize(m, E)) : (!_ || !_.isInvolved(m)) && (E = r.memoize(m, {
    matchLength: e.pos - t,
    examinedLength: e.examinedLength - t,
    value: c,
    failuresAtRightmostPosition: n.cloneRecordedFailures(),
    rightmostFailureOffset: n._getRightmostFailureOffset()
  }));
  const k = !!c;
  if (u && (n.popFailuresInfo(), k || n.processFailure(t, this), E && (E.failuresAtRightmostPosition = n.cloneRecordedFailures())), n.isTracing() && E) {
    const D = n.getTraceEntry(t, this, k, k ? [c] : []);
    w && (Ii(D.terminatingLREntry != null || !k), D.isHeadOfLeftRecursion = !0), E.traceEntry = D;
  }
  return e.examinedLength = Math.max(
    e.examinedLength,
    l
  ), n.exitApplication(r, c), k;
};
mt.prototype.evalOnce = function(n, e) {
  const { inputStream: t } = e, r = t.pos;
  if (e.eval(n)) {
    const i = n.getArity(), a = e._bindings.splice(e._bindings.length - i, i), u = e._bindingOffsets.splice(e._bindingOffsets.length - i, i), l = t.pos - r;
    return new H1(this.ruleName, a, u, l);
  } else
    return !1;
};
mt.prototype.growSeedResult = function(n, e, t, r, i) {
  if (!i)
    return !1;
  const { inputStream: a } = e;
  for (; ; ) {
    if (r.matchLength = a.pos - t, r.value = i, r.failuresAtRightmostPosition = e.cloneRecordedFailures(), e.isTracing()) {
      const u = e.trace[e.trace.length - 1];
      r.traceEntry = new vi(
        e.input,
        t,
        a.pos,
        this,
        !0,
        [i],
        [u.clone()]
      );
    }
    if (a.pos = t, i = this.evalOnce(n, e), a.pos - t <= r.matchLength)
      break;
    e.isTracing() && e.trace.splice(-2, 1);
  }
  return e.isTracing() && r.traceEntry.recordLRTermination(e.trace.pop(), i), a.pos = t + r.matchLength, r.value;
};
Vt.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = e.next();
  return r && this.pattern.test(r) ? (n.pushBinding(new vs(r.length), t), !0) : (n.processFailure(t, this), !1);
};
Ge.prototype.getArity = br("getArity");
ar.getArity = or.getArity = Jt.prototype.getArity = ur.prototype.getArity = lr.prototype.getArity = mt.prototype.getArity = Vt.prototype.getArity = function() {
  return 1;
};
Mt.prototype.getArity = function() {
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};
zt.prototype.getArity = function() {
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
xr.prototype.getArity = Or.prototype.getArity = function() {
  return this.expr.getArity();
};
function en(n, e) {
  const t = {};
  if (n.source && e) {
    const r = n.source.relativeTo(e);
    t.sourceInterval = [r.startIdx, r.endIdx];
  }
  return t;
}
Ge.prototype.outputRecipe = br("outputRecipe");
ar.outputRecipe = function(n, e) {
  return ["any", en(this, e)];
};
or.outputRecipe = function(n, e) {
  return ["end", en(this, e)];
};
Jt.prototype.outputRecipe = function(n, e) {
  return ["terminal", en(this, e), this.obj];
};
ur.prototype.outputRecipe = function(n, e) {
  return ["range", en(this, e), this.from, this.to];
};
lr.prototype.outputRecipe = function(n, e) {
  return ["param", en(this, e), this.index];
};
Mt.prototype.outputRecipe = function(n, e) {
  return ["alt", en(this, e)].concat(
    this.terms.map((t) => t.outputRecipe(n, e))
  );
};
iu.prototype.outputRecipe = function(n, e) {
  return this.terms[0].outputRecipe(n, e);
};
su.prototype.outputRecipe = function(n, e) {
  const t = this.terms.slice(0, this.expansionPos), r = this.terms.slice(this.expansionPos + 1);
  return [
    "splice",
    en(this, e),
    t.map((i) => i.outputRecipe(n, e)),
    r.map((i) => i.outputRecipe(n, e))
  ];
};
zt.prototype.outputRecipe = function(n, e) {
  return ["seq", en(this, e)].concat(
    this.factors.map((t) => t.outputRecipe(n, e))
  );
};
ds.prototype.outputRecipe = ca.prototype.outputRecipe = Bn.prototype.outputRecipe = wr.prototype.outputRecipe = xr.prototype.outputRecipe = Or.prototype.outputRecipe = function(n, e) {
  return [
    this.constructor.name.toLowerCase(),
    en(this, e),
    this.expr.outputRecipe(n, e)
  ];
};
mt.prototype.outputRecipe = function(n, e) {
  return [
    "app",
    en(this, e),
    this.ruleName,
    this.args.map((t) => t.outputRecipe(n, e))
  ];
};
Vt.prototype.outputRecipe = function(n, e) {
  return ["unicodeChar", en(this, e), this.category];
};
Ge.prototype.introduceParams = br("introduceParams");
ar.introduceParams = or.introduceParams = Jt.prototype.introduceParams = ur.prototype.introduceParams = lr.prototype.introduceParams = Vt.prototype.introduceParams = function(n) {
  return this;
};
Mt.prototype.introduceParams = function(n) {
  return this.terms.forEach((e, t, r) => {
    r[t] = e.introduceParams(n);
  }), this;
};
zt.prototype.introduceParams = function(n) {
  return this.factors.forEach((e, t, r) => {
    r[t] = e.introduceParams(n);
  }), this;
};
_r.prototype.introduceParams = wr.prototype.introduceParams = xr.prototype.introduceParams = Or.prototype.introduceParams = function(n) {
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
ar._isNullable = ur.prototype._isNullable = lr.prototype._isNullable = ca.prototype._isNullable = Vt.prototype._isNullable = function(n, e) {
  return !1;
};
or._isNullable = function(n, e) {
  return !0;
};
Jt.prototype._isNullable = function(n, e) {
  return typeof this.obj == "string" ? this.obj === "" : !1;
};
Mt.prototype._isNullable = function(n, e) {
  return this.terms.length === 0 || this.terms.some((t) => t._isNullable(n, e));
};
zt.prototype._isNullable = function(n, e) {
  return this.factors.every((t) => t._isNullable(n, e));
};
ds.prototype._isNullable = Bn.prototype._isNullable = wr.prototype._isNullable = xr.prototype._isNullable = function(n, e) {
  return !0;
};
Or.prototype._isNullable = function(n, e) {
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
ar.substituteParams = or.substituteParams = Jt.prototype.substituteParams = ur.prototype.substituteParams = Vt.prototype.substituteParams = function(n) {
  return this;
};
lr.prototype.substituteParams = function(n) {
  return J0(n[this.index]);
};
Mt.prototype.substituteParams = function(n) {
  return new Mt(this.terms.map((e) => e.substituteParams(n)));
};
zt.prototype.substituteParams = function(n) {
  return new zt(this.factors.map((e) => e.substituteParams(n)));
};
_r.prototype.substituteParams = wr.prototype.substituteParams = xr.prototype.substituteParams = Or.prototype.substituteParams = function(n) {
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
function Vd(n) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(n);
}
function Wf(n) {
  const e = /* @__PURE__ */ Object.create(null);
  n.forEach((t) => {
    e[t] = (e[t] || 0) + 1;
  }), Object.keys(e).forEach((t) => {
    if (e[t] <= 1)
      return;
    let r = 1;
    n.forEach((i, a) => {
      i === t && (n[a] = i + "_" + r++);
    });
  });
}
Ge.prototype.toArgumentNameList = br("toArgumentNameList");
ar.toArgumentNameList = function(n, e) {
  return ["any"];
};
or.toArgumentNameList = function(n, e) {
  return ["end"];
};
Jt.prototype.toArgumentNameList = function(n, e) {
  return typeof this.obj == "string" && /^[_a-zA-Z0-9]+$/.test(this.obj) ? ["_" + this.obj] : ["$" + n];
};
ur.prototype.toArgumentNameList = function(n, e) {
  let t = this.from + "_to_" + this.to;
  return Vd(t) || (t = "_" + t), Vd(t) || (t = "$" + n), [t];
};
Mt.prototype.toArgumentNameList = function(n, e) {
  const t = this.terms.map(
    (a) => a.toArgumentNameList(n, !0)
  ), r = [], i = t[0].length;
  for (let a = 0; a < i; a++) {
    const u = [];
    for (let c = 0; c < this.terms.length; c++)
      u.push(t[c][a]);
    const l = G0(u);
    r.push(l.join("_or_"));
  }
  return e || Wf(r), r;
};
zt.prototype.toArgumentNameList = function(n, e) {
  let t = [];
  return this.factors.forEach((r) => {
    const i = r.toArgumentNameList(n, !0);
    t = t.concat(i), n += i.length;
  }), e || Wf(t), t;
};
_r.prototype.toArgumentNameList = function(n, e) {
  const t = this.expr.toArgumentNameList(n, e).map(
    (r) => r[r.length - 1] === "s" ? r + "es" : r + "s"
  );
  return e || Wf(t), t;
};
Bn.prototype.toArgumentNameList = function(n, e) {
  return this.expr.toArgumentNameList(n, e).map((t) => "opt" + t[0].toUpperCase() + t.slice(1));
};
wr.prototype.toArgumentNameList = function(n, e) {
  return [];
};
xr.prototype.toArgumentNameList = Or.prototype.toArgumentNameList = function(n, e) {
  return this.expr.toArgumentNameList(n, e);
};
mt.prototype.toArgumentNameList = function(n, e) {
  return [this.ruleName];
};
Vt.prototype.toArgumentNameList = function(n, e) {
  return ["$" + n];
};
lr.prototype.toArgumentNameList = function(n, e) {
  return ["param" + this.index];
};
Ge.prototype.toDisplayString = br("toDisplayString");
Mt.prototype.toDisplayString = zt.prototype.toDisplayString = function() {
  return this.source ? this.source.trimmed().contents : "[" + this.constructor.name + "]";
};
ar.toDisplayString = or.toDisplayString = _r.prototype.toDisplayString = wr.prototype.toDisplayString = xr.prototype.toDisplayString = Or.prototype.toDisplayString = Jt.prototype.toDisplayString = ur.prototype.toDisplayString = lr.prototype.toDisplayString = function() {
  return this.toString();
};
mt.prototype.toDisplayString = function() {
  if (this.args.length > 0) {
    const n = this.args.map((e) => e.toDisplayString());
    return this.ruleName + "<" + n.join(",") + ">";
  } else
    return this.ruleName;
};
Vt.prototype.toDisplayString = function() {
  return "Unicode [" + this.category + "] character";
};
function W1(n) {
  return n === "description" || n === "string" || n === "code";
}
class Rr {
  constructor(e, t, r) {
    if (!W1(r))
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
    const e = new Rr(this.pexpr, this.text, this.type);
    return this.isFluffy() && e.makeFluffy(), e;
  }
  toKey() {
    return this.toString() + "#" + this.type;
  }
}
Ge.prototype.toFailure = br("toFailure");
ar.toFailure = function(n) {
  return new Rr(this, "any object", "description");
};
or.toFailure = function(n) {
  return new Rr(this, "end of input", "description");
};
Jt.prototype.toFailure = function(n) {
  return new Rr(this, this.obj, "string");
};
ur.prototype.toFailure = function(n) {
  return new Rr(this, JSON.stringify(this.from) + ".." + JSON.stringify(this.to), "code");
};
wr.prototype.toFailure = function(n) {
  const e = this.expr === ar ? "nothing" : "not " + this.expr.toFailure(n);
  return new Rr(this, e, "description");
};
xr.prototype.toFailure = function(n) {
  return this.expr.toFailure(n);
};
mt.prototype.toFailure = function(n) {
  let { description: e } = n.rules[this.ruleName];
  return e || (e = (/^[aeiouAEIOU]/.test(this.ruleName) ? "an" : "a") + " " + this.ruleName), new Rr(this, e, "description");
};
Vt.prototype.toFailure = function(n) {
  return new Rr(this, "a Unicode [" + this.category + "] character", "description");
};
Mt.prototype.toFailure = function(n) {
  const t = "(" + this.terms.map((r) => r.toFailure(n)).join(" or ") + ")";
  return new Rr(this, t, "description");
};
zt.prototype.toFailure = function(n) {
  const t = "(" + this.factors.map((r) => r.toFailure(n)).join(" ") + ")";
  return new Rr(this, t, "description");
};
_r.prototype.toFailure = function(n) {
  const e = "(" + this.expr.toFailure(n) + this.operator + ")";
  return new Rr(this, e, "description");
};
Ge.prototype.toString = br("toString");
ar.toString = function() {
  return "any";
};
or.toString = function() {
  return "end";
};
Jt.prototype.toString = function() {
  return JSON.stringify(this.obj);
};
ur.prototype.toString = function() {
  return JSON.stringify(this.from) + ".." + JSON.stringify(this.to);
};
lr.prototype.toString = function() {
  return "$" + this.index;
};
Or.prototype.toString = function() {
  return "#(" + this.expr.toString() + ")";
};
Mt.prototype.toString = function() {
  return this.terms.length === 1 ? this.terms[0].toString() : "(" + this.terms.map((n) => n.toString()).join(" | ") + ")";
};
zt.prototype.toString = function() {
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
Vt.prototype.toString = function() {
  return "\\p{" + this.category + "}";
};
class Yf extends Ge {
  constructor(e) {
    super(), this.obj = e;
  }
  _getString(e) {
    const t = e.currentApplication().args[this.obj.index];
    return Ii(t instanceof Jt, "expected a Terminal expression"), t.obj;
  }
  // Implementation of the PExpr API
  allowsSkippingPrecedingSpace() {
    return !0;
  }
  eval(e) {
    const { inputStream: t } = e, r = t.pos, i = this._getString(e);
    return t.matchString(i, !0) ? (e.pushBinding(new vs(i.length), r), !0) : (e.processFailure(r, this), !1);
  }
  getArity() {
    return 1;
  }
  substituteParams(e) {
    return new Yf(this.obj.substituteParams(e));
  }
  toDisplayString() {
    return this.obj.toDisplayString() + " (case-insensitive)";
  }
  toFailure(e) {
    return new Rr(
      this,
      this.obj.toFailure(e) + " (case-insensitive)",
      "description"
    );
  }
  _isNullable(e, t) {
    return this.obj._isNullable(e, t);
  }
}
let ay;
ty((n) => {
  ay = n.rules.applySyntactic.body;
});
const Sc = new mt("spaces");
class Y1 {
  constructor(e, t, r) {
    this.matcher = e, this.startExpr = t, this.grammar = e.grammar, this.input = e.getInput(), this.inputStream = new au(this.input), this.memoTable = e._memoTable, this.userData = void 0, this.doNotMemoize = !1, this._bindings = [], this._bindingOffsets = [], this._applicationStack = [], this._posStack = [0], this.inLexifiedContextStack = [!1], this.rightmostFailurePosition = -1, this._rightmostFailurePositionStack = [], this._recordedFailuresStack = [], r !== void 0 && (this.positionToRecordFailures = r, this.recordedFailures = /* @__PURE__ */ Object.create(null));
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
    return this.pushFailuresInfo(), this.eval(Sc), this.popBinding(), this.popFailuresInfo(), this.inputStream.pos;
  }
  skipSpacesIfInSyntacticContext() {
    return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
  }
  maybeSkipSpacesBefore(e) {
    return e.allowsSkippingPrecedingSpace() && e !== Sc ? this.skipSpacesIfInSyntacticContext() : this.inputStream.pos;
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
    return t || (t = this.memoTable[e] = new F1()), t;
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
        const a = i.traceEntry.cloneWithExpr(t);
        return a.isMemoized = !0, a;
      }
    }
    return null;
  }
  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry(e, t, r, i) {
    if (t instanceof mt) {
      const a = this.currentApplication(), u = a ? a.args : [];
      t = t.substituteParams(u);
    }
    return this.getMemoizedTraceEntry(e, t) || new vi(this.input, e, this.inputStream.pos, t, r, i, this.trace);
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
    let a;
    this.recordedFailures && (a = this.recordedFailures, this.recordedFailures = /* @__PURE__ */ Object.create(null));
    const u = t.pos, l = this.maybeSkipSpacesBefore(e);
    let c;
    this.trace && (c = this.trace, this.trace = []);
    const _ = e.eval(this);
    if (this.trace) {
      const m = this._bindings.slice(r), w = this.getTraceEntry(l, e, _, m);
      w.isImplicitSpaces = e === Sc, w.isRootNode = e === this.startExpr, c.push(w), this.trace = c;
    }
    return _ ? this.recordedFailures && t.pos === this.positionToRecordFailures && Object.keys(this.recordedFailures).forEach((m) => {
      this.recordedFailures[m].makeFluffy();
    }) : (t.pos = u, this.truncateBindings(r), this.userData = i), this.recordedFailures && this.recordFailures(a, !1), e === ay && this.skipSpaces(), _;
  }
  getMatchResult() {
    this.grammar._setUpMatchState(this), this.eval(this.startExpr);
    let e;
    this.recordedFailures && (e = Object.keys(this.recordedFailures).map(
      (r) => this.recordedFailures[r]
    ));
    const t = this._bindings[0];
    return t && (t.grammar = this.grammar), new ny(
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
class V1 {
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
    const i = this._input, a = this._memoTable;
    if (e < 0 || e > i.length || t < 0 || t > i.length || e > t)
      throw new Error("Invalid indices: " + e + " and " + t);
    this._input = i.slice(0, e) + r + i.slice(t), this._input !== i && a.length > 0 && (this._isMemoTableStale = !0);
    const u = a.slice(t);
    a.length = e;
    for (let l = 0; l < r.length; l++)
      a.push(void 0);
    for (const l of u)
      a.push(l);
    for (let l = 0; l < e; l++) {
      const c = a[l];
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
      throw m1(this.grammar);
    const i = new Y1(this, e, r.positionToRecordFailures);
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
    return new zt([r, or]);
  }
}
const Aa = [], nf = (n, e) => Object.prototype.hasOwnProperty.call(n, e);
class Jd {
  constructor(e, t, r) {
    this._node = e, this.source = t, this._baseInterval = r, e.isNonterminal() && Ii(t === r), this._childWrappers = [];
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
      const r = this._node.childAt(e), i = this._node.childOffsets[e], a = this._baseInterval.subInterval(i, r.matchLength), u = r.isNonterminal() ? a : this._baseInterval;
      t = this._childWrappers[e] = this._semantics.wrap(r, a, u);
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
    const t = e || [], r = t.map((u) => u._node), i = new sy(r, [], -1, !1), a = this._semantics.wrap(i, null, null);
    return a._childWrappers = t, a;
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
    if (this.grammar = e, this.checkedActionDicts = !1, this.Wrapper = class extends (t ? t.Wrapper : Jd) {
      constructor(i, a, u) {
        super(i, a, u), r.checkActionDictsIfHaventAlready(), this._semantics = r;
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
          value: Yd(i)
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
      let a = this.grammar;
      for (; a !== i; )
        r += ".superGrammar", a = a.superGrammar;
      r += `);
`, r += "  return g.extendSemantics(semantics)";
    } else
      r += "  return g.createSemantics()";
    return ["Operation", "Attribute"].forEach((i) => {
      const a = this[i.toLowerCase() + "s"];
      Object.keys(a).forEach((u) => {
        const { actionDict: l, formals: c, builtInDefault: _ } = a[u];
        let m = u;
        c.length > 0 && (m += "(" + c.join(", ") + ")");
        let w;
        t(this) && this.super[i.toLowerCase() + "s"][u] ? w = "extend" + i : w = "add" + i, r += `
    .` + w + "(" + JSON.stringify(m) + ", {";
        const E = [];
        Object.keys(l).forEach((k) => {
          if (l[k] !== _) {
            let D = l[k].toString().trim();
            D = D.replace(/^.*\(/, "function("), E.push(`
      ` + JSON.stringify(k) + ": " + D);
          }
        }), r += E.join(",") + `
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
    const i = e + "s", a = Zd(t, e), { name: u } = a, { formals: l } = a;
    this.assertNewName(u, e);
    const c = J1(e, u, w), _ = { _default: c };
    Object.keys(r).forEach((E) => {
      _[E] = r[E];
    });
    const m = e === "operation" ? new Da(u, l, _, c) : new sf(u, _, c);
    m.checkActionDict(this.grammar), this[i][u] = m;
    function w(...E) {
      const k = this._semantics[i][u];
      if (arguments.length !== k.formals.length)
        throw new Error(
          "Invalid number of arguments passed to " + u + " " + e + " (expected " + k.formals.length + ", got " + arguments.length + ")"
        );
      const D = /* @__PURE__ */ Object.create(null);
      for (const [M, J] of Object.entries(E)) {
        const X = k.formals[M];
        D[X] = J;
      }
      const K = this.args;
      this.args = D;
      const C = k.execute(this._semantics, this);
      return this.args = K, C;
    }
    e === "operation" ? (this.Wrapper.prototype[u] = w, this.Wrapper.prototype[u].toString = function() {
      return "[" + u + " operation]";
    }) : (Object.defineProperty(this.Wrapper.prototype, u, {
      get: w,
      configurable: !0
      // So the property can be deleted.
    }), Object.defineProperty(this.attributeKeys, u, {
      value: Yd(u)
    }));
  }
  extendOperationOrAttribute(e, t, r) {
    const i = e + "s";
    if (Zd(t, "attribute"), !(this.super && t in this.super[i]))
      throw new Error(
        "Cannot extend " + e + " '" + t + "': did not inherit an " + e + " with that name"
      );
    if (nf(this[i], t))
      throw new Error("Cannot extend " + e + " '" + t + "' again");
    const a = this[i][t].formals, u = this[i][t].actionDict, l = Object.create(u);
    Object.keys(r).forEach((c) => {
      l[c] = r[c];
    }), this[i][t] = e === "operation" ? new Da(t, a, l) : new sf(t, l), this[i][t].checkActionDict(this.grammar);
  }
  assertNewName(e, t) {
    if (nf(Jd.prototype, e))
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
function Zd(n, e) {
  if (!Ar.prototypeGrammar)
    return Ii(n.indexOf("(") === -1), {
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
function J1(n, e, t) {
  return function(...r) {
    const a = (this._semantics.operations[e] || this._semantics.attributes[e]).formals.map((u) => this.args[u]);
    if (!this.isIteration() && r.length === 1)
      return t.apply(r[0], a);
    throw T1(this.ctorName, e, n, Aa);
  };
}
Ar.createSemantics = function(n, e) {
  const t = new Ar(
    n,
    e !== void 0 ? e : Ar.BuiltInSemantics._getSemantics()
  ), r = function(a) {
    if (!(a instanceof ny))
      throw new TypeError(
        "Semantics expected a MatchResult, but got " + V0(a)
      );
    if (a.failed())
      throw new TypeError("cannot apply Semantics to " + a.toString());
    const u = a._cst;
    if (u.grammar !== n)
      throw new Error(
        "Cannot use a MatchResult from grammar '" + u.grammar.name + "' with a semantics for '" + n.name + "'"
      );
    const l = new au(a.input);
    return t.wrap(u, l.interval(a._cstOffset, a.input.length));
  };
  return r.addOperation = function(i, a) {
    return t.addOperationOrAttribute("operation", i, a), r;
  }, r.extendOperation = function(i, a) {
    return t.extendOperationOrAttribute("operation", i, a), r;
  }, r.addAttribute = function(i, a) {
    return t.addOperationOrAttribute("attribute", i, a), r;
  }, r.extendAttribute = function(i, a) {
    return t.extendOperationOrAttribute("attribute", i, a), r;
  }, r._getActionDict = function(i) {
    const a = t.operations[i] || t.attributes[i];
    if (!a)
      throw new Error(
        '"' + i + '" is not a valid operation or attribute name in this semantics for "' + n.name + '"'
      );
    return a.actionDict;
  }, r._remove = function(i) {
    let a;
    return i in t.operations ? (a = t.operations[i], delete t.operations[i]) : i in t.attributes && (a = t.attributes[i], delete t.attributes[i]), delete t.Wrapper.prototype[i], a;
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
class Da {
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
      return i ? (Aa.push([this, r]), i.apply(t, t._children())) : t.isNonterminal() && (i = this.actionDict._nonterminal, i) ? (Aa.push([this, "_nonterminal", r]), i.apply(t, t._children())) : (Aa.push([this, "default action", r]), this.actionDict._default.apply(t, t._children()));
    } finally {
      Aa.pop();
    }
  }
}
Da.prototype.typeName = "operation";
class sf extends Da {
  constructor(e, t, r) {
    super(e, [], t, r);
  }
  execute(e, t) {
    const r = t._node, i = e.attributeKeys[this.name];
    return nf(r, i) || (r[i] = Da.prototype.execute.call(this, e, t)), r[i];
  }
}
sf.prototype.typeName = "attribute";
const Qd = ["_iter", "_terminal", "_nonterminal", "_default"];
function Xd(n) {
  return Object.keys(n.rules).sort().map((e) => n.rules[e]);
}
const Z1 = (n) => n.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
let oy, uy;
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
    return new V1(this);
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
    const t = Xd(this), r = Xd(e);
    return t.length === r.length && t.every((i, a) => i.description === r[a].description && i.formals.join(",") === r[a].formals.join(",") && i.body.toString() === r[a].body.toString());
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
    for (const a in r) {
      const u = r[a];
      if (!Qd.includes(a) && !(a in this.rules)) {
        i.push(`'${a}' is not a valid semantic action for '${this.name}'`);
        continue;
      }
      if (typeof u != "function") {
        i.push(`'${a}' must be a function in an action dictionary for '${this.name}'`);
        continue;
      }
      const c = u.length, _ = this._topDownActionArity(a);
      if (c !== _) {
        let m;
        a === "_iter" || a === "_nonterminal" ? m = `it should use a rest parameter, e.g. \`${a}(...children) {}\`. NOTE: this is new in Ohm v16 — see https://ohmjs.org/d/ati for details.` : m = `expected ${_}, got ${c}`, i.push(`Semantic action '${a}' has the wrong arity: ${m}`);
      }
    }
    if (i.length > 0) {
      const a = i.map((l) => "- " + l), u = new Error(
        [
          `Found errors in the action dictionary of the '${t}' ${e}:`,
          ...a
        ].join(`
`)
      );
      throw u.problems = i, u;
    }
  }
  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity(e) {
    return Qd.includes(e) ? 0 : this.rules[e].body.getArity();
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
      const c = this.rules[l], { body: _ } = c, m = !this.superGrammar || !this.superGrammar.rules[l];
      let w;
      m ? w = "define" : w = _ instanceof iu ? "extend" : "override";
      const E = {};
      if (c.source && this.source) {
        const K = c.source.relativeTo(this.source);
        E.sourceInterval = [K.startIdx, K.endIdx];
      }
      const k = m ? c.description : null, D = _.outputRecipe(c.formals, this.source);
      i[l] = [
        w,
        // "define"/"extend"/"override"
        E,
        k,
        c.formals,
        D
      ];
    });
    let a = "null";
    e ? a = e : this.superGrammar && !this.superGrammar.isBuiltIn() && (a = this.superGrammar.toRecipe());
    const u = [
      ...["grammar", t, this.name].map(JSON.stringify),
      a,
      ...[r, i].map(JSON.stringify)
    ];
    return Z1(`[${u.join(",")}]`);
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
    const e = new ps();
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
    r.append(nu("_", i).join(", ")), r.append(`) {
`), r.append("  }");
  }
  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication(e) {
    let t;
    if (e.indexOf("<") === -1)
      t = new mt(e);
    else {
      const i = oy.match(e, "Base_application");
      t = uy(i, {});
    }
    if (!(t.ruleName in this.rules))
      throw Z0(t.ruleName, this.name);
    const { formals: r } = this.rules[t.ruleName];
    if (r.length !== t.args.length) {
      const { source: i } = this.rules[t.ruleName];
      throw Q0(
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
      body: ar,
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
      body: new Yf(new lr(0)),
      formals: ["str"],
      primitive: !0
    },
    lower: {
      body: new Vt("Ll"),
      formals: [],
      description: "a lowercase letter",
      primitive: !0
    },
    upper: {
      body: new Vt("Lu"),
      formals: [],
      description: "an uppercase letter",
      primitive: !0
    },
    // Union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
    unicodeLtmo: {
      body: new Vt("Ltmo"),
      formals: [],
      description: "a Unicode character in Lt, Lm, or Lo",
      primitive: !0
    },
    // These rules are not truly primitive (they could be written in userland) but are defined
    // here for bootstrapping purposes.
    spaces: {
      body: new ds(new mt("space")),
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
  oy = n, uy = e;
};
class ev {
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
      throw I1(e, this.superGrammar.name, t);
    return r;
  }
  installOverriddenOrExtendedRule(e, t, r, i) {
    const a = Xc(t);
    if (a.length > 0)
      throw Gd(e, a, i);
    const u = this.ensureSuperGrammar().rules[e], l = u.formals, c = l ? l.length : 0;
    if (t.length !== c)
      throw Q0(e, c, t.length, i);
    return this.install(e, t, r, u.description, i);
  }
  install(e, t, r, i, a, u = !1) {
    return this.rules[e] = {
      body: r.introduceParams(t),
      formals: t,
      description: i,
      source: a,
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
    return this.source = new au(e).interval(0, e.length), this;
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
      const { body: a } = e.rules[i];
      try {
        a.assertChoicesHaveUniformArity(i);
      } catch (u) {
        t.push(u);
      }
      try {
        a.assertAllApplicationsAreValid(i, e);
      } catch (u) {
        t.push(u), r = !0;
      }
    }), r || Object.keys(e.rules).forEach((i) => {
      const { body: a } = e.rules[i];
      try {
        a.assertIteratedExprsAreNotNullable(e, []);
      } catch (u) {
        t.push(u);
      }
    }), t.length > 0 && C1(t), this.source && (e.source = this.source), e;
  }
  // Rule declarations
  define(e, t, r, i, a, u) {
    if (this.ensureSuperGrammar(), this.superGrammar.rules[e])
      throw zd(e, this.name, this.superGrammar.name, a);
    if (this.rules[e])
      throw zd(e, this.name, this.name, a);
    const l = Xc(t);
    if (l.length > 0)
      throw Gd(e, l, a);
    return this.install(e, t, r, i, a, u);
  }
  override(e, t, r, i, a) {
    return this.ensureSuperGrammarRuleForOverriding(e, a), this.installOverriddenOrExtendedRule(e, t, r, a), this;
  }
  extend(e, t, r, i, a) {
    if (!this.ensureSuperGrammar().rules[e])
      throw b1(e, this.superGrammar.name, a);
    const l = new iu(this.superGrammar, e, r);
    return l.source = r.source, this.installOverriddenOrExtendedRule(e, t, l, a), this;
  }
}
class Mo {
  constructor() {
    this.currentDecl = null, this.currentRuleName = null;
  }
  newGrammar(e) {
    return new ev(e);
  }
  grammar(e, t, r, i, a) {
    const u = new ev(t);
    return r && u.withSuperGrammar(
      r instanceof Ir ? r : this.fromRecipe(r)
    ), i && u.withDefaultStartRule(i), e && e.source && u.withSource(e.source), this.currentDecl = u, Object.keys(a).forEach((l) => {
      this.currentRuleName = l;
      const c = a[l], _ = c[0], m = c[1], w = c[2], E = c[3], k = this.fromRecipe(c[4]);
      let D;
      u.source && m && m.sourceInterval && (D = u.source.subInterval(
        m.sourceInterval[0],
        m.sourceInterval[1] - m.sourceInterval[0]
      )), u[_](l, E, k, w, D);
    }), this.currentRuleName = this.currentDecl = null, u.build();
  }
  terminal(e) {
    return new Jt(e);
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
      r instanceof Ge || (r = this.fromRecipe(r)), r instanceof Mt ? t = t.concat(r.terms) : t.push(r);
    return t.length === 1 ? t[0] : new Mt(t);
  }
  seq(...e) {
    let t = [];
    for (let r of e)
      r instanceof Ge || (r = this.fromRecipe(r)), r instanceof zt ? t = t.concat(r.factors) : t.push(r);
    return t.length === 1 ? t[0] : new zt(t);
  }
  star(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new ds(e);
  }
  plus(e) {
    return e instanceof Ge || (e = this.fromRecipe(e)), new ca(e);
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
    return e instanceof Ge || (e = this.fromRecipe(e)), new Or(e);
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
    return new su(
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
function ou(n) {
  return typeof n == "function" ? n.call(new Mo()) : (typeof n == "string" && (n = JSON.parse(n)), new Mo().fromRecipe(n));
}
const Vf = ou(["grammar", { source: `BuiltInRules {

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
Ir.BuiltInRules = Vf;
D1(Ir.BuiltInRules);
const ly = ou(["grammar", { source: `Ohm {

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
`], ["app", { sourceInterval: [2439, 2442] }, "end", []]]]]], comment_multiLine: ["define", { sourceInterval: [2465, 2501] }, null, [], ["seq", { sourceInterval: [2465, 2487] }, ["terminal", { sourceInterval: [2465, 2469] }, "/*"], ["star", { sourceInterval: [2470, 2482] }, ["seq", { sourceInterval: [2471, 2480] }, ["not", { sourceInterval: [2471, 2476] }, ["terminal", { sourceInterval: [2472, 2476] }, "*/"]], ["app", { sourceInterval: [2477, 2480] }, "any", []]]], ["terminal", { sourceInterval: [2483, 2487] }, "*/"]]], comment: ["define", { sourceInterval: [2398, 2501] }, null, [], ["alt", { sourceInterval: [2412, 2501] }, ["app", { sourceInterval: [2412, 2443] }, "comment_singleLine", []], ["app", { sourceInterval: [2465, 2487] }, "comment_multiLine", []]]], tokens: ["define", { sourceInterval: [2505, 2520] }, null, [], ["star", { sourceInterval: [2514, 2520] }, ["app", { sourceInterval: [2514, 2519] }, "token", []]]], token: ["define", { sourceInterval: [2524, 2600] }, null, [], ["alt", { sourceInterval: [2532, 2600] }, ["app", { sourceInterval: [2532, 2540] }, "caseName", []], ["app", { sourceInterval: [2543, 2550] }, "comment", []], ["app", { sourceInterval: [2553, 2558] }, "ident", []], ["app", { sourceInterval: [2561, 2569] }, "operator", []], ["app", { sourceInterval: [2572, 2583] }, "punctuation", []], ["app", { sourceInterval: [2586, 2594] }, "terminal", []], ["app", { sourceInterval: [2597, 2600] }, "any", []]]], operator: ["define", { sourceInterval: [2604, 2669] }, null, [], ["alt", { sourceInterval: [2615, 2669] }, ["terminal", { sourceInterval: [2615, 2619] }, "<:"], ["terminal", { sourceInterval: [2622, 2625] }, "="], ["terminal", { sourceInterval: [2628, 2632] }, ":="], ["terminal", { sourceInterval: [2635, 2639] }, "+="], ["terminal", { sourceInterval: [2642, 2645] }, "*"], ["terminal", { sourceInterval: [2648, 2651] }, "+"], ["terminal", { sourceInterval: [2654, 2657] }, "?"], ["terminal", { sourceInterval: [2660, 2663] }, "~"], ["terminal", { sourceInterval: [2666, 2669] }, "&"]]], punctuation: ["define", { sourceInterval: [2673, 2709] }, null, [], ["alt", { sourceInterval: [2687, 2709] }, ["terminal", { sourceInterval: [2687, 2690] }, "<"], ["terminal", { sourceInterval: [2693, 2696] }, ">"], ["terminal", { sourceInterval: [2699, 2702] }, ","], ["terminal", { sourceInterval: [2705, 2709] }, "--"]]] }]), Ac = Object.create(Ge.prototype);
function tv(n, e) {
  for (const t in n)
    if (t === e) return !0;
  return !1;
}
function Q1(n, e, t) {
  const r = new Mo();
  let i, a, u, l = !1;
  return (t || ly).createSemantics().addOperation("visit", {
    Grammars(m) {
      return m.children.map((w) => w.visit());
    },
    Grammar(m, w, E, k, D) {
      const K = m.visit();
      i = r.newGrammar(K), w.child(0) && w.child(0).visit(), k.children.map((M) => M.visit());
      const C = i.build();
      if (C.source = this.source.trimmed(), tv(e, K))
        throw g1(C);
      return e[K] = C, C;
    },
    SuperGrammar(m, w) {
      const E = w.visit();
      if (E === "null")
        i.withSuperGrammar(null);
      else {
        if (!e || !tv(e, E))
          throw y1(E, e, w.source);
        i.withSuperGrammar(e[E]);
      }
    },
    Rule_define(m, w, E, k, D) {
      a = m.visit(), u = w.children.map((J) => J.visit())[0] || [], !i.defaultStartRule && i.ensureSuperGrammar() !== Ir.ProtoBuiltInRules && i.withDefaultStartRule(a);
      const K = D.visit(), C = E.children.map((J) => J.visit())[0], M = this.source.trimmed();
      return i.define(a, u, K, C, M);
    },
    Rule_override(m, w, E, k) {
      a = m.visit(), u = w.children.map((C) => C.visit())[0] || [];
      const D = this.source.trimmed();
      i.ensureSuperGrammarRuleForOverriding(a, D), l = !0;
      const K = k.visit();
      return l = !1, i.override(a, u, K, null, D);
    },
    Rule_extend(m, w, E, k) {
      a = m.visit(), u = w.children.map((C) => C.visit())[0] || [];
      const D = k.visit(), K = this.source.trimmed();
      return i.extend(a, u, D, null, K);
    },
    RuleBody(m, w) {
      return r.alt(...w.visit()).withSource(this.source);
    },
    OverrideRuleBody(m, w) {
      const E = w.visit(), k = E.indexOf(Ac);
      if (k >= 0) {
        const D = E.slice(0, k), K = E.slice(k + 1);
        return K.forEach((C) => {
          if (C === Ac) throw k1(C);
        }), new su(
          i.superGrammar,
          a,
          D,
          K
        ).withSource(this.source);
      } else
        return r.alt(...E).withSource(this.source);
    },
    Formals(m, w, E) {
      return w.visit();
    },
    Params(m, w, E) {
      return w.visit();
    },
    Alt(m) {
      return r.alt(...m.visit()).withSource(this.source);
    },
    TopLevelTerm_inline(m, w) {
      const E = a + "_" + w.visit(), k = m.visit(), D = this.source.trimmed(), K = !(i.superGrammar && i.superGrammar.rules[E]);
      l && !K ? i.override(E, u, k, null, D) : i.define(E, u, k, null, D);
      const C = u.map((M) => r.app(M));
      return r.app(E, C).withSource(k.source);
    },
    OverrideTopLevelTerm_superSplice(m) {
      return Ac;
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
      const E = w.children.map((k) => k.visit())[0] || [];
      return r.app(m.visit(), E).withSource(this.source);
    },
    Base_range(m, w, E) {
      return r.range(m.visit(), E.visit()).withSource(this.source);
    },
    Base_terminal(m) {
      return r.terminal(m.visit()).withSource(this.source);
    },
    Base_paren(m, w, E) {
      return w.visit();
    },
    ruleDescr(m, w, E) {
      return w.visit();
    },
    ruleDescrText(m) {
      return this.sourceString.trim();
    },
    caseName(m, w, E, k, D) {
      return E.visit();
    },
    name(m, w) {
      return this.sourceString;
    },
    nameFirst(m) {
    },
    nameRest(m) {
    },
    terminal(m, w, E) {
      return w.children.map((k) => k.visit()).join("");
    },
    oneCharTerminal(m, w, E) {
      return w.visit();
    },
    escapeChar(m) {
      try {
        return Y0(this.sourceString);
      } catch (w) {
        throw w instanceof RangeError && w.message.startsWith("Invalid code point ") ? O1(m) : w;
      }
    },
    NonemptyListOf(m, w, E) {
      return [m.visit()].concat(E.children.map((k) => k.visit()));
    },
    EmptyListOf() {
      return [];
    },
    _terminal() {
      return this.sourceString;
    }
  })(n).visit();
}
const X1 = ou(["grammar", { source: `OperationsAndAttributes {

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
eI(Ir.BuiltInRules);
tI(X1);
function eI(n) {
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
function tI(n) {
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
function rI(n) {
  let e = 0;
  const t = [0], r = () => t[t.length - 1], i = {}, a = /( *).*(?:$|\r?\n|\r)/g;
  let u;
  for (; (u = a.exec(n)) != null; ) {
    const [l, c] = u;
    if (l.length === 0) break;
    const _ = c.length, m = r(), w = e + _;
    if (_ > m)
      t.push(_), i[w] = 1;
    else if (_ < m) {
      const E = t.length;
      for (; r() !== _; )
        t.pop();
      i[w] = -1 * (E - t.length);
    }
    e += l.length;
  }
  return t.length > 1 && (i[e] = 1 - t.length), i;
}
const cy = "an indented block", fy = "a dedent", rv = 1114112;
class nI extends au {
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
    return this._indentationAt(this.pos) !== 0 ? (this.examinedLength = Math.max(this.examinedLength, this.pos), rv) : super.nextCharCode();
  }
  nextCodePoint() {
    return this._indentationAt(this.pos) !== 0 ? (this.examinedLength = Math.max(this.examinedLength, this.pos), rv) : super.nextCodePoint();
  }
}
class nv extends Ge {
  constructor(e = !0) {
    super(), this.isIndent = e;
  }
  allowsSkippingPrecedingSpace() {
    return !0;
  }
  eval(e) {
    const { inputStream: t } = e, r = e.userData;
    e.doNotMemoize = !0;
    const i = t.pos, a = this.isIndent ? 1 : -1;
    return (r[i] || 0) * a > 0 ? (e.userData = Object.create(r), e.userData[i] -= a, e.pushBinding(new vs(0), i), !0) : (e.processFailure(i, this), !1);
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
    const t = this.isIndent ? cy : fy;
    return new Rr(this, t, "description");
  }
}
const iI = new mt("indent"), sI = new mt("dedent"), aI = new su(Vf, "any", [iI, sI], []), oI = new Mo().newGrammar("IndentationSensitive").withSuperGrammar(Vf).define("indent", [], new nv(!0), cy, void 0, !0).define("dedent", [], new nv(!1), fy, void 0, !0).extend("any", [], aI, "any character", void 0).build();
Object.assign(oI, {
  _matchStateInitializer(n) {
    n.userData = rI(n.input), n.inputStream = new nI(n);
  },
  supportsIncrementalParsing: !1
});
Ir.initApplicationParser(ly, Q1);
const hy = ou(["grammar", { source: `N1QL {

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
}` }, "N1QL", null, "SelectStatement", { SelectStatement: ["define", { sourceInterval: [28, 244] }, null, [], ["seq", { sourceInterval: [54, 244] }, ["app", { sourceInterval: [54, 61] }, "kSELECT", []], ["opt", { sourceInterval: [62, 81] }, ["alt", { sourceInterval: [63, 79] }, ["app", { sourceInterval: [63, 72] }, "kDISTINCT", []], ["app", { sourceInterval: [75, 79] }, "kALL", []]]], ["app", { sourceInterval: [92, 105] }, "SelectResults", []], ["opt", { sourceInterval: [116, 127] }, ["app", { sourceInterval: [116, 126] }, "FromClause", []]], ["opt", { sourceInterval: [138, 158] }, ["seq", { sourceInterval: [139, 156] }, ["app", { sourceInterval: [139, 145] }, "kWHERE", []], ["app", { sourceInterval: [146, 156] }, "Expression", []]]], ["opt", { sourceInterval: [169, 187] }, ["seq", { sourceInterval: [170, 185] }, ["app", { sourceInterval: [170, 177] }, "GroupBy", []], ["opt", { sourceInterval: [178, 185] }, ["app", { sourceInterval: [178, 184] }, "Having", []]]]], ["opt", { sourceInterval: [198, 206] }, ["app", { sourceInterval: [198, 205] }, "OrderBy", []]], ["opt", { sourceInterval: [217, 229] }, ["app", { sourceInterval: [217, 228] }, "LimitOffset", []]], ["opt", { sourceInterval: [240, 244] }, ["terminal", { sourceInterval: [240, 243] }, ";"]]]], SelectResults: ["define", { sourceInterval: [250, 307] }, null, [], ["app", { sourceInterval: [274, 307] }, "NonemptyListOf", [["app", { sourceInterval: [289, 301] }, "SelectResult", []], ["terminal", { sourceInterval: [303, 306] }, ","]]]], SelectResult: ["define", { sourceInterval: [313, 366] }, null, [], ["seq", { sourceInterval: [336, 366] }, ["app", { sourceInterval: [336, 346] }, "Expression", []], ["opt", { sourceInterval: [347, 366] }, ["seq", { sourceInterval: [348, 364] }, ["opt", { sourceInterval: [348, 352] }, ["app", { sourceInterval: [348, 351] }, "kAS", []]], ["app", { sourceInterval: [353, 364] }, "columnAlias", []]]]]], GroupBy: ["define", { sourceInterval: [372, 452] }, "a GROUP BY clause", [], ["seq", { sourceInterval: [410, 452] }, ["app", { sourceInterval: [410, 416] }, "kGROUP", []], ["app", { sourceInterval: [417, 420] }, "kBY", []], ["app", { sourceInterval: [421, 452] }, "NonemptyListOf", [["app", { sourceInterval: [436, 446] }, "Expression", []], ["terminal", { sourceInterval: [448, 451] }, ","]]]]], Having: ["define", { sourceInterval: [458, 511] }, "a HAVING clause", [], ["seq", { sourceInterval: [493, 511] }, ["app", { sourceInterval: [493, 500] }, "kHAVING", []], ["app", { sourceInterval: [501, 511] }, "Expression", []]]], OrderBy: ["define", { sourceInterval: [517, 596] }, "an ORDER BY clause", [], ["seq", { sourceInterval: [556, 596] }, ["app", { sourceInterval: [556, 562] }, "kORDER", []], ["app", { sourceInterval: [563, 566] }, "kBY", []], ["app", { sourceInterval: [567, 596] }, "NonemptyListOf", [["app", { sourceInterval: [582, 590] }, "Ordering", []], ["terminal", { sourceInterval: [592, 595] }, ","]]]]], Ordering: ["define", { sourceInterval: [602, 647] }, null, [], ["seq", { sourceInterval: [621, 647] }, ["app", { sourceInterval: [621, 631] }, "Expression", []], ["opt", { sourceInterval: [632, 647] }, ["alt", { sourceInterval: [633, 645] }, ["app", { sourceInterval: [633, 637] }, "kASC", []], ["app", { sourceInterval: [640, 645] }, "kDESC", []]]]]], LimitOffset_limitFirst: ["define", { sourceInterval: [702, 756] }, null, [], ["seq", { sourceInterval: [702, 741] }, ["app", { sourceInterval: [702, 708] }, "kLIMIT", []], ["app", { sourceInterval: [709, 719] }, "Expression", []], ["opt", { sourceInterval: [720, 741] }, ["seq", { sourceInterval: [721, 739] }, ["app", { sourceInterval: [721, 728] }, "kOFFSET", []], ["app", { sourceInterval: [729, 739] }, "Expression", []]]]]], LimitOffset_offsetFirst: ["define", { sourceInterval: [767, 822] }, null, [], ["seq", { sourceInterval: [767, 806] }, ["app", { sourceInterval: [767, 774] }, "kOFFSET", []], ["app", { sourceInterval: [775, 785] }, "Expression", []], ["opt", { sourceInterval: [786, 806] }, ["seq", { sourceInterval: [787, 804] }, ["app", { sourceInterval: [787, 793] }, "kLIMIT", []], ["app", { sourceInterval: [794, 804] }, "Expression", []]]]]], LimitOffset: ["define", { sourceInterval: [653, 822] }, "a LIMIT or OFFSET clause", [], ["alt", { sourceInterval: [702, 822] }, ["app", { sourceInterval: [702, 741] }, "LimitOffset_limitFirst", []], ["app", { sourceInterval: [767, 806] }, "LimitOffset_offsetFirst", []]]], FromClause: ["define", { sourceInterval: [857, 930] }, "a FROM clause", [], ["seq", { sourceInterval: [894, 930] }, ["app", { sourceInterval: [894, 899] }, "kFROM", []], ["app", { sourceInterval: [900, 916] }, "CollectionSource", []], ["star", { sourceInterval: [917, 930] }, ["app", { sourceInterval: [917, 929] }, "JoinOrUnnest", []]]]], CollectionSource: ["define", { sourceInterval: [936, 1026] }, "a collection name", [], ["seq", { sourceInterval: [984, 1026] }, ["app", { sourceInterval: [984, 989] }, "ident", []], ["opt", { sourceInterval: [990, 1002] }, ["seq", { sourceInterval: [991, 1e3] }, ["terminal", { sourceInterval: [991, 994] }, "."], ["app", { sourceInterval: [995, 1e3] }, "ident", []]]], ["opt", { sourceInterval: [1003, 1026] }, ["seq", { sourceInterval: [1004, 1024] }, ["opt", { sourceInterval: [1004, 1008] }, ["app", { sourceInterval: [1004, 1007] }, "kAS", []]], ["app", { sourceInterval: [1009, 1024] }, "collectionAlias", []]]]]], JoinOrUnnest: ["define", { sourceInterval: [1032, 1060] }, null, [], ["alt", { sourceInterval: [1047, 1060] }, ["app", { sourceInterval: [1047, 1051] }, "Join", []], ["app", { sourceInterval: [1054, 1060] }, "Unnest", []]]], Join: ["define", { sourceInterval: [1066, 1144] }, "a JOIN clause", [], ["seq", { sourceInterval: [1097, 1144] }, ["opt", { sourceInterval: [1097, 1106] }, ["app", { sourceInterval: [1097, 1105] }, "JoinType", []]], ["app", { sourceInterval: [1107, 1112] }, "kJOIN", []], ["app", { sourceInterval: [1113, 1129] }, "CollectionSource", []], ["app", { sourceInterval: [1130, 1133] }, "kON", []], ["app", { sourceInterval: [1134, 1144] }, "Expression", []]]], JoinType_inner: ["define", { sourceInterval: [1183, 1207] }, null, [], ["app", { sourceInterval: [1183, 1189] }, "kINNER", []]], JoinType_outer: ["define", { sourceInterval: [1218, 1242] }, null, [], ["seq", { sourceInterval: [1218, 1232] }, ["opt", { sourceInterval: [1218, 1225] }, ["app", { sourceInterval: [1218, 1224] }, "kRIGHT", []]], ["app", { sourceInterval: [1226, 1232] }, "kOUTER", []]]], JoinType_left: ["define", { sourceInterval: [1253, 1276] }, null, [], ["seq", { sourceInterval: [1253, 1266] }, ["app", { sourceInterval: [1253, 1258] }, "kLEFT", []], ["opt", { sourceInterval: [1259, 1266] }, ["app", { sourceInterval: [1259, 1265] }, "kOUTER", []]]]], JoinType_cross: ["define", { sourceInterval: [1287, 1311] }, null, [], ["app", { sourceInterval: [1287, 1293] }, "kCROSS", []]], JoinType: ["define", { sourceInterval: [1150, 1311] }, "a JOIN type", [], ["alt", { sourceInterval: [1183, 1311] }, ["app", { sourceInterval: [1183, 1189] }, "JoinType_inner", []], ["app", { sourceInterval: [1218, 1232] }, "JoinType_outer", []], ["app", { sourceInterval: [1253, 1266] }, "JoinType_left", []], ["app", { sourceInterval: [1287, 1293] }, "JoinType_cross", []]]], Unnest: ["define", { sourceInterval: [1317, 1391] }, "an UNNEST clause", [], ["seq", { sourceInterval: [1353, 1391] }, ["app", { sourceInterval: [1353, 1360] }, "kUNNEST", []], ["app", { sourceInterval: [1361, 1371] }, "Expression", []], ["opt", { sourceInterval: [1372, 1391] }, ["seq", { sourceInterval: [1373, 1389] }, ["opt", { sourceInterval: [1373, 1377] }, ["app", { sourceInterval: [1373, 1376] }, "kAS", []]], ["app", { sourceInterval: [1378, 1389] }, "columnAlias", []]]]]], Expression: ["define", { sourceInterval: [1450, 1492] }, "an expression", [], ["app", { sourceInterval: [1487, 1492] }, "OrExp", []]], OrExp_or: ["define", { sourceInterval: [1514, 1539] }, null, [], ["seq", { sourceInterval: [1514, 1530] }, ["app", { sourceInterval: [1514, 1519] }, "OrExp", []], ["app", { sourceInterval: [1520, 1523] }, "kOR", []], ["app", { sourceInterval: [1524, 1530] }, "AndExp", []]]], OrExp: ["define", { sourceInterval: [1498, 1556] }, null, [], ["alt", { sourceInterval: [1514, 1556] }, ["app", { sourceInterval: [1514, 1530] }, "OrExp_or", []], ["app", { sourceInterval: [1550, 1556] }, "AndExp", []]]], AndExp_and: ["define", { sourceInterval: [1579, 1606] }, null, [], ["seq", { sourceInterval: [1579, 1596] }, ["app", { sourceInterval: [1579, 1585] }, "AndExp", []], ["app", { sourceInterval: [1586, 1590] }, "kAND", []], ["app", { sourceInterval: [1591, 1596] }, "EqExp", []]]], AndExp: ["define", { sourceInterval: [1562, 1622] }, null, [], ["alt", { sourceInterval: [1579, 1622] }, ["app", { sourceInterval: [1579, 1596] }, "AndExp_and", []], ["app", { sourceInterval: [1617, 1622] }, "EqExp", []]]], EqExp_eq: ["define", { sourceInterval: [1644, 1691] }, null, [], ["seq", { sourceInterval: [1644, 1669] }, ["app", { sourceInterval: [1644, 1649] }, "EqExp", []], ["alt", { sourceInterval: [1651, 1661] }, ["terminal", { sourceInterval: [1651, 1655] }, "=="], ["terminal", { sourceInterval: [1658, 1661] }, "="]], ["app", { sourceInterval: [1663, 1669] }, "RelExp", []]]], EqExp_neq: ["define", { sourceInterval: [1702, 1750] }, null, [], ["seq", { sourceInterval: [1702, 1728] }, ["app", { sourceInterval: [1702, 1707] }, "EqExp", []], ["alt", { sourceInterval: [1709, 1720] }, ["terminal", { sourceInterval: [1709, 1713] }, "<>"], ["terminal", { sourceInterval: [1716, 1720] }, "!="]], ["app", { sourceInterval: [1722, 1728] }, "RelExp", []]]], EqExp_isValued: ["define", { sourceInterval: [1761, 1814] }, null, [], ["seq", { sourceInterval: [1761, 1784] }, ["app", { sourceInterval: [1761, 1766] }, "EqExp", []], ["app", { sourceInterval: [1767, 1770] }, "kIS", []], ["opt", { sourceInterval: [1771, 1776] }, ["app", { sourceInterval: [1771, 1775] }, "kNOT", []]], ["app", { sourceInterval: [1777, 1784] }, "kVALUED", []]]], EqExp_isNot: ["define", { sourceInterval: [1825, 1875] }, null, [], ["seq", { sourceInterval: [1825, 1846] }, ["app", { sourceInterval: [1825, 1830] }, "EqExp", []], ["app", { sourceInterval: [1831, 1834] }, "kIS", []], ["app", { sourceInterval: [1835, 1839] }, "kNOT", []], ["app", { sourceInterval: [1840, 1846] }, "RelExp", []]]], EqExp_is: ["define", { sourceInterval: [1886, 1933] }, null, [], ["seq", { sourceInterval: [1886, 1902] }, ["app", { sourceInterval: [1886, 1891] }, "EqExp", []], ["app", { sourceInterval: [1892, 1895] }, "kIS", []], ["app", { sourceInterval: [1896, 1902] }, "RelExp", []]]], EqExp_like: ["define", { sourceInterval: [1944, 1984] }, null, [], ["seq", { sourceInterval: [1944, 1962] }, ["app", { sourceInterval: [1944, 1949] }, "EqExp", []], ["app", { sourceInterval: [1950, 1955] }, "kLIKE", []], ["app", { sourceInterval: [1956, 1962] }, "RelExp", []]]], EqExp_notNull: ["define", { sourceInterval: [1995, 2047] }, null, [], ["seq", { sourceInterval: [1995, 2011] }, ["app", { sourceInterval: [1995, 2e3] }, "EqExp", []], ["app", { sourceInterval: [2001, 2005] }, "kNOT", []], ["app", { sourceInterval: [2006, 2011] }, "kNULL", []]]], EqExp_inArray: ["define", { sourceInterval: [2155, 2207] }, null, [], ["seq", { sourceInterval: [2155, 2181] }, ["app", { sourceInterval: [2155, 2160] }, "EqExp", []], ["app", { sourceInterval: [2161, 2168] }, "InOrNot", []], ["app", { sourceInterval: [2169, 2181] }, "ArrayLiteral", []]]], EqExp_inExpr: ["define", { sourceInterval: [2218, 2269] }, null, [], ["seq", { sourceInterval: [2218, 2238] }, ["app", { sourceInterval: [2218, 2223] }, "EqExp", []], ["app", { sourceInterval: [2224, 2231] }, "InOrNot", []], ["app", { sourceInterval: [2232, 2238] }, "RelExp", []]]], EqExp_between: ["define", { sourceInterval: [2280, 2332] }, null, [], ["seq", { sourceInterval: [2280, 2319] }, ["app", { sourceInterval: [2280, 2285] }, "EqExp", []], ["opt", { sourceInterval: [2286, 2291] }, ["app", { sourceInterval: [2286, 2290] }, "kNOT", []]], ["app", { sourceInterval: [2292, 2300] }, "kBETWEEN", []], ["app", { sourceInterval: [2301, 2307] }, "RelExp", []], ["app", { sourceInterval: [2308, 2312] }, "kAND", []], ["app", { sourceInterval: [2313, 2319] }, "RelExp", []]]], EqExp: ["define", { sourceInterval: [1628, 2349] }, null, [], ["alt", { sourceInterval: [1644, 2349] }, ["app", { sourceInterval: [1644, 1669] }, "EqExp_eq", []], ["app", { sourceInterval: [1702, 1728] }, "EqExp_neq", []], ["app", { sourceInterval: [1761, 1784] }, "EqExp_isValued", []], ["app", { sourceInterval: [1825, 1846] }, "EqExp_isNot", []], ["app", { sourceInterval: [1886, 1902] }, "EqExp_is", []], ["app", { sourceInterval: [1944, 1962] }, "EqExp_like", []], ["app", { sourceInterval: [1995, 2011] }, "EqExp_notNull", []], ["app", { sourceInterval: [2155, 2181] }, "EqExp_inArray", []], ["app", { sourceInterval: [2218, 2238] }, "EqExp_inExpr", []], ["app", { sourceInterval: [2280, 2319] }, "EqExp_between", []], ["app", { sourceInterval: [2343, 2349] }, "RelExp", []]]], RelExp_rel: ["define", { sourceInterval: [2372, 2418] }, null, [], ["seq", { sourceInterval: [2372, 2411] }, ["app", { sourceInterval: [2372, 2378] }, "RelExp", []], ["alt", { sourceInterval: [2380, 2403] }, ["terminal", { sourceInterval: [2380, 2384] }, "<="], ["terminal", { sourceInterval: [2387, 2390] }, "<"], ["terminal", { sourceInterval: [2393, 2397] }, ">="], ["terminal", { sourceInterval: [2400, 2403] }, ">"]], ["app", { sourceInterval: [2405, 2411] }, "BitExp", []]]], RelExp: ["define", { sourceInterval: [2355, 2435] }, null, [], ["alt", { sourceInterval: [2372, 2435] }, ["app", { sourceInterval: [2372, 2411] }, "RelExp_rel", []], ["app", { sourceInterval: [2429, 2435] }, "BitExp", []]]], BitExp_bit: ["define", { sourceInterval: [2458, 2504] }, null, [], ["seq", { sourceInterval: [2458, 2497] }, ["app", { sourceInterval: [2458, 2464] }, "BitExp", []], ["alt", { sourceInterval: [2466, 2489] }, ["terminal", { sourceInterval: [2466, 2470] }, "<<"], ["terminal", { sourceInterval: [2473, 2477] }, ">>"], ["terminal", { sourceInterval: [2480, 2483] }, "&"], ["terminal", { sourceInterval: [2486, 2489] }, "|"]], ["app", { sourceInterval: [2491, 2497] }, "AddExp", []]]], BitExp: ["define", { sourceInterval: [2441, 2521] }, null, [], ["alt", { sourceInterval: [2458, 2521] }, ["app", { sourceInterval: [2458, 2497] }, "BitExp_bit", []], ["app", { sourceInterval: [2515, 2521] }, "AddExp", []]]], AddExp_plus: ["define", { sourceInterval: [2544, 2571] }, null, [], ["seq", { sourceInterval: [2544, 2561] }, ["app", { sourceInterval: [2544, 2550] }, "AddExp", []], ["terminal", { sourceInterval: [2551, 2554] }, "+"], ["app", { sourceInterval: [2555, 2561] }, "MulExp", []]]], AddExp_minus: ["define", { sourceInterval: [2582, 2610] }, null, [], ["seq", { sourceInterval: [2582, 2599] }, ["app", { sourceInterval: [2582, 2588] }, "AddExp", []], ["terminal", { sourceInterval: [2589, 2592] }, "-"], ["app", { sourceInterval: [2593, 2599] }, "MulExp", []]]], AddExp: ["define", { sourceInterval: [2527, 2627] }, null, [], ["alt", { sourceInterval: [2544, 2627] }, ["app", { sourceInterval: [2544, 2561] }, "AddExp_plus", []], ["app", { sourceInterval: [2582, 2599] }, "AddExp_minus", []], ["app", { sourceInterval: [2621, 2627] }, "MulExp", []]]], MulExp_times: ["define", { sourceInterval: [2650, 2680] }, null, [], ["seq", { sourceInterval: [2650, 2670] }, ["app", { sourceInterval: [2650, 2656] }, "MulExp", []], ["terminal", { sourceInterval: [2657, 2660] }, "*"], ["app", { sourceInterval: [2661, 2670] }, "ConcatExp", []]]], MulExp_divide: ["define", { sourceInterval: [2691, 2722] }, null, [], ["seq", { sourceInterval: [2691, 2711] }, ["app", { sourceInterval: [2691, 2697] }, "MulExp", []], ["terminal", { sourceInterval: [2698, 2701] }, "/"], ["app", { sourceInterval: [2702, 2711] }, "ConcatExp", []]]], MulExp_modulo: ["define", { sourceInterval: [2733, 2763] }, null, [], ["seq", { sourceInterval: [2733, 2753] }, ["app", { sourceInterval: [2733, 2739] }, "MulExp", []], ["terminal", { sourceInterval: [2740, 2743] }, "%"], ["app", { sourceInterval: [2744, 2753] }, "ConcatExp", []]]], MulExp: ["define", { sourceInterval: [2633, 2783] }, null, [], ["alt", { sourceInterval: [2650, 2783] }, ["app", { sourceInterval: [2650, 2670] }, "MulExp_times", []], ["app", { sourceInterval: [2691, 2711] }, "MulExp_divide", []], ["app", { sourceInterval: [2733, 2753] }, "MulExp_modulo", []], ["app", { sourceInterval: [2774, 2783] }, "ConcatExp", []]]], ConcatExp_concat: ["define", { sourceInterval: [2809, 2844] }, null, [], ["seq", { sourceInterval: [2809, 2834] }, ["app", { sourceInterval: [2809, 2819] }, "PrimaryExp", []], ["terminal", { sourceInterval: [2820, 2824] }, "||"], ["app", { sourceInterval: [2825, 2834] }, "ConcatExp", []]]], ConcatExp: ["define", { sourceInterval: [2789, 2865] }, null, [], ["alt", { sourceInterval: [2809, 2865] }, ["app", { sourceInterval: [2809, 2834] }, "ConcatExp_concat", []], ["app", { sourceInterval: [2855, 2865] }, "PrimaryExp", []]]], AnyEveryExp: ["define", { sourceInterval: [2871, 2956] }, null, [], ["seq", { sourceInterval: [2893, 2956] }, ["app", { sourceInterval: [2893, 2901] }, "AnyEvery", []], ["app", { sourceInterval: [2902, 2914] }, "variableName", []], ["app", { sourceInterval: [2915, 2918] }, "kIN", []], ["app", { sourceInterval: [2919, 2929] }, "Expression", []], ["app", { sourceInterval: [2930, 2940] }, "kSATISFIES", []], ["app", { sourceInterval: [2941, 2951] }, "Expression", []], ["app", { sourceInterval: [2952, 2956] }, "kEND", []]]], AnyEvery_anyEvery: ["define", { sourceInterval: [2980, 3016] }, null, [], ["seq", { sourceInterval: [2980, 3001] }, ["app", { sourceInterval: [2980, 2989] }, "AnyOrSome", []], ["app", { sourceInterval: [2990, 2994] }, "kAND", []], ["app", { sourceInterval: [2995, 3001] }, "kEVERY", []]]], AnyEvery_any: ["define", { sourceInterval: [3027, 3058] }, null, [], ["app", { sourceInterval: [3027, 3036] }, "AnyOrSome", []]], AnyEvery_every: ["define", { sourceInterval: [3069, 3102] }, null, [], ["app", { sourceInterval: [3069, 3075] }, "kEVERY", []]], AnyEvery: ["define", { sourceInterval: [2961, 3102] }, null, [], ["alt", { sourceInterval: [2980, 3102] }, ["app", { sourceInterval: [2980, 3001] }, "AnyEvery_anyEvery", []], ["app", { sourceInterval: [3027, 3036] }, "AnyEvery_any", []], ["app", { sourceInterval: [3069, 3075] }, "AnyEvery_every", []]]], AnyOrSome: ["define", { sourceInterval: [3107, 3131] }, null, [], ["alt", { sourceInterval: [3119, 3131] }, ["app", { sourceInterval: [3119, 3123] }, "kANY", []], ["app", { sourceInterval: [3126, 3131] }, "kSOME", []]]], CaseExp: ["define", { sourceInterval: [3137, 3246] }, null, [], ["seq", { sourceInterval: [3155, 3246] }, ["app", { sourceInterval: [3155, 3160] }, "kCASE", []], ["opt", { sourceInterval: [3161, 3181] }, ["seq", { sourceInterval: [3162, 3179] }, ["not", { sourceInterval: [3162, 3168] }, ["app", { sourceInterval: [3163, 3168] }, "kWHEN", []]], ["app", { sourceInterval: [3169, 3179] }, "Expression", []]]], ["plus", { sourceInterval: [3192, 3201] }, ["app", { sourceInterval: [3192, 3200] }, "WhenThen", []]], ["opt", { sourceInterval: [3212, 3231] }, ["seq", { sourceInterval: [3213, 3229] }, ["app", { sourceInterval: [3213, 3218] }, "kELSE", []], ["app", { sourceInterval: [3219, 3229] }, "Expression", []]]], ["app", { sourceInterval: [3242, 3246] }, "kEND", []]]], WhenThen: ["define", { sourceInterval: [3251, 3303] }, null, [], ["seq", { sourceInterval: [3270, 3303] }, ["app", { sourceInterval: [3270, 3275] }, "kWHEN", []], ["app", { sourceInterval: [3276, 3286] }, "Expression", []], ["app", { sourceInterval: [3287, 3292] }, "kTHEN", []], ["app", { sourceInterval: [3293, 3303] }, "Expression", []]]], PrimaryExp_paren: ["define", { sourceInterval: [3330, 3371] }, null, [], ["seq", { sourceInterval: [3330, 3348] }, ["terminal", { sourceInterval: [3330, 3333] }, "("], ["app", { sourceInterval: [3334, 3344] }, "Expression", []], ["terminal", { sourceInterval: [3345, 3348] }, ")"]]], PrimaryExp_pos: ["define", { sourceInterval: [3382, 3419] }, null, [], ["seq", { sourceInterval: [3382, 3396] }, ["terminal", { sourceInterval: [3382, 3385] }, "+"], ["app", { sourceInterval: [3386, 3396] }, "PrimaryExp", []]]], PrimaryExp_neg: ["define", { sourceInterval: [3430, 3467] }, null, [], ["seq", { sourceInterval: [3430, 3444] }, ["terminal", { sourceInterval: [3430, 3433] }, "-"], ["app", { sourceInterval: [3434, 3444] }, "PrimaryExp", []]]], PrimaryExp_not: ["define", { sourceInterval: [3478, 3514] }, null, [], ["seq", { sourceInterval: [3478, 3493] }, ["app", { sourceInterval: [3478, 3482] }, "kNOT", []], ["app", { sourceInterval: [3483, 3493] }, "PrimaryExp", []]]], PrimaryExp_exists: ["define", { sourceInterval: [3525, 3567] }, null, [], ["seq", { sourceInterval: [3525, 3556] }, ["app", { sourceInterval: [3525, 3532] }, "kEXISTS", []], ["terminal", { sourceInterval: [3533, 3536] }, "("], ["app", { sourceInterval: [3537, 3552] }, "SelectStatement", []], ["terminal", { sourceInterval: [3553, 3556] }, ")"]]], PrimaryExp: ["define", { sourceInterval: [3309, 3747] }, null, [], ["alt", { sourceInterval: [3330, 3747] }, ["app", { sourceInterval: [3330, 3348] }, "PrimaryExp_paren", []], ["app", { sourceInterval: [3382, 3396] }, "PrimaryExp_pos", []], ["app", { sourceInterval: [3430, 3444] }, "PrimaryExp_neg", []], ["app", { sourceInterval: [3478, 3493] }, "PrimaryExp_not", []], ["app", { sourceInterval: [3525, 3556] }, "PrimaryExp_exists", []], ["app", { sourceInterval: [3578, 3585] }, "literal", []], ["app", { sourceInterval: [3596, 3608] }, "ArrayLiteral", []], ["app", { sourceInterval: [3619, 3630] }, "DictLiteral", []], ["app", { sourceInterval: [3641, 3649] }, "Function", []], ["app", { sourceInterval: [3660, 3671] }, "AnyEveryExp", []], ["app", { sourceInterval: [3682, 3689] }, "CaseExp", []], ["app", { sourceInterval: [3700, 3709] }, "parameter", []], ["app", { sourceInterval: [3720, 3728] }, "variable", []], ["app", { sourceInterval: [3739, 3747] }, "Property", []]]], ArrayLiteral: ["define", { sourceInterval: [3754, 3784] }, null, [], ["seq", { sourceInterval: [3769, 3784] }, ["terminal", { sourceInterval: [3769, 3772] }, "["], ["app", { sourceInterval: [3773, 3780] }, "ArgList", []], ["terminal", { sourceInterval: [3781, 3784] }, "]"]]], DictLiteral: ["define", { sourceInterval: [3790, 3828] }, null, [], ["seq", { sourceInterval: [3805, 3828] }, ["terminal", { sourceInterval: [3805, 3808] }, "{"], ["app", { sourceInterval: [3809, 3824] }, "ListOf", [["app", { sourceInterval: [3816, 3818] }, "KV", []], ["terminal", { sourceInterval: [3820, 3823] }, ","]]], ["terminal", { sourceInterval: [3825, 3828] }, "}"]]], KV: ["define", { sourceInterval: [3833, 3869] }, null, [], ["seq", { sourceInterval: [3841, 3869] }, ["app", { sourceInterval: [3841, 3854] }, "stringLiteral", []], ["terminal", { sourceInterval: [3855, 3858] }, ":"], ["app", { sourceInterval: [3859, 3869] }, "Expression", []]]], InOrNot: ["define", { sourceInterval: [3875, 3899] }, null, [], ["seq", { sourceInterval: [3890, 3899] }, ["opt", { sourceInterval: [3890, 3895] }, ["app", { sourceInterval: [3890, 3894] }, "kNOT", []]], ["app", { sourceInterval: [3896, 3899] }, "kIN", []]]], Property_all: ["define", { sourceInterval: [3966, 3981] }, null, [], ["terminal", { sourceInterval: [3966, 3969] }, "*"]], Property_allInCollection: ["define", { sourceInterval: [3992, 4034] }, null, [], ["seq", { sourceInterval: [3992, 4015] }, ["app", { sourceInterval: [3992, 4007] }, "collectionAlias", []], ["terminal", { sourceInterval: [4008, 4011] }, "."], ["terminal", { sourceInterval: [4012, 4015] }, "*"]]], Property_path: ["define", { sourceInterval: [4045, 4068] }, null, [], ["app", { sourceInterval: [4045, 4057] }, "PropertyPath", []]], Property: ["define", { sourceInterval: [3925, 4068] }, "a document property", [], ["alt", { sourceInterval: [3966, 4068] }, ["app", { sourceInterval: [3966, 3969] }, "Property_all", []], ["app", { sourceInterval: [3992, 4015] }, "Property_allInCollection", []], ["app", { sourceInterval: [4045, 4057] }, "Property_path", []]]], PropertyPath: ["define", { sourceInterval: [4074, 4135] }, null, [], ["seq", { sourceInterval: [4097, 4135] }, ["app", { sourceInterval: [4097, 4109] }, "propertyName", []], ["star", { sourceInterval: [4110, 4135] }, ["app", { sourceInterval: [4110, 4134] }, "PropertyPathContinuation", []]]]], PropertyPathContinuation_named: ["define", { sourceInterval: [4176, 4204] }, null, [], ["seq", { sourceInterval: [4176, 4192] }, ["terminal", { sourceInterval: [4176, 4179] }, "."], ["app", { sourceInterval: [4180, 4192] }, "propertyName", []]]], PropertyPathContinuation_indexed: ["define", { sourceInterval: [4215, 4246] }, null, [], ["seq", { sourceInterval: [4215, 4234] }, ["terminal", { sourceInterval: [4215, 4218] }, "["], ["app", { sourceInterval: [4219, 4230] }, "wholeNumber", []], ["terminal", { sourceInterval: [4231, 4234] }, "]"]]], PropertyPathContinuation: ["define", { sourceInterval: [4141, 4246] }, null, [], ["alt", { sourceInterval: [4176, 4246] }, ["app", { sourceInterval: [4176, 4192] }, "PropertyPathContinuation_named", []], ["app", { sourceInterval: [4215, 4234] }, "PropertyPathContinuation_indexed", []]]], Function: ["define", { sourceInterval: [4272, 4336] }, "a function call", [], ["alt", { sourceInterval: [4309, 4336] }, ["app", { sourceInterval: [4309, 4321] }, "MetaFunction", []], ["app", { sourceInterval: [4324, 4336] }, "N1QLFunction", []]]], MetaFunction_plain: ["define", { sourceInterval: [4365, 4415] }, null, [], ["seq", { sourceInterval: [4365, 4400] }, ["app", { sourceInterval: [4365, 4370] }, "iMETA", []], ["terminal", { sourceInterval: [4371, 4374] }, "("], ["opt", { sourceInterval: [4375, 4391] }, ["app", { sourceInterval: [4375, 4390] }, "collectionAlias", []]], ["terminal", { sourceInterval: [4392, 4395] }, ")"], ["not", { sourceInterval: [4396, 4400] }, ["terminal", { sourceInterval: [4397, 4400] }, "."]]]], MetaFunction_property: ["define", { sourceInterval: [4426, 4479] }, null, [], ["seq", { sourceInterval: [4426, 4466] }, ["app", { sourceInterval: [4426, 4431] }, "iMETA", []], ["terminal", { sourceInterval: [4432, 4435] }, "("], ["opt", { sourceInterval: [4436, 4452] }, ["app", { sourceInterval: [4436, 4451] }, "collectionAlias", []]], ["terminal", { sourceInterval: [4453, 4456] }, ")"], ["terminal", { sourceInterval: [4457, 4460] }, "."], ["app", { sourceInterval: [4461, 4466] }, "ident", []]]], MetaFunction: ["define", { sourceInterval: [4342, 4479] }, null, [], ["alt", { sourceInterval: [4365, 4479] }, ["app", { sourceInterval: [4365, 4400] }, "MetaFunction_plain", []], ["app", { sourceInterval: [4426, 4466] }, "MetaFunction_property", []]]], N1QLFunction: ["define", { sourceInterval: [4485, 4536] }, null, [], ["seq", { sourceInterval: [4508, 4536] }, ["app", { sourceInterval: [4508, 4520] }, "functionName", []], ["terminal", { sourceInterval: [4521, 4524] }, "("], ["app", { sourceInterval: [4525, 4532] }, "ArgList", []], ["terminal", { sourceInterval: [4533, 4536] }, ")"]]], ArgList: ["define", { sourceInterval: [4542, 4583] }, null, [], ["app", { sourceInterval: [4560, 4583] }, "ListOf", [["app", { sourceInterval: [4567, 4577] }, "Expression", []], ["terminal", { sourceInterval: [4579, 4582] }, ","]]]], collectionAlias: ["define", { sourceInterval: [4626, 4670] }, "a collection alias", [], ["app", { sourceInterval: [4665, 4670] }, "ident", []]], columnAlias: ["define", { sourceInterval: [4675, 4719] }, "a column alias", [], ["app", { sourceInterval: [4714, 4719] }, "ident", []]], functionName: ["define", { sourceInterval: [4724, 4768] }, "a function name", [], ["app", { sourceInterval: [4763, 4768] }, "ident", []]], propertyName: ["define", { sourceInterval: [4773, 4817] }, "a property name", [], ["app", { sourceInterval: [4812, 4817] }, "ident", []]], variableName: ["define", { sourceInterval: [4822, 4866] }, "a variable name", [], ["app", { sourceInterval: [4861, 4866] }, "ident", []]], parameter: ["define", { sourceInterval: [4872, 4920] }, "a parameter", [], ["seq", { sourceInterval: [4911, 4920] }, ["terminal", { sourceInterval: [4911, 4914] }, "$"], ["app", { sourceInterval: [4915, 4920] }, "ident", []]]], variable: ["define", { sourceInterval: [4925, 4973] }, "a variable", [], ["seq", { sourceInterval: [4964, 4973] }, ["terminal", { sourceInterval: [4964, 4967] }, "?"], ["app", { sourceInterval: [4968, 4973] }, "ident", []]]], literal_true: ["define", { sourceInterval: [5050, 5071] }, null, [], ["app", { sourceInterval: [5050, 5055] }, "kTRUE", []]], literal_false: ["define", { sourceInterval: [5082, 5104] }, null, [], ["app", { sourceInterval: [5082, 5088] }, "kFALSE", []]], literal_null: ["define", { sourceInterval: [5115, 5136] }, null, [], ["app", { sourceInterval: [5115, 5120] }, "kNULL", []]], literal_missing: ["define", { sourceInterval: [5147, 5171] }, null, [], ["app", { sourceInterval: [5147, 5155] }, "kMISSING", []]], literal: ["define", { sourceInterval: [4979, 5171] }, "a literal", [], ["alt", { sourceInterval: [5009, 5171] }, ["app", { sourceInterval: [5009, 5015] }, "number", []], ["app", { sourceInterval: [5026, 5039] }, "stringLiteral", []], ["app", { sourceInterval: [5050, 5055] }, "literal_true", []], ["app", { sourceInterval: [5082, 5088] }, "literal_false", []], ["app", { sourceInterval: [5115, 5120] }, "literal_null", []], ["app", { sourceInterval: [5147, 5155] }, "literal_missing", []]]], ident_unquoted: ["define", { sourceInterval: [5245, 5298] }, null, [], ["seq", { sourceInterval: [5245, 5285] }, ["not", { sourceInterval: [5245, 5253] }, ["app", { sourceInterval: [5246, 5253] }, "keyword", []]], ["app", { sourceInterval: [5254, 5269] }, "identifierStart", []], ["star", { sourceInterval: [5270, 5285] }, ["app", { sourceInterval: [5270, 5284] }, "identifierPart", []]]]], ident_quoted: ["define", { sourceInterval: [5309, 5387] }, null, [], ["seq", { sourceInterval: [5309, 5346] }, ["app", { sourceInterval: [5309, 5318] }, "backQuote", []], ["star", { sourceInterval: [5319, 5336] }, ["seq", { sourceInterval: [5320, 5334] }, ["not", { sourceInterval: [5320, 5330] }, ["app", { sourceInterval: [5321, 5330] }, "backQuote", []]], ["app", { sourceInterval: [5331, 5334] }, "any", []]]], ["app", { sourceInterval: [5337, 5346] }, "backQuote", []]]], ident: ["define", { sourceInterval: [5212, 5387] }, "an identifier", [], ["alt", { sourceInterval: [5245, 5387] }, ["app", { sourceInterval: [5245, 5285] }, "ident_unquoted", []], ["app", { sourceInterval: [5309, 5346] }, "ident_quoted", []]]], iMETA: ["define", { sourceInterval: [5393, 5448] }, null, [], ["seq", { sourceInterval: [5403, 5448] }, ["app", { sourceInterval: [5403, 5426] }, "caseInsensitive", [["terminal", { sourceInterval: [5419, 5425] }, "META"]]], ["not", { sourceInterval: [5433, 5448] }, ["app", { sourceInterval: [5434, 5448] }, "identifierPart", []]]]], iID: ["define", { sourceInterval: [5453, 5510] }, null, [], ["seq", { sourceInterval: [5465, 5510] }, ["app", { sourceInterval: [5465, 5486] }, "caseInsensitive", [["terminal", { sourceInterval: [5481, 5485] }, "ID"]]], ["not", { sourceInterval: [5495, 5510] }, ["app", { sourceInterval: [5496, 5510] }, "identifierPart", []]]]], iSEQUENCE: ["define", { sourceInterval: [5515, 5573] }, null, [], ["seq", { sourceInterval: [5528, 5573] }, ["app", { sourceInterval: [5528, 5555] }, "caseInsensitive", [["terminal", { sourceInterval: [5544, 5554] }, "SEQUENCE"]]], ["not", { sourceInterval: [5558, 5573] }, ["app", { sourceInterval: [5559, 5573] }, "identifierPart", []]]]], iDELETED: ["define", { sourceInterval: [5578, 5635] }, null, [], ["seq", { sourceInterval: [5590, 5635] }, ["app", { sourceInterval: [5590, 5616] }, "caseInsensitive", [["terminal", { sourceInterval: [5606, 5615] }, "DELETED"]]], ["not", { sourceInterval: [5620, 5635] }, ["app", { sourceInterval: [5621, 5635] }, "identifierPart", []]]]], iEXPIRATION: ["define", { sourceInterval: [5640, 5699] }, null, [], ["seq", { sourceInterval: [5654, 5699] }, ["app", { sourceInterval: [5654, 5683] }, "caseInsensitive", [["terminal", { sourceInterval: [5670, 5682] }, "EXPIRATION"]]], ["not", { sourceInterval: [5684, 5699] }, ["app", { sourceInterval: [5685, 5699] }, "identifierPart", []]]]], keyword: ["define", { sourceInterval: [5705, 6132] }, null, [], ["alt", { sourceInterval: [5723, 6132] }, ["app", { sourceInterval: [5723, 5727] }, "kALL", []], ["app", { sourceInterval: [5730, 5734] }, "kAND", []], ["app", { sourceInterval: [5737, 5741] }, "kANY", []], ["app", { sourceInterval: [5744, 5750] }, "kARRAY", []], ["app", { sourceInterval: [5753, 5756] }, "kAS", []], ["app", { sourceInterval: [5759, 5763] }, "kASC", []], ["app", { sourceInterval: [5766, 5774] }, "kBETWEEN", []], ["app", { sourceInterval: [5777, 5780] }, "kBY", []], ["app", { sourceInterval: [5783, 5788] }, "kCASE", []], ["app", { sourceInterval: [5791, 5797] }, "kCROSS", []], ["app", { sourceInterval: [5800, 5805] }, "kDESC", []], ["app", { sourceInterval: [5816, 5825] }, "kDISTINCT", []], ["app", { sourceInterval: [5828, 5832] }, "kEND", []], ["app", { sourceInterval: [5835, 5840] }, "kELSE", []], ["app", { sourceInterval: [5843, 5849] }, "kEVERY", []], ["app", { sourceInterval: [5852, 5859] }, "kEXISTS", []], ["app", { sourceInterval: [5862, 5868] }, "kFALSE", []], ["app", { sourceInterval: [5871, 5876] }, "kFROM", []], ["app", { sourceInterval: [5879, 5885] }, "kGROUP", []], ["app", { sourceInterval: [5888, 5895] }, "kHAVING", []], ["app", { sourceInterval: [5898, 5901] }, "kIN", []], ["app", { sourceInterval: [5912, 5918] }, "kINNER", []], ["app", { sourceInterval: [5921, 5924] }, "kIS", []], ["app", { sourceInterval: [5927, 5932] }, "kJOIN", []], ["app", { sourceInterval: [5935, 5940] }, "kLEFT", []], ["app", { sourceInterval: [5943, 5948] }, "kLIKE", []], ["app", { sourceInterval: [5951, 5957] }, "kLIMIT", []], ["app", { sourceInterval: [5960, 5968] }, "kMISSING", []], ["app", { sourceInterval: [5971, 5975] }, "kNOT", []], ["app", { sourceInterval: [5978, 5983] }, "kNULL", []], ["app", { sourceInterval: [5986, 5993] }, "kOFFSET", []], ["app", { sourceInterval: [6004, 6007] }, "kON", []], ["app", { sourceInterval: [6010, 6013] }, "kOR", []], ["app", { sourceInterval: [6016, 6022] }, "kORDER", []], ["app", { sourceInterval: [6025, 6031] }, "kOUTER", []], ["app", { sourceInterval: [6034, 6040] }, "kRIGHT", []], ["app", { sourceInterval: [6043, 6053] }, "kSATISFIES", []], ["app", { sourceInterval: [6056, 6063] }, "kSELECT", []], ["app", { sourceInterval: [6066, 6071] }, "kSOME", []], ["app", { sourceInterval: [6074, 6079] }, "kTHEN", []], ["app", { sourceInterval: [6082, 6087] }, "kTRUE", []], ["app", { sourceInterval: [6098, 6105] }, "kUNNEST", []], ["app", { sourceInterval: [6108, 6115] }, "kVALUED", []], ["app", { sourceInterval: [6118, 6123] }, "kWHEN", []], ["app", { sourceInterval: [6126, 6132] }, "kWHERE", []]]], kALL: ["define", { sourceInterval: [6138, 6192] }, null, [], ["seq", { sourceInterval: [6147, 6192] }, ["app", { sourceInterval: [6147, 6169] }, "caseInsensitive", [["terminal", { sourceInterval: [6163, 6168] }, "ALL"]]], ["not", { sourceInterval: [6177, 6192] }, ["app", { sourceInterval: [6178, 6192] }, "identifierPart", []]]]], kAND: ["define", { sourceInterval: [6197, 6251] }, null, [], ["seq", { sourceInterval: [6206, 6251] }, ["app", { sourceInterval: [6206, 6228] }, "caseInsensitive", [["terminal", { sourceInterval: [6222, 6227] }, "AND"]]], ["not", { sourceInterval: [6236, 6251] }, ["app", { sourceInterval: [6237, 6251] }, "identifierPart", []]]]], kANY: ["define", { sourceInterval: [6256, 6310] }, null, [], ["seq", { sourceInterval: [6265, 6310] }, ["app", { sourceInterval: [6265, 6287] }, "caseInsensitive", [["terminal", { sourceInterval: [6281, 6286] }, "ANY"]]], ["not", { sourceInterval: [6295, 6310] }, ["app", { sourceInterval: [6296, 6310] }, "identifierPart", []]]]], kARRAY: ["define", { sourceInterval: [6315, 6371] }, null, [], ["seq", { sourceInterval: [6326, 6371] }, ["app", { sourceInterval: [6326, 6350] }, "caseInsensitive", [["terminal", { sourceInterval: [6342, 6349] }, "ARRAY"]]], ["not", { sourceInterval: [6356, 6371] }, ["app", { sourceInterval: [6357, 6371] }, "identifierPart", []]]]], kAS: ["define", { sourceInterval: [6376, 6429] }, null, [], ["seq", { sourceInterval: [6384, 6429] }, ["app", { sourceInterval: [6384, 6405] }, "caseInsensitive", [["terminal", { sourceInterval: [6400, 6404] }, "AS"]]], ["not", { sourceInterval: [6414, 6429] }, ["app", { sourceInterval: [6415, 6429] }, "identifierPart", []]]]], kASC: ["define", { sourceInterval: [6434, 6487] }, null, [], ["seq", { sourceInterval: [6442, 6487] }, ["app", { sourceInterval: [6442, 6464] }, "caseInsensitive", [["terminal", { sourceInterval: [6458, 6463] }, "ASC"]]], ["not", { sourceInterval: [6472, 6487] }, ["app", { sourceInterval: [6473, 6487] }, "identifierPart", []]]]], kBETWEEN: ["define", { sourceInterval: [6492, 6548] }, null, [], ["seq", { sourceInterval: [6503, 6548] }, ["app", { sourceInterval: [6503, 6529] }, "caseInsensitive", [["terminal", { sourceInterval: [6519, 6528] }, "BETWEEN"]]], ["not", { sourceInterval: [6533, 6548] }, ["app", { sourceInterval: [6534, 6548] }, "identifierPart", []]]]], kBY: ["define", { sourceInterval: [6553, 6606] }, null, [], ["seq", { sourceInterval: [6561, 6606] }, ["app", { sourceInterval: [6561, 6582] }, "caseInsensitive", [["terminal", { sourceInterval: [6577, 6581] }, "BY"]]], ["not", { sourceInterval: [6591, 6606] }, ["app", { sourceInterval: [6592, 6606] }, "identifierPart", []]]]], kCASE: ["define", { sourceInterval: [6611, 6665] }, null, [], ["seq", { sourceInterval: [6620, 6665] }, ["app", { sourceInterval: [6620, 6643] }, "caseInsensitive", [["terminal", { sourceInterval: [6636, 6642] }, "CASE"]]], ["not", { sourceInterval: [6650, 6665] }, ["app", { sourceInterval: [6651, 6665] }, "identifierPart", []]]]], kCROSS: ["define", { sourceInterval: [6670, 6725] }, null, [], ["seq", { sourceInterval: [6680, 6725] }, ["app", { sourceInterval: [6680, 6704] }, "caseInsensitive", [["terminal", { sourceInterval: [6696, 6703] }, "CROSS"]]], ["not", { sourceInterval: [6710, 6725] }, ["app", { sourceInterval: [6711, 6725] }, "identifierPart", []]]]], kDESC: ["define", { sourceInterval: [6730, 6784] }, null, [], ["seq", { sourceInterval: [6739, 6784] }, ["app", { sourceInterval: [6739, 6762] }, "caseInsensitive", [["terminal", { sourceInterval: [6755, 6761] }, "DESC"]]], ["not", { sourceInterval: [6769, 6784] }, ["app", { sourceInterval: [6770, 6784] }, "identifierPart", []]]]], kDISTINCT: ["define", { sourceInterval: [6789, 6846] }, null, [], ["seq", { sourceInterval: [6801, 6846] }, ["app", { sourceInterval: [6801, 6828] }, "caseInsensitive", [["terminal", { sourceInterval: [6817, 6827] }, "DISTINCT"]]], ["not", { sourceInterval: [6831, 6846] }, ["app", { sourceInterval: [6832, 6846] }, "identifierPart", []]]]], kELSE: ["define", { sourceInterval: [6851, 6905] }, null, [], ["seq", { sourceInterval: [6860, 6905] }, ["app", { sourceInterval: [6860, 6883] }, "caseInsensitive", [["terminal", { sourceInterval: [6876, 6882] }, "ELSE"]]], ["not", { sourceInterval: [6890, 6905] }, ["app", { sourceInterval: [6891, 6905] }, "identifierPart", []]]]], kEND: ["define", { sourceInterval: [6910, 6963] }, null, [], ["seq", { sourceInterval: [6918, 6963] }, ["app", { sourceInterval: [6918, 6940] }, "caseInsensitive", [["terminal", { sourceInterval: [6934, 6939] }, "END"]]], ["not", { sourceInterval: [6948, 6963] }, ["app", { sourceInterval: [6949, 6963] }, "identifierPart", []]]]], kEVERY: ["define", { sourceInterval: [6968, 7023] }, null, [], ["seq", { sourceInterval: [6978, 7023] }, ["app", { sourceInterval: [6978, 7002] }, "caseInsensitive", [["terminal", { sourceInterval: [6994, 7001] }, "EVERY"]]], ["not", { sourceInterval: [7008, 7023] }, ["app", { sourceInterval: [7009, 7023] }, "identifierPart", []]]]], kEXISTS: ["define", { sourceInterval: [7028, 7084] }, null, [], ["seq", { sourceInterval: [7039, 7084] }, ["app", { sourceInterval: [7039, 7064] }, "caseInsensitive", [["terminal", { sourceInterval: [7055, 7063] }, "EXISTS"]]], ["not", { sourceInterval: [7069, 7084] }, ["app", { sourceInterval: [7070, 7084] }, "identifierPart", []]]]], kFALSE: ["define", { sourceInterval: [7089, 7144] }, null, [], ["seq", { sourceInterval: [7099, 7144] }, ["app", { sourceInterval: [7099, 7123] }, "caseInsensitive", [["terminal", { sourceInterval: [7115, 7122] }, "FALSE"]]], ["not", { sourceInterval: [7129, 7144] }, ["app", { sourceInterval: [7130, 7144] }, "identifierPart", []]]]], kFROM: ["define", { sourceInterval: [7149, 7204] }, null, [], ["seq", { sourceInterval: [7159, 7204] }, ["app", { sourceInterval: [7159, 7182] }, "caseInsensitive", [["terminal", { sourceInterval: [7175, 7181] }, "FROM"]]], ["not", { sourceInterval: [7189, 7204] }, ["app", { sourceInterval: [7190, 7204] }, "identifierPart", []]]]], kGROUP: ["define", { sourceInterval: [7209, 7265] }, null, [], ["seq", { sourceInterval: [7220, 7265] }, ["app", { sourceInterval: [7220, 7244] }, "caseInsensitive", [["terminal", { sourceInterval: [7236, 7243] }, "GROUP"]]], ["not", { sourceInterval: [7250, 7265] }, ["app", { sourceInterval: [7251, 7265] }, "identifierPart", []]]]], kHAVING: ["define", { sourceInterval: [7270, 7326] }, null, [], ["seq", { sourceInterval: [7281, 7326] }, ["app", { sourceInterval: [7281, 7306] }, "caseInsensitive", [["terminal", { sourceInterval: [7297, 7305] }, "HAVING"]]], ["not", { sourceInterval: [7311, 7326] }, ["app", { sourceInterval: [7312, 7326] }, "identifierPart", []]]]], kIN: ["define", { sourceInterval: [7331, 7384] }, null, [], ["seq", { sourceInterval: [7339, 7384] }, ["app", { sourceInterval: [7339, 7360] }, "caseInsensitive", [["terminal", { sourceInterval: [7355, 7359] }, "IN"]]], ["not", { sourceInterval: [7369, 7384] }, ["app", { sourceInterval: [7370, 7384] }, "identifierPart", []]]]], kINNER: ["define", { sourceInterval: [7389, 7447] }, null, [], ["seq", { sourceInterval: [7402, 7447] }, ["app", { sourceInterval: [7402, 7426] }, "caseInsensitive", [["terminal", { sourceInterval: [7418, 7425] }, "INNER"]]], ["not", { sourceInterval: [7432, 7447] }, ["app", { sourceInterval: [7433, 7447] }, "identifierPart", []]]]], kIS: ["define", { sourceInterval: [7452, 7505] }, null, [], ["seq", { sourceInterval: [7460, 7505] }, ["app", { sourceInterval: [7460, 7481] }, "caseInsensitive", [["terminal", { sourceInterval: [7476, 7480] }, "IS"]]], ["not", { sourceInterval: [7490, 7505] }, ["app", { sourceInterval: [7491, 7505] }, "identifierPart", []]]]], kJOIN: ["define", { sourceInterval: [7510, 7565] }, null, [], ["seq", { sourceInterval: [7520, 7565] }, ["app", { sourceInterval: [7520, 7543] }, "caseInsensitive", [["terminal", { sourceInterval: [7536, 7542] }, "JOIN"]]], ["not", { sourceInterval: [7550, 7565] }, ["app", { sourceInterval: [7551, 7565] }, "identifierPart", []]]]], kLEFT: ["define", { sourceInterval: [7570, 7625] }, null, [], ["seq", { sourceInterval: [7580, 7625] }, ["app", { sourceInterval: [7580, 7603] }, "caseInsensitive", [["terminal", { sourceInterval: [7596, 7602] }, "LEFT"]]], ["not", { sourceInterval: [7610, 7625] }, ["app", { sourceInterval: [7611, 7625] }, "identifierPart", []]]]], kLIKE: ["define", { sourceInterval: [7630, 7685] }, null, [], ["seq", { sourceInterval: [7640, 7685] }, ["app", { sourceInterval: [7640, 7663] }, "caseInsensitive", [["terminal", { sourceInterval: [7656, 7662] }, "LIKE"]]], ["not", { sourceInterval: [7670, 7685] }, ["app", { sourceInterval: [7671, 7685] }, "identifierPart", []]]]], kLIMIT: ["define", { sourceInterval: [7690, 7746] }, null, [], ["seq", { sourceInterval: [7701, 7746] }, ["app", { sourceInterval: [7701, 7725] }, "caseInsensitive", [["terminal", { sourceInterval: [7717, 7724] }, "LIMIT"]]], ["not", { sourceInterval: [7731, 7746] }, ["app", { sourceInterval: [7732, 7746] }, "identifierPart", []]]]], kMISSING: ["define", { sourceInterval: [7751, 7808] }, null, [], ["seq", { sourceInterval: [7763, 7808] }, ["app", { sourceInterval: [7763, 7789] }, "caseInsensitive", [["terminal", { sourceInterval: [7779, 7788] }, "MISSING"]]], ["not", { sourceInterval: [7793, 7808] }, ["app", { sourceInterval: [7794, 7808] }, "identifierPart", []]]]], kNOT: ["define", { sourceInterval: [7813, 7867] }, null, [], ["seq", { sourceInterval: [7822, 7867] }, ["app", { sourceInterval: [7822, 7844] }, "caseInsensitive", [["terminal", { sourceInterval: [7838, 7843] }, "NOT"]]], ["not", { sourceInterval: [7852, 7867] }, ["app", { sourceInterval: [7853, 7867] }, "identifierPart", []]]]], kNULL: ["define", { sourceInterval: [7872, 7927] }, null, [], ["seq", { sourceInterval: [7882, 7927] }, ["app", { sourceInterval: [7882, 7905] }, "caseInsensitive", [["terminal", { sourceInterval: [7898, 7904] }, "NULL"]]], ["not", { sourceInterval: [7912, 7927] }, ["app", { sourceInterval: [7913, 7927] }, "identifierPart", []]]]], kOFFSET: ["define", { sourceInterval: [7932, 7989] }, null, [], ["seq", { sourceInterval: [7944, 7989] }, ["app", { sourceInterval: [7944, 7969] }, "caseInsensitive", [["terminal", { sourceInterval: [7960, 7968] }, "OFFSET"]]], ["not", { sourceInterval: [7974, 7989] }, ["app", { sourceInterval: [7975, 7989] }, "identifierPart", []]]]], kON: ["define", { sourceInterval: [7994, 8051] }, null, [], ["seq", { sourceInterval: [8006, 8051] }, ["app", { sourceInterval: [8006, 8027] }, "caseInsensitive", [["terminal", { sourceInterval: [8022, 8026] }, "ON"]]], ["not", { sourceInterval: [8036, 8051] }, ["app", { sourceInterval: [8037, 8051] }, "identifierPart", []]]]], kOR: ["define", { sourceInterval: [8056, 8110] }, null, [], ["seq", { sourceInterval: [8065, 8110] }, ["app", { sourceInterval: [8065, 8086] }, "caseInsensitive", [["terminal", { sourceInterval: [8081, 8085] }, "OR"]]], ["not", { sourceInterval: [8095, 8110] }, ["app", { sourceInterval: [8096, 8110] }, "identifierPart", []]]]], kORDER: ["define", { sourceInterval: [8115, 8171] }, null, [], ["seq", { sourceInterval: [8126, 8171] }, ["app", { sourceInterval: [8126, 8150] }, "caseInsensitive", [["terminal", { sourceInterval: [8142, 8149] }, "ORDER"]]], ["not", { sourceInterval: [8156, 8171] }, ["app", { sourceInterval: [8157, 8171] }, "identifierPart", []]]]], kOUTER: ["define", { sourceInterval: [8176, 8232] }, null, [], ["seq", { sourceInterval: [8187, 8232] }, ["app", { sourceInterval: [8187, 8211] }, "caseInsensitive", [["terminal", { sourceInterval: [8203, 8210] }, "OUTER"]]], ["not", { sourceInterval: [8217, 8232] }, ["app", { sourceInterval: [8218, 8232] }, "identifierPart", []]]]], kRIGHT: ["define", { sourceInterval: [8237, 8293] }, null, [], ["seq", { sourceInterval: [8248, 8293] }, ["app", { sourceInterval: [8248, 8272] }, "caseInsensitive", [["terminal", { sourceInterval: [8264, 8271] }, "RIGHT"]]], ["not", { sourceInterval: [8278, 8293] }, ["app", { sourceInterval: [8279, 8293] }, "identifierPart", []]]]], kSATISFIES: ["define", { sourceInterval: [8298, 8357] }, null, [], ["seq", { sourceInterval: [8312, 8357] }, ["app", { sourceInterval: [8312, 8340] }, "caseInsensitive", [["terminal", { sourceInterval: [8328, 8339] }, "SATISFIES"]]], ["not", { sourceInterval: [8342, 8357] }, ["app", { sourceInterval: [8343, 8357] }, "identifierPart", []]]]], kSELECT: ["define", { sourceInterval: [8362, 8418] }, null, [], ["seq", { sourceInterval: [8373, 8418] }, ["app", { sourceInterval: [8373, 8398] }, "caseInsensitive", [["terminal", { sourceInterval: [8389, 8397] }, "SELECT"]]], ["not", { sourceInterval: [8403, 8418] }, ["app", { sourceInterval: [8404, 8418] }, "identifierPart", []]]]], kSOME: ["define", { sourceInterval: [8423, 8480] }, null, [], ["seq", { sourceInterval: [8435, 8480] }, ["app", { sourceInterval: [8435, 8458] }, "caseInsensitive", [["terminal", { sourceInterval: [8451, 8457] }, "SOME"]]], ["not", { sourceInterval: [8465, 8480] }, ["app", { sourceInterval: [8466, 8480] }, "identifierPart", []]]]], kTHEN: ["define", { sourceInterval: [8485, 8542] }, null, [], ["seq", { sourceInterval: [8497, 8542] }, ["app", { sourceInterval: [8497, 8520] }, "caseInsensitive", [["terminal", { sourceInterval: [8513, 8519] }, "THEN"]]], ["not", { sourceInterval: [8527, 8542] }, ["app", { sourceInterval: [8528, 8542] }, "identifierPart", []]]]], kTRUE: ["define", { sourceInterval: [8547, 8602] }, null, [], ["seq", { sourceInterval: [8557, 8602] }, ["app", { sourceInterval: [8557, 8580] }, "caseInsensitive", [["terminal", { sourceInterval: [8573, 8579] }, "TRUE"]]], ["not", { sourceInterval: [8587, 8602] }, ["app", { sourceInterval: [8588, 8602] }, "identifierPart", []]]]], kUNNEST: ["define", { sourceInterval: [8607, 8666] }, null, [], ["seq", { sourceInterval: [8621, 8666] }, ["app", { sourceInterval: [8621, 8646] }, "caseInsensitive", [["terminal", { sourceInterval: [8637, 8645] }, "UNNEST"]]], ["not", { sourceInterval: [8651, 8666] }, ["app", { sourceInterval: [8652, 8666] }, "identifierPart", []]]]], kVALUED: ["define", { sourceInterval: [8671, 8730] }, null, [], ["seq", { sourceInterval: [8685, 8730] }, ["app", { sourceInterval: [8685, 8710] }, "caseInsensitive", [["terminal", { sourceInterval: [8701, 8709] }, "VALUED"]]], ["not", { sourceInterval: [8715, 8730] }, ["app", { sourceInterval: [8716, 8730] }, "identifierPart", []]]]], kWHEN: ["define", { sourceInterval: [8735, 8790] }, null, [], ["seq", { sourceInterval: [8745, 8790] }, ["app", { sourceInterval: [8745, 8768] }, "caseInsensitive", [["terminal", { sourceInterval: [8761, 8767] }, "WHEN"]]], ["not", { sourceInterval: [8775, 8790] }, ["app", { sourceInterval: [8776, 8790] }, "identifierPart", []]]]], kWHERE: ["define", { sourceInterval: [8795, 8851] }, null, [], ["seq", { sourceInterval: [8806, 8851] }, ["app", { sourceInterval: [8806, 8830] }, "caseInsensitive", [["terminal", { sourceInterval: [8822, 8829] }, "WHERE"]]], ["not", { sourceInterval: [8836, 8851] }, ["app", { sourceInterval: [8837, 8851] }, "identifierPart", []]]]], number_real: ["define", { sourceInterval: [8918, 8988] }, null, [], ["seq", { sourceInterval: [8918, 8979] }, ["star", { sourceInterval: [8918, 8924] }, ["app", { sourceInterval: [8918, 8923] }, "digit", []]], ["terminal", { sourceInterval: [8925, 8928] }, "."], ["plus", { sourceInterval: [8929, 8935] }, ["app", { sourceInterval: [8929, 8934] }, "digit", []]], ["opt", { sourceInterval: [8936, 8979] }, ["seq", { sourceInterval: [8937, 8977] }, ["app", { sourceInterval: [8937, 8957] }, "caseInsensitive", [["terminal", { sourceInterval: [8953, 8956] }, "e"]]], ["opt", { sourceInterval: [8958, 8970] }, ["alt", { sourceInterval: [8959, 8968] }, ["terminal", { sourceInterval: [8959, 8962] }, "+"], ["terminal", { sourceInterval: [8965, 8968] }, "-"]]], ["plus", { sourceInterval: [8971, 8977] }, ["app", { sourceInterval: [8971, 8976] }, "digit", []]]]]]], number_whole: ["define", { sourceInterval: [9001, 9051] }, null, [], ["app", { sourceInterval: [9001, 9012] }, "wholeNumber", []]], number: ["define", { sourceInterval: [8887, 9051] }, "a number", [], ["alt", { sourceInterval: [8918, 9051] }, ["app", { sourceInterval: [8918, 8979] }, "number_real", []], ["app", { sourceInterval: [9001, 9012] }, "number_whole", []]]], wholeNumber: ["define", { sourceInterval: [9057, 9096] }, "a whole number", [], ["plus", { sourceInterval: [9090, 9096] }, ["app", { sourceInterval: [9090, 9095] }, "digit", []]]], identifierStart: ["define", { sourceInterval: [9102, 9132] }, null, [], ["alt", { sourceInterval: [9120, 9132] }, ["app", { sourceInterval: [9120, 9126] }, "letter", []], ["terminal", { sourceInterval: [9129, 9132] }, "_"]]], identifierPart: ["define", { sourceInterval: [9137, 9178] }, null, [], ["alt", { sourceInterval: [9155, 9178] }, ["app", { sourceInterval: [9155, 9170] }, "identifierStart", []], ["app", { sourceInterval: [9173, 9178] }, "digit", []]]], stringLiteral: ["define", { sourceInterval: [9184, 9308] }, "a string literal", [], ["alt", { sourceInterval: [9254, 9308] }, ["seq", { sourceInterval: [9254, 9276] }, ["terminal", { sourceInterval: [9254, 9258] }, '"'], ["star", { sourceInterval: [9259, 9271] }, ["seq", { sourceInterval: [9260, 9269] }, ["not", { sourceInterval: [9260, 9265] }, ["terminal", { sourceInterval: [9261, 9265] }, '"']], ["app", { sourceInterval: [9266, 9269] }, "any", []]]], ["terminal", { sourceInterval: [9272, 9276] }, '"']], ["seq", { sourceInterval: [9287, 9308] }, ["terminal", { sourceInterval: [9287, 9290] }, "'"], ["star", { sourceInterval: [9292, 9304] }, ["seq", { sourceInterval: [9293, 9302] }, ["not", { sourceInterval: [9293, 9297] }, ["terminal", { sourceInterval: [9294, 9297] }, "'"]], ["app", { sourceInterval: [9299, 9302] }, "any", []]]], ["terminal", { sourceInterval: [9305, 9308] }, "'"]]]], backQuote: ["define", { sourceInterval: [9314, 9334] }, null, [], ["terminal", { sourceInterval: [9326, 9334] }, "`"]] }]);
class Lr extends Error {
  constructor(t, r, i) {
    super(t);
    pe(this, "sourceRange");
    this.name = "N1QLParseError", typeof r == "number" ? this.sourceRange = [r, i ?? r] : Array.isArray(r) && r.sourceTextStart !== void 0 && (this.sourceRange = [r.sourceTextStart, r.sourceTextEnd ?? r.sourceTextStart]);
  }
}
function uI(n) {
  return lI(n, "SelectStatement");
}
function lI(n, e) {
  cI();
  let t = hy.match(n, e);
  if (t.failed())
    throw new Lr(t.shortMessage, t.getInterval().startIdx, t.getInterval().endIdx);
  return xo(t).json();
}
let xo;
function cI() {
  if (xo !== void 0)
    return;
  xo = hy.createSemantics();
  function n(i, a) {
    return Array.isArray(i) && (i.sourceTextStart = a.source.startIdx, i.sourceTextEnd = a.source.endIdx), i;
  }
  function e(i) {
    return n(i.json(), i);
  }
  function t(i) {
    return i.children.map(e);
  }
  function r(i) {
    return function(a, u, l) {
      return [i, e(a), e(l)];
    };
  }
  xo.addOperation("json()", {
    // Select:
    SelectStatement(i, a, u, l, c, _, m, w, E, k, D) {
      let K = {
        WHAT: t(u.asIteration()),
        FROM: []
      };
      if (l.numChildren > 0 && (K.FROM = e(l.child(0))), a.numChildren > 0 && (K.DISTINCT = !0), _.numChildren > 0 && (K.WHERE = e(_.child(0))), m.numChildren > 0 && (K.GROUP_BY = t(m.child(0).child(2).asIteration())), w.numChildren > 0 && w.child(0).numChildren > 0 && (K.HAVING = e(w.child(0).child(0).child(1))), E.numChildren > 0 && (K.ORDER_BY = t(E.child(0).child(2).asIteration())), k.numChildren > 0) {
        let [C, M, J] = e(k.child(0));
        M !== null && (K.OFFSET = M), J !== null && (K.LIMIT = J);
      }
      return K;
    },
    SelectResult(i, a, u) {
      let l = e(i);
      return u.numChildren > 0 && (l = ["AS", l, e(u.child(0))]), l;
    },
    // Kludge: returns DataSource[], but it has to be typed as Expr
    FromClause(i, a, u) {
      const l = e(a);
      return u.numChildren === 0 ? [l] : [l, ...t(u)];
    },
    // Kludge: returns FromSource[], but it has to be typed as Expr
    CollectionSource(i, a, u, l, c) {
      let _;
      return u.numChildren > 0 ? _ = { SCOPE: e(i), COLLECTION: e(u.child(0)) } : _ = { COLLECTION: e(i) }, c.numChildren > 0 && (_.AS = e(c.child(0))), _;
    },
    // Kludge: returns JoinSource[], but it has to be typed as Expr
    Join(i, a, u, l, c) {
      const _ = e(u);
      return i.numChildren > 0 ? _.JOIN = e(i.child(0)) : _.JOIN = "INNER", _.ON = e(c), _;
    },
    JoinType_inner(i) {
      return "INNER";
    },
    JoinType_outer(i, a) {
      return "OUTER";
    },
    JoinType_left(i, a) {
      return "LEFT OUTER";
    },
    JoinType_cross(i) {
      return "CROSS";
    },
    // Kludge: returns UnnestSource[], but it has to be typed as Expr
    Unnest(i, a, u, l) {
      const c = { UNNEST: e(a) };
      return l.numChildren > 0 && (c.AS = e(l.child(0))), c;
    },
    Ordering(i, a) {
      let u = e(i);
      return a.numChildren > 0 && a.child(0).sourceString.toUpperCase() === "DESC" && (u = ["DESC", u]), u;
    },
    LimitOffset_limitFirst(i, a, u, l) {
      let c = ["limitoffset", null, e(a)];
      return l.numChildren > 0 && (c[1] = e(l.child(0))), c;
    },
    LimitOffset_offsetFirst(i, a, u, l) {
      let c = ["limitoffset", e(a), null];
      return l.numChildren > 0 && (c[2] = e(l.child(0))), c;
    },
    // Expressions:
    OrExp_or: r("OR"),
    AndExp_and: r("AND"),
    EqExp_eq: r("="),
    EqExp_neq: r("!="),
    EqExp_isValued(i, a, u, l) {
      let c = ["IS VALUED", e(i)];
      return u.numChildren > 0 && (c = ["NOT", c]), c;
    },
    EqExp_isNot(i, a, u, l) {
      return ["IS NOT", e(i), e(l)];
    },
    EqExp_is: r("IS"),
    EqExp_like: r("LIKE"),
    EqExp_notNull(i, a, u) {
      return ["IS NOT", i, null];
    },
    EqExp_inExpr(i, a, u) {
      return [a.sourceString.toUpperCase(), e(i), e(u)];
    },
    EqExp_inArray(i, a, u) {
      return [a.sourceString.toUpperCase(), e(i), e(u)];
    },
    EqExp_between(i, a, u, l, c, _) {
      let m = ["BETWEEN", e(i), e(l), e(_)];
      return a.numChildren > 0 && (m = ["NOT", m]), m;
    },
    RelExp_rel(i, a, u) {
      return [a.sourceString, e(i), e(u)];
    },
    BitExp_bit(i, a, u) {
      return [a.sourceString, e(i), e(u)];
    },
    AddExp_plus: r("+"),
    AddExp_minus: r("-"),
    MulExp_times: r("*"),
    MulExp_divide: r("/"),
    MulExp_modulo: r("%"),
    ConcatExp_concat: r("||"),
    PrimaryExp_paren(i, a, u) {
      return e(a);
    },
    PrimaryExp_pos(i, a) {
      return e(a);
    },
    PrimaryExp_neg(i, a) {
      return ["-", e(a)];
    },
    PrimaryExp_not(i, a) {
      return ["NOT", e(a)];
    },
    PrimaryExp_exists(i, a, u, l) {
      return ["EXISTS", e(u)];
    },
    parameter(i, a) {
      return ["$", e(a)];
    },
    variable(i, a) {
      return ["?", e(a)];
    },
    AnyEveryExp(i, a, u, l, c, _, m) {
      const w = e(a), E = e(_);
      return zf(E, (k, D) => (k === "." && D[1] === w && (D[0] = "?"), !0)), [e(i), w, e(l), E];
    },
    AnyEvery_any(i) {
      return "ANY";
    },
    AnyEvery_every(i) {
      return "EVERY";
    },
    AnyEvery_anyEvery(i, a, u) {
      return "ANY AND EVERY";
    },
    CaseExp(i, a, u, l, c, _) {
      const m = ["CASE", a.numChildren > 0 ? e(a.child(0)) : null];
      for (const w of u.children)
        m.push(e(w.child(1))), m.push(e(w.child(3)));
      return c.numChildren > 0 && m.push(e(c.child(0))), m;
    },
    // Properties:
    Property_all(i) {
      return ["."];
    },
    Property_allInCollection(i, a, u) {
      return [".", e(i)];
    },
    //???
    PropertyPath(i, a) {
      return [".", e(i), ...t(a)];
    },
    PropertyPathContinuation_named(i, a) {
      return e(a);
    },
    PropertyPathContinuation_indexed(i, a, u) {
      return e(a);
    },
    // Functions:
    MetaFunction_plain(i, a, u, l) {
      const c = ["META()"];
      return u.numChildren > 0 && c.push(e(u.child(0))), c;
    },
    MetaFunction_property(i, a, u, l, c, _) {
      const m = ["META()"];
      return u.numChildren > 0 ? m.push(e(u.child(0))) : m.push(null), m.push(_.sourceString.toLowerCase()), m;
    },
    N1QLFunction(i, a, u, l) {
      return [e(i).toUpperCase() + "()", ...t(u.asIteration())];
    },
    // Literals:
    ArrayLiteral(i, a, u) {
      return ["[]", ...t(a.asIteration())];
    },
    DictLiteral(i, a, u) {
      const l = {};
      for (const c of a.asIteration().children)
        l[e(c.child(0))] = e(c.child(2));
      return l;
    },
    wholeNumber(i) {
      return parseInt(this.sourceString);
    },
    number(i) {
      return parseFloat(this.sourceString);
    },
    ident_unquoted(i, a) {
      return this.sourceString;
    },
    ident_quoted(i, a, u) {
      return a.sourceString;
    },
    stringLiteral(i, a, u) {
      return a.sourceString;
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
class Jf extends Error {
}
class py extends Error {
}
function dy(n) {
  return n in gy || n in yy || n in new vy(Math.random) || n in new Qf(Math.random, Math.random) || n in Zf;
}
function fI(n) {
  return !n.endsWith("()") && n in new Qf(Math.random, Math.random);
}
function kc(n, ...e) {
  if (!Array.isArray(n))
    return !1;
  for (let t = 0; t < e.length; ++t)
    if (n[t] !== e[t])
      return !1;
  return !0;
}
function dt(n, e) {
  if (!Array.isArray(n))
    return Me(n !== void 0, "invalid Expr"), Va(n) ? () => n : dI(n, e);
  const t = n[0];
  try {
    const r = yy[t];
    if (r !== void 0) {
      if (!e.allowCompilingAggregates)
        throw new Lr(`Illegal use of aggregate function ${t} outside result column`);
      const l = new r(n, dt(n[1], e));
      return e.compileAggregate(l);
    }
    const i = n.length - 1;
    if (i === 1) {
      const l = new vy(dt(n[1], e));
      if (l[t])
        return l[t].bind(l);
    } else if (i === 2) {
      const l = new Qf(dt(n[1], e), dt(n[2], e));
      if (l[t])
        return l[t].bind(l);
    }
    const a = gy[t];
    if (a)
      return a(n, e);
    const u = Zf[t];
    if (u)
      return pI(n, e, u);
    throw t.endsWith("()") ? dy(t) ? new Lr(`${t} cannot be called with ${i} arguments`) : new Lr(`"${t}" is not a supported function`) : new Lr(`unknown JSON query operator "${t}"`);
  } catch (r) {
    throw r instanceof Lr && r.sourceRange === void 0 && n.sourceTextStart && (r.sourceRange = [n.sourceTextStart, n.sourceTextEnd ?? n.sourceTextStart]), r;
  }
}
const Zf = {};
function hI(n, e, t) {
  if (!n.match(/^[a-zA-Z][a-zA-Z0-9_]+$/))
    throw Error(`N1QL function name "${n}" is not valid. Must be alphanumeric.`);
  const r = n.toUpperCase() + "()";
  if (dy(r))
    throw Error(`N1QL function ${n} already exists.`);
  Zf[r] = {
    implementation: e,
    options: {
      minimumArgs: (t == null ? void 0 : t.minimumArgs) ?? e.length,
      maximumArgs: (t == null ? void 0 : t.maximumArgs) ?? e.length,
      nondeterministic: (t == null ? void 0 : t.nondeterministic) ?? !1
    }
  };
}
function pI(n, e, t) {
  const r = n[0], i = Xr(n, e);
  return yi(
    i.length >= t.options.minimumArgs && i.length <= t.options.maximumArgs,
    `invalid argument count for ${r}`
  ), () => {
    try {
      return t.implementation(...i);
    } catch (a) {
      return console.error(`Exception thrown from user-defined N1QL function ${r}`, a), null;
    }
  };
}
var Re, pt, Tt, Eo, tr;
class vy {
  constructor(e) {
    ee(this, Re);
    ee(this, tr);
    G(this, tr, e);
  }
  // Enables method lookup by name
  //---- ARRAYS:
  "ARRAY_AVG()"() {
    return ge(this, Re, pt).call(this, Um);
  }
  "ARRAY_COUNT()"() {
    return ge(this, Re, pt).call(this, $m);
  }
  "ARRAY_IFNULL()"() {
    return ge(this, Re, pt).call(this, jm);
  }
  "ARRAY_LENGTH()"() {
    return ge(this, Re, pt).call(this, Km);
  }
  "ARRAY_MIN()"() {
    return ge(this, Re, pt).call(this, Gm);
  }
  "ARRAY_MAX()"() {
    return ge(this, Re, pt).call(this, zm);
  }
  "ARRAY_SUM()"() {
    return ge(this, Re, pt).call(this, Hm);
  }
  EXISTS() {
    const e = p(this, tr).call(this);
    return Array.isArray(e) && e.length > 0;
  }
  //---- LOGICAL:
  NOT() {
    return ge(this, Re, pt).call(this, (e) => !e);
  }
  //---- MATH:
  "+"() {
    return p(this, tr).call(this);
  }
  "-"() {
    return ge(this, Re, Tt).call(this, (e) => -e);
  }
  "ABS()"() {
    return ge(this, Re, Tt).call(this, Math.abs);
  }
  "ACOS()"() {
    return ge(this, Re, Tt).call(this, Math.acos);
  }
  "ASIN()"() {
    return ge(this, Re, Tt).call(this, Math.asin);
  }
  "ATAN()"() {
    return ge(this, Re, Tt).call(this, Math.atan);
  }
  "CEIL()"() {
    return ge(this, Re, Tt).call(this, Math.ceil);
  }
  "COS()"() {
    return ge(this, Re, Tt).call(this, Math.cos);
  }
  "DEGREES()"() {
    return ge(this, Re, Tt).call(this, (e) => e * 180 / Math.PI);
  }
  "EXP()"() {
    return ge(this, Re, Tt).call(this, Math.exp);
  }
  "FLOOR()"() {
    return ge(this, Re, Tt).call(this, Math.floor);
  }
  "LN()"() {
    return ge(this, Re, Tt).call(this, Math.log);
  }
  "LOG()"() {
    return ge(this, Re, Tt).call(this, Math.log10);
  }
  "RADIANS()"() {
    return ge(this, Re, Tt).call(this, (e) => e * Math.PI / 180);
  }
  "ROUND()"() {
    return ge(this, Re, Tt).call(this, Math.round);
  }
  "ROUND_NEAREST()"() {
    return ge(this, Re, Tt).call(this, Math.round);
  }
  "ROUND_EVEN()"() {
    return ge(this, Re, Tt).call(this, q0);
  }
  "SIGN()"() {
    return ge(this, Re, Tt).call(this, Math.sign);
  }
  "SIN()"() {
    return ge(this, Re, Tt).call(this, Math.sin);
  }
  "SQRT()"() {
    return ge(this, Re, Tt).call(this, Math.sqrt);
  }
  "TAN()"() {
    return ge(this, Re, Tt).call(this, Math.tan);
  }
  "TRUNC()"() {
    return ge(this, Re, Tt).call(this, Math.trunc);
  }
  //---- STRINGS:
  "LENGTH()"() {
    return ge(this, Re, Eo).call(this, u1);
  }
  "LOWER()"() {
    return ge(this, Re, Eo).call(this, (e) => e.toLowerCase());
  }
  "UPPER()"() {
    return ge(this, Re, Eo).call(this, (e) => e.toUpperCase());
  }
  //---- TYPES:
  "IS VALUED"() {
    return wc(p(this, tr).call(this));
  }
  "ISARRAY()"() {
    return ge(this, Re, pt).call(this, Array.isArray);
  }
  "ISATOM()"() {
    return ge(this, Re, pt).call(this, Bd);
  }
  "ISBOOLEAN()"() {
    return ge(this, Re, pt).call(this, Cd);
  }
  "ISNUMBER()"() {
    return ge(this, Re, pt).call(this, Nd);
  }
  "ISOBJECT()"() {
    return ge(this, Re, pt).call(this, Dd);
  }
  "ISSTRING()"() {
    return ge(this, Re, pt).call(this, Pd);
  }
  "ISVALUED()"() {
    return wc(p(this, tr).call(this));
  }
  "TOARRAY()"() {
    return ge(this, Re, pt).call(this, Fd);
  }
  "TOATOM()"() {
    return Fo(p(this, tr).call(this));
  }
  "TOBOOLEAN()"() {
    return ge(this, Re, pt).call(this, Ld);
  }
  "TONUMBER()"() {
    return ge(this, Re, pt).call(this, qd);
  }
  "TOOBJECT()"() {
    return ge(this, Re, pt).call(this, Md);
  }
  "TOSTRING()"() {
    return ge(this, Re, pt).call(this, Ud);
  }
  "IS_ARRAY()"() {
    return ge(this, Re, pt).call(this, Array.isArray);
  }
  "IS_ATOM()"() {
    return ge(this, Re, pt).call(this, Bd);
  }
  "IS_BOOLEAN()"() {
    return ge(this, Re, pt).call(this, Cd);
  }
  "IS_NUMBER()"() {
    return ge(this, Re, pt).call(this, Nd);
  }
  "IS_OBJECT()"() {
    return ge(this, Re, pt).call(this, Dd);
  }
  "IS_STRING()"() {
    return ge(this, Re, pt).call(this, Pd);
  }
  "IS_VALUED()"() {
    return wc(p(this, tr).call(this));
  }
  "TO_ARRAY()"() {
    return ge(this, Re, pt).call(this, Fd);
  }
  "TO_ATOM()"() {
    return Fo(p(this, tr).call(this));
  }
  "TO_BOOLEAN()"() {
    return ge(this, Re, pt).call(this, Ld);
  }
  "TO_NUMBER()"() {
    return ge(this, Re, pt).call(this, qd);
  }
  "TO_OBJECT()"() {
    return ge(this, Re, pt).call(this, Md);
  }
  "TO_STRING()"() {
    return ge(this, Re, pt).call(this, Ud);
  }
  "TYPE()"() {
    return $d(p(this, tr).call(this));
  }
  "TYPENAME()"() {
    return $d(p(this, tr).call(this));
  }
}
Re = new WeakSet(), pt = function(e) {
  const t = p(this, tr).call(this);
  if (t !== void 0)
    return t === null ? null : e(t);
}, /** This is unaryOp further specialized for numeric functions. */
Tt = function(e) {
  const t = p(this, tr).call(this);
  return typeof t == "number" ? e(t) : t === void 0 ? void 0 : null;
}, /** This is unaryOp further specialized for string functions. */
Eo = function(e) {
  const t = p(this, tr).call(this);
  return typeof t == "string" ? e(t) : t === void 0 ? void 0 : null;
}, tr = new WeakMap();
var ut, Pr, Er, xs, Ur, $r;
class Qf {
  constructor(e, t) {
    ee(this, ut);
    ee(this, Ur);
    ee(this, $r);
    G(this, Ur, e), G(this, $r, t);
  }
  // Enables method lookup by name
  //---- ARRAYS:
  "ARRAY_CONTAINS()"() {
    return ge(this, ut, Pr).call(this, P0);
  }
  //---- COMPARISON:
  "="() {
    return ge(this, ut, Pr).call(this, Pn);
  }
  "!="() {
    return ge(this, ut, Pr).call(this, (e, t) => !Pn(e, t));
  }
  // These are undocumented but the N1QL test suite calls them...
  "EQ()"() {
    return ge(this, ut, Pr).call(this, (e, t) => Pn(e, t));
  }
  "LT()"() {
    return ge(this, ut, Pr).call(this, (e, t) => Yt(e, t) < 0);
  }
  "LE()"() {
    return ge(this, ut, Pr).call(this, (e, t) => Yt(e, t) <= 0);
  }
  "GT()"() {
    return ge(this, ut, Pr).call(this, (e, t) => Yt(e, t) > 0);
  }
  "GE()"() {
    return ge(this, ut, Pr).call(this, (e, t) => Yt(e, t) >= 0);
  }
  "<"() {
    return ge(this, ut, Pr).call(this, (e, t) => Yt(e, t) < 0);
  }
  "<="() {
    return ge(this, ut, Pr).call(this, (e, t) => Yt(e, t) <= 0);
  }
  ">"() {
    return ge(this, ut, Pr).call(this, (e, t) => Yt(e, t) > 0);
  }
  ">="() {
    return ge(this, ut, Pr).call(this, (e, t) => Yt(e, t) >= 0);
  }
  "MISSINGIF()"() {
    return Wm(p(this, Ur).call(this), p(this, $r).call(this));
  }
  "NULLIF()"() {
    return Ym(p(this, Ur).call(this), p(this, $r).call(this));
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
    return ge(this, ut, Er).call(this, (e, t) => e + t);
  }
  "-"() {
    return ge(this, ut, Er).call(this, (e, t) => e - t);
  }
  "*"() {
    return ge(this, ut, Er).call(this, (e, t) => e * t);
  }
  "/"() {
    return ge(this, ut, Er).call(this, r1);
  }
  "%"() {
    return ge(this, ut, Er).call(this, (e, t) => e % t);
  }
  "ATAN2()"() {
    return ge(this, ut, Er).call(this, Math.atan2);
  }
  "POWER()"() {
    return ge(this, ut, Er).call(this, Math.pow);
  }
  "DIV()"() {
    return ge(this, ut, Er).call(this, (e, t) => e / t);
  }
  "IDIV()"() {
    return ge(this, ut, Er).call(this, s1);
  }
  "ROUND()"() {
    return ge(this, ut, Er).call(this, Td);
  }
  "ROUND_NEAREST()"() {
    return ge(this, ut, Er).call(this, Td);
  }
  "ROUND_EVEN()"() {
    return ge(this, ut, Er).call(this, q0);
  }
  "TRUNC()"() {
    return ge(this, ut, Er).call(this, a1);
  }
  "COSINE_DISTANCE()"() {
    return i1(p(this, Ur).call(this), p(this, $r).call(this));
  }
  //---- STRINGS:
  "||"() {
    return ge(this, ut, xs).call(this, (e, t) => e + t);
  }
  "CONTAINS()"() {
    return ge(this, ut, xs).call(this, (e, t) => e.includes(t));
  }
  "LTRIM()"() {
    return ge(this, ut, xs).call(this, U0);
  }
  "RTRIM()"() {
    return ge(this, ut, xs).call(this, $0);
  }
  "TRIM()"() {
    return ge(this, ut, xs).call(this, l1);
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
xs = function(e) {
  const t = p(this, Ur).call(this), r = p(this, $r).call(this);
  return typeof t == "string" && typeof r == "string" ? e(t, r) : t === void 0 || r === void 0 ? void 0 : null;
}, Ur = new WeakMap(), $r = new WeakMap();
const yy = {
  "ARRAY_AGG()": Mf,
  "AVG()": Zc,
  "COUNT()": Uf,
  "MAX()": $f,
  "MIN()": jf,
  "SUM()": Kf
}, gy = {
  ".": vI,
  "?": yI,
  "[]": iv,
  $: (n, e) => {
    const t = pi(n[1], "$");
    return e.parameterNames.add(t), () => {
      const r = e.parameters.get(t);
      if (r === void 0)
        throw new py(`undefined query parameter $${t}`);
      return r;
    };
  },
  "_.": ([n, e, t], r) => {
    const i = dt(e, r), a = pi(t, "2nd arg of '_.'");
    return () => {
      const u = i();
      return mI(u) ? u[a] : void 0;
    };
  },
  ANY: Oc,
  EVERY: Oc,
  "ANY AND EVERY": Oc,
  BETWEEN: sv,
  "BETWEEN()": sv,
  CASE: (n, e) => {
    const t = n.length - 1, r = Xr(n, e);
    return n[1] === null ? () => {
      let i;
      for (i = 1; i + 1 < t; i += 2)
        if (r[i]())
          return r[i + 1]();
      return i < t ? r[i]() : null;
    } : () => {
      const i = r[0]();
      let a;
      for (a = 1; a + 1 < t; a += 2)
        if (Pn(i, r[a]()))
          return r[a + 1]();
      return a < t ? r[a]() : null;
    };
  },
  EXISTS: (n, e) => {
    throw new Lr("sorry, EXISTS is currently unimplemented");
  },
  IN: lv,
  "NOT IN": lv,
  IS: cv,
  "IS NOT": cv,
  LIKE: fv,
  MISSING: () => () => {
  },
  //---- Functions with variable numbers of arguments or other special handling:
  "ARRAY()": iv,
  "E()": () => () => Math.E,
  "PI()": () => () => Math.PI,
  "CONCAT()": (n, e) => {
    const t = Xr(n, e);
    return () => {
      const r = [];
      for (const i of t) {
        const a = i();
        if (a === void 0) return;
        if (typeof a != "string") return null;
        r.push(a);
      }
      return r.join("");
    };
  },
  "DATE_ADD_MILLIS()": ov,
  "DATE_ADD_STR()": ov,
  "DATE_DIFF_MILLIS()": uv,
  "DATE_DIFF_STR()": uv,
  "MILLIS_TO_STR()": hv,
  "MILLIS_TO_UTC()": hv,
  "STR_TO_MILLIS()": pv,
  "STR_TO_UTC()": pv,
  "MILLIS_TO_TZ()": ([n, e, t], r) => {
    const i = dt(e, r), a = dt(t, r);
    return () => {
      const u = i(), l = a();
      return typeof u != "number" || typeof l != "string" ? null : L0(u, l);
    };
  },
  "STR_TO_TZ()": ([n, e, t], r) => {
    const i = dt(e, r), a = dt(t, r);
    return () => {
      const u = i(), l = a();
      return typeof u != "string" || typeof l != "string" ? null : t1(u, l);
    };
  },
  "EUCLIDEAN_DISTANCE()": ([n, e, t, r], i) => {
    const a = dt(e, i), u = dt(t, i);
    return r !== void 0 && (r = dv(r, "3rd arg (power) to EUCLIDEAN_DISTANCE()")), () => n1(a(), u(), r);
  },
  "GREATEST()": (n, e) => {
    const t = Xr(n, e);
    return () => Rd(t, 1);
  },
  "IFMISSING()": (n, e) => {
    const t = Xr(n, e);
    return () => {
      for (const r of t) {
        const i = r();
        if (i !== void 0) return i;
      }
      return null;
    };
  },
  "IFNULL()": (n, e) => {
    const t = Xr(n, e);
    return () => {
      for (const r of t) {
        const i = r();
        if (i !== null) return i;
      }
      return null;
    };
  },
  "IFMISSINGORNULL()": av,
  "COALESCE()": av,
  "LEAST()": (n, e) => {
    const t = Xr(n, e);
    return () => Rd(t, -1);
  },
  "LIKE()": fv,
  "META()": ([n, e, t], r) => (e = pi(e, "data source in 'META()'"), yi(
    r.sourceTypes.get(e) !== "unnest",
    "META() cannot be used on an UNNEST"
  ), t !== void 0 && yi(
    ["id", "sequence", "deleted", "expires"].includes(t),
    `invalid META() property "${t}"`
  ), () => {
    var a;
    let i = (a = r.row) == null ? void 0 : a.getSourceRevision(e);
    if (i === void 0 || i.id === void 0)
      throw new Jf(`"META(${e})" is not available`);
    switch (t) {
      case "id":
        return i.id;
      case "sequence":
        return i.seq;
      case "deleted":
        return ((i.flags ?? 0) & gr) !== 0;
      case "expires":
        return i.expires;
      case void 0: {
        const u = {
          id: i.id,
          sequence: i.seq
        };
        return xa(i) && (u.deleted = !0), i.expires !== void 0 && (u.expires = i.expires), u;
      }
      default:
        return;
    }
  }),
  "REGEXP_CONTAINS()": Rc,
  "REGEXP_LIKE()": Rc,
  "REGEXP_POSITION()": Rc,
  "REGEXP_REPLACE()": ([n, e, t, r, i], a) => {
    const u = dt(e, a), l = RegExp(pi(t, "arg 2 of REGEXP_REPLACE()"), "g"), c = dt(r, a), _ = i !== void 0 ? dv(i, "arg 4 of REGEXP_REPLACE()") : 1e9;
    return () => {
      const m = u(), w = c();
      if (typeof m != "string" || typeof w != "string")
        return m;
      let E = 1;
      return m.replace(l, (k) => E++ <= _ ? w : k);
    };
  }
};
function Oc([n, e, t, r], i) {
  const a = n === "ANY", u = n === "ANY AND EVERY";
  e = pi(e, `variable name in ${n}`);
  const l = dt(t, i), c = dt(r, i);
  return () => {
    const _ = l();
    if (!Array.isArray(_) || u && _.length === 0)
      return !1;
    try {
      for (const m of _)
        if (i.variables[e] = m, c()) {
          if (a) return !0;
        } else if (!a) return !1;
      return !a;
    } finally {
      delete i.variables[e];
    }
  };
}
function iv(n, e) {
  if (my(n)) {
    const t = n.slice(1);
    return Object.freeze(t), () => t;
  } else {
    const t = Xr(n, e);
    return () => {
      const r = [];
      for (const i of t) {
        const a = i();
        if (a === void 0) return;
        r.push(a);
      }
      return r;
    };
  }
}
function sv([n, e, t, r], i) {
  const a = dt(e, i), u = dt(t, i), l = dt(r, i);
  return () => {
    let c = a(), _ = u(), m = l();
    if (!(c === void 0 || _ === void 0 || m === void 0))
      return c === null || _ === null || m === null ? null : Yt(_, c) <= 0 && Yt(m, c) >= 0;
  };
}
function av(n, e) {
  const t = Xr(n, e);
  return () => {
    for (const r of t) {
      const i = r();
      if (i != null) return i;
    }
    return null;
  };
}
function ov(n, e) {
  const t = Xr(n, e);
  return () => {
    const r = t[0](), i = t[1](), a = t[2]();
    return typeof r != "string" && typeof r != "number" || typeof i != "number" || typeof a != "string" ? null : Zm(r, i, a);
  };
}
function uv(n, e) {
  const t = Xr(n, e);
  return () => {
    const r = t[0](), i = t[1](), a = t[2]();
    return typeof r != "string" && typeof r != "number" || typeof i != "string" && typeof i != "number" || typeof a != "string" ? null : Qm(r, i, a);
  };
}
function dI(n, e) {
  const t = /* @__PURE__ */ new Map();
  let r = !1;
  for (const i of Object.getOwnPropertyNames(n)) {
    const a = n[i];
    Va(a) ? t.set(i, a) : (t.set(i, dt(a, e)), r = !0);
  }
  return r ? () => {
    const i = {};
    for (let [a, u] of t) {
      let l;
      if (typeof u == "function") {
        if (l = u(), l === void 0) continue;
      } else
        l = u;
      i[a] = l;
    }
    return i;
  } : (Object.freeze(n), () => n);
}
function lv([n, e, t], r) {
  yi(Array.isArray(t), "invalid right-hand-side of IN");
  const i = n === "IN", a = dt(e, r);
  if (t[0] === "[]")
    if (my(t)) {
      const u = new Set(t.slice(1));
      return () => {
        const l = a();
        return l == null ? l : u.has(l) === i;
      };
    } else {
      const u = t.map((l) => dt(l, r));
      return () => {
        const l = a();
        return l == null ? l : u.some((c) => Pn(c(), l)) === i;
      };
    }
  else {
    const u = dt(t, r);
    return () => {
      const l = a(), c = u();
      if (!(l === void 0 || c === void 0))
        return l === null || !Array.isArray(c) ? null : P0(c, l) === i;
    };
  }
}
function cv([n, e, t], r) {
  const i = n === "IS", a = dt(e, r);
  if (t === null)
    return () => {
      const u = a();
      return u === void 0 ? void 0 : u === null === i;
    };
  if (Array.isArray(t) && t[0] === "MISSING")
    return () => a() === void 0 === i;
  {
    const u = dt(t, r);
    return () => Pn(a(), u()) === i;
  }
}
function fv([n, e, t], r) {
  const i = dt(e, r);
  if (typeof t == "string") {
    const [a, u] = qf(t);
    switch (a) {
      case 0:
        return () => bo(i, (l) => l === u);
      case 1:
        return () => bo(i, (l) => l.startsWith(u));
      case 2:
        return () => bo(i, (l) => l.endsWith(u));
      default: {
        const l = M0(u);
        return () => bo(i, (c) => l.test(c));
      }
    }
  } else {
    const a = dt(t, r);
    return () => gI(i, a, o1);
  }
}
function vI([n, e, ...t], r) {
  e = pi(e, "data source in '.'");
  const i = t, a = r.results.get(e);
  if (a !== void 0)
    return i.length === 0 ? a : () => af(i, a());
  {
    const u = r.sourceTypes.get(e) !== "unnest";
    return () => {
      var c;
      let l = (c = r.row) == null ? void 0 : c.dataSources.get(e);
      if (l === void 0)
        throw new Jf(`"${e}" is not available, in property "${e}.${i.join(".")}"`);
      return l = u ? l.body : l, af(i, l);
    };
  }
}
function hv([n, e, t], r) {
  yi(t === void 0, `format strings are not supported in ${n}`);
  const i = dt(e, r), a = n === "MILLIS_TO_STR()" ? F0 : Ff;
  return () => {
    const u = i();
    return typeof u != "number" ? null : a(u);
  };
}
function pv([n, e, t], r) {
  yi(t === void 0, `format strings are not supported in ${n}`);
  const i = dt(e, r), a = n === "STR_TO_MILLIS()" ? Xm : e1;
  return () => {
    const u = i();
    return typeof u != "string" ? null : a(u);
  };
}
function Rc([n, e, t], r) {
  const i = dt(e, r);
  let a = pi(t, `arg 2 of ${n}`);
  n === "REGEXP_LIKE()" && (a = `^${a}$`);
  let u;
  try {
    u = RegExp(a);
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
function yI(n, e) {
  const t = pi(n[1], "?"), r = n.slice(2);
  return () => {
    const i = e.variables[t];
    if (i === void 0) throw new Lr(`undefined variable ?${t}`);
    return af(r, i);
  };
}
function af(n, e) {
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
function yi(n, e) {
  if (!n)
    throw new Lr(e);
}
function dv(n, e) {
  return yi(typeof n == "number", `${e} must be a number`), n;
}
function pi(n, e) {
  return yi(typeof n == "string", `${e} must be a string`), n;
}
function Xr(n, e) {
  return n.slice(1).map((t) => dt(t, e));
}
function my(n) {
  return n.every(Va);
}
function bo(n, e) {
  const t = n();
  return typeof t == "string" ? e(t) : t === void 0 ? void 0 : null;
}
function gI(n, e, t) {
  const r = n(), i = e();
  return typeof r == "string" && typeof i == "string" ? t(r, i) : r === void 0 || i === void 0 ? void 0 : null;
}
function mI(n) {
  return typeof n == "object" && !Array.isArray(n) && n !== null;
}
var Pi;
class Uo {
  constructor() {
    pe(this, "sourceTypes", /* @__PURE__ */ new Map());
    // Types of the data sources
    pe(this, "parameterNames", /* @__PURE__ */ new Set());
    // Names of all "$" parameters
    pe(this, "variables", {});
    // "?" variables inside ANY/EVERY
    pe(this, "results", /* @__PURE__ */ new Map());
    // Maps result alias to expression
    pe(this, "parameters", /* @__PURE__ */ new Map());
    // query parameters, set at runtime
    /** Per-row state. Only exists while processing a row during a query. */
    pe(this, "row");
    pe(this, "allowCompilingAggregates", !1);
    ee(this, Pi, []);
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
    const t = p(this, Pi).length;
    return p(this, Pi).push(e), () => {
      var i;
      const r = (i = this.row) == null ? void 0 : i.aggregates;
      return mr(
        r !== void 0,
        "aggregate function called outside aggregation context"
      ), r[t].result;
    };
  }
  get hasAggregators() {
    return p(this, Pi).length > 0;
  }
  /** Returns a copy of the `aggregatorsTemplate`. */
  copyAggregates() {
    return p(this, Pi).map((e) => e.clone());
  }
}
Pi = new WeakMap();
class fa {
  constructor(e) {
    pe(this, "dataSources", /* @__PURE__ */ new Map());
    pe(this, "aggregates");
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
    let e = new fa(this.ctx);
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
        return "$" + vv(n);
      case "?":
        return n[1];
      case "MISSING":
        return e;
      case "NOT":
        return "NOT " + Bt(n[1]);
      case ".":
        return n.length === 2 ? n[1] + ".*" : vv(n);
      case "META()": {
        let t = `META(${n[1]})`;
        return n[2] && (t += "." + n[2]), t;
      }
      default:
        return e.endsWith("()") ? e.slice(0, -2) + "(" + n.slice(1).map(Bt).join(", ") + ")" : fI(e) ? Bt(n[1]) + " " + e + " " + Bt(n[2]) : e === "-" || e === "+" ? e + Bt(n[1]) : e + "[" + n.slice(1).map(Bt).join(", ") + "]";
    }
  } else return Va(n) ? JSON.stringify(n) : "{" + Object.getOwnPropertyNames(n).map((e) => JSON.stringify(e) + ": " + Bt(n[e])).join(", ") + "}";
}
function vv(n) {
  return n.slice(1).map((e) => typeof e == "number" ? `[${e}]` : e).join(".");
}
class Iy {
  constructor(e, t) {
    this.sourceExpression = e, this.key = t;
  }
}
class Ja extends Iy {
  get includeMin() {
    return !0;
  }
  get includeMax() {
    return !0;
  }
}
class yv extends Ja {
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
    const t = $o(this.value());
    return t !== void 0 ? e.equals(t) : void 0;
  }
  toString() {
    return `${this.key} = ${Bt(this.valueExpr)}`;
  }
}
class II extends Ja {
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
class Tc extends Ja {
  constructor(e, t, r, i, a = !0, u = !0) {
    super(e, t), this.minValueExpr = r, this.maxValueExpr = i, this.includeMin_ = a, this.includeMax_ = u, Me(r || i);
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
    const t = $o(this.minValue), r = $o(this.maxValue);
    return this.minValueExpr ? t === void 0 ? void 0 : this.maxValueExpr !== void 0 ? r === void 0 ? void 0 : e.between(t, r, this.includeMin, this.includeMax) : this.includeMin ? e.aboveOrEqual(t) : e.above(t) : this.maxValueExpr !== void 0 ? r === void 0 ? void 0 : this.includeMax ? e.belowOrEqual(r) : e.below(r) : void 0;
  }
  toString() {
    const e = this.minValueExpr ? Bt(this.minValueExpr) : "", t = this.maxValueExpr ? Bt(this.maxValueExpr) : "", r = this.includeMin ? "[" : "(", i = this.includeMax ? "]" : ")";
    return `${this.key} in range ${r}${e} ... ${t}${i}`;
  }
}
function $o(n) {
  return typeof n == "number" || typeof n == "string" || Array.isArray(n) ? n : void 0;
}
class Cc extends Iy {
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
    const t = $o(this.itemValue());
    return t !== void 0 ? e.equals(t).distinct() : void 0;
  }
  toString() {
    return `${Bt(this.itemExpr)} IN ${this.key}`;
  }
}
var So = { exports: {} }, bI = So.exports, gv;
function _I() {
  return gv || (gv = 1, function(n, e) {
    (function(t, r) {
      n.exports = r();
    })(bI, function() {
      var t = function(s, o) {
        return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(h, y) {
          h.__proto__ = y;
        } || function(h, y) {
          for (var I in y) Object.prototype.hasOwnProperty.call(y, I) && (h[I] = y[I]);
        })(s, o);
      }, r = function() {
        return (r = Object.assign || function(s) {
          for (var o, h = 1, y = arguments.length; h < y; h++) for (var I in o = arguments[h]) Object.prototype.hasOwnProperty.call(o, I) && (s[I] = o[I]);
          return s;
        }).apply(this, arguments);
      };
      function i(s, o, h) {
        for (var y, I = 0, x = o.length; I < x; I++) !y && I in o || ((y = y || Array.prototype.slice.call(o, 0, I))[I] = o[I]);
        return s.concat(y || Array.prototype.slice.call(o));
      }
      var a = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : If, u = Object.keys, l = Array.isArray;
      function c(s, o) {
        return typeof o != "object" || u(o).forEach(function(h) {
          s[h] = o[h];
        }), s;
      }
      typeof Promise > "u" || a.Promise || (a.Promise = Promise);
      var _ = Object.getPrototypeOf, m = {}.hasOwnProperty;
      function w(s, o) {
        return m.call(s, o);
      }
      function E(s, o) {
        typeof o == "function" && (o = o(_(s))), (typeof Reflect > "u" ? u : Reflect.ownKeys)(o).forEach(function(h) {
          D(s, h, o[h]);
        });
      }
      var k = Object.defineProperty;
      function D(s, o, h, y) {
        k(s, o, c(h && w(h, "get") && typeof h.get == "function" ? { get: h.get, set: h.set, configurable: !0 } : { value: h, configurable: !0, writable: !0 }, y));
      }
      function K(s) {
        return { from: function(o) {
          return s.prototype = Object.create(o.prototype), D(s.prototype, "constructor", s), { extend: E.bind(null, s.prototype) };
        } };
      }
      var C = Object.getOwnPropertyDescriptor, M = [].slice;
      function J(s, o, h) {
        return M.call(s, o, h);
      }
      function X(s, o) {
        return o(s);
      }
      function le(s) {
        if (!s) throw new Error("Assertion Failed");
      }
      function ce(s) {
        a.setImmediate ? setImmediate(s) : setTimeout(s, 0);
      }
      function fe(s, o) {
        if (typeof o == "string" && w(s, o)) return s[o];
        if (!o) return s;
        if (typeof o != "string") {
          for (var h = [], y = 0, I = o.length; y < I; ++y) {
            var x = fe(s, o[y]);
            h.push(x);
          }
          return h;
        }
        var O = o.indexOf(".");
        if (O !== -1) {
          var N = s[o.substr(0, O)];
          return N == null ? void 0 : fe(N, o.substr(O + 1));
        }
      }
      function ae(s, o, h) {
        if (s && o !== void 0 && !("isFrozen" in Object && Object.isFrozen(s))) if (typeof o != "string" && "length" in o) {
          le(typeof h != "string" && "length" in h);
          for (var y = 0, I = o.length; y < I; ++y) ae(s, o[y], h[y]);
        } else {
          var x, O, N = o.indexOf(".");
          N !== -1 ? (x = o.substr(0, N), (O = o.substr(N + 1)) === "" ? h === void 0 ? l(s) && !isNaN(parseInt(x)) ? s.splice(x, 1) : delete s[x] : s[x] = h : ae(N = !(N = s[x]) || !w(s, x) ? s[x] = {} : N, O, h)) : h === void 0 ? l(s) && !isNaN(parseInt(o)) ? s.splice(o, 1) : delete s[o] : s[o] = h;
        }
      }
      function ke(s) {
        var o, h = {};
        for (o in s) w(s, o) && (h[o] = s[o]);
        return h;
      }
      var De = [].concat;
      function Ce(s) {
        return De.apply([], s);
      }
      var Zt = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(Ce([8, 16, 32, 64].map(function(s) {
        return ["Int", "Uint", "Float"].map(function(o) {
          return o + s + "Array";
        });
      }))).filter(function(s) {
        return a[s];
      }), $e = new Set(Zt.map(function(s) {
        return a[s];
      })), Be = null;
      function Se(s) {
        return Be = /* @__PURE__ */ new WeakMap(), s = function o(h) {
          if (!h || typeof h != "object") return h;
          var y = Be.get(h);
          if (y) return y;
          if (l(h)) {
            y = [], Be.set(h, y);
            for (var I = 0, x = h.length; I < x; ++I) y.push(o(h[I]));
          } else if ($e.has(h.constructor)) y = h;
          else {
            var O, N = _(h);
            for (O in y = N === Object.prototype ? {} : Object.create(N), Be.set(h, y), h) w(h, O) && (y[O] = o(h[O]));
          }
          return y;
        }(s), Be = null, s;
      }
      var Ue = {}.toString;
      function at(s) {
        return Ue.call(s).slice(8, -1);
      }
      var vt = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", we = typeof vt == "symbol" ? function(s) {
        var o;
        return s != null && (o = s[vt]) && o.apply(s);
      } : function() {
        return null;
      };
      function He(s, o) {
        return o = s.indexOf(o), 0 <= o && s.splice(o, 1), 0 <= o;
      }
      var Ke = {};
      function It(s) {
        var o, h, y, I;
        if (arguments.length === 1) {
          if (l(s)) return s.slice();
          if (this === Ke && typeof s == "string") return [s];
          if (I = we(s)) {
            for (h = []; !(y = I.next()).done; ) h.push(y.value);
            return h;
          }
          if (s == null) return [s];
          if (typeof (o = s.length) != "number") return [s];
          for (h = new Array(o); o--; ) h[o] = s[o];
          return h;
        }
        for (o = arguments.length, h = new Array(o); o--; ) h[o] = arguments[o];
        return h;
      }
      var Ve = typeof Symbol < "u" ? function(s) {
        return s[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, _t = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], qr = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(_t), Xe = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function Ze(s, o) {
        this.name = s, this.message = o;
      }
      function wt(s, o) {
        return s + ". Errors: " + Object.keys(o).map(function(h) {
          return o[h].toString();
        }).filter(function(h, y, I) {
          return I.indexOf(h) === y;
        }).join(`
`);
      }
      function yt(s, o, h, y) {
        this.failures = o, this.failedKeys = y, this.successCount = h, this.message = wt(s, o);
      }
      function We(s, o) {
        this.name = "BulkError", this.failures = Object.keys(o).map(function(h) {
          return o[h];
        }), this.failuresByPos = o, this.message = wt(s, this.failures);
      }
      K(Ze).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), K(yt).from(Ze), K(We).from(Ze);
      var lt = qr.reduce(function(s, o) {
        return s[o] = o + "Error", s;
      }, {}), Pe = Ze, he = qr.reduce(function(s, o) {
        var h = o + "Error";
        function y(I, x) {
          this.name = h, I ? typeof I == "string" ? (this.message = "".concat(I).concat(x ? `
 ` + x : ""), this.inner = x || null) : typeof I == "object" && (this.message = "".concat(I.name, " ").concat(I.message), this.inner = I) : (this.message = Xe[o] || h, this.inner = null);
        }
        return K(y).from(Pe), s[o] = y, s;
      }, {});
      he.Syntax = SyntaxError, he.Type = TypeError, he.Range = RangeError;
      var Fe = _t.reduce(function(s, o) {
        return s[o + "Error"] = he[o], s;
      }, {}), et = qr.reduce(function(s, o) {
        return ["Syntax", "Type", "Range"].indexOf(o) === -1 && (s[o + "Error"] = he[o]), s;
      }, {});
      function me() {
      }
      function je(s) {
        return s;
      }
      function gt(s, o) {
        return s == null || s === je ? o : function(h) {
          return o(s(h));
        };
      }
      function ht(s, o) {
        return function() {
          s.apply(this, arguments), o.apply(this, arguments);
        };
      }
      function ct(s, o) {
        return s === me ? o : function() {
          var h = s.apply(this, arguments);
          h !== void 0 && (arguments[0] = h);
          var y = this.onsuccess, I = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var x = o.apply(this, arguments);
          return y && (this.onsuccess = this.onsuccess ? ht(y, this.onsuccess) : y), I && (this.onerror = this.onerror ? ht(I, this.onerror) : I), x !== void 0 ? x : h;
        };
      }
      function st(s, o) {
        return s === me ? o : function() {
          s.apply(this, arguments);
          var h = this.onsuccess, y = this.onerror;
          this.onsuccess = this.onerror = null, o.apply(this, arguments), h && (this.onsuccess = this.onsuccess ? ht(h, this.onsuccess) : h), y && (this.onerror = this.onerror ? ht(y, this.onerror) : y);
        };
      }
      function Le(s, o) {
        return s === me ? o : function(h) {
          var y = s.apply(this, arguments);
          c(h, y);
          var I = this.onsuccess, x = this.onerror;
          return this.onsuccess = null, this.onerror = null, h = o.apply(this, arguments), I && (this.onsuccess = this.onsuccess ? ht(I, this.onsuccess) : I), x && (this.onerror = this.onerror ? ht(x, this.onerror) : x), y === void 0 ? h === void 0 ? void 0 : h : c(y, h);
        };
      }
      function kt(s, o) {
        return s === me ? o : function() {
          return o.apply(this, arguments) !== !1 && s.apply(this, arguments);
        };
      }
      function Ot(s, o) {
        return s === me ? o : function() {
          var h = s.apply(this, arguments);
          if (h && typeof h.then == "function") {
            for (var y = this, I = arguments.length, x = new Array(I); I--; ) x[I] = arguments[I];
            return h.then(function() {
              return o.apply(y, x);
            });
          }
          return o.apply(this, arguments);
        };
      }
      et.ModifyError = yt, et.DexieError = Ze, et.BulkError = We;
      var qe = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function Qe(s) {
        qe = s;
      }
      var Et = {}, Ft = 100, Zt = typeof Promise > "u" ? [] : function() {
        var s = Promise.resolve();
        if (typeof crypto > "u" || !crypto.subtle) return [s, _(s), s];
        var o = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [o, _(o), s];
      }(), _t = Zt[0], qr = Zt[1], Zt = Zt[2], qr = qr && qr.then, S = _t && _t.constructor, d = !!Zt, v = function(s, o) {
        b.push([s, o]), g && (queueMicrotask(Ee), g = !1);
      }, R = !0, g = !0, T = [], L = [], ue = je, B = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: me, pgp: !1, env: {}, finalize: me }, q = B, b = [], se = 0, Ne = [];
      function f(s) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var o = this._PSD = q;
        if (typeof s != "function") {
          if (s !== Et) throw new TypeError("Not a function");
          return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && A(this, this._value));
        }
        this._state = null, this._value = null, ++o.ref, function h(y, I) {
          try {
            I(function(x) {
              if (y._state === null) {
                if (x === y) throw new TypeError("A promise cannot be resolved with itself.");
                var O = y._lib && xe();
                x && typeof x.then == "function" ? h(y, function(N, U) {
                  x instanceof f ? x._then(N, U) : x.then(N, U);
                }) : (y._state = !0, y._value = x, F(y)), O && Je();
              }
            }, A.bind(null, y));
          } catch (x) {
            A(y, x);
          }
        }(this, s);
      }
      var te = { get: function() {
        var s = q, o = gn;
        function h(y, I) {
          var x = this, O = !s.global && (s !== q || o !== gn), N = O && !$t(), U = new f(function(j, W) {
            Z(x, new ie(lh(y, s, O, N), lh(I, s, O, N), j, W, s));
          });
          return this._consoleTask && (U._consoleTask = this._consoleTask), U;
        }
        return h.prototype = Et, h;
      }, set: function(s) {
        D(this, "then", s && s.prototype === Et ? te : { get: function() {
          return s;
        }, set: te.set });
      } };
      function ie(s, o, h, y, I) {
        this.onFulfilled = typeof s == "function" ? s : null, this.onRejected = typeof o == "function" ? o : null, this.resolve = h, this.reject = y, this.psd = I;
      }
      function A(s, o) {
        var h, y;
        L.push(o), s._state === null && (h = s._lib && xe(), o = ue(o), s._state = !1, s._value = o, y = s, T.some(function(I) {
          return I._value === y._value;
        }) || T.push(y), F(s), h && Je());
      }
      function F(s) {
        var o = s._listeners;
        s._listeners = [];
        for (var h = 0, y = o.length; h < y; ++h) Z(s, o[h]);
        var I = s._PSD;
        --I.ref || I.finalize(), se === 0 && (++se, v(function() {
          --se == 0 && Tr();
        }, []));
      }
      function Z(s, o) {
        if (s._state !== null) {
          var h = s._state ? o.onFulfilled : o.onRejected;
          if (h === null) return (s._state ? o.resolve : o.reject)(s._value);
          ++o.psd.ref, ++se, v(Oe, [h, s, o]);
        } else s._listeners.push(o);
      }
      function Oe(s, o, h) {
        try {
          var y, I = o._value;
          !o._state && L.length && (L = []), y = qe && o._consoleTask ? o._consoleTask.run(function() {
            return s(I);
          }) : s(I), o._state || L.indexOf(I) !== -1 || function(x) {
            for (var O = T.length; O; ) if (T[--O]._value === x._value) return T.splice(O, 1);
          }(o), h.resolve(y);
        } catch (x) {
          h.reject(x);
        } finally {
          --se == 0 && Tr(), --h.psd.ref || h.psd.finalize();
        }
      }
      function Ee() {
        wi(B, function() {
          xe() && Je();
        });
      }
      function xe() {
        var s = R;
        return g = R = !1, s;
      }
      function Je() {
        var s, o, h;
        do
          for (; 0 < b.length; ) for (s = b, b = [], h = s.length, o = 0; o < h; ++o) {
            var y = s[o];
            y[0].apply(null, y[1]);
          }
        while (0 < b.length);
        g = R = !0;
      }
      function Tr() {
        var s = T;
        T = [], s.forEach(function(y) {
          y._PSD.onunhandled.call(null, y._value, y);
        });
        for (var o = Ne.slice(0), h = o.length; h; ) o[--h]();
      }
      function bt(s) {
        return new f(Et, !1, s);
      }
      function Te(s, o) {
        var h = q;
        return function() {
          var y = xe(), I = q;
          try {
            return Fn(h, !0), s.apply(this, arguments);
          } catch (x) {
            o && o(x);
          } finally {
            Fn(I, !1), y && Je();
          }
        };
      }
      E(f.prototype, { then: te, _then: function(s, o) {
        Z(this, new ie(null, null, s, o, q));
      }, catch: function(s) {
        if (arguments.length === 1) return this.then(null, s);
        var o = s, h = arguments[1];
        return typeof o == "function" ? this.then(null, function(y) {
          return (y instanceof o ? h : bt)(y);
        }) : this.then(null, function(y) {
          return (y && y.name === o ? h : bt)(y);
        });
      }, finally: function(s) {
        return this.then(function(o) {
          return f.resolve(s()).then(function() {
            return o;
          });
        }, function(o) {
          return f.resolve(s()).then(function() {
            return bt(o);
          });
        });
      }, timeout: function(s, o) {
        var h = this;
        return s < 1 / 0 ? new f(function(y, I) {
          var x = setTimeout(function() {
            return I(new he.Timeout(o));
          }, s);
          h.then(y, I).finally(clearTimeout.bind(null, x));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && D(f.prototype, Symbol.toStringTag, "Dexie.Promise"), B.env = uh(), E(f, { all: function() {
        var s = It.apply(null, arguments).map(cr);
        return new f(function(o, h) {
          s.length === 0 && o([]);
          var y = s.length;
          s.forEach(function(I, x) {
            return f.resolve(I).then(function(O) {
              s[x] = O, --y || o(s);
            }, h);
          });
        });
      }, resolve: function(s) {
        return s instanceof f ? s : s && typeof s.then == "function" ? new f(function(o, h) {
          s.then(o, h);
        }) : new f(Et, !0, s);
      }, reject: bt, race: function() {
        var s = It.apply(null, arguments).map(cr);
        return new f(function(o, h) {
          s.map(function(y) {
            return f.resolve(y).then(o, h);
          });
        });
      }, PSD: { get: function() {
        return q;
      }, set: function(s) {
        return q = s;
      } }, totalEchoes: { get: function() {
        return gn;
      } }, newPSD: Nt, usePSD: wi, scheduler: { get: function() {
        return v;
      }, set: function(s) {
        v = s;
      } }, rejectionMapper: { get: function() {
        return ue;
      }, set: function(s) {
        ue = s;
      } }, follow: function(s, o) {
        return new f(function(h, y) {
          return Nt(function(I, x) {
            var O = q;
            O.unhandleds = [], O.onunhandled = x, O.finalize = ht(function() {
              var N, U = this;
              N = function() {
                U.unhandleds.length === 0 ? I() : x(U.unhandleds[0]);
              }, Ne.push(function j() {
                N(), Ne.splice(Ne.indexOf(j), 1);
              }), ++se, v(function() {
                --se == 0 && Tr();
              }, []);
            }, O.finalize), s();
          }, o, h, y);
        });
      } }), S && (S.allSettled && D(f, "allSettled", function() {
        var s = It.apply(null, arguments).map(cr);
        return new f(function(o) {
          s.length === 0 && o([]);
          var h = s.length, y = new Array(h);
          s.forEach(function(I, x) {
            return f.resolve(I).then(function(O) {
              return y[x] = { status: "fulfilled", value: O };
            }, function(O) {
              return y[x] = { status: "rejected", reason: O };
            }).then(function() {
              return --h || o(y);
            });
          });
        });
      }), S.any && typeof AggregateError < "u" && D(f, "any", function() {
        var s = It.apply(null, arguments).map(cr);
        return new f(function(o, h) {
          s.length === 0 && h(new AggregateError([]));
          var y = s.length, I = new Array(y);
          s.forEach(function(x, O) {
            return f.resolve(x).then(function(N) {
              return o(N);
            }, function(N) {
              I[O] = N, --y || h(new AggregateError(I));
            });
          });
        });
      }), S.withResolvers && (f.withResolvers = S.withResolvers));
      var tt = { awaits: 0, echoes: 0, id: 0 }, Ut = 0, qt = [], yn = 0, gn = 0, Rt = 0;
      function Nt(s, o, h, y) {
        var I = q, x = Object.create(I);
        return x.parent = I, x.ref = 0, x.global = !1, x.id = ++Rt, B.env, x.env = d ? { Promise: f, PromiseProp: { value: f, configurable: !0, writable: !0 }, all: f.all, race: f.race, allSettled: f.allSettled, any: f.any, resolve: f.resolve, reject: f.reject } : {}, o && c(x, o), ++I.ref, x.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, y = wi(x, s, h, y), x.ref === 0 && x.finalize(), y;
      }
      function St() {
        return tt.id || (tt.id = ++Ut), ++tt.awaits, tt.echoes += Ft, tt.id;
      }
      function $t() {
        return !!tt.awaits && (--tt.awaits == 0 && (tt.id = 0), tt.echoes = tt.awaits * Ft, !0);
      }
      function cr(s) {
        return tt.echoes && s && s.constructor === S ? (St(), s.then(function(o) {
          return $t(), o;
        }, function(o) {
          return $t(), Pt(o);
        })) : s;
      }
      function Za() {
        var s = qt[qt.length - 1];
        qt.pop(), Fn(s, !1);
      }
      function Fn(s, o) {
        var h, y = q;
        (o ? !tt.echoes || yn++ && s === q : !yn || --yn && s === q) || queueMicrotask(o ? (function(I) {
          ++gn, tt.echoes && --tt.echoes != 0 || (tt.echoes = tt.awaits = tt.id = 0), qt.push(q), Fn(I, !0);
        }).bind(null, s) : Za), s !== q && (q = s, y === B && (B.env = uh()), d && (h = B.env.Promise, o = s.env, (y.global || s.global) && (Object.defineProperty(a, "Promise", o.PromiseProp), h.all = o.all, h.race = o.race, h.resolve = o.resolve, h.reject = o.reject, o.allSettled && (h.allSettled = o.allSettled), o.any && (h.any = o.any))));
      }
      function uh() {
        var s = a.Promise;
        return d ? { Promise: s, PromiseProp: Object.getOwnPropertyDescriptor(a, "Promise"), all: s.all, race: s.race, allSettled: s.allSettled, any: s.any, resolve: s.resolve, reject: s.reject } : {};
      }
      function wi(s, o, h, y, I) {
        var x = q;
        try {
          return Fn(s, !0), o(h, y, I);
        } finally {
          Fn(x, !1);
        }
      }
      function lh(s, o, h, y) {
        return typeof s != "function" ? s : function() {
          var I = q;
          h && St(), Fn(o, !0);
          try {
            return s.apply(this, arguments);
          } finally {
            Fn(I, !1), y && queueMicrotask($t);
          }
        };
      }
      function lu(s) {
        Promise === S && tt.echoes === 0 ? yn === 0 ? s() : enqueueNativeMicroTask(s) : setTimeout(s, 0);
      }
      ("" + qr).indexOf("[native code]") === -1 && (St = $t = me);
      var Pt = f.reject, xi = "￿", mn = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", ch = "String expected.", ys = [], Qa = "__dbnames", cu = "readonly", fu = "readwrite";
      function Ei(s, o) {
        return s ? o ? function() {
          return s.apply(this, arguments) && o.apply(this, arguments);
        } : s : o;
      }
      var fh = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function Xa(s) {
        return typeof s != "string" || /\./.test(s) ? function(o) {
          return o;
        } : function(o) {
          return o[s] === void 0 && s in o && delete (o = Se(o))[s], o;
        };
      }
      function hh() {
        throw he.Type();
      }
      function ot(s, o) {
        try {
          var h = ph(s), y = ph(o);
          if (h !== y) return h === "Array" ? 1 : y === "Array" ? -1 : h === "binary" ? 1 : y === "binary" ? -1 : h === "string" ? 1 : y === "string" ? -1 : h === "Date" ? 1 : y !== "Date" ? NaN : -1;
          switch (h) {
            case "number":
            case "Date":
            case "string":
              return o < s ? 1 : s < o ? -1 : 0;
            case "binary":
              return function(I, x) {
                for (var O = I.length, N = x.length, U = O < N ? O : N, j = 0; j < U; ++j) if (I[j] !== x[j]) return I[j] < x[j] ? -1 : 1;
                return O === N ? 0 : O < N ? -1 : 1;
              }(dh(s), dh(o));
            case "Array":
              return function(I, x) {
                for (var O = I.length, N = x.length, U = O < N ? O : N, j = 0; j < U; ++j) {
                  var W = ot(I[j], x[j]);
                  if (W !== 0) return W;
                }
                return O === N ? 0 : O < N ? -1 : 1;
              }(s, o);
          }
        } catch {
        }
        return NaN;
      }
      function ph(s) {
        var o = typeof s;
        return o != "object" ? o : ArrayBuffer.isView(s) ? "binary" : (s = at(s), s === "ArrayBuffer" ? "binary" : s);
      }
      function dh(s) {
        return s instanceof Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : new Uint8Array(s);
      }
      var vh = (xt.prototype._trans = function(s, o, h) {
        var y = this._tx || q.trans, I = this.name, x = qe && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(s === "readonly" ? "read" : "write", " ").concat(this.name));
        function O(j, W, P) {
          if (!P.schema[I]) throw new he.NotFound("Table " + I + " not part of transaction");
          return o(P.idbtrans, P);
        }
        var N = xe();
        try {
          var U = y && y.db._novip === this.db._novip ? y === q.trans ? y._promise(s, O, h) : Nt(function() {
            return y._promise(s, O, h);
          }, { trans: y, transless: q.transless || q }) : function j(W, P, V, $) {
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
          return x && (U._consoleTask = x, U = U.catch(function(j) {
            return console.trace(j), Pt(j);
          })), U;
        } finally {
          N && Je();
        }
      }, xt.prototype.get = function(s, o) {
        var h = this;
        return s && s.constructor === Object ? this.where(s).first(o) : s == null ? Pt(new he.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(y) {
          return h.core.get({ trans: y, key: s }).then(function(I) {
            return h.hook.reading.fire(I);
          });
        }).then(o);
      }, xt.prototype.where = function(s) {
        if (typeof s == "string") return new this.db.WhereClause(this, s);
        if (l(s)) return new this.db.WhereClause(this, "[".concat(s.join("+"), "]"));
        var o = u(s);
        if (o.length === 1) return this.where(o[0]).equals(s[o[0]]);
        var h = this.schema.indexes.concat(this.schema.primKey).filter(function(N) {
          if (N.compound && o.every(function(j) {
            return 0 <= N.keyPath.indexOf(j);
          })) {
            for (var U = 0; U < o.length; ++U) if (o.indexOf(N.keyPath[U]) === -1) return !1;
            return !0;
          }
          return !1;
        }).sort(function(N, U) {
          return N.keyPath.length - U.keyPath.length;
        })[0];
        if (h && this.db._maxKey !== xi) {
          var x = h.keyPath.slice(0, o.length);
          return this.where(x).equals(x.map(function(U) {
            return s[U];
          }));
        }
        !h && qe && console.warn("The query ".concat(JSON.stringify(s), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(o.join("+"), "]"));
        var y = this.schema.idxByName;
        function I(N, U) {
          return ot(N, U) === 0;
        }
        var O = o.reduce(function(P, U) {
          var j = P[0], W = P[1], P = y[U], V = s[U];
          return [j || P, j || !P ? Ei(W, P && P.multi ? function($) {
            return $ = fe($, U), l($) && $.some(function(H) {
              return I(V, H);
            });
          } : function($) {
            return I(V, fe($, U));
          }) : W];
        }, [null, null]), x = O[0], O = O[1];
        return x ? this.where(x.name).equals(s[x.keyPath]).filter(O) : h ? this.filter(O) : this.where(o).equals("");
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
        var o, h = this.db, y = this.name;
        function I() {
          return o !== null && o.apply(this, arguments) || this;
        }
        (this.schema.mappedClass = s).prototype instanceof hh && (function(U, j) {
          if (typeof j != "function" && j !== null) throw new TypeError("Class extends value " + String(j) + " is not a constructor or null");
          function W() {
            this.constructor = U;
          }
          t(U, j), U.prototype = j === null ? Object.create(j) : (W.prototype = j.prototype, new W());
        }(I, o = s), Object.defineProperty(I.prototype, "db", { get: function() {
          return h;
        }, enumerable: !1, configurable: !0 }), I.prototype.table = function() {
          return y;
        }, s = I);
        for (var x = /* @__PURE__ */ new Set(), O = s.prototype; O; O = _(O)) Object.getOwnPropertyNames(O).forEach(function(U) {
          return x.add(U);
        });
        function N(U) {
          if (!U) return U;
          var j, W = Object.create(s.prototype);
          for (j in U) if (!x.has(j)) try {
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
      }, xt.prototype.add = function(s, o) {
        var h = this, y = this.schema.primKey, I = y.auto, x = y.keyPath, O = s;
        return x && I && (O = Xa(x)(s)), this._trans("readwrite", function(N) {
          return h.core.mutate({ trans: N, type: "add", keys: o != null ? [o] : null, values: [O] });
        }).then(function(N) {
          return N.numFailures ? f.reject(N.failures[0]) : N.lastResult;
        }).then(function(N) {
          if (x) try {
            ae(s, x, N);
          } catch {
          }
          return N;
        });
      }, xt.prototype.update = function(s, o) {
        return typeof s != "object" || l(s) ? this.where(":id").equals(s).modify(o) : (s = fe(s, this.schema.primKey.keyPath), s === void 0 ? Pt(new he.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(s).modify(o));
      }, xt.prototype.put = function(s, o) {
        var h = this, y = this.schema.primKey, I = y.auto, x = y.keyPath, O = s;
        return x && I && (O = Xa(x)(s)), this._trans("readwrite", function(N) {
          return h.core.mutate({ trans: N, type: "put", values: [O], keys: o != null ? [o] : null });
        }).then(function(N) {
          return N.numFailures ? f.reject(N.failures[0]) : N.lastResult;
        }).then(function(N) {
          if (x) try {
            ae(s, x, N);
          } catch {
          }
          return N;
        });
      }, xt.prototype.delete = function(s) {
        var o = this;
        return this._trans("readwrite", function(h) {
          return o.core.mutate({ trans: h, type: "delete", keys: [s] });
        }).then(function(h) {
          return h.numFailures ? f.reject(h.failures[0]) : void 0;
        });
      }, xt.prototype.clear = function() {
        var s = this;
        return this._trans("readwrite", function(o) {
          return s.core.mutate({ trans: o, type: "deleteRange", range: fh });
        }).then(function(o) {
          return o.numFailures ? f.reject(o.failures[0]) : void 0;
        });
      }, xt.prototype.bulkGet = function(s) {
        var o = this;
        return this._trans("readonly", function(h) {
          return o.core.getMany({ keys: s, trans: h }).then(function(y) {
            return y.map(function(I) {
              return o.hook.reading.fire(I);
            });
          });
        });
      }, xt.prototype.bulkAdd = function(s, o, h) {
        var y = this, I = Array.isArray(o) ? o : void 0, x = (h = h || (I ? void 0 : o)) ? h.allKeys : void 0;
        return this._trans("readwrite", function(O) {
          var j = y.schema.primKey, N = j.auto, j = j.keyPath;
          if (j && I) throw new he.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (I && I.length !== s.length) throw new he.InvalidArgument("Arguments objects and keys must have the same length");
          var U = s.length, j = j && N ? s.map(Xa(j)) : s;
          return y.core.mutate({ trans: O, type: "add", keys: I, values: j, wantResults: x }).then(function(H) {
            var P = H.numFailures, V = H.results, $ = H.lastResult, H = H.failures;
            if (P === 0) return x ? V : $;
            throw new We("".concat(y.name, ".bulkAdd(): ").concat(P, " of ").concat(U, " operations failed"), H);
          });
        });
      }, xt.prototype.bulkPut = function(s, o, h) {
        var y = this, I = Array.isArray(o) ? o : void 0, x = (h = h || (I ? void 0 : o)) ? h.allKeys : void 0;
        return this._trans("readwrite", function(O) {
          var j = y.schema.primKey, N = j.auto, j = j.keyPath;
          if (j && I) throw new he.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (I && I.length !== s.length) throw new he.InvalidArgument("Arguments objects and keys must have the same length");
          var U = s.length, j = j && N ? s.map(Xa(j)) : s;
          return y.core.mutate({ trans: O, type: "put", keys: I, values: j, wantResults: x }).then(function(H) {
            var P = H.numFailures, V = H.results, $ = H.lastResult, H = H.failures;
            if (P === 0) return x ? V : $;
            throw new We("".concat(y.name, ".bulkPut(): ").concat(P, " of ").concat(U, " operations failed"), H);
          });
        });
      }, xt.prototype.bulkUpdate = function(s) {
        var o = this, h = this.core, y = s.map(function(O) {
          return O.key;
        }), I = s.map(function(O) {
          return O.changes;
        }), x = [];
        return this._trans("readwrite", function(O) {
          return h.getMany({ trans: O, keys: y, cache: "clone" }).then(function(N) {
            var U = [], j = [];
            s.forEach(function(P, V) {
              var $ = P.key, H = P.changes, Y = N[V];
              if (Y) {
                for (var z = 0, Q = Object.keys(H); z < Q.length; z++) {
                  var re = Q[z], ne = H[re];
                  if (re === o.schema.primKey.keyPath) {
                    if (ot(ne, $) !== 0) throw new he.Constraint("Cannot update primary key in bulkUpdate()");
                  } else ae(Y, re, ne);
                }
                x.push(V), U.push($), j.push(Y);
              }
            });
            var W = U.length;
            return h.mutate({ trans: O, type: "put", keys: U, values: j, updates: { keys: y, changeSpecs: I } }).then(function(P) {
              var V = P.numFailures, $ = P.failures;
              if (V === 0) return W;
              for (var H = 0, Y = Object.keys($); H < Y.length; H++) {
                var z, Q = Y[H], re = x[Number(Q)];
                re != null && (z = $[Q], delete $[Q], $[re] = z);
              }
              throw new We("".concat(o.name, ".bulkUpdate(): ").concat(V, " of ").concat(W, " operations failed"), $);
            });
          });
        });
      }, xt.prototype.bulkDelete = function(s) {
        var o = this, h = s.length;
        return this._trans("readwrite", function(y) {
          return o.core.mutate({ trans: y, type: "delete", keys: s });
        }).then(function(O) {
          var I = O.numFailures, x = O.lastResult, O = O.failures;
          if (I === 0) return x;
          throw new We("".concat(o.name, ".bulkDelete(): ").concat(I, " of ").concat(h, " operations failed"), O);
        });
      }, xt);
      function xt() {
      }
      function ha(s) {
        function o(O, N) {
          if (N) {
            for (var U = arguments.length, j = new Array(U - 1); --U; ) j[U - 1] = arguments[U];
            return h[O].subscribe.apply(null, j), s;
          }
          if (typeof O == "string") return h[O];
        }
        var h = {};
        o.addEventType = x;
        for (var y = 1, I = arguments.length; y < I; ++y) x(arguments[y]);
        return o;
        function x(O, N, U) {
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
            return h[O] = o[O] = W;
          }
          u(j = O).forEach(function(P) {
            var V = j[P];
            if (l(V)) x(P, j[P][0], j[P][1]);
            else {
              if (V !== "asap") throw new he.InvalidArgument("Invalid event config");
              var $ = x(P, je, function() {
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
      function pa(s, o) {
        return K(o).from({ prototype: s }), o;
      }
      function gs(s, o) {
        return !(s.filter || s.algorithm || s.or) && (o ? s.justLimit : !s.replayFilter);
      }
      function hu(s, o) {
        s.filter = Ei(s.filter, o);
      }
      function pu(s, o, h) {
        var y = s.replayFilter;
        s.replayFilter = y ? function() {
          return Ei(y(), o());
        } : o, s.justLimit = h && !y;
      }
      function eo(s, o) {
        if (s.isPrimKey) return o.primaryKey;
        var h = o.getIndexByKeyPath(s.index);
        if (!h) throw new he.Schema("KeyPath " + s.index + " on object store " + o.name + " is not indexed");
        return h;
      }
      function yh(s, o, h) {
        var y = eo(s, o.schema);
        return o.openCursor({ trans: h, values: !s.keysOnly, reverse: s.dir === "prev", unique: !!s.unique, query: { index: y, range: s.range } });
      }
      function to(s, o, h, y) {
        var I = s.replayFilter ? Ei(s.filter, s.replayFilter()) : s.filter;
        if (s.or) {
          var x = {}, O = function(N, U, j) {
            var W, P;
            I && !I(U, j, function(V) {
              return U.stop(V);
            }, function(V) {
              return U.fail(V);
            }) || ((P = "" + (W = U.primaryKey)) == "[object ArrayBuffer]" && (P = "" + new Uint8Array(W)), w(x, P) || (x[P] = !0, o(N, U, j)));
          };
          return Promise.all([s.or._iterate(O, h), gh(yh(s, y, h), s.algorithm, O, !s.keysOnly && s.valueMapper)]);
        }
        return gh(yh(s, y, h), Ei(s.algorithm, I), o, !s.keysOnly && s.valueMapper);
      }
      function gh(s, o, h, y) {
        var I = Te(y ? function(x, O, N) {
          return h(y(x), O, N);
        } : h);
        return s.then(function(x) {
          if (x) return x.start(function() {
            var O = function() {
              return x.continue();
            };
            o && !o(x, function(N) {
              return O = N;
            }, function(N) {
              x.stop(N), O = me;
            }, function(N) {
              x.fail(N), O = me;
            }) || I(x.value, x, function(N) {
              return O = N;
            }), O();
          });
        });
      }
      var da = (mh.prototype.execute = function(s) {
        var o = this["@@propmod"];
        if (o.add !== void 0) {
          var h = o.add;
          if (l(h)) return i(i([], l(s) ? s : [], !0), h).sort();
          if (typeof h == "number") return (Number(s) || 0) + h;
          if (typeof h == "bigint") try {
            return BigInt(s) + h;
          } catch {
            return BigInt(0) + h;
          }
          throw new TypeError("Invalid term ".concat(h));
        }
        if (o.remove !== void 0) {
          var y = o.remove;
          if (l(y)) return l(s) ? s.filter(function(I) {
            return !y.includes(I);
          }).sort() : [];
          if (typeof y == "number") return Number(s) - y;
          if (typeof y == "bigint") try {
            return BigInt(s) - y;
          } catch {
            return BigInt(0) - y;
          }
          throw new TypeError("Invalid subtrahend ".concat(y));
        }
        return h = (h = o.replacePrefix) === null || h === void 0 ? void 0 : h[0], h && typeof s == "string" && s.startsWith(h) ? o.replacePrefix[1] + s.substring(h.length) : s;
      }, mh);
      function mh(s) {
        this["@@propmod"] = s;
      }
      var Uy = (ft.prototype._read = function(s, o) {
        var h = this._ctx;
        return h.error ? h.table._trans(null, Pt.bind(null, h.error)) : h.table._trans("readonly", s).then(o);
      }, ft.prototype._write = function(s) {
        var o = this._ctx;
        return o.error ? o.table._trans(null, Pt.bind(null, o.error)) : o.table._trans("readwrite", s, "locked");
      }, ft.prototype._addAlgorithm = function(s) {
        var o = this._ctx;
        o.algorithm = Ei(o.algorithm, s);
      }, ft.prototype._iterate = function(s, o) {
        return to(this._ctx, s, o, this._ctx.table.core);
      }, ft.prototype.clone = function(s) {
        var o = Object.create(this.constructor.prototype), h = Object.create(this._ctx);
        return s && c(h, s), o._ctx = h, o;
      }, ft.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, ft.prototype.each = function(s) {
        var o = this._ctx;
        return this._read(function(h) {
          return to(o, s, h, o.table.core);
        });
      }, ft.prototype.count = function(s) {
        var o = this;
        return this._read(function(h) {
          var y = o._ctx, I = y.table.core;
          if (gs(y, !0)) return I.count({ trans: h, query: { index: eo(y, I.schema), range: y.range } }).then(function(O) {
            return Math.min(O, y.limit);
          });
          var x = 0;
          return to(y, function() {
            return ++x, !1;
          }, h, I).then(function() {
            return x;
          });
        }).then(s);
      }, ft.prototype.sortBy = function(s, o) {
        var h = s.split(".").reverse(), y = h[0], I = h.length - 1;
        function x(U, j) {
          return j ? x(U[h[j]], j - 1) : U[y];
        }
        var O = this._ctx.dir === "next" ? 1 : -1;
        function N(U, j) {
          return ot(x(U, I), x(j, I)) * O;
        }
        return this.toArray(function(U) {
          return U.sort(N);
        }).then(o);
      }, ft.prototype.toArray = function(s) {
        var o = this;
        return this._read(function(h) {
          var y = o._ctx;
          if (y.dir === "next" && gs(y, !0) && 0 < y.limit) {
            var I = y.valueMapper, x = eo(y, y.table.core.schema);
            return y.table.core.query({ trans: h, limit: y.limit, values: !0, query: { index: x, range: y.range } }).then(function(N) {
              return N = N.result, I ? N.map(I) : N;
            });
          }
          var O = [];
          return to(y, function(N) {
            return O.push(N);
          }, h, y.table.core).then(function() {
            return O;
          });
        }, s);
      }, ft.prototype.offset = function(s) {
        var o = this._ctx;
        return s <= 0 || (o.offset += s, gs(o) ? pu(o, function() {
          var h = s;
          return function(y, I) {
            return h === 0 || (h === 1 ? --h : I(function() {
              y.advance(h), h = 0;
            }), !1);
          };
        }) : pu(o, function() {
          var h = s;
          return function() {
            return --h < 0;
          };
        })), this;
      }, ft.prototype.limit = function(s) {
        return this._ctx.limit = Math.min(this._ctx.limit, s), pu(this._ctx, function() {
          var o = s;
          return function(h, y, I) {
            return --o <= 0 && y(I), 0 <= o;
          };
        }, !0), this;
      }, ft.prototype.until = function(s, o) {
        return hu(this._ctx, function(h, y, I) {
          return !s(h.value) || (y(I), o);
        }), this;
      }, ft.prototype.first = function(s) {
        return this.limit(1).toArray(function(o) {
          return o[0];
        }).then(s);
      }, ft.prototype.last = function(s) {
        return this.reverse().first(s);
      }, ft.prototype.filter = function(s) {
        var o;
        return hu(this._ctx, function(h) {
          return s(h.value);
        }), (o = this._ctx).isMatch = Ei(o.isMatch, s), this;
      }, ft.prototype.and = function(s) {
        return this.filter(s);
      }, ft.prototype.or = function(s) {
        return new this.db.WhereClause(this._ctx.table, s, this);
      }, ft.prototype.reverse = function() {
        return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
      }, ft.prototype.desc = function() {
        return this.reverse();
      }, ft.prototype.eachKey = function(s) {
        var o = this._ctx;
        return o.keysOnly = !o.isMatch, this.each(function(h, y) {
          s(y.key, y);
        });
      }, ft.prototype.eachUniqueKey = function(s) {
        return this._ctx.unique = "unique", this.eachKey(s);
      }, ft.prototype.eachPrimaryKey = function(s) {
        var o = this._ctx;
        return o.keysOnly = !o.isMatch, this.each(function(h, y) {
          s(y.primaryKey, y);
        });
      }, ft.prototype.keys = function(s) {
        var o = this._ctx;
        o.keysOnly = !o.isMatch;
        var h = [];
        return this.each(function(y, I) {
          h.push(I.key);
        }).then(function() {
          return h;
        }).then(s);
      }, ft.prototype.primaryKeys = function(s) {
        var o = this._ctx;
        if (o.dir === "next" && gs(o, !0) && 0 < o.limit) return this._read(function(y) {
          var I = eo(o, o.table.core.schema);
          return o.table.core.query({ trans: y, values: !1, limit: o.limit, query: { index: I, range: o.range } });
        }).then(function(y) {
          return y.result;
        }).then(s);
        o.keysOnly = !o.isMatch;
        var h = [];
        return this.each(function(y, I) {
          h.push(I.primaryKey);
        }).then(function() {
          return h;
        }).then(s);
      }, ft.prototype.uniqueKeys = function(s) {
        return this._ctx.unique = "unique", this.keys(s);
      }, ft.prototype.firstKey = function(s) {
        return this.limit(1).keys(function(o) {
          return o[0];
        }).then(s);
      }, ft.prototype.lastKey = function(s) {
        return this.reverse().firstKey(s);
      }, ft.prototype.distinct = function() {
        var s = this._ctx, s = s.index && s.table.schema.idxByName[s.index];
        if (!s || !s.multi) return this;
        var o = {};
        return hu(this._ctx, function(I) {
          var y = I.primaryKey.toString(), I = w(o, y);
          return o[y] = !0, !I;
        }), this;
      }, ft.prototype.modify = function(s) {
        var o = this, h = this._ctx;
        return this._write(function(y) {
          var I, x, O;
          O = typeof s == "function" ? s : (I = u(s), x = I.length, function(z) {
            for (var Q = !1, re = 0; re < x; ++re) {
              var ne = I[re], oe = s[ne], de = fe(z, ne);
              oe instanceof da ? (ae(z, ne, oe.execute(de)), Q = !0) : de !== oe && (ae(z, ne, oe), Q = !0);
            }
            return Q;
          });
          var N = h.table.core, P = N.schema.primaryKey, U = P.outbound, j = P.extractKey, W = 200, P = o.db._options.modifyChunkSize;
          P && (W = typeof P == "object" ? P[N.name] || P["*"] || 200 : P);
          function V(z, ne) {
            var re = ne.failures, ne = ne.numFailures;
            H += z - ne;
            for (var oe = 0, de = u(re); oe < de.length; oe++) {
              var be = de[oe];
              $.push(re[be]);
            }
          }
          var $ = [], H = 0, Y = [];
          return o.clone().primaryKeys().then(function(z) {
            function Q(ne) {
              var oe = Math.min(W, z.length - ne);
              return N.getMany({ trans: y, keys: z.slice(ne, ne + oe), cache: "immutable" }).then(function(de) {
                for (var be = [], ve = [], ye = U ? [] : null, _e = [], Ie = 0; Ie < oe; ++Ie) {
                  var Ae = de[Ie], Ye = { value: Se(Ae), primKey: z[ne + Ie] };
                  O.call(Ye, Ye.value, Ye) !== !1 && (Ye.value == null ? _e.push(z[ne + Ie]) : U || ot(j(Ae), j(Ye.value)) === 0 ? (ve.push(Ye.value), U && ye.push(z[ne + Ie])) : (_e.push(z[ne + Ie]), be.push(Ye.value)));
                }
                return Promise.resolve(0 < be.length && N.mutate({ trans: y, type: "add", values: be }).then(function(rt) {
                  for (var nt in rt.failures) _e.splice(parseInt(nt), 1);
                  V(be.length, rt);
                })).then(function() {
                  return (0 < ve.length || re && typeof s == "object") && N.mutate({ trans: y, type: "put", keys: ye, values: ve, criteria: re, changeSpec: typeof s != "function" && s, isAdditionalChunk: 0 < ne }).then(function(rt) {
                    return V(ve.length, rt);
                  });
                }).then(function() {
                  return (0 < _e.length || re && s === du) && N.mutate({ trans: y, type: "delete", keys: _e, criteria: re, isAdditionalChunk: 0 < ne }).then(function(rt) {
                    return V(_e.length, rt);
                  });
                }).then(function() {
                  return z.length > ne + oe && Q(ne + W);
                });
              });
            }
            var re = gs(h) && h.limit === 1 / 0 && (typeof s != "function" || s === du) && { index: h.index, range: h.range };
            return Q(0).then(function() {
              if (0 < $.length) throw new yt("Error modifying one or more objects", $, H, Y);
              return z.length;
            });
          });
        });
      }, ft.prototype.delete = function() {
        var s = this._ctx, o = s.range;
        return gs(s) && (s.isPrimKey || o.type === 3) ? this._write(function(h) {
          var y = s.table.core.schema.primaryKey, I = o;
          return s.table.core.count({ trans: h, query: { index: y, range: I } }).then(function(x) {
            return s.table.core.mutate({ trans: h, type: "deleteRange", range: I }).then(function(O) {
              var N = O.failures;
              if (O.lastResult, O.results, O = O.numFailures, O) throw new yt("Could not delete some values", Object.keys(N).map(function(U) {
                return N[U];
              }), x - O);
              return x - O;
            });
          });
        }) : this.modify(du);
      }, ft);
      function ft() {
      }
      var du = function(s, o) {
        return o.value = null;
      };
      function $y(s, o) {
        return s < o ? -1 : s === o ? 0 : 1;
      }
      function jy(s, o) {
        return o < s ? -1 : s === o ? 0 : 1;
      }
      function Cr(s, o, h) {
        return s = s instanceof bh ? new s.Collection(s) : s, s._ctx.error = new (h || TypeError)(o), s;
      }
      function ms(s) {
        return new s.Collection(s, function() {
          return Ih("");
        }).limit(0);
      }
      function ro(s, o, h, y) {
        var I, x, O, N, U, j, W, P = h.length;
        if (!h.every(function(H) {
          return typeof H == "string";
        })) return Cr(s, ch);
        function V(H) {
          I = H === "next" ? function(z) {
            return z.toUpperCase();
          } : function(z) {
            return z.toLowerCase();
          }, x = H === "next" ? function(z) {
            return z.toLowerCase();
          } : function(z) {
            return z.toUpperCase();
          }, O = H === "next" ? $y : jy;
          var Y = h.map(function(z) {
            return { lower: x(z), upper: I(z) };
          }).sort(function(z, Q) {
            return O(z.lower, Q.lower);
          });
          N = Y.map(function(z) {
            return z.upper;
          }), U = Y.map(function(z) {
            return z.lower;
          }), W = (j = H) === "next" ? "" : y;
        }
        V("next"), s = new s.Collection(s, function() {
          return Ln(N[0], U[P - 1] + y);
        }), s._ondirectionchange = function(H) {
          V(H);
        };
        var $ = 0;
        return s._addAlgorithm(function(H, Y, z) {
          var Q = H.key;
          if (typeof Q != "string") return !1;
          var re = x(Q);
          if (o(re, U, $)) return !0;
          for (var ne = null, oe = $; oe < P; ++oe) {
            var de = function(be, ve, ye, _e, Ie, Ae) {
              for (var Ye = Math.min(be.length, _e.length), rt = -1, nt = 0; nt < Ye; ++nt) {
                var Nr = ve[nt];
                if (Nr !== _e[nt]) return Ie(be[nt], ye[nt]) < 0 ? be.substr(0, nt) + ye[nt] + ye.substr(nt + 1) : Ie(be[nt], _e[nt]) < 0 ? be.substr(0, nt) + _e[nt] + ye.substr(nt + 1) : 0 <= rt ? be.substr(0, rt) + ve[rt] + ye.substr(rt + 1) : null;
                Ie(be[nt], Nr) < 0 && (rt = nt);
              }
              return Ye < _e.length && Ae === "next" ? be + ye.substr(be.length) : Ye < be.length && Ae === "prev" ? be.substr(0, ye.length) : rt < 0 ? null : be.substr(0, rt) + _e[rt] + ye.substr(rt + 1);
            }(Q, re, N[oe], U[oe], O, j);
            de === null && ne === null ? $ = oe + 1 : (ne === null || 0 < O(ne, de)) && (ne = de);
          }
          return Y(ne !== null ? function() {
            H.continue(ne + W);
          } : z), !1;
        }), s;
      }
      function Ln(s, o, h, y) {
        return { type: 2, lower: s, upper: o, lowerOpen: h, upperOpen: y };
      }
      function Ih(s) {
        return { type: 1, lower: s, upper: s };
      }
      var bh = (Object.defineProperty(jt.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), jt.prototype.between = function(s, o, h, y) {
        h = h !== !1, y = y === !0;
        try {
          return 0 < this._cmp(s, o) || this._cmp(s, o) === 0 && (h || y) && (!h || !y) ? ms(this) : new this.Collection(this, function() {
            return Ln(s, o, !h, !y);
          });
        } catch {
          return Cr(this, mn);
        }
      }, jt.prototype.equals = function(s) {
        return s == null ? Cr(this, mn) : new this.Collection(this, function() {
          return Ih(s);
        });
      }, jt.prototype.above = function(s) {
        return s == null ? Cr(this, mn) : new this.Collection(this, function() {
          return Ln(s, void 0, !0);
        });
      }, jt.prototype.aboveOrEqual = function(s) {
        return s == null ? Cr(this, mn) : new this.Collection(this, function() {
          return Ln(s, void 0, !1);
        });
      }, jt.prototype.below = function(s) {
        return s == null ? Cr(this, mn) : new this.Collection(this, function() {
          return Ln(void 0, s, !1, !0);
        });
      }, jt.prototype.belowOrEqual = function(s) {
        return s == null ? Cr(this, mn) : new this.Collection(this, function() {
          return Ln(void 0, s);
        });
      }, jt.prototype.startsWith = function(s) {
        return typeof s != "string" ? Cr(this, ch) : this.between(s, s + xi, !0, !0);
      }, jt.prototype.startsWithIgnoreCase = function(s) {
        return s === "" ? this.startsWith(s) : ro(this, function(o, h) {
          return o.indexOf(h[0]) === 0;
        }, [s], xi);
      }, jt.prototype.equalsIgnoreCase = function(s) {
        return ro(this, function(o, h) {
          return o === h[0];
        }, [s], "");
      }, jt.prototype.anyOfIgnoreCase = function() {
        var s = It.apply(Ke, arguments);
        return s.length === 0 ? ms(this) : ro(this, function(o, h) {
          return h.indexOf(o) !== -1;
        }, s, "");
      }, jt.prototype.startsWithAnyOfIgnoreCase = function() {
        var s = It.apply(Ke, arguments);
        return s.length === 0 ? ms(this) : ro(this, function(o, h) {
          return h.some(function(y) {
            return o.indexOf(y) === 0;
          });
        }, s, xi);
      }, jt.prototype.anyOf = function() {
        var s = this, o = It.apply(Ke, arguments), h = this._cmp;
        try {
          o.sort(h);
        } catch {
          return Cr(this, mn);
        }
        if (o.length === 0) return ms(this);
        var y = new this.Collection(this, function() {
          return Ln(o[0], o[o.length - 1]);
        });
        y._ondirectionchange = function(x) {
          h = x === "next" ? s._ascending : s._descending, o.sort(h);
        };
        var I = 0;
        return y._addAlgorithm(function(x, O, N) {
          for (var U = x.key; 0 < h(U, o[I]); ) if (++I === o.length) return O(N), !1;
          return h(U, o[I]) === 0 || (O(function() {
            x.continue(o[I]);
          }), !1);
        }), y;
      }, jt.prototype.notEqual = function(s) {
        return this.inAnyRange([[-1 / 0, s], [s, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, jt.prototype.noneOf = function() {
        var s = It.apply(Ke, arguments);
        if (s.length === 0) return new this.Collection(this);
        try {
          s.sort(this._ascending);
        } catch {
          return Cr(this, mn);
        }
        var o = s.reduce(function(h, y) {
          return h ? h.concat([[h[h.length - 1][1], y]]) : [[-1 / 0, y]];
        }, null);
        return o.push([s[s.length - 1], this.db._maxKey]), this.inAnyRange(o, { includeLowers: !1, includeUppers: !1 });
      }, jt.prototype.inAnyRange = function(Q, o) {
        var h = this, y = this._cmp, I = this._ascending, x = this._descending, O = this._min, N = this._max;
        if (Q.length === 0) return ms(this);
        if (!Q.every(function(re) {
          return re[0] !== void 0 && re[1] !== void 0 && I(re[0], re[1]) <= 0;
        })) return Cr(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", he.InvalidArgument);
        var U = !o || o.includeLowers !== !1, j = o && o.includeUppers === !0, W, P = I;
        function V(re, ne) {
          return P(re[0], ne[0]);
        }
        try {
          (W = Q.reduce(function(re, ne) {
            for (var oe = 0, de = re.length; oe < de; ++oe) {
              var be = re[oe];
              if (y(ne[0], be[1]) < 0 && 0 < y(ne[1], be[0])) {
                be[0] = O(be[0], ne[0]), be[1] = N(be[1], ne[1]);
                break;
              }
            }
            return oe === de && re.push(ne), re;
          }, [])).sort(V);
        } catch {
          return Cr(this, mn);
        }
        var $ = 0, H = j ? function(re) {
          return 0 < I(re, W[$][1]);
        } : function(re) {
          return 0 <= I(re, W[$][1]);
        }, Y = U ? function(re) {
          return 0 < x(re, W[$][0]);
        } : function(re) {
          return 0 <= x(re, W[$][0]);
        }, z = H, Q = new this.Collection(this, function() {
          return Ln(W[0][0], W[W.length - 1][1], !U, !j);
        });
        return Q._ondirectionchange = function(re) {
          P = re === "next" ? (z = H, I) : (z = Y, x), W.sort(V);
        }, Q._addAlgorithm(function(re, ne, oe) {
          for (var de, be = re.key; z(be); ) if (++$ === W.length) return ne(oe), !1;
          return !H(de = be) && !Y(de) || (h._cmp(be, W[$][1]) === 0 || h._cmp(be, W[$][0]) === 0 || ne(function() {
            P === I ? re.continue(W[$][0]) : re.continue(W[$][1]);
          }), !1);
        }), Q;
      }, jt.prototype.startsWithAnyOf = function() {
        var s = It.apply(Ke, arguments);
        return s.every(function(o) {
          return typeof o == "string";
        }) ? s.length === 0 ? ms(this) : this.inAnyRange(s.map(function(o) {
          return [o, o + xi];
        })) : Cr(this, "startsWithAnyOf() only works with strings");
      }, jt);
      function jt() {
      }
      function tn(s) {
        return Te(function(o) {
          return va(o), s(o.target.error), !1;
        });
      }
      function va(s) {
        s.stopPropagation && s.stopPropagation(), s.preventDefault && s.preventDefault();
      }
      var ya = "storagemutated", vu = "x-storagemutated-1", qn = ha(null, ya), Ky = (rn.prototype._lock = function() {
        return le(!q.global), ++this._reculock, this._reculock !== 1 || q.global || (q.lockOwnerFor = this), this;
      }, rn.prototype._unlock = function() {
        if (le(!q.global), --this._reculock == 0) for (q.global || (q.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var s = this._blockedFuncs.shift();
          try {
            wi(s[1], s[0]);
          } catch {
          }
        }
        return this;
      }, rn.prototype._locked = function() {
        return this._reculock && q.lockOwnerFor !== this;
      }, rn.prototype.create = function(s) {
        var o = this;
        if (!this.mode) return this;
        var h = this.db.idbdb, y = this.db._state.dbOpenError;
        if (le(!this.idbtrans), !s && !h) switch (y && y.name) {
          case "DatabaseClosedError":
            throw new he.DatabaseClosed(y);
          case "MissingAPIError":
            throw new he.MissingAPI(y.message, y);
          default:
            throw new he.OpenFailed(y);
        }
        if (!this.active) throw new he.TransactionInactive();
        return le(this._completion._state === null), (s = this.idbtrans = s || (this.db.core || h).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Te(function(I) {
          va(I), o._reject(s.error);
        }), s.onabort = Te(function(I) {
          va(I), o.active && o._reject(new he.Abort(s.error)), o.active = !1, o.on("abort").fire(I);
        }), s.oncomplete = Te(function() {
          o.active = !1, o._resolve(), "mutatedParts" in s && qn.storagemutated.fire(s.mutatedParts);
        }), this;
      }, rn.prototype._promise = function(s, o, h) {
        var y = this;
        if (s === "readwrite" && this.mode !== "readwrite") return Pt(new he.ReadOnly("Transaction is readonly"));
        if (!this.active) return Pt(new he.TransactionInactive());
        if (this._locked()) return new f(function(x, O) {
          y._blockedFuncs.push([function() {
            y._promise(s, o, h).then(x, O);
          }, q]);
        });
        if (h) return Nt(function() {
          var x = new f(function(O, N) {
            y._lock();
            var U = o(O, N, y);
            U && U.then && U.then(O, N);
          });
          return x.finally(function() {
            return y._unlock();
          }), x._lib = !0, x;
        });
        var I = new f(function(x, O) {
          var N = o(x, O, y);
          N && N.then && N.then(x, O);
        });
        return I._lib = !0, I;
      }, rn.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, rn.prototype.waitFor = function(s) {
        var o, h = this._root(), y = f.resolve(s);
        h._waitingFor ? h._waitingFor = h._waitingFor.then(function() {
          return y;
        }) : (h._waitingFor = y, h._waitingQueue = [], o = h.idbtrans.objectStore(h.storeNames[0]), function x() {
          for (++h._spinCount; h._waitingQueue.length; ) h._waitingQueue.shift()();
          h._waitingFor && (o.get(-1 / 0).onsuccess = x);
        }());
        var I = h._waitingFor;
        return new f(function(x, O) {
          y.then(function(N) {
            return h._waitingQueue.push(Te(x.bind(null, N)));
          }, function(N) {
            return h._waitingQueue.push(Te(O.bind(null, N)));
          }).finally(function() {
            h._waitingFor === I && (h._waitingFor = null);
          });
        });
      }, rn.prototype.abort = function() {
        this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new he.Abort()));
      }, rn.prototype.table = function(s) {
        var o = this._memoizedTables || (this._memoizedTables = {});
        if (w(o, s)) return o[s];
        var h = this.schema[s];
        if (!h) throw new he.NotFound("Table " + s + " not part of transaction");
        return h = new this.db.Table(s, h, this), h.core = this.db.core.table(s), o[s] = h;
      }, rn);
      function rn() {
      }
      function yu(s, o, h, y, I, x, O) {
        return { name: s, keyPath: o, unique: h, multi: y, auto: I, compound: x, src: (h && !O ? "&" : "") + (y ? "*" : "") + (I ? "++" : "") + _h(o) };
      }
      function _h(s) {
        return typeof s == "string" ? s : s ? "[" + [].join.call(s, "+") + "]" : "";
      }
      function gu(s, o, h) {
        return { name: s, primKey: o, indexes: h, mappedClass: null, idxByName: (y = function(I) {
          return [I.name, I];
        }, h.reduce(function(I, x, O) {
          return O = y(x, O), O && (I[O[0]] = O[1]), I;
        }, {})) };
        var y;
      }
      var ga = function(s) {
        try {
          return s.only([[]]), ga = function() {
            return [[]];
          }, [[]];
        } catch {
          return ga = function() {
            return xi;
          }, xi;
        }
      };
      function mu(s) {
        return s == null ? function() {
        } : typeof s == "string" ? (o = s).split(".").length === 1 ? function(h) {
          return h[o];
        } : function(h) {
          return fe(h, o);
        } : function(h) {
          return fe(h, s);
        };
        var o;
      }
      function wh(s) {
        return [].slice.call(s);
      }
      var zy = 0;
      function ma(s) {
        return s == null ? ":id" : typeof s == "string" ? s : "[".concat(s.join("+"), "]");
      }
      function Gy(s, o, U) {
        function y(z) {
          if (z.type === 3) return null;
          if (z.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var $ = z.lower, H = z.upper, Y = z.lowerOpen, z = z.upperOpen;
          return $ === void 0 ? H === void 0 ? null : o.upperBound(H, !!z) : H === void 0 ? o.lowerBound($, !!Y) : o.bound($, H, !!Y, !!z);
        }
        function I(V) {
          var $, H = V.name;
          return { name: H, schema: V, mutate: function(Y) {
            var z = Y.trans, Q = Y.type, re = Y.keys, ne = Y.values, oe = Y.range;
            return new Promise(function(de, be) {
              de = Te(de);
              var ve = z.objectStore(H), ye = ve.keyPath == null, _e = Q === "put" || Q === "add";
              if (!_e && Q !== "delete" && Q !== "deleteRange") throw new Error("Invalid operation type: " + Q);
              var Ie, Ae = (re || ne || { length: 1 }).length;
              if (re && ne && re.length !== ne.length) throw new Error("Given keys array must have same length as given values array.");
              if (Ae === 0) return de({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function Ye(fr) {
                ++Nr, va(fr);
              }
              var rt = [], nt = [], Nr = 0;
              if (Q === "deleteRange") {
                if (oe.type === 4) return de({ numFailures: Nr, failures: nt, results: [], lastResult: void 0 });
                oe.type === 3 ? rt.push(Ie = ve.clear()) : rt.push(Ie = ve.delete(y(oe)));
              } else {
                var ye = _e ? ye ? [ne, re] : [ne, null] : [re, null], ze = ye[0], Xt = ye[1];
                if (_e) for (var er = 0; er < Ae; ++er) rt.push(Ie = Xt && Xt[er] !== void 0 ? ve[Q](ze[er], Xt[er]) : ve[Q](ze[er])), Ie.onerror = Ye;
                else for (er = 0; er < Ae; ++er) rt.push(Ie = ve[Q](ze[er])), Ie.onerror = Ye;
              }
              function yo(fr) {
                fr = fr.target.result, rt.forEach(function(ki, Fu) {
                  return ki.error != null && (nt[Fu] = ki.error);
                }), de({ numFailures: Nr, failures: nt, results: Q === "delete" ? re : rt.map(function(ki) {
                  return ki.result;
                }), lastResult: fr });
              }
              Ie.onerror = function(fr) {
                Ye(fr), yo(fr);
              }, Ie.onsuccess = yo;
            });
          }, getMany: function(Y) {
            var z = Y.trans, Q = Y.keys;
            return new Promise(function(re, ne) {
              re = Te(re);
              for (var oe, de = z.objectStore(H), be = Q.length, ve = new Array(be), ye = 0, _e = 0, Ie = function(rt) {
                rt = rt.target, ve[rt._pos] = rt.result, ++_e === ye && re(ve);
              }, Ae = tn(ne), Ye = 0; Ye < be; ++Ye) Q[Ye] != null && ((oe = de.get(Q[Ye]))._pos = Ye, oe.onsuccess = Ie, oe.onerror = Ae, ++ye);
              ye === 0 && re(ve);
            });
          }, get: function(Y) {
            var z = Y.trans, Q = Y.key;
            return new Promise(function(re, ne) {
              re = Te(re);
              var oe = z.objectStore(H).get(Q);
              oe.onsuccess = function(de) {
                return re(de.target.result);
              }, oe.onerror = tn(ne);
            });
          }, query: ($ = j, function(Y) {
            return new Promise(function(z, Q) {
              z = Te(z);
              var re, ne, oe, ye = Y.trans, de = Y.values, be = Y.limit, Ie = Y.query, ve = be === 1 / 0 ? void 0 : be, _e = Ie.index, Ie = Ie.range, ye = ye.objectStore(H), _e = _e.isPrimaryKey ? ye : ye.index(_e.name), Ie = y(Ie);
              if (be === 0) return z({ result: [] });
              $ ? ((ve = de ? _e.getAll(Ie, ve) : _e.getAllKeys(Ie, ve)).onsuccess = function(Ae) {
                return z({ result: Ae.target.result });
              }, ve.onerror = tn(Q)) : (re = 0, ne = !de && "openKeyCursor" in _e ? _e.openKeyCursor(Ie) : _e.openCursor(Ie), oe = [], ne.onsuccess = function(Ae) {
                var Ye = ne.result;
                return Ye ? (oe.push(de ? Ye.value : Ye.primaryKey), ++re === be ? z({ result: oe }) : void Ye.continue()) : z({ result: oe });
              }, ne.onerror = tn(Q));
            });
          }), openCursor: function(Y) {
            var z = Y.trans, Q = Y.values, re = Y.query, ne = Y.reverse, oe = Y.unique;
            return new Promise(function(de, be) {
              de = Te(de);
              var _e = re.index, ve = re.range, ye = z.objectStore(H), ye = _e.isPrimaryKey ? ye : ye.index(_e.name), _e = ne ? oe ? "prevunique" : "prev" : oe ? "nextunique" : "next", Ie = !Q && "openKeyCursor" in ye ? ye.openKeyCursor(y(ve), _e) : ye.openCursor(y(ve), _e);
              Ie.onerror = tn(be), Ie.onsuccess = Te(function(Ae) {
                var Ye, rt, nt, Nr, ze = Ie.result;
                ze ? (ze.___id = ++zy, ze.done = !1, Ye = ze.continue.bind(ze), rt = (rt = ze.continuePrimaryKey) && rt.bind(ze), nt = ze.advance.bind(ze), Nr = function() {
                  throw new Error("Cursor not stopped");
                }, ze.trans = z, ze.stop = ze.continue = ze.continuePrimaryKey = ze.advance = function() {
                  throw new Error("Cursor not started");
                }, ze.fail = Te(be), ze.next = function() {
                  var Xt = this, er = 1;
                  return this.start(function() {
                    return er-- ? Xt.continue() : Xt.stop();
                  }).then(function() {
                    return Xt;
                  });
                }, ze.start = function(Xt) {
                  function er() {
                    if (Ie.result) try {
                      Xt();
                    } catch (fr) {
                      ze.fail(fr);
                    }
                    else ze.done = !0, ze.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, ze.stop();
                  }
                  var yo = new Promise(function(fr, ki) {
                    fr = Te(fr), Ie.onerror = tn(ki), ze.fail = ki, ze.stop = function(Fu) {
                      ze.stop = ze.continue = ze.continuePrimaryKey = ze.advance = Nr, fr(Fu);
                    };
                  });
                  return Ie.onsuccess = Te(function(fr) {
                    Ie.onsuccess = er, er();
                  }), ze.continue = Ye, ze.continuePrimaryKey = rt, ze.advance = nt, er(), yo;
                }, de(ze)) : de(null);
              }, be);
            });
          }, count: function(Y) {
            var z = Y.query, Q = Y.trans, re = z.index, ne = z.range;
            return new Promise(function(oe, de) {
              var be = Q.objectStore(H), ve = re.isPrimaryKey ? be : be.index(re.name), be = y(ne), ve = be ? ve.count(be) : ve.count();
              ve.onsuccess = Te(function(ye) {
                return oe(ye.target.result);
              }), ve.onerror = tn(de);
            });
          } };
        }
        var x, O, N, W = (O = U, N = wh((x = s).objectStoreNames), { schema: { name: x.name, tables: N.map(function(V) {
          return O.objectStore(V);
        }).map(function(V) {
          var $ = V.keyPath, z = V.autoIncrement, H = l($), Y = {}, z = { name: V.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: $ == null, compound: H, keyPath: $, autoIncrement: z, unique: !0, extractKey: mu($) }, indexes: wh(V.indexNames).map(function(Q) {
            return V.index(Q);
          }).map(function(oe) {
            var re = oe.name, ne = oe.unique, de = oe.multiEntry, oe = oe.keyPath, de = { name: re, compound: l(oe), keyPath: oe, unique: ne, multiEntry: de, extractKey: mu(oe) };
            return Y[ma(oe)] = de;
          }), getIndexByKeyPath: function(Q) {
            return Y[ma(Q)];
          } };
          return Y[":id"] = z.primaryKey, $ != null && (Y[ma($)] = z.primaryKey), z;
        }) }, hasGetAll: 0 < N.length && "getAll" in O.objectStore(N[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), U = W.schema, j = W.hasGetAll, W = U.tables.map(I), P = {};
        return W.forEach(function(V) {
          return P[V.name] = V;
        }), { stack: "dbcore", transaction: s.transaction.bind(s), table: function(V) {
          if (!P[V]) throw new Error("Table '".concat(V, "' not found"));
          return P[V];
        }, MIN_KEY: -1 / 0, MAX_KEY: ga(o), schema: U };
      }
      function Hy(s, o, h, y) {
        var I = h.IDBKeyRange;
        return h.indexedDB, { dbcore: (y = Gy(o, I, y), s.dbcore.reduce(function(x, O) {
          return O = O.create, r(r({}, x), O(x));
        }, y)) };
      }
      function no(s, y) {
        var h = y.db, y = Hy(s._middlewares, h, s._deps, y);
        s.core = y.dbcore, s.tables.forEach(function(I) {
          var x = I.name;
          s.core.schema.tables.some(function(O) {
            return O.name === x;
          }) && (I.core = s.core.table(x), s[x] instanceof s.Table && (s[x].core = I.core));
        });
      }
      function io(s, o, h, y) {
        h.forEach(function(I) {
          var x = y[I];
          o.forEach(function(O) {
            var N = function U(j, W) {
              return C(j, W) || (j = _(j)) && U(j, W);
            }(O, I);
            (!N || "value" in N && N.value === void 0) && (O === s.Transaction.prototype || O instanceof s.Transaction ? D(O, I, { get: function() {
              return this.table(I);
            }, set: function(U) {
              k(this, I, { value: U, writable: !0, configurable: !0, enumerable: !0 });
            } }) : O[I] = new s.Table(I, x));
          });
        });
      }
      function Iu(s, o) {
        o.forEach(function(h) {
          for (var y in h) h[y] instanceof s.Table && delete h[y];
        });
      }
      function Wy(s, o) {
        return s._cfg.version - o._cfg.version;
      }
      function Yy(s, o, h, y) {
        var I = s._dbSchema;
        h.objectStoreNames.contains("$meta") && !I.$meta && (I.$meta = gu("$meta", Eh("")[0], []), s._storeNames.push("$meta"));
        var x = s._createTransaction("readwrite", s._storeNames, I);
        x.create(h), x._completion.catch(y);
        var O = x._reject.bind(x), N = q.transless || q;
        Nt(function() {
          return q.trans = x, q.transless = N, o !== 0 ? (no(s, h), j = o, ((U = x).storeNames.includes("$meta") ? U.table("$meta").get("version").then(function(W) {
            return W ?? j;
          }) : f.resolve(j)).then(function(W) {
            return V = W, $ = x, H = h, Y = [], W = (P = s)._versions, z = P._dbSchema = ao(0, P.idbdb, H), (W = W.filter(function(Q) {
              return Q._cfg.version >= V;
            })).length !== 0 ? (W.forEach(function(Q) {
              Y.push(function() {
                var re = z, ne = Q._cfg.dbschema;
                oo(P, re, H), oo(P, ne, H), z = P._dbSchema = ne;
                var oe = bu(re, ne);
                oe.add.forEach(function(_e) {
                  _u(H, _e[0], _e[1].primKey, _e[1].indexes);
                }), oe.change.forEach(function(_e) {
                  if (_e.recreate) throw new he.Upgrade("Not yet support for changing primary key");
                  var Ie = H.objectStore(_e.name);
                  _e.add.forEach(function(Ae) {
                    return so(Ie, Ae);
                  }), _e.change.forEach(function(Ae) {
                    Ie.deleteIndex(Ae.name), so(Ie, Ae);
                  }), _e.del.forEach(function(Ae) {
                    return Ie.deleteIndex(Ae);
                  });
                });
                var de = Q._cfg.contentUpgrade;
                if (de && Q._cfg.version > V) {
                  no(P, H), $._memoizedTables = {};
                  var be = ke(ne);
                  oe.del.forEach(function(_e) {
                    be[_e] = re[_e];
                  }), Iu(P, [P.Transaction.prototype]), io(P, [P.Transaction.prototype], u(be), be), $.schema = be;
                  var ve, ye = Ve(de);
                  return ye && St(), oe = f.follow(function() {
                    var _e;
                    (ve = de($)) && ye && (_e = $t.bind(null, null), ve.then(_e, _e));
                  }), ve && typeof ve.then == "function" ? f.resolve(ve) : oe.then(function() {
                    return ve;
                  });
                }
              }), Y.push(function(re) {
                var ne, oe, de = Q._cfg.dbschema;
                ne = de, oe = re, [].slice.call(oe.db.objectStoreNames).forEach(function(be) {
                  return ne[be] == null && oe.db.deleteObjectStore(be);
                }), Iu(P, [P.Transaction.prototype]), io(P, [P.Transaction.prototype], P._storeNames, P._dbSchema), $.schema = P._dbSchema;
              }), Y.push(function(re) {
                P.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(P.idbdb.version / 10) === Q._cfg.version ? (P.idbdb.deleteObjectStore("$meta"), delete P._dbSchema.$meta, P._storeNames = P._storeNames.filter(function(ne) {
                  return ne !== "$meta";
                })) : re.objectStore("$meta").put(Q._cfg.version, "version"));
              });
            }), function Q() {
              return Y.length ? f.resolve(Y.shift()($.idbtrans)).then(Q) : f.resolve();
            }().then(function() {
              xh(z, H);
            })) : f.resolve();
            var P, V, $, H, Y, z;
          }).catch(O)) : (u(I).forEach(function(W) {
            _u(h, W, I[W].primKey, I[W].indexes);
          }), no(s, h), void f.follow(function() {
            return s.on.populate.fire(x);
          }).catch(O));
          var U, j;
        });
      }
      function Vy(s, o) {
        xh(s._dbSchema, o), o.db.version % 10 != 0 || o.objectStoreNames.contains("$meta") || o.db.createObjectStore("$meta").add(Math.ceil(o.db.version / 10 - 1), "version");
        var h = ao(0, s.idbdb, o);
        oo(s, s._dbSchema, o);
        for (var y = 0, I = bu(h, s._dbSchema).change; y < I.length; y++) {
          var x = function(O) {
            if (O.change.length || O.recreate) return console.warn("Unable to patch indexes of table ".concat(O.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var N = o.objectStore(O.name);
            O.add.forEach(function(U) {
              qe && console.debug("Dexie upgrade patch: Creating missing index ".concat(O.name, ".").concat(U.src)), so(N, U);
            });
          }(I[y]);
          if (typeof x == "object") return x.value;
        }
      }
      function bu(s, o) {
        var h, y = { del: [], add: [], change: [] };
        for (h in s) o[h] || y.del.push(h);
        for (h in o) {
          var I = s[h], x = o[h];
          if (I) {
            var O = { name: h, def: x, recreate: !1, del: [], add: [], change: [] };
            if ("" + (I.primKey.keyPath || "") != "" + (x.primKey.keyPath || "") || I.primKey.auto !== x.primKey.auto) O.recreate = !0, y.change.push(O);
            else {
              var N = I.idxByName, U = x.idxByName, j = void 0;
              for (j in N) U[j] || O.del.push(j);
              for (j in U) {
                var W = N[j], P = U[j];
                W ? W.src !== P.src && O.change.push(P) : O.add.push(P);
              }
              (0 < O.del.length || 0 < O.add.length || 0 < O.change.length) && y.change.push(O);
            }
          } else y.add.push([h, x]);
        }
        return y;
      }
      function _u(s, o, h, y) {
        var I = s.db.createObjectStore(o, h.keyPath ? { keyPath: h.keyPath, autoIncrement: h.auto } : { autoIncrement: h.auto });
        return y.forEach(function(x) {
          return so(I, x);
        }), I;
      }
      function xh(s, o) {
        u(s).forEach(function(h) {
          o.db.objectStoreNames.contains(h) || (qe && console.debug("Dexie: Creating missing table", h), _u(o, h, s[h].primKey, s[h].indexes));
        });
      }
      function so(s, o) {
        s.createIndex(o.name, o.keyPath, { unique: o.unique, multiEntry: o.multi });
      }
      function ao(s, o, h) {
        var y = {};
        return J(o.objectStoreNames, 0).forEach(function(I) {
          for (var x = h.objectStore(I), O = yu(_h(j = x.keyPath), j || "", !0, !1, !!x.autoIncrement, j && typeof j != "string", !0), N = [], U = 0; U < x.indexNames.length; ++U) {
            var W = x.index(x.indexNames[U]), j = W.keyPath, W = yu(W.name, j, !!W.unique, !!W.multiEntry, !1, j && typeof j != "string", !1);
            N.push(W);
          }
          y[I] = gu(I, O, N);
        }), y;
      }
      function oo(s, o, h) {
        for (var y = h.db.objectStoreNames, I = 0; I < y.length; ++I) {
          var x = y[I], O = h.objectStore(x);
          s._hasGetAll = "getAll" in O;
          for (var N = 0; N < O.indexNames.length; ++N) {
            var U = O.indexNames[N], j = O.index(U).keyPath, W = typeof j == "string" ? j : "[" + J(j).join("+") + "]";
            !o[x] || (j = o[x].idxByName[W]) && (j.name = U, delete o[x].idxByName[W], o[x].idxByName[U] = j);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && a.WorkerGlobalScope && a instanceof a.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (s._hasGetAll = !1);
      }
      function Eh(s) {
        return s.split(",").map(function(o, h) {
          var y = (o = o.trim()).replace(/([&*]|\+\+)/g, ""), I = /^\[/.test(y) ? y.match(/^\[(.*)\]$/)[1].split("+") : y;
          return yu(y, I || null, /\&/.test(o), /\*/.test(o), /\+\+/.test(o), l(I), h === 0);
        });
      }
      var Jy = (uo.prototype._parseStoresSpec = function(s, o) {
        u(s).forEach(function(h) {
          if (s[h] !== null) {
            var y = Eh(s[h]), I = y.shift();
            if (I.unique = !0, I.multi) throw new he.Schema("Primary key cannot be multi-valued");
            y.forEach(function(x) {
              if (x.auto) throw new he.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!x.keyPath) throw new he.Schema("Index must have a name and cannot be an empty string");
            }), o[h] = gu(h, I, y);
          }
        });
      }, uo.prototype.stores = function(h) {
        var o = this.db;
        this._cfg.storesSource = this._cfg.storesSource ? c(this._cfg.storesSource, h) : h;
        var h = o._versions, y = {}, I = {};
        return h.forEach(function(x) {
          c(y, x._cfg.storesSource), I = x._cfg.dbschema = {}, x._parseStoresSpec(y, I);
        }), o._dbSchema = I, Iu(o, [o._allTables, o, o.Transaction.prototype]), io(o, [o._allTables, o, o.Transaction.prototype, this._cfg.tables], u(I), I), o._storeNames = u(I), this;
      }, uo.prototype.upgrade = function(s) {
        return this._cfg.contentUpgrade = Ot(this._cfg.contentUpgrade || me, s), this;
      }, uo);
      function uo() {
      }
      function wu(s, o) {
        var h = s._dbNamesDB;
        return h || (h = s._dbNamesDB = new In(Qa, { addons: [], indexedDB: s, IDBKeyRange: o })).version(1).stores({ dbnames: "name" }), h.table("dbnames");
      }
      function xu(s) {
        return s && typeof s.databases == "function";
      }
      function Eu(s) {
        return Nt(function() {
          return q.letThrough = !0, s();
        });
      }
      function Su(s) {
        return !("from" in s);
      }
      var Qt = function(s, o) {
        if (!this) {
          var h = new Qt();
          return s && "d" in s && c(h, s), h;
        }
        c(this, arguments.length ? { d: 1, from: s, to: 1 < arguments.length ? o : s } : { d: 0 });
      };
      function Ia(s, o, h) {
        var y = ot(o, h);
        if (!isNaN(y)) {
          if (0 < y) throw RangeError();
          if (Su(s)) return c(s, { from: o, to: h, d: 1 });
          var I = s.l, y = s.r;
          if (ot(h, s.from) < 0) return I ? Ia(I, o, h) : s.l = { from: o, to: h, d: 1, l: null, r: null }, Ah(s);
          if (0 < ot(o, s.to)) return y ? Ia(y, o, h) : s.r = { from: o, to: h, d: 1, l: null, r: null }, Ah(s);
          ot(o, s.from) < 0 && (s.from = o, s.l = null, s.d = y ? y.d + 1 : 1), 0 < ot(h, s.to) && (s.to = h, s.r = null, s.d = s.l ? s.l.d + 1 : 1), h = !s.r, I && !s.l && ba(s, I), y && h && ba(s, y);
        }
      }
      function ba(s, o) {
        Su(o) || function h(y, U) {
          var x = U.from, O = U.to, N = U.l, U = U.r;
          Ia(y, x, O), N && h(y, N), U && h(y, U);
        }(s, o);
      }
      function Sh(s, o) {
        var h = lo(o), y = h.next();
        if (y.done) return !1;
        for (var I = y.value, x = lo(s), O = x.next(I.from), N = O.value; !y.done && !O.done; ) {
          if (ot(N.from, I.to) <= 0 && 0 <= ot(N.to, I.from)) return !0;
          ot(I.from, N.from) < 0 ? I = (y = h.next(N.from)).value : N = (O = x.next(I.from)).value;
        }
        return !1;
      }
      function lo(s) {
        var o = Su(s) ? null : { s: 0, n: s };
        return { next: function(h) {
          for (var y = 0 < arguments.length; o; ) switch (o.s) {
            case 0:
              if (o.s = 1, y) for (; o.n.l && ot(h, o.n.from) < 0; ) o = { up: o, n: o.n.l, s: 1 };
              else for (; o.n.l; ) o = { up: o, n: o.n.l, s: 1 };
            case 1:
              if (o.s = 2, !y || ot(h, o.n.to) <= 0) return { value: o.n, done: !1 };
            case 2:
              if (o.n.r) {
                o.s = 3, o = { up: o, n: o.n.r, s: 0 };
                continue;
              }
            case 3:
              o = o.up;
          }
          return { done: !0 };
        } };
      }
      function Ah(s) {
        var o, h, y = (((o = s.r) === null || o === void 0 ? void 0 : o.d) || 0) - (((h = s.l) === null || h === void 0 ? void 0 : h.d) || 0), I = 1 < y ? "r" : y < -1 ? "l" : "";
        I && (o = I == "r" ? "l" : "r", h = r({}, s), y = s[I], s.from = y.from, s.to = y.to, s[I] = y[I], h[I] = y[o], (s[o] = h).d = kh(h)), s.d = kh(s);
      }
      function kh(h) {
        var o = h.r, h = h.l;
        return (o ? h ? Math.max(o.d, h.d) : o.d : h ? h.d : 0) + 1;
      }
      function co(s, o) {
        return u(o).forEach(function(h) {
          s[h] ? ba(s[h], o[h]) : s[h] = function y(I) {
            var x, O, N = {};
            for (x in I) w(I, x) && (O = I[x], N[x] = !O || typeof O != "object" || $e.has(O.constructor) ? O : y(O));
            return N;
          }(o[h]);
        }), s;
      }
      function Au(s, o) {
        return s.all || o.all || Object.keys(s).some(function(h) {
          return o[h] && Sh(o[h], s[h]);
        });
      }
      E(Qt.prototype, ((qr = { add: function(s) {
        return ba(this, s), this;
      }, addKey: function(s) {
        return Ia(this, s, s), this;
      }, addKeys: function(s) {
        var o = this;
        return s.forEach(function(h) {
          return Ia(o, h, h);
        }), this;
      }, hasKey: function(s) {
        var o = lo(this).next(s).value;
        return o && ot(o.from, s) <= 0 && 0 <= ot(o.to, s);
      } })[vt] = function() {
        return lo(this);
      }, qr));
      var Si = {}, ku = {}, Ou = !1;
      function fo(s) {
        co(ku, s), Ou || (Ou = !0, setTimeout(function() {
          Ou = !1, Ru(ku, !(ku = {}));
        }, 0));
      }
      function Ru(s, o) {
        o === void 0 && (o = !1);
        var h = /* @__PURE__ */ new Set();
        if (s.all) for (var y = 0, I = Object.values(Si); y < I.length; y++) Oh(O = I[y], s, h, o);
        else for (var x in s) {
          var O, N = /^idb\:\/\/(.*)\/(.*)\//.exec(x);
          N && (x = N[1], N = N[2], (O = Si["idb://".concat(x, "/").concat(N)]) && Oh(O, s, h, o));
        }
        h.forEach(function(U) {
          return U();
        });
      }
      function Oh(s, o, h, y) {
        for (var I = [], x = 0, O = Object.entries(s.queries.query); x < O.length; x++) {
          for (var N = O[x], U = N[0], j = [], W = 0, P = N[1]; W < P.length; W++) {
            var V = P[W];
            Au(o, V.obsSet) ? V.subscribers.forEach(function(z) {
              return h.add(z);
            }) : y && j.push(V);
          }
          y && I.push([U, j]);
        }
        if (y) for (var $ = 0, H = I; $ < H.length; $++) {
          var Y = H[$], U = Y[0], j = Y[1];
          s.queries.query[U] = j;
        }
      }
      function Zy(s) {
        var o = s._state, h = s._deps.indexedDB;
        if (o.isBeingOpened || s.idbdb) return o.dbReadyPromise.then(function() {
          return o.dbOpenError ? Pt(o.dbOpenError) : s;
        });
        o.isBeingOpened = !0, o.dbOpenError = null, o.openComplete = !1;
        var y = o.openCanceller, I = Math.round(10 * s.verno), x = !1;
        function O() {
          if (o.openCanceller !== y) throw new he.DatabaseClosed("db.open() was cancelled");
        }
        function N() {
          return new f(function(V, $) {
            if (O(), !h) throw new he.MissingAPI();
            var H = s.name, Y = o.autoSchema || !I ? h.open(H) : h.open(H, I);
            if (!Y) throw new he.MissingAPI();
            Y.onerror = tn($), Y.onblocked = Te(s._fireOnBlocked), Y.onupgradeneeded = Te(function(z) {
              var Q;
              W = Y.transaction, o.autoSchema && !s._options.allowEmptyDB ? (Y.onerror = va, W.abort(), Y.result.close(), (Q = h.deleteDatabase(H)).onsuccess = Q.onerror = Te(function() {
                $(new he.NoSuchDatabase("Database ".concat(H, " doesnt exist")));
              })) : (W.onerror = tn($), z = z.oldVersion > Math.pow(2, 62) ? 0 : z.oldVersion, P = z < 1, s.idbdb = Y.result, x && Vy(s, W), Yy(s, z / 10, W, $));
            }, $), Y.onsuccess = Te(function() {
              W = null;
              var z, Q, re, ne, oe, de = s.idbdb = Y.result, be = J(de.objectStoreNames);
              if (0 < be.length) try {
                var ve = de.transaction((ne = be).length === 1 ? ne[0] : ne, "readonly");
                if (o.autoSchema) Q = de, re = ve, (z = s).verno = Q.version / 10, re = z._dbSchema = ao(0, Q, re), z._storeNames = J(Q.objectStoreNames, 0), io(z, [z._allTables], u(re), re);
                else if (oo(s, s._dbSchema, ve), ((oe = bu(ao(0, (oe = s).idbdb, ve), oe._dbSchema)).add.length || oe.change.some(function(ye) {
                  return ye.add.length || ye.change.length;
                })) && !x) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), de.close(), I = de.version + 1, x = !0, V(N());
                no(s, ve);
              } catch {
              }
              ys.push(s), de.onversionchange = Te(function(ye) {
                o.vcFired = !0, s.on("versionchange").fire(ye);
              }), de.onclose = Te(function(ye) {
                s.on("close").fire(ye);
              }), P && (oe = s._deps, ve = H, de = oe.indexedDB, oe = oe.IDBKeyRange, xu(de) || ve === Qa || wu(de, oe).put({ name: ve }).catch(me)), V();
            }, $);
          }).catch(function(V) {
            switch (V == null ? void 0 : V.name) {
              case "UnknownError":
                if (0 < o.PR1398_maxLoop) return o.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), N();
                break;
              case "VersionError":
                if (0 < I) return I = 0, N();
            }
            return f.reject(V);
          });
        }
        var U, j = o.dbReadyResolve, W = null, P = !1;
        return f.race([y, (typeof navigator > "u" ? f.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(V) {
          function $() {
            return indexedDB.databases().finally(V);
          }
          U = setInterval($, 100), $();
        }).finally(function() {
          return clearInterval(U);
        }) : Promise.resolve()).then(N)]).then(function() {
          return O(), o.onReadyBeingFired = [], f.resolve(Eu(function() {
            return s.on.ready.fire(s.vip);
          })).then(function V() {
            if (0 < o.onReadyBeingFired.length) {
              var $ = o.onReadyBeingFired.reduce(Ot, me);
              return o.onReadyBeingFired = [], f.resolve(Eu(function() {
                return $(s.vip);
              })).then(V);
            }
          });
        }).finally(function() {
          o.openCanceller === y && (o.onReadyBeingFired = null, o.isBeingOpened = !1);
        }).catch(function(V) {
          o.dbOpenError = V;
          try {
            W && W.abort();
          } catch {
          }
          return y === o.openCanceller && s._close(), Pt(V);
        }).finally(function() {
          o.openComplete = !0, j();
        }).then(function() {
          var V;
          return P && (V = {}, s.tables.forEach(function($) {
            $.schema.indexes.forEach(function(H) {
              H.name && (V["idb://".concat(s.name, "/").concat($.name, "/").concat(H.name)] = new Qt(-1 / 0, [[[]]]));
            }), V["idb://".concat(s.name, "/").concat($.name, "/")] = V["idb://".concat(s.name, "/").concat($.name, "/:dels")] = new Qt(-1 / 0, [[[]]]);
          }), qn(ya).fire(V), Ru(V, !0)), s;
        });
      }
      function Tu(s) {
        function o(x) {
          return s.next(x);
        }
        var h = I(o), y = I(function(x) {
          return s.throw(x);
        });
        function I(x) {
          return function(U) {
            var N = x(U), U = N.value;
            return N.done ? U : U && typeof U.then == "function" ? U.then(h, y) : l(U) ? Promise.all(U).then(h, y) : h(U);
          };
        }
        return I(o)();
      }
      function ho(s, o, h) {
        for (var y = l(s) ? s.slice() : [s], I = 0; I < h; ++I) y.push(o);
        return y;
      }
      var Qy = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(s) {
        return r(r({}, s), { table: function(o) {
          var h = s.table(o), y = h.schema, I = {}, x = [];
          function O(P, V, $) {
            var H = ma(P), Y = I[H] = I[H] || [], z = P == null ? 0 : typeof P == "string" ? 1 : P.length, Q = 0 < V, Q = r(r({}, $), { name: Q ? "".concat(H, "(virtual-from:").concat($.name, ")") : $.name, lowLevelIndex: $, isVirtual: Q, keyTail: V, keyLength: z, extractKey: mu(P), unique: !Q && $.unique });
            return Y.push(Q), Q.isPrimaryKey || x.push(Q), 1 < z && O(z === 2 ? P[0] : P.slice(0, z - 1), V + 1, $), Y.sort(function(re, ne) {
              return re.keyTail - ne.keyTail;
            }), Q;
          }
          o = O(y.primaryKey.keyPath, 0, y.primaryKey), I[":id"] = [o];
          for (var N = 0, U = y.indexes; N < U.length; N++) {
            var j = U[N];
            O(j.keyPath, 0, j);
          }
          function W(P) {
            var V, $ = P.query.index;
            return $.isVirtual ? r(r({}, P), { query: { index: $.lowLevelIndex, range: (V = P.query.range, $ = $.keyTail, { type: V.type === 1 ? 2 : V.type, lower: ho(V.lower, V.lowerOpen ? s.MAX_KEY : s.MIN_KEY, $), lowerOpen: !0, upper: ho(V.upper, V.upperOpen ? s.MIN_KEY : s.MAX_KEY, $), upperOpen: !0 }) } }) : P;
          }
          return r(r({}, h), { schema: r(r({}, y), { primaryKey: o, indexes: x, getIndexByKeyPath: function(P) {
            return (P = I[ma(P)]) && P[0];
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
                re != null ? Q.continue(ho(re, P.reverse ? s.MAX_KEY : s.MIN_KEY, $)) : P.unique ? Q.continue(Q.key.slice(0, Y).concat(P.reverse ? s.MIN_KEY : s.MAX_KEY, $)) : Q.continue();
              } }, continuePrimaryKey: { value: function(re, ne) {
                Q.continuePrimaryKey(ho(re, s.MAX_KEY, $), ne);
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
      function Cu(s, o, h, y) {
        return h = h || {}, y = y || "", u(s).forEach(function(I) {
          var x, O, N;
          w(o, I) ? (x = s[I], O = o[I], typeof x == "object" && typeof O == "object" && x && O ? (N = at(x)) !== at(O) ? h[y + I] = o[I] : N === "Object" ? Cu(x, O, h, y + I + ".") : x !== O && (h[y + I] = o[I]) : x !== O && (h[y + I] = o[I])) : h[y + I] = void 0;
        }), u(o).forEach(function(I) {
          w(s, I) || (h[y + I] = o[I]);
        }), h;
      }
      function Nu(s, o) {
        return o.type === "delete" ? o.keys : o.keys || o.values.map(s.extractKey);
      }
      var Xy = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(s) {
        return r(r({}, s), { table: function(o) {
          var h = s.table(o), y = h.schema.primaryKey;
          return r(r({}, h), { mutate: function(I) {
            var x = q.trans, O = x.table(o).hook, N = O.deleting, U = O.creating, j = O.updating;
            switch (I.type) {
              case "add":
                if (U.fire === me) break;
                return x._promise("readwrite", function() {
                  return W(I);
                }, !0);
              case "put":
                if (U.fire === me && j.fire === me) break;
                return x._promise("readwrite", function() {
                  return W(I);
                }, !0);
              case "delete":
                if (N.fire === me) break;
                return x._promise("readwrite", function() {
                  return W(I);
                }, !0);
              case "deleteRange":
                if (N.fire === me) break;
                return x._promise("readwrite", function() {
                  return function P(V, $, H) {
                    return h.query({ trans: V, values: !1, query: { index: y, range: $ }, limit: H }).then(function(Y) {
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
              var V, $, H, Y = q.trans, z = P.keys || Nu(y, P);
              if (!z) throw new Error("Keys missing");
              return (P = P.type === "add" || P.type === "put" ? r(r({}, P), { keys: z }) : r({}, P)).type !== "delete" && (P.values = i([], P.values)), P.keys && (P.keys = i([], P.keys)), V = h, H = z, (($ = P).type === "add" ? Promise.resolve([]) : V.getMany({ trans: $.trans, keys: H, cache: "immutable" })).then(function(Q) {
                var re = z.map(function(ne, oe) {
                  var de, be, ve, ye = Q[oe], _e = { onerror: null, onsuccess: null };
                  return P.type === "delete" ? N.fire.call(_e, ne, ye, Y) : P.type === "add" || ye === void 0 ? (de = U.fire.call(_e, ne, P.values[oe], Y), ne == null && de != null && (P.keys[oe] = ne = de, y.outbound || ae(P.values[oe], y.keyPath, ne))) : (de = Cu(ye, P.values[oe]), (be = j.fire.call(_e, de, ne, ye, Y)) && (ve = P.values[oe], Object.keys(be).forEach(function(Ie) {
                    w(ve, Ie) ? ve[Ie] = be[Ie] : ae(ve, Ie, be[Ie]);
                  }))), _e;
                });
                return h.mutate(P).then(function(ne) {
                  for (var oe = ne.failures, de = ne.results, be = ne.numFailures, ne = ne.lastResult, ve = 0; ve < z.length; ++ve) {
                    var ye = (de || z)[ve], _e = re[ve];
                    ye == null ? _e.onerror && _e.onerror(oe[ve]) : _e.onsuccess && _e.onsuccess(P.type === "put" && Q[ve] ? P.values[ve] : ye);
                  }
                  return { failures: oe, results: de, numFailures: be, lastResult: ne };
                }).catch(function(ne) {
                  return re.forEach(function(oe) {
                    return oe.onerror && oe.onerror(ne);
                  }), Promise.reject(ne);
                });
              });
            }
          } });
        } });
      } };
      function Rh(s, o, h) {
        try {
          if (!o || o.keys.length < s.length) return null;
          for (var y = [], I = 0, x = 0; I < o.keys.length && x < s.length; ++I) ot(o.keys[I], s[x]) === 0 && (y.push(h ? Se(o.values[I]) : o.values[I]), ++x);
          return y.length === s.length ? y : null;
        } catch {
          return null;
        }
      }
      var eg = { stack: "dbcore", level: -1, create: function(s) {
        return { table: function(o) {
          var h = s.table(o);
          return r(r({}, h), { getMany: function(y) {
            if (!y.cache) return h.getMany(y);
            var I = Rh(y.keys, y.trans._cache, y.cache === "clone");
            return I ? f.resolve(I) : h.getMany(y).then(function(x) {
              return y.trans._cache = { keys: y.keys, values: y.cache === "clone" ? Se(x) : x }, x;
            });
          }, mutate: function(y) {
            return y.type !== "add" && (y.trans._cache = null), h.mutate(y);
          } });
        } };
      } };
      function Th(s, o) {
        return s.trans.mode === "readonly" && !!s.subscr && !s.trans.explicit && s.trans.db._options.cache !== "disabled" && !o.schema.primaryKey.outbound;
      }
      function Ch(s, o) {
        switch (s) {
          case "query":
            return o.values && !o.unique;
          case "get":
          case "getMany":
          case "count":
          case "openCursor":
            return !1;
        }
      }
      var tg = { stack: "dbcore", level: 0, name: "Observability", create: function(s) {
        var o = s.schema.name, h = new Qt(s.MIN_KEY, s.MAX_KEY);
        return r(r({}, s), { transaction: function(y, I, x) {
          if (q.subscr && I !== "readonly") throw new he.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(q.querier));
          return s.transaction(y, I, x);
        }, table: function(y) {
          var I = s.table(y), x = I.schema, O = x.primaryKey, P = x.indexes, N = O.extractKey, U = O.outbound, j = O.autoIncrement && P.filter(function($) {
            return $.compound && $.keyPath.includes(O.keyPath);
          }), W = r(r({}, I), { mutate: function($) {
            function H(Ie) {
              return Ie = "idb://".concat(o, "/").concat(y, "/").concat(Ie), ne[Ie] || (ne[Ie] = new Qt());
            }
            var Y, z, Q, re = $.trans, ne = $.mutatedParts || ($.mutatedParts = {}), oe = H(""), de = H(":dels"), be = $.type, _e = $.type === "deleteRange" ? [$.range] : $.type === "delete" ? [$.keys] : $.values.length < 50 ? [Nu(O, $).filter(function(Ie) {
              return Ie;
            }), $.values] : [], ve = _e[0], ye = _e[1], _e = $.trans._cache;
            return l(ve) ? (oe.addKeys(ve), (_e = be === "delete" || ve.length === ye.length ? Rh(ve, _e) : null) || de.addKeys(ve), (_e || ye) && (Y = H, z = _e, Q = ye, x.indexes.forEach(function(Ie) {
              var Ae = Y(Ie.name || "");
              function Ye(nt) {
                return nt != null ? Ie.extractKey(nt) : null;
              }
              function rt(nt) {
                return Ie.multiEntry && l(nt) ? nt.forEach(function(Nr) {
                  return Ae.addKey(Nr);
                }) : Ae.addKey(nt);
              }
              (z || Q).forEach(function(nt, Xt) {
                var ze = z && Ye(z[Xt]), Xt = Q && Ye(Q[Xt]);
                ot(ze, Xt) !== 0 && (ze != null && rt(ze), Xt != null && rt(Xt));
              });
            }))) : ve ? (ye = { from: (ye = ve.lower) !== null && ye !== void 0 ? ye : s.MIN_KEY, to: (ye = ve.upper) !== null && ye !== void 0 ? ye : s.MAX_KEY }, de.add(ye), oe.add(ye)) : (oe.add(h), de.add(h), x.indexes.forEach(function(Ie) {
              return H(Ie.name).add(h);
            })), I.mutate($).then(function(Ie) {
              return !ve || $.type !== "add" && $.type !== "put" || (oe.addKeys(Ie.results), j && j.forEach(function(Ae) {
                for (var Ye = $.values.map(function(ze) {
                  return Ae.extractKey(ze);
                }), rt = Ae.keyPath.findIndex(function(ze) {
                  return ze === O.keyPath;
                }), nt = 0, Nr = Ie.results.length; nt < Nr; ++nt) Ye[nt][rt] = Ie.results[nt];
                H(Ae.name).addKeys(Ye);
              })), re.mutatedParts = co(re.mutatedParts || {}, ne), Ie;
            });
          } }), P = function(H) {
            var Y = H.query, H = Y.index, Y = Y.range;
            return [H, new Qt((H = Y.lower) !== null && H !== void 0 ? H : s.MIN_KEY, (Y = Y.upper) !== null && Y !== void 0 ? Y : s.MAX_KEY)];
          }, V = { get: function($) {
            return [O, new Qt($.key)];
          }, getMany: function($) {
            return [O, new Qt().addKeys($.keys)];
          }, count: P, query: P, openCursor: P };
          return u(V).forEach(function($) {
            W[$] = function(H) {
              var Y = q.subscr, z = !!Y, Q = Th(q, I) && Ch($, H) ? H.obsSet = {} : Y;
              if (z) {
                var re = function(ye) {
                  return ye = "idb://".concat(o, "/").concat(y, "/").concat(ye), Q[ye] || (Q[ye] = new Qt());
                }, ne = re(""), oe = re(":dels"), Y = V[$](H), z = Y[0], Y = Y[1];
                if (($ === "query" && z.isPrimaryKey && !H.values ? oe : re(z.name || "")).add(Y), !z.isPrimaryKey) {
                  if ($ !== "count") {
                    var de = $ === "query" && U && H.values && I.query(r(r({}, H), { values: !1 }));
                    return I[$].apply(this, arguments).then(function(ye) {
                      if ($ === "query") {
                        if (U && H.values) return de.then(function(Ye) {
                          return Ye = Ye.result, ne.addKeys(Ye), ye;
                        });
                        var _e = H.values ? ye.result.map(N) : ye.result;
                        (H.values ? ne : oe).addKeys(_e);
                      } else if ($ === "openCursor") {
                        var Ie = ye, Ae = H.values;
                        return Ie && Object.create(Ie, { key: { get: function() {
                          return oe.addKey(Ie.primaryKey), Ie.key;
                        } }, primaryKey: { get: function() {
                          var Ye = Ie.primaryKey;
                          return oe.addKey(Ye), Ye;
                        } }, value: { get: function() {
                          return Ae && ne.addKey(Ie.primaryKey), Ie.value;
                        } } });
                      }
                      return ye;
                    });
                  }
                  oe.add(h);
                }
              }
              return I[$].apply(this, arguments);
            };
          }), W;
        } });
      } };
      function Nh(s, o, h) {
        if (h.numFailures === 0) return o;
        if (o.type === "deleteRange") return null;
        var y = o.keys ? o.keys.length : "values" in o && o.values ? o.values.length : 1;
        return h.numFailures === y ? null : (o = r({}, o), l(o.keys) && (o.keys = o.keys.filter(function(I, x) {
          return !(x in h.failures);
        })), "values" in o && l(o.values) && (o.values = o.values.filter(function(I, x) {
          return !(x in h.failures);
        })), o);
      }
      function Pu(s, o) {
        return h = s, ((y = o).lower === void 0 || (y.lowerOpen ? 0 < ot(h, y.lower) : 0 <= ot(h, y.lower))) && (s = s, (o = o).upper === void 0 || (o.upperOpen ? ot(s, o.upper) < 0 : ot(s, o.upper) <= 0));
        var h, y;
      }
      function Ph(s, o, V, y, I, x) {
        if (!V || V.length === 0) return s;
        var O = o.query.index, N = O.multiEntry, U = o.query.range, j = y.schema.primaryKey.extractKey, W = O.extractKey, P = (O.lowLevelIndex || O).extractKey, V = V.reduce(function($, H) {
          var Y = $, z = [];
          if (H.type === "add" || H.type === "put") for (var Q = new Qt(), re = H.values.length - 1; 0 <= re; --re) {
            var ne, oe = H.values[re], de = j(oe);
            Q.hasKey(de) || (ne = W(oe), (N && l(ne) ? ne.some(function(Ie) {
              return Pu(Ie, U);
            }) : Pu(ne, U)) && (Q.addKey(de), z.push(oe)));
          }
          switch (H.type) {
            case "add":
              var be = new Qt().addKeys(o.values ? $.map(function(Ae) {
                return j(Ae);
              }) : $), Y = $.concat(o.values ? z.filter(function(Ae) {
                return Ae = j(Ae), !be.hasKey(Ae) && (be.addKey(Ae), !0);
              }) : z.map(function(Ae) {
                return j(Ae);
              }).filter(function(Ae) {
                return !be.hasKey(Ae) && (be.addKey(Ae), !0);
              }));
              break;
            case "put":
              var ve = new Qt().addKeys(H.values.map(function(Ae) {
                return j(Ae);
              }));
              Y = $.filter(function(Ae) {
                return !ve.hasKey(o.values ? j(Ae) : Ae);
              }).concat(o.values ? z : z.map(function(Ae) {
                return j(Ae);
              }));
              break;
            case "delete":
              var ye = new Qt().addKeys(H.keys);
              Y = $.filter(function(Ae) {
                return !ye.hasKey(o.values ? j(Ae) : Ae);
              });
              break;
            case "deleteRange":
              var _e = H.range;
              Y = $.filter(function(Ae) {
                return !Pu(j(Ae), _e);
              });
          }
          return Y;
        }, s);
        return V === s ? s : (V.sort(function($, H) {
          return ot(P($), P(H)) || ot(j($), j(H));
        }), o.limit && o.limit < 1 / 0 && (V.length > o.limit ? V.length = o.limit : s.length === o.limit && V.length < o.limit && (I.dirty = !0)), x ? Object.freeze(V) : V);
      }
      function Dh(s, o) {
        return ot(s.lower, o.lower) === 0 && ot(s.upper, o.upper) === 0 && !!s.lowerOpen == !!o.lowerOpen && !!s.upperOpen == !!o.upperOpen;
      }
      function rg(s, o) {
        return function(h, y, I, x) {
          if (h === void 0) return y !== void 0 ? -1 : 0;
          if (y === void 0) return 1;
          if ((y = ot(h, y)) === 0) {
            if (I && x) return 0;
            if (I) return 1;
            if (x) return -1;
          }
          return y;
        }(s.lower, o.lower, s.lowerOpen, o.lowerOpen) <= 0 && 0 <= function(h, y, I, x) {
          if (h === void 0) return y !== void 0 ? 1 : 0;
          if (y === void 0) return -1;
          if ((y = ot(h, y)) === 0) {
            if (I && x) return 0;
            if (I) return -1;
            if (x) return 1;
          }
          return y;
        }(s.upper, o.upper, s.upperOpen, o.upperOpen);
      }
      function ng(s, o, h, y) {
        s.subscribers.add(h), y.addEventListener("abort", function() {
          var I, x;
          s.subscribers.delete(h), s.subscribers.size === 0 && (I = s, x = o, setTimeout(function() {
            I.subscribers.size === 0 && He(x, I);
          }, 3e3));
        });
      }
      var ig = { stack: "dbcore", level: 0, name: "Cache", create: function(s) {
        var o = s.schema.name;
        return r(r({}, s), { transaction: function(h, y, I) {
          var x, O, N = s.transaction(h, y, I);
          return y === "readwrite" && (O = (x = new AbortController()).signal, I = function(U) {
            return function() {
              if (x.abort(), y === "readwrite") {
                for (var j = /* @__PURE__ */ new Set(), W = 0, P = h; W < P.length; W++) {
                  var V = P[W], $ = Si["idb://".concat(o, "/").concat(V)];
                  if ($) {
                    var H = s.table(V), Y = $.optimisticOps.filter(function(Ae) {
                      return Ae.trans === N;
                    });
                    if (N._explicit && U && N.mutatedParts) for (var z = 0, Q = Object.values($.queries.query); z < Q.length; z++) for (var re = 0, ne = (be = Q[z]).slice(); re < ne.length; re++) Au((ve = ne[re]).obsSet, N.mutatedParts) && (He(be, ve), ve.subscribers.forEach(function(Ae) {
                      return j.add(Ae);
                    }));
                    else if (0 < Y.length) {
                      $.optimisticOps = $.optimisticOps.filter(function(Ae) {
                        return Ae.trans !== N;
                      });
                      for (var oe = 0, de = Object.values($.queries.query); oe < de.length; oe++) for (var be, ve, ye, _e = 0, Ie = (be = de[oe]).slice(); _e < Ie.length; _e++) (ve = Ie[_e]).res != null && N.mutatedParts && (U && !ve.dirty ? (ye = Object.isFrozen(ve.res), ye = Ph(ve.res, ve.req, Y, H, ve, ye), ve.dirty ? (He(be, ve), ve.subscribers.forEach(function(Ae) {
                        return j.add(Ae);
                      })) : ye !== ve.res && (ve.res = ye, ve.promise = f.resolve({ result: ye }))) : (ve.dirty && He(be, ve), ve.subscribers.forEach(function(Ae) {
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
          var y = s.table(h), I = y.schema.primaryKey;
          return r(r({}, y), { mutate: function(x) {
            var O = q.trans;
            if (I.outbound || O.db._options.cache === "disabled" || O.explicit || O.idbtrans.mode !== "readwrite") return y.mutate(x);
            var N = Si["idb://".concat(o, "/").concat(h)];
            return N ? (O = y.mutate(x), x.type !== "add" && x.type !== "put" || !(50 <= x.values.length || Nu(I, x).some(function(U) {
              return U == null;
            })) ? (N.optimisticOps.push(x), x.mutatedParts && fo(x.mutatedParts), O.then(function(U) {
              0 < U.numFailures && (He(N.optimisticOps, x), (U = Nh(0, x, U)) && N.optimisticOps.push(U), x.mutatedParts && fo(x.mutatedParts));
            }), O.catch(function() {
              He(N.optimisticOps, x), x.mutatedParts && fo(x.mutatedParts);
            })) : O.then(function(U) {
              var j = Nh(0, r(r({}, x), { values: x.values.map(function(W, P) {
                var V;
                return U.failures[P] ? W : (W = (V = I.keyPath) !== null && V !== void 0 && V.includes(".") ? Se(W) : r({}, W), ae(W, I.keyPath, U.results[P]), W);
              }) }), U);
              N.optimisticOps.push(j), queueMicrotask(function() {
                return x.mutatedParts && fo(x.mutatedParts);
              });
            }), O) : y.mutate(x);
          }, query: function(x) {
            if (!Th(q, y) || !Ch("query", x)) return y.query(x);
            var O = ((j = q.trans) === null || j === void 0 ? void 0 : j.db._options.cache) === "immutable", P = q, N = P.requery, U = P.signal, j = function(H, Y, z, Q) {
              var re = Si["idb://".concat(H, "/").concat(Y)];
              if (!re) return [];
              if (!(Y = re.queries[z])) return [null, !1, re, null];
              var ne = Y[(Q.query ? Q.query.index.name : null) || ""];
              if (!ne) return [null, !1, re, null];
              switch (z) {
                case "query":
                  var oe = ne.find(function(de) {
                    return de.req.limit === Q.limit && de.req.values === Q.values && Dh(de.req.query.range, Q.query.range);
                  });
                  return oe ? [oe, !0, re, ne] : [ne.find(function(de) {
                    return ("limit" in de.req ? de.req.limit : 1 / 0) >= Q.limit && (!Q.values || de.req.values) && rg(de.req.query.range, Q.query.range);
                  }), !1, re, ne];
                case "count":
                  return oe = ne.find(function(de) {
                    return Dh(de.req.query.range, Q.query.range);
                  }), [oe, !!oe, re, ne];
              }
            }(o, h, "query", x), W = j[0], P = j[1], V = j[2], $ = j[3];
            return W && P ? W.obsSet = x.obsSet : (P = y.query(x).then(function(H) {
              var Y = H.result;
              if (W && (W.res = Y), O) {
                for (var z = 0, Q = Y.length; z < Q; ++z) Object.freeze(Y[z]);
                Object.freeze(Y);
              } else H.result = Se(Y);
              return H;
            }).catch(function(H) {
              return $ && W && He($, W), Promise.reject(H);
            }), W = { obsSet: x.obsSet, promise: P, subscribers: /* @__PURE__ */ new Set(), type: "query", req: x, dirty: !1 }, $ ? $.push(W) : ($ = [W], (V = V || (Si["idb://".concat(o, "/").concat(h)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[x.query.index.name || ""] = $)), ng(W, $, N, U), W.promise.then(function(H) {
              return { result: Ph(H.result, x, V == null ? void 0 : V.optimisticOps, y, W, O) };
            });
          } });
        } });
      } };
      function po(s, o) {
        return new Proxy(s, { get: function(h, y, I) {
          return y === "db" ? o : Reflect.get(h, y, I);
        } });
      }
      var In = (Dt.prototype.version = function(s) {
        if (isNaN(s) || s < 0.1) throw new he.Type("Given version is not a positive number");
        if (s = Math.round(10 * s) / 10, this.idbdb || this._state.isBeingOpened) throw new he.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, s);
        var o = this._versions, h = o.filter(function(y) {
          return y._cfg.version === s;
        })[0];
        return h || (h = new this.Version(s), o.push(h), o.sort(Wy), h.stores({}), this._state.autoSchema = !1, h);
      }, Dt.prototype._whenReady = function(s) {
        var o = this;
        return this.idbdb && (this._state.openComplete || q.letThrough || this._vip) ? s() : new f(function(h, y) {
          if (o._state.openComplete) return y(new he.DatabaseClosed(o._state.dbOpenError));
          if (!o._state.isBeingOpened) {
            if (!o._state.autoOpen) return void y(new he.DatabaseClosed());
            o.open().catch(me);
          }
          o._state.dbReadyPromise.then(h, y);
        }).then(s);
      }, Dt.prototype.use = function(s) {
        var o = s.stack, h = s.create, y = s.level, I = s.name;
        return I && this.unuse({ stack: o, name: I }), s = this._middlewares[o] || (this._middlewares[o] = []), s.push({ stack: o, create: h, level: y ?? 10, name: I }), s.sort(function(x, O) {
          return x.level - O.level;
        }), this;
      }, Dt.prototype.unuse = function(s) {
        var o = s.stack, h = s.name, y = s.create;
        return o && this._middlewares[o] && (this._middlewares[o] = this._middlewares[o].filter(function(I) {
          return y ? I.create !== y : !!h && I.name !== h;
        })), this;
      }, Dt.prototype.open = function() {
        var s = this;
        return wi(B, function() {
          return Zy(s);
        });
      }, Dt.prototype._close = function() {
        var s = this._state, o = ys.indexOf(this);
        if (0 <= o && ys.splice(o, 1), this.idbdb) {
          try {
            this.idbdb.close();
          } catch {
          }
          this.idbdb = null;
        }
        s.isBeingOpened || (s.dbReadyPromise = new f(function(h) {
          s.dbReadyResolve = h;
        }), s.openCanceller = new f(function(h, y) {
          s.cancelOpen = y;
        }));
      }, Dt.prototype.close = function(h) {
        var o = (h === void 0 ? { disableAutoOpen: !0 } : h).disableAutoOpen, h = this._state;
        o ? (h.isBeingOpened && h.cancelOpen(new he.DatabaseClosed()), this._close(), h.autoOpen = !1, h.dbOpenError = new he.DatabaseClosed()) : (this._close(), h.autoOpen = this._options.autoOpen || h.isBeingOpened, h.openComplete = !1, h.dbOpenError = null);
      }, Dt.prototype.delete = function(s) {
        var o = this;
        s === void 0 && (s = { disableAutoOpen: !0 });
        var h = 0 < arguments.length && typeof arguments[0] != "object", y = this._state;
        return new f(function(I, x) {
          function O() {
            o.close(s);
            var N = o._deps.indexedDB.deleteDatabase(o.name);
            N.onsuccess = Te(function() {
              var U, j, W;
              U = o._deps, j = o.name, W = U.indexedDB, U = U.IDBKeyRange, xu(W) || j === Qa || wu(W, U).delete(j).catch(me), I();
            }), N.onerror = tn(x), N.onblocked = o._fireOnBlocked;
          }
          if (h) throw new he.InvalidArgument("Invalid closeOptions argument to db.delete()");
          y.isBeingOpened ? y.dbReadyPromise.then(O) : O();
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
        return u(this._allTables).map(function(o) {
          return s._allTables[o];
        });
      }, enumerable: !1, configurable: !0 }), Dt.prototype.transaction = function() {
        var s = (function(o, h, y) {
          var I = arguments.length;
          if (I < 2) throw new he.InvalidArgument("Too few arguments");
          for (var x = new Array(I - 1); --I; ) x[I - 1] = arguments[I];
          return y = x.pop(), [o, Ce(x), y];
        }).apply(this, arguments);
        return this._transaction.apply(this, s);
      }, Dt.prototype._transaction = function(s, o, h) {
        var y = this, I = q.trans;
        I && I.db === this && s.indexOf("!") === -1 || (I = null);
        var x, O, N = s.indexOf("?") !== -1;
        s = s.replace("!", "").replace("?", "");
        try {
          if (O = o.map(function(j) {
            if (j = j instanceof y.Table ? j.name : j, typeof j != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return j;
          }), s == "r" || s === cu) x = cu;
          else {
            if (s != "rw" && s != fu) throw new he.InvalidArgument("Invalid transaction mode: " + s);
            x = fu;
          }
          if (I) {
            if (I.mode === cu && x === fu) {
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
              (Q = H.call(z, z)) && (re ? (ne = $t.bind(null, null), Q.then(ne, ne)) : typeof Q.next == "function" && typeof Q.throw == "function" && (Q = Tu(Q)));
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
        }).bind(null, this, x, O, I, h);
        return I ? I._promise(x, U, "lock") : q.trans ? wi(q.transless, function() {
          return y._whenReady(U);
        }) : this._whenReady(U);
      }, Dt.prototype.table = function(s) {
        if (!w(this._allTables, s)) throw new he.InvalidTable("Table ".concat(s, " does not exist"));
        return this._allTables[s];
      }, Dt);
      function Dt(s, o) {
        var h = this;
        this._middlewares = {}, this.verno = 0;
        var y = Dt.dependencies;
        this._options = o = r({ addons: Dt.addons, autoOpen: !0, indexedDB: y.indexedDB, IDBKeyRange: y.IDBKeyRange, cache: "cloned" }, o), this._deps = { indexedDB: o.indexedDB, IDBKeyRange: o.IDBKeyRange }, y = o.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
        var I, x, O, N, U, j = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: me, dbReadyPromise: null, cancelOpen: me, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: o.autoOpen };
        j.dbReadyPromise = new f(function(P) {
          j.dbReadyResolve = P;
        }), j.openCanceller = new f(function(P, V) {
          j.cancelOpen = V;
        }), this._state = j, this.name = s, this.on = ha(this, "populate", "blocked", "versionchange", "close", { ready: [Ot, me] }), this.on.ready.subscribe = X(this.on.ready.subscribe, function(P) {
          return function(V, $) {
            Dt.vip(function() {
              var H, Y = h._state;
              Y.openComplete ? (Y.dbOpenError || f.resolve().then(V), $ && P(V)) : Y.onReadyBeingFired ? (Y.onReadyBeingFired.push(V), $ && P(V)) : (P(V), H = h, $ || P(function z() {
                H.on.ready.unsubscribe(V), H.on.ready.unsubscribe(z);
              }));
            });
          };
        }), this.Collection = (I = this, pa(Uy.prototype, function(Q, z) {
          this.db = I;
          var $ = fh, H = null;
          if (z) try {
            $ = z();
          } catch (re) {
            H = re;
          }
          var Y = Q._ctx, z = Y.table, Q = z.hook.reading.fire;
          this._ctx = { table: z, index: Y.index, isPrimKey: !Y.index || z.schema.primKey.keyPath && Y.index === z.schema.primKey.name, range: $, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: H, or: Y.or, valueMapper: Q !== je ? Q : null };
        })), this.Table = (x = this, pa(vh.prototype, function(P, V, $) {
          this.db = x, this._tx = $, this.name = P, this.schema = V, this.hook = x._allTables[P] ? x._allTables[P].hook : ha(null, { creating: [ct, me], reading: [gt, je], updating: [Le, me], deleting: [st, me] });
        })), this.Transaction = (O = this, pa(Ky.prototype, function(P, V, $, H, Y) {
          var z = this;
          this.db = O, this.mode = P, this.storeNames = V, this.schema = $, this.chromeTransactionDurability = H, this.idbtrans = null, this.on = ha(this, "complete", "error", "abort"), this.parent = Y || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new f(function(Q, re) {
            z._resolve = Q, z._reject = re;
          }), this._completion.then(function() {
            z.active = !1, z.on.complete.fire();
          }, function(Q) {
            var re = z.active;
            return z.active = !1, z.on.error.fire(Q), z.parent ? z.parent._reject(Q) : re && z.idbtrans && z.idbtrans.abort(), Pt(Q);
          });
        })), this.Version = (N = this, pa(Jy.prototype, function(P) {
          this.db = N, this._cfg = { version: P, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (U = this, pa(bh.prototype, function(P, V, $) {
          if (this.db = U, this._ctx = { table: P, index: V === ":id" ? null : V, or: $ }, this._cmp = this._ascending = ot, this._descending = function(H, Y) {
            return ot(Y, H);
          }, this._max = function(H, Y) {
            return 0 < ot(H, Y) ? H : Y;
          }, this._min = function(H, Y) {
            return ot(H, Y) < 0 ? H : Y;
          }, this._IDBKeyRange = U._deps.IDBKeyRange, !this._IDBKeyRange) throw new he.MissingAPI();
        })), this.on("versionchange", function(P) {
          0 < P.newVersion ? console.warn("Another connection wants to upgrade database '".concat(h.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(h.name, "'. Closing db now to resume the delete request.")), h.close({ disableAutoOpen: !1 });
        }), this.on("blocked", function(P) {
          !P.newVersion || P.newVersion < P.oldVersion ? console.warn("Dexie.delete('".concat(h.name, "') was blocked")) : console.warn("Upgrade '".concat(h.name, "' blocked by other connection holding version ").concat(P.oldVersion / 10));
        }), this._maxKey = ga(o.IDBKeyRange), this._createTransaction = function(P, V, $, H) {
          return new h.Transaction(P, V, $, h._options.chromeTransactionDurability, H);
        }, this._fireOnBlocked = function(P) {
          h.on("blocked").fire(P), ys.filter(function(V) {
            return V.name === h.name && V !== h && !V._state.vcFired;
          }).map(function(V) {
            return V.on("versionchange").fire(P);
          });
        }, this.use(eg), this.use(ig), this.use(tg), this.use(Qy), this.use(Xy);
        var W = new Proxy(this, { get: function(P, V, $) {
          if (V === "_vip") return !0;
          if (V === "table") return function(Y) {
            return po(h.table(Y), W);
          };
          var H = Reflect.get(P, V, $);
          return H instanceof vh ? po(H, W) : V === "tables" ? H.map(function(Y) {
            return po(Y, W);
          }) : V === "_createTransaction" ? function() {
            return po(H.apply(this, arguments), W);
          } : H;
        } });
        this.vip = W, y.forEach(function(P) {
          return P(h);
        });
      }
      var vo, qr = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", sg = (Du.prototype.subscribe = function(s, o, h) {
        return this._subscribe(s && typeof s != "function" ? s : { next: s, error: o, complete: h });
      }, Du.prototype[qr] = function() {
        return this;
      }, Du);
      function Du(s) {
        this._subscribe = s;
      }
      try {
        vo = { indexedDB: a.indexedDB || a.mozIndexedDB || a.webkitIndexedDB || a.msIndexedDB, IDBKeyRange: a.IDBKeyRange || a.webkitIDBKeyRange };
      } catch {
        vo = { indexedDB: null, IDBKeyRange: null };
      }
      function Bh(s) {
        var o, h = !1, y = new sg(function(I) {
          var x = Ve(s), O, N = !1, U = {}, j = {}, W = { get closed() {
            return N;
          }, unsubscribe: function() {
            N || (N = !0, O && O.abort(), P && qn.storagemutated.unsubscribe($));
          } };
          I.start && I.start(W);
          var P = !1, V = function() {
            return lu(H);
          }, $ = function(Y) {
            co(U, Y), Au(j, U) && V();
          }, H = function() {
            var Y, z, Q;
            !N && vo.indexedDB && (U = {}, Y = {}, O && O.abort(), O = new AbortController(), Q = function(re) {
              var ne = xe();
              try {
                x && St();
                var oe = Nt(s, re);
                return oe = x ? oe.finally($t) : oe;
              } finally {
                ne && Je();
              }
            }(z = { subscr: Y, signal: O.signal, requery: V, querier: s, trans: null }), Promise.resolve(Q).then(function(re) {
              h = !0, o = re, N || z.signal.aborted || (U = {}, function(ne) {
                for (var oe in ne) if (w(ne, oe)) return;
                return 1;
              }(j = Y) || P || (qn(ya, $), P = !0), lu(function() {
                return !N && I.next && I.next(re);
              }));
            }, function(re) {
              h = !1, ["DatabaseClosedError", "AbortError"].includes(re == null ? void 0 : re.name) || N || lu(function() {
                N || I.error && I.error(re);
              });
            }));
          };
          return setTimeout(V, 0), W;
        });
        return y.hasValue = function() {
          return h;
        }, y.getValue = function() {
          return o;
        }, y;
      }
      var Ai = In;
      function Bu(s) {
        var o = Mn;
        try {
          Mn = !0, qn.storagemutated.fire(s), Ru(s, !0);
        } finally {
          Mn = o;
        }
      }
      E(Ai, r(r({}, et), { delete: function(s) {
        return new Ai(s, { addons: [] }).delete();
      }, exists: function(s) {
        return new Ai(s, { addons: [] }).open().then(function(o) {
          return o.close(), !0;
        }).catch("NoSuchDatabaseError", function() {
          return !1;
        });
      }, getDatabaseNames: function(s) {
        try {
          return o = Ai.dependencies, h = o.indexedDB, o = o.IDBKeyRange, (xu(h) ? Promise.resolve(h.databases()).then(function(y) {
            return y.map(function(I) {
              return I.name;
            }).filter(function(I) {
              return I !== Qa;
            });
          }) : wu(h, o).toCollection().primaryKeys()).then(s);
        } catch {
          return Pt(new he.MissingAPI());
        }
        var o, h;
      }, defineClass: function() {
        return function(s) {
          c(this, s);
        };
      }, ignoreTransaction: function(s) {
        return q.trans ? wi(q.transless, s) : s();
      }, vip: Eu, async: function(s) {
        return function() {
          try {
            var o = Tu(s.apply(this, arguments));
            return o && typeof o.then == "function" ? o : f.resolve(o);
          } catch (h) {
            return Pt(h);
          }
        };
      }, spawn: function(s, o, h) {
        try {
          var y = Tu(s.apply(h, o || []));
          return y && typeof y.then == "function" ? y : f.resolve(y);
        } catch (I) {
          return Pt(I);
        }
      }, currentTransaction: { get: function() {
        return q.trans || null;
      } }, waitFor: function(s, o) {
        return o = f.resolve(typeof s == "function" ? Ai.ignoreTransaction(s) : s).timeout(o || 6e4), q.trans ? q.trans.waitFor(o) : o;
      }, Promise: f, debug: { get: function() {
        return qe;
      }, set: function(s) {
        Qe(s);
      } }, derive: K, extend: c, props: E, override: X, Events: ha, on: qn, liveQuery: Bh, extendObservabilitySet: co, getByKeyPath: fe, setByKeyPath: ae, delByKeyPath: function(s, o) {
        typeof o == "string" ? ae(s, o, void 0) : "length" in o && [].map.call(o, function(h) {
          ae(s, h, void 0);
        });
      }, shallowClone: ke, deepClone: Se, getObjectDiff: Cu, cmp: ot, asap: ce, minKey: -1 / 0, addons: [], connections: ys, errnames: lt, dependencies: vo, cache: Si, semVer: "4.0.11", version: "4.0.11".split(".").map(function(s) {
        return parseInt(s);
      }).reduce(function(s, o, h) {
        return s + o / Math.pow(10, 2 * h);
      }) })), Ai.maxKey = ga(Ai.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (qn(ya, function(s) {
        Mn || (s = new CustomEvent(vu, { detail: s }), Mn = !0, dispatchEvent(s), Mn = !1);
      }), addEventListener(vu, function(s) {
        s = s.detail, Mn || Bu(s);
      }));
      var Is, Mn = !1, Fh = function() {
      };
      return typeof BroadcastChannel < "u" && ((Fh = function() {
        (Is = new BroadcastChannel(vu)).onmessage = function(s) {
          return s.data && Bu(s.data);
        };
      })(), typeof Is.unref == "function" && Is.unref(), qn(ya, function(s) {
        Mn || Is.postMessage(s);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(s) {
        if (!In.disableBfCache && s.persisted) {
          qe && console.debug("Dexie: handling persisted pagehide"), Is != null && Is.close();
          for (var o = 0, h = ys; o < h.length; o++) h[o].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(s) {
        !In.disableBfCache && s.persisted && (qe && console.debug("Dexie: handling persisted pageshow"), Fh(), Bu({ all: new Qt(-1 / 0, [[]]) }));
      })), f.rejectionMapper = function(s, o) {
        return !s || s instanceof Ze || s instanceof TypeError || s instanceof SyntaxError || !s.name || !Fe[s.name] ? s : (o = new Fe[s.name](o || s.message, s), "stack" in s && D(o, "stack", { get: function() {
          return this.inner.stack;
        } }), o);
      }, Qe(qe), r(In, Object.freeze({ __proto__: null, Dexie: In, liveQuery: Bh, Entity: hh, cmp: ot, PropModification: da, replacePrefix: function(s, o) {
        return new da({ replacePrefix: [s, o] });
      }, add: function(s) {
        return new da({ add: s });
      }, remove: function(s) {
        return new da({ remove: s });
      }, default: In, RangeSet: Qt, mergeRanges: ba, rangesOverlap: Sh }), { default: In }), In;
    });
  }(So)), So.exports;
}
var wI = _I();
const of = /* @__PURE__ */ bf(wI), mv = Symbol.for("Dexie"), Lt = globalThis[mv] || (globalThis[mv] = of);
if (of.semVer !== Lt.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${of.semVer} and ${Lt.semVer}`);
const {
  liveQuery: Vb,
  mergeRanges: Jb,
  rangesOverlap: Zb,
  RangeSet: Qb,
  cmp: Xb,
  Entity: e_,
  PropModification: t_,
  replacePrefix: r_,
  add: n_,
  remove: i_
} = Lt;
var Hr, jr, Cs, Ns, sn, Di, Ps;
const Wo = class Wo {
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
    ee(this, Hr, /* @__PURE__ */ new Map());
    ee(this, jr, /* @__PURE__ */ new Map());
    // string-encoded array -> value
    ee(this, Cs);
    // array item -> serial number
    ee(this, Ns, new Array());
    // serial number -> array item
    ee(this, sn, /* @__PURE__ */ new Map());
    // string-encoded object -> value
    ee(this, Di);
    // object item -> serial number
    ee(this, Ps, new Array());
  }
  get size() {
    return p(this, Hr).size + p(this, jr).size + p(this, sn).size;
  }
  /** Returns the value (T) associated with `key`, else `undefined`. */
  get(e) {
    if (typeof e != "object" || e === null)
      return p(this, Hr).get(e);
    if (Array.isArray(e)) {
      const t = this.encodeExistingKey(e, p(this, Cs));
      return t !== void 0 ? p(this, jr).get(t) : void 0;
    } else {
      if (!p(this, Di))
        return;
      const t = this.objectToArray(e), r = this.encodeExistingKey(t, p(this, Di));
      return r !== void 0 ? p(this, sn).get(r) : void 0;
    }
  }
  /** Sets the value of `key` to `value`, replacing any existing value. */
  set(e, t) {
    typeof e != "object" || e === null ? p(this, Hr).set(e, t) : Array.isArray(e) ? p(this, jr).set(this.encodeArrayKey(e), t) : p(this, sn).set(this.encodeObjectKey(e), t);
  }
  /** Adds a new key `key` with value `value` and returns true;
   *  if `key` already has a value, does nothing and returns false. */
  insert(e, t) {
    return typeof e != "object" || e === null ? Nc(p(this, Hr), e, t) : Array.isArray(e) ? Nc(p(this, jr), this.encodeArrayKey(e), t) : Nc(p(this, sn), this.encodeObjectKey(e), t);
  }
  /** Returns the value (T) associated with the `key`.
   *  If there isn't one yet, it calls the `makeValue` function to create one and adds it.
   *  > Note:  With complex keys this is more efficient than calling `get` and then `insert`. */
  upsert(e, t) {
    return typeof e != "object" || e === null ? Pc(p(this, Hr), e, t) : Array.isArray(e) ? Pc(p(this, jr), this.encodeArrayKey(e), t) : Pc(p(this, sn), this.encodeObjectKey(e), t);
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  *entries() {
    for (let e of p(this, Hr).entries())
      yield e;
    for (let [e, t] of p(this, jr).entries())
      yield [this.decodeArrayKey(e), t];
    for (let [e, t] of p(this, sn).entries())
      yield [this.decodeObjectKey(e), t];
  }
  *keys() {
    for (let e of p(this, Hr).keys())
      yield e;
    for (let e of p(this, jr).keys())
      yield this.decodeArrayKey(e);
    for (let e of p(this, jr).keys())
      yield this.decodeObjectKey(e);
  }
  *values() {
    for (let e of p(this, Hr).values())
      yield e;
    for (let e of p(this, jr).values())
      yield e;
    for (let e of p(this, sn).values())
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
    let t = p(this, Cs);
    return t || (t = G(this, Cs, new Wo())), e.map((r) => t.upsert(r, () => (p(this, Ns).push(r), p(this, Ns).length - 1))).toString();
  }
  /** Converts an encoded array key back into the same array. */
  decodeArrayKey(e) {
    return e !== "" ? e.split(",").map((t) => p(this, Ns)[Number(t)]) : [];
  }
  encodeExistingKey(e, t) {
    if (!t)
      return;
    let r = [];
    for (const i of e) {
      const a = t.get(i);
      if (a === void 0)
        return;
      r.push(a);
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
    let t = p(this, Di);
    return t || (t = G(this, Di, new Wo())), this.objectToArray(e).map((i) => t.upsert(i, () => (p(this, Ps).push(i), p(this, Ps).length - 1))).toString();
  }
  /** Converts an encoded object key back into the same object. */
  decodeObjectKey(e) {
    if (e === "")
      return {};
    const t = e.split(",").map((a) => p(this, Ps)[Number(a)]), r = t.pop();
    Me(t.length === r.length);
    let i = {};
    for (let a = 0; a < r.length; ++a)
      i[r[a]] = t[a];
    return i;
  }
  // serial number -> object item
};
Hr = new WeakMap(), jr = new WeakMap(), Cs = new WeakMap(), Ns = new WeakMap(), sn = new WeakMap(), Di = new WeakMap(), Ps = new WeakMap();
let jo = Wo;
function Nc(n, e, t) {
  return n.has(e) ? !1 : (n.set(e, t), !0);
}
function Pc(n, e, t) {
  let r = n.get(e);
  return r === void 0 && (r = t(), n.set(e, r)), r;
}
class bi {
  constructor() {
    pe(this, "receiver");
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
class by {
  constructor() {
    pe(this, "receiver");
  }
  then(e) {
    return this.receiver = e;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async run(e) {
    return this.receiver.start(), this.receiver.next(new fa(e)) ? (this.receiver.end(), !0) : !1;
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
class Ko extends Error {
  constructor() {
    super("Query interrupted"), this.name = "InterruptedQueryError";
  }
}
var Wr, an, Fa, Bi, Ds;
class _y extends by {
  constructor(t) {
    var r, i;
    super();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pe(this, "collection");
    pe(this, "alias");
    ee(this, Wr);
    // The index being searched, if any
    ee(this, an);
    // Index constraint(s)
    ee(this, Fa);
    // Indexed properties to sort by
    ee(this, Bi);
    // True if deleted revs must be detected
    ee(this, Ds, !1);
    if (this.config = t, this.collection = t.collection, this.alias = t.alias, G(this, Wr, t.index), G(this, Bi, !0), (r = t.indexedWhereOrSort) != null && r.length) {
      Nn(t.index, "config.index");
      const a = t.indexedWhereOrSort.map((u) => u instanceof os ? u : u.key);
      t.indexedWhereOrSort[0] instanceof os ? G(this, Fa, t.indexedWhereOrSort) : G(this, an, t.indexedWhereOrSort), a.some((u) => u.keypath !== Na && u.keypath !== Oa) && G(this, Bi, !1);
    }
    ((i = this.config.filters) == null ? void 0 : i.length) === 0 && (this.config.filters = void 0);
  }
  async run(t) {
    G(this, Ds, !1);
    const r = t instanceof Uo ? t : t.ctx, i = t instanceof Uo ? void 0 : t, a = this.receiver instanceof uf ? this.receiver : void 0;
    let u;
    i ? u = i.use(() => this.makeQuery()) : u = this.makeQuery(), this.receiver.start();
    let l = !0;
    if (u !== void 0) {
      const c = i ?? new fa(r);
      let _ = await u.toArray();
      if (p(this, Ds))
        throw new Ko();
      for (let m of _)
        if (m.encrypted && await this.collection.decryptRevision(m), c.dataSources.set(this.config.alias, m), (!this.config.filters || this.config.filters.every((w) => c.eval(w))) && (l = a ? await a.asyncNext(c) : this.receiver.next(c), !l))
          break;
      i == null || i.dataSources.delete(this.config.alias);
    }
    return l && (a ? await a.asyncEnd(r) : this.receiver.end()), !0;
  }
  /** Stops an active `run` call ASAP, causing its promise to reject. */
  interrupt() {
    G(this, Ds, !0), this.receiver instanceof uf && this.receiver.interrupt();
  }
  /** Subroutine of `run` that creates the Dexie query. */
  makeQuery() {
    const t = this.collection.dexieTable;
    let r;
    if (!p(this, Wr))
      r = t.toCollection();
    else if (p(this, an)) {
      const i = t.where(p(this, Wr).name);
      if (p(this, Wr).on.length === 1) {
        if (r = p(this, an)[0].applyTo(i), r === void 0) return;
      } else {
        const a = [], u = [];
        for (const c of p(this, an))
          mr(
            c instanceof Ja,
            "compound index can't handle arrays"
          ), a.push(c.minValue ?? Lt.minKey), u.push(c.maxValue ?? Lt.maxKey);
        for (; a.length < p(this, Wr).on.length; )
          a.push(Lt.minKey), u.push(Lt.maxKey);
        const l = p(this, an).at(-1);
        r = i.between(a, u, l.includeMin, l.includeMax);
      }
    } else
      r = t.orderBy(p(this, Wr).name);
    return this.config.reverse && (r = r.reverse()), p(this, Bi) && (r = r.filter((i) => ((i.flags ?? 0) & gr) === 0)), r;
  }
  explain(t) {
    if (p(this, an)) {
      t.push(`Search index "${p(this, Wr).name}" of collection ${this.collection.name} where (`);
      for (let r of p(this, an))
        t.push(`    ${r}`);
      t[t.length - 1] += " )";
    } else p(this, Fa) ? t.push(`Scan index "${p(this, Wr).name}" of collection ${this.collection.name}`) : t.push(`Scan collection ${this.collection.name}`);
    if (t[t.length - 1] += this.config.reverse ? " in reverse order:" : ":", p(this, Bi) && t.push("    - If doc is not deleted,"), this.config.filters)
      for (const r of this.config.filters)
        t.push(`    - If ${Bt(r)},`);
    super.explain(t);
  }
  // I've been interrupted
}
Wr = new WeakMap(), an = new WeakMap(), Fa = new WeakMap(), Bi = new WeakMap(), Ds = new WeakMap();
var Gn, Fi;
class uf extends bi {
  constructor(t, r) {
    super();
    ee(this, Gn);
    ee(this, Fi, !1);
    this.producer = t, this.joinType = r;
  }
  start() {
    G(this, Fi, !1), this.joinType === "OUTER" && G(this, Gn, /* @__PURE__ */ new Set()), super.start();
  }
  // LeftJoiner's `next` method has to be async since it runs a nested query.
  // But we don't want to make `Receiver.next()` async because it would be terrible for
  // performance. Instead we have a kludge where LeftJoiner has an `asyncNext` method instead,
  // and RevProducer is special-cased to call that when its receiver is a LeftJoiner.
  next(t) {
    Ca("Joiner.next should not be called");
  }
  async asyncNext(t) {
    let r = 0;
    return this.producer.then({
      start: () => {
        r = 0;
      },
      next: (i) => {
        var a;
        if (++r, p(this, Gn)) {
          const u = i.dataSources.get(this.producer.alias);
          (a = p(this, Gn)) == null || a.add(u.id);
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
    G(this, Fi, !0), this.producer.interrupt();
  }
  end() {
    Ca("Joiner.end should not be called");
  }
  async asyncEnd(t) {
    if (p(this, Gn) && !p(this, Fi)) {
      const r = await this.producer.collection.dexieTable.where(Na).noneOf(Array.of(...p(this, Gn).values())).filter((i) => !((i.flags ?? 0) & gr)).toArray();
      if (r.length > 0) {
        const i = this.producer.alias;
        let a = [];
        for (const [u, l] of t.sourceTypes) {
          if (u === i)
            break;
          a.push(u);
        }
        for (const u of r) {
          if (p(this, Fi))
            break;
          const l = new fa(t);
          for (const c of a)
            l.dataSources.set(c, {});
          l.dataSources.set(i, u), this.receiver.next(l);
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
Gn = new WeakMap(), Fi = new WeakMap();
class xI extends bi {
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
var Li;
class EI extends bi {
  constructor(t, r, i) {
    super();
    ee(this, Li);
    this.groupBy = t, this.having = r, this.ctx = i;
  }
  start() {
    G(this, Li, new jo()), super.start();
  }
  next(t) {
    mr(this.groupBy.length === 1, "unsupported multiple GROUP BY conditions");
    const r = t.eval(this.groupBy[0]);
    return p(this, Li).upsert(r, () => {
      let a = new Ba(this.ctx, !0);
      return a.receiver = this.receiver, a.start(), a;
    }).next(t);
  }
  end() {
    for (const t of p(this, Li).values())
      t.end(this.having);
    G(this, Li, void 0), super.end();
  }
  explain(t) {
    const r = this.groupBy.map(Bt).join(",  ");
    t.push(`Group rows by ${r}, and for each group:`), new Ba(this.ctx, !0).explain(t), this.having && t.push(`Keep groups having ${Bt(this.having)}`), super.explain(t);
  }
}
Li = new WeakMap();
var Hn, Wn;
const sh = class sh extends bi {
  constructor(t, r = !1) {
    super();
    ee(this, Hn);
    ee(this, Wn);
    this.ctx = t, this.isGrouped = r;
  }
  clone() {
    let t = new sh(this.ctx, this.isGrouped);
    return t.receiver = this.receiver, t;
  }
  start() {
    G(this, Wn, void 0), G(this, Hn, this.ctx.copyAggregates()), Me(p(this, Hn) !== void 0, "no aggregates"), this.isGrouped || super.start();
  }
  next(t) {
    return t.use(() => {
      for (let r of p(this, Hn))
        r.accumulate();
    }), p(this, Wn) === void 0 && G(this, Wn, t.clone()), !0;
  }
  end(t) {
    const r = p(this, Wn) ?? new fa(this.ctx);
    r.aggregates = p(this, Hn), G(this, Wn, void 0), G(this, Hn, void 0), (!t || r.eval(t)) && this.receiver.next(r), this.isGrouped || super.end();
  }
  explain(t) {
    for (const r of this.ctx.copyAggregates())
      t.push(`    - Accumulate state for ${Bt(r.sourceExpression)}`);
    t.push("After aggregating,"), super.explain(t);
  }
};
Hn = new WeakMap(), Wn = new WeakMap();
let Ba = sh;
class wy extends bi {
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
var Bs;
class SI extends wy {
  constructor(t, r, i) {
    t = Array.of(...t);
    for (const a of i)
      t.push(a.expr);
    super(t, r);
    ee(this, Bs);
    this.sortExprs = i;
  }
  start() {
    G(this, Bs, []), super.start();
  }
  next(t) {
    return p(this, Bs).push(this.makeRow(t)), !0;
  }
  end() {
    const t = this.sortExprs, r = t.length;
    let i = p(this, Bs);
    i.sort((a, u) => {
      for (let l = -r; l < 0; ++l) {
        let c = Yt(a.at(l), u.at(l));
        if (c !== 0)
          return t[r + l].descending ? -c : c;
      }
      return 0;
    });
    for (let a of i)
      if (a.length -= t.length, !this.receiver.next(a))
        return;
    super.end();
  }
  explain(t) {
    const r = this.sortExprs.map((i) => {
      let a = Bt(i.expr);
      return i.descending && (a += " descending"), a;
    });
    t.push(`With docs sorted by ${r.join(", ")},`), super.explain(t);
  }
}
Bs = new WeakMap();
var Fs;
class AI extends bi {
  constructor() {
    super(...arguments);
    ee(this, Fs);
  }
  start() {
    G(this, Fs, new jo()), super.start();
  }
  next(t) {
    return p(this, Fs).insert(t, null) ? this.receiver.next(t) : !0;
  }
  end() {
    G(this, Fs, void 0), super.end();
  }
  explain(t) {
    t.push("Remove identical rows"), super.explain(t);
  }
}
Fs = new WeakMap();
var Ls, qi;
class kI extends bi {
  constructor(t, r) {
    super();
    ee(this, Ls, 0);
    ee(this, qi, 0);
    this.offsetExpr = t, this.limitExpr = r;
  }
  get offset() {
    return this.offsetExpr ? qh(this.offsetExpr(), "query OFFSET") : 0;
  }
  get limit() {
    return this.limitExpr ? qh(this.limitExpr(), "query LIMIT") : 1 / 0;
  }
  start() {
    G(this, Ls, this.offset), G(this, qi, this.limit), super.start();
  }
  next(t) {
    return p(this, Ls) > 0 ? (--hr(this, Ls)._, !0) : p(this, qi) > 0 ? (--hr(this, qi)._, this.receiver.next(t) && p(this, qi) > 0) : !1;
  }
  explain(t) {
    this.offsetExpr && t.push(`Skip first ${Bt(this.offsetExpr)} rows`), this.limitExpr && t.push(`Limit to ${Bt(this.limitExpr)} rows`), super.explain(t);
  }
}
Ls = new WeakMap(), qi = new WeakMap();
class OI extends bi {
  constructor(e) {
    super(), this.aliases = e;
  }
  next(e) {
    let t = {}, r = 0;
    for (const i of this.aliases) {
      const a = e[r++];
      a !== void 0 && (i.endsWith(".*") && kr(a) ? t = { ...t, ...a } : t[i] = a);
    }
    return this.receiver.next(t);
  }
}
class xy {
  constructor(e) {
    pe(this, "ok", !0);
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
const RI = 250, TI = 0, CI = 500;
var Yn, qs, La, bn, Vn, Jn, Zn, pr;
class NI {
  constructor(e) {
    ee(this, Yn, /* @__PURE__ */ new Set());
    // Query listeners
    ee(this, qs, []);
    // My collection listeners
    ee(this, La, 0);
    // Time DB last changed
    ee(this, bn);
    // Timer after coll changes
    ee(this, Vn);
    // Last known query result
    ee(this, Jn, !1);
    // True while executing query
    ee(this, Zn, !1);
    // If true, need to execute again
    ee(this, pr);
    this.query = e, G(this, pr, e.logger);
  }
  get hasListeners() {
    return p(this, Yn).size > 0;
  }
  addChangeListener(e) {
    return this.hasListeners || this.startListening(), p(this, Yn).add(e), new gf(() => {
      var t;
      (t = p(this, Yn)) == null || t.delete(e), this.hasListeners || this.stopListening();
    });
  }
  startListening() {
    p(this, pr).info`Query observer starting`;
    for (const e of this.query.collections()) {
      const t = e.addChangeListener((r) => this.collectionChanged(e));
      p(this, qs).push(t);
    }
    this.executeQuery();
  }
  stopListening() {
    p(this, pr).info`Query observer stopping`, p(this, qs).forEach((e) => e.remove()), G(this, qs, []), p(this, bn) !== void 0 && (clearTimeout(p(this, bn)), G(this, bn, void 0)), p(this, Jn) && this.query.interrupt(), G(this, Vn, void 0), G(this, Zn, !1);
  }
  collectionChanged(e) {
    p(this, pr).info`Query observer notified collection ${e.name} changed`, this.trigger();
  }
  /** Schedules re-running the query to see if it changed. */
  trigger() {
    if (this.hasListeners && !p(this, bn)) {
      const e = Date.now(), t = e - p(this, La) < RI ? CI : TI;
      G(this, La, e), G(this, bn, setTimeout(() => {
        G(this, bn, void 0), this.hasListeners && this.executeQuery();
      }, t));
    }
  }
  executeQuery() {
    if (p(this, Jn)) {
      G(this, Zn, !0), p(this, pr).debug`Query observer will re-execute query when done`;
      return;
    }
    G(this, Jn, !0), G(this, Zn, !1), p(this, pr).info`Query observer executing query...`, this.query.execute().then((e) => {
      G(this, Jn, !1), this.hasListeners && (p(this, Vn) === void 0 ? (p(this, pr).debug`...Query observer got initial result`, G(this, Vn, e)) : ia(e, p(this, Vn)) ? p(this, pr).debug`...Query observer saw no change in results` : (G(this, Vn, e), this.callListeners(e)), p(this, Zn) && this.executeQuery());
    }).catch((e) => {
      G(this, Jn, !1), e instanceof Ko ? p(this, pr).debug`...Query observer: query interrupted` : p(this, pr).error`Query observer: query failed with error ${e}`, p(this, Zn) && this.hasListeners && this.executeQuery();
    });
  }
  callListeners(e) {
    p(this, pr).info`Query observer notifying ${p(this, Yn).size} listeners!`;
    for (const t of p(this, Yn))
      try {
        t(e);
      } catch (r) {
        p(this, pr).error(`Exception in QueryChangeCallback: ${r}`);
      }
  }
}
Yn = new WeakMap(), qs = new WeakMap(), La = new WeakMap(), bn = new WeakMap(), Vn = new WeakMap(), Jn = new WeakMap(), Zn = new WeakMap(), pr = new WeakMap();
const Iv = [
  "trace",
  "debug",
  "info",
  "warning",
  "error",
  "fatal"
];
function bv(n, e) {
  const t = Iv.indexOf(n);
  if (t < 0) throw new TypeError(`Invalid log level: ${JSON.stringify(n)}.`);
  const r = Iv.indexOf(e);
  if (r < 0) throw new TypeError(`Invalid log level: ${JSON.stringify(e)}.`);
  return t - r;
}
function Ey(n = []) {
  return Sy.getLogger(n);
}
const Dc = Symbol.for("logtape.rootLogger");
var Sy = class $n {
  constructor(e, t) {
    pe(this, "parent");
    pe(this, "children");
    pe(this, "category");
    pe(this, "sinks");
    pe(this, "parentSinks", "inherit");
    pe(this, "filters");
    pe(this, "lowestLevel", "trace");
    pe(this, "contextLocalStorage");
    this.parent = e, this.children = {}, this.category = t, this.sinks = [], this.filters = [];
  }
  static getLogger(e = []) {
    let t = Dc in globalThis ? globalThis[Dc] ?? null : null;
    return t == null && (t = new $n(null, []), globalThis[Dc] = t), typeof e == "string" ? t.getChild(e) : e.length === 0 ? t : t.getChild(e);
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
    return new PI(this, { ...e });
  }
  filter(e) {
    var t;
    for (const r of this.filters) if (!r(e)) return !1;
    return this.filters.length < 1 ? ((t = this.parent) == null ? void 0 : t.filter(e)) ?? !0 : !0;
  }
  *getSinks(e) {
    if (!(this.lowestLevel === null || bv(e, this.lowestLevel) < 0)) {
      if (this.parent != null && this.parentSinks === "inherit") for (const t of this.parent.getSinks(e)) yield t;
      for (const t of this.sinks) yield t;
    }
  }
  emit(e, t) {
    if (!(this.lowestLevel === null || bv(e.level, this.lowestLevel) < 0 || !this.filter(e))) {
      for (const r of this.getSinks(e.level))
        if (!(t != null && t.has(r)))
          try {
            r(e);
          } catch (i) {
            const a = new Set(t);
            a.add(r), DI.log("fatal", "Failed to emit a log record to sink {sink}: {error}", {
              sink: r,
              error: i,
              record: e
            }, a);
          }
    }
  }
  log(e, t, r, i) {
    var c;
    const a = ((c = $n.getLogger().contextLocalStorage) == null ? void 0 : c.getStore()) ?? {};
    let u;
    const l = typeof r == "function" ? {
      category: this.category,
      level: e,
      timestamp: Date.now(),
      get message() {
        return _v(t, this.properties);
      },
      rawMessage: t,
      get properties() {
        return u == null && (u = {
          ...a,
          ...r()
        }), u;
      }
    } : {
      category: this.category,
      level: e,
      timestamp: Date.now(),
      message: _v(t, {
        ...a,
        ...r
      }),
      rawMessage: t,
      properties: {
        ...a,
        ...r
      }
    };
    this.emit(l, i);
  }
  logLazily(e, t, r = {}) {
    var c;
    const i = ((c = $n.getLogger().contextLocalStorage) == null ? void 0 : c.getStore()) ?? {};
    let a, u;
    function l() {
      if ((u == null || a == null) && (u = t((_, ...m) => (a = _, wv(_, m))), a == null))
        throw new TypeError("No log record was made.");
      return [u, a];
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
    const a = ((u = $n.getLogger().contextLocalStorage) == null ? void 0 : u.getStore()) ?? {};
    this.emit({
      category: this.category,
      level: e,
      message: wv(t, r),
      rawMessage: t,
      timestamp: Date.now(),
      properties: {
        ...a,
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
}, PI = class Ay {
  constructor(e, t) {
    pe(this, "logger");
    pe(this, "properties");
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
    return new Ay(this.logger, {
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
const DI = Sy.getLogger(["logtape", "meta"]);
function _v(n, e) {
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
      const _ = n.indexOf("}", u + 1);
      if (_ === -1) continue;
      const m = n.slice(i, u);
      r.push(m.replace(/{{/g, "{").replace(/}}/g, "}"));
      const w = n.slice(u + 1, _);
      let E;
      const k = w.trim();
      k === "*" ? E = w in e ? e[w] : "*" in e ? e["*"] : e : w !== k ? E = w in e ? e[w] : e[k] : E = e[w], r.push(E), u = _, i = u + 1;
    } else l === "}" && u + 1 < t && n[u + 1] === "}" && u++;
  }
  const a = n.slice(i);
  return r.push(a.replace(/{{/g, "{").replace(/}}/g, "}")), r;
}
function wv(n, e) {
  const t = [];
  for (let r = 0; r < n.length; r++)
    t.push(n[r]), r < e.length && t.push(e[r]);
  return t;
}
const ky = "CouchbaseLite", Xf = Ey([ky]), lf = Xf.getChild("DB"), BI = Xf.getChild("Query");
var At, dr, Mi, Ui, $i, qa, ji, Ms, Qn;
class FI {
  /** @internal */
  constructor(e, t) {
    /** The JSON form of the parsed query. @internal */
    pe(this, "selectExpr");
    /** The names of the result columns, i.e. the keys in a row object. */
    pe(this, "columnNames");
    /** @internal */
    pe(this, "logger");
    ee(this, At, new Uo());
    // State for CompiledExprs to read
    ee(this, dr, /* @__PURE__ */ new Map());
    // Maps alias -> source/result info
    ee(this, Mi);
    // Head of pipeline
    ee(this, Ui);
    // Tail of pipeline
    ee(this, $i, {});
    ee(this, qa);
    ee(this, ji, !1);
    // Prevents reentrant `run` calls
    ee(this, Ms, !1);
    ee(this, Qn);
    this.database = e, this.logger = BI.with({ db: e.name });
    let r;
    typeof t == "string" ? (r = uI(t), this.selectExpr = r) : (this.selectExpr = t, r = t, f1(r));
    let i;
    for (let C of r.FROM) {
      let M, J;
      if ("COLLECTION" in C) {
        let ce = C.COLLECTION;
        ce === "_" && (ce = Ao), C.SCOPE && (ce = C.SCOPE + "." + ce), J = this.database.getCollection(ce), "JOIN" in C ? (Me(i !== void 0, "first FROM source can't be a JOIN"), M = "join") : (mr(i === void 0, "subsequent FROM sources must be JOINs"), M = "collection");
      } else
        M = "unnest";
      let X;
      if (C.AS !== void 0)
        X = C.AS;
      else if ("COLLECTION" in C)
        X = C.COLLECTION;
      else
        throw new Lr("UNNEST clause must have an AS");
      if (p(this, dr).has(X))
        throw new Lr(`Duplicate sources named "${X}"`);
      const le = { collection: J, source: C, type: M, alias: X };
      i || (i = le), p(this, dr).set(X, le), p(this, At).sourceTypes.set(X, M);
    }
    let a = [], u = [];
    for (let C of r.WHAT) {
      let M;
      if (Array.isArray(C) && C[0] === "AS") {
        if (M = C[2], C = C[1], p(this, dr).has(M))
          throw new Lr(`Duplicate column alias "${M}"`);
        p(this, dr).set(M, {
          type: "result",
          alias: M,
          what: C
        });
      }
      a.push(M), u.push(C);
    }
    h1(
      r,
      p(this, dr),
      r.FROM.length === 1 ? i == null ? void 0 : i.alias : void 0
    );
    const l = u.map((C) => p(this, At).compileWithAggregates(C));
    let c = [], _ = 0;
    for (let C = 0; C < r.WHAT.length; ++C) {
      let M = a[C];
      if (M === void 0)
        for (M = this.defaultResultName(r.WHAT[C]); M === void 0 || c.includes(M); )
          M = `$${++_}`;
      else
        p(this, At).results.set(M, l[C]);
      c.push(M);
    }
    this.columnNames = c, this.findResultSources();
    const m = new Set(r.WHERE ? Kd(r.WHERE) : []);
    let w;
    r.ORDER_BY !== void 0 && (w = r.ORDER_BY.map((C) => qI(p(this, At), C)));
    let E = /* @__PURE__ */ new Set(), k, D;
    e: for (const [C, M] of p(this, dr)) {
      switch (M.type) {
        case "collection": {
          k = this.makeRevProducer(
            M,
            m,
            w,
            E
          ), D = k;
          break;
        }
        case "join": {
          for (const le of Kd(M.source.ON))
            m.add(le);
          const J = M.source.JOIN, X = this.makeRevProducer(M, m, w, E);
          D = D.then(new uf(X, J));
          break;
        }
        case "unnest": {
          const J = p(this, At).compile(M.source.UNNEST);
          D = D.then(new xI(J, C));
          break;
        }
        case "result":
          continue e;
      }
      E.add(M);
    }
    if (k ? Nn(D) : (k = new by(), D = k), G(this, Mi, k), r.GROUP_BY !== void 0) {
      const C = r.GROUP_BY.map((J) => p(this, At).compile(J)), M = r.HAVING !== void 0 ? p(this, At).compileWithAggregates(r.HAVING) : void 0;
      D = D.then(new EI(C, M, p(this, At)));
    } else
      p(this, At).hasAggregators && (D = D.then(new Ba(p(this, At))));
    let K;
    if (w != null && w.length ? K = D.then(new SI(l, c, w)) : K = D.then(new wy(l, c)), r.DISTINCT && (K = K.then(new AI())), r.OFFSET !== void 0 || r.LIMIT !== void 0) {
      const C = (M, J) => {
        if (M !== void 0)
          return mr(xc(M).size === 0, `invalid ${J} expression`), p(this, At).compile(M);
      };
      K = K.then(new kI(
        C(r.OFFSET, "OFFSET"),
        C(r.LIMIT, "LIMIT")
      ));
    }
    G(this, Ui, K.then(new OI(c)).then(new xy())), G(this, qa, new Proxy(p(this, $i), {
      set: (C, M, J) => (this.checkParameterName(M), C[M] = J, p(this, Qn) && !ia(J, p(this, $i)[M]) && p(this, Qn).trigger(), !0)
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
    return p(this, qa);
  }
  set parameters(e) {
    const t = p(this, At).parameterNames.size, r = Object.entries(e);
    mr(r.length >= t, `All ${t} parameters must be set`);
    for (const [i, a] of r)
      this.checkParameterName(i), p(this, $i)[i] = a;
  }
  /** The names of all query parameters. */
  get parameterNames() {
    return p(this, At).parameterNames;
  }
  /** A string that describes in human-readable form the steps the query will perform
   *  when it runs. (Format subject to change without notice.) */
  get explanation() {
    let e = [];
    return p(this, Mi).explain(e), e.join(`
`);
  }
  async execute(e) {
    if (e)
      return this.run(e);
    {
      let t = new Array();
      if (await this.run((r) => t.push(r)))
        return t;
      throw new Ko();
    }
  }
  /** Stops an active {@link execute} call ASAP. Does nothing if the query is not running. */
  interrupt() {
    p(this, ji) && (G(this, Ms, !0), p(this, Mi).interrupt());
  }
  /** Registers a function that will be called when the query's results change, as a result of
   *  changes to documents or to a parameter value.
   *  @param callback  The function to call. Its parameter is the new query result array.
   *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
   *            remove the listener. */
  addChangeListener(e) {
    return p(this, Qn) || G(this, Qn, new NI(this)), p(this, Qn).addChangeListener(e);
  }
  /** Registers a custom N1QL function.
   *
   *  Registration is global: it will be available in all queries on all Databases.
   *  @param name  Function's name. Case-insensitive.
   *  @param implementation  The function itself. See the type {@link UserFunction} for details.
   *  @param options  Other options such as min/max arg counts. */
  registerUserFunction(e, t, r) {
    hI(e, t, r);
  }
  /** All Collections used by this query. @internal */
  collections() {
    let e = /* @__PURE__ */ new Set();
    for (const t of p(this, dr).values())
      t.type !== "result" && t.collection && e.add(t.collection);
    return e;
  }
  //---- INTERNALS:
  checkParameterName(e) {
    mr(typeof e == "string", "Query parameter name must be a string"), mr(!e.startsWith("$"), "Don't use '$' prefix in query parameter names"), mr(p(this, At).parameterNames.has(e), `"${e}" is not a parameter of this query`);
  }
  async run(e) {
    mr(!p(this, ji), "query is already running"), p(this, At).parameters.clear();
    for (const t of p(this, At).parameterNames) {
      const r = p(this, $i)[t];
      if (r === void 0)
        throw Error(`The query parameter "${t}" must have a value`);
      p(this, At).parameters.set(t, r);
    }
    G(this, ji, !0), G(this, Ms, !1);
    try {
      return p(this, Ui).callback = (t) => (e(t), !p(this, Ms)), await p(this, Mi).run(p(this, At)), p(this, Ui).callback = void 0, p(this, Ui).ok;
    } catch (t) {
      if (t instanceof Ko)
        return !1;
      throw t;
    } finally {
      G(this, ji, !1);
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
    const a = [];
    for (const m of t) {
      const w = this.asWhereClause(m, e, i);
      w && a.push(w);
    }
    a.sort((m, w) => m.generality - w.generality);
    let u;
    if (r != null && r.length) {
      const [m, w] = this.expToKeyPath(r[0].expr.sourceExpression);
      w != null && w.indexed && m === e && (u = w);
    }
    let l = !1, c = { collection: e.collection, alias: e.alias }, _;
    for (const m of e.collection.getIndexes()) {
      let w = [];
      if (m.type === jn)
        for (const E of m.on) {
          const k = a.find((D) => D.key === E && D instanceof Ja);
          if (k === void 0 || (w.push(k), k.generality > 1))
            break;
        }
      else {
        Me(m.on.length === 1);
        const E = m.on[0], k = a.find((D) => D.key === E && D instanceof Cc);
        k && w.push(k);
      }
      w.length > 0 && (_ === void 0 || w.length > _.length || w.at(-1).generality < _.at(-1).generality) && (_ = w, c.index = m);
    }
    if (_) {
      c.indexedWhereOrSort = _;
      for (const m of _)
        t.delete(m.sourceExpression);
      _[0].key === u && (l = !0);
    } else u && (c.index = e.collection.indexOfProperty(u), c.indexedWhereOrSort = [u], l = !0);
    l && (c.reverse = r[0].descending ?? !1, r == null || r.splice(0, 1)), i.add(e);
    for (const m of Array.of(...t))
      this.exprUsesAllowedSources(m, i) && (c.filters || (c.filters = []), c.filters.push(p(this, At).compile(m)), t.delete(m));
    return i.delete(e), new _y(c);
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
    let [i, a, u] = e;
    if (i === "ANY")
      return this.anyAsWhereClause(e, t, r);
    if (e.length > 3 && i !== "BETWEEN")
      return;
    let [l, c] = this.expToKeyPath(a);
    if (l !== t || c === void 0) {
      if ([a, u] = [u, a], [l, c] = this.expToKeyPath(a), l !== t || c === void 0)
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
    const _ = p(this, At), m = _.compile(u);
    switch (i) {
      case "<":
      case "<=":
        return new Tc(e, c, void 0, m, !0, i === "<=");
      case ">":
      case ">=":
        return new Tc(e, c, m, void 0, i === ">=", !0);
      case "=":
      case "IS":
        return new yv(e, c, m);
      case "LIKE": {
        const w = LI(_, m);
        if (typeof w == "string") {
          const [E, k] = qf(w);
          switch (E) {
            case 0:
              return new yv(e, c, _.compile(k));
            case 1:
              return new II(e, c, k);
          }
        }
        break;
      }
      case "BETWEEN": {
        if (this.exprUsesAllowedSources(e[3], r))
          return new Tc(e, c, m, _.compile(e[3]));
        break;
      }
      case "IN":
        return new Cc(e, c, m);
    }
  }
  // Subroutine of asWhereClause() that handles 'ANY' expressions.
  anyAsWhereClause(e, t, r) {
    const [i, a, u, l] = e;
    let [c, _] = this.expToKeyPath(u);
    if (!(c !== t || _ === void 0) && kc(l, "=")) {
      let m;
      if (kc(l[1], "?", a) ? m = l[2] : kc(l[2], "?", a) && (m = l[1]), m && this.exprUsesAllowedSources(m, r))
        return new Cc(e, _, p(this, At).compile(m));
    }
  }
  // True if `expr` uses only the data sources given in `allowedSources`.
  exprUsesAllowedSources(e, t) {
    for (const r of xc(e)) {
      const i = p(this, dr).get(r);
      if (Nn(i), i.type === "result") {
        if (i.sources) {
          for (const a of i.sources)
            if (!t.has(a))
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
      const t = p(this, dr).get(lg(e[1]));
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
              r = Co;
              break;
            case "sequence":
              r = No;
              break;
            case "expires":
              r = Po;
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
      if (p(this, dr).has(r)) {
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
    for (const [e, t] of p(this, dr))
      t.type === "result" && this.getResultSources(t);
  }
  getResultSources(e) {
    if (e.sources === void 0) {
      mr(!e._findingSources, `Result "${e.alias} has a circular dependency`), e._findingSources = !0;
      let t = /* @__PURE__ */ new Set();
      for (const r of xc(e.what)) {
        const i = p(this, dr).get(r);
        if (Nn(i), i.type !== "result")
          t.add(i);
        else
          for (const a of this.getResultSources(i))
            t.add(a);
      }
      e.sources = t, delete e._findingSources;
    }
    return e.sources;
  }
}
At = new WeakMap(), dr = new WeakMap(), Mi = new WeakMap(), Ui = new WeakMap(), $i = new WeakMap(), qa = new WeakMap(), ji = new WeakMap(), Ms = new WeakMap(), Qn = new WeakMap();
function LI(n, e) {
  try {
    return typeof e == "function" ? e() : n.compile(e)();
  } catch (t) {
    if (t instanceof Jf || t instanceof py)
      return;
    throw t;
  }
}
function qI(n, e) {
  let t;
  return Array.isArray(e) && (e[0] === "DESC" ? (t = !0, e = e[1]) : e[0] === "ASC" && (e = e[1])), { expr: n.compile(e), descending: t };
}
function Oy(n) {
  return typeof n == "object" && !Array.isArray(n) && n !== null;
}
const xv = "PBKDF2", MI = 5e6, UI = "Couchbase Lite for JavaScript", Bc = "AES-GCM", $I = 256, bs = Symbol();
class uu extends Error {
}
var Jv, Ki;
Jv = bs;
const Yo = class Yo {
  constructor() {
    pe(this, Jv);
    ee(this, Ki);
  }
  /** Creates a new, unlocked CryptoCodec whose key is derived from the given password. */
  static async create(e) {
    const t = new Yo();
    return await t.generateKey(e), G(t, Ki, await t.encryptJSON(crypto.randomUUID())), t;
  }
  /** Creates a CryptoCodec for use with existing encrypted data. It starts locked.
   *  @param challenge  Any existing encrypted data, usually the prior codec's `challenge`. */
  static withChallenge(e) {
    const t = new Yo();
    return G(t, Ki, e), t;
  }
  /** A small encrypted value which can be saved and then later used to reconstitute the
   *  codec by calling `CryptoCodec.withChallenge()`. */
  get challenge() {
    return p(this, Ki);
  }
  /** True if the password has been given and the codec is ready to encrypt or decrypt. */
  get isUnlocked() {
    return this[bs] !== void 0;
  }
  /** Creates the encryption key, derived from the given password.
   *  If constructed with a challenge, will try to decrypt it with the key; if that fails,
   *  the codec ignores the key and returns false.
   *  If the codec wasn't constructed with a challenge, it creates one now by encrypting some
   *  random data with the key. */
  async unlock(e) {
    await this.generateKey(e);
    try {
      await this.decryptJSON(p(this, Ki));
    } catch {
      return this[bs] = void 0, !1;
    }
    return !0;
  }
  /** Discards the encryption key. `unlock` must be called to use the codec again. */
  lock() {
    this[bs] = void 0;
  }
  /** Encrypts binary data.
   *  @throws EncryptionError  if locked. */
  async encrypt(e) {
    const t = this.requiredKey("encrypt"), r = crypto.getRandomValues(new Uint8Array(12)), i = await crypto.subtle.encrypt({ name: Bc, iv: r }, t, e);
    return { data: new Uint8Array(i), iv: r };
  }
  /** Decrypts binary data.
   *  @throws EncryptionError  if locked. */
  async decrypt(e) {
    const t = this.requiredKey("decrypt"), r = { name: Bc, iv: e.iv };
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
    let r = {}, i = {}, a = !1;
    for (const l of Object.keys(e))
      t != null && t.has(l) ? i[l] = e[l] : (r[l] = e[l], a = !0);
    return { encrypted: a ? await this.encryptJSON(r) : void 0, body: i };
  }
  /** Decrypts any encrypted properties in `rev` and merges them into its `body`.
   *  @throws EncryptionError  if locked. */
  async decryptRevision(e) {
    if (!e.encrypted)
      return;
    const t = await this.decryptJSON(e.encrypted);
    Me(Oy(t)), e.body = { ...e.body, ...t }, e.encrypted = void 0;
  }
  async generateKey(e) {
    const t = new TextEncoder(), r = await crypto.subtle.importKey(
      "raw",
      t.encode(e),
      xv,
      !1,
      ["deriveBits", "deriveKey"]
    );
    this[bs] = await crypto.subtle.deriveKey(
      {
        name: xv,
        hash: "SHA-256",
        iterations: MI,
        salt: t.encode(UI)
      },
      r,
      { name: Bc, length: $I },
      !1,
      // key is not extractable
      ["encrypt", "decrypt"]
      // key is not wrappable
    );
  }
  requiredKey(e) {
    const t = this[bs];
    if (!t)
      throw new uu(`Cannot ${e} without key`);
    return t;
  }
};
Ki = new WeakMap();
let zo = Yo;
var Yr, on;
class jI {
  constructor(e, t, r) {
    ee(this, Yr);
    ee(this, on);
    this.database = e, G(this, Yr, t), G(this, on, r);
  }
  /** Returns the number of unique blobs stored in the database. */
  async countBlobs() {
    return p(this, Yr).count();
  }
  /** Retrieves a blob stored in the Database by [saveBlob], else returns `undefined`.
   *  @throws EncryptionError if the blob exists but can't be decrypted. */
  async getBlobIfExists(e) {
    const t = await p(this, Yr).get(e);
    if (t)
      if (t.iv) {
        if (!p(this, on))
          throw new uu("Blob is encrypted");
        return new Uint8Array(await p(this, on).decrypt({ data: t.contents, iv: t.iv }));
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
    return await p(this, Yr).get(e) !== void 0;
  }
  async allDigests() {
    return await p(this, Yr).toCollection().primaryKeys();
  }
  /** Stores a blob in the Database.
   *  @warning  Caller is responsible for verifing that the digest is corrrect!
   *  @throws EncryptionError if the blob can't be encrypted because the codec is locked. */
  async saveBlob(e, t) {
    let r;
    if (p(this, on)) {
      const i = await di.waitFor(p(this, on).encrypt(e));
      r = { digest: t, contents: i.data, iv: i.iv };
    } else
      r = { digest: t, contents: e };
    await this.database.tryAdd(p(this, Yr), r) === void 0 && this.database.logger.info`Saved blob ${t} (${e.length} bytes)`;
  }
  /** The "sweep" phase of blob GC: Deletes all blobs except those with the given digests.
   *  @returns  The number of blobs deleted. */
  async deleteBlobsExcept(e) {
    const t = await p(this, Yr).where("digest").noneOf(Array.from(e)).delete();
    return this.database.logger.info`Garbage-collected ${t} blobs, keeping ${e.size}`, t;
  }
  async rekey(e) {
    const t = await this.allDigests();
    if (t.length > 0) {
      this.database.logger.info`Encrypting ${t.length} blobs...`;
      for (const r of t) {
        const i = await this.getBlob(r);
        let a;
        if (e) {
          const u = await di.waitFor(e.encrypt(i));
          a = { digest: r, contents: u.data, iv: u.iv };
        } else
          a = { digest: r, contents: i };
        await p(this, Yr).put(a);
      }
    }
    G(this, on, e);
  }
  resetEncryption(e) {
    G(this, on, e);
  }
}
Yr = new WeakMap(), on = new WeakMap();
const KI = "r", Kn = "rw";
let Un;
var Us, Vo, Xn, vr, ei, Br, $s, Gt;
const ah = class ah {
  constructor(e) {
    /** The database's name. */
    pe(this, "name");
    /* {@link https://logtape.org LogTape} logger instance for this Database. */
    pe(this, "logger");
    ee(this, Us, /* @__PURE__ */ new Set());
    //-------- TRANSACTIONS:
    ee(this, Vo, 0);
    ee(this, Xn, 0);
    /** Used as a callback in Blob objects. @internal */
    pe(this, "blobLoader", async (e, t) => await this.blobStore.getBlob(e));
    /** @internal  Exposed for testing */
    pe(this, "enableAutoExpiry", !0);
    ee(this, vr);
    ee(this, ei, /* @__PURE__ */ new Map());
    ee(this, Br, {});
    ee(this, $s);
    ee(this, Gt);
    this.config = e, this.name = e.name, this.logger = lf.with({ db: this.name });
    const t = e.collections, r = {
      [ka]: "",
      [Yc]: "",
      [Kl]: "digest"
    };
    for (const [i, a] of Object.entries(t))
      Ss.validateName(i), r[i] = Ss.dexieIndexSpec(a);
    Object.keys(t).length === 0 && (r[Ao] = Ss.dexieIndexSpec({})), G(this, ei, new Map(Object.entries(t))), p(this, ei).size === 0 && p(this, ei).set(Ao, {}), G(this, vr, new Lt(e.name, Un)), this.installDBCore(), p(this, vr).version(e.version).stores(r), this.logger.info("Created Database {db}");
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
    return e.password = void 0, await new ah(e).initialize(t);
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
      if (t.challenge && (G(this, Gt, zo.withChallenge(t.challenge)), e === void 0 || !await p(this, Gt).unlock(e)))
        throw new uu("Incorrect or missing database password");
      const r = this;
      let i = {};
      for (const [a, u] of p(this, ei)) {
        const l = new Ss(r, a, u, p(this, vr), p(this, Gt));
        await l.open(), i[a] = l;
      }
      return Object.freeze(i), G(this, Br, i), this;
    } catch (t) {
      throw this.close(), t;
    }
  }
  /** True if the database is open. */
  get isOpen() {
    return p(this, vr).isOpen();
  }
  /** Reopens the database after a {@link close} or {@link closeAndDelete} call.
   *  @param password  If the database is encrypted, you must provide the password. */
  async reopen(e) {
    this.logger.info("Reopening database {db}"), await p(this, vr).open(), await this.initialize(e);
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
    G(this, Br, {}), G(this, Gt, void 0), p(this, vr).close();
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
    p(this, vr) && (this.logger.info("Closing and deleting database {db}"), await p(this, vr).delete());
  }
  /** Static method that deletes a database by name.
   *  You MUST close any open Database instance using it first. */
  static async delete(e) {
    lf.info("Deleting database {db}", { db: e }), await Lt.delete(e);
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
    return this.getCollection(Ao);
  }
  //-------- CHANGE LISTENER:
  /** Collections call this to enable/disable receiving Dexie db events. @internal */
  observeChangesFor(e, t = !0) {
    t ? p(this, Us).add(e) : (p(this, Us).delete(e), p(this, Us).size === 0 && this.logger.info`Stopping Dexie change listener`);
  }
  installDBCore() {
    p(this, vr).use({
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
            if (!p(this, ei).has(r))
              return i;
            let a = t.get(r);
            return a || (this.logger.trace`Installing mutate hook for ${r}`, a = {
              // Wrap Collection's table
              ...i,
              // Copy default table implementation
              mutate: async (u) => i.mutate(u).then((l) => {
                var c;
                return (c = p(this, Br)[r]) == null || c.onMutate(u, l), l;
              })
            }, t.set(r, a), a);
          }
        };
      }
    });
  }
  //-------- QUERIES:
  /** Creates a {@link Query} object from a N1QL/SQL++ `SELECT` statement. */
  createQuery(e) {
    return new FI(this, e);
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
    const i = t.map((c) => typeof c == "string" ? c : c.name), a = t.map((c) => typeof c == "string" ? this.getCollection(c) : c);
    e === Kn && i.push(ka, Kl);
    const u = ++hr(this, Vo)._;
    let l = !1;
    try {
      return await p(this, vr).transaction(e, i, async () => {
        ++hr(this, Xn)._, p(this, Xn) === 1 && this.logger.debug("Begin transaction #{id}", { id: u });
        try {
          const c = await r();
          return l = !0, c;
        } catch (c) {
          throw this.logger.debug("Aborting transaction #{id} due to exception", { id: u }), c;
        } finally {
          if (Me(p(this, Xn) >= 0), --hr(this, Xn)._ === 0)
            for (let c of a)
              await c.transactionEnding(l);
        }
      });
    } catch (c) {
      throw l = !1, c;
    } finally {
      if (p(this, Xn) === 0) {
        l && this.logger.debug("Committed transaction #{id}", { id: u });
        for (let c of a)
          c.transactionEnded(l);
      }
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
    return p(this, vr).table(ka);
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
    return Me(!((e = Lt.currentTransaction) != null && e.active), "Don't call this in a transaction"), p(this, Gt) ? p(this, Gt).isUnlocked ? "unlocked" : "locked" : "none";
  }
  /** Unlocks an encrypted database using the given password. @internal
   *  @returns  True on success, false if the password is wrong (or there is no encryption.) */
  async unlock(e) {
    var t;
    return Me(!((t = Lt.currentTransaction) != null && t.active), "Don't call this in a transaction"), p(this, Gt) ? await p(this, Gt).unlock(e) : !1;
  }
  /** Locks an encrypted database, making encrypted stored data inaccessible until {@link unlock}
   *  is called. Has no effect if the database is not encrypted. @internal */
  lock() {
    var e;
    (e = p(this, Gt)) == null || e.lock();
  }
  /** Encrypts or decrypts a database, or changes the encryption key.
   *  @param password  The new password for encryption, or `undefined` to decrypt.
   *  @param exceptProperties  Optional top-level properties to leave unencrypted, by collection
   *                           (in addition to indexed properties, which cannot be encrypted.)
   *                           Key is collection name, value is array or set of properties.
   *  @throws EncryptionError  if it's already encrypted. */
  async changeEncryptionKey(e, t) {
    var u;
    Me(!((u = Lt.currentTransaction) != null && u.active), "Don't call this in a transaction"), Me(this.encryptionStatus !== "locked", "Database must be unlocked to change encryption");
    const r = e !== void 0 ? await zo.create(e) : void 0, i = /* @__PURE__ */ new Map();
    for (const [l, c] of Object.entries(p(this, Br)))
      i.set(l, c.unencryptedProperties);
    const a = r ? p(this, Gt) ? "Rekey" : "Encrypt" : "Decrypt";
    this.logger.info`${a}ing database...`;
    try {
      await this.inTransaction(Kn, this.collectionNames, async () => {
        const l = await this.getMeta();
        l.challenge = r == null ? void 0 : r.challenge, await this.setMeta(l), await this.blobStore.rekey(r);
        for (const [c, _] of Object.entries(p(this, Br)))
          await _.rekey(r, t == null ? void 0 : t[c]);
      }), G(this, Gt, r), this.logger.info`...${a}ed database!`;
    } catch (l) {
      this.logger.error`${a}ing database failed! ${l}`, this.blobStore.resetEncryption(p(this, Gt));
      for (const [c, _] of Object.entries(p(this, Br)))
        _.resetEncryption(p(this, Gt), i.get(c));
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
      const a = i;
      return a instanceof Lt.ConstraintError ? a : Promise.reject(a);
    });
  }
  /** @internal */
  get blobStore() {
    return p(this, $s) || G(this, $s, new jI(this, p(this, vr).table(Kl), p(this, Gt))), p(this, $s);
  }
  /** Returns the number of blobs stored in the database. */
  async countBlobs() {
    return this.blobStore.countBlobs();
  }
  /** Deletes all blobs that are no longer referenced by any documents.
   *  @returns  The number of blobs deleted. */
  async performMaintenance(e) {
    return ug(e, "compact"), this.logger.info("Garbage-collecting blobs"), await this.inTransaction(Kn, this.collectionNames, async () => {
      const t = /* @__PURE__ */ new Set();
      for (const r of Object.values(p(this, Br)))
        await r.collectBlobDigests(t);
      return await this.blobStore.deleteBlobsExcept(t);
    });
  }
};
Us = new WeakMap(), Vo = new WeakMap(), Xn = new WeakMap(), vr = new WeakMap(), ei = new WeakMap(), Br = new WeakMap(), $s = new WeakMap(), Gt = new WeakMap();
let di = ah;
class ls {
  constructor(e, t) {
    this.local = e, this.remote = t;
  }
  static fromObject(e) {
    let t = e.local;
    typeof t != "number" && (t = void 0);
    let r = e.remote;
    return r === null && (r = void 0), new ls(t, r);
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
    return new ls(this.local, this.remote);
  }
}
const cf = Symbol();
function zn(n) {
  const e = n[cf];
  if (e === void 0)
    throw TypeError("meta() called on non-document");
  return e;
}
var zi, Gi;
const oh = class oh {
  /** @internal */
  constructor(e, t, r, i, a) {
    /** The collection that the document belongs to. */
    pe(this, "collection");
    /** The ID (primary key) of the document. */
    pe(this, "id");
    /** The document itself. */
    pe(this, "body");
    ee(this, zi);
    ee(this, Gi);
    v0(t), this.collection = e, this.id = t, G(this, zi, i), G(this, Gi, a), this.body = r, this.body[cf] = this, Object.defineProperty(r, cf, { enumerable: !1 });
  }
  /** The current revision ID of the document. */
  get revisionID() {
    return p(this, zi);
  }
  /** The current sequence number of the document. */
  get sequence() {
    return p(this, Gi);
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
    return new oh(this.collection, this.id, Oo(this.body), p(this, zi), p(this, Gi)).body;
  }
  /** Updates the `revID` and `sequence` properties after the document is saved. @internal */
  _updateRev(e, t) {
    G(this, zi, e), G(this, Gi, t);
  }
};
zi = new WeakMap(), Gi = new WeakMap();
let As = oh;
function zI() {
  const n = new Uint8Array(15);
  return "-" + Vg(crypto.getRandomValues(n)).replaceAll("/", "_");
}
function Go(n) {
  return kr(n) && n["@type"] === "blob" && typeof n.digest == "string";
}
function GI(n) {
  return Go(n) ? n : null;
}
function HI(n, e) {
  t(n);
  function t(r) {
    if (hs(r)) {
      let i = 0;
      for (const a of r) {
        const u = t(a);
        u && (r[i] = u), ++i;
      }
    } else if (kr(r)) {
      const i = GI(r);
      if (i)
        return new ru(i, e);
      for (const a of Object.getOwnPropertyNames(r)) {
        const u = t(r[a]);
        u && (r[a] = u);
      }
    }
  }
}
function WI(n, e) {
  t(n);
  function t(r) {
    if (r instanceof na)
      return new ru(r, e);
    if (hs(r)) {
      let i = 0;
      for (const a of r) {
        const u = t(a);
        u && (r[i] = u), ++i;
      }
    } else if (kr(r))
      for (const i of Object.getOwnPropertyNames(r)) {
        const a = t(r[i]);
        a && (r[i] = a);
      }
  }
}
function ff(n) {
  let e = 0;
  return eh(n, (t, r) => t instanceof na ? (e = 2, !1) : (e = 1, !0)), e;
}
function eh(n, e) {
  const t = [];
  function r(i) {
    if (kr(i)) {
      t.push(0);
      for (const a of Object.getOwnPropertyNames(i))
        if (t[t.length - 1] = a, !r(i[a]))
          return !1;
      t.pop();
    } else if (hs(i)) {
      let a = 0;
      t.push(0);
      for (const u of i)
        if (t[t.length - 1] = a++, !r(u))
          return !1;
      t.pop();
    } else if (p0(i))
      return e(i, t);
    return !0;
  }
  r(n);
}
function Ev(n, e) {
  t(n);
  function t(r) {
    if (kr(r))
      if (Go(r))
        e(r);
      else
        for (const i of Object.getOwnPropertyNames(r))
          t(r[i]);
    else if (hs(r))
      for (const i of r)
        t(i);
  }
}
function YI() {
  return typeof crypto < "u" ? crypto.randomUUID() : VI();
}
function VI() {
  const n = [];
  for (let e = 0; e < 4; e++) {
    const t = Math.round(Math.abs(Math.random() * -2147483648 * 2));
    n.push(t.toString(16).padStart(8, "0"));
  }
  return n.join("");
}
const Ao = "_default", jn = "value", JI = "array";
function s_(n, e) {
  return "replace";
}
function a_(n, e) {
  if (e === void 0)
    return "replace";
  const t = zn(n).revisionID;
  return t && Ro(t) >= Ro(zn(e).revisionID) ? "replace" : "revert";
}
class ZI extends Error {
  constructor(e, t, r, i) {
    super(`Conflict ${e} "${t}" rev ${r}; saved revision is ${i}`), this.docID = t, this.revID = r, this.savedRevID = i, this.name = "Conflict";
  }
}
class Sv extends Error {
  constructor(e) {
    super(`Conflict(s) saving ${e.size} documents`), this.errors = e, this.name = "MultipleConflicts";
  }
}
const Av = "(_default|([a-zA-Z0-9][-_a-zA-Z0-9%]*))", QI = new RegExp(`^${Av}(\\.${Av})?$`);
var it, ti, Hi, Kt, _n, wn, Kr, ri, ni, rr, xn;
const Jo = class Jo {
  /** @internal */
  constructor(e, t, r, i, a) {
    /** {@link https://logtape.org LogTape} logger instance for this Collection. @internal */
    pe(this, "logger");
    ee(this, it);
    // Dexie Table instance
    ee(this, ti, /* @__PURE__ */ new Map());
    // Cached DocProperty instances
    ee(this, Hi);
    // Current task reading metadata
    ee(this, Kt);
    // Metadata, during a transaction
    ee(this, _n, !1);
    // True if `_meta` has unsaved changes
    ee(this, wn);
    // Timer for expiring documents
    ee(this, Kr);
    // Pending changes during a txn
    ee(this, ri, /* @__PURE__ */ new Set());
    // Collection change listeners
    ee(this, ni, /* @__PURE__ */ new Map());
    // Doc change listeners by DocID
    ee(this, rr);
    // Encrypts/decrypts rev bodies
    ee(this, xn);
    this.database = e, this.name = t, this.config = r, this.db = i, G(this, it, i.table(t)), G(this, rr, a), this.logger = lf.getChild(["c", this.name]).with({ db: e.name });
    const u = this.config.indexes;
    if (u)
      for (const l of u) {
        let c;
        typeof l == "string" ? c = l : typeof l.on == "string" ? c = l.on : c = l.on[0], p(this, ti).set(c, os.create(c, !0));
      }
  }
  /** Database calls this right after the constructor.  @internal */
  async open() {
    var e;
    p(this, rr) && G(this, xn, (e = await this.getMeta()) == null ? void 0 : e.unencryptedProperties), this.startExpTimer();
  }
  /** Checks that a collection name is valid. If not, throws.  @internal */
  static validateName(e) {
    if (!QI.test(e))
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
    this.stopExpTimer(), G(this, rr, void 0);
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
    let t = p(this, ti).get(e);
    return t === void 0 && (t = os.create(e, !1), p(this, rr) && (t.encrypted = !((r = p(this, xn)) != null && r.has(t.rootName))), p(this, ti).set(e, t)), t;
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
    return p(this, xn);
  }
  /** Encrypts the documents in this Collection.  @internal */
  async rekey(e, t) {
    var a;
    Me((a = Lt.currentTransaction) == null ? void 0 : a.active, "Must be called in a transaction");
    const r = await this.documentIDs();
    if (e) {
      t === void 0 ? t = /* @__PURE__ */ new Set() : Array.isArray(t) && (t = new Set(t));
      for (const l of t)
        Me(
          !l.includes("."),
          `Only top-level properties can be excluded from encryption, not "${l}"`
        );
      const u = this.config.indexes;
      if (u) {
        const l = (c, _) => {
          var w;
          const m = (w = p(this, ti).get(c)) == null ? void 0 : w.rootName;
          m && _.add(m);
        };
        for (const c of u)
          if (typeof c == "string")
            l(c, t);
          else if (typeof c.on == "string")
            l(c.on, t);
          else
            for (const _ of c.on)
              l(_, t);
      }
      this.logger.info`Encrypting ${r.length} documents, except for properties ${Array.from(t)}`;
    } else
      this.logger.info`Decrypting ${r.length} documents...`, t = void 0;
    for (const u of r) {
      let l = await p(this, it).get(u);
      if (!xa(l)) {
        const c = l.encrypted !== void 0;
        if (c && await this.decryptRevision(l), e) {
          const { body: _, encrypted: m } = await di.waitFor(
            e.partlyEncrypt(l.body, t)
          );
          l.body = _, l.encrypted = m;
        }
        (c || l.encrypted) && await p(this, it).put(l);
      }
    }
    this.resetEncryption(e, t);
    const i = await this.getMeta();
    i.unencryptedProperties = t, G(this, _n, !0), this.logger.info`...done encrypting/decrypting collection!`;
  }
  /** Called by `rekey`, and by the Database after `encrypt` or `decrypt` if something went wrong.
   *  @internal */
  resetEncryption(e, t) {
    G(this, rr, e), G(this, xn, t);
    for (let r of p(this, ti).values())
      r.indexed || (r.encrypted = t !== void 0 && t.has(r.rootName));
  }
  /** Called by queries to decrypt a LocalRevision returned from a Dexie query.  @internal */
  async decryptRevision(e) {
    if (e.encrypted) {
      if (!p(this, rr))
        throw new uu("Document is encrypted");
      await di.waitFor(p(this, rr).decryptRevision(e));
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
    return t || (t = {}), new As(this, e ?? zI(), t).body;
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
    const r = await this.preSave(e), i = await this.inTransaction(Kn, async () => (p(this, Kt) || await this.getMeta(), await this.doSave(r, t)));
    return r.postSave(), i && this.logger.info("Saved doc {docID}", { docID: r.doc.id, revID: r.newRevID }), i;
  }
  /** Prep work for save() that can be performed outside of a transaction. */
  async preSave(e, t = !1) {
    const r = new XI(e, t);
    return Me(r.doc.collection === this, "Saving document to wrong Collection"), !t && p(this, rr) && (r.newBody = await di.waitFor(
      p(this, rr).partlyEncrypt(r.doc.body, p(this, xn))
    )), r;
  }
  /** The actual work of saving a document. Must be called in a transaction. */
  async doSave(e, t) {
    const r = e.doc;
    let i;
    if (e.newSeq = this._nextSequence(), e.blobStatus > 1 && await this.saveNewBlobsIn(e.doc.body), r.revisionID === void 0) {
      const a = await this.database.tryAdd(p(this, it), e.makeRevision());
      if (a === void 0)
        return !0;
      if (i = await p(this, it).get(r.id), !i)
        throw a;
      if (!xa(i)) {
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
    e instanceof As || (e = zn(e)), Me(e.collection === this, "Saving document to wrong Collection"), Me(e.revisionID !== void 0, "Document has not been saved");
    let r = await this.inTransaction(Kn, async () => await this.doDelete(e, t));
    return r === void 0 ? !1 : (e.setBody({}), e._updateRev(r[0], r[1]), this.logger.info("Deleted doc {docID}", { docID: e.id }), !0);
  }
  async doDelete(e, t) {
    Me(e.collection === this, "Saving document to wrong Collection"), Me(e.revisionID !== void 0, "Document has not been saved");
    const r = await p(this, it).get(e.id);
    return r ? xa(r) ? [r.rev, r.seq] : r.rev !== e.revisionID && !this.handleConflict("deleting", t, e, r) ? void 0 : (r.rev = To(e.revisionID, e.body, !0), r.seq = await this.nextSequence(), r.body = {}, r.encrypted = void 0, r.flags = (r.flags ?? 0) | gr & -2, await p(this, it).put(r), [r.rev, r.seq]) : [e.revisionID, e.sequence];
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
    const t = Date.now(), r = [], i = [], a = [];
    if (e.save) {
      this.logger.info`Saving ${e.save.length} docs ...`;
      for (const _ of e.save) {
        const m = await this.preSave(_);
        m.doc.revisionID === void 0 ? r.push(m) : i.push(m);
      }
    }
    if (e.delete) {
      this.logger.info`Deleting ${e.delete.length} docs ...`;
      for (const _ of e.delete)
        a.push(await this.preSave(_, !0));
    }
    const u = r.length + i.length + a.length;
    if (u === 0)
      return;
    let l = [], c = /* @__PURE__ */ new Map();
    await this.inTransaction(Kn, async () => {
      if (await this.getMeta(), r.length > 0) {
        this.logger.debug`... inserting ${r.length} of the docs ...`;
        let _ = await this.bulkAdd(r.map((m) => (m.newSeq = this._nextSequence(), m.makeRevision())));
        if (_ === void 0)
          l.push(...r);
        else {
          const m = new Set(_);
          r.forEach((w, E) => {
            m.has(E) ? (w.newSeq = void 0, i.push(w)) : l.push(w);
          });
        }
      }
      if (i.length > 0) {
        this.logger.debug`... updating ${i.length} of the docs ...`;
        for (const _ of i)
          try {
            await this.doSave(_, e.onConflict) && l.push(_);
          } catch (m) {
            c.set(_.doc.id, m);
          }
      }
      if (a.length > 0) {
        this.logger.debug`... deleting ${a.length} of the docs ...`;
        for (const _ of a)
          try {
            const m = await this.doDelete(_.doc, e.onConflict);
            m && ([_.newRevID, _.newSeq] = m, l.push(_));
          } catch (m) {
            c.set(_.doc.id, m);
          }
      }
      if (c.size > 0 && (this.logger.error`saveMultiple: ${c.size} of ${u} docs failed`, !e.bestEffort))
        throw new Sv(c);
    });
    for (const _ of l)
      _.postSave();
    if (this.logger.info`Updated ${l.length} of ${u} docs in ${Date.now() - t}ms`, c.size > 0 && e.bestEffort)
      throw new Sv(c);
  }
  /** Deletes all traces of a document, without leaving a "tombstone" revision behind.
   *  However, this means *purges are not visible to the replicator*, which has two side effects:
   *  - A push replication will not push the deletion to a server.
   *  - If the document is later updated on the server side, the next pull replication will
   *    download the new revision.
   *  @param doc  The document or DocID. */
  async purge(e) {
    const t = typeof e == "string" ? e : zn(e).id;
    await p(this, it).delete(t), this.logger.info("Purged doc {docID}", { docID: t });
  }
  /** {@link purge Purges} multiple documents at once. */
  async purgeMultiple(e) {
    const t = e.map((r) => typeof r == "string" ? r : zn(r).id);
    await p(this, it).where(Na).anyOf(t).delete();
  }
  /** Invokes an optional ConflictHandler.
   *  @returns true if the handler resolved the conflict, false if it returned 'ignore'.
   *  @throws ConflictError if there is no handler, or if it returned 'fail'. */
  handleConflict(e, t, r, i) {
    if (t !== void 0) {
      const a = i ? this.revToDoc(i) : void 0;
      switch (t(r.body, a)) {
        case "replace":
          return !0;
        case "revert":
          return i && (r.setBody(i.body), r._updateRev(i == null ? void 0 : i.rev, i.seq)), !1;
      }
    }
    throw new ZI(e, r.id, r.revisionID, i == null ? void 0 : i.rev);
  }
  async saveNewBlobsIn(e) {
    const t = new Array();
    eh(e, (r, i) => (r instanceof na && t.push(r), !0));
    for (const r of t)
      await this.database.blobStore.saveBlob(r.contents, r.digest);
    WI(e, this.database.blobLoader);
  }
  /** Adds the digest of every blob in every document to the set [allDigests]. @internal */
  async collectBlobDigests(e) {
    const t = await p(this, it).where("flags").anyOf([Ti, Ti | wa]).primaryKeys();
    console.log(`collectBlobDigests: ${t}`);
    for (const r of t) {
      const i = await p(this, it).get(r);
      i.encrypted && await this.decryptRevision(i), Ev(i.body, (a) => e.add(a.digest)), i.conflict && Ev(i.conflict, (a) => e.add(a.digest));
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
    return this.isListening() || this.database.observeChangesFor(this.name, !0), p(this, ri).add(e), new gf(() => {
      p(this, ri).delete(e), this.isListening() || (G(this, Kr, void 0), this.database.observeChangesFor(this.name, !1));
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
    let r = p(this, ni).get(e);
    return r || (r = /* @__PURE__ */ new Set(), p(this, ni).set(e, r)), r.add(t), new gf(() => {
      var i;
      (i = p(this, ni).get(e)) == null || i.delete(t), this.isListening() || (G(this, Kr, void 0), this.database.observeChangesFor(this.name, !1));
    });
  }
  isListening() {
    return p(this, ni).size > 0 && p(this, ri).size > 0;
  }
  /** Called via a Dexie hook after any change in the collection's table. @internal */
  onMutate(e, t) {
    var i;
    if (p(this, ri).size === 0)
      return;
    function r(a) {
      return a.length > 0 && Object.keys(t.failures).length > 0 ? a.filter((u, l) => t.failures[l] === void 0) : a;
    }
    switch (e.type) {
      case "add":
      case "put": {
        const a = r(e.values);
        if (a.length > 0) {
          p(this, Kr) === void 0 && G(this, Kr, /* @__PURE__ */ new Map());
          for (const u of a) {
            let l = { id: u.id, rev: u.rev, sequence: u.seq };
            xa(u) && (l.deleted = !0), Object.freeze(l), p(this, Kr).set(u.id, l);
          }
          this.logger.debug`MUTATE ${this.name}: ${e.type.toUpperCase()}: ${a.map((u) => u.id).join(", ")}`;
        }
        break;
      }
      case "delete": {
        const a = r(e.keys);
        if (a.length > 0) {
          for (const u of a)
            (i = p(this, Kr)) == null || i.delete(u);
          this.logger.debug`MUTATE ${this.name}: DELETE keys = ${a.join(", ")}`;
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
      for (const t of p(this, ri))
        try {
          t(e);
        } catch (r) {
          this.logger.error`Caught exception in collection change listener: ${r}`;
        }
      for (const [t, r] of p(this, ni)) {
        const i = e.get(t);
        if (i)
          for (const a of r)
            try {
              a(i);
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
    const t = async () => await p(this, it).where("flags").aboveOrEqual(gr).count();
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
    const t = this.name, r = new Uo(), i = new _y({ collection: this, alias: t }), a = new xy((u) => {
      const l = u.getSourceRevision(t);
      return e(this.revToDoc(l));
    });
    return i.receiver = a, await i.run(r), a.ok;
  }
  /** Returns the DocIDs of all (undeleted) documents. */
  async documentIDs() {
    return await p(this, it).toCollection().filter((e) => !((e.flags ?? 0) & gr)).primaryKeys();
  }
  /** Returns the DocIDs of all deleted documents. */
  async deletedDocumentIDs() {
    return this.docIDsByFlags((e) => e.aboveOrEqual(gr));
  }
  /** Returns the DocIDs of all documents that have unresolved replication conflicts. @internal*/
  async conflictedDocumentIDs() {
    return this.docIDsByFlags((e) => e.between(wa, wa | Ti));
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
    const r = typeof e == "string" ? e : zn(e).id, i = Date.now();
    let a;
    if (t !== void 0 && (a = t instanceof Date ? t.getTime() : i + t), await p(this, it).update(r, { expires: a }) < 1)
      throw Error(`No such document '${r}`);
    a !== void 0 ? this.logger.info(
      "Set expiration of doc {docID} to {time} sec from now",
      { docID: r, time: (a - i) / 1e3 }
    ) : this.logger.info("Cleared expiration of doc {docID}", { docID: r }), a !== void 0 && this.startExpTimer();
  }
  /** Gets a document's expiration date.
   *  @returns The expiration date, or `undefined` if none, or if the document doesn't exist. */
  async getDocumentExpiration(e) {
    var i;
    const t = typeof e == "string" ? e : zn(e).id, r = (i = await p(this, it).get(t)) == null ? void 0 : i.expires;
    return r ? new Date(r) : void 0;
  }
  /** Returns the next time (milliseconds since epoch) at which a doc will expire. @internal */
  async nextExpirationTime() {
    const e = await p(this, it).orderBy(_o).first();
    return e == null ? void 0 : e.expires;
  }
  /** Purges all documents whose expiration date has arrived.
   *  Returns the number of documents purged. @internal */
  async expireDocs() {
    const e = await p(this, it).where(_o).belowOrEqual(Date.now()).delete();
    return e > 0 && this.logger.info("Deleted {n} expired docs", { n: e }), e;
  }
  async startExpTimer() {
    if (this.stopExpTimer(), this.isOpen && this.database.enableAutoExpiry) {
      const e = await this.nextExpirationTime();
      if (e !== void 0 && p(this, wn) === void 0 && this.isOpen) {
        const t = Math.max(e - Date.now(), 0), r = async () => {
          G(this, wn, void 0), this.isOpen && (await this.expireDocs(), this.startExpTimer());
        };
        G(this, wn, setTimeout(() => void r(), t));
      }
    }
  }
  stopExpTimer() {
    p(this, wn) && (clearTimeout(p(this, wn)), G(this, wn, void 0));
  }
  //-------- INDEXES:
  /** Creates a Dexie schema string for use by the `Version.stores()` method.  @internal */
  static dexieIndexSpec(e) {
    let t = "id, &seq, flags, expires";
    if (e.indexes)
      for (const r of e.indexes)
        t += ", " + Jo.indexNameFromSpec(r);
    return t;
  }
  /** Returns the Dexie index name of an IndexConfig */
  static indexNameFromSpec(e) {
    function t(r) {
      return os.create(r).keypath;
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
        case JI:
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
      { name: Na, type: jn, on: [this.property(Co)], unique: !0 },
      { name: Oa, type: jn, on: [this.property(No)], unique: !0 },
      { name: _o, type: jn, on: [this.property(Po)] }
    ];
    const t = this.config.indexes;
    if (t)
      for (const r of t) {
        let i, a, u;
        typeof r == "string" ? i = [r] : (i = Array.isArray(r.on) ? r.on : [r.on], u = r.type ?? jn, a = r.unique);
        let l = Jo.indexNameFromSpec(r);
        l.startsWith("*") && (l = l.substring(1)), e.push({
          name: l,
          type: u ?? jn,
          on: i.map((c) => this.property(c)),
          unique: a
        });
      }
    return e;
  }
  /** Returns the index, if any, whose primary key is `property`.
   *  If there is more than one, it picks the one with the fewest properties.  @internal */
  indexOfProperty(e, t = jn) {
    let r, i = 1 / 0;
    if (e.indexed)
      for (const a of this.getIndexes())
        a.on[0] === e && a.on.length < i && a.type === t && (r = a);
    return r;
  }
  //-------- Replicator Support:
  /** Returns the collection's UUID, used for saving the remote checkpoint on the server.
   *  @internal */
  async getClientID() {
    let e = await this.getMeta();
    return e.clientID ? e.clientID : await this.db.transaction("rw", ka, async () => (e = await this.getMeta(), e.clientID || (e.clientID = YI(), G(this, _n, !0), this.logger.debug("assigned clientID {clientID}", { clientID: e.clientID })), e.clientID));
  }
  /** Returns the locally-stored Checkpoint for a given server URL.
   *  @internal */
  async getCheckpoint(e) {
    const t = await this.db.table(Yc).get([this.name, e]);
    return t ? ls.fromObject(t) : void 0;
  }
  /** Saves the local Checkpoint for a given server URL.
   *  @internal */
  async setCheckpoint(e, t) {
    this.logger.debug("Saving checkpoint {checkpoint}", { checkpoint: t }), await this.db.table(Yc).put(t, [this.name, e]);
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
    let r = 0, i;
    return await this.inTransaction(Kn, async () => {
      if (p(this, Kt) || await this.getMeta(), t) {
        this.logger.debug`inserting ${e.length} revs as new...`;
        const u = await this.putNewRemoteRevisions(e);
        if (u === void 0) {
          r = p(this, Kt).lastSeq;
          return;
        }
        e = u;
      }
      const a = (await p(this, it).bulkGet(e.map((u) => u.id))).map((u, l) => this.updateLocalRev(u, e[l], this._nextSequence()));
      p(this, rr) && await this.encryptLocalRevs(a), await p(this, it).bulkPut(a), r = p(this, Kt).lastSeq;
      for (const u of a)
        u.flags && u.flags & wa && (i === void 0 && (i = /* @__PURE__ */ new Set()), i.add(u.id));
    }), Me(r > 0), { lastSequence: r, conflicts: i };
  }
  // subroutine of putRemoteRevisions that uses `bulkAdd` to create new documents;
  // if any already exist, it returns them so the caller can handle them as normal updates.
  async putNewRemoteRevisions(e) {
    const t = e.map((i) => this.createLocalRev(i, this._nextSequence()));
    p(this, rr) && await this.encryptLocalRevs(t);
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
      for (const [i, a] of Object.entries(t.failuresByPos)) {
        const u = Number(i);
        if (a.name !== "ConstraintError")
          throw this.logger.error("bulkAdd: '{id}' failed: {error}", { id: e[u].id, error: a }), a;
        r.push(u);
      }
      return r;
    }
  }
  /** Returns an ordered list of revisions that were created since a given local Sequence.
   *  @param since  The sequence to start just past; use `undefined` for all changes.
   *  @param limit  The maximum number of revisions to return.
   *  @returns  An array of `LocalRevision`, ordered by Sequence.
   *  @internal */
  async getDocsSinceSequence(e, t) {
    let r;
    return e !== void 0 && e > 0 ? r = p(this, it).where(Oa).above(e) : r = p(this, it).orderBy(Oa), (await r.limit(t).toArray()).map((i) => (delete i.conflict, i));
  }
  /** Resolves a replication conflict. Returns false if `revID` is out of date. @internal */
  async resolveConflict(e, t, r) {
    return await this.inTransaction(Kn, async () => {
      let a = await p(this, it).get(e);
      if ((a == null ? void 0 : a.rev) !== t)
        return !1;
      Nn(a.conflict);
      const u = ia(r, a.conflict);
      let l = (a.flags ?? 0) & -194;
      if (r === null)
        l |= gr, r = {};
      else {
        const c = ff(r);
        c > 0 && (l |= Ti), c >= 2 && await this.saveNewBlobsIn(r);
      }
      return u ? (Nn(a.serverRev), a.rev = a.serverRev) : a.rev = To(t, r, (l & gr) !== 0), a.body = r, a.seq = await this.nextSequence(), a.flags = l || void 0, a.conflict = void 0, await p(this, it).put(a), !0;
    });
  }
  //-------- INTERNAL REVISION HELPER METHODS:
  /** Creates a LocalRevision from a RemoteRevision. */
  createLocalRev(e, t) {
    return {
      id: e.id,
      rev: e.rev,
      seq: t,
      flags: e.deleted ? gr : void 0,
      body: e.body,
      serverRev: e.rev
    };
  }
  /** Updates or creates a LocalRevision from a RemoteRevision. */
  updateLocalRev(e, t, r) {
    if (e === void 0)
      return this.createLocalRev(t, r);
    e.seq = r, e.serverRev = t.rev;
    let i = e.flags ?? 0;
    return e.rev !== e.serverRev && e.rev !== t.rev ? (e.conflict = t.deleted ? null : t.body, i |= wa) : (e.rev = t.rev, e.body = t.body, t.deleted ? i |= gr : i &= -129, i &= -65, delete e.conflict), e.flags = i || void 0, e;
  }
  /** Encrypts properties of `rev.body` and puts the ciphertext in `rev.encrypted`.
   *  - Precondition: *Codec exists* and is unlocked.
   *  - Precondition: `rev.body` contains _all_ doc properties. */
  async encryptLocalRev(e) {
    const { body: t, encrypted: r } = await p(this, rr).partlyEncrypt(e.body, p(this, xn));
    e.body = t, e.encrypted = r;
  }
  /** Encrypts properties of each rev's `body` and puts the ciphertext in its `encrypted`. */
  async encryptLocalRevs(e) {
    if (p(this, rr)) {
      this.logger.info`Encrypting ${e.length} incoming revisions`;
      const t = Promise.all(e.map(async (r) => this.encryptLocalRev(r)));
      await di.waitFor(t);
    }
  }
  /** Converts a LocalRevision read from the Table into a client Document object. */
  revToDoc(e) {
    if (e.flags) {
      if (e.flags & gr)
        return;
      e.flags & Ti && HI(e.body, this.database.blobLoader);
    }
    return new As(this, e.id, e.body, e.rev, e.seq).body;
  }
  //-------- Sequence & Transaction Support:
  // generates the next consecutive sequence number.
  async nextSequence() {
    return p(this, Kt) || await this.getMeta(), this._nextSequence();
  }
  /** generates the next consecutive sequence number; non-async but #meta must be loaded already */
  _nextSequence() {
    return Nn(p(this, Kt)), G(this, _n, !0), ++p(this, Kt).lastSeq;
  }
  // Returns the Collection's metadata object.
  async getMeta() {
    return Lt.currentTransaction ? (p(this, Kt) || (p(this, Hi) || G(this, Hi, this._actuallyReadMeta()), await p(this, Hi)), p(this, Kt)) : await this._readMeta();
  }
  // subroutine of getMeta(). Do not call.
  async _actuallyReadMeta() {
    G(this, Kt, await this._readMeta()), G(this, Hi, void 0), G(this, _n, !1);
  }
  /** Saves cached changes (`this.meta`) back to the db. Called by Database.inTransaction.
      @internal */
  async transactionEnding(e) {
    e && p(this, _n) && p(this, Kt) && await this.metaTable.put(p(this, Kt), this.name), G(this, _n, !1), G(this, Kt, void 0);
  }
  /** Posts change notifications after a transaction is committed.
   *  Called by Database.inTransaction. @internal */
  transactionEnded(e) {
    e ? this.postChangeEvent() : G(this, Kr, void 0);
  }
  // Lowest-level method to get the collection metadata.
  async _readMeta() {
    return await this.metaTable.get(this.name) ?? { lastSeq: 0 };
  }
  /** The MetaStore table. */
  get metaTable() {
    return this.db.table(ka);
  }
  // Properties to leave unencrypted
};
it = new WeakMap(), ti = new WeakMap(), Hi = new WeakMap(), Kt = new WeakMap(), _n = new WeakMap(), wn = new WeakMap(), Kr = new WeakMap(), ri = new WeakMap(), ni = new WeakMap(), rr = new WeakMap(), xn = new WeakMap();
let Ss = Jo;
class XI {
  constructor(e, t = !1) {
    pe(this, "doc");
    // The document
    pe(this, "blobStatus");
    // Whether it has blobs
    pe(this, "newBody");
    // The body & maybe encrypted bits
    pe(this, "newRevID");
    // The new revision's revID
    pe(this, "newSeq");
    this.deleting = t, e instanceof As || (e = zn(e)), v0(e.id), this.doc = e, t ? (this.blobStatus = 0, this.newBody = { body: {} }) : (this.blobStatus = ff(e.body), this.newBody = { body: e.body }), this.newRevID = To(e.revisionID, e.body, t);
  }
  /** Creates a LocalRevision object. */
  makeRevision() {
    return Me(!this.deleting), Nn(this.newSeq, "Saving.newSeq"), {
      id: this.doc.id,
      rev: this.newRevID,
      seq: this.newSeq,
      flags: this.blobStatus ? Ti : void 0,
      body: this.newBody.body,
      encrypted: this.newBody.encrypted
    };
  }
  /** Updates the revID and blob status. */
  updateFrom(e) {
    return this.newRevID = To(e, this.doc.body, !1), this.blobStatus = ff(this.doc.body), this.blobStatus > 1;
  }
  /** Copies my state to a `LocalRevision` read from the table. */
  updateRevision(e) {
    let t = (e.flags ?? 0) & -130;
    this.deleting && (t |= gr), this.blobStatus > 0 && (t |= Ti), e.rev = this.newRevID, e.seq = this.newSeq, e.flags = t, e.body = this.newBody.body, e.encrypted = this.newBody.encrypted;
  }
  /** After a save has committed, updates the CBLDocument's revID and sequence. */
  postSave() {
    this.newSeq !== void 0 && (this.doc._updateRev(this.newRevID, this.newSeq), this.deleting && this.doc.setBody({}));
  }
  // The new revision's sequence
}
function ks(n, e, t) {
  for (Me(t >= 0 && t < 2147483648, "writeVarUint: number out of range"); t >= 128; )
    n[e++] = t & 255 | 128, t = t >>> 7;
  return n[e++] = t, e;
}
function eb(n) {
  const e = new Uint8Array(10), t = ks(e, 0, n);
  return e.subarray(0, t);
}
function ko(n, e) {
  let t = 0, r = 0;
  const i = Math.min(n.length, e + 5);
  for (; e < i; ) {
    const a = n[e++];
    if (a >= 128)
      t |= (a & 127) << r, r += 7;
    else
      return t |= a << r, [t, e];
  }
  throw Error("Invalid varint");
}
function Ry(n) {
  return n.reduce((e, t) => e + t.length, 0);
}
function Ty(n) {
  if (n.length === 1)
    return n[0];
  const e = new Uint8Array(Ry(n));
  let t = 0;
  for (const r of n)
    e.set(r, t), t += r.length;
  return e;
}
var cs = /* @__PURE__ */ ((n) => (n[n.None = 0] = "None", n[n.Compressed = 8] = "Compressed", n[n.Urgent = 16] = "Urgent", n[n.NoReply = 32] = "NoReply", n[n.All = 56] = "All", n))(cs || {}), dn = /* @__PURE__ */ ((n) => (n[n.TypeMask = 7] = "TypeMask", n[n.MoreComing = 64] = "MoreComing", n))(dn || {}), Dr = /* @__PURE__ */ ((n) => (n[n.MSG = 0] = "MSG", n[n.RPY = 1] = "RPY", n[n.ERR = 2] = "ERR", n[n.ACKMSG = 4] = "ACKMSG", n[n.ACKRPY = 5] = "ACKRPY", n))(Dr || {});
const hf = ["MSG", "RPY", "ERR", "?3?", "ACKMSG", "ACKRPY", "?6?", "?7?"], Fc = new Uint8Array(1), Lc = new TextEncoder(), pf = new TextDecoder();
class fs {
  /** Constructs an outgoing request message.
      @param properties  An object containing key/value strings, or a string for the `Profile`
                         property.
      @param body  Either a string, a `Uint8Array`, or a JSON-compatible object.
      @param options  Some combination of `Options` flags (`Urgent`, `NoReply`, `Compressed`.) */
  constructor(e, t = "", r = 0) {
    /** The key/value properties, most importantly `Profile` which is the request type.
        These may be modified until you send the message. */
    pe(this, "properties");
    pe(this, "_flags");
    pe(this, "_number");
    pe(this, "_bodyData");
    pe(this, "_bodyString");
    pe(this, "_bodyJSON");
    this._flags = r & 56, typeof e == "string" ? this.properties = { Profile: e } : this.properties = e, typeof t == "string" ? this._bodyString = t : t instanceof Uint8Array ? this._bodyData = t : t != null ? this.bodyJSON = t : this._bodyString = "";
  }
  /** Constructs a reply to this Message.
   *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
  makeReply(e = {}, t = "", r = 0) {
    Me(this.type === 0, "cannot reply to a reply"), Me(this.wantsReply, "message was sent NoReply"), Me(this._number !== void 0, "message has not been sent");
    const i = new fs(e, t);
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
    e instanceof Ho && (t = e.blipErrorCode, r = e.blipErrorDomain), this.makeErrorReply(e.message, t, r);
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
    return this.isError ? new tb(this) : void 0;
  }
  /** The message body as a string. */
  get bodyString() {
    return this._bodyString === void 0 && (this._bodyString = pf.decode(this.bodyData)), this._bodyString;
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
    return this._bodyData === void 0 && (this._bodyData = Lc.encode(this.bodyString)), this._bodyData;
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
    let t = fs.describeFrame(this._number, this._flags);
    return t += " " + JSON.stringify(this.properties), e && (t += "«" + this.bodyString + "»"), t;
  }
  // Internals that clients probably aren't interested in:
  /** @internal */
  get type() {
    return this._flags & 7;
  }
  /** @internal */
  get typeName() {
    return hf[this.type];
  }
  /** @internal */
  get hasNumber() {
    return this._number !== void 0;
  }
  /** @internal */
  get number() {
    return Me(this.hasNumber), this._number;
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
          Lc.encode(t),
          Fc,
          Lc.encode(this.properties[t].toString()),
          Fc
        );
      e.unshift(eb(Ry(e)));
    } else
      e.unshift(Fc);
    return e.push(this.bodyData), Ty(e);
  }
  /** @internal  Returns a textual description of a frame's flags, for logging. */
  static describeFrame(e, t) {
    let r = hf[
      t & 7
      /* TypeMask */
    ];
    return e && (r += `#${e} `), r += t & 8 ? "z" : "-", r += t & 16 ? "u" : "-", r += t & 32 ? "n" : "-", r += t & 64 ? "+" : "-", r;
  }
}
class Ta extends fs {
  constructor(e, t, r, i) {
    Me(e > 0, "invalid message number"), super(t, r), this._flags = i, this._number = e;
  }
  static makeReply(e, t = {}, r = "", i = 0) {
    return new Ta(e, t, r, 1 | i);
  }
  static makeError(e, t, r, i = "BLIP") {
    return new Ta(
      e,
      { "Error-Code": r.toString(), "Error-Domain": i },
      t,
      2
      /* ERR */
    );
  }
  static decodedFromBinary(e, t, r) {
    let [i, a] = ko(e, 0);
    if (i += a, i > e.length)
      throw Error("Message properties length too large");
    const u = {};
    for (; a < i; ) {
      let c = e.indexOf(0, a);
      if (c < 0 || c > i)
        throw Error("Invalid message properties (no NUL)");
      const _ = pf.decode(e.slice(a, c));
      if (a = c + 1, c = e.indexOf(0, a), c < 0 || c > i)
        throw Error("Invalid message properties (no NUL)");
      const m = pf.decode(e.slice(a, c));
      a = c + 1, u[_] = m;
    }
    const l = e.slice(i);
    return new Ta(r, u, l, t);
  }
}
class Ho extends Error {
  constructor(t, r, i = "BLIP") {
    super(t);
    /** The error domain, a namespace for the code. */
    pe(this, "blipErrorDomain");
    /** The error code. */
    pe(this, "blipErrorCode");
    this.name = "blip.BLIPError", this.blipErrorCode = r, this.blipErrorDomain = i;
  }
  matches(t, r = "BLIP") {
    return this.blipErrorCode === t && this.blipErrorDomain === r;
  }
  toString() {
    return `${super.toString()} (${this.blipErrorDomain} ${this.blipErrorCode})`;
  }
}
class tb extends Ho {
  constructor(t) {
    super(
      "Peer responded with error: " + t.bodyString,
      t.numericProperty("Error-Code"),
      t.property("Error-Domain", "BLIP")
    );
    /** The incoming BLIP error reply. */
    pe(this, "blipMessage");
    this.name = "blip.MessageError", this.blipMessage = t;
  }
}
var ii;
class rb {
  constructor() {
    ee(this, ii, /* @__PURE__ */ new Map());
  }
  addEventListener(e, t) {
    if (p(this, ii).get(e))
      throw Error(`there is already a message handler for ${e}`);
    p(this, ii).set(e, t);
  }
  removeEventListener(e, t) {
    p(this, ii).get(e) === t && p(this, ii).delete(e);
  }
  dispatchMessage(e) {
    const t = p(this, ii).get(e.profile);
    if (t) {
      try {
        t(e);
      } catch (r) {
        console.error(`dispatchMessage(${e.profile}) caught ${r}`);
      }
      return !0;
    } else
      return !1;
  }
}
ii = new WeakMap();
function nb({ polynomial: n, numTables: e }) {
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
const nn = nb({ polynomial: 3988292384, numTables: 8 });
function ib() {
  return -1;
}
function sb(n, e) {
  const t = e.byteLength, r = new DataView(e.buffer, e.byteOffset, t);
  let i = n, a = 0;
  const u = -r.byteOffset & 3;
  for (; a < u && a < t; a++)
    i = nn[(i ^ r.getUint8(a)) & 255] ^ i >>> 8;
  if (a === t)
    return i;
  a = u;
  let l = t - a;
  for (; l >= 8; a += 8, l -= 8) {
    i ^= r.getUint32(a, !0);
    const c = r.getUint32(a + 4, !0);
    i = nn[0 * 256 + (c >>> 24 & 255)] ^ nn[1 * 256 + (c >>> 16 & 255)] ^ nn[2 * 256 + (c >>> 8 & 255)] ^ nn[3 * 256 + (c >>> 0 & 255)] ^ nn[4 * 256 + (i >>> 24 & 255)] ^ nn[5 * 256 + (i >>> 16 & 255)] ^ nn[6 * 256 + (i >>> 8 & 255)] ^ nn[7 * 256 + (i >>> 0 & 255)];
  }
  for (let c = a; c < t; c++)
    i = nn[(i ^ r.getUint8(c)) & 255] ^ i >>> 8;
  return i;
}
function ab(n) {
  return (n ^ -1) >>> 0;
}
var qc = {}, kv;
function _i() {
  return kv || (kv = 1, function(n) {
    var e = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
    function t(a, u) {
      return Object.prototype.hasOwnProperty.call(a, u);
    }
    n.assign = function(a) {
      for (var u = Array.prototype.slice.call(arguments, 1); u.length; ) {
        var l = u.shift();
        if (l) {
          if (typeof l != "object")
            throw new TypeError(l + "must be non-object");
          for (var c in l)
            t(l, c) && (a[c] = l[c]);
        }
      }
      return a;
    }, n.shrinkBuf = function(a, u) {
      return a.length === u ? a : a.subarray ? a.subarray(0, u) : (a.length = u, a);
    };
    var r = {
      arraySet: function(a, u, l, c, _) {
        if (u.subarray && a.subarray) {
          a.set(u.subarray(l, l + c), _);
          return;
        }
        for (var m = 0; m < c; m++)
          a[_ + m] = u[l + m];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        var u, l, c, _, m, w;
        for (c = 0, u = 0, l = a.length; u < l; u++)
          c += a[u].length;
        for (w = new Uint8Array(c), _ = 0, u = 0, l = a.length; u < l; u++)
          m = a[u], w.set(m, _), _ += m.length;
        return w;
      }
    }, i = {
      arraySet: function(a, u, l, c, _) {
        for (var m = 0; m < c; m++)
          a[_ + m] = u[l + m];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        return [].concat.apply([], a);
      }
    };
    n.setTyped = function(a) {
      a ? (n.Buf8 = Uint8Array, n.Buf16 = Uint16Array, n.Buf32 = Int32Array, n.assign(n, r)) : (n.Buf8 = Array, n.Buf16 = Array, n.Buf32 = Array, n.assign(n, i));
    }, n.setTyped(e);
  }(qc)), qc;
}
var _s = {}, Gr = {}, Oi = {}, Ov;
function ob() {
  if (Ov) return Oi;
  Ov = 1;
  var n = _i(), e = 4, t = 0, r = 1, i = 2;
  function a(g) {
    for (var T = g.length; --T >= 0; )
      g[T] = 0;
  }
  var u = 0, l = 1, c = 2, _ = 3, m = 258, w = 29, E = 256, k = E + 1 + w, D = 30, K = 19, C = 2 * k + 1, M = 15, J = 16, X = 7, le = 256, ce = 16, fe = 17, ae = 18, ke = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), De = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), Ce = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), $e = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Be = 512, Se = new Array((k + 2) * 2);
  a(Se);
  var Ue = new Array(D * 2);
  a(Ue);
  var at = new Array(Be);
  a(at);
  var vt = new Array(m - _ + 1);
  a(vt);
  var we = new Array(w);
  a(we);
  var He = new Array(D);
  a(He);
  function Ke(g, T, L, ue, B) {
    this.static_tree = g, this.extra_bits = T, this.extra_base = L, this.elems = ue, this.max_length = B, this.has_stree = g && g.length;
  }
  var It, Ve, Xe;
  function Ze(g, T) {
    this.dyn_tree = g, this.max_code = 0, this.stat_desc = T;
  }
  function wt(g) {
    return g < 256 ? at[g] : at[256 + (g >>> 7)];
  }
  function yt(g, T) {
    g.pending_buf[g.pending++] = T & 255, g.pending_buf[g.pending++] = T >>> 8 & 255;
  }
  function We(g, T, L) {
    g.bi_valid > J - L ? (g.bi_buf |= T << g.bi_valid & 65535, yt(g, g.bi_buf), g.bi_buf = T >> J - g.bi_valid, g.bi_valid += L - J) : (g.bi_buf |= T << g.bi_valid & 65535, g.bi_valid += L);
  }
  function lt(g, T, L) {
    We(
      g,
      L[T * 2],
      L[T * 2 + 1]
      /*.Len*/
    );
  }
  function Pe(g, T) {
    var L = 0;
    do
      L |= g & 1, g >>>= 1, L <<= 1;
    while (--T > 0);
    return L >>> 1;
  }
  function he(g) {
    g.bi_valid === 16 ? (yt(g, g.bi_buf), g.bi_buf = 0, g.bi_valid = 0) : g.bi_valid >= 8 && (g.pending_buf[g.pending++] = g.bi_buf & 255, g.bi_buf >>= 8, g.bi_valid -= 8);
  }
  function Fe(g, T) {
    var L = T.dyn_tree, ue = T.max_code, B = T.stat_desc.static_tree, q = T.stat_desc.has_stree, b = T.stat_desc.extra_bits, se = T.stat_desc.extra_base, Ne = T.stat_desc.max_length, f, te, ie, A, F, Z, Oe = 0;
    for (A = 0; A <= M; A++)
      g.bl_count[A] = 0;
    for (L[g.heap[g.heap_max] * 2 + 1] = 0, f = g.heap_max + 1; f < C; f++)
      te = g.heap[f], A = L[L[te * 2 + 1] * 2 + 1] + 1, A > Ne && (A = Ne, Oe++), L[te * 2 + 1] = A, !(te > ue) && (g.bl_count[A]++, F = 0, te >= se && (F = b[te - se]), Z = L[te * 2], g.opt_len += Z * (A + F), q && (g.static_len += Z * (B[te * 2 + 1] + F)));
    if (Oe !== 0) {
      do {
        for (A = Ne - 1; g.bl_count[A] === 0; )
          A--;
        g.bl_count[A]--, g.bl_count[A + 1] += 2, g.bl_count[Ne]--, Oe -= 2;
      } while (Oe > 0);
      for (A = Ne; A !== 0; A--)
        for (te = g.bl_count[A]; te !== 0; )
          ie = g.heap[--f], !(ie > ue) && (L[ie * 2 + 1] !== A && (g.opt_len += (A - L[ie * 2 + 1]) * L[ie * 2], L[ie * 2 + 1] = A), te--);
    }
  }
  function et(g, T, L) {
    var ue = new Array(M + 1), B = 0, q, b;
    for (q = 1; q <= M; q++)
      ue[q] = B = B + L[q - 1] << 1;
    for (b = 0; b <= T; b++) {
      var se = g[b * 2 + 1];
      se !== 0 && (g[b * 2] = Pe(ue[se]++, se));
    }
  }
  function me() {
    var g, T, L, ue, B, q = new Array(M + 1);
    for (L = 0, ue = 0; ue < w - 1; ue++)
      for (we[ue] = L, g = 0; g < 1 << ke[ue]; g++)
        vt[L++] = ue;
    for (vt[L - 1] = ue, B = 0, ue = 0; ue < 16; ue++)
      for (He[ue] = B, g = 0; g < 1 << De[ue]; g++)
        at[B++] = ue;
    for (B >>= 7; ue < D; ue++)
      for (He[ue] = B << 7, g = 0; g < 1 << De[ue] - 7; g++)
        at[256 + B++] = ue;
    for (T = 0; T <= M; T++)
      q[T] = 0;
    for (g = 0; g <= 143; )
      Se[g * 2 + 1] = 8, g++, q[8]++;
    for (; g <= 255; )
      Se[g * 2 + 1] = 9, g++, q[9]++;
    for (; g <= 279; )
      Se[g * 2 + 1] = 7, g++, q[7]++;
    for (; g <= 287; )
      Se[g * 2 + 1] = 8, g++, q[8]++;
    for (et(Se, k + 1, q), g = 0; g < D; g++)
      Ue[g * 2 + 1] = 5, Ue[g * 2] = Pe(g, 5);
    It = new Ke(Se, ke, E + 1, k, M), Ve = new Ke(Ue, De, 0, D, M), Xe = new Ke(new Array(0), Ce, 0, K, X);
  }
  function je(g) {
    var T;
    for (T = 0; T < k; T++)
      g.dyn_ltree[T * 2] = 0;
    for (T = 0; T < D; T++)
      g.dyn_dtree[T * 2] = 0;
    for (T = 0; T < K; T++)
      g.bl_tree[T * 2] = 0;
    g.dyn_ltree[le * 2] = 1, g.opt_len = g.static_len = 0, g.last_lit = g.matches = 0;
  }
  function gt(g) {
    g.bi_valid > 8 ? yt(g, g.bi_buf) : g.bi_valid > 0 && (g.pending_buf[g.pending++] = g.bi_buf), g.bi_buf = 0, g.bi_valid = 0;
  }
  function ht(g, T, L, ue) {
    gt(g), yt(g, L), yt(g, ~L), n.arraySet(g.pending_buf, g.window, T, L, g.pending), g.pending += L;
  }
  function ct(g, T, L, ue) {
    var B = T * 2, q = L * 2;
    return g[B] < g[q] || g[B] === g[q] && ue[T] <= ue[L];
  }
  function st(g, T, L) {
    for (var ue = g.heap[L], B = L << 1; B <= g.heap_len && (B < g.heap_len && ct(T, g.heap[B + 1], g.heap[B], g.depth) && B++, !ct(T, ue, g.heap[B], g.depth)); )
      g.heap[L] = g.heap[B], L = B, B <<= 1;
    g.heap[L] = ue;
  }
  function Le(g, T, L) {
    var ue, B, q = 0, b, se;
    if (g.last_lit !== 0)
      do
        ue = g.pending_buf[g.d_buf + q * 2] << 8 | g.pending_buf[g.d_buf + q * 2 + 1], B = g.pending_buf[g.l_buf + q], q++, ue === 0 ? lt(g, B, T) : (b = vt[B], lt(g, b + E + 1, T), se = ke[b], se !== 0 && (B -= we[b], We(g, B, se)), ue--, b = wt(ue), lt(g, b, L), se = De[b], se !== 0 && (ue -= He[b], We(g, ue, se)));
      while (q < g.last_lit);
    lt(g, le, T);
  }
  function kt(g, T) {
    var L = T.dyn_tree, ue = T.stat_desc.static_tree, B = T.stat_desc.has_stree, q = T.stat_desc.elems, b, se, Ne = -1, f;
    for (g.heap_len = 0, g.heap_max = C, b = 0; b < q; b++)
      L[b * 2] !== 0 ? (g.heap[++g.heap_len] = Ne = b, g.depth[b] = 0) : L[b * 2 + 1] = 0;
    for (; g.heap_len < 2; )
      f = g.heap[++g.heap_len] = Ne < 2 ? ++Ne : 0, L[f * 2] = 1, g.depth[f] = 0, g.opt_len--, B && (g.static_len -= ue[f * 2 + 1]);
    for (T.max_code = Ne, b = g.heap_len >> 1; b >= 1; b--)
      st(g, L, b);
    f = q;
    do
      b = g.heap[
        1
        /*SMALLEST*/
      ], g.heap[
        1
        /*SMALLEST*/
      ] = g.heap[g.heap_len--], st(
        g,
        L,
        1
        /*SMALLEST*/
      ), se = g.heap[
        1
        /*SMALLEST*/
      ], g.heap[--g.heap_max] = b, g.heap[--g.heap_max] = se, L[f * 2] = L[b * 2] + L[se * 2], g.depth[f] = (g.depth[b] >= g.depth[se] ? g.depth[b] : g.depth[se]) + 1, L[b * 2 + 1] = L[se * 2 + 1] = f, g.heap[
        1
        /*SMALLEST*/
      ] = f++, st(
        g,
        L,
        1
        /*SMALLEST*/
      );
    while (g.heap_len >= 2);
    g.heap[--g.heap_max] = g.heap[
      1
      /*SMALLEST*/
    ], Fe(g, T), et(L, Ne, g.bl_count);
  }
  function Ot(g, T, L) {
    var ue, B = -1, q, b = T[0 * 2 + 1], se = 0, Ne = 7, f = 4;
    for (b === 0 && (Ne = 138, f = 3), T[(L + 1) * 2 + 1] = 65535, ue = 0; ue <= L; ue++)
      q = b, b = T[(ue + 1) * 2 + 1], !(++se < Ne && q === b) && (se < f ? g.bl_tree[q * 2] += se : q !== 0 ? (q !== B && g.bl_tree[q * 2]++, g.bl_tree[ce * 2]++) : se <= 10 ? g.bl_tree[fe * 2]++ : g.bl_tree[ae * 2]++, se = 0, B = q, b === 0 ? (Ne = 138, f = 3) : q === b ? (Ne = 6, f = 3) : (Ne = 7, f = 4));
  }
  function qe(g, T, L) {
    var ue, B = -1, q, b = T[0 * 2 + 1], se = 0, Ne = 7, f = 4;
    for (b === 0 && (Ne = 138, f = 3), ue = 0; ue <= L; ue++)
      if (q = b, b = T[(ue + 1) * 2 + 1], !(++se < Ne && q === b)) {
        if (se < f)
          do
            lt(g, q, g.bl_tree);
          while (--se !== 0);
        else q !== 0 ? (q !== B && (lt(g, q, g.bl_tree), se--), lt(g, ce, g.bl_tree), We(g, se - 3, 2)) : se <= 10 ? (lt(g, fe, g.bl_tree), We(g, se - 3, 3)) : (lt(g, ae, g.bl_tree), We(g, se - 11, 7));
        se = 0, B = q, b === 0 ? (Ne = 138, f = 3) : q === b ? (Ne = 6, f = 3) : (Ne = 7, f = 4);
      }
  }
  function Qe(g) {
    var T;
    for (Ot(g, g.dyn_ltree, g.l_desc.max_code), Ot(g, g.dyn_dtree, g.d_desc.max_code), kt(g, g.bl_desc), T = K - 1; T >= 3 && g.bl_tree[$e[T] * 2 + 1] === 0; T--)
      ;
    return g.opt_len += 3 * (T + 1) + 5 + 5 + 4, T;
  }
  function Et(g, T, L, ue) {
    var B;
    for (We(g, T - 257, 5), We(g, L - 1, 5), We(g, ue - 4, 4), B = 0; B < ue; B++)
      We(g, g.bl_tree[$e[B] * 2 + 1], 3);
    qe(g, g.dyn_ltree, T - 1), qe(g, g.dyn_dtree, L - 1);
  }
  function Ft(g) {
    var T = 4093624447, L;
    for (L = 0; L <= 31; L++, T >>>= 1)
      if (T & 1 && g.dyn_ltree[L * 2] !== 0)
        return t;
    if (g.dyn_ltree[9 * 2] !== 0 || g.dyn_ltree[10 * 2] !== 0 || g.dyn_ltree[13 * 2] !== 0)
      return r;
    for (L = 32; L < E; L++)
      if (g.dyn_ltree[L * 2] !== 0)
        return r;
    return t;
  }
  var _t = !1;
  function Zt(g) {
    _t || (me(), _t = !0), g.l_desc = new Ze(g.dyn_ltree, It), g.d_desc = new Ze(g.dyn_dtree, Ve), g.bl_desc = new Ze(g.bl_tree, Xe), g.bi_buf = 0, g.bi_valid = 0, je(g);
  }
  function S(g, T, L, ue) {
    We(g, (u << 1) + (ue ? 1 : 0), 3), ht(g, T, L);
  }
  function d(g) {
    We(g, l << 1, 3), lt(g, le, Se), he(g);
  }
  function v(g, T, L, ue) {
    var B, q, b = 0;
    g.level > 0 ? (g.strm.data_type === i && (g.strm.data_type = Ft(g)), kt(g, g.l_desc), kt(g, g.d_desc), b = Qe(g), B = g.opt_len + 3 + 7 >>> 3, q = g.static_len + 3 + 7 >>> 3, q <= B && (B = q)) : B = q = L + 5, L + 4 <= B && T !== -1 ? S(g, T, L, ue) : g.strategy === e || q === B ? (We(g, (l << 1) + (ue ? 1 : 0), 3), Le(g, Se, Ue)) : (We(g, (c << 1) + (ue ? 1 : 0), 3), Et(g, g.l_desc.max_code + 1, g.d_desc.max_code + 1, b + 1), Le(g, g.dyn_ltree, g.dyn_dtree)), je(g), ue && gt(g);
  }
  function R(g, T, L) {
    return g.pending_buf[g.d_buf + g.last_lit * 2] = T >>> 8 & 255, g.pending_buf[g.d_buf + g.last_lit * 2 + 1] = T & 255, g.pending_buf[g.l_buf + g.last_lit] = L & 255, g.last_lit++, T === 0 ? g.dyn_ltree[L * 2]++ : (g.matches++, T--, g.dyn_ltree[(vt[L] + E + 1) * 2]++, g.dyn_dtree[wt(T) * 2]++), g.last_lit === g.lit_bufsize - 1;
  }
  return Oi._tr_init = Zt, Oi._tr_stored_block = S, Oi._tr_flush_block = v, Oi._tr_tally = R, Oi._tr_align = d, Oi;
}
var Mc, Rv;
function Cy() {
  if (Rv) return Mc;
  Rv = 1;
  function n(e, t, r, i) {
    for (var a = e & 65535 | 0, u = e >>> 16 & 65535 | 0, l = 0; r !== 0; ) {
      l = r > 2e3 ? 2e3 : r, r -= l;
      do
        a = a + t[i++] | 0, u = u + a | 0;
      while (--l);
      a %= 65521, u %= 65521;
    }
    return a | u << 16 | 0;
  }
  return Mc = n, Mc;
}
var Uc, Tv;
function Ny() {
  if (Tv) return Uc;
  Tv = 1;
  function n() {
    for (var r, i = [], a = 0; a < 256; a++) {
      r = a;
      for (var u = 0; u < 8; u++)
        r = r & 1 ? 3988292384 ^ r >>> 1 : r >>> 1;
      i[a] = r;
    }
    return i;
  }
  var e = n();
  function t(r, i, a, u) {
    var l = e, c = u + a;
    r ^= -1;
    for (var _ = u; _ < c; _++)
      r = r >>> 8 ^ l[(r ^ i[_]) & 255];
    return r ^ -1;
  }
  return Uc = t, Uc;
}
var $c, Cv;
function th() {
  return Cv || (Cv = 1, $c = {
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
  }), $c;
}
var Nv;
function ub() {
  if (Nv) return Gr;
  Nv = 1;
  var n = _i(), e = ob(), t = Cy(), r = Ny(), i = th(), a = 0, u = 1, l = 3, c = 4, _ = 5, m = 0, w = 1, E = -2, k = -3, D = -5, K = -1, C = 1, M = 2, J = 3, X = 4, le = 0, ce = 2, fe = 8, ae = 9, ke = 15, De = 8, Ce = 29, $e = 256, Be = $e + 1 + Ce, Se = 30, Ue = 19, at = 2 * Be + 1, vt = 15, we = 3, He = 258, Ke = He + we + 1, It = 32, Ve = 42, Xe = 69, Ze = 73, wt = 91, yt = 103, We = 113, lt = 666, Pe = 1, he = 2, Fe = 3, et = 4, me = 3;
  function je(f, te) {
    return f.msg = i[te], te;
  }
  function gt(f) {
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
    var ie = f.max_chain_length, A = f.strstart, F, Z, Oe = f.prev_length, Ee = f.nice_match, xe = f.strstart > f.w_size - Ke ? f.strstart - (f.w_size - Ke) : 0, Je = f.window, Tr = f.w_mask, bt = f.prev, Te = f.strstart + He, tt = Je[A + Oe - 1], Ut = Je[A + Oe];
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
    while ((te = bt[te & Tr]) > xe && --ie !== 0);
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
        if (Qe(f), f.lookahead === 0 && te === a)
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
        if (Qe(f), f.lookahead < Ke && te === a)
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
        if (Qe(f), f.lookahead < Ke && te === a)
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
  function Zt(f, te) {
    for (var ie, A, F, Z, Oe = f.window; ; ) {
      if (f.lookahead <= He) {
        if (Qe(f), f.lookahead <= He && te === a)
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
        if (te === a)
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
  function g() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = fe, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(at * 2), this.dyn_dtree = new n.Buf16((2 * Se + 1) * 2), this.bl_tree = new n.Buf16((2 * Ue + 1) * 2), ht(this.dyn_ltree), ht(this.dyn_dtree), ht(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16(vt + 1), this.heap = new n.Buf16(2 * Be + 1), ht(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(2 * Be + 1), ht(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function T(f) {
    var te;
    return !f || !f.state ? je(f, E) : (f.total_in = f.total_out = 0, f.data_type = ce, te = f.state, te.pending = 0, te.pending_out = 0, te.wrap < 0 && (te.wrap = -te.wrap), te.status = te.wrap ? Ve : We, f.adler = te.wrap === 2 ? 0 : 1, te.last_flush = a, e._tr_init(te), m);
  }
  function L(f) {
    var te = T(f);
    return te === m && R(f.state), te;
  }
  function ue(f, te) {
    return !f || !f.state || f.state.wrap !== 2 ? E : (f.state.gzhead = te, m);
  }
  function B(f, te, ie, A, F, Z) {
    if (!f)
      return E;
    var Oe = 1;
    if (te === K && (te = 6), A < 0 ? (Oe = 0, A = -A) : A > 15 && (Oe = 2, A -= 16), F < 1 || F > ae || ie !== fe || A < 8 || A > 15 || te < 0 || te > 9 || Z < 0 || Z > X)
      return je(f, E);
    A === 8 && (A = 9);
    var Ee = new g();
    return f.state = Ee, Ee.strm = f, Ee.wrap = Oe, Ee.gzhead = null, Ee.w_bits = A, Ee.w_size = 1 << Ee.w_bits, Ee.w_mask = Ee.w_size - 1, Ee.hash_bits = F + 7, Ee.hash_size = 1 << Ee.hash_bits, Ee.hash_mask = Ee.hash_size - 1, Ee.hash_shift = ~~((Ee.hash_bits + we - 1) / we), Ee.window = new n.Buf8(Ee.w_size * 2), Ee.head = new n.Buf16(Ee.hash_size), Ee.prev = new n.Buf16(Ee.w_size), Ee.lit_bufsize = 1 << F + 6, Ee.pending_buf_size = Ee.lit_bufsize * 4, Ee.pending_buf = new n.Buf8(Ee.pending_buf_size), Ee.d_buf = 1 * Ee.lit_bufsize, Ee.l_buf = 3 * Ee.lit_bufsize, Ee.level = te, Ee.strategy = Z, Ee.method = ie, L(f);
  }
  function q(f, te) {
    return B(f, te, fe, ke, De, le);
  }
  function b(f, te) {
    var ie, A, F, Z;
    if (!f || !f.state || te > _ || te < 0)
      return f ? je(f, E) : E;
    if (A = f.state, !f.output || !f.input && f.avail_in !== 0 || A.status === lt && te !== c)
      return je(f, f.avail_out === 0 ? D : E);
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
        A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), Z === 0 && (A.status = yt);
      } else
        A.status = yt;
    if (A.status === yt && (A.gzhead.hcrc ? (A.pending + 2 > A.pending_buf_size && ct(f), A.pending + 2 <= A.pending_buf_size && (Le(A, f.adler & 255), Le(A, f.adler >> 8 & 255), f.adler = 0, A.status = We)) : A.status = We), A.pending !== 0) {
      if (ct(f), f.avail_out === 0)
        return A.last_flush = -1, m;
    } else if (f.avail_in === 0 && gt(te) <= gt(ie) && te !== c)
      return je(f, D);
    if (A.status === lt && f.avail_in !== 0)
      return je(f, D);
    if (f.avail_in !== 0 || A.lookahead !== 0 || te !== a && A.status !== lt) {
      var xe = A.strategy === M ? S(A, te) : A.strategy === J ? Zt(A, te) : v[A.level].func(A, te);
      if ((xe === Fe || xe === et) && (A.status = lt), xe === Pe || xe === Fe)
        return f.avail_out === 0 && (A.last_flush = -1), m;
      if (xe === he && (te === u ? e._tr_align(A) : te !== _ && (e._tr_stored_block(A, 0, 0, !1), te === l && (ht(A.head), A.lookahead === 0 && (A.strstart = 0, A.block_start = 0, A.insert = 0))), ct(f), f.avail_out === 0))
        return A.last_flush = -1, m;
    }
    return te !== c ? m : A.wrap <= 0 ? w : (A.wrap === 2 ? (Le(A, f.adler & 255), Le(A, f.adler >> 8 & 255), Le(A, f.adler >> 16 & 255), Le(A, f.adler >> 24 & 255), Le(A, f.total_in & 255), Le(A, f.total_in >> 8 & 255), Le(A, f.total_in >> 16 & 255), Le(A, f.total_in >> 24 & 255)) : (kt(A, f.adler >>> 16), kt(A, f.adler & 65535)), ct(f), A.wrap > 0 && (A.wrap = -A.wrap), A.pending !== 0 ? m : w);
  }
  function se(f) {
    var te;
    return !f || !f.state ? E : (te = f.state.status, te !== Ve && te !== Xe && te !== Ze && te !== wt && te !== yt && te !== We && te !== lt ? je(f, E) : (f.state = null, te === We ? je(f, k) : m));
  }
  function Ne(f, te) {
    var ie = te.length, A, F, Z, Oe, Ee, xe, Je, Tr;
    if (!f || !f.state || (A = f.state, Oe = A.wrap, Oe === 2 || Oe === 1 && A.status !== Ve || A.lookahead))
      return E;
    for (Oe === 1 && (f.adler = t(f.adler, te, ie, 0)), A.wrap = 0, ie >= A.w_size && (Oe === 0 && (ht(A.head), A.strstart = 0, A.block_start = 0, A.insert = 0), Tr = new n.Buf8(A.w_size), n.arraySet(Tr, te, ie - A.w_size, A.w_size, 0), te = Tr, ie = A.w_size), Ee = f.avail_in, xe = f.next_in, Je = f.input, f.avail_in = ie, f.next_in = 0, f.input = te, Qe(A); A.lookahead >= we; ) {
      F = A.strstart, Z = A.lookahead - (we - 1);
      do
        A.ins_h = (A.ins_h << A.hash_shift ^ A.window[F + we - 1]) & A.hash_mask, A.prev[F & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = F, F++;
      while (--Z);
      A.strstart = F, A.lookahead = we - 1, Qe(A);
    }
    return A.strstart += A.lookahead, A.block_start = A.strstart, A.insert = A.lookahead, A.lookahead = 0, A.match_length = A.prev_length = we - 1, A.match_available = 0, f.next_in = xe, f.input = Je, f.avail_in = Ee, A.wrap = Oe, m;
  }
  return Gr.deflateInit = q, Gr.deflateInit2 = B, Gr.deflateReset = L, Gr.deflateResetKeep = T, Gr.deflateSetHeader = ue, Gr.deflate = b, Gr.deflateEnd = se, Gr.deflateSetDictionary = Ne, Gr.deflateInfo = "pako deflate (from Nodeca project)", Gr;
}
var Ri = {}, Pv;
function Py() {
  if (Pv) return Ri;
  Pv = 1;
  var n = _i(), e = !0, t = !0;
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
  r[254] = r[254] = 1, Ri.string2buf = function(u) {
    var l, c, _, m, w, E = u.length, k = 0;
    for (m = 0; m < E; m++)
      c = u.charCodeAt(m), (c & 64512) === 55296 && m + 1 < E && (_ = u.charCodeAt(m + 1), (_ & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (_ - 56320), m++)), k += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    for (l = new n.Buf8(k), w = 0, m = 0; w < k; m++)
      c = u.charCodeAt(m), (c & 64512) === 55296 && m + 1 < E && (_ = u.charCodeAt(m + 1), (_ & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (_ - 56320), m++)), c < 128 ? l[w++] = c : c < 2048 ? (l[w++] = 192 | c >>> 6, l[w++] = 128 | c & 63) : c < 65536 ? (l[w++] = 224 | c >>> 12, l[w++] = 128 | c >>> 6 & 63, l[w++] = 128 | c & 63) : (l[w++] = 240 | c >>> 18, l[w++] = 128 | c >>> 12 & 63, l[w++] = 128 | c >>> 6 & 63, l[w++] = 128 | c & 63);
    return l;
  };
  function a(u, l) {
    if (l < 65534 && (u.subarray && t || !u.subarray && e))
      return String.fromCharCode.apply(null, n.shrinkBuf(u, l));
    for (var c = "", _ = 0; _ < l; _++)
      c += String.fromCharCode(u[_]);
    return c;
  }
  return Ri.buf2binstring = function(u) {
    return a(u, u.length);
  }, Ri.binstring2buf = function(u) {
    for (var l = new n.Buf8(u.length), c = 0, _ = l.length; c < _; c++)
      l[c] = u.charCodeAt(c);
    return l;
  }, Ri.buf2string = function(u, l) {
    var c, _, m, w, E = l || u.length, k = new Array(E * 2);
    for (_ = 0, c = 0; c < E; ) {
      if (m = u[c++], m < 128) {
        k[_++] = m;
        continue;
      }
      if (w = r[m], w > 4) {
        k[_++] = 65533, c += w - 1;
        continue;
      }
      for (m &= w === 2 ? 31 : w === 3 ? 15 : 7; w > 1 && c < E; )
        m = m << 6 | u[c++] & 63, w--;
      if (w > 1) {
        k[_++] = 65533;
        continue;
      }
      m < 65536 ? k[_++] = m : (m -= 65536, k[_++] = 55296 | m >> 10 & 1023, k[_++] = 56320 | m & 1023);
    }
    return a(k, _);
  }, Ri.utf8border = function(u, l) {
    var c;
    for (l = l || u.length, l > u.length && (l = u.length), c = l - 1; c >= 0 && (u[c] & 192) === 128; )
      c--;
    return c < 0 || c === 0 ? l : c + r[u[c]] > l ? c : l;
  }, Ri;
}
var jc, Dv;
function Dy() {
  if (Dv) return jc;
  Dv = 1;
  function n() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
  return jc = n, jc;
}
var Bv;
function lb() {
  if (Bv) return _s;
  Bv = 1;
  var n = ub(), e = _i(), t = Py(), r = th(), i = Dy(), a = Object.prototype.toString, u = 0, l = 4, c = 0, _ = 1, m = 2, w = -1, E = 0, k = 8;
  function D(J) {
    if (!(this instanceof D)) return new D(J);
    this.options = e.assign({
      level: w,
      method: k,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: E,
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
      if (typeof X.dictionary == "string" ? ce = t.string2buf(X.dictionary) : a.call(X.dictionary) === "[object ArrayBuffer]" ? ce = new Uint8Array(X.dictionary) : ce = X.dictionary, le = n.deflateSetDictionary(this.strm, ce), le !== c)
        throw new Error(r[le]);
      this._dict_set = !0;
    }
  }
  D.prototype.push = function(J, X) {
    var le = this.strm, ce = this.options.chunkSize, fe, ae;
    if (this.ended)
      return !1;
    ae = X === ~~X ? X : X === !0 ? l : u, typeof J == "string" ? le.input = t.string2buf(J) : a.call(J) === "[object ArrayBuffer]" ? le.input = new Uint8Array(J) : le.input = J, le.next_in = 0, le.avail_in = le.input.length;
    do {
      if (le.avail_out === 0 && (le.output = new e.Buf8(ce), le.next_out = 0, le.avail_out = ce), fe = n.deflate(le, ae), fe !== _ && fe !== c)
        return this.onEnd(fe), this.ended = !0, !1;
      (le.avail_out === 0 || le.avail_in === 0 && (ae === l || ae === m)) && (this.options.to === "string" ? this.onData(t.buf2binstring(e.shrinkBuf(le.output, le.next_out))) : this.onData(e.shrinkBuf(le.output, le.next_out)));
    } while ((le.avail_in > 0 || le.avail_out === 0) && fe !== _);
    return ae === l ? (fe = n.deflateEnd(this.strm), this.onEnd(fe), this.ended = !0, fe === c) : (ae === m && (this.onEnd(c), le.avail_out = 0), !0);
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
  return _s.Deflate = D, _s.deflate = K, _s.deflateRaw = C, _s.gzip = M, _s;
}
var ws = {}, Mr = {}, Kc, Fv;
function cb() {
  if (Fv) return Kc;
  Fv = 1;
  var n = 30, e = 12;
  return Kc = function(r, i) {
    var a, u, l, c, _, m, w, E, k, D, K, C, M, J, X, le, ce, fe, ae, ke, De, Ce, $e, Be, Se;
    a = r.state, u = r.next_in, Be = r.input, l = u + (r.avail_in - 5), c = r.next_out, Se = r.output, _ = c - (i - r.avail_out), m = c + (r.avail_out - 257), w = a.dmax, E = a.wsize, k = a.whave, D = a.wnext, K = a.window, C = a.hold, M = a.bits, J = a.lencode, X = a.distcode, le = (1 << a.lenbits) - 1, ce = (1 << a.distbits) - 1;
    e:
      do {
        M < 15 && (C += Be[u++] << M, M += 8, C += Be[u++] << M, M += 8), fe = J[C & le];
        t:
          for (; ; ) {
            if (ae = fe >>> 24, C >>>= ae, M -= ae, ae = fe >>> 16 & 255, ae === 0)
              Se[c++] = fe & 65535;
            else if (ae & 16) {
              ke = fe & 65535, ae &= 15, ae && (M < ae && (C += Be[u++] << M, M += 8), ke += C & (1 << ae) - 1, C >>>= ae, M -= ae), M < 15 && (C += Be[u++] << M, M += 8, C += Be[u++] << M, M += 8), fe = X[C & ce];
              r:
                for (; ; ) {
                  if (ae = fe >>> 24, C >>>= ae, M -= ae, ae = fe >>> 16 & 255, ae & 16) {
                    if (De = fe & 65535, ae &= 15, M < ae && (C += Be[u++] << M, M += 8, M < ae && (C += Be[u++] << M, M += 8)), De += C & (1 << ae) - 1, De > w) {
                      r.msg = "invalid distance too far back", a.mode = n;
                      break e;
                    }
                    if (C >>>= ae, M -= ae, ae = c - _, De > ae) {
                      if (ae = De - ae, ae > k && a.sane) {
                        r.msg = "invalid distance too far back", a.mode = n;
                        break e;
                      }
                      if (Ce = 0, $e = K, D === 0) {
                        if (Ce += E - ae, ae < ke) {
                          ke -= ae;
                          do
                            Se[c++] = K[Ce++];
                          while (--ae);
                          Ce = c - De, $e = Se;
                        }
                      } else if (D < ae) {
                        if (Ce += E + D - ae, ae -= D, ae < ke) {
                          ke -= ae;
                          do
                            Se[c++] = K[Ce++];
                          while (--ae);
                          if (Ce = 0, D < ke) {
                            ae = D, ke -= ae;
                            do
                              Se[c++] = K[Ce++];
                            while (--ae);
                            Ce = c - De, $e = Se;
                          }
                        }
                      } else if (Ce += D - ae, ae < ke) {
                        ke -= ae;
                        do
                          Se[c++] = K[Ce++];
                        while (--ae);
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
                  } else if ((ae & 64) === 0) {
                    fe = X[(fe & 65535) + (C & (1 << ae) - 1)];
                    continue r;
                  } else {
                    r.msg = "invalid distance code", a.mode = n;
                    break e;
                  }
                  break;
                }
            } else if ((ae & 64) === 0) {
              fe = J[(fe & 65535) + (C & (1 << ae) - 1)];
              continue t;
            } else if (ae & 32) {
              a.mode = e;
              break e;
            } else {
              r.msg = "invalid literal/length code", a.mode = n;
              break e;
            }
            break;
          }
      } while (u < l && c < m);
    ke = M >> 3, u -= ke, M -= ke << 3, C &= (1 << M) - 1, r.next_in = u, r.next_out = c, r.avail_in = u < l ? 5 + (l - u) : 5 - (u - l), r.avail_out = c < m ? 257 + (m - c) : 257 - (c - m), a.hold = C, a.bits = M;
  }, Kc;
}
var zc, Lv;
function fb() {
  if (Lv) return zc;
  Lv = 1;
  var n = _i(), e = 15, t = 852, r = 592, i = 0, a = 1, u = 2, l = [
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
  ], _ = [
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
  return zc = function(E, k, D, K, C, M, J, X) {
    var le = X.bits, ce = 0, fe = 0, ae = 0, ke = 0, De = 0, Ce = 0, $e = 0, Be = 0, Se = 0, Ue = 0, at, vt, we, He, Ke, It = null, Ve = 0, Xe, Ze = new n.Buf16(e + 1), wt = new n.Buf16(e + 1), yt = null, We = 0, lt, Pe, he;
    for (ce = 0; ce <= e; ce++)
      Ze[ce] = 0;
    for (fe = 0; fe < K; fe++)
      Ze[k[D + fe]]++;
    for (De = le, ke = e; ke >= 1 && Ze[ke] === 0; ke--)
      ;
    if (De > ke && (De = ke), ke === 0)
      return C[M++] = 1 << 24 | 64 << 16 | 0, C[M++] = 1 << 24 | 64 << 16 | 0, X.bits = 1, 0;
    for (ae = 1; ae < ke && Ze[ae] === 0; ae++)
      ;
    for (De < ae && (De = ae), Be = 1, ce = 1; ce <= e; ce++)
      if (Be <<= 1, Be -= Ze[ce], Be < 0)
        return -1;
    if (Be > 0 && (E === i || ke !== 1))
      return -1;
    for (wt[1] = 0, ce = 1; ce < e; ce++)
      wt[ce + 1] = wt[ce] + Ze[ce];
    for (fe = 0; fe < K; fe++)
      k[D + fe] !== 0 && (J[wt[k[D + fe]]++] = fe);
    if (E === i ? (It = yt = J, Xe = 19) : E === a ? (It = l, Ve -= 257, yt = c, We -= 257, Xe = 256) : (It = _, yt = m, Xe = -1), Ue = 0, fe = 0, ce = ae, Ke = M, Ce = De, $e = 0, we = -1, Se = 1 << De, He = Se - 1, E === a && Se > t || E === u && Se > r)
      return 1;
    for (; ; ) {
      lt = ce - $e, J[fe] < Xe ? (Pe = 0, he = J[fe]) : J[fe] > Xe ? (Pe = yt[We + J[fe]], he = It[Ve + J[fe]]) : (Pe = 96, he = 0), at = 1 << ce - $e, vt = 1 << Ce, ae = vt;
      do
        vt -= at, C[Ke + (Ue >> $e) + vt] = lt << 24 | Pe << 16 | he | 0;
      while (vt !== 0);
      for (at = 1 << ce - 1; Ue & at; )
        at >>= 1;
      if (at !== 0 ? (Ue &= at - 1, Ue += at) : Ue = 0, fe++, --Ze[ce] === 0) {
        if (ce === ke)
          break;
        ce = k[D + J[fe]];
      }
      if (ce > De && (Ue & He) !== we) {
        for ($e === 0 && ($e = De), Ke += ae, Ce = ce - $e, Be = 1 << Ce; Ce + $e < ke && (Be -= Ze[Ce + $e], !(Be <= 0)); )
          Ce++, Be <<= 1;
        if (Se += 1 << Ce, E === a && Se > t || E === u && Se > r)
          return 1;
        we = Ue & He, C[we] = De << 24 | Ce << 16 | Ke - M | 0;
      }
    }
    return Ue !== 0 && (C[Ke + Ue] = ce - $e << 24 | 64 << 16 | 0), X.bits = De, 0;
  }, zc;
}
var qv;
function hb() {
  if (qv) return Mr;
  qv = 1;
  var n = _i(), e = Cy(), t = Ny(), r = cb(), i = fb(), a = 0, u = 1, l = 2, c = 4, _ = 5, m = 6, w = 0, E = 1, k = 2, D = -2, K = -3, C = -4, M = -5, J = 8, X = 1, le = 2, ce = 3, fe = 4, ae = 5, ke = 6, De = 7, Ce = 8, $e = 9, Be = 10, Se = 11, Ue = 12, at = 13, vt = 14, we = 15, He = 16, Ke = 17, It = 18, Ve = 19, Xe = 20, Ze = 21, wt = 22, yt = 23, We = 24, lt = 25, Pe = 26, he = 27, Fe = 28, et = 29, me = 30, je = 31, gt = 32, ht = 852, ct = 592, st = 15, Le = st;
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
    var b, se;
    return !B || !B.state || (se = B.state, q < 0 ? (b = 0, q = -q) : (b = (q >> 4) + 1, q < 48 && (q &= 15)), q && (q < 8 || q > 15)) ? D : (se.window !== null && se.wbits !== q && (se.window = null), se.wrap = b, se.wbits = q, Qe(B));
  }
  function Ft(B, q) {
    var b, se;
    return B ? (se = new Ot(), B.state = se, se.window = null, b = Et(B, q), b !== w && (B.state = null), b) : D;
  }
  function _t(B) {
    return Ft(B, Le);
  }
  var Zt = !0, S, d;
  function v(B) {
    if (Zt) {
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
      i(l, B.lens, 0, 32, d, 0, B.work, { bits: 5 }), Zt = !1;
    }
    B.lencode = S, B.lenbits = 9, B.distcode = d, B.distbits = 5;
  }
  function R(B, q, b, se) {
    var Ne, f = B.state;
    return f.window === null && (f.wsize = 1 << f.wbits, f.wnext = 0, f.whave = 0, f.window = new n.Buf8(f.wsize)), se >= f.wsize ? (n.arraySet(f.window, q, b - f.wsize, f.wsize, 0), f.wnext = 0, f.whave = f.wsize) : (Ne = f.wsize - f.wnext, Ne > se && (Ne = se), n.arraySet(f.window, q, b - se, Ne, f.wnext), se -= Ne, se ? (n.arraySet(f.window, q, b - se, se, 0), f.wnext = se, f.whave = f.wsize) : (f.wnext += Ne, f.wnext === f.wsize && (f.wnext = 0), f.whave < f.wsize && (f.whave += Ne))), 0;
  }
  function g(B, q) {
    var b, se, Ne, f, te, ie, A, F, Z, Oe, Ee, xe, Je, Tr, bt = 0, Te, tt, Ut, qt, yn, gn, Rt, Nt, St = new n.Buf8(4), $t, cr, Za = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!B || !B.state || !B.output || !B.input && B.avail_in !== 0)
      return D;
    b = B.state, b.mode === Ue && (b.mode = at), te = B.next_out, Ne = B.output, A = B.avail_out, f = B.next_in, se = B.input, ie = B.avail_in, F = b.hold, Z = b.bits, Oe = ie, Ee = A, Nt = w;
    e:
      for (; ; )
        switch (b.mode) {
          case X:
            if (b.wrap === 0) {
              b.mode = at;
              break;
            }
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (b.wrap & 2 && F === 35615) {
              b.check = 0, St[0] = F & 255, St[1] = F >>> 8 & 255, b.check = t(b.check, St, 2, 0), F = 0, Z = 0, b.mode = le;
              break;
            }
            if (b.flags = 0, b.head && (b.head.done = !1), !(b.wrap & 1) || /* check if zlib header allowed */
            (((F & 255) << 8) + (F >> 8)) % 31) {
              B.msg = "incorrect header check", b.mode = me;
              break;
            }
            if ((F & 15) !== J) {
              B.msg = "unknown compression method", b.mode = me;
              break;
            }
            if (F >>>= 4, Z -= 4, Rt = (F & 15) + 8, b.wbits === 0)
              b.wbits = Rt;
            else if (Rt > b.wbits) {
              B.msg = "invalid window size", b.mode = me;
              break;
            }
            b.dmax = 1 << Rt, B.adler = b.check = 1, b.mode = F & 512 ? Be : Ue, F = 0, Z = 0;
            break;
          case le:
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (b.flags = F, (b.flags & 255) !== J) {
              B.msg = "unknown compression method", b.mode = me;
              break;
            }
            if (b.flags & 57344) {
              B.msg = "unknown header flags set", b.mode = me;
              break;
            }
            b.head && (b.head.text = F >> 8 & 1), b.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, b.check = t(b.check, St, 2, 0)), F = 0, Z = 0, b.mode = ce;
          /* falls through */
          case ce:
            for (; Z < 32; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            b.head && (b.head.time = F), b.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, St[2] = F >>> 16 & 255, St[3] = F >>> 24 & 255, b.check = t(b.check, St, 4, 0)), F = 0, Z = 0, b.mode = fe;
          /* falls through */
          case fe:
            for (; Z < 16; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            b.head && (b.head.xflags = F & 255, b.head.os = F >> 8), b.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, b.check = t(b.check, St, 2, 0)), F = 0, Z = 0, b.mode = ae;
          /* falls through */
          case ae:
            if (b.flags & 1024) {
              for (; Z < 16; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              b.length = F, b.head && (b.head.extra_len = F), b.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, b.check = t(b.check, St, 2, 0)), F = 0, Z = 0;
            } else b.head && (b.head.extra = null);
            b.mode = ke;
          /* falls through */
          case ke:
            if (b.flags & 1024 && (xe = b.length, xe > ie && (xe = ie), xe && (b.head && (Rt = b.head.extra_len - b.length, b.head.extra || (b.head.extra = new Array(b.head.extra_len)), n.arraySet(
              b.head.extra,
              se,
              f,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              xe,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Rt
            )), b.flags & 512 && (b.check = t(b.check, se, xe, f)), ie -= xe, f += xe, b.length -= xe), b.length))
              break e;
            b.length = 0, b.mode = De;
          /* falls through */
          case De:
            if (b.flags & 2048) {
              if (ie === 0)
                break e;
              xe = 0;
              do
                Rt = se[f + xe++], b.head && Rt && b.length < 65536 && (b.head.name += String.fromCharCode(Rt));
              while (Rt && xe < ie);
              if (b.flags & 512 && (b.check = t(b.check, se, xe, f)), ie -= xe, f += xe, Rt)
                break e;
            } else b.head && (b.head.name = null);
            b.length = 0, b.mode = Ce;
          /* falls through */
          case Ce:
            if (b.flags & 4096) {
              if (ie === 0)
                break e;
              xe = 0;
              do
                Rt = se[f + xe++], b.head && Rt && b.length < 65536 && (b.head.comment += String.fromCharCode(Rt));
              while (Rt && xe < ie);
              if (b.flags & 512 && (b.check = t(b.check, se, xe, f)), ie -= xe, f += xe, Rt)
                break e;
            } else b.head && (b.head.comment = null);
            b.mode = $e;
          /* falls through */
          case $e:
            if (b.flags & 512) {
              for (; Z < 16; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if (F !== (b.check & 65535)) {
                B.msg = "header crc mismatch", b.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            b.head && (b.head.hcrc = b.flags >> 9 & 1, b.head.done = !0), B.adler = b.check = 0, b.mode = Ue;
            break;
          case Be:
            for (; Z < 32; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            B.adler = b.check = kt(F), F = 0, Z = 0, b.mode = Se;
          /* falls through */
          case Se:
            if (b.havedict === 0)
              return B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, b.hold = F, b.bits = Z, k;
            B.adler = b.check = 1, b.mode = Ue;
          /* falls through */
          case Ue:
            if (q === _ || q === m)
              break e;
          /* falls through */
          case at:
            if (b.last) {
              F >>>= Z & 7, Z -= Z & 7, b.mode = he;
              break;
            }
            for (; Z < 3; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            switch (b.last = F & 1, F >>>= 1, Z -= 1, F & 3) {
              case 0:
                b.mode = vt;
                break;
              case 1:
                if (v(b), b.mode = Xe, q === m) {
                  F >>>= 2, Z -= 2;
                  break e;
                }
                break;
              case 2:
                b.mode = Ke;
                break;
              case 3:
                B.msg = "invalid block type", b.mode = me;
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
              B.msg = "invalid stored block lengths", b.mode = me;
              break;
            }
            if (b.length = F & 65535, F = 0, Z = 0, b.mode = we, q === m)
              break e;
          /* falls through */
          case we:
            b.mode = He;
          /* falls through */
          case He:
            if (xe = b.length, xe) {
              if (xe > ie && (xe = ie), xe > A && (xe = A), xe === 0)
                break e;
              n.arraySet(Ne, se, f, xe, te), ie -= xe, f += xe, A -= xe, te += xe, b.length -= xe;
              break;
            }
            b.mode = Ue;
            break;
          case Ke:
            for (; Z < 14; ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (b.nlen = (F & 31) + 257, F >>>= 5, Z -= 5, b.ndist = (F & 31) + 1, F >>>= 5, Z -= 5, b.ncode = (F & 15) + 4, F >>>= 4, Z -= 4, b.nlen > 286 || b.ndist > 30) {
              B.msg = "too many length or distance symbols", b.mode = me;
              break;
            }
            b.have = 0, b.mode = It;
          /* falls through */
          case It:
            for (; b.have < b.ncode; ) {
              for (; Z < 3; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              b.lens[Za[b.have++]] = F & 7, F >>>= 3, Z -= 3;
            }
            for (; b.have < 19; )
              b.lens[Za[b.have++]] = 0;
            if (b.lencode = b.lendyn, b.lenbits = 7, $t = { bits: b.lenbits }, Nt = i(a, b.lens, 0, 19, b.lencode, 0, b.work, $t), b.lenbits = $t.bits, Nt) {
              B.msg = "invalid code lengths set", b.mode = me;
              break;
            }
            b.have = 0, b.mode = Ve;
          /* falls through */
          case Ve:
            for (; b.have < b.nlen + b.ndist; ) {
              for (; bt = b.lencode[F & (1 << b.lenbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if (Ut < 16)
                F >>>= Te, Z -= Te, b.lens[b.have++] = Ut;
              else {
                if (Ut === 16) {
                  for (cr = Te + 2; Z < cr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  if (F >>>= Te, Z -= Te, b.have === 0) {
                    B.msg = "invalid bit length repeat", b.mode = me;
                    break;
                  }
                  Rt = b.lens[b.have - 1], xe = 3 + (F & 3), F >>>= 2, Z -= 2;
                } else if (Ut === 17) {
                  for (cr = Te + 3; Z < cr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  F >>>= Te, Z -= Te, Rt = 0, xe = 3 + (F & 7), F >>>= 3, Z -= 3;
                } else {
                  for (cr = Te + 7; Z < cr; ) {
                    if (ie === 0)
                      break e;
                    ie--, F += se[f++] << Z, Z += 8;
                  }
                  F >>>= Te, Z -= Te, Rt = 0, xe = 11 + (F & 127), F >>>= 7, Z -= 7;
                }
                if (b.have + xe > b.nlen + b.ndist) {
                  B.msg = "invalid bit length repeat", b.mode = me;
                  break;
                }
                for (; xe--; )
                  b.lens[b.have++] = Rt;
              }
            }
            if (b.mode === me)
              break;
            if (b.lens[256] === 0) {
              B.msg = "invalid code -- missing end-of-block", b.mode = me;
              break;
            }
            if (b.lenbits = 9, $t = { bits: b.lenbits }, Nt = i(u, b.lens, 0, b.nlen, b.lencode, 0, b.work, $t), b.lenbits = $t.bits, Nt) {
              B.msg = "invalid literal/lengths set", b.mode = me;
              break;
            }
            if (b.distbits = 6, b.distcode = b.distdyn, $t = { bits: b.distbits }, Nt = i(l, b.lens, b.nlen, b.ndist, b.distcode, 0, b.work, $t), b.distbits = $t.bits, Nt) {
              B.msg = "invalid distances set", b.mode = me;
              break;
            }
            if (b.mode = Xe, q === m)
              break e;
          /* falls through */
          case Xe:
            b.mode = Ze;
          /* falls through */
          case Ze:
            if (ie >= 6 && A >= 258) {
              B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, b.hold = F, b.bits = Z, r(B, Ee), te = B.next_out, Ne = B.output, A = B.avail_out, f = B.next_in, se = B.input, ie = B.avail_in, F = b.hold, Z = b.bits, b.mode === Ue && (b.back = -1);
              break;
            }
            for (b.back = 0; bt = b.lencode[F & (1 << b.lenbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(Te <= Z); ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if (tt && (tt & 240) === 0) {
              for (qt = Te, yn = tt, gn = Ut; bt = b.lencode[gn + ((F & (1 << qt + yn) - 1) >> qt)], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(qt + Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              F >>>= qt, Z -= qt, b.back += qt;
            }
            if (F >>>= Te, Z -= Te, b.back += Te, b.length = Ut, tt === 0) {
              b.mode = Pe;
              break;
            }
            if (tt & 32) {
              b.back = -1, b.mode = Ue;
              break;
            }
            if (tt & 64) {
              B.msg = "invalid literal/length code", b.mode = me;
              break;
            }
            b.extra = tt & 15, b.mode = wt;
          /* falls through */
          case wt:
            if (b.extra) {
              for (cr = b.extra; Z < cr; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              b.length += F & (1 << b.extra) - 1, F >>>= b.extra, Z -= b.extra, b.back += b.extra;
            }
            b.was = b.length, b.mode = yt;
          /* falls through */
          case yt:
            for (; bt = b.distcode[F & (1 << b.distbits) - 1], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(Te <= Z); ) {
              if (ie === 0)
                break e;
              ie--, F += se[f++] << Z, Z += 8;
            }
            if ((tt & 240) === 0) {
              for (qt = Te, yn = tt, gn = Ut; bt = b.distcode[gn + ((F & (1 << qt + yn) - 1) >> qt)], Te = bt >>> 24, tt = bt >>> 16 & 255, Ut = bt & 65535, !(qt + Te <= Z); ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              F >>>= qt, Z -= qt, b.back += qt;
            }
            if (F >>>= Te, Z -= Te, b.back += Te, tt & 64) {
              B.msg = "invalid distance code", b.mode = me;
              break;
            }
            b.offset = Ut, b.extra = tt & 15, b.mode = We;
          /* falls through */
          case We:
            if (b.extra) {
              for (cr = b.extra; Z < cr; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              b.offset += F & (1 << b.extra) - 1, F >>>= b.extra, Z -= b.extra, b.back += b.extra;
            }
            if (b.offset > b.dmax) {
              B.msg = "invalid distance too far back", b.mode = me;
              break;
            }
            b.mode = lt;
          /* falls through */
          case lt:
            if (A === 0)
              break e;
            if (xe = Ee - A, b.offset > xe) {
              if (xe = b.offset - xe, xe > b.whave && b.sane) {
                B.msg = "invalid distance too far back", b.mode = me;
                break;
              }
              xe > b.wnext ? (xe -= b.wnext, Je = b.wsize - xe) : Je = b.wnext - xe, xe > b.length && (xe = b.length), Tr = b.window;
            } else
              Tr = Ne, Je = te - b.offset, xe = b.length;
            xe > A && (xe = A), A -= xe, b.length -= xe;
            do
              Ne[te++] = Tr[Je++];
            while (--xe);
            b.length === 0 && (b.mode = Ze);
            break;
          case Pe:
            if (A === 0)
              break e;
            Ne[te++] = b.length, A--, b.mode = Ze;
            break;
          case he:
            if (b.wrap) {
              for (; Z < 32; ) {
                if (ie === 0)
                  break e;
                ie--, F |= se[f++] << Z, Z += 8;
              }
              if (Ee -= A, B.total_out += Ee, b.total += Ee, Ee && (B.adler = b.check = /*UPDATE(state.check, put - _out, _out);*/
              b.flags ? t(b.check, Ne, Ee, te - Ee) : e(b.check, Ne, Ee, te - Ee)), Ee = A, (b.flags ? F : kt(F)) !== b.check) {
                B.msg = "incorrect data check", b.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            b.mode = Fe;
          /* falls through */
          case Fe:
            if (b.wrap && b.flags) {
              for (; Z < 32; ) {
                if (ie === 0)
                  break e;
                ie--, F += se[f++] << Z, Z += 8;
              }
              if (F !== (b.total & 4294967295)) {
                B.msg = "incorrect length check", b.mode = me;
                break;
              }
              F = 0, Z = 0;
            }
            b.mode = et;
          /* falls through */
          case et:
            Nt = E;
            break e;
          case me:
            Nt = K;
            break e;
          case je:
            return C;
          case gt:
          /* falls through */
          default:
            return D;
        }
    return B.next_out = te, B.avail_out = A, B.next_in = f, B.avail_in = ie, b.hold = F, b.bits = Z, (b.wsize || Ee !== B.avail_out && b.mode < me && (b.mode < he || q !== c)) && R(B, B.output, B.next_out, Ee - B.avail_out), Oe -= B.avail_in, Ee -= B.avail_out, B.total_in += Oe, B.total_out += Ee, b.total += Ee, b.wrap && Ee && (B.adler = b.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    b.flags ? t(b.check, Ne, Ee, B.next_out - Ee) : e(b.check, Ne, Ee, B.next_out - Ee)), B.data_type = b.bits + (b.last ? 64 : 0) + (b.mode === Ue ? 128 : 0) + (b.mode === Xe || b.mode === we ? 256 : 0), (Oe === 0 && Ee === 0 || q === c) && Nt === w && (Nt = M), Nt;
  }
  function T(B) {
    if (!B || !B.state)
      return D;
    var q = B.state;
    return q.window && (q.window = null), B.state = null, w;
  }
  function L(B, q) {
    var b;
    return !B || !B.state || (b = B.state, (b.wrap & 2) === 0) ? D : (b.head = q, q.done = !1, w);
  }
  function ue(B, q) {
    var b = q.length, se, Ne, f;
    return !B || !B.state || (se = B.state, se.wrap !== 0 && se.mode !== Se) ? D : se.mode === Se && (Ne = 1, Ne = e(Ne, q, b, 0), Ne !== se.check) ? K : (f = R(B, q, b, b), f ? (se.mode = je, C) : (se.havedict = 1, w));
  }
  return Mr.inflateReset = Qe, Mr.inflateReset2 = Et, Mr.inflateResetKeep = qe, Mr.inflateInit = _t, Mr.inflateInit2 = Ft, Mr.inflate = g, Mr.inflateEnd = T, Mr.inflateGetHeader = L, Mr.inflateSetDictionary = ue, Mr.inflateInfo = "pako inflate (from Nodeca project)", Mr;
}
var Gc, Mv;
function By() {
  return Mv || (Mv = 1, Gc = {
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
  }), Gc;
}
var Hc, Uv;
function pb() {
  if (Uv) return Hc;
  Uv = 1;
  function n() {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
  }
  return Hc = n, Hc;
}
var $v;
function db() {
  if ($v) return ws;
  $v = 1;
  var n = hb(), e = _i(), t = Py(), r = By(), i = th(), a = Dy(), u = pb(), l = Object.prototype.toString;
  function c(w) {
    if (!(this instanceof c)) return new c(w);
    this.options = e.assign({
      chunkSize: 16384,
      windowBits: 0,
      to: ""
    }, w || {});
    var E = this.options;
    E.raw && E.windowBits >= 0 && E.windowBits < 16 && (E.windowBits = -E.windowBits, E.windowBits === 0 && (E.windowBits = -15)), E.windowBits >= 0 && E.windowBits < 16 && !(w && w.windowBits) && (E.windowBits += 32), E.windowBits > 15 && E.windowBits < 48 && (E.windowBits & 15) === 0 && (E.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new a(), this.strm.avail_out = 0;
    var k = n.inflateInit2(
      this.strm,
      E.windowBits
    );
    if (k !== r.Z_OK)
      throw new Error(i[k]);
    if (this.header = new u(), n.inflateGetHeader(this.strm, this.header), E.dictionary && (typeof E.dictionary == "string" ? E.dictionary = t.string2buf(E.dictionary) : l.call(E.dictionary) === "[object ArrayBuffer]" && (E.dictionary = new Uint8Array(E.dictionary)), E.raw && (k = n.inflateSetDictionary(this.strm, E.dictionary), k !== r.Z_OK)))
      throw new Error(i[k]);
  }
  c.prototype.push = function(w, E) {
    var k = this.strm, D = this.options.chunkSize, K = this.options.dictionary, C, M, J, X, le, ce = !1;
    if (this.ended)
      return !1;
    M = E === ~~E ? E : E === !0 ? r.Z_FINISH : r.Z_NO_FLUSH, typeof w == "string" ? k.input = t.binstring2buf(w) : l.call(w) === "[object ArrayBuffer]" ? k.input = new Uint8Array(w) : k.input = w, k.next_in = 0, k.avail_in = k.input.length;
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
  function _(w, E) {
    var k = new c(E);
    if (k.push(w, !0), k.err)
      throw k.msg || i[k.err];
    return k.result;
  }
  function m(w, E) {
    return E = E || {}, E.raw = !0, _(w, E);
  }
  return ws.Inflate = c, ws.inflate = _, ws.inflateRaw = m, ws.ungzip = _, ws;
}
var Wc, jv;
function vb() {
  if (jv) return Wc;
  jv = 1;
  var n = _i().assign, e = lb(), t = db(), r = By(), i = {};
  return n(i, e, t, r), Wc = i, Wc;
}
var yb = vb();
const gb = /* @__PURE__ */ bf(yb), rh = Ey([ky, "blip"]), Kv = 15, mb = 50 * 1024, Ib = 128e3, df = {
  /** The maximum number of bytes of a message to send in a single frame (WebSocket message.) */
  MaxFrameSize: 16384,
  /** Maximum size that the WebSocket's `bufferedAmount` can grow to;
   * if it exceeds this, BLIP stops sending frames until it goes down. */
  MaxBufferedAmount: 1e3 * 1024,
  // Maximum buffered outgoing bytes
  /** How long (in milliseconds) BLIP waits before trying to send again when the WebSocket's
   *  `bufferedAmount` is too large. */
  BufferDelayMS: 100
}, vf = new Uint8Array(4);
vf[2] = vf[3] = 255;
var js;
class zv {
  constructor() {
    ee(this, js, ib());
  }
  add(e) {
    return G(this, js, sb(p(this, js), e)), this.value;
  }
  get value() {
    return ab(p(this, js));
  }
}
js = new WeakMap();
var si;
class bb {
  constructor() {
    ee(this, si);
    G(this, si, new gb.Inflate({ raw: !0, windowBits: 15 })), p(this, si).onEnd = (e) => {
      if (e !== 0)
        throw Error(`Inflate error ${e}`);
    };
  }
  decompress(e, t) {
    p(this, si).onData = t, p(this, si).push(e), p(this, si).push(vf, 2);
  }
}
si = new WeakMap();
class _b {
  constructor(e, t, r = "throw") {
    this.resolve = e, this.reject = t, this.mode = r;
  }
}
class Fy {
  constructor(e, t) {
    pe(this, "logger", rh);
    pe(this, "flags");
    pe(this, "msgNo");
    pe(this, "promiseKeeper");
    if (this.flags = e, this.promiseKeeper = t, e & cs.Compressed)
      throw Error("Sending compressed messages is unimplemented!");
  }
  get type() {
    return this.flags & dn.TypeMask;
  }
}
var Wi, un, Ks, mf;
class wb extends Fy {
  /** Constructor takes a Message object to send. */
  constructor(t, r) {
    super(t.flags | dn.MoreComing, r);
    ee(this, Wi);
    ee(this, un, 0);
    ee(this, Ks, 0);
    ee(this, mf);
    t.isReply ? (Me(t.hasNumber, "Outgoing reply must have a number"), this.msgNo = t.number) : Me(!t.hasNumber, "Outgoing request must not have a number yet"), G(this, Wi, t.encodeBinary()), G(this, un, 0);
  }
  /** Returns the next frame to send, as a {@link Uint8Array}. */
  nextFrame(t) {
    const r = p(this, Wi).length - p(this, un);
    Me(r > 0);
    const i = Math.min(r, df.MaxFrameSize - Kv), a = i + Kv, u = new ArrayBuffer(a), l = new Uint8Array(u);
    let c = ks(l, 0, this.msgNo);
    i === r && (this.flags &= ~dn.MoreComing), c = ks(l, c, this.flags);
    const _ = p(this, Wi).slice(p(this, un), p(this, un) + i);
    l.set(_, c), G(this, un, p(this, un) + i), G(this, Ks, p(this, Ks) + i), c += i;
    const m = t.add(_);
    return new DataView(l.buffer, l.byteOffset).setUint32(c, m), c += 4, l.subarray(0, c);
  }
  receivedACK(t) {
    G(this, Ks, Math.max(0, p(this, un) - t));
  }
  /** Becomes true when the message has been completely sent. */
  get needsACK() {
    return p(this, Ks) > Ib;
  }
  /** Becomes true when the message has been completely sent. */
  get finished() {
    return p(this, un) >= p(this, Wi).length;
  }
}
Wi = new WeakMap(), un = new WeakMap(), Ks = new WeakMap(), mf = new WeakMap();
var Ma;
class xb extends Fy {
  constructor(t, r, i, a) {
    const u = t ? Dr.ACKRPY : Dr.ACKMSG;
    super(u | cs.Urgent | cs.NoReply, null);
    ee(this, Ma);
    this.msgNo = r, G(this, Ma, i), this.logger = a;
  }
  nextFrame(t) {
    const r = new ArrayBuffer(10), i = new Uint8Array(r);
    let a = ks(i, 0, this.msgNo);
    return a = ks(i, a, this.flags), a = ks(i, a, p(this, Ma)), i.subarray(0, a);
  }
  get needsACK() {
    return !1;
  }
  get finished() {
    return !0;
  }
}
Ma = new WeakMap();
var Ua, zs, En, $a, Gs;
class Gv {
  constructor(e, t) {
    pe(this, "promiseKeeper");
    ee(this, Ua);
    ee(this, zs);
    ee(this, En);
    ee(this, $a, 0);
    ee(this, Gs, 0);
    G(this, Ua, e), this.promiseKeeper = t;
  }
  /** Reads the next frame of the message.
   *  Returns a {@link Message} object when it's complete, else null. */
  addFrame(e, t, r, i) {
    if (G(this, $a, p(this, $a) + e.length), G(this, Gs, p(this, Gs) + e.length), p(this, En) === void 0)
      G(this, zs, t & ~dn.MoreComing), G(this, En, []);
    else if ((t & ~dn.MoreComing) !== p(this, zs))
      throw Error("Invalid frame: mismatched flags");
    const a = (t & dn.MoreComing) !== 0, u = e.subarray(0, e.length - 4);
    let l = null;
    if (t & cs.Compressed) {
      if (r.decompress(u, (m) => {
        p(this, En).push(m), l = i.add(m);
      }), l === null)
        throw Error("Inflate didn't produce any data");
    } else
      p(this, En).push(u), l = i.add(u);
    const _ = new DataView(e.buffer, e.byteOffset).getUint32(e.length - 4);
    if (_ !== l)
      throw Error("Invalid checksum: expected " + l.toString(16) + ", got " + _.toString(16));
    if (a)
      return null;
    {
      const m = Ty(p(this, En));
      return G(this, En, []), Ta.decodedFromBinary(m, p(this, zs), p(this, Ua));
    }
  }
  get bytesToAck() {
    return p(this, Gs) >= mb ? (G(this, Gs, 0), p(this, $a)) : 0;
  }
}
Ua = new WeakMap(), zs = new WeakMap(), En = new WeakMap(), $a = new WeakMap(), Gs = new WeakMap();
var Yi, Zo, Vr, Vi, Qo, Hs, Xo, Ji, ja, Ka;
class Eb {
  constructor() {
    pe(this, "logger", rh);
    ee(this, Yi, !0);
    // Outgoing:
    ee(this, Zo, 0);
    ee(this, Vr, []);
    ee(this, Vi, []);
    ee(this, Qo, new zv());
    // Incoming:
    ee(this, Hs, 0);
    ee(this, Xo, /* @__PURE__ */ new Map());
    ee(this, Ji, /* @__PURE__ */ new Map());
    ee(this, ja, new bb());
    ee(this, Ka, new zv());
  }
  /** Adds an outgoing {@link message} to the queue to be sent.
      Returns a promise of a reply. The message must not have the {@link NoReply} option. */
  async send(e, t) {
    return Me(p(this, Yi), "The connection is closed"), Me(e.wantsReply, "send() with NoReply message"), new Promise((r, i) => {
      this._send(e, new _b(r, i, t));
    });
  }
  /** Adds an outgoing {@link message} to the queue to be sent.
      The message must have the {@link NoReply} option. */
  sendNoReply(e) {
    Me(p(this, Yi), "The connection is closed"), Me(!e.wantsReply, "sendNoReply() with message that wants a reply"), this._send(e, null);
  }
  _send(e, t) {
    const r = new wb(e, t);
    r.logger = this.logger, p(this, Vr).push(r);
  }
  /** Returns the next frame to send, or `null` if there's nothing pending. */
  nextFrameToSend() {
    const e = p(this, Vr).shift();
    if (e === void 0)
      return null;
    if (!e.msgNo) {
      const r = ++hr(this, Zo)._;
      e.msgNo = r, (e.flags & (dn.TypeMask | cs.NoReply)) === Dr.MSG && p(this, Ji).set(r, new Gv(r, e.promiseKeeper));
    }
    const t = e.nextFrame(p(this, Qo));
    return e.finished || (e.needsACK ? p(this, Vi).push(e) : p(this, Vr).push(e)), t;
  }
  /** Call this when a frame is received.
  When an incoming {@link Message} is completed it will be returned, else `null`. */
  handleIncomingFrame(e) {
    let t, r, i = 0;
    [t, i] = ko(e, i), [r, i] = ko(e, i);
    const a = t;
    if (e = e.subarray(i), r > 127)
      throw Error(`Invalid flags ${r.toString(16)}`);
    const u = r & dn.TypeMask;
    switch (u) {
      case Dr.MSG:
      case Dr.RPY:
      case Dr.ERR:
        return this.handleMessageFrame(r, a, e);
      case Dr.ACKMSG:
      case Dr.ACKRPY:
        return this.handleACKFrame(u, a, e), null;
      default:
        throw Error(`Received unknown frame type '${hf[u]}'`);
    }
  }
  handleMessageFrame(e, t, r) {
    if (r.length < 4)
      throw Error("Frame missing checksum");
    const a = (e & dn.TypeMask) !== Dr.MSG, u = a ? p(this, Ji) : p(this, Xo);
    let l = u.get(t);
    if (l) {
      const c = l.addFrame(r, e, p(this, ja), p(this, Ka));
      if (c) {
        u.delete(t);
        const m = l.promiseKeeper;
        if (m)
          return c.isError && m.mode === "throw" ? m.reject(c.error) : m.resolve(c), null;
      }
      const _ = l.bytesToAck;
      return _ > 0 && p(this, Vr).push(new xb(a, t, _, this.logger)), c;
    } else {
      if (a)
        throw Error(`Invalid #${t} in RPY frame doesn't match any pending reply`);
      {
        if (t !== p(this, Hs) + 1)
          throw Error(`Invalid #${t} in incoming MSG frame; max is #${p(this, Hs) + 1}`);
        l = new Gv(t, null);
        const c = l.addFrame(r, e, p(this, ja), p(this, Ka));
        return G(this, Hs, t), c || u.set(t, l), c;
      }
    }
  }
  handleACKFrame(e, t, r) {
    const i = e === Dr.ACKMSG ? Dr.MSG : Dr.RPY;
    let a = !1, u = p(this, Vr).find((_) => _.msgNo === t && _.type === i);
    if (!u && (a = !0, u = p(this, Vi).find((_) => _.msgNo === t && _.type === i), !u))
      return;
    let [l, c] = ko(r, 0);
    if (c !== r.length)
      throw Error("Invalid contents in ACK frame");
    u.receivedACK(l), a && !u.needsACK && (c = p(this, Vi).indexOf(u), Me(c >= 0), p(this, Vi).splice(c, 1), p(this, Vr).push(u));
  }
  /** True if there are no currently outgoing requests or incoming replies. */
  get safeToClose() {
    return p(this, Vr).length === 0 && p(this, Ji).size === 0;
  }
  /** Call this when the connection closes.
   *  @param error  An error for rejecting Promises for request Messages that haven't been
   *                transmitted or are awaiting replies. */
  closed(e) {
    var t, r;
    if (p(this, Yi)) {
      G(this, Yi, !1);
      for (const i of p(this, Vr))
        (t = i.promiseKeeper) == null || t.reject(e);
      for (const i of p(this, Ji).values())
        (r = i.promiseKeeper) == null || r.reject(e);
    }
  }
}
Yi = new WeakMap(), Zo = new WeakMap(), Vr = new WeakMap(), Vi = new WeakMap(), Qo = new WeakMap(), Hs = new WeakMap(), Xo = new WeakMap(), Ji = new WeakMap(), ja = new WeakMap(), Ka = new WeakMap();
var Es = null;
typeof WebSocket < "u" ? Es = WebSocket : typeof MozWebSocket < "u" ? Es = MozWebSocket : typeof global < "u" ? Es = global.WebSocket || global.MozWebSocket : typeof window < "u" ? Es = window.WebSocket || window.MozWebSocket : typeof self < "u" && (Es = self.WebSocket || self.MozWebSocket);
const Sb = Es, Ab = "BLIP_3";
class kb {
  constructor() {
    pe(this, "logger", rh);
    pe(this, "events", /* @__PURE__ */ new Map());
    pe(this, "msgEvents", new rb());
    pe(this, "dispatching", !1);
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
    return this.sendMessage(new fs(e, t), r);
  }
  /** Creates a {@link Message} and queues it to be sent with the {@link NoReply} option.
   * @param props  The properties: either an object, or a string naming the `Profile` property.
   * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
   */
  sendNoReply(e, t = "") {
    this.sendMessageNoReply(new fs(e, t, cs.NoReply));
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
    Me(e.isReply), this.sendMessageNoReply(e);
  }
  dispatchEvent(e, t) {
    const r = this.events.get(e);
    if (r && r.length > 0) {
      this.dispatching = !0;
      for (const i of r)
        try {
          i && i(t);
        } catch (a) {
          this.logger.error(
            "blip.dispatchEvent({event}) caught {exception}",
            { event: e, exception: a }
          );
        }
      return this.dispatching = !1, !0;
    }
    return !1;
  }
}
var nr, Sr, Ws, ai, Sn, Ys;
class Ob extends kb {
  /** Creates and (asynchronously) opens a BLIP connection via a WebSocket.
   * @param url  The `ws:` or `wss:` URL to connect to.
   * @param protocol  The subprotocol of BLIP, to be appended to the WebSocket protocol requested.
   * @param options  Additional for use in node/Bun/Deno. Ignored in a browser. */
  constructor(t, r = "", i) {
    super();
    ee(this, nr);
    ee(this, Sr, new Eb());
    ee(this, Ws, !1);
    ee(this, ai, !1);
    ee(this, Sn, 0);
    ee(this, Ys, 0);
    pe(this, "timeReceiving", 0);
    pe(this, "timeWaiting", 0);
    pe(this, "timeSending", 0);
    r !== "" && (r = Ab + "+" + r), this.logger = this.logger.with({ url: t }), p(this, Sr).logger = this.logger;
    let a;
    (i == null ? void 0 : i.credentials) !== void 0 && (a = { headers: { Authorization: m0(i.credentials.username, i.credentials.password) } }), G(this, nr, new Sb(t, r, a)), p(this, nr).binaryType = "arraybuffer", p(this, nr).onopen = this.handleWSOpen.bind(this), p(this, nr).onmessage = this.handleWSMessage.bind(this), p(this, nr).onclose = this.handleWSClose.bind(this), p(this, nr).onerror = this.handleWSError.bind(this);
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
    Me(t >= 1e3, "Close code must be >= 1000"), G(this, Sn, t), (t !== 1e3 || (i = p(this, Sr)) != null && i.safeToClose) && p(this, nr).close(t, r);
  }
  /** Queues a {@link Message} object to be sent.
   * @param message  A Message object.
   * @returns  A promise of a reply message, or `null` if the {@link NoReply} option is set.
   */
  async sendMessage(t, r = "throw") {
    const i = this.preSend(t).send(t, r);
    return p(this, ai) || this.sendFrames(), i;
  }
  /** Queues a {@link Message} object to be sent.
   * @param message  A Message object.
   * @returns  A promise of a reply message, or `null` if the {@link NoReply} option is set.
   */
  sendMessageNoReply(t) {
    this.preSend(t).sendNoReply(t), p(this, ai) || this.sendFrames();
  }
  // Internals:
  handleWSOpen() {
    G(this, Ws, !0), this.dispatchEvent("open", void 0), this.sendFrames();
  }
  closed(t, r) {
    const i = p(this, Sr);
    G(this, Ws, !1), G(this, Sr, void 0), i == null || i.closed(t), this.dispatchEvent("close", r ? void 0 : t);
  }
  handleWSClose(t) {
    if (p(this, Sr)) {
      const r = new Rb(t.code, t.reason), i = t.code === 1e3 && t.wasClean;
      this.closed(r, i);
    }
  }
  handleWSError(t) {
    let r = p(this, Ws) ? "Socket disconnected" : "WebSocket connection failed";
    t.message ? r += ": " + t.message : r += " (no information available)";
    const i = Error(r);
    this.closed(i, !1);
  }
  handleWSMessage(t) {
    var l, c;
    const r = globalThis.performance.now();
    p(this, Ys) > 0 && (this.timeWaiting += r - p(this, Ys));
    let i;
    if (t.data instanceof Uint8Array)
      i = t.data;
    else if (t.data instanceof ArrayBuffer)
      i = new Uint8Array(t.data);
    else {
      this.logger.warn("Ignoring WebSocket message of wrong type (not Uint8Array or ArrayBuffer)");
      return;
    }
    const a = (l = p(this, Sr)) == null ? void 0 : l.handleIncomingFrame(i);
    a ? this.dispatchRequest(a) : p(this, ai) || this.sendFrames(), p(this, Sn) !== 0 && ((c = p(this, Sr)) != null && c.safeToClose) && p(this, nr).close(p(this, Sn));
    const u = globalThis.performance.now();
    this.timeReceiving += u - r, G(this, Ys, u);
  }
  dispatchRequest(t) {
    !this.msgEvents.dispatchMessage(t) && !this.dispatchEvent("message", t) && t.wantsReply && this.sendErrorReplyTo(t, "no handler", 404);
  }
  // Sends frames until all messages are sent or the WebSocket closes.
  // If the amount of buffered data exceeds the maximum, it will pause and retry.
  sendFrames() {
    var i, a;
    const t = globalThis.performance.now();
    for (G(this, ai, !1); p(this, nr).readyState === 1; ) {
      if (p(this, nr).bufferedAmount > df.MaxBufferedAmount) {
        this.logger.debug("**** PAUSING ****"), G(this, ai, !0), setTimeout(
          () => {
            this.logger.debug("**** RESUMING ****"), this.sendFrames();
          },
          df.BufferDelayMS
        );
        return;
      }
      const u = (i = p(this, Sr)) == null ? void 0 : i.nextFrameToSend();
      if (!u)
        break;
      p(this, nr).send(u);
    }
    p(this, Sn) !== 0 && ((a = p(this, Sr)) != null && a.safeToClose) && p(this, nr).close(p(this, Sn));
    const r = globalThis.performance.now();
    this.timeSending += r - t;
  }
  preSend(t) {
    if (Me(p(this, Sn) === 0, "Can't send while the connection is closing"), !p(this, Sr)) throw Error("Connection is closed");
    return p(this, Sr);
  }
}
nr = new WeakMap(), Sr = new WeakMap(), Ws = new WeakMap(), ai = new WeakMap(), Sn = new WeakMap(), Ys = new WeakMap();
class Rb extends Error {
  constructor(e, t) {
    super(t ?? Tb[e] ?? "WebSocket error"), this.code = e, this.reason = t;
  }
}
const Tb = {
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
}, Cb = 2e3;
var Jr, An, Ht, kn, ln, cn, Zi;
class Nb {
  constructor(e, t, r, i) {
    pe(this, "collectionID");
    pe(this, "collectionIndex");
    pe(this, "replicator");
    ee(this, Jr);
    ee(this, An);
    // The BLIP connection
    ee(this, Ht);
    // Current checkpoint object
    ee(this, kn);
    // Server-side revid of checkpoint
    ee(this, ln);
    // Timer ID from `setTimeout`; for saving
    ee(this, cn);
    // Outgoing `setCheckpoint` request
    ee(this, Zi, !1);
    this.config = t, this.delegate = r, this.replicator = e.replicator, this.collectionID = e.collectionID, this.collectionIndex = e.collectionIndex, G(this, An, e.socket), G(this, Jr, this.replicator.logger.with({
      collection: this.collectionID,
      type: "checkpointer"
    })), G(this, Ht, t.initialCheckpoint ?? new ls()), G(this, kn, i.rev ?? "");
    const a = ls.fromObject(i);
    p(this, Ht).empty ? p(this, kn) && p(this, Jr).info`No local checkpoint but server has revid ${p(this, kn)}` : a && p(this, Ht).equals(a) ? p(this, Jr).info`Server has matching ${a}` : (p(this, Jr).error`mismatch: I have ${p(this, Ht)}, server has ${a}`, G(this, Ht, new ls()));
  }
  stop() {
    this.stopTimer(), G(this, An, void 0), G(this, Zi, !1), G(this, cn, void 0);
  }
  get idle() {
    return !p(this, ln) && !p(this, cn);
  }
  get localSequence() {
    return p(this, Ht).local;
  }
  get remoteSequence() {
    return p(this, Ht).remote;
  }
  set localSequence(e) {
    Me(p(this, An) !== void 0), e !== p(this, Ht).local && (p(this, Ht).local = e, this.saveSoon());
  }
  set remoteSequence(e) {
    p(this, An) && e !== p(this, Ht).remote && (p(this, Ht).remote = e, this.saveSoon());
  }
  saveSoon() {
    G(this, Zi, !0), p(this, ln) === void 0 && G(this, ln, setTimeout(() => {
      G(this, ln, void 0), this.saveNow();
    }, Cb));
  }
  stopTimer() {
    p(this, ln) && (clearTimeout(p(this, ln)), G(this, ln, void 0));
  }
  async saveNow() {
    if (!p(this, An) || !p(this, Zi))
      return;
    p(this, Jr).debug`saveNow (${p(this, Ht)})`, this.stopTimer(), p(this, cn) && await p(this, cn), G(this, Zi, !1);
    const e = JSON.stringify(p(this, Ht)), t = {
      Profile: "setCheckpoint",
      collection: this.collectionIndex,
      client: this.config.clientID
    };
    p(this, kn) && (t.rev = p(this, kn)), p(this, Jr).debug`sending setCheckpoint ${e} ...`, G(this, cn, p(this, An).send(t, e, "nothrow"));
    const r = await p(this, cn);
    G(this, cn, void 0), p(this, Jr).debug`Saved checkpoint ${e} to server ...`, G(this, kn, r.properties.rev), await this.delegate.saveCheckpoint(this.collectionID, p(this, Ht)), p(this, Jr).info`Saved checkpoint ${e}`, this.replicator.statusChanged_();
  }
  toString() {
    return `Checkpointer[${this.collectionID}]`;
  }
  // True when state needs saving
}
Jr = new WeakMap(), An = new WeakMap(), Ht = new WeakMap(), kn = new WeakMap(), ln = new WeakMap(), cn = new WeakMap(), Zi = new WeakMap();
var za, Qi, Vs, Js;
class Ly {
  constructor(e, t) {
    pe(this, "collectionID");
    pe(this, "collectionIndex");
    pe(this, "replicator");
    pe(this, "socket");
    pe(this, "checkpointer");
    // Subclass should increment this to reflect number of revs pushed/pulled.
    pe(this, "_progress", 0);
    // Subclass should set this to true when it's caught up with the server
    pe(this, "caughtUp", !1);
    ee(this, za);
    ee(this, Qi, !1);
    ee(this, Vs, 0);
    ee(this, Js, !1);
    this.collectionID = e.collectionID, this.collectionIndex = e.collectionIndex, this.replicator = e.replicator, this.socket = e.socket, this.checkpointer = e.checkpointer, G(this, za, t.continuous ?? !1);
  }
  get isCaughtUp() {
    return p(this, Js);
  }
  get idle() {
    return p(this, Qi);
  }
  get done() {
    return p(this, Qi) && !p(this, za);
  }
  get progress() {
    return p(this, Vs);
  }
  // Subclass must call this after changing _progress or caughtUp, or when the result of
  // checkIdle may have changed.
  statusChanged() {
    const e = this.checkIdle();
    (e !== p(this, Qi) || this._progress !== p(this, Vs) || p(this, Js) !== this.caughtUp) && (G(this, Qi, e), G(this, Vs, this._progress), G(this, Js, this.caughtUp), this.replicator.statusChanged_());
  }
}
za = new WeakMap(), Qi = new WeakMap(), Vs = new WeakMap(), Js = new WeakMap();
var Xi, oi;
class Pb {
  /// Constructor takes the latest checkpointed sequence.
  constructor(e) {
    ee(this, Xi, /* @__PURE__ */ new Map());
    ee(this, oi);
    G(this, oi, e);
  }
  /// Adds a new pending sequence. Sequences are assumed to be in chronological order.
  addSequence(e) {
    if (p(this, Xi).has(e))
      throw Error(`RemoteSeqTracker.addSequence: sequence ${JSON.stringify(e)} already pending`);
    p(this, Xi).set(e, p(this, oi)), G(this, oi, e);
  }
  /// Records that a sequence is being skipped;
  /// behavior is equivalent to addSequence followed by finishedSequence.
  skipSequence(e) {
    G(this, oi, e);
  }
  /// Records that a pending sequence is now complete.
  finishedSequence(e) {
    if (!p(this, Xi).delete(e))
      throw Error(`RemoteSeqTracker.finishedSequence: ${JSON.stringify(e)} was not pending`);
  }
  getCheckpoint() {
    const e = p(this, Xi).values().next();
    return e.done ? p(this, oi) : e.value;
  }
}
Xi = new WeakMap(), oi = new WeakMap();
function qy(n) {
  if (kr(n) && typeof n.digest == "string")
    return n;
}
function Db(n) {
  let e;
  const t = n._attachments;
  if (kr(t))
    for (const r of Object.getOwnPropertyNames(t)) {
      const i = qy(t[r]);
      i && (e || (e = /* @__PURE__ */ new Set()), e.add(i.digest));
    }
  return e;
}
function Bb(n, e) {
  const t = n._attachments;
  if (kr(t)) {
    for (const i of Object.getOwnPropertyNames(t)) {
      const a = qy(t[i]);
      if (a)
        if (i.startsWith("blob_/")) {
          const u = new ru(a, e);
          r(u, i.substring(6).split("/")) ? delete t[i] : console.warn(`Document _attachments/${i} doesn't reference a blob`);
        } else
          t[i] = new Kg(a, e);
    }
    t.length === 0 && delete n._attachments;
  }
  function r(i, a) {
    let u = n, l = a.length;
    for (const c of a) {
      --l;
      let _;
      if (kr(u)) {
        if (_ = u[c], l === 0 && Go(_))
          return u[c] = i, !0;
      } else if (hs(u)) {
        const m = Number(c);
        if (_ = u[m], l === 0 && Go(_))
          return u[m] = i, !0;
      } else
        return !1;
      u = _;
    }
    return !1;
  }
}
function Fb(n, e) {
  let t, r, i;
  return eh(n, (a, u) => {
    if (u[0] !== "_attachments") {
      const l = "blob_/" + u.join("/");
      t === void 0 && (t = Oo(n, !1), r = zg(t._attachments), r = r ? Oo(r) : {}, t._attachments = r), i = i ?? Ro(e), r[l] = a.asAttachmentDict(i);
    }
    return !0;
  }), t ?? n;
}
const Lb = 200;
var Wt, On, es, fn, ui, Fr, Zs;
class qb extends Ly {
  constructor(t, r, i) {
    super(t, r);
    ee(this, Wt);
    // Logger, duh
    ee(this, On);
    // Manages the checkpoint
    ee(this, es, []);
    // Unhandled 'changes' messages
    ee(this, fn, 0);
    // Number of `rev` msgs I'm waiting for
    ee(this, ui, 0);
    // Number of revs I'm waiting to insert
    ee(this, Fr, new Array());
    // Revs waiting to be added to db
    ee(this, Zs, !1);
    this.config = r, this.delegate = i, G(this, Wt, this.replicator.logger.with({ collection: this.collectionID, dir: "pull" })), G(this, On, new Pb(this.checkpointer.remoteSequence)), G(this, fn, 0), G(this, ui, 0);
    const a = {
      Profile: "subChanges",
      collection: this.collectionIndex
    };
    this.checkpointer.remoteSequence !== void 0 && (a.since = JSON.stringify(this.checkpointer.remoteSequence)), r.continuous && (a.continuous = "true"), this.config.channels && (a.filter = "sync_gateway/bychannel", a.channels = this.config.channels.join(",")), this.config.activeOnly && (a.activeOnly = "true"), this.config.wantBatchSize && (a.batch = this.config.wantBatchSize), p(this, Wt).debug`Sending ${JSON.stringify(a)}`, this.socket.send(a);
  }
  checkIdle() {
    return Me(p(this, fn) >= 0 && p(this, ui) >= 0), this.caughtUp && p(this, fn) === 0 && p(this, ui) === 0 && p(this, es).length === 0;
  }
  //-------- HANDLING CHANGES MESSAGES:
  // Number of revs to insert into db at once
  get batchSize() {
    return this.config.saveBatchSize ?? Lb;
  }
  // Handler for incoming `changes` messages:
  onChanges(t) {
    this.canProcessChangesMessage() ? this.processChangesMessage(t) : (p(this, Wt).debug`Puller queuing changes message #${t.number}`, p(this, es).push(t));
  }
  canProcessChangesMessage() {
    var t;
    return (((t = p(this, Fr)) == null ? void 0 : t.length) ?? 0) + p(this, fn) < this.batchSize + 100;
  }
  maybeProcessChangesMessage() {
    if (p(this, es).length > 0 && this.canProcessChangesMessage()) {
      const [t] = p(this, es).splice(0, 1);
      this.processChangesMessage(t);
    }
  }
  async processChangesMessage(t) {
    const r = t.bodyJSON;
    if (r === null || r.length === 0)
      p(this, Wt).debug`Got 'changes'#${t.number}: Puller has caught up`, this.caughtUp = !0, this.maybeInsertRevs(), t.wantsReply && this.socket.sendReplyTo(t, {});
    else {
      p(this, Wt).debug`Got 'changes'#${t.number}: ${r.length} revs from seq ${r[0][0]}`;
      const i = r.map((c) => new Mb(
        c[1],
        c[2],
        c.length >= 4 && c[3] ? !0 : void 0,
        // .deleted
        c.length >= 5 ? c[4] : null,
        // .bodySize
        c[0]
      ));
      let a = !0;
      if (this.config.filter) {
        a = !1;
        for (const c of i)
          this.config.filter(c) ? a = !0 : c.skip = !0;
      }
      if (a && this.delegate.wantRevs)
        try {
          await this.delegate.wantRevs(i, this.caughtUp);
        } catch (c) {
          p(this, Wt).error`wantRevs threw ${c}`, this.replicator.fatalError(c);
        }
      const u = Array(), l = i.map((c) => c.skip ? (p(this, On).skipSequence(c.remoteSequence), 0) : (++hr(this, fn)._, p(this, On).addSequence(c.remoteSequence), c.knownRevs || u));
      p(this, Wt).debug`Puller replying to changes from ${r[0][0]}`, this.socket.sendReplyTo(t, {}, l), this.checkpointer.remoteSequence = p(this, On).getCheckpoint();
    }
    this.statusChanged(), this.maybeProcessChangesMessage();
  }
  //-------- HANDLING REVISIONS:
  // Handler for incoming `rev` messages.
  onRev(t) {
    --hr(this, fn)._, ++hr(this, ui)._, p(this, Fr).push(t), this.maybeInsertRevs();
  }
  // Inserts all the `rev` messages in `insertable` by passing them to the `saveRevs` callback.
  async maybeInsertRevs() {
    if (p(this, Zs)) return;
    const t = this.batchSize;
    for (; p(this, Fr).length > 0 && (p(this, Fr).length >= t || this.caughtUp && p(this, fn) === 0); ) {
      G(this, Zs, !0);
      try {
        let r;
        p(this, Fr).length <= t ? (r = p(this, Fr), G(this, Fr, [])) : r = p(this, Fr).splice(0, t), p(this, Wt).debug`Inserting ${r.length} of ${r.length + p(this, Fr).length} revs`, this.maybeProcessChangesMessage();
        const i = [];
        for (const u of r)
          if (u instanceof fs) {
            const l = this.decodeRevMsg(u);
            let c = Db(l.body);
            c ? this.processRevWithBlobs(l, c) : i.push(l);
          } else
            i.push(u);
        let a = !1;
        try {
          a = await this.delegate.saveRevs(i), a || p(this, Wt).error`Failed to save revs`;
        } catch (u) {
          p(this, Wt).error`Failed to save revs: caught ${u}`, this.replicator.fatalError(u);
          return;
        }
        i.forEach((u) => this.finishedRev(u, a)), this.checkpointer.remoteSequence = p(this, On).getCheckpoint(), a && (this._progress += i.length, this.statusChanged());
      } finally {
        G(this, Zs, !1), p(this, Wt).debug`End insertRevs`;
      }
    }
    this.maybeProcessChangesMessage();
  }
  // Returns a RemoteRevision object created from a `rev` message.
  decodeRevMsg(t) {
    const r = t.bodyJSON;
    if (!Oy(r))
      throw new Ho("invalid revision body", 400);
    const i = r._id || t.property("id"), a = r._rev || t.property("rev");
    if (!d0(i) || !Gg(a))
      throw new Ho("invalid id or rev property", 400);
    const u = r._deleted || t.property("deleted") !== "" ? 1 : void 0, l = t.property("history").split(/\s*,\s*/), c = JSON.parse(t.property("sequence"));
    return delete r._id, delete r._rev, delete r._deleted, { id: i, rev: a, deleted: u, body: r, history: l, remoteSequence: c, msg: t };
  }
  // Given a rev that contains blobs, first check with the delegate whether the blob digests
  // are known. If not, send a 'getAttachment' request to the server to download the blob.
  // Finally push the rev back into #insertable so it'll get inserted.
  async processRevWithBlobs(t, r) {
    try {
      let i = await this.delegate.missingBlobs(r);
      if (i && i.length > 0) {
        p(this, Wt).info`Downloading ${i.length} blob(s) of doc ${t.id}`;
        const a = i.map(async (u) => this.socket.send({
          Profile: "getAttachment",
          collection: this.collectionIndex,
          docID: t.id,
          digest: u
        }).then(async (l) => (p(this, Wt).info`Saving ${l.bodyData.length}-byte blob of doc "${t.id}"`, this.delegate.addBlob(u, l.bodyData))));
        await Promise.all(a);
      }
      Bb(t.body, this.delegate.blobLoader), p(this, Fr).push(t), this.maybeInsertRevs();
    } catch (i) {
      p(this, Wt).error`Unable to download blobs of doc ${t.id}: ${i.message}`, this.finishedRev(t, !1);
    }
  }
  // Called when a revision has been saved or rejected.
  finishedRev(t, r) {
    const i = t.msg;
    r ? (p(this, On).finishedSequence(t.remoteSequence), i.wantsReply && this.socket.sendReplyTo(i, {})) : i.wantsReply && this.socket.sendErrorReplyTo(i, "Failed to insert revision", 502), --hr(this, ui)._ === 0 && this.statusChanged();
  }
  toString() {
    return `Puller[${this.collectionID}]`;
  }
  // True while revs are being added to db
}
Wt = new WeakMap(), On = new WeakMap(), es = new WeakMap(), fn = new WeakMap(), ui = new WeakMap(), Fr = new WeakMap(), Zs = new WeakMap();
class Mb {
  constructor(e, t, r, i, a) {
    pe(this, "knownRevs");
    pe(this, "skip");
    this.id = e, this.rev = t, this.deleted = r, this.bodySize = i, this.remoteSequence = a;
  }
}
const Ub = 200;
var hn, Zr, li, ts, rs;
class Hv extends Ly {
  constructor(t, r, i) {
    super(t, r);
    ee(this, hn);
    ee(this, Zr);
    ee(this, li);
    ee(this, ts, 0);
    ee(this, rs, 0);
    this.config = r, this.delegate = i, G(this, hn, this.replicator.logger.with({ collection: this.collectionID, dir: "push" })), G(this, li, this.checkpointer.localSequence), G(this, Zr, new $b(p(this, li))), this.sendMoreChanges();
  }
  checkIdle() {
    return Me(p(this, ts) >= 0 && p(this, rs) >= 0), this.caughtUp && p(this, ts) === 0 && p(this, rs) === 0;
  }
  async getMoreChanges() {
    const t = this.config.batchSize ?? Ub, r = p(this, li);
    let i;
    do {
      p(this, hn).debug`Getting changes since seq ${r}`;
      const a = await this.delegate.getChanges(p(this, li), t);
      i = {
        changes: a,
        since: r,
        atEnd: a.length < t
      }, a.length > 0 && G(this, li, a[a.length - 1].seq), this.config.filter && (i.changes = a.filter((u) => this.config.filter(u)));
    } while (i.changes.length === 0 && !i.atEnd);
    return i;
  }
  async sendMoreChanges() {
    let t;
    for (; ; ) {
      const r = await this.getMoreChanges();
      let i = p(this, Zr).max;
      const a = r.changes.length;
      if (a === 0) {
        if (this.caughtUp)
          return;
        if (p(this, hn).info`Done pushing existing revs, at sequence ${i}`, this.caughtUp = !0, this.statusChanged(), t && await Promise.all(t), this.checkpointer.saveNow(), this.config.continuous)
          continue;
        return;
      }
      const u = r.changes.map((c) => {
        const _ = [c.id, c.rev, c.serverRev ?? ""];
        return c.deleted && _.push(!0), p(this, Zr).addSequence(c.seq), i = c.seq, _;
      });
      p(this, hn).debug`Proposing ${a} revs from seq ${r.changes[0].seq} -- ${i}`, ++hr(this, ts)._;
      const l = await this.socket.send({
        Profile: "proposeChanges",
        collection: this.collectionIndex
      }, u, "nothrow");
      if (--hr(this, ts)._, t && await Promise.all(t), l.isError) {
        this.replicator.fatalError(l.error);
        return;
      } else {
        t = new Array();
        const c = l.bodyJSON;
        let _ = 0;
        for (const m of r.changes) {
          const w = _ < c.length ? c[_] : 0;
          switch (w) {
            case 0:
              t.push(this.sendRev(m));
              break;
            case 304:
              p(this, Zr).finishedSequence(m.seq);
              break;
            case 409:
            default:
              p(this, hn).error`Server rejected rev ${m.id} ${m.rev} with status ${JSON.stringify(w)}`, p(this, Zr).finishedSequence(m.seq);
              break;
          }
          ++_;
        }
        p(this, hn).debug`Server wants ${t.length} of ${a} revs`, this.checkpointer.localSequence = p(this, Zr).checkpointedSequence, this.statusChanged();
      }
    }
  }
  async sendRev(t) {
    const r = {
      Profile: "rev",
      collection: this.collectionIndex,
      id: t.id,
      rev: t.rev
    };
    t.serverRev && t.serverRev !== t.rev && (r.history = t.serverRev);
    const i = JSON.stringify(Fb(t.body, t.rev));
    ++hr(this, rs)._;
    const a = await this.socket.send(r, i, "nothrow");
    if (--hr(this, rs)._, a.isError) {
      this.replicator.fatalError(a.error);
      return;
    }
    p(this, Zr).finishedSequence(t.seq), this.checkpointer.localSequence = p(this, Zr).checkpointedSequence, this._progress++, this.delegate.pushedRev && this.delegate.pushedRev(t), this.statusChanged();
  }
  // Server is asking for a blob's contents. This happens while I'm uploading a doc, and the
  // server doesn't have a blob matching a digest.
  async onGetAttachment(t) {
    const r = t.property("digest");
    p(this, hn).debug`Sending blob ${r}`;
    const i = await this.delegate.getBlob(r);
    i ? this.socket.sendReplyTo(t, {}, i) : this.socket.sendErrorReplyTo(t, "Unknown blob", 404);
  }
  toString() {
    return `Pusher[${this.collectionID}]`;
  }
}
hn = new WeakMap(), Zr = new WeakMap(), li = new WeakMap(), ts = new WeakMap(), rs = new WeakMap();
var Qs, Rn;
class $b {
  /// Constructor takes the latest checkpointed sequence.
  constructor(e) {
    ee(this, Qs, /* @__PURE__ */ new Map());
    ee(this, Rn);
    G(this, Rn, e ?? 0);
  }
  /// Adds a new pending sequence. Sequences are assumed to be in chronological order.
  addSequence(e) {
    if (e <= p(this, Rn))
      throw Error(`LocalSeqTracker.addSequence: sequence ${e} out of order`);
    p(this, Qs).set(e, p(this, Rn)), G(this, Rn, e);
  }
  /// Records that a pending sequence is now complete.
  finishedSequence(e) {
    if (!p(this, Qs).delete(e))
      throw Error(`LocalSeqTracker.finishedSequence: ${e} was not pending`);
  }
  get max() {
    return p(this, Rn);
  }
  get checkpointedSequence() {
    const e = p(this, Qs).values().next();
    return e.done ? p(this, Rn) : e.value;
  }
}
Qs = new WeakMap(), Rn = new WeakMap();
const jb = "CBMobile_3", Wv = 500, yf = Xf.getChild("Sync");
var Tn, ci, ns, Cn, yr, Xs, ea, fi, ta, is, ss, as, Zv;
let Kb = (Zv = class {
  constructor(e) {
    pe(this, "logger");
    pe(this, "onStatusChange");
    ee(this, Tn);
    // Indexes of this array are collection indexes
    ee(this, ci);
    // Resolves `run()` Promise
    ee(this, ns);
    // Rejects `run()` Promise
    ee(this, Cn);
    // Allows auth fetch to be canceled
    ee(this, yr);
    // BLIP socket
    ee(this, Xs, !1);
    // True once a BLIP close is OK
    ee(this, ea, []);
    // Checkpointers, by collection index
    ee(this, fi, []);
    // All the pushers & pullers (indexes arbitrary)
    ee(this, ta, /* @__PURE__ */ new Map());
    // Pushers, keyed by collection index
    ee(this, is, /* @__PURE__ */ new Map());
    // Pullers, keyed by collection index
    ee(this, ss, 0);
    // Time I last notified status
    ee(this, as);
    this.config = e, this.logger = yf.with({ url: e.url }), G(this, Tn, Object.keys(e.collections)), Me(p(this, Tn).length > 0, "must replicate at least one Collection");
    for (const t of p(this, Tn)) {
      const r = e.collections[t];
      Me(r.push || r.pull, `collection '${t}' must be either pushed or pulled`);
    }
  }
  /** Starts the replicator. Completes when the replicator finishes (never if continuous.) */
  async run() {
    mr(!this.running, "Replicator is already running");
    let e = Yv(this.config.url, "_blipsync");
    mr(
      e.protocol === "wss:" || e.protocol === "ws:",
      "Replicator URL must have scheme wss: or ws:"
    );
    let t;
    return this.config.credentials && (typeof window < "u" ? await this.authenticate(this.config.credentials) : t = { credentials: this.config.credentials }), new Promise((r, i) => {
      G(this, ci, r), G(this, ns, i), G(this, Xs, !1), G(this, ss, 0), this.logger.info`Connecting to <${this.config.url}>...`, G(this, yr, new Ob(e, jb, t)), p(this, yr).addEventListener("open", () => {
        this.logger.info`Connected!`, this.maybeNotifyStatus();
      }), p(this, yr).addEventListener("close", (a) => {
        a ? (this.logger.info`Connection closed with error: ${a}`, this.fatalError(a)) : p(this, Xs) ? (this.logger.info`Connection closed`, this.finish()) : (this.logger.info`Connection closed unexpectedly`, this.finish(Error("BLIP connection closed unexpectedly")));
      }), this.maybeNotifyStatus(), this.start();
    });
  }
  async authenticate(e) {
    let t = Yv(this.config.url, "_session");
    t.protocol === "wss:" ? t.protocol = "https:" : (t.protocol = "http:", t.hostname !== "localhost" && t.hostname !== "127.0.0.1" && this.logger.warn`Sending credentials INSECURELY over a non-TLS connection!`), this.logger.info`Authenticating to ${t.toString()} as user ${e.username}`;
    try {
      G(this, Cn, new AbortController()), this.maybeNotifyStatus();
      const r = await fetch(t, {
        method: "POST",
        headers: { Authorization: m0(e.username, e.password) },
        credentials: "include",
        mode: "cors",
        signal: p(this, Cn).signal
      });
      if (r.status >= 300)
        throw this.logger.error`Authentication failed: ${r.status} ${r.statusText}`, r.status === 401 ? Error("Authentication failed; username or password not valid.") : Error(`Authentication failed. [${r.status} ${r.statusText}]`);
    } catch (r) {
      throw r instanceof Error && r.name === "AbortError" ? (this.logger.error`Authentication request was canceled`, Error("Authentication request was canceled")) : (this.logger.error`Authentication failed; fetch threw ${r}`, Error(`Authentication failed; this may be due to an invalid URL, a network problem, or the server's CORS settings. [${r}]`));
    } finally {
      G(this, Cn, void 0);
    }
    this.logger.info`Successfully authenticated`;
  }
  async start() {
    Nn(p(this, yr));
    const e = p(this, Tn).map(
      (i) => this.config.collections[i].checkpoint.clientID
    ), t = await p(this, yr).send("getCollections", {
      collections: p(this, Tn),
      // eslint-disable-next-line camelcase
      checkpoint_ids: e
    });
    let r = 0;
    for (const i of t.bodyJSON) {
      const a = p(this, Tn)[r];
      if (i === null) {
        this.fatalError(Error(`Collection '${a}' does not exist on the server`));
        return;
      }
      const u = {
        replicator: this,
        socket: p(this, yr),
        collectionID: a,
        collectionIndex: r
      }, l = this.config.collections[a], c = new Nb(
        u,
        l.checkpoint,
        l.checkpoint.delegate,
        i
      );
      p(this, ea).push(c);
      const _ = { ...u, checkpointer: c };
      if (l.push) {
        const m = new Hv(_, l.push, l.push.delegate);
        p(this, ta).set(r, m), p(this, fi).push(m);
      }
      if (l.pull) {
        const m = new qb(_, l.pull, l.pull.delegate);
        p(this, is).set(r, m), p(this, fi).push(m);
      }
      ++r;
    }
    p(this, ta).size > 0 && p(this, yr).incoming.addEventListener("getAttachment", (i) => {
      p(this, ta).get(i.numericProperty("collection")).onGetAttachment(i);
    }), p(this, is).size > 0 && (p(this, yr).incoming.addEventListener("changes", (i) => {
      p(this, is).get(i.numericProperty("collection")).onChanges(i);
    }), p(this, yr).incoming.addEventListener("rev", (i) => {
      p(this, is).get(i.numericProperty("collection")).onRev(i);
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
    if (p(this, fi).length > 0) {
      e.status = "idle";
      for (const r of p(this, fi))
        r instanceof Hv ? e.pushedRevisions = (e.pushedRevisions ?? 0) + r.progress : e.pulledRevisions = (e.pulledRevisions ?? 0) + r.progress, r.idle || (e.status = "busy");
    }
    switch ((t = p(this, yr)) == null ? void 0 : t.readyState) {
      case WebSocket.CONNECTING:
        e.status = "connecting";
        break;
      case WebSocket.CLOSED:
      case void 0:
        e.status = "stopped";
        break;
    }
    return e;
  }
  get running() {
    return p(this, ci) !== void 0 || p(this, Cn) !== void 0;
  }
  statusChanged_() {
    p(this, fi).every((e) => e.done) && p(this, ea).every((e) => e.idle) && this.finish(), this.maybeNotifyStatus();
  }
  maybeNotifyStatus() {
    if (this.onStatusChange && this.running) {
      const e = Date.now();
      e > p(this, ss) + Wv ? (G(this, ss, e), this.onStatusChange(this.status)) : p(this, as) || G(this, as, setTimeout(() => {
        G(this, as, void 0), this.maybeNotifyStatus();
      }, Wv));
    }
  }
  notifyStatusAtEnd() {
    p(this, as) && (G(this, ss, 0), this.maybeNotifyStatus());
  }
  // Completes a run by cleaning up state and resolving or rejecting `run`s Promise.
  finish(e) {
    var t;
    this.logger.info`Finished`;
    for (const r of p(this, ea))
      r.stop();
    G(this, Xs, !0), (t = p(this, yr)) == null || t.close(), G(this, yr, void 0), this.notifyStatusAtEnd(), e ? p(this, ns) && p(this, ns).call(this, e) : p(this, ci) && p(this, ci).call(this), G(this, ci, void 0), G(this, ns, void 0);
  }
  fatalError(e) {
    this.logger.error`Sync fatal error: ${e}`, this.finish(e);
  }
  // Timer for notifying status
}, Tn = new WeakMap(), ci = new WeakMap(), ns = new WeakMap(), Cn = new WeakMap(), yr = new WeakMap(), Xs = new WeakMap(), ea = new WeakMap(), fi = new WeakMap(), ta = new WeakMap(), is = new WeakMap(), ss = new WeakMap(), as = new WeakMap(), Zv);
function Yv(n, e) {
  let t = new URL(n);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t.pathname += e, t;
}
var Qr, Ga;
class u_ {
  constructor(e) {
    /** The local database being replicated. */
    pe(this, "database");
    /** Callback that notifies when {@link status} changes. */
    pe(this, "onStatusChange");
    /** Callback that notifies when documents have been pushed or pulled. */
    pe(this, "onDocuments");
    pe(this, "logger");
    ee(this, Qr);
    // Actual replicator, while it's running
    ee(this, Ga, {});
    this.config = e, this.database = e.database, this.logger = yf.with({ url: e.url });
    const t = Object.keys(this.config.collections);
    Me(t.length > 0, "At least one collection must be replicated");
    for (const r of t)
      this.database.getCollection(r);
  }
  /** Current replication status & progress. */
  get status() {
    var e;
    return ((e = p(this, Qr)) == null ? void 0 : e.status) ?? p(this, Ga);
  }
  /** Runs the replicator.
   *
   * This is an async operation. The returned Promise resolves when the replication completes.
   * A continuous replication usually _never_ completes, unless it encounters a fatal error or
   * you stop it, so you may not want to `await` it. */
  async run() {
    Me(!p(this, Qr), "Replicator is already running");
    let e = {
      url: this.config.url,
      credentials: this.config.credentials,
      collections: {}
    };
    for (let t of Object.keys(this.config.collections)) {
      const r = this.config.collections[t], i = this.database.getCollection(t), a = await i.getClientID(), u = await i.getCheckpoint(this.config.url);
      yf.debug(`Initial checkpoint of ${t} is ${u}`);
      let l = {
        checkpoint: { clientID: a, initialCheckpoint: u, delegate: this }
      };
      if (r.pull) {
        const c = await i.count("includeDeleted") === 0, _ = new Gb(this, i, r.pull, c);
        l.pull = { ...r.pull, delegate: _ }, c && (l.pull.activeOnly = !0);
      }
      if (r.push) {
        const c = new zb(this, i, r.push);
        l.push = { ...r.push, delegate: c };
      }
      e.collections[t] = l;
    }
    G(this, Qr, new Kb(e)), p(this, Qr).onStatusChange = this.onStatusChange;
    try {
      await p(this, Qr).run();
    } finally {
      G(this, Ga, p(this, Qr).status), G(this, Qr, void 0);
    }
    this.logger.info`FINISHED! ${JSON.stringify(this.status)}`;
  }
  /** Stops the replicator. The current {@link run} operation's Promise will resolve with
   *  an error as soon as possible.
   *
   *  Does nothing if `run` is not active. */
  stop() {
    var e;
    (e = p(this, Qr)) == null || e.stop();
  }
  /** Checkpointer delegate implementation. @internal */
  async saveCheckpoint(e, t) {
    await this.database.getCollection(e).setCheckpoint(this.config.url, t);
  }
  // Final status of the Replicator
}
Qr = new WeakMap(), Ga = new WeakMap();
class My {
  constructor(e, t, r) {
    pe(this, "logger");
    this.replicator = e, this.collection = t, this.logger = e.logger.with({ collection: t.name, dir: r });
  }
}
var Ha, hi;
class zb extends My {
  constructor(t, r, i) {
    super(t, r, "push");
    ee(this, Ha, !1);
    ee(this, hi);
    this.config = i;
  }
  async getChanges(t, r) {
    const i = this.collection, a = await i.getDocsSinceSequence(t, r);
    if (a.length > 0 || !this.config.continuous)
      return a;
    if (!p(this, Ha))
      return G(this, Ha, !0), a;
    Me(!p(this, hi)), G(this, hi, Promise.withResolvers());
    let u;
    const l = () => {
      var _;
      u.remove();
      const c = (_ = p(this, hi)) == null ? void 0 : _.resolve;
      c && (this.logger.info`Notifying Pusher of changes to collection ${i.name}`, G(this, hi, void 0), c(i.getDocsSinceSequence(t, r)));
    };
    return u = i.addChangeListener(l), this.logger.info`Pusher is watching for changes to collection ${i.name}`, p(this, hi).promise;
  }
  async getBlob(t) {
    return await this.collection.database.blobStore.getBlob(t);
  }
}
Ha = new WeakMap(), hi = new WeakMap();
class Gb extends My {
  constructor(t, r, i, a) {
    super(t, r, "pull");
    pe(this, "blobLoader");
    this.config = i, this.startedEmpty = a, this.blobLoader = this.collection.database.blobLoader;
  }
  async wantRevs(t, r) {
    if (r)
      this.startedEmpty = !1;
    else if (this.startedEmpty)
      return;
    await this.collection.inTransaction(KI, async (i) => {
      for (const a of t)
        if (!a.skip) {
          const u = await i.getAncestorRevs(a.id, a.rev);
          u ? a.knownRevs = u : a.skip = !0;
        }
    });
  }
  async saveRevs(t) {
    const r = this.collection;
    this.logger.debug`Collection ${r.name} saving ${t.length} documents...`;
    const i = Date.now(), { lastSequence: a, conflicts: u } = await r.putRemoteRevisions(t, this.startedEmpty);
    if (this.logger.info`Collection ${r.name} saved ${t.length} documents, ${(u == null ? void 0 : u.size) ?? 0} conflicts, as sequences thru ${a}, in ${Date.now() - i}ms`, this.replicator.onDocuments) {
      u && (t = t.filter((c) => !u.has(c.id)));
      const l = t.map((c) => ({ docID: c.id, deleted: !!c.deleted }));
      this.replicator.onDocuments(r, "pull", l);
    }
    return u && this.resolveConflicts(u), !0;
  }
  async missingBlobs(t) {
    let r;
    for (const i of t)
      await this.collection.database.blobStore.hasBlob(i) || (r || (r = []), r.push(i));
    return r;
  }
  async addBlob(t, r) {
    const i = na.computeDigest(r);
    if (t !== i)
      throw Error(`Requested blob digest '${t}' but the data's digest is '${i}'`);
    await this.collection.database.blobStore.saveBlob(r, t);
  }
  async resolveConflicts(t) {
    const r = this.collection, i = this.config.conflictResolver;
    for (const a of t) {
      if (!i) {
        this.logger.warn`Unresolved replication conflict in ${r.name} doc ${a}`;
        continue;
      }
      try {
        let u, l = null;
        do {
          u = await r.getRevision(a, !0);
          const c = u == null ? void 0 : u.conflict;
          if (u === void 0 || c === void 0)
            break;
          const _ = (u.flags ?? 0) & gr ? null : u == null ? void 0 : u.body;
          l = await i(r, a, _, c);
        } while (!await r.resolveConflict(a, u.rev, l));
        if (this.replicator.onDocuments) {
          const c = { docID: a, deleted: l === null };
          this.replicator.onDocuments(r, "pull", [c]);
        }
      } catch (u) {
        this.logger.error`Exception resolving conflict in in ${r.name} doc ${a}: ${u}`;
      }
    }
  }
}
var ra;
class gf {
  constructor(e) {
    ee(this, ra);
    G(this, ra, e);
  }
  remove() {
    var e;
    (e = p(this, ra)) == null || e.call(this), G(this, ra, void 0);
  }
  [Symbol.dispose]() {
    this.remove();
  }
}
ra = new WeakMap();
const l_ = "1.0.0-2", c_ = 1;
export {
  c_ as APIVersion,
  JI as ArrayIndex,
  kf as Blob,
  Ss as Collection,
  ZI as ConflictError,
  di as Database,
  Ao as DefaultCollectionName,
  Yb as DocID,
  uu as EncryptionError,
  ru as ExistingBlob,
  Ko as InterruptedQueryError,
  s_ as LastWriteWins,
  gf as ListenerToken,
  ky as LogCategory,
  a_ as MostWritesWins,
  Sv as MultipleConflictsError,
  Lr as N1QLParseError,
  na as NewBlob,
  FI as Query,
  hI as RegisterUserFunction,
  u_ as Replicator,
  jn as ValueIndex,
  l_ as Version,
  zn as meta
};
//# sourceMappingURL=couchbase-lite.es.js.map
