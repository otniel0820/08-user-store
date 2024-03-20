import { ProductModel } from "../../data";
import {  CreateProductDto, CustomErrors, PaginationDTO, } from "../../domain";



export class ProductService {

    //DI
    constructor(){}

    async createProduct(createProductDto: CreateProductDto){

        const productExists = await ProductModel.findOne({name: createProductDto.name})
        if(productExists) throw CustomErrors.badRequest('Product already exists')

        try {
            const product = new ProductModel(createProductDto)

            await product.save()

            return product
        } catch (error) {
            throw CustomErrors.internalServer(`${error}`)
        }

    }

    async getProducts(paginationDto: PaginationDTO){

        

        const {page, limit} = paginationDto

        try {

            const [total, products]  = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                .skip((page -1 ) * limit)
                .limit(limit)
                .populate('user')// el populate se usa para hacer la relacion entre tablas y poderlo mostrar en el toJSON en este caso estamos haciendo la relacion con el usuario y por ende se muestra todo lo relacionado al usuario, si le colocamos una coma y un segundo string podemos mostrar lo que nosotros queramos por ejemplo name email si lo hacemos asi en el toJSON del usuario solo se mostrara el name y el email
                .populate('category')
                
            ])
            
            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/products?page=${(page +1)}&limit=${limit}`,
                prev:(page -1 >0)?`/api/products?page=${(page -1)}&limit=${limit}`: null,
                products: products
            }
            
        } catch (error) {
            throw CustomErrors.internalServer(`${error}`)
        }
    }

}