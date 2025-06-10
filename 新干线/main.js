//(1).获取截屏权限
$screen.getPermit();
//(2).获取无障碍权限
$act.getPermit();
//(3).获取悬浮窗权限
$floaty.getPermit();


let Init_video_X = 233;
let Init_video_y = 465;

let 课程集数 = 16;          
let 最大课程数 = 29;
let 页数  = 7;



/**
 * 执行双指捏合手势
 * @param {number} finger1StartX - 第一个手指起始X坐标
 * @param {number} finger1StartY - 第一个手指起始Y坐标
 * @param {number} finger2StartX - 第二个手指起始X坐标
 * @param {number} finger2StartY - 第二个手指起始Y坐标
 * @param {number} [duration=500] - 手势持续时间(毫秒)，默认为500
 */
function pinchGesture(finger1StartX = 700, finger1StartY = 170, finger2StartX = 20, finger2StartY = 1260, duration = 500) {
    sleep(1000);
    // 计算两个手指的中间点作为移动目标
    const finger1EndX = finger1StartX - (finger1StartX - finger2StartX) / 2;
    const finger1EndY = finger1StartY + (finger2StartY - finger1StartY) / 2;
    const finger2EndX = finger2StartX + (finger1StartX - finger2StartX) / 2;
    const finger2EndY = finger2StartY - (finger2StartY - finger1StartY) / 2;
    
    $act.gesture(
        [finger1StartX, finger1StartY, finger1EndX, finger1EndY, 0, duration],
        [finger2StartX, finger2StartY, finger2EndX, finger2EndY, 0, duration]
    );
    sleep(2000);
}



/**
 * 查找并点击图片，点击成功后关闭绘制
 * @param {Object} options - 配置选项
 * @param {string} options.path - 图片路径
 * @param {number} [options.similar=0.8] - 找图的相似值(最小值:0.3)
 * @param {Array} [options.region=[]] - 找图的范围(必须是4位,且后两位不能为0)
 * @param {boolean} [options.trans=false] - 是否找透明背景的图片
 * @param {number} [options.px=0] - 点击位置相对于中点的x偏移量
 * @param {number} [options.py=0] - 点击位置相对于中点的y偏移量
 * @returns {Object|null} 返回找到的点坐标或null
 */
function findAndClick(options) {
    const point = $ag.findImgClick({
        path: options.path,
        similar: options.similar || 0.8,
        region: options.region || [],
        trans: options.trans || false,
        px: options.px || 0,
        py: options.py || 0
    });
    
    // 只有找到图片并点击后才关闭绘制
    if (point) {
        closeDraw();
    }
    else
    {
    }
    sleep(2000);
    return point;
}

/**
 * 查找图片并返回坐标（找到后自动关闭绘制）
 * @param {Object|string} options - 图片路径或配置对象
 * @param {string} [options.path] - 图片路径（如果直接传字符串则视为path）
 * @param {number} [options.similar=0.8] - 相似度阈值（0.3~1.0）
 * @param {Array} [options.region=[]] - 查找区域 [x1,y1,x2,y2]
 * @param {boolean} [options.trans=false] - 是否处理透明图
 * @returns {{x: number, y: number}|null} 返回坐标对象或null
 */
function findImage(options) {
    // 参数处理（支持直接传字符串路径）
    const config = typeof options === 'string' ? { path: options } : options;
    
    // 执行找图
    const point = $ag.findImg({
        path: config.path,
        similar: config.similar || 0.75,
        region: config.region || [],
        trans: config.trans || false
    });
    
    // 找到图片则关闭绘制
    if (point) {
        closeDraw();
        toast("找到图片,关闭绘制图片");
    }
    return point; // 返回 {x, y} 或 null
}
/**
 * 翻页函数
 * @param {number} pageNum - 要翻到的页码
 */
function turnPage(pageNum) {
    $act.move(60, 1230, 60, 250);  // 滑动到最下方
    sleep(1000);  // 等待滑动完成
    // 计算需要翻页的次数 (pageNum - 1)
    let flipCount = pageNum - 1;
    
    // 执行多次翻页
    for (let i = 0; i < flipCount; i++) {
        if(i == 0)
        {
            findAndClick({
                path: "sdcard/Pictures/新干线/图色仓库/翻页.png",
            });
        }
        else
        {
            let res = findAndClick({
                        path: "sdcard/Pictures/新干线/图色仓库/翻页1.png",
            });
            if(res == null)
            {
                findAndClick({
                        path: "sdcard/Pictures/新干线/图色仓库/翻页2.png",
            });
            }
        }
        sleep(2000);

    }
    sleep(3000);
    $act.move(60, 250, 60, 1230);  // 滑动到最下方
}


