


export class FileUploadService{
    constructor(){}

    private checkFolder(folderPath: string){
        throw new Error("Method not implemented.");
    }

    upLoadSingleFile(
        file: File,
        folder: string = 'uploads',
        validEstensions: string[]=['jpg', 'png', 'jpeg', 'gif'],
    ){

    }

    upLoadMultipleFile(
        file: File[],
        folder: string = 'uploads',
        validEstensions: string[]=['jpg', 'png', 'jpeg', 'gif'],
    ){}
}