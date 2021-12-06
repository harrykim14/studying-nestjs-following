import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

// 클래스를 커스텀 저장소로 선언하는데 사용하는 데코레이터
@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  // 이 엔티티 리포지토리 내에서 Find, Insert, Delete 같은 컨트롤이 가능

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    // extends Repository로 상속받았기 때문에 this.create와 같이 사용 가능
    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });

    // 사용중인 데이터베이스(리포지토리)에 저장할때, save 메서드를 사용한다
    await this.save(board);
    return board;
  }
}
