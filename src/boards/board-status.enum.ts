/*
    Interface : 변수의 타입만을 체크
    classes : 변수의 타입을 체크하고 인스턴스 생성 가능
*/

// 엔티티에서 새로 정의했으므로 이 코드는 더이상 사용하지 않음
// export interface Board {
//     id: string;
//     title: string;
//     description: string;
//     status: BoardStatus;
// }

// 열거형(enumeration)
export enum BoardStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
