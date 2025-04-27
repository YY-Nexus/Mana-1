"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FloatingActionButtons } from "@/components/floating-action-buttons"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { NeuroSwitch } from "@/components/neuro-switch"
import { NeuroInput } from "@/components/neuro-input"
import { NeuroCard } from "@/components/neuro-card"
import { useNotification } from "@/contexts/notification-context"
import { Mail, User, Lock } from "lucide-react"
import { FeedbackCollector } from "@/components/feedback/feedback-collector"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { useI18n } from "@/contexts/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useDesignTokens } from "@/contexts/design-token-context"
import Link from "next/link"

export default function DesignSystemPage() {
  const { addNotification } = useNotification()
  const { t } = useI18n()
  const { tokens, updateTokens, resetTokens } = useDesignTokens()
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const showNotification = (type: "success" | "error" | "warning" | "info") => {
    addNotification({
      type,
      title: t(`components.notifications.operation${type.charAt(0).toUpperCase() + type.slice(1)}`),
      message: t(`components.notifications.operation${type.charAt(0).toUpperCase() + type.slice(1)}Message`),
      duration: 5000,
    })
  }

  // 随机更改主色调
  const changeRandomColor = () => {
    const hue = Math.floor(Math.random() * 360)
    updateTokens({
      colors: {
        neuro: {
          ...tokens.colors.neuro,
          500: `hsl(${hue}, 70%, 50%)`,
          600: `hsl(${hue}, 70%, 45%)`,
          700: `hsl(${hue}, 70%, 40%)`,
        },
      },
    })
  }

  return (
    <div className="container mx-auto py-10 space-y-10 px-4">
      <div className="neuro-title mb-8">
        <h1 className="text-2xl font-bold text-white">{t("designSystem.title")}</h1>
        <p className="text-gray-300 mt-2">{t("designSystem.subtitle")}</p>
        <div className="absolute top-4 right-4 flex gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link href="/docs" className="neuro-btn">
          查看组件文档
        </Link>
        <div className="flex gap-2">
          <button className="neuro-btn" onClick={changeRandomColor}>
            随机主题色
          </button>
          <button className="neuro-btn" onClick={resetTokens}>
            重置主题
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">{t("designSystem.buttons.title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("designSystem.buttons.neuroPulse.title")}</CardTitle>
              <CardDescription>{t("designSystem.buttons.neuroPulse.description")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <button className="neuro-btn neuro-btn-pulse">{t("common.submit")}</button>
              <button className="neuro-btn">{t("common.confirm")}</button>
              <button className="neuro-btn error-pulse">{t("common.error")}</button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("designSystem.buttons.standard.title")}</CardTitle>
              <CardDescription>{t("designSystem.buttons.standard.description")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>{t("common.submit")}</Button>
              <Button variant="outline">{t("common.cancel")}</Button>
              <Button variant="destructive">{t("common.delete")}</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="quantum-divider"></div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">{t("designSystem.switchesInputs.title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("designSystem.switchesInputs.neuroSwitch.title")}</CardTitle>
              <CardDescription>{t("designSystem.switchesInputs.neuroSwitch.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NeuroSwitch label={t("components.neuroSwitch.enableNotifications")} />
              <NeuroSwitch label={t("components.neuroSwitch.darkMode")} initialState={true} />
              <NeuroSwitch label={t("components.neuroSwitch.disabledState")} disabled />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("designSystem.switchesInputs.neuroInput.title")}</CardTitle>
              <CardDescription>{t("designSystem.switchesInputs.neuroInput.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NeuroInput
                label={t("components.neuroInput.username")}
                placeholder={t("components.neuroInput.usernamePlaceholder")}
                icon={<User size={18} />}
                name="username"
                value={formState.username}
                onChange={handleInputChange}
              />
              <NeuroInput
                label={t("components.neuroInput.email")}
                placeholder={t("components.neuroInput.emailPlaceholder")}
                icon={<Mail size={18} />}
                type="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
              />
              <NeuroInput
                label={t("components.neuroInput.password")}
                placeholder={t("components.neuroInput.passwordPlaceholder")}
                icon={<Lock size={18} />}
                type="password"
                name="password"
                value={formState.password}
                onChange={handleInputChange}
                error={t("components.neuroInput.passwordError")}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="quantum-divider"></div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">{t("designSystem.cardsNotifications.title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("designSystem.cardsNotifications.neuroCard.title")}</CardTitle>
              <CardDescription>{t("designSystem.cardsNotifications.neuroCard.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <NeuroCard
                title={t("components.neuroCard.systemStatus")}
                subtitle={t("components.neuroCard.systemStatusSubtitle")}
                headerAction={<NeuroSwitch initialState={true} />}
              >
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("components.neuroCard.cpuUsage")}</span>
                    <span className="text-green-400">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("components.neuroCard.memoryUsage")}</span>
                    <span className="text-green-400">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("components.neuroCard.diskUsage")}</span>
                    <span className="text-yellow-400">78%</span>
                  </div>
                </div>
              </NeuroCard>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("designSystem.cardsNotifications.notifications.title")}</CardTitle>
              <CardDescription>{t("designSystem.cardsNotifications.notifications.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button className="neuro-btn" onClick={() => showNotification("success")}>
                  {t("components.notifications.successNotification")}
                </button>
                <button className="neuro-btn" onClick={() => showNotification("error")}>
                  {t("components.notifications.errorNotification")}
                </button>
                <button className="neuro-btn" onClick={() => showNotification("warning")}>
                  {t("components.notifications.warningNotification")}
                </button>
                <button className="neuro-btn" onClick={() => showNotification("info")}>
                  {t("components.notifications.infoNotification")}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="quantum-divider"></div>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">{t("designSystem.stateFeedback.title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("designSystem.stateFeedback.loading.title")}</CardTitle>
              <CardDescription>{t("designSystem.stateFeedback.loading.description")}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-8 items-center">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">{t("components.loading.quantumVortex")}</p>
                <div className="neuro-loader"></div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">{t("components.loading.buttonLoading")}</p>
                <button className="neuro-btn" disabled>
                  <span className="neuro-loader inline-block mr-2 w-4 h-4"></span>
                  {t("common.loading")}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("designSystem.stateFeedback.error.title")}</CardTitle>
              <CardDescription>{t("designSystem.stateFeedback.error.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="neuro-notification error">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{t("components.error.title")}</h4>
                    <p className="text-xs opacity-80 mt-1">{t("components.error.message")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 浮动按钮组件 */}
      <FloatingActionButtons />

      {/* 用户反馈收集组件 */}
      <FeedbackCollector />

      {/* 性能监控工具 */}
      <PerformanceMonitor showInProduction={true} />
    </div>
  )
}
