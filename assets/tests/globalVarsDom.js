const namedCharacterReferences = {
  "GT": ">",
  "gt": ">",
  "LT": "<",
  "lt": "<",
  "ac;": "∾",
  "af;": "⁡",
  "AMP": "&",
  "amp": "&",
  "ap;": "≈",
  "DD;": "ⅅ",
  "dd;": "ⅆ",
  "deg": "°",
  "ee;": "ⅇ",
  "eg;": "⪚",
  "el;": "⪙",
  "ETH": "Ð",
  "eth": "ð",
  "gE;": "≧",
  "ge;": "≥",
  "Gg;": "⋙",
  "gg;": "≫",
  "gl;": "≷",
  "GT;": ">",
  "Gt;": "≫",
  "gt;": ">",
  "ic;": "⁣",
  "ii;": "ⅈ",
  "Im;": "ℑ",
  "in;": "∈",
  "it;": "⁢",
  "lE;": "≦",
  "le;": "≤",
  "lg;": "≶",
  "Ll;": "⋘",
  "ll;": "≪",
  "LT;": "<",
  "Lt;": "≪",
  "lt;": "<",
  "mp;": "∓",
  "Mu;": "Μ",
  "mu;": "μ",
  "ne;": "≠",
  "ni;": "∋",
  "not": "¬",
  "Nu;": "Ν",
  "nu;": "ν",
  "Or;": "⩔",
  "or;": "∨",
  "oS;": "Ⓢ",
  "Pi;": "Π",
  "pi;": "π",
  "pm;": "±",
  "Pr;": "⪻",
  "pr;": "≺",
  "Re;": "ℜ",
  "REG": "®",
  "reg": "®",
  "rx;": "℞",
  "Sc;": "⪼",
  "sc;": "≻",
  "shy": "­",
  "uml": "¨",
  "wp;": "℘",
  "wr;": "≀",
  "Xi;": "Ξ",
  "xi;": "ξ",
  "yen": "¥",
  "acd;": "∿",
  "acE;": "∾̳",
  "Acy;": "А",
  "acy;": "а",
  "Afr;": "𝔄",
  "afr;": "𝔞",
  "AMP;": "&",
  "amp;": "&",
  "And;": "⩓",
  "and;": "∧",
  "ang;": "∠",
  "apE;": "⩰",
  "ape;": "≊",
  "ast;": "*",
  "Auml": "Ä",
  "auml": "ä",
  "Bcy;": "Б",
  "bcy;": "б",
  "Bfr;": "𝔅",
  "bfr;": "𝔟",
  "bne;": "=⃥",
  "bot;": "⊥",
  "Cap;": "⋒",
  "cap;": "∩",
  "cent": "¢",
  "Cfr;": "ℭ",
  "cfr;": "𝔠",
  "Chi;": "Χ",
  "chi;": "χ",
  "cir;": "○",
  "COPY": "©",
  "copy": "©",
  "Cup;": "⋓",
  "cup;": "∪",
  "Dcy;": "Д",
  "dcy;": "д",
  "deg;": "°",
  "Del;": "∇",
  "Dfr;": "𝔇",
  "dfr;": "𝔡",
  "die;": "¨",
  "div;": "÷",
  "Dot;": "¨",
  "dot;": "˙",
  "Ecy;": "Э",
  "ecy;": "э",
  "Efr;": "𝔈",
  "efr;": "𝔢",
  "egs;": "⪖",
  "ell;": "ℓ",
  "els;": "⪕",
  "ENG;": "Ŋ",
  "eng;": "ŋ",
  "Eta;": "Η",
  "eta;": "η",
  "ETH;": "Ð",
  "eth;": "ð",
  "Euml": "Ë",
  "euml": "ë",
  "Fcy;": "Ф",
  "fcy;": "ф",
  "Ffr;": "𝔉",
  "ffr;": "𝔣",
  "gap;": "⪆",
  "Gcy;": "Г",
  "gcy;": "г",
  "gEl;": "⪌",
  "gel;": "⋛",
  "geq;": "≥",
  "ges;": "⩾",
  "Gfr;": "𝔊",
  "gfr;": "𝔤",
  "ggg;": "⋙",
  "gla;": "⪥",
  "glE;": "⪒",
  "glj;": "⪤",
  "gnE;": "≩",
  "gne;": "⪈",
  "Hat;": "^",
  "Hfr;": "ℌ",
  "hfr;": "𝔥",
  "Icy;": "И",
  "icy;": "и",
  "iff;": "⇔",
  "Ifr;": "ℑ",
  "ifr;": "𝔦",
  "Int;": "∬",
  "int;": "∫",
  "Iuml": "Ï",
  "iuml": "ï",
  "Jcy;": "Й",
  "jcy;": "й",
  "Jfr;": "𝔍",
  "jfr;": "𝔧",
  "Kcy;": "К",
  "kcy;": "к",
  "Kfr;": "𝔎",
  "kfr;": "𝔨",
  "lap;": "⪅",
  "lat;": "⪫",
  "Lcy;": "Л",
  "lcy;": "л",
  "lEg;": "⪋",
  "leg;": "⋚",
  "leq;": "≤",
  "les;": "⩽",
  "Lfr;": "𝔏",
  "lfr;": "𝔩",
  "lgE;": "⪑",
  "lnE;": "≨",
  "lne;": "⪇",
  "loz;": "◊",
  "lrm;": "‎",
  "Lsh;": "↰",
  "lsh;": "↰",
  "macr": "¯",
  "Map;": "⤅",
  "map;": "↦",
  "Mcy;": "М",
  "mcy;": "м",
  "Mfr;": "𝔐",
  "mfr;": "𝔪",
  "mho;": "℧",
  "mid;": "∣",
  "nap;": "≉",
  "nbsp": " ",
  "Ncy;": "Н",
  "ncy;": "н",
  "Nfr;": "𝔑",
  "nfr;": "𝔫",
  "ngE;": "≧̸",
  "nge;": "≱",
  "nGg;": "⋙̸",
  "nGt;": "≫⃒",
  "ngt;": "≯",
  "nis;": "⋼",
  "niv;": "∋",
  "nlE;": "≦̸",
  "nle;": "≰",
  "nLl;": "⋘̸",
  "nLt;": "≪⃒",
  "nlt;": "≮",
  "Not;": "⫬",
  "not;": "¬",
  "npr;": "⊀",
  "nsc;": "⊁",
  "num;": "#",
  "Ocy;": "О",
  "ocy;": "о",
  "Ofr;": "𝔒",
  "ofr;": "𝔬",
  "ogt;": "⧁",
  "ohm;": "Ω",
  "olt;": "⧀",
  "ord;": "⩝",
  "ordf": "ª",
  "ordm": "º",
  "orv;": "⩛",
  "Ouml": "Ö",
  "ouml": "ö",
  "par;": "∥",
  "para": "¶",
  "Pcy;": "П",
  "pcy;": "п",
  "Pfr;": "𝔓",
  "pfr;": "𝔭",
  "Phi;": "Φ",
  "phi;": "φ",
  "piv;": "ϖ",
  "prE;": "⪳",
  "pre;": "⪯",
  "Psi;": "Ψ",
  "psi;": "ψ",
  "Qfr;": "𝔔",
  "qfr;": "𝔮",
  "QUOT": "\"",
  "quot": "\"",
  "Rcy;": "Р",
  "rcy;": "р",
  "REG;": "®",
  "reg;": "®",
  "Rfr;": "ℜ",
  "rfr;": "𝔯",
  "Rho;": "Ρ",
  "rho;": "ρ",
  "rlm;": "‏",
  "Rsh;": "↱",
  "rsh;": "↱",
  "scE;": "⪴",
  "sce;": "⪰",
  "Scy;": "С",
  "scy;": "с",
  "sect": "§",
  "Sfr;": "𝔖",
  "sfr;": "𝔰",
  "shy;": "­",
  "sim;": "∼",
  "smt;": "⪪",
  "sol;": "/",
  "squ;": "□",
  "Sub;": "⋐",
  "sub;": "⊂",
  "Sum;": "∑",
  "sum;": "∑",
  "Sup;": "⋑",
  "sup;": "⊃",
  "sup1": "¹",
  "sup2": "²",
  "sup3": "³",
  "Tab;": "\t",
  "Tau;": "Τ",
  "tau;": "τ",
  "Tcy;": "Т",
  "tcy;": "т",
  "Tfr;": "𝔗",
  "tfr;": "𝔱",
  "top;": "⊤",
  "Ucy;": "У",
  "ucy;": "у",
  "Ufr;": "𝔘",
  "ufr;": "𝔲",
  "uml;": "¨",
  "Uuml": "Ü",
  "uuml": "ü",
  "Vcy;": "В",
  "vcy;": "в",
  "Vee;": "⋁",
  "vee;": "∨",
  "Vfr;": "𝔙",
  "vfr;": "𝔳",
  "Wfr;": "𝔚",
  "wfr;": "𝔴",
  "Xfr;": "𝔛",
  "xfr;": "𝔵",
  "Ycy;": "Ы",
  "ycy;": "ы",
  "yen;": "¥",
  "Yfr;": "𝔜",
  "yfr;": "𝔶",
  "yuml": "ÿ",
  "Zcy;": "З",
  "zcy;": "з",
  "Zfr;": "ℨ",
  "zfr;": "𝔷",
  "zwj;": "‍",
  "Acirc": "Â",
  "acirc": "â",
  "acute": "´",
  "AElig": "Æ",
  "aelig": "æ",
  "andd;": "⩜",
  "andv;": "⩚",
  "ange;": "⦤",
  "Aopf;": "𝔸",
  "aopf;": "𝕒",
  "apid;": "≋",
  "apos;": "'",
  "Aring": "Å",
  "aring": "å",
  "Ascr;": "𝒜",
  "ascr;": "𝒶",
  "Auml;": "Ä",
  "auml;": "ä",
  "Barv;": "⫧",
  "bbrk;": "⎵",
  "Beta;": "Β",
  "beta;": "β",
  "beth;": "ℶ",
  "bNot;": "⫭",
  "bnot;": "⌐",
  "Bopf;": "𝔹",
  "bopf;": "𝕓",
  "boxH;": "═",
  "boxh;": "─",
  "boxV;": "║",
  "boxv;": "│",
  "Bscr;": "ℬ",
  "bscr;": "𝒷",
  "bsim;": "∽",
  "bsol;": "\\",
  "bull;": "•",
  "bump;": "≎",
  "caps;": "∩︀",
  "Cdot;": "Ċ",
  "cdot;": "ċ",
  "cedil": "¸",
  "cent;": "¢",
  "CHcy;": "Ч",
  "chcy;": "ч",
  "circ;": "ˆ",
  "cirE;": "⧃",
  "cire;": "≗",
  "comp;": "∁",
  "cong;": "≅",
  "Copf;": "ℂ",
  "copf;": "𝕔",
  "COPY;": "©",
  "copy;": "©",
  "Cscr;": "𝒞",
  "cscr;": "𝒸",
  "csub;": "⫏",
  "csup;": "⫐",
  "cups;": "∪︀",
  "Darr;": "↡",
  "dArr;": "⇓",
  "darr;": "↓",
  "dash;": "‐",
  "dHar;": "⥥",
  "diam;": "⋄",
  "DJcy;": "Ђ",
  "djcy;": "ђ",
  "Dopf;": "𝔻",
  "dopf;": "𝕕",
  "Dscr;": "𝒟",
  "dscr;": "𝒹",
  "DScy;": "Ѕ",
  "dscy;": "ѕ",
  "dsol;": "⧶",
  "dtri;": "▿",
  "DZcy;": "Џ",
  "dzcy;": "џ",
  "ecir;": "≖",
  "Ecirc": "Ê",
  "ecirc": "ê",
  "Edot;": "Ė",
  "eDot;": "≑",
  "edot;": "ė",
  "emsp;": " ",
  "ensp;": " ",
  "Eopf;": "𝔼",
  "eopf;": "𝕖",
  "epar;": "⋕",
  "epsi;": "ε",
  "Escr;": "ℰ",
  "escr;": "ℯ",
  "Esim;": "⩳",
  "esim;": "≂",
  "Euml;": "Ë",
  "euml;": "ë",
  "euro;": "€",
  "excl;": "!",
  "flat;": "♭",
  "fnof;": "ƒ",
  "Fopf;": "𝔽",
  "fopf;": "𝕗",
  "fork;": "⋔",
  "Fscr;": "ℱ",
  "fscr;": "𝒻",
  "Gdot;": "Ġ",
  "gdot;": "ġ",
  "geqq;": "≧",
  "gesl;": "⋛︀",
  "GJcy;": "Ѓ",
  "gjcy;": "ѓ",
  "gnap;": "⪊",
  "gneq;": "⪈",
  "Gopf;": "𝔾",
  "gopf;": "𝕘",
  "Gscr;": "𝒢",
  "gscr;": "ℊ",
  "gsim;": "≳",
  "gtcc;": "⪧",
  "gvnE;": "≩︀",
  "half;": "½",
  "hArr;": "⇔",
  "harr;": "↔",
  "hbar;": "ℏ",
  "Hopf;": "ℍ",
  "hopf;": "𝕙",
  "Hscr;": "ℋ",
  "hscr;": "𝒽",
  "Icirc": "Î",
  "icirc": "î",
  "Idot;": "İ",
  "IEcy;": "Е",
  "iecy;": "е",
  "iexcl": "¡",
  "imof;": "⊷",
  "IOcy;": "Ё",
  "iocy;": "ё",
  "Iopf;": "𝕀",
  "iopf;": "𝕚",
  "Iota;": "Ι",
  "iota;": "ι",
  "Iscr;": "ℐ",
  "iscr;": "𝒾",
  "isin;": "∈",
  "Iuml;": "Ï",
  "iuml;": "ï",
  "Jopf;": "𝕁",
  "jopf;": "𝕛",
  "Jscr;": "𝒥",
  "jscr;": "𝒿",
  "KHcy;": "Х",
  "khcy;": "х",
  "KJcy;": "Ќ",
  "kjcy;": "ќ",
  "Kopf;": "𝕂",
  "kopf;": "𝕜",
  "Kscr;": "𝒦",
  "kscr;": "𝓀",
  "Lang;": "⟪",
  "lang;": "⟨",
  "laquo": "«",
  "Larr;": "↞",
  "lArr;": "⇐",
  "larr;": "←",
  "late;": "⪭",
  "lcub;": "{",
  "ldca;": "⤶",
  "ldsh;": "↲",
  "leqq;": "≦",
  "lesg;": "⋚︀",
  "lHar;": "⥢",
  "LJcy;": "Љ",
  "ljcy;": "љ",
  "lnap;": "⪉",
  "lneq;": "⪇",
  "Lopf;": "𝕃",
  "lopf;": "𝕝",
  "lozf;": "⧫",
  "lpar;": "(",
  "Lscr;": "ℒ",
  "lscr;": "𝓁",
  "lsim;": "≲",
  "lsqb;": "[",
  "ltcc;": "⪦",
  "ltri;": "◃",
  "lvnE;": "≨︀",
  "macr;": "¯",
  "male;": "♂",
  "malt;": "✠",
  "micro": "µ",
  "mlcp;": "⫛",
  "mldr;": "…",
  "Mopf;": "𝕄",
  "mopf;": "𝕞",
  "Mscr;": "ℳ",
  "mscr;": "𝓂",
  "nang;": "∠⃒",
  "napE;": "⩰̸",
  "nbsp;": " ",
  "ncap;": "⩃",
  "ncup;": "⩂",
  "ngeq;": "≱",
  "nges;": "⩾̸",
  "ngtr;": "≯",
  "nGtv;": "≫̸",
  "nisd;": "⋺",
  "NJcy;": "Њ",
  "njcy;": "њ",
  "nldr;": "‥",
  "nleq;": "≰",
  "nles;": "⩽̸",
  "nLtv;": "≪̸",
  "nmid;": "∤",
  "Nopf;": "ℕ",
  "nopf;": "𝕟",
  "npar;": "∦",
  "npre;": "⪯̸",
  "nsce;": "⪰̸",
  "Nscr;": "𝒩",
  "nscr;": "𝓃",
  "nsim;": "≁",
  "nsub;": "⊄",
  "nsup;": "⊅",
  "ntgl;": "≹",
  "ntlg;": "≸",
  "nvap;": "≍⃒",
  "nvge;": "≥⃒",
  "nvgt;": ">⃒",
  "nvle;": "≤⃒",
  "nvlt;": "<⃒",
  "oast;": "⊛",
  "ocir;": "⊚",
  "Ocirc": "Ô",
  "ocirc": "ô",
  "odiv;": "⨸",
  "odot;": "⊙",
  "ogon;": "˛",
  "oint;": "∮",
  "omid;": "⦶",
  "Oopf;": "𝕆",
  "oopf;": "𝕠",
  "opar;": "⦷",
  "ordf;": "ª",
  "ordm;": "º",
  "oror;": "⩖",
  "Oscr;": "𝒪",
  "oscr;": "ℴ",
  "osol;": "⊘",
  "Ouml;": "Ö",
  "ouml;": "ö",
  "para;": "¶",
  "part;": "∂",
  "perp;": "⊥",
  "phiv;": "ϕ",
  "plus;": "+",
  "Popf;": "ℙ",
  "popf;": "𝕡",
  "pound": "£",
  "prap;": "⪷",
  "prec;": "≺",
  "prnE;": "⪵",
  "prod;": "∏",
  "prop;": "∝",
  "Pscr;": "𝒫",
  "pscr;": "𝓅",
  "qint;": "⨌",
  "Qopf;": "ℚ",
  "qopf;": "𝕢",
  "Qscr;": "𝒬",
  "qscr;": "𝓆",
  "QUOT;": "\"",
  "quot;": "\"",
  "race;": "∽̱",
  "Rang;": "⟫",
  "rang;": "⟩",
  "raquo": "»",
  "Rarr;": "↠",
  "rArr;": "⇒",
  "rarr;": "→",
  "rcub;": "}",
  "rdca;": "⤷",
  "rdsh;": "↳",
  "real;": "ℜ",
  "rect;": "▭",
  "rHar;": "⥤",
  "rhov;": "ϱ",
  "ring;": "˚",
  "Ropf;": "ℝ",
  "ropf;": "𝕣",
  "rpar;": ")",
  "Rscr;": "ℛ",
  "rscr;": "𝓇",
  "rsqb;": "]",
  "rtri;": "▹",
  "scap;": "⪸",
  "scnE;": "⪶",
  "sdot;": "⋅",
  "sect;": "§",
  "semi;": ";",
  "sext;": "✶",
  "SHcy;": "Ш",
  "shcy;": "ш",
  "sime;": "≃",
  "simg;": "⪞",
  "siml;": "⪝",
  "smid;": "∣",
  "smte;": "⪬",
  "solb;": "⧄",
  "Sopf;": "𝕊",
  "sopf;": "𝕤",
  "spar;": "∥",
  "Sqrt;": "√",
  "squf;": "▪",
  "Sscr;": "𝒮",
  "sscr;": "𝓈",
  "Star;": "⋆",
  "star;": "☆",
  "subE;": "⫅",
  "sube;": "⊆",
  "succ;": "≻",
  "sung;": "♪",
  "sup1;": "¹",
  "sup2;": "²",
  "sup3;": "³",
  "supE;": "⫆",
  "supe;": "⊇",
  "szlig": "ß",
  "tbrk;": "⎴",
  "tdot;": "⃛",
  "THORN": "Þ",
  "thorn": "þ",
  "times": "×",
  "tint;": "∭",
  "toea;": "⤨",
  "Topf;": "𝕋",
  "topf;": "𝕥",
  "tosa;": "⤩",
  "trie;": "≜",
  "Tscr;": "𝒯",
  "tscr;": "𝓉",
  "TScy;": "Ц",
  "tscy;": "ц",
  "Uarr;": "↟",
  "uArr;": "⇑",
  "uarr;": "↑",
  "Ucirc": "Û",
  "ucirc": "û",
  "uHar;": "⥣",
  "Uopf;": "𝕌",
  "uopf;": "𝕦",
  "Upsi;": "ϒ",
  "upsi;": "υ",
  "Uscr;": "𝒰",
  "uscr;": "𝓊",
  "utri;": "▵",
  "Uuml;": "Ü",
  "uuml;": "ü",
  "vArr;": "⇕",
  "varr;": "↕",
  "Vbar;": "⫫",
  "vBar;": "⫨",
  "Vert;": "‖",
  "vert;": "|",
  "Vopf;": "𝕍",
  "vopf;": "𝕧",
  "Vscr;": "𝒱",
  "vscr;": "𝓋",
  "Wopf;": "𝕎",
  "wopf;": "𝕨",
  "Wscr;": "𝒲",
  "wscr;": "𝓌",
  "xcap;": "⋂",
  "xcup;": "⋃",
  "xmap;": "⟼",
  "xnis;": "⋻",
  "Xopf;": "𝕏",
  "xopf;": "𝕩",
  "Xscr;": "𝒳",
  "xscr;": "𝓍",
  "xvee;": "⋁",
  "YAcy;": "Я",
  "yacy;": "я",
  "YIcy;": "Ї",
  "yicy;": "ї",
  "Yopf;": "𝕐",
  "yopf;": "𝕪",
  "Yscr;": "𝒴",
  "yscr;": "𝓎",
  "YUcy;": "Ю",
  "yucy;": "ю",
  "Yuml;": "Ÿ",
  "yuml;": "ÿ",
  "Zdot;": "Ż",
  "zdot;": "ż",
  "Zeta;": "Ζ",
  "zeta;": "ζ",
  "ZHcy;": "Ж",
  "zhcy;": "ж",
  "Zopf;": "ℤ",
  "zopf;": "𝕫",
  "Zscr;": "𝒵",
  "zscr;": "𝓏",
  "zwnj;": "‌",
  "Aacute": "Á",
  "aacute": "á",
  "Acirc;": "Â",
  "acirc;": "â",
  "acute;": "´",
  "AElig;": "Æ",
  "aelig;": "æ",
  "Agrave": "À",
  "agrave": "à",
  "aleph;": "ℵ",
  "Alpha;": "Α",
  "alpha;": "α",
  "Amacr;": "Ā",
  "amacr;": "ā",
  "amalg;": "⨿",
  "angle;": "∠",
  "angrt;": "∟",
  "angst;": "Å",
  "Aogon;": "Ą",
  "aogon;": "ą",
  "Aring;": "Å",
  "aring;": "å",
  "asymp;": "≈",
  "Atilde": "Ã",
  "atilde": "ã",
  "awint;": "⨑",
  "bcong;": "≌",
  "bdquo;": "„",
  "bepsi;": "϶",
  "blank;": "␣",
  "blk12;": "▒",
  "blk14;": "░",
  "blk34;": "▓",
  "block;": "█",
  "boxDL;": "╗",
  "boxDl;": "╖",
  "boxdL;": "╕",
  "boxdl;": "┐",
  "boxDR;": "╔",
  "boxDr;": "╓",
  "boxdR;": "╒",
  "boxdr;": "┌",
  "boxHD;": "╦",
  "boxHd;": "╤",
  "boxhD;": "╥",
  "boxhd;": "┬",
  "boxHU;": "╩",
  "boxHu;": "╧",
  "boxhU;": "╨",
  "boxhu;": "┴",
  "boxUL;": "╝",
  "boxUl;": "╜",
  "boxuL;": "╛",
  "boxul;": "┘",
  "boxUR;": "╚",
  "boxUr;": "╙",
  "boxuR;": "╘",
  "boxur;": "└",
  "boxVH;": "╬",
  "boxVh;": "╫",
  "boxvH;": "╪",
  "boxvh;": "┼",
  "boxVL;": "╣",
  "boxVl;": "╢",
  "boxvL;": "╡",
  "boxvl;": "┤",
  "boxVR;": "╠",
  "boxVr;": "╟",
  "boxvR;": "╞",
  "boxvr;": "├",
  "Breve;": "˘",
  "breve;": "˘",
  "brvbar": "¦",
  "bsemi;": "⁏",
  "bsime;": "⋍",
  "bsolb;": "⧅",
  "bumpE;": "⪮",
  "bumpe;": "≏",
  "caret;": "⁁",
  "caron;": "ˇ",
  "ccaps;": "⩍",
  "Ccedil": "Ç",
  "ccedil": "ç",
  "Ccirc;": "Ĉ",
  "ccirc;": "ĉ",
  "ccups;": "⩌",
  "cedil;": "¸",
  "check;": "✓",
  "clubs;": "♣",
  "Colon;": "∷",
  "colon;": ":",
  "comma;": ",",
  "crarr;": "↵",
  "Cross;": "⨯",
  "cross;": "✗",
  "csube;": "⫑",
  "csupe;": "⫒",
  "ctdot;": "⋯",
  "cuepr;": "⋞",
  "cuesc;": "⋟",
  "cupor;": "⩅",
  "curren": "¤",
  "cuvee;": "⋎",
  "cuwed;": "⋏",
  "cwint;": "∱",
  "Dashv;": "⫤",
  "dashv;": "⊣",
  "dblac;": "˝",
  "ddarr;": "⇊",
  "Delta;": "Δ",
  "delta;": "δ",
  "dharl;": "⇃",
  "dharr;": "⇂",
  "diams;": "♦",
  "disin;": "⋲",
  "divide": "÷",
  "doteq;": "≐",
  "dtdot;": "⋱",
  "dtrif;": "▾",
  "duarr;": "⇵",
  "duhar;": "⥯",
  "Eacute": "É",
  "eacute": "é",
  "Ecirc;": "Ê",
  "ecirc;": "ê",
  "eDDot;": "⩷",
  "efDot;": "≒",
  "Egrave": "È",
  "egrave": "è",
  "Emacr;": "Ē",
  "emacr;": "ē",
  "empty;": "∅",
  "Eogon;": "Ę",
  "eogon;": "ę",
  "eplus;": "⩱",
  "epsiv;": "ϵ",
  "eqsim;": "≂",
  "Equal;": "⩵",
  "equiv;": "≡",
  "erarr;": "⥱",
  "erDot;": "≓",
  "esdot;": "≐",
  "exist;": "∃",
  "fflig;": "ﬀ",
  "filig;": "ﬁ",
  "fjlig;": "fj",
  "fllig;": "ﬂ",
  "fltns;": "▱",
  "forkv;": "⫙",
  "frac12": "½",
  "frac14": "¼",
  "frac34": "¾",
  "frasl;": "⁄",
  "frown;": "⌢",
  "Gamma;": "Γ",
  "gamma;": "γ",
  "Gcirc;": "Ĝ",
  "gcirc;": "ĝ",
  "gescc;": "⪩",
  "gimel;": "ℷ",
  "gneqq;": "≩",
  "gnsim;": "⋧",
  "grave;": "`",
  "gsime;": "⪎",
  "gsiml;": "⪐",
  "gtcir;": "⩺",
  "gtdot;": "⋗",
  "Hacek;": "ˇ",
  "harrw;": "↭",
  "Hcirc;": "Ĥ",
  "hcirc;": "ĥ",
  "hoarr;": "⇿",
  "Iacute": "Í",
  "iacute": "í",
  "Icirc;": "Î",
  "icirc;": "î",
  "iexcl;": "¡",
  "Igrave": "Ì",
  "igrave": "ì",
  "iiint;": "∭",
  "iiota;": "℩",
  "IJlig;": "Ĳ",
  "ijlig;": "ĳ",
  "Imacr;": "Ī",
  "imacr;": "ī",
  "image;": "ℑ",
  "imath;": "ı",
  "imped;": "Ƶ",
  "infin;": "∞",
  "Iogon;": "Į",
  "iogon;": "į",
  "iprod;": "⨼",
  "iquest": "¿",
  "isinE;": "⋹",
  "isins;": "⋴",
  "isinv;": "∈",
  "Iukcy;": "І",
  "iukcy;": "і",
  "Jcirc;": "Ĵ",
  "jcirc;": "ĵ",
  "jmath;": "ȷ",
  "Jukcy;": "Є",
  "jukcy;": "є",
  "Kappa;": "Κ",
  "kappa;": "κ",
  "lAarr;": "⇚",
  "langd;": "⦑",
  "laquo;": "«",
  "larrb;": "⇤",
  "lates;": "⪭︀",
  "lBarr;": "⤎",
  "lbarr;": "⤌",
  "lbbrk;": "❲",
  "lbrke;": "⦋",
  "lceil;": "⌈",
  "ldquo;": "“",
  "lescc;": "⪨",
  "lhard;": "↽",
  "lharu;": "↼",
  "lhblk;": "▄",
  "llarr;": "⇇",
  "lltri;": "◺",
  "lneqq;": "≨",
  "lnsim;": "⋦",
  "loang;": "⟬",
  "loarr;": "⇽",
  "lobrk;": "⟦",
  "lopar;": "⦅",
  "lrarr;": "⇆",
  "lrhar;": "⇋",
  "lrtri;": "⊿",
  "lsime;": "⪍",
  "lsimg;": "⪏",
  "lsquo;": "‘",
  "ltcir;": "⩹",
  "ltdot;": "⋖",
  "ltrie;": "⊴",
  "ltrif;": "◂",
  "mdash;": "—",
  "mDDot;": "∺",
  "micro;": "µ",
  "middot": "·",
  "minus;": "−",
  "mumap;": "⊸",
  "nabla;": "∇",
  "napid;": "≋̸",
  "napos;": "ŉ",
  "natur;": "♮",
  "nbump;": "≎̸",
  "ncong;": "≇",
  "ndash;": "–",
  "neArr;": "⇗",
  "nearr;": "↗",
  "nedot;": "≐̸",
  "nesim;": "≂̸",
  "ngeqq;": "≧̸",
  "ngsim;": "≵",
  "nhArr;": "⇎",
  "nharr;": "↮",
  "nhpar;": "⫲",
  "nlArr;": "⇍",
  "nlarr;": "↚",
  "nleqq;": "≦̸",
  "nless;": "≮",
  "nlsim;": "≴",
  "nltri;": "⋪",
  "notin;": "∉",
  "notni;": "∌",
  "npart;": "∂̸",
  "nprec;": "⊀",
  "nrArr;": "⇏",
  "nrarr;": "↛",
  "nrtri;": "⋫",
  "nsime;": "≄",
  "nsmid;": "∤",
  "nspar;": "∦",
  "nsubE;": "⫅̸",
  "nsube;": "⊈",
  "nsucc;": "⊁",
  "nsupE;": "⫆̸",
  "nsupe;": "⊉",
  "Ntilde": "Ñ",
  "ntilde": "ñ",
  "numsp;": " ",
  "nvsim;": "∼⃒",
  "nwArr;": "⇖",
  "nwarr;": "↖",
  "Oacute": "Ó",
  "oacute": "ó",
  "Ocirc;": "Ô",
  "ocirc;": "ô",
  "odash;": "⊝",
  "OElig;": "Œ",
  "oelig;": "œ",
  "ofcir;": "⦿",
  "Ograve": "Ò",
  "ograve": "ò",
  "ohbar;": "⦵",
  "olarr;": "↺",
  "olcir;": "⦾",
  "oline;": "‾",
  "Omacr;": "Ō",
  "omacr;": "ō",
  "Omega;": "Ω",
  "omega;": "ω",
  "operp;": "⦹",
  "oplus;": "⊕",
  "orarr;": "↻",
  "order;": "ℴ",
  "Oslash": "Ø",
  "oslash": "ø",
  "Otilde": "Õ",
  "otilde": "õ",
  "ovbar;": "⌽",
  "parsl;": "⫽",
  "phone;": "☎",
  "plusb;": "⊞",
  "pluse;": "⩲",
  "plusmn": "±",
  "pound;": "£",
  "prcue;": "≼",
  "Prime;": "″",
  "prime;": "′",
  "prnap;": "⪹",
  "prsim;": "≾",
  "quest;": "?",
  "rAarr;": "⇛",
  "radic;": "√",
  "rangd;": "⦒",
  "range;": "⦥",
  "raquo;": "»",
  "rarrb;": "⇥",
  "rarrc;": "⤳",
  "rarrw;": "↝",
  "ratio;": "∶",
  "RBarr;": "⤐",
  "rBarr;": "⤏",
  "rbarr;": "⤍",
  "rbbrk;": "❳",
  "rbrke;": "⦌",
  "rceil;": "⌉",
  "rdquo;": "”",
  "reals;": "ℝ",
  "rhard;": "⇁",
  "rharu;": "⇀",
  "rlarr;": "⇄",
  "rlhar;": "⇌",
  "rnmid;": "⫮",
  "roang;": "⟭",
  "roarr;": "⇾",
  "robrk;": "⟧",
  "ropar;": "⦆",
  "rrarr;": "⇉",
  "rsquo;": "’",
  "rtrie;": "⊵",
  "rtrif;": "▸",
  "sbquo;": "‚",
  "sccue;": "≽",
  "Scirc;": "Ŝ",
  "scirc;": "ŝ",
  "scnap;": "⪺",
  "scsim;": "≿",
  "sdotb;": "⊡",
  "sdote;": "⩦",
  "seArr;": "⇘",
  "searr;": "↘",
  "setmn;": "∖",
  "sharp;": "♯",
  "Sigma;": "Σ",
  "sigma;": "σ",
  "simeq;": "≃",
  "simgE;": "⪠",
  "simlE;": "⪟",
  "simne;": "≆",
  "slarr;": "←",
  "smile;": "⌣",
  "smtes;": "⪬︀",
  "sqcap;": "⊓",
  "sqcup;": "⊔",
  "sqsub;": "⊏",
  "sqsup;": "⊐",
  "srarr;": "→",
  "starf;": "★",
  "strns;": "¯",
  "subnE;": "⫋",
  "subne;": "⊊",
  "supnE;": "⫌",
  "supne;": "⊋",
  "swArr;": "⇙",
  "swarr;": "↙",
  "szlig;": "ß",
  "Theta;": "Θ",
  "theta;": "θ",
  "thkap;": "≈",
  "THORN;": "Þ",
  "thorn;": "þ",
  "Tilde;": "∼",
  "tilde;": "˜",
  "times;": "×",
  "TRADE;": "™",
  "trade;": "™",
  "trisb;": "⧍",
  "TSHcy;": "Ћ",
  "tshcy;": "ћ",
  "twixt;": "≬",
  "Uacute": "Ú",
  "uacute": "ú",
  "Ubrcy;": "Ў",
  "ubrcy;": "ў",
  "Ucirc;": "Û",
  "ucirc;": "û",
  "udarr;": "⇅",
  "udhar;": "⥮",
  "Ugrave": "Ù",
  "ugrave": "ù",
  "uharl;": "↿",
  "uharr;": "↾",
  "uhblk;": "▀",
  "ultri;": "◸",
  "Umacr;": "Ū",
  "umacr;": "ū",
  "Union;": "⋃",
  "Uogon;": "Ų",
  "uogon;": "ų",
  "uplus;": "⊎",
  "upsih;": "ϒ",
  "UpTee;": "⊥",
  "Uring;": "Ů",
  "uring;": "ů",
  "urtri;": "◹",
  "utdot;": "⋰",
  "utrif;": "▴",
  "uuarr;": "⇈",
  "varpi;": "ϖ",
  "vBarv;": "⫩",
  "VDash;": "⊫",
  "Vdash;": "⊩",
  "vDash;": "⊨",
  "vdash;": "⊢",
  "veeeq;": "≚",
  "vltri;": "⊲",
  "vnsub;": "⊂⃒",
  "vnsup;": "⊃⃒",
  "vprop;": "∝",
  "vrtri;": "⊳",
  "Wcirc;": "Ŵ",
  "wcirc;": "ŵ",
  "Wedge;": "⋀",
  "wedge;": "∧",
  "xcirc;": "◯",
  "xdtri;": "▽",
  "xhArr;": "⟺",
  "xharr;": "⟷",
  "xlArr;": "⟸",
  "xlarr;": "⟵",
  "xodot;": "⨀",
  "xrArr;": "⟹",
  "xrarr;": "⟶",
  "xutri;": "△",
  "Yacute": "Ý",
  "yacute": "ý",
  "Ycirc;": "Ŷ",
  "ycirc;": "ŷ",
  "Aacute;": "Á",
  "aacute;": "á",
  "Abreve;": "Ă",
  "abreve;": "ă",
  "Agrave;": "À",
  "agrave;": "à",
  "andand;": "⩕",
  "angmsd;": "∡",
  "angsph;": "∢",
  "apacir;": "⩯",
  "approx;": "≈",
  "Assign;": "≔",
  "Atilde;": "Ã",
  "atilde;": "ã",
  "barvee;": "⊽",
  "Barwed;": "⌆",
  "barwed;": "⌅",
  "becaus;": "∵",
  "bernou;": "ℬ",
  "bigcap;": "⋂",
  "bigcup;": "⋃",
  "bigvee;": "⋁",
  "bkarow;": "⤍",
  "bottom;": "⊥",
  "bowtie;": "⋈",
  "boxbox;": "⧉",
  "bprime;": "‵",
  "brvbar;": "¦",
  "bullet;": "•",
  "Bumpeq;": "≎",
  "bumpeq;": "≏",
  "Cacute;": "Ć",
  "cacute;": "ć",
  "capand;": "⩄",
  "capcap;": "⩋",
  "capcup;": "⩇",
  "capdot;": "⩀",
  "Ccaron;": "Č",
  "ccaron;": "č",
  "Ccedil;": "Ç",
  "ccedil;": "ç",
  "circeq;": "≗",
  "cirmid;": "⫯",
  "Colone;": "⩴",
  "colone;": "≔",
  "commat;": "@",
  "compfn;": "∘",
  "Conint;": "∯",
  "conint;": "∮",
  "coprod;": "∐",
  "copysr;": "℗",
  "cularr;": "↶",
  "CupCap;": "≍",
  "cupcap;": "⩆",
  "cupcup;": "⩊",
  "cupdot;": "⊍",
  "curarr;": "↷",
  "curren;": "¤",
  "cylcty;": "⌭",
  "Dagger;": "‡",
  "dagger;": "†",
  "daleth;": "ℸ",
  "Dcaron;": "Ď",
  "dcaron;": "ď",
  "dfisht;": "⥿",
  "divide;": "÷",
  "divonx;": "⋇",
  "dlcorn;": "⌞",
  "dlcrop;": "⌍",
  "dollar;": "$",
  "DotDot;": "⃜",
  "drcorn;": "⌟",
  "drcrop;": "⌌",
  "Dstrok;": "Đ",
  "dstrok;": "đ",
  "Eacute;": "É",
  "eacute;": "é",
  "easter;": "⩮",
  "Ecaron;": "Ě",
  "ecaron;": "ě",
  "ecolon;": "≕",
  "Egrave;": "È",
  "egrave;": "è",
  "egsdot;": "⪘",
  "elsdot;": "⪗",
  "emptyv;": "∅",
  "emsp13;": " ",
  "emsp14;": " ",
  "eparsl;": "⧣",
  "eqcirc;": "≖",
  "equals;": "=",
  "equest;": "≟",
  "Exists;": "∃",
  "female;": "♀",
  "ffilig;": "ﬃ",
  "ffllig;": "ﬄ",
  "ForAll;": "∀",
  "forall;": "∀",
  "frac12;": "½",
  "frac13;": "⅓",
  "frac14;": "¼",
  "frac15;": "⅕",
  "frac16;": "⅙",
  "frac18;": "⅛",
  "frac23;": "⅔",
  "frac25;": "⅖",
  "frac34;": "¾",
  "frac35;": "⅗",
  "frac38;": "⅜",
  "frac45;": "⅘",
  "frac56;": "⅚",
  "frac58;": "⅝",
  "frac78;": "⅞",
  "gacute;": "ǵ",
  "Gammad;": "Ϝ",
  "gammad;": "ϝ",
  "Gbreve;": "Ğ",
  "gbreve;": "ğ",
  "Gcedil;": "Ģ",
  "gesdot;": "⪀",
  "gesles;": "⪔",
  "gtlPar;": "⦕",
  "gtrarr;": "⥸",
  "gtrdot;": "⋗",
  "gtrsim;": "≳",
  "hairsp;": " ",
  "hamilt;": "ℋ",
  "HARDcy;": "Ъ",
  "hardcy;": "ъ",
  "hearts;": "♥",
  "hellip;": "…",
  "hercon;": "⊹",
  "homtht;": "∻",
  "horbar;": "―",
  "hslash;": "ℏ",
  "Hstrok;": "Ħ",
  "hstrok;": "ħ",
  "hybull;": "⁃",
  "hyphen;": "‐",
  "Iacute;": "Í",
  "iacute;": "í",
  "Igrave;": "Ì",
  "igrave;": "ì",
  "iiiint;": "⨌",
  "iinfin;": "⧜",
  "incare;": "℅",
  "inodot;": "ı",
  "intcal;": "⊺",
  "iquest;": "¿",
  "isinsv;": "⋳",
  "Itilde;": "Ĩ",
  "itilde;": "ĩ",
  "Jsercy;": "Ј",
  "jsercy;": "ј",
  "kappav;": "ϰ",
  "Kcedil;": "Ķ",
  "kcedil;": "ķ",
  "kgreen;": "ĸ",
  "Lacute;": "Ĺ",
  "lacute;": "ĺ",
  "lagran;": "ℒ",
  "Lambda;": "Λ",
  "lambda;": "λ",
  "langle;": "⟨",
  "larrfs;": "⤝",
  "larrhk;": "↩",
  "larrlp;": "↫",
  "larrpl;": "⤹",
  "larrtl;": "↢",
  "lAtail;": "⤛",
  "latail;": "⤙",
  "lbrace;": "{",
  "lbrack;": "[",
  "Lcaron;": "Ľ",
  "lcaron;": "ľ",
  "Lcedil;": "Ļ",
  "lcedil;": "ļ",
  "ldquor;": "„",
  "lesdot;": "⩿",
  "lesges;": "⪓",
  "lfisht;": "⥼",
  "lfloor;": "⌊",
  "lharul;": "⥪",
  "llhard;": "⥫",
  "Lmidot;": "Ŀ",
  "lmidot;": "ŀ",
  "lmoust;": "⎰",
  "loplus;": "⨭",
  "lowast;": "∗",
  "lowbar;": "_",
  "lparlt;": "⦓",
  "lrhard;": "⥭",
  "lsaquo;": "‹",
  "lsquor;": "‚",
  "Lstrok;": "Ł",
  "lstrok;": "ł",
  "lthree;": "⋋",
  "ltimes;": "⋉",
  "ltlarr;": "⥶",
  "ltrPar;": "⦖",
  "mapsto;": "↦",
  "marker;": "▮",
  "mcomma;": "⨩",
  "midast;": "*",
  "midcir;": "⫰",
  "middot;": "·",
  "minusb;": "⊟",
  "minusd;": "∸",
  "mnplus;": "∓",
  "models;": "⊧",
  "mstpos;": "∾",
  "Nacute;": "Ń",
  "nacute;": "ń",
  "nbumpe;": "≏̸",
  "Ncaron;": "Ň",
  "ncaron;": "ň",
  "Ncedil;": "Ņ",
  "ncedil;": "ņ",
  "nearhk;": "⤤",
  "nequiv;": "≢",
  "nesear;": "⤨",
  "nexist;": "∄",
  "nltrie;": "⋬",
  "notinE;": "⋹̸",
  "nparsl;": "⫽⃥",
  "nprcue;": "⋠",
  "nrarrc;": "⤳̸",
  "nrarrw;": "↝̸",
  "nrtrie;": "⋭",
  "nsccue;": "⋡",
  "nsimeq;": "≄",
  "Ntilde;": "Ñ",
  "ntilde;": "ñ",
  "numero;": "№",
  "nVDash;": "⊯",
  "nVdash;": "⊮",
  "nvDash;": "⊭",
  "nvdash;": "⊬",
  "nvHarr;": "⤄",
  "nvlArr;": "⤂",
  "nvrArr;": "⤃",
  "nwarhk;": "⤣",
  "nwnear;": "⤧",
  "Oacute;": "Ó",
  "oacute;": "ó",
  "Odblac;": "Ő",
  "odblac;": "ő",
  "odsold;": "⦼",
  "Ograve;": "Ò",
  "ograve;": "ò",
  "ominus;": "⊖",
  "origof;": "⊶",
  "Oslash;": "Ø",
  "oslash;": "ø",
  "Otilde;": "Õ",
  "otilde;": "õ",
  "Otimes;": "⨷",
  "otimes;": "⊗",
  "parsim;": "⫳",
  "percnt;": "%",
  "period;": ".",
  "permil;": "‰",
  "phmmat;": "ℳ",
  "planck;": "ℏ",
  "plankv;": "ℏ",
  "plusdo;": "∔",
  "plusdu;": "⨥",
  "plusmn;": "±",
  "preceq;": "⪯",
  "primes;": "ℙ",
  "prnsim;": "⋨",
  "propto;": "∝",
  "prurel;": "⊰",
  "puncsp;": " ",
  "qprime;": "⁗",
  "Racute;": "Ŕ",
  "racute;": "ŕ",
  "rangle;": "⟩",
  "rarrap;": "⥵",
  "rarrfs;": "⤞",
  "rarrhk;": "↪",
  "rarrlp;": "↬",
  "rarrpl;": "⥅",
  "Rarrtl;": "⤖",
  "rarrtl;": "↣",
  "rAtail;": "⤜",
  "ratail;": "⤚",
  "rbrace;": "}",
  "rbrack;": "]",
  "Rcaron;": "Ř",
  "rcaron;": "ř",
  "Rcedil;": "Ŗ",
  "rcedil;": "ŗ",
  "rdquor;": "”",
  "rfisht;": "⥽",
  "rfloor;": "⌋",
  "rharul;": "⥬",
  "rmoust;": "⎱",
  "roplus;": "⨮",
  "rpargt;": "⦔",
  "rsaquo;": "›",
  "rsquor;": "’",
  "rthree;": "⋌",
  "rtimes;": "⋊",
  "Sacute;": "Ś",
  "sacute;": "ś",
  "Scaron;": "Š",
  "scaron;": "š",
  "Scedil;": "Ş",
  "scedil;": "ş",
  "scnsim;": "⋩",
  "searhk;": "⤥",
  "seswar;": "⤩",
  "sfrown;": "⌢",
  "SHCHcy;": "Щ",
  "shchcy;": "щ",
  "sigmaf;": "ς",
  "sigmav;": "ς",
  "simdot;": "⩪",
  "smashp;": "⨳",
  "SOFTcy;": "Ь",
  "softcy;": "ь",
  "solbar;": "⌿",
  "spades;": "♠",
  "sqcaps;": "⊓︀",
  "sqcups;": "⊔︀",
  "sqsube;": "⊑",
  "sqsupe;": "⊒",
  "Square;": "□",
  "square;": "□",
  "squarf;": "▪",
  "ssetmn;": "∖",
  "ssmile;": "⌣",
  "sstarf;": "⋆",
  "subdot;": "⪽",
  "Subset;": "⋐",
  "subset;": "⊂",
  "subsim;": "⫇",
  "subsub;": "⫕",
  "subsup;": "⫓",
  "succeq;": "⪰",
  "supdot;": "⪾",
  "Supset;": "⋑",
  "supset;": "⊃",
  "supsim;": "⫈",
  "supsub;": "⫔",
  "supsup;": "⫖",
  "swarhk;": "⤦",
  "swnwar;": "⤪",
  "target;": "⌖",
  "Tcaron;": "Ť",
  "tcaron;": "ť",
  "Tcedil;": "Ţ",
  "tcedil;": "ţ",
  "telrec;": "⌕",
  "there4;": "∴",
  "thetav;": "ϑ",
  "thinsp;": " ",
  "thksim;": "∼",
  "timesb;": "⊠",
  "timesd;": "⨰",
  "topbot;": "⌶",
  "topcir;": "⫱",
  "tprime;": "‴",
  "tridot;": "◬",
  "Tstrok;": "Ŧ",
  "tstrok;": "ŧ",
  "Uacute;": "Ú",
  "uacute;": "ú",
  "Ubreve;": "Ŭ",
  "ubreve;": "ŭ",
  "Udblac;": "Ű",
  "udblac;": "ű",
  "ufisht;": "⥾",
  "Ugrave;": "Ù",
  "ugrave;": "ù",
  "ulcorn;": "⌜",
  "ulcrop;": "⌏",
  "urcorn;": "⌝",
  "urcrop;": "⌎",
  "Utilde;": "Ũ",
  "utilde;": "ũ",
  "vangrt;": "⦜",
  "varphi;": "ϕ",
  "varrho;": "ϱ",
  "Vdashl;": "⫦",
  "veebar;": "⊻",
  "vellip;": "⋮",
  "Verbar;": "‖",
  "verbar;": "|",
  "vsubnE;": "⫋︀",
  "vsubne;": "⊊︀",
  "vsupnE;": "⫌︀",
  "vsupne;": "⊋︀",
  "Vvdash;": "⊪",
  "wedbar;": "⩟",
  "wedgeq;": "≙",
  "weierp;": "℘",
  "wreath;": "≀",
  "xoplus;": "⨁",
  "xotime;": "⨂",
  "xsqcup;": "⨆",
  "xuplus;": "⨄",
  "xwedge;": "⋀",
  "Yacute;": "Ý",
  "yacute;": "ý",
  "Zacute;": "Ź",
  "zacute;": "ź",
  "Zcaron;": "Ž",
  "zcaron;": "ž",
  "zeetrf;": "ℨ",
  "alefsym;": "ℵ",
  "angrtvb;": "⊾",
  "angzarr;": "⍼",
  "asympeq;": "≍",
  "backsim;": "∽",
  "Because;": "∵",
  "because;": "∵",
  "bemptyv;": "⦰",
  "between;": "≬",
  "bigcirc;": "◯",
  "bigodot;": "⨀",
  "bigstar;": "★",
  "bnequiv;": "≡⃥",
  "boxplus;": "⊞",
  "Cayleys;": "ℭ",
  "Cconint;": "∰",
  "ccupssm;": "⩐",
  "Cedilla;": "¸",
  "cemptyv;": "⦲",
  "cirscir;": "⧂",
  "coloneq;": "≔",
  "congdot;": "⩭",
  "cudarrl;": "⤸",
  "cudarrr;": "⤵",
  "cularrp;": "⤽",
  "curarrm;": "⤼",
  "dbkarow;": "⤏",
  "ddagger;": "‡",
  "ddotseq;": "⩷",
  "demptyv;": "⦱",
  "Diamond;": "⋄",
  "diamond;": "⋄",
  "digamma;": "ϝ",
  "dotplus;": "∔",
  "DownTee;": "⊤",
  "dwangle;": "⦦",
  "Element;": "∈",
  "Epsilon;": "Ε",
  "epsilon;": "ε",
  "eqcolon;": "≕",
  "equivDD;": "⩸",
  "gesdoto;": "⪂",
  "gtquest;": "⩼",
  "gtrless;": "≷",
  "harrcir;": "⥈",
  "Implies;": "⇒",
  "intprod;": "⨼",
  "isindot;": "⋵",
  "larrbfs;": "⤟",
  "larrsim;": "⥳",
  "lbrksld;": "⦏",
  "lbrkslu;": "⦍",
  "ldrdhar;": "⥧",
  "LeftTee;": "⊣",
  "lesdoto;": "⪁",
  "lessdot;": "⋖",
  "lessgtr;": "≶",
  "lesssim;": "≲",
  "lotimes;": "⨴",
  "lozenge;": "◊",
  "ltquest;": "⩻",
  "luruhar;": "⥦",
  "maltese;": "✠",
  "minusdu;": "⨪",
  "napprox;": "≉",
  "natural;": "♮",
  "nearrow;": "↗",
  "NewLine;": "\n",
  "nexists;": "∄",
  "NoBreak;": "⁠",
  "notinva;": "∉",
  "notinvb;": "⋷",
  "notinvc;": "⋶",
  "NotLess;": "≮",
  "notniva;": "∌",
  "notnivb;": "⋾",
  "notnivc;": "⋽",
  "npolint;": "⨔",
  "npreceq;": "⪯̸",
  "nsqsube;": "⋢",
  "nsqsupe;": "⋣",
  "nsubset;": "⊂⃒",
  "nsucceq;": "⪰̸",
  "nsupset;": "⊃⃒",
  "nvinfin;": "⧞",
  "nvltrie;": "⊴⃒",
  "nvrtrie;": "⊵⃒",
  "nwarrow;": "↖",
  "olcross;": "⦻",
  "Omicron;": "Ο",
  "omicron;": "ο",
  "orderof;": "ℴ",
  "orslope;": "⩗",
  "OverBar;": "‾",
  "pertenk;": "‱",
  "planckh;": "ℎ",
  "pluscir;": "⨢",
  "plussim;": "⨦",
  "plustwo;": "⨧",
  "precsim;": "≾",
  "Product;": "∏",
  "quatint;": "⨖",
  "questeq;": "≟",
  "rarrbfs;": "⤠",
  "rarrsim;": "⥴",
  "rbrksld;": "⦎",
  "rbrkslu;": "⦐",
  "rdldhar;": "⥩",
  "realine;": "ℛ",
  "rotimes;": "⨵",
  "ruluhar;": "⥨",
  "searrow;": "↘",
  "simplus;": "⨤",
  "simrarr;": "⥲",
  "subedot;": "⫃",
  "submult;": "⫁",
  "subplus;": "⪿",
  "subrarr;": "⥹",
  "succsim;": "≿",
  "supdsub;": "⫘",
  "supedot;": "⫄",
  "suphsol;": "⟉",
  "suphsub;": "⫗",
  "suplarr;": "⥻",
  "supmult;": "⫂",
  "supplus;": "⫀",
  "swarrow;": "↙",
  "topfork;": "⫚",
  "triplus;": "⨹",
  "tritime;": "⨻",
  "UpArrow;": "↑",
  "Uparrow;": "⇑",
  "uparrow;": "↑",
  "Upsilon;": "Υ",
  "upsilon;": "υ",
  "uwangle;": "⦧",
  "vzigzag;": "⦚",
  "zigrarr;": "⇝",
  "andslope;": "⩘",
  "angmsdaa;": "⦨",
  "angmsdab;": "⦩",
  "angmsdac;": "⦪",
  "angmsdad;": "⦫",
  "angmsdae;": "⦬",
  "angmsdaf;": "⦭",
  "angmsdag;": "⦮",
  "angmsdah;": "⦯",
  "angrtvbd;": "⦝",
  "approxeq;": "≊",
  "awconint;": "∳",
  "backcong;": "≌",
  "barwedge;": "⌅",
  "bbrktbrk;": "⎶",
  "bigoplus;": "⨁",
  "bigsqcup;": "⨆",
  "biguplus;": "⨄",
  "bigwedge;": "⋀",
  "boxminus;": "⊟",
  "boxtimes;": "⊠",
  "bsolhsub;": "⟈",
  "capbrcup;": "⩉",
  "circledR;": "®",
  "circledS;": "Ⓢ",
  "cirfnint;": "⨐",
  "clubsuit;": "♣",
  "cupbrcap;": "⩈",
  "curlyvee;": "⋎",
  "cwconint;": "∲",
  "DDotrahd;": "⤑",
  "doteqdot;": "≑",
  "DotEqual;": "≐",
  "dotminus;": "∸",
  "drbkarow;": "⤐",
  "dzigrarr;": "⟿",
  "elinters;": "⏧",
  "emptyset;": "∅",
  "eqvparsl;": "⧥",
  "fpartint;": "⨍",
  "geqslant;": "⩾",
  "gesdotol;": "⪄",
  "gnapprox;": "⪊",
  "hksearow;": "⤥",
  "hkswarow;": "⤦",
  "imagline;": "ℐ",
  "imagpart;": "ℑ",
  "infintie;": "⧝",
  "integers;": "ℤ",
  "Integral;": "∫",
  "intercal;": "⊺",
  "intlarhk;": "⨗",
  "laemptyv;": "⦴",
  "ldrushar;": "⥋",
  "leqslant;": "⩽",
  "lesdotor;": "⪃",
  "LessLess;": "⪡",
  "llcorner;": "⌞",
  "lnapprox;": "⪉",
  "lrcorner;": "⌟",
  "lurdshar;": "⥊",
  "mapstoup;": "↥",
  "multimap;": "⊸",
  "naturals;": "ℕ",
  "ncongdot;": "⩭̸",
  "NotEqual;": "≠",
  "notindot;": "⋵̸",
  "NotTilde;": "≁",
  "otimesas;": "⨶",
  "parallel;": "∥",
  "PartialD;": "∂",
  "plusacir;": "⨣",
  "pointint;": "⨕",
  "Precedes;": "≺",
  "precneqq;": "⪵",
  "precnsim;": "⋨",
  "profalar;": "⌮",
  "profline;": "⌒",
  "profsurf;": "⌓",
  "raemptyv;": "⦳",
  "realpart;": "ℜ",
  "RightTee;": "⊢",
  "rppolint;": "⨒",
  "rtriltri;": "⧎",
  "scpolint;": "⨓",
  "setminus;": "∖",
  "shortmid;": "∣",
  "smeparsl;": "⧤",
  "sqsubset;": "⊏",
  "sqsupset;": "⊐",
  "subseteq;": "⊆",
  "Succeeds;": "≻",
  "succneqq;": "⪶",
  "succnsim;": "⋩",
  "SuchThat;": "∋",
  "Superset;": "⊃",
  "supseteq;": "⊇",
  "thetasym;": "ϑ",
  "thicksim;": "∼",
  "timesbar;": "⨱",
  "triangle;": "▵",
  "triminus;": "⨺",
  "trpezium;": "⏢",
  "Uarrocir;": "⥉",
  "ulcorner;": "⌜",
  "UnderBar;": "_",
  "urcorner;": "⌝",
  "varkappa;": "ϰ",
  "varsigma;": "ς",
  "vartheta;": "ϑ",
  "backprime;": "‵",
  "backsimeq;": "⋍",
  "Backslash;": "∖",
  "bigotimes;": "⨂",
  "CenterDot;": "·",
  "centerdot;": "·",
  "checkmark;": "✓",
  "CircleDot;": "⊙",
  "complexes;": "ℂ",
  "Congruent;": "≡",
  "Coproduct;": "∐",
  "dotsquare;": "⊡",
  "DoubleDot;": "¨",
  "DownArrow;": "↓",
  "Downarrow;": "⇓",
  "downarrow;": "↓",
  "DownBreve;": "̑",
  "gtrapprox;": "⪆",
  "gtreqless;": "⋛",
  "gvertneqq;": "≩︀",
  "heartsuit;": "♥",
  "HumpEqual;": "≏",
  "LeftArrow;": "←",
  "Leftarrow;": "⇐",
  "leftarrow;": "←",
  "LeftFloor;": "⌊",
  "lesseqgtr;": "⋚",
  "LessTilde;": "≲",
  "lvertneqq;": "≨︀",
  "Mellintrf;": "ℳ",
  "MinusPlus;": "∓",
  "ngeqslant;": "⩾̸",
  "nleqslant;": "⩽̸",
  "NotCupCap;": "≭",
  "NotExists;": "∄",
  "NotSubset;": "⊂⃒",
  "nparallel;": "∦",
  "nshortmid;": "∤",
  "nsubseteq;": "⊈",
  "nsupseteq;": "⊉",
  "OverBrace;": "⏞",
  "pitchfork;": "⋔",
  "PlusMinus;": "±",
  "rationals;": "ℚ",
  "spadesuit;": "♠",
  "subseteqq;": "⫅",
  "subsetneq;": "⊊",
  "supseteqq;": "⫆",
  "supsetneq;": "⊋",
  "Therefore;": "∴",
  "therefore;": "∴",
  "ThinSpace;": " ",
  "triangleq;": "≜",
  "TripleDot;": "⃛",
  "UnionPlus;": "⊎",
  "varpropto;": "∝",
  "Bernoullis;": "ℬ",
  "circledast;": "⊛",
  "CirclePlus;": "⊕",
  "complement;": "∁",
  "curlywedge;": "⋏",
  "eqslantgtr;": "⪖",
  "EqualTilde;": "≂",
  "Fouriertrf;": "ℱ",
  "gtreqqless;": "⪌",
  "ImaginaryI;": "ⅈ",
  "Laplacetrf;": "ℒ",
  "LeftVector;": "↼",
  "lessapprox;": "⪅",
  "lesseqqgtr;": "⪋",
  "Lleftarrow;": "⇚",
  "lmoustache;": "⎰",
  "longmapsto;": "⟼",
  "mapstodown;": "↧",
  "mapstoleft;": "↤",
  "nLeftarrow;": "⇍",
  "nleftarrow;": "↚",
  "NotElement;": "∉",
  "NotGreater;": "≯",
  "nsubseteqq;": "⫅̸",
  "nsupseteqq;": "⫆̸",
  "precapprox;": "⪷",
  "Proportion;": "∷",
  "RightArrow;": "→",
  "Rightarrow;": "⇒",
  "rightarrow;": "→",
  "RightFloor;": "⌋",
  "rmoustache;": "⎱",
  "sqsubseteq;": "⊑",
  "sqsupseteq;": "⊒",
  "subsetneqq;": "⫋",
  "succapprox;": "⪸",
  "supsetneqq;": "⫌",
  "ThickSpace;": "  ",
  "TildeEqual;": "≃",
  "TildeTilde;": "≈",
  "UnderBrace;": "⏟",
  "UpArrowBar;": "⤒",
  "UpTeeArrow;": "↥",
  "upuparrows;": "⇈",
  "varepsilon;": "ϵ",
  "varnothing;": "∅",
  "backepsilon;": "϶",
  "blacksquare;": "▪",
  "circledcirc;": "⊚",
  "circleddash;": "⊝",
  "CircleMinus;": "⊖",
  "CircleTimes;": "⊗",
  "curlyeqprec;": "⋞",
  "curlyeqsucc;": "⋟",
  "diamondsuit;": "♦",
  "eqslantless;": "⪕",
  "Equilibrium;": "⇌",
  "expectation;": "ℰ",
  "GreaterLess;": "≷",
  "LeftCeiling;": "⌈",
  "LessGreater;": "≶",
  "MediumSpace;": " ",
  "NotLessLess;": "≪̸",
  "NotPrecedes;": "⊀",
  "NotSucceeds;": "⊁",
  "NotSuperset;": "⊃⃒",
  "nRightarrow;": "⇏",
  "nrightarrow;": "↛",
  "OverBracket;": "⎴",
  "preccurlyeq;": "≼",
  "precnapprox;": "⪹",
  "quaternions;": "ℍ",
  "RightVector;": "⇀",
  "Rrightarrow;": "⇛",
  "RuleDelayed;": "⧴",
  "SmallCircle;": "∘",
  "SquareUnion;": "⊔",
  "straightphi;": "ϕ",
  "SubsetEqual;": "⊆",
  "succcurlyeq;": "≽",
  "succnapprox;": "⪺",
  "thickapprox;": "≈",
  "UpDownArrow;": "↕",
  "Updownarrow;": "⇕",
  "updownarrow;": "↕",
  "VerticalBar;": "∣",
  "blacklozenge;": "⧫",
  "DownArrowBar;": "⤓",
  "DownTeeArrow;": "↧",
  "ExponentialE;": "ⅇ",
  "exponentiale;": "ⅇ",
  "GreaterEqual;": "≥",
  "GreaterTilde;": "≳",
  "HilbertSpace;": "ℋ",
  "HumpDownHump;": "≎",
  "Intersection;": "⋂",
  "LeftArrowBar;": "⇤",
  "LeftTeeArrow;": "↤",
  "LeftTriangle;": "⊲",
  "LeftUpVector;": "↿",
  "NotCongruent;": "≢",
  "NotHumpEqual;": "≏̸",
  "NotLessEqual;": "≰",
  "NotLessTilde;": "≴",
  "Proportional;": "∝",
  "RightCeiling;": "⌉",
  "risingdotseq;": "≓",
  "RoundImplies;": "⥰",
  "ShortUpArrow;": "↑",
  "SquareSubset;": "⊏",
  "triangledown;": "▿",
  "triangleleft;": "◃",
  "UnderBracket;": "⎵",
  "varsubsetneq;": "⊊︀",
  "varsupsetneq;": "⊋︀",
  "VerticalLine;": "|",
  "ApplyFunction;": "⁡",
  "bigtriangleup;": "△",
  "blacktriangle;": "▴",
  "DifferentialD;": "ⅆ",
  "divideontimes;": "⋇",
  "DoubleLeftTee;": "⫤",
  "DoubleUpArrow;": "⇑",
  "fallingdotseq;": "≒",
  "hookleftarrow;": "↩",
  "leftarrowtail;": "↢",
  "leftharpoonup;": "↼",
  "LeftTeeVector;": "⥚",
  "LeftVectorBar;": "⥒",
  "LessFullEqual;": "≦",
  "LongLeftArrow;": "⟵",
  "Longleftarrow;": "⟸",
  "longleftarrow;": "⟵",
  "looparrowleft;": "↫",
  "measuredangle;": "∡",
  "NotEqualTilde;": "≂̸",
  "NotTildeEqual;": "≄",
  "NotTildeTilde;": "≉",
  "ntriangleleft;": "⋪",
  "Poincareplane;": "ℌ",
  "PrecedesEqual;": "⪯",
  "PrecedesTilde;": "≾",
  "RightArrowBar;": "⇥",
  "RightTeeArrow;": "↦",
  "RightTriangle;": "⊳",
  "RightUpVector;": "↾",
  "shortparallel;": "∥",
  "smallsetminus;": "∖",
  "SucceedsEqual;": "⪰",
  "SucceedsTilde;": "≿",
  "SupersetEqual;": "⊇",
  "triangleright;": "▹",
  "UpEquilibrium;": "⥮",
  "upharpoonleft;": "↿",
  "varsubsetneqq;": "⫋︀",
  "varsupsetneqq;": "⫌︀",
  "VerticalTilde;": "≀",
  "VeryThinSpace;": " ",
  "curvearrowleft;": "↶",
  "DiacriticalDot;": "˙",
  "doublebarwedge;": "⌆",
  "DoubleRightTee;": "⊨",
  "downdownarrows;": "⇊",
  "DownLeftVector;": "↽",
  "GreaterGreater;": "⪢",
  "hookrightarrow;": "↪",
  "HorizontalLine;": "─",
  "InvisibleComma;": "⁣",
  "InvisibleTimes;": "⁢",
  "LeftDownVector;": "⇃",
  "leftleftarrows;": "⇇",
  "LeftRightArrow;": "↔",
  "Leftrightarrow;": "⇔",
  "leftrightarrow;": "↔",
  "leftthreetimes;": "⋋",
  "LessSlantEqual;": "⩽",
  "LongRightArrow;": "⟶",
  "Longrightarrow;": "⟹",
  "longrightarrow;": "⟶",
  "looparrowright;": "↬",
  "LowerLeftArrow;": "↙",
  "NestedLessLess;": "≪",
  "NotGreaterLess;": "≹",
  "NotLessGreater;": "≸",
  "NotSubsetEqual;": "⊈",
  "NotVerticalBar;": "∤",
  "nshortparallel;": "∦",
  "ntriangleright;": "⋫",
  "OpenCurlyQuote;": "‘",
  "ReverseElement;": "∋",
  "rightarrowtail;": "↣",
  "rightharpoonup;": "⇀",
  "RightTeeVector;": "⥛",
  "RightVectorBar;": "⥓",
  "ShortDownArrow;": "↓",
  "ShortLeftArrow;": "←",
  "SquareSuperset;": "⊐",
  "TildeFullEqual;": "≅",
  "trianglelefteq;": "⊴",
  "upharpoonright;": "↾",
  "UpperLeftArrow;": "↖",
  "ZeroWidthSpace;": "​",
  "bigtriangledown;": "▽",
  "circlearrowleft;": "↺",
  "CloseCurlyQuote;": "’",
  "ContourIntegral;": "∮",
  "curvearrowright;": "↷",
  "DoubleDownArrow;": "⇓",
  "DoubleLeftArrow;": "⇐",
  "downharpoonleft;": "⇃",
  "DownRightVector;": "⇁",
  "leftharpoondown;": "↽",
  "leftrightarrows;": "⇆",
  "LeftRightVector;": "⥎",
  "LeftTriangleBar;": "⧏",
  "LeftUpTeeVector;": "⥠",
  "LeftUpVectorBar;": "⥘",
  "LowerRightArrow;": "↘",
  "nLeftrightarrow;": "⇎",
  "nleftrightarrow;": "↮",
  "NotGreaterEqual;": "≱",
  "NotGreaterTilde;": "≵",
  "NotHumpDownHump;": "≎̸",
  "NotLeftTriangle;": "⋪",
  "NotSquareSubset;": "⊏̸",
  "ntrianglelefteq;": "⋬",
  "OverParenthesis;": "⏜",
  "RightDownVector;": "⇂",
  "rightleftarrows;": "⇄",
  "rightsquigarrow;": "↝",
  "rightthreetimes;": "⋌",
  "ShortRightArrow;": "→",
  "straightepsilon;": "ϵ",
  "trianglerighteq;": "⊵",
  "UpperRightArrow;": "↗",
  "vartriangleleft;": "⊲",
  "circlearrowright;": "↻",
  "DiacriticalAcute;": "´",
  "DiacriticalGrave;": "`",
  "DiacriticalTilde;": "˜",
  "DoubleRightArrow;": "⇒",
  "DownArrowUpArrow;": "⇵",
  "downharpoonright;": "⇂",
  "EmptySmallSquare;": "◻",
  "GreaterEqualLess;": "⋛",
  "GreaterFullEqual;": "≧",
  "LeftAngleBracket;": "⟨",
  "LeftUpDownVector;": "⥑",
  "LessEqualGreater;": "⋚",
  "NonBreakingSpace;": " ",
  "NotPrecedesEqual;": "⪯̸",
  "NotRightTriangle;": "⋫",
  "NotSucceedsEqual;": "⪰̸",
  "NotSucceedsTilde;": "≿̸",
  "NotSupersetEqual;": "⊉",
  "ntrianglerighteq;": "⋭",
  "rightharpoondown;": "⇁",
  "rightrightarrows;": "⇉",
  "RightTriangleBar;": "⧐",
  "RightUpTeeVector;": "⥜",
  "RightUpVectorBar;": "⥔",
  "twoheadleftarrow;": "↞",
  "UnderParenthesis;": "⏝",
  "UpArrowDownArrow;": "⇅",
  "vartriangleright;": "⊳",
  "blacktriangledown;": "▾",
  "blacktriangleleft;": "◂",
  "DoubleUpDownArrow;": "⇕",
  "DoubleVerticalBar;": "∥",
  "DownLeftTeeVector;": "⥞",
  "DownLeftVectorBar;": "⥖",
  "FilledSmallSquare;": "◼",
  "GreaterSlantEqual;": "⩾",
  "LeftDoubleBracket;": "⟦",
  "LeftDownTeeVector;": "⥡",
  "LeftDownVectorBar;": "⥙",
  "leftrightharpoons;": "⇋",
  "LeftTriangleEqual;": "⊴",
  "NegativeThinSpace;": "​",
  "NotGreaterGreater;": "≫̸",
  "NotLessSlantEqual;": "⩽̸",
  "NotNestedLessLess;": "⪡̸",
  "NotReverseElement;": "∌",
  "NotSquareSuperset;": "⊐̸",
  "NotTildeFullEqual;": "≇",
  "RightAngleBracket;": "⟩",
  "rightleftharpoons;": "⇌",
  "RightUpDownVector;": "⥏",
  "SquareSubsetEqual;": "⊑",
  "twoheadrightarrow;": "↠",
  "VerticalSeparator;": "❘",
  "blacktriangleright;": "▸",
  "DownRightTeeVector;": "⥟",
  "DownRightVectorBar;": "⥗",
  "LongLeftRightArrow;": "⟷",
  "Longleftrightarrow;": "⟺",
  "longleftrightarrow;": "⟷",
  "NegativeThickSpace;": "​",
  "NotLeftTriangleBar;": "⧏̸",
  "PrecedesSlantEqual;": "≼",
  "ReverseEquilibrium;": "⇋",
  "RightDoubleBracket;": "⟧",
  "RightDownTeeVector;": "⥝",
  "RightDownVectorBar;": "⥕",
  "RightTriangleEqual;": "⊵",
  "SquareIntersection;": "⊓",
  "SucceedsSlantEqual;": "≽",
  "DoubleLongLeftArrow;": "⟸",
  "DownLeftRightVector;": "⥐",
  "LeftArrowRightArrow;": "⇆",
  "leftrightsquigarrow;": "↭",
  "NegativeMediumSpace;": "​",
  "NotGreaterFullEqual;": "≧̸",
  "NotRightTriangleBar;": "⧐̸",
  "RightArrowLeftArrow;": "⇄",
  "SquareSupersetEqual;": "⊒",
  "CapitalDifferentialD;": "ⅅ",
  "DoubleLeftRightArrow;": "⇔",
  "DoubleLongRightArrow;": "⟹",
  "EmptyVerySmallSquare;": "▫",
  "NestedGreaterGreater;": "≫",
  "NotDoubleVerticalBar;": "∦",
  "NotGreaterSlantEqual;": "⩾̸",
  "NotLeftTriangleEqual;": "⋬",
  "NotSquareSubsetEqual;": "⋢",
  "OpenCurlyDoubleQuote;": "“",
  "ReverseUpEquilibrium;": "⥯",
  "CloseCurlyDoubleQuote;": "”",
  "DoubleContourIntegral;": "∯",
  "FilledVerySmallSquare;": "▪",
  "NegativeVeryThinSpace;": "​",
  "NotPrecedesSlantEqual;": "⋠",
  "NotRightTriangleEqual;": "⋭",
  "NotSucceedsSlantEqual;": "⋡",
  "DiacriticalDoubleAcute;": "˝",
  "NotSquareSupersetEqual;": "⋣",
  "NotNestedGreaterGreater;": "⪢̸",
  "ClockwiseContourIntegral;": "∲",
  "DoubleLongLeftRightArrow;": "⟺",
  "CounterClockwiseContourIntegral;": "∳"
}

