var PostForge = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/highlight.js/lib/core.js
  var require_core = __commonJS({
    "node_modules/highlight.js/lib/core.js"(exports, module) {
      function deepFreeze(obj) {
        if (obj instanceof Map) {
          obj.clear = obj.delete = obj.set = function() {
            throw new Error("map is read-only");
          };
        } else if (obj instanceof Set) {
          obj.add = obj.clear = obj.delete = function() {
            throw new Error("set is read-only");
          };
        }
        Object.freeze(obj);
        Object.getOwnPropertyNames(obj).forEach((name) => {
          const prop = obj[name];
          const type = typeof prop;
          if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
            deepFreeze(prop);
          }
        });
        return obj;
      }
      var Response = class {
        /**
         * @param {CompiledMode} mode
         */
        constructor(mode) {
          if (mode.data === void 0) mode.data = {};
          this.data = mode.data;
          this.isMatchIgnored = false;
        }
        ignoreMatch() {
          this.isMatchIgnored = true;
        }
      };
      function escapeHTML(value) {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
      }
      function inherit$1(original, ...objects) {
        const result = /* @__PURE__ */ Object.create(null);
        for (const key in original) {
          result[key] = original[key];
        }
        objects.forEach(function(obj) {
          for (const key in obj) {
            result[key] = obj[key];
          }
        });
        return (
          /** @type {T} */
          result
        );
      }
      var SPAN_CLOSE = "</span>";
      var emitsWrappingTags = (node) => {
        return !!node.scope;
      };
      var scopeToCSSClass = (name, { prefix }) => {
        if (name.startsWith("language:")) {
          return name.replace("language:", "language-");
        }
        if (name.includes(".")) {
          const pieces = name.split(".");
          return [
            `${prefix}${pieces.shift()}`,
            ...pieces.map((x2, i) => `${x2}${"_".repeat(i + 1)}`)
          ].join(" ");
        }
        return `${prefix}${name}`;
      };
      var HTMLRenderer = class {
        /**
         * Creates a new HTMLRenderer
         *
         * @param {Tree} parseTree - the parse tree (must support `walk` API)
         * @param {{classPrefix: string}} options
         */
        constructor(parseTree, options) {
          this.buffer = "";
          this.classPrefix = options.classPrefix;
          parseTree.walk(this);
        }
        /**
         * Adds texts to the output stream
         *
         * @param {string} text */
        addText(text) {
          this.buffer += escapeHTML(text);
        }
        /**
         * Adds a node open to the output stream (if needed)
         *
         * @param {Node} node */
        openNode(node) {
          if (!emitsWrappingTags(node)) return;
          const className = scopeToCSSClass(
            node.scope,
            { prefix: this.classPrefix }
          );
          this.span(className);
        }
        /**
         * Adds a node close to the output stream (if needed)
         *
         * @param {Node} node */
        closeNode(node) {
          if (!emitsWrappingTags(node)) return;
          this.buffer += SPAN_CLOSE;
        }
        /**
         * returns the accumulated buffer
        */
        value() {
          return this.buffer;
        }
        // helpers
        /**
         * Builds a span element
         *
         * @param {string} className */
        span(className) {
          this.buffer += `<span class="${className}">`;
        }
      };
      var newNode = (opts = {}) => {
        const result = { children: [] };
        Object.assign(result, opts);
        return result;
      };
      var TokenTree = class _TokenTree {
        constructor() {
          this.rootNode = newNode();
          this.stack = [this.rootNode];
        }
        get top() {
          return this.stack[this.stack.length - 1];
        }
        get root() {
          return this.rootNode;
        }
        /** @param {Node} node */
        add(node) {
          this.top.children.push(node);
        }
        /** @param {string} scope */
        openNode(scope) {
          const node = newNode({ scope });
          this.add(node);
          this.stack.push(node);
        }
        closeNode() {
          if (this.stack.length > 1) {
            return this.stack.pop();
          }
          return void 0;
        }
        closeAllNodes() {
          while (this.closeNode()) ;
        }
        toJSON() {
          return JSON.stringify(this.rootNode, null, 4);
        }
        /**
         * @typedef { import("./html_renderer").Renderer } Renderer
         * @param {Renderer} builder
         */
        walk(builder) {
          return this.constructor._walk(builder, this.rootNode);
        }
        /**
         * @param {Renderer} builder
         * @param {Node} node
         */
        static _walk(builder, node) {
          if (typeof node === "string") {
            builder.addText(node);
          } else if (node.children) {
            builder.openNode(node);
            node.children.forEach((child) => this._walk(builder, child));
            builder.closeNode(node);
          }
          return builder;
        }
        /**
         * @param {Node} node
         */
        static _collapse(node) {
          if (typeof node === "string") return;
          if (!node.children) return;
          if (node.children.every((el) => typeof el === "string")) {
            node.children = [node.children.join("")];
          } else {
            node.children.forEach((child) => {
              _TokenTree._collapse(child);
            });
          }
        }
      };
      var TokenTreeEmitter = class extends TokenTree {
        /**
         * @param {*} options
         */
        constructor(options) {
          super();
          this.options = options;
        }
        /**
         * @param {string} text
         */
        addText(text) {
          if (text === "") {
            return;
          }
          this.add(text);
        }
        /** @param {string} scope */
        startScope(scope) {
          this.openNode(scope);
        }
        endScope() {
          this.closeNode();
        }
        /**
         * @param {Emitter & {root: DataNode}} emitter
         * @param {string} name
         */
        __addSublanguage(emitter, name) {
          const node = emitter.root;
          if (name) node.scope = `language:${name}`;
          this.add(node);
        }
        toHTML() {
          const renderer = new HTMLRenderer(this, this.options);
          return renderer.value();
        }
        finalize() {
          this.closeAllNodes();
          return true;
        }
      };
      function source(re) {
        if (!re) return null;
        if (typeof re === "string") return re;
        return re.source;
      }
      function lookahead(re) {
        return concat("(?=", re, ")");
      }
      function anyNumberOfTimes(re) {
        return concat("(?:", re, ")*");
      }
      function optional(re) {
        return concat("(?:", re, ")?");
      }
      function concat(...args) {
        const joined = args.map((x2) => source(x2)).join("");
        return joined;
      }
      function stripOptionsFromArgs(args) {
        const opts = args[args.length - 1];
        if (typeof opts === "object" && opts.constructor === Object) {
          args.splice(args.length - 1, 1);
          return opts;
        } else {
          return {};
        }
      }
      function either(...args) {
        const opts = stripOptionsFromArgs(args);
        const joined = "(" + (opts.capture ? "" : "?:") + args.map((x2) => source(x2)).join("|") + ")";
        return joined;
      }
      function countMatchGroups(re) {
        return new RegExp(re.toString() + "|").exec("").length - 1;
      }
      function startsWith(re, lexeme) {
        const match = re && re.exec(lexeme);
        return match && match.index === 0;
      }
      var BACKREF_RE = new RegExp(either(
        /\[(?:[^\\\]]|\\.)*\]/,
        // a character class, inside which ( and \ lose their meaning
        /\(\?<(?![=!])[^>]+>/,
        // a named capture group `(?<name>` (not a lookbehind `(?<=` / `(?<!`)
        /\(\?'[^']+'/,
        // a named capture group `(?'name'`
        /\(\??/,
        // an opening parenthesis, capturing or non-capturing / lookahead
        /\\([1-9][0-9]*)/,
        // a backreference like `\1`
        /\\./
        // any other escape sequence
      ));
      function _rewriteBackreferences(regexps, { joinWith }) {
        let numCaptures = 0;
        return regexps.map((regex) => {
          numCaptures += 1;
          const offset = numCaptures;
          let re = source(regex);
          let out = "";
          while (re.length > 0) {
            const match = BACKREF_RE.exec(re);
            if (!match) {
              out += re;
              break;
            }
            out += re.substring(0, match.index);
            re = re.substring(match.index + match[0].length);
            if (match[0][0] === "\\" && match[1]) {
              out += "\\" + String(Number(match[1]) + offset);
            } else {
              out += match[0];
              if (match[0] === "(" || /^\(\?[<']/.test(match[0])) {
                numCaptures++;
              }
            }
          }
          return out;
        }).map((re) => `(${re})`).join(joinWith);
      }
      var MATCH_NOTHING_RE = /\b\B/;
      var IDENT_RE3 = "[a-zA-Z]\\w*";
      var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
      var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
      var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
      var BINARY_NUMBER_RE = "\\b(0b[01]+)";
      var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
      var SHEBANG = (opts = {}) => {
        const beginShebang = /^#![ ]*\//;
        if (opts.binary) {
          opts.begin = concat(
            beginShebang,
            /.*\b/,
            opts.binary,
            /\b.*/
          );
        }
        return inherit$1({
          scope: "meta",
          begin: beginShebang,
          end: /$/,
          relevance: 0,
          /** @type {ModeCallback} */
          "on:begin": (m2, resp) => {
            if (m2.index !== 0) resp.ignoreMatch();
          }
        }, opts);
      };
      var BACKSLASH_ESCAPE = {
        begin: "\\\\[\\s\\S]",
        relevance: 0
      };
      var APOS_STRING_MODE = {
        scope: "string",
        begin: "'",
        end: "'",
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var QUOTE_STRING_MODE = {
        scope: "string",
        begin: '"',
        end: '"',
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var PHRASAL_WORDS_MODE = {
        begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
      };
      var COMMENT = function(begin, end, modeOptions = {}) {
        const mode = inherit$1(
          {
            scope: "comment",
            begin,
            end,
            contains: []
          },
          modeOptions
        );
        mode.contains.push({
          scope: "doctag",
          // hack to avoid the space from being included. the space is necessary to
          // match here to prevent the plain text rule below from gobbling up doctags
          begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
          end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
          excludeBegin: true,
          relevance: 0
        });
        const ENGLISH_WORD = either(
          // list of common 1 and 2 letter words in English
          "I",
          "a",
          "is",
          "so",
          "us",
          "to",
          "at",
          "if",
          "in",
          "it",
          "on",
          // note: this is not an exhaustive list of contractions, just popular ones
          /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
          // contractions - can't we'd they're let's, etc
          /[A-Za-z]+[-][a-z]+/,
          // `no-way`, etc.
          /[A-Za-z][a-z]{2,}/
          // allow capitalized words at beginning of sentences
        );
        mode.contains.push(
          {
            // TODO: how to include ", (, ) without breaking grammars that use these for
            // comment delimiters?
            // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
            // ---
            // this tries to find sequences of 3 english words in a row (without any
            // "programming" type syntax) this gives us a strong signal that we've
            // TRULY found a comment - vs perhaps scanning with the wrong language.
            // It's possible to find something that LOOKS like the start of the
            // comment - but then if there is no readable text - good chance it is a
            // false match and not a comment.
            //
            // for a visual example please see:
            // https://github.com/highlightjs/highlight.js/issues/2827
            begin: concat(
              /[ ]+/,
              // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
              "(",
              ENGLISH_WORD,
              /[.]?[:]?([.][ ]|[ ])/,
              "){3}"
            )
            // look for 3 words in a row
          }
        );
        return mode;
      };
      var C_LINE_COMMENT_MODE = COMMENT("//", "$");
      var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
      var HASH_COMMENT_MODE = COMMENT("#", "$");
      var NUMBER_MODE = {
        scope: "number",
        begin: NUMBER_RE,
        relevance: 0
      };
      var C_NUMBER_MODE = {
        scope: "number",
        begin: C_NUMBER_RE,
        relevance: 0
      };
      var BINARY_NUMBER_MODE = {
        scope: "number",
        begin: BINARY_NUMBER_RE,
        relevance: 0
      };
      var REGEXP_MODE = {
        scope: "regexp",
        begin: /\/(?=[^/\n]*\/)/,
        end: /\/[gimuy]*/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      };
      var TITLE_MODE = {
        scope: "title",
        begin: IDENT_RE3,
        relevance: 0
      };
      var UNDERSCORE_TITLE_MODE = {
        scope: "title",
        begin: UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var METHOD_GUARD = {
        // excludes method names from keyword processing
        begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var END_SAME_AS_BEGIN = function(mode) {
        return Object.assign(
          mode,
          {
            /** @type {ModeCallback} */
            "on:begin": (m2, resp) => {
              resp.data._beginMatch = m2[1];
            },
            /** @type {ModeCallback} */
            "on:end": (m2, resp) => {
              if (resp.data._beginMatch !== m2[1]) resp.ignoreMatch();
            }
          }
        );
      };
      var MODES2 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        APOS_STRING_MODE,
        BACKSLASH_ESCAPE,
        BINARY_NUMBER_MODE,
        BINARY_NUMBER_RE,
        COMMENT,
        C_BLOCK_COMMENT_MODE,
        C_LINE_COMMENT_MODE,
        C_NUMBER_MODE,
        C_NUMBER_RE,
        END_SAME_AS_BEGIN,
        HASH_COMMENT_MODE,
        IDENT_RE: IDENT_RE3,
        MATCH_NOTHING_RE,
        METHOD_GUARD,
        NUMBER_MODE,
        NUMBER_RE,
        PHRASAL_WORDS_MODE,
        QUOTE_STRING_MODE,
        REGEXP_MODE,
        RE_STARTERS_RE,
        SHEBANG,
        TITLE_MODE,
        UNDERSCORE_IDENT_RE,
        UNDERSCORE_TITLE_MODE
      });
      function skipIfHasPrecedingDot(match, response) {
        const before = match.input[match.index - 1];
        if (before === ".") {
          response.ignoreMatch();
        }
      }
      function scopeClassName(mode, _parent) {
        if (mode.className !== void 0) {
          mode.scope = mode.className;
          delete mode.className;
        }
      }
      function beginKeywords(mode, parent) {
        if (!parent) return;
        if (!mode.beginKeywords) return;
        mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
        mode.__beforeBegin = skipIfHasPrecedingDot;
        mode.keywords = mode.keywords || mode.beginKeywords;
        delete mode.beginKeywords;
        if (mode.relevance === void 0) mode.relevance = 0;
      }
      function compileIllegal(mode, _parent) {
        if (!Array.isArray(mode.illegal)) return;
        mode.illegal = either(...mode.illegal);
      }
      function compileMatch(mode, _parent) {
        if (!mode.match) return;
        if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");
        mode.begin = mode.match;
        delete mode.match;
      }
      function compileRelevance(mode, _parent) {
        if (mode.relevance === void 0) mode.relevance = 1;
      }
      var beforeMatchExt = (mode, parent) => {
        if (!mode.beforeMatch) return;
        if (mode.starts) throw new Error("beforeMatch cannot be used with starts");
        const originalMode = Object.assign({}, mode);
        Object.keys(mode).forEach((key) => {
          delete mode[key];
        });
        mode.keywords = originalMode.keywords;
        mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
        mode.starts = {
          relevance: 0,
          contains: [
            Object.assign(originalMode, { endsParent: true })
          ]
        };
        mode.relevance = 0;
        delete originalMode.beforeMatch;
      };
      var COMMON_KEYWORDS = [
        "of",
        "and",
        "for",
        "in",
        "not",
        "or",
        "if",
        "then",
        "parent",
        // common variable name
        "list",
        // common variable name
        "value"
        // common variable name
      ];
      var DEFAULT_KEYWORD_SCOPE = "keyword";
      function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
        const compiledKeywords = /* @__PURE__ */ Object.create(null);
        if (typeof rawKeywords === "string") {
          compileList(scopeName, rawKeywords.split(" "));
        } else if (Array.isArray(rawKeywords)) {
          compileList(scopeName, rawKeywords);
        } else {
          Object.keys(rawKeywords).forEach(function(scopeName2) {
            Object.assign(
              compiledKeywords,
              compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2)
            );
          });
        }
        return compiledKeywords;
        function compileList(scopeName2, keywordList) {
          if (caseInsensitive) {
            keywordList = keywordList.map((x2) => x2.toLowerCase());
          }
          keywordList.forEach(function(keyword) {
            const pair = keyword.split("|");
            compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
          });
        }
      }
      function scoreForKeyword(keyword, providedScore) {
        if (providedScore) {
          return Number(providedScore);
        }
        return commonKeyword(keyword) ? 0 : 1;
      }
      function commonKeyword(keyword) {
        return COMMON_KEYWORDS.includes(keyword.toLowerCase());
      }
      var seenDeprecations = {};
      var error = (message) => {
        console.error(message);
      };
      var warn = (message, ...args) => {
        console.log(`WARN: ${message}`, ...args);
      };
      var deprecated = (version2, message) => {
        if (seenDeprecations[`${version2}/${message}`]) return;
        console.log(`Deprecated as of ${version2}. ${message}`);
        seenDeprecations[`${version2}/${message}`] = true;
      };
      var MultiClassError = new Error();
      function remapScopeNames(mode, regexes, { key }) {
        let offset = 0;
        const scopeNames = mode[key];
        const emit = {};
        const positions = {};
        for (let i = 1; i <= regexes.length; i++) {
          positions[i + offset] = scopeNames[i];
          emit[i + offset] = true;
          offset += countMatchGroups(regexes[i - 1]);
        }
        mode[key] = positions;
        mode[key]._emit = emit;
        mode[key]._multi = true;
      }
      function beginMultiClass(mode) {
        if (!Array.isArray(mode.begin)) return;
        if (mode.skip || mode.excludeBegin || mode.returnBegin) {
          error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
          error("beginScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.begin, { key: "beginScope" });
        mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
      }
      function endMultiClass(mode) {
        if (!Array.isArray(mode.end)) return;
        if (mode.skip || mode.excludeEnd || mode.returnEnd) {
          error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.endScope !== "object" || mode.endScope === null) {
          error("endScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.end, { key: "endScope" });
        mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
      }
      function scopeSugar(mode) {
        if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
          mode.beginScope = mode.scope;
          delete mode.scope;
        }
      }
      function MultiClass(mode) {
        scopeSugar(mode);
        if (typeof mode.beginScope === "string") {
          mode.beginScope = { _wrap: mode.beginScope };
        }
        if (typeof mode.endScope === "string") {
          mode.endScope = { _wrap: mode.endScope };
        }
        beginMultiClass(mode);
        endMultiClass(mode);
      }
      function compileLanguage(language) {
        function langRe(value, global) {
          return new RegExp(
            source(value),
            "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : "")
          );
        }
        class MultiRegex {
          constructor() {
            this.matchIndexes = {};
            this.regexes = [];
            this.matchAt = 1;
            this.position = 0;
          }
          // @ts-ignore
          addRule(re, opts) {
            opts.position = this.position++;
            this.matchIndexes[this.matchAt] = opts;
            this.regexes.push([opts, re]);
            this.matchAt += countMatchGroups(re) + 1;
          }
          compile() {
            if (this.regexes.length === 0) {
              this.exec = () => null;
            }
            const terminators = this.regexes.map((el) => el[1]);
            this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
            this.lastIndex = 0;
          }
          /** @param {string} s */
          exec(s) {
            this.matcherRe.lastIndex = this.lastIndex;
            const match = this.matcherRe.exec(s);
            if (!match) {
              return null;
            }
            const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
            const matchData = this.matchIndexes[i];
            match.splice(0, i);
            return Object.assign(match, matchData);
          }
        }
        class ResumableMultiRegex {
          constructor() {
            this.rules = [];
            this.multiRegexes = [];
            this.count = 0;
            this.lastIndex = 0;
            this.regexIndex = 0;
          }
          // @ts-ignore
          getMatcher(index) {
            if (this.multiRegexes[index]) return this.multiRegexes[index];
            const matcher = new MultiRegex();
            this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
            matcher.compile();
            this.multiRegexes[index] = matcher;
            return matcher;
          }
          resumingScanAtSamePosition() {
            return this.regexIndex !== 0;
          }
          considerAll() {
            this.regexIndex = 0;
          }
          // @ts-ignore
          addRule(re, opts) {
            this.rules.push([re, opts]);
            if (opts.type === "begin") this.count++;
          }
          /** @param {string} s */
          exec(s) {
            const m2 = this.getMatcher(this.regexIndex);
            m2.lastIndex = this.lastIndex;
            let result = m2.exec(s);
            if (this.resumingScanAtSamePosition()) {
              if (result && result.index === this.lastIndex) ;
              else {
                const m22 = this.getMatcher(0);
                m22.lastIndex = this.lastIndex + 1;
                result = m22.exec(s);
              }
            }
            if (result) {
              this.regexIndex += result.position + 1;
              if (this.regexIndex === this.count) {
                this.considerAll();
              }
            }
            return result;
          }
        }
        function buildModeRegex(mode) {
          const mm = new ResumableMultiRegex();
          mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
          if (mode.terminatorEnd) {
            mm.addRule(mode.terminatorEnd, { type: "end" });
          }
          if (mode.illegal) {
            mm.addRule(mode.illegal, { type: "illegal" });
          }
          return mm;
        }
        function compileMode(mode, parent) {
          const cmode = (
            /** @type CompiledMode */
            mode
          );
          if (mode.isCompiled) return cmode;
          [
            scopeClassName,
            // do this early so compiler extensions generally don't have to worry about
            // the distinction between match/begin
            compileMatch,
            MultiClass,
            beforeMatchExt
          ].forEach((ext) => ext(mode, parent));
          language.compilerExtensions.forEach((ext) => ext(mode, parent));
          mode.__beforeBegin = null;
          [
            beginKeywords,
            // do this later so compiler extensions that come earlier have access to the
            // raw array if they wanted to perhaps manipulate it, etc.
            compileIllegal,
            // default to 1 relevance if not specified
            compileRelevance
          ].forEach((ext) => ext(mode, parent));
          mode.isCompiled = true;
          let keywordPattern = null;
          if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
            mode.keywords = Object.assign({}, mode.keywords);
            keywordPattern = mode.keywords.$pattern;
            delete mode.keywords.$pattern;
          }
          keywordPattern = keywordPattern || /\w+/;
          if (mode.keywords) {
            mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
          }
          cmode.keywordPatternRe = langRe(keywordPattern, true);
          if (parent) {
            if (!mode.begin) mode.begin = /\B|\b/;
            cmode.beginRe = langRe(cmode.begin);
            if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
            if (mode.end) cmode.endRe = langRe(cmode.end);
            cmode.terminatorEnd = source(cmode.end) || "";
            if (mode.endsWithParent && parent.terminatorEnd) {
              cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
            }
          }
          if (mode.illegal) cmode.illegalRe = langRe(
            /** @type {RegExp | string} */
            mode.illegal
          );
          if (!mode.contains) mode.contains = [];
          mode.contains = [].concat(...mode.contains.map(function(c2) {
            return expandOrCloneMode(c2 === "self" ? mode : c2);
          }));
          mode.contains.forEach(function(c2) {
            compileMode(
              /** @type Mode */
              c2,
              cmode
            );
          });
          if (mode.starts) {
            compileMode(mode.starts, parent);
          }
          cmode.matcher = buildModeRegex(cmode);
          return cmode;
        }
        if (!language.compilerExtensions) language.compilerExtensions = [];
        if (language.contains && language.contains.includes("self")) {
          throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        }
        language.classNameAliases = inherit$1(language.classNameAliases || {});
        return compileMode(
          /** @type Mode */
          language
        );
      }
      function dependencyOnParent(mode) {
        if (!mode) return false;
        return mode.endsWithParent || dependencyOnParent(mode.starts);
      }
      function expandOrCloneMode(mode) {
        if (mode.variants && !mode.cachedVariants) {
          mode.cachedVariants = mode.variants.map(function(variant) {
            return inherit$1(mode, { variants: null }, variant);
          });
        }
        if (mode.cachedVariants) {
          return mode.cachedVariants;
        }
        if (dependencyOnParent(mode)) {
          return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
        }
        if (Object.isFrozen(mode)) {
          return inherit$1(mode);
        }
        return mode;
      }
      var version = "11.12.0";
      var HTMLInjectionError = class extends Error {
        constructor(reason, html) {
          super(reason);
          this.name = "HTMLInjectionError";
          this.html = html;
        }
      };
      var escape = escapeHTML;
      var inherit = inherit$1;
      var NO_MATCH = /* @__PURE__ */ Symbol("nomatch");
      var MAX_KEYWORD_HITS = 7;
      var HLJS = function(hljs) {
        const languages = /* @__PURE__ */ Object.create(null);
        const aliases = /* @__PURE__ */ Object.create(null);
        const plugins = [];
        let SAFE_MODE = true;
        const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
        const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
        let options = {
          ignoreUnescapedHTML: false,
          throwUnescapedHTML: false,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          cssSelector: "pre code",
          languages: null,
          // beta configuration options, subject to change, welcome to discuss
          // https://github.com/highlightjs/highlight.js/issues/1086
          __emitter: TokenTreeEmitter
        };
        function shouldNotHighlight(languageName) {
          return options.noHighlightRe.test(languageName);
        }
        function blockLanguage(block) {
          let classes = block.className + " ";
          classes += block.parentNode ? block.parentNode.className : "";
          const match = options.languageDetectRe.exec(classes);
          if (match) {
            const language = getLanguage(match[1]);
            if (!language) {
              warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
              warn("Falling back to no-highlight mode for this block.", block);
            }
            return language ? match[1] : "no-highlight";
          }
          return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
        }
        function highlight2(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
          let code = "";
          let languageName = "";
          if (typeof optionsOrCode === "object") {
            code = codeOrLanguageName;
            ignoreIllegals = optionsOrCode.ignoreIllegals;
            languageName = optionsOrCode.language;
          } else {
            deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
            deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
            languageName = codeOrLanguageName;
            code = optionsOrCode;
          }
          if (ignoreIllegals === void 0) {
            ignoreIllegals = true;
          }
          const context = {
            code,
            language: languageName
          };
          fire("before:highlight", context);
          const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
          result.code = context.code;
          fire("after:highlight", result);
          return result;
        }
        function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
          const keywordHits = /* @__PURE__ */ Object.create(null);
          function keywordData(mode, matchText) {
            return mode.keywords[matchText];
          }
          function processKeywords() {
            if (!top.keywords) {
              emitter.addText(modeBuffer);
              return;
            }
            let lastIndex = 0;
            top.keywordPatternRe.lastIndex = 0;
            let match = top.keywordPatternRe.exec(modeBuffer);
            let buf = "";
            while (match) {
              buf += modeBuffer.substring(lastIndex, match.index);
              const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
              const data = keywordData(top, word);
              if (data) {
                const [kind, keywordRelevance] = data;
                emitter.addText(buf);
                buf = "";
                keywordHits[word] = (keywordHits[word] || 0) + 1;
                if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
                if (kind.startsWith("_")) {
                  buf += match[0];
                } else {
                  const cssClass = language.classNameAliases[kind] || kind;
                  emitKeyword(match[0], cssClass);
                }
              } else {
                buf += match[0];
              }
              lastIndex = top.keywordPatternRe.lastIndex;
              match = top.keywordPatternRe.exec(modeBuffer);
            }
            buf += modeBuffer.substring(lastIndex);
            emitter.addText(buf);
          }
          function processSubLanguage() {
            if (modeBuffer === "") return;
            let result2 = null;
            if (typeof top.subLanguage === "string") {
              if (!languages[top.subLanguage]) {
                emitter.addText(modeBuffer);
                return;
              }
              result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
              continuations[top.subLanguage] = /** @type {CompiledMode} */
              result2._top;
            } else {
              result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
            }
            if (top.relevance > 0) {
              relevance += result2.relevance;
            }
            emitter.__addSublanguage(result2._emitter, result2.language);
          }
          function processBuffer() {
            if (top.subLanguage != null) {
              processSubLanguage();
            } else {
              processKeywords();
            }
            modeBuffer = "";
          }
          function emitKeyword(keyword, scope) {
            if (keyword === "") return;
            emitter.startScope(scope);
            emitter.addText(keyword);
            emitter.endScope();
          }
          function emitMultiClass(scope, match) {
            let i = 1;
            const max = match.length - 1;
            while (i <= max) {
              if (!scope._emit[i]) {
                i++;
                continue;
              }
              const klass = language.classNameAliases[scope[i]] || scope[i];
              const text = match[i];
              if (klass) {
                emitKeyword(text, klass);
              } else {
                modeBuffer = text;
                processKeywords();
                modeBuffer = "";
              }
              i++;
            }
          }
          function startNewMode(mode, match) {
            if (mode.scope && typeof mode.scope === "string") {
              emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
            }
            if (mode.beginScope) {
              if (mode.beginScope._wrap) {
                emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
                modeBuffer = "";
              } else if (mode.beginScope._multi) {
                emitMultiClass(mode.beginScope, match);
                modeBuffer = "";
              }
            }
            top = Object.create(mode, { parent: { value: top } });
            return top;
          }
          function endOfMode(mode, match, matchPlusRemainder) {
            let matched = startsWith(mode.endRe, matchPlusRemainder);
            if (matched) {
              if (mode["on:end"]) {
                const resp = new Response(mode);
                mode["on:end"](match, resp);
                if (resp.isMatchIgnored) matched = false;
              }
              if (matched) {
                while (mode.endsParent && mode.parent) {
                  mode = mode.parent;
                }
                return mode;
              }
            }
            if (mode.endsWithParent) {
              return endOfMode(mode.parent, match, matchPlusRemainder);
            }
          }
          function doIgnore(lexeme) {
            if (top.matcher.regexIndex === 0) {
              modeBuffer += lexeme[0];
              return 1;
            } else {
              resumeScanAtSamePosition = true;
              return 0;
            }
          }
          function doBeginMatch(match) {
            const lexeme = match[0];
            const newMode = match.rule;
            const resp = new Response(newMode);
            const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
            for (const cb of beforeCallbacks) {
              if (!cb) continue;
              cb(match, resp);
              if (resp.isMatchIgnored) return doIgnore(lexeme);
            }
            if (newMode.skip) {
              modeBuffer += lexeme;
            } else {
              if (newMode.excludeBegin) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (!newMode.returnBegin && !newMode.excludeBegin) {
                modeBuffer = lexeme;
              }
            }
            startNewMode(newMode, match);
            return newMode.returnBegin ? 0 : lexeme.length;
          }
          function doEndMatch(match) {
            const lexeme = match[0];
            const matchPlusRemainder = codeToHighlight.substring(match.index);
            const endMode = endOfMode(top, match, matchPlusRemainder);
            if (!endMode) {
              return NO_MATCH;
            }
            const origin = top;
            if (top.endScope && top.endScope._wrap) {
              processBuffer();
              emitKeyword(lexeme, top.endScope._wrap);
            } else if (top.endScope && top.endScope._multi) {
              processBuffer();
              emitMultiClass(top.endScope, match);
            } else if (origin.skip) {
              modeBuffer += lexeme;
            } else {
              if (!(origin.returnEnd || origin.excludeEnd)) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (origin.excludeEnd) {
                modeBuffer = lexeme;
              }
            }
            do {
              if (top.scope) {
                emitter.closeNode();
              }
              if (!top.skip && !top.subLanguage) {
                relevance += top.relevance;
              }
              top = top.parent;
            } while (top !== endMode.parent);
            if (endMode.starts) {
              startNewMode(endMode.starts, match);
            }
            return origin.returnEnd ? 0 : lexeme.length;
          }
          function processContinuations() {
            const list = [];
            for (let current = top; current !== language; current = current.parent) {
              if (current.scope) {
                list.unshift(current.scope);
              }
            }
            list.forEach((item) => emitter.openNode(item));
          }
          let lastMatch = {};
          function processLexeme(textBeforeMatch, match) {
            const lexeme = match && match[0];
            modeBuffer += textBeforeMatch;
            if (lexeme == null) {
              processBuffer();
              return 0;
            }
            if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
              modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
              if (!SAFE_MODE) {
                const err = new Error(`0 width match regex (${languageName})`);
                err.languageName = languageName;
                err.badRule = lastMatch.rule;
                throw err;
              }
              return 1;
            }
            lastMatch = match;
            if (match.type === "begin") {
              return doBeginMatch(match);
            } else if (match.type === "illegal" && !ignoreIllegals) {
              const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
              err.mode = top;
              throw err;
            } else if (match.type === "end") {
              const processed = doEndMatch(match);
              if (processed !== NO_MATCH) {
                return processed;
              }
            }
            if (match.type === "illegal" && lexeme === "") {
              if (match.index === codeToHighlight.length) ;
              else {
                modeBuffer += "\n";
              }
              return 1;
            }
            if (iterations > 1e5 && iterations > match.index * 3) {
              const err = new Error("potential infinite loop, way more iterations than matches");
              throw err;
            }
            modeBuffer += lexeme;
            return lexeme.length;
          }
          const language = getLanguage(languageName);
          if (!language) {
            error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
            throw new Error('Unknown language: "' + languageName + '"');
          }
          const md = compileLanguage(language);
          let result = "";
          let top = continuation || md;
          const continuations = {};
          const emitter = new options.__emitter(options);
          processContinuations();
          let modeBuffer = "";
          let relevance = 0;
          let index = 0;
          let iterations = 0;
          let resumeScanAtSamePosition = false;
          try {
            if (!language.__emitTokens) {
              top.matcher.considerAll();
              for (; ; ) {
                iterations++;
                if (resumeScanAtSamePosition) {
                  resumeScanAtSamePosition = false;
                } else {
                  top.matcher.considerAll();
                }
                top.matcher.lastIndex = index;
                const match = top.matcher.exec(codeToHighlight);
                if (!match) break;
                const beforeMatch = codeToHighlight.substring(index, match.index);
                const processedCount = processLexeme(beforeMatch, match);
                index = match.index + processedCount;
              }
              processLexeme(codeToHighlight.substring(index));
            } else {
              language.__emitTokens(codeToHighlight, emitter);
            }
            emitter.finalize();
            result = emitter.toHTML();
            return {
              language: languageName,
              value: result,
              relevance,
              illegal: false,
              _emitter: emitter,
              _top: top
            };
          } catch (err) {
            if (err.message && err.message.includes("Illegal")) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: true,
                relevance: 0,
                _illegalBy: {
                  message: err.message,
                  index,
                  context: codeToHighlight.slice(index - 100, index + 100),
                  mode: err.mode,
                  resultSoFar: result
                },
                _emitter: emitter
              };
            } else if (SAFE_MODE) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: false,
                relevance: 0,
                errorRaised: err,
                _emitter: emitter,
                _top: top
              };
            } else {
              throw err;
            }
          }
        }
        function justTextHighlightResult(code) {
          const result = {
            value: escape(code),
            illegal: false,
            relevance: 0,
            _top: PLAINTEXT_LANGUAGE,
            _emitter: new options.__emitter(options)
          };
          result._emitter.addText(code);
          return result;
        }
        function highlightAuto(code, languageSubset) {
          languageSubset = languageSubset || options.languages || Object.keys(languages);
          const plaintext2 = justTextHighlightResult(code);
          const results = languageSubset.filter(getLanguage).filter(autoDetection).map(
            (name) => _highlight(name, code, false)
          );
          results.unshift(plaintext2);
          const sorted = results.sort((a, b2) => {
            if (a.relevance !== b2.relevance) return b2.relevance - a.relevance;
            if (a.language && b2.language) {
              if (getLanguage(a.language).supersetOf === b2.language) {
                return 1;
              } else if (getLanguage(b2.language).supersetOf === a.language) {
                return -1;
              }
            }
            return 0;
          });
          const [best, secondBest] = sorted;
          const result = best;
          result.secondBest = secondBest;
          return result;
        }
        function updateClassName(element, currentLang, resultLang) {
          const language = currentLang && aliases[currentLang] || resultLang;
          element.classList.add("hljs");
          element.classList.add(`language-${language}`);
        }
        function highlightElement(element) {
          let node = null;
          const language = blockLanguage(element);
          if (shouldNotHighlight(language)) return;
          fire(
            "before:highlightElement",
            { el: element, language }
          );
          if (element.dataset.highlighted) {
            console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
            return;
          }
          if (element.children.length > 0) {
            if (!options.ignoreUnescapedHTML) {
              console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
              console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
              console.warn("The element with unescaped HTML:");
              console.warn(element);
            }
            if (options.throwUnescapedHTML) {
              const err = new HTMLInjectionError(
                "One of your code blocks includes unescaped HTML.",
                element.innerHTML
              );
              throw err;
            }
          }
          node = element;
          const text = node.textContent;
          const result = language ? highlight2(text, { language, ignoreIllegals: true }) : highlightAuto(text);
          element.innerHTML = result.value;
          element.dataset.highlighted = "yes";
          updateClassName(element, language, result.language);
          element.result = {
            language: result.language,
            // TODO: remove with version 11.0
            re: result.relevance,
            relevance: result.relevance
          };
          if (result.secondBest) {
            element.secondBest = {
              language: result.secondBest.language,
              relevance: result.secondBest.relevance
            };
          }
          fire("after:highlightElement", { el: element, result, text });
        }
        function configure(userOptions) {
          options = inherit(options, userOptions);
        }
        const initHighlighting = () => {
          highlightAll();
          deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
        };
        function initHighlightingOnLoad() {
          highlightAll();
          deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
        }
        let wantsHighlight = false;
        function highlightAll() {
          function boot() {
            highlightAll();
          }
          if (document.readyState === "loading") {
            if (!wantsHighlight) {
              window.addEventListener("DOMContentLoaded", boot, false);
            }
            wantsHighlight = true;
            return;
          }
          const blocks = document.querySelectorAll(options.cssSelector);
          blocks.forEach(highlightElement);
        }
        function registerLanguage(languageName, languageDefinition) {
          let lang = null;
          try {
            lang = languageDefinition(hljs);
          } catch (error$1) {
            error("Language definition for '{}' could not be registered.".replace("{}", languageName));
            if (!SAFE_MODE) {
              throw error$1;
            } else {
              error(error$1);
            }
            lang = PLAINTEXT_LANGUAGE;
          }
          if (!lang.name) lang.name = languageName;
          languages[languageName] = lang;
          lang.rawDefinition = languageDefinition.bind(null, hljs);
          if (lang.aliases) {
            registerAliases(lang.aliases, { languageName });
          }
        }
        function unregisterLanguage(languageName) {
          delete languages[languageName];
          for (const alias of Object.keys(aliases)) {
            if (aliases[alias] === languageName) {
              delete aliases[alias];
            }
          }
        }
        function listLanguages() {
          return Object.keys(languages);
        }
        function getLanguage(name) {
          name = (name || "").toLowerCase();
          return languages[name] || languages[aliases[name]];
        }
        function registerAliases(aliasList, { languageName }) {
          if (typeof aliasList === "string") {
            aliasList = [aliasList];
          }
          aliasList.forEach((alias) => {
            aliases[alias.toLowerCase()] = languageName;
          });
        }
        function autoDetection(name) {
          const lang = getLanguage(name);
          return lang && !lang.disableAutodetect;
        }
        function upgradePluginAPI(plugin) {
          if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
            plugin["before:highlightElement"] = (data) => {
              plugin["before:highlightBlock"](
                Object.assign({ block: data.el }, data)
              );
            };
          }
          if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
            plugin["after:highlightElement"] = (data) => {
              plugin["after:highlightBlock"](
                Object.assign({ block: data.el }, data)
              );
            };
          }
        }
        function addPlugin(plugin) {
          upgradePluginAPI(plugin);
          plugins.push(plugin);
        }
        function removePlugin(plugin) {
          const index = plugins.indexOf(plugin);
          if (index !== -1) {
            plugins.splice(index, 1);
          }
        }
        function fire(event, args) {
          const cb = event;
          plugins.forEach(function(plugin) {
            if (plugin[cb]) {
              plugin[cb](args);
            }
          });
        }
        function deprecateHighlightBlock(el) {
          deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
          deprecated("10.7.0", "Please use highlightElement now.");
          return highlightElement(el);
        }
        Object.assign(hljs, {
          highlight: highlight2,
          highlightAuto,
          highlightAll,
          highlightElement,
          // TODO: Remove with v12 API
          highlightBlock: deprecateHighlightBlock,
          configure,
          initHighlighting,
          initHighlightingOnLoad,
          registerLanguage,
          unregisterLanguage,
          listLanguages,
          getLanguage,
          registerAliases,
          autoDetection,
          inherit,
          addPlugin,
          removePlugin
        });
        hljs.debugMode = function() {
          SAFE_MODE = false;
        };
        hljs.safeMode = function() {
          SAFE_MODE = true;
        };
        hljs.versionString = version;
        hljs.regex = {
          concat,
          lookahead,
          either,
          optional,
          anyNumberOfTimes
        };
        for (const key in MODES2) {
          if (typeof MODES2[key] === "object") {
            deepFreeze(MODES2[key]);
          }
        }
        Object.assign(hljs, MODES2);
        return hljs;
      };
      var highlight = HLJS({});
      highlight.newInstance = () => HLJS({});
      module.exports = highlight;
      highlight.HighlightJS = highlight;
      highlight.default = highlight;
    }
  });

  // src/index.js
  var index_exports = {};
  __export(index_exports, {
    PLATFORMS: () => PLATFORMS,
    PostRenderer: () => PostRenderer,
    THEMES: () => THEMES,
    build: () => build,
    deepMerge: () => deepMerge,
    getPlatform: () => getPlatform,
    getTheme: () => getTheme,
    makeTheme: () => makeTheme
  });

  // node_modules/marked/lib/marked.esm.js
  function A() {
    return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
  }
  var T = A();
  function U(l3) {
    T = l3;
  }
  var E = { exec: () => null };
  function I(l3) {
    let e = [];
    return (t) => {
      let n = Math.max(0, Math.min(3, t - 1)), i = e[n];
      return i || (i = l3(n), e[n] = i), i;
    };
  }
  function d(l3, e = "") {
    let t = typeof l3 == "string" ? l3 : l3.source, n = { replace: (i, r) => {
      let o = typeof r == "string" ? r : r.source;
      return o = o.replace(m.caret, "$1"), t = t.replace(i, o), n;
    }, getRegex: () => new RegExp(t, e) };
    return n;
  }
  var we = ((l3 = "") => {
    try {
      return !!new RegExp("(?<=1)(?<!1)" + l3);
    } catch {
      return false;
    }
  })();
  var m = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (l3) => new RegExp(`^( {0,3}${l3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: I((l3) => new RegExp(`^ {0,${l3}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: I((l3) => new RegExp(`^ {0,${l3}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: I((l3) => new RegExp(`^ {0,${l3}}(?:\`\`\`|~~~)`)), headingBeginRegex: I((l3) => new RegExp(`^ {0,${l3}}#`)), htmlBeginRegex: I((l3) => new RegExp(`^ {0,${l3}}(?:</?(?:${H})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: I((l3) => new RegExp(`^ {0,${l3}}>`)) };
  var ye = /^(?:[ \t]*(?:\n|$))+/;
  var Pe = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  var Se = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var v = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var _e = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var K = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
  var le = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  var ue = d(le).replace(/bull/g, K).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  var $e = d(le).replace(/bull/g, K).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  var W = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/;
  var Le = /^[^\n]+/;
  var X = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
  var ze = d(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", X).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var Ee = d(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, K).getRegex();
  var H = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var J = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var Me = d("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", J).replace("tag", H).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var pe = (l3) => d(W).replace("hr", v).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", l3).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex();
  var Ae = pe(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/);
  var Ie = pe(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/);
  var Ce = d(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ie).getRegex();
  var V = { blockquote: Ce, code: Pe, def: ze, fences: Se, heading: _e, hr: v, html: Me, lheading: ue, list: Ee, newline: ye, paragraph: Ae, table: E, text: Le };
  var ie = d("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", v).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex();
  var Be = { ...V, lheading: $e, table: ie, paragraph: d(W).replace("hr", v).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ie).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex() };
  var De = { ...V, html: d(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", J).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: E, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: d(W).replace("hr", v).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ue).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
  var qe = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var ve = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var ce = /^( {2,}|\\)\n(?!\s*$)[ \t]*/;
  var He = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var _ = /[\p{P}\p{S}]/u;
  var C = /[\s\p{P}\p{S}]/u;
  var Z = /[^\s\p{P}\p{S}]/u;
  var Ze = d(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, C).getRegex();
  var Ge = /[\p{Pi}\p{Ps}"']/u;
  var he = /(?!~)[\p{P}\p{S}]/u;
  var Qe = /(?!~)[\s\p{P}\p{S}]/u;
  var Ne = /(?:[^\s\p{P}\p{S}]|~)/u;
  var je = d(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", we ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
  var de = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
  var Ue = d(de, "u").replace(/punct/g, _).getRegex();
  var Fe = d(de, "u").replace(/punct/g, he).getRegex();
  var Ke = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/;
  var We = d(Ke, "u").replace(/openQuote/g, Ge).replace(/punct/g, _).getRegex();
  var ke = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
  var Xe = d(ke, "gu").replace(/notPunctSpace/g, Z).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
  var Je = d(ke, "gu").replace(/notPunctSpace/g, Ne).replace(/punctSpace/g, Qe).replace(/punct/g, he).getRegex();
  var Ve = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)";
  var Ye = d(Ve, "gu").replace(/notPunctSpace/g, Z).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
  var et = d("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Z).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
  var tt = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)";
  var nt = d(tt, "gu").replace(/notPunctSpace/g, Z).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
  var rt = d(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, _).getRegex();
  var st = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
  var it = d(st, "gu").replace(/notPunctSpace/g, Z).replace(/punctSpace/g, C).replace(/punct/g, _).getRegex();
  var ot = d(/\\(punct)/, "gu").replace(/punct/g, _).getRegex();
  var at = d(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var lt = d(J).replace("(?:-->|$)", "-->").getRegex();
  var ut = d("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", lt).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var ge = /\[(?:\\[\s\S]|[^\[\]\\])*\]/;
  var N = d(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", ge).getRegex();
  var pt = d(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", N).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var ct = d(/^!?\[(label)\]\[(ref)\]/).replace("label", N).replace("ref", X).getRegex();
  var ht = d(/^!?\[(ref)\](?:\[\])?/).replace("ref", X).getRegex();
  var oe = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/;
  var dt = d(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", ge).getRegex();
  var kt = d("reflink|nolink(?!\\()", "g").replace("reflink", d(/^!?\[(label)\]\[(ref)\]/).replace("label", dt).replace("ref", oe).getRegex()).replace("nolink", d(/^!?\[(ref)\](?:\[\])?/).replace("ref", oe).getRegex()).getRegex();
  var ae = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
  var Y = { _backpedal: E, anyPunctuation: ot, autolink: at, blockSkip: je, br: ce, code: ve, del: E, delLDelim: E, delRDelim: E, emStrongLDelim: Ue, emStrongRDelimAst: Xe, emStrongRDelimUnd: et, escape: qe, link: pt, nolink: ht, punctuation: Ze, reflink: ct, reflinkSearch: kt, tag: ut, text: He, url: E };
  var gt = { ...Y, emStrongLDelim: We, emStrongRDelimAst: Ye, emStrongRDelimUnd: nt, link: d(/^!?\[(label)\]\((.*?)\)/).replace("label", N).getRegex(), reflink: d(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", N).getRegex() };
  var F = { ...Y, emStrongRDelimAst: Je, emStrongLDelim: Fe, delLDelim: rt, delRDelim: it, url: d(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ae).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: d(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ae).getRegex() };
  var ft = { ...F, br: d(ce).replace("{2,}", "*").getRegex(), text: d(F.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
  var G = { normal: V, gfm: Be, pedantic: De };
  var B = { normal: Y, gfm: F, breaks: ft, pedantic: gt };
  var mt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  var fe = (l3) => mt[l3];
  function R(l3, e) {
    if (e) {
      if (m.escapeTest.test(l3)) return l3.replace(m.escapeReplace, fe);
    } else if (m.escapeTestNoEncode.test(l3)) return l3.replace(m.escapeReplaceNoEncode, fe);
    return l3;
  }
  function ee(l3) {
    try {
      l3 = encodeURI(l3).replace(m.percentDecode, "%");
    } catch {
      return null;
    }
    return l3;
  }
  function te(l3, e) {
    let t = l3.replace(m.findPipe, (r, o, s) => {
      let u = false, a = o;
      for (; --a >= 0 && s[a] === "\\"; ) u = !u;
      return u ? "|" : " |";
    }), n = t.split(m.splitPipe), i = 0;
    if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
    else for (; n.length < e; ) n.push("");
    for (; i < n.length; i++) n[i] = n[i].trim().replace(m.slashPipe, "|");
    return n;
  }
  function $(l3, e, t) {
    let n = l3.length;
    if (n === 0) return "";
    let i = 0;
    for (; i < n; ) {
      let r = l3.charAt(n - i - 1);
      if (r === e && !t) i++;
      else if (r !== e && t) i++;
      else break;
    }
    return l3.slice(0, n - i);
  }
  function ne(l3) {
    let e = l3.split(`
`), t = e.length - 1;
    for (; t >= 0 && m.blankLine.test(e[t]); ) t--;
    return e.length - t <= 2 ? l3 : e.slice(0, t + 1).join(`
`);
  }
  function D(l3) {
    return l3.toLowerCase().toUpperCase().toLowerCase();
  }
  function me(l3, e) {
    if (l3.indexOf(e[1]) === -1) return -1;
    let t = 0;
    for (let n = 0; n < l3.length; n++) if (l3[n] === "\\") n++;
    else if (l3[n] === e[0]) t++;
    else if (l3[n] === e[1] && (t--, t < 0)) return n;
    return t > 0 ? -2 : -1;
  }
  function xe(l3, e = 0) {
    let t = e, n = "";
    for (let i of l3) if (i === "	") {
      let r = 4 - t % 4;
      n += " ".repeat(r), t += r;
    } else n += i, t++;
    return n;
  }
  function be(l3, e, t, n, i) {
    let r = e.href, o = e.title || null, s = l3[1].replace(i.other.outputLinkReplace, "$1"), u = l3[0].charAt(0) === "!";
    n.state.inLink = true;
    let a = n.state.linkEmitted, p = n.state.inRawBlock;
    n.state.linkEmitted = false;
    let c2 = n.inlineTokens(s), h = n.state.linkEmitted;
    if (n.state.linkEmitted = a, n.state.inLink = false, !u) {
      if (h) {
        n.state.inRawBlock = p;
        return;
      }
      n.state.linkEmitted = true;
    }
    return { type: u ? "image" : "link", raw: t, href: r, title: o, text: s, tokens: c2 };
  }
  function xt(l3, e, t) {
    let n = l3.match(t.other.indentCodeCompensation);
    if (n === null) return e;
    let i = n[1];
    return e.split(`
`).map((r) => {
      let o = r.match(t.other.beginningSpace);
      if (o === null) return r;
      let [s] = o;
      return r.slice(Math.min(s.length, i.length));
    }).join(`
`);
  }
  function Re(l3, e, t, n) {
    if (!e.includes("<")) return false;
    for (let i = 0; i < e.length; i++) {
      if (e[i] === "\\") {
        i++;
        continue;
      }
      if (e[i] === "`") {
        let s = n.inline.code.exec(e.slice(i));
        if (s) {
          i += s[0].length - 1;
          continue;
        }
      }
      if (e[i] !== "<") continue;
      let r = l3.slice(t + i), o = n.inline.tag.exec(r) || n.inline.autolink.exec(r);
      if (o) {
        if (o[0].length > e.length - i) return true;
        i += o[0].length - 1;
      }
    }
    return false;
  }
  var y = class {
    constructor(e) {
      __publicField(this, "options");
      __publicField(this, "rules");
      __publicField(this, "lexer");
      this.options = e || T;
    }
    space(e) {
      let t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      let t = this.rules.block.code.exec(e);
      if (t) {
        let n = this.options.pedantic ? t[0] : ne(t[0]), i = n.replace(this.rules.other.codeRemoveIndent, "");
        return { type: "code", raw: n, codeBlockStyle: "indented", text: i };
      }
    }
    fences(e) {
      let t = this.rules.block.fences.exec(e);
      if (t) {
        let n = t[0], i = xt(n, t[3] || "", this.rules);
        return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
      }
    }
    heading(e) {
      let t = this.rules.block.heading.exec(e);
      if (t) {
        let n = t[2].trim();
        if (this.rules.other.endingHash.test(n)) {
          let i = $(n, "#");
          (this.options.pedantic || !i || this.rules.other.endingSpaceTabChar.test(i)) && (n = i.trim());
        }
        return { type: "heading", raw: $(t[0], `
`), depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
      }
    }
    hr(e) {
      let t = this.rules.block.hr.exec(e);
      if (t) return { type: "hr", raw: $(t[0], `
`) };
    }
    blockquote(e) {
      let t = this.rules.block.blockquote.exec(e);
      if (t) {
        let n = $(t[0], `
`).split(`
`), i = "", r = "", o = [];
        for (; n.length > 0; ) {
          let s = false, u = [], a;
          for (a = 0; a < n.length; a++) if (this.rules.other.blockquoteStart.test(n[a])) u.push(n[a]), s = true;
          else if (!s) u.push(n[a]);
          else break;
          n = n.slice(a);
          let p = u.join(`
`), c2 = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
          i = i ? `${i}
${p}` : p, r = r ? `${r}
${c2}` : c2;
          let h = this.lexer.state.top;
          if (this.lexer.state.top = true, this.lexer.blockTokens(c2, o, true), this.lexer.state.top = h, n.length === 0) break;
          let k = o.at(-1);
          if (k?.type === "code") break;
          if (k?.type === "blockquote") {
            let O = k, g = n.join(`
`), w = O.raw + `
` + g.replace(this.rules.other.blockquoteSetextReplace2, ""), z = this.blockquote(w);
            o[o.length - 1] = z, i = `${i}
${g}`, r = r.substring(0, r.length - O.text.length) + z.text;
            break;
          } else if (k?.type === "list") {
            let O = k, g = O.raw + `
` + n.join(`
`), w = this.list(g);
            o[o.length - 1] = w, i = i.substring(0, i.length - k.raw.length) + w.raw, r = r.substring(0, r.length - O.raw.length) + w.raw, n = g.substring(o.at(-1).raw.length).split(`
`);
            continue;
          }
        }
        return { type: "blockquote", raw: i, tokens: o, text: r };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim(), i = n.length > 1, r = { type: "list", raw: "", ordered: i, start: i ? +n.slice(0, -1) : "", loose: false, items: [] };
        n = i ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = i ? n : "[*+-]");
        let o = this.rules.other.listItemRegex(n), s = false;
        for (; e; ) {
          let a = false, p = "", c2 = "";
          if (!(t = o.exec(e)) || this.rules.block.hr.test(e)) break;
          p = t[0], e = e.substring(p.length);
          let h = xe(t[2].split(`
`, 1)[0], t[1].length), k = e.split(`
`, 1)[0], O = !h.trim(), g = 0;
          if (this.options.pedantic ? (g = 2, c2 = h.trimStart()) : O ? g = t[1].length + 1 : (g = h.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c2 = h.slice(g), g += t[1].length), O && this.rules.other.blankLine.test(k) && (p += k + `
`, e = e.substring(k.length + 1), a = true), !a) {
            let w = this.rules.other.nextBulletRegex(g), z = this.rules.other.hrRegex(g), re = this.rules.other.fencesBeginRegex(g), se = this.rules.other.headingBeginRegex(g), Te = this.rules.other.htmlBeginRegex(g), Oe = this.rules.other.blockquoteBeginRegex(g);
            for (; e; ) {
              let j = e.split(`
`, 1)[0], q;
              if (k = j, this.options.pedantic ? (k = k.replace(this.rules.other.listReplaceNesting, "  "), q = k) : q = k.replace(this.rules.other.tabCharGlobal, "    "), re.test(k) || se.test(k) || Te.test(k) || Oe.test(k) || w.test(k) || z.test(k)) break;
              if (q.search(this.rules.other.nonSpaceChar) >= g || !k.trim()) c2 += `
` + q.slice(g);
              else {
                if (O || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || re.test(h) || se.test(h) || z.test(h)) break;
                c2 += `
` + k;
              }
              O = !k.trim(), p += j + `
`, e = e.substring(j.length + 1), h = q.slice(g);
            }
          }
          r.loose || (s ? r.loose = true : this.rules.other.doubleBlankLine.test(p) && (s = true)), r.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c2), loose: false, text: c2, tokens: [] }), r.raw += p;
        }
        let u = r.items.at(-1);
        if (u) u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
        else return;
        r.raw = r.raw.trimEnd();
        for (let a of r.items) if (this.lexer.state.top = false, a.tokens = this.lexer.blockTokens(a.text, []), !r.loose) {
          let p = a.tokens.filter((h) => h.type === "space"), c2 = p.length > 0 && p.some((h) => this.rules.other.anyLine.test(h.raw));
          r.loose = c2;
        }
        for (let a of r.items) {
          let p = a.tokens[0];
          if (a.task && (p?.type === "text" || p?.type === "paragraph")) {
            a.text = a.text.replace(this.rules.other.listReplaceTask, ""), p.raw = p.raw.replace(this.rules.other.listReplaceTask, ""), p.text = p.text.replace(this.rules.other.listReplaceTask, "");
            for (let h = this.lexer.inlineQueue.length - 1; h >= 0; h--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)) {
              this.lexer.inlineQueue[h].src = this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
            let c2 = this.rules.other.listTaskCheckbox.exec(a.raw);
            if (c2) {
              let h = { type: "checkbox", raw: c2[0] + " ", checked: c2[0] !== "[ ]" };
              a.checked = h.checked, r.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = h.raw + a.tokens[0].raw, a.tokens[0].text = h.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(h)) : a.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : a.tokens.unshift(h);
            }
          } else a.task && (a.task = false);
        }
        if (r.loose) for (let a of r.items) {
          a.loose = true;
          for (let p of a.tokens) p.type === "text" && (p.type = "paragraph");
        }
        return r;
      }
    }
    html(e) {
      let t = this.rules.block.html.exec(e);
      if (t) {
        let n = ne(t[0]);
        return { type: "html", block: true, raw: n, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: n };
      }
    }
    def(e) {
      let t = this.rules.block.def.exec(e);
      if (t) {
        let n = D(t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
        return { type: "def", tag: n, raw: $(t[0], `
`), href: i, title: r };
      }
    }
    table(e) {
      let t = this.rules.block.table.exec(e);
      if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
      let n = te(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = { type: "table", raw: $(t[0], `
`), header: [], align: [], rows: [] };
      if (n.length === i.length) {
        for (let s of i) this.rules.other.tableAlignRight.test(s) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? o.align.push("left") : o.align.push(null);
        for (let s = 0; s < n.length; s++) o.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: true, align: o.align[s] });
        for (let s of r) o.rows.push(te(s, o.header.length).map((u, a) => ({ text: u, tokens: this.lexer.inline(u), header: false, align: o.align[a] })));
        return o;
      }
    }
    lheading(e) {
      let t = this.rules.block.lheading.exec(e);
      if (t) {
        let n = t[1].trim();
        return { type: "heading", raw: $(t[0], `
`), depth: t[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
      }
    }
    paragraph(e) {
      let t = this.rules.block.paragraph.exec(e);
      if (t) {
        let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
        return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
      }
    }
    text(e) {
      let t = this.rules.block.text.exec(e);
      if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
    }
    escape(e) {
      let t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: t[1] };
    }
    tag(e) {
      let t = this.rules.inline.tag.exec(e);
      if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
    }
    link(e) {
      let t = this.rules.inline.link.exec(e);
      if (t) {
        let n = t[0].charAt(0) === "!" ? 2 : 1;
        if (!this.options.pedantic && Re(e, t[1], n, this.rules)) return;
        let i = t[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(i)) {
          if (!this.rules.other.endAngleBracket.test(i)) return;
          let s = $(i.slice(0, -1), "\\");
          if ((i.length - s.length) % 2 === 0) return;
        } else {
          let s = me(t[2], "()");
          if (s === -2) return;
          if (s > -1) {
            let a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
            t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, a).trim(), t[3] = "";
          }
        }
        let r = t[2], o = "";
        if (this.options.pedantic) {
          let s = this.rules.other.pedanticHrefTitle.exec(r);
          s && (r = s[1], o = s[3]);
        } else o = t[3] ? t[3].slice(1, -1) : "";
        return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(i) ? r = r.slice(1) : r = r.slice(1, -1)), be(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: o && o.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
      }
    }
    reflink(e, t) {
      let n;
      if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
        let i = n[0].charAt(0) === "!" ? 2 : 1;
        if (!this.options.pedantic && Re(e, n[1], i, this.rules)) return;
        let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), o = t[D(r)];
        if (!o) {
          let s = n[0].charAt(0);
          return { type: "text", raw: s, text: s };
        }
        return be(n, o, n[0], this.lexer, this.rules);
      }
    }
    emStrong(e, t, n = "") {
      let i = this.rules.inline.emStrongLDelim.exec(e);
      if (!i || !i[1] && !i[2] && !i[3] && !i[4] || i[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
      if (!(i[1] || i[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let o = [...i[0]].length - 1, s, u, a = o, p = 0, c2 = i[0][0], h = n === c2, k = c2 === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        for (k.lastIndex = 0, t = t.slice(-1 * e.length + o); (i = k.exec(t)) !== null; ) {
          if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s) continue;
          if (u = [...s].length, i[3] || i[4]) {
            a += u;
            continue;
          } else if (i[5] || i[6]) {
            if (o % 3 && !((o + u) % 3)) {
              p += u;
              continue;
            }
            if (h) break;
          }
          if (a -= u, a > 0) continue;
          u = Math.min(u, u + a + p);
          let O = [...i[0]][0].length, g = e.slice(0, o + i.index + O + u);
          if (Math.min(o, u) % 2) {
            let z = g.slice(1, -1);
            return { type: "em", raw: g, text: z, tokens: this.lexer.inlineTokens(z) };
          }
          let w = g.slice(2, -2);
          return { type: "strong", raw: g, text: w, tokens: this.lexer.inlineTokens(w) };
        }
      }
    }
    codespan(e) {
      let t = this.rules.inline.code.exec(e);
      if (t) {
        let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), i = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
        return i && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
      }
    }
    br(e) {
      let t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e, t, n = "") {
      let i = this.rules.inline.delLDelim.exec(e);
      if (!i) return;
      if (!(i[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let o = [...i[0]].length - 1, s, u, a = o, p = this.rules.inline.delRDelim;
        for (p.lastIndex = 0, t = t.slice(-1 * e.length + o); (i = p.exec(t)) !== null; ) {
          if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s || (u = [...s].length, u !== o)) continue;
          if (i[3] || i[4]) {
            a += u;
            continue;
          }
          if (a -= u, a > 0) continue;
          u = Math.min(u, u + a);
          let c2 = [...i[0]][0].length, h = e.slice(0, o + i.index + c2 + u), k = h.slice(o, -o);
          return { type: "del", raw: h, text: k, tokens: this.lexer.inlineTokens(k) };
        }
      }
    }
    autolink(e) {
      let t = this.rules.inline.autolink.exec(e);
      if (t) {
        let n, i;
        return t[2] === "@" ? (n = t[1], i = "mailto:" + n) : (n = t[1], i = n), { type: "link", raw: t[0], text: n, href: i, autolink: true, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    url(e) {
      let t;
      if (t = this.rules.inline.url.exec(e)) {
        let n, i;
        if (t[2] === "@") n = t[0], i = "mailto:" + n;
        else {
          let r;
          do
            r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
          while (r !== t[0]);
          n = t[0], t[1] === "www." ? i = "http://" + t[0] : i = t[0];
        }
        return { type: "link", raw: t[0], text: n, href: i, autolink: true, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    inlineText(e) {
      let t = this.rules.inline.text.exec(e);
      if (t) {
        let n = this.lexer.state.inRawBlock;
        return { type: "text", raw: t[0], text: t[0], escaped: n };
      }
    }
  };
  var x = class l {
    constructor(e) {
      __publicField(this, "tokens");
      __publicField(this, "options");
      __publicField(this, "state");
      __publicField(this, "inlineQueue");
      __publicField(this, "tokenizer");
      this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, linkEmitted: false, top: true };
      let t = { other: m, block: G.normal, inline: B.normal };
      this.options.pedantic ? (t.block = G.pedantic, t.inline = B.pedantic) : this.options.gfm && (t.block = G.gfm, this.options.breaks ? t.inline = B.breaks : t.inline = B.gfm), this.tokenizer.rules = t;
    }
    static get rules() {
      return { block: G, inline: B };
    }
    static lex(e, t) {
      return new l(t).lex(e);
    }
    static lexInline(e, t) {
      return new l(t).inlineTokens(e);
    }
    lex(e) {
      e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
      for (let t = 0; t < this.inlineQueue.length; t++) {
        let n = this.inlineQueue[t];
        this.inlineTokens(n.src, n.tokens);
      }
      return this.inlineQueue = [], this.tokens;
    }
    blockTokens(e, t = [], n = false) {
      this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, ""));
      let i = 1 / 0;
      for (; e; ) {
        if (e.length < i) i = e.length;
        else {
          this.infiniteLoopError(e.charCodeAt(0));
          break;
        }
        let r;
        if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
        if (r = this.tokenizer.space(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
          continue;
        }
        if (r = this.tokenizer.code(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.list(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.html(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.def(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
          continue;
        }
        if (r = this.tokenizer.table(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        let o = e;
        if (this.options.extensions?.startBlock) {
          let s = 1 / 0, u = e.slice(1), a;
          this.options.extensions.startBlock.forEach((p) => {
            a = p.call({ lexer: this }, u), typeof a == "number" && a >= 0 && (s = Math.min(s, a));
          }), s < 1 / 0 && s >= 0 && (o = e.substring(0, s + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(o))) {
          let s = t.at(-1);
          n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = o.length !== e.length, e = e.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (e) {
          this.infiniteLoopError(e.charCodeAt(0));
          break;
        }
      }
      return this.state.top = true, t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    linkInText(e) {
      if (!e.includes("[")) return false;
      let t = this.tokenizer.rules.inline.link;
      for (let n of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(n[0]) && e.charAt(n.index - 1) !== "!") return true;
      for (let n of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
        let i = n[0], r = i.lastIndexOf("[");
        if (!(i.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, D(i.slice(r + 1, -1)))) && !(r > 1 && this.linkInText(i.slice(1, r - 1)))) return true;
      }
      return false;
    }
    inlineTokens(e, t = []) {
      this.tokenizer.lexer = this;
      let n = e;
      if (this.tokens.links && e.includes("[")) {
        let s = this.tokenizer.rules.inline.reflinkSearch, u = (a) => {
          let p = a.lastIndexOf("[");
          if (!Object.hasOwn(this.tokens.links, D(a.slice(p + 1, -1)))) return a;
          if (p > 1 && a.charAt(0) !== "!") {
            let c2 = a.slice(1, p - 1);
            if (this.linkInText(c2)) return "[" + c2.replace(s, u) + "][" + "a".repeat(a.length - p - 2) + "]";
          }
          return "[" + "a".repeat(a.length - 2) + "]";
        };
        n = n.replace(s, u);
      }
      n = n.replace(this.tokenizer.rules.inline.anyPunctuation, (s) => "+".repeat(s.length)), n = n.replace(this.tokenizer.rules.inline.blockSkip, (s, u, a) => {
        let p = a ? a.length : 0;
        return s.slice(0, p) + "[" + "a".repeat(s.length - p - 2) + "]";
      }), n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
      let i = false, r = "", o = 1 / 0;
      for (; e; ) {
        if (e.length < o) o = e.length;
        else {
          this.infiniteLoopError(e.charCodeAt(0));
          break;
        }
        i || (r = ""), i = false;
        let s;
        if (this.options.extensions?.inline?.some((a) => (s = a.call({ lexer: this }, e, t)) ? (e = e.substring(s.raw.length), t.push(s), true) : false)) continue;
        if (s = this.tokenizer.escape(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.tag(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.link(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(s.raw.length);
          let a = t.at(-1);
          s.type === "text" && a?.type === "text" ? (a.raw += s.raw, a.text += s.text) : t.push(s);
          continue;
        }
        if (s = this.tokenizer.emStrong(e, n, r)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.codespan(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.br(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.del(e, n, r)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (s = this.tokenizer.autolink(e)) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        if (!this.state.inLink && (s = this.tokenizer.url(e))) {
          e = e.substring(s.raw.length), t.push(s);
          continue;
        }
        let u = e;
        if (this.options.extensions?.startInline) {
          let a = 1 / 0, p = e.slice(1), c2;
          this.options.extensions.startInline.forEach((h) => {
            c2 = h.call({ lexer: this }, p), typeof c2 == "number" && c2 >= 0 && (a = Math.min(a, c2));
          }), a < 1 / 0 && a >= 0 && (u = e.substring(0, a + 1));
        }
        if (s = this.tokenizer.inlineText(u)) {
          e = e.substring(s.raw.length), s.raw.slice(-1) !== "_" && (r = s.raw.slice(-1)), i = true;
          let a = t.at(-1);
          a?.type === "text" ? (a.raw += s.raw, a.text += s.text) : t.push(s);
          continue;
        }
        if (e) {
          this.infiniteLoopError(e.charCodeAt(0));
          break;
        }
      }
      return t;
    }
    infiniteLoopError(e) {
      let t = "Infinite loop on byte: " + e;
      if (this.options.silent) console.error(t);
      else throw new Error(t);
    }
  };
  var P = class {
    constructor(e) {
      __publicField(this, "options");
      __publicField(this, "parser");
      this.options = e || T;
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      let i = (t || "").match(m.notSpaceStart)?.[0], r = e ? e.replace(m.endingNewline, "") + `
` : "";
      return i ? '<pre><code class="language-' + R(i) + '">' + (n ? r : R(r, true)) + `</code></pre>
` : "<pre><code>" + (n ? r : R(r, true)) + `</code></pre>
`;
    }
    blockquote({ tokens: e }) {
      return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
    }
    html({ text: e }) {
      return e;
    }
    def(e) {
      return "";
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
    }
    hr(e) {
      return `<hr>
`;
    }
    list(e) {
      let t = e.ordered, n = e.start, i = "";
      for (let s = 0; s < e.items.length; s++) {
        let u = e.items[s];
        i += this.listitem(u);
      }
      let r = t ? "ol" : "ul", o = t && n !== 1 ? ' start="' + n + '"' : "";
      return "<" + r + o + `>
` + i + "</" + r + `>
`;
    }
    listitem(e) {
      return `<li>${this.parser.parse(e.tokens)}</li>
`;
    }
    checkbox({ checked: e }) {
      return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>
`;
    }
    table(e) {
      let t = "", n = "";
      for (let r = 0; r < e.header.length; r++) n += this.tablecell(e.header[r]);
      t += this.tablerow({ text: n });
      let i = "";
      for (let r = 0; r < e.rows.length; r++) {
        let o = e.rows[r];
        n = "";
        for (let s = 0; s < o.length; s++) n += this.tablecell(o[s]);
        i += this.tablerow({ text: n });
      }
      return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + i + `</table>
`;
    }
    tablerow({ text: e }) {
      return `<tr>
${e}</tr>
`;
    }
    tablecell(e) {
      let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
      return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${R(e, true)}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, text: n, tokens: i, autolink: r }) {
      let o = r ? R(n, true) : this.parser.parseInline(i), s = ee(e);
      if (s === null) return o;
      e = R(s, r);
      let u = '<a href="' + e + '"';
      return t && (u += ' title="' + R(t) + '"'), u += ">" + o + "</a>", u;
    }
    image({ href: e, title: t, text: n, tokens: i }) {
      i && (n = this.parser.parseInline(i, this.parser.textRenderer));
      let r = ee(e);
      if (r === null) return R(n);
      e = r;
      let o = `<img src="${R(e)}" alt="${R(n)}"`;
      return t && (o += ` title="${R(t)}"`), o += ">", o;
    }
    text(e) {
      return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : R(e.text);
    }
  };
  var L = class {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
    checkbox({ raw: e }) {
      return e;
    }
  };
  var b = class l2 {
    constructor(e) {
      __publicField(this, "options");
      __publicField(this, "renderer");
      __publicField(this, "textRenderer");
      this.options = e || T, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new L();
    }
    static parse(e, t) {
      return new l2(t).parse(e);
    }
    static parseInline(e, t) {
      return new l2(t).parseInline(e);
    }
    parse(e) {
      this.renderer.parser = this;
      let t = "";
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        if (this.options.extensions?.renderers?.[i.type]) {
          let o = i, s = this.options.extensions.renderers[o.type].call({ parser: this }, o);
          if (s !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(o.type)) {
            t += s || "";
            continue;
          }
        }
        let r = i;
        switch (r.type) {
          case "space": {
            t += this.renderer.space(r);
            break;
          }
          case "hr": {
            t += this.renderer.hr(r);
            break;
          }
          case "heading": {
            t += this.renderer.heading(r);
            break;
          }
          case "code": {
            t += this.renderer.code(r);
            break;
          }
          case "table": {
            t += this.renderer.table(r);
            break;
          }
          case "blockquote": {
            t += this.renderer.blockquote(r);
            break;
          }
          case "list": {
            t += this.renderer.list(r);
            break;
          }
          case "checkbox": {
            t += this.renderer.checkbox(r);
            break;
          }
          case "html": {
            t += this.renderer.html(r);
            break;
          }
          case "def": {
            t += this.renderer.def(r);
            break;
          }
          case "paragraph": {
            t += this.renderer.paragraph(r);
            break;
          }
          case "text": {
            t += this.renderer.text(r);
            break;
          }
          default: {
            let o = 'Token with "' + r.type + '" type was not found.';
            if (this.options.silent) return console.error(o), "";
            throw new Error(o);
          }
        }
      }
      return t;
    }
    parseInline(e, t = this.renderer) {
      this.renderer.parser = this;
      let n = "";
      for (let i = 0; i < e.length; i++) {
        let r = e[i];
        if (this.options.extensions?.renderers?.[r.type]) {
          let s = this.options.extensions.renderers[r.type].call({ parser: this }, r);
          if (s !== false || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(r.type)) {
            n += s || "";
            continue;
          }
        }
        let o = r;
        switch (o.type) {
          case "escape": {
            n += t.text(o);
            break;
          }
          case "html": {
            n += t.html(o);
            break;
          }
          case "link": {
            n += t.link(o);
            break;
          }
          case "image": {
            n += t.image(o);
            break;
          }
          case "checkbox": {
            n += t.checkbox(o);
            break;
          }
          case "strong": {
            n += t.strong(o);
            break;
          }
          case "em": {
            n += t.em(o);
            break;
          }
          case "codespan": {
            n += t.codespan(o);
            break;
          }
          case "br": {
            n += t.br(o);
            break;
          }
          case "del": {
            n += t.del(o);
            break;
          }
          case "text": {
            n += t.text(o);
            break;
          }
          default: {
            let s = 'Token with "' + o.type + '" type was not found.';
            if (this.options.silent) return console.error(s), "";
            throw new Error(s);
          }
        }
      }
      return n;
    }
  };
  var _a;
  var S = (_a = class {
    constructor(e) {
      __publicField(this, "options");
      __publicField(this, "block");
      this.options = e || T;
    }
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    emStrongMask(e) {
      return e;
    }
    provideLexer(e = this.block) {
      return e ? x.lex : x.lexInline;
    }
    provideParser(e = this.block) {
      return e ? b.parse : b.parseInline;
    }
  }, __publicField(_a, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), __publicField(_a, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _a);
  var Q = class {
    constructor(...e) {
      __publicField(this, "defaults", A());
      __publicField(this, "options", this.setOptions);
      __publicField(this, "parse", this.parseMarkdown(true));
      __publicField(this, "parseInline", this.parseMarkdown(false));
      __publicField(this, "Parser", b);
      __publicField(this, "Renderer", P);
      __publicField(this, "TextRenderer", L);
      __publicField(this, "Lexer", x);
      __publicField(this, "Tokenizer", y);
      __publicField(this, "Hooks", S);
      this.use(...e);
    }
    walkTokens(e, t) {
      let n = [];
      for (let i of e) switch (n = n.concat(t.call(this, i)), i.type) {
        case "table": {
          let r = i;
          for (let o of r.header) n = n.concat(this.walkTokens(o.tokens, t));
          for (let o of r.rows) for (let s of o) n = n.concat(this.walkTokens(s.tokens, t));
          break;
        }
        case "list": {
          let r = i;
          n = n.concat(this.walkTokens(r.items, t));
          break;
        }
        default: {
          let r = i;
          this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((o) => {
            let s = r[o].flat(1 / 0);
            n = n.concat(this.walkTokens(s, t));
          }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, t)));
        }
      }
      return n;
    }
    use(...e) {
      let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return e.forEach((n) => {
        let i = { ...n };
        if (i.async = this.defaults.async || i.async || false, n.extensions && (n.extensions.forEach((r) => {
          if (!r.name) throw new Error("extension name required");
          if ("renderer" in r) {
            let o = t.renderers[r.name];
            o ? t.renderers[r.name] = function(...s) {
              let u = r.renderer.apply(this, s);
              return u === false && (u = o.apply(this, s)), u;
            } : t.renderers[r.name] = r.renderer;
          }
          if ("tokenizer" in r) {
            if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
            let o = t[r.level];
            o ? o.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
          }
          "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
        }), i.extensions = t), n.renderer) {
          let r = this.defaults.renderer || new P(this.defaults);
          for (let o in n.renderer) {
            if (!(o in r)) throw new Error(`renderer '${o}' does not exist`);
            if (["options", "parser"].includes(o)) continue;
            let s = o, u = n.renderer[s], a = r[s];
            r[s] = (...p) => {
              let c2 = u.apply(r, p);
              return c2 === false && (c2 = a.apply(r, p)), c2 || "";
            };
          }
          i.renderer = r;
        }
        if (n.tokenizer) {
          let r = this.defaults.tokenizer || new y(this.defaults);
          for (let o in n.tokenizer) {
            if (!(o in r)) throw new Error(`tokenizer '${o}' does not exist`);
            if (["options", "rules", "lexer"].includes(o)) continue;
            let s = o, u = n.tokenizer[s], a = r[s];
            r[s] = (...p) => {
              let c2 = u.apply(r, p);
              return c2 === false && (c2 = a.apply(r, p)), c2;
            };
          }
          i.tokenizer = r;
        }
        if (n.hooks) {
          let r = this.defaults.hooks || new S();
          for (let o in n.hooks) {
            if (!(o in r)) throw new Error(`hook '${o}' does not exist`);
            if (["options", "block"].includes(o)) continue;
            let s = o, u = n.hooks[s], a = r[s];
            S.passThroughHooks.has(o) ? r[s] = (p) => {
              if (this.defaults.async && S.passThroughHooksRespectAsync.has(o)) return (async () => {
                let h = await u.call(r, p);
                return a.call(r, h);
              })();
              let c2 = u.call(r, p);
              return a.call(r, c2);
            } : r[s] = (...p) => {
              if (this.defaults.async) return (async () => {
                let h = await u.apply(r, p);
                return h === false && (h = await a.apply(r, p)), h;
              })();
              let c2 = u.apply(r, p);
              return c2 === false && (c2 = a.apply(r, p)), c2;
            };
          }
          i.hooks = r;
        }
        if (n.walkTokens) {
          let r = this.defaults.walkTokens, o = n.walkTokens;
          i.walkTokens = function(s) {
            let u = [];
            return u.push(o.call(this, s)), r && (u = u.concat(r.call(this, s))), u;
          };
        }
        this.defaults = { ...this.defaults, ...i };
      }), this;
    }
    setOptions(e) {
      return this.defaults = { ...this.defaults, ...e }, this;
    }
    lexer(e, t) {
      return x.lex(e, t ?? this.defaults);
    }
    parser(e, t) {
      return b.parse(e, t ?? this.defaults);
    }
    parseMarkdown(e) {
      return (n, i) => {
        let r = { ...i }, o = { ...this.defaults, ...r }, s = this.onError(!!o.silent, !!o.async);
        if (this.defaults.async === true && r.async === false) return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        if (typeof n > "u" || n === null) return s(new Error("marked(): input parameter is undefined or null"));
        if (typeof n != "string") return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
        if (o.hooks && (o.hooks.options = o, o.hooks.block = e), o.async) return (async () => {
          let u = o.hooks ? await o.hooks.preprocess(n) : n, p = await (o.hooks ? await o.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(u, o), c2 = o.hooks ? await o.hooks.processAllTokens(p) : p;
          o.walkTokens && await Promise.all(this.walkTokens(c2, o.walkTokens));
          let k = await (o.hooks ? await o.hooks.provideParser(e) : e ? b.parse : b.parseInline)(c2, o);
          return o.hooks ? await o.hooks.postprocess(k) : k;
        })().catch(s);
        try {
          o.hooks && (n = o.hooks.preprocess(n));
          let a = (o.hooks ? o.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(n, o);
          o.hooks && (a = o.hooks.processAllTokens(a)), o.walkTokens && this.walkTokens(a, o.walkTokens);
          let c2 = (o.hooks ? o.hooks.provideParser(e) : e ? b.parse : b.parseInline)(a, o);
          return o.hooks && (c2 = o.hooks.postprocess(c2)), c2;
        } catch (u) {
          return s(u);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
          let i = "<p>An error occurred:</p><pre>" + R(n.message + "", true) + "</pre>";
          return t ? Promise.resolve(i) : i;
        }
        if (t) return Promise.reject(n);
        throw n;
      };
    }
  };
  var M = new Q();
  function f(l3, e) {
    return M.parse(l3, e);
  }
  f.options = f.setOptions = function(l3) {
    return M.setOptions(l3), f.defaults = M.defaults, U(f.defaults), f;
  };
  f.getDefaults = A;
  f.defaults = T;
  function bt(...l3) {
    return M.use(...l3), f.defaults = M.defaults, U(f.defaults), f;
  }
  f.use = bt;
  f.walkTokens = function(l3, e) {
    return M.walkTokens(l3, e);
  };
  f.parseInline = M.parseInline;
  f.Parser = b;
  f.parser = b.parse;
  f.Renderer = P;
  f.TextRenderer = L;
  f.Lexer = x;
  f.lexer = x.lex;
  f.Tokenizer = y;
  f.Hooks = S;
  f.parse = f;
  var un = f.options;
  var pn = f.setOptions;
  var cn = f.walkTokens;
  var hn = f.parseInline;
  var kn = b.parse;
  var gn = x.lex;

  // node_modules/highlight.js/es/core.js
  var import_core = __toESM(require_core(), 1);
  var core_default = import_core.default;

  // node_modules/highlight.js/es/languages/javascript.js
  var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
  var KEYWORDS = [
    "as",
    // for exports
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    // JS handles these with a special rule
    // "get",
    // "set",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
    // It's reached stage 3, which is "recommended for implementation":
    "using"
  ];
  var LITERALS = [
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity"
  ];
  var TYPES = [
    // Fundamental objects
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    // numbers and dates
    "Math",
    "Date",
    "Number",
    "BigInt",
    // text
    "String",
    "RegExp",
    // Indexed collections
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    // Keyed collections
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    // Structured data
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    // Control abstraction objects
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    // Reflection
    "Reflect",
    "Proxy",
    // Internationalization
    "Intl",
    // WebAssembly
    "WebAssembly"
  ];
  var ERROR_TYPES = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError"
  ];
  var BUILT_IN_GLOBALS = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape"
  ];
  var BUILT_IN_VARIABLES = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "sessionStorage",
    "module",
    "self",
    "global"
    // Node.js
  ];
  var BUILT_INS = [].concat(
    BUILT_IN_GLOBALS,
    TYPES,
    ERROR_TYPES
  );
  function javascript(hljs) {
    const regex = hljs.regex;
    const hasClosingTag = (match, { after }) => {
      const tag = "</" + match[0].slice(1);
      const pos = match.input.indexOf(tag, after);
      return pos !== -1;
    };
    const IDENT_RE$1 = IDENT_RE;
    const FRAGMENT = {
      begin: "<>",
      end: "</>"
    };
    const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
    const XML_TAG = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      /**
       * @param {RegExpMatchArray} match
       * @param {CallbackResponse} response
       */
      isTrulyOpeningTag: (match, response) => {
        const afterMatchIndex = match[0].length + match.index;
        const nextChar = match.input[afterMatchIndex];
        if (
          // HTML should not include another raw `<` inside a tag
          // nested type?
          // `<Array<Array<number>>`, etc.
          nextChar === "<" || // the , gives away that this is not HTML
          // `<T, A extends keyof T, V>`
          nextChar === ","
        ) {
          response.ignoreMatch();
          return;
        }
        if (nextChar === ">") {
          if (!hasClosingTag(match, { after: afterMatchIndex })) {
            response.ignoreMatch();
          }
        }
        let m2;
        const afterMatch = match.input.substring(afterMatchIndex);
        if (m2 = afterMatch.match(/^\s*=/)) {
          response.ignoreMatch();
          return;
        }
        if (m2 = afterMatch.match(/^\s+extends\s+/)) {
          if (m2.index === 0) {
            response.ignoreMatch();
            return;
          }
        }
      }
    };
    const KEYWORDS$1 = {
      $pattern: IDENT_RE,
      keyword: KEYWORDS,
      literal: LITERALS,
      built_in: BUILT_INS,
      "variable.language": BUILT_IN_VARIABLES
    };
    const decimalDigits2 = "[0-9](_?[0-9])*";
    const frac2 = `\\.(${decimalDigits2})`;
    const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
    const NUMBER = {
      className: "number",
      variants: [
        // DecimalLiteral
        { begin: `(\\b(${decimalInteger})((${frac2})|\\.)?|(${frac2}))[eE][+-]?(${decimalDigits2})\\b` },
        { begin: `\\b(${decimalInteger})\\b((${frac2})\\b|\\.)?|(${frac2})\\b` },
        // DecimalBigIntegerLiteral
        { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
        // NonDecimalIntegerLiteral
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
        // LegacyOctalIntegerLiteral (does not include underscore separators)
        // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
        { begin: "\\b0[0-7]+n?\\b" }
      ],
      relevance: 0
    };
    const SUBST = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: KEYWORDS$1,
      contains: []
      // defined later
    };
    const HTML_TEMPLATE = {
      begin: ".?html`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "xml"
      }
    };
    const CSS_TEMPLATE = {
      begin: ".?css`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "css"
      }
    };
    const GRAPHQL_TEMPLATE = {
      begin: ".?gql`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "graphql"
      }
    };
    const TEMPLATE_STRING = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ]
    };
    const JSDOC_COMMENT = hljs.COMMENT(
      /\/\*\*(?!\/)/,
      "\\*/",
      {
        relevance: 0,
        contains: [
          {
            begin: "(?=@[A-Za-z]+)",
            relevance: 0,
            contains: [
              {
                className: "doctag",
                begin: "@[A-Za-z]+"
              },
              {
                className: "type",
                begin: "\\{",
                end: "\\}",
                excludeEnd: true,
                excludeBegin: true,
                relevance: 0
              },
              {
                className: "variable",
                begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                endsParent: true,
                relevance: 0
              },
              // eat spaces (not newlines) so we can find
              // types or variables
              {
                begin: /(?=[^\n])\s/,
                relevance: 0
              }
            ]
          }
        ]
      }
    );
    const COMMENT = {
      className: "comment",
      variants: [
        JSDOC_COMMENT,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_LINE_COMMENT_MODE
      ]
    };
    const SUBST_INTERNALS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER
      // This is intentional:
      // See https://github.com/highlightjs/highlight.js/issues/3288
      // hljs.REGEXP_MODE
    ];
    SUBST.contains = SUBST_INTERNALS.concat({
      // we need to pair up {} inside our subst to prevent
      // it from ending too early by matching another }
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS$1,
      contains: [
        "self"
      ].concat(SUBST_INTERNALS)
    });
    const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
    const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
      // eat recursive parens in sub expressions
      {
        begin: /(\s*)\(/,
        end: /\)/,
        keywords: KEYWORDS$1,
        contains: ["self"].concat(SUBST_AND_COMMENTS)
      }
    ]);
    const PARAMS = {
      className: "params",
      // convert this to negative lookbehind in v12
      begin: /(\s*)\(/,
      // to match the parms with
      end: /\)/,
      excludeBegin: true,
      excludeEnd: true,
      keywords: KEYWORDS$1,
      contains: PARAMS_CONTAINS
    };
    const CLASS_OR_EXTENDS = {
      variants: [
        // class Car extends vehicle
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1,
            /\s+/,
            /extends/,
            /\s+/,
            regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            5: "keyword",
            7: "title.class.inherited"
          }
        },
        // class Car
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1
          ],
          scope: {
            1: "keyword",
            3: "title.class"
          }
        }
      ]
    };
    const CLASS_REFERENCE = {
      relevance: 0,
      match: regex.either(
        // Hard coded exceptions
        /\bJSON/,
        // Float32Array, OutT
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        // CSSFactory, CSSFactoryT
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        // FPs, FPsT
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
        // P
        // single letters are not highlighted
        // BLAH
        // this will be flagged as a UPPER_CASE_CONSTANT instead
      ),
      className: "title.class",
      keywords: {
        _: [
          // se we still get relevance credit for JS library classes
          ...TYPES,
          ...ERROR_TYPES
        ]
      }
    };
    const USE_STRICT = {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    };
    const FUNCTION_DEFINITION = {
      variants: [
        {
          match: [
            /function/,
            /\s+/,
            IDENT_RE$1,
            /(?=\s*\()/
          ]
        },
        // anonymous function
        {
          match: [
            /function/,
            /\s*(?=\()/
          ]
        }
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      label: "func.def",
      contains: [PARAMS],
      illegal: /%/
    };
    const UPPER_CASE_CONSTANT = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    };
    function noneOf(list) {
      return regex.concat("(?!", list.join("|"), ")");
    }
    const FUNCTION_CALL = {
      match: regex.concat(
        /\b/,
        noneOf([
          ...BUILT_IN_GLOBALS,
          "super",
          "import",
          "await"
        ].map((x2) => `${x2}\\s*\\(`)),
        IDENT_RE$1,
        regex.lookahead(/\s*\(/)
      ),
      className: "title.function",
      relevance: 0
    };
    const PROPERTY_ACCESS = {
      begin: regex.concat(/\./, regex.lookahead(
        regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
      )),
      end: IDENT_RE$1,
      excludeBegin: true,
      keywords: "prototype",
      className: "property",
      relevance: 0
    };
    const GETTER_OR_SETTER = {
      match: [
        /get|set/,
        /\s+/,
        IDENT_RE$1,
        /(?=\()/
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        {
          // eat to avoid empty params
          begin: /\(\)/
        },
        PARAMS
      ]
    };
    const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
    const FUNCTION_VARIABLE = {
      match: [
        /const|var|let/,
        /\s+/,
        IDENT_RE$1,
        /\s*/,
        /=\s*/,
        /(async\s*)?/,
        // async is optional
        regex.lookahead(FUNC_LEAD_IN_RE)
      ],
      keywords: "async",
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        PARAMS
      ]
    };
    return {
      name: "JavaScript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: KEYWORDS$1,
      // this will be extended by TypeScript
      exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
      illegal: /#(?![$_A-Za-z])/,
      contains: [
        hljs.SHEBANG({
          label: "shebang",
          binary: "node",
          relevance: 5
        }),
        USE_STRICT,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        GRAPHQL_TEMPLATE,
        TEMPLATE_STRING,
        COMMENT,
        // Skip numbers when they are part of a variable name
        { match: /\$\d+/ },
        NUMBER,
        CLASS_REFERENCE,
        {
          scope: "attr",
          match: IDENT_RE$1 + regex.lookahead(":"),
          relevance: 0
        },
        FUNCTION_VARIABLE,
        {
          // "value" container
          begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          relevance: 0,
          contains: [
            COMMENT,
            hljs.REGEXP_MODE,
            {
              className: "function",
              // we have to count the parens to make sure we actually have the
              // correct bounding ( ) before the =>.  There could be any number of
              // sub-expressions inside also surrounded by parens.
              begin: FUNC_LEAD_IN_RE,
              returnBegin: true,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    {
                      begin: hljs.UNDERSCORE_IDENT_RE,
                      relevance: 0
                    },
                    {
                      className: null,
                      begin: /\(\s*\)/,
                      skip: true
                    },
                    {
                      begin: /(\s*)\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS$1,
                      contains: PARAMS_CONTAINS
                    }
                  ]
                }
              ]
            },
            {
              // could be a comma delimited list of params to a function call
              begin: /,/,
              relevance: 0
            },
            {
              match: /\s+/,
              relevance: 0
            },
            {
              // JSX
              variants: [
                { begin: FRAGMENT.begin, end: FRAGMENT.end },
                { match: XML_SELF_CLOSING },
                {
                  begin: XML_TAG.begin,
                  // we carefully check the opening tag to see if it truly
                  // is a tag and not a false positive
                  "on:begin": XML_TAG.isTrulyOpeningTag,
                  end: XML_TAG.end
                }
              ],
              subLanguage: "xml",
              contains: [
                {
                  begin: XML_TAG.begin,
                  end: XML_TAG.end,
                  skip: true,
                  contains: ["self"]
                }
              ]
            }
          ]
        },
        FUNCTION_DEFINITION,
        {
          // prevent this from getting swallowed up by function
          // since they appear "function like"
          beginKeywords: "while if switch catch for"
        },
        {
          // we have to count the parens to make sure we actually have the correct
          // bounding ( ).  There could be any number of sub-expressions inside
          // also surrounded by parens.
          begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
          // end parens
          returnBegin: true,
          label: "func.def",
          contains: [
            PARAMS,
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
          ]
        },
        // catch ... so it won't trigger the property rule below
        {
          match: /\.\.\./,
          relevance: 0
        },
        PROPERTY_ACCESS,
        // hack: prevents detection of keywords in some circumstances
        // .keyword()
        // $keyword = x
        {
          match: "\\$" + IDENT_RE$1,
          relevance: 0
        },
        {
          match: [/\bconstructor(?=\s*\()/],
          className: { 1: "title.function" },
          contains: [PARAMS]
        },
        FUNCTION_CALL,
        UPPER_CASE_CONSTANT,
        CLASS_OR_EXTENDS,
        GETTER_OR_SETTER,
        {
          match: /\$[(.]/
          // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/typescript.js
  var IDENT_RE2 = "[A-Za-z$_][0-9A-Za-z$_]*";
  var KEYWORDS2 = [
    "as",
    // for exports
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    // JS handles these with a special rule
    // "get",
    // "set",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
    // It's reached stage 3, which is "recommended for implementation":
    "using"
  ];
  var LITERALS2 = [
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity"
  ];
  var TYPES2 = [
    // Fundamental objects
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    // numbers and dates
    "Math",
    "Date",
    "Number",
    "BigInt",
    // text
    "String",
    "RegExp",
    // Indexed collections
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    // Keyed collections
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    // Structured data
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    // Control abstraction objects
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    // Reflection
    "Reflect",
    "Proxy",
    // Internationalization
    "Intl",
    // WebAssembly
    "WebAssembly"
  ];
  var ERROR_TYPES2 = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError"
  ];
  var BUILT_IN_GLOBALS2 = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape"
  ];
  var BUILT_IN_VARIABLES2 = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "sessionStorage",
    "module",
    "self",
    "global"
    // Node.js
  ];
  var BUILT_INS2 = [].concat(
    BUILT_IN_GLOBALS2,
    TYPES2,
    ERROR_TYPES2
  );
  function javascript2(hljs) {
    const regex = hljs.regex;
    const hasClosingTag = (match, { after }) => {
      const tag = "</" + match[0].slice(1);
      const pos = match.input.indexOf(tag, after);
      return pos !== -1;
    };
    const IDENT_RE$1 = IDENT_RE2;
    const FRAGMENT = {
      begin: "<>",
      end: "</>"
    };
    const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
    const XML_TAG = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      /**
       * @param {RegExpMatchArray} match
       * @param {CallbackResponse} response
       */
      isTrulyOpeningTag: (match, response) => {
        const afterMatchIndex = match[0].length + match.index;
        const nextChar = match.input[afterMatchIndex];
        if (
          // HTML should not include another raw `<` inside a tag
          // nested type?
          // `<Array<Array<number>>`, etc.
          nextChar === "<" || // the , gives away that this is not HTML
          // `<T, A extends keyof T, V>`
          nextChar === ","
        ) {
          response.ignoreMatch();
          return;
        }
        if (nextChar === ">") {
          if (!hasClosingTag(match, { after: afterMatchIndex })) {
            response.ignoreMatch();
          }
        }
        let m2;
        const afterMatch = match.input.substring(afterMatchIndex);
        if (m2 = afterMatch.match(/^\s*=/)) {
          response.ignoreMatch();
          return;
        }
        if (m2 = afterMatch.match(/^\s+extends\s+/)) {
          if (m2.index === 0) {
            response.ignoreMatch();
            return;
          }
        }
      }
    };
    const KEYWORDS$1 = {
      $pattern: IDENT_RE2,
      keyword: KEYWORDS2,
      literal: LITERALS2,
      built_in: BUILT_INS2,
      "variable.language": BUILT_IN_VARIABLES2
    };
    const decimalDigits2 = "[0-9](_?[0-9])*";
    const frac2 = `\\.(${decimalDigits2})`;
    const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
    const NUMBER = {
      className: "number",
      variants: [
        // DecimalLiteral
        { begin: `(\\b(${decimalInteger})((${frac2})|\\.)?|(${frac2}))[eE][+-]?(${decimalDigits2})\\b` },
        { begin: `\\b(${decimalInteger})\\b((${frac2})\\b|\\.)?|(${frac2})\\b` },
        // DecimalBigIntegerLiteral
        { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
        // NonDecimalIntegerLiteral
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
        // LegacyOctalIntegerLiteral (does not include underscore separators)
        // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
        { begin: "\\b0[0-7]+n?\\b" }
      ],
      relevance: 0
    };
    const SUBST = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: KEYWORDS$1,
      contains: []
      // defined later
    };
    const HTML_TEMPLATE = {
      begin: ".?html`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "xml"
      }
    };
    const CSS_TEMPLATE = {
      begin: ".?css`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "css"
      }
    };
    const GRAPHQL_TEMPLATE = {
      begin: ".?gql`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "graphql"
      }
    };
    const TEMPLATE_STRING = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ]
    };
    const JSDOC_COMMENT = hljs.COMMENT(
      /\/\*\*(?!\/)/,
      "\\*/",
      {
        relevance: 0,
        contains: [
          {
            begin: "(?=@[A-Za-z]+)",
            relevance: 0,
            contains: [
              {
                className: "doctag",
                begin: "@[A-Za-z]+"
              },
              {
                className: "type",
                begin: "\\{",
                end: "\\}",
                excludeEnd: true,
                excludeBegin: true,
                relevance: 0
              },
              {
                className: "variable",
                begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                endsParent: true,
                relevance: 0
              },
              // eat spaces (not newlines) so we can find
              // types or variables
              {
                begin: /(?=[^\n])\s/,
                relevance: 0
              }
            ]
          }
        ]
      }
    );
    const COMMENT = {
      className: "comment",
      variants: [
        JSDOC_COMMENT,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_LINE_COMMENT_MODE
      ]
    };
    const SUBST_INTERNALS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER
      // This is intentional:
      // See https://github.com/highlightjs/highlight.js/issues/3288
      // hljs.REGEXP_MODE
    ];
    SUBST.contains = SUBST_INTERNALS.concat({
      // we need to pair up {} inside our subst to prevent
      // it from ending too early by matching another }
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS$1,
      contains: [
        "self"
      ].concat(SUBST_INTERNALS)
    });
    const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
    const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
      // eat recursive parens in sub expressions
      {
        begin: /(\s*)\(/,
        end: /\)/,
        keywords: KEYWORDS$1,
        contains: ["self"].concat(SUBST_AND_COMMENTS)
      }
    ]);
    const PARAMS = {
      className: "params",
      // convert this to negative lookbehind in v12
      begin: /(\s*)\(/,
      // to match the parms with
      end: /\)/,
      excludeBegin: true,
      excludeEnd: true,
      keywords: KEYWORDS$1,
      contains: PARAMS_CONTAINS
    };
    const CLASS_OR_EXTENDS = {
      variants: [
        // class Car extends vehicle
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1,
            /\s+/,
            /extends/,
            /\s+/,
            regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            5: "keyword",
            7: "title.class.inherited"
          }
        },
        // class Car
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1
          ],
          scope: {
            1: "keyword",
            3: "title.class"
          }
        }
      ]
    };
    const CLASS_REFERENCE = {
      relevance: 0,
      match: regex.either(
        // Hard coded exceptions
        /\bJSON/,
        // Float32Array, OutT
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        // CSSFactory, CSSFactoryT
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        // FPs, FPsT
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
        // P
        // single letters are not highlighted
        // BLAH
        // this will be flagged as a UPPER_CASE_CONSTANT instead
      ),
      className: "title.class",
      keywords: {
        _: [
          // se we still get relevance credit for JS library classes
          ...TYPES2,
          ...ERROR_TYPES2
        ]
      }
    };
    const USE_STRICT = {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    };
    const FUNCTION_DEFINITION = {
      variants: [
        {
          match: [
            /function/,
            /\s+/,
            IDENT_RE$1,
            /(?=\s*\()/
          ]
        },
        // anonymous function
        {
          match: [
            /function/,
            /\s*(?=\()/
          ]
        }
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      label: "func.def",
      contains: [PARAMS],
      illegal: /%/
    };
    const UPPER_CASE_CONSTANT = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    };
    function noneOf(list) {
      return regex.concat("(?!", list.join("|"), ")");
    }
    const FUNCTION_CALL = {
      match: regex.concat(
        /\b/,
        noneOf([
          ...BUILT_IN_GLOBALS2,
          "super",
          "import",
          "await"
        ].map((x2) => `${x2}\\s*\\(`)),
        IDENT_RE$1,
        regex.lookahead(/\s*\(/)
      ),
      className: "title.function",
      relevance: 0
    };
    const PROPERTY_ACCESS = {
      begin: regex.concat(/\./, regex.lookahead(
        regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
      )),
      end: IDENT_RE$1,
      excludeBegin: true,
      keywords: "prototype",
      className: "property",
      relevance: 0
    };
    const GETTER_OR_SETTER = {
      match: [
        /get|set/,
        /\s+/,
        IDENT_RE$1,
        /(?=\()/
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        {
          // eat to avoid empty params
          begin: /\(\)/
        },
        PARAMS
      ]
    };
    const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
    const FUNCTION_VARIABLE = {
      match: [
        /const|var|let/,
        /\s+/,
        IDENT_RE$1,
        /\s*/,
        /=\s*/,
        /(async\s*)?/,
        // async is optional
        regex.lookahead(FUNC_LEAD_IN_RE)
      ],
      keywords: "async",
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        PARAMS
      ]
    };
    return {
      name: "JavaScript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: KEYWORDS$1,
      // this will be extended by TypeScript
      exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
      illegal: /#(?![$_A-Za-z])/,
      contains: [
        hljs.SHEBANG({
          label: "shebang",
          binary: "node",
          relevance: 5
        }),
        USE_STRICT,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        GRAPHQL_TEMPLATE,
        TEMPLATE_STRING,
        COMMENT,
        // Skip numbers when they are part of a variable name
        { match: /\$\d+/ },
        NUMBER,
        CLASS_REFERENCE,
        {
          scope: "attr",
          match: IDENT_RE$1 + regex.lookahead(":"),
          relevance: 0
        },
        FUNCTION_VARIABLE,
        {
          // "value" container
          begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          relevance: 0,
          contains: [
            COMMENT,
            hljs.REGEXP_MODE,
            {
              className: "function",
              // we have to count the parens to make sure we actually have the
              // correct bounding ( ) before the =>.  There could be any number of
              // sub-expressions inside also surrounded by parens.
              begin: FUNC_LEAD_IN_RE,
              returnBegin: true,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    {
                      begin: hljs.UNDERSCORE_IDENT_RE,
                      relevance: 0
                    },
                    {
                      className: null,
                      begin: /\(\s*\)/,
                      skip: true
                    },
                    {
                      begin: /(\s*)\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS$1,
                      contains: PARAMS_CONTAINS
                    }
                  ]
                }
              ]
            },
            {
              // could be a comma delimited list of params to a function call
              begin: /,/,
              relevance: 0
            },
            {
              match: /\s+/,
              relevance: 0
            },
            {
              // JSX
              variants: [
                { begin: FRAGMENT.begin, end: FRAGMENT.end },
                { match: XML_SELF_CLOSING },
                {
                  begin: XML_TAG.begin,
                  // we carefully check the opening tag to see if it truly
                  // is a tag and not a false positive
                  "on:begin": XML_TAG.isTrulyOpeningTag,
                  end: XML_TAG.end
                }
              ],
              subLanguage: "xml",
              contains: [
                {
                  begin: XML_TAG.begin,
                  end: XML_TAG.end,
                  skip: true,
                  contains: ["self"]
                }
              ]
            }
          ]
        },
        FUNCTION_DEFINITION,
        {
          // prevent this from getting swallowed up by function
          // since they appear "function like"
          beginKeywords: "while if switch catch for"
        },
        {
          // we have to count the parens to make sure we actually have the correct
          // bounding ( ).  There could be any number of sub-expressions inside
          // also surrounded by parens.
          begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
          // end parens
          returnBegin: true,
          label: "func.def",
          contains: [
            PARAMS,
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
          ]
        },
        // catch ... so it won't trigger the property rule below
        {
          match: /\.\.\./,
          relevance: 0
        },
        PROPERTY_ACCESS,
        // hack: prevents detection of keywords in some circumstances
        // .keyword()
        // $keyword = x
        {
          match: "\\$" + IDENT_RE$1,
          relevance: 0
        },
        {
          match: [/\bconstructor(?=\s*\()/],
          className: { 1: "title.function" },
          contains: [PARAMS]
        },
        FUNCTION_CALL,
        UPPER_CASE_CONSTANT,
        CLASS_OR_EXTENDS,
        GETTER_OR_SETTER,
        {
          match: /\$[(.]/
          // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        }
      ]
    };
  }
  function typescript(hljs) {
    const regex = hljs.regex;
    const tsLanguage = javascript2(hljs);
    const IDENT_RE$1 = IDENT_RE2;
    const TYPES3 = [
      "any",
      "void",
      "number",
      "boolean",
      "string",
      "object",
      "never",
      "symbol",
      "bigint",
      "unknown"
    ];
    const NAMESPACE = {
      begin: [
        /namespace/,
        /\s+/,
        hljs.IDENT_RE
      ],
      beginScope: {
        1: "keyword",
        3: "title.class"
      }
    };
    const INTERFACE = {
      beginKeywords: "interface",
      end: /\{/,
      excludeEnd: true,
      keywords: {
        keyword: "interface extends",
        built_in: TYPES3
      },
      contains: [tsLanguage.exports.CLASS_REFERENCE]
    };
    const USE_STRICT = {
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use strict['"]/
    };
    const TS_SPECIFIC_KEYWORDS = [
      "type",
      // "namespace",
      "interface",
      "public",
      "private",
      "protected",
      "implements",
      "declare",
      "abstract",
      "readonly",
      "enum",
      "override",
      "satisfies"
    ];
    const KEYWORDS$1 = {
      $pattern: IDENT_RE2,
      keyword: KEYWORDS2.concat(TS_SPECIFIC_KEYWORDS),
      literal: LITERALS2,
      built_in: BUILT_INS2.concat(TYPES3),
      "variable.language": BUILT_IN_VARIABLES2
    };
    const DECORATOR = {
      className: "meta",
      begin: "@" + IDENT_RE$1
    };
    const swapMode = (mode, label, replacement) => {
      const indx = mode.contains.findIndex((m2) => m2.label === label);
      if (indx === -1) {
        throw new Error("can not find mode to replace");
      }
      mode.contains.splice(indx, 1, replacement);
    };
    Object.assign(tsLanguage.keywords, KEYWORDS$1);
    tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);
    const ATTRIBUTE_HIGHLIGHT = tsLanguage.contains.find((c2) => c2.scope === "attr");
    const OPTIONAL_KEY_OR_ARGUMENT = Object.assign(
      {},
      ATTRIBUTE_HIGHLIGHT,
      { match: regex.concat(IDENT_RE$1, regex.lookahead(/\s*\?:/)) }
    );
    tsLanguage.exports.PARAMS_CONTAINS.push([
      tsLanguage.exports.CLASS_REFERENCE,
      // class reference for highlighting the params types
      ATTRIBUTE_HIGHLIGHT,
      // highlight the params key
      OPTIONAL_KEY_OR_ARGUMENT
      // Added for optional property assignment highlighting
    ]);
    tsLanguage.contains = tsLanguage.contains.concat([
      DECORATOR,
      NAMESPACE,
      INTERFACE,
      OPTIONAL_KEY_OR_ARGUMENT
      // Added for optional property assignment highlighting
    ]);
    swapMode(tsLanguage, "shebang", hljs.SHEBANG());
    swapMode(tsLanguage, "use_strict", USE_STRICT);
    const functionDeclaration = tsLanguage.contains.find((m2) => m2.label === "func.def");
    functionDeclaration.relevance = 0;
    Object.assign(tsLanguage, {
      name: "TypeScript",
      aliases: [
        "ts",
        "tsx",
        "mts",
        "cts"
      ]
    });
    return tsLanguage;
  }

  // node_modules/highlight.js/es/languages/python.js
  function python(hljs) {
    const regex = hljs.regex;
    const IDENT_RE3 = /[\p{XID_Start}_]\p{XID_Continue}*/u;
    const RESERVED_WORDS = [
      "and",
      "as",
      "assert",
      "async",
      "await",
      "break",
      "case",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "in",
      "is",
      "lambda",
      "lazy",
      "match",
      "nonlocal|10",
      "not",
      "or",
      "pass",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "yield"
    ];
    const BUILT_INS3 = [
      "__import__",
      "abs",
      "aiter",
      "all",
      "anext",
      "any",
      "ascii",
      "bin",
      "bool",
      "breakpoint",
      "bytearray",
      "bytes",
      "callable",
      "chr",
      "classmethod",
      "compile",
      "complex",
      "delattr",
      "dict",
      "dir",
      "divmod",
      "enumerate",
      "eval",
      "exec",
      "filter",
      "float",
      "format",
      "frozendict",
      "frozenset",
      "getattr",
      "globals",
      "hasattr",
      "hash",
      "help",
      "hex",
      "id",
      "input",
      "int",
      "isinstance",
      "issubclass",
      "iter",
      "len",
      "list",
      "locals",
      "map",
      "max",
      "memoryview",
      "min",
      "next",
      "object",
      "oct",
      "open",
      "ord",
      "pow",
      "print",
      "property",
      "range",
      "repr",
      "reversed",
      "round",
      "sentinel",
      "set",
      "setattr",
      "slice",
      "sorted",
      "staticmethod",
      "str",
      "sum",
      "super",
      "tuple",
      "type",
      "vars",
      "zip"
    ];
    const LITERALS3 = [
      "__debug__",
      "Ellipsis",
      "False",
      "None",
      "NotImplemented",
      "True"
    ];
    const TYPES3 = [
      "Any",
      "Callable",
      "Coroutine",
      "Dict",
      "List",
      "Literal",
      "Generic",
      "Optional",
      "Sequence",
      "Set",
      "Tuple",
      "Type",
      "Union"
    ];
    const KEYWORDS3 = {
      $pattern: /[A-Za-z]\w+|__\w+__/,
      keyword: RESERVED_WORDS,
      built_in: BUILT_INS3,
      literal: LITERALS3,
      type: TYPES3
    };
    const PROMPT = {
      className: "meta",
      begin: /^(>>>|\.\.\.) /
    };
    const SUBST = {
      className: "subst",
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS3,
      illegal: /#/
    };
    const LITERAL_BRACKET = {
      begin: /\{\{/,
      relevance: 0
    };
    const STRING = {
      className: "string",
      contains: [hljs.BACKSLASH_ESCAPE],
      variants: [
        {
          begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
          end: /'''/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            PROMPT
          ],
          relevance: 10
        },
        {
          begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
          end: /"""/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            PROMPT
          ],
          relevance: 10
        },
        {
          begin: /([fFtT][rR]|[rR][fFtT]|[fFtT])'''/,
          end: /'''/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            PROMPT,
            LITERAL_BRACKET,
            SUBST
          ]
        },
        {
          begin: /([fFtT][rR]|[rR][fFtT]|[fFtT])"""/,
          end: /"""/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            PROMPT,
            LITERAL_BRACKET,
            SUBST
          ]
        },
        {
          begin: /([uU]|[rR])'/,
          end: /'/,
          relevance: 10
        },
        {
          begin: /([uU]|[rR])"/,
          end: /"/,
          relevance: 10
        },
        {
          begin: /([bB]|[bB][rR]|[rR][bB])'/,
          end: /'/
        },
        {
          begin: /([bB]|[bB][rR]|[rR][bB])"/,
          end: /"/
        },
        {
          begin: /([fFtT][rR]|[rR][fFtT]|[fFtT])'/,
          end: /'/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            LITERAL_BRACKET,
            SUBST
          ]
        },
        {
          begin: /([fFtT][rR]|[rR][fFtT]|[fFtT])"/,
          end: /"/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            LITERAL_BRACKET,
            SUBST
          ]
        },
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    };
    const digitpart = "[0-9](_?[0-9])*";
    const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
    const lookahead = `\\b|${RESERVED_WORDS.join("|")}`;
    const NUMBER = {
      className: "number",
      relevance: 0,
      variants: [
        // exponentfloat, pointfloat
        // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
        // optionally imaginary
        // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
        // Note: no leading \b because floats can start with a decimal point
        // and we don't want to mishandle e.g. `fn(.5)`,
        // no trailing \b for pointfloat because it can end with a decimal point
        // and we don't want to mishandle e.g. `0..hex()`; this should be safe
        // because both MUST contain a decimal point and so cannot be confused with
        // the interior part of an identifier
        {
          begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?(?=${lookahead})`
        },
        {
          begin: `(${pointfloat})[jJ]?`
        },
        // decinteger, bininteger, octinteger, hexinteger
        // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
        // optionally "long" in Python 2
        // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
        // decinteger is optionally imaginary
        // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
        {
          begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${lookahead})`
        },
        {
          begin: `\\b0[bB](_?[01])+[lL]?(?=${lookahead})`
        },
        {
          begin: `\\b0[oO](_?[0-7])+[lL]?(?=${lookahead})`
        },
        {
          begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${lookahead})`
        },
        // imagnumber (digitpart-based)
        // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
        {
          begin: `\\b(${digitpart})[jJ](?=${lookahead})`
        }
      ]
    };
    const COMMENT_TYPE = {
      className: "comment",
      begin: regex.lookahead(/# type:/),
      end: /$/,
      keywords: KEYWORDS3,
      contains: [
        {
          // prevent keywords from coloring `type`
          begin: /# type:/
        },
        // comment within a datatype comment includes no keywords
        {
          begin: /#/,
          end: /\b\B/,
          endsWithParent: true
        }
      ]
    };
    const PARAMS = {
      className: "params",
      variants: [
        // Exclude params in functions without params
        {
          className: "",
          begin: /\(\s*\)/,
          skip: true
        },
        {
          begin: /\(/,
          end: /\)/,
          excludeBegin: true,
          excludeEnd: true,
          keywords: KEYWORDS3,
          contains: [
            "self",
            PROMPT,
            NUMBER,
            STRING,
            hljs.HASH_COMMENT_MODE
          ]
        }
      ]
    };
    SUBST.contains = [
      STRING,
      NUMBER,
      PROMPT
    ];
    return {
      name: "Python",
      aliases: [
        "py",
        "gyp",
        "ipython"
      ],
      unicodeRegex: true,
      keywords: KEYWORDS3,
      illegal: /(<\/|\?)|=>/,
      contains: [
        PROMPT,
        NUMBER,
        {
          // very common convention
          scope: "variable.language",
          match: /\bself\b/
        },
        {
          // eat "if" prior to string so that it won't accidentally be
          // labeled as an f-string
          beginKeywords: "if",
          relevance: 0
        },
        { match: /\bor\b/, scope: "keyword" },
        STRING,
        COMMENT_TYPE,
        hljs.HASH_COMMENT_MODE,
        {
          match: [
            /\bdef/,
            /\s+/,
            IDENT_RE3
          ],
          scope: {
            1: "keyword",
            3: "title.function"
          },
          contains: [PARAMS]
        },
        {
          variants: [
            {
              match: [
                /\bclass/,
                /\s+/,
                IDENT_RE3,
                /\s*/,
                /\(\s*/,
                IDENT_RE3,
                /\s*\)/
              ]
            },
            {
              match: [
                /\bclass/,
                /\s+/,
                IDENT_RE3
              ]
            }
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            6: "title.class.inherited"
          }
        },
        {
          className: "meta",
          begin: /^[\t ]*@/,
          end: /(?=#)|$/,
          contains: [
            NUMBER,
            PARAMS,
            STRING
          ]
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/bash.js
  function bash(hljs) {
    const regex = hljs.regex;
    const VAR = {};
    const BRACED_VAR = {
      begin: /\$\{/,
      end: /\}/,
      contains: [
        "self",
        {
          begin: /:-/,
          contains: [VAR]
        }
        // default values
      ]
    };
    Object.assign(VAR, {
      className: "variable",
      variants: [
        { begin: regex.concat(
          /\$[\w\d#@][\w\d_]*/,
          // negative look-ahead tries to avoid matching patterns that are not
          // Perl at all like $ident$, @ident@, etc.
          `(?![\\w\\d])(?![$])`
        ) },
        BRACED_VAR
      ]
    });
    const SUBST = {
      className: "subst",
      begin: /\$\(/,
      end: /\)/,
      contains: [hljs.BACKSLASH_ESCAPE]
    };
    const COMMENT = hljs.inherit(
      hljs.COMMENT(),
      {
        match: [
          /(^|\s)/,
          /#.*$/
        ],
        scope: {
          2: "comment"
        }
      }
    );
    const HERE_DOC = {
      begin: /<<-?\s*(?=\w+)/,
      starts: { contains: [
        hljs.END_SAME_AS_BEGIN({
          begin: /(\w+)/,
          end: /(\w+)/,
          className: "string"
        })
      ] }
    };
    const QUOTE_STRING = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        VAR,
        SUBST
      ]
    };
    SUBST.contains.push(QUOTE_STRING);
    const ESCAPED_QUOTE = {
      match: /\\"/
    };
    const APOS_STRING = {
      className: "string",
      begin: /'/,
      end: /'/
    };
    const ESCAPED_APOS = {
      match: /\\'/
    };
    const ARITHMETIC = {
      begin: /\$?\(\(/,
      end: /\)\)/,
      contains: [
        {
          begin: /\d+#[0-9a-f]+/,
          className: "number"
        },
        hljs.NUMBER_MODE,
        VAR
      ]
    };
    const SH_LIKE_SHELLS = [
      "fish",
      "bash",
      "zsh",
      "sh",
      "csh",
      "ksh",
      "tcsh",
      "dash",
      "scsh"
    ];
    const KNOWN_SHEBANG = hljs.SHEBANG({
      binary: `(${SH_LIKE_SHELLS.join("|")})`,
      relevance: 10
    });
    const FUNCTION = {
      className: "function",
      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
      returnBegin: true,
      contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
      relevance: 0
    };
    const KEYWORDS3 = [
      "if",
      "then",
      "else",
      "elif",
      "fi",
      "time",
      "for",
      "while",
      "until",
      "in",
      "do",
      "done",
      "case",
      "esac",
      "coproc",
      "function",
      "select"
    ];
    const LITERALS3 = [
      "true",
      "false"
    ];
    const PATH_MODE = { match: /(\/[a-z._-]+)+/ };
    const SHELL_BUILT_INS = [
      "break",
      "cd",
      "continue",
      "eval",
      "exec",
      "exit",
      "export",
      "getopts",
      "hash",
      "pwd",
      "readonly",
      "return",
      "shift",
      "test",
      "times",
      "trap",
      "umask",
      "unset"
    ];
    const BASH_BUILT_INS = [
      "alias",
      "bind",
      "builtin",
      "caller",
      "command",
      "declare",
      "echo",
      "enable",
      "help",
      "let",
      "local",
      "logout",
      "mapfile",
      "printf",
      "read",
      "readarray",
      "source",
      "sudo",
      "type",
      "typeset",
      "ulimit",
      "unalias"
    ];
    const ZSH_BUILT_INS = [
      "autoload",
      "bg",
      "bindkey",
      "bye",
      "cap",
      "chdir",
      "clone",
      "comparguments",
      "compcall",
      "compctl",
      "compdescribe",
      "compfiles",
      "compgroups",
      "compquote",
      "comptags",
      "comptry",
      "compvalues",
      "dirs",
      "disable",
      "disown",
      "echotc",
      "echoti",
      "emulate",
      "fc",
      "fg",
      "float",
      "functions",
      "getcap",
      "getln",
      "history",
      "integer",
      "jobs",
      "kill",
      "limit",
      "log",
      "noglob",
      "popd",
      "print",
      "pushd",
      "pushln",
      "rehash",
      "sched",
      "setcap",
      "setopt",
      "stat",
      "suspend",
      "ttyctl",
      "unfunction",
      "unhash",
      "unlimit",
      "unsetopt",
      "vared",
      "wait",
      "whence",
      "where",
      "which",
      "zcompile",
      "zformat",
      "zftp",
      "zle",
      "zmodload",
      "zparseopts",
      "zprof",
      "zpty",
      "zregexparse",
      "zsocket",
      "zstyle",
      "ztcp"
    ];
    const GNU_CORE_UTILS = [
      "chcon",
      "chgrp",
      "chown",
      "chmod",
      "cp",
      "dd",
      "df",
      "dir",
      "dircolors",
      "ln",
      "ls",
      "mkdir",
      "mkfifo",
      "mknod",
      "mktemp",
      "mv",
      "realpath",
      "rm",
      "rmdir",
      "shred",
      "sync",
      "touch",
      "truncate",
      "vdir",
      "b2sum",
      "base32",
      "base64",
      "cat",
      "cksum",
      "comm",
      "csplit",
      "cut",
      "expand",
      "fmt",
      "fold",
      "head",
      "join",
      "md5sum",
      "nl",
      "numfmt",
      "od",
      "paste",
      "ptx",
      "pr",
      "sha1sum",
      "sha224sum",
      "sha256sum",
      "sha384sum",
      "sha512sum",
      "shuf",
      "sort",
      "split",
      "sum",
      "tac",
      "tail",
      "tr",
      "tsort",
      "unexpand",
      "uniq",
      "wc",
      "arch",
      "basename",
      "chroot",
      "date",
      "dirname",
      "du",
      "echo",
      "env",
      "expr",
      "factor",
      // "false", // keyword literal already
      "groups",
      "hostid",
      "id",
      "link",
      "logname",
      "nice",
      "nohup",
      "nproc",
      "pathchk",
      "pinky",
      "printenv",
      "printf",
      "pwd",
      "readlink",
      "runcon",
      "seq",
      "sleep",
      "stat",
      "stdbuf",
      "stty",
      "tee",
      "test",
      "timeout",
      // "true", // keyword literal already
      "tty",
      "uname",
      "unlink",
      "uptime",
      "users",
      "who",
      "whoami",
      "yes"
    ];
    return {
      name: "Bash",
      aliases: [
        "sh",
        "zsh"
      ],
      keywords: {
        $pattern: /\b[a-z][a-z0-9._-]+\b/,
        keyword: KEYWORDS3,
        literal: LITERALS3,
        built_in: [
          ...SHELL_BUILT_INS,
          ...BASH_BUILT_INS,
          // Shell modifiers
          "set",
          "shopt",
          ...ZSH_BUILT_INS,
          ...GNU_CORE_UTILS
        ]
      },
      contains: [
        KNOWN_SHEBANG,
        // to catch known shells and boost relevancy
        hljs.SHEBANG(),
        // to catch unknown shells but still highlight the shebang
        FUNCTION,
        ARITHMETIC,
        COMMENT,
        HERE_DOC,
        PATH_MODE,
        QUOTE_STRING,
        ESCAPED_QUOTE,
        APOS_STRING,
        ESCAPED_APOS,
        VAR
      ]
    };
  }

  // node_modules/highlight.js/es/languages/shell.js
  function shell(hljs) {
    return {
      name: "Shell Session",
      aliases: [
        "console",
        "shellsession"
      ],
      contains: [
        {
          className: "meta.prompt",
          // We cannot add \s (spaces) in the regular expression otherwise it will be too broad and produce unexpected result.
          // For instance, in the following example, it would match "echo /path/to/home >" as a prompt:
          // echo /path/to/home > t.exe
          begin: /^\s{0,3}[./~\w\d[\]()@-]*[>%$#][ ]?/,
          starts: {
            end: /[^\\](?=\s*$)/,
            subLanguage: "bash"
          }
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/json.js
  var EXTENDED_NUMBER_RE = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity";
  var EXTENDED_NUMBER_MODE = {
    scope: "number",
    match: EXTENDED_NUMBER_RE,
    relevance: 0
  };
  function json(hljs) {
    const ATTRIBUTE = {
      className: "attr",
      begin: /(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,
      relevance: 1.01
    };
    const PUNCTUATION = {
      match: /[{}[\],:]/,
      className: "punctuation",
      relevance: 0
    };
    const LITERALS3 = [
      "true",
      "false",
      "null"
    ];
    const LITERALS_MODE = {
      scope: "literal",
      beginKeywords: LITERALS3.join(" ")
    };
    return {
      name: "JSON",
      aliases: ["jsonc", "json5"],
      keywords: {
        literal: LITERALS3
      },
      contains: [
        ATTRIBUTE,
        PUNCTUATION,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        LITERALS_MODE,
        EXTENDED_NUMBER_MODE,
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ],
      illegal: "\\S"
    };
  }

  // node_modules/highlight.js/es/languages/xml.js
  function xml(hljs) {
    const regex = hljs.regex;
    const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
    const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
    const XML_ENTITIES = {
      className: "symbol",
      begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
    };
    const XML_META_KEYWORDS = {
      begin: /\s/,
      contains: [
        {
          className: "keyword",
          begin: /#?[a-z_][a-z1-9_-]+/,
          illegal: /\n/
        }
      ]
    };
    const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
      begin: /\(/,
      end: /\)/
    });
    const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, { className: "string" });
    const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, { className: "string" });
    const TAG_INTERNALS = {
      endsWithParent: true,
      illegal: /</,
      relevance: 0,
      contains: [
        {
          className: "attr",
          begin: XML_IDENT_RE,
          relevance: 0
        },
        {
          begin: /=\s*/,
          relevance: 0,
          contains: [
            {
              className: "string",
              endsParent: true,
              variants: [
                {
                  begin: /"/,
                  end: /"/,
                  contains: [XML_ENTITIES]
                },
                {
                  begin: /'/,
                  end: /'/,
                  contains: [XML_ENTITIES]
                },
                { begin: /[^\s"'=<>`]+/ }
              ]
            }
          ]
        }
      ]
    };
    return {
      name: "HTML, XML",
      aliases: [
        "html",
        "xhtml",
        "rss",
        "atom",
        "xjb",
        "xsd",
        "xsl",
        "plist",
        "wsf",
        "svg"
      ],
      case_insensitive: true,
      unicodeRegex: true,
      contains: [
        {
          className: "meta",
          begin: /<![a-z]/,
          end: />/,
          relevance: 10,
          contains: [
            XML_META_KEYWORDS,
            QUOTE_META_STRING_MODE,
            APOS_META_STRING_MODE,
            XML_META_PAR_KEYWORDS,
            {
              begin: /\[/,
              end: /\]/,
              contains: [
                {
                  className: "meta",
                  begin: /<![a-z]/,
                  end: />/,
                  contains: [
                    XML_META_KEYWORDS,
                    XML_META_PAR_KEYWORDS,
                    QUOTE_META_STRING_MODE,
                    APOS_META_STRING_MODE
                  ]
                }
              ]
            }
          ]
        },
        hljs.COMMENT(
          /<!--/,
          /-->/,
          { relevance: 10 }
        ),
        {
          begin: /<!\[CDATA\[/,
          end: /\]\]>/,
          relevance: 10
        },
        XML_ENTITIES,
        // xml processing instructions
        {
          className: "meta",
          end: /\?>/,
          variants: [
            {
              begin: /<\?xml/,
              relevance: 10,
              contains: [
                QUOTE_META_STRING_MODE
              ]
            },
            {
              begin: /<\?[a-z][a-z0-9]+/
            }
          ]
        },
        {
          className: "tag",
          /*
          The lookahead pattern (?=...) ensures that 'begin' only matches
          '<style' as a single word, followed by a whitespace or an
          ending bracket.
          */
          begin: /<style(?=\s|>)/,
          end: />/,
          keywords: { name: "style" },
          contains: [TAG_INTERNALS],
          starts: {
            end: /<\/style>/,
            returnEnd: true,
            subLanguage: "css"
          }
        },
        {
          className: "tag",
          // See the comment in the <style tag about the lookahead pattern
          begin: /<script(?=\s|>)/,
          end: />/,
          keywords: { name: "script" },
          contains: [TAG_INTERNALS],
          starts: {
            end: /<\/script>/,
            returnEnd: true,
            subLanguage: "javascript"
          }
        },
        // we need this for now for jSX
        {
          className: "tag",
          begin: /<>|<\/>/
        },
        // open tag
        {
          className: "tag",
          begin: regex.concat(
            /</,
            regex.lookahead(regex.concat(
              TAG_NAME_RE,
              // <tag/>
              // <tag>
              // <tag ...
              regex.either(/\/>/, />/, /\s/)
            ))
          ),
          end: /\/?>/,
          contains: [
            {
              className: "name",
              begin: TAG_NAME_RE,
              relevance: 0,
              starts: TAG_INTERNALS
            }
          ]
        },
        // close tag
        {
          className: "tag",
          begin: regex.concat(
            /<\//,
            regex.lookahead(regex.concat(
              TAG_NAME_RE,
              />/
            ))
          ),
          contains: [
            {
              className: "name",
              begin: TAG_NAME_RE,
              relevance: 0
            },
            {
              begin: />/,
              relevance: 0,
              endsParent: true
            }
          ]
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/css.js
  var MODES = (hljs) => {
    return {
      IMPORTANT: {
        scope: "meta",
        begin: "!important"
      },
      BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
      HEXCOLOR: {
        scope: "number",
        begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
      },
      UNICODE_RANGE: {
        scope: "number",
        begin: /\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,5}(-[0-9A-Fa-f][0-9A-Fa-f]{0,5})?/
      },
      FUNCTION_DISPATCH: {
        className: "built_in",
        begin: /[\w-]+(?=\()/
      },
      ATTRIBUTE_SELECTOR_MODE: {
        scope: "selector-attr",
        begin: /\[/,
        end: /\]/,
        illegal: "$",
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      },
      CSS_NUMBER_MODE: {
        scope: "number",
        begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0
      },
      CSS_VARIABLE: {
        className: "attr",
        begin: /--[A-Za-z_][A-Za-z0-9_-]*/
      }
    };
  };
  var HTML_TAGS = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "mark",
    "menu",
    "nav",
    "object",
    "ol",
    "optgroup",
    "option",
    "p",
    "picture",
    "q",
    "quote",
    "samp",
    "section",
    "select",
    "source",
    "span",
    "strong",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "ul",
    "var",
    "video"
  ];
  var SVG_TAGS = [
    "defs",
    "g",
    "marker",
    "mask",
    "pattern",
    "svg",
    "switch",
    "symbol",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feFlood",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMorphology",
    "feOffset",
    "feSpecularLighting",
    "feTile",
    "feTurbulence",
    "linearGradient",
    "radialGradient",
    "stop",
    "circle",
    "ellipse",
    "image",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",
    "text",
    "use",
    "textPath",
    "tspan",
    "foreignObject",
    "clipPath"
  ];
  var TAGS = [
    ...HTML_TAGS,
    ...SVG_TAGS
  ];
  var MEDIA_FEATURES = [
    "any-hover",
    "any-pointer",
    "aspect-ratio",
    "color",
    "color-gamut",
    "color-index",
    "device-aspect-ratio",
    "device-height",
    "device-width",
    "display-mode",
    "forced-colors",
    "grid",
    "height",
    "hover",
    "inverted-colors",
    "monochrome",
    "orientation",
    "overflow-block",
    "overflow-inline",
    "pointer",
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-transparency",
    "resolution",
    "scan",
    "scripting",
    "update",
    "width",
    // TODO: find a better solution?
    "min-width",
    "max-width",
    "min-height",
    "max-height"
  ].sort().reverse();
  var PSEUDO_CLASSES = [
    "active",
    "any-link",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    "dir",
    // dir()
    "disabled",
    "drop",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    "has",
    // has()
    "host",
    // host or host()
    "host-context",
    // host-context()
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    "is",
    // is()
    "lang",
    // lang()
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    "not",
    // not()
    "nth-child",
    // nth-child()
    "nth-col",
    // nth-col()
    "nth-last-child",
    // nth-last-child()
    "nth-last-col",
    // nth-last-col()
    "nth-last-of-type",
    //nth-last-of-type()
    "nth-of-type",
    //nth-of-type()
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "placeholder-shown",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    "where"
    // where()
  ].sort().reverse();
  var PSEUDO_ELEMENTS = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "grammar-error",
    "marker",
    "part",
    "placeholder",
    "selection",
    "slotted",
    "spelling-error"
  ].sort().reverse();
  var ATTRIBUTES = [
    "accent-color",
    "align-content",
    "align-items",
    "align-self",
    "alignment-baseline",
    "all",
    "anchor-name",
    "animation",
    "animation-composition",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-range",
    "animation-range-end",
    "animation-range-start",
    "animation-timeline",
    "animation-timing-function",
    "appearance",
    "aspect-ratio",
    "backdrop-filter",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-position-x",
    "background-position-y",
    "background-repeat",
    "background-size",
    "baseline-shift",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-start-end-radius",
    "border-start-start-radius",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-align",
    "box-decoration-break",
    "box-direction",
    "box-flex",
    "box-flex-group",
    "box-lines",
    "box-ordinal-group",
    "box-orient",
    "box-pack",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "color-scheme",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "contain-intrinsic-block-size",
    "contain-intrinsic-height",
    "contain-intrinsic-inline-size",
    "contain-intrinsic-size",
    "contain-intrinsic-width",
    "container",
    "container-name",
    "container-type",
    "content",
    "content-visibility",
    "corner-bottom-left-shape",
    "corner-bottom-right-shape",
    "corner-shape",
    "corner-top-left-shape",
    "corner-top-right-shape",
    "counter-increment",
    "counter-reset",
    "counter-set",
    "cue",
    "cue-after",
    "cue-before",
    "cursor",
    "cx",
    "cy",
    "direction",
    "display",
    "dominant-baseline",
    "empty-cells",
    "enable-background",
    "field-sizing",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "flood-color",
    "flood-opacity",
    "flow",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-optical-sizing",
    "font-palette",
    "font-size",
    "font-size-adjust",
    "font-smooth",
    "font-smoothing",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-synthesis-position",
    "font-synthesis-small-caps",
    "font-synthesis-style",
    "font-synthesis-weight",
    "font-variant",
    "font-variant-alternates",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-emoji",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "forced-color-adjust",
    "gap",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphenate-character",
    "hyphenate-limit-chars",
    "hyphens",
    "icon",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "ime-mode",
    "initial-letter",
    "initial-letter-align",
    "inline-size",
    "inset",
    "inset-area",
    "inset-block",
    "inset-block-end",
    "inset-block-start",
    "inset-inline",
    "inset-inline-end",
    "inset-inline-start",
    "isolation",
    "justify-content",
    "justify-items",
    "justify-self",
    "kerning",
    "left",
    "letter-spacing",
    "lighting-color",
    "line-break",
    "line-height",
    "line-height-step",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "margin-trim",
    "marker",
    "marker-end",
    "marker-mid",
    "marker-start",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "masonry-auto-flow",
    "math-depth",
    "math-shift",
    "math-style",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "nav-down",
    "nav-index",
    "nav-left",
    "nav-right",
    "nav-up",
    "none",
    "normal",
    "object-fit",
    "object-position",
    "offset",
    "offset-anchor",
    "offset-distance",
    "offset-path",
    "offset-position",
    "offset-rotate",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-anchor",
    "overflow-block",
    "overflow-clip-margin",
    "overflow-inline",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "overlay",
    "overscroll-behavior",
    "overscroll-behavior-block",
    "overscroll-behavior-inline",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "paint-order",
    "pause",
    "pause-after",
    "pause-before",
    "perspective",
    "perspective-origin",
    "place-content",
    "place-items",
    "place-self",
    "pointer-events",
    "position",
    "position-anchor",
    "position-visibility",
    "print-color-adjust",
    "quotes",
    "r",
    "resize",
    "rest",
    "rest-after",
    "rest-before",
    "right",
    "rotate",
    "row-gap",
    "ruby-align",
    "ruby-position",
    "scale",
    "scroll-behavior",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scroll-timeline",
    "scroll-timeline-axis",
    "scroll-timeline-name",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "shape-rendering",
    "speak",
    "speak-as",
    "src",
    // @font-face
    "stop-color",
    "stop-opacity",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-all",
    "text-align-last",
    "text-anchor",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-skip",
    "text-decoration-skip-ink",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-size-adjust",
    "text-transform",
    "text-underline-offset",
    "text-underline-position",
    "text-wrap",
    "text-wrap-mode",
    "text-wrap-style",
    "timeline-scope",
    "top",
    "touch-action",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-behavior",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "translate",
    "unicode-bidi",
    "unicode-range",
    "user-modify",
    "user-select",
    "vector-effect",
    "vertical-align",
    "view-timeline",
    "view-timeline-axis",
    "view-timeline-inset",
    "view-timeline-name",
    "view-transition-name",
    "visibility",
    "voice-balance",
    "voice-duration",
    "voice-family",
    "voice-pitch",
    "voice-range",
    "voice-rate",
    "voice-stress",
    "voice-volume",
    "white-space",
    "white-space-collapse",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "x",
    "y",
    "z-index",
    "zoom"
  ].sort().reverse();
  function css(hljs) {
    const regex = hljs.regex;
    const modes = MODES(hljs);
    const VENDOR_PREFIX = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ };
    const AT_MODIFIERS = "and or not only";
    const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/;
    const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
    const STRINGS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ];
    return {
      name: "CSS",
      case_insensitive: true,
      illegal: /[=|'\$]/,
      keywords: { keyframePosition: "from to" },
      classNameAliases: {
        // for visual continuity with `tag {}` and because we
        // don't have a great class for this?
        keyframePosition: "selector-tag"
      },
      contains: [
        modes.BLOCK_COMMENT,
        VENDOR_PREFIX,
        // to recognize keyframe 40% etc which are outside the scope of our
        // attribute value mode
        modes.CSS_NUMBER_MODE,
        {
          className: "selector-id",
          begin: /#[A-Za-z0-9_-]+/,
          relevance: 0
        },
        {
          className: "selector-class",
          begin: "\\." + IDENT_RE3,
          relevance: 0
        },
        modes.ATTRIBUTE_SELECTOR_MODE,
        {
          className: "selector-pseudo",
          variants: [
            { begin: ":(" + PSEUDO_CLASSES.join("|") + ")" },
            { begin: ":(:)?(" + PSEUDO_ELEMENTS.join("|") + ")" }
          ]
        },
        // we may actually need this (12/2020)
        // { // pseudo-selector params
        //   begin: /\(/,
        //   end: /\)/,
        //   contains: [ hljs.CSS_NUMBER_MODE ]
        // },
        modes.CSS_VARIABLE,
        {
          className: "attribute",
          begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b"
        },
        // attribute values
        {
          begin: /:/,
          end: /[;}{]/,
          contains: [
            modes.BLOCK_COMMENT,
            modes.HEXCOLOR,
            modes.IMPORTANT,
            modes.CSS_NUMBER_MODE,
            modes.UNICODE_RANGE,
            ...STRINGS,
            // needed to highlight these as strings and to avoid issues with
            // illegal characters that might be inside urls that would trigger the
            // languages illegal stack
            {
              begin: /(url|data-uri)\(/,
              end: /\)/,
              relevance: 0,
              // from keywords
              keywords: { built_in: "url data-uri" },
              contains: [
                ...STRINGS,
                {
                  className: "string",
                  // any character other than `)` as in `url()` will be the start
                  // of a string, which ends with `)` (from the parent mode)
                  begin: /[^)]/,
                  endsWithParent: true,
                  excludeEnd: true
                }
              ]
            },
            modes.FUNCTION_DISPATCH
          ]
        },
        {
          begin: regex.lookahead(/@/),
          end: "[{;]",
          relevance: 0,
          illegal: /:/,
          // break on Less variables @var: ...
          contains: [
            {
              className: "keyword",
              begin: AT_PROPERTY_RE
            },
            {
              begin: /\s/,
              endsWithParent: true,
              excludeEnd: true,
              relevance: 0,
              keywords: {
                $pattern: /[a-z-]+/,
                keyword: AT_MODIFIERS,
                attribute: MEDIA_FEATURES.join(" ")
              },
              contains: [
                {
                  begin: /[a-z-]+(?=:)/,
                  className: "attribute"
                },
                ...STRINGS,
                modes.CSS_NUMBER_MODE
              ]
            }
          ]
        },
        {
          className: "selector-tag",
          begin: "\\b(" + TAGS.join("|") + ")\\b"
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/java.js
  var decimalDigits = "[0-9](_*[0-9])*";
  var frac = `\\.(${decimalDigits})`;
  var hexDigits = "[0-9a-fA-F](_*[0-9a-fA-F])*";
  var NUMERIC = {
    className: "number",
    variants: [
      // DecimalFloatingPointLiteral
      // including ExponentPart
      { begin: `(\\b(${decimalDigits})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})[fFdD]?\\b` },
      // excluding ExponentPart
      { begin: `\\b(${decimalDigits})((${frac})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
      { begin: `(${frac})[fFdD]?\\b` },
      { begin: `\\b(${decimalDigits})[fFdD]\\b` },
      // HexadecimalFloatingPointLiteral
      { begin: `\\b0[xX]((${hexDigits})\\.?|(${hexDigits})?\\.(${hexDigits}))[pP][+-]?(${decimalDigits})[fFdD]?\\b` },
      // DecimalIntegerLiteral
      { begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
      // HexIntegerLiteral
      { begin: `\\b0[xX](${hexDigits})[lL]?\\b` },
      // OctalIntegerLiteral
      { begin: "\\b0(_*[0-7])*[lL]?\\b" },
      // BinaryIntegerLiteral
      { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
    ],
    relevance: 0
  };
  function recurRegex(re, substitution, depth) {
    if (depth === -1) return "";
    return re.replace(substitution, (_2) => {
      return recurRegex(re, substitution, depth - 1);
    });
  }
  function java(hljs) {
    const regex = hljs.regex;
    const JAVA_IDENT_RE = "[\xC0-\u02B8a-zA-Z_$][\xC0-\u02B8a-zA-Z_$0-9]*";
    const ARRAY_BRACKETS_OPTIONAL_RE = "(?:(?:\\s*\\[\\s*])+)?";
    const SIMPLE_TYPE_RE = JAVA_IDENT_RE + "<@@@>" + ARRAY_BRACKETS_OPTIONAL_RE;
    const WILDCARD_TYPE_RE = "\\?(?:\\s+(?:extends|super)\\s+" + SIMPLE_TYPE_RE + ")?";
    const TYPE_ARG_RE = "(?:" + WILDCARD_TYPE_RE + "|" + SIMPLE_TYPE_RE + ")";
    const TYPE_ARGS_OPTIONAL_RE = recurRegex(
      "(?:\\s*<\\s*" + TYPE_ARG_RE + "(?:\\s*,\\s*" + TYPE_ARG_RE + ")*\\s*>)?",
      /<@@@>/g,
      2
    );
    const MAIN_KEYWORDS = [
      "synchronized",
      "abstract",
      "private",
      "var",
      "static",
      "if",
      "const ",
      "for",
      "while",
      "strictfp",
      "finally",
      "protected",
      "import",
      "native",
      "final",
      "void",
      "enum",
      "else",
      "break",
      "transient",
      "catch",
      "instanceof",
      "volatile",
      "case",
      "assert",
      "package",
      "default",
      "public",
      "try",
      "switch",
      "continue",
      "throws",
      "protected",
      "public",
      "private",
      "module",
      "requires",
      "exports",
      "do",
      "sealed",
      "yield",
      "permits",
      "goto",
      "when"
    ];
    const BUILT_INS3 = [
      "super",
      "this"
    ];
    const LITERALS3 = [
      "false",
      "true",
      "null"
    ];
    const TYPES3 = [
      "char",
      "boolean",
      "long",
      "float",
      "int",
      "byte",
      "short",
      "double"
    ];
    const KEYWORDS3 = {
      keyword: MAIN_KEYWORDS,
      literal: LITERALS3,
      type: TYPES3,
      built_in: BUILT_INS3
    };
    const ANNOTATION = {
      className: "meta",
      begin: "@" + JAVA_IDENT_RE,
      contains: [
        {
          begin: /\(/,
          end: /\)/,
          contains: ["self"]
          // allow nested () inside our annotation
        }
      ]
    };
    const PARAMS = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS3,
      relevance: 0,
      contains: [hljs.C_BLOCK_COMMENT_MODE],
      endsParent: true
    };
    return {
      name: "Java",
      aliases: ["jsp"],
      keywords: KEYWORDS3,
      illegal: /<\/|#/,
      contains: [
        hljs.COMMENT(
          "/\\*\\*",
          "\\*/",
          {
            relevance: 0,
            contains: [
              {
                // eat up @'s in emails to prevent them to be recognized as doctags
                begin: /\w+@/,
                relevance: 0
              },
              {
                className: "doctag",
                begin: "@[A-Za-z]+"
              }
            ]
          }
        ),
        // relevance boost
        {
          begin: /import java\.[a-z]+\./,
          keywords: "import",
          relevance: 2
        },
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          begin: /"""/,
          end: /"""/,
          className: "string",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        {
          match: [
            /\b(?:class|interface|enum|extends|implements|new)/,
            /\s+/,
            JAVA_IDENT_RE
          ],
          className: {
            1: "keyword",
            3: "title.class"
          }
        },
        {
          // Exceptions for hyphenated keywords
          match: /non-sealed/,
          scope: "keyword"
        },
        {
          // Expression keywords prevent keyword-led expressions from being
          // recognized as variable or method declarations.
          beginKeywords: "new throw return else yield assert",
          relevance: 0
        },
        {
          begin: [
            JAVA_IDENT_RE,
            regex.concat(TYPE_ARGS_OPTIONAL_RE, ARRAY_BRACKETS_OPTIONAL_RE, /\s+/),
            JAVA_IDENT_RE,
            ARRAY_BRACKETS_OPTIONAL_RE,
            /\s*/,
            /=(?!=)/
          ],
          className: {
            1: "type",
            3: "variable",
            6: "operator"
          }
        },
        {
          begin: [
            /record/,
            /\s+/,
            JAVA_IDENT_RE
          ],
          className: {
            1: "keyword",
            3: "title.class"
          },
          contains: [
            PARAMS,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        {
          begin: [
            JAVA_IDENT_RE,
            regex.concat(TYPE_ARGS_OPTIONAL_RE, ARRAY_BRACKETS_OPTIONAL_RE, /\s+/),
            JAVA_IDENT_RE,
            /\s*(?=\()/
          ],
          className: {
            1: "type",
            3: "title.function"
          },
          keywords: KEYWORDS3,
          contains: [
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: KEYWORDS3,
              relevance: 0,
              contains: [
                ANNOTATION,
                hljs.APOS_STRING_MODE,
                hljs.QUOTE_STRING_MODE,
                NUMERIC,
                hljs.C_BLOCK_COMMENT_MODE
              ]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        NUMERIC,
        ANNOTATION
      ]
    };
  }

  // node_modules/highlight.js/es/languages/cpp.js
  function cpp(hljs) {
    const regex = hljs.regex;
    const C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] });
    const DECLTYPE_AUTO_RE = "decltype\\(auto\\)";
    const NAMESPACE_RE = "[a-zA-Z_]\\w*::";
    const TEMPLATE_ARGUMENT_RE = "<[^<>]+>";
    const FUNCTION_TYPE_RE = "(?!struct)(" + DECLTYPE_AUTO_RE + "|" + regex.optional(NAMESPACE_RE) + "[a-zA-Z_]\\w*" + regex.optional(TEMPLATE_ARGUMENT_RE) + ")";
    const CPP_PRIMITIVE_TYPES = {
      className: "type",
      begin: "\\b[a-z\\d_]*_t\\b"
    };
    const CHARACTER_ESCAPES = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)";
    const STRINGS = {
      className: "string",
      variants: [
        {
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: "(u8?|U|L)?'(" + CHARACTER_ESCAPES + "|.)",
          end: "'",
          illegal: "."
        },
        // https://en.cppreference.com/w/cpp/language/string_literal
        // a d-char-sequence never contains parentheses, backslashes or whitespace;
        // quotes are excluded as well so the closing delimiter cannot swallow the
        // quote that actually terminates the literal
        hljs.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\\s"]{0,16})\(/,
          end: /\)([^()\\\s"]{0,16})"/
        })
      ]
    };
    const NUMBERS = {
      className: "number",
      variants: [
        // Floating-point literal.
        {
          begin: "[+-]?(?:(?:\\b[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|\\b[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|\\b0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)"
        },
        // Integer literal.
        {
          begin: "[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)"
          // Note: there are user-defined literal suffixes too, but perhaps having the custom suffix not part of the
          // literal highlight actually makes it stand out more.
        }
      ],
      relevance: 0
    };
    const PREPROCESSOR_INCLUDE = {
      scope: "meta",
      begin: /#\s*include\b/,
      end: /$/,
      keywords: { keyword: "include" },
      contains: [
        {
          // the `\` at the end of a line signaling continuation
          begin: /\\\n/
        },
        STRINGS,
        {
          scope: "string",
          begin: /<.*?>/
        },
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ]
    };
    const PREPROCESSOR = {
      className: "meta",
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include" },
      contains: [
        {
          begin: /\\\n/,
          relevance: 0
        },
        hljs.inherit(STRINGS, { className: "string" }),
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ]
    };
    const PREPROCESSORS = [
      PREPROCESSOR_INCLUDE,
      PREPROCESSOR
    ];
    const TITLE_MODE = {
      className: "title",
      begin: regex.optional(NAMESPACE_RE) + hljs.IDENT_RE,
      relevance: 0
    };
    const FUNCTION_TITLE = regex.optional(NAMESPACE_RE) + hljs.IDENT_RE + "\\s*\\(";
    const MAX_FUNCTION_TYPE_TOKENS = 12;
    const RESERVED_KEYWORDS = [
      "alignas",
      "alignof",
      "and",
      "and_eq",
      "asm",
      "atomic_cancel",
      "atomic_commit",
      "atomic_noexcept",
      "auto",
      "bitand",
      "bitor",
      "break",
      "case",
      "catch",
      "class",
      "co_await",
      "co_return",
      "co_yield",
      "compl",
      "concept",
      "const_cast|10",
      "consteval",
      "constexpr",
      "constinit",
      "continue",
      "decltype",
      "default",
      "delete",
      "do",
      "dynamic_cast|10",
      "else",
      "enum",
      "explicit",
      "export",
      "extern",
      "false",
      "final",
      "for",
      "friend",
      "goto",
      "if",
      "import",
      "inline",
      "module",
      "mutable",
      "namespace",
      "new",
      "noexcept",
      "not",
      "not_eq",
      "nullptr",
      "operator",
      "or",
      "or_eq",
      "override",
      "private",
      "protected",
      "public",
      "reflexpr",
      "register",
      "reinterpret_cast|10",
      "requires",
      "return",
      "sizeof",
      "static_assert",
      "static_cast|10",
      "struct",
      "switch",
      "synchronized",
      "template",
      "this",
      "thread_local",
      "throw",
      "transaction_safe",
      "transaction_safe_dynamic",
      "true",
      "try",
      "typedef",
      "typeid",
      "typename",
      "union",
      "using",
      "virtual",
      "volatile",
      "while",
      "xor",
      "xor_eq"
    ];
    const RESERVED_TYPES = [
      "bool",
      "char",
      "char16_t",
      "char32_t",
      "char8_t",
      "double",
      "float",
      "int",
      "long",
      "short",
      "void",
      "wchar_t",
      "unsigned",
      "signed",
      "const",
      "static"
    ];
    const TYPE_HINTS = [
      "any",
      "auto_ptr",
      "barrier",
      "binary_semaphore",
      "bitset",
      "complex",
      "condition_variable",
      "condition_variable_any",
      "counting_semaphore",
      "deque",
      "false_type",
      "flat_map",
      "flat_set",
      "future",
      "imaginary",
      "initializer_list",
      "istringstream",
      "jthread",
      "latch",
      "lock_guard",
      "multimap",
      "multiset",
      "mutex",
      "optional",
      "ostringstream",
      "packaged_task",
      "pair",
      "promise",
      "priority_queue",
      "queue",
      "recursive_mutex",
      "recursive_timed_mutex",
      "scoped_lock",
      "set",
      "shared_future",
      "shared_lock",
      "shared_mutex",
      "shared_timed_mutex",
      "shared_ptr",
      "stack",
      "string_view",
      "stringstream",
      "timed_mutex",
      "thread",
      "true_type",
      "tuple",
      "unique_lock",
      "unique_ptr",
      "unordered_map",
      "unordered_multimap",
      "unordered_multiset",
      "unordered_set",
      "variant",
      "vector",
      "weak_ptr",
      "wstring",
      "wstring_view"
    ];
    const FUNCTION_HINTS = [
      "abort",
      "abs",
      "acos",
      "apply",
      "as_const",
      "asin",
      "atan",
      "atan2",
      "calloc",
      "ceil",
      "cerr",
      "cin",
      "clog",
      "cos",
      "cosh",
      "cout",
      "declval",
      "endl",
      "exchange",
      "exit",
      "exp",
      "fabs",
      "floor",
      "fmod",
      "forward",
      "fprintf",
      "fputs",
      "free",
      "frexp",
      "fscanf",
      "future",
      "invoke",
      "isalnum",
      "isalpha",
      "iscntrl",
      "isdigit",
      "isgraph",
      "islower",
      "isprint",
      "ispunct",
      "isspace",
      "isupper",
      "isxdigit",
      "labs",
      "launder",
      "ldexp",
      "log",
      "log10",
      "make_pair",
      "make_shared",
      "make_shared_for_overwrite",
      "make_tuple",
      "make_unique",
      "malloc",
      "memchr",
      "memcmp",
      "memcpy",
      "memset",
      "modf",
      "move",
      "pow",
      "printf",
      "putchar",
      "puts",
      "realloc",
      "scanf",
      "sin",
      "sinh",
      "snprintf",
      "sprintf",
      "sqrt",
      "sscanf",
      "std",
      "stderr",
      "stdin",
      "stdout",
      "strcat",
      "strchr",
      "strcmp",
      "strcpy",
      "strcspn",
      "strlen",
      "strncat",
      "strncmp",
      "strncpy",
      "strpbrk",
      "strrchr",
      "strspn",
      "strstr",
      "swap",
      "tan",
      "tanh",
      "terminate",
      "to_underlying",
      "tolower",
      "toupper",
      "vfprintf",
      "visit",
      "vprintf",
      "vsprintf"
    ];
    const LITERALS3 = [
      "NULL",
      "false",
      "nullopt",
      "nullptr",
      "true"
    ];
    const BUILT_IN = ["_Pragma"];
    const CPP_KEYWORDS = {
      type: RESERVED_TYPES,
      keyword: RESERVED_KEYWORDS,
      literal: LITERALS3,
      built_in: BUILT_IN,
      _type_hints: TYPE_HINTS
    };
    const FUNCTION_DISPATCH = {
      className: "function.dispatch",
      relevance: 0,
      keywords: {
        // Only for relevance, not highlighting.
        _hint: FUNCTION_HINTS
      },
      begin: regex.concat(
        /\b/,
        `(?!${RESERVED_KEYWORDS.join("|")})`,
        hljs.IDENT_RE,
        regex.lookahead(/(<[^<>]+>|)\s*\(/)
      )
    };
    const EXPRESSION_CONTAINS = [
      FUNCTION_DISPATCH,
      ...PREPROCESSORS,
      CPP_PRIMITIVE_TYPES,
      C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBERS,
      STRINGS
    ];
    const EXPRESSION_CONTEXT = {
      // This mode covers expression context where we can't expect a function
      // definition and shouldn't highlight anything that looks like one:
      // `return some()`, `else if()`, `(x*sum(1, 2))`
      variants: [
        {
          begin: /=/,
          end: /;/
        },
        {
          begin: /\(/,
          end: /\)/
        },
        {
          beginKeywords: "new throw return else",
          end: /;/
        }
      ],
      keywords: CPP_KEYWORDS,
      contains: EXPRESSION_CONTAINS.concat([
        {
          begin: /\(/,
          end: /\)/,
          keywords: CPP_KEYWORDS,
          contains: EXPRESSION_CONTAINS.concat(["self"]),
          relevance: 0
        }
      ]),
      relevance: 0
    };
    const FUNCTION_DECLARATION = {
      className: "function",
      begin: "(" + FUNCTION_TYPE_RE + "[\\*&\\s]+){1," + MAX_FUNCTION_TYPE_TOKENS + "}" + FUNCTION_TITLE,
      returnBegin: true,
      end: /[{;=]/,
      excludeEnd: true,
      keywords: CPP_KEYWORDS,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [
        {
          // to prevent it from being confused as the function title
          begin: DECLTYPE_AUTO_RE,
          keywords: CPP_KEYWORDS,
          relevance: 0
        },
        {
          begin: FUNCTION_TITLE,
          returnBegin: true,
          contains: [TITLE_MODE],
          relevance: 0
        },
        // needed because we do not have look-behind on the below rule
        // to prevent it from grabbing the final : in a :: pair
        {
          begin: /::/,
          relevance: 0
        },
        // initializers
        {
          begin: /:/,
          endsWithParent: true,
          contains: [
            STRINGS,
            NUMBERS
          ]
        },
        // allow for multiple declarations, e.g.:
        // extern void f(int), g(char);
        {
          relevance: 0,
          match: /,/
        },
        {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: CPP_KEYWORDS,
          relevance: 0,
          contains: [
            C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            STRINGS,
            NUMBERS,
            CPP_PRIMITIVE_TYPES,
            // Count matching parentheses.
            {
              begin: /\(/,
              end: /\)/,
              keywords: CPP_KEYWORDS,
              relevance: 0,
              contains: [
                "self",
                C_LINE_COMMENT_MODE,
                hljs.C_BLOCK_COMMENT_MODE,
                STRINGS,
                NUMBERS,
                CPP_PRIMITIVE_TYPES
              ]
            }
          ]
        },
        CPP_PRIMITIVE_TYPES,
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        ...PREPROCESSORS
      ]
    };
    return {
      name: "C++",
      aliases: [
        "cc",
        "c++",
        "h++",
        "hpp",
        "hh",
        "hxx",
        "cxx"
      ],
      keywords: CPP_KEYWORDS,
      illegal: "</",
      classNameAliases: { "function.dispatch": "built_in" },
      contains: [].concat(
        EXPRESSION_CONTEXT,
        FUNCTION_DECLARATION,
        FUNCTION_DISPATCH,
        EXPRESSION_CONTAINS,
        [
          ...PREPROCESSORS,
          {
            // containers: ie, `vector <int> rooms (9);`
            begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",
            end: ">",
            keywords: CPP_KEYWORDS,
            contains: [
              "self",
              CPP_PRIMITIVE_TYPES
            ]
          },
          {
            begin: hljs.IDENT_RE + "::",
            keywords: CPP_KEYWORDS
          },
          {
            match: [
              // extra complexity to deal with `enum class` and `enum struct`
              /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
              /\s+/,
              /\w+/
            ],
            className: {
              1: "keyword",
              3: "title.class"
            }
          }
        ]
      )
    };
  }

  // node_modules/highlight.js/es/languages/c.js
  function c(hljs) {
    const regex = hljs.regex;
    const C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] });
    const DECLTYPE_AUTO_RE = "decltype\\(auto\\)";
    const NAMESPACE_RE = "[a-zA-Z_]\\w*::";
    const TEMPLATE_ARGUMENT_RE = "<[^<>]+>";
    const FUNCTION_TYPE_RE = "(" + DECLTYPE_AUTO_RE + "|" + regex.optional(NAMESPACE_RE) + "[a-zA-Z_]\\w*" + regex.optional(TEMPLATE_ARGUMENT_RE) + ")";
    const ATOMIC_TYPES = regex.concat(/\batomic_/, regex.either(
      "bool",
      "char",
      "schar",
      "uchar",
      "short",
      "ushort",
      "int",
      "uint",
      "long",
      "ulong",
      "llong",
      "ullong",
      "char16_t",
      "char32_t",
      "wchar_t",
      "int_least8_t",
      "uint_least8_t",
      "int_least16_t",
      "uint_least16_t",
      "int_least32_t",
      "uint_least32_t",
      "int_least64_t",
      "uint_least64_t",
      "int_fast8_t",
      "uint_fast8_t",
      "int_fast16_t",
      "uint_fast16_t",
      "int_fast32_t",
      "uint_fast32_t",
      "int_fast64_t",
      "uint_fast64_t",
      "intptr_t",
      "uintptr_t",
      "size_t",
      "ptrdiff_t",
      "intmax_t",
      "uintmax_t"
    ), /\b/);
    const TYPES3 = {
      className: "type",
      variants: [
        { begin: "\\b[a-z\\d_]*_t\\b" },
        { match: ATOMIC_TYPES }
      ]
    };
    const CHARACTER_ESCAPES = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)";
    const STRINGS = {
      className: "string",
      variants: [
        {
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: "(u8?|U|L)?'(" + CHARACTER_ESCAPES + "|.)",
          end: "'",
          illegal: "."
        },
        // https://en.cppreference.com/w/cpp/language/string_literal
        // a d-char-sequence never contains parentheses, backslashes or whitespace;
        // quotes are excluded as well so the closing delimiter cannot swallow the
        // quote that actually terminates the literal
        hljs.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\\s"]{0,16})\(/,
          end: /\)([^()\\\s"]{0,16})"/
        })
      ]
    };
    const NUMBERS = {
      className: "number",
      variants: [
        { match: /\b(0b[01']+)/ },
        { match: /(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/ },
        { match: /(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/ },
        { match: /(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/ }
      ],
      relevance: 0
    };
    const PREPROCESSOR_INCLUDE = {
      scope: "meta",
      begin: /#\s*include\b/,
      end: /$/,
      keywords: { keyword: "include" },
      contains: [
        {
          // the `\` at the end of a line signaling continuation
          begin: /\\\n/
        },
        STRINGS,
        {
          scope: "string",
          begin: /<.*?>/
        },
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ]
    };
    const PREPROCESSOR = {
      className: "meta",
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include" },
      contains: [
        {
          begin: /\\\n/,
          relevance: 0
        },
        hljs.inherit(STRINGS, { className: "string" }),
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ]
    };
    const PREPROCESSORS = [
      PREPROCESSOR_INCLUDE,
      PREPROCESSOR
    ];
    const TITLE_MODE = {
      className: "title",
      begin: regex.optional(NAMESPACE_RE) + hljs.IDENT_RE,
      relevance: 0
    };
    const FUNCTION_TITLE = regex.optional(NAMESPACE_RE) + hljs.IDENT_RE + "\\s*\\(";
    const MAX_FUNCTION_TYPE_TOKENS = 12;
    const C_KEYWORDS = [
      "asm",
      "auto",
      "break",
      "case",
      "continue",
      "default",
      "do",
      "else",
      "enum",
      "extern",
      "for",
      "fortran",
      "goto",
      "if",
      "inline",
      "register",
      "restrict",
      "return",
      "sizeof",
      "typeof",
      "typeof_unqual",
      "struct",
      "switch",
      "typedef",
      "union",
      "volatile",
      "while",
      "_Alignas",
      "_Alignof",
      "_Atomic",
      "_Generic",
      "_Noreturn",
      "_Static_assert",
      "_Thread_local",
      // aliases
      "alignas",
      "alignof",
      "noreturn",
      "static_assert",
      "thread_local",
      // not a C keyword but is, for all intents and purposes, treated exactly like one.
      "_Pragma"
    ];
    const C_TYPES = [
      "float",
      "double",
      "signed",
      "unsigned",
      "int",
      "short",
      "long",
      "char",
      "void",
      "_Bool",
      "_BitInt",
      "_Complex",
      "_Imaginary",
      "_Decimal32",
      "_Decimal64",
      "_Decimal96",
      "_Decimal128",
      "_Decimal64x",
      "_Decimal128x",
      "_Float16",
      "_Float32",
      "_Float64",
      "_Float128",
      "_Float32x",
      "_Float64x",
      "_Float128x",
      // modifiers
      "const",
      "static",
      "constexpr",
      // aliases
      "complex",
      "bool",
      "imaginary"
    ];
    const KEYWORDS3 = {
      keyword: C_KEYWORDS,
      type: C_TYPES,
      literal: "true false NULL",
      // TODO: apply hinting work similar to what was done in cpp.js
      built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
    };
    const EXPRESSION_CONTAINS = [
      ...PREPROCESSORS,
      TYPES3,
      C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBERS,
      STRINGS
    ];
    const EXPRESSION_CONTEXT = {
      // This mode covers expression context where we can't expect a function
      // definition and shouldn't highlight anything that looks like one:
      // `return some()`, `else if()`, `(x*sum(1, 2))`
      variants: [
        {
          begin: /=/,
          end: /;/
        },
        {
          begin: /\(/,
          end: /\)/
        },
        {
          beginKeywords: "new throw return else",
          end: /;/
        }
      ],
      keywords: KEYWORDS3,
      contains: EXPRESSION_CONTAINS.concat([
        {
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS3,
          contains: EXPRESSION_CONTAINS.concat(["self"]),
          relevance: 0
        }
      ]),
      relevance: 0
    };
    const FUNCTION_DECLARATION = {
      begin: "(" + FUNCTION_TYPE_RE + "[\\*&\\s]+){1," + MAX_FUNCTION_TYPE_TOKENS + "}" + FUNCTION_TITLE,
      returnBegin: true,
      end: /[{;=]/,
      excludeEnd: true,
      keywords: KEYWORDS3,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [
        {
          // to prevent it from being confused as the function title
          begin: DECLTYPE_AUTO_RE,
          keywords: KEYWORDS3,
          relevance: 0
        },
        {
          begin: FUNCTION_TITLE,
          returnBegin: true,
          contains: [hljs.inherit(TITLE_MODE, { className: "title.function" })],
          relevance: 0
        },
        // allow for multiple declarations, e.g.:
        // extern void f(int), g(char);
        {
          relevance: 0,
          match: /,/
        },
        {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS3,
          relevance: 0,
          contains: [
            C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            STRINGS,
            NUMBERS,
            TYPES3,
            // Count matching parentheses.
            {
              begin: /\(/,
              end: /\)/,
              keywords: KEYWORDS3,
              relevance: 0,
              contains: [
                "self",
                C_LINE_COMMENT_MODE,
                hljs.C_BLOCK_COMMENT_MODE,
                STRINGS,
                NUMBERS,
                TYPES3
              ]
            }
          ]
        },
        TYPES3,
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        ...PREPROCESSORS
      ]
    };
    return {
      name: "C",
      aliases: ["h"],
      keywords: KEYWORDS3,
      // Until differentiations are added between `c` and `cpp`, `c` will
      // not be auto-detected to avoid auto-detect conflicts between C and C++
      disableAutodetect: true,
      illegal: "</",
      contains: [].concat(
        EXPRESSION_CONTEXT,
        FUNCTION_DECLARATION,
        EXPRESSION_CONTAINS,
        [
          ...PREPROCESSORS,
          {
            begin: hljs.IDENT_RE + "::",
            keywords: KEYWORDS3
          },
          {
            className: "class",
            beginKeywords: "enum class struct union",
            end: /[{;:<>=]/,
            contains: [
              { beginKeywords: "final class struct" },
              hljs.TITLE_MODE
            ]
          }
        ]
      ),
      exports: {
        preprocessor: PREPROCESSOR,
        strings: STRINGS,
        keywords: KEYWORDS3
      }
    };
  }

  // node_modules/highlight.js/es/languages/go.js
  function go(hljs) {
    const LITERALS3 = [
      "true",
      "false",
      "iota",
      "nil"
    ];
    const BUILT_INS3 = [
      "append",
      "cap",
      "close",
      "complex",
      "copy",
      "imag",
      "len",
      "make",
      "new",
      "panic",
      "print",
      "println",
      "real",
      "recover",
      "delete"
    ];
    const TYPES3 = [
      "bool",
      "byte",
      "complex64",
      "complex128",
      "error",
      "float32",
      "float64",
      "int8",
      "int16",
      "int32",
      "int64",
      "string",
      "uint8",
      "uint16",
      "uint32",
      "uint64",
      "int",
      "uint",
      "uintptr",
      "rune"
    ];
    const KWS = [
      "break",
      "case",
      "chan",
      "const",
      "continue",
      "default",
      "defer",
      "else",
      "fallthrough",
      "for",
      "func",
      "go",
      "goto",
      "if",
      "import",
      "interface",
      "map",
      "package",
      "range",
      "return",
      "select",
      "struct",
      "switch",
      "type",
      "var"
    ];
    const KEYWORDS3 = {
      keyword: KWS,
      type: TYPES3,
      literal: LITERALS3,
      built_in: BUILT_INS3
    };
    return {
      name: "Go",
      aliases: ["golang"],
      keywords: KEYWORDS3,
      illegal: "</",
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          className: "string",
          variants: [
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            {
              begin: "`",
              end: "`"
            }
          ]
        },
        {
          className: "number",
          variants: [
            {
              match: /-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,
              // hex without a present digit before . (making a digit afterwards required)
              relevance: 0
            },
            {
              match: /-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
              // hex with a present digit before . (making a digit afterwards optional)
              relevance: 0
            },
            {
              match: /-?\b0[oO](_?[0-7])*i?/,
              // leading 0o octal
              relevance: 0
            },
            {
              match: /-?\b0[bB](_?[01])*i?/,
              // leading 0b binary
              relevance: 0
            },
            {
              match: /-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,
              // decimal without a present digit before . (making a digit afterwards required)
              relevance: 0
            },
            {
              match: /-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,
              // decimal with a present digit before . (making a digit afterwards optional)
              relevance: 0
            }
          ]
        },
        {
          begin: /:=/
          // relevance booster
        },
        {
          className: "function",
          beginKeywords: "func",
          end: "\\s*(\\{|$)",
          excludeEnd: true,
          contains: [
            hljs.TITLE_MODE,
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              endsParent: true,
              keywords: KEYWORDS3,
              illegal: /["']/
            }
          ]
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/rust.js
  function rust(hljs) {
    const regex = hljs.regex;
    const RAW_IDENTIFIER = /(r#)?/;
    const UNDERSCORE_IDENT_RE = regex.concat(RAW_IDENTIFIER, hljs.UNDERSCORE_IDENT_RE);
    const IDENT_RE3 = regex.concat(RAW_IDENTIFIER, hljs.IDENT_RE);
    const FUNCTION_INVOKE = {
      scope: "title.function.invoke",
      relevance: 0,
      begin: regex.concat(
        /\b/,
        /(?!(?:let|for|while|if|else|match)\b)/,
        IDENT_RE3,
        regex.lookahead(/\s*\(/)
      )
    };
    const NUMBER_SUFFIX = "([ui](8|16|32|64|128|size)|f(16|32|64|128))?";
    const KEYWORDS3 = [
      "abstract",
      "as",
      "async",
      "await",
      "become",
      "box",
      "break",
      "const",
      "continue",
      "crate",
      "do",
      "dyn",
      "else",
      "enum",
      "extern",
      "false",
      "final",
      "fn",
      "for",
      "if",
      "impl",
      "in",
      "let",
      "loop",
      "macro",
      "match",
      "mod",
      "move",
      "mut",
      "override",
      "priv",
      "pub",
      "raw",
      "ref",
      "return",
      "self",
      "Self",
      "static",
      "struct",
      "super",
      "trait",
      "true",
      "try",
      "type",
      "typeof",
      "union",
      "unsafe",
      "unsized",
      "use",
      "virtual",
      "where",
      "while",
      "yield"
    ];
    const LITERALS3 = [
      "true",
      "false",
      "Some",
      "None",
      "Ok",
      "Err"
    ];
    const BUILTINS = [
      // functions
      "drop ",
      // traits
      "Copy",
      "Send",
      "Sized",
      "Sync",
      "Drop",
      "Fn",
      "FnMut",
      "FnOnce",
      "ToOwned",
      "Clone",
      "Debug",
      "PartialEq",
      "PartialOrd",
      "Eq",
      "Ord",
      "AsRef",
      "AsMut",
      "Into",
      "From",
      "Default",
      "Iterator",
      "Extend",
      "IntoIterator",
      "DoubleEndedIterator",
      "ExactSizeIterator",
      "SliceConcatExt",
      "ToString",
      // macros
      "assert!",
      "assert_eq!",
      "bitflags!",
      "bytes!",
      "cfg!",
      "col!",
      "concat!",
      "concat_idents!",
      "debug_assert!",
      "debug_assert_eq!",
      "env!",
      "eprintln!",
      "panic!",
      "file!",
      "format!",
      "format_args!",
      "include_bytes!",
      "include_str!",
      "line!",
      "local_data_key!",
      "module_path!",
      "option_env!",
      "print!",
      "println!",
      "select!",
      "stringify!",
      "try!",
      "unimplemented!",
      "unreachable!",
      "vec!",
      "write!",
      "writeln!",
      "macro_rules!",
      "assert_ne!",
      "debug_assert_ne!"
    ];
    const TYPES3 = [
      "i8",
      "i16",
      "i32",
      "i64",
      "i128",
      "isize",
      "u8",
      "u16",
      "u32",
      "u64",
      "u128",
      "usize",
      "f16",
      "f32",
      "f64",
      "f128",
      "str",
      "char",
      "bool",
      "Box",
      "Option",
      "Result",
      "String",
      "Vec"
    ];
    return {
      name: "Rust",
      aliases: ["rs"],
      keywords: {
        $pattern: hljs.IDENT_RE + "!?",
        type: TYPES3,
        keyword: KEYWORDS3,
        literal: LITERALS3,
        built_in: BUILTINS
      },
      illegal: "</",
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
        hljs.inherit(hljs.QUOTE_STRING_MODE, {
          begin: /b?"/,
          illegal: null
        }),
        {
          scope: "symbol",
          // negative lookahead to avoid matching `'`
          begin: /'[a-zA-Z_][a-zA-Z0-9_]*(?!')/
        },
        {
          scope: "string",
          variants: [
            { begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ },
            {
              begin: /b?'/,
              end: /'/,
              contains: [
                {
                  scope: "char.escape",
                  match: /\\('|"|\\|\w|x\w{2}|u\w{4}|U\w{8})/
                }
              ]
            }
          ]
        },
        {
          scope: "number",
          variants: [
            { begin: "\\b0b([01_]+)" + NUMBER_SUFFIX },
            { begin: "\\b0o([0-7_]+)" + NUMBER_SUFFIX },
            { begin: "\\b0x([A-Fa-f0-9_]+)" + NUMBER_SUFFIX },
            { begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + NUMBER_SUFFIX }
          ],
          relevance: 0
        },
        {
          begin: [
            /\bsafe/,
            /\s+/,
            /extern/
          ],
          scope: {
            1: "keyword",
            3: "keyword"
          }
        },
        {
          begin: [
            /fn/,
            /\s+/,
            UNDERSCORE_IDENT_RE
          ],
          scope: {
            1: "keyword",
            3: "title.function"
          }
        },
        {
          scope: "meta",
          begin: "#!?\\[",
          end: "\\]",
          contains: [
            {
              scope: "string",
              begin: /"/,
              end: /"/,
              contains: [
                hljs.BACKSLASH_ESCAPE
              ]
            }
          ]
        },
        {
          begin: [
            /let/,
            /\s+/,
            /(?:mut\s+)?/,
            UNDERSCORE_IDENT_RE
          ],
          scope: {
            1: "keyword",
            3: "keyword",
            4: "variable"
          }
        },
        // must come before impl/for rule later
        {
          begin: [
            /for/,
            /\s+/,
            UNDERSCORE_IDENT_RE,
            /\s+/,
            /in/
          ],
          scope: {
            1: "keyword",
            3: "variable",
            5: "keyword"
          }
        },
        {
          begin: [
            /type/,
            /\s+/,
            UNDERSCORE_IDENT_RE
          ],
          scope: {
            1: "keyword",
            3: "title.class"
          }
        },
        {
          begin: [
            /(?:trait|enum|struct|union|impl|for)/,
            /\s+/,
            UNDERSCORE_IDENT_RE
          ],
          scope: {
            1: "keyword",
            3: "title.class"
          }
        },
        {
          begin: hljs.IDENT_RE + "::",
          keywords: {
            keyword: "Self",
            built_in: BUILTINS,
            type: TYPES3
          }
        },
        {
          scope: "punctuation",
          begin: "->"
        },
        FUNCTION_INVOKE
      ]
    };
  }

  // node_modules/highlight.js/es/languages/sql.js
  function sql(hljs) {
    const regex = hljs.regex;
    const COMMENT_MODE = hljs.COMMENT("--", "$");
    const STRING = {
      scope: "string",
      variants: [
        {
          begin: /'/,
          end: /'/,
          contains: [{ match: /''/ }]
        }
      ]
    };
    const QUOTED_IDENTIFIER = {
      begin: /"/,
      end: /"/,
      contains: [{ match: /""/ }]
    };
    const LITERALS3 = [
      "true",
      "false",
      // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
      // "null",
      "unknown"
    ];
    const MULTI_WORD_TYPES = [
      "double precision",
      "large object",
      "with timezone",
      "without timezone"
    ];
    const TYPES3 = [
      "bigint",
      "binary",
      "blob",
      "boolean",
      "char",
      "character",
      "clob",
      "date",
      "dec",
      "decfloat",
      "decimal",
      "float",
      "int",
      "integer",
      "interval",
      "nchar",
      "nclob",
      "national",
      "numeric",
      "real",
      "row",
      "smallint",
      "time",
      "timestamp",
      "varchar",
      "varying",
      // modifier (character varying)
      "varbinary"
    ];
    const NON_RESERVED_WORDS = [
      "add",
      "asc",
      "collation",
      "desc",
      "final",
      "first",
      "last",
      "view"
    ];
    const RESERVED_WORDS = [
      "abs",
      "acos",
      "all",
      "allocate",
      "alter",
      "and",
      "any",
      "are",
      "array",
      "array_agg",
      "array_max_cardinality",
      "as",
      "asensitive",
      "asin",
      "asymmetric",
      "at",
      "atan",
      "atomic",
      "authorization",
      "avg",
      "begin",
      "begin_frame",
      "begin_partition",
      "between",
      "bigint",
      "binary",
      "blob",
      "boolean",
      "both",
      "by",
      "call",
      "called",
      "cardinality",
      "cascaded",
      "case",
      "cast",
      "ceil",
      "ceiling",
      "char",
      "char_length",
      "character",
      "character_length",
      "check",
      "classifier",
      "clob",
      "close",
      "coalesce",
      "collate",
      "collect",
      "column",
      "commit",
      "condition",
      "connect",
      "constraint",
      "contains",
      "convert",
      "copy",
      "corr",
      "corresponding",
      "cos",
      "cosh",
      "count",
      "covar_pop",
      "covar_samp",
      "create",
      "cross",
      "cube",
      "cume_dist",
      "current",
      "current_catalog",
      "current_date",
      "current_default_transform_group",
      "current_path",
      "current_role",
      "current_row",
      "current_schema",
      "current_time",
      "current_timestamp",
      "current_path",
      "current_role",
      "current_transform_group_for_type",
      "current_user",
      "cursor",
      "cycle",
      "date",
      "day",
      "deallocate",
      "dec",
      "decimal",
      "decfloat",
      "declare",
      "default",
      "define",
      "delete",
      "dense_rank",
      "deref",
      "describe",
      "deterministic",
      "disconnect",
      "distinct",
      "double",
      "drop",
      "dynamic",
      "each",
      "element",
      "else",
      "empty",
      "end",
      "end_frame",
      "end_partition",
      "end-exec",
      "equals",
      "escape",
      "every",
      "except",
      "exec",
      "execute",
      "exists",
      "exp",
      "external",
      "extract",
      "false",
      "fetch",
      "filter",
      "first_value",
      "float",
      "floor",
      "for",
      "foreign",
      "frame_row",
      "free",
      "from",
      "full",
      "function",
      "fusion",
      "get",
      "global",
      "grant",
      "group",
      "grouping",
      "groups",
      "having",
      "hold",
      "hour",
      "identity",
      "in",
      "indicator",
      "initial",
      "inner",
      "inout",
      "insensitive",
      "insert",
      "int",
      "integer",
      "intersect",
      "intersection",
      "interval",
      "into",
      "is",
      "join",
      "json_array",
      "json_arrayagg",
      "json_exists",
      "json_object",
      "json_objectagg",
      "json_query",
      "json_table",
      "json_table_primitive",
      "json_value",
      "lag",
      "language",
      "large",
      "last_value",
      "lateral",
      "lead",
      "leading",
      "left",
      "like",
      "like_regex",
      "listagg",
      "ln",
      "local",
      "localtime",
      "localtimestamp",
      "log",
      "log10",
      "lower",
      "match",
      "match_number",
      "match_recognize",
      "matches",
      "max",
      "member",
      "merge",
      "method",
      "min",
      "minute",
      "mod",
      "modifies",
      "module",
      "month",
      "multiset",
      "national",
      "natural",
      "nchar",
      "nclob",
      "new",
      "no",
      "none",
      "normalize",
      "not",
      "nth_value",
      "ntile",
      "null",
      "nullif",
      "numeric",
      "octet_length",
      "occurrences_regex",
      "of",
      "offset",
      "old",
      "omit",
      "on",
      "one",
      "only",
      "open",
      "or",
      "order",
      "out",
      "outer",
      "over",
      "overlaps",
      "overlay",
      "parameter",
      "partition",
      "pattern",
      "per",
      "percent",
      "percent_rank",
      "percentile_cont",
      "percentile_disc",
      "period",
      "portion",
      "position",
      "position_regex",
      "power",
      "precedes",
      "precision",
      "prepare",
      "primary",
      "procedure",
      "ptf",
      "range",
      "rank",
      "reads",
      "real",
      "recursive",
      "ref",
      "references",
      "referencing",
      "regr_avgx",
      "regr_avgy",
      "regr_count",
      "regr_intercept",
      "regr_r2",
      "regr_slope",
      "regr_sxx",
      "regr_sxy",
      "regr_syy",
      "release",
      "result",
      "return",
      "returns",
      "revoke",
      "right",
      "rollback",
      "rollup",
      "row",
      "row_number",
      "rows",
      "running",
      "savepoint",
      "scope",
      "scroll",
      "search",
      "second",
      "seek",
      "select",
      "sensitive",
      "session_user",
      "set",
      "show",
      "similar",
      "sin",
      "sinh",
      "skip",
      "smallint",
      "some",
      "specific",
      "specifictype",
      "sql",
      "sqlexception",
      "sqlstate",
      "sqlwarning",
      "sqrt",
      "start",
      "static",
      "stddev_pop",
      "stddev_samp",
      "submultiset",
      "subset",
      "substring",
      "substring_regex",
      "succeeds",
      "sum",
      "symmetric",
      "system",
      "system_time",
      "system_user",
      "table",
      "tablesample",
      "tan",
      "tanh",
      "then",
      "time",
      "timestamp",
      "timezone_hour",
      "timezone_minute",
      "to",
      "trailing",
      "translate",
      "translate_regex",
      "translation",
      "treat",
      "trigger",
      "trim",
      "trim_array",
      "true",
      "truncate",
      "uescape",
      "union",
      "unique",
      "unknown",
      "unnest",
      "update",
      "upper",
      "user",
      "using",
      "value",
      "values",
      "value_of",
      "var_pop",
      "var_samp",
      "varbinary",
      "varchar",
      "varying",
      "versioning",
      "when",
      "whenever",
      "where",
      "width_bucket",
      "window",
      "with",
      "within",
      "without",
      "year"
    ];
    const RESERVED_FUNCTIONS = [
      "abs",
      "acos",
      "array_agg",
      "asin",
      "atan",
      "avg",
      "cast",
      "ceil",
      "ceiling",
      "coalesce",
      "corr",
      "cos",
      "cosh",
      "count",
      "covar_pop",
      "covar_samp",
      "cume_dist",
      "dense_rank",
      "deref",
      "element",
      "exp",
      "extract",
      "first_value",
      "floor",
      "json_array",
      "json_arrayagg",
      "json_exists",
      "json_object",
      "json_objectagg",
      "json_query",
      "json_table",
      "json_table_primitive",
      "json_value",
      "lag",
      "last_value",
      "lead",
      "listagg",
      "ln",
      "log",
      "log10",
      "lower",
      "max",
      "min",
      "mod",
      "nth_value",
      "ntile",
      "nullif",
      "percent_rank",
      "percentile_cont",
      "percentile_disc",
      "position",
      "position_regex",
      "power",
      "rank",
      "regr_avgx",
      "regr_avgy",
      "regr_count",
      "regr_intercept",
      "regr_r2",
      "regr_slope",
      "regr_sxx",
      "regr_sxy",
      "regr_syy",
      "row_number",
      "sin",
      "sinh",
      "sqrt",
      "stddev_pop",
      "stddev_samp",
      "substring",
      "substring_regex",
      "sum",
      "tan",
      "tanh",
      "translate",
      "translate_regex",
      "treat",
      "trim",
      "trim_array",
      "unnest",
      "upper",
      "value_of",
      "var_pop",
      "var_samp",
      "width_bucket"
    ];
    const POSSIBLE_WITHOUT_PARENS = [
      "current_catalog",
      "current_date",
      "current_default_transform_group",
      "current_path",
      "current_role",
      "current_schema",
      "current_transform_group_for_type",
      "current_user",
      "session_user",
      "system_time",
      "system_user",
      "current_time",
      "localtime",
      "current_timestamp",
      "localtimestamp"
    ];
    const COMBOS = [
      "create table",
      "insert into",
      "primary key",
      "foreign key",
      "not null",
      "alter table",
      "add constraint",
      "grouping sets",
      "on overflow",
      "character set",
      "respect nulls",
      "ignore nulls",
      "nulls first",
      "nulls last",
      "depth first",
      "breadth first"
    ];
    const FUNCTIONS = RESERVED_FUNCTIONS;
    const KEYWORDS3 = [
      ...RESERVED_WORDS,
      ...NON_RESERVED_WORDS
    ].filter((keyword) => {
      return !RESERVED_FUNCTIONS.includes(keyword);
    });
    const VARIABLE = {
      scope: "variable",
      match: /@[a-z0-9][a-z0-9_]*/
    };
    const OPERATOR = {
      scope: "operator",
      match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
      relevance: 0
    };
    const FUNCTION_CALL = {
      match: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
      relevance: 0,
      keywords: { built_in: FUNCTIONS }
    };
    function kws_to_regex(list) {
      return regex.concat(
        /\b/,
        regex.either(...list.map((kw) => {
          return kw.replace(/\s+/, "\\s+");
        })),
        /\b/
      );
    }
    const MULTI_WORD_KEYWORDS = {
      scope: "keyword",
      match: kws_to_regex(COMBOS),
      relevance: 0
    };
    function reduceRelevancy(list, {
      exceptions,
      when
    } = {}) {
      const qualifyFn = when;
      exceptions = exceptions || [];
      return list.map((item) => {
        if (item.match(/\|\d+$/) || exceptions.includes(item)) {
          return item;
        } else if (qualifyFn(item)) {
          return `${item}|0`;
        } else {
          return item;
        }
      });
    }
    return {
      name: "SQL",
      case_insensitive: true,
      // does not include {} or HTML tags `</`
      illegal: /[{}]|<\//,
      keywords: {
        $pattern: /\b[\w\.]+/,
        keyword: reduceRelevancy(KEYWORDS3, { when: (x2) => x2.length < 3 }),
        literal: LITERALS3,
        type: TYPES3,
        built_in: POSSIBLE_WITHOUT_PARENS
      },
      contains: [
        {
          scope: "type",
          match: kws_to_regex(MULTI_WORD_TYPES)
        },
        MULTI_WORD_KEYWORDS,
        FUNCTION_CALL,
        VARIABLE,
        STRING,
        QUOTED_IDENTIFIER,
        hljs.C_NUMBER_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        COMMENT_MODE,
        OPERATOR
      ]
    };
  }

  // node_modules/highlight.js/es/languages/yaml.js
  function yaml(hljs) {
    const LITERALS3 = "true false yes no null";
    const URI_CHARACTERS = "[\\w#;/?:@&=+$,.~*'()[\\]]+";
    const KEY = {
      className: "attr",
      variants: [
        // added brackets support and special char support
        { begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
        {
          // double quoted keys - with brackets and special char support
          begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/
        },
        {
          // single quoted keys - with brackets and special char support
          begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/
        }
      ]
    };
    const TEMPLATE_VARIABLES = {
      className: "template-variable",
      variants: [
        {
          // jinja templates Ansible
          begin: /\{\{/,
          end: /\}\}/
        },
        {
          // Ruby i18n
          begin: /%\{/,
          end: /\}/
        }
      ]
    };
    const SINGLE_QUOTE_STRING = {
      className: "string",
      relevance: 0,
      begin: /'/,
      end: /'/,
      contains: [
        {
          match: /''/,
          scope: "char.escape",
          relevance: 0
        }
      ]
    };
    const STRING = {
      className: "string",
      relevance: 0,
      variants: [
        {
          begin: /"/,
          end: /"/
        },
        { begin: /\S+/ }
      ],
      contains: [
        hljs.BACKSLASH_ESCAPE,
        TEMPLATE_VARIABLES
      ]
    };
    const CONTAINER_STRING = hljs.inherit(STRING, { variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [
          {
            begin: /''/,
            relevance: 0
          }
        ]
      },
      {
        begin: /"/,
        end: /"/
      },
      { begin: /[^\s,{}[\]]+/ }
    ] });
    const DATE_RE = "[0-9]{4}(-[0-9][0-9]){0,2}";
    const TIME_RE = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?";
    const FRACTION_RE = "(\\.[0-9]*)?";
    const ZONE_RE = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?";
    const TIMESTAMP = {
      className: "number",
      begin: "\\b" + DATE_RE + TIME_RE + FRACTION_RE + ZONE_RE + "\\b"
    };
    const VALUE_CONTAINER = {
      end: ",",
      endsWithParent: true,
      excludeEnd: true,
      keywords: LITERALS3,
      relevance: 0
    };
    const OBJECT = {
      begin: /\{/,
      end: /\}/,
      contains: [VALUE_CONTAINER],
      illegal: "\\n",
      relevance: 0
    };
    const ARRAY = {
      begin: "\\[",
      end: "\\]",
      contains: [VALUE_CONTAINER],
      illegal: "\\n",
      relevance: 0
    };
    const MODES2 = [
      KEY,
      {
        className: "meta",
        begin: "^---\\s*$",
        relevance: 10
      },
      {
        // multi line string
        // Blocks start with a | or > followed by a newline
        //
        // Indentation of subsequent lines must be the same to
        // be considered part of the block
        className: "string",
        begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
      },
      {
        // Ruby/Rails erb
        begin: "<%[%=-]?",
        end: "[%-]?%>",
        subLanguage: "ruby",
        excludeBegin: true,
        excludeEnd: true,
        relevance: 0
      },
      {
        // named tags
        className: "type",
        begin: "!\\w+!" + URI_CHARACTERS
      },
      // https://yaml.org/spec/1.2/spec.html#id2784064
      {
        // verbatim tags
        className: "type",
        begin: "!<" + URI_CHARACTERS + ">"
      },
      {
        // primary tags
        className: "type",
        begin: "!" + URI_CHARACTERS
      },
      {
        // secondary tags
        className: "type",
        begin: "!!" + URI_CHARACTERS
      },
      {
        // fragment id &ref
        className: "meta",
        begin: "&" + hljs.UNDERSCORE_IDENT_RE + "$"
      },
      {
        // fragment reference *ref
        className: "meta",
        begin: "\\*" + hljs.UNDERSCORE_IDENT_RE + "$"
      },
      {
        // array listing
        className: "bullet",
        // TODO: remove |$ hack when we have proper look-ahead support
        begin: "-(?=[ ]|$)",
        relevance: 0
      },
      hljs.HASH_COMMENT_MODE,
      {
        beginKeywords: LITERALS3,
        keywords: { literal: LITERALS3 }
      },
      TIMESTAMP,
      // numbers are any valid C-style number that
      // sit isolated from other words
      {
        className: "number",
        begin: hljs.C_NUMBER_RE + "\\b",
        relevance: 0
      },
      OBJECT,
      ARRAY,
      SINGLE_QUOTE_STRING,
      STRING
    ];
    const VALUE_MODES = [...MODES2];
    VALUE_MODES.pop();
    VALUE_MODES.push(CONTAINER_STRING);
    VALUE_CONTAINER.contains = VALUE_MODES;
    return {
      name: "YAML",
      case_insensitive: true,
      aliases: ["yml"],
      contains: MODES2
    };
  }

  // node_modules/highlight.js/es/languages/markdown.js
  function markdown(hljs) {
    const regex = hljs.regex;
    const INLINE_HTML = {
      begin: /<\/?[A-Za-z_]/,
      end: ">",
      subLanguage: "xml",
      relevance: 0
    };
    const HORIZONTAL_RULE = { match: /^ {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,}$/ };
    const CODE = {
      className: "code",
      variants: [
        // TODO: fix to allow these to work with sublanguage also
        { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
        { begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
        // needed to allow markdown as a sublanguage to work
        {
          begin: "```",
          end: "```+[ ]*$"
        },
        {
          begin: "~~~",
          end: "~~~+[ ]*$"
        },
        { begin: "`.+?`" },
        {
          begin: "(?=^( {4}|\\t))",
          // use contains to gobble up multiple lines to allow the block to be whatever size
          // but only have a single open/close tag vs one per line
          contains: [
            {
              begin: "^( {4}|\\t)",
              end: "(\\n)$"
            }
          ],
          relevance: 0
        }
      ]
    };
    const LIST = {
      className: "bullet",
      begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
      end: "\\s+",
      excludeEnd: true
    };
    const LINK_REFERENCE = {
      begin: /^\[[^\n]+\]:/,
      returnBegin: true,
      contains: [
        {
          className: "symbol",
          begin: /\[/,
          end: /\]/,
          excludeBegin: true,
          excludeEnd: true
        },
        {
          className: "link",
          begin: /:\s*/,
          end: /$/,
          excludeBegin: true
        }
      ]
    };
    const URL_SCHEME = /[A-Za-z][A-Za-z0-9+.-]*/;
    const LINK = {
      variants: [
        // too much like nested array access in so many languages
        // to have any real relevance
        {
          begin: /\[.+?\]\[.*?\]/,
          relevance: 0
        },
        // popular internet URLs
        {
          begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
          relevance: 2
        },
        {
          begin: regex.concat(/\[.+?\]\(/, URL_SCHEME, /:\/\/.*?\)/),
          relevance: 2
        },
        // relative urls
        {
          begin: /\[.+?\]\([./?&#].*?\)/,
          relevance: 1
        },
        // whatever else, lower relevance (might not be a link at all)
        {
          begin: /\[.*?\]\(.*?\)/,
          relevance: 0
        }
      ],
      returnBegin: true,
      contains: [
        {
          // empty strings for alt or link text
          match: /\[(?=\])/
        },
        {
          className: "string",
          relevance: 0,
          begin: "\\[",
          end: "\\]",
          excludeBegin: true,
          returnEnd: true
        },
        {
          className: "link",
          relevance: 0,
          begin: "\\]\\(",
          end: "\\)",
          excludeBegin: true,
          excludeEnd: true
        },
        {
          className: "symbol",
          relevance: 0,
          begin: "\\]\\[",
          end: "\\]",
          excludeBegin: true,
          excludeEnd: true
        }
      ]
    };
    const BOLD = {
      className: "strong",
      contains: [],
      // defined later
      variants: [
        {
          begin: /_{2}(?!\s)/,
          end: /_{2}/
        },
        {
          begin: /\*{2}(?!\s)/,
          end: /\*{2}/
        }
      ]
    };
    const ITALIC = {
      className: "emphasis",
      contains: [],
      // defined later
      variants: [
        {
          begin: /\*(?![*\s])/,
          end: /\*/
        },
        {
          begin: /_(?![_\s])/,
          end: /_/,
          relevance: 0
        }
      ]
    };
    const BOLD_WITHOUT_ITALIC = hljs.inherit(BOLD, { contains: [] });
    const ITALIC_WITHOUT_BOLD = hljs.inherit(ITALIC, { contains: [] });
    BOLD.contains.push(ITALIC_WITHOUT_BOLD);
    ITALIC.contains.push(BOLD_WITHOUT_ITALIC);
    let CONTAINABLE = [
      INLINE_HTML,
      LINK
    ];
    [
      BOLD,
      ITALIC,
      BOLD_WITHOUT_ITALIC,
      ITALIC_WITHOUT_BOLD
    ].forEach((m2) => {
      m2.contains = m2.contains.concat(CONTAINABLE);
    });
    CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);
    const HEADER = {
      className: "section",
      variants: [
        {
          begin: "^#{1,6}",
          end: "$",
          contains: CONTAINABLE
        },
        {
          begin: "(?=^.+?\\n[=-]{2,}$)",
          contains: [
            { begin: "^[=-]*$" },
            {
              begin: "^",
              end: "\\n",
              contains: CONTAINABLE
            }
          ]
        }
      ]
    };
    const BLOCKQUOTE = {
      className: "quote",
      begin: "^>\\s+",
      contains: CONTAINABLE,
      end: "$"
    };
    const ENTITY = {
      //https://spec.commonmark.org/0.31.2/#entity-references
      scope: "literal",
      match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
    };
    return {
      name: "Markdown",
      aliases: [
        "md",
        "mkdown",
        "mkd"
      ],
      contains: [
        HEADER,
        INLINE_HTML,
        LIST,
        // must come before BOLD/ITALIC so that a `***` or `___` thematic break
        // isn't mistaken for the start of bold text
        HORIZONTAL_RULE,
        BOLD,
        ITALIC,
        BLOCKQUOTE,
        CODE,
        LINK,
        LINK_REFERENCE,
        ENTITY
      ]
    };
  }

  // node_modules/highlight.js/es/languages/plaintext.js
  function plaintext(hljs) {
    return {
      name: "Plain text",
      aliases: [
        "text",
        "txt"
      ],
      disableAutodetect: true
    };
  }

  // scripts/shims/fs.js
  var readFileSync = () => {
    throw new Error("\u6587\u4EF6\u7CFB\u7EDF\u5728\u6D4F\u89C8\u5668\u4E2D\u4E0D\u53EF\u7528\uFF08--inline-images \u4EC5\u652F\u6301 Node \u73AF\u5883\uFF09");
  };

  // scripts/shims/path.js
  var resolve = (_base, p) => p;
  var extname = (p) => {
    const i = String(p).lastIndexOf(".");
    return i > -1 ? p.slice(i) : "";
  };
  var isAbsolute = () => false;

  // src/highlight.js
  var HLJS_TOKEN_STYLES = {
    comment: { color: "#6a737d", "font-style": "italic" },
    quote: { color: "#6a737d", "font-style": "italic" },
    keyword: { color: "#d73a49", "font-weight": "600" },
    "selector-tag": { color: "#d73a49" },
    subst: { color: "#24292e" },
    string: { color: "#032f62" },
    doctag: { color: "#032f62" },
    regexp: { color: "#032f62" },
    addition: { color: "#22863a" },
    number: { color: "#005cc5" },
    literal: { color: "#005cc5" },
    title: { color: "#6f42c1", "font-weight": "600" },
    section: { color: "#6f42c1", "font-weight": "600" },
    "selector-id": { color: "#6f42c1" },
    attr: { color: "#005cc5" },
    attribute: { color: "#005cc5" },
    variable: { color: "#e36209" },
    "template-variable": { color: "#e36209" },
    type: { color: "#005cc5" },
    "selector-class": { color: "#005cc5" },
    "built_in": { color: "#e36209" },
    "builtin-name": { color: "#e36209" },
    symbol: { color: "#e36209" },
    bullet: { color: "#e36209" },
    link: { color: "#e36209", "text-decoration": "underline" },
    meta: { color: "#e36209" },
    name: { color: "#22863a" },
    tag: { color: "#22863a" },
    deletion: { color: "#b31d28" },
    emphasis: { "font-style": "italic" },
    strong: { "font-weight": "600" },
    function: { color: "#6f42c1" },
    params: { color: "#24292e" },
    operator: { color: "#d73a49" },
    punctuation: { color: "#24292e" }
  };
  function applyTokenStyles(highlightedHtml) {
    return highlightedHtml.replace(/<span class="([^"]*)">/g, (match, classes) => {
      const merged = {};
      for (const raw of classes.split(/\s+/)) {
        if (!raw) continue;
        const cls = raw.startsWith("hljs-") ? raw.slice(5) : raw;
        const style = HLJS_TOKEN_STYLES[cls];
        if (style) {
          for (const [k, v2] of Object.entries(style)) merged[k] = v2;
        }
      }
      const entries = Object.entries(merged);
      if (entries.length === 0) return "<span>";
      const inline = entries.map(([k, v2]) => `${k}:${v2}`).join(";");
      return `<span style="${inline}">`;
    });
  }

  // src/themes.js
  var THEMES = {
    /**
     * clean — 中性简洁（默认）
     * 白底黑字，适合公众号 / 知乎 / 掘金 / CSDN 等绝大多数场景
     */
    clean: {
      id: "clean",
      name: "Clean \u7B80\u6D01\uFF08\u9ED8\u8BA4\uFF09",
      container: {
        color: "#3f3f3f",
        "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        "font-size": "15px",
        "line-height": "1.8",
        "letter-spacing": "0.3px",
        "word-spacing": "1px"
      },
      heading: {
        color: "#1a1a1a",
        "font-weight": "700",
        "line-height": "1.4",
        "margin-top": "28px",
        "margin-bottom": "14px"
      },
      h1: { "font-size": "24px" },
      h2: { "font-size": "21px" },
      h3: { "font-size": "18px" },
      h4: { "font-size": "16px" },
      h5: { "font-size": "15px" },
      h6: { "font-size": "14px" },
      paragraph: {
        "margin-top": "0",
        "margin-bottom": "16px",
        "text-align": "justify"
      },
      strong: { color: "#1a1a1a", "font-weight": "700" },
      em: { "font-style": "italic" },
      del: { "text-decoration": "line-through", color: "#999" },
      link: { color: "#576b95", "text-decoration": "none", "word-break": "break-all" },
      "inline-code": {
        color: "#c7254e",
        "background-color": "#f9f2f4",
        "font-family": '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
        "font-size": "90%",
        padding: "2px 5px",
        "border-radius": "3px"
      },
      codeblock: {
        "background-color": "#f6f8fa",
        "font-family": '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
        "font-size": "13px",
        "line-height": "1.6",
        padding: "14px 16px",
        "border-radius": "8px",
        "overflow-x": "auto",
        color: "#24292e",
        "margin-top": "0",
        "margin-bottom": "16px",
        border: "1px solid #eaecef"
      },
      blockquote: {
        "border-left": "4px solid #dfe2e5",
        "background-color": "#f6f8fa",
        color: "#6a737d",
        padding: "12px 16px",
        "border-radius": "0 6px 6px 0",
        "margin-top": "0",
        "margin-bottom": "16px"
      },
      table: {
        "border-collapse": "collapse",
        width: "100%",
        "font-size": "14px",
        "margin-top": "0",
        "margin-bottom": "16px"
      },
      th: {
        "background-color": "#f6f8fa",
        color: "#24292e",
        "font-weight": "600",
        "border": "1px solid #dfe2e5",
        padding: "8px 12px",
        "text-align": "left"
      },
      td: {
        border: "1px solid #dfe2e5",
        padding: "8px 12px"
      },
      "tr-alt": { "background-color": "#fafbfc" },
      hr: { border: "none", "border-top": "1px solid #eaecef", "margin-top": "24px", "margin-bottom": "24px" },
      ul: { "margin-top": "0", "margin-bottom": "16px", "padding-left": "24px" },
      ol: { "margin-top": "0", "margin-bottom": "16px", "padding-left": "24px" },
      li: { "margin-bottom": "6px" },
      img: { "max-width": "100%", "border-radius": "6px", "margin-top": "4px", "margin-bottom": "16px" },
      task: { color: "#576b95", "margin-right": "6px" },
      toc: {
        "background-color": "#fafbfc",
        border: "1px solid #eaecef",
        "border-radius": "8px",
        padding: "16px 20px",
        "margin-bottom": "24px",
        "font-size": "14px"
      },
      card: {
        box: {
          "border-left": "4px solid",
          "border-radius": "8px",
          padding: "14px 16px",
          "margin-top": "0",
          "margin-bottom": "16px",
          "line-height": "1.7"
        },
        title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
        quote: {
          "font-size": "30px",
          "line-height": "0.6",
          "font-family": 'Georgia, "Songti SC", serif',
          "margin-right": "4px",
          display: "inline-block",
          "vertical-align": "-5px"
        },
        kinds: {
          tip: { accent: "#16a34a", bg: "rgba(22,163,74,0.09)" },
          warning: { accent: "#d97706", bg: "rgba(217,119,6,0.09)" },
          note: { accent: "#2563eb", bg: "rgba(37,99,235,0.09)" },
          danger: { accent: "#dc2626", bg: "rgba(220,38,38,0.09)" },
          quote: { accent: "#6f42c1", bg: "rgba(111,66,193,0.07)" }
        }
      }
    },
    /**
     * paper — 纸感暖调
     * 适合文艺类公众号 / 随笔，米色背景 + 衬线标题
     */
    paper: {
      id: "paper",
      name: "Paper \u7EB8\u611F",
      container: {
        color: "#3e3a34",
        "font-family": '"Songti SC", "Noto Serif SC", "STSong", "SimSun", serif',
        "font-size": "16px",
        "line-height": "1.9",
        "letter-spacing": "0.5px"
      },
      heading: {
        color: "#2f2a24",
        "font-weight": "700",
        "line-height": "1.4",
        "margin-top": "32px",
        "margin-bottom": "16px"
      },
      h1: { "font-size": "26px" },
      h2: { "font-size": "22px" },
      h3: { "font-size": "19px" },
      h4: { "font-size": "17px" },
      h5: { "font-size": "16px" },
      h6: { "font-size": "15px" },
      paragraph: { "margin-top": "0", "margin-bottom": "18px", "text-align": "justify" },
      strong: { color: "#2f2a24", "font-weight": "700" },
      em: { "font-style": "italic" },
      del: { "text-decoration": "line-through", color: "#a09a90" },
      link: { color: "#8a6d3b", "text-decoration": "underline", "word-break": "break-all" },
      "inline-code": {
        color: "#9a3e2f",
        "background-color": "#f5efe6",
        "font-family": '"SFMono-Regular", Consolas, monospace',
        "font-size": "90%",
        padding: "2px 5px",
        "border-radius": "3px"
      },
      codeblock: {
        "background-color": "#f5efe6",
        "font-family": '"SFMono-Regular", Consolas, monospace',
        "font-size": "13px",
        "line-height": "1.7",
        padding: "16px 18px",
        "border-radius": "8px",
        "overflow-x": "auto",
        color: "#3e3a34",
        "margin-top": "0",
        "margin-bottom": "18px",
        border: "1px solid #e8dfd0"
      },
      blockquote: {
        "border-left": "4px solid #d9c9a8",
        "background-color": "#faf6ee",
        color: "#7a7266",
        padding: "14px 18px",
        "border-radius": "0 8px 8px 0",
        "margin-top": "0",
        "margin-bottom": "18px"
      },
      table: {
        "border-collapse": "collapse",
        width: "100%",
        "font-size": "14px",
        "margin-top": "0",
        "margin-bottom": "18px"
      },
      th: {
        "background-color": "#f0e8d8",
        color: "#3e3a34",
        "font-weight": "700",
        border: "1px solid #ddd2bc",
        padding: "8px 12px",
        "text-align": "left"
      },
      td: { border: "1px solid #ddd2bc", padding: "8px 12px" },
      "tr-alt": { "background-color": "#faf7f0" },
      hr: { border: "none", "border-top": "1px solid #ddd2bc", "margin-top": "28px", "margin-bottom": "28px" },
      ul: { "margin-top": "0", "margin-bottom": "18px", "padding-left": "24px" },
      ol: { "margin-top": "0", "margin-bottom": "18px", "padding-left": "24px" },
      li: { "margin-bottom": "6px" },
      img: { "max-width": "100%", "border-radius": "4px", "margin-top": "4px", "margin-bottom": "18px" },
      task: { color: "#8a6d3b", "margin-right": "6px" },
      toc: {
        "background-color": "#faf6ee",
        border: "1px solid #e8dfd0",
        "border-radius": "8px",
        padding: "16px 20px",
        "margin-bottom": "28px",
        "font-size": "14px"
      },
      card: {
        box: {
          "border-left": "4px solid",
          "border-radius": "8px",
          padding: "16px 18px",
          "margin-top": "0",
          "margin-bottom": "18px",
          "line-height": "1.8"
        },
        title: { "font-weight": "700", "font-size": "16px", display: "block", "margin-bottom": "6px" },
        quote: {
          "font-size": "32px",
          "line-height": "0.6",
          "font-family": 'Georgia, "Songti SC", serif',
          "margin-right": "4px",
          display: "inline-block",
          "vertical-align": "-6px"
        },
        kinds: {
          tip: { accent: "#5c8a4e", bg: "rgba(92,138,78,0.10)" },
          warning: { accent: "#b07f2a", bg: "rgba(176,127,42,0.10)" },
          note: { accent: "#5a7ba8", bg: "rgba(90,123,168,0.10)" },
          danger: { accent: "#ad4b3c", bg: "rgba(173,75,60,0.10)" },
          quote: { accent: "#7c6a4f", bg: "rgba(124,106,79,0.10)" }
        }
      }
    },
    /**
     * dark — 深色
     * 适合技术博客 / 掘金 / CSDN 的深色阅读场景
     */
    dark: {
      id: "dark",
      name: "Dark \u6DF1\u8272",
      container: {
        color: "#d1d5db",
        "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        "font-size": "15px",
        "line-height": "1.8",
        "letter-spacing": "0.3px"
      },
      heading: { color: "#f3f4f6", "font-weight": "700", "line-height": "1.4", "margin-top": "28px", "margin-bottom": "14px" },
      h1: { "font-size": "24px" },
      h2: { "font-size": "21px" },
      h3: { "font-size": "18px" },
      h4: { "font-size": "16px" },
      h5: { "font-size": "15px" },
      h6: { "font-size": "14px" },
      paragraph: { "margin-top": "0", "margin-bottom": "16px", "text-align": "justify" },
      strong: { color: "#f3f4f6", "font-weight": "700" },
      em: { "font-style": "italic" },
      del: { "text-decoration": "line-through", color: "#6b7280" },
      link: { color: "#60a5fa", "text-decoration": "none", "word-break": "break-all" },
      "inline-code": {
        color: "#f9a8d4",
        "background-color": "rgba(249,168,212,0.12)",
        "font-family": '"SFMono-Regular", Consolas, monospace',
        "font-size": "90%",
        padding: "2px 5px",
        "border-radius": "3px"
      },
      codeblock: {
        "background-color": "#161b22",
        "font-family": '"SFMono-Regular", Consolas, monospace',
        "font-size": "13px",
        "line-height": "1.6",
        padding: "14px 16px",
        "border-radius": "8px",
        "overflow-x": "auto",
        color: "#c9d1d9",
        "margin-top": "0",
        "margin-bottom": "16px",
        border: "1px solid #30363d"
      },
      blockquote: {
        "border-left": "4px solid #30363d",
        "background-color": "#161b22",
        color: "#8b949e",
        padding: "12px 16px",
        "border-radius": "0 6px 6px 0",
        "margin-top": "0",
        "margin-bottom": "16px"
      },
      table: { "border-collapse": "collapse", width: "100%", "font-size": "14px", "margin-top": "0", "margin-bottom": "16px" },
      th: {
        "background-color": "#161b22",
        color: "#c9d1d9",
        "font-weight": "600",
        border: "1px solid #30363d",
        padding: "8px 12px",
        "text-align": "left"
      },
      td: { border: "1px solid #30363d", padding: "8px 12px" },
      "tr-alt": { "background-color": "rgba(255,255,255,0.02)" },
      hr: { border: "none", "border-top": "1px solid #30363d", "margin-top": "24px", "margin-bottom": "24px" },
      ul: { "margin-top": "0", "margin-bottom": "16px", "padding-left": "24px" },
      ol: { "margin-top": "0", "margin-bottom": "16px", "padding-left": "24px" },
      li: { "margin-bottom": "6px" },
      img: { "max-width": "100%", "border-radius": "6px", "margin-top": "4px", "margin-bottom": "16px" },
      task: { color: "#60a5fa", "margin-right": "6px" },
      toc: {
        "background-color": "#161b22",
        border: "1px solid #30363d",
        "border-radius": "8px",
        padding: "16px 20px",
        "margin-bottom": "24px",
        "font-size": "14px"
      },
      card: {
        box: {
          "border-left": "4px solid",
          "border-radius": "8px",
          padding: "14px 16px",
          "margin-top": "0",
          "margin-bottom": "16px",
          "line-height": "1.7"
        },
        title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
        quote: {
          "font-size": "30px",
          "line-height": "0.6",
          "font-family": 'Georgia, "Songti SC", serif',
          "margin-right": "4px",
          display: "inline-block",
          "vertical-align": "-5px"
        },
        kinds: {
          tip: { accent: "#4ade80", bg: "rgba(74,222,128,0.10)" },
          warning: { accent: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
          note: { accent: "#60a5fa", bg: "rgba(96,165,250,0.10)" },
          danger: { accent: "#f87171", bg: "rgba(248,113,113,0.10)" },
          quote: { accent: "#c084fc", bg: "rgba(192,132,252,0.10)" }
        }
      }
    }
  };
  function makeTheme(overrides) {
    const base = THEMES.clean;
    return { ...base, ...overrides };
  }
  THEMES.nord = makeTheme({
    id: "nord",
    name: "Nord \u51B7\u8C03",
    container: {
      color: "#2e3440",
      "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      "font-size": "15px",
      "line-height": "1.8",
      "letter-spacing": "0.3px",
      "word-spacing": "1px"
    },
    heading: { color: "#2e3440", "font-weight": "700", "line-height": "1.4", "margin-top": "28px", "margin-bottom": "14px" },
    strong: { color: "#2e3440", "font-weight": "700" },
    link: { color: "#5e81ac", "text-decoration": "none", "word-break": "break-all" },
    "inline-code": {
      color: "#b46a92",
      "background-color": "#eceff4",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "90%",
      padding: "2px 5px",
      "border-radius": "3px"
    },
    codeblock: {
      "background-color": "#eceff4",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "13px",
      "line-height": "1.6",
      padding: "14px 16px",
      "border-radius": "8px",
      "overflow-x": "auto",
      color: "#2e3440",
      "margin-top": "0",
      "margin-bottom": "16px",
      border: "1px solid #d8dee9"
    },
    blockquote: {
      "border-left": "4px solid #81a1c1",
      "background-color": "#eceff4",
      color: "#4c566a",
      padding: "12px 16px",
      "border-radius": "0 6px 6px 0",
      "margin-top": "0",
      "margin-bottom": "16px"
    },
    th: {
      "background-color": "#e5e9f0",
      color: "#2e3440",
      "font-weight": "600",
      border: "1px solid #d8dee9",
      padding: "8px 12px",
      "text-align": "left"
    },
    td: { border: "1px solid #d8dee9", padding: "8px 12px" },
    "tr-alt": { "background-color": "#f4f6f9" },
    task: { color: "#5e81ac", "margin-right": "6px" },
    card: {
      box: {
        "border-left": "4px solid",
        "border-radius": "8px",
        padding: "14px 16px",
        "margin-top": "0",
        "margin-bottom": "16px",
        "line-height": "1.7"
      },
      title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
      kinds: {
        tip: { accent: "#4a7d5c", bg: "rgba(74,125,92,0.10)" },
        warning: { accent: "#9c7a3c", bg: "rgba(156,122,60,0.10)" },
        note: { accent: "#4f7085", bg: "rgba(79,112,133,0.10)" },
        danger: { accent: "#a94442", bg: "rgba(169,68,66,0.10)" },
        quote: { accent: "#7d6a9e", bg: "rgba(125,106,158,0.10)" }
      }
    }
  });
  THEMES.coffee = makeTheme({
    id: "coffee",
    name: "Coffee \u5496\u5561",
    container: {
      color: "#453a2f",
      "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      "font-size": "15px",
      "line-height": "1.85",
      "letter-spacing": "0.4px",
      "word-spacing": "1px"
    },
    heading: { color: "#332820", "font-weight": "700", "line-height": "1.4", "margin-top": "28px", "margin-bottom": "14px" },
    strong: { color: "#332820", "font-weight": "700" },
    link: { color: "#8a5a44", "text-decoration": "underline", "word-break": "break-all" },
    "inline-code": {
      color: "#9a4f2c",
      "background-color": "#f6efe7",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "90%",
      padding: "2px 5px",
      "border-radius": "3px"
    },
    codeblock: {
      "background-color": "#f7f1e9",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "13px",
      "line-height": "1.6",
      padding: "14px 16px",
      "border-radius": "8px",
      "overflow-x": "auto",
      color: "#453a2f",
      "margin-top": "0",
      "margin-bottom": "16px",
      border: "1px solid #e7dccd"
    },
    blockquote: {
      "border-left": "4px solid #c9a37e",
      "background-color": "#faf5ee",
      color: "#7c6b5a",
      padding: "12px 16px",
      "border-radius": "0 6px 6px 0",
      "margin-top": "0",
      "margin-bottom": "16px"
    },
    th: {
      "background-color": "#f0e7db",
      color: "#453a2f",
      "font-weight": "600",
      border: "1px solid #e0d2bf",
      padding: "8px 12px",
      "text-align": "left"
    },
    td: { border: "1px solid #e0d2bf", padding: "8px 12px" },
    "tr-alt": { "background-color": "#fbf7f0" },
    hr: { border: "none", "border-top": "1px solid #e0d2bf", "margin-top": "24px", "margin-bottom": "24px" },
    task: { color: "#8a5a44", "margin-right": "6px" },
    card: {
      box: {
        "border-left": "4px solid",
        "border-radius": "8px",
        padding: "14px 16px",
        "margin-top": "0",
        "margin-bottom": "16px",
        "line-height": "1.7"
      },
      title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
      kinds: {
        tip: { accent: "#6f824f", bg: "rgba(111,130,79,0.10)" },
        warning: { accent: "#a67c2e", bg: "rgba(166,124,46,0.10)" },
        note: { accent: "#6f6f9c", bg: "rgba(111,111,156,0.10)" },
        danger: { accent: "#b0553f", bg: "rgba(176,85,63,0.10)" },
        quote: { accent: "#9b7b56", bg: "rgba(155,123,86,0.10)" }
      }
    }
  });
  THEMES.midnight = makeTheme({
    id: "midnight",
    name: "Midnight \u6DF1\u591C",
    container: {
      color: "#c6d0e0",
      "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      "font-size": "15px",
      "line-height": "1.8",
      "letter-spacing": "0.3px"
    },
    heading: { color: "#e6ecf7", "font-weight": "700", "line-height": "1.4", "margin-top": "28px", "margin-bottom": "14px" },
    strong: { color: "#e6ecf7", "font-weight": "700" },
    link: { color: "#7aa2f7", "text-decoration": "none", "word-break": "break-all" },
    "inline-code": {
      color: "#9ece6a",
      "background-color": "rgba(158,206,106,0.10)",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "90%",
      padding: "2px 5px",
      "border-radius": "3px"
    },
    codeblock: {
      "background-color": "#16233c",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "13px",
      "line-height": "1.6",
      padding: "14px 16px",
      "border-radius": "8px",
      "overflow-x": "auto",
      color: "#c6d0e0",
      "margin-top": "0",
      "margin-bottom": "16px",
      border: "1px solid #26344f"
    },
    blockquote: {
      "border-left": "4px solid #26344f",
      "background-color": "#16233c",
      color: "#8f9cb8",
      padding: "12px 16px",
      "border-radius": "0 6px 6px 0",
      "margin-top": "0",
      "margin-bottom": "16px"
    },
    th: {
      "background-color": "#16233c",
      color: "#c6d0e0",
      "font-weight": "600",
      border: "1px solid #26344f",
      padding: "8px 12px",
      "text-align": "left"
    },
    td: { border: "1px solid #26344f", padding: "8px 12px" },
    "tr-alt": { "background-color": "rgba(122,162,247,0.03)" },
    task: { color: "#7aa2f7", "margin-right": "6px" },
    card: {
      box: {
        "border-left": "4px solid",
        "border-radius": "8px",
        padding: "14px 16px",
        "margin-top": "0",
        "margin-bottom": "16px",
        "line-height": "1.7"
      },
      title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
      kinds: {
        tip: { accent: "#9ece6a", bg: "rgba(158,206,106,0.10)" },
        warning: { accent: "#e0af68", bg: "rgba(224,175,104,0.10)" },
        note: { accent: "#7aa2f7", bg: "rgba(122,162,247,0.10)" },
        danger: { accent: "#f7768e", bg: "rgba(247,118,142,0.10)" },
        quote: { accent: "#bb9af7", bg: "rgba(187,154,247,0.10)" }
      }
    }
  });
  THEMES["one-dark"] = makeTheme({
    id: "one-dark",
    name: "One Dark \u6DF1\u8272",
    container: {
      color: "#abb2bf",
      "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      "font-size": "15px",
      "line-height": "1.8",
      "letter-spacing": "0.3px"
    },
    heading: { color: "#e06c75", "font-weight": "700", "line-height": "1.4", "margin-top": "28px", "margin-bottom": "14px" },
    strong: { color: "#d19a66", "font-weight": "700" },
    link: { color: "#61afef", "text-decoration": "none", "word-break": "break-all" },
    "inline-code": {
      color: "#98c379",
      "background-color": "rgba(152,195,121,0.10)",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "90%",
      padding: "2px 5px",
      "border-radius": "3px"
    },
    codeblock: {
      "background-color": "#282c34",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "13px",
      "line-height": "1.6",
      padding: "14px 16px",
      "border-radius": "8px",
      "overflow-x": "auto",
      color: "#abb2bf",
      "margin-top": "0",
      "margin-bottom": "16px",
      border: "1px solid #3e4451"
    },
    blockquote: {
      "border-left": "4px solid #3e4451",
      "background-color": "#282c34",
      color: "#7f848e",
      padding: "12px 16px",
      "border-radius": "0 6px 6px 0",
      "margin-top": "0",
      "margin-bottom": "16px"
    },
    th: {
      "background-color": "#282c34",
      color: "#d19a66",
      "font-weight": "600",
      border: "1px solid #3e4451",
      padding: "8px 12px",
      "text-align": "left"
    },
    td: { border: "1px solid #3e4451", padding: "8px 12px" },
    "tr-alt": { "background-color": "rgba(97,175,239,0.04)" },
    task: { color: "#61afef", "margin-right": "6px" },
    card: {
      box: {
        "border-left": "4px solid",
        "border-radius": "8px",
        padding: "14px 16px",
        "margin-top": "0",
        "margin-bottom": "16px",
        "line-height": "1.7"
      },
      title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
      kinds: {
        tip: { accent: "#98c379", bg: "rgba(152,195,121,0.10)" },
        warning: { accent: "#e5c07b", bg: "rgba(229,192,123,0.10)" },
        note: { accent: "#61afef", bg: "rgba(97,175,239,0.10)" },
        danger: { accent: "#e06c75", bg: "rgba(224,108,117,0.10)" },
        quote: { accent: "#c678dd", bg: "rgba(198,120,221,0.10)" }
      }
    }
  });
  THEMES.solarized = makeTheme({
    id: "solarized",
    name: "Solarized \u62A4\u773C",
    container: {
      color: "#657b83",
      "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      "font-size": "15px",
      "line-height": "1.8",
      "letter-spacing": "0.3px"
    },
    heading: { color: "#586e75", "font-weight": "700", "line-height": "1.4", "margin-top": "28px", "margin-bottom": "14px" },
    strong: { color: "#586e75", "font-weight": "700" },
    link: { color: "#268bd2", "text-decoration": "none", "word-break": "break-all" },
    "inline-code": {
      color: "#2aa198",
      "background-color": "#eee8d5",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "90%",
      padding: "2px 5px",
      "border-radius": "3px"
    },
    codeblock: {
      "background-color": "#eee8d5",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "13px",
      "line-height": "1.6",
      padding: "14px 16px",
      "border-radius": "8px",
      "overflow-x": "auto",
      color: "#657b83",
      "margin-top": "0",
      "margin-bottom": "16px",
      border: "1px solid #d5ccba"
    },
    blockquote: {
      "border-left": "4px solid #93a1a1",
      "background-color": "#eee8d5",
      color: "#839496",
      padding: "12px 16px",
      "border-radius": "0 6px 6px 0",
      "margin-top": "0",
      "margin-bottom": "16px"
    },
    th: {
      "background-color": "#eee8d5",
      color: "#586e75",
      "font-weight": "600",
      border: "1px solid #d5ccba",
      padding: "8px 12px",
      "text-align": "left"
    },
    td: { border: "1px solid #d5ccba", padding: "8px 12px" },
    "tr-alt": { "background-color": "#f5efdf" },
    hr: { border: "none", "border-top": "1px solid #d5ccba", "margin-top": "24px", "margin-bottom": "24px" },
    task: { color: "#268bd2", "margin-right": "6px" },
    card: {
      box: {
        "border-left": "4px solid",
        "border-radius": "8px",
        padding: "14px 16px",
        "margin-top": "0",
        "margin-bottom": "16px",
        "line-height": "1.7"
      },
      title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
      kinds: {
        tip: { accent: "#859900", bg: "rgba(133,153,0,0.10)" },
        warning: { accent: "#b58900", bg: "rgba(181,137,0,0.10)" },
        note: { accent: "#268bd2", bg: "rgba(38,139,210,0.10)" },
        danger: { accent: "#dc322f", bg: "rgba(220,50,47,0.10)" },
        quote: { accent: "#6c71c4", bg: "rgba(108,113,196,0.10)" }
      }
    }
  });
  THEMES["github-light"] = makeTheme({
    id: "github-light",
    name: "GitHub Light \u6D45\u8272",
    container: {
      color: "#24292e",
      "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      "font-size": "15px",
      "line-height": "1.8",
      "letter-spacing": "0.3px"
    },
    heading: { color: "#24292e", "font-weight": "700", "line-height": "1.4", "margin-top": "28px", "margin-bottom": "14px" },
    strong: { color: "#24292e", "font-weight": "700" },
    link: { color: "#0366d6", "text-decoration": "none", "word-break": "break-all" },
    "inline-code": {
      color: "#d73a49",
      "background-color": "rgba(27,31,35,0.06)",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "90%",
      padding: "2px 5px",
      "border-radius": "3px"
    },
    codeblock: {
      "background-color": "#f6f8fa",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "13px",
      "line-height": "1.6",
      padding: "14px 16px",
      "border-radius": "8px",
      "overflow-x": "auto",
      color: "#24292e",
      "margin-top": "0",
      "margin-bottom": "16px",
      border: "1px solid #eaecef"
    },
    blockquote: {
      "border-left": "4px solid #dfe2e5",
      "background-color": "#f6f8fa",
      color: "#6a737d",
      padding: "12px 16px",
      "border-radius": "0 6px 6px 0",
      "margin-top": "0",
      "margin-bottom": "16px"
    },
    th: {
      "background-color": "#f6f8fa",
      color: "#24292e",
      "font-weight": "600",
      border: "1px solid #dfe2e5",
      padding: "8px 12px",
      "text-align": "left"
    },
    td: { border: "1px solid #dfe2e5", padding: "8px 12px" },
    "tr-alt": { "background-color": "#fafbfc" },
    task: { color: "#0366d6", "margin-right": "6px" },
    card: {
      box: {
        "border-left": "4px solid",
        "border-radius": "8px",
        padding: "14px 16px",
        "margin-top": "0",
        "margin-bottom": "16px",
        "line-height": "1.7"
      },
      title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
      kinds: {
        tip: { accent: "#22863a", bg: "rgba(34,134,58,0.09)" },
        warning: { accent: "#b08800", bg: "rgba(176,136,0,0.09)" },
        note: { accent: "#0366d6", bg: "rgba(3,102,214,0.09)" },
        danger: { accent: "#d73a49", bg: "rgba(215,58,73,0.09)" },
        quote: { accent: "#6f42c1", bg: "rgba(111,66,193,0.09)" }
      }
    }
  });
  THEMES["solarized-dark"] = makeTheme({
    id: "solarized-dark",
    name: "Solarized Dark \u62A4\u773C\u6DF1\u8272",
    container: {
      color: "#93a1a1",
      "font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      "font-size": "15px",
      "line-height": "1.8",
      "letter-spacing": "0.3px"
    },
    heading: { color: "#eee8d5", "font-weight": "700", "line-height": "1.4", "margin-top": "28px", "margin-bottom": "14px" },
    strong: { color: "#eee8d5", "font-weight": "700" },
    link: { color: "#268bd2", "text-decoration": "none", "word-break": "break-all" },
    "inline-code": {
      color: "#2aa198",
      "background-color": "rgba(42,161,152,0.12)",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "90%",
      padding: "2px 5px",
      "border-radius": "3px"
    },
    codeblock: {
      "background-color": "#073642",
      "font-family": '"SFMono-Regular", Consolas, monospace',
      "font-size": "13px",
      "line-height": "1.6",
      padding: "14px 16px",
      "border-radius": "8px",
      "overflow-x": "auto",
      color: "#93a1a1",
      "margin-top": "0",
      "margin-bottom": "16px",
      border: "1px solid #0b4450"
    },
    blockquote: {
      "border-left": "4px solid #0b4450",
      "background-color": "#073642",
      color: "#657b83",
      padding: "12px 16px",
      "border-radius": "0 6px 6px 0",
      "margin-top": "0",
      "margin-bottom": "16px"
    },
    th: {
      "background-color": "#073642",
      color: "#eee8d5",
      "font-weight": "600",
      border: "1px solid #0b4450",
      padding: "8px 12px",
      "text-align": "left"
    },
    td: { border: "1px solid #0b4450", padding: "8px 12px" },
    "tr-alt": { "background-color": "rgba(38,139,210,0.05)" },
    task: { color: "#268bd2", "margin-right": "6px" },
    card: {
      box: {
        "border-left": "4px solid",
        "border-radius": "8px",
        padding: "14px 16px",
        "margin-top": "0",
        "margin-bottom": "16px",
        "line-height": "1.7"
      },
      title: { "font-weight": "700", "font-size": "15px", display: "block", "margin-bottom": "6px" },
      kinds: {
        tip: { accent: "#859900", bg: "rgba(133,153,0,0.12)" },
        warning: { accent: "#b58900", bg: "rgba(181,137,0,0.12)" },
        note: { accent: "#268bd2", bg: "rgba(38,139,210,0.12)" },
        danger: { accent: "#dc322f", bg: "rgba(220,50,47,0.12)" },
        quote: { accent: "#6c71c4", bg: "rgba(108,113,196,0.12)" }
      }
    }
  });
  function getTheme(id) {
    return THEMES[id] || THEMES.clean;
  }

  // src/platforms.js
  var PLATFORMS = {
    wechat: {
      id: "wechat",
      name: "\u5FAE\u4FE1\u516C\u4F17\u53F7",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB\u516C\u4F17\u53F7\u7F16\u8F91\u5668\u5373\u53EF\uFF0C\u517C\u5BB9\u6027\u6700\u597D",
      mode: "html",
      defaultTheme: "clean"
    },
    zhihu: {
      id: "zhihu",
      name: "\u77E5\u4E4E\u4E13\u680F",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB\u77E5\u4E4E\u7F16\u8F91\u5668\uFF0C\u77E5\u4E4E\u4F1A\u81EA\u52A8\u6E05\u6D17\u4E3A\u5E73\u53F0\u98CE\u683C",
      mode: "html",
      defaultTheme: "clean"
    },
    juejin: {
      id: "juejin",
      name: "\u6398\u91D1",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB\u6398\u91D1\u7F16\u8F91\u5668",
      mode: "html",
      defaultTheme: "clean"
    },
    csdn: {
      id: "csdn",
      name: "CSDN \u535A\u5BA2",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB CSDN \u5BCC\u6587\u672C\u7F16\u8F91\u5668",
      mode: "html",
      defaultTheme: "clean"
    },
    yuque: {
      id: "yuque",
      name: "\u8BED\u96C0",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB\u8BED\u96C0\u7F16\u8F91\u5668\uFF08\u77E5\u8BC6\u5E93 / \u6587\u6863\uFF09",
      mode: "html",
      defaultTheme: "clean"
    },
    jianshu: {
      id: "jianshu",
      name: "\u7B80\u4E66",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB\u7B80\u4E66\u7F16\u8F91\u5668",
      mode: "html",
      defaultTheme: "clean"
    },
    cnblogs: {
      id: "cnblogs",
      name: "\u535A\u5BA2\u56ED",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB\u535A\u5BA2\u56ED\u7F16\u8F91\u5668",
      mode: "html",
      defaultTheme: "clean"
    },
    sf: {
      id: "sf",
      name: "\u601D\u5426 SegmentFault",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB\u601D\u5426\uFF08SegmentFault\uFF09\u7F16\u8F91\u5668",
      mode: "html",
      defaultTheme: "clean"
    },
    infoq: {
      id: "infoq",
      name: "InfoQ \u4E2D\u6587",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB InfoQ \u4E2D\u6587\u7F16\u8F91\u5668",
      mode: "html",
      defaultTheme: "clean"
    },
    medium: {
      id: "medium",
      name: "Medium",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB Medium \u7F16\u8F91\u5668\uFF08\u56FD\u9645\u6280\u672F\u5199\u4F5C\uFF09",
      mode: "html",
      defaultTheme: "clean"
    },
    devto: {
      id: "devto",
      name: "DEV.to",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB DEV.to \u7F16\u8F91\u5668\uFF08\u56FD\u9645\u5F00\u53D1\u8005\u793E\u533A\uFF09",
      mode: "html",
      defaultTheme: "clean"
    },
    typecho: {
      id: "typecho",
      name: "Typecho \u535A\u5BA2",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB Typecho \u540E\u53F0\u7F16\u8F91\u5668\uFF08\u81EA\u5EFA\u535A\u5BA2\uFF09",
      mode: "html",
      defaultTheme: "clean"
    },
    wordpress: {
      id: "wordpress",
      name: "WordPress",
      desc: "\u5185\u8054\u6837\u5F0F\u5BCC\u6587\u672C\uFF0C\u7C98\u8D34\u8FDB WordPress \u7ECF\u5178/\u533A\u5757\u7F16\u8F91\u5668\uFF08\u81EA\u5EFA\u535A\u5BA2\uFF09",
      mode: "html",
      defaultTheme: "clean"
    },
    xiaohongshu: {
      id: "xiaohongshu",
      name: "\u5C0F\u7EA2\u4E66",
      desc: "\u7EAF\u6587\u672C + \u56FE\u7247\u6E05\u5355 + \u81EA\u52A8\u8BDD\u9898\u6807\u7B7E\uFF08\u5C0F\u7EA2\u4E66\u4E0D\u652F\u6301\u5BCC\u6587\u672C\uFF09",
      mode: "text",
      defaultTheme: "clean"
    },
    generic: {
      id: "generic",
      name: "\u901A\u7528\u7F51\u9875",
      desc: "\u5B8C\u6574 HTML \u6587\u6863\uFF08\u542B <head>/<style>\uFF09\uFF0C\u9002\u5408\u672C\u5730\u9884\u89C8 / \u81EA\u5EFA\u535A\u5BA2 / \u6253\u5370",
      mode: "html",
      fullDocument: true,
      defaultTheme: "clean"
    }
  };
  function getPlatform(id) {
    return PLATFORMS[id] || PLATFORMS.wechat;
  }

  // src/cards.js
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function toCss(obj) {
    return Object.entries(obj).map(([k, v2]) => `${k}:${String(v2).replace(/"/g, "&quot;")}`).join(";");
  }
  function createCardExtension(theme) {
    const card = theme.card || THEMES.clean.card;
    return {
      name: "postforgeCard",
      level: "block",
      start(src) {
        return src.indexOf(":::");
      },
      tokenizer(src) {
        const dividerRule = /^:::divider(?: +(.*?))?(?:\n(?=\n|$)|$)/;
        const dm = dividerRule.exec(src);
        if (dm) {
          return {
            type: "postforgeCard",
            raw: dm[0],
            kind: "divider",
            title: (dm[1] || "").trim(),
            body: "",
            tokens: []
          };
        }
        const rule = /^:::(tip|warning|note|danger|quote)(?:\s+(.*?))?\n([\s\S]*?)\n:::(?:\n|$)/;
        const match = rule.exec(src);
        if (!match) return void 0;
        return {
          type: "postforgeCard",
          raw: match[0],
          kind: match[1],
          title: (match[2] || "").trim(),
          body: match[3],
          tokens: this.lexer.blockTokens(match[3])
        };
      },
      renderer(token) {
        if (token.kind === "divider") {
          const label = token.title ? `<span style="letter-spacing:3px">\u2756 ${esc(token.title)} \u2756</span>` : "";
          return `<div style="text-align:center;padding:10px 0;color:#a8a8a8;font-size:13px;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;margin-top:18px;margin-bottom:18px">${label}</div>`;
        }
        const kind = card.kinds[token.kind] || card.kinds.note;
        const titleHtml = token.title ? `<strong style="${toCss({ ...card.title, color: kind.accent })}">${esc(token.title)}</strong>` : "";
        const quoteMark = token.kind === "quote" && !token.title ? `<span style="${toCss({ ...card.quote, color: kind.accent })}">\u201C</span>` : "";
        return `<div style="${toCss({
          ...card.box,
          "border-left-color": kind.accent,
          "background-color": kind.bg
        })}">${titleHtml}${quoteMark}${this.parser.parse(token.tokens)}</div>`;
      }
    };
  }
  var postforgeCardExtension = createCardExtension(THEMES.clean);
  function cardToText(token, blockToText) {
    if (token.kind === "divider") {
      return token.title ? `\u2500\u2500 ${token.title} \u2500\u2500` : "\u2500\u2500";
    }
    const title = token.title ? `\u3010${token.title}\u3011` : "";
    return `${title}${blockToText(token.tokens)}`;
  }

  // src/renderer.js
  for (const [name, def] of [
    ["javascript", javascript],
    ["js", javascript],
    ["typescript", typescript],
    ["ts", typescript],
    ["python", python],
    ["py", python],
    ["bash", bash],
    ["sh", bash],
    ["shell", shell],
    ["json", json],
    ["xml", xml],
    ["html", xml],
    ["css", css],
    ["java", java],
    ["cpp", cpp],
    ["c", c],
    ["go", go],
    ["rust", rust],
    ["rs", rust],
    ["sql", sql],
    ["yaml", yaml],
    ["yml", yaml],
    ["markdown", markdown],
    ["md", markdown],
    ["plaintext", plaintext],
    ["text", plaintext]
  ]) {
    core_default.registerLanguage(name, def);
  }
  var imageSizeExtension = {
    name: "postforgeImage",
    level: "inline",
    start(src) {
      return src.indexOf("![");
    },
    tokenizer(src) {
      const rule = /^!\[([^\]]*)\]\(([^)\s]*)(?:\s+=\s*(\d+)(?:x(\d+))?)?\)/;
      const m2 = rule.exec(src);
      if (!m2) return void 0;
      return {
        type: "postforgeImage",
        raw: m2[0],
        text: m2[1],
        href: m2[2],
        width: m2[3] ? Number(m2[3]) : null,
        height: m2[4] ? Number(m2[4]) : null
      };
    },
    renderer(token) {
      return this.parser.renderer.image(token);
    }
  };
  function toMarkedExtensions(theme) {
    const ext = createCardExtension(theme);
    return {
      block: [ext.tokenizer],
      startBlock: [ext.start],
      inline: [imageSizeExtension.tokenizer],
      startInline: [imageSizeExtension.start],
      renderers: { [ext.name]: ext.renderer, postforgeImage: imageSizeExtension.renderer }
    };
  }
  function esc2(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function deepMerge(base, over) {
    const out = { ...base };
    for (const [k, v2] of Object.entries(over || {})) {
      if (v2 && typeof v2 === "object" && !Array.isArray(v2) && base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) {
        out[k] = deepMerge(base[k], v2);
      } else {
        out[k] = v2;
      }
    }
    return out;
  }
  function toCss2(obj) {
    return Object.entries(obj).map(([k, v2]) => `${k}:${String(v2).replace(/"/g, "&quot;")}`).join(";");
  }
  var IMAGE_MIME = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".bmp": "image/bmp",
    ".ico": "image/x-icon"
  };
  function isRemoteOrSpecial(href) {
    return /^(https?:|data:|#|\/\/)/i.test(href);
  }
  function slugify(text) {
    return text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
  }
  var PostRenderer = class extends P {
    constructor(theme, platform, options) {
      super();
      this.theme = theme;
      this.platform = platform;
      this.userOptions = options || {};
      this.options = options || {};
      this.headings = [];
      this.idCounters = /* @__PURE__ */ new Map();
      this._row = 0;
    }
    heading(token) {
      const inline = this.parser.parseInline(token.tokens);
      const plain = inline.replace(/<[^>]*>/g, "");
      let prefix = "";
      if (this.userOptions.numberedHeadings && token.depth <= 3) {
        if (token.depth === 1) {
          this._h1 = (this._h1 || 0) + 1;
          this._h2 = 0;
          this._h3 = 0;
          prefix = `${this._h1} `;
        } else if (token.depth === 2) {
          this._h2 = (this._h2 || 0) + 1;
          this._h3 = 0;
          prefix = `${this._h1 || 1}.${this._h2} `;
        } else {
          this._h3 = (this._h3 || 0) + 1;
          prefix = `${this._h1 || 1}.${this._h2 || 1}.${this._h3} `;
        }
      }
      const base = slugify(plain) || "heading";
      const count = this.idCounters.get(base) || 0;
      this.idCounters.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count}`;
      this.headings.push({ depth: token.depth, id, text: prefix + plain });
      const h = this.theme.heading;
      const size = this.theme[`h${token.depth}`] || {};
      return `<h${token.depth} id="${esc2(id)}" style="${toCss2({ ...h, ...size })}">${prefix}${inline}</h${token.depth}>`;
    }
    paragraph(token) {
      return `<p style="${toCss2(this.theme.paragraph)}">${this.parser.parseInline(token.tokens)}</p>`;
    }
    code(token) {
      const lang = (token.lang || "").split(/\s+/)[0];
      const source = token.text.replace(/\n$/, "");
      let body;
      if (lang && core_default.getLanguage(lang)) {
        body = applyTokenStyles(
          core_default.highlight(source, { language: lang, ignoreIllegals: true }).value
        );
      } else {
        body = esc2(source);
      }
      return `<pre style="${toCss2(this.theme.codeblock)}"><code>${body}</code></pre>`;
    }
    codespan(token) {
      return `<code style="${toCss2(this.theme["inline-code"])}">${esc2(token.text)}</code>`;
    }
    blockquote(token) {
      return `<blockquote style="${toCss2(this.theme.blockquote)}">${this.parser.parse(token.tokens)}</blockquote>`;
    }
    list(token) {
      const style = token.ordered ? this.theme.ol : this.theme.ul;
      const tag = token.ordered ? "ol" : "ul";
      const items = token.items.map((it2) => this.listitem(it2)).join("");
      return `<${tag} style="${toCss2(style)}">${items}</${tag}>`;
    }
    listitem(token) {
      let body = this.parser.parse(token.tokens);
      if (token.task) {
        const mark = token.checked ? "\u2611" : "\u2610";
        body = `<span style="${toCss2(this.theme.task)}">${mark}</span>${body}`;
      }
      return `<li style="${toCss2(this.theme.li)}">${body}</li>`;
    }
    checkbox() {
      return "";
    }
    table(token) {
      const headerCells = token.header.map((c2) => this.tablecell(c2, true)).join("");
      this._row = 0;
      const rows = token.rows.map((r) => {
        this._row++;
        return `<tr>${r.map((c2) => this.tablecell(c2, false)).join("")}</tr>`;
      }).join("");
      return `<table style="${toCss2(this.theme.table)}"><thead><tr>${headerCells}</tr></thead><tbody>${rows}</tbody></table>`;
    }
    tablecell(token, header) {
      let style = header ? { ...this.theme.th } : { ...this.theme.td };
      if (!header && this._row % 2 === 1 && this.theme["tr-alt"]) {
        style = { ...style, ...this.theme["tr-alt"] };
      }
      const tag = header ? "th" : "td";
      return `<${tag} style="${toCss2(style)}">${this.parser.parseInline(token.tokens)}</${tag}>`;
    }
    strong(token) {
      return `<strong style="${toCss2(this.theme.strong)}">${this.parser.parseInline(token.tokens)}</strong>`;
    }
    em(token) {
      return `<em style="${toCss2(this.theme.em)}">${this.parser.parseInline(token.tokens)}</em>`;
    }
    del(token) {
      return `<del style="${toCss2(this.theme.del)}">${this.parser.parseInline(token.tokens)}</del>`;
    }
    link(token) {
      const title = token.title ? ` title="${esc2(token.title)}"` : "";
      return `<a href="${esc2(token.href)}"${title} style="${toCss2(this.theme.link)}">${this.parser.parseInline(token.tokens)}</a>`;
    }
    image(token) {
      const alt = token.text ? ` alt="${esc2(token.text)}"` : "";
      const title = token.title ? ` title="${esc2(token.title)}"` : "";
      const width = token.width ?? null;
      const height = token.height ?? null;
      const src = this.resolveImageSrc(token.href);
      const style = { ...this.theme.img };
      if (width) style.width = `${width}px`;
      if (height) style.height = `${height}px`;
      if (width || height) delete style["max-width"];
      return `<img src="${esc2(src)}"${alt}${title} style="${toCss2(style)}" loading="lazy" referrerpolicy="no-referrer">`;
    }
    /**
     * 解析 <img> 的 src。
     * 开启 options.inlineImages 时，把本地图片读取为 base64 data URI 内联，
     * 粘贴进公众号编辑器可被微信自动转存为素材 CDN 地址。
     */
    resolveImageSrc(href) {
      const opts = this.userOptions || {};
      if (!opts.inlineImages || isRemoteOrSpecial(href)) return href;
      const base = opts.baseDir || process.cwd();
      const abs = isAbsolute(href) ? href : resolve(base, href);
      try {
        const data = readFileSync(abs);
        const mime = IMAGE_MIME[extname(href).toLowerCase()] || "application/octet-stream";
        return `data:${mime};base64,${data.toString("base64")}`;
      } catch {
        return href;
      }
    }
    hr() {
      return `<hr style="${toCss2(this.theme.hr)}">`;
    }
    html(token) {
      return token.text;
    }
  };
  function renderToc(headings, theme) {
    const items = headings.filter((h) => h.depth <= 3).map((h) => {
      const pad = (h.depth - 1) * 1.4;
      return `<div style="padding-left:${pad.toFixed(1)}em;line-height:1.9"><a href="#${esc2(h.id)}" style="${toCss2(theme.link)}">${esc2(h.text)}</a></div>`;
    }).join("");
    return `<div style="${toCss2(theme.toc)}"><strong style="color:${theme.heading.color};font-size:14px">\u76EE\u5F55</strong>${items}</div>`;
  }
  function wrapDocument(section, theme) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc2(section.title || "PostForge \u6392\u7248\u8F93\u51FA")}</title>
<style>
  body { margin: 0; padding: 40px 16px; background: #f7f7f7; }
  .pf-doc { max-width: 720px; margin: 0 auto; background: #fff; padding: 40px 36px; border-radius: 10px; box-shadow: 0 1px 8px rgba(0,0,0,.06); }
  @media (max-width: 640px) { body { padding: 16px 8px; } .pf-doc { padding: 24px 18px; } }
</style>
</head>
<body>
<div class="pf-doc">${section.body}</div>
</body>
</html>`;
  }
  function extractText(tokens) {
    const lines = [];
    const images = [];
    const headings = [];
    const inlineText = (toks) => (toks || []).map((t) => {
      if (t.type === "text") return t.text;
      if (t.type === "codespan") return t.text;
      if (t.type === "link" || t.type === "strong" || t.type === "em" || t.type === "del") {
        return inlineText(t.tokens);
      }
      if (t.type === "image" || t.type === "postforgeImage") return "[\u56FE\u7247]";
      return "";
    }).join("");
    const collectImages = (toks) => {
      for (const it2 of toks || []) {
        if (it2.type === "image" || it2.type === "postforgeImage") images.push(it2.href);
        else if (it2.tokens) collectImages(it2.tokens);
      }
    };
    function renderItems(items, ordered, start, out) {
      items.forEach((it2, i) => {
        const mark = ordered ? `${start + i}.` : "\u2022";
        const body = blockToText(it2.tokens).trim() || inlineText(it2.tokens);
        out.push(`${mark} ${body}`);
      });
    }
    function blockToText(blockTokens) {
      const out = [];
      for (const t of blockTokens || []) {
        switch (t.type) {
          case "paragraph":
            out.push(inlineText(t.tokens));
            break;
          case "heading":
            headings.push(inlineText(t.tokens));
            out.push(`\u3010${inlineText(t.tokens)}\u3011`);
            break;
          case "blockquote":
            out.push(`> ${blockToText(t.tokens)}`);
            break;
          case "postforgeCard":
            out.push(cardToText(t, blockToText));
            break;
          case "list":
            renderItems(t.items, t.ordered, t.start || 1, out);
            break;
          case "code":
            out.push("```" + (t.lang || "") + "\n" + t.text.replace(/\n$/, "") + "\n```");
            break;
          case "table": {
            const hd = t.header.map((c2) => inlineText(c2.tokens)).join(" | ");
            const rows = t.rows.map((r) => r.map((c2) => inlineText(c2.tokens)).join(" | ")).join("\n");
            out.push(hd, rows);
            break;
          }
          case "hr":
            out.push("---");
            break;
          case "html":
            out.push(t.text);
            break;
          case "text":
            out.push(t.text);
            break;
          default:
            break;
        }
        collectImages(t.tokens);
      }
      return out.filter((x2) => x2 !== "" && x2 !== void 0).join("\n");
    }
    const text = blockToText(tokens).replace(/\n{3,}/g, "\n\n").trim();
    const hashtags = headings.map((h) => `#${h.replace(/[#\s]+/g, "")}#`).filter((h) => h.length > 2);
    return { text, images, hashtags };
  }
  function build(markdown2, options = {}) {
    const platform = getPlatform(options.platform || "wechat");
    const theme = options.themeObj ? deepMerge(getTheme(options.theme || platform.defaultTheme), options.themeObj) : getTheme(options.theme || platform.defaultTheme);
    const lexerOptions = { gfm: true, breaks: false, extensions: toMarkedExtensions(theme) };
    const tokens = f.lexer(markdown2, lexerOptions);
    if (platform.mode === "text") {
      const { text, images, hashtags } = extractText(tokens);
      return { platform, theme: theme.id || "custom", text, images, hashtags, toc: [] };
    }
    const renderer = new PostRenderer(theme, platform, options);
    const parser = new b({ renderer, ...lexerOptions });
    const body = parser.parse(tokens);
    let content = body;
    if (options.toc && renderer.headings.length > 0) {
      content = renderToc(renderer.headings, theme) + content;
    }
    const containerStyle = { ...theme.container };
    if (options.maxWidth) containerStyle["max-width"] = `${options.maxWidth}px`;
    const section = `<section style="${toCss2(containerStyle)}">${content}</section>`;
    if (platform.fullDocument) {
      const html = wrapDocument(
        { body: section, title: options.title || "" },
        theme
      );
      return { platform, theme: theme.id || "custom", html, toc: renderer.headings };
    }
    return { platform, theme: theme.id || "custom", html: section, toc: renderer.headings };
  }
  return __toCommonJS(index_exports);
})();
