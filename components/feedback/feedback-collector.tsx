"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import { NeuroInput } from "@/components/neuro-input"
import { useNotification } from "@/contexts/notification-context"

export function FeedbackCollector() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addNotification } = useNotification()

  const toggleFeedback = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedback || rating === null) {
      addNotification({
        type: "warning",
        title: "提交不完整",
        message: "请填写反馈内容并选择评分",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 这里可以添加实际的API调用来提交反馈
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API调用

      addNotification({
        type: "success",
        title: "反馈已提交",
        message: "感谢您的反馈，我们将认真考虑您的建议",
      })

      setFeedback("")
      setRating(null)
      setIsOpen(false)
    } catch (error) {
      addNotification({
        type: "error",
        title: "提交失败",
        message: "反馈提交失败，请稍后再试",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button onClick={toggleFeedback} className="fixed bottom-24 right-6 z-40 float-btn" aria-label="提供反馈">
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="neuro-card max-w-md w-full animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">您的反馈很重要</h3>
              <button onClick={toggleFeedback} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">您对系统的评分</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        rating !== null && rating >= star
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              <NeuroInput
                label="您的反馈或建议"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="请告诉我们您的想法..."
                as="textarea"
                rows={4}
              />

              <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting} className="neuro-btn">
                  {isSubmitting ? (
                    <>
                      <span className="neuro-loader inline-block mr-2 w-4 h-4"></span>
                      提交中...
                    </>
                  ) : (
                    "提交反馈"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
