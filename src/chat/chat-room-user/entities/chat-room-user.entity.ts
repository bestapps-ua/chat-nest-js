import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoomEntity } from "../../chat-room/entities/chat-room.entity";
import { UserEntity } from "../../../user/entities/user.entity";

@Index("FK_a47d719acef705470c6091e8793ee017", ["userId"], {})
@Index("room_id", ["roomId", "userId"], { unique: true })
@Index("uid", ["uid"], { unique: true })
@Entity("room_user")
export class ChatRoomUserEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "uid", unique: true, length: 50 })
  uid: string;

  @Column("bigint", { name: "room_id", unsigned: true })
  roomId: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: string;

  @Column("varchar", { name: "status", length: 50 })
  status: string;

  @Column("int", { name: "updated", nullable: true, unsigned: true })
  updated: number | null;

  @Column("int", { name: "created", unsigned: true })
  created: number;

  @JoinColumn([{ name: "room_id", referencedColumnName: "id" }])
  room: ChatRoomEntity;

  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: UserEntity;

  @BeforeInsert()
  setCreatedTimestamp() {
    this.created = Math.floor(Date.now() / 1000); // Set to current Unix timestamp in seconds
  }
}
