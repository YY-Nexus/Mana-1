"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NeuroSwitch } from "@/components/neuro-switch"
import { NeuroInput } from "@/components/neuro-input"
import { NeuroCard } from "@/components/neuro-card"
import { NeuroNotification } from "@/components/neuro-notification"
import { useI18n } from "@/contexts/i18n-context"
import { Mail, User, Lock, Code, FileText, Layers, Palette } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function DocsPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("overview")

  // 代码示例
  const codeExamples = {
    neuroSwitch: `import { NeuroSwitch } from "@/components/neuro-switch"

// 基本用法
<NeuroSwitch />

// 带标签
<NeuroSwitch label="启用通知" />

// 初始状态为开启
<NeuroSwitch initialState={true} />

// 禁用状态
<NeuroSwitch disabled />

// 带回调函数
<NeuroSwitch onChange={(isActive) => console.log("开关状态:", isActive)} />`,

    neuroInput: `import { NeuroInput } from "@/components/neuro-input"
import { Mail } from 'lucide-react'

// 基本用法
<NeuroInput placeholder="请输入..." />

// 带标签
<NeuroInput label="用户名" placeholder="请输入用户名" />

// 带图标
<NeuroInput 
  label="电子邮箱" 
  placeholder="请输入电子邮箱" 
  icon={<Mail size={18} />} 
  type="email" 
/>

// 错误状态
<NeuroInput 
  label="密码" 
  placeholder="请输入密码" 
  type="password" 
  error="密码至少需要8个字符" 
/>

// 帮助文本
<NeuroInput 
  label="用户名" 
  placeholder="请输入用户名" 
  helperText="用户名将作为您的唯一标识" 
/>`,

    neuroCard: `import { NeuroCard } from "@/components/neuro-card"
import { NeuroSwitch } from "@/components/neuro-switch"

// 基本用法
<NeuroCard>
  <p>卡片内容</p>
</NeuroCard>

// 带标题和副标题
<NeuroCard 
  title="系统状态" 
  subtitle="所有服务运行正常"
>
  <p>卡片内容</p>
</NeuroCard>

// 带头部操作
<NeuroCard 
  title="系统状态" 
  subtitle="所有服务运行正常"
  headerAction={<NeuroSwitch initialState={true} />}
>
  <p>卡片内容</p>
</NeuroCard>

// 自定义类名
<NeuroCard className="max-w-md mx-auto">
  <p>卡片内容</p>
</NeuroCard>`,

    neuroNotification: `import { NeuroNotification } from "@/components/neuro-notification"

// 成功通知
<NeuroNotification 
  type="success"
  title="操作成功"
  message="您的操作已成功完成！"
/>

// 错误通知
<NeuroNotification 
  type="error"
  title="操作失败"
  message="操作过程中发生错误，请重试。"
/>

// 警告通知
<NeuroNotification 
  type="warning"
  title="注意"
  message="请注意，此操作可能有风险。"
/>

// 信息通知
<NeuroNotification 
  type="info"
  title="提示信息"
  message="这是一条提示信息，仅供参考。"
/>

// 自定义持续时间
<NeuroNotification 
  type="success"
  title="操作成功"
  message="您的操作已成功完成！"
  duration={3000} // 3秒后自动关闭
/>

// 关闭回调
<NeuroNotification 
  type="info"
  title="提示信息"
  message="这是一条提示信息，仅供参考。"
  onClose={() => console.log("通知已关闭")}
/>`,
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="neuro-title mb-8">
        <h1 className="text-2xl font-bold text-white">神经设计系统文档</h1>
        <p className="text-gray-300 mt-2">详细的组件使用指南和示例</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText size={16} />
            <span>概述</span>
          </TabsTrigger>
          <TabsTrigger value="neuroSwitch" className="flex items-center gap-2">
            <Layers size={16} />
            <span>神经开关</span>
          </TabsTrigger>
          <TabsTrigger value="neuroInput" className="flex items-center gap-2">
            <User size={16} />
            <span>神经输入框</span>
          </TabsTrigger>
          <TabsTrigger value="neuroCard" className="flex items-center gap-2">
            <Palette size={16} />
            <span>神经卡片</span>
          </TabsTrigger>
          <TabsTrigger value="neuroNotification" className="flex items-center gap-2">
            <Code size={16} />
            <span>神经通知</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>神经设计系统简介</CardTitle>
              <CardDescription>一套现代化、具有立体感的UI组件库</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>神经设计系统是一套专为现代Web应用设计的UI组件库，具有以下特点：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>立体感强烈的视觉效果，提供沉浸式用户体验</li>
                <li>完善的无障碍支持，确保所有用户都能顺畅使用</li>
                <li>响应式设计，在各种设备上都能完美展示</li>
                <li>国际化支持，轻松适应不同语言环境</li>
                <li>主题切换功能，支持亮色和暗色模式</li>
                <li>设计令牌系统，使主题和样式更加可配置和一致</li>
              </ul>
              <p className="mt-4">
                本文档提供了神经设计系统中各组件的详细使用指南和示例，帮助开发者快速上手并充分利用这套组件库的强大功能。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>快速开始</CardTitle>
              <CardDescription>如何在项目中使用神经设计系统</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">安装</h3>
              <SyntaxHighlighter language="bash" style={vscDarkPlus}>
                {"npm install @neuro-design/react"}
              </SyntaxHighlighter>

              <h3 className="text-lg font-medium mt-4">设置提供者</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
                {`import { ThemeProvider } from "@/contexts/theme-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { DesignTokenProvider } from "@/contexts/design-token-context"

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <DesignTokenProvider>
          {children}
        </DesignTokenProvider>
      </I18nProvider>
    </ThemeProvider>
  )
`}
              </SyntaxHighlighter>

              <h3 className="text-lg font-medium mt-4">使用组件</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
                {`import { NeuroSwitch, NeuroInput, NeuroCard } from "@neuro-design/react"

export default function MyComponent() {
  return (
    <div>
      <NeuroSwitch label="启用通知" />
      <NeuroInput label="用户名" placeholder="请输入用户名" />
      <NeuroCard title="系统状态">
        <p>所有服务运行正常</p>
      </NeuroCard>
    </div>
  )
`}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="neuroSwitch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>神经开关 (NeuroSwitch)</CardTitle>
              <CardDescription>具有立体感的开关控件</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">示例</h3>
              <div className="flex flex-col gap-4 p-4 border rounded-md">
                <NeuroSwitch label="启用通知" />
                <NeuroSwitch label="深色模式" initialState={true} />
                <NeuroSwitch label="禁用状态" disabled />
              </div>

              <h3 className="text-lg font-medium mt-4">用法</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
                {codeExamples.neuroSwitch}
              </SyntaxHighlighter>

              <h3 className="text-lg font-medium mt-4">属性</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border p-2 text-left">属性</th>
                      <th className="border p-2 text-left">类型</th>
                      <th className="border p-2 text-left">默认值</th>
                      <th className="border p-2 text-left">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">initialState</td>
                      <td className="border p-2">boolean</td>
                      <td className="border p-2">false</td>
                      <td className="border p-2">开关的初始状态</td>
                    </tr>
                    <tr>
                      <td className="border p-2">onChange</td>
                      <td className="border p-2">(isActive: boolean) =&gt; void</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">状态变化时的回调函数</td>
                    </tr>
                    <tr>
                      <td className="border p-2">label</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">开关的标签文本</td>
                    </tr>
                    <tr>
                      <td className="border p-2">disabled</td>
                      <td className="border p-2">boolean</td>
                      <td className="border p-2">false</td>
                      <td className="border p-2">是否禁用开关</td>
                    </tr>
                    <tr>
                      <td className="border p-2">ariaLabel</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">用于无障碍的aria-label属性</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium mt-4">无障碍</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>使用适当的ARIA角色和属性（role="switch", aria-checked, aria-disabled）</li>
                <li>支持键盘导航（Tab键聚焦，Enter和空格键切换状态）</li>
                <li>标签与开关关联，点击标签也可以切换状态</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="neuroInput" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>神经输入框 (NeuroInput)</CardTitle>
              <CardDescription>具有立体感的输入控件</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">示例</h3>
              <div className="flex flex-col gap-4 p-4 border rounded-md">
                <NeuroInput label="用户名" placeholder="请输入用户名" icon={<User size={18} />} />
                <NeuroInput
                  label="电子邮箱"
                  placeholder="请输入电子邮箱"
                  icon={<Mail size={18} />}
                  type="email"
                  helperText="我们不会公开您的邮箱地址"
                />
                <NeuroInput
                  label="密码"
                  placeholder="请输入密码"
                  icon={<Lock size={18} />}
                  type="password"
                  error="密码至少需要8个字符"
                />
              </div>

              <h3 className="text-lg font-medium mt-4">用法</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
                {codeExamples.neuroInput}
              </SyntaxHighlighter>

              <h3 className="text-lg font-medium mt-4">属性</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border p-2 text-left">属性</th>
                      <th className="border p-2 text-left">类型</th>
                      <th className="border p-2 text-left">默认值</th>
                      <th className="border p-2 text-left">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">label</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">输入框的标签文本</td>
                    </tr>
                    <tr>
                      <td className="border p-2">error</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">错误信息</td>
                    </tr>
                    <tr>
                      <td className="border p-2">icon</td>
                      <td className="border p-2">React.ReactNode</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">输入框左侧的图标</td>
                    </tr>
                    <tr>
                      <td className="border p-2">helperText</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">帮助文本</td>
                    </tr>
                    <tr>
                      <td className="border p-2">className</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">""</td>
                      <td className="border p-2">自定义类名</td>
                    </tr>
                    <tr>
                      <td className="border p-2">...props</td>
                      <td className="border p-2">InputHTMLAttributes</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">其他HTML input属性</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium mt-4">无障碍</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>标签与输入框关联（使用htmlFor和id）</li>
                <li>错误信息使用aria-invalid和aria-describedby属性</li>
                <li>帮助文本使用aria-describedby属性</li>
                <li>错误信息使用role="alert"属性，确保屏幕阅读器能够及时通知用户</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="neuroCard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>神经卡片 (NeuroCard)</CardTitle>
              <CardDescription>具有立体感的信息卡片</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">示例</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                <NeuroCard title="基本卡片" subtitle="简单的卡片示例">
                  <p className="text-sm text-gray-300">这是一个基本的神经卡片示例，展示了标题和副标题。</p>
                </NeuroCard>
                <NeuroCard
                  title="带操作的卡片"
                  subtitle="包含头部操作按钮"
                  headerAction={<NeuroSwitch initialState={true} />}
                >
                  <p className="text-sm text-gray-300">这个卡片在右上角包含了一个开关控件作为操作按钮。</p>
                </NeuroCard>
              </div>

              <h3 className="text-lg font-medium mt-4">用法</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
                {codeExamples.neuroCard}
              </SyntaxHighlighter>

              <h3 className="text-lg font-medium mt-4">属性</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border p-2 text-left">属性</th>
                      <th className="border p-2 text-left">类型</th>
                      <th className="border p-2 text-left">默认值</th>
                      <th className="border p-2 text-left">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">children</td>
                      <td className="border p-2">ReactNode</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">卡片内容</td>
                    </tr>
                    <tr>
                      <td className="border p-2">title</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">卡片标题</td>
                    </tr>
                    <tr>
                      <td className="border p-2">subtitle</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">卡片副标题</td>
                    </tr>
                    <tr>
                      <td className="border p-2">className</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">""</td>
                      <td className="border p-2">自定义类名</td>
                    </tr>
                    <tr>
                      <td className="border p-2">headerAction</td>
                      <td className="border p-2">ReactNode</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">卡片头部右侧的操作元素</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="neuroNotification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>神经通知 (NeuroNotification)</CardTitle>
              <CardDescription>用于显示各种类型的通知提示</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">示例</h3>
              <div className="flex flex-col gap-4 p-4 border rounded-md">
                <NeuroNotification type="success" title="操作成功" message="您的操作已成功完成！" />
                <NeuroNotification type="error" title="操作失败" message="操作过程中发生错误，请重试。" />
                <NeuroNotification type="warning" title="注意" message="请注意，此操作可能有风险。" />
                <NeuroNotification type="info" title="提示信息" message="这是一条提示信息，仅供参考。" />
              </div>

              <h3 className="text-lg font-medium mt-4">用法</h3>
              <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
                {codeExamples.neuroNotification}
              </SyntaxHighlighter>

              <h3 className="text-lg font-medium mt-4">属性</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border p-2 text-left">属性</th>
                      <th className="border p-2 text-left">类型</th>
                      <th className="border p-2 text-left">默认值</th>
                      <th className="border p-2 text-left">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">type</td>
                      <td className="border p-2">"success" | "error" | "warning" | "info"</td>
                      <td className="border p-2">"info"</td>
                      <td className="border p-2">通知类型</td>
                    </tr>
                    <tr>
                      <td className="border p-2">title</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">通知标题</td>
                    </tr>
                    <tr>
                      <td className="border p-2">message</td>
                      <td className="border p-2">string</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">通知内容</td>
                    </tr>
                    <tr>
                      <td className="border p-2">duration</td>
                      <td className="border p-2">number</td>
                      <td className="border p-2">5000</td>
                      <td className="border p-2">通知显示时间（毫秒），设为0则不自动关闭</td>
                    </tr>
                    <tr>
                      <td className="border p-2">onClose</td>
                      <td className="border p-2">() =&gt; void</td>
                      <td className="border p-2">-</td>
                      <td className="border p-2">通知关闭时的回调函数</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium mt-4">无障碍</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>使用role="alert"属性，确保屏幕阅读器能够及时通知用户</li>
                <li>使用aria-live="assertive"属性，使通知内容被立即朗读</li>
                <li>支持键盘导航（Tab键聚焦，Escape键关闭通知）</li>
                <li>关闭按钮有适当的aria-label属性</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
