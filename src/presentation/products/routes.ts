import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controller';






export class ProductsRoutes {


  static get routes(): Router {

    const router = Router();

    const controller = new ProductController();
    
    
    
    // Definir las rutas
    router.get('/', controller.getProducts);
    router.post('/', [AuthMiddleware.validateJWT], controller.createProduct);



    return router;
  }


}
