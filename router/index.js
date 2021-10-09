import express from "express";
import { employController, departmentController, loginController } from "../controllers";
import { handleMultipartData } from "../controllers/employController";

const router = express.Router();
router.post('/login',loginController.login);


router.get('/employs',employController.getEmploy);
router.post('/employ',handleMultipartData,employController.register);
router.put('/employ',handleMultipartData,employController.update);
router.delete('/employ',employController.remove);
router.get('/employ/:id',employController.getOne);
router.get('/employ',employController.getList);
router.get('/employpos',employController.getEmployPostion);
router.get('/employs/status/:status',employController.getStatus);
router.get('/employs/total',employController.getTotal);


router.get('/employee/status/:status',employController.getStatusData);


router.get('/department',departmentController.getList);
router.post('/department',departmentController.addList);
router.put('/department',departmentController.updateList);
router.get('/department/total',departmentController.getTotal);
router.delete('/department/:_id',departmentController.deleteList);











// router.use('/', (req, res) => {
//     res.send(`
//   <h1>Welcome to emploies</h1>
//   `);
// });




export default router;