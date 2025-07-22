export class VO<T> {
    protected readonly _value: T;
    protected readonly _options: object = {};

    constructor(value: T, options?: object) {
        if (!(this as any).isValid(value)) {
            // Use 'this as any' or a more specific interface if isValid is truly polymorphic
            throw new Error(
                `Invalid value for ${this.constructor.name}: ${value}`,
            );
        }
        this._value = value;
        this._options = options || {};
    }

    public static create<
        U,
        C extends new (value: U, options?: object) => VO<U>,
    >(this: C, value: U, options?: object): InstanceType<C> {
        // new this(value) will now correctly instantiate the specific subclass
        // TypeScript can correctly infer that new this(value) returns InstanceType<C>
        return new (this as any)(value, options) as InstanceType<C>;
    }

    public isValid(value: T): boolean {
        // This method will be implemented by concrete subclasses.
        // The base class might have some default validation or throw an error
        // if it's meant to be abstract.
        console.warn(
            `isValid not implemented for ${this.constructor.name}. Assuming valid.`,
        );
        return true; // Default behavior, or throw an error for unhandled cases
    }

    public equals(other: VO<T>): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        if (!(other instanceof VO)) {
            // Basic type check
            return false;
        }
        // For general VO, deep equality might be complex. For simple T, === works.
        return this._value === other._value;
    }

    public toString(): string {
        return String(this._value);
    }

    public get value(): T {
        return this._value;
    }

    public get options() {
        return this._options;
    }
}
