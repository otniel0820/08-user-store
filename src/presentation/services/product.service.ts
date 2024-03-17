import { ProductModel } from "../../data";
import {  CreateProductDto, CustomErrors, PaginationDTO, } from "../../domain";



export class ProductService {

    //DI
    constructor(){}

    async createProduct(createProductDto: CreateProductDto){

        const productExists = await ProductModel.findOne({name: createProductDto.name})
        if(productExists) throw CustomErrors.badRequest('Category already exists')

        try {
            const product = new ProductModel({
                ...createProductDto,
                
            })

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

                //todo: populate
            ])
            
            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/categories?page=${(page +1)}&limit=${limit}`,
                prev:(page -1 >0)?`/api/categories?page=${(page -1)}&limit=${limit}`: null,
                products: products
            }
            
        } catch (error) {
            throw CustomErrors.internalServer(`${error}`)
        }
    }

}