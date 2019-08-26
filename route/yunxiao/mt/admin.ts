import express from 'express';
const router = express.Router();
let current_role = '高中-数学-责任编辑' // '高中-数学-学科负责人'
router.get('/rbac_api/v2/mine', (req, res) => {
    console.log('获取用户信息');
  res.status(200).json({
    "code": 0,
    "msg": "OK",
    "data": {
        "name": "程爽",
        "school_id": 384103,
        "phone": "286000000016.0",
        "roles": [
            {
                "id": "5bbf68fb8b2fb7a9651d2b4b",
                "label": "高中-数学-学科负责人"
            },
            {
                "id": "5b2a0a7ec00cda348190b4a8",
                "label": "高中-数学-责任编辑"
            }
        ],
        "current_role": current_role,
        "id": 286000000016,
        "g_user_id": "5ce5224b8bcc8a32bcaffc13",
        "role_tag_name": "admin",
        "pages": {},
        "school_name": "爱云校开发"
    }
  });
});


router.put('/rbac_api/v2/mine', (req, res) => {
    console.log('切换用户信息', req.body);
    current_role = req.body.current_role;
  res.status(200).json({
    "code": 0,
    "msg": "OK",
    "data": {
        "name": "程爽",
        "school_id": 384103,
        "phone": "286000000016.0",
        "roles": [
            {
                "id": "5bbf68fb8b2fb7a9651d2b4b",
                "label": "高中-数学-学科负责人"
            },
            {
                "id": "5b2a0a7ec00cda348190b4a8",
                "label": "高中-数学-责任编辑"
            }
        ],
        "current_role": req.body.current_role,
        "id": 286000000016,
        "g_user_id": "5ce5224b8bcc8a32bcaffc13",
        "role_tag_name": "admin",
        "pages": {},
        "school_name": "爱云校开发"
    }
  });
});


export default router;