const decodeHtml = (rawText, asAttr) => {
  let offset = 0
  const end = rawText.length
  let decodedText = ''

  function advance(length) {
    offset += length
    rawText = rawText.slice(length)
  }

  while (offset < end) {
    const head = /&(?:#x?)?/i.exec(rawText)
    if (!head || offset + head.index >= end) {
      const remaining = end - offset
      decodedText += rawText.slice(0, remaining)
      advance(remaining)
      break
    }

    // Advance to the "&".
    decodedText += rawText.slice(0, head.index)
    advance(head.index)

    if (head[0] === '&') {
      // Named character reference.
      let name = ''
      let value = undefined
      if (/[0-9a-z]/i.test(rawText[1])) {
        if (!maxCRNameLength) {
          maxCRNameLength = Object.keys(namedCharacterReferences).reduce(
            (max, name) => Math.max(max, name.length),
            0
          )
        }
        for (let length = maxCRNameLength; !value && length > 0; --length) {
          name = rawText.slice(1, 1 + length)
          value = namedCharacterReferences[name]
        }
        if (value) {
          const semi = name.endsWith(';')
          if (
            asAttr &&
            !semi &&
            /[=a-z0-9]/i.test(rawText[name.length + 1] || '')
          ) {
            decodedText += '&' + name
            advance(1 + name.length)
          } else {
            decodedText += value
            advance(1 + name.length)
          }
        } else {
          decodedText += '&' + name
          advance(1 + name.length)
        }
      } else {
        decodedText += '&'
        advance(1)
      }
    } else {
      // Numeric character reference.
      const hex = head[0] === '&#x'
      const pattern = hex ? /^&#x([0-9a-f]+);?/i : /^&#([0-9]+);?/
      const body = pattern.exec(rawText)
      if (!body) {
        decodedText += head[0]
        advance(head[0].length)
      } else {
        // https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state
        let cp = Number.parseInt(body[1], hex ? 16 : 10)
        if (cp === 0) {
          cp = 0xfffd
        } else if (cp > 0x10ffff) {
          cp = 0xfffd
        } else if (cp >= 0xd800 && cp <= 0xdfff) {
          cp = 0xfffd
        } else if ((cp >= 0xfdd0 && cp <= 0xfdef) || (cp & 0xfffe) === 0xfffe) {
          // noop
        } else if (
          (cp >= 0x01 && cp <= 0x08) ||
          cp === 0x0b ||
          (cp >= 0x0d && cp <= 0x1f) ||
          (cp >= 0x7f && cp <= 0x9f)
        ) {
          cp = CCR_REPLACEMENTS[cp] || cp
        }
        decodedText += String.fromCodePoint(cp)
        advance(body[0].length)
      }
    }
  }
  return decodedText
}

// https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state
const CCR_REPLACEMENTS = {
  0x80: 0x20ac,
  0x82: 0x201a,
  0x83: 0x0192,
  0x84: 0x201e,
  0x85: 0x2026,
  0x86: 0x2020,
  0x87: 0x2021,
  0x88: 0x02c6,
  0x89: 0x2030,
  0x8a: 0x0160,
  0x8b: 0x2039,
  0x8c: 0x0152,
  0x8e: 0x017d,
  0x91: 0x2018,
  0x92: 0x2019,
  0x93: 0x201c,
  0x94: 0x201d,
  0x95: 0x2022,
  0x96: 0x2013,
  0x97: 0x2014,
  0x98: 0x02dc,
  0x99: 0x2122,
  0x9a: 0x0161,
  0x9b: 0x203a,
  0x9c: 0x0153,
  0x9e: 0x017e,
  0x9f: 0x0178
}

let decoder

function decodeHtmlBrowser(raw, asAttr = false) {
  if (!decoder) {
    decoder = document.createElement('div')
  }
  if (asAttr) {
    decoder.innerHTML = `<div foo="${raw.replace(/"/g, '&quot;')}">`
    return decoder.children[0].getAttribute('foo')
  } else {
    decoder.innerHTML = raw
    return decoder.textContent
  }
}

const V_MODEL_RADIO = Symbol(__DEV__ ? `vModelRadio` : ``)
const V_MODEL_CHECKBOX = Symbol(__DEV__ ? `vModelCheckbox` : ``)
const V_MODEL_TEXT = Symbol(__DEV__ ? `vModelText` : ``)
const V_MODEL_SELECT = Symbol(__DEV__ ? `vModelSelect` : ``)
const V_MODEL_DYNAMIC = Symbol(__DEV__ ? `vModelDynamic` : ``)

const V_ON_WITH_MODIFIERS = Symbol(__DEV__ ? `vOnModifiersGuard` : ``)
const V_ON_WITH_KEYS = Symbol(__DEV__ ? `vOnKeysGuard` : ``)

const V_SHOW = Symbol(__DEV__ ? `vShow` : ``)

const TRANSITION = Symbol(__DEV__ ? `Transition` : ``)
const TRANSITION_GROUP = Symbol(__DEV__ ? `TransitionGroup` : ``)

registerRuntimeHelpers({
  [V_MODEL_RADIO]: `vModelRadio`,
  [V_MODEL_CHECKBOX]: `vModelCheckbox`,
  [V_MODEL_TEXT]: `vModelText`,
  [V_MODEL_SELECT]: `vModelSelect`,
  [V_MODEL_DYNAMIC]: `vModelDynamic`,
  [V_ON_WITH_MODIFIERS]: `withModifiers`,
  [V_ON_WITH_KEYS]: `withKeys`,
  [V_SHOW]: `vShow`,
  [TRANSITION]: `Transition`,
  [TRANSITION_GROUP]: `TransitionGroup`
})


/**
 * On the client we only need to offer special cases for boolean attributes that
 * have different names from their corresponding dom properties:
 * - itemscope -> N/A
 * - allowfullscreen -> allowFullscreen
 * - formnovalidate -> formNoValidate
 * - ismap -> isMap
 * - nomodule -> noModule
 * - novalidate -> noValidate
 * - readonly -> readOnly
 */
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`
const isSpecialBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs)

/**
 * The full list is needed during SSR to produce the correct initial markup.
 */
const isBooleanAttr = /*#__PURE__*/ makeMap(
  specialBooleanAttrs +
    `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` +
    `loop,open,required,reversed,scoped,seamless,` +
    `checked,muted,multiple,selected`
)

/**
 * Boolean attributes should be included if the value is truthy or ''.
 * e.g. `<select multiple>` compiles to `{ multiple: '' }`
 */
function includeBooleanAttr(value) {
  return !!value || value === ''
}

const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/
const attrValidationCache = {}

function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name]
  }
  const isUnsafe = unsafeAttrCharRE.test(name)
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`)
  }
  return (attrValidationCache[name] = !isUnsafe)
}

