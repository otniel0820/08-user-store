import { CategoryModel } from "../../data";
import { CreateCategoryDTO, CustomErrors, UserEntity } from "../../domain";



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

    async getCategories(){

        try {

            const categories = await CategoryModel.find()
            
            return categories.map((item)=> ({
                   id : item.id , 
                   name : item.name, 
                   availabel: item.availabe
                   }))
            
        } catch (error) {
            throw CustomErrors.internalServer(`${error}`)
        }
    }

}