"use client"

import type React from "react"
import type { DesignTokens } from "@/lib/design-tokens"

import { createContext, useContext, useEffect, useState } from "react"
import { defaultTokens, tokensToCssVariables } from "@/lib/design-tokens"

interface DesignTokenContextType {
  tokens: DesignTokens
  updateTokens: (newTokens: Partial<DesignTokens>) => void
  resetTokens: () => void
}

const DesignTokenContext = createContext<DesignTokenContextType>({
  tokens: defaultTokens,
  updateTokens: () => {},
  resetTokens: () => {},
})

export function DesignTokenProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<DesignTokens>(defaultTokens)

  // 深度合并对象
  const deepMerge = (target: any, source: any): any => {
    const output = { ...target }

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] })
          } else {
            output[key] = deepMerge(target[key], source[key])
          }
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }

    return output
  }

  const isObject = (item: any): boolean => {
    return item && typeof item === "object" && !Array.isArray(item)
  }

  const updateTokens = (newTokens: Partial<DesignTokens>) => {
    setTokens((prevTokens) => deepMerge(prevTokens, newTokens))
  }

  const resetTokens = () => {
    setTokens(defaultTokens)
  }

  // 应用CSS变量到文档根元素
  useEffect(() => {
    const cssVars = tokensToCssVariables(tokens)
    const root = document.documentElement

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [tokens])

  return (
    <DesignTokenContext.Provider value={{ tokens, updateTokens, resetTokens }}>{children}</DesignTokenContext.Provider>
  )
}

export const useDesignTokens = () => {
  const context = useContext(DesignTokenContext)
  if (context === undefined) {
    throw new Error("useDesignTokens must be used within a DesignTokenProvider")
  }
  return context
}
