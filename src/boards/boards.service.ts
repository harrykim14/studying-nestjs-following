import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
// import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable() // 다른 컴포넌트에서 이 서비스를 사용할 수 있게 됨
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ) {}

    createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto, user);
    }

    async getAllBoards(user: User): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');
        query.where('board.userId = :userId', { userId: user.id });
        const boards = await query.getMany();
        return boards;
    }

    async getBoardById(id: number): Promise<Board> {
        const foundBoard = await this.boardRepository.findOne(id);

        if(!foundBoard) {
            throw new NotFoundException(`Cannot find Board with id ${id}`);
        }

        return foundBoard;
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const foundBoard = await this.getBoardById(id);
        foundBoard.status = status;
        await this.boardRepository.save(foundBoard);
        return foundBoard;
    }

    async deleteBoard(id: number, user: User): Promise<void> {
        const { affected } = await this.boardRepository.delete({id, user});
        if (affected === 0) {
            throw new NotFoundException(`Cannot find Board with id ${id}`);
        }
    }

    // private boards: Board[] = [];
    
    // getAllBoards(): Board[] {
    //     return this.boards;
    // }
    
    // createBoard(createBoardDto: CreateBoardDto) {
    //     const { title, description } = createBoardDto; 
    //     const board: Board = {
    //         // id는 유니크해야한다
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }
    //     this.boards.push(board);
    //     return board;
    // }

    // getBoardById(id: string): Board {
    //     const foundBoard = this.boards.find((board) => board.id === id);

    //     if (!foundBoard) {
    //         // nestjs에 이미 만들어져 있는 exception
    //         throw new NotFoundException(`Cannot find Board with id: ${id}`); 
    //     }

    //     return foundBoard
    // }

    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

    // deleteBoardById(id: string): void {
    //     // 이미 getBoardById 메서드에 exception을 정의해놓았기 때문에 여기서는 처리할 필요가 없다
    //     const findToDelete = this.getBoardById(id);        
    //     this.boards = this.boards.filter((board) => board.id !== findToDelete.id);
    // }
    
}