const propsToAttrMap = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
}

/**
 * CSS properties that accept plain numbers
 */
const isNoUnitNumericStyleProp = /*#__PURE__*/ makeMap(
  `animation-iteration-count,border-image-outset,border-image-slice,` +
    `border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,` +
    `columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,` +
    `grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,` +
    `grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,` +
    `line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,` +
    // SVG
    `fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,` +
    `stroke-miterlimit,stroke-opacity,stroke-width`
)

/**
 * Known attributes, this is used for stringification of runtime static nodes
 * so that we don't stringify bindings that cannot be set from HTML.
 * Don't also forget to allow `data-*` and `aria-*`!
 * Generated from https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
const isKnownHtmlAttr = /*#__PURE__*/ makeMap(
  `accept,accept-charset,accesskey,action,align,allow,alt,async,` +
    `autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,` +
    `border,buffered,capture,challenge,charset,checked,cite,class,code,` +
    `codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,` +
    `coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,` +
    `disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,` +
    `formaction,formenctype,formmethod,formnovalidate,formtarget,headers,` +
    `height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,` +
    `ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,` +
    `manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,` +
    `open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,` +
    `referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,` +
    `selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,` +
    `start,step,style,summary,tabindex,target,title,translate,type,usemap,` +
    `value,width,wrap`
)

