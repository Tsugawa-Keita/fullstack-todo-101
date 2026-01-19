import { Transform } from "class-transformer"
import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateTodoDto {
    @ApiProperty({ example: "Buy milk", description: "Todo text" })
    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    text: string
}

export class UpdateTodoDto {
    @ApiProperty({ example: "Buy oat milk", description: "Todo text" })
    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    text: string
}
