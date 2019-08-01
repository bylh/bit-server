import express from 'express';
const router = express.Router();

router.get('/rbac_api/v1/users/mine', (req, res) => {
  res.status(200).json({
    "code": 0,
    "msg": "OK",
    "data": {
        "name": "李欢",
        "school_id": 384103,
        "phone": "286000000016.0",
        "roles": [
            {
                "id": "5b29f90c293336b0b4755c25",
                "label": "高中-数学-管理员"
            },
            {
                "id": "5bbf68fb8b2fb7a9651d2b4b",
                "label": "高中-数学-学科负责人"
            },
            {
                "id": "5b2a0a7ec00cda348190b4a8",
                "label": "高中-数学-责任编辑"
            }
        ],
        "current_role": "高中-数学-管理员",
        "id": 286000000016,
        "g_user_id": "5ce5224b8bcc8a32bcaffc13",
        "role_tag_name": "admin",
        "pages": {},
        "school_name": "爱云校开发"
    }
  });
});

export default router;