/**
 * 根据序号返回对应的 X 和 Y 坐标
 * @param {number} index - 序号 (0~29)
 * @returns {{x: number, y: number}|null} 返回坐标对象，如果序号无效则返回 null
 */
// function getPositionByIndex(index) {
//     // 检查序号是否有效
//     if (index < 0 || index > 29) {
//         return null;
//     }

//     // 基准坐标
//     const baseX = 233;
//     let baseY;

//     if (index < 20) {
//         baseY = 466;  // 0-19 的基准 Y
//     } else {
//         baseY = 770;  // 20-29 的基准 Y
//         $act.move(60, 1230, 60, 250);  // 滑动到最下方
//         sleep(500);  // 等待滑动完成
//     }

//     // X 轴间隔（相邻课程水平偏移）
//     const xStep = 258;
//     // Y 轴间隔（下一行课程垂直偏移）
//     const yStep = 85;

//     // 计算行列（每行 2 个课程）
//     const adjustedIndex = (index < 20) ? index : index - 20;  // 20-29 的索引调整
//     const col = adjustedIndex % 2;  // 列 (0~1)
//     const row = Math.floor(adjustedIndex / 2);  // 行 (0~9)

//     // 计算最终坐标
//     const x = baseX + col * xStep;
//     const y = baseY + row * yStep;

//     return { x, y };
// }
// function getPositionByIndex(index) {
//     // 检查序号是否有效
//     if (index < 0 || index > 29) {
//         return null;
//     }

//     // 基准坐标 - 第一课(0号课程)的坐标
//     let firstX = 255;
//     let firstY = 389;
    
//     // X轴间隔（相邻课程水平偏移）
//     let xStep = 215; // 470-255=215
//     // Y轴间隔（下一行课程垂直偏移）
//     let yStep = 75;  // 475-400=75
    
//     // 滑动后的基准Y坐标 - 26号课程的Y坐标
//     let scrollBaseY = 1070;

//     if (index > 25) {
//         // 26-29号课程需要滑动
//         $act.move(60, 1230, 60, 250);  // 滑动到最下方
//         sleep(500);  // 等待滑动完成
        
//         // 计算滑动后的课程位置（每行2个）
//         let adjustedIndex = index - 26;
//         let col = adjustedIndex % 2;
//         let row = Math.floor(adjustedIndex / 2);
        
//         let x = firstX + col * xStep;
//         let y = scrollBaseY + row * yStep;
        
//         return { x, y };
//     } else {
//         // 0-25号课程不需要滑动
//         // 计算行列（每行2个课程，共13行）
//         let col = index % 2;
//         let row = Math.floor(index / 2);
        
//         let x = firstX + col * xStep;
//         let y = firstY + row * yStep;
        
//         return { x, y };
//     }
// }
function getPositionByIndex(index) {
    // 检查序号是否有效
    if (index < 0 || index > 29) {
        return null;
    }

    // 基准坐标 - 0号课程的坐标
    let firstX = 255;
    let firstY = 400;
    
    // X轴间隔（两列之间的水平偏移）
    let xStep = 215; // 470 - 255 = 215
    // Y轴间隔（行与行之间的垂直偏移）
    let yStep = 70;  // 470 - 400 = 70（根据你的示例计算）

    if (index > 25) {
        // 26-29号课程需要滑动（暂不调整，沿用你的逻辑）
        $act.move(60, 1230, 60, 250);  // 滑动到最下方
        sleep(500);  // 等待滑动完成
        
        let adjustedIndex = index - 26;
        let col = adjustedIndex % 2;
        let row = Math.floor(adjustedIndex / 2);
        
        let x = firstX + col * xStep;
        let y = 1070 + row * yStep;  // 滑动后的基准Y坐标
        
        return { x, y };
    } else {
        // 0-25号课程（两列布局）
        let col = index % 2;  // 0: 左列, 1: 右列
        let row = Math.floor(index / 2);  // 行号
        
        let x = firstX + col * xStep;
        let y = firstY + row * yStep;
        
        return { x, y };
    }
}
function 新干线初始化() {
    //打开网址
    let myUrl = "https://learning.hzrs.hangzhou.gov.cn/";
    $app.openUrl(myUrl);
    sleep(10000);
    //缩放比例
    pinchGesture();
    // 使用示例 - 与你原来的代码效果相同
    findAndClick({
        path: "sdcard/Pictures/新干线/图色仓库/网络课程黑白.png"
    });
    findAndClick({
        path: "sdcard/Pictures/新干线/图色仓库/课程类别所有.png"
    });
    findAndClick({
        path: "sdcard/Pictures/新干线/图色仓库/专业课程.png"
    });
    findAndClick({
        path: "sdcard/Pictures/新干线/图色仓库/查询.png"
    });
}


