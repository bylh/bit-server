
import http from 'http';
import express from 'express';
import cors from 'cors';
import mt from './route/yunxiao/mt/index';
import mt_admin from './route/yunxiao/mt/admin'
import bodyParser from 'body-parser';
(async function main() {

    let app = express();
    let httpServer = http.createServer(app);

    app.use(cors()); // 解决跨域访问的问题
    app.use(bodyParser.json({limit: 1 * 1024 * 1024})); // 最大1M的JSON请求
    app.use(mt);
    app.use(mt_admin);
    app.use('/about', about);
    // 启动监听

    httpServer.listen(4000);
    if (process.send != null) process.send('ready');

    console.log('监听http 4000端口');

    process.on('SIGINT', async () => {  // 保存log后退出
        process.exit(); // 程序结束
    });
})();

async function about(req: express.Request, res: express.Response) {
    res.status(200).send('this is bit.bylh.top proxy');
}
