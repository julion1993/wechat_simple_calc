
Page({
  data: {
    result: "0",
    expression: "",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    zero: "0",
    clear: "C",
    back: "back",
    divide: "÷",
    multiple: "×",
    minus: "-",
    plus: "+",
    history: "history",
    point: ".",
    equals: "=",
    numArr: [],
    operArr: [],
    logs: []
  },
  clearResult: function() {
    this.setData({"result": "0"});
    this.setData({"expression": ""});
    this.setData({"numArr": []});
    this.setData({"operArr": []});
  },
  backResult: function() {
    //对输入框
    var resultNum = this.data.result;
    if (this.data.numArr.length != this.data.operArr.length) {
      if(resultNum.length == 1) {
        this.setData({ "result": "0" });
      } else {
        this.setData({ "result": resultNum.substr(0, resultNum.length - 1)});
      }
    }
    //对于操作符数组
    if (this.data.numArr.length == this.data.operArr.length) {
      this.data.operArr.pop();
      this.setData({ "result": this.data.numArr[this.data.numArr.length - 1] });
    }
    //对于数字数组
    else {
      var lastNum = this.data.numArr.pop();
      if(lastNum.length > 1) {
        this.data.numArr.push(lastNum.substr(0, lastNum.length - 1));
        this.setData({ "result": lastNum.substr(0, lastNum.length - 1) });
      }
    }
    //对于表达式
    this.setData({ "expression": this.data.expression.substr(0, this.data.expression.length - 1)});
    
    console.log(this.data.numArr);
    console.log(this.data.operArr);
  },
  inputNum: function(e) {
    //获取输入的数字
    var value = e.target.id;
    
    //获取当前的输入框值
    var resultNum = this.data.result;

    //如果当前输入框中数字长度已经达到9位，则不允许再输入
    if(resultNum.length == 9) {
      return;
    }

    //如果numArr和operArr的长度相同
    //那么新输入的数字将会存储到数组的新单元
    //如果当前输入框数字是0
    //则将输入的数字存入数字数组
    //否则的话将输入框数字和新键入的数字组合成一个新数字并存入数组
    if (this.data.numArr.length == this.data.operArr.length) {
      this.setData({ "result": value });
      this.data.numArr.push(value);
    } else if(resultNum == "0") {
      var length = this.data.numArr.length;
      if(length > 0 && this.data.numArr[length - 1] == 0) {
        this.data.numArr.pop();
      } 
      this.data.numArr.push(value);
      this.setData({ "result": value });
    } else {
      this.setData({"result": resultNum + value});
      this.data.numArr.pop();
      this.data.numArr.push(resultNum + value);
    }


    var count = this.data.numArr.length;
    this.setData({ "expression": "" });
    for(var i = 0 ; i < count; i++) {
      this.setData({ "expression": this.data.expression + this.data.numArr[i]});
      if (i + 1 <= this.data.operArr.length) {
        this.setData({ "expression": this.data.expression + this.data.operArr[i] });
      }
    }

    console.log(this.data.numArr);
  },
  inputPoint: function (e) {
    var num = "0.";
    if (this.data.numArr.length != this.data.operArr.length) {
      num = this.data.numArr.pop() + ".";
    }
    this.data.numArr.push(num);

    this.setData({"result": num});

    var count = this.data.numArr.length;
    this.setData({ "expression": "" });
    for (var i = 0; i < count; i++) {
      var temp = this.data.operArr[i] == undefined ? "" : this.data.operArr[i];
      this.setData({ "expression": this.data.expression + this.data.numArr[i] + temp });
    }
    console.log(this.data.numArr);
  },
  inputOperator: function (e) {
    var oper = e.target.id;
    if (this.data.numArr.length == 0) {
      return;
    } else if(this.data.numArr.length == this.data.operArr.length) {
      // console.log("原数组：" + this.data.operArr);
      this.data.operArr.pop();
      // console.log("去掉一个元素的数组：" + this.data.operArr);
      this.data.operArr.push(oper);
      // console.log("后来的数组：" + this.data.operArr);
    } else {
      this.data.operArr.push(oper);
    }
    var count = this.data.numArr.length;
    this.setData({ "expression": "" });
    for (var i = 0; i < count; i++) {
      this.setData({ "expression": this.data.expression + this.data.numArr[i] + this.data.operArr[i] });
    }

    console.log(this.data.operArr);
  },
  doCalc: function () {
    var final = 0;
    var stack = [];
    var numArr = this.data.numArr;
    var operArr = this.data.operArr;
    var length = numArr.length;
    var arr = [];
    
    for(var i = 0; i < length; i++) {
      arr.push(numArr[i]);
      if(i < length - 1) {
        arr.push(operArr[i]);
      }
    }
    
    console.log("组合后：" + arr);

    for(var i = 0; i < arr.length; i++) {
      if(!isNaN(arr[i])) {
        stack.push(arr[i]);
      } else {
        if(arr[i] == "+" || arr[i] == "-") {
          stack.push(arr[i]);
        } else if (arr[i] == "×"){
          var temp = Number(stack.pop()) * Number(arr[i + 1]);
          i++;
          stack.push(temp);
        } else {
          var temp = Number(stack.pop()) / Number(arr[i + 1]);
          i++;
          stack.push(temp);
        }
      }
    }

    console.log("Stack：" + stack);

    for(var i = 0; i < stack.length; i++) {
      if(!isNaN(stack[i])) {
        final += Number(stack[i]);
      } else {
        if(stack[i] == "+") {
          final += Number(stack[i + 1]);
          i++;
        } else {
          final -= Number(stack[i + 1]);
          i++;
        }
      }
    }

    console.log("final:" + final);
    var show = final + "";
    if(show.indexOf(".") > 0 && (show.length - show.indexOf(".")) > 9) {
      final = final.toFixed(9);
    }
    this.setData({ "result": final });

    //存储历史记录
    this.data.logs.push(this.data.expression + "=" + final);
    wx.setStorageSync("calclogs", this.data.logs);

    this.setData({ "numArr": [] });
    this.setData({ "operArr": [] });
  },
  seeHistory: function() {
    wx.navigateTo({
      url: '../history/history'
    })
  },
  getAcc: function(str1, str2, oper) {
    var index1 = str1.length - str1.indexOf(".");
    var index2 = str2.length - str2.indexOf(".");
    var index = index1 > index2 ? index1 : index2;

    var times = Math.pow(10, index - 1);
    var num1 = Number(str1) * times;
    var num2 = Number(str2) * times;

    if (oper == "×") {
      return num1 * num2 / times / times;
    } else {
      return num1 / num2;
    }
  }
})
