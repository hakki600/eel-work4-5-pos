var master_csv_area = document.getElementById('master-csv-area');
var master_regiter_btn = document.getElementById('master-regiter-btn');
var item_register_btn = document.getElementById('item-register-btn');
var reset_btn = document.getElementById('reset-btn');
var result_area = document.getElementById('result-area');
var total_area = document.getElementById('total-area');
var calc_btn = document.getElementById('calc-btn');
var change_area = document.getElementById('change-area');

var count = 0;

// 0埋め関数
function zeroPadding(num,length){
    return ('0000000000' + num).slice(-length);
}

// 全角判定関数
function isZenkaku(str) {
    return (String(str).match(/[\x01-\x7E\uFF65-\uFF9F]/)) ? false : true;
}

// 全角→半角関数
function toHalfWidth(value) {
  return value.replace(/./g, s => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
  })
}

async function item_register() {
    let ret = await eel.item_register(code, amount)();
    return ret;
}

async function get_total() {
    let ret = await eel.get_total()();
    return ret;
}

async function master_register() {
    let ret = await eel.master_register(filename)();
    return ret;
}

// 商品登録ボタンクリックイベント
item_register_btn.addEventListener('click', () => {
    // ユーザー入力は全角も対応
    code = document.registerform.item_code.value;
    amount = document.registerform.item_amount.value;
    if (isZenkaku(code)) {
        code = toHalfWidth(code)
    }

    if (isZenkaku(amount)) {
        amount = toHalfWidth(amount)
    }

    if (code && amount && isNaN(amount)==false) {
        // pythonからオーダー登録関数を呼ぶ
        promise = item_register(code, amount);
        promise.then((ret_array) => {
            ret = ret_array[0]
            item_name = ret_array[1]
            item_price = ret_array[2]
            if (ret == 0) {
                get_total().then((total) => {
                    total_area.value = total;
                    count++;
                    count_str = zeroPadding(count,3);
                    let line = "# " + count_str 
                    + "  商品コード  " +  code 
                    + "   商品名  " + item_name 
                    + "   数量  " + amount 
                    + "   価格  " + item_price 
                    + "\n";
                    result_area.value += line;
                });
            }
            else{
                alert("マスタに登録されていない商品コードが入力されました.");
            }
        });
    }
    else {
        window.alert("商品コードと個数を入力してください.");
    }
})

// 初期化ボタンクリックイベント
reset_btn.addEventListener('click', () => {
    eel.refresh_pos();
    result_area.value = "";
    count = 0;
})

// 計算(お釣り算出)ボタンクリックイベント
calc_btn.addEventListener('click', () => {
    total = document.totalform.total.value;
    deposit = document.depositform.deposit.value;
    if (total && deposit) {
        change_area.value = deposit - total;
        }
    else {
        window.alert("お預かり金額を入力してください.");
    }
})

// 商品マスタ変更ボタンクリックイベント
master_regiter_btn.addEventListener('click', () => {
    filename = master_csv_area.value;
    //正規表現パターン
    var regex = new RegExp(/.csv$/);
    if (regex.test(filename)) {
        ret = master_register(filename);
        console.log(ret)
        if (ret==0) {
            alert("マスタ登録しました.");
        }
        else{
            alert("読み込みエラーです. 変更をキャンセルしました.");
        }
    } else {
        alert("csvファイル名を入力してください. 「xxxxxx.csv」");
    }
})