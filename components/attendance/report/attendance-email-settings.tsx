"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, Mail, RefreshCw, Send, Settings, TestTube } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { testEmailConnection, sendTestEmail } from "@/lib/email-service"

export function AttendanceEmailSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [connectionMessage, setConnectionMessage] = useState("")

  const [emailSettings, setEmailSettings] = useState({
    host: process.env.EMAIL_HOST || "",
    port: process.env.EMAIL_PORT || "587",
    secure: process.env.EMAIL_SECURE === "true",
    username: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    fromEmail: process.env.EMAIL_FROM || "",
    fromName: "言语『启智』运维管理中心",
    enableSSL: process.env.EMAIL_SECURE === "true",
    enableTemplates: true,
    includeReportSummary: true,
    includeLogo: true,
    signatureText: "此邮件由系统自动发送，请勿直接回复。如有问题，请联系系统管理员。",
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // 在实际应用中，这里应该调用API保存设置
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "设置已保存",
        description: "邮件服务设置已成功保存。",
      })
    } catch (error) {
      console.error("保存设置失败:", error)
      toast({
        title: "保存失败",
        description: "保存邮件服务设置时发生错误。",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")
    setConnectionMessage("")

    try {
      const result = await testEmailConnection()

      if (result.success) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
      }

      setConnectionMessage(result.message)
    } catch (error) {
      setConnectionStatus("error")
      setConnectionMessage(error instanceof Error ? error.message : "测试连接时发生未知错误")
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "请输入测试邮箱",
        description: "请输入接收测试邮件的邮箱地址。",
        variant: "destructive",
      })
      return
    }

    setIsSendingTest(true)

    try {
      const result = await sendTestEmail(testEmail)

      if (result.success) {
        toast({
          title: "测试邮件已发送",
          description: `测试邮件已成功发送至 ${testEmail}。`,
        })
      } else {
        toast({
          title: "发送失败",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "发送测试邮件时发生未知错误",
        variant: "destructive",
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>邮件服务设置</CardTitle>
            <CardDescription>配置考勤报表邮件发送服务</CardDescription>
          </div>
          <Mail className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">基本设置</TabsTrigger>
            <TabsTrigger value="templates">邮件模板</TabsTrigger>
            <TabsTrigger value="test">连接测试</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">SMTP服务器</Label>
                <Input
                  id="host"
                  value={emailSettings.host}
                  onChange={(e) => setEmailSettings({ ...emailSettings, host: e.target.value })}
                  placeholder="例如: smtp.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">端口</Label>
                <Input
                  id="port"
                  value={emailSettings.port}
                  onChange={(e) => setEmailSettings({ ...emailSettings, port: e.target.value })}
                  placeholder="例如: 587"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={emailSettings.username}
                  onChange={(e) => setEmailSettings({ ...emailSettings, username: e.target.value })}
                  placeholder="邮箱账号"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={emailSettings.password}
                  onChange={(e) => setEmailSettings({ ...emailSettings, password: e.target.value })}
                  placeholder="邮箱密码或应用密码"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmail">发件人邮箱</Label>
                <Input
                  id="fromEmail"
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                  placeholder="例如: noreply@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName">发件人名称</Label>
                <Input
                  id="fromName"
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  placeholder="例如: 言语『启智』运维管理中心"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableSSL">启用SSL/TLS</Label>
                  <p className="text-sm text-muted-foreground">使用安全连接发送邮件</p>
                </div>
                <Switch
                  id="enableSSL"
                  checked={emailSettings.enableSSL}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableSSL: checked })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableTemplates">启用HTML模板</Label>
                  <p className="text-sm text-muted-foreground">使用HTML格式的邮件模板</p>
                </div>
                <Switch
                  id="enableTemplates"
                  checked={emailSettings.enableTemplates}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableTemplates: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeReportSummary">包含报表摘要</Label>
                  <p className="text-sm text-muted-foreground">在邮件正文中包含报表摘要信息</p>
                </div>
                <Switch
                  id="includeReportSummary"
                  checked={emailSettings.includeReportSummary}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, includeReportSummary: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeLogo">包含系统Logo</Label>
                  <p className="text-sm text-muted-foreground">在邮件中显示系统Logo</p>
                </div>
                <Switch
                  id="includeLogo"
                  checked={emailSettings.includeLogo}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, includeLogo: checked })}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="signatureText">邮件签名</Label>
              <Input
                id="signatureText"
                value={emailSettings.signatureText}
                onChange={(e) => setEmailSettings({ ...emailSettings, signatureText: e.target.value })}
                placeholder="邮件底部签名文本"
              />
            </div>

            <div className="p-4 bg-muted rounded-md">
              <h3 className="text-sm font-medium mb-2">邮件预览</h3>
              <div className="bg-card p-4 rounded-md border text-sm">
                <p className="font-medium">考勤报表通知</p>
                <p className="text-muted-foreground text-xs">2023年4月21日</p>
                <div className="my-2 p-2 bg-muted rounded-md">
                  <p>
                    <strong>报表类型:</strong> 每周考勤报表
                  </p>
                  <p>
                    <strong>生成日期:</strong> 2023年4月21日
                  </p>
                </div>
                <p>尊敬的管理员：</p>
                <p>您的考勤报表已生成完成，请查收附件。</p>
                {emailSettings.includeReportSummary && (
                  <div className="my-2">
                    <p className="font-medium">报表摘要</p>
                    <div className="text-xs">
                      <p>员工总数: 50</p>
                      <p>出勤率: 92.5%</p>
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">{emailSettings.signatureText}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="gap-2"
                >
                  {isTestingConnection ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      测试中...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4" />
                      测试连接
                    </>
                  )}
                </Button>

                <span className="text-sm text-muted-foreground">测试SMTP服务器连接是否正常</span>
              </div>

              {connectionStatus !== "idle" && (
                <Alert variant={connectionStatus === "success" ? "default" : "destructive"}>
                  {connectionStatus === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{connectionStatus === "success" ? "连接成功" : "连接失败"}</AlertTitle>
                  <AlertDescription>{connectionMessage}</AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="space-y-4">
                <Label htmlFor="testEmail">发送测试邮件</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="testEmail"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="输入接收测试邮件的邮箱"
                    className="flex-1"
                  />
                  <Button onClick={handleSendTestEmail} disabled={isSendingTest || !testEmail} className="gap-2">
                    {isSendingTest ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        发送中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        发送测试
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">发送一封测试邮件以验证配置是否正确</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" onClick={() => setActiveTab("general")}>
            <Settings className="h-4 w-4 mr-2" />
            返回设置
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              "保存设置"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
