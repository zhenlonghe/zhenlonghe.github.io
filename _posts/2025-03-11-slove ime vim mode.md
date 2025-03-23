---
layout: post
title: 解决输入法切换问题
date: 2025-03-11 19:14 +0800
tags: 
---

这两天使用 Hammerspoon 解决了困扰以久的输入法切换问题，特别的应用在切换时或在vim mode esc 退出时，fallback to abc 英文输入。 舒服了。


相关代码如下：

```lua
local function switchToABC()
    hs.keycodes.currentSourceID("com.apple.keylayout.ABC")
end

local targetAppsGroup1 = {
    "com.runningwithcrayons.Alfred",
    "com.apple.finder",
    "org.hammerspoon.Hammerspoon",
    "com.apple.Safari",
    "com.mitchellh.ghostty",
    "com.todesktop.230313mzl4w4u92", -- Cursor
    "com.microsoft.VSCode",
    "com.apple.dt.Xcode",
    "com.apple.Terminal",
    "org.vim.MacVim",
}

-- 在这些应用中按下 Esc 或 Ctrl+[ 时切换为 ABC
local targetAppsGroup2 = {
    "com.runningwithcrayons.Alfred",
    "com.apple.Terminal",
    "com.apple.dt.Xcode",
    "com.jetbrains.intellij",
    "com.microsoft.VSCode",
    "com.mitchellh.ghostty",
    "com.todesktop.230313mzl4w4u92",
    "org.vim.MacVim",
}

-- 监听应用切换事件
local function handleAppSwitch(appName, eventType, app)
    if eventType == hs.application.watcher.activated then
        local bundleID = app:bundleID()
        -- 检查是否在 Group 1 中
        for _, appID in ipairs(targetAppsGroup1) do
            if bundleID == appID then
                switchToABC()
                break
            end
        end
    end
end

-- 创建应用切换监听器
local appWatcher = hs.application.watcher.new(handleAppSwitch)
appWatcher:start()

-- 监听键盘事件（Esc 和 Ctrl+[）
local eventTap = hs.eventtap.new({hs.eventtap.event.types.keyDown}, function(event)
    local keyCode = event:getKeyCode()
    local modifiers = event:getFlags()
    local isEsc = (keyCode == hs.keycodes.map.escape) -- Esc 键
    local isCtrlOpenBracket = (keyCode == hs.keycodes.map["["] and modifiers.ctrl) -- Ctrl+[

    if isEsc or isCtrlOpenBracket then
        local frontmostApp = hs.application.frontmostApplication()
        local bundleID = frontmostApp:bundleID()
        -- 检查是否在 Group 2 中
        for _, appID in ipairs(targetAppsGroup2) do
            if bundleID == appID then
                switchToABC() -- 切换输入法
                break
            end
        end
    end

    return false -- 允许事件继续传递
end)

eventTap:start() -- 启动监听
```
2025-03-23 10:07:21：后记：还是换回了rime的vim-mode.