"use client"

import type React from "react"

import { render, screen, fireEvent } from "@testing-library/react"
import { NeuroSwitch } from "@/components/neuro-switch"

// 模拟I18n上下文
jest.mock("@/contexts/i18n-context", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: "zh-CN",
    setLocale: jest.fn(),
    messages: {},
  }),
  I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe("NeuroSwitch", () => {
  it("renders correctly with default props", () => {
    render(<NeuroSwitch />)
    const switchElement = screen.getByRole("switch")
    expect(switchElement).toBeInTheDocument()
    expect(switchElement).toHaveAttribute("aria-checked", "false")
  })

  it("renders with label", () => {
    render(<NeuroSwitch label="Test Label" />)
    expect(screen.getByText("Test Label")).toBeInTheDocument()
  })

  it("toggles state when clicked", () => {
    render(<NeuroSwitch />)
    const switchElement = screen.getByRole("switch")

    // 初始状态为false
    expect(switchElement).toHaveAttribute("aria-checked", "false")

    // 点击切换状态
    fireEvent.click(switchElement)
    expect(switchElement).toHaveAttribute("aria-checked", "true")

    // 再次点击切换回初始状态
    fireEvent.click(switchElement)
    expect(switchElement).toHaveAttribute("aria-checked", "false")
  })

  it("calls onChange when toggled", () => {
    const handleChange = jest.fn()
    render(<NeuroSwitch onChange={handleChange} />)

    fireEvent.click(screen.getByRole("switch"))
    expect(handleChange).toHaveBeenCalledWith(true)

    fireEvent.click(screen.getByRole("switch"))
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it("respects disabled state", () => {
    render(<NeuroSwitch disabled />)
    const switchElement = screen.getByRole("switch")

    expect(switchElement).toHaveAttribute("aria-disabled", "true")
    expect(switchElement).toHaveClass("opacity-50")

    // 点击不应该改变状态
    fireEvent.click(switchElement)
    expect(switchElement).toHaveAttribute("aria-checked", "false")
  })

  it("handles keyboard interaction", () => {
    render(<NeuroSwitch />)
    const switchElement = screen.getByRole("switch")

    // 使用Enter键切换状态
    fireEvent.keyDown(switchElement, { key: "Enter" })
    expect(switchElement).toHaveAttribute("aria-checked", "true")

    // 使用空格键切换状态
    fireEvent.keyDown(switchElement, { key: " " })
    expect(switchElement).toHaveAttribute("aria-checked", "false")
  })
})
