param(
    [string]$ProfileDir,
    [string]$ShortcutPath,
    [int]$TaskbarNo = 0
)

# 1. If we have a valid taskbar shortcut (.lnk), invoke it directly via Windows Shell
if ($ShortcutPath -and (Test-Path $ShortcutPath)) {
    try {
        $shell = New-Object -ComObject Shell.Application
        $dir = [System.IO.Path]::GetDirectoryName($ShortcutPath)
        $file = [System.IO.Path]::GetFileName($ShortcutPath)
        $folder = $shell.NameSpace($dir)
        $item = $folder.ParseName($file)
        $item.InvokeVerb("open")
        Write-Output "Launched via Shell Verb: $ShortcutPath"
        exit 0
    } catch {
        Write-Warning "Shell Verb failed, falling back to Start-Process: $_"
        Start-Process -FilePath $ShortcutPath
        exit 0
    }
}

# 2. If taskbar number 1-9 is available, trigger native Windows Taskbar activation (Win + 1..9)
if ($TaskbarNo -ge 1 -and $TaskbarNo -le 9) {
    Add-Type @'
    using System;
    using System.Runtime.InteropServices;
    public class TaskbarClicker {
        [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
        public const byte VK_LWIN = 0x5B;
        public const uint KEYEVENTF_KEYUP = 0x0002;
        public static void PressWin(int num) {
            byte key = (byte)(0x30 + num);
            keybd_event(VK_LWIN, 0, 0, 0);
            keybd_event(key, 0, 0, 0);
            keybd_event(key, 0, KEYEVENTF_KEYUP, 0);
            keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, 0);
        }
    }
'@
    [TaskbarClicker]::PressWin($TaskbarNo)
    Write-Output "Sent Win + $TaskbarNo"
    exit 0
}

# 3. Direct Chrome execution with properly quoted profile directory
$chromeExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromeExe)) {
    $chromeExe = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

Start-Process -FilePath $chromeExe -ArgumentList @("--profile-directory=$ProfileDir", "--source-shortcut-location=taskbar")
Write-Output "Directly launched Chrome with profile $ProfileDir"
