import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
} from 'typeorm';

@Entity('outbox_event')
export class OutboxEventEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
    id: string;

    @Column("varchar", { name: "uid", unique: true, length: 50 })
    uid: string;

    @Column('varchar', { name: 'aggregate_type', length: 255 })
    aggregateType: string;

    @Column('varchar', { name: 'aggregate_id', length: 255 })
    aggregateId: string;

    @Column('varchar', { name: 'event_type', length: 255 })
    eventType: string;

    @Column('json', { name: 'payload', nullable: true })
    payload: any;

    @Column('varchar', { default: 'PENDING', length: 255 })
    status: string;

    @Column('int', { name: 'created' })
    created: number | null;

    @Column('int', { name: 'updated', nullable: true })
    updated: number | null;

    @Column('int', { name: 'processed', nullable: true })
    processed: number | null;

    @Column('tinyint', { name: 'retries', default: 0 })
    retries: number = 0;

    @Column('json', { nullable: true })
    error: string;

    @BeforeInsert()
    setCreatedTimestamp() {
        this.created = Math.floor(Date.now() / 1000); // Set to current Unix timestamp in seconds
    }
}
