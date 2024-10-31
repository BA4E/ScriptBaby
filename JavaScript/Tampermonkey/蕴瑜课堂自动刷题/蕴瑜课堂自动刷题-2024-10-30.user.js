// ==UserScript==
// @name         蕴瑜课堂自动刷题
// @namespace    http://tampermonkey.net/
// @version      2024-10-30
// @description  try to take over the world!
// @author       BA4E
// @match        *://courses.gdut.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

//getQuizs获取所有测试的url
function getQuizs(){
    const quizs = [];
    // 查找所有包含特定 data-activityname 的元素
    const activityItems = document.querySelectorAll('[data-activityname*="计入平时成绩"]');
    // 过滤出包含特定结构的元素
    activityItems.forEach(item => {
        const titleElement = item.querySelector('.activitytitle.modtype_quiz');
        if (titleElement) {
            // 找到包含该元素的 URL
            const linkElement = titleElement.querySelector('a');
            var quiz = {};
            if (linkElement) {
                //记录测试url
                quiz.url = linkElement.href;
                //记录测试是否满分，如果满分则为true
                quiz.status = false;
                quizs.push(quiz);
            }
        }
    });
    console.log(quizs);
    //把所有测试url存到全局
    GM_deleteValue('quizs');
    GM_setValue('quizs',quizs);
}

//View访问测试url
function View(){

    //如果不是第一次测验，则查看分数是否满分
    var feedbackNode = document.querySelector("[id=feedback]");
    if(feedbackNode){
        var feedback = feedbackNode.textContent;
        var n = parseFloat(feedback.substring(5,feedback.indexOf("/")-1));
        var m = parseFloat(feedback.substring(feedback.indexOf("/")+2,feedback.indexOf("。")))
        if(n / m == 1){
            console.log("ok");
            GM_deleteValue("checkList");
            GM_setValue('quizFlag',true);
            var key = GM_getValue('key');
            var quizs = GM_getValue('quizs');
            quizs[key].status=true;
            GM_setValue('quizs',quizs);

        }else{
            //点击重测按钮
            const reTestButton = document.querySelector(".btn.btn-primary");
            if(reTestButton){
                reTestButton.click();
            }
        }
    }else{
        // 获取尝试测验按钮元素
        const button = document.querySelector('button[id*="single_button"]');
        // 检查按钮是否存在，然后触发点击事件
        if (isNaN(button) && button.textContent == '尝试测验') {
            button.click(); // 触发点击事件
        }
        //如果页面出现继续上次作答按钮
        var conButton = document.querySelector(".btn.btn-primary");
        if(conButton){
            conButton.click();
        }
    }

}

//Attempt尝试答题
function Attempt(){
    //检查是否存有第一次试错获取的答案
    var cL;
    if((cL = GM_getValue('checkList'))){
        console.log("attemp hack test");
        //下面开始copy答案
        //先获取问题
        var q = document.querySelector(".qtext").textContent;
        var p = document.getElementsByClassName("prompt h6 font-weight-normal ")[0].textContent;
        //获取答案
        var a = cL[q].trim();
        //检查是否为单选题
        if(q.indexOf('单选题') != -1 || p.indexOf('选择一项') != -1){
            //获取所有回答
            var answers = document.querySelectorAll('[id*="answer"][id*="labe"]');

            var flag = false;
            answers.forEach(answer => {
                //检查是否找到正确答案
                if(flag){
                    return true;
                }
                //匹配是否为正确答案
                if(answer.textContent.trim().indexOf(a) != -1){
                    flag =true;
                    var idNode = answer.id;
                    var id = idNode.substring(idNode.indexOf("_")+1,idNode.lastIndexOf("_"));
                    //选择正确答案
                    var radioButton = document.querySelector("[id*="+id+"]");
                    if (radioButton) {
                        radioButton.checked = true; // 选择正确选项

                        // 触发change事件，以通知表单更新
                        const event = new Event('change', { bubbles: true });
                        radioButton.dispatchEvent(event);
                    }
                }
            });
            // 可以选择模拟点击“下一页”按钮
            const nextButton = document.getElementById("mod_quiz-next-nav");
            if (nextButton) {
                nextButton.click();
            }
            //如果不是单选题
        }else {
            console.log('多选题 test');
            //获取所有选项
            var checkBoxes = document.querySelectorAll('[id*="choice"][id*="label"]');
            //遍历所有选项
            checkBoxes.forEach(cB =>{
                //判断是否为正确答案
                var text = cB.textContent.substring(3).trim();
                if(a.indexOf(text) != -1){
                    var fId = cB.id
                    var id = fId.substring(fId.indexOf("_")+1,fId.lastIndexOf("_"));
                    const checkbox = document.querySelector("[id*="+id+"]");
                    if(checkbox){
                        checkbox.checked = true; // 勾选复选框
                    }
                }
            });
            //点击下一题
            const nextButton = document.getElementById("mod_quiz-next-nav");
            if (nextButton) {
                nextButton.click();
            }
        }
    }else{
        //下面会一路完成第一次错误答题，来获取正确答案
        // 找到单选题的A选项的radio按钮并选中
        const radioButtonA = document.querySelector("[id*=answer0]");
        if (radioButtonA) {
            radioButtonA.checked = true; // 选择A选项

            // 触发change事件，以通知表单更新
            const event = new Event('change', { bubbles: true });
            radioButtonA.dispatchEvent(event);

            // 可以选择模拟点击“下一页”按钮
            const nextButton = document.getElementById("mod_quiz-next-nav");
            if (nextButton) {
                nextButton.click();
            }
        }
        //找到多选题的A选项checkbox按钮并选中
        const checkbox = document.querySelector("[id*=choice0]");
        if(checkbox){
            checkbox.checked = true; // 勾选复选框

            //点击下一题
            const nextButton = document.getElementById("mod_quiz-next-nav");
            if (nextButton) {
                nextButton.click();
            }
        }
    }

}

