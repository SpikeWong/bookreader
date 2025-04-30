# English Book Reader Project

[中文说明在下方 / Chinese instructions below](#chinese-version)

## Project Overview
English Book Reader is a web application that allows users to read English books, look up word definitions, save favorite passages, and manage a personal bookshelf. The application supports both frontend and backend components to provide a seamless reading experience.

## Table of Contents
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Configuration Guide](#configuration-guide)
  - [Environment Variables](#environment-variables)
  - [Database Configuration](#database-configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [TODO List](#todo-list)

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- pnpm (v7 or later)
- MongoDB (v4.4 or later)
- Git

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/SpikeWong/bookreader.git
   cd bookreader
   ```

2. Install dependencies:
   ```bash
   cd react_template
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. The application will be available at `http://localhost:5173` (or the port shown in your console).

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd book-reader-backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables by creating a `.env` file (see [Environment Variables](#environment-variables) section).

4. Start the backend server:
   ```bash
   pnpm start
   ```

5. The backend API will be available at `http://localhost:5000` (or your configured port).

## Configuration Guide

### Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/bookreader
PORT=5000
JWT_SECRET=your_jwt_secret_key
BOOK_UPLOAD_PATH=./uploads
```

### Database Configuration
The application uses MongoDB as its database. Make sure MongoDB is running on your system before starting the backend server.

Default database configuration:
- Database Name: bookreader
- Connection URL: mongodb://localhost:27017/bookreader

## Project Structure
```
├── book-reader-backend/     # Backend server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Server entry point
│   ├── uploads/             # Book file uploads
│   └── package.json         # Backend dependencies
│
├── react_template/          # Frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get authentication token

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Upload a new book
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete a book

### Bookshelf
- `GET /api/bookshelf` - Get user's bookshelf
- `POST /api/bookshelf/:bookId` - Add book to bookshelf
- `DELETE /api/bookshelf/:bookId` - Remove book from bookshelf

## TODO List

### Priority Features
- [ ] Implement word lookup dictionary integration
- [ ] Add reading progress tracking
- [ ] Create user profile page
- [ ] Support for different book formats (EPUB, MOBI, etc.)

### Improvements
- [ ] Add dark mode support
- [ ] Implement reading statistics
- [ ] Add book recommendations
- [ ] Improve mobile responsiveness

---

# Chinese Version

## 项目概述
英文书籍阅读器是一个网页应用程序，允许用户阅读英文书籍，查询单词定义，保存喜爱的段落，并管理个人书架。该应用程序支持前端和后端组件，以提供无缝的阅读体验。

## 目录
- [安装说明](#安装说明)
  - [前提条件](#前提条件)
  - [前端安装](#前端安装)
  - [后端安装](#后端安装)
- [配置指南](#配置指南)
  - [环境变量](#环境变量)
  - [数据库配置](#数据库配置)
- [项目结构](#项目结构)
- [API文档](#api文档)
- [待办事项](#待办事项)

## 安装说明

### 前提条件
- Node.js (v16或更新版本)
- pnpm (v7或更新版本)
- MongoDB (v4.4或更新版本)
- Git

### 前端安装
1. 克隆仓库：
   ```bash
   git clone https://github.com/SpikeWong/bookreader.git
   cd bookreader
   ```

2. 安装依赖：
   ```bash
   cd react_template
   pnpm install
   ```

3. 启动开发服务器：
   ```bash
   pnpm run dev
   ```

4. 应用程序将在 `http://localhost:5173`（或控制台中显示的端口）可用。

### 后端安装
1. 导航到后端目录：
   ```bash
   cd book-reader-backend
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 通过创建 `.env` 文件配置环境变量（参见[环境变量](#环境变量)部分）。

4. 启动后端服务器：
   ```bash
   pnpm start
   ```

5. 后端API将在 `http://localhost:5000`（或您配置的端口）可用。

## 配置指南

### 环境变量
在后端目录中创建一个 `.env` 文件，包含以下变量：
```
MONGODB_URI=mongodb://localhost:27017/bookreader
PORT=5000
JWT_SECRET=your_jwt_secret_key
BOOK_UPLOAD_PATH=./uploads
```

### 数据库配置
该应用程序使用MongoDB作为其数据库。在启动后端服务器之前，确保MongoDB正在您的系统上运行。

默认数据库配置：
- 数据库名称：bookreader
- 连接URL：mongodb://localhost:27017/bookreader

## 项目结构
```
├── book-reader-backend/     # 后端服务器
│   ├── src/
│   │   ├── controllers/     # 请求处理器
│   │   ├── models/          # 数据库模型
│   │   ├── routes/          # API路由
│   │   ├── utils/           # 实用功能
│   │   └── index.js         # 服务器入口点
│   ├── uploads/             # 书籍文件上传
│   └── package.json         # 后端依赖
│
├── react_template/          # 前端应用程序
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── pages/           # 页面组件
│   │   ├── utils/           # 实用功能
│   │   ├── App.jsx          # 主组件
│   │   └── main.jsx         # 入口点
│   ├── public/              # 静态资源
│   └── package.json         # 前端依赖
```

## API文档

### 认证
- `POST /api/auth/register` - 注册新用户
- `POST /api/auth/login` - 登录并获取认证令牌

### 书籍
- `GET /api/books` - 获取所有书籍
- `GET /api/books/:id` - 获取书籍详情
- `POST /api/books` - 上传新书籍
- `PUT /api/books/:id` - 更新书籍详情
- `DELETE /api/books/:id` - 删除书籍

### 书架
- `GET /api/bookshelf` - 获取用户的书架
- `POST /api/bookshelf/:bookId` - 将书籍添加到书架
- `DELETE /api/bookshelf/:bookId` - 从书架中移除书籍

## 待办事项

### 优先功能
- [ ] 实现单词查询字典集成
- [ ] 添加阅读进度跟踪
- [ ] 创建用户资料页面
- [ ] 支持不同的书籍格式（EPUB, MOBI等）

### 改进
- [ ] 添加暗黑模式支持
- [ ] 实现阅读统计
- [ ] 添加书籍推荐
- [ ] 改善移动端响应式设计