import { CategoryModel } from "../../data";
import { CreateCategoryDTO, CustomErrors, PaginationDTO, UserEntity } from "../../domain";



export class CategoryService {

    //DI
    constructor(){}

    async createCategory(createCategoryDto: CreateCategoryDTO, user: UserEntity){

        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name})
        if(categoryExists) throw CustomErrors.badRequest('Category already exists')

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })

            await category.save()

            return {
                id: category.id,
                name: category.name,
                available: category.availabe,
            }
        } catch (error) {
            throw CustomErrors.internalServer(`${error}`)
        }

    }

    async getCategories(paginationDto: PaginationDTO){

        

        const {page, limit} = paginationDto

        try {


            //con este codigo se hacen dos await  y puede hacer que nuestra aplicacion vaya mas lenta 

            // const total = await CategoryModel.countDocuments()
            // const categories = await CategoryModel.find()
            // .skip((page -1 ) * limit)
            // .limit(limit)
            
            //Por eso aca hacemos una desestructuracion de un Promise all para que se ejecuten todas las promesas por igual

            const [total, categories]  = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                .skip((page -1 ) * limit)
                .limit(limit)
            ])
            
            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/categories?page=${(page +1)}&limit=${limit}`,
                prev:(page -1 >0)?`/api/categories?page=${(page -1)}&limit=${limit}`: null,
                categories: categories.map((category)=> ({
                    id : category.id , 
                    name : category.name, 
                    availabel: category.availabe
                    }))
            }
            
        } catch (error) {
            throw CustomErrors.internalServer(`${error}`)
        }
    }

}