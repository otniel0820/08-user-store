import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, // solo necesitamos el id del iusuario
    public readonly category: string // solo necesitamos el id de la category
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = object;

    console.log('user',user);
    console.log('category', category);
    
    
    

    if (!name) return ["Missing Name"];
    if (!user) return ["Missing User"];
    // if (Validators.isMongoId(user)) return ["Invalid User Id"];
    if (!category) return ["Missing category"];
    // if (Validators.isMongoId(category)) return ["Invalid Category Id"];

    return [
      undefined,
      new CreateProductDto(
        name,
        !!available, // si viene un string sera true sino sera falso por eso se le coloca la doble negacion
        price,
        description,
        user,
        category
      ),
    ]; // undefined porque no hay error, y el objeto de la clase CreateProductDto que contiene todos los datos necesarios para crear un producto.
  }
}
