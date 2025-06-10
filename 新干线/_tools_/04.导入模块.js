//(1).定义应用名称:决定了模块存储的位置
var appName = "AIGame";
//(2).模块导入函数
var put = function(modulePath){
    exports(appName,modulePath);
}
//(3).模块导入(传入目录)
//参数是js代码的目录:目录名就是模块名,目录中的main.js就是模块代码
put("");

//(4)使用模块
//let myModule = require(appName,"模块名(目录名)");
















//..