//ConSubmmit提交测试答案
function ConSubmmit(){
    //找到第一次确认
    const subAllButton = document.querySelector(".btn.btn-primary")
    if(subAllButton){
        subAllButton.click();
        //找到第二次确认
        const saveButton = document.querySelector("[data-action=save]")
        if(saveButton){
            saveButton.click();
        }
    }
}

//SaveAnswer保存第一次错误的答案
function SaveAnswer(){
    //记录第一次错误答案
    //记录问题和正确答案的集合
    const checkList = {};
    //获取所有问题和答案
    const qas = document.querySelectorAll("[id*=question]");
    //遍历每一个问题和答案
    var i = 0;
    qas.forEach(qa => {
        //获取问题
        i+=1;
        var ques = qa.querySelector(".qtext").textContent
        //获取答案
        var answer = qa.querySelector(".rightanswer").textContent
        var ranswer = answer.substring(answer.indexOf("正确答案是：")+'正确答案是：'.length)
        checkList[ques]=ranswer
    });
    //把checkList存到油猴全局变量
    GM_setValue('checkList', checkList);
    //点击结束回顾
    const endReviewButton = document.querySelector(".submitbtns .mod_quiz-next-nav");
    if (endReviewButton) {
        endReviewButton.click();
    }
}
    //延迟1秒
    setTimeout(() => {
        console.log("wait");
    }, 1000);

setTimeout(function() {
    //等1秒再执行
    'use strict';
    var currentUrl = window.location.pathname;
    console.log("url1 "+ currentUrl);
    //GM_deleteValue('quizFlag');
    //GM_deleteValue('checkList');
    console.log(GM_getValue('quizs'));
    switch(currentUrl){
            //如果当前位置是课程主页，则爬取测试url
        case "/course/view.php":{
            if(window.location.search == '?id=1671'){
                console.log("view test");
                getQuizs();
            }
            break;
        }
        case "/mod/quiz/view.php":{
            console.log("quiz test");
            View();
            break;
        }
        case "/mod/quiz/attempt.php":{
            console.log("attempt test");
            Attempt();
            break;
        }
        case "/mod/quiz/summary.php":{
            console.log("summary test");
            ConSubmmit();
            break;
        }
        case "/mod/quiz/review.php":{
            console.log("review test");
            SaveAnswer();
            break;
        }
        default:{
            console.log("nothing");
            break;
        }
    }

    var quizs = GM_getValue('quizs');

    var flag = GM_getValue('quizFlag');
    //flag值为false，则不允许其他标签页进入此循环
    if(flag == true || isNaN(flag)){
        for(var k in quizs){
            //quiz状态为false则开始测试
            if(quizs[k].status == false){
                GM_setValue('quizFlag',false);
                //当前正在测试的
                GM_setValue('key',k);
                window.location.href=quizs[k].url;
                break;
            }
        }
    }

},1000);