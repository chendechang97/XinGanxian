//1.关闭全部屏幕绘制
$draw.closeAll();
//2.关闭命令的会话
$root.closeAll();
//3.关闭全部线程
$thread.stopAll();
//4.关闭全部循环执行器
$thread.stopAllLoop();
//5.关闭消息总线
$bus.stopAll();
//6.关闭全部执行的脚本(包括当前脚本)
$engine.stopAll();












//..