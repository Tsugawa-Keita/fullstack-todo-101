import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateTodoDto {
    @ApiProperty({ example: "Buy milk", description: "Todo text" })
    @IsString()
    @IsNotEmpty()
    text: string
}

export class UpdateTodoDto {
    @ApiProperty({ example: "Buy oat milk", description: "Todo text" })
    @IsString()
    @IsNotEmpty()
    text: string
}
