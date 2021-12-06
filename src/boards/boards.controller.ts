import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  /*
        boardsService: BoardService;
        constructor(boardService: BoardsService) {
            this.boardsService = boardService
        }

        타입스크립트가 제공하는 접근제한자 private를 사용한다면 한줄로 줄일 수 있다
    */
  private logger = new Logger('BoardContoller');
  constructor(private boardService: BoardsService) {}

  /*
        클라이언트에서 요청을 보내면 컨트롤러로 가서 요청에 맞게 라우팅을 해 해당 핸들러로 가게 해 줌
        요청 처리는 서비스로 들어가서 해당 요청에 맞는 로직을 서비스에서 처리하고 컨트롤러로 리턴
        컨트롤러는 요청과 결과값을 보여주기만 하고 로직 처리는 전부 서비스가 일임
    */

  @Get()
  getAllBoards(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`);
    return this.boardService.getAllBoards(user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardService.getBoardById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `USer ${user.username} created a new board. Payload: ${JSON.stringify(
        createBoardDto,
      )}`,
    );
    return this.boardService.createBoard(createBoardDto, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    // 파라미터 레벨의 pipe 사용법
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardService.updateBoardStatus(id, status);
  }

  @Delete('/:id')
  deleteBoard(
    // ParseIntPipe를 사용하면 파라미터 레벨에서 값을 처리할 수 있다
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.boardService.deleteBoard(id, user);
  }

  // 데이터베이스 연동을 위해 주석처리
  //     @Get('/')
  //     getAllBoard(): Board[] { // 타입 정의는 의무가 아니지만 코드를 읽기 쉽게 해 준다
  //        return this.boardService.getAllBoards();
  //     }

  //     @Get('/:id')
  //     getBoardById(@Param('id') id: string) {
  //         return this.boardService.getBoardById(id);
  //     }

  //     @Post()
  //     @UsePipes(ValidationPipe)
  //     /*
  //     UsePipes를 사용한 Validation check를 활성화하면 빈 값을 보내면
  //     bad request로 status code 400을 리턴한다
  //     {
  //     "statusCode": 400,
  //     "message": [
  //         "title should not be empty",
  //         "description should not be empty"
  //     ],
  //     "error": "Bad Request"
  // }
  //     */
  //     createBoard(
  //         // @Body('title') title: string,
  //         // @Body('description') description: string
  //         // -> dto를 사용하는 방식으로 변경
  //         @Body() createBoardDto: CreateBoardDto
  //     ) {
  //         return this.boardService.createBoard(createBoardDto);
  //     }

  //     @Patch('/:id/status')
  //     updateBoardStatus(
  //         @Param('id') id: string,
  //         // 파라미터 레벨의 pipe 사용법
  //         @Body('status', BoardStatusValidationPipe) status: BoardStatus
  //     ) {
  //         return this.boardService.updateBoardStatus(id, status);
  //     }

  //     @Delete('/:id')
  //     deleteBoard(@Param('id') id: string): void {
  //         this.boardService.deleteBoardById(id);
  //     }
}