/**
 * Generated from https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
const isKnownSvgAttr = /*#__PURE__*/ makeMap(
  `xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,` +
    `arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,` +
    `baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,` +
    `clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,` +
    `color-interpolation-filters,color-profile,color-rendering,` +
    `contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,` +
    `descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,` +
    `dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,` +
    `fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,` +
    `font-family,font-size,font-size-adjust,font-stretch,font-style,` +
    `font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,` +
    `glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,` +
    `gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,` +
    `horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,` +
    `k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,` +
    `lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,` +
    `marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,` +
    `mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,` +
    `name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,` +
    `overflow,overline-position,overline-thickness,panose-1,paint-order,path,` +
    `pathLength,patternContentUnits,patternTransform,patternUnits,ping,` +
    `pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,` +
    `preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,` +
    `rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,` +
    `restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,` +
    `specularConstant,specularExponent,speed,spreadMethod,startOffset,` +
    `stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,` +
    `strikethrough-position,strikethrough-thickness,string,stroke,` +
    `stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,` +
    `stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,` +
    `systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,` +
    `text-decoration,text-rendering,textLength,to,transform,transform-origin,` +
    `type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,` +
    `unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,` +
    `v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,` +
    `vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,` +
    `writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,` +
    `xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,` +
    `xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`
)

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const HTML_TAGS =
  'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
  'header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,' +
  'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
  'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,' +
  'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
  'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
  'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
  'option,output,progress,select,textarea,details,dialog,menu,' +
  'summary,template,blockquote,iframe,tfoot'

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const SVG_TAGS =
  'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
  'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
  'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
  'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
  'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
  'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
  'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' +
  'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
  'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
  'text,textPath,title,tspan,unknown,use,view'

