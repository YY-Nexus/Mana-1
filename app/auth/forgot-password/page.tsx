"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

// 定义表单验证模式
const formSchema = z.object({
  email: z.string().email({
    message: "请输入有效的电子邮箱地址",
  }),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // 表单提交处理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // 这里应该调用您的重置密码API
      // 示例: const response = await requestPasswordReset(values.email)

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 模拟成功发送重置邮件
      setSuccess(true)
    } catch (err) {
      setError("发送重置邮件失败，请稍后再试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">找回密码</CardTitle>
          <CardDescription className="text-center">请输入您的电子邮箱，我们将发送重置密码的链接</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-medium">重置链接已发送</h3>
              <p className="text-sm text-gray-600">
                我们已向您的邮箱发送了重置密码的链接，请查收并按照指引完成密码重置。
              </p>
              <Button asChild className="mt-4">
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回登录
                </Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>电子邮箱</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入您的电子邮箱" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      发送中...
                    </>
                  ) : (
                    "发送重置链接"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回登录
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
