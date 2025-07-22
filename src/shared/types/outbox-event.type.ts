export type OutboxEventType = {
    uid: string,
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    payload: object,
    status: string,
};

export enum OutboxEventStatusType {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed'
}
