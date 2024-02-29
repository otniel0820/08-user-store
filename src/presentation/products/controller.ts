import { Request, Response } from "express";
import { CreateCategoryDTO, CustomErrors, PaginationDTO } from "../../domain";
import { CategoryService } from "../services/category.service";

export class ProductController {
  constructor(
    //private readonly productService: ProductService
    ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomErrors) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);

    return res.status(500).json({ error: "Internal server error" });
  };

  createProduct = async (req: Request, res: Response) => {
    // const [error, createCategoryDto] = CreateCategoryDTO.create(req.body);
    // if (error) return res.status(400).json({ error });

    // this.categoryService
    //   .createCategory(createCategoryDto!, req.body.user)
    //   .then((category) => res.status(201).json(category))
    //   .catch((error) => this.handleError(error, res));

    return res.json('Create Product')
  };
  
  getProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDTO.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    return res.json('Get Products')

    // this.categoryService
    //   .getCategories(paginationDto!)
    //   .then((categories) => res.status(200).json(categories))
    //   .catch((error) => this.handleError(error, res));
  };
}
