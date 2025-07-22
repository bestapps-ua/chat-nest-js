import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../../user/entities/user.entity';

@Index('FK_41925910d336351d1a9a99c55dfc6cf7', ['ownerId'], {})
@Index('uid', ['uid'], { unique: true })
@Entity('room')
export class ChatRoomEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
    id: number;

    @Column('varchar', { name: 'uid', unique: true, length: 50 })
    uid: string;

    @Column('bigint', { name: 'owner_id', unsigned: true })
    ownerId: string;

    @Column('varchar', { name: 'name', nullable: true, length: 255 })
    name: string | null;

    @Column('varchar', { name: 'type', length: 50 })
    type: string;

    @Column('varchar', { name: 'status', length: 50 })
    status: string;

    @Column('int', { name: 'updated', nullable: true, unsigned: true })
    updated: number | null;

    @Column('int', { name: 'created', unsigned: true })
    created: number;

    @ManyToOne((type) => UserEntity)
    @JoinColumn([{ name: 'owner_id', referencedColumnName: 'id' }])
    owner: UserEntity;

    @BeforeInsert()
    setCreatedTimestamp() {
        this.created = Math.floor(Date.now() / 1000); // Set to current Unix timestamp in seconds
    }
}