const VOID_TAGS =
  'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'

const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS)
/**
 * Compiler only.
 * Do NOT use in runtime code paths unless behind `__DEV__` flag.
 */
const isSVGTag = /*#__PURE__*/ makeMap(SVG_TAGS)
const isVoidTag = /*#__PURE__*/ makeMap(VOID_TAGS)


function normalizeStyle(value) { // (ref:normalizeStyle)
  if (isArray(value)) {
    const res = {}
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      const normalized = isString(item)
        ? parseStringStyle(item)
        : normalizeStyle(item)
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key]
        }
      }
    }
    return res
  } else if (isString(value)) {
    return value
  } else if (isObject(value)) {
    return value
  }
}

const listDelimiterRE = /;(?![^(]*\))/g
const propertyDelimiterRE = /:(.+)/

function parseStringStyle(cssText) { // (ref:parseStringStyle)
  const ret = {}
  cssText.split(listDelimiterRE).forEach(item => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE)
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return ret
}

function stringifyStyle(styles) { // (ref:stringifyStyle)
  let ret = ''
  if (!styles || isString(styles)) {
    return ret
  }
  for (const key in styles) {
    const value = styles[key]
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key)
    if (
      isString(value) ||
      (typeof value === 'number' && isNoUnitNumericStyleProp(normalizedKey))
    ) {
      // only render valid values
      ret += `${normalizedKey}:${value};`
    }
  }
  return ret
}