/**
 * 处理获得学分逻辑：
 * 1. 查找"获得学分"按钮，如果找到则点击
 * 2. 点击后查找"确定"按钮并点击
 * 3. 更新课程集数和页数（全局变量）
 * @returns {boolean} 是否成功获得学分
 */
function handleCreditAcquisition() {
    // 1. 查找"获得学分"按钮
    const creditImg = "sdcard/Pictures/新干线/图色仓库/获得学分.png";
    let result = findImage(creditImg);
    toast("正在获取学分");
    if (result == null) {
        handleContinueLearning();
        return false; // 返回 false 表示未找到
    }
    else    //确认获取到学分执行确认点击并且结束此轮循环
    {
        toast("找到获得学分");
       // 2. 点击"确定"按钮
        const confirmImg = "sdcard/Pictures/新干线/图色仓库/确定.png";
        let clickSuccess = findAndClick({ path: confirmImg });
        
        if (clickSuccess == null) {
            toast("未找到确定按钮");
            return false;
        }
        else
        {
            toast("找到找到获得学分确定按钮");
        }
        // 3. 更新课程集数和页数（假设是全局变量）
        课程集数++;
        if (课程集数 > 29) {
            页数++;
            课程集数 = 0; // 重置集数（可根据需求调整）
        }
        toast(`学分获取成功！当前课程: ${课程集数}, 页数: ${页数}`);
        return true; // 返回 true 表示成功
    }
    
}


/**
 * 处理继续学习逻辑：
 * 1. 查找"继续学习"按钮，如果找到则点击
 * 2. 点击后查找"确定"按钮并点击
 * 3. 最后查找"播放键"并点击
 */
function handleContinueLearning() {
    // 1. 查找"继续学习"按钮
    const continueLearningImg = "sdcard/Pictures/新干线/图色仓库/继续学习.png";
    let result = findImage(continueLearningImg);
    
    if (result == null) {
        toast("未找到继续学习按钮");
    }
    else
    {
        toast("找到继续学习");
        const confirmImg = "sdcard/Pictures/新干线/图色仓库/确定.png";
        let clickSuccess = findAndClick({ path: confirmImg });
        
        if (clickSuccess == null) {
            toast("未找到继续学习确定按钮");
        }
        else
        {
            toast("点击继续学习按钮");
            // $act.click(420, 317, 300, 300);
        }
        
    }
    sleep(1000); // 等待弹窗处理

    findAndClick({
                        path: "sdcard/Pictures/新干线/图色仓库/播放键.png",
            });
    findAndClick({
                        path: "sdcard/Pictures/新干线/图色仓库/小窗播放.png",
            });
    findAndClick({
                        path: "sdcard/Pictures/新干线/图色仓库/圆形播放.png",
    });
    findAndClick({
                        path: "sdcard/Pictures/新干线/图色仓库/留在此页.png",
    });
    toast(`当前课程: ${课程集数}, 页数: ${页数}`);
    
    return true; // 返回 true 表示流程执行成功
}


/**
 * 查找课程并立即学习
 * @param {number} courseIndex - 当前课程序号（0~29）
 * @returns {boolean} 是否成功找到并开始学习
 */
function findAndStartLearning(courseIndex) {
    // 1. 执行换页操作
    turnPage(页数);
    // 1. 获取课程坐标
    let pos = getPositionByIndex(courseIndex);
    if (!pos) {
        toast(`无效课程序号: ${courseIndex}`);
        return false;
    }

    // 2. 点击课程
    $act.click(pos.x, pos.y);
    // toast(`点击坐标: (${pos.x}, ${pos.y})`);

    // 3. 缩放界面（可选）
    pinchGesture();
    
    // 4. 查找并点击"立即学习"
    findAndClick({
        path: "sdcard/Pictures/新干线/图色仓库/立即学习.png"
    });
    pinchGesture();
    $act.click(420, 317, 300, 300);
    toast("课程学习已开始");
    return true;
}

/**
 * 单次完整流程：初始化→学习→检测学分
 * @returns {boolean} 是否成功完成学分获取
 */
function 执行单次流程() {
    // 1. 初始化
    新干线初始化();
    
    // 2. 尝试开始学习
    if (!findAndStartLearning(课程集数)) {
        toast(`课程 ${课程集数} 学习失败`);
        return false;
    }
    
    // 3. 持续检测学分直到成功
    while (!handleCreditAcquisition()) {
        sleep(3000); // 每3秒检测一次
    }
    return true;
}

/**
 * 无限循环执行完整流程（成功后重置）
 */
function 主循环() {
    while (true) { // 无限循环，需手动停止
        if (执行单次流程()) {
            toast("流程完成，重新开始！");
        } else {
            toast("流程失败，10秒后重试");
            sleep(10000);
        }
    }
}

// 启动（需要手动停止）
主循环();


