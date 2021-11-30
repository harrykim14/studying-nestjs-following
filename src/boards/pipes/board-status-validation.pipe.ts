import { BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board-status.enum";

export class BoardStatusValidationPipe implements PipeTransform {

    readonly StatusOptions = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC,
    ]

    transform(value: any) {
        const inputStatus = value.toUpperCase();
        if(!this.isStatusValid(inputStatus)) {
            throw new BadRequestException(`${inputStatus} is not changable status option.`)
        }
        return value;
    }

    private isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1;
    }
}