function normalizeClass(value) { // (ref:normalizeClass)
  let res = ''
  if (isString(value)) {
    res = value
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i])
      if (normalized) {
        res += normalized + ' '
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + ' '
      }
    }
  }
  return res.trim()
}

function normalizeProps(props) { // (ref:normalizeProps)
  if (!props) return null
  let { class: klass, style } = props
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass)
  }
  if (style) {
    props.style = normalizeStyle(style)
  }
  return props
}

const escapeRE = /["'&<>]/

function escapeHtml(string) {
  const str = '' + string
  const match = escapeRE.exec(str)

  if (!match) {
    return str
  }

  let html = ''
  let escaped
  let index
  let lastIndex = 0
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escaped = '&quot;'
        break
      case 38: // &
        escaped = '&amp;'
        break
      case 39: // '
        escaped = '&#39;'
        break
      case 60: // <
        escaped = '&lt;'
        break
      case 62: // >
        escaped = '&gt;'
        break
      default:
        continue
    }

    if (lastIndex !== index) {
      html += str.slice(lastIndex, index)
    }

    lastIndex = index + 1
    html += escaped
  }

  return lastIndex !== index ? html + str.slice(lastIndex, index) : html
}

// https://www.w3.org/TR/html52/syntax.html#comments
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g

function escapeHtmlComment(src) {
  return src.replace(commentStripRE, '')
}

const toDisplayString = (val) => {
  return isString(val)
    ? val
    : val == null
    ? ''
    : isArray(val) ||
      (isObject(val) &&
        (val.toString === objectToString || !isFunction(val.toString)))
    ? JSON.stringify(val, replacer, 2)
    : String(val)
}

const replacer = (_key, val) => {
  // can't use isRef here since @vue/shared has no deps
  if (val && val.__v_isRef) {
    return replacer(_key, val.value)
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
        ;entries[`${key} =>`] = val
        return entries
      }, {})
    }
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    }
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val)
  }
  return val
}

const noopDirectiveTransform = () => ({ props: [] })

const isRawTextContainer = /*#__PURE__*/ makeMap(
  'style,iframe,script,noscript',
  true
)

const DOMNamespaces = {
  HTML: Namespaces.HTML,
  SVG: 1,
  MATH_ML: 2
}

const parserOptions = {
  isVoidTag,
  isNativeTag: tag => isHTMLTag(tag) || isSVGTag(tag),
  isPreTag: tag => tag === 'pre',
  decodeEntities: __BROWSER__ ? decodeHtmlBrowser : decodeHtml,

  isBuiltInComponent: tag => {
    if (isBuiltInType(tag, `Transition`)) {
      return TRANSITION
    } else if (isBuiltInType(tag, `TransitionGroup`)) {
      return TRANSITION_GROUP
    }
  },

  // https://html.spec.whatwg.org/multipage/parsing.html#tree-construction-dispatcher
  getNamespace(tag, parent) {
    let ns = parent ? parent.ns : DOMNamespaces.HTML

    if (parent && ns === DOMNamespaces.MATH_ML) {
      if (parent.tag === 'annotation-xml') {
        if (tag === 'svg') {
          return DOMNamespaces.SVG
        }
        if (
          parent.props.some(
            a =>
              a.type === NodeTypes.ATTRIBUTE &&
              a.name === 'encoding' &&
              a.value != null &&
              (a.value.content === 'text/html' ||
                a.value.content === 'application/xhtml+xml')
          )
        ) {
          ns = DOMNamespaces.HTML
        }
      } else if (
        /^m(?:[ions]|text)$/.test(parent.tag) &&
        tag !== 'mglyph' &&
        tag !== 'malignmark'
      ) {
        ns = DOMNamespaces.HTML
      }
    } else if (parent && ns === DOMNamespaces.SVG) {
      if (
        parent.tag === 'foreignObject' ||
        parent.tag === 'desc' ||
        parent.tag === 'title'
      ) {
        ns = DOMNamespaces.HTML
      }
    }

    if (ns === DOMNamespaces.HTML) {
      if (tag === 'svg') {
        return DOMNamespaces.SVG
      }
      if (tag === 'math') {
        return DOMNamespaces.MATH_ML
      }
    }
    return ns
  },

  // https://html.spec.whatwg.org/multipage/parsing.html#parsing-html-fragments
  getTextMode({ tag, ns }) {
    if (ns === DOMNamespaces.HTML) {
      if (tag === 'textarea' || tag === 'title') {
        return TextModes.RCDATA
      }
      if (isRawTextContainer(tag)) {
        return TextModes.RAWTEXT
      }
    }
    return TextModes.DATA
  }
}

