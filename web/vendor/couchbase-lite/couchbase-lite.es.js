var sg = Object.defineProperty;
var qh = (n) => {
  throw TypeError(n);
};
var ag = (n, e, t) => e in n ? sg(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var de = (n, e, t) => ag(n, typeof e != "symbol" ? e + "" : e, t), Fu = (n, e, t) => e.has(n) || qh("Cannot " + t);
var p = (n, e, t) => (Fu(n, e, "read from private field"), t ? t.call(n) : e.get(n)), ee = (n, e, t) => e.has(n) ? qh("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), G = (n, e, t, r) => (Fu(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t), ge = (n, e, t) => (Fu(n, e, "access private method"), t);
var dr = (n, e, t, r) => ({
  set _(i) {
    G(n, e, i, t);
  },
  get _() {
    return p(n, e, r);
  }
});
function Me(n, e = "", ...t) {
  n || Na(e, ...t);
}
function Cn(n, e) {
  n === void 0 && Na(`${e ?? "something"} is unexpectedly undefined`);
}
function og(n, e, t = "value") {
  n !== e && Na(`${t} should be ${e} but is actually ${n}`);
}
function Na(n, ...e) {
  throw console.error(n || "assertion failed", ...e), Error("Assertion failed: " + n);
}
function Ar(n, e, t) {
  if (!n)
    throw console.error(`Check failed: ${e}`), new (t ?? Error)(e);
}
function Mh(n, e) {
  return Ar(typeof n == "number", `${e ?? "value"} must be a number`, TypeError), n;
}
function ug(n, e) {
  return Ar(typeof n == "string", "value must be a string", TypeError), n;
}
var If = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function bf(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Lu = { exports: {} }, mo = { exports: {} }, Uh;
function la() {
  return Uh || (Uh = 1, typeof Object.create == "function" ? mo.exports = function(e, t) {
    t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : mo.exports = function(e, t) {
    if (t) {
      e.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
    }
  }), mo.exports;
}
var Io = { exports: {} }, qu = {}, Ea = {}, $h;
function lg() {
  if ($h) return Ea;
  $h = 1, Ea.byteLength = l, Ea.toByteArray = b, Ea.fromByteArray = E;
  for (var n = [], e = [], t = typeof Uint8Array < "u" ? Uint8Array : Array, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, a = r.length; i < a; ++i)
    n[i] = r[i], e[r.charCodeAt(i)] = i;
  e[45] = 62, e[95] = 63;
  function u(k) {
    var B = k.length;
    if (B % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var K = k.indexOf("=");
    K === -1 && (K = B);
    var C = K === B ? 0 : 4 - K % 4;
    return [K, C];
  }
  function l(k) {
    var B = u(k), K = B[0], C = B[1];
    return (K + C) * 3 / 4 - C;
  }
  function c(k, B, K) {
    return (B + K) * 3 / 4 - K;
  }
  function b(k) {
    var B, K = u(k), C = K[0], M = K[1], Z = new t(c(k, C, M)), X = 0, ue = M > 0 ? C - 4 : C, ce;
    for (ce = 0; ce < ue; ce += 4)
      B = e[k.charCodeAt(ce)] << 18 | e[k.charCodeAt(ce + 1)] << 12 | e[k.charCodeAt(ce + 2)] << 6 | e[k.charCodeAt(ce + 3)], Z[X++] = B >> 16 & 255, Z[X++] = B >> 8 & 255, Z[X++] = B & 255;
    return M === 2 && (B = e[k.charCodeAt(ce)] << 2 | e[k.charCodeAt(ce + 1)] >> 4, Z[X++] = B & 255), M === 1 && (B = e[k.charCodeAt(ce)] << 10 | e[k.charCodeAt(ce + 1)] << 4 | e[k.charCodeAt(ce + 2)] >> 2, Z[X++] = B >> 8 & 255, Z[X++] = B & 255), Z;
  }
  function I(k) {
    return n[k >> 18 & 63] + n[k >> 12 & 63] + n[k >> 6 & 63] + n[k & 63];
  }
  function w(k, B, K) {
    for (var C, M = [], Z = B; Z < K; Z += 3)
      C = (k[Z] << 16 & 16711680) + (k[Z + 1] << 8 & 65280) + (k[Z + 2] & 255), M.push(I(C));
    return M.join("");
  }
  function E(k) {
    for (var B, K = k.length, C = K % 3, M = [], Z = 16383, X = 0, ue = K - C; X < ue; X += Z)
      M.push(w(k, X, X + Z > ue ? ue : X + Z));
    return C === 1 ? (B = k[K - 1], M.push(
      n[B >> 2] + n[B << 4 & 63] + "=="
    )) : C === 2 && (B = (k[K - 2] << 8) + k[K - 1], M.push(
      n[B >> 10] + n[B >> 4 & 63] + n[B << 2 & 63] + "="
    )), M.join("");
  }
  return Ea;
}
var bo = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var jh;
function cg() {
  return jh || (jh = 1, bo.read = function(n, e, t, r, i) {
    var a, u, l = i * 8 - r - 1, c = (1 << l) - 1, b = c >> 1, I = -7, w = t ? i - 1 : 0, E = t ? -1 : 1, k = n[e + w];
    for (w += E, a = k & (1 << -I) - 1, k >>= -I, I += l; I > 0; a = a * 256 + n[e + w], w += E, I -= 8)
      ;
    for (u = a & (1 << -I) - 1, a >>= -I, I += r; I > 0; u = u * 256 + n[e + w], w += E, I -= 8)
      ;
    if (a === 0)
      a = 1 - b;
    else {
      if (a === c)
        return u ? NaN : (k ? -1 : 1) * (1 / 0);
      u = u + Math.pow(2, r), a = a - b;
    }
    return (k ? -1 : 1) * u * Math.pow(2, a - r);
  }, bo.write = function(n, e, t, r, i, a) {
    var u, l, c, b = a * 8 - i - 1, I = (1 << b) - 1, w = I >> 1, E = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, k = r ? 0 : a - 1, B = r ? 1 : -1, K = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (l = isNaN(e) ? 1 : 0, u = I) : (u = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -u)) < 1 && (u--, c *= 2), u + w >= 1 ? e += E / c : e += E * Math.pow(2, 1 - w), e * c >= 2 && (u++, c /= 2), u + w >= I ? (l = 0, u = I) : u + w >= 1 ? (l = (e * c - 1) * Math.pow(2, i), u = u + w) : (l = e * Math.pow(2, w - 1) * Math.pow(2, i), u = 0)); i >= 8; n[t + k] = l & 255, k += B, l /= 256, i -= 8)
      ;
    for (u = u << i | l, b += i; b > 0; n[t + k] = u & 255, k += B, u /= 256, b -= 8)
      ;
    n[t + k - B] |= K * 128;
  }), bo;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Kh;
function fg() {
  return Kh || (Kh = 1, (function(n) {
    const e = lg(), t = cg(), r = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    n.Buffer = l, n.SlowBuffer = Z, n.INSPECT_MAX_BYTES = 50;
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
        return B(S);
      if (S == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof S
        );
      if (Xe(S, ArrayBuffer) || S && Xe(S.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Xe(S, SharedArrayBuffer) || S && Xe(S.buffer, SharedArrayBuffer)))
        return K(S, d, v);
      if (typeof S == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const O = S.valueOf && S.valueOf();
      if (O != null && O !== S)
        return l.from(O, d, v);
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
    function b(S) {
      if (typeof S != "number")
        throw new TypeError('"size" argument must be of type number');
      if (S < 0)
        throw new RangeError('The value "' + S + '" is invalid for option "size"');
    }
    function I(S, d, v) {
      return b(S), S <= 0 ? u(S) : d !== void 0 ? typeof v == "string" ? u(S).fill(d, v) : u(S).fill(d) : u(S);
    }
    l.alloc = function(S, d, v) {
      return I(S, d, v);
    };
    function w(S) {
      return b(S), u(S < 0 ? 0 : M(S) | 0);
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
      let O = u(v);
      const g = O.write(S, d);
      return g !== v && (O = O.slice(0, g)), O;
    }
    function k(S) {
      const d = S.length < 0 ? 0 : M(S.length) | 0, v = u(d);
      for (let O = 0; O < d; O += 1)
        v[O] = S[O] & 255;
      return v;
    }
    function B(S) {
      if (Xe(S, Uint8Array)) {
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
      let O;
      return d === void 0 && v === void 0 ? O = new Uint8Array(S) : v === void 0 ? O = new Uint8Array(S, d) : O = new Uint8Array(S, d, v), Object.setPrototypeOf(O, l.prototype), O;
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
    function Z(S) {
      return +S != S && (S = 0), l.alloc(+S);
    }
    l.isBuffer = function(d) {
      return d != null && d._isBuffer === !0 && d !== l.prototype;
    }, l.compare = function(d, v) {
      if (Xe(d, Uint8Array) && (d = l.from(d, d.offset, d.byteLength)), Xe(v, Uint8Array) && (v = l.from(v, v.offset, v.byteLength)), !l.isBuffer(d) || !l.isBuffer(v))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (d === v) return 0;
      let O = d.length, g = v.length;
      for (let T = 0, L = Math.min(O, g); T < L; ++T)
        if (d[T] !== v[T]) {
          O = d[T], g = v[T];
          break;
        }
      return O < g ? -1 : g < O ? 1 : 0;
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
      let O;
      if (v === void 0)
        for (v = 0, O = 0; O < d.length; ++O)
          v += d[O].length;
      const g = l.allocUnsafe(v);
      let T = 0;
      for (O = 0; O < d.length; ++O) {
        let L = d[O];
        if (Xe(L, Uint8Array))
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
      if (ArrayBuffer.isView(S) || Xe(S, ArrayBuffer))
        return S.byteLength;
      if (typeof S != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof S
        );
      const v = S.length, O = arguments.length > 2 && arguments[2] === !0;
      if (!O && v === 0) return 0;
      let g = !1;
      for (; ; )
        switch (d) {
          case "ascii":
          case "latin1":
          case "binary":
            return v;
          case "utf8":
          case "utf-8":
            return it(S).length;
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
              return O ? -1 : it(S).length;
            d = ("" + d).toLowerCase(), g = !0;
        }
    }
    l.byteLength = X;
    function ue(S, d, v) {
      let O = !1;
      if ((d === void 0 || d < 0) && (d = 0), d > this.length || ((v === void 0 || v > this.length) && (v = this.length), v <= 0) || (v >>>= 0, d >>>= 0, v <= d))
        return "";
      for (S || (S = "utf8"); ; )
        switch (S) {
          case "hex":
            return ze(this, d, v);
          case "utf8":
          case "utf-8":
            return Ue(this, d, v);
          case "ascii":
            return we(this, d, v);
          case "latin1":
          case "binary":
            return We(this, d, v);
          case "base64":
            return Ae(this, d, v);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return It(this, d, v);
          default:
            if (O) throw new TypeError("Unknown encoding: " + S);
            S = (S + "").toLowerCase(), O = !0;
        }
    }
    l.prototype._isBuffer = !0;
    function ce(S, d, v) {
      const O = S[d];
      S[d] = S[v], S[v] = O;
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
      return d === 0 ? "" : arguments.length === 0 ? Ue(this, 0, d) : ue.apply(this, arguments);
    }, l.prototype.toLocaleString = l.prototype.toString, l.prototype.equals = function(d) {
      if (!l.isBuffer(d)) throw new TypeError("Argument must be a Buffer");
      return this === d ? !0 : l.compare(this, d) === 0;
    }, l.prototype.inspect = function() {
      let d = "";
      const v = n.INSPECT_MAX_BYTES;
      return d = this.toString("hex", 0, v).replace(/(.{2})/g, "$1 ").trim(), this.length > v && (d += " ... "), "<Buffer " + d + ">";
    }, r && (l.prototype[r] = l.prototype.inspect), l.prototype.compare = function(d, v, O, g, T) {
      if (Xe(d, Uint8Array) && (d = l.from(d, d.offset, d.byteLength)), !l.isBuffer(d))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof d
        );
      if (v === void 0 && (v = 0), O === void 0 && (O = d ? d.length : 0), g === void 0 && (g = 0), T === void 0 && (T = this.length), v < 0 || O > d.length || g < 0 || T > this.length)
        throw new RangeError("out of range index");
      if (g >= T && v >= O)
        return 0;
      if (g >= T)
        return -1;
      if (v >= O)
        return 1;
      if (v >>>= 0, O >>>= 0, g >>>= 0, T >>>= 0, this === d) return 0;
      let L = T - g, le = O - v;
      const D = Math.min(L, le), q = this.slice(g, T), _ = d.slice(v, O);
      for (let ie = 0; ie < D; ++ie)
        if (q[ie] !== _[ie]) {
          L = q[ie], le = _[ie];
          break;
        }
      return L < le ? -1 : le < L ? 1 : 0;
    };
    function he(S, d, v, O, g) {
      if (S.length === 0) return -1;
      if (typeof v == "string" ? (O = v, v = 0) : v > 2147483647 ? v = 2147483647 : v < -2147483648 && (v = -2147483648), v = +v, Et(v) && (v = g ? 0 : S.length - 1), v < 0 && (v = S.length + v), v >= S.length) {
        if (g) return -1;
        v = S.length - 1;
      } else if (v < 0)
        if (g) v = 0;
        else return -1;
      if (typeof d == "string" && (d = l.from(d, O)), l.isBuffer(d))
        return d.length === 0 ? -1 : oe(S, d, v, O, g);
      if (typeof d == "number")
        return d = d & 255, typeof Uint8Array.prototype.indexOf == "function" ? g ? Uint8Array.prototype.indexOf.call(S, d, v) : Uint8Array.prototype.lastIndexOf.call(S, d, v) : oe(S, [d], v, O, g);
      throw new TypeError("val must be string, number or Buffer");
    }
    function oe(S, d, v, O, g) {
      let T = 1, L = S.length, le = d.length;
      if (O !== void 0 && (O = String(O).toLowerCase(), O === "ucs2" || O === "ucs-2" || O === "utf16le" || O === "utf-16le")) {
        if (S.length < 2 || d.length < 2)
          return -1;
        T = 2, L /= 2, le /= 2, v /= 2;
      }
      function D(_, ie) {
        return T === 1 ? _[ie] : _.readUInt16BE(ie * T);
      }
      let q;
      if (g) {
        let _ = -1;
        for (q = v; q < L; q++)
          if (D(S, q) === D(d, _ === -1 ? 0 : q - _)) {
            if (_ === -1 && (_ = q), q - _ + 1 === le) return _ * T;
          } else
            _ !== -1 && (q -= q - _), _ = -1;
      } else
        for (v + le > L && (v = L - le), q = v; q >= 0; q--) {
          let _ = !0;
          for (let ie = 0; ie < le; ie++)
            if (D(S, q + ie) !== D(d, ie)) {
              _ = !1;
              break;
            }
          if (_) return q;
        }
      return -1;
    }
    l.prototype.includes = function(d, v, O) {
      return this.indexOf(d, v, O) !== -1;
    }, l.prototype.indexOf = function(d, v, O) {
      return he(this, d, v, O, !0);
    }, l.prototype.lastIndexOf = function(d, v, O) {
      return he(this, d, v, O, !1);
    };
    function ke(S, d, v, O) {
      v = Number(v) || 0;
      const g = S.length - v;
      O ? (O = Number(O), O > g && (O = g)) : O = g;
      const T = d.length;
      O > T / 2 && (O = T / 2);
      let L;
      for (L = 0; L < O; ++L) {
        const le = parseInt(d.substr(L * 2, 2), 16);
        if (Et(le)) return L;
        S[v + L] = le;
      }
      return L;
    }
    function De(S, d, v, O) {
      return qe(it(d, S.length - v), S, v, O);
    }
    function Ce(S, d, v, O) {
      return qe(Le(d), S, v, O);
    }
    function $e(S, d, v, O) {
      return qe(Ot(d), S, v, O);
    }
    function Be(S, d, v, O) {
      return qe(kt(d, S.length - v), S, v, O);
    }
    l.prototype.write = function(d, v, O, g) {
      if (v === void 0)
        g = "utf8", O = this.length, v = 0;
      else if (O === void 0 && typeof v == "string")
        g = v, O = this.length, v = 0;
      else if (isFinite(v))
        v = v >>> 0, isFinite(O) ? (O = O >>> 0, g === void 0 && (g = "utf8")) : (g = O, O = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const T = this.length - v;
      if ((O === void 0 || O > T) && (O = T), d.length > 0 && (O < 0 || v < 0) || v > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      g || (g = "utf8");
      let L = !1;
      for (; ; )
        switch (g) {
          case "hex":
            return ke(this, d, v, O);
          case "utf8":
          case "utf-8":
            return De(this, d, v, O);
          case "ascii":
          case "latin1":
          case "binary":
            return Ce(this, d, v, O);
          case "base64":
            return $e(this, d, v, O);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Be(this, d, v, O);
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
    function Ae(S, d, v) {
      return d === 0 && v === S.length ? e.fromByteArray(S) : e.fromByteArray(S.slice(d, v));
    }
    function Ue(S, d, v) {
      v = Math.min(S.length, v);
      const O = [];
      let g = d;
      for (; g < v; ) {
        const T = S[g];
        let L = null, le = T > 239 ? 4 : T > 223 ? 3 : T > 191 ? 2 : 1;
        if (g + le <= v) {
          let D, q, _, ie;
          switch (le) {
            case 1:
              T < 128 && (L = T);
              break;
            case 2:
              D = S[g + 1], (D & 192) === 128 && (ie = (T & 31) << 6 | D & 63, ie > 127 && (L = ie));
              break;
            case 3:
              D = S[g + 1], q = S[g + 2], (D & 192) === 128 && (q & 192) === 128 && (ie = (T & 15) << 12 | (D & 63) << 6 | q & 63, ie > 2047 && (ie < 55296 || ie > 57343) && (L = ie));
              break;
            case 4:
              D = S[g + 1], q = S[g + 2], _ = S[g + 3], (D & 192) === 128 && (q & 192) === 128 && (_ & 192) === 128 && (ie = (T & 15) << 18 | (D & 63) << 12 | (q & 63) << 6 | _ & 63, ie > 65535 && ie < 1114112 && (L = ie));
          }
        }
        L === null ? (L = 65533, le = 1) : L > 65535 && (L -= 65536, O.push(L >>> 10 & 1023 | 55296), L = 56320 | L & 1023), O.push(L), g += le;
      }
      return vt(O);
    }
    const st = 4096;
    function vt(S) {
      const d = S.length;
      if (d <= st)
        return String.fromCharCode.apply(String, S);
      let v = "", O = 0;
      for (; O < d; )
        v += String.fromCharCode.apply(
          String,
          S.slice(O, O += st)
        );
      return v;
    }
    function we(S, d, v) {
      let O = "";
      v = Math.min(S.length, v);
      for (let g = d; g < v; ++g)
        O += String.fromCharCode(S[g] & 127);
      return O;
    }
    function We(S, d, v) {
      let O = "";
      v = Math.min(S.length, v);
      for (let g = d; g < v; ++g)
        O += String.fromCharCode(S[g]);
      return O;
    }
    function ze(S, d, v) {
      const O = S.length;
      (!d || d < 0) && (d = 0), (!v || v < 0 || v > O) && (v = O);
      let g = "";
      for (let T = d; T < v; ++T)
        g += Lt[S[T]];
      return g;
    }
    function It(S, d, v) {
      const O = S.slice(d, v);
      let g = "";
      for (let T = 0; T < O.length - 1; T += 2)
        g += String.fromCharCode(O[T] + O[T + 1] * 256);
      return g;
    }
    l.prototype.slice = function(d, v) {
      const O = this.length;
      d = ~~d, v = v === void 0 ? O : ~~v, d < 0 ? (d += O, d < 0 && (d = 0)) : d > O && (d = O), v < 0 ? (v += O, v < 0 && (v = 0)) : v > O && (v = O), v < d && (v = d);
      const g = this.subarray(d, v);
      return Object.setPrototypeOf(g, l.prototype), g;
    };
    function Je(S, d, v) {
      if (S % 1 !== 0 || S < 0) throw new RangeError("offset is not uint");
      if (S + d > v) throw new RangeError("Trying to access beyond buffer length");
    }
    l.prototype.readUintLE = l.prototype.readUIntLE = function(d, v, O) {
      d = d >>> 0, v = v >>> 0, O || Je(d, v, this.length);
      let g = this[d], T = 1, L = 0;
      for (; ++L < v && (T *= 256); )
        g += this[d + L] * T;
      return g;
    }, l.prototype.readUintBE = l.prototype.readUIntBE = function(d, v, O) {
      d = d >>> 0, v = v >>> 0, O || Je(d, v, this.length);
      let g = this[d + --v], T = 1;
      for (; v > 0 && (T *= 256); )
        g += this[d + --v] * T;
      return g;
    }, l.prototype.readUint8 = l.prototype.readUInt8 = function(d, v) {
      return d = d >>> 0, v || Je(d, 1, this.length), this[d];
    }, l.prototype.readUint16LE = l.prototype.readUInt16LE = function(d, v) {
      return d = d >>> 0, v || Je(d, 2, this.length), this[d] | this[d + 1] << 8;
    }, l.prototype.readUint16BE = l.prototype.readUInt16BE = function(d, v) {
      return d = d >>> 0, v || Je(d, 2, this.length), this[d] << 8 | this[d + 1];
    }, l.prototype.readUint32LE = l.prototype.readUInt32LE = function(d, v) {
      return d = d >>> 0, v || Je(d, 4, this.length), (this[d] | this[d + 1] << 8 | this[d + 2] << 16) + this[d + 3] * 16777216;
    }, l.prototype.readUint32BE = l.prototype.readUInt32BE = function(d, v) {
      return d = d >>> 0, v || Je(d, 4, this.length), this[d] * 16777216 + (this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3]);
    }, l.prototype.readBigUInt64LE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], O = this[d + 7];
      (v === void 0 || O === void 0) && gt(d, this.length - 8);
      const g = v + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24, T = this[++d] + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + O * 2 ** 24;
      return BigInt(g) + (BigInt(T) << BigInt(32));
    }), l.prototype.readBigUInt64BE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], O = this[d + 7];
      (v === void 0 || O === void 0) && gt(d, this.length - 8);
      const g = v * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d], T = this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + O;
      return (BigInt(g) << BigInt(32)) + BigInt(T);
    }), l.prototype.readIntLE = function(d, v, O) {
      d = d >>> 0, v = v >>> 0, O || Je(d, v, this.length);
      let g = this[d], T = 1, L = 0;
      for (; ++L < v && (T *= 256); )
        g += this[d + L] * T;
      return T *= 128, g >= T && (g -= Math.pow(2, 8 * v)), g;
    }, l.prototype.readIntBE = function(d, v, O) {
      d = d >>> 0, v = v >>> 0, O || Je(d, v, this.length);
      let g = v, T = 1, L = this[d + --g];
      for (; g > 0 && (T *= 256); )
        L += this[d + --g] * T;
      return T *= 128, L >= T && (L -= Math.pow(2, 8 * v)), L;
    }, l.prototype.readInt8 = function(d, v) {
      return d = d >>> 0, v || Je(d, 1, this.length), this[d] & 128 ? (255 - this[d] + 1) * -1 : this[d];
    }, l.prototype.readInt16LE = function(d, v) {
      d = d >>> 0, v || Je(d, 2, this.length);
      const O = this[d] | this[d + 1] << 8;
      return O & 32768 ? O | 4294901760 : O;
    }, l.prototype.readInt16BE = function(d, v) {
      d = d >>> 0, v || Je(d, 2, this.length);
      const O = this[d + 1] | this[d] << 8;
      return O & 32768 ? O | 4294901760 : O;
    }, l.prototype.readInt32LE = function(d, v) {
      return d = d >>> 0, v || Je(d, 4, this.length), this[d] | this[d + 1] << 8 | this[d + 2] << 16 | this[d + 3] << 24;
    }, l.prototype.readInt32BE = function(d, v) {
      return d = d >>> 0, v || Je(d, 4, this.length), this[d] << 24 | this[d + 1] << 16 | this[d + 2] << 8 | this[d + 3];
    }, l.prototype.readBigInt64LE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], O = this[d + 7];
      (v === void 0 || O === void 0) && gt(d, this.length - 8);
      const g = this[d + 4] + this[d + 5] * 2 ** 8 + this[d + 6] * 2 ** 16 + (O << 24);
      return (BigInt(g) << BigInt(32)) + BigInt(v + this[++d] * 2 ** 8 + this[++d] * 2 ** 16 + this[++d] * 2 ** 24);
    }), l.prototype.readBigInt64BE = _t(function(d) {
      d = d >>> 0, je(d, "offset");
      const v = this[d], O = this[d + 7];
      (v === void 0 || O === void 0) && gt(d, this.length - 8);
      const g = (v << 24) + // Overflow
      this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + this[++d];
      return (BigInt(g) << BigInt(32)) + BigInt(this[++d] * 2 ** 24 + this[++d] * 2 ** 16 + this[++d] * 2 ** 8 + O);
    }), l.prototype.readFloatLE = function(d, v) {
      return d = d >>> 0, v || Je(d, 4, this.length), t.read(this, d, !0, 23, 4);
    }, l.prototype.readFloatBE = function(d, v) {
      return d = d >>> 0, v || Je(d, 4, this.length), t.read(this, d, !1, 23, 4);
    }, l.prototype.readDoubleLE = function(d, v) {
      return d = d >>> 0, v || Je(d, 8, this.length), t.read(this, d, !0, 52, 8);
    }, l.prototype.readDoubleBE = function(d, v) {
      return d = d >>> 0, v || Je(d, 8, this.length), t.read(this, d, !1, 52, 8);
    };
    function et(S, d, v, O, g, T) {
      if (!l.isBuffer(S)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (d > g || d < T) throw new RangeError('"value" argument is out of bounds');
      if (v + O > S.length) throw new RangeError("Index out of range");
    }
    l.prototype.writeUintLE = l.prototype.writeUIntLE = function(d, v, O, g) {
      if (d = +d, v = v >>> 0, O = O >>> 0, !g) {
        const le = Math.pow(2, 8 * O) - 1;
        et(this, d, v, O, le, 0);
      }
      let T = 1, L = 0;
      for (this[v] = d & 255; ++L < O && (T *= 256); )
        this[v + L] = d / T & 255;
      return v + O;
    }, l.prototype.writeUintBE = l.prototype.writeUIntBE = function(d, v, O, g) {
      if (d = +d, v = v >>> 0, O = O >>> 0, !g) {
        const le = Math.pow(2, 8 * O) - 1;
        et(this, d, v, O, le, 0);
      }
      let T = O - 1, L = 1;
      for (this[v + T] = d & 255; --T >= 0 && (L *= 256); )
        this[v + T] = d / L & 255;
      return v + O;
    }, l.prototype.writeUint8 = l.prototype.writeUInt8 = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 1, 255, 0), this[v] = d & 255, v + 1;
    }, l.prototype.writeUint16LE = l.prototype.writeUInt16LE = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 2, 65535, 0), this[v] = d & 255, this[v + 1] = d >>> 8, v + 2;
    }, l.prototype.writeUint16BE = l.prototype.writeUInt16BE = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 2, 65535, 0), this[v] = d >>> 8, this[v + 1] = d & 255, v + 2;
    }, l.prototype.writeUint32LE = l.prototype.writeUInt32LE = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 4, 4294967295, 0), this[v + 3] = d >>> 24, this[v + 2] = d >>> 16, this[v + 1] = d >>> 8, this[v] = d & 255, v + 4;
    }, l.prototype.writeUint32BE = l.prototype.writeUInt32BE = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 4, 4294967295, 0), this[v] = d >>> 24, this[v + 1] = d >>> 16, this[v + 2] = d >>> 8, this[v + 3] = d & 255, v + 4;
    };
    function Qe(S, d, v, O, g) {
      me(d, O, g, S, v, 7);
      let T = Number(d & BigInt(4294967295));
      S[v++] = T, T = T >> 8, S[v++] = T, T = T >> 8, S[v++] = T, T = T >> 8, S[v++] = T;
      let L = Number(d >> BigInt(32) & BigInt(4294967295));
      return S[v++] = L, L = L >> 8, S[v++] = L, L = L >> 8, S[v++] = L, L = L >> 8, S[v++] = L, v;
    }
    function wt(S, d, v, O, g) {
      me(d, O, g, S, v, 7);
      let T = Number(d & BigInt(4294967295));
      S[v + 7] = T, T = T >> 8, S[v + 6] = T, T = T >> 8, S[v + 5] = T, T = T >> 8, S[v + 4] = T;
      let L = Number(d >> BigInt(32) & BigInt(4294967295));
      return S[v + 3] = L, L = L >> 8, S[v + 2] = L, L = L >> 8, S[v + 1] = L, L = L >> 8, S[v] = L, v + 8;
    }
    l.prototype.writeBigUInt64LE = _t(function(d, v = 0) {
      return Qe(this, d, v, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeBigUInt64BE = _t(function(d, v = 0) {
      return wt(this, d, v, BigInt(0), BigInt("0xffffffffffffffff"));
    }), l.prototype.writeIntLE = function(d, v, O, g) {
      if (d = +d, v = v >>> 0, !g) {
        const D = Math.pow(2, 8 * O - 1);
        et(this, d, v, O, D - 1, -D);
      }
      let T = 0, L = 1, le = 0;
      for (this[v] = d & 255; ++T < O && (L *= 256); )
        d < 0 && le === 0 && this[v + T - 1] !== 0 && (le = 1), this[v + T] = (d / L >> 0) - le & 255;
      return v + O;
    }, l.prototype.writeIntBE = function(d, v, O, g) {
      if (d = +d, v = v >>> 0, !g) {
        const D = Math.pow(2, 8 * O - 1);
        et(this, d, v, O, D - 1, -D);
      }
      let T = O - 1, L = 1, le = 0;
      for (this[v + T] = d & 255; --T >= 0 && (L *= 256); )
        d < 0 && le === 0 && this[v + T + 1] !== 0 && (le = 1), this[v + T] = (d / L >> 0) - le & 255;
      return v + O;
    }, l.prototype.writeInt8 = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 1, 127, -128), d < 0 && (d = 255 + d + 1), this[v] = d & 255, v + 1;
    }, l.prototype.writeInt16LE = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 2, 32767, -32768), this[v] = d & 255, this[v + 1] = d >>> 8, v + 2;
    }, l.prototype.writeInt16BE = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 2, 32767, -32768), this[v] = d >>> 8, this[v + 1] = d & 255, v + 2;
    }, l.prototype.writeInt32LE = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 4, 2147483647, -2147483648), this[v] = d & 255, this[v + 1] = d >>> 8, this[v + 2] = d >>> 16, this[v + 3] = d >>> 24, v + 4;
    }, l.prototype.writeInt32BE = function(d, v, O) {
      return d = +d, v = v >>> 0, O || et(this, d, v, 4, 2147483647, -2147483648), d < 0 && (d = 4294967295 + d + 1), this[v] = d >>> 24, this[v + 1] = d >>> 16, this[v + 2] = d >>> 8, this[v + 3] = d & 255, v + 4;
    }, l.prototype.writeBigInt64LE = _t(function(d, v = 0) {
      return Qe(this, d, v, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), l.prototype.writeBigInt64BE = _t(function(d, v = 0) {
      return wt(this, d, v, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function yt(S, d, v, O, g, T) {
      if (v + O > S.length) throw new RangeError("Index out of range");
      if (v < 0) throw new RangeError("Index out of range");
    }
    function Ye(S, d, v, O, g) {
      return d = +d, v = v >>> 0, g || yt(S, d, v, 4), t.write(S, d, v, O, 23, 4), v + 4;
    }
    l.prototype.writeFloatLE = function(d, v, O) {
      return Ye(this, d, v, !0, O);
    }, l.prototype.writeFloatBE = function(d, v, O) {
      return Ye(this, d, v, !1, O);
    };
    function ut(S, d, v, O, g) {
      return d = +d, v = v >>> 0, g || yt(S, d, v, 8), t.write(S, d, v, O, 52, 8), v + 8;
    }
    l.prototype.writeDoubleLE = function(d, v, O) {
      return ut(this, d, v, !0, O);
    }, l.prototype.writeDoubleBE = function(d, v, O) {
      return ut(this, d, v, !1, O);
    }, l.prototype.copy = function(d, v, O, g) {
      if (!l.isBuffer(d)) throw new TypeError("argument should be a Buffer");
      if (O || (O = 0), !g && g !== 0 && (g = this.length), v >= d.length && (v = d.length), v || (v = 0), g > 0 && g < O && (g = O), g === O || d.length === 0 || this.length === 0) return 0;
      if (v < 0)
        throw new RangeError("targetStart out of bounds");
      if (O < 0 || O >= this.length) throw new RangeError("Index out of range");
      if (g < 0) throw new RangeError("sourceEnd out of bounds");
      g > this.length && (g = this.length), d.length - v < g - O && (g = d.length - v + O);
      const T = g - O;
      return this === d && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(v, O, g) : Uint8Array.prototype.set.call(
        d,
        this.subarray(O, g),
        v
      ), T;
    }, l.prototype.fill = function(d, v, O, g) {
      if (typeof d == "string") {
        if (typeof v == "string" ? (g = v, v = 0, O = this.length) : typeof O == "string" && (g = O, O = this.length), g !== void 0 && typeof g != "string")
          throw new TypeError("encoding must be a string");
        if (typeof g == "string" && !l.isEncoding(g))
          throw new TypeError("Unknown encoding: " + g);
        if (d.length === 1) {
          const L = d.charCodeAt(0);
          (g === "utf8" && L < 128 || g === "latin1") && (d = L);
        }
      } else typeof d == "number" ? d = d & 255 : typeof d == "boolean" && (d = Number(d));
      if (v < 0 || this.length < v || this.length < O)
        throw new RangeError("Out of range index");
      if (O <= v)
        return this;
      v = v >>> 0, O = O === void 0 ? this.length : O >>> 0, d || (d = 0);
      let T;
      if (typeof d == "number")
        for (T = v; T < O; ++T)
          this[T] = d;
      else {
        const L = l.isBuffer(d) ? d : l.from(d, g), le = L.length;
        if (le === 0)
          throw new TypeError('The value "' + d + '" is invalid for argument "value"');
        for (T = 0; T < O - v; ++T)
          this[T + v] = L[T % le];
      }
      return this;
    };
    const Pe = {};
    function pe(S, d, v) {
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
    pe(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(S) {
        return S ? `${S} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), pe(
      "ERR_INVALID_ARG_TYPE",
      function(S, d) {
        return `The "${S}" argument must be of type number. Received type ${typeof d}`;
      },
      TypeError
    ), pe(
      "ERR_OUT_OF_RANGE",
      function(S, d, v) {
        let O = `The value of "${S}" is out of range.`, g = v;
        return Number.isInteger(v) && Math.abs(v) > 2 ** 32 ? g = Fe(String(v)) : typeof v == "bigint" && (g = String(v), (v > BigInt(2) ** BigInt(32) || v < -(BigInt(2) ** BigInt(32))) && (g = Fe(g)), g += "n"), O += ` It must be ${d}. Received ${g}`, O;
      },
      RangeError
    );
    function Fe(S) {
      let d = "", v = S.length;
      const O = S[0] === "-" ? 1 : 0;
      for (; v >= O + 4; v -= 3)
        d = `_${S.slice(v - 3, v)}${d}`;
      return `${S.slice(0, v)}${d}`;
    }
    function tt(S, d, v) {
      je(d, "offset"), (S[d] === void 0 || S[d + v] === void 0) && gt(d, S.length - (v + 1));
    }
    function me(S, d, v, O, g, T) {
      if (S > v || S < d) {
        const L = typeof d == "bigint" ? "n" : "";
        let le;
        throw d === 0 || d === BigInt(0) ? le = `>= 0${L} and < 2${L} ** ${(T + 1) * 8}${L}` : le = `>= -(2${L} ** ${(T + 1) * 8 - 1}${L}) and < 2 ** ${(T + 1) * 8 - 1}${L}`, new Pe.ERR_OUT_OF_RANGE("value", le, S);
      }
      tt(O, g, T);
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
    function lt(S) {
      if (S = S.split("=")[0], S = S.trim().replace(ht, ""), S.length < 2) return "";
      for (; S.length % 4 !== 0; )
        S = S + "=";
      return S;
    }
    function it(S, d) {
      d = d || 1 / 0;
      let v;
      const O = S.length;
      let g = null;
      const T = [];
      for (let L = 0; L < O; ++L) {
        if (v = S.charCodeAt(L), v > 55295 && v < 57344) {
          if (!g) {
            if (v > 56319) {
              (d -= 3) > -1 && T.push(239, 191, 189);
              continue;
            } else if (L + 1 === O) {
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
      let v, O, g;
      const T = [];
      for (let L = 0; L < S.length && !((d -= 2) < 0); ++L)
        v = S.charCodeAt(L), O = v >> 8, g = v % 256, T.push(g), T.push(O);
      return T;
    }
    function Ot(S) {
      return e.toByteArray(lt(S));
    }
    function qe(S, d, v, O) {
      let g;
      for (g = 0; g < O && !(g + v >= d.length || g >= S.length); ++g)
        d[g + v] = S[g];
      return g;
    }
    function Xe(S, d) {
      return S instanceof d || S != null && S.constructor != null && S.constructor.name != null && S.constructor.name === d.name;
    }
    function Et(S) {
      return S !== S;
    }
    const Lt = (function() {
      const S = "0123456789abcdef", d = new Array(256);
      for (let v = 0; v < 16; ++v) {
        const O = v * 16;
        for (let g = 0; g < 16; ++g)
          d[O + g] = S[v] + S[g];
      }
      return d;
    })();
    function _t(S) {
      return typeof BigInt > "u" ? Qt : S;
    }
    function Qt() {
      throw new Error("BigInt not supported");
    }
  })(qu)), qu;
}
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var zh;
function gi() {
  return zh || (zh = 1, (function(n, e) {
    var t = fg(), r = t.Buffer;
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
      var b = r(u);
      return l !== void 0 ? typeof c == "string" ? b.fill(l, c) : b.fill(l) : b.fill(0), b;
    }, a.allocUnsafe = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return r(u);
    }, a.allocUnsafeSlow = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return t.SlowBuffer(u);
    };
  })(Io, Io.exports)), Io.exports;
}
var Mu, Gh;
function hg() {
  if (Gh) return Mu;
  Gh = 1;
  var n = {}.toString;
  return Mu = Array.isArray || function(e) {
    return n.call(e) == "[object Array]";
  }, Mu;
}
var Uu, Hh;
function or() {
  return Hh || (Hh = 1, Uu = TypeError), Uu;
}
var $u, Wh;
function Qv() {
  return Wh || (Wh = 1, $u = Object), $u;
}
var ju, Yh;
function pg() {
  return Yh || (Yh = 1, ju = Error), ju;
}
var Ku, Vh;
function dg() {
  return Vh || (Vh = 1, Ku = EvalError), Ku;
}
var zu, Jh;
function vg() {
  return Jh || (Jh = 1, zu = RangeError), zu;
}
var Gu, Zh;
function yg() {
  return Zh || (Zh = 1, Gu = ReferenceError), Gu;
}
var Hu, Qh;
function Xv() {
  return Qh || (Qh = 1, Hu = SyntaxError), Hu;
}
var Wu, Xh;
function gg() {
  return Xh || (Xh = 1, Wu = URIError), Wu;
}
var Yu, ep;
function e0() {
  return ep || (ep = 1, Yu = Math.abs), Yu;
}
var Vu, tp;
function eu() {
  return tp || (tp = 1, Vu = Math.floor), Vu;
}
var Ju, rp;
function mg() {
  return rp || (rp = 1, Ju = Math.max), Ju;
}
var Zu, np;
function Ig() {
  return np || (np = 1, Zu = Math.min), Zu;
}
var Qu, ip;
function bg() {
  return ip || (ip = 1, Qu = Math.pow), Qu;
}
var Xu, sp;
function _g() {
  return sp || (sp = 1, Xu = Math.round), Xu;
}
var el, ap;
function _f() {
  return ap || (ap = 1, el = Number.isNaN || function(e) {
    return e !== e;
  }), el;
}
var tl, op;
function wg() {
  if (op) return tl;
  op = 1;
  var n = /* @__PURE__ */ _f();
  return tl = function(t) {
    return n(t) || t === 0 ? t : t < 0 ? -1 : 1;
  }, tl;
}
var rl, up;
function xg() {
  return up || (up = 1, rl = Object.getOwnPropertyDescriptor), rl;
}
var nl, lp;
function ca() {
  if (lp) return nl;
  lp = 1;
  var n = /* @__PURE__ */ xg();
  if (n)
    try {
      n([], "length");
    } catch {
      n = null;
    }
  return nl = n, nl;
}
var il, cp;
function tu() {
  if (cp) return il;
  cp = 1;
  var n = Object.defineProperty || !1;
  if (n)
    try {
      n({}, "a", { value: 1 });
    } catch {
      n = !1;
    }
  return il = n, il;
}
var sl, fp;
function t0() {
  return fp || (fp = 1, sl = function() {
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
  }), sl;
}
var al, hp;
function Eg() {
  if (hp) return al;
  hp = 1;
  var n = typeof Symbol < "u" && Symbol, e = t0();
  return al = function() {
    return typeof n != "function" || typeof Symbol != "function" || typeof n("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : e();
  }, al;
}
var ol, pp;
function r0() {
  return pp || (pp = 1, ol = typeof Reflect < "u" && Reflect.getPrototypeOf || null), ol;
}
var ul, dp;
function n0() {
  if (dp) return ul;
  dp = 1;
  var n = /* @__PURE__ */ Qv();
  return ul = n.getPrototypeOf || null, ul;
}
var ll, vp;
function Sg() {
  if (vp) return ll;
  vp = 1;
  var n = "Function.prototype.bind called on incompatible ", e = Object.prototype.toString, t = Math.max, r = "[object Function]", i = function(c, b) {
    for (var I = [], w = 0; w < c.length; w += 1)
      I[w] = c[w];
    for (var E = 0; E < b.length; E += 1)
      I[E + c.length] = b[E];
    return I;
  }, a = function(c, b) {
    for (var I = [], w = b, E = 0; w < c.length; w += 1, E += 1)
      I[E] = c[w];
    return I;
  }, u = function(l, c) {
    for (var b = "", I = 0; I < l.length; I += 1)
      b += l[I], I + 1 < l.length && (b += c);
    return b;
  };
  return ll = function(c) {
    var b = this;
    if (typeof b != "function" || e.apply(b) !== r)
      throw new TypeError(n + b);
    for (var I = a(arguments, 1), w, E = function() {
      if (this instanceof w) {
        var M = b.apply(
          this,
          i(I, arguments)
        );
        return Object(M) === M ? M : this;
      }
      return b.apply(
        c,
        i(I, arguments)
      );
    }, k = t(0, b.length - I.length), B = [], K = 0; K < k; K++)
      B[K] = "$" + K;
    if (w = Function("binder", "return function (" + u(B, ",") + "){ return binder.apply(this,arguments); }")(E), b.prototype) {
      var C = function() {
      };
      C.prototype = b.prototype, w.prototype = new C(), C.prototype = null;
    }
    return w;
  }, ll;
}
var cl, yp;
function Ya() {
  if (yp) return cl;
  yp = 1;
  var n = Sg();
  return cl = Function.prototype.bind || n, cl;
}
var fl, gp;
function wf() {
  return gp || (gp = 1, fl = Function.prototype.call), fl;
}
var hl, mp;
function xf() {
  return mp || (mp = 1, hl = Function.prototype.apply), hl;
}
var pl, Ip;
function Ag() {
  return Ip || (Ip = 1, pl = typeof Reflect < "u" && Reflect && Reflect.apply), pl;
}
var dl, bp;
function i0() {
  if (bp) return dl;
  bp = 1;
  var n = Ya(), e = xf(), t = wf(), r = Ag();
  return dl = r || n.call(t, e), dl;
}
var vl, _p;
function Ef() {
  if (_p) return vl;
  _p = 1;
  var n = Ya(), e = /* @__PURE__ */ or(), t = wf(), r = i0();
  return vl = function(a) {
    if (a.length < 1 || typeof a[0] != "function")
      throw new e("a function is required");
    return r(n, t, a);
  }, vl;
}
var yl, wp;
function kg() {
  if (wp) return yl;
  wp = 1;
  var n = Ef(), e = /* @__PURE__ */ ca(), t;
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
  return yl = r && typeof r.get == "function" ? n([r.get]) : typeof a == "function" ? (
    /** @type {import('./get')} */
    function(l) {
      return a(l == null ? l : i(l));
    }
  ) : !1, yl;
}
var gl, xp;
function s0() {
  if (xp) return gl;
  xp = 1;
  var n = r0(), e = n0(), t = /* @__PURE__ */ kg();
  return gl = n ? function(i) {
    return n(i);
  } : e ? function(i) {
    if (!i || typeof i != "object" && typeof i != "function")
      throw new TypeError("getProto: not an object");
    return e(i);
  } : t ? function(i) {
    return t(i);
  } : null, gl;
}
var ml, Ep;
function a0() {
  if (Ep) return ml;
  Ep = 1;
  var n = Function.prototype.call, e = Object.prototype.hasOwnProperty, t = Ya();
  return ml = t.call(n, e), ml;
}
var Il, Sp;
function Va() {
  if (Sp) return Il;
  Sp = 1;
  var n, e = /* @__PURE__ */ Qv(), t = /* @__PURE__ */ pg(), r = /* @__PURE__ */ dg(), i = /* @__PURE__ */ vg(), a = /* @__PURE__ */ yg(), u = /* @__PURE__ */ Xv(), l = /* @__PURE__ */ or(), c = /* @__PURE__ */ gg(), b = /* @__PURE__ */ e0(), I = /* @__PURE__ */ eu(), w = /* @__PURE__ */ mg(), E = /* @__PURE__ */ Ig(), k = /* @__PURE__ */ bg(), B = /* @__PURE__ */ _g(), K = /* @__PURE__ */ wg(), C = Function, M = function(pe) {
    try {
      return C('"use strict"; return (' + pe + ").constructor;")();
    } catch {
    }
  }, Z = /* @__PURE__ */ ca(), X = /* @__PURE__ */ tu(), ue = function() {
    throw new l();
  }, ce = Z ? (function() {
    try {
      return arguments.callee, ue;
    } catch {
      try {
        return Z(arguments, "callee").get;
      } catch {
        return ue;
      }
    }
  })() : ue, he = Eg()(), oe = s0(), ke = n0(), De = r0(), Ce = xf(), $e = wf(), Be = {}, Ae = typeof Uint8Array > "u" || !oe ? n : oe(Uint8Array), Ue = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? n : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? n : ArrayBuffer,
    "%ArrayIteratorPrototype%": he && oe ? oe([][Symbol.iterator]()) : n,
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
    "%IteratorPrototype%": he && oe ? oe(oe([][Symbol.iterator]())) : n,
    "%JSON%": typeof JSON == "object" ? JSON : n,
    "%Map%": typeof Map > "u" ? n : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !he || !oe ? n : oe((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": e,
    "%Object.getOwnPropertyDescriptor%": Z,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? n : Promise,
    "%Proxy%": typeof Proxy > "u" ? n : Proxy,
    "%RangeError%": i,
    "%ReferenceError%": a,
    "%Reflect%": typeof Reflect > "u" ? n : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? n : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !he || !oe ? n : oe((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? n : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": he && oe ? oe(""[Symbol.iterator]()) : n,
    "%Symbol%": he ? Symbol : n,
    "%SyntaxError%": u,
    "%ThrowTypeError%": ce,
    "%TypedArray%": Ae,
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
    "%Math.floor%": I,
    "%Math.max%": w,
    "%Math.min%": E,
    "%Math.pow%": k,
    "%Math.round%": B,
    "%Math.sign%": K,
    "%Reflect.getPrototypeOf%": De
  };
  if (oe)
    try {
      null.error;
    } catch (pe) {
      var st = oe(oe(pe));
      Ue["%Error.prototype%"] = st;
    }
  var vt = function pe(Fe) {
    var tt;
    if (Fe === "%AsyncFunction%")
      tt = M("async function () {}");
    else if (Fe === "%GeneratorFunction%")
      tt = M("function* () {}");
    else if (Fe === "%AsyncGeneratorFunction%")
      tt = M("async function* () {}");
    else if (Fe === "%AsyncGenerator%") {
      var me = pe("%AsyncGeneratorFunction%");
      me && (tt = me.prototype);
    } else if (Fe === "%AsyncIteratorPrototype%") {
      var je = pe("%AsyncGenerator%");
      je && oe && (tt = oe(je.prototype));
    }
    return Ue[Fe] = tt, tt;
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
  }, We = Ya(), ze = /* @__PURE__ */ a0(), It = We.call($e, Array.prototype.concat), Je = We.call(Ce, Array.prototype.splice), et = We.call($e, String.prototype.replace), Qe = We.call($e, String.prototype.slice), wt = We.call($e, RegExp.prototype.exec), yt = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Ye = /\\(\\)?/g, ut = function(Fe) {
    var tt = Qe(Fe, 0, 1), me = Qe(Fe, -1);
    if (tt === "%" && me !== "%")
      throw new u("invalid intrinsic syntax, expected closing `%`");
    if (me === "%" && tt !== "%")
      throw new u("invalid intrinsic syntax, expected opening `%`");
    var je = [];
    return et(Fe, yt, function(gt, ht, lt, it) {
      je[je.length] = lt ? et(it, Ye, "$1") : ht || gt;
    }), je;
  }, Pe = function(Fe, tt) {
    var me = Fe, je;
    if (ze(we, me) && (je = we[me], me = "%" + je[0] + "%"), ze(Ue, me)) {
      var gt = Ue[me];
      if (gt === Be && (gt = vt(me)), typeof gt > "u" && !tt)
        throw new l("intrinsic " + Fe + " exists, but is not available. Please file an issue!");
      return {
        alias: je,
        name: me,
        value: gt
      };
    }
    throw new u("intrinsic " + Fe + " does not exist!");
  };
  return Il = function(Fe, tt) {
    if (typeof Fe != "string" || Fe.length === 0)
      throw new l("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof tt != "boolean")
      throw new l('"allowMissing" argument must be a boolean');
    if (wt(/^%?[^%]*%?$/, Fe) === null)
      throw new u("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var me = ut(Fe), je = me.length > 0 ? me[0] : "", gt = Pe("%" + je + "%", tt), ht = gt.name, lt = gt.value, it = !1, Le = gt.alias;
    Le && (je = Le[0], Je(me, It([0, 1], Le)));
    for (var kt = 1, Ot = !0; kt < me.length; kt += 1) {
      var qe = me[kt], Xe = Qe(qe, 0, 1), Et = Qe(qe, -1);
      if ((Xe === '"' || Xe === "'" || Xe === "`" || Et === '"' || Et === "'" || Et === "`") && Xe !== Et)
        throw new u("property names with quotes must have matching quotes");
      if ((qe === "constructor" || !Ot) && (it = !0), je += "." + qe, ht = "%" + je + "%", ze(Ue, ht))
        lt = Ue[ht];
      else if (lt != null) {
        if (!(qe in lt)) {
          if (!tt)
            throw new l("base intrinsic for " + Fe + " exists, but the property is not available.");
          return;
        }
        if (Z && kt + 1 >= me.length) {
          var Lt = Z(lt, qe);
          Ot = !!Lt, Ot && "get" in Lt && !("originalValue" in Lt.get) ? lt = Lt.get : lt = lt[qe];
        } else
          Ot = ze(lt, qe), lt = lt[qe];
        Ot && !it && (Ue[ht] = lt);
      }
    }
    return lt;
  }, Il;
}
var bl, Ap;
function Pn() {
  if (Ap) return bl;
  Ap = 1;
  var n = /* @__PURE__ */ Va(), e = Ef(), t = e([n("%String.prototype.indexOf%")]);
  return bl = function(i, a) {
    var u = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      n(i, !!a)
    );
    return typeof u == "function" && t(i, ".prototype.") > -1 ? e(
      /** @type {const} */
      [u]
    ) : u;
  }, bl;
}
var _l, kp;
function Og() {
  if (kp) return _l;
  kp = 1;
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
    } catch (Z) {
      Z !== r && (e = null);
    }
  else
    e = null;
  var i = /^\s*class\b/, a = function(X) {
    try {
      var ue = n.call(X);
      return i.test(ue);
    } catch {
      return !1;
    }
  }, u = function(X) {
    try {
      return a(X) ? !1 : (n.call(X), !0);
    } catch {
      return !1;
    }
  }, l = Object.prototype.toString, c = "[object Object]", b = "[object Function]", I = "[object GeneratorFunction]", w = "[object HTMLAllCollection]", E = "[object HTML document.all class]", k = "[object HTMLCollection]", B = typeof Symbol == "function" && !!Symbol.toStringTag, K = !(0 in [,]), C = function() {
    return !1;
  };
  if (typeof document == "object") {
    var M = document.all;
    l.call(M) === l.call(document.all) && (C = function(X) {
      if ((K || !X) && (typeof X > "u" || typeof X == "object"))
        try {
          var ue = l.call(X);
          return (ue === w || ue === E || ue === k || ue === c) && X("") == null;
        } catch {
        }
      return !1;
    });
  }
  return _l = e ? function(X) {
    if (C(X))
      return !0;
    if (!X || typeof X != "function" && typeof X != "object")
      return !1;
    try {
      e(X, null, t);
    } catch (ue) {
      if (ue !== r)
        return !1;
    }
    return !a(X) && u(X);
  } : function(X) {
    if (C(X))
      return !0;
    if (!X || typeof X != "function" && typeof X != "object")
      return !1;
    if (B)
      return u(X);
    if (a(X))
      return !1;
    var ue = l.call(X);
    return ue !== b && ue !== I && !/^\[object HTML/.test(ue) ? !1 : u(X);
  }, _l;
}
var wl, Op;
function Sf() {
  if (Op) return wl;
  Op = 1;
  var n = Og(), e = Object.prototype.toString, t = Object.prototype.hasOwnProperty, r = function(c, b, I) {
    for (var w = 0, E = c.length; w < E; w++)
      t.call(c, w) && (I == null ? b(c[w], w, c) : b.call(I, c[w], w, c));
  }, i = function(c, b, I) {
    for (var w = 0, E = c.length; w < E; w++)
      I == null ? b(c.charAt(w), w, c) : b.call(I, c.charAt(w), w, c);
  }, a = function(c, b, I) {
    for (var w in c)
      t.call(c, w) && (I == null ? b(c[w], w, c) : b.call(I, c[w], w, c));
  };
  function u(l) {
    return e.call(l) === "[object Array]";
  }
  return wl = function(c, b, I) {
    if (!n(b))
      throw new TypeError("iterator must be a function");
    var w;
    arguments.length >= 3 && (w = I), u(c) ? r(c, b, w) : typeof c == "string" ? i(c, b, w) : a(c, b, w);
  }, wl;
}
var xl, Rp;
function Rg() {
  return Rp || (Rp = 1, xl = [
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
  ]), xl;
}
var El, Tp;
function Tg() {
  if (Tp) return El;
  Tp = 1;
  var n = /* @__PURE__ */ Rg(), e = typeof globalThis > "u" ? If : globalThis;
  return El = function() {
    for (var r = [], i = 0; i < n.length; i++)
      typeof e[n[i]] == "function" && (r[r.length] = n[i]);
    return r;
  }, El;
}
var Sl = { exports: {} }, Al, Cp;
function o0() {
  if (Cp) return Al;
  Cp = 1;
  var n = /* @__PURE__ */ tu(), e = /* @__PURE__ */ Xv(), t = /* @__PURE__ */ or(), r = /* @__PURE__ */ ca();
  return Al = function(a, u, l) {
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
    var c = arguments.length > 3 ? arguments[3] : null, b = arguments.length > 4 ? arguments[4] : null, I = arguments.length > 5 ? arguments[5] : null, w = arguments.length > 6 ? arguments[6] : !1, E = !!r && r(a, u);
    if (n)
      n(a, u, {
        configurable: I === null && E ? E.configurable : !I,
        enumerable: c === null && E ? E.enumerable : !c,
        value: l,
        writable: b === null && E ? E.writable : !b
      });
    else if (w || !c && !b && !I)
      a[u] = l;
    else
      throw new e("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, Al;
}
var kl, Np;
function u0() {
  if (Np) return kl;
  Np = 1;
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
  }, kl = e, kl;
}
var Ol, Pp;
function Cg() {
  if (Pp) return Ol;
  Pp = 1;
  var n = /* @__PURE__ */ Va(), e = /* @__PURE__ */ o0(), t = /* @__PURE__ */ u0()(), r = /* @__PURE__ */ ca(), i = /* @__PURE__ */ or(), a = n("%Math.floor%");
  return Ol = function(l, c) {
    if (typeof l != "function")
      throw new i("`fn` is not a function");
    if (typeof c != "number" || c < 0 || c > 4294967295 || a(c) !== c)
      throw new i("`length` must be a positive 32-bit integer");
    var b = arguments.length > 2 && !!arguments[2], I = !0, w = !0;
    if ("length" in l && r) {
      var E = r(l, "length");
      E && !E.configurable && (I = !1), E && !E.writable && (w = !1);
    }
    return (I || w || !b) && (t ? e(
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
  }, Ol;
}
var Rl, Dp;
function Ng() {
  if (Dp) return Rl;
  Dp = 1;
  var n = Ya(), e = xf(), t = i0();
  return Rl = function() {
    return t(n, e, arguments);
  }, Rl;
}
var Bp;
function Af() {
  return Bp || (Bp = 1, (function(n) {
    var e = /* @__PURE__ */ Cg(), t = /* @__PURE__ */ tu(), r = Ef(), i = Ng();
    n.exports = function(u) {
      var l = r(arguments), c = u.length - (arguments.length - 1);
      return e(
        l,
        1 + (c > 0 ? c : 0),
        !0
      );
    }, t ? t(n.exports, "apply", { value: i }) : n.exports.apply = i;
  })(Sl)), Sl.exports;
}
var Tl, Fp;
function l0() {
  if (Fp) return Tl;
  Fp = 1;
  var n = t0();
  return Tl = function() {
    return n() && !!Symbol.toStringTag;
  }, Tl;
}
var Cl, Lp;
function Pg() {
  if (Lp) return Cl;
  Lp = 1;
  var n = Sf(), e = /* @__PURE__ */ Tg(), t = Af(), r = /* @__PURE__ */ Pn(), i = /* @__PURE__ */ ca(), a = s0(), u = r("Object.prototype.toString"), l = l0()(), c = typeof globalThis > "u" ? If : globalThis, b = e(), I = r("String.prototype.slice"), w = r("Array.prototype.indexOf", !0) || function(C, M) {
    for (var Z = 0; Z < C.length; Z += 1)
      if (C[Z] === M)
        return Z;
    return -1;
  }, E = { __proto__: null };
  l && i && a ? n(b, function(K) {
    var C = new c[K]();
    if (Symbol.toStringTag in C && a) {
      var M = a(C), Z = i(M, Symbol.toStringTag);
      if (!Z && M) {
        var X = a(M);
        Z = i(X, Symbol.toStringTag);
      }
      E["$" + K] = t(Z.get);
    }
  }) : n(b, function(K) {
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
      function(Z, X) {
        if (!M)
          try {
            "$" + Z(C) === X && (M = /** @type {import('.').TypedArrayName} */
            I(X, 1));
          } catch {
          }
      }
    ), M;
  }, B = function(C) {
    var M = !1;
    return n(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      E,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(Z, X) {
        if (!M)
          try {
            Z(C), M = /** @type {import('.').TypedArrayName} */
            I(X, 1);
          } catch {
          }
      }
    ), M;
  };
  return Cl = function(C) {
    if (!C || typeof C != "object")
      return !1;
    if (!l) {
      var M = I(u(C), 8, -1);
      return w(b, M) > -1 ? M : M !== "Object" ? !1 : B(C);
    }
    return i ? k(C) : null;
  }, Cl;
}
var Nl, qp;
function Dg() {
  if (qp) return Nl;
  qp = 1;
  var n = /* @__PURE__ */ Pg();
  return Nl = function(t) {
    return !!n(t);
  }, Nl;
}
var Pl, Mp;
function Bg() {
  if (Mp) return Pl;
  Mp = 1;
  var n = /* @__PURE__ */ or(), e = /* @__PURE__ */ Pn(), t = e("TypedArray.prototype.buffer", !0), r = /* @__PURE__ */ Dg();
  return Pl = t || function(a) {
    if (!r(a))
      throw new n("Not a Typed Array");
    return a.buffer;
  }, Pl;
}
var Dl, Up;
function Fg() {
  if (Up) return Dl;
  Up = 1;
  var n = gi().Buffer, e = hg(), t = /* @__PURE__ */ Bg(), r = ArrayBuffer.isView || function(c) {
    try {
      return t(c), !0;
    } catch {
      return !1;
    }
  }, i = typeof Uint8Array < "u", a = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", u = a && (n.prototype instanceof Uint8Array || n.TYPED_ARRAY_SUPPORT);
  return Dl = function(c, b) {
    if (n.isBuffer(c))
      return c.constructor && !("isBuffer" in c) ? n.from(c) : c;
    if (typeof c == "string")
      return n.from(c, b);
    if (a && r(c)) {
      if (c.byteLength === 0)
        return n.alloc(0);
      if (u) {
        var I = n.from(c.buffer, c.byteOffset, c.byteLength);
        if (I.byteLength === c.byteLength)
          return I;
      }
      var w = c instanceof Uint8Array ? c : new Uint8Array(c.buffer, c.byteOffset, c.byteLength), E = n.from(w);
      if (E.length === c.byteLength)
        return E;
    }
    if (i && c instanceof Uint8Array)
      return n.from(c);
    var k = e(c);
    if (k)
      for (var B = 0; B < c.length; B += 1) {
        var K = c[B];
        if (typeof K != "number" || K < 0 || K > 255 || ~~K !== K)
          throw new RangeError("Array items must be numbers in the range 0-255.");
      }
    if (k || n.isBuffer(c) && c.constructor && typeof c.constructor.isBuffer == "function" && c.constructor.isBuffer(c))
      return n.from(c);
    throw new TypeError('The "data" argument must be a string, an Array, a Buffer, a Uint8Array, or a DataView.');
  }, Dl;
}
var Bl, $p;
function fa() {
  if ($p) return Bl;
  $p = 1;
  var n = gi().Buffer, e = /* @__PURE__ */ Fg();
  function t(r, i) {
    this._block = n.alloc(r), this._finalSize = i, this._blockSize = r, this._len = 0;
  }
  return t.prototype.update = function(r, i) {
    r = e(r, i || "utf8");
    for (var a = this._block, u = this._blockSize, l = r.length, c = this._len, b = 0; b < l; ) {
      for (var I = c % u, w = Math.min(l - b, u - I), E = 0; E < w; E++)
        a[I + E] = r[b + E];
      c += w, b += w, c % u === 0 && this._update(a);
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
  }, Bl = t, Bl;
}
var Fl, jp;
function Lg() {
  if (jp) return Fl;
  jp = 1;
  var n = la(), e = fa(), t = gi().Buffer, r = [
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
  function u(b) {
    return b << 5 | b >>> 27;
  }
  function l(b) {
    return b << 30 | b >>> 2;
  }
  function c(b, I, w, E) {
    return b === 0 ? I & w | ~I & E : b === 2 ? I & w | I & E | w & E : I ^ w ^ E;
  }
  return a.prototype._update = function(b) {
    for (var I = this._w, w = this._a | 0, E = this._b | 0, k = this._c | 0, B = this._d | 0, K = this._e | 0, C = 0; C < 16; ++C)
      I[C] = b.readInt32BE(C * 4);
    for (; C < 80; ++C)
      I[C] = I[C - 3] ^ I[C - 8] ^ I[C - 14] ^ I[C - 16];
    for (var M = 0; M < 80; ++M) {
      var Z = ~~(M / 20), X = u(w) + c(Z, E, k, B) + K + I[M] + r[Z] | 0;
      K = B, B = k, k = l(E), E = w, w = X;
    }
    this._a = w + this._a | 0, this._b = E + this._b | 0, this._c = k + this._c | 0, this._d = B + this._d | 0, this._e = K + this._e | 0;
  }, a.prototype._hash = function() {
    var b = t.allocUnsafe(20);
    return b.writeInt32BE(this._a | 0, 0), b.writeInt32BE(this._b | 0, 4), b.writeInt32BE(this._c | 0, 8), b.writeInt32BE(this._d | 0, 12), b.writeInt32BE(this._e | 0, 16), b;
  }, Fl = a, Fl;
}
var Ll, Kp;
function qg() {
  if (Kp) return Ll;
  Kp = 1;
  var n = la(), e = fa(), t = gi().Buffer, r = [
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
  function u(I) {
    return I << 1 | I >>> 31;
  }
  function l(I) {
    return I << 5 | I >>> 27;
  }
  function c(I) {
    return I << 30 | I >>> 2;
  }
  function b(I, w, E, k) {
    return I === 0 ? w & E | ~w & k : I === 2 ? w & E | w & k | E & k : w ^ E ^ k;
  }
  return a.prototype._update = function(I) {
    for (var w = this._w, E = this._a | 0, k = this._b | 0, B = this._c | 0, K = this._d | 0, C = this._e | 0, M = 0; M < 16; ++M)
      w[M] = I.readInt32BE(M * 4);
    for (; M < 80; ++M)
      w[M] = u(w[M - 3] ^ w[M - 8] ^ w[M - 14] ^ w[M - 16]);
    for (var Z = 0; Z < 80; ++Z) {
      var X = ~~(Z / 20), ue = l(E) + b(X, k, B, K) + C + w[Z] + r[X] | 0;
      C = K, K = B, B = c(k), k = E, E = ue;
    }
    this._a = E + this._a | 0, this._b = k + this._b | 0, this._c = B + this._c | 0, this._d = K + this._d | 0, this._e = C + this._e | 0;
  }, a.prototype._hash = function() {
    var I = t.allocUnsafe(20);
    return I.writeInt32BE(this._a | 0, 0), I.writeInt32BE(this._b | 0, 4), I.writeInt32BE(this._c | 0, 8), I.writeInt32BE(this._d | 0, 12), I.writeInt32BE(this._e | 0, 16), I;
  }, Ll = a, Ll;
}
var ql, zp;
function c0() {
  if (zp) return ql;
  zp = 1;
  var n = la(), e = fa(), t = gi().Buffer, r = [
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
  function u(E, k, B) {
    return B ^ E & (k ^ B);
  }
  function l(E, k, B) {
    return E & k | B & (E | k);
  }
  function c(E) {
    return (E >>> 2 | E << 30) ^ (E >>> 13 | E << 19) ^ (E >>> 22 | E << 10);
  }
  function b(E) {
    return (E >>> 6 | E << 26) ^ (E >>> 11 | E << 21) ^ (E >>> 25 | E << 7);
  }
  function I(E) {
    return (E >>> 7 | E << 25) ^ (E >>> 18 | E << 14) ^ E >>> 3;
  }
  function w(E) {
    return (E >>> 17 | E << 15) ^ (E >>> 19 | E << 13) ^ E >>> 10;
  }
  return a.prototype._update = function(E) {
    for (var k = this._w, B = this._a | 0, K = this._b | 0, C = this._c | 0, M = this._d | 0, Z = this._e | 0, X = this._f | 0, ue = this._g | 0, ce = this._h | 0, he = 0; he < 16; ++he)
      k[he] = E.readInt32BE(he * 4);
    for (; he < 64; ++he)
      k[he] = w(k[he - 2]) + k[he - 7] + I(k[he - 15]) + k[he - 16] | 0;
    for (var oe = 0; oe < 64; ++oe) {
      var ke = ce + b(Z) + u(Z, X, ue) + r[oe] + k[oe] | 0, De = c(B) + l(B, K, C) | 0;
      ce = ue, ue = X, X = Z, Z = M + ke | 0, M = C, C = K, K = B, B = ke + De | 0;
    }
    this._a = B + this._a | 0, this._b = K + this._b | 0, this._c = C + this._c | 0, this._d = M + this._d | 0, this._e = Z + this._e | 0, this._f = X + this._f | 0, this._g = ue + this._g | 0, this._h = ce + this._h | 0;
  }, a.prototype._hash = function() {
    var E = t.allocUnsafe(32);
    return E.writeInt32BE(this._a, 0), E.writeInt32BE(this._b, 4), E.writeInt32BE(this._c, 8), E.writeInt32BE(this._d, 12), E.writeInt32BE(this._e, 16), E.writeInt32BE(this._f, 20), E.writeInt32BE(this._g, 24), E.writeInt32BE(this._h, 28), E;
  }, ql = a, ql;
}
var Ml, Gp;
function Mg() {
  if (Gp) return Ml;
  Gp = 1;
  var n = la(), e = c0(), t = fa(), r = gi().Buffer, i = new Array(64);
  function a() {
    this.init(), this._w = i, t.call(this, 64, 56);
  }
  return n(a, e), a.prototype.init = function() {
    return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
  }, a.prototype._hash = function() {
    var u = r.allocUnsafe(28);
    return u.writeInt32BE(this._a, 0), u.writeInt32BE(this._b, 4), u.writeInt32BE(this._c, 8), u.writeInt32BE(this._d, 12), u.writeInt32BE(this._e, 16), u.writeInt32BE(this._f, 20), u.writeInt32BE(this._g, 24), u;
  }, Ml = a, Ml;
}
var Ul, Hp;
function f0() {
  if (Hp) return Ul;
  Hp = 1;
  var n = la(), e = fa(), t = gi().Buffer, r = [
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
  function b(K, C) {
    return (K >>> 14 | C << 18) ^ (K >>> 18 | C << 14) ^ (C >>> 9 | K << 23);
  }
  function I(K, C) {
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
  function B(K, C) {
    return K >>> 0 < C >>> 0 ? 1 : 0;
  }
  return a.prototype._update = function(K) {
    for (var C = this._w, M = this._ah | 0, Z = this._bh | 0, X = this._ch | 0, ue = this._dh | 0, ce = this._eh | 0, he = this._fh | 0, oe = this._gh | 0, ke = this._hh | 0, De = this._al | 0, Ce = this._bl | 0, $e = this._cl | 0, Be = this._dl | 0, Ae = this._el | 0, Ue = this._fl | 0, st = this._gl | 0, vt = this._hl | 0, we = 0; we < 32; we += 2)
      C[we] = K.readInt32BE(we * 4), C[we + 1] = K.readInt32BE(we * 4 + 4);
    for (; we < 160; we += 2) {
      var We = C[we - 30], ze = C[we - 30 + 1], It = I(We, ze), Je = w(ze, We);
      We = C[we - 4], ze = C[we - 4 + 1];
      var et = E(We, ze), Qe = k(ze, We), wt = C[we - 14], yt = C[we - 14 + 1], Ye = C[we - 32], ut = C[we - 32 + 1], Pe = Je + yt | 0, pe = It + wt + B(Pe, Je) | 0;
      Pe = Pe + Qe | 0, pe = pe + et + B(Pe, Qe) | 0, Pe = Pe + ut | 0, pe = pe + Ye + B(Pe, ut) | 0, C[we] = pe, C[we + 1] = Pe;
    }
    for (var Fe = 0; Fe < 160; Fe += 2) {
      pe = C[Fe], Pe = C[Fe + 1];
      var tt = l(M, Z, X), me = l(De, Ce, $e), je = c(M, De), gt = c(De, M), ht = b(ce, Ae), lt = b(Ae, ce), it = r[Fe], Le = r[Fe + 1], kt = u(ce, he, oe), Ot = u(Ae, Ue, st), qe = vt + lt | 0, Xe = ke + ht + B(qe, vt) | 0;
      qe = qe + Ot | 0, Xe = Xe + kt + B(qe, Ot) | 0, qe = qe + Le | 0, Xe = Xe + it + B(qe, Le) | 0, qe = qe + Pe | 0, Xe = Xe + pe + B(qe, Pe) | 0;
      var Et = gt + me | 0, Lt = je + tt + B(Et, gt) | 0;
      ke = oe, vt = st, oe = he, st = Ue, he = ce, Ue = Ae, Ae = Be + qe | 0, ce = ue + Xe + B(Ae, Be) | 0, ue = X, Be = $e, X = Z, $e = Ce, Z = M, Ce = De, De = qe + Et | 0, M = Xe + Lt + B(De, qe) | 0;
    }
    this._al = this._al + De | 0, this._bl = this._bl + Ce | 0, this._cl = this._cl + $e | 0, this._dl = this._dl + Be | 0, this._el = this._el + Ae | 0, this._fl = this._fl + Ue | 0, this._gl = this._gl + st | 0, this._hl = this._hl + vt | 0, this._ah = this._ah + M + B(this._al, De) | 0, this._bh = this._bh + Z + B(this._bl, Ce) | 0, this._ch = this._ch + X + B(this._cl, $e) | 0, this._dh = this._dh + ue + B(this._dl, Be) | 0, this._eh = this._eh + ce + B(this._el, Ae) | 0, this._fh = this._fh + he + B(this._fl, Ue) | 0, this._gh = this._gh + oe + B(this._gl, st) | 0, this._hh = this._hh + ke + B(this._hl, vt) | 0;
  }, a.prototype._hash = function() {
    var K = t.allocUnsafe(64);
    function C(M, Z, X) {
      K.writeInt32BE(M, X), K.writeInt32BE(Z, X + 4);
    }
    return C(this._ah, this._al, 0), C(this._bh, this._bl, 8), C(this._ch, this._cl, 16), C(this._dh, this._dl, 24), C(this._eh, this._el, 32), C(this._fh, this._fl, 40), C(this._gh, this._gl, 48), C(this._hh, this._hl, 56), K;
  }, Ul = a, Ul;
}
var $l, Wp;
function Ug() {
  if (Wp) return $l;
  Wp = 1;
  var n = la(), e = f0(), t = fa(), r = gi().Buffer, i = new Array(160);
  function a() {
    this.init(), this._w = i, t.call(this, 128, 112);
  }
  return n(a, e), a.prototype.init = function() {
    return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
  }, a.prototype._hash = function() {
    var u = r.allocUnsafe(48);
    function l(c, b, I) {
      u.writeInt32BE(c, I), u.writeInt32BE(b, I + 4);
    }
    return l(this._ah, this._al, 0), l(this._bh, this._bl, 8), l(this._ch, this._cl, 16), l(this._dh, this._dl, 24), l(this._eh, this._el, 32), l(this._fh, this._fl, 40), u;
  }, $l = a, $l;
}
var Yp;
function $g() {
  return Yp || (Yp = 1, (function(n) {
    n.exports = function(t) {
      var r = t.toLowerCase(), i = n.exports[r];
      if (!i)
        throw new Error(r + " is not supported (we accept pull requests)");
      return new i();
    }, n.exports.sha = Lg(), n.exports.sha1 = qg(), n.exports.sha224 = Mg(), n.exports.sha256 = c0(), n.exports.sha384 = Ug(), n.exports.sha512 = f0();
  })(Lu)), Lu.exports;
}
var h0 = $g();
class kf {
  constructor(e, t, r, i) {
    /** @internal */
    de(this, "@type", "blob");
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
var Cs;
class ru extends kf {
  /** @internal */
  constructor(t, r) {
    Me(typeof t.digest == "string");
    super(t.digest, t.length, t.content_type, t.revpos);
    ee(this, Cs);
    G(this, Cs, r);
  }
  async getContents() {
    return p(this, Cs) ? p(this, Cs).call(this, this.digest, this.content_type) : Promise.reject(Error("No BlobLoader"));
  }
}
Cs = new WeakMap();
class jg extends ru {
  constructor(e, t) {
    super(e, t);
  }
  toJSON(e) {
    return this.asAttachmentDict(0);
  }
}
var Ns;
const nh = class nh extends kf {
  /** Constructs a NewBlob.
   *  @param contents  The raw data. Will be moved into the database when the document is saved.
   *                   The constructor makes a copy of this, so any modifications afterwards
   *                   will be ignored.
   *  @param content_type  MIME type of the contents; this is optional. */
  constructor(t, r) {
    super(nh.computeDigest(t), t.length, r);
    ee(this, Ns);
    G(this, Ns, new Uint8Array(t));
  }
  async getContents() {
    return Promise.resolve(p(this, Ns));
  }
  /** For convenience, a non-async accessor for the contents. */
  get contents() {
    return p(this, Ns);
  }
  /** @internal */
  static computeDigest(t) {
    return "sha1-" + new h0.sha1().update(t).digest("base64");
  }
};
Ns = new WeakMap();
let aa = nh;
function Gb(n) {
  return n;
}
function ps(n) {
  return Array.isArray(n);
}
function Or(n) {
  return typeof n == "object" && n !== null && !ps(n) && !p0(n);
}
function p0(n) {
  return n instanceof kf;
}
function Kg(n) {
  return Or(n) ? n : void 0;
}
function d0(n) {
  return typeof n == "string" && n.length > 0 && n.length < 256 && n[0] !== "_";
}
function zg(n) {
  return typeof n == "string" && n.length > 0 && n.length < 256;
}
function v0(n) {
  if (!d0(n))
    throw Error(`"${n}" is not a valid document ID`);
}
function y0(n, e = !0) {
  return ps(n) ? Gg(n, e) : Or(n) ? Oo(n, e) : n;
}
function Gg(n, e = !0) {
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
function oa(n, e) {
  const t = typeof n;
  if (t !== typeof e)
    return !1;
  if (t !== "object" || n === null)
    return n === e;
  if (Array.isArray(n)) {
    const r = n.length;
    return !Array.isArray(e) || r !== e.length ? !1 : n.every((i, a) => oa(i, e[a]));
  } else {
    const r = n, i = e, a = Object.keys(r);
    return a.length !== Object.keys(i).length ? !1 : a.every((u) => oa(r[u], i[u]));
  }
}
const Yc = "cbl_checkpoints", Ra = "cbl_collections", jl = "cbl_blobs", Pa = "id", Ta = "seq", wo = "expires", jn = 1, ws = 64, sr = 128;
function Sa(n) {
  return n.flags !== void 0 && (n.flags & sr) !== 0;
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
function Hg(n) {
  let e = {};
  for (const t of Object.keys(n).sort())
    e[t] = Of(n[t]);
  return e;
}
function Of(n) {
  return Array.isArray(n) ? n.map((e) => Of(e)) : Or(n) ? Hg(n) : n;
}
const Co = "_id", No = "_sequence", Po = "_expires";
class us {
  constructor(e, t, r, i) {
    this.name = e, this.keypath = t, this.indexed = r, this.encrypted = i, Me(!(r && i)), (e.length === 0 || t.length === 0) && this.bad();
  }
  /** Creates a DocProperty from a public property name or path. */
  static create(e, t = !1, r = !1) {
    switch (e) {
      case Co:
        return new Kl(Co, Pa);
      case No:
        return new Kl(No, Ta);
      case Po:
        return new Kl(Po, wo);
      default:
        return e.indexOf(".") < 0 ? new g0(e, t, r) : new Wg(e, t, r);
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
class Kl extends us {
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
class g0 extends us {
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
class Wg extends g0 {
  constructor(t, r, i) {
    super(t, r, i);
    de(this, "path");
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
      if (!Or(r))
        return;
      r = r[i];
    }
    return r;
  }
}
function Ja(n) {
  return typeof n != "object" || n === null;
}
function Yg(n) {
  const e = Array.from(n, (t) => String.fromCodePoint(t)).join("");
  return btoa(e);
}
function Vg(n) {
  try {
    return Uint8Array.from(atob(n), (e) => e.codePointAt(0));
  } catch {
    return;
  }
}
const m0 = 6048e5, Jg = 864e5, I0 = 6e4, b0 = 36e5, Vp = Symbol.for("constructDateFrom");
function yn(n, e) {
  return typeof n == "function" ? n(e) : n && typeof n == "object" && Vp in n ? n[Vp](e) : n instanceof Date ? new n.constructor(e) : new Date(e);
}
function zr(n, e) {
  return yn(e || n, n);
}
function _0(n, e, t) {
  const r = zr(n, t == null ? void 0 : t.in);
  return isNaN(e) ? yn((t == null ? void 0 : t.in) || n, NaN) : (e && r.setDate(r.getDate() + e), r);
}
function Rf(n, e, t) {
  const r = zr(n, t == null ? void 0 : t.in);
  if (isNaN(e)) return yn((t == null ? void 0 : t.in) || n, NaN);
  if (!e)
    return r;
  const i = r.getDate(), a = yn((t == null ? void 0 : t.in) || n, r.getTime());
  a.setMonth(r.getMonth() + e + 1, 0);
  const u = a.getDate();
  return i >= u ? a : (r.setFullYear(
    a.getFullYear(),
    a.getMonth(),
    i
  ), r);
}
function Tf(n, e, t) {
  return yn((t == null ? void 0 : t.in) || n, +zr(n) + e);
}
function Zg(n, e, t) {
  return Tf(n, e * b0, t);
}
let Qg = {};
function Xg() {
  return Qg;
}
function Vc(n, e) {
  var l, c, b, I;
  const t = Xg(), r = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (l = e == null ? void 0 : e.locale) == null ? void 0 : l.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((I = (b = t.locale) == null ? void 0 : b.options) == null ? void 0 : I.weekStartsOn) ?? 0, i = zr(n, e == null ? void 0 : e.in), a = i.getDay(), u = (a < r ? 7 : 0) + a - r;
  return i.setDate(i.getDate() - u), i.setHours(0, 0, 0, 0), i;
}
function Da(n, e) {
  return Vc(n, { ...e, weekStartsOn: 1 });
}
function Do(n, e) {
  const t = zr(n, e == null ? void 0 : e.in), r = t.getFullYear(), i = yn(t, 0);
  i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const a = Da(i), u = yn(t, 0);
  u.setFullYear(r, 0, 4), u.setHours(0, 0, 0, 0);
  const l = Da(u);
  return t.getTime() >= a.getTime() ? r + 1 : t.getTime() >= l.getTime() ? r : r - 1;
}
function ua(n) {
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
  const t = yn.bind(
    null,
    n || e.find((r) => typeof r == "object")
  );
  return e.map(t);
}
function Jp(n, e) {
  const t = zr(n, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function xo(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = Jp(r), u = Jp(i), l = +a - ua(a), c = +u - ua(u);
  return Math.round((l - c) / Jg);
}
function Zp(n, e) {
  const t = Do(n, e), r = yn((e == null ? void 0 : e.in) || n, 0);
  return r.setFullYear(t, 0, 4), r.setHours(0, 0, 0, 0), Da(r);
}
function em(n, e, t) {
  let r = zr(n, t == null ? void 0 : t.in);
  const i = xo(
    r,
    Zp(r, t)
  ), a = yn((t == null ? void 0 : t.in) || n, 0);
  return a.setFullYear(e, 0, 4), a.setHours(0, 0, 0, 0), r = Zp(a), r.setDate(r.getDate() + i), r;
}
function tm(n, e, t) {
  return em(n, Do(n, t) + e, t);
}
function rm(n, e, t) {
  const r = zr(n, t == null ? void 0 : t.in);
  return r.setTime(r.getTime() + e * I0), r;
}
function nm(n, e, t) {
  return Rf(n, e * 3, t);
}
function im(n, e, t) {
  return Tf(n, e * 1e3, t);
}
function sm(n, e, t) {
  return _0(n, e * 7, t);
}
function am(n, e, t) {
  return Rf(n, e * 12, t);
}
function om(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  );
  return Do(r, t) - Do(i, t);
}
function um(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = Da(r), u = Da(i), l = +a - ua(a), c = +u - ua(u);
  return Math.round((l - c) / m0);
}
function lm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = r.getFullYear() - i.getFullYear(), u = r.getMonth() - i.getMonth();
  return a * 12 + u;
}
function Qp(n, e) {
  const t = zr(n, e == null ? void 0 : e.in);
  return Math.trunc(t.getMonth() / 3) + 1;
}
function cm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = r.getFullYear() - i.getFullYear(), u = Qp(r) - Qp(i);
  return a * 4 + u;
}
function fm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = Vc(r, t), u = Vc(i, t), l = +a - ua(a), c = +u - ua(u);
  return Math.round((l - c) / m0);
}
function w0(n, e, t) {
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
function hm(n, e, t) {
  const [r, i] = mi(
    t == null ? void 0 : t.in,
    n,
    e
  ), a = (+r - +i) / b0;
  return Cf(t == null ? void 0 : t.roundingMethod)(a);
}
function Nf(n, e) {
  return +zr(n) - +zr(e);
}
function pm(n, e, t) {
  const r = Nf(n, e) / I0;
  return Cf(t == null ? void 0 : t.roundingMethod)(r);
}
function dm(n, e, t) {
  const r = Nf(n, e) / 1e3;
  return Cf(t == null ? void 0 : t.roundingMethod)(r);
}
function vm(n, e, t = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: n,
    timeZoneName: t
  }).format(e).split(/\s/g).slice(2).join(" ");
}
const zl = {}, Aa = {};
function Ti(n, e) {
  try {
    const r = (zl[n] || (zl[n] = new Intl.DateTimeFormat("en-US", {
      timeZone: n,
      timeZoneName: "longOffset"
    }).format))(e).split("GMT")[1];
    return r in Aa ? Aa[r] : Xp(r, r.split(":"));
  } catch {
    if (n in Aa) return Aa[n];
    const t = n == null ? void 0 : n.match(ym);
    return t ? Xp(n, t.slice(1)) : NaN;
  }
}
const ym = /([+-]\d\d):?(\d\d)?/;
function Xp(n, e) {
  const t = +(e[0] || 0), r = +(e[1] || 0), i = +(e[2] || 0) / 60;
  return Aa[n] = t * 60 + r > 0 ? t * 60 + r + i : t * 60 - r - i;
}
class dn extends Date {
  //#region static
  constructor(...e) {
    super(), e.length > 1 && typeof e[e.length - 1] == "string" && (this.timeZone = e.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(Ti(this.timeZone, this)) ? this.setTime(NaN) : e.length ? typeof e[0] == "number" && (e.length === 1 || e.length === 2 && typeof e[1] != "number") ? this.setTime(e[0]) : typeof e[0] == "string" ? this.setTime(+new Date(e[0])) : e[0] instanceof Date ? this.setTime(+e[0]) : (this.setTime(+new Date(...e)), x0(this), Jc(this)) : this.setTime(Date.now());
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
    const e = -Ti(this.timeZone, this);
    return e > 0 ? Math.floor(e) : Math.ceil(e);
  }
  //#endregion
  //#region time
  setTime(e) {
    return Date.prototype.setTime.apply(this, arguments), Jc(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](e) {
    return new dn(+new Date(e), this.timeZone);
  }
  //#endregion
}
const ed = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((n) => {
  if (!ed.test(n)) return;
  const e = n.replace(ed, "$1UTC");
  dn.prototype[e] && (n.startsWith("get") ? dn.prototype[n] = function() {
    return this.internal[e]();
  } : (dn.prototype[n] = function() {
    return Date.prototype[e].apply(this.internal, arguments), gm(this), +this;
  }, dn.prototype[e] = function() {
    return Date.prototype[e].apply(this, arguments), Jc(this), +this;
  }));
});
function Jc(n) {
  n.internal.setTime(+n), n.internal.setUTCSeconds(n.internal.getUTCSeconds() - Math.round(-Ti(n.timeZone, n) * 60));
}
function gm(n) {
  Date.prototype.setFullYear.call(n, n.internal.getUTCFullYear(), n.internal.getUTCMonth(), n.internal.getUTCDate()), Date.prototype.setHours.call(n, n.internal.getUTCHours(), n.internal.getUTCMinutes(), n.internal.getUTCSeconds(), n.internal.getUTCMilliseconds()), x0(n);
}
function x0(n) {
  const e = Ti(n.timeZone, n), t = e > 0 ? Math.floor(e) : Math.ceil(e), r = /* @__PURE__ */ new Date(+n);
  r.setUTCHours(r.getUTCHours() - 1);
  const i = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset(), a = -(/* @__PURE__ */ new Date(+r)).getTimezoneOffset(), u = i - a, l = Date.prototype.getHours.apply(n) !== n.internal.getUTCHours();
  u && l && n.internal.setUTCMinutes(n.internal.getUTCMinutes() + u);
  const c = i - t;
  c && Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + c);
  const b = /* @__PURE__ */ new Date(+n);
  b.setUTCSeconds(0);
  const I = i > 0 ? b.getSeconds() : (b.getSeconds() - 60) % 60, w = Math.round(-(Ti(n.timeZone, n) * 60)) % 60;
  (w || I) && (n.internal.setUTCSeconds(n.internal.getUTCSeconds() + w), Date.prototype.setUTCSeconds.call(n, Date.prototype.getUTCSeconds.call(n) + w + I));
  const E = Ti(n.timeZone, n), k = E > 0 ? Math.floor(E) : Math.ceil(E), K = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset() - k, C = k !== t, M = K - c;
  if (C && M) {
    Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + M);
    const Z = Ti(n.timeZone, n), X = Z > 0 ? Math.floor(Z) : Math.ceil(Z), ue = k - X;
    ue && (n.internal.setUTCMinutes(n.internal.getUTCMinutes() + ue), Date.prototype.setUTCMinutes.call(n, Date.prototype.getUTCMinutes.call(n) + ue));
  }
}
class Ci extends dn {
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
    return `${e} GMT${t}${r}${i} (${vm(this.timeZone, this)})`;
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
var Gl, td;
function E0() {
  if (td) return Gl;
  td = 1;
  var n = Object.prototype.toString;
  return Gl = function(t) {
    var r = n.call(t), i = r === "[object Arguments]";
    return i || (i = r !== "[object Array]" && t !== null && typeof t == "object" && typeof t.length == "number" && t.length >= 0 && n.call(t.callee) === "[object Function]"), i;
  }, Gl;
}
var Hl, rd;
function mm() {
  if (rd) return Hl;
  rd = 1;
  var n;
  if (!Object.keys) {
    var e = Object.prototype.hasOwnProperty, t = Object.prototype.toString, r = E0(), i = Object.prototype.propertyIsEnumerable, a = !i.call({ toString: null }, "toString"), u = i.call(function() {
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
    }, I = (function() {
      if (typeof window > "u")
        return !1;
      for (var E in window)
        try {
          if (!b["$" + E] && e.call(window, E) && window[E] !== null && typeof window[E] == "object")
            try {
              c(window[E]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    })(), w = function(E) {
      if (typeof window > "u" || !I)
        return c(E);
      try {
        return c(E);
      } catch {
        return !1;
      }
    };
    n = function(k) {
      var B = k !== null && typeof k == "object", K = t.call(k) === "[object Function]", C = r(k), M = B && t.call(k) === "[object String]", Z = [];
      if (!B && !K && !C)
        throw new TypeError("Object.keys called on a non-object");
      var X = u && K;
      if (M && k.length > 0 && !e.call(k, 0))
        for (var ue = 0; ue < k.length; ++ue)
          Z.push(String(ue));
      if (C && k.length > 0)
        for (var ce = 0; ce < k.length; ++ce)
          Z.push(String(ce));
      else
        for (var he in k)
          !(X && he === "prototype") && e.call(k, he) && Z.push(String(he));
      if (a)
        for (var oe = w(k), ke = 0; ke < l.length; ++ke)
          !(oe && l[ke] === "constructor") && e.call(k, l[ke]) && Z.push(l[ke]);
      return Z;
    };
  }
  return Hl = n, Hl;
}
var Wl, nd;
function Im() {
  if (nd) return Wl;
  nd = 1;
  var n = Array.prototype.slice, e = E0(), t = Object.keys, r = t ? function(u) {
    return t(u);
  } : mm(), i = Object.keys;
  return r.shim = function() {
    if (Object.keys) {
      var u = (function() {
        var l = Object.keys(arguments);
        return l && l.length === arguments.length;
      })(1, 2);
      u || (Object.keys = function(c) {
        return e(c) ? i(n.call(c)) : i(c);
      });
    } else
      Object.keys = r;
    return Object.keys || r;
  }, Wl = r, Wl;
}
var Yl, id;
function S0() {
  if (id) return Yl;
  id = 1;
  var n = Im(), e = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", t = Object.prototype.toString, r = Array.prototype.concat, i = /* @__PURE__ */ o0(), a = function(b) {
    return typeof b == "function" && t.call(b) === "[object Function]";
  }, u = /* @__PURE__ */ u0()(), l = function(b, I, w, E) {
    if (I in b) {
      if (E === !0) {
        if (b[I] === w)
          return;
      } else if (!a(E) || !E())
        return;
    }
    u ? i(b, I, w, !0) : i(b, I, w);
  }, c = function(b, I) {
    var w = arguments.length > 2 ? arguments[2] : {}, E = n(I);
    e && (E = r.call(E, Object.getOwnPropertySymbols(I)));
    for (var k = 0; k < E.length; k += 1)
      l(b, E[k], I[E[k]], w[E[k]]);
  };
  return c.supportsDescriptors = !!u, Yl = c, Yl;
}
var Vl, sd;
function bm() {
  if (sd) return Vl;
  sd = 1;
  var n = /* @__PURE__ */ _f();
  return Vl = function(t) {
    return (typeof t == "number" || typeof t == "bigint") && !n(t) && t !== 1 / 0 && t !== -1 / 0;
  }, Vl;
}
var Jl, ad;
function Pf() {
  if (ad) return Jl;
  ad = 1;
  var n = /* @__PURE__ */ e0(), e = /* @__PURE__ */ eu(), t = /* @__PURE__ */ _f(), r = /* @__PURE__ */ bm();
  return Jl = function(a) {
    if (typeof a != "number" || t(a) || !r(a))
      return !1;
    var u = n(a);
    return e(u) === u;
  }, Jl;
}
var Zl, od;
function A0() {
  if (od) return Zl;
  od = 1;
  var n = /* @__PURE__ */ or(), e = /* @__PURE__ */ Pn(), t = /* @__PURE__ */ Pf(), r = e("Number.prototype.toString");
  return Zl = function(a, u) {
    if (typeof a != "number")
      throw new n("Assertion failed: `x` must be a Number");
    if (!t(u) || u < 2 || u > 36)
      throw new n("Assertion failed: `radix` must be an integer >= 2 and <= 36");
    return r(a, u);
  }, Zl;
}
var Ql, ud;
function _m() {
  if (ud) return Ql;
  ud = 1;
  var n = /* @__PURE__ */ Pn(), e = /* @__PURE__ */ or(), t = /* @__PURE__ */ Pf(), r = n("String.prototype.slice");
  return Ql = function(a, u, l) {
    if (typeof a != "string")
      throw new e("Assertion failed: `string` must be a String");
    if (typeof u != "string")
      throw new e("Assertion failed: `searchValue` must be a String");
    if (!t(l) || l < 0)
      throw new e("Assertion failed: `fromIndex` must be a non-negative integer");
    var c = a.length;
    if (u === "" && l <= c)
      return l;
    for (var b = u.length, I = l; I <= c - b; I += 1) {
      var w = r(a, I, I + b);
      if (w === u)
        return I;
    }
    return -1;
  }, Ql;
}
var Xl, ld;
function k0() {
  if (ld) return Xl;
  ld = 1;
  var n = /* @__PURE__ */ or(), e = /* @__PURE__ */ Pn(), t = /* @__PURE__ */ Pf(), r = e("String.prototype.slice");
  return Xl = function(a, u, l, c) {
    if (typeof a != "string")
      throw new n("Assertion failed: `S` must be a String");
    if (!t(u) || u < 0)
      throw new n("Assertion failed: `maxLength` must be a non-negative integer");
    if (typeof l != "string")
      throw new n("Assertion failed: `fillString` must be a String");
    if (c !== "start" && c !== "end" && c !== "START" && c !== "END")
      throw new n("Assertion failed: `placement` must be ~START~ or ~END~");
    var b = a.length;
    if (u <= b || l === "")
      return a;
    for (var I = u - b, w = ""; w.length < I; )
      w += l;
    return w = r(w, 0, I), c === "start" || c === "START" ? w + a : a + w;
  }, Xl;
}
var ec, cd;
function wm() {
  if (cd) return ec;
  cd = 1;
  var n = /* @__PURE__ */ or(), e = /* @__PURE__ */ Pn(), t = e("String.prototype.charCodeAt"), r = e("Number.prototype.toString"), i = e("String.prototype.toLowerCase"), a = /* @__PURE__ */ k0();
  return ec = function(l) {
    if (typeof l != "string" || l.length !== 1)
      throw new n("Assertion failed: `C` must be a single code unit");
    var c = t(l, 0);
    if (c > 65535)
      throw new n("`Assertion failed: numeric value of `C` must be <= 0xFFFF");
    return "\\u" + a(i(r(c, 16)), 4, "0", "start");
  }, ec;
}
var tc, fd;
function xm() {
  if (fd) return tc;
  fd = 1;
  var n = /* @__PURE__ */ eu();
  return tc = function(t) {
    return typeof t == "bigint" ? t : n(t);
  }, tc;
}
var rc, hd;
function Em() {
  if (hd) return rc;
  hd = 1;
  var n = /* @__PURE__ */ eu();
  return rc = function(t, r) {
    var i = t % r;
    return n(i >= 0 ? i : i + r);
  }, rc;
}
var nc, pd;
function Sm() {
  return pd || (pd = 1, nc = /* @__PURE__ */ Em()), nc;
}
var ic, dd;
function Am() {
  if (dd) return ic;
  dd = 1;
  var n = /* @__PURE__ */ Sm();
  return ic = function(t, r) {
    return n(t, r);
  }, ic;
}
var sc, vd;
function O0() {
  return vd || (vd = 1, sc = function(e) {
    return typeof e == "number" && e >= 0 && e <= 1114111 && (e | 0) === e;
  }), sc;
}
var ac, yd;
function km() {
  if (yd) return ac;
  yd = 1;
  var n = /* @__PURE__ */ Va(), e = /* @__PURE__ */ or(), t = n("%String.fromCharCode%"), r = /* @__PURE__ */ xm(), i = /* @__PURE__ */ Am(), a = /* @__PURE__ */ O0();
  return ac = function(l) {
    if (!a(l))
      throw new e("Assertion failed: `cp` must be >= 0 and <= 0x10FFFF");
    if (l <= 65535)
      return t(l);
    var c = t(r((l - 65536) / 1024) + 55296), b = t(i(l - 65536, 1024) + 56320);
    return c + b;
  }, ac;
}
var oc, gd;
function Df() {
  return gd || (gd = 1, oc = function(e) {
    return typeof e == "number" && e >= 55296 && e <= 56319;
  }), oc;
}
var uc, md;
function Bf() {
  return md || (md = 1, uc = function(e) {
    return typeof e == "number" && e >= 56320 && e <= 57343;
  }), uc;
}
var lc, Id;
function Om() {
  if (Id) return lc;
  Id = 1;
  var n = /* @__PURE__ */ Pn(), e = l0()(), t = /* @__PURE__ */ a0(), r = /* @__PURE__ */ ca(), i;
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
      ), B = k && t(k, "value");
      if (!B)
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
    var b = n("Object.prototype.toString"), I = "[object RegExp]";
    i = function(E) {
      return !E || typeof E != "object" && typeof E != "function" ? !1 : b(E) === I;
    };
  }
  return lc = i, lc;
}
var cc, bd;
function R0() {
  if (bd) return cc;
  bd = 1;
  var n = /* @__PURE__ */ Pn(), e = Om(), t = n("RegExp.prototype.exec"), r = /* @__PURE__ */ or();
  return cc = function(a) {
    if (!e(a))
      throw new r("`regex` must be a RegExp");
    return function(l) {
      return t(a, l) !== null;
    };
  }, cc;
}
var fc, _d;
function Rm() {
  if (_d) return fc;
  _d = 1;
  var n = /* @__PURE__ */ A0(), e = /* @__PURE__ */ _m(), t = /* @__PURE__ */ k0(), r = /* @__PURE__ */ wm(), i = /* @__PURE__ */ km(), a = /* @__PURE__ */ Df(), u = /* @__PURE__ */ Bf(), l = /* @__PURE__ */ or(), c = /* @__PURE__ */ O0(), b = Sf(), I = /* @__PURE__ */ R0(), w = I(/^\s$/), E = I(/^[\n\r\u2028\u2029]$/), k = "^$\\.*+?()[]{}|", B = ",-=<>#&!%:;@~'`\"", K = {
    "	": "t",
    "\n": "n",
    "\v": "v",
    "\f": "f",
    "\r": "r",
    __proto__: null
  };
  return fc = function(M) {
    if (!c(M))
      throw new l("Assertion failed: `c` must be a valid Unicode code point");
    var Z = i(M);
    if (e(k, Z, 0) > -1 || Z === "/")
      return "\\" + Z;
    if (Z in K)
      return "\\" + K[Z];
    if (e(B, Z, 0) > -1 || w(Z) || E(Z) || a(M) || u(M)) {
      if (M < 255) {
        var X = n(M, 16);
        return "\\x" + t(X, 2, "0", "START");
      }
      var ue = "", ce = Z;
      return b(ce, function(he) {
        ue += r(he);
      }), ue;
    }
    return Z;
  }, fc;
}
var hc, wd;
function Tm() {
  if (wd) return hc;
  wd = 1;
  var n = /* @__PURE__ */ Va(), e = /* @__PURE__ */ or(), t = n("%String.fromCharCode%"), r = /* @__PURE__ */ Df(), i = /* @__PURE__ */ Bf();
  return hc = function(u, l) {
    if (!r(u) || !i(l))
      throw new e("Assertion failed: `lead` must be a leading surrogate char code, and `trail` must be a trailing surrogate char code");
    return t(u) + t(l);
  }, hc;
}
var pc, xd;
function Cm() {
  if (xd) return pc;
  xd = 1;
  var n = /* @__PURE__ */ or(), e = /* @__PURE__ */ Pn(), t = /* @__PURE__ */ Df(), r = /* @__PURE__ */ Bf(), i = /* @__PURE__ */ Tm(), a = e("String.prototype.charAt"), u = e("String.prototype.charCodeAt");
  return pc = function(c, b) {
    if (typeof c != "string")
      throw new n("Assertion failed: `string` must be a String");
    var I = c.length;
    if (b < 0 || b >= I)
      throw new n("Assertion failed: `position` must be >= 0, and < the length of `string`");
    var w = u(c, b), E = a(c, b), k = t(w), B = r(w);
    if (!k && !B)
      return {
        "[[CodePoint]]": E,
        "[[CodeUnitCount]]": 1,
        "[[IsUnpairedSurrogate]]": !1
      };
    if (B || b + 1 === I)
      return {
        "[[CodePoint]]": E,
        "[[CodeUnitCount]]": 1,
        "[[IsUnpairedSurrogate]]": !0
      };
    var K = u(c, b + 1);
    return r(K) ? {
      "[[CodePoint]]": i(w, K),
      "[[CodeUnitCount]]": 2,
      "[[IsUnpairedSurrogate]]": !1
    } : {
      "[[CodePoint]]": E,
      "[[CodeUnitCount]]": 1,
      "[[IsUnpairedSurrogate]]": !0
    };
  }, pc;
}
var dc, Ed;
function Nm() {
  if (Ed) return dc;
  Ed = 1;
  var n = /* @__PURE__ */ or(), e = /* @__PURE__ */ Cm();
  return dc = function(r) {
    if (typeof r != "string")
      throw new n("Assertion failed: `string` must be a String");
    for (var i = [], a = r.length, u = 0; u < a; ) {
      var l = e(r, u);
      i[i.length] = l["[[CodePoint]]"], u += l["[[CodeUnitCount]]"];
    }
    return i;
  }, dc;
}
var vc, Sd;
function Pm() {
  if (Sd) return vc;
  Sd = 1;
  var n = /* @__PURE__ */ Va(), e = Af(), t = e(n("String.prototype.indexOf"));
  return vc = function(i, a) {
    var u = n(i, !!a);
    return typeof u == "function" && t(i, ".prototype.") > -1 ? e(u) : u;
  }, vc;
}
var yc, Ad;
function T0() {
  if (Ad) return yc;
  Ad = 1;
  var n = Rm(), e = /* @__PURE__ */ A0(), t = /* @__PURE__ */ Nm(), r = /* @__PURE__ */ R0(), i = Sf(), a = /* @__PURE__ */ or(), u = r(/^[\da-zA-Z]$/), l = Pm(), c = l("String.prototype.charCodeAt"), b = function(w) {
    var E = c(w, 0);
    if (E < 55296 || E > 56319 || w.length === 1)
      return E;
    var k = c(w, 1);
    return k < 56320 || k > 57343 ? E : (E - 55296) * 1024 + (k - 56320) + 65536;
  };
  return yc = function(w) {
    if (typeof w != "string")
      throw new a("`S` must be a String");
    var E = "", k = t(w);
    return i(k, function(B) {
      if (E === "" && u(B)) {
        var K = e(b(B), 16);
        E += "\\x" + K;
      } else
        E += n(b(B));
    }), E;
  }, yc;
}
var gc, kd;
function C0() {
  if (kd) return gc;
  kd = 1;
  var n = T0();
  return gc = function() {
    return RegExp.escape || n;
  }, gc;
}
var mc, Od;
function Dm() {
  if (Od) return mc;
  Od = 1;
  var n = S0(), e = C0()();
  return mc = function() {
    return n(RegExp, {
      escape: e
    }), RegExp.escape;
  }, mc;
}
var Ic, Rd;
function Bm() {
  if (Rd) return Ic;
  Rd = 1;
  var n = S0(), e = Af(), t = T0(), r = C0(), i = Dm(), a = e(t, null);
  return n(a, {
    getPolyfill: r,
    implementation: t,
    method: t,
    // TODO: remove at semver-major
    shim: i
  }), Ic = a, Ic;
}
var Fm = Bm();
const Lm = /* @__PURE__ */ bf(Fm);
var Vv;
const qm = ((Vv = Object.getOwnPropertyDescriptor(RegExp, "escape")) == null ? void 0 : Vv.value) ?? Lm;
function Mm(n) {
  if (!Array.isArray(n)) return null;
  let e = 0, t = 0;
  for (const r of n)
    typeof r == "number" && (e += r, t += 1);
  return t > 0 ? e / t : null;
}
function N0(n, e) {
  return Array.isArray(n) ? Lo(e) < 5 ? n.includes(e) : n.some((t) => Nn(t, e)) : null;
}
function Um(n) {
  if (!Array.isArray(n)) return null;
  let e = 0;
  for (const t of n)
    t !== null && ++e;
  return e;
}
function $m(n) {
  if (!Array.isArray(n)) return null;
  for (const e of n)
    if (e !== null) return e;
  return null;
}
function jm(n) {
  return Array.isArray(n) ? n.length : null;
}
function P0(n, e) {
  if (!Array.isArray(n)) return null;
  let t = null, r = !0;
  for (const i of n)
    i !== null && ((r || Vt(i, t) === e) && (t = i), r = !1);
  return t;
}
function Km(n) {
  return P0(n, 1);
}
function zm(n) {
  return P0(n, -1);
}
function Gm(n) {
  if (!Array.isArray(n)) return null;
  let e = 0;
  for (const t of n)
    typeof t == "number" && (e += t);
  return e;
}
function Vt(n, e) {
  const t = Lo(n), r = Lo(e);
  if (t !== r)
    return Math.sign(t - r);
  switch (t) {
    case 5: {
      const i = n, a = e, u = i.length, l = a.length, c = Math.min(u, l);
      for (let b = 0; b < c; ++b) {
        const I = Vt(i[b], a[b]);
        if (I !== 0)
          return I;
      }
      return Math.sign(u - l);
    }
    case 6: {
      const i = n, a = e, u = Object.getOwnPropertyNames(i), l = Object.getOwnPropertyNames(a), c = u.length, b = Math.sign(c - l.length);
      if (b !== 0) return b;
      u.sort(), l.sort();
      for (let I = 0; I < c; ++I) {
        const w = u[I], E = l[I];
        if (w !== E)
          return w > E ? 1 : -1;
        const k = Vt(i[w], a[E]);
        if (k !== 0) return k;
      }
      return 0;
    }
    default:
      return n < e ? -1 : n > e ? 1 : 0;
  }
}
function Nn(n, e) {
  return n === void 0 || e === void 0 ? n === e : oa(n, e);
}
function Td(n, e) {
  let t;
  for (const r of n) {
    const i = r();
    i != null && (t === void 0 || Vt(i, t) === e) && (t = i);
  }
  return t ?? null;
}
function Hm(n, e) {
  if (!(e === void 0 || Nn(n, e)))
    return e === null ? null : n;
}
function Wm(n, e) {
  if (!(n === void 0 || e === void 0))
    return e === null || Nn(n, e) ? null : n;
}
const D0 = { millennium: 1e3, century: 100, decade: 10 }, Ym = {
  year: w0,
  iso_year: om,
  quarter: cm,
  month: lm,
  week: fm,
  iso_week: um,
  day: xo,
  day_of_year: xo,
  doy: xo,
  hour: hm,
  minute: pm,
  second: dm,
  millisecond: Nf
}, Vm = {
  year: am,
  iso_year: tm,
  quarter: nm,
  month: Rf,
  week: sm,
  day: _0,
  hour: Zg,
  minute: rm,
  second: im,
  millisecond: Tf
};
function Jm(n, e, t) {
  let r = D0[t];
  r !== void 0 && (e *= r, t = "year");
  const i = Vm[t];
  if (i === void 0)
    return console.error(`date_add_str(): Unsupported date part "${t}"`), null;
  const a = i(n, e);
  return typeof n == "string" ? a.toISOString() : a.valueOf();
}
function Zm(n, e, t) {
  const r = Ym[t];
  if (r !== void 0)
    return r(n, e);
  let i = D0[t];
  return i !== void 0 ? Math.trunc(w0(n, e) / i) : (console.error(`date_diff_str(): Unsupported date part "${t}"`), null);
}
function B0(n) {
  return new Ci(n).toISOString();
}
function Ff(n) {
  return new Date(n).toISOString();
}
function F0(n, e) {
  if (e === void 0)
    return B0(n);
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
function Qm(n) {
  const e = Date.parse(n);
  return isNaN(e) ? null : e;
}
function Xm(n) {
  const e = Date.parse(n);
  return isNaN(e) ? null : Ff(e);
}
function e1(n, e) {
  const t = Date.parse(n);
  return isNaN(t) ? null : F0(t, e);
}
function t1(n, e) {
  let t = n / e;
  return isFinite(t) ? (n === Math.floor(n) && e === Math.floor(e) && (t = Math.floor(t)), t) : null;
}
function r1(n, e, t) {
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
function n1(n, e) {
  const t = Bo(n), r = Bo(e);
  if (t === void 0 || r === void 0)
    return null;
  const i = t.length;
  if (r.length !== i)
    return null;
  let a = 0, u = 0, l = 0;
  for (let c = 0; c < i; ++c) {
    const b = t[c], I = r[c];
    a += b * b, u += b * I, l += I * I;
  }
  return 1 - u / Math.sqrt(a * l);
}
function Bo(n) {
  if (Array.isArray(n))
    return n;
  if (typeof n == "string") {
    const e = Vg(n);
    return e === void 0 || e.length % 4 !== 0 ? void 0 : new Float32Array(e.buffer);
  } else
    return;
}
function i1(n, e) {
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
function Cd(n, e = 0) {
  return Lf(n, e, Math.round);
}
function L0(n, e = 0) {
  return Lf(n, e, (t) => {
    const r = Math.floor(t);
    return t - r === 0.5 ? r % 2 ? r + 1 : r : Math.round(t);
  });
}
function s1(n, e) {
  return Lf(n, e, Math.trunc);
}
function a1(n, e) {
  const [t, r] = qf(e);
  switch (t) {
    case 0:
      return n === r;
    case 1:
      return n.startsWith(r);
    case 2:
      return n.endsWith(r);
    default:
      return q0(e).test(n);
  }
}
function bc(n) {
  return n.replaceAll(/\\(.)/g, "$1");
}
function q0(n) {
  const e = n.split(/([%_])/), t = e.length;
  for (let r = 0; r < t; r++) {
    const i = e[r];
    r & 1 ? e[r] = i === "%" ? ".*" : "." : e[r] = qm(i);
  }
  return new RegExp(e.join(""));
}
function qf(n) {
  const e = n.replaceAll(/\\./g, "##");
  if (e.indexOf("_") >= 0)
    return [3, n];
  let t = e.indexOf("%");
  if (t < 0)
    return [0, bc(n)];
  if (e.lastIndexOf("%") === t) {
    if (t === 0)
      return [2, bc(n.slice(1))];
    if (t === e.length - 1)
      return [1, bc(n.slice(0, -1))];
  }
  return [3, n];
}
function o1(n) {
  const e = n.length;
  for (let t = 0; t < e; ++t)
    if (n.charCodeAt(t) > 127)
      return new TextEncoder().encode(n).length;
  return e;
}
function M0(n, e) {
  const t = n.length;
  for (let r = 0; r < t; ++r)
    if (!e.includes(n[r]))
      return n.slice(r);
  return "";
}
function U0(n, e) {
  const t = n.length;
  for (let r = t - 1; r >= 0; --r)
    if (!e.includes(n[r]))
      return n.slice(0, r + 1);
  return "";
}
function u1(n, e) {
  return M0(U0(n, e), e);
}
function Nd(n) {
  return typeof n == "boolean";
}
function Pd(n) {
  return typeof n == "number";
}
function Dd(n) {
  return typeof n == "string";
}
function Bd(n) {
  return typeof n == "object" && !Array.isArray(n);
}
function _c(n) {
  return n != null;
}
function Fd(n) {
  const e = typeof n;
  return e === "boolean" || e === "number" || e === "string";
}
function Ld(n) {
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
function qd(n) {
  return n ? typeof n != "object" ? !0 : Array.isArray(n) ? n.length > 0 : Object.getOwnPropertyNames(n).length > 0 : !1;
}
function Md(n) {
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
function Ud(n) {
  return typeof n == "object" && !Array.isArray(n) ? n : {};
}
function $d(n) {
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
function jd(n) {
  return l1[Lo(n)];
}
const l1 = ["missing", "null", "boolean", "number", "string", "array", "object"];
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
class ha {
  constructor(e, t) {
    this.sourceExpression = e, this.compiledArg = t;
  }
  /** Adds the current value of the compiledArg to my state. */
  accumulate() {
    this.add(this.compiledArg());
  }
}
class Mf extends ha {
  constructor() {
    super(...arguments);
    de(this, "result", []);
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
var Ni, Ps;
const ih = class ih extends ha {
  constructor() {
    super(...arguments);
    ee(this, Ni, 0);
    ee(this, Ps, 0);
  }
  clone() {
    return new ih(this.sourceExpression, this.compiledArg);
  }
  reset() {
    G(this, Ni, G(this, Ps, 0));
  }
  add(t) {
    typeof t == "number" && (G(this, Ni, p(this, Ni) + 1), G(this, Ps, p(this, Ps) + t));
  }
  get result() {
    return p(this, Ni) ? p(this, Ps) / p(this, Ni) : null;
  }
};
Ni = new WeakMap(), Ps = new WeakMap();
let Zc = ih;
class Uf extends ha {
  constructor() {
    super(...arguments);
    de(this, "result", 0);
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
class $f extends ha {
  constructor() {
    super(...arguments);
    de(this, "result", null);
  }
  clone() {
    return new $f(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = null;
  }
  add(t) {
    t != null && (this.result === null || Vt(t, this.result) > 0) && (this.result = t);
  }
}
class jf extends ha {
  constructor() {
    super(...arguments);
    de(this, "result", null);
  }
  clone() {
    return new jf(this.sourceExpression, this.compiledArg);
  }
  reset() {
    this.result = null;
  }
  add(t) {
    t != null && (this.result === null || Vt(t, this.result) < 0) && (this.result = t);
  }
}
class Kf extends ha {
  constructor() {
    super(...arguments);
    de(this, "result", 0);
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
function c1(n) {
  Kd(n);
  for (let e of n.FROM)
    Kd(e);
  n.WHAT = n.WHAT.map((e) => typeof e == "string" ? ["." + e] : e), $0(n, (e, t) => {
    const r = e[0];
    return (r === "." || r === "$" || r === "?") && e.length > 1 ? (t.splice(1, 0, ...e.substring(1).split(".")), t[0] = e[0]) : t[0] = e.toUpperCase(), !0;
  });
}
function f1(n, e, t) {
  $0(n, (r, i) => {
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
function Kd(n) {
  for (const e of Object.getOwnPropertyNames(n)) {
    const t = e.toUpperCase();
    if (t !== e) {
      if (t in n) throw Error(`Conflicting keys "${e}" and "${t}"`);
      n[t] = n[e], delete n[e];
    }
  }
}
function $0(n, e) {
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
    if (Ja(r))
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
function wc(n) {
  let e = /* @__PURE__ */ new Set();
  return zf(n, (t, r) => ((t === "." || t === "META()") && e.add(r[1]), !0)), e;
}
function zd(n) {
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
function h1(n) {
  return n && Object.assign({}, n);
}
function j0(n, e) {
  const t = [];
  for (; e-- > 0; )
    t.push(n());
  return t;
}
function K0(n, e) {
  return new Array(e + 1).join(n);
}
function nu(n, e) {
  return j0(() => n, e);
}
function Xc(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const r = n[t];
    n.lastIndexOf(r) !== t && e.indexOf(r) < 0 && e.push(r);
  }
  return e;
}
function z0(n) {
  const e = [];
  return n.forEach((t) => {
    e.indexOf(t) < 0 && e.push(t);
  }), e;
}
function ls(n) {
  const e = n[0];
  return e === e.toUpperCase();
}
function G0(n) {
  return !ls(n);
}
function H0(n, e, t) {
  const r = t || " ";
  return n.length < e ? K0(r, e - n.length) + n : n;
}
function ds() {
  this.strings = [];
}
ds.prototype.append = function(n) {
  this.strings.push(n);
};
ds.prototype.contents = function() {
  return this.strings.join("");
};
const xc = (n) => String.fromCodePoint(parseInt(n, 16));
function W0(n) {
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
        return xc(n.slice(2, 4));
      case "u":
        return n.charAt(2) === "{" ? xc(n.slice(3, -1)) : xc(n.slice(2, 6));
      default:
        return n.charAt(1);
    }
  else
    return n;
}
function Y0(n) {
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
function V0(n, e = "unexpected null value") {
  if (n == null)
    throw new Error(e);
  return n;
}
const p1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StringBuffer: ds,
  abstract: br,
  assert: Ii,
  checkNotNull: V0,
  clone: h1,
  copyWithoutDuplicates: z0,
  defineLazyProperty: Qc,
  getDuplicates: Xc,
  isLexical: G0,
  isSyntactic: ls,
  padLeft: H0,
  repeat: nu,
  repeatFn: j0,
  repeatStr: K0,
  unescapeCodePoint: W0,
  unexpectedObjToString: Y0
}, Symbol.toStringTag, { value: "Module" })), d1 = {
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
class He {
  constructor() {
    if (this.constructor === He)
      throw new Error("PExpr cannot be instantiated -- it's abstract");
  }
  // Set the `source` property to the interval containing the source for this expression.
  withSource(e) {
    return e && (this.source = e.trimmed()), this;
  }
}
const ur = Object.create(He.prototype), lr = Object.create(He.prototype);
class Zt extends He {
  constructor(e) {
    super(), this.obj = e;
  }
}
class cr extends He {
  constructor(e, t) {
    super(), this.from = e, this.to = t, this.matchCodePoint = e.length > 1 || t.length > 1;
  }
}
class fr extends He {
  constructor(e) {
    super(), this.index = e;
  }
}
class Ut extends He {
  constructor(e) {
    super(), this.terms = e;
  }
}
class iu extends Ut {
  constructor(e, t, r) {
    const i = e.rules[t].body;
    super([r, i]), this.superGrammar = e, this.name = t, this.body = r;
  }
}
class su extends Ut {
  constructor(e, t, r, i) {
    const a = e.rules[t].body;
    super([...r, a, ...i]), this.superGrammar = e, this.ruleName = t, this.expansionPos = r.length;
  }
}
class Gt extends He {
  constructor(e) {
    super(), this.factors = e;
  }
}
class _r extends He {
  constructor(e) {
    super(), this.expr = e;
  }
}
class vs extends _r {
}
class pa extends _r {
}
class Dn extends _r {
}
vs.prototype.operator = "*";
pa.prototype.operator = "+";
Dn.prototype.operator = "?";
vs.prototype.minNumMatches = 0;
pa.prototype.minNumMatches = 1;
Dn.prototype.minNumMatches = 0;
vs.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
pa.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Dn.prototype.maxNumMatches = 1;
class wr extends He {
  constructor(e) {
    super(), this.expr = e;
  }
}
class xr extends He {
  constructor(e) {
    super(), this.expr = e;
  }
}
class Rr extends He {
  constructor(e) {
    super(), this.expr = e;
  }
}
class mt extends He {
  constructor(e, t = []) {
    super(), this.ruleName = e, this.args = t;
  }
  isSyntactic() {
    return ls(this.ruleName);
  }
  // This method just caches the result of `this.toString()` in a non-enumerable property.
  toMemoKey() {
    return this._memoKey || Object.defineProperty(this, "_memoKey", { value: this.toString() }), this._memoKey;
  }
}
class Jt extends He {
  constructor(e) {
    super(), this.category = e, this.pattern = d1[e];
  }
}
function Nt(n, e) {
  let t;
  return e ? (t = new Error(e.getLineAndColumnMessage() + n), t.shortMessage = n, t.interval = e) : t = new Error(n), t;
}
function ef() {
  return Nt("Interval sources don't match");
}
function v1(n, e, t) {
  const r = e ? `Grammar ${n} is not declared in namespace '${e}'` : "Undeclared grammar " + n;
  return Nt(r, t);
}
function y1(n, e) {
  return Nt("Grammar " + n.name + " is already declared in this namespace");
}
function g1(n) {
  return Nt(`Grammar '${n.name}' does not support incremental parsing`);
}
function J0(n, e, t) {
  return Nt(
    "Rule " + n + " is not declared in grammar " + e,
    t
  );
}
function m1(n, e, t) {
  return Nt(
    "Cannot override rule " + n + " because it is not declared in " + e,
    t
  );
}
function I1(n, e, t) {
  return Nt(
    "Cannot extend rule " + n + " because it is not declared in " + e,
    t
  );
}
function Gd(n, e, t, r) {
  let i = "Duplicate declaration for rule '" + n + "' in grammar '" + e + "'";
  return e !== t && (i += " (originally declared in '" + t + "')"), Nt(i, r);
}
function Z0(n, e, t, r) {
  return Nt(
    "Wrong number of parameters for rule " + n + " (expected " + e + ", got " + t + ")",
    r
  );
}
function b1(n, e, t, r) {
  return Nt(
    "Wrong number of arguments for rule " + n + " (expected " + e + ", got " + t + ")",
    r
  );
}
function Hd(n, e, t) {
  return Nt(
    "Duplicate parameter names in rule " + n + ": " + e.join(", "),
    t
  );
}
function _1(n, e) {
  return Nt(
    "Invalid parameter to rule " + n + ": " + e + " has arity " + e.getArity() + ", but parameter expressions must have arity 1",
    e.source
  );
}
const w1 = "NOTE: A _syntactic rule_ is a rule whose name begins with a capital letter. See https://ohmjs.org/d/svl for more details.";
function x1(n, e) {
  return Nt(
    "Cannot apply syntactic rule " + n + " from here (inside a lexical context)",
    e.source
  );
}
function E1(n) {
  const { ruleName: e } = n;
  return Nt(
    `applySyntactic is for syntactic rules, but '${e}' is a lexical rule. ` + w1,
    n.source
  );
}
function S1(n) {
  return Nt(
    "applySyntactic is not required here (in a syntactic context)",
    n.source
  );
}
function Wd(n, e) {
  return Nt("Incorrect argument type: expected " + n, e.source);
}
function A1(n) {
  return Nt("'...' can appear at most once in a rule body", n.source);
}
function k1(n) {
  const e = n._node;
  Ii(e && e.isNonterminal() && e.ctorName === "escapeChar_unicodeCodePoint");
  const t = n.children.slice(1, -1).map((i) => i.source), r = t[0].coverageWith(...t.slice(1));
  return Nt(
    `U+${r.contents} is not a valid Unicode code point`,
    r
  );
}
function Q0(n, e) {
  const t = e.length > 0 ? e[e.length - 1].args : [];
  let i = "Nullable expression " + n.expr.substituteParams(t) + " is not allowed inside '" + n.operator + "' (possible infinite loop)";
  if (e.length > 0) {
    const a = e.map((u) => new mt(u.ruleName, u.args)).join(`
`);
    i += `
Application stack (most recent application last):
` + a;
  }
  return Nt(i, n.expr.source);
}
function X0(n, e, t, r) {
  return Nt(
    "Rule " + n + " involves an alternation which has inconsistent arity (expected " + e + ", got " + t + ")",
    r.source
  );
}
function O1(n) {
  const e = n.map((t) => t.message);
  return Nt(["Errors:"].concat(e).join(`
- `), n[0].interval);
}
function R1(n, e, t, r) {
  let i = r.slice(0, -1).map((c) => {
    const b = "  " + c[0].name + " > " + c[1];
    return c.length === 3 ? b + " for '" + c[2] + "'" : b;
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
`), l = Nt(u);
  return l.name = "missingSemanticAction", l;
}
function T1(n) {
  if (n.length === 1)
    throw n[0];
  if (n.length > 1)
    throw O1(n);
}
function C1(n) {
  let e = 0;
  return n.map((r) => {
    const i = r.toString();
    return e = Math.max(e, i.length), i;
  }).map((r) => H0(r, e));
}
function Yd(n, e, t) {
  const r = n.length, i = n.slice(0, t), a = n.slice(t + e.length);
  return (i + e + a).substr(0, r);
}
function N1(...n) {
  const e = this, { offset: t } = e, { repeatStr: r } = p1, i = new ds();
  i.append("Line " + e.lineNum + ", col " + e.colNum + `:
`);
  const a = C1([
    e.prevLine == null ? 0 : e.lineNum - 1,
    e.lineNum,
    e.nextLine == null ? 0 : e.lineNum + 1
  ]), u = (I, w, E) => {
    i.append(E + a[I] + " | " + w + `
`);
  };
  e.prevLine != null && u(0, e.prevLine, "  "), u(1, e.line, "> ");
  const l = e.line.length;
  let c = r(" ", l + 1);
  for (let I = 0; I < n.length; ++I) {
    let w = n[I][0], E = n[I][1];
    Ii(w >= 0 && w <= E, "range start must be >= 0 and <= end");
    const k = t - e.colNum + 1;
    w = Math.max(0, w - k), E = Math.min(E - k, l), c = Yd(c, r("~", E - w), w);
  }
  const b = 2 + a[1].length + 3;
  return i.append(r(" ", b)), c = Yd(c, "^", e.colNum - 1), i.append(c.replace(/ +$/, "") + `
`), e.nextLine != null && u(2, e.nextLine, "  "), i.contents();
}
let tf = [];
function ey(n) {
  tf.push(n);
}
function P1(n) {
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
  let b = n.indexOf(`
`, a);
  if (b === -1)
    b = n.length;
  else {
    const w = n.indexOf(`
`, b + 1);
    u = w === -1 ? n.slice(b) : n.slice(b, w), u = u.replace(/^\r?\n/, "").replace(/\r$/, "");
  }
  c >= 0 && (l = n.slice(c, a).replace(/\r?\n$/, ""));
  const I = n.slice(a, b).replace(/\r$/, "");
  return {
    offset: e,
    lineNum: t,
    colNum: r,
    line: I,
    prevLine: l,
    nextLine: u,
    toString: N1
  };
}
function ty(n, e, ...t) {
  return Gf(n, e).toString(...t);
}
const Vd = /* @__PURE__ */ (() => {
  let n = 0;
  return (e) => "" + e + n++;
})();
class ar {
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
    return ar.coverage(...e, this);
  }
  collapsedLeft() {
    return new ar(this.sourceString, this.startIdx, this.startIdx);
  }
  collapsedRight() {
    return new ar(this.sourceString, this.endIdx, this.endIdx);
  }
  getLineAndColumn() {
    return Gf(this.sourceString, this.startIdx);
  }
  getLineAndColumnMessage() {
    const e = [this.startIdx, this.endIdx];
    return ty(this.sourceString, this.startIdx, e);
  }
  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus(e) {
    if (this.sourceString !== e.sourceString)
      throw ef();
    return this.startIdx === e.startIdx && this.endIdx === e.endIdx ? [] : this.startIdx < e.startIdx && e.endIdx < this.endIdx ? [
      new ar(this.sourceString, this.startIdx, e.startIdx),
      new ar(this.sourceString, e.endIdx, this.endIdx)
    ] : this.startIdx < e.endIdx && e.endIdx < this.endIdx ? [new ar(this.sourceString, e.endIdx, this.endIdx)] : this.startIdx < e.startIdx && e.startIdx < this.endIdx ? [new ar(this.sourceString, this.startIdx, e.startIdx)] : [this];
  }
  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo(e) {
    if (this.sourceString !== e.sourceString)
      throw ef();
    return Ii(
      this.startIdx >= e.startIdx && this.endIdx <= e.endIdx,
      "other interval does not cover this one"
    ), new ar(
      this.sourceString,
      this.startIdx - e.startIdx,
      this.endIdx - e.startIdx
    );
  }
  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends.
  trimmed() {
    const { contents: e } = this, t = this.startIdx + e.match(/^\s*/)[0].length, r = this.endIdx - e.match(/\s*$/)[0].length;
    return new ar(this.sourceString, t, r);
  }
  subInterval(e, t) {
    const r = this.startIdx + e;
    return new ar(this.sourceString, r, r + t);
  }
}
ar.coverage = function(n, ...e) {
  let { startIdx: t, endIdx: r } = n;
  for (const i of e) {
    if (i.sourceString !== n.sourceString)
      throw ef();
    t = Math.min(t, i.startIdx), r = Math.max(r, i.endIdx);
  }
  return new ar(n.sourceString, t, r);
};
const D1 = 65535;
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
    return e > D1 && (this.pos += 1), this.examinedLength = Math.max(this.examinedLength, this.pos), e;
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
    return new ar(this.source, e, t || this.pos);
  }
}
class ry {
  constructor(e, t, r, i, a, u, l) {
    this.matcher = e, this.input = t, this.startExpr = r, this._cst = i, this._cstOffset = a, this._rightmostFailurePosition = u, this._rightmostFailures = l, this.failed() && (Qc(this, "message", function() {
      const c = "Expected " + this.getExpectedText();
      return ty(this.input, this.getRightmostFailurePosition()) + c;
    }), Qc(this, "shortMessage", function() {
      const c = "expected " + this.getExpectedText(), b = Gf(
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
    const e = new ds();
    let t = this.getRightmostFailures();
    t = t.filter((r) => !r.isFluffy());
    for (let r = 0; r < t.length; r++)
      r > 0 && (r === t.length - 1 ? e.append(t.length > 2 ? ", or " : " or ") : e.append(", ")), e.append(t[r].toString());
    return e.contents();
  }
  getInterval() {
    const e = this.getRightmostFailurePosition();
    return new ar(this.input, e, e);
  }
}
class B1 {
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
const F1 = "✗", L1 = "✓", q1 = "⋅", M1 = "⇒", U1 = "␉", $1 = "␊", j1 = "␍", rf = {
  succeeded: 1,
  isRootNode: 2,
  isImplicitSpaces: 4,
  isMemoized: 8,
  isHeadOfLeftRecursion: 16,
  terminatesLR: 32
};
function K1(n) {
  return nu(" ", n).join("");
}
function z1(n, e, t) {
  const r = ny(n.slice(e, e + t));
  return r.length < t ? r + nu(" ", t - r.length).join("") : r;
}
function ny(n) {
  return typeof n == "string" ? n.replace(/ /g, q1).replace(/\t/g, U1).replace(/\n/g, $1).replace(/\r/g, j1) : String(n);
}
class vi {
  constructor(e, t, r, i, a, u, l) {
    this.input = e, this.pos = this.pos1 = t, this.pos2 = r, this.source = new ar(e, t, r), this.expr = i, this.bindings = u, this.children = l || [], this.terminatingLREntry = null, this._flags = a ? rf.succeeded : 0;
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
      r.enter && r.enter.call(t, a, u, l) === vi.prototype.SKIP && (c = !1), c && (a.children.forEach((b) => {
        i(b, a, l + 1);
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
    const e = new ds();
    return this.walk((t, r, i) => {
      if (!t)
        return this.SKIP;
      if (t.expr.constructor.name !== "Alt") {
        if (e.append(z1(t.input, t.pos, 10) + K1(i * 2 + 1)), e.append((t.succeeded ? L1 : F1) + " " + t.displayString), t.isHeadOfLeftRecursion && e.append(" (LR)"), t.succeeded) {
          const u = ny(t.source.contents);
          e.append(" " + M1 + "  "), e.append(typeof u == "string" ? '"' + u + '"' : u);
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
He.prototype.allowsSkippingPrecedingSpace = br("allowsSkippingPrecedingSpace");
ur.allowsSkippingPrecedingSpace = lr.allowsSkippingPrecedingSpace = mt.prototype.allowsSkippingPrecedingSpace = Zt.prototype.allowsSkippingPrecedingSpace = cr.prototype.allowsSkippingPrecedingSpace = Jt.prototype.allowsSkippingPrecedingSpace = function() {
  return !0;
};
Ut.prototype.allowsSkippingPrecedingSpace = _r.prototype.allowsSkippingPrecedingSpace = Rr.prototype.allowsSkippingPrecedingSpace = xr.prototype.allowsSkippingPrecedingSpace = wr.prototype.allowsSkippingPrecedingSpace = fr.prototype.allowsSkippingPrecedingSpace = Gt.prototype.allowsSkippingPrecedingSpace = function() {
  return !1;
};
let ka;
ey((n) => {
  ka = n;
});
let qo;
He.prototype.assertAllApplicationsAreValid = function(n, e) {
  qo = 0, this._assertAllApplicationsAreValid(n, e);
};
He.prototype._assertAllApplicationsAreValid = br(
  "_assertAllApplicationsAreValid"
);
ur._assertAllApplicationsAreValid = lr._assertAllApplicationsAreValid = Zt.prototype._assertAllApplicationsAreValid = cr.prototype._assertAllApplicationsAreValid = fr.prototype._assertAllApplicationsAreValid = Jt.prototype._assertAllApplicationsAreValid = function(n, e) {
};
Rr.prototype._assertAllApplicationsAreValid = function(n, e) {
  qo++, this.expr._assertAllApplicationsAreValid(n, e), qo--;
};
Ut.prototype._assertAllApplicationsAreValid = function(n, e) {
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
  const r = e.rules[this.ruleName], i = ls(n) && qo === 0;
  if (!r)
    throw J0(this.ruleName, e.name, this.source);
  if (!t && ls(this.ruleName) && !i)
    throw x1(this.ruleName, this);
  const a = this.args.length, u = r.formals.length;
  if (a !== u)
    throw b1(this.ruleName, u, a, this.source);
  const l = ka && r === ka.rules.applySyntactic;
  if (ka && r === ka.rules.caseInsensitive && !(this.args[0] instanceof Zt))
    throw Wd('a Terminal (e.g. "abc")', this.args[0]);
  if (l) {
    const b = this.args[0];
    if (!(b instanceof mt))
      throw Wd("a syntactic rule application", b);
    if (!ls(b.ruleName))
      throw E1(b);
    if (i)
      throw S1(this);
  }
  this.args.forEach((b) => {
    if (b._assertAllApplicationsAreValid(n, e, l), b.getArity() !== 1)
      throw _1(this.ruleName, b);
  });
};
He.prototype.assertChoicesHaveUniformArity = br(
  "assertChoicesHaveUniformArity"
);
ur.assertChoicesHaveUniformArity = lr.assertChoicesHaveUniformArity = Zt.prototype.assertChoicesHaveUniformArity = cr.prototype.assertChoicesHaveUniformArity = fr.prototype.assertChoicesHaveUniformArity = Rr.prototype.assertChoicesHaveUniformArity = Jt.prototype.assertChoicesHaveUniformArity = function(n) {
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
      throw X0(n, e, i, r);
  }
};
iu.prototype.assertChoicesHaveUniformArity = function(n) {
  const e = this.terms[0].getArity(), t = this.terms[1].getArity();
  if (e !== t)
    throw X0(n, t, e, this.terms[0]);
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
He.prototype.assertIteratedExprsAreNotNullable = br(
  "assertIteratedExprsAreNotNullable"
);
ur.assertIteratedExprsAreNotNullable = lr.assertIteratedExprsAreNotNullable = Zt.prototype.assertIteratedExprsAreNotNullable = cr.prototype.assertIteratedExprsAreNotNullable = fr.prototype.assertIteratedExprsAreNotNullable = Jt.prototype.assertIteratedExprsAreNotNullable = function(n) {
};
Ut.prototype.assertIteratedExprsAreNotNullable = function(n) {
  for (let e = 0; e < this.terms.length; e++)
    this.terms[e].assertIteratedExprsAreNotNullable(n);
};
Gt.prototype.assertIteratedExprsAreNotNullable = function(n) {
  for (let e = 0; e < this.factors.length; e++)
    this.factors[e].assertIteratedExprsAreNotNullable(n);
};
_r.prototype.assertIteratedExprsAreNotNullable = function(n) {
  if (this.expr.assertIteratedExprsAreNotNullable(n), this.expr.isNullable(n))
    throw Q0(this, []);
};
Dn.prototype.assertIteratedExprsAreNotNullable = wr.prototype.assertIteratedExprsAreNotNullable = xr.prototype.assertIteratedExprsAreNotNullable = Rr.prototype.assertIteratedExprsAreNotNullable = function(n) {
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
class ys extends Hf {
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
class G1 extends Hf {
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
    return G0(this.ctorName);
  }
  isSyntactic() {
    return ls(this.ctorName);
  }
}
class iy extends Hf {
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
He.prototype.eval = br("eval");
ur.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = e.nextCodePoint();
  return r !== void 0 ? (n.pushBinding(new ys(String.fromCodePoint(r).length), t), !0) : (n.processFailure(t, this), !1);
};
lr.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return e.atEnd() ? (n.pushBinding(new ys(0), t), !0) : (n.processFailure(t, this), !1);
};
Zt.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos;
  return e.matchString(this.obj) ? (n.pushBinding(new ys(this.obj.length), t), !0) : (n.processFailure(t, this), !1);
};
cr.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = this.matchCodePoint ? e.nextCodePoint() : e.nextCharCode();
  return r !== void 0 && this.from.codePointAt(0) <= r && r <= this.to.codePointAt(0) ? (n.pushBinding(new ys(String.fromCodePoint(r).length), t), !0) : (n.processFailure(t, this), !1);
};
fr.prototype.eval = function(n) {
  return n.eval(n.currentApplication().args[this.index]);
};
Rr.prototype.eval = function(n) {
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
Gt.prototype.eval = function(n) {
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
      throw Q0(this, n._applicationStack);
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
  let b = n.posToOffset(t), I = 0;
  if (u > 0) {
    const E = i[r - 1], k = a[r - 1], B = k[k.length - 1] + E[E.length - 1].matchLength;
    b = a[0][0], I = B - b;
  }
  const w = this instanceof Dn;
  for (c = 0; c < i.length; c++)
    n._bindings.push(
      new iy(i[c], a[c], I, w)
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
  const b = r.currentLeftRecursion, I = this.toMemoKey(), w = b && b.headApplication.toMemoKey() === I;
  let E;
  n.doNotMemoize ? n.doNotMemoize = !1 : w ? (c = this.growSeedResult(a, n, t, b, c), r.endLeftRecursion(), E = b, E.examinedLength = e.examinedLength - t, E.rightmostFailureOffset = n._getRightmostFailureOffset(), r.memoize(I, E)) : (!b || !b.isInvolved(I)) && (E = r.memoize(I, {
    matchLength: e.pos - t,
    examinedLength: e.examinedLength - t,
    value: c,
    failuresAtRightmostPosition: n.cloneRecordedFailures(),
    rightmostFailureOffset: n._getRightmostFailureOffset()
  }));
  const k = !!c;
  if (u && (n.popFailuresInfo(), k || n.processFailure(t, this), E && (E.failuresAtRightmostPosition = n.cloneRecordedFailures())), n.isTracing() && E) {
    const B = n.getTraceEntry(t, this, k, k ? [c] : []);
    w && (Ii(B.terminatingLREntry != null || !k), B.isHeadOfLeftRecursion = !0), E.traceEntry = B;
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
    return new G1(this.ruleName, a, u, l);
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
Jt.prototype.eval = function(n) {
  const { inputStream: e } = n, t = e.pos, r = e.next();
  return r && this.pattern.test(r) ? (n.pushBinding(new ys(r.length), t), !0) : (n.processFailure(t, this), !1);
};
He.prototype.getArity = br("getArity");
ur.getArity = lr.getArity = Zt.prototype.getArity = cr.prototype.getArity = fr.prototype.getArity = mt.prototype.getArity = Jt.prototype.getArity = function() {
  return 1;
};
Ut.prototype.getArity = function() {
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
xr.prototype.getArity = Rr.prototype.getArity = function() {
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
He.prototype.outputRecipe = br("outputRecipe");
ur.outputRecipe = function(n, e) {
  return ["any", en(this, e)];
};
lr.outputRecipe = function(n, e) {
  return ["end", en(this, e)];
};
Zt.prototype.outputRecipe = function(n, e) {
  return ["terminal", en(this, e), this.obj];
};
cr.prototype.outputRecipe = function(n, e) {
  return ["range", en(this, e), this.from, this.to];
};
fr.prototype.outputRecipe = function(n, e) {
  return ["param", en(this, e), this.index];
};
Ut.prototype.outputRecipe = function(n, e) {
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
Gt.prototype.outputRecipe = function(n, e) {
  return ["seq", en(this, e)].concat(
    this.factors.map((t) => t.outputRecipe(n, e))
  );
};
vs.prototype.outputRecipe = pa.prototype.outputRecipe = Dn.prototype.outputRecipe = wr.prototype.outputRecipe = xr.prototype.outputRecipe = Rr.prototype.outputRecipe = function(n, e) {
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
Jt.prototype.outputRecipe = function(n, e) {
  return ["unicodeChar", en(this, e), this.category];
};
He.prototype.introduceParams = br("introduceParams");
ur.introduceParams = lr.introduceParams = Zt.prototype.introduceParams = cr.prototype.introduceParams = fr.prototype.introduceParams = Jt.prototype.introduceParams = function(n) {
  return this;
};
Ut.prototype.introduceParams = function(n) {
  return this.terms.forEach((e, t, r) => {
    r[t] = e.introduceParams(n);
  }), this;
};
Gt.prototype.introduceParams = function(n) {
  return this.factors.forEach((e, t, r) => {
    r[t] = e.introduceParams(n);
  }), this;
};
_r.prototype.introduceParams = wr.prototype.introduceParams = xr.prototype.introduceParams = Rr.prototype.introduceParams = function(n) {
  return this.expr = this.expr.introduceParams(n), this;
};
mt.prototype.introduceParams = function(n) {
  const e = n.indexOf(this.ruleName);
  if (e >= 0) {
    if (this.args.length > 0)
      throw new Error("Parameterized rules cannot be passed as arguments to another rule.");
    return new fr(e).withSource(this.source);
  } else
    return this.args.forEach((t, r, i) => {
      i[r] = t.introduceParams(n);
    }), this;
};
He.prototype.isNullable = function(n) {
  return this._isNullable(n, /* @__PURE__ */ Object.create(null));
};
He.prototype._isNullable = br("_isNullable");
ur._isNullable = cr.prototype._isNullable = fr.prototype._isNullable = pa.prototype._isNullable = Jt.prototype._isNullable = function(n, e) {
  return !1;
};
lr._isNullable = function(n, e) {
  return !0;
};
Zt.prototype._isNullable = function(n, e) {
  return typeof this.obj == "string" ? this.obj === "" : !1;
};
Ut.prototype._isNullable = function(n, e) {
  return this.terms.length === 0 || this.terms.some((t) => t._isNullable(n, e));
};
Gt.prototype._isNullable = function(n, e) {
  return this.factors.every((t) => t._isNullable(n, e));
};
vs.prototype._isNullable = Dn.prototype._isNullable = wr.prototype._isNullable = xr.prototype._isNullable = function(n, e) {
  return !0;
};
Rr.prototype._isNullable = function(n, e) {
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
He.prototype.substituteParams = br("substituteParams");
ur.substituteParams = lr.substituteParams = Zt.prototype.substituteParams = cr.prototype.substituteParams = Jt.prototype.substituteParams = function(n) {
  return this;
};
fr.prototype.substituteParams = function(n) {
  return V0(n[this.index]);
};
Ut.prototype.substituteParams = function(n) {
  return new Ut(this.terms.map((e) => e.substituteParams(n)));
};
Gt.prototype.substituteParams = function(n) {
  return new Gt(this.factors.map((e) => e.substituteParams(n)));
};
_r.prototype.substituteParams = wr.prototype.substituteParams = xr.prototype.substituteParams = Rr.prototype.substituteParams = function(n) {
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
function Jd(n) {
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
He.prototype.toArgumentNameList = br("toArgumentNameList");
ur.toArgumentNameList = function(n, e) {
  return ["any"];
};
lr.toArgumentNameList = function(n, e) {
  return ["end"];
};
Zt.prototype.toArgumentNameList = function(n, e) {
  return typeof this.obj == "string" && /^[_a-zA-Z0-9]+$/.test(this.obj) ? ["_" + this.obj] : ["$" + n];
};
cr.prototype.toArgumentNameList = function(n, e) {
  let t = this.from + "_to_" + this.to;
  return Jd(t) || (t = "_" + t), Jd(t) || (t = "$" + n), [t];
};
Ut.prototype.toArgumentNameList = function(n, e) {
  const t = this.terms.map(
    (a) => a.toArgumentNameList(n, !0)
  ), r = [], i = t[0].length;
  for (let a = 0; a < i; a++) {
    const u = [];
    for (let c = 0; c < this.terms.length; c++)
      u.push(t[c][a]);
    const l = z0(u);
    r.push(l.join("_or_"));
  }
  return e || Wf(r), r;
};
Gt.prototype.toArgumentNameList = function(n, e) {
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
Dn.prototype.toArgumentNameList = function(n, e) {
  return this.expr.toArgumentNameList(n, e).map((t) => "opt" + t[0].toUpperCase() + t.slice(1));
};
wr.prototype.toArgumentNameList = function(n, e) {
  return [];
};
xr.prototype.toArgumentNameList = Rr.prototype.toArgumentNameList = function(n, e) {
  return this.expr.toArgumentNameList(n, e);
};
mt.prototype.toArgumentNameList = function(n, e) {
  return [this.ruleName];
};
Jt.prototype.toArgumentNameList = function(n, e) {
  return ["$" + n];
};
fr.prototype.toArgumentNameList = function(n, e) {
  return ["param" + this.index];
};
He.prototype.toDisplayString = br("toDisplayString");
Ut.prototype.toDisplayString = Gt.prototype.toDisplayString = function() {
  return this.source ? this.source.trimmed().contents : "[" + this.constructor.name + "]";
};
ur.toDisplayString = lr.toDisplayString = _r.prototype.toDisplayString = wr.prototype.toDisplayString = xr.prototype.toDisplayString = Rr.prototype.toDisplayString = Zt.prototype.toDisplayString = cr.prototype.toDisplayString = fr.prototype.toDisplayString = function() {
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
function H1(n) {
  return n === "description" || n === "string" || n === "code";
}
class Tr {
  constructor(e, t, r) {
    if (!H1(r))
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
    const e = new Tr(this.pexpr, this.text, this.type);
    return this.isFluffy() && e.makeFluffy(), e;
  }
  toKey() {
    return this.toString() + "#" + this.type;
  }
}
He.prototype.toFailure = br("toFailure");
ur.toFailure = function(n) {
  return new Tr(this, "any object", "description");
};
lr.toFailure = function(n) {
  return new Tr(this, "end of input", "description");
};
Zt.prototype.toFailure = function(n) {
  return new Tr(this, this.obj, "string");
};
cr.prototype.toFailure = function(n) {
  return new Tr(this, JSON.stringify(this.from) + ".." + JSON.stringify(this.to), "code");
};
wr.prototype.toFailure = function(n) {
  const e = this.expr === ur ? "nothing" : "not " + this.expr.toFailure(n);
  return new Tr(this, e, "description");
};
xr.prototype.toFailure = function(n) {
  return this.expr.toFailure(n);
};
mt.prototype.toFailure = function(n) {
  let { description: e } = n.rules[this.ruleName];
  return e || (e = (/^[aeiouAEIOU]/.test(this.ruleName) ? "an" : "a") + " " + this.ruleName), new Tr(this, e, "description");
};
Jt.prototype.toFailure = function(n) {
  return new Tr(this, "a Unicode [" + this.category + "] character", "description");
};
Ut.prototype.toFailure = function(n) {
  const t = "(" + this.terms.map((r) => r.toFailure(n)).join(" or ") + ")";
  return new Tr(this, t, "description");
};
Gt.prototype.toFailure = function(n) {
  const t = "(" + this.factors.map((r) => r.toFailure(n)).join(" ") + ")";
  return new Tr(this, t, "description");
};
_r.prototype.toFailure = function(n) {
  const e = "(" + this.expr.toFailure(n) + this.operator + ")";
  return new Tr(this, e, "description");
};
He.prototype.toString = br("toString");
ur.toString = function() {
  return "any";
};
lr.toString = function() {
  return "end";
};
Zt.prototype.toString = function() {
  return JSON.stringify(this.obj);
};
cr.prototype.toString = function() {
  return JSON.stringify(this.from) + ".." + JSON.stringify(this.to);
};
fr.prototype.toString = function() {
  return "$" + this.index;
};
Rr.prototype.toString = function() {
  return "#(" + this.expr.toString() + ")";
};
Ut.prototype.toString = function() {
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
Jt.prototype.toString = function() {
  return "\\p{" + this.category + "}";
};
class Yf extends He {
  constructor(e) {
    super(), this.obj = e;
  }
  _getString(e) {
    const t = e.currentApplication().args[this.obj.index];
    return Ii(t instanceof Zt, "expected a Terminal expression"), t.obj;
  }
  // Implementation of the PExpr API
  allowsSkippingPrecedingSpace() {
    return !0;
  }
  eval(e) {
    const { inputStream: t } = e, r = t.pos, i = this._getString(e);
    return t.matchString(i, !0) ? (e.pushBinding(new ys(i.length), r), !0) : (e.processFailure(r, this), !1);
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
    return new Tr(
      this,
      this.obj.toFailure(e) + " (case-insensitive)",
      "description"
    );
  }
  _isNullable(e, t) {
    return this.obj._isNullable(e, t);
  }
}
let sy;
ey((n) => {
  sy = n.rules.applySyntactic.body;
});
const Ec = new mt("spaces");
class W1 {
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
    return this.pushFailuresInfo(), this.eval(Ec), this.popBinding(), this.popFailuresInfo(), this.inputStream.pos;
  }
  skipSpacesIfInSyntacticContext() {
    return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
  }
  maybeSkipSpacesBefore(e) {
    return e.allowsSkippingPrecedingSpace() && e !== Ec ? this.skipSpacesIfInSyntacticContext() : this.inputStream.pos;
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
    return t || (t = this.memoTable[e] = new B1()), t;
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
    const b = e.eval(this);
    if (this.trace) {
      const I = this._bindings.slice(r), w = this.getTraceEntry(l, e, b, I);
      w.isImplicitSpaces = e === Ec, w.isRootNode = e === this.startExpr, c.push(w), this.trace = c;
    }
    return b ? this.recordedFailures && t.pos === this.positionToRecordFailures && Object.keys(this.recordedFailures).forEach((I) => {
      this.recordedFailures[I].makeFluffy();
    }) : (t.pos = u, this.truncateBindings(r), this.userData = i), this.recordedFailures && this.recordFailures(a, !1), e === sy && this.skipSpaces(), b;
  }
  getMatchResult() {
    this.grammar._setUpMatchState(this), this.eval(this.startExpr);
    let e;
    this.recordedFailures && (e = Object.keys(this.recordedFailures).map(
      (r) => this.recordedFailures[r]
    ));
    const t = this._bindings[0];
    return t && (t.grammar = this.grammar), new ry(
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
class Y1 {
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
      throw g1(this.grammar);
    const i = new W1(this, e, r.positionToRecordFailures);
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
    return new Gt([r, lr]);
  }
}
const Oa = [], nf = (n, e) => Object.prototype.hasOwnProperty.call(n, e);
class Zd {
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
    const t = e || [], r = t.map((u) => u._node), i = new iy(r, [], -1, !1), a = this._semantics.wrap(i, null, null);
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
class kr {
  constructor(e, t) {
    const r = this;
    if (this.grammar = e, this.checkedActionDicts = !1, this.Wrapper = class extends (t ? t.Wrapper : Zd) {
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
          value: Vd(i)
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
      return i.super !== kr.BuiltInSemantics._getSemantics();
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
        const { actionDict: l, formals: c, builtInDefault: b } = a[u];
        let I = u;
        c.length > 0 && (I += "(" + c.join(", ") + ")");
        let w;
        t(this) && this.super[i.toLowerCase() + "s"][u] ? w = "extend" + i : w = "add" + i, r += `
    .` + w + "(" + JSON.stringify(I) + ", {";
        const E = [];
        Object.keys(l).forEach((k) => {
          if (l[k] !== b) {
            let B = l[k].toString().trim();
            B = B.replace(/^.*\(/, "function("), E.push(`
      ` + JSON.stringify(k) + ": " + B);
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
    const i = e + "s", a = Qd(t, e), { name: u } = a, { formals: l } = a;
    this.assertNewName(u, e);
    const c = V1(e, u, w), b = { _default: c };
    Object.keys(r).forEach((E) => {
      b[E] = r[E];
    });
    const I = e === "operation" ? new Ba(u, l, b, c) : new sf(u, b, c);
    I.checkActionDict(this.grammar), this[i][u] = I;
    function w(...E) {
      const k = this._semantics[i][u];
      if (arguments.length !== k.formals.length)
        throw new Error(
          "Invalid number of arguments passed to " + u + " " + e + " (expected " + k.formals.length + ", got " + arguments.length + ")"
        );
      const B = /* @__PURE__ */ Object.create(null);
      for (const [M, Z] of Object.entries(E)) {
        const X = k.formals[M];
        B[X] = Z;
      }
      const K = this.args;
      this.args = B;
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
      value: Vd(u)
    }));
  }
  extendOperationOrAttribute(e, t, r) {
    const i = e + "s";
    if (Qd(t, "attribute"), !(this.super && t in this.super[i]))
      throw new Error(
        "Cannot extend " + e + " '" + t + "': did not inherit an " + e + " with that name"
      );
    if (nf(this[i], t))
      throw new Error("Cannot extend " + e + " '" + t + "' again");
    const a = this[i][t].formals, u = this[i][t].actionDict, l = Object.create(u);
    Object.keys(r).forEach((c) => {
      l[c] = r[c];
    }), this[i][t] = e === "operation" ? new Ba(t, a, l) : new sf(t, l), this[i][t].checkActionDict(this.grammar);
  }
  assertNewName(e, t) {
    if (nf(Zd.prototype, e))
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
function Qd(n, e) {
  if (!kr.prototypeGrammar)
    return Ii(n.indexOf("(") === -1), {
      name: n,
      formals: []
    };
  const t = kr.prototypeGrammar.match(
    n,
    e === "operation" ? "OperationSignature" : "AttributeSignature"
  );
  if (t.failed())
    throw new Error(t.message);
  return kr.prototypeGrammarSemantics(t).parse();
}
function V1(n, e, t) {
  return function(...r) {
    const a = (this._semantics.operations[e] || this._semantics.attributes[e]).formals.map((u) => this.args[u]);
    if (!this.isIteration() && r.length === 1)
      return t.apply(r[0], a);
    throw R1(this.ctorName, e, n, Oa);
  };
}
kr.createSemantics = function(n, e) {
  const t = new kr(
    n,
    e !== void 0 ? e : kr.BuiltInSemantics._getSemantics()
  ), r = function(a) {
    if (!(a instanceof ry))
      throw new TypeError(
        "Semantics expected a MatchResult, but got " + Y0(a)
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
class Ba {
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
      return i ? (Oa.push([this, r]), i.apply(t, t._children())) : t.isNonterminal() && (i = this.actionDict._nonterminal, i) ? (Oa.push([this, "_nonterminal", r]), i.apply(t, t._children())) : (Oa.push([this, "default action", r]), this.actionDict._default.apply(t, t._children()));
    } finally {
      Oa.pop();
    }
  }
}
Ba.prototype.typeName = "operation";
class sf extends Ba {
  constructor(e, t, r) {
    super(e, [], t, r);
  }
  execute(e, t) {
    const r = t._node, i = e.attributeKeys[this.name];
    return nf(r, i) || (r[i] = Ba.prototype.execute.call(this, e, t)), r[i];
  }
}
sf.prototype.typeName = "attribute";
const Xd = ["_iter", "_terminal", "_nonterminal", "_default"];
function ev(n) {
  return Object.keys(n.rules).sort().map((e) => n.rules[e]);
}
const J1 = (n) => n.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
let ay, oy;
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
    return new Y1(this);
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
    const t = ev(this), r = ev(e);
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
    return kr.createSemantics(this);
  }
  extendSemantics(e) {
    return kr.createSemantics(this, e._getSemantics());
  }
  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict(e, t, r) {
    const i = [];
    for (const a in r) {
      const u = r[a];
      if (!Xd.includes(a) && !(a in this.rules)) {
        i.push(`'${a}' is not a valid semantic action for '${this.name}'`);
        continue;
      }
      if (typeof u != "function") {
        i.push(`'${a}' must be a function in an action dictionary for '${this.name}'`);
        continue;
      }
      const c = u.length, b = this._topDownActionArity(a);
      if (c !== b) {
        let I;
        a === "_iter" || a === "_nonterminal" ? I = `it should use a rest parameter, e.g. \`${a}(...children) {}\`. NOTE: this is new in Ohm v16 — see https://ohmjs.org/d/ati for details.` : I = `expected ${b}, got ${c}`, i.push(`Semantic action '${a}' has the wrong arity: ${I}`);
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
    return Xd.includes(e) ? 0 : this.rules[e].body.getArity();
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
      const c = this.rules[l], { body: b } = c, I = !this.superGrammar || !this.superGrammar.rules[l];
      let w;
      I ? w = "define" : w = b instanceof iu ? "extend" : "override";
      const E = {};
      if (c.source && this.source) {
        const K = c.source.relativeTo(this.source);
        E.sourceInterval = [K.startIdx, K.endIdx];
      }
      const k = I ? c.description : null, B = b.outputRecipe(c.formals, this.source);
      i[l] = [
        w,
        // "define"/"extend"/"override"
        E,
        k,
        c.formals,
        B
      ];
    });
    let a = "null";
    e ? a = e : this.superGrammar && !this.superGrammar.isBuiltIn() && (a = this.superGrammar.toRecipe());
    const u = [
      ...["grammar", t, this.name].map(JSON.stringify),
      a,
      ...[r, i].map(JSON.stringify)
    ];
    return J1(`[${u.join(",")}]`);
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
    const e = new ds();
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
      const i = ay.match(e, "Base_application");
      t = oy(i, {});
    }
    if (!(t.ruleName in this.rules))
      throw J0(t.ruleName, this.name);
    const { formals: r } = this.rules[t.ruleName];
    if (r.length !== t.args.length) {
      const { source: i } = this.rules[t.ruleName];
      throw Z0(
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
      body: ur,
      formals: [],
      description: "any character",
      primitive: !0
    },
    end: {
      body: lr,
      formals: [],
      description: "end of input",
      primitive: !0
    },
    caseInsensitive: {
      body: new Yf(new fr(0)),
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
      body: new vs(new mt("space")),
      formals: []
    },
    space: {
      body: new cr("\0", " "),
      formals: [],
      description: "a space"
    }
  }
);
Ir.initApplicationParser = function(n, e) {
  ay = n, oy = e;
};
class tv {
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
      throw m1(e, this.superGrammar.name, t);
    return r;
  }
  installOverriddenOrExtendedRule(e, t, r, i) {
    const a = Xc(t);
    if (a.length > 0)
      throw Hd(e, a, i);
    const u = this.ensureSuperGrammar().rules[e], l = u.formals, c = l ? l.length : 0;
    if (t.length !== c)
      throw Z0(e, c, t.length, i);
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
    }), t.length > 0 && T1(t), this.source && (e.source = this.source), e;
  }
  // Rule declarations
  define(e, t, r, i, a, u) {
    if (this.ensureSuperGrammar(), this.superGrammar.rules[e])
      throw Gd(e, this.name, this.superGrammar.name, a);
    if (this.rules[e])
      throw Gd(e, this.name, this.name, a);
    const l = Xc(t);
    if (l.length > 0)
      throw Hd(e, l, a);
    return this.install(e, t, r, i, a, u);
  }
  override(e, t, r, i, a) {
    return this.ensureSuperGrammarRuleForOverriding(e, a), this.installOverriddenOrExtendedRule(e, t, r, a), this;
  }
  extend(e, t, r, i, a) {
    if (!this.ensureSuperGrammar().rules[e])
      throw I1(e, this.superGrammar.name, a);
    const l = new iu(this.superGrammar, e, r);
    return l.source = r.source, this.installOverriddenOrExtendedRule(e, t, l, a), this;
  }
}
class Mo {
  constructor() {
    this.currentDecl = null, this.currentRuleName = null;
  }
  newGrammar(e) {
    return new tv(e);
  }
  grammar(e, t, r, i, a) {
    const u = new tv(t);
    return r && u.withSuperGrammar(
      r instanceof Ir ? r : this.fromRecipe(r)
    ), i && u.withDefaultStartRule(i), e && e.source && u.withSource(e.source), this.currentDecl = u, Object.keys(a).forEach((l) => {
      this.currentRuleName = l;
      const c = a[l], b = c[0], I = c[1], w = c[2], E = c[3], k = this.fromRecipe(c[4]);
      let B;
      u.source && I && I.sourceInterval && (B = u.source.subInterval(
        I.sourceInterval[0],
        I.sourceInterval[1] - I.sourceInterval[0]
      )), u[b](l, E, k, w, B);
    }), this.currentRuleName = this.currentDecl = null, u.build();
  }
  terminal(e) {
    return new Zt(e);
  }
  range(e, t) {
    return new cr(e, t);
  }
  param(e) {
    return new fr(e);
  }
  alt(...e) {
    let t = [];
    for (let r of e)
      r instanceof He || (r = this.fromRecipe(r)), r instanceof Ut ? t = t.concat(r.terms) : t.push(r);
    return t.length === 1 ? t[0] : new Ut(t);
  }
  seq(...e) {
    let t = [];
    for (let r of e)
      r instanceof He || (r = this.fromRecipe(r)), r instanceof Gt ? t = t.concat(r.factors) : t.push(r);
    return t.length === 1 ? t[0] : new Gt(t);
  }
  star(e) {
    return e instanceof He || (e = this.fromRecipe(e)), new vs(e);
  }
  plus(e) {
    return e instanceof He || (e = this.fromRecipe(e)), new pa(e);
  }
  opt(e) {
    return e instanceof He || (e = this.fromRecipe(e)), new Dn(e);
  }
  not(e) {
    return e instanceof He || (e = this.fromRecipe(e)), new wr(e);
  }
  lookahead(e) {
    return e instanceof He || (e = this.fromRecipe(e)), new xr(e);
  }
  lex(e) {
    return e instanceof He || (e = this.fromRecipe(e)), new Rr(e);
  }
  app(e, t) {
    return t && t.length > 0 && (t = t.map(function(r) {
      return r instanceof He ? r : this.fromRecipe(r);
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
P1(Ir.BuiltInRules);
const uy = ou(["grammar", { source: `Ohm {

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
`], ["app", { sourceInterval: [2439, 2442] }, "end", []]]]]], comment_multiLine: ["define", { sourceInterval: [2465, 2501] }, null, [], ["seq", { sourceInterval: [2465, 2487] }, ["terminal", { sourceInterval: [2465, 2469] }, "/*"], ["star", { sourceInterval: [2470, 2482] }, ["seq", { sourceInterval: [2471, 2480] }, ["not", { sourceInterval: [2471, 2476] }, ["terminal", { sourceInterval: [2472, 2476] }, "*/"]], ["app", { sourceInterval: [2477, 2480] }, "any", []]]], ["terminal", { sourceInterval: [2483, 2487] }, "*/"]]], comment: ["define", { sourceInterval: [2398, 2501] }, null, [], ["alt", { sourceInterval: [2412, 2501] }, ["app", { sourceInterval: [2412, 2443] }, "comment_singleLine", []], ["app", { sourceInterval: [2465, 2487] }, "comment_multiLine", []]]], tokens: ["define", { sourceInterval: [2505, 2520] }, null, [], ["star", { sourceInterval: [2514, 2520] }, ["app", { sourceInterval: [2514, 2519] }, "token", []]]], token: ["define", { sourceInterval: [2524, 2600] }, null, [], ["alt", { sourceInterval: [2532, 2600] }, ["app", { sourceInterval: [2532, 2540] }, "caseName", []], ["app", { sourceInterval: [2543, 2550] }, "comment", []], ["app", { sourceInterval: [2553, 2558] }, "ident", []], ["app", { sourceInterval: [2561, 2569] }, "operator", []], ["app", { sourceInterval: [2572, 2583] }, "punctuation", []], ["app", { sourceInterval: [2586, 2594] }, "terminal", []], ["app", { sourceInterval: [2597, 2600] }, "any", []]]], operator: ["define", { sourceInterval: [2604, 2669] }, null, [], ["alt", { sourceInterval: [2615, 2669] }, ["terminal", { sourceInterval: [2615, 2619] }, "<:"], ["terminal", { sourceInterval: [2622, 2625] }, "="], ["terminal", { sourceInterval: [2628, 2632] }, ":="], ["terminal", { sourceInterval: [2635, 2639] }, "+="], ["terminal", { sourceInterval: [2642, 2645] }, "*"], ["terminal", { sourceInterval: [2648, 2651] }, "+"], ["terminal", { sourceInterval: [2654, 2657] }, "?"], ["terminal", { sourceInterval: [2660, 2663] }, "~"], ["terminal", { sourceInterval: [2666, 2669] }, "&"]]], punctuation: ["define", { sourceInterval: [2673, 2709] }, null, [], ["alt", { sourceInterval: [2687, 2709] }, ["terminal", { sourceInterval: [2687, 2690] }, "<"], ["terminal", { sourceInterval: [2693, 2696] }, ">"], ["terminal", { sourceInterval: [2699, 2702] }, ","], ["terminal", { sourceInterval: [2705, 2709] }, "--"]]] }]), Sc = Object.create(He.prototype);
function rv(n, e) {
  for (const t in n)
    if (t === e) return !0;
  return !1;
}
function Z1(n, e, t) {
  const r = new Mo();
  let i, a, u, l = !1;
  return (t || uy).createSemantics().addOperation("visit", {
    Grammars(I) {
      return I.children.map((w) => w.visit());
    },
    Grammar(I, w, E, k, B) {
      const K = I.visit();
      i = r.newGrammar(K), w.child(0) && w.child(0).visit(), k.children.map((M) => M.visit());
      const C = i.build();
      if (C.source = this.source.trimmed(), rv(e, K))
        throw y1(C);
      return e[K] = C, C;
    },
    SuperGrammar(I, w) {
      const E = w.visit();
      if (E === "null")
        i.withSuperGrammar(null);
      else {
        if (!e || !rv(e, E))
          throw v1(E, e, w.source);
        i.withSuperGrammar(e[E]);
      }
    },
    Rule_define(I, w, E, k, B) {
      a = I.visit(), u = w.children.map((Z) => Z.visit())[0] || [], !i.defaultStartRule && i.ensureSuperGrammar() !== Ir.ProtoBuiltInRules && i.withDefaultStartRule(a);
      const K = B.visit(), C = E.children.map((Z) => Z.visit())[0], M = this.source.trimmed();
      return i.define(a, u, K, C, M);
    },
    Rule_override(I, w, E, k) {
      a = I.visit(), u = w.children.map((C) => C.visit())[0] || [];
      const B = this.source.trimmed();
      i.ensureSuperGrammarRuleForOverriding(a, B), l = !0;
      const K = k.visit();
      return l = !1, i.override(a, u, K, null, B);
    },
    Rule_extend(I, w, E, k) {
      a = I.visit(), u = w.children.map((C) => C.visit())[0] || [];
      const B = k.visit(), K = this.source.trimmed();
      return i.extend(a, u, B, null, K);
    },
    RuleBody(I, w) {
      return r.alt(...w.visit()).withSource(this.source);
    },
    OverrideRuleBody(I, w) {
      const E = w.visit(), k = E.indexOf(Sc);
      if (k >= 0) {
        const B = E.slice(0, k), K = E.slice(k + 1);
        return K.forEach((C) => {
          if (C === Sc) throw A1(C);
        }), new su(
          i.superGrammar,
          a,
          B,
          K
        ).withSource(this.source);
      } else
        return r.alt(...E).withSource(this.source);
    },
    Formals(I, w, E) {
      return w.visit();
    },
    Params(I, w, E) {
      return w.visit();
    },
    Alt(I) {
      return r.alt(...I.visit()).withSource(this.source);
    },
    TopLevelTerm_inline(I, w) {
      const E = a + "_" + w.visit(), k = I.visit(), B = this.source.trimmed(), K = !(i.superGrammar && i.superGrammar.rules[E]);
      l && !K ? i.override(E, u, k, null, B) : i.define(E, u, k, null, B);
      const C = u.map((M) => r.app(M));
      return r.app(E, C).withSource(k.source);
    },
    OverrideTopLevelTerm_superSplice(I) {
      return Sc;
    },
    Seq(I) {
      return r.seq(...I.children.map((w) => w.visit())).withSource(this.source);
    },
    Iter_star(I, w) {
      return r.star(I.visit()).withSource(this.source);
    },
    Iter_plus(I, w) {
      return r.plus(I.visit()).withSource(this.source);
    },
    Iter_opt(I, w) {
      return r.opt(I.visit()).withSource(this.source);
    },
    Pred_not(I, w) {
      return r.not(w.visit()).withSource(this.source);
    },
    Pred_lookahead(I, w) {
      return r.lookahead(w.visit()).withSource(this.source);
    },
    Lex_lex(I, w) {
      return r.lex(w.visit()).withSource(this.source);
    },
    Base_application(I, w) {
      const E = w.children.map((k) => k.visit())[0] || [];
      return r.app(I.visit(), E).withSource(this.source);
    },
    Base_range(I, w, E) {
      return r.range(I.visit(), E.visit()).withSource(this.source);
    },
    Base_terminal(I) {
      return r.terminal(I.visit()).withSource(this.source);
    },
    Base_paren(I, w, E) {
      return w.visit();
    },
    ruleDescr(I, w, E) {
      return w.visit();
    },
    ruleDescrText(I) {
      return this.sourceString.trim();
    },
    caseName(I, w, E, k, B) {
      return E.visit();
    },
    name(I, w) {
      return this.sourceString;
    },
    nameFirst(I) {
    },
    nameRest(I) {
    },
    terminal(I, w, E) {
      return w.children.map((k) => k.visit()).join("");
    },
    oneCharTerminal(I, w, E) {
      return w.visit();
    },
    escapeChar(I) {
      try {
        return W0(this.sourceString);
      } catch (w) {
        throw w instanceof RangeError && w.message.startsWith("Invalid code point ") ? k1(I) : w;
      }
    },
    NonemptyListOf(I, w, E) {
      return [I.visit()].concat(E.children.map((k) => k.visit()));
    },
    EmptyListOf() {
      return [];
    },
    _terminal() {
      return this.sourceString;
    }
  })(n).visit();
}
const Q1 = ou(["grammar", { source: `OperationsAndAttributes {

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
X1(Ir.BuiltInRules);
eI(Q1);
function X1(n) {
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
  kr.BuiltInSemantics = kr.createSemantics(n, null).addOperation(
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
function eI(n) {
  kr.prototypeGrammarSemantics = n.createSemantics().addOperation("parse", {
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
  }), kr.prototypeGrammar = n;
}
function tI(n) {
  let e = 0;
  const t = [0], r = () => t[t.length - 1], i = {}, a = /( *).*(?:$|\r?\n|\r)/g;
  let u;
  for (; (u = a.exec(n)) != null; ) {
    const [l, c] = u;
    if (l.length === 0) break;
    const b = c.length, I = r(), w = e + b;
    if (b > I)
      t.push(b), i[w] = 1;
    else if (b < I) {
      const E = t.length;
      for (; r() !== b; )
        t.pop();
      i[w] = -1 * (E - t.length);
    }
    e += l.length;
  }
  return t.length > 1 && (i[e] = 1 - t.length), i;
}
const ly = "an indented block", cy = "a dedent", nv = 1114112;
class rI extends au {
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
    return this._indentationAt(this.pos) !== 0 ? (this.examinedLength = Math.max(this.examinedLength, this.pos), nv) : super.nextCharCode();
  }
  nextCodePoint() {
    return this._indentationAt(this.pos) !== 0 ? (this.examinedLength = Math.max(this.examinedLength, this.pos), nv) : super.nextCodePoint();
  }
}
class iv extends He {
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
    return (r[i] || 0) * a > 0 ? (e.userData = Object.create(r), e.userData[i] -= a, e.pushBinding(new ys(0), i), !0) : (e.processFailure(i, this), !1);
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
    const t = this.isIndent ? ly : cy;
    return new Tr(this, t, "description");
  }
}
const nI = new mt("indent"), iI = new mt("dedent"), sI = new su(Vf, "any", [nI, iI], []), aI = new Mo().newGrammar("IndentationSensitive").withSuperGrammar(Vf).define("indent", [], new iv(!0), ly, void 0, !0).define("dedent", [], new iv(!1), cy, void 0, !0).extend("any", [], sI, "any character", void 0).build();
Object.assign(aI, {
  _matchStateInitializer(n) {
    n.userData = tI(n.input), n.inputStream = new rI(n);
  },
  supportsIncrementalParsing: !1
});
Ir.initApplicationParser(uy, Z1);
const fy = ou(["grammar", { source: `N1QL {

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
    de(this, "sourceRange");
    this.name = "N1QLParseError", typeof r == "number" ? this.sourceRange = [r, i ?? r] : Array.isArray(r) && r.sourceTextStart !== void 0 && (this.sourceRange = [r.sourceTextStart, r.sourceTextEnd ?? r.sourceTextStart]);
  }
}
function oI(n) {
  return uI(n, "SelectStatement");
}
function uI(n, e) {
  lI();
  let t = fy.match(n, e);
  if (t.failed())
    throw new Lr(t.shortMessage, t.getInterval().startIdx, t.getInterval().endIdx);
  return Eo(t).json();
}
let Eo;
function lI() {
  if (Eo !== void 0)
    return;
  Eo = fy.createSemantics();
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
  Eo.addOperation("json()", {
    // Select:
    SelectStatement(i, a, u, l, c, b, I, w, E, k, B) {
      let K = {
        WHAT: t(u.asIteration()),
        FROM: []
      };
      if (l.numChildren > 0 && (K.FROM = e(l.child(0))), a.numChildren > 0 && (K.DISTINCT = !0), b.numChildren > 0 && (K.WHERE = e(b.child(0))), I.numChildren > 0 && (K.GROUP_BY = t(I.child(0).child(2).asIteration())), w.numChildren > 0 && w.child(0).numChildren > 0 && (K.HAVING = e(w.child(0).child(0).child(1))), E.numChildren > 0 && (K.ORDER_BY = t(E.child(0).child(2).asIteration())), k.numChildren > 0) {
        let [C, M, Z] = e(k.child(0));
        M !== null && (K.OFFSET = M), Z !== null && (K.LIMIT = Z);
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
      let b;
      return u.numChildren > 0 ? b = { SCOPE: e(i), COLLECTION: e(u.child(0)) } : b = { COLLECTION: e(i) }, c.numChildren > 0 && (b.AS = e(c.child(0))), b;
    },
    // Kludge: returns JoinSource[], but it has to be typed as Expr
    Join(i, a, u, l, c) {
      const b = e(u);
      return i.numChildren > 0 ? b.JOIN = e(i.child(0)) : b.JOIN = "INNER", b.ON = e(c), b;
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
    EqExp_between(i, a, u, l, c, b) {
      let I = ["BETWEEN", e(i), e(l), e(b)];
      return a.numChildren > 0 && (I = ["NOT", I]), I;
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
    AnyEveryExp(i, a, u, l, c, b, I) {
      const w = e(a), E = e(b);
      return zf(E, (k, B) => (k === "." && B[1] === w && (B[0] = "?"), !0)), [e(i), w, e(l), E];
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
    CaseExp(i, a, u, l, c, b) {
      const I = ["CASE", a.numChildren > 0 ? e(a.child(0)) : null];
      for (const w of u.children)
        I.push(e(w.child(1))), I.push(e(w.child(3)));
      return c.numChildren > 0 && I.push(e(c.child(0))), I;
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
    MetaFunction_property(i, a, u, l, c, b) {
      const I = ["META()"];
      return u.numChildren > 0 ? I.push(e(u.child(0))) : I.push(null), I.push(b.sourceString.toLowerCase()), I;
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
class hy extends Error {
}
function py(n) {
  return n in yy || n in vy || n in new dy(Math.random) || n in new Qf(Math.random, Math.random) || n in Zf;
}
function cI(n) {
  return !n.endsWith("()") && n in new Qf(Math.random, Math.random);
}
function Ac(n, ...e) {
  if (!Array.isArray(n))
    return !1;
  for (let t = 0; t < e.length; ++t)
    if (n[t] !== e[t])
      return !1;
  return !0;
}
function dt(n, e) {
  if (!Array.isArray(n))
    return Me(n !== void 0, "invalid Expr"), Ja(n) ? () => n : pI(n, e);
  const t = n[0];
  try {
    const r = vy[t];
    if (r !== void 0) {
      if (!e.allowCompilingAggregates)
        throw new Lr(`Illegal use of aggregate function ${t} outside result column`);
      const l = new r(n, dt(n[1], e));
      return e.compileAggregate(l);
    }
    const i = n.length - 1;
    if (i === 1) {
      const l = new dy(dt(n[1], e));
      if (l[t])
        return l[t].bind(l);
    } else if (i === 2) {
      const l = new Qf(dt(n[1], e), dt(n[2], e));
      if (l[t])
        return l[t].bind(l);
    }
    const a = yy[t];
    if (a)
      return a(n, e);
    const u = Zf[t];
    if (u)
      return hI(n, e, u);
    throw t.endsWith("()") ? py(t) ? new Lr(`${t} cannot be called with ${i} arguments`) : new Lr(`"${t}" is not a supported function`) : new Lr(`unknown JSON query operator "${t}"`);
  } catch (r) {
    throw r instanceof Lr && r.sourceRange === void 0 && n.sourceTextStart && (r.sourceRange = [n.sourceTextStart, n.sourceTextEnd ?? n.sourceTextStart]), r;
  }
}
const Zf = {};
function fI(n, e, t) {
  if (!n.match(/^[a-zA-Z][a-zA-Z0-9_]+$/))
    throw Error(`N1QL function name "${n}" is not valid. Must be alphanumeric.`);
  const r = n.toUpperCase() + "()";
  if (py(r))
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
function hI(n, e, t) {
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
var Re, pt, Ct, So, rr;
class dy {
  constructor(e) {
    ee(this, Re);
    ee(this, rr);
    G(this, rr, e);
  }
  // Enables method lookup by name
  //---- ARRAYS:
  "ARRAY_AVG()"() {
    return ge(this, Re, pt).call(this, Mm);
  }
  "ARRAY_COUNT()"() {
    return ge(this, Re, pt).call(this, Um);
  }
  "ARRAY_IFNULL()"() {
    return ge(this, Re, pt).call(this, $m);
  }
  "ARRAY_LENGTH()"() {
    return ge(this, Re, pt).call(this, jm);
  }
  "ARRAY_MIN()"() {
    return ge(this, Re, pt).call(this, zm);
  }
  "ARRAY_MAX()"() {
    return ge(this, Re, pt).call(this, Km);
  }
  "ARRAY_SUM()"() {
    return ge(this, Re, pt).call(this, Gm);
  }
  EXISTS() {
    const e = p(this, rr).call(this);
    return Array.isArray(e) && e.length > 0;
  }
  //---- LOGICAL:
  NOT() {
    return ge(this, Re, pt).call(this, (e) => !e);
  }
  //---- MATH:
  "+"() {
    return p(this, rr).call(this);
  }
  "-"() {
    return ge(this, Re, Ct).call(this, (e) => -e);
  }
  "ABS()"() {
    return ge(this, Re, Ct).call(this, Math.abs);
  }
  "ACOS()"() {
    return ge(this, Re, Ct).call(this, Math.acos);
  }
  "ASIN()"() {
    return ge(this, Re, Ct).call(this, Math.asin);
  }
  "ATAN()"() {
    return ge(this, Re, Ct).call(this, Math.atan);
  }
  "CEIL()"() {
    return ge(this, Re, Ct).call(this, Math.ceil);
  }
  "COS()"() {
    return ge(this, Re, Ct).call(this, Math.cos);
  }
  "DEGREES()"() {
    return ge(this, Re, Ct).call(this, (e) => e * 180 / Math.PI);
  }
  "EXP()"() {
    return ge(this, Re, Ct).call(this, Math.exp);
  }
  "FLOOR()"() {
    return ge(this, Re, Ct).call(this, Math.floor);
  }
  "LN()"() {
    return ge(this, Re, Ct).call(this, Math.log);
  }
  "LOG()"() {
    return ge(this, Re, Ct).call(this, Math.log10);
  }
  "RADIANS()"() {
    return ge(this, Re, Ct).call(this, (e) => e * Math.PI / 180);
  }
  "ROUND()"() {
    return ge(this, Re, Ct).call(this, Math.round);
  }
  "ROUND_NEAREST()"() {
    return ge(this, Re, Ct).call(this, Math.round);
  }
  "ROUND_EVEN()"() {
    return ge(this, Re, Ct).call(this, L0);
  }
  "SIGN()"() {
    return ge(this, Re, Ct).call(this, Math.sign);
  }
  "SIN()"() {
    return ge(this, Re, Ct).call(this, Math.sin);
  }
  "SQRT()"() {
    return ge(this, Re, Ct).call(this, Math.sqrt);
  }
  "TAN()"() {
    return ge(this, Re, Ct).call(this, Math.tan);
  }
  "TRUNC()"() {
    return ge(this, Re, Ct).call(this, Math.trunc);
  }
  //---- STRINGS:
  "LENGTH()"() {
    return ge(this, Re, So).call(this, o1);
  }
  "LOWER()"() {
    return ge(this, Re, So).call(this, (e) => e.toLowerCase());
  }
  "UPPER()"() {
    return ge(this, Re, So).call(this, (e) => e.toUpperCase());
  }
  //---- TYPES:
  "IS VALUED"() {
    return _c(p(this, rr).call(this));
  }
  "ISARRAY()"() {
    return ge(this, Re, pt).call(this, Array.isArray);
  }
  "ISATOM()"() {
    return ge(this, Re, pt).call(this, Fd);
  }
  "ISBOOLEAN()"() {
    return ge(this, Re, pt).call(this, Nd);
  }
  "ISNUMBER()"() {
    return ge(this, Re, pt).call(this, Pd);
  }
  "ISOBJECT()"() {
    return ge(this, Re, pt).call(this, Bd);
  }
  "ISSTRING()"() {
    return ge(this, Re, pt).call(this, Dd);
  }
  "ISVALUED()"() {
    return _c(p(this, rr).call(this));
  }
  "TOARRAY()"() {
    return ge(this, Re, pt).call(this, Ld);
  }
  "TOATOM()"() {
    return Fo(p(this, rr).call(this));
  }
  "TOBOOLEAN()"() {
    return ge(this, Re, pt).call(this, qd);
  }
  "TONUMBER()"() {
    return ge(this, Re, pt).call(this, Md);
  }
  "TOOBJECT()"() {
    return ge(this, Re, pt).call(this, Ud);
  }
  "TOSTRING()"() {
    return ge(this, Re, pt).call(this, $d);
  }
  "IS_ARRAY()"() {
    return ge(this, Re, pt).call(this, Array.isArray);
  }
  "IS_ATOM()"() {
    return ge(this, Re, pt).call(this, Fd);
  }
  "IS_BOOLEAN()"() {
    return ge(this, Re, pt).call(this, Nd);
  }
  "IS_NUMBER()"() {
    return ge(this, Re, pt).call(this, Pd);
  }
  "IS_OBJECT()"() {
    return ge(this, Re, pt).call(this, Bd);
  }
  "IS_STRING()"() {
    return ge(this, Re, pt).call(this, Dd);
  }
  "IS_VALUED()"() {
    return _c(p(this, rr).call(this));
  }
  "TO_ARRAY()"() {
    return ge(this, Re, pt).call(this, Ld);
  }
  "TO_ATOM()"() {
    return Fo(p(this, rr).call(this));
  }
  "TO_BOOLEAN()"() {
    return ge(this, Re, pt).call(this, qd);
  }
  "TO_NUMBER()"() {
    return ge(this, Re, pt).call(this, Md);
  }
  "TO_OBJECT()"() {
    return ge(this, Re, pt).call(this, Ud);
  }
  "TO_STRING()"() {
    return ge(this, Re, pt).call(this, $d);
  }
  "TYPE()"() {
    return jd(p(this, rr).call(this));
  }
  "TYPENAME()"() {
    return jd(p(this, rr).call(this));
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
So = function(e) {
  const t = p(this, rr).call(this);
  return typeof t == "string" ? e(t) : t === void 0 ? void 0 : null;
}, rr = new WeakMap();
var ot, Pr, Er, As, Ur, $r;
class Qf {
  constructor(e, t) {
    ee(this, ot);
    ee(this, Ur);
    ee(this, $r);
    G(this, Ur, e), G(this, $r, t);
  }
  // Enables method lookup by name
  //---- ARRAYS:
  "ARRAY_CONTAINS()"() {
    return ge(this, ot, Pr).call(this, N0);
  }
  //---- COMPARISON:
  "="() {
    return ge(this, ot, Pr).call(this, Nn);
  }
  "!="() {
    return ge(this, ot, Pr).call(this, (e, t) => !Nn(e, t));
  }
  // These are undocumented but the N1QL test suite calls them...
  "EQ()"() {
    return ge(this, ot, Pr).call(this, (e, t) => Nn(e, t));
  }
  "LT()"() {
    return ge(this, ot, Pr).call(this, (e, t) => Vt(e, t) < 0);
  }
  "LE()"() {
    return ge(this, ot, Pr).call(this, (e, t) => Vt(e, t) <= 0);
  }
  "GT()"() {
    return ge(this, ot, Pr).call(this, (e, t) => Vt(e, t) > 0);
  }
  "GE()"() {
    return ge(this, ot, Pr).call(this, (e, t) => Vt(e, t) >= 0);
  }
  "<"() {
    return ge(this, ot, Pr).call(this, (e, t) => Vt(e, t) < 0);
  }
  "<="() {
    return ge(this, ot, Pr).call(this, (e, t) => Vt(e, t) <= 0);
  }
  ">"() {
    return ge(this, ot, Pr).call(this, (e, t) => Vt(e, t) > 0);
  }
  ">="() {
    return ge(this, ot, Pr).call(this, (e, t) => Vt(e, t) >= 0);
  }
  "MISSINGIF()"() {
    return Hm(p(this, Ur).call(this), p(this, $r).call(this));
  }
  "NULLIF()"() {
    return Wm(p(this, Ur).call(this), p(this, $r).call(this));
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
    return ge(this, ot, Er).call(this, (e, t) => e + t);
  }
  "-"() {
    return ge(this, ot, Er).call(this, (e, t) => e - t);
  }
  "*"() {
    return ge(this, ot, Er).call(this, (e, t) => e * t);
  }
  "/"() {
    return ge(this, ot, Er).call(this, t1);
  }
  "%"() {
    return ge(this, ot, Er).call(this, (e, t) => e % t);
  }
  "ATAN2()"() {
    return ge(this, ot, Er).call(this, Math.atan2);
  }
  "POWER()"() {
    return ge(this, ot, Er).call(this, Math.pow);
  }
  "DIV()"() {
    return ge(this, ot, Er).call(this, (e, t) => e / t);
  }
  "IDIV()"() {
    return ge(this, ot, Er).call(this, i1);
  }
  "ROUND()"() {
    return ge(this, ot, Er).call(this, Cd);
  }
  "ROUND_NEAREST()"() {
    return ge(this, ot, Er).call(this, Cd);
  }
  "ROUND_EVEN()"() {
    return ge(this, ot, Er).call(this, L0);
  }
  "TRUNC()"() {
    return ge(this, ot, Er).call(this, s1);
  }
  "COSINE_DISTANCE()"() {
    return n1(p(this, Ur).call(this), p(this, $r).call(this));
  }
  //---- STRINGS:
  "||"() {
    return ge(this, ot, As).call(this, (e, t) => e + t);
  }
  "CONTAINS()"() {
    return ge(this, ot, As).call(this, (e, t) => e.includes(t));
  }
  "LTRIM()"() {
    return ge(this, ot, As).call(this, M0);
  }
  "RTRIM()"() {
    return ge(this, ot, As).call(this, U0);
  }
  "TRIM()"() {
    return ge(this, ot, As).call(this, u1);
  }
}
ot = new WeakSet(), /** Helper function for compiling binary operators. Takes the args as CompiledExprs and a function.
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
As = function(e) {
  const t = p(this, Ur).call(this), r = p(this, $r).call(this);
  return typeof t == "string" && typeof r == "string" ? e(t, r) : t === void 0 || r === void 0 ? void 0 : null;
}, Ur = new WeakMap(), $r = new WeakMap();
const vy = {
  "ARRAY_AGG()": Mf,
  "AVG()": Zc,
  "COUNT()": Uf,
  "MAX()": $f,
  "MIN()": jf,
  "SUM()": Kf
}, yy = {
  ".": dI,
  "?": vI,
  "[]": sv,
  $: (n, e) => {
    const t = pi(n[1], "$");
    return e.parameterNames.add(t), () => {
      const r = e.parameters.get(t);
      if (r === void 0)
        throw new hy(`undefined query parameter $${t}`);
      return r;
    };
  },
  "_.": ([n, e, t], r) => {
    const i = dt(e, r), a = pi(t, "2nd arg of '_.'");
    return () => {
      const u = i();
      return gI(u) ? u[a] : void 0;
    };
  },
  ANY: kc,
  EVERY: kc,
  "ANY AND EVERY": kc,
  BETWEEN: av,
  "BETWEEN()": av,
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
        if (Nn(i, r[a]()))
          return r[a + 1]();
      return a < t ? r[a]() : null;
    };
  },
  EXISTS: (n, e) => {
    throw new Lr("sorry, EXISTS is currently unimplemented");
  },
  IN: cv,
  "NOT IN": cv,
  IS: fv,
  "IS NOT": fv,
  LIKE: hv,
  MISSING: () => () => {
  },
  //---- Functions with variable numbers of arguments or other special handling:
  "ARRAY()": sv,
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
  "DATE_ADD_MILLIS()": uv,
  "DATE_ADD_STR()": uv,
  "DATE_DIFF_MILLIS()": lv,
  "DATE_DIFF_STR()": lv,
  "MILLIS_TO_STR()": pv,
  "MILLIS_TO_UTC()": pv,
  "STR_TO_MILLIS()": dv,
  "STR_TO_UTC()": dv,
  "MILLIS_TO_TZ()": ([n, e, t], r) => {
    const i = dt(e, r), a = dt(t, r);
    return () => {
      const u = i(), l = a();
      return typeof u != "number" || typeof l != "string" ? null : F0(u, l);
    };
  },
  "STR_TO_TZ()": ([n, e, t], r) => {
    const i = dt(e, r), a = dt(t, r);
    return () => {
      const u = i(), l = a();
      return typeof u != "string" || typeof l != "string" ? null : e1(u, l);
    };
  },
  "EUCLIDEAN_DISTANCE()": ([n, e, t, r], i) => {
    const a = dt(e, i), u = dt(t, i);
    return r !== void 0 && (r = vv(r, "3rd arg (power) to EUCLIDEAN_DISTANCE()")), () => r1(a(), u(), r);
  },
  "GREATEST()": (n, e) => {
    const t = Xr(n, e);
    return () => Td(t, 1);
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
  "IFMISSINGORNULL()": ov,
  "COALESCE()": ov,
  "LEAST()": (n, e) => {
    const t = Xr(n, e);
    return () => Td(t, -1);
  },
  "LIKE()": hv,
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
        return ((i.flags ?? 0) & sr) !== 0;
      case "expires":
        return i.expires;
      case void 0: {
        const u = {
          id: i.id,
          sequence: i.seq
        };
        return Sa(i) && (u.deleted = !0), i.expires !== void 0 && (u.expires = i.expires), u;
      }
      default:
        return;
    }
  }),
  "REGEXP_CONTAINS()": Oc,
  "REGEXP_LIKE()": Oc,
  "REGEXP_POSITION()": Oc,
  "REGEXP_REPLACE()": ([n, e, t, r, i], a) => {
    const u = dt(e, a), l = RegExp(pi(t, "arg 2 of REGEXP_REPLACE()"), "g"), c = dt(r, a), b = i !== void 0 ? vv(i, "arg 4 of REGEXP_REPLACE()") : 1e9;
    return () => {
      const I = u(), w = c();
      if (typeof I != "string" || typeof w != "string")
        return I;
      let E = 1;
      return I.replace(l, (k) => E++ <= b ? w : k);
    };
  }
};
function kc([n, e, t, r], i) {
  const a = n === "ANY", u = n === "ANY AND EVERY";
  e = pi(e, `variable name in ${n}`);
  const l = dt(t, i), c = dt(r, i);
  return () => {
    const b = l();
    if (!Array.isArray(b) || u && b.length === 0)
      return !1;
    try {
      for (const I of b)
        if (i.variables[e] = I, c()) {
          if (a) return !0;
        } else if (!a) return !1;
      return !a;
    } finally {
      delete i.variables[e];
    }
  };
}
function sv(n, e) {
  if (gy(n)) {
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
function av([n, e, t, r], i) {
  const a = dt(e, i), u = dt(t, i), l = dt(r, i);
  return () => {
    let c = a(), b = u(), I = l();
    if (!(c === void 0 || b === void 0 || I === void 0))
      return c === null || b === null || I === null ? null : Vt(b, c) <= 0 && Vt(I, c) >= 0;
  };
}
function ov(n, e) {
  const t = Xr(n, e);
  return () => {
    for (const r of t) {
      const i = r();
      if (i != null) return i;
    }
    return null;
  };
}
function uv(n, e) {
  const t = Xr(n, e);
  return () => {
    const r = t[0](), i = t[1](), a = t[2]();
    return typeof r != "string" && typeof r != "number" || typeof i != "number" || typeof a != "string" ? null : Jm(r, i, a);
  };
}
function lv(n, e) {
  const t = Xr(n, e);
  return () => {
    const r = t[0](), i = t[1](), a = t[2]();
    return typeof r != "string" && typeof r != "number" || typeof i != "string" && typeof i != "number" || typeof a != "string" ? null : Zm(r, i, a);
  };
}
function pI(n, e) {
  const t = /* @__PURE__ */ new Map();
  let r = !1;
  for (const i of Object.getOwnPropertyNames(n)) {
    const a = n[i];
    Ja(a) ? t.set(i, a) : (t.set(i, dt(a, e)), r = !0);
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
function cv([n, e, t], r) {
  yi(Array.isArray(t), "invalid right-hand-side of IN");
  const i = n === "IN", a = dt(e, r);
  if (t[0] === "[]")
    if (gy(t)) {
      const u = new Set(t.slice(1));
      return () => {
        const l = a();
        return l == null ? l : u.has(l) === i;
      };
    } else {
      const u = t.map((l) => dt(l, r));
      return () => {
        const l = a();
        return l == null ? l : u.some((c) => Nn(c(), l)) === i;
      };
    }
  else {
    const u = dt(t, r);
    return () => {
      const l = a(), c = u();
      if (!(l === void 0 || c === void 0))
        return l === null || !Array.isArray(c) ? null : N0(c, l) === i;
    };
  }
}
function fv([n, e, t], r) {
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
    return () => Nn(a(), u()) === i;
  }
}
function hv([n, e, t], r) {
  const i = dt(e, r);
  if (typeof t == "string") {
    const [a, u] = qf(t);
    switch (a) {
      case 0:
        return () => _o(i, (l) => l === u);
      case 1:
        return () => _o(i, (l) => l.startsWith(u));
      case 2:
        return () => _o(i, (l) => l.endsWith(u));
      default: {
        const l = q0(u);
        return () => _o(i, (c) => l.test(c));
      }
    }
  } else {
    const a = dt(t, r);
    return () => yI(i, a, a1);
  }
}
function dI([n, e, ...t], r) {
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
function pv([n, e, t], r) {
  yi(t === void 0, `format strings are not supported in ${n}`);
  const i = dt(e, r), a = n === "MILLIS_TO_STR()" ? B0 : Ff;
  return () => {
    const u = i();
    return typeof u != "number" ? null : a(u);
  };
}
function dv([n, e, t], r) {
  yi(t === void 0, `format strings are not supported in ${n}`);
  const i = dt(e, r), a = n === "STR_TO_MILLIS()" ? Qm : Xm;
  return () => {
    const u = i();
    return typeof u != "string" ? null : a(u);
  };
}
function Oc([n, e, t], r) {
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
function vI(n, e) {
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
function vv(n, e) {
  return yi(typeof n == "number", `${e} must be a number`), n;
}
function pi(n, e) {
  return yi(typeof n == "string", `${e} must be a string`), n;
}
function Xr(n, e) {
  return n.slice(1).map((t) => dt(t, e));
}
function gy(n) {
  return n.every(Ja);
}
function _o(n, e) {
  const t = n();
  return typeof t == "string" ? e(t) : t === void 0 ? void 0 : null;
}
function yI(n, e, t) {
  const r = n(), i = e();
  return typeof r == "string" && typeof i == "string" ? t(r, i) : r === void 0 || i === void 0 ? void 0 : null;
}
function gI(n) {
  return typeof n == "object" && !Array.isArray(n) && n !== null;
}
var Pi;
class Uo {
  constructor() {
    de(this, "sourceTypes", /* @__PURE__ */ new Map());
    // Types of the data sources
    de(this, "parameterNames", /* @__PURE__ */ new Set());
    // Names of all "$" parameters
    de(this, "variables", {});
    // "?" variables inside ANY/EVERY
    de(this, "results", /* @__PURE__ */ new Map());
    // Maps result alias to expression
    de(this, "parameters", /* @__PURE__ */ new Map());
    // query parameters, set at runtime
    /** Per-row state. Only exists while processing a row during a query. */
    de(this, "row");
    de(this, "allowCompilingAggregates", !1);
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
      return Ar(
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
class da {
  constructor(e) {
    de(this, "dataSources", /* @__PURE__ */ new Map());
    de(this, "aggregates");
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
    let e = new da(this.ctx);
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
        return "$" + yv(n);
      case "?":
        return n[1];
      case "MISSING":
        return e;
      case "NOT":
        return "NOT " + Ft(n[1]);
      case ".":
        return n.length === 2 ? n[1] + ".*" : yv(n);
      case "META()": {
        let t = `META(${n[1]})`;
        return n[2] && (t += "." + n[2]), t;
      }
      default:
        return e.endsWith("()") ? e.slice(0, -2) + "(" + n.slice(1).map(Ft).join(", ") + ")" : cI(e) ? Ft(n[1]) + " " + e + " " + Ft(n[2]) : e === "-" || e === "+" ? e + Ft(n[1]) : e + "[" + n.slice(1).map(Ft).join(", ") + "]";
    }
  } else return Ja(n) ? JSON.stringify(n) : "{" + Object.getOwnPropertyNames(n).map((e) => JSON.stringify(e) + ": " + Ft(n[e])).join(", ") + "}";
}
function yv(n) {
  return n.slice(1).map((e) => typeof e == "number" ? `[${e}]` : e).join(".");
}
class my {
  constructor(e, t) {
    this.sourceExpression = e, this.key = t;
  }
}
class Za extends my {
  get includeMin() {
    return !0;
  }
  get includeMax() {
    return !0;
  }
}
class gv extends Za {
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
    return `${this.key} = ${Ft(this.valueExpr)}`;
  }
}
class mI extends Za {
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
class Rc extends Za {
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
    const e = this.minValueExpr ? Ft(this.minValueExpr) : "", t = this.maxValueExpr ? Ft(this.maxValueExpr) : "", r = this.includeMin ? "[" : "(", i = this.includeMax ? "]" : ")";
    return `${this.key} in range ${r}${e} ... ${t}${i}`;
  }
}
function $o(n) {
  return typeof n == "number" || typeof n == "string" || Array.isArray(n) ? n : void 0;
}
class Tc extends my {
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
    return `${Ft(this.itemExpr)} IN ${this.key}`;
  }
}
var Ao = { exports: {} }, II = Ao.exports, mv;
function bI() {
  return mv || (mv = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r();
    })(II, function() {
      var t = function(s, o) {
        return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(h, y) {
          h.__proto__ = y;
        } || function(h, y) {
          for (var m in y) Object.prototype.hasOwnProperty.call(y, m) && (h[m] = y[m]);
        })(s, o);
      }, r = function() {
        return (r = Object.assign || function(s) {
          for (var o, h = 1, y = arguments.length; h < y; h++) for (var m in o = arguments[h]) Object.prototype.hasOwnProperty.call(o, m) && (s[m] = o[m]);
          return s;
        }).apply(this, arguments);
      };
      function i(s, o, h) {
        for (var y, m = 0, x = o.length; m < x; m++) !y && m in o || ((y = y || Array.prototype.slice.call(o, 0, m))[m] = o[m]);
        return s.concat(y || Array.prototype.slice.call(o));
      }
      var a = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : If, u = Object.keys, l = Array.isArray;
      function c(s, o) {
        return typeof o != "object" || u(o).forEach(function(h) {
          s[h] = o[h];
        }), s;
      }
      typeof Promise > "u" || a.Promise || (a.Promise = Promise);
      var b = Object.getPrototypeOf, I = {}.hasOwnProperty;
      function w(s, o) {
        return I.call(s, o);
      }
      function E(s, o) {
        typeof o == "function" && (o = o(b(s))), (typeof Reflect > "u" ? u : Reflect.ownKeys)(o).forEach(function(h) {
          B(s, h, o[h]);
        });
      }
      var k = Object.defineProperty;
      function B(s, o, h, y) {
        k(s, o, c(h && w(h, "get") && typeof h.get == "function" ? { get: h.get, set: h.set, configurable: !0 } : { value: h, configurable: !0, writable: !0 }, y));
      }
      function K(s) {
        return { from: function(o) {
          return s.prototype = Object.create(o.prototype), B(s.prototype, "constructor", s), { extend: E.bind(null, s.prototype) };
        } };
      }
      var C = Object.getOwnPropertyDescriptor, M = [].slice;
      function Z(s, o, h) {
        return M.call(s, o, h);
      }
      function X(s, o) {
        return o(s);
      }
      function ue(s) {
        if (!s) throw new Error("Assertion Failed");
      }
      function ce(s) {
        a.setImmediate ? setImmediate(s) : setTimeout(s, 0);
      }
      function he(s, o) {
        if (typeof o == "string" && w(s, o)) return s[o];
        if (!o) return s;
        if (typeof o != "string") {
          for (var h = [], y = 0, m = o.length; y < m; ++y) {
            var x = he(s, o[y]);
            h.push(x);
          }
          return h;
        }
        var R = o.indexOf(".");
        if (R !== -1) {
          var N = s[o.substr(0, R)];
          return N == null ? void 0 : he(N, o.substr(R + 1));
        }
      }
      function oe(s, o, h) {
        if (s && o !== void 0 && !("isFrozen" in Object && Object.isFrozen(s))) if (typeof o != "string" && "length" in o) {
          ue(typeof h != "string" && "length" in h);
          for (var y = 0, m = o.length; y < m; ++y) oe(s, o[y], h[y]);
        } else {
          var x, R, N = o.indexOf(".");
          N !== -1 ? (x = o.substr(0, N), (R = o.substr(N + 1)) === "" ? h === void 0 ? l(s) && !isNaN(parseInt(x)) ? s.splice(x, 1) : delete s[x] : s[x] = h : oe(N = !(N = s[x]) || !w(s, x) ? s[x] = {} : N, R, h)) : h === void 0 ? l(s) && !isNaN(parseInt(o)) ? s.splice(o, 1) : delete s[o] : s[o] = h;
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
      var Qt = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(Ce([8, 16, 32, 64].map(function(s) {
        return ["Int", "Uint", "Float"].map(function(o) {
          return o + s + "Array";
        });
      }))).filter(function(s) {
        return a[s];
      }), $e = new Set(Qt.map(function(s) {
        return a[s];
      })), Be = null;
      function Ae(s) {
        return Be = /* @__PURE__ */ new WeakMap(), s = (function o(h) {
          if (!h || typeof h != "object") return h;
          var y = Be.get(h);
          if (y) return y;
          if (l(h)) {
            y = [], Be.set(h, y);
            for (var m = 0, x = h.length; m < x; ++m) y.push(o(h[m]));
          } else if ($e.has(h.constructor)) y = h;
          else {
            var R, N = b(h);
            for (R in y = N === Object.prototype ? {} : Object.create(N), Be.set(h, y), h) w(h, R) && (y[R] = o(h[R]));
          }
          return y;
        })(s), Be = null, s;
      }
      var Ue = {}.toString;
      function st(s) {
        return Ue.call(s).slice(8, -1);
      }
      var vt = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", we = typeof vt == "symbol" ? function(s) {
        var o;
        return s != null && (o = s[vt]) && o.apply(s);
      } : function() {
        return null;
      };
      function We(s, o) {
        return o = s.indexOf(o), 0 <= o && s.splice(o, 1), 0 <= o;
      }
      var ze = {};
      function It(s) {
        var o, h, y, m;
        if (arguments.length === 1) {
          if (l(s)) return s.slice();
          if (this === ze && typeof s == "string") return [s];
          if (m = we(s)) {
            for (h = []; !(y = m.next()).done; ) h.push(y.value);
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
      var Je = typeof Symbol < "u" ? function(s) {
        return s[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, _t = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], qr = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(_t), et = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function Qe(s, o) {
        this.name = s, this.message = o;
      }
      function wt(s, o) {
        return s + ". Errors: " + Object.keys(o).map(function(h) {
          return o[h].toString();
        }).filter(function(h, y, m) {
          return m.indexOf(h) === y;
        }).join(`
`);
      }
      function yt(s, o, h, y) {
        this.failures = o, this.failedKeys = y, this.successCount = h, this.message = wt(s, o);
      }
      function Ye(s, o) {
        this.name = "BulkError", this.failures = Object.keys(o).map(function(h) {
          return o[h];
        }), this.failuresByPos = o, this.message = wt(s, this.failures);
      }
      K(Qe).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), K(yt).from(Qe), K(Ye).from(Qe);
      var ut = qr.reduce(function(s, o) {
        return s[o] = o + "Error", s;
      }, {}), Pe = Qe, pe = qr.reduce(function(s, o) {
        var h = o + "Error";
        function y(m, x) {
          this.name = h, m ? typeof m == "string" ? (this.message = "".concat(m).concat(x ? `
 ` + x : ""), this.inner = x || null) : typeof m == "object" && (this.message = "".concat(m.name, " ").concat(m.message), this.inner = m) : (this.message = et[o] || h, this.inner = null);
        }
        return K(y).from(Pe), s[o] = y, s;
      }, {});
      pe.Syntax = SyntaxError, pe.Type = TypeError, pe.Range = RangeError;
      var Fe = _t.reduce(function(s, o) {
        return s[o + "Error"] = pe[o], s;
      }, {}), tt = qr.reduce(function(s, o) {
        return ["Syntax", "Type", "Range"].indexOf(o) === -1 && (s[o + "Error"] = pe[o]), s;
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
      function lt(s, o) {
        return s === me ? o : function() {
          var h = s.apply(this, arguments);
          h !== void 0 && (arguments[0] = h);
          var y = this.onsuccess, m = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var x = o.apply(this, arguments);
          return y && (this.onsuccess = this.onsuccess ? ht(y, this.onsuccess) : y), m && (this.onerror = this.onerror ? ht(m, this.onerror) : m), x !== void 0 ? x : h;
        };
      }
      function it(s, o) {
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
          var m = this.onsuccess, x = this.onerror;
          return this.onsuccess = null, this.onerror = null, h = o.apply(this, arguments), m && (this.onsuccess = this.onsuccess ? ht(m, this.onsuccess) : m), x && (this.onerror = this.onerror ? ht(x, this.onerror) : x), y === void 0 ? h === void 0 ? void 0 : h : c(y, h);
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
            for (var y = this, m = arguments.length, x = new Array(m); m--; ) x[m] = arguments[m];
            return h.then(function() {
              return o.apply(y, x);
            });
          }
          return o.apply(this, arguments);
        };
      }
      tt.ModifyError = yt, tt.DexieError = Qe, tt.BulkError = Ye;
      var qe = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function Xe(s) {
        qe = s;
      }
      var Et = {}, Lt = 100, Qt = typeof Promise > "u" ? [] : (function() {
        var s = Promise.resolve();
        if (typeof crypto > "u" || !crypto.subtle) return [s, b(s), s];
        var o = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [o, b(o), s];
      })(), _t = Qt[0], qr = Qt[1], Qt = Qt[2], qr = qr && qr.then, S = _t && _t.constructor, d = !!Qt, v = function(s, o) {
        _.push([s, o]), g && (queueMicrotask(Ee), g = !1);
      }, O = !0, g = !0, T = [], L = [], le = je, D = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: me, pgp: !1, env: {}, finalize: me }, q = D, _ = [], ie = 0, Ne = [];
      function f(s) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var o = this._PSD = q;
        if (typeof s != "function") {
          if (s !== Et) throw new TypeError("Not a function");
          return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && A(this, this._value));
        }
        this._state = null, this._value = null, ++o.ref, (function h(y, m) {
          try {
            m(function(x) {
              if (y._state === null) {
                if (x === y) throw new TypeError("A promise cannot be resolved with itself.");
                var R = y._lib && xe();
                x && typeof x.then == "function" ? h(y, function(N, U) {
                  x instanceof f ? x._then(N, U) : x.then(N, U);
                }) : (y._state = !0, y._value = x, F(y)), R && Ze();
              }
            }, A.bind(null, y));
          } catch (x) {
            A(y, x);
          }
        })(this, s);
      }
      var te = { get: function() {
        var s = q, o = mn;
        function h(y, m) {
          var x = this, R = !s.global && (s !== q || o !== mn), N = R && !jt(), U = new f(function(j, H) {
            Q(x, new ne(lh(y, s, R, N), lh(m, s, R, N), j, H, s));
          });
          return this._consoleTask && (U._consoleTask = this._consoleTask), U;
        }
        return h.prototype = Et, h;
      }, set: function(s) {
        B(this, "then", s && s.prototype === Et ? te : { get: function() {
          return s;
        }, set: te.set });
      } };
      function ne(s, o, h, y, m) {
        this.onFulfilled = typeof s == "function" ? s : null, this.onRejected = typeof o == "function" ? o : null, this.resolve = h, this.reject = y, this.psd = m;
      }
      function A(s, o) {
        var h, y;
        L.push(o), s._state === null && (h = s._lib && xe(), o = le(o), s._state = !1, s._value = o, y = s, T.some(function(m) {
          return m._value === y._value;
        }) || T.push(y), F(s), h && Ze());
      }
      function F(s) {
        var o = s._listeners;
        s._listeners = [];
        for (var h = 0, y = o.length; h < y; ++h) Q(s, o[h]);
        var m = s._PSD;
        --m.ref || m.finalize(), ie === 0 && (++ie, v(function() {
          --ie == 0 && Cr();
        }, []));
      }
      function Q(s, o) {
        if (s._state !== null) {
          var h = s._state ? o.onFulfilled : o.onRejected;
          if (h === null) return (s._state ? o.resolve : o.reject)(s._value);
          ++o.psd.ref, ++ie, v(Oe, [h, s, o]);
        } else s._listeners.push(o);
      }
      function Oe(s, o, h) {
        try {
          var y, m = o._value;
          !o._state && L.length && (L = []), y = qe && o._consoleTask ? o._consoleTask.run(function() {
            return s(m);
          }) : s(m), o._state || L.indexOf(m) !== -1 || (function(x) {
            for (var R = T.length; R; ) if (T[--R]._value === x._value) return T.splice(R, 1);
          })(o), h.resolve(y);
        } catch (x) {
          h.reject(x);
        } finally {
          --ie == 0 && Cr(), --h.psd.ref || h.psd.finalize();
        }
      }
      function Ee() {
        wi(D, function() {
          xe() && Ze();
        });
      }
      function xe() {
        var s = O;
        return g = O = !1, s;
      }
      function Ze() {
        var s, o, h;
        do
          for (; 0 < _.length; ) for (s = _, _ = [], h = s.length, o = 0; o < h; ++o) {
            var y = s[o];
            y[0].apply(null, y[1]);
          }
        while (0 < _.length);
        g = O = !0;
      }
      function Cr() {
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
          var y = xe(), m = q;
          try {
            return Bn(h, !0), s.apply(this, arguments);
          } catch (x) {
            o && o(x);
          } finally {
            Bn(m, !1), y && Ze();
          }
        };
      }
      E(f.prototype, { then: te, _then: function(s, o) {
        Q(this, new ne(null, null, s, o, q));
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
        return s < 1 / 0 ? new f(function(y, m) {
          var x = setTimeout(function() {
            return m(new pe.Timeout(o));
          }, s);
          h.then(y, m).finally(clearTimeout.bind(null, x));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && B(f.prototype, Symbol.toStringTag, "Dexie.Promise"), D.env = uh(), E(f, { all: function() {
        var s = It.apply(null, arguments).map(hr);
        return new f(function(o, h) {
          s.length === 0 && o([]);
          var y = s.length;
          s.forEach(function(m, x) {
            return f.resolve(m).then(function(R) {
              s[x] = R, --y || o(s);
            }, h);
          });
        });
      }, resolve: function(s) {
        return s instanceof f ? s : s && typeof s.then == "function" ? new f(function(o, h) {
          s.then(o, h);
        }) : new f(Et, !0, s);
      }, reject: bt, race: function() {
        var s = It.apply(null, arguments).map(hr);
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
        return mn;
      } }, newPSD: Pt, usePSD: wi, scheduler: { get: function() {
        return v;
      }, set: function(s) {
        v = s;
      } }, rejectionMapper: { get: function() {
        return le;
      }, set: function(s) {
        le = s;
      } }, follow: function(s, o) {
        return new f(function(h, y) {
          return Pt(function(m, x) {
            var R = q;
            R.unhandleds = [], R.onunhandled = x, R.finalize = ht(function() {
              var N, U = this;
              N = function() {
                U.unhandleds.length === 0 ? m() : x(U.unhandleds[0]);
              }, Ne.push(function j() {
                N(), Ne.splice(Ne.indexOf(j), 1);
              }), ++ie, v(function() {
                --ie == 0 && Cr();
              }, []);
            }, R.finalize), s();
          }, o, h, y);
        });
      } }), S && (S.allSettled && B(f, "allSettled", function() {
        var s = It.apply(null, arguments).map(hr);
        return new f(function(o) {
          s.length === 0 && o([]);
          var h = s.length, y = new Array(h);
          s.forEach(function(m, x) {
            return f.resolve(m).then(function(R) {
              return y[x] = { status: "fulfilled", value: R };
            }, function(R) {
              return y[x] = { status: "rejected", reason: R };
            }).then(function() {
              return --h || o(y);
            });
          });
        });
      }), S.any && typeof AggregateError < "u" && B(f, "any", function() {
        var s = It.apply(null, arguments).map(hr);
        return new f(function(o, h) {
          s.length === 0 && h(new AggregateError([]));
          var y = s.length, m = new Array(y);
          s.forEach(function(x, R) {
            return f.resolve(x).then(function(N) {
              return o(N);
            }, function(N) {
              m[R] = N, --y || h(new AggregateError(m));
            });
          });
        });
      }), S.withResolvers && (f.withResolvers = S.withResolvers));
      var rt = { awaits: 0, echoes: 0, id: 0 }, $t = 0, Mt = [], gn = 0, mn = 0, Rt = 0;
      function Pt(s, o, h, y) {
        var m = q, x = Object.create(m);
        return x.parent = m, x.ref = 0, x.global = !1, x.id = ++Rt, D.env, x.env = d ? { Promise: f, PromiseProp: { value: f, configurable: !0, writable: !0 }, all: f.all, race: f.race, allSettled: f.allSettled, any: f.any, resolve: f.resolve, reject: f.reject } : {}, o && c(x, o), ++m.ref, x.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, y = wi(x, s, h, y), x.ref === 0 && x.finalize(), y;
      }
      function St() {
        return rt.id || (rt.id = ++$t), ++rt.awaits, rt.echoes += Lt, rt.id;
      }
      function jt() {
        return !!rt.awaits && (--rt.awaits == 0 && (rt.id = 0), rt.echoes = rt.awaits * Lt, !0);
      }
      function hr(s) {
        return rt.echoes && s && s.constructor === S ? (St(), s.then(function(o) {
          return jt(), o;
        }, function(o) {
          return jt(), Dt(o);
        })) : s;
      }
      function Qa() {
        var s = Mt[Mt.length - 1];
        Mt.pop(), Bn(s, !1);
      }
      function Bn(s, o) {
        var h, y = q;
        (o ? !rt.echoes || gn++ && s === q : !gn || --gn && s === q) || queueMicrotask(o ? (function(m) {
          ++mn, rt.echoes && --rt.echoes != 0 || (rt.echoes = rt.awaits = rt.id = 0), Mt.push(q), Bn(m, !0);
        }).bind(null, s) : Qa), s !== q && (q = s, y === D && (D.env = uh()), d && (h = D.env.Promise, o = s.env, (y.global || s.global) && (Object.defineProperty(a, "Promise", o.PromiseProp), h.all = o.all, h.race = o.race, h.resolve = o.resolve, h.reject = o.reject, o.allSettled && (h.allSettled = o.allSettled), o.any && (h.any = o.any))));
      }
      function uh() {
        var s = a.Promise;
        return d ? { Promise: s, PromiseProp: Object.getOwnPropertyDescriptor(a, "Promise"), all: s.all, race: s.race, allSettled: s.allSettled, any: s.any, resolve: s.resolve, reject: s.reject } : {};
      }
      function wi(s, o, h, y, m) {
        var x = q;
        try {
          return Bn(s, !0), o(h, y, m);
        } finally {
          Bn(x, !1);
        }
      }
      function lh(s, o, h, y) {
        return typeof s != "function" ? s : function() {
          var m = q;
          h && St(), Bn(o, !0);
          try {
            return s.apply(this, arguments);
          } finally {
            Bn(m, !1), y && queueMicrotask(jt);
          }
        };
      }
      function lu(s) {
        Promise === S && rt.echoes === 0 ? gn === 0 ? s() : enqueueNativeMicroTask(s) : setTimeout(s, 0);
      }
      ("" + qr).indexOf("[native code]") === -1 && (St = jt = me);
      var Dt = f.reject, xi = "￿", In = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", ch = "String expected.", gs = [], Xa = "__dbnames", cu = "readonly", fu = "readwrite";
      function Ei(s, o) {
        return s ? o ? function() {
          return s.apply(this, arguments) && o.apply(this, arguments);
        } : s : o;
      }
      var fh = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function eo(s) {
        return typeof s != "string" || /\./.test(s) ? function(o) {
          return o;
        } : function(o) {
          return o[s] === void 0 && s in o && delete (o = Ae(o))[s], o;
        };
      }
      function hh() {
        throw pe.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function at(s, o) {
        try {
          var h = ph(s), y = ph(o);
          if (h !== y) return h === "Array" ? 1 : y === "Array" ? -1 : h === "binary" ? 1 : y === "binary" ? -1 : h === "string" ? 1 : y === "string" ? -1 : h === "Date" ? 1 : y !== "Date" ? NaN : -1;
          switch (h) {
            case "number":
            case "Date":
            case "string":
              return o < s ? 1 : s < o ? -1 : 0;
            case "binary":
              return (function(m, x) {
                for (var R = m.length, N = x.length, U = R < N ? R : N, j = 0; j < U; ++j) if (m[j] !== x[j]) return m[j] < x[j] ? -1 : 1;
                return R === N ? 0 : R < N ? -1 : 1;
              })(dh(s), dh(o));
            case "Array":
              return (function(m, x) {
                for (var R = m.length, N = x.length, U = R < N ? R : N, j = 0; j < U; ++j) {
                  var H = at(m[j], x[j]);
                  if (H !== 0) return H;
                }
                return R === N ? 0 : R < N ? -1 : 1;
              })(s, o);
          }
        } catch {
        }
        return NaN;
      }
      function ph(s) {
        var o = typeof s;
        return o != "object" ? o : ArrayBuffer.isView(s) ? "binary" : (s = st(s), s === "ArrayBuffer" ? "binary" : s);
      }
      function dh(s) {
        return s instanceof Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : new Uint8Array(s);
      }
      function to(s, o, h) {
        var y = s.schema.yProps;
        return y ? (o && 0 < h.numFailures && (o = o.filter(function(m, x) {
          return !h.failures[x];
        })), Promise.all(y.map(function(m) {
          return m = m.updatesTable, o ? s.db.table(m).where("k").anyOf(o).delete() : s.db.table(m).clear();
        })).then(function() {
          return h;
        })) : h;
      }
      var vh = (xt.prototype._trans = function(s, o, h) {
        var y = this._tx || q.trans, m = this.name, x = qe && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(s === "readonly" ? "read" : "write", " ").concat(this.name));
        function R(j, H, P) {
          if (!P.schema[m]) throw new pe.NotFound("Table " + m + " not part of transaction");
          return o(P.idbtrans, P);
        }
        var N = xe();
        try {
          var U = y && y.db._novip === this.db._novip ? y === q.trans ? y._promise(s, R, h) : Pt(function() {
            return y._promise(s, R, h);
          }, { trans: y, transless: q.transless || q }) : (function j(H, P, V, $) {
            if (H.idbdb && (H._state.openComplete || q.letThrough || H._vip)) {
              var z = H._createTransaction(P, V, H._dbSchema);
              try {
                z.create(), H._state.PR1398_maxLoop = 3;
              } catch (Y) {
                return Y.name === ut.InvalidState && H.isOpen() && 0 < --H._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), H.close({ disableAutoOpen: !1 }), H.open().then(function() {
                  return j(H, P, V, $);
                })) : Dt(Y);
              }
              return z._promise(P, function(Y, W) {
                return Pt(function() {
                  return q.trans = z, $(Y, W, z);
                });
              }).then(function(Y) {
                if (P === "readwrite") try {
                  z.idbtrans.commit();
                } catch {
                }
                return P === "readonly" ? Y : z._completion.then(function() {
                  return Y;
                });
              });
            }
            if (H._state.openComplete) return Dt(new pe.DatabaseClosed(H._state.dbOpenError));
            if (!H._state.isBeingOpened) {
              if (!H._state.autoOpen) return Dt(new pe.DatabaseClosed());
              H.open().catch(me);
            }
            return H._state.dbReadyPromise.then(function() {
              return j(H, P, V, $);
            });
          })(this.db, s, [this.name], R);
          return x && (U._consoleTask = x, U = U.catch(function(j) {
            return console.trace(j), Dt(j);
          })), U;
        } finally {
          N && Ze();
        }
      }, xt.prototype.get = function(s, o) {
        var h = this;
        return s && s.constructor === Object ? this.where(s).first(o) : s == null ? Dt(new pe.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(y) {
          return h.core.get({ trans: y, key: s }).then(function(m) {
            return h.hook.reading.fire(m);
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
        function m(N, U) {
          return at(N, U) === 0;
        }
        var R = o.reduce(function(P, U) {
          var j = P[0], H = P[1], P = y[U], V = s[U];
          return [j || P, j || !P ? Ei(H, P && P.multi ? function($) {
            return $ = he($, U), l($) && $.some(function(z) {
              return m(V, z);
            });
          } : function($) {
            return m(V, he($, U));
          }) : H];
        }, [null, null]), x = R[0], R = R[1];
        return x ? this.where(x.name).equals(s[x.keyPath]).filter(R) : h ? this.filter(R) : this.where(o).equals("");
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
        function m() {
          return o !== null && o.apply(this, arguments) || this;
        }
        (this.schema.mappedClass = s).prototype instanceof hh && ((function(U, j) {
          if (typeof j != "function" && j !== null) throw new TypeError("Class extends value " + String(j) + " is not a constructor or null");
          function H() {
            this.constructor = U;
          }
          t(U, j), U.prototype = j === null ? Object.create(j) : (H.prototype = j.prototype, new H());
        })(m, o = s), Object.defineProperty(m.prototype, "db", { get: function() {
          return h;
        }, enumerable: !1, configurable: !0 }), m.prototype.table = function() {
          return y;
        }, s = m);
        for (var x = /* @__PURE__ */ new Set(), R = s.prototype; R; R = b(R)) Object.getOwnPropertyNames(R).forEach(function(U) {
          return x.add(U);
        });
        function N(U) {
          if (!U) return U;
          var j, H = Object.create(s.prototype);
          for (j in U) if (!x.has(j)) try {
            H[j] = U[j];
          } catch {
          }
          return H;
        }
        return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = N, this.hook("reading", N), s;
      }, xt.prototype.defineClass = function() {
        return this.mapToClass(function(s) {
          c(this, s);
        });
      }, xt.prototype.add = function(s, o) {
        var h = this, y = this.schema.primKey, m = y.auto, x = y.keyPath, R = s;
        return x && m && (R = eo(x)(s)), this._trans("readwrite", function(N) {
          return h.core.mutate({ trans: N, type: "add", keys: o != null ? [o] : null, values: [R] });
        }).then(function(N) {
          return N.numFailures ? f.reject(N.failures[0]) : N.lastResult;
        }).then(function(N) {
          if (x) try {
            oe(s, x, N);
          } catch {
          }
          return N;
        });
      }, xt.prototype.update = function(s, o) {
        return typeof s != "object" || l(s) ? this.where(":id").equals(s).modify(o) : (s = he(s, this.schema.primKey.keyPath), s === void 0 ? Dt(new pe.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(s).modify(o));
      }, xt.prototype.put = function(s, o) {
        var h = this, y = this.schema.primKey, m = y.auto, x = y.keyPath, R = s;
        return x && m && (R = eo(x)(s)), this._trans("readwrite", function(N) {
          return h.core.mutate({ trans: N, type: "put", values: [R], keys: o != null ? [o] : null });
        }).then(function(N) {
          return N.numFailures ? f.reject(N.failures[0]) : N.lastResult;
        }).then(function(N) {
          if (x) try {
            oe(s, x, N);
          } catch {
          }
          return N;
        });
      }, xt.prototype.delete = function(s) {
        var o = this;
        return this._trans("readwrite", function(h) {
          return o.core.mutate({ trans: h, type: "delete", keys: [s] }).then(function(y) {
            return to(o, [s], y);
          }).then(function(y) {
            return y.numFailures ? f.reject(y.failures[0]) : void 0;
          });
        });
      }, xt.prototype.clear = function() {
        var s = this;
        return this._trans("readwrite", function(o) {
          return s.core.mutate({ trans: o, type: "deleteRange", range: fh }).then(function(h) {
            return to(s, null, h);
          });
        }).then(function(o) {
          return o.numFailures ? f.reject(o.failures[0]) : void 0;
        });
      }, xt.prototype.bulkGet = function(s) {
        var o = this;
        return this._trans("readonly", function(h) {
          return o.core.getMany({ keys: s, trans: h }).then(function(y) {
            return y.map(function(m) {
              return o.hook.reading.fire(m);
            });
          });
        });
      }, xt.prototype.bulkAdd = function(s, o, h) {
        var y = this, m = Array.isArray(o) ? o : void 0, x = (h = h || (m ? void 0 : o)) ? h.allKeys : void 0;
        return this._trans("readwrite", function(R) {
          var j = y.schema.primKey, N = j.auto, j = j.keyPath;
          if (j && m) throw new pe.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (m && m.length !== s.length) throw new pe.InvalidArgument("Arguments objects and keys must have the same length");
          var U = s.length, j = j && N ? s.map(eo(j)) : s;
          return y.core.mutate({ trans: R, type: "add", keys: m, values: j, wantResults: x }).then(function(z) {
            var P = z.numFailures, V = z.results, $ = z.lastResult, z = z.failures;
            if (P === 0) return x ? V : $;
            throw new Ye("".concat(y.name, ".bulkAdd(): ").concat(P, " of ").concat(U, " operations failed"), z);
          });
        });
      }, xt.prototype.bulkPut = function(s, o, h) {
        var y = this, m = Array.isArray(o) ? o : void 0, x = (h = h || (m ? void 0 : o)) ? h.allKeys : void 0;
        return this._trans("readwrite", function(R) {
          var j = y.schema.primKey, N = j.auto, j = j.keyPath;
          if (j && m) throw new pe.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (m && m.length !== s.length) throw new pe.InvalidArgument("Arguments objects and keys must have the same length");
          var U = s.length, j = j && N ? s.map(eo(j)) : s;
          return y.core.mutate({ trans: R, type: "put", keys: m, values: j, wantResults: x }).then(function(z) {
            var P = z.numFailures, V = z.results, $ = z.lastResult, z = z.failures;
            if (P === 0) return x ? V : $;
            throw new Ye("".concat(y.name, ".bulkPut(): ").concat(P, " of ").concat(U, " operations failed"), z);
          });
        });
      }, xt.prototype.bulkUpdate = function(s) {
        var o = this, h = this.core, y = s.map(function(R) {
          return R.key;
        }), m = s.map(function(R) {
          return R.changes;
        }), x = [];
        return this._trans("readwrite", function(R) {
          return h.getMany({ trans: R, keys: y, cache: "clone" }).then(function(N) {
            var U = [], j = [];
            s.forEach(function(P, V) {
              var $ = P.key, z = P.changes, Y = N[V];
              if (Y) {
                for (var W = 0, J = Object.keys(z); W < J.length; W++) {
                  var re = J[W], se = z[re];
                  if (re === o.schema.primKey.keyPath) {
                    if (at(se, $) !== 0) throw new pe.Constraint("Cannot update primary key in bulkUpdate()");
                  } else oe(Y, re, se);
                }
                x.push(V), U.push($), j.push(Y);
              }
            });
            var H = U.length;
            return h.mutate({ trans: R, type: "put", keys: U, values: j, updates: { keys: y, changeSpecs: m } }).then(function(P) {
              var V = P.numFailures, $ = P.failures;
              if (V === 0) return H;
              for (var z = 0, Y = Object.keys($); z < Y.length; z++) {
                var W, J = Y[z], re = x[Number(J)];
                re != null && (W = $[J], delete $[J], $[re] = W);
              }
              throw new Ye("".concat(o.name, ".bulkUpdate(): ").concat(V, " of ").concat(H, " operations failed"), $);
            });
          });
        });
      }, xt.prototype.bulkDelete = function(s) {
        var o = this, h = s.length;
        return this._trans("readwrite", function(y) {
          return o.core.mutate({ trans: y, type: "delete", keys: s }).then(function(m) {
            return to(o, s, m);
          });
        }).then(function(R) {
          var m = R.numFailures, x = R.lastResult, R = R.failures;
          if (m === 0) return x;
          throw new Ye("".concat(o.name, ".bulkDelete(): ").concat(m, " of ").concat(h, " operations failed"), R);
        });
      }, xt);
      function xt() {
      }
      function va(s) {
        function o(R, N) {
          if (N) {
            for (var U = arguments.length, j = new Array(U - 1); --U; ) j[U - 1] = arguments[U];
            return h[R].subscribe.apply(null, j), s;
          }
          if (typeof R == "string") return h[R];
        }
        var h = {};
        o.addEventType = x;
        for (var y = 1, m = arguments.length; y < m; ++y) x(arguments[y]);
        return o;
        function x(R, N, U) {
          if (typeof R != "object") {
            var j;
            N = N || kt;
            var H = { subscribers: [], fire: U = U || me, subscribe: function(P) {
              H.subscribers.indexOf(P) === -1 && (H.subscribers.push(P), H.fire = N(H.fire, P));
            }, unsubscribe: function(P) {
              H.subscribers = H.subscribers.filter(function(V) {
                return V !== P;
              }), H.fire = H.subscribers.reduce(N, U);
            } };
            return h[R] = o[R] = H;
          }
          u(j = R).forEach(function(P) {
            var V = j[P];
            if (l(V)) x(P, j[P][0], j[P][1]);
            else {
              if (V !== "asap") throw new pe.InvalidArgument("Invalid event config");
              var $ = x(P, je, function() {
                for (var z = arguments.length, Y = new Array(z); z--; ) Y[z] = arguments[z];
                $.subscribers.forEach(function(W) {
                  ce(function() {
                    W.apply(null, Y);
                  });
                });
              });
            }
          });
        }
      }
      function ya(s, o) {
        return K(o).from({ prototype: s }), o;
      }
      function ms(s, o) {
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
      function ro(s, o) {
        if (s.isPrimKey) return o.primaryKey;
        var h = o.getIndexByKeyPath(s.index);
        if (!h) throw new pe.Schema("KeyPath " + s.index + " on object store " + o.name + " is not indexed");
        return h;
      }
      function yh(s, o, h) {
        var y = ro(s, o.schema);
        return o.openCursor({ trans: h, values: !s.keysOnly, reverse: s.dir === "prev", unique: !!s.unique, query: { index: y, range: s.range } });
      }
      function no(s, o, h, y) {
        var m = s.replayFilter ? Ei(s.filter, s.replayFilter()) : s.filter;
        if (s.or) {
          var x = {}, R = function(N, U, j) {
            var H, P;
            m && !m(U, j, function(V) {
              return U.stop(V);
            }, function(V) {
              return U.fail(V);
            }) || ((P = "" + (H = U.primaryKey)) == "[object ArrayBuffer]" && (P = "" + new Uint8Array(H)), w(x, P) || (x[P] = !0, o(N, U, j)));
          };
          return Promise.all([s.or._iterate(R, h), gh(yh(s, y, h), s.algorithm, R, !s.keysOnly && s.valueMapper)]);
        }
        return gh(yh(s, y, h), Ei(s.algorithm, m), o, !s.keysOnly && s.valueMapper);
      }
      function gh(s, o, h, y) {
        var m = Te(y ? function(x, R, N) {
          return h(y(x), R, N);
        } : h);
        return s.then(function(x) {
          if (x) return x.start(function() {
            var R = function() {
              return x.continue();
            };
            o && !o(x, function(N) {
              return R = N;
            }, function(N) {
              x.stop(N), R = me;
            }, function(N) {
              x.fail(N), R = me;
            }) || m(x.value, x, function(N) {
              return R = N;
            }), R();
          });
        });
      }
      var ga = (mh.prototype.execute = function(s) {
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
          if (l(y)) return l(s) ? s.filter(function(m) {
            return !y.includes(m);
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
      var My = (ft.prototype._read = function(s, o) {
        var h = this._ctx;
        return h.error ? h.table._trans(null, Dt.bind(null, h.error)) : h.table._trans("readonly", s).then(o);
      }, ft.prototype._write = function(s) {
        var o = this._ctx;
        return o.error ? o.table._trans(null, Dt.bind(null, o.error)) : o.table._trans("readwrite", s, "locked");
      }, ft.prototype._addAlgorithm = function(s) {
        var o = this._ctx;
        o.algorithm = Ei(o.algorithm, s);
      }, ft.prototype._iterate = function(s, o) {
        return no(this._ctx, s, o, this._ctx.table.core);
      }, ft.prototype.clone = function(s) {
        var o = Object.create(this.constructor.prototype), h = Object.create(this._ctx);
        return s && c(h, s), o._ctx = h, o;
      }, ft.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, ft.prototype.each = function(s) {
        var o = this._ctx;
        return this._read(function(h) {
          return no(o, s, h, o.table.core);
        });
      }, ft.prototype.count = function(s) {
        var o = this;
        return this._read(function(h) {
          var y = o._ctx, m = y.table.core;
          if (ms(y, !0)) return m.count({ trans: h, query: { index: ro(y, m.schema), range: y.range } }).then(function(R) {
            return Math.min(R, y.limit);
          });
          var x = 0;
          return no(y, function() {
            return ++x, !1;
          }, h, m).then(function() {
            return x;
          });
        }).then(s);
      }, ft.prototype.sortBy = function(s, o) {
        var h = s.split(".").reverse(), y = h[0], m = h.length - 1;
        function x(U, j) {
          return j ? x(U[h[j]], j - 1) : U[y];
        }
        var R = this._ctx.dir === "next" ? 1 : -1;
        function N(U, j) {
          return at(x(U, m), x(j, m)) * R;
        }
        return this.toArray(function(U) {
          return U.sort(N);
        }).then(o);
      }, ft.prototype.toArray = function(s) {
        var o = this;
        return this._read(function(h) {
          var y = o._ctx;
          if (y.dir === "next" && ms(y, !0) && 0 < y.limit) {
            var m = y.valueMapper, x = ro(y, y.table.core.schema);
            return y.table.core.query({ trans: h, limit: y.limit, values: !0, query: { index: x, range: y.range } }).then(function(N) {
              return N = N.result, m ? N.map(m) : N;
            });
          }
          var R = [];
          return no(y, function(N) {
            return R.push(N);
          }, h, y.table.core).then(function() {
            return R;
          });
        }, s);
      }, ft.prototype.offset = function(s) {
        var o = this._ctx;
        return s <= 0 || (o.offset += s, ms(o) ? pu(o, function() {
          var h = s;
          return function(y, m) {
            return h === 0 || (h === 1 ? --h : m(function() {
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
          return function(h, y, m) {
            return --o <= 0 && y(m), 0 <= o;
          };
        }, !0), this;
      }, ft.prototype.until = function(s, o) {
        return hu(this._ctx, function(h, y, m) {
          return !s(h.value) || (y(m), o);
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
        return this.each(function(y, m) {
          h.push(m.key);
        }).then(function() {
          return h;
        }).then(s);
      }, ft.prototype.primaryKeys = function(s) {
        var o = this._ctx;
        if (o.dir === "next" && ms(o, !0) && 0 < o.limit) return this._read(function(y) {
          var m = ro(o, o.table.core.schema);
          return o.table.core.query({ trans: y, values: !1, limit: o.limit, query: { index: m, range: o.range } });
        }).then(function(y) {
          return y.result;
        }).then(s);
        o.keysOnly = !o.isMatch;
        var h = [];
        return this.each(function(y, m) {
          h.push(m.primaryKey);
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
        return hu(this._ctx, function(m) {
          var y = m.primaryKey.toString(), m = w(o, y);
          return o[y] = !0, !m;
        }), this;
      }, ft.prototype.modify = function(s) {
        var o = this, h = this._ctx;
        return this._write(function(y) {
          var m, x, R;
          R = typeof s == "function" ? s : (m = u(s), x = m.length, function(J) {
            for (var re = !1, se = 0; se < x; ++se) {
              var ae = m[se], fe = s[ae], Ie = he(J, ae);
              fe instanceof ga ? (oe(J, ae, fe.execute(Ie)), re = !0) : Ie !== fe && (oe(J, ae, fe), re = !0);
            }
            return re;
          });
          var N = h.table.core, P = N.schema.primaryKey, U = P.outbound, j = P.extractKey, H = 200, P = o.db._options.modifyChunkSize;
          P && (H = typeof P == "object" ? P[N.name] || P["*"] || 200 : P);
          function V(J, ae) {
            var se = ae.failures, ae = ae.numFailures;
            z += J - ae;
            for (var fe = 0, Ie = u(se); fe < Ie.length; fe++) {
              var ve = Ie[fe];
              $.push(se[ve]);
            }
          }
          var $ = [], z = 0, Y = [], W = s === Ih;
          return o.clone().primaryKeys().then(function(J) {
            function re(ae) {
              var fe = Math.min(H, J.length - ae), Ie = J.slice(ae, ae + fe);
              return (W ? Promise.resolve([]) : N.getMany({ trans: y, keys: Ie, cache: "immutable" })).then(function(ve) {
                var ye = [], _e = [], be = U ? [] : null, Se = W ? Ie : [];
                if (!W) for (var Ve = 0; Ve < fe; ++Ve) {
                  var ct = ve[Ve], Ge = { value: Ae(ct), primKey: J[ae + Ve] };
                  R.call(Ge, Ge.value, Ge) !== !1 && (Ge.value == null ? Se.push(J[ae + Ve]) : U || at(j(ct), j(Ge.value)) === 0 ? (_e.push(Ge.value), U && be.push(J[ae + Ve])) : (Se.push(J[ae + Ve]), ye.push(Ge.value)));
                }
                return Promise.resolve(0 < ye.length && N.mutate({ trans: y, type: "add", values: ye }).then(function(Tt) {
                  for (var Ke in Tt.failures) Se.splice(parseInt(Ke), 1);
                  V(ye.length, Tt);
                })).then(function() {
                  return (0 < _e.length || se && typeof s == "object") && N.mutate({ trans: y, type: "put", keys: be, values: _e, criteria: se, changeSpec: typeof s != "function" && s, isAdditionalChunk: 0 < ae }).then(function(Tt) {
                    return V(_e.length, Tt);
                  });
                }).then(function() {
                  return (0 < Se.length || se && W) && N.mutate({ trans: y, type: "delete", keys: Se, criteria: se, isAdditionalChunk: 0 < ae }).then(function(Tt) {
                    return to(h.table, Se, Tt);
                  }).then(function(Tt) {
                    return V(Se.length, Tt);
                  });
                }).then(function() {
                  return J.length > ae + fe && re(ae + H);
                });
              });
            }
            var se = ms(h) && h.limit === 1 / 0 && (typeof s != "function" || W) && { index: h.index, range: h.range };
            return re(0).then(function() {
              if (0 < $.length) throw new yt("Error modifying one or more objects", $, z, Y);
              return J.length;
            });
          });
        });
      }, ft.prototype.delete = function() {
        var s = this._ctx, o = s.range;
        return !ms(s) || s.table.schema.yProps || !s.isPrimKey && o.type !== 3 ? this.modify(Ih) : this._write(function(h) {
          var y = s.table.core.schema.primaryKey, m = o;
          return s.table.core.count({ trans: h, query: { index: y, range: m } }).then(function(x) {
            return s.table.core.mutate({ trans: h, type: "deleteRange", range: m }).then(function(U) {
              var N = U.failures, U = U.numFailures;
              if (U) throw new yt("Could not delete some values", Object.keys(N).map(function(j) {
                return N[j];
              }), x - U);
              return x - U;
            });
          });
        });
      }, ft);
      function ft() {
      }
      var Ih = function(s, o) {
        return o.value = null;
      };
      function Uy(s, o) {
        return s < o ? -1 : s === o ? 0 : 1;
      }
      function $y(s, o) {
        return o < s ? -1 : s === o ? 0 : 1;
      }
      function Nr(s, o, h) {
        return s = s instanceof _h ? new s.Collection(s) : s, s._ctx.error = new (h || TypeError)(o), s;
      }
      function Is(s) {
        return new s.Collection(s, function() {
          return bh("");
        }).limit(0);
      }
      function io(s, o, h, y) {
        var m, x, R, N, U, j, H, P = h.length;
        if (!h.every(function(z) {
          return typeof z == "string";
        })) return Nr(s, ch);
        function V(z) {
          m = z === "next" ? function(W) {
            return W.toUpperCase();
          } : function(W) {
            return W.toLowerCase();
          }, x = z === "next" ? function(W) {
            return W.toLowerCase();
          } : function(W) {
            return W.toUpperCase();
          }, R = z === "next" ? Uy : $y;
          var Y = h.map(function(W) {
            return { lower: x(W), upper: m(W) };
          }).sort(function(W, J) {
            return R(W.lower, J.lower);
          });
          N = Y.map(function(W) {
            return W.upper;
          }), U = Y.map(function(W) {
            return W.lower;
          }), H = (j = z) === "next" ? "" : y;
        }
        V("next"), s = new s.Collection(s, function() {
          return Fn(N[0], U[P - 1] + y);
        }), s._ondirectionchange = function(z) {
          V(z);
        };
        var $ = 0;
        return s._addAlgorithm(function(z, Y, W) {
          var J = z.key;
          if (typeof J != "string") return !1;
          var re = x(J);
          if (o(re, U, $)) return !0;
          for (var se = null, ae = $; ae < P; ++ae) {
            var fe = (function(Ie, ve, ye, _e, be, Se) {
              for (var Ve = Math.min(Ie.length, _e.length), ct = -1, Ge = 0; Ge < Ve; ++Ge) {
                var Tt = ve[Ge];
                if (Tt !== _e[Ge]) return be(Ie[Ge], ye[Ge]) < 0 ? Ie.substr(0, Ge) + ye[Ge] + ye.substr(Ge + 1) : be(Ie[Ge], _e[Ge]) < 0 ? Ie.substr(0, Ge) + _e[Ge] + ye.substr(Ge + 1) : 0 <= ct ? Ie.substr(0, ct) + ve[ct] + ye.substr(ct + 1) : null;
                be(Ie[Ge], Tt) < 0 && (ct = Ge);
              }
              return Ve < _e.length && Se === "next" ? Ie + ye.substr(Ie.length) : Ve < Ie.length && Se === "prev" ? Ie.substr(0, ye.length) : ct < 0 ? null : Ie.substr(0, ct) + _e[ct] + ye.substr(ct + 1);
            })(J, re, N[ae], U[ae], R, j);
            fe === null && se === null ? $ = ae + 1 : (se === null || 0 < R(se, fe)) && (se = fe);
          }
          return Y(se !== null ? function() {
            z.continue(se + H);
          } : W), !1;
        }), s;
      }
      function Fn(s, o, h, y) {
        return { type: 2, lower: s, upper: o, lowerOpen: h, upperOpen: y };
      }
      function bh(s) {
        return { type: 1, lower: s, upper: s };
      }
      var _h = (Object.defineProperty(Kt.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), Kt.prototype.between = function(s, o, h, y) {
        h = h !== !1, y = y === !0;
        try {
          return 0 < this._cmp(s, o) || this._cmp(s, o) === 0 && (h || y) && (!h || !y) ? Is(this) : new this.Collection(this, function() {
            return Fn(s, o, !h, !y);
          });
        } catch {
          return Nr(this, In);
        }
      }, Kt.prototype.equals = function(s) {
        return s == null ? Nr(this, In) : new this.Collection(this, function() {
          return bh(s);
        });
      }, Kt.prototype.above = function(s) {
        return s == null ? Nr(this, In) : new this.Collection(this, function() {
          return Fn(s, void 0, !0);
        });
      }, Kt.prototype.aboveOrEqual = function(s) {
        return s == null ? Nr(this, In) : new this.Collection(this, function() {
          return Fn(s, void 0, !1);
        });
      }, Kt.prototype.below = function(s) {
        return s == null ? Nr(this, In) : new this.Collection(this, function() {
          return Fn(void 0, s, !1, !0);
        });
      }, Kt.prototype.belowOrEqual = function(s) {
        return s == null ? Nr(this, In) : new this.Collection(this, function() {
          return Fn(void 0, s);
        });
      }, Kt.prototype.startsWith = function(s) {
        return typeof s != "string" ? Nr(this, ch) : this.between(s, s + xi, !0, !0);
      }, Kt.prototype.startsWithIgnoreCase = function(s) {
        return s === "" ? this.startsWith(s) : io(this, function(o, h) {
          return o.indexOf(h[0]) === 0;
        }, [s], xi);
      }, Kt.prototype.equalsIgnoreCase = function(s) {
        return io(this, function(o, h) {
          return o === h[0];
        }, [s], "");
      }, Kt.prototype.anyOfIgnoreCase = function() {
        var s = It.apply(ze, arguments);
        return s.length === 0 ? Is(this) : io(this, function(o, h) {
          return h.indexOf(o) !== -1;
        }, s, "");
      }, Kt.prototype.startsWithAnyOfIgnoreCase = function() {
        var s = It.apply(ze, arguments);
        return s.length === 0 ? Is(this) : io(this, function(o, h) {
          return h.some(function(y) {
            return o.indexOf(y) === 0;
          });
        }, s, xi);
      }, Kt.prototype.anyOf = function() {
        var s = this, o = It.apply(ze, arguments), h = this._cmp;
        try {
          o.sort(h);
        } catch {
          return Nr(this, In);
        }
        if (o.length === 0) return Is(this);
        var y = new this.Collection(this, function() {
          return Fn(o[0], o[o.length - 1]);
        });
        y._ondirectionchange = function(x) {
          h = x === "next" ? s._ascending : s._descending, o.sort(h);
        };
        var m = 0;
        return y._addAlgorithm(function(x, R, N) {
          for (var U = x.key; 0 < h(U, o[m]); ) if (++m === o.length) return R(N), !1;
          return h(U, o[m]) === 0 || (R(function() {
            x.continue(o[m]);
          }), !1);
        }), y;
      }, Kt.prototype.notEqual = function(s) {
        return this.inAnyRange([[-1 / 0, s], [s, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, Kt.prototype.noneOf = function() {
        var s = It.apply(ze, arguments);
        if (s.length === 0) return new this.Collection(this);
        try {
          s.sort(this._ascending);
        } catch {
          return Nr(this, In);
        }
        var o = s.reduce(function(h, y) {
          return h ? h.concat([[h[h.length - 1][1], y]]) : [[-1 / 0, y]];
        }, null);
        return o.push([s[s.length - 1], this.db._maxKey]), this.inAnyRange(o, { includeLowers: !1, includeUppers: !1 });
      }, Kt.prototype.inAnyRange = function(J, o) {
        var h = this, y = this._cmp, m = this._ascending, x = this._descending, R = this._min, N = this._max;
        if (J.length === 0) return Is(this);
        if (!J.every(function(re) {
          return re[0] !== void 0 && re[1] !== void 0 && m(re[0], re[1]) <= 0;
        })) return Nr(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", pe.InvalidArgument);
        var U = !o || o.includeLowers !== !1, j = o && o.includeUppers === !0, H, P = m;
        function V(re, se) {
          return P(re[0], se[0]);
        }
        try {
          (H = J.reduce(function(re, se) {
            for (var ae = 0, fe = re.length; ae < fe; ++ae) {
              var Ie = re[ae];
              if (y(se[0], Ie[1]) < 0 && 0 < y(se[1], Ie[0])) {
                Ie[0] = R(Ie[0], se[0]), Ie[1] = N(Ie[1], se[1]);
                break;
              }
            }
            return ae === fe && re.push(se), re;
          }, [])).sort(V);
        } catch {
          return Nr(this, In);
        }
        var $ = 0, z = j ? function(re) {
          return 0 < m(re, H[$][1]);
        } : function(re) {
          return 0 <= m(re, H[$][1]);
        }, Y = U ? function(re) {
          return 0 < x(re, H[$][0]);
        } : function(re) {
          return 0 <= x(re, H[$][0]);
        }, W = z, J = new this.Collection(this, function() {
          return Fn(H[0][0], H[H.length - 1][1], !U, !j);
        });
        return J._ondirectionchange = function(re) {
          P = re === "next" ? (W = z, m) : (W = Y, x), H.sort(V);
        }, J._addAlgorithm(function(re, se, ae) {
          for (var fe, Ie = re.key; W(Ie); ) if (++$ === H.length) return se(ae), !1;
          return !z(fe = Ie) && !Y(fe) || (h._cmp(Ie, H[$][1]) === 0 || h._cmp(Ie, H[$][0]) === 0 || se(function() {
            P === m ? re.continue(H[$][0]) : re.continue(H[$][1]);
          }), !1);
        }), J;
      }, Kt.prototype.startsWithAnyOf = function() {
        var s = It.apply(ze, arguments);
        return s.every(function(o) {
          return typeof o == "string";
        }) ? s.length === 0 ? Is(this) : this.inAnyRange(s.map(function(o) {
          return [o, o + xi];
        })) : Nr(this, "startsWithAnyOf() only works with strings");
      }, Kt);
      function Kt() {
      }
      function tn(s) {
        return Te(function(o) {
          return ma(o), s(o.target.error), !1;
        });
      }
      function ma(s) {
        s.stopPropagation && s.stopPropagation(), s.preventDefault && s.preventDefault();
      }
      var Ia = "storagemutated", du = "x-storagemutated-1", Ln = va(null, Ia), jy = (rn.prototype._lock = function() {
        return ue(!q.global), ++this._reculock, this._reculock !== 1 || q.global || (q.lockOwnerFor = this), this;
      }, rn.prototype._unlock = function() {
        if (ue(!q.global), --this._reculock == 0) for (q.global || (q.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
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
        if (ue(!this.idbtrans), !s && !h) switch (y && y.name) {
          case "DatabaseClosedError":
            throw new pe.DatabaseClosed(y);
          case "MissingAPIError":
            throw new pe.MissingAPI(y.message, y);
          default:
            throw new pe.OpenFailed(y);
        }
        if (!this.active) throw new pe.TransactionInactive();
        return ue(this._completion._state === null), (s = this.idbtrans = s || (this.db.core || h).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Te(function(m) {
          ma(m), o._reject(s.error);
        }), s.onabort = Te(function(m) {
          ma(m), o.active && o._reject(new pe.Abort(s.error)), o.active = !1, o.on("abort").fire(m);
        }), s.oncomplete = Te(function() {
          o.active = !1, o._resolve(), "mutatedParts" in s && Ln.storagemutated.fire(s.mutatedParts);
        }), this;
      }, rn.prototype._promise = function(s, o, h) {
        var y = this;
        if (s === "readwrite" && this.mode !== "readwrite") return Dt(new pe.ReadOnly("Transaction is readonly"));
        if (!this.active) return Dt(new pe.TransactionInactive());
        if (this._locked()) return new f(function(x, R) {
          y._blockedFuncs.push([function() {
            y._promise(s, o, h).then(x, R);
          }, q]);
        });
        if (h) return Pt(function() {
          var x = new f(function(R, N) {
            y._lock();
            var U = o(R, N, y);
            U && U.then && U.then(R, N);
          });
          return x.finally(function() {
            return y._unlock();
          }), x._lib = !0, x;
        });
        var m = new f(function(x, R) {
          var N = o(x, R, y);
          N && N.then && N.then(x, R);
        });
        return m._lib = !0, m;
      }, rn.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, rn.prototype.waitFor = function(s) {
        var o, h = this._root(), y = f.resolve(s);
        h._waitingFor ? h._waitingFor = h._waitingFor.then(function() {
          return y;
        }) : (h._waitingFor = y, h._waitingQueue = [], o = h.idbtrans.objectStore(h.storeNames[0]), (function x() {
          for (++h._spinCount; h._waitingQueue.length; ) h._waitingQueue.shift()();
          h._waitingFor && (o.get(-1 / 0).onsuccess = x);
        })());
        var m = h._waitingFor;
        return new f(function(x, R) {
          y.then(function(N) {
            return h._waitingQueue.push(Te(x.bind(null, N)));
          }, function(N) {
            return h._waitingQueue.push(Te(R.bind(null, N)));
          }).finally(function() {
            h._waitingFor === m && (h._waitingFor = null);
          });
        });
      }, rn.prototype.abort = function() {
        this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new pe.Abort()));
      }, rn.prototype.table = function(s) {
        var o = this._memoizedTables || (this._memoizedTables = {});
        if (w(o, s)) return o[s];
        var h = this.schema[s];
        if (!h) throw new pe.NotFound("Table " + s + " not part of transaction");
        return h = new this.db.Table(s, h, this), h.core = this.db.core.table(s), o[s] = h;
      }, rn);
      function rn() {
      }
      function vu(s, o, h, y, m, x, R, N) {
        return { name: s, keyPath: o, unique: h, multi: y, auto: m, compound: x, src: (h && !R ? "&" : "") + (y ? "*" : "") + (m ? "++" : "") + wh(o), type: N };
      }
      function wh(s) {
        return typeof s == "string" ? s : s ? "[" + [].join.call(s, "+") + "]" : "";
      }
      function yu(s, o, h) {
        return { name: s, primKey: o, indexes: h, mappedClass: null, idxByName: (y = function(m) {
          return [m.name, m];
        }, h.reduce(function(m, x, R) {
          return R = y(x, R), R && (m[R[0]] = R[1]), m;
        }, {})) };
        var y;
      }
      var ba = function(s) {
        try {
          return s.only([[]]), ba = function() {
            return [[]];
          }, [[]];
        } catch {
          return ba = function() {
            return xi;
          }, xi;
        }
      };
      function gu(s) {
        return s == null ? function() {
        } : typeof s == "string" ? (o = s).split(".").length === 1 ? function(h) {
          return h[o];
        } : function(h) {
          return he(h, o);
        } : function(h) {
          return he(h, s);
        };
        var o;
      }
      function xh(s) {
        return [].slice.call(s);
      }
      var Ky = 0;
      function _a(s) {
        return s == null ? ":id" : typeof s == "string" ? s : "[".concat(s.join("+"), "]");
      }
      function zy(s, o, U) {
        function y(W) {
          if (W.type === 3) return null;
          if (W.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var $ = W.lower, z = W.upper, Y = W.lowerOpen, W = W.upperOpen;
          return $ === void 0 ? z === void 0 ? null : o.upperBound(z, !!W) : z === void 0 ? o.lowerBound($, !!Y) : o.bound($, z, !!Y, !!W);
        }
        function m(V) {
          var $, z = V.name;
          return { name: z, schema: V, mutate: function(Y) {
            var W = Y.trans, J = Y.type, re = Y.keys, se = Y.values, ae = Y.range;
            return new Promise(function(fe, Ie) {
              fe = Te(fe);
              var ve = W.objectStore(z), ye = ve.keyPath == null, _e = J === "put" || J === "add";
              if (!_e && J !== "delete" && J !== "deleteRange") throw new Error("Invalid operation type: " + J);
              var be, Se = (re || se || { length: 1 }).length;
              if (re && se && re.length !== se.length) throw new Error("Given keys array must have same length as given values array.");
              if (Se === 0) return fe({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function Ve(pr) {
                ++Tt, ma(pr);
              }
              var ct = [], Ge = [], Tt = 0;
              if (J === "deleteRange") {
                if (ae.type === 4) return fe({ numFailures: Tt, failures: Ge, results: [], lastResult: void 0 });
                ae.type === 3 ? ct.push(be = ve.clear()) : ct.push(be = ve.delete(y(ae)));
              } else {
                var ye = _e ? ye ? [se, re] : [se, null] : [re, null], Ke = ye[0], er = ye[1];
                if (_e) for (var tr = 0; tr < Se; ++tr) ct.push(be = er && er[tr] !== void 0 ? ve[J](Ke[tr], er[tr]) : ve[J](Ke[tr])), be.onerror = Ve;
                else for (tr = 0; tr < Se; ++tr) ct.push(be = ve[J](Ke[tr])), be.onerror = Ve;
              }
              function go(pr) {
                pr = pr.target.result, ct.forEach(function(ki, Bu) {
                  return ki.error != null && (Ge[Bu] = ki.error);
                }), fe({ numFailures: Tt, failures: Ge, results: J === "delete" ? re : ct.map(function(ki) {
                  return ki.result;
                }), lastResult: pr });
              }
              be.onerror = function(pr) {
                Ve(pr), go(pr);
              }, be.onsuccess = go;
            });
          }, getMany: function(Y) {
            var W = Y.trans, J = Y.keys;
            return new Promise(function(re, se) {
              re = Te(re);
              for (var ae, fe = W.objectStore(z), Ie = J.length, ve = new Array(Ie), ye = 0, _e = 0, be = function(ct) {
                ct = ct.target, ve[ct._pos] = ct.result, ++_e === ye && re(ve);
              }, Se = tn(se), Ve = 0; Ve < Ie; ++Ve) J[Ve] != null && ((ae = fe.get(J[Ve]))._pos = Ve, ae.onsuccess = be, ae.onerror = Se, ++ye);
              ye === 0 && re(ve);
            });
          }, get: function(Y) {
            var W = Y.trans, J = Y.key;
            return new Promise(function(re, se) {
              re = Te(re);
              var ae = W.objectStore(z).get(J);
              ae.onsuccess = function(fe) {
                return re(fe.target.result);
              }, ae.onerror = tn(se);
            });
          }, query: ($ = j, function(Y) {
            return new Promise(function(W, J) {
              W = Te(W);
              var re, se, ae, ye = Y.trans, fe = Y.values, Ie = Y.limit, be = Y.query, ve = Ie === 1 / 0 ? void 0 : Ie, _e = be.index, be = be.range, ye = ye.objectStore(z), _e = _e.isPrimaryKey ? ye : ye.index(_e.name), be = y(be);
              if (Ie === 0) return W({ result: [] });
              $ ? ((ve = fe ? _e.getAll(be, ve) : _e.getAllKeys(be, ve)).onsuccess = function(Se) {
                return W({ result: Se.target.result });
              }, ve.onerror = tn(J)) : (re = 0, se = !fe && "openKeyCursor" in _e ? _e.openKeyCursor(be) : _e.openCursor(be), ae = [], se.onsuccess = function(Se) {
                var Ve = se.result;
                return Ve ? (ae.push(fe ? Ve.value : Ve.primaryKey), ++re === Ie ? W({ result: ae }) : void Ve.continue()) : W({ result: ae });
              }, se.onerror = tn(J));
            });
          }), openCursor: function(Y) {
            var W = Y.trans, J = Y.values, re = Y.query, se = Y.reverse, ae = Y.unique;
            return new Promise(function(fe, Ie) {
              fe = Te(fe);
              var _e = re.index, ve = re.range, ye = W.objectStore(z), ye = _e.isPrimaryKey ? ye : ye.index(_e.name), _e = se ? ae ? "prevunique" : "prev" : ae ? "nextunique" : "next", be = !J && "openKeyCursor" in ye ? ye.openKeyCursor(y(ve), _e) : ye.openCursor(y(ve), _e);
              be.onerror = tn(Ie), be.onsuccess = Te(function(Se) {
                var Ve, ct, Ge, Tt, Ke = be.result;
                Ke ? (Ke.___id = ++Ky, Ke.done = !1, Ve = Ke.continue.bind(Ke), ct = (ct = Ke.continuePrimaryKey) && ct.bind(Ke), Ge = Ke.advance.bind(Ke), Tt = function() {
                  throw new Error("Cursor not stopped");
                }, Ke.trans = W, Ke.stop = Ke.continue = Ke.continuePrimaryKey = Ke.advance = function() {
                  throw new Error("Cursor not started");
                }, Ke.fail = Te(Ie), Ke.next = function() {
                  var er = this, tr = 1;
                  return this.start(function() {
                    return tr-- ? er.continue() : er.stop();
                  }).then(function() {
                    return er;
                  });
                }, Ke.start = function(er) {
                  function tr() {
                    if (be.result) try {
                      er();
                    } catch (pr) {
                      Ke.fail(pr);
                    }
                    else Ke.done = !0, Ke.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, Ke.stop();
                  }
                  var go = new Promise(function(pr, ki) {
                    pr = Te(pr), be.onerror = tn(ki), Ke.fail = ki, Ke.stop = function(Bu) {
                      Ke.stop = Ke.continue = Ke.continuePrimaryKey = Ke.advance = Tt, pr(Bu);
                    };
                  });
                  return be.onsuccess = Te(function(pr) {
                    be.onsuccess = tr, tr();
                  }), Ke.continue = Ve, Ke.continuePrimaryKey = ct, Ke.advance = Ge, tr(), go;
                }, fe(Ke)) : fe(null);
              }, Ie);
            });
          }, count: function(Y) {
            var W = Y.query, J = Y.trans, re = W.index, se = W.range;
            return new Promise(function(ae, fe) {
              var Ie = J.objectStore(z), ve = re.isPrimaryKey ? Ie : Ie.index(re.name), Ie = y(se), ve = Ie ? ve.count(Ie) : ve.count();
              ve.onsuccess = Te(function(ye) {
                return ae(ye.target.result);
              }), ve.onerror = tn(fe);
            });
          } };
        }
        var x, R, N, H = (R = U, N = xh((x = s).objectStoreNames), { schema: { name: x.name, tables: N.map(function(V) {
          return R.objectStore(V);
        }).map(function(V) {
          var $ = V.keyPath, W = V.autoIncrement, z = l($), Y = {}, W = { name: V.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: $ == null, compound: z, keyPath: $, autoIncrement: W, unique: !0, extractKey: gu($) }, indexes: xh(V.indexNames).map(function(J) {
            return V.index(J);
          }).map(function(ae) {
            var re = ae.name, se = ae.unique, fe = ae.multiEntry, ae = ae.keyPath, fe = { name: re, compound: l(ae), keyPath: ae, unique: se, multiEntry: fe, extractKey: gu(ae) };
            return Y[_a(ae)] = fe;
          }), getIndexByKeyPath: function(J) {
            return Y[_a(J)];
          } };
          return Y[":id"] = W.primaryKey, $ != null && (Y[_a($)] = W.primaryKey), W;
        }) }, hasGetAll: 0 < N.length && "getAll" in R.objectStore(N[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), U = H.schema, j = H.hasGetAll, H = U.tables.map(m), P = {};
        return H.forEach(function(V) {
          return P[V.name] = V;
        }), { stack: "dbcore", transaction: s.transaction.bind(s), table: function(V) {
          if (!P[V]) throw new Error("Table '".concat(V, "' not found"));
          return P[V];
        }, MIN_KEY: -1 / 0, MAX_KEY: ba(o), schema: U };
      }
      function Gy(s, o, h, y) {
        var m = h.IDBKeyRange;
        return h.indexedDB, { dbcore: (y = zy(o, m, y), s.dbcore.reduce(function(x, R) {
          return R = R.create, r(r({}, x), R(x));
        }, y)) };
      }
      function so(s, y) {
        var h = y.db, y = Gy(s._middlewares, h, s._deps, y);
        s.core = y.dbcore, s.tables.forEach(function(m) {
          var x = m.name;
          s.core.schema.tables.some(function(R) {
            return R.name === x;
          }) && (m.core = s.core.table(x), s[x] instanceof s.Table && (s[x].core = m.core));
        });
      }
      function ao(s, o, h, y) {
        h.forEach(function(m) {
          var x = y[m];
          o.forEach(function(R) {
            var N = (function U(j, H) {
              return C(j, H) || (j = b(j)) && U(j, H);
            })(R, m);
            (!N || "value" in N && N.value === void 0) && (R === s.Transaction.prototype || R instanceof s.Transaction ? B(R, m, { get: function() {
              return this.table(m);
            }, set: function(U) {
              k(this, m, { value: U, writable: !0, configurable: !0, enumerable: !0 });
            } }) : R[m] = new s.Table(m, x));
          });
        });
      }
      function mu(s, o) {
        o.forEach(function(h) {
          for (var y in h) h[y] instanceof s.Table && delete h[y];
        });
      }
      function Hy(s, o) {
        return s._cfg.version - o._cfg.version;
      }
      function Wy(s, o, h, y) {
        var m = s._dbSchema;
        h.objectStoreNames.contains("$meta") && !m.$meta && (m.$meta = yu("$meta", Sh("")[0], []), s._storeNames.push("$meta"));
        var x = s._createTransaction("readwrite", s._storeNames, m);
        x.create(h), x._completion.catch(y);
        var R = x._reject.bind(x), N = q.transless || q;
        Pt(function() {
          return q.trans = x, q.transless = N, o !== 0 ? (so(s, h), j = o, ((U = x).storeNames.includes("$meta") ? U.table("$meta").get("version").then(function(H) {
            return H ?? j;
          }) : f.resolve(j)).then(function(H) {
            return V = H, $ = x, z = h, Y = [], H = (P = s)._versions, W = P._dbSchema = uo(0, P.idbdb, z), (H = H.filter(function(J) {
              return J._cfg.version >= V;
            })).length !== 0 ? (H.forEach(function(J) {
              Y.push(function() {
                var re = W, se = J._cfg.dbschema;
                lo(P, re, z), lo(P, se, z), W = P._dbSchema = se;
                var ae = Iu(re, se);
                ae.add.forEach(function(_e) {
                  bu(z, _e[0], _e[1].primKey, _e[1].indexes);
                }), ae.change.forEach(function(_e) {
                  if (_e.recreate) throw new pe.Upgrade("Not yet support for changing primary key");
                  var be = z.objectStore(_e.name);
                  _e.add.forEach(function(Se) {
                    return oo(be, Se);
                  }), _e.change.forEach(function(Se) {
                    be.deleteIndex(Se.name), oo(be, Se);
                  }), _e.del.forEach(function(Se) {
                    return be.deleteIndex(Se);
                  });
                });
                var fe = J._cfg.contentUpgrade;
                if (fe && J._cfg.version > V) {
                  so(P, z), $._memoizedTables = {};
                  var Ie = ke(se);
                  ae.del.forEach(function(_e) {
                    Ie[_e] = re[_e];
                  }), mu(P, [P.Transaction.prototype]), ao(P, [P.Transaction.prototype], u(Ie), Ie), $.schema = Ie;
                  var ve, ye = Je(fe);
                  return ye && St(), ae = f.follow(function() {
                    var _e;
                    (ve = fe($)) && ye && (_e = jt.bind(null, null), ve.then(_e, _e));
                  }), ve && typeof ve.then == "function" ? f.resolve(ve) : ae.then(function() {
                    return ve;
                  });
                }
              }), Y.push(function(re) {
                var se, ae, fe = J._cfg.dbschema;
                se = fe, ae = re, [].slice.call(ae.db.objectStoreNames).forEach(function(Ie) {
                  return se[Ie] == null && ae.db.deleteObjectStore(Ie);
                }), mu(P, [P.Transaction.prototype]), ao(P, [P.Transaction.prototype], P._storeNames, P._dbSchema), $.schema = P._dbSchema;
              }), Y.push(function(re) {
                P.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(P.idbdb.version / 10) === J._cfg.version ? (P.idbdb.deleteObjectStore("$meta"), delete P._dbSchema.$meta, P._storeNames = P._storeNames.filter(function(se) {
                  return se !== "$meta";
                })) : re.objectStore("$meta").put(J._cfg.version, "version"));
              });
            }), (function J() {
              return Y.length ? f.resolve(Y.shift()($.idbtrans)).then(J) : f.resolve();
            })().then(function() {
              Eh(W, z);
            })) : f.resolve();
            var P, V, $, z, Y, W;
          }).catch(R)) : (u(m).forEach(function(H) {
            bu(h, H, m[H].primKey, m[H].indexes);
          }), so(s, h), void f.follow(function() {
            return s.on.populate.fire(x);
          }).catch(R));
          var U, j;
        });
      }
      function Yy(s, o) {
        Eh(s._dbSchema, o), o.db.version % 10 != 0 || o.objectStoreNames.contains("$meta") || o.db.createObjectStore("$meta").add(Math.ceil(o.db.version / 10 - 1), "version");
        var h = uo(0, s.idbdb, o);
        lo(s, s._dbSchema, o);
        for (var y = 0, m = Iu(h, s._dbSchema).change; y < m.length; y++) {
          var x = (function(R) {
            if (R.change.length || R.recreate) return console.warn("Unable to patch indexes of table ".concat(R.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var N = o.objectStore(R.name);
            R.add.forEach(function(U) {
              qe && console.debug("Dexie upgrade patch: Creating missing index ".concat(R.name, ".").concat(U.src)), oo(N, U);
            });
          })(m[y]);
          if (typeof x == "object") return x.value;
        }
      }
      function Iu(s, o) {
        var h, y = { del: [], add: [], change: [] };
        for (h in s) o[h] || y.del.push(h);
        for (h in o) {
          var m = s[h], x = o[h];
          if (m) {
            var R = { name: h, def: x, recreate: !1, del: [], add: [], change: [] };
            if ("" + (m.primKey.keyPath || "") != "" + (x.primKey.keyPath || "") || m.primKey.auto !== x.primKey.auto) R.recreate = !0, y.change.push(R);
            else {
              var N = m.idxByName, U = x.idxByName, j = void 0;
              for (j in N) U[j] || R.del.push(j);
              for (j in U) {
                var H = N[j], P = U[j];
                H ? H.src !== P.src && R.change.push(P) : R.add.push(P);
              }
              (0 < R.del.length || 0 < R.add.length || 0 < R.change.length) && y.change.push(R);
            }
          } else y.add.push([h, x]);
        }
        return y;
      }
      function bu(s, o, h, y) {
        var m = s.db.createObjectStore(o, h.keyPath ? { keyPath: h.keyPath, autoIncrement: h.auto } : { autoIncrement: h.auto });
        return y.forEach(function(x) {
          return oo(m, x);
        }), m;
      }
      function Eh(s, o) {
        u(s).forEach(function(h) {
          o.db.objectStoreNames.contains(h) || (qe && console.debug("Dexie: Creating missing table", h), bu(o, h, s[h].primKey, s[h].indexes));
        });
      }
      function oo(s, o) {
        s.createIndex(o.name, o.keyPath, { unique: o.unique, multiEntry: o.multi });
      }
      function uo(s, o, h) {
        var y = {};
        return Z(o.objectStoreNames, 0).forEach(function(m) {
          for (var x = h.objectStore(m), R = vu(wh(j = x.keyPath), j || "", !0, !1, !!x.autoIncrement, j && typeof j != "string", !0), N = [], U = 0; U < x.indexNames.length; ++U) {
            var H = x.index(x.indexNames[U]), j = H.keyPath, H = vu(H.name, j, !!H.unique, !!H.multiEntry, !1, j && typeof j != "string", !1);
            N.push(H);
          }
          y[m] = yu(m, R, N);
        }), y;
      }
      function lo(s, o, h) {
        for (var y = h.db.objectStoreNames, m = 0; m < y.length; ++m) {
          var x = y[m], R = h.objectStore(x);
          s._hasGetAll = "getAll" in R;
          for (var N = 0; N < R.indexNames.length; ++N) {
            var U = R.indexNames[N], j = R.index(U).keyPath, H = typeof j == "string" ? j : "[" + Z(j).join("+") + "]";
            !o[x] || (j = o[x].idxByName[H]) && (j.name = U, delete o[x].idxByName[H], o[x].idxByName[U] = j);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && a.WorkerGlobalScope && a instanceof a.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (s._hasGetAll = !1);
      }
      function Sh(s) {
        return s.split(",").map(function(o, h) {
          var x = o.split(":"), y = (m = x[1]) === null || m === void 0 ? void 0 : m.trim(), m = (o = x[0].trim()).replace(/([&*]|\+\+)/g, ""), x = /^\[/.test(m) ? m.match(/^\[(.*)\]$/)[1].split("+") : m;
          return vu(m, x || null, /\&/.test(o), /\*/.test(o), /\+\+/.test(o), l(x), h === 0, y);
        });
      }
      var Vy = (bs.prototype._createTableSchema = yu, bs.prototype._parseIndexSyntax = Sh, bs.prototype._parseStoresSpec = function(s, o) {
        var h = this;
        u(s).forEach(function(y) {
          if (s[y] !== null) {
            var m = h._parseIndexSyntax(s[y]), x = m.shift();
            if (!x) throw new pe.Schema("Invalid schema for table " + y + ": " + s[y]);
            if (x.unique = !0, x.multi) throw new pe.Schema("Primary key cannot be multiEntry*");
            m.forEach(function(R) {
              if (R.auto) throw new pe.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!R.keyPath) throw new pe.Schema("Index must have a name and cannot be an empty string");
            }), m = h._createTableSchema(y, x, m), o[y] = m;
          }
        });
      }, bs.prototype.stores = function(h) {
        var o = this.db;
        this._cfg.storesSource = this._cfg.storesSource ? c(this._cfg.storesSource, h) : h;
        var h = o._versions, y = {}, m = {};
        return h.forEach(function(x) {
          c(y, x._cfg.storesSource), m = x._cfg.dbschema = {}, x._parseStoresSpec(y, m);
        }), o._dbSchema = m, mu(o, [o._allTables, o, o.Transaction.prototype]), ao(o, [o._allTables, o, o.Transaction.prototype, this._cfg.tables], u(m), m), o._storeNames = u(m), this;
      }, bs.prototype.upgrade = function(s) {
        return this._cfg.contentUpgrade = Ot(this._cfg.contentUpgrade || me, s), this;
      }, bs);
      function bs() {
      }
      function _u(s, o) {
        var h = s._dbNamesDB;
        return h || (h = s._dbNamesDB = new bn(Xa, { addons: [], indexedDB: s, IDBKeyRange: o })).version(1).stores({ dbnames: "name" }), h.table("dbnames");
      }
      function wu(s) {
        return s && typeof s.databases == "function";
      }
      function xu(s) {
        return Pt(function() {
          return q.letThrough = !0, s();
        });
      }
      function Eu(s) {
        return !("from" in s);
      }
      var Xt = function(s, o) {
        if (!this) {
          var h = new Xt();
          return s && "d" in s && c(h, s), h;
        }
        c(this, arguments.length ? { d: 1, from: s, to: 1 < arguments.length ? o : s } : { d: 0 });
      };
      function wa(s, o, h) {
        var y = at(o, h);
        if (!isNaN(y)) {
          if (0 < y) throw RangeError();
          if (Eu(s)) return c(s, { from: o, to: h, d: 1 });
          var m = s.l, y = s.r;
          if (at(h, s.from) < 0) return m ? wa(m, o, h) : s.l = { from: o, to: h, d: 1, l: null, r: null }, kh(s);
          if (0 < at(o, s.to)) return y ? wa(y, o, h) : s.r = { from: o, to: h, d: 1, l: null, r: null }, kh(s);
          at(o, s.from) < 0 && (s.from = o, s.l = null, s.d = y ? y.d + 1 : 1), 0 < at(h, s.to) && (s.to = h, s.r = null, s.d = s.l ? s.l.d + 1 : 1), h = !s.r, m && !s.l && xa(s, m), y && h && xa(s, y);
        }
      }
      function xa(s, o) {
        Eu(o) || (function h(y, U) {
          var x = U.from, R = U.to, N = U.l, U = U.r;
          wa(y, x, R), N && h(y, N), U && h(y, U);
        })(s, o);
      }
      function Ah(s, o) {
        var h = co(o), y = h.next();
        if (y.done) return !1;
        for (var m = y.value, x = co(s), R = x.next(m.from), N = R.value; !y.done && !R.done; ) {
          if (at(N.from, m.to) <= 0 && 0 <= at(N.to, m.from)) return !0;
          at(m.from, N.from) < 0 ? m = (y = h.next(N.from)).value : N = (R = x.next(m.from)).value;
        }
        return !1;
      }
      function co(s) {
        var o = Eu(s) ? null : { s: 0, n: s };
        return { next: function(h) {
          for (var y = 0 < arguments.length; o; ) switch (o.s) {
            case 0:
              if (o.s = 1, y) for (; o.n.l && at(h, o.n.from) < 0; ) o = { up: o, n: o.n.l, s: 1 };
              else for (; o.n.l; ) o = { up: o, n: o.n.l, s: 1 };
            case 1:
              if (o.s = 2, !y || at(h, o.n.to) <= 0) return { value: o.n, done: !1 };
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
      function kh(s) {
        var o, h, y = (((o = s.r) === null || o === void 0 ? void 0 : o.d) || 0) - (((h = s.l) === null || h === void 0 ? void 0 : h.d) || 0), m = 1 < y ? "r" : y < -1 ? "l" : "";
        m && (o = m == "r" ? "l" : "r", h = r({}, s), y = s[m], s.from = y.from, s.to = y.to, s[m] = y[m], h[m] = y[o], (s[o] = h).d = Oh(h)), s.d = Oh(s);
      }
      function Oh(h) {
        var o = h.r, h = h.l;
        return (o ? h ? Math.max(o.d, h.d) : o.d : h ? h.d : 0) + 1;
      }
      function fo(s, o) {
        return u(o).forEach(function(h) {
          s[h] ? xa(s[h], o[h]) : s[h] = (function y(m) {
            var x, R, N = {};
            for (x in m) w(m, x) && (R = m[x], N[x] = !R || typeof R != "object" || $e.has(R.constructor) ? R : y(R));
            return N;
          })(o[h]);
        }), s;
      }
      function Su(s, o) {
        return s.all || o.all || Object.keys(s).some(function(h) {
          return o[h] && Ah(o[h], s[h]);
        });
      }
      E(Xt.prototype, ((qr = { add: function(s) {
        return xa(this, s), this;
      }, addKey: function(s) {
        return wa(this, s, s), this;
      }, addKeys: function(s) {
        var o = this;
        return s.forEach(function(h) {
          return wa(o, h, h);
        }), this;
      }, hasKey: function(s) {
        var o = co(this).next(s).value;
        return o && at(o.from, s) <= 0 && 0 <= at(o.to, s);
      } })[vt] = function() {
        return co(this);
      }, qr));
      var Si = {}, Au = {}, ku = !1;
      function ho(s) {
        fo(Au, s), ku || (ku = !0, setTimeout(function() {
          ku = !1, Ou(Au, !(Au = {}));
        }, 0));
      }
      function Ou(s, o) {
        o === void 0 && (o = !1);
        var h = /* @__PURE__ */ new Set();
        if (s.all) for (var y = 0, m = Object.values(Si); y < m.length; y++) Rh(R = m[y], s, h, o);
        else for (var x in s) {
          var R, N = /^idb\:\/\/(.*)\/(.*)\//.exec(x);
          N && (x = N[1], N = N[2], (R = Si["idb://".concat(x, "/").concat(N)]) && Rh(R, s, h, o));
        }
        h.forEach(function(U) {
          return U();
        });
      }
      function Rh(s, o, h, y) {
        for (var m = [], x = 0, R = Object.entries(s.queries.query); x < R.length; x++) {
          for (var N = R[x], U = N[0], j = [], H = 0, P = N[1]; H < P.length; H++) {
            var V = P[H];
            Su(o, V.obsSet) ? V.subscribers.forEach(function(W) {
              return h.add(W);
            }) : y && j.push(V);
          }
          y && m.push([U, j]);
        }
        if (y) for (var $ = 0, z = m; $ < z.length; $++) {
          var Y = z[$], U = Y[0], j = Y[1];
          s.queries.query[U] = j;
        }
      }
      function Jy(s) {
        var o = s._state, h = s._deps.indexedDB;
        if (o.isBeingOpened || s.idbdb) return o.dbReadyPromise.then(function() {
          return o.dbOpenError ? Dt(o.dbOpenError) : s;
        });
        o.isBeingOpened = !0, o.dbOpenError = null, o.openComplete = !1;
        var y = o.openCanceller, m = Math.round(10 * s.verno), x = !1;
        function R() {
          if (o.openCanceller !== y) throw new pe.DatabaseClosed("db.open() was cancelled");
        }
        function N() {
          return new f(function(V, $) {
            if (R(), !h) throw new pe.MissingAPI();
            var z = s.name, Y = o.autoSchema || !m ? h.open(z) : h.open(z, m);
            if (!Y) throw new pe.MissingAPI();
            Y.onerror = tn($), Y.onblocked = Te(s._fireOnBlocked), Y.onupgradeneeded = Te(function(W) {
              var J;
              H = Y.transaction, o.autoSchema && !s._options.allowEmptyDB ? (Y.onerror = ma, H.abort(), Y.result.close(), (J = h.deleteDatabase(z)).onsuccess = J.onerror = Te(function() {
                $(new pe.NoSuchDatabase("Database ".concat(z, " doesnt exist")));
              })) : (H.onerror = tn($), W = W.oldVersion > Math.pow(2, 62) ? 0 : W.oldVersion, P = W < 1, s.idbdb = Y.result, x && Yy(s, H), Wy(s, W / 10, H, $));
            }, $), Y.onsuccess = Te(function() {
              H = null;
              var W, J, re, se, ae, fe = s.idbdb = Y.result, Ie = Z(fe.objectStoreNames);
              if (0 < Ie.length) try {
                var ve = fe.transaction((se = Ie).length === 1 ? se[0] : se, "readonly");
                if (o.autoSchema) J = fe, re = ve, (W = s).verno = J.version / 10, re = W._dbSchema = uo(0, J, re), W._storeNames = Z(J.objectStoreNames, 0), ao(W, [W._allTables], u(re), re);
                else if (lo(s, s._dbSchema, ve), ((ae = Iu(uo(0, (ae = s).idbdb, ve), ae._dbSchema)).add.length || ae.change.some(function(ye) {
                  return ye.add.length || ye.change.length;
                })) && !x) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), fe.close(), m = fe.version + 1, x = !0, V(N());
                so(s, ve);
              } catch {
              }
              gs.push(s), fe.onversionchange = Te(function(ye) {
                o.vcFired = !0, s.on("versionchange").fire(ye);
              }), fe.onclose = Te(function(ye) {
                s.on("close").fire(ye);
              }), P && (ae = s._deps, ve = z, fe = ae.indexedDB, ae = ae.IDBKeyRange, wu(fe) || ve === Xa || _u(fe, ae).put({ name: ve }).catch(me)), V();
            }, $);
          }).catch(function(V) {
            switch (V == null ? void 0 : V.name) {
              case "UnknownError":
                if (0 < o.PR1398_maxLoop) return o.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), N();
                break;
              case "VersionError":
                if (0 < m) return m = 0, N();
            }
            return f.reject(V);
          });
        }
        var U, j = o.dbReadyResolve, H = null, P = !1;
        return f.race([y, (typeof navigator > "u" ? f.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(V) {
          function $() {
            return indexedDB.databases().finally(V);
          }
          U = setInterval($, 100), $();
        }).finally(function() {
          return clearInterval(U);
        }) : Promise.resolve()).then(N)]).then(function() {
          return R(), o.onReadyBeingFired = [], f.resolve(xu(function() {
            return s.on.ready.fire(s.vip);
          })).then(function V() {
            if (0 < o.onReadyBeingFired.length) {
              var $ = o.onReadyBeingFired.reduce(Ot, me);
              return o.onReadyBeingFired = [], f.resolve(xu(function() {
                return $(s.vip);
              })).then(V);
            }
          });
        }).finally(function() {
          o.openCanceller === y && (o.onReadyBeingFired = null, o.isBeingOpened = !1);
        }).catch(function(V) {
          o.dbOpenError = V;
          try {
            H && H.abort();
          } catch {
          }
          return y === o.openCanceller && s._close(), Dt(V);
        }).finally(function() {
          o.openComplete = !0, j();
        }).then(function() {
          var V;
          return P && (V = {}, s.tables.forEach(function($) {
            $.schema.indexes.forEach(function(z) {
              z.name && (V["idb://".concat(s.name, "/").concat($.name, "/").concat(z.name)] = new Xt(-1 / 0, [[[]]]));
            }), V["idb://".concat(s.name, "/").concat($.name, "/")] = V["idb://".concat(s.name, "/").concat($.name, "/:dels")] = new Xt(-1 / 0, [[[]]]);
          }), Ln(Ia).fire(V), Ou(V, !0)), s;
        });
      }
      function Ru(s) {
        function o(x) {
          return s.next(x);
        }
        var h = m(o), y = m(function(x) {
          return s.throw(x);
        });
        function m(x) {
          return function(U) {
            var N = x(U), U = N.value;
            return N.done ? U : U && typeof U.then == "function" ? U.then(h, y) : l(U) ? Promise.all(U).then(h, y) : h(U);
          };
        }
        return m(o)();
      }
      function po(s, o, h) {
        for (var y = l(s) ? s.slice() : [s], m = 0; m < h; ++m) y.push(o);
        return y;
      }
      var Zy = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(s) {
        return r(r({}, s), { table: function(o) {
          var h = s.table(o), y = h.schema, m = {}, x = [];
          function R(P, V, $) {
            var z = _a(P), Y = m[z] = m[z] || [], W = P == null ? 0 : typeof P == "string" ? 1 : P.length, J = 0 < V, J = r(r({}, $), { name: J ? "".concat(z, "(virtual-from:").concat($.name, ")") : $.name, lowLevelIndex: $, isVirtual: J, keyTail: V, keyLength: W, extractKey: gu(P), unique: !J && $.unique });
            return Y.push(J), J.isPrimaryKey || x.push(J), 1 < W && R(W === 2 ? P[0] : P.slice(0, W - 1), V + 1, $), Y.sort(function(re, se) {
              return re.keyTail - se.keyTail;
            }), J;
          }
          o = R(y.primaryKey.keyPath, 0, y.primaryKey), m[":id"] = [o];
          for (var N = 0, U = y.indexes; N < U.length; N++) {
            var j = U[N];
            R(j.keyPath, 0, j);
          }
          function H(P) {
            var V, $ = P.query.index;
            return $.isVirtual ? r(r({}, P), { query: { index: $.lowLevelIndex, range: (V = P.query.range, $ = $.keyTail, { type: V.type === 1 ? 2 : V.type, lower: po(V.lower, V.lowerOpen ? s.MAX_KEY : s.MIN_KEY, $), lowerOpen: !0, upper: po(V.upper, V.upperOpen ? s.MIN_KEY : s.MAX_KEY, $), upperOpen: !0 }) } }) : P;
          }
          return r(r({}, h), { schema: r(r({}, y), { primaryKey: o, indexes: x, getIndexByKeyPath: function(P) {
            return (P = m[_a(P)]) && P[0];
          } }), count: function(P) {
            return h.count(H(P));
          }, query: function(P) {
            return h.query(H(P));
          }, openCursor: function(P) {
            var V = P.query.index, $ = V.keyTail, z = V.isVirtual, Y = V.keyLength;
            return z ? h.openCursor(H(P)).then(function(J) {
              return J && W(J);
            }) : h.openCursor(P);
            function W(J) {
              return Object.create(J, { continue: { value: function(re) {
                re != null ? J.continue(po(re, P.reverse ? s.MAX_KEY : s.MIN_KEY, $)) : P.unique ? J.continue(J.key.slice(0, Y).concat(P.reverse ? s.MIN_KEY : s.MAX_KEY, $)) : J.continue();
              } }, continuePrimaryKey: { value: function(re, se) {
                J.continuePrimaryKey(po(re, s.MAX_KEY, $), se);
              } }, primaryKey: { get: function() {
                return J.primaryKey;
              } }, key: { get: function() {
                var re = J.key;
                return Y === 1 ? re[0] : re.slice(0, Y);
              } }, value: { get: function() {
                return J.value;
              } } });
            }
          } });
        } });
      } };
      function Tu(s, o, h, y) {
        return h = h || {}, y = y || "", u(s).forEach(function(m) {
          var x, R, N;
          w(o, m) ? (x = s[m], R = o[m], typeof x == "object" && typeof R == "object" && x && R ? (N = st(x)) !== st(R) ? h[y + m] = o[m] : N === "Object" ? Tu(x, R, h, y + m + ".") : x !== R && (h[y + m] = o[m]) : x !== R && (h[y + m] = o[m])) : h[y + m] = void 0;
        }), u(o).forEach(function(m) {
          w(s, m) || (h[y + m] = o[m]);
        }), h;
      }
      function Cu(s, o) {
        return o.type === "delete" ? o.keys : o.keys || o.values.map(s.extractKey);
      }
      var Qy = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(s) {
        return r(r({}, s), { table: function(o) {
          var h = s.table(o), y = h.schema.primaryKey;
          return r(r({}, h), { mutate: function(m) {
            var x = q.trans, R = x.table(o).hook, N = R.deleting, U = R.creating, j = R.updating;
            switch (m.type) {
              case "add":
                if (U.fire === me) break;
                return x._promise("readwrite", function() {
                  return H(m);
                }, !0);
              case "put":
                if (U.fire === me && j.fire === me) break;
                return x._promise("readwrite", function() {
                  return H(m);
                }, !0);
              case "delete":
                if (N.fire === me) break;
                return x._promise("readwrite", function() {
                  return H(m);
                }, !0);
              case "deleteRange":
                if (N.fire === me) break;
                return x._promise("readwrite", function() {
                  return (function P(V, $, z) {
                    return h.query({ trans: V, values: !1, query: { index: y, range: $ }, limit: z }).then(function(Y) {
                      var W = Y.result;
                      return H({ type: "delete", keys: W, trans: V }).then(function(J) {
                        return 0 < J.numFailures ? Promise.reject(J.failures[0]) : W.length < z ? { failures: [], numFailures: 0, lastResult: void 0 } : P(V, r(r({}, $), { lower: W[W.length - 1], lowerOpen: !0 }), z);
                      });
                    });
                  })(m.trans, m.range, 1e4);
                }, !0);
            }
            return h.mutate(m);
            function H(P) {
              var V, $, z, Y = q.trans, W = P.keys || Cu(y, P);
              if (!W) throw new Error("Keys missing");
              return (P = P.type === "add" || P.type === "put" ? r(r({}, P), { keys: W }) : r({}, P)).type !== "delete" && (P.values = i([], P.values)), P.keys && (P.keys = i([], P.keys)), V = h, z = W, (($ = P).type === "add" ? Promise.resolve([]) : V.getMany({ trans: $.trans, keys: z, cache: "immutable" })).then(function(J) {
                var re = W.map(function(se, ae) {
                  var fe, Ie, ve, ye = J[ae], _e = { onerror: null, onsuccess: null };
                  return P.type === "delete" ? N.fire.call(_e, se, ye, Y) : P.type === "add" || ye === void 0 ? (fe = U.fire.call(_e, se, P.values[ae], Y), se == null && fe != null && (P.keys[ae] = se = fe, y.outbound || oe(P.values[ae], y.keyPath, se))) : (fe = Tu(ye, P.values[ae]), (Ie = j.fire.call(_e, fe, se, ye, Y)) && (ve = P.values[ae], Object.keys(Ie).forEach(function(be) {
                    w(ve, be) ? ve[be] = Ie[be] : oe(ve, be, Ie[be]);
                  }))), _e;
                });
                return h.mutate(P).then(function(se) {
                  for (var ae = se.failures, fe = se.results, Ie = se.numFailures, se = se.lastResult, ve = 0; ve < W.length; ++ve) {
                    var ye = (fe || W)[ve], _e = re[ve];
                    ye == null ? _e.onerror && _e.onerror(ae[ve]) : _e.onsuccess && _e.onsuccess(P.type === "put" && J[ve] ? P.values[ve] : ye);
                  }
                  return { failures: ae, results: fe, numFailures: Ie, lastResult: se };
                }).catch(function(se) {
                  return re.forEach(function(ae) {
                    return ae.onerror && ae.onerror(se);
                  }), Promise.reject(se);
                });
              });
            }
          } });
        } });
      } };
      function Th(s, o, h) {
        try {
          if (!o || o.keys.length < s.length) return null;
          for (var y = [], m = 0, x = 0; m < o.keys.length && x < s.length; ++m) at(o.keys[m], s[x]) === 0 && (y.push(h ? Ae(o.values[m]) : o.values[m]), ++x);
          return y.length === s.length ? y : null;
        } catch {
          return null;
        }
      }
      var Xy = { stack: "dbcore", level: -1, create: function(s) {
        return { table: function(o) {
          var h = s.table(o);
          return r(r({}, h), { getMany: function(y) {
            if (!y.cache) return h.getMany(y);
            var m = Th(y.keys, y.trans._cache, y.cache === "clone");
            return m ? f.resolve(m) : h.getMany(y).then(function(x) {
              return y.trans._cache = { keys: y.keys, values: y.cache === "clone" ? Ae(x) : x }, x;
            });
          }, mutate: function(y) {
            return y.type !== "add" && (y.trans._cache = null), h.mutate(y);
          } });
        } };
      } };
      function Ch(s, o) {
        return s.trans.mode === "readonly" && !!s.subscr && !s.trans.explicit && s.trans.db._options.cache !== "disabled" && !o.schema.primaryKey.outbound;
      }
      function Nh(s, o) {
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
      var eg = { stack: "dbcore", level: 0, name: "Observability", create: function(s) {
        var o = s.schema.name, h = new Xt(s.MIN_KEY, s.MAX_KEY);
        return r(r({}, s), { transaction: function(y, m, x) {
          if (q.subscr && m !== "readonly") throw new pe.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(q.querier));
          return s.transaction(y, m, x);
        }, table: function(y) {
          var m = s.table(y), x = m.schema, R = x.primaryKey, P = x.indexes, N = R.extractKey, U = R.outbound, j = R.autoIncrement && P.filter(function($) {
            return $.compound && $.keyPath.includes(R.keyPath);
          }), H = r(r({}, m), { mutate: function($) {
            function z(be) {
              return be = "idb://".concat(o, "/").concat(y, "/").concat(be), se[be] || (se[be] = new Xt());
            }
            var Y, W, J, re = $.trans, se = $.mutatedParts || ($.mutatedParts = {}), ae = z(""), fe = z(":dels"), Ie = $.type, _e = $.type === "deleteRange" ? [$.range] : $.type === "delete" ? [$.keys] : $.values.length < 50 ? [Cu(R, $).filter(function(be) {
              return be;
            }), $.values] : [], ve = _e[0], ye = _e[1], _e = $.trans._cache;
            return l(ve) ? (ae.addKeys(ve), (_e = Ie === "delete" || ve.length === ye.length ? Th(ve, _e) : null) || fe.addKeys(ve), (_e || ye) && (Y = z, W = _e, J = ye, x.indexes.forEach(function(be) {
              var Se = Y(be.name || "");
              function Ve(Ge) {
                return Ge != null ? be.extractKey(Ge) : null;
              }
              function ct(Ge) {
                return be.multiEntry && l(Ge) ? Ge.forEach(function(Tt) {
                  return Se.addKey(Tt);
                }) : Se.addKey(Ge);
              }
              (W || J).forEach(function(Ge, er) {
                var Ke = W && Ve(W[er]), er = J && Ve(J[er]);
                at(Ke, er) !== 0 && (Ke != null && ct(Ke), er != null && ct(er));
              });
            }))) : ve ? (ye = { from: (ye = ve.lower) !== null && ye !== void 0 ? ye : s.MIN_KEY, to: (ye = ve.upper) !== null && ye !== void 0 ? ye : s.MAX_KEY }, fe.add(ye), ae.add(ye)) : (ae.add(h), fe.add(h), x.indexes.forEach(function(be) {
              return z(be.name).add(h);
            })), m.mutate($).then(function(be) {
              return !ve || $.type !== "add" && $.type !== "put" || (ae.addKeys(be.results), j && j.forEach(function(Se) {
                for (var Ve = $.values.map(function(Ke) {
                  return Se.extractKey(Ke);
                }), ct = Se.keyPath.findIndex(function(Ke) {
                  return Ke === R.keyPath;
                }), Ge = 0, Tt = be.results.length; Ge < Tt; ++Ge) Ve[Ge][ct] = be.results[Ge];
                z(Se.name).addKeys(Ve);
              })), re.mutatedParts = fo(re.mutatedParts || {}, se), be;
            });
          } }), P = function(z) {
            var Y = z.query, z = Y.index, Y = Y.range;
            return [z, new Xt((z = Y.lower) !== null && z !== void 0 ? z : s.MIN_KEY, (Y = Y.upper) !== null && Y !== void 0 ? Y : s.MAX_KEY)];
          }, V = { get: function($) {
            return [R, new Xt($.key)];
          }, getMany: function($) {
            return [R, new Xt().addKeys($.keys)];
          }, count: P, query: P, openCursor: P };
          return u(V).forEach(function($) {
            H[$] = function(z) {
              var Y = q.subscr, W = !!Y, J = Ch(q, m) && Nh($, z) ? z.obsSet = {} : Y;
              if (W) {
                var re = function(ye) {
                  return ye = "idb://".concat(o, "/").concat(y, "/").concat(ye), J[ye] || (J[ye] = new Xt());
                }, se = re(""), ae = re(":dels"), Y = V[$](z), W = Y[0], Y = Y[1];
                if (($ === "query" && W.isPrimaryKey && !z.values ? ae : re(W.name || "")).add(Y), !W.isPrimaryKey) {
                  if ($ !== "count") {
                    var fe = $ === "query" && U && z.values && m.query(r(r({}, z), { values: !1 }));
                    return m[$].apply(this, arguments).then(function(ye) {
                      if ($ === "query") {
                        if (U && z.values) return fe.then(function(Ve) {
                          return Ve = Ve.result, se.addKeys(Ve), ye;
                        });
                        var _e = z.values ? ye.result.map(N) : ye.result;
                        (z.values ? se : ae).addKeys(_e);
                      } else if ($ === "openCursor") {
                        var be = ye, Se = z.values;
                        return be && Object.create(be, { key: { get: function() {
                          return ae.addKey(be.primaryKey), be.key;
                        } }, primaryKey: { get: function() {
                          var Ve = be.primaryKey;
                          return ae.addKey(Ve), Ve;
                        } }, value: { get: function() {
                          return Se && se.addKey(be.primaryKey), be.value;
                        } } });
                      }
                      return ye;
                    });
                  }
                  ae.add(h);
                }
              }
              return m[$].apply(this, arguments);
            };
          }), H;
        } });
      } };
      function Ph(s, o, h) {
        if (h.numFailures === 0) return o;
        if (o.type === "deleteRange") return null;
        var y = o.keys ? o.keys.length : "values" in o && o.values ? o.values.length : 1;
        return h.numFailures === y ? null : (o = r({}, o), l(o.keys) && (o.keys = o.keys.filter(function(m, x) {
          return !(x in h.failures);
        })), "values" in o && l(o.values) && (o.values = o.values.filter(function(m, x) {
          return !(x in h.failures);
        })), o);
      }
      function Nu(s, o) {
        return h = s, ((y = o).lower === void 0 || (y.lowerOpen ? 0 < at(h, y.lower) : 0 <= at(h, y.lower))) && (s = s, (o = o).upper === void 0 || (o.upperOpen ? at(s, o.upper) < 0 : at(s, o.upper) <= 0));
        var h, y;
      }
      function Dh(s, o, V, y, m, x) {
        if (!V || V.length === 0) return s;
        var R = o.query.index, N = R.multiEntry, U = o.query.range, j = y.schema.primaryKey.extractKey, H = R.extractKey, P = (R.lowLevelIndex || R).extractKey, V = V.reduce(function($, z) {
          var Y = $, W = [];
          if (z.type === "add" || z.type === "put") for (var J = new Xt(), re = z.values.length - 1; 0 <= re; --re) {
            var se, ae = z.values[re], fe = j(ae);
            J.hasKey(fe) || (se = H(ae), (N && l(se) ? se.some(function(be) {
              return Nu(be, U);
            }) : Nu(se, U)) && (J.addKey(fe), W.push(ae)));
          }
          switch (z.type) {
            case "add":
              var Ie = new Xt().addKeys(o.values ? $.map(function(Se) {
                return j(Se);
              }) : $), Y = $.concat(o.values ? W.filter(function(Se) {
                return Se = j(Se), !Ie.hasKey(Se) && (Ie.addKey(Se), !0);
              }) : W.map(function(Se) {
                return j(Se);
              }).filter(function(Se) {
                return !Ie.hasKey(Se) && (Ie.addKey(Se), !0);
              }));
              break;
            case "put":
              var ve = new Xt().addKeys(z.values.map(function(Se) {
                return j(Se);
              }));
              Y = $.filter(function(Se) {
                return !ve.hasKey(o.values ? j(Se) : Se);
              }).concat(o.values ? W : W.map(function(Se) {
                return j(Se);
              }));
              break;
            case "delete":
              var ye = new Xt().addKeys(z.keys);
              Y = $.filter(function(Se) {
                return !ye.hasKey(o.values ? j(Se) : Se);
              });
              break;
            case "deleteRange":
              var _e = z.range;
              Y = $.filter(function(Se) {
                return !Nu(j(Se), _e);
              });
          }
          return Y;
        }, s);
        return V === s ? s : (V.sort(function($, z) {
          return at(P($), P(z)) || at(j($), j(z));
        }), o.limit && o.limit < 1 / 0 && (V.length > o.limit ? V.length = o.limit : s.length === o.limit && V.length < o.limit && (m.dirty = !0)), x ? Object.freeze(V) : V);
      }
      function Bh(s, o) {
        return at(s.lower, o.lower) === 0 && at(s.upper, o.upper) === 0 && !!s.lowerOpen == !!o.lowerOpen && !!s.upperOpen == !!o.upperOpen;
      }
      function tg(s, o) {
        return (function(h, y, m, x) {
          if (h === void 0) return y !== void 0 ? -1 : 0;
          if (y === void 0) return 1;
          if ((y = at(h, y)) === 0) {
            if (m && x) return 0;
            if (m) return 1;
            if (x) return -1;
          }
          return y;
        })(s.lower, o.lower, s.lowerOpen, o.lowerOpen) <= 0 && 0 <= (function(h, y, m, x) {
          if (h === void 0) return y !== void 0 ? 1 : 0;
          if (y === void 0) return -1;
          if ((y = at(h, y)) === 0) {
            if (m && x) return 0;
            if (m) return -1;
            if (x) return 1;
          }
          return y;
        })(s.upper, o.upper, s.upperOpen, o.upperOpen);
      }
      function rg(s, o, h, y) {
        s.subscribers.add(h), y.addEventListener("abort", function() {
          var m, x;
          s.subscribers.delete(h), s.subscribers.size === 0 && (m = s, x = o, setTimeout(function() {
            m.subscribers.size === 0 && We(x, m);
          }, 3e3));
        });
      }
      var ng = { stack: "dbcore", level: 0, name: "Cache", create: function(s) {
        var o = s.schema.name;
        return r(r({}, s), { transaction: function(h, y, m) {
          var x, R, N = s.transaction(h, y, m);
          return y === "readwrite" && (R = (x = new AbortController()).signal, m = function(U) {
            return function() {
              if (x.abort(), y === "readwrite") {
                for (var j = /* @__PURE__ */ new Set(), H = 0, P = h; H < P.length; H++) {
                  var V = P[H], $ = Si["idb://".concat(o, "/").concat(V)];
                  if ($) {
                    var z = s.table(V), Y = $.optimisticOps.filter(function(Se) {
                      return Se.trans === N;
                    });
                    if (N._explicit && U && N.mutatedParts) for (var W = 0, J = Object.values($.queries.query); W < J.length; W++) for (var re = 0, se = (Ie = J[W]).slice(); re < se.length; re++) Su((ve = se[re]).obsSet, N.mutatedParts) && (We(Ie, ve), ve.subscribers.forEach(function(Se) {
                      return j.add(Se);
                    }));
                    else if (0 < Y.length) {
                      $.optimisticOps = $.optimisticOps.filter(function(Se) {
                        return Se.trans !== N;
                      });
                      for (var ae = 0, fe = Object.values($.queries.query); ae < fe.length; ae++) for (var Ie, ve, ye, _e = 0, be = (Ie = fe[ae]).slice(); _e < be.length; _e++) (ve = be[_e]).res != null && N.mutatedParts && (U && !ve.dirty ? (ye = Object.isFrozen(ve.res), ye = Dh(ve.res, ve.req, Y, z, ve, ye), ve.dirty ? (We(Ie, ve), ve.subscribers.forEach(function(Se) {
                        return j.add(Se);
                      })) : ye !== ve.res && (ve.res = ye, ve.promise = f.resolve({ result: ye }))) : (ve.dirty && We(Ie, ve), ve.subscribers.forEach(function(Se) {
                        return j.add(Se);
                      })));
                    }
                  }
                }
                j.forEach(function(Se) {
                  return Se();
                });
              }
            };
          }, N.addEventListener("abort", m(!1), { signal: R }), N.addEventListener("error", m(!1), { signal: R }), N.addEventListener("complete", m(!0), { signal: R })), N;
        }, table: function(h) {
          var y = s.table(h), m = y.schema.primaryKey;
          return r(r({}, y), { mutate: function(x) {
            var R = q.trans;
            if (m.outbound || R.db._options.cache === "disabled" || R.explicit || R.idbtrans.mode !== "readwrite") return y.mutate(x);
            var N = Si["idb://".concat(o, "/").concat(h)];
            return N ? (R = y.mutate(x), x.type !== "add" && x.type !== "put" || !(50 <= x.values.length || Cu(m, x).some(function(U) {
              return U == null;
            })) ? (N.optimisticOps.push(x), x.mutatedParts && ho(x.mutatedParts), R.then(function(U) {
              0 < U.numFailures && (We(N.optimisticOps, x), (U = Ph(0, x, U)) && N.optimisticOps.push(U), x.mutatedParts && ho(x.mutatedParts));
            }), R.catch(function() {
              We(N.optimisticOps, x), x.mutatedParts && ho(x.mutatedParts);
            })) : R.then(function(U) {
              var j = Ph(0, r(r({}, x), { values: x.values.map(function(H, P) {
                var V;
                return U.failures[P] ? H : (H = (V = m.keyPath) !== null && V !== void 0 && V.includes(".") ? Ae(H) : r({}, H), oe(H, m.keyPath, U.results[P]), H);
              }) }), U);
              N.optimisticOps.push(j), queueMicrotask(function() {
                return x.mutatedParts && ho(x.mutatedParts);
              });
            }), R) : y.mutate(x);
          }, query: function(x) {
            if (!Ch(q, y) || !Nh("query", x)) return y.query(x);
            var R = ((j = q.trans) === null || j === void 0 ? void 0 : j.db._options.cache) === "immutable", P = q, N = P.requery, U = P.signal, j = (function(z, Y, W, J) {
              var re = Si["idb://".concat(z, "/").concat(Y)];
              if (!re) return [];
              if (!(Y = re.queries[W])) return [null, !1, re, null];
              var se = Y[(J.query ? J.query.index.name : null) || ""];
              if (!se) return [null, !1, re, null];
              switch (W) {
                case "query":
                  var ae = se.find(function(fe) {
                    return fe.req.limit === J.limit && fe.req.values === J.values && Bh(fe.req.query.range, J.query.range);
                  });
                  return ae ? [ae, !0, re, se] : [se.find(function(fe) {
                    return ("limit" in fe.req ? fe.req.limit : 1 / 0) >= J.limit && (!J.values || fe.req.values) && tg(fe.req.query.range, J.query.range);
                  }), !1, re, se];
                case "count":
                  return ae = se.find(function(fe) {
                    return Bh(fe.req.query.range, J.query.range);
                  }), [ae, !!ae, re, se];
              }
            })(o, h, "query", x), H = j[0], P = j[1], V = j[2], $ = j[3];
            return H && P ? H.obsSet = x.obsSet : (P = y.query(x).then(function(z) {
              var Y = z.result;
              if (H && (H.res = Y), R) {
                for (var W = 0, J = Y.length; W < J; ++W) Object.freeze(Y[W]);
                Object.freeze(Y);
              } else z.result = Ae(Y);
              return z;
            }).catch(function(z) {
              return $ && H && We($, H), Promise.reject(z);
            }), H = { obsSet: x.obsSet, promise: P, subscribers: /* @__PURE__ */ new Set(), type: "query", req: x, dirty: !1 }, $ ? $.push(H) : ($ = [H], (V = V || (Si["idb://".concat(o, "/").concat(h)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[x.query.index.name || ""] = $)), rg(H, $, N, U), H.promise.then(function(z) {
              return { result: Dh(z.result, x, V == null ? void 0 : V.optimisticOps, y, H, R) };
            });
          } });
        } });
      } };
      function vo(s, o) {
        return new Proxy(s, { get: function(h, y, m) {
          return y === "db" ? o : Reflect.get(h, y, m);
        } });
      }
      var bn = (Bt.prototype.version = function(s) {
        if (isNaN(s) || s < 0.1) throw new pe.Type("Given version is not a positive number");
        if (s = Math.round(10 * s) / 10, this.idbdb || this._state.isBeingOpened) throw new pe.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, s);
        var o = this._versions, h = o.filter(function(y) {
          return y._cfg.version === s;
        })[0];
        return h || (h = new this.Version(s), o.push(h), o.sort(Hy), h.stores({}), this._state.autoSchema = !1, h);
      }, Bt.prototype._whenReady = function(s) {
        var o = this;
        return this.idbdb && (this._state.openComplete || q.letThrough || this._vip) ? s() : new f(function(h, y) {
          if (o._state.openComplete) return y(new pe.DatabaseClosed(o._state.dbOpenError));
          if (!o._state.isBeingOpened) {
            if (!o._state.autoOpen) return void y(new pe.DatabaseClosed());
            o.open().catch(me);
          }
          o._state.dbReadyPromise.then(h, y);
        }).then(s);
      }, Bt.prototype.use = function(s) {
        var o = s.stack, h = s.create, y = s.level, m = s.name;
        return m && this.unuse({ stack: o, name: m }), s = this._middlewares[o] || (this._middlewares[o] = []), s.push({ stack: o, create: h, level: y ?? 10, name: m }), s.sort(function(x, R) {
          return x.level - R.level;
        }), this;
      }, Bt.prototype.unuse = function(s) {
        var o = s.stack, h = s.name, y = s.create;
        return o && this._middlewares[o] && (this._middlewares[o] = this._middlewares[o].filter(function(m) {
          return y ? m.create !== y : !!h && m.name !== h;
        })), this;
      }, Bt.prototype.open = function() {
        var s = this;
        return wi(D, function() {
          return Jy(s);
        });
      }, Bt.prototype._close = function() {
        this.on.close.fire(new CustomEvent("close"));
        var s = this._state, o = gs.indexOf(this);
        if (0 <= o && gs.splice(o, 1), this.idbdb) {
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
      }, Bt.prototype.close = function(h) {
        var o = (h === void 0 ? { disableAutoOpen: !0 } : h).disableAutoOpen, h = this._state;
        o ? (h.isBeingOpened && h.cancelOpen(new pe.DatabaseClosed()), this._close(), h.autoOpen = !1, h.dbOpenError = new pe.DatabaseClosed()) : (this._close(), h.autoOpen = this._options.autoOpen || h.isBeingOpened, h.openComplete = !1, h.dbOpenError = null);
      }, Bt.prototype.delete = function(s) {
        var o = this;
        s === void 0 && (s = { disableAutoOpen: !0 });
        var h = 0 < arguments.length && typeof arguments[0] != "object", y = this._state;
        return new f(function(m, x) {
          function R() {
            o.close(s);
            var N = o._deps.indexedDB.deleteDatabase(o.name);
            N.onsuccess = Te(function() {
              var U, j, H;
              U = o._deps, j = o.name, H = U.indexedDB, U = U.IDBKeyRange, wu(H) || j === Xa || _u(H, U).delete(j).catch(me), m();
            }), N.onerror = tn(x), N.onblocked = o._fireOnBlocked;
          }
          if (h) throw new pe.InvalidArgument("Invalid closeOptions argument to db.delete()");
          y.isBeingOpened ? y.dbReadyPromise.then(R) : R();
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
        return u(this._allTables).map(function(o) {
          return s._allTables[o];
        });
      }, enumerable: !1, configurable: !0 }), Bt.prototype.transaction = function() {
        var s = (function(o, h, y) {
          var m = arguments.length;
          if (m < 2) throw new pe.InvalidArgument("Too few arguments");
          for (var x = new Array(m - 1); --m; ) x[m - 1] = arguments[m];
          return y = x.pop(), [o, Ce(x), y];
        }).apply(this, arguments);
        return this._transaction.apply(this, s);
      }, Bt.prototype._transaction = function(s, o, h) {
        var y = this, m = q.trans;
        m && m.db === this && s.indexOf("!") === -1 || (m = null);
        var x, R, N = s.indexOf("?") !== -1;
        s = s.replace("!", "").replace("?", "");
        try {
          if (R = o.map(function(j) {
            if (j = j instanceof y.Table ? j.name : j, typeof j != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return j;
          }), s == "r" || s === cu) x = cu;
          else {
            if (s != "rw" && s != fu) throw new pe.InvalidArgument("Invalid transaction mode: " + s);
            x = fu;
          }
          if (m) {
            if (m.mode === cu && x === fu) {
              if (!N) throw new pe.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              m = null;
            }
            m && R.forEach(function(j) {
              if (m && m.storeNames.indexOf(j) === -1) {
                if (!N) throw new pe.SubTransaction("Table " + j + " not included in parent transaction.");
                m = null;
              }
            }), N && m && !m.active && (m = null);
          }
        } catch (j) {
          return m ? m._promise(null, function(H, P) {
            P(j);
          }) : Dt(j);
        }
        var U = (function j(H, P, V, $, z) {
          return f.resolve().then(function() {
            var Y = q.transless || q, W = H._createTransaction(P, V, H._dbSchema, $);
            if (W.explicit = !0, Y = { trans: W, transless: Y }, $) W.idbtrans = $.idbtrans;
            else try {
              W.create(), W.idbtrans._explicit = !0, H._state.PR1398_maxLoop = 3;
            } catch (se) {
              return se.name === ut.InvalidState && H.isOpen() && 0 < --H._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), H.close({ disableAutoOpen: !1 }), H.open().then(function() {
                return j(H, P, V, null, z);
              })) : Dt(se);
            }
            var J, re = Je(z);
            return re && St(), Y = f.follow(function() {
              var se;
              (J = z.call(W, W)) && (re ? (se = jt.bind(null, null), J.then(se, se)) : typeof J.next == "function" && typeof J.throw == "function" && (J = Ru(J)));
            }, Y), (J && typeof J.then == "function" ? f.resolve(J).then(function(se) {
              return W.active ? se : Dt(new pe.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : Y.then(function() {
              return J;
            })).then(function(se) {
              return $ && W._resolve(), W._completion.then(function() {
                return se;
              });
            }).catch(function(se) {
              return W._reject(se), Dt(se);
            });
          });
        }).bind(null, this, x, R, m, h);
        return m ? m._promise(x, U, "lock") : q.trans ? wi(q.transless, function() {
          return y._whenReady(U);
        }) : this._whenReady(U);
      }, Bt.prototype.table = function(s) {
        if (!w(this._allTables, s)) throw new pe.InvalidTable("Table ".concat(s, " does not exist"));
        return this._allTables[s];
      }, Bt);
      function Bt(s, o) {
        var h = this;
        this._middlewares = {}, this.verno = 0;
        var y = Bt.dependencies;
        this._options = o = r({ addons: Bt.addons, autoOpen: !0, indexedDB: y.indexedDB, IDBKeyRange: y.IDBKeyRange, cache: "cloned" }, o), this._deps = { indexedDB: o.indexedDB, IDBKeyRange: o.IDBKeyRange }, y = o.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
        var m, x, R, N, U, j = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: me, dbReadyPromise: null, cancelOpen: me, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: o.autoOpen };
        j.dbReadyPromise = new f(function(P) {
          j.dbReadyResolve = P;
        }), j.openCanceller = new f(function(P, V) {
          j.cancelOpen = V;
        }), this._state = j, this.name = s, this.on = va(this, "populate", "blocked", "versionchange", "close", { ready: [Ot, me] }), this.once = function(P, V) {
          var $ = function() {
            for (var z = [], Y = 0; Y < arguments.length; Y++) z[Y] = arguments[Y];
            h.on(P).unsubscribe($), V.apply(h, z);
          };
          return h.on(P, $);
        }, this.on.ready.subscribe = X(this.on.ready.subscribe, function(P) {
          return function(V, $) {
            Bt.vip(function() {
              var z, Y = h._state;
              Y.openComplete ? (Y.dbOpenError || f.resolve().then(V), $ && P(V)) : Y.onReadyBeingFired ? (Y.onReadyBeingFired.push(V), $ && P(V)) : (P(V), z = h, $ || P(function W() {
                z.on.ready.unsubscribe(V), z.on.ready.unsubscribe(W);
              }));
            });
          };
        }), this.Collection = (m = this, ya(My.prototype, function(J, W) {
          this.db = m;
          var $ = fh, z = null;
          if (W) try {
            $ = W();
          } catch (re) {
            z = re;
          }
          var Y = J._ctx, W = Y.table, J = W.hook.reading.fire;
          this._ctx = { table: W, index: Y.index, isPrimKey: !Y.index || W.schema.primKey.keyPath && Y.index === W.schema.primKey.name, range: $, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: z, or: Y.or, valueMapper: J !== je ? J : null };
        })), this.Table = (x = this, ya(vh.prototype, function(P, V, $) {
          this.db = x, this._tx = $, this.name = P, this.schema = V, this.hook = x._allTables[P] ? x._allTables[P].hook : va(null, { creating: [lt, me], reading: [gt, je], updating: [Le, me], deleting: [it, me] });
        })), this.Transaction = (R = this, ya(jy.prototype, function(P, V, $, z, Y) {
          var W = this;
          P !== "readonly" && V.forEach(function(J) {
            J = (J = $[J]) === null || J === void 0 ? void 0 : J.yProps, J && (V = V.concat(J.map(function(re) {
              return re.updatesTable;
            })));
          }), this.db = R, this.mode = P, this.storeNames = V, this.schema = $, this.chromeTransactionDurability = z, this.idbtrans = null, this.on = va(this, "complete", "error", "abort"), this.parent = Y || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new f(function(J, re) {
            W._resolve = J, W._reject = re;
          }), this._completion.then(function() {
            W.active = !1, W.on.complete.fire();
          }, function(J) {
            var re = W.active;
            return W.active = !1, W.on.error.fire(J), W.parent ? W.parent._reject(J) : re && W.idbtrans && W.idbtrans.abort(), Dt(J);
          });
        })), this.Version = (N = this, ya(Vy.prototype, function(P) {
          this.db = N, this._cfg = { version: P, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (U = this, ya(_h.prototype, function(P, V, $) {
          if (this.db = U, this._ctx = { table: P, index: V === ":id" ? null : V, or: $ }, this._cmp = this._ascending = at, this._descending = function(z, Y) {
            return at(Y, z);
          }, this._max = function(z, Y) {
            return 0 < at(z, Y) ? z : Y;
          }, this._min = function(z, Y) {
            return at(z, Y) < 0 ? z : Y;
          }, this._IDBKeyRange = U._deps.IDBKeyRange, !this._IDBKeyRange) throw new pe.MissingAPI();
        })), this.on("versionchange", function(P) {
          0 < P.newVersion ? console.warn("Another connection wants to upgrade database '".concat(h.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(h.name, "'. Closing db now to resume the delete request.")), h.close({ disableAutoOpen: !1 });
        }), this.on("blocked", function(P) {
          !P.newVersion || P.newVersion < P.oldVersion ? console.warn("Dexie.delete('".concat(h.name, "') was blocked")) : console.warn("Upgrade '".concat(h.name, "' blocked by other connection holding version ").concat(P.oldVersion / 10));
        }), this._maxKey = ba(o.IDBKeyRange), this._createTransaction = function(P, V, $, z) {
          return new h.Transaction(P, V, $, h._options.chromeTransactionDurability, z);
        }, this._fireOnBlocked = function(P) {
          h.on("blocked").fire(P), gs.filter(function(V) {
            return V.name === h.name && V !== h && !V._state.vcFired;
          }).map(function(V) {
            return V.on("versionchange").fire(P);
          });
        }, this.use(Xy), this.use(ng), this.use(eg), this.use(Zy), this.use(Qy);
        var H = new Proxy(this, { get: function(P, V, $) {
          if (V === "_vip") return !0;
          if (V === "table") return function(Y) {
            return vo(h.table(Y), H);
          };
          var z = Reflect.get(P, V, $);
          return z instanceof vh ? vo(z, H) : V === "tables" ? z.map(function(Y) {
            return vo(Y, H);
          }) : V === "_createTransaction" ? function() {
            return vo(z.apply(this, arguments), H);
          } : z;
        } });
        this.vip = H, y.forEach(function(P) {
          return P(h);
        });
      }
      var yo, qr = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", ig = (Pu.prototype.subscribe = function(s, o, h) {
        return this._subscribe(s && typeof s != "function" ? s : { next: s, error: o, complete: h });
      }, Pu.prototype[qr] = function() {
        return this;
      }, Pu);
      function Pu(s) {
        this._subscribe = s;
      }
      try {
        yo = { indexedDB: a.indexedDB || a.mozIndexedDB || a.webkitIndexedDB || a.msIndexedDB, IDBKeyRange: a.IDBKeyRange || a.webkitIDBKeyRange };
      } catch {
        yo = { indexedDB: null, IDBKeyRange: null };
      }
      function Fh(s) {
        var o, h = !1, y = new ig(function(m) {
          var x = Je(s), R, N = !1, U = {}, j = {}, H = { get closed() {
            return N;
          }, unsubscribe: function() {
            N || (N = !0, R && R.abort(), P && Ln.storagemutated.unsubscribe($));
          } };
          m.start && m.start(H);
          var P = !1, V = function() {
            return lu(z);
          }, $ = function(Y) {
            fo(U, Y), Su(j, U) && V();
          }, z = function() {
            var Y, W, J;
            !N && yo.indexedDB && (U = {}, Y = {}, R && R.abort(), R = new AbortController(), J = (function(re) {
              var se = xe();
              try {
                x && St();
                var ae = Pt(s, re);
                return ae = x ? ae.finally(jt) : ae;
              } finally {
                se && Ze();
              }
            })(W = { subscr: Y, signal: R.signal, requery: V, querier: s, trans: null }), Promise.resolve(J).then(function(re) {
              h = !0, o = re, N || W.signal.aborted || (U = {}, (function(se) {
                for (var ae in se) if (w(se, ae)) return;
                return 1;
              })(j = Y) || P || (Ln(Ia, $), P = !0), lu(function() {
                return !N && m.next && m.next(re);
              }));
            }, function(re) {
              h = !1, ["DatabaseClosedError", "AbortError"].includes(re == null ? void 0 : re.name) || N || lu(function() {
                N || m.error && m.error(re);
              });
            }));
          };
          return setTimeout(V, 0), H;
        });
        return y.hasValue = function() {
          return h;
        }, y.getValue = function() {
          return o;
        }, y;
      }
      var Ai = bn;
      function Du(s) {
        var o = qn;
        try {
          qn = !0, Ln.storagemutated.fire(s), Ou(s, !0);
        } finally {
          qn = o;
        }
      }
      E(Ai, r(r({}, tt), { delete: function(s) {
        return new Ai(s, { addons: [] }).delete();
      }, exists: function(s) {
        return new Ai(s, { addons: [] }).open().then(function(o) {
          return o.close(), !0;
        }).catch("NoSuchDatabaseError", function() {
          return !1;
        });
      }, getDatabaseNames: function(s) {
        try {
          return o = Ai.dependencies, h = o.indexedDB, o = o.IDBKeyRange, (wu(h) ? Promise.resolve(h.databases()).then(function(y) {
            return y.map(function(m) {
              return m.name;
            }).filter(function(m) {
              return m !== Xa;
            });
          }) : _u(h, o).toCollection().primaryKeys()).then(s);
        } catch {
          return Dt(new pe.MissingAPI());
        }
        var o, h;
      }, defineClass: function() {
        return function(s) {
          c(this, s);
        };
      }, ignoreTransaction: function(s) {
        return q.trans ? wi(q.transless, s) : s();
      }, vip: xu, async: function(s) {
        return function() {
          try {
            var o = Ru(s.apply(this, arguments));
            return o && typeof o.then == "function" ? o : f.resolve(o);
          } catch (h) {
            return Dt(h);
          }
        };
      }, spawn: function(s, o, h) {
        try {
          var y = Ru(s.apply(h, o || []));
          return y && typeof y.then == "function" ? y : f.resolve(y);
        } catch (m) {
          return Dt(m);
        }
      }, currentTransaction: { get: function() {
        return q.trans || null;
      } }, waitFor: function(s, o) {
        return o = f.resolve(typeof s == "function" ? Ai.ignoreTransaction(s) : s).timeout(o || 6e4), q.trans ? q.trans.waitFor(o) : o;
      }, Promise: f, debug: { get: function() {
        return qe;
      }, set: function(s) {
        Xe(s);
      } }, derive: K, extend: c, props: E, override: X, Events: va, on: Ln, liveQuery: Fh, extendObservabilitySet: fo, getByKeyPath: he, setByKeyPath: oe, delByKeyPath: function(s, o) {
        typeof o == "string" ? oe(s, o, void 0) : "length" in o && [].map.call(o, function(h) {
          oe(s, h, void 0);
        });
      }, shallowClone: ke, deepClone: Ae, getObjectDiff: Tu, cmp: at, asap: ce, minKey: -1 / 0, addons: [], connections: gs, errnames: ut, dependencies: yo, cache: Si, semVer: "4.2.0", version: "4.2.0".split(".").map(function(s) {
        return parseInt(s);
      }).reduce(function(s, o, h) {
        return s + o / Math.pow(10, 2 * h);
      }) })), Ai.maxKey = ba(Ai.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Ln(Ia, function(s) {
        qn || (s = new CustomEvent(du, { detail: s }), qn = !0, dispatchEvent(s), qn = !1);
      }), addEventListener(du, function(s) {
        s = s.detail, qn || Du(s);
      }));
      var _s, qn = !1, Lh = function() {
      };
      return typeof BroadcastChannel < "u" && ((Lh = function() {
        (_s = new BroadcastChannel(du)).onmessage = function(s) {
          return s.data && Du(s.data);
        };
      })(), typeof _s.unref == "function" && _s.unref(), Ln(Ia, function(s) {
        qn || _s.postMessage(s);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(s) {
        if (!bn.disableBfCache && s.persisted) {
          qe && console.debug("Dexie: handling persisted pagehide"), _s != null && _s.close();
          for (var o = 0, h = gs; o < h.length; o++) h[o].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(s) {
        !bn.disableBfCache && s.persisted && (qe && console.debug("Dexie: handling persisted pageshow"), Lh(), Du({ all: new Xt(-1 / 0, [[]]) }));
      })), f.rejectionMapper = function(s, o) {
        return !s || s instanceof Qe || s instanceof TypeError || s instanceof SyntaxError || !s.name || !Fe[s.name] ? s : (o = new Fe[s.name](o || s.message, s), "stack" in s && B(o, "stack", { get: function() {
          return this.inner.stack;
        } }), o);
      }, Xe(qe), r(bn, Object.freeze({ __proto__: null, Dexie: bn, liveQuery: Fh, Entity: hh, cmp: at, PropModification: ga, replacePrefix: function(s, o) {
        return new ga({ replacePrefix: [s, o] });
      }, add: function(s) {
        return new ga({ add: s });
      }, remove: function(s) {
        return new ga({ remove: s });
      }, default: bn, RangeSet: Xt, mergeRanges: xa, rangesOverlap: Ah }), { default: bn }), bn;
    });
  })(Ao)), Ao.exports;
}
var _I = bI();
const of = /* @__PURE__ */ bf(_I), Iv = Symbol.for("Dexie"), qt = globalThis[Iv] || (globalThis[Iv] = of);
if (of.semVer !== qt.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${of.semVer} and ${qt.semVer}`);
const {
  liveQuery: Hb,
  mergeRanges: Wb,
  rangesOverlap: Yb,
  RangeSet: Vb,
  cmp: Jb,
  Entity: Zb,
  PropModification: Qb,
  replacePrefix: Xb,
  add: e_,
  remove: t_,
  DexieYProvider: r_
} = qt;
var Hr, jr, Ds, Bs, sn, Di, Fs;
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
    ee(this, Ds);
    // array item -> serial number
    ee(this, Bs, new Array());
    // serial number -> array item
    ee(this, sn, /* @__PURE__ */ new Map());
    // string-encoded object -> value
    ee(this, Di);
    // object item -> serial number
    ee(this, Fs, new Array());
  }
  get size() {
    return p(this, Hr).size + p(this, jr).size + p(this, sn).size;
  }
  /** Returns the value (T) associated with `key`, else `undefined`. */
  get(e) {
    if (typeof e != "object" || e === null)
      return p(this, Hr).get(e);
    if (Array.isArray(e)) {
      const t = this.encodeExistingKey(e, p(this, Ds));
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
    return typeof e != "object" || e === null ? Cc(p(this, Hr), e, t) : Array.isArray(e) ? Cc(p(this, jr), this.encodeArrayKey(e), t) : Cc(p(this, sn), this.encodeObjectKey(e), t);
  }
  /** Returns the value (T) associated with the `key`.
   *  If there isn't one yet, it calls the `makeValue` function to create one and adds it.
   *  > Note:  With complex keys this is more efficient than calling `get` and then `insert`. */
  upsert(e, t) {
    return typeof e != "object" || e === null ? Nc(p(this, Hr), e, t) : Array.isArray(e) ? Nc(p(this, jr), this.encodeArrayKey(e), t) : Nc(p(this, sn), this.encodeObjectKey(e), t);
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
    let t = p(this, Ds);
    return t || (t = G(this, Ds, new Wo())), e.map((r) => t.upsert(r, () => (p(this, Bs).push(r), p(this, Bs).length - 1))).toString();
  }
  /** Converts an encoded array key back into the same array. */
  decodeArrayKey(e) {
    return e !== "" ? e.split(",").map((t) => p(this, Bs)[Number(t)]) : [];
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
    return t || (t = G(this, Di, new Wo())), this.objectToArray(e).map((i) => t.upsert(i, () => (p(this, Fs).push(i), p(this, Fs).length - 1))).toString();
  }
  /** Converts an encoded object key back into the same object. */
  decodeObjectKey(e) {
    if (e === "")
      return {};
    const t = e.split(",").map((a) => p(this, Fs)[Number(a)]), r = t.pop();
    Me(t.length === r.length);
    let i = {};
    for (let a = 0; a < r.length; ++a)
      i[r[a]] = t[a];
    return i;
  }
  // serial number -> object item
};
Hr = new WeakMap(), jr = new WeakMap(), Ds = new WeakMap(), Bs = new WeakMap(), sn = new WeakMap(), Di = new WeakMap(), Fs = new WeakMap();
let jo = Wo;
function Cc(n, e, t) {
  return n.has(e) ? !1 : (n.set(e, t), !0);
}
function Nc(n, e, t) {
  let r = n.get(e);
  return r === void 0 && (r = t(), n.set(e, r)), r;
}
class bi {
  constructor() {
    de(this, "receiver");
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
class Iy {
  constructor() {
    de(this, "receiver");
  }
  then(e) {
    return this.receiver = e;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async run(e) {
    return this.receiver.start(), this.receiver.next(new da(e)) ? (this.receiver.end(), !0) : !1;
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
var Wr, an, La, Bi, Ls;
class by extends Iy {
  constructor(t) {
    var r, i;
    super();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    de(this, "collection");
    de(this, "alias");
    ee(this, Wr);
    // The index being searched, if any
    ee(this, an);
    // Index constraint(s)
    ee(this, La);
    // Indexed properties to sort by
    ee(this, Bi);
    // True if deleted revs must be detected
    ee(this, Ls, !1);
    if (this.config = t, this.collection = t.collection, this.alias = t.alias, G(this, Wr, t.index), G(this, Bi, !0), (r = t.indexedWhereOrSort) != null && r.length) {
      Cn(t.index, "config.index");
      const a = t.indexedWhereOrSort.map((u) => u instanceof us ? u : u.key);
      t.indexedWhereOrSort[0] instanceof us ? G(this, La, t.indexedWhereOrSort) : G(this, an, t.indexedWhereOrSort), a.some((u) => u.keypath !== Pa && u.keypath !== Ta) && G(this, Bi, !1);
    }
    ((i = this.config.filters) == null ? void 0 : i.length) === 0 && (this.config.filters = void 0);
  }
  async run(t) {
    G(this, Ls, !1);
    const r = t instanceof Uo ? t : t.ctx, i = t instanceof Uo ? void 0 : t, a = this.receiver instanceof uf ? this.receiver : void 0;
    let u;
    i ? u = i.use(() => this.makeQuery()) : u = this.makeQuery(), this.receiver.start();
    let l = !0;
    if (u !== void 0) {
      const c = i ?? new da(r);
      let b = await u.toArray();
      if (p(this, Ls))
        throw new Ko();
      for (let I of b)
        if (I.encrypted && await this.collection.decryptRevision(I), c.dataSources.set(this.config.alias, I), (!this.config.filters || this.config.filters.every((w) => c.eval(w))) && (l = a ? await a.asyncNext(c) : this.receiver.next(c), !l))
          break;
      i == null || i.dataSources.delete(this.config.alias);
    }
    return l && (a ? await a.asyncEnd(r) : this.receiver.end()), !0;
  }
  /** Stops an active `run` call ASAP, causing its promise to reject. */
  interrupt() {
    G(this, Ls, !0), this.receiver instanceof uf && this.receiver.interrupt();
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
          Ar(
            c instanceof Za,
            "compound index can't handle arrays"
          ), a.push(c.minValue ?? qt.minKey), u.push(c.maxValue ?? qt.maxKey);
        for (; a.length < p(this, Wr).on.length; )
          a.push(qt.minKey), u.push(qt.maxKey);
        const l = p(this, an).at(-1);
        r = i.between(a, u, l.includeMin, l.includeMax);
      }
    } else
      r = t.orderBy(p(this, Wr).name);
    return this.config.reverse && (r = r.reverse()), p(this, Bi) && (r = r.filter((i) => ((i.flags ?? 0) & sr) === 0)), r;
  }
  explain(t) {
    if (p(this, an)) {
      t.push(`Search index "${p(this, Wr).name}" of collection ${this.collection.name} where (`);
      for (let r of p(this, an))
        t.push(`    ${r}`);
      t[t.length - 1] += " )";
    } else p(this, La) ? t.push(`Scan index "${p(this, Wr).name}" of collection ${this.collection.name}`) : t.push(`Scan collection ${this.collection.name}`);
    if (t[t.length - 1] += this.config.reverse ? " in reverse order:" : ":", p(this, Bi) && t.push("    - If doc is not deleted,"), this.config.filters)
      for (const r of this.config.filters)
        t.push(`    - If ${Ft(r)},`);
    super.explain(t);
  }
  // I've been interrupted
}
Wr = new WeakMap(), an = new WeakMap(), La = new WeakMap(), Bi = new WeakMap(), Ls = new WeakMap();
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
    Na("Joiner.next should not be called");
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
    Na("Joiner.end should not be called");
  }
  async asyncEnd(t) {
    if (p(this, Gn) && !p(this, Fi)) {
      const r = await this.producer.collection.dexieTable.where(Pa).noneOf(Array.of(...p(this, Gn).values())).filter((i) => !((i.flags ?? 0) & sr)).toArray();
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
          const l = new da(t);
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
class wI extends bi {
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
var Li;
class xI extends bi {
  constructor(t, r, i) {
    super();
    ee(this, Li);
    this.groupBy = t, this.having = r, this.ctx = i;
  }
  start() {
    G(this, Li, new jo()), super.start();
  }
  next(t) {
    Ar(this.groupBy.length === 1, "unsupported multiple GROUP BY conditions");
    const r = t.eval(this.groupBy[0]);
    return p(this, Li).upsert(r, () => {
      let a = new Fa(this.ctx, !0);
      return a.receiver = this.receiver, a.start(), a;
    }).next(t);
  }
  end() {
    for (const t of p(this, Li).values())
      t.end(this.having);
    G(this, Li, void 0), super.end();
  }
  explain(t) {
    const r = this.groupBy.map(Ft).join(",  ");
    t.push(`Group rows by ${r}, and for each group:`), new Fa(this.ctx, !0).explain(t), this.having && t.push(`Keep groups having ${Ft(this.having)}`), super.explain(t);
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
    const r = p(this, Wn) ?? new da(this.ctx);
    r.aggregates = p(this, Hn), G(this, Wn, void 0), G(this, Hn, void 0), (!t || r.eval(t)) && this.receiver.next(r), this.isGrouped || super.end();
  }
  explain(t) {
    for (const r of this.ctx.copyAggregates())
      t.push(`    - Accumulate state for ${Ft(r.sourceExpression)}`);
    t.push("After aggregating,"), super.explain(t);
  }
};
Hn = new WeakMap(), Wn = new WeakMap();
let Fa = sh;
class _y extends bi {
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
var qs;
class EI extends _y {
  constructor(t, r, i) {
    t = Array.of(...t);
    for (const a of i)
      t.push(a.expr);
    super(t, r);
    ee(this, qs);
    this.sortExprs = i;
  }
  start() {
    G(this, qs, []), super.start();
  }
  next(t) {
    return p(this, qs).push(this.makeRow(t)), !0;
  }
  end() {
    const t = this.sortExprs, r = t.length;
    let i = p(this, qs);
    i.sort((a, u) => {
      for (let l = -r; l < 0; ++l) {
        let c = Vt(a.at(l), u.at(l));
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
      let a = Ft(i.expr);
      return i.descending && (a += " descending"), a;
    });
    t.push(`With docs sorted by ${r.join(", ")},`), super.explain(t);
  }
}
qs = new WeakMap();
var Ms;
class SI extends bi {
  constructor() {
    super(...arguments);
    ee(this, Ms);
  }
  start() {
    G(this, Ms, new jo()), super.start();
  }
  next(t) {
    return p(this, Ms).insert(t, null) ? this.receiver.next(t) : !0;
  }
  end() {
    G(this, Ms, void 0), super.end();
  }
  explain(t) {
    t.push("Remove identical rows"), super.explain(t);
  }
}
Ms = new WeakMap();
var Us, qi;
class AI extends bi {
  constructor(t, r) {
    super();
    ee(this, Us, 0);
    ee(this, qi, 0);
    this.offsetExpr = t, this.limitExpr = r;
  }
  get offset() {
    return this.offsetExpr ? Mh(this.offsetExpr(), "query OFFSET") : 0;
  }
  get limit() {
    return this.limitExpr ? Mh(this.limitExpr(), "query LIMIT") : 1 / 0;
  }
  start() {
    G(this, Us, this.offset), G(this, qi, this.limit), super.start();
  }
  next(t) {
    return p(this, Us) > 0 ? (--dr(this, Us)._, !0) : p(this, qi) > 0 ? (--dr(this, qi)._, this.receiver.next(t) && p(this, qi) > 0) : !1;
  }
  explain(t) {
    this.offsetExpr && t.push(`Skip first ${Ft(this.offsetExpr)} rows`), this.limitExpr && t.push(`Limit to ${Ft(this.limitExpr)} rows`), super.explain(t);
  }
}
Us = new WeakMap(), qi = new WeakMap();
class kI extends bi {
  constructor(e) {
    super(), this.aliases = e;
  }
  next(e) {
    let t = {}, r = 0;
    for (const i of this.aliases) {
      const a = e[r++];
      a !== void 0 && (i.endsWith(".*") && Or(a) ? t = { ...t, ...a } : t[i] = a);
    }
    return this.receiver.next(t);
  }
}
class wy {
  constructor(e) {
    de(this, "ok", !0);
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
const OI = 250, RI = 0, TI = 500;
var Yn, $s, qa, _n, Vn, Jn, Zn, vr;
class CI {
  constructor(e) {
    ee(this, Yn, /* @__PURE__ */ new Set());
    // Query listeners
    ee(this, $s, []);
    // My collection listeners
    ee(this, qa, 0);
    // Time DB last changed
    ee(this, _n);
    // Timer after coll changes
    ee(this, Vn);
    // Last known query result
    ee(this, Jn, !1);
    // True while executing query
    ee(this, Zn, !1);
    // If true, need to execute again
    ee(this, vr);
    this.query = e, G(this, vr, e.logger);
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
    p(this, vr).info`Query observer starting`;
    for (const e of this.query.collections()) {
      const t = e.addChangeListener((r) => this.collectionChanged(e));
      p(this, $s).push(t);
    }
    this.executeQuery();
  }
  stopListening() {
    p(this, vr).info`Query observer stopping`, p(this, $s).forEach((e) => e.remove()), G(this, $s, []), p(this, _n) !== void 0 && (clearTimeout(p(this, _n)), G(this, _n, void 0)), p(this, Jn) && this.query.interrupt(), G(this, Vn, void 0), G(this, Zn, !1);
  }
  collectionChanged(e) {
    p(this, vr).info`Query observer notified collection ${e.name} changed`, this.trigger();
  }
  /** Schedules re-running the query to see if it changed. */
  trigger() {
    if (this.hasListeners && !p(this, _n)) {
      const e = Date.now(), t = e - p(this, qa) < OI ? TI : RI;
      G(this, qa, e), G(this, _n, setTimeout(() => {
        G(this, _n, void 0), this.hasListeners && this.executeQuery();
      }, t));
    }
  }
  executeQuery() {
    if (p(this, Jn)) {
      G(this, Zn, !0), p(this, vr).debug`Query observer will re-execute query when done`;
      return;
    }
    G(this, Jn, !0), G(this, Zn, !1), p(this, vr).info`Query observer executing query...`, this.query.execute().then((e) => {
      G(this, Jn, !1), this.hasListeners && (p(this, Vn) === void 0 ? (p(this, vr).debug`...Query observer got initial result`, G(this, Vn, e)) : oa(e, p(this, Vn)) ? p(this, vr).debug`...Query observer saw no change in results` : (G(this, Vn, e), this.callListeners(e)), p(this, Zn) && this.executeQuery());
    }).catch((e) => {
      G(this, Jn, !1), e instanceof Ko ? p(this, vr).debug`...Query observer: query interrupted` : p(this, vr).error`Query observer: query failed with error ${e}`, p(this, Zn) && this.hasListeners && this.executeQuery();
    });
  }
  callListeners(e) {
    p(this, vr).info`Query observer notifying ${p(this, Yn).size} listeners!`;
    for (const t of p(this, Yn))
      try {
        t(e);
      } catch (r) {
        p(this, vr).error(`Exception in QueryChangeCallback: ${r}`);
      }
  }
}
Yn = new WeakMap(), $s = new WeakMap(), qa = new WeakMap(), _n = new WeakMap(), Vn = new WeakMap(), Jn = new WeakMap(), Zn = new WeakMap(), vr = new WeakMap();
const bv = [
  "trace",
  "debug",
  "info",
  "warning",
  "error",
  "fatal"
];
function _v(n, e) {
  const t = bv.indexOf(n);
  if (t < 0) throw new TypeError(`Invalid log level: ${JSON.stringify(n)}.`);
  const r = bv.indexOf(e);
  if (r < 0) throw new TypeError(`Invalid log level: ${JSON.stringify(e)}.`);
  return t - r;
}
function xy(n = []) {
  return Ey.getLogger(n);
}
const Pc = Symbol.for("logtape.rootLogger");
var Ey = class Un {
  constructor(e, t) {
    de(this, "parent");
    de(this, "children");
    de(this, "category");
    de(this, "sinks");
    de(this, "parentSinks", "inherit");
    de(this, "filters");
    de(this, "lowestLevel", "trace");
    de(this, "contextLocalStorage");
    this.parent = e, this.children = {}, this.category = t, this.sinks = [], this.filters = [];
  }
  static getLogger(e = []) {
    let t = Pc in globalThis ? globalThis[Pc] ?? null : null;
    return t == null && (t = new Un(null, []), globalThis[Pc] = t), typeof e == "string" ? t.getChild(e) : e.length === 0 ? t : t.getChild(e);
  }
  getChild(e) {
    const t = typeof e == "string" ? e : e[0], r = this.children[t];
    let i = r instanceof Un ? r : r == null ? void 0 : r.deref();
    return i == null && (i = new Un(this, [...this.category, t]), this.children[t] = "WeakRef" in globalThis ? new WeakRef(i) : i), typeof e == "string" || e.length === 1 ? i : i.getChild(e.slice(1));
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
      const t = e instanceof Un ? e : e.deref();
      t != null && t.resetDescendants();
    }
    this.reset();
  }
  with(e) {
    return new NI(this, { ...e });
  }
  filter(e) {
    var t;
    for (const r of this.filters) if (!r(e)) return !1;
    return this.filters.length < 1 ? ((t = this.parent) == null ? void 0 : t.filter(e)) ?? !0 : !0;
  }
  *getSinks(e) {
    if (!(this.lowestLevel === null || _v(e, this.lowestLevel) < 0)) {
      if (this.parent != null && this.parentSinks === "inherit") for (const t of this.parent.getSinks(e)) yield t;
      for (const t of this.sinks) yield t;
    }
  }
  emit(e, t) {
    const r = "category" in e ? e : {
      ...e,
      category: this.category
    };
    if (!(this.lowestLevel === null || _v(r.level, this.lowestLevel) < 0 || !this.filter(r))) {
      for (const i of this.getSinks(r.level))
        if (!(t != null && t.has(i)))
          try {
            i(r);
          } catch (a) {
            const u = new Set(t);
            u.add(i), PI.log("fatal", "Failed to emit a log record to sink {sink}: {error}", {
              sink: i,
              error: a,
              record: r
            }, u);
          }
    }
  }
  log(e, t, r, i) {
    var c;
    const a = ((c = Un.getLogger().contextLocalStorage) == null ? void 0 : c.getStore()) ?? {};
    let u;
    const l = typeof r == "function" ? {
      category: this.category,
      level: e,
      timestamp: Date.now(),
      get message() {
        return wv(t, this.properties);
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
      message: wv(t, {
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
    const i = ((c = Un.getLogger().contextLocalStorage) == null ? void 0 : c.getStore()) ?? {};
    let a, u;
    function l() {
      if ((u == null || a == null) && (u = t((b, ...I) => (a = b, xv(b, I))), a == null))
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
    const a = ((u = Un.getLogger().contextLocalStorage) == null ? void 0 : u.getStore()) ?? {};
    this.emit({
      category: this.category,
      level: e,
      message: xv(t, r),
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
}, NI = class Sy {
  constructor(e, t) {
    de(this, "logger");
    de(this, "properties");
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
    return new Sy(this.logger, {
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
  emit(e) {
    const t = {
      ...e,
      properties: {
        ...this.properties,
        ...e.properties
      }
    };
    this.logger.emit(t);
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
const PI = Ey.getLogger(["logtape", "meta"]);
function wv(n, e) {
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
      const b = n.indexOf("}", u + 1);
      if (b === -1) continue;
      const I = n.slice(i, u);
      r.push(I.replace(/{{/g, "{").replace(/}}/g, "}"));
      const w = n.slice(u + 1, b);
      let E;
      const k = w.trim();
      k === "*" ? E = w in e ? e[w] : "*" in e ? e["*"] : e : w !== k ? E = w in e ? e[w] : e[k] : E = e[w], r.push(E), u = b, i = u + 1;
    } else l === "}" && u + 1 < t && n[u + 1] === "}" && u++;
  }
  const a = n.slice(i);
  return r.push(a.replace(/{{/g, "{").replace(/}}/g, "}")), r;
}
function xv(n, e) {
  const t = [];
  for (let r = 0; r < n.length; r++)
    t.push(n[r]), r < e.length && t.push(e[r]);
  return t;
}
const Ay = "CouchbaseLite", Xf = xy([Ay]), lf = Xf.getChild("DB"), DI = Xf.getChild("Query");
var At, yr, Mi, Ui, $i, Ma, ji, js, Qn;
class BI {
  /** @internal */
  constructor(e, t) {
    /** The JSON form of the parsed query. @internal */
    de(this, "selectExpr");
    /** The names of the result columns, i.e. the keys in a row object. */
    de(this, "columnNames");
    /** @internal */
    de(this, "logger");
    ee(this, At, new Uo());
    // State for CompiledExprs to read
    ee(this, yr, /* @__PURE__ */ new Map());
    // Maps alias -> source/result info
    ee(this, Mi);
    // Head of pipeline
    ee(this, Ui);
    // Tail of pipeline
    ee(this, $i, {});
    ee(this, Ma);
    ee(this, ji, !1);
    // Prevents reentrant `run` calls
    ee(this, js, !1);
    ee(this, Qn);
    this.database = e, this.logger = DI.with({ db: e.name });
    let r;
    typeof t == "string" ? (r = oI(t), this.selectExpr = r) : (this.selectExpr = t, r = t, c1(r));
    let i;
    for (let C of r.FROM) {
      let M, Z;
      if ("COLLECTION" in C) {
        let ce = C.COLLECTION;
        C.SCOPE && (ce = C.SCOPE + "." + ce), Z = this.database.getCollection(ce), "JOIN" in C ? (Me(i !== void 0, "first FROM source can't be a JOIN"), M = "join") : (Ar(i === void 0, "subsequent FROM sources must be JOINs"), M = "collection");
      } else
        M = "unnest";
      let X;
      if (C.AS !== void 0)
        X = C.AS;
      else if ("COLLECTION" in C)
        X = C.COLLECTION;
      else
        throw new Lr("UNNEST clause must have an AS");
      if (p(this, yr).has(X))
        throw new Lr(`Duplicate sources named "${X}"`);
      const ue = { collection: Z, source: C, type: M, alias: X };
      i || (i = ue), p(this, yr).set(X, ue), p(this, At).sourceTypes.set(X, M);
    }
    let a = [], u = [];
    for (let C of r.WHAT) {
      let M;
      if (Array.isArray(C) && C[0] === "AS") {
        if (M = C[2], C = C[1], p(this, yr).has(M))
          throw new Lr(`Duplicate column alias "${M}"`);
        p(this, yr).set(M, {
          type: "result",
          alias: M,
          what: C
        });
      }
      a.push(M), u.push(C);
    }
    f1(
      r,
      p(this, yr),
      r.FROM.length === 1 ? i == null ? void 0 : i.alias : void 0
    );
    const l = u.map((C) => p(this, At).compileWithAggregates(C));
    let c = [], b = 0;
    for (let C = 0; C < r.WHAT.length; ++C) {
      let M = a[C];
      if (M === void 0)
        for (M = this.defaultResultName(r.WHAT[C]); M === void 0 || c.includes(M); )
          M = `$${++b}`;
      else
        p(this, At).results.set(M, l[C]);
      c.push(M);
    }
    this.columnNames = c, this.findResultSources();
    const I = new Set(r.WHERE ? zd(r.WHERE) : []);
    let w;
    r.ORDER_BY !== void 0 && (w = r.ORDER_BY.map((C) => LI(p(this, At), C)));
    let E = /* @__PURE__ */ new Set(), k, B;
    e: for (const [C, M] of p(this, yr)) {
      switch (M.type) {
        case "collection": {
          k = this.makeRevProducer(
            M,
            I,
            w,
            E
          ), B = k;
          break;
        }
        case "join": {
          for (const ue of zd(M.source.ON))
            I.add(ue);
          const Z = M.source.JOIN, X = this.makeRevProducer(M, I, w, E);
          B = B.then(new uf(X, Z));
          break;
        }
        case "unnest": {
          const Z = p(this, At).compile(M.source.UNNEST);
          B = B.then(new wI(Z, C));
          break;
        }
        case "result":
          continue e;
      }
      E.add(M);
    }
    if (k ? Cn(B) : (k = new Iy(), B = k), G(this, Mi, k), r.GROUP_BY !== void 0) {
      const C = r.GROUP_BY.map((Z) => p(this, At).compile(Z)), M = r.HAVING !== void 0 ? p(this, At).compileWithAggregates(r.HAVING) : void 0;
      B = B.then(new xI(C, M, p(this, At)));
    } else
      p(this, At).hasAggregators && (B = B.then(new Fa(p(this, At))));
    let K;
    if (w != null && w.length ? K = B.then(new EI(l, c, w)) : K = B.then(new _y(l, c)), r.DISTINCT && (K = K.then(new SI())), r.OFFSET !== void 0 || r.LIMIT !== void 0) {
      const C = (M, Z) => {
        if (M !== void 0)
          return Ar(wc(M).size === 0, `invalid ${Z} expression`), p(this, At).compile(M);
      };
      K = K.then(new AI(
        C(r.OFFSET, "OFFSET"),
        C(r.LIMIT, "LIMIT")
      ));
    }
    G(this, Ui, K.then(new kI(c)).then(new wy())), G(this, Ma, new Proxy(p(this, $i), {
      set: (C, M, Z) => (this.checkParameterName(M), C[M] = Z, p(this, Qn) && !oa(Z, p(this, $i)[M]) && p(this, Qn).trigger(), !0)
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
    return p(this, Ma);
  }
  set parameters(e) {
    const t = p(this, At).parameterNames.size, r = Object.entries(e);
    Ar(r.length >= t, `All ${t} parameters must be set`);
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
    p(this, ji) && (G(this, js, !0), p(this, Mi).interrupt());
  }
  /** Registers a function that will be called when the query's results change, as a result of
   *  changes to documents or to a parameter value.
   *  @param callback  The function to call. Its parameter is the new query result array.
   *  @returns  A ListenerToken whose {@link ListenerToken.remove} method you can call to
   *            remove the listener. */
  addChangeListener(e) {
    return p(this, Qn) || G(this, Qn, new CI(this)), p(this, Qn).addChangeListener(e);
  }
  /** Registers a custom N1QL function.
   *
   *  Registration is global: it will be available in all queries on all Databases.
   *  @param name  Function's name. Case-insensitive.
   *  @param implementation  The function itself. See the type {@link UserFunction} for details.
   *  @param options  Other options such as min/max arg counts. */
  registerUserFunction(e, t, r) {
    fI(e, t, r);
  }
  /** All Collections used by this query. @internal */
  collections() {
    let e = /* @__PURE__ */ new Set();
    for (const t of p(this, yr).values())
      t.type !== "result" && t.collection && e.add(t.collection);
    return e;
  }
  //---- INTERNALS:
  checkParameterName(e) {
    Ar(typeof e == "string", "Query parameter name must be a string"), Ar(!e.startsWith("$"), "Don't use '$' prefix in query parameter names"), Ar(p(this, At).parameterNames.has(e), `"${e}" is not a parameter of this query`);
  }
  async run(e) {
    Ar(!p(this, ji), "query is already running"), p(this, At).parameters.clear();
    for (const t of p(this, At).parameterNames) {
      const r = p(this, $i)[t];
      if (r === void 0)
        throw Error(`The query parameter "${t}" must have a value`);
      p(this, At).parameters.set(t, r);
    }
    G(this, ji, !0), G(this, js, !1);
    try {
      return p(this, Ui).callback = (t) => (e(t), !p(this, js)), await p(this, Mi).run(p(this, At)), p(this, Ui).callback = void 0, p(this, Ui).ok;
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
    for (const I of t) {
      const w = this.asWhereClause(I, e, i);
      w && a.push(w);
    }
    a.sort((I, w) => I.generality - w.generality);
    let u;
    if (r != null && r.length) {
      const [I, w] = this.expToKeyPath(r[0].expr.sourceExpression);
      w != null && w.indexed && I === e && (u = w);
    }
    let l = !1, c = { collection: e.collection, alias: e.alias }, b;
    for (const I of e.collection.getIndexes()) {
      let w = [];
      if (I.type === $n)
        for (const E of I.on) {
          const k = a.find((B) => B.key === E && B instanceof Za);
          if (k === void 0 || (w.push(k), k.generality > 1))
            break;
        }
      else {
        Me(I.on.length === 1);
        const E = I.on[0], k = a.find((B) => B.key === E && B instanceof Tc);
        k && w.push(k);
      }
      w.length > 0 && (b === void 0 || w.length > b.length || w.at(-1).generality < b.at(-1).generality) && (b = w, c.index = I);
    }
    if (b) {
      c.indexedWhereOrSort = b;
      for (const I of b)
        t.delete(I.sourceExpression);
      b[0].key === u && (l = !0);
    } else u && (c.index = e.collection.indexOfProperty(u), c.indexedWhereOrSort = [u], l = !0);
    l && (c.reverse = r[0].descending ?? !1, r == null || r.splice(0, 1)), i.add(e);
    for (const I of Array.of(...t))
      this.exprUsesAllowedSources(I, i) && (c.filters || (c.filters = []), c.filters.push(p(this, At).compile(I)), t.delete(I));
    return i.delete(e), new by(c);
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
    const b = p(this, At), I = b.compile(u);
    switch (i) {
      case "<":
      case "<=":
        return new Rc(e, c, void 0, I, !0, i === "<=");
      case ">":
      case ">=":
        return new Rc(e, c, I, void 0, i === ">=", !0);
      case "=":
      case "IS":
        return new gv(e, c, I);
      case "LIKE": {
        const w = FI(b, I);
        if (typeof w == "string") {
          const [E, k] = qf(w);
          switch (E) {
            case 0:
              return new gv(e, c, b.compile(k));
            case 1:
              return new mI(e, c, k);
          }
        }
        break;
      }
      case "BETWEEN": {
        if (this.exprUsesAllowedSources(e[3], r))
          return new Rc(e, c, I, b.compile(e[3]));
        break;
      }
      case "IN":
        return new Tc(e, c, I);
    }
  }
  // Subroutine of asWhereClause() that handles 'ANY' expressions.
  anyAsWhereClause(e, t, r) {
    const [i, a, u, l] = e;
    let [c, b] = this.expToKeyPath(u);
    if (!(c !== t || b === void 0) && Ac(l, "=")) {
      let I;
      if (Ac(l[1], "?", a) ? I = l[2] : Ac(l[2], "?", a) && (I = l[1]), I && this.exprUsesAllowedSources(I, r))
        return new Tc(e, b, p(this, At).compile(I));
    }
  }
  // True if `expr` uses only the data sources given in `allowedSources`.
  exprUsesAllowedSources(e, t) {
    for (const r of wc(e)) {
      const i = p(this, yr).get(r);
      if (Cn(i), i.type === "result") {
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
      const t = p(this, yr).get(ug(e[1]));
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
      if (p(this, yr).has(r)) {
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
    for (const [e, t] of p(this, yr))
      t.type === "result" && this.getResultSources(t);
  }
  getResultSources(e) {
    if (e.sources === void 0) {
      Ar(!e._findingSources, `Result "${e.alias} has a circular dependency`), e._findingSources = !0;
      let t = /* @__PURE__ */ new Set();
      for (const r of wc(e.what)) {
        const i = p(this, yr).get(r);
        if (Cn(i), i.type !== "result")
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
At = new WeakMap(), yr = new WeakMap(), Mi = new WeakMap(), Ui = new WeakMap(), $i = new WeakMap(), Ma = new WeakMap(), ji = new WeakMap(), js = new WeakMap(), Qn = new WeakMap();
function FI(n, e) {
  try {
    return typeof e == "function" ? e() : n.compile(e)();
  } catch (t) {
    if (t instanceof Jf || t instanceof hy)
      return;
    throw t;
  }
}
function LI(n, e) {
  let t;
  return Array.isArray(e) && (e[0] === "DESC" ? (t = !0, e = e[1]) : e[0] === "ASC" && (e = e[1])), { expr: n.compile(e), descending: t };
}
function ky(n) {
  return typeof n == "object" && !Array.isArray(n) && n !== null;
}
const Ev = "PBKDF2", qI = 5e6, MI = "Couchbase Lite for JavaScript", Dc = "AES-GCM", UI = 256, xs = Symbol();
class uu extends Error {
}
var Jv, Ki;
Jv = xs;
const Yo = class Yo {
  constructor() {
    de(this, Jv);
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
    return this[xs] !== void 0;
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
      return this[xs] = void 0, !1;
    }
    return !0;
  }
  /** Discards the encryption key. `unlock` must be called to use the codec again. */
  lock() {
    this[xs] = void 0;
  }
  /** Encrypts binary data.
   *  @throws EncryptionError  if locked. */
  async encrypt(e) {
    const t = this.requiredKey("encrypt"), r = crypto.getRandomValues(new Uint8Array(12)), i = await crypto.subtle.encrypt({ name: Dc, iv: r }, t, e);
    return { data: new Uint8Array(i), iv: r };
  }
  /** Decrypts binary data.
   *  @throws EncryptionError  if locked. */
  async decrypt(e) {
    const t = this.requiredKey("decrypt"), r = { name: Dc, iv: e.iv };
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
    Me(ky(t)), e.body = { ...e.body, ...t }, e.encrypted = void 0;
  }
  async generateKey(e) {
    const t = new TextEncoder(), r = await crypto.subtle.importKey(
      "raw",
      t.encode(e),
      Ev,
      !1,
      ["deriveBits", "deriveKey"]
    );
    this[xs] = await crypto.subtle.deriveKey(
      {
        name: Ev,
        hash: "SHA-256",
        iterations: qI,
        salt: t.encode(MI)
      },
      r,
      { name: Dc, length: UI },
      !1,
      // key is not extractable
      ["encrypt", "decrypt"]
      // key is not wrappable
    );
  }
  requiredKey(e) {
    const t = this[xs];
    if (!t)
      throw new uu(`Cannot ${e} without key`);
    return t;
  }
};
Ki = new WeakMap();
let zo = Yo;
var Yr, on;
class $I {
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
const jI = "r", Kn = "rw";
let Mn;
var Ks, Vo, Xn, gr, ei, Br, zs, Ht;
const ah = class ah {
  constructor(e) {
    /** The database's name. */
    de(this, "name");
    /* {@link https://logtape.org LogTape} logger instance for this Database. */
    de(this, "logger");
    ee(this, Ks, /* @__PURE__ */ new Set());
    //-------- TRANSACTIONS:
    ee(this, Vo, 0);
    ee(this, Xn, 0);
    /** Used as a callback in Blob objects. @internal */
    de(this, "blobLoader", async (e, t) => await this.blobStore.getBlob(e));
    /** @internal  Exposed for testing */
    de(this, "enableAutoExpiry", !0);
    ee(this, gr);
    ee(this, ei, /* @__PURE__ */ new Map());
    ee(this, Br, {});
    ee(this, zs);
    ee(this, Ht);
    this.config = e, this.name = e.name, this.logger = lf.with({ db: this.name });
    const t = e.collections, r = {
      [Ra]: "",
      [Yc]: "",
      [jl]: "digest"
    };
    for (const [i, a] of Object.entries(t))
      Os.validateName(i), r[i] = Os.dexieIndexSpec(a);
    Object.keys(t).length === 0 && (r[Bc] = Os.dexieIndexSpec({})), G(this, ei, new Map(Object.entries(t))), p(this, ei).size === 0 && p(this, ei).set(Bc, {}), G(this, gr, new qt(e.name, Mn)), this.installDBCore(), p(this, gr).version(e.version).stores(r), this.logger.info("Created Database {db}");
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
    Mn = { indexedDB: e, IDBKeyRange: t };
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
    return e.password = void 0, await new ah(e).initialize(t);
  }
  /** @internal */
  static get idbFactory() {
    return (Mn == null ? void 0 : Mn.indexedDB) ?? indexedDB;
  }
  /** @internal */
  static get idbKeyRange() {
    return (Mn == null ? void 0 : Mn.IDBKeyRange) ?? IDBKeyRange;
  }
  async initialize(e) {
    try {
      const t = await this.getMeta();
      if (t.challenge && (G(this, Ht, zo.withChallenge(t.challenge)), e === void 0 || !await p(this, Ht).unlock(e)))
        throw new uu("Incorrect or missing database password");
      const r = this;
      let i = {};
      for (const [a, u] of p(this, ei)) {
        const l = new Os(r, a, u, p(this, gr), p(this, Ht));
        await l.open(), i[a] = l;
      }
      return Object.freeze(i), G(this, Br, i), this;
    } catch (t) {
      throw this.close(), t;
    }
  }
  /** True if the database is open. */
  get isOpen() {
    return p(this, gr).isOpen();
  }
  /** Reopens the database after a {@link close} or {@link closeAndDelete} call.
   *  @param password  If the database is encrypted, you must provide the password. */
  async reopen(e) {
    this.logger.info("Reopening database {db}"), await p(this, gr).open(), await this.initialize(e);
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
    G(this, Br, {}), G(this, Ht, void 0), p(this, gr).close();
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
    p(this, gr) && (this.logger.info("Closing and deleting database {db}"), await p(this, gr).delete());
  }
  /** Static method that deletes a database by name.
   *  You MUST close any open Database instance using it first. */
  static async delete(e) {
    lf.info("Deleting database {db}", { db: e }), await qt.delete(e);
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
    return this.getCollection(Bc);
  }
  //-------- CHANGE LISTENER:
  /** Collections call this to enable/disable receiving Dexie db events. @internal */
  observeChangesFor(e, t = !0) {
    t ? p(this, Ks).add(e) : (p(this, Ks).delete(e), p(this, Ks).size === 0 && this.logger.info`Stopping Dexie change listener`);
  }
  installDBCore() {
    p(this, gr).use({
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
    return new BI(this, e);
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
    e === Kn && i.push(Ra, jl);
    const u = ++dr(this, Vo)._;
    let l = !1;
    try {
      return await p(this, gr).transaction(e, i, async () => {
        ++dr(this, Xn)._, p(this, Xn) === 1 && this.logger.debug("Begin transaction #{id}", { id: u });
        try {
          const c = await r();
          return l = !0, c;
        } catch (c) {
          throw this.logger.debug("Aborting transaction #{id} due to exception", { id: u }), c;
        } finally {
          if (Me(p(this, Xn) >= 0), --dr(this, Xn)._ === 0)
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
    return qt.currentTransaction !== void 0 ? qt.waitFor(e) : e;
  }
  //-------- ENCRYPTION:
  // (Mis)using the collection metadata table to store DB metadata, under the key ""
  get metaTable() {
    return p(this, gr).table(Ra);
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
    return Me(!((e = qt.currentTransaction) != null && e.active), "Don't call this in a transaction"), p(this, Ht) ? p(this, Ht).isUnlocked ? "unlocked" : "locked" : "none";
  }
  /** Unlocks an encrypted database using the given password. @internal
   *  @returns  True on success, false if the password is wrong (or there is no encryption.) */
  async unlock(e) {
    var t;
    return Me(!((t = qt.currentTransaction) != null && t.active), "Don't call this in a transaction"), p(this, Ht) ? await p(this, Ht).unlock(e) : !1;
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
    var u;
    Me(!((u = qt.currentTransaction) != null && u.active), "Don't call this in a transaction"), Me(this.encryptionStatus !== "locked", "Database must be unlocked to change encryption");
    const r = e !== void 0 ? await zo.create(e) : void 0, i = /* @__PURE__ */ new Map();
    for (const [l, c] of Object.entries(p(this, Br)))
      i.set(l, c.unencryptedProperties);
    const a = r ? p(this, Ht) ? "Rekey" : "Encrypt" : "Decrypt";
    this.logger.info`${a}ing database...`;
    try {
      await this.inTransaction(Kn, this.collectionNames, async () => {
        const l = await this.getMeta();
        l.challenge = r == null ? void 0 : r.challenge, await this.setMeta(l), await this.blobStore.rekey(r);
        for (const [c, b] of Object.entries(p(this, Br)))
          await b.rekey(r, t == null ? void 0 : t[c]);
      }), G(this, Ht, r), this.logger.info`...${a}ed database!`;
    } catch (l) {
      this.logger.error`${a}ing database failed! ${l}`, this.blobStore.resetEncryption(p(this, Ht));
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
      const a = i;
      return a instanceof qt.ConstraintError ? a : Promise.reject(a);
    });
  }
  /** @internal */
  get blobStore() {
    return p(this, zs) || G(this, zs, new $I(this, p(this, gr).table(jl), p(this, Ht))), p(this, zs);
  }
  /** Returns the number of blobs stored in the database. */
  async countBlobs() {
    return this.blobStore.countBlobs();
  }
  /** Deletes all blobs that are no longer referenced by any documents.
   *  @returns  The number of blobs deleted. */
  async performMaintenance(e) {
    return og(e, "compact"), this.logger.info("Garbage-collecting blobs"), await this.inTransaction(Kn, this.collectionNames, async () => {
      const t = /* @__PURE__ */ new Set();
      for (const r of Object.values(p(this, Br)))
        await r.collectBlobDigests(t);
      return await this.blobStore.deleteBlobsExcept(t);
    });
  }
};
Ks = new WeakMap(), Vo = new WeakMap(), Xn = new WeakMap(), gr = new WeakMap(), ei = new WeakMap(), Br = new WeakMap(), zs = new WeakMap(), Ht = new WeakMap();
let di = ah;
class cs {
  constructor(e, t) {
    this.local = e, this.remote = t;
  }
  static fromObject(e) {
    let t = e.local;
    typeof t != "number" && (t = void 0);
    let r = e.remote;
    return r === null && (r = void 0), new cs(t, r);
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
    return new cs(this.local, this.remote);
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
    de(this, "collection");
    /** The ID (primary key) of the document. */
    de(this, "id");
    /** The document itself. */
    de(this, "body");
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
let Rs = oh;
function KI() {
  const n = new Uint8Array(15);
  return "-" + Yg(crypto.getRandomValues(n)).replaceAll("/", "_");
}
function Go(n) {
  return Or(n) && n["@type"] === "blob" && typeof n.digest == "string";
}
function zI(n) {
  return Go(n) ? n : null;
}
function GI(n, e) {
  t(n);
  function t(r) {
    if (ps(r)) {
      let i = 0;
      for (const a of r) {
        const u = t(a);
        u && (r[i] = u), ++i;
      }
    } else if (Or(r)) {
      const i = zI(r);
      if (i)
        return new ru(i, e);
      for (const a of Object.getOwnPropertyNames(r)) {
        const u = t(r[a]);
        u && (r[a] = u);
      }
    }
  }
}
function HI(n, e) {
  t(n);
  function t(r) {
    if (r instanceof aa)
      return new ru(r, e);
    if (ps(r)) {
      let i = 0;
      for (const a of r) {
        const u = t(a);
        u && (r[i] = u), ++i;
      }
    } else if (Or(r))
      for (const i of Object.getOwnPropertyNames(r)) {
        const a = t(r[i]);
        a && (r[i] = a);
      }
  }
}
function ff(n) {
  let e = 0;
  return eh(n, (t, r) => t instanceof aa ? (e = 2, !1) : (e = 1, !0)), e;
}
function eh(n, e) {
  const t = [];
  function r(i) {
    if (Or(i)) {
      t.push(0);
      for (const a of Object.getOwnPropertyNames(i))
        if (t[t.length - 1] = a, !r(i[a]))
          return !1;
      t.pop();
    } else if (ps(i)) {
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
function Sv(n, e) {
  t(n);
  function t(r) {
    if (Or(r))
      if (Go(r))
        e(r);
      else
        for (const i of Object.getOwnPropertyNames(r))
          t(r[i]);
    else if (ps(r))
      for (const i of r)
        t(i);
  }
}
const Bc = "_default", $n = "value", WI = "array";
function n_(n, e) {
  return "replace";
}
function i_(n, e) {
  if (e === void 0)
    return "replace";
  const t = zn(n).revisionID;
  return t && Ro(t) >= Ro(zn(e).revisionID) ? "replace" : "revert";
}
class YI extends Error {
  constructor(e, t, r, i) {
    super(`Conflict ${e} "${t}" rev ${r}; saved revision is ${i}`), this.docID = t, this.revID = r, this.savedRevID = i, this.name = "Conflict";
  }
}
class Av extends Error {
  constructor(e) {
    super(`Conflict(s) saving ${e.size} documents`), this.errors = e, this.name = "MultipleConflicts";
  }
}
const kv = "(_default|([a-zA-Z0-9][-_a-zA-Z0-9%]*))", VI = new RegExp(`^${kv}(\\.${kv})?$`);
var nt, ti, Hi, zt, wn, xn, Kr, ri, ni, nr, En;
const Jo = class Jo {
  /** @internal */
  constructor(e, t, r, i, a) {
    /** {@link https://logtape.org LogTape} logger instance for this Collection. @internal */
    de(this, "logger");
    ee(this, nt);
    // Dexie Table instance
    ee(this, ti, /* @__PURE__ */ new Map());
    // Cached DocProperty instances
    ee(this, Hi);
    // Current task reading metadata
    ee(this, zt);
    // Metadata, during a transaction
    ee(this, wn, !1);
    // True if `_meta` has unsaved changes
    ee(this, xn);
    // Timer for expiring documents
    ee(this, Kr);
    // Pending changes during a txn
    ee(this, ri, /* @__PURE__ */ new Set());
    // Collection change listeners
    ee(this, ni, /* @__PURE__ */ new Map());
    // Doc change listeners by DocID
    ee(this, nr);
    // Encrypts/decrypts rev bodies
    ee(this, En);
    this.database = e, this.name = t, this.config = r, this.db = i, G(this, nt, i.table(t)), G(this, nr, a), this.logger = lf.getChild(["c", this.name]).with({ db: e.name });
    const u = this.config.indexes;
    if (u)
      for (const l of u) {
        let c;
        typeof l == "string" ? c = l : typeof l.on == "string" ? c = l.on : c = l.on[0], p(this, ti).set(c, us.create(c, !0));
      }
  }
  /** Database calls this right after the constructor.  @internal */
  async open() {
    var e;
    p(this, nr) && G(this, En, (e = await this.getMeta()) == null ? void 0 : e.unencryptedProperties), this.startExpTimer();
  }
  /** Checks that a collection name is valid. If not, throws.  @internal */
  static validateName(e) {
    if (!VI.test(e))
      throw Error(`Invalid collection name '${e}'`);
  }
  /** @internal */
  get dexieTable() {
    return p(this, nt);
  }
  /** True if the database is open.  @internal */
  get isOpen() {
    return p(this, nt).db.isOpen();
  }
  /** @internal */
  closing() {
    this.stopExpTimer(), G(this, nr, void 0);
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
    return t === void 0 && (t = us.create(e, !1), p(this, nr) && (t.encrypted = !((r = p(this, En)) != null && r.has(t.rootName))), p(this, ti).set(e, t)), t;
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
    var a;
    Me((a = qt.currentTransaction) == null ? void 0 : a.active, "Must be called in a transaction");
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
        const l = (c, b) => {
          var w;
          const I = (w = p(this, ti).get(c)) == null ? void 0 : w.rootName;
          I && b.add(I);
        };
        for (const c of u)
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
    for (const u of r) {
      let l = await p(this, nt).get(u);
      if (!Sa(l)) {
        const c = l.encrypted !== void 0;
        if (c && await this.decryptRevision(l), e) {
          const { body: b, encrypted: I } = await di.waitFor(
            e.partlyEncrypt(l.body, t)
          );
          l.body = b, l.encrypted = I;
        }
        (c || l.encrypted) && await p(this, nt).put(l);
      }
    }
    this.resetEncryption(e, t);
    const i = await this.getMeta();
    i.unencryptedProperties = t, G(this, wn, !0), this.logger.info`...done encrypting/decrypting collection!`;
  }
  /** Called by `rekey`, and by the Database after `encrypt` or `decrypt` if something went wrong.
   *  @internal */
  resetEncryption(e, t) {
    G(this, nr, e), G(this, En, t);
    for (let r of p(this, ti).values())
      r.indexed || (r.encrypted = t !== void 0 && t.has(r.rootName));
  }
  /** Called by queries to decrypt a LocalRevision returned from a Dexie query.  @internal */
  async decryptRevision(e) {
    if (e.encrypted) {
      if (!p(this, nr))
        throw new uu("Document is encrypted");
      await di.waitFor(p(this, nr).decryptRevision(e));
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
    const r = await p(this, nt).get(e);
    return r != null && r.encrypted && t && await this.decryptRevision(r), r;
  }
  /** Creates a new {@link CBLDocument document} instance tied to this collection.
   *  The document will not be persisted to the database until you save it.
   *  @param id  The document ID, which must be unique in the Collection.
   *             If you pass `null`, a random ID will be generated.
   *  @param body  The initial contents of the document; if omitted, it will be empty. */
  createDocument(e, t) {
    return t || (t = {}), new Rs(this, e ?? KI(), t).body;
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
    const r = await this.preSave(e), i = await this.inTransaction(Kn, async () => (p(this, zt) || await this.getMeta(), await this.doSave(r, t)));
    return r.postSave(), i && this.logger.info("Saved doc {docID}", { docID: r.doc.id, revID: r.newRevID }), i;
  }
  /** Prep work for save() that can be performed outside of a transaction. */
  async preSave(e, t = !1) {
    const r = new JI(e, t);
    return Me(r.doc.collection === this, "Saving document to wrong Collection"), !t && p(this, nr) && (r.newBody = await di.waitFor(
      p(this, nr).partlyEncrypt(r.doc.body, p(this, En))
    )), r;
  }
  /** The actual work of saving a document. Must be called in a transaction. */
  async doSave(e, t) {
    const r = e.doc;
    let i;
    if (e.newSeq = this._nextSequence(), e.blobStatus > 1 && await this.saveNewBlobsIn(e.doc.body), r.revisionID === void 0) {
      const a = await this.database.tryAdd(p(this, nt), e.makeRevision());
      if (a === void 0)
        return !0;
      if (i = await p(this, nt).get(r.id), !i)
        throw a;
      if (!Sa(i)) {
        if (!this.handleConflict("saving", t, r, i))
          return e.newSeq = void 0, !1;
        e.updateFrom(i.rev) && await this.saveNewBlobsIn(r.body);
      }
    } else if (i = await p(this, nt).get(r.id), !i || i.rev !== r.revisionID) {
      if (!this.handleConflict("saving", t, r, i))
        return e.newSeq = void 0, !1;
      if (e.updateFrom(i == null ? void 0 : i.rev) && await this.saveNewBlobsIn(r.body), !i)
        return await p(this, nt).add(e.makeRevision()), !0;
    }
    return e.updateRevision(i), await p(this, nt).put(i), !0;
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
    e instanceof Rs || (e = zn(e)), Me(e.collection === this, "Saving document to wrong Collection"), Me(e.revisionID !== void 0, "Document has not been saved");
    let r = await this.inTransaction(Kn, async () => await this.doDelete(e, t));
    return r === void 0 ? !1 : (e.setBody({}), e._updateRev(r[0], r[1]), this.logger.info("Deleted doc {docID}", { docID: e.id }), !0);
  }
  async doDelete(e, t) {
    Me(e.collection === this, "Saving document to wrong Collection"), Me(e.revisionID !== void 0, "Document has not been saved");
    const r = await p(this, nt).get(e.id);
    return r ? Sa(r) ? [r.rev, r.seq] : r.rev !== e.revisionID && !this.handleConflict("deleting", t, e, r) ? void 0 : (r.rev = To(e.revisionID, e.body, !0), r.seq = await this.nextSequence(), r.body = {}, r.encrypted = void 0, r.flags = (r.flags ?? 0) | sr & ~jn, await p(this, nt).put(r), [r.rev, r.seq]) : [e.revisionID, e.sequence];
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
      for (const b of e.save) {
        const I = await this.preSave(b);
        I.doc.revisionID === void 0 ? r.push(I) : i.push(I);
      }
    }
    if (e.delete) {
      this.logger.info`Deleting ${e.delete.length} docs ...`;
      for (const b of e.delete)
        a.push(await this.preSave(b, !0));
    }
    const u = r.length + i.length + a.length;
    if (u === 0)
      return;
    let l = [], c = /* @__PURE__ */ new Map();
    await this.inTransaction(Kn, async () => {
      if (await this.getMeta(), r.length > 0) {
        this.logger.debug`... inserting ${r.length} of the docs ...`;
        let b = await this.bulkAdd(r.map((I) => (I.newSeq = this._nextSequence(), I.makeRevision())));
        if (b === void 0)
          l.push(...r);
        else {
          const I = new Set(b);
          r.forEach((w, E) => {
            I.has(E) ? (w.newSeq = void 0, i.push(w)) : l.push(w);
          });
        }
      }
      if (i.length > 0) {
        this.logger.debug`... updating ${i.length} of the docs ...`;
        for (const b of i)
          try {
            await this.doSave(b, e.onConflict) && l.push(b);
          } catch (I) {
            c.set(b.doc.id, I);
          }
      }
      if (a.length > 0) {
        this.logger.debug`... deleting ${a.length} of the docs ...`;
        for (const b of a)
          try {
            const I = await this.doDelete(b.doc, e.onConflict);
            I && ([b.newRevID, b.newSeq] = I, l.push(b));
          } catch (I) {
            c.set(b.doc.id, I);
          }
      }
      if (c.size > 0 && (this.logger.error`saveMultiple: ${c.size} of ${u} docs failed`, !e.bestEffort))
        throw new Av(c);
    });
    for (const b of l)
      b.postSave();
    if (this.logger.info`Updated ${l.length} of ${u} docs in ${Date.now() - t}ms`, c.size > 0 && e.bestEffort)
      throw new Av(c);
  }
  /** Deletes all traces of a document, without leaving a "tombstone" revision behind.
   *  However, this means *purges are not visible to the replicator*, which has two side effects:
   *  - A push replication will not push the deletion to a server.
   *  - If the document is later updated on the server side, the next pull replication will
   *    download the new revision.
   *  @param doc  The document or DocID. */
  async purge(e) {
    const t = typeof e == "string" ? e : zn(e).id;
    await p(this, nt).delete(t), this.logger.info("Purged doc {docID}", { docID: t });
  }
  /** {@link purge Purges} multiple documents at once. */
  async purgeMultiple(e) {
    const t = e.map((r) => typeof r == "string" ? r : zn(r).id);
    await p(this, nt).where(Pa).anyOf(t).delete();
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
    throw new YI(e, r.id, r.revisionID, i == null ? void 0 : i.rev);
  }
  async saveNewBlobsIn(e) {
    const t = new Array();
    eh(e, (r, i) => (r instanceof aa && t.push(r), !0));
    for (const r of t)
      await this.database.blobStore.saveBlob(r.contents, r.digest);
    HI(e, this.database.blobLoader);
  }
  /** Adds the digest of every blob in every document to the set [allDigests]. @internal */
  async collectBlobDigests(e) {
    const t = await p(this, nt).where("flags").anyOf([jn, jn | ws]).primaryKeys();
    console.log(`collectBlobDigests: ${t}`);
    for (const r of t) {
      const i = await p(this, nt).get(r);
      i.encrypted && await this.decryptRevision(i), Sv(i.body, (a) => e.add(a.digest)), i.conflict && Sv(i.conflict, (a) => e.add(a.digest));
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
            Sa(u) && (l.deleted = !0), Object.freeze(l), p(this, Kr).set(u.id, l);
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
    qt.currentTransaction || this.postChangeEvent();
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
    const t = async () => await p(this, nt).where("flags").aboveOrEqual(sr).count();
    switch (e) {
      case "docs":
        return await p(this, nt).count() - await t();
      case "deleted":
        return await t();
      case "includeDeleted":
        return await p(this, nt).count();
    }
  }
  /** Invokes the callback with each (undeleted) Document of the Collection, ordered by docID.
   *  The callback should return true to continue, or false to stop the iteration.
   *  @returns  True if the iteration completed, false if it was stopped. */
  async eachDocument(e) {
    this.logger.info("Getting all documents");
    const t = this.name, r = new Uo(), i = new by({ collection: this, alias: t }), a = new wy((u) => {
      const l = u.getSourceRevision(t);
      return e(this.revToDoc(l));
    });
    return i.receiver = a, await i.run(r), a.ok;
  }
  /** Returns the DocIDs of all (undeleted) documents. */
  async documentIDs() {
    return await p(this, nt).toCollection().filter((e) => !((e.flags ?? 0) & sr)).primaryKeys();
  }
  /** Returns the DocIDs of all deleted documents. */
  async deletedDocumentIDs() {
    return this.docIDsByFlags((e) => e.aboveOrEqual(sr));
  }
  /** Returns the DocIDs of all documents that have unresolved replication conflicts. @internal*/
  async conflictedDocumentIDs() {
    return this.docIDsByFlags((e) => e.between(ws, ws | jn));
  }
  async docIDsByFlags(e) {
    return await e(p(this, nt).where("flags")).primaryKeys();
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
    if (t !== void 0 && (a = t instanceof Date ? t.getTime() : i + t), await p(this, nt).update(r, { expires: a }) < 1)
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
    const t = typeof e == "string" ? e : zn(e).id, r = (i = await p(this, nt).get(t)) == null ? void 0 : i.expires;
    return r ? new Date(r) : void 0;
  }
  /** Returns the next time (milliseconds since epoch) at which a doc will expire. @internal */
  async nextExpirationTime() {
    const e = await p(this, nt).orderBy(wo).first();
    return e == null ? void 0 : e.expires;
  }
  /** Purges all documents whose expiration date has arrived.
   *  Returns the number of documents purged. @internal */
  async expireDocs() {
    const e = await p(this, nt).where(wo).belowOrEqual(Date.now()).delete();
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
        t += ", " + Jo.indexNameFromSpec(r);
    return t;
  }
  /** Returns the Dexie index name of an IndexConfig */
  static indexNameFromSpec(e) {
    function t(r) {
      return us.create(r).keypath;
    }
    if (typeof e == "string")
      return t(e);
    {
      let r = "";
      switch (e.type) {
        case $n:
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
        case WI:
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
      { name: Pa, type: $n, on: [this.property(Co)], unique: !0 },
      { name: Ta, type: $n, on: [this.property(No)], unique: !0 },
      { name: wo, type: $n, on: [this.property(Po)] }
    ];
    const t = this.config.indexes;
    if (t)
      for (const r of t) {
        let i, a, u;
        typeof r == "string" ? i = [r] : (i = Array.isArray(r.on) ? r.on : [r.on], u = r.type ?? $n, a = r.unique);
        let l = Jo.indexNameFromSpec(r);
        l.startsWith("*") && (l = l.substring(1)), e.push({
          name: l,
          type: u ?? $n,
          on: i.map((c) => this.property(c)),
          unique: a
        });
      }
    return e;
  }
  /** Returns the index, if any, whose primary key is `property`.
   *  If there is more than one, it picks the one with the fewest properties.  @internal */
  indexOfProperty(e, t = $n) {
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
    return e.clientID ? e.clientID : await this.db.transaction("rw", Ra, async () => (e = await this.getMeta(), e.clientID || (e.clientID = crypto.randomUUID(), G(this, wn, !0), this.logger.debug("assigned clientID {clientID}", { clientID: e.clientID })), e.clientID));
  }
  /** Returns the locally-stored Checkpoint for a given server URL.
   *  @internal */
  async getCheckpoint(e) {
    const t = await this.db.table(Yc).get([this.name, e]);
    return t ? cs.fromObject(t) : void 0;
  }
  /** Saves the local Checkpoint for a given server URL.
   *  @internal */
  async setCheckpoint(e, t) {
    this.logger.debug("Saving checkpoint {checkpoint}", { checkpoint: t }), await this.db.table(Yc).put(t, [this.name, e]);
  }
  /** The last/highest sequence number assigned to a document.
   *  @internal */
  async lastSequence() {
    return p(this, zt) ? p(this, zt).lastSeq : (await this.getMeta()).lastSeq;
  }
  /** Gets the local current revision(s) of a document, during a pull operation.
   *  @param id  The document ID.
   *  @param serverRevID  The current revID on the server.
   *  @returns  Array of current revIDs, or null if the document is up to date with the server.
   *  @internal */
  async getAncestorRevs(e, t) {
    const r = await p(this, nt).get(e);
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
      if (p(this, zt) || await this.getMeta(), t) {
        this.logger.debug`inserting ${e.length} revs as new...`;
        const u = await this.putNewRemoteRevisions(e);
        if (u === void 0) {
          r = p(this, zt).lastSeq;
          return;
        }
        e = u;
      }
      const a = (await p(this, nt).bulkGet(e.map((u) => u.id))).map((u, l) => this.updateLocalRev(u, e[l], this._nextSequence()));
      p(this, nr) && await this.encryptLocalRevs(a), await p(this, nt).bulkPut(a), r = p(this, zt).lastSeq;
      for (const u of a)
        u.flags && u.flags & ws && (i === void 0 && (i = /* @__PURE__ */ new Set()), i.add(u.id));
    }), Me(r > 0), { lastSequence: r, conflicts: i };
  }
  // subroutine of putRemoteRevisions that uses `bulkAdd` to create new documents;
  // if any already exist, it returns them so the caller can handle them as normal updates.
  async putNewRemoteRevisions(e) {
    const t = e.map((i) => this.createLocalRev(i, this._nextSequence()));
    p(this, nr) && await this.encryptLocalRevs(t);
    let r = await this.bulkAdd(t);
    if (r !== void 0)
      return r.map((i) => e[i]);
  }
  async bulkAdd(e) {
    try {
      await p(this, nt).bulkAdd(e);
      return;
    } catch (t) {
      if (!(t instanceof qt.BulkError))
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
    return e !== void 0 && e > 0 ? r = p(this, nt).where(Ta).above(e) : r = p(this, nt).orderBy(Ta), (await r.limit(t).toArray()).map((i) => (delete i.conflict, i));
  }
  /** Resolves a replication conflict. Returns false if `revID` is out of date. @internal */
  async resolveConflict(e, t, r) {
    return await this.inTransaction(Kn, async () => {
      let a = await p(this, nt).get(e);
      if ((a == null ? void 0 : a.rev) !== t)
        return !1;
      Cn(a.conflict);
      const u = oa(r, a.conflict);
      let l = (a.flags ?? 0) & -194;
      if (r === null)
        l |= sr, r = {};
      else {
        const c = ff(r);
        c > 0 && (l |= jn), c >= 2 && await this.saveNewBlobsIn(r);
      }
      return u ? (Cn(a.serverRev), a.rev = a.serverRev) : a.rev = To(t, r, (l & sr) !== 0), a.body = r, a.seq = await this.nextSequence(), a.flags = l || void 0, a.conflict = void 0, await p(this, nt).put(a), !0;
    });
  }
  //-------- INTERNAL REVISION HELPER METHODS:
  /** Creates a LocalRevision from a RemoteRevision. */
  createLocalRev(e, t) {
    return {
      id: e.id,
      rev: e.rev,
      seq: t,
      flags: e.deleted ? sr : void 0,
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
    return e.rev !== e.serverRev && e.rev !== t.rev ? (e.conflict = t.deleted ? null : t.body, i |= ws) : (e.rev = t.rev, e.body = t.body, t.deleted ? i |= sr : i &= ~sr, i &= ~ws, delete e.conflict), e.flags = i || void 0, e;
  }
  /** Encrypts properties of `rev.body` and puts the ciphertext in `rev.encrypted`.
   *  - Precondition: *Codec exists* and is unlocked.
   *  - Precondition: `rev.body` contains _all_ doc properties. */
  async encryptLocalRev(e) {
    const { body: t, encrypted: r } = await p(this, nr).partlyEncrypt(e.body, p(this, En));
    e.body = t, e.encrypted = r;
  }
  /** Encrypts properties of each rev's `body` and puts the ciphertext in its `encrypted`. */
  async encryptLocalRevs(e) {
    if (p(this, nr)) {
      this.logger.info`Encrypting ${e.length} incoming revisions`;
      const t = Promise.all(e.map(async (r) => this.encryptLocalRev(r)));
      await di.waitFor(t);
    }
  }
  /** Converts a LocalRevision read from the Table into a client Document object. */
  revToDoc(e) {
    if (e.flags) {
      if (e.flags & sr)
        return;
      e.flags & jn && GI(e.body, this.database.blobLoader);
    }
    return new Rs(this, e.id, e.body, e.rev, e.seq).body;
  }
  //-------- Sequence & Transaction Support:
  // generates the next consecutive sequence number.
  async nextSequence() {
    return p(this, zt) || await this.getMeta(), this._nextSequence();
  }
  /** generates the next consecutive sequence number; non-async but #meta must be loaded already */
  _nextSequence() {
    return Cn(p(this, zt)), G(this, wn, !0), ++p(this, zt).lastSeq;
  }
  // Returns the Collection's metadata object.
  async getMeta() {
    return qt.currentTransaction ? (p(this, zt) || (p(this, Hi) || G(this, Hi, this._actuallyReadMeta()), await p(this, Hi)), p(this, zt)) : await this._readMeta();
  }
  // subroutine of getMeta(). Do not call.
  async _actuallyReadMeta() {
    G(this, zt, await this._readMeta()), G(this, Hi, void 0), G(this, wn, !1);
  }
  /** Saves cached changes (`this.meta`) back to the db. Called by Database.inTransaction.
      @internal */
  async transactionEnding(e) {
    e && p(this, wn) && p(this, zt) && await this.metaTable.put(p(this, zt), this.name), G(this, wn, !1), G(this, zt, void 0);
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
    return this.db.table(Ra);
  }
  // Properties to leave unencrypted
};
nt = new WeakMap(), ti = new WeakMap(), Hi = new WeakMap(), zt = new WeakMap(), wn = new WeakMap(), xn = new WeakMap(), Kr = new WeakMap(), ri = new WeakMap(), ni = new WeakMap(), nr = new WeakMap(), En = new WeakMap();
let Os = Jo;
class JI {
  constructor(e, t = !1) {
    de(this, "doc");
    // The document
    de(this, "blobStatus");
    // Whether it has blobs
    de(this, "newBody");
    // The body & maybe encrypted bits
    de(this, "newRevID");
    // The new revision's revID
    de(this, "newSeq");
    this.deleting = t, e instanceof Rs || (e = zn(e)), v0(e.id), this.doc = e, t ? (this.blobStatus = 0, this.newBody = { body: {} }) : (this.blobStatus = ff(e.body), this.newBody = { body: e.body }), this.newRevID = To(e.revisionID, e.body, t);
  }
  /** Creates a LocalRevision object. */
  makeRevision() {
    return Me(!this.deleting), Cn(this.newSeq, "Saving.newSeq"), {
      id: this.doc.id,
      rev: this.newRevID,
      seq: this.newSeq,
      flags: this.blobStatus ? jn : void 0,
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
    this.deleting && (t |= sr), this.blobStatus > 0 && (t |= jn), e.rev = this.newRevID, e.seq = this.newSeq, e.flags = t, e.body = this.newBody.body, e.encrypted = this.newBody.encrypted;
  }
  /** After a save has committed, updates the CBLDocument's revID and sequence. */
  postSave() {
    this.newSeq !== void 0 && (this.doc._updateRev(this.newRevID, this.newSeq), this.deleting && this.doc.setBody({}));
  }
  // The new revision's sequence
}
function Ts(n, e, t) {
  for (Me(t >= 0 && t < 2147483648, "writeVarUint: number out of range"); t >= 128; )
    n[e++] = t & 255 | 128, t = t >>> 7;
  return n[e++] = t, e;
}
function ZI(n) {
  const e = new Uint8Array(10), t = Ts(e, 0, n);
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
function Oy(n) {
  return n.reduce((e, t) => e + t.length, 0);
}
function Ry(n) {
  if (n.length === 1)
    return n[0];
  const e = new Uint8Array(Oy(n));
  let t = 0;
  for (const r of n)
    e.set(r, t), t += r.length;
  return e;
}
var fs = /* @__PURE__ */ ((n) => (n[n.None = 0] = "None", n[n.Compressed = 8] = "Compressed", n[n.Urgent = 16] = "Urgent", n[n.NoReply = 32] = "NoReply", n[n.All = 56] = "All", n))(fs || {}), vn = /* @__PURE__ */ ((n) => (n[n.TypeMask = 7] = "TypeMask", n[n.MoreComing = 64] = "MoreComing", n))(vn || {}), Dr = /* @__PURE__ */ ((n) => (n[n.MSG = 0] = "MSG", n[n.RPY = 1] = "RPY", n[n.ERR = 2] = "ERR", n[n.ACKMSG = 4] = "ACKMSG", n[n.ACKRPY = 5] = "ACKRPY", n))(Dr || {});
const hf = ["MSG", "RPY", "ERR", "?3?", "ACKMSG", "ACKRPY", "?6?", "?7?"], Fc = new Uint8Array(1), Lc = new TextEncoder(), pf = new TextDecoder();
class hs {
  /** Constructs an outgoing request message.
      @param properties  An object containing key/value strings, or a string for the `Profile`
                         property.
      @param body  Either a string, a `Uint8Array`, or a JSON-compatible object.
      @param options  Some combination of `Options` flags (`Urgent`, `NoReply`, `Compressed`.) */
  constructor(e, t = "", r = 0) {
    /** The key/value properties, most importantly `Profile` which is the request type.
        These may be modified until you send the message. */
    de(this, "properties");
    de(this, "_flags");
    de(this, "_number");
    de(this, "_bodyData");
    de(this, "_bodyString");
    de(this, "_bodyJSON");
    this._flags = r & 56, typeof e == "string" ? this.properties = { Profile: e } : this.properties = e, typeof t == "string" ? this._bodyString = t : t instanceof Uint8Array ? this._bodyData = t : t != null ? this.bodyJSON = t : this._bodyString = "";
  }
  /** Constructs a reply to this Message.
   *  This Message must be an incoming request and must not have the {@link NoReply} flag. */
  makeReply(e = {}, t = "", r = 0) {
    Me(this.type === 0, "cannot reply to a reply"), Me(this.wantsReply, "message was sent NoReply"), Me(this._number !== void 0, "message has not been sent");
    const i = new hs(e, t);
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
    return this.isError ? new QI(this) : void 0;
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
    let t = hs.describeFrame(this._number, this._flags);
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
      e.unshift(ZI(Oy(e)));
    } else
      e.unshift(Fc);
    return e.push(this.bodyData), Ry(e);
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
class Ca extends hs {
  constructor(e, t, r, i) {
    Me(e > 0, "invalid message number"), super(t, r), this._flags = i, this._number = e;
  }
  static makeReply(e, t = {}, r = "", i = 0) {
    return new Ca(e, t, r, 1 | i);
  }
  static makeError(e, t, r, i = "BLIP") {
    return new Ca(
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
      const b = pf.decode(e.slice(a, c));
      if (a = c + 1, c = e.indexOf(0, a), c < 0 || c > i)
        throw Error("Invalid message properties (no NUL)");
      const I = pf.decode(e.slice(a, c));
      a = c + 1, u[b] = I;
    }
    const l = e.slice(i);
    return new Ca(r, u, l, t);
  }
}
class Ho extends Error {
  constructor(t, r, i = "BLIP") {
    super(t);
    /** The error domain, a namespace for the code. */
    de(this, "blipErrorDomain");
    /** The error code. */
    de(this, "blipErrorCode");
    this.name = "blip.BLIPError", this.blipErrorCode = r, this.blipErrorDomain = i;
  }
  matches(t, r = "BLIP") {
    return this.blipErrorCode === t && this.blipErrorDomain === r;
  }
  toString() {
    return `${super.toString()} (${this.blipErrorDomain} ${this.blipErrorCode})`;
  }
}
class QI extends Ho {
  constructor(t) {
    super(
      "Peer responded with error: " + t.bodyString,
      t.numericProperty("Error-Code"),
      t.property("Error-Domain", "BLIP")
    );
    /** The incoming BLIP error reply. */
    de(this, "blipMessage");
    this.name = "blip.MessageError", this.blipMessage = t;
  }
}
var ii;
class XI {
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
function eb({ polynomial: n, numTables: e }) {
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
const nn = eb({ polynomial: 3988292384, numTables: 8 });
function tb() {
  return -1;
}
function rb(n, e) {
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
function nb(n) {
  return (n ^ -1) >>> 0;
}
var qc = {}, Ov;
function _i() {
  return Ov || (Ov = 1, (function(n) {
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
      arraySet: function(a, u, l, c, b) {
        if (u.subarray && a.subarray) {
          a.set(u.subarray(l, l + c), b);
          return;
        }
        for (var I = 0; I < c; I++)
          a[b + I] = u[l + I];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        var u, l, c, b, I, w;
        for (c = 0, u = 0, l = a.length; u < l; u++)
          c += a[u].length;
        for (w = new Uint8Array(c), b = 0, u = 0, l = a.length; u < l; u++)
          I = a[u], w.set(I, b), b += I.length;
        return w;
      }
    }, i = {
      arraySet: function(a, u, l, c, b) {
        for (var I = 0; I < c; I++)
          a[b + I] = u[l + I];
      },
      // Join array of chunks to single array.
      flattenChunks: function(a) {
        return [].concat.apply([], a);
      }
    };
    n.setTyped = function(a) {
      a ? (n.Buf8 = Uint8Array, n.Buf16 = Uint16Array, n.Buf32 = Int32Array, n.assign(n, r)) : (n.Buf8 = Array, n.Buf16 = Array, n.Buf32 = Array, n.assign(n, i));
    }, n.setTyped(e);
  })(qc)), qc;
}
var Es = {}, Gr = {}, Oi = {}, Rv;
function ib() {
  if (Rv) return Oi;
  Rv = 1;
  var n = _i(), e = 4, t = 0, r = 1, i = 2;
  function a(g) {
    for (var T = g.length; --T >= 0; )
      g[T] = 0;
  }
  var u = 0, l = 1, c = 2, b = 3, I = 258, w = 29, E = 256, k = E + 1 + w, B = 30, K = 19, C = 2 * k + 1, M = 15, Z = 16, X = 7, ue = 256, ce = 16, he = 17, oe = 18, ke = (
    /* extra bits for each length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
  ), De = (
    /* extra bits for each distance code */
    [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
  ), Ce = (
    /* extra bits for each bit length code */
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
  ), $e = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Be = 512, Ae = new Array((k + 2) * 2);
  a(Ae);
  var Ue = new Array(B * 2);
  a(Ue);
  var st = new Array(Be);
  a(st);
  var vt = new Array(I - b + 1);
  a(vt);
  var we = new Array(w);
  a(we);
  var We = new Array(B);
  a(We);
  function ze(g, T, L, le, D) {
    this.static_tree = g, this.extra_bits = T, this.extra_base = L, this.elems = le, this.max_length = D, this.has_stree = g && g.length;
  }
  var It, Je, et;
  function Qe(g, T) {
    this.dyn_tree = g, this.max_code = 0, this.stat_desc = T;
  }
  function wt(g) {
    return g < 256 ? st[g] : st[256 + (g >>> 7)];
  }
  function yt(g, T) {
    g.pending_buf[g.pending++] = T & 255, g.pending_buf[g.pending++] = T >>> 8 & 255;
  }
  function Ye(g, T, L) {
    g.bi_valid > Z - L ? (g.bi_buf |= T << g.bi_valid & 65535, yt(g, g.bi_buf), g.bi_buf = T >> Z - g.bi_valid, g.bi_valid += L - Z) : (g.bi_buf |= T << g.bi_valid & 65535, g.bi_valid += L);
  }
  function ut(g, T, L) {
    Ye(
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
  function pe(g) {
    g.bi_valid === 16 ? (yt(g, g.bi_buf), g.bi_buf = 0, g.bi_valid = 0) : g.bi_valid >= 8 && (g.pending_buf[g.pending++] = g.bi_buf & 255, g.bi_buf >>= 8, g.bi_valid -= 8);
  }
  function Fe(g, T) {
    var L = T.dyn_tree, le = T.max_code, D = T.stat_desc.static_tree, q = T.stat_desc.has_stree, _ = T.stat_desc.extra_bits, ie = T.stat_desc.extra_base, Ne = T.stat_desc.max_length, f, te, ne, A, F, Q, Oe = 0;
    for (A = 0; A <= M; A++)
      g.bl_count[A] = 0;
    for (L[g.heap[g.heap_max] * 2 + 1] = 0, f = g.heap_max + 1; f < C; f++)
      te = g.heap[f], A = L[L[te * 2 + 1] * 2 + 1] + 1, A > Ne && (A = Ne, Oe++), L[te * 2 + 1] = A, !(te > le) && (g.bl_count[A]++, F = 0, te >= ie && (F = _[te - ie]), Q = L[te * 2], g.opt_len += Q * (A + F), q && (g.static_len += Q * (D[te * 2 + 1] + F)));
    if (Oe !== 0) {
      do {
        for (A = Ne - 1; g.bl_count[A] === 0; )
          A--;
        g.bl_count[A]--, g.bl_count[A + 1] += 2, g.bl_count[Ne]--, Oe -= 2;
      } while (Oe > 0);
      for (A = Ne; A !== 0; A--)
        for (te = g.bl_count[A]; te !== 0; )
          ne = g.heap[--f], !(ne > le) && (L[ne * 2 + 1] !== A && (g.opt_len += (A - L[ne * 2 + 1]) * L[ne * 2], L[ne * 2 + 1] = A), te--);
    }
  }
  function tt(g, T, L) {
    var le = new Array(M + 1), D = 0, q, _;
    for (q = 1; q <= M; q++)
      le[q] = D = D + L[q - 1] << 1;
    for (_ = 0; _ <= T; _++) {
      var ie = g[_ * 2 + 1];
      ie !== 0 && (g[_ * 2] = Pe(le[ie]++, ie));
    }
  }
  function me() {
    var g, T, L, le, D, q = new Array(M + 1);
    for (L = 0, le = 0; le < w - 1; le++)
      for (we[le] = L, g = 0; g < 1 << ke[le]; g++)
        vt[L++] = le;
    for (vt[L - 1] = le, D = 0, le = 0; le < 16; le++)
      for (We[le] = D, g = 0; g < 1 << De[le]; g++)
        st[D++] = le;
    for (D >>= 7; le < B; le++)
      for (We[le] = D << 7, g = 0; g < 1 << De[le] - 7; g++)
        st[256 + D++] = le;
    for (T = 0; T <= M; T++)
      q[T] = 0;
    for (g = 0; g <= 143; )
      Ae[g * 2 + 1] = 8, g++, q[8]++;
    for (; g <= 255; )
      Ae[g * 2 + 1] = 9, g++, q[9]++;
    for (; g <= 279; )
      Ae[g * 2 + 1] = 7, g++, q[7]++;
    for (; g <= 287; )
      Ae[g * 2 + 1] = 8, g++, q[8]++;
    for (tt(Ae, k + 1, q), g = 0; g < B; g++)
      Ue[g * 2 + 1] = 5, Ue[g * 2] = Pe(g, 5);
    It = new ze(Ae, ke, E + 1, k, M), Je = new ze(Ue, De, 0, B, M), et = new ze(new Array(0), Ce, 0, K, X);
  }
  function je(g) {
    var T;
    for (T = 0; T < k; T++)
      g.dyn_ltree[T * 2] = 0;
    for (T = 0; T < B; T++)
      g.dyn_dtree[T * 2] = 0;
    for (T = 0; T < K; T++)
      g.bl_tree[T * 2] = 0;
    g.dyn_ltree[ue * 2] = 1, g.opt_len = g.static_len = 0, g.last_lit = g.matches = 0;
  }
  function gt(g) {
    g.bi_valid > 8 ? yt(g, g.bi_buf) : g.bi_valid > 0 && (g.pending_buf[g.pending++] = g.bi_buf), g.bi_buf = 0, g.bi_valid = 0;
  }
  function ht(g, T, L, le) {
    gt(g), yt(g, L), yt(g, ~L), n.arraySet(g.pending_buf, g.window, T, L, g.pending), g.pending += L;
  }
  function lt(g, T, L, le) {
    var D = T * 2, q = L * 2;
    return g[D] < g[q] || g[D] === g[q] && le[T] <= le[L];
  }
  function it(g, T, L) {
    for (var le = g.heap[L], D = L << 1; D <= g.heap_len && (D < g.heap_len && lt(T, g.heap[D + 1], g.heap[D], g.depth) && D++, !lt(T, le, g.heap[D], g.depth)); )
      g.heap[L] = g.heap[D], L = D, D <<= 1;
    g.heap[L] = le;
  }
  function Le(g, T, L) {
    var le, D, q = 0, _, ie;
    if (g.last_lit !== 0)
      do
        le = g.pending_buf[g.d_buf + q * 2] << 8 | g.pending_buf[g.d_buf + q * 2 + 1], D = g.pending_buf[g.l_buf + q], q++, le === 0 ? ut(g, D, T) : (_ = vt[D], ut(g, _ + E + 1, T), ie = ke[_], ie !== 0 && (D -= we[_], Ye(g, D, ie)), le--, _ = wt(le), ut(g, _, L), ie = De[_], ie !== 0 && (le -= We[_], Ye(g, le, ie)));
      while (q < g.last_lit);
    ut(g, ue, T);
  }
  function kt(g, T) {
    var L = T.dyn_tree, le = T.stat_desc.static_tree, D = T.stat_desc.has_stree, q = T.stat_desc.elems, _, ie, Ne = -1, f;
    for (g.heap_len = 0, g.heap_max = C, _ = 0; _ < q; _++)
      L[_ * 2] !== 0 ? (g.heap[++g.heap_len] = Ne = _, g.depth[_] = 0) : L[_ * 2 + 1] = 0;
    for (; g.heap_len < 2; )
      f = g.heap[++g.heap_len] = Ne < 2 ? ++Ne : 0, L[f * 2] = 1, g.depth[f] = 0, g.opt_len--, D && (g.static_len -= le[f * 2 + 1]);
    for (T.max_code = Ne, _ = g.heap_len >> 1; _ >= 1; _--)
      it(g, L, _);
    f = q;
    do
      _ = g.heap[
        1
        /*SMALLEST*/
      ], g.heap[
        1
        /*SMALLEST*/
      ] = g.heap[g.heap_len--], it(
        g,
        L,
        1
        /*SMALLEST*/
      ), ie = g.heap[
        1
        /*SMALLEST*/
      ], g.heap[--g.heap_max] = _, g.heap[--g.heap_max] = ie, L[f * 2] = L[_ * 2] + L[ie * 2], g.depth[f] = (g.depth[_] >= g.depth[ie] ? g.depth[_] : g.depth[ie]) + 1, L[_ * 2 + 1] = L[ie * 2 + 1] = f, g.heap[
        1
        /*SMALLEST*/
      ] = f++, it(
        g,
        L,
        1
        /*SMALLEST*/
      );
    while (g.heap_len >= 2);
    g.heap[--g.heap_max] = g.heap[
      1
      /*SMALLEST*/
    ], Fe(g, T), tt(L, Ne, g.bl_count);
  }
  function Ot(g, T, L) {
    var le, D = -1, q, _ = T[1], ie = 0, Ne = 7, f = 4;
    for (_ === 0 && (Ne = 138, f = 3), T[(L + 1) * 2 + 1] = 65535, le = 0; le <= L; le++)
      q = _, _ = T[(le + 1) * 2 + 1], !(++ie < Ne && q === _) && (ie < f ? g.bl_tree[q * 2] += ie : q !== 0 ? (q !== D && g.bl_tree[q * 2]++, g.bl_tree[ce * 2]++) : ie <= 10 ? g.bl_tree[he * 2]++ : g.bl_tree[oe * 2]++, ie = 0, D = q, _ === 0 ? (Ne = 138, f = 3) : q === _ ? (Ne = 6, f = 3) : (Ne = 7, f = 4));
  }
  function qe(g, T, L) {
    var le, D = -1, q, _ = T[1], ie = 0, Ne = 7, f = 4;
    for (_ === 0 && (Ne = 138, f = 3), le = 0; le <= L; le++)
      if (q = _, _ = T[(le + 1) * 2 + 1], !(++ie < Ne && q === _)) {
        if (ie < f)
          do
            ut(g, q, g.bl_tree);
          while (--ie !== 0);
        else q !== 0 ? (q !== D && (ut(g, q, g.bl_tree), ie--), ut(g, ce, g.bl_tree), Ye(g, ie - 3, 2)) : ie <= 10 ? (ut(g, he, g.bl_tree), Ye(g, ie - 3, 3)) : (ut(g, oe, g.bl_tree), Ye(g, ie - 11, 7));
        ie = 0, D = q, _ === 0 ? (Ne = 138, f = 3) : q === _ ? (Ne = 6, f = 3) : (Ne = 7, f = 4);
      }
  }
  function Xe(g) {
    var T;
    for (Ot(g, g.dyn_ltree, g.l_desc.max_code), Ot(g, g.dyn_dtree, g.d_desc.max_code), kt(g, g.bl_desc), T = K - 1; T >= 3 && g.bl_tree[$e[T] * 2 + 1] === 0; T--)
      ;
    return g.opt_len += 3 * (T + 1) + 5 + 5 + 4, T;
  }
  function Et(g, T, L, le) {
    var D;
    for (Ye(g, T - 257, 5), Ye(g, L - 1, 5), Ye(g, le - 4, 4), D = 0; D < le; D++)
      Ye(g, g.bl_tree[$e[D] * 2 + 1], 3);
    qe(g, g.dyn_ltree, T - 1), qe(g, g.dyn_dtree, L - 1);
  }
  function Lt(g) {
    var T = 4093624447, L;
    for (L = 0; L <= 31; L++, T >>>= 1)
      if (T & 1 && g.dyn_ltree[L * 2] !== 0)
        return t;
    if (g.dyn_ltree[18] !== 0 || g.dyn_ltree[20] !== 0 || g.dyn_ltree[26] !== 0)
      return r;
    for (L = 32; L < E; L++)
      if (g.dyn_ltree[L * 2] !== 0)
        return r;
    return t;
  }
  var _t = !1;
  function Qt(g) {
    _t || (me(), _t = !0), g.l_desc = new Qe(g.dyn_ltree, It), g.d_desc = new Qe(g.dyn_dtree, Je), g.bl_desc = new Qe(g.bl_tree, et), g.bi_buf = 0, g.bi_valid = 0, je(g);
  }
  function S(g, T, L, le) {
    Ye(g, (u << 1) + (le ? 1 : 0), 3), ht(g, T, L);
  }
  function d(g) {
    Ye(g, l << 1, 3), ut(g, ue, Ae), pe(g);
  }
  function v(g, T, L, le) {
    var D, q, _ = 0;
    g.level > 0 ? (g.strm.data_type === i && (g.strm.data_type = Lt(g)), kt(g, g.l_desc), kt(g, g.d_desc), _ = Xe(g), D = g.opt_len + 3 + 7 >>> 3, q = g.static_len + 3 + 7 >>> 3, q <= D && (D = q)) : D = q = L + 5, L + 4 <= D && T !== -1 ? S(g, T, L, le) : g.strategy === e || q === D ? (Ye(g, (l << 1) + (le ? 1 : 0), 3), Le(g, Ae, Ue)) : (Ye(g, (c << 1) + (le ? 1 : 0), 3), Et(g, g.l_desc.max_code + 1, g.d_desc.max_code + 1, _ + 1), Le(g, g.dyn_ltree, g.dyn_dtree)), je(g), le && gt(g);
  }
  function O(g, T, L) {
    return g.pending_buf[g.d_buf + g.last_lit * 2] = T >>> 8 & 255, g.pending_buf[g.d_buf + g.last_lit * 2 + 1] = T & 255, g.pending_buf[g.l_buf + g.last_lit] = L & 255, g.last_lit++, T === 0 ? g.dyn_ltree[L * 2]++ : (g.matches++, T--, g.dyn_ltree[(vt[L] + E + 1) * 2]++, g.dyn_dtree[wt(T) * 2]++), g.last_lit === g.lit_bufsize - 1;
  }
  return Oi._tr_init = Qt, Oi._tr_stored_block = S, Oi._tr_flush_block = v, Oi._tr_tally = O, Oi._tr_align = d, Oi;
}
var Mc, Tv;
function Ty() {
  if (Tv) return Mc;
  Tv = 1;
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
var Uc, Cv;
function Cy() {
  if (Cv) return Uc;
  Cv = 1;
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
    for (var b = u; b < c; b++)
      r = r >>> 8 ^ l[(r ^ i[b]) & 255];
    return r ^ -1;
  }
  return Uc = t, Uc;
}
var $c, Nv;
function th() {
  return Nv || (Nv = 1, $c = {
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
var Pv;
function sb() {
  if (Pv) return Gr;
  Pv = 1;
  var n = _i(), e = ib(), t = Ty(), r = Cy(), i = th(), a = 0, u = 1, l = 3, c = 4, b = 5, I = 0, w = 1, E = -2, k = -3, B = -5, K = -1, C = 1, M = 2, Z = 3, X = 4, ue = 0, ce = 2, he = 8, oe = 9, ke = 15, De = 8, Ce = 29, $e = 256, Be = $e + 1 + Ce, Ae = 30, Ue = 19, st = 2 * Be + 1, vt = 15, we = 3, We = 258, ze = We + we + 1, It = 32, Je = 42, et = 69, Qe = 73, wt = 91, yt = 103, Ye = 113, ut = 666, Pe = 1, pe = 2, Fe = 3, tt = 4, me = 3;
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
  function lt(f) {
    var te = f.state, ne = te.pending;
    ne > f.avail_out && (ne = f.avail_out), ne !== 0 && (n.arraySet(f.output, te.pending_buf, te.pending_out, ne, f.next_out), f.next_out += ne, te.pending_out += ne, f.total_out += ne, f.avail_out -= ne, te.pending -= ne, te.pending === 0 && (te.pending_out = 0));
  }
  function it(f, te) {
    e._tr_flush_block(f, f.block_start >= 0 ? f.block_start : -1, f.strstart - f.block_start, te), f.block_start = f.strstart, lt(f.strm);
  }
  function Le(f, te) {
    f.pending_buf[f.pending++] = te;
  }
  function kt(f, te) {
    f.pending_buf[f.pending++] = te >>> 8 & 255, f.pending_buf[f.pending++] = te & 255;
  }
  function Ot(f, te, ne, A) {
    var F = f.avail_in;
    return F > A && (F = A), F === 0 ? 0 : (f.avail_in -= F, n.arraySet(te, f.input, f.next_in, F, ne), f.state.wrap === 1 ? f.adler = t(f.adler, te, F, ne) : f.state.wrap === 2 && (f.adler = r(f.adler, te, F, ne)), f.next_in += F, f.total_in += F, F);
  }
  function qe(f, te) {
    var ne = f.max_chain_length, A = f.strstart, F, Q, Oe = f.prev_length, Ee = f.nice_match, xe = f.strstart > f.w_size - ze ? f.strstart - (f.w_size - ze) : 0, Ze = f.window, Cr = f.w_mask, bt = f.prev, Te = f.strstart + We, rt = Ze[A + Oe - 1], $t = Ze[A + Oe];
    f.prev_length >= f.good_match && (ne >>= 2), Ee > f.lookahead && (Ee = f.lookahead);
    do
      if (F = te, !(Ze[F + Oe] !== $t || Ze[F + Oe - 1] !== rt || Ze[F] !== Ze[A] || Ze[++F] !== Ze[A + 1])) {
        A += 2, F++;
        do
          ;
        while (Ze[++A] === Ze[++F] && Ze[++A] === Ze[++F] && Ze[++A] === Ze[++F] && Ze[++A] === Ze[++F] && Ze[++A] === Ze[++F] && Ze[++A] === Ze[++F] && Ze[++A] === Ze[++F] && Ze[++A] === Ze[++F] && A < Te);
        if (Q = We - (Te - A), A = Te - We, Q > Oe) {
          if (f.match_start = te, Oe = Q, Q >= Ee)
            break;
          rt = Ze[A + Oe - 1], $t = Ze[A + Oe];
        }
      }
    while ((te = bt[te & Cr]) > xe && --ne !== 0);
    return Oe <= f.lookahead ? Oe : f.lookahead;
  }
  function Xe(f) {
    var te = f.w_size, ne, A, F, Q, Oe;
    do {
      if (Q = f.window_size - f.lookahead - f.strstart, f.strstart >= te + (te - ze)) {
        n.arraySet(f.window, f.window, te, te, 0), f.match_start -= te, f.strstart -= te, f.block_start -= te, A = f.hash_size, ne = A;
        do
          F = f.head[--ne], f.head[ne] = F >= te ? F - te : 0;
        while (--A);
        A = te, ne = A;
        do
          F = f.prev[--ne], f.prev[ne] = F >= te ? F - te : 0;
        while (--A);
        Q += te;
      }
      if (f.strm.avail_in === 0)
        break;
      if (A = Ot(f.strm, f.window, f.strstart + f.lookahead, Q), f.lookahead += A, f.lookahead + f.insert >= we)
        for (Oe = f.strstart - f.insert, f.ins_h = f.window[Oe], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[Oe + 1]) & f.hash_mask; f.insert && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[Oe + we - 1]) & f.hash_mask, f.prev[Oe & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = Oe, Oe++, f.insert--, !(f.lookahead + f.insert < we)); )
          ;
    } while (f.lookahead < ze && f.strm.avail_in !== 0);
  }
  function Et(f, te) {
    var ne = 65535;
    for (ne > f.pending_buf_size - 5 && (ne = f.pending_buf_size - 5); ; ) {
      if (f.lookahead <= 1) {
        if (Xe(f), f.lookahead === 0 && te === a)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      f.strstart += f.lookahead, f.lookahead = 0;
      var A = f.block_start + ne;
      if ((f.strstart === 0 || f.strstart >= A) && (f.lookahead = f.strstart - A, f.strstart = A, it(f, !1), f.strm.avail_out === 0) || f.strstart - f.block_start >= f.w_size - ze && (it(f, !1), f.strm.avail_out === 0))
        return Pe;
    }
    return f.insert = 0, te === c ? (it(f, !0), f.strm.avail_out === 0 ? Fe : tt) : (f.strstart > f.block_start && (it(f, !1), f.strm.avail_out === 0), Pe);
  }
  function Lt(f, te) {
    for (var ne, A; ; ) {
      if (f.lookahead < ze) {
        if (Xe(f), f.lookahead < ze && te === a)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      if (ne = 0, f.lookahead >= we && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ne = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), ne !== 0 && f.strstart - ne <= f.w_size - ze && (f.match_length = qe(f, ne)), f.match_length >= we)
        if (A = e._tr_tally(f, f.strstart - f.match_start, f.match_length - we), f.lookahead -= f.match_length, f.match_length <= f.max_lazy_match && f.lookahead >= we) {
          f.match_length--;
          do
            f.strstart++, f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ne = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart;
          while (--f.match_length !== 0);
          f.strstart++;
        } else
          f.strstart += f.match_length, f.match_length = 0, f.ins_h = f.window[f.strstart], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + 1]) & f.hash_mask;
      else
        A = e._tr_tally(f, 0, f.window[f.strstart]), f.lookahead--, f.strstart++;
      if (A && (it(f, !1), f.strm.avail_out === 0))
        return Pe;
    }
    return f.insert = f.strstart < we - 1 ? f.strstart : we - 1, te === c ? (it(f, !0), f.strm.avail_out === 0 ? Fe : tt) : f.last_lit && (it(f, !1), f.strm.avail_out === 0) ? Pe : pe;
  }
  function _t(f, te) {
    for (var ne, A, F; ; ) {
      if (f.lookahead < ze) {
        if (Xe(f), f.lookahead < ze && te === a)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      if (ne = 0, f.lookahead >= we && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ne = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), f.prev_length = f.match_length, f.prev_match = f.match_start, f.match_length = we - 1, ne !== 0 && f.prev_length < f.max_lazy_match && f.strstart - ne <= f.w_size - ze && (f.match_length = qe(f, ne), f.match_length <= 5 && (f.strategy === C || f.match_length === we && f.strstart - f.match_start > 4096) && (f.match_length = we - 1)), f.prev_length >= we && f.match_length <= f.prev_length) {
        F = f.strstart + f.lookahead - we, A = e._tr_tally(f, f.strstart - 1 - f.prev_match, f.prev_length - we), f.lookahead -= f.prev_length - 1, f.prev_length -= 2;
        do
          ++f.strstart <= F && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + we - 1]) & f.hash_mask, ne = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart);
        while (--f.prev_length !== 0);
        if (f.match_available = 0, f.match_length = we - 1, f.strstart++, A && (it(f, !1), f.strm.avail_out === 0))
          return Pe;
      } else if (f.match_available) {
        if (A = e._tr_tally(f, 0, f.window[f.strstart - 1]), A && it(f, !1), f.strstart++, f.lookahead--, f.strm.avail_out === 0)
          return Pe;
      } else
        f.match_available = 1, f.strstart++, f.lookahead--;
    }
    return f.match_available && (A = e._tr_tally(f, 0, f.window[f.strstart - 1]), f.match_available = 0), f.insert = f.strstart < we - 1 ? f.strstart : we - 1, te === c ? (it(f, !0), f.strm.avail_out === 0 ? Fe : tt) : f.last_lit && (it(f, !1), f.strm.avail_out === 0) ? Pe : pe;
  }
  function Qt(f, te) {
    for (var ne, A, F, Q, Oe = f.window; ; ) {
      if (f.lookahead <= We) {
        if (Xe(f), f.lookahead <= We && te === a)
          return Pe;
        if (f.lookahead === 0)
          break;
      }
      if (f.match_length = 0, f.lookahead >= we && f.strstart > 0 && (F = f.strstart - 1, A = Oe[F], A === Oe[++F] && A === Oe[++F] && A === Oe[++F])) {
        Q = f.strstart + We;
        do
          ;
        while (A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && A === Oe[++F] && F < Q);
        f.match_length = We - (Q - F), f.match_length > f.lookahead && (f.match_length = f.lookahead);
      }
      if (f.match_length >= we ? (ne = e._tr_tally(f, 1, f.match_length - we), f.lookahead -= f.match_length, f.strstart += f.match_length, f.match_length = 0) : (ne = e._tr_tally(f, 0, f.window[f.strstart]), f.lookahead--, f.strstart++), ne && (it(f, !1), f.strm.avail_out === 0))
        return Pe;
    }
    return f.insert = 0, te === c ? (it(f, !0), f.strm.avail_out === 0 ? Fe : tt) : f.last_lit && (it(f, !1), f.strm.avail_out === 0) ? Pe : pe;
  }
  function S(f, te) {
    for (var ne; ; ) {
      if (f.lookahead === 0 && (Xe(f), f.lookahead === 0)) {
        if (te === a)
          return Pe;
        break;
      }
      if (f.match_length = 0, ne = e._tr_tally(f, 0, f.window[f.strstart]), f.lookahead--, f.strstart++, ne && (it(f, !1), f.strm.avail_out === 0))
        return Pe;
    }
    return f.insert = 0, te === c ? (it(f, !0), f.strm.avail_out === 0 ? Fe : tt) : f.last_lit && (it(f, !1), f.strm.avail_out === 0) ? Pe : pe;
  }
  function d(f, te, ne, A, F) {
    this.good_length = f, this.max_lazy = te, this.nice_length = ne, this.max_chain = A, this.func = F;
  }
  var v;
  v = [
    /*      good lazy nice chain */
    new d(0, 0, 0, 0, Et),
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
  function O(f) {
    f.window_size = 2 * f.w_size, ht(f.head), f.max_lazy_match = v[f.level].max_lazy, f.good_match = v[f.level].good_length, f.nice_match = v[f.level].nice_length, f.max_chain_length = v[f.level].max_chain, f.strstart = 0, f.block_start = 0, f.lookahead = 0, f.insert = 0, f.match_length = f.prev_length = we - 1, f.match_available = 0, f.ins_h = 0;
  }
  function g() {
    this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = he, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(st * 2), this.dyn_dtree = new n.Buf16((2 * Ae + 1) * 2), this.bl_tree = new n.Buf16((2 * Ue + 1) * 2), ht(this.dyn_ltree), ht(this.dyn_dtree), ht(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16(vt + 1), this.heap = new n.Buf16(2 * Be + 1), ht(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(2 * Be + 1), ht(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
  }
  function T(f) {
    var te;
    return !f || !f.state ? je(f, E) : (f.total_in = f.total_out = 0, f.data_type = ce, te = f.state, te.pending = 0, te.pending_out = 0, te.wrap < 0 && (te.wrap = -te.wrap), te.status = te.wrap ? Je : Ye, f.adler = te.wrap === 2 ? 0 : 1, te.last_flush = a, e._tr_init(te), I);
  }
  function L(f) {
    var te = T(f);
    return te === I && O(f.state), te;
  }
  function le(f, te) {
    return !f || !f.state || f.state.wrap !== 2 ? E : (f.state.gzhead = te, I);
  }
  function D(f, te, ne, A, F, Q) {
    if (!f)
      return E;
    var Oe = 1;
    if (te === K && (te = 6), A < 0 ? (Oe = 0, A = -A) : A > 15 && (Oe = 2, A -= 16), F < 1 || F > oe || ne !== he || A < 8 || A > 15 || te < 0 || te > 9 || Q < 0 || Q > X)
      return je(f, E);
    A === 8 && (A = 9);
    var Ee = new g();
    return f.state = Ee, Ee.strm = f, Ee.wrap = Oe, Ee.gzhead = null, Ee.w_bits = A, Ee.w_size = 1 << Ee.w_bits, Ee.w_mask = Ee.w_size - 1, Ee.hash_bits = F + 7, Ee.hash_size = 1 << Ee.hash_bits, Ee.hash_mask = Ee.hash_size - 1, Ee.hash_shift = ~~((Ee.hash_bits + we - 1) / we), Ee.window = new n.Buf8(Ee.w_size * 2), Ee.head = new n.Buf16(Ee.hash_size), Ee.prev = new n.Buf16(Ee.w_size), Ee.lit_bufsize = 1 << F + 6, Ee.pending_buf_size = Ee.lit_bufsize * 4, Ee.pending_buf = new n.Buf8(Ee.pending_buf_size), Ee.d_buf = 1 * Ee.lit_bufsize, Ee.l_buf = 3 * Ee.lit_bufsize, Ee.level = te, Ee.strategy = Q, Ee.method = ne, L(f);
  }
  function q(f, te) {
    return D(f, te, he, ke, De, ue);
  }
  function _(f, te) {
    var ne, A, F, Q;
    if (!f || !f.state || te > b || te < 0)
      return f ? je(f, E) : E;
    if (A = f.state, !f.output || !f.input && f.avail_in !== 0 || A.status === ut && te !== c)
      return je(f, f.avail_out === 0 ? B : E);
    if (A.strm = f, ne = A.last_flush, A.last_flush = te, A.status === Je)
      if (A.wrap === 2)
        f.adler = 0, Le(A, 31), Le(A, 139), Le(A, 8), A.gzhead ? (Le(
          A,
          (A.gzhead.text ? 1 : 0) + (A.gzhead.hcrc ? 2 : 0) + (A.gzhead.extra ? 4 : 0) + (A.gzhead.name ? 8 : 0) + (A.gzhead.comment ? 16 : 0)
        ), Le(A, A.gzhead.time & 255), Le(A, A.gzhead.time >> 8 & 255), Le(A, A.gzhead.time >> 16 & 255), Le(A, A.gzhead.time >> 24 & 255), Le(A, A.level === 9 ? 2 : A.strategy >= M || A.level < 2 ? 4 : 0), Le(A, A.gzhead.os & 255), A.gzhead.extra && A.gzhead.extra.length && (Le(A, A.gzhead.extra.length & 255), Le(A, A.gzhead.extra.length >> 8 & 255)), A.gzhead.hcrc && (f.adler = r(f.adler, A.pending_buf, A.pending, 0)), A.gzindex = 0, A.status = et) : (Le(A, 0), Le(A, 0), Le(A, 0), Le(A, 0), Le(A, 0), Le(A, A.level === 9 ? 2 : A.strategy >= M || A.level < 2 ? 4 : 0), Le(A, me), A.status = Ye);
      else {
        var Oe = he + (A.w_bits - 8 << 4) << 8, Ee = -1;
        A.strategy >= M || A.level < 2 ? Ee = 0 : A.level < 6 ? Ee = 1 : A.level === 6 ? Ee = 2 : Ee = 3, Oe |= Ee << 6, A.strstart !== 0 && (Oe |= It), Oe += 31 - Oe % 31, A.status = Ye, kt(A, Oe), A.strstart !== 0 && (kt(A, f.adler >>> 16), kt(A, f.adler & 65535)), f.adler = 1;
      }
    if (A.status === et)
      if (A.gzhead.extra) {
        for (F = A.pending; A.gzindex < (A.gzhead.extra.length & 65535) && !(A.pending === A.pending_buf_size && (A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), lt(f), F = A.pending, A.pending === A.pending_buf_size)); )
          Le(A, A.gzhead.extra[A.gzindex] & 255), A.gzindex++;
        A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), A.gzindex === A.gzhead.extra.length && (A.gzindex = 0, A.status = Qe);
      } else
        A.status = Qe;
    if (A.status === Qe)
      if (A.gzhead.name) {
        F = A.pending;
        do {
          if (A.pending === A.pending_buf_size && (A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), lt(f), F = A.pending, A.pending === A.pending_buf_size)) {
            Q = 1;
            break;
          }
          A.gzindex < A.gzhead.name.length ? Q = A.gzhead.name.charCodeAt(A.gzindex++) & 255 : Q = 0, Le(A, Q);
        } while (Q !== 0);
        A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), Q === 0 && (A.gzindex = 0, A.status = wt);
      } else
        A.status = wt;
    if (A.status === wt)
      if (A.gzhead.comment) {
        F = A.pending;
        do {
          if (A.pending === A.pending_buf_size && (A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), lt(f), F = A.pending, A.pending === A.pending_buf_size)) {
            Q = 1;
            break;
          }
          A.gzindex < A.gzhead.comment.length ? Q = A.gzhead.comment.charCodeAt(A.gzindex++) & 255 : Q = 0, Le(A, Q);
        } while (Q !== 0);
        A.gzhead.hcrc && A.pending > F && (f.adler = r(f.adler, A.pending_buf, A.pending - F, F)), Q === 0 && (A.status = yt);
      } else
        A.status = yt;
    if (A.status === yt && (A.gzhead.hcrc ? (A.pending + 2 > A.pending_buf_size && lt(f), A.pending + 2 <= A.pending_buf_size && (Le(A, f.adler & 255), Le(A, f.adler >> 8 & 255), f.adler = 0, A.status = Ye)) : A.status = Ye), A.pending !== 0) {
      if (lt(f), f.avail_out === 0)
        return A.last_flush = -1, I;
    } else if (f.avail_in === 0 && gt(te) <= gt(ne) && te !== c)
      return je(f, B);
    if (A.status === ut && f.avail_in !== 0)
      return je(f, B);
    if (f.avail_in !== 0 || A.lookahead !== 0 || te !== a && A.status !== ut) {
      var xe = A.strategy === M ? S(A, te) : A.strategy === Z ? Qt(A, te) : v[A.level].func(A, te);
      if ((xe === Fe || xe === tt) && (A.status = ut), xe === Pe || xe === Fe)
        return f.avail_out === 0 && (A.last_flush = -1), I;
      if (xe === pe && (te === u ? e._tr_align(A) : te !== b && (e._tr_stored_block(A, 0, 0, !1), te === l && (ht(A.head), A.lookahead === 0 && (A.strstart = 0, A.block_start = 0, A.insert = 0))), lt(f), f.avail_out === 0))
        return A.last_flush = -1, I;
    }
    return te !== c ? I : A.wrap <= 0 ? w : (A.wrap === 2 ? (Le(A, f.adler & 255), Le(A, f.adler >> 8 & 255), Le(A, f.adler >> 16 & 255), Le(A, f.adler >> 24 & 255), Le(A, f.total_in & 255), Le(A, f.total_in >> 8 & 255), Le(A, f.total_in >> 16 & 255), Le(A, f.total_in >> 24 & 255)) : (kt(A, f.adler >>> 16), kt(A, f.adler & 65535)), lt(f), A.wrap > 0 && (A.wrap = -A.wrap), A.pending !== 0 ? I : w);
  }
  function ie(f) {
    var te;
    return !f || !f.state ? E : (te = f.state.status, te !== Je && te !== et && te !== Qe && te !== wt && te !== yt && te !== Ye && te !== ut ? je(f, E) : (f.state = null, te === Ye ? je(f, k) : I));
  }
  function Ne(f, te) {
    var ne = te.length, A, F, Q, Oe, Ee, xe, Ze, Cr;
    if (!f || !f.state || (A = f.state, Oe = A.wrap, Oe === 2 || Oe === 1 && A.status !== Je || A.lookahead))
      return E;
    for (Oe === 1 && (f.adler = t(f.adler, te, ne, 0)), A.wrap = 0, ne >= A.w_size && (Oe === 0 && (ht(A.head), A.strstart = 0, A.block_start = 0, A.insert = 0), Cr = new n.Buf8(A.w_size), n.arraySet(Cr, te, ne - A.w_size, A.w_size, 0), te = Cr, ne = A.w_size), Ee = f.avail_in, xe = f.next_in, Ze = f.input, f.avail_in = ne, f.next_in = 0, f.input = te, Xe(A); A.lookahead >= we; ) {
      F = A.strstart, Q = A.lookahead - (we - 1);
      do
        A.ins_h = (A.ins_h << A.hash_shift ^ A.window[F + we - 1]) & A.hash_mask, A.prev[F & A.w_mask] = A.head[A.ins_h], A.head[A.ins_h] = F, F++;
      while (--Q);
      A.strstart = F, A.lookahead = we - 1, Xe(A);
    }
    return A.strstart += A.lookahead, A.block_start = A.strstart, A.insert = A.lookahead, A.lookahead = 0, A.match_length = A.prev_length = we - 1, A.match_available = 0, f.next_in = xe, f.input = Ze, f.avail_in = Ee, A.wrap = Oe, I;
  }
  return Gr.deflateInit = q, Gr.deflateInit2 = D, Gr.deflateReset = L, Gr.deflateResetKeep = T, Gr.deflateSetHeader = le, Gr.deflate = _, Gr.deflateEnd = ie, Gr.deflateSetDictionary = Ne, Gr.deflateInfo = "pako deflate (from Nodeca project)", Gr;
}
var Ri = {}, Dv;
function Ny() {
  if (Dv) return Ri;
  Dv = 1;
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
    var l, c, b, I, w, E = u.length, k = 0;
    for (I = 0; I < E; I++)
      c = u.charCodeAt(I), (c & 64512) === 55296 && I + 1 < E && (b = u.charCodeAt(I + 1), (b & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (b - 56320), I++)), k += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    for (l = new n.Buf8(k), w = 0, I = 0; w < k; I++)
      c = u.charCodeAt(I), (c & 64512) === 55296 && I + 1 < E && (b = u.charCodeAt(I + 1), (b & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (b - 56320), I++)), c < 128 ? l[w++] = c : c < 2048 ? (l[w++] = 192 | c >>> 6, l[w++] = 128 | c & 63) : c < 65536 ? (l[w++] = 224 | c >>> 12, l[w++] = 128 | c >>> 6 & 63, l[w++] = 128 | c & 63) : (l[w++] = 240 | c >>> 18, l[w++] = 128 | c >>> 12 & 63, l[w++] = 128 | c >>> 6 & 63, l[w++] = 128 | c & 63);
    return l;
  };
  function a(u, l) {
    if (l < 65534 && (u.subarray && t || !u.subarray && e))
      return String.fromCharCode.apply(null, n.shrinkBuf(u, l));
    for (var c = "", b = 0; b < l; b++)
      c += String.fromCharCode(u[b]);
    return c;
  }
  return Ri.buf2binstring = function(u) {
    return a(u, u.length);
  }, Ri.binstring2buf = function(u) {
    for (var l = new n.Buf8(u.length), c = 0, b = l.length; c < b; c++)
      l[c] = u.charCodeAt(c);
    return l;
  }, Ri.buf2string = function(u, l) {
    var c, b, I, w, E = l || u.length, k = new Array(E * 2);
    for (b = 0, c = 0; c < E; ) {
      if (I = u[c++], I < 128) {
        k[b++] = I;
        continue;
      }
      if (w = r[I], w > 4) {
        k[b++] = 65533, c += w - 1;
        continue;
      }
      for (I &= w === 2 ? 31 : w === 3 ? 15 : 7; w > 1 && c < E; )
        I = I << 6 | u[c++] & 63, w--;
      if (w > 1) {
        k[b++] = 65533;
        continue;
      }
      I < 65536 ? k[b++] = I : (I -= 65536, k[b++] = 55296 | I >> 10 & 1023, k[b++] = 56320 | I & 1023);
    }
    return a(k, b);
  }, Ri.utf8border = function(u, l) {
    var c;
    for (l = l || u.length, l > u.length && (l = u.length), c = l - 1; c >= 0 && (u[c] & 192) === 128; )
      c--;
    return c < 0 || c === 0 ? l : c + r[u[c]] > l ? c : l;
  }, Ri;
}
var jc, Bv;
function Py() {
  if (Bv) return jc;
  Bv = 1;
  function n() {
    this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
  }
  return jc = n, jc;
}
var Fv;
function ab() {
  if (Fv) return Es;
  Fv = 1;
  var n = sb(), e = _i(), t = Ny(), r = th(), i = Py(), a = Object.prototype.toString, u = 0, l = 4, c = 0, b = 1, I = 2, w = -1, E = 0, k = 8;
  function B(Z) {
    if (!(this instanceof B)) return new B(Z);
    this.options = e.assign({
      level: w,
      method: k,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: E,
      to: ""
    }, Z || {});
    var X = this.options;
    X.raw && X.windowBits > 0 ? X.windowBits = -X.windowBits : X.gzip && X.windowBits > 0 && X.windowBits < 16 && (X.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
    var ue = n.deflateInit2(
      this.strm,
      X.level,
      X.method,
      X.windowBits,
      X.memLevel,
      X.strategy
    );
    if (ue !== c)
      throw new Error(r[ue]);
    if (X.header && n.deflateSetHeader(this.strm, X.header), X.dictionary) {
      var ce;
      if (typeof X.dictionary == "string" ? ce = t.string2buf(X.dictionary) : a.call(X.dictionary) === "[object ArrayBuffer]" ? ce = new Uint8Array(X.dictionary) : ce = X.dictionary, ue = n.deflateSetDictionary(this.strm, ce), ue !== c)
        throw new Error(r[ue]);
      this._dict_set = !0;
    }
  }
  B.prototype.push = function(Z, X) {
    var ue = this.strm, ce = this.options.chunkSize, he, oe;
    if (this.ended)
      return !1;
    oe = X === ~~X ? X : X === !0 ? l : u, typeof Z == "string" ? ue.input = t.string2buf(Z) : a.call(Z) === "[object ArrayBuffer]" ? ue.input = new Uint8Array(Z) : ue.input = Z, ue.next_in = 0, ue.avail_in = ue.input.length;
    do {
      if (ue.avail_out === 0 && (ue.output = new e.Buf8(ce), ue.next_out = 0, ue.avail_out = ce), he = n.deflate(ue, oe), he !== b && he !== c)
        return this.onEnd(he), this.ended = !0, !1;
      (ue.avail_out === 0 || ue.avail_in === 0 && (oe === l || oe === I)) && (this.options.to === "string" ? this.onData(t.buf2binstring(e.shrinkBuf(ue.output, ue.next_out))) : this.onData(e.shrinkBuf(ue.output, ue.next_out)));
    } while ((ue.avail_in > 0 || ue.avail_out === 0) && he !== b);
    return oe === l ? (he = n.deflateEnd(this.strm), this.onEnd(he), this.ended = !0, he === c) : (oe === I && (this.onEnd(c), ue.avail_out = 0), !0);
  }, B.prototype.onData = function(Z) {
    this.chunks.push(Z);
  }, B.prototype.onEnd = function(Z) {
    Z === c && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = e.flattenChunks(this.chunks)), this.chunks = [], this.err = Z, this.msg = this.strm.msg;
  };
  function K(Z, X) {
    var ue = new B(X);
    if (ue.push(Z, !0), ue.err)
      throw ue.msg || r[ue.err];
    return ue.result;
  }
  function C(Z, X) {
    return X = X || {}, X.raw = !0, K(Z, X);
  }
  function M(Z, X) {
    return X = X || {}, X.gzip = !0, K(Z, X);
  }
  return Es.Deflate = B, Es.deflate = K, Es.deflateRaw = C, Es.gzip = M, Es;
}
var Ss = {}, Mr = {}, Kc, Lv;
function ob() {
  if (Lv) return Kc;
  Lv = 1;
  var n = 30, e = 12;
  return Kc = function(r, i) {
    var a, u, l, c, b, I, w, E, k, B, K, C, M, Z, X, ue, ce, he, oe, ke, De, Ce, $e, Be, Ae;
    a = r.state, u = r.next_in, Be = r.input, l = u + (r.avail_in - 5), c = r.next_out, Ae = r.output, b = c - (i - r.avail_out), I = c + (r.avail_out - 257), w = a.dmax, E = a.wsize, k = a.whave, B = a.wnext, K = a.window, C = a.hold, M = a.bits, Z = a.lencode, X = a.distcode, ue = (1 << a.lenbits) - 1, ce = (1 << a.distbits) - 1;
    e:
      do {
        M < 15 && (C += Be[u++] << M, M += 8, C += Be[u++] << M, M += 8), he = Z[C & ue];
        t:
          for (; ; ) {
            if (oe = he >>> 24, C >>>= oe, M -= oe, oe = he >>> 16 & 255, oe === 0)
              Ae[c++] = he & 65535;
            else if (oe & 16) {
              ke = he & 65535, oe &= 15, oe && (M < oe && (C += Be[u++] << M, M += 8), ke += C & (1 << oe) - 1, C >>>= oe, M -= oe), M < 15 && (C += Be[u++] << M, M += 8, C += Be[u++] << M, M += 8), he = X[C & ce];
              r:
                for (; ; ) {
                  if (oe = he >>> 24, C >>>= oe, M -= oe, oe = he >>> 16 & 255, oe & 16) {
                    if (De = he & 65535, oe &= 15, M < oe && (C += Be[u++] << M, M += 8, M < oe && (C += Be[u++] << M, M += 8)), De += C & (1 << oe) - 1, De > w) {
                      r.msg = "invalid distance too far back", a.mode = n;
                      break e;
                    }
                    if (C >>>= oe, M -= oe, oe = c - b, De > oe) {
                      if (oe = De - oe, oe > k && a.sane) {
                        r.msg = "invalid distance too far back", a.mode = n;
                        break e;
                      }
                      if (Ce = 0, $e = K, B === 0) {
                        if (Ce += E - oe, oe < ke) {
                          ke -= oe;
                          do
                            Ae[c++] = K[Ce++];
                          while (--oe);
                          Ce = c - De, $e = Ae;
                        }
                      } else if (B < oe) {
                        if (Ce += E + B - oe, oe -= B, oe < ke) {
                          ke -= oe;
                          do
                            Ae[c++] = K[Ce++];
                          while (--oe);
                          if (Ce = 0, B < ke) {
                            oe = B, ke -= oe;
                            do
                              Ae[c++] = K[Ce++];
                            while (--oe);
                            Ce = c - De, $e = Ae;
                          }
                        }
                      } else if (Ce += B - oe, oe < ke) {
                        ke -= oe;
                        do
                          Ae[c++] = K[Ce++];
                        while (--oe);
                        Ce = c - De, $e = Ae;
                      }
                      for (; ke > 2; )
                        Ae[c++] = $e[Ce++], Ae[c++] = $e[Ce++], Ae[c++] = $e[Ce++], ke -= 3;
                      ke && (Ae[c++] = $e[Ce++], ke > 1 && (Ae[c++] = $e[Ce++]));
                    } else {
                      Ce = c - De;
                      do
                        Ae[c++] = Ae[Ce++], Ae[c++] = Ae[Ce++], Ae[c++] = Ae[Ce++], ke -= 3;
                      while (ke > 2);
                      ke && (Ae[c++] = Ae[Ce++], ke > 1 && (Ae[c++] = Ae[Ce++]));
                    }
                  } else if ((oe & 64) === 0) {
                    he = X[(he & 65535) + (C & (1 << oe) - 1)];
                    continue r;
                  } else {
                    r.msg = "invalid distance code", a.mode = n;
                    break e;
                  }
                  break;
                }
            } else if ((oe & 64) === 0) {
              he = Z[(he & 65535) + (C & (1 << oe) - 1)];
              continue t;
            } else if (oe & 32) {
              a.mode = e;
              break e;
            } else {
              r.msg = "invalid literal/length code", a.mode = n;
              break e;
            }
            break;
          }
      } while (u < l && c < I);
    ke = M >> 3, u -= ke, M -= ke << 3, C &= (1 << M) - 1, r.next_in = u, r.next_out = c, r.avail_in = u < l ? 5 + (l - u) : 5 - (u - l), r.avail_out = c < I ? 257 + (I - c) : 257 - (c - I), a.hold = C, a.bits = M;
  }, Kc;
}
var zc, qv;
function ub() {
  if (qv) return zc;
  qv = 1;
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
  ], I = [
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
  return zc = function(E, k, B, K, C, M, Z, X) {
    var ue = X.bits, ce = 0, he = 0, oe = 0, ke = 0, De = 0, Ce = 0, $e = 0, Be = 0, Ae = 0, Ue = 0, st, vt, we, We, ze, It = null, Je = 0, et, Qe = new n.Buf16(e + 1), wt = new n.Buf16(e + 1), yt = null, Ye = 0, ut, Pe, pe;
    for (ce = 0; ce <= e; ce++)
      Qe[ce] = 0;
    for (he = 0; he < K; he++)
      Qe[k[B + he]]++;
    for (De = ue, ke = e; ke >= 1 && Qe[ke] === 0; ke--)
      ;
    if (De > ke && (De = ke), ke === 0)
      return C[M++] = 1 << 24 | 64 << 16 | 0, C[M++] = 1 << 24 | 64 << 16 | 0, X.bits = 1, 0;
    for (oe = 1; oe < ke && Qe[oe] === 0; oe++)
      ;
    for (De < oe && (De = oe), Be = 1, ce = 1; ce <= e; ce++)
      if (Be <<= 1, Be -= Qe[ce], Be < 0)
        return -1;
    if (Be > 0 && (E === i || ke !== 1))
      return -1;
    for (wt[1] = 0, ce = 1; ce < e; ce++)
      wt[ce + 1] = wt[ce] + Qe[ce];
    for (he = 0; he < K; he++)
      k[B + he] !== 0 && (Z[wt[k[B + he]]++] = he);
    if (E === i ? (It = yt = Z, et = 19) : E === a ? (It = l, Je -= 257, yt = c, Ye -= 257, et = 256) : (It = b, yt = I, et = -1), Ue = 0, he = 0, ce = oe, ze = M, Ce = De, $e = 0, we = -1, Ae = 1 << De, We = Ae - 1, E === a && Ae > t || E === u && Ae > r)
      return 1;
    for (; ; ) {
      ut = ce - $e, Z[he] < et ? (Pe = 0, pe = Z[he]) : Z[he] > et ? (Pe = yt[Ye + Z[he]], pe = It[Je + Z[he]]) : (Pe = 96, pe = 0), st = 1 << ce - $e, vt = 1 << Ce, oe = vt;
      do
        vt -= st, C[ze + (Ue >> $e) + vt] = ut << 24 | Pe << 16 | pe | 0;
      while (vt !== 0);
      for (st = 1 << ce - 1; Ue & st; )
        st >>= 1;
      if (st !== 0 ? (Ue &= st - 1, Ue += st) : Ue = 0, he++, --Qe[ce] === 0) {
        if (ce === ke)
          break;
        ce = k[B + Z[he]];
      }
      if (ce > De && (Ue & We) !== we) {
        for ($e === 0 && ($e = De), ze += oe, Ce = ce - $e, Be = 1 << Ce; Ce + $e < ke && (Be -= Qe[Ce + $e], !(Be <= 0)); )
          Ce++, Be <<= 1;
        if (Ae += 1 << Ce, E === a && Ae > t || E === u && Ae > r)
          return 1;
        we = Ue & We, C[we] = De << 24 | Ce << 16 | ze - M | 0;
      }
    }
    return Ue !== 0 && (C[ze + Ue] = ce - $e << 24 | 64 << 16 | 0), X.bits = De, 0;
  }, zc;
}
var Mv;
function lb() {
  if (Mv) return Mr;
  Mv = 1;
  var n = _i(), e = Ty(), t = Cy(), r = ob(), i = ub(), a = 0, u = 1, l = 2, c = 4, b = 5, I = 6, w = 0, E = 1, k = 2, B = -2, K = -3, C = -4, M = -5, Z = 8, X = 1, ue = 2, ce = 3, he = 4, oe = 5, ke = 6, De = 7, Ce = 8, $e = 9, Be = 10, Ae = 11, Ue = 12, st = 13, vt = 14, we = 15, We = 16, ze = 17, It = 18, Je = 19, et = 20, Qe = 21, wt = 22, yt = 23, Ye = 24, ut = 25, Pe = 26, pe = 27, Fe = 28, tt = 29, me = 30, je = 31, gt = 32, ht = 852, lt = 592, it = 15, Le = it;
  function kt(D) {
    return (D >>> 24 & 255) + (D >>> 8 & 65280) + ((D & 65280) << 8) + ((D & 255) << 24);
  }
  function Ot() {
    this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
  }
  function qe(D) {
    var q;
    return !D || !D.state ? B : (q = D.state, D.total_in = D.total_out = q.total = 0, D.msg = "", q.wrap && (D.adler = q.wrap & 1), q.mode = X, q.last = 0, q.havedict = 0, q.dmax = 32768, q.head = null, q.hold = 0, q.bits = 0, q.lencode = q.lendyn = new n.Buf32(ht), q.distcode = q.distdyn = new n.Buf32(lt), q.sane = 1, q.back = -1, w);
  }
  function Xe(D) {
    var q;
    return !D || !D.state ? B : (q = D.state, q.wsize = 0, q.whave = 0, q.wnext = 0, qe(D));
  }
  function Et(D, q) {
    var _, ie;
    return !D || !D.state || (ie = D.state, q < 0 ? (_ = 0, q = -q) : (_ = (q >> 4) + 1, q < 48 && (q &= 15)), q && (q < 8 || q > 15)) ? B : (ie.window !== null && ie.wbits !== q && (ie.window = null), ie.wrap = _, ie.wbits = q, Xe(D));
  }
  function Lt(D, q) {
    var _, ie;
    return D ? (ie = new Ot(), D.state = ie, ie.window = null, _ = Et(D, q), _ !== w && (D.state = null), _) : B;
  }
  function _t(D) {
    return Lt(D, Le);
  }
  var Qt = !0, S, d;
  function v(D) {
    if (Qt) {
      var q;
      for (S = new n.Buf32(512), d = new n.Buf32(32), q = 0; q < 144; )
        D.lens[q++] = 8;
      for (; q < 256; )
        D.lens[q++] = 9;
      for (; q < 280; )
        D.lens[q++] = 7;
      for (; q < 288; )
        D.lens[q++] = 8;
      for (i(u, D.lens, 0, 288, S, 0, D.work, { bits: 9 }), q = 0; q < 32; )
        D.lens[q++] = 5;
      i(l, D.lens, 0, 32, d, 0, D.work, { bits: 5 }), Qt = !1;
    }
    D.lencode = S, D.lenbits = 9, D.distcode = d, D.distbits = 5;
  }
  function O(D, q, _, ie) {
    var Ne, f = D.state;
    return f.window === null && (f.wsize = 1 << f.wbits, f.wnext = 0, f.whave = 0, f.window = new n.Buf8(f.wsize)), ie >= f.wsize ? (n.arraySet(f.window, q, _ - f.wsize, f.wsize, 0), f.wnext = 0, f.whave = f.wsize) : (Ne = f.wsize - f.wnext, Ne > ie && (Ne = ie), n.arraySet(f.window, q, _ - ie, Ne, f.wnext), ie -= Ne, ie ? (n.arraySet(f.window, q, _ - ie, ie, 0), f.wnext = ie, f.whave = f.wsize) : (f.wnext += Ne, f.wnext === f.wsize && (f.wnext = 0), f.whave < f.wsize && (f.whave += Ne))), 0;
  }
  function g(D, q) {
    var _, ie, Ne, f, te, ne, A, F, Q, Oe, Ee, xe, Ze, Cr, bt = 0, Te, rt, $t, Mt, gn, mn, Rt, Pt, St = new n.Buf8(4), jt, hr, Qa = (
      /* permutation of code lengths */
      [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    );
    if (!D || !D.state || !D.output || !D.input && D.avail_in !== 0)
      return B;
    _ = D.state, _.mode === Ue && (_.mode = st), te = D.next_out, Ne = D.output, A = D.avail_out, f = D.next_in, ie = D.input, ne = D.avail_in, F = _.hold, Q = _.bits, Oe = ne, Ee = A, Pt = w;
    e:
      for (; ; )
        switch (_.mode) {
          case X:
            if (_.wrap === 0) {
              _.mode = st;
              break;
            }
            for (; Q < 16; ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            if (_.wrap & 2 && F === 35615) {
              _.check = 0, St[0] = F & 255, St[1] = F >>> 8 & 255, _.check = t(_.check, St, 2, 0), F = 0, Q = 0, _.mode = ue;
              break;
            }
            if (_.flags = 0, _.head && (_.head.done = !1), !(_.wrap & 1) || /* check if zlib header allowed */
            (((F & 255) << 8) + (F >> 8)) % 31) {
              D.msg = "incorrect header check", _.mode = me;
              break;
            }
            if ((F & 15) !== Z) {
              D.msg = "unknown compression method", _.mode = me;
              break;
            }
            if (F >>>= 4, Q -= 4, Rt = (F & 15) + 8, _.wbits === 0)
              _.wbits = Rt;
            else if (Rt > _.wbits) {
              D.msg = "invalid window size", _.mode = me;
              break;
            }
            _.dmax = 1 << Rt, D.adler = _.check = 1, _.mode = F & 512 ? Be : Ue, F = 0, Q = 0;
            break;
          case ue:
            for (; Q < 16; ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            if (_.flags = F, (_.flags & 255) !== Z) {
              D.msg = "unknown compression method", _.mode = me;
              break;
            }
            if (_.flags & 57344) {
              D.msg = "unknown header flags set", _.mode = me;
              break;
            }
            _.head && (_.head.text = F >> 8 & 1), _.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, _.check = t(_.check, St, 2, 0)), F = 0, Q = 0, _.mode = ce;
          /* falls through */
          case ce:
            for (; Q < 32; ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            _.head && (_.head.time = F), _.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, St[2] = F >>> 16 & 255, St[3] = F >>> 24 & 255, _.check = t(_.check, St, 4, 0)), F = 0, Q = 0, _.mode = he;
          /* falls through */
          case he:
            for (; Q < 16; ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            _.head && (_.head.xflags = F & 255, _.head.os = F >> 8), _.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, _.check = t(_.check, St, 2, 0)), F = 0, Q = 0, _.mode = oe;
          /* falls through */
          case oe:
            if (_.flags & 1024) {
              for (; Q < 16; ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              _.length = F, _.head && (_.head.extra_len = F), _.flags & 512 && (St[0] = F & 255, St[1] = F >>> 8 & 255, _.check = t(_.check, St, 2, 0)), F = 0, Q = 0;
            } else _.head && (_.head.extra = null);
            _.mode = ke;
          /* falls through */
          case ke:
            if (_.flags & 1024 && (xe = _.length, xe > ne && (xe = ne), xe && (_.head && (Rt = _.head.extra_len - _.length, _.head.extra || (_.head.extra = new Array(_.head.extra_len)), n.arraySet(
              _.head.extra,
              ie,
              f,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              xe,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              Rt
            )), _.flags & 512 && (_.check = t(_.check, ie, xe, f)), ne -= xe, f += xe, _.length -= xe), _.length))
              break e;
            _.length = 0, _.mode = De;
          /* falls through */
          case De:
            if (_.flags & 2048) {
              if (ne === 0)
                break e;
              xe = 0;
              do
                Rt = ie[f + xe++], _.head && Rt && _.length < 65536 && (_.head.name += String.fromCharCode(Rt));
              while (Rt && xe < ne);
              if (_.flags & 512 && (_.check = t(_.check, ie, xe, f)), ne -= xe, f += xe, Rt)
                break e;
            } else _.head && (_.head.name = null);
            _.length = 0, _.mode = Ce;
          /* falls through */
          case Ce:
            if (_.flags & 4096) {
              if (ne === 0)
                break e;
              xe = 0;
              do
                Rt = ie[f + xe++], _.head && Rt && _.length < 65536 && (_.head.comment += String.fromCharCode(Rt));
              while (Rt && xe < ne);
              if (_.flags & 512 && (_.check = t(_.check, ie, xe, f)), ne -= xe, f += xe, Rt)
                break e;
            } else _.head && (_.head.comment = null);
            _.mode = $e;
          /* falls through */
          case $e:
            if (_.flags & 512) {
              for (; Q < 16; ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              if (F !== (_.check & 65535)) {
                D.msg = "header crc mismatch", _.mode = me;
                break;
              }
              F = 0, Q = 0;
            }
            _.head && (_.head.hcrc = _.flags >> 9 & 1, _.head.done = !0), D.adler = _.check = 0, _.mode = Ue;
            break;
          case Be:
            for (; Q < 32; ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            D.adler = _.check = kt(F), F = 0, Q = 0, _.mode = Ae;
          /* falls through */
          case Ae:
            if (_.havedict === 0)
              return D.next_out = te, D.avail_out = A, D.next_in = f, D.avail_in = ne, _.hold = F, _.bits = Q, k;
            D.adler = _.check = 1, _.mode = Ue;
          /* falls through */
          case Ue:
            if (q === b || q === I)
              break e;
          /* falls through */
          case st:
            if (_.last) {
              F >>>= Q & 7, Q -= Q & 7, _.mode = pe;
              break;
            }
            for (; Q < 3; ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            switch (_.last = F & 1, F >>>= 1, Q -= 1, F & 3) {
              case 0:
                _.mode = vt;
                break;
              case 1:
                if (v(_), _.mode = et, q === I) {
                  F >>>= 2, Q -= 2;
                  break e;
                }
                break;
              case 2:
                _.mode = ze;
                break;
              case 3:
                D.msg = "invalid block type", _.mode = me;
            }
            F >>>= 2, Q -= 2;
            break;
          case vt:
            for (F >>>= Q & 7, Q -= Q & 7; Q < 32; ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            if ((F & 65535) !== (F >>> 16 ^ 65535)) {
              D.msg = "invalid stored block lengths", _.mode = me;
              break;
            }
            if (_.length = F & 65535, F = 0, Q = 0, _.mode = we, q === I)
              break e;
          /* falls through */
          case we:
            _.mode = We;
          /* falls through */
          case We:
            if (xe = _.length, xe) {
              if (xe > ne && (xe = ne), xe > A && (xe = A), xe === 0)
                break e;
              n.arraySet(Ne, ie, f, xe, te), ne -= xe, f += xe, A -= xe, te += xe, _.length -= xe;
              break;
            }
            _.mode = Ue;
            break;
          case ze:
            for (; Q < 14; ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            if (_.nlen = (F & 31) + 257, F >>>= 5, Q -= 5, _.ndist = (F & 31) + 1, F >>>= 5, Q -= 5, _.ncode = (F & 15) + 4, F >>>= 4, Q -= 4, _.nlen > 286 || _.ndist > 30) {
              D.msg = "too many length or distance symbols", _.mode = me;
              break;
            }
            _.have = 0, _.mode = It;
          /* falls through */
          case It:
            for (; _.have < _.ncode; ) {
              for (; Q < 3; ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              _.lens[Qa[_.have++]] = F & 7, F >>>= 3, Q -= 3;
            }
            for (; _.have < 19; )
              _.lens[Qa[_.have++]] = 0;
            if (_.lencode = _.lendyn, _.lenbits = 7, jt = { bits: _.lenbits }, Pt = i(a, _.lens, 0, 19, _.lencode, 0, _.work, jt), _.lenbits = jt.bits, Pt) {
              D.msg = "invalid code lengths set", _.mode = me;
              break;
            }
            _.have = 0, _.mode = Je;
          /* falls through */
          case Je:
            for (; _.have < _.nlen + _.ndist; ) {
              for (; bt = _.lencode[F & (1 << _.lenbits) - 1], Te = bt >>> 24, rt = bt >>> 16 & 255, $t = bt & 65535, !(Te <= Q); ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              if ($t < 16)
                F >>>= Te, Q -= Te, _.lens[_.have++] = $t;
              else {
                if ($t === 16) {
                  for (hr = Te + 2; Q < hr; ) {
                    if (ne === 0)
                      break e;
                    ne--, F += ie[f++] << Q, Q += 8;
                  }
                  if (F >>>= Te, Q -= Te, _.have === 0) {
                    D.msg = "invalid bit length repeat", _.mode = me;
                    break;
                  }
                  Rt = _.lens[_.have - 1], xe = 3 + (F & 3), F >>>= 2, Q -= 2;
                } else if ($t === 17) {
                  for (hr = Te + 3; Q < hr; ) {
                    if (ne === 0)
                      break e;
                    ne--, F += ie[f++] << Q, Q += 8;
                  }
                  F >>>= Te, Q -= Te, Rt = 0, xe = 3 + (F & 7), F >>>= 3, Q -= 3;
                } else {
                  for (hr = Te + 7; Q < hr; ) {
                    if (ne === 0)
                      break e;
                    ne--, F += ie[f++] << Q, Q += 8;
                  }
                  F >>>= Te, Q -= Te, Rt = 0, xe = 11 + (F & 127), F >>>= 7, Q -= 7;
                }
                if (_.have + xe > _.nlen + _.ndist) {
                  D.msg = "invalid bit length repeat", _.mode = me;
                  break;
                }
                for (; xe--; )
                  _.lens[_.have++] = Rt;
              }
            }
            if (_.mode === me)
              break;
            if (_.lens[256] === 0) {
              D.msg = "invalid code -- missing end-of-block", _.mode = me;
              break;
            }
            if (_.lenbits = 9, jt = { bits: _.lenbits }, Pt = i(u, _.lens, 0, _.nlen, _.lencode, 0, _.work, jt), _.lenbits = jt.bits, Pt) {
              D.msg = "invalid literal/lengths set", _.mode = me;
              break;
            }
            if (_.distbits = 6, _.distcode = _.distdyn, jt = { bits: _.distbits }, Pt = i(l, _.lens, _.nlen, _.ndist, _.distcode, 0, _.work, jt), _.distbits = jt.bits, Pt) {
              D.msg = "invalid distances set", _.mode = me;
              break;
            }
            if (_.mode = et, q === I)
              break e;
          /* falls through */
          case et:
            _.mode = Qe;
          /* falls through */
          case Qe:
            if (ne >= 6 && A >= 258) {
              D.next_out = te, D.avail_out = A, D.next_in = f, D.avail_in = ne, _.hold = F, _.bits = Q, r(D, Ee), te = D.next_out, Ne = D.output, A = D.avail_out, f = D.next_in, ie = D.input, ne = D.avail_in, F = _.hold, Q = _.bits, _.mode === Ue && (_.back = -1);
              break;
            }
            for (_.back = 0; bt = _.lencode[F & (1 << _.lenbits) - 1], Te = bt >>> 24, rt = bt >>> 16 & 255, $t = bt & 65535, !(Te <= Q); ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            if (rt && (rt & 240) === 0) {
              for (Mt = Te, gn = rt, mn = $t; bt = _.lencode[mn + ((F & (1 << Mt + gn) - 1) >> Mt)], Te = bt >>> 24, rt = bt >>> 16 & 255, $t = bt & 65535, !(Mt + Te <= Q); ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              F >>>= Mt, Q -= Mt, _.back += Mt;
            }
            if (F >>>= Te, Q -= Te, _.back += Te, _.length = $t, rt === 0) {
              _.mode = Pe;
              break;
            }
            if (rt & 32) {
              _.back = -1, _.mode = Ue;
              break;
            }
            if (rt & 64) {
              D.msg = "invalid literal/length code", _.mode = me;
              break;
            }
            _.extra = rt & 15, _.mode = wt;
          /* falls through */
          case wt:
            if (_.extra) {
              for (hr = _.extra; Q < hr; ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              _.length += F & (1 << _.extra) - 1, F >>>= _.extra, Q -= _.extra, _.back += _.extra;
            }
            _.was = _.length, _.mode = yt;
          /* falls through */
          case yt:
            for (; bt = _.distcode[F & (1 << _.distbits) - 1], Te = bt >>> 24, rt = bt >>> 16 & 255, $t = bt & 65535, !(Te <= Q); ) {
              if (ne === 0)
                break e;
              ne--, F += ie[f++] << Q, Q += 8;
            }
            if ((rt & 240) === 0) {
              for (Mt = Te, gn = rt, mn = $t; bt = _.distcode[mn + ((F & (1 << Mt + gn) - 1) >> Mt)], Te = bt >>> 24, rt = bt >>> 16 & 255, $t = bt & 65535, !(Mt + Te <= Q); ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              F >>>= Mt, Q -= Mt, _.back += Mt;
            }
            if (F >>>= Te, Q -= Te, _.back += Te, rt & 64) {
              D.msg = "invalid distance code", _.mode = me;
              break;
            }
            _.offset = $t, _.extra = rt & 15, _.mode = Ye;
          /* falls through */
          case Ye:
            if (_.extra) {
              for (hr = _.extra; Q < hr; ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              _.offset += F & (1 << _.extra) - 1, F >>>= _.extra, Q -= _.extra, _.back += _.extra;
            }
            if (_.offset > _.dmax) {
              D.msg = "invalid distance too far back", _.mode = me;
              break;
            }
            _.mode = ut;
          /* falls through */
          case ut:
            if (A === 0)
              break e;
            if (xe = Ee - A, _.offset > xe) {
              if (xe = _.offset - xe, xe > _.whave && _.sane) {
                D.msg = "invalid distance too far back", _.mode = me;
                break;
              }
              xe > _.wnext ? (xe -= _.wnext, Ze = _.wsize - xe) : Ze = _.wnext - xe, xe > _.length && (xe = _.length), Cr = _.window;
            } else
              Cr = Ne, Ze = te - _.offset, xe = _.length;
            xe > A && (xe = A), A -= xe, _.length -= xe;
            do
              Ne[te++] = Cr[Ze++];
            while (--xe);
            _.length === 0 && (_.mode = Qe);
            break;
          case Pe:
            if (A === 0)
              break e;
            Ne[te++] = _.length, A--, _.mode = Qe;
            break;
          case pe:
            if (_.wrap) {
              for (; Q < 32; ) {
                if (ne === 0)
                  break e;
                ne--, F |= ie[f++] << Q, Q += 8;
              }
              if (Ee -= A, D.total_out += Ee, _.total += Ee, Ee && (D.adler = _.check = /*UPDATE(state.check, put - _out, _out);*/
              _.flags ? t(_.check, Ne, Ee, te - Ee) : e(_.check, Ne, Ee, te - Ee)), Ee = A, (_.flags ? F : kt(F)) !== _.check) {
                D.msg = "incorrect data check", _.mode = me;
                break;
              }
              F = 0, Q = 0;
            }
            _.mode = Fe;
          /* falls through */
          case Fe:
            if (_.wrap && _.flags) {
              for (; Q < 32; ) {
                if (ne === 0)
                  break e;
                ne--, F += ie[f++] << Q, Q += 8;
              }
              if (F !== (_.total & 4294967295)) {
                D.msg = "incorrect length check", _.mode = me;
                break;
              }
              F = 0, Q = 0;
            }
            _.mode = tt;
          /* falls through */
          case tt:
            Pt = E;
            break e;
          case me:
            Pt = K;
            break e;
          case je:
            return C;
          case gt:
          /* falls through */
          default:
            return B;
        }
    return D.next_out = te, D.avail_out = A, D.next_in = f, D.avail_in = ne, _.hold = F, _.bits = Q, (_.wsize || Ee !== D.avail_out && _.mode < me && (_.mode < pe || q !== c)) && O(D, D.output, D.next_out, Ee - D.avail_out), Oe -= D.avail_in, Ee -= D.avail_out, D.total_in += Oe, D.total_out += Ee, _.total += Ee, _.wrap && Ee && (D.adler = _.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    _.flags ? t(_.check, Ne, Ee, D.next_out - Ee) : e(_.check, Ne, Ee, D.next_out - Ee)), D.data_type = _.bits + (_.last ? 64 : 0) + (_.mode === Ue ? 128 : 0) + (_.mode === et || _.mode === we ? 256 : 0), (Oe === 0 && Ee === 0 || q === c) && Pt === w && (Pt = M), Pt;
  }
  function T(D) {
    if (!D || !D.state)
      return B;
    var q = D.state;
    return q.window && (q.window = null), D.state = null, w;
  }
  function L(D, q) {
    var _;
    return !D || !D.state || (_ = D.state, (_.wrap & 2) === 0) ? B : (_.head = q, q.done = !1, w);
  }
  function le(D, q) {
    var _ = q.length, ie, Ne, f;
    return !D || !D.state || (ie = D.state, ie.wrap !== 0 && ie.mode !== Ae) ? B : ie.mode === Ae && (Ne = 1, Ne = e(Ne, q, _, 0), Ne !== ie.check) ? K : (f = O(D, q, _, _), f ? (ie.mode = je, C) : (ie.havedict = 1, w));
  }
  return Mr.inflateReset = Xe, Mr.inflateReset2 = Et, Mr.inflateResetKeep = qe, Mr.inflateInit = _t, Mr.inflateInit2 = Lt, Mr.inflate = g, Mr.inflateEnd = T, Mr.inflateGetHeader = L, Mr.inflateSetDictionary = le, Mr.inflateInfo = "pako inflate (from Nodeca project)", Mr;
}
var Gc, Uv;
function Dy() {
  return Uv || (Uv = 1, Gc = {
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
var Hc, $v;
function cb() {
  if ($v) return Hc;
  $v = 1;
  function n() {
    this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
  }
  return Hc = n, Hc;
}
var jv;
function fb() {
  if (jv) return Ss;
  jv = 1;
  var n = lb(), e = _i(), t = Ny(), r = Dy(), i = th(), a = Py(), u = cb(), l = Object.prototype.toString;
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
    var k = this.strm, B = this.options.chunkSize, K = this.options.dictionary, C, M, Z, X, ue, ce = !1;
    if (this.ended)
      return !1;
    M = E === ~~E ? E : E === !0 ? r.Z_FINISH : r.Z_NO_FLUSH, typeof w == "string" ? k.input = t.binstring2buf(w) : l.call(w) === "[object ArrayBuffer]" ? k.input = new Uint8Array(w) : k.input = w, k.next_in = 0, k.avail_in = k.input.length;
    do {
      if (k.avail_out === 0 && (k.output = new e.Buf8(B), k.next_out = 0, k.avail_out = B), C = n.inflate(k, r.Z_NO_FLUSH), C === r.Z_NEED_DICT && K && (C = n.inflateSetDictionary(this.strm, K)), C === r.Z_BUF_ERROR && ce === !0 && (C = r.Z_OK, ce = !1), C !== r.Z_STREAM_END && C !== r.Z_OK)
        return this.onEnd(C), this.ended = !0, !1;
      k.next_out && (k.avail_out === 0 || C === r.Z_STREAM_END || k.avail_in === 0 && (M === r.Z_FINISH || M === r.Z_SYNC_FLUSH)) && (this.options.to === "string" ? (Z = t.utf8border(k.output, k.next_out), X = k.next_out - Z, ue = t.buf2string(k.output, Z), k.next_out = X, k.avail_out = B - X, X && e.arraySet(k.output, k.output, Z, X, 0), this.onData(ue)) : this.onData(e.shrinkBuf(k.output, k.next_out))), k.avail_in === 0 && k.avail_out === 0 && (ce = !0);
    } while ((k.avail_in > 0 || k.avail_out === 0) && C !== r.Z_STREAM_END);
    return C === r.Z_STREAM_END && (M = r.Z_FINISH), M === r.Z_FINISH ? (C = n.inflateEnd(this.strm), this.onEnd(C), this.ended = !0, C === r.Z_OK) : (M === r.Z_SYNC_FLUSH && (this.onEnd(r.Z_OK), k.avail_out = 0), !0);
  }, c.prototype.onData = function(w) {
    this.chunks.push(w);
  }, c.prototype.onEnd = function(w) {
    w === r.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = e.flattenChunks(this.chunks)), this.chunks = [], this.err = w, this.msg = this.strm.msg;
  };
  function b(w, E) {
    var k = new c(E);
    if (k.push(w, !0), k.err)
      throw k.msg || i[k.err];
    return k.result;
  }
  function I(w, E) {
    return E = E || {}, E.raw = !0, b(w, E);
  }
  return Ss.Inflate = c, Ss.inflate = b, Ss.inflateRaw = I, Ss.ungzip = b, Ss;
}
var Wc, Kv;
function hb() {
  if (Kv) return Wc;
  Kv = 1;
  var n = _i().assign, e = ab(), t = fb(), r = Dy(), i = {};
  return n(i, e, t, r), Wc = i, Wc;
}
var pb = hb();
const db = /* @__PURE__ */ bf(pb), rh = xy([Ay, "blip"]), zv = 15, vb = 50 * 1024, yb = 128e3, df = {
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
var Gs;
class Gv {
  constructor() {
    ee(this, Gs, tb());
  }
  add(e) {
    return G(this, Gs, rb(p(this, Gs), e)), this.value;
  }
  get value() {
    return nb(p(this, Gs));
  }
}
Gs = new WeakMap();
var si;
class gb {
  constructor() {
    ee(this, si);
    G(this, si, new db.Inflate({ raw: !0, windowBits: 15 })), p(this, si).onEnd = (e) => {
      if (e !== 0)
        throw Error(`Inflate error ${e}`);
    };
  }
  decompress(e, t) {
    p(this, si).onData = t, p(this, si).push(e), p(this, si).push(vf, 2);
  }
}
si = new WeakMap();
class mb {
  constructor(e, t, r = "throw") {
    this.resolve = e, this.reject = t, this.mode = r;
  }
}
class By {
  constructor(e, t) {
    de(this, "logger", rh);
    de(this, "flags");
    de(this, "msgNo");
    de(this, "promiseKeeper");
    if (this.flags = e, this.promiseKeeper = t, e & fs.Compressed)
      throw Error("Sending compressed messages is unimplemented!");
  }
  get type() {
    return this.flags & vn.TypeMask;
  }
}
var Wi, un, Hs, mf;
class Ib extends By {
  /** Constructor takes a Message object to send. */
  constructor(t, r) {
    super(t.flags | vn.MoreComing, r);
    ee(this, Wi);
    ee(this, un, 0);
    ee(this, Hs, 0);
    ee(this, mf);
    t.isReply ? (Me(t.hasNumber, "Outgoing reply must have a number"), this.msgNo = t.number) : Me(!t.hasNumber, "Outgoing request must not have a number yet"), G(this, Wi, t.encodeBinary()), G(this, un, 0);
  }
  /** Returns the next frame to send, as a {@link Uint8Array}. */
  nextFrame(t) {
    const r = p(this, Wi).length - p(this, un);
    Me(r > 0);
    const i = Math.min(r, df.MaxFrameSize - zv), a = i + zv, u = new ArrayBuffer(a), l = new Uint8Array(u);
    let c = Ts(l, 0, this.msgNo);
    i === r && (this.flags &= ~vn.MoreComing), c = Ts(l, c, this.flags);
    const b = p(this, Wi).slice(p(this, un), p(this, un) + i);
    l.set(b, c), G(this, un, p(this, un) + i), G(this, Hs, p(this, Hs) + i), c += i;
    const I = t.add(b);
    return new DataView(l.buffer, l.byteOffset).setUint32(c, I), c += 4, l.subarray(0, c);
  }
  receivedACK(t) {
    G(this, Hs, Math.max(0, p(this, un) - t));
  }
  /** Becomes true when the message has been completely sent. */
  get needsACK() {
    return p(this, Hs) > yb;
  }
  /** Becomes true when the message has been completely sent. */
  get finished() {
    return p(this, un) >= p(this, Wi).length;
  }
}
Wi = new WeakMap(), un = new WeakMap(), Hs = new WeakMap(), mf = new WeakMap();
var Ua;
class bb extends By {
  constructor(t, r, i, a) {
    const u = t ? Dr.ACKRPY : Dr.ACKMSG;
    super(u | fs.Urgent | fs.NoReply, null);
    ee(this, Ua);
    this.msgNo = r, G(this, Ua, i), this.logger = a;
  }
  nextFrame(t) {
    const r = new ArrayBuffer(10), i = new Uint8Array(r);
    let a = Ts(i, 0, this.msgNo);
    return a = Ts(i, a, this.flags), a = Ts(i, a, p(this, Ua)), i.subarray(0, a);
  }
  get needsACK() {
    return !1;
  }
  get finished() {
    return !0;
  }
}
Ua = new WeakMap();
var $a, Ws, Sn, ja, Ys;
class Hv {
  constructor(e, t) {
    de(this, "promiseKeeper");
    ee(this, $a);
    ee(this, Ws);
    ee(this, Sn);
    ee(this, ja, 0);
    ee(this, Ys, 0);
    G(this, $a, e), this.promiseKeeper = t;
  }
  /** Reads the next frame of the message.
   *  Returns a {@link Message} object when it's complete, else null. */
  addFrame(e, t, r, i) {
    if (G(this, ja, p(this, ja) + e.length), G(this, Ys, p(this, Ys) + e.length), p(this, Sn) === void 0)
      G(this, Ws, t & ~vn.MoreComing), G(this, Sn, []);
    else if ((t & ~vn.MoreComing) !== p(this, Ws))
      throw Error("Invalid frame: mismatched flags");
    const a = (t & vn.MoreComing) !== 0, u = e.subarray(0, e.length - 4);
    let l = null;
    if (t & fs.Compressed) {
      if (r.decompress(u, (I) => {
        p(this, Sn).push(I), l = i.add(I);
      }), l === null)
        throw Error("Inflate didn't produce any data");
    } else
      p(this, Sn).push(u), l = i.add(u);
    const b = new DataView(e.buffer, e.byteOffset).getUint32(e.length - 4);
    if (b !== l)
      throw Error("Invalid checksum: expected " + l.toString(16) + ", got " + b.toString(16));
    if (a)
      return null;
    {
      const I = Ry(p(this, Sn));
      return G(this, Sn, []), Ca.decodedFromBinary(I, p(this, Ws), p(this, $a));
    }
  }
  get bytesToAck() {
    return p(this, Ys) >= vb ? (G(this, Ys, 0), p(this, ja)) : 0;
  }
}
$a = new WeakMap(), Ws = new WeakMap(), Sn = new WeakMap(), ja = new WeakMap(), Ys = new WeakMap();
var Yi, Zo, Vr, Vi, Qo, Vs, Xo, Ji, Ka, za;
class _b {
  constructor() {
    de(this, "logger", rh);
    ee(this, Yi, !0);
    // Outgoing:
    ee(this, Zo, 0);
    ee(this, Vr, []);
    ee(this, Vi, []);
    ee(this, Qo, new Gv());
    // Incoming:
    ee(this, Vs, 0);
    ee(this, Xo, /* @__PURE__ */ new Map());
    ee(this, Ji, /* @__PURE__ */ new Map());
    ee(this, Ka, new gb());
    ee(this, za, new Gv());
  }
  /** Adds an outgoing {@link message} to the queue to be sent.
      Returns a promise of a reply. The message must not have the {@link NoReply} option. */
  async send(e, t) {
    return Me(p(this, Yi), "The connection is closed"), Me(e.wantsReply, "send() with NoReply message"), new Promise((r, i) => {
      this._send(e, new mb(r, i, t));
    });
  }
  /** Adds an outgoing {@link message} to the queue to be sent.
      The message must have the {@link NoReply} option. */
  sendNoReply(e) {
    Me(p(this, Yi), "The connection is closed"), Me(!e.wantsReply, "sendNoReply() with message that wants a reply"), this._send(e, null);
  }
  _send(e, t) {
    const r = new Ib(e, t);
    r.logger = this.logger, p(this, Vr).push(r);
  }
  /** Returns the next frame to send, or `null` if there's nothing pending. */
  nextFrameToSend() {
    const e = p(this, Vr).shift();
    if (e === void 0)
      return null;
    if (!e.msgNo) {
      const r = ++dr(this, Zo)._;
      e.msgNo = r, (e.flags & (vn.TypeMask | fs.NoReply)) === Dr.MSG && p(this, Ji).set(r, new Hv(r, e.promiseKeeper));
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
    const u = r & vn.TypeMask;
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
    const a = (e & vn.TypeMask) !== Dr.MSG, u = a ? p(this, Ji) : p(this, Xo);
    let l = u.get(t);
    if (l) {
      const c = l.addFrame(r, e, p(this, Ka), p(this, za));
      if (c) {
        u.delete(t);
        const I = l.promiseKeeper;
        if (I)
          return c.isError && I.mode === "throw" ? I.reject(c.error) : I.resolve(c), null;
      }
      const b = l.bytesToAck;
      return b > 0 && p(this, Vr).push(new bb(a, t, b, this.logger)), c;
    } else {
      if (a)
        throw Error(`Invalid #${t} in RPY frame doesn't match any pending reply`);
      {
        if (t !== p(this, Vs) + 1)
          throw Error(`Invalid #${t} in incoming MSG frame; max is #${p(this, Vs) + 1}`);
        l = new Hv(t, null);
        const c = l.addFrame(r, e, p(this, Ka), p(this, za));
        return G(this, Vs, t), c || u.set(t, l), c;
      }
    }
  }
  handleACKFrame(e, t, r) {
    const i = e === Dr.ACKMSG ? Dr.MSG : Dr.RPY;
    let a = !1, u = p(this, Vr).find((b) => b.msgNo === t && b.type === i);
    if (!u && (a = !0, u = p(this, Vi).find((b) => b.msgNo === t && b.type === i), !u))
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
Yi = new WeakMap(), Zo = new WeakMap(), Vr = new WeakMap(), Vi = new WeakMap(), Qo = new WeakMap(), Vs = new WeakMap(), Xo = new WeakMap(), Ji = new WeakMap(), Ka = new WeakMap(), za = new WeakMap();
var ks = null;
typeof WebSocket < "u" ? ks = WebSocket : typeof MozWebSocket < "u" ? ks = MozWebSocket : typeof global < "u" ? ks = global.WebSocket || global.MozWebSocket : typeof window < "u" ? ks = window.WebSocket || window.MozWebSocket : typeof self < "u" && (ks = self.WebSocket || self.MozWebSocket);
const wb = ks, xb = "BLIP_3";
class Eb {
  constructor() {
    de(this, "logger", rh);
    de(this, "events", /* @__PURE__ */ new Map());
    de(this, "msgEvents", new XI());
    de(this, "dispatching", !1);
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
    return this.sendMessage(new hs(e, t), r);
  }
  /** Creates a {@link Message} and queues it to be sent with the {@link NoReply} option.
   * @param props  The properties: either an object, or a string naming the `Profile` property.
   * @param body  The body: either a string, a `Uint8Array`, or an object to be JSON-encoded.
   */
  sendNoReply(e, t = "") {
    this.sendMessageNoReply(new hs(e, t, fs.NoReply));
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
var ir, Sr, Js, ai, An, Zs;
class Sb extends Eb {
  /** Creates and (asynchronously) opens a BLIP connection via a WebSocket.
   * @param url  The `ws:` or `wss:` URL to connect to.
   * @param protocol  The subprotocol of BLIP, to be appended to the WebSocket protocol requested.
   */
  constructor(t, r = "") {
    super();
    ee(this, ir);
    ee(this, Sr, new _b());
    ee(this, Js, !1);
    ee(this, ai, !1);
    ee(this, An, 0);
    ee(this, Zs, 0);
    de(this, "timeReceiving", 0);
    de(this, "timeWaiting", 0);
    de(this, "timeSending", 0);
    r !== "" && (r = xb + "+" + r), this.logger = this.logger.with({ url: t }), p(this, Sr).logger = this.logger, G(this, ir, new wb(t, r)), p(this, ir).binaryType = "arraybuffer", p(this, ir).onopen = () => {
      this.handleWSOpen();
    }, p(this, ir).onmessage = (i) => {
      this.handleWSMessage(i);
    }, p(this, ir).onclose = (i) => {
      this.handleWSClose(i);
    }, p(this, ir).onerror = (i) => {
      this.handleWSError(i);
    };
  }
  /** Returns the WebSocket's ready-state. */
  get readyState() {
    return p(this, ir).readyState;
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
    Me(t >= 1e3, "Close code must be >= 1000"), G(this, An, t), (t !== 1e3 || (i = p(this, Sr)) != null && i.safeToClose) && p(this, ir).close(t, r);
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
    G(this, Js, !0), this.dispatchEvent("open", void 0), this.sendFrames();
  }
  closed(t, r) {
    const i = p(this, Sr);
    G(this, Js, !1), G(this, Sr, void 0), i == null || i.closed(t), this.dispatchEvent("close", r ? void 0 : t);
  }
  handleWSClose(t) {
    if (p(this, Sr)) {
      const r = new Ab(t.code, t.reason), i = t.code === 1e3 && t.wasClean;
      this.closed(r, i);
    }
  }
  handleWSError(t) {
    let r = p(this, Js) ? "Socket disconnected" : "WebSocket connection failed";
    t.message ? r += ": " + t.message : r += " (no information available)";
    const i = Error(r);
    this.closed(i, !1);
  }
  handleWSMessage(t) {
    var l, c;
    const r = globalThis.performance.now();
    p(this, Zs) > 0 && (this.timeWaiting += r - p(this, Zs));
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
    a ? this.dispatchRequest(a) : p(this, ai) || this.sendFrames(), p(this, An) !== 0 && ((c = p(this, Sr)) != null && c.safeToClose) && p(this, ir).close(p(this, An));
    const u = globalThis.performance.now();
    this.timeReceiving += u - r, G(this, Zs, u);
  }
  dispatchRequest(t) {
    !this.msgEvents.dispatchMessage(t) && !this.dispatchEvent("message", t) && t.wantsReply && this.sendErrorReplyTo(t, "no handler", 404);
  }
  // Sends frames until all messages are sent or the WebSocket closes.
  // If the amount of buffered data exceeds the maximum, it will pause and retry.
  sendFrames() {
    var i, a;
    const t = globalThis.performance.now();
    for (G(this, ai, !1); p(this, ir).readyState === 1; ) {
      if (p(this, ir).bufferedAmount > df.MaxBufferedAmount) {
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
      p(this, ir).send(u);
    }
    p(this, An) !== 0 && ((a = p(this, Sr)) != null && a.safeToClose) && p(this, ir).close(p(this, An));
    const r = globalThis.performance.now();
    this.timeSending += r - t;
  }
  preSend(t) {
    if (Me(p(this, An) === 0, "Can't send while the connection is closing"), !p(this, Sr)) throw Error("Connection is closed");
    return p(this, Sr);
  }
}
ir = new WeakMap(), Sr = new WeakMap(), Js = new WeakMap(), ai = new WeakMap(), An = new WeakMap(), Zs = new WeakMap();
class Ab extends Error {
  constructor(e, t) {
    super(t ?? kb[e] ?? "WebSocket error"), this.code = e, this.reason = t;
  }
}
const kb = {
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
}, Ob = 2e3;
var Jr, kn, Wt, On, ln, cn, Zi;
class Rb {
  constructor(e, t, r, i) {
    de(this, "collectionID");
    de(this, "collectionIndex");
    de(this, "replicator");
    ee(this, Jr);
    ee(this, kn);
    // The BLIP connection
    ee(this, Wt);
    // Current checkpoint object
    ee(this, On);
    // Server-side revid of checkpoint
    ee(this, ln);
    // Timer ID from `setTimeout`; for saving
    ee(this, cn);
    // Outgoing `setCheckpoint` request
    ee(this, Zi, !1);
    this.config = t, this.delegate = r, this.replicator = e.replicator, this.collectionID = e.collectionID, this.collectionIndex = e.collectionIndex, G(this, kn, e.socket), G(this, Jr, this.replicator.logger.with({
      collection: this.collectionID,
      type: "checkpointer"
    })), G(this, Wt, t.initialCheckpoint ?? new cs()), G(this, On, i.rev ?? "");
    const a = cs.fromObject(i);
    p(this, Wt).empty ? p(this, On) && p(this, Jr).info`No local checkpoint but server has revid ${p(this, On)}` : a && p(this, Wt).equals(a) ? p(this, Jr).info`Server has matching ${a}` : (p(this, Jr).error`mismatch: I have ${p(this, Wt)}, server has ${a}`, G(this, Wt, new cs()));
  }
  stop() {
    this.stopTimer(), G(this, kn, void 0), G(this, Zi, !1), G(this, cn, void 0);
  }
  get idle() {
    return !p(this, ln) && !p(this, cn);
  }
  get localSequence() {
    return p(this, Wt).local;
  }
  get remoteSequence() {
    return p(this, Wt).remote;
  }
  set localSequence(e) {
    Me(p(this, kn) !== void 0), e !== p(this, Wt).local && (p(this, Wt).local = e, this.saveSoon());
  }
  set remoteSequence(e) {
    p(this, kn) && e !== p(this, Wt).remote && (p(this, Wt).remote = e, this.saveSoon());
  }
  saveSoon() {
    G(this, Zi, !0), p(this, ln) === void 0 && G(this, ln, setTimeout(() => {
      G(this, ln, void 0), this.saveNow();
    }, Ob));
  }
  stopTimer() {
    p(this, ln) && (clearTimeout(p(this, ln)), G(this, ln, void 0));
  }
  async saveNow() {
    if (!p(this, kn) || !p(this, Zi))
      return;
    p(this, Jr).debug`saveNow (${p(this, Wt)})`, this.stopTimer(), p(this, cn) && await p(this, cn), G(this, Zi, !1);
    const e = JSON.stringify(p(this, Wt)), t = {
      Profile: "setCheckpoint",
      collection: this.collectionIndex,
      client: this.config.clientID
    };
    p(this, On) && (t.rev = p(this, On)), p(this, Jr).debug`sending setCheckpoint ${e} ...`, G(this, cn, p(this, kn).send(t, e, "nothrow"));
    const r = await p(this, cn);
    G(this, cn, void 0), p(this, Jr).debug`Saved checkpoint ${e} to server ...`, G(this, On, r.properties.rev), await this.delegate.saveCheckpoint(this.collectionID, p(this, Wt)), p(this, Jr).info`Saved checkpoint ${e}`, this.replicator.statusChanged_();
  }
  toString() {
    return `Checkpointer[${this.collectionID}]`;
  }
  // True when state needs saving
}
Jr = new WeakMap(), kn = new WeakMap(), Wt = new WeakMap(), On = new WeakMap(), ln = new WeakMap(), cn = new WeakMap(), Zi = new WeakMap();
var Ga, Qi, Qs, Xs;
class Fy {
  constructor(e, t) {
    de(this, "collectionID");
    de(this, "collectionIndex");
    de(this, "replicator");
    de(this, "socket");
    de(this, "checkpointer");
    // Subclass should increment this to reflect number of revs pushed/pulled.
    de(this, "_progress", 0);
    // Subclass should set this to true when it's caught up with the server
    de(this, "caughtUp", !1);
    ee(this, Ga);
    ee(this, Qi, !1);
    ee(this, Qs, 0);
    ee(this, Xs, !1);
    this.collectionID = e.collectionID, this.collectionIndex = e.collectionIndex, this.replicator = e.replicator, this.socket = e.socket, this.checkpointer = e.checkpointer, G(this, Ga, t.continuous ?? !1);
  }
  get isCaughtUp() {
    return p(this, Xs);
  }
  get idle() {
    return p(this, Qi);
  }
  get done() {
    return p(this, Qi) && !p(this, Ga);
  }
  get progress() {
    return p(this, Qs);
  }
  // Subclass must call this after changing _progress or caughtUp, or when the result of
  // checkIdle may have changed.
  statusChanged() {
    const e = this.checkIdle();
    (e !== p(this, Qi) || this._progress !== p(this, Qs) || p(this, Xs) !== this.caughtUp) && (G(this, Qi, e), G(this, Qs, this._progress), G(this, Xs, this.caughtUp), this.replicator.statusChanged_());
  }
}
Ga = new WeakMap(), Qi = new WeakMap(), Qs = new WeakMap(), Xs = new WeakMap();
var Xi, oi;
class Tb {
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
function Ly(n) {
  if (Or(n) && typeof n.digest == "string")
    return n;
}
function Cb(n) {
  let e;
  const t = n._attachments;
  if (Or(t))
    for (const r of Object.getOwnPropertyNames(t)) {
      const i = Ly(t[r]);
      i && (e || (e = /* @__PURE__ */ new Set()), e.add(i.digest));
    }
  return e;
}
function Nb(n, e) {
  const t = n._attachments;
  if (Or(t)) {
    for (const i of Object.getOwnPropertyNames(t)) {
      const a = Ly(t[i]);
      if (a)
        if (i.startsWith("blob_/")) {
          const u = new ru(a, e);
          r(u, i.substring(6).split("/")) ? delete t[i] : console.warn(`Document _attachments/${i} doesn't reference a blob`);
        } else
          t[i] = new jg(a, e);
    }
    t.length === 0 && delete n._attachments;
  }
  function r(i, a) {
    let u = n, l = a.length;
    for (const c of a) {
      --l;
      let b;
      if (Or(u)) {
        if (b = u[c], l === 0 && Go(b))
          return u[c] = i, !0;
      } else if (ps(u)) {
        const I = Number(c);
        if (b = u[I], l === 0 && Go(b))
          return u[I] = i, !0;
      } else
        return !1;
      u = b;
    }
    return !1;
  }
}
function Pb(n, e) {
  let t, r, i;
  return eh(n, (a, u) => {
    if (u[0] !== "_attachments") {
      const l = "blob_/" + u.join("/");
      t === void 0 && (t = Oo(n, !1), r = Kg(t._attachments), r = r ? Oo(r) : {}, t._attachments = r), i = i ?? Ro(e), r[l] = a.asAttachmentDict(i);
    }
    return !0;
  }), t ?? n;
}
const Db = 200;
var Yt, Rn, es, fn, ui, Fr, ea;
class Bb extends Fy {
  constructor(t, r, i) {
    super(t, r);
    ee(this, Yt);
    // Logger, duh
    ee(this, Rn);
    // Manages the checkpoint
    ee(this, es, []);
    // Unhandled 'changes' messages
    ee(this, fn, 0);
    // Number of `rev` msgs I'm waiting for
    ee(this, ui, 0);
    // Number of revs I'm waiting to insert
    ee(this, Fr, new Array());
    // Revs waiting to be added to db
    ee(this, ea, !1);
    this.config = r, this.delegate = i, G(this, Yt, this.replicator.logger.with({ collection: this.collectionID, dir: "pull" })), G(this, Rn, new Tb(this.checkpointer.remoteSequence)), G(this, fn, 0), G(this, ui, 0);
    const a = {
      Profile: "subChanges",
      collection: this.collectionIndex
    };
    this.checkpointer.remoteSequence !== void 0 && (a.since = JSON.stringify(this.checkpointer.remoteSequence)), r.continuous && (a.continuous = "true"), this.config.channels && (a.filter = "sync_gateway/bychannel", a.channels = this.config.channels.join(",")), this.config.activeOnly && (a.activeOnly = "true"), this.config.wantBatchSize && (a.batch = this.config.wantBatchSize), p(this, Yt).debug`Sending ${JSON.stringify(a)}`, this.socket.send(a);
  }
  checkIdle() {
    return Me(p(this, fn) >= 0 && p(this, ui) >= 0), this.caughtUp && p(this, fn) === 0 && p(this, ui) === 0 && p(this, es).length === 0;
  }
  //-------- HANDLING CHANGES MESSAGES:
  // Number of revs to insert into db at once
  get batchSize() {
    return this.config.saveBatchSize ?? Db;
  }
  // Handler for incoming `changes` messages:
  onChanges(t) {
    this.canProcessChangesMessage() ? this.processChangesMessage(t) : (p(this, Yt).debug`Puller queuing changes message #${t.number}`, p(this, es).push(t));
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
      p(this, Yt).debug`Got 'changes'#${t.number}: Puller has caught up`, this.caughtUp = !0, this.maybeInsertRevs(), t.wantsReply && this.socket.sendReplyTo(t, {});
    else {
      p(this, Yt).debug`Got 'changes'#${t.number}: ${r.length} revs from seq ${r[0][0]}`;
      const i = r.map((c) => new Fb(
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
          p(this, Yt).error`wantRevs threw ${c}`, this.replicator.fatalError(c);
        }
      const u = Array(), l = i.map((c) => c.skip ? (p(this, Rn).skipSequence(c.remoteSequence), 0) : (++dr(this, fn)._, p(this, Rn).addSequence(c.remoteSequence), c.knownRevs || u));
      p(this, Yt).debug`Puller replying to changes from ${r[0][0]}`, this.socket.sendReplyTo(t, {}, l), this.checkpointer.remoteSequence = p(this, Rn).getCheckpoint();
    }
    this.statusChanged(), this.maybeProcessChangesMessage();
  }
  //-------- HANDLING REVISIONS:
  // Handler for incoming `rev` messages.
  onRev(t) {
    --dr(this, fn)._, ++dr(this, ui)._, p(this, Fr).push(t), this.maybeInsertRevs();
  }
  // Inserts all the `rev` messages in `insertable` by passing them to the `saveRevs` callback.
  async maybeInsertRevs() {
    if (p(this, ea)) return;
    const t = this.batchSize;
    for (; p(this, Fr).length > 0 && (p(this, Fr).length >= t || this.caughtUp && p(this, fn) === 0); ) {
      G(this, ea, !0);
      try {
        let r;
        p(this, Fr).length <= t ? (r = p(this, Fr), G(this, Fr, [])) : r = p(this, Fr).splice(0, t), p(this, Yt).debug`Inserting ${r.length} of ${r.length + p(this, Fr).length} revs`, this.maybeProcessChangesMessage();
        const i = [];
        for (const u of r)
          if (u instanceof hs) {
            const l = this.decodeRevMsg(u);
            let c = Cb(l.body);
            c ? this.processRevWithBlobs(l, c) : i.push(l);
          } else
            i.push(u);
        let a = !1;
        try {
          a = await this.delegate.saveRevs(i), a || p(this, Yt).error`Failed to save revs`;
        } catch (u) {
          p(this, Yt).error`Failed to save revs: caught ${u}`, this.replicator.fatalError(u);
          return;
        }
        i.forEach((u) => this.finishedRev(u, a)), this.checkpointer.remoteSequence = p(this, Rn).getCheckpoint(), a && (this._progress += i.length, this.statusChanged());
      } finally {
        G(this, ea, !1), p(this, Yt).debug`End insertRevs`;
      }
    }
    this.maybeProcessChangesMessage();
  }
  // Returns a RemoteRevision object created from a `rev` message.
  decodeRevMsg(t) {
    const r = t.bodyJSON;
    if (!ky(r))
      throw new Ho("invalid revision body", 400);
    const i = r._id || t.property("id"), a = r._rev || t.property("rev");
    if (!d0(i) || !zg(a))
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
        p(this, Yt).info`Downloading ${i.length} blob(s) of doc ${t.id}`;
        const a = i.map(async (u) => this.socket.send({
          Profile: "getAttachment",
          collection: this.collectionIndex,
          docID: t.id,
          digest: u
        }).then(async (l) => (p(this, Yt).info`Saving ${l.bodyData.length}-byte blob of doc "${t.id}"`, this.delegate.addBlob(u, l.bodyData))));
        await Promise.all(a);
      }
      Nb(t.body, this.delegate.blobLoader), p(this, Fr).push(t), this.maybeInsertRevs();
    } catch (i) {
      p(this, Yt).error`Unable to download blobs of doc ${t.id}: ${i.message}`, this.finishedRev(t, !1);
    }
  }
  // Called when a revision has been saved or rejected.
  finishedRev(t, r) {
    const i = t.msg;
    r ? (p(this, Rn).finishedSequence(t.remoteSequence), i.wantsReply && this.socket.sendReplyTo(i, {})) : i.wantsReply && this.socket.sendErrorReplyTo(i, "Failed to insert revision", 502), --dr(this, ui)._ === 0 && this.statusChanged();
  }
  toString() {
    return `Puller[${this.collectionID}]`;
  }
  // True while revs are being added to db
}
Yt = new WeakMap(), Rn = new WeakMap(), es = new WeakMap(), fn = new WeakMap(), ui = new WeakMap(), Fr = new WeakMap(), ea = new WeakMap();
class Fb {
  constructor(e, t, r, i, a) {
    de(this, "knownRevs");
    de(this, "skip");
    this.id = e, this.rev = t, this.deleted = r, this.bodySize = i, this.remoteSequence = a;
  }
}
const Lb = 200;
var hn, Zr, li, ts, rs;
class Wv extends Fy {
  constructor(t, r, i) {
    super(t, r);
    ee(this, hn);
    ee(this, Zr);
    ee(this, li);
    ee(this, ts, 0);
    ee(this, rs, 0);
    this.config = r, this.delegate = i, G(this, hn, this.replicator.logger.with({ collection: this.collectionID, dir: "push" })), G(this, li, this.checkpointer.localSequence), G(this, Zr, new qb(p(this, li))), this.sendMoreChanges();
  }
  checkIdle() {
    return Me(p(this, ts) >= 0 && p(this, rs) >= 0), this.caughtUp && p(this, ts) === 0 && p(this, rs) === 0;
  }
  async getMoreChanges() {
    const t = this.config.batchSize ?? Lb, r = p(this, li);
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
        const b = [c.id, c.rev, c.serverRev ?? ""];
        return c.deleted && b.push(!0), p(this, Zr).addSequence(c.seq), i = c.seq, b;
      });
      p(this, hn).debug`Proposing ${a} revs from seq ${r.changes[0].seq} -- ${i}`, ++dr(this, ts)._;
      const l = await this.socket.send({
        Profile: "proposeChanges",
        collection: this.collectionIndex
      }, u, "nothrow");
      if (--dr(this, ts)._, t && await Promise.all(t), l.isError) {
        this.replicator.fatalError(l.error);
        return;
      } else {
        t = new Array();
        const c = l.bodyJSON;
        let b = 0;
        for (const I of r.changes) {
          const w = b < c.length ? c[b] : 0;
          switch (w) {
            case 0:
              t.push(this.sendRev(I));
              break;
            case 304:
              p(this, Zr).finishedSequence(I.seq);
              break;
            case 409:
            default:
              p(this, hn).error`Server rejected rev ${I.id} ${I.rev} with status ${JSON.stringify(w)}`, p(this, Zr).finishedSequence(I.seq);
              break;
          }
          ++b;
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
    const i = JSON.stringify(Pb(t.body, t.rev));
    ++dr(this, rs)._;
    const a = await this.socket.send(r, i, "nothrow");
    if (--dr(this, rs)._, a.isError) {
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
var ta, Tn;
class qb {
  /// Constructor takes the latest checkpointed sequence.
  constructor(e) {
    ee(this, ta, /* @__PURE__ */ new Map());
    ee(this, Tn);
    G(this, Tn, e ?? 0);
  }
  /// Adds a new pending sequence. Sequences are assumed to be in chronological order.
  addSequence(e) {
    if (e <= p(this, Tn))
      throw Error(`LocalSeqTracker.addSequence: sequence ${e} out of order`);
    p(this, ta).set(e, p(this, Tn)), G(this, Tn, e);
  }
  /// Records that a pending sequence is now complete.
  finishedSequence(e) {
    if (!p(this, ta).delete(e))
      throw Error(`LocalSeqTracker.finishedSequence: ${e} was not pending`);
  }
  get max() {
    return p(this, Tn);
  }
  get checkpointedSequence() {
    const e = p(this, ta).values().next();
    return e.done ? p(this, Tn) : e.value;
  }
}
ta = new WeakMap(), Tn = new WeakMap();
const Mb = "CBMobile_3", Yv = 500, yf = Xf.getChild("Sync");
var pn, ci, ns, mr, ra, na, fi, ia, is, ss, as, Zv;
let Ub = (Zv = class {
  constructor(e) {
    de(this, "logger");
    de(this, "onStatusChange");
    ee(this, pn);
    // Indexes of this array are collection indexes
    ee(this, ci);
    // Resolves `run()` Promise
    ee(this, ns);
    // Rejects `run()` Promise
    ee(this, mr);
    // BLIP socket
    ee(this, ra, !1);
    // True once a BLIP close is OK
    ee(this, na, []);
    // Checkpointers, by collection index
    ee(this, fi, []);
    // All the pushers & pullers (indexes arbitrary)
    ee(this, ia, /* @__PURE__ */ new Map());
    // Pushers, keyed by collection index
    ee(this, is, /* @__PURE__ */ new Map());
    // Pullers, keyed by collection index
    ee(this, ss, 0);
    // Time I last notified status
    ee(this, as);
    this.config = e, this.logger = yf.with({ url: e.url }), G(this, pn, Object.keys(e.collections)), Me(p(this, pn).length > 0, "must replicate at least one Collection");
    for (const t of p(this, pn)) {
      const r = e.collections[t];
      Me(r.push || r.pull, `collection '${t}' must be either pushed or pulled`);
    }
  }
  /** Starts the replicator. Completes when the replicator finishes (never if continuous.) */
  async run() {
    return Ar(!this.running, "Replicator is already running"), new Promise((e, t) => {
      G(this, ci, e), G(this, ns, t), G(this, ra, !1), G(this, ss, 0), this.logger.info`Connecting to <${this.config.url}>...`, G(this, mr, new Sb(this.config.url, Mb)), p(this, mr).addEventListener("open", () => {
        this.logger.info`Connected!`, this.maybeNotifyStatus();
      }), p(this, mr).addEventListener("close", (r) => {
        r ? (this.logger.info`Connection closed with error: ${r}`, this.fatalError(r)) : p(this, ra) ? (this.logger.info`Connection closed`, this.finish()) : (this.logger.info`Connection closed unexpectedly`, this.finish(Error("BLIP connection closed unexpectedly")));
      }), this.start();
    });
  }
  async start() {
    Cn(p(this, mr));
    let e;
    this.config.scope ? e = p(this, pn).map((a) => this.config.scope + "." + a) : e = p(this, pn);
    const t = p(this, pn).map(
      (a) => this.config.collections[a].checkpoint.clientID
    ), r = await p(this, mr).send("getCollections", { collections: e, checkpoint_ids: t });
    let i = 0;
    for (const a of r.bodyJSON) {
      const u = p(this, pn)[i];
      if (a === null) {
        this.fatalError(Error(`Collection '${u}' does not exist on the server`));
        return;
      }
      const l = {
        replicator: this,
        socket: p(this, mr),
        collectionID: u,
        collectionIndex: i
      }, c = this.config.collections[u], b = new Rb(
        l,
        c.checkpoint,
        c.checkpoint.delegate,
        a
      );
      p(this, na).push(b);
      const I = { ...l, checkpointer: b };
      if (c.push) {
        const w = new Wv(I, c.push, c.push.delegate);
        p(this, ia).set(i, w), p(this, fi).push(w);
      }
      if (c.pull) {
        const w = new Bb(I, c.pull, c.pull.delegate);
        p(this, is).set(i, w), p(this, fi).push(w);
      }
      ++i;
    }
    p(this, ia).size > 0 && p(this, mr).incoming.addEventListener("getAttachment", (a) => {
      p(this, ia).get(a.numericProperty("collection")).onGetAttachment(a);
    }), p(this, is).size > 0 && (p(this, mr).incoming.addEventListener("changes", (a) => {
      p(this, is).get(a.numericProperty("collection")).onChanges(a);
    }), p(this, mr).incoming.addEventListener("rev", (a) => {
      p(this, is).get(a.numericProperty("collection")).onRev(a);
    }));
  }
  /** Stops the replicator, if it's running. */
  stop() {
    this.running && (this.logger.info`Replicator.stop called!`, this.finish());
  }
  get status() {
    var t;
    let e = { status: "busy" };
    if (p(this, fi).length > 0) {
      e.status = "idle";
      for (const r of p(this, fi))
        r instanceof Wv ? e.pushedRevisions = (e.pushedRevisions ?? 0) + r.progress : e.pulledRevisions = (e.pulledRevisions ?? 0) + r.progress, r.idle || (e.status = "busy");
    }
    switch ((t = p(this, mr)) == null ? void 0 : t.readyState) {
      case WebSocket.CONNECTING:
        e.status = "connecting";
        break;
      case WebSocket.CLOSED:
        e.status = "stopped";
        break;
    }
    return e;
  }
  get running() {
    return p(this, ci) !== void 0;
  }
  statusChanged_() {
    p(this, fi).every((e) => e.done) && p(this, na).every((e) => e.idle) && this.finish(), this.maybeNotifyStatus();
  }
  maybeNotifyStatus() {
    if (this.onStatusChange && this.running) {
      const e = Date.now();
      e > p(this, ss) + Yv ? (G(this, ss, e), this.onStatusChange(this.status)) : p(this, as) || G(this, as, setTimeout(() => {
        G(this, as, void 0), this.maybeNotifyStatus();
      }, Yv));
    }
  }
  notifyStatusAtEnd() {
    p(this, as) && (G(this, ss, 0), this.maybeNotifyStatus());
  }
  // Completes a run by cleaning up state and resolving or rejecting `run`s Promise.
  finish(e) {
    var t;
    this.logger.info`Finished`;
    for (const r of p(this, na))
      r.stop();
    G(this, ra, !0), (t = p(this, mr)) == null || t.close(), G(this, mr, void 0), this.notifyStatusAtEnd(), e ? p(this, ns) && p(this, ns).call(this, e) : p(this, ci) && p(this, ci).call(this), G(this, ci, void 0), G(this, ns, void 0);
  }
  fatalError(e) {
    this.logger.error`Sync fatal error: ${e}`, this.finish(e);
  }
  // Timer for notifying status
}, pn = new WeakMap(), ci = new WeakMap(), ns = new WeakMap(), mr = new WeakMap(), ra = new WeakMap(), na = new WeakMap(), fi = new WeakMap(), ia = new WeakMap(), is = new WeakMap(), ss = new WeakMap(), as = new WeakMap(), Zv);
var os, Qr, Ha;
class a_ {
  constructor(e) {
    /** Callback that notifies when {@link status} changes. */
    de(this, "onStatusChange");
    /** Callback that notifies when documents have been pushed or pulled. */
    de(this, "onDocuments");
    de(this, "logger");
    ee(this, os);
    ee(this, Qr);
    // Actual replicator, while it's running
    ee(this, Ha, {});
    this.config = e, G(this, os, e.database), this.logger = yf.with({ url: e.url });
    const t = Object.keys(this.config.collections);
    Me(t.length > 0, "At least one collection must be replicated");
    for (const r of t)
      p(this, os).getCollection(r);
  }
  /** Current replication status & progress. */
  get status() {
    var e;
    return ((e = p(this, Qr)) == null ? void 0 : e.status) ?? p(this, Ha);
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
      scope: this.config.scope,
      collections: {}
    };
    for (let t of Object.keys(this.config.collections)) {
      const r = this.config.collections[t], i = p(this, os).getCollection(t), a = await i.getClientID(), u = await i.getCheckpoint(this.config.url);
      yf.debug(`Initial checkpoint of ${t} is ${u}`);
      let l = {
        checkpoint: { clientID: a, initialCheckpoint: u, delegate: this }
      };
      if (r.pull) {
        const c = await i.count("includeDeleted") === 0, b = new jb(this, i, r.pull, c);
        l.pull = { ...r.pull, delegate: b }, c && (l.pull.activeOnly = !0);
      }
      if (r.push) {
        const c = new $b(this, i, r.push);
        l.push = { ...r.push, delegate: c };
      }
      e.collections[t] = l;
    }
    G(this, Qr, new Ub(e)), p(this, Qr).onStatusChange = this.onStatusChange;
    try {
      await p(this, Qr).run();
    } finally {
      G(this, Ha, p(this, Qr).status), G(this, Qr, void 0);
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
    await p(this, os).getCollection(e).setCheckpoint(this.config.url, t);
  }
  // Final status of the Replicator
}
os = new WeakMap(), Qr = new WeakMap(), Ha = new WeakMap();
class qy {
  constructor(e, t, r) {
    de(this, "logger");
    this.replicator = e, this.collection = t, this.logger = e.logger.with({ collection: t.name, dir: r });
  }
}
var Wa, hi;
class $b extends qy {
  constructor(t, r, i) {
    super(t, r, "push");
    ee(this, Wa, !1);
    ee(this, hi);
    this.config = i;
  }
  async getChanges(t, r) {
    const i = this.collection, a = await i.getDocsSinceSequence(t, r);
    if (a.length > 0 || !this.config.continuous)
      return a;
    if (!p(this, Wa))
      return G(this, Wa, !0), a;
    Me(!p(this, hi)), G(this, hi, Promise.withResolvers());
    let u;
    const l = () => {
      var b;
      u.remove();
      const c = (b = p(this, hi)) == null ? void 0 : b.resolve;
      c && (this.logger.info`Notifying Pusher of changes to collection ${i.name}`, G(this, hi, void 0), c(i.getDocsSinceSequence(t, r)));
    };
    return u = i.addChangeListener(l), this.logger.info`Pusher is watching for changes to collection ${i.name}`, p(this, hi).promise;
  }
  async getBlob(t) {
    return await this.collection.database.blobStore.getBlob(t);
  }
}
Wa = new WeakMap(), hi = new WeakMap();
class jb extends qy {
  constructor(t, r, i, a) {
    super(t, r, "pull");
    de(this, "blobLoader");
    this.config = i, this.startedEmpty = a, this.blobLoader = this.collection.database.blobLoader;
  }
  async wantRevs(t, r) {
    if (r)
      this.startedEmpty = !1;
    else if (this.startedEmpty)
      return;
    await this.collection.inTransaction(jI, async (i) => {
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
    const i = aa.computeDigest(r);
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
          const b = (u.flags ?? 0) & sr ? null : u == null ? void 0 : u.body;
          l = await i(r, a, b, c);
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
var sa;
class gf {
  constructor(e) {
    ee(this, sa);
    G(this, sa, e);
  }
  remove() {
    var e;
    (e = p(this, sa)) == null || e.call(this), G(this, sa, void 0);
  }
  [Symbol.dispose]() {
    this.remove();
  }
}
sa = new WeakMap();
export {
  WI as ArrayIndex,
  kf as Blob,
  Os as Collection,
  YI as ConflictError,
  di as Database,
  Bc as DefaultCollectionName,
  Gb as DocID,
  uu as EncryptionError,
  ru as ExistingBlob,
  Ko as InterruptedQueryError,
  n_ as LastWriteWins,
  gf as ListenerToken,
  Ay as LogCategory,
  i_ as MostWritesWins,
  Av as MultipleConflictsError,
  Lr as N1QLParseError,
  aa as NewBlob,
  BI as Query,
  fI as RegisterUserFunction,
  a_ as Replicator,
  $n as ValueIndex,
  zn as meta
};
//# sourceMappingURL=couchbase-lite.es.js.map
