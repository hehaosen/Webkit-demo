var queues = require('mysql-queues');
var db = require('./db');

var Score = {};

module.exports = Score;


/**
 * 添加成绩信息
 * Callback:
 * - err, 数据库错误
 * @param {string} scores 用户成绩对象
 * @param {Function} callback 回调函数
 */
Score.addScore = function(scores, callback){
    //从连接池中获取一个连接
    db.getConnection(function(err, connection) {

        //关闭调试
        queues(connection, false);

        //开启事务
        var trans = connection.startTransaction();

        //循环添加
        for(var i=0;i<scores.length;i++){
            (function(score, index, leng){

                var sql = "insert into score(uid, cid, score) values((select id from users where name=?), (select id from class where name=?), ?)";
                var inserts = [score.stuname, score.claname, score.score];
                sql = connection.format(sql, inserts);

                trans.query(sql, function(err, info) {
                    if(err){
                        trans.rollback();
                    }else{
                        //如果是最后一次就提交事务断开连接
                        if(index == leng-1){
                            trans.commit(function(err, infos){

                                callback(null, info);
                                connection.release();        //使用完之后断开连接，放回连接池
                            });
                        }
                        //
                    }
                });
            })(scores[i], i, scores.length);
        }

        //提交执行
        trans.execute();
    });
};