function hasDynamicKeyVBind(node) {
  return node.props.some(
    p =>
      p.type === NodeTypes.DIRECTIVE &&
      p.name === 'bind' &&
      (!p.arg || // v-bind="obj"
        p.arg.type !== NodeTypes.SIMPLE_EXPRESSION || // v-bind:[_ctx.foo]
        !p.arg.isStatic) // v-bind:[foo]
  )
}


function hasMultipleChildren(node) {
  // #1352 filter out potential comment nodes.
  const children = (node.children = node.children.filter(
    c =>
      c.type !== NodeTypes.COMMENT &&
      !(c.type === NodeTypes.TEXT && !c.content.trim())
  ))
  const child = children[0]
  return (
    children.length !== 1 ||
    child.type === NodeTypes.FOR ||
    (child.type === NodeTypes.IF && child.branches.some(hasMultipleChildren))
  )
}

const warnTransitionChildren = (node, context) => {
  if (
    node.type === NodeTypes.ELEMENT &&
    node.tagType === ElementTypes.COMPONENT
  ) {
    const component = context.isBuiltInComponent(node.tag)
    if (component === TRANSITION) {
      return () => {
        if (node.children.length && hasMultipleChildren(node)) {
          console.warn(`X_TRANSITION_INVALID_CHILDREN`, node)
        }
      }
    }
  }
}


const ignoreSideEffectTags = (node, context) => {
  if (
    node.type === NodeTypes.ELEMENT &&
    node.tagType === ElementTypes.ELEMENT &&
    (node.tag === 'script' || node.tag === 'style')
  ) {
    console.warn(`X_IGNORED_SIDE_EFFECT_TAG`)
    context.removeNode()
  }
}
