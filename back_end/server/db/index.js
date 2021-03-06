const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'longgiang2010',
    user: "root",
    database: "financial_app",
    host: 'localhost',
    port: '3306',
    multipleStatements: true
});

let appdb = {};

appdb.setup = () => {
    return new Promise((resolve, reject) => {
        pool.query('call setup();', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    })
};

appdb.login = (account, password) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT iduser FROM user where account = ? and pass = ?;', [account, password], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.get_all = () => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT account FROM user', (err, results) => {
            if(err) {
                return reject(err);
            }

            return resolve(results);
        });
    })
};

appdb.add_user = (account, pass, balance) => {
    return new Promise((resolve, reject) => {
        pool.query('insert into user (account, pass, balance) values (?,?,?);', [account, pass, balance], (err, results) => {
            if(err){
                return reject(err);
            }

            return resolve(results);
        })
    })
}

appdb.get_one = (id) => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT user.account, balance FROM user WHERE iduser = ?',[id], (err, results) => {
            if(err) {
                return reject(err);
            }

            return resolve(results[0]);
        });
    })
};

appdb.get_category = (type) => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM category WHERE type = ?',[type], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    })
};

appdb.get_spending = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT spending.value, spending.idspending, spending.type, DATE_FORMAT(spending.date, "%d-%m-%Y") AS Date, category.name FROM spending INNER JOIN category ON spending.categoryid = category.idcategory where spending.userid = ?;', [userid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    })
};

appdb.get_spending_type = (type, userid) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT spending.value, spending.idspending, spending.type, DATE_FORMAT(spending.date, "%d-%m-%Y") AS Date, category.name FROM spending INNER JOIN category ON spending.categoryid = category.idcategory where spending.type = ? and spending.userid = ?;', [type, userid], (err,results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    })
}

appdb.get_income_type = (type, userid) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT income.value, income.idincome, income.type, DATE_FORMAT(income.date, "%d-%m-%Y") AS Date, category.name FROM income INNER JOIN category ON income.categoryid = category.idcategory where income.type = ? and income.userid = ? ORDER BY Date;', [type, userid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    })
}

appdb.get_spending_cate = (cate,userid) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT spending.categoryid, spending.value, spending.idspending, spending.type, DATE_FORMAT(spending.date, "%d-%m-%Y") AS Date, category.name FROM spending INNER JOIN category ON spending.categoryid = category.idcategory WHERE category.idcategory = ? and month(date) = month(curdate()) and spending.userid = ? ORDER BY Date DESC', [cate, userid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    })
};

appdb.get_year = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query('(SELECT DISTINCT YEAR(date) AS YEAR from spending where userid = ?) union (SELECT DISTINCT YEAR(date) AS YEAR from income where userid = ?) ORDER BY YEAR DESC;',[userid, userid], (err, results) =>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    })
}

appdb.get_income = (userid) => {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT income.value, income.idincome, income.type, DATE_FORMAT(income.date, "%d-%m-%Y") AS Date, category.name FROM income INNER JOIN category ON income.categoryid = category.idcategory where income.userid = ? ORDER BY Date DESC', [userid],(err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    })
};

appdb.get_limitation = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT limitation.*, name FROM limitation INNER JOIN category ON limitation.categoryid = category.idcategory where limitation.userid = ?',[userid] , (err, results) => {
            if(err){
                return reject(ree);
            }
            return resolve(results);
        })
    })
}
appdb.update_category = (idcategory, name) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO category (idcategory, name) VALUES (?, ?)', [idcategory,name], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.add_spending = (categoryid, value, date, type, userid) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO spending (categoryid, value, date, type, userid) VALUES (?, ?, ?, ?, ?)', [categoryid, value, date, type, userid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.add_income = (categoryid, value, date, type, userid) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO income (categoryid, value, date, type, userid) VALUES (?, ?, ?, ?, ?)', [categoryid, value, date, type, userid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.add_monthly = (userid, categoryid, value, type, date) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO monthly_item (userid, categoryid, value, type, date) values (?,?,?,?, ?) ON DUPLICATE KEY UPDATE value = ?, date = ?;', [userid, categoryid, value, type, date, value, date], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.delete_monthly = (userid, categoryid) => {
    return new Promise((resolve, reject)=> {
        pool.query('DELETE FROM monthly_item where userid = ? and categoryid = ?;', [userid, categoryid], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.get_monthly = (userid, type)=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT monthly_item.*, category.name FROM monthly_item  INNER JOIN category ON monthly_item.categoryid = category.idcategory where userid = ? and monthly_item.type = ?;', [userid, type], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.add_category = (name, type) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO category (name, type) VALUES (?,?)', [name, type], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.update_balance = (value, id) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE user SET balance = ? WHERE iduser = ?', [value, id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.delete_spending = (id) => {
    return new Promise((resolve, reject) =>{
        pool.query('DELETE FROM spending WHERE idspending = ?', [id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.delete_limitation = (id, userid) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM limitation WHERE categoryid = ? and userid = ?', [id, userid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.add_limitation = (categoryid, max, userid) => {
    return new Promise((resolve, reject)=>{
        pool.query('call add_limitation(?,?,?);', [categoryid, max, userid], (err, results) =>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.update_limitation = (categoryid, value, date, userid) => {
    return new Promise ((resolve, reject) => {
        pool.query("call update_limitation(?,?, ?, ?);", [categoryid, value, date, userid], (err, results) => {
            if(err){
                return reject(err);
            }
            else resolve(results);
        })
    })
}

appdb.delete_income = (id)=> {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM income WHERE idincome = ?', [id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.delete_category = (id) => {
    return new Promise ((resolve, reject) => {
        console.log(id);
        pool.query('DELETE FROM category WHERE idcategory = ?', [id], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}


appdb.get_spending_permonth = (year,userid) => {
    return new Promise((resolve, reject) => {
        pool.query('select sum(value) as value, month(date) as month from spending where year(date) = ? and userid = ? group by month(date);', [year, userid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.get_income_permonth = (year, userid) => {
    return new Promise((resolve, reject) => {
        pool.query('select sum(value) as value, month(date) as month from income where year(date) = ? and userid = ? group by month(date);', [year, userid], (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.get_spending_percate = (year, userid) => {
    return new Promise((resolve, reject) => {
        pool.query("select sum(value) as value, name from spending inner join category on spending.categoryid = category.idcategory where year(date) = ? and spending.userid = ? group by name;", [year, userid],(err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}

appdb.get_income_percate = (year, userid) => {
    return new Promise((resolve, reject) => {
        pool.query("select sum(value) as value, name from income inner join category on income.categoryid = category.idcategory where year(date) = ? and income.userid = ? group by name;",[year, userid] ,(err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
}
module.exports = appdb;