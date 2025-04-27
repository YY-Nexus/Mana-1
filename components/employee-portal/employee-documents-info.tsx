"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, File, Search, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// 模拟文档数据
const DOCUMENTS_DATA = [
  {
    id: "DOC-2023-001",
    name: "劳动合同.pdf",
    category: "合同",
    uploadDate: "2023-01-15",
    size: "2.5 MB",
    status: "active",
  },
  {
    id: "DOC-2023-002",
    name: "保密协议.pdf",
    category: "合同",
    uploadDate: "2023-01-15",
    size: "1.2 MB",
    status: "active",
  },
  {
    id: "DOC-2023-003",
    name: "入职材料.zip",
    category: "入职",
    uploadDate: "2023-01-15",
    size: "5.8 MB",
    status: "active",
  },
  {
    id: "DOC-2023-004",
    name: "社保卡复印件.jpg",
    category: "证件",
    uploadDate: "2023-01-20",
    size: "1.5 MB",
    status: "active",
  },
  {
    id: "DOC-2023-005",
    name: "身份证复印件.jpg",
    category: "证件",
    uploadDate: "2023-01-20",
    size: "1.3 MB",
    status: "active",
  },
  {
    id: "DOC-2023-006",
    name: "绩效考核表-2023Q1.xlsx",
    category: "绩效",
    uploadDate: "2023-04-10",
    size: "0.8 MB",
    status: "active",
  },
]

// 模拟模板数据
const TEMPLATES_DATA = [
  {
    id: "TPL-001",
    name: "请假申请表.docx",
    category: "请假",
    updateDate: "2023-01-01",
    size: "0.5 MB",
  },
  {
    id: "TPL-002",
    name: "报销申请表.xlsx",
    category: "财务",
    updateDate: "2023-01-01",
    size: "0.6 MB",
  },
  {
    id: "TPL-003",
    name: "出差申请表.docx",
    category: "出差",
    updateDate: "2023-01-01",
    size: "0.5 MB",
  },
  {
    id: "TPL-004",
    name: "员工手册.pdf",
    category: "规章制度",
    updateDate: "2023-01-01",
    size: "3.2 MB",
  },
  {
    id: "TPL-005",
    name: "绩效自评表.docx",
    category: "绩效",
    updateDate: "2023-01-01",
    size: "0.7 MB",
  },
]

export function EmployeeDocumentsInfo() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // 过滤文档
  const filteredDocuments = DOCUMENTS_DATA.filter((doc) => {
    // 根据分类过滤
    if (category !== "all" && doc.category !== category) {
      return false
    }

    // 根据搜索词过滤
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        doc.name.toLowerCase().includes(searchLower) ||
        doc.category.toLowerCase().includes(searchLower) ||
        doc.id.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // 过滤模板
  const filteredTemplates = TEMPLATES_DATA.filter((template) => {
    // 根据分类过滤
    if (category !== "all" && template.category !== category) {
      return false
    }

    // 根据搜索词过滤
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.category.toLowerCase().includes(searchLower) ||
        template.id.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // 处理文件下载
  const handleDownload = (id: string, name: string) => {
    toast({
      title: "文件下载",
      description: `正在下载 ${name}`,
    })
  }

  // 处理文件上传
  const handleUpload = () => {
    toast({
      title: "文件上传",
      description: "文件已成功上传",
    })
    setUploadDialogOpen(false)
  }

  // 获取文件图标
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <File className="h-4 w-4 text-red-500" />
      case "doc":
      case "docx":
        return <File className="h-4 w-4 text-blue-500" />
      case "xls":
      case "xlsx":
        return <File className="h-4 w-4 text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="h-4 w-4 text-purple-500" />
      case "zip":
      case "rar":
        return <File className="h-4 w-4 text-amber-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">文档管理</h2>
          <p className="text-muted-foreground">查看和管理您的文档</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                上传文档
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>上传文档</DialogTitle>
                <DialogDescription>上传新文档到系统中。</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file-name">文档名称</Label>
                  <Input id="file-name" placeholder="请输入文档名称" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file-category">文档分类</Label>
                  <Select>
                    <SelectTrigger id="file-category">
                      <SelectValue placeholder="选择文档分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">合同</SelectItem>
                      <SelectItem value="certificate">证件</SelectItem>
                      <SelectItem value="onboarding">入职</SelectItem>
                      <SelectItem value="performance">绩效</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file-description">文档描述</Label>
                  <Textarea id="file-description" placeholder="请输入文档描述" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file-upload">选择文件</Label>
                  <Input id="file-upload" type="file" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleUpload}>上传</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索文档..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            <SelectItem value="合同">合同</SelectItem>
            <SelectItem value="证件">证件</SelectItem>
            <SelectItem value="入职">入职</SelectItem>
            <SelectItem value="绩效">绩效</SelectItem>
            <SelectItem value="请假">请假</SelectItem>
            <SelectItem value="财务">财务</SelectItem>
            <SelectItem value="出差">出差</SelectItem>
            <SelectItem value="规章制度">规章制度</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="my-documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-documents">我的文档</TabsTrigger>
          <TabsTrigger value="templates">文档模板</TabsTrigger>
        </TabsList>

        <TabsContent value="my-documents">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>文档名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>上传日期</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        暂无文档
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFileIcon(doc.name)}
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            有效
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">查看</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.id, doc.name)}>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">下载</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>模板名称</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>更新日期</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        暂无模板
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFileIcon(template.name)}
                            <span className="font-medium">{template.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell>{template.updateDate}</TableCell>
                        <TableCell>{template.size}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">查看</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(template.id, template.name)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">下载</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
