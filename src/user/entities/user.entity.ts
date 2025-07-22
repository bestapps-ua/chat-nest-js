import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChatRoomUserEntity } from '../../chat/chat-room-user/entities/chat-room-user.entity';

@Index("uid", ["uid"], { unique: true })
@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "uid", unique: true, length: 50 })
  uid: string;

  @Column("int", { name: "updated", nullable: true, unsigned: true })
  updated: number | null;

  @Column("int", { name: "created", unsigned: true })
  created: number;

  @OneToMany(() => ChatRoomUserEntity, (roomUser) => roomUser.user)
  roomUsers: ChatRoomUserEntity[];

  @BeforeInsert()
  setCreatedTimestamp() {
    this.created = Math.floor(Date.now() / 1000); // Set to current Unix timestamp in seconds
  }
}
