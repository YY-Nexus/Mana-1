// 设计令牌系统 - 定义所有可配置的设计变量

export type ColorToken = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export type SpacingToken = {
  0: string
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  8: string
  10: string
  12: string
  16: string
  20: string
  24: string
  32: string
  40: string
  48: string
  56: string
  64: string
}

export type RadiusToken = {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export type ShadowToken = {
  sm: string
  md: string
  lg: string
  xl: string
  inner: string
  none: string
}

export type FontSizeToken = {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  "2xl": string
  "3xl": string
  "4xl": string
  "5xl": string
  "6xl": string
}

export type FontWeightToken = {
  thin: string
  extralight: string
  light: string
  normal: string
  medium: string
  semibold: string
  bold: string
  extrabold: string
  black: string
}

export type LineHeightToken = {
  none: string
  tight: string
  snug: string
  normal: string
  relaxed: string
  loose: string
}

export type AnimationToken = {
  fast: string
  normal: string
  slow: string
  verySlow: string
}

export type EasingToken = {
  linear: string
  in: string
  out: string
  inOut: string
}

export type DesignTokens = {
  colors: {
    neuro: ColorToken
    primary: ColorToken
    secondary: ColorToken
    success: ColorToken
    warning: ColorToken
    error: ColorToken
    info: ColorToken
    gray: ColorToken
  }
  spacing: SpacingToken
  radius: RadiusToken
  shadows: ShadowToken
  typography: {
    fontSize: FontSizeToken
    fontWeight: FontWeightToken
    lineHeight: LineHeightToken
  }
  animation: {
    duration: AnimationToken
    easing: EasingToken
  }
}

// 默认设计令牌
export const defaultTokens: DesignTokens = {
  colors: {
    neuro: {
      50: "#E6EDF5",
      100: "#C2D1E5",
      200: "#9BB3D3",
      300: "#7495C1",
      400: "#5A7FB3",
      500: "#3F69A5",
      600: "#39619D",
      700: "#315693",
      800: "#294C8A",
      900: "#1A3A5E",
    },
    primary: {
      50: "#E6F0FF",
      100: "#BDDAFF",
      200: "#94C2FF",
      300: "#6BABFF",
      400: "#4D97FF",
      500: "#2E83FF",
      600: "#2A7BFF",
      700: "#2570FF",
      800: "#2166FF",
      900: "#1853FF",
    },
    secondary: {
      50: "#EEE6FF",
      100: "#D4C2FF",
      200: "#B89AFF",
      300: "#9C72FF",
      400: "#8654FF",
      500: "#7036FF",
      600: "#6830FF",
      700: "#5D29FF",
      800: "#5322FF",
      900: "#4016FF",
    },
    success: {
      50: "#E6F9ED",
      100: "#C2F0D3",
      200: "#9AE7B7",
      300: "#72DD9B",
      400: "#54D586",
      500: "#36CD71",
      600: "#30C869",
      700: "#29C15E",
      800: "#22BA54",
      900: "#16AE42",
    },
    warning: {
      50: "#FFF8E6",
      100: "#FFEDC2",
      200: "#FFE199",
      300: "#FFD570",
      400: "#FFCB52",
      500: "#FFC133",
      600: "#FFBB2E",
      700: "#FFB327",
      800: "#FFAC20",
      900: "#FF9F13",
    },
    error: {
      50: "#FEEBEA",
      100: "#FCCECB",
      200: "#FAADA9",
      300: "#F88C87",
      400: "#F6746D",
      500: "#F45C53",
      600: "#F3544C",
      700: "#F14A42",
      800: "#EF4139",
      900: "#EC3029",
    },
    info: {
      50: "#E6F4FF",
      100: "#BFE3FF",
      200: "#99D1FF",
      300: "#73BFFF",
      400: "#59B0FF",
      500: "#40A1FF",
      600: "#3A99FF",
      700: "#328FFF",
      800: "#2A85FF",
      900: "#1C74FF",
    },
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
  },
  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    40: "10rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
  },
  radius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    none: "none",
  },
  typography: {
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
  },
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
      verySlow: "1000ms",
    },
    easing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
}

// 将设计令牌转换为CSS变量
export function tokensToCssVariables(tokens: DesignTokens): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // 颜色
  Object.entries(tokens.colors).forEach(([colorName, colorValues]) => {
    Object.entries(colorValues).forEach(([shade, value]) => {
      cssVars[`--color-${colorName}-${shade}`] = value
    })
  })

  // 间距
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value
  })

  // 圆角
  Object.entries(tokens.radius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value
  })

  // 阴影
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value
  })

  // 字体大小
  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value
  })

  // 字体粗细
  Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
    cssVars[`--font-weight-${key}`] = value
  })

  // 行高
  Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
    cssVars[`--line-height-${key}`] = value
  })

  // 动画持续时间
  Object.entries(tokens.animation.duration).forEach(([key, value]) => {
    cssVars[`--duration-${key}`] = value
  })

  // 动画缓动函数
  Object.entries(tokens.animation.easing).forEach(([key, value]) => {
    cssVars[`--easing-${key}`] = value
  })

  return cssVars
}

// 生成CSS变量字符串
export function generateCssVariables(tokens: DesignTokens): string {
  const cssVars = tokensToCssVariables(tokens)
  return Object.entries(cssVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n  ")
}
