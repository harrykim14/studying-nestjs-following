import { IsNotEmpty } from 'class-validator';

// 클래스는 인터페이스와는 다르게 런타임에서 작동하기 때문에 파이프같은 기능을 이용할 때 더 유용
export class CreateBoardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
