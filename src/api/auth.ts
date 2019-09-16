
const webpush = require('web-push');
import express from 'express';
import { Defer } from '../common/common';
import DBHelper, { WebPushInfo, userModel } from '../common/db-helper';
import Config from '../../extra/bit/config';
import { Payload, PayloadTest } from '../define/webpush';

export async function checkSession(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session.userId == null) {
        res.sendStatus(401);
        return;
    }
    next(); // 权限验证成功
}
export async function signUp(req: express.Request, res: express.Response) {
    try {
        console.log('开始注册', req.body);
        let result = await DBHelper.getOne('user', { userId: req.body.userId });
        if (result != null) {
            console.log('用户已经存在');
            res.sendStatus(409);
            return;
        }
        await DBHelper.update('user', req.body, { userId: req.body.userId })
        console.log('注册成功');
        res.sendStatus(200);
    } catch (err) {
        console.log('注册失败');
        res.sendStatus(500);
    }
}

export async function login(req: express.Request, res: express.Response) {
    try {
        console.log('开始登录', req.body);
        let result = await DBHelper.getOne('user', { userId: req.body.userId, pwd: req.body.pwd });
        if (result != null) {
            console.log('登录成功前', req.session, req.sessionID);
            req.session.userId = req.body.userId;  //设置session
            console.log('登录成功后', req.session, req.sessionID);
            res.sendStatus(200);
            return;
        } else {
            console.log('找不到用户');
            res.sendStatus(404);
            return;
        }

    } catch (err) {
        console.log('登录失败');
        res.sendStatus(500);
    }
}

export async function resetPwd(req: express.Request, res: express.Response) {
    
    try {
        console.log('开始重置密码', req.body);
        if (req.session.userId == null) {
            res.sendStatus(401);
            console.log('未登录不能重置密码');
            return;
        }
        let defer = new Defer<boolean>();
        userModel.findOne({ userId: req.session.userId }, (err, res) => {
            console.log('getOne(): res:', res, 'err', err, (res as any).pwd);
            defer.resolve((res as any).pwd === req.body.orgPwd);
        });
        let match = await defer.promise;
        if (!match) {
            console.log('原密码输入错误');
            res.sendStatus(402);
            return;
        }
        await userModel.update({ userId: req.session.userId }, { pwd: req.body.newPwd });
        console.log('重置成功');
        res.sendStatus(200);
        return;
    } catch (err) {
        console.log('重置失败');
        res.sendStatus(500);
    }
}

export async function uploadBgImg(req: express.Request, res: express.Response) {
    try {
        console.log('开始上传', req.body, req.file);
        let file = req.file;

        console.log('文件类型：%s', file.mimetype);
        console.log('原始文件名：%s', file.originalname);
        console.log('文件大小：%s', file.size);
        console.log('文件保存路径：%s', file.path);
        await DBHelper.update('profile', { $set: { 'info.bgUrl': file.filename  } }, { userId: req.session.userId });
        console.log('上传成功');

        res.sendStatus(200);
    } catch (err) {
        console.log('失败');
        res.sendStatus(500);
    }
}
export async function uploadAvatarImg(req: express.Request, res: express.Response) {
    try {
        console.log('开始上传', req.body, req.file);
        let file = req.file;

        console.log('文件类型：%s', file.mimetype);
        console.log('原始文件名：%s', file.originalname);
        console.log('文件大小：%s', file.size);
        console.log('文件保存路径：%s', file.path);
        await DBHelper.update('profile', { $set: { 'info.avatarUrl': file.filename } }, { userId: req.session.userId });
        console.log('上传成功');
        res.sendStatus(200);
    } catch (err) {
        console.log('失败');
        res.sendStatus(500);
    }
}

export async function getProfile(req: express.Request, res: express.Response) {
    try {
        console.log('获取个人资料开始', req.query);
        let profile = await DBHelper.getOne('user', { userId: req.query.userId });
        if (profile) {
            console.log('获取个人资料成功');
            res.status(200).json((profile as any).info);
            return;
        } else {
            console.log('找不到用户');
            res.sendStatus(404);
            return;
        }

    } catch (err) {
        console.log('获取个人资料失败');
        res.sendStatus(500);
    }
}

export async function updateProfile(req: express.Request, res: express.Response) {
    try {
        console.log('更新个人资料开始', req.body);
        let profile = await DBHelper.update('profile', {$set: { 'info': req.body.info }}, { userId: req.body.userId });
        if (profile) {
            console.log('更新个人资料成功', profile);
            res.sendStatus(200);
            return;
        } else {
            console.log('找不到用户');
            res.sendStatus(404);
            return;
        }

    } catch (err) {
        console.log('更新个人资料失败');
        res.sendStatus(500);
    }
}



// 订阅相关
export async function subscribe(req: express.Request, res: express.Response) {
    let query = req.query;
    console.log('收到', query.pushSubscription, query.userId);
    let document = await DBHelper.getOne('webpush', { pushSubscription: query.pushSubscription });
    if (document != null) {
        console.log('用户已经订阅过了');
        res.status(200).json(req.query);
        return;
    }
    // 说明此设备有新的订阅需求，或者第一次订阅
    await DBHelper.set('webpush', {
        userId: query.userId,
        pushSubscription: query.pushSubscription
    } as WebPushInfo);
    sendNotification(query.pushSubscription, Payload)
    res.status(200).json(req.query);
}

export function sendNotification(pushSubscription: string, payload: any) {
    webpush.setGCMAPIKey(Config.Push.GcmApiKey);
    webpush.setVapidDetails(Config.Push.Subject, Config.Push.PublicKey, Config.Push.PrivateKey);
    webpush.sendNotification(JSON.parse(pushSubscription), JSON.stringify(payload)).then((suc: any) => console.log('成功', suc)).catch((err: any) => console.log('失败', err));
}

export async function sendNotificationToUsers(req: express.Request, res: express.Response) {
    let subs = await DBHelper.getAll('webpush', { userId: req.session.userId });
    console.log('所有订阅', subs);
    for (let sub of subs) {
        sendNotification((sub as any).pushSubscription, PayloadTest)
    }
    res.status(200).json(PayloadTest);
}