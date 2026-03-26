@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo    古建智识 - 错误修复完成
echo ==========================================
echo.

REM 检查是否在正确目录
if not exist "release\win-unpacked\古建智识.exe" (
    echo [错误] 找不到构建文件
    echo 请先运行: npm run dist
    pause
    exit /b 1
)

echo [1/3] 正在创建便携版文件夹...
if exist "release\古建智识-便携版" rmdir /s /q "release\古建智识-便携版"
mkdir "release\古建智识-便携版"

echo [2/3] 正在复制文件...
copy "release\win-unpacked\古建智识.exe" "release\古建智识-便携版\" >nul
copy "release\win-unpacked\*.dll" "release\古建智识-便携版\" >nul
copy "release\win-unpacked\*.pak" "release\古建智识-便携版\" >nul
copy "release\win-unpacked\*.dat" "release\古建智识-便携版\" >nul
copy "release\win-unpacked\*.bin" "release\古建智识-便携版\" >nul
copy "release\win-unpacked\*.json" "release\古建智识-便携版\" >nul
copy "release\win-unpacked\*.txt" "release\古建智识-便携版\" >nul
copy "release\win-unpacked\*.bat" "release\古建智识-便携版\" >nul

xcopy /s /i /q "release\win-unpacked\locales" "release\古建智识-便携版\locales" >nul
xcopy /s /i /q "release\win-unpacked\resources" "release\古建智识-便携版\resources" >nul

echo [3/3] 完成！
echo.
echo ==========================================
echo 便携版已创建: release\古建智识-便携版\
echo ==========================================
echo.
echo 使用方法:
echo 1. 将整个"古建智识-便携版"文件夹复制到任意位置
echo 2. 双击"古建智识.exe"即可运行
echo